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

export class AtCoderApiService {
    constructor(private context: vscode.ExtensionContext) {}

    private async getSessionCookie(): Promise<string | undefined> {
        const cookie = await this.context.secrets.get('atcoderSessionCookie');
        if (cookie) {
            console.log('[AtCoderApiService] Retrieved session cookie from SecretStorage.');
        } else {
            console.log('[AtCoderApiService] No session cookie found in SecretStorage.');
        }
        return cookie;
    }

    private async axiosGetWithCookie(url: string, options?: any): Promise<any> {
        const headers: { [key: string]: string } = options?.headers || {};
        if (url.startsWith('https://atcoder.jp')) {
            const sessionCookie = await this.getSessionCookie();
            if (sessionCookie) {
                headers['Cookie'] = sessionCookie;
            }
        }
        console.log(`[AtCoderApiService] Sending request to ${url} with headers:`, headers);
        return axios.get(url, { ...options, headers: headers });
    }

    /**
     * 指定されたHTML文字列からサンプルケースをスクレイピングして取得します。
     * @param html 問題ページのHTML文字列
     * @returns サンプルケースの配列。取得失敗時は空の配列を返します。
     */
    public async getSampleCases(html: string): Promise<SampleCase[]>; // HTML文字列を受け取るオーバーロードを先に定義
    /**
     * AtCoderの問題ページからサンプルケースをスクレイピングして取得します。
     * @param contestId コンテストID
     * @param problemIndex 問題インデックス (例: "A", "B")
     * @returns サンプルケースの配列。取得失敗時は空の配列を返します。
     */
    public async getSampleCases(arg1: string, arg2?: string): Promise<SampleCase[]> {
        let htmlContent: string;
        let problemUrl: string | undefined;
        let contestId: string | undefined;
        let problemIndex: string | undefined;

        if (arg2 === undefined) { // contestId と problemIndex が渡された場合
            htmlContent = arg1;
            vscode.window.setStatusBarMessage(`$(sync~spin) Parsing sample cases from provided HTML...`, 3000);
        } else { // HTML文字列が直接渡された場合
            contestId = arg1;
            problemIndex = arg2;
            problemUrl = `https://atcoder.jp/contests/${contestId}/tasks/${contestId}_${problemIndex.toLowerCase()}`;
            vscode.window.setStatusBarMessage(`$(sync~spin) Fetching sample cases for ${contestId}-${problemIndex}...`, 5000);
            try {
                const response = await this.axiosGetWithCookie(problemUrl, { timeout: 10000 });
                htmlContent = response.data as string;
            } catch (error: any) {
                vscode.window.showErrorMessage(`Failed to fetch sample cases for ${contestId}-${problemIndex}: ${error.message}.`);
                console.error(`Error fetching sample cases for ${contestId}-${problemIndex}:`, error);
                return [];
            }
        }

        const $ = cheerio.load(htmlContent);
        console.log('[AtCoderApiService] Cheerio loaded HTML (first 500 chars):', htmlContent.substring(0, 500)); // ★追加ログ

        const sampleCases: SampleCase[] = [];

        // サンプル入力/出力のh3タグをすべて取得
        const sampleHeadings = $('div.part section h3');
        console.log(`[AtCoderApiService] Found ${sampleHeadings.length} h3 elements in sample sections.`); // ★追加ログ

        let currentInput: string | null = null;
        let currentOutput: string | null = null;

        sampleHeadings.each((_i, elem) => {
            const headingText = $(elem).text().trim();
            // 修正: h3の次のdiv.div-btn-copyの次のpreを取得
            const preElement = $(elem).nextAll('pre').first(); 
            const preText = preElement.text();

            console.log(`[AtCoderApiService] Processing heading: "${headingText}"`); // ★追加ログ
            console.log(`[AtCoderApiService]   Associated pre element text length: ${preText.length}`); // ★追加ログ
            console.log(`[AtCoderApiService]   Associated pre element HTML: ${preElement.html()}`); // ★追加ログ

            if (headingText.startsWith('入力例')) {
                if (currentInput !== null && currentOutput !== null) {
                    sampleCases.push({ input: currentInput, output: currentOutput });
                }
                currentInput = preText;
                currentOutput = null;
            } else if (headingText.startsWith('出力例')) {
                currentOutput = preText;
                if (currentInput !== null && currentOutput !== null) {
                    sampleCases.push({ input: currentInput, output: currentOutput });
                    currentInput = null;
                    currentOutput = null;
                }
            }
        });

        if (currentInput !== null && currentOutput !== null) {
            sampleCases.push({ input: currentInput, output: currentOutput });
        }

        console.log(`[AtCoderApiService] Total sample cases extracted: ${sampleCases.length}`); // ★追加ログ

        if (problemUrl) {
            vscode.window.setStatusBarMessage(`$(check) Sample cases for ${contestId}-${problemIndex} fetched.`, 3000);
        } else {
            vscode.window.setStatusBarMessage(`$(check) Sample cases parsed from HTML.`, 3000);
        }
        return sampleCases;
    }

