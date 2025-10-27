#!/usr/bin/env node

/**
 * Text Contrast Analyzer - Phase 1
 * WCAG 2.2 Criterion 1.4.3: Contrast (Minimum)
 *
 * Analyzes text in screenshots using OCR and measures contrast ratios
 *
 * Usage:
 *   node bin/analyze-text-contrast.js <screenshot-path> [--output <json-file>]
 */

import Tesseract from 'tesseract.js';
import sharp from 'sharp';
import { calculateContrastRatio, rgbToHex, estimateFontSize, isLargeText } from './utils/wcag-calculations.js';
import fs from 'fs/promises';
import path from 'path';

/**
 * Analyze text contrast in a screenshot
 */
export async function analyzeTextContrast(screenshotPath, options = {}) {
  console.log(`\n🔍 Analyzing text contrast: ${path.basename(screenshotPath)}`);

  const findings = [];

  try {
    // Step 1: OCR to detect text
    console.log('  📖 Running OCR to detect text...');
    const { data } = await Tesseract.recognize(screenshotPath, 'eng', {
      logger: options.verbose ? (m) => console.log(`     ${m.status}: ${m.progress || ''}`) : undefined
    });

    console.log(`  ✓ Detected ${data.words.length} words`);

    // Step 2: Load image for color analysis
    const image = await sharp(screenshotPath).raw().toBuffer({ resolveWithObject: true });
    const { data: imageData, info } = image;

    // Step 3: Analyze each detected word
    let failedCount = 0;

    for (const word of data.words) {
      if (word.confidence < 60) continue; // Skip low-confidence OCR results

      const bbox = word.bbox;

      // Extract text color and background color
      const fgColor = extractTextColor(imageData, info, bbox);
      const bgColor = extractBackgroundColor(imageData, info, bbox);

      // Calculate contrast ratio
      const ratio = calculateContrastRatio(fgColor, bgColor);

      // Determine text size and WCAG threshold
      const fontSize = estimateFontSize(bbox, info.height);
      const isLarge = isLargeText(fontSize);
      const threshold = isLarge ? 3.0 : 4.5;

      // Check if contrast meets requirements
      if (ratio < threshold) {
        failedCount++;

        findings.push({
          wcagCriterion: '1.4.3',
          wcagLevel: 'AA',
          severity: ratio < 3.0 ? 'critical' : 'high',
          text: word.text,
          confidence: word.confidence,
          foreground: rgbToHex(fgColor.r, fgColor.g, fgColor.b),
          background: rgbToHex(bgColor.r, bgColor.g, bgColor.b),
          contrastRatio: parseFloat(ratio.toFixed(2)),
          requiredRatio: threshold,
          fontSize: parseFloat(fontSize.toFixed(1)),
          isLargeText: isLarge,
          location: {
            x: bbox.x0,
            y: bbox.y0,
            width: bbox.x1 - bbox.x0,
            height: bbox.y1 - bbox.y0
          },
          recommendation: `Increase contrast to ${threshold}:1 minimum (current: ${ratio.toFixed(2)}:1)`
        });
      }
    }

    console.log(`  ${failedCount > 0 ? '❌' : '✅'} ${failedCount} of ${data.words.length} text elements fail contrast requirements`);

  } catch (error) {
    console.error(`  ❌ Error analyzing text contrast: ${error.message}`);
  }

  return findings;
}

/**
 * Extract text color by sampling center pixels of text bounding box
 */
function extractTextColor(imageData, info, bbox) {
  const samples = [];
  const { width, channels } = info;

  // Sample center region of text
  const centerX = Math.floor((bbox.x0 + bbox.x1) / 2);
  const centerY = Math.floor((bbox.y0 + bbox.y1) / 2);
  const sampleRadius = 2;

  for (let dy = -sampleRadius; dy <= sampleRadius; dy++) {
    for (let dx = -sampleRadius; dx <= sampleRadius; dx++) {
      const x = centerX + dx;
      const y = centerY + dy;

      // Bounds checking
      if (x < 0 || x >= width || y < 0 || y >= info.height) continue;

      const idx = (y * width + x) * channels;

      samples.push({
        r: imageData[idx],
        g: imageData[idx + 1],
        b: imageData[idx + 2]
      });
    }
  }

  // Return most common color (text is usually uniform)
  return getMostCommonColor(samples);
}

