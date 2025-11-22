/**
 * Test runner for VS Code extension integration tests.
 * This script launches a VS Code instance with the extension loaded and runs the test suite.
 */

import * as path from "path";
import { runTests } from "@vscode/test-electron";

/**
 * Main function to execute extension tests.
 * Downloads VS Code if needed, loads the extension, and runs all tests in the suite.
 */
async function main() {
  try {
    // The folder containing the Extension Manifest package.json
    // Passed to `--extensionDevelopmentPath`
    const extensionDevelopmentPath = path.resolve(__dirname, "../../");

    // The path to the extension test script
    // Passed to --extensionTestsPath
    const extensionTestsPath = path.resolve(__dirname, "./suite/index");

    // Download VS Code, unzip it and run the integration test
    // This will launch a headless VS Code instance with the extension loaded
    await runTests({ extensionDevelopmentPath, extensionTestsPath });
  } catch (err) {
    // Exit with error code if tests fail
    console.error("Failed to run tests:", err);
    process.exit(1);
  }
}

// Execute the test runner
main();
