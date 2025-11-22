import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Extension should be present', () => {
		assert.ok(vscode.extensions.getExtension('otovo-oss.htmx-tags'));
	});

	test('Extension should activate', async () => {
		const extension = vscode.extensions.getExtension('otovo-oss.htmx-tags');
		assert.ok(extension);
		await extension!.activate();
		assert.strictEqual(extension!.isActive, true);
	});

	test('Should provide completions for HTML files', async () => {
		// Create a temporary HTML document
		const doc = await vscode.workspace.openTextDocument({
			language: 'html',
			content: '<div hx-'
		});

		await vscode.window.showTextDocument(doc);

		// Trigger completion
		const position = new vscode.Position(0, 9); // After 'hx-'
		const completions = await vscode.commands.executeCommand<vscode.CompletionList>(
			'vscode.executeCompletionItemProvider',
			doc.uri,
			position
		);

		assert.ok(completions);
		assert.ok(completions.items.length > 0, 'Should have completion items');

		// Check that we have HTMX attributes
		const hasHtmxAttribute = completions.items.some(item =>
			item.label.toString().startsWith('hx-')
		);
		assert.ok(hasHtmxAttribute, 'Should contain HTMX attributes');
	});

	test('Should provide completions for django-html files', async () => {
		const doc = await vscode.workspace.openTextDocument({
			language: 'django-html',
			content: '<div hx-'
		});

		await vscode.window.showTextDocument(doc);

		const position = new vscode.Position(0, 9);
		const completions = await vscode.commands.executeCommand<vscode.CompletionList>(
			'vscode.executeCompletionItemProvider',
			doc.uri,
			position
		);

		assert.ok(completions);
		assert.ok(completions.items.length > 0, 'Should have completion items for django-html');
	});

	test('Should provide completions for htmx files', async () => {
		const doc = await vscode.workspace.openTextDocument({
			language: 'htmx',
			content: '<div hx-'
		});

		await vscode.window.showTextDocument(doc);

		const position = new vscode.Position(0, 9);
		const completions = await vscode.commands.executeCommand<vscode.CompletionList>(
			'vscode.executeCompletionItemProvider',
			doc.uri,
			position
		);

		assert.ok(completions);
		assert.ok(completions.items.length > 0, 'Should have completion items for htmx language');
	});

	test('Completion items should have documentation', async () => {
		const doc = await vscode.workspace.openTextDocument({
			language: 'html',
			content: '<div hx-'
		});

		await vscode.window.showTextDocument(doc);

		const position = new vscode.Position(0, 9);
		const completions = await vscode.commands.executeCommand<vscode.CompletionList>(
			'vscode.executeCompletionItemProvider',
			doc.uri,
			position
		);

		assert.ok(completions);

		// Find an HTMX attribute completion
		const htmxItem = completions.items.find(item =>
			item.label.toString().startsWith('hx-')
		);

		assert.ok(htmxItem, 'Should find an HTMX attribute');
		assert.ok(htmxItem!.documentation, 'HTMX attributes should have documentation');
	});

	test('Should load htmx data correctly', async () => {
		const extension = vscode.extensions.getExtension('otovo-oss.htmx-tags');
		assert.ok(extension);

		// Ensure extension is activated
		if (!extension!.isActive) {
			await extension!.activate();
		}

		// Extension should activate without errors
		assert.strictEqual(extension!.isActive, true);
	});
});
