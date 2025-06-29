import * as vscode from 'vscode';
import * as cheerio from 'cheerio';
import { AtCoderApiService } from './atcoderApiService';
import * as path from 'path';

export class ProblemViewService {
    public static currentPanel: vscode.WebviewPanel | undefined;
    public static readonly viewType = 'atcoderProblemView';
    
    constructor(
        private context: vscode.ExtensionContext,
        private apiService: AtCoderApiService
    ) {
        this.registerAutoOpenListener();
    }

    private registerAutoOpenListener() {
        this.context.subscriptions.push(
            vscode.workspace.onDidOpenTextDocument(async (document) => {
                const config = vscode.workspace.getConfiguration('atcoder-utility');
                if (!config.get<boolean>('autoOpenProblemView')) return;
                if (document.uri.scheme !== 'file') return;

                if (this.isProblemFile(document.uri.fsPath)) {
                    setTimeout(() => {
                        if (vscode.window.activeTextEditor?.document === document) {
                            this.showProblemView(true);
                        }
                    }, 100);
                }
            })
        );
    }
    
    private isProblemFile(filePath: string): boolean {
        const parts = filePath.split(path.sep);
        for (let i = parts.length - 2; i >= 0; i--) {
            if (parts[i].match(/^(abc|arc|agc|ahc|adt|adt_intro|tessoku|practice|typical90|dp|abs)\d*$/i)) {
                return true;
            }
        }
        return false;
    }
    
    public async showProblemView(preserveFocus: boolean = false) {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return vscode.window.showErrorMessage('Please open a problem file first.');

        const uri = editor.document.uri; 
        if (!this.isProblemFile(uri.fsPath)) return;
        
        const problemDir = path.dirname(uri.fsPath);
        const contestId = path.basename(path.dirname(problemDir)).toLowerCase();
        const taskLetter = path.basename(problemDir).toLowerCase();
        const taskId = `${contestId}_${taskLetter}`;
        const problemUrl = `https://atcoder.jp/contests/${contestId}/tasks/${taskId}`;
        const column = vscode.window.activeTextEditor ? vscode.ViewColumn.Beside : vscode.ViewColumn.One;

        try {
            // 既にパネルが開いている場合はdisposeして新しいものを開く (WebViewのJS再実行のため)
            if (ProblemViewService.currentPanel) {
                ProblemViewService.currentPanel.dispose();
            }

            const panel = vscode.window.createWebviewPanel(
                ProblemViewService.viewType, 
                `Problem: ${taskLetter.toUpperCase()}`,
                { viewColumn: column, preserveFocus: preserveFocus },
                { enableScripts: true }
            );
            ProblemViewService.currentPanel = panel;

            panel.onDidDispose(() => {
                ProblemViewService.currentPanel = undefined;
            }, null, this.context.subscriptions);
            
            // HTML取得はAtCoderApiServiceに集約
            const rawHtml = await this.apiService.getOrFetchProblemHtml(uri); // uriを直接渡す
            if (!rawHtml) { // HTML取得失敗時はエラーメッセージが既に出ている
                panel.dispose(); // パネルを閉じる
                return;
            }

            panel.webview.html = this._getFixedHtmlForWebview(rawHtml, panel.webview);

        } catch (error) {
            if (ProblemViewService.currentPanel) {
                ProblemViewService.currentPanel.dispose();
            }
            console.error(error);
        }
    }

