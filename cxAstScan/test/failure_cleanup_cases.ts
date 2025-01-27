import tmrm = require('azure-pipelines-task-lib/mock-run');
import path = require('path');
import process from "process";
import fs from 'fs';

// Mock environment variables
process.env['Build_BuildId'] = 'test_build_id';
process.env["AGENT_JOBSTATUS"] = 'Canceled';

const taskPath = path.join(__dirname, '..', 'cleanup.js');
const tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

// Setup basic mock environment
tmr.setInput("tenantName", "test-tenant");
tmr.setInput("CheckmarxService", "cxauth");

// Mock authentication failure case
tmr.registerMockExport('getEndpointUrl', () => { return ""; });
tmr.registerMockExport('getEndpointAuthorizationParameter', () => { return ""; });

// Mock temp directory with invalid path to trigger file access errors
tmr.registerMockExport('getVariable', (name: string) => {
    if (name === 'Agent.TempDirectory') return '/invalid/path';
    if (name === 'AGENT_JOBSTATUS') return 'Canceled';
    if (name === 'Build.BuildId') return 'test_build_id';
    return '';
});

// Create a mock log file with invalid scan ID
const mockLogContent = JSON.stringify({ "ID": "invalid-scan-id" });
const mockLogPath = path.join('/invalid/path', 'CxLog_test_build_id.txt');

// Mock fs module
tmr.registerMock('fs', {
    ...fs,
    promises: {
        readFile: async (path: string) => {
            if (path === mockLogPath) {
                throw { code: 'EACCES' }; // Simulate permission error
            }
            return mockLogContent;
        },
        unlink: async (path: string) => {
            throw new Error('Mock file deletion error');
        }
    }
});

tmr.run();