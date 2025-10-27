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
 *   --output-dir <dir>         Output directory for audit reports (default: <project>/AccessibilityAudit)
 *   --format <format>          Output format: markdown (default), json, both
 *   --capture-screenshots      Capture scene screenshots before analysis
 *   --unity-path <path>        Path to Unity executable (for screenshot capture)
 *   --verbose                  Enable verbose logging
 *
 * Output:
 *   AccessibilityAudit/
 *   ├── README.md
 *   ├── AUDIT-SUMMARY.md
 *   ├── VPAT-apps-<name>.md
 *   ├── ACCESSIBILITY-RECOMMENDATIONS.md
 *   └── screenshots/           (if --capture-screenshots is used)
 *       ├── SceneName/
 *       │   ├── SceneName_main.png
 *       │   ├── SceneName_thumbnail.png
 *       │   └── metadata.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { UnityProjectAnalyzer } from './analyze-unity-project.js';
import { captureScreenshots } from './capture-screenshots.js';
import { ComplianceTracker } from './compliance-tracker.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// CONFIGURATION
// ============================================================================

const VERSION = '3.1.0-phase1';
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
      verbose: options.verbose || false,
      captureScreenshots: options.captureScreenshots || false,
      unityPath: options.unityPath || null,
      baseline: options.baseline || false,
      trackCompliance: options.trackCompliance || false,
      failOnRegression: options.failOnRegression || false
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
    console.log(`║  Version ${VERSION}                                   ║`);
    console.log('╚═══════════════════════════════════════════════════════════╝\n');

    this.log(`Auditing: ${this.appName}`);
    this.log(`Project: ${this.projectPath}`);
    this.log(`Output: ${this.options.outputDir}\n`);

    try {
      // Step 0: Capture screenshots (if enabled)
      if (this.options.captureScreenshots) {
        await this.captureSceneScreenshots();
      }

      // Step 1: Analyze Unity project
      await this.analyzeProject();

      // Step 2: Create output directory
      await this.createOutputDirectory();

      // Step 3: Generate reports
      await this.generateReports();

      // Step 4: Display summary
      this.displaySummary();

      // Step 5: Compliance tracking (Phase 3.2)
      let regressionCheck = null;
      if (this.options.baseline || this.options.trackCompliance || this.options.failOnRegression) {
        regressionCheck = await this.handleComplianceTracking();
      }

      console.log('\n✅ Audit complete!');
      console.log(`📁 Reports saved to: ${this.options.outputDir}\n`);

      // Handle CI/CD exit codes
      if (this.options.failOnRegression && regressionCheck) {
        const tracker = new ComplianceTracker(this.projectPath);
        const exitCode = tracker.getExitCode(regressionCheck);
        if (exitCode !== 0) {
          console.log(`\n⚠️  Exiting with code ${exitCode} due to regressions`);
          process.exit(exitCode);
        }
      }

    } catch (error) {
      console.error('\n❌ Audit failed:', error.message);
      if (this.options.verbose) {
        console.error(error.stack);
      }
      process.exit(1);
    }
  }

  /**
   * Handle compliance tracking (Phase 3.2)
   */
  async handleComplianceTracking() {
    console.log('\n📊 Step 5: Compliance Tracking...\n');

    const tracker = new ComplianceTracker(this.projectPath, {
      failOnHighIssues: this.options.failOnRegression
    });

    // Create or update baseline
    if (this.options.baseline) {
      tracker.createBaseline(this.analysisReport);
    }

    // Save snapshot for historical tracking
    if (this.options.trackCompliance && !this.options.baseline) {
      tracker.saveSnapshot(this.analysisReport);
    }

    // Check for regressions
    let regressionCheck = null;
    if (this.options.failOnRegression) {
      regressionCheck = tracker.checkRegression(this.analysisReport);
    }

    return regressionCheck;
  }

  /**
   * Step 0: Capture scene screenshots
   */
  async captureSceneScreenshots() {
    console.log('📸 Step 0: Capturing scene screenshots...\n');

    const screenshotConfig = {
      projectPath: this.projectPath,
      unityPath: this.options.unityPath,
      outputDir: path.join(this.options.outputDir, 'screenshots'),
      width: 1920,
      height: 1080,
      thumbWidth: 320,
      thumbHeight: 180,
      logFile: path.join(this.options.outputDir, 'screenshot-capture.log'),
      verbose: this.options.verbose
    };

    try {
      await captureScreenshots(screenshotConfig);
      this.log('\n✅ Screenshot capture complete\n');
    } catch (error) {
      console.warn('\n⚠️  Screenshot capture failed:', error.message);
      console.warn('   Continuing with audit without screenshots...\n');
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

    // Conditional sections: {{#if VARIABLE}}content{{else}}alternative{{/if}}
    // Process nested conditionals by running multiple passes until no more matches
    // Use a more robust approach that matches balanced pairs
    let maxIterations = 10; // Prevent infinite loops
    let iteration = 0;
    while (iteration < maxIterations && /{{#if\s+\w+}}/.test(output)) {
      let changed = false;

      // Find and process the innermost {{#if}} first
      output = output.replace(/{{#if\s+(\w+)}}((?:(?!{{#if)[\s\S])*?)(?:{{else}}((?:(?!{{#if)[\s\S])*?))?{{\/if}}/g, (match, varName, ifContent, elseContent = '') => {
        changed = true;
        return variables[varName] ? ifContent : elseContent;
      });

      if (!changed) break; // No more replacements made
      iteration++;
    }

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

    // Check for screenshots
    const screenshotsDir = path.join(this.options.outputDir, 'screenshots');
    const screenshotsCaptured = fs.existsSync(screenshotsDir);
    let screenshotsCount = 0;

    if (screenshotsCaptured) {
      try {
        const sceneDirs = fs.readdirSync(screenshotsDir).filter(item => {
          const itemPath = path.join(screenshotsDir, item);
          return fs.statSync(itemPath).isDirectory();
        });
        screenshotsCount = sceneDirs.length;
      } catch (err) {
        // Ignore errors
      }
    }

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
      SCREENSHOTS_CAPTURED: screenshotsCaptured,
      SCREENSHOTS_NOT_CAPTURED: !screenshotsCaptured,
      SCREENSHOTS_COUNT: screenshotsCount,

      // Visual Analysis Variables (Phase 2)
      VISUAL_ANALYSIS_PERFORMED: false,
      VISUAL_ANALYSIS_NOT_PERFORMED: true,
      CONTRAST_ANALYSIS_PERFORMED: false,
      CONTRAST_ANALYSIS_COMPONENTS: 0,
      CONTRAST_ISSUES_FOUND: false,
      CONTRAST_CRITICAL_COUNT: 0,
      CONTRAST_WARNING_COUNT: 0,
      CONTRAST_COMPLIANCE_RATE: '0%',
      CONTRAST_PASSING_COMPONENTS: 0,
      CONTRAST_FAILING_COMPONENTS: 0,
      COLOR_BLIND_ANALYSIS_PERFORMED: false,
      COLOR_BLIND_ISSUES_FOUND: false,
      COLOR_BLIND_AFFECTED_TYPES: '',
      CAPTIONS_DETECTED: false,
      DEPTH_CUES_FOUND: false,
      VOICE_COMMANDS_DETECTED: false,
      HEATMAPS_GENERATED: false,
      HEATMAPS_COUNT: 0,
      ...this.loadVisualAnalysisVariables()
    };
  }

  /**
   * Load visual analysis variables from Phase 2 outputs
   */
  loadVisualAnalysisVariables() {
    const variables = {};

    // Check for contrast analysis results
    const contrastPath = path.join(this.options.outputDir, 'contrast-analysis.json');
    if (fs.existsSync(contrastPath)) {
      try {
        const contrastData = JSON.parse(fs.readFileSync(contrastPath, 'utf8'));
        variables.VISUAL_ANALYSIS_PERFORMED = true;
        variables.VISUAL_ANALYSIS_NOT_PERFORMED = false;
        variables.CONTRAST_ANALYSIS_PERFORMED = true;
        variables.CONTRAST_ANALYSIS_COMPONENTS = contrastData.summary?.componentsAnalyzed || 0;
        variables.CONTRAST_PASSING_COMPONENTS = contrastData.summary?.passingComponents || 0;
        variables.CONTRAST_FAILING_COMPONENTS = contrastData.summary?.failingComponents || 0;
        variables.CONTRAST_COMPLIANCE_RATE = contrastData.summary?.complianceRate || '0%';

        // Count critical and warning issues
        let criticalCount = 0;
        let warningCount = 0;

        if (contrastData.scenes) {
          Object.values(contrastData.scenes).forEach(scene => {
            if (scene.components) {
              scene.components.forEach(comp => {
                if (!comp.passes) {
                  const ratio = parseFloat(comp.contrastRatio);
                  if (ratio < 3.0) criticalCount++;
                  else if (ratio < 4.5) warningCount++;
                }
              });
            }
          });
        }

        variables.CONTRAST_CRITICAL_COUNT = criticalCount;
        variables.CONTRAST_WARNING_COUNT = warningCount;
        variables.CONTRAST_ISSUES_FOUND = (criticalCount + warningCount) > 0;
      } catch (err) {
        this.log(`⚠️  Could not parse contrast-analysis.json: ${err.message}`);
      }
    }

    // Check for color-blind simulation results
    const screenshotsDir = path.join(this.options.outputDir, 'screenshots');
    if (fs.existsSync(screenshotsDir)) {
      const sceneDirs = fs.readdirSync(screenshotsDir).filter(item => {
        const itemPath = path.join(screenshotsDir, item);
        return fs.statSync(itemPath).isDirectory();
      });

      if (sceneDirs.length > 0) {
        // Check if any scene has colorblind simulations
        sceneDirs.forEach(sceneDir => {
          const colorblindDir = path.join(screenshotsDir, sceneDir, 'colorblind');
          if (fs.existsSync(colorblindDir)) {
            variables.VISUAL_ANALYSIS_PERFORMED = true;
            variables.VISUAL_ANALYSIS_NOT_PERFORMED = false;
            variables.COLOR_BLIND_ANALYSIS_PERFORMED = true;
            // Could analyze comparison.html for issues, but for now just mark as performed
          }
        });
      }
    }

    // Check for visual analysis heatmaps
    const heatmapDir = path.join(this.options.outputDir, 'visual-analysis', 'heatmaps');
    if (fs.existsSync(heatmapDir)) {
      try {
        const heatmaps = fs.readdirSync(heatmapDir).filter(f => f.endsWith('.png'));
        if (heatmaps.length > 0) {
          variables.HEATMAPS_GENERATED = true;
          variables.HEATMAPS_COUNT = heatmaps.length;
        }
      } catch (err) {
        // Ignore errors
      }
    }

    return variables;
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
  --output-dir <dir>         Output directory for reports (default: <project>/AccessibilityAudit)
  --format <format>          Output format: markdown, json, both (default: markdown)
  --capture-screenshots      Capture scene screenshots before analysis
  --unity-path <path>        Path to Unity executable (for screenshot capture)
  --verbose                  Enable verbose logging
  --baseline                 Create/update baseline for compliance tracking (Phase 3.2)
  --track-compliance         Save audit snapshot to compliance-history/ (Phase 3.2)
  --fail-on-regression       Exit with code 1 if regressions detected vs baseline (Phase 3.2)
  --help, -h                 Show this help message

Examples:
  # Audit a Unity project
  node bin/audit.js /path/to/unity-project

  # Audit with screenshot capture
  node bin/audit.js /path/to/unity-project --capture-screenshots

  # Create compliance baseline
  node bin/audit.js /path/to/unity-project --baseline

  # Track compliance and fail on regression (CI/CD)
  node bin/audit.js /path/to/unity-project --track-compliance --fail-on-regression

  # Full audit with compliance tracking
  node bin/audit.js /path/to/unity-project --capture-screenshots --track-compliance --verbose

Output:
  AccessibilityAudit/
  ├── README.md                              (Overview and quick start)
  ├── AUDIT-SUMMARY.md                       (Executive summary)
  ├── VPAT-<name>.md                         (Comprehensive VPAT 2.5 - all 50 WCAG criteria)
  ├── VPAT-SUMMARY-<name>.md                 (Quick VPAT summary - detected issues only)
  ├── ACCESSIBILITY-RECOMMENDATIONS.md       (Developer guide)
  └── accessibility-analysis.json            (Raw data)
    `);
    process.exit(0);
  }

  const options = {
    projectPath: null,
    outputDir: null,
    format: 'markdown',
    verbose: false,
    captureScreenshots: false,
    unityPath: null,
    baseline: false,
    trackCompliance: false,
    failOnRegression: false
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
    } else if (arg === '--unity-path' && args[i + 1]) {
      options.unityPath = args[i + 1];
      i++;
    } else if (arg === '--capture-screenshots') {
      options.captureScreenshots = true;
    } else if (arg === '--verbose') {
      options.verbose = true;
    } else if (arg === '--baseline') {
      options.baseline = true;
      options.trackCompliance = true; // Baseline implies tracking
    } else if (arg === '--track-compliance') {
      options.trackCompliance = true;
    } else if (arg === '--fail-on-regression') {
      options.failOnRegression = true;
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
    captureScreenshots: options.captureScreenshots,
    unityPath: options.unityPath,
    baseline: options.baseline,
    trackCompliance: options.trackCompliance,
    failOnRegression: options.failOnRegression
  });

  await auditor.run();
}

// Run if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}

export { AccessibilityAuditor };
