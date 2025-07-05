// src/services/inputParserService.ts

import * as vscode from 'vscode';
import * as cheerio from 'cheerio';
import { VariableInfo } from '../types/index'; // 既存のVariableInfoの定義
import { InputBlock, GlobalVariablesBlock, ArrayBlock, QueryBlock, SimpleInputBlock, NormalVariable, ArrayVariable, QueryParam, QueryDefinition, ParserState } from '../types/InputBlock'; // 新しいJSON形式の型定義

// ログ出力用のチャンネル (テスト環境対応済み)
interface ParserOutputChannel { appendLine(message: string): void; clear(): void; show?(): void; dispose?(): void; }

export class InputParserService {

    private outputChannel: ParserOutputChannel;

    constructor(outputChannel: ParserOutputChannel) {
        this.outputChannel = outputChannel;
        this.outputChannel.appendLine("InputParserService initialized.");
    }

    /**
     * 問題文のHTMLからテキストを抽出し、前処理を行います。
     * @param html 問題文のHTMLコンテンツ
     * @returns 前処理された行の配列
     */
    private preprocessHtml(html: string): string[] { 
        this.outputChannel.appendLine("  Preprocessing HTML...");
        const $ = cheerio.load(html);
        const preElements = $('div.io-style pre');

        let rawPreText = preElements.map((i, el) => $(el).text()).get().join('\n');
        rawPreText = rawPreText.replace(/<var>(.*?)<\/var>/g, '$1');
        rawPreText = rawPreText.replace(/&/g, '&');
        rawPreText = rawPreText.replace(/</g, '<');
        rawPreText = rawPreText.replace(/>/g, '>');
        this.outputChannel.appendLine("  Pre-processed text:\n" + rawPreText);
        return rawPreText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    }

    /**
     * 問題文のHTMLから入力形式を解析し、構造化された InputBlock オブジェクトの配列を返します。
     * @param html 問題文のHTMLコンテンツ
     * @returns 構造化された入力ブロックの配列と、グローバル変数マップ、クエリ定義マップ
     */
    public parseInputFormat(html: string): { inputBlocks: InputBlock[], globalVars: Map<string, number | string>, queryDefinitions: Map<number, string[]> } { 
        this.outputChannel.clear();
        this.outputChannel.appendLine("Starting input format parsing...");

        const lines = this.preprocessHtml(html); // HTML前処理

        // ★★★ ここを修正：classifyAndExtractPatterns の戻り値を受け取る ★★★
        const classifiedResult = this.classifyAndExtractPatterns(lines);
        const inputBlocks = classifiedResult.inputBlocks;
        const globalVarsFromClassification = classifiedResult.globalVars; // 名前を変更して区別
        const queryDefinitionsFromClassification = classifiedResult.queryDefinitions; // 名前を変更して区別
        // ★★★ ここまで修正 ★★★

        // classifyAndExtractPatterns の中でログは出力済みなので、ここでは不要
        // this.outputChannel.appendLine("Parsing completed. Extracted InputBlocks:\n" + JSON.stringify(inputBlocks, null, 2));

        // convertInputBlocksToVariableInfo はこの関数では使わないので、削除
        // testParser.ts で finalVariables を生成する部分も削除

        return {
            inputBlocks: inputBlocks, // これが重要！
            globalVars: globalVarsFromClassification, // classifyAndExtractPatterns から受け取ったものを使う
            queryDefinitions: queryDefinitionsFromClassification // classifyAndExtractPatterns から受け取ったものを使う
        };
    }

