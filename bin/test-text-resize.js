#!/usr/bin/env node

/**
 * Text Resize Tester - WCAG 1.4.4 (Level AA)
 *
 * Analyzes Unity scenes to ensure text can be resized up to 200% without
 * loss of content or functionality (no clipping, overflow, or requiring scrolling).
 *
 * WCAG 1.4.4: Resize Text
 * https://www.w3.org/WAI/WCAG22/Understanding/resize-text
 *
 * Automation Level: 70%
 *
 * Note: Full testing requires runtime analysis. This tool performs static
 * analysis to detect potential issues with text scaling.
 */

import fs from 'fs';
import path from 'path';
import {
  findSceneFiles,
  parseUnityScene,
  findTextComponents,
  getTransform,
  convertUnityRectToPixels,
  findCanvas
} from './utils/unity-scene-parser.js';

/**
 * Test text resize capability across all scenes
 * @param {string} projectPath - Path to Unity project
 * @returns {Promise<Array>} Array of findings
 */
export async function testTextResize(projectPath) {
  const findings = [];

  const scenes = findSceneFiles(projectPath);

  if (scenes.length === 0) {
    return [{
      wcagCriterion: '1.4.4',
      severity: 'info',
      issue: 'No Unity scene files found'
    }];
  }

  console.log(`\nAnalyzing text resize capability for ${scenes.length} scenes...`);

  for (const scene of scenes) {
    try {
      const sceneData = parseUnityScene(scene.path);

      // Find all text components
      const textComponents = findTextComponents(sceneData);

      if (textComponents.length === 0) continue;

      const canvas = findCanvas(sceneData);

      // Analyze each text component
      for (const textComponent of textComponents) {
        const gameObject = sceneData.gameObjects.find(
          go => go.m_FileID === textComponent.gameObjectId
        );

        if (!gameObject) continue;

        const transform = getTransform(sceneData, textComponent.gameObjectId);

        if (!transform || transform.type !== 'RectTransform') continue;

        // Check for layout components that support text scaling
        const hasContentSizeFitter = hasComponent(sceneData, textComponent.gameObjectId, 'ContentSizeFitter');
        const hasScrollRect = hasComponent(sceneData, textComponent.gameObjectId, 'ScrollRect') ||
                             isInsideScrollView(sceneData, textComponent.gameObjectId);
        const hasLayoutElement = hasComponent(sceneData, textComponent.gameObjectId, 'LayoutElement');

        // Get container size
        const size = convertUnityRectToPixels(transform, canvas);

        // Estimate text size
        const textLength = textComponent.text?.length || 0;
        const estimatedTextWidth = estimateTextWidth(textComponent.text, textComponent.component);

        // Check if text might overflow at 200% scale
        const scaledWidth = estimatedTextWidth * 2.0;
        const scaledHeight = (transform.sizeDelta?.y || 0) * 2.0;

        const willOverflow = !hasContentSizeFitter && !hasScrollRect &&
                           (scaledWidth > size.width || scaledHeight > size.height);

        const hasFixedSize = !hasContentSizeFitter && !hasLayoutElement;

        if (willOverflow) {
          findings.push({
            wcagCriterion: '1.4.4',
            level: 'AA',
            severity: 'high',
            scene: scene.name,
            scenePath: scene.path,
            element: gameObject.m_Name,
            text: textComponent.text?.substring(0, 50) + (textComponent.text?.length > 50 ? '...' : ''),
            issue: 'Text likely to overflow or be clipped at 200% scale',
            explanation: 'Text container has fixed size and no layout flexibility, which may cause clipping when text is scaled',
            currentSize: `${Math.round(size.width)}x${Math.round(size.height)}px`,
            estimatedScaledSize: `${Math.round(scaledWidth)}x${Math.round(scaledHeight)}px`,
            recommendation: 'Add ContentSizeFitter or use flexible layout',
            howToFix: [
              `1. Select "${gameObject.m_Name}" GameObject in Unity`,
              '2. Add ContentSizeFitter component',
              '3. Set Horizontal Fit = "Preferred Size" or "Min Size"',
              '4. Set Vertical Fit = "Preferred Size" or "Min Size"',
              'OR:',
              '5. Place text inside a ScrollRect for scrollable content',
              '6. Ensure parent has LayoutGroup for dynamic sizing'
            ]
          });
        } else if (hasFixedSize && textLength > 20) {
          findings.push({
            wcagCriterion: '1.4.4',
            level: 'AA',
            severity: 'medium',
            scene: scene.name,
            scenePath: scene.path,
            element: gameObject.m_Name,
            text: textComponent.text?.substring(0, 50) + (textComponent.text?.length > 50 ? '...' : ''),
            issue: 'Text has fixed size container - may not scale well',
            explanation: 'Fixed-size containers may cause issues when text scale is increased',
            recommendation: 'Consider adding ContentSizeFitter or flexible layout',
            howToFix: [
              '1. Test text at 150% and 200% scale in runtime',
              '2. If overflow occurs, add ContentSizeFitter component',
              '3. Or use LayoutElement with flexible sizing'
            ]
          });
        }

        // Check if text uses proper font scaling
        const usesDynamicFont = checkDynamicFont(textComponent.component);

        if (!usesDynamicFont) {
          findings.push({
            wcagCriterion: '1.4.4',
            level: 'AA',
            severity: 'low',
            scene: scene.name,
            scenePath: scene.path,
            element: gameObject.m_Name,
            issue: 'Text may not use scalable font',
            explanation: 'Bitmap fonts or fixed-size fonts may not scale cleanly',
            recommendation: 'Use dynamic fonts (TTF/OTF) or TextMeshPro for better scaling',
            howToFix: [
              '1. If using UI.Text, ensure font is a TrueType/OpenType font',
              '2. Consider switching to TextMeshPro for better text rendering',
              '3. TextMeshPro handles scaling and resolution changes better'
            ]
          });
        }
      }

    } catch (err) {
      findings.push({
        wcagCriterion: '1.4.4',
        severity: 'error',
        scene: scene.name,
        scenePath: scene.path,
        issue: `Failed to parse scene: ${err.message}`
      });
    }
  }

  return findings;
}

