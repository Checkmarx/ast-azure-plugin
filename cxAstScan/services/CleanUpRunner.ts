import * as taskLib from "azure-pipelines-task-lib/task";
import {promises as fs} from 'fs';
import {getConfiguration, getLogFilename} from "./Utils";
import CxWrapperFactory from "@checkmarxdev/ast-cli-javascript-wrapper-runtime-cli/dist/main/wrapper/CxWrapperFactory";

export class CleanUpRunner {
    cxWrapperFactory= new CxWrapperFactory();

    async run() {
        try {
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
                if (err.code === 'ENOENT') {
                    console.log("Log file not created. Task ended successfully")
                    taskLib.setResult(taskLib.TaskResult.Succeeded, "");
                } else if (err.code === 'EACCES') {
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

        } catch (err) {
            return
        } finally {
            await this.deleteZipFile()
            await this.deleteLogFile()
        }
    }

    async deleteZipFile(): Promise<void> {
        try {
            const logFileName = getLogFilename();
            const data = await fs.readFile(logFileName, 'utf-8');
            const zipFilePath = this.extractZipFilePath(data);
            if (zipFilePath) {
                // Delete the zip file
                await fs.unlink(zipFilePath);
                console.log(`Deleted zip file: ${zipFilePath}`);
            } else {
                console.log('No zip file path found in the log file.');
            }
        } catch (error: any) {
            if(error.code === 'ENOENT') {
                console.log('Zip file already deleted.');
            }
            else {
                console.error('Error deleting zip file', error);
            }
        }
    }

    async deleteLogFile(): Promise<void> {
        try {
            await fs.unlink(getLogFilename());
            console.log('Log file deleted successfully.');
        } catch (err) {
            //console.log("Unable to delete log file.", err);
        }
    }

    extractZipFilePath(data: string): string | null {
        const zipFilePattern = /Temporary zip file path:\s*(.*)$/m;
        const match = data.match(zipFilePattern);
        return match ? match[1].trim() : null;
    }
}
