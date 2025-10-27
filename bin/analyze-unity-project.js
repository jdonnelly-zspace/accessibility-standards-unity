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

    // Scan project
    await this.scanScenes();
    await this.scanScripts();
    await this.detectAccessibilityPatterns();
    await this.generateFindings();

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

    // Check for accessibility components
    this.detectAccessibilityComponents();

    // Check for keyboard support
    this.detectKeyboardSupport();

    // Check for screen reader support
    this.detectScreenReaderSupport();

    // Check for focus indicators
    this.detectFocusIndicators();

    // Check for input handling patterns
    this.detectInputPatterns();
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
   * Detect keyboard support patterns
   */
  detectKeyboardSupport() {
    let keyboardScripts = [];

    this.scripts.forEach(script => {
      let hasKeyboardSupport = false;

      WCAG_PATTERNS.keyboard.positive.forEach(pattern => {
        if (script.content.includes(pattern)) {
          hasKeyboardSupport = true;
        }
      });

      if (hasKeyboardSupport) {
        keyboardScripts.push(script.name);
      }
    });

    this.statistics.keyboardSupportFound = keyboardScripts.length > 0;
    this.statistics.keyboardSupportScripts = keyboardScripts;

    if (keyboardScripts.length > 0) {
      console.log(`   ✅ Keyboard support found in ${keyboardScripts.length} scripts`);
    } else {
      console.log('   ❌ No keyboard support patterns detected');
    }
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
   * Detect input handling patterns
   */
  detectInputPatterns() {
    let stylusOnly = [];
    let hasAlternatives = [];

    this.scripts.forEach(script => {
      const hasStylus = script.content.includes('stylus') ||
                        script.content.includes('ZPointer') ||
                        script.content.includes('zSpace.Core');

      const hasKeyboard = script.content.includes('Input.GetKey') ||
                          script.content.includes('KeyCode');

      const hasMouse = script.content.includes('Input.mouse') ||
                       script.content.includes('GetMouseButton');

      if (hasStylus && !hasKeyboard && !hasMouse) {
        stylusOnly.push(script.name);
      } else if (hasStylus && (hasKeyboard || hasMouse)) {
        hasAlternatives.push(script.name);
      }
    });

    this.statistics.stylusOnlyScripts = stylusOnly;
    this.statistics.multiInputScripts = hasAlternatives;

    if (stylusOnly.length > 0) {
      console.log(`   ⚠️  ${stylusOnly.length} scripts are stylus-only (WCAG 2.1.1 violation)`);
    }
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
        version: '2.2.0'
      },
      summary: {
        totalScenes: this.statistics.totalScenes,
        totalScripts: this.statistics.totalScripts,
        totalFindings: this.getTotalFindings(),
        criticalIssues: this.findings.critical.length,
        highPriorityIssues: this.findings.high.length,
        mediumPriorityIssues: this.findings.medium.length,
        lowPriorityIssues: this.findings.low.length
      },
      scenes: this.scenes,
      statistics: this.statistics,
      findings: this.findings,
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
