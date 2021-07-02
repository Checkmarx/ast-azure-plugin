

let path = require('path');
let ttm = require('azure-pipelines-task-lib/mock-test')
    describe("ScanCreate Test successful case", function () {
        it("Return scan object", async function () {
            let tp = path.join(__dirname, 'success.test.js');
            let tr = new ttm.MockTestRunner(tp);
            await tr.run();
        });
        });