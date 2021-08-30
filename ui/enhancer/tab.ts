import * as Controls from 'VSS/Controls';
import * as TFSBuildExtensionContracts from 'TFS/Build/ExtensionContracts';

export class CheckmarxReportTab extends Controls.BaseControl {
	constructor() {
		super();
	}
		
	public initialize(): void {
		super.initialize();
		const sharedConfig: TFSBuildExtensionContracts.IBuildResultsViewExtensionConfig = VSS.getConfiguration();
		const vsoContext = VSS.getWebContext();

		console.log(sharedConfig)
		console.log(vsoContext)
		console.log("my test")

	}

}

CheckmarxReportTab.enhance(CheckmarxReportTab, $(".build-info"), {});

// Notify the parent frame that the host has been loaded
VSS.notifyLoadSucceeded();