import * as Controls from 'VSS/Controls';
import * as TFSBuildContracts from 'TFS/Build/Contracts';
import * as TFSBuildExtensionContracts from 'TFS/Build/ExtensionContracts';
import * as DTClient from 'TFS/DistributedTask/TaskRestClient';

const BUILD_PHASE = 'build';
const HTML_ATTACHMENT_TYPE = 'HTML_ATTACHMENT_TYPE';

export class CheckmarxReportTab extends Controls.BaseControl {
    private projectId = '';
    private planId = '';
    private taskClient;

    constructor() {
        super();
    }

    public initialize(): void {
        super.initialize();
        const sharedConfig: TFSBuildExtensionContracts.IBuildResultsViewExtensionConfig = VSS.getConfiguration();
        const vsoContext = VSS.getWebContext();

        if (sharedConfig) {
            sharedConfig.onBuildChanged((build: TFSBuildContracts.Build) => {
                this.taskClient = DTClient.getClient();
                this.projectId = vsoContext.project.id;
                this.planId = build.orchestrationPlan.planId;

                this.taskClient
                    .getPlanAttachments(
                        this.projectId,
                        BUILD_PHASE,
                        this.planId,
                        HTML_ATTACHMENT_TYPE,
                    )
                    .then((taskAttachments) => {
                        taskAttachments.forEach(taskAttachment => {
                            const attachmentName = taskAttachment.name;
                            const timelineId = taskAttachment.timelineId;
                            const recordId = taskAttachment.recordId;

                            this.taskClient
                                .getAttachmentContent(
                                    this.projectId,
                                    BUILD_PHASE,
                                    this.planId,
                                    timelineId,
                                    recordId,
                                    HTML_ATTACHMENT_TYPE,
                                    attachmentName,
                                )
                                .then((content) => {
                                    const data = new TextDecoder('utf-8').decode(new DataView(content));

                                    const parser = new DOMParser();
                                    const htmlDoc = parser.parseFromString(data, 'text/html');

                                    // add styles
                                    this.appendStyles(htmlDoc);
                                    // add main cx element
                                    this.appendMainDiv(htmlDoc);
                                    // clean scripts and upload it
                                    this.appendScripts(htmlDoc);
                                });
                        });

                        if (!taskAttachments.length) {
                            this.appendMainDivNotFound("Result file not found");
                        }

                        VSS.notifyLoadSucceeded();
                    });
            });
        }
    }

    private appendMainDivNotFound = (text: string): void => {
        (document.getElementById('ast-report') as HTMLDivElement).innerHTML = "<p>"+text+"</p>";

    }
    private appendMainDiv = (htmlDoc: Document): void => {
        const cxElement = htmlDoc.getElementsByClassName('cx-main')[0];
        (document.getElementById('ast-report') as HTMLDivElement).innerHTML = cxElement.innerHTML;

    }

    private appendStyles = (htmlDoc: Document): void => {
        const cxStyles = htmlDoc.getElementsByTagName('style')[0];
        document.head.appendChild(cxStyles);
    };

    private appendScripts = (htmlDoc: Document): void => {
        let cxScripts = htmlDoc.getElementsByTagName('script')[0].innerHTML;
        cxScripts = cxScripts.substring(cxScripts.indexOf("{") + 1, cxScripts.lastIndexOf("}"))

        const script = document.createElement("script");
        script.type="text/javascript";
        script.innerHTML = cxScripts;
        document.head.appendChild(script);
    };
}

CheckmarxReportTab.enhance(CheckmarxReportTab, document.getElementsByClassName("build-info")[0]!, {});
