import {factory} from "./ConfigLog4j";
import {CxParamType} from "@checkmarxdev/ast-cli-javascript-wrapper/dist/main/CxParamType";
import taskLib = require('azure-pipelines-task-lib/task');
import {CxScanConfig} from "@checkmarxdev/ast-cli-javascript-wrapper/dist/main/CxScanConfig";
import {CxAuth} from "@checkmarxdev/ast-cli-javascript-wrapper/dist/main/CxAuth";
import {CxCommandOutput} from "@checkmarxdev/ast-cli-javascript-wrapper/dist/main/CxCommandOutput";

export class TaskRunner {
    private readonly log = factory.getLogger("TaskRunner");
    private cxScanConfig = new CxScanConfig();

    async run() {
        this.printHeader();
        this.cxScanConfig = this.initiateScanConfig();
        let params: Map<CxParamType,string> = new Map<CxParamType,string>();
        params.set(CxParamType.PROJECT_NAME,taskLib.getInput("projectName"));
        console.log("Project name: " + taskLib.getInput("projectName"));
        if(taskLib.getInput("tenantName") !== undefined) {
            params.set(CxParamType.TENANT,taskLib.getInput("tenantName"));
            console.log(taskLib.getInput("tenantName"));
        }
        if(taskLib.getInput("additionalParams") !== undefined) {
            params.set(CxParamType.ADDITIONAL_PARAMETERS,taskLib.getInput("additionalParams"));
            console.log(taskLib.getInput("additionalParams"));
        }
        if(taskLib.getInput("zipFileFilter") !== undefined) {
            params.set(CxParamType.FILTER,taskLib.getInput("zipFileFilter"));
            console.log(taskLib.getInput("zipFileFilter"));
        }
        params.set(CxParamType.S,".");
        const auth = new CxAuth(this.cxScanConfig);
        try {
            const data = await auth.scanCreate(params);
            const cxCommandOutput: CxCommandOutput =JSON.parse(JSON.stringify(data));
            taskLib.setResult(cxCommandOutput.exitCode == 0 ? taskLib.TaskResult.Succeeded : taskLib.TaskResult.Failed, "")
        }
        catch (err) {
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

    private initiateScanConfig() {
        let endpointId = taskLib.getInput('CheckmarxService', false) !== undefined ? taskLib.getInput('CheckmarxService', false) :"" ;
        this.cxScanConfig.baseUri = "";
        this.cxScanConfig.clientId = "";
        this.cxScanConfig.clientSecret = "";
        this.cxScanConfig.apiKey = "";
        if(endpointId !== null && endpointId !== '' ) {
            let astServerUrl = taskLib.getEndpointUrl(endpointId, false) !== null ? taskLib.getEndpointUrl(endpointId, false) : '';
            let astUsername = taskLib.getEndpointAuthorizationParameter(endpointId, 'username', false) !== null ? taskLib.getEndpointAuthorizationParameter(endpointId, 'username', false) : '';
            let astPassword = taskLib.getEndpointAuthorizationParameter(endpointId, 'password', false) !== null ? taskLib.getEndpointAuthorizationParameter(endpointId, 'password', false) : '';
            this.cxScanConfig.baseUri = astServerUrl;
            this.cxScanConfig.clientId = astUsername;
            this.cxScanConfig.clientSecret = astPassword;
        }
        return this.cxScanConfig;
    }
}

