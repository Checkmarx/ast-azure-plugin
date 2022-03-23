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

        const tempa = taskLib.getVariable('Agent.TempDirectory')!;
        const pathname = path.join(tempa, 'logfile.txt');
        const data = await fs.readFile(pathname, 'utf8');
        
        //Regex to get the scanID ofthe logs
        var reg = new RegExp(/"(ID)":"((\\"|[^"])*)"/i);
        var m: RegExpExecArray | null
        
        m = reg.exec(data);
        
        try {
            if (m) {
                //m2 is the scanID
                const cxCommandOutput: CxCommandOutput = await wrapper.scanCancel(m[2]);
                taskLib.setResult(cxCommandOutput.exitCode == 0 ?
                taskLib.TaskResult.Succeeded : taskLib.TaskResult.Failed, "");
            }
        } catch (err) {
            console.log("Error canceling scan: " + err + " " + Date.now().toString())
            taskLib.setResult(taskLib.TaskResult.Failed, JSON.stringify(err));
        }
    }
}

