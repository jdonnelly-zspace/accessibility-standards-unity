#!/usr/bin/env node

/**
 * Visual Accessibility Analyzer
 *
 * Analyzes screenshots for visual accessibility issues using image processing.
 * Part of the zSpace Accessibility Standards Unity Framework v3.1.0.
 *
 * Features:
 * - Extract dominant colors from UI regions
 * - Calculate WCAG contrast ratios (4.5:1 text, 3:1 UI)
 * - Detect low-contrast areas
 * - Generate contrast heatmaps
 * - Export findings to JSON
 *
 * Usage:
 *   node analyze-visual-accessibility.js <screenshots-dir> [options]
 *
 * Options:
 *   --output-dir <path>       Output directory for analysis results (default: visual-analysis)
 *   --threshold <number>      Minimum contrast ratio threshold (default: 4.5)
 *   --heatmap                 Generate contrast heatmaps
 *   --verbose                 Enable verbose logging
 *
 * Example:
 *   node analyze-visual-accessibility.js AccessibilityAudit/screenshots --heatmap
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// WCAG 2.1 Contrast Standards
const CONTRAST_STANDARDS = {
  NORMAL_TEXT_AA: 4.5,      // WCAG 1.4.3 (Level AA)
  LARGE_TEXT_AA: 3.0,       // WCAG 1.4.3 (Level AA)
  UI_COMPONENTS_AA: 3.0,    // WCAG 1.4.11 (Level AA)
  NORMAL_TEXT_AAA: 7.0,     // WCAG 1.4.6 (Level AAA)
  LARGE_TEXT_AAA: 4.5       // WCAG 1.4.6 (Level AAA)
};

class VisualAccessibilityAnalyzer {
  constructor(screenshotsDir, options = {}) {
    this.screenshotsDir = screenshotsDir;
    this.options = {
      outputDir: options.outputDir || 'visual-analysis',
      threshold: options.threshold || CONTRAST_STANDARDS.NORMAL_TEXT_AA,
      generateHeatmap: options.heatmap || false,
      verbose: options.verbose || false
    };

    this.results = {
      totalScenes: 0,
      scenesAnalyzed: 0,
      scenesWithIssues: 0,
      totalIssues: 0,
      scenes: []
    };
  }

  log(message) {
    if (this.options.verbose) {
      console.log(message);
    }
  }

  /**
   * Calculate relative luminance from RGB values
   * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
   */
  calculateLuminance(r, g, b) {
    // Normalize RGB values
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
  calculateContrastRatio(rgb1, rgb2) {
    const lum1 = this.calculateLuminance(rgb1.r, rgb1.g, rgb1.b);
    const lum2 = this.calculateLuminance(rgb2.r, rgb2.g, rgb2.b);

    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);

    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * Extract dominant colors from image regions
   */
  async extractDominantColors(imagePath, regions = 16) {
    try {
      const image = sharp(imagePath);
      const metadata = await image.metadata();
      const { width, height } = metadata;

      // Resize for faster processing
      const resized = await image
        .resize(Math.min(width, 800), Math.min(height, 600), { fit: 'inside' })
        .raw()
        .toBuffer({ resolveWithObject: true });

      const { data, info } = resized;
      const regionWidth = Math.floor(info.width / Math.sqrt(regions));
      const regionHeight = Math.floor(info.height / Math.sqrt(regions));

      const colors = [];

      // Extract average color from each region
      for (let ry = 0; ry < Math.sqrt(regions); ry++) {
        for (let rx = 0; rx < Math.sqrt(regions); rx++) {
          const startX = rx * regionWidth;
          const startY = ry * regionHeight;
          const endX = Math.min(startX + regionWidth, info.width);
          const endY = Math.min(startY + regionHeight, info.height);

          let r = 0, g = 0, b = 0, count = 0;

          for (let y = startY; y < endY; y++) {
            for (let x = startX; x < endX; x++) {
              const idx = (y * info.width + x) * info.channels;
              r += data[idx];
              g += data[idx + 1];
              b += data[idx + 2];
              count++;
            }
          }

          colors.push({
            r: Math.round(r / count),
            g: Math.round(g / count),
            b: Math.round(b / count),
            region: { x: startX, y: startY, width: regionWidth, height: regionHeight }
          });
        }
      }

      return colors;
    } catch (error) {
      console.error(`Error extracting colors from ${imagePath}:`, error.message);
      return [];
    }
  }

  /**
   * Analyze contrast between adjacent regions
   */
  analyzeRegionContrast(colors) {
    const issues = [];

    for (let i = 0; i < colors.length - 1; i++) {
      for (let j = i + 1; j < colors.length; j++) {
        const color1 = colors[i];
        const color2 = colors[j];

        // Check if regions are adjacent
        const isAdjacent = Math.abs(color1.region.x - color2.region.x) <= color1.region.width &&
                           Math.abs(color1.region.y - color2.region.y) <= color1.region.height;

        if (isAdjacent) {
          const contrast = this.calculateContrastRatio(color1, color2);

          if (contrast < this.options.threshold) {
            issues.push({
              severity: contrast < 3.0 ? 'critical' : 'warning',
              contrast: contrast.toFixed(2),
              threshold: this.options.threshold,
              color1: `rgb(${color1.r}, ${color1.g}, ${color1.b})`,
              color2: `rgb(${color2.r}, ${color2.g}, ${color2.b})`,
              region1: color1.region,
              region2: color2.region,
              wcagLevel: this.getWCAGLevel(contrast)
            });
          }
        }
      }
    }

    return issues;
  }

  /**
   * Determine WCAG compliance level for contrast ratio
   */
  getWCAGLevel(contrast) {
    if (contrast >= CONTRAST_STANDARDS.NORMAL_TEXT_AAA) return 'AAA (Normal Text)';
    if (contrast >= CONTRAST_STANDARDS.NORMAL_TEXT_AA) return 'AA (Normal Text)';
    if (contrast >= CONTRAST_STANDARDS.LARGE_TEXT_AA) return 'AA (Large Text Only)';
    return 'Fail';
  }

  /**
   * Generate contrast heatmap overlay
   */
  async generateHeatmap(imagePath, issues, outputPath) {
    try {
      const image = sharp(imagePath);
      const metadata = await image.metadata();

      // Create SVG overlay with contrast issue highlights
      const svg = `
        <svg width="${metadata.width}" height="${metadata.height}">
          ${issues.map(issue => {
            const color = issue.severity === 'critical' ? 'rgba(255, 0, 0, 0.5)' : 'rgba(255, 165, 0, 0.4)';
            return `
              <rect x="${issue.region1.x}" y="${issue.region1.y}"
                    width="${issue.region1.width}" height="${issue.region1.height}"
                    fill="${color}" stroke="red" stroke-width="2"/>
            `;
          }).join('')}
        </svg>
      `;

      await image
        .composite([{ input: Buffer.from(svg), gravity: 'northwest' }])
        .toFile(outputPath);

      this.log(`✓ Generated heatmap: ${outputPath}`);
    } catch (error) {
      console.error(`Error generating heatmap for ${imagePath}:`, error.message);
    }
  }

  /**
   * Analyze a single scene screenshot
   */
  async analyzeScene(sceneName, scenePath) {
    this.log(`\nAnalyzing scene: ${sceneName}`);

    const mainScreenshot = path.join(scenePath, `${sceneName}_main.png`);

    if (!fs.existsSync(mainScreenshot)) {
      this.log(`⚠️  Screenshot not found: ${mainScreenshot}`);
      return null;
    }

    // Extract dominant colors
    const colors = await this.extractDominantColors(mainScreenshot);
    if (colors.length === 0) {
      return null;
    }

    // Analyze contrast
    const issues = this.analyzeRegionContrast(colors);

    // Generate heatmap if enabled
    let heatmapPath = null;
    if (this.options.generateHeatmap && issues.length > 0) {
      const heatmapDir = path.join(this.options.outputDir, 'heatmaps');
      if (!fs.existsSync(heatmapDir)) {
        fs.mkdirSync(heatmapDir, { recursive: true });
      }
      heatmapPath = path.join(heatmapDir, `${sceneName}_contrast_heatmap.png`);
      await this.generateHeatmap(mainScreenshot, issues, heatmapPath);
    }

    const sceneResult = {
      sceneName,
      screenshotPath: mainScreenshot,
      issuesFound: issues.length,
      criticalIssues: issues.filter(i => i.severity === 'critical').length,
      warnings: issues.filter(i => i.severity === 'warning').length,
      heatmapPath: heatmapPath ? path.relative(process.cwd(), heatmapPath) : null,
      issues: issues.slice(0, 10), // Limit to top 10 issues for report
      dominantColors: colors.slice(0, 5).map(c => ({
        rgb: `rgb(${c.r}, ${c.g}, ${c.b})`,
        hex: `#${c.r.toString(16).padStart(2, '0')}${c.g.toString(16).padStart(2, '0')}${c.b.toString(16).padStart(2, '0')}`
      }))
    };

    if (issues.length > 0) {
      this.results.scenesWithIssues++;
      this.results.totalIssues += issues.length;
      this.log(`⚠️  Found ${issues.length} contrast issues (${sceneResult.criticalIssues} critical)`);
    } else {
      this.log(`✓ No contrast issues detected`);
    }

    return sceneResult;
  }

  /**
   * Analyze all scenes in the screenshots directory
   */
  async analyzeAllScenes() {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  Visual Accessibility Analysis');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log(`📁 Screenshots: ${this.screenshotsDir}`);
    console.log(`📊 Threshold:   ${this.options.threshold}:1`);
    console.log(`📈 Heatmaps:    ${this.options.generateHeatmap ? 'Enabled' : 'Disabled'}`);
    console.log('');

    if (!fs.existsSync(this.screenshotsDir)) {
      console.error(`❌ Error: Screenshots directory not found: ${this.screenshotsDir}`);
      process.exit(1);
    }

    // Create output directory
    if (!fs.existsSync(this.options.outputDir)) {
      fs.mkdirSync(this.options.outputDir, { recursive: true });
    }

    // Find all scene directories
    const sceneNames = fs.readdirSync(this.screenshotsDir).filter(item => {
      const itemPath = path.join(this.screenshotsDir, item);
      return fs.statSync(itemPath).isDirectory();
    });

    this.results.totalScenes = sceneNames.length;
    console.log(`Found ${sceneNames.length} scene(s) to analyze\n`);

    // Analyze each scene
    for (const sceneName of sceneNames) {
      const scenePath = path.join(this.screenshotsDir, sceneName);
      const sceneResult = await this.analyzeScene(sceneName, scenePath);

      if (sceneResult) {
        this.results.scenes.push(sceneResult);
        this.results.scenesAnalyzed++;
      }
    }

    // Export results
    await this.exportResults();

    // Print summary
    this.printSummary();
  }

  /**
   * Export analysis results to JSON
   */
  async exportResults() {
    const reportPath = path.join(this.options.outputDir, 'contrast-report.json');

    const report = {
      metadata: {
        frameworkVersion: '3.1.0-phase2',
        analysisDate: new Date().toISOString(),
        screenshotsDirectory: this.screenshotsDir,
        contrastThreshold: this.options.threshold,
        wcagStandards: CONTRAST_STANDARDS
      },
      summary: {
        totalScenes: this.results.totalScenes,
        scenesAnalyzed: this.results.scenesAnalyzed,
        scenesWithIssues: this.results.scenesWithIssues,
        totalIssues: this.results.totalIssues,
        complianceRate: ((this.results.scenesAnalyzed - this.results.scenesWithIssues) / this.results.scenesAnalyzed * 100).toFixed(1) + '%'
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
    console.log('  Analysis Summary');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log(`Total Scenes:          ${this.results.totalScenes}`);
    console.log(`Scenes Analyzed:       ${this.results.scenesAnalyzed}`);
    console.log(`Scenes with Issues:    ${this.results.scenesWithIssues}`);
    console.log(`Total Contrast Issues: ${this.results.totalIssues}`);
    console.log('');

    const criticalCount = this.results.scenes.reduce((sum, s) => sum + s.criticalIssues, 0);
    const warningCount = this.results.scenes.reduce((sum, s) => sum + s.warnings, 0);

    if (this.results.totalIssues > 0) {
      console.log('Issue Breakdown:');
      console.log(`  🚨 Critical:  ${criticalCount} (contrast < 3.0:1)`);
      console.log(`  ⚠️  Warnings:  ${warningCount} (contrast < ${this.options.threshold}:1)`);
      console.log('');
    }

    const complianceRate = ((this.results.scenesAnalyzed - this.results.scenesWithIssues) / this.results.scenesAnalyzed * 100).toFixed(1);
    console.log(`Compliance Rate: ${complianceRate}%`);
    console.log('');

    if (this.results.scenesWithIssues === 0) {
      console.log('✅ All scenes passed visual accessibility analysis!');
    } else {
      console.log('⚠️  Some scenes have visual accessibility issues.');
      console.log('   Review the contrast-report.json for details.');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);

  const config = {
    screenshotsDir: null,
    outputDir: 'visual-analysis',
    threshold: CONTRAST_STANDARDS.NORMAL_TEXT_AA,
    heatmap: false,
    verbose: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--output-dir' && i + 1 < args.length) {
      config.outputDir = args[++i];
    } else if (arg === '--threshold' && i + 1 < args.length) {
      config.threshold = parseFloat(args[++i]);
    } else if (arg === '--heatmap') {
      config.heatmap = true;
    } else if (arg === '--verbose') {
      config.verbose = true;
    } else if (arg === '--help') {
      printHelp();
      process.exit(0);
    } else if (!arg.startsWith('--') && !config.screenshotsDir) {
      config.screenshotsDir = arg;
    }
  }

  return config;
}

function printHelp() {
  console.log('Usage: node analyze-visual-accessibility.js <screenshots-dir> [options]');
  console.log('');
  console.log('Options:');
  console.log('  --output-dir <path>       Output directory for analysis results (default: visual-analysis)');
  console.log('  --threshold <number>      Minimum contrast ratio threshold (default: 4.5)');
  console.log('  --heatmap                 Generate contrast heatmaps');
  console.log('  --verbose                 Enable verbose logging');
  console.log('  --help                    Show this help message');
  console.log('');
  console.log('Example:');
  console.log('  node analyze-visual-accessibility.js AccessibilityAudit/screenshots --heatmap');
}

// Main execution
async function main() {
  const config = parseArgs();

  if (!config.screenshotsDir) {
    console.error('Error: Screenshots directory is required\n');
    printHelp();
    process.exit(1);
  }

  const analyzer = new VisualAccessibilityAnalyzer(config.screenshotsDir, config);

  try {
    await analyzer.analyzeAllScenes();
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

export { VisualAccessibilityAnalyzer, CONTRAST_STANDARDS };
