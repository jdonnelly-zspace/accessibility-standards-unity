# Export Configuration

This directory contains configuration files for exporting accessibility audit reports to various formats and platforms.

## Quick Start

1. **Copy the example configuration:**
   ```bash
   cp export-config.example.json export-config.json
   ```

2. **Edit `export-config.json`** with your credentials and preferences

3. **Add to `.gitignore`** to avoid committing sensitive tokens:
   ```bash
   echo "config/export-config.json" >> .gitignore
   ```

4. **Use with export tools:**
   ```bash
   node bin/export-pdf.js AccessibilityAudit/VPAT-COMPREHENSIVE.md --config config/export-config.json
   node bin/generate-issues.js AccessibilityAudit/accessibility-analysis.json --platform github --config config/export-config.json
   ```

## Configuration Sections

### PDF Export

Configure PDF generation settings:

```json
{
  "pdf": {
    "companyName": "Your Organization Name",
    "logo": null,
    "footerText": "Custom footer text",
    "headerText": null,
    "pageSize": "Letter",
    "orientation": "portrait",
    "includeTOC": true,
    "customCSS": null
  }
}
```

**Options:**
- `companyName`: Your organization name (appears in PDF header)
- `logo`: Path to logo image file (optional)
- `footerText`: Custom footer text
- `headerText`: Custom header text (optional)
- `pageSize`: `Letter`, `A4`, `Legal`
- `orientation`: `portrait` or `landscape`
- `includeTOC`: `true` to include table of contents
- `customCSS`: Path to custom CSS file for styling

### CSV Export

Configure CSV/Excel export format:

```json
{
  "csv": {
    "columns": ["id", "scene", "severity", "wcagCriterion", "title", "description"],
    "includeHeaders": true,
    "delimiter": ",",
    "encoding": "utf8",
    "bom": true
  }
}
```

**Options:**
- `columns`: Array of column names to include
- `includeHeaders`: Include column headers in first row
- `delimiter`: Field delimiter (`,` for CSV, `\t` for TSV)
- `encoding`: File encoding (`utf8`, `utf16le`, etc.)
- `bom`: Add UTF-8 BOM for Excel compatibility

### GitHub Integration

Configure GitHub issue creation:

```json
{
  "github": {
    "token": "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "owner": "your-github-username",
    "repo": "your-repository-name",
    "defaultAssignee": "your-github-username",
    "defaultLabels": ["accessibility", "a11y", "bug"]
  }
}
```

**Setup:**

1. **Create a Personal Access Token:**
   - Go to GitHub Settings > Developer settings > Personal access tokens
   - Click "Generate new token (classic)"
   - Select scopes: `repo` (full repository access)
   - Copy the generated token

2. **Update configuration:**
   - Replace `token` with your personal access token
   - Set `owner` to your GitHub username or organization
   - Set `repo` to your repository name
   - Optionally set `defaultAssignee` and `defaultLabels`

3. **Test:**
   ```bash
   node bin/generate-issues.js AccessibilityAudit/accessibility-analysis.json \
     --platform github \
     --config config/export-config.json \
     --dry-run
   ```

### JIRA Integration

Configure JIRA issue creation:

```json
{
  "jira": {
    "serverUrl": "https://your-company.atlassian.net",
    "email": "your-email@company.com",
    "apiToken": "ATATT3xFfGF0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "projectKey": "PROJ",
    "issueType": "Bug",
    "defaultAssignee": "jira-username"
  }
}
```

**Setup:**

1. **Create an API Token:**
   - Go to https://id.atlassian.com/manage-profile/security/api-tokens
   - Click "Create API token"
   - Give it a name (e.g., "Accessibility Audit Tool")
   - Copy the generated token

2. **Find your Project Key:**
   - Open your JIRA project
   - The key is in the URL: `https://company.atlassian.net/browse/PROJ`
   - Use "PROJ" as your `projectKey`

3. **Update configuration:**
   - Replace `serverUrl` with your JIRA instance URL
   - Set `email` to your JIRA account email
   - Replace `apiToken` with your API token
   - Set `projectKey` to your project key
   - Set `issueType` (usually "Bug" or "Task")
   - Optionally set `defaultAssignee`

4. **Test:**
   ```bash
   node bin/generate-issues.js AccessibilityAudit/accessibility-analysis.json \
     --platform jira \
     --config config/export-config.json \
     --dry-run
   ```

### Reporting

Configure default report generation settings:

```json
{
  "reporting": {
    "defaultFormats": ["markdown", "pdf"],
    "outputDirectory": "AccessibilityAudit",
    "generateTimestamps": true,
    "archiveOldReports": true,
    "archiveDirectory": "AccessibilityAudit/archive"
  }
}
```

**Options:**
- `defaultFormats`: Array of formats to generate by default
- `outputDirectory`: Where to save reports
- `generateTimestamps`: Add timestamps to report filenames
- `archiveOldReports`: Move old reports to archive directory
- `archiveDirectory`: Archive location

### Notifications (Optional)

Configure Slack or email notifications:

```json
{
  "notifications": {
    "enabled": false,
    "slack": {
      "webhookUrl": "https://hooks.slack.com/services/YOUR/WEBHOOK/URL",
      "channel": "#accessibility",
      "notifyOnCritical": true,
      "notifyOnComplete": true
    },
    "email": {
      "enabled": false,
      "smtp": {
        "host": "smtp.gmail.com",
        "port": 587,
        "secure": false,
        "auth": {
          "user": "your-email@company.com",
          "pass": "your-email-password"
        }
      },
      "recipients": ["team@company.com"],
      "subject": "Accessibility Audit Report - {{PROJECT_NAME}}"
    }
  }
}
```

