# Atcoder Utility
VS Code上でのAtCoderのコンテスト参加と学習を、サポートする拡張機能です

# 主な機能
### 1.ファイルエクスプローラーの強化
- **正解確率の可視化:** あなたの現在のAtCoderレーティングと問題のDifficultyに基づき、問題フォルダに正解確率の目安を絵文字とパーセンテージでバッジ表示します。
  - 🔵 (75%以上): 自信を持って解ける問題
  - 🟡 (40%以上): ちょうど良い練習になる問題
  - 🔴 (40%未満): 挑戦的な問題
- **AC状況の表示:** AtCoder Problemsの提出履歴と連携し、すでにAC済みの問題に ✅ マークを表示します

- **コンテスト情報の表示:** コンテストフォルダにマウスをホバーすると、正式名称や開催日時をツールチップで表示します


### 2. サイドバー・ダッシュボード
アクティビティバーの専用アイコン Ⓐ をクリックすると、あなたのAtCoderステータスが一覧表示されます
- **My Status:**
  - 現在のレーティングと最高レーティング
  - 色と絵文字によるランク表示
  - 総AC数
  - 連続AC記録 (Streak)
  - 色別のAC数（クリックで展開）
- **Recommended Problems:**
  - あなたの現在の実力に合わせた、次に解くべきおすすめの問題をリストアップします
  - この問題はdiff(AtCoder Problems APIが測定した難易度)にそって計算されています
- **Current Contest:**
  - 現在開いているコンテストの問題一覧とAC状況を表示します。
- **Bookmarks:**
  - エクスプローラーで問題フォルダ(a,b,c...)を右クリックして、後で復習したい問題をブックマーク・管理できます
- **AC Activity**
  - サイドバーの「AC Activity」ビューから1週間[1W]、一ヶ月[1M]、3ヶ月[3M]、6ヶ月[6M]で毎日(3ヶ月、6ヶ月は毎週)何問ACしたかをグラフで表示します
  - Heat Mapでgithubのように難問ACしたかを表示します
- **Custom Tests**
  - サイドバーの「Custom Tests」ビューから、独自の入力・出力ケースを作成し、`test` フォルダに `my_test_N.in` / `.out` として保存できます
  - Inputに入力、Outputに出力を入れてSaveを押します　最後の改行はあってもなくても動作します
- **Problem Timer**
  - 問題を解く時間を測定するためのタイマーです
- **Contest Actions**
  - コンテストの準備(acc new ~~)をaccなしで実行できます。
  - 提出の準備はファイルをバンドルし、現在のプログラムをコピーし、提出先のリンクを開きます。
これによりctrl+vを押し、提出ボタンを押すだけで提出できるようになります
  - Generate Input Snippetを押すことで入力予測を使うことができます(詳しくは下に書いてあります)
- **Random Input**
  - 制約を設定すると自動でテストケースを作成します
  - クエリのときの入力はStruct Arrayを選択することで設定できます
- **Fuzzer**
  - **設定をRandom Inputの欄で保存する**ことで、愚直解とメインの解法で出力が変わる入力例を見つけます

### 3. ステータスバー連携
- **常時レート表示:** `👤 ユーザー名 (⚪ 1985)` のように(⚪には現在の自分の色、1985には現在のレートが入ります)、現在のレーティングを常にステータスバーに表示します
- **自動テスト:** ファイルをセーブ(Ctrl+S)したときに下のバーにテスト結果を表示します。
  - 上にカーソルを合わせると具体的な結果を表示します
  - デフォルトではC++、Python、Java、Rust、C、C#、Ruby、Goのみ対応しています　
  - 設定を変えることでoj tで実行した結果を出力することも可能です

### 4. 問題文表示
- ブラウザを使わなくても問題文が表示されるようになります
- 設定で常に表示するかを選択できます
- アクセスをできる限り少なくするため、HTMLファイルが生成されます(不必要であれば、非表示を推奨します)

### 5. 入力予測
- 問題文から入力を予測することができます(現在はC++のみ)
- Contest Actionsからボタンを押すと、クリップボードに入力がコピーされます
- **この機能はルールベースで動いています。**　ABCやARCのコンテスト中に使用することも可能です
- **特殊な入力のときには動作しない**ことが多いです。
- クエリ問題をサポートしていますが、動かないことがあります(書き方が問題によって違うため)。

## 使い方

### 1. インストール
Visual Studio Marketplaceから「Atcoder-Utility」をインストールしてください。
(ここにマーケットプレイスへのリンクを貼る)

