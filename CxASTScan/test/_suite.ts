import * as path from 'path';
import * as ttm from 'azure-pipelines-task-lib/mock-test';
import CxScan from "@checkmarxdev/ast-cli-javascript-wrapper/dist/main/CxScan";
import assert = require("assert");
import {MockTestRunner} from "azure-pipelines-task-lib/mock-test";

function runQueuedCase(tr: MockTestRunner) {
    const temp = tr.stdout.split('\n');
    if(isJsonString(temp[temp.length-2])) {
        const val: CxScan = JSON.parse(temp[temp.length - 2]);
        console.log(val);
        return val;
    }

}

describe('Task runner test', function () {

    it('should be success no wait mode', function(done: Mocha.Done) {
        this.timeout(300000);
        let tp = path.join(__dirname, 'success_nowait.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        tr.run();
        console.log(tr.succeeded);
        const status = runQueuedCase(tr);
        assert.deepStrictEqual(status.Status,"Queued");
        done();
    });

    it('should be success wait mode', async function (done: Mocha.Done) {
        this.timeout(300000);
        let tp = path.join(__dirname, 'success_waitmode.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        tr.run();
        const status = runQueuedCase(tr);
        assert.deepStrictEqual(status.Status,"Queued");
        assert.ok(tr.succeeded);
        done();

    });

    it('should be failure additional params', async function (done: Mocha.Done) {
        this.timeout(300000);
        let tp = path.join(__dirname, 'failure_additional_params.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        tr.run();
        const status = runQueuedCase(tr);
        assert.deepStrictEqual(status.Status,"Queued");
        assert.ok(tr.failed);
        done();

    });

    it('should be failure preset', async function (done: Mocha.Done) {
        this.timeout(300000);
        let tp = path.join(__dirname, 'failure_wrong_preset.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        tr.run();
        const status = runQueuedCase(tr);
        assert.deepStrictEqual(status.Status,"Queued");
        assert.ok(tr.failed);
        done();

    });

});

function isJsonString(s: string) {
    try {
        let stringObject = s.split('\n')[0];
        JSON.parse(stringObject);
    } catch (e) {
        return false;
    }
    return true;
}