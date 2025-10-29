# VPAT Template Variables - Phase 1 & 2 Integration

**Version:** 3.3.0-phase2
**Date:** 2025-10-27
**Template:** `templates/audit/VPAT-COMPREHENSIVE.template.md`

---

## Overview

This document describes the template variables added to support automated WCAG findings from Phase 1 and Phase 2 analyzers. These variables are used by the VPAT generation logic to populate automated analysis results.

---

## New Template Variables

### Phase 1: Visual Analysis

#### `PHASE1_TEXT_CONTRAST` (boolean)
**Purpose:** Indicates if Phase 1 text contrast analysis was performed
**Source:** `phase1Results.textContrast` from analysis report
**Used in:** 1.4.3 Contrast (Minimum)

#### `PHASE1_TEXT_CONTRAST_ISSUES` (boolean)
**Purpose:** Indicates if any contrast issues were found
**Condition:** `true` if findings array has items with severity !== 'info'
**Used in:** Conformance level determination

#### `PHASE1_TEXT_CONTRAST_FAILING` (number)
**Purpose:** Count of text elements that fail contrast requirements
**Calculation:** Count of findings with severity 'high' or 'critical'
**Used in:** Summary statistics

#### `PHASE1_TEXT_CONTRAST_CRITICAL` (number)
**Purpose:** Count of critical contrast failures (< 3.0:1)
**Calculation:** Count of findings with severity 'critical'
**Used in:** Detailed reporting

#### `PHASE1_TEXT_CONTRAST_HIGH` (number)
**Purpose:** Count of high-severity contrast failures (< 4.5:1)
**Calculation:** Count of findings with severity 'high'
**Used in:** Detailed reporting

#### `PHASE1_TEXT_CONTRAST_SUMMARY` (string)
**Purpose:** Formatted summary of contrast findings
**Format:** Bulleted list of specific issues
**Example:**
```
- "Submit" button: 3.2:1 (requires 4.5:1)
- Menu label: 2.8:1 (requires 4.5:1)
```

---

### Phase 2: Semantic Analysis

#### [2.4.2] Page Titled Variables

**`PHASE2_SCENE_TITLES`** (boolean)
- Indicates if scene title analysis was performed
- Source: `phase2Results.sceneTitles`

**`PHASE2_SCENE_TITLES_ISSUES`** (boolean)
- `true` if any title issues found
- Excludes 'info' severity findings

**`PHASE2_SCENE_TITLES_MISSING`** (number)
- Count of scenes with no title detected

**`PHASE2_SCENE_TITLES_INACCESSIBLE`** (number)
- Count of titles without AccessibilityNode markup

**`PHASE2_SCENE_TITLES_SUMMARY`** (string)
- Formatted list of specific issues
- Example: "MainMenu: No title detected"

---

#### [2.4.3] Focus Order Variables

**`PHASE2_FOCUS_ORDER`** (boolean)
- Indicates if focus order analysis was performed
- Source: `phase2Results.focusOrder`

**`PHASE2_FOCUS_ORDER_ISSUES`** (boolean)
- `true` if focus order mismatches found

**`PHASE2_FOCUS_ORDER_MISMATCHES`** (number)
- Count of elements with incorrect focus order

**`PHASE2_FOCUS_ORDER_SUMMARY`** (string)
- Formatted list of focus order issues
- Example: "SettingsMenu: Button order doesn't match visual layout"

---

#### [2.4.6] Headings and Labels Variables

**`PHASE2_HEADINGS_LABELS`** (boolean)
- Indicates if headings/labels analysis was performed
- Source: `phase2Results.headingsLabels`

**`PHASE2_HEADINGS_LABELS_ISSUES`** (boolean)
- `true` if label issues found

**`PHASE2_HEADINGS_LABELS_VAGUE`** (number)
- Count of vague/non-descriptive labels

**`PHASE2_HEADINGS_LABELS_MISSING`** (number)
- Count of inputs without associated labels

