/**
 * この拡張機能全体で使用される型定義です。
 * 主にAtCoder Problems APIから取得するデータの構造を定義します。
 */

/**
 * コンテスト情報を表すインターフェース (kenkoooo.com API)
 */
export interface Contest {
    /** コンテストID (例: "abc300") */
    id: string;
    /** コンテスト開始時刻 (Unixエポック秒) */
    start_epoch_second: number;
    /** コンテスト時間 (秒) */
    duration_second: number;
    /** コンテスト名 (例: "AtCoder Beginner Contest 300") */
    title: string;
    /** レート変動対象範囲 (例: "~ 1999") */
    rate_change: string;
}

/**
 * 提出情報を表すインターフェース (kenkoooo.com API)
 */
export interface Submission {
    /** 提出ID */
    id: number;
    /** 提出時刻 (Unixエポック秒) */
    epoch_second: number;
    /** 問題ID */
    problem_id: string;
    /** コンテストID */
    contest_id: string;
    /** ユーザーID */
    user_id: string;
    /** 言語 (例: "C++ (GCC 9.2.1)") */
    language: string;
    /** 得点 */
    point: number;
    /** コード長 */
    length: number;
    /** 提出結果 (例: "AC", "WA") */
    result: string;
    /** 実行時間 (ミリ秒) */
    execution_time?: number;
}

/**
 * 問題情報を表すインターフェース (kenkoooo.com API - problems.json)
 */
export interface ProblemEntry {
    /** 問題ID (例: "abc300_a") */
    id: string;
    /** コンテストID */
    contest_id: string;
    /** 問題タイトル (例: "N-choice question") */
    title: string;
    /** 問題の満点。コンテストによってはnullの場合がある。 */
    point: number | null;
}

/**
 * 問題の難易度情報を表すインターフェース (kenkoooo.com API - problem-models.json)
 */
export interface ProblemModels {
    [key: string]: {
        /** 推定難易度。存在しない場合はundefined。 */
        difficulty?: number;
        /** 難易度が確定しているか */
        is_experimental?: boolean;
    };
}

/**
 * コンテストと問題の関連情報を表すインターフェース (kenkoooo.com API - contest-problem.json)
 */
export interface ContestProblem {
    /** コンテストID */
    contest_id: string;
    /** 問題ID */
    problem_id: string;
    /** 問題インデックス (例: "A") */
    problem_index: string;
}

/**
 * ユーザーのレーティング履歴の各エントリを表すインターフェース
 */
export interface UserRatingHistoryEntry {
    IsRated: boolean;
    Place: number;
    OldRating: number;
    NewRating: number;
    Performance: number;
    ContestType: string;
    EndTime: number;
}

/**
 * 内部で利用する、より詳細な問題情報を表すインターフェース
 */
export interface ProblemInfo {
    point?: number | null;
    title?: string;
    difficulty?: number;
}

/**
 * AC済みの問題情報を表すインターフェース
 */
export interface AcProblem {
    id: string;
    epoch_second: number;
    difficulty?: number;
}

/**
 * 推薦問題を表すインターフェース
 */
export interface Recommendation {
    problem_id: string;
    difficulty: number;
}

/**
 * UIの表示を更新する機能を持つプロバイダーのためのインターフェース
 */
export interface RefreshableProvider {
    refresh(): void;
}

/**
 * サンプルケースを表すインターフェース
 */
export interface SampleCase {
    input: string;
    output: string;
}

/**
 * アクティビティビューで表示する期間の型
 */
export type TimeRange = '1week' | '1month' | '3months' | '6months';
