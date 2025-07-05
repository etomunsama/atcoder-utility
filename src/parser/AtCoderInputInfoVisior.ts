// src/parser/AtCoderInputInfoVisitor.ts

// 自身の型定義のみインポート
import { VariableInfo } from '../types/index';

// Generated Parser Contexts をインポート
// AtCoderInputParser の Context クラスと AtCoderInputLexer を使用
import AtCoderInputParser,{
    Simple_variable_lineContext,
    Multi_line_single_variable_listContext,
    Horizontal_array_input_lineContext,
    Multi_line_list_inputContext,
    Query_top_level_inputContext,
    Array_elementContext,
    Array_dots_suffixContext,
} from '../generated-parser/src/src/AtCoderInputParser';

// Generated Lexer からトークンIDにアクセスするために必要
import AtCoderInputLexer from '../generated-parser/src/src/AtCoderInputLexer';

// ★★★ ここから Visitor クラスの定義 ★★★
// AbstractParseTreeVisitor を継承しない形（型エラー回避のため）
// @ts-ignore // TypeScriptの型チェックを完全に無視するために必要
export class AtCoderInputInfoVisitor {

    private currentVariables: VariableInfo[] = [];

    // ASTのルートノードから Visitor を開始するためのメソッド
    // testInputParser.ts から ast.accept(this) で呼び出される
    // このメソッドは ANTLR の RuleContext の accept メソッドのシグネチャに合わせる
    accept(visitor: any): VariableInfo[] {
        // ここでの 'visitor' は実際には 'this' (AtCoderInputInfoVisitor のインスタンス自身)
        // そして 'this' (AtCoderInputInfoVisitor) は 'tree' (ASTのルートノード)
        // の accept メソッドの引数として渡される
        // ASTの accept メソッドは、内部で適切な visitXxx メソッドを呼び出してくれる
        // そのため、ここでは何もしなくてよいか、visitStart_rule を直接呼び出す
        // 以下の実装は、最も一般的な ANTLR Visitor の動作に合わせるための仮実装です。
        // 実際には、ASTのルートノードが accept(this) を呼び出したときに、
        // その accept メソッドが内部的に visitor の visitStart_rule() を呼んでくれます。
        // なので、この accept メソッドは通常は不要です。
        // testInputParser.ts で ast.accept(visitor) を呼び出すことで、
        // 自動的に visitStart_rule が呼び出されるはずです。
        // もしエラーが続くなら、このメソッドを削除し、
        // testInputParser.ts の ast.accept(visitor) を @ts-ignore するだけにする。
        
        // とりあえず、このクラスに `accept` メソッドを定義するのは、
        // `TypeError: visitor.visit is not a function` の原因となった `visitor.visit(ast)` を
        // `ast.accept(visitor)` に変更したことに伴い、`AtCoderInputInfoVisitor` が
        // `RuleContext` の `accept` メソッドの引数として渡されたときに適切に処理されるようにするためのものです。
        // 実際の処理は `visitStart_rule` から開始します。
        
        // ASTのルートノード (Start_ruleContext) が accept メソッドを持つので、
        // その accept メソッドが `this` (Visitor) を引数にとって、`visitStart_rule` を呼び出します。
        // この `accept` メソッド自体は、`testInputParser.ts` からは直接呼び出されません。
        // なので、このメソッドの本体はほとんど空でOKです。
        // ★このメソッドは削除します。★
        // ASTノードの accept メソッドが、このVisitorの visitStart_rule などを自動的に呼び出してくれます。
        // this.visitStart_rule(tree); // これはエラーになる可能性があるので削除
        return this.currentVariables;
    }

    // ASTのルートノード Start_ruleContext を訪問するメソッド
    visitStart_rule(ctx: any): VariableInfo[] { // ctx は Start_ruleContext
        console.log("Visitor: visitStart_rule called.");

        // デバッグログ: ASTの子ノードの情報を表示
        console.log("  start_rule AST children:", ctx.children?.map((child: any) => ({
            text: child.text,
            constructorName: child.constructor.name,
            isContext: child.constructor.name.endsWith('Context'),
            isTerminal: child.constructor.name === 'TerminalNodeImpl'
        })));
        
        // children をループし、それぞれの accept メソッドを呼び出して再帰的に訪問
        ctx.children?.forEach((child: any) => {
            if (typeof child.accept === 'function') {
                // @ts-ignore // child.accept(this) の型エラーを無視
                child.accept(this);
            }
        });
        
        console.log("Visitor: visitStart_rule finished. Final currentVariables:", this.currentVariables);
        return this.currentVariables;
    }

    // TerminalNode (ASTの葉ノード、トークンを表す) を訪問するメソッド
    visitTerminal(tokenNode: any): any { // tokenNode は TerminalNode
        // console.log("Visitor: visitTerminal called for token:", tokenNode.text); // デバッグ用
        return this.defaultResult();
    }

    // ErrorNode (パースエラー時のノード) を訪問するメソッド
    visitErrorNode(errorNode: any): any { // errorNode は ErrorNode
        console.warn("Visitor: visitErrorNode called for error:", errorNode.text); // デバッグ用
        return this.defaultResult();
    }

    // Visitorが何も返さない場合のデフォルトの結果
    protected defaultResult(): VariableInfo[] {
        return [];
    }


