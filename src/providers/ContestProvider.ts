import * as vscode from 'vscode';
import { ProblemDataService } from '../services/problemDataService';
import { UserDataService } from '../services/userDataService';
import { Problem } from '../types';

// TreeViewに表示するアイテムの型を拡張
class ContestProblemItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly problemId: string,
        public readonly contestId: string,
    ) {
        super(label, collapsibleState);
        this.tooltip = `Problem ID: ${problemId}`;
        this.command = {
            command: 'vscode.open',
            title: 'Open Problem Page',
            arguments: [vscode.Uri.parse(`https://atcoder.jp/contests/${contestId}/tasks/${problemId}`)]
        };
    }
}

export class ContestProvider implements vscode.TreeDataProvider<ContestProblemItem> {

    private _onDidChangeTreeData: vscode.EventEmitter<ContestProblemItem | undefined | null | void> = new vscode.EventEmitter<ContestProblemItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<ContestProblemItem | undefined | null | void> = this._onDidChangeTreeData.event;

    private currentContestId?: string;

    constructor(
        private problemDataService: ProblemDataService,
        private userDataService: UserDataService
    ) {
        vscode.window.onDidChangeActiveTextEditor(() => this.refresh());
        this.problemDataService.onDidDataLoad(() => this.refresh());
    }

    /**
     * TreeViewの表示を更新します。
     */
    refresh(): void {
        const previousContestId = this.currentContestId;
        this.updateCurrentContestId();
        
        this._onDidChangeTreeData.fire();
    }

    /**
     * 現在開いているファイルからコンテストIDを特定し、プロパティを更新します。
     */
    private updateCurrentContestId(): void {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.uri.scheme === 'file') {
            const filePath = editor.document.uri.fsPath;
            console.log(`[ContestProvider] Active file path: ${filePath}`);
            const match = filePath.match(/([a-z0-9_]+)\/[a-z0-9_]+\/[^/]+$/i);
            if (match && match[1]) {
                this.currentContestId = match[1];
                console.log(`[ContestProvider] Extracted contest ID: ${this.currentContestId}`);
                return;
            }
            console.log(`[ContestProvider] No contest ID found for path: ${filePath}`);
        }
        this.currentContestId = undefined;
    }

    getTreeItem(element: ContestProblemItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: ContestProblemItem): Thenable<ContestProblemItem[]> {
        if (!element) {
            if (!this.currentContestId) {
                return Promise.resolve([new ContestProblemItem("コンテストフォルダを開いていません", vscode.TreeItemCollapsibleState.None, "", "")]);
            }

            let contestProblems = this.problemDataService.contestProblemCache.get(this.currentContestId);
            console.log(`[ContestProvider] contestProblems for ${this.currentContestId}:`, contestProblems);
            
            // データがundefinedの場合、再ロードを試みる
            if (!contestProblems) {
                vscode.window.showInformationMessage('コンテスト問題データをロード中です。しばらくお待ちください...');
                return Promise.resolve([new ContestProblemItem("問題リストを取得中...", vscode.TreeItemCollapsibleState.None, "", "")]);
            }

            const acSet = new Set(this.userDataService.acProblems.map(p => p.id));

            const items = contestProblems.map(cp => {
                const problem: Problem | undefined = this.problemDataService.problemCache.get(cp.problem_id);
                const isAc = acSet.has(cp.problem_id);
                
                const label = `${problem?.title || 'Loading...'}`;
                console.log(`[ContestProvider] Problem ID: ${cp.problem_id}, Problem Info:`, problem, `Label: ${label}`);
                const item = new ContestProblemItem(
                    label,
                    vscode.TreeItemCollapsibleState.None,
                    cp.problem_id,
                    cp.contest_id
                );
                
                item.description = `(diff: ${problem?.difficulty ?? 'N/A'})`;
                item.iconPath = new vscode.ThemeIcon(isAc ? 'check' : 'circle-outline');
                
                return item;
            });

            return Promise.resolve(items);
        }

        return Promise.resolve([]);
    }
}