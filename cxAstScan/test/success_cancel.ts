import tmrm = require('azure-pipelines-task-lib/mock-run');
import path = require('path');
import process from "process";

process.env['Build_BuildId'] = 'test_build_id';
process.env["AGENT_JOBSTATUS"] = 'Canceled';

const taskPath = path.join(__dirname, '..', 'cleanup.js');
const tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

tmr.setInput("tenantName", process.env.CX_TENANT!);
tmr.setInput("CheckmarxService", "cxauth");
tmr.registerMockExport('getEndpointUrl', () => { return  process.env.CX_BASE_URI!; });
tmr.registerMockExport('getEndpointAuthorizationParameter', (endpoint, key) => {
    if (key === 'username') return process.env.CX_CLIENT_ID!
    if (key === 'password') return process.env.CX_CLIENT_SECRET!

    return "";
});

tmr.run();
