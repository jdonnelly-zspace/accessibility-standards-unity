#!/usr/bin/env node

/**
 * Consistent Navigation Analyzer - WCAG 3.2.3 (Level AA)
 *
 * Analyzes Unity scenes to ensure navigation mechanisms that are repeated
 * across multiple scenes occur in the same relative order each time.
 *
 * WCAG 3.2.3: Consistent Navigation
 * https://www.w3.org/WAI/WCAG22/Understanding/consistent-navigation
 *
 * Automation Level: 80%
 */

import fs from 'fs';
import path from 'path';
import {
  findSceneFiles,
  parseUnityScene,
  findGameObjectsByName,
  findInteractiveElements,
  getTransform
} from './utils/unity-scene-parser.js';

/**
 * Analyze navigation consistency across all scenes
 * @param {string} projectPath - Path to Unity project
 * @returns {Promise<Array>} Array of findings
 */
export async function analyzeConsistentNavigation(projectPath) {
  const findings = [];

  const scenes = findSceneFiles(projectPath);

  if (scenes.length < 2) {
    return [{
      wcagCriterion: '3.2.3',
      severity: 'info',
      issue: 'Need at least 2 scenes to check navigation consistency'
    }];
  }

  console.log(`\nAnalyzing navigation consistency across ${scenes.length} scenes...`);

  const navigationPatterns = [];

  // Step 1: Extract navigation from all scenes
  for (const scene of scenes) {
    try {
      const sceneData = parseUnityScene(scene.path);

      // Extract navigation elements
      const navElements = findNavigationElements(sceneData);

      if (navElements.length > 0) {
        navigationPatterns.push({
          scene: scene.name,
          scenePath: scene.path,
          navigation: navElements
        });
      }

    } catch (err) {
      findings.push({
        wcagCriterion: '3.2.3',
        severity: 'error',
        scene: scene.name,
        issue: `Failed to parse scene: ${err.message}`
      });
    }
  }

  if (navigationPatterns.length < 2) {
    return [{
      wcagCriterion: '3.2.3',
      severity: 'info',
      issue: 'Not enough scenes with navigation elements to compare'
    }];
  }

  // Step 2: Compare navigation across scenes
  const baseNav = navigationPatterns[0];

  for (let i = 1; i < navigationPatterns.length; i++) {
    const currentNav = navigationPatterns[i];

    // Step 3: Check if navigation order is consistent
    const inconsistencies = compareNavigationOrder(baseNav, currentNav);

    if (inconsistencies.length > 0) {
      findings.push({
        wcagCriterion: '3.2.3',
        level: 'AA',
        severity: 'medium',
        baseScene: baseNav.scene,
        currentScene: currentNav.scene,
        currentScenePath: currentNav.scenePath,
        issue: 'Navigation order inconsistent across scenes',
        explanation: 'When navigation menus or controls appear in multiple scenes, they should appear in the same order',
        inconsistencies: inconsistencies,
        recommendation: 'Maintain same navigation order across all scenes',
        howToFix: [
          `1. Review navigation in "${baseNav.scene}" (reference scene)`,
          `2. Update navigation in "${currentNav.scene}" to match`,
          '3. Ensure navigation buttons/links appear in same order',
          '4. Use prefabs for navigation elements to maintain consistency',
          '5. Test navigation order in all scenes'
        ]
      });
    }
  }

  return findings;
}

/**
 * Find navigation elements in a scene
 * @param {Object} sceneData - Parsed scene data
 * @returns {Array} Navigation elements
 */
function findNavigationElements(sceneData) {
  const navElements = [];

  // Look for GameObjects with navigation-related names
  const navPatterns = [
    /nav/i,
    /menu/i,
    /header/i,
    /toolbar/i,
    /sidebar/i,
    /breadcrumb/i
  ];

  for (const pattern of navPatterns) {
    const navContainers = findGameObjectsByName(sceneData, pattern);

    for (const container of navContainers) {
      // Find all interactive elements (buttons) within this container
      const buttons = findChildButtons(sceneData, container);

      if (buttons.length > 0) {
        navElements.push({
          container: container.m_Name,
          containerId: container.m_FileID,
          buttons: buttons.map(b => ({
            name: b.name,
            position: b.position,
            hierarchyIndex: b.hierarchyIndex
          }))
        });
      }
    }
  }

  // Also look for common navigation patterns (e.g., repeated buttons across scenes)
  const interactiveElements = findInteractiveElements(sceneData);

  // Find groups of buttons that might be navigation
  const buttonGroups = findButtonGroups(sceneData, interactiveElements);

  for (const group of buttonGroups) {
    if (group.buttons.length >= 2 && isLikelyNavigation(group.buttons)) {
      navElements.push({
        container: group.name || 'Button Group',
        containerId: group.id,
        buttons: group.buttons.map(b => ({
          name: b.name,
          position: b.position
        }))
      });
    }
  }

  return navElements;
}

