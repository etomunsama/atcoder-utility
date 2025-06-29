/**
 * コンテストのパフォーマンスやレーティング変動を推定計算するサービスです。
 * 計算式はAtCoderの公式のものではなく、コミュニティで知られている近似式に基づいています。
 */
export class PerformanceCalculationService {
    /**
     * 順位表データと自分の順位から、パフォーマンスを推定します。
     * @param standingsData 順位表の全ユーザーデータ
     * @param myRank 自分の順位
     * @returns 推定パフォーマンス
     */
    public static estimatePerformance(standingsData: any[], myRank: number): number {
        // 自分より順位が「良い」人と「悪い」人を探すための仮想的な境界を考える
        const upperRank = Math.max(1, myRank - Math.sqrt(myRank) * 2);
        const lowerRank = myRank + Math.sqrt(myRank) * 2;

        let seed = 0;
        let count = 0;

        for (const user of standingsData) {
            // Unrated参加者や、レート情報がないユーザーは計算から除外
            if (user.IsRated === false || typeof user.Rating !== 'number') {
                continue;
            }
            
            // 境界内のユーザーのレートを元にseed値を計算
            if (user.Rank >= upperRank && user.Rank <= lowerRank) {
                seed += Math.pow(2, user.Rating / 800.0);
                count++;
            }
        }

        if (count === 0) {
            // 境界内に誰もいない場合、自分の順位に最も近いRatedユーザーを探す
            let closestRatedUser: any | undefined;
            let minRankDiff = Infinity;
            for (const user of standingsData) {
                if (user.IsRated === false || typeof user.Rating !== 'number') { continue; }
                const rankDiff = Math.abs(user.Rank - myRank);
                if (rankDiff < minRankDiff) {
                    minRankDiff = rankDiff;
                    closestRatedUser = user;
                }
            }
            if (closestRatedUser) {
                return closestRatedUser.Rating; // 最も近い人のレートをパフォーマンスとする
            }
            return 1200; // それでも見つからない場合はデフォルト値
        }

        const performance = 800.0 * Math.log2(seed / count);
        return Math.round(performance);
    }

    /**
     * 現在のレートとパフォーマンスから、レート変動を推定します。
     * @param currentRating 現在のレート
     * @param performance 今回のパフォーマンス
     * @returns 推定レート変化量
     */
    public static estimateRatingChange(currentRating: number, performance: number): number {
        const diff = performance - currentRating;
        const numerator = 1.0;
        const denominator = (1.0 / Math.pow(10, diff / 400.0)) + 1.0;
        const actualChange = 800 * (1.0 - (numerator / denominator));

        // レートが低いほど変動幅が大きくなる補正
        const cappedRating = Math.max(400, currentRating);
        const weight = 1 / (1 + Math.exp((cappedRating - 1200) / 200) * (cappedRating / 1200));
        
        return Math.round(actualChange * weight);
    }
}
