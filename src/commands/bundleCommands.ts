import * as vscode from 'vscode';
import { BundleService } from '../services/bundleService';

/**
 * ファイルのバンドル（インクルードを展開して1つのファイルにまとめる）に関連するコマンドを登録します。
 * @param context 拡張機能のコンテキスト
 * @param bundleService バンドル処理を行うサービス
 */
export function registerBundleCommands(
    context: vscode.ExtensionContext,
    bundleService: BundleService
) {
    /**
     * 現在アクティブなファイルをバンドルするコマンド
     */
    const bundleFileCommand = vscode.commands.registerCommand('atcoder-utility.bundleFile', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage('バンドルするファイルを開いてください。');
            return;
        }

        // バンドル処理を実行
        const bundledCode = await bundleService.bundle(editor.document.uri.fsPath);

        // バンドル成功時、結果を新しいエディタで開く
        if (bundledCode !== null) {
            const doc = await vscode.workspace.openTextDocument({
                content: bundledCode,
                language: editor.document.languageId // 元のファイルの言語を維持
            });
            await vscode.window.showTextDocument(doc);
            vscode.window.showInformationMessage('バンドルが完了しました。');
        }
    });

    context.subscriptions.push(bundleFileCommand);
}
