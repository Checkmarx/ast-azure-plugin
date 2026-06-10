# AST CLI JavaScript Wrapper Runtime CLI - Development Guide

## Project Overview

The **AST CLI JavaScript Wrapper Runtime CLI** is a Node.js/TypeScript library that provides a wrapper layer for the Checkmarx AST (Application Security Testing) CLI. It enables JavaScript developers to interact with the AST CLI programmatically, abstracting the CLI interface and providing a type-safe, well-structured API.

**Status**: Active development and maintenance
**Package**: `@Checkmarx/ast-cli-javascript-wrapper-runtime-cli`
**Repository**: https://github.com/Checkmarx/ast-cli-javascript-wrapper-runtime-cli

### Key Purpose

This wrapper serves as a bridge between JavaScript/Node.js applications and the AST CLI binary, handling:
- AST CLI binary installation and version management
- Configuration management (credentials, endpoints, proxy settings)
- Execution and output parsing
- Error handling and logging
- Support for multiple security scanning features (SAST, SCA, KICS, ASCA, etc.)

---

## Architecture

### System Design

The project follows a modular architecture with clear separation of concerns:

```
CxWrapper (Main Entry Point)
├── CxConfig (Configuration Management)
├── CxInstaller (Binary Installation & Management)
├── ExecutionService (CLI Execution)
├── AstClient (HTTP Client for Downloads)
└── Feature Modules
    ├── Scan (CxScan)
    ├── Project (CxProject)
    ├── Results (CxResult, CxData, etc.)
    ├── SAST (via CxResult)
    ├── SCA (CxScaRealTime, CxScaPackageData)
    ├── KICS (CxKicsRealTime, CxKicsRemediation)
    ├── ASCA (CxAsca)
    ├── BFL (CxBFL)
    ├── Mask (CxMask, CxMaskedSecret)
    ├── Chat (CxChat)
    └── Other Features (CodeBashing, LearnMore, Predicates)
```

### Design Patterns

- **Multiton Pattern**: `CxWrapper` uses instance pooling to manage multiple wrapper instances
- **Semaphore Pattern**: Thread-safe execution with async-mutex for concurrent operations
- **Configuration Pattern**: Centralized configuration through `CxConfig`
- **Service Locator**: Feature modules accessed through the main wrapper instance

---

## Repository Structure

```
.
├── src/
│   ├── main/                    # Main source code
│   │   ├── wrapper/            # Core wrapper and execution engine
│   │   │   ├── CxWrapper.ts    # Main wrapper class
│   │   │   ├── CxWrapperFactory.ts # Wrapper instance factory
│   │   │   ├── CxConfig.ts     # Configuration management
│   │   │   ├── CxConstants.ts  # Constants
│   │   │   ├── ExecutionService.ts
│   │   │   ├── CxCommandOutput.ts
│   │   │   ├── CxParamType.ts
│   │   │   └── loggerConfig.ts
│   │   ├── client/             # HTTP client
│   │   │   └── AstClient.ts    # Download and HTTP utilities
│   │   ├── osinstaller/        # Binary installation
│   │   │   └── CxInstaller.ts
│   │   ├── errors/             # Custom error types
│   │   │   └── CxError.ts
│   │   ├── scan/               # Scan operations
│   │   │   └── CxScan.ts
│   │   ├── project/            # Project management
│   │   │   └── CxProject.ts
│   │   ├── results/            # Scan results handling
│   │   │   ├── CxResult.ts
│   │   │   ├── CxData.ts
│   │   │   ├── CxCvss.ts
│   │   │   ├── CxNode.ts
│   │   │   ├── CxDependencyPaths.ts
│   │   │   ├── CxPackageData.ts
│   │   │   ├── CxScaPackageData.ts
│   │   │   ├── CxResultType.ts
│   │   │   └── CxVulnerabilityDetails.ts
│   │   ├── scaRealtime/        # Software Composition Analysis
│   │   │   ├── CxScaRealTime.ts
│   │   │   └── CxScaRealTimeErrors.ts
│   │   ├── kicsRealtime/       # KICS (Infrastructure as Code Scanning)
│   │   │   └── CxKicsRealTime.ts
│   │   ├── asca/               # Application Security Code Analysis
│   │   │   ├── CxAsca.ts
│   │   │   └── AscaScanDetail.ts
│   │   ├── remediation/        # Remediation suggestions
│   │   │   └── CxKicsRemediation.ts
│   │   ├── bfl/                # Business Flow Language
│   │   │   └── CxBFL.ts
│   │   ├── mask/               # Secret masking
│   │   │   ├── CxMask.ts
│   │   │   └── CxMaskedSecret.ts
│   │   ├── chat/               # Chat integration
│   │   │   └── CxChat.ts
│   │   ├── codebashing/        # CodeBashing integration
│   │   │   └── CxCodeBashing.ts
│   │   ├── learnmore/          # Learning resources
│   │   │   ├── CxLearnMoreDescriptions.ts
│   │   │   └── CxLearnMoreSamples.ts
│   │   └── predicates/         # Predicate operations
│   │       └── CxPredicate.ts
│   └── tests/
│       ├── *.test.ts           # Test files (AuthTest, ChatTest, MaskTest, etc.)
│       ├── unit/               # Additional unit tests
│       └── data/               # Test fixtures and data
├── dist/                       # Compiled JavaScript output
├── coverage/                   # Code coverage reports
├── .github/workflows/          # GitHub Actions CI/CD
├── tsconfig.json              # TypeScript configuration
├── jest.config.js             # Jest test configuration
├── package.json               # NPM package configuration
├── README.md                  # User-facing documentation
└── CLAUDE.md                  # This file
```

