// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from "fs";
import * as cp from "child_process";
import * as os from "os";
import * as path from "path";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "nimib-esh" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('nimib-esh.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Nimib-ESH!');
	});

	context.subscriptions.push(disposable);

	let runAndPreview = vscode.commands.registerCommand('nimiBoost.preview', () => {
		var currentlyOpenTabfilePath = vscode.window.activeTextEditor?.document.uri.fsPath;
		if (currentlyOpenTabfilePath == undefined) {
			vscode.window.showInformationMessage("No file is selected!");
			return;
		}
		vscode.window.showInformationMessage('This should preview!' + currentlyOpenTabfilePath);
		cp.exec('nim r --skipUserCfg:on --skipParentCfg:on --skipProjCfg:on ' + currentlyOpenTabfilePath, (err, stdout, stderr) => {
			if (err) {
				vscode.window.showInformationMessage(stderr);
			} else {
				vscode.window.showInformationMessage("Compilation succeeded!");
				//const tempDir = os.tmpdir();
				const filename = path.basename(currentlyOpenTabfilePath!, ".nim");
				const htmlFilePath = currentlyOpenTabfilePath!.replace(".nim", ".html");
				const panel = vscode.window.createWebviewPanel(
					filename,
					filename,
					vscode.ViewColumn.Beside,
					{
						enableScripts: true
					}
				);
				const htmlString = fs.readFileSync(htmlFilePath, 'utf8');
				panel.webview.html = htmlString;
				vscode.window.showInformationMessage("Webview finished!");
			}
		});
	});

	context.subscriptions.push(runAndPreview);
}

// this method is called when your extension is deactivated
export function deactivate() {}
