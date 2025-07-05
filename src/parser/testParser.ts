import { CppCodeGeneratorService } from '../services/jsonParserService'; 

// ★★★ ここはそのまま。ただし、vscode モックはsetupTestMocks.tsで提供されることを想定 ★★★
// dummyOutputChannel は、inputParserService より前に定義する必要がある
const dummyOutputChannel = {
    appendLine: (message: string) => console.log(`[Parser Test] ${message}`),
    clear: () => console.log("[Parser Test] Output cleared."),
    show: () => {},
    dispose: () => {}
};

// config オブジェクトは getConfiguration が返すダミーとして使用される
// @ts-ignore // vscode の型解決を無視
const mockConfig = { 
    get<T>(key: string): T | undefined {
        if (key === 'atcoder-utility.cpp.integerType') return 'long long' as T;
        if (key === 'atcoder-utility.cpp.arrayStyle') return 'vector' as T;
        return undefined;
    }
}; 


import { InputParserService } from '../services/inputParserService'; 
import * as cheerio from 'cheerio'; 
import { InputBlock } from '../types/InputBlock'; 
import { VariableInfo } from '../types/index'; 


// InputParserService のインスタンスを作成
const inputParserService = new InputParserService(dummyOutputChannel);
// CppCodeGeneratorService のインスタンスを作成
const cppCodeGeneratorService = new CppCodeGeneratorService(); 



const testCases = [
    { 
      name: "Test Case 1 (N)", 
      inputHtml: `<div class="io-style"><div class="part"><section><h3>入力</h3><p>入力は以下の形式で標準入力から与えられる。</p><pre><var>N</var></pre></section></div></div>`,
      sampleInput: `10`
    },
    { 
      name: "Test Case 2 (N M)", 
      inputHtml: `<div class="io-style"><div class="part"><section><h3>入力</h3><p>入力は以下の形式で標準入力から与えられる。</p><pre><var>N</var> <var>M</var></pre></section></div></div>`,
      sampleInput: `10 20`
    },
    { 
      name: "Test Case 3 (N\\nS)", 
      inputHtml: `<div class="io-style"><div class="part"><section><h3>入力</h3><p>入力は以下の形式で標準入力から与えられる。</p><pre><var>N</var>\n<var>S</var></pre></section></div></div>`,
      sampleInput: `5\nabcde`
    },
    { 
      name: "Test Case 4 (N\\nP_1...P_N)", 
      inputHtml: `<div class="io-style"><div class="part"><section><h3>入力</h3><p>入力は以下の形式で標準入力から与えられる。</p><pre><var>N</var>\n<var>P_1</var> <var>P_2</var> <var>\\ldots</var> <var>P_N</var></pre></section></div></div>`,
      sampleInput: `3\n10 20 30`
    },
    { 
      name: "Test Case 5 (N M\\nA_1 B_1 ...)", // 複数行リストの例
      inputHtml: `<div class="io-style"><div class="part"><section><h3>入力</h3><p>入力は以下の形式で標準入力から与えられる。</p><pre><var>N</var> <var>M</var>\n<var>A_1</var> <var>B_1</var>\n<var>A_2</var> <var>B_2</var>\n<var>\\vdots</var>\n<var>A_M</var> <var>B_M</var></pre></section></div></div>`,
      sampleInput: `3 2\n1 2\n3 4` // N=3, M=2 の場合を想定
    },
    { 
      name: "Test Case 6 (Query 1 p, 2 p s)", // クエリ問題の例
      inputHtml: `<div class="io-style"><div class="part"><section><h3>入力</h3><p>入力は以下の形式で標準入力から与えられる。</p><pre><var>N</var> <var>Q</var>\n<var>\\mathrm{query}_1</var>\n<var>\\vdots</var>\n<var>\\mathrm{query}_Q</var></pre><p>ここで <var>\\mathrm{query}_i</var> は <var>i</var> 番目のクエリを表し、以下のいずれかの形式で与えられる。</p><pre>1 p</pre><pre>2 p s</pre><pre>3 p</pre></section></div></div>`,
      sampleInput: `5 3\n1 10\n2 20 abc\n3 40` // N=5, Q=3 の場合を想定
    },
];

testCases.forEach(async testCase => { 
    console.log(`\n--- Running ${testCase.name} ---`);
    //console.log("Input HTML:", testCase.inputHtml.substring(0, 100) + "...");

    try {
        const parseResult = inputParserService.parseInputFormat(testCase.inputHtml);
        const extractedInputBlocks = parseResult.inputBlocks; 
        const globalVars = parseResult.globalVars;       
        const queryDefinitions = parseResult.queryDefinitions; 

        //console.log("Extracted InputBlocks (raw):\n", JSON.stringify(extractedInputBlocks, null, 2)); 
        //console.log("Extracted Global Vars (raw):", globalVars);
        //console.log("Extracted Query Definitions (raw):", queryDefinitions);

        const finalInferredBlocks = inputParserService.inferDataTypes(
            extractedInputBlocks,
            testCase.sampleInput,
            globalVars,
            queryDefinitions
        );
        //console.log("Final Inferred Blocks (with types):\n", JSON.stringify(finalInferredBlocks, null, 2));

        // config オブジェクトはダミーを作成 (mockConfig をそのまま使用)
        // ここでの型は vscode.WorkspaceConfiguration ですが、モックなので問題なし
        
        const cppSnippet = cppCodeGeneratorService.generateCppSnippet(finalInferredBlocks, mockConfig as any); // ここで any にキャスト
        
        // ★★★ クリップボードにコピーする処理をデバッグログに戻す ★★★
        console.log("\n--- Generated C++ Snippet ---");
        console.log(cppSnippet); // デバッグログに出力
        console.log("-----------------------------\n");

    } catch (e: any) {
        console.error(`Error processing ${testCase.name}:`, e.message);
        if (e.stack) {
            console.error(e.stack);
        }
    } finally {
        console.log(`--- Finished ${testCase.name} ---\n`);
    }
});