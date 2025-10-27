#!/usr/bin/env node

/**
 * ============================================================================
 * AUTOMATED ACCESSIBILITY FIX GENERATOR
 * ============================================================================
 *
 * Analyzes audit findings and generates specific code fixes for each issue.
 * Orchestrates all code generators and creates comprehensive fix report.
 *
 * USAGE:
 *   node generate-fixes.js <audit-json> [options]
 *
 * OPTIONS:
 *   --project <path>          Unity project path (required)
 *   --output <path>           Output directory (default: AccessibilityAudit/generated-fixes/)
 *   --min-severity <level>    Only generate fixes for issues >= severity (Critical|High|Medium|Low)
 *   --categories <cats>       Only generate fixes for specific categories (comma-separated)
 *   --scenes <scenes>         Only generate fixes for specific scenes (comma-separated)
 *   --dry-run                 Analyze and plan without generating code
 *
 * GENERATES:
 *   - generated-fixes/keyboard/       Keyboard navigation code
 *   - generated-fixes/focus/          Focus management code
 *   - generated-fixes/accessibility-api/  Screen reader support code
 *   - GENERATED-FIXES.md              Comprehensive fix report
 *
 * ============================================================================
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  defaultOutput: 'AccessibilityAudit/generated-fixes',
  severityLevels: ['Critical', 'High', 'Medium', 'Low'],
  codeGenerators: {
    keyboard: path.join(__dirname, 'code-generator', 'keyboard-scaffolding.js'),
    focus: path.join(__dirname, 'code-generator', 'focus-management.js'),
    accessibilityAPI: path.join(__dirname, 'code-generator', 'accessibility-api-integration.js')
  }
};

// ============================================================================
// MAIN FUNCTION
// ============================================================================

async function main() {
  const args = parseArgs();

  if (!args.auditJson || !args.projectPath) {
    console.error('Error: Audit JSON and project path required');
    printUsage();
    process.exit(1);
  }

  console.log('🔧 Automated Accessibility Fix Generator\n');
  console.log(`Audit File: ${args.auditJson}`);
  console.log(`Unity Project: ${args.projectPath}`);
  console.log(`Output: ${args.output}\n`);

  // Step 1: Load audit data
  console.log('Step 1: Loading audit findings...');
  const auditData = await loadAuditData(args.auditJson);
  console.log(`  ✓ Loaded ${auditData.findings.length} findings`);
  console.log(`  ✓ ${auditData.criticalCount} critical, ${auditData.highCount} high priority\n`);

  // Step 2: Analyze findings
  console.log('Step 2: Analyzing findings and planning fixes...');
  const analysis = await analyzeFindings(auditData, args);
  console.log(`  ✓ Requires keyboard navigation: ${analysis.needsKeyboard ? 'Yes' : 'No'}`);
  console.log(`  ✓ Requires focus management: ${analysis.needsFocus ? 'Yes' : 'No'}`);
  console.log(`  ✓ Requires screen reader support: ${analysis.needsScreenReader ? 'Yes' : 'No'}`);
  console.log(`  ✓ Scenes affected: ${analysis.affectedScenes.length}\n`);

  if (args.dryRun) {
    console.log('🔍 Dry run mode - showing planned fixes without generating code:\n');
    displayDryRunSummary(analysis);
    return;
  }

  // Step 3: Generate keyboard navigation code
  if (analysis.needsKeyboard) {
    console.log('Step 3: Generating keyboard navigation code...');
    await generateKeyboardFixes(args, analysis);
    console.log('  ✓ Keyboard navigation code generated\n');
  } else {
    console.log('Step 3: Skipping keyboard navigation (no issues found)\n');
  }

  // Step 4: Generate focus management code
  if (analysis.needsFocus) {
    console.log('Step 4: Generating focus management code...');
    await generateFocusFixes(args, analysis);
    console.log('  ✓ Focus management code generated\n');
  } else {
    console.log('Step 4: Skipping focus management (no issues found)\n');
  }

  // Step 5: Generate screen reader support code
  if (analysis.needsScreenReader) {
    console.log('Step 5: Generating screen reader support code...');
    await generateScreenReaderFixes(args, analysis);
    console.log('  ✓ Screen reader support code generated\n');
  } else {
    console.log('Step 5: Skipping screen reader support (no issues found)\n');
  }

  // Step 6: Generate specific fixes for each finding
  console.log('Step 6: Generating specific fix recommendations...');
  const specificFixes = await generateSpecificFixes(auditData, analysis, args);
  console.log(`  ✓ Generated ${specificFixes.length} specific fixes\n`);

  // Step 7: Generate comprehensive report
  console.log('Step 7: Generating fix report...');
  await generateFixReport(args.output, auditData, analysis, specificFixes);
  console.log('  ✓ GENERATED-FIXES.md created\n');

  console.log('✅ Fix generation complete!\n');
  console.log(`All generated files saved to: ${args.output}`);
  console.log('\nNext steps:');
  console.log('1. Review GENERATED-FIXES.md for complete fix guide');
  console.log('2. Copy generated .cs files to your Unity project Assets/ folder');
  console.log('3. Follow setup instructions in each subdirectory');
  console.log('4. Test fixes in Unity Editor');
  console.log('5. Run audit again to verify issues are resolved');
}

// ============================================================================
// DATA LOADING
// ============================================================================

async function loadAuditData(jsonPath) {
  if (!fs.existsSync(jsonPath)) {
    throw new Error(`Audit file not found: ${jsonPath}`);
  }

  const content = fs.readFileSync(jsonPath, 'utf-8');
  const data = JSON.parse(content);

  // Extract findings from various sections
  const findings = [];

  // Visual findings
  if (data.visualAccessibility && data.visualAccessibility.issues) {
    findings.push(...data.visualAccessibility.issues.map(issue => ({
      ...issue,
      category: 'Visual'
    })));
  }

  // Keyboard findings
  if (data.keyboardAccessibility && data.keyboardAccessibility.issues) {
    findings.push(...data.keyboardAccessibility.issues.map(issue => ({
      ...issue,
      category: 'Keyboard'
    })));
  }

  // Screen reader findings
  if (data.screenReaderAccessibility && data.screenReaderAccessibility.issues) {
    findings.push(...data.screenReaderAccessibility.issues.map(issue => ({
      ...issue,
      category: 'ScreenReader'
    })));
  }

  // Audio findings
  if (data.audioAccessibility && data.audioAccessibility.issues) {
    findings.push(...data.audioAccessibility.issues.map(issue => ({
      ...issue,
      category: 'Audio'
    })));
  }

  // Count by severity
  const criticalCount = findings.filter(f => f.severity === 'Critical').length;
  const highCount = findings.filter(f => f.severity === 'High').length;

  return {
    ...data,
    findings,
    criticalCount,
    highCount
  };
}

// ============================================================================
// ANALYSIS
// ============================================================================

async function analyzeFindings(auditData, args) {
  const analysis = {
    needsKeyboard: false,
    needsFocus: false,
    needsScreenReader: false,
    affectedScenes: [],
    findingsByCategory: {},
    findingsBySeverity: {},
    findingsByScene: {},
    fixableFindings: [],
    manualFindings: []
  };

  // Filter findings by severity and categories
  let relevantFindings = auditData.findings;

  if (args.minSeverity) {
    const minIndex = CONFIG.severityLevels.indexOf(args.minSeverity);
    relevantFindings = relevantFindings.filter(f => {
      const fIndex = CONFIG.severityLevels.indexOf(f.severity);
      return fIndex !== -1 && fIndex <= minIndex;
    });
  }

  if (args.categories) {
    relevantFindings = relevantFindings.filter(f =>
      args.categories.includes(f.category)
    );
  }

  if (args.scenes) {
    relevantFindings = relevantFindings.filter(f =>
      args.scenes.includes(f.scene)
    );
  }

  // Analyze each finding
  for (const finding of relevantFindings) {
    // Determine fix category
    const fixType = determineFixType(finding);

    if (fixType.includes('keyboard')) analysis.needsKeyboard = true;
    if (fixType.includes('focus')) analysis.needsFocus = true;
    if (fixType.includes('screenReader')) analysis.needsScreenReader = true;

    // Track affected scenes
    if (finding.scene && !analysis.affectedScenes.includes(finding.scene)) {
      analysis.affectedScenes.push(finding.scene);
    }

    // Group by category
    if (!analysis.findingsByCategory[finding.category]) {
      analysis.findingsByCategory[finding.category] = [];
    }
    analysis.findingsByCategory[finding.category].push(finding);

    // Group by severity
    if (!analysis.findingsBySeverity[finding.severity]) {
      analysis.findingsBySeverity[finding.severity] = [];
    }
    analysis.findingsBySeverity[finding.severity].push(finding);

    // Group by scene
    if (finding.scene) {
      if (!analysis.findingsByScene[finding.scene]) {
        analysis.findingsByScene[finding.scene] = [];
      }
      analysis.findingsByScene[finding.scene].push(finding);
    }

    // Categorize as fixable or manual
    if (isAutomaticallyFixable(finding)) {
      analysis.fixableFindings.push(finding);
    } else {
      analysis.manualFindings.push(finding);
    }
  }

  return analysis;
}

function determineFixType(finding) {
  const types = [];

  const title = (finding.title || '').toLowerCase();
  const description = (finding.description || '').toLowerCase();
  const wcag = finding.wcagCriterion || '';

  // Keyboard issues
  if (title.includes('keyboard') ||
      description.includes('keyboard') ||
      wcag.startsWith('2.1.1') ||
      wcag.startsWith('2.1.2') ||
      wcag.startsWith('2.4.3')) {
    types.push('keyboard');
  }

  // Focus issues
  if (title.includes('focus') ||
      description.includes('focus indicator') ||
      wcag.startsWith('2.4.7')) {
    types.push('focus');
  }

  // Screen reader issues
  if (title.includes('screen reader') ||
      title.includes('label') ||
      description.includes('accessible name') ||
      wcag.startsWith('4.1.2') ||
      wcag.startsWith('4.1.3')) {
    types.push('screenReader');
  }

  return types.length > 0 ? types : ['manual'];
}

function isAutomaticallyFixable(finding) {
  const fixTypes = determineFixType(finding);

  // Only keyboard, focus, and screenReader issues are automatically fixable
  return fixTypes.some(type =>
    type === 'keyboard' || type === 'focus' || type === 'screenReader'
  );
}

// ============================================================================
// CODE GENERATION
// ============================================================================

async function generateKeyboardFixes(args, analysis) {
  const keyboardOutput = path.join(args.output, 'keyboard');

  const command = [
    `node "${CONFIG.codeGenerators.keyboard}"`,
    `"${args.projectPath}"`,
    `--output "${keyboardOutput}"`,
    analysis.affectedScenes.length > 0 ? `--scenes ${analysis.affectedScenes.join(',')}` : ''
  ].filter(Boolean).join(' ');

  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error('  ✗ Error generating keyboard code:', error.message);
  }
}

async function generateFocusFixes(args, analysis) {
  const focusOutput = path.join(args.output, 'focus');

  const command = [
    `node "${CONFIG.codeGenerators.focus}"`,
    `"${args.projectPath}"`,
    `--output "${focusOutput}"`,
    analysis.affectedScenes.length > 0 ? `--scenes ${analysis.affectedScenes.join(',')}` : ''
  ].filter(Boolean).join(' ');

  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error('  ✗ Error generating focus code:', error.message);
  }
}

async function generateScreenReaderFixes(args, analysis) {
  const srOutput = path.join(args.output, 'accessibility-api');

  const command = [
    `node "${CONFIG.codeGenerators.accessibilityAPI}"`,
    `"${args.projectPath}"`,
    `--output "${srOutput}"`,
    analysis.affectedScenes.length > 0 ? `--scenes ${analysis.affectedScenes.join(',')}` : ''
  ].filter(Boolean).join(' ');

  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error('  ✗ Error generating accessibility API code:', error.message);
  }
}

// ============================================================================
// SPECIFIC FIX GENERATION
// ============================================================================

async function generateSpecificFixes(auditData, analysis, args) {
  const fixes = [];

  for (const finding of analysis.fixableFindings) {
    const fix = {
      findingId: finding.id,
      scene: finding.scene,
      severity: finding.severity,
      wcagCriterion: finding.wcagCriterion,
      title: finding.title,
      description: finding.description,
      fixType: determineFixType(finding),
      generatedCode: null,
      manualSteps: [],
      testingInstructions: []
    };

    // Generate specific fix based on type
    if (fix.fixType.includes('keyboard')) {
      generateKeyboardSpecificFix(fix, finding);
    }

    if (fix.fixType.includes('focus')) {
      generateFocusSpecificFix(fix, finding);
    }

    if (fix.fixType.includes('screenReader')) {
      generateScreenReaderSpecificFix(fix, finding);
    }

    fixes.push(fix);
  }

  // Add manual fixes
  for (const finding of analysis.manualFindings) {
    const fix = {
      findingId: finding.id,
      scene: finding.scene,
      severity: finding.severity,
      wcagCriterion: finding.wcagCriterion,
      title: finding.title,
      description: finding.description,
      fixType: ['manual'],
      generatedCode: null,
      manualSteps: generateManualFix(finding),
      testingInstructions: []
    };

    fixes.push(fix);
  }

  return fixes;
}

function generateKeyboardSpecificFix(fix, finding) {
  fix.generatedCode = `// Keyboard navigation code has been generated in:
// generated-fixes/keyboard/KeyboardNavigationManager.cs
// generated-fixes/keyboard/${sanitizeIdentifier(finding.scene)}_KeyboardConfig.cs`;

  fix.manualSteps = [
    `1. Copy KeyboardNavigationManager.cs to Assets/Scripts/Accessibility/`,
    `2. Copy ${sanitizeIdentifier(finding.scene)}_KeyboardConfig.cs to Assets/Scripts/Accessibility/`,
    `3. In Unity, open ${finding.scene} scene`,
    `4. Add ${sanitizeIdentifier(finding.scene)}_KeyboardConfig component to a GameObject`,
    `5. Configure navigation settings in Inspector`,
    `6. Test keyboard navigation (Tab, Shift+Tab, Enter)`
  ];

  fix.testingInstructions = [
    `Press Tab to navigate forward through UI elements`,
    `Press Shift+Tab to navigate backward`,
    `Press Enter or Space to activate focused element`,
    `Verify all interactive elements are reachable`,
    `Verify focus order is logical`
  ];
}

function generateFocusSpecificFix(fix, finding) {
  fix.generatedCode = `// Focus management code has been generated in:
// generated-fixes/focus/FocusIndicator.cs
// generated-fixes/focus/${sanitizeIdentifier(finding.scene)}_FocusConfig.cs`;

  fix.manualSteps = [
    `1. Copy FocusIndicator.cs to Assets/Scripts/Accessibility/`,
    `2. Copy FocusManager.cs to Assets/Scripts/Accessibility/`,
    `3. Copy ${sanitizeIdentifier(finding.scene)}_FocusConfig.cs to Assets/Scripts/Accessibility/`,
    `4. In Unity, open ${finding.scene} scene`,
    `5. Add ${sanitizeIdentifier(finding.scene)}_FocusConfig component to a GameObject`,
    `6. Configure indicator color and thickness`,
    `7. Test focus indicator visibility`
  ];

  fix.testingInstructions = [
    `Press Tab to navigate UI elements`,
    `Verify focus indicator appears on current element`,
    `Check indicator has sufficient contrast (min 3:1)`,
    `Verify indicator doesn't obstruct content`,
    `Test with different UI backgrounds`
  ];
}

function generateScreenReaderSpecificFix(fix, finding) {
  fix.generatedCode = `// Screen reader support code has been generated in:
// generated-fixes/accessibility-api/AccessibleButton.cs
// generated-fixes/accessibility-api/${sanitizeIdentifier(finding.scene)}_AccessibilitySetup.cs`;

  fix.manualSteps = [
    `1. Ensure Unity 2023.2+ is installed`,
    `2. Copy all files from generated-fixes/accessibility-api/ to Assets/Scripts/Accessibility/`,
    `3. In Unity, open ${finding.scene} scene`,
    `4. Add ${sanitizeIdentifier(finding.scene)}_AccessibilitySetup component to a GameObject`,
    `5. Enable "Auto Setup UI" in Inspector`,
    `6. Build and test with screen reader (NVDA, JAWS, or VoiceOver)`
  ];

  fix.testingInstructions = [
    `Install NVDA (Windows) or enable VoiceOver (Mac)`,
    `Build and run Unity project`,
    `Navigate UI with keyboard`,
    `Verify screen reader announces each element`,
    `Check button presses are announced`,
    `Verify toggle state changes are announced`
  ];
}

function generateManualFix(finding) {
  const steps = [
    `Issue: ${finding.title}`,
    `Scene: ${finding.scene}`,
    `WCAG Criterion: ${finding.wcagCriterion}`,
    '',
    `Description: ${finding.description}`
  ];

  if (finding.recommendation) {
    steps.push('', `Recommendation: ${finding.recommendation}`);
  }

  return steps;
}

function sanitizeIdentifier(name) {
  if (!name) return 'Unknown';
  return name
    .replace(/[^a-zA-Z0-9_]/g, '_')
    .replace(/^[0-9]/, '_$&');
}

// ============================================================================
// REPORT GENERATION
// ============================================================================

async function generateFixReport(outputPath, auditData, analysis, fixes) {
  const report = `# Generated Accessibility Fixes Report

**Generated**: ${new Date().toISOString()}
**Project**: ${auditData.projectName || 'Unknown'}
**Total Findings**: ${auditData.findings.length}
**Fixable Findings**: ${analysis.fixableFindings.length}
**Manual Fixes Required**: ${analysis.manualFindings.length}

---

## Executive Summary

### Findings by Severity

| Severity | Count | Fixable | Manual |
|----------|-------|---------|--------|
| Critical | ${analysis.findingsBySeverity['Critical']?.length || 0} | ${analysis.fixableFindings.filter(f => f.severity === 'Critical').length} | ${analysis.manualFindings.filter(f => f.severity === 'Critical').length} |
| High     | ${analysis.findingsBySeverity['High']?.length || 0} | ${analysis.fixableFindings.filter(f => f.severity === 'High').length} | ${analysis.manualFindings.filter(f => f.severity === 'High').length} |
| Medium   | ${analysis.findingsBySeverity['Medium']?.length || 0} | ${analysis.fixableFindings.filter(f => f.severity === 'Medium').length} | ${analysis.manualFindings.filter(f => f.severity === 'Medium').length} |
| Low      | ${analysis.findingsBySeverity['Low']?.length || 0} | ${analysis.fixableFindings.filter(f => f.severity === 'Low').length} | ${analysis.manualFindings.filter(f => f.severity === 'Low').length} |

### Generated Code Modules

${analysis.needsKeyboard ? '✅ **Keyboard Navigation** - Code generated in `generated-fixes/keyboard/`' : '⬜ Keyboard Navigation - Not needed'}
${analysis.needsFocus ? '✅ **Focus Management** - Code generated in `generated-fixes/focus/`' : '⬜ Focus Management - Not needed'}
${analysis.needsScreenReader ? '✅ **Screen Reader Support** - Code generated in `generated-fixes/accessibility-api/`' : '⬜ Screen Reader Support - Not needed'}

### Affected Scenes

${analysis.affectedScenes.map(scene => `- ${scene} (${analysis.findingsByScene[scene].length} issues)`).join('\n')}

---

## Installation Quick Start

### 1. Copy Generated Code

\`\`\`bash
# Copy all generated C# files to your Unity project
cp -r generated-fixes/* /path/to/unity/project/Assets/Scripts/Accessibility/
\`\`\`

### 2. Follow Setup Instructions

Each generated code module has detailed setup instructions:

${analysis.needsKeyboard ? '- Read `generated-fixes/keyboard/KEYBOARD-SETUP-INSTRUCTIONS.md`' : ''}
${analysis.needsFocus ? '- Read `generated-fixes/focus/FOCUS-SETUP-INSTRUCTIONS.md`' : ''}
${analysis.needsScreenReader ? '- Read `generated-fixes/accessibility-api/ACCESSIBILITY-API-INSTRUCTIONS.md`' : ''}

### 3. Test in Unity

1. Open Unity Editor
2. Open each affected scene
3. Add configuration components (see scene-specific fixes below)
4. Press Play and test with keyboard
5. Test with screen reader (if applicable)

---

## Detailed Fixes by Scene

${Object.keys(analysis.findingsByScene).map(scene => {
  const sceneFixes = fixes.filter(f => f.scene === scene);
  return `
### ${scene}

**Issues**: ${analysis.findingsByScene[scene].length}
**Fixable**: ${sceneFixes.filter(f => f.fixType.includes('keyboard') || f.fixType.includes('focus') || f.fixType.includes('screenReader')).length}

${sceneFixes.map(fix => `
#### ${fix.title}

**Severity**: ${fix.severity}
**WCAG**: ${fix.wcagCriterion}
**Category**: ${fix.fixType.join(', ')}

${fix.description}

${fix.generatedCode ? `**Generated Code**:\n\`\`\`\n${fix.generatedCode}\n\`\`\`` : ''}

**Installation Steps**:
${fix.manualSteps.map((step, i) => `${i + 1}. ${step}`).join('\n')}

**Testing**:
${fix.testingInstructions.map((test, i) => `- [ ] ${test}`).join('\n')}

---
`).join('\n')}
`;
}).join('\n')}

## Fixes by Category

${Object.keys(analysis.findingsByCategory).map(category => `
### ${category} Issues (${analysis.findingsByCategory[category].length})

${analysis.findingsByCategory[category].map(finding => {
  const fix = fixes.find(f => f.findingId === finding.id);
  return `- **${finding.title}** (${finding.scene}) - ${finding.severity}`;
}).join('\n')}
`).join('\n')}

---

## Manual Fixes Required

The following issues require manual intervention:

${analysis.manualFindings.map((finding, index) => `
### ${index + 1}. ${finding.title}

**Scene**: ${finding.scene}
**Severity**: ${finding.severity}
**WCAG**: ${finding.wcagCriterion}

**Issue**: ${finding.description}

${finding.recommendation ? `**Recommendation**: ${finding.recommendation}` : ''}

---
`).join('\n')}

---

## Testing Checklist

### Keyboard Navigation
${analysis.needsKeyboard ? `
- [ ] Tab key navigates forward through all UI elements
- [ ] Shift+Tab navigates backward
- [ ] Enter/Space activates buttons
- [ ] Arrow keys work (if configured)
- [ ] Navigation order is logical
- [ ] No keyboard traps
- [ ] All interactive elements reachable
` : '- [ ] Not applicable'}

### Focus Indicators
${analysis.needsFocus ? `
- [ ] Focus indicator visible on all elements
- [ ] Indicator has sufficient contrast (min 3:1)
- [ ] Indicator moves with keyboard navigation
- [ ] Indicator doesn't obstruct content
- [ ] Indicator animation is smooth (if enabled)
` : '- [ ] Not applicable'}

### Screen Reader Support
${analysis.needsScreenReader ? `
- [ ] All buttons have labels
- [ ] Toggles announce state
- [ ] Sliders announce values
- [ ] Dynamic content announced
- [ ] Scene loads announced
- [ ] Tested with NVDA/JAWS/VoiceOver
` : '- [ ] Not applicable'}

---

## Next Steps

1. **Install Generated Code**: Copy all C# files to Unity project
2. **Configure Scenes**: Add setup components to each scene
3. **Test Thoroughly**: Use keyboard and screen reader
4. **Re-run Audit**: Verify fixes resolve issues
5. **Iterate**: Address remaining manual fixes

---

## Support & Documentation

- **Keyboard Navigation**: See \`generated-fixes/keyboard/KEYBOARD-SETUP-INSTRUCTIONS.md\`
- **Focus Management**: See \`generated-fixes/focus/FOCUS-SETUP-INSTRUCTIONS.md\`
- **Screen Reader**: See \`generated-fixes/accessibility-api/ACCESSIBILITY-API-INSTRUCTIONS.md\`
- **Unity Accessibility**: https://docs.unity3d.com/Manual/accessibility.html
- **WCAG Guidelines**: https://www.w3.org/WAI/WCAG22/quickref/

---

**Report Generated by**: accessibility-standards-unity v3.1.0
**Generation Time**: ${new Date().toISOString()}
`;

  const reportPath = path.join(outputPath, 'GENERATED-FIXES.md');
  fs.mkdirSync(outputPath, { recursive: true });
  fs.writeFileSync(reportPath, report);
}

// ============================================================================
// DRY RUN
// ============================================================================

function displayDryRunSummary(analysis) {
  console.log('Planned Fix Generation:\n');

  console.log(`📊 Analysis Summary:`);
  console.log(`   - Affected Scenes: ${analysis.affectedScenes.length}`);
  console.log(`   - Fixable Issues: ${analysis.fixableFindings.length}`);
  console.log(`   - Manual Fixes Required: ${analysis.manualFindings.length}\n`);

  console.log(`📝 Code Modules to Generate:`);
  console.log(`   - Keyboard Navigation: ${analysis.needsKeyboard ? 'Yes' : 'No'}`);
  console.log(`   - Focus Management: ${analysis.needsFocus ? 'Yes' : 'No'}`);
  console.log(`   - Screen Reader Support: ${analysis.needsScreenReader ? 'Yes' : 'No'}\n`);

  if (analysis.affectedScenes.length > 0) {
    console.log(`🎬 Scenes Affected:`);
    analysis.affectedScenes.forEach(scene => {
      const count = analysis.findingsByScene[scene].length;
      console.log(`   - ${scene}: ${count} issue${count !== 1 ? 's' : ''}`);
    });
    console.log();
  }

  console.log(`Run without --dry-run to generate code.`);
}

// ============================================================================
// ARGUMENT PARSING
// ============================================================================

function parseArgs() {
  const args = {
    auditJson: null,
    projectPath: null,
    output: null,
    minSeverity: null,
    categories: null,
    scenes: null,
    dryRun: false
  };

  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];

    if (arg === '--project' && i + 1 < process.argv.length) {
      args.projectPath = process.argv[++i];
    } else if (arg === '--output' && i + 1 < process.argv.length) {
      args.output = process.argv[++i];
    } else if (arg === '--min-severity' && i + 1 < process.argv.length) {
      args.minSeverity = process.argv[++i];
    } else if (arg === '--categories' && i + 1 < process.argv.length) {
      args.categories = process.argv[++i].split(',');
    } else if (arg === '--scenes' && i + 1 < process.argv.length) {
      args.scenes = process.argv[++i].split(',');
    } else if (arg === '--dry-run') {
      args.dryRun = true;
    } else if (arg === '--help' || arg === '-h') {
      printUsage();
      process.exit(0);
    } else if (!arg.startsWith('--')) {
      args.auditJson = arg;
    }
  }

  if (!args.output && args.projectPath) {
    args.output = path.join(args.projectPath, CONFIG.defaultOutput);
  }

  return args;
}

function printUsage() {
  console.log(`
Usage: node generate-fixes.js <audit-json> [options]

Analyzes audit findings and generates code fixes automatically.

Required Arguments:
  <audit-json>                  Path to accessibility-analysis.json file
  --project <path>              Unity project path

Options:
  --output <path>               Output directory for generated code
                                (default: <project>/AccessibilityAudit/generated-fixes/)

  --min-severity <level>        Only generate fixes for issues >= severity
                                Options: Critical, High, Medium, Low

  --categories <cats>           Only fix specific categories (comma-separated)
                                Options: Visual, Keyboard, ScreenReader, Audio

  --scenes <scenes>             Only fix specific scenes (comma-separated)

  --dry-run                     Analyze without generating code

  --help, -h                    Show this help message

Examples:
  # Generate all fixes
  node generate-fixes.js audit.json --project /path/to/unity/project

  # Generate only critical fixes
  node generate-fixes.js audit.json --project /path/to/unity --min-severity Critical

  # Generate fixes for specific scenes
  node generate-fixes.js audit.json --project /path/to/unity --scenes MainMenu,Settings

  # Dry run to see what would be generated
  node generate-fixes.js audit.json --project /path/to/unity --dry-run

  # Custom output directory
  node generate-fixes.js audit.json --project /path/to/unity --output ./my-fixes

Output Structure:
  generated-fixes/
    keyboard/
      KeyboardNavigationManager.cs
      [Scene]_KeyboardConfig.cs
      KEYBOARD-SETUP-INSTRUCTIONS.md
    focus/
      FocusIndicator.cs
      FocusManager.cs
      [Scene]_FocusConfig.cs
      FOCUS-SETUP-INSTRUCTIONS.md
    accessibility-api/
      AccessibleButton.cs
      AccessibleToggle.cs
      AccessibleSlider.cs
      [Scene]_AccessibilitySetup.cs
      ACCESSIBILITY-API-INSTRUCTIONS.md
    GENERATED-FIXES.md (comprehensive report)

WCAG Criteria Addressed:
  - 2.1.1 Keyboard (Level A)
  - 2.1.2 No Keyboard Trap (Level A)
  - 2.4.3 Focus Order (Level A)
  - 2.4.7 Focus Visible (Level AA)
  - 4.1.2 Name, Role, Value (Level A)
  - 4.1.3 Status Messages (Level AA)
`);
}

// ============================================================================
// RUN
// ============================================================================

main().catch(error => {
  console.error('Error:', error.message);
  console.error(error.stack);
  process.exit(1);
});
