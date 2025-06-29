import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs/promises';
import { TestCaseGeneratorService } from './testCaseGeneratorService';
import { spawn } from 'child_process';

interface ExecutionResult {
    success: boolean;
    output: string;
    error?: string;
}

export class FuzzerService {
    private isFuzzing = false;
    private outputChannel: vscode.OutputChannel;

    // ★ context を受け取るように変更
    constructor(
        private context: vscode.ExtensionContext,
        private testCaseGeneratorService: TestCaseGeneratorService
    ) {
        this.outputChannel = vscode.window.createOutputChannel("Fuzzer Logs");
    }

    public stop() {
        if (this.isFuzzing) {
            this.isFuzzing = false;
        }
    }

    // ★ startメソッドの引数をシンプルに変更
    public async start(settings: { mainSolutionPath: string, bruteSolutionPath: string, trials: number }, webview: vscode.Webview) {
        if (this.isFuzzing) {
            vscode.window.showWarningMessage('Fuzzingは既に実行中です。');
            return;
        }

        // ★ globalStateからランダム入力の設定を取得
        const randomInputSettings = this.context.globalState.get<any[]>('randomInputSettings', []);
        if (randomInputSettings.length === 0) {
            vscode.window.showErrorMessage('先に「Random Input」ビューで制約を設定し、「この制約を保存」ボタンを押してください。');
            return;
        }

        this.isFuzzing = true;
        this.outputChannel.clear();
        this.outputChannel.show();
        
        const postLog = (text: string) => webview.postMessage({ command: 'updateLog', text });

        try {
            postLog('メインの解法をコンパイル中...');
            this.outputChannel.appendLine(`[Fuzzer] Compiling main solution: ${settings.mainSolutionPath}`);
            const mainExecutable = await this.compile(settings.mainSolutionPath);
            if (!mainExecutable) { throw new Error('メインの解法のコンパイルに失敗しました。'); }

            postLog('正しい解法をコンパイル中...');
            this.outputChannel.appendLine(`[Fuzzer] Compiling brute-force solution: ${settings.bruteSolutionPath}`);
            const bruteExecutable = await this.compile(settings.bruteSolutionPath);
            if (!bruteExecutable) { throw new Error('正しい解法のコンパイルに失敗しました。'); }
            
            for (let i = 1; i <= settings.trials; i++) {
                if (!this.isFuzzing) {
                    const stopMessage = 'ユーザーによって停止されました。';
                    postLog(`\n${stopMessage}`);
                    throw new Error(stopMessage);
                }

                postLog(`\nRunning Test #${i}...`);
                const input = this.testCaseGeneratorService.generate(randomInputSettings);
                const [mainResult, bruteResult] = await Promise.all([
                    this.executeWithInput(mainExecutable, input),
                    this.executeWithInput(bruteExecutable, input)
                ]);

                if (!mainResult.success || !bruteResult.success) {
                    postLog('🔴 実行時エラーが発生しました。');
                    this.outputChannel.appendLine(`--- Test #${i} Runtime Error ---\n[Input]\n${input}\n[Main Solution Error]\n${mainResult.error}\n[Brute Solution Error]\n${bruteResult.error}`);
                    throw new Error(`Test #${i}: 実行時エラーが発生しました。`);
                }

                if (mainResult.output !== bruteResult.output) {
                    postLog(`🔴 ハックケースを発見しました！`);
                    webview.postMessage({ command: 'foundHackCase', input, mainOutput: mainResult.output, bruteOutput: bruteResult.output });
                    const hackCaseDir = path.join(path.dirname(settings.mainSolutionPath), 'hack_cases');
                    await fs.mkdir(hackCaseDir, { recursive: true });
                    await fs.writeFile(path.join(hackCaseDir, `case_${i}.in`), input);
                    await fs.writeFile(path.join(hackCaseDir, `case_${i}_main.out`), mainResult.output);
                    await fs.writeFile(path.join(hackCaseDir, `case_${i}_brute.out`), bruteResult.output);
                    throw new Error(`Test #${i}: 出力が一致しませんでした！`);
                }
                postLog(`Test #${i}: OK`);
            }

            const successMessage = '\nFuzzingが完了しました。問題は見つかりませんでした。';
            postLog(successMessage);
            vscode.window.showInformationMessage(successMessage.trim());

        } catch (error: any) {
            vscode.window.showErrorMessage(error.message);
            webview.postMessage({ command: 'fuzzingFinished', text: `\n🛑 Error: ${error.message}` });
        } finally {
            this.isFuzzing = false;
        }
    }

    private async compile(filePath: string): Promise<string | null> {
        const dir = path.dirname(filePath);
        const executable = path.join(dir, path.basename(filePath, '.cpp') + '.out');
        
        return new Promise((resolve) => {
            const compiler = spawn('g++', ['-std=c++23', '-O2', filePath, '-o', executable]);
            compiler.stderr.on('data', (data: Buffer) => {
                this.outputChannel.appendLine(`[Compile Error: ${path.basename(filePath)}]\n${data.toString()}`);
            });
            compiler.on('close', (code: number) => {
                resolve(code === 0 ? executable : null);
            });
            compiler.on('error', (err) => {
                 this.outputChannel.appendLine(`[Compiler Error: ${err.message}]`);
                 resolve(null);
            });
        });
    }

    private async executeWithInput(executablePath: string, input: string): Promise<ExecutionResult> {
        return new Promise((resolve) => {
            const process = spawn(executablePath, [], { timeout: 2000 });
            let output = '';
            let error = '';

            process.stdout.on('data', (data: Buffer) => output += data.toString());
            process.stderr.on('data', (data: Buffer) => error += data.toString());
            
            process.on('error', () => resolve({ success: false, output, error: 'Process failed to start or timed out.' }));
            process.on('close', (code, signal) => {
                if (signal) {
                    error += `Process was killed by signal: ${signal}`;
                }
                resolve({ success: code === 0 && !signal, output, error });
            });

            process.stdin.write(input);
            process.stdin.end();
        });
    }
}