**`PHASE2_HEADINGS_LABELS_HEADING_ISSUES`** (number)
- Count of headings without proper role markup

**`PHASE2_HEADINGS_LABELS_SUMMARY`** (string)
- Formatted list of specific issues
- Example: "EmailInput: No associated label found"

---

#### [1.4.4] Resize Text Variables

**`PHASE2_TEXT_RESIZE`** (boolean)
- Indicates if text resize analysis was performed
- Source: `phase2Results.textResize`

**`PHASE2_TEXT_RESIZE_ISSUES`** (boolean)
- `true` if text scaling issues found

**`PHASE2_TEXT_RESIZE_OVERFLOW`** (number)
- Count of elements likely to overflow at 200% scale

**`PHASE2_TEXT_RESIZE_FIXED`** (number)
- Count of elements with fixed-size containers

**`PHASE2_TEXT_RESIZE_SUMMARY`** (string)
- Formatted list of resize issues
- Example: "TutorialText: Fixed container may clip at 200%"

---

#### [3.2.3] Consistent Navigation Variables

**`PHASE2_CONSISTENT_NAV`** (boolean)
- Indicates if navigation consistency analysis was performed
- Source: `phase2Results.consistentNavigation`

**`PHASE2_CONSISTENT_NAV_ISSUES`** (boolean)
- `true` if navigation inconsistencies found

**`PHASE2_CONSISTENT_NAV_INCONSISTENCIES`** (number)
- Count of navigation order inconsistencies

**`PHASE2_CONSISTENT_NAV_SUMMARY`** (string)
- Formatted list of navigation issues
- Example: "Back button position varies between scenes"

---

#### [3.2.4] Consistent Identification Variables

**`PHASE2_CONSISTENT_ID`** (boolean)
- Indicates if component identification analysis was performed
- Source: `phase2Results.consistentIdentification`

**`PHASE2_CONSISTENT_ID_ISSUES`** (boolean)
- `true` if identification inconsistencies found

**`PHASE2_CONSISTENT_ID_FUNCTION_TYPES`** (number)
- Count of component types with inconsistent labels

**`PHASE2_CONSISTENT_ID_SUMMARY`** (string)
- Formatted list of identification issues
- Example: "Save button labeled 'Save' in Menu, 'Submit' in Settings"

---

## Implementation Guide

### Step 1: Data Collection

In your VPAT generation code, collect Phase 1 & 2 results from the analysis report:

```javascript
const report = analysisReport; // From analyze-unity-project.js

// Phase 1 data
const phase1Data = {
  textContrast: report.phase1Results?.textContrast || null
};

// Phase 2 data
const phase2Data = {
  sceneTitles: report.phase2Results?.sceneTitles || null,
  headingsLabels: report.phase2Results?.headingsLabels || null,
  focusOrder: report.phase2Results?.focusOrder || null,
  consistentNav: report.phase2Results?.consistentNavigation || null,
  consistentId: report.phase2Results?.consistentIdentification || null,
  textResize: report.phase2Results?.textResize || null
};
```

### Step 2: Process Findings

Convert findings into template variables:

```javascript
function processPhase1TextContrast(findings) {
  if (!findings || !Array.isArray(findings)) {
    return {
      PHASE1_TEXT_CONTRAST: false
    };
  }

  const issues = findings.filter(f => f.severity !== 'info' && f.severity !== 'error');

  return {
    PHASE1_TEXT_CONTRAST: true,
    PHASE1_TEXT_CONTRAST_ISSUES: issues.length > 0,
    PHASE1_TEXT_CONTRAST_FAILING: issues.length,
    PHASE1_TEXT_CONTRAST_CRITICAL: issues.filter(f => f.severity === 'critical').length,
    PHASE1_TEXT_CONTRAST_HIGH: issues.filter(f => f.severity === 'high').length,
    PHASE1_TEXT_CONTRAST_SUMMARY: generateSummary(issues)
  };
}

function processPhase2SceneTitles(findings) {
  if (!findings || !Array.isArray(findings)) {
    return {
      PHASE2_SCENE_TITLES: false
    };
  }

  const issues = findings.filter(f => f.severity !== 'info' && f.severity !== 'error');

  return {
    PHASE2_SCENE_TITLES: true,
    PHASE2_SCENE_TITLES_ISSUES: issues.length > 0,
    PHASE2_SCENE_TITLES_MISSING: issues.filter(f => f.issue.includes('No scene title')).length,
    PHASE2_SCENE_TITLES_INACCESSIBLE: issues.filter(f => f.issue.includes('not accessible')).length,
    PHASE2_SCENE_TITLES_SUMMARY: generateSummary(issues)
  };
}

// Similar functions for other Phase 2 analyzers...
```

