import * as path from 'path';
import * as ttm from 'azure-pipelines-task-lib/mock-test';
import * as assert from 'assert';

const nodeVersion = 20;
describe('Task runner test', function () {

    it('should be success with api key', async function () {
        this.timeout(3000000);
        const tp = path.join(__dirname, 'success_api_key.js');
        const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        await tr.runAsync(nodeVersion);

        console.log(tr.stdout);
        console.log(tr.stderr);
        assert.ok(tr.succeeded);
    });

    it('should be success wait mode', async function () {
        this.timeout(3000000);
        const tp = path.join(__dirname, 'success_waitmode.js');
        const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        await tr.runAsync(nodeVersion);

        console.log(tr.stdout);
        console.log(tr.stderr);
        assert.ok(tr.succeeded);
    });

    it('should be success no wait mode', async function () {
        this.timeout(3000000);
        const tp = path.join(__dirname, 'success_nowait.js');
        const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        await tr.runAsync(nodeVersion);

        console.log(tr.stdout);
        console.log(tr.stderr);
        assert.ok(tr.succeeded);
    });

    it('should be failure additional params', async function () {
        this.timeout(3000000);
        const tp = path.join(__dirname, 'failure_additional_params.js');
        const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        await tr.runAsync(nodeVersion);

        console.log(tr.stdout);
        console.log(tr.stderr);
        assert.ok(tr.failed);
    });

    it('should be failure preset', async function () {
        this.timeout(3000000);
        const tp = path.join(__dirname, 'failure_wrong_preset.js');
        const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        await tr.runAsync(nodeVersion);

        console.log(tr.stdout);
        console.log(tr.stderr);
        assert.ok(tr.failed);
    });

    it('should be success no cancel scan', async function () {
        this.timeout(3000000);
        const tp = path.join(__dirname, 'success_no_cancel.js');
        const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        await tr.runAsync(nodeVersion);

        console.log(tr.succeeded);
        assert.strictEqual(tr.succeeded, true, 'should have succeeded');
        console.log(tr.stdout);
        assert.strictEqual(tr.stdout.indexOf('Pipeline not cancelled, nothing to do.') >= 0,
            true,
            "should display cleanup message: Pipeline not cancelled, nothing to do.");
        assert.strictEqual(tr.stdout.indexOf('Deleted zip file') >= 0 || tr.stdout.indexOf('Zip file already deleted.') >= 0,
            true,
            "should display cleanup message: Deleted zip file or Zip file already deleted.");
    });

    it('should be success cancel scan', async function () {
        this.timeout(3000000);
        const scan = path.join(__dirname, 'success_nowait.js');
        const scanTestRunner: ttm.MockTestRunner = new ttm.MockTestRunner(scan);
        await scanTestRunner.runAsync(nodeVersion);

        console.log(scanTestRunner.stdout);
        console.log(scanTestRunner.stderr);
        assert.ok(scanTestRunner.succeeded);

        const tp = path.join(__dirname, 'success_cancel.js');
        const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        await tr.runAsync(nodeVersion);

        console.log(tr.stdout);
        assert.strictEqual(tr.stdout.indexOf('Canceling scan with ID') >= 0,
            true,
            "should display cleanup message: Canceling scan with ID");
        assert.strictEqual(tr.stdout.indexOf('Deleted zip file') >= 0 || tr.stdout.indexOf('Zip file already deleted.') >= 0,
            true,
            "should display cleanup message: Deleted zip file or Zip file already deleted.");
    });

    it('should be success cancel before scan start', async function () {
        this.timeout(3000000);
        const tp = path.join(__dirname, 'success_cancel.js');
        const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        await tr.runAsync(nodeVersion);

        console.log(tr.stdout);
        assert.strictEqual(tr.stdout.indexOf('Log file not created. Task ended successfully') >= 0,
            true,
            "should display cleanup message: Log file not created. Task ended successfully.");
    });

    it('should be success custom source file', async function () {
        this.timeout(3000000);
        const tp = path.join(__dirname, 'success_custom_source_file.js');
        const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        await tr.runAsync(nodeVersion);

        console.log(tr.stdout);
        console.log(tr.stderr);
        assert.ok(tr.succeeded);
    });

    it('should be success custom source file 2', async function () {
        this.timeout(3000000);
        const tp = path.join(__dirname, 'success_custom_source_file_with_whitespaces.js');
        const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        await tr.runAsync(nodeVersion);

        console.log(tr.stdout);
        console.log(tr.stderr);
        assert.ok(tr.succeeded);
    });
});
