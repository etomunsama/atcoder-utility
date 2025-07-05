// Generated from /home/etomunsama/vscode-extensions/atcoder-utility/src/AtCoderInput.g4 by ANTLR 4.13.1
import org.antlr.v4.runtime.Lexer;
import org.antlr.v4.runtime.CharStream;
import org.antlr.v4.runtime.Token;
import org.antlr.v4.runtime.TokenStream;
import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.atn.*;
import org.antlr.v4.runtime.dfa.DFA;
import org.antlr.v4.runtime.misc.*;

@SuppressWarnings({"all", "warnings", "unchecked", "unused", "cast", "CheckReturnValue", "this-escape"})
public class AtCoderInputLexer extends Lexer {
	static { RuntimeMetaData.checkVersion("4.13.1", RuntimeMetaData.VERSION); }

	protected static final DFA[] _decisionToDFA;
	protected static final PredictionContextCache _sharedContextCache =
		new PredictionContextCache();
	public static final int
		L_VAR_START=1, L_VAR_END=2, VAR_NAME_INNER=3, NUMBER=4, L_DOTS=5, L_VDOTS=6, 
		L_MATH_CASE=7, L_MATH_QUERY=8, L_RM_QUERY=9, NEWLINE=10, SPACE=11, TAB=12, 
		KW_QUERY_TYPE_INDICATOR=13, TEXT_CONTENT=14, KW_PERIOD=15;
	public static String[] channelNames = {
		"DEFAULT_TOKEN_CHANNEL", "HIDDEN"
	};

	public static String[] modeNames = {
		"DEFAULT_MODE"
	};

