import * as taskLib from "azure-pipelines-task-lib/task";
import {CxConfig} from "@checkmarx/ast-cli-javascript-wrapper-runtime-cli/dist/main/wrapper/CxConfig";
import * as path from "path"

export function getLogFilename(): string {
    const tempAgentDir = taskLib.getVariable('Agent.TempDirectory');
    const buildId = taskLib.getVariable('Build.BuildId');
    return path.join(tempAgentDir !== undefined ? tempAgentDir : "", "CxLog_" + buildId + ".txt");
}

export function getConfiguration() {
    const cxScanConfig = new CxConfig();
    cxScanConfig.baseUri = "";
    cxScanConfig.clientId = "";
    cxScanConfig.clientSecret = "";
    cxScanConfig.apiKey = "";
    cxScanConfig.tenant = "";

    const endpointId = taskLib.getInput('CheckmarxService', false);
    let astServerUrl;
    let astUsername;
    let astPassword;
    let apiKey;
    if (endpointId) {
        const tenantName = taskLib.getInput("tenantName");
        if (tenantName) cxScanConfig.tenant = tenantName;
        try {
            astServerUrl = taskLib.getEndpointUrl(endpointId, false);
            astUsername = taskLib.getEndpointAuthorizationParameter(endpointId, 'username', false);
            astPassword = taskLib.getEndpointAuthorizationParameter(endpointId, 'password', false);    
        } catch (error) {
            console.log("No client ID and secret configured");
        }
        try {
            apiKey = taskLib.getEndpointAuthorizationParameter(endpointId, 'apitoken', false);
        } catch (error) {
            console.log("No API Key configured");
        }
        if (astServerUrl) {
            cxScanConfig.baseUri = astServerUrl;
        }
        if (astUsername) {
            cxScanConfig.clientId = astUsername;
        }
        if (astPassword) {
            cxScanConfig.clientSecret = astPassword;
        }
        if (apiKey) {
            cxScanConfig.apiKey = apiKey;
        }
    }
    return cxScanConfig;
}