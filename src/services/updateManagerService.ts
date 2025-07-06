import * as vscode from 'vscode';
import { ProblemDataService } from './problemDataService';
import { UserDataService } from './userDataService';
import { StatusBarService } from './statusBarService';
import { RefreshableProvider } from '../types';

/**
 * データの自動更新や設定変更の監視など、拡張機能のライフサイクルを管理するサービスです。
 */
export class UpdateManagerService implements vscode.Disposable {
    private autoRefreshTimer: NodeJS.Timeout | undefined;

    constructor(
        private context: vscode.ExtensionContext,
        private problemDataService: ProblemDataService,
        private userDataService: UserDataService,
        private statusBarService: StatusBarService,
        private providersToRefresh: RefreshableProvider[]
    ) {
        // 設定変更を監視し、ユーザーIDが変更されたらデータを再読み込み
        this.context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(async e => {
            if (e.affectsConfiguration('atcoder-utility.userId')) {
                const currentUserId = vscode.workspace.getConfiguration('atcoder-utility').get<string>('userId') || '';
                await this.userDataService.loadUserData(currentUserId);
                this.statusBarService.updateUserStatusBar(currentUserId);
                this.providersToRefresh.forEach(p => p.refresh());
            }
        }));

        
    }

    /**
     * リソース（タイマー）を解放します。
     */
    public dispose() {
        if (this.autoRefreshTimer) {
            clearInterval(this.autoRefreshTimer);
            this.autoRefreshTimer = undefined;
        }
    }
}
