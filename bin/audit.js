#!/usr/bin/env node

/**
 * zSpace Unity Accessibility Auditor
 *
 * Main orchestrator for accessibility audits. Analyzes Unity projects
 * and generates comprehensive accessibility audit reports.
 *
 * Usage:
 *   node bin/audit.js <unity-project-path> [options]
 *
 * Options:
 *   --output-dir <dir>   Output directory for audit reports (default: <project>/AccessibilityAudit)
 *   --format <format>    Output format: markdown (default), json, both
 *   --verbose            Enable verbose logging
 *
 * Output:
 *   AccessibilityAudit/
 *   ├── README.md
 *   ├── AUDIT-SUMMARY.md
 *   ├── VPAT-apps-<name>.md
 *   └── ACCESSIBILITY-RECOMMENDATIONS.md
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { UnityProjectAnalyzer } from './analyze-unity-project.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// CONFIGURATION
// ============================================================================

const VERSION = '3.0.0';
const FRAMEWORK_NAME = 'accessibility-standards-unity';

// ============================================================================
// AUDIT ORCHESTRATOR CLASS
// ============================================================================

class AccessibilityAuditor {
  constructor(projectPath, options = {}) {
    this.projectPath = path.resolve(projectPath);
    this.options = {
      outputDir: options.outputDir || path.join(this.projectPath, 'AccessibilityAudit'),
      format: options.format || 'markdown',
      verbose: options.verbose || false
    };
    this.analysisReport = null;
    this.appName = path.basename(this.projectPath);
  }

  /**
   * Main audit workflow
   */
  async run() {
    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log('║  zSpace Unity Accessibility Auditor                      ║');
    console.log(`║  Version ${VERSION}                                          ║`);
    console.log('╚═══════════════════════════════════════════════════════════╝\n');

    this.log(`Auditing: ${this.appName}`);
    this.log(`Project: ${this.projectPath}`);
    this.log(`Output: ${this.options.outputDir}\n`);

    try {
      // Step 1: Analyze Unity project
      await this.analyzeProject();

      // Step 2: Create output directory
      await this.createOutputDirectory();

      // Step 3: Generate reports (templates will be added in Phase 1B)
      await this.generateReports();

      // Step 4: Display summary
      this.displaySummary();

      console.log('\n✅ Audit complete!');
      console.log(`📁 Reports saved to: ${this.options.outputDir}\n`);

    } catch (error) {
      console.error('\n❌ Audit failed:', error.message);
      if (this.options.verbose) {
        console.error(error.stack);
      }
      process.exit(1);
    }
  }

  /**
   * Step 1: Analyze Unity project
   */
  async analyzeProject() {
    console.log('📊 Step 1: Analyzing Unity project...\n');

    const analyzer = new UnityProjectAnalyzer(this.projectPath);
    this.analysisReport = await analyzer.analyze();

    this.log(`\n✅ Analysis complete`);
    this.log(`   Scenes: ${this.analysisReport.summary.totalScenes}`);
    this.log(`   Scripts: ${this.analysisReport.summary.totalScripts}`);
    this.log(`   Findings: ${this.analysisReport.summary.totalFindings}\n`);
  }

  /**
   * Step 2: Create output directory
   */
  async createOutputDirectory() {
    this.log('📁 Step 2: Creating output directory...');

    if (!fs.existsSync(this.options.outputDir)) {
      fs.mkdirSync(this.options.outputDir, { recursive: true });
      this.log(`   Created: ${this.options.outputDir}\n`);
    } else {
      this.log(`   Directory exists: ${this.options.outputDir}\n`);
    }
  }

  /**
   * Template engine - substitutes variables in markdown templates
   */
  processTemplate(templateContent, variables) {
    let output = templateContent;

    // Simple variable substitution: {{VARIABLE_NAME}}
    Object.keys(variables).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      output = output.replace(regex, variables[key]);
    });

    // Conditional sections: {{#if VARIABLE}}content{{/if}}
    output = output.replace(/{{#if\s+(\w+)}}([\s\S]*?){{\/if}}/g, (match, varName, content) => {
      return variables[varName] ? content : '';
    });

    // Loop sections: {{#each ARRAY}}content{{/each}}
    output = output.replace(/{{#each\s+(\w+)}}([\s\S]*?){{\/each}}/g, (match, arrayName, itemTemplate) => {
      const array = variables[arrayName];
      if (!Array.isArray(array)) return '';

      return array.map((item, index) => {
        let itemOutput = itemTemplate;
        // Substitute item properties
        Object.keys(item).forEach(key => {
          const itemRegex = new RegExp(`{{${key}}}`, 'g');
          itemOutput = itemOutput.replace(itemRegex, item[key] || '');
        });
        // Substitute loop metadata
        itemOutput = itemOutput.replace(/{{@index}}/g, index + 1);
        return itemOutput;
      }).join('');
    });

    return output;
  }

  /**
   * Prepare template variables from analysis report
   */
  prepareTemplateVariables() {
    const report = this.analysisReport;

    return {
      APP_NAME: this.appName,
      PROJECT_PATH: this.projectPath,
      AUDIT_DATE: report.metadata.scannedDate,
      FRAMEWORK_VERSION: report.metadata.version,
      TOTAL_SCENES: report.summary.totalScenes,
      TOTAL_SCRIPTS: report.summary.totalScripts,
      COMPLIANCE_SCORE: report.complianceEstimate.score,
      COMPLIANCE_LEVEL: report.complianceEstimate.level,
      CRITICAL_COUNT: report.summary.criticalIssues,
      HIGH_COUNT: report.summary.highPriorityIssues,
      MEDIUM_COUNT: report.summary.mediumPriorityIssues,
      LOW_COUNT: report.summary.lowPriorityIssues,
      TOTAL_FINDINGS: report.summary.totalFindings,
      WCAG_LEVEL_A_PASS: report.complianceEstimate.wcagLevelA,
      WCAG_LEVEL_AA_PASS: report.complianceEstimate.wcagLevelAA,
      WCAG_LEVEL_A_STATUS: report.complianceEstimate.wcagLevelA ? '✅ Pass' : '❌ Fail',
      WCAG_LEVEL_AA_STATUS: report.complianceEstimate.wcagLevelAA ? '✅ Pass' : '❌ Fail',
      KEYBOARD_SUPPORT_STATUS: report.statistics.keyboardSupportFound ? '✅ Partial' : '❌ None',
      SCREEN_READER_SUPPORT_STATUS: report.statistics.screenReaderSupportFound ? '✅ Found' : '❌ None',
      FOCUS_INDICATORS_STATUS: report.statistics.focusIndicatorsFound ? '✅ Partial' : '❌ None',
      LEGAL_RISK_LEVEL: report.complianceEstimate.wcagLevelA ? 'LOW' : 'HIGH',
      CRITICAL_ISSUES: report.findings.critical,
      HIGH_ISSUES: report.findings.high,
      MEDIUM_ISSUES: report.findings.medium,
      LOW_ISSUES: report.findings.low,
      KEYBOARD_SUPPORT_FOUND: report.statistics.keyboardSupportFound,
      SCREEN_READER_SUPPORT_FOUND: report.statistics.screenReaderSupportFound,
      FOCUS_INDICATORS_FOUND: report.statistics.focusIndicatorsFound,
      ACCESSIBILITY_COMPONENTS_FOUND: report.statistics.accessibilityComponentsFound,
      STYLUS_ONLY_SCRIPTS_COUNT: report.statistics.stylusOnlyScripts ? report.statistics.stylusOnlyScripts.length : 0
    };
  }

  /**
   * Step 3: Generate audit reports
   */
  async generateReports() {
    console.log('📝 Step 3: Generating audit reports...\n');

    // Always save JSON analysis report
    const jsonPath = path.join(this.options.outputDir, 'accessibility-analysis.json');
    fs.writeFileSync(jsonPath, JSON.stringify(this.analysisReport, null, 2));
    this.log(`   ✅ Generated: accessibility-analysis.json`);

    // Generate markdown reports from templates
    const templatesDir = path.join(__dirname, '../templates/audit');

    if (fs.existsSync(templatesDir)) {
      const variables = this.prepareTemplateVariables();

      // Generate each report from template
      const templates = [
        { name: 'README.template.md', output: 'README.md' },
        { name: 'AUDIT-SUMMARY.template.md', output: 'AUDIT-SUMMARY.md' },
        { name: 'VPAT.template.md', output: `VPAT-${this.appName}.md` },
        { name: 'RECOMMENDATIONS.template.md', output: 'ACCESSIBILITY-RECOMMENDATIONS.md' }
      ];

      templates.forEach(({ name, output }) => {
        const templatePath = path.join(templatesDir, name);

        if (fs.existsSync(templatePath)) {
          const templateContent = fs.readFileSync(templatePath, 'utf-8');
          const renderedContent = this.processTemplate(templateContent, variables);
          const outputPath = path.join(this.options.outputDir, output);
          fs.writeFileSync(outputPath, renderedContent);
          this.log(`   ✅ Generated: ${output}`);
        } else {
          this.log(`   ⚠️  Template not found: ${name}`);
        }
      });
    } else {
      this.log('   ⚠️  Templates directory not found (Phase 1B in progress)');
    }

    console.log();
  }

  /**
   * Step 4: Display summary
   */
  displaySummary() {
    const report = this.analysisReport;

    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║  AUDIT SUMMARY                                           ║');
    console.log('╚═══════════════════════════════════════════════════════════╝\n');

    console.log(`Application: ${this.appName}`);
    console.log(`Date: ${report.metadata.scannedDate}`);
    console.log(`Compliance Score: ${report.complianceEstimate.score}% (${report.complianceEstimate.level})\n`);

    console.log('Findings:');
    console.log(`  🔴 Critical Issues:      ${report.summary.criticalIssues}`);
    console.log(`  🟠 High Priority Issues: ${report.summary.highPriorityIssues}`);
    console.log(`  🟡 Medium Priority:      ${report.summary.mediumPriorityIssues}`);
    console.log(`  🟢 Low Priority:         ${report.summary.lowPriorityIssues}`);

    console.log('\nWCAG 2.2 Compliance:');
    console.log(`  Level A:  ${report.complianceEstimate.wcagLevelA ? '✅ Pass' : '❌ Fail'}`);
    console.log(`  Level AA: ${report.complianceEstimate.wcagLevelAA ? '✅ Pass' : '❌ Fail'}`);

    if (report.summary.criticalIssues > 0) {
      console.log('\n⚠️  Critical Issues Found:');
      report.findings.critical.forEach((finding, index) => {
        console.log(`  ${index + 1}. ${finding.title} (${finding.id})`);
      });
    }
  }

  /**
   * Verbose logging
   */
  log(message) {
    if (this.options.verbose || message.startsWith('✅') || message.startsWith('❌')) {
      console.log(message);
    }
  }
}