---

## Technology Stack

### Core Technologies
- **Language**: TypeScript 5.6.3
- **Runtime**: Node.js (ES2015 target)
- **Module System**: CommonJS (compiled from TypeScript)

### Build & Compilation
- **Compiler**: TypeScript 5.6.3
- **Build Process**: tsc (TypeScript compiler)
- **Build Output**: `dist/` directory with source maps

### Testing
- **Test Framework**: Jest 29.7.0
- **Test Runner Configuration**: ts-jest
- **Mocking**: ts-mockito 2.6.1
- **Coverage Threshold**: Lines 80%, Functions 80%, Branches 60%, Statements 80%

### Linting & Code Quality
- **Linter**: ESLint 8.57.1
- **Parser**: @typescript-eslint/parser 5.29.0
- **Plugins**: @typescript-eslint/eslint-plugin 5.29.0
- **Preset**: eslint:recommended + typescript-eslint recommended

### Core Dependencies
- **async-mutex**: ^0.5.0 - Synchronization primitives for async code
- **azure-pipelines-tool-lib**: ^2.0.8 - Azure Pipelines tools (file downloads, caching)
- **https-proxy-agent**: ^7.0.6 - Proxy support for HTTPS requests
- **log4js**: ^6.9.1 - Structured logging
- **node-fetch**: ^3.3.2 - Fetch API for Node.js
- **tar**: ^7.5.11 - TAR archive handling
- **unzipper**: ^0.12.3 - ZIP archive extraction
- **tunnel**: (direct import in AstClient) - HTTPS over HTTP tunneling for proxies (should be added as direct dependency)

### Development Dependencies
- **Babel**: @babel/core, @babel/preset-typescript, @babel/preset-env - Code transformation
- **Type Definitions**: @types/node, @types/jest, @types/adm-zip, @types/tunnel, @types/unzipper
- **Transpilation**: babel-jest 29.7.0
- **File Utilities**: copyfiles 2.4.1

---

## Development Setup

### Prerequisites
- **Node.js**: 14.x or higher (LTS recommended)
- **npm**: 6.x or higher
- **Git**: For version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Checkmarx/ast-cli-javascript-wrapper-runtime-cli.git
   cd ast-cli-javascript-wrapper-runtime-cli
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Verify installation**
   ```bash
   npm run build
   ```

### Development Workflow

- **Build**: `npm run build` - Compiles TypeScript to JavaScript
- **Build with postbuild**: Automatically copies test data to dist
- **Lint**: `npm run lint` - Check code style and issues
- **Lint & Fix**: `npm run lint-and-fix` - Auto-fix linting issues
- **Test**: `npm run test` - Run all tests with coverage
- **Unit Tests Only**: `npm run test:unit` - Run unit tests without coverage

