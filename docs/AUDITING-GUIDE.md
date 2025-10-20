# Accessibility Auditing Guide
## Internal Guide for zSpace Unity Application Audits

**Framework Version:** 2.2.0
**Last Updated:** 2025-10-20
**Audience:** Internal teams, QA, developers

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Running an Audit](#running-an-audit)
3. [Understanding the Results](#understanding-the-results)
4. [Customizing Templates](#customizing-templates)
5. [Interpreting Compliance Scores](#interpreting-compliance-scores)
6. [Common Issues and Solutions](#common-issues-and-solutions)
7. [Best Practices](#best-practices)

---

## Quick Start

### Prerequisites
- Node.js v16+ installed
- Access to Unity project source code
- This framework installed globally or cloned locally

### Run Your First Audit (3 methods)

**Method 1: Using Claude Code (Recommended)**
```bash
/audit-zspace /path/to/unity-project
```

**Method 2: Using Global CLI**
```bash
npm install -g accessibility-standards-unity
a11y-audit-zspace /path/to/unity-project
```

**Method 3: Using Local Script**
```bash
cd /path/to/accessibility-standards-unity
node bin/audit.js /path/to/unity-project --verbose
```

### Output Files
All audits generate 5 files in `<project>/AccessibilityAudit/`:

1. **accessibility-analysis.json** - Raw findings data (machine-readable)
2. **README.md** - Audit overview and quick start
3. **AUDIT-SUMMARY.md** - Executive summary for stakeholders
4. **VPAT-<appname>.md** - Legal compliance documentation (VPAT 2.5)
5. **ACCESSIBILITY-RECOMMENDATIONS.md** - Developer implementation guide

---

## Running an Audit

### Basic Usage

```bash
a11y-audit-zspace /Users/jPdonnelly/apps.career-explorer
```

**Expected Output:**
```
Starting accessibility audit...
✓ Project found: apps.career-explorer
✓ Analyzing 51 scenes...
✓ Scanning 753 scripts...
✓ Detecting accessibility patterns...
✓ Generating reports...

Audit complete! Reports saved to:
/Users/jPdonnelly/apps.career-explorer/AccessibilityAudit/

Compliance Score: 47% (Non-Conformant)
Critical Issues: 3
High Priority: 1
```

### Advanced Options

**Custom Output Directory:**
```bash
a11y-audit-zspace /path/to/project --output-dir /custom/output/path
```

**Verbose Mode (debugging):**
```bash
a11y-audit-zspace /path/to/project --verbose
```

**Different Output Format (future):**
```bash
a11y-audit-zspace /path/to/project --format html
```

**Help Information:**
```bash
a11y-audit-zspace --help
```

---

## Understanding the Results

### Reading the Analysis JSON

The `accessibility-analysis.json` file contains all raw findings:

```json
{
  "metadata": {
    "projectName": "apps.career-explorer",
    "scannedDate": "2025-10-20",
    "version": "2.2.0"
  },
  "summary": {
    "totalScenes": 51,
    "totalScripts": 753,
    "criticalIssues": 3,
    "totalFindings": 4
  },
  "complianceEstimate": {
    "score": 47,
    "level": "Non-Conformant",
    "wcagLevelA": false,
    "wcagLevelAA": true
  },
  "findings": {
    "critical": [
      {
        "id": "WCAG-2.1.1",
        "title": "No Keyboard Alternatives for Stylus Interactions",
        "severity": "CRITICAL",
        "wcagLevel": "Level A",
        "impact": "10-15% of users excluded",
        "description": "Application requires stylus input...",
        "recommendation": "Add KeyboardStylusAlternative.cs component..."
      }
    ]
  }
}
```

### Understanding Severity Levels

| Severity | WCAG Level | Impact | Action Required |
|----------|-----------|--------|-----------------|
| **CRITICAL** | Level A | Blocks users with disabilities | Fix immediately |
| **HIGH** | Level AA | Reduces accessibility significantly | Fix in next sprint |
| **MEDIUM** | Best practice | Minor usability issues | Plan for future release |
| **LOW** | Enhancement | Nice-to-have improvements | Backlog item |

### Compliance Score Breakdown

| Score Range | Status | Meaning |
|-------------|--------|---------|
| **90-100%** | Fully Compliant | Production-ready, WCAG 2.2 Level AA |
| **70-89%** | Substantially Conformant | Minor issues, legal risk low |
| **50-69%** | Partially Conformant | Major gaps, legal risk moderate |
| **0-49%** | Non-Conformant | Critical failures, legal risk high |

---

## Customizing Templates

### Template Locations

All templates are in:
```
/accessibility-standards-unity/templates/audit/
├── README.template.md
├── AUDIT-SUMMARY.template.md
├── VPAT.template.md
├── RECOMMENDATIONS.template.md
└── variables.json (schema reference)
```

### Available Template Variables

Templates use Handlebars-style syntax:

**Project Metadata:**
- `{{APP_NAME}}` - Application name (e.g., "apps.career-explorer")
- `{{PROJECT_PATH}}` - Full path to Unity project
- `{{AUDIT_DATE}}` - Date audit was run
- `{{FRAMEWORK_VERSION}}` - Framework version (e.g., "2.2.0")

**Statistics:**
- `{{TOTAL_SCENES}}` - Number of Unity scenes scanned
- `{{TOTAL_SCRIPTS}}` - Number of C# scripts analyzed
- `{{COMPLIANCE_SCORE}}` - Overall compliance percentage (0-100)
- `{{COMPLIANCE_LEVEL}}` - Text status (e.g., "Non-Conformant")

**Findings Counts:**
- `{{CRITICAL_COUNT}}` - Number of critical issues
- `{{HIGH_COUNT}}` - Number of high priority issues
- `{{MEDIUM_COUNT}}` - Number of medium priority issues
- `{{LOW_COUNT}}` - Number of low priority issues
- `{{TOTAL_FINDINGS}}` - Total issues found

**Compliance Status:**
- `{{WCAG_LEVEL_A_STATUS}}` - "✅ Pass" or "❌ Fail"
- `{{WCAG_LEVEL_AA_STATUS}}` - "✅ Pass" or "❌ Fail"
- `{{KEYBOARD_SUPPORT_STATUS}}` - "✅ Partial", "✅ Found", or "❌ None"
- `{{SCREEN_READER_SUPPORT_STATUS}}` - "✅ Found" or "❌ None"
- `{{FOCUS_INDICATORS_STATUS}}` - "✅ Partial" or "❌ None"
- `{{LEGAL_RISK_LEVEL}}` - "LOW", "MODERATE", or "HIGH"

### Template Directives

**Conditionals:**
```markdown
{{#if CRITICAL_COUNT}}
## Critical Issues Found
There are {{CRITICAL_COUNT}} critical issues that must be fixed.
{{/if}}
```

**Loops:**
```markdown
{{#each CRITICAL_ISSUES}}
### {{title}}
**Severity:** {{severity}}
**Impact:** {{impact}}
{{/each}}
```

### Customization Example

To add your company branding to AUDIT-SUMMARY.template.md:

```markdown
# Accessibility Audit Summary
## {{APP_NAME}} - zSpace Unity Application

**Audited By:** Your Company Name
**Audit Date:** {{AUDIT_DATE}}
**Contact:** accessibility@yourcompany.com
```

### Testing Template Changes

After modifying templates, test with:
```bash
node bin/audit.js /path/to/test-project --verbose
```

Check generated reports for:
- All variables substituted correctly
- No unparsed `{{}}` syntax visible
- Conditionals rendering as expected
- Professional formatting and readability

---

## Interpreting Compliance Scores

### WCAG Level A vs. Level AA

**Level A (Minimum):**
- **Required for:** All applications
- **Failures mean:** Users with disabilities cannot use the app
- **Example violations:**
  - No keyboard alternatives
  - Missing alt text for images
  - No screen reader support

**Level AA (Standard):**
- **Required for:** Government, education, healthcare software
- **Failures mean:** Reduced accessibility for some users
- **Example violations:**
  - Insufficient color contrast (< 4.5:1)
  - No visible focus indicators
  - Audio without captions

### zSpace-Specific Requirements (W3C XAUR)

Our framework adds **stereoscopic 3D accessibility** checks based on W3C XR Accessibility User Requirements:

| XAUR Code | Requirement | Why It Matters |
|-----------|-------------|----------------|
| **UN17** | Depth perception alternatives | 10-15% of users have stereoblindness |
| **UN18** | Non-stereoscopic mode | Eye conditions, monocular vision |
| **UN19** | Spatial audio cues | Alternative depth perception method |
| **UN20** | Haptic feedback | Multi-sensory depth communication |

### Common Compliance Patterns

**Typical First Audit Results:**
- **Score:** 30-50% (Non-Conformant)
- **Critical Issues:** 3-5 (no keyboard, no screen reader, no depth cues)
- **High Priority:** 2-4 (contrast, focus indicators)
- **Timeline to Fix:** 6-10 weeks

**After Implementing Framework Components:**
- **Score:** 85-95% (Substantially Conformant)
- **Critical Issues:** 0
- **High Priority:** 0-2 (minor polish)
- **Timeline to 100%:** 1-2 weeks

---

## Common Issues and Solutions

### Issue 1: "No keyboard alternatives found"

**Symptom:** Audit reports WCAG-2.1.1 violation

**Root Cause:** Scripts use zSpace stylus API without keyboard fallbacks

**Solution:**
```csharp
// BEFORE (non-compliant):
if (stylus.GetButtonDown(0)) {
    SelectObject();
}

// AFTER (compliant):
if (stylus.GetButtonDown(0) || Input.GetKeyDown(KeyCode.Space)) {
    SelectObject();
}
```

Or use framework component:
```csharp
public class MyScript : MonoBehaviour {
    private KeyboardStylusAlternative keyboardAlt;

    void Start() {
        keyboardAlt = GetComponent<KeyboardStylusAlternative>();
    }
}
```

### Issue 2: "No depth perception alternatives"

**Symptom:** Audit reports XAUR-UN17 violation

**Root Cause:** Application relies solely on stereoscopic 3D for spatial understanding

**Solution:**
Add `DepthCueManager.cs` to scene:
```csharp
// Automatically provides:
// - Size scaling based on distance
// - Dynamic shadows
// - Spatial audio positioning
// - Haptic feedback on stylus
```

### Issue 3: "No screen reader support"

**Symptom:** Audit reports WCAG-4.1.2 violation

**Root Cause:** UI elements lack semantic information

**Solution:**
```csharp
// Add to all UI buttons:
using UnityEngine.Accessibility;

public class MyButton : MonoBehaviour {
    void Start() {
        var node = GetComponent<AccessibilityNode>();
        node.label = "Start Career Exploration";
        node.role = AccessibilityRole.Button;
    }
}
```

Or use `AccessibleStylusButton.cs` from framework.

### Issue 4: Audit script fails with "Cannot find Unity project"

**Symptom:**
```
Error: No Assets/ directory found at path
```

**Cause:** Path points to parent directory or exported build

**Solution:** Point to Unity project root (contains `Assets/`, `ProjectSettings/`, etc.):
```bash
# WRONG:
a11y-audit-zspace /Users/jPdonnelly/UnityProjects

# CORRECT:
a11y-audit-zspace /Users/jPdonnelly/UnityProjects/apps.career-explorer
```

### Issue 5: Compliance score seems low despite implementing components

**Symptom:** Score is 47% but you've added accessibility components

**Cause:** Components added but not configured, or naming doesn't match detection patterns

**Solution:**
1. Run with `--verbose` flag to see detection details
2. Check component names match framework exactly:
   - `KeyboardStylusAlternative.cs` (not `KeyboardAlternative.cs`)
   - `DepthCueManager.cs` (not `DepthManager.cs`)
3. Ensure components are in `Assets/Scripts/` or subdirectories
4. Verify components have proper using statements for zSpace SDK

---

## Best Practices

### 1. Audit Early and Often

**Recommended Cadence:**
- **Daily:** Quick validation during active development
- **Weekly:** Full audit of current sprint work
- **Release:** Complete audit before any deployment
- **Quarterly:** Full compliance review with legal/QA

### 2. Integrate with CI/CD

Add to your build pipeline:
```yaml
# .github/workflows/accessibility.yml
name: Accessibility Audit
on: [push, pull_request]
jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run Accessibility Audit
        run: |
          npm install -g accessibility-standards-unity
          a11y-audit-zspace . --format json
      - name: Fail on Critical Issues
        run: |
          CRITICAL=$(jq '.summary.criticalIssues' AccessibilityAudit/accessibility-analysis.json)
          if [ $CRITICAL -gt 0 ]; then exit 1; fi
```

### 3. Track Progress Over Time

Create a tracking spreadsheet:

| Date | Version | Score | Critical | High | Notes |
|------|---------|-------|----------|------|-------|
| 2025-01-15 | v1.0 | 32% | 5 | 8 | Initial audit |
| 2025-02-01 | v1.1 | 58% | 2 | 4 | Added keyboard support |
| 2025-02-15 | v1.2 | 87% | 0 | 1 | Added screen reader |
| 2025-03-01 | v2.0 | 100% | 0 | 0 | Full compliance! |

### 4. Don't Reinvent the Wheel

**USE FRAMEWORK COMPONENTS:**
```bash
# Copy all accessibility scripts to your project:
cp -r /path/to/accessibility-standards-unity/implementation/unity/scripts/* \
      /path/to/your-project/Assets/Scripts/Accessibility/
```

These components are:
- ✅ WCAG 2.2 compliant
- ✅ W3C XAUR compliant
- ✅ Tested on multiple zSpace applications
- ✅ Production-ready

### 5. Test with Real Users

Automated audits catch 80-90% of issues. Manual testing catches the rest:

**Keyboard-Only Testing:**
- Disconnect stylus and mouse
- Tab through entire application
- Verify all features accessible

**Screen Reader Testing:**
- Install NVDA (free from nvaccess.org)
- Launch application with screen reader running
- Verify all UI elements announced clearly

**2D Mode Testing:**
- Remove 3D glasses
- Complete all tasks in 2D mode
- Verify depth cues (shadows, size, audio) provide spatial info

### 6. Document Accessibility Decisions

Create `ACCESSIBILITY.md` in your project root:
```markdown
# Accessibility Implementation Notes

## Keyboard Mappings
- Space: Select object (stylus button equivalent)
- Tab: Navigate between interactive elements
- Escape: Cancel/close menus

## Depth Perception Alternatives
- Size scaling: Objects closer appear larger
- Shadows: Dynamic shadows indicate depth
- Spatial audio: 3D sound positioning
- Haptic feedback: Stylus vibration on interaction

## Screen Reader Support
- All buttons labeled with AccessibleStylusButton.cs
- Menu navigation announced by AccessibleZSpaceMenu.cs
- Object focus indicated by ZSpaceFocusIndicator.cs
```

---

## Next Steps

After running an audit:

1. **Review AUDIT-SUMMARY.md** - Understand overall status
2. **Share with stakeholders** - Get buy-in for fixes
3. **Read ACCESSIBILITY-RECOMMENDATIONS.md** - Get specific implementation steps
4. **Prioritize critical issues** - Fix Level A violations first
5. **Copy framework components** - Don't rebuild from scratch
6. **Test manually** - Validate with keyboard, screen reader, 2D mode
7. **Re-audit** - Verify improvements with another scan

---

## Support and Resources

### Internal Resources
- **Framework Repository:** `/accessibility-standards-unity/`
- **Complete Checklist:** `standards/ZSPACE-ACCESSIBILITY-CHECKLIST.md`
- **Developer Workflow:** `workflows/DEVELOPER-WORKFLOW.md`
- **Prompt Engineering Guide:** `docs/CLAUDE-PROMPTS.md`

### External Standards
- **WCAG 2.2 Quick Reference:** https://www.w3.org/WAI/WCAG22/quickref/
- **W3C XAUR:** https://www.w3.org/TR/xaur/
- **Section 508:** https://www.section508.gov/
- **VPAT Templates:** https://www.itic.org/policy/accessibility/vpat

### Testing Tools
- **NVDA Screen Reader (free):** https://www.nvaccess.org/
- **Unity Accessibility Plugin:** Unity Asset Store
- **Color Contrast Checker:** https://webaim.org/resources/contrastchecker/

---

**Document Version:** 1.0
**Last Updated:** 2025-10-20
**Maintained By:** accessibility-standards-unity Framework
**Questions?** Open an issue at https://github.com/jdonnelly-zspace/accessibility-standards-unity/issues
