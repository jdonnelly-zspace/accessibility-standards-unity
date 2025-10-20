# Example Audit Workflow
## Step-by-Step Guide for Auditing zSpace Unity Applications

This directory contains a complete example workflow showing how to audit a zSpace Unity application and implement accessibility fixes.

---

## Table of Contents

1. [Overview](#overview)
2. [Example Project Structure](#example-project-structure)
3. [Step-by-Step Workflow](#step-by-step-workflow)
4. [Sample Audit Reports](#sample-audit-reports)
5. [Implementation Timeline](#implementation-timeline)
6. [Success Metrics](#success-metrics)

---

## Overview

This example demonstrates the complete accessibility auditing process for a fictional zSpace Unity application called **"MoleculeVR"** - a chemistry education app for K-12 students.

**Application Details:**
- **Platform:** zSpace stereoscopic 3D desktop
- **Use Case:** K-12 STEM education (chemistry)
- **Unity Version:** 2021.3 LTS
- **Project Size:** 12 scenes, 143 C# scripts
- **Initial Compliance:** 32% (Non-Conformant)
- **Final Compliance:** 95% (Fully Compliant)
- **Implementation Time:** 8 weeks

---

## Example Project Structure

### Before Auditing

```
MoleculeVR/
├── Assets/
│   ├── Scenes/
│   │   ├── MainMenu.unity
│   │   ├── MoleculeExplorer.unity
│   │   └── PeriodicTable.unity
│   ├── Scripts/
│   │   ├── StylusInteraction.cs         # Stylus-only, no keyboard
│   │   ├── MoleculeRotation.cs          # Requires 3D vision
│   │   ├── UIButton.cs                  # No screen reader support
│   │   └── AudioNarration.cs            # No captions
│   ├── Prefabs/
│   └── Materials/
├── ProjectSettings/
└── Packages/
```

### After Implementing Accessibility

```
MoleculeVR/
├── Assets/
│   ├── Scenes/
│   │   ├── MainMenu.unity               # Now keyboard accessible
│   │   ├── MoleculeExplorer.unity       # Depth cues added
│   │   └── PeriodicTable.unity          # Screen reader support
│   ├── Scripts/
│   │   ├── Accessibility/               # NEW - Framework components
│   │   │   ├── KeyboardStylusAlternative.cs
│   │   │   ├── DepthCueManager.cs
│   │   │   ├── AccessibleStylusButton.cs
│   │   │   ├── SubtitleSystem.cs
│   │   │   └── SpatialAudioManager.cs
│   │   ├── StylusInteraction.cs         # Updated with keyboard support
│   │   ├── MoleculeRotation.cs          # Updated with depth cues
│   │   ├── UIButton.cs                  # Updated with screen reader
│   │   └── AudioNarration.cs            # Updated with captions
│   ├── Editor/
│   │   └── Accessibility/               # NEW - Validation tools
│   │       ├── ZSpaceAccessibilityValidator.cs
│   │       └── ContrastCheckerZSpace.cs
│   ├── Tests/
│   │   └── Accessibility/               # NEW - Automated tests
│   │       └── ZSpaceAccessibilityTests.cs
│   ├── Prefabs/
│   └── Materials/
├── ProjectSettings/
├── Packages/
└── AccessibilityAudit/                  # NEW - Generated reports
    ├── README.md
    ├── AUDIT-SUMMARY.md
    ├── VPAT-MoleculeVR.md
    ├── ACCESSIBILITY-RECOMMENDATIONS.md
    └── accessibility-analysis.json
```

---

## Step-by-Step Workflow

### Week 1: Initial Audit and Assessment

#### Step 1: Install the Auditing Framework

```bash
# Option A: Global installation (recommended)
npm install -g accessibility-standards-unity

# Option B: Clone repository
git clone https://github.com/jdonnelly-zspace/accessibility-standards-unity.git
cd accessibility-standards-unity
npm install
```

**Time:** 5 minutes

#### Step 2: Run Initial Audit

```bash
# Navigate to your project
cd /path/to/MoleculeVR

# Run audit
a11y-audit-zspace .
```

**Output:**
```
Starting accessibility audit...
✓ Project found: MoleculeVR
✓ Analyzing 12 scenes...
✓ Scanning 143 scripts...
✓ Detecting accessibility patterns...
✓ Generating reports...

Audit complete! Reports saved to:
/path/to/MoleculeVR/AccessibilityAudit/

Compliance Score: 32% (Non-Conformant)
Critical Issues: 4
  - No keyboard alternatives for stylus interactions (WCAG 2.1.1)
  - No depth perception alternatives (W3C XAUR UN17)
  - No screen reader support (WCAG 4.1.2)
  - Insufficient color contrast in UI (WCAG 1.4.3)
High Priority: 3
Medium Priority: 2
```

**Time:** < 1 minute

#### Step 3: Review Generated Reports

Open and read in this order:

1. **AUDIT-SUMMARY.md** - Understand overall status (10 minutes)
2. **ACCESSIBILITY-RECOMMENDATIONS.md** - See specific fixes (20 minutes)
3. **VPAT-MoleculeVR.md** - Legal compliance status (optional, 15 minutes)

**Key Findings:**
- 4 critical issues blocking users with disabilities
- 32% compliance score (Non-Conformant)
- Estimated 6-8 weeks to fix all issues

**Time:** 30-45 minutes

#### Step 4: Share with Team and Stakeholders

```bash
# Copy AUDIT-SUMMARY.md to team documentation
cp AccessibilityAudit/AUDIT-SUMMARY.md ../docs/Accessibility-Audit-2025-01-15.md

# Email AUDIT-SUMMARY.md to stakeholders
# Share VPAT with legal/compliance team
```

**Action Items:**
- Present findings in team meeting
- Get buy-in from product owner for 8-week timeline
- Allocate developer resources

**Time:** 2-3 hours (meetings, planning)

---

### Week 2-3: Critical Fixes (Level A Compliance)

#### Step 5: Copy Framework Components

```bash
# From accessibility-standards-unity repository
cd /path/to/accessibility-standards-unity

# Copy components to your project
cp -r implementation/unity/scripts/* \
      /path/to/MoleculeVR/Assets/Scripts/Accessibility/

cp -r implementation/unity/editor/* \
      /path/to/MoleculeVR/Assets/Editor/Accessibility/

cp -r implementation/unity/tests/* \
      /path/to/MoleculeVR/Assets/Tests/Accessibility/
```

**Time:** 5 minutes

#### Step 6: Fix Critical Issue #1 - Keyboard Alternatives

**Problem:** Stylus-only interactions (affects 10-15% of users)

**Before (StylusInteraction.cs):**
```csharp
using zSpace.Core;

public class StylusInteraction : MonoBehaviour
{
    private ZPointer stylus;

    void Start()
    {
        stylus = ZProvider.GetStylusTarget();
    }

    void Update()
    {
        // Only works with stylus
        if (stylus.GetButtonDown(0))
        {
            SelectMolecule();
        }
    }
}
```

**After (with keyboard alternative):**
```csharp
using zSpace.Core;
using UnityEngine;

public class StylusInteraction : MonoBehaviour
{
    private ZPointer stylus;
    private KeyboardStylusAlternative keyboardAlt;

    void Start()
    {
        stylus = ZProvider.GetStylusTarget();
        keyboardAlt = GetComponent<KeyboardStylusAlternative>();
    }

    void Update()
    {
        // Stylus input
        if (stylus.GetButtonDown(0))
        {
            SelectMolecule();
        }

        // Keyboard alternative (WCAG 2.1.1 compliant)
        if (Input.GetKeyDown(KeyCode.Space))
        {
            SelectMolecule();
        }
    }
}
```

**Testing:**
1. Disconnect stylus
2. Press Space key
3. Verify molecule selection works

**Time:** 30 minutes per script (5 scripts affected = 2.5 hours)

#### Step 7: Fix Critical Issue #2 - Depth Perception Alternatives

**Problem:** Requires stereoscopic 3D vision (affects 10-15% of users)

**Solution:** Add DepthCueManager to scene

1. Open MainMenu.unity scene
2. Create empty GameObject: "DepthCueManager"
3. Add DepthCueManager.cs component
4. Configure in Inspector:
   - ✓ Enable Size Scaling
   - ✓ Enable Dynamic Shadows
   - ✓ Enable Spatial Audio
   - ✓ Enable Haptic Feedback

**Before (MoleculeRotation.cs):**
```csharp
// Relies solely on stereoscopic depth
public class MoleculeRotation : MonoBehaviour
{
    void Update()
    {
        // User sees depth only through 3D glasses
        transform.Rotate(Vector3.up, Time.deltaTime * 10f);
    }
}
```

**After (with depth cues):**
```csharp
public class MoleculeRotation : MonoBehaviour
{
    private DepthCueManager depthCueManager;

    void Start()
    {
        depthCueManager = FindObjectOfType<DepthCueManager>();
    }

    void Update()
    {
        transform.Rotate(Vector3.up, Time.deltaTime * 10f);

        // Size scaling based on distance (visible in 2D mode)
        float distanceToCamera = Vector3.Distance(transform.position, Camera.main.transform.position);
        transform.localScale = Vector3.one * Mathf.Max(0.5f, 2.0f - distanceToCamera * 0.1f);
    }
}
```

**Testing:**
1. Remove 3D glasses (use 2D mode)
2. Verify molecule depth is perceivable via size/shadows
3. Check spatial audio provides depth cues

**Time:** 1 hour per scene (3 scenes = 3 hours)

#### Step 8: Fix Critical Issue #3 - Screen Reader Support

**Problem:** UI elements not accessible to blind users

**Solution:** Add AccessibleStylusButton to all UI buttons

**Before (UIButton.cs):**
```csharp
using UnityEngine;

public class UIButton : MonoBehaviour
{
    public void OnClick()
    {
        // No accessibility information
        Debug.Log("Button clicked");
    }
}
```

**After (with screen reader support):**
```csharp
using UnityEngine;
#if UNITY_2023_2_OR_NEWER
using UnityEngine.Accessibility;
#endif

public class UIButton : MonoBehaviour
{
    [SerializeField] private string buttonLabel = "Start Exploration";

    void Start()
    {
        #if UNITY_2023_2_OR_NEWER
        var node = GetComponent<AccessibilityNode>();
        if (node == null)
        {
            node = gameObject.AddComponent<AccessibilityNode>();
        }
        node.label = buttonLabel;
        node.role = AccessibilityRole.Button;
        node.isActive = true;
        #else
        // Use AccessibleStylusButton component for older Unity
        var accessibleButton = GetComponent<AccessibleStylusButton>();
        if (accessibleButton != null)
        {
            accessibleButton.SetAccessibleLabel(buttonLabel);
        }
        #endif
    }

    public void OnClick()
    {
        Debug.Log("Button clicked: " + buttonLabel);
    }
}
```

**Testing:**
1. Launch NVDA screen reader (free from nvaccess.org)
2. Tab through interface
3. Verify all buttons announced with correct labels

**Time:** 15 minutes per button (20 buttons = 5 hours)

#### Step 9: Fix Critical Issue #4 - Color Contrast

**Problem:** UI text has insufficient contrast (< 4.5:1 ratio)

**Solution:** Use Unity Editor contrast checker

1. Open ContrastCheckerZSpace tool (Window → Accessibility → Contrast Checker)
2. Select UI text elements
3. Tool highlights low-contrast elements in red
4. Update colors to meet 4.5:1 minimum

**Example fixes:**
- Gray text on white: Change to #333333 (dark gray) = 12.6:1 ✓
- Light blue on white: Change to #0066CC (darker blue) = 4.5:1 ✓
- Yellow on white: Change to #665500 (dark yellow) = 7.2:1 ✓

**Time:** 2 hours

**Week 2-3 Total Time:** ~15-20 hours (developer time)

**Re-Audit After Week 3:**
```bash
a11y-audit-zspace .
```

**Expected Results:**
```
Compliance Score: 68% (Partially Conformant)
Critical Issues: 0 ✓
High Priority: 3
Medium Priority: 2
```

---

### Week 4-6: High Priority Fixes (Level AA Compliance)

#### Step 10: Add Focus Indicators

**Problem:** Keyboard navigation lacks visible focus indicators

**Solution:** Add ZSpaceFocusIndicator component

```csharp
// Add to interactive elements
public class InteractiveElement : MonoBehaviour
{
    private ZSpaceFocusIndicator focusIndicator;

    void Start()
    {
        focusIndicator = gameObject.AddComponent<ZSpaceFocusIndicator>();
        focusIndicator.SetFocusColor(Color.yellow);
        focusIndicator.SetFocusWidth(3f);
    }
}
```

**Time:** 3 hours

#### Step 11: Add Captions for Audio

**Problem:** Audio narration lacks captions for deaf users

**Solution:** Implement SubtitleSystem

```csharp
using UnityEngine;

public class AudioNarration : MonoBehaviour
{
    private SubtitleSystem subtitleSystem;

    void Start()
    {
        subtitleSystem = FindObjectOfType<SubtitleSystem>();
    }

    public void PlayNarration(string audioClipName)
    {
        // Play audio
        GetComponent<AudioSource>().Play();

        // Show captions
        subtitleSystem.ShowSubtitle(
            "Welcome to MoleculeVR. Let's explore the periodic table.",
            5f // duration in seconds
        );
    }
}
```

**Time:** 4 hours

#### Step 12: Implement Voice Commands

**Problem:** Limited input method diversity

**Solution:** Add VoiceCommandManager

```csharp
public class VoiceCommands : MonoBehaviour
{
    private VoiceCommandManager voiceManager;

    void Start()
    {
        voiceManager = GetComponent<VoiceCommandManager>();

        // Register commands
        voiceManager.RegisterCommand("select", SelectMolecule);
        voiceManager.RegisterCommand("rotate", RotateMolecule);
        voiceManager.RegisterCommand("menu", OpenMenu);
    }

    void SelectMolecule() { /* ... */ }
    void RotateMolecule() { /* ... */ }
    void OpenMenu() { /* ... */ }
}
```

**Time:** 6 hours

**Week 4-6 Total Time:** ~15-20 hours

**Re-Audit After Week 6:**
```bash
a11y-audit-zspace .
```

**Expected Results:**
```
Compliance Score: 88% (Substantially Conformant)
Critical Issues: 0 ✓
High Priority: 0 ✓
Medium Priority: 2
```

---

### Week 7-8: Polish and Final Testing

#### Step 13: Manual Testing

**Keyboard-Only Testing (2 hours):**
- Disconnect mouse and stylus
- Complete entire app workflow with keyboard only
- Verify all features accessible

**Screen Reader Testing (3 hours):**
- Install NVDA (free)
- Navigate entire app with screen reader
- Verify all UI elements properly announced

**2D Mode Testing (2 hours):**
- Remove 3D glasses
- Complete app workflow in 2D mode
- Verify depth cues (size, shadows, audio) work

**Time:** 7 hours

#### Step 14: Final Audit

```bash
a11y-audit-zspace . --verbose
```

**Results:**
```
Compliance Score: 95% (Fully Compliant)
Critical Issues: 0 ✓
High Priority: 0 ✓
Medium Priority: 0 ✓
Low Priority: 1 (minor enhancement suggestion)
```

#### Step 15: Generate Final VPAT

```bash
# Final VPAT is in AccessibilityAudit/VPAT-MoleculeVR.md
# Share with legal/compliance team for review
# Use for procurement and customer requirements
```

**Time:** 1 hour (review and distribution)

---

## Sample Audit Reports

This directory contains sample audit reports from the MoleculeVR example:

- [`sample-audit-initial/`](sample-audit-initial/) - Initial audit (Week 1, 32% compliance)
- [`sample-audit-midpoint/`](sample-audit-midpoint/) - After critical fixes (Week 3, 68% compliance)
- [`sample-audit-final/`](sample-audit-final/) - Final audit (Week 8, 95% compliance)

Each directory contains the 5 generated reports:
- README.md
- AUDIT-SUMMARY.md
- VPAT-MoleculeVR.md
- ACCESSIBILITY-RECOMMENDATIONS.md
- accessibility-analysis.json

---

## Implementation Timeline

### Summary Timeline

| Week | Phase | Tasks | Hours | Compliance |
|------|-------|-------|-------|------------|
| 1 | Assessment | Initial audit, review, planning | 3-5 | 32% |
| 2-3 | Critical Fixes | Keyboard, depth cues, screen reader, contrast | 15-20 | 68% |
| 4-6 | High Priority | Focus indicators, captions, voice commands | 15-20 | 88% |
| 7-8 | Polish & Test | Manual testing, final audit, VPAT | 8-10 | 95% |
| **Total** | **8 weeks** | **Full implementation** | **40-55 hours** | **95%** |

### Developer Resource Allocation

- **Week 1:** 1 developer, 20% time (planning, review)
- **Week 2-3:** 1 developer, 50% time (critical fixes)
- **Week 4-6:** 1 developer, 50% time (high priority)
- **Week 7-8:** 1 developer + 1 QA, 30% time (testing, polish)

**Total effort:** ~2 person-months (40-55 hours developer + 8-10 hours QA)

---

## Success Metrics

### Before Implementation (Week 1)

- **Compliance Score:** 32% (Non-Conformant)
- **Critical Issues:** 4
- **WCAG Level A:** ❌ Fail
- **WCAG Level AA:** ❌ Fail
- **User Impact:** 20-30% of users unable to use app
- **Legal Risk:** HIGH

### After Implementation (Week 8)

- **Compliance Score:** 95% (Fully Compliant)
- **Critical Issues:** 0 ✓
- **WCAG Level A:** ✅ Pass
- **WCAG Level AA:** ✅ Pass
- **User Impact:** All users can access core features
- **Legal Risk:** LOW

### User Impact Metrics

| Disability Type | Before | After |
|----------------|--------|-------|
| Motor disabilities (keyboard-only) | ❌ Cannot use | ✅ Full access |
| Blind/low vision (screen readers) | ❌ Cannot use | ✅ Full access |
| Deaf/hard of hearing | ⚠️ Limited | ✅ Full captions |
| Stereoblindness (no 3D vision) | ❌ Cannot use | ✅ Depth cues work |
| Color blindness | ⚠️ Difficult | ✅ High contrast |

**Total accessibility improvement:** From 20-30% of disabled users served → 95%+ served

---

## Key Learnings

### What Worked Well

1. **Copy, don't rewrite** - Using framework components saved 80% of implementation time
2. **Audit early** - Catching issues in Week 1 much cheaper than after launch
3. **Incremental approach** - Critical fixes first (WCAG A) → High priority (WCAG AA) → Polish
4. **Automated tools** - Unity Test Framework caught regressions immediately
5. **Real user testing** - Testing with NVDA/keyboard found issues automation missed

### Common Pitfalls to Avoid

1. **Don't skip manual testing** - Automated audits are 80-90% accurate, not 100%
2. **Don't test only in simulator** - zSpace hardware testing required for accurate results
3. **Don't ignore low priority items** - Some "low priority" items affect many users
4. **Don't batch accessibility** - Integrate into every sprint, not one big project
5. **Don't forget documentation** - Document keyboard shortcuts, voice commands for users

### Cost-Benefit Analysis

**Cost:**
- 40-55 developer hours ($4,000-$7,000 at $100/hour)
- 8-10 QA hours ($800-$1,200 at $100/hour)
- Total: ~$5,000-$8,000

**Benefit:**
- Expand addressable market by 20-30%
- Reduce legal risk (WCAG compliance)
- Improve user satisfaction (all users benefit from alternatives)
- Enable sales to government/education (Section 508 compliance)
- ROI: 500-1000% (based on expanded market reach)

---

## Next Steps

After completing this workflow:

1. **Maintain compliance** - Re-audit before each release
2. **Continuous testing** - Add accessibility to CI/CD pipeline
3. **User feedback** - Collect feedback from users with disabilities
4. **Team training** - Train developers on accessible design patterns
5. **Share learnings** - Document case study for future projects

---

**Example workflow complete!** Use this as a template for your own zSpace Unity accessibility projects.

**Questions?** See:
- docs/PARTNER-ONBOARDING.md - Installation and setup
- docs/AUDITING-GUIDE.md - Advanced auditing techniques
- docs/CLAUDE-PROMPTS.md - AI-assisted workflows

**Framework Version:** 2.2.0
**Last Updated:** 2025-10-20
**Status:** Production-ready example workflow
