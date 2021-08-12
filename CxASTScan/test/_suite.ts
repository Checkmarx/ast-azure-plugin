import * as path from 'path';
import * as ttm from 'azure-pipelines-task-lib/mock-test';
import {MockTestRunner} from 'azure-pipelines-task-lib/mock-test';
import assert = require("assert");
import CxScan from "@checkmarxdev/ast-cli-javascript-wrapper/dist/main/CxScan";

describe('Task runner test', function () {

    it('should be success no wait mode', function () {
        this.timeout(300000);
        let tp = path.join(__dirname, 'success_nowait.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        tr.run(10);

        const scanObject = getScanObject(tr);
        assert.deepStrictEqual(scanObject.Status, "Queued");
        assert.ok(tr.succeeded);
    });

    it('should be success wait mode', function () {
        this.timeout(300000);
        let tp = path.join(__dirname, 'success_waitmode.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        tr.run(10);

        const scanObject = getScanObject(tr);
        assert.deepStrictEqual(scanObject.Status, "Queued");
        assert.ok(tr.succeeded);

    });

    it('should be failure additional params', function () {
        this.timeout(300000);
        let tp = path.join(__dirname, 'failure_additional_params.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        tr.run(10);

        assert.ok(tr.failed);
    });

    it('should be failure preset', function () {
        this.timeout(300000);
        let tp = path.join(__dirname, 'failure_wrong_preset.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        tr.run(10);

        const scanObject = getScanObject(tr);
        assert.deepStrictEqual(scanObject.Status, "Queued");
        assert.ok(tr.failed);
    });

});

function getScanObject(tr: MockTestRunner): CxScan {
    const logs = tr.stdout.split('\n');
    const jsonString = logs.filter((log) => {
        return log && isJsonString(log);
    });
    if (jsonString[0]) {
        console.log("Scan json: " + jsonString);
        return JSON.parse(jsonString[0]);
    }
}

function isJsonString(s: string) {
    try {
        let stringObject = s.split('\n')[0];
        JSON.parse(stringObject);
    } catch (e) {
        return false;
    }
    return true;
}