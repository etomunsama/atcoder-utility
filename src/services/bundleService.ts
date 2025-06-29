import * as vscode from 'vscode';
import * as path from 'path';
import { exec } from 'child_process';

/**
 * C++のソースコードをバンドル（#includeを展開して1つのファイルにまとめる）するサービスです。
 * `oj-bundle` または自前の再帰的なインクルード解決エンジンを使用できます。
 */
export class BundleService {
    constructor() { }

    /**
     * 指定されたファイルパスのコードを、設定に基づいてバンドルします。
     * @param filePath バンドルするメインファイルのパス
     * @returns バンドルされたコード文字列。失敗した場合はnull。
     */
    public async bundle(filePath: string): Promise<string | null> {
        const config = vscode.workspace.getConfiguration('atcoder-utility');
        const engine = config.get<string>('bundleEngine');

        if (engine === 'oj-bundle') {
            return this.runWithOjBundleEngine(filePath);
        } else {
            return this.runWithCustomEngine(filePath);
        }
    }

    /**
     * `oj-bundle` コマンドを使用してファイルをバンドルします。
     * @param filePath 対象のファイルパス
     * @returns バンドルされたコード文字列。失敗した場合はnull。
     */
    private async runWithOjBundleEngine(filePath: string): Promise<string | null> {
        return new Promise((resolve) => {
            exec(`oj-bundle '${filePath}'`, (error, stdout, stderr) => {
                if (error) {
                    vscode.window.showErrorMessage(`oj-bundleの実行に失敗しました: ${stderr}`);
                    resolve(null);
                    return;
                }
                resolve(stdout);
            });
        });
    }

    /**
     * 自前のエンジンを使用して、再帰的に `#include "..."` を解決します。
     * @param filePath 対象のファイルパス
     * @returns バンドルされたコード文字列。失敗した場合はnull。
     */
    private async runWithCustomEngine(filePath: string): Promise<string | null> {
        try {
            // 循環参照を防ぐため、既にインクルードしたファイルの絶対パスを記録する
            const includedFiles = new Set<string>();
            return await this.resolveIncludes(filePath, includedFiles);
        } catch (error: any) {
            vscode.window.showErrorMessage(`バンドルに失敗しました: ${error.message}`);
            return null;
        }
    }

    /**
     * `#include` を再帰的に解決するヘルパー関数。
     * @param filePath 現在処理中のファイルパス
     * @param includedFiles 既に処理済みのファイルのセット（循環参照防止用）
     * @returns 解決済みのコード文字列
     */
    private async resolveIncludes(filePath: string, includedFiles: Set<string>): Promise<string> {
        const absolutePath = path.resolve(filePath);

        // 循環参照チェック
        if (includedFiles.has(absolutePath)) {
            return ''; // 既に追加済みの場合は空文字列を返し、無限ループを防ぐ
        }
        includedFiles.add(absolutePath);

        const fileContent = (await vscode.workspace.fs.readFile(vscode.Uri.file(absolutePath))).toString();
        const lines = fileContent.split('\n');
        const outputLines: string[] = [];

        const includeRegex = /^#include\s*"(.*)"/;

        for (const line of lines) {
            const match = line.match(includeRegex);
            if (match) {
                // #include "..." が見つかった場合、そのファイルを再帰的に解決
                const includeFileName = match[1];
                const includeFilePath = path.resolve(path.dirname(filePath), includeFileName);
                const includedContent = await this.resolveIncludes(includeFilePath, includedFiles);
                outputLines.push(includedContent);
            } else if (!line.trim().startsWith('#pragma once')) {
                // #pragma once はバンドル後は不要なので無視し、それ以外の行を追加
                outputLines.push(line);
            }
        }

        return outputLines.join('\n');
    }
}
