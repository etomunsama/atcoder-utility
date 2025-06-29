import * as vscode from 'vscode';
import { ContestSetupService } from '../services/contestSetupService';
import { BundleService } from '../services/bundleService';
import { SnippetGenerationService } from '../services/snippetGenerationService'; // Add this import

export class ContestActionViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'atcoder-utility-contest-action-view';
    private _view?: vscode.WebviewView;

    // 依存するサービスをコンストラクタで受け取る
    constructor(
        private readonly _extensionUri: vscode.Uri,
        private contestSetupService: ContestSetupService,
        private bundleService: BundleService,
        private snippetGenerationService: SnippetGenerationService // Add this
    ) {}

    public resolveWebviewView(webviewView: vscode.WebviewView) {
        this._view = webviewView;
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };
        webviewView.webview.html = this._getHtmlForWebview();

        // WebViewからのメッセージを処理
        webviewView.webview.onDidReceiveMessage(async data => {
            switch (data.command) {
                case 'setupContest': {
                    const contestId = data.contestId;
                    if (!contestId) {
                        vscode.window.showErrorMessage('コンテストIDを入力してください。');
                        return;
                    }
                    const parentDir = await vscode.window.showOpenDialog({
                        canSelectFiles: false,
                        canSelectFolders: true,
                        canSelectMany: false,
                        openLabel: 'ここにコンテストフォルダを作成'
                    });
                    if (!parentDir || parentDir.length === 0) { return; }
                    
                    // ContestSetupServiceを呼び出し
                    await this.contestSetupService.setupContest(contestId, parentDir[0]);
                    break;
                }
                case 'prepareForSubmission': {
                    const editor = vscode.window.activeTextEditor;
                    if (!editor) {
                        vscode.window.showWarningMessage('提出準備をするファイルを開いてください。');
                        return;
                    }
                    
                    const filePath = editor.document.uri.fsPath;
                    // ファイルパスからコンテストIDを抽出
                    const match = filePath.match(/contests\/([a-z0-9_]+)\//) ?? filePath.match(/\/([a-z0-9_]+)\/[a-z0-9]\//i);
                    if (!match || !match[1]) {
                        vscode.window.showWarningMessage('ファイルパスからコンテストIDを特定できませんでした。');
                        return;
                    }
                    const contestId = match[1];

                    // BundleServiceを呼び出し
                    const bundledCode = await this.bundleService.bundle(filePath);
                    if (bundledCode === null) {
                        vscode.window.showErrorMessage('コードのバンドルに失敗しました。');
                        return;
                    }

                    await vscode.env.clipboard.writeText(bundledCode);
                    
                    const openInBrowser = '提出ページを開く';
                    vscode.window.showInformationMessage(
                        'コードをクリップボードにコピーしました。',
                        openInBrowser
                    ).then(selection => {
                        if (selection === openInBrowser) {
                            const submitUrl = `https://atcoder.jp/contests/${contestId}/submit`;
                            vscode.env.openExternal(vscode.Uri.parse(submitUrl));
                        }
                    });
                    break;
                }
                case 'generateSnippet': { // Add this new case
                    const editor = vscode.window.activeTextEditor;
                    if (!editor) {
                        vscode.window.showWarningMessage('スニペットを生成する問題ファイルを開いてください。');
                        return;
                    }
                    await this.snippetGenerationService.generateAndCopy(editor.document.uri);
                    break;
                }
            }
        });
    }

    private _getHtmlForWebview(): string {
        const styles = `
            body { font-family: var(--vscode-font-family); color: var(--vscode-editor-foreground); background-color: var(--vscode-side-bar-background); padding: 10px; }
            h4 { margin-top: 0; margin-bottom: 8px; }
            .action-group { margin-bottom: 20px; }
            input { width: 100%; padding: 6px; box-sizing: border-box; border: 1px solid var(--vscode-input-border); background-color: var(--vscode-input-background); color: var(--vscode-input-foreground); border-radius: 2px; }
            button { width: 100%; padding: 8px; margin-top: 10px; border: none; background-color: var(--vscode-button-background); color: var(--vscode-button-foreground); cursor: pointer; border-radius: 2px; }
            button:hover { background-color: var(--vscode-button-hoverBackground); }
            #setup-btn { background-color: var(--vscode-button-primaryBackground); color: var(--vscode-button-primaryForeground); }
            #setup-btn:hover { background-color: var(--vscode-button-primaryHoverBackground); }
        `;

        const script = `
            const vscode = acquireVsCodeApi();
            
            document.getElementById('setup-btn').addEventListener('click', () => {
                const contestIdInput = document.getElementById('contest-id');
                vscode.postMessage({ command: 'setupContest', contestId: contestIdInput.value });
            });

            document.getElementById('prepare-btn').addEventListener('click', () => {
                vscode.postMessage({ command: 'prepareForSubmission' });
            });

            document.getElementById('generate-snippet-btn').addEventListener('click', () => { // Add this
                vscode.postMessage({ command: 'generateSnippet' });
            });
        `;

        return `<!DOCTYPE html>
            <html lang="ja">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Contest Actions</title>
                <style>${styles}</style>
            </head>
            <body>
                <div class="action-group">
                    <h4>コンテストの準備</h4>
                    <input type="text" id="contest-id" placeholder="コンテストID (例: abc300)">
                    <button id="setup-btn">セットアップ開始</button>
                </div>
                <hr>
                <div class="action-group">
                    <h4>提出の準備</h4>
                    <button id="prepare-btn">バンドル & クリップボードにコピー</button>
                </div>
                <hr>
                <div class="action-group">
                    <h4>スニペット生成</h4>
                    <button id="generate-snippet-btn">入力スニペット生成 & コピー</button>
                </div>
                <script>${script}</script>
            </body>
            </html>`;
    }
}