import * as taskLib from "azure-pipelines-task-lib/task";
import {promises as fs} from 'fs';
import {CxWrapper} from "@checkmarxdev/ast-cli-javascript-wrapper";
import { getConfiguration, getLogFilename } from "./Utils";

export class CleanUpRunner {
    async run() {
        console.log("Getting job status");
        const jobStatus = taskLib.getVariable('AGENT_JOBSTATUS');
        console.log("Job status: " + jobStatus);
        if (jobStatus !== 'Canceled') {
            console.log("Pipeline not cancelled, nothing to do.");
            taskLib.setResult(taskLib.TaskResult.Succeeded, "");
            return;
        }

        const cxScanConfig = getConfiguration();
        const wrapper = new CxWrapper(cxScanConfig);

        const logFileName = getLogFilename()
        let data = ""
        
        if(logFileName === undefined) {
            console.log("Log file not created. Terminating job.")
            taskLib.setResult(taskLib.TaskResult.Succeeded, "");
        } else {
            data = await fs.readFile(logFileName, 'utf8');
        }


        //Regex to get the scanID ofthe logs
        const regexScanId = new RegExp(/"(ID)":"((\\"|[^"])*)"/i);
        let regexArray: RegExpExecArray | null;

        regexArray = regexScanId.exec(data);

        try {
            if (regexArray) {
                //m[2] is the scanID
                console.log("Canceling scan with ID: " + regexArray[2])
                await wrapper.scanCancel(regexArray[2]);
            } else {
                console.log("Scan not created. Terminating job.")
            }
        } catch (err) {
            console.log("Error canceling scan: " + err + " " + Date.now().toString())
            taskLib.setResult(taskLib.TaskResult.Failed, "");
        }
        taskLib.setResult(taskLib.TaskResult.Succeeded, "");
    }
}
