import * as vscode from 'vscode';

export class VirtualContestSetupViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'atcoder-utility.virtualContestSetupView';

    private _view?: vscode.WebviewView;

    constructor(private readonly _extensionUri: vscode.Uri) { }

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

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        webviewView.webview.onDidReceiveMessage(data => {
            switch (data.type) {
                case 'startVirtualContest':
                    vscode.window.showInformationMessage(`Virtual Contest Started with settings: ${JSON.stringify(data.value)}`);
                    // TODO: Start virtual contest logic
                    break;
            }
        });
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'style.css'));
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'virtualContestSetup.js'));

        return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="${styleUri}" rel="stylesheet">
                <title>Virtual Contest Setup</title>
            </head>
            <body>
                <h1>バーチャルコンテスト設定</h1>

                <section>
                    <h2>難易度範囲 (Difficulty Range)</h2>
                    <div class="form-group">
                        <label for="minDifficulty">最小難易度 (Min):</label>
                        <input type="number" id="minDifficulty" value="0" placeholder="0 (or empty for -9999)">
                    </div>
                    <div class="form-group">
                        <label for="maxDifficulty">最大難易度 (Max):</label>
                        <input type="number" id="maxDifficulty" value="3000" placeholder="3000">
                    </div>
                </section>

                <section>
                    <h2>時間設定 (Duration)</h2>
                    <div class="form-group">
                        <label for="durationValue">時間 (Value):</label>
                        <input type="number" id="durationValue" value="90">
                    </div>
                    <div class="form-group">
                        <label for="durationUnit">単位 (Unit):</label>
                        <select id="durationUnit">
                            <option value="minutes">分 (Minutes)</option>
                            <option value="hours">時間 (Hours)</option>
                            <option value="days">日 (Days)</option>
                            <option value="weeks">週 (Weeks)</option>
                        </select>
                    </div>
                </section>

                <section>
                    <h2>コンテスト種類 (Contest Types)</h2>
                    <div class="form-group">
                        <input type="checkbox" id="typeABC" value="abc" checked>
                        <label for="typeABC">ABC</label>
                        <input type="checkbox" id="typeARC" value="arc">
                        <label for="typeARC">ARC</label>
                        <input type="checkbox" id="typeAGC" value="agc">
                        <label for="typeAGC">AGC</label>
                    </div>
                    <div class="form-group">
                        <input type="checkbox" id="typeABCLike" value="abc-like">
                        <label for="typeABCLike">ABC-like</label>
                        <input type="checkbox" id="typeARCLike" value="arc-like">
                        <label for="typeARCLike">ARC-like</label>
                        <input type="checkbox" id="typeAGCLike" value="agc-like">
                        <label for="typeAGCLike">AGC-like</label>
                    </div>
                </section>

                <section>
                    <h2>AC済み問題の扱い (Handle Accepted Problems)</h2>
                    <div class="form-group">
                        <input type="checkbox" id="includeAccepted" checked>
                        <label for="includeAccepted">AC済み問題を含める (Include Accepted)</label>
                    </div>
                </section>

                <button id="startButton">バーチャルコンテストを開始</button>

                <script src="${scriptUri}"></script>
            </body>
            </html>`;
    }
}