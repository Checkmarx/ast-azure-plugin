# Cloud.md - AST Azure Plugin

## Project Overview

**Purpose:** The Checkmarx AST Azure DevOps plugin enables integration of the full functionality of the Checkmarx One platform into Azure DevOps (ADO) pipelines. It provides a wrapper around the Checkmarx One CLI Tool to trigger scans as part of CI/CD integration.

**Status:** Active - Production Release (Current version: v3.0.14+)

**Repository:** https://github.com/Checkmarx/ast-azure-plugin

**Description:** The plugin enables developers to run comprehensive source code analysis within ADO pipelines, supporting multiple scanners (SAST, SCA, IaC, Container Security, API Security, Secret Detection, and Repository Health via OSSF Scorecard). It creates a zip archive from the source repository and uploads it to Checkmarx One for scanning.

---

## Architecture

### High-Level Design

The plugin follows a task-based architecture within the Azure DevOps ecosystem:

1. **Task Layer** - Azure DevOps task entry points (defined in `vss-extension.json`)
2. **Service Layer** - Core scanning and cleanup logic
3. **Wrapper Layer** - TypeScript wrapper around the Checkmarx One CLI
4. **CLI Layer** - External Checkmarx CLI tool (downloaded at runtime from download.checkmarx.com)

### Core Components

- **TaskRunner** (`cxAstScan/services/TaskRunner.ts`) - Orchestrates the scan execution, handles CLI wrapper invocation, and generates scan results
- **CleanUpRunner** (`cxAstScan/services/CleanUpRunner.ts`) - Manages post-execution cleanup and resource cleanup from completed scans
- **Utils** (`cxAstScan/services/Utils.ts`) - Utility functions for configuration retrieval and logging

### Data Flow

```
ADO Pipeline Task Input
         ↓
    TaskRunner (reads config)
         ↓
    CxWrapperFactory (creates wrapper)
         ↓
    CxScan (executes scan via CLI)
         ↓
    Generate Results (HTML/JSON reports)
         ↓
    Return to ADO Pipeline
```

### Key Integration Points

- **Azure DevOps SDK** - `azure-pipelines-task-lib` for task configuration and result handling
- **Checkmarx CLI Wrapper** - `@Checkmarx/ast-cli-javascript-wrapper-runtime-cli` for scan operations
- **Extension Manifest** - `vss-extension.json` defines task configuration, scopes, and marketplace metadata

---

## Repository Structure

```
ast-azure-plugin/
├── cxAstScan/                          # Main plugin source code
│   ├── index.ts                        # Entry point for the ADO task
│   ├── cleanup.ts                      # Cleanup entry point
│   ├── services/
│   │   ├── TaskRunner.ts              # Scan execution logic
│   │   ├── CleanUpRunner.ts           # Post-scan cleanup
│   │   └── Utils.ts                   # Shared utilities
│   ├── test/                          # Test suite
│   │   ├── _suite.ts                  # Test runner
│   │   ├── success_*.ts               # Positive test cases
│   │   ├── failure_*.ts               # Negative test cases
│   │   └── data/                      # Test fixtures (zip files)
│   ├── dist/                          # Compiled TypeScript output
│   └── tsconfig.json                  # TypeScript configuration
│
├── ui/                                # Azure DevOps UI enhancements
│   ├── cxASTReportTab.html            # Report tab UI
│   ├── enhancer/
│   │   ├── tab.ts                     # Tab enhancement script
│   │   └── tsconfig.json
│
├── docs/                              # Documentation
│   ├── contributing.md                # Contribution guidelines
│   └── code_of_conduct.md             # Code of conduct
│
├── .github/                           # GitHub configuration
│   ├── workflows/                     # CI/CD pipelines
│   ├── ISSUE_TEMPLATE/                # Issue templates
│   └── PULL_REQUEST_TEMPLATE.md       # PR template
│
├── images/                            # Documentation images
├── scripts/                           # Build and utility scripts
├── package.json                       # Node.js project config
├── package-lock.json                  # Locked dependencies
├── vss-extension.json                 # Azure DevOps extension manifest
├── README.md                          # User-facing documentation
├── overview.md                        # Marketplace overview
├── LICENSE                            # Apache 2.0 license
├── checkmarx-license-terms.md         # Checkmarx license terms
├── .eslintrc.json                     # ESLint configuration
├── .nycrc                             # Code coverage config
├── .gitignore                         # Git ignore rules
└── CODEOWNERS                         # Code ownership rules
```

