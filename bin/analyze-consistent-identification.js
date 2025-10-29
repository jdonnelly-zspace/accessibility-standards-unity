#!/usr/bin/env node

/**
 * Consistent Identification Analyzer - WCAG 3.2.4 (Level AA)
 *
 * Analyzes Unity scenes to ensure components with the same functionality
 * are identified consistently across different scenes.
 *
 * WCAG 3.2.4: Consistent Identification
 * https://www.w3.org/WAI/WCAG22/Understanding/consistent-identification
 *
 * Automation Level: 75%
 */

import fs from 'fs';
import path from 'path';
import {
  findSceneFiles,
  parseUnityScene,
  findInteractiveElements,
  findTextComponents
} from './utils/unity-scene-parser.js';

/**
 * Analyze component identification consistency across all scenes
 * @param {string} projectPath - Path to Unity project
 * @returns {Promise<Array>} Array of findings
 */
export async function analyzeConsistentIdentification(projectPath) {
  const findings = [];

  const scenes = findSceneFiles(projectPath);

  if (scenes.length < 2) {
    return [{
      wcagCriterion: '3.2.4',
      severity: 'info',
      issue: 'Need at least 2 scenes to check identification consistency'
    }];
  }

  console.log(`\nAnalyzing component identification consistency across ${scenes.length} scenes...`);

  // Step 1: Build database of UI components across all scenes
  const componentDatabase = {};

  for (const scene of scenes) {
    try {
      const sceneData = parseUnityScene(scene.path);

      // Extract all interactive components
      const components = extractAllComponents(sceneData);

      for (const component of components) {
        // Group by function type
        const functionType = determineFunctionType(component);

        if (!componentDatabase[functionType]) {
          componentDatabase[functionType] = [];
        }

        componentDatabase[functionType].push({
          scene: scene.name,
          scenePath: scene.path,
          name: component.name,
          label: component.label,
          icon: component.icon,
          type: component.type
        });
      }

    } catch (err) {
      findings.push({
        wcagCriterion: '3.2.4',
        severity: 'error',
        scene: scene.name,
        issue: `Failed to parse scene: ${err.message}`
      });
    }
  }

  // Step 2: Check for inconsistent identification
  for (const [functionType, instances] of Object.entries(componentDatabase)) {
    if (instances.length < 2) continue; // Need at least 2 instances to compare

    // Step 3: Check if all instances use same label
    const inconsistencies = findLabelInconsistencies(functionType, instances);

    if (inconsistencies.length > 0) {
      findings.push({
        wcagCriterion: '3.2.4',
        level: 'AA',
        severity: 'medium',
        functionType: functionType,
        issue: `Components with same functionality have inconsistent labels`,
        explanation: 'When the same button/control appears in multiple scenes, it should have the same label for consistency',
        inconsistencies: inconsistencies,
        recommendation: `Use consistent label for all ${functionType} components`,
        howToFix: [
          '1. Review all instances of this component across scenes',
          '2. Choose the most descriptive label',
          '3. Update all instances to use the same label',
          '4. Consider using prefabs to maintain consistency',
          '5. Add this to your style guide'
        ]
      });
    }
  }

  return findings;
}

/**
 * Extract all interactive components from a scene
 * @param {Object} sceneData - Parsed scene data
 * @returns {Array} Components with labels
 */
function extractAllComponents(sceneData) {
  const components = [];
  const interactive = findInteractiveElements(sceneData);
  const textComponents = findTextComponents(sceneData);

  for (const element of interactive) {
    const gameObject = sceneData.gameObjects.find(
      go => go.m_FileID === element.gameObjectId
    );

    if (!gameObject) continue;

    // Find label text for this component
    let label = '';

    // Check for child text component
    const childText = textComponents.find(tc => {
      const textGO = sceneData.gameObjects.find(go => go.m_FileID === tc.gameObjectId);
      return textGO && isChildOf(sceneData, tc.gameObjectId, element.gameObjectId);
    });

    if (childText) {
      label = childText.text;
    }

    // Check for icon/image
    const hasIcon = hasImageComponent(sceneData, element.gameObjectId);

    components.push({
      gameObjectId: element.gameObjectId,
      name: gameObject.m_Name,
      type: element.type,
      label: label.trim(),
      icon: hasIcon ? 'has_icon' : 'no_icon'
    });
  }

  return components;
}