/**
 * Find all button children of a GameObject
 * @param {Object} sceneData - Parsed scene data
 * @param {Object} container - Container GameObject
 * @returns {Array} Button elements
 */
function findChildButtons(sceneData, container) {
  const buttons = [];

  // Find all transforms that are children of this container
  const containerTransform = getTransform(sceneData, container.m_FileID);

  if (!containerTransform) return buttons;

  // Find interactive elements
  const interactive = findInteractiveElements(sceneData);

  for (const element of interactive) {
    if (element.type === 'Button') {
      const elementTransform = getTransform(sceneData, element.gameObjectId);

      if (elementTransform) {
        // Check if this button is a child of the container
        // (simplified: just check if they're in the same general area)
        const gameObject = sceneData.gameObjects.find(
          go => go.m_FileID === element.gameObjectId
        );

        if (gameObject) {
          buttons.push({
            name: gameObject.m_Name,
            gameObjectId: element.gameObjectId,
            position: elementTransform.anchoredPosition || { x: 0, y: 0 },
            hierarchyIndex: sceneData.gameObjects.indexOf(gameObject)
          });
        }
      }
    }
  }

  // Sort buttons by position (top-to-bottom, left-to-right)
  buttons.sort((a, b) => {
    if (Math.abs(a.position.y - b.position.y) > 50) {
      return b.position.y - a.position.y;
    }
    return a.position.x - b.position.x;
  });

  return buttons;
}

/**
 * Find groups of buttons that might be navigation
 * @param {Object} sceneData - Parsed scene data
 * @param {Array} interactiveElements - All interactive elements
 * @returns {Array} Button groups
 */
function findButtonGroups(sceneData, interactiveElements) {
  const groups = [];
  const buttons = interactiveElements.filter(e => e.type === 'Button');

  // Group buttons by proximity
  const visited = new Set();

  for (const button of buttons) {
    if (visited.has(button.gameObjectId)) continue;

    const buttonTransform = getTransform(sceneData, button.gameObjectId);
    if (!buttonTransform) continue;

    const group = [button];
    visited.add(button.gameObjectId);

    // Find nearby buttons
    for (const other of buttons) {
      if (visited.has(other.gameObjectId)) continue;

      const otherTransform = getTransform(sceneData, other.gameObjectId);
      if (!otherTransform) continue;

      // Check if buttons are close together (likely part of same navigation)
      const distance = Math.sqrt(
        Math.pow((buttonTransform.anchoredPosition?.x || 0) - (otherTransform.anchoredPosition?.x || 0), 2) +
        Math.pow((buttonTransform.anchoredPosition?.y || 0) - (otherTransform.anchoredPosition?.y || 0), 2)
      );

      if (distance < 200) { // Within 200 units
        group.push(other);
        visited.add(other.gameObjectId);
      }
    }

    if (group.length >= 2) {
      const gameObjects = group.map(b =>
        sceneData.gameObjects.find(go => go.m_FileID === b.gameObjectId)
      );

      groups.push({
        id: `group_${groups.length}`,
        name: `Button Group ${groups.length + 1}`,
        buttons: gameObjects.filter(go => go).map(go => {
          const transform = getTransform(sceneData, go.m_FileID);
          return {
            name: go.m_Name,
            position: transform?.anchoredPosition || { x: 0, y: 0 }
          };
        })
      });
    }
  }

  return groups;
}

/**
 * Check if button names suggest navigation purpose
 * @param {Array} buttons - Button elements
 * @returns {boolean}
 */
function isLikelyNavigation(buttons) {
  const navKeywords = [
    'home', 'back', 'next', 'menu', 'settings', 'help',
    'close', 'exit', 'play', 'quit', 'start', 'continue'
  ];

  const navButtonCount = buttons.filter(b => {
    const name = b.name.toLowerCase();
    return navKeywords.some(keyword => name.includes(keyword));
  }).length;

  return navButtonCount >= buttons.length * 0.5; // At least 50% nav-related
}

/**
 * Compare navigation order between two scenes
 * @param {Object} baseNav - Base navigation pattern
 * @param {Object} currentNav - Current navigation pattern
 * @returns {Array} Inconsistencies found
 */
