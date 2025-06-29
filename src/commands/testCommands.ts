import * as vscode from 'vscode';
import { CustomTestRunnerService } from '../services/customTestRunnerService';

/**
 * テスト実行に関連するコマンドを登録します。
 * @param context 拡張機能のコンテキスト
 * @param testRunnerService テスト実行を管理するサービス
 */
export function registerTestCommands(
    context: vscode.ExtensionContext,
    testRunnerService: CustomTestRunnerService
) {
    /**
     * 現在アクティブなファイルに対してテストを実行するコマンド
     */
    const runTestsCommand = vscode.commands.registerCommand('atcoder-utility.runTests', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            // サービスを呼び出してテストを実行
            testRunnerService.runTests(editor.document.uri.fsPath, editor.document.languageId, true);
        } else {
            vscode.window.showWarningMessage('テストを実行するファイルを開いた状態でコマンドを実行してください。');
        }
    });

    context.subscriptions.push(runTestsCommand);
}