    // --- 各Parserルールに対応する visit メソッド ---
    // ctx は対応する Context クラスのインスタンス

    visitSimple_variable_line(ctx: any): VariableInfo[] { // ctx は Simple_variable_lineContext
        console.log("Visitor: visitSimple_variable_line called.");
        
        const varNodes = ctx.VAR_NAME_INNER(); // このメソッドは TerminalNode の配列を返すはず
        
        if (varNodes && Array.isArray(varNodes)) {
            console.log("  simple_variable_line: Found VAR_NAME_INNER nodes:", varNodes.map((n: any) => n.text));
            varNodes.forEach((node: any) => {
                this.currentVariables.push({
                    name: node.text,
                    type: 'unknown', isArray: false, isQuery: false,
                });
            });
        } else if (varNodes) { // 単一の TerminalNode を返す場合
            console.log("  simple_variable_line: Found single VAR_NAME_INNER node:", varNodes.text);
            this.currentVariables.push({
                name: varNodes.text,
                type: 'unknown', isArray: false, isQuery: false,
            });
        } else {
            console.warn("  simple_variable_line: VAR_NAME_INNER not found or invalid format.");
        }
        
        console.log("  simple_variable_line: currentVariables after push:", this.currentVariables);
        return this.currentVariables;
    }

    visitMulti_line_single_variable_list(ctx: any): VariableInfo[] { // ctx は Multi_line_single_variable_listContext
        console.log("Visitor: visitMulti_line_single_variable_list called.");
        const varNodes = ctx.VAR_NAME_INNER();
        if (varNodes && Array.isArray(varNodes)) {
            console.log("  multi_line_single_variable_list: Found VAR_NAME_INNER nodes:", varNodes.map((n: any) => n.text));
            varNodes.forEach((node: any) => {
                this.currentVariables.push({ name: node.text, type: 'unknown', isArray: false, isQuery: false, });
            });
        } else if (varNodes) {
            console.log("  multi_line_single_variable_list: Found single VAR_NAME_INNER node:", varNodes.text);
            this.currentVariables.push({ name: varNodes.text, type: 'unknown', isArray: false, isQuery: false, });
        } else {
            console.warn("  multi_line_single_variable_list: VAR_NAME_INNER not found or invalid format.");
        }
        return this.currentVariables;
    }

    visitHorizontal_array_input_line(ctx: any): VariableInfo[] { // ctx は Horizontal_array_input_lineContext
        console.log("Visitor: visitHorizontal_array_input_line called.");
        console.log("AST for Horizontal Array:", ctx.toStringTree(AtCoderInputParser.ruleNames));

        const allVarNodes: any[] = [];

        const arrayElements = ctx.array_element(); // array_element() は Context の配列を返す
        if (arrayElements && Array.isArray(arrayElements)) {
            arrayElements.forEach((elementCtx: any) => { // elementCtx は Array_elementContext
                const varNode = elementCtx.VAR_NAME_INNER(); // VAR_NAME_INNER() は TerminalNode を返す
                if (varNode) { allVarNodes.push(varNode); }
            });
        } else if (arrayElements) { // 単一の Array_elementContext を返す場合
             const varNode = arrayElements.VAR_NAME_INNER();
             if (varNode) { allVarNodes.push(varNode); }
        }

        const dotsSuffix = ctx.array_dots_suffix(); // array_dots_suffix() は Array_dots_suffixContext を返す
        if (dotsSuffix) {
            const optionalElementAfterDots = dotsSuffix.array_element(); // Array_elementContext を返す
            if (optionalElementAfterDots) {
                const varNode = optionalElementAfterDots.VAR_NAME_INNER();
                if (varNode) { allVarNodes.push(varNode); }
            }
        }
        
        const varNames: string[] = allVarNodes.map((node: any) => node.text);

        if (varNames.length === 0) { console.warn("No variable names found for array line."); return this.currentVariables; }

        const arrayBaseName = varNames[0].includes('_') ? varNames[0].split('_')[0] : varNames[0];
        let sizeVarName: string | undefined;

        if (dotsSuffix && dotsSuffix.array_element()) {
            const lastVarNameInDots = dotsSuffix.array_element()!.VAR_NAME_INNER().text;
            if (lastVarNameInDots.includes('_')) { sizeVarName = lastVarNameInDots.split('_')[1]; } else { sizeVarName = lastVarNameInDots; }
        } else if (varNames.length > 0 && varNames[varNames.length - 1].includes('_')) {
            sizeVarName = varNames[varNames.length - 1].split('_')[1];
        }

        this.currentVariables.push({
            name: arrayBaseName, type: 'unknown', isArray: true, dimensions: [1], sizeVariables: sizeVarName ? [sizeVarName] : undefined, isQuery: false,
        });
        console.log("  horizontal_array_input_line: currentVariables after push:", this.currentVariables);
        return this.currentVariables;
    }

    visitMulti_line_list_input(ctx: any): VariableInfo[] { console.log("Visitor: visitMulti_line_list_input called."); return this.currentVariables; }
    visitQuery_top_level_input(ctx: any): VariableInfo[] { console.log("Visitor: visitQuery_top_level_input called."); return this.currentVariables; }
}