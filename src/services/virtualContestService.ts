import * as vscode from 'vscode';
import { ProblemDataService } from './problemDataService';
import { UserDataService } from './userDataService';
import { ContestSetupService } from './contestSetupService';
import { StatusBarService } from './statusBarService';
import { Problem, Contest, Submission } from '../types';

// コンテスト設定の型定義
export interface VirtualContestSettings {
    duration: {
        days: number;
        hours: number;
        minutes: number;
    };
    contestTypes: string[];
    filterType: 'diff' | 'prob';
    filterValue: {
        min: number;
        max: number;
    };
    filters: string[];
}

export class VirtualContestService {
    private contestProblems: Problem[] = [];
    private timer: NodeJS.Timeout | undefined;
    private endTime: number | undefined;
    private _currentSettings: VirtualContestSettings | undefined;
    private _problemPool: Problem[] = []; // フィルタリングされた問題のプール
    public onTimerUpdate?: (timeString: string | null) => void;

    constructor(
        private problemDataService: ProblemDataService, 
        private userDataService: UserDataService,
        private contestSetupService: ContestSetupService,
        private statusBarService: StatusBarService
    ) {}

    private calculateWinProbability(rating: number, difficulty: number): number {
        return 1.0 / (1.0 + Math.pow(10, (difficulty - rating) / 400.0));
    }

    public async startContest(settings: VirtualContestSettings) {
        console.log('Starting virtual contest with settings:', settings);
        this._currentSettings = settings; // Store current settings

        // Ensure settings values are numbers
        settings.filterValue.min = Number(settings.filterValue.min);
        settings.filterValue.max = Number(settings.filterValue.max);
        settings.duration.days = Number(settings.duration.days);
        settings.duration.hours = Number(settings.duration.hours);
        settings.duration.minutes = Number(settings.duration.minutes);

        // コンテスト開始時に問題プールを初期化
        const allProblems = Array.from(this.problemDataService.problemCache.values());
        this._problemPool = this.filterProblems(allProblems, settings);

        await this.selectAndSetupProblem();

        // 4. タイマーを開始
        const durationMillis = (settings.duration.days * 24 * 60 * 60 + settings.duration.hours * 60 * 60 + settings.duration.minutes * 60) * 1000;
        this.endTime = Date.now() + durationMillis;
        this.startTimer();
    }

    public async nextProblem() {
        if (!this._currentSettings) {
            vscode.window.showErrorMessage('バーチャルコンテストが開始されていません。');
            return;
        }
        await this.selectAndSetupProblem();
    }

    private async selectAndSetupProblem() {
        // 既に選ばれた問題を除外
        const presentedProblemIds = new Set(this.contestProblems.map(p => p.id));
        let availableProblems = this._problemPool.filter(p => !presentedProblemIds.has(p.id));

        // 2. ランダムに問題を選出
        if (availableProblems.length === 0) {
            let errorMessage = '設定された条件に合う新しい問題が見つかりませんでした。\n\n';
            errorMessage += `コンテストタイプ: ${this._currentSettings?.contestTypes.join(', ')}\n`;
            errorMessage += `難易度範囲: ${this._currentSettings?.filterValue.min} ~ ${this._currentSettings?.filterValue.max}\n`;
            errorMessage += `フィルター: ${this._currentSettings?.filters.length > 0 ? this._currentSettings?.filters.join(', ') : 'なし'}\n\n`;
            errorMessage += 'フィルタリング条件を緩めるか、別の条件でお試しください。\nまたは、既に条件に合う全ての問題を解いた可能性があります。';
            vscode.window.showErrorMessage(errorMessage);
            return;
        }
        
        const randomIndex = Math.floor(Math.random() * availableProblems.length);
        const selectedProblem = availableProblems[randomIndex];
        
        this.contestProblems.push(selectedProblem);
        console.log('Selected problem:', selectedProblem);

        // 3. コンテストセットアップを実行
        await this.contestSetupService.setupProblem(selectedProblem.contest_id, selectedProblem.id, selectedProblem.id.split('_')[1]);
    }

