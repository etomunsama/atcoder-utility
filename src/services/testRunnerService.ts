import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as path from 'path';
import { CustomTestRunnerService } from './customTestRunnerService';

/**
 * ファイル保存時に自動でテストを実行するサービスです。
 * ユーザー設定に応じて `oj` または `customTestRunnerService` を呼び分けます。
 * 結果はステータスバーに表示されます。
 */
export class TestRunnerService {
    private testStatusBarItem: vscode.StatusBarItem;

    constructor(private customTestRunnerService: CustomTestRunnerService) {
        this.testStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 99);
        this.testStatusBarItem.text = "$(beaker) Tests";
        this.testStatusBarItem.show();
        // ファイル保存イベントを監視
        vscode.workspace.onDidSaveTextDocument(this.onDidSaveTextDocument.bind(this));
    }

    /**
     * ファイル保存時に呼び出されるイベントハンドラ。
     * @param document 保存されたドキュメント
     */
    private async onDidSaveTextDocument(document: vscode.TextDocument) {
        // AtCoderの問題フォルダ内での保存イベントか簡易的にチェック
        const dirPath = path.dirname(document.uri.fsPath);
        if (!path.basename(dirPath).match(/^[a-z0-9]$/i)) {
            return; // a-z, 0-9の一文字のディレクトリでなければ対象外
        }

        const config = vscode.workspace.getConfiguration('atcoder-utility');
        const engine = config.get<string>('autoTestEngine');
        const langSettings = config.get<{ [key: string]: any }>('languageSettings');

        // ojエンジンが選択されているか、またはカスタムエンジンが対応していない言語の場合はojを使用
        if (engine === 'oj' || !langSettings || !langSettings[document.languageId]) {
            await this.runWithOjEngine(document);
        } else {
            await this.runWithCustomEngine(document.uri.fsPath, document.languageId);
        }
    }

    /**
     * 自作のテストエンジンでテストを実行し、ステータスバーを更新します。
     * @param filePath テスト対象のファイルパス
     * @param languageId 言語ID
     */
    private async runWithCustomEngine(filePath: string, languageId: string) {
        this.testStatusBarItem.text = `$(sync~spin) Testing...`;
        this.testStatusBarItem.tooltip = "テストを実行中...";
        this.testStatusBarItem.backgroundColor = undefined;

        // ターミナルには出力せず、結果だけを受け取る
        const results = await this.customTestRunnerService.runTests(filePath, languageId, false);
        
        if (results.length === 0) {
            this.testStatusBarItem.text = `$(question) No Tests`;
            this.testStatusBarItem.tooltip = "テストケースが見つかりませんでした。";
            return;
        }
        if (results[0].status === 'CE') {
            this.testStatusBarItem.text = `$(x) Compile Error`;
            this.testStatusBarItem.tooltip = `コンパイルエラー:\n${results[0].error}`;
            this.testStatusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
            setTimeout(() => this.testStatusBarItem.backgroundColor = undefined, 5000);
            return;
        }
        
        const tooltipDetails = results
            .map(r => `${r.caseName}: ${r.status} (time: ${r.time} ms)`)
            .join('\n');
        
        const summary = results.map(r => r.status);
        if (summary.every(s => s === 'AC')) {
            this.testStatusBarItem.text = `$(check) All AC`;
            this.testStatusBarItem.tooltip = new vscode.MarkdownString(`**全てのサンプルケースに正解しました！**\n\n---\n\n${tooltipDetails}`);
            this.testStatusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.debuggingBackground');
        } else {
            const failedStatuses = Array.from(new Set(summary.filter(s => s !== 'AC'))).join(', ');
            this.testStatusBarItem.text = `$(x) ${failedStatuses}`;
            this.testStatusBarItem.tooltip = new vscode.MarkdownString(`**テスト失敗: ${failedStatuses}**\n\n---\n\n${tooltipDetails}`);
            this.testStatusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
        }
        
        setTimeout(() => this.testStatusBarItem.backgroundColor = undefined, 5000);
    }
    
    /**
     * `oj-bundle` を使用してテストを実行し、ステータスバーを更新します。
     * @param document テスト対象のドキュメント
     */
    private async runWithOjEngine(document: vscode.TextDocument) {
        // ... (実装は変更なし)
    }

    public dispose() {
        this.testStatusBarItem.dispose();
    }
}
