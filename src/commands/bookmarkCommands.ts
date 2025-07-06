import * as vscode from 'vscode';
import { ProblemDataService } from '../services/problemDataService';
import { BookmarksProvider } from '../providers/BookmarksProvider';

/**
 * ブックマーク関連のコマンド（追加・削除）を登録します。
 * @param context 拡張機能のコンテキスト
 * @param problemDataService 問題データを扱うサービス
 * @param bookmarksProvider ブックマークビューのプロバイダー
 */
export function registerBookmarkCommands(
    context: vscode.ExtensionContext,
    problemDataService: ProblemDataService,
    bookmarksProvider: BookmarksProvider
) {
    /**
     * 問題をブックマークに追加するコマンド
     */
    const addBookmarkCommand = vscode.commands.registerCommand('atcoder-utility.addBookmark', (uri: vscode.Uri) => {
        const problemId = problemDataService.getProblemIdFromUri(uri);
        if (!problemId) {
            vscode.window.showWarningMessage('ファイルのパスから問題IDを特定できませんでした。');
            return;
        }

        const bookmarks = context.globalState.get<string[]>('atcoder-bookmarks', []);
        if (!bookmarks.includes(problemId)) {
            bookmarks.push(problemId);
            context.globalState.update('atcoder-bookmarks', bookmarks);
            bookmarksProvider.refresh(); // ブックマークビューを更新
            vscode.window.showInformationMessage(`ブックマークに追加しました: ${problemId}`);
        } else {
            vscode.window.showInformationMessage('この問題はすでにブックマークされています。');
        }
    });

    /**
     * 問題をブックマークから削除するコマンド
     */
    const removeBookmarkCommand = vscode.commands.registerCommand('atcoder-utility.removeBookmark', (target: vscode.Uri | string) => {
        let problemId: string | undefined;

        // コマンドの実行元（エディタのコンテキストメニュー or ツリービュー）によって引数の型が異なるため分岐
        if (target instanceof vscode.Uri) {
            problemId = problemDataService.getProblemIdFromUri(target);
        } else if (typeof target === 'string') {
            problemId = target;
        }

        if (!problemId) {
            vscode.window.showWarningMessage('ファイルのパスから問題IDを特定できませんでした。');
            return;
        }

        let bookmarks = context.globalState.get<string[]>('atcoder-bookmarks', []);
        const index = bookmarks.indexOf(problemId);
        if (index > -1) {
            bookmarks.splice(index, 1);
            context.globalState.update('atcoder-bookmarks', bookmarks);
            bookmarksProvider.refresh(); // ブックマークビューを更新
            vscode.window.showInformationMessage(`ブックマークを解除しました: ${problemId}`);
        }
    });

    context.subscriptions.push(addBookmarkCommand, removeBookmarkCommand);
}