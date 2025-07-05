// Generated from src/AtCoderInput.g4 by ANTLR 4.13.2
// noinspection ES6UnusedImports,JSUnusedGlobalSymbols,JSUnusedLocalSymbols
import {
	ATN,
	ATNDeserializer,
	CharStream,
	DecisionState, DFA,
	Lexer,
	LexerATNSimulator,
	RuleContext,
	PredictionContextCache,
	Token
} from "antlr4";
export default class AtCoderInputLexer extends Lexer {
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
	public static readonly EOF = Token.EOF;

	public static readonly channelNames: string[] = [ "DEFAULT_TOKEN_CHANNEL", "HIDDEN" ];
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
	public static readonly modeNames: string[] = [ "DEFAULT_MODE", ];

	public static readonly ruleNames: string[] = [
		"L_VAR_START", "L_VAR_END", "VAR_NAME_INNER", "NUMBER", "L_DOTS", "L_VDOTS", 
		"L_MATH_CASE", "L_MATH_QUERY", "L_RM_QUERY", "NEWLINE", "SPACE", "TAB", 
		"KW_QUERY_TYPE_INDICATOR", "TEXT_CONTENT", "KW_PERIOD",
	];


	constructor(input: CharStream) {
		super(input);
		this._interp = new LexerATNSimulator(this, AtCoderInputLexer._ATN, AtCoderInputLexer.DecisionsToDFA, new PredictionContextCache());
	}

	public get grammarFileName(): string { return "AtCoderInput.g4"; }

	public get literalNames(): (string | null)[] { return AtCoderInputLexer.literalNames; }
	public get symbolicNames(): (string | null)[] { return AtCoderInputLexer.symbolicNames; }
	public get ruleNames(): string[] { return AtCoderInputLexer.ruleNames; }

	public get serializedATN(): number[] { return AtCoderInputLexer._serializedATN; }

	public get channelNames(): string[] { return AtCoderInputLexer.channelNames; }

	public get modeNames(): string[] { return AtCoderInputLexer.modeNames; }

