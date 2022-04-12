import * as taskLib from "azure-pipelines-task-lib/task";
import * as path from "path"
import {CxWrapper} from "@checkmarxdev/ast-cli-javascript-wrapper";
import {CxCommandOutput} from "@checkmarxdev/ast-cli-javascript-wrapper/dist/main/wrapper/CxCommandOutput";
import {CxParamType} from "@checkmarxdev/ast-cli-javascript-wrapper/dist/main/wrapper/CxParamType";
import {CxConfig} from "@checkmarxdev/ast-cli-javascript-wrapper/dist/main/wrapper/CxConfig";
import CxScan from "@checkmarxdev/ast-cli-javascript-wrapper/dist/main/scan/CxScan";

export class TaskRunner {
    private cxScanConfig = new CxConfig();

    async run() {
        this.cxScanConfig = this.initiateScanConfig();

        const projectName = taskLib.getInput('projectName', true) || '';
        const branchName = taskLib.getInput('branchName', true) || '';
        const additionalParams = taskLib.getInput("additionalParams") || '';

        let params: Map<CxParamType, string> = new Map<CxParamType, string>();
        params.set(CxParamType.PROJECT_NAME, projectName);
        params.set(CxParamType.BRANCH, branchName);
        params.set(CxParamType.AGENT, "Azure DevOps");
        params.set(CxParamType.ADDITIONAL_PARAMETERS, additionalParams);
        params.set(CxParamType.S, ".");

        console.log("Project name: " + projectName);
        console.log("Branch name: " + branchName);
        console.log("Agent: " + params.get(CxParamType.AGENT));
        console.log("Additional Params: " + additionalParams);

        const wrapper = new CxWrapper(this.cxScanConfig);

        try {
            const cxCommandOutput: CxCommandOutput = await wrapper.scanCreate(params);
            console.log("Completed scan.");

            if (cxCommandOutput.exitCode == 0) {
                console.log("Generating results.");
                const agentTempDirectory = taskLib.getVariable('Agent.TempDirectory');
                const scan : CxScan = cxCommandOutput.payload.pop();

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

    private initiateScanConfig() {
        this.cxScanConfig.baseUri = "";
        this.cxScanConfig.clientId = "";
        this.cxScanConfig.clientSecret = "";
        this.cxScanConfig.apiKey = "";
        this.cxScanConfig.tenant = "";

        const tenantName = taskLib.getInput("tenantName");
        if (tenantName) this.cxScanConfig.tenant = tenantName;

        const endpointId = taskLib.getInput('CheckmarxService', false);
        if (endpointId) {
            const astServerUrl = taskLib.getEndpointUrl(endpointId, false);
            const astUsername = taskLib.getEndpointAuthorizationParameter(endpointId, 'username', false);
            const astPassword = taskLib.getEndpointAuthorizationParameter(endpointId, 'password', false);

            if (astServerUrl) {
                this.cxScanConfig.baseUri = astServerUrl;
            }
            if (astUsername) {
                this.cxScanConfig.clientId = astUsername;
            }
            if (astPassword) {
                this.cxScanConfig.clientSecret = astPassword;
            }
        }
        return this.cxScanConfig;
    }
}

