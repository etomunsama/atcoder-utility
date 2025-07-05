import * as vscode from 'vscode';
import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Contest, Submission, ProblemEntry, ProblemModels, ContestProblem, UserRatingHistoryEntry, ProblemInfo, AcProblem, SampleCase } from '../types';

interface AtCoderSubmission {
    id: number;
    epoch_second: number;
    problem_id: string;
    contest_id: string;
    user_id: string;
    language: string;
    point: number;
    length: number;
    result: string; // "AC", "WA", "TLE", etc.
    // other fields omitted for brevity
}

interface AtCoderProblem {
    id: string;
    contest_id: string;
    title: string;
    point?: number;
    difficulty?: number;
    tags?: string[];
}

interface AtCoderUserRatingHistory {
    IsRated: boolean;
    StartTime: number; // Unix epoch seconds
    EndTime: number;   // Unix epoch seconds
    ContestType: string;
    ContestScreenName: string;
    ContestName: string;
    OldRating: number;
    NewRating: number;
    InnerPerformance: number;
    ContestParticipation: number;
    // other fields omitted for brevity
}

/**
 * AtCoderのWebサイトや外部APIからデータを取得するためのサービスです。
 * Webスクレイピングとkenkoooo.comのAPIへのリクエストを扱います。
 * 注意: Webスクレイピングに依存する関数は、AtCoderのサイト構造の変更によって動作しなくなる可能性があります。
 */

/**
 * ユーザーのレーティング履歴をAtCoderのプロフィールページからスクレイピングして取得します。
 * @param userId - AtCoderのユーザーID
 * @returns ユーザーのレーティング履歴エントリの配列
 */
export async function scrapeUserRating(userId: string): Promise<UserRatingHistoryEntry[]> {
    const url = `https://atcoder.jp/users/${userId}/history`;
    try {
        const response = await axios.get(url, { timeout: 30000, validateStatus: (status) => status >= 200 && status < 500 });
        if (response.status === 404) {
            console.error(`User history page not found for '${userId}'.`);
            vscode.window.showErrorMessage(`AtCoderユーザー '${userId}' のレーティング履歴ページが見つかりません。`);
            return [];
        }

        const $ = cheerio.load(response.data as string);
        // 履歴テーブルのセレクタ。サイトの構造変更に対応するため、複数の候補を試す
        let historyTable = $('#history');
        if (historyTable.length === 0) {
            historyTable = $('table.table-default.dataTable').first();
        }
        if (historyTable.length === 0) {
            console.error(`Rating history table NOT FOUND for ${userId}.`);
            vscode.window.showErrorMessage(`AtCoderユーザー '${userId}' の履歴テーブルが見つかりません。サイト構造が変更された可能性があります。`);
            return [];
        }

        const tempHistory: UserRatingHistoryEntry[] = [];
        const headerCells = historyTable.find('thead th');
        const colMap: { [key: string]: number } = {};
        // ヘッダーから各列のインデックスを特定
        headerCells.each((i, el) => {
            const headerText = $(el).text().trim().toLowerCase(); // 小文字に変換
            if (headerText.includes('date')) { colMap.endTime = i; }
            else if (headerText.includes('contest')) { colMap.contest = i; }
            else if (headerText.includes('rank')) { colMap.place = i; }
            else if (headerText.includes('performance')) { colMap.performance = i; }
            else if (headerText.includes('new rating')) { colMap.newRating = i; }
            else if (headerText.includes('diff')) { colMap.diff = i; } // 新しいキー
        });

        if (colMap.endTime === undefined || colMap.newRating === undefined || colMap.performance === undefined || colMap.diff === undefined) {
            console.error(`Required columns not found in history table headers. Current colMap: ${JSON.stringify(colMap)}`);
            vscode.window.showErrorMessage(`AtCoderユーザー '${userId}' のレーティング履歴テーブルのヘッダーが見つかりません。サイト構造が変更された可能性があります。`);
            return [];
        }

        let lastNewRating: number | undefined = undefined; // 以前のNewRatingを保持するための変数

        historyTable.find('tbody tr').each((_i, element) => {
            const row = $(element);
            const cells = row.find('td');
            const EndTimeStr = cells.eq(colMap.endTime!).find('time').attr('data-order') || cells.eq(colMap.endTime!).text().trim();
            const NewRatingStr = cells.eq(colMap.newRating!).find('span').text().trim(); // spanタグの中のテキストを取得
            const PerformanceStr = cells.eq(colMap.performance!).find('span').text().trim(); // spanタグの中のテキストを取得
            const DiffStr = cells.eq(colMap.diff!).text().trim(); // 差分を取得

            const Place = colMap.place !== undefined ? parseInt(cells.eq(colMap.place!).text().trim(), 10) || 0 : 0;
            
            // IsRatedの判断をdata-search属性から行う
            const IsRated = cells.eq(colMap.diff!).attr('data-search') === '[RATED]';

            const EndTime = Date.parse(EndTimeStr) / 1000;
            const NewRating = parseInt(NewRatingStr, 10);
            const Performance = parseInt(PerformanceStr, 10);
            const Diff = parseInt(DiffStr, 10) || 0; // 差分を数値に変換。'-'の場合は0とする

            // OldRatingを計算
            const OldRating = NewRating - Diff;

            if (!isNaN(EndTime) && !isNaN(OldRating) && !isNaN(NewRating) && !isNaN(Performance)) {
                tempHistory.push({ IsRated, Place, ContestType: '', EndTime, OldRating, NewRating, Performance });
            }
        });
        return tempHistory.sort((a, b) => b.EndTime - a.EndTime);
    } catch (e) {
        console.error(`Failed to scrape rating history for ${userId}:`, e);
        return [];
    }
}

