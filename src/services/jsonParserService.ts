import * as vscode from 'vscode'; // VS Code API (設定取得用)
import { InputBlock, GlobalVariablesBlock, ArrayBlock, QueryBlock, SimpleInputBlock, NormalVariable, ArrayVariable, QueryParam, QueryDefinition } from '../types/InputBlock'; // 新しいJSON形式の型定義

// ログ出力用のチャンネル (InputParserService と共有するか、別途作成)
interface GeneratorOutputChannel { appendLine(message: string): void; clear(): void; show?(): void; dispose?(): void; }

// OutputChannel のインスタンス化 (テスト実行時と本番で切り替え可能に)
const outputChannel: GeneratorOutputChannel = typeof vscode !== 'undefined' && vscode.window && vscode.window.createOutputChannel
    ? vscode.window.createOutputChannel("AtCoder Code Generator Debug") // チャンネル名を変更
    : {
        appendLine: (message: string) => console.log(`[CodeGen Debug] ${message}`),
        clear: () => {},
        show: () => {},
        dispose: () => {}
    };

export class CodeGeneratorService {
    public generateSnippet(inferredBlocks: InputBlock[], config: vscode.WorkspaceConfiguration, languageId: string): string {
        switch (languageId) {
            case 'cpp':
                return this.generateCppSnippet(inferredBlocks, config);
            case 'python':
                return this.generatePythonSnippet(inferredBlocks, config);
            case 'java':
                return this.generateJavaSnippet(inferredBlocks, config);
            case 'rust':
                return this.generateRustSnippet(inferredBlocks, config);
            case 'c':
                return this.generateCSnippet(inferredBlocks, config);
            case 'csharp':
                return this.generateCSharpSnippet(inferredBlocks, config);
            case 'ruby':
                return this.generateRubySnippet(inferredBlocks, config);
            case 'go':
                return this.generateGoSnippet(inferredBlocks, config);
            default:
                vscode.window.showErrorMessage(`Unsupported language for snippet generation: ${languageId}`);
                return '';
        }
    }

    private generatePythonSnippet(inferredBlocks: InputBlock[], config: vscode.WorkspaceConfiguration): string {
        const mainFunctionBody: string[] = [];

        inferredBlocks.forEach(block => {
            if (block.type === 'globalVariables') {
                const globalBlock = block as GlobalVariablesBlock;
                const varNames = globalBlock.variables.map(v => v.name).join(', ');
                mainFunctionBody.push(`${varNames} = map(int, input().split())`);
            } else if (block.type === 'simpleInput') {
                const simpleBlock = block as SimpleInputBlock;
                simpleBlock.variables.forEach(v => {
                    mainFunctionBody.push(`${v.name} = int(input())`);
                });
            } else if (block.type === 'arrayBlock') {
                const arrayBlock = block as ArrayBlock;
                const firstVarName = arrayBlock.patternLine.variables[0]?.name;
                if (firstVarName) {
                    mainFunctionBody.push(`${firstVarName} = list(map(int, input().split()))`);
                }
            }
            // TODO: queryBlock の Python スニペット生成ロジックを追加
        });

        return mainFunctionBody.join('\n');
    }