    /**
     * AtCoder Problems APIからコンテストデータをロードします。
     * @returns 全コンテストデータの配列。取得失敗時はundefined。
     */
    public async loadContestData(): Promise<Contest[] | undefined> {
        const apiUrl = `https://kenkoooo.com/atcoder/resources/contests.json`;
        vscode.window.setStatusBarMessage(`$(sync~spin) Fetching contest data...`, 5000);
        try {
            const response = await this.axiosGetWithCookie(apiUrl, { timeout: 60000 });
            vscode.window.setStatusBarMessage(`$(check) Contest data fetched.`, 3000);
            return response.data;
        } catch (error: any) {
            vscode.window.showErrorMessage(`Failed to fetch contest data: ${error.message}.`);
            console.error(`Error fetching contest data:`, error);
            return undefined;
        }
    }

    /**
     * AtCoder Problems APIからマージされた問題データをロードします。
     * @returns 全問題データの配列。取得失敗時はundefined。
     */
    public async loadMergedProblemData(): Promise<AtCoderProblem[] | undefined> {
        const apiUrl = `https://kenkoooo.com/atcoder/resources/merged-problems.json`;
        vscode.window.setStatusBarMessage(`$(sync~spin) Fetching merged problem data...`, 5000);
        try {
            const response = await this.axiosGetWithCookie(apiUrl, { timeout: 60000 }); // axiosGetWithCookie を使用
            vscode.window.setStatusBarMessage(`$(check) Merged problem data fetched.`, 3000);
            return response.data;
        } catch (error: any) {
            vscode.window.showErrorMessage(`Failed to fetch merged problem data: ${error.message}.`);
            console.error(`Error fetching merged problem data:`, error);
            return undefined;
        }
    }

    /**
     * AtCoder Problems APIから指定されたコンテストの問題リストを取得します。
     * @param contestId コンテストID
     * @returns 問題リストの配列。取得失敗時は空の配列を返します。
     */
    public async getProblemListForContest(contestId: string): Promise<ProblemInfo[]> {
        const apiUrl = `https://kenkoooo.com/atcoder/resources/contest-problem.json`;
        vscode.window.setStatusBarMessage(`$(sync~spin) Fetching problem list for contest ${contestId}...`, 5000);
        try {
            const response = await this.axiosGetWithCookie(apiUrl, { timeout: 30000 });
            const allContestProblems: ContestProblem[] = response.data;
            const filteredProblems = allContestProblems.filter(cp => cp.contest_id === contestId);

            // ProblemInfo[] に変換
            const problemInfos: ProblemInfo[] = filteredProblems.map(cp => ({
                contest_id: cp.contest_id,
                problem_id: cp.problem_id,
                problem_index: cp.problem_index,
                // title, point, difficulty は別の場所で補完されることを期待
            }));

            vscode.window.setStatusBarMessage(`$(check) Problem list for contest ${contestId} fetched.`, 3000);
            return problemInfos;
        } catch (error: any) {
            vscode.window.showErrorMessage(`Failed to fetch problem list for contest ${contestId}: ${error.message}.`);
            console.error(`Error fetching problem list for contest ${contestId}:`, error);
            return [];
        }
    }

    /**
     * AtCoder Problems APIからコンテストの問題データをロードします。
     * @returns コンテストの問題データの配列。取得失敗時はundefined。
     */
    public async loadContestProblemData(): Promise<ContestProblem[] | undefined> {
        const apiUrl = `https://kenkoooo.com/atcoder/resources/contest-problem.json`;
        vscode.window.setStatusBarMessage(`$(sync~spin) Fetching contest problem data...`, 5000);
        try {
            const response = await this.axiosGetWithCookie(apiUrl, { timeout: 60000 });
            vscode.window.setStatusBarMessage(`$(check) Contest problem data fetched.`, 3000);
            return response.data;
        } catch (error: any) {
            vscode.window.showErrorMessage(`Failed to fetch contest problem data: ${error.message}.`);
            console.error(`Error fetching contest problem data:`, error);
            return undefined;
        }
    }