### Environment Variables for Testing

For integration tests, set these environment variables:

**Linux/macOS**:
```bash
export CX_CLIENT_ID="your-client-id"
export CX_CLIENT_SECRET="your-client-secret"
export CX_APIKEY="your-api-key"
export CX_BASE_URI="https://ast.checkmarx.net"
export CX_BASE_AUTH_URI="https://auth.checkmarx.net"
export CX_TENANT="your-tenant"
export PATH_TO_EXECUTABLE="/path/to/ast-cli"
```

**Windows PowerShell**:
```powershell
setx CX_CLIENT_ID "your-client-id"
setx CX_CLIENT_SECRET "your-client-secret"
setx CX_APIKEY "your-api-key"
setx CX_BASE_URI "https://ast.checkmarx.net"
setx CX_BASE_AUTH_URI "https://auth.checkmarx.net"
setx CX_TENANT "your-tenant"
setx PATH_TO_EXECUTABLE "C:\path\to\ast-cli.exe"
```

---

## Coding Standards

### TypeScript Configuration
- **Target**: ES2015
- **Module**: CommonJS
- **Declaration Files**: Generated automatically
- **Source Maps**: Enabled for debugging
- **Strict Settings**:
  - `noImplicitAny`: true - All types must be explicit
  - `forceConsistentCasingInFileNames`: true
  - `noUnusedLocals`: true - No unused variables allowed

### Code Style

- **Naming Conventions**:
  - Classes: PascalCase (e.g., `CxWrapper`, `AstClient`)
  - Functions/Methods: camelCase (e.g., `downloadFile`, `createProxyRequestHandler`)
  - Constants: UPPER_SNAKE_CASE (e.g., `MAX_ATTEMPTS`, `DEFAULT_TIMEOUT`)
  - Private members: Prefix with `_` or use TypeScript `private` keyword
  - Interfaces: PrefixCamelCase or I-prefix (e.g., `CxConfig`, `IConfigurable`)

- **File Organization**:
  - One main class per file (named matching the file)
  - Related types/interfaces in the same file as the main class
  - Imports grouped: external, then relative imports
  - Exports at end of file

- **Formatting**:
  - 2-space indentation (configured in ESLint)
  - 120-character line length (soft limit)
  - Trailing commas in multi-line structures
  - Single quotes for strings (no template literals unless needed)
  - Prefer `const` over `let`, avoid `var`

### Documentation

- **JSDoc Comments**: Use for public APIs and complex logic
- **Inline Comments**: Only for non-obvious implementation details
- **No Over-Documentation**: Self-documenting code is preferred; comments explain WHY, not WHAT

### Import/Export

- Use ES6 module syntax
- Explicit imports (no wildcard imports unless necessary)
- Named exports preferred for multiple exports per file
- Default export for main class per module

### Error Handling

- Always throw `CxError` for custom errors
- Wrap external errors with context information
- Log errors before throwing (use `logger` from loggerConfig)
- Include stack traces in logs for debugging

---

## Project Rules & Constraints

### Critical Rules (Don'ts)

1. **Never Commit Secrets**
   - No API keys, tokens, or credentials in code
   - Use environment variables and `.gitignore` for sensitive data
   - Review all commits for accidental secret inclusion

2. **Proxy Support is Mandatory**
   - All HTTP requests must respect `HTTP_PROXY` environment variable
   - Use `AstClient` for downloads with proxy support
   - Test proxy scenarios in PR reviews

3. **Type Safety First**
   - No `any` types without explicit justification
   - Strict TypeScript compilation required
   - Use discriminated unions and type guards where possible

4. **Test Coverage Requirements**
   - Minimum 80% line coverage required (enforced by Jest)
   - 60% branch coverage minimum
   - New features must include unit tests
   - Integration tests for CLI interactions

5. **No Breaking Changes Without Review**
   - Document API changes in PR description
   - Semver versioning: MAJOR.MINOR.PATCH
   - Deprecation period for major changes

