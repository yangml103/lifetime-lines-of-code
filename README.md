# Summary
This extension allows you to count the lines of code in a specific language in a specific folder. You can select the folder using a popup folder browser, and the language using a dropdown menu. 

## Overview

This is a response to job applications/school applications that ask for an estimate of how many lines of code you've written in your lifetime. What a dumb question. This won't give you an exact number, but it will give you a rough estimate, which is better than nothing. 

## Features

* Count lines of code in a specific folder: The extension will count the lines of code in the selected folder*, and the total lines will be printed onto the console.

* The extension will only count Python, Java, Js, Ts, HTML, CSS, C++, C#, C, and SQL. More languages could be added in the future if necessary. Let me know if you need other languages

## How to Use

1. Run the command 'Count Lines' in the command palette by pressing Control + Shift + P. A dialog will open for you to select a folder.
2. Select a folder. 
3. Select the languages.
4. (Optional) Type in names of folders to ignore i.e. node_modules,test,generated
5. The extension will start counting the lines of code in the selected folder(s).
6. The total lines of code will be printed in a vscode notification box on the bottom right corner.

## Known Issues

* Doesn't differentiate between computer generated lines and lines that are human written 
* Cancel button on progress bar doesn't work 

## Release Notes


### 1.0.1

Initial release of lifetime-lines-of-code

### 1.0.2

Updated format/design 

### 1.0.3 

Fixed mistakes on marketplace

### 1.0.4

Added filters to ignore npm packages, test files, and other computer generated code
Added progress bar (cancel button doesn't work)


**Enjoy!**