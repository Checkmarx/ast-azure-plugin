import * as taskLib from "azure-pipelines-task-lib/task";
import {CxConfig} from "@Checkmarx/ast-cli-javascript-wrapper-runtime-cli/dist/main/wrapper/CxConfig";
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
    if (endpointId) {
        const tenantName = taskLib.getInput("tenantName");
        if (tenantName) cxScanConfig.tenant = tenantName;
        const astServerUrl = taskLib.getEndpointUrl(endpointId, true);
        const astUsername = taskLib.getEndpointAuthorizationParameter(endpointId, 'username', true);
        const astPassword = taskLib.getEndpointAuthorizationParameter(endpointId, 'password', true);
        const apiKey = taskLib.getEndpointAuthorizationParameter(endpointId, 'apitoken', true);
        if (!apiKey && !(astUsername && astPassword)) {
            console.log("No API key or client ID and secret configured");
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