6. **Async/Await for Concurrency**
   - Use `async/await` instead of callbacks
   - Respect `CxWrapper` semaphore for CLI execution
   - No concurrent CLI invocations without synchronization

7. **Dependency Management**
   - Use npm for all dependency management
   - Override rules in package.json for security patches
   - Minimize external dependencies

### Must-Have Checks Before PR

- TypeScript compilation succeeds (`npm run build`)
- All tests pass (`npm run test`)
- ESLint passes (`npm run lint`)
- Coverage thresholds met
- No console.log statements (use logger)
- No hardcoded paths or credentials

### Git Workflow

- Base all work on `main` branch
- Feature branch naming: `feature/description`, `fix/issue-description`
- Commit messages: descriptive and present tense
- Squash commits before merge when appropriate
- Require PR review before merging to main

---

## Testing Strategy

### Test Organization

Tests are located in `src/tests/` with the following structure:
- `*.test.ts` - Test files for individual modules (AuthTest, ChatTest, MaskTest, ProjectTest, ResultTest, ScanTest, etc.)
- `unit/` - Additional unit tests
- `data/` - Test fixtures and mock data (copied to dist during build)

### Test Execution

```bash
# Run all tests with coverage
npm run test

# Run unit tests only (no coverage)
npm run test:unit

# Run specific test file
npm run test -- --testPathPattern=CxWrapper

# Watch mode
npm run test -- --watch
```

### Coverage Thresholds (Enforced)

- **Lines**: 80%
- **Functions**: 80%
- **Branches**: 60%
- **Statements**: 80%

### Testing Best Practices

1. **Use ts-mockito for Mocking**
   - Mock external dependencies (AstClient, ExecutionService)
   - Verify method calls and arguments
   - Avoid mocking internal state when possible

2. **Test Data Management**
   - Store test fixtures in `src/tests/data/`
   - Reference fixtures with relative paths
   - Keep fixtures small and focused
   - Document fixture purpose with comments

3. **Async Testing**
   - Use `async/await` in test functions
   - Handle rejections properly
   - Don't forget to await promises

4. **Environment Variables**
   - Mock via `process.env` before tests
   - Restore original values after tests
   - Document required env vars in tests

5. **Error Cases**
   - Test both success and failure paths
   - Verify error messages and types
   - Test timeout scenarios where applicable

---

## Known Issues & Limitations

### Current Limitations

1. **Single AST CLI Binary Per Process**
   - Only one version of AST CLI can be active at a time
   - Downloading a different version replaces the existing one
   - Multiple parallel scans must use the same CLI version

2. **Proxy Configuration**
   - Only `HTTP_PROXY` environment variable is supported
   - `HTTPS_PROXY` and `NO_PROXY` not yet implemented
   - Proxy authentication requires URL-encoded credentials

3. **Cross-Platform Binary Management**
   - Binary installation varies by OS (Windows, Linux, macOS)
   - Resource paths are OS-specific
   - Testing cross-platform scenarios is challenging in CI

4. **CLI Version Management**
   - No automatic version resolution
   - Must specify exact version or use PATH_TO_EXECUTABLE
   - Version mismatches may cause unexpected behavior

5. **Semaphore Bottleneck**
   - Single semaphore slot limits concurrent CLI executions
   - Sequential execution may impact performance
   - Blocking design for thread safety

### Workarounds & Mitigations

- **Version Issues**: Pin specific CLI versions in consumer applications
- **Proxy Support**: Use corporate proxy at OS level as fallback
- **Cross-Platform**: Test on multiple OS before releases
- **Concurrency**: Queue scan requests externally if parallelism needed

---

## Deployment Information

### Package Publication

The package is published to **GitHub Packages** (npm.pkg.github.com):

```json
{
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  }
}
```

### Publishing a New Version

1. Update version in `package.json`
2. Merge to main with PR approval
3. Tag release: `git tag v1.0.x`
4. Push tags: `git push origin --tags`
5. GitHub Actions release workflow handles publication

### Version Management

- **File**: `checkmarx-ast-cli.version` - Tracks CLI version
- **Format**: Simple text file with version string
- **Location**: Root directory
- **Usage**: Referenced by CxInstaller for binary management

### CI/CD Workflows

