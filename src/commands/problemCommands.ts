import * as vscode from 'vscode';
import { ProblemViewService } from '../services/problemViewService';

/**
 * 問題表示に関連するコマンドを登録します。
 * @param context 拡張機能のコンテキスト
 * @param problemViewService 問題表示Webviewを管理するサービス
 */
export function registerProblemCommands(context: vscode.ExtensionContext, problemViewService: ProblemViewService) {
    /**
     * 問題表示Webviewを開くコマンド
     */
    const showProblemCommand = vscode.commands.registerCommand('atcoder-utility.showProblem', () => {
        problemViewService.showProblemView();
    });

    context.subscriptions.push(showProblemCommand);
}
