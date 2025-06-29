import * as vscode from 'vscode';
import { AcProblem, UserRatingHistoryEntry, Recommendation } from '../types';
import { scrapeUserRating, loadAcceptedProblems, getUserRatingHistory, getCurrentUserRating } from './atcoderApiService';
import { ProblemDataService } from './problemDataService';

/**
 * ログインしているユーザーに特化したデータ（レーティング、AC状況、履歴など）を管理するサービスです。
 * データのロードとキャッシュ、およびユーザーに関連する統計情報の計算を担当します。
 */
export class UserDataService {
    /** ユーザーの現在/最高レーティング */
    private _userRatingInfo: { current: number; highest: number; } | null = null;
    /** ユーザーのAC済み問題リスト */
    private _acProblems: AcProblem[] = [];
    /** ユーザーのレーティング履歴 */
    private _userRatingHistory: UserRatingHistoryEntry[] = [];
    /** ユーザーへのおすすめ問題リスト */
    private _recommendedProblems: Recommendation[] = [];

    constructor(private problemDataService: ProblemDataService) { }

    /**
     * 指定されたユーザーIDの全データを外部APIからロードし、内部キャッシュを更新します。
     * @param userId - AtCoderのユーザーID
     */
    public async loadUserData(userId: string): Promise<void> {
        if (!userId) {
            // ユーザーIDがない場合は全データをクリア
            this._userRatingInfo = null;
            this._acProblems = [];
            this._userRatingHistory = [];
            this._recommendedProblems = [];
            return;
        }

        // ３つのAPIから並行してデータを取得
        const [acceptedProblems, userHistory] = await Promise.all([
            loadAcceptedProblems(userId),
            getUserRatingHistory(userId)
        ]);

        this._acProblems = acceptedProblems || [];
        this._userRatingHistory = userHistory || [];

        if (this._userRatingHistory.length > 0) {
            const currentRating = this._userRatingHistory[0].NewRating; // 最新のレーティングを取得
            const highestRating = Math.max(...this._userRatingHistory.map(entry => entry.NewRating));
            this._userRatingInfo = { current: currentRating, highest: highestRating };
        } else {
            this._userRatingInfo = null;
        }

        // データをロードした後に推薦問題を生成
        this.generateRecommendedProblems();
    }

    // Getters for private properties (read-only access)
    public get userRatingInfo(): Readonly<{ current: number; highest: number; } | null> { return this._userRatingInfo; }
    public get acProblems(): ReadonlyArray<AcProblem> { return this._acProblems; }
    public get userRatingHistory(): ReadonlyArray<UserRatingHistoryEntry> { return this._userRatingHistory; }
    public get recommendedProblems(): ReadonlyArray<Recommendation> { return this._recommendedProblems; }

    /**
     * レーティング値に対応する色と絵文字を取得します。
     * @param rating - レーティング値
     * @returns 色の名前と絵文字を含むオブジェクト
     */
    public getRatingInfo(rating: number): { name: string; emoji: string } {
        if (rating >= 2800) return { name: '赤', emoji: '🔴' };
        if (rating >= 2400) return { name: '橙', emoji: '🟠' };
        if (rating >= 2000) return { name: '黄', emoji: '🟡' };
        if (rating >= 1600) return { name: '青', emoji: '🔵' };
        if (rating >= 1200) return { name: '水', emoji: '💧' };
        if (rating >= 800) return { name: '緑', emoji: '🟢' };
        if (rating >= 400) return { name: '茶', emoji: '🟤' };
        if (rating < 400) return { name: '灰', emoji: '⚪' };
        return { name: '無', emoji: '⚫' };
    }

    /**
     * AC履歴から現在の継続日数を計算します。
     * @returns 継続日数
     */
    public calculateStreak(): number {
        if (this._acProblems.length === 0) { return 0; }
        // ACした日付のSetを作成し、降順にソート
        const acDates = [...new Set(this._acProblems.map(s => new Date(s.epoch_second * 1000).toLocaleDateString()))]
            .map(dateStr => new Date(dateStr))
            .sort((a, b) => b.getTime() - a.getTime());

        if (acDates.length === 0) { return 0; }

        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        // 今日または昨日ACしたかチェック
        if (acDates[0].getTime() === today.getTime()) {
            streak = 1;
        } else if (acDates[0].getTime() === yesterday.getTime()) {
            streak = 1;
        } else {
            return 0; // 直近のACが今日でも昨日でもなければストリークは0
        }

        let currentDate = new Date(acDates[0]);
        for (let i = 1; i < acDates.length; i++) {
            const previousDay = new Date(currentDate);
            previousDay.setDate(currentDate.getDate() - 1);
            if (acDates[i].getTime() === previousDay.getTime()) {
                streak++;
                currentDate = acDates[i];
            } else {
                break; // 日付が連続していなければ終了
            }
        }
        return streak;
    }

    /**
     * 色別のAC数を集計します。
     * @returns 色の名前をキー、AC数を値とするMap
     */
    public countAcByColor(): Map<string, number> {
        const colorCounts = new Map<string, number>([["赤", 0], ["橙", 0], ["黄", 0], ["青", 0], ["水", 0], ["緑", 0], ["茶", 0], ["灰", 0]]);
        for (const p of this._acProblems) {
            if (p.difficulty !== undefined) {
                const colorName = this.getRatingInfo(p.difficulty).name;
                if (colorCounts.has(colorName)) {
                    colorCounts.set(colorName, colorCounts.get(colorName)! + 1);
                }
            }
        }
        return colorCounts;
    }

    /**
     * ユーザーの現在の状態に基づいて推薦問題を生成します。
     */
    private generateRecommendedProblems(): void {
        if (!this._userRatingInfo) {
            this._recommendedProblems = [];
            return;
        }
        const R = this._userRatingInfo.current;
        const L = 15; // 推薦する問題数
        const acSet = new Set(this._acProblems.map(p => p.id));

        const recs = Array.from(this.problemDataService.problemCache.entries())
            .filter(([id, p]) => p.difficulty && p.difficulty >= R && p.difficulty < R + 200 && !acSet.has(id))
            .sort(([, a], [, b]) => a.difficulty! - b.difficulty!)
            .slice(0, L)
            .map(([id, info]) => ({ problem_id: id, difficulty: info.difficulty! }));

        this._recommendedProblems = recs;
    }
}
