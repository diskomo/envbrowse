import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand(
		"extension.openEnvFile",
		() => {
			const panel = vscode.window.createWebviewPanel(
				"envViewer",
				".env Viewer",
				vscode.ViewColumn.One,
				{},
			);

			const editor = vscode.window.activeTextEditor;
			if (editor) {
				const text = editor.document.getText();
				panel.webview.html = getWebviewContent(text);
			}
		},
	);

	context.subscriptions.push(disposable);
}

function getWebviewContent(envContent: string): string {
	const lines = envContent
		.split("\n")
		.map((line) => {
			const [key, value] = line.split("=");
			return `<div>
                    <span onclick="copyToClipboard('${key}')">${key}</span> = 
                    <span onclick="copyToClipboard('${value}')">${value}</span>
                </div>`;
		})
		.join("");

	return `
        <html>
        <body>
            ${lines}
            <script>
                function copyToClipboard(text) {
                    navigator.clipboard.writeText(text).then(() => {
                        console.log('Copied to clipboard:', text);
                    });
                }
            </script>
        </body>
        </html>
    `;
}

export function deactivate() {}
