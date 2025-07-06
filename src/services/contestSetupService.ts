import * as vscode from 'vscode';
import * as path from 'path';
import { AtCoderApiService } from './atcoderApiService';
import { SampleCase } from '../types';

export class ContestSetupService {

    constructor(private atcoderApiService: AtCoderApiService) {}

    public async setupContest(contestId: string, parentDirUri: vscode.Uri) {
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `AtCoder: コンテスト '${contestId}' をセットアップ中...`,
            cancellable: false
        }, async (progress) => {

            progress.report({ message: '問題リストを取得中...' });
            const tasks = await this.atcoderApiService.getProblemListForContest(contestId);

            if (!tasks) {
                vscode.window.showErrorMessage(`コンテスト '${contestId}' の問題リストを取得できませんでした。`);
                return;
            }

            const contestDirUri = vscode.Uri.joinPath(parentDirUri, contestId);
            await vscode.workspace.fs.createDirectory(contestDirUri);

            for (const task of tasks) {
                progress.report({ message: `問題 ${task.problem_index} を処理中...` });

                const problemDirUri = vscode.Uri.joinPath(contestDirUri, task.problem_index.toLowerCase());
                await vscode.workspace.fs.createDirectory(problemDirUri);
                
                const testDirUri = vscode.Uri.joinPath(problemDirUri, 'test');
                await vscode.workspace.fs.createDirectory(testDirUri);

                const dummyProblemFileUri = vscode.Uri.joinPath(problemDirUri, 'main.cpp'); 
                const problemHtml = await this.atcoderApiService.getOrFetchProblemHtml(task.contest_id, task.problem_id, dummyProblemFileUri.fsPath);

                let samples: SampleCase[] = [];
                if (problemHtml) {
                    samples = await this.atcoderApiService.getSampleCases(problemHtml as string);
                } else {
                    console.warn(`[ContestSetupService] Failed to fetch problem HTML for ${task.problem_index}. Skipping sample creation.`);
                }

                console.log(`[ContestSetupService] Fetched ${samples.length} samples for task ${task.problem_index} (${contestId}_${task.problem_index.toLowerCase()})`);
                if (samples.length === 0) {
                    console.warn(`[ContestSetupService] No samples found for ${task.problem_index}. Skipping file creation.`);
                }
                for (let i = 0; i < samples.length; i++) {
                    const sample = samples[i];
                    const sampleNum = i + 1;
                    const inFileUri = vscode.Uri.joinPath(testDirUri, `sample-${sampleNum}.in`);
                    const outFileUri = vscode.Uri.joinPath(testDirUri, `sample-${sampleNum}.out`);
                    await vscode.workspace.fs.writeFile(inFileUri, Buffer.from(sample.input, 'utf8'));
                    await vscode.workspace.fs.writeFile(outFileUri, Buffer.from(sample.output, 'utf8'));
                }

                await this.copyTemplateFile(problemDirUri);
            }

            progress.report({ message: '完了！', increment: 100 });
            vscode.window.showInformationMessage(`コンテスト '${contestId}' のセットアップが完了しました。`);
        });
    }

    public async setupProblem(contestId: string, problemId: string, problemIndex: string): Promise<void> {
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `AtCoder: 問題 '${problemId}' をセットアップ中...`,
            cancellable: false
        }, async (progress) => {
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders || workspaceFolders.length === 0) {
                vscode.window.showErrorMessage('ワークスペースが開かれていません。問題をセットアップできません。');
                return;
            }
            const rootPath = workspaceFolders[0].uri.fsPath;
            const contestDir = path.join(rootPath, contestId);
            const problemDir = path.join(contestDir, problemIndex.toLowerCase());
            const testDir = path.join(problemDir, 'test');

            // ディレクトリが存在しない場合のみ作成
            try {
                await vscode.workspace.fs.stat(vscode.Uri.file(problemDir));
                console.log(`Directory ${problemDir} already exists. Skipping creation.`);
            } catch {
                await vscode.workspace.fs.createDirectory(vscode.Uri.file(problemDir));
                await vscode.workspace.fs.createDirectory(vscode.Uri.file(testDir));
            }

            const dummyProblemFileUri = vscode.Uri.file(path.join(problemDir, 'main.cpp'));
            const problemHtml = await this.atcoderApiService.getOrFetchProblemHtml(contestId, problemId, dummyProblemFileUri.fsPath);

            let samples: SampleCase[] = [];
            if (problemHtml) {
                samples = await this.atcoderApiService.getSampleCases(problemHtml as string);
            } else {
                console.warn(`[ContestSetupService] Failed to fetch problem HTML for ${problemId}. Skipping sample creation.`);
            }

            console.log(`[ContestSetupService] Fetched ${samples.length} samples for problem ${problemId}`);
            if (samples.length === 0) {
                console.warn(`[ContestSetupService] No samples found for ${problemId}. Skipping file creation.`);
            }
            for (let i = 0; i < samples.length; i++) {
                const sample = samples[i];
                const sampleNum = i + 1;
                const inFileUri = vscode.Uri.file(path.join(testDir, `sample-${sampleNum}.in`));
                const outFileUri = vscode.Uri.file(path.join(testDir, `sample-${sampleNum}.out`));
                await vscode.workspace.fs.writeFile(inFileUri, Buffer.from(sample.input, 'utf8'));
                await vscode.workspace.fs.writeFile(outFileUri, Buffer.from(sample.output, 'utf8'));
            }

            await this.copyTemplateFile(vscode.Uri.file(problemDir));

            // 問題ファイルを開く
            const commonNames = ['main', 'Main', 'MAIN', 'solution'];
            const extensions = ['.cpp', '.py', '.java', '.rs', '.cs', '.go', '.rb'];
            let openedFile = false;

            // 1. 一般的なメインファイル名と拡張子の組み合わせを探索
            for (const name of commonNames) {
                for (const ext of extensions) {
                    const filePath = path.join(problemDir, `${name}${ext}`);
                    try {
                        await vscode.workspace.fs.stat(vscode.Uri.file(filePath)); // ファイルの存在を確認
                        const document = await vscode.workspace.openTextDocument(filePath);
                        await vscode.window.showTextDocument(document);
                        console.log(`[ContestSetupService] Successfully opened file: ${filePath}`);
                        openedFile = true;
                        break;
                    } catch (e) {
                        // ファイルが存在しない場合は次の組み合わせを試す
                    }
                }
                if (openedFile) break;
            }

            // 2. もし上記で見つからなければ、任意のプログラミング言語のファイルを開く
            if (!openedFile) {
                const files = await vscode.workspace.fs.readDirectory(vscode.Uri.file(problemDir));
                for (const [fileName, fileType] of files) {
                    if (fileType === vscode.FileType.File) {
                        const ext = path.extname(fileName);
                        if (extensions.includes(ext)) {
                            const filePath = path.join(problemDir, fileName);
                            try {
                                const document = await vscode.workspace.openTextDocument(filePath);
                                await vscode.window.showTextDocument(document);
                                console.log(`[ContestSetupService] Successfully opened file: ${filePath}`);
                                openedFile = true;
                                break;
                            } catch (e) {
                                console.warn(`[ContestSetupService] Could not open file ${filePath}:`, e);
                            }
                        }
                    }
                }
            }

            // 3. それでも見つからなければ、テンプレートファイルをデフォルトで開く
            if (!openedFile) {
                const config = vscode.workspace.getConfiguration('atcoder-utility');
                const templatePath = config.get<string>('templateFilePath');
                const defaultFileName = templatePath ? path.basename(templatePath) : 'main.cpp';
                const mainFilePath = path.join(problemDir, defaultFileName);
                try {
                    const document = await vscode.workspace.openTextDocument(mainFilePath);
                    await vscode.window.showTextDocument(document);
                    console.log(`[ContestSetupService] Successfully opened default file: ${mainFilePath}`);
                } catch (error) {
                    console.error(`[ContestSetupService] Failed to open default file ${mainFilePath}:`, error);
                    vscode.window.showErrorMessage(`問題ファイルを開けませんでした: ${mainFilePath}`);
                }
            }

            progress.report({ message: '完了！', increment: 100 });
            vscode.window.showInformationMessage(`問題 '${problemId}' のセットアップが完了しました。`);
        });
    }

    private async copyTemplateFile(problemDirUri: vscode.Uri) {
        const config = vscode.workspace.getConfiguration('atcoder-utility');
        const templatePath = config.get<string>('templateFilePath');

        if (templatePath && typeof templatePath === 'string') {
            try {
                const sourceUri = vscode.Uri.file(templatePath);
                const fileName = path.basename(templatePath);
                const destUri = vscode.Uri.joinPath(problemDirUri, fileName);
                await vscode.workspace.fs.copy(sourceUri, destUri, { overwrite: true });
            } catch (error) {
                vscode.window.showWarningMessage(`テンプレートファイルのコピーに失敗しました: ${templatePath}`);
                console.error('Template copy error:', error);
            }
        }
    }
}