#!/usr/bin/env node

/**
 * Scene Title Analyzer - WCAG 2.4.2 (Level A)
 *
 * Analyzes Unity scenes to ensure each scene has a descriptive title that:
 * - Describes the topic or purpose of the scene
 * - Is programmatically determined for assistive technologies
 * - Has proper accessibility markup (AccessibilityNode with role="heading")
 *
 * WCAG 2.4.2: Page Titled
 * https://www.w3.org/WAI/WCAG22/Understanding/page-titled
 *
 * Automation Level: 85%
 */

import fs from 'fs';
import path from 'path';
import { findSceneFiles, parseUnityScene, findGameObjectsByName, findTextComponents } from './utils/unity-scene-parser.js';

/**
 * Analyze all scenes for proper titles
 * @param {string} projectPath - Path to Unity project
 * @returns {Promise<Array>} Array of findings
 */
export async function analyzeSceneTitles(projectPath) {
  const findings = [];

  // Step 1: Find all Unity scenes
  const scenes = findSceneFiles(projectPath);

  if (scenes.length === 0) {
    return [{
      wcagCriterion: '2.4.2',
      severity: 'info',
      issue: 'No Unity scene files found',
      recommendation: 'Ensure Unity project path contains Assets/Scenes directory'
    }];
  }

  console.log(`\nAnalyzing scene titles for ${scenes.length} scenes...`);

  for (const scene of scenes) {
    try {
      // Step 2: Parse scene
      const sceneData = parseUnityScene(scene.path);

      // Step 3: Look for title/heading GameObjects
      const titleFound = findSceneTitle(sceneData);

      if (!titleFound) {
        findings.push({
          wcagCriterion: '2.4.2',
          level: 'A',
          severity: 'medium',
          scene: scene.name,
          scenePath: scene.path,
          issue: 'No scene title or heading detected',
          explanation: 'Each scene should have a descriptive title that announces the scene purpose to screen reader users',
          recommendation: 'Add a GameObject with "Title", "Heading", or "Header" in the name containing a Text or TextMeshPro component',
          howToFix: [
            '1. Create a UI Text or TextMeshPro GameObject named "SceneTitle" or "Heading"',
            '2. Add descriptive text that explains the scene purpose',
            '3. Add an AccessibilityNode component with role="heading" and level="1"',
            '4. Ensure the title is announced when the scene loads'
          ]
        });
      } else if (!titleFound.accessible) {
        findings.push({
          wcagCriterion: '2.4.2',
          level: 'A',
          severity: 'medium',
          scene: scene.name,
          scenePath: scene.path,
          title: titleFound.text,
          issue: 'Title not accessible to assistive technologies',
          explanation: 'Title exists but lacks proper accessibility markup for screen readers',
          recommendation: `Add AccessibilityNode with role="heading" to "${titleFound.name}" GameObject`,
          howToFix: [
            `1. Select the "${titleFound.name}" GameObject in Unity`,
            '2. Add an AccessibilityNode component',
            '3. Set role = "heading"',
            '4. Set level = 1 (for main scene title)',
            '5. Optionally set label to match the visible text'
          ]
        });
      } else if (!isDescriptiveTitle(titleFound.text)) {
        findings.push({
          wcagCriterion: '2.4.2',
          level: 'A',
          severity: 'low',
          scene: scene.name,
          scenePath: scene.path,
          title: titleFound.text,
          issue: 'Title may not be sufficiently descriptive',
          explanation: 'Title should clearly describe the scene purpose or topic',
          recommendation: `Consider making the title more descriptive. Current: "${titleFound.text}"`,
          howToFix: [
            '1. Review the title text to ensure it clearly describes the scene',
            '2. Avoid generic titles like "Scene", "Menu", "Level"',
            '3. Use descriptive titles like "Main Menu", "Settings Screen", "Level 1: Forest Path"'
          ]
        });
      }

    } catch (err) {
      findings.push({
        wcagCriterion: '2.4.2',
        severity: 'error',
        scene: scene.name,
        scenePath: scene.path,
        issue: `Failed to parse scene: ${err.message}`,
        recommendation: 'Ensure scene file is valid Unity YAML format'
      });
    }
  }

  return findings;
}

/**
 * Find the scene title GameObject
 * @param {Object} sceneData - Parsed scene data
 * @returns {Object|null} Title info or null
 */
function findSceneTitle(sceneData) {
  // Look for GameObjects with title-related names
  const titlePatterns = [
    /title/i,
    /heading/i,
    /header/i,
    /scene.*name/i,
    /page.*title/i
  ];

  for (const pattern of titlePatterns) {
    const matches = findGameObjectsByName(sceneData, pattern);

    for (const gameObject of matches) {
      // Check if it has a Text or TextMeshPro component
      const textComponents = findTextComponents(sceneData);
      const textComponent = textComponents.find(
        tc => tc.gameObjectId === gameObject.m_FileID
      );

      if (textComponent && textComponent.text) {
        // Check for AccessibilityNode component
        const hasAccessibilityNode = checkAccessibilityNode(sceneData, gameObject.m_FileID);

        return {
          name: gameObject.m_Name,
          text: textComponent.text,
          accessible: hasAccessibilityNode
        };
      }
    }
  }

  // Also check text components directly for title-like content
  const textComponents = findTextComponents(sceneData);
  for (const textComponent of textComponents) {
    const gameObject = sceneData.gameObjects.find(
      go => go.m_FileID === textComponent.gameObjectId
    );

    if (gameObject && isTitleLikeText(textComponent.text, gameObject.m_Name)) {
      const hasAccessibilityNode = checkAccessibilityNode(sceneData, gameObject.m_FileID);

      return {
        name: gameObject.m_Name,
        text: textComponent.text,
        accessible: hasAccessibilityNode
      };
    }
  }

  return null;
}