---

## Technology Stack

### Languages & Runtime
- **TypeScript** 5.6.3+ - Primary development language
- **Node.js** 16.0+ - Runtime requirement (`engines.node >= 16`)
- **ES2015** - Compilation target for backward compatibility

### Core Dependencies
- **azure-pipelines-task-lib** - Azure DevOps task library for ADO integration
- **vss-web-extension-sdk** 5.141.0 - VSS extension SDK for UI components
- **@Checkmarx/ast-cli-javascript-wrapper-runtime-cli** - Checkmarx CLI wrapper
- **typescript-logging** 2.2.0 - Structured logging utility
- **@babel/helpers** 7.27.0 - Babel helper utilities

### Development Dependencies
- **TypeScript** 5.6.3+ - Transpilation and type checking
- **Mocha** 10.7.0 - Test framework
- **NYC** 17.1.0 - Code coverage reporter
- **ESLint** 8.57.0 - Code linting with TypeScript plugin
- **@typescript-eslint/parser** 5.62.0 - TypeScript parser for ESLint
- **@types/node**, **@types/mocha** - Type definitions

### Build & Publication
- **NPM Registry** - GitHub Package Registry (`publishConfig.registry`)
- **npm** - Package management

### Code Quality Tools
- **ESLint** - Static analysis with TypeScript support
- **NYC** - Code coverage measurement (targets: 75% lines, 75% statements, 60% functions, 50% branches)

---

## Development Setup

### Prerequisites
- Node.js 16.0 or higher
- npm 6.0 or higher
- Git
- A Checkmarx One account with OAuth credentials or API Key
- Azure DevOps account (for testing the plugin)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Checkmarx/ast-azure-plugin.git
   cd ast-azure-plugin
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Verify Node version:**
   ```bash
   node --version  # Should be >= 16
   ```

### Build

```bash
# Build TypeScript to JavaScript
npm run build

# This runs:
# - tsc -b cxAstScan/tsconfig.json (plugin code)
# - tsc -b ui/enhancer/tsconfig.json (UI enhancements)
```

Output compiled files are placed in:
- `cxAstScan/dist/` - Plugin compiled code
- `ui/enhancer/dist/` - UI compiled code

### Running Locally

#### Development Testing
```bash
# Run the test suite
npm test

# Run with coverage report
npm run coverage
```

#### Manual Testing
1. Build the project: `npm run build`
2. Test via local ADO instance or use the Azure DevOps task locally with `azure-pipelines-task-tool`
3. Verify compilation output in `dist/` directories

### Development Server Setup

The plugin does not have a traditional web server. Instead:
- The task runs in the ADO agent execution context
- UI components run within the Azure DevOps web interface
- Development testing is done via unit tests and integration tests with mock ADO environments

---

## Coding Standards

### TypeScript Style Guide

- **File Naming**: Use PascalCase for class files (`TaskRunner.ts`, `CleanUpRunner.ts`)
- **Class Naming**: PascalCase (e.g., `TaskRunner`, `CleanUpRunner`)
- **Variable/Function Naming**: camelCase (e.g., `cxScanConfig`, `generateResults()`)
- **Constants**: UPPER_SNAKE_CASE
- **Private Members**: Prefix with underscore (e.g., `_config`)

### Code Organization

- Keep related functionality in the same file
- Separate concerns: UI code in `ui/`, task logic in `cxAstScan/services/`
- Export public APIs clearly; keep internal utilities local

### Type Safety

- **Strict Mode**: Enabled in `tsconfig.json` (`"strict": true`)
- Use explicit types; avoid `any` where possible
- Enable `noUnusedLocals` - all variables must be used

### Imports & Modules

```typescript
// Order imports: external libs → internal utilities
import * as taskLib from "azure-pipelines-task-lib/task";
import { CxWrapper } from "@Checkmarx/ast-cli-javascript-wrapper-runtime-cli";
import { getConfiguration } from "./Utils";
```

### Comments & Documentation

- Document public classes and methods with JSDoc-style comments
- Add comments for non-obvious logic or business rules
- Keep comments concise and current with code changes

### Formatting

- Use ESLint for consistent formatting: `npm run lint-and-fix`
- 2-space indentation (standard Node.js)
- No trailing semicolons (ESLint configured to allow)
- Maximum line length: Follow ESLint defaults

