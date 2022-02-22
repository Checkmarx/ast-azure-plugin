import * as taskLib from "azure-pipelines-task-lib/task";
import {promises as fs} from 'fs';
import * as path from "path"
import {CxWrapper} from "@checkmarxdev/ast-cli-javascript-wrapper";
import {CxCommandOutput} from "@checkmarxdev/ast-cli-javascript-wrapper/dist/main/wrapper/CxCommandOutput";
import { getConfiguration } from "./Utils";

export class CleanUpRunner {
    async run() {;
        const cxScanConfig = getConfiguration();
        const wrapper = new CxWrapper(cxScanConfig);
        const status: string = taskLib.getVariable('agent.jobstatus') || ''
        if (status != 'Canceled') {
            return;
        }
        const tempa = taskLib.getVariable('Agent.TempDirectory')!;
        const pathname = path.join(tempa, 'test.txt');

        const data = await fs.readFile(pathname, 'utf8');
        console.log(data)

        try {
            const cxCommandOutput: CxCommandOutput = await wrapper.authValidate();

            taskLib.setResult(cxCommandOutput.exitCode == 0 ?
                taskLib.TaskResult.Succeeded : taskLib.TaskResult.Failed, "");

        } catch (err) {
            console.log("Error creating scan: " + err + " " + Date.now().toString())
            taskLib.setResult(taskLib.TaskResult.Failed, JSON.stringify(err));
        }
    }
}

