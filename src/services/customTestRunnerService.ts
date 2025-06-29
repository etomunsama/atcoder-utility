import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs/promises';
import { spawn } from 'child_process';
import { performance } from 'perf_hooks';
import * as os from 'os';

type TestResultStatus = 'AC' | 'WA' | 'TLE' | 'RE' | 'CE';
interface TestCaseResult {
    caseName: string;
    status: TestResultStatus;
    time?: number;
    input?: string;
    output?: string;
    answer?: string;
    error?: string;
}
interface LanguageSetting {
    compile?: string;
    run: string;
}

/**
 * `test`ディレクトリ内のサンプルケースを使って、ユーザーのコードをテストするサービスです。
 * コンパイル、実行、結果の判定（AC, WA, TLE, RE, CE）、差分表示などを行います。
 */
export class CustomTestRunnerService {
    private terminal: vscode.Terminal;

    constructor() {
        this.terminal = vscode.window.createTerminal("AtCoder Test Results");
    }

    /**
     * 指定されたファイルに対して、`test`ディレクトリ内の全テストケースを実行します。
     * @param filePath テスト対象のソースファイルパス
     * @param languageId 言語ID (e.g., 'cpp', 'python')
     * @param showOutput trueの場合、専用ターミナルに結果を出力します
     * @returns 各テストケースの結果の配列
     */
    public async runTests(filePath: string, languageId: string, showOutput: boolean = true): Promise<TestCaseResult[]> {
        if (showOutput) {
            this.terminal.sendText('clear');
            this.terminal.show(true);
        }

        const config = vscode.workspace.getConfiguration('atcoder-utility');
        const langSettings = config.get<{ [key: string]: LanguageSetting }>('languageSettings');
        
        if (!langSettings || !langSettings[languageId]) {
            const msg = `言語 '${languageId}' の設定が見つかりません。settings.json を確認してください。`;
            if (showOutput) { this.terminal.sendText(msg); }
            return [{ caseName: 'config_error', status: 'RE', error: msg }];
        }

        const setting = langSettings[languageId];
        const fileDir = path.dirname(filePath);
        const fileBasename = path.basename(filePath, path.extname(filePath));
        const executablePath = path.join(fileDir, fileBasename);

        const replacePlaceholders = (cmd: string) => cmd
            .replace(/{fileName}/g, `'${filePath}'`)
            .replace(/{fileBasename}/g, `'${fileBasename}'`)
            .replace(/{fileDir}/g, `'${fileDir}'`)
            .replace(/{executable}/g, `'${executablePath}'`)
            .replace(/{className}/g, fileBasename);

        // コンパイルが必要な場合
        if (setting.compile) {
            const compileCommand = replacePlaceholders(setting.compile);
            if (showOutput) { this.terminal.sendText(`Compiling... \n$ ${compileCommand}`); }
            
            const compileResult = await this.executeCommand(compileCommand, fileDir);
            if (!compileResult.success) {
                const result: TestCaseResult = { caseName: 'compile', status: 'CE', error: compileResult.stderr };
                if (showOutput) {
                    this.terminal.sendText(`\x1b[31mCompilation Error (CE)\x1b[0m`);
                    this.terminal.sendText(result.error ?? 'Unknown compilation error.');
                }
                return [result];
            }
            if (showOutput) { this.terminal.sendText('Compilation successful.\n'); }
        }

        const testDirPath = path.join(fileDir, 'test');
        try {
            const testFiles = (await fs.readdir(testDirPath)).filter(f => f.endsWith('.in')).sort();
            if (testFiles.length === 0) {
                if (showOutput) { this.terminal.sendText('No test cases found in "test" directory.'); }
                return [];
            }

            const allResults: TestCaseResult[] = [];
            const runCommand = replacePlaceholders(setting.run);
            if(showOutput) { this.terminal.sendText(`Running tests... \n$ ${runCommand}\n`); }

            for (const file of testFiles) {
                const caseName = path.basename(file, '.in');
                const inputFilePath = path.join(testDirPath, file);
                const answerFilePath = inputFilePath.replace('.in', '.out');
                const hasAnswerFile = await fs.access(answerFilePath).then(() => true).catch(() => false);
                const answerContent = hasAnswerFile ? await fs.readFile(answerFilePath, 'utf-8') : null;

                const singleTestResult = await this.executeSingleTest(runCommand, inputFilePath, fileDir);
                
                let status = singleTestResult.status;
                if (status === 'AC' && hasAnswerFile && answerContent !== null) {
                    const normalizedOutput = (singleTestResult.output ?? "").replace(/\r\n/g, '\n').trim();
                    const normalizedAnswer = answerContent.replace(/\r\n/g, '\n').trim();
                    if (normalizedOutput !== normalizedAnswer) {
                        status = 'WA';
                        const userChoice = await vscode.window.showWarningMessage(
                            `Test case '${caseName}' failed (WA). Do you want to view the differences?`,
                            'View Diff'
                        );
                        if (userChoice === 'View Diff') {
                            this.showDiffView(normalizedAnswer, normalizedOutput, caseName);
                        }
                    }
                }

                const finalResult: TestCaseResult = { caseName, status, ...singleTestResult, answer: answerContent ?? undefined };
                allResults.push(finalResult);

                if (showOutput) {
                    let color = status === 'AC' ? 32 : 33;
                    this.terminal.sendText(`${caseName}.in --- \x1b[${color}m${status}\x1b[0m (time: ${finalResult.time} ms)`);
                }
            }

            if (showOutput) {
                const summary = allResults.map(r => r.status);
                const isAllAC = summary.every(s => s === 'AC');
                const finalStatusText = isAllAC ? '\x1b[32mAll AC\x1b[0m' : `\x1b[33m${Array.from(new Set(summary.filter(s => s !== 'AC'))).join(' ')}\x1b[0m`;
                this.terminal.sendText(`\nResult --- ${finalStatusText}`);
            }
            
            return allResults;

        } catch (error) {
            const msg = 'Could not read "test" directory.';
            if (showOutput) { this.terminal.sendText(msg); }
            return [{ caseName: 'fs_error', status: 'RE', error: msg }];
        }
    }

