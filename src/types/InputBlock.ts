// src/types/InputBlock.ts

// 変数の共通インターフェース
export interface VariableDefinition {
    name: string;
    dataType: string; // "unknown", "int", "long long", "double", "string", etc.
    comment?: string; // オプション: 説明文
}

// 単一変数またはグローバル変数の定義
export interface NormalVariable extends VariableDefinition {
    lineIndex?: number; // その変数が定義されている行のインデックス (解析中のデバッグ用)
    isInline?: boolean; // 同じ行に複数の変数がスペース区切りで並んでいるか (N M Q など)
}

// 配列要素の定義
export interface ArrayVariable extends VariableDefinition {
    dimensions: number[]; // 例: [1]で1次元配列, [N, M]のようなサイズ変数の配列は2次元を示すことも
    sizeVariables: string[]; // この配列のサイズを指定する変数名 (例: ["N"] または ["M"])
    isMultiColumn?: boolean; // 同じ行に複数の配列要素があるか (A_i B_i の B など)
    indexStart?: number; // 添字が1から始まるか (A_1なら1)
}

// クエリパラメータの定義
export interface QueryParam extends VariableDefinition {
    // 追加のプロパティがあればここに追加
}

// クエリ定義
export interface QueryDefinition {
    typeId: number; // クエリタイプID (例: 1, 2, 3)
    params: QueryParam[]; // このクエリタイプが持つパラメータのリスト
    exampleLine?: string; // オプション: 実際の書式例 (例: "1 p")
}

// 各入力ブロックの共通インターフェース
export interface InputBlock {
    type: 'globalVariables' | 'arrayBlock' | 'queryBlock' | 'simpleInput' | 'testCaseBlock'; // ブロックの種類
    rawLine?: string; // このブロックが始まる元の生の行 (デバッグ用)
}

// グローバル変数ブロック
export interface GlobalVariablesBlock extends InputBlock {
    type: 'globalVariables';
    variables: NormalVariable[];
    endDelimiter?: string; // ブロックの終わりが改行かEOFかなど
}

// 配列ブロック
export interface ArrayBlock extends InputBlock {
    type: 'arrayBlock';
    patternLine: { // このブロックが示す一行のパターン (例: A_1 B_1)
        variables: ArrayVariable[];
        delimiterBetweenVars?: string; // 変数間の区切り (SPACE or TAB)
        delimiterAfterLine?: string; // 行の終わり (改行)
    };
    repeatCountVariable: string; // このブロックが何回繰り返されるかを示す変数名
    repeatDelimiter: string; // 繰り返しを示す記号 (\\vdots or \\ldots)
    startLineText?: string; // オプション: 最初のパターン行のオリジナルテキスト
    endLineText?: string; // オプション: 最後のパターン行のオリジナルテキスト
    minRepeatCount?: number; // オプション: \vdots の前に明示的に書かれている行の数
}

// クエリブロック
export interface QueryBlock extends InputBlock {
    type: 'queryBlock';
    countVariable: string; // クエリの総数を指定する変数名 (例: Q)
    queryDefinitions: QueryDefinition[]; // 各クエリタイプの定義
    patternDelimiter?: string;
}

// シンプルな単一入力ブロック (例: S)
export interface SimpleInputBlock extends InputBlock {
    type: 'simpleInput';
    variables: NormalVariable[];
}

// テストケースブロック (T \n case_1 ... のような場合)
export interface TestCaseBlock extends InputBlock {
    type: 'testCaseBlock';
    countVariable: string; // テストケース数 T
    casePattern: InputBlock[]; // 各テストケースがどのような入力ブロックのシーケンスであるか
}


// ParserState インターフェースを更新
export interface ParserState { // ★★★ export を追加 ★★★
    globalVars: Map<string, number | string>;
    currentLineIndex: number;
    // lastDetectedPattern に新しい文字列リテラルを追加
    lastDetectedPattern: 'none' | 'simpleVar' | 'multiVarIndexed' | 'queryDef' | 'array_entry' | 'query_entry'; 
    lastDetectedVariables: string[] | null;
}