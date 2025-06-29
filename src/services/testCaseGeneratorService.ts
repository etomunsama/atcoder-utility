/**
 * ユーザーが定義した制約に基づいて、ランダムなテストケースを生成するサービスです。
 * 整数、文字列、配列、グリッドなど、様々な形式の変数を生成できます。
 */
export class TestCaseGeneratorService {

    /**
     * 範囲内のランダムな整数を生成します。
     * @param min 最小値
     * @param max 最大値
     * @returns 生成された整数
     */
    private getRandomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * 指定された長さのランダムな英小文字の文字列を生成します。
     * @param length 文字列の長さ
     * @returns 生成された文字列
     */
    private getRandomString(length: number): string {
        const chars = 'abcdefghijklmnopqrstuvwxyz';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    /**
     * 設定オブジェクトの配列に基づいてテストケース文字列を生成します。
     * @param settings Webviewから受け取った変数設定の配列
     * @returns 生成されたテストケースの文字列
     */
    public generate(settings: any[]): string {
        const outputLines: string[] = [];
        // 生成済みの変数の値を後続の制約で参照できるように保存する
        const resolvedValues = new Map<string, number | string>();

        settings.forEach(variable => {
            const linesForVar = this.generateVariable(variable, resolvedValues);
            outputLines.push(...linesForVar);
        });

        return outputLines.join('\n');
    }

    /**
     * 単一の変数定義に基づいて文字列の配列を生成します。
     * @param varDef 変数定義オブジェクト
     * @param resolvedValues これまでに解決された変数の値のマップ
     * @returns 生成された文字列の配列
     */
    private generateVariable(varDef: any, resolvedValues: Map<string, number | string>): string[] {
        const lines: string[] = [];

        switch (varDef.type) {
            case 'integer': {
                const value = this.getRandomInt(parseInt(varDef.min), parseInt(varDef.max));
                resolvedValues.set(varDef.name, value);
                lines.push(String(value));
                break;
            }
            case 'string': {
                const length = this.getRandomInt(parseInt(varDef.lengthMin), parseInt(varDef.lengthMax));
                const value = this.getRandomString(length);
                resolvedValues.set(varDef.name, value);
                lines.push(value);
                break;
            }
            case 'grid': {
                const height = this.resolveLength(varDef.heightVar, varDef.heightMin, varDef.heightMax, resolvedValues);
                const width = this.resolveLength(varDef.widthVar, varDef.widthMin, varDef.widthMax, resolvedValues);
                for (let i = 0; i < height; i++) {
                    let row = '';
                    for (let j = 0; j < width; j++) {
                        row += Math.random() < 0.5 ? '.' : '#';
                    }
                    lines.push(row);
                }
                break;
            }
            case '1d-grid': {
                const width = this.resolveLength(varDef.widthVar, varDef.widthMin, varDef.widthMax, resolvedValues);
                let row = '';
                for (let j = 0; j < width; j++) {
                    row += Math.random() < 0.5 ? '.' : '#';
                }
                lines.push(row);
                break;
            }
            case 'array':
            case '2d-array': { // 1Dと2D配列のロジックを統合
                const rows = (varDef.type === '2d-array') ? this.resolveLength(varDef.rowsVar, varDef.rowsMin, varDef.rowsMax, resolvedValues) : 1;
                
                for (let i = 0; i < rows; i++) {
                    const cols = (varDef.type === '2d-array') 
                        ? this.resolveLength(varDef.colsVar, varDef.colsMin, varDef.colsMax, resolvedValues)
                        : this.resolveLength(varDef.lengthVar, varDef.lengthMin, varDef.lengthMax, resolvedValues);

                    const elements: string[] = [];
                    for (let j = 0; j < cols; j++) {
                        if (varDef.elementType === 'integer') {
                            elements.push(String(this.getRandomInt(parseInt(varDef.elementMin), parseInt(varDef.elementMax))));
                        } else if (varDef.elementType === 'string') {
                            const len = this.getRandomInt(parseInt(varDef.elementLengthMin), parseInt(varDef.elementLengthMax));
                            elements.push(this.getRandomString(len));
                        }
                    }

                    if (varDef.arrayFormat === 'newline') {
                        lines.push(...elements);
                    } else {
                        lines.push(elements.join(' '));
                    }
                }
                break;
            }
            case 'struct-array': {
                const length = this.resolveLength(varDef.lengthVar, varDef.lengthMin, varDef.lengthMax, resolvedValues);
                for (let i = 0; i < length; i++) {
                    const lineParts: any[] = [];
                    const tempResolved = new Map<string, number | string>(); // この行の中でのみ有効な値

                    varDef.members.forEach((member: any) => {
                        let shouldGenerate = true;
                        if (member.condition) {
                            // 注意: evalは強力ですが、この拡張機能はローカルで個人が使うものなので許容範囲と判断
                            try {
                                const context = Object.fromEntries(tempResolved);
                                shouldGenerate = new Function(...Object.keys(context), `return ${member.condition}`)(...Object.values(context));
                            } catch (e) {
                                console.error('Error evaluating condition:', e);
                                shouldGenerate = false;
                            }
                        }

                        if (shouldGenerate) {
                            if (member.type === 'integer') {
                                const value = this.getRandomInt(parseInt(member.min), parseInt(member.max));
                                tempResolved.set(member.name, value);
                                lineParts.push(value);
                            } else if (member.type === 'string') {
                                const len = this.getRandomInt(parseInt(member.min), parseInt(member.max));
                                const value = this.getRandomString(len);
                                tempResolved.set(member.name, value);
                                lineParts.push(value);
                            }
                        }
                    });
                    lines.push(lineParts.join(' '));
                }
                break;
            }
        }
        return lines;
    }

    /**
     * 固定値または他の変数への参照から、配列の長さなどを解決します。
     * @param varName 参照する変数名（空の場合は固定値を使用）
     * @param min 最小値
     * @param max 最大値
     * @param resolved 解決済みの値のマップ
     * @returns 解決された長さ
     */
    private resolveLength(varName: string, min: string, max: string, resolved: Map<string, number | string>): number {
        if (varName && resolved.has(varName)) {
            return Number(resolved.get(varName));
        }
        return this.getRandomInt(parseInt(min), parseInt(max));
    }
}
