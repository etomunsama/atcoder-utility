// Generated from src/AtCoderInput.g4 by ANTLR 4.13.2

import {ParseTreeListener} from "antlr4";


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
 * This interface defines a complete listener for a parse tree produced by
 * `AtCoderInputParser`.
 */
export default class AtCoderInputListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by `AtCoderInputParser.start_rule`.
	 * @param ctx the parse tree
	 */
	enterStart_rule?: (ctx: Start_ruleContext) => void;
	/**
	 * Exit a parse tree produced by `AtCoderInputParser.start_rule`.
	 * @param ctx the parse tree
	 */
	exitStart_rule?: (ctx: Start_ruleContext) => void;
	/**
	 * Enter a parse tree produced by `AtCoderInputParser.simple_variable_line`.
	 * @param ctx the parse tree
	 */
	enterSimple_variable_line?: (ctx: Simple_variable_lineContext) => void;
	/**
	 * Exit a parse tree produced by `AtCoderInputParser.simple_variable_line`.
	 * @param ctx the parse tree
	 */
	exitSimple_variable_line?: (ctx: Simple_variable_lineContext) => void;
	/**
	 * Enter a parse tree produced by `AtCoderInputParser.multi_line_single_variable_list`.
	 * @param ctx the parse tree
	 */
	enterMulti_line_single_variable_list?: (ctx: Multi_line_single_variable_listContext) => void;
	/**
	 * Exit a parse tree produced by `AtCoderInputParser.multi_line_single_variable_list`.
	 * @param ctx the parse tree
	 */
	exitMulti_line_single_variable_list?: (ctx: Multi_line_single_variable_listContext) => void;
	/**
	 * Enter a parse tree produced by `AtCoderInputParser.horizontal_array_input_line`.
	 * @param ctx the parse tree
	 */
	enterHorizontal_array_input_line?: (ctx: Horizontal_array_input_lineContext) => void;
	/**
	 * Exit a parse tree produced by `AtCoderInputParser.horizontal_array_input_line`.
	 * @param ctx the parse tree
	 */
	exitHorizontal_array_input_line?: (ctx: Horizontal_array_input_lineContext) => void;
	/**
	 * Enter a parse tree produced by `AtCoderInputParser.array_element`.
	 * @param ctx the parse tree
	 */
	enterArray_element?: (ctx: Array_elementContext) => void;
	/**
	 * Exit a parse tree produced by `AtCoderInputParser.array_element`.
	 * @param ctx the parse tree
	 */
	exitArray_element?: (ctx: Array_elementContext) => void;
	/**
	 * Enter a parse tree produced by `AtCoderInputParser.array_dots_suffix`.
	 * @param ctx the parse tree
	 */
	enterArray_dots_suffix?: (ctx: Array_dots_suffixContext) => void;
	/**
	 * Exit a parse tree produced by `AtCoderInputParser.array_dots_suffix`.
	 * @param ctx the parse tree
	 */
	exitArray_dots_suffix?: (ctx: Array_dots_suffixContext) => void;
	/**
	 * Enter a parse tree produced by `AtCoderInputParser.multi_line_list_input`.
	 * @param ctx the parse tree
	 */
	enterMulti_line_list_input?: (ctx: Multi_line_list_inputContext) => void;
	/**
	 * Exit a parse tree produced by `AtCoderInputParser.multi_line_list_input`.
	 * @param ctx the parse tree
	 */
	exitMulti_line_list_input?: (ctx: Multi_line_list_inputContext) => void;
	/**
	 * Enter a parse tree produced by `AtCoderInputParser.line_of_variables`.
	 * @param ctx the parse tree
	 */
	enterLine_of_variables?: (ctx: Line_of_variablesContext) => void;
	/**
	 * Exit a parse tree produced by `AtCoderInputParser.line_of_variables`.
	 * @param ctx the parse tree
	 */
	exitLine_of_variables?: (ctx: Line_of_variablesContext) => void;
	/**
	 * Enter a parse tree produced by `AtCoderInputParser.query_top_level_input`.
	 * @param ctx the parse tree
	 */
	enterQuery_top_level_input?: (ctx: Query_top_level_inputContext) => void;
	/**
	 * Exit a parse tree produced by `AtCoderInputParser.query_top_level_input`.
	 * @param ctx the parse tree
	 */
	exitQuery_top_level_input?: (ctx: Query_top_level_inputContext) => void;
	/**
	 * Enter a parse tree produced by `AtCoderInputParser.query_placeholder_line`.
	 * @param ctx the parse tree
	 */
	enterQuery_placeholder_line?: (ctx: Query_placeholder_lineContext) => void;
	/**
	 * Exit a parse tree produced by `AtCoderInputParser.query_placeholder_line`.
	 * @param ctx the parse tree
	 */
	exitQuery_placeholder_line?: (ctx: Query_placeholder_lineContext) => void;
	/**
	 * Enter a parse tree produced by `AtCoderInputParser.query_description_block`.
	 * @param ctx the parse tree
	 */
	enterQuery_description_block?: (ctx: Query_description_blockContext) => void;
	/**
	 * Exit a parse tree produced by `AtCoderInputParser.query_description_block`.
	 * @param ctx the parse tree
	 */
	exitQuery_description_block?: (ctx: Query_description_blockContext) => void;
	/**
	 * Enter a parse tree produced by `AtCoderInputParser.query_description_text`.
	 * @param ctx the parse tree
	 */
	enterQuery_description_text?: (ctx: Query_description_textContext) => void;
	/**
	 * Exit a parse tree produced by `AtCoderInputParser.query_description_text`.
	 * @param ctx the parse tree
	 */
	exitQuery_description_text?: (ctx: Query_description_textContext) => void;
	/**
	 * Enter a parse tree produced by `AtCoderInputParser.query_type_pre_content`.
	 * @param ctx the parse tree
	 */
	enterQuery_type_pre_content?: (ctx: Query_type_pre_contentContext) => void;
	/**
	 * Exit a parse tree produced by `AtCoderInputParser.query_type_pre_content`.
	 * @param ctx the parse tree
	 */
	exitQuery_type_pre_content?: (ctx: Query_type_pre_contentContext) => void;
	/**
	 * Enter a parse tree produced by `AtCoderInputParser.query_type_id`.
	 * @param ctx the parse tree
	 */
	enterQuery_type_id?: (ctx: Query_type_idContext) => void;
	/**
	 * Exit a parse tree produced by `AtCoderInputParser.query_type_id`.
	 * @param ctx the parse tree
	 */
	exitQuery_type_id?: (ctx: Query_type_idContext) => void;
}