    /**
     * AtCoderの生のHTMLを受け取り、WebView内で完璧に表示されるように修正を加える。
     * @param rawHtml AtCoderから取得した生のHTML文字列
     * @param webview VS CodeのWebViewインスタンス (CSP生成のため)
     * @returns 修正済みのHTML文字列
     */
    private _getFixedHtmlForWebview(rawHtml: string, webview: vscode.Webview): string {
        const $ = cheerio.load(rawHtml);
        const baseUrl = 'https://atcoder.jp';

        // 1. すべての相対パスを絶対パスに変換
        $('link[href], script[src], img[src], a[href]').each((_, el) => {
            const el$ = $(el);
            const attr = el$.is('link, a') ? 'href' : 'src';
            const url = el$.attr(attr);
            if (url && url.startsWith('/')) { el$.attr(attr, baseUrl + url); }
        });

        // 2. 不要なモーダルダイアログとヘッダー/フッターを削除
        $('#modal-contest-start, #modal-contest-end').remove();
        // display: none !important を使うことで、Vue.jsによって生成されるものも含む
        // ただし、これはCSSインジェクションで行うため、ここではセレクタを定義するだけ
        // $('body').prepend('<style>#vue-fixed-header, .navbar, .footer, #contest-nav-tabs, #language-selector, a[href="#"], small.text-muted { display: none !important; }</style>');

        // 3. 日本語と英語の間に区切り線を追加
        const japaneseStatement = $('.lang-ja');
        if (japaneseStatement.length > 0) {
            const separator = '<hr class="problem-separator">';
            japaneseStatement.after(separator);
        }

        // 4. <var>タグの中身をMathJaxで処理できるように変換
        $('var').each((_, el) => {
            const el$ = $(el);
            const text = el$.text().trim();
            // MathJaxのインライン数式デリミタ `\(` と `\)` で囲む
            el$.replaceWith(`\\(${text}\\)`);
        });

        // 5. <pre>タグをスタイル付きの<div>に置換 (MathJaxが<pre>を無視するため)
        $('pre').each((_, preElement) => {
            const pre$ = $(preElement);
            // HTMLコンテンツを保持したまま置換
            const content = pre$.html() || '';
            const replacementDiv = $('<div class="pre-replacement"></div>').html(content);
            pre$.replaceWith(replacementDiv);
        });

        // 6. CSP (Content Security Policy) とテーマ互換CSSを注入
        const cspMeta = `
            <meta http-equiv="Content-Security-Policy" content="
                default-src 'none';
                script-src 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com;
                style-src 'unsafe-inline' https://atcoder.jp;
                img-src 'self' https://atcoder.jp https://assets.atcoder.jp data:;
                font-src 'self' data:;
                connect-src 'self' https://atcoder.jp;
            ">
        `;
        // MathJaxの設定と読み込み
        const mathjaxScript = `
            <script>
                window.MathJax = {
                    tex: {
                        inlineMath: [['\\\\(','\\\\)'], ['$$','$$']], // MathJaxが処理するデリミタを定義
                        displayMath: [['\\\\[','\\\\]']],
                        processEscapes: true,
                        processEnvironments: true
                    },
                    options: {
                        ignoreHtmlClass: 'tex2jax_ignore', // このクラスの要素は無視
                        processHtmlClass: 'tex2jax_process' // このクラスの要素を処理
                    },
                    loader: { load: ['[tex]/ams'] }, // ams拡張をロード
                    startup: {
                        ready: () => {
                            MathJax.startup.defaultReady();
                            console.log('MathJax is ready.');
                        }
                    }
                };
            </script>
            <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"></script>
        `;

        // テーマ互換CSSと.pre-replacementのスタイル
        const customStyles = `
            <style>
                body {
                    background-color: var(--vscode-editor-background) !important;
                    color: var(--vscode-editor-foreground) !important;
                    padding: 1rem;
                }
                /* ヘッダーやフッター、不要な要素をまとめて非表示にする */
                #vue-fixed-header, .navbar, .footer, #contest-nav-tabs, #language-selector, a[href="#"], small.text-muted {
                    display: none !important;
                }
                /* 区切り線のスタイル */
                .problem-separator {
                    margin: 2rem 0; border: 0; border-top: 2px dashed var(--vscode-editor-widget-border);
                }
                /* <pre>の見た目を再現するためのスタイル */
                .pre-replacement {
                    font-family: var(--vscode-editor-font-family);
                    background: var(--vscode-input-background);
                    padding: 1em;
                    margin: 0.5em 0;
                    overflow: auto;
                    white-space: pre-wrap;
                    word-wrap: break-word;
                    border: 1px solid var(--vscode-editor-widget-border);
                    border-radius: 4px;
                }
            </style>
        `;

        // <head>タグの最後に注入
        $('head').append(cspMeta, customStyles, mathjaxScript);
        
        return $.html();
    }
}