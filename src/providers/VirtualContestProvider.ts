import * as vscode from 'vscode';
import { VirtualContestService } from '../services/virtualContestService';
import { StatusBarService } from '../services/statusBarService';

export class VirtualContestProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'atcoder-utility.virtualContest';

    private _view?: vscode.WebviewView;

    constructor(
        private readonly _extensionUri: vscode.Uri,
        private readonly virtualContestService: VirtualContestService,
        private readonly statusBarService: StatusBarService
    ) { 
        this.virtualContestService.onTimerUpdate = this.updateTimer.bind(this);
    }

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
            console.log(`[VirtualContestProvider] Received message: ${data.type}`);
            switch (data.type) {
                case 'startVirtualContest':
                    this.virtualContestService.startContest(data.value);
                    break;
                case 'stopVirtualContest':
                    this.virtualContestService.stopContest();
                    break;
                case 'nextProblem':
                    this.virtualContestService.nextProblem();
                    break;
            }
        });
    }

    private updateTimer(timeString: string | null) {
        if (this._view) {
            this._view.webview.postMessage({ type: 'updateTimer', value: timeString });
        }
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'style.css'));
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'virtualContest.js'));

        return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="${styleUri}" rel="stylesheet">
                <title>Virtual Contest</title>
            </head>
            <body>
                <h1>バーチャルコンテスト設定</h1>

                <section>
                    <h2>時間設定</h2>
                    <input type="number" id="days" placeholder="Days">
                    <input type="number" id="hours" placeholder="Hours">
                    <input type="number" id="minutes" placeholder="Minutes">
                </section>

                <section>
                    <h2>コンテスト種類</h2>
                    <input type="checkbox" id="abc" name="contest-type" value="abc">
                    <label for="abc">ABC</label>
                    <input type="checkbox" id="arc" name="contest-type" value="arc">
                    <label for="arc">ARC</label>
                    <input type="checkbox" id="agc" name="contest-type" value="agc">
                    <label for="agc">AGC</label>
                    <br>
                    <input type="checkbox" id="abc-like" name="contest-type" value="abc-like">
                    <label for="abc-like">ABC-like</label>
                    <input type="checkbox" id="arc-like" name="contest-type" value="arc-like">
                    <label for="arc-like">ARC-like</label>
                    <input type="checkbox" id="agc-like" name="contest-type" value="agc-like">
                    <label for="agc-like">AGC-like</label>
                </section>

                <section>
                    <h2>問題の絞り込み</h2>
                    <input type="radio" id="diff-filter" name="filter-type" value="diff" checked>
                    <label for="diff-filter">Difficulty</label>
                    <input type="radio" id="prob-filter" name="filter-type" value="prob">
                    <label for="prob-filter">Probability</label>
                    <br>
                    <div id="diff-inputs">
                        <input type="number" id="min-diff" placeholder="Min Diff">
                        <input type="number" id="max-diff" placeholder="Max Diff">
                    </div>
                    <div id="prob-inputs" style="display: none;">
                        <input type="number" id="min-prob" placeholder="Min Prob">
                        <input type="number" id="max-prob" placeholder="Max Prob">
                    </div>
                </section>

                <section>
                    <h2>フィルター</h2>
                    <input type="checkbox" id="include-ac" name="filter" value="include-ac">
                    <label for="include-ac">AC済み問題を含める</label>
                    <br>
                    <input type="checkbox" id="wa-only" name="filter" value="wa-only">
                    <label for="wa-only">WA済み問題のみ表示</label>
                    <br>
                    <input type="checkbox" id="unsubmitted-only" name="filter" value="unsubmitted-only">
                    <label for="unsubmitted-only">未提出問題のみ表示</label>
                </section>

                <button id="start-contest">スタート</button>
                <button id="stop-contest" disabled>ストップ</button>
                <button id="next-problem" disabled>次の問題</button>

                <div id="timer"></div>

                <script src="${scriptUri}"></script>
            </body>
            </html>`;
    }
}