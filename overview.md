#Overview

Checkmarx is a powerful single unified security solution for Static Source Code Analysis (SAST) and Open Source Analysis (OSA) designed for identifying, tracking and fixing technical and logical security flaws.

Checkmarx is integrated seamlessly into the Microsoft’s Software Development Life Cycle (SDLC), enabling
the early detection and mitigation of crucial security flaws.



#Checkmarx provides the following key benefits:

- **Scan source code**
Integrates smoothly within the SDLC to provide detailed near real- time feedback on code security state
- **Best fix location**
Highlights the best place to fix your code
- **Quick and accurate scanning**
Reduce false positives, adapt the rule set to minimize false positives, and understand the root cause
for results
- **Incremental scanning**
Just test the parts of the code that have been changed since last code check-in to reduce scanning time by
more than 80%. Enables incorporation of the security gate within your continuous integration pipeline
- **Seamless integration**
Works with all IDEs, build management servers, bug tracking tools and source repositories
- **Protect Your Full Code Portfolio (Open Source and In-house Source Code)**
Analyzing open source libraries, making sure licenses are being honored and weeding out any open source components which expose the application to known vulnerabilities,
Checkmarx Open Source solution provides complete code portfolio coverage under a single unified solution and with no extra installations or administration required.
- **Easy to initiate Open Source Analysis**
Enhancing your code portfolio risk assessment coverage is merely a few mouse clicks away. With Checkmarx’s Open Source Analysis, there is no need for additional installations or multiple management interfaces. Simply turn it on and within minutes a detailed report is generated with clear results and detailed mitigation instructions. Analysis results are designed with the developer in mind.
No time is wasted on trying to understand the required actions items to mitigate the detected security or compliance risk.


![image](images/resultsTab.png)



#Before You Start:

If you don't already have a Checkmarx server and require a hosted Checkmarx service, please submit the trial request registration form.
[link to Checkmarx registration page](https://info.checkmarx.com/cx-microsoft-vs-team-services)



#Checkmarx Registration:

![image](images/sample2.png)

**To complete this step:**
1.	Complete the form to request a Checkmarx trial license
2.	Activation may take a few days to set up your trial cloud account
    A Checkmarx representative will contact you with the trial license



#Getting Started with Checkmarx:

Checkmarx for Visual Studio Team Services and Team Foundation Server (2015 and greater)is simple to install and configure.
The following steps are required to get started.



#Getting Started with Checkmarx:

![image](images/sample3.png)

**To complete this step:**
1.	From the Build menu in the main screen, add Checkmarx build step
2.	Click Add to configure Checkmarx and configure the properties



#Configure Checkmarx Build Step

![image](images/configNew.png)

**To complete this step:**

1. Checkmarx Scans:
	1.	Enter a Project Name: Either select an existing project from the list, or type in any name to create a new scan project
	2.	Synchronous Mode – enabling this option will cause the build step to wait for scan results, you can see the scan results inside the Checkmarx plug-in results window. If disabled, the results are only displayed inside the Checkmarx web-application.
	3.	enable proxy - enabling this option will cause the build to use the proxy settings in the build. Proxy Settings are configured on the agent level.

2.  Checkmarx SAST Scan:
	1.	enable SAST scan - enabling this option will config a CxSAST scan in the build.
	2.	Select a Checkmarx Endpoint from the drop-down list or click Manage to associate a new Endpoint (described in the next section).
	3.	Preset - predefined sets of queries that you can select when Creating, Configuring and Branching Projects. Predefined presets are provided by Checkmarx and you can custom your own. You can also import and export presets.
	4.	Team – which group the project is associated
	5.	Enable the Incremental Scan checkbox if you want to reduce time between scans
	6.	Folder Exclusions – comma delimited list of the folders to exclude from the scan
	7.	File Exclusions – comma delimited list of the file extensions to exclude from the scan
	8.	Enter how often a full scan is executed between incremental scans
	9.	Deny new projects creation- Enabling this option will prohibit creation of new projects in Checkmarx or assigning an existing project to a different team. 
	10.	Vulnerability Threshold – Available only if Synchronous mode is enabled. Set the maximum number of vulnerabilities allowable before the scan fails

3. Checkmarx SCA Scan:
	1.	Enable Dependency Scan- Check to initiate the Dependency scan for this project/job.
	2.	CxSCA Server URL - the CxSCA API endpoint. This address must be accessible to the node that runs the plugin. The scanned code is delivered to this address for analysis as part of the scan workflow.
	3.	CxSCA Access Control URL - this address must be accessible to the node that runs the plugin.
	4.	CxSCA Web App URL - this address must not be accessible to the node that runs the plugin. It is used for report links.
	5.	CxSCA Account of your CxSCA credentials
	6.	Includes/Exclude wildcard patterns- Comma separated list of include or exclude wildcard patterns.
	7.	Folder Exclusion - Comma separated list of folders to be excluded from the scan.
	8.	Enable CxSCA Vulnerability Thresholds – Available only if Synchronous mode is enabled. Set the maximum number of vulnerabilities allowable before the scan fails

![image](images/scaConfig.png)



#Setup New Checkmarx End-Point

![image](images/sample5.png)

**To complete this step:**
1.	Enter Connection Name – Free text, for example: Checkmarx
2.	Enter Server URL – URL is provided by Checkmarx following registration
3.	Enter Username – is provided by Checkmarx following registration
4.	Enter Password – is provided by Checkmarx following registration
5.	Click OK to continue


#Setup New SCA service connection End-Point

![image](images/scaService.png)

**To complete this step:**
1.	Enter Server URL – URL is provided by Checkmarx following registration
2.	Enter Username – is provided by Checkmarx following registration
3.	Enter Password – is provided by Checkmarx following registration
4.	Enter service connection Name – Free text, for example: Checkmarx SCA
5.	Enter Description - optional
6.	Click Save to continue
