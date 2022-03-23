import * as taskLib from "azure-pipelines-task-lib/task";
import {promises as fs} from 'fs';
import {CxWrapper} from "@checkmarxdev/ast-cli-javascript-wrapper";
import {CxCommandOutput} from "@checkmarxdev/ast-cli-javascript-wrapper/dist/main/wrapper/CxCommandOutput";
import { getConfiguration, getLogFilename } from "./Utils";

export class CleanUpRunner {
    async run() {;
        const cxScanConfig = getConfiguration();
        const wrapper = new CxWrapper(cxScanConfig);

        const data = await fs.readFile(getLogFilename(), 'utf8');
        
        //Regex to get the scanID ofthe logs
        var regexScanId = new RegExp(/"(ID)":"((\\"|[^"])*)"/i);
        var regexArray: RegExpExecArray | null
        
        regexArray = regexScanId.exec(data);
        
        try {
            if (regexArray) {
                //m[2] is the scanID
                console.log("Canceling scan with ID: " + regexArray[2])
                const cxCommandOutput: CxCommandOutput = await wrapper.scanCancel(regexArray[2]);
                taskLib.setResult(cxCommandOutput.exitCode == 0 ?
                taskLib.TaskResult.Succeeded : taskLib.TaskResult.Failed, "");
            }
        } catch (err) {
            console.log("Error canceling scan: " + err + " " + Date.now().toString())
            taskLib.setResult(taskLib.TaskResult.Failed, JSON.stringify(err));
        }
    }
}

