import * as path from 'path';
import * as ttm from 'azure-pipelines-task-lib/mock-test';
import * as assert from 'assert';


describe('Task runner test', function () {

    // it('should be success wait mode', function (done) {
    //     this.timeout(3000000);
    //     const tp = path.join(__dirname, 'success_waitmode.js');
    //     const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
    //     tr.run(10);

    //     console.log(tr.stdout)
    //     console.log(tr.stderr)
    //     assert.ok(tr.succeeded);
    //     done();
    // });

    // it('should be success no wait mode', function (done) {
    //     this.timeout(300000);
    //     const tp = path.join(__dirname, 'success_nowait.js');
    //     const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
    //     tr.run(10);

    //     console.log(tr.stdout)
    //     console.log(tr.stderr)
    //     assert.ok(tr.succeeded);
    //     done();
    // });

    // it('should be failure additional params', function (done) {
    //     this.timeout(300000);
    //     const tp = path.join(__dirname, 'failure_additional_params.js');
    //     const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
    //     tr.run(10);
    //     console.log(tr.stdout)
    //     console.log(tr.stderr)
    //     assert.ok(tr.failed);
    //     done();
    // });

    // it('should be failure preset', function (done) {
    //     this.timeout(300000);
    //     const tp = path.join(__dirname, 'failure_wrong_preset.js');
    //     const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
    //     tr.run(10);

    //     console.log(tr.stdout)
    //     console.log(tr.stderr)
    //     assert.ok(tr.failed);
    //     done();
    // });

    it('should be success no cancel scan', function (done) {
        this.timeout(300000);
        const tp = path.join(__dirname, 'success_no_cancel.js');
        const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        tr.run();
        console.log(tr.succeeded);
        assert.strictEqual(tr.succeeded, true, 'should have succeeded');
        console.log(tr.stdout);
        assert.strictEqual(tr.stdout.indexOf('Pipeline not cancelled, nothing to do.') >= 0, 
        true, 
        "should display cleanup message: Pipeline not cancelled, nothing to do.");
        done();
    });

    it('should be success cancel scan', function (done) {
        this.timeout(300000);
        const scan = path.join(__dirname, 'success_nowait.js');
        const scanTestRunner: ttm.MockTestRunner = new ttm.MockTestRunner(scan);
        scanTestRunner.run(10);
        console.log(scanTestRunner.stdout)
        console.log(scanTestRunner.stderr)
        assert.ok(scanTestRunner.succeeded);
        
        const tp = path.join(__dirname, 'success_cancel.js');
        const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        tr.run(10);
        console.log(tr.stdout);
        assert.strictEqual(tr.stdout.indexOf('Canceling scan with ID') >= 0, 
        true, 
        "should display cleanup message: Canceling scan with ID");
        done();
    });

    it('should be success cancel before scan start', function (done) {
        this.timeout(300000);
        const tp = path.join(__dirname, 'success_cancel.js');
        const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        tr.run(10);
        console.log(tr.stdout);
        assert.strictEqual(tr.stdout.indexOf('Log file not created. Task ended successfully') >= 0,
        true, 
        "should display cleanup message: Log file not created. Task ended successfully.");
        done();
    });
});