// Generated from /home/etomunsama/vscode-extensions/atcoder-utility/src/AtCoderInput.g4 by ANTLR 4.13.1
import org.antlr.v4.runtime.atn.*;
import org.antlr.v4.runtime.dfa.DFA;
import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.misc.*;
import org.antlr.v4.runtime.tree.*;
import java.util.List;
import java.util.Iterator;
import java.util.ArrayList;

@SuppressWarnings({"all", "warnings", "unchecked", "unused", "cast", "CheckReturnValue"})
public class AtCoderInputParser extends Parser {
	static { RuntimeMetaData.checkVersion("4.13.1", RuntimeMetaData.VERSION); }

	protected static final DFA[] _decisionToDFA;
	protected static final PredictionContextCache _sharedContextCache =
		new PredictionContextCache();
	public static final int
		L_VAR_START=1, L_VAR_END=2, VAR_NAME_INNER=3, NUMBER=4, L_DOTS=5, L_VDOTS=6, 
		L_MATH_CASE=7, L_MATH_QUERY=8, L_RM_QUERY=9, NEWLINE=10, SPACE=11, TAB=12, 
		KW_QUERY_TYPE_INDICATOR=13, TEXT_CONTENT=14, KW_PERIOD=15;
	public static final int
		RULE_start_rule = 0, RULE_simple_variable_line = 1, RULE_multi_line_single_variable_list = 2, 
		RULE_horizontal_array_input_line = 3, RULE_array_element = 4, RULE_array_dots_suffix = 5, 
		RULE_multi_line_list_input = 6, RULE_line_of_variables = 7, RULE_query_top_level_input = 8, 
		RULE_query_placeholder_line = 9, RULE_query_description_block = 10, RULE_query_description_text = 11, 
		RULE_query_type_pre_content = 12, RULE_query_type_id = 13;
	private static String[] makeRuleNames() {
		return new String[] {
			"start_rule", "simple_variable_line", "multi_line_single_variable_list", 
			"horizontal_array_input_line", "array_element", "array_dots_suffix", 
			"multi_line_list_input", "line_of_variables", "query_top_level_input", 
			"query_placeholder_line", "query_description_block", "query_description_text", 
			"query_type_pre_content", "query_type_id"
		};
	}
	public static final String[] ruleNames = makeRuleNames();

	private static String[] makeLiteralNames() {
		return new String[] {
			null, "'<var>'", "'</var>'", null, null, "'\\\\ldots'", "'\\\\vdots'", 
			"'\\\\mathrm{case}'", "'\\\\mathrm{query}'", "'\\\\rm{Query}'", null, 
			"' '", "'\\t'", null, null, "'\\u3002'"
		};
	}
	private static final String[] _LITERAL_NAMES = makeLiteralNames();
	private static String[] makeSymbolicNames() {
		return new String[] {
			null, "L_VAR_START", "L_VAR_END", "VAR_NAME_INNER", "NUMBER", "L_DOTS", 
			"L_VDOTS", "L_MATH_CASE", "L_MATH_QUERY", "L_RM_QUERY", "NEWLINE", "SPACE", 
			"TAB", "KW_QUERY_TYPE_INDICATOR", "TEXT_CONTENT", "KW_PERIOD"
		};
	}
	private static final String[] _SYMBOLIC_NAMES = makeSymbolicNames();
	public static final Vocabulary VOCABULARY = new VocabularyImpl(_LITERAL_NAMES, _SYMBOLIC_NAMES);

	/**
	 * @deprecated Use {@link #VOCABULARY} instead.
	 */
	@Deprecated
	public static final String[] tokenNames;
	static {
		tokenNames = new String[_SYMBOLIC_NAMES.length];
		for (int i = 0; i < tokenNames.length; i++) {
			tokenNames[i] = VOCABULARY.getLiteralName(i);
			if (tokenNames[i] == null) {
				tokenNames[i] = VOCABULARY.getSymbolicName(i);
			}

			if (tokenNames[i] == null) {
				tokenNames[i] = "<INVALID>";
			}
		}
	}

	@Override
	@Deprecated
	public String[] getTokenNames() {
		return tokenNames;
	}

	@Override

	public Vocabulary getVocabulary() {
		return VOCABULARY;
	}

	@Override
	public String getGrammarFileName() { return "AtCoderInput.g4"; }

	@Override
	public String[] getRuleNames() { return ruleNames; }

	@Override
	public String getSerializedATN() { return _serializedATN; }

	@Override
	public ATN getATN() { return _ATN; }

	public AtCoderInputParser(TokenStream input) {
		super(input);
		_interp = new ParserATNSimulator(this,_ATN,_decisionToDFA,_sharedContextCache);
	}

