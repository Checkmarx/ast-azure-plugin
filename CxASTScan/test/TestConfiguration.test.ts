import {TaskRunner} from "../services/TaskRunner";
import * as sinon from 'sinon';
import taskLib = require('azure-pipelines-task-lib/task');


describe("Task Runner test", function () {

    function init(input: {[key: string]: string}) {
        sinon.stub(taskLib, "getEndpointAuthorizationParameter").callsFake((id: string, key: string, optional: boolean) => {
            return input[key] || undefined;
        });
        sinon.stub(taskLib, "getEndpointUrl").callsFake((i: string | number | boolean, ) => { return input["CX_BASE_URI"] || undefined; })
        sinon.stub(taskLib, "getInput").callsFake((i: string, ) =>  { return input[i] || undefined; })
        sinon.stub(taskLib, "getBoolInput").callsFake((i: string, ) =>  { return input[i] === 'true' || undefined; })
    }

    function setupInput(): {[key: string]: string} {
        const inputs: {[key: string]: string} = {};
        inputs["projectName"] = 'TestJayADO';
        inputs["enableSastScan"] = "true";
        inputs["username"] = process.env["CX_CLIENT_ID"];
        inputs["password"] = process.env["CX_CLIENT_SECRET"];
        inputs["CX_BASE_URI"] = process.env["CX_BASE_URI"];
        inputs["CheckmarxService"] = "myProperties";

        return inputs;
    }

    it("Return scan object", async function (done: Mocha.Done) {
        this.timeout(300000);
        const inputs = setupInput();
        init(inputs)

        let tmr = new TaskRunner();

        await tmr.run();
        done();
    });
});
