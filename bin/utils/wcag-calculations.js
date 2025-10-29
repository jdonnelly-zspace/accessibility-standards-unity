/**
 * WCAG 2.2 Calculation Utilities
 *
 * Implements WCAG contrast ratio calculations and color perception algorithms
 */

/**
 * Calculate relative luminance of RGB color
 * https://www.w3.org/TR/WCAG22/#dfn-relative-luminance
 */
export function calculateRelativeLuminance(r, g, b) {
  // Normalize RGB values to 0-1
  const rsRGB = r / 255;
  const gsRGB = g / 255;
  const bsRGB = b / 255;

  // Apply gamma correction
  const R = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const G = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const B = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

  // Calculate luminance
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/**
 * Calculate WCAG contrast ratio between two colors
 * https://www.w3.org/TR/WCAG22/#dfn-contrast-ratio
 */
export function calculateContrastRatio(color1, color2) {
  const L1 = calculateRelativeLuminance(color1.r, color1.g, color1.b);
  const L2 = calculateRelativeLuminance(color2.r, color2.g, color2.b);

  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG requirements
 */
export function meetsContrastRequirement(ratio, level, isLargeText = false) {
  const thresholds = {
    'AA': isLargeText ? 3.0 : 4.5,
    'AAA': isLargeText ? 4.5 : 7.0
  };

  return ratio >= thresholds[level];
}

/**
 * Convert RGB to hex string
 */
export function rgbToHex(r, g, b) {
  const toHex = (n) => {
    const hex = Math.round(n).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Convert hex to RGB object
 */
export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Estimate font size from bounding box (approximation)
 */
export function estimateFontSize(bbox, imageHeight) {
  const textHeight = bbox.y1 - bbox.y0;
  // Rough estimate: text height is ~70% of font size in pts
  // 1 pt = 1.333px at 96 DPI
  const estimatedPx = textHeight / 0.7;
  const estimatedPt = estimatedPx / 1.333;

  return estimatedPt;
}

/**
 * Determine if text is "large text" per WCAG definition
 * Large text: 18pt (24px) or 14pt (18.67px) bold
 */
export function isLargeText(fontSize, isBold = false) {
  if (isBold) {
    return fontSize >= 14;
  }
  return fontSize >= 18;
}

/**
 * Calculate color distance (Euclidean distance in RGB space)
 */
export function colorDistance(color1, color2) {
  const dr = color1.r - color2.r;
  const dg = color1.g - color2.g;
  const db = color1.b - color2.b;

  return Math.sqrt(dr * dr + dg * dg + db * db);
}

/**
 * Get most common color from array of color samples
 */
export function getMostCommonColor(samples) {
  const colorCounts = {};

  for (const sample of samples) {
    const key = `${sample.r},${sample.g},${sample.b}`;
    colorCounts[key] = (colorCounts[key] || 0) + 1;
  }

  let maxCount = 0;
  let mostCommon = samples[0];

  for (const [key, count] of Object.entries(colorCounts)) {
    if (count > maxCount) {
      maxCount = count;
      const [r, g, b] = key.split(',').map(Number);
      mostCommon = { r, g, b };
    }
  }

  return mostCommon;
}

/**
 * Get average color from array of color samples
 */
export function getAverageColor(samples) {
  if (samples.length === 0) return { r: 0, g: 0, b: 0 };

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