Located in `.github/workflows/`:
- `ci.yml` - Runs on every push and PR
- `release.yml` - Creates releases and publishes package
- `checkmarx-one-scan.yml` - Security scanning on PRs
- `update-cli.yml` - Updates AST CLI binary reference
- `nightly.yml` - Nightly build and test run
- `auto-merge-pr.yml` - Auto-merges dependency updates
- `dependabot-auto-merge.yml` - Dependabot PR automation
- `delete-packages-and-releases.yml` - Deletes old packages and releases
- `pr-automation.yml` - Pull request automation

---

## External Integrations

### Checkmarx AST CLI

The main external dependency is the **Checkmarx AST CLI** binary:
- **Purpose**: Performs actual security scanning
- **Installation**: Automatic via CxInstaller
- **Configuration**: Through CxConfig environment variables
- **API**: Command-line interface with JSON output parsing

### Azure Pipelines Integration

- **Library**: azure-pipelines-tool-lib
- **Usage**: File downloading, caching, tool management
- **Benefit**: Handles retries and proxy automatically

### GitHub Integration

- **Actions**: CI/CD automation
- **Packages**: NPM package hosting
- **Releases**: Automated version tagging and release notes

---

## Performance Considerations

### Optimization Areas

1. **Binary Caching**
   - AST CLI binary cached after download
   - Reused across multiple scans in same process
   - Reduces download time for subsequent runs

2. **Lazy Loading**
   - Feature modules loaded on-demand
   - Reduces initial memory footprint
   - Only required modules instantiated

3. **Async Execution**
   - CLI execution non-blocking
   - Multiple scans queued (not parallel)
   - Prevents resource exhaustion

4. **Retry Logic**
   - AstClient implements exponential backoff
   - Max 3 attempts for downloads by default
   - Configurable retry interval (2 seconds)

### Performance Bottlenecks

- **CLI Execution**: Sequential (semaphore-limited)
- **Download Speed**: Network-dependent
- **Disk I/O**: Binary extraction and resource copying
- **JSON Parsing**: Large result sets

### Monitoring & Metrics

- **Logger**: log4js provides timing information
- **Coverage**: Jest reports execution time
- **No Built-in Metrics**: Use external APM for production

---

## API & Endpoints

### Main Entry Point: CxWrapper

```typescript
class CxWrapper {
  static async getInstance(cxScanConfig: CxConfig, logFilePath: string): Promise<CxWrapper>
  config: CxConfig
  cxInstaller: CxInstaller
  // Scan methods
  scanCreate(params: CxParamType[]): Promise<CxCommandOutput>
  scanCancel(params: CxParamType[]): Promise<CxCommandOutput>
  scanShow(params: CxParamType[]): Promise<CxCommandOutput>
  scanList(params: CxParamType[]): Promise<CxCommandOutput>
  // Other feature methods accessed through instance
}
```

### Feature Modules

Each feature module exports a main class following the `Cx[Feature]` naming convention:
- `CxScan` - Scan operations
- `CxProject` - Project management
- `CxResult` - Result parsing
- `CxScaRealTime` - SCA real-time scanning
- `CxKicsRealTime` - KICS real-time scanning
- `CxAsca` - Application Security Code Analysis
- `CxBFL` - Business Flow Language
- `CxMask` - Secret masking
- `CxChat` - Chat functionality
- `CxCodeBashing` - CodeBashing integration
- `CxLearnMoreDescriptions` / `CxLearnMoreSamples` - Learning resources
- `CxPredicate` - Predicate operations
- `CxKicsRemediation` - KICS remediation suggestions

### Configuration: CxConfig

Main configuration object properties:
- `apiKey`: API key for authentication
- `clientId` + `clientSecret`: OAuth credentials
- `baseUri`: AST API endpoint
- `baseAuthUri`: Authentication endpoint
- `tenant`: Tenant identifier
- `pathToExecutable`: Path to AST CLI binary
- `additionalParameters`: Extra CLI arguments

---

## Security & Access

### Authentication Methods

1. **API Key** (recommended for CI/CD)
   ```javascript
   const config = new CxConfig();
   config.apiKey = process.env.CX_APIKEY;
   ```

