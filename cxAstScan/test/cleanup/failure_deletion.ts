import tmrm = require('azure-pipelines-task-lib/mock-run');
import path = require('path');
import process from "process";
import fs from 'fs';

process.env['Build_BuildId'] = 'test_build_id';
process.env["AGENT_JOBSTATUS"] = 'Canceled';

const taskPath = path.join(__dirname, '..', '..', 'cleanup.js');
const tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

tmr.setInput("tenantName", "test-tenant");
tmr.setInput("CheckmarxService", "cxauth");

// Mock fs module for deletion error
tmr.registerMock('fs', {
    ...fs,
    promises: {
        readFile: async () => JSON.stringify({ "ID": "test-scan-id" }),
        unlink: async () => {
            throw new Error('Mock file deletion error');
        }
    }
});

tmr.run();