import tmrm = require('azure-pipelines-task-lib/mock-run');
import path = require('path');


let taskPath = path.join(__dirname, '..', 'index.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);
tmr.setInput("projectName", 'TestADO_NoWait');
tmr.setInput("branchName", 'dummy_branch');
tmr.setInput("additionalParams", '--async --file-filter "*.ts"');
tmr.run();