---

## Project Rules

### Development Constraints

1. **Node.js Minimum Version**: Must support Node.js 16.0+ (defined in `package.json`)
2. **CLI Tool**: The Checkmarx One CLI is downloaded at runtime from `download.checkmarx.com` (users must whitelist this domain)
3. **No Bundling of CLI**: Since v3.0.0+, the CLI tool is not bundled with the plugin to reduce package size
4. **Azure DevOps Compatibility**: Must work with current and 2-3 prior versions of Azure DevOps

### What NOT to Do

- ❌ Don't bundle the CLI tool with the plugin
- ❌ Don't hardcode credentials in code (use ADO task variables/secrets)
- ❌ Don't modify `vss-extension.json` without coordination (defines marketplace listing)
- ❌ Don't remove or rename public task inputs/outputs without migration plan
- ❌ Don't add dependencies without reviewing licensing (Apache 2.0 compatible only)
- ❌ Don't break backward compatibility for task inputs without major version bump

### Contribution Requirements

- All PRs must be associated with an issue (review [contributing.md](docs/contributing.md))
- Changes must include unit/integration tests
- Code coverage must maintain or improve existing thresholds (75% lines, 75% statements, 60% functions, 50% branches)
- ESLint validation must pass: `npm run lint`
- Follow the [Code of Conduct](docs/code_of_conduct.md)

### Breaking Changes

- Require issue discussion and team consensus
- Must include deprecation period in release notes
- Update documentation and migration guides

---

## Testing Strategy

### Testing Framework
- **Test Runner**: Mocha 10.7.0
- **Coverage Tool**: NYC 17.1.0
- **Test Location**: `cxAstScan/test/`

### Test Types

#### Unit Tests
- Located in `cxAstScan/test/` with filenames matching test scenario
- Each test file extends `_suite.ts` base test class
- Tests cover both success and failure scenarios

#### Success Test Cases (Positive Path)
- `success_api_key.ts` - Authentication with API key
- `success_cancel.ts` - Scan cancellation
- `success_no_cancel.ts` - Scan completion without cancellation
- `success_nowait.ts` - Non-blocking scan execution
- `success_waitmode.ts` - Blocking scan execution with wait
- `success_custom_source_file.ts` - Custom source file specification
- `success_custom_source_file_with_whitespaces.ts` - File paths with spaces

#### Failure Test Cases (Negative Path)
- `failure_additional_params.ts` - Invalid additional parameters
- `failure_wrong_preset.ts` - Invalid preset configuration
- `failure_custom_source_file_not_exist_file.ts` - Non-existent source file

### Test Data
- Located in `cxAstScan/test/data/`
- `test-repo.zip` - Standard test repository
- `WebGoat name with spaces.zip` - Test fixture for path handling

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run coverage

