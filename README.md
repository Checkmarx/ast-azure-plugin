
<img src="https://raw.githubusercontent.com/Checkmarx/ci-cd-integrations/main/.images/PluginBanner.jpg">
<br />
<div align="center">

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Instlals][install-shield]][install-url]
[![MIT License][license-shield]][license-url]

</div>
<br />
<p align="center">
  <a href="https://github.com/Checkmarx/ast-azure-plugin">
    <img src="https://raw.githubusercontent.com/Checkmarx/ci-cd-integrations/main/.images/xIcon.jpg" alt="Logo" width="80" height="80" />
  </a>

<h3 align="center">AST AZURE PLUGIN</h3>

  <p align="center">
    The Checkmarx One (AST) Azure DevOps plugin enables you to integrate the full functionality of the Checkmarx One platform into your ADO pipelines. You can use this plugin to trigger Checkmarx One scans as part of your CI/CD integration.
    <br/>
    <a href="https://checkmarx.com/resource/documents/en/34965-68710-quick-start-guide---checkmarx-one-azure-devops-plugin.html"><strong>Explore the docs »</strong></a>
    <br />
    <a href="https://marketplace.visualstudio.com/items?itemName=checkmarx.checkmarx-ast-azure-plugin"><strong>Maketplace »</strong></a>
    <br />
    <br />
    <a href="https://github.com/checkmarx/ast-azure-plugin/issues/new">Report Bug</a>
    ·
    <a href="https://github.com/checkmarx/ast-azure-plugin/issues/new">Request Feature</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#overview">Overview</a></li>
    <li><a href="#main-features">Main Features</a></li>
    <li><a href="#prerequisites">Prerequisites</a></li>
    <li><a href="#initial-setup">Initial Setup</a></li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contribution">Contribution</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>
<br/>

> ⚠️ **Important notice for version 3.0.0 and above:** 
> To make the Checkmarx One plugin for ADO more lightweight, the CLI tool has been removed and now needs to be downloaded separately during use. This change may affect customers who restrict access to whitelisted domains, requiring them to add download.checkmarx.com to their whitelist. Customers who are unable to whitelist this domain, can use an older version of the plugin, which is available for download [here](https://github.com/Checkmarx/ast-azure-plugin/releases).

# Overview

This plugin provides a wrapper around the [Checkmarx One CLI
Tool](https://checkmarx.com/resource/documents/en/34965-68620-checkmarx-one-cli-tool.html) which creates a zip archive from your source code repository and uploads it to Checkmarx One for scanning. This provides easy integration with ADO while enabling scan customization using the full functionality and flexibility of the CLI tool.

> The plugin code can be found [here](https://github.com/Checkmarx/ast-azure-plugin).


## Main Features

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

## Prerequisites

-   You have a Checkmarx One account and you have an OAuth **Client
    ID** and **Client Secret** for that account (see [Creating an OAuth
    Client for Checkmarx One Integrations](https://checkmarx.com/resource/documents/en/34965-118315-authentication-for-checkmarx-one-cli.html#UUID-a4e31a96-1f36-6293-e95a-97b4b9189060_UUID-4123a2ff-32d0-2287-8dd2-3c36947f675e)) or you have a Checkmarx One **API Key** (see [Generating an API Key](https://checkmarx.com/resource/documents/en/34965-118315-authentication-for-checkmarx-one-cli.html#UUID-a4e31a96-1f36-6293-e95a-97b4b9189060_UUID-1e7abdfa-77eb-2a6c-f12a-c812a1e1dcf7)).

## Initial Setup

-   Verify that all prerequisites are in place.

-   Install the **Checkmarx AST** plugin from marketplace and configure the settings as described [here](https://checkmarx.com/resource/documents/en/34965-68712-checkmarx-one-azure-devops-plugin-initial-setup.html).


## Usage

To see how you can use our plugin, please refer to the [Documentation](https://checkmarx.com/resource/documents/en/34965-68709-checkmarx-one-azure-devops-plugin.html)


## Contribution

We appreciate feedback and contribution to the AZURE PLUGIN! Before you get started, please see the following:

- [Checkmarx contribution guidelines](docs/contributing.md)
- [Checkmarx Code of Conduct](docs/code_of_conduct.md)


<!-- LICENSE -->
## License
Distributed under the [Apache 2.0](LICENSE). See `LICENSE` for more information.


<!-- CONTACT -->
## Contact

Checkmarx - AST Integrations Team

Project Link: [https://github.com/checkmarx/ast-azure-plugin](https://github.com/checkmarx/ast-azure-plugin)

Find more integrations from our team [here](https://github.com/Checkmarx/ci-cd-integrations#checkmarx-ast-integrations)


© 2022 Checkmarx Ltd. All Rights Reserved.

[contributors-shield]: https://img.shields.io/github/contributors/checkmarx/ast-azure-plugin.svg
[contributors-url]: https://github.com/checkmarx/ast-azure-plugin/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/checkmarx/ast-azure-plugin.svg
[forks-url]: https://github.com/checkmarx/ast-azure-plugin/network/members
[stars-shield]: https://img.shields.io/github/stars/checkmarx/ast-azure-plugin.svg
[stars-url]: https://github.com/checkmarx/ast-azure-plugin/stargazers
[license-shield]: https://img.shields.io/github/license/checkmarx/ast-azure-plugin.svg
[license-url]: https://github.com/checkmarx/ast-azure-plugin/blob/main/LICENSE
[install-shield]: https://img.shields.io/visual-studio-marketplace/azure-devops/installs/total/checkmarx.checkmarx-ast-azure-plugin
[install-url]: https://marketplace.visualstudio.com/items?itemName=checkmarx.checkmarx-ast-azure-plugin
