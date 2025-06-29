import * as vscode from 'vscode';
import { UserDataService } from '../services/userDataService';
import { AcProblem, TimeRange } from '../types';

function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

export class ActivityViewProvider implements vscode.WebviewViewProvider {

    public static readonly viewType = 'atcoder-utility-activity-view';
    private _view?: vscode.WebviewView;
    private _currentTimeRange: TimeRange = '1month'; // デフォルトは1ヶ月

    constructor(
        private readonly _extensionUri: vscode.Uri,
        private userDataService: UserDataService
    ) {
        console.log("ActivityViewProvider: Constructor called.");
    }

    public setTimeRange(range: TimeRange) {
        console.log(`ActivityViewProvider: setTimeRange called with range: ${range}`);
        this._currentTimeRange = range;
        this.refresh();
    }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;
        console.log("ActivityViewProvider: resolveWebviewView called.");

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        webviewView.webview.onDidReceiveMessage(message => {
            console.log("ActivityViewProvider: Message received from webview:", message);
            switch (message.command) {
                case 'webviewReady':
                    // WebViewの準備ができたら、初期データを送信
                    this.updateView();
                    break;
                case 'setTimeRange':
                    if (message.range) {
                        this.setTimeRange(message.range);
                    }
                    break;
            }
        });
    }

    /**
     * 他のサービスでデータが更新されたときに呼び出されるリフレッシュメソッド
     */
    public refresh() {
        console.log("ActivityViewProvider: refresh called.");
        if (this._view) {
            this.updateView();
        }
    }

    /**
     * WebViewの表示を現在のデータで更新します
     */
    private updateView() {
        if (!this._view) {
            console.log("ActivityViewProvider: updateView called, but _view is not available.");
            return;
        }
        console.log("ActivityViewProvider: updateView called.");

        const acProblems = this.userDataService.acProblems;
        console.log(`ActivityViewProvider: Number of AC problems: ${acProblems.length}`);
        
        // 期間に基づいて日ごとのAC数を計算
        const dailyAcCounts = this.calculateAcCountsByRange(acProblems, this._currentTimeRange);
        console.log("ActivityViewProvider: Daily AC counts:", dailyAcCounts);

        // Mapをプレーンなオブジェクトに変換してWebViewに送信
        const countsObject: { [key: string]: number } = {};
        dailyAcCounts.forEach((value, key) => {
            countsObject[key] = value;
        });

        this._view.webview.postMessage({
            command: 'updateChart', // コマンド名はそのまま
            data: {
                counts: countsObject,
                totalAc: acProblems.length,
                range: this._currentTimeRange
            }
        });
        console.log("ActivityViewProvider: Sent updateChart message to webview.");
    }

    private calculateAcCountsByRange(acProblems: ReadonlyArray<AcProblem>, range: TimeRange): Map<string, number> {
        const counts = new Map<string, number>();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let startDate = new Date(today);
        let numDays = 0;

        const aggregateByWeek = range === '3months' || range === '6months';

        switch (range) {
            case '1week':
                numDays = 7;
                break;
            case '1month':
                numDays = 30; // 約1ヶ月
                break;
            case '3months':
                numDays = 90; // 約3ヶ月
                break;
            case '6months':
                numDays = 180; // 約6ヶ月
                break;
        }
        startDate.setDate(today.getDate() - numDays + 1);
        startDate.setHours(0, 0, 0, 0);

        if (aggregateByWeek) {
            const getStartOfWeek = (d: Date) => {
                const date = new Date(d);
                const day = date.getDay(); // 0 (Sunday) - 6 (Saturday)
                const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
                date.setDate(diff);
                date.setHours(0, 0, 0, 0);
                return date;
            };

            let currentWeekStart = getStartOfWeek(new Date(startDate));
            const endWeekStart = getStartOfWeek(new Date(today));

            // Initialize weeks
            while (currentWeekStart <= endWeekStart) {
                const label = `${currentWeekStart.getFullYear()}/${String(currentWeekStart.getMonth() + 1).padStart(2, '0')}/${String(currentWeekStart.getDate()).padStart(2, '0')}`;
                counts.set(label, 0);
                currentWeekStart.setDate(currentWeekStart.getDate() + 7);
            }

            // Aggregate AC problems by week
            for (const problem of acProblems) {
                const acDate = new Date(problem.epoch_second * 1000);
                if (acDate.getTime() >= startDate.getTime() && acDate.getTime() <= today.getTime()) {
                    const weekStart = getStartOfWeek(acDate);
                    const label = `${weekStart.getFullYear()}/${String(weekStart.getMonth() + 1).padStart(2, '0')}/${String(weekStart.getDate()).padStart(2, '0')}`;
                    if (counts.has(label)) {
                        counts.set(label, counts.get(label)! + 1);
                    }
                }
            }
        } else {
            // Daily aggregation (existing logic)
            let currentDate = new Date(startDate);
            while (currentDate.getTime() <= today.getTime()) {
                const label = `${currentDate.getFullYear()}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${String(currentDate.getDate()).padStart(2, '0')}`;
                counts.set(label, 0);
                currentDate.setDate(currentDate.getDate() + 1);
            }

            for (const problem of acProblems) {
                const acDate = new Date(problem.epoch_second * 1000);
                acDate.setHours(0, 0, 0, 0);

                if (acDate.getTime() >= startDate.getTime() && acDate.getTime() <= today.getTime()) {
                    const label = `${acDate.getFullYear()}/${String(acDate.getMonth() + 1).padStart(2, '0')}/${String(acDate.getDate()).padStart(2, '0')}`;
                    if (counts.has(label)) {
                        counts.set(label, counts.get(label)! + 1);
                    }
                }
            }
        }
        
        const sortedCounts = new Map([...counts.entries()].sort());
        return sortedCounts;
    }

    private _getHtmlForWebview(webview: vscode.Webview): string {
        const nonce = getNonce();
        const cspSource = webview.cspSource;

        const styles = `
            body {
                font-family: var(--vscode-font-family);
                color: var(--vscode-editor-foreground);
                padding: 0 10px;
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            .time-range-buttons {
                display: flex;
                justify-content: center;
                gap: 5px;
                margin-bottom: 10px;
            }
            .time-range-buttons button {
                background-color: var(--vscode-button-background);
                color: var(--vscode-button-foreground);
                border: 1px solid var(--vscode-button-border, transparent);
                padding: 5px 10px;
                border-radius: 3px;
                cursor: pointer;
            }
            .time-range-buttons button:hover {
                background-color: var(--vscode-button-hoverBackground);
            }
            .time-range-buttons button.active {
                background-color: var(--vscode-button-primaryBackground);
                color: var(--vscode-button-primaryForeground);
            }
            #heatmap-container {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(15px, 1fr)); /* 1日分のセル */
                grid-auto-rows: 15px;
                gap: 2px;
                padding: 5px;
                border: 1px solid var(--vscode-editorWidget-border);
                border-radius: 3px;
                overflow-x: auto;
                width: 100%;
                max-width: 800px; /* 最大幅を設定 */
            }
            .day-cell {
                width: 15px;
                height: 15px;
                background-color: var(--vscode-editor-background);
                border: 1px solid var(--vscode-editorWidget-border);
                border-radius: 2px;
                position: relative;
            }
            .day-cell.level-0 { background-color: #ebedf0; } /* GitHubのデフォルト色 */
            .day-cell.level-1 { background-color: #9be9a8; } /* 薄い緑 */
            .day-cell.level-2 { background-color: #40c463; } /* 中間の緑 */
            .day-cell.level-3 { background-color: #30a14e; } /* 濃い緑 */
            .day-cell.level-4 { background-color: #216e39; } /* 最も濃い緑 */
            .day-cell:hover::after {
                content: attr(data-tooltip);
                position: absolute;
                bottom: 100%;
                left: 50%;
                transform: translateX(-50%);
                background-color: var(--vscode-editorWidget-background);
                color: var(--vscode-editorWidget-foreground);
                padding: 5px;
                border-radius: 3px;
                white-space: nowrap;
                z-index: 10;
                pointer-events: none;
                opacity: 0.9;
            }
            #chart-container {
                width: 100%;
                max-width: 800px;
                height: 400px; /* グラフの高さを指定 */
                margin-top: 20px;
            }
        `;

        const script = `
            const vscode = acquireVsCodeApi();
            const heatmapContainer = document.getElementById('heatmap-container');
            const summaryElement = document.getElementById('summary');
            const chartCtx = document.getElementById('ac-chart').getContext('2d');
            let myChart;

            function renderHeatmap(data, totalAc, range) {
                heatmapContainer.innerHTML = ''; // クリア
                summaryElement.textContent = 'Total AC: ' + totalAc;

                const sortedDates = Object.keys(data).sort();
                sortedDates.forEach(dateStr => {
                    const count = data[dateStr];
                    const cell = document.createElement('div');
                    cell.classList.add('day-cell');
                    
                    let level = 0;
                    if (count > 0 && count <= 2) level = 1;
                    else if (count > 2 && count <= 5) level = 2;
                    else if (count > 5 && count <= 10) level = 3;
                    else if (count > 10) level = 4;

                    cell.classList.add('level-' + level);
                    const tooltipText = range === '3months' || range === '6months' ? 'Week of ' + dateStr + ': ' + count + ' AC' : dateStr + ': ' + count + ' AC';
                    cell.setAttribute('data-tooltip', tooltipText);
                    heatmapContainer.appendChild(cell);
                });
            }

            function renderChart(data) {
                const labels = Object.keys(data.counts);
                const counts = Object.values(data.counts);
                const range = data.range;

                if (myChart) {
                    myChart.destroy();
                }

                myChart = new Chart(chartCtx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: range === '3months' || range === '6months' ? 'AC Count per week' : 'AC Count per day',
                            data: counts,
                            backgroundColor: 'rgba(75, 192, 192, 0.5)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    color: 'var(--vscode-editor-foreground)',
                                    stepSize: 1
                                },
                                grid: {
                                    color: 'var(--vscode-editorWidget-border)'
                                }
                            },
                            x: {
                                ticks: {
                                    color: 'var(--vscode-editor-foreground)'
                                },
                                grid: {
                                    color: 'var(--vscode-editorWidget-border)'
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                labels: {
                                    color: 'var(--vscode-editor-foreground)'
                                }
                            }
                        }
                    }
                });
            }

            // 期間選択ボタンのイベントリスナー
            document.querySelectorAll('.time-range-buttons button').forEach(button => {
                button.addEventListener('click', () => {
                    const range = button.dataset.range;
                    if (range) {
                        vscode.postMessage({ command: 'setTimeRange', range: range });
                        // アクティブなボタンを更新
                        document.querySelectorAll('.time-range-buttons button').forEach(btn => btn.classList.remove('active'));
                        button.classList.add('active');
                    }
                });
            });

            window.addEventListener('message', event => {
                const message = event.data;
                if (message.command === 'updateChart') {
                    renderHeatmap(message.data.counts, message.data.totalAc, message.data.range);
                    renderChart(message.data);
                }
            });

            // WebViewの準備完了を通知
            vscode.postMessage({ command: 'webviewReady' });
        `;

        return `<!DOCTYPE html>
            <html lang="ja">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}' https://cdn.jsdelivr.net; img-src ${cspSource} https:; font-src https://cdn.jsdelivr.net;">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>AC Activity</title>
                <script nonce="${nonce}" src="https://cdn.jsdelivr.net/npm/chart.js"></script>
                <style>${styles}</style>
            </head>
            <body>
                <div class="time-range-buttons">
                    <button data-range="1week">1週間</button>
                    <button data-range="1month" class="active">1ヶ月</button>
                    <button data-range="3months">3ヶ月</button>
                    <button data-range="6months">6ヶ月</button>
                </div>
                <h4 id="summary">Total AC: ...</h4>
                <div id="heatmap-container"></div>
                <div id="chart-container">
                    <canvas id="ac-chart"></canvas>
                </div>
                <script nonce="${nonce}">${script}</script>
            </body>
            </html>`;
    }
}