    private generateJavaSnippet(inferredBlocks: InputBlock[], config: vscode.WorkspaceConfiguration): string {
        const mainFunctionBody: string[] = [];
        mainFunctionBody.push("import java.util.Scanner;");
        mainFunctionBody.push("import java.util.ArrayList;");
        mainFunctionBody.push("import java.util.List;");
        mainFunctionBody.push("");
        mainFunctionBody.push("public class Main {");
        mainFunctionBody.push("    public static void main(String[] args) {");
        mainFunctionBody.push("        Scanner sc = new Scanner(System.in);");
        mainFunctionBody.push("");

        const declaredGlobalVars = new Set<string>();
        const declaredArrayVars = new Set<string>();

        inferredBlocks.forEach(block => {
            if (block.type === 'globalVariables') {
                const globalBlock = block as GlobalVariablesBlock;
                const varDeclarations: string[] = [];
                const varReads: string[] = [];
                globalBlock.variables.forEach(v => {
                    if (declaredGlobalVars.has(v.name)) return;
                    const javaType = this.mapToJavaType(v.dataType);
                    varDeclarations.push(`${javaType} ${v.name};`);
                    varReads.push(`${v.name} = sc.next${this.capitalize(javaType)}();`);
                    declaredGlobalVars.add(v.name);
                });
                if (varDeclarations.length > 0) {
                    mainFunctionBody.push(`        ${varDeclarations.join(' ')}`);
                    mainFunctionBody.push(`        ${varReads.join('\n        ')}`);
                    mainFunctionBody.push('');
                }
            } else if (block.type === 'simpleInput') {
                const simpleBlock = block as SimpleInputBlock;
                simpleBlock.variables.forEach(v => {
                    if (!declaredGlobalVars.has(v.name)) {
                        const javaType = this.mapToJavaType(v.dataType);
                        mainFunctionBody.push(`        ${javaType} ${v.name} = sc.next${this.capitalize(javaType)}();`);
                        mainFunctionBody.push('');
                        declaredGlobalVars.add(v.name);
                    }
                });
            } else if (block.type === 'arrayBlock') {
                const arrayBlock = block as ArrayBlock;
                const firstVarName = arrayBlock.patternLine.variables[0]?.name;

                if (!firstVarName || declaredArrayVars.has(firstVarName)) {
                    outputChannel.appendLine(`  Skipping duplicate array block for ${firstVarName || 'unknown'}`);
                    return;
                }
                
                const sizeVar = arrayBlock.repeatCountVariable; 
                
                arrayBlock.patternLine.variables.forEach(v => {
                    const javaType = this.mapToJavaType(v.dataType);
                    mainFunctionBody.push(`        List<${this.boxPrimitiveType(javaType)}> ${v.name} = new ArrayList<>();`);
                    declaredArrayVars.add(v.name);
                });
                
                mainFunctionBody.push(`        for (int i = 0; i < ${sizeVar}; ++i) {`);
                arrayBlock.patternLine.variables.forEach(v => {
                    const javaType = this.mapToJavaType(v.dataType);
                    mainFunctionBody.push(`            ${v.name}.add(sc.next${this.capitalize(javaType)}());`);
                });
                mainFunctionBody.push(`        }`);
                mainFunctionBody.push('');
            }
            // TODO: queryBlock の Java スニペット生成ロジックを追加
        });

        mainFunctionBody.push("        sc.close();");
        mainFunctionBody.push("    }");
        mainFunctionBody.push("}");

        return mainFunctionBody.join('\n');
    }