// ============================================================================
// CLI INTERFACE
// ============================================================================

function parseArgs() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
zSpace Unity Accessibility Auditor v${VERSION}

Usage:
  node bin/audit.js <unity-project-path> [options]

Arguments:
  <unity-project-path>    Path to Unity project root directory

Options:
  --output-dir <dir>      Output directory for reports (default: <project>/AccessibilityAudit)
  --format <format>       Output format: markdown, json, both (default: markdown)
  --verbose               Enable verbose logging
  --help, -h              Show this help message

Examples:
  # Audit a Unity project
  node bin/audit.js /path/to/unity-project

  # Audit with custom output directory
  node bin/audit.js /path/to/unity-project --output-dir ./reports

  # Verbose mode
  node bin/audit.js /path/to/unity-project --verbose

Output:
  AccessibilityAudit/
  ├── README.md                              (Overview and quick start)
  ├── AUDIT-SUMMARY.md                       (Executive summary)
  ├── VPAT-apps-<name>.md                    (VPAT 2.5 compliance report)
  └── ACCESSIBILITY-RECOMMENDATIONS.md       (Developer guide)
    `);
    process.exit(0);
  }

  const options = {
    projectPath: null,
    outputDir: null,
    format: 'markdown',
    verbose: false
  };

  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--output-dir' && args[i + 1]) {
      options.outputDir = args[i + 1];
      i++;
    } else if (arg === '--format' && args[i + 1]) {
      options.format = args[i + 1];
      i++;
    } else if (arg === '--verbose') {
      options.verbose = true;
    } else if (!arg.startsWith('--')) {
      options.projectPath = arg;
    }
  }

  if (!options.projectPath) {
    console.error('Error: Unity project path is required');
    console.error('Run with --help for usage information');
    process.exit(1);
  }

  return options;
}

async function main() {
  const options = parseArgs();

  const auditor = new AccessibilityAuditor(options.projectPath, {
    outputDir: options.outputDir,
    format: options.format,
    verbose: options.verbose
  });

  await auditor.run();
}

// Run if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}

export { AccessibilityAuditor };
