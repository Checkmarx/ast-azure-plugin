import {TaskMockRunner} from "azure-pipelines-task-lib/mock-run"
let path = require('path');
let taskPath = path.join(__dirname, '..', 'index.js');
let tmr = new TaskMockRunner(taskPath);
// tmr.setVariableName('CX_CLIENT_ID', 'CxFlow');
tmr.setInput("projectName","TestJayADO1")
tmr.setInput("tenantName","organization")
let clientID = process.env["CX_CLIENT_ID"];
let clientSecret = process.env["CX_CLIENT_SECRET"];
let baseUri = process.env["CX_BASE_URI"];
tmr.setInput("additionalParams"," --client-id " +  clientID +  " --client-secret " + clientSecret +  " --base-uri " + baseUri + " --scan-types sast --filters *.ts")
tmr.run();