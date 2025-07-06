import * as vscode from 'vscode';
import { ProblemDataService } from '../services/problemDataService';
import { Problem } from '../types';

/**
 * ブックマークされた問題をツリービューに表示するプロバイダーです。
 */
export class BookmarksProvider implements vscode.TreeDataProvider<string> {
    private _emitter = new vscode.EventEmitter<string | void>();
    readonly onDidChangeTreeData = this._emitter.event;

    constructor(
        private context: vscode.ExtensionContext,
        private problemDataService: ProblemDataService
    ) { }

    /**
     * ツリービューの表示を更新します。
     */
    refresh(): void {
        this._emitter.fire();
    }

    /**
     * ツリー項目（問題ID）から表示用のTreeItemを生成します。
     * @param problemId - ブックマークされた問題のID
     * @returns 表示するTreeItem
     */
    getTreeItem(problemId: string): vscode.TreeItem {
        // problemDataServiceのproblemCacheから直接問題情報を取得
        const problem: Problem | undefined = this.problemDataService.problemCache.get(problemId);

        const label = `${problem?.title || problemId} (diff: ${problem?.difficulty || 'N/A'})`;
        const item = new vscode.TreeItem(label);
        item.id = problemId;
        item.contextValue = 'bookmarkedProblem'; // コンテキストメニューの表示に使用
        item.command = {
            command: 'vscode.open',
            title: 'Open Problem Page',
            arguments: [vscode.Uri.parse(`https://atcoder.jp/contests/${problemId.split('_')[0]}/tasks/${problemId}`)]
        };
        return item;
    }

    /**
     * ツリーの子項目（ブックマークされた問題IDのリスト）を返します。
     * @param element - 親要素（ルートの場合はundefined）
     * @returns 問題IDのリスト
     */
    getChildren(element?: string): Thenable<string[]> {
        // ルート要素の場合のみ、ブックマークリストを返す
        if (!element) {
            const bookmarks = this.context.globalState.get<string[]>('atcoder-bookmarks', []);
            // 難易度順にソートして表示
            bookmarks.sort((a, b) => {
                const diffA = this.problemDataService.problemCache.get(a)?.difficulty ?? Infinity;
                const diffB = this.problemDataService.problemCache.get(b)?.difficulty ?? Infinity;
                return diffA - diffB;
            });
            return Promise.resolve(bookmarks);
        }
        // 子要素は存在しない
        return Promise.resolve([]);
    }
}