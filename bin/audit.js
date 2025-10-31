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
 *   --analyze-visual           Run visual analysis (contrast, colorblind simulation)
 *   --unity-path <path>        Path to Unity executable (for screenshot capture)
 *   --application <path>       Path to built application .exe (for external capture)
 *   --verbose                  Enable verbose logging
 *   --stakeholder-docs         Generate stakeholder communication templates
 *   --baseline                 Create/update baseline for compliance tracking
 *   --track-compliance         Save audit snapshot to compliance-history/
 *   --fail-on-regression       Exit with code 1 if regressions detected
 *   --export-pdf               Export VPAT report to PDF
 *   --export-csv               Export findings to CSV
 *   --create-issues <platform> Create issues on github or jira
 *   --generate-fixes           Generate C# code fixes for accessibility issues
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
import { execSync } from 'child_process';
import { UnityProjectAnalyzer } from './analyze-unity-project.js';
import { captureScreenshots } from './capture-screenshots.js';
import { ComplianceTracker } from './compliance-tracker.js';
import { NavigationAutomation } from './navigate-and-capture.js';
import LanguageValidator from './utils/language-validator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// CONFIGURATION
// ============================================================================

const VERSION = '3.4.0-phase4';
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
      application: options.application || null, // Path to built .exe for external capture
      baseline: options.baseline || false,
      trackCompliance: options.trackCompliance || false,
      failOnRegression: options.failOnRegression || false,
      exportPDF: options.exportPDF || false,
      exportCSV: options.exportCSV || false,
      createIssues: options.createIssues || null,
      template: options.template || null,
      config: options.config || path.join(__dirname, '..', 'config', 'export-config.json'),
      generateFixes: options.generateFixes || false,
      generateStakeholderDocs: options.generateStakeholderDocs || false
    };
    this.analysisReport = null;
    this.appName = path.basename(this.projectPath);

    // NEW: Generate timestamp for this audit run (for filename prefixes)
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    this.timestamp = `${year}-${month}-${day}_${hours}${minutes}${seconds}`;

    // Load zSpace-specific configuration for non-applicable criteria
    this.zSpaceConfig = this.loadZSpaceConfig();
  }

  /**
   * Load zSpace WCAG non-applicable criteria configuration
   */
  loadZSpaceConfig() {
    const configPath = path.join(__dirname, '..', 'config', 'zspace-non-applicable-criteria.json');

    try {
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        this.log('✅ Loaded zSpace configuration for non-applicable criteria');
        return config;
      }
    } catch (error) {
      this.log(`⚠️  Could not load zSpace config: ${error.message}`);
    }

    return null;
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

      // Step 2.5: Run visual analysis (if enabled)
      if (this.options.analyzeVisual) {
        await this.runVisualAnalysis();
      }

      // Step 3: Generate reports
      await this.generateReports();

      // Step 4: Generate stakeholder documentation (if requested)
      if (this.options.generateStakeholderDocs) {
        await this.generateStakeholderDocumentation();
      }

      // Step 4.5: Display summary
      this.displaySummary();

      // Step 5: Export reports (Phase 3.4)
      if (this.options.exportPDF || this.options.exportCSV || this.options.createIssues) {
        await this.handleExports();
      }

      // Step 6: Generate fixes (Phase 3.5)
      if (this.options.generateFixes) {
        await this.handleFixGeneration();
      }

      // Step 7: Compliance tracking (Phase 3.2)
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
   * Handle report exports (Phase 3.4) with timestamp-aware filenames
   */
  async handleExports() {
    console.log('\n📤 Step 5: Exporting reports...\n');

    // Export to PDF
    if (this.options.exportPDF) {
      try {
        const vpatPath = path.join(this.options.outputDir, `${this.timestamp}_VPAT-${this.appName}.md`);
        const pdfPath = path.join(this.options.outputDir, 'exports', `${this.timestamp}_VPAT-${this.appName}.pdf`);

        // Ensure exports directory exists
        const exportsDir = path.join(this.options.outputDir, 'exports');
        if (!fs.existsSync(exportsDir)) {
          fs.mkdirSync(exportsDir, { recursive: true });
        }

        const exportPDFPath = path.join(__dirname, 'export-pdf.js');
        const configArg = this.options.config ? `--config "${this.options.config}"` : '';

        console.log('   📄 Generating PDF...');
        execSync(`node "${exportPDFPath}" "${vpatPath}" --output "${pdfPath}" ${configArg}`, {
          stdio: this.options.verbose ? 'inherit' : 'pipe'
        });

        this.log('   ✅ PDF exported successfully');
      } catch (error) {
        console.warn('   ⚠️  PDF export failed:', error.message);
      }
    }

    // Export to CSV
    if (this.options.exportCSV) {
      try {
        const jsonPath = path.join(this.options.outputDir, `${this.timestamp}_accessibility-analysis.json`);
        const csvPath = path.join(this.options.outputDir, 'exports', `${this.timestamp}_findings.csv`);

        const exportCSVPath = path.join(__dirname, 'export-csv.js');

        console.log('   📊 Generating CSV...');
        execSync(`node "${exportCSVPath}" "${jsonPath}" --output "${csvPath}"`, {
          stdio: this.options.verbose ? 'inherit' : 'pipe'
        });

        this.log('   ✅ CSV exported successfully');
      } catch (error) {
        console.warn('   ⚠️  CSV export failed:', error.message);
      }
    }

    // Create issues
    if (this.options.createIssues) {
      try {
        const jsonPath = path.join(this.options.outputDir, `${this.timestamp}_accessibility-analysis.json`);
        const platform = this.options.createIssues.toLowerCase();

        if (platform !== 'github' && platform !== 'jira') {
          throw new Error(`Unknown platform: ${platform}. Use 'github' or 'jira'`);
        }

        if (!this.options.config || !fs.existsSync(this.options.config)) {
          throw new Error('Config file required for issue creation. Use --config <path>');
        }

        const generateIssuesPath = path.join(__dirname, 'generate-issues.js');

        console.log(`   🐛 Creating ${platform} issues...`);
        execSync(`node "${generateIssuesPath}" "${jsonPath}" --platform ${platform} --config "${this.options.config}" --min-severity High`, {
          stdio: this.options.verbose ? 'inherit' : 'pipe'
        });

        this.log(`   ✅ ${platform} issues created successfully`);
      } catch (error) {
        console.warn('   ⚠️  Issue creation failed:', error.message);
      }
    }

    console.log();
  }

  /**
   * Handle fix generation (Phase 3.5) with timestamp-aware filenames
   */
  async handleFixGeneration() {
    console.log('\n🔧 Step 6: Generating accessibility fixes...\n');

    try {
      const jsonPath = path.join(this.options.outputDir, `${this.timestamp}_accessibility-analysis.json`);
      const generateFixesPath = path.join(__dirname, 'generate-fixes.js');

      console.log('   🔨 Analyzing findings and generating fixes...');
      execSync(`node "${generateFixesPath}" "${jsonPath}" --project "${this.projectPath}"`, {
        stdio: this.options.verbose ? 'inherit' : 'pipe'
      });

      this.log('   ✅ Fixes generated successfully');
      this.log(`   📁 Generated code saved to: ${this.options.outputDir}/generated-fixes/`);
    } catch (error) {
      console.warn('   ⚠️  Fix generation failed:', error.message);
      if (this.options.verbose) {
        console.error(error.stack);
      }
    }

    console.log();
  }

  /**
   * Handle compliance tracking (Phase 3.2)
   */
  async handleComplianceTracking() {
    console.log('\n📊 Step 7: Compliance Tracking...\n');

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
   * Check if navigation map exists for external capture
   */
  detectNavigationMap() {
    const navigationMapPath = path.join(this.options.outputDir, 'navigation-map.json');

    if (fs.existsSync(navigationMapPath)) {
      this.log(`✅ Navigation map detected: ${navigationMapPath}`);
      return navigationMapPath;
    }

    this.log('ℹ️  No navigation map found (external capture not available)');
    return null;
  }

  /**
   * Step 0: Capture scene screenshots
   * Automatically chooses between external capture (if navigation map exists)
   * or Unity batch mode (traditional method)
   * NEW: Auto-generates navigation map if external capture is requested
   */
  async captureSceneScreenshots() {
    console.log('📸 Step 0: Capturing scene screenshots...\n');

    // Check if navigation map exists
    let navigationMapPath = this.detectNavigationMap();

    // NEW: Auto-generate navigation map if external capture is requested but map doesn't exist
    if (!navigationMapPath && this.options.application) {
      console.log('🗺️  Navigation map not found. Generating automatically...\n');

      try {
        const parseNavMapPath = path.join(__dirname, 'parse-navigation-map.js');
        execSync(`node "${parseNavMapPath}" "${this.projectPath}"`, {
          stdio: this.options.verbose ? 'inherit' : 'pipe'
        });

        // Check if navigation map was created
        navigationMapPath = this.detectNavigationMap();

        if (navigationMapPath) {
          console.log('✅ Navigation map generated successfully\n');
        } else {
          console.warn('⚠️  Navigation map generation failed. Falling back to Unity batch mode...\n');
        }
      } catch (error) {
        console.warn(`⚠️  Failed to generate navigation map: ${error.message}`);
        console.warn('   Falling back to Unity batch mode...\n');
      }
    }

    const useExternalCapture = navigationMapPath && this.options.application;

    if (useExternalCapture) {
      // Phase 4: Use external navigation and capture
      console.log('🚀 Using external capture method (navigation map detected)\n');

      try {
        await this.captureScreenshotsExternal(navigationMapPath);
        this.log('\n✅ External screenshot capture complete\n');
        return;
      } catch (error) {
        console.warn('\n⚠️  External capture failed:', error.message);

        // Fallback to Unity batch mode if available
        if (this.options.unityPath) {
          console.warn('   Falling back to Unity batch mode...\n');
        } else {
          console.warn('   Continuing with audit without screenshots...\n');
          return;
        }
      }
    } else {
      // Log why external capture is not used
      if (!navigationMapPath) {
        this.log('ℹ️  Navigation map not found, using Unity batch mode');
      } else if (!this.options.application) {
        this.log('ℹ️  Application path not provided (use --application), using Unity batch mode');
      }
    }

    // Traditional Unity batch mode capture
    console.log('🎮 Using Unity batch mode capture\n');

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
   * Capture screenshots using external navigation automation (Phase 4)
   */
  async captureScreenshotsExternal(navigationMapPath) {
    this.log('Initializing external navigation automation...');

    const automation = new NavigationAutomation({
      outputDir: path.join(this.options.outputDir, 'screenshots'),
      verbose: this.options.verbose
    });

    try {
      // Run the navigation automation
      const report = await automation.run(this.options.application, navigationMapPath);

      // Log summary
      console.log(`\n✅ External capture complete:`);
      console.log(`   Visited scenes: ${report.summary.visitedScenes} / ${report.summary.totalScenes}`);
      console.log(`   Screenshots: ${report.summary.screenshotsCaptured}`);
      console.log(`   Failed navigations: ${report.summary.failedNavigations}`);
      console.log(`   Completion rate: ${report.summary.completionRate}`);

      // Close the application
      await automation.controller.closeApplication();

      // Terminate OCR worker
      if (automation.tesseractWorker) {
        await automation.tesseractWorker.terminate();
      }

      return report;
    } catch (error) {
      // Clean up on error
      if (automation.controller) {
        try {
          await automation.controller.closeApplication();
        } catch (cleanupError) {
          this.log(`Warning: Failed to close application: ${cleanupError.message}`);
        }
      }

      if (automation.tesseractWorker) {
        try {
          await automation.tesseractWorker.terminate();
        } catch (cleanupError) {
          this.log(`Warning: Failed to terminate OCR worker: ${cleanupError.message}`);
        }
      }

      throw error;
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
   * Step 2.5: Run Visual Analysis (Python scripts)
   * Runs color contrast analysis and colorblind simulation on captured screenshots
   */
  async runVisualAnalysis() {
    console.log('🎨 Step 2.5: Running Visual Analysis...\n');

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
   * Analyze project for context-dependent WCAG criteria
   */
  analyzeContextDependentCriteria() {
    const report = this.analysisReport;
    const contextCriteria = {};

    // 3.2.3 Consistent Navigation - Check if navigation patterns are consistent
    // Look for scene loading patterns and UI navigation
    const hasSceneNavigation = report.findings.all?.some(finding =>
      finding.description?.toLowerCase().includes('scene') ||
      finding.description?.toLowerCase().includes('navigation')
    );

    // Check if there are multiple scenes (indicator of navigation)
    const multipleScenes = report.summary.totalScenes > 1;

    if (multipleScenes && hasSceneNavigation) {
      // If we found potential navigation issues, mark as not supporting
      contextCriteria.CONSISTENT_NAVIGATION_STATUS = 'Does Not Support';
    } else if (multipleScenes) {
      // Multiple scenes but no navigation issues detected
      contextCriteria.CONSISTENT_NAVIGATION_STATUS = 'Supports';
    } else {
      // Single scene application
      contextCriteria.CONSISTENT_NAVIGATION_STATUS = 'Not Applicable (single scene)';
    }

    // 2.4.5 Multiple Ways - Check for multiple navigation methods
    // This is context-dependent: not applicable for linear educational sequences
    const hasSearchFunctionality = report.findings.all?.some(finding =>
      finding.description?.toLowerCase().includes('search')
    );

    const hasMenuNavigation = report.findings.all?.some(finding =>
      finding.description?.toLowerCase().includes('menu')
    );

    if (multipleScenes && (hasSearchFunctionality || hasMenuNavigation)) {
      // If app has multiple ways to navigate, check if implemented correctly
      contextCriteria.MULTIPLE_WAYS_STATUS = 'Supports';
    } else if (multipleScenes) {
      // Linear sequence - exception applies
      contextCriteria.MULTIPLE_WAYS_STATUS = 'Not Applicable (linear educational sequence)';
    } else {
      contextCriteria.MULTIPLE_WAYS_STATUS = 'Not Applicable (single scene)';
    }

    return contextCriteria;
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

    // Analyze context-dependent criteria
    const contextCriteria = this.analyzeContextDependentCriteria();

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
      ...this.loadVisualAnalysisVariables(),

      // zSpace-specific context-dependent criteria (Phase 2: zSpace Integration)
      CONSISTENT_NAVIGATION_STATUS: contextCriteria.CONSISTENT_NAVIGATION_STATUS,
      MULTIPLE_WAYS_STATUS: contextCriteria.MULTIPLE_WAYS_STATUS
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
   * Step 3: Generate audit reports with timestamp prefixes
   */
  async generateReports() {
    console.log('📝 Step 3: Generating audit reports...\n');

    // Always save JSON analysis report with timestamp prefix
    const jsonPath = path.join(this.options.outputDir, `${this.timestamp}_accessibility-analysis.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(this.analysisReport, null, 2));
    this.log(`   ✅ Generated: ${this.timestamp}_accessibility-analysis.json`);

    // Generate markdown reports from templates
    const templatesDir = path.join(__dirname, '../templates/audit');

    if (fs.existsSync(templatesDir)) {
      const variables = this.prepareTemplateVariables();

      // Generate each report from template with timestamp prefix
      const templates = [
        { name: 'README.template.md', output: `${this.timestamp}_README.md` },
        { name: 'AUDIT-SUMMARY.template.md', output: `${this.timestamp}_AUDIT-SUMMARY.md` },
        { name: 'VPAT.template.md', output: `${this.timestamp}_VPAT-SUMMARY-${this.appName}.md` },
        { name: 'VPAT-COMPREHENSIVE.template.md', output: `${this.timestamp}_VPAT-${this.appName}.md` },
        { name: 'RECOMMENDATIONS.template.md', output: `${this.timestamp}_ACCESSIBILITY-RECOMMENDATIONS.md` }
      ];

      // Generate communication documents from templates with timestamp prefix
      const communicationTemplatesDir = path.join(__dirname, '../templates/communication');
      const communicationTemplates = [
        { name: 'QUICK-REFERENCE.template.md', output: `${this.timestamp}_ACCESSIBILITY-QUICK-REFERENCE-${this.appName}.md` },
        { name: 'PUBLIC-STATEMENT.template.md', output: `${this.timestamp}_ACCESSIBILITY-PUBLIC-STATEMENT-${this.appName}.md` },
        { name: 'FAQ.template.md', output: `${this.timestamp}_ACCESSIBILITY-FAQ-${this.appName}.md` },
        { name: 'IMPLEMENTATION-GUIDE.template.md', output: `${this.timestamp}_ACCESSIBILITY-IMPLEMENTATION-GUIDE-${this.appName}.md` },
        { name: 'PROGRESS-UPDATE.template.md', output: `${this.timestamp}_ACCESSIBILITY-PROGRESS-UPDATE-${this.appName}.md` }
      ];

      // Combine all templates
      const allTemplates = [
        ...templates.map(t => ({ ...t, dir: templatesDir })),
        ...communicationTemplates.map(t => ({ ...t, dir: communicationTemplatesDir }))
      ];

      // Track generated files for validation
      const generatedFiles = {};

      allTemplates.forEach(({ name, output, dir }) => {
        const templatePath = path.join(dir, name);

        if (fs.existsSync(templatePath)) {
          const templateContent = fs.readFileSync(templatePath, 'utf-8');
          const renderedContent = this.processTemplate(templateContent, variables);
          const outputPath = path.join(this.options.outputDir, output);
          fs.writeFileSync(outputPath, renderedContent);
          this.log(`   ✅ Generated: ${output}`);

          // Store for validation
          generatedFiles[output] = renderedContent;
        } else {
          this.log(`   ⚠️  Template not found: ${name}`);
        }
      });

      // Run language validation on all generated documents
      console.log('\n📋 Running language validation...\n');
      const validator = new LanguageValidator();
      const validationResults = validator.validateMultiple(generatedFiles);
      const validationReport = validator.generateReport(validationResults);

      // Save validation report with timestamp prefix
      const validationReportPath = path.join(this.options.outputDir, `${this.timestamp}_LANGUAGE-VALIDATION-REPORT.md`);
      fs.writeFileSync(validationReportPath, validationReport);
      this.log(`   ✅ Generated: ${this.timestamp}_LANGUAGE-VALIDATION-REPORT.md`);

      // Display validation summary
      const summary = validationResults.combined.summary;
      console.log('\n📊 Language Validation Summary:');
      console.log(`   🔴 Errors:   ${summary.totalErrors}`);
      console.log(`   🟡 Warnings: ${summary.totalWarnings}`);
      console.log(`   ℹ️  Info:     ${summary.totalInfo}`);

      if (summary.totalErrors > 0) {
        console.log('\n   ❌ CRITICAL: Language issues found that require legal review');
        console.log(`   📄 Review: LANGUAGE-VALIDATION-REPORT.md\n`);
      } else if (summary.totalWarnings > 0) {
        console.log('\n   ⚠️  Language issues found for review');
        console.log(`   📄 Review: LANGUAGE-VALIDATION-REPORT.md\n`);
      } else {
        console.log('\n   ✅ No language issues detected\n');
      }
    } else {
      this.log('   ⚠️  Templates directory not found (Phase 1B in progress)');
    }

    console.log();
  }

  /**
   * Step 4: Generate stakeholder communication documentation
   */
  async generateStakeholderDocumentation() {
    console.log('📢 Step 4: Generating stakeholder communication templates...\n');

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
  <unity-project-path>       Path to Unity project root directory

Options:
  --output-dir <dir>         Output directory for reports (default: <project>/AccessibilityAudit)
  --format <format>          Output format: markdown, json, both (default: markdown)
  --capture-screenshots      Capture scene screenshots before analysis
  --unity-path <path>        Path to Unity executable (for Unity batch mode capture)
  --application <path>       Path to built application .exe (for external capture - Phase 4)
  --verbose                  Enable verbose logging
  --stakeholder-docs         Generate stakeholder communication templates
  --baseline                 Create/update baseline for compliance tracking (Phase 3.2)
  --track-compliance         Save audit snapshot to compliance-history/ (Phase 3.2)
  --fail-on-regression       Exit with code 1 if regressions detected vs baseline (Phase 3.2)
  --export-pdf               Export VPAT report to PDF after analysis (Phase 3.4)
  --export-csv               Export findings to CSV after analysis (Phase 3.4)
  --create-issues <platform> Create issues on github or jira (Phase 3.4)
  --template <path>          Use custom report template (Phase 3.4)
  --config <path>            Export configuration file (default: config/export-config.json)
  --generate-fixes           Generate C# code fixes for accessibility issues (Phase 3.5)
  --help, -h                 Show this help message

Examples:
  # Basic audit (static analysis only)
  node bin/audit.js /path/to/unity-project

  # Audit with Unity batch mode screenshot capture
  node bin/audit.js /path/to/unity-project --capture-screenshots --unity-path "C:/Unity/Editor/Unity.exe"

  # Audit with external capture (Phase 4) - automatically uses navigation map if available
  node bin/audit.js /path/to/unity-project --capture-screenshots --application "C:/Program Files/MyApp/MyApp.exe"

  # Generate stakeholder communication templates
  node bin/audit.js /path/to/unity-project --stakeholder-docs

  # Create compliance baseline
  node bin/audit.js /path/to/unity-project --baseline

  # Track compliance and fail on regression (CI/CD)
  node bin/audit.js /path/to/unity-project --track-compliance --fail-on-regression

  # Full audit with PDF and CSV export
  node bin/audit.js /path/to/unity-project --capture-screenshots --export-pdf --export-csv

  # Create GitHub issues for findings
  node bin/audit.js /path/to/unity-project --create-issues github --config config/export-config.json

  # Use custom report template
  node bin/audit.js /path/to/unity-project --template templates/audit/custom/executive-summary.template.md

  # Generate code fixes for accessibility issues
  node bin/audit.js /path/to/unity-project --generate-fixes

  # Full audit with all features (Phase 4)
  node bin/audit.js /path/to/unity-project --capture-screenshots --application "C:/Program Files/MyApp/MyApp.exe" --track-compliance --export-pdf --export-csv --generate-fixes --stakeholder-docs --verbose

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
    captureScreenshots: false,
    analyzeVisual: false,
    unityPath: null,
    application: null,
    baseline: false,
    trackCompliance: false,
    failOnRegression: false,
    exportPDF: false,
    exportCSV: false,
    createIssues: null,
    template: null,
    config: null,
    generateFixes: false,
    generateStakeholderDocs: false
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
    } else if (arg === '--application' && args[i + 1]) {
      options.application = args[i + 1];
      i++;
    } else if (arg === '--capture-screenshots') {
      options.captureScreenshots = true;
    } else if (arg === '--analyze-visual') {
      options.analyzeVisual = true;
    } else if (arg === '--verbose') {
      options.verbose = true;
    } else if (arg === '--stakeholder-docs') {
      options.generateStakeholderDocs = true;
    } else if (arg === '--baseline') {
      options.baseline = true;
      options.trackCompliance = true; // Baseline implies tracking
    } else if (arg === '--track-compliance') {
      options.trackCompliance = true;
    } else if (arg === '--fail-on-regression') {
      options.failOnRegression = true;
    } else if (arg === '--export-pdf') {
      options.exportPDF = true;
    } else if (arg === '--export-csv') {
      options.exportCSV = true;
    } else if (arg === '--create-issues' && args[i + 1]) {
      options.createIssues = args[i + 1];
      i++;
    } else if (arg === '--template' && args[i + 1]) {
      options.template = args[i + 1];
      i++;
    } else if (arg === '--config' && args[i + 1]) {
      options.config = args[i + 1];
      i++;
    } else if (arg === '--generate-fixes') {
      options.generateFixes = true;
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
    application: options.application,
    baseline: options.baseline,
    trackCompliance: options.trackCompliance,
    failOnRegression: options.failOnRegression,
    exportPDF: options.exportPDF,
    exportCSV: options.exportCSV,
    createIssues: options.createIssues,
    template: options.template,
    config: options.config,
    generateFixes: options.generateFixes,
    generateStakeholderDocs: options.generateStakeholderDocs
  });

  await auditor.run();
}

// Run if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}

export { AccessibilityAuditor };
