import * as vscode from 'vscode';
import { Uri } from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "vscode-enhanced-save-all" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	registerSaveAllCommand(context);
	registerSaveAllInGroupCommand(context);
}

// this method is called when your extension is deactivated
export function deactivate() {}

function registerSaveAllCommand(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('vscode-enhanced-save-all.save-all-except-untitled', () => {
		vscode.workspace.saveAll(/* includeUntitled */ false).then((res) => {
			if (!res) {
				vscode.window.showErrorMessage('Failed to Save All except Untitled');
			}
		});
	});

	context.subscriptions.push(disposable);
}

function registerSaveAllInGroupCommand(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('vscode-enhanced-save-all.save-all-in-group-except-untitled', () => {
		const allUrisInGroup = vscode.window.tabGroups.activeTabGroup.tabs
		  .map((tab) => tab.input)
			.filter(inputHasUri)
			.map(({ uri }) => uri);

		const textDocumentsToSave = vscode.workspace.textDocuments.filter(({ isDirty, isUntitled, uri }) => (
			isDirty &&
			!isUntitled &&
			allUrisInGroup.some((uriInGroup) => uriInGroup.path === uri.path)
		));

		textDocumentsToSave.forEach((document) => document.save());
	});

	context.subscriptions.push(disposable);
}

function inputHasUri<T>(input: T): input is T & { uri: Uri } {
	return (input as any)?.uri instanceof Uri;
}