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

// Mock temp directory with invalid path
tmr.registerMockExport('getVariable', (name: string) => {
    if (name === 'Agent.TempDirectory') return '/invalid/path';
    if (name === 'AGENT_JOBSTATUS') return 'Canceled';
    if (name === 'Build.BuildId') return 'test_build_id';
    return '';
});

// Mock fs module for permission error
tmr.registerMock('fs', {
    ...fs,
    promises: {
        readFile: async () => {
            throw { code: 'EACCES' }; // Simulate permission error
        }
    }
});

tmr.run();