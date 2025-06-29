import * as vscode from 'vscode';
import { ContestSetupService } from '../services/contestSetupService';

/**
 * コンテスト関連のコマンドを登録します。
 * @param context - 拡張機能のコンテキスト
 * @param contestSetupService - コンテストセットアップサービス
 */
export function registerContestCommands(
    context: vscode.ExtensionContext,
    contestSetupService: ContestSetupService
) {
    context.subscriptions.push(
        vscode.commands.registerCommand('atcoder-utility.setupContest', async () => {
            // ユーザーにコンテストIDの入力を求める
            const contestId = await vscode.window.showInputBox({
                prompt: 'セットアップするコンテストのIDを入力してください (例: abc300)',
                placeHolder: 'abc300',
                validateInput: text => {
                    // 入力されたIDがAtCoderのコンテストIDとして有効な形式かチェック
                    return text.match(/^[a-z0-9_]+$/) ? null : '無効なコンテストIDです。';
                }
            });

            // ユーザーが入力をキャンセルした場合は処理を中断
            if (!contestId) {
                return;
            }

            // コンテストフォルダの作成先となる親フォルダをユーザーに選択させる
            const parentDir = await vscode.window.showOpenDialog({
                canSelectFiles: false,
                canSelectFolders: true,
                canSelectMany: false,
                openLabel: 'ここにコンテストフォルダを作成'
            });

            // ユーザーがフォルダ選択をキャンセルした場合は処理を中断
            if (!parentDir || parentDir.length === 0) {
                return;
            }

            // サービスを呼び出してコンテストのセットアップを実行
            await contestSetupService.setupContest(contestId, parentDir[0]);
        })
    );
}
