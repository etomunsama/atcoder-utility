import * as vscode from 'vscode';
import { onDidChangeRandomInputSettings } from '../extension'; // Fuzzer連携用にインポート

export class RandomInputViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'atcoder-utility-random-input-view';
    private _view?: vscode.WebviewView;

    // 状態はすべてここで一元管理します
    private variables: any[] = [];

    constructor(
        private readonly _extensionUri: vscode.Uri,
        private readonly context: vscode.ExtensionContext
    ) {}

    public resolveWebviewView(webviewView: vscode.WebviewView) {
        this._view = webviewView;
        webviewView.webview.options = { enableScripts: true, localResourceRoots: [this._extensionUri] };
        webviewView.webview.html = this._getHtmlForWebview();

        // WebViewからのメッセージを処理するリスナー
        webviewView.webview.onDidReceiveMessage(data => {
            switch (data.command) {
                case 'webviewReady':
                    // WebViewの準備ができたら、保存済みの状態を読み込んでUIを初期化
                    this.variables = this.context.globalState.get('randomInputSettings', []);
                    this.updateWebview();
                    break;
                case 'updateState':
                    // UI側での変更を本体側の状態に同期
                    this.variables = data.variables;
                    break;
                case 'saveSettings':
                    // 現在の状態をglobalStateに保存し、変更イベントを発行
                    this.variables = data.settings;
                    this.context.globalState.update('randomInputSettings', this.variables);
                    onDidChangeRandomInputSettings.fire(this.variables); // Fuzzerビューに通知
                    vscode.window.showInformationMessage('制約設定を保存しました。');
                    break;
            }
        });
    }

    // WebViewのUIを更新するためのヘルパー関数
    private updateWebview() {
        if (this._view) {
            this._view.webview.postMessage({ command: 'render', state: this.variables });
        }
    }

    private _getHtmlForWebview(): string {
        const styles = `
            body { font-family: var(--vscode-font-family); color: var(--vscode-editor-foreground); background-color: var(--vscode-side-bar-background); padding: 10px; }
            .variable-item { border: 1px solid var(--vscode-editor-widget-border); border-radius: 4px; padding: 10px; margin-bottom: 10px; }
            .variable-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
            .variable-meta { display: flex; gap: 8px; align-items: center; flex-grow: 1; }
            .variable-meta input { flex-grow: 1; min-width: 50px; }
            .variable-meta select { flex-shrink: 0; width: 110px; }
            label { display: block; margin-top: 8px; margin-bottom: 4px; font-size: 0.9em; }
            input, select { width: 100%; padding: 4px; box-sizing: border-box; border: 1px solid var(--vscode-input-border); background-color: var(--vscode-input-background); color: var(--vscode-input-foreground); border-radius: 2px; }
            button { width: 100%; padding: 8px; margin-top: 10px; border: none; background-color: var(--vscode-button-background); color: var(--vscode-button-foreground); cursor: pointer; border-radius: 2px; }
            button:hover { background-color: var(--vscode-button-hoverBackground); }
            #save-btn { background-color: var(--vscode-button-primaryBackground); color: var(--vscode-button-primaryForeground); }
            #save-btn:hover { background-color: var(--vscode-button-primaryHoverBackground); }
            .remove-btn { background-color: transparent; color: var(--vscode-editor-foreground); border: none; cursor: pointer; padding: 0; width: 22px; height: 22px; line-height: 22px; text-align: center; margin-left: 8px; font-size: 1.2em; opacity: 0.7; }
            .remove-btn:hover { opacity: 1; background-color: var(--vscode-toolbar-hoverBackground); }
            .struct-members-container { border: 1px dashed var(--vscode-editor-widget-border); padding: 10px; margin-top: 10px; border-radius: 4px; }
            .struct-member-item { display: grid; grid-template-columns: 1fr 1fr; gap: 5px 10px; border-bottom: 1px solid var(--vscode-editor-widget-border); padding-bottom: 10px; margin-bottom: 10px; }
            .element-fields { margin-top: 8px; padding-left: 15px; border-left: 2px solid var(--vscode-editor-widget-border); }
        `;
        
        const script = `
            const vscode = acquireVsCodeApi();
            const variablesContainer = document.getElementById('variables-container');
            const addVariableBtn = document.getElementById('add-variable-btn');
            const saveBtn = document.getElementById('save-btn');

            let variables = [];

            function updateStateInExtension() {
                vscode.postMessage({ command: 'updateState', variables: variables });
            }

            addVariableBtn.addEventListener('click', () => {
                variables.push({
                    id: Date.now(), name: 'N', type: 'integer',
                    min: '1', max: '100',
                    lengthMin: '1', lengthMax: '10', lengthVar: '',
                    rowsMin: '1', rowsMax: '10', rowsVar: '',
                    colsMin: '1', colsMax: '10', colsVar: '',
                    heightMin: '1', heightMax: '10', heightVar: '',
                    widthMin: '1', widthMax: '10', widthVar: '',
                    arrayFormat: 'space',
                    elementType: 'integer',
                    elementMin: '1', elementMax: '100',
                    elementLengthMin: '1', elementLengthMax: '10',
                    members: []
                });
                render();
                updateStateInExtension();
            });

            saveBtn.addEventListener('click', () => {
                vscode.postMessage({ command: 'saveSettings', settings: variables });
            });

            variablesContainer.addEventListener('input', e => updateVariableModel(e.target));
            variablesContainer.addEventListener('change', e => { updateVariableModel(e.target); render(); });
            variablesContainer.addEventListener('click', e => {
                const target = e.target;
                let stateChanged = false;
                if (target.classList.contains('remove-btn')) {
                    variables = variables.filter(v => v.id !== parseInt(target.dataset.id));
                    stateChanged = true;
                } else if (target.classList.contains('add-member-btn')) {
                    const variable = variables.find(v => v.id === parseInt(target.dataset.id));
                    if (variable) {
                        variable.members.push({ id: Date.now(), name: 'p', type: 'integer', min: '1', max: '100', condition: '' });
                        stateChanged = true;
                    }
                } else if (target.classList.contains('remove-member-btn')) {
                    const parentVar = variables.find(v => v.id === parseInt(target.dataset.parentId));
                    if (parentVar) {
                        parentVar.members = parentVar.members.filter(m => m.id !== parseInt(target.dataset.id));
                        stateChanged = true;
                    }
                }
                if(stateChanged) {
                    render();
                    updateStateInExtension();
                }
            });

            window.addEventListener('message', event => {
                const message = event.data;
                if (message.command === 'render' || message.command === 'restoreState') {
                    variables = message.state ?? message.settings ?? [];
                    render();
                }
            });

            function updateVariableModel(target) {
                if (!target || !target.dataset.id) return;
                const id = parseInt(target.dataset.id);
                const property = target.dataset.property;
                const value = target.value;
                const parentId = target.dataset.parentId;
                const variableToUpdate = parentId ? variables.find(v => v.id === parseInt(parentId))?.members.find(m => m.id === id) : variables.find(v => v.id === id);
                if (variableToUpdate) {
                    variableToUpdate[property] = value;
                    updateStateInExtension();
                }
            }

            function render() {
                const integerVariables = variables.filter(v => v.type === 'integer').map(v => v.name);
                const focusedElement = document.activeElement;
                const selectionStart = focusedElement ? focusedElement.selectionStart : null;
                const selectionEnd = focusedElement ? focusedElement.selectionEnd : null;
                const focusedId = focusedElement ? focusedElement.dataset.id : null;
                const focusedProp = focusedElement ? focusedElement.dataset.property : null;
                const focusedParentId = focusedElement ? focusedElement.dataset.parentId : null;
                variablesContainer.innerHTML = '';
                variables.forEach(variable => {
                    variablesContainer.appendChild(createVariableItemElement(variable, integerVariables));
                });
                if (focusedId && focusedProp) {
                    const selector = focusedParentId ? \`[data-id="\${focusedId}"][data-parent-id="\${focusedParentId}"][data-property="\${focusedProp}"]\` : \`[data-id="\${focusedId}"][data-property="\${focusedProp}"]\`;
                    const newFocusedElement = document.querySelector(selector);
                    if (newFocusedElement) {
                        newFocusedElement.focus();
                        try { newFocusedElement.setSelectionRange(selectionStart, selectionEnd); } catch (e) {}
                    }
                }
            }

            function createVariableItemElement(variable, integerVariables) {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'variable-item';
                let typeSpecificFields = '';
                function createLengthSelector(propName, selectedVar) { return \`<select data-id="\${variable.id}" data-property="\${propName}"><option value="">- 固定値 -</option>\${integerVariables.filter(name => name).map(name => \`<option value="\${name}" \${selectedVar === name ? 'selected' : ''}>\${name}</option>\`).join('')}</select>\`; }
                function getElementFields(v) { switch (v.elementType) { case 'integer': return \`<div class="element-fields"><label>要素の最小値</label><input type="number" data-id="\${v.id}" data-property="elementMin" value="\${v.elementMin}"><label>要素の最大値</label><input type="number" data-id="\${v.id}" data-property="elementMax" value="\${v.elementMax}"></div>\`; case 'string': return \`<div class="element-fields"><label>要素の最小長</label><input type="number" data-id="\${v.id}" data-property="elementLengthMin" value="\${v.elementLengthMin}"><label>要素の最大長</label><input type="number" data-id="\${v.id}" data-property="elementLengthMax" value="\${v.elementLengthMax}"></div>\`; default: return ''; } }
                function getStructMemberFields(v) { return \`<div class="struct-members-container"><h5>要素の定義</h5>\${v.members.map(member => \`<div class="struct-member-item"><div><label>名前</label><input type="text" data-id="\${member.id}" data-parent-id="\${v.id}" data-property="name" value="\${member.name}"></div><div><label>種類</label><select data-id="\${member.id}" data-parent-id="\${v.id}" data-property="type"><option value="integer" \${member.type === 'integer' ? 'selected' : ''}>Integer</option><option value="string" \${member.type === 'string' ? 'selected' : ''}>String</option></select></div><div><label>最小値/長</label><input type="text" data-id="\${member.id}" data-parent-id="\${v.id}" data-property="min" value="\${member.min}"></div><div><label>最大値/長</label><input type="text" data-id="\${member.id}" data-parent-id="\${v.id}" data-property="max" value="\${member.max}"></div><div style="grid-column: 1 / -1;"><label>生成条件 (例: query_type == 2)</label><input type="text" data-id="\${member.id}" data-parent-id="\${v.id}" data-property="condition" value="\${member.condition}" placeholder="空欄なら常に生成"></div><div style="grid-column: 1 / -1; text-align: right;"><button class="remove-member-btn" data-id="\${member.id}" data-parent-id="\${v.id}">この要素を削除</button></div></div>\`).join('')}<button class="add-member-btn" data-id="\${v.id}" style="width:auto; padding: 2px 8px;">要素を追加 +</button></div>\`; }

                switch (variable.type) {
                    case 'integer': typeSpecificFields = \`<label>最小値</label><input type="number" data-id="\${variable.id}" data-property="min" value="\${variable.min}"><label>最大値</label><input type="number" data-id="\${variable.id}" data-property="max" value="\${variable.max}">\`; break;
                    case 'string': typeSpecificFields = \`<label>最小長</label><input type="number" data-id="\${variable.id}" data-property="lengthMin" value="\${variable.lengthMin}"><label>最大長</label><input type="number" data-id="\${variable.id}" data-property="lengthMax" value="\${variable.lengthMax}">\`; break;
                    case 'grid': typeSpecificFields = \`<label>高さ</label>\${createLengthSelector('heightVar', variable.heightVar)}<div style="display: \${variable.heightVar ? 'none' : 'block'};"><label>最小の高さ</label><input type="number" data-id="\${variable.id}" data-property="heightMin" value="\${variable.heightMin}"><label>最大の高さ</label><input type="number" data-id="\${variable.id}" data-property="heightMax" value="\${variable.heightMax}"></div><label>幅</label>\${createLengthSelector('widthVar', variable.widthVar)}<div style="display: \${variable.widthVar ? 'none' : 'block'};"><label>最小の幅</label><input type="number" data-id="\${variable.id}" data-property="widthMin" value="\${variable.widthMin}"><label>最大の幅</label><input type="number" data-id="\${variable.id}" data-property="widthMax" value="\${variable.widthMax}"></div>\`; break;
                    case '1d-grid': typeSpecificFields = \`<label>幅</label>\${createLengthSelector('widthVar', variable.widthVar)}<div style="display: \${variable.widthVar ? 'none' : 'block'};"><label>最小の幅</label><input type="number" data-id="\${variable.id}" data-property="widthMin" value="\${variable.widthMin}"><label>最大の幅</label><input type="number" data-id="\${variable.id}" data-property="widthMax" value="\${variable.widthMax}"></div>\`; break;
                    case 'array': typeSpecificFields = \`<label>長さ</label>\${createLengthSelector('lengthVar', variable.lengthVar)}<div style="display: \${variable.lengthVar ? 'none' : 'block'};"><label>最小長</label><input type="number" data-id="\${variable.id}" data-property="lengthMin" value="\${variable.lengthMin}"><label>最大長</label><input type="number" data-id="\${variable.id}" data-property="lengthMax" value="\${variable.lengthMax}"></div><label>出力形式</label><select data-id="\${variable.id}" data-property="arrayFormat"><option value="space" \${variable.arrayFormat === 'space' ? 'selected' : ''}>スペース区切り</option><option value="newline" \${variable.arrayFormat === 'newline' ? 'selected' : ''}>改行区切り</option></select><label>要素の型</label><select data-id="\${variable.id}" data-property="elementType"><option value="integer" \${variable.elementType === 'integer' ? 'selected' : ''}>Integer</option><option value="string" \${variable.elementType === 'string' ? 'selected' : ''}>String</option></select>\${getElementFields(variable)}\`; break;
                    case '2d-array': typeSpecificFields = \`<label>行数</label>\${createLengthSelector('rowsVar', variable.rowsVar)}<div style="display: \${variable.rowsVar ? 'none' : 'block'};"><label>最小行数</label><input type="number" data-id="\${variable.id}" data-property="rowsMin" value="\${variable.rowsMin}"><label>最大行数</label><input type="number" data-id="\${variable.id}" data-property="rowsMax" value="\${variable.rowsMax}"></div><label>列数</label>\${createLengthSelector('colsVar', variable.colsVar)}<div style="display: \${variable.colsVar ? 'none' : 'block'};"><label>最小列数</label><input type="number" data-id="\${variable.id}" data-property="colsMin" value="\${variable.colsMin}"><label>最大列数</label><input type="number" data-id="\${variable.id}" data-property="colsMax" value="\${variable.colsMax}"></div><label>要素の型</label><select data-id="\${variable.id}" data-property="elementType"><option value="integer" \${variable.elementType === 'integer' ? 'selected' : ''}>Integer</option><option value="string" \${variable.elementType === 'string' ? 'selected' : ''}>String</option></select>\${getElementFields(variable)}\`; break;
                    case 'struct-array': typeSpecificFields = \`<label>長さ</label>\${createLengthSelector('lengthVar', variable.lengthVar)}<div style="display: \${variable.lengthVar ? 'none' : 'block'};"><label>最小長</label><input type="number" data-id="\${variable.id}" data-property="lengthMin" value="\${variable.lengthMin}"><label>最大長</label><input type="number" data-id="\${variable.id}" data-property="lengthMax" value="\${variable.lengthMax}"></div>\${getStructMemberFields(variable)}\`; break;
                }

                itemDiv.innerHTML = \`
                    <div class="variable-header">
                        <div class="variable-meta">
                            <input type="text" data-id="\${variable.id}" data-property="name" value="\${variable.name}" placeholder="変数名">
                            <select data-id="\${variable.id}" data-property="type">
                                <option value="integer" \${variable.type === 'integer' ? 'selected' : ''}>Integer</option>
                                <option value="string" \${variable.type === 'string' ? 'selected' : ''}>String</option>
                                <option value="grid" \${variable.type === 'grid' ? 'selected' : ''}>Grid (2D)</option>
                                <option value="1d-grid" \${variable.type === '1d-grid' ? 'selected' : ''}>1D Grid</option>
                                <option value="array" \${variable.type === 'array' ? 'selected' : ''}>Array</option>
                                <option value="2d-array" \${variable.type === '2d-array' ? 'selected' : ''}>2D Array</option>
                                <option value="struct-array" \${variable.type === 'struct-array' ? 'selected' : ''}>Struct Array</option>
                                <option value="char" \${variable.type === 'char' ? 'selected' : ''}>Char</option>
                                <option value="boolean" \${variable.type === 'boolean' ? 'selected' : ''}>Boolean</option>
                            </select>
                        </div>
                        <button class="remove-btn" data-id="\${variable.id}">✖</button>
                    </div>
                    \${typeSpecificFields}
                \`;
                return itemDiv;
            }

            vscode.postMessage({ command: 'webviewReady' });
        `;
        
        return `<!DOCTYPE html>
            <html lang="ja">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Random Input</title>
                <style>${styles}</style>
            </head>
            <body>
                <div id="variables-container"></div>
                <button id="add-variable-btn">変数を追加 +</button>
                <button id="generate-btn">テストケースを1つ生成</button>
                <button id="save-btn">この制約を保存</button>
                <script>${script}</script>
            </body>
            </html>`;
    }
}