define(["require", "exports", "VSS/Controls", "TFS/DistributedTask/TaskRestClient"], function (require, exports, Controls, DT_Client) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InfoTab = void 0;
    class InfoTab extends Controls.BaseControl {
        constructor() {
            super();
        }
        initialize() {
            super.initialize();
            // Get configuration that's shared between extension and the extension host
            var sharedConfig = VSS.getConfiguration();
            var vsoContext = VSS.getWebContext();
            if (sharedConfig) {
                // register your extension with host through callback
                sharedConfig.onBuildChanged((build) => {
                    this._initBuildInfo(build);
                    /*
                    * If any task uploaded some data using ##vso[task.addattachment] (https://github.com/Microsoft/vso-agent-tasks/blob/master/docs/authoring/commands.md)
                    * Then you could consume the data using taskclient
                    * sample code -
                    */
                    var taskClient = DT_Client.getClient();
                    taskClient.getPlanAttachments(vsoContext.project.id, "build", build.orchestrationPlan.planId, "HTML_ATTACHMENT_TYPE").then((taskAttachments) => {
                        $.each(taskAttachments, (index, taskAttachment) => {
                            if (taskAttachment._links && taskAttachment._links.self && taskAttachment._links.self.href) {
                                var link = taskAttachment._links.self.href;
                                var attachmentName = taskAttachment.name;
                                console.log(link);
                                console.log(attachmentName);
                                // do some thing here
                                // see how to get auth https://www.visualstudio.com/en-us/docs/report/analytics/building-extension-against-analytics-service
                            }
                            else {
                                console.log("NOT COMING TO THE IF BLOCK ONCE CHECK THE ATTACHEMENT PLAN");
                            }
                        });
                    });
                });
            }
        }
        _initBuildInfo(build) {
        }
    }
    exports.InfoTab = InfoTab;
    InfoTab.enhance(InfoTab, $(".build-info"), {});
    // Notify the parent frame that the host has been loaded
    VSS.notifyLoadSucceeded();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vdGFiLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFPQSxNQUFhLE9BQVEsU0FBUSxRQUFRLENBQUMsV0FBVztRQUNoRDtZQUNDLEtBQUssRUFBRSxDQUFDO1FBQ1QsQ0FBQztRQUVNLFVBQVU7WUFDaEIsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ25CLDJFQUEyRTtZQUMzRSxJQUFJLFlBQVksR0FBbUUsR0FBRyxDQUFDLGdCQUFnQixFQUFFLENBQUM7WUFDMUcsSUFBSSxVQUFVLEdBQUcsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ3JDLElBQUcsWUFBWSxFQUFFO2dCQUNoQixxREFBcUQ7Z0JBQ3JELFlBQVksQ0FBQyxjQUFjLENBQUMsQ0FBQyxLQUFnQyxFQUFFLEVBQUU7b0JBQ2hFLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBRTNCOzs7O3NCQUlFO29CQUNELElBQUksVUFBVSxHQUFHLFNBQVMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztvQkFDdkMsVUFBVSxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsaUJBQWlCLENBQUMsTUFBTSxFQUFFLHNCQUFzQixDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsZUFBZSxFQUFDLEVBQUU7d0JBQzdJLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUMsS0FBSyxFQUFFLGNBQWMsRUFBRSxFQUFFOzRCQUNqRCxJQUFJLGNBQWMsQ0FBQyxNQUFNLElBQUksY0FBYyxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksY0FBYyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO2dDQUMzRixJQUFJLElBQUksR0FBRyxjQUFjLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7Z0NBQzNDLElBQUksY0FBYyxHQUFHLGNBQWMsQ0FBQyxJQUFJLENBQUM7Z0NBQ3pDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7Z0NBQ2pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUE7Z0NBQzNCLHFCQUFxQjtnQ0FDckIsNEhBQTRIOzZCQUM1SDtpQ0FDSTtnQ0FDSixPQUFPLENBQUMsR0FBRyxDQUFDLDREQUE0RCxDQUFDLENBQUE7NkJBQ3pFO3dCQUNGLENBQUMsQ0FBQyxDQUFDO29CQUNKLENBQUMsQ0FBQyxDQUFDO2dCQUVMLENBQUMsQ0FBQyxDQUFDO2FBQ0g7UUFDRixDQUFDO1FBRU8sY0FBYyxDQUFDLEtBQWdDO1FBRXZELENBQUM7S0FDRDtJQTVDRCwwQkE0Q0M7SUFFRCxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFFL0Msd0RBQXdEO0lBQ3hELEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENvbnRyb2xzID0gcmVxdWlyZShcIlZTUy9Db250cm9sc1wiKTtcclxuaW1wb3J0IFZTU19TZXJ2aWNlID0gcmVxdWlyZShcIlZTUy9TZXJ2aWNlXCIpO1xyXG5pbXBvcnQgVEZTX0J1aWxkX0NvbnRyYWN0cyA9IHJlcXVpcmUoXCJURlMvQnVpbGQvQ29udHJhY3RzXCIpO1xyXG5pbXBvcnQgVEZTX0J1aWxkX0V4dGVuc2lvbl9Db250cmFjdHMgPSByZXF1aXJlKFwiVEZTL0J1aWxkL0V4dGVuc2lvbkNvbnRyYWN0c1wiKTtcclxuaW1wb3J0IERUX0NsaWVudCA9IHJlcXVpcmUoXCJURlMvRGlzdHJpYnV0ZWRUYXNrL1Rhc2tSZXN0Q2xpZW50XCIpO1xyXG5pbXBvcnQgeyBjb250ZW50c092ZXJmbG93IH0gZnJvbSBcIlZTUy9VdGlscy9VSVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEluZm9UYWIgZXh0ZW5kcyBDb250cm9scy5CYXNlQ29udHJvbCB7XHRcclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdHN1cGVyKCk7XHJcblx0fVxyXG5cdFx0XHJcblx0cHVibGljIGluaXRpYWxpemUoKTogdm9pZCB7XHJcblx0XHRzdXBlci5pbml0aWFsaXplKCk7XHJcblx0XHQvLyBHZXQgY29uZmlndXJhdGlvbiB0aGF0J3Mgc2hhcmVkIGJldHdlZW4gZXh0ZW5zaW9uIGFuZCB0aGUgZXh0ZW5zaW9uIGhvc3RcclxuXHRcdHZhciBzaGFyZWRDb25maWc6IFRGU19CdWlsZF9FeHRlbnNpb25fQ29udHJhY3RzLklCdWlsZFJlc3VsdHNWaWV3RXh0ZW5zaW9uQ29uZmlnID0gVlNTLmdldENvbmZpZ3VyYXRpb24oKTtcclxuXHRcdHZhciB2c29Db250ZXh0ID0gVlNTLmdldFdlYkNvbnRleHQoKTtcclxuXHRcdGlmKHNoYXJlZENvbmZpZykge1xyXG5cdFx0XHQvLyByZWdpc3RlciB5b3VyIGV4dGVuc2lvbiB3aXRoIGhvc3QgdGhyb3VnaCBjYWxsYmFja1xyXG5cdFx0XHRzaGFyZWRDb25maWcub25CdWlsZENoYW5nZWQoKGJ1aWxkOiBURlNfQnVpbGRfQ29udHJhY3RzLkJ1aWxkKSA9PiB7XHJcblx0XHRcdFx0dGhpcy5faW5pdEJ1aWxkSW5mbyhidWlsZCk7XHRcclxuXHRcdFx0XHRcclxuXHRcdFx0XHQvKlxyXG5cdFx0XHRcdCogSWYgYW55IHRhc2sgdXBsb2FkZWQgc29tZSBkYXRhIHVzaW5nICMjdnNvW3Rhc2suYWRkYXR0YWNobWVudF0gKGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvdnNvLWFnZW50LXRhc2tzL2Jsb2IvbWFzdGVyL2RvY3MvYXV0aG9yaW5nL2NvbW1hbmRzLm1kKVxyXG5cdFx0XHRcdCogVGhlbiB5b3UgY291bGQgY29uc3VtZSB0aGUgZGF0YSB1c2luZyB0YXNrY2xpZW50XHJcblx0XHRcdFx0KiBzYW1wbGUgY29kZSAtXHJcblx0XHRcdFx0Ki9cclxuXHRcdFx0XHRcdHZhciB0YXNrQ2xpZW50ID0gRFRfQ2xpZW50LmdldENsaWVudCgpO1xyXG5cdFx0XHRcdFx0dGFza0NsaWVudC5nZXRQbGFuQXR0YWNobWVudHModnNvQ29udGV4dC5wcm9qZWN0LmlkLCBcImJ1aWxkXCIsIGJ1aWxkLm9yY2hlc3RyYXRpb25QbGFuLnBsYW5JZCwgXCJIVE1MX0FUVEFDSE1FTlRfVFlQRVwiKS50aGVuKCh0YXNrQXR0YWNobWVudHMpPT4ge1xyXG5cdFx0XHRcdFx0XHQkLmVhY2godGFza0F0dGFjaG1lbnRzLCAoaW5kZXgsIHRhc2tBdHRhY2htZW50KSA9PiB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKHRhc2tBdHRhY2htZW50Ll9saW5rcyAmJiB0YXNrQXR0YWNobWVudC5fbGlua3Muc2VsZiAmJiB0YXNrQXR0YWNobWVudC5fbGlua3Muc2VsZi5ocmVmKSB7XHJcblx0XHRcdFx0XHRcdFx0XHR2YXIgbGluayA9IHRhc2tBdHRhY2htZW50Ll9saW5rcy5zZWxmLmhyZWY7XHJcblx0XHRcdFx0XHRcdFx0XHR2YXIgYXR0YWNobWVudE5hbWUgPSB0YXNrQXR0YWNobWVudC5uYW1lO1xyXG5cdFx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2cobGluaylcclxuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGF0dGFjaG1lbnROYW1lKVxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gZG8gc29tZSB0aGluZyBoZXJlXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBzZWUgaG93IHRvIGdldCBhdXRoIGh0dHBzOi8vd3d3LnZpc3VhbHN0dWRpby5jb20vZW4tdXMvZG9jcy9yZXBvcnQvYW5hbHl0aWNzL2J1aWxkaW5nLWV4dGVuc2lvbi1hZ2FpbnN0LWFuYWx5dGljcy1zZXJ2aWNlXHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coXCJOT1QgQ09NSU5HIFRPIFRIRSBJRiBCTE9DSyBPTkNFIENIRUNLIFRIRSBBVFRBQ0hFTUVOVCBQTEFOXCIpXHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHR9KTtcclxuXHRcdH1cdFx0XHJcblx0fVxyXG5cdFxyXG5cdHByaXZhdGUgX2luaXRCdWlsZEluZm8oYnVpbGQ6IFRGU19CdWlsZF9Db250cmFjdHMuQnVpbGQpIHtcclxuXHRcdFxyXG5cdH1cclxufVxyXG5cclxuSW5mb1RhYi5lbmhhbmNlKEluZm9UYWIsICQoXCIuYnVpbGQtaW5mb1wiKSwge30pO1xyXG5cclxuLy8gTm90aWZ5IHRoZSBwYXJlbnQgZnJhbWUgdGhhdCB0aGUgaG9zdCBoYXMgYmVlbiBsb2FkZWRcclxuVlNTLm5vdGlmeUxvYWRTdWNjZWVkZWQoKTsiXX0=