/**
 * Check if one GameObject is a child of another
 * @param {Object} sceneData - Parsed scene data
 * @param {string} childId - Potential child GameObject ID
 * @param {string} parentId - Potential parent GameObject ID
 * @returns {boolean}
 */
function isChildOf(sceneData, childId, parentId) {
  // Find transforms
  const childTransform = sceneData.components.Transform?.find(
    t => t.m_GameObject?.fileID === childId
  ) || sceneData.components.RectTransform?.find(
    t => t.m_GameObject?.fileID === childId
  );

  if (!childTransform) return false;

  // Check if parent matches
  const parentRef = childTransform.m_Father?.fileID;
  return parentRef === parentId;
}

/**
 * Check if GameObject has an Image component
 * @param {Object} sceneData - Parsed scene data
 * @param {string} gameObjectId - GameObject ID
 * @returns {boolean}
 */
function hasImageComponent(sceneData, gameObjectId) {
  if (!sceneData.components.MonoBehaviour) return false;

  return sceneData.components.MonoBehaviour.some(
    c => c.m_GameObject?.fileID === gameObjectId &&
         c.m_Script?.guid === 'fe87c0e1cc204ed48ad3b37840f39efc' // UI.Image GUID
  );
}

/**
 * Determine the functional type of a component
 * @param {Object} component - Component data
 * @returns {string} Function type
 */
function determineFunctionType(component) {
  const name = component.name.toLowerCase();
  const label = component.label.toLowerCase();

  // Common functional patterns
  const patterns = [
    { keywords: ['back', 'return', 'previous'], type: 'BackButton' },
    { keywords: ['next', 'continue', 'forward'], type: 'NextButton' },
    { keywords: ['save'], type: 'SaveButton' },
    { keywords: ['cancel'], type: 'CancelButton' },
    { keywords: ['delete', 'remove'], type: 'DeleteButton' },
    { keywords: ['help', '?'], type: 'HelpButton' },
    { keywords: ['settings', 'options', 'preferences'], type: 'SettingsButton' },
    { keywords: ['close', 'exit'], type: 'CloseButton' },
    { keywords: ['submit', 'send'], type: 'SubmitButton' },
    { keywords: ['search', 'find'], type: 'SearchButton' },
    { keywords: ['play', 'start'], type: 'PlayButton' },
    { keywords: ['pause'], type: 'PauseButton' },
    { keywords: ['stop'], type: 'StopButton' },
    { keywords: ['home', 'main'], type: 'HomeButton' },
    { keywords: ['menu'], type: 'MenuButton' }
  ];

  // Check name and label against patterns
  for (const pattern of patterns) {
    if (pattern.keywords.some(kw => name.includes(kw) || label.includes(kw))) {
      return pattern.type;
    }
  }

  // If no specific pattern matched, use the component type
  return component.type || 'UnknownComponent';
}

/**
 * Find label inconsistencies for a function type
 * @param {string} functionType - Function type
 * @param {Array} instances - Component instances
 * @returns {Array} Inconsistencies
 */
