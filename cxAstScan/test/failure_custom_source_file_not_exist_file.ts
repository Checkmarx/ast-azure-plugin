import tmrm = require('azure-pipelines-task-lib/mock-run');
import path = require('path');
import * as process from "process";

const taskPath = path.join(__dirname, '..', 'index.js');
const tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);
tmr.setInput("tenantName", process.env.CX_TENANT!);
tmr.setInput("CheckmarxService", "cxauth");
tmr.registerMockExport('getEndpointUrl', () => { return  process.env.CX_BASE_URI!; });
tmr.registerMockExport('getEndpointAuthorizationParameter', (endpoint, key) => {
    if (key === 'username') return process.env.CX_CLIENT_ID!
    if (key === 'password') return process.env.CX_CLIENT_SECRET!

    return "";
});

tmr.setInput("projectName", 'TestADO_CustomSourceFile');
tmr.setInput("branchName", 'main');
tmr.setInput("additionalParams", '-s "cxAstScan/test/data/notExistsFile.zip" --scan-types iac-security');
tmr.run();