import * as vscode from 'vscode';
import { UserDataService } from './userDataService';

/**
 * VSCodeのステータスバーの表示を管理するサービスです。
 * ユーザーのレーティングやテスト結果などを表示します。
 */
export class StatusBarService implements vscode.Disposable {
    private userStatusItem: vscode.StatusBarItem;
    private timerStatusItem: vscode.StatusBarItem;

    constructor(private userDataService: UserDataService) {
        this.userStatusItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
        this.userStatusItem.text = `$(sync~spin) AtCoder: Loading...`;
        this.userStatusItem.show();

        this.timerStatusItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 99);
    }

    /**
     * ユーザー情報に基づいてステータスバーの表示を更新します。
     * @param userId 現在のユーザーID
     */
    public updateUserStatusBar(userId: string) {
        if (!userId) {
            this.userStatusItem.hide();
            return;
        }

        const userRatingInfo = this.userDataService.userRatingInfo;

        if (userRatingInfo) {
            const { current, highest } = userRatingInfo;
            const colorInfo = this.userDataService.getRatingInfo(current);
            this.userStatusItem.text = `$(person) ${userId} (${colorInfo.emoji} ${current})`;
            this.userStatusItem.tooltip = `現在: ${current}, 最高: ${highest} (${colorInfo.name})`;
            this.userStatusItem.command = 'atcoder-utility.openProfilePage';
            this.userStatusItem.show();
        } else {
            this.userStatusItem.text = `$(error) AtCoder: Error`;
            this.userStatusItem.command = undefined;
            this.userStatusItem.show();
        }
    }

    /**
     * バーチャルコンテストのタイマーをステータスバーに表示・更新します。
     * @param timeString 表示する時間文字列 (例: "VC: 01:23:45")。nullを渡すと非表示になります。
     */
    public updateVirtualContestTimer(timeString: string | null) {
        if (timeString) {
            this.timerStatusItem.text = `$(watch) ${timeString}`;
            this.timerStatusItem.show();
        } else {
            this.timerStatusItem.hide();
        }
    }

    /**
     * リソースを解放します。
     */
    public dispose() {
        this.userStatusItem.dispose();
        this.timerStatusItem.dispose();
    }
}