    private generateRustSnippet(inferredBlocks: InputBlock[], config: vscode.WorkspaceConfiguration): string {
        const mainFunctionBody: string[] = [];
        mainFunctionBody.push("use std::io::{self, BufRead};");
        mainFunctionBody.push("");
        mainFunctionBody.push("fn main() {");
        mainFunctionBody.push("    let stdin = io::stdin();");
        mainFunctionBody.push("    let mut lines = stdin.lock().lines();");
        mainFunctionBody.push("");

        const declaredGlobalVars = new Set<string>();
        const declaredArrayVars = new Set<string>();

        inferredBlocks.forEach(block => {
            if (block.type === 'globalVariables') {
                const globalBlock = block as GlobalVariablesBlock;
                const varReads: string[] = [];
                globalBlock.variables.forEach(v => {
                    if (declaredGlobalVars.has(v.name)) return;
                    const rustType = this.mapToRustType(v.dataType);
                    varReads.push(`let ${v.name}: ${rustType} = lines.next().unwrap().unwrap().parse().unwrap();`);
                    declaredGlobalVars.add(v.name);
                });
                if (varReads.length > 0) {
                    mainFunctionBody.push(`    ${varReads.join('\n    ')}`);
                    mainFunctionBody.push('');
                }
            } else if (block.type === 'simpleInput') {
                const simpleBlock = block as SimpleInputBlock;
                simpleBlock.variables.forEach(v => {
                    if (!declaredGlobalVars.has(v.name)) {
                        const rustType = this.mapToRustType(v.dataType);
                        mainFunctionBody.push(`    let ${v.name}: ${rustType} = lines.next().unwrap().unwrap().parse().unwrap();`);
                        mainFunctionBody.push('');
                        declaredGlobalVars.add(v.name);
                    }
                });
            } else if (block.type === 'arrayBlock') {
                const arrayBlock = block as ArrayBlock;
                const firstVarName = arrayBlock.patternLine.variables[0]?.name;

                if (!firstVarName || declaredArrayVars.has(firstVarName)) {
                    outputChannel.appendLine(`  Skipping duplicate array block for ${firstVarName || 'unknown'}`);
                    return;
                }
                
                const sizeVar = arrayBlock.repeatCountVariable; 
                
                arrayBlock.patternLine.variables.forEach(v => {
                    const rustType = this.mapToRustType(v.dataType);
                    mainFunctionBody.push(`    let mut ${v.name}: Vec<${rustType}> = Vec::new();`);
                    declaredArrayVars.add(v.name);
                });
                
                mainFunctionBody.push(`    for _i in 0..${sizeVar} {`);
                arrayBlock.patternLine.variables.forEach(v => {
                    mainFunctionBody.push(`        ${v.name}.push(lines.next().unwrap().unwrap().parse().unwrap());`);
                });
                mainFunctionBody.push(`    }`);
                mainFunctionBody.push('');
            }
            // TODO: queryBlock の Rust スニペット生成ロジックを追加
        });

        mainFunctionBody.push("}");

        return mainFunctionBody.join('\n');
    }

    private generateCSnippet(inferredBlocks: InputBlock[], config: vscode.WorkspaceConfiguration): string {
        const mainFunctionBody: string[] = [];
        mainFunctionBody.push("#include <stdio.h>");
        mainFunctionBody.push("");
        mainFunctionBody.push("int main() {");

        const declaredGlobalVars = new Set<string>();
        const declaredArrayVars = new Set<string>();

        inferredBlocks.forEach(block => {
            if (block.type === 'globalVariables') {
                const globalBlock = block as GlobalVariablesBlock;
                const varDeclarations: string[] = [];
                const varReads: string[] = [];
                globalBlock.variables.forEach(v => {
                    if (declaredGlobalVars.has(v.name)) return;
                    const cType = this.mapToCType(v.dataType);
                    varDeclarations.push(`${cType} ${v.name};`);
                    varReads.push(`&${v.name}`);
                    declaredGlobalVars.add(v.name);
                });
                if (varDeclarations.length > 0) {
                    mainFunctionBody.push(`    ${varDeclarations.join(' ')}`);
                    mainFunctionBody.push(`    scanf("${globalBlock.variables.map(v => this.getScanfFormatSpecifier(v.dataType)).join(' ')}", ${varReads.join(', ')});`);
                    mainFunctionBody.push('');
                }
            } else if (block.type === 'simpleInput') {
                const simpleBlock = block as SimpleInputBlock;
                simpleBlock.variables.forEach(v => {
                    if (!declaredGlobalVars.has(v.name)) {
                        const cType = this.mapToCType(v.dataType);
                        mainFunctionBody.push(`    ${cType} ${v.name};`);
                        mainFunctionBody.push(`    scanf("${this.getScanfFormatSpecifier(v.dataType)}", &${v.name});`);
                        mainFunctionBody.push('');
                        declaredGlobalVars.add(v.name);
                    }
                });
            } else if (block.type === 'arrayBlock') {
                const arrayBlock = block as ArrayBlock;
                const firstVarName = arrayBlock.patternLine.variables[0]?.name;

                if (!firstVarName || declaredArrayVars.has(firstVarName)) {
                    outputChannel.appendLine(`  Skipping duplicate array block for ${firstVarName || 'unknown'}`);
                    return;
                }
                
                const sizeVar = arrayBlock.repeatCountVariable; 
                
                arrayBlock.patternLine.variables.forEach(v => {
                    const cType = this.mapToCType(v.dataType);
                    mainFunctionBody.push(`    ${cType} ${v.name}[${sizeVar}];`);
                    declaredArrayVars.add(v.name);
                });
                
                mainFunctionBody.push(`    for (int i = 0; i < ${sizeVar}; ++i) {`);
                const reads: string[] = [];
                arrayBlock.patternLine.variables.forEach(v => {
                    reads.push(`&${v.name}[i]`);
                });
                mainFunctionBody.push(`        scanf("${arrayBlock.patternLine.variables.map(v => this.getScanfFormatSpecifier(v.dataType)).join(' ')}", ${reads.join(', ')});`);
                mainFunctionBody.push(`    }`);
                mainFunctionBody.push('');
            }
            // TODO: queryBlock の C スニペット生成ロジックを追加
        });

        mainFunctionBody.push("    return 0;");
        mainFunctionBody.push("}");

        return mainFunctionBody.join('\n');
    }

