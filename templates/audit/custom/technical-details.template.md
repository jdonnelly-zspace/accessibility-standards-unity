# {{PROJECT_NAME}} - Technical Accessibility Details

**Audit Date:** {{AUDIT_DATE}}
**Framework Version:** {{FRAMEWORK_VERSION}}

---

## Table of Contents
1. [Project Analysis](#project-analysis)
2. [Code Patterns Detected](#code-patterns-detected)
3. [Component Analysis](#component-analysis)
4. [WCAG Technical Compliance](#wcag-technical-compliance)
5. [Implementation Recommendations](#implementation-recommendations)
6. [Testing Procedures](#testing-procedures)

---

## Project Analysis

### Project Structure
```
Project Path: {{PROJECT_PATH}}
Unity Version: {{UNITY_VERSION}}
Total Scenes: {{TOTAL_SCENES}}
Total Scripts: {{TOTAL_SCRIPTS}}
Total Assets: {{TOTAL_ASSETS}}
Build Platform: {{BUILD_PLATFORM}}
```

### Analysis Statistics
- **Files Scanned:** {{FILES_SCANNED}}
- **Lines of Code Analyzed:** {{LINES_OF_CODE}}
- **C# Scripts:** {{CSHARP_SCRIPTS}}
- **UI Components:** {{UI_COMPONENTS}}
- **Analysis Duration:** {{ANALYSIS_DURATION}}

---

## Code Patterns Detected

### Input Handling
{{#if KEYBOARD_PATTERNS_DETECTED}}
#### Keyboard Input Patterns
```
Detected Patterns:
{{KEYBOARD_PATTERNS}}
```
**Assessment:** {{KEYBOARD_ASSESSMENT}}
**Recommendation:** {{KEYBOARD_RECOMMENDATION}}
{{else}}
#### No Keyboard Input Patterns Detected
**Impact:** Application may not be accessible via keyboard
**Recommendation:** Implement keyboard navigation using Unity's Input System or EventSystem
{{/if}}

### UI Framework
{{#if UI_TOOLKIT_DETECTED}}
#### Unity UI Toolkit (UIElements) Detected
- **UXML Files:** {{UXML_FILE_COUNT}}
- **USS Files:** {{USS_FILE_COUNT}}
- **Focusable Elements:** {{FOCUSABLE_ELEMENTS_COUNT}}
{{else if UGUI_DETECTED}}
#### Unity UI (UGUI) Detected
- **Canvas Count:** {{CANVAS_COUNT}}
- **Button Components:** {{BUTTON_COUNT}}
- **InputField Components:** {{INPUTFIELD_COUNT}}
{{/if}}

### Accessibility API Integration
{{#if ACCESSIBILITY_API_DETECTED}}
#### Unity Accessibility API Usage
```csharp
Detected Components:
{{ACCESSIBILITY_COMPONENTS}}
```
**Unity Version Required:** 2023.2+
**Implementation Status:** {{ACCESSIBILITY_API_STATUS}}
{{else}}
#### No Accessibility API Integration
**Recommendation:** Implement Unity Accessibility API for screen reader support (Unity 2023.2+)
{{/if}}

### XR/Spatial Input
{{#if XR_PATTERNS_DETECTED}}
#### XR Input Patterns
- **Hand Tracking:** {{HAND_TRACKING_DETECTED}}
- **Gaze Input:** {{GAZE_INPUT_DETECTED}}
- **Voice Commands:** {{VOICE_COMMANDS_DETECTED}}
- **Spatial Audio:** {{SPATIAL_AUDIO_DETECTED}}

**Alternative Input Methods:** {{#if XR_ALTERNATIVES}}Present{{else}}Missing{{/if}}
{{/if}}

---

## Component Analysis

### Critical Components Requiring Updates

{{#each CRITICAL_COMPONENTS}}
#### {{this.name}}
- **File:** `{{this.path}}:{{this.line}}`
- **Issue:** {{this.issue}}
- **Severity:** {{this.severity}}
- **WCAG Criterion:** {{this.wcagCriterion}}

**Code Location:**
```csharp
// {{this.path}}:{{this.line}}
{{this.codeSnippet}}
```

**Recommended Fix:**
```csharp
{{this.recommendedCode}}
```

**Testing:**
{{this.testingInstructions}}

---
{{/each}}

### High Priority Components

{{#each HIGH_PRIORITY_COMPONENTS}}
#### {{this.name}}
- **File:** `{{this.path}}:{{this.line}}`
- **Issue:** {{this.issue}}
- **Recommendation:** {{this.recommendation}}

---
{{/each}}

---

## WCAG Technical Compliance

### WCAG 2.2 Level AA Criteria

#### Automated Analysis Results
| Criterion | Status | Confidence | Details |
|-----------|--------|------------|---------|
{{#each WCAG_CRITERIA}}
| {{this.id}} - {{this.title}} | {{this.status}} | {{this.confidence}} | {{this.details}} |
{{/each}}

#### Criteria Requiring Manual Testing ({{MANUAL_REVIEW_COUNT}})
{{#each MANUAL_REVIEW_CRITERIA}}
- **{{this.id}}:** {{this.title}}
  - **Testing Method:** {{this.testingMethod}}
  - **Tools Required:** {{this.toolsRequired}}
  - **Documentation:** [WCAG Understanding {{this.id}}](https://www.w3.org/WAI/WCAG22/Understanding/{{this.id}}.html)
{{/each}}

---

## Implementation Recommendations

### Phase 1: Critical Fixes ({{CRITICAL_EFFORT}} hours)

1. **Keyboard Navigation**
   ```csharp
   // Implement in: Assets/Scripts/InputManager.cs
   {{KEYBOARD_IMPLEMENTATION}}
   ```
   **Files to Modify:** {{KEYBOARD_FILES_TO_MODIFY}}

2. **Focus Management**
   ```csharp
   // Implement in: Assets/Scripts/FocusManager.cs
   {{FOCUS_IMPLEMENTATION}}
   ```
   **Files to Modify:** {{FOCUS_FILES_TO_MODIFY}}

3. **Accessibility API Integration**
   ```csharp
   // Implement in: Assets/Scripts/Accessibility/
   {{ACCESSIBILITY_API_IMPLEMENTATION}}
   ```
   **Unity Version:** Requires 2023.2+

### Phase 2: High Priority Improvements ({{HIGH_PRIORITY_EFFORT}} hours)

{{#each HIGH_PRIORITY_FIXES}}
#### {{this.title}}
**Effort:** {{this.effort}} hours
**Files:** {{this.files}}
**Implementation:**
```csharp
{{this.code}}
```
{{/each}}

### Phase 3: Medium Priority Enhancements ({{MEDIUM_PRIORITY_EFFORT}} hours)

{{#each MEDIUM_PRIORITY_FIXES}}
- **{{this.title}}:** {{this.description}} ({{this.effort}} hours)
{{/each}}

---

## Testing Procedures

### Automated Testing
```bash
# Run automated accessibility audit
node bin/audit.js {{PROJECT_PATH}} --full

# Run visual analysis
node bin/analyze-visual-accessibility.js {{PROJECT_PATH}}

# Export results
node bin/export-pdf.js AccessibilityAudit/VPAT-COMPREHENSIVE.md
node bin/export-csv.js AccessibilityAudit/accessibility-analysis.json
```

### Manual Testing Checklist

#### Keyboard Accessibility
- [ ] All interactive elements reachable via Tab key
- [ ] Focus indicator visible on all focused elements
- [ ] Shift+Tab navigates backwards
- [ ] Enter/Space activates buttons
- [ ] Escape dismisses modals/dialogs
- [ ] No keyboard traps

#### Screen Reader Testing (NVDA/Narrator)
- [ ] All UI elements have accessible names
- [ ] Roles and states announced correctly
- [ ] Focus changes announced
- [ ] Dynamic content updates announced
- [ ] Meaningful reading order

#### Visual Testing
- [ ] Contrast ratios meet WCAG AA (4.5:1 text, 3:1 UI)
- [ ] Content readable at 200% zoom
- [ ] Color not sole means of conveying information
- [ ] Text resizable without loss of functionality

#### Input Device Testing
- [ ] Keyboard-only navigation works
- [ ] Touch input works (if applicable)
- [ ] Stylus input works (zSpace)
- [ ] Controller input works (if applicable)

### Regression Testing
```bash
# Create baseline
node bin/audit.js {{PROJECT_PATH}} --baseline

# Compare against baseline
node bin/audit.js {{PROJECT_PATH}} --compare-baseline

# Fail CI if regressions detected
node bin/audit.js {{PROJECT_PATH}} --fail-on-regression
```

---

## Integration with Development Workflow

### Unity Editor Integration
```
1. Install accessibility framework in Unity project
2. Open Window > Accessibility > Auditor
3. Run in-editor audit
4. Review Scene View overlays showing issues
5. Use Quick Fix buttons to resolve common issues
```

### CI/CD Integration
```yaml
# .github/workflows/accessibility-audit.yml
name: Accessibility Audit
on: [push, pull_request]
jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: node bin/audit.js . --fail-on-critical
```

---

## API Reference

### Keyboard Navigation API
```csharp
// Example implementation
using UnityEngine;
using UnityEngine.EventSystems;

public class KeyboardNavigationManager : MonoBehaviour
{
    public void OnTabPressed() { /* Navigate to next element */ }
    public void OnShiftTabPressed() { /* Navigate to previous element */ }
    public void OnEnterPressed() { /* Activate focused element */ }
}
```

### Accessibility Node API (Unity 2023.2+)
```csharp
using UnityEngine;
using UnityEngine.Accessibility;

public class AccessibleButton : MonoBehaviour
{
    private AccessibilityNode node;

    void Start()
    {
        node = AccessibilityManager.RegisterNode(this.gameObject);
        node.label = "Play Button";
        node.role = AccessibilityRole.Button;
        node.isActive = true;
    }
}
```

---

## Additional Resources

### Documentation
- [WCAG 2.2 Guidelines](https://www.w3.org/TR/WCAG22/)
- [Unity Accessibility Documentation](https://docs.unity3d.com/Manual/accessibility.html)
- [W3C XR Accessibility User Requirements](https://www.w3.org/TR/xaur/)

### Tools
- **NVDA:** Free screen reader for Windows
- **Narrator:** Built-in Windows screen reader
- **Color Contrast Analyzer:** Desktop tool for contrast checking
- **axe DevTools:** Browser extension for web-based testing

### Internal Documentation
- **Manual Review Guide:** docs/MANUAL-REVIEW-GUIDE.md
- **Unity Editor Guide:** docs/UNITY-EDITOR-GUIDE.md
- **Developer Workflow:** workflows/DEVELOPER-WORKFLOW.md

---

## Appendix

### File Manifest
```
AccessibilityAudit/
├── accessibility-analysis.json       # Complete analysis data
├── AUDIT-SUMMARY.md                 # Summary report
├── VPAT-COMPREHENSIVE.md            # VPAT compliance report
├── COMPONENT-RECOMMENDATIONS.md     # Per-component fixes
├── screenshots/                     # Scene screenshots
│   ├── Scene1/
│   │   ├── Scene1_main.png
│   │   └── colorblind/
│   └── Scene2/
└── visual-analysis/
    └── contrast-report.json
```

### Command Reference
```bash
# Full audit with all features
node bin/audit.js {{PROJECT_PATH}} --full --capture-screenshots

# Export to PDF
node bin/export-pdf.js AccessibilityAudit/VPAT-COMPREHENSIVE.md

# Export to CSV
node bin/export-csv.js AccessibilityAudit/accessibility-analysis.json

# Generate GitHub issues
node bin/generate-issues.js AccessibilityAudit/accessibility-analysis.json \\
  --platform github --config config/export-config.json --min-severity High

# Compare projects
node bin/compare-projects.js project1/AccessibilityAudit project2/AccessibilityAudit
```

---

**Report Generated:** {{AUDIT_DATE}}
**Tool Version:** accessibility-standards-unity v{{FRAMEWORK_VERSION}}
**Analysis Engine:** v{{ANALYSIS_ENGINE_VERSION}}
