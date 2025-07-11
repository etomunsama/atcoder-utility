import * as vscode from 'vscode';
import { ProblemDataService } from '../services/problemDataService';
import { UserDataService } from '../services/userDataService';
import { RefreshableProvider } from '../types';
import { StatusBarService } from '../services/statusBarService';

/**
 * データ関連のコマンド（データ更新、プロフィール表示）を登録します。
 * @param context 拡張機能のコンテキスト
 * @param problemDataService 問題データを扱うサービス
 * @param userDataService ユーザーデータを扱うサービス
 * @param statusBarService ステータスバーを管理するサービス
 * @param providersToRefresh データ更新時にリフレッシュが必要なUIプロバイダーの配列
 */
export function registerDataCommands(
    context: vscode.ExtensionContext,
    problemDataService: ProblemDataService,
    userDataService: UserDataService,
    statusBarService: StatusBarService,
    providersToRefresh: RefreshableProvider[]
) {
    /**
     * 全てのAtCoder関連データを手動で更新するコマンド
     */
    const refreshCommand = vscode.commands.registerCommand('atcoder-utility.refresh', async () => {
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "AtCoder-Utility: データを更新中...",
            cancellable: false
        }, async (progress) => {
            progress.report({ message: "問題データを取得中..." });
            await problemDataService.loadAllProblemData();

            const currentUserId = vscode.workspace.getConfiguration('atcoder-utility').get<string>('userId') || '';
            if (currentUserId) {
                progress.report({ message: "ユーザーデータを取得中..." });
                await userDataService.loadUserData(currentUserId);
            }

            // UIコンポーネントを更新
            statusBarService.updateUserStatusBar(currentUserId);
            providersToRefresh.forEach(p => p.refresh());

            vscode.window.showInformationMessage('AtCoder-Utility: データの更新が完了しました。');
        });
    });

    /**
     * ユーザーのプロフィールページをブラウザで開くコマンド
     */
    const openProfilePageCommand = vscode.commands.registerCommand('atcoder-utility.openProfilePage', () => {
        const userId = vscode.workspace.getConfiguration('atcoder-utility').get<string>('userId');
        if (userId) {
            vscode.env.openExternal(vscode.Uri.parse(`https://atcoder.jp/users/${userId}`));
        } else {
            vscode.window.showInformationMessage('ユーザーIDが設定されていません。設定画面から `atcoder-utility.userId` を設定してください。');
        }
    });

    /**
     * AtCoderのセッションCookieを設定するコマンド
     */
    const setSessionCookieCommand = vscode.commands.registerCommand('atcoder-utility.setSessionCookie', async () => {
        const sessionCookieInput = await vscode.window.showInputBox({
            prompt: 'AtCoderのセッションCookie (例: "REVEL_SESSION=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx") を入力してください。',
            placeHolder: 'REVEL_SESSION=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            ignoreFocusOut: true // 入力ボックスからフォーカスが外れても閉じない
        });

        if (sessionCookieInput) {
            // ユーザーが入力したCookieをそのまま保存
            await context.secrets.store('atcoderSessionCookie', sessionCookieInput);
            vscode.window.showInformationMessage('セッションCookieを保存しました。');
            // Cookieが更新されたので、ユーザーデータを再読み込みしてUIを更新
            const currentUserId = vscode.workspace.getConfiguration('atcoder-utility').get<string>('userId') || '';
            if (currentUserId) {
                await userDataService.loadUserData(currentUserId);
                statusBarService.updateUserStatusBar(currentUserId);
                providersToRefresh.forEach(p => p.refresh());
            }
        } else {
            vscode.window.showInformationMessage('セッションCookieの入力がキャンセルされました。');
        }
    });

    context.subscriptions.push(refreshCommand, openProfilePageCommand, setSessionCookieCommand);
}