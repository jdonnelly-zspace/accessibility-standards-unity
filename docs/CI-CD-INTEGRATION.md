# CI/CD Integration Guide

Complete guide for integrating accessibility-standards-unity into your CI/CD pipeline.

## Table of Contents

- [Overview](#overview)
- [GitHub Actions](#github-actions)
- [GitLab CI](#gitlab-ci)
- [Jenkins](#jenkins)
- [Azure DevOps](#azure-devops)
- [Configuration Options](#configuration-options)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

---

## Overview

The accessibility-standards-unity framework can be integrated into any CI/CD pipeline to:

- **Automatically audit** Unity projects on every commit or pull request
- **Prevent regressions** by failing builds when new critical issues are introduced
- **Track compliance** over time with baseline comparison
- **Generate reports** (VPAT, PDFs, CSVs) for stakeholders
- **Capture screenshots** and perform visual accessibility analysis
- **Generate code fixes** automatically for detected issues

### Exit Codes

The audit tool uses standard exit codes for CI/CD integration:

- `0` - Success (no critical issues, no regressions)
- `1` - Failure (critical issues found OR compliance score decreased)
- `2` - Warning (high priority issues, but score unchanged)

---

## GitHub Actions

### Quick Start

The framework includes pre-configured workflows in `.github/workflows/`:

1. **accessibility-audit.yml** - Full audit with screenshots and visual analysis
2. **accessibility-regression.yml** - Regression checking against baseline
3. **publish-reports.yml** - Generate and deploy reports to GitHub Pages

### Basic Setup

1. **Add to your repository:**

```bash
cd your-unity-project
git submodule add https://github.com/jdonnelly-zspace/accessibility-standards-unity.git
```

2. **Copy workflow files:**

```bash
cp accessibility-standards-unity/.github/workflows/*.yml .github/workflows/
```

3. **Configure Unity license** (for screenshot capture):

Add these secrets to your repository (Settings → Secrets and variables → Actions):

- `UNITY_LICENSE` - Your Unity license file content
- `UNITY_EMAIL` - Your Unity account email
- `UNITY_PASSWORD` - Your Unity account password

**Note:** For free Unity licenses, see [GameCI Unity activation guide](https://game.ci/docs/github/activation).

### Example: Basic Workflow

```yaml
name: Accessibility Audit

on:
  pull_request:
    branches: [ main ]
  push:
    branches: [ main ]

jobs:
  audit:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install Dependencies
        run: |
          cd accessibility-standards-unity
          npm ci

      - name: Run Accessibility Audit
        run: |
          node accessibility-standards-unity/bin/audit.js . \
            --full \
            --fail-on-regression \
            --output AccessibilityAudit

      - name: Upload Reports
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: accessibility-reports
          path: AccessibilityAudit/
          retention-days: 90
```

### Example: With Screenshot Capture

```yaml
name: Accessibility Audit with Screenshots

on: [pull_request, push]

env:
  UNITY_LICENSE: ${{ secrets.UNITY_LICENSE }}
  UNITY_EMAIL: ${{ secrets.UNITY_EMAIL }}
  UNITY_PASSWORD: ${{ secrets.UNITY_PASSWORD }}

jobs:
  audit:
    runs-on: ubuntu-latest
    timeout-minutes: 30

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: 'accessibility-standards-unity/package-lock.json'

      - name: Cache Unity Library
        uses: actions/cache@v3
        with:
          path: Library/
          key: Library-${{ hashFiles('**/ProjectSettings/**') }}

      - name: Install Node Dependencies
        run: |
          cd accessibility-standards-unity
          npm ci

      - name: Setup Unity
        uses: game-ci/unity-builder@v4
        with:
          unityVersion: 2022.3.10f1
          targetPlatform: StandaloneLinux64

      - name: Run Full Audit
        run: |
          node accessibility-standards-unity/bin/audit.js . \
            --full \
            --capture-screenshots \
            --analyze-visual \
            --generate-fixes \
            --export-pdf \
            --verbose

      - name: Upload Screenshots
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: accessibility-screenshots
          path: AccessibilityAudit/screenshots/
          retention-days: 30

      - name: Upload Reports
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: accessibility-reports
          path: AccessibilityAudit/
          retention-days: 90
```

### Example: Compliance Tracking

```yaml
name: Accessibility Compliance Tracking

on:
  pull_request:
  push:
    branches: [ main ]

jobs:
  audit:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Full history for compliance tracking

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install Dependencies
        run: |
          cd accessibility-standards-unity
          npm ci

      - name: Restore Baseline
        uses: actions/cache@v3
        with:
          path: compliance-history/
          key: compliance-baseline-${{ github.ref }}

      - name: Run Audit with Compliance Tracking
        run: |
          node accessibility-standards-unity/bin/audit.js . \
            --track-compliance \
            --fail-on-regression

      - name: Generate Diff Report
        if: github.event_name == 'pull_request'
        run: |
          node accessibility-standards-unity/bin/compare-audits.js \
            compliance-history/baseline.json \
            AccessibilityAudit/accessibility-analysis.json

      - name: Comment PR with Results
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const audit = JSON.parse(fs.readFileSync('AccessibilityAudit/accessibility-analysis.json', 'utf8'));

            let comment = `## Accessibility Audit Results\\n\\n`;
            comment += `**Compliance Score:** ${audit.complianceEstimate.score}%\\n`;
            comment += `**Level:** ${audit.complianceEstimate.level}\\n\\n`;
            comment += `### Issues\\n`;
            comment += `- 🔴 Critical: ${audit.summary.criticalIssues}\\n`;
            comment += `- 🟠 High: ${audit.summary.highPriorityIssues}\\n`;
            comment += `- 🟡 Medium: ${audit.summary.mediumPriorityIssues}\\n`;
            comment += `- 🟢 Low: ${audit.summary.lowPriorityIssues}\\n`;

            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: comment
            });

      - name: Update Baseline (main only)
        if: github.ref == 'refs/heads/main'
        run: |
          node accessibility-standards-unity/bin/audit.js . --baseline
          git config user.name "Accessibility Bot"
          git config user.email "accessibility@bot.com"
          git add compliance-history/
          git commit -m "chore: Update accessibility baseline [skip ci]"
          git push
```

---

## GitLab CI

### Example: .gitlab-ci.yml

```yaml
stages:
  - audit
  - report

variables:
  GIT_SUBMODULE_STRATEGY: recursive
  NODE_VERSION: '18'

accessibility-audit:
  stage: audit
  image: node:18

  before_script:
    - cd accessibility-standards-unity
    - npm ci
    - cd ..

  script:
    - node accessibility-standards-unity/bin/audit.js . --full --verbose --output AccessibilityAudit

  artifacts:
    when: always
    paths:
      - AccessibilityAudit/
    reports:
      junit: AccessibilityAudit/audit-report.xml  # If you generate JUnit XML
    expire_in: 90 days

  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
    - if: '$CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH'

accessibility-with-screenshots:
  stage: audit
  image: gableroux/unity3d:2022.3.10f1

  before_script:
    - apt-get update && apt-get install -y nodejs npm
    - cd accessibility-standards-unity
    - npm ci
    - cd ..

  script:
    - node accessibility-standards-unity/bin/audit.js .
        --full
        --capture-screenshots
        --analyze-visual
        --verbose

  artifacts:
    when: always
    paths:
      - AccessibilityAudit/
    expire_in: 30 days

  only:
    - main
    - merge_requests

compliance-tracking:
  stage: audit
  image: node:18

  before_script:
    - cd accessibility-standards-unity
    - npm ci
    - cd ..

  script:
    - node accessibility-standards-unity/bin/audit.js . --track-compliance --fail-on-regression

  after_script:
    - |
      if [ -f "AccessibilityAudit/accessibility-analysis.json" ]; then
        node -e "
          const audit = require('./AccessibilityAudit/accessibility-analysis.json');
          console.log('Compliance Score:', audit.complianceEstimate.score + '%');
          console.log('Critical Issues:', audit.summary.criticalIssues);
        "
      fi

  artifacts:
    when: always
    paths:
      - AccessibilityAudit/
      - compliance-history/
    expire_in: 365 days

  cache:
    key: compliance-baseline
    paths:
      - compliance-history/

  only:
    - main
    - merge_requests

generate-pdf-report:
  stage: report
  image: node:18

  dependencies:
    - accessibility-audit

  before_script:
    - cd accessibility-standards-unity
    - npm ci
    - cd ..

  script:
    - node accessibility-standards-unity/bin/export-pdf.js
        AccessibilityAudit/VPAT-COMPREHENSIVE.md
        --output AccessibilityAudit/exports/VPAT-Report.pdf

  artifacts:
    paths:
      - AccessibilityAudit/exports/VPAT-Report.pdf
    expire_in: 365 days

  only:
    - main
```

### Merge Request Comments

To add comments to merge requests with audit results:

```yaml
comment-mr:
  stage: report
  image: node:18
  dependencies:
    - accessibility-audit

  script:
    - |
      if [ -f "AccessibilityAudit/accessibility-analysis.json" ]; then
        SCORE=$(node -e "console.log(require('./AccessibilityAudit/accessibility-analysis.json').complianceEstimate.score)")
        CRITICAL=$(node -e "console.log(require('./AccessibilityAudit/accessibility-analysis.json').summary.criticalIssues)")

        COMMENT="## Accessibility Audit Results\n\n"
        COMMENT+="**Compliance Score:** ${SCORE}%\n"
        COMMENT+="**Critical Issues:** ${CRITICAL}\n\n"
        COMMENT+="[View full reports in artifacts](${CI_JOB_URL}/artifacts/browse)"

        curl --request POST \
          --header "PRIVATE-TOKEN: ${GITLAB_TOKEN}" \
          "${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/merge_requests/${CI_MERGE_REQUEST_IID}/notes" \
          --data "body=${COMMENT}"
      fi

  only:
    - merge_requests

  variables:
    GITLAB_TOKEN: $GITLAB_ACCESS_TOKEN  # Add as CI/CD variable
```

---

## Jenkins

### Example: Jenkinsfile

```groovy
pipeline {
    agent any

    environment {
        NODE_VERSION = '18'
        UNITY_VERSION = '2022.3.10f1'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                sh 'git submodule update --init --recursive'
            }
        }

        stage('Setup') {
            steps {
                sh '''
                    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
                    apt-get install -y nodejs
                    cd accessibility-standards-unity
                    npm ci
                '''
            }
        }

        stage('Accessibility Audit') {
            steps {
                sh '''
                    node accessibility-standards-unity/bin/audit.js . \
                        --full \
                        --verbose \
                        --output AccessibilityAudit
                '''
            }
            post {
                always {
                    archiveArtifacts artifacts: 'AccessibilityAudit/**/*', fingerprint: true

                    script {
                        def audit = readJSON file: 'AccessibilityAudit/accessibility-analysis.json'
                        def score = audit.complianceEstimate.score
                        def critical = audit.summary.criticalIssues

                        currentBuild.description = "Compliance: ${score}% | Critical: ${critical}"

                        if (critical > 0) {
                            currentBuild.result = 'UNSTABLE'
                            error("Found ${critical} critical accessibility issues")
                        }
                    }
                }
            }
        }

        stage('Generate Reports') {
            steps {
                sh '''
                    node accessibility-standards-unity/bin/export-pdf.js \
                        AccessibilityAudit/VPAT-COMPREHENSIVE.md \
                        --output AccessibilityAudit/exports/VPAT-Report.pdf

                    node accessibility-standards-unity/bin/export-csv.js \
                        AccessibilityAudit/accessibility-analysis.json \
                        --output AccessibilityAudit/exports/findings.csv
                '''
            }
            post {
                always {
                    archiveArtifacts artifacts: 'AccessibilityAudit/exports/**/*', fingerprint: true
                }
            }
        }

        stage('Compliance Tracking') {
            when {
                branch 'main'
            }
            steps {
                sh '''
                    node accessibility-standards-unity/bin/audit.js . --baseline
                '''
                archiveArtifacts artifacts: 'compliance-history/**/*', fingerprint: true
            }
        }
    }

    post {
        always {
            publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'AccessibilityAudit',
                reportFiles: 'AUDIT-SUMMARY.md',
                reportName: 'Accessibility Report'
            ])
        }
        failure {
            emailext (
                subject: "Accessibility Audit Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """
                    Accessibility audit failed for build ${env.BUILD_NUMBER}.

                    Check the console output at ${env.BUILD_URL} for details.
                """,
                recipientProviders: [developers(), requestor()]
            )
        }
    }
}
```

### Declarative Pipeline with Unity

```groovy
pipeline {
    agent {
        docker {
            image 'gableroux/unity3d:2022.3.10f1'
            args '-v $HOME/.cache/unity3d:/root/.cache/unity3d'
        }
    }

    stages {
        stage('Setup Node.js') {
            steps {
                sh '''
                    apt-get update
                    apt-get install -y curl
                    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
                    apt-get install -y nodejs
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    cd accessibility-standards-unity
                    npm ci
                '''
            }
        }

        stage('Full Audit with Screenshots') {
            steps {
                sh '''
                    node accessibility-standards-unity/bin/audit.js . \
                        --full \
                        --capture-screenshots \
                        --analyze-visual \
                        --generate-fixes \
                        --verbose
                '''
            }
        }

        stage('Archive Results') {
            steps {
                archiveArtifacts artifacts: 'AccessibilityAudit/**/*', fingerprint: true
            }
        }
    }
}
```

---

## Azure DevOps

### Example: azure-pipelines.yml

```yaml
trigger:
  branches:
    include:
      - main
      - develop
  paths:
    include:
      - 'Assets/**'
      - 'ProjectSettings/**'

pr:
  branches:
    include:
      - main
      - develop

pool:
  vmImage: 'ubuntu-latest'

variables:
  nodeVersion: '18.x'

stages:
  - stage: Audit
    displayName: 'Accessibility Audit'
    jobs:
      - job: BasicAudit
        displayName: 'Run Accessibility Audit'
        steps:
          - checkout: self
            submodules: true

          - task: NodeTool@0
            inputs:
              versionSpec: $(nodeVersion)
            displayName: 'Install Node.js'

          - script: |
              cd accessibility-standards-unity
              npm ci
            displayName: 'Install Dependencies'

          - script: |
              node accessibility-standards-unity/bin/audit.js . \
                --full \
                --verbose \
                --output $(Build.ArtifactStagingDirectory)/AccessibilityAudit
            displayName: 'Run Accessibility Audit'
            continueOnError: true

          - task: PublishBuildArtifacts@1
            inputs:
              PathtoPublish: '$(Build.ArtifactStagingDirectory)/AccessibilityAudit'
              ArtifactName: 'accessibility-reports'
              publishLocation: 'Container'
            displayName: 'Publish Audit Reports'
            condition: always()

          - script: |
              CRITICAL=$(node -e "try { const audit = require('$(Build.ArtifactStagingDirectory)/AccessibilityAudit/accessibility-analysis.json'); console.log(audit.summary.criticalIssues); } catch(e) { console.log(0); }")
              if [ "$CRITICAL" -gt 0 ]; then
                echo "##vso[task.logissue type=error]Found $CRITICAL critical accessibility issues"
                echo "##vso[task.complete result=Failed;]"
              fi
            displayName: 'Check for Critical Issues'

      - job: AuditWithScreenshots
        displayName: 'Audit with Screenshots (Unity)'
        dependsOn: []
        condition: and(succeeded(), eq(variables['Build.Reason'], 'PullRequest'))

        steps:
          - checkout: self
            submodules: true

          - task: NodeTool@0
            inputs:
              versionSpec: $(nodeVersion)

          - task: Cache@2
            inputs:
              key: 'unity | "$(Agent.OS)" | Library'
              path: Library
            displayName: 'Cache Unity Library'

          # Note: Unity setup requires additional configuration
          # See https://github.com/game-ci/unity-builder for details

          - script: |
              cd accessibility-standards-unity
              npm ci
            displayName: 'Install Dependencies'

          - script: |
              node accessibility-standards-unity/bin/audit.js . \
                --full \
                --capture-screenshots \
                --analyze-visual \
                --generate-fixes \
                --verbose
            displayName: 'Full Accessibility Audit'

          - task: PublishBuildArtifacts@1
            inputs:
              PathtoPublish: 'AccessibilityAudit'
              ArtifactName: 'accessibility-full-audit'
            condition: always()

  - stage: Reporting
    displayName: 'Generate Reports'
    dependsOn: Audit
    condition: succeeded()
    jobs:
      - job: PDFExport
        displayName: 'Generate PDF Reports'
        steps:
          - checkout: self
            submodules: true

          - task: NodeTool@0
            inputs:
              versionSpec: $(nodeVersion)

          - task: DownloadBuildArtifacts@0
            inputs:
              buildType: 'current'
              downloadType: 'single'
              artifactName: 'accessibility-reports'
              downloadPath: '$(System.ArtifactsDirectory)'

          - script: |
              cd accessibility-standards-unity
              npm ci
            displayName: 'Install Dependencies'

          - script: |
              node accessibility-standards-unity/bin/export-pdf.js \
                $(System.ArtifactsDirectory)/accessibility-reports/VPAT-COMPREHENSIVE.md \
                --output $(Build.ArtifactStagingDirectory)/VPAT-Report.pdf
            displayName: 'Generate PDF Report'

          - task: PublishBuildArtifacts@1
            inputs:
              PathtoPublish: '$(Build.ArtifactStagingDirectory)'
              ArtifactName: 'pdf-reports'

  - stage: ComplianceTracking
    displayName: 'Compliance Tracking'
    dependsOn: Audit
    condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/main'))
    jobs:
      - job: UpdateBaseline
        displayName: 'Update Compliance Baseline'
        steps:
          - checkout: self
            submodules: true
            persistCredentials: true

          - task: NodeTool@0
            inputs:
              versionSpec: $(nodeVersion)

          - script: |
              cd accessibility-standards-unity
              npm ci
            displayName: 'Install Dependencies'

          - script: |
              node accessibility-standards-unity/bin/audit.js . --baseline
            displayName: 'Update Baseline'

          - script: |
              git config user.name "Azure Pipelines"
              git config user.email "azure@pipelines.com"
              git add compliance-history/
              git commit -m "chore: Update accessibility baseline [skip ci]"
              git push origin HEAD:$(Build.SourceBranchName)
            displayName: 'Commit Baseline'
            condition: and(succeeded(), ne(variables['Build.Reason'], 'PullRequest'))
```

### Pull Request Comments

```yaml
- task: PowerShell@2
  inputs:
    targetType: 'inline'
    script: |
      $auditFile = "$(Build.ArtifactStagingDirectory)/AccessibilityAudit/accessibility-analysis.json"
      if (Test-Path $auditFile) {
        $audit = Get-Content $auditFile | ConvertFrom-Json
        $score = $audit.complianceEstimate.score
        $critical = $audit.summary.criticalIssues

        $comment = @"
      ## Accessibility Audit Results

      **Compliance Score:** $score%
      **Critical Issues:** $critical

      [View full reports]($env:SYSTEM_TEAMFOUNDATIONCOLLECTIONURI$env:SYSTEM_TEAMPROJECT/_build/results?buildId=$env:BUILD_BUILDID&view=artifacts)
      "@

        Write-Host "##vso[task.setvariable variable=AuditComment]$comment"
      }
  displayName: 'Prepare PR Comment'

- task: GitHubComment@0
  inputs:
    gitHubConnection: 'github-connection'
    repositoryName: '$(Build.Repository.Name)'
    comment: $(AuditComment)
  condition: and(succeeded(), eq(variables['Build.Reason'], 'PullRequest'))
```

---

## Configuration Options

### Command-Line Flags

```bash
node bin/audit.js <project-path> [options]
```

| Flag | Description | CI/CD Usage |
|------|-------------|-------------|
| `--full` | Run full audit with all features | ✅ Recommended for main branch |
| `--capture-screenshots` | Capture scene screenshots | ✅ With Unity setup |
| `--analyze-visual` | Run visual contrast analysis | ✅ Requires screenshots |
| `--generate-fixes` | Generate code solutions | ✅ Helpful for developers |
| `--export-pdf` | Generate PDF reports | ✅ For stakeholders |
| `--export-csv` | Export findings to CSV | ✅ For project tracking |
| `--track-compliance` | Enable compliance tracking | ✅ Essential for CI/CD |
| `--fail-on-regression` | Fail if compliance decreases | ✅ Prevent regressions |
| `--baseline` | Create/update compliance baseline | ✅ On main branch only |
| `--verbose` | Detailed logging | ✅ For debugging |
| `--output <dir>` | Custom output directory | Optional |

### Environment Variables

```bash
# Unity License (for GameCI)
UNITY_LICENSE=<license-content>
UNITY_EMAIL=<unity-email>
UNITY_PASSWORD=<unity-password>

# Optional: Custom paths
AUDIT_OUTPUT_DIR=./reports
UNITY_EXECUTABLE=/path/to/Unity
```

### Performance Optimization

**Caching Strategies:**

```yaml
# GitHub Actions
- uses: actions/cache@v3
  with:
    path: |
      ~/.npm
      Library/
      accessibility-standards-unity/node_modules
    key: ${{ runner.os }}-${{ hashFiles('**/package-lock.json') }}

# GitLab CI
cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - accessibility-standards-unity/node_modules/
    - Library/
    - .npm/

# Azure Pipelines
- task: Cache@2
  inputs:
    key: 'npm | "$(Agent.OS)" | package-lock.json'
    path: $(npm_config_cache)
```

**Parallel Processing:**

```yaml
# Run audits on multiple Unity versions in parallel
strategy:
  matrix:
    unity: ['2021.3.31f1', '2022.3.10f1', '2023.2.0f1']
```

---

## Troubleshooting

### Common Issues

#### 1. Unity License Activation Fails

**Problem:** GameCI can't activate Unity license

**Solutions:**
- Use Personal license (free): [Activation guide](https://game.ci/docs/github/activation)
- Check secrets are correctly set
- Verify Unity version matches your project

```yaml
- name: Activate Unity License
  uses: game-ci/unity-activate@v3
  with:
    unityVersion: ${{ matrix.unity-version }}
  env:
    UNITY_LICENSE: ${{ secrets.UNITY_LICENSE }}
```

#### 2. Sharp (Image Processing) Fails

**Problem:** `sharp` library fails on Linux

**Solution:** Use official Node.js Docker image

```yaml
# GitHub Actions
- uses: actions/setup-node@v4
  with:
    node-version: '18'

# GitLab CI / Jenkins
image: node:18
```

#### 3. Out of Memory Errors

**Problem:** Large Unity projects cause OOM

**Solutions:**
- Increase heap size: `NODE_OPTIONS=--max-old-space-size=4096`
- Process scenes in batches
- Skip screenshot capture for CI (run locally)

```yaml
env:
  NODE_OPTIONS: --max-old-space-size=4096
```

#### 4. Slow Audit Times

**Problem:** Audit takes > 10 minutes

**Solutions:**
- Enable caching (Library/, node_modules/)
- Skip screenshots on every commit (weekly schedule)
- Use `--quick` mode for PRs, `--full` for main branch

```yaml
# Quick audits on PRs
- if: github.event_name == 'pull_request'
  run: node bin/audit.js . --quick

# Full audits on main
- if: github.ref == 'refs/heads/main'
  run: node bin/audit.js . --full --capture-screenshots
```

#### 5. Permission Denied Errors

**Problem:** Can't write to output directory

**Solution:** Ensure correct permissions

```yaml
- run: chmod -R 755 AccessibilityAudit
```

### Debugging

**Enable verbose logging:**

```bash
node bin/audit.js . --verbose --debug
```

**Check audit output manually:**

```bash
# View generated JSON
cat AccessibilityAudit/accessibility-analysis.json | jq '.summary'

# Check for critical issues
node -e "const audit = require('./AccessibilityAudit/accessibility-analysis.json'); console.log('Critical:', audit.summary.criticalIssues)"
```

---

## Best Practices

### 1. Progressive Integration

Start simple, add features incrementally:

1. **Week 1:** Basic audit on PRs (no screenshots)
2. **Week 2:** Add compliance tracking
3. **Week 3:** Enable screenshot capture (main branch only)
4. **Week 4:** Add PDF generation and stakeholder reports

### 2. Branch Strategy

```yaml
# PRs: Quick audit, fail on critical issues
on: pull_request
script: node bin/audit.js . --fail-on-regression

# Main: Full audit with all features
on: push (branches: main)
script: node bin/audit.js . --full --capture-screenshots --generate-fixes

# Weekly: Comprehensive report with screenshots
on: schedule (cron: '0 0 * * 0')
script: node bin/audit.js . --full --capture-screenshots --export-pdf
```

### 3. Artifact Management

```yaml
retention-days:
  - Pull Request artifacts: 30 days
  - Main branch artifacts: 90 days
  - Release artifacts: 365 days
  - Baseline/compliance: Never expire
```

### 4. Notification Strategy

- **Critical issues:** Block PR merge, notify team immediately
- **High issues:** Allow merge with warning, create JIRA tickets
- **Medium/Low:** Report only, no action required

### 5. Baseline Updates

Update compliance baseline:
- ✅ On main branch merge (after code review)
- ✅ On release tags (v*)
- ❌ NOT on PRs (would bypass regression checks)

```yaml
- if: github.ref == 'refs/heads/main'
  run: node bin/audit.js . --baseline
```

### 6. Performance Tuning

For projects with 50+ scenes:
- Capture screenshots weekly (not every commit)
- Use scene filtering: `--scenes "Scene1,Scene2"`
- Enable parallel processing: `--parallel`

---

## Example: Complete CI/CD Setup

**Minimal setup (10 minutes):**

1. Add submodule:
   ```bash
   git submodule add https://github.com/jdonnelly-zspace/accessibility-standards-unity.git
   ```

2. Copy workflow:
   ```bash
   cp accessibility-standards-unity/.github/workflows/accessibility-audit.yml .github/workflows/
   ```

3. Commit and push - done!

**Full setup with all features (30 minutes):**

1. Add all three workflows (audit, regression, publish)
2. Configure Unity license secrets
3. Set up GitHub Pages for report publishing
4. Enable compliance tracking with baseline
5. Configure JIRA/GitHub issue generation

---

## Support

For issues or questions:
- GitHub Issues: https://github.com/jdonnelly-zspace/accessibility-standards-unity/issues
- Documentation: See `/docs` directory
- Examples: See `.github/workflows/` for working examples

---

**Framework Version:** v3.1.0
**Last Updated:** October 2025