	private static String[] makeRuleNames() {
		return new String[] {
			"L_VAR_START", "L_VAR_END", "VAR_NAME_INNER", "NUMBER", "L_DOTS", "L_VDOTS", 
			"L_MATH_CASE", "L_MATH_QUERY", "L_RM_QUERY", "NEWLINE", "SPACE", "TAB", 
			"KW_QUERY_TYPE_INDICATOR", "TEXT_CONTENT", "KW_PERIOD"
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


	public AtCoderInputLexer(CharStream input) {
		super(input);
		_interp = new LexerATNSimulator(this,_ATN,_decisionToDFA,_sharedContextCache);
	}

	@Override
	public String getGrammarFileName() { return "AtCoderInput.g4"; }

	@Override
	public String[] getRuleNames() { return ruleNames; }

	@Override
	public String getSerializedATN() { return _serializedATN; }

	@Override
	public String[] getChannelNames() { return channelNames; }

	@Override
	public String[] getModeNames() { return modeNames; }

	@Override
	public ATN getATN() { return _ATN; }

	public static final String _serializedATN =
		"\u0004\u0000\u000f\u00a6\u0006\uffff\uffff\u0002\u0000\u0007\u0000\u0002"+
		"\u0001\u0007\u0001\u0002\u0002\u0007\u0002\u0002\u0003\u0007\u0003\u0002"+
		"\u0004\u0007\u0004\u0002\u0005\u0007\u0005\u0002\u0006\u0007\u0006\u0002"+
		"\u0007\u0007\u0007\u0002\b\u0007\b\u0002\t\u0007\t\u0002\n\u0007\n\u0002"+
		"\u000b\u0007\u000b\u0002\f\u0007\f\u0002\r\u0007\r\u0002\u000e\u0007\u000e"+
		"\u0001\u0000\u0001\u0000\u0001\u0000\u0001\u0000\u0001\u0000\u0001\u0000"+
		"\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001"+
		"\u0001\u0001\u0001\u0002\u0001\u0002\u0003\u0002/\b\u0002\u0001\u0002"+
		"\u0005\u00022\b\u0002\n\u0002\f\u00025\t\u0002\u0001\u0003\u0004\u0003"+
		"8\b\u0003\u000b\u0003\f\u00039\u0001\u0004\u0001\u0004\u0001\u0004\u0001"+
		"\u0004\u0001\u0004\u0001\u0004\u0001\u0004\u0001\u0004\u0001\u0005\u0001"+
		"\u0005\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005\u0001"+
		"\u0005\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006\u0001"+
		"\u0006\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006\u0001"+
		"\u0006\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0007\u0001\u0007\u0001"+
		"\u0007\u0001\u0007\u0001\u0007\u0001\u0007\u0001\u0007\u0001\u0007\u0001"+
		"\u0007\u0001\u0007\u0001\u0007\u0001\u0007\u0001\u0007\u0001\u0007\u0001"+
		"\u0007\u0001\u0007\u0001\b\u0001\b\u0001\b\u0001\b\u0001\b\u0001\b\u0001"+
		"\b\u0001\b\u0001\b\u0001\b\u0001\b\u0001\b\u0001\t\u0003\tx\b\t\u0001"+
		"\t\u0001\t\u0001\n\u0001\n\u0001\u000b\u0001\u000b\u0001\u000b\u0001\u000b"+
		"\u0001\f\u0001\f\u0001\f\u0001\f\u0001\f\u0001\f\u0001\f\u0001\f\u0001"+
		"\f\u0001\f\u0001\f\u0001\f\u0001\f\u0001\f\u0001\f\u0001\f\u0001\f\u0001"+
		"\f\u0001\f\u0001\f\u0001\f\u0001\f\u0001\f\u0001\f\u0001\f\u0001\f\u0001"+
		"\f\u0001\f\u0003\f\u009e\b\f\u0001\r\u0004\r\u00a1\b\r\u000b\r\f\r\u00a2"+
		"\u0001\u000e\u0001\u000e\u0000\u0000\u000f\u0001\u0001\u0003\u0002\u0005"+
		"\u0003\u0007\u0004\t\u0005\u000b\u0006\r\u0007\u000f\b\u0011\t\u0013\n"+
		"\u0015\u000b\u0017\f\u0019\r\u001b\u000e\u001d\u000f\u0001\u0000\u0004"+
		"\u0002\u0000AZaz\u0003\u000009AZaz\u0001\u000009\u0003\u0000\n\n\r\r<"+
		"<\u00af\u0000\u0001\u0001\u0000\u0000\u0000\u0000\u0003\u0001\u0000\u0000"+
		"\u0000\u0000\u0005\u0001\u0000\u0000\u0000\u0000\u0007\u0001\u0000\u0000"+
		"\u0000\u0000\t\u0001\u0000\u0000\u0000\u0000\u000b\u0001\u0000\u0000\u0000"+
		"\u0000\r\u0001\u0000\u0000\u0000\u0000\u000f\u0001\u0000\u0000\u0000\u0000"+
		"\u0011\u0001\u0000\u0000\u0000\u0000\u0013\u0001\u0000\u0000\u0000\u0000"+
		"\u0015\u0001\u0000\u0000\u0000\u0000\u0017\u0001\u0000\u0000\u0000\u0000"+
		"\u0019\u0001\u0000\u0000\u0000\u0000\u001b\u0001\u0000\u0000\u0000\u0000"+
		"\u001d\u0001\u0000\u0000\u0000\u0001\u001f\u0001\u0000\u0000\u0000\u0003"+
		"%\u0001\u0000\u0000\u0000\u0005,\u0001\u0000\u0000\u0000\u00077\u0001"+
		"\u0000\u0000\u0000\t;\u0001\u0000\u0000\u0000\u000bC\u0001\u0000\u0000"+
		"\u0000\rK\u0001\u0000\u0000\u0000\u000fZ\u0001\u0000\u0000\u0000\u0011"+
		"j\u0001\u0000\u0000\u0000\u0013w\u0001\u0000\u0000\u0000\u0015{\u0001"+
		"\u0000\u0000\u0000\u0017}\u0001\u0000\u0000\u0000\u0019\u009d\u0001\u0000"+
		"\u0000\u0000\u001b\u00a0\u0001\u0000\u0000\u0000\u001d\u00a4\u0001\u0000"+
		"\u0000\u0000\u001f \u0005<\u0000\u0000 !\u0005v\u0000\u0000!\"\u0005a"+
		"\u0000\u0000\"#\u0005r\u0000\u0000#$\u0005>\u0000\u0000$\u0002\u0001\u0000"+
		"\u0000\u0000%&\u0005<\u0000\u0000&\'\u0005/\u0000\u0000\'(\u0005v\u0000"+
		"\u0000()\u0005a\u0000\u0000)*\u0005r\u0000\u0000*+\u0005>\u0000\u0000"+
		"+\u0004\u0001\u0000\u0000\u0000,.\u0007\u0000\u0000\u0000-/\u0005_\u0000"+
		"\u0000.-\u0001\u0000\u0000\u0000./\u0001\u0000\u0000\u0000/3\u0001\u0000"+
		"\u0000\u000002\u0007\u0001\u0000\u000010\u0001\u0000\u0000\u000025\u0001"+
		"\u0000\u0000\u000031\u0001\u0000\u0000\u000034\u0001\u0000\u0000\u0000"+
		"4\u0006\u0001\u0000\u0000\u000053\u0001\u0000\u0000\u000068\u0007\u0002"+
		"\u0000\u000076\u0001\u0000\u0000\u000089\u0001\u0000\u0000\u000097\u0001"+
		"\u0000\u0000\u00009:\u0001\u0000\u0000\u0000:\b\u0001\u0000\u0000\u0000"+
		";<\u0005\\\u0000\u0000<=\u0005\\\u0000\u0000=>\u0005l\u0000\u0000>?\u0005"+
		"d\u0000\u0000?@\u0005o\u0000\u0000@A\u0005t\u0000\u0000AB\u0005s\u0000"+
		"\u0000B\n\u0001\u0000\u0000\u0000CD\u0005\\\u0000\u0000DE\u0005\\\u0000"+
		"\u0000EF\u0005v\u0000\u0000FG\u0005d\u0000\u0000GH\u0005o\u0000\u0000"+
		"HI\u0005t\u0000\u0000IJ\u0005s\u0000\u0000J\f\u0001\u0000\u0000\u0000"+
		"KL\u0005\\\u0000\u0000LM\u0005\\\u0000\u0000MN\u0005m\u0000\u0000NO\u0005"+
		"a\u0000\u0000OP\u0005t\u0000\u0000PQ\u0005h\u0000\u0000QR\u0005r\u0000"+
		"\u0000RS\u0005m\u0000\u0000ST\u0005{\u0000\u0000TU\u0005c\u0000\u0000"+
		"UV\u0005a\u0000\u0000VW\u0005s\u0000\u0000WX\u0005e\u0000\u0000XY\u0005"+
		"}\u0000\u0000Y\u000e\u0001\u0000\u0000\u0000Z[\u0005\\\u0000\u0000[\\"+
		"\u0005\\\u0000\u0000\\]\u0005m\u0000\u0000]^\u0005a\u0000\u0000^_\u0005"+
		"t\u0000\u0000_`\u0005h\u0000\u0000`a\u0005r\u0000\u0000ab\u0005m\u0000"+
		"\u0000bc\u0005{\u0000\u0000cd\u0005q\u0000\u0000de\u0005u\u0000\u0000"+
		"ef\u0005e\u0000\u0000fg\u0005r\u0000\u0000gh\u0005y\u0000\u0000hi\u0005"+
		"}\u0000\u0000i\u0010\u0001\u0000\u0000\u0000jk\u0005\\\u0000\u0000kl\u0005"+
		"\\\u0000\u0000lm\u0005r\u0000\u0000mn\u0005m\u0000\u0000no\u0005{\u0000"+
		"\u0000op\u0005Q\u0000\u0000pq\u0005u\u0000\u0000qr\u0005e\u0000\u0000"+
		"rs\u0005r\u0000\u0000st\u0005y\u0000\u0000tu\u0005}\u0000\u0000u\u0012"+
		"\u0001\u0000\u0000\u0000vx\u0005\r\u0000\u0000wv\u0001\u0000\u0000\u0000"+
		"wx\u0001\u0000\u0000\u0000xy\u0001\u0000\u0000\u0000yz\u0005\n\u0000\u0000"+
		"z\u0014\u0001\u0000\u0000\u0000{|\u0005 \u0000\u0000|\u0016\u0001\u0000"+
		"\u0000\u0000}~\u0005\t\u0000\u0000~\u007f\u0001\u0000\u0000\u0000\u007f"+
		"\u0080\u0006\u000b\u0000\u0000\u0080\u0018\u0001\u0000\u0000\u0000\u0081"+
		"\u0082\u0005\u5404\u0000\u0000\u0082\u0083\u0005\u30af\u0000\u0000\u0083"+
		"\u0084\u0005\u30a8\u0000\u0000\u0084\u009e\u0005\u30ea\u0000\u0000\u0085"+
		"\u0086\u0005\u306f\u0000\u0000\u0086\u0087\u0005\u4ee5\u0000\u0000\u0087"+
		"\u0088\u0005\u4e0b\u0000\u0000\u0088\u009e\u0005\u306e\u0000\u0000\u0089"+
		"\u008a\u0005\u3044\u0000\u0000\u008a\u008b\u0005\u305a\u0000\u0000\u008b"+
		"\u008c\u0005\u308c\u0000\u0000\u008c\u008d\u0005\u304b\u0000\u0000\u008d"+
		"\u009e\u0005\u306e\u0000\u0000\u008e\u008f\u0005\u5f62\u0000\u0000\u008f"+
		"\u0090\u0005\u5f0f\u0000\u0000\u0090\u0091\u0005\u3067\u0000\u0000\u0091"+
		"\u0092\u0005\u4e0e\u0000\u0000\u0092\u0093\u0005\u3048\u0000\u0000\u0093"+
		"\u0094\u0005\u3089\u0000\u0000\u0094\u0095\u0005\u308c\u0000\u0000\u0095"+
		"\u009e\u0005\u308b\u0000\u0000\u0096\u0097\u0005\u30bf\u0000\u0000\u0097"+
		"\u0098\u0005\u30a4\u0000\u0000\u0098\u009e\u0005\u30d7\u0000\u0000\u0099"+
		"\u009a\u0005\u306e\u0000\u0000\u009a\u009b\u0005\u30af\u0000\u0000\u009b"+
		"\u009c\u0005\u30a8\u0000\u0000\u009c\u009e\u0005\u30ea\u0000\u0000\u009d"+
		"\u0081\u0001\u0000\u0000\u0000\u009d\u0085\u0001\u0000\u0000\u0000\u009d"+
		"\u0089\u0001\u0000\u0000\u0000\u009d\u008e\u0001\u0000\u0000\u0000\u009d"+
		"\u0096\u0001\u0000\u0000\u0000\u009d\u0099\u0001\u0000\u0000\u0000\u009e"+
		"\u001a\u0001\u0000\u0000\u0000\u009f\u00a1\b\u0003\u0000\u0000\u00a0\u009f"+
		"\u0001\u0000\u0000\u0000\u00a1\u00a2\u0001\u0000\u0000\u0000\u00a2\u00a0"+
		"\u0001\u0000\u0000\u0000\u00a2\u00a3\u0001\u0000\u0000\u0000\u00a3\u001c"+
		"\u0001\u0000\u0000\u0000\u00a4\u00a5\u0005\u3002\u0000\u0000\u00a5\u001e"+
		"\u0001\u0000\u0000\u0000\u0007\u0000.39w\u009d\u00a2\u0001\u0000\u0001"+
		"\u0000";
	public static final ATN _ATN =
		new ATNDeserializer().deserialize(_serializedATN.toCharArray());
	static {
		_decisionToDFA = new DFA[_ATN.getNumberOfDecisions()];
		for (int i = 0; i < _ATN.getNumberOfDecisions(); i++) {
			_decisionToDFA[i] = new DFA(_ATN.getDecisionState(i), i);
		}
	}
}