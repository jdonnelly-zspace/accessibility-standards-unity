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
 *   --stakeholder-docs   Generate stakeholder communication templates (Quick Reference, Public Statement, FAQ)
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
import { spawn } from 'child_process';
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

      // Step 3: Run Quick Wins automation (if enabled)
      if (this.options.runQuickWins) {
        await this.runQuickWinsAutomation();
      }

      // Step 3.5: Run Visual Analysis (if enabled)
      if (this.options.captureScreenshots) {
        await this.runVisualAnalysis();
      }

      // Step 4: Generate reports
      await this.generateReports();

      // Step 4.5: Generate stakeholder documentation (if requested)
      if (this.options.generateStakeholderDocs) {
        await this.generateStakeholderDocumentation();
      }

      // Step 5: Display summary
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
   * Step 2.5: Run Quick Wins Automation (Python scripts)
   */
  async runQuickWinsAutomation() {
    console.log('🤖 Step 2.5: Running Quick Wins Automation...\n');

    const automationDir = path.join(__dirname, '../automation');
    const runQuickWinsScript = path.join(automationDir, 'run_quick_wins.py');

    // Check if Python automation is available
    if (!fs.existsSync(runQuickWinsScript)) {
      this.log('⚠️  Quick Wins automation scripts not found, skipping...\n');
      return;
    }

    try {
      // Create automation config
      const config = {
        app_name: this.appName,
        exe_path: this.options.exePath || null,
        log_path: this.options.logPath || null,
        project_path: this.projectPath,
        output_dir: this.options.outputDir,
        monitor_duration: 30,
        skip_interactive: !this.options.interactive,
        quick_wins_to_run: this.options.quickWins || [1, 2]  // Default: only non-interactive tests
      };

      const configPath = path.join(this.options.outputDir, 'quick_wins_config.json');
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

      this.log(`✓ Created automation config: ${configPath}`);
      this.log(`  Running Quick Wins: ${config.quick_wins_to_run.join(', ')}`);

      // Run Python automation
      await this.runPythonScript(runQuickWinsScript, [configPath]);

      // Load automation results
      const resultsPath = path.join(this.options.outputDir, 'quick_wins_combined_report.json');
      if (fs.existsSync(resultsPath)) {
        const automationResults = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));
        this.analysisReport.automation = automationResults;
        this.log('✅ Automation results integrated into audit report\n');
      } else {
        this.log('⚠️  No automation results found\n');
      }

    } catch (error) {
      this.log(`⚠️  Automation failed: ${error.message}`);
      if (this.options.verbose) {
        console.error(error.stack);
      }
      this.log('   Continuing with audit...\n');
    }
  }

  /**
   * Helper: Run Python script
   */
  runPythonScript(scriptPath, args = []) {
    return new Promise((resolve, reject) => {
      const python = spawn('python', [scriptPath, ...args], {
        cwd: path.dirname(scriptPath)
      });

      python.stdout.on('data', (data) => {
        if (this.options.verbose) {
          process.stdout.write(data.toString());
        }
      });

      python.stderr.on('data', (data) => {
        if (this.options.verbose) {
          process.stderr.write(data.toString());
        }
      });

      python.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Python script exited with code ${code}`));
        }
      });

      python.on('error', (error) => {
        reject(new Error(`Failed to run Python script: ${error.message}`));
      });
    });
  }

  /**
   * Step 3.5: Run Visual Analysis (Python scripts)
   */
  async runVisualAnalysis() {
    console.log('🎨 Step 3.5: Running Visual Analysis...\n');

    const automationDir = path.join(__dirname, '../automation/quick_wins');
    const contrastScript = path.join(automationDir, 'color_contrast_analyzer.py');

    // Check if Python scripts are available
    if (!fs.existsSync(contrastScript)) {
      this.log('⚠️  Visual analysis scripts not found, skipping...\n');
      return;
    }

    try {
      // Create screenshots directory if needed
      const screenshotsDir = path.join(this.options.outputDir, 'screenshots');
      if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir, { recursive: true });
      }

      this.log(`✓ Screenshots directory: ${screenshotsDir}`);

      // Check if exe path provided for live capture
      if (this.options.exePath && fs.existsSync(this.options.exePath)) {
        this.log('✓ Executable path provided - will attempt live capture');
        // For now, skip live capture and look for existing screenshots
        this.log('  [INFO] Live capture not yet implemented, checking for existing screenshots...');
      }

      // Look for existing screenshots in project
      const existingScreenshots = this.findExistingScreenshots();

      if (existingScreenshots.length === 0) {
        this.log('⚠️  No screenshots found. Visual analysis requires screenshots.');
        this.log('   You can:');
        this.log('   1. Manually capture screenshots and place them in AccessibilityAudit/screenshots/');
        this.log('   2. Provide --exe-path to enable automated screenshot capture (future feature)');
        this.log('   Skipping visual analysis...\n');
        return;
      }

      this.log(`✓ Found ${existingScreenshots.length} screenshots to analyze\n`);

      // Run contrast analyzer on existing screenshots
      const contrastResultsPath = path.join(this.options.outputDir, 'contrast_analysis_results.json');

      this.log('Running color contrast analysis...');
      await this.runPythonScript(contrastScript, [screenshotsDir, contrastResultsPath]);

      // Run color-blind simulation
      const colorblindScript = path.join(automationDir, 'colorblind_simulator.py');
      const colorblindOutputDir = path.join(this.options.outputDir, 'colorblind_simulations');
      const colorblindResultsPath = path.join(this.options.outputDir, 'colorblind_analysis_results.json');

      if (fs.existsSync(colorblindScript)) {
        this.log('Running color-blind simulation...');
        await this.runPythonScript(colorblindScript, [screenshotsDir, colorblindOutputDir]);
      } else {
        this.log('⚠️  Color-blind simulator not found, skipping...');
      }

      // Load visual analysis results
      const visualAnalysis = {};

      if (fs.existsSync(contrastResultsPath)) {
        visualAnalysis.contrast = JSON.parse(fs.readFileSync(contrastResultsPath, 'utf-8'));
        this.log('✅ Contrast analysis results loaded');
      }

      // Look for colorblind results in the reports/output directory
      const colorblindReportPath = path.join(automationDir, '..', 'reports', 'output', 'qw8_colorblind_simulation.json');
      if (fs.existsSync(colorblindReportPath)) {
        visualAnalysis.colorblind = JSON.parse(fs.readFileSync(colorblindReportPath, 'utf-8'));
        this.log('✅ Color-blind simulation results loaded');
      }

      if (Object.keys(visualAnalysis).length > 0) {
        this.analysisReport.visualAnalysis = visualAnalysis;
        this.log('✅ Visual analysis results integrated into audit report\n');
      } else {
        this.log('⚠️  No visual analysis results found\n');
      }

    } catch (error) {
      this.log(`⚠️  Visual analysis failed: ${error.message}`);
      if (this.options.verbose) {
        console.error(error.stack);
      }
      this.log('   Continuing with audit...\n');
    }
  }

  /**
   * Helper: Find existing screenshots in project
   */
  findExistingScreenshots() {
    const screenshots = [];
    const screenshotsDir = path.join(this.options.outputDir, 'screenshots');

    if (!fs.existsSync(screenshotsDir)) {
      return screenshots;
    }

    const validExtensions = ['.png', '.jpg', '.jpeg', '.bmp'];

    try {
      const files = fs.readdirSync(screenshotsDir);
      for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        if (validExtensions.includes(ext)) {
          screenshots.push(path.join(screenshotsDir, file));
        }
      }
    } catch (error) {
      // Directory doesn't exist or can't be read
    }

    return screenshots;
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
      STYLUS_ONLY_SCRIPTS_COUNT: report.statistics.stylusOnlyScripts ? report.statistics.stylusOnlyScripts.length : 0,

      // Visual Analysis Variables
      VISUAL_ANALYSIS_PERFORMED: report.visualAnalysis && Object.keys(report.visualAnalysis).length > 0,
      VISUAL_SCREENSHOTS_ANALYZED: report.visualAnalysis?.contrast?.summary?.screenshots_analyzed || 0,
      VISUAL_CONTRAST_TOTAL_CHECKS: report.visualAnalysis?.contrast?.summary?.total_checks || 0,
      VISUAL_CONTRAST_PASSED: report.visualAnalysis?.contrast?.summary?.total_passed || 0,
      VISUAL_CONTRAST_FAILED: report.visualAnalysis?.contrast?.summary?.total_failed || 0,
      VISUAL_CONTRAST_PASS_RATE: report.visualAnalysis?.contrast?.summary?.overall_pass_rate?.toFixed(1) || '0.0',
      VISUAL_CONTRAST_COMPLIANT: report.visualAnalysis?.contrast?.summary?.wcag_compliant ? 'Yes ✅' : 'No ❌',
      VISUAL_COLORBLIND_SIMULATIONS: report.visualAnalysis?.colorblind?.summary?.total_simulations || 0
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
        { name: 'VPAT.template.md', output: `VPAT-SUMMARY-${this.appName}.md` },
        { name: 'VPAT-COMPREHENSIVE.template.md', output: `VPAT-${this.appName}.md` },
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
   * Step 4.5: Generate stakeholder communication documentation
   */
  async generateStakeholderDocumentation() {
    console.log('📢 Step 4.5: Generating stakeholder communication templates...\n');

    // TODO: Implement stakeholder documentation generation
    // This should:
    // 1. Load templates from templates/stakeholder/
    // 2. Populate with analysisReport data using Handlebars or similar
    // 3. Generate:
    //    - QUICK-REFERENCE.md (1-page for procurement)
    //    - PUBLIC-STATEMENT.md (public-facing accessibility commitment)
    //    - FAQ.md (multi-audience question bank)
    // 4. Save to this.options.outputDir
    //
    // Template variables to populate:
    //   - {{APP_NAME}}, {{AUDIT_DATE}}, {{FRAMEWORK_VERSION}}
    //   - {{COMPLIANCE_SCORE}}, {{COMPLIANCE_LEVEL}}
    //   - {{CRITICAL_COUNT}}, {{HIGH_COUNT}}, etc.
    //   - Boolean flags: KEYBOARD_SUPPORT_FOUND, SCREEN_READER_SUPPORT_FOUND, etc.
    //
    // See templates/stakeholder/README.md for full implementation guidance

    console.log('⚠️  Stakeholder documentation generation not yet fully implemented.');
    console.log('    Templates are available in templates/stakeholder/');
    console.log('    See External Communication Guide: docs/EXTERNAL-COMMUNICATION-GUIDE.md');
    console.log('    Manual generation recommended until automated rendering is implemented.\n');
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
  --stakeholder-docs      Generate stakeholder communication templates (Quick Reference, Public Statement, FAQ)
  --run-automation        Run Quick Wins automation tests (requires Python & dependencies)
  --exe-path <path>       Path to Unity executable for automation testing
  --log-path <path>       Path to Unity Player.log for log analysis
  --interactive           Enable interactive automation tests (keyboard navigation, etc.)
  --quick-wins <list>     Comma-separated list of Quick Wins to run (e.g., "1,2,5")
  --capture-screenshots   Enable visual analysis with screenshot capture and contrast testing
  --help, -h              Show this help message

Examples:
  # Basic audit (static analysis only)
  node bin/audit.js /path/to/unity-project

  # Audit with automation (log analysis only)
  node bin/audit.js /path/to/unity-project --run-automation

  # Full audit with executable testing
  node bin/audit.js /path/to/unity-project --run-automation --exe-path "C:/Program Files/MyApp/app.exe" --interactive

  # Custom Quick Wins selection
  node bin/audit.js /path/to/unity-project --run-automation --quick-wins "1,2"

Output:
  AccessibilityAudit/
  ├── README.md                              (Overview and quick start)
  ├── AUDIT-SUMMARY.md                       (Executive summary)
  ├── VPAT-<name>.md                         (Comprehensive VPAT 2.5 - all 50 WCAG criteria)
  ├── VPAT-SUMMARY-<name>.md                 (Quick VPAT summary - detected issues only)
  ├── ACCESSIBILITY-RECOMMENDATIONS.md       (Developer guide)
  ├── accessibility-analysis.json            (Raw data)
  └── quick_wins_combined_report.json        (Automation test results)

Quick Wins Automation:
  1. Application Launch & Monitoring          (requires --exe-path)
  2. Log File Scene Analyzer                  (auto-detects or use --log-path)
  3. Basic Input Automation                   (requires --exe-path and --interactive)
  4. Keyboard Navigation Test                 (requires --exe-path and --interactive)
  5. Accessibility Audit Integration          (always runs)
    `);
    process.exit(0);
  }

  const options = {
    projectPath: null,
    outputDir: null,
    format: 'markdown',
    verbose: false,
    runQuickWins: false,
    exePath: null,
    logPath: null,
    interactive: false,
    quickWins: null,
    captureScreenshots: false
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
    } else if (arg === '--stakeholder-docs') {
      options.generateStakeholderDocs = true;
    } else if (arg === '--run-automation') {
      options.runQuickWins = true;
    } else if (arg === '--exe-path' && args[i + 1]) {
      options.exePath = args[i + 1];
      i++;
    } else if (arg === '--log-path' && args[i + 1]) {
      options.logPath = args[i + 1];
      i++;
    } else if (arg === '--interactive') {
      options.interactive = true;
    } else if (arg === '--quick-wins' && args[i + 1]) {
      options.quickWins = args[i + 1].split(',').map(n => parseInt(n.trim()));
      i++;
    } else if (arg === '--capture-screenshots') {
      options.captureScreenshots = true;
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
    verbose: options.verbose,
    runQuickWins: options.runQuickWins,
    exePath: options.exePath,
    logPath: options.logPath,
    interactive: options.interactive,
    quickWins: options.quickWins,
    captureScreenshots: options.captureScreenshots
  });

  await auditor.run();
}

// Run if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}

export { AccessibilityAuditor };