**Slack Setup:**
1. Create an incoming webhook in your Slack workspace
2. Copy the webhook URL
3. Set `enabled: true` and paste the webhook URL

**Email Setup:**
1. Configure SMTP settings for your email provider
2. Use app-specific passwords for Gmail/Outlook
3. Add recipient email addresses
4. Set `enabled: true`

### Templates

Configure custom report templates:

```json
{
  "templates": {
    "default": "templates/audit/VPAT-COMPREHENSIVE.template.md",
    "custom": {
      "executive": "templates/audit/custom/executive-summary.template.md",
      "technical": "templates/audit/custom/technical-details.template.md",
      "stakeholder": "templates/audit/custom/stakeholder-friendly.template.md"
    }
  }
}
```

Specify paths to custom templates or use built-in templates.

### Thresholds

Configure compliance thresholds and failure criteria:

```json
{
  "thresholds": {
    "minComplianceScore": 80,
    "maxCriticalIssues": 0,
    "maxHighIssues": 5,
    "failOnRegression": true
  }
}
```

**Options:**
- `minComplianceScore`: Minimum acceptable compliance score (0-100)
- `maxCriticalIssues`: Maximum allowed critical issues (0 = none allowed)
- `maxHighIssues`: Maximum allowed high-priority issues
- `failOnRegression`: Fail if compliance score decreases

### CI/CD Integration

Configure continuous integration settings:

```json
{
  "ci": {
    "enabled": false,
    "failOnCritical": true,
    "failOnRegression": true,
    "compareBaseline": true,
    "baselinePath": "compliance-history/baseline.json",
    "generateArtifacts": true,
    "commentOnPR": true
  }
}
```

**Options:**
- `enabled`: Enable CI/CD mode
- `failOnCritical`: Fail build if critical issues found
- `failOnRegression`: Fail build if compliance decreases
- `compareBaseline`: Compare against baseline
- `baselinePath`: Path to baseline audit results
- `generateArtifacts`: Save reports as CI artifacts
- `commentOnPR`: Post results as PR comment (GitHub Actions)

## Security Best Practices

### DO:
- ✓ Copy `export-config.example.json` to `export-config.json`
- ✓ Add `export-config.json` to `.gitignore`
- ✓ Use environment variables for sensitive data in CI/CD
- ✓ Use API tokens with minimal required permissions
- ✓ Rotate tokens periodically
- ✓ Review permissions granted to tokens

### DON'T:
- ✗ Commit `export-config.json` with real credentials to git
- ✗ Share tokens in chat or email
- ✗ Use personal tokens for shared CI/CD pipelines
- ✗ Grant tokens more permissions than needed

## Environment Variables

You can use environment variables instead of storing credentials in the config file:

```bash
# GitHub
export GITHUB_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
export GITHUB_REPO_OWNER="your-username"
export GITHUB_REPO_NAME="your-repo"

# JIRA
export JIRA_SERVER_URL="https://your-company.atlassian.net"
export JIRA_EMAIL="your-email@company.com"
export JIRA_API_TOKEN="ATATT3xFfGF0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
export JIRA_PROJECT_KEY="PROJ"

# Use in commands
node bin/generate-issues.js AccessibilityAudit/accessibility-analysis.json \
  --platform github \
  --github-token "$GITHUB_TOKEN" \
  --github-owner "$GITHUB_REPO_OWNER" \
  --github-repo "$GITHUB_REPO_NAME"
```

## Examples

### Export VPAT to PDF with custom branding
```bash
node bin/export-pdf.js AccessibilityAudit/VPAT-COMPREHENSIVE.md \
  --config config/export-config.json \
  --output reports/VPAT-YourProduct.pdf
```

### Export findings to CSV for Excel
```bash
node bin/export-csv.js AccessibilityAudit/accessibility-analysis.json \
  --output findings.csv \
  --format standard
```

### Create GitHub issues for critical findings
```bash
node bin/generate-issues.js AccessibilityAudit/accessibility-analysis.json \
  --platform github \
  --config config/export-config.json \
  --min-severity Critical
```

### Create JIRA issues for high-priority items
```bash
node bin/generate-issues.js AccessibilityAudit/accessibility-analysis.json \
  --platform jira \
  --config config/export-config.json \
  --min-severity High
```

### Generate executive summary
```bash
node bin/audit.js path/to/unity/project \
  --template templates/audit/custom/executive-summary.template.md \
  --output EXECUTIVE-SUMMARY.md

node bin/export-pdf.js EXECUTIVE-SUMMARY.md \
  --config config/export-config.json
```

## Troubleshooting

### "Authentication failed" errors
- Verify your API token is correct and not expired
- Check token has required permissions
- Ensure token is not truncated when copying

### "Project not found" errors (JIRA)
- Verify project key is correct (case-sensitive)
- Check you have access to the project
- Ensure project exists and is not archived

### "Repository not found" errors (GitHub)
- Verify owner and repo names are correct
- Check token has `repo` scope
- Ensure repository is not private (or token has access)

### PDF generation fails
- Ensure Puppeteer installed: `npm install puppeteer`
- Check sufficient disk space
- Try running with `--no-sandbox` in CI environments

### CSV encoding issues in Excel
- Set `"bom": true` in CSV config for Excel compatibility
- Use UTF-8 encoding
- Open CSV in Excel using "Import Data" instead of double-clicking

## Support

For more information:
- **Documentation:** See docs/ directory
- **Issues:** https://github.com/jdonnelly-zspace/accessibility-standards-unity/issues
- **Examples:** See examples/ directory

---

**Note:** The `export-config.json` file contains sensitive credentials and should never be committed to version control. Always use `export-config.example.json` as a template and create your own `export-config.json` locally.
