import tmrm = require('azure-pipelines-task-lib/mock-run');
import path = require('path');
import process from "process";

const taskPath = path.join(__dirname, '..', 'index.js');
const tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

// Setup mock environment
tmr.setInput("tenantName", process.env.CX_TENANT!);
tmr.setInput("CheckmarxService", "cxauth");
tmr.registerMockExport('getEndpointUrl', () => { return process.env.CX_BASE_URI!; });
tmr.registerMockExport('getEndpointAuthorizationParameter', (endpoint, key) => {
    if (key === 'username') return process.env.CX_CLIENT_ID!
    if (key === 'password') return process.env.CX_CLIENT_SECRET!
    return "";
});

// Set inputs that will trigger the results generation path
tmr.setInput("projectName", 'Test_Results_Generation');
tmr.setInput("branchName", 'main');
tmr.setInput("additionalParams", '--scan-types sast');

// Mock the temp directory to be invalid to trigger error handling
tmr.setVariable('Agent.TempDirectory', '/invalid/path');

tmr.run();