/**
 * Extract background color by sampling pixels around text
 */
function extractBackgroundColor(imageData, info, bbox) {
  const samples = [];
  const { width, channels } = info;
  const padding = 5;

  // Sample top edge
  for (let x = bbox.x0 - padding; x <= bbox.x1 + padding; x++) {
    const y = bbox.y0 - padding;
    if (x < 0 || x >= width || y < 0 || y >= info.height) continue;

    const idx = (y * width + x) * channels;
    samples.push({
      r: imageData[idx],
      g: imageData[idx + 1],
      b: imageData[idx + 2]
    });
  }

  // Sample bottom edge
  for (let x = bbox.x0 - padding; x <= bbox.x1 + padding; x++) {
    const y = bbox.y1 + padding;
    if (x < 0 || x >= width || y < 0 || y >= info.height) continue;

    const idx = (y * width + x) * channels;
    samples.push({
      r: imageData[idx],
      g: imageData[idx + 1],
      b: imageData[idx + 2]
    });
  }

  // Sample left edge
  for (let y = bbox.y0 - padding; y <= bbox.y1 + padding; y++) {
    const x = bbox.x0 - padding;
    if (x < 0 || x >= width || y < 0 || y >= info.height) continue;

    const idx = (y * width + x) * channels;
    samples.push({
      r: imageData[idx],
      g: imageData[idx + 1],
      b: imageData[idx + 2]
    });
  }

  // Sample right edge
  for (let y = bbox.y0 - padding; y <= bbox.y1 + padding; y++) {
    const x = bbox.x1 + padding;
    if (x < 0 || x >= width || y < 0 || y >= info.height) continue;

    const idx = (y * width + x) * channels;
    samples.push({
      r: imageData[idx],
      g: imageData[idx + 1],
      b: imageData[idx + 2]
    });
  }

  return getAverageColor(samples);
}

function getMostCommonColor(samples) {
  const colorCounts = {};

  for (const sample of samples) {
    const key = `${sample.r},${sample.g},${sample.b}`;
    colorCounts[key] = (colorCounts[key] || 0) + 1;
  }

  let maxCount = 0;
  let mostCommon = samples[0] || { r: 0, g: 0, b: 0 };

  for (const [key, count] of Object.entries(colorCounts)) {
    if (count > maxCount) {
      maxCount = count;
      const [r, g, b] = key.split(',').map(Number);
      mostCommon = { r, g, b };
    }
  }

  return mostCommon;
}

function getAverageColor(samples) {
  if (samples.length === 0) return { r: 128, g: 128, b: 128 };

  const sum = samples.reduce((acc, sample) => ({
    r: acc.r + sample.r,
    g: acc.g + sample.g,
    b: acc.b + sample.b
  }), { r: 0, g: 0, b: 0 });

  return {
    r: Math.round(sum.r / samples.length),
    g: Math.round(sum.g / samples.length),
    b: Math.round(sum.b / samples.length)
  };
}

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: node bin/analyze-text-contrast.js <screenshot-path> [--output <json-file>]');
    process.exit(1);
  }

  const screenshotPath = args[0];
  const outputIndex = args.indexOf('--output');
  const outputPath = outputIndex !== -1 ? args[outputIndex + 1] : null;

  const findings = await analyzeTextContrast(screenshotPath, { verbose: true });

  if (outputPath) {
    await fs.writeFile(outputPath, JSON.stringify(findings, null, 2));
    console.log(`\n✓ Findings saved to: ${outputPath}`);
  } else {
    console.log('\nFindings:');
    console.log(JSON.stringify(findings, null, 2));
  }

  console.log(`\n✓ Analysis complete`);
}
