#!/usr/bin/env node

/**
 * Contrast Analyzer
 *
 * Analyzes UI component color properties extracted from Unity scenes
 * and calculates WCAG contrast ratios for accessibility compliance.
 *
 * Part of the zSpace Accessibility Standards Unity Framework v3.1.0.
 *
 * Features:
 * - Parse Unity UI component color data
 * - Calculate foreground/background contrast ratios
 * - Validate against WCAG 2.1 standards
 * - Generate per-scene contrast reports
 * - Integration with visual accessibility analysis
 *
 * Usage:
 *   node contrast-analyzer.js <project-path> [options]
 *
 * Options:
 *   --output-dir <path>       Output directory for reports (default: AccessibilityAudit)
 *   --min-ratio <number>      Minimum acceptable contrast ratio (default: 4.5)
 *   --verbose                 Enable verbose logging
 *
 * Example:
 *   node contrast-analyzer.js "C:\MyUnityProject" --min-ratio 4.5
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// WCAG 2.1 Contrast Requirements
const WCAG_STANDARDS = {
  LEVEL_AA: {
    NORMAL_TEXT: 4.5,    // 14pt regular or smaller
    LARGE_TEXT: 3.0,     // 18pt regular or 14pt bold
    UI_COMPONENTS: 3.0   // Graphical objects and UI components
  },
  LEVEL_AAA: {
    NORMAL_TEXT: 7.0,
    LARGE_TEXT: 4.5
  }
};

class ContrastAnalyzer {
  constructor(projectPath, options = {}) {
    this.projectPath = projectPath;
    this.options = {
      outputDir: options.outputDir || path.join(projectPath, 'AccessibilityAudit'),
      minRatio: options.minRatio || WCAG_STANDARDS.LEVEL_AA.NORMAL_TEXT,
      verbose: options.verbose || false
    };

    this.results = {
      totalComponents: 0,
      componentsAnalyzed: 0,
      passingComponents: 0,
      failingComponents: 0,
      scenes: {}
    };
  }

  log(message) {
    if (this.options.verbose) {
      console.log(message);
    }
  }

  /**
   * Parse color string in various formats
   * Supports: "RGBA(r, g, b, a)", "#RRGGBB", "rgb(r, g, b)"
   */
  parseColor(colorString) {
    if (!colorString) return null;

    // Unity RGBA format: "RGBA(1.000, 0.500, 0.250, 1.000)"
    const unityRgbaMatch = colorString.match(/RGBA?\(([0-9.]+),\s*([0-9.]+),\s*([0-9.]+)(?:,\s*([0-9.]+))?\)/i);
    if (unityRgbaMatch) {
      return {
        r: Math.round(parseFloat(unityRgbaMatch[1]) * 255),
        g: Math.round(parseFloat(unityRgbaMatch[2]) * 255),
        b: Math.round(parseFloat(unityRgbaMatch[3]) * 255),
        a: unityRgbaMatch[4] ? parseFloat(unityRgbaMatch[4]) : 1.0
      };
    }

    // Hex format: "#RRGGBB" or "#RRGGBBAA"
    const hexMatch = colorString.match(/^#([0-9A-F]{6})([0-9A-F]{2})?$/i);
    if (hexMatch) {
      const hex = hexMatch[1];
      return {
        r: parseInt(hex.substr(0, 2), 16),
        g: parseInt(hex.substr(2, 2), 16),
        b: parseInt(hex.substr(4, 2), 16),
        a: hexMatch[2] ? parseInt(hexMatch[2], 16) / 255 : 1.0
      };
    }

    // Standard RGB format: "rgb(r, g, b)"
    const rgbMatch = colorString.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/i);
    if (rgbMatch) {
      return {
        r: parseInt(rgbMatch[1]),
        g: parseInt(rgbMatch[2]),
        b: parseInt(rgbMatch[3]),
        a: 1.0
      };
    }

    return null;
  }

  /**
   * Calculate relative luminance from RGB values
   * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
   */
  calculateLuminance(r, g, b) {
    // Normalize RGB values to 0-1 range
    const [rs, gs, bs] = [r, g, b].map(val => {
      val = val / 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });

    // Calculate relative luminance
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  /**
   * Calculate WCAG contrast ratio between two colors
   * https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
   */
  calculateContrastRatio(color1, color2) {
    const lum1 = this.calculateLuminance(color1.r, color1.g, color1.b);
    const lum2 = this.calculateLuminance(color2.r, color2.g, color2.b);

    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);

    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * Determine WCAG compliance level for contrast ratio
   */
  getWCAGLevel(ratio, isLargeText = false) {
    const normalThreshold = isLargeText ? WCAG_STANDARDS.LEVEL_AA.LARGE_TEXT : WCAG_STANDARDS.LEVEL_AA.NORMAL_TEXT;
    const enhancedThreshold = isLargeText ? WCAG_STANDARDS.LEVEL_AAA.LARGE_TEXT : WCAG_STANDARDS.LEVEL_AAA.NORMAL_TEXT;

    if (ratio >= enhancedThreshold) return 'AAA';
    if (ratio >= normalThreshold) return 'AA';
    return 'Fail';
  }

  /**
   * Analyze a UI component's contrast
   */
  analyzeComponent(component, sceneName) {
    const foreground = this.parseColor(component.foregroundColor);
    const background = this.parseColor(component.backgroundColor);

    if (!foreground || !background) {
      this.log(`⚠️  Skipping ${component.name}: Unable to parse colors`);
      return null;
    }

    const ratio = this.calculateContrastRatio(foreground, background);
    const isLargeText = component.fontSize && component.fontSize >= 18;
    const wcagLevel = this.getWCAGLevel(ratio, isLargeText);
    const passes = ratio >= this.options.minRatio;

    this.results.componentsAnalyzed++;
    if (passes) {
      this.results.passingComponents++;
    } else {
      this.results.failingComponents++;
    }

    return {
      componentName: component.name,
      componentType: component.type || 'Unknown',
      scene: sceneName,
      foreground: {
        color: `rgb(${foreground.r}, ${foreground.g}, ${foreground.b})`,
        hex: `#${foreground.r.toString(16).padStart(2, '0')}${foreground.g.toString(16).padStart(2, '0')}${foreground.b.toString(16).padStart(2, '0')}`
      },
      background: {
        color: `rgb(${background.r}, ${background.g}, ${background.b})`,
        hex: `#${background.r.toString(16).padStart(2, '0')}${background.g.toString(16).padStart(2, '0')}${background.b.toString(16).padStart(2, '0')}`
      },
      contrastRatio: ratio.toFixed(2),
      wcagLevel: wcagLevel,
      passes: passes,
      isLargeText: isLargeText,
      recommendation: this.getRecommendation(ratio, isLargeText)
    };
  }

  /**
   * Get accessibility recommendation based on contrast ratio
   */
  getRecommendation(ratio, isLargeText) {
    const normalThreshold = isLargeText ? WCAG_STANDARDS.LEVEL_AA.LARGE_TEXT : WCAG_STANDARDS.LEVEL_AA.NORMAL_TEXT;

    if (ratio >= WCAG_STANDARDS.LEVEL_AAA.NORMAL_TEXT) {
      return 'Excellent contrast - exceeds all WCAG standards';
    } else if (ratio >= normalThreshold) {
      return 'Good contrast - meets WCAG Level AA';
    } else if (ratio >= WCAG_STANDARDS.LEVEL_AA.UI_COMPONENTS) {
      return 'Marginal - acceptable for UI components only, not text';
    } else {
      const needed = (normalThreshold / ratio).toFixed(2);
      return `Insufficient contrast - increase by ${needed}x to meet WCAG Level AA`;
    }
  }

  /**
   * Analyze all scenes in the project
   */
  async analyzeProject() {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  Contrast Analysis');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log(`📁 Project:       ${this.projectPath}`);
    console.log(`📊 Min Ratio:     ${this.options.minRatio}:1`);
    console.log('');

    // Look for extracted UI data
    const dataDir = path.join(this.options.outputDir, 'ui-data');
    if (!fs.existsSync(dataDir)) {
      console.log('⚠️  No UI data found. Run AccessibilityContentExtractor first.');
      console.log(`   Expected directory: ${dataDir}`);
      console.log('');
      return;
    }

    // Find all scene UI data files
    const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
    console.log(`Found ${files.length} scene(s) with UI data\n`);

    // Analyze each scene
    for (const file of files) {
      const sceneName = path.basename(file, '.json');
      const filePath = path.join(dataDir, file);

      this.log(`\nAnalyzing scene: ${sceneName}`);

      try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        this.analyzeScene(sceneName, data);
      } catch (error) {
        console.error(`❌ Error analyzing ${sceneName}:`, error.message);
      }
    }

    // Export results
    await this.exportResults();

    // Print summary
    this.printSummary();
  }

  /**
   * Analyze a single scene's UI components
   */
  analyzeScene(sceneName, sceneData) {
    if (!sceneData.uiComponents || sceneData.uiComponents.length === 0) {
      this.log(`  No UI components found`);
      return;
    }

    const sceneResults = {
      sceneName: sceneName,
      totalComponents: sceneData.uiComponents.length,
      passingComponents: 0,
      failingComponents: 0,
      components: []
    };

    for (const component of sceneData.uiComponents) {
      this.results.totalComponents++;

      const analysis = this.analyzeComponent(component, sceneName);
      if (analysis) {
        sceneResults.components.push(analysis);
        if (analysis.passes) {
          sceneResults.passingComponents++;
        } else {
          sceneResults.failingComponents++;
        }
      }
    }

    this.results.scenes[sceneName] = sceneResults;
    this.log(`  Analyzed ${sceneResults.totalComponents} components (${sceneResults.failingComponents} issues)`);
  }

  /**
   * Export analysis results to JSON
   */
  async exportResults() {
    const reportPath = path.join(this.options.outputDir, 'contrast-analysis.json');

    const report = {
      metadata: {
        frameworkVersion: '3.1.0-phase2',
        analysisDate: new Date().toISOString(),
        projectPath: this.projectPath,
        minContrastRatio: this.options.minRatio,
        wcagStandards: WCAG_STANDARDS
      },
      summary: {
        totalComponents: this.results.totalComponents,
        componentsAnalyzed: this.results.componentsAnalyzed,
        passingComponents: this.results.passingComponents,
        failingComponents: this.results.failingComponents,
        complianceRate: this.results.componentsAnalyzed > 0
          ? ((this.results.passingComponents / this.results.componentsAnalyzed) * 100).toFixed(1) + '%'
          : '0%'
      },
      scenes: this.results.scenes
    };

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Report saved: ${reportPath}`);
  }

  /**
   * Print analysis summary
   */
  printSummary() {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  Contrast Analysis Summary');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log(`Total Components:      ${this.results.totalComponents}`);
    console.log(`Components Analyzed:   ${this.results.componentsAnalyzed}`);
    console.log(`Passing:               ${this.results.passingComponents} ✓`);
    console.log(`Failing:               ${this.results.failingComponents} ✗`);
    console.log('');

    if (this.results.componentsAnalyzed > 0) {
      const complianceRate = ((this.results.passingComponents / this.results.componentsAnalyzed) * 100).toFixed(1);
      console.log(`Compliance Rate: ${complianceRate}%`);
      console.log('');

      if (this.results.failingComponents === 0) {
        console.log('✅ All components meet contrast requirements!');
      } else {
        console.log('⚠️  Some components have insufficient contrast.');
        console.log('   Review the contrast-analysis.json for details.');
      }
    } else {
      console.log('⚠️  No components analyzed. Check UI data extraction.');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);

  const config = {
    projectPath: null,
    outputDir: null,
    minRatio: WCAG_STANDARDS.LEVEL_AA.NORMAL_TEXT,
    verbose: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--output-dir' && i + 1 < args.length) {
      config.outputDir = args[++i];
    } else if (arg === '--min-ratio' && i + 1 < args.length) {
      config.minRatio = parseFloat(args[++i]);
    } else if (arg === '--verbose') {
      config.verbose = true;
    } else if (arg === '--help') {
      printHelp();
      process.exit(0);
    } else if (!arg.startsWith('--') && !config.projectPath) {
      config.projectPath = arg;
    }
  }

  return config;
}

function printHelp() {
  console.log('Usage: node contrast-analyzer.js <project-path> [options]');
  console.log('');
  console.log('Options:');
  console.log('  --output-dir <path>       Output directory for reports (default: <project>/AccessibilityAudit)');
  console.log('  --min-ratio <number>      Minimum acceptable contrast ratio (default: 4.5)');
  console.log('  --verbose                 Enable verbose logging');
  console.log('  --help                    Show this help message');
  console.log('');
  console.log('Example:');
  console.log('  node contrast-analyzer.js "C:\\MyUnityProject" --min-ratio 4.5');
}

// Main execution
async function main() {
  const config = parseArgs();

  if (!config.projectPath) {
    console.error('Error: Project path is required\n');
    printHelp();
    process.exit(1);
  }

  // Set default output directory if not specified
  if (!config.outputDir) {
    config.outputDir = path.join(config.projectPath, 'AccessibilityAudit');
  }

  const analyzer = new ContrastAnalyzer(config.projectPath, config);

  try {
    await analyzer.analyzeProject();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Analysis failed:', error.message);
    if (config.verbose) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { ContrastAnalyzer, WCAG_STANDARDS };
