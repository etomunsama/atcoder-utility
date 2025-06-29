import * as vscode from 'vscode';
import * as path from 'path';

export class CustomTestViewProvider implements vscode.WebviewViewProvider {

    public static readonly viewType = 'atcoder-utility-custom-test-view';
    private _view?: vscode.WebviewView;

    constructor(
        private readonly _extensionUri: vscode.Uri
    ) {}

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        webviewView.webview.html = this._getHtmlForWebview();

        webviewView.webview.onDidReceiveMessage(async data => {
            switch (data.command) {
                case 'createTestFile':
                    await this.createTestFile(data.input, data.output);
                    break;
            }
        });
    }

    private async createTestFile(input: string, output: string) {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('テストケースを保存するには、対象の問題ファイル（例: Main.cpp）を開いてください。');
            return;
        }
        
        const documentUri = editor.document.uri;
        if (documentUri.scheme !== 'file') {
            vscode.window.showWarningMessage('ローカルファイルを開いてください。');
            return;
        }

        const filePath = documentUri.fsPath;
        const problemDir = path.dirname(filePath);

        // 問題フォルダかどうかの簡単なチェック
        if (!path.basename(problemDir).match(/^[a-z0-9]$/i)) {
            vscode.window.showWarningMessage('AtCoderの問題フォルダ（a, b, c...）内でファイルを開いてください。');
            return;
        }

        const testDirUri = vscode.Uri.joinPath(vscode.Uri.file(problemDir), 'test');

        try {
            await vscode.workspace.fs.createDirectory(testDirUri);
            const files = await vscode.workspace.fs.readDirectory(testDirUri);
            
            // "custom_*.in" の形式で次のファイル番号を見つける
            const lastIndex = files
                .filter(([name]) => name.startsWith('custom_') && name.endsWith('.in'))
                .map(([name]) => parseInt(name.replace('custom_', '').replace('.in', '')))
                .reduce((max, num) => isNaN(num) ? max : Math.max(max, num), 0);
            
            const newIndex = lastIndex + 1;
            const inFileName = `custom_${newIndex}.in`;
            const outFileName = `custom_${newIndex}.out`;

            await vscode.workspace.fs.writeFile(vscode.Uri.joinPath(testDirUri, inFileName), Buffer.from(input, 'utf8'));
            await vscode.workspace.fs.writeFile(vscode.Uri.joinPath(testDirUri, outFileName), Buffer.from(output, 'utf8'));

            vscode.window.showInformationMessage(`テストケース ${inFileName}, ${outFileName} を作成しました。`);

        } catch (e) {
            vscode.window.showErrorMessage('テストケースの作成に失敗しました。');
            console.error(e);
        }
    }

    private _getHtmlForWebview(): string {
        const styles = `
            body { 
                font-family: var(--vscode-font-family); 
                padding: 10px;
            }
            textarea { 
                width: 100%; 
                height: 150px; 
                margin-bottom: 10px; 
                box-sizing: border-box;
                border: 1px solid var(--vscode-input-border);
                background-color: var(--vscode-input-background);
                color: var(--vscode-input-foreground);
                font-family: var(--vscode-editor-font-family);
            }
            button { 
                width: 100%; 
                padding: 8px; 
                border: none;
                background-color: var(--vscode-button-background);
                color: var(--vscode-button-foreground);
                cursor: pointer;
            }
            button:hover {
                background-color: var(--vscode-button-hoverBackground);
            }
        `;

        const script = `
            const vscode = acquireVsCodeApi();
            const inputArea = document.getElementById('input-area');
            const outputArea = document.getElementById('output-area');
            const saveButton = document.getElementById('save-button');

            saveButton.addEventListener('click', () => {
                vscode.postMessage({
                    command: 'createTestFile',
                    input: inputArea.value,
                    output: outputArea.value
                });
            });
        `;

        return `<!DOCTYPE html>
            <html lang="ja">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Custom Test Case</title>
                <style>${styles}</style>
            </head>
            <body>
                <h4>Input</h4>
                <textarea id="input-area"></textarea>
                <h4>Output</h4>
                <textarea id="output-area"></textarea>
                <button id="save-button">テストケースを作成</button>
                <script>${script}</script>
            </body>
            </html>`;
    }
}