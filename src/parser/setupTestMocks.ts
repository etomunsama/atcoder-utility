// src/parser/setupTestMocks.ts

// このファイルは、testParser.ts が require される前に実行される

// @ts-ignore // dummyOutputChannel は testParser.ts にあるので、ここでは any で定義
declare const dummyOutputChannel: any; 

// Node.jsのモジュール解決のメカニズムを直接フック
const originalModuleLoad = require('module')._load;

// @ts-ignore
require('module')._load = function (request: string, parent: NodeModule, isMain: boolean) {
    if (request === 'vscode') {
        const mockVscode: any = { 
            env: {
                clipboard: {
                    writeText: async (text: string) => {
                        const clipboardy = await import('clipboardy');
                        // @ts-ignore
                        await clipboardy.write(text); 
                        console.log(`[Mock VSCode Clipboard] Copied text to clipboard (via clipboardy): ${text.substring(0, 50)}...`);
                    },
                    readText: async () => {
                        const clipboardy = await import('clipboardy');
                        // @ts-ignore
                        const text = await clipboardy.read();
                        console.log("[Mock VSCode Clipboard] Read text from clipboard (via clipboardy).");
                        return text;
                    }
                }
            },
            window: {
                createOutputChannel: (name: string) => {
                    console.log(`[Mock VSCode] createOutputChannel called for: ${name}`);
                    // dummyOutputChannel が未定義の場合に備えてフォールバック
                    if (typeof dummyOutputChannel !== 'undefined') {
                        return dummyOutputChannel;
                    } else {
                        return { appendLine: (msg: string) => console.log(`[Parser Test - No Dummy] ${msg}`), clear: () => {} };
                    }
                },
                showInformationMessage: (message: string, ...items: string[]) => {
                    console.log(`[Mock VSCode] Info: ${message}`);
                    return Promise.resolve(undefined);
                },
                showErrorMessage: (message: string, ...items: string[]) => {
                    console.log(`[Mock VSCode] Error: ${message}`);
                    return Promise.resolve(undefined);
                }
            },
            workspace: {
                getConfiguration: (section?: string) => {
                    // mockConfig は testParser.ts にある
                    // @ts-ignore
                    if (typeof mockConfig !== 'undefined') {
                        // @ts-ignore
                        return mockConfig;
                    } else {
                        return { get: () => undefined }; // ダミー
                    }
                },
            }
        };
        return mockVscode; 
    }
    return originalModuleLoad(request, parent, isMain);
};