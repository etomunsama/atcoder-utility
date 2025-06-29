import * as vscode from 'vscode';
import { UserDataService } from './userDataService';

/**
 * VSCodeのステータスバーの表示を管理するサービスです。
 * ユーザーのレーティングやテスト結果などを表示します。
 */
export class StatusBarService implements vscode.Disposable {
    private statusBarItem: vscode.StatusBarItem;

    constructor(private userDataService: UserDataService) {
        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
        this.statusBarItem.text = `$(sync~spin) AtCoder: Loading...`;
        this.statusBarItem.show();
    }

    /**
     * ユーザー情報に基づいてステータスバーの表示を更新します。
     * @param userId 現在のユーザーID
     */
    public updateUserStatusBar(userId: string) {
        if (!userId) {
            this.statusBarItem.hide();
            return;
        }

        const userRatingInfo = this.userDataService.userRatingInfo;

        if (userRatingInfo) {
            const { current, highest } = userRatingInfo;
            const colorInfo = this.userDataService.getRatingInfo(current);
            this.statusBarItem.text = `$(person) ${userId} (${colorInfo.emoji} ${current})`;
            this.statusBarItem.tooltip = `現在: ${current}, 最高: ${highest} (${colorInfo.name})`;
            this.statusBarItem.command = 'atcoder-utility.openProfilePage';
            this.statusBarItem.show();
        } else {
            this.statusBarItem.text = `$(error) AtCoder: Error`;
            this.statusBarItem.command = undefined;
            this.statusBarItem.show();
        }
    }

    /**
     * リソースを解放します。
     */
    public dispose() {
        this.statusBarItem.dispose();
    }
}
