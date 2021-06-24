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
		const filename = path.basename(currentlyOpenTabfilePath!, ".nim"); // plotting_basics
		const dirname = path.dirname(currentlyOpenTabfilePath!); // users/code/nim
		fs.mkdtemp(path.join(dirname, ".temp-"), (err, folder) => {
			if (err) {
				console.log(err);
				vscode.window.showInformationMessage("Something went wrong creating tempDir");
			} else {
				const tempDir = folder;
				vscode.window.showInformationMessage("Tempdir created: ", tempDir);

				// Create empty book.json to fix https://github.com/pietroppeter/nimibook/issues/21
				//fs.writeFile(path.join(dirname, 'book.json'), '{}' , (error) => {if (error) {console.log(error);};});
				

				const outCmd = " -d:nimibOutDir=" + tempDir + " ";
				const srcCmd = " -d:nimibSrcDir=" + dirname + " ";
				const nimCmd = 'nim r ' + outCmd + srcCmd + currentlyOpenTabfilePath;
				vscode.window.showInformationMessage(nimCmd);
				cp.exec(nimCmd, (err, stdout, stderr) => {
					if (err) {
						vscode.window.showInformationMessage("Error!");
						console.log(stdout);
					} else {
						vscode.window.showInformationMessage("Compilation succeeded!");
						const htmlFilePath = path.join(tempDir, filename + ".html");
						vscode.window.showInformationMessage("Page generated: " + htmlFilePath);
						const panel = vscode.window.createWebviewPanel(
							filename,
							filename,
							vscode.ViewColumn.Beside,
							{
								enableScripts: true
							}
						);
						
						panel.onDidDispose(
							() => {
								// remove temp folder
								vscode.window.showInformationMessage("Deleting temp files!");
								fs.rmdirSync(tempDir, {recursive: true});
								//fs.unlinkSync(path.join(dirname, 'book.json'));
								vscode.window.showInformationMessage("Temp files deleted!");
							},
							null,
							context.subscriptions
						);
						let htmlString = fs.readFileSync(htmlFilePath, 'utf8');

						// add <base> tag to the html
						let mediaPath = vscode.Uri.file(tempDir).with({
							scheme: "vscode-resource"
						}).toString() + '/';
						
						let splitHtml = htmlString.split("<head>");
						const injectString = `<head>\n<base href="${mediaPath}">\n`;
						htmlString = [splitHtml[0], injectString, splitHtml[1]].join();

						panel.webview.html = htmlString;
						vscode.window.showInformationMessage("Webview finished!");
					}
				});
			}
		});
	});

	context.subscriptions.push(runAndPreview);
}

// this method is called when your extension is deactivated
export function deactivate() {}
