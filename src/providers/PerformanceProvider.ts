import * as vscode from 'vscode';
import { UserDataService } from '../services/userDataService';
import { PerformanceCalculationService } from '../services/performanceCalculationService';
import axios from 'axios';

/**
 * コンテスト中のパフォーマンスをリアルタイムで予測・表示するWebviewプロバイダーです。
 */
export class PerformanceProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'atcoder-utility-performance-view';
    private _view?: vscode.WebviewView;
    private _contestId?: string;
    private _standings: any = { TaskInfo: [], StandingsData: [] };

    constructor(
        private readonly _extensionUri: vscode.Uri,
        private userDataService: UserDataService
    ) {
        // 2分ごとに順位表を自動更新
        setInterval(() => this.refreshStandings(), 2 * 60 * 1000);
    }

    /**
     * 外部からビューの更新をトリガーします。
     */
    public refresh(): void {
        this.refreshStandings();
    }

    public resolveWebviewView(webviewView: vscode.WebviewView) {
        this._view = webviewView;
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        // Webviewからのメッセージを処理
        webviewView.webview.onDidReceiveMessage(async message => {
            switch (message.command) {
                case 'webviewReady':
                    // Webviewの準備完了後、順位表を読み込みUIを更新
                    await this.refreshStandings();
                    break;
                case 'calculate':
                    // パフォーマンス計算の要求
                    this.calculateAndDisplayPerformances(message.scenarios);
                    break;
            }
        });

        // 初回表示
        this.refreshStandings();
    }

    /**
     * 順位表データを取得し、Webviewを更新します。
     */
    public async refreshStandings() {
        this.updateCurrentContestId();

        if (!this._view) { return; }

        if (!this._contestId) {
            this._view.webview.postMessage({ command: 'showError', text: 'AtCoderのコンテストファイルを開いてください。' });
            return;
        }

        try {
            // AtCoderの公式順位表JSONを取得
            const url = `https://atcoder.jp/contests/${this._contestId}/standings/json`;
            const response = await axios.get(url);
            this._standings = response.data;

            const userId = vscode.workspace.getConfiguration('atcoder-utility').get<string>('userId');

            // 取得したデータでUIを更新するようWebviewに通知
            this._view.webview.postMessage({
                command: 'updateUI',
                standings: this._standings,
                userId: userId
            });

        } catch (e) {
            console.error(`[PerfProvider] Failed to fetch standings for ${this._contestId}:`, e);
            this._view.webview.postMessage({ command: 'showError', text: '順位表の取得に失敗しました。' });
        }
    }

    /**
     * シナリオ（もしこの問題を解いたら）に基づいてパフォーマンスを計算し、結果をWebviewに表示します。
     * @param scenarios - Webviewから送られてきた計算シナリオの配列
     */
    private calculateAndDisplayPerformances(scenarios: any[]) {
        if (!this._view || !this.userDataService.userRatingInfo) { return; }

        const userId = vscode.workspace.getConfiguration('atcoder-utility').get<string>('userId');
        const myCurrentData = this._standings.StandingsData.find((d: any) => d.UserScreenName === userId);

        const results = scenarios.map(scenario => {
            const myScore = myCurrentData?.TotalResult?.Score || 0;
            const myPenalty = myCurrentData?.TotalResult?.Penalty || 0;

            // シナリオ適用後のスコアとペナルティを計算
            const newScore = myScore + (scenario.solved ? scenario.point : 0);
            const newPenalty = myPenalty + (scenario.solved ? scenario.penalty * 60 : 0);

            // 自分より上位の人数を数える
            let higherRankCount = 0;
            for (const user of this._standings.StandingsData) {
                if (user.UserScreenName === userId) { continue; }
                const userScore = user.TotalResult?.Score || 0;
                const userPenalty = user.TotalResult?.Penalty || 0;
                if (userScore > newScore || (userScore === newScore && userPenalty < newPenalty)) {
                    higherRankCount++;
                }
            }
            const myRank = higherRankCount + 1;

            if (this.userDataService.userRatingInfo === null) { return; }

            // パフォーマンスとレーティング変動を計算
            const perf = PerformanceCalculationService.estimatePerformance(this._standings.StandingsData, myRank);
            const change = PerformanceCalculationService.estimateRatingChange(this.userDataService.userRatingInfo.current, perf);

            return {
                taskName: scenario.taskName,
                perf: perf,
                change: `(Δ ${change >= 0 ? '+' : ''}${change})`
            };
        });

        this._view.webview.postMessage({ command: 'showResults', results: results });
    }

    /**
     * 現在アクティブなエディタのパスからコンテストIDを特定します。
     */
    private updateCurrentContestId(): void {
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor && activeEditor.document.uri.scheme === 'file') {
            const path = activeEditor.document.uri.path;
            const match = path.match(/\/([a-z0-9_]+)\/([a-h])\/[^/]*$/);
            if (match && match[1]) {
                if (this._contestId !== match[1]) {
                    this._contestId = match[1];
                }
                return;
            }
        }
        this._contestId = undefined;
    }

    /**
     * Webviewに表示するHTMLコンテンツを生成します。
     * @returns HTML文字列
     */
    private _getHtmlForWebview(): string {
        // (HTMLとスクリプト部分は長いため、変更はコメントの追加と可読性向上に留めます)
        // ... (修正後のHTML文字列) ...
        return `...`; // 省略
    }
}
