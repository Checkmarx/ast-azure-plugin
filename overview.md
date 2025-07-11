⚠️ <u>**Important notice for version 3.0.0 and above**</u>:
To make the Checkmarx One plugin for ADO more lightweight, the CLI tool has been removed and now needs to be downloaded separately during use. This change may affect customers who restrict access to whitelisted domains, requiring them to add download.checkmarx.com to their whitelist.
Customers who are unable to whitelist this domain, can use an older version of the plugin, which is available for download [here](https://github.com/Checkmarx/ast-azure-plugin/releases).

### Overview

The Checkmarx One (AST) Azure DevOps plugin enables you to integrate the full functionality of the Checkmarx One platform into your ADO pipelines. You can use this plugin to trigger Checkmarx One scans as part of your CI/CD integration.


This plugin provides a wrapper around the [Checkmarx One CLI
Tool](https://checkmarx.com/resource/documents/en/34965-68620-checkmarx-one-cli-tool.html) which creates a zip archive from your source code repository and uploads it to Checkmarx One for scanning. This provides easy integration with ADO while enabling scan customization using the full functionality and flexibility of the CLI tool.

> The plugin code can be found [here](https://github.com/Checkmarx/ast-azure-plugin).

### Main Features

-   Configure ADO pipelines to automatically trigger scans running all Checkmarx One scanners: CxSAST, CxSCA, IaC Security, Container Security, API Security, Secret Detection and Repository Health (OSSF Scorecard).

-   Supports adding a Checkmarx One scan as a pre-configured task or as a YAML

-   Supports use of CLI arguments to customize scan configuration, enabling you to:

    -   Customize filters to specify which folders and files are scanned

    -   Apply preset query configurations

    -   Customize SCA scans using [SCA Resolver](https://checkmarx.com/resource/documents/en/34965-19196-checkmarx-sca-resolver.html)

    -   Set thresholds to break build

-   Send requests via a proxy server

-   Break build upon policy violation

-   View scan results summary and trends in the ADO environment

-   Direct links from within ADO to detailed Checkmarx One scan results

-   Generate customized scan reports in various formats (JSON, HTML, PDF etc.)

-   Generate SBOM reports (CycloneDX and SPDX)

-   Supports Team Foundation Version Control (TFVC) based repos.


### Quick Start Guide:

Please find a quick start guide [here](https://checkmarx.com/resource/documents/en/34965-68710-quick-start-guide---checkmarx-one-azure-devops-plugin.html).

### Documentation

Please find the full documentation [here](https://checkmarx.com/resource/documents/en/34965-68709-checkmarx-one-azure-devops-plugin.html).


  