function findLabelInconsistencies(functionType, instances) {
  const inconsistencies = [];

  // Group instances by label
  const labelGroups = {};

  for (const instance of instances) {
    const normalizedLabel = normalizeLabel(instance.label);

    if (!labelGroups[normalizedLabel]) {
      labelGroups[normalizedLabel] = [];
    }

    labelGroups[normalizedLabel].push(instance);
  }

  // If there's more than one label used, we have inconsistencies
  const labels = Object.keys(labelGroups).filter(l => l.length > 0);

  if (labels.length > 1) {
    // Find the most common label
    const labelCounts = labels.map(label => ({
      label,
      count: labelGroups[label].length,
      scenes: labelGroups[label].map(i => i.scene)
    }));

    labelCounts.sort((a, b) => b.count - a.count);

    const mostCommon = labelCounts[0];
    const others = labelCounts.slice(1);

    for (const other of others) {
      inconsistencies.push({
        expectedLabel: mostCommon.label || '(empty)',
        actualLabel: other.label || '(empty)',
        expectedIn: mostCommon.scenes,
        foundIn: other.scenes,
        message: `Label "${other.label}" used in ${other.scenes.join(', ')}, but "${mostCommon.label}" is more common (used in ${mostCommon.scenes.join(', ')})`
      });
    }
  }

  // Also check for empty labels
  const emptyLabelInstances = instances.filter(i => !i.label || i.label.trim().length === 0);

  if (emptyLabelInstances.length > 0 && emptyLabelInstances.length < instances.length) {
    inconsistencies.push({
      expectedLabel: '(has label)',
      actualLabel: '(no label)',
      foundIn: emptyLabelInstances.map(i => i.scene),
      message: `Missing labels in ${emptyLabelInstances.map(i => i.scene).join(', ')}`
    });
  }

  return inconsistencies;
}

/**
 * Normalize label for comparison
 * @param {string} label - Label text
 * @returns {string} Normalized label
 */
function normalizeLabel(label) {
  if (!label) return '';

  return label
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ');
}

/**
 * Generate report for consistent identification analysis
 * @param {Array} findings - Analysis findings
 * @returns {Object} Report summary
 */
export function generateConsistentIdentificationReport(findings) {
  const totalIssues = findings.filter(f => f.severity !== 'info').length;
  const functionTypesAffected = new Set(
    findings.filter(f => f.functionType).map(f => f.functionType)
  ).size;

  const totalInconsistencies = findings.reduce(
    (sum, f) => sum + (f.inconsistencies?.length || 0), 0
  );

  return {
    totalIssues,
    functionTypesAffected,
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
    console.error('Usage: node analyze-consistent-identification.js <unity-project-path>');
    process.exit(1);
  }

  console.log('='.repeat(80));
  console.log('WCAG 3.2.4: Consistent Identification Analysis');
  console.log('='.repeat(80));

  analyzeConsistentIdentification(projectPath)
    .then(findings => {
      const report = generateConsistentIdentificationReport(findings);

      console.log(`\n${'='.repeat(80)}`);
      console.log('ANALYSIS SUMMARY');
      console.log('='.repeat(80));
      console.log(`Total Issues: ${report.totalIssues}`);
      console.log(`Function Types Affected: ${report.functionTypesAffected}`);
      console.log(`Total Inconsistencies: ${report.totalInconsistencies}`);

      if (findings.length > 0 && report.totalIssues > 0) {
        console.log(`\n${'='.repeat(80)}`);
        console.log('FINDINGS');
        console.log('='.repeat(80));

        for (const finding of findings) {
          if (finding.severity === 'info' || finding.severity === 'error') continue;

          console.log(`\n[${finding.severity.toUpperCase()}] ${finding.functionType}`);
          console.log(`  Issue: ${finding.issue}`);

          if (finding.inconsistencies && finding.inconsistencies.length > 0) {
            console.log(`  Inconsistencies:`);
            finding.inconsistencies.forEach(inc => {
              console.log(`    - ${inc.message}`);
            });
          }

          console.log(`  Recommendation: ${finding.recommendation}`);

          if (finding.howToFix) {
            console.log(`  How to Fix:`);
            finding.howToFix.forEach(step => console.log(`    ${step}`));
          }
        }
      } else {
        console.log('\n✓ All components are consistently identified across scenes!');
      }

      // Save JSON report
      const outputPath = path.join(process.cwd(), 'consistent-identification-report.json');
      fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
      console.log(`\nDetailed report saved to: ${outputPath}`);
    })
    .catch(err => {
      console.error('Error analyzing consistent identification:', err);
      process.exit(1);
    });
}