    /**
     * 行を分類し、パターンを抽出し、新しい InputBlock 形式に変換します。
     * これがパーサーの主要なロジックです。
     * @param lines 前処理された行の配列
     * @returns InputBlock オブジェクトの配列 (新しいJSON形式)
     */
    private classifyAndExtractPatterns(lines: string[]): { inputBlocks: InputBlock[], globalVars: Map<string, number | string>, queryDefinitions: Map<number, string[]> } { // 戻り値の型を修正
        this.outputChannel.appendLine("  Classifying and extracting patterns...");
        const inputBlocks: InputBlock[] = [];
        const globalVars: Map<string, number | string> = new Map(); // ここで直接 globalVars を管理
        const queryDefinitions: Map<number, string[]> = new Map(); // ここで直接 queryDefinitions を管理

        

        const state: ParserState = { // ParserState は InputBlock.ts からインポートされる
            globalVars: globalVars, // 参照を渡す
            currentLineIndex: 0,
            lastDetectedPattern: 'none',
            lastDetectedVariables: null,
        };
        let currentParseContext: 'global' | 'query_definition_section' | 'multi_line_array_definition' = 'global'; 

        for (state.currentLineIndex = 0; state.currentLineIndex < lines.length; state.currentLineIndex++) {
            const line = lines[state.currentLineIndex];
            this.outputChannel.appendLine(`\nProcessing line ${state.currentLineIndex + 1}: '${line}'`);

            // === スキップ処理 ===
            if (line.startsWith('#') || line.length === 0 || line.endsWith('。') || line.startsWith('ここで') || line.startsWith('但し')) {
                this.outputChannel.appendLine("  Skipping as comment or descriptive text.");
                state.lastDetectedPattern = 'none';
                state.lastDetectedVariables = null;
                continue;
            }
            if (line.startsWith('タイプ') && line.includes('のクエリは以下の形式で与えられる')) {
                this.outputChannel.appendLine("  Skipping as query type descriptive text, setting context.");
                currentParseContext = 'query_definition_section';
                state.lastDetectedPattern = 'none';
                state.lastDetectedVariables = null;
                continue;
            }

            // === 各種パターンの識別と処理（より具体的なパターンを先に！） ===

            // 1. クエリタイプ定義行 (1 p, 2 p s, 3 p) - 最も具体的な行パターン
            const queryTypeMatch = line.match(/^([0-9]+)( ([A-Za-z_][A-Za-z0-9_]*))*$/);
            if (queryTypeMatch && currentParseContext === 'query_definition_section') {
                const typeId = parseInt(queryTypeMatch[1], 10);
                const params: QueryParam[] = queryTypeMatch[0].split(' ').slice(1).map(s => s.trim()).filter(s => s.length > 0).map(pName => ({ name: pName, dataType: 'unknown' }));
                this.outputChannel.appendLine(`  Detected query type ${typeId}: Params=${params.map(p=>p.name).join(', ')}`);
                
                let queryBlock: QueryBlock | undefined = inputBlocks.find((b): b is QueryBlock => b.type === 'queryBlock'); 
                if (!queryBlock) { 
                    queryBlock = { type: 'queryBlock', countVariable: 'Q', queryDefinitions: [] }; // ★★★ ここで [] と初期化済み ★★★
                    inputBlocks.push(queryBlock);
                }
                queryBlock.queryDefinitions.push({ typeId, params, exampleLine: line }); 
                queryDefinitions.set(typeId, params.map(p=>p.name)); // queryDefinitions マップもここで更新

                state.lastDetectedPattern = 'query_entry'; 
                state.lastDetectedVariables = params.map(p=>p.name);
                continue;
            }


            // 2. LaTeX形式のクエリプレースホルダー行 (\mathrm{query}_1 や \rm{Query}_Q)
            const latexQueryPlaceholderMatch = line.match(/^\\(mathrm|rm){query}_([0-9A-Za-z_]+)$/);
            if (latexQueryPlaceholderMatch) {
                let queryBlock: QueryBlock | undefined = inputBlocks.find((b): b is QueryBlock => b.type === 'queryBlock');
                if (!queryBlock) {
                    queryBlock = { type: 'queryBlock', countVariable: 'Q', queryDefinitions: [] }; // ★★★ ここでも初期化を確実にする ★★★
                    inputBlocks.push(queryBlock);
                }
                const queryIndexOrVar = latexQueryPlaceholderMatch[2];
                this.outputChannel.appendLine(`  Detected LaTeX query placeholder: ${queryIndexOrVar}`);
                currentParseContext = 'query_definition_section'; 
                state.lastDetectedPattern = 'none';
                state.lastDetectedVariables = null;
                continue;
            }
            
            // 3. \vdots の検出 (最優先)
            // 3. \vdots の検出 (最優先)
            if (line === '\\vdots') {
                this.outputChannel.appendLine("  Detected \\vdots. This implies repetition.");
                if (state.lastDetectedPattern === 'array_entry' && state.lastDetectedVariables) {
                    this.outputChannel.appendLine(`  Confirming arrays based on previous pattern: ${state.lastDetectedVariables.join(', ')}`);
                    const sizeVarCandidate = inputBlocks.slice().reverse().find((b): b is GlobalVariablesBlock => b.type === 'globalVariables')?.variables.slice().reverse().find(v => (v.name === 'M' || v.name === 'N' || v.name === 'K' || v.name === 'L'));
                    
                    if (sizeVarCandidate) {
                        state.lastDetectedVariables.forEach(baseName => {
                            //@ts-ignore
                            const lastArrayBlock = inputBlocks.slice().reverse().find((b): b is ArrayBlock => (b as ArrayBlock).type === 'arrayBlock' && b.patternLine.variables.some(v => v.name === baseName));
                            if (lastArrayBlock) { 
                                lastArrayBlock.patternLine.variables.forEach(arrVar => {
                                    if (arrVar.name === baseName && !arrVar.sizeVariables.includes(sizeVarCandidate.name)) {
                                        arrVar.sizeVariables.push(sizeVarCandidate.name);
                                        this.outputChannel.appendLine(`    Associated array ${arrVar.name} with size variable ${sizeVarCandidate.name}.`);
                                    }
                                });
                                lastArrayBlock.repeatCountVariable = sizeVarCandidate.name; 
                                lastArrayBlock.repeatDelimiter = '\\vdots'; 
                                // lastArrayBlock.endLineText はここでは設定しない。最後の行で設定する
                            } else {
                                this.outputChannel.appendLine("    No preceding ArrayBlock found to associate \\vdots.");
                            }

                        });
                        currentParseContext = 'multi_line_array_definition'; 
                    } else {
                        this.outputChannel.appendLine("    No suitable size variable found for \\vdots pattern.");
                    }
                } else {
                    this.outputChannel.appendLine("  \\vdots detected but no preceding array entry pattern found to repeat.");
                }
                state.lastDetectedPattern = 'array_entry'; // \vdots が来た後も配列パターンは継続するとマーク
                state.lastDetectedVariables = null; // 変数リストはクリア
                continue;
            }
            
            // ★★★ ここから修正：A_M B_M のような最終行の処理を、最も優先的に、独立して行う ★★★
            // 4. \vdots の後で来る最終的な添字付き複数変数行 (A_M B_M) の検出
            // このパターンは multiVariableIndexedLineMatch と同じ正規表現
            const finalIndexedLineMatch = line.match(/^([A-Za-z_][A-Za-z0-9_]*_([0-9A-Za-z_]+))( ([A-Za-z_][A-Za-z0-9_]*_([0-9A-Za-z_]+)))+$/);
            if (finalIndexedLineMatch && state.lastDetectedPattern === 'array_entry') { // state.lastDetectedVariables のチェックを削除
                const namesInLine = finalIndexedLineMatch[0].split(' ').map(s => s.trim()).filter(s => s.length > 0);
                const arrayVarsNames = namesInLine.map(n => n.split('_')[0]); // A_M -> A, B_M -> B

                // ここで、state.lastDetectedVariables は null にクリアされているので、
                // 実際に一致させるのは、最後に作成された ArrayBlock の patternLine.variables のベース名
                const lastArrayBlockCandidate = inputBlocks.slice().reverse().find((b): b is ArrayBlock => (b as ArrayBlock).type === 'arrayBlock' && (b as ArrayBlock).repeatDelimiter === '\\vdots');
                
                if (lastArrayBlockCandidate && JSON.stringify(lastArrayBlockCandidate.patternLine.variables.map(v=>v.name)) === JSON.stringify(arrayVarsNames)) {
                    // lastArrayBlock が \vdots で repeatDelimiter が '\\vdots' になっているはず
                    lastArrayBlockCandidate.endLineText = line; // 最終行として設定
                    this.outputChannel.appendLine(`  Updated ArrayBlock endLineText for final pattern: ${line}.`);
                    state.lastDetectedPattern = 'none'; // 最終行を処理したので、パターンをリセット
                    state.lastDetectedVariables = null;
                    continue; // ★★★ これが重要：処理したので、必ず次の行へ進む ★★★
                }
            }
            // ★★★ ここまで修正した A_M B_M 処理部分 ★★★


            // 4. 水平方向の配列行 (P_1 P_2 ... P_N)
            const horizontalArrayMatch = line.match(
                /^([A-Za-z_][A-Za-z0-9_]*_([0-9A-Za-z_]+))( ([A-Za-z_][A-Za-z0-9_]*(_[0-9A-Za-z_]+)))* \\ldots( ([A-Za-z_][A-Za-z0-9_]*(_[0-9A-Za-z_]+)))?$/ // \ldots を必須とする
            );
            if (horizontalArrayMatch) {
                this.outputChannel.appendLine(`  Detected horizontal array pattern (with \\ldots).`);
                const parts = line.split(' ').map(s => s.trim()).filter(s => s.length > 0);
                const arrayBaseName = parts[0].split('_')[0]; 
                let sizeVar: string | null = null;

                const dotsIndex = parts.indexOf('\\ldots');
                if (dotsIndex !== -1) {
                    if (dotsIndex + 1 < parts.length) {
                         const afterDots = parts[dotsIndex + 1];
                         sizeVar = afterDots.includes('_') ? afterDots.split('_')[1] : afterDots;
                    } else {
                        const precedingGlobalVar = inputBlocks.slice().reverse().find((b): b is GlobalVariablesBlock => b.type === 'globalVariables')?.variables.slice().reverse().find(v => v.name);
                        sizeVar = precedingGlobalVar ? precedingGlobalVar.name : null;
                        this.outputChannel.appendLine(`    Assuming size variable ${sizeVar} from preceding global variable.`);
                    }
                }

                const arrayVar: ArrayVariable = {
                    name: arrayBaseName,
                    dataType: 'unknown',
                    dimensions: [1],
                    sizeVariables: sizeVar ? [sizeVar] : [],
                    isMultiColumn: false,
                    indexStart: 1 
                };

                inputBlocks.push({
                    type: 'arrayBlock',
                    //@ts-ignore
                    patternLine: { variables: [arrayVar], delimiterAfterLine: '\\n' },
                    repeatCountVariable: sizeVar || 'N', 
                    repeatDelimiter: 'unknown',
                    startLineText: line
                });
                state.lastDetectedPattern = 'array_entry';
                state.lastDetectedVariables = [arrayBaseName];
                continue;
            }

            // 5. 添字付きの複数変数行 (A_1 B_1) - ArrayBlock の patternLine
            const multiVariableIndexedLineMatch = line.match(/^([A-Za-z_][A-Za-z0-9_]*_([0-9A-Za-z_]+))( ([A-Za-z_][A-Za-z0-9_]*_([0-9A-Za-z_]+)))+$/);
            if (multiVariableIndexedLineMatch) {
                this.outputChannel.appendLine(`  Detected multi-variable indexed line (e.g., A_1 B_1).`);
                const namesInLine = multiVariableIndexedLineMatch[0].split(' ').map(s => s.trim()).filter(s => s.length > 0);
                const arrayVars: ArrayVariable[] = namesInLine.map(n => ({
                    name: n.split('_')[0],
                    dataType: 'unknown',
                    dimensions: [1],
                    sizeVariables: [], 
                    isMultiColumn: true,
                    indexStart: parseInt(n.split('_')[1], 10) || 1
                }));

                // ★★★ ここを修正：既存の ArrayBlock を更新するロジックを強化 ★★★
                let arrayBlockToUpdate: ArrayBlock | undefined = undefined;
                
                // 1. まず、\vdots が既に関連付けられている「完成途中の」ArrayBlock を探す (endLineText 更新のため)
                arrayBlockToUpdate = inputBlocks.slice().reverse().find((b): b is ArrayBlock => 
                    (b as ArrayBlock).type === 'arrayBlock' && 
                    (b as ArrayBlock).repeatDelimiter === '\\vdots' && // \vdots が関連付けられている
                    JSON.stringify((b as ArrayBlock).patternLine.variables.map(v=>v.name)) === JSON.stringify(arrayVars.map(v=>v.name)) // 同じパターン
                ) as ArrayBlock | undefined;

                if (arrayBlockToUpdate) { // 見つかった場合、それが A_M B_M のような最終行
                    arrayBlockToUpdate.endLineText = line; // 最終行として設定
                    this.outputChannel.appendLine(`  Updated existing ArrayBlock endLineText for final pattern: ${line}.`);
                    state.lastDetectedPattern = 'array_entry'; 
                    state.lastDetectedVariables = arrayVars.map(v=>v.name);
                    continue; // 処理したので、次の行へ進む
                }
                
                // 2. 次に、\vdots がまだ関連付けられていない「連続中の」ArrayBlock を探す (minRepeatCount 更新のため)
                arrayBlockToUpdate = inputBlocks.slice().reverse().find((b): b is ArrayBlock => 
                    (b as ArrayBlock).type === 'arrayBlock' && 
                    (b as ArrayBlock).repeatDelimiter === 'unknown' && // \vdots がまだ関連付けられていない
                    JSON.stringify((b as ArrayBlock).patternLine.variables.map(v=>v.name)) === JSON.stringify(arrayVars.map(v=>v.name)) // 同じパターン
                ) as ArrayBlock | undefined;
                
                if(arrayBlockToUpdate) { // 既存のブロックを更新（A_2 B_2 のような連続する行）
                    if (!arrayBlockToUpdate.minRepeatCount) { arrayBlockToUpdate.minRepeatCount = 1; }
                    arrayBlockToUpdate.minRepeatCount++; 
                    arrayBlockToUpdate.endLineText = line; // 連続する行の endLineText も更新
                    this.outputChannel.appendLine(`  Updating existing arrayBlock for continuous pattern.`);
                }

                // 3. 既存のブロックが見つからなければ新規作成 (A_1 B_1 のような最初の行)
                if (!arrayBlockToUpdate) { 
                    arrayBlockToUpdate = {
                        type: 'arrayBlock',
                        patternLine: { variables: arrayVars, delimiterAfterLine: '\\n', delimiterBetweenVars: 'SPACE' },
                        repeatCountVariable: 'unknown', 
                        repeatDelimiter: 'unknown', 
                        startLineText: line,
                        minRepeatCount: 1 
                    };
                    inputBlocks.push(arrayBlockToUpdate);
                    this.outputChannel.appendLine(`  Added new ArrayBlock.`);
                }
                
                state.lastDetectedPattern = 'array_entry'; 
                state.lastDetectedVariables = arrayVars.map(v=>v.name);
                continue; // ★★★ 処理したので、次の行へ進む ★★★
            }

            
            

            // 6. 最も一般的な単一/複数変数行 (N M Q, N, S)
            const simpleVarMatch = line.match(/^([A-Za-z_][A-Za-z0-9_]*)( ([A-Za-z_][A-Za-z0-9_]*))*$/);
            if (simpleVarMatch) {
                const names = simpleVarMatch[0].split(' ').map(s => s.trim()).filter(s => s.length > 0);
                this.outputChannel.appendLine(`  Detected simple variable line: ${names.join(', ')}`);
                const normalVars: NormalVariable[] = names.map(name => ({ name, dataType: 'unknown', isInline: names.length > 1 }));

                let globalBlock: GlobalVariablesBlock | undefined = inputBlocks.slice().reverse().find((b): b is GlobalVariablesBlock => b.type === 'globalVariables'); 
                if (!globalBlock) {
                    globalBlock = { type: 'globalVariables', variables: [], endDelimiter: '\\n' };
                    inputBlocks.push(globalBlock);
                }
                normalVars.forEach(nv => {
                    if (!globalBlock!.variables.some(v => v.name === nv.name)) {
                        globalBlock!.variables.push(nv);
                        state.globalVars.set(nv.name, 0); 
                    }
                });
                
                state.lastDetectedPattern = 'simpleVar';
                state.lastDetectedVariables = names;
                continue;
            }
            
            this.outputChannel.appendLine(`  Line could not be classified: '${line}'`);
            state.lastDetectedPattern = 'none';
            state.lastDetectedVariables = null;
            continue;
        }

        this.outputChannel.appendLine("Parsing completed. Extracted InputBlocks:\n" + JSON.stringify(inputBlocks, null, 2));
        return { inputBlocks: inputBlocks, globalVars: state.globalVars, queryDefinitions: queryDefinitions };
    }

