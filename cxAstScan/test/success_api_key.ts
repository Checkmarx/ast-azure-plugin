import tmrm = require('azure-pipelines-task-lib/mock-run');
import path = require('path');
import process from "process";

process.env['Build_BuildId'] = 'test_build_id';

const taskPath = path.join(__dirname, '..', 'index.js');
const tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);
tmr.setInput("tenantName", process.env.CX_TENANT!);
tmr.setInput("CheckmarxService", "cxauth");
tmr.registerMockExport('getEndpointUrl', () => { return  process.env.CX_BASE_URI!; });
tmr.registerMockExport('getEndpointAuthorizationParameter', (endpoint, key) => {
    if (key === 'apitoken') return process.env.CX_API_KEY
    return "";
});
tmr.setInput("projectName", 'TestADO_NoWait');
tmr.setInput("branchName", 'dummy_branch');
tmr.setInput("additionalParams", '--async --file-filter "*.ts"');
tmr.run();

