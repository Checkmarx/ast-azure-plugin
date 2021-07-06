import {TaskRunner} from "../services/TaskRunner";
import {CxParamType} from "@checkmarxdev/ast-cli-javascript-wrapper/dist/main/CxParamType";


describe("ScanCreate Test successful case", function () {
        it("Return scan object", async function(done: Mocha.Done) {
                this.timeout(300000);
                let tmr = new TaskRunner();
                let params: Map<CxParamType, string> = new Map<CxParamType, string>();
                params.set(CxParamType.PROJECT_NAME, "TestJayADO");
                let clientID = process.env["CX_CLIENT_ID"];
                let clientSecret = process.env["CX_CLIENT_SECRET"];
                let baseUri = process.env["CX_BASE_URI"];
                params.set(CxParamType.TENANT, "organization");
                params.set(CxParamType.ADDITIONAL_PARAMETERS, " --client-id " + clientID + " --client-secret " + clientSecret + " --base-uri " + baseUri + " --scan-types sast --filter *.ts")
                await tmr.asyncTestRun(params);
        });
});
