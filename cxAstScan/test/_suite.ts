import * as path from 'path';
import * as ttm from 'azure-pipelines-task-lib/mock-test';
import * as assert from 'assert';

const nodeVersion = 20;

describe('Task runner test', function () {
    this.timeout(3000000);

    const runTest = async (testFile: string, expectedSuccess: boolean, checkMessage?: string) => {
        const tp = path.join(__dirname, testFile);
        const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        await tr.runAsync(nodeVersion);

        console.log(tr.stdout);
        console.log(tr.stderr);
        assert.strictEqual(tr.succeeded, expectedSuccess, `Test ${testFile} ${expectedSuccess ? 'should succeed' : 'should fail'}`);

        if (checkMessage) {
            assert.strictEqual(tr.stdout.indexOf(checkMessage) >= 0, true, `Expected message: "${checkMessage}"`);
        }
    };

    it('should be success with api key', async () => await runTest('success_api_key.js', true));
    it('should be success wait mode', async () => await runTest('success_waitmode.js', true));
    it('should be success no wait mode', async () => await runTest('success_nowait.js', true));
    it('should be failure additional params', async () => await runTest('failure_additional_params.js', false));
    it('should be failure preset', async () => await runTest('failure_wrong_preset.js', false));
    it('should be success no cancel scan', async () => await runTest('success_no_cancel.js', true, 'Pipeline not cancelled, nothing to do.'));
    it('should be success cancel scan', async () => await runTest('success_cancel.js', true, 'Canceling scan with ID'));
    it('should be success cancel before scan start', async () => await runTest('success_cancel.js', true, 'Log file not created. Task ended successfully.'));
});
