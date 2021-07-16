import tmrm = require('azure-pipelines-task-lib/mock-run');
import path = require('path');


let taskPath = path.join(__dirname, '..', 'index.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);
tmr.setInput("projectName", 'TestJayADO_NoWait');
tmr.setInput("enableSastScan", 'true');
tmr.setInput("zipFileFilter", '*.ts');
tmr.setInput("additionalParams", '--nowait');
tmr.run();