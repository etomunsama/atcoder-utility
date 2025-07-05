// Generated from src/AtCoderInput.g4 by ANTLR 4.13.2
// noinspection ES6UnusedImports,JSUnusedGlobalSymbols,JSUnusedLocalSymbols

import {
	ATN,
	ATNDeserializer, DecisionState, DFA, FailedPredicateException,
	RecognitionException, NoViableAltException, BailErrorStrategy,
	Parser, ParserATNSimulator,
	RuleContext, ParserRuleContext, PredictionMode, PredictionContextCache,
	TerminalNode, RuleNode,
	Token, TokenStream,
	Interval, IntervalSet
} from 'antlr4';
import AtCoderInputListener from "./AtCoderInputListener.js";
import AtCoderInputVisitor from "./AtCoderInputVisitor.js";

// for running tests with parameters, TODO: discuss strategy for typed parameters in CI
// eslint-disable-next-line no-unused-vars
type int = number;

export default class AtCoderInputParser extends Parser {
	public static readonly L_VAR_START = 1;
	public static readonly L_VAR_END = 2;
	public static readonly VAR_NAME_INNER = 3;
	public static readonly NUMBER = 4;
	public static readonly L_DOTS = 5;
	public static readonly L_VDOTS = 6;
	public static readonly L_MATH_CASE = 7;
	public static readonly L_MATH_QUERY = 8;
	public static readonly L_RM_QUERY = 9;
	public static readonly NEWLINE = 10;
	public static readonly SPACE = 11;
	public static readonly TAB = 12;
	public static readonly KW_QUERY_TYPE_INDICATOR = 13;
	public static readonly TEXT_CONTENT = 14;
	public static readonly KW_PERIOD = 15;
	public static override readonly EOF = Token.EOF;
	public static readonly RULE_start_rule = 0;
	public static readonly RULE_simple_variable_line = 1;
	public static readonly RULE_multi_line_single_variable_list = 2;
	public static readonly RULE_horizontal_array_input_line = 3;
	public static readonly RULE_array_element = 4;
	public static readonly RULE_array_dots_suffix = 5;
	public static readonly RULE_multi_line_list_input = 6;
	public static readonly RULE_line_of_variables = 7;
	public static readonly RULE_query_top_level_input = 8;
	public static readonly RULE_query_placeholder_line = 9;
	public static readonly RULE_query_description_block = 10;
	public static readonly RULE_query_description_text = 11;
	public static readonly RULE_query_type_pre_content = 12;
	public static readonly RULE_query_type_id = 13;
	public static readonly literalNames: (string | null)[] = [ null, "'<var>'", 
                                                            "'</var>'", 
                                                            null, null, 
                                                            "'\\\\ldots'", 
                                                            "'\\\\vdots'", 
                                                            "'\\\\mathrm{case}'", 
                                                            "'\\\\mathrm{query}'", 
                                                            "'\\\\rm{Query}'", 
                                                            null, "' '", 
                                                            "'\\t'", null, 
                                                            null, "'\\u3002'" ];
	public static readonly symbolicNames: (string | null)[] = [ null, "L_VAR_START", 
                                                             "L_VAR_END", 
                                                             "VAR_NAME_INNER", 
                                                             "NUMBER", "L_DOTS", 
                                                             "L_VDOTS", 
                                                             "L_MATH_CASE", 
                                                             "L_MATH_QUERY", 
                                                             "L_RM_QUERY", 
                                                             "NEWLINE", 
                                                             "SPACE", "TAB", 
                                                             "KW_QUERY_TYPE_INDICATOR", 
                                                             "TEXT_CONTENT", 
                                                             "KW_PERIOD" ];
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"start_rule", "simple_variable_line", "multi_line_single_variable_list", 
		"horizontal_array_input_line", "array_element", "array_dots_suffix", "multi_line_list_input", 
		"line_of_variables", "query_top_level_input", "query_placeholder_line", 
		"query_description_block", "query_description_text", "query_type_pre_content", 
		"query_type_id",
	];
	public get grammarFileName(): string { return "AtCoderInput.g4"; }
	public get literalNames(): (string | null)[] { return AtCoderInputParser.literalNames; }
	public get symbolicNames(): (string | null)[] { return AtCoderInputParser.symbolicNames; }
	public get ruleNames(): string[] { return AtCoderInputParser.ruleNames; }
	public get serializedATN(): number[] { return AtCoderInputParser._serializedATN; }

	protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException {
		return new FailedPredicateException(this, predicate, message);
	}

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(this, AtCoderInputParser._ATN, AtCoderInputParser.DecisionsToDFA, new PredictionContextCache());
	}
	// @RuleVersion(0)
	public start_rule(): Start_ruleContext {
		let localctx: Start_ruleContext = new Start_ruleContext(this, this._ctx, this.state);
		this.enterRule(localctx, 0, AtCoderInputParser.RULE_start_rule);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 33;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				this.state = 33;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 0, this._ctx) ) {
				case 1:
					{
					this.state = 28;
					this.simple_variable_line();
					}
					break;
				case 2:
					{
					this.state = 29;
					this.multi_line_single_variable_list();
					}
					break;
				case 3:
					{
					this.state = 30;
					this.horizontal_array_input_line();
					}
					break;
				case 4:
					{
					this.state = 31;
					this.multi_line_list_input();
					}
					break;
				case 5:
					{
					this.state = 32;
					this.query_top_level_input();
					}
					break;
				}
				}
				this.state = 35;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (_la===1 || _la===10);
			this.state = 37;
			this.match(AtCoderInputParser.EOF);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public simple_variable_line(): Simple_variable_lineContext {
		let localctx: Simple_variable_lineContext = new Simple_variable_lineContext(this, this._ctx, this.state);
		this.enterRule(localctx, 2, AtCoderInputParser.RULE_simple_variable_line);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			{
			this.state = 39;
			this.match(AtCoderInputParser.L_VAR_START);
			this.state = 40;
			this.match(AtCoderInputParser.VAR_NAME_INNER);
			this.state = 41;
			this.match(AtCoderInputParser.L_VAR_END);
			this.state = 48;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===11) {
				{
				{
				this.state = 42;
				this.match(AtCoderInputParser.SPACE);
				this.state = 43;
				this.match(AtCoderInputParser.L_VAR_START);
				this.state = 44;
				this.match(AtCoderInputParser.VAR_NAME_INNER);
				this.state = 45;
				this.match(AtCoderInputParser.L_VAR_END);
				}
				}
				this.state = 50;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
			this.state = 51;
			_la = this._input.LA(1);
			if(!(_la===-1 || _la===10)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public multi_line_single_variable_list(): Multi_line_single_variable_listContext {
		let localctx: Multi_line_single_variable_listContext = new Multi_line_single_variable_listContext(this, this._ctx, this.state);
		this.enterRule(localctx, 4, AtCoderInputParser.RULE_multi_line_single_variable_list);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 57;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					this.state = 53;
					this.match(AtCoderInputParser.L_VAR_START);
					this.state = 54;
					this.match(AtCoderInputParser.VAR_NAME_INNER);
					this.state = 55;
					this.match(AtCoderInputParser.L_VAR_END);
					this.state = 56;
					this.match(AtCoderInputParser.NEWLINE);
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 59;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 3, this._ctx);
			} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public horizontal_array_input_line(): Horizontal_array_input_lineContext {
		let localctx: Horizontal_array_input_lineContext = new Horizontal_array_input_lineContext(this, this._ctx, this.state);
		this.enterRule(localctx, 6, AtCoderInputParser.RULE_horizontal_array_input_line);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 73;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===1) {
				{
				this.state = 61;
				this.array_element();
				this.state = 66;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 4, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 62;
						this.match(AtCoderInputParser.SPACE);
						this.state = 63;
						this.array_element();
						}
						}
					}
					this.state = 68;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 4, this._ctx);
				}
				this.state = 71;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===11) {
					{
					this.state = 69;
					this.match(AtCoderInputParser.SPACE);
					this.state = 70;
					this.array_dots_suffix();
					}
				}

				}
			}

			this.state = 75;
			this.match(AtCoderInputParser.NEWLINE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public array_element(): Array_elementContext {
		let localctx: Array_elementContext = new Array_elementContext(this, this._ctx, this.state);
		this.enterRule(localctx, 8, AtCoderInputParser.RULE_array_element);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 77;
			this.match(AtCoderInputParser.L_VAR_START);
			this.state = 78;
			this.match(AtCoderInputParser.VAR_NAME_INNER);
			this.state = 79;
			this.match(AtCoderInputParser.L_VAR_END);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public array_dots_suffix(): Array_dots_suffixContext {
		let localctx: Array_dots_suffixContext = new Array_dots_suffixContext(this, this._ctx, this.state);
		this.enterRule(localctx, 10, AtCoderInputParser.RULE_array_dots_suffix);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 81;
			this.match(AtCoderInputParser.L_VAR_START);
			this.state = 82;
			this.match(AtCoderInputParser.L_DOTS);
			this.state = 83;
			this.match(AtCoderInputParser.L_VAR_END);
			this.state = 86;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===11) {
				{
				this.state = 84;
				this.match(AtCoderInputParser.SPACE);
				this.state = 85;
				this.array_element();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public multi_line_list_input(): Multi_line_list_inputContext {
		let localctx: Multi_line_list_inputContext = new Multi_line_list_inputContext(this, this._ctx, this.state);
		this.enterRule(localctx, 12, AtCoderInputParser.RULE_multi_line_list_input);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 91;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					this.state = 88;
					this.line_of_variables();
					this.state = 89;
					this.match(AtCoderInputParser.NEWLINE);
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 93;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 8, this._ctx);
			} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
			this.state = 95;
			this.match(AtCoderInputParser.L_VAR_START);
			this.state = 96;
			this.match(AtCoderInputParser.L_VDOTS);
			this.state = 97;
			this.match(AtCoderInputParser.L_VAR_END);
			this.state = 98;
			this.match(AtCoderInputParser.NEWLINE);
			this.state = 102;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 9, this._ctx) ) {
			case 1:
				{
				this.state = 99;
				this.line_of_variables();
				this.state = 100;
				this.match(AtCoderInputParser.NEWLINE);
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public line_of_variables(): Line_of_variablesContext {
		let localctx: Line_of_variablesContext = new Line_of_variablesContext(this, this._ctx, this.state);
		this.enterRule(localctx, 14, AtCoderInputParser.RULE_line_of_variables);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			{
			this.state = 104;
			this.match(AtCoderInputParser.L_VAR_START);
			this.state = 105;
			this.match(AtCoderInputParser.VAR_NAME_INNER);
			this.state = 106;
			this.match(AtCoderInputParser.L_VAR_END);
			this.state = 113;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===11) {
				{
				{
				this.state = 107;
				this.match(AtCoderInputParser.SPACE);
				this.state = 108;
				this.match(AtCoderInputParser.L_VAR_START);
				this.state = 109;
				this.match(AtCoderInputParser.VAR_NAME_INNER);
				this.state = 110;
				this.match(AtCoderInputParser.L_VAR_END);
				}
				}
				this.state = 115;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public query_top_level_input(): Query_top_level_inputContext {
		let localctx: Query_top_level_inputContext = new Query_top_level_inputContext(this, this._ctx, this.state);
		this.enterRule(localctx, 16, AtCoderInputParser.RULE_query_top_level_input);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 117;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 11, this._ctx) ) {
			case 1:
				{
				this.state = 116;
				this.simple_variable_line();
				}
				break;
			}
			this.state = 122;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					this.state = 119;
					this.query_placeholder_line();
					this.state = 120;
					this.match(AtCoderInputParser.NEWLINE);
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 124;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 12, this._ctx);
			} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
			this.state = 126;
			this.match(AtCoderInputParser.L_VAR_START);
			this.state = 127;
			this.match(AtCoderInputParser.L_VDOTS);
			this.state = 128;
			this.match(AtCoderInputParser.L_VAR_END);
			this.state = 129;
			this.match(AtCoderInputParser.NEWLINE);
			this.state = 133;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 13, this._ctx) ) {
			case 1:
				{
				this.state = 130;
				this.query_placeholder_line();
				this.state = 131;
				this.match(AtCoderInputParser.NEWLINE);
				}
				break;
			}
			this.state = 138;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 14, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 135;
					this.query_description_block();
					}
					}
				}
				this.state = 140;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 14, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public query_placeholder_line(): Query_placeholder_lineContext {
		let localctx: Query_placeholder_lineContext = new Query_placeholder_lineContext(this, this._ctx, this.state);
		this.enterRule(localctx, 18, AtCoderInputParser.RULE_query_placeholder_line);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 141;
			this.match(AtCoderInputParser.L_VAR_START);
			this.state = 142;
			_la = this._input.LA(1);
			if(!(_la===8 || _la===9)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			this.state = 143;
			this.match(AtCoderInputParser.NUMBER);
			this.state = 144;
			this.match(AtCoderInputParser.L_VAR_END);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public query_description_block(): Query_description_blockContext {
		let localctx: Query_description_blockContext = new Query_description_blockContext(this, this._ctx, this.state);
		this.enterRule(localctx, 20, AtCoderInputParser.RULE_query_description_block);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 149;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 15, this._ctx) ) {
			case 1:
				{
				this.state = 146;
				this.query_description_text();
				this.state = 147;
				this.match(AtCoderInputParser.NEWLINE);
				}
				break;
			}
			this.state = 152;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					this.state = 151;
					this.query_type_pre_content();
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 154;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 16, this._ctx);
			} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public query_description_text(): Query_description_textContext {
		let localctx: Query_description_textContext = new Query_description_textContext(this, this._ctx, this.state);
		this.enterRule(localctx, 22, AtCoderInputParser.RULE_query_description_text);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 162;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				this.state = 162;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case 14:
					{
					this.state = 156;
					this.match(AtCoderInputParser.TEXT_CONTENT);
					}
					break;
				case 1:
					{
					this.state = 157;
					this.match(AtCoderInputParser.L_VAR_START);
					this.state = 158;
					this.match(AtCoderInputParser.VAR_NAME_INNER);
					this.state = 159;
					this.match(AtCoderInputParser.L_VAR_END);
					}
					break;
				case 4:
					{
					this.state = 160;
					this.match(AtCoderInputParser.NUMBER);
					}
					break;
				case 13:
					{
					this.state = 161;
					this.match(AtCoderInputParser.KW_QUERY_TYPE_INDICATOR);
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				this.state = 164;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 24594) !== 0));
			this.state = 166;
			this.match(AtCoderInputParser.KW_PERIOD);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public query_type_pre_content(): Query_type_pre_contentContext {
		let localctx: Query_type_pre_contentContext = new Query_type_pre_contentContext(this, this._ctx, this.state);
		this.enterRule(localctx, 24, AtCoderInputParser.RULE_query_type_pre_content);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 168;
			this.match(AtCoderInputParser.L_VAR_START);
			this.state = 169;
			this.query_type_id();
			this.state = 170;
			this.match(AtCoderInputParser.L_VAR_END);
			this.state = 177;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===11) {
				{
				{
				this.state = 171;
				this.match(AtCoderInputParser.SPACE);
				this.state = 172;
				this.match(AtCoderInputParser.L_VAR_START);
				this.state = 173;
				this.match(AtCoderInputParser.VAR_NAME_INNER);
				this.state = 174;
				this.match(AtCoderInputParser.L_VAR_END);
				}
				}
				this.state = 179;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 180;
			this.match(AtCoderInputParser.NEWLINE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public query_type_id(): Query_type_idContext {
		let localctx: Query_type_idContext = new Query_type_idContext(this, this._ctx, this.state);
		this.enterRule(localctx, 26, AtCoderInputParser.RULE_query_type_id);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 182;
			_la = this._input.LA(1);
			if(!(_la===3 || _la===4)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public static readonly _serializedATN: number[] = [4,1,15,185,2,0,7,0,2,
	1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,7,6,2,7,7,7,2,8,7,8,2,9,7,9,2,
	10,7,10,2,11,7,11,2,12,7,12,2,13,7,13,1,0,1,0,1,0,1,0,1,0,4,0,34,8,0,11,
	0,12,0,35,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,1,47,8,1,10,1,12,1,50,9,
	1,1,1,1,1,1,2,1,2,1,2,1,2,4,2,58,8,2,11,2,12,2,59,1,3,1,3,1,3,5,3,65,8,
	3,10,3,12,3,68,9,3,1,3,1,3,3,3,72,8,3,3,3,74,8,3,1,3,1,3,1,4,1,4,1,4,1,
	4,1,5,1,5,1,5,1,5,1,5,3,5,87,8,5,1,6,1,6,1,6,4,6,92,8,6,11,6,12,6,93,1,
	6,1,6,1,6,1,6,1,6,1,6,1,6,3,6,103,8,6,1,7,1,7,1,7,1,7,1,7,1,7,1,7,5,7,112,
	8,7,10,7,12,7,115,9,7,1,8,3,8,118,8,8,1,8,1,8,1,8,4,8,123,8,8,11,8,12,8,
	124,1,8,1,8,1,8,1,8,1,8,1,8,1,8,3,8,134,8,8,1,8,5,8,137,8,8,10,8,12,8,140,
	9,8,1,9,1,9,1,9,1,9,1,9,1,10,1,10,1,10,3,10,150,8,10,1,10,4,10,153,8,10,
	11,10,12,10,154,1,11,1,11,1,11,1,11,1,11,1,11,4,11,163,8,11,11,11,12,11,
	164,1,11,1,11,1,12,1,12,1,12,1,12,1,12,1,12,1,12,5,12,176,8,12,10,12,12,
	12,179,9,12,1,12,1,12,1,13,1,13,1,13,0,0,14,0,2,4,6,8,10,12,14,16,18,20,
	22,24,26,0,3,1,1,10,10,1,0,8,9,1,0,3,4,195,0,33,1,0,0,0,2,39,1,0,0,0,4,
	57,1,0,0,0,6,73,1,0,0,0,8,77,1,0,0,0,10,81,1,0,0,0,12,91,1,0,0,0,14,104,
	1,0,0,0,16,117,1,0,0,0,18,141,1,0,0,0,20,149,1,0,0,0,22,162,1,0,0,0,24,
	168,1,0,0,0,26,182,1,0,0,0,28,34,3,2,1,0,29,34,3,4,2,0,30,34,3,6,3,0,31,
	34,3,12,6,0,32,34,3,16,8,0,33,28,1,0,0,0,33,29,1,0,0,0,33,30,1,0,0,0,33,
	31,1,0,0,0,33,32,1,0,0,0,34,35,1,0,0,0,35,33,1,0,0,0,35,36,1,0,0,0,36,37,
	1,0,0,0,37,38,5,0,0,1,38,1,1,0,0,0,39,40,5,1,0,0,40,41,5,3,0,0,41,48,5,
	2,0,0,42,43,5,11,0,0,43,44,5,1,0,0,44,45,5,3,0,0,45,47,5,2,0,0,46,42,1,
	0,0,0,47,50,1,0,0,0,48,46,1,0,0,0,48,49,1,0,0,0,49,51,1,0,0,0,50,48,1,0,
	0,0,51,52,7,0,0,0,52,3,1,0,0,0,53,54,5,1,0,0,54,55,5,3,0,0,55,56,5,2,0,
	0,56,58,5,10,0,0,57,53,1,0,0,0,58,59,1,0,0,0,59,57,1,0,0,0,59,60,1,0,0,
	0,60,5,1,0,0,0,61,66,3,8,4,0,62,63,5,11,0,0,63,65,3,8,4,0,64,62,1,0,0,0,
	65,68,1,0,0,0,66,64,1,0,0,0,66,67,1,0,0,0,67,71,1,0,0,0,68,66,1,0,0,0,69,
	70,5,11,0,0,70,72,3,10,5,0,71,69,1,0,0,0,71,72,1,0,0,0,72,74,1,0,0,0,73,
	61,1,0,0,0,73,74,1,0,0,0,74,75,1,0,0,0,75,76,5,10,0,0,76,7,1,0,0,0,77,78,
	5,1,0,0,78,79,5,3,0,0,79,80,5,2,0,0,80,9,1,0,0,0,81,82,5,1,0,0,82,83,5,
	5,0,0,83,86,5,2,0,0,84,85,5,11,0,0,85,87,3,8,4,0,86,84,1,0,0,0,86,87,1,
	0,0,0,87,11,1,0,0,0,88,89,3,14,7,0,89,90,5,10,0,0,90,92,1,0,0,0,91,88,1,
	0,0,0,92,93,1,0,0,0,93,91,1,0,0,0,93,94,1,0,0,0,94,95,1,0,0,0,95,96,5,1,
	0,0,96,97,5,6,0,0,97,98,5,2,0,0,98,102,5,10,0,0,99,100,3,14,7,0,100,101,
	5,10,0,0,101,103,1,0,0,0,102,99,1,0,0,0,102,103,1,0,0,0,103,13,1,0,0,0,
	104,105,5,1,0,0,105,106,5,3,0,0,106,113,5,2,0,0,107,108,5,11,0,0,108,109,
	5,1,0,0,109,110,5,3,0,0,110,112,5,2,0,0,111,107,1,0,0,0,112,115,1,0,0,0,
	113,111,1,0,0,0,113,114,1,0,0,0,114,15,1,0,0,0,115,113,1,0,0,0,116,118,
	3,2,1,0,117,116,1,0,0,0,117,118,1,0,0,0,118,122,1,0,0,0,119,120,3,18,9,
	0,120,121,5,10,0,0,121,123,1,0,0,0,122,119,1,0,0,0,123,124,1,0,0,0,124,
	122,1,0,0,0,124,125,1,0,0,0,125,126,1,0,0,0,126,127,5,1,0,0,127,128,5,6,
	0,0,128,129,5,2,0,0,129,133,5,10,0,0,130,131,3,18,9,0,131,132,5,10,0,0,
	132,134,1,0,0,0,133,130,1,0,0,0,133,134,1,0,0,0,134,138,1,0,0,0,135,137,
	3,20,10,0,136,135,1,0,0,0,137,140,1,0,0,0,138,136,1,0,0,0,138,139,1,0,0,
	0,139,17,1,0,0,0,140,138,1,0,0,0,141,142,5,1,0,0,142,143,7,1,0,0,143,144,
	5,4,0,0,144,145,5,2,0,0,145,19,1,0,0,0,146,147,3,22,11,0,147,148,5,10,0,
	0,148,150,1,0,0,0,149,146,1,0,0,0,149,150,1,0,0,0,150,152,1,0,0,0,151,153,
	3,24,12,0,152,151,1,0,0,0,153,154,1,0,0,0,154,152,1,0,0,0,154,155,1,0,0,
	0,155,21,1,0,0,0,156,163,5,14,0,0,157,158,5,1,0,0,158,159,5,3,0,0,159,163,
	5,2,0,0,160,163,5,4,0,0,161,163,5,13,0,0,162,156,1,0,0,0,162,157,1,0,0,
	0,162,160,1,0,0,0,162,161,1,0,0,0,163,164,1,0,0,0,164,162,1,0,0,0,164,165,
	1,0,0,0,165,166,1,0,0,0,166,167,5,15,0,0,167,23,1,0,0,0,168,169,5,1,0,0,
	169,170,3,26,13,0,170,177,5,2,0,0,171,172,5,11,0,0,172,173,5,1,0,0,173,
	174,5,3,0,0,174,176,5,2,0,0,175,171,1,0,0,0,176,179,1,0,0,0,177,175,1,0,
	0,0,177,178,1,0,0,0,178,180,1,0,0,0,179,177,1,0,0,0,180,181,5,10,0,0,181,
	25,1,0,0,0,182,183,7,2,0,0,183,27,1,0,0,0,20,33,35,48,59,66,71,73,86,93,
	102,113,117,124,133,138,149,154,162,164,177];

	private static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!AtCoderInputParser.__ATN) {
			AtCoderInputParser.__ATN = new ATNDeserializer().deserialize(AtCoderInputParser._serializedATN);
		}

		return AtCoderInputParser.__ATN;
	}


	static DecisionsToDFA = AtCoderInputParser._ATN.decisionToState.map( (ds: DecisionState, index: number) => new DFA(ds, index) );

}

export class Start_ruleContext extends ParserRuleContext {
	constructor(parser?: AtCoderInputParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public EOF(): TerminalNode {
		return this.getToken(AtCoderInputParser.EOF, 0);
	}
	public simple_variable_line_list(): Simple_variable_lineContext[] {
		return this.getTypedRuleContexts(Simple_variable_lineContext) as Simple_variable_lineContext[];
	}
	public simple_variable_line(i: number): Simple_variable_lineContext {
		return this.getTypedRuleContext(Simple_variable_lineContext, i) as Simple_variable_lineContext;
	}
	public multi_line_single_variable_list_list(): Multi_line_single_variable_listContext[] {
		return this.getTypedRuleContexts(Multi_line_single_variable_listContext) as Multi_line_single_variable_listContext[];
	}
	public multi_line_single_variable_list(i: number): Multi_line_single_variable_listContext {
		return this.getTypedRuleContext(Multi_line_single_variable_listContext, i) as Multi_line_single_variable_listContext;
	}
	public horizontal_array_input_line_list(): Horizontal_array_input_lineContext[] {
		return this.getTypedRuleContexts(Horizontal_array_input_lineContext) as Horizontal_array_input_lineContext[];
	}
	public horizontal_array_input_line(i: number): Horizontal_array_input_lineContext {
		return this.getTypedRuleContext(Horizontal_array_input_lineContext, i) as Horizontal_array_input_lineContext;
	}
	public multi_line_list_input_list(): Multi_line_list_inputContext[] {
		return this.getTypedRuleContexts(Multi_line_list_inputContext) as Multi_line_list_inputContext[];
	}
	public multi_line_list_input(i: number): Multi_line_list_inputContext {
		return this.getTypedRuleContext(Multi_line_list_inputContext, i) as Multi_line_list_inputContext;
	}
	public query_top_level_input_list(): Query_top_level_inputContext[] {
		return this.getTypedRuleContexts(Query_top_level_inputContext) as Query_top_level_inputContext[];
	}
	public query_top_level_input(i: number): Query_top_level_inputContext {
		return this.getTypedRuleContext(Query_top_level_inputContext, i) as Query_top_level_inputContext;
	}
    public get ruleIndex(): number {
    	return AtCoderInputParser.RULE_start_rule;
	}
	public enterRule(listener: AtCoderInputListener): void {
	    if(listener.enterStart_rule) {
	 		listener.enterStart_rule(this);
		}
	}
	public exitRule(listener: AtCoderInputListener): void {
	    if(listener.exitStart_rule) {
	 		listener.exitStart_rule(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AtCoderInputVisitor<Result>): Result {
		if (visitor.visitStart_rule) {
			return visitor.visitStart_rule(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Simple_variable_lineContext extends ParserRuleContext {
	constructor(parser?: AtCoderInputParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public NEWLINE(): TerminalNode {
		return this.getToken(AtCoderInputParser.NEWLINE, 0);
	}
	public EOF(): TerminalNode {
		return this.getToken(AtCoderInputParser.EOF, 0);
	}
	public L_VAR_START_list(): TerminalNode[] {
	    	return this.getTokens(AtCoderInputParser.L_VAR_START);
	}
	public L_VAR_START(i: number): TerminalNode {
		return this.getToken(AtCoderInputParser.L_VAR_START, i);
	}
	public VAR_NAME_INNER_list(): TerminalNode[] {
	    	return this.getTokens(AtCoderInputParser.VAR_NAME_INNER);
	}
	public VAR_NAME_INNER(i: number): TerminalNode {
		return this.getToken(AtCoderInputParser.VAR_NAME_INNER, i);
	}
	public L_VAR_END_list(): TerminalNode[] {
	    	return this.getTokens(AtCoderInputParser.L_VAR_END);
	}
	public L_VAR_END(i: number): TerminalNode {
		return this.getToken(AtCoderInputParser.L_VAR_END, i);
	}
	public SPACE_list(): TerminalNode[] {
	    	return this.getTokens(AtCoderInputParser.SPACE);
	}
	public SPACE(i: number): TerminalNode {
		return this.getToken(AtCoderInputParser.SPACE, i);
	}
    public get ruleIndex(): number {
    	return AtCoderInputParser.RULE_simple_variable_line;
	}
	public enterRule(listener: AtCoderInputListener): void {
	    if(listener.enterSimple_variable_line) {
	 		listener.enterSimple_variable_line(this);
		}
	}
	public exitRule(listener: AtCoderInputListener): void {
	    if(listener.exitSimple_variable_line) {
	 		listener.exitSimple_variable_line(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AtCoderInputVisitor<Result>): Result {
		if (visitor.visitSimple_variable_line) {
			return visitor.visitSimple_variable_line(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Multi_line_single_variable_listContext extends ParserRuleContext {
	constructor(parser?: AtCoderInputParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public L_VAR_START_list(): TerminalNode[] {
	    	return this.getTokens(AtCoderInputParser.L_VAR_START);
	}
	public L_VAR_START(i: number): TerminalNode {
		return this.getToken(AtCoderInputParser.L_VAR_START, i);
	}
	public VAR_NAME_INNER_list(): TerminalNode[] {
	    	return this.getTokens(AtCoderInputParser.VAR_NAME_INNER);
	}
	public VAR_NAME_INNER(i: number): TerminalNode {
		return this.getToken(AtCoderInputParser.VAR_NAME_INNER, i);
	}
	public L_VAR_END_list(): TerminalNode[] {
	    	return this.getTokens(AtCoderInputParser.L_VAR_END);
	}
	public L_VAR_END(i: number): TerminalNode {
		return this.getToken(AtCoderInputParser.L_VAR_END, i);
	}
	public NEWLINE_list(): TerminalNode[] {
	    	return this.getTokens(AtCoderInputParser.NEWLINE);
	}
	public NEWLINE(i: number): TerminalNode {
		return this.getToken(AtCoderInputParser.NEWLINE, i);
	}
    public get ruleIndex(): number {
    	return AtCoderInputParser.RULE_multi_line_single_variable_list;
	}
	public enterRule(listener: AtCoderInputListener): void {
	    if(listener.enterMulti_line_single_variable_list) {
	 		listener.enterMulti_line_single_variable_list(this);
		}
	}
	public exitRule(listener: AtCoderInputListener): void {
	    if(listener.exitMulti_line_single_variable_list) {
	 		listener.exitMulti_line_single_variable_list(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AtCoderInputVisitor<Result>): Result {
		if (visitor.visitMulti_line_single_variable_list) {
			return visitor.visitMulti_line_single_variable_list(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Horizontal_array_input_lineContext extends ParserRuleContext {
	constructor(parser?: AtCoderInputParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public NEWLINE(): TerminalNode {
		return this.getToken(AtCoderInputParser.NEWLINE, 0);
	}
	public array_element_list(): Array_elementContext[] {
		return this.getTypedRuleContexts(Array_elementContext) as Array_elementContext[];
	}
	public array_element(i: number): Array_elementContext {
		return this.getTypedRuleContext(Array_elementContext, i) as Array_elementContext;
	}
	public SPACE_list(): TerminalNode[] {
	    	return this.getTokens(AtCoderInputParser.SPACE);
	}
	public SPACE(i: number): TerminalNode {
		return this.getToken(AtCoderInputParser.SPACE, i);
	}
	public array_dots_suffix(): Array_dots_suffixContext {
		return this.getTypedRuleContext(Array_dots_suffixContext, 0) as Array_dots_suffixContext;
	}
    public get ruleIndex(): number {
    	return AtCoderInputParser.RULE_horizontal_array_input_line;
	}
	public enterRule(listener: AtCoderInputListener): void {
	    if(listener.enterHorizontal_array_input_line) {
	 		listener.enterHorizontal_array_input_line(this);
		}
	}
	public exitRule(listener: AtCoderInputListener): void {
	    if(listener.exitHorizontal_array_input_line) {
	 		listener.exitHorizontal_array_input_line(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AtCoderInputVisitor<Result>): Result {
		if (visitor.visitHorizontal_array_input_line) {
			return visitor.visitHorizontal_array_input_line(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Array_elementContext extends ParserRuleContext {
	constructor(parser?: AtCoderInputParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public L_VAR_START(): TerminalNode {
		return this.getToken(AtCoderInputParser.L_VAR_START, 0);
	}
	public VAR_NAME_INNER(): TerminalNode {
		return this.getToken(AtCoderInputParser.VAR_NAME_INNER, 0);
	}
	public L_VAR_END(): TerminalNode {
		return this.getToken(AtCoderInputParser.L_VAR_END, 0);
	}
    public get ruleIndex(): number {
    	return AtCoderInputParser.RULE_array_element;
	}
	public enterRule(listener: AtCoderInputListener): void {
	    if(listener.enterArray_element) {
	 		listener.enterArray_element(this);
		}
	}
	public exitRule(listener: AtCoderInputListener): void {
	    if(listener.exitArray_element) {
	 		listener.exitArray_element(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AtCoderInputVisitor<Result>): Result {
		if (visitor.visitArray_element) {
			return visitor.visitArray_element(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Array_dots_suffixContext extends ParserRuleContext {
	constructor(parser?: AtCoderInputParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public L_VAR_START(): TerminalNode {
		return this.getToken(AtCoderInputParser.L_VAR_START, 0);
	}
	public L_DOTS(): TerminalNode {
		return this.getToken(AtCoderInputParser.L_DOTS, 0);
	}
	public L_VAR_END(): TerminalNode {
		return this.getToken(AtCoderInputParser.L_VAR_END, 0);
	}
	public SPACE(): TerminalNode {
		return this.getToken(AtCoderInputParser.SPACE, 0);
	}
	public array_element(): Array_elementContext {
		return this.getTypedRuleContext(Array_elementContext, 0) as Array_elementContext;
	}
    public get ruleIndex(): number {
    	return AtCoderInputParser.RULE_array_dots_suffix;
	}
	public enterRule(listener: AtCoderInputListener): void {
	    if(listener.enterArray_dots_suffix) {
	 		listener.enterArray_dots_suffix(this);
		}
	}
	public exitRule(listener: AtCoderInputListener): void {
	    if(listener.exitArray_dots_suffix) {
	 		listener.exitArray_dots_suffix(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AtCoderInputVisitor<Result>): Result {
		if (visitor.visitArray_dots_suffix) {
			return visitor.visitArray_dots_suffix(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Multi_line_list_inputContext extends ParserRuleContext {
	constructor(parser?: AtCoderInputParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public L_VAR_START(): TerminalNode {
		return this.getToken(AtCoderInputParser.L_VAR_START, 0);
	}
	public L_VDOTS(): TerminalNode {
		return this.getToken(AtCoderInputParser.L_VDOTS, 0);
	}
	public L_VAR_END(): TerminalNode {
		return this.getToken(AtCoderInputParser.L_VAR_END, 0);
	}
	public NEWLINE_list(): TerminalNode[] {
	    	return this.getTokens(AtCoderInputParser.NEWLINE);
	}
	public NEWLINE(i: number): TerminalNode {
		return this.getToken(AtCoderInputParser.NEWLINE, i);
	}
	public line_of_variables_list(): Line_of_variablesContext[] {
		return this.getTypedRuleContexts(Line_of_variablesContext) as Line_of_variablesContext[];
	}
	public line_of_variables(i: number): Line_of_variablesContext {
		return this.getTypedRuleContext(Line_of_variablesContext, i) as Line_of_variablesContext;
	}
    public get ruleIndex(): number {
    	return AtCoderInputParser.RULE_multi_line_list_input;
	}
	public enterRule(listener: AtCoderInputListener): void {
	    if(listener.enterMulti_line_list_input) {
	 		listener.enterMulti_line_list_input(this);
		}
	}
	public exitRule(listener: AtCoderInputListener): void {
	    if(listener.exitMulti_line_list_input) {
	 		listener.exitMulti_line_list_input(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AtCoderInputVisitor<Result>): Result {
		if (visitor.visitMulti_line_list_input) {
			return visitor.visitMulti_line_list_input(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Line_of_variablesContext extends ParserRuleContext {
	constructor(parser?: AtCoderInputParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public L_VAR_START_list(): TerminalNode[] {
	    	return this.getTokens(AtCoderInputParser.L_VAR_START);
	}
	public L_VAR_START(i: number): TerminalNode {
		return this.getToken(AtCoderInputParser.L_VAR_START, i);
	}
	public VAR_NAME_INNER_list(): TerminalNode[] {
	    	return this.getTokens(AtCoderInputParser.VAR_NAME_INNER);
	}
	public VAR_NAME_INNER(i: number): TerminalNode {
		return this.getToken(AtCoderInputParser.VAR_NAME_INNER, i);
	}
	public L_VAR_END_list(): TerminalNode[] {
	    	return this.getTokens(AtCoderInputParser.L_VAR_END);
	}
	public L_VAR_END(i: number): TerminalNode {
		return this.getToken(AtCoderInputParser.L_VAR_END, i);
	}
	public SPACE_list(): TerminalNode[] {
	    	return this.getTokens(AtCoderInputParser.SPACE);
	}
	public SPACE(i: number): TerminalNode {
		return this.getToken(AtCoderInputParser.SPACE, i);
	}
    public get ruleIndex(): number {
    	return AtCoderInputParser.RULE_line_of_variables;
	}
	public enterRule(listener: AtCoderInputListener): void {
	    if(listener.enterLine_of_variables) {
	 		listener.enterLine_of_variables(this);
		}
	}
	public exitRule(listener: AtCoderInputListener): void {
	    if(listener.exitLine_of_variables) {
	 		listener.exitLine_of_variables(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AtCoderInputVisitor<Result>): Result {
		if (visitor.visitLine_of_variables) {
			return visitor.visitLine_of_variables(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Query_top_level_inputContext extends ParserRuleContext {
	constructor(parser?: AtCoderInputParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public L_VAR_START(): TerminalNode {
		return this.getToken(AtCoderInputParser.L_VAR_START, 0);
	}
	public L_VDOTS(): TerminalNode {
		return this.getToken(AtCoderInputParser.L_VDOTS, 0);
	}
	public L_VAR_END(): TerminalNode {
		return this.getToken(AtCoderInputParser.L_VAR_END, 0);
	}
	public NEWLINE_list(): TerminalNode[] {
	    	return this.getTokens(AtCoderInputParser.NEWLINE);
	}
	public NEWLINE(i: number): TerminalNode {
		return this.getToken(AtCoderInputParser.NEWLINE, i);
	}
	public simple_variable_line(): Simple_variable_lineContext {
		return this.getTypedRuleContext(Simple_variable_lineContext, 0) as Simple_variable_lineContext;
	}
	public query_placeholder_line_list(): Query_placeholder_lineContext[] {
		return this.getTypedRuleContexts(Query_placeholder_lineContext) as Query_placeholder_lineContext[];
	}
	public query_placeholder_line(i: number): Query_placeholder_lineContext {
		return this.getTypedRuleContext(Query_placeholder_lineContext, i) as Query_placeholder_lineContext;
	}
	public query_description_block_list(): Query_description_blockContext[] {
		return this.getTypedRuleContexts(Query_description_blockContext) as Query_description_blockContext[];
	}
	public query_description_block(i: number): Query_description_blockContext {
		return this.getTypedRuleContext(Query_description_blockContext, i) as Query_description_blockContext;
	}
    public get ruleIndex(): number {
    	return AtCoderInputParser.RULE_query_top_level_input;
	}
	public enterRule(listener: AtCoderInputListener): void {
	    if(listener.enterQuery_top_level_input) {
	 		listener.enterQuery_top_level_input(this);
		}
	}
	public exitRule(listener: AtCoderInputListener): void {
	    if(listener.exitQuery_top_level_input) {
	 		listener.exitQuery_top_level_input(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AtCoderInputVisitor<Result>): Result {
		if (visitor.visitQuery_top_level_input) {
			return visitor.visitQuery_top_level_input(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Query_placeholder_lineContext extends ParserRuleContext {
	constructor(parser?: AtCoderInputParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public L_VAR_START(): TerminalNode {
		return this.getToken(AtCoderInputParser.L_VAR_START, 0);
	}
	public NUMBER(): TerminalNode {
		return this.getToken(AtCoderInputParser.NUMBER, 0);
	}
	public L_VAR_END(): TerminalNode {
		return this.getToken(AtCoderInputParser.L_VAR_END, 0);
	}
	public L_MATH_QUERY(): TerminalNode {
		return this.getToken(AtCoderInputParser.L_MATH_QUERY, 0);
	}
	public L_RM_QUERY(): TerminalNode {
		return this.getToken(AtCoderInputParser.L_RM_QUERY, 0);
	}
    public get ruleIndex(): number {
    	return AtCoderInputParser.RULE_query_placeholder_line;
	}
	public enterRule(listener: AtCoderInputListener): void {
	    if(listener.enterQuery_placeholder_line) {
	 		listener.enterQuery_placeholder_line(this);
		}
	}
	public exitRule(listener: AtCoderInputListener): void {
	    if(listener.exitQuery_placeholder_line) {
	 		listener.exitQuery_placeholder_line(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AtCoderInputVisitor<Result>): Result {
		if (visitor.visitQuery_placeholder_line) {
			return visitor.visitQuery_placeholder_line(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Query_description_blockContext extends ParserRuleContext {
	constructor(parser?: AtCoderInputParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public query_description_text(): Query_description_textContext {
		return this.getTypedRuleContext(Query_description_textContext, 0) as Query_description_textContext;
	}
	public NEWLINE(): TerminalNode {
		return this.getToken(AtCoderInputParser.NEWLINE, 0);
	}
	public query_type_pre_content_list(): Query_type_pre_contentContext[] {
		return this.getTypedRuleContexts(Query_type_pre_contentContext) as Query_type_pre_contentContext[];
	}
	public query_type_pre_content(i: number): Query_type_pre_contentContext {
		return this.getTypedRuleContext(Query_type_pre_contentContext, i) as Query_type_pre_contentContext;
	}
    public get ruleIndex(): number {
    	return AtCoderInputParser.RULE_query_description_block;
	}
	public enterRule(listener: AtCoderInputListener): void {
	    if(listener.enterQuery_description_block) {
	 		listener.enterQuery_description_block(this);
		}
	}
	public exitRule(listener: AtCoderInputListener): void {
	    if(listener.exitQuery_description_block) {
	 		listener.exitQuery_description_block(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AtCoderInputVisitor<Result>): Result {
		if (visitor.visitQuery_description_block) {
			return visitor.visitQuery_description_block(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Query_description_textContext extends ParserRuleContext {
	constructor(parser?: AtCoderInputParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public KW_PERIOD(): TerminalNode {
		return this.getToken(AtCoderInputParser.KW_PERIOD, 0);
	}
	public TEXT_CONTENT_list(): TerminalNode[] {
	    	return this.getTokens(AtCoderInputParser.TEXT_CONTENT);
	}
	public TEXT_CONTENT(i: number): TerminalNode {
		return this.getToken(AtCoderInputParser.TEXT_CONTENT, i);
	}
	public L_VAR_START_list(): TerminalNode[] {
	    	return this.getTokens(AtCoderInputParser.L_VAR_START);
	}
	public L_VAR_START(i: number): TerminalNode {
		return this.getToken(AtCoderInputParser.L_VAR_START, i);
	}
	public VAR_NAME_INNER_list(): TerminalNode[] {
	    	return this.getTokens(AtCoderInputParser.VAR_NAME_INNER);
	}
	public VAR_NAME_INNER(i: number): TerminalNode {
		return this.getToken(AtCoderInputParser.VAR_NAME_INNER, i);
	}
	public L_VAR_END_list(): TerminalNode[] {
	    	return this.getTokens(AtCoderInputParser.L_VAR_END);
	}
	public L_VAR_END(i: number): TerminalNode {
		return this.getToken(AtCoderInputParser.L_VAR_END, i);
	}
	public NUMBER_list(): TerminalNode[] {
	    	return this.getTokens(AtCoderInputParser.NUMBER);
	}
	public NUMBER(i: number): TerminalNode {
		return this.getToken(AtCoderInputParser.NUMBER, i);
	}
	public KW_QUERY_TYPE_INDICATOR_list(): TerminalNode[] {
	    	return this.getTokens(AtCoderInputParser.KW_QUERY_TYPE_INDICATOR);
	}
	public KW_QUERY_TYPE_INDICATOR(i: number): TerminalNode {
		return this.getToken(AtCoderInputParser.KW_QUERY_TYPE_INDICATOR, i);
	}
    public get ruleIndex(): number {
    	return AtCoderInputParser.RULE_query_description_text;
	}
	public enterRule(listener: AtCoderInputListener): void {
	    if(listener.enterQuery_description_text) {
	 		listener.enterQuery_description_text(this);
		}
	}
	public exitRule(listener: AtCoderInputListener): void {
	    if(listener.exitQuery_description_text) {
	 		listener.exitQuery_description_text(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AtCoderInputVisitor<Result>): Result {
		if (visitor.visitQuery_description_text) {
			return visitor.visitQuery_description_text(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Query_type_pre_contentContext extends ParserRuleContext {
	constructor(parser?: AtCoderInputParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public L_VAR_START_list(): TerminalNode[] {
	    	return this.getTokens(AtCoderInputParser.L_VAR_START);
	}
	public L_VAR_START(i: number): TerminalNode {
		return this.getToken(AtCoderInputParser.L_VAR_START, i);
	}
	public query_type_id(): Query_type_idContext {
		return this.getTypedRuleContext(Query_type_idContext, 0) as Query_type_idContext;
	}
	public L_VAR_END_list(): TerminalNode[] {
	    	return this.getTokens(AtCoderInputParser.L_VAR_END);
	}
	public L_VAR_END(i: number): TerminalNode {
		return this.getToken(AtCoderInputParser.L_VAR_END, i);
	}
	public NEWLINE(): TerminalNode {
		return this.getToken(AtCoderInputParser.NEWLINE, 0);
	}
	public SPACE_list(): TerminalNode[] {
	    	return this.getTokens(AtCoderInputParser.SPACE);
	}
	public SPACE(i: number): TerminalNode {
		return this.getToken(AtCoderInputParser.SPACE, i);
	}
	public VAR_NAME_INNER_list(): TerminalNode[] {
	    	return this.getTokens(AtCoderInputParser.VAR_NAME_INNER);
	}
	public VAR_NAME_INNER(i: number): TerminalNode {
		return this.getToken(AtCoderInputParser.VAR_NAME_INNER, i);
	}
    public get ruleIndex(): number {
    	return AtCoderInputParser.RULE_query_type_pre_content;
	}
	public enterRule(listener: AtCoderInputListener): void {
	    if(listener.enterQuery_type_pre_content) {
	 		listener.enterQuery_type_pre_content(this);
		}
	}
	public exitRule(listener: AtCoderInputListener): void {
	    if(listener.exitQuery_type_pre_content) {
	 		listener.exitQuery_type_pre_content(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AtCoderInputVisitor<Result>): Result {
		if (visitor.visitQuery_type_pre_content) {
			return visitor.visitQuery_type_pre_content(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Query_type_idContext extends ParserRuleContext {
	constructor(parser?: AtCoderInputParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public NUMBER(): TerminalNode {
		return this.getToken(AtCoderInputParser.NUMBER, 0);
	}
	public VAR_NAME_INNER(): TerminalNode {
		return this.getToken(AtCoderInputParser.VAR_NAME_INNER, 0);
	}
    public get ruleIndex(): number {
    	return AtCoderInputParser.RULE_query_type_id;
	}
	public enterRule(listener: AtCoderInputListener): void {
	    if(listener.enterQuery_type_id) {
	 		listener.enterQuery_type_id(this);
		}
	}
	public exitRule(listener: AtCoderInputListener): void {
	    if(listener.exitQuery_type_id) {
	 		listener.exitQuery_type_id(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AtCoderInputVisitor<Result>): Result {
		if (visitor.visitQuery_type_id) {
			return visitor.visitQuery_type_id(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
