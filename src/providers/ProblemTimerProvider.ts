import * as vscode from 'vscode';

export class ProblemTimerProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'atcoder-utility-problem-timer-view';

    private _view?: vscode.WebviewView;
    private _intervalId?: NodeJS.Timeout;
    private _startTime?: number;
    private _elapsedTimeOnPause: number = 0; // 停止した時点での経過時間

    constructor(
        private readonly _extensionUri: vscode.Uri
    ) {}

    public resolveWebviewView(webviewView: vscode.WebviewView) {
        this._view = webviewView;
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };
        webviewView.webview.html = this._getHtmlForWebview();

        webviewView.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case 'webviewReady':
                    // WebViewの準備ができたら現在の状態を送る
                    this.updateWebview();
                    break;
                case 'start':
                    this.start();
                    break;
                case 'stop':
                    this.stop();
                    break;
                case 'reset':
                    this.reset();
                    break;
            }
        });
    }

    private start() {
        if (this._intervalId) return; // 既に動いていれば何もしない

        // 開始時刻を設定 (停止していた時間分を差し引く)
        this._startTime = Date.now() - this._elapsedTimeOnPause;
        
        this._intervalId = setInterval(() => {
            this.updateWebview();
        }, 1000); // 1秒ごとに更新

        this.updateWebview(); // すぐにUIを更新
        vscode.window.showInformationMessage('問題タイマーを開始しました。');
    }

    private stop() {
        if (!this._intervalId) return; // 動いていなければ何もしない

        clearInterval(this._intervalId);
        this._intervalId = undefined;

        // 停止した時点での経過時間を保存
        this._elapsedTimeOnPause = Date.now() - (this._startTime ?? Date.now());
        
        this.updateWebview(); // 最後の状態でUIを更新
        const minutes = Math.floor(this._elapsedTimeOnPause / 60000);
        const seconds = Math.floor((this._elapsedTimeOnPause % 60000) / 1000);
        vscode.window.showInformationMessage(`タイマーを停止しました。経過時間: ${minutes}分${seconds}秒`);
    }

    private reset() {
        if (this._intervalId) {
            clearInterval(this._intervalId);
            this._intervalId = undefined;
        }
        this._startTime = undefined;
        this._elapsedTimeOnPause = 0; // 経過時間をリセット

        this.updateWebview(); // UIを00:00にリセット
        vscode.window.showInformationMessage('問題タイマーをリセットしました。');
    }

    /**
     * WebViewの表示を現在のタイマーの状態に合わせて更新します。
     */
    public updateWebview() {
        if (!this._view) return;
        
        let elapsedMillis = 0;
        if (this._startTime && this._intervalId) { // 実行中の場合
            elapsedMillis = Date.now() - this._startTime;
        } else { // 停止中またはリセット後の場合
            elapsedMillis = this._elapsedTimeOnPause;
        }
        
        const totalSeconds = Math.floor(elapsedMillis / 1000);
        const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
        const seconds = String(totalSeconds % 60).padStart(2, '0');

        this._view.webview.postMessage({
            command: 'update',
            time: `${minutes}:${seconds}`,
            isRunning: !!this._intervalId,
            hasStarted: this._startTime !== undefined || this._elapsedTimeOnPause > 0
        });
    }

    private _getHtmlForWebview(): string {
        const styles = `
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 10px; color: var(--vscode-foreground); text-align: center; }
            #timer { font-size: 3em; font-weight: bold; margin: 20px 0; font-family: var(--vscode-editor-font-family); }
            .buttons { display: flex; justify-content: center; gap: 10px; }
            .buttons button {
                flex-grow: 1;
                background-color: var(--vscode-button-background);
                color: var(--vscode-button-foreground);
                border: 1px solid var(--vscode-button-border, transparent);
                padding: 8px 15px;
                border-radius: 5px;
                cursor: pointer;
            }
            .buttons button:hover { background-color: var(--vscode-button-hoverBackground); }
            .buttons button:disabled { opacity: 0.5; cursor: not-allowed; }
            #start-btn { background-color: var(--vscode-button-primaryBackground); color: var(--vscode-button-primaryForeground); }
        `;

        const script = `
            const vscode = acquireVsCodeApi();
            const timerDisplay = document.getElementById('timer');
            const startButton = document.getElementById('start-btn');
            const stopButton = document.getElementById('stop-button');
            const resetButton = document.getElementById('reset-button');

            // --- ボタンのクリックイベント ---
            if (startButton) {
                startButton.addEventListener('click', () => vscode.postMessage({ command: 'start' }));
            }
            if (stopButton) {
                stopButton.addEventListener('click', () => vscode.postMessage({ command: 'stop' }));
            }
            if (resetButton) {
                resetButton.addEventListener('click', () => vscode.postMessage({ command: 'reset' }));
            }

            // --- 本体からのメッセージ受信 ---
            window.addEventListener('message', event => {
                const message = event.data;
                if (message.command === 'update') {
                    // 時間表示を更新
                    if (timerDisplay) {
                        timerDisplay.textContent = message.time;
                    }

                    // ボタンの状態を更新
                    if (startButton) startButton.disabled = message.isRunning;
                    if (stopButton) stopButton.disabled = !message.isRunning;
                    if (resetButton) resetButton.disabled = message.isRunning || !message.hasStarted;
                }
            });

            // WebViewの準備完了を本体に通知
            vscode.postMessage({ command: 'webviewReady' });
        `;

        return `<!DOCTYPE html>
            <html lang="ja">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Problem Timer</title>
                <style>${styles}</style>
            </head>
            <body>
                <div id="timer">00:00</div>
                <div class="buttons">
                    <button id="start-btn">開始</button>
                    <button id="stop-button" disabled>停止</button>
                    <button id="reset-button" disabled>リセット</button>
                </div>
                <script>${script}</script>
            </body>
            </html>`;
    }
}