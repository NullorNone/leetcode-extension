// Copyright (c) jdneo. All rights reserved.
// Licensed under the MIT license.

import * as fse from "fs-extra";
import * as vscode from "vscode";
import { executeService } from "../service/ExecuteService";
import { eventContorller } from "../controller/EventController";
import { IQuickItemEx, UserStatus } from "../model/Model";
import { isWindows, usingCmd } from "../utils/osUtils";
import { DialogType, promptForOpenOutputChannel, showFileSelectDialog } from "../utils/uiUtils";
import { getActiveFilePath } from "../utils/workspaceUtils";
import * as wsl from "../utils/wslUtils";
import { submissionService } from "../service/SubmissionService";
import { statusBarService } from "../service/StatusBarService";

export async function testSolution(uri?: vscode.Uri): Promise<void> {
    try {
        if (statusBarService.getStatus() === UserStatus.SignedOut) {
            return;
        }

        const filePath: string | undefined = await getActiveFilePath(uri);
        if (!filePath) {
            return;
        }
        const picks: Array<IQuickItemEx<string>> = [];
        picks.push(
            {
                label: "$(three-bars) Default test cases",
                description: "",
                detail: "Test with the default cases",
                value: ":default",
            },
            {
                label: "$(pencil) Write directly...",
                description: "",
                detail: "Write test cases in input box",
                value: ":direct",
            },
            {
                label: "$(file-text) Browse...",
                description: "",
                detail: "Test with the written cases in file",
                value: ":file",
            },
            {
                label: "All Default test cases...",
                description: "",
                detail: "Test with the all default cases",
                value: ":alldefault",
            },
        );
        const choice: IQuickItemEx<string> | undefined = await vscode.window.showQuickPick(picks);
        if (!choice) {
            return;
        }

        let result: string | undefined;
        switch (choice.value) {
            case ":default":
                result = await executeService.testSolution(filePath);
                break;
            case ":direct":
                const testString: string | undefined = await vscode.window.showInputBox({
                    prompt: "Enter the test cases.",
                    validateInput: (s: string): string | undefined => s && s.trim() ? undefined : "Test case must not be empty.",
                    placeHolder: "Example: [1,2,3]\\n4",
                    ignoreFocusOut: true,
                });
                if (testString) {
                    result = await executeService.testSolution(filePath, parseTestString(testString));
                }
                break;
            case ":file":
                const testFile: vscode.Uri[] | undefined = await showFileSelectDialog(filePath);
                if (testFile && testFile.length) {
                    const input: string = (await fse.readFile(testFile[0].fsPath, "utf-8")).trim();
                    if (input) {
                        result = await executeService.testSolution(filePath, parseTestString(input.replace(/\r?\n/g, "\\n")));
                    } else {
                        vscode.window.showErrorMessage("The selected test file must not be empty.");
                    }
                }
                break;
            case ":alldefault":
                result = await executeService.testSolution(filePath, undefined, true);
                break;
            default:
                break;
        }
        if (!result) {
            return;
        }
        submissionService.show(result);
        eventContorller.emit("submit", submissionService.getSubmitEvent());
    } catch (error) {
        await promptForOpenOutputChannel("Failed to test the solution. Please open the output channel for details.", DialogType.error);
    }
}

export async function testSolutionDefault(uri?: vscode.Uri, allCase?: boolean): Promise<void> {
    try {
        if (statusBarService.getStatus() === UserStatus.SignedOut) {
            return;
        }

        const filePath: string | undefined = await getActiveFilePath(uri);
        if (!filePath) {
            return;
        }

        let result: string | undefined = await executeService.testSolution(filePath, undefined, allCase || false);
        if (!result) {
            return;
        }
        submissionService.show(result);
        eventContorller.emit("submit", submissionService.getSubmitEvent());
    } catch (error) {
        await promptForOpenOutputChannel("Failed to test the solution. Please open the output channel for details.", DialogType.error);
    }
}


function parseTestString(test: string): string {
    if (wsl.useWsl() || !isWindows()) {
        if (wsl.useVscodeNode()) {
            return `${test}`;
        }
        return `'${test}'`;
    }

    // In windows and not using WSL
    if (usingCmd()) {
        // 一般需要走进这里, 除非改了 环境变量ComSpec的值
        if (wsl.useVscodeNode()) {
            return `${test.replace(/"/g, '\"')}`;
        }
        return `"${test.replace(/"/g, '\\"')}"`;
    } else {
        if (wsl.useVscodeNode()) {
            return `${test.replace(/"/g, '\"')}`;
        }
        return `'${test.replace(/"/g, '\\"')}'`;
    }
}
