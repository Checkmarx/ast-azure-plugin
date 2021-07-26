###### Overview

###### Checkmarx is a powerful single unified security solution for Static Source Code Analysis (SAST), dependency scanning(SCA), KICS and container scanning analysis designed for identifying, tracking and fixing technical and logical security flaws.

Checkmarx is integrated seamlessly into the Microsoft’s Software Development Life Cycle (SDLC), enabling
the early detection and mitigation of crucial security flaws.

###### Checkmarx provides the following key benefits:

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

###### Getting Started with Checkmarx:

![image](images/task.png)

**To complete this step:**
1.	From the Build menu in the main screen, add Checkmarx build step
2.	Click Add to configure Checkmarx and configure the properties

###### Configure Checkmarx Build Step

![image](images/build.PNG)

**To complete this step:**

1.	Project Name: Enter a new project name or default to $(Build.Repository.Name). The default name will contain the SCM repository name.
2.	Tenant Name: Please provide your AST Tenant name
3.	Additional Parameters: Please provide any additional parameters for the scan to complete (--sast-preset-type "Checkmarx Default")
4.  Zip File Filters: Source code directories/Files that get zipped and sent to AST server for scanning

###### Configure Checkmarx AST Service Connection Step

![image](images/serviceConnection.PNG)
![image](images/serviceConnection2.PNG)

**To complete this step:**

Please select the Checkmarx AST service Connection option to create a new service connection to AST portal
1.	Server URL: Enter the AST endpoint URL
2.	Checkmarx AST Auth URL: Enter the optional Auth URL
3.	Checkmarx Client ID: Please enter the AST OAuth Client ID
4.  Checkmarx Client Secret: Please enter the AST OAuth Client Secret
  