/**
 * Check if GameObject has AccessibilityNode with heading role
 * @param {Object} sceneData - Parsed scene data
 * @param {string} gameObjectId - GameObject fileID
 * @returns {boolean}
 */
function checkAccessibilityNode(sceneData, gameObjectId) {
  if (!sceneData.components.MonoBehaviour) return false;

  // Look for AccessibilityNode component
  for (const component of sceneData.components.MonoBehaviour) {
    if (component.m_GameObject?.fileID === gameObjectId) {
      // Check if it's an AccessibilityNode (various possible GUIDs)
      if (component.m_Script) {
        // AccessibilityNode has role property
        if (component.role === 'heading' || component.m_Role === 'heading') {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * Check if text looks like a title based on content
 * @param {string} text - Text content
 * @param {string} gameObjectName - GameObject name
 * @returns {boolean}
 */
function isTitleLikeText(text, gameObjectName) {
  if (!text || text.length === 0) return false;

  // Check GameObject name
  const titleKeywords = ['title', 'heading', 'header', 'name'];
  const nameLower = gameObjectName.toLowerCase();
  if (titleKeywords.some(keyword => nameLower.includes(keyword))) {
    return true;
  }

  // Check if text is short and capitalized (title-like)
  const words = text.trim().split(/\s+/);
  if (words.length <= 6) {
    // Check if most words are capitalized
    const capitalizedWords = words.filter(word =>
      word.length > 0 && word[0] === word[0].toUpperCase()
    );

    return capitalizedWords.length >= words.length * 0.7;
  }

  return false;
}

/**
 * Check if title text is descriptive
 * @param {string} text - Title text
 * @returns {boolean}
 */
function isDescriptiveTitle(text) {
  if (!text || text.trim().length < 3) return false;

  // Generic/vague titles to flag
  const vagueTitles = [
    /^scene$/i,
    /^menu$/i,
    /^level$/i,
    /^screen$/i,
    /^page$/i,
    /^title$/i,
    /^untitled$/i,
    /^new scene$/i,
    /^test$/i
  ];

  const trimmed = text.trim();

  for (const pattern of vagueTitles) {
    if (pattern.test(trimmed)) {
      return false;
    }
  }

  // Title should have at least some meaningful content
  return trimmed.length >= 3;
}

/**
 * Generate report for scene title analysis
 * @param {Array} findings - Analysis findings
 * @returns {Object} Report summary
 */
export function generateSceneTitleReport(findings) {
  const totalScenes = new Set(findings.map(f => f.scene)).size;
  const missingTitles = findings.filter(f => f.issue.includes('No scene title')).length;
  const inaccessibleTitles = findings.filter(f => f.issue.includes('not accessible')).length;
  const vagTitles = findings.filter(f => f.issue.includes('not be sufficiently descriptive')).length;
  const errors = findings.filter(f => f.severity === 'error').length;

  return {
    totalScenes,
    issues: {
      missingTitles,
      inaccessibleTitles,
      vagTitles,
      errors
    },
    passRate: totalScenes > 0
      ? ((totalScenes - missingTitles - inaccessibleTitles) / totalScenes * 100).toFixed(1)
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
    console.error('Usage: node analyze-scene-titles.js <unity-project-path>');
    process.exit(1);
  }

  console.log('='.repeat(80));
  console.log('WCAG 2.4.2: Page Titled - Scene Title Analysis');
  console.log('='.repeat(80));

  analyzeSceneTitles(projectPath)
    .then(findings => {
      const report = generateSceneTitleReport(findings);

      console.log(`\n${'='.repeat(80)}`);
      console.log('ANALYSIS SUMMARY');
      console.log('='.repeat(80));
      console.log(`Total Scenes Analyzed: ${report.totalScenes}`);
      console.log(`Missing Titles: ${report.issues.missingTitles}`);
      console.log(`Inaccessible Titles: ${report.issues.inaccessibleTitles}`);
      console.log(`Vague Titles: ${report.issues.vagTitles}`);
      console.log(`Errors: ${report.issues.errors}`);
      console.log(`Pass Rate: ${report.passRate}%`);

      if (findings.length > 0) {
        console.log(`\n${'='.repeat(80)}`);
        console.log('FINDINGS');
        console.log('='.repeat(80));

        for (const finding of findings) {
          console.log(`\n[${ finding.severity.toUpperCase()}] ${finding.scene}`);
          console.log(`  Issue: ${finding.issue}`);
          if (finding.title) {
            console.log(`  Current Title: "${finding.title}"`);
          }
          console.log(`  Recommendation: ${finding.recommendation}`);

          if (finding.howToFix) {
            console.log(`  How to Fix:`);
            finding.howToFix.forEach(step => console.log(`    ${step}`));
          }
        }
      } else {
        console.log('\n✓ All scenes have proper, accessible titles!');
      }

      // Save JSON report
      const outputPath = path.join(process.cwd(), 'scene-title-report.json');
      fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
      console.log(`\nDetailed report saved to: ${outputPath}`);
    })
    .catch(err => {
      console.error('Error analyzing scene titles:', err);
      process.exit(1);
    });
}