    private startTimer() {
        if (this.timer) {
            clearInterval(this.timer);
        }

        this.timer = setInterval(() => {
            if (!this.endTime) return;

            const remaining = this.endTime - Date.now();

            if (remaining <= 0) {
                this.stopContest();
                vscode.window.showInformationMessage('Virtual contest has ended!');
                return;
            }

            const remainingSeconds = Math.floor((remaining / 1000) % 60);
            const remainingMinutes = Math.floor((remaining / (1000 * 60)) % 60);
            const remainingHours = Math.floor((remaining / (1000 * 60 * 60)));

            const timeString = `VC: ${remainingHours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
            this.statusBarService.updateVirtualContestTimer(timeString);
            if (this.onTimerUpdate) {
                this.onTimerUpdate(timeString);
            }

            // 警告
            if (remaining <= 5 * 60 * 1000 && remaining > 5 * 60 * 1000 - 1000) { // 5分前
                vscode.window.showWarningMessage('バーチャルコンテスト終了まで残り5分です！');
            } else if (remaining <= 60 * 1000 && remaining > 60 * 1000 - 1000) { // 1分前
                vscode.window.showWarningMessage('バーチャルコンテスト終了まで残り1分です！');
            }

        }, 1000);
    }

    private filterProblems(problems: Problem[], settings: VirtualContestSettings): Problem[] {
        const { contestTypes, filterType, filterValue, filters } = settings;
        const userSubmissions = this.userDataService.getSubmissions();
        console.log(`Initial number of problems: ${problems.length}`);

        const filtered = problems.filter(problem => {
            const contest = this.problemDataService.contestCache.get(problem.contest_id);
            if (!contest) {
                // console.log(`Problem ${problem.id} excluded: No contest data`);
                return false;
            }

            // コンテストタイプのフィルタ
            const contestType = this.getContestType(contest);
            if (!contestTypes.includes(contestType)) {
                // console.log(`Problem ${problem.id} excluded: Contest type mismatch (is ${contestType}, needs one of ${contestTypes.join(', ')})`);
                return false;
            }

            // 難易度/確率フィルタ
            if (filterType === 'diff') {
                const diff = this.problemDataService.getDifficulty(problem.id);
                const minDiff = filterValue.min === 0 ? -9999 : filterValue.min;
                if (diff === null || diff < minDiff || diff > filterValue.max) {
                    // console.log(`Problem ${problem.id} excluded: Difficulty out of range (is ${diff}, needs ${minDiff}-${filterValue.max})`);
                    return false;
                }
            } else { // prob
                const userRating = this.userDataService.userRatingInfo?.current;
                if (userRating === undefined || problem.difficulty === undefined) {
                    // レーティングまたは難易度が不明な場合はフィルタリングしない
                    return false;
                }
                const winProbability = this.calculateWinProbability(userRating, problem.difficulty);
                const minProb = filterValue.min / 100;
                const maxProb = filterValue.max / 100;
                if (winProbability < minProb || winProbability > maxProb) {
                    // console.log(`Problem ${problem.id} excluded: Probability out of range (is ${winProbability}, needs ${minProb}-${maxProb})`);
                    return false;
                }
            }

            // その他のフィルタ
            const problemSubmissions = userSubmissions.filter(s => s.problem_id === problem.id);
            const isAC = problemSubmissions.some(s => s.result === 'AC');
            const isWA = problemSubmissions.some(s => s.result === 'WA');
            
            if (filters.includes('wa-only') && !isWA) {
                // console.log(`Problem ${problem.id} excluded: Not WA`);
                return false;
            }
            if (filters.includes('unsubmitted-only') && problemSubmissions.length > 0) {
                // console.log(`Problem ${problem.id} excluded: Has submissions`);
                return false;
            }
            if (!filters.includes('include-ac') && isAC) {
                // console.log(`Problem ${problem.id} excluded: Is AC`);
                return false;
            }

            return true;
        });

        console.log(`Number of problems after filtering: ${filtered.length}`);
        return filtered;
    }

    private isContestTypeMatch(contest: Contest, selectedTypes: string[]): boolean {
        const contestType = this.getContestType(contest);
        return selectedTypes.includes(contestType);
    }

    private getContestType(contest: Contest): string {
        const title = contest.title.toLowerCase();
        const id = contest.id.toLowerCase();

        if (id.startsWith('abc') && !title.includes('grand') && !title.includes('regular')) return 'abc';
        if (id.startsWith('arc') && !title.includes('beginner') && !title.includes('grand')) return 'arc';
        if (id.startsWith('agc') && !title.includes('beginner') && !title.includes('regular')) return 'agc';

        if (title.includes('abc-like') || (id.startsWith('abc') && (title.includes('beginner') || title.includes('heuristic')))) return 'abc-like';
        if (title.includes('arc-like') || (id.startsWith('arc') && (title.includes('regular') || title.includes('heuristic')))) return 'arc-like';
        if (title.includes('agc-like') || (id.startsWith('agc') && (title.includes('grand') || title.includes('heuristic')))) return 'agc-like';

        return 'other';
    }

    public stopContest() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = undefined;
        }
        this.endTime = undefined;
        this.contestProblems = [];
        this.statusBarService.updateVirtualContestTimer(null);
        if (this.onTimerUpdate) {
            this.onTimerUpdate(null);
        }
        console.log('Virtual contest stopped.');
    }
}