# Output: Coverage reports in HTML and text format
```

### Coverage Requirements
- **Lines**: 75%
- **Statements**: 75%
- **Functions**: 60%
- **Branches**: 50%

### Test Execution Flow
1. Build: `tsc -b cxAstScan/tsconfig.json`
2. Run: `mocha cxAstScan/dist/test/_suite.js --exit`
3. Exit on completion (--exit flag)

### Mocking & Test Setup

Tests use:
- Mock Azure DevOps task library responses
- Fixture data (test ZIP files)
- Environment variable mocking
- Parameterized test data

---

## Known Issues

### Current Limitations

1. **CLI Tool Download** - Users must whitelist `download.checkmarx.com` for plugin to function (as of v3.0.0+)
2. **TFVC Repo Support** - Only basic Team Foundation Version Control support (not fully optimized)
3. **UI Tab Rendering** - Report tab may not render in older Azure DevOps installations (pre-v2022)
4. **Large Repository Handling** - Performance degradation with repositories >1GB in size
5. **Network Timeout** - Scans may timeout on unstable network connections (no retry logic)

### Workarounds

- For blocked domain access: Use plugin v2.x which includes bundled CLI
- For network issues: Configure longer timeout via additional parameters
- For large repos: Consider splitting source code or using filters

---

## Database Schema

**Not Applicable** - This is a stateless Azure DevOps extension that does not maintain its own database. All state is managed by:
- Azure DevOps (scan metadata, task results)
- Checkmarx One (scan results, vulnerability data)

---

## External Integrations

### Checkmarx One Platform
- **Service**: Checkmarx One REST API
- **Purpose**: Scan submission, result retrieval, query execution
- **Authentication**: OAuth2 (Client ID/Secret) or API Key
- **Endpoint**: Configurable via task parameters
- **Rate Limits**: Subject to Checkmarx One API rate limits

### Azure DevOps
- **Service**: Azure DevOps REST API, Task Library
- **Purpose**: Task execution context, result reporting, variable management
- **Authentication**: ADO service connection credentials
- **Scope**: `vso.build_execute` (build and release pipeline execution)

### Marketplace
- **Platform**: Azure DevOps Marketplace
- **Listing**: https://marketplace.visualstudio.com/items?itemName=checkmarx.checkmarx-ast-azure-plugin
- **Publisher**: Checkmarx
- **Updates**: Distributed via marketplace

### CLI Tool Repository
- **Repository**: Checkmarx CLI downloads
- **URL**: download.checkmarx.com
- **Purpose**: Runtime download of Checkmarx One CLI tool

---

## Deployment Info

### Publishing

The plugin is distributed via **Azure DevOps Marketplace**.

#### Publication Process
1. Increment version in `vss-extension.json` (field: `version`)
2. Create GitHub release with tag (format: `v<major>.<minor>.<patch>`)
3. Azure DevOps Marketplace automatically publishes via GitHub Actions
4. Trigger: `manual-tag.yml` workflow on tag creation

#### Version Format
- Semantic Versioning: `<major>.<minor>.<patch>`
- Example: `3.0.14`

#### Release Artifacts
- Compressed extension package: `.vsix` file
- Published to Azure DevOps Marketplace
- Available via `npm install` (GitHub Package Registry)

### Installation

#### For Azure DevOps Users
1. Open Azure DevOps organization
2. Go to Extensions Marketplace
3. Search for "Checkmarx AST"
4. Click "Get it free"
5. Select organization and install
6. Configure in pipeline YAML or task UI

#### For Development/Local Testing
1. Clone repository
2. Install dependencies: `npm install`
3. Build: `npm run build`
4. Use local task in YAML: Reference local files instead of marketplace

### Configuration

Task configuration is managed via `vss-extension.json`:
- **Task ID**: Must match ADO task execution context
- **Task Inputs**: Defined in task definition within manifest
- **Service Connections**: Azure DevOps service connection for Checkmarx authentication

### Deployment Environments

- **Production**: Azure DevOps Marketplace (all organizations)
- **Staging**: GitHub releases (pre-release builds)
- **Development**: Local builds for testing

---

## Performance Considerations

### Scan Execution
- **Typical Duration**: 2-30 minutes (depends on repository size and scanner settings)
- **Agent Resources**: Requires 2GB+ available disk space for scan artifacts
- **Network Bandwidth**: High during artifact upload to Checkmarx One

### Optimization Tips

1. **Filter Source Files**: Use `--filter` parameters to exclude non-essential directories
   ```
   --filter "!node_modules,!.git"
   ```

2. **Parallel Scans**: Configure multiple agents in ADO to run concurrent scans

3. **Preset Configuration**: Use SCA Resolver to optimize dependency scanning

4. **Caching**: Cache dependencies locally to reduce upload size

5. **Incremental Analysis**: Use `--incremental` flag (if supported by Checkmarx One) to avoid full repository rescanning

### Known Performance Issues

- Large ZIP operations (>500MB) may exceed agent timeout
- Slow network connections may cause CLI download failures
- Concurrent scans from same agent may cause resource contention

---

## API / Endpoints / Interfaces

### Task Inputs

The plugin accepts these Azure DevOps task inputs (configurable in pipeline YAML or UI):

| Input | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `checkmarxService` | Endpoint | Yes | N/A | Azure DevOps service connection to Checkmarx One |
| `projectName` | String | Yes | N/A | Checkmarx One project name for scan results |
| `branchName` | String | Yes | N/A | Repository branch being scanned |
| `additionalParams` | String | No | `` | CLI parameters for scan customization |

### Task Outputs

The plugin sets these Azure DevOps variables after execution:

| Variable | Scope | Description |
|----------|-------|-------------|
| `CxOneScanId` | Build | Unique identifier for the completed scan |
| `CxOneCurrentScanId` | Build | Current scan ID (available during cleanup) |

### Scan Results

Results are provided in multiple formats:

1. **HTML Report** - Attachment `cxASTResults` in ADO pipeline
   - Format: HTML with summary and vulnerabilities
   - Generated via `wrapper.getResults("summaryHTML")`

2. **JSON Reports** - Via additional parameters
   - Format: Standard JSON vulnerability data structure
   - Generated via CLI `--output-format json`

3. **SBOM Reports** - Via additional parameters
   - Formats: CycloneDX, SPDX
   - Generated via CLI `--sbom-format` parameter

### Scan Parameters

CLI parameters can be passed via `additionalParams` input:

```bash
# Examples:
--preset high-security           # Apply security preset
--filter "!node_modules"         # Exclude paths
--incremental                    # Incremental scanning
--sca-resolver true              # Enable SCA Resolver
--output-format json             # Output format
```

### Service Connection

The `checkmarxService` endpoint must provide:
- **Authentication**: OAuth2 credentials or API Key
- **Server URL**: Checkmarx One instance (cloud or on-premises)
- **Credentials**: Client ID/Secret or API Key

---

## Security & Access

### Authentication

#### Methods Supported
1. **OAuth2** (Recommended)
   - Client ID and Client Secret
   - Issued by Checkmarx One platform
   - Suitable for service account authentication

2. **API Key**
   - Generated in Checkmarx One platform
   - Suitable for CI/CD automation
   - Treat as secret credential

#### Credential Management
- Credentials are passed via Azure DevOps **service connection**
- Never hardcode credentials in pipeline YAML or code
- Use ADO task library to retrieve secure variables

### Authorization

- **ADO Scope**: `vso.build_execute` - Permission to execute build tasks
- **Checkmarx One**: User/service account must have project scan permissions

### Secret Storage

- Secrets are stored in **Azure DevOps secret vault**
- Accessed via service connection abstraction
- CLI tool automatically masks credential output in logs

### Dependency Security

- Review `package.json` for dependency versions
- Use `npm audit` to identify vulnerabilities
- All dependencies must be Apache 2.0 or compatible licenses
- Monitor CVE databases for transitive dependency issues

### Code Security

- **No Credential Logging**: Credentials are never logged (ADO task lib masks them)
- **Input Validation**: Project names and branch names are validated before use
- **File Uploads**: ZIP archive is created from source code (no secrets should be included)
- **OWASP Compliance**: Code reviewed for common web vulnerabilities (not applicable for CLI tool)

### Access Control

- GitHub repository: Restricted to Checkmarx team members
- Marketplace: Public (available to all ADO organizations)
- CODEOWNERS: Defined in `CODEOWNERS` file for code review requirements

---

## Logging

### Log Output

The plugin outputs logs to:

1. **ADO Pipeline Console** - User-visible task output
2. **Log File** - File-based logging via `typescript-logging`
3. **Diagnostic Output** - Detailed trace information

### Log Levels

Standard logging levels (via typescript-logging):
- **DEBUG** - Detailed execution information
- **INFO** - General informational messages
- **WARN** - Warning messages (non-critical issues)
- **ERROR** - Error messages and exception details

### Log File Location

- **Filename**: Generated via `getLogFilename()` in Utils.ts
- **Directory**: Agent temp directory (`Agent.TempDirectory`)
- **Format**: Text with timestamps and severity levels
- **Retention**: Managed by Azure DevOps agent

### Sample Log Output

```
Project name: my-project
Branch name: main
Agent: Azure DevOps
Additional Params: --preset high-security
Completed scan.
Generating results.
[timestamp] INFO: Scan ID: abc-123-def
[timestamp] INFO: Results generated successfully
```

### Sensitive Data Masking

The Azure DevOps task library automatically masks:
- Service connection credentials
- API keys and tokens
- URLs containing sensitive parameters

---

## Debugging Steps

### Common Issues and Solutions

#### 1. "CLI Tool Not Found" / Download Failures

**Symptom**: `Error: Failed to download CLI tool` or `Command not found: cx`

**Cause**: download.checkmarx.com is not accessible or whitelisted

**Resolution**:
1. Verify firewall/proxy allows access to `download.checkmarx.com`
2. Add domain to whitelist if using corporate proxy
3. Check network connectivity from agent machine: `curl -I https://download.checkmarx.com`
4. Use plugin v2.x if domain cannot be whitelisted (includes bundled CLI)