2. **OAuth 2.0 Client Credentials**
   ```javascript
   config.clientId = process.env.CX_CLIENT_ID;
   config.clientSecret = process.env.CX_CLIENT_SECRET;
   ```

### Credential Management

- **Never commit credentials** to the repository
- Use environment variables or secure vaults
- Rotate credentials regularly
- Use service accounts for CI/CD

### Proxy Security

- **HTTP_PROXY** environment variable support
- URL-encoded authentication in proxy URL
- HTTPS tunneling for encrypted communication
- Error handling for invalid proxy URLs

### HTTPS & Certificates

- All HTTPS endpoints require valid certificates
- Certificate validation cannot be disabled
- Self-signed certificates will fail
- Configure corporate CA if needed

### RBAC (Role-Based Access Control)

- Enforced by AST API
- Client credentials determine accessible projects/scans
- API key permissions managed in Checkmarx platform
- Wrapper does not implement additional RBAC

### Audit & Logging

- All operations logged via log4js
- Configurable log levels (debug, info, warn, error)
- Sensitive data (credentials) never logged
- Logs can be written to file or stdout

---

## Logging

### Logger Configuration

Located in `src/main/wrapper/loggerConfig.ts`:

```typescript
import { getLoggerWithFilePath, logger } from './loggerConfig';

// Default logger
logger.info('Message');
logger.error('Error message');
logger.debug('Debug message');

// File-based logger
getLoggerWithFilePath('/path/to/logfile.log');
```

### Log Levels

- **DEBUG**: Detailed internal operations
- **INFO**: Important events (started scan, downloaded CLI)
- **WARN**: Potentially problematic situations
- **ERROR**: Error conditions requiring attention
- **FATAL**: Unrecoverable errors

### Logger Integration

- **Default Output**: Console (stdout/stderr)
- **File Output**: Optional via `getLoggerWithFilePath()`
- **Appenders**: Configurable in loggerConfig
- **Layout**: Timestamp, level, category, message

### Best Practices

1. Use appropriate log level for context
2. Include relevant contextual information
3. Never log sensitive data (credentials, tokens)
4. Use logger instance, not console.log
5. Consider performance impact of debug logging

---

## Debugging Steps

### Enable Debug Logging

```javascript
import log4js from 'log4js';

// Configure debug level
log4js.configure({
  appenders: { console: { type: 'console' } },
  categories: { default: { appenders: ['console'], level: 'debug' } }
});

const wrapper = await CxWrapper.getInstance(config);
```

### Common Issues & Solutions

#### 1. "AST CLI not found"
```
Issue: CxInstaller cannot locate the AST CLI binary
Solutions:
- Ensure PATH_TO_EXECUTABLE points to valid binary
- Check PATH environment variable includes binary location
- On Windows, verify binary is not blocked (Properties > Unblock)
- Try re-downloading: delete cached binary and reinitialize
```

#### 2. "Proxy connection failed"
```
Issue: HTTP_PROXY environment variable set but not working
Solutions:
- Verify proxy URL format: http://[user:pass@]host:port
- Test proxy manually: curl -x [proxy] https://google.com
- Check proxy authentication (username/password encoding)
- Ensure https-proxy-agent configuration is correct
```

#### 3. "Authentication failed"
```
Issue: Invalid credentials or endpoint configuration
Solutions:
- Verify CX_CLIENT_ID and CX_CLIENT_SECRET are set
- Or verify CX_APIKEY is set (not both)
- Ensure CX_BASE_AUTH_URI and CX_BASE_URI are correct
- Check credentials haven't expired in Checkmarx platform
- Verify tenant configuration matches Checkmarx setup
```

#### 4. "Semaphore timeout"
```
Issue: CLI execution blocked by semaphore (another scan in progress)
Solutions:
- Wait for previous scans to complete
- Check for hung processes: ps aux | grep ast-cli
- Restart Node.js process if hung
- Consider queuing scans externally if parallelism needed
```

#### 5. "Type errors with 'any' type"
```
Issue: TypeScript strict mode errors
Solutions:
- Avoid casting to 'any'
- Create specific types/interfaces
- Use type guards or discriminated unions
- Check types in dependent modules
```

