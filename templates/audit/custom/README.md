# Custom Audit Report Templates

This directory contains customizable report templates for different audiences and use cases.

## Available Templates

### 1. executive-summary.template.md
**Audience:** Executives, stakeholders, decision makers
**Purpose:** High-level overview focusing on business impact and priorities
**Length:** 2-3 pages
**Format:** Concise with clear action items and ROI information

**Use when:**
- Presenting to management or executives
- Need quick overview of compliance status
- Focusing on business impact and priorities

### 2. technical-details.template.md
**Audience:** Developers, technical leads, QA engineers
**Purpose:** Detailed technical implementation guidance
**Length:** 10-15 pages
**Format:** Code examples, API references, testing procedures

**Use when:**
- Developers need implementation guidance
- Planning technical work and effort estimation
- Setting up automated testing and CI/CD

### 3. stakeholder-friendly.template.md
**Audience:** Non-technical stakeholders, product managers, clients
**Purpose:** Explain accessibility in plain language
**Length:** 5-7 pages
**Format:** Easy-to-understand explanations, FAQs, visual aids

**Use when:**
- Communicating with non-technical audiences
- Explaining "why accessibility matters"
- Answering common questions about accessibility

## Using Custom Templates

### Basic Usage

```bash
# Use a custom template with audit tool
node bin/audit.js <project-path> --template templates/audit/custom/executive-summary.template.md

# Generate multiple reports with different templates
node bin/audit.js <project-path> --template templates/audit/custom/executive-summary.template.md --output EXECUTIVE-SUMMARY.md
node bin/audit.js <project-path> --template templates/audit/custom/technical-details.template.md --output TECHNICAL-DETAILS.md
node bin/audit.js <project-path> --template templates/audit/custom/stakeholder-friendly.template.md --output STAKEHOLDER-REPORT.md
```

### Creating Your Own Template

1. **Copy an existing template** as a starting point:
   ```bash
   cp executive-summary.template.md my-custom-template.template.md
   ```

2. **Modify the template** using available variables (see below)

3. **Use your custom template:**
   ```bash
   node bin/audit.js <project-path> --template templates/audit/custom/my-custom-template.template.md
   ```

## Available Template Variables

Templates use Handlebars-style syntax: `{{VARIABLE_NAME}}`

### Project Information
- `{{PROJECT_NAME}}` - Project name
- `{{PROJECT_PATH}}` - Full project path
- `{{PROJECT_VERSION}}` - Project version (if available)
- `{{UNITY_VERSION}}` - Unity version
- `{{BUILD_PLATFORM}}` - Target build platform

### Audit Metadata
- `{{AUDIT_DATE}}` - Date audit was run
- `{{FRAMEWORK_VERSION}}` - accessibility-standards-unity version
- `{{ANALYSIS_DURATION}}` - Time taken for analysis

### Project Statistics
- `{{TOTAL_SCENES}}` - Number of scenes
- `{{TOTAL_SCRIPTS}}` - Number of C# scripts
- `{{TOTAL_ASSETS}}` - Total asset count
- `{{FILES_SCANNED}}` - Files analyzed
- `{{LINES_OF_CODE}}` - Lines of code analyzed

### Compliance Scores
- `{{COMPLIANCE_SCORE}}` - Overall compliance percentage (0-100)
- `{{WCAG_CRITERIA_MET}}` - Number of WCAG criteria met
- `{{WCAG_CRITERIA_FAILED}}` - Number of WCAG criteria failed

### Issue Counts
- `{{TOTAL_ISSUES}}` - Total findings
- `{{CRITICAL_ISSUES}}` - Critical severity count
- `{{HIGH_ISSUES}}` - High severity count
- `{{MEDIUM_ISSUES}}` - Medium severity count
- `{{LOW_ISSUES}}` - Low severity count

### Feature Detection
- `{{KEYBOARD_SUPPORT}}` - Boolean: keyboard support detected
- `{{SCREEN_READER_SUPPORT}}` - Boolean: screen reader support detected
- `{{KEYBOARD_PATTERNS}}` - Detected keyboard input patterns
- `{{UI_TOOLKIT_DETECTED}}` - Boolean: UI Toolkit usage
- `{{UGUI_DETECTED}}` - Boolean: UGUI usage
- `{{XR_PATTERNS_DETECTED}}` - Boolean: XR input detected

