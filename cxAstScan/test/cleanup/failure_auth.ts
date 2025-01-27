import tmrm = require('azure-pipelines-task-lib/mock-run');
import path = require('path');
import process from "process";

process.env['Build_BuildId'] = 'test_build_id';
process.env["AGENT_JOBSTATUS"] = 'Canceled';

const taskPath = path.join(__dirname, '..', '..', 'cleanup.js');
const tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

tmr.setInput("tenantName", "test-tenant");
tmr.setInput("CheckmarxService", "cxauth");

// Mock authentication failure
tmr.registerMockExport('getEndpointUrl', () => { return ""; });
tmr.registerMockExport('getEndpointAuthorizationParameter', () => { return ""; });

tmr.run();