/**
 * Check if GameObject has a specific component
 * @param {Object} sceneData - Parsed scene data
 * @param {string} gameObjectId - GameObject ID
 * @param {string} componentType - Component type name
 * @returns {boolean}
 */
function hasComponent(sceneData, gameObjectId, componentType) {
  if (!sceneData.components[componentType]) return false;

  return sceneData.components[componentType].some(
    c => c.m_GameObject?.fileID === gameObjectId
  );
}

/**
 * Check if GameObject is inside a ScrollView
 * @param {Object} sceneData - Parsed scene data
 * @param {string} gameObjectId - GameObject ID
 * @returns {boolean}
 */
function isInsideScrollView(sceneData, gameObjectId) {
  // Check if any parent has ScrollRect
  if (!sceneData.components.RectTransform) return false;

  const transform = sceneData.components.RectTransform.find(
    t => t.m_GameObject?.fileID === gameObjectId
  );

  if (!transform) return false;

  // Check parent chain
  let currentParentId = transform.m_Father?.fileID;
  let depth = 0;
  const maxDepth = 10; // Prevent infinite loops

  while (currentParentId && depth < maxDepth) {
    // Check if parent has ScrollRect
    if (hasComponent(sceneData, currentParentId, 'ScrollRect')) {
      return true;
    }

    // Move to next parent
    const parentTransform = sceneData.components.RectTransform.find(
      t => t.m_GameObject?.fileID === currentParentId
    );

    if (!parentTransform) break;

    currentParentId = parentTransform.m_Father?.fileID;
    depth++;
  }

  return false;
}

/**
 * Estimate text width based on text content and font
 * @param {string} text - Text content
 * @param {Object} textComponent - Text component data
 * @returns {number} Estimated width in pixels
 */
function estimateTextWidth(text, textComponent) {
  if (!text) return 0;

  // Get font size (default to 14 if not specified)
  const fontSize = textComponent?.m_FontSize || 14;

  // Rough estimate: average character width is ~0.6 * font size
  // This is a simplification and won't be accurate for all fonts
  const avgCharWidth = fontSize * 0.6;

  return text.length * avgCharWidth;
}

/**
 * Check if text component uses dynamic font
 * @param {Object} textComponent - Text component data
 * @returns {boolean}
 */