### Debug Techniques

1. **Enable Verbose Logging**
   ```javascript
   getLoggerWithFilePath('./debug.log');
   // Logs will show detailed execution flow
   ```

2. **Use Node Debugger**
   ```bash
   node --inspect-brk dist/main/wrapper/CxWrapper.js
   # Opens Chrome DevTools debugging interface
   ```

3. **Inspect Configuration**
   ```javascript
   const wrapper = await CxWrapper.getInstance(config);
   console.log('Config:', wrapper.config);
   console.log('CLI Path:', wrapper.cxInstaller.getExecutablePath());
   ```

4. **Test CLI Directly**
   ```bash
   # Run AST CLI directly to isolate wrapper issues
   /path/to/ast-cli version
   /path/to/ast-cli scan help
   ```

5. **Check Environment Variables**
   ```bash
   # Unix
   env | grep CX_
   env | grep HTTP_PROXY
   
   # PowerShell
   Get-ChildItem env: | Where-Object { $_.Name -like 'CX_*' -or $_.Name -like '*PROXY*' }
   ```

### IDE Debugging (VS Code)

Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Tests",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

Then press F5 to start debugging.

---

## Maintenance & Contributions

### Code Review Process

1. Create feature branch from `main`
2. Open Pull Request with clear description
3. Ensure all checks pass (CI, coverage, lint)
4. Request review from CODEOWNERS
5. Merge only after approval

### CODEOWNERS

Primary maintainer: `@cx-anurag-dalke`

For PR reviews, mention codeowner for faster turnaround.

### Contributing Guidelines

1. Follow coding standards outlined above
2. Add tests for new features
3. Update documentation for API changes
4. Keep commits atomic and descriptive
5. Avoid committing build artifacts

### Release Process

1. Update `package.json` version (semver)
2. Update `checkmarx-ast-cli.version` if CLI version changes
3. Merge to `main` with PR
4. Tag release: `git tag v1.0.x`
5. GitHub Actions handles publication

### Dependency Updates

- Automated via Dependabot
- Auto-merge enabled for patch updates
- Manual review required for minor/major
- Security vulnerabilities trigger immediate PRs

---

## Additional Resources

### Repository Links
- **GitHub Repo**: https://github.com/Checkmarx/ast-cli-javascript-wrapper-runtime-cli
- **Issue Tracker**: https://github.com/Checkmarx/ast-cli-javascript-wrapper-runtime-cli/issues
- **Package**: https://github.com/CheckmarxDev/packages?repo_name=ast-cli-javascript-wrapper-runtime-cli

### Related Projects
- **AST CLI**: https://github.com/Checkmarx/ast-cli (main CLI binary)
- **AST VSCode Extension**: https://github.com/Checkmarx/ast-vscode-extension

### Documentation
- See [README.md](README.md) for user-facing usage documentation
- TypeScript/JavaScript docs in source code comments
- Type definitions in `dist/main/**/*.d.ts`

### Support Contacts
- Checkmarx: https://checkmarx.com
- Security Issues: Follow responsible disclosure

---

## Quick Reference

### Useful Commands
```bash
npm run build              # Compile TypeScript
npm run lint              # Check code style
npm run lint-and-fix      # Auto-fix issues
npm run test              # Run all tests with coverage
npm run test:unit         # Run unit tests only
```

### Key Files
- **Main Class**: `src/main/wrapper/CxWrapper.ts`
- **Configuration**: `src/main/wrapper/CxConfig.ts`
- **Installation**: `src/main/osinstaller/CxInstaller.ts`
- **Client**: `src/main/client/AstClient.ts`
- **Logging**: `src/main/wrapper/loggerConfig.ts`

### Common Imports
```typescript
import { CxWrapper } from '@Checkmarx/ast-cli-javascript-wrapper-runtime-cli';
import { CxConfig } from '@Checkmarx/ast-cli-javascript-wrapper-runtime-cli';
import { CxError } from '@Checkmarx/ast-cli-javascript-wrapper-runtime-cli';
```

---

**Last Updated**: 2026-04-22
**Version**: Matches ast-cli-javascript-wrapper-runtime-cli v1.0.36
