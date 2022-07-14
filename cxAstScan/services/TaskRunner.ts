import * as taskLib from "azure-pipelines-task-lib/task";
import * as path from "path"
import {CxWrapper} from "@checkmarxdev/ast-cli-javascript-wrapper";
import {CxCommandOutput} from "@checkmarxdev/ast-cli-javascript-wrapper/dist/main/wrapper/CxCommandOutput";
import {CxParamType} from "@checkmarxdev/ast-cli-javascript-wrapper/dist/main/wrapper/CxParamType";
import CxScan from "@checkmarxdev/ast-cli-javascript-wrapper/dist/main/scan/CxScan";
import { getConfiguration, getLogFilename } from "./Utils";

export class TaskRunner {

    async run() {
        const cxScanConfig = getConfiguration();

        const projectName = taskLib.getInput('projectName', true) || '';
        const branchName = taskLib.getInput('branchName', true) || '';
        const additionalParams = taskLib.getInput("additionalParams") || '';

        const params: Map<CxParamType, string> = new Map<CxParamType, string>();
        params.set(CxParamType.PROJECT_NAME, projectName);
        params.set(CxParamType.BRANCH, branchName);
        params.set(CxParamType.AGENT, "Azure DevOps");
        params.set(CxParamType.ADDITIONAL_PARAMETERS, additionalParams);
        params.set(CxParamType.S, ".");

        console.log("Project name: " + projectName);
        console.log("Branch name: " + branchName);
        console.log("Agent: " + params.get(CxParamType.AGENT));
        console.log("Additional Params: " + additionalParams);


        try {        
            //Write to file to test if possible to read from file in cleanup post execution event
            
            const wrapper = new CxWrapper(cxScanConfig, getLogFilename());

            const cxCommandOutput: CxCommandOutput = await wrapper.scanCreate(params);

            if (cxCommandOutput.payload) {
                console.log("Completed scan.");
                console.log("Generating results.");
                const agentTempDirectory = taskLib.getVariable('Agent.TempDirectory');
                const scan: CxScan = cxCommandOutput.payload.pop();

                if (agentTempDirectory && scan && scan.id) {
                    await this.generateResults(wrapper, agentTempDirectory, scan.id);
                }
            }

            taskLib.setResult(cxCommandOutput.exitCode == 0 ?
                taskLib.TaskResult.Succeeded : taskLib.TaskResult.Failed, "");

        } catch (err) {
            console.log("Error creating scan: " + err + " " + Date.now().toString())
            taskLib.setResult(taskLib.TaskResult.Failed, JSON.stringify(err));
        }
    }

    async generateResults(wrapper: CxWrapper, directory: string, scanId: string) {
        try {
            const pathname = path.join(directory, 'cxASTResults.html');

            const cxCommandOutput: CxCommandOutput = await wrapper.getResults(scanId, "summaryHTML", "cxASTResults", directory);
            if (cxCommandOutput.exitCode == 0) {
                taskLib.addAttachment("HTML_ATTACHMENT_TYPE", "cxASTResults", pathname);
            }
        } catch (err) {
            console.log("Error generating the results: " + err)
        }
    }
}