#### 2. Authentication Failures

**Symptom**: `Error: Invalid credentials` or `401 Unauthorized`

**Cause**: Service connection credentials are incorrect or expired

**Resolution**:
1. Verify service connection exists in ADO organization settings
2. Test connection credentials manually with Checkmarx CLI
3. Refresh OAuth tokens (if using OAuth2)
4. Ensure service account has project scan permissions in Checkmarx One

#### 3. "Project Not Found"

**Symptom**: `Error: Project '<name>' not found`

**Cause**: Project doesn't exist in Checkmarx One or permissions are insufficient

**Resolution**:
1. Verify project exists in Checkmarx One: https://ast.checkmarx.com/
2. Confirm service account has access to the project
3. Check project name matches exactly (case-sensitive)
4. Ensure project is not archived

#### 4. Scan Timeout

**Symptom**: `Error: Task timed out` or `Scan cancelled due to timeout`

**Cause**: Scan duration exceeds ADO task timeout (usually 60 min default)

**Resolution**:
1. Increase ADO task timeout in pipeline YAML: `timeoutInMinutes: 120`
2. Optimize scan filters to reduce scope: Use `--filter` parameters
3. Configure incremental scanning to reduce duration
4. Increase agent resources (disk space, memory)

#### 5. CLI Parameter Issues