    private convertInputBlocksToVariableInfo(inputBlocks: InputBlock[]): VariableInfo[] {
        const finalVariables: VariableInfo[] = [];

        inputBlocks.forEach(block => {
            if (block.type === 'globalVariables') {
                const globalBlock = block as GlobalVariablesBlock; 
                globalBlock.variables.forEach(v => finalVariables.push({ name: v.name, type: v.dataType, isArray: false, isQuery: false }));
            } else if (block.type === 'simpleInput') {
                 const simpleBlock = block as SimpleInputBlock; 
                 simpleBlock.variables.forEach(v => finalVariables.push({ name: v.name, type: v.dataType, isArray: false, isQuery: false }));
            } else if (block.type === 'arrayBlock') {
                const arrayBlock = block as ArrayBlock; 
                arrayBlock.patternLine.variables.forEach(v => {
                    finalVariables.push({
                        name: v.name, type: v.dataType, isArray: true,
                        dimensions: v.dimensions, sizeVariables: v.sizeVariables,
                        isQuery: false
                    });
                });
            } else if (block.type === 'queryBlock') {
                const queryBlock = block as QueryBlock; 
                // ★★★ ここを修正：queryBlock.queryDefinitions が存在し、かつ配列であることを確認 ★★★
                if (queryBlock.queryDefinitions && Array.isArray(queryBlock.queryDefinitions)) { 
                    queryBlock.queryDefinitions.forEach(queryDef => {
                        finalVariables.push({
                            name: `query_type_${queryDef.typeId}`, type: 'unknown', isArray: false, isQuery: true,
                            queryDetails: {
                                countVar: queryBlock.countVariable,
                                typeVar: 'type', 
                                // ★★★ queryDef.params が存在し、かつ配列であることを確認 ★★★
                                vars: (queryDef.params && Array.isArray(queryDef.params) ? queryDef.params.map(p => ({ name: p.name, type: p.dataType, isArray: false, isQuery: false })) : [])
                            }
                        });
                    });
                } else {
                    this.outputChannel.appendLine(`  Warning: queryBlock.queryDefinitions is not an array or is undefined for queryBlock.`);
                }
            }
        });
        return finalVariables;
    }