/**
 * VS Codeの設定からユーザーIDを取得します。
 * @returns 設定されたユーザーID、またはundefined
 */
function getUserIdFromConfig(): string | undefined {
    const config = vscode.workspace.getConfiguration('atcoder-utility');
    const userId = config.get<string>('userId');
    if (!userId) {
        vscode.window.showErrorMessage('AtCoder User ID is not set. Please configure "atcoder-utility.userId" in settings.');
    }
    return userId;
}

/**
 * 指定されたユーザーのAtCoderレーティング履歴をAtCoder Problems APIから取得します。
 * @param userId (オプション) AtCoderのユーザーID。指定がなければ設定から取得。
 * @returns ユーザーのレーティング履歴の配列。取得失敗時はundefined。
 */
export async function getUserRatingHistory(userId?: string): Promise<UserRatingHistoryEntry[] | undefined> {
    const targetUserId = userId || getUserIdFromConfig();
    if (!targetUserId) return undefined;

    vscode.window.setStatusBarMessage(`$(sync~spin) Fetching rating history for ${targetUserId} from AtCoder website...`, 5000);

    try {
        const history = await scrapeUserRating(targetUserId);
        vscode.window.setStatusBarMessage(`$(check) Rating history for ${targetUserId} fetched successfully from AtCoder website.`, 3000);
        return history;
    } catch (error: any) {
        vscode.window.showErrorMessage(`Failed to fetch rating history for ${targetUserId} from AtCoder website: ${error.message}.`);
        console.error(`Error fetching rating history for ${targetUserId} from AtCoder website:`, error);
        return undefined;
    }
}

/**
 * 指定されたユーザーの全ての提出をAtCoder Problems APIから取得し、AC済みの問題IDを抽出します。
 * @param userId (オプション) AtCoderのユーザーID。指定がなければ設定から取得。
 * @returns AC済み問題IDのSet。取得失敗時はundefined。
 */
export async function loadAcceptedProblems(userId?: string): Promise<AcProblem[] | undefined> {
    const targetUserId = userId || getUserIdFromConfig();
    if (!targetUserId) return undefined;

    const apiUrl = `https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions?user=${targetUserId}&from_second=0`;
    vscode.window.setStatusBarMessage(`$(sync~spin) Fetching submissions for ${targetUserId}...`, 5000);

    try {
        const response = await axios.get<AtCoderSubmission[]>(apiUrl, { timeout: 30000 });
        vscode.window.setStatusBarMessage(`$(check) Submissions for ${targetUserId} fetched successfully.`, 3000);

        // AC済みのSubmissionオブジェクトをAcProblemに変換して返す
        return response.data
            .filter(submission => submission.result === 'AC')
            .map(submission => ({
                id: submission.problem_id,
                epoch_second: submission.epoch_second,
                // difficultyはAtCoderSubmissionには含まれないため、ここでは設定しない
            }));
    } catch (error: any) {
        vscode.window.showErrorMessage(`Failed to fetch submissions for ${targetUserId}: ${error.message}.`);
        console.error(`Error fetching submissions for ${targetUserId}:`, error);
        return undefined;
    }
}

export class ProblemDataService {
    private _allProblems: AtCoderProblem[] = [];
    private _lastLoadTime: number = 0; // 最後にデータをロードしたタイムスタンプ
    private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24時間キャッシュ

