#!/usr/bin/env node

/**
 * CSV Export Script for Accessibility Audit Reports
 *
 * Exports audit findings to CSV format for import into Excel, Google Sheets, JIRA, etc.
 *
 * Usage:
 *   node bin/export-csv.js <audit-json> [options]
 *   node bin/export-csv.js AccessibilityAudit/accessibility-analysis.json --output findings.csv
 *
 * Options:
 *   --output <path>         Output CSV path (default: findings.csv)
 *   --filter-severity <s>   Filter by severity: Critical, High, Medium, Low
 *   --filter-scene <name>   Filter by scene name
 *   --filter-wcag <id>      Filter by WCAG criterion ID (e.g., 1.4.3)
 *   --include-resolved      Include resolved issues
 *   --format <type>         Format: standard, jira, github (default: standard)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createObjectCsvWriter } from 'csv-writer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse command line arguments
function parseArgs() {
    const args = process.argv.slice(2);
    const options = {
        input: null,
        output: 'findings.csv',
        filterSeverity: null,
        filterScene: null,
        filterWCAG: null,
        includeResolved: false,
        format: 'standard'
    };

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        switch (arg) {
            case '--output':
                options.output = args[++i];
                break;
            case '--filter-severity':
                options.filterSeverity = args[++i];
                break;
            case '--filter-scene':
                options.filterScene = args[++i];
                break;
            case '--filter-wcag':
                options.filterWCAG = args[++i];
                break;
            case '--include-resolved':
                options.includeResolved = true;
                break;
            case '--format':
                options.format = args[++i];
                break;
            default:
                if (!arg.startsWith('--') && !options.input) {
                    options.input = arg;
                }
        }
    }

    return options;
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

    // Extract from analysis results
    if (auditData.analysis) {
        if (auditData.analysis.findings) {
            for (const finding of auditData.analysis.findings) {
                findings.push({
                    id: finding.id || `F${findings.length + 1}`,
                    scene: finding.scene || 'Global',
                    severity: finding.severity || 'Medium',
                    wcagCriterion: finding.wcagCriterion || 'N/A',
                    category: finding.category || 'General',
                    title: finding.title || finding.description?.substring(0, 50) || 'Untitled Finding',
                    description: finding.description || '',
                    recommendation: finding.recommendation || '',
                    impact: finding.impact || '',
                    affectedUsers: finding.affectedUsers || '',
                    status: finding.status || 'Open',
                    assignedTo: finding.assignedTo || '',
                    dueDate: finding.dueDate || '',
                    scriptPath: finding.scriptPath || '',
                    lineNumber: finding.lineNumber || ''
                });
            }
        }

        // Extract keyboard accessibility issues
        if (auditData.analysis.keyboardAccessibility?.issues) {
            for (const issue of auditData.analysis.keyboardAccessibility.issues) {
                findings.push({
                    id: `KB${findings.length + 1}`,
                    scene: 'Global',
                    severity: 'High',
                    wcagCriterion: '2.1.1',
                    category: 'Keyboard Accessibility',
                    title: issue.title || 'Keyboard Accessibility Issue',
                    description: issue.description || '',
                    recommendation: issue.recommendation || '',
                    impact: 'Users who cannot use a pointing device will be unable to access functionality',
                    affectedUsers: '10-15%',
                    status: 'Open',
                    assignedTo: '',
                    dueDate: '',
                    scriptPath: issue.scriptPath || '',
                    lineNumber: ''
                });
            }
        }

        // Extract screen reader issues
        if (auditData.analysis.screenReaderSupport?.issues) {
            for (const issue of auditData.analysis.screenReaderSupport.issues) {
                findings.push({
                    id: `SR${findings.length + 1}`,
                    scene: 'Global',
                    severity: 'High',
                    wcagCriterion: '4.1.2',
                    category: 'Screen Reader Support',
                    title: issue.title || 'Screen Reader Support Issue',
                    description: issue.description || '',
                    recommendation: issue.recommendation || '',
                    impact: 'Users of assistive technologies cannot access UI elements',
                    affectedUsers: '5-10%',
                    status: 'Open',
                    assignedTo: '',
                    dueDate: '',
                    scriptPath: issue.scriptPath || '',
                    lineNumber: ''
                });
            }
        }

        // Extract contrast issues
        if (auditData.analysis.contrastAnalysis?.failingComponents) {
            for (const component of auditData.analysis.contrastAnalysis.failingComponents) {
                findings.push({
                    id: `CT${findings.length + 1}`,
                    scene: component.scene || 'Unknown',
                    severity: component.ratio < 3.0 ? 'High' : 'Medium',
                    wcagCriterion: '1.4.3',
                    category: 'Visual Contrast',
                    title: `Low contrast: ${component.name || 'Component'}`,
                    description: `Contrast ratio ${component.ratio}:1 fails WCAG requirements (minimum 4.5:1 for text, 3:1 for UI components)`,
                    recommendation: 'Increase color contrast to meet WCAG 2.2 AA requirements',
                    impact: 'Users with low vision or color blindness may have difficulty perceiving content',
                    affectedUsers: '15-20%',
                    status: 'Open',
                    assignedTo: '',
                    dueDate: '',
                    scriptPath: '',
                    lineNumber: ''
                });
            }
        }
    }

    return findings;
}

// Apply filters to findings
function applyFilters(findings, options) {
    let filtered = findings;

    if (options.filterSeverity) {
        filtered = filtered.filter(f =>
            f.severity.toLowerCase() === options.filterSeverity.toLowerCase()
        );
    }

    if (options.filterScene) {
        filtered = filtered.filter(f =>
            f.scene.toLowerCase().includes(options.filterScene.toLowerCase())
        );
    }

    if (options.filterWCAG) {
        filtered = filtered.filter(f =>
            f.wcagCriterion.includes(options.filterWCAG)
        );
    }

    if (!options.includeResolved) {
        filtered = filtered.filter(f =>
            f.status.toLowerCase() !== 'resolved' && f.status.toLowerCase() !== 'closed'
        );
    }

    return filtered;
}

// Get CSV headers based on format
function getHeaders(format) {
    const standardHeaders = [
        { id: 'id', title: 'Finding ID' },
        { id: 'scene', title: 'Scene' },
        { id: 'severity', title: 'Severity' },
        { id: 'wcagCriterion', title: 'WCAG Criterion' },
        { id: 'category', title: 'Category' },
        { id: 'title', title: 'Title' },
        { id: 'description', title: 'Description' },
        { id: 'recommendation', title: 'Recommendation' },
        { id: 'impact', title: 'Impact' },
        { id: 'affectedUsers', title: 'Affected Users' },
        { id: 'status', title: 'Status' },
        { id: 'assignedTo', title: 'Assigned To' },
        { id: 'dueDate', title: 'Due Date' },
        { id: 'scriptPath', title: 'Script Path' },
        { id: 'lineNumber', title: 'Line Number' }
    ];

    const jiraHeaders = [
        { id: 'title', title: 'Summary' },
        { id: 'description', title: 'Description' },
        { id: 'severity', title: 'Priority' },
        { id: 'category', title: 'Component' },
        { id: 'wcagCriterion', title: 'Labels' },
        { id: 'assignedTo', title: 'Assignee' },
        { id: 'status', title: 'Status' }
    ];

    const githubHeaders = [
        { id: 'title', title: 'Title' },
        { id: 'description', title: 'Body' },
        { id: 'severity', title: 'Labels' },
        { id: 'assignedTo', title: 'Assignees' }
    ];

    switch (format.toLowerCase()) {
        case 'jira':
            return jiraHeaders;
        case 'github':
            return githubHeaders;
        default:
            return standardHeaders;
    }
}

// Format finding for specific export type
function formatFinding(finding, format) {
    if (format === 'jira') {
        return {
            title: `Accessibility: ${finding.title}`,
            description: `
${finding.description}

*WCAG Criterion:* ${finding.wcagCriterion}
*Scene:* ${finding.scene}
*Impact:* ${finding.impact}
*Affected Users:* ${finding.affectedUsers}

*Recommendation:*
${finding.recommendation}

*Script Path:* ${finding.scriptPath || 'N/A'}
            `.trim(),
            severity: finding.severity,
            category: finding.category,
            wcagCriterion: `accessibility wcag-${finding.wcagCriterion.replace(/\./g, '-')} ${finding.severity.toLowerCase()}`,
            assignedTo: finding.assignedTo,
            status: finding.status
        };
    } else if (format === 'github') {
        return {
            title: `[A11Y] ${finding.title}`,
            description: `
## Description
${finding.description}

## WCAG Criterion
${finding.wcagCriterion}

## Scene
${finding.scene}

## Impact
${finding.impact}

## Affected Users
${finding.affectedUsers}

## Recommendation
${finding.recommendation}

## Technical Details
- **Script Path:** ${finding.scriptPath || 'N/A'}
- **Line Number:** ${finding.lineNumber || 'N/A'}
- **Severity:** ${finding.severity}
            `.trim(),
            severity: `accessibility,wcag-${finding.wcagCriterion.replace(/\./g, '-')},severity-${finding.severity.toLowerCase()}`,
            assignedTo: finding.assignedTo
        };
    }

    return finding;
}

// Export findings to CSV
async function exportToCSV(findings, options) {
    console.log(`Exporting ${findings.length} findings to CSV...`);

    // Get headers based on format
    const headers = getHeaders(options.format);

    // Format findings for export
    const formattedFindings = findings.map(f => formatFinding(f, options.format));

    // Ensure output directory exists
    const outputDir = path.dirname(options.output);
    if (outputDir !== '.' && !fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Create CSV writer
    const csvWriter = createObjectCsvWriter({
        path: options.output,
        header: headers
    });

    // Write CSV
    await csvWriter.writeRecords(formattedFindings);

    console.log(`✓ CSV exported successfully: ${options.output}`);

    // Statistics
    const severityCounts = {};
    for (const finding of findings) {
        severityCounts[finding.severity] = (severityCounts[finding.severity] || 0) + 1;
    }

    console.log('\nExport Summary:');
    console.log(`  Total findings: ${findings.length}`);
    for (const [severity, count] of Object.entries(severityCounts)) {
        console.log(`  ${severity}: ${count}`);
    }

    // Get file size
    const stats = fs.statSync(options.output);
    const fileSizeKB = (stats.size / 1024).toFixed(2);
    console.log(`  File size: ${fileSizeKB} KB`);
}

// Main execution
async function main() {
    const options = parseArgs();

    if (!options.input) {
        console.error('Error: No input file specified');
        console.error('');
        console.error('Usage: node bin/export-csv.js <audit-json> [options]');
        console.error('');
        console.error('Options:');
        console.error('  --output <path>         Output CSV path');
        console.error('  --filter-severity <s>   Filter by severity');
        console.error('  --filter-scene <name>   Filter by scene name');
        console.error('  --filter-wcag <id>      Filter by WCAG criterion');
        console.error('  --include-resolved      Include resolved issues');
        console.error('  --format <type>         Format: standard, jira, github');
        process.exit(1);
    }

    try {
        // Load audit data
        const auditData = loadAuditData(options.input);
        console.log(`Loaded audit data from: ${options.input}`);

        // Extract findings
        let findings = extractFindings(auditData);
        console.log(`Found ${findings.length} total findings`);

        // Apply filters
        findings = applyFilters(findings, options);
        console.log(`After filters: ${findings.length} findings`);

        if (findings.length === 0) {
            console.log('No findings match the specified filters');
            return;
        }

        // Export to CSV
        await exportToCSV(findings, options);

    } catch (error) {
        console.error(`Error: ${error.message}`);
        if (process.env.DEBUG) {
            console.error(error.stack);
        }
        process.exit(1);
    }
}

main();