    /**
     * AtCoder Problems APIから全問題データをロードします。
     * @returns 全問題データの配列。取得失敗時はundefined。
     */
    public async loadProblemData(): Promise<AtCoderProblem[] | undefined> {
        const apiUrl = `https://kenkoooo.com/atcoder/resources/problems.json`;
        vscode.window.setStatusBarMessage(`$(sync~spin) Fetching problem data...`, 5000);
        try {
            const response = await this.axiosGetWithCookie(apiUrl, { timeout: 60000 });
            vscode.window.setStatusBarMessage(`$(check) Problem data fetched.`, 3000);
            return response.data;
        } catch (error: any) {
            vscode.window.showErrorMessage(`Failed to fetch problem data: ${error.message}.`);
            console.error(`Error fetching problem data:`, error);
            return undefined;
        }
    }

    /**
     * AtCoder Problems APIから問題の難易度データをロードします。
     * @returns 問題IDをキーとした難易度情報のマップ。取得失敗時はundefined。
     */
    public async loadProblemModelsData(): Promise<ProblemModels | undefined> {
        const apiUrl = `https://kenkoooo.com/atcoder/resources/problem-models.json`;
        vscode.window.setStatusBarMessage(`$(sync~spin) Fetching problem models data...`, 5000);
        try {
            const response = await this.axiosGetWithCookie(apiUrl, { timeout: 60000 }); // axiosGetWithCookie を使用
            vscode.window.setStatusBarMessage(`$(check) Problem models data fetched.`, 3000);
            return response.data;
        } catch (error: any) {
            vscode.window.showErrorMessage(`Failed to fetch problem models data: ${error.message}.`);
            console.error(`Error fetching problem models data:`, error);
            return undefined;
        }
    }

    /**
     * AtCoder Problems APIから指定されたユーザーのAC済み問題リストをロードします。
     * @param userId AtCoderのユーザーID。
     * @returns AC済み問題の配列。取得失敗時は空の配列を返します。
     */
    public async loadAcceptedProblems(userId: string): Promise<AcProblem[]> {
        // user/ac_problems エンドポイントが非推奨になったため、user/submissions を使用
        // from_second=0 で全ての提出を取得し、ACのみをフィルタリング
        const apiUrl = `https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions?user=${userId}&from_second=0`;
        vscode.window.setStatusBarMessage(`$(sync~spin) Fetching accepted problems for ${userId}...`, 5000);
        try {
            const response = await this.axiosGetWithCookie(apiUrl, { timeout: 30000 });
            vscode.window.setStatusBarMessage(`$(check) Submissions for ${userId} fetched.`, 3000);
            
            const submissions: AtCoderSubmission[] = response.data;
            const acProblems: AcProblem[] = [];
            const uniqueAcProblems = new Set<string>(); // 重複を避けるためのSet

            for (const submission of submissions) {
                if (submission.result === 'AC' && !uniqueAcProblems.has(submission.problem_id)) {
                    acProblems.push({
                        id: submission.problem_id,
                        epoch_second: submission.epoch_second,
                        // difficulty はここでは取得できないため、後でProblemDataServiceで補完されることを期待
                    });
                    uniqueAcProblems.has(submission.problem_id);
                }
            }
            return acProblems;
        } catch (error: any) {
            vscode.window.showErrorMessage(`Failed to fetch accepted problems for ${userId}: ${error.message}.`);
            console.error(`Error fetching accepted problems for ${userId}:`, error);
            return [];
        }
    }

    /**
     * 指定されたユーザーの現在のAtCoderレーティング履歴をAtCoder Problems APIから取得します。
     * @param userId AtCoderのユーザーID。
     * @returns ユーザーのレーティング履歴の配列。取得失敗時はundefined。
     */
    public async getUserRatingHistory(userId: string): Promise<UserRatingHistoryEntry[] | undefined> {
        vscode.window.setStatusBarMessage(`$(sync~spin) Fetching rating history for ${userId} from AtCoder website...`, 5000);
        try {
            const history = await this.scrapeUserRating(userId);
            vscode.window.setStatusBarMessage(`$(check) Rating history for ${userId} fetched successfully from AtCoder website.`, 3000);
            return history;
        } catch (error: any) {
            vscode.window.showErrorMessage(`Failed to fetch rating history for ${userId} from AtCoder website: ${error.message}.`);
            console.error(`Error fetching rating history for ${userId}:`, error);
            return undefined;
        }
    }

    /**
     * 指定されたユーザーの現在のAtCoderレーティングをAtCoder Problems APIから取得します。
     * レーティング履歴の最新の値を返します。
     * @param userId AtCoderのユーザーID。
     * @returns 現在のレーティング (数値)。取得失敗時はundefined。
     */
    public async getCurrentUserRating(userId: string): Promise<number | undefined> {
        const history = await this.getUserRatingHistory(userId);
        if (history && history.length > 0) {
            return history[0].NewRating;
        }
        return undefined;
    }