    private generateCSharpSnippet(inferredBlocks: InputBlock[], config: vscode.WorkspaceConfiguration): string {
        const mainFunctionBody: string[] = [];
        mainFunctionBody.push("using System;");
        mainFunctionBody.push("using System.Linq;");
        mainFunctionBody.push("");
        mainFunctionBody.push("public class Program {");
        mainFunctionBody.push("    public static void Main(string[] args) {");

        const declaredGlobalVars = new Set<string>();
        const declaredArrayVars = new Set<string>();

        inferredBlocks.forEach(block => {
            if (block.type === 'globalVariables') {
                const globalBlock = block as GlobalVariablesBlock;
                const varDeclarations: string[] = [];
                const varReads: string[] = [];
                globalBlock.variables.forEach(v => {
                    if (declaredGlobalVars.has(v.name)) return;
                    const csharpType = this.mapToCSharpType(v.dataType);
                    varDeclarations.push(`${csharpType} ${v.name};`);
                    varReads.push(`${v.name} = ${this.getCSharpReadMethod(v.dataType)};`);
                    declaredGlobalVars.add(v.name);
                });
                if (varDeclarations.length > 0) {
                    mainFunctionBody.push(`        ${varDeclarations.join(' ')}`);
                    mainFunctionBody.push(`        ${varReads.join('\n        ')}`);
                    mainFunctionBody.push('');
                }
            } else if (block.type === 'simpleInput') {
                const simpleBlock = block as SimpleInputBlock;
                simpleBlock.variables.forEach(v => {
                    if (!declaredGlobalVars.has(v.name)) {
                        const csharpType = this.mapToCSharpType(v.dataType);
                        mainFunctionBody.push(`        ${csharpType} ${v.name} = ${this.getCSharpReadMethod(v.dataType)};`);
                        mainFunctionBody.push('');
                        declaredGlobalVars.add(v.name);
                    }
                });
            } else if (block.type === 'arrayBlock') {
                const arrayBlock = block as ArrayBlock;
                const firstVarName = arrayBlock.patternLine.variables[0]?.name;

                if (!firstVarName || declaredArrayVars.has(firstVarName)) {
                    outputChannel.appendLine(`  Skipping duplicate array block for ${firstVarName || 'unknown'}`);
                    return;
                }
                
                const sizeVar = arrayBlock.repeatCountVariable; 
                
                arrayBlock.patternLine.variables.forEach(v => {
                    const csharpType = this.mapToCSharpType(v.dataType);
                    mainFunctionBody.push(`        ${csharpType}[] ${v.name} = new ${csharpType}[${sizeVar}];`);
                    declaredArrayVars.add(v.name);
                });
                
                mainFunctionBody.push(`        for (int i = 0; i < ${sizeVar}; ++i) {`);
                const reads: string[] = [];
                arrayBlock.patternLine.variables.forEach(v => {
                    reads.push(`${v.name}[i]`);
                });
                mainFunctionBody.push(`            ${reads.join(' = ')} = ${this.getCSharpReadMethod(arrayBlock.patternLine.variables[0].dataType)};`);
                mainFunctionBody.push(`        }`);
                mainFunctionBody.push('');
            }
            // TODO: queryBlock の C# スニペット生成ロジックを追加
        });

        mainFunctionBody.push("    }");
        mainFunctionBody.push("}");

        return mainFunctionBody.join('\n');
    }

