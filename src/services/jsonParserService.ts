import * as vscode from 'vscode'; // VS Code API (設定取得用)
import { InputBlock, GlobalVariablesBlock, ArrayBlock, QueryBlock, SimpleInputBlock, NormalVariable, ArrayVariable, QueryParam, QueryDefinition } from '../types/InputBlock'; // 新しいJSON形式の型定義

// ログ出力用のチャンネル (InputParserService と共有するか、別途作成)
interface GeneratorOutputChannel { appendLine(message: string): void; clear(): void; show?(): void; dispose?(): void; }

// OutputChannel のインスタンス化 (テスト実行時と本番で切り替え可能に)
const outputChannel: GeneratorOutputChannel = typeof vscode !== 'undefined' && vscode.window && vscode.window.createOutputChannel
    ? vscode.window.createOutputChannel("AtCoder Cpp Code Generator Debug")
    : {
        appendLine: (message: string) => console.log(`[CodeGen Debug] ${message}`),
        clear: () => {},
        show: () => {},
        dispose: () => {}
    };

//C++のコード作成
export class CppCodeGeneratorService {
    /**
     * 構造化された InputBlock データからC++の入力スニペットを生成します。
     * @param inferredBlocks 型推論後の InputBlock の配列
     * @param config VS Codeのワークスペース設定 (例: int/long long, vector/C-style array)
     * @returns 生成されたC++コードスニペット
     */
    public generateCppSnippet(inferredBlocks: InputBlock[], config: vscode.WorkspaceConfiguration): string {
        outputChannel.clear();
        outputChannel.appendLine("Starting C++ snippet generation...");
        outputChannel.appendLine("Inferred Blocks:\n" + JSON.stringify(inferredBlocks, null, 2));

        let snippet = ``;
        const includeHeaders = new Set<string>(); // ヘッダーは生成するが、最終出力には含めない（コメントで前提を示す）
        const mainFunctionBody: string[] = [];

        const integerType = config.get<string>('atcoder-utility.cpp.integerType') || 'long long';
        const arrayStyle = config.get<string>('atcoder-utility.cpp.arrayStyle') || 'vector';
        
        const declaredGlobalVars = new Set<string>(); // グローバル変数が既に宣言されたかを追跡


        inferredBlocks.forEach(block => {
            if (block.type === 'globalVariables') {
                const globalBlock = block as GlobalVariablesBlock;
                const varDeclarations: string[] = [];
                const varReads: string[] = [];
                globalBlock.variables.forEach(v => {
                    const cppType = this.mapToCppType(v.dataType, integerType);
                    varDeclarations.push(`${cppType} ${v.name};`);
                    varReads.push(`${v.name}`); 
                    declaredGlobalVars.add(v.name); 
                });
                mainFunctionBody.push(`    ${varDeclarations.join(' ')}`);
                mainFunctionBody.push(`    cin >> ${varReads.join(' >> ')};`);
                mainFunctionBody.push('');
            } else if (block.type === 'simpleInput') {
                const simpleBlock = block as SimpleInputBlock;
                simpleBlock.variables.forEach(v => {
                    if (!declaredGlobalVars.has(v.name)) { 
                        const cppType = this.mapToCppType(v.dataType, integerType);
                        mainFunctionBody.push(`    ${cppType} ${v.name};`);
                        mainFunctionBody.push(`    cin >> ${v.name};`);
                        mainFunctionBody.push('');
                        declaredGlobalVars.add(v.name);
                    }
                });
            } else if (block.type === 'arrayBlock') {
                const arrayBlock = block as ArrayBlock;
                const baseNames = arrayBlock.patternLine.variables.map(v => v.name);
                const sizeVar = arrayBlock.repeatCountVariable; 
                
                if (arrayStyle === 'vector') {
                    arrayBlock.patternLine.variables.forEach(v => {
                        const cppType = this.mapToCppType(v.dataType, integerType);
                        mainFunctionBody.push(`    vector<${cppType}> ${v.name}(${sizeVar});`);
                    });
                    
                    mainFunctionBody.push(`    for (int i = 0; i < ${sizeVar}; ++i) {`);
                    const reads: string[] = [];
                    arrayBlock.patternLine.variables.forEach(v => {
                        reads.push(`${v.name}[i]`);
                    });
                    mainFunctionBody.push(`        cin >> ${reads.join(' >> ')};`);
                    mainFunctionBody.push(`    }`);
                } else { // C-style array
                    // C-style arrays are less flexible for competitive programming dynamic sizes
                    // このコメントも削除
                    arrayBlock.patternLine.variables.forEach(v => {
                        const cppType = this.mapToCppType(v.dataType, integerType);
                        mainFunctionBody.push(`    ${cppType} ${v.name}[${sizeVar}];`); 
                        mainFunctionBody.push(`    for (int i = 0; i < ${sizeVar}; ++i) { cin >> ${v.name}[i]; }`);
                    });
                }
                mainFunctionBody.push('');
            } else if (block.type === 'queryBlock') {
                const queryBlock = block as QueryBlock;
                const countVar = queryBlock.countVariable;

                if (!declaredGlobalVars.has(countVar)) {
                    mainFunctionBody.push(`    ${this.mapToCppType('int', integerType)} ${countVar};`);
                }
                mainFunctionBody.push(`    cin >> ${countVar};`);

                const allQueryParamNames: Set<string> = new Set();
                queryBlock.queryDefinitions.forEach(queryDef => {
                    queryDef.params.forEach(p => allQueryParamNames.add(p.name));
                });

                mainFunctionBody.push(`    vector<${this.mapToCppType('int', integerType)}> query_type(${countVar});`);
                allQueryParamNames.forEach(paramName => {
                    const paramType = queryBlock.queryDefinitions.find(qd => qd.params.some(p => p.name === paramName))?.params.find(p => p.name === paramName)?.dataType || 'unknown';
                    const cppParamType = this.mapToCppType(paramType, integerType);
                    mainFunctionBody.push(`    vector<${cppParamType}> ${paramName}(${countVar});`);
                });
                mainFunctionBody.push(''); 

                mainFunctionBody.push(`    for (int i = 0; i < ${countVar}; ++i) {`);
                mainFunctionBody.push(`        cin >> query_type[i];`);
                
                queryBlock.queryDefinitions.forEach(queryDef => {
                    mainFunctionBody.push(`        if (query_type[i] == ${queryDef.typeId}) {`);
                    const reads: string[] = [];
                    queryDef.params.forEach(p => {
                        reads.push(`${p.name}[i]`);
                    });
                    if (reads.length > 0) {
                        mainFunctionBody.push(`            cin >> ${reads.join(' >> ')};`);
                    }
                    mainFunctionBody.push(`        }`);
                });
                mainFunctionBody.push(`    }`); 
                mainFunctionBody.push('');
            }
        });

        // ヘッダーと using namespace std; は最終出力に含めない
        // snippet += Array.from(includeHeaders).sort().map(h => `#include ${h}`).join('\n');
        // snippet += '\nusing namespace std;\n\n'; 
        snippet += mainFunctionBody.join('\n'); // mainFunctionBody だけを結合

        outputChannel.appendLine("C++ snippet generation completed.");
        return snippet;
    }

    /**
     * VariableInfo の dataType をC++の型にマッピングします。
     * @param dataType 抽出されたデータ型 ("int", "string", "double")
     * @param integerType 整数型設定 ("int", "long long")
     * @returns C++の型名
     */
    private mapToCppType(dataType: string, integerType: string): string {
        switch (dataType) {
            case 'int':
            case 'long long': 
                return integerType;
            case 'string':
                return 'string'; 
            case 'double':
                return 'double';
            default:
                return 'int'; 
        }
    }
}