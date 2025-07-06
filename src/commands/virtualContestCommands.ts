import * as vscode from 'vscode';

export function registerVirtualContestCommands(context: vscode.ExtensionContext, virtualContestSetupViewProvider: any) {
    context.subscriptions.push(
        vscode.commands.registerCommand('atcoder-utility.openVirtualContestSetup', () => {
            vscode.commands.executeCommand('workbench.view.extension.atcoder-utility-virtual-contest-view');
        })
    );
}