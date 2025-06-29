import * as vscode from 'vscode';
import { UserDataService } from '../services/userDataService';

/**
 * ユーザーのレーティングやAC数などのステータスを表示するツリービュープロバイダーです。
 */
export class StatusProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
    private _emitter = new vscode.EventEmitter<vscode.TreeItem | undefined | null | void>();
    readonly onDidChangeTreeData = this._emitter.event;

    constructor(private userDataService: UserDataService) { }

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
     * ステータス項目を生成して返します。
     * @param element - 親要素（AC数の詳細表示の場合は親要素が入る）
     */
    getChildren(element?: vscode.TreeItem): Thenable<vscode.TreeItem[]> {
        // ルート要素の生成
        if (!element) {
            if (!this.userDataService.userRatingInfo) {
                return Promise.resolve([new vscode.TreeItem("情報を取得中...")]);
            }
            const { current, highest } = this.userDataService.userRatingInfo;
            const ratingInfo = this.userDataService.getRatingInfo(current);

            const ratingItem = new vscode.TreeItem(`Rating: ${current} (${ratingInfo.emoji})`);
            ratingItem.tooltip = `現在: ${current}, 最高: ${highest} (${ratingInfo.name})`;

            const highestItem = new vscode.TreeItem(`Highest: ${highest}`);

            const acItem = new vscode.TreeItem(`Accepted: ${this.userDataService.acProblems.length} 問`, vscode.TreeItemCollapsibleState.Collapsed);
            acItem.id = 'status-ac-parent'; // 子要素を持つことを示すID

            const streakItem = new vscode.TreeItem(`Streak: ${this.userDataService.calculateStreak()} 日 🔥`);

            return Promise.resolve([ratingItem, highestItem, acItem, streakItem]);
        }

        // "Accepted" の子要素（色別のAC数）の生成
        if (element.id === 'status-ac-parent') {
            const acCountByColor = this.userDataService.countAcByColor();
            const colorRatingMap: { [key: string]: number } = { '赤': 2800, '橙': 2400, '黄': 2000, '青': 1600, '水': 1200, '緑': 800, '茶': 400, '灰': 0 };

            const sortedCounts = Array.from(acCountByColor.entries())
                .filter(([, count]) => count > 0) // AC数が0のものは表示しない
                .sort((a, b) => colorRatingMap[b[0]] - colorRatingMap[a[0]]); // レートの高い色から順にソート

            return Promise.resolve(
                sortedCounts.map(([color, count]) => {
                    const ratingInfo = this.userDataService.getRatingInfo(colorRatingMap[color]);
                    return new vscode.TreeItem(`${ratingInfo.emoji} ${color} : ${count} 問`);
                })
            );
        }

        return Promise.resolve([]);
    }
}