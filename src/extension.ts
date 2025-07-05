import * as vscode from 'vscode';
import { AtCoderApiService } from './services/atcoderApiService';
import { BookmarksProvider } from './providers/BookmarksProvider';
import { BundleService } from './services/bundleService';
import { ContestActionViewProvider } from './providers/contestActionViewProvider';
import { ContestProvider } from './providers/ContestProvider';
import { ContestSetupService } from './services/contestSetupService';
import { CustomTestRunnerService } from './services/customTestRunnerService';
import { CustomTestViewProvider } from './providers/CustomTestViewProvider';
import { FuzzerService } from './services/fuzzerService';
import { FuzzerViewProvider } from './providers/FuzzerViewProvider';
import { PerformanceProvider } from './providers/PerformanceProvider';
import { ProblemDataService } from './services/problemDataService';
import { ProblemDecorationProvider } from './providers/ProblemDecorationProvider';
import { ProblemTimerProvider } from './providers/ProblemTimerProvider';
import { ProblemViewService } from './services/problemViewService';
import { RandomInputViewProvider } from './providers/RandomInputViewProvider';
import { RecommendProvider } from './providers/RecommendProvider';
import { RefreshableProvider } from './types';
import { registerBookmarkCommands } from './commands/bookmarkCommands';
import { registerBundleCommands } from './commands/bundleCommands';
import { registerContestCommands } from './commands/contestCommands';
import { registerDataCommands } from './commands/dataCommands';
import { registerProblemCommands } from './commands/problemCommands';
import { registerSubmissionCommands } from './commands/submissionCommands';
import { registerTestCommands } from './commands/testCommands';
import { CodeGeneratorService } from './services/jsonParserService';
import { InputParserService } from './services/inputParserService';
import { SnippetGenerationService } from './services/snippetGenerationService';
import { StatusBarService } from './services/statusBarService';
import { StatusProvider } from './providers/StatusProvider';
import { TestCaseGeneratorService } from './services/testCaseGeneratorService';
import { TestRunnerService } from './services/testRunnerService';
import { UpdateManagerService } from './services/updateManagerService';
import { UserDataService } from './services/userDataService';
import { ActivityViewProvider } from './providers/ActivityViewProvider';

// =============================================================================
// グローバル変数
// =============================================================================

/** 問題データを管理するサービス */
let problemDataService: ProblemDataService;
/** ユーザーデータを管理するサービス */
let userDataService: UserDataService;
/** テスト実行を管理するサービス */
let testRunnerService: TestRunnerService;
/** ステータスバーの表示を管理するサービス */
let statusBarService: StatusBarService;
/** 定期的なデータ更新を管理するサービス */
let updateManagerService: UpdateManagerService;
/** テストケース生成を管理するサービス */
let testCaseGeneratorService: TestCaseGeneratorService;
/** コンテストのセットアップを行うサービス */
let contestSetupService: ContestSetupService;
/** カスタムテストの実行を管理するサービス */
let customTestRunnerService: CustomTestRunnerService;
/** ファイルのバンドルを行うサービス */
let bundleService: BundleService;
/** ファザー機能を提供するサービス */
let fuzzerService: FuzzerService;
let activityViewProvider: ActivityViewProvider;

/** ランダム入力設定の変更を通知するためのEventEmitter */
export const onDidChangeRandomInputSettings = new vscode.EventEmitter<any[]>();

// =============================================================================
// ヘルパー関数
// =============================================================================

/**
 * ファイルURIから問題IDを取得します。
 * @param uri 対象のファイルURI
 * @returns 抽出した問題ID。見つからない場合はundefined。
 */
export function getProblemIdFromUri(uri: vscode.Uri): string | undefined {
    const parts = uri.path.split('/');
    const problemChar = parts[parts.length - 1];
    const contestId = parts[parts.length - 2];
    if (contestId && problemChar?.match(/^[a-h]$/)) {
        const newKey = `${contestId}_${problemChar}`;
        const oldKey = `${contestId}_${problemChar.charCodeAt(0) - 'a'.charCodeAt(0) + 1}`;
        // 新旧両方のキー形式に対応
        return problemDataService.problemCache.has(newKey) ? newKey : (problemDataService.problemCache.has(oldKey) ? oldKey : undefined);
    }
    return undefined;
}

/**
 * レーティングと難易度から勝率を計算します。
 * @param rating ユーザーのレーティング
 * @param difficulty 問題の難易度
 * @returns 勝率 (0.0 ~ 1.0)
 */
export function calculateWinProbability(rating: number, difficulty: number): number {
    return 1.0 / (1.0 + Math.pow(10, (difficulty - rating) / 400.0));
}

/**
 * 拡張機能が有効化されたときに実行されるメイン関数です。
 * @param context 拡張機能のコンテキスト
 */
