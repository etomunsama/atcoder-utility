import * as vscode from 'vscode';
import { AtCoderApiService } from './atcoderApiService';
import { InputParserService } from './inputParserService';
import { CodeGeneratorService } from './jsonParserService';
import { getSampleCases } from './atcoderApiService';
import * as path from 'path';

export class SnippetGenerationService {
    constructor(
        private atcoderApiService: AtCoderApiService,
        private inputParserService: InputParserService,
        private codeGeneratorService: CodeGeneratorService
    ) {}

    public async generateAndCopy(uri: vscode.Uri): Promise<void> {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage('アクティブなエディタがありません。スニペットを生成するファイルを開いてください。');
            return;
        }

        const html = await this.atcoderApiService.getOrFetchProblemHtml(uri);
        if (!html) {
            vscode.window.showErrorMessage('Failed to get problem HTML.');
            return;
        }

        const parseResult = this.inputParserService.parseInputFormat(html);
        const { inputBlocks, globalVars, queryDefinitions } = parseResult;

        const filePath = uri.fsPath;
        const parts = filePath.split(path.sep);
        let contestId: string | undefined;
        let taskLetter: string | undefined;

        for (let i = parts.length - 2; i >= 0; i--) {
            if (parts[i].match(/^(abc|arc|agc|ahc|adt|adt_intro|tessoku|practice|typical90|dp|abs)\d*$/i)) {
                contestId = parts[i].toLowerCase();
                taskLetter = parts[i+1].toLowerCase();
                break;
            }
        }

        if (!contestId || !taskLetter) {
            vscode.window.showWarningMessage('Could not determine contest/task ID from file path.');
            return;
        }

        const sampleCases = await getSampleCases(contestId, taskLetter);
        if (!sampleCases || sampleCases.length === 0) {
            vscode.window.showWarningMessage('No sample cases found. Snippet generation may be inaccurate.');
            // サンプルがない場合でも、型推論なしでスニペット生成を試みる
            const config = vscode.workspace.getConfiguration('atcoder-utility');
            const snippet = this.codeGeneratorService.generateSnippet(inputBlocks, config, editor.document.languageId);
            await vscode.env.clipboard.writeText(snippet);
            vscode.window.showInformationMessage('Snippet generated (without type inference) and copied to clipboard!');
            return;
        }

        // 最初のサンプル入力を使用
        const sampleInput = sampleCases[0].input;

        const finalInferredBlocks = this.inputParserService.inferDataTypes(
            inputBlocks,
            sampleInput,
            globalVars,
            queryDefinitions
        );

        const config = vscode.workspace.getConfiguration('atcoder-utility');
        const snippet = this.codeGeneratorService.generateSnippet(inputBlocks, config, editor.document.languageId);

        await vscode.env.clipboard.writeText(snippet);
        vscode.window.showInformationMessage('Snippet generated and copied to clipboard!');
    }
}
