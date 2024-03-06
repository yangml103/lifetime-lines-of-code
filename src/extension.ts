// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';

let totalLinesOfCode = 0;

function countLinesOfCode(filePath:string, selectedExtensions:string[]){

	const fileExtension:string = filePath.split('.').pop() || '';
    if (selectedExtensions.includes(fileExtension)) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const lines = fileContent.split('\n').filter(line => line.trim() !== '');

        // Increment the total lines of code
        totalLinesOfCode += lines.length;
    }
}

export function activate(context: vscode.ExtensionContext) {

	// Languages to count 
	let languages = [' Python', ' Java', ' JavaScript', ' TypeScript', ' HTML', ' CSS', ' SQL', ' C#', ' C++', ' C'];
	let extensions = ['py', 'java', 'js', 'ts', 'html', 'css', 'sql', 'cs', 'cpp', 'c'];

	console.log('Lines of Code extension is now active!');
	console.log('Run "Count Lines" in the command palette to begin.');

	let disposable = vscode.commands.registerCommand('lifetime-lines-of-code.countLines', () => {
		// let user select which folder to iterate through 
		const folders = vscode.window.showOpenDialog({
			canSelectFiles: true,
			canSelectFolders: true,
			canSelectMany: true,
		});

		folders.then(folders => { 
			if (!folders) {
				vscode.window.showErrorMessage('No folder selected.');
				return;
			}
			
			// let users select which language to include
			vscode.window.showQuickPick(languages, {
				canPickMany: true,
				placeHolder: 'Select languages to include in the line count'
			}).then(selectedLanguages => {
				if (!selectedLanguages) {
					vscode.window.showErrorMessage('No languages selected.');
					return;
				}
				
				// match selected languages to the extension of the file
				let selectedExtensions = selectedLanguages.map(language => extensions[languages.indexOf(language)]);

				// prompt user for directories to exclude:
				vscode.window.showInputBox({
					prompt: 'Enter directories to exclude, separated by commas (e.g., node_modules,test), leave empty to include all directories'
				}).then(excludeInput => {
					let excludeDirectories = excludeInput ? `{${excludeInput.split(',').map(dir => `**/${dir.trim()}/**`).join(',')}}` : '';
					console.log(excludeDirectories);
				
					// iterate through folders 
					for(const workspaceFolder of folders){

						// display progress notification 
						vscode.window.withProgress({
							location: vscode.ProgressLocation.Notification,
							title: "Processing files...",
							cancellable: true
						},
						// doesn't do anything 
						(progress, token) => {
							token.onCancellationRequested(() => {
								console.log("User cancelled the long running operation");
							});
						// 
							return new Promise<void>(async (resolve, reject) => {
								const files = await vscode.workspace.findFiles(
									new vscode.RelativePattern(workspaceFolder,'**/*.*'),
									excludeDirectories); 
	
									for(const file of files){

										// Process each file
										countLinesOfCode(file.fsPath, selectedExtensions);
										
									}
									vscode.window.showInformationMessage(`Total lines of${selectedLanguages} code: ${totalLinesOfCode}`);
									resolve();
							});
						});
					}
				});
			});
		});
	});
	context.subscriptions.push(disposable);
}


// This method is called when your extension is deactivated
export function deactivate() {}