    constructor(private context: vscode.ExtensionContext) {}

    /**
     * AtCoder Problems APIから全問題データをロードします。
     * ローカルキャッシュが存在し、有効期間内であればそれを利用します。
     * @returns 全問題データの配列。
     */
    public async loadAllProblems(): Promise<AtCoderProblem[]> {
        const cacheFilePath = path.join(this.context.globalStorageUri.fsPath, 'all_problems_cache.json');

        // 1. キャッシュの有効期限をチェック
        if (this._allProblems.length > 0 && (Date.now() - this._lastLoadTime < this.CACHE_DURATION)) {
            console.log("ProblemDataService: In-memory cache hit.");
            return this._allProblems;
        }

        // 2. ディスクキャッシュのチェック
        try {
            const stat = await fs.stat(cacheFilePath);
            if (Date.now() - stat.mtimeMs < this.CACHE_DURATION) {
                const cachedData = await fs.readFile(cacheFilePath, 'utf-8');
                this._allProblems = JSON.parse(cachedData) as AtCoderProblem[];
                this._lastLoadTime = Date.now();
                console.log("ProblemDataService: Disk cache hit.");
                return this._allProblems;
            }
        } catch (error) {
            // キャッシュファイルがない、または期限切れ
            console.log("ProblemDataService: Disk cache miss or expired.");
        }

        // 3. APIから取得
        const apiUrl = `https://kenkoooo.com/atcoder/resources/merged-problems.json`;
        vscode.window.setStatusBarMessage(`$(sync~spin) Fetching all problem data... (This might take a moment)`, 5000);

        try {
            const response = await axios.get<AtCoderProblem[]>(apiUrl, { timeout: 60000 }); // ファイルが大きいので長めに
            this._allProblems = response.data;
            this._lastLoadTime = Date.now();
            
            // 4. ディスクキャッシュに保存
            await fs.mkdir(this.context.globalStorageUri.fsPath, { recursive: true });
            await fs.writeFile(cacheFilePath, JSON.stringify(this._allProblems), 'utf-8');

            vscode.window.setStatusBarMessage(`$(check) All problem data fetched.`, 3000);
            return this._allProblems;
        } catch (error: any) {
            vscode.window.showErrorMessage(`Failed to fetch all problem data: ${error.message}.`);
            console.error(`Error fetching all problem data:`, error);
            // 失敗しても、空の配列を返すことで続行可能にする
            return [];
        }
    }
}

/**
 * 指定されたユーザーの現在のAtCoderレーティングをAtCoder Problems APIから取得します。
 * レーティング履歴の最新の値を返します。
 * @param userId (オプション) AtCoderのユーザーID。指定がなければ設定から取得。
 * @returns 現在のレーティング (数値)。取得失敗時はundefined。
 */
export async function getCurrentUserRating(userId?: string): Promise<number | undefined> {
    const history = await getUserRatingHistory(userId);
    if (history && history.length > 0) {
        return history[0].NewRating; // 最新のレーティングを取得
    }
    return undefined;
}

/**
 * 指定されたユーザーの現在のAtCoderレーティングをAtCoder Problems APIから取得します。
 * レーティング履歴の最新の値を返します。
 * @param userId AtCoderのユーザーID。
 * @returns 現在のレーティング (数値)。取得失敗時はundefined。
 */
export async function getRatingByUsername(userId: string): Promise<number | undefined> {
    if (!userId) {
        vscode.window.showErrorMessage('AtCoder User ID cannot be empty.');
        return undefined;
    }
    const history = await getUserRatingHistory(userId);
    if (history && history.length > 0) {
        return history[history.length - 1].NewRating;
    }
    return undefined;
}

/**
 * AtCoder Problems APIからコンテストデータを取得します。
 * @returns コンテストデータの配列。取得失敗時はundefined。
 */
export async function loadContestData(): Promise<Contest[] | undefined> {
    const apiUrl = `https://kenkoooo.com/atcoder/resources/contests.json`;
    vscode.window.setStatusBarMessage(`$(sync~spin) Fetching contest data...`, 5000);
    try {
        const response = await axios.get<Contest[]>(apiUrl, { timeout: 10000 });
        vscode.window.setStatusBarMessage(`$(check) Contest data fetched.`, 3000);
        return response.data;
    } catch (error: any) {
        vscode.window.showErrorMessage(`Failed to fetch contest data: ${error.message}.`);
        console.error(`Error fetching contest data:`, error);
        return undefined;
    }
}