### Step 3: Summary Generation

Create formatted summaries for the template:

```javascript
function generateSummary(findings, maxItems = 5) {
  if (findings.length === 0) return '';

  const items = findings.slice(0, maxItems).map(f => {
    const location = f.scene || f.element || 'Unknown';
    const issue = f.issue || f.title;
    return `- ${location}: ${issue}`;
  });

  if (findings.length > maxItems) {
    items.push(`- ... and ${findings.length - maxItems} more`);
  }

  return items.join('<br>');
}
```

### Step 4: Merge with Existing Template Data

Combine Phase 1 & 2 variables with existing template variables:

```javascript
const templateData = {
  // Existing variables
  APP_NAME: report.metadata.appName,
  AUDIT_DATE: report.metadata.scannedDate,
  TOTAL_SCENES: report.summary.totalScenes,
  TOTAL_SCRIPTS: report.summary.totalScripts,

  // Phase 1 variables
  ...processPhase1TextContrast(phase1Data.textContrast),

  // Phase 2 variables
  ...processPhase2SceneTitles(phase2Data.sceneTitles),
  ...processPhase2FocusOrder(phase2Data.focusOrder),
  ...processPhase2HeadingsLabels(phase2Data.headingsLabels),
  ...processPhase2TextResize(phase2Data.textResize),
  ...processPhase2ConsistentNav(phase2Data.consistentNav),
  ...processPhase2ConsistentId(phase2Data.consistentId)
};
```

---

## Example Template Data

### Complete Example

```javascript
{
  // Standard variables
  APP_NAME: "MedicalTraining3D",
  AUDIT_DATE: "2025-10-27",
  FRAMEWORK_VERSION: "3.3.0-phase2",
  TOTAL_SCENES: 12,
  TOTAL_SCRIPTS: 245,

  // Phase 1: Text Contrast
  PHASE1_TEXT_CONTRAST: true,
  PHASE1_TEXT_CONTRAST_ISSUES: true,
  PHASE1_TEXT_CONTRAST_FAILING: 8,
  PHASE1_TEXT_CONTRAST_CRITICAL: 2,
  PHASE1_TEXT_CONTRAST_HIGH: 6,
  PHASE1_TEXT_CONTRAST_SUMMARY: "- MainMenu Submit: 3.2:1 (requires 4.5:1)<br>- Settings Label: 2.8:1 (requires 4.5:1)<br>- ... and 6 more",

  // Phase 2: Scene Titles
  PHASE2_SCENE_TITLES: true,
  PHASE2_SCENE_TITLES_ISSUES: true,
  PHASE2_SCENE_TITLES_MISSING: 3,
  PHASE2_SCENE_TITLES_INACCESSIBLE: 2,
  PHASE2_SCENE_TITLES_SUMMARY: "- LevelSelect: No scene title detected<br>- Tutorial: Title not accessible",

  // Phase 2: Focus Order
  PHASE2_FOCUS_ORDER: true,
  PHASE2_FOCUS_ORDER_ISSUES: true,
  PHASE2_FOCUS_ORDER_MISMATCHES: 4,
  PHASE2_FOCUS_ORDER_SUMMARY: "- SettingsMenu: Focus order doesn't match visual layout",

  // Phase 2: Headings and Labels
  PHASE2_HEADINGS_LABELS: true,
  PHASE2_HEADINGS_LABELS_ISSUES: true,
  PHASE2_HEADINGS_LABELS_VAGUE: 3,
  PHASE2_HEADINGS_LABELS_MISSING: 2,
  PHASE2_HEADINGS_LABELS_HEADING_ISSUES: 1,
  PHASE2_HEADINGS_LABELS_SUMMARY: "- EmailField: No associated label<br>- SubmitButton: Vague label 'Submit'",

  // Phase 2: Text Resize
  PHASE2_TEXT_RESIZE: true,
  PHASE2_TEXT_RESIZE_ISSUES: true,
  PHASE2_TEXT_RESIZE_OVERFLOW: 5,
  PHASE2_TEXT_RESIZE_FIXED: 8,
  PHASE2_TEXT_RESIZE_SUMMARY: "- TutorialText: Fixed container may clip at 200%<br>- InstructionLabel: No ContentSizeFitter",

  // Phase 2: Consistent Navigation
  PHASE2_CONSISTENT_NAV: true,
  PHASE2_CONSISTENT_NAV_ISSUES: true,
  PHASE2_CONSISTENT_NAV_INCONSISTENCIES: 2,
  PHASE2_CONSISTENT_NAV_SUMMARY: "- Back button position varies: top-left in Menu, bottom-left in Settings",

  // Phase 2: Consistent Identification
  PHASE2_CONSISTENT_ID: true,
  PHASE2_CONSISTENT_ID_ISSUES: true,
  PHASE2_CONSISTENT_ID_FUNCTION_TYPES: 3,
  PHASE2_CONSISTENT_ID_SUMMARY: "- Save button: 'Save' in Menu, 'Submit' in Settings, 'Confirm' in Review"
}
```