### 2. 初期設定
1. VS Codeの設定 (`settings.json`) を開きます。 (`Ctrl + ,` -> 右上のファイルアイコン)

2. 必須設定

   F1 -> 基本設定: 設定(UI)からでも変更することが可能です

   ```json
   "atcoder-utility.userId": "your_atcoder_id",
   "atcoder-utility.aclPath": "your_atcoder_library_path",
   "atcoder-utility.templateFilePath": "your_template_file_path"
  - userId -> レートやAC確率計算に使用します

  - aclPath -> C++などのコンパイル時に使用します

  - templateFilePath -> コンテストセットアップのときに自動生成されるファイル(.cppや.pyなどのパスを設定)

  - F1 -> AtCoder-Utility: Set AtCoder Session Cookie
    - クッキーを設定します
    - Chromeの場合(Windows)
      - F12を押してコンソールなどを開く
      - 上にあるアプリケーション(ない場合は右にある>>をクリックすると出てきます)を開く
      - ストレージ/Cookie/https://atcoder.jp を開きます
      - その中にあるREVEL_SESSIONの中身をコピーし、VSCode上に貼り付けます
    - その他のブラウザ、OSでも基本的には一緒です
    - ここで設定した値は**SecretStorageで管理**されます
    - このCookieのデータは、スクレイピングする際に利用されます

3. 基本設定
   F1 -> 基本設定: 設定(UI)からでも変更することが可能です
   ```json
   "atcoder-utility.autoTestEngine": "custom",
   "atcoder-utility.bundleEngine": "custom",
   "atcoder-utility.languageSettings": {"..."}
  - autoTestEngine -> 自動テストで使用するエンジン(customは拡張機能内蔵のものでojはonline-judge-toolsのもの)
  - bundleEngine -> バンドル＆クリップボードにコピーで使うエンジン(autoTestEngineと同様)
  - languageSettings -> 自動テストで使用するコンパイルコマンド(autoTestEngineでojを設定している際は不要。　C++、Python、Java、Rust、C、C#、Ruby、Goはすでに設定済み(変更も可能))

4. C++のみの設定
    ```json
    "atcoder-utility.snippet.arrayStyle": "vector",
    "atcoder-utility.snippet.integerType": "int",
    "atcoder-utility.snippet.queryStyle": "individual_vectors"
  - snippet.arrayStyle -> 入力スニペット生成で使用する配列の種類を選択します(vectorを推奨します)
  - snippet.integerType -> 入力スニペット生成で使用する整数型の種類を選択します(intかlong long)
  - snippet.queryStyle -> **現在動作しません。**　変更することは推奨しません(デフォルトでは動作します)


## 依存関係
**この拡張機能はすべての機能がこれらのツールを使わなくても動作します**が、

一部機能はこのツールを使って動作させることも可能です

- atcoder-cli(acc): コンテストフォルダの作成に使用します
- online-judge-tools(oj): テストの実行・ファイルのバンドルに使用します


## ライセンス
This extension is licensed under the MIT License;

この拡張機能はMITライセンスです

この拡張機能を商用利用することも可能です


**いかなる場合においても、著作者または著作権者は、契約違反、不法行為、その他の理由を問わず、本拡張機能の使用、その他の取り扱いに起因または関連して生じるいかなる請求、損害、その他の責任についても責任を負わないものとします。**

## 注意事項
1. 本拡張機能が使用するAPIは非公式なものであり、予告なく仕様が変更され、機能が動作しなくなる可能性があります

2. 解ける確率はあくまで推定値であるので、100%に近い値でも解けないことがあったり、0%に近い値でも解けることがあります

3. Atcoder Problemsのdifficultyを参考にしていますが、負の値になる場合があります

4. 入力予測機能は間違ったコードを生成することがあります

- #### 現在確認されている例
- 配列のあとに変数があるとき
- ２次元配列
- グリッド
- 複雑なクエリ
- bool値(現在、stringで反映されるようになっています)
- char(現在、charのところはstringで反映されます)
- 小数(動く場合もありますが、とても不安定です)

5. この拡張機能はMITライセンスです(詳しくはライセンスを見てください)

6. バグ・こんな機能がほしい!・改善してほしいところなどがありましたら、github(https://github.com/etomunsama/atcoder-utility/issues)、
PullRequestがありましたら(https://github.com/etomunsama/atcoder-utility/pulls)に追加していただけると幸いです