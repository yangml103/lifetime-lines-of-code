// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';

let totalLinesOfCode = 0;
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	let languages = ['Python', 'Java', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'SQL', 'C#', 'C++', 'C'];
	let extensions = ['py', 'java', 'js', 'ts', 'html', 'css', 'sql', 'cs', 'cpp', 'c'];


	console.log('Congratulations, your extension "lifetime-lines-of-code" is now active!');

	let disposable = vscode.commands.registerCommand('lifetime-lines-of-code.countLines', () => {
			

		// let user select which folder to iterate through 
		const folders = vscode.window.showOpenDialog({
			canSelectFiles: true,
			canSelectFolders: true,
			canSelectMany: true,
		});

		
		
		folders.then(folders => { 
			// Iterate over workspace folders
			if (!folders){
				vscode.window.showErrorMessage('No folder selected.');
				return;
			}

			for(const workspaceFolder of folders){
				
			// Search for files in the workspace folder
			vscode.workspace.findFiles(new vscode.RelativePattern(workspaceFolder,'**/*.*'),'') // matches all files
			.then((files:vscode.Uri[]) =>{
				for(const file of files){
					// Process each file
					countLinesOfCode(file.fsPath);
				}
				console.log(`Total lines of (Python, Java, JavaScript, TypeScript, HTML, CSS, SQL, C#, C++, C) code: ${totalLinesOfCode}`);
			});

		}
	});

	});

	context.subscriptions.push(disposable);
}

function countLinesOfCode(filePath:string){

	const fileExtension:string = filePath.split('.').pop() || '';
// Check if the file is a Python, JavaScript, Java, TypeScript, HTML, CSS, SQL, C#, C++ or C file
	if (['py', 'js', 'java', 'ts', 'html', 'css','sql','cs','cpp','c'].includes(fileExtension)) {
		const fileContent = fs.readFileSync(filePath, 'utf-8');
		const lines = fileContent.split('\n').filter(line => line.trim() !== '');

		// Increment the total lines of code
		totalLinesOfCode += lines.length;
}
}

// This method is called when your extension is deactivated
export function deactivate() {}