    private generateRubySnippet(inferredBlocks: InputBlock[], config: vscode.WorkspaceConfiguration): string {
        const mainFunctionBody: string[] = [];

        inferredBlocks.forEach(block => {
            if (block.type === 'globalVariables') {
                const globalBlock = block as GlobalVariablesBlock;
                const varNames = globalBlock.variables.map(v => v.name).join(', ');
                mainFunctionBody.push(`${varNames} = gets.split.map(&:to_i)`);
            } else if (block.type === 'simpleInput') {
                const simpleBlock = block as SimpleInputBlock;
                simpleBlock.variables.forEach(v => {
                    mainFunctionBody.push(`${v.name} = gets.to_i`);
                });
            } else if (block.type === 'arrayBlock') {
                const arrayBlock = block as ArrayBlock;
                const firstVarName = arrayBlock.patternLine.variables[0]?.name;
                if (firstVarName) {
                    mainFunctionBody.push(`${firstVarName} = gets.split.map(&:to_i)`);
                }
            }
            // TODO: queryBlock の Ruby スニペット生成ロジックを追加
        });

        return mainFunctionBody.join('\n');
    }

    private generateGoSnippet(inferredBlocks: InputBlock[], config: vscode.WorkspaceConfiguration): string {
        const mainFunctionBody: string[] = [];
        mainFunctionBody.push("package main");
        mainFunctionBody.push("");
        mainFunctionBody.push("import (");
        mainFunctionBody.push("    \"fmt\"");
        mainFunctionBody.push(")");
        mainFunctionBody.push("");
        mainFunctionBody.push("func main() {");

        const declaredGlobalVars = new Set<string>();
        const declaredArrayVars = new Set<string>();

        inferredBlocks.forEach(block => {
            if (block.type === 'globalVariables') {
                const globalBlock = block as GlobalVariablesBlock;
                const varDeclarations: string[] = [];
                const varReads: string[] = [];
                globalBlock.variables.forEach(v => {
                    if (declaredGlobalVars.has(v.name)) return;
                    const goType = this.mapToGoType(v.dataType);
                    varDeclarations.push(`var ${v.name} ${goType}`);
                    varReads.push(`&${v.name}`);
                    declaredGlobalVars.add(v.name);
                });
                if (varDeclarations.length > 0) {
                    mainFunctionBody.push(`    ${varDeclarations.join('\n    ')}`);
                    mainFunctionBody.push(`    fmt.Scan(${varReads.join(', ')})`);
                    mainFunctionBody.push('');
                }
            } else if (block.type === 'simpleInput') {
                const simpleBlock = block as SimpleInputBlock;
                simpleBlock.variables.forEach(v => {
                    if (!declaredGlobalVars.has(v.name)) {
                        const goType = this.mapToGoType(v.dataType);
                        mainFunctionBody.push(`    var ${v.name} ${goType}`);
                        mainFunctionBody.push(`    fmt.Scan(&${v.name})`);
                        mainFunctionBody.push('');
                        declaredGlobalVars.add(v.name);
                    }
                });
            } else if (block.type === 'arrayBlock') {
                const arrayBlock = block as ArrayBlock;
                const firstVarName = arrayBlock.patternLine.variables[0]?.name;

                if (!firstVarName || declaredArrayVars.has(firstVarName)) {
                    outputChannel.appendLine(`  Skipping duplicate array block for ${firstVarName || 'unknown'}`);
                    return;
                }
                
                const sizeVar = arrayBlock.repeatCountVariable; 
                
                arrayBlock.patternLine.variables.forEach(v => {
                    const goType = this.mapToGoType(v.dataType);
                    mainFunctionBody.push(`    ${v.name} := make([]${goType}, ${sizeVar})`);
                    declaredArrayVars.add(v.name);
                });
                
                mainFunctionBody.push(`    for i := 0; i < ${sizeVar}; i++ {`);
                const reads: string[] = [];
                arrayBlock.patternLine.variables.forEach(v => {
                    reads.push(`&${v.name}[i]`);
                });
                mainFunctionBody.push(`        fmt.Scan(${reads.join(', ')})`);
                mainFunctionBody.push(`    }`);
                mainFunctionBody.push('');
            }
            // TODO: queryBlock の Go スニペット生成ロジックを追加
        });

        mainFunctionBody.push("}");

        return mainFunctionBody.join('\n');
    }

