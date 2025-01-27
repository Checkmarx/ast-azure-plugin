import tmrm = require('azure-pipelines-task-lib/mock-run');
import path = require('path');
import process from "process";

const taskPath = path.join(__dirname, '..', 'index.js');
const tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

// Setup minimal configuration without auth parameters
tmr.setInput("tenantName", process.env.CX_TENANT!);
tmr.setInput("CheckmarxService", "cxauth");
tmr.registerMockExport('getEndpointUrl', () => { return process.env.CX_BASE_URI!; });
tmr.registerMockExport('getEndpointAuthorizationParameter', () => { return ""; });

tmr.setInput("projectName", 'Test_Auth_Failure');
tmr.setInput("branchName", 'main');

tmr.run();