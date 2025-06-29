import * as vscode from 'vscode';
import { BundleService } from '../services/bundleService';

/**
 * 提出準備に関連するコマンドを登録します。
 * @param context 拡張機能のコンテキスト
 * @param bundleService バンドル処理を行うサービス
 */
export function registerSubmissionCommands(
    context: vscode.ExtensionContext,
    bundleService: BundleService
) {
    /**
     * 現在のファイルをバンドルし、クリップボードにコピーして提出ページを開くコマンド
     */
    const prepareForSubmissionCommand = vscode.commands.registerCommand('atcoder-utility.prepareForSubmission', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage('提出準備をするファイルを開いてください。');
            return;
        }

        const filePath = editor.document.uri.fsPath;

        // ファイルパスからコンテストIDを正規表現で抽出
        const match = filePath.match(/contests\/([a-z0-9_]+)\//) ?? filePath.match(/\/([a-z0-9_]+)\/[a-z0-9]\//);
        if (!match || !match[1]) {
            vscode.window.showWarningMessage('ファイルパスからコンテストIDを特定できませんでした。コンテスト用のディレクトリ構造（例: .../abc300/a/main.cpp）で作業してください。');
            return;
        }
        const contestId = match[1];

        // コードをバンドル
        const bundledCode = await bundleService.bundle(filePath);
        if (bundledCode === null) {
            // bundleService内でエラーメッセージは表示される想定
            return;
        }

        // クリップボードにコピー
        await vscode.env.clipboard.writeText(bundledCode);

        // 通知とブラウザでのページ表示
        const openInBrowser = '提出ページを開く';
        vscode.window.showInformationMessage(
            'コードをクリップボードにコピーしました。',
            openInBrowser
        ).then(selection => {
            if (selection === openInBrowser) {
                const submitUrl = `https://atcoder.jp/contests/${contestId}/submit`;
                vscode.env.openExternal(vscode.Uri.parse(submitUrl));
            }
        });
    });

    context.subscriptions.push(prepareForSubmissionCommand);
}