	@SuppressWarnings("CheckReturnValue")
	public static class Start_ruleContext extends ParserRuleContext {
		public TerminalNode EOF() { return getToken(AtCoderInputParser.EOF, 0); }
		public List<Simple_variable_lineContext> simple_variable_line() {
			return getRuleContexts(Simple_variable_lineContext.class);
		}
		public Simple_variable_lineContext simple_variable_line(int i) {
			return getRuleContext(Simple_variable_lineContext.class,i);
		}
		public List<Multi_line_single_variable_listContext> multi_line_single_variable_list() {
			return getRuleContexts(Multi_line_single_variable_listContext.class);
		}
		public Multi_line_single_variable_listContext multi_line_single_variable_list(int i) {
			return getRuleContext(Multi_line_single_variable_listContext.class,i);
		}
		public List<Horizontal_array_input_lineContext> horizontal_array_input_line() {
			return getRuleContexts(Horizontal_array_input_lineContext.class);
		}
		public Horizontal_array_input_lineContext horizontal_array_input_line(int i) {
			return getRuleContext(Horizontal_array_input_lineContext.class,i);
		}
		public List<Multi_line_list_inputContext> multi_line_list_input() {
			return getRuleContexts(Multi_line_list_inputContext.class);
		}
		public Multi_line_list_inputContext multi_line_list_input(int i) {
			return getRuleContext(Multi_line_list_inputContext.class,i);
		}
		public List<Query_top_level_inputContext> query_top_level_input() {
			return getRuleContexts(Query_top_level_inputContext.class);
		}
		public Query_top_level_inputContext query_top_level_input(int i) {
			return getRuleContext(Query_top_level_inputContext.class,i);
		}
		public Start_ruleContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_start_rule; }
	}

	public final Start_ruleContext start_rule() throws RecognitionException {
		Start_ruleContext _localctx = new Start_ruleContext(_ctx, getState());
		enterRule(_localctx, 0, RULE_start_rule);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(33); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				setState(33);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,0,_ctx) ) {
				case 1:
					{
					setState(28);
					simple_variable_line();
					}
					break;
				case 2:
					{
					setState(29);
					multi_line_single_variable_list();
					}
					break;
				case 3:
					{
					setState(30);
					horizontal_array_input_line();
					}
					break;
				case 4:
					{
					setState(31);
					multi_line_list_input();
					}
					break;
				case 5:
					{
					setState(32);
					query_top_level_input();
					}
					break;
				}
				}
				setState(35); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( _la==L_VAR_START || _la==NEWLINE );
			setState(37);
			match(EOF);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class Simple_variable_lineContext extends ParserRuleContext {
		public TerminalNode NEWLINE() { return getToken(AtCoderInputParser.NEWLINE, 0); }
		public TerminalNode EOF() { return getToken(AtCoderInputParser.EOF, 0); }
		public List<TerminalNode> L_VAR_START() { return getTokens(AtCoderInputParser.L_VAR_START); }
		public TerminalNode L_VAR_START(int i) {
			return getToken(AtCoderInputParser.L_VAR_START, i);
		}
		public List<TerminalNode> VAR_NAME_INNER() { return getTokens(AtCoderInputParser.VAR_NAME_INNER); }
		public TerminalNode VAR_NAME_INNER(int i) {
			return getToken(AtCoderInputParser.VAR_NAME_INNER, i);
		}
		public List<TerminalNode> L_VAR_END() { return getTokens(AtCoderInputParser.L_VAR_END); }
		public TerminalNode L_VAR_END(int i) {
			return getToken(AtCoderInputParser.L_VAR_END, i);
		}
		public List<TerminalNode> SPACE() { return getTokens(AtCoderInputParser.SPACE); }
		public TerminalNode SPACE(int i) {
			return getToken(AtCoderInputParser.SPACE, i);
		}
		public Simple_variable_lineContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_simple_variable_line; }
	}

	public final Simple_variable_lineContext simple_variable_line() throws RecognitionException {
		Simple_variable_lineContext _localctx = new Simple_variable_lineContext(_ctx, getState());
		enterRule(_localctx, 2, RULE_simple_variable_line);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			{
			setState(39);
			match(L_VAR_START);
			setState(40);
			match(VAR_NAME_INNER);
			setState(41);
			match(L_VAR_END);
			setState(48);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==SPACE) {
				{
				{
				setState(42);
				match(SPACE);
				setState(43);
				match(L_VAR_START);
				setState(44);
				match(VAR_NAME_INNER);
				setState(45);
				match(L_VAR_END);
				}
				}
				setState(50);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			}
			setState(51);
			_la = _input.LA(1);
			if ( !(_la==EOF || _la==NEWLINE) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class Multi_line_single_variable_listContext extends ParserRuleContext {
		public List<TerminalNode> L_VAR_START() { return getTokens(AtCoderInputParser.L_VAR_START); }
		public TerminalNode L_VAR_START(int i) {
			return getToken(AtCoderInputParser.L_VAR_START, i);
		}
		public List<TerminalNode> VAR_NAME_INNER() { return getTokens(AtCoderInputParser.VAR_NAME_INNER); }
		public TerminalNode VAR_NAME_INNER(int i) {
			return getToken(AtCoderInputParser.VAR_NAME_INNER, i);
		}
		public List<TerminalNode> L_VAR_END() { return getTokens(AtCoderInputParser.L_VAR_END); }
		public TerminalNode L_VAR_END(int i) {
			return getToken(AtCoderInputParser.L_VAR_END, i);
		}
		public List<TerminalNode> NEWLINE() { return getTokens(AtCoderInputParser.NEWLINE); }
		public TerminalNode NEWLINE(int i) {
			return getToken(AtCoderInputParser.NEWLINE, i);
		}
		public Multi_line_single_variable_listContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_multi_line_single_variable_list; }
	}

	public final Multi_line_single_variable_listContext multi_line_single_variable_list() throws RecognitionException {
		Multi_line_single_variable_listContext _localctx = new Multi_line_single_variable_listContext(_ctx, getState());
		enterRule(_localctx, 4, RULE_multi_line_single_variable_list);
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(57); 
			_errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					setState(53);
					match(L_VAR_START);
					setState(54);
					match(VAR_NAME_INNER);
					setState(55);
					match(L_VAR_END);
					setState(56);
					match(NEWLINE);
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				setState(59); 
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,3,_ctx);
			} while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER );
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class Horizontal_array_input_lineContext extends ParserRuleContext {
		public TerminalNode NEWLINE() { return getToken(AtCoderInputParser.NEWLINE, 0); }
		public List<Array_elementContext> array_element() {
			return getRuleContexts(Array_elementContext.class);
		}
		public Array_elementContext array_element(int i) {
			return getRuleContext(Array_elementContext.class,i);
		}
		public List<TerminalNode> SPACE() { return getTokens(AtCoderInputParser.SPACE); }
		public TerminalNode SPACE(int i) {
			return getToken(AtCoderInputParser.SPACE, i);
		}
		public Array_dots_suffixContext array_dots_suffix() {
			return getRuleContext(Array_dots_suffixContext.class,0);
		}
		public Horizontal_array_input_lineContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_horizontal_array_input_line; }
	}

	public final Horizontal_array_input_lineContext horizontal_array_input_line() throws RecognitionException {
		Horizontal_array_input_lineContext _localctx = new Horizontal_array_input_lineContext(_ctx, getState());
		enterRule(_localctx, 6, RULE_horizontal_array_input_line);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(73);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==L_VAR_START) {
				{
				setState(61);
				array_element();
				setState(66);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,4,_ctx);
				while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
					if ( _alt==1 ) {
						{
						{
						setState(62);
						match(SPACE);
						setState(63);
						array_element();
						}
						} 
					}
					setState(68);
					_errHandler.sync(this);
					_alt = getInterpreter().adaptivePredict(_input,4,_ctx);
				}
				setState(71);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==SPACE) {
					{
					setState(69);
					match(SPACE);
					setState(70);
					array_dots_suffix();
					}
				}

				}
			}

			setState(75);
			match(NEWLINE);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class Array_elementContext extends ParserRuleContext {
		public TerminalNode L_VAR_START() { return getToken(AtCoderInputParser.L_VAR_START, 0); }
		public TerminalNode VAR_NAME_INNER() { return getToken(AtCoderInputParser.VAR_NAME_INNER, 0); }
		public TerminalNode L_VAR_END() { return getToken(AtCoderInputParser.L_VAR_END, 0); }
		public Array_elementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_array_element; }
	}

	public final Array_elementContext array_element() throws RecognitionException {
		Array_elementContext _localctx = new Array_elementContext(_ctx, getState());
		enterRule(_localctx, 8, RULE_array_element);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(77);
			match(L_VAR_START);
			setState(78);
			match(VAR_NAME_INNER);
			setState(79);
			match(L_VAR_END);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class Array_dots_suffixContext extends ParserRuleContext {
		public TerminalNode L_VAR_START() { return getToken(AtCoderInputParser.L_VAR_START, 0); }
		public TerminalNode L_DOTS() { return getToken(AtCoderInputParser.L_DOTS, 0); }
		public TerminalNode L_VAR_END() { return getToken(AtCoderInputParser.L_VAR_END, 0); }
		public TerminalNode SPACE() { return getToken(AtCoderInputParser.SPACE, 0); }
		public Array_elementContext array_element() {
			return getRuleContext(Array_elementContext.class,0);
		}
		public Array_dots_suffixContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_array_dots_suffix; }
	}

	public final Array_dots_suffixContext array_dots_suffix() throws RecognitionException {
		Array_dots_suffixContext _localctx = new Array_dots_suffixContext(_ctx, getState());
		enterRule(_localctx, 10, RULE_array_dots_suffix);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(81);
			match(L_VAR_START);
			setState(82);
			match(L_DOTS);
			setState(83);
			match(L_VAR_END);
			setState(86);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==SPACE) {
				{
				setState(84);
				match(SPACE);
				setState(85);
				array_element();
				}
			}

			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class Multi_line_list_inputContext extends ParserRuleContext {
		public TerminalNode L_VAR_START() { return getToken(AtCoderInputParser.L_VAR_START, 0); }
		public TerminalNode L_VDOTS() { return getToken(AtCoderInputParser.L_VDOTS, 0); }
		public TerminalNode L_VAR_END() { return getToken(AtCoderInputParser.L_VAR_END, 0); }
		public List<TerminalNode> NEWLINE() { return getTokens(AtCoderInputParser.NEWLINE); }
		public TerminalNode NEWLINE(int i) {
			return getToken(AtCoderInputParser.NEWLINE, i);
		}
		public List<Line_of_variablesContext> line_of_variables() {
			return getRuleContexts(Line_of_variablesContext.class);
		}
		public Line_of_variablesContext line_of_variables(int i) {
			return getRuleContext(Line_of_variablesContext.class,i);
		}
		public Multi_line_list_inputContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_multi_line_list_input; }
	}

	public final Multi_line_list_inputContext multi_line_list_input() throws RecognitionException {
		Multi_line_list_inputContext _localctx = new Multi_line_list_inputContext(_ctx, getState());
		enterRule(_localctx, 12, RULE_multi_line_list_input);
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(91); 
			_errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					setState(88);
					line_of_variables();
					setState(89);
					match(NEWLINE);
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				setState(93); 
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,8,_ctx);
			} while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER );
			setState(95);
			match(L_VAR_START);
			setState(96);
			match(L_VDOTS);
			setState(97);
			match(L_VAR_END);
			setState(98);
			match(NEWLINE);
			setState(102);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,9,_ctx) ) {
			case 1:
				{
				setState(99);
				line_of_variables();
				setState(100);
				match(NEWLINE);
				}
				break;
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class Line_of_variablesContext extends ParserRuleContext {
		public List<TerminalNode> L_VAR_START() { return getTokens(AtCoderInputParser.L_VAR_START); }
		public TerminalNode L_VAR_START(int i) {
			return getToken(AtCoderInputParser.L_VAR_START, i);
		}
		public List<TerminalNode> VAR_NAME_INNER() { return getTokens(AtCoderInputParser.VAR_NAME_INNER); }
		public TerminalNode VAR_NAME_INNER(int i) {
			return getToken(AtCoderInputParser.VAR_NAME_INNER, i);
		}
		public List<TerminalNode> L_VAR_END() { return getTokens(AtCoderInputParser.L_VAR_END); }
		public TerminalNode L_VAR_END(int i) {
			return getToken(AtCoderInputParser.L_VAR_END, i);
		}
		public List<TerminalNode> SPACE() { return getTokens(AtCoderInputParser.SPACE); }
		public TerminalNode SPACE(int i) {
			return getToken(AtCoderInputParser.SPACE, i);
		}
		public Line_of_variablesContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_line_of_variables; }
	}

	public final Line_of_variablesContext line_of_variables() throws RecognitionException {
		Line_of_variablesContext _localctx = new Line_of_variablesContext(_ctx, getState());
		enterRule(_localctx, 14, RULE_line_of_variables);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			{
			setState(104);
			match(L_VAR_START);
			setState(105);
			match(VAR_NAME_INNER);
			setState(106);
			match(L_VAR_END);
			setState(113);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==SPACE) {
				{
				{
				setState(107);
				match(SPACE);
				setState(108);
				match(L_VAR_START);
				setState(109);
				match(VAR_NAME_INNER);
				setState(110);
				match(L_VAR_END);
				}
				}
				setState(115);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class Query_top_level_inputContext extends ParserRuleContext {
		public TerminalNode L_VAR_START() { return getToken(AtCoderInputParser.L_VAR_START, 0); }
		public TerminalNode L_VDOTS() { return getToken(AtCoderInputParser.L_VDOTS, 0); }
		public TerminalNode L_VAR_END() { return getToken(AtCoderInputParser.L_VAR_END, 0); }
		public List<TerminalNode> NEWLINE() { return getTokens(AtCoderInputParser.NEWLINE); }
		public TerminalNode NEWLINE(int i) {
			return getToken(AtCoderInputParser.NEWLINE, i);
		}
		public Simple_variable_lineContext simple_variable_line() {
			return getRuleContext(Simple_variable_lineContext.class,0);
		}
		public List<Query_placeholder_lineContext> query_placeholder_line() {
			return getRuleContexts(Query_placeholder_lineContext.class);
		}
		public Query_placeholder_lineContext query_placeholder_line(int i) {
			return getRuleContext(Query_placeholder_lineContext.class,i);
		}
		public List<Query_description_blockContext> query_description_block() {
			return getRuleContexts(Query_description_blockContext.class);
		}
		public Query_description_blockContext query_description_block(int i) {
			return getRuleContext(Query_description_blockContext.class,i);
		}
		public Query_top_level_inputContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_query_top_level_input; }
	}

	public final Query_top_level_inputContext query_top_level_input() throws RecognitionException {
		Query_top_level_inputContext _localctx = new Query_top_level_inputContext(_ctx, getState());
		enterRule(_localctx, 16, RULE_query_top_level_input);
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(117);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,11,_ctx) ) {
			case 1:
				{
				setState(116);
				simple_variable_line();
				}
				break;
			}
			setState(122); 
			_errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					setState(119);
					query_placeholder_line();
					setState(120);
					match(NEWLINE);
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				setState(124); 
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,12,_ctx);
			} while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER );
			setState(126);
			match(L_VAR_START);
			setState(127);
			match(L_VDOTS);
			setState(128);
			match(L_VAR_END);
			setState(129);
			match(NEWLINE);
			setState(133);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,13,_ctx) ) {
			case 1:
				{
				setState(130);
				query_placeholder_line();
				setState(131);
				match(NEWLINE);
				}
				break;
			}
			setState(138);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,14,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(135);
					query_description_block();
					}
					} 
				}
				setState(140);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,14,_ctx);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class Query_placeholder_lineContext extends ParserRuleContext {
		public TerminalNode L_VAR_START() { return getToken(AtCoderInputParser.L_VAR_START, 0); }
		public TerminalNode NUMBER() { return getToken(AtCoderInputParser.NUMBER, 0); }
		public TerminalNode L_VAR_END() { return getToken(AtCoderInputParser.L_VAR_END, 0); }
		public TerminalNode L_MATH_QUERY() { return getToken(AtCoderInputParser.L_MATH_QUERY, 0); }
		public TerminalNode L_RM_QUERY() { return getToken(AtCoderInputParser.L_RM_QUERY, 0); }
		public Query_placeholder_lineContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_query_placeholder_line; }
	}

	public final Query_placeholder_lineContext query_placeholder_line() throws RecognitionException {
		Query_placeholder_lineContext _localctx = new Query_placeholder_lineContext(_ctx, getState());
		enterRule(_localctx, 18, RULE_query_placeholder_line);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(141);
			match(L_VAR_START);
			setState(142);
			_la = _input.LA(1);
			if ( !(_la==L_MATH_QUERY || _la==L_RM_QUERY) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			setState(143);
			match(NUMBER);
			setState(144);
			match(L_VAR_END);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class Query_description_blockContext extends ParserRuleContext {
		public Query_description_textContext query_description_text() {
			return getRuleContext(Query_description_textContext.class,0);
		}
		public TerminalNode NEWLINE() { return getToken(AtCoderInputParser.NEWLINE, 0); }
		public List<Query_type_pre_contentContext> query_type_pre_content() {
			return getRuleContexts(Query_type_pre_contentContext.class);
		}
		public Query_type_pre_contentContext query_type_pre_content(int i) {
			return getRuleContext(Query_type_pre_contentContext.class,i);
		}
		public Query_description_blockContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_query_description_block; }
	}

	public final Query_description_blockContext query_description_block() throws RecognitionException {
		Query_description_blockContext _localctx = new Query_description_blockContext(_ctx, getState());
		enterRule(_localctx, 20, RULE_query_description_block);
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(149);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,15,_ctx) ) {
			case 1:
				{
				setState(146);
				query_description_text();
				setState(147);
				match(NEWLINE);
				}
				break;
			}
			setState(152); 
			_errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					setState(151);
					query_type_pre_content();
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				setState(154); 
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,16,_ctx);
			} while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER );
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class Query_description_textContext extends ParserRuleContext {
		public TerminalNode KW_PERIOD() { return getToken(AtCoderInputParser.KW_PERIOD, 0); }
		public List<TerminalNode> TEXT_CONTENT() { return getTokens(AtCoderInputParser.TEXT_CONTENT); }
		public TerminalNode TEXT_CONTENT(int i) {
			return getToken(AtCoderInputParser.TEXT_CONTENT, i);
		}
		public List<TerminalNode> L_VAR_START() { return getTokens(AtCoderInputParser.L_VAR_START); }
		public TerminalNode L_VAR_START(int i) {
			return getToken(AtCoderInputParser.L_VAR_START, i);
		}
		public List<TerminalNode> VAR_NAME_INNER() { return getTokens(AtCoderInputParser.VAR_NAME_INNER); }
		public TerminalNode VAR_NAME_INNER(int i) {
			return getToken(AtCoderInputParser.VAR_NAME_INNER, i);
		}
		public List<TerminalNode> L_VAR_END() { return getTokens(AtCoderInputParser.L_VAR_END); }
		public TerminalNode L_VAR_END(int i) {
			return getToken(AtCoderInputParser.L_VAR_END, i);
		}
		public List<TerminalNode> NUMBER() { return getTokens(AtCoderInputParser.NUMBER); }
		public TerminalNode NUMBER(int i) {
			return getToken(AtCoderInputParser.NUMBER, i);
		}
		public List<TerminalNode> KW_QUERY_TYPE_INDICATOR() { return getTokens(AtCoderInputParser.KW_QUERY_TYPE_INDICATOR); }
		public TerminalNode KW_QUERY_TYPE_INDICATOR(int i) {
			return getToken(AtCoderInputParser.KW_QUERY_TYPE_INDICATOR, i);
		}
		public Query_description_textContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_query_description_text; }
	}

	public final Query_description_textContext query_description_text() throws RecognitionException {
		Query_description_textContext _localctx = new Query_description_textContext(_ctx, getState());
		enterRule(_localctx, 22, RULE_query_description_text);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(162); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				setState(162);
				_errHandler.sync(this);
				switch (_input.LA(1)) {
				case TEXT_CONTENT:
					{
					setState(156);
					match(TEXT_CONTENT);
					}
					break;
				case L_VAR_START:
					{
					setState(157);
					match(L_VAR_START);
					setState(158);
					match(VAR_NAME_INNER);
					setState(159);
					match(L_VAR_END);
					}
					break;
				case NUMBER:
					{
					setState(160);
					match(NUMBER);
					}
					break;
				case KW_QUERY_TYPE_INDICATOR:
					{
					setState(161);
					match(KW_QUERY_TYPE_INDICATOR);
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				setState(164); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( (((_la) & ~0x3f) == 0 && ((1L << _la) & 24594L) != 0) );
			setState(166);
			match(KW_PERIOD);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class Query_type_pre_contentContext extends ParserRuleContext {
		public List<TerminalNode> L_VAR_START() { return getTokens(AtCoderInputParser.L_VAR_START); }
		public TerminalNode L_VAR_START(int i) {
			return getToken(AtCoderInputParser.L_VAR_START, i);
		}
		public Query_type_idContext query_type_id() {
			return getRuleContext(Query_type_idContext.class,0);
		}
		public List<TerminalNode> L_VAR_END() { return getTokens(AtCoderInputParser.L_VAR_END); }
		public TerminalNode L_VAR_END(int i) {
			return getToken(AtCoderInputParser.L_VAR_END, i);
		}
		public TerminalNode NEWLINE() { return getToken(AtCoderInputParser.NEWLINE, 0); }
		public List<TerminalNode> SPACE() { return getTokens(AtCoderInputParser.SPACE); }
		public TerminalNode SPACE(int i) {
			return getToken(AtCoderInputParser.SPACE, i);
		}
		public List<TerminalNode> VAR_NAME_INNER() { return getTokens(AtCoderInputParser.VAR_NAME_INNER); }
		public TerminalNode VAR_NAME_INNER(int i) {
			return getToken(AtCoderInputParser.VAR_NAME_INNER, i);
		}
		public Query_type_pre_contentContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_query_type_pre_content; }
	}

	public final Query_type_pre_contentContext query_type_pre_content() throws RecognitionException {
		Query_type_pre_contentContext _localctx = new Query_type_pre_contentContext(_ctx, getState());
		enterRule(_localctx, 24, RULE_query_type_pre_content);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(168);
			match(L_VAR_START);
			setState(169);
			query_type_id();
			setState(170);
			match(L_VAR_END);
			setState(177);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==SPACE) {
				{
				{
				setState(171);
				match(SPACE);
				setState(172);
				match(L_VAR_START);
				setState(173);
				match(VAR_NAME_INNER);
				setState(174);
				match(L_VAR_END);
				}
				}
				setState(179);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(180);
			match(NEWLINE);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class Query_type_idContext extends ParserRuleContext {
		public TerminalNode NUMBER() { return getToken(AtCoderInputParser.NUMBER, 0); }
		public TerminalNode VAR_NAME_INNER() { return getToken(AtCoderInputParser.VAR_NAME_INNER, 0); }
		public Query_type_idContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_query_type_id; }
	}

	public final Query_type_idContext query_type_id() throws RecognitionException {
		Query_type_idContext _localctx = new Query_type_idContext(_ctx, getState());
		enterRule(_localctx, 26, RULE_query_type_id);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(182);
			_la = _input.LA(1);
			if ( !(_la==VAR_NAME_INNER || _la==NUMBER) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static final String _serializedATN =
		"\u0004\u0001\u000f\u00b9\u0002\u0000\u0007\u0000\u0002\u0001\u0007\u0001"+
		"\u0002\u0002\u0007\u0002\u0002\u0003\u0007\u0003\u0002\u0004\u0007\u0004"+
		"\u0002\u0005\u0007\u0005\u0002\u0006\u0007\u0006\u0002\u0007\u0007\u0007"+
		"\u0002\b\u0007\b\u0002\t\u0007\t\u0002\n\u0007\n\u0002\u000b\u0007\u000b"+
		"\u0002\f\u0007\f\u0002\r\u0007\r\u0001\u0000\u0001\u0000\u0001\u0000\u0001"+
		"\u0000\u0001\u0000\u0004\u0000\"\b\u0000\u000b\u0000\f\u0000#\u0001\u0000"+
		"\u0001\u0000\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001"+
		"\u0001\u0001\u0001\u0001\u0005\u0001/\b\u0001\n\u0001\f\u00012\t\u0001"+
		"\u0001\u0001\u0001\u0001\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002"+
		"\u0004\u0002:\b\u0002\u000b\u0002\f\u0002;\u0001\u0003\u0001\u0003\u0001"+
		"\u0003\u0005\u0003A\b\u0003\n\u0003\f\u0003D\t\u0003\u0001\u0003\u0001"+
		"\u0003\u0003\u0003H\b\u0003\u0003\u0003J\b\u0003\u0001\u0003\u0001\u0003"+
		"\u0001\u0004\u0001\u0004\u0001\u0004\u0001\u0004\u0001\u0005\u0001\u0005"+
		"\u0001\u0005\u0001\u0005\u0001\u0005\u0003\u0005W\b\u0005\u0001\u0006"+
		"\u0001\u0006\u0001\u0006\u0004\u0006\\\b\u0006\u000b\u0006\f\u0006]\u0001"+
		"\u0006\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006\u0001"+
		"\u0006\u0003\u0006g\b\u0006\u0001\u0007\u0001\u0007\u0001\u0007\u0001"+
		"\u0007\u0001\u0007\u0001\u0007\u0001\u0007\u0005\u0007p\b\u0007\n\u0007"+
		"\f\u0007s\t\u0007\u0001\b\u0003\bv\b\b\u0001\b\u0001\b\u0001\b\u0004\b"+
		"{\b\b\u000b\b\f\b|\u0001\b\u0001\b\u0001\b\u0001\b\u0001\b\u0001\b\u0001"+
		"\b\u0003\b\u0086\b\b\u0001\b\u0005\b\u0089\b\b\n\b\f\b\u008c\t\b\u0001"+
		"\t\u0001\t\u0001\t\u0001\t\u0001\t\u0001\n\u0001\n\u0001\n\u0003\n\u0096"+
		"\b\n\u0001\n\u0004\n\u0099\b\n\u000b\n\f\n\u009a\u0001\u000b\u0001\u000b"+
		"\u0001\u000b\u0001\u000b\u0001\u000b\u0001\u000b\u0004\u000b\u00a3\b\u000b"+
		"\u000b\u000b\f\u000b\u00a4\u0001\u000b\u0001\u000b\u0001\f\u0001\f\u0001"+
		"\f\u0001\f\u0001\f\u0001\f\u0001\f\u0005\f\u00b0\b\f\n\f\f\f\u00b3\t\f"+
		"\u0001\f\u0001\f\u0001\r\u0001\r\u0001\r\u0000\u0000\u000e\u0000\u0002"+
		"\u0004\u0006\b\n\f\u000e\u0010\u0012\u0014\u0016\u0018\u001a\u0000\u0003"+
		"\u0001\u0001\n\n\u0001\u0000\b\t\u0001\u0000\u0003\u0004\u00c3\u0000!"+
		"\u0001\u0000\u0000\u0000\u0002\'\u0001\u0000\u0000\u0000\u00049\u0001"+
		"\u0000\u0000\u0000\u0006I\u0001\u0000\u0000\u0000\bM\u0001\u0000\u0000"+
		"\u0000\nQ\u0001\u0000\u0000\u0000\f[\u0001\u0000\u0000\u0000\u000eh\u0001"+
		"\u0000\u0000\u0000\u0010u\u0001\u0000\u0000\u0000\u0012\u008d\u0001\u0000"+
		"\u0000\u0000\u0014\u0095\u0001\u0000\u0000\u0000\u0016\u00a2\u0001\u0000"+
		"\u0000\u0000\u0018\u00a8\u0001\u0000\u0000\u0000\u001a\u00b6\u0001\u0000"+
		"\u0000\u0000\u001c\"\u0003\u0002\u0001\u0000\u001d\"\u0003\u0004\u0002"+
		"\u0000\u001e\"\u0003\u0006\u0003\u0000\u001f\"\u0003\f\u0006\u0000 \""+
		"\u0003\u0010\b\u0000!\u001c\u0001\u0000\u0000\u0000!\u001d\u0001\u0000"+
		"\u0000\u0000!\u001e\u0001\u0000\u0000\u0000!\u001f\u0001\u0000\u0000\u0000"+
		"! \u0001\u0000\u0000\u0000\"#\u0001\u0000\u0000\u0000#!\u0001\u0000\u0000"+
		"\u0000#$\u0001\u0000\u0000\u0000$%\u0001\u0000\u0000\u0000%&\u0005\u0000"+
		"\u0000\u0001&\u0001\u0001\u0000\u0000\u0000\'(\u0005\u0001\u0000\u0000"+
		"()\u0005\u0003\u0000\u0000)0\u0005\u0002\u0000\u0000*+\u0005\u000b\u0000"+
		"\u0000+,\u0005\u0001\u0000\u0000,-\u0005\u0003\u0000\u0000-/\u0005\u0002"+
		"\u0000\u0000.*\u0001\u0000\u0000\u0000/2\u0001\u0000\u0000\u00000.\u0001"+
		"\u0000\u0000\u000001\u0001\u0000\u0000\u000013\u0001\u0000\u0000\u0000"+
		"20\u0001\u0000\u0000\u000034\u0007\u0000\u0000\u00004\u0003\u0001\u0000"+
		"\u0000\u000056\u0005\u0001\u0000\u000067\u0005\u0003\u0000\u000078\u0005"+
		"\u0002\u0000\u00008:\u0005\n\u0000\u000095\u0001\u0000\u0000\u0000:;\u0001"+
		"\u0000\u0000\u0000;9\u0001\u0000\u0000\u0000;<\u0001\u0000\u0000\u0000"+
		"<\u0005\u0001\u0000\u0000\u0000=B\u0003\b\u0004\u0000>?\u0005\u000b\u0000"+
		"\u0000?A\u0003\b\u0004\u0000@>\u0001\u0000\u0000\u0000AD\u0001\u0000\u0000"+
		"\u0000B@\u0001\u0000\u0000\u0000BC\u0001\u0000\u0000\u0000CG\u0001\u0000"+
		"\u0000\u0000DB\u0001\u0000\u0000\u0000EF\u0005\u000b\u0000\u0000FH\u0003"+
		"\n\u0005\u0000GE\u0001\u0000\u0000\u0000GH\u0001\u0000\u0000\u0000HJ\u0001"+
		"\u0000\u0000\u0000I=\u0001\u0000\u0000\u0000IJ\u0001\u0000\u0000\u0000"+
		"JK\u0001\u0000\u0000\u0000KL\u0005\n\u0000\u0000L\u0007\u0001\u0000\u0000"+
		"\u0000MN\u0005\u0001\u0000\u0000NO\u0005\u0003\u0000\u0000OP\u0005\u0002"+
		"\u0000\u0000P\t\u0001\u0000\u0000\u0000QR\u0005\u0001\u0000\u0000RS\u0005"+
		"\u0005\u0000\u0000SV\u0005\u0002\u0000\u0000TU\u0005\u000b\u0000\u0000"+
		"UW\u0003\b\u0004\u0000VT\u0001\u0000\u0000\u0000VW\u0001\u0000\u0000\u0000"+
		"W\u000b\u0001\u0000\u0000\u0000XY\u0003\u000e\u0007\u0000YZ\u0005\n\u0000"+
		"\u0000Z\\\u0001\u0000\u0000\u0000[X\u0001\u0000\u0000\u0000\\]\u0001\u0000"+
		"\u0000\u0000][\u0001\u0000\u0000\u0000]^\u0001\u0000\u0000\u0000^_\u0001"+
		"\u0000\u0000\u0000_`\u0005\u0001\u0000\u0000`a\u0005\u0006\u0000\u0000"+
		"ab\u0005\u0002\u0000\u0000bf\u0005\n\u0000\u0000cd\u0003\u000e\u0007\u0000"+
		"de\u0005\n\u0000\u0000eg\u0001\u0000\u0000\u0000fc\u0001\u0000\u0000\u0000"+
		"fg\u0001\u0000\u0000\u0000g\r\u0001\u0000\u0000\u0000hi\u0005\u0001\u0000"+
		"\u0000ij\u0005\u0003\u0000\u0000jq\u0005\u0002\u0000\u0000kl\u0005\u000b"+
		"\u0000\u0000lm\u0005\u0001\u0000\u0000mn\u0005\u0003\u0000\u0000np\u0005"+
		"\u0002\u0000\u0000ok\u0001\u0000\u0000\u0000ps\u0001\u0000\u0000\u0000"+
		"qo\u0001\u0000\u0000\u0000qr\u0001\u0000\u0000\u0000r\u000f\u0001\u0000"+
		"\u0000\u0000sq\u0001\u0000\u0000\u0000tv\u0003\u0002\u0001\u0000ut\u0001"+
		"\u0000\u0000\u0000uv\u0001\u0000\u0000\u0000vz\u0001\u0000\u0000\u0000"+
		"wx\u0003\u0012\t\u0000xy\u0005\n\u0000\u0000y{\u0001\u0000\u0000\u0000"+
		"zw\u0001\u0000\u0000\u0000{|\u0001\u0000\u0000\u0000|z\u0001\u0000\u0000"+
		"\u0000|}\u0001\u0000\u0000\u0000}~\u0001\u0000\u0000\u0000~\u007f\u0005"+
		"\u0001\u0000\u0000\u007f\u0080\u0005\u0006\u0000\u0000\u0080\u0081\u0005"+
		"\u0002\u0000\u0000\u0081\u0085\u0005\n\u0000\u0000\u0082\u0083\u0003\u0012"+
		"\t\u0000\u0083\u0084\u0005\n\u0000\u0000\u0084\u0086\u0001\u0000\u0000"+
		"\u0000\u0085\u0082\u0001\u0000\u0000\u0000\u0085\u0086\u0001\u0000\u0000"+
		"\u0000\u0086\u008a\u0001\u0000\u0000\u0000\u0087\u0089\u0003\u0014\n\u0000"+
		"\u0088\u0087\u0001\u0000\u0000\u0000\u0089\u008c\u0001\u0000\u0000\u0000"+
		"\u008a\u0088\u0001\u0000\u0000\u0000\u008a\u008b\u0001\u0000\u0000\u0000"+
		"\u008b\u0011\u0001\u0000\u0000\u0000\u008c\u008a\u0001\u0000\u0000\u0000"+
		"\u008d\u008e\u0005\u0001\u0000\u0000\u008e\u008f\u0007\u0001\u0000\u0000"+
		"\u008f\u0090\u0005\u0004\u0000\u0000\u0090\u0091\u0005\u0002\u0000\u0000"+
		"\u0091\u0013\u0001\u0000\u0000\u0000\u0092\u0093\u0003\u0016\u000b\u0000"+
		"\u0093\u0094\u0005\n\u0000\u0000\u0094\u0096\u0001\u0000\u0000\u0000\u0095"+
		"\u0092\u0001\u0000\u0000\u0000\u0095\u0096\u0001\u0000\u0000\u0000\u0096"+
		"\u0098\u0001\u0000\u0000\u0000\u0097\u0099\u0003\u0018\f\u0000\u0098\u0097"+
		"\u0001\u0000\u0000\u0000\u0099\u009a\u0001\u0000\u0000\u0000\u009a\u0098"+
		"\u0001\u0000\u0000\u0000\u009a\u009b\u0001\u0000\u0000\u0000\u009b\u0015"+
		"\u0001\u0000\u0000\u0000\u009c\u00a3\u0005\u000e\u0000\u0000\u009d\u009e"+
		"\u0005\u0001\u0000\u0000\u009e\u009f\u0005\u0003\u0000\u0000\u009f\u00a3"+
		"\u0005\u0002\u0000\u0000\u00a0\u00a3\u0005\u0004\u0000\u0000\u00a1\u00a3"+
		"\u0005\r\u0000\u0000\u00a2\u009c\u0001\u0000\u0000\u0000\u00a2\u009d\u0001"+
		"\u0000\u0000\u0000\u00a2\u00a0\u0001\u0000\u0000\u0000\u00a2\u00a1\u0001"+
		"\u0000\u0000\u0000\u00a3\u00a4\u0001\u0000\u0000\u0000\u00a4\u00a2\u0001"+
		"\u0000\u0000\u0000\u00a4\u00a5\u0001\u0000\u0000\u0000\u00a5\u00a6\u0001"+
		"\u0000\u0000\u0000\u00a6\u00a7\u0005\u000f\u0000\u0000\u00a7\u0017\u0001"+
		"\u0000\u0000\u0000\u00a8\u00a9\u0005\u0001\u0000\u0000\u00a9\u00aa\u0003"+
		"\u001a\r\u0000\u00aa\u00b1\u0005\u0002\u0000\u0000\u00ab\u00ac\u0005\u000b"+
		"\u0000\u0000\u00ac\u00ad\u0005\u0001\u0000\u0000\u00ad\u00ae\u0005\u0003"+
		"\u0000\u0000\u00ae\u00b0\u0005\u0002\u0000\u0000\u00af\u00ab\u0001\u0000"+
		"\u0000\u0000\u00b0\u00b3\u0001\u0000\u0000\u0000\u00b1\u00af\u0001\u0000"+
		"\u0000\u0000\u00b1\u00b2\u0001\u0000\u0000\u0000\u00b2\u00b4\u0001\u0000"+
		"\u0000\u0000\u00b3\u00b1\u0001\u0000\u0000\u0000\u00b4\u00b5\u0005\n\u0000"+
		"\u0000\u00b5\u0019\u0001\u0000\u0000\u0000\u00b6\u00b7\u0007\u0002\u0000"+
		"\u0000\u00b7\u001b\u0001\u0000\u0000\u0000\u0014!#0;BGIV]fqu|\u0085\u008a"+
		"\u0095\u009a\u00a2\u00a4\u00b1";
	public static final ATN _ATN =
		new ATNDeserializer().deserialize(_serializedATN.toCharArray());
	static {
		_decisionToDFA = new DFA[_ATN.getNumberOfDecisions()];
		for (int i = 0; i < _ATN.getNumberOfDecisions(); i++) {
			_decisionToDFA[i] = new DFA(_ATN.getDecisionState(i), i);
		}
	}
}