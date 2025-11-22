import * as path from 'path';
import Mocha from 'mocha';
import * as glob from 'glob';

export async function run(): Promise<void> {
	// Create the mocha test
	const mocha = new Mocha({
		ui: 'tdd',
		color: true
	});

	const testsRoot = path.resolve(__dirname, '..');

	try {
		// Find all test files using callback-based API wrapped in promise
		const files = await new Promise<string[]>((resolve, reject) => {
			glob.glob('**/**.test.js', { cwd: testsRoot }, (err, matches) => {
				if (err) {
					reject(err);
				} else {
					resolve(matches);
				}
			});
		});

		// Add files to the test suite
		files.forEach((f: string) => mocha.addFile(path.resolve(testsRoot, f)));

		// Run the mocha test
		return new Promise<void>((resolve, reject) => {
			try {
				mocha.run((failures: number) => {
					if (failures > 0) {
						reject(new Error(`${failures} tests failed.`));
					} else {
						resolve();
					}
				});
			} catch (err) {
				console.error(err);
				reject(err);
			}
		});
	} catch (err) {
		console.error('Failed to load test files:', err);
		throw err;
	}
}