/**
 * AtCoder Problems APIから問題データを取得します。
 * @returns 問題データの配列。取得失敗時はundefined。
 */
export async function loadProblemData(): Promise<ProblemEntry[] | undefined> {
    const apiUrl = `https://kenkoooo.com/atcoder/resources/problems.json`;
    vscode.window.setStatusBarMessage(`$(sync~spin) Fetching problem data...`, 5000);
    try {
        const response = await axios.get<ProblemEntry[]>(apiUrl, { timeout: 10000 });
        vscode.window.setStatusBarMessage(`$(check) Problem data fetched.`, 3000);
        return response.data;
    } catch (error: any) {
        vscode.window.showErrorMessage(`Failed to fetch problem data: ${error.message}.`);
        console.error(`Error fetching problem data:`, error);
        return undefined;
    }
}

/**
 * AtCoder Problems APIからコンテストと問題の関連データを取得します。
 * @returns コンテストと問題の関連データの配列。取得失敗時はundefined。
 */
export async function loadContestProblemData(): Promise<ContestProblem[] | undefined> {
    const apiUrl = `https://kenkoooo.com/atcoder/resources/contest-problem.json`;
    vscode.window.setStatusBarMessage(`$(sync~spin) Fetching contest-problem data...`, 5000);
    try {
        const response = await axios.get<ContestProblem[]>(apiUrl, { timeout: 10000 });
        vscode.window.setStatusBarMessage(`$(check) Contest-problem data fetched.`, 3000);
        return response.data;
    } catch (error: any) {
        vscode.window.showErrorMessage(`Failed to fetch contest-problem data: ${error.message}.`);
        console.error(`Error fetching contest-problem data:`, error);
        return undefined;
    }
}

/**
 * 指定されたコンテストの問題リストをAtCoder Problems APIから取得します。
 * @param contestId コンテストID
 * @returns 問題リストの配列。取得失敗時はundefined。
 */
export async function getProblemListForContest(contestId: string): Promise<ContestProblem[] | undefined> {
    const apiUrl = `https://kenkoooo.com/atcoder/resources/contest-problem.json`;
    vscode.window.setStatusBarMessage(`$(sync~spin) Fetching problem list for ${contestId}...`, 5000);
    try {
        const response = await axios.get<ContestProblem[]>(apiUrl, { timeout: 10000 });
        vscode.window.setStatusBarMessage(`$(check) Problem list for ${contestId} fetched.`, 3000);
        return response.data.filter(cp => cp.contest_id === contestId);
    } catch (error: any) {
        vscode.window.showErrorMessage(`Failed to fetch problem list for ${contestId}: ${error.message}.`);
        console.error(`Error fetching problem list for ${contestId}:`, error);
        return undefined;
    }
}

/**
 * AtCoderの問題ページからサンプルケースをスクレイピングして取得します。
 * @param contestId コンテストID
 * @param problemIndex 問題インデックス (例: "A", "B")
 * @returns サンプルケースの配列。取得失敗時はundefined。
 */
export async function getSampleCases(contestId: string, problemIndex: string): Promise<SampleCase[] | undefined> {
    const problemUrl = `https://atcoder.jp/contests/${contestId}/tasks/${contestId}_${problemIndex.toLowerCase()}`;
    vscode.window.setStatusBarMessage(`$(sync~spin) Fetching sample cases for ${contestId}-${problemIndex}...`, 5000);
    try {
        const response = await axios.get(problemUrl, { timeout: 10000 });
        const $ = cheerio.load(response.data as string);
        const sampleCases: SampleCase[] = [];

        $('h3').each((_i, elem) => {
            const headingText = $(elem).text();
            if (headingText.includes('Sample Input') || headingText.includes('入力例')) {
                const input = $(elem).next('pre').text();
                const output = $(elem).nextAll('h3').filter((_j, nextElem) => $(nextElem).text().includes('Sample Output') || $(nextElem).text().includes('出力例')).first().next('pre').text();
                if (input && output) {
                    sampleCases.push({ input, output });
                }
            }
        });
        vscode.window.setStatusBarMessage(`$(check) Sample cases for ${contestId}-${problemIndex} fetched.`, 3000);
        return sampleCases;
    } catch (error: any) {
        vscode.window.showErrorMessage(`Failed to fetch sample cases for ${contestId}-${problemIndex}: ${error.message}.`);
        console.error(`Error fetching sample cases for ${contestId}-${problemIndex}:`, error);
        return undefined;
    }
}

