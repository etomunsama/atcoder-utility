// src/providers/fuzzerViewProvider.ts

import * as vscode from 'vscode';
import { FuzzerService } from '../services/fuzzerService';

export class FuzzerViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'atcoder-utility-fuzzer-view';
    private _view?: vscode.WebviewView;

    constructor(
        private readonly _extensionUri: vscode.Uri,
        private fuzzerService: FuzzerService
    ) {}

    public resolveWebviewView(webviewView: vscode.WebviewView) {
        this._view = webviewView;
        webviewView.webview.options = { enableScripts: true, localResourceRoots: [this._extensionUri] };
        webviewView.webview.html = this._getHtmlForWebview();

        webviewView.webview.onDidReceiveMessage(async data => {
            switch (data.command) {
                case 'selectFile':
                    const uris = await vscode.window.showOpenDialog({ canSelectMany: false, openLabel: 'ファイルを選択' });
                    if (uris && uris[0]) {
                        webviewView.webview.postMessage({ command: 'fileSelected', target: data.target, path: uris[0].fsPath });
                    }
                    break;
                case 'startFuzzing':
                    this.fuzzerService.start(data.settings, webviewView.webview);
                    break;
                case 'stopFuzzing':
                    this.fuzzerService.stop();
                    break;
            }
        });
    }

    private _getHtmlForWebview(): string {
        const styles = `
            body { font-family: var(--vscode-font-family); color: var(--vscode-editor-foreground); background-color: var(--vscode-side-bar-background); padding: 10px; }
            h4 { margin-top: 15px; margin-bottom: 5px; }
            .input-group { display:flex; margin-bottom: 10px; }
            .input-group input { flex-grow: 1; }
            .input-group button { width:auto; margin-top:0; margin-left:5px; flex-shrink: 0; }
            input, select { width: 100%; padding: 4px; box-sizing: border-box; border: 1px solid var(--vscode-input-border); background-color: var(--vscode-input-background); color: var(--vscode-input-foreground); border-radius: 2px; }
            button { width: 100%; padding: 8px; margin-top: 10px; border: none; background-color: var(--vscode-button-background); color: var(--vscode-button-foreground); cursor: pointer; border-radius: 2px; }
            button:hover { background-color: var(--vscode-button-hoverBackground); }
            #start-btn { background-color: var(--vscode-button-primaryBackground); color: var(--vscode-button-primaryForeground); }
            #start-btn:hover { background-color: var(--vscode-button-primaryHoverBackground); }
            #log-output { height: 200px; overflow-y: scroll; background: var(--vscode-editor-background); padding: 5px; white-space: pre-wrap; word-wrap: break-word; font-family: var(--vscode-editor-font-family); font-size: var(--vscode-editor-font-size); }
            pre { margin: 0; padding: 5px; border-radius: 3px; background-color: var(--vscode-text-block-quote-background); }
        `;
        
        const script = `
            const vscode = acquireVsCodeApi();
            const mainSolutionInput = document.getElementById('main-solution-path');
            const bruteSolutionInput = document.getElementById('brute-solution-path');
            const selectMainBtn = document.getElementById('select-main-btn');
            const selectBruteBtn = document.getElementById('select-brute-btn');
            const trialsInput = document.getElementById('trials');
            const startBtn = document.getElementById('start-btn');
            const stopBtn = document.getElementById('stop-btn');
            const logOutput = document.getElementById('log-output');

            selectMainBtn.addEventListener('click', () => vscode.postMessage({ command: 'selectFile', target: 'main' }));
            selectBruteBtn.addEventListener('click', () => vscode.postMessage({ command: 'selectFile', target: 'brute' }));

            startBtn.addEventListener('click', () => {
                logOutput.innerHTML = '';
                vscode.postMessage({
                    command: 'startFuzzing',
                    settings: {
                        mainSolutionPath: mainSolutionInput.value,
                        bruteSolutionPath: bruteSolutionInput.value,
                        trials: parseInt(trialsInput.value)
                    }
                });
            });

            stopBtn.addEventListener('click', () => vscode.postMessage({ command: 'stopFuzzing' }));

            window.addEventListener('message', event => {
                const message = event.data;
                switch (message.command) {
                    case 'fileSelected':
                        if (message.target === 'main') mainSolutionInput.value = message.path;
                        else if (message.target === 'brute') bruteSolutionInput.value = message.path;
                        break;
                    case 'updateLog':
                        const logLine = document.createElement('div');
                        logLine.textContent = message.text;
                        logOutput.appendChild(logLine);
                        logOutput.scrollTop = logOutput.scrollHeight;
                        break;
                    case 'fuzzingFinished':
                        logOutput.innerHTML += \`<hr><p>\${message.text}</p>\`;
                        break;
                    case 'foundHackCase':
                        const summary = document.createElement('div');
                        summary.innerHTML = \`<hr><h4>Hack Case Found!</h4><p><strong>[Input]</strong></p><pre>\${escapeHtml(message.input)}</pre><p><strong>[Main Output]</strong></p><pre>\${escapeHtml(message.mainOutput)}</pre><p><strong>[Correct Output]</strong></p><pre>\${escapeHtml(message.bruteOutput)}</pre><hr>\`;
                        logOutput.appendChild(summary);
                        logOutput.scrollTop = logOutput.scrollHeight;
                        break;
                }
            });

            function escapeHtml(str) {
                return str.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>').replace(/"/g, '"').replace(/'/g, ''');
            }
        `;
        
        return `<!DOCTYPE html>
            <html lang="ja">
            <head>
                <meta charset="UTF-8">
                <title>Fuzzer</title>
                <style>${styles}</style>
            </head>
            <body>
                <h4>Fuzzer設定</h4>
                <p style="font-size:0.9em; opacity:0.8;">制約は「Random Input」ビューで設定・保存してください。</p>
                <div class="input-group">
                    <input type="text" id="main-solution-path" placeholder="メインの解法ファイルパス">
                    <button id="select-main-btn">選択</button>
                </div>
                <div class="input-group">
                    <input type="text" id="brute-solution-path" placeholder="正しい解法 (愚直解)のパス">
                    <button id="select-brute-btn">選択</button>
                </div>
                <label for="trials">試行回数</label>
                <input type="number" id="trials" value="100">
                <button id="start-btn">Fuzzing開始</button>
                <button id="stop-btn">停止</button>
                <hr>
                <h4>ログ</h4>
                <pre id="log-output"></pre>
                <script>${script}</script>
            </body>
            </html>`;
    }
}