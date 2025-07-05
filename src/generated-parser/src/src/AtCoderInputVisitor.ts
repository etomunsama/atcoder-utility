// Generated from src/AtCoderInput.g4 by ANTLR 4.13.2

import {ParseTreeVisitor} from 'antlr4';


import { Start_ruleContext } from "./AtCoderInputParser.js";
import { Simple_variable_lineContext } from "./AtCoderInputParser.js";
import { Multi_line_single_variable_listContext } from "./AtCoderInputParser.js";
import { Horizontal_array_input_lineContext } from "./AtCoderInputParser.js";
import { Array_elementContext } from "./AtCoderInputParser.js";
import { Array_dots_suffixContext } from "./AtCoderInputParser.js";
import { Multi_line_list_inputContext } from "./AtCoderInputParser.js";
import { Line_of_variablesContext } from "./AtCoderInputParser.js";
import { Query_top_level_inputContext } from "./AtCoderInputParser.js";
import { Query_placeholder_lineContext } from "./AtCoderInputParser.js";
import { Query_description_blockContext } from "./AtCoderInputParser.js";
import { Query_description_textContext } from "./AtCoderInputParser.js";
import { Query_type_pre_contentContext } from "./AtCoderInputParser.js";
import { Query_type_idContext } from "./AtCoderInputParser.js";


/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by `AtCoderInputParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export default class AtCoderInputVisitor<Result> extends ParseTreeVisitor<Result> {
	/**
	 * Visit a parse tree produced by `AtCoderInputParser.start_rule`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitStart_rule?: (ctx: Start_ruleContext) => Result;
	/**
	 * Visit a parse tree produced by `AtCoderInputParser.simple_variable_line`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSimple_variable_line?: (ctx: Simple_variable_lineContext) => Result;
	/**
	 * Visit a parse tree produced by `AtCoderInputParser.multi_line_single_variable_list`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMulti_line_single_variable_list?: (ctx: Multi_line_single_variable_listContext) => Result;
	/**
	 * Visit a parse tree produced by `AtCoderInputParser.horizontal_array_input_line`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitHorizontal_array_input_line?: (ctx: Horizontal_array_input_lineContext) => Result;
	/**
	 * Visit a parse tree produced by `AtCoderInputParser.array_element`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitArray_element?: (ctx: Array_elementContext) => Result;
	/**
	 * Visit a parse tree produced by `AtCoderInputParser.array_dots_suffix`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitArray_dots_suffix?: (ctx: Array_dots_suffixContext) => Result;
	/**
	 * Visit a parse tree produced by `AtCoderInputParser.multi_line_list_input`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMulti_line_list_input?: (ctx: Multi_line_list_inputContext) => Result;
	/**
	 * Visit a parse tree produced by `AtCoderInputParser.line_of_variables`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLine_of_variables?: (ctx: Line_of_variablesContext) => Result;
	/**
	 * Visit a parse tree produced by `AtCoderInputParser.query_top_level_input`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitQuery_top_level_input?: (ctx: Query_top_level_inputContext) => Result;
	/**
	 * Visit a parse tree produced by `AtCoderInputParser.query_placeholder_line`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitQuery_placeholder_line?: (ctx: Query_placeholder_lineContext) => Result;
	/**
	 * Visit a parse tree produced by `AtCoderInputParser.query_description_block`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitQuery_description_block?: (ctx: Query_description_blockContext) => Result;
	/**
	 * Visit a parse tree produced by `AtCoderInputParser.query_description_text`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitQuery_description_text?: (ctx: Query_description_textContext) => Result;
	/**
	 * Visit a parse tree produced by `AtCoderInputParser.query_type_pre_content`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitQuery_type_pre_content?: (ctx: Query_type_pre_contentContext) => Result;
	/**
	 * Visit a parse tree produced by `AtCoderInputParser.query_type_id`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitQuery_type_id?: (ctx: Query_type_idContext) => Result;
}

