import {factory} from "./ConfigLog4j";
import * as taskLib from "azure-pipelines-task-lib/task";
import * as path from "path"
import * as fs from "fs";
import {CxScanConfig} from "@checkmarxdev/ast-cli-javascript-wrapper/dist/main/CxScanConfig";
import {CxParamType} from "@checkmarxdev/ast-cli-javascript-wrapper/dist/main/CxParamType";
import {CxCommandOutput} from "@checkmarxdev/ast-cli-javascript-wrapper/dist/main/CxCommandOutput";
import {CxAuth} from "@checkmarxdev/ast-cli-javascript-wrapper/dist/main/CxAuth";

export class TaskRunner {
    private readonly log = factory.getLogger("TaskRunner");
    private cxScanConfig = new CxScanConfig();

    async run() {
        this.printHeader();
        this.cxScanConfig = this.initiateScanConfig();
        let params: Map<CxParamType,string> = new Map<CxParamType,string>();
        params.set(CxParamType.PROJECT_NAME, <string> taskLib.getInput('projectName', true));
        console.log("Project name: " + taskLib.getInput("projectName"));
        if(taskLib.getInput("tenantName") !== undefined) {
            params.set(CxParamType.TENANT,<string>taskLib.getInput("tenantName"));
            console.log(taskLib.getInput("tenantName"));
        }
        if(taskLib.getInput("additionalParams") !== undefined) {
            params.set(CxParamType.ADDITIONAL_PARAMETERS,<string>taskLib.getInput("additionalParams"));
            console.log(taskLib.getInput("additionalParams"));
        }
        params.set(CxParamType.S,".");
        const auth = new CxAuth(this.cxScanConfig);

        // function isJsonString(result: string) {
        //     try {
        //         JSON.parse(result);
        //     } catch (e) {
        //         return false;
        //     }
        //     return true;
        // }

        try {
            const data = await auth.scanCreate(params);
            const cxCommandOutput: CxCommandOutput =JSON.parse(JSON.stringify(data));
            if(cxCommandOutput.exitCode == 0) {
                console.log("Completed scan. Generating results...")
                const agentTempDirectory = taskLib.getVariable('Agent.BuildDirectory')
                console.log("agentBuildDirectory " , agentTempDirectory)
                if (agentTempDirectory != null) {
                    const pathname = path.join(agentTempDirectory, 'cxASTResults.html')

                console.log("path : " + pathname)
                // @ts-ignore
                const resultHtml = await auth.getResultsSummary(cxCommandOutput.scanObjectList.pop().ID,"html","")
                console.log(resultHtml)
                fs.writeFileSync(pathname, resultHtml)
                taskLib.addAttachment("HTML_ATTACHMENT_TYPE","cxASTResults",pathname)
                console.log("Check the attachments")
                // if(result != null && isJsonString(result)) {
                //        step to add the result param to display
                //        await this.writeReportFile("./cxAST-results.json",result)
                //        taskLib.addAttachment("cxAST-results.json","cxAST-results.json","./cxAST-results.json")
                // }
                }
            }
            //await this.attachJsonReport(scanResults);
            taskLib.setResult(cxCommandOutput.exitCode == 0 ? taskLib.TaskResult.Succeeded : taskLib.TaskResult.Failed, "")

        }
        catch (err) {
            // @ts-ignore
            taskLib.setResult(taskLib.TaskResult.Failed, err.message);
        }
    }

    private printHeader() {
        this.log.info(`
         CxCxCxCxCxCxCxCxCxCxCxCx          
        CxCxCxCxCxCxCxCxCxCxCxCxCx         
       CxCxCxCxCxCxCxCxCxCxCxCxCxCx        
      CxCxCx                CxCxCxCx       
      CxCxCx                CxCxCxCx       
      CxCxCx  CxCxCx      CxCxCxCxC        
      CxCxCx  xCxCxCx  .CxCxCxCxCx         
      CxCxCx   xCxCxCxCxCxCxCxCx           
      CxCxCx    xCxCxCxCxCxCx              
      CxCxCx     CxCxCxCxCx   CxCxCx       
      CxCxCx       xCxCxC     CxCxCx       
      CxCxCx                 CxCxCx        
       CxCxCxCxCxCxCxCxCxCxCxCxCxCx        
        CxCxCxCxCxCxCxCxCxCxCxCxCx         
          CxCxCxCxCxCxCxCxCxCxCx           
                                           
            C H E C K M A R X              
                                           
        Starting Checkmarx scan`);
    }

    // private async writeReportFile(jsonReportPath:string,jsonReport:string){
    //     this.log.info(`Writing report to ${jsonReportPath}`);
    //     await new Promise((resolve, reject) => {
    //         fs.writeFile(jsonReportPath, jsonReport, err => {
    //             if (err) {
    //                 reject(err);
    //             } else {
    //                 resolve(jsonReportPath);
    //             }
    //         });
    //     });
    // }

    private initiateScanConfig() {
        let endpointId = taskLib.getInput('CheckmarxService', false) !== undefined ? taskLib.getInput('CheckmarxService', false) :"" ;
        this.cxScanConfig.baseUri = "";
        this.cxScanConfig.clientId = "";
        this.cxScanConfig.clientSecret = "";
        this.cxScanConfig.apiKey = "";
        if(endpointId != null && endpointId !== '' ) {
            let astServerUrl = taskLib.getEndpointUrl(endpointId, false) !== null ? taskLib.getEndpointUrl(endpointId, false) : '';
            let astUsername = taskLib.getEndpointAuthorizationParameter(endpointId, 'username', false) !== null ? taskLib.getEndpointAuthorizationParameter(endpointId, 'username', false) : '';
            let astPassword = taskLib.getEndpointAuthorizationParameter(endpointId, 'password', false) !== null ? taskLib.getEndpointAuthorizationParameter(endpointId, 'password', false) : '';
            if (astServerUrl != null) {
                this.cxScanConfig.baseUri = astServerUrl;
            }
            if (astUsername != null) {
                this.cxScanConfig.clientId = astUsername;
            }
            if (astPassword != null) {
                this.cxScanConfig.clientSecret = astPassword;
            }
        }
        return this.cxScanConfig;
    }

    // private async attachJsonReport(scanResults: any) {
    //
    //
    // }
}

