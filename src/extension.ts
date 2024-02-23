// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';

let totalLinesOfCode = 0;
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "lifetime-lines-of-code" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	//let disposable = vscode.commands.registerCommand('lifetime-lines-of-code.helloWorld', () => {
	let disposable = vscode.commands.registerCommand('lifetime-lines-of-code.countLines', () => {
	
	
		
		// Access active workspace
		const currFolders = vscode.workspace.workspaceFolders;

		if (!currFolders){
			vscode.window.showErrorMessage('No workspace found.');
			return;
		}

		// Iterate over workspace folders
		for(const workspaceFolder of currFolders){
			

			// Search for files in the workspace folder
			vscode.workspace.findFiles(new vscode.RelativePattern(workspaceFolder,'**/*.*'),'',5000) // matches all files, up to 5000
			.then((files:vscode.Uri[]) =>{
				for(const file of files){
					// Process each file
					countLinesOfCode(file.fsPath);
				}
				console.log(`Total lines of code: ${totalLinesOfCode}`);
			});

		}

	});

	context.subscriptions.push(disposable);
}

function countLinesOfCode(filePath:string){

	const fileExtension:string = filePath.split('.').pop() || '';
// Check if the file is a Python, JavaScript, Java, TypeScript, HTML, or CSS file
	if (['py', 'js', 'java', 'ts', 'html', 'css'].includes(fileExtension)) {
		const fileContent = fs.readFileSync(filePath, 'utf-8');
		const lines = fileContent.split('\n').filter(line => line.trim() !== '');

		// Increment the total lines of code
		totalLinesOfCode += lines.length;
}
}

// This method is called when your extension is deactivated
export function deactivate() {}
