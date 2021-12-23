import * as path from 'path';
import * as ttm from 'azure-pipelines-task-lib/mock-test';
import * as assert from 'assert';


describe('Task runner test', function () {

    it('should be success wait mode', function (done) {
        this.timeout(3000000);
        const tp = path.join(__dirname, 'success_waitmode.js');
        const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        tr.run(10);

        console.log(tr.stdout)
        console.log(tr.stderr)
        assert.ok(tr.succeeded);
        done();
    });

    it('should be success no wait mode', function (done) {
        this.timeout(300000);
        const tp = path.join(__dirname, 'success_nowait.js');
        const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        tr.run(10);

        console.log(tr.stdout)
        console.log(tr.stderr)
        assert.ok(tr.succeeded);
        done();
    });

    it('should be failure additional params', function (done) {
        this.timeout(300000);
        const tp = path.join(__dirname, 'failure_additional_params.js');
        const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        tr.run(10);
        console.log(tr.stdout)
        console.log(tr.stderr)
        assert.ok(tr.failed);
        done();
    });

    it('should be failure preset', function (done) {
        this.timeout(300000);
        const tp = path.join(__dirname, 'failure_wrong_preset.js');
        const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        tr.run(10);

        console.log(tr.stdout)
        console.log(tr.stderr)
        assert.ok(tr.failed);
        done();
    });
});