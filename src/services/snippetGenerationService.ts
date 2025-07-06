import * as vscode from 'vscode';
import { AtCoderApiService } from './atcoderApiService';
import { InputParserService } from './inputParserService';
import { CodeGeneratorService } from './jsonParserService';
import * as path from 'path';
import * as cheerio from 'cheerio'; // cheerioをインポート

export class SnippetGenerationService {
    constructor(
        private atcoderApiService: AtCoderApiService,
        private inputParserService: InputParserService,
        private codeGeneratorService: CodeGeneratorService,
        private problemDataService: ProblemDataService
    ) {}

    // ProblemViewServiceの_getFixedHtmlForWebviewからHTML修正ロジックをコピー
    private _getFixedHtmlForSnippetGeneration(rawHtml: string): string {
        const $ = cheerio.load(rawHtml);
        const baseUrl = 'https://atcoder.jp';

        // 1. すべての相対パスを絶対パスに変換
        $('link[href], script[src], img[src], a[href]').each((_, el) => {
            const el$ = $(el);
            const attr = el$.is('link, a') ? 'href' : 'src';
            const url = el$.attr(attr);
            if (url && url.startsWith('/')) { el$.attr(attr, baseUrl + url); }
        });

        // 2. 不要なモーダルダイアログとヘッダー/フッターを削除 (display: none !important を使用)
        $('#modal-contest-start, #modal-contest-end').remove();
        // CSSインジェクションで対応するため、ここではセレクタを定義するだけ
        // $('body').prepend('<style>#vue-fixed-header, .navbar, .footer, #contest-nav-tabs, #language-selector, a[href="#"], small.text-muted { display: none !important; }</style>');

        // 3. 日本語と英語の間に区切り線を追加 (必要であれば)
        const japaneseStatement = $('.lang-ja');
        if (japaneseStatement.length > 0) {
            const separator = '<hr class="problem-separator">';
            japaneseStatement.after(separator);
        }

        // 4. <var>タグの中身をMathJaxで処理できるように変換
        $('var').each((_, el) => {
            const el$ = $(el);
            const text = el$.text().trim();
            el$.replaceWith(`\\(${text}\\\)`); // MathJaxのインライン数式デリミタ
        });

        // 5. <pre>タグをスタイル付きの<div>に置換 (MathJaxが<pre>を無視するため)
        $('pre').each((_, preElement) => {
            const pre$ = $(preElement);
            const content = pre$.html() || '';
            const replacementDiv = $('<div class="pre-replacement"></div>').html(content);
            pre$.replaceWith(replacementDiv);
        });

        // MathJaxのスクリプトとカスタムスタイルは、ここでは不要なので追加しない
        // ProblemViewServiceのWebView側で追加されるため

        return $.html();
    }

    public async generateAndCopy(uri: vscode.Uri): Promise<void> {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage('アクティブなエディタがありません。スニペットを生成するファイルを開いてください。');
            return;
        }

        const problemId = this.problemDataService.getProblemIdFromUri(uri);
        if (!problemId) {
            vscode.window.showWarningMessage('Could not determine problem ID from file path.');
            return;
        }

        const contestId = problemId.split('_')[0];

        const rawHtml = await this.atcoderApiService.getOrFetchProblemHtml(contestId, problemId, uri.fsPath);

        // 修正済みHTMLからサンプルケースを取得するように変更
        const sampleCases = await this.atcoderApiService.getSampleCases(fixedHtml);
        if (!sampleCases || sampleCases.length === 0) {
            vscode.window.showWarningMessage('No sample cases found. Snippet generation may be inaccurate.');
            const config = vscode.workspace.getConfiguration('atcoder-utility');
            const snippet = this.codeGeneratorService.generateSnippet(inputBlocks, config, editor.document.languageId);
            await vscode.env.clipboard.writeText(snippet);
            vscode.window.showInformationMessage('Snippet generated (without type inference) and copied to clipboard!');
            return;
        }

        const sampleInput = sampleCases[0].input;

        const finalInferredBlocks = this.inputParserService.inferDataTypes(
            inputBlocks,
            sampleInput,
            globalVars,
            queryDefinitions
        );

        const config = vscode.workspace.getConfiguration('atcoder-utility');
        const snippet = this.codeGeneratorService.generateSnippet(finalInferredBlocks, config, editor.document.languageId);

        await vscode.env.clipboard.writeText(snippet);
        vscode.window.showInformationMessage('Snippet generated and copied to clipboard!');
    }
}