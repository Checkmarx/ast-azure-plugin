import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { getPluginVersion } from '../services/TaskRunner';

describe('getPluginVersion', function () {
    const taskJsonPath = path.join(__dirname, '..', '..', 'task.json');

    it('returns the versioned suffix read from task.json', function () {
        const taskJson = JSON.parse(fs.readFileSync(taskJsonPath, 'utf8'));
        const expected = `_${taskJson.version.Major}.${taskJson.version.Minor}.${taskJson.version.Patch}`;

        assert.strictEqual(getPluginVersion(), expected);
    });

    it('returns an empty string when task.json is missing or malformed', function () {
        const originalContent = fs.readFileSync(taskJsonPath, 'utf8');
        fs.writeFileSync(taskJsonPath, 'not valid json');

        try {
            assert.strictEqual(getPluginVersion(), '');
        } finally {
            fs.writeFileSync(taskJsonPath, originalContent);
        }
    });
});
