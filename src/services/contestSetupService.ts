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