    /**
     * 構造化された InputBlock データとサンプル入力から、各変数のデータ型を推論します。
     * @param inferredBlocks parseInputFormat で生成された InputBlock の配列 (このメソッドで更新される)
     * @param sampleText サンプル入力の生のテキスト
     * @param globalVars parseInputFormat から渡された globalVars (初期値0)
     * @param queryDefs parseInputFormat から渡された queryDefinitions
     * @returns 型推論後の InputBlock の配列
     */
    public inferDataTypes(inferredBlocks: InputBlock[], sampleText: string, globalVars: Map<string, number | string>, queryDefs: Map<number, string[]>): InputBlock[] {
        this.outputChannel.appendLine("\nStarting data type inference...");
        const sampleLines = sampleText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        
        let currentSampleLineIndex = 0; // サンプル入力の現在の行インデックス（常に進める）

        // クエリパラメータの推論結果を一時保存するマップを、メソッド冒頭で一度だけ初期化する
        const allQueryParamInferenceResults: Map<string, { type: string | null, vals: string[] }> = new Map();
        const allUniqueParamNamesAcrossAllQueryTypes: string[] = []; 
        queryDefs.forEach(params => {
            params.forEach(paramName => {
                if (!allUniqueParamNamesAcrossAllQueryTypes.includes(paramName)) {
                    allUniqueParamNamesAcrossAllQueryTypes.push(paramName);
                }
            });
        });
        allUniqueParamNamesAcrossAllQueryTypes.forEach(paramName => allQueryParamInferenceResults.set(paramName, { type: null, vals: [] }));

        if (!inferredBlocks || inferredBlocks.length === 0) {
            this.outputChannel.appendLine(`  Warning: No input blocks provided for inference. Returning original blocks.`);
            return inferredBlocks; // または空の配列を返す
        }

        // --- 1. 各ブロックをループし、変数の型を推論し、サンプル行を消費していく ---
        // このループが、サンプル入力の行を消費するメインの制御構造となる
        for (let i = 0; i < inferredBlocks.length; i++) {
            const block = inferredBlocks[i]; 

            // サンプル入力の行がもうない場合は、残りのブロックをスキップ
            if (currentSampleLineIndex >= sampleLines.length) {
                this.outputChannel.appendLine(`  Skipping block type ${block.type}: No more sample lines available.`);
                // 残りのブロックの変数も unknown に設定 (もし dataType が unknown のままなら)
                if (block.type === 'globalVariables') { (block as GlobalVariablesBlock).variables.forEach(v => { if (v.dataType === 'unknown') v.dataType = 'unknown'; }); }
                else if (block.type === 'simpleInput') { (block as SimpleInputBlock).variables.forEach(v => { if (v.dataType === 'unknown') v.dataType = 'unknown'; }); }
                else if (block.type === 'arrayBlock') { (block as ArrayBlock).patternLine.variables.forEach(v => { if (v.dataType === 'unknown') v.dataType = 'unknown'; }); }
                else if (block.type === 'queryBlock') { (block as QueryBlock).queryDefinitions.forEach(qd => qd.params.forEach(p => { if (p.dataType === 'unknown') p.dataType = 'unknown'; })); }
                continue; 
            }

            // --- グローバル変数ブロック ---
            if (block.type === 'globalVariables') {
                const globalBlock = block as GlobalVariablesBlock; 
                const line = sampleLines[currentSampleLineIndex];
                const parts = line.split(' ').map(s => s.trim()).filter(s => s.length > 0);
                
                let partIndex = 0;
                for (const v of globalBlock.variables) {
                    if (partIndex < parts.length) {
                        const val = parts[partIndex];
                        let inferredType: string = 'unknown';
                        if (val.match(/^[0-9]+$/)) { inferredType = 'int'; }
                        else if (val.match(/^[0-9]+\.[0-9]+$/)) { inferredType = 'double'; }
                        else { inferredType = 'string'; }
                        
                        globalVars.set(v.name, inferredType === 'int' ? parseInt(val, 10) : (inferredType === 'double' ? parseFloat(val) : val));
                        v.dataType = inferredType; 
                        this.outputChannel.appendLine(`  Inferred globalVar ${v.name} as ${v.dataType} from '${val}'.`);
                        partIndex++;
                    } else {
                        this.outputChannel.appendLine(`  Warning: Not enough values in sample line for globalVar ${v.name}. Remains unknown.`);
                        v.dataType = 'unknown'; // 値がなければ unknown
                    }
                }
                currentSampleLineIndex++; // 1行消費
                continue; 
            }

            // --- シンプルな単一入力ブロック (S など) ---
            if (block.type === 'simpleInput') { 
                const simpleBlock = block as SimpleInputBlock; 
                const line = sampleLines[currentSampleLineIndex];
                const parts = line.split(' ').map(s => s.trim()).filter(s => s.length > 0);
                const val = parts[0]; 

                if (simpleBlock.variables.length > 0 && val !== undefined) {
                    const v = simpleBlock.variables[0]; 
                    let inferredType: string = 'unknown';
                    if (val.match(/^[0-9]+$/)) { inferredType = 'int'; }
                    else if (val.match(/^[0-9]+\.[0-9]+$/)) { inferredType = 'double'; }
                    else { inferredType = 'string'; }
                    v.dataType = inferredType; 
                    this.outputChannel.appendLine(`  Inferred simpleInput variable ${v.name} as ${v.dataType} from value '${val}'.`);
                } else {
                    this.outputChannel.appendLine(`  Could not infer type for simpleInput block: No value available.`);
                    if (simpleBlock.variables.length > 0) simpleBlock.variables[0].dataType = 'unknown';
                }
                currentSampleLineIndex++; // 1行消費
                continue; 
            }

            // --- 配列ブロック (P, A, B など) ---
            if (block.type === 'arrayBlock') { 
                const arrayBlock = block as ArrayBlock; 
                const arrayPatternVars = arrayBlock.patternLine.variables;
                const arraySizeVarName = arrayBlock.repeatCountVariable; 
                let actualArraySize = 1; 

                if (arraySizeVarName && globalVars.has(arraySizeVarName)) {
                    actualArraySize = Number(globalVars.get(arraySizeVarName));
                    if (isNaN(actualArraySize) || actualArraySize <= 0) actualArraySize = 1;
                } else {
                    this.outputChannel.appendLine(`  Warning: Array size variable ${arraySizeVarName} value not found in globalVars. Assuming size 1.`);
                    actualArraySize = 1;
                }

                if (actualArraySize > 0 && currentSampleLineIndex < sampleLines.length) {
                    const tempArrayValuesPerColumn: Map<string, { type: string | null; values: string[] }> = new Map();
                    arrayPatternVars.forEach(arrVar => {
                        tempArrayValuesPerColumn.set(arrVar.name, { type: null, values: [] });
                    });

                    for (let j = 0; j < actualArraySize && (currentSampleLineIndex + j) < sampleLines.length; j++) {
                        const currentArrayLine = sampleLines[currentSampleLineIndex + j];
                        const parts = currentArrayLine.split(' ').map(s => s.trim()).filter(s => s.length > 0);
                        
                        arrayPatternVars.forEach((arrVar, colIdx) => {
                            const val = parts[colIdx];
                            if (val !== undefined) {
                                let currentValType: string = 'unknown';
                                if (val.match(/^[0-9]+$/)) { currentValType = 'int'; }
                                else if (val.match(/^[0-9]+\.[0-9]+$/)) { currentValType = 'double'; }
                                else { currentValType = 'string'; }

                                const currentColumnData = tempArrayValuesPerColumn.get(arrVar.name)!;
                                if (currentColumnData.type === null) { currentColumnData.type = currentValType; }
                                else if (currentColumnData.type !== currentValType) {
                                    if (currentColumnData.type === 'int' && currentValType === 'string') { currentColumnData.type = 'string'; }
                                    else if (currentColumnData.type === 'double' && currentValType === 'string') { currentColumnData.type = 'string'; }
                                    else if (currentColumnData.type === 'int' && currentValType === 'double') { currentColumnData.type = 'double'; }
                                    else if (currentColumnData.type === 'double' && currentValType === 'int') { currentColumnData.type = 'double'; }
                                }
                                currentColumnData.values.push(val);
                            }
                        });
                    }

                    arrayPatternVars.forEach(arrVar => {
                        const columnData = tempArrayValuesPerColumn.get(arrVar.name);
                        if (columnData && columnData.type) {
                            arrVar.dataType = columnData.type; // InputBlock 内の変数の型を更新
                            this.outputChannel.appendLine(`  Inferred array type for ${arrVar.name} as ${arrVar.dataType} based on column values.`);
                        } else {
                            this.outputChannel.appendLine(`  Warning: No values found for array ${arrVar.name}. Type remains unknown.`);
                        }
                    });

                    currentSampleLineIndex += actualArraySize; // 配列の行を全て消費
                } else {
                    this.outputChannel.appendLine(`  No sample lines available for array ${arrayBlock.patternLine.variables[0]?.name || 'unknown'}.`);
                }
                continue; 
            }


            if (block.type === 'queryBlock') { // クエリブロック
                const queryBlock = block as QueryBlock; 
                const qCount = Number(globalVars.get(queryBlock.countVariable || 'Q') || 0);

                if (queryBlock.queryDefinitions.length > 0 && qCount > 0) {
                    this.outputChannel.appendLine(`  Starting query type inference for QueryBlock (count: ${qCount}).`);

                    // allQueryParamInferenceResults はメソッド冒頭で初期化済み

                    const queryBlockStartLine = currentSampleLineIndex;
                    for (let qi = 0; qi < qCount && (queryBlockStartLine + qi) < sampleLines.length; qi++) {
                        const queryLine = sampleLines[queryBlockStartLine + qi];
                        const parts = queryLine.split(' ').map(s => s.trim()).filter(s => s.length > 0);
                        const actualQueryTypeVal = parts.shift(); 

                        this.outputChannel.appendLine(`    Processing query ${qi + 1} (Actual Sample Type: ${actualQueryTypeVal}): '${queryLine}'`);

                        const definedParamsForActualType = queryDefs.get(parseInt(actualQueryTypeVal!, 10));
                        if (definedParamsForActualType) {
                            definedParamsForActualType.forEach((definedParamName, definedParamIdx) => {
                                const paramVal = parts[definedParamIdx]; 

                                if (paramVal !== undefined) {
                                    let currentType: string = 'unknown';
                                    if (paramVal.match(/^[0-9]+$/)) { currentType = 'int'; }
                                    else if (paramVal.match(/^[0-9]+\.[0-9]+$/)) { currentType = 'double'; }
                                    else { currentType = 'string'; }
                                    
                                    const currentResult = allQueryParamInferenceResults.get(definedParamName)!; 
                                    if (currentResult.type === null) {
                                        currentResult.type = currentType;
                                    } else if (currentResult.type !== currentType) { // ★★★ ここを修正：比較対象を currentType に ★★★
                                        if (currentResult.type === 'int' && currentType === 'string') { currentResult.type = 'string'; }
                                        else if (currentResult.type === 'double' && currentType === 'string') { currentResult.type = 'string'; }
                                        else if (currentResult.type === 'int' && currentType === 'double') { currentResult.type = 'double'; }
                                        else if (currentResult.type === 'double' && currentType === 'int') { currentResult.type = 'double'; }
                                    }
                                    currentResult.vals.push(paramVal);
                                    this.outputChannel.appendLine(`      Found sample for param ${definedParamName} as ${currentType} from '${paramVal}' (query ${qi + 1}, type ${actualQueryTypeVal})`);
                                } else {
                                    this.outputChannel.appendLine(`      Warning: Param ${definedParamName} not found in matching sample line for type ${actualQueryTypeVal}. Type remains unknown.`);
                                }
                            });
                        } else {
                            this.outputChannel.appendLine(`      Warning: Query type ${actualQueryTypeVal} not found in query definitions.`);
                        }
                    }
                    // クエリのループが終了したら、収集した推論結果を block.queryDefinitions のパラメータに適用
                    //@ts-ignore
                    block.queryDefinitions.forEach(queryDef => { 
                        queryDef.params.forEach(param => { 
                            const finalResult = allQueryParamInferenceResults.get(param.name);
                            if (finalResult && finalResult.type) {
                                param.dataType = finalResult.type; 
                                this.outputChannel.appendLine(`    Final inferred type for ${param.name} in query type ${queryDef.typeId}: ${finalResult.type}`);
                            } else {
                                this.outputChannel.appendLine(`    Warning: Final type for ${param.name} in query type ${queryDef.typeId} could not be determined. Remains unknown.`);
                            }
                        });
                    });

                    currentSampleLineIndex += qCount; // クエリブロックの行を全て消費
                    continue; 
                } else {
                    this.outputChannel.appendLine(`  No query details or Q count found for QueryBlock. Type remains unknown.`);
                }
                continue; 
            }
            // 未分類のブロック (通常はここに来ないはず)
            this.outputChannel.appendLine(`  Warning: Unclassified block type found: ${block.type}.`);
            continue;
        }

        this.outputChannel.appendLine("Data type inference completed. Inferred Blocks:\n" + JSON.stringify(inferredBlocks, null, 2));
        
        return inferredBlocks;
    }
}