import {factory} from "./ConfigLog4j";
import taskLib = require('azure-pipelines-task-lib/task');
import {CxScanConfigCall} from "@checkmarxdev/ast-cli-javascript-wrapper/dist/main/CxScanConfigCall"
import {CxAuthCall} from "@checkmarxdev/ast-cli-javascript-wrapper/dist/main/CxAuthCall"
import {CxParamType} from "@checkmarxdev/ast-cli-javascript-wrapper/dist/main/CxParamType";
export class TaskRunner {
    private readonly log = factory.getLogger("TaskRunner");
    private cxScanConfig = new CxScanConfigCall();
    async run() {
        this.printHeader();
        this.cxScanConfig = this.initiateScanConfig();
        let params: Map<CxParamType,string> = new Map<CxParamType,string>();
        params.set(CxParamType.PROJECT_NAME,taskLib.getInput("projectName"));
        params.set(CxParamType.SCAN_TYPES,"sast");
        if(taskLib.getInput("syncMode")) {
            params.set(CxParamType.ADDITIONAL_PARAMETERS, "--nowait");
        }
        params.set(CxParamType.SAST_PRESET_NAME,"Checkmarx Default");
        params.set(CxParamType.S,".");
        const auth = new CxAuthCall(this.cxScanConfig);
        let result = await auth.scanCreate(params).then(value => {
            console.log(value);
        });
        this.log.info(result + '');
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
        let endpointId = taskLib.getInput('CheckmarxService', true) || '';
        let astServerUrl = taskLib.getEndpointUrl(endpointId, false) || '';
        let astUsername = taskLib.getEndpointAuthorizationParameter(endpointId, 'username', false) || '';
        let astPassword = taskLib.getEndpointAuthorizationParameter(endpointId, 'password', false) || '';
        this.cxScanConfig.baseUri = astServerUrl;
        this.cxScanConfig.clientId=astUsername;
        this.cxScanConfig.clientSecret=astPassword;
        return this.cxScanConfig;
    }
}

