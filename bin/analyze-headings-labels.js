#!/usr/bin/env node

/**
 * Headings and Labels Analyzer - WCAG 2.4.6 (Level AA)
 *
 * Analyzes Unity scenes to ensure headings and labels:
 * - Describe their topic or purpose
 * - Are programmatically determined and associated with controls
 * - Provide clear, meaningful information to users
 *
 * WCAG 2.4.6: Headings and Labels
 * https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels
 *
 * Automation Level: 75%
 */

import fs from 'fs';
import path from 'path';
import {
  findSceneFiles,
  parseUnityScene,
  findGameObjectsByName,
  findTextComponents,
  findInteractiveElements
} from './utils/unity-scene-parser.js';

/**
 * Analyze all scenes for proper headings and labels
 * @param {string} projectPath - Path to Unity project
 * @returns {Promise<Array>} Array of findings
 */
export async function analyzeHeadingsAndLabels(projectPath) {
  const findings = [];

  // Find all Unity scenes
  const scenes = findSceneFiles(projectPath);

  if (scenes.length === 0) {
    return [{
      wcagCriterion: '2.4.6',
      severity: 'info',
      issue: 'No Unity scene files found'
    }];
  }

  console.log(`\nAnalyzing headings and labels for ${scenes.length} scenes...`);

  for (const scene of scenes) {
    try {
      const sceneData = parseUnityScene(scene.path);

      // Analyze labels
      const labelFindings = analyzeLabels(sceneData, scene.name, scene.path);
      findings.push(...labelFindings);

      // Analyze headings
      const headingFindings = analyzeHeadings(sceneData, scene.name, scene.path);
      findings.push(...headingFindings);

    } catch (err) {
      findings.push({
        wcagCriterion: '2.4.6',
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
 * Analyze labels in a scene
 * @param {Object} sceneData - Parsed scene data
 * @param {string} sceneName - Scene name
 * @param {string} scenePath - Scene file path
 * @returns {Array} Label findings
 */
function analyzeLabels(sceneData, sceneName, scenePath) {
  const findings = [];
  const textComponents = findTextComponents(sceneData);
  const interactiveElements = findInteractiveElements(sceneData);

  // Find labels (text components that might label other elements)
  const potentialLabels = textComponents.filter(tc => {
    const gameObject = sceneData.gameObjects.find(go => go.m_FileID === tc.gameObjectId);
    if (!gameObject) return false;

    const name = gameObject.m_Name.toLowerCase();
    return name.includes('label') ||
           name.includes('text') ||
           name.includes('description');
  });

  for (const label of potentialLabels) {
    const gameObject = sceneData.gameObjects.find(go => go.m_FileID === label.gameObjectId);
    const labelText = label.text || '';

    // Check if label text is descriptive
    if (isVagueLabel(labelText)) {
      findings.push({
        wcagCriterion: '2.4.6',
        level: 'AA',
        severity: 'medium',
        scene: sceneName,
        scenePath: scenePath,
        element: gameObject.m_Name,
        text: labelText,
        issue: 'Label text is not descriptive',
        explanation: 'Labels should clearly describe the purpose or expected input of the associated control',
        recommendation: `Make label more descriptive. Current: "${labelText}"`,
        howToFix: [
          '1. Review the label text for clarity',
          '2. Ensure it describes what the control does or what input is expected',
          '3. Avoid vague terms like "click here", "submit", "field", etc.',
          '4. Use specific, meaningful labels like "Email Address", "Submit Form", "Player Name"'
        ]
      });
    }

    // Check if label is too short
    if (labelText.trim().length < 2 && labelText.trim().length > 0) {
      findings.push({
        wcagCriterion: '2.4.6',
        level: 'AA',
        severity: 'low',
        scene: sceneName,
        scenePath: scenePath,
        element: gameObject.m_Name,
        text: labelText,
        issue: 'Label text is too short',
        recommendation: 'Provide more descriptive label text (at least 2 characters)'
      });
    }

    // Check if label might be associated with an input
    const nearbyInput = findNearbyInput(sceneData, label.gameObjectId, interactiveElements);
    if (nearbyInput) {
      // Check for programmatic association
      const isLinked = checkLabelInputAssociation(sceneData, label.gameObjectId, nearbyInput.gameObjectId);

      if (!isLinked) {
        findings.push({
          wcagCriterion: '2.4.6',
          level: 'AA',
          severity: 'high',
          scene: sceneName,
          scenePath: scenePath,
          element: gameObject.m_Name,
          text: labelText,
          input: nearbyInput.type,
          issue: 'Label not programmatically associated with input field',
          explanation: 'Screen readers need programmatic associations to announce labels with their controls',
          recommendation: 'Use AccessibilityNode to link label with input',
          howToFix: [
            '1. Add AccessibilityNode component to both label and input GameObjects',
            '2. Set the label\'s role to "label"',
            '3. Use the "for" or "labeledBy" property to create the association',
            '4. Ensure the input announces the label text when focused'
          ]
        });
      }
    }
  }

  // Check for inputs without labels
  for (const input of interactiveElements) {
    const hasLabel = potentialLabels.some(label =>
      checkLabelInputAssociation(sceneData, label.gameObjectId, input.gameObjectId)
    );

    if (!hasLabel && (input.type === 'InputField' || input.type === 'Toggle' || input.type === 'Slider')) {
      const gameObject = sceneData.gameObjects.find(go => go.m_FileID === input.gameObjectId);

      findings.push({
        wcagCriterion: '2.4.6',
        level: 'AA',
        severity: 'high',
        scene: sceneName,
        scenePath: scenePath,
        element: gameObject?.m_Name || 'Unknown',
        inputType: input.type,
        issue: `${input.type} has no associated label`,
        explanation: 'All form controls must have visible and programmatically associated labels',
        recommendation: `Add a label for this ${input.type}`,
        howToFix: [
          `1. Create a UI Text or TextMeshPro GameObject near the ${input.type}`,
          '2. Add descriptive label text',
          '3. Add AccessibilityNode to both label and input',
          '4. Link them using the "for" or "labeledBy" property'
        ]
      });
    }
  }

  return findings;
}

/**
 * Analyze headings in a scene
 * @param {Object} sceneData - Parsed scene data
 * @param {string} sceneName - Scene name
 * @param {string} scenePath - Scene file path
 * @returns {Array} Heading findings
 */
function analyzeHeadings(sceneData, sceneName, scenePath) {
  const findings = [];
  const textComponents = findTextComponents(sceneData);

  // Find potential headings
  const potentialHeadings = textComponents.filter(tc => {
    const gameObject = sceneData.gameObjects.find(go => go.m_FileID === tc.gameObjectId);
    if (!gameObject) return false;

    const name = gameObject.m_Name.toLowerCase();
    return name.includes('heading') ||
           name.includes('header') ||
           name.includes('title') ||
           name.includes('section');
  });

  for (const heading of potentialHeadings) {
    const gameObject = sceneData.gameObjects.find(go => go.m_FileID === heading.gameObjectId);
    const headingText = heading.text || '';

    // Check if heading has proper accessibility role
    const hasHeadingRole = checkHeadingRole(sceneData, heading.gameObjectId);

    if (!hasHeadingRole) {
      findings.push({
        wcagCriterion: '2.4.6',
        level: 'AA',
        severity: 'medium',
        scene: sceneName,
        scenePath: scenePath,
        element: gameObject.m_Name,
        text: headingText,
        issue: 'Heading lacks proper accessibility role',
        explanation: 'Headings must be marked with role="heading" for screen readers',
        recommendation: 'Add AccessibilityNode with role="heading"',
        howToFix: [
          `1. Select the "${gameObject.m_Name}" GameObject`,
          '2. Add AccessibilityNode component',
          '3. Set role = "heading"',
          '4. Set level (1-6) based on heading hierarchy'
        ]
      });
    }

    // Check if heading text is descriptive
    if (headingText.trim().length < 3) {
      findings.push({
        wcagCriterion: '2.4.6',
        level: 'AA',
        severity: 'medium',
        scene: sceneName,
        scenePath: scenePath,
        element: gameObject.m_Name,
        text: headingText,
        issue: 'Heading text is too short or empty',
        recommendation: 'Provide descriptive heading text that describes the section'
      });
    }
  }

  return findings;
}

/**
 * Check if label text is vague or non-descriptive
 * @param {string} text - Label text
 * @returns {boolean}
 */
function isVagueLabel(text) {
  const vagueTerms = [
    /^click here$/i,
    /^here$/i,
    /^submit$/i,
    /^ok$/i,
    /^button$/i,
    /^field$/i,
    /^input$/i,
    /^select$/i,
    /^choose$/i,
    /^enter$/i,
    /^text$/i,
    /^label$/i,
    /^\?$/,
    /^!$/,
    /^\.\.\.$/
  ];

  const trimmed = text.trim().toLowerCase();

  return vagueTerms.some(pattern => pattern.test(trimmed));
}

/**
 * Find input element near a label (simple proximity check)
 * @param {Object} sceneData - Parsed scene data
 * @param {string} labelId - Label GameObject ID
 * @param {Array} interactiveElements - List of interactive elements
 * @returns {Object|null}
 */
function findNearbyInput(sceneData, labelId, interactiveElements) {
  // Simple heuristic: check if GameObject name contains "Label" and there's a
  // corresponding input with similar name
  const labelGO = sceneData.gameObjects.find(go => go.m_FileID === labelId);
  if (!labelGO) return null;

  const labelName = labelGO.m_Name.toLowerCase();

  // Look for input with similar name
  for (const input of interactiveElements) {
    const inputGO = sceneData.gameObjects.find(go => go.m_FileID === input.gameObjectId);
    if (!inputGO) continue;

    const inputName = inputGO.m_Name.toLowerCase();

    // Check if they share a common prefix (e.g., "Email" in "EmailLabel" and "EmailInput")
    const labelBase = labelName.replace(/label|text|lbl/g, '').trim();
    const inputBase = inputName.replace(/input|field|btn|button/g, '').trim();

    if (labelBase.length > 2 && labelBase === inputBase) {
      return input;
    }
  }

  return null;
}

/**
 * Check if label and input are programmatically associated
 * @param {Object} sceneData - Parsed scene data
 * @param {string} labelId - Label GameObject ID
 * @param {string} inputId - Input GameObject ID
 * @returns {boolean}
 */
function checkLabelInputAssociation(sceneData, labelId, inputId) {
  if (!sceneData.components.MonoBehaviour) return false;

  // Look for AccessibilityNode components that link label and input
  const labelNode = sceneData.components.MonoBehaviour.find(
    c => c.m_GameObject?.fileID === labelId && c.role === 'label'
  );

  const inputNode = sceneData.components.MonoBehaviour.find(
    c => c.m_GameObject?.fileID === inputId
  );

  if (labelNode && inputNode) {
    // Check if they reference each other
    return labelNode.for === inputId || inputNode.labeledBy === labelId;
  }

  return false;
}

/**
 * Check if element has heading role
 * @param {Object} sceneData - Parsed scene data
 * @param {string} elementId - Element GameObject ID
 * @returns {boolean}
 */
function checkHeadingRole(sceneData, elementId) {
  if (!sceneData.components.MonoBehaviour) return false;

  return sceneData.components.MonoBehaviour.some(
    c => c.m_GameObject?.fileID === elementId &&
         (c.role === 'heading' || c.m_Role === 'heading')
  );
}

/**
 * Generate report for headings and labels analysis
 * @param {Array} findings - Analysis findings
 * @returns {Object} Report summary
 */
export function generateHeadingsLabelsReport(findings) {
  const totalIssues = findings.length;
  const vagueLabels = findings.filter(f => f.issue.includes('not descriptive')).length;
  const missingAssociations = findings.filter(f => f.issue.includes('not programmatically associated')).length;
  const missingLabels = findings.filter(f => f.issue.includes('has no associated label')).length;
  const missingHeadingRoles = findings.filter(f => f.issue.includes('Heading lacks proper')).length;

  return {
    totalIssues,
    issues: {
      vagueLabels,
      missingAssociations,
      missingLabels,
      missingHeadingRoles
    },
    findings
  };
}

// ============================================================================
// CLI Interface
// ============================================================================

if (import.meta.url === `file://${process.argv[1]}`) {
  const projectPath = process.argv[2];

  if (!projectPath) {
    console.error('Usage: node analyze-headings-labels.js <unity-project-path>');
    process.exit(1);
  }

  console.log('='.repeat(80));
  console.log('WCAG 2.4.6: Headings and Labels Analysis');
  console.log('='.repeat(80));

  analyzeHeadingsAndLabels(projectPath)
    .then(findings => {
      const report = generateHeadingsLabelsReport(findings);

      console.log(`\n${'='.repeat(80)}`);
      console.log('ANALYSIS SUMMARY');
      console.log('='.repeat(80));
      console.log(`Total Issues Found: ${report.totalIssues}`);
      console.log(`Vague Labels: ${report.issues.vagueLabels}`);
      console.log(`Missing Associations: ${report.issues.missingAssociations}`);
      console.log(`Missing Labels: ${report.issues.missingLabels}`);
      console.log(`Missing Heading Roles: ${report.issues.missingHeadingRoles}`);

      if (findings.length > 0) {
        console.log(`\n${'='.repeat(80)}`);
        console.log('FINDINGS');
        console.log('='.repeat(80));

        for (const finding of findings) {
          console.log(`\n[${finding.severity.toUpperCase()}] ${finding.scene} - ${finding.element}`);
          console.log(`  Issue: ${finding.issue}`);
          if (finding.text) {
            console.log(`  Text: "${finding.text}"`);
          }
          console.log(`  Recommendation: ${finding.recommendation}`);

          if (finding.howToFix) {
            console.log(`  How to Fix:`);
            finding.howToFix.forEach(step => console.log(`    ${step}`));
          }
        }
      } else {
        console.log('\n✓ All headings and labels are properly implemented!');
      }

      // Save JSON report
      const outputPath = path.join(process.cwd(), 'headings-labels-report.json');
      fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
      console.log(`\nDetailed report saved to: ${outputPath}`);
    })
    .catch(err => {
      console.error('Error analyzing headings and labels:', err);
      process.exit(1);
    });
}
