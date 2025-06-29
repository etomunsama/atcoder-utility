import * as vscode from 'vscode';
import { Contest, ProblemInfo, ContestProblem } from '../types';
import { loadContestData, loadContestProblemData, loadMergedProblemData, loadProblemModelsData } from './atcoderApiService';


/**
 * AtCoderのコンテストや問題に関する静的なデータを管理するサービスです。
 * データのロードとキャッシュを担当し、他のサービスやプロバイダーにデータを提供します。
 */
export class ProblemDataService {
    /** コンテストIDをキーとしたコンテスト情報のキャッシュ */
    private _contestCache = new Map<string, Contest>();
    /** 問題IDをキーとした問題情報（タイトル、難易度など）のキャッシュ */
    private _problemCache = new Map<string, ProblemInfo>();
    /** コンテストIDをキーとした、そのコンテストに含まれる問題のリストのキャッシュ */
    private _contestProblemCache = new Map<string, ContestProblem[]>();

    constructor() { }

    /**
     * 全てのコンテスト、問題、コンテスト-問題関連データを外部APIからロードし、内部キャッシュを更新します。
     * 拡張機能の起動時や手動更新時に呼び出されます。
     */
    public async loadAllProblemData(): Promise<void> {
        // ３つのAPIから並行してデータを取得
        const [
            mergedProblems,
            contests,
            contestProblems,
            problemModels // 新しく追加
        ] = await Promise.all([
            loadMergedProblemData(),
            loadContestData(),
            loadContestProblemData(),
            loadProblemModelsData() // 新しく追加
        ]);

        // 取得したデータで各キャッシュを更新
        this._problemCache.clear();
        if (mergedProblems) {
            for (const problem of mergedProblems) {
                this._problemCache.set(problem.id, { 
                    title: problem.title,
                    point: problem.point,
                    // mergedProblemsにはdifficultyがないので、problemModelsから取得する
                    difficulty: problemModels?.[problem.id]?.difficulty // ここで難易度をマージ
                });
            }
        }

        this._contestCache.clear();
        if (contests) {
            for (const contest of contests) {
                this._contestCache.set(contest.id, contest);
            }
        }

        this._contestProblemCache.clear();
        if (contestProblems) {
            for (const cp of contestProblems) {
                if (!this._contestProblemCache.has(cp.contest_id)) {
                    this._contestProblemCache.set(cp.contest_id, []);
                }
                this._contestProblemCache.get(cp.contest_id)!.push(cp);
            }
        }
    }

    

    /** 問題情報のキャッシュ（読み取り専用） */
    public get problemCache(): ReadonlyMap<string, ProblemInfo> {
        return this._problemCache;
    }

    /** コンテスト情報のキャッシュ（読み取り専用） */
    public get contestCache(): ReadonlyMap<string, Contest> {
        return this._contestCache;
    }

    /** コンテスト-問題関連情報のキャッシュ（読み取り専用） */
    public get contestProblemCache(): ReadonlyMap<string, ContestProblem[]> {
        return this._contestProblemCache;
    }

    /**
     * ファイルURIから問題IDを抽出します。
     * @param uri 対象のファイルURI
     * @returns 抽出した問題ID。見つからない場合はundefined。
     */
    public getProblemIdFromUri(uri: vscode.Uri): string | undefined {
        const parts = uri.path.split('/');
        let problemChar: string | undefined;
        let contestId: string | undefined;

        // URIからコンテストIDと問題文字(a, b, ..)を抽出
        const lastPart = parts[parts.length - 1];
        if (lastPart.match(/^[a-h]$/)) { // .../abc100/a
            problemChar = lastPart;
            contestId = parts[parts.length - 2];
        } else { // .../abc100/a/main.cpp
            const parentDir = parts[parts.length - 2];
            if (parentDir?.match(/^[a-h]$/)) {
                problemChar = parentDir;
                contestId = parts[parts.length - 3];
            } else {
                return;
            }
        }

        if (!contestId || !problemChar) { return undefined; }

        const newKey = `${contestId}_${problemChar}`;
        const oldKey = `${contestId}_${problemChar.charCodeAt(0) - 'a'.charCodeAt(0) + 1}`;
        return this._problemCache.has(newKey) ? newKey : (this._problemCache.has(oldKey) ? oldKey : undefined);
    }
}