function compareNavigationOrder(baseNav, currentNav) {
  const inconsistencies = [];

  // Match navigation containers by name similarity
  for (const baseContainer of baseNav.navigation) {
    const matchingContainer = currentNav.navigation.find(
      c => normalizeContainerName(c.container) === normalizeContainerName(baseContainer.container)
    );

    if (!matchingContainer) {
      inconsistencies.push({
        type: 'missing_container',
        container: baseContainer.container,
        issue: `Navigation container "${baseContainer.container}" present in ${baseNav.scene} but missing in ${currentNav.scene}`
      });
      continue;
    }

    // Compare button order
    const baseButtons = baseContainer.buttons.map(b => normalizeButtonName(b.name));
    const currentButtons = matchingContainer.buttons.map(b => normalizeButtonName(b.name));

    // Check if all base buttons exist in current
    for (let i = 0; i < baseButtons.length; i++) {
      const baseName = baseButtons[i];
      const currentIndex = currentButtons.indexOf(baseName);

      if (currentIndex === -1) {
        inconsistencies.push({
          type: 'missing_button',
          container: baseContainer.container,
          button: baseName,
          issue: `Button "${baseName}" present in ${baseNav.scene} but missing in ${currentNav.scene}`
        });
      } else if (currentIndex !== i) {
        inconsistencies.push({
          type: 'order_mismatch',
          container: baseContainer.container,
          button: baseName,
          expectedPosition: i,
          actualPosition: currentIndex,
          issue: `Button "${baseName}" in different position (expected ${i}, actual ${currentIndex})`
        });
      }
    }

    // Check for extra buttons in current scene
    for (const currentButton of currentButtons) {
      if (!baseButtons.includes(currentButton)) {
        inconsistencies.push({
          type: 'extra_button',
          container: matchingContainer.container,
          button: currentButton,
          issue: `Button "${currentButton}" present in ${currentNav.scene} but not in ${baseNav.scene}`
        });
      }
    }
  }

  return inconsistencies;
}

/**
 * Normalize container name for comparison
 * @param {string} name - Container name
 * @returns {string} Normalized name
 */
function normalizeContainerName(name) {
  return name.toLowerCase()
    .replace(/panel|container|group/g, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

/**
 * Normalize button name for comparison
 * @param {string} name - Button name
 * @returns {string} Normalized name
 */
function normalizeButtonName(name) {
  return name.toLowerCase()
    .replace(/button|btn/g, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

/**
 * Generate report for navigation consistency analysis
 * @param {Array} findings - Analysis findings
 * @returns {Object} Report summary
 */
export function generateConsistentNavigationReport(findings) {
  const totalIssues = findings.filter(f => f.severity !== 'info').length;
  const sceneComparisons = findings.filter(f => f.currentScene).length;
  const totalInconsistencies = findings.reduce(
    (sum, f) => sum + (f.inconsistencies?.length || 0), 0
  );

  return {
    sceneComparisons,
    totalIssues,
    totalInconsistencies,
    findings
  };
}

// ============================================================================
// CLI Interface
// ============================================================================

if (import.meta.url === `file://${process.argv[1]}`) {
  const projectPath = process.argv[2];

  if (!projectPath) {
    console.error('Usage: node analyze-consistent-navigation.js <unity-project-path>');
    process.exit(1);
  }

  console.log('='.repeat(80));
  console.log('WCAG 3.2.3: Consistent Navigation Analysis');
  console.log('='.repeat(80));

  analyzeConsistentNavigation(projectPath)
    .then(findings => {
      const report = generateConsistentNavigationReport(findings);

      console.log(`\n${'='.repeat(80)}`);
      console.log('ANALYSIS SUMMARY');
      console.log('='.repeat(80));
      console.log(`Scene Comparisons: ${report.sceneComparisons}`);
      console.log(`Total Issues: ${report.totalIssues}`);
      console.log(`Total Inconsistencies: ${report.totalInconsistencies}`);

      if (findings.length > 0 && report.totalIssues > 0) {
        console.log(`\n${'='.repeat(80)}`);
        console.log('FINDINGS');
        console.log('='.repeat(80));

        for (const finding of findings) {
          if (finding.severity === 'info') continue;

          console.log(`\n[${finding.severity.toUpperCase()}] ${finding.baseScene} vs ${finding.currentScene}`);
          console.log(`  Issue: ${finding.issue}`);

          if (finding.inconsistencies && finding.inconsistencies.length > 0) {
            console.log(`  Inconsistencies:`);
            finding.inconsistencies.forEach(inc => {
              console.log(`    - ${inc.issue}`);
            });
          }

          console.log(`  Recommendation: ${finding.recommendation}`);

          if (finding.howToFix) {
            console.log(`  How to Fix:`);
            finding.howToFix.forEach(step => console.log(`    ${step}`));
          }
        }
      } else {
        console.log('\n✓ Navigation is consistent across all scenes!');
      }

      // Save JSON report
      const outputPath = path.join(process.cwd(), 'consistent-navigation-report.json');
      fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
      console.log(`\nDetailed report saved to: ${outputPath}`);
    })
    .catch(err => {
      console.error('Error analyzing navigation consistency:', err);
      process.exit(1);
    });
}
