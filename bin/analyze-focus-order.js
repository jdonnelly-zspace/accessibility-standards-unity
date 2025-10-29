#!/usr/bin/env node

/**
 * Focus Order Analyzer - WCAG 2.4.3 (Level A)
 *
 * Analyzes Unity scenes to ensure keyboard focus order:
 * - Preserves meaning and operability
 * - Matches visual/logical reading order
 * - Is predictable and intuitive
 *
 * WCAG 2.4.3: Focus Order
 * https://www.w3.org/WAI/WCAG22/Understanding/focus-order
 *
 * Automation Level: 70%
 */

import fs from 'fs';
import path from 'path';
import {
  findSceneFiles,
  parseUnityScene,
  findInteractiveElements,
  getTransform
} from './utils/unity-scene-parser.js';

/**
 * Analyze focus order in all scenes
 * @param {string} projectPath - Path to Unity project
 * @returns {Promise<Array>} Array of findings
 */
export async function analyzeFocusOrder(projectPath) {
  const findings = [];

  const scenes = findSceneFiles(projectPath);

  if (scenes.length === 0) {
    return [{
      wcagCriterion: '2.4.3',
      severity: 'info',
      issue: 'No Unity scene files found'
    }];
  }

  console.log(`\nAnalyzing focus order for ${scenes.length} scenes...`);

  for (const scene of scenes) {
    try {
      const sceneData = parseUnityScene(scene.path);

      // Step 1: Extract all focusable elements
      const focusableElements = findFocusableElements(sceneData);

      if (focusableElements.length === 0) {
        // No focusable elements in this scene
        continue;
      }

      // Step 2: Determine expected focus order (visual/spatial)
      const visualOrder = sortByVisualOrder(focusableElements);

      // Step 3: Determine actual focus order (hierarchy or explicit navigation)
      const actualOrder = determineFocusOrder(sceneData, focusableElements);

      // Step 4: Compare orders
      const mismatches = compareFocusOrders(visualOrder, actualOrder);

      if (mismatches.length > 0) {
        findings.push({
          wcagCriterion: '2.4.3',
          level: 'A',
          severity: 'high',
          scene: scene.name,
          scenePath: scene.path,
          issue: 'Focus order does not match visual/logical order',
          explanation: 'When users navigate with keyboard, focus should move in a logical order that matches the visual layout',
          mismatches: mismatches,
          recommendation: 'Reorder UI elements in hierarchy or use explicit navigation',
          howToFix: [
            '1. In Unity Hierarchy, arrange focusable elements in the order users should navigate',
            '2. For top-to-bottom, left-to-right reading: list elements in that order',
            '3. Alternatively, use Unity\'s Selectable.navigation to set explicit focus order',
            '4. Test with keyboard navigation (Tab key) to verify focus order'
          ],
          elements: visualOrder.map(e => ({
            name: e.name,
            visualPosition: `(${Math.round(e.position.x)}, ${Math.round(e.position.y)})`,
            expectedIndex: visualOrder.indexOf(e),
            actualIndex: actualOrder.indexOf(e)
          }))
        });
      }

    } catch (err) {
      findings.push({
        wcagCriterion: '2.4.3',
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
 * Find all focusable elements in scene
 * @param {Object} sceneData - Parsed scene data
 * @returns {Array} Focusable elements with position data
 */
function findFocusableElements(sceneData) {
  const focusable = [];

  // Find interactive UI elements (Button, Toggle, Slider, InputField, etc.)
  const interactive = findInteractiveElements(sceneData);

  for (const element of interactive) {
    const gameObject = sceneData.gameObjects.find(
      go => go.m_FileID === element.gameObjectId
    );

    if (!gameObject) continue;

    // Get transform/position
    const transform = getTransform(sceneData, element.gameObjectId);

    if (transform && transform.type === 'RectTransform') {
      focusable.push({
        gameObjectId: element.gameObjectId,
        name: gameObject.m_Name,
        type: element.type,
        position: transform.anchoredPosition || { x: 0, y: 0 },
        transform: transform,
        navigation: getNavigationMode(sceneData, element.gameObjectId)
      });
    }
  }

  return focusable;
}

/**
 * Get navigation mode for a Selectable component
 * @param {Object} sceneData - Parsed scene data
 * @param {string} gameObjectId - GameObject ID
 * @returns {Object|null} Navigation configuration
 */
function getNavigationMode(sceneData, gameObjectId) {
  if (!sceneData.components.MonoBehaviour) return null;

  // Find Selectable component (Button, Toggle, etc. inherit from Selectable)
  for (const component of sceneData.components.MonoBehaviour) {
    if (component.m_GameObject?.fileID === gameObjectId) {
      if (component.m_Navigation) {
        return {
          mode: component.m_Navigation.m_Mode,
          selectOnUp: component.m_Navigation.m_SelectOnUp?.fileID,
          selectOnDown: component.m_Navigation.m_SelectOnDown?.fileID,
          selectOnLeft: component.m_Navigation.m_SelectOnLeft?.fileID,
          selectOnRight: component.m_Navigation.m_SelectOnRight?.fileID
        };
      }
    }
  }

  return null;
}

/**
 * Sort elements by visual order (top-to-bottom, left-to-right for LTR UIs)
 * @param {Array} elements - Focusable elements
 * @returns {Array} Sorted elements
 */
function sortByVisualOrder(elements) {
  // Clone array to avoid mutating original
  const sorted = [...elements];

  sorted.sort((a, b) => {
    // Unity UI: Y increases upward (inverted from screen coordinates)
    // Higher Y = higher on screen = should come first in focus order

    // Sort by Y position first (top to bottom)
    const yThreshold = 50; // Elements within 50 units are considered same row

    if (Math.abs(a.position.y - b.position.y) > yThreshold) {
      return b.position.y - a.position.y; // Higher Y first (top to bottom)
    }

    // If same row, sort by X position (left to right)
    return a.position.x - b.position.x;
  });

  return sorted;
}

/**
 * Determine actual focus order based on Unity hierarchy or explicit navigation
 * @param {Object} sceneData - Parsed scene data
 * @param {Array} elements - Focusable elements
 * @returns {Array} Elements in actual focus order
 */
function determineFocusOrder(sceneData, elements) {
  // Check if any element uses explicit navigation
  const hasExplicitNav = elements.some(
    e => e.navigation && e.navigation.mode === 4 // Explicit = 4
  );

  if (hasExplicitNav) {
    // Build focus order from explicit navigation
    return buildExplicitFocusOrder(elements);
  } else {
    // Use hierarchy order
    return sortByHierarchyOrder(sceneData, elements);
  }
}

/**
 * Build focus order from explicit Unity navigation
 * @param {Array} elements - Focusable elements
 * @returns {Array} Elements in explicit focus order
 */
function buildExplicitFocusOrder(elements) {
  // Start with first element (or element that's not selectOnDown of any other)
  const elementMap = new Map(elements.map(e => [e.gameObjectId, e]));
  const order = [];
  const visited = new Set();

  // Find starting element (one that's not a target of any selectOnDown)
  let current = elements.find(e => {
    return !elements.some(other =>
      other.navigation?.selectOnDown === e.gameObjectId
    );
  });

  if (!current) current = elements[0];

  // Follow the chain
  while (current && !visited.has(current.gameObjectId)) {
    order.push(current);
    visited.add(current.gameObjectId);

    // Find next element
    const nextId = current.navigation?.selectOnDown;
    if (nextId && elementMap.has(nextId)) {
      current = elementMap.get(nextId);
    } else {
      break;
    }
  }

  // Add any remaining elements
  for (const element of elements) {
    if (!visited.has(element.gameObjectId)) {
      order.push(element);
    }
  }

  return order;
}

/**
 * Sort elements by Unity hierarchy order
 * @param {Object} sceneData - Parsed scene data
 * @param {Array} elements - Focusable elements
 * @returns {Array} Elements in hierarchy order
 */
function sortByHierarchyOrder(sceneData, elements) {
  // Unity's default navigation uses sibling index in hierarchy
  // Elements appear in the order they're listed in the scene file

  const gameObjectOrder = new Map();
  sceneData.gameObjects.forEach((go, index) => {
    gameObjectOrder.set(go.m_FileID, index);
  });

  const sorted = [...elements].sort((a, b) => {
    const orderA = gameObjectOrder.get(a.gameObjectId) || 0;
    const orderB = gameObjectOrder.get(b.gameObjectId) || 0;
    return orderA - orderB;
  });

  return sorted;
}

/**
 * Compare visual order with actual focus order
 * @param {Array} visualOrder - Expected visual order
 * @param {Array} actualOrder - Actual focus order
 * @returns {Array} Mismatches
 */
function compareFocusOrders(visualOrder, actualOrder) {
  const mismatches = [];

  for (let i = 0; i < visualOrder.length; i++) {
    const expectedElement = visualOrder[i];
    const actualIndex = actualOrder.findIndex(
      e => e.gameObjectId === expectedElement.gameObjectId
    );

    // Allow some tolerance (±1 position)
    const tolerance = 1;

    if (Math.abs(actualIndex - i) > tolerance) {
      mismatches.push({
        element: expectedElement.name,
        expectedPosition: i,
        actualPosition: actualIndex,
        difference: actualIndex - i
      });
    }
  }

  return mismatches;
}

/**
 * Generate report for focus order analysis
 * @param {Array} findings - Analysis findings
 * @returns {Object} Report summary
 */
export function generateFocusOrderReport(findings) {
  const totalScenes = new Set(findings.filter(f => f.scene).map(f => f.scene)).size;
  const scenesWithIssues = findings.filter(f => f.severity !== 'info' && f.severity !== 'error').length;
  const totalMismatches = findings.reduce((sum, f) =>
    sum + (f.mismatches?.length || 0), 0
  );

  return {
    totalScenes,
    scenesWithIssues,
    totalMismatches,
    passRate: totalScenes > 0
      ? ((totalScenes - scenesWithIssues) / totalScenes * 100).toFixed(1)
      : 0,
    findings
  };
}

// ============================================================================
// CLI Interface
// ============================================================================

if (import.meta.url === `file://${process.argv[1]}`) {
  const projectPath = process.argv[2];

  if (!projectPath) {
    console.error('Usage: node analyze-focus-order.js <unity-project-path>');
    process.exit(1);
  }

  console.log('='.repeat(80));
  console.log('WCAG 2.4.3: Focus Order Analysis');
  console.log('='.repeat(80));

  analyzeFocusOrder(projectPath)
    .then(findings => {
      const report = generateFocusOrderReport(findings);

      console.log(`\n${'='.repeat(80)}`);
      console.log('ANALYSIS SUMMARY');
      console.log('='.repeat(80));
      console.log(`Total Scenes Analyzed: ${report.totalScenes}`);
      console.log(`Scenes with Issues: ${report.scenesWithIssues}`);
      console.log(`Total Focus Order Mismatches: ${report.totalMismatches}`);
      console.log(`Pass Rate: ${report.passRate}%`);

      if (findings.length > 0 && report.scenesWithIssues > 0) {
        console.log(`\n${'='.repeat(80)}`);
        console.log('FINDINGS');
        console.log('='.repeat(80));

        for (const finding of findings) {
          if (finding.severity === 'info' || finding.severity === 'error') continue;

          console.log(`\n[${finding.severity.toUpperCase()}] ${finding.scene}`);
          console.log(`  Issue: ${finding.issue}`);
          console.log(`  Recommendation: ${finding.recommendation}`);

          if (finding.mismatches && finding.mismatches.length > 0) {
            console.log(`  Mismatches:`);
            finding.mismatches.forEach(m => {
              console.log(`    - ${m.element}: expected position ${m.expectedPosition}, actual ${m.actualPosition}`);
            });
          }

          if (finding.howToFix) {
            console.log(`  How to Fix:`);
            finding.howToFix.forEach(step => console.log(`    ${step}`));
          }
        }
      } else {
        console.log('\n✓ All scenes have proper focus order!');
      }

      // Save JSON report
      const outputPath = path.join(process.cwd(), 'focus-order-report.json');
      fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
      console.log(`\nDetailed report saved to: ${outputPath}`);
    })
    .catch(err => {
      console.error('Error analyzing focus order:', err);
      process.exit(1);
    });
}