---

## Testing Template Variables

### Test Cases

1. **All Analysis Performed, No Issues**
   - All PHASE variables = `true`
   - All ISSUES variables = `false`
   - Result: "Supports" conformance level

2. **All Analysis Performed, Some Issues**
   - All PHASE variables = `true`
   - Some ISSUES variables = `true`
   - Result: "Partially Supports" conformance level

3. **No Analysis Performed (Fallback)**
   - All PHASE variables = `false` or `undefined`
   - Result: Falls back to "Manual review required"

4. **Mixed Results**
   - Phase 1 performed, Phase 2 not performed
   - Result: Shows automated findings for Phase 1, manual review for Phase 2

---

## VPAT Generation Workflow

```
1. Run audit
   └─> analyze-unity-project.js

2. Generate report
   └─> phase1Results, phase2Results populated

3. Process findings
   └─> Convert to template variables

4. Render VPAT
   └─> Template engine (Handlebars) uses variables

5. Output VPAT
   └─> Markdown file with automated findings
```

---

## Backward Compatibility

The template is backward compatible:
- Old audits without Phase 1/2 data will fall back to "Manual review required"
- New audits show automated findings when available
- All PHASE variables default to `false` if not provided
- Existing variable names unchanged

---

## Future Enhancements

### Phase 3 Variables (Planned)
When Phase 3 is implemented, add:
- `PHASE3_KEYBOARD_SUPPORT`
- `PHASE3_AUDIO_CONTROL`
- `PHASE3_NON_TEXT_CONTENT`
- etc. (18 more criteria)

### Summary Statistics
Consider adding:
- `AUTOMATED_CRITERIA_COUNT` - Total criteria automated
- `AUTOMATED_PASS_RATE` - Percentage of automated checks that passed
- `MANUAL_REVIEW_REMAINING` - Count of criteria still needing manual review

---

## Support

**Documentation:**
- Template: `templates/audit/VPAT-COMPREHENSIVE.template.md`
- Integration: `docs/INTEGRATION-STATUS.md`
- Automation Plan: `docs/MANUAL-REVIEW-AUTOMATION-PLAN.md`

**Issues:**
- File bug reports at GitHub repository

---

**Generated:** 2025-10-27
**Framework:** accessibility-standards-unity v3.3.0-phase2
