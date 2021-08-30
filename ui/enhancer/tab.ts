import * as Controls from 'VSS/Controls';
import * as TFSBuildContracts from 'TFS/Build/Contracts';
import * as TFSBuildExtensionContracts from 'TFS/Build/ExtensionContracts';
import * as DTClient from 'TFS/DistributedTask/TaskRestClient';

const BUILD_PHASE = 'build';
const HTML_ATTACHMENT_TYPE = 'HTML_ATTACHMENT_TYPE';

export class CheckmarxReportTab extends Controls.BaseControl {
    private projectId: string = '';
    private planId: string = '';
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
                        $.each(taskAttachments, (index, taskAttachment) => {
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
                                    (document.getElementById('ast-report') as HTMLDivElement).innerHTML = data;
                                    VSS.notifyLoadSucceeded();
                                });
                        });
                    });
            });
        }
    }
}

CheckmarxReportTab.enhance(CheckmarxReportTab, $(".build-info"), {});
