grammar AtCoderInput;

// --- Lexer Rules ---
L_VAR_START: '<var>';
L_VAR_END: '</var>';
VAR_NAME_INNER: [a-zA-Z] ('_')? [a-zA-Z0-9]*;
NUMBER: [0-9]+;
L_DOTS: '\\\\ldots';
L_VDOTS: '\\\\vdots';
L_MATH_CASE: '\\\\mathrm{case}';
L_MATH_QUERY: '\\\\mathrm{query}';
L_RM_QUERY: '\\\\rm{Query}';
NEWLINE: '\r'? '\n';
SPACE: ' ';
TAB: '\t' -> channel(HIDDEN);
KW_QUERY_TYPE_INDICATOR: '各クエリ' | 'は以下の' | 'いずれかの' | '形式で与えられる' | 'タイプ' | 'のクエリ';
TEXT_CONTENT: ~[<\r\n]+ ;
KW_PERIOD: '。'; 

// --- Parser Rules ---
start_rule: (
    simple_variable_line
    | multi_line_single_variable_list
    | horizontal_array_input_line
    | multi_line_list_input
    | query_top_level_input
)+ EOF; // ★★★ この形に戻す ★★★

// 単一行の変数定義 (例: <var>N</var> または <var>N</var> <var>M</var> ...)
simple_variable_line:
    (L_VAR_START VAR_NAME_INNER L_VAR_END (SPACE L_VAR_START VAR_NAME_INNER L_VAR_END)*) (NEWLINE | EOF) // ★★★ ここを変更 ★★★
    ;

// 複数行にわたる単一変数リスト (例: <var>N</var>\n<var>S</var>)
multi_line_single_variable_list:
    (L_VAR_START VAR_NAME_INNER L_VAR_END NEWLINE)+
    ;

// 例4: <var>P_1</var> <var>P_2</var> <var>\ldots</var> <var>P_N</var>
horizontal_array_input_line:
    (array_element (SPACE array_element)* // <var>P_1</var> <var>P_2</var> ... の部分
    (SPACE array_dots_suffix)?)? // その後に <var>\ldots</var> <var>P_N</var> が続く (オプション)
    NEWLINE
    ;

array_element: L_VAR_START VAR_NAME_INNER L_VAR_END;
array_dots_suffix: L_VAR_START L_DOTS L_VAR_END (SPACE array_element)?;

// 例5, 6: 複数行にわたるリスト（2つ以上の変数が1行に並ぶ形式）
multi_line_list_input:
    (line_of_variables NEWLINE)+
    L_VAR_START L_VDOTS L_VAR_END NEWLINE
    (line_of_variables NEWLINE)?
    ;

line_of_variables:
    (L_VAR_START VAR_NAME_INNER L_VAR_END (SPACE L_VAR_START VAR_NAME_INNER L_VAR_END)*)
    ;

// クエリ形式のトップレベル入力
query_top_level_input:
    (simple_variable_line)? // N Q などの初期変数行 (オプション) - ここで simple_variable_line を再利用
    (query_placeholder_line NEWLINE)+
    L_VAR_START L_VDOTS L_VAR_END NEWLINE
    (query_placeholder_line NEWLINE)?
    (query_description_block)*
    ;

query_placeholder_line:
    L_VAR_START (L_MATH_QUERY | L_RM_QUERY) NUMBER L_VAR_END
    ;

query_description_block:
    (query_description_text NEWLINE)?
    (query_type_pre_content)+
    ;

query_description_text:
    (TEXT_CONTENT | L_VAR_START VAR_NAME_INNER L_VAR_END | NUMBER | KW_QUERY_TYPE_INDICATOR)+ KW_PERIOD
    ;

query_type_pre_content:
    L_VAR_START query_type_id L_VAR_END (SPACE L_VAR_START VAR_NAME_INNER L_VAR_END)* NEWLINE
    ;

query_type_id: NUMBER | VAR_NAME_INNER;