**Symptom**: `Error: Invalid parameter` or `Unknown option`

**Cause**: Incorrect or unsupported CLI parameters passed via `additionalParams`

**Resolution**:
1. Verify parameter syntax: `--param-name value`
2. Check Checkmarx One CLI documentation for supported parameters
3. Use `--help` flag locally to list available options
4. Review parameter values for special characters (may need escaping)

#### 6. Permission Denied / Access Issues

**Symptom**: `Error: Permission denied` when accessing files or directories

**Cause**: ADO agent running with insufficient permissions

**Resolution**:
1. Verify agent service account has read access to source repository
2. Ensure write permissions to agent temp directory
3. Run agent with elevated privileges if necessary (Windows)
4. Check file ownership and ACLs on Linux/macOS

### Debugging Commands

#### Enable Verbose Logging

Add to pipeline YAML:
```yaml
- task: CheckmarxOne@3
  inputs:
    additionalParams: '--verbose'
```

#### Local Testing

```bash
# Build the plugin locally
npm run build

# Run tests with debug output
DEBUG=* npm test

# Test CLI tool independently
cx scan create --help
```

#### Validate Configuration

```typescript
// In code, check configuration:
const config = getConfiguration();
console.log('Config:', JSON.stringify(config, null, 2));
```

#### Check Agent Environment

```bash
# List ADO agent environment variables
set | grep Agent  # Windows
env | grep AGENT  # Linux/macOS

# Verify network connectivity
curl -v https://api.checkmarx.com
curl -v https://download.checkmarx.com
```

### Diagnostic Logs Collection

To gather diagnostic information for support:

1. **Enable debug mode** in pipeline
2. **Capture task output**: Copy entire console log
3. **Collect log files**: From `Agent.TempDirectory/cxAstScan.log`
4. **Export configuration** (without credentials): Project name, branch, parameters
5. **Check Checkmarx One**: Verify scan exists with matching ID
6. **Network info**: Firewall rules, proxy configuration, DNS resolution

### Performance Profiling

To debug performance issues:

```bash
# Measure build time
time npm run build

# Profile test execution
npm test -- --reporter tap > test-profile.txt

# Check dependency size
npm ls --depth=0
```

---

## Version History

### Current Version
- **3.0.14+** - Latest stable release
- CLI tool downloaded at runtime (not bundled)
- Full Checkmarx One feature support

### Major Changes in v3.0.0+
- Removed bundled CLI tool (reduced package size)
- Now requires download.checkmarx.com access
- Azure DevOps marketplace listing updated

---

## Contributors

- **Checkmarx AST Integration Team**
- **Open Source Contributors** - See GitHub contributors page

---

## Getting Help

- **Documentation**: https://checkmarx.com/resource/documents/en/34965-68709-checkmarx-one-azure-devops-plugin.html
- **Quick Start Guide**: https://checkmarx.com/resource/documents/en/34965-68710-quick-start-guide---checkmarx-one-azure-devops-plugin.html
- **GitHub Issues**: https://github.com/Checkmarx/ast-azure-plugin/issues
- **Contact**: AST Integrations Team - check website for support channels

---

**Document Version**: 1.0
**Last Updated**: 2026-04-22
**Maintained By**: Checkmarx AST Integration Team