	public static readonly _serializedATN: number[] = [4,0,15,166,6,-1,2,0,
	7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,7,6,2,7,7,7,2,8,7,8,2,9,
	7,9,2,10,7,10,2,11,7,11,2,12,7,12,2,13,7,13,2,14,7,14,1,0,1,0,1,0,1,0,1,
	0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,2,3,2,47,8,2,1,2,5,2,50,8,2,10,
	2,12,2,53,9,2,1,3,4,3,56,8,3,11,3,12,3,57,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,
	4,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,
	6,1,6,1,6,1,6,1,6,1,6,1,7,1,7,1,7,1,7,1,7,1,7,1,7,1,7,1,7,1,7,1,7,1,7,1,
	7,1,7,1,7,1,7,1,8,1,8,1,8,1,8,1,8,1,8,1,8,1,8,1,8,1,8,1,8,1,8,1,9,3,9,120,
	8,9,1,9,1,9,1,10,1,10,1,11,1,11,1,11,1,11,1,12,1,12,1,12,1,12,1,12,1,12,
	1,12,1,12,1,12,1,12,1,12,1,12,1,12,1,12,1,12,1,12,1,12,1,12,1,12,1,12,1,
	12,1,12,1,12,1,12,1,12,1,12,1,12,1,12,3,12,158,8,12,1,13,4,13,161,8,13,
	11,13,12,13,162,1,14,1,14,0,0,15,1,1,3,2,5,3,7,4,9,5,11,6,13,7,15,8,17,
	9,19,10,21,11,23,12,25,13,27,14,29,15,1,0,4,2,0,65,90,97,122,3,0,48,57,
	65,90,97,122,1,0,48,57,3,0,10,10,13,13,60,60,175,0,1,1,0,0,0,0,3,1,0,0,
	0,0,5,1,0,0,0,0,7,1,0,0,0,0,9,1,0,0,0,0,11,1,0,0,0,0,13,1,0,0,0,0,15,1,
	0,0,0,0,17,1,0,0,0,0,19,1,0,0,0,0,21,1,0,0,0,0,23,1,0,0,0,0,25,1,0,0,0,
	0,27,1,0,0,0,0,29,1,0,0,0,1,31,1,0,0,0,3,37,1,0,0,0,5,44,1,0,0,0,7,55,1,
	0,0,0,9,59,1,0,0,0,11,67,1,0,0,0,13,75,1,0,0,0,15,90,1,0,0,0,17,106,1,0,
	0,0,19,119,1,0,0,0,21,123,1,0,0,0,23,125,1,0,0,0,25,157,1,0,0,0,27,160,
	1,0,0,0,29,164,1,0,0,0,31,32,5,60,0,0,32,33,5,118,0,0,33,34,5,97,0,0,34,
	35,5,114,0,0,35,36,5,62,0,0,36,2,1,0,0,0,37,38,5,60,0,0,38,39,5,47,0,0,
	39,40,5,118,0,0,40,41,5,97,0,0,41,42,5,114,0,0,42,43,5,62,0,0,43,4,1,0,
	0,0,44,46,7,0,0,0,45,47,5,95,0,0,46,45,1,0,0,0,46,47,1,0,0,0,47,51,1,0,
	0,0,48,50,7,1,0,0,49,48,1,0,0,0,50,53,1,0,0,0,51,49,1,0,0,0,51,52,1,0,0,
	0,52,6,1,0,0,0,53,51,1,0,0,0,54,56,7,2,0,0,55,54,1,0,0,0,56,57,1,0,0,0,
	57,55,1,0,0,0,57,58,1,0,0,0,58,8,1,0,0,0,59,60,5,92,0,0,60,61,5,92,0,0,
	61,62,5,108,0,0,62,63,5,100,0,0,63,64,5,111,0,0,64,65,5,116,0,0,65,66,5,
	115,0,0,66,10,1,0,0,0,67,68,5,92,0,0,68,69,5,92,0,0,69,70,5,118,0,0,70,
	71,5,100,0,0,71,72,5,111,0,0,72,73,5,116,0,0,73,74,5,115,0,0,74,12,1,0,
	0,0,75,76,5,92,0,0,76,77,5,92,0,0,77,78,5,109,0,0,78,79,5,97,0,0,79,80,
	5,116,0,0,80,81,5,104,0,0,81,82,5,114,0,0,82,83,5,109,0,0,83,84,5,123,0,
	0,84,85,5,99,0,0,85,86,5,97,0,0,86,87,5,115,0,0,87,88,5,101,0,0,88,89,5,
	125,0,0,89,14,1,0,0,0,90,91,5,92,0,0,91,92,5,92,0,0,92,93,5,109,0,0,93,
	94,5,97,0,0,94,95,5,116,0,0,95,96,5,104,0,0,96,97,5,114,0,0,97,98,5,109,
	0,0,98,99,5,123,0,0,99,100,5,113,0,0,100,101,5,117,0,0,101,102,5,101,0,
	0,102,103,5,114,0,0,103,104,5,121,0,0,104,105,5,125,0,0,105,16,1,0,0,0,
	106,107,5,92,0,0,107,108,5,92,0,0,108,109,5,114,0,0,109,110,5,109,0,0,110,
	111,5,123,0,0,111,112,5,81,0,0,112,113,5,117,0,0,113,114,5,101,0,0,114,
	115,5,114,0,0,115,116,5,121,0,0,116,117,5,125,0,0,117,18,1,0,0,0,118,120,
	5,13,0,0,119,118,1,0,0,0,119,120,1,0,0,0,120,121,1,0,0,0,121,122,5,10,0,
	0,122,20,1,0,0,0,123,124,5,32,0,0,124,22,1,0,0,0,125,126,5,9,0,0,126,127,
	1,0,0,0,127,128,6,11,0,0,128,24,1,0,0,0,129,130,5,21508,0,0,130,131,5,12463,
	0,0,131,132,5,12456,0,0,132,158,5,12522,0,0,133,134,5,12399,0,0,134,135,
	5,20197,0,0,135,136,5,19979,0,0,136,158,5,12398,0,0,137,138,5,12356,0,0,
	138,139,5,12378,0,0,139,140,5,12428,0,0,140,141,5,12363,0,0,141,158,5,12398,
	0,0,142,143,5,24418,0,0,143,144,5,24335,0,0,144,145,5,12391,0,0,145,146,
	5,19982,0,0,146,147,5,12360,0,0,147,148,5,12425,0,0,148,149,5,12428,0,0,
	149,158,5,12427,0,0,150,151,5,12479,0,0,151,152,5,12452,0,0,152,158,5,12503,
	0,0,153,154,5,12398,0,0,154,155,5,12463,0,0,155,156,5,12456,0,0,156,158,
	5,12522,0,0,157,129,1,0,0,0,157,133,1,0,0,0,157,137,1,0,0,0,157,142,1,0,
	0,0,157,150,1,0,0,0,157,153,1,0,0,0,158,26,1,0,0,0,159,161,8,3,0,0,160,
	159,1,0,0,0,161,162,1,0,0,0,162,160,1,0,0,0,162,163,1,0,0,0,163,28,1,0,
	0,0,164,165,5,12290,0,0,165,30,1,0,0,0,7,0,46,51,57,119,157,162,1,0,1,0];

	private static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!AtCoderInputLexer.__ATN) {
			AtCoderInputLexer.__ATN = new ATNDeserializer().deserialize(AtCoderInputLexer._serializedATN);
		}

		return AtCoderInputLexer.__ATN;
	}


	static DecisionsToDFA = AtCoderInputLexer._ATN.decisionToState.map( (ds: DecisionState, index: number) => new DFA(ds, index) );
}