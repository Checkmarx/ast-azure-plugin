import * as path from 'path';
//import * as assert from 'assert';
import * as ttm from 'azure-pipelines-task-lib/mock-test';
import CxScan from "@checkmarxdev/ast-cli-javascript-wrapper/dist/main/CxScan";
import assert = require("assert");
//import assert = require("assert");
//import CxScan from "@checkmarxdev/ast-cli-javascript-wrapper/dist/main/CxScan";

describe('Task runner test', function () {

    it('should be success', function(done: Mocha.Done) {
        this.timeout(300000);

        let tp = path.join(__dirname, 'success.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
       // let val:CxScan;
        tr.run();
        console.log(tr.succeeded);
        console.log(tr.stdout);
        const temp = tr.stdout.split('\n');
        if(isJsonString(temp[temp.length-2])) {
            const val: CxScan = JSON.parse(temp[temp.length - 2]);
            console.log(val);
            assert.strictEqual(val.Status, "Queued");
        }


       //assert.equal(tr.stdout.indexOf('Hello human') >= 0, true, "should display Hello human");
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