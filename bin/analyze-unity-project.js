#!/usr/bin/env node

/**
 * Unity Project Accessibility Analyzer
 *
 * Scans a Unity project directory and detects accessibility patterns,
 * violations, and generates structured findings for audit reports.
 *
 * Usage:
 *   node bin/analyze-unity-project.js <unity-project-path>
 *
 * Output:
 *   JSON file with categorized findings
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { KeyboardAnalyzer } from './pattern-detectors/keyboard-analyzer.js';
import { UIToolkitAnalyzer } from './pattern-detectors/ui-toolkit-analyzer.js';
import { XRAccessibilityAnalyzer } from './pattern-detectors/xr-accessibility-analyzer.js';

// Phase 1: Visual Analysis Tools
import { analyzeTextContrast } from './analyze-text-contrast.js';

// Phase 2: Semantic Analysis Tools
import { analyzeSceneTitles } from './analyze-scene-titles.js';
import { analyzeHeadingsAndLabels } from './analyze-headings-labels.js';
import { analyzeFocusOrder } from './analyze-focus-order.js';
import { analyzeConsistentNavigation } from './analyze-consistent-navigation.js';
import { analyzeConsistentIdentification } from './analyze-consistent-identification.js';
import { testTextResize } from './test-text-resize.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// CONFIGURATION
// ============================================================================

const ACCESSIBILITY_COMPONENTS = [
  'DepthCueManager',
  'AccessibleStylusButton',
  'KeyboardStylusAlternative',
  'ZSpaceFocusIndicator',
  'SubtitleSystem',
  'VoiceCommandManager',
  'StylusHapticFeedback',
  'AccessibleZSpaceMenu',
  'SpatialAudioManager',
  'Accessible3DObject'
];

const WCAG_PATTERNS = {
  keyboard: {
    positive: ['Input.GetKey', 'Input.GetKeyDown', 'KeyCode', 'GetButtonDown'],
    negative: ['stylus-only', 'pointer-only']
  },
  screenReader: {
    positive: ['AccessibilityManager', 'AccessibleLabel', 'NVDA', 'Narrator'],
    negative: []
  },
  contrast: {
    positive: ['ContrastChecker', 'contrast validation'],
    negative: []
  }
};

// ============================================================================
// MAIN ANALYZER CLASS
// ============================================================================

class UnityProjectAnalyzer {
  constructor(projectPath) {
    this.projectPath = path.resolve(projectPath);
    this.findings = {
      critical: [],
      high: [],
      medium: [],
      low: []
    };
    this.statistics = {
      totalScenes: 0,
      totalScripts: 0,
      totalUIElements: 0,
      accessibilityComponentsFound: 0,
      keyboardSupportFound: false,
      screenReaderSupportFound: false,
      focusIndicatorsFound: false
    };
    this.scenes = [];
    this.scripts = [];

    // Phase 1 & 2 results
    this.phase1Results = {
      textContrast: null
    };
    this.phase2Results = {
      sceneTitles: null,
      headingsLabels: null,
      focusOrder: null,
      consistentNavigation: null,
      consistentIdentification: null,
      textResize: null
    };
  }

  /**
   * Main analysis entry point
   */
  async analyze() {
    console.log(`🔍 Analyzing Unity project: ${this.projectPath}`);

    // Validate project path
    if (!this.validateProjectStructure()) {
      throw new Error('Invalid Unity project structure');
    }

    // Original analysis
    await this.scanScenes();
    await this.scanScripts();
    await this.detectAccessibilityPatterns();
    await this.generateFindings();

    // Phase 1: Visual Analysis
    await this.runPhase1Analysis();

    // Phase 2: Semantic Analysis
    await this.runPhase2Analysis();

    // Merge all findings
    await this.mergePhasedFindings();

    return this.generateReport();
  }

  /**
   * Validate Unity project structure
   */
  validateProjectStructure() {
    const assetsPath = path.join(this.projectPath, 'Assets');
    const projectSettingsPath = path.join(this.projectPath, 'ProjectSettings');

    if (!fs.existsSync(assetsPath)) {
      console.error('❌ Assets/ directory not found');
      return false;
    }

    if (!fs.existsSync(projectSettingsPath)) {
      console.warn('⚠️  ProjectSettings/ directory not found (may be valid for some setups)');
    }

    console.log('✅ Valid Unity project structure detected');
    return true;
  }

  /**
   * Scan all Unity scenes
   */
  async scanScenes() {
    console.log('📁 Scanning Unity scenes...');
    const assetsPath = path.join(this.projectPath, 'Assets');
    const sceneFiles = this.findFilesRecursive(assetsPath, '.unity');

    this.scenes = sceneFiles.map(scenePath => {
      const relativePath = path.relative(this.projectPath, scenePath);
      const sceneName = path.basename(scenePath, '.unity');
      return {
        name: sceneName,
        path: relativePath,
        fullPath: scenePath
      };
    });

    this.statistics.totalScenes = this.scenes.length;
    console.log(`   Found ${this.scenes.length} scenes`);
  }

  /**
   * Scan all C# scripts
   */
  async scanScripts() {
    console.log('📄 Scanning C# scripts...');
    const assetsPath = path.join(this.projectPath, 'Assets');
    const scriptFiles = this.findFilesRecursive(assetsPath, '.cs');

    this.scripts = scriptFiles.map(scriptPath => {
      const relativePath = path.relative(this.projectPath, scriptPath);
      const scriptName = path.basename(scriptPath, '.cs');
      const content = fs.readFileSync(scriptPath, 'utf-8');

      return {
        name: scriptName,
        path: relativePath,
        fullPath: scriptPath,
        content: content,
        lines: content.split('\n').length
      };
    });

    this.statistics.totalScripts = this.scripts.length;
    console.log(`   Found ${this.scripts.length} C# scripts`);
  }

  /**
   * Detect accessibility patterns in code
   */
  async detectAccessibilityPatterns() {
    console.log('🔎 Detecting accessibility patterns...');

    // Legacy pattern detection (keeping for backward compatibility)
    this.detectAccessibilityComponents();
    this.detectScreenReaderSupport();
    this.detectFocusIndicators();

    // Phase 3.1: Advanced Pattern Detection with specialized analyzers
    await this.runAdvancedPatternDetection();
  }

  /**
   * Run advanced pattern detection (Phase 3.1)
   */
  async runAdvancedPatternDetection() {
    console.log('🚀 Running advanced pattern detection (Phase 3.1)...');

    // Keyboard accessibility analysis
    const keyboardAnalyzer = new KeyboardAnalyzer(this.scripts);
    const keyboardResults = keyboardAnalyzer.analyze();

    // Merge keyboard statistics
    this.statistics.keyboardSupportFound = keyboardResults.statistics.keyboardSupportFound;
    this.statistics.keyboardSupportScripts = keyboardResults.statistics.scriptsWithKeyboardSupport.map(s => s.name);
    this.statistics.stylusOnlyScripts = keyboardResults.statistics.scriptsWithoutKeyboardSupport.map(s => s.name);
    this.statistics.inputSystemUsed = keyboardResults.statistics.inputSystemUsed;
    this.statistics.eventSystemConfigured = keyboardResults.statistics.eventSystemConfigured;
    this.statistics.focusManagementFound = keyboardResults.statistics.focusManagementFound;
    this.statistics.keyboardConfidenceScore = keyboardResults.statistics.confidenceScore;

    // Merge keyboard findings
    keyboardResults.findings.forEach(finding => {
      this.addFinding(finding);
    });

    // UI Toolkit accessibility analysis
    const uiToolkitAnalyzer = new UIToolkitAnalyzer(this.projectPath, this.scripts);
    const uiToolkitResults = uiToolkitAnalyzer.analyze();

    // Merge UI Toolkit statistics
    this.statistics.uiToolkitUsed = uiToolkitResults.statistics.uiToolkitUsed;
    this.statistics.uxmlFilesFound = uiToolkitResults.statistics.uxmlFilesFound;
    this.statistics.ussFilesFound = uiToolkitResults.statistics.ussFilesFound;
    this.statistics.uiToolkitConfidenceScore = uiToolkitResults.statistics.confidenceScore;

    // Merge UI Toolkit findings
    uiToolkitResults.findings.forEach(finding => {
      this.addFinding(finding);
    });

    // XR accessibility analysis
    const xrAnalyzer = new XRAccessibilityAnalyzer(this.scripts);
    const xrResults = xrAnalyzer.analyze();

    // Merge XR statistics
    this.statistics.xrUsed = xrResults.statistics.xrUsed;
    this.statistics.xrSdks = xrResults.statistics.xrSdks;
    this.statistics.xrInputMethods = xrResults.statistics.inputMethods;
    this.statistics.xrAlternativeInputs = xrResults.statistics.alternativeInputsAvailable;
    this.statistics.xrMissingAlternatives = xrResults.statistics.missingAlternatives;
    this.statistics.xrConfidenceScore = xrResults.statistics.confidenceScore;

    // Merge XR findings
    xrResults.findings.forEach(finding => {
      this.addFinding(finding);
    });

    console.log('   ✅ Advanced pattern detection complete');
  }

  /**
   * Add finding to appropriate severity category
   */
  addFinding(finding) {
    const severity = finding.severity || 'medium';

    // Map severity to category
    if (severity === 'critical') {
      this.findings.critical.push(finding);
    } else if (severity === 'high') {
      this.findings.high.push(finding);
    } else if (severity === 'medium') {
      this.findings.medium.push(finding);
    } else if (severity === 'low' || severity === 'info') {
      this.findings.low.push(finding);
    }
  }

  /**
   * Detect accessibility component usage
   */
  detectAccessibilityComponents() {
    let foundComponents = new Set();

    this.scripts.forEach(script => {
      ACCESSIBILITY_COMPONENTS.forEach(component => {
        if (script.content.includes(component)) {
          foundComponents.add(component);
        }
      });
    });

    this.statistics.accessibilityComponentsFound = foundComponents.size;
    this.statistics.foundComponents = Array.from(foundComponents);

    if (foundComponents.size === 0) {
      console.log('   ❌ No accessibility components found');
    } else {
      console.log(`   ✅ Found ${foundComponents.size} accessibility components`);
    }
  }

  /**
   * Detect keyboard support patterns (DEPRECATED - replaced by KeyboardAnalyzer in Phase 3.1)
   * Kept for backward compatibility but no longer used in analysis
   */
  detectKeyboardSupport() {
    // This method is deprecated and replaced by KeyboardAnalyzer
    // See runAdvancedPatternDetection() for new implementation
  }

  /**
   * Detect screen reader support
   */
  detectScreenReaderSupport() {
    let screenReaderScripts = [];

    this.scripts.forEach(script => {
      let hasScreenReaderSupport = false;

      WCAG_PATTERNS.screenReader.positive.forEach(pattern => {
        if (script.content.includes(pattern)) {
          hasScreenReaderSupport = true;
        }
      });

      if (hasScreenReaderSupport) {
        screenReaderScripts.push(script.name);
      }
    });

    this.statistics.screenReaderSupportFound = screenReaderScripts.length > 0;
    this.statistics.screenReaderSupportScripts = screenReaderScripts;

    if (screenReaderScripts.length > 0) {
      console.log(`   ✅ Screen reader support found in ${screenReaderScripts.length} scripts`);
    } else {
      console.log('   ❌ No screen reader support patterns detected');
    }
  }

  /**
   * Detect focus indicator implementation
   */
  detectFocusIndicators() {
    let focusScripts = [];

    this.scripts.forEach(script => {
      if (script.content.includes('ZSpaceFocusIndicator') ||
          script.content.includes('focus') && script.content.includes('indicator') ||
          script.content.includes('outline') && script.content.includes('focused')) {
        focusScripts.push(script.name);
      }
    });

    this.statistics.focusIndicatorsFound = focusScripts.length > 0;
    this.statistics.focusIndicatorScripts = focusScripts;

    if (focusScripts.length > 0) {
      console.log(`   ✅ Focus indicators found in ${focusScripts.length} scripts`);
    } else {
      console.log('   ❌ No focus indicator patterns detected');
    }
  }

  /**
   * Detect input handling patterns (DEPRECATED - replaced by XRAccessibilityAnalyzer in Phase 3.1)
   * Kept for backward compatibility but no longer used in analysis
   */
  detectInputPatterns() {
    // This method is deprecated and replaced by XRAccessibilityAnalyzer
    // See runAdvancedPatternDetection() for new implementation
  }

  /**
   * Generate findings based on detected patterns
   */
  async generateFindings() {
    console.log('📊 Generating findings...');

    // No keyboard alternatives detected
    if (!this.statistics.keyboardSupportFound ||
        (this.statistics.stylusOnlyScripts && this.statistics.stylusOnlyScripts.length > 0)) {
      this.findings.critical.push({
        id: 'WCAG-2.1.1',
        title: 'No Keyboard Alternatives for Stylus Interactions',
        wcagLevel: 'A',
        severity: 'High',
        description: 'No keyboard input patterns detected in codebase analysis. Application may rely solely on stylus and mouse input.',
        files: this.statistics.stylusOnlyScripts || [],
        impact: 'Users unable to use pointing devices will be unable to access functionality',
        recommendation: 'Implement keyboard alternatives for all stylus and mouse interactions'
      });
    }

    // No depth perception alternatives detected
    if (!this.statistics.foundComponents ||
        !this.statistics.foundComponents.includes('DepthCueManager')) {
      this.findings.critical.push({
        id: 'XAUR-UN17',
        title: 'No Depth Perception Alternatives',
        wcagLevel: 'W3C XAUR',
        severity: 'High',
        description: 'No depth cue system detected in codebase analysis. zSpace applications require alternatives for users who cannot perceive stereoscopic 3D.',
        files: [],
        impact: 'Users with stereoblindness or monocular vision (10-15% of population) may be unable to perceive spatial information',
        recommendation: 'Implement multiple depth cues: relative size scaling, shadows, spatial audio, haptic feedback'
      });
    }

    // No assistive technology support detected
    if (!this.statistics.screenReaderSupportFound) {
      this.findings.critical.push({
        id: 'WCAG-4.1.2',
        title: 'No Assistive Technology API Implementation',
        wcagLevel: 'A',
        severity: 'High',
        description: 'No Unity Accessibility API patterns detected in codebase analysis. UI elements may lack programmatic information for assistive technologies.',
        files: [],
        impact: 'Assistive technology users may be unable to identify interactive elements, read labels, or perceive state changes',
        recommendation: 'Implement Unity Accessibility API to expose name, role, and value information to assistive technologies'
      });
    }

    // No focus indicators detected
    if (!this.statistics.focusIndicatorsFound) {
      this.findings.critical.push({
        id: 'WCAG-2.4.7',
        title: 'No Focus Indicator Implementation',
        wcagLevel: 'AA',
        severity: 'High',
        description: 'No focus indicator patterns detected in codebase analysis. Keyboard users (if keyboard support is added) will need visual feedback for focused elements.',
        files: [],
        impact: 'Keyboard navigation requires visible focus indicators with minimum 3:1 contrast ratio',
        recommendation: 'Implement focus indicators with visual, audio, and haptic feedback for all focusable elements'
      });
    }

    // HIGH: Missing accessibility components
    const missingComponents = ACCESSIBILITY_COMPONENTS.filter(
      comp => !this.statistics.foundComponents || !this.statistics.foundComponents.includes(comp)
    );

    if (missingComponents.length > 0) {
      this.findings.high.push({
        id: 'FRAMEWORK-COMPONENTS',
        title: 'Missing Accessibility Framework Components',
        severity: 'HIGH',
        description: `${missingComponents.length} accessibility components from the framework are not implemented.`,
        files: [],
        impact: 'Reduced accessibility for multiple user groups',
        recommendation: `Implement missing components: ${missingComponents.join(', ')}`
      });
    }

    console.log(`   ✅ Generated ${this.getTotalFindings()} findings`);
  }

  /**
   * Run Phase 1 Visual Analysis Tools
   */
  async runPhase1Analysis() {
    console.log('\n📸 Phase 1: Visual Analysis (WCAG 2.2 Level AA)...');

    try {
      // Check if screenshots exist
      const screenshotDir = path.join(this.projectPath, 'AccessibilityAudit', 'screenshots');

      if (fs.existsSync(screenshotDir)) {
        console.log('   Running text contrast analysis...');
        this.phase1Results.textContrast = await analyzeTextContrast(screenshotDir);
        console.log(`   ✅ Text contrast: ${this.phase1Results.textContrast.length} findings`);
      } else {
        console.log('   ⚠️  Screenshots not found. Skipping visual analysis.');
        console.log('      Run with --capture-screenshots to enable visual analysis.');
      }
    } catch (error) {
      console.warn(`   ⚠️  Phase 1 analysis error: ${error.message}`);
      this.phase1Results.textContrast = [];
    }
  }

  /**
   * Run Phase 2 Semantic Analysis Tools
   */
  async runPhase2Analysis() {
    console.log('\n🔍 Phase 2: Semantic Analysis (WCAG 2.2 Level A/AA)...');

    try {
      // Item 7: [2.4.2] Page Titled
      console.log('   Analyzing scene titles...');
      this.phase2Results.sceneTitles = await analyzeSceneTitles(this.projectPath);
      console.log(`   ✅ Scene titles: ${this.phase2Results.sceneTitles.length} findings`);

      // Item 8: [2.4.6] Headings and Labels
      console.log('   Analyzing headings and labels...');
      this.phase2Results.headingsLabels = await analyzeHeadingsAndLabels(this.projectPath);
      console.log(`   ✅ Headings/labels: ${this.phase2Results.headingsLabels.length} findings`);

      // Item 11: [2.4.3] Focus Order
      console.log('   Analyzing focus order...');
      this.phase2Results.focusOrder = await analyzeFocusOrder(this.projectPath);
      console.log(`   ✅ Focus order: ${this.phase2Results.focusOrder.length} findings`);

      // Item 9: [3.2.3] Consistent Navigation
      console.log('   Analyzing consistent navigation...');
      this.phase2Results.consistentNavigation = await analyzeConsistentNavigation(this.projectPath);
      console.log(`   ✅ Consistent navigation: ${this.phase2Results.consistentNavigation.length} findings`);

      // Item 10: [3.2.4] Consistent Identification
      console.log('   Analyzing consistent identification...');
      this.phase2Results.consistentIdentification = await analyzeConsistentIdentification(this.projectPath);
      console.log(`   ✅ Consistent identification: ${this.phase2Results.consistentIdentification.length} findings`);

      // Item 12: [1.4.4] Resize Text
      console.log('   Testing text resize...');
      this.phase2Results.textResize = await testTextResize(this.projectPath);
      console.log(`   ✅ Text resize: ${this.phase2Results.textResize.length} findings`);

    } catch (error) {
      console.warn(`   ⚠️  Phase 2 analysis error: ${error.message}`);
      // Initialize empty results for failed analyses
      if (!this.phase2Results.sceneTitles) this.phase2Results.sceneTitles = [];
      if (!this.phase2Results.headingsLabels) this.phase2Results.headingsLabels = [];
      if (!this.phase2Results.focusOrder) this.phase2Results.focusOrder = [];
      if (!this.phase2Results.consistentNavigation) this.phase2Results.consistentNavigation = [];
      if (!this.phase2Results.consistentIdentification) this.phase2Results.consistentIdentification = [];
      if (!this.phase2Results.textResize) this.phase2Results.textResize = [];
    }
  }

  /**
   * Merge Phase 1 and Phase 2 findings into main findings list
   */
  async mergePhasedFindings() {
    console.log('\n🔗 Merging Phase 1 & 2 findings...');

    let merged = 0;

    // Merge Phase 1 findings
    if (this.phase1Results.textContrast && Array.isArray(this.phase1Results.textContrast)) {
      for (const finding of this.phase1Results.textContrast) {
        this.addFinding(finding);
        merged++;
      }
    }

    // Merge Phase 2 findings
    const phase2Arrays = [
      this.phase2Results.sceneTitles,
      this.phase2Results.headingsLabels,
      this.phase2Results.focusOrder,
      this.phase2Results.consistentNavigation,
      this.phase2Results.consistentIdentification,
      this.phase2Results.textResize
    ];

    for (const findingsArray of phase2Arrays) {
      if (findingsArray && Array.isArray(findingsArray)) {
        for (const finding of findingsArray) {
          this.addFinding(finding);
          merged++;
        }
      }
    }

    console.log(`   ✅ Merged ${merged} findings from Phase 1 & 2`);
  }

  /**
   * Add a finding to the appropriate severity category
   */
  addFinding(finding) {
    // Skip info and error level findings
    if (finding.severity === 'info' || finding.severity === 'error') {
      return;
    }

    // Map finding to our structure
    const standardizedFinding = {
      wcagCriterion: finding.wcagCriterion || 'Unknown',
      wcagLevel: finding.level || 'AA',
      severity: finding.severity || 'medium',
      title: finding.issue || 'Accessibility Issue',
      description: finding.explanation || finding.issue || '',
      recommendation: finding.recommendation || '',
      location: finding.scene || finding.scenePath || finding.element || 'Unknown',
      howToFix: finding.howToFix || [],
      category: this.getCategoryFromCriterion(finding.wcagCriterion),
      automated: true, // Mark as automated finding
      source: finding.source || 'Phase 1/2 Analysis'
    };

    // Add to appropriate severity category
    const severityMap = {
      'critical': this.findings.critical,
      'high': this.findings.high,
      'medium': this.findings.medium,
      'low': this.findings.low
    };

    const targetArray = severityMap[finding.severity] || this.findings.medium;
    targetArray.push(standardizedFinding);
  }

  /**
   * Get category from WCAG criterion
   */
  getCategoryFromCriterion(criterion) {
    if (!criterion) return 'General';

    const criterionMap = {
      '1.4.3': 'Visual Design',
      '1.4.11': 'Visual Design',
      '1.4.1': 'Visual Design',
      '1.4.4': 'Visual Design',
      '1.4.5': 'Visual Design',
      '2.4.2': 'Navigation',
      '2.4.3': 'Navigation',
      '2.4.6': 'Content Structure',
      '2.5.8': 'Input Modalities',
      '2.3.1': 'Visual Design',
      '3.2.3': 'Navigation',
      '3.2.4': 'Navigation'
    };

    return criterionMap[criterion] || 'General';
  }

  /**
   * Generate final report
   */
  generateReport() {
    const appName = path.basename(this.projectPath);

    const report = {
      metadata: {
        appName: appName,
        projectPath: this.projectPath,
        scannedDate: new Date().toISOString().split('T')[0],
        analyzer: 'accessibility-standards-unity',
        version: '3.3.0-phase2',
        phases: {
          phase1: 'Visual Analysis - 1 item (85% automation)',
          phase2: 'Semantic Analysis - 6 items (75% avg automation)'
        }
      },
      summary: {
        totalScenes: this.statistics.totalScenes,
        totalScripts: this.statistics.totalScripts,
        totalFindings: this.getTotalFindings(),
        criticalIssues: this.findings.critical.length,
        highPriorityIssues: this.findings.high.length,
        mediumPriorityIssues: this.findings.medium.length,
        lowPriorityIssues: this.findings.low.length,
        automatedAnalysis: {
          phase1Criteria: 1,
          phase2Criteria: 6,
          totalAutomated: 7
        }
      },
      scenes: this.scenes,
      statistics: this.statistics,
      findings: this.findings,
      phase1Results: this.phase1Results,
      phase2Results: this.phase2Results,
      complianceEstimate: this.calculateComplianceScore()
    };

    return report;
  }

  /**
   * Calculate estimated compliance score
   */
  calculateComplianceScore() {
    // Simple heuristic based on critical issues
    let score = 100;

    score -= this.findings.critical.length * 15;
    score -= this.findings.high.length * 8;
    score -= this.findings.medium.length * 3;

    score = Math.max(0, Math.min(100, score));

    let level = 'Non-Conformant';
    if (score >= 90) level = 'Full Conformance';
    else if (score >= 70) level = 'Partial Conformance';
    else if (score >= 50) level = 'Minimal Conformance';

    return {
      score: score,
      level: level,
      wcagLevelA: this.findings.critical.filter(f => f.wcagLevel === 'A').length === 0,
      wcagLevelAA: this.findings.critical.filter(f => f.wcagLevel === 'AA').length === 0
    };
  }

  /**
   * Get total findings count
   */
  getTotalFindings() {
    return this.findings.critical.length +
           this.findings.high.length +
           this.findings.medium.length +
           this.findings.low.length;
  }

  /**
   * Recursively find files with specific extension
   */
  findFilesRecursive(dir, extension) {
    let results = [];

    if (!fs.existsSync(dir)) {
      return results;
    }

    const files = fs.readdirSync(dir);

    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        // Skip common Unity directories that don't need scanning
        if (!file.startsWith('.') &&
            file !== 'Library' &&
            file !== 'Temp' &&
            file !== 'obj' &&
            file !== 'Build') {
          results = results.concat(this.findFilesRecursive(filePath, extension));
        }
      } else if (file.endsWith(extension)) {
        results.push(filePath);
      }
    });

    return results;
  }
}

// ============================================================================
// CLI INTERFACE
// ============================================================================

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: node analyze-unity-project.js <unity-project-path>');
    process.exit(1);
  }

  const projectPath = args[0];

  try {
    const analyzer = new UnityProjectAnalyzer(projectPath);
    const report = await analyzer.analyze();

    // Output JSON report
    const outputPath = path.join(projectPath, 'accessibility-analysis.json');
    fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));

    console.log('\n✅ Analysis complete!');
    console.log(`📄 Report saved to: ${outputPath}`);
    console.log('\n📊 Summary:');
    console.log(`   Scenes: ${report.summary.totalScenes}`);
    console.log(`   Scripts: ${report.summary.totalScripts}`);
    console.log(`   Critical Issues: ${report.summary.criticalIssues}`);
    console.log(`   High Priority Issues: ${report.summary.highPriorityIssues}`);
    console.log(`   Compliance Score: ${report.complianceEstimate.score}% (${report.complianceEstimate.level})`);

  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}

export { UnityProjectAnalyzer };
