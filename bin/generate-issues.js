#!/usr/bin/env node

/**
 * Issue Generation Script for Accessibility Audit Reports
 *
 * Automatically creates JIRA or GitHub issues from audit findings
 *
 * Usage:
 *   node bin/generate-issues.js <audit-json> --platform github --config config/export-config.json
 *   node bin/generate-issues.js <audit-json> --platform jira --config config/export-config.json
 *
 * Options:
 *   --platform <type>       Platform: github or jira (required)
 *   --config <path>         Export configuration file (required)
 *   --filter-severity <s>   Only create issues for severity: Critical, High, Medium, Low
 *   --min-severity <s>      Minimum severity (Critical, High, Medium, Low)
 *   --dry-run               Show what would be created without creating issues
 *   --skip-duplicates       Skip creating duplicate issues (checks by title)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Octokit } from '@octokit/rest';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Severity ordering for filtering
const SEVERITY_ORDER = {
    'Critical': 4,
    'High': 3,
    'Medium': 2,
    'Low': 1
};

// Parse command line arguments
function parseArgs() {
    const args = process.argv.slice(2);
    const options = {
        input: null,
        platform: null,
        config: null,
        filterSeverity: null,
        minSeverity: null,
        dryRun: false,
        skipDuplicates: true
    };

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        switch (arg) {
            case '--platform':
                options.platform = args[++i];
                break;
            case '--config':
                options.config = args[++i];
                break;
            case '--filter-severity':
                options.filterSeverity = args[++i];
                break;
            case '--min-severity':
                options.minSeverity = args[++i];
                break;
            case '--dry-run':
                options.dryRun = true;
                break;
            case '--skip-duplicates':
                options.skipDuplicates = true;
                break;
            default:
                if (!arg.startsWith('--') && !options.input) {
                    options.input = arg;
                }
        }
    }

    return options;
}

// Load configuration
function loadConfig(configPath) {
    if (!fs.existsSync(configPath)) {
        throw new Error(`Configuration file not found: ${configPath}`);
    }

    const data = fs.readFileSync(configPath, 'utf-8');
    return JSON.parse(data);
}

// Load audit data
function loadAuditData(inputPath) {
    if (!fs.existsSync(inputPath)) {
        throw new Error(`Audit file not found: ${inputPath}`);
    }

    const data = fs.readFileSync(inputPath, 'utf-8');
    return JSON.parse(data);
}

// Extract findings from audit data
function extractFindings(auditData) {
    const findings = [];

    if (auditData.analysis?.findings) {
        findings.push(...auditData.analysis.findings);
    }

    if (auditData.analysis?.keyboardAccessibility?.issues) {
        for (const issue of auditData.analysis.keyboardAccessibility.issues) {
            findings.push({
                id: `KB${findings.length + 1}`,
                severity: 'High',
                wcagCriterion: '2.1.1',
                category: 'Keyboard Accessibility',
                title: issue.title || 'Keyboard Accessibility Issue',
                description: issue.description || '',
                recommendation: issue.recommendation || '',
                impact: 'Users who cannot use a pointing device will be unable to access functionality',
                scene: 'Global',
                scriptPath: issue.scriptPath || ''
            });
        }
    }

    if (auditData.analysis?.screenReaderSupport?.issues) {
        for (const issue of auditData.analysis.screenReaderSupport.issues) {
            findings.push({
                id: `SR${findings.length + 1}`,
                severity: 'High',
                wcagCriterion: '4.1.2',
                category: 'Screen Reader Support',
                title: issue.title || 'Screen Reader Support Issue',
                description: issue.description || '',
                recommendation: issue.recommendation || '',
                impact: 'Users of assistive technologies cannot access UI elements',
                scene: 'Global',
                scriptPath: issue.scriptPath || ''
            });
        }
    }

    return findings;
}

// Filter findings by severity
function filterFindings(findings, options) {
    let filtered = findings;

    if (options.filterSeverity) {
        filtered = filtered.filter(f =>
            f.severity?.toLowerCase() === options.filterSeverity.toLowerCase()
        );
    }

    if (options.minSeverity) {
        const minLevel = SEVERITY_ORDER[options.minSeverity];
        filtered = filtered.filter(f =>
            SEVERITY_ORDER[f.severity] >= minLevel
        );
    }

    return filtered;
}

// GitHub Issue Creation
class GitHubIssueCreator {
    constructor(config) {
        if (!config.github) {
            throw new Error('GitHub configuration not found in config file');
        }

        const gh = config.github;
        if (!gh.token) {
            throw new Error('GitHub token not configured');
        }
        if (!gh.owner || !gh.repo) {
            throw new Error('GitHub owner and repo must be configured');
        }

        this.octokit = new Octokit({ auth: gh.token });
        this.owner = gh.owner;
        this.repo = gh.repo;
        this.defaultAssignee = gh.defaultAssignee || null;
        this.defaultLabels = gh.defaultLabels || ['accessibility'];
    }

    async getExistingIssues() {
        try {
            const { data } = await this.octokit.issues.listForRepo({
                owner: this.owner,
                repo: this.repo,
                state: 'all',
                labels: 'accessibility'
            });
            return data;
        } catch (error) {
            console.warn('Warning: Could not fetch existing issues:', error.message);
            return [];
        }
    }

    async createIssue(finding, dryRun = false) {
        const title = `[A11Y] ${finding.title}`;

        const body = `
## Description
${finding.description}

## WCAG Criterion
**${finding.wcagCriterion}** - ${this.getWCAGLink(finding.wcagCriterion)}

## Scene
${finding.scene || 'Global'}

## Impact
${finding.impact}

## Recommendation
${finding.recommendation}

## Technical Details
- **Severity:** ${finding.severity}
- **Category:** ${finding.category}
- **Script Path:** ${finding.scriptPath || 'N/A'}

---
*Generated by accessibility-standards-unity audit tool*
        `.trim();

        const labels = [
            ...this.defaultLabels,
            `wcag-${finding.wcagCriterion.replace(/\./g, '-')}`,
            `severity-${finding.severity.toLowerCase()}`
        ];

        const issueData = {
            owner: this.owner,
            repo: this.repo,
            title,
            body,
            labels
        };

        if (this.defaultAssignee) {
            issueData.assignees = [this.defaultAssignee];
        }

        if (dryRun) {
            console.log(`  [DRY RUN] Would create: ${title}`);
            return { dryRun: true, title };
        }

        try {
            const { data } = await this.octokit.issues.create(issueData);
            return data;
        } catch (error) {
            throw new Error(`Failed to create GitHub issue: ${error.message}`);
        }
    }

    getWCAGLink(criterion) {
        const baseURL = 'https://www.w3.org/WAI/WCAG22/Understanding';
        const path = criterion.replace(/\./g, '-');
        return `${baseURL}/${path}.html`;
    }

    isDuplicate(finding, existingIssues) {
        const searchTitle = `[A11Y] ${finding.title}`.toLowerCase();
        return existingIssues.some(issue =>
            issue.title.toLowerCase().includes(searchTitle) ||
            searchTitle.includes(issue.title.toLowerCase())
        );
    }
}

// JIRA Issue Creation
class JiraIssueCreator {
    constructor(config) {
        if (!config.jira) {
            throw new Error('JIRA configuration not found in config file');
        }

        const jira = config.jira;
        if (!jira.serverUrl || !jira.email || !jira.apiToken) {
            throw new Error('JIRA serverUrl, email, and apiToken must be configured');
        }
        if (!jira.projectKey) {
            throw new Error('JIRA projectKey must be configured');
        }

        this.serverUrl = jira.serverUrl.replace(/\/$/, '');
        this.email = jira.email;
        this.apiToken = jira.apiToken;
        this.projectKey = jira.projectKey;
        this.issueType = jira.issueType || 'Bug';
        this.defaultAssignee = jira.defaultAssignee || null;
    }

    async getExistingIssues() {
        try {
            const auth = Buffer.from(`${this.email}:${this.apiToken}`).toString('base64');
            const response = await axios({
                method: 'get',
                url: `${this.serverUrl}/rest/api/2/search`,
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/json'
                },
                params: {
                    jql: `project = ${this.projectKey} AND labels = accessibility`,
                    fields: 'summary,status'
                }
            });
            return response.data.issues || [];
        } catch (error) {
            console.warn('Warning: Could not fetch existing JIRA issues:', error.message);
            return [];
        }
    }

    async createIssue(finding, dryRun = false) {
        const summary = `Accessibility: ${finding.title}`;

        const description = `
*Description:*
${finding.description}

*WCAG Criterion:* ${finding.wcagCriterion} - ${this.getWCAGLink(finding.wcagCriterion)}

*Scene:* ${finding.scene || 'Global'}

*Impact:*
${finding.impact}

*Recommendation:*
${finding.recommendation}

*Technical Details:*
* Severity: ${finding.severity}
* Category: ${finding.category}
* Script Path: ${finding.scriptPath || 'N/A'}

---
_Generated by accessibility-standards-unity audit tool_
        `.trim();

        const priority = this.mapSeverityToPriority(finding.severity);

        const labels = [
            'accessibility',
            `wcag-${finding.wcagCriterion.replace(/\./g, '-')}`,
            finding.severity.toLowerCase()
        ];

        const issueData = {
            fields: {
                project: { key: this.projectKey },
                summary,
                description,
                issuetype: { name: this.issueType },
                priority: { name: priority },
                labels
            }
        };

        if (this.defaultAssignee) {
            issueData.fields.assignee = { name: this.defaultAssignee };
        }

        if (dryRun) {
            console.log(`  [DRY RUN] Would create: ${summary}`);
            return { dryRun: true, summary };
        }

        try {
            const auth = Buffer.from(`${this.email}:${this.apiToken}`).toString('base64');
            const response = await axios({
                method: 'post',
                url: `${this.serverUrl}/rest/api/2/issue`,
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/json'
                },
                data: issueData
            });
            return response.data;
        } catch (error) {
            const msg = error.response?.data?.errors
                ? JSON.stringify(error.response.data.errors)
                : error.message;
            throw new Error(`Failed to create JIRA issue: ${msg}`);
        }
    }

    mapSeverityToPriority(severity) {
        const mapping = {
            'Critical': 'Highest',
            'High': 'High',
            'Medium': 'Medium',
            'Low': 'Low'
        };
        return mapping[severity] || 'Medium';
    }

    getWCAGLink(criterion) {
        const baseURL = 'https://www.w3.org/WAI/WCAG22/Understanding';
        const path = criterion.replace(/\./g, '-');
        return `${baseURL}/${path}.html`;
    }

    isDuplicate(finding, existingIssues) {
        const searchTitle = `Accessibility: ${finding.title}`.toLowerCase();
        return existingIssues.some(issue =>
            issue.fields.summary.toLowerCase().includes(searchTitle) ||
            searchTitle.includes(issue.fields.summary.toLowerCase())
        );
    }
}

// Main execution
async function main() {
    const options = parseArgs();

    if (!options.input || !options.platform || !options.config) {
        console.error('Error: Missing required arguments');
        console.error('');
        console.error('Usage: node bin/generate-issues.js <audit-json> --platform <github|jira> --config <path>');
        console.error('');
        console.error('Options:');
        console.error('  --platform <type>       Platform: github or jira (required)');
        console.error('  --config <path>         Export configuration file (required)');
        console.error('  --filter-severity <s>   Only create issues for severity');
        console.error('  --min-severity <s>      Minimum severity');
        console.error('  --dry-run               Show what would be created');
        console.error('  --skip-duplicates       Skip creating duplicate issues');
        process.exit(1);
    }

    try {
        // Load configuration
        const config = loadConfig(options.config);
        console.log(`Loaded configuration from: ${options.config}`);

        // Load audit data
        const auditData = loadAuditData(options.input);
        console.log(`Loaded audit data from: ${options.input}`);

        // Extract findings
        let findings = extractFindings(auditData);
        console.log(`Found ${findings.length} total findings`);

        // Filter findings
        findings = filterFindings(findings, options);
        console.log(`After filters: ${findings.length} findings to process`);

        if (findings.length === 0) {
            console.log('No findings match the specified filters');
            return;
        }

        // Create issue creator
        let creator;
        if (options.platform.toLowerCase() === 'github') {
            creator = new GitHubIssueCreator(config);
        } else if (options.platform.toLowerCase() === 'jira') {
            creator = new JiraIssueCreator(config);
        } else {
            throw new Error(`Unknown platform: ${options.platform}`);
        }

        // Get existing issues if checking for duplicates
        let existingIssues = [];
        if (options.skipDuplicates) {
            console.log('Fetching existing issues...');
            existingIssues = await creator.getExistingIssues();
            console.log(`Found ${existingIssues.length} existing issues`);
        }

        // Create issues
        console.log(`\nCreating issues on ${options.platform}...`);
        if (options.dryRun) {
            console.log('[DRY RUN MODE - No issues will be created]\n');
        }

        const results = {
            created: 0,
            skipped: 0,
            failed: 0,
            errors: []
        };

        for (const finding of findings) {
            try {
                // Check for duplicates
                if (options.skipDuplicates && creator.isDuplicate(finding, existingIssues)) {
                    console.log(`  ⊘ Skipped (duplicate): ${finding.title}`);
                    results.skipped++;
                    continue;
                }

                // Create issue
                const issue = await creator.createIssue(finding, options.dryRun);

                if (!options.dryRun) {
                    const issueUrl = options.platform === 'github'
                        ? issue.html_url
                        : `${creator.serverUrl}/browse/${issue.key}`;
                    console.log(`  ✓ Created: ${finding.title}`);
                    console.log(`    ${issueUrl}`);
                }

                results.created++;

                // Rate limiting
                await new Promise(resolve => setTimeout(resolve, 1000));

            } catch (error) {
                console.error(`  ✗ Failed: ${finding.title}`);
                console.error(`    ${error.message}`);
                results.failed++;
                results.errors.push({
                    finding: finding.title,
                    error: error.message
                });
            }
        }

        // Summary
        console.log('\n' + '='.repeat(60));
        console.log('Issue Generation Summary:');
        console.log('='.repeat(60));
        console.log(`  Created: ${results.created}`);
        console.log(`  Skipped: ${results.skipped}`);
        console.log(`  Failed: ${results.failed}`);
        console.log('='.repeat(60));

        if (results.errors.length > 0) {
            console.log('\nErrors:');
            for (const err of results.errors) {
                console.log(`  - ${err.finding}: ${err.error}`);
            }
        }

        // Save results log
        const logPath = path.join(path.dirname(options.input), 'issues-created.json');
        fs.writeFileSync(logPath, JSON.stringify(results, null, 2));
        console.log(`\nResults saved to: ${logPath}`);

    } catch (error) {
        console.error(`Error: ${error.message}`);
        if (process.env.DEBUG) {
            console.error(error.stack);
        }
        process.exit(1);
    }
}

main();