/**
 * AtCoder Problems APIからマージされた問題データをロードします。
 * @returns 全問題データの配列。取得失敗時はundefined。
 */
export async function loadMergedProblemData(): Promise<AtCoderProblem[] | undefined> {
    const apiUrl = `https://kenkoooo.com/atcoder/resources/merged-problems.json`;
    vscode.window.setStatusBarMessage(`$(sync~spin) Fetching merged problem data...`, 5000);
    try {
        const response = await axios.get<AtCoderProblem[]>(apiUrl, { timeout: 60000 }); // ファイルが大きいので長めに
        vscode.window.setStatusBarMessage(`$(check) Merged problem data fetched.`, 3000);
        return response.data;
    } catch (error: any) {
        vscode.window.showErrorMessage(`Failed to fetch merged problem data: ${error.message}.`);
        console.error(`Error fetching merged problem data:`, error);
        return undefined;
    }
}

/**
 * AtCoder Problems APIから問題の難易度データをロードします。
 * @returns 問題IDをキーとした難易度情報のマップ。取得失敗時はundefined。
 */
export async function loadProblemModelsData(): Promise<ProblemModels | undefined> {
    const apiUrl = `https://kenkoooo.com/atcoder/resources/problem-models.json`;
    vscode.window.setStatusBarMessage(`$(sync~spin) Fetching problem models data...`, 5000);
    try {
        const response = await axios.get<ProblemModels>(apiUrl, { timeout: 60000 });
        vscode.window.setStatusBarMessage(`$(check) Problem models data fetched.`, 3000);
        return response.data;
    } catch (error: any) {
        vscode.window.showErrorMessage(`Failed to fetch problem models data: ${error.message}.`);
        console.error(`Error fetching problem models data:`, error);
        return undefined;
    }
}

export class AtCoderApiService {
    constructor(private context: vscode.ExtensionContext) {}
    // Added a comment to trigger re-compilation

    
    /**
     * 問題のHTMLを取得する。まずキャッシュを確認し、なければWebから取得してキャッシュする。
     * このメソッドが、HTML取得の唯一の窓口となる。
     * @param uri 問題ファイルのURI (例: main.cppのURI)
     * @returns 問題ページのHTML文字列、または取得失敗時にundefined
     */
    public async getOrFetchProblemHtml(uri: vscode.Uri): Promise<string | undefined> {
        // 1. ファイルパスからコンテストIDやタスクIDを解析
        const filePath = uri.fsPath;
        const problemDir = path.dirname(filePath);
        
        // より堅牢なパス解析
        const parts = filePath.split(path.sep);
        let contestId: string | undefined;
        let taskLetter: string | undefined;

        for (let i = parts.length - 2; i >= 0; i--) {
            // 例: abc300, arc150, agc060 などにマッチする正規表現
            if (parts[i].match(/^(abc|arc|agc|ahc|adt|adt_intro|tessoku|practice|typical90|dp|abs)\d*$/i)) { 
                contestId = parts[i].toLowerCase();
                taskLetter = parts[i+1].toLowerCase();
                break;
            }
        }
        
        if (!contestId || !taskLetter) {
            vscode.window.showWarningMessage('Could not determine contest/task ID from file path. Ensure you are in a standard AtCoder contest folder structure (e.g., .../contest_name/task_letter/main.cpp).');
            return undefined;
        }

        const taskId = `${contestId}_${taskLetter}`;
        const problemUrl = `https://atcoder.jp/contests/${contestId}/tasks/${taskId}`;
        const cacheFilePath = path.join(problemDir, 'problem.html');

        // 2. キャッシュの読み込みを試行
        try {
            const cachedHtml = await fs.readFile(cacheFilePath, 'utf-8');
            vscode.window.setStatusBarMessage('$(check) Loaded problem from local cache.', 3000);
            return cachedHtml;
        } catch (error) {
            // キャッシュが存在しない場合、次に進む
            vscode.window.setStatusBarMessage('$(sync~spin) Fetching problem from AtCoder...', 5000);
        }

        // 3. Webから取得してキャッシュに保存
        try {
            const response = await axios.get(problemUrl, { timeout: 10000 });
            const html = response.data as string;
            
            await fs.mkdir(problemDir, { recursive: true });
            await fs.writeFile(cacheFilePath, html, 'utf-8');
            
            return html;
        } catch (error: any) {
            vscode.window.showErrorMessage(`Failed to fetch problem from ${problemUrl}: ${error.message}. Please check your network connection or the problem URL.`);
            return undefined;
        }
    }
}

