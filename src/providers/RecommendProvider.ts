import * as vscode from 'vscode';
import { ProblemDataService } from '../services/problemDataService';
import { UserDataService } from '../services/userDataService';

/**
 * ユーザーのレーティングに基づいて、適切な難易度の問題を推薦するツリービュープロバイダーです。
 */
export class RecommendProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
    private _emitter = new vscode.EventEmitter<vscode.TreeItem | undefined | null | void>();
    readonly onDidChangeTreeData = this._emitter.event;

    constructor(
        private problemDataService: ProblemDataService,
        private userDataService: UserDataService
    ) { }

    /**
     * ツリービューの表示を更新します。
     */
    refresh(): void {
        this._emitter.fire();
    }

    getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
        return element;
    }

    /**
     * 推薦問題のリストを生成して返します。
     * @param element - 親要素（ルートの場合はundefined）
     */
    getChildren(element?: vscode.TreeItem): Thenable<vscode.TreeItem[]> {
        if (element) {
            return Promise.resolve([]); // 子要素はなし
        }

        if (!this.userDataService.userRatingInfo) {
            return Promise.resolve([new vscode.TreeItem("ユーザー情報取得中...")]);
        }

        const userRating = this.userDataService.userRatingInfo.current;
        const recommendationLimit = 15;
        const acProblemIds = new Set(this.userDataService.acProblems.map(p => p.id));

        // 推薦ロジック:
        // 1. 難易度が (現在のレート) <= diff < (現在のレート + 200) の範囲にある
        // 2. まだACしていない
        // 3. 難易度順にソート
        // 4. 上位15件を取得
        const recommendations = Array.from(this.problemDataService.problemCache.entries())
            .filter(([id, p]) =>
                p.difficulty &&
                p.difficulty >= userRating &&
                p.difficulty < userRating + 200 &&
                !acProblemIds.has(id)
            )
            .sort(([, a], [, b]) => a.difficulty! - b.difficulty!)
            .slice(0, recommendationLimit);

        if (recommendations.length === 0) {
            return Promise.resolve([new vscode.TreeItem("適切な推薦問題が見つかりません")]);
        }

        // TreeItemに変換
        return Promise.resolve(
            recommendations.map(([id, info]) => {
                const item = new vscode.TreeItem(`${info.title || id} (diff: ${info.difficulty})`);
                item.command = {
                    command: 'vscode.open',
                    title: 'Open Problem in Browser',
                    arguments: [vscode.Uri.parse(`https://atcoder.jp/contests/${id.split('_')[0]}/tasks/${id}`)]
                };
                return item;
            })
        );
    }
}
