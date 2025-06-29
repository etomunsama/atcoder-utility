import * as vscode from 'vscode';
import { calculateWinProbability } from '../extension';
import { ProblemDataService } from '../services/problemDataService';
import { UserDataService } from '../services/userDataService';

/**
 * エクスプローラー上のファイルとフォルダに、AtCoder関連の情報を付与するデコレーションプロバイダーです。
 * - コンテストフォルダ：コンテスト名と開始時刻を表示
 * - 問題フォルダ/ファイル：AC済みか、正解確率（色分け）を表示
 */
export class ProblemDecorationProvider implements vscode.FileDecorationProvider {
    private _emitter = new vscode.EventEmitter<vscode.Uri | vscode.Uri[] | undefined>();
    readonly onDidChangeFileDecorations = this._emitter.event;

    constructor(
        private problemDataService: ProblemDataService,
        private userDataService: UserDataService
    ) { }

    /**
     * ビューの表示を更新します。
     * タイムアウトを設けて、一度に大量の更新要求が来ても対応できるようにします。
     */
    refresh(): void {
        setTimeout(() => this._emitter.fire(undefined), 200);
    }

    /**
     * 指定されたURIに対してファイルデコレーションを提供します。
     * @param uri - デコレーション対象のファイル/フォルダURI
     * @returns FileDecorationオブジェクト
     */
    provideFileDecoration(uri: vscode.Uri): vscode.ProviderResult<vscode.FileDecoration> {
        const parts = uri.path.split('/');
        const lastPart = parts[parts.length - 1];

        // --- コンテストフォルダのデコレーション ---
        const contestInfo = this.problemDataService.contestCache.get(lastPart);
        if (contestInfo) {
            const startTime = new Date(contestInfo.start_epoch_second * 1000);
            const tooltip = `${contestInfo.title}\n開始: ${startTime.toLocaleString('ja-JP')}`;
            return new vscode.FileDecoration(undefined, tooltip);
        }

        // --- 問題フォルダ/ファイルのデコレーション ---
        let problemChar: string | undefined;
        let contestId: string | undefined;

        // URIからコンテストIDと問題文字(a, b, ..)を抽出
        if (lastPart.match(/^[a-h]$/)) {
            problemChar = lastPart;
            contestId = parts[parts.length - 2];
        } else {
            const parentDir = parts[parts.length - 2];
            if (parentDir?.match(/^[a-h]$/)) {
                problemChar = parentDir;
                contestId = parts[parts.length - 3];
            } else {
                return; // 問題フォルダ/ファイルでなければ何もしない
            }
        }

        if (!contestId || !problemChar) { return; }

        // 新旧両方の問題ID形式に対応
        const newKey = `${contestId}_${problemChar}`;
        const oldKey = `${contestId}_${problemChar.charCodeAt(0) - 'a'.charCodeAt(0) + 1}`;
        const problemId = this.problemDataService.problemCache.has(newKey) ? newKey : oldKey;

        // AC済みかチェック
        if (this.userDataService.acProblems.some(p => p.id === problemId)) {
            return new vscode.FileDecoration('✅', 'Accepted', new vscode.ThemeColor('gitDecoration.ignoredResourceForeground'));
        }

        const problemInfo = this.problemDataService.problemCache.get(problemId);
        if (!this.userDataService.userRatingInfo) {
            return new vscode.FileDecoration('…', 'ユーザー情報取得中...');
        }
        if (!problemInfo?.difficulty) {
            return; // 難易度不明なら何もしない
        }

        // 正解確率に基づいて色とバッジを決定
        const probability = calculateWinProbability(this.userDataService.userRatingInfo.current, problemInfo.difficulty);
        const probPercent = Math.round(probability * 100);

        let badge: string;
        let color: vscode.ThemeColor;
        if (probPercent > 75) {
            badge = '🔵'; // 簡単
            color = new vscode.ThemeColor('gitDecoration.addedResourceForeground');
        } else if (probPercent > 40) {
            badge = '🟡'; // 適正
            color = new vscode.ThemeColor('gitDecoration.modifiedResourceForeground');
        } else {
            badge = '🔴'; // 難しい
            color = new vscode.ThemeColor('gitDecoration.deletedResourceForeground');
        }

        const tooltip = `正解確率: ${probPercent}% (難易度: ${problemInfo.difficulty})`;
        return new vscode.FileDecoration(badge, tooltip, color);
    }
}