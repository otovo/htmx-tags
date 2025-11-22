# Welcome to your VS Code Extension

## What's in the folder

* This folder contains all of the files necessary for your extension.
* `package.json` - this is the manifest file in which you declare your extension and contributions.
  * This extension registers a completion item provider for HTML and HTMX files.
* `src/extension.ts` - this is the main file where you will provide the implementation of your extension.
  * The file exports one function, `activate`, which is called the very first time your extension is activated (in this case by opening a supported file). Inside the `activate` function we call `registerCompletionItemProvider`.

## Prerequisites

*   [Visual Studio Code](https://code.visualstudio.com/)
*   [Node.js](https://nodejs.org/) (Required for building the extension)
*   [Python 3](https://www.python.org/) (Required for updating HTMX data)

## Get up and running straight away

*   Install dependencies:
    ```bash
    npm install
    ```
*   Press `F5` to open a new window with your extension loaded.
* Open a file with a supported language (e.g., `.html`, `.htmx`, or `.dhtml`).
* Type `hx-` to see the HTMX attribute completions.
* Set breakpoints in your code inside `src/extension.ts` to debug your extension.
* Find output from your extension in the debug console.

## Make changes

* You can relaunch the extension from the debug toolbar after changing code in `src/extension.ts`.
* You can also reload (`Ctrl+R` or `Cmd+R` on Mac) the VS Code window with your extension to load your changes.


## Explore the API

* You can open the full set of our API when you open the file `node_modules/@types/vscode/index.d.ts`.

## Run tests

* Open the debug viewlet (`Ctrl+Shift+D` or `Cmd+Shift+D` on Mac) and from the launch configuration dropdown pick `Extension Tests`.
* Press `F5` to run the tests in a new window with your extension loaded.
* See the output of the test result in the debug console.
* Make changes to `src/test/suite/extension.test.ts` or create new test files inside the `test/suite` folder.
  * The provided test runner will only consider files matching the name pattern `**.test.ts`.
  * You can create folders inside the `test` folder to structure your tests any way you want.

## Go further

 * Reduce the extension size and improve the startup time by [bundling your extension](https://code.visualstudio.com/api/working-with-extensions/bundling-extension).
 * [Publish your extension](https://code.visualstudio.com/api/working-with-extensions/publishing-extension) on the VSCode extension marketplace.
 * Automate builds by setting up [Continuous Integration](https://code.visualstudio.com/api/working-with-extensions/continuous-integration).

## Updating HTMX Data

The extension uses `html.htmx-data.json` to provide completions. This file is generated from the official HTMX source.

To update the data to a newer HTMX version:

1.  Open `build-data.py`.
2.  Update the `HTMX_VERSION` constant to the desired version (e.g., `"2.0.8"`).
3.  Run the script:
    ```bash
    python3 build-data.py
    ```
4.  Commit the updated `html.htmx-data.json`.

## Packaging

To package the extension into a `.vsix` file for distribution:

1.  Install `vsce`:
    ```bash
    npm install -g @vscode/vsce
    ```
2.  Run the package command:
    ```bash
    vsce package
    ```