export async function activate(context: vscode.ExtensionContext) {
    console.log('AtCoder-Utility is now active!');

    // --- 0. サービス層のインスタンス化 ---
    // 拡張機能のコアロジックを提供するサービスを初期化します。
    problemDataService = new ProblemDataService();
    userDataService = new UserDataService(problemDataService);
    customTestRunnerService = new CustomTestRunnerService();
    testRunnerService = new TestRunnerService(customTestRunnerService);
    statusBarService = new StatusBarService(userDataService);
    testCaseGeneratorService = new TestCaseGeneratorService();
    contestSetupService = new ContestSetupService();
    bundleService = new BundleService();
    fuzzerService = new FuzzerService(context, testCaseGeneratorService);
    const atcoderApiService = new AtCoderApiService(context);
    const outputChannel = vscode.window.createOutputChannel('AtCoder Utility');
    const inputParserService = new InputParserService(outputChannel);
    const codeGeneratorService = new CodeGeneratorService();
    const snippetGenerationService = new SnippetGenerationService(atcoderApiService, inputParserService, codeGeneratorService);
    const problemViewService = new ProblemViewService(context, atcoderApiService);
    activityViewProvider = new ActivityViewProvider(context.extensionUri ,userDataService);

    // --- 1. UIプロバイダーのインスタンス化 ---
    // サイドバーやWebviewなどのUIコンポーネントを初期化します。
    const decorationProvider = new ProblemDecorationProvider(problemDataService, userDataService);
    const statusProvider = new StatusProvider(userDataService);
    const recommendProvider = new RecommendProvider(problemDataService, userDataService);
    const contestProvider = new ContestProvider(problemDataService, userDataService);
    const bookmarksProvider = new BookmarksProvider(context, problemDataService);
    const customTestProvider = new CustomTestViewProvider(context.extensionUri);
    const performanceProvider = new PerformanceProvider(context.extensionUri, userDataService);
    const problemTimerProvider = new ProblemTimerProvider(context.extensionUri);
    const randomInputProvider = new RandomInputViewProvider(context.extensionUri, context);
    const fuzzerProvider = new FuzzerViewProvider(context.extensionUri, fuzzerService);
    const contestActionViewProvider = new ContestActionViewProvider(context.extensionUri, contestSetupService, bundleService, snippetGenerationService);

    // --- 2. 更新対象プロバイダーのリスト作成 ---
    // データ更新時に一括でリフレッシュするUIプロバイダーをまとめます。
    const providersToRefresh: RefreshableProvider[] = [
        decorationProvider,
        statusProvider,
        recommendProvider,
        contestProvider,
        bookmarksProvider,
        performanceProvider,
        activityViewProvider // ActivityViewProviderを追加
    ];

    // --- 3. UIコンポーネントの登録 ---
    // VSCodeに各UIコンポーネントを登録します。
    context.subscriptions.push(
        vscode.window.registerFileDecorationProvider(decorationProvider),
        vscode.window.registerTreeDataProvider('atcoder-utility-status-view', statusProvider),
        vscode.window.registerTreeDataProvider('atcoder-utility-recommend-view', recommendProvider),
        vscode.window.registerTreeDataProvider('atcoder-utility-contest-view', contestProvider),
        vscode.window.registerTreeDataProvider('atcoder-utility-bookmarks-view', bookmarksProvider),
        vscode.window.registerWebviewViewProvider(CustomTestViewProvider.viewType, customTestProvider),
        vscode.window.registerWebviewViewProvider(PerformanceProvider.viewType, performanceProvider),
        vscode.window.registerWebviewViewProvider(ProblemTimerProvider.viewType, problemTimerProvider),
        vscode.window.registerWebviewViewProvider(RandomInputViewProvider.viewType, randomInputProvider),
        vscode.window.registerWebviewViewProvider(FuzzerViewProvider.viewType, fuzzerProvider),
        vscode.window.registerWebviewViewProvider(ContestActionViewProvider.viewType, contestActionViewProvider),
        vscode.window.registerWebviewViewProvider(ActivityViewProvider.viewType, activityViewProvider)
    );

    // --- 4. 初期データのロードとUIの更新 ---
    const initialUserId = vscode.workspace.getConfiguration('atcoder-utility').get<string>('userId') || '';
    
    // 必要なデータをサービス経由で非同期に読み込みます。
    await problemDataService.loadAllProblemData();
    await userDataService.loadUserData(initialUserId);
    
    // 読み込み完了後にUIを更新します。
    statusBarService.updateUserStatusBar(initialUserId);
    providersToRefresh.forEach(p => p.refresh());
    problemTimerProvider.updateWebview();

    // --- 5. コマンドの登録 ---
    // ユーザーが実行可能なコマンドを登録します。
    registerDataCommands(context, problemDataService, userDataService, statusBarService, providersToRefresh);
    registerBookmarkCommands(context, problemDataService, bookmarksProvider);
    registerContestCommands(context, contestSetupService);
    registerTestCommands(context, customTestRunnerService);
    registerBundleCommands(context, bundleService);
    registerSubmissionCommands(context, bundleService);
    registerProblemCommands(context, problemViewService);

    // --- 6. ライフサイクル管理サービスの起動 ---
    // 定期的なデータ更新などを管理するサービスを起動します。
    updateManagerService = new UpdateManagerService(context, problemDataService, userDataService, statusBarService, providersToRefresh);
}

/**
 * 拡張機能が無効化されたときに実行されるクリーンアップ関数です。
 */
export function deactivate() {
    console.log('Atcoder-Utility is now deactivated.');
    // 各サービスのリソースを解放します。
    if (testRunnerService) { testRunnerService.dispose(); }
    if (statusBarService) { statusBarService.dispose(); }
}
