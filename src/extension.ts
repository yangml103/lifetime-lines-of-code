// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';

let totalLinesOfCode = 0;

async function countLinesOfCode(filePath:string, selectedExtensions:string[]){

	const fileExtension:string = filePath.split('.').pop() || '';
    if (selectedExtensions.includes(fileExtension)) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const lines = fileContent.split('\n').filter(line => line.trim() !== '');

        // Increment the total lines of code
        totalLinesOfCode += lines.length;
    }
}

async function selectFolders(){
	// let users select which folders to iterate through
	const folders = vscode.window.showOpenDialog({
		canSelectFiles: true,
		canSelectFolders: true,
		canSelectMany: true,
	});
	if (!folders) {
		throw new Error('No folder selected.');
	}
	return folders;
}

async function selectLanguages(languages: string[]): Promise<string[]> {
	// let users select which language to include in count 
	const selectedLanguages = await vscode.window.showQuickPick(languages, {
		canPickMany: true,
		placeHolder: 'Select languages to include in the line count'
	});
	if(!selectedLanguages){
		throw new Error('No languages selected.');
		
	}
	return selectedLanguages;
}

async function selectDirectoriesToExclude(): Promise<string>{
	// let users select which directories to exclude i.e. node_modules etc.
	const selectDirectories = await
	vscode.window.showInputBox({
		prompt: 'Enter directories to exclude, separated by commas (e.g., node_modules,test), leave empty to include all directories'
	});
	
	let excludeDirectories = selectDirectories ? `{${selectDirectories.split(',').map(dir => `**/${dir.trim()}/**`).join(',')}}` : '';
	return excludeDirectories;
}

async function processFiles(workspaceFolder: vscode.Uri, selectedExtensions: string[], directoriesToExclude: string): Promise<void> {
	const files = await vscode.workspace.findFiles(
        new vscode.RelativePattern(workspaceFolder, '**/*.*'),
        
    );

    for (const file of files) {
        // Process each file
        countLinesOfCode(file.fsPath, selectedExtensions);
		console.log(file.fsPath);
    }
    //vscode.window.showInformationMessage(`Total lines of code: ${totalLinesOfCode}`);
}

async function processFilesWithProgress(workspaceFolder: vscode.Uri, selectedExtensions: string[], directoriesToExclude: string, selectedLanguages: string[], folders: vscode.Uri[]) {
	// Define a new function to handle the withProgress logic
    await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "Processing files...",
        cancellable: true
    }, async (progress, token) => {
        token.onCancellationRequested(() => {
            console.log("User cancelled the long running operation");
        });

        // Call processFiles here, assuming it's an async function
        await processFiles(workspaceFolder, selectedExtensions, directoriesToExclude);

        // Display the message after files have been processed
        vscode.window.showInformationMessage(`Total lines of ${selectedLanguages.join(', ')} code: in ${folders}: ${totalLinesOfCode.toLocaleString()}`);
    });
}


export function activate(context: vscode.ExtensionContext) {

	// Languages to count 
	let languages = [' Python', ' Java', ' JavaScript', ' TypeScript', ' HTML', ' CSS', ' SQL', ' C#', ' C++', ' C'];
	let extensions = ['py', 'java', 'js', 'ts', 'html', 'css', 'sql', 'cs', 'cpp', 'c'];

	console.log('Lines of Code extension is now active!');
	console.log('Run "Count Lines" in the command palette to begin.');

	let disposable = vscode.commands.registerCommand('lifetime-lines-of-code.countLines', async() => {
		
		// let users select which folders to use 
		let folders = await selectFolders();
			
		// let users select which language to include
		const selectedLanguages = await selectLanguages(languages);
		let selectedExtensions = selectedLanguages.map(language => extensions[languages.indexOf(language)]);

		// prompt user for directories to exclude:
		let directoriesToExclude = await selectDirectoriesToExclude();
			
		if (folders){
		// iterate through folders 
		for(const workspaceFolder of folders){

			// process files with a progress bar 
			await processFilesWithProgress(workspaceFolder, selectedExtensions, directoriesToExclude, selectedLanguages, folders);
			}
		}
	});

	context.subscriptions.push(disposable);
}


// This method is called when your extension is deactivated
export function deactivate() {}