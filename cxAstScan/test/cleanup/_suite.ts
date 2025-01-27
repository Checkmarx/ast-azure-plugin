import * as path from 'path';
import * as ttm from 'azure-pipelines-task-lib/mock-test';
import * as assert from 'assert';

const nodeVersion = 20;

describe('Cleanup Tests', function () {
    it('should handle file permission errors', async function () {
        this.timeout(3000000);
        const tp = path.join(__dirname, 'failure_permissions.js');
        const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        await tr.runAsync(nodeVersion);

        console.log(tr.stdout);
        assert.strictEqual(tr.stdout.indexOf('No permissions to read log file') >= 0, true);
    });

    it('should handle file deletion errors', async function () {
        this.timeout(3000000);
        const tp = path.join(__dirname, 'failure_deletion.js');
        const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        await tr.runAsync(nodeVersion);

        console.log(tr.stdout);
        assert.strictEqual(tr.stdout.indexOf('Unable to delete log file.') >= 0, true);
    });

    it('should handle authentication errors', async function () {
        this.timeout(3000000);
        const tp = path.join(__dirname, 'failure_auth.js');
        const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        await tr.runAsync(nodeVersion);

        console.log(tr.stdout);
        assert.strictEqual(tr.stdout.indexOf('Error creating scan:') >= 0, true);
    });
});