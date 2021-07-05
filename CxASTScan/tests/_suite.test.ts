import {CxScanConfigCall} from '@checkmarxdev/ast-cli-javascript-wrapper/dist/main/CxScanConfigCall';
import {CxAuthCall} from '@checkmarxdev/ast-cli-javascript-wrapper/dist/main//CxAuthCall';
import {CxParamType} from '@checkmarxdev/ast-cli-javascript-wrapper/dist/main/CxParamType';
import 'babel-polyfill';

let cxScanConfig = new CxScanConfigCall();
cxScanConfig.baseUri = process.env["CX_BASE_URI"];
cxScanConfig.clientId = process.env["CX_CLIENT_ID"];
cxScanConfig.clientSecret = process.env["CX_CLIENT_SECRET"];
if(process.env["PATH_TO_EXECUTABLE"] !== null && process.env["PATH_TO_EXECUTABLE"] !== undefined ) {
    cxScanConfig.pathToExecutable = process.env["PATH_TO_EXECUTABLE"];
}
let params = new Map();
params.set(CxParamType.PROJECT_NAME, "JayJavascriptWrapperTest");
params.set(CxParamType.SCAN_TYPES, "sast");
params.set(CxParamType.ADDITIONAL_PARAMETERS, "--nowait");
params.set(CxParamType.SAST_PRESET_NAME, "Checkmarx Default");
params.set(CxParamType.S, ".");
const auth = new CxAuthCall(cxScanConfig);

describe("ScanCreate cases",() => {
    it('ScanCreate Successful case', async () => {
        jest.setTimeout(1000000)
        const data = await auth.scanCreate(params);
        const cxScanObject = JSON.parse(data);
        expect(cxScanObject.Status).toContain("Queued");
    })
});