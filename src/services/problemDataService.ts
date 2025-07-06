import * as vscode from 'vscode';
import { Contest, ProblemInfo, ContestProblem } from '../types';
import { AtCoderApiService } from './atcoderApiService';

/**
 * AtCoderのコンテストや問題に関する静的なデータを管理するサービスです。
 * データのロードとキャッシュを担当し、他のサービスやプロバイダーにデータを提供します。
 */
export class ProblemDataService {
    private _onDidDataLoad: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
    public readonly onDidDataLoad: vscode.Event<void> = this._onDidDataLoad.event;
    /** コンテストIDをキーとしたコンテスト情報のキャッシュ */
    private _contestCache = new Map<string, Contest>();
    /** 問題IDをキーとした問題情報（タイトル、難易度など）のキャッシュ */
    private _problemCache = new Map<string, ProblemInfo>();
    /** コンテストIDをキーとした、そのコンテストに含まれる問題のリストのキャッシュ */
    private _contestProblemCache = new Map<string, ContestProblem[]>();

    constructor(private atcoderApiService: AtCoderApiService) { }

    /**
     * 全てのコンテスト、問題、コンテスト-問題関連データを外部APIからロードし、内部キャッシュを更新します。
     * 拡張機能の起動時や手動更新時に呼び出されます。
     */
    public async loadAllProblemData(): Promise<void> {
        const [
            mergedProblems,
            contests,
            contestProblems,
            problemModels
        ] = await Promise.all([
            this.atcoderApiService.loadMergedProblemData(),
            this.atcoderApiService.loadContestData(),
            this.atcoderApiService.loadContestProblemData(),
            this.atcoderApiService.loadProblemModelsData()
        ]);

        this._problemCache.clear();
        if (mergedProblems) {
            for (const problem of mergedProblems) {
                this._problemCache.set(problem.id, { 
                    title: problem.title,
                    point: problem.point,
                    difficulty: problemModels?.[problem.id]?.difficulty
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
        this._onDidDataLoad.fire(); // データロード完了を通知
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
     * abc313_ex のような特殊な問題IDも、対応するアルファベット形式に変換します。
     * @param uri 対象のファイルURI
     * @returns 抽出した問題ID。見つからない場合はundefined。
     */
    public getProblemIdFromUri(uri: vscode.Uri): string | undefined {
        const filePath = uri.fsPath;
        console.log(`[ProblemDataService] getProblemIdFromUri: Processing filePath: ${filePath}`);
        const parts = filePath.split('/');
        console.log(`[ProblemDataService] getProblemIdFromUri: parts: ${JSON.stringify(parts)}`);
        let problemCharCandidate: string | undefined;
        let contestIdCandidate: string | undefined;

        const lastPart = parts[parts.length - 1];
        const parentDir = parts[parts.length - 2];
        console.log(`[ProblemDataService] getProblemIdFromUri: lastPart: ${lastPart}, parentDir: ${parentDir}`);

        // 形式: .../contest_name/task_letter/main.cpp
        if (parentDir?.match(/^[a-z]$/i) && parts[parts.length - 3]?.match(/^(abc|arc|agc|ahc|adt|adt_intro|tessoku|practice|typical90|dp|abs)\d*$/i)) {
            problemCharCandidate = parentDir.toLowerCase();
            contestIdCandidate = parts[parts.length - 3].toLowerCase();
            console.log(`[ProblemDataService] getProblemIdFromUri: Matched pattern 1. contestIdCandidate: ${contestIdCandidate}, problemCharCandidate: ${problemCharCandidate}`);
        } 
        // 形式: .../contest_name/task_letter (フォルダ自体が問題名)
        else if (lastPart.match(/^[a-z]$/i) && parts[parts.length - 2]?.match(/^(abc|arc|agc|ahc|adt|adt_intro|tessoku|practice|typical90|dp|abs)\d*$/i)) {
            problemCharCandidate = lastPart.toLowerCase();
            contestIdCandidate = parts[parts.length - 2].toLowerCase();
            console.log(`[ProblemDataService] getProblemIdFromUri: Matched pattern 2. contestIdCandidate: ${contestIdCandidate}, problemCharCandidate: ${problemCharCandidate}`);
        }
        // 形式: .../contest_name/task_name (例: abc313_ex)
        else if (lastPart.match(/^[a-z0-9_]+$/i) && parts[parts.length - 2]?.match(/^(abc|arc|agc|ahc|adt|adt_intro|tessoku|practice|typical90|dp|abs)\d*$/i)) {
            problemCharCandidate = lastPart.toLowerCase(); // 例: abc313_ex
            contestIdCandidate = parts[parts.length - 2].toLowerCase();
            console.log(`[ProblemDataService] getProblemIdFromUri: Matched pattern 3. contestIdCandidate: ${contestIdCandidate}, problemCharCandidate: ${problemCharCandidate}`);
        }


        if (!contestIdCandidate || !problemCharCandidate) {
            console.log(`[ProblemDataService] getProblemIdFromUri: No valid contestIdCandidate or problemCharCandidate found. Returning undefined.`);
            return undefined;
        }

        const potentialProblemId = `${contestIdCandidate}_${problemCharCandidate}`;
        console.log(`[ProblemDataService] getProblemIdFromUri: potentialProblemId: ${potentialProblemId}`);
        if (this._problemCache.has(potentialProblemId)) {
            console.log(`[ProblemDataService] getProblemIdFromUri: Found in problemCache directly. Returning ${potentialProblemId}`);
            return potentialProblemId;
        }

        if (problemCharCandidate.includes('_ex')) {
            console.log(`[ProblemDataService] getProblemIdFromUri: Handling _ex case.`);
            const contestProblems = this._contestProblemCache.get(contestIdCandidate);
            console.log(`[ProblemDataService] getProblemIdFromUri: contestProblems for ${contestIdCandidate}: ${contestProblems ? contestProblems.length : 0} items.`);
            if (contestProblems) {
                for (const cp of contestProblems) {
                    console.log(`[ProblemDataService] getProblemIdFromUri: Checking contest problem: ${cp.problem_id}, title: ${this._problemCache.get(cp.problem_id)?.title}`);
                    if (cp.problem_id.startsWith(`${contestIdCandidate}_`) && cp.problem_id.endsWith('_h') && this._problemCache.get(cp.problem_id)?.title.toLowerCase().includes('ex')) {
                        console.log(`[ProblemDataService] getProblemIdFromUri: Found _ex mapping. Returning ${cp.problem_id}`);
                        return cp.problem_id;
                    }
                }
            }
        }
        
        if (problemCharCandidate.length === 1 && problemCharCandidate.match(/^[a-z]$/)) {
            console.log(`[ProblemDataService] getProblemIdFromUri: Handling single char case.`);
            const newKey = `${contestIdCandidate}_${problemCharCandidate}`;
            const oldKey = `${contestIdCandidate}_${problemCharCandidate.charCodeAt(0) - 'a'.charCodeAt(0) + 1}`;
            console.log(`[ProblemDataService] getProblemIdFromUri: newKey: ${newKey}, oldKey: ${oldKey}`);
            if (this._problemCache.has(newKey)) {
                console.log(`[ProblemDataService] getProblemIdFromUri: Found newKey in problemCache. Returning ${newKey}`);
                return newKey;
            }
            if (this._problemCache.has(oldKey)) {
                console.log(`[ProblemDataService] getProblemIdFromUri: Found oldKey in problemCache. Returning ${oldKey}`);
                return oldKey;
            }
        }
        
        for (const [problemId, problemInfo] of this._problemCache.entries()) {
            if (problemId.startsWith(`${contestIdCandidate}_`) && problemInfo.title.toLowerCase().includes(problemCharCandidate)) {
                console.log(`[ProblemDataService] getProblemIdFromUri: Found by title match. Returning ${problemId}`);
                return problemId;
            }
        }

        console.log(`[ProblemDataService] getProblemIdFromUri: No problem ID found. Returning undefined.`);
        return undefined;
    }
}