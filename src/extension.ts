// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from "fs";
import * as cp from "child_process";
import * as os from "os";
import * as path from "path";
const TOML = require('@iarna/toml');
const findParentDir = require('find-parent-dir');

export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "NimiBoost" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

	const outputChannels: { [name: string]: vscode.OutputChannel } = {};

	let runAndPreviewLegacy = vscode.commands.registerCommand('nimiBoost.previewLegacy', () => {

		var currentlyOpenTabfilePath = vscode.window.activeTextEditor?.document.uri.fsPath;
		if (currentlyOpenTabfilePath == undefined) {
			vscode.window.showInformationMessage("No file is selected!");
			return;
		}

		//vscode.window.showInformationMessage('This should preview!' + currentlyOpenTabfilePath);
		vscode.window.showInformationMessage("Compilation started!");
		const filename = path.basename(currentlyOpenTabfilePath!, ".nim"); // plotting_basics
		const dirname = path.dirname(currentlyOpenTabfilePath!); // users/code/nim
		fs.mkdtemp(path.join(dirname, ".temp-"), (err, folder) => {
			if (err) {
				console.log(err);
				vscode.window.showInformationMessage("Something went wrong creating tempDir");
				return;
			} else {
				const tempDir = folder;
				//vscode.window.showInformationMessage("Tempdir created: ", tempDir);

				// Create empty book.json to fix https://github.com/pietroppeter/nimibook/issues/21
				//fs.writeFile(path.join(dirname, 'book.json'), '{}' , (error) => {if (error) {console.log(error);};});
				
				let codeAsInSourceCmd = " ";
				const config = vscode.workspace.getConfiguration("nimiboost");
				if (config.get("codeAsInSource")) {
					codeAsInSourceCmd = " -d:nimibPreviewCodeAsInSource ";
				}

				const outCmd = " --nbHomeDir=" + tempDir + " ";
				const srcCmd = " --nbSrcDir=" + dirname + " ";
				const nimCmd = 'nim r -d:release ' + codeAsInSourceCmd + currentlyOpenTabfilePath + outCmd + srcCmd;
				cp.exec(nimCmd, (err, stdout, stderr) => {
					if (err) {
						vscode.window.showErrorMessage("Error compiling " + filename + ".nim!");

						fs.rmdirSync(tempDir, {recursive: true}); // remove temp dir if failed build

						var outputChannel: vscode.OutputChannel; 
						if (filename in outputChannels) { // reuse the old output channel for the file
							outputChannel = outputChannels[filename];
							outputChannel.clear();
						} else {
							outputChannel = vscode.window.createOutputChannel("(NimiBoost) Error: " + filename);
						}
						outputChannel.appendLine("Nim command that failed: " + nimCmd);
						outputChannel.append(stderr); // show error message
						outputChannel.show(false); // focus on output channel
						outputChannels[filename] = outputChannel;
						return;
					} else {
						vscode.window.showInformationMessage("Compilation succeeded!");
						const htmlFilePath = path.join(tempDir, filename + ".html");
						//vscode.window.showInformationMessage("Page generated: " + htmlFilePath);
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
								//vscode.window.showInformationMessage("Deleting temp files!");
								fs.rmdirSync(tempDir, {recursive: true});
								//fs.unlinkSync(path.join(dirname, 'book.json'));
								//vscode.window.showInformationMessage("Temp files deleted!");
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
						//vscode.window.showInformationMessage("Webview finished!");
					}
				});
			}
		});
	});

	context.subscriptions.push(runAndPreviewLegacy);

	let runAndPreview = vscode.commands.registerCommand('nimiBoost.preview', () => {

		var currentlyOpenTabfilePath = vscode.window.activeTextEditor?.document.uri.fsPath;
		if (currentlyOpenTabfilePath == undefined) {
			vscode.window.showErrorMessage("No file is selected!");
			return;
		}
		//var workfolder = vscode.workspace.workspaceFolders?[0].uri.fsPath;
		//var workfolder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(currentlyOpenTabfilePath)); // might be undefined
		//vscode.window.showInformationMessage(workfolder?.uri + ' ' + workfolder?.name);
		//console.log('This is it! ' + workfolder?.uri + ' ' + workfolder?.name);
		//console.log();

		/* if (workfolder?.uri) {
			const workPath = workfolder?.uri.fsPath;
			var nimibtoml = fs.readFileSync(path.join(workPath, "nimib.toml"), 'utf8');
			const obj: any = TOML.parse(nimibtoml);
			let nimibsrcDir: any = obj["nimib"]["srcDir"];
			let nimibHomeDir = obj["nimib"]["homeDir"];
			const pathRelToSrc = path.relative(path.join(workPath, nimibsrcDir), currentlyOpenTabfilePath);
			console.log("Congratts " + pathRelToSrc + ' ' + path.join(workPath, nimibHomeDir, pathRelToSrc));
			console.log('Congrats... ' + JSON.stringify(obj));
		} */
		//console.log("Congraatts... " + findParentDir.sync(currentlyOpenTabfilePath, 'nimib.toml')); // null if not found!

		vscode.window.showInformationMessage("Compilation started!");
		const filename = path.basename(currentlyOpenTabfilePath!, ".nim"); // plotting_basics
		const dirname = path.dirname(currentlyOpenTabfilePath!); // users/code/nim
		
		const nimibTomlDir = findParentDir.sync(currentlyOpenTabfilePath, 'nimib.toml');
		let outDir = ""; // the directory the final html file will be produced
		if (nimibTomlDir) {
			console.log("[nimiboost] toml dir exists!");
			const nimibTomlFile = fs.readFileSync(path.join(nimibTomlDir, "nimib.toml"), 'utf8');
			const nimibCfg = TOML.parse(nimibTomlFile);
			if (nimibCfg["nimib"]) {
				console.log("[nimiboost] nimib section exists!");
				let relPath = ""; // The relative path of the file's folder. This will be used w.r.t. homeDir later on.
				if (nimibCfg["nimib"]["srcDir"]) {
					console.log("[nimiboost] srcDir Exists");
					relPath = path.relative(path.join(nimibTomlDir, nimibCfg["nimib"]["srcDir"]), dirname);
				} else {
					console.log("[nimiboost] srcDir doesn't exists");
					// If srcDir not provided, use default.
					relPath = ".";
				}
				if(nimibCfg["nimib"]["homeDir"]) {
					console.log("[nimiboost] homeDir exists");
					// if homeDir is provided, use nimibTomlDir + nimibCfg["homeDir"] as homeDir
					outDir = path.join(nimibTomlDir, nimibCfg["nimib"]["homeDir"], relPath);
				} else {
					console.log("[nimiboost] homeDir doesn't exists");
					// if no homeDir provided, use current folder as homeDir.
					outDir = path.join(dirname, relPath);
				}
			} else {
				vscode.window.showErrorMessage("Invalid nimib.toml file! No [nimib] section found!");
				return;
			}
		} else {
			console.log("[nimiboost] no toml file found!");
			// If no nimib.toml file is found, it will default to outputting the file next to the source.
			outDir = dirname;
		}
		console.log("[nimiboost] outDir: " + outDir);
		let compilerArgs = [' '];
		const config = vscode.workspace.getConfiguration("nimiboost");
		if (config.get("codeAsInSource")) {
			compilerArgs.push("-d:nimibPreviewCodeAsInSource");
		}
		compilerArgs.push(' ');

		const nimCmd = 'nim r -d:release ' + compilerArgs.join(' ') + currentlyOpenTabfilePath;
		console.log("[nimiboost] nimCmd: " + nimCmd);
		cp.exec(nimCmd, (err, stdout, stderr) => {
			if (err || true) {
				vscode.window.showErrorMessage("Error compiling " + filename + ".nim!");

				var outputChannel: vscode.OutputChannel; 
				if (filename in outputChannels) { // reuse the old output channel for the file
					outputChannel = outputChannels[filename];
					outputChannel.clear();
				} else {
					outputChannel = vscode.window.createOutputChannel("(NimiBoost) Error: " + filename);
				}
				outputChannel.appendLine("Nim command that failed: " + nimCmd);
				outputChannel.append(stdout); // show error message
				outputChannel.show(false); // focus on output channel
				outputChannels[filename] = outputChannel;
				return;
			} else {
				vscode.window.showInformationMessage("Compilation succeeded!");
				const htmlFilePath = path.join(outDir, filename + ".html");
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
						
					},
					null,
					context.subscriptions
				);
				let htmlString = fs.readFileSync(htmlFilePath, 'utf8');

				// add <base> tag to the html
				let mediaPath = vscode.Uri.file(outDir).with({
					scheme: "vscode-resource"
				}).toString() + '/';

				let splitHtml = htmlString.split("<head>");
				const injectString = `<head>\n<base href="${mediaPath}">\n`;
				htmlString = [splitHtml[0], injectString, splitHtml[1]].join();

				panel.webview.html = htmlString;
			}
		});
	});

	context.subscriptions.push(runAndPreview);
}

// this method is called when your extension is deactivated
export function deactivate() {}