    /**
     * 指定されたユーザーの現在のAtCoderレーティングをAtCoder Problems APIから取得します。
     * レーティング履歴の最新の値を返します。
     * @param userId AtCoderのユーザーID。
     * @returns 現在のレーティング (数値)。取得失敗時はundefined。
     */
    public async getRatingByUsername(userId: string): Promise<number | undefined> {
        if (!userId) {
            vscode.window.showErrorMessage('AtCoder User ID cannot be empty.');
            return undefined;
        }
        const history = await this.getUserRatingHistory(userId);
        if (history && history.length > 0) {
            return history[history.length - 1].NewRating;
        }
        return undefined;
    }

    /**
     * AtCoderのユーザーページからレーティング履歴をスクレイピングして取得します。
     * @param userId AtCoderのユーザーID。
     * @returns ユーザーのレーティング履歴の配列。取得失敗時は空の配列を返します。
     */
    public async scrapeUserRating(userId: string): Promise<UserRatingHistoryEntry[]> {
        const userPageUrl = `https://atcoder.jp/users/${userId}/history`;
        try {
            const response = await this.axiosGetWithCookie(userPageUrl, { timeout: 10000 });
            const $ = cheerio.load(response.data);
            console.log(`[AtCoderApiService] scrapeUserRating: Fetched HTML (first 500 chars): ${response.data.substring(0, 500)}`);
            const history: UserRatingHistoryEntry[] = [];

            const rows = $('table.table tbody tr');
            console.log(`[AtCoderApiService] scrapeUserRating: Found ${rows.length} table rows.`);

            rows.each((_i, elem) => {
                const columns = $(elem).find('td');
                console.log(`[AtCoderApiService] scrapeUserRating: Row ${_i} has ${columns.length} columns.`);
                if (columns.length >= 7) { // 少なくとも7列あることを確認
                    const contestScreenName = $(columns[1]).text().trim();
                    const contestName = $(columns[2]).text().trim();
                    const newRating = parseInt($(columns[4]).text().trim(), 10);
                    const diffText = $(columns[5]).text().trim();
                    const diff = parseInt(diffText.replace('+', ''), 10);
                    const oldRating = newRating - diff;

                    // 日付文字列からStartTimeとEndTimeを推測 (正確なエポック秒はAPIから取得する必要があるが、スクレイピングでは困難)
                    // ここでは仮に0を設定するか、日付文字列をパースして設定する
                    // 簡単のため、ここでは0を設定し、必要に応じて後でAPIから補完することを検討
                    history.push({
                        IsRated: true, // スクレイピングではIsRatedの正確な判断は難しいが、historyページなのでtrueと仮定
                        StartTime: 0,
                        EndTime: 0,
                        ContestType: '', // スクレイピングでは取得困難
                        ContestScreenName: contestScreenName,
                        ContestName: contestName,
                        OldRating: oldRating,
                        NewRating: newRating,
                        InnerPerformance: 0, // スクレイピングでは取得困難
                        ContestParticipation: 0, // スクレイピングでは取得困難
                    });
                }
            });
            return history.reverse(); // 時系列順にするため
        } catch (error: any) {
            console.error(`Error scraping user rating for ${userId}:`, error);
            return [];
        }
    }

    /**
     * 問題のHTMLを取得する。まずキャッシュを確認し、なければWebから取得してキャッシュする。
     * このメソッドが、HTML取得の唯一の窓口となる。
     * @param uri 問題ファイルのURI (例: main.cppのURI)
     * @returns 問題ページのHTML文字列、または取得失敗時にundefined
     */
    public async getOrFetchProblemHtml(contestId: string, problemId: string, filePath: string): Promise<string | undefined> {
        const problemDir = path.dirname(filePath);
        
        const problemUrl = `https://atcoder.jp/contests/${contestId}/tasks/${problemId}`;
        const cacheFilePath = path.join(problemDir, 'problem.html');

        try {
            const cachedHtml = await fs.readFile(cacheFilePath, 'utf-8');
            vscode.window.setStatusBarMessage('$(check) Loaded problem from local cache.', 3000);
            return cachedHtml;
        } catch (error) {
            vscode.window.setStatusBarMessage('$(sync~spin) Fetching problem from AtCoder...', 5000);
        }

        try {
            const response = await this.axiosGetWithCookie(problemUrl, { timeout: 10000 }); // axiosGetWithCookie を使用
            const html = response.data as string;
            
            await fs.mkdir(problemDir, { recursive: true });
            await fs.writeFile(cacheFilePath, html, 'utf-8');
            
            return html;
        } catch (error: any) {
            vscode.window.showErrorMessage(`Failed to fetch problem from ${problemUrl}: ${error.message}.`);
            return undefined;
        }
    }
}