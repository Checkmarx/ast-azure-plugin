import * as taskLib from "azure-pipelines-task-lib/task";
import {promises as fs} from 'fs';
import { getConfiguration, getLogFilename } from "./Utils";
import CxWrapperFactory from "@checkmarxdev/ast-cli-javascript-wrapper-runtime-cli/dist/main/wrapper/CxWrapperFactory";

export class CleanUpRunner {
    cxWrapperFactory = new CxWrapperFactory();
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
        const wrapper = await this.cxWrapperFactory.createWrapper(cxScanConfig);
        let data: string;

        try {
            data = await fs.readFile(getLogFilename(), 'utf8')
        } catch (err: any) {
            if(err.code === 'ENOENT') {
                console.log("Log file not created. Task ended successfully")
                taskLib.setResult(taskLib.TaskResult.Succeeded, "");
            } else if ( err.code === 'EACCES') {
                console.log('No permissions to read log file')
                taskLib.setResult(taskLib.TaskResult.Failed, "")
            } else {
                throw err
            }
            return
        }

        //Regex to get the scanID ofthe logs
        const regexScanId = new RegExp(/"(ID)":"((\\"|[^"])*)"/i);

        const regexArray = regexScanId.exec(data!);

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
            return
        }

        taskLib.setResult(taskLib.TaskResult.Succeeded, "");

        try {
            fs.unlink(getLogFilename())
            //file removed
          } catch(err) {
            console.log("Unable to delete log file.", err)
          }

    }

}
