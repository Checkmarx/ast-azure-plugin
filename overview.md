⚠️ <u>**Important notice for version 3.0.0 and above**</u>:
To make the Checkmarx One plugin for ADO more lightweight, the CLI tool has been removed and now needs to be downloaded separately during use. This change may affect customers who restrict access to whitelisted domains, requiring them to add download.checkmarx.com to their whitelist.
Customers who are unable to whitelist this domain, can use an older version of the plugin, which is available for download [here](https://github.com/Checkmarx/ast-azure-plugin/releases).

### Overview

The CxAST Azure DevOps plugin enables you to trigger SAST, SCA, and KICS scans directly from an Azure DevOps pipeline. It provides a wrapper around the CxAST CLI Tool which creates a zip archive from your source code repository and uploads it to CxAST for scanning. This plugin provides easy integration with Azure while enabling scan customization using the full functionality and flexibility of the CLI tool.

### Main Features
- Automatically trigger CxSAST, CxSCA and KICS scans from Azure DevOps pipelines
- Supports adding a CxAST scan as a pre-configured task or as a YAML
- Supports use of CLI arguments to customize scan configuration
- Interface for viewing scan results summary and trends in the Azure environment
- Direct links from within Azure to detailed CxAST scan results and reports

### Quick Start Guide:

Please find a quick start guide [here](https://checkmarx.com/resource/documents/en/34965-68710-quick-start-guide---checkmarx-one-azure-devops-plugin.html).

### Documentation

Please find the full documentation [here](https://checkmarx.com/resource/documents/en/34965-68709-checkmarx-one-azure-devops-plugin.html).


  
