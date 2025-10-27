#!/usr/bin/env node

/**
 * Multi-Project Comparison Script for Accessibility Audits
 *
 * Compare accessibility compliance across multiple Unity projects
 * Useful for organizations managing multiple Unity applications
 *
 * Usage:
 *   node bin/compare-projects.js project1/AccessibilityAudit project2/AccessibilityAudit [...]
 *   node bin/compare-projects.js --projects projects.json --output COMPARISON-REPORT.md
 *
 * Options:
 *   --projects <file>     JSON file listing project audit directories
 *   --output <path>       Output comparison report path (default: MULTI-PROJECT-COMPARISON.md)
 *   --format <type>       Output format: markdown, json, csv (default: markdown)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse command line arguments
function parseArgs() {
    const args = process.argv.slice(2);
    const options = {
        projectDirs: [],
        projectsFile: null,
        output: 'MULTI-PROJECT-COMPARISON.md',
        format: 'markdown'
    };

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        switch (arg) {
            case '--projects':
                options.projectsFile = args[++i];
                break;
            case '--output':
                options.output = args[++i];
                break;
            case '--format':
                options.format = args[++i];
                break;
            default:
                if (!arg.startsWith('--')) {
                    options.projectDirs.push(arg);
                }
        }
    }

    return options;
}

// Load project directories from JSON file
function loadProjectsFile(filePath) {
    if (!fs.existsSync(filePath)) {
        throw new Error(`Projects file not found: ${filePath}`);
    }

    const data = fs.readFileSync(filePath, 'utf-8');
    const projects = JSON.parse(data);

    if (!Array.isArray(projects)) {
        throw new Error('Projects file must contain an array of project definitions');
    }

    return projects.map(p => ({
        name: p.name || path.basename(p.path),
        path: p.path,
        description: p.description || ''
    }));
}

// Load audit data from project directory
function loadProjectAudit(projectDir) {
    const analysisPath = path.join(projectDir, 'accessibility-analysis.json');

    if (!fs.existsSync(analysisPath)) {
        throw new Error(`Audit file not found: ${analysisPath}`);
    }

    const data = fs.readFileSync(analysisPath, 'utf-8');
    return JSON.parse(data);
}

// Extract key metrics from audit data
function extractMetrics(auditData, projectName) {
    const metrics = {
        projectName,
        totalScenes: 0,
        totalScripts: 0,
        totalFindings: 0,
        criticalIssues: 0,
        highIssues: 0,
        mediumIssues: 0,
        lowIssues: 0,
        complianceScore: 0,
        keyboardSupport: false,
        screenReaderSupport: false,
        contrastCompliance: 0,
        wcagCriteriaCovered: 0,
        wcagCriteriaFailed: 0
    };

    if (auditData.project) {
        metrics.totalScenes = auditData.project.totalScenes || 0;
        metrics.totalScripts = auditData.project.totalScripts || 0;
    }

    if (auditData.analysis) {
        const analysis = auditData.analysis;

        // Count findings by severity
        if (analysis.findings) {
            metrics.totalFindings = analysis.findings.length;
            for (const finding of analysis.findings) {
                switch (finding.severity?.toLowerCase()) {
                    case 'critical':
                        metrics.criticalIssues++;
                        break;
                    case 'high':
                        metrics.highIssues++;
                        break;
                    case 'medium':
                        metrics.mediumIssues++;
                        break;
                    case 'low':
                        metrics.lowIssues++;
                        break;
                }
            }
        }

        // Keyboard support
        if (analysis.keyboardAccessibility) {
            metrics.keyboardSupport = analysis.keyboardAccessibility.hasSupport || false;
        }

        // Screen reader support
        if (analysis.screenReaderSupport) {
            metrics.screenReaderSupport = analysis.screenReaderSupport.hasSupport || false;
        }

        // Contrast compliance
        if (analysis.contrastAnalysis) {
            const total = analysis.contrastAnalysis.componentsAnalyzed || 0;
            const passing = analysis.contrastAnalysis.passingComponents || 0;
            metrics.contrastCompliance = total > 0 ? Math.round((passing / total) * 100) : 0;
        }

        // WCAG compliance
        if (analysis.wcagCompliance) {
            metrics.wcagCriteriaCovered = analysis.wcagCompliance.criteriaMet || 0;
            metrics.wcagCriteriaFailed = analysis.wcagCompliance.criteriaFailed || 0;
            metrics.complianceScore = analysis.wcagCompliance.complianceScore || 0;
        }
    }

    return metrics;
}

// Calculate comparison statistics
function calculateComparison(projectMetrics) {
    const comparison = {
        totalProjects: projectMetrics.length,
        averageComplianceScore: 0,
        bestProject: null,
        worstProject: null,
        totalFindings: 0,
        totalCriticalIssues: 0,
        projectsWithKeyboard: 0,
        projectsWithScreenReader: 0,
        commonIssues: [],
        recommendations: []
    };

    // Calculate averages
    let totalCompliance = 0;
    let bestScore = -1;
    let worstScore = 101;

    for (const metrics of projectMetrics) {
        totalCompliance += metrics.complianceScore;
        comparison.totalFindings += metrics.totalFindings;
        comparison.totalCriticalIssues += metrics.criticalIssues;

        if (metrics.keyboardSupport) comparison.projectsWithKeyboard++;
        if (metrics.screenReaderSupport) comparison.projectsWithScreenReader++;

        if (metrics.complianceScore > bestScore) {
            bestScore = metrics.complianceScore;
            comparison.bestProject = metrics.projectName;
        }

        if (metrics.complianceScore < worstScore) {
            worstScore = metrics.complianceScore;
            comparison.worstProject = metrics.projectName;
        }
    }

    comparison.averageComplianceScore = Math.round(totalCompliance / projectMetrics.length);

    // Identify common issues
    if (comparison.projectsWithKeyboard < projectMetrics.length) {
        comparison.commonIssues.push({
            title: 'Keyboard Accessibility Missing',
            affected: projectMetrics.length - comparison.projectsWithKeyboard,
            description: 'Projects lack keyboard navigation support'
        });
    }

    if (comparison.projectsWithScreenReader < projectMetrics.length) {
        comparison.commonIssues.push({
            title: 'Screen Reader Support Missing',
            affected: projectMetrics.length - comparison.projectsWithScreenReader,
            description: 'Projects lack screen reader API integration'
        });
    }

    if (comparison.totalCriticalIssues > 0) {
        comparison.commonIssues.push({
            title: 'Critical Accessibility Issues',
            affected: comparison.totalCriticalIssues,
            description: 'Critical issues found across projects'
        });
    }

    // Generate recommendations
    if (comparison.averageComplianceScore < 80) {
        comparison.recommendations.push({
            priority: 'High',
            title: 'Organization-wide Compliance Below Target',
            description: `Average compliance score (${comparison.averageComplianceScore}%) is below the recommended 80% threshold`,
            action: 'Implement organization-wide accessibility training and standards'
        });
    }

    if (comparison.projectsWithKeyboard < projectMetrics.length) {
        comparison.recommendations.push({
            priority: 'High',
            title: 'Implement Keyboard Navigation',
            description: `${projectMetrics.length - comparison.projectsWithKeyboard} projects lack keyboard support`,
            action: 'Create shared keyboard navigation library for reuse across projects'
        });
    }

    if (comparison.bestProject && comparison.worstProject) {
        comparison.recommendations.push({
            priority: 'Medium',
            title: 'Share Best Practices',
            description: `Learn from ${comparison.bestProject} (${bestScore}%) to improve ${comparison.worstProject} (${worstScore}%)`,
            action: 'Conduct code review and knowledge sharing session'
        });
    }

    return comparison;
}

// Generate markdown report
function generateMarkdownReport(projectMetrics, comparison) {
    let report = `# Multi-Project Accessibility Comparison Report

**Generated:** ${new Date().toLocaleDateString()}
**Projects Analyzed:** ${comparison.totalProjects}

---

## Executive Summary

`;

    // Overall statistics
    report += `### Overall Statistics

- **Average Compliance Score:** ${comparison.averageComplianceScore}%
- **Total Findings:** ${comparison.totalFindings}
- **Critical Issues:** ${comparison.totalCriticalIssues}
- **Projects with Keyboard Support:** ${comparison.projectsWithKeyboard} / ${comparison.totalProjects}
- **Projects with Screen Reader Support:** ${comparison.projectsWithScreenReader} / ${comparison.totalProjects}

`;

    // Best and worst performers
    report += `### Performance Highlights

- **Best Performing Project:** ${comparison.bestProject}
- **Needs Most Improvement:** ${comparison.worstProject}

---

`;

    // Project comparison table
    report += `## Project Comparison Matrix

| Project | Compliance | Scenes | Scripts | Findings | Critical | High | Keyboard | Screen Reader | Contrast |
|---------|------------|--------|---------|----------|----------|------|----------|---------------|----------|
`;

    for (const metrics of projectMetrics) {
        const kb = metrics.keyboardSupport ? '✓' : '✗';
        const sr = metrics.screenReaderSupport ? '✓' : '✗';
        report += `| ${metrics.projectName} | ${metrics.complianceScore}% | ${metrics.totalScenes} | ${metrics.totalScripts} | ${metrics.totalFindings} | ${metrics.criticalIssues} | ${metrics.highIssues} | ${kb} | ${sr} | ${metrics.contrastCompliance}% |\n`;
    }

    report += '\n---\n\n';

    // Common issues
    if (comparison.commonIssues.length > 0) {
        report += `## Common Issues Across Projects

`;
        for (const issue of comparison.commonIssues) {
            report += `### ${issue.title}
- **Projects Affected:** ${issue.affected}
- **Description:** ${issue.description}

`;
        }
        report += '---\n\n';
    }

    // Recommendations
    if (comparison.recommendations.length > 0) {
        report += `## Organization-Wide Recommendations

`;
        for (const rec of comparison.recommendations) {
            report += `### ${rec.title} [${rec.priority} Priority]
${rec.description}

**Recommended Action:**
${rec.action}

`;
        }
        report += '---\n\n';
    }

    // Detailed project breakdowns
    report += `## Detailed Project Breakdowns

`;

    for (const metrics of projectMetrics) {
        report += `### ${metrics.projectName}

- **Compliance Score:** ${metrics.complianceScore}%
- **Total Scenes:** ${metrics.totalScenes}
- **Total Scripts:** ${metrics.totalScripts}
- **Total Findings:** ${metrics.totalFindings}
  - Critical: ${metrics.criticalIssues}
  - High: ${metrics.highIssues}
  - Medium: ${metrics.mediumIssues}
  - Low: ${metrics.lowIssues}
- **Keyboard Support:** ${metrics.keyboardSupport ? 'Yes' : 'No'}
- **Screen Reader Support:** ${metrics.screenReaderSupport ? 'Yes' : 'No'}
- **Contrast Compliance:** ${metrics.contrastCompliance}%
- **WCAG Criteria Met:** ${metrics.wcagCriteriaCovered}
- **WCAG Criteria Failed:** ${metrics.wcagCriteriaFailed}

`;
    }

    report += `---

*Generated by accessibility-standards-unity - Multi-Project Comparison Tool*
`;

    return report;
}

// Generate JSON report
function generateJSONReport(projectMetrics, comparison) {
    return JSON.stringify({
        generatedDate: new Date().toISOString(),
        summary: comparison,
        projects: projectMetrics
    }, null, 2);
}

// Generate CSV report
function generateCSVReport(projectMetrics) {
    let csv = 'Project,Compliance Score,Scenes,Scripts,Findings,Critical,High,Medium,Low,Keyboard,Screen Reader,Contrast Compliance\n';

    for (const metrics of projectMetrics) {
        csv += `"${metrics.projectName}",`;
        csv += `${metrics.complianceScore},`;
        csv += `${metrics.totalScenes},`;
        csv += `${metrics.totalScripts},`;
        csv += `${metrics.totalFindings},`;
        csv += `${metrics.criticalIssues},`;
        csv += `${metrics.highIssues},`;
        csv += `${metrics.mediumIssues},`;
        csv += `${metrics.lowIssues},`;
        csv += `${metrics.keyboardSupport ? 'Yes' : 'No'},`;
        csv += `${metrics.screenReaderSupport ? 'Yes' : 'No'},`;
        csv += `${metrics.contrastCompliance}%\n`;
    }

    return csv;
}

// Main execution
async function main() {
    const options = parseArgs();

    // Load project directories
    let projects = [];

    if (options.projectsFile) {
        console.log(`Loading projects from: ${options.projectsFile}`);
        projects = loadProjectsFile(options.projectsFile);
    } else if (options.projectDirs.length > 0) {
        projects = options.projectDirs.map(dir => ({
            name: path.basename(path.dirname(dir)),
            path: dir,
            description: ''
        }));
    } else {
        console.error('Error: No projects specified');
        console.error('');
        console.error('Usage: node bin/compare-projects.js <project-dir1> <project-dir2> [...]');
        console.error('   or: node bin/compare-projects.js --projects projects.json');
        console.error('');
        console.error('Options:');
        console.error('  --projects <file>     JSON file listing project audit directories');
        console.error('  --output <path>       Output comparison report path');
        console.error('  --format <type>       Output format: markdown, json, csv');
        process.exit(1);
    }

    if (projects.length < 2) {
        console.error('Error: At least 2 projects required for comparison');
        process.exit(1);
    }

    console.log(`Comparing ${projects.length} projects...`);

    try {
        // Load audit data for each project
        const projectMetrics = [];

        for (const project of projects) {
            console.log(`  Loading: ${project.name}`);
            const auditData = loadProjectAudit(project.path);
            const metrics = extractMetrics(auditData, project.name);
            projectMetrics.push(metrics);
        }

        // Calculate comparison
        console.log('Calculating comparison statistics...');
        const comparison = calculateComparison(projectMetrics);

        // Generate report
        console.log(`Generating ${options.format} report...`);
        let reportContent;

        switch (options.format.toLowerCase()) {
            case 'json':
                reportContent = generateJSONReport(projectMetrics, comparison);
                if (!options.output.endsWith('.json')) {
                    options.output = options.output.replace(/\.[^.]+$/, '') + '.json';
                }
                break;
            case 'csv':
                reportContent = generateCSVReport(projectMetrics);
                if (!options.output.endsWith('.csv')) {
                    options.output = options.output.replace(/\.[^.]+$/, '') + '.csv';
                }
                break;
            default:
                reportContent = generateMarkdownReport(projectMetrics, comparison);
                if (!options.output.endsWith('.md')) {
                    options.output = options.output.replace(/\.[^.]+$/, '') + '.md';
                }
        }

        // Write report
        fs.writeFileSync(options.output, reportContent);
        console.log(`✓ Comparison report generated: ${options.output}`);

        // Summary
        console.log('\n' + '='.repeat(60));
        console.log('Comparison Summary:');
        console.log('='.repeat(60));
        console.log(`  Projects: ${comparison.totalProjects}`);
        console.log(`  Average Compliance: ${comparison.averageComplianceScore}%`);
        console.log(`  Best: ${comparison.bestProject}`);
        console.log(`  Needs Improvement: ${comparison.worstProject}`);
        console.log(`  Total Findings: ${comparison.totalFindings}`);
        console.log(`  Critical Issues: ${comparison.totalCriticalIssues}`);
        console.log('='.repeat(60));

    } catch (error) {
        console.error(`Error: ${error.message}`);
        if (process.env.DEBUG) {
            console.error(error.stack);
        }
        process.exit(1);
    }
}

main();
