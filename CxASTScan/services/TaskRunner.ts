import {factory} from "./ConfigLog4j";
import {CxScanConfigCall} from "@checkmarxdev/ast-cli-javascript-wrapper/dist/main/CxScanConfigCall"
import {CxAuthCall} from "@checkmarxdev/ast-cli-javascript-wrapper/dist/main/CxAuthCall"
import {CxParamType} from "@checkmarxdev/ast-cli-javascript-wrapper/dist/main/CxParamType";
import taskLib = require('azure-pipelines-task-lib/task');

export class TaskRunner {
    private readonly log = factory.getLogger("TaskRunner");
    private cxScanConfig = new CxScanConfigCall();
    async run() {
        this.printHeader();
        this.cxScanConfig = this.initiateScanConfig();
        let scanners = [];
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
        if(taskLib.getBoolInput("enableSastScan")) {
            scanners.push("sast");
        }
        if(taskLib.getBoolInput("enableScaScan")) {
            scanners.push("sca");
        }
        if(taskLib.getBoolInput("enableKicsScan")) {
            scanners.push("kics");
        }
        if(taskLib.getBoolInput("enableContainerScan")) {
            scanners.push("container");
        }
        params.set(CxParamType.S,".");
        params.set(CxParamType.SCAN_TYPES, scanners.join(","));
        const auth = new CxAuthCall(this.cxScanConfig);
        await auth.scanCreate(params).then(value => {
            console.log(value);
        });
        // const data = await auth.scanCreate(params);
        // const cxScanObject: CxScan = JSON.parse(data);
        // console.log("Scan object received: " + JSON.stringify(cxScanObject))

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
        // let astServerUrl = taskLib.getEndpointUrl(endpointId, false) || '';
        // let astUsername = taskLib.getEndpointAuthorizationParameter(endpointId, 'username', false) || '';
        // let astPassword = taskLib.getEndpointAuthorizationParameter(endpointId, 'password', false) || '';
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

