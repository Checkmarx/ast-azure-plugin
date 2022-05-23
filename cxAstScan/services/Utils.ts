import * as taskLib from "azure-pipelines-task-lib/task";
import { CxConfig } from "@checkmarxdev/ast-cli-javascript-wrapper/dist/main/wrapper/CxConfig";
import * as path from "path"

export function getLogFilename(): string {
    const tempAgentDir = taskLib.getVariable('Agent.TempDirectory');
    const buildId = taskLib.getVariable('Build.BuildId');
    const pathname = path.join(tempAgentDir !== undefined ? tempAgentDir : "", "CxLog_" + buildId + ".txt");

    return pathname;
}

export function getConfiguration() {
    const cxScanConfig = new CxConfig();
    cxScanConfig.baseUri = "";
    cxScanConfig.clientId = "";
    cxScanConfig.clientSecret = "";
    cxScanConfig.apiKey = "";
    cxScanConfig.tenant = "";

    const tenantName = taskLib.getInput("tenantName");
    if (tenantName) cxScanConfig.tenant = tenantName;

    const endpointId = taskLib.getInput('CheckmarxService', false);
    if (endpointId) {
        const astServerUrl = taskLib.getEndpointUrl(endpointId, false);
        const astUsername = taskLib.getEndpointAuthorizationParameter(endpointId, 'username', false);
        const astPassword = taskLib.getEndpointAuthorizationParameter(endpointId, 'password', false);

        if (astServerUrl) {
            cxScanConfig.baseUri = astServerUrl;
        }
        if (astUsername) {
            cxScanConfig.clientId = astUsername;
        }
        if (astPassword) {
            cxScanConfig.clientSecret = astPassword;
        }
    }
    return cxScanConfig;
}