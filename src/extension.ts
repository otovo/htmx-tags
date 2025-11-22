import * as vscode from 'vscode';
import * as htmxData from '../html.htmx-data.json';

interface HtmxAttribute {
    name: string;
    description: string;
    references?: { name: string; url: string }[];
}

interface HtmxData {
    version: number;
    tags: unknown[];
    globalAttributes: HtmxAttribute[];
    valueSets: unknown[];
}

/**
 * Validates that the imported HTMX data has the expected structure
 */
function validateHtmxData(data: unknown): data is HtmxData {
    if (typeof data !== 'object' || data === null) {
        return false;
    }

    const d = data as Record<string, unknown>;

    if (typeof d.version !== 'number') {
        return false;
    }

    if (!Array.isArray(d.globalAttributes)) {
        return false;
    }

    // Validate at least one attribute exists and has required fields
    if (d.globalAttributes.length > 0) {
        const firstAttr = d.globalAttributes[0];
        if (typeof firstAttr !== 'object' || !('name' in firstAttr) || !('description' in firstAttr)) {
            return false;
        }
    }

    return true;
}

/**
 * Checks if the position is inside an HTML tag
 */
function isInsideHtmlTag(document: vscode.TextDocument, position: vscode.Position): boolean {
    const lineText = document.lineAt(position.line).text;
    const textBeforeCursor = lineText.substring(0, position.character);

    // Check if we're inside a tag by looking for the last < and >
    const lastOpenBracket = textBeforeCursor.lastIndexOf('<');
    const lastCloseBracket = textBeforeCursor.lastIndexOf('>');

    // We're inside a tag if < comes after > (or there's no > at all)
    return lastOpenBracket > lastCloseBracket;
}

export function activate(context: vscode.ExtensionContext) {
    try {
        // Validate HTMX data on activation
        if (!validateHtmxData(htmxData)) {
            const errorMsg = 'HTMX Tags: Invalid htmx-data.json structure';
            vscode.window.showErrorMessage(errorMsg);
            console.error(errorMsg);
            return;
        }

        console.log('HTMX Tags extension is now active');
        console.log(`Loaded ${htmxData.globalAttributes.length} HTMX attributes`);

        const provider = vscode.languages.registerCompletionItemProvider(
            ['django-html', 'html', 'htmx'],
            {
                provideCompletionItems(
                    document: vscode.TextDocument,
                    position: vscode.Position,
                    _token: vscode.CancellationToken,
                    _context: vscode.CompletionContext
                ) {
                    try {
                        // Only provide completions if we're inside an HTML tag
                        if (!isInsideHtmlTag(document, position)) {
                            return undefined;
                        }

                        const completionItems: vscode.CompletionItem[] = [];

                        // Add global attributes
                        for (const attr of htmxData.globalAttributes) {
                            const item = new vscode.CompletionItem(
                                attr.name,
                                vscode.CompletionItemKind.Property
                            );
                            item.detail = attr.description;

                            if (attr.references && attr.references.length > 0) {
                                const markdown = new vscode.MarkdownString(
                                    `${attr.description}\n\n[Documentation](${attr.references[0].url})`
                                );
                                markdown.isTrusted = true;
                                item.documentation = markdown;
                            } else {
                                item.documentation = new vscode.MarkdownString(attr.description);
                            }

                            completionItems.push(item);
                        }

                        return completionItems;
                    } catch (error) {
                        console.error('HTMX Tags: Error providing completions:', error);
                        return undefined;
                    }
                }
            }
        );

        context.subscriptions.push(provider);
    } catch (error) {
        const errorMsg = `HTMX Tags: Failed to activate extension: ${error}`;
        vscode.window.showErrorMessage(errorMsg);
        console.error(errorMsg, error);
    }
}

export function deactivate() {
    console.log('HTMX Tags extension is now deactivated');
}