    private generateCppSnippet(inferredBlocks: InputBlock[], config: vscode.WorkspaceConfiguration): string {
        outputChannel.clear();
        outputChannel.appendLine("Starting C++ snippet generation...");
        outputChannel.appendLine("Inferred Blocks:\n" + JSON.stringify(inferredBlocks, null, 2));

        let snippet = ``;
        const mainFunctionBody: string[] = [];

        const integerType = config.get<string>('snippet.integerType') || 'long long';
        const arrayStyle = config.get<string>('snippet.arrayStyle') || 'vector';
        
        const declaredGlobalVars = new Set<string>(); 
        const declaredArrayVars = new Set<string>(); 

        inferredBlocks.forEach(block => {
            if (block.type === 'globalVariables') {
                const globalBlock = block as GlobalVariablesBlock;
                const varDeclarations: string[] = [];
                const varReads: string[] = [];
                globalBlock.variables.forEach(v => {
                    if (declaredGlobalVars.has(v.name)) return;

                    const cppType = this.mapToCppType(v.dataType, integerType);
                    varDeclarations.push(`${cppType} ${v.name};`);
                    varReads.push(`${v.name}`); 
                    declaredGlobalVars.add(v.name); 
                });
                if (varDeclarations.length > 0) {
                    mainFunctionBody.push(`    ${varDeclarations.join(' ')}`);
                    mainFunctionBody.push(`    cin >> ${varReads.join(' >> ')};`);
                    mainFunctionBody.push('');
                }
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
                const firstVarName = arrayBlock.patternLine.variables[0]?.name;

                if (!firstVarName || declaredArrayVars.has(firstVarName)) {
                    outputChannel.appendLine(`  Skipping duplicate array block for ${firstVarName || 'unknown'}`);
                    return;
                }
                
                const sizeVar = arrayBlock.repeatCountVariable; 
                
                if (arrayStyle === 'vector') {
                    arrayBlock.patternLine.variables.forEach(v => {
                        const cppType = this.mapToCppType(v.dataType, integerType);
                        mainFunctionBody.push(`    vector<${cppType}> ${v.name}(${sizeVar});`);
                        declaredArrayVars.add(v.name); 
                    });
                    
                    mainFunctionBody.push(`    for (int i = 0; i < ${sizeVar}; ++i) {`);
                    const reads: string[] = [];
                    arrayBlock.patternLine.variables.forEach(v => {
                        reads.push(`${v.name}[i]`);
                    });
                    mainFunctionBody.push(`        cin >> ${reads.join(' >> ')};`);
                    mainFunctionBody.push(`    }`);
                } else { 
                    arrayBlock.patternLine.variables.forEach(v => {
                        const cppType = this.mapToCppType(v.dataType, integerType);
                        mainFunctionBody.push(`    ${cppType} ${v.name}[${sizeVar}];`); 
                        mainFunctionBody.push(`    for (int i = 0; i < ${sizeVar}; ++i) { cin >> ${v.name}[i]; }`);
                        declaredArrayVars.add(v.name); 
                    });
                }
                mainFunctionBody.push('');
            } else if (block.type === 'queryBlock') {
                const queryBlock = block as QueryBlock;
                const countVar = queryBlock.countVariable;

                if (!declaredGlobalVars.has(countVar)) {
                    mainFunctionBody.push(`    ${this.mapToCppType('int', integerType)} ${countVar};`);
                    mainFunctionBody.push(`    cin >> ${countVar};`);
                    declaredGlobalVars.add(countVar); 
                }

                const allQueryParamNames: Set<string> = new Set();
                queryBlock.queryDefinitions.forEach(queryDef => {
                    queryDef.params.forEach(p => allQueryParamNames.add(p.name));
                });

                mainFunctionBody.push(`    vector<${this.mapToCppType('int', integerType)}> query_type(${countVar});`);
                allQueryParamNames.forEach(paramName => {
                    if (declaredArrayVars.has(paramName)) return;

                    const paramType = queryBlock.queryDefinitions.find(qd => qd.params.some(p => p.name === paramName))?.params.find(p => p.name === paramName)?.dataType || 'unknown';
                    const cppParamType = this.mapToCppType(paramType, integerType);
                    mainFunctionBody.push(`    vector<${cppParamType}> ${paramName}(${countVar});`);
                    declaredArrayVars.add(paramName); 
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

        snippet += mainFunctionBody.join('\n'); 

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
                return integerType; 
        }
    }

    private mapToJavaType(dataType: string): string {
        switch (dataType) {
            case 'int': return 'int';
            case 'long long': return 'long';
            case 'string': return 'String';
            case 'double': return 'double';
            default: return 'String'; // デフォルトはString
        }
    }

    private capitalize(s: string): string {
        return s.charAt(0).toUpperCase() + s.slice(1);
    }

    private boxPrimitiveType(s: string): string {
        switch (s) {
            case 'int': return 'Integer';
            case 'long': return 'Long';
            case 'double': return 'Double';
            default: return s;
        }
    }

    private mapToRustType(dataType: string): string {
        switch (dataType) {
            case 'int': return 'i64'; // Rustではi32, i64など
            case 'long long': return 'i64';
            case 'string': return 'String';
            case 'double': return 'f64';
            default: return 'String';
        }
    }

    private mapToCType(dataType: string): string {
        switch (dataType) {
            case 'int': return 'int';
            case 'long long': return 'long long';
            case 'string': return 'char*'; // Cでは文字列はchar配列またはポインタ
            case 'double': return 'double';
            default: return 'int';
        }
    }

    private getScanfFormatSpecifier(dataType: string): string {
        switch (dataType) {
            case 'int': return '%d';
            case 'long long': return '%lld';
            case 'string': return '%s';
            case 'double': return '%lf';
            default: return '%s';
        }
    }

    private mapToCSharpType(dataType: string): string {
        switch (dataType) {
            case 'int': return 'int';
            case 'long long': return 'long';
            case 'string': return 'string';
            case 'double': return 'double';
            default: return 'string';
        }
    }

    private getCSharpReadMethod(dataType: string): string {
        switch (dataType) {
            case 'int': return 'int.Parse(Console.ReadLine())';
            case 'long long': return 'long.Parse(Console.ReadLine())';
            case 'string': return 'Console.ReadLine()';
            case 'double': return 'double.Parse(Console.ReadLine())';
            default: return 'Console.ReadLine()';
        }
    }

    private mapToGoType(dataType: string): string {
        switch (dataType) {
            case 'int': return 'int';
            case 'long long': return 'int64';
            case 'string': return 'string';
            case 'double': return 'float64';
            default: return 'string';
        }
    }
}