function checkDynamicFont(textComponent) {
  // This is a simplified check
  // In Unity, dynamic fonts are TrueType/OpenType fonts
  // We can't fully determine this from scene file, but we can check for indicators

  if (!textComponent) return false;

  // If it's TextMeshPro (has m_fontAsset), it supports dynamic rendering
  if (textComponent.m_fontAsset || textComponent.m_Font) {
    return true;
  }

  // For UI.Text, check if font reference exists (indicates TrueType font)
  if (textComponent.m_FontData && textComponent.m_FontData.m_Font) {
    return true;
  }

  return false;
}

/**
 * Generate report for text resize analysis
 * @param {Array} findings - Analysis findings
 * @returns {Object} Report summary
 */
export function generateTextResizeReport(findings) {
  const totalIssues = findings.filter(f => f.severity !== 'info').length;
  const highSeverity = findings.filter(f => f.severity === 'high').length;
  const mediumSeverity = findings.filter(f => f.severity === 'medium').length;
  const lowSeverity = findings.filter(f => f.severity === 'low').length;
  const errors = findings.filter(f => f.severity === 'error').length;

  const scenesAffected = new Set(
    findings.filter(f => f.scene).map(f => f.scene)
  ).size;

  return {
    totalIssues,
    severity: {
      high: highSeverity,
      medium: mediumSeverity,
      low: lowSeverity,
      errors: errors
    },
    scenesAffected,
    findings
  };
}

// ============================================================================
// CLI Interface
// ============================================================================

if (import.meta.url === `file://${process.argv[1]}`) {
  const projectPath = process.argv[2];

  if (!projectPath) {
    console.error('Usage: node test-text-resize.js <unity-project-path>');
    process.exit(1);
  }

  console.log('='.repeat(80));
  console.log('WCAG 1.4.4: Resize Text Analysis');
  console.log('='.repeat(80));
  console.log('Note: This is static analysis. Runtime testing recommended.');
  console.log('='.repeat(80));

  testTextResize(projectPath)
    .then(findings => {
      const report = generateTextResizeReport(findings);

      console.log(`\n${'='.repeat(80)}`);
      console.log('ANALYSIS SUMMARY');
      console.log('='.repeat(80));
      console.log(`Total Issues: ${report.totalIssues}`);
      console.log(`  High Severity: ${report.severity.high}`);
      console.log(`  Medium Severity: ${report.severity.medium}`);
      console.log(`  Low Severity: ${report.severity.low}`);
      console.log(`Scenes Affected: ${report.scenesAffected}`);

      if (findings.length > 0 && report.totalIssues > 0) {
        console.log(`\n${'='.repeat(80)}`);
        console.log('FINDINGS');
        console.log('='.repeat(80));

        for (const finding of findings) {
          if (finding.severity === 'info') continue;

          console.log(`\n[${finding.severity.toUpperCase()}] ${finding.scene} - ${finding.element}`);
          console.log(`  Issue: ${finding.issue}`);

          if (finding.text) {
            console.log(`  Text: "${finding.text}"`);
          }

          if (finding.currentSize) {
            console.log(`  Current Size: ${finding.currentSize}`);
          }

          if (finding.estimatedScaledSize) {
            console.log(`  Estimated at 200%: ${finding.estimatedScaledSize}`);
          }

          console.log(`  Recommendation: ${finding.recommendation}`);

          if (finding.howToFix) {
            console.log(`  How to Fix:`);
            finding.howToFix.forEach(step => console.log(`    ${step}`));
          }
        }
      } else {
        console.log('\n✓ All text components appear to support proper scaling!');
      }

      console.log(`\n${'='.repeat(80)}`);
      console.log('NEXT STEPS');
      console.log('='.repeat(80));
      console.log('1. Review high and medium severity issues first');
      console.log('2. Test text scaling at runtime (150% and 200%)');
      console.log('3. Use Unity\'s UI Scaling settings to verify');
      console.log('4. Consider implementing a global text scale multiplier');
      console.log('5. Add ContentSizeFitter to flexible text containers');

      // Save JSON report
      const outputPath = path.join(process.cwd(), 'text-resize-report.json');
      fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
      console.log(`\nDetailed report saved to: ${outputPath}`);
    })
    .catch(err => {
      console.error('Error analyzing text resize:', err);
      process.exit(1);
    });
}