### Visual Analysis (if performed)
- `{{CONTRAST_ANALYSIS_PERFORMED}}` - Boolean: contrast analysis done
- `{{CONTRAST_ANALYSIS_COMPONENTS}}` - Components analyzed
- `{{CONTRAST_COMPLIANCE_RATE}}` - Percentage passing (0-100)
- `{{CONTRAST_CRITICAL_COUNT}}` - Critical contrast issues
- `{{CONTRAST_WARNING_COUNT}}` - Warning contrast issues
- `{{COLOR_BLIND_ANALYSIS_PERFORMED}}` - Boolean: color-blind testing done

### Conditional Sections

Use Handlebars conditionals for dynamic content:

```markdown
{{#if CRITICAL_ISSUES}}
⚠ **Critical Issues Found:** {{CRITICAL_ISSUES}}
Action required immediately!
{{else}}
✓ **No Critical Issues**
{{/if}}
```

```markdown
{{#if HIGH_COMPLIANCE}}
Excellent compliance!
{{else if MEDIUM_COMPLIANCE}}
Good progress, some improvements needed.
{{else}}
Significant improvements required.
{{/if}}
```

### Loops

Iterate over collections:

```markdown
{{#each CRITICAL_FINDINGS}}
- **{{this.title}}:** {{this.description}}
  - File: {{this.scriptPath}}
  - Line: {{this.lineNumber}}
{{/each}}
```

## Template Best Practices

### 1. Know Your Audience
- **Technical audiences:** Include code examples, API references, commands
- **Non-technical audiences:** Use plain language, analogies, visual aids
- **Executives:** Focus on business impact, ROI, risk mitigation

### 2. Structure for Scanning
- Use clear headings and subheadings
- Include table of contents for long reports
- Use bullet points and tables for easy scanning
- Highlight key information with bold/emphasis

### 3. Provide Context
- Explain what findings mean, not just what they are
- Include "why it matters" explanations
- Provide examples and use cases
- Link to additional resources

### 4. Actionable Recommendations
- Be specific about what needs to be done
- Provide priority levels and timelines
- Include effort estimates
- Give clear next steps

### 5. Visual Hierarchy
- Use markdown formatting effectively
- Create visual separation between sections
- Use tables and lists for structured data
- Include code blocks for technical details

## Example Custom Templates

### Quarterly Review Template
For tracking progress over time:
```markdown
# Quarterly Accessibility Review - Q{{QUARTER}} {{YEAR}}

## Progress Since Last Quarter
- Compliance: {{PREVIOUS_SCORE}}% → {{COMPLIANCE_SCORE}}%
- Issues Resolved: {{ISSUES_RESOLVED}}
- New Issues: {{NEW_ISSUES}}

## Trends
[Analysis of trends...]
```

### Client-Specific Template
For external reporting:
```markdown
# Accessibility Audit Report
## Prepared for: {{CLIENT_NAME}}
## Contract: {{CONTRACT_NUMBER}}

[Client-specific content...]
```

### Sprint Planning Template
For agile development:
```markdown
# Sprint {{SPRINT_NUMBER}} - Accessibility Tasks

## Critical Items (Sprint Priority)
{{#each CRITICAL_FINDINGS}}
- [ ] {{this.title}} ({{this.effort}} hours)
{{/each}}

## Backlog
[Medium/Low priority items...]
```

## Combining Reports

Generate multiple reports for different audiences:

```bash
#!/bin/bash
# generate-all-reports.sh

PROJECT_PATH=$1

# Executive summary
node bin/audit.js "$PROJECT_PATH" \
  --template templates/audit/custom/executive-summary.template.md \
  --output "AccessibilityAudit/EXECUTIVE-SUMMARY.md"

# Technical details
node bin/audit.js "$PROJECT_PATH" \
  --template templates/audit/custom/technical-details.template.md \
  --output "AccessibilityAudit/TECHNICAL-DETAILS.md"

# Stakeholder report
node bin/audit.js "$PROJECT_PATH" \
  --template templates/audit/custom/stakeholder-friendly.template.md \
  --output "AccessibilityAudit/STAKEHOLDER-REPORT.md"

# Generate PDFs
node bin/export-pdf.js "AccessibilityAudit/EXECUTIVE-SUMMARY.md"
node bin/export-pdf.js "AccessibilityAudit/STAKEHOLDER-REPORT.md"

echo "All reports generated successfully!"
```

## Template Variables Reference

For a complete list of all available template variables, see:
- `bin/audit.js` - Variable population logic
- `templates/audit/VPAT-COMPREHENSIVE.template.md` - Example usage

## Contributing

To add a new template to the framework:

1. Create your template in `templates/audit/custom/`
2. Name it `*.template.md`
3. Document its purpose and audience
4. Submit a pull request with:
   - The template file
   - Usage examples
   - Target audience description
   - Update to this README

---

**Questions?** See the main documentation or open an issue on GitHub.
