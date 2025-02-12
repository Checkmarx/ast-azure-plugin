import * as taskLib from "azure-pipelines-task-lib/task";
import * as path from "path";
import { CxWrapper } from "@checkmarxdev/ast-cli-javascript-wrapper-runtime-cli";
import { CxCommandOutput } from "@checkmarxdev/ast-cli-javascript-wrapper-runtime-cli/dist/main/wrapper/CxCommandOutput";
import { CxParamType } from "@checkmarxdev/ast-cli-javascript-wrapper-runtime-cli/dist/main/wrapper/CxParamType";
import CxScan from "@checkmarxdev/ast-cli-javascript-wrapper-runtime-cli/dist/main/scan/CxScan";
import { getConfiguration, getLogFilename } from "./Utils";
import CxWrapperFactory from "@checkmarxdev/ast-cli-javascript-wrapper-runtime-cli/dist/main/wrapper/CxWrapperFactory";

export class TaskRunner {
    cxWrapperFactory = new CxWrapperFactory();

    async run() {
        const cxScanConfig = getConfiguration();

        const projectName = taskLib.getInput('projectName', true) || '';
        const branchName = taskLib.getInput('branchName', true) || '';
        let additionalParams = taskLib.getInput("additionalParams") || '';
        let fileSource: string | undefined;

        if (additionalParams) {
            const extraction = this.extractFileSource(additionalParams);
            additionalParams = extraction.updatedParams;
            fileSource = extraction.fileSource;
        }

        const params: Map<CxParamType, string> = new Map<CxParamType, string>();
        params.set(CxParamType.PROJECT_NAME, projectName);
        params.set(CxParamType.BRANCH, branchName);
        params.set(CxParamType.AGENT, "Azure DevOps");
        params.set(CxParamType.ADDITIONAL_PARAMETERS, additionalParams);

        if (fileSource) {
            params.set(CxParamType.SOURCES, fileSource);
        } else {
            params.set(CxParamType.S, ".");
        }

        console.log("Project name: " + projectName);
        console.log("Branch name: " + branchName);
        console.log("Agent: " + params.get(CxParamType.AGENT));
        console.log("Additional Params: " + additionalParams);

        try {
            // Write to file to test if possible to read from file in cleanup post execution event
            const wrapper = await this.cxWrapperFactory.createWrapper(cxScanConfig, getLogFilename());

            const cxCommandOutput: CxCommandOutput = await wrapper.scanCreate(params);

            if (cxCommandOutput.payload) {
                console.log("Completed scan.");
                console.log("Generating results.");
                const agentTempDirectory = taskLib.getVariable('Agent.TempDirectory');
                const scan: CxScan = cxCommandOutput.payload.pop();

                if (agentTempDirectory && scan && scan.id) {
                    taskLib.setVariable("CxOneScanId", scan.id);
                    await this.generateResults(wrapper, agentTempDirectory, scan.id);
                }
            }

            taskLib.setResult(
                cxCommandOutput.exitCode == 0
                    ? taskLib.TaskResult.Succeeded
                    : taskLib.TaskResult.Failed,
                ""
            );
        } catch (err) {
            console.log("Error creating scan: " + err + " " + Date.now().toString());
            taskLib.setResult(taskLib.TaskResult.Failed, JSON.stringify(err));
        }
    }

    async generateResults(wrapper: CxWrapper, directory: string, scanId: string) {
        try {
            const pathname = path.join(directory, 'cxASTResults.html');

            const cxCommandOutput: CxCommandOutput = await wrapper.getResults(
                scanId,
                "summaryHTML",
                "cxASTResults",
                directory
            );
            if (cxCommandOutput.exitCode == 0) {
                taskLib.addAttachment("HTML_ATTACHMENT_TYPE", "cxASTResults", pathname);
            }
        } catch (err) {
            console.log("Error generating the results: " + err);
        }
    }

    tokenize(input: string): string[] {
        return input.trim().split(/\s+/);
    }

    extractFlagValue(
        tokens: string[],
        flags: string[]
    ): { value?: string; tokens: string[] } {
        let value: string | undefined;
        const remainingTokens: string[] = [];

        for (let i = 0; i < tokens.length; i++) {
            if (flags.includes(tokens[i])) {
                // Check if there is a value after the flag.
                if (i + 1 < tokens.length) {
                    value = tokens[i + 1];
                    i++; // Skip the next token since it's the flag's value.
                } else {
                    throw new Error(`Flag "${tokens[i]}" provided without a corresponding value.`);
                }
            } else {
                remainingTokens.push(tokens[i]);
            }
        }

        return { value, tokens: remainingTokens };
    }

    extractFileSource(additionalParams: string): { updatedParams: string; fileSource?: string } {
        if (!additionalParams) {
            return { updatedParams: '' };
        }

        // Tokenize the parameters string.
        const tokens = this.tokenize(additionalParams);

        // Extract the file-source flag value.
        const { value: fileSource, tokens: remainingTokens } = this.extractFlagValue(tokens, [
            '-s',
            '--file-source'
        ]);

        return { updatedParams: remainingTokens.join(' '), fileSource };
    }
}