    /**
     * シェルコマンドを実行します。
     * @param command 実行するコマンド
     * @param cwd 作業ディレクトリ
     * @returns 成功したか、標準出力、標準エラー出力
     */
    private async executeCommand(command: string, cwd: string): Promise<{ success: boolean; stdout: string; stderr: string }> {
        return new Promise(resolve => {
            const process = spawn('sh', ['-c', command], { cwd });
            let stdout = '';
            let stderr = '';
            process.stdout.on('data', (data) => stdout += data.toString());
            process.stderr.on('data', (data) => stderr += data.toString());
            process.on('close', (code) => {
                resolve({ success: code === 0, stdout, stderr });
            });
            process.on('error', (err) => {
                resolve({ success: false, stdout: '', stderr: err.message });
            });
        });
    }

    /**
     * 1つのテストケースを実行します。
     * @param runCommand 実行コマンド
     * @param inputFilePath 入力ファイルのパス
     * @param cwd 作業ディレクトリ
     * @returns テスト結果（ケース名と解答以外）
     */
    private async executeSingleTest(runCommand: string, inputFilePath: string, cwd: string): Promise<Omit<TestCaseResult, 'caseName' | 'answer'>> {
        const inputContent = await fs.readFile(inputFilePath, 'utf-8');

        return new Promise(resolve => {
            const startTime = performance.now();
            const process = spawn('sh', ['-c', runCommand], { cwd, timeout: 2000 });
            let stdout = '';
            let stderr = '';

            process.stdout.on('data', data => stdout += data.toString());
            process.stderr.on('data', data => stderr += data.toString());
            
            process.on('error', (err: any) => {
                const endTime = performance.now();
                const executionTime = Math.round(endTime - startTime);
                if (err.code === 'ETIMEDOUT') {
                    resolve({ status: 'TLE', time: executionTime, input: inputContent, output: stdout });
                } else {
                    resolve({ status: 'RE', time: executionTime, input: inputContent, output: stdout, error: err.message });
                }
            });

            process.on('close', (code, signal) => {
                const endTime = performance.now();
                const executionTime = Math.round(endTime - startTime);
                
                if (signal) {
                    return resolve({ status: 'RE', time: executionTime, input: inputContent, output: stdout, error: `Process was killed by signal: ${signal}` });
                }
                if (code !== 0) {
                    return resolve({ status: 'RE', time: executionTime, input: inputContent, output: stdout, error: stderr });
                }
                
                resolve({ status: 'AC', time: executionTime, output: stdout, input: inputContent });
            });

            process.stdin.write(inputContent);
            process.stdin.end();
        });
    }

    /**
     * WAだった場合に、期待する出力と実際の出力の差分をVSCodeの差分ビューで表示します。
     * @param expected 期待する出力
     * @param actual 実際の出力
     * @param caseName テストケース名
     */
    private async showDiffView(expected: string, actual: string, caseName: string): Promise<void> {
        try {
            const tempDir = os.tmpdir();
            const sanitizedCaseName = caseName.replace(/[^a-zA-Z0-9-]/g, '_');
            const timestamp = Date.now();

            const expectedFilePath = path.join(tempDir, `atcoder-utility.expected.${sanitizedCaseName}.${timestamp}.txt`);
            const actualFilePath = path.join(tempDir, `atcoder-utility.actual.${sanitizedCaseName}.${timestamp}.txt`);
            
            await fs.writeFile(expectedFilePath, expected);
            await fs.writeFile(actualFilePath, actual);
            
            const expectedFileUri = vscode.Uri.file(expectedFilePath);
            const actualFileUri = vscode.Uri.file(actualFilePath);
            
            const diffTitle = `Diff for ${caseName}: Expected (Left) vs Actual (Right)`;
            await vscode.commands.executeCommand('vscode.diff', expectedFileUri, actualFileUri, diffTitle);

            // 差分タブが閉じられたら一時ファイルを削除するリスナーを登録
            const disposable = vscode.workspace.onDidCloseTextDocument(doc => {
                if (doc.uri.fsPath === expectedFileUri.fsPath || doc.uri.fsPath === actualFileUri.fsPath) {
                    Promise.all([
                        fs.unlink(expectedFilePath).catch(e => console.error(`Failed to delete temp file: ${expectedFilePath}`, e)),
                        fs.unlink(actualFilePath).catch(e => console.error(`Failed to delete temp file: ${actualFilePath}`, e))
                    ]).then(() => {
                        disposable.dispose();
                    });
                }
            });

        } catch (error) {
            console.error('Failed to show diff view:', error);
            vscode.window.showErrorMessage('Failed to show diff view. See console for details.');
        }
    }
}