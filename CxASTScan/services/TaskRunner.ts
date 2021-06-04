import {factory} from "./ConfigLog4j";
import taskLib = require('azure-pipelines-task-lib/task');

export class TaskRunner {
    private readonly log = factory.getLogger("TaskRunner");
    async run() {
        this.printHeader();
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
const taskObject = JSON.stringify(taskLib, null, 2)
        let endpointId = taskLib.getInput('CheckmarxService', false) || '';
        let astServerUrl = taskLib.getEndpointUrl(endpointId, false) || '';
        let astUsername = taskLib.getEndpointAuthorizationParameter(endpointId, 'username', false) || '';
        let astPassword = taskLib.getEndpointAuthorizationParameter(endpointId, 'password', false) || '';
        this.log.info("BaseURI: " + astServerUrl);
        this.log.info("Username: " + astUsername);
        this.log.info("Password: " + astPassword);
        this.log.info("TaskObject: " + taskObject);
    }
}

