# Partner Onboarding Guide
## Accessibility Auditing for zSpace Unity Applications

**Welcome!** This guide will help you audit your zSpace Unity applications for accessibility compliance using our automated auditing framework.

---

## Table of Contents

1. [What This Tool Does](#what-this-tool-does)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Running Your First Audit](#running-your-first-audit)
5. [Understanding Your Results](#understanding-your-results)
6. [Fixing Common Issues](#fixing-common-issues)
7. [Getting Help](#getting-help)

---

## What This Tool Does

This accessibility auditing framework automatically scans your zSpace Unity application and generates comprehensive compliance reports against:

- **WCAG 2.2 Level AA** - Web Content Accessibility Guidelines (international standard)
- **W3C XAUR** - XR Accessibility User Requirements (stereoscopic 3D specific)
- **Section 508** - US federal accessibility requirements
- **EN 301 549** - European accessibility standard

### What You'll Get

After running an audit, you'll receive **5 professional reports**:

1. **README.md** - Quick overview and getting started guide
2. **AUDIT-SUMMARY.md** - Executive summary for stakeholders (great for non-technical audiences)
3. **VPAT-{your-app}.md** - Legal compliance documentation for procurement
4. **ACCESSIBILITY-RECOMMENDATIONS.md** - Specific, actionable fixes for developers
5. **accessibility-analysis.json** - Raw data for tooling integration

### How Long Does It Take?

- **Installation:** 5 minutes (one-time setup)
- **Running an audit:** < 1 minute (even for large projects)
- **Reading results:** 10-15 minutes
- **Implementing fixes:** 4-12 weeks (depending on project size and current state)

---

## Prerequisites

### Required Software

**1. Node.js v16 or higher**

Check if you have it:
```bash
node --version
```

If you see `v16.0.0` or higher, you're good! If not, download from:
- **Official website:** https://nodejs.org/ (choose "LTS" version)
- **Windows:** Download installer and run it
- **macOS:** Download installer or use `brew install node`
- **Linux:** Use your package manager (`apt install nodejs npm`)

**2. Access to your Unity project source code**

You need the **full Unity project directory**, not just the built executable. The directory should contain:
- `Assets/` folder
- `ProjectSettings/` folder
- `*.unity` scene files

**What about Unity Editor?**

You do NOT need Unity Editor installed. The audit tool analyzes C# scripts and Unity project files directly.

---

## Installation

### Option 1: Global Installation (Recommended)

Install once, use anywhere:

```bash
npm install -g accessibility-standards-unity
```

**Verify installation:**
```bash
a11y-audit-zspace --help
```

You should see usage information. If you see "command not found," try restarting your terminal.

### Option 2: Local Installation

If you don't have global npm permissions:

```bash
# Clone or download the framework
git clone https://github.com/jdonnelly-zspace/accessibility-standards-unity.git
cd accessibility-standards-unity

# Install dependencies
npm install

# Run audits using Node
node bin/audit.js /path/to/your/unity/project
```

### Option 3: Using Claude Code

If you use Anthropic's Claude Code CLI tool:

1. Clone this repository
2. Navigate to the repository directory in Claude Code
3. Run the slash command:
```
/audit-zspace /path/to/your/unity/project
```

---

## Running Your First Audit

### Step 1: Locate Your Unity Project

Find the **root directory** of your Unity project. It should look like this:

```
your-unity-project/
├── Assets/
│   ├── Scenes/
│   ├── Scripts/
│   └── ...
├── ProjectSettings/
├── Packages/
└── ...
```

**Common mistake:** Don't point to the parent folder containing multiple projects, or to the build output folder. Point to the specific Unity project root.

### Step 2: Run the Audit

**If you installed globally:**
```bash
a11y-audit-zspace /path/to/your-unity-project
```

**If using local installation:**
```bash
cd /path/to/accessibility-standards-unity
node bin/audit.js /path/to/your-unity-project
```

**Example (Windows):**
```bash
a11y-audit-zspace "C:\Users\YourName\UnityProjects\MyZSpaceApp"
```

**Example (macOS/Linux):**
```bash
a11y-audit-zspace ~/UnityProjects/MyZSpaceApp
```

### Step 3: Wait for Completion

You'll see progress output:
```
Starting accessibility audit...
✓ Project found: MyZSpaceApp
✓ Analyzing 15 scenes...
✓ Scanning 247 scripts...
✓ Detecting accessibility patterns...
✓ Generating reports...

Audit complete! Reports saved to:
/path/to/your-unity-project/AccessibilityAudit/

Compliance Score: 52% (Partially Conformant)
Critical Issues: 2
High Priority: 3
```

**Typical execution time:** 0.2 - 2 seconds (depending on project size)

### Step 4: Review the Reports

Navigate to your Unity project and find the new `AccessibilityAudit/` folder:

```
your-unity-project/
├── AccessibilityAudit/        ← NEW!
│   ├── README.md
│   ├── AUDIT-SUMMARY.md
│   ├── VPAT-MyZSpaceApp.md
│   ├── ACCESSIBILITY-RECOMMENDATIONS.md
│   └── accessibility-analysis.json
├── Assets/
└── ...
```

**Start with:** `AUDIT-SUMMARY.md` - This gives you the big picture.

---

## Understanding Your Results

### Compliance Score

Your audit report will show a compliance score from 0-100%:

| Score | Status | What It Means |
|-------|--------|---------------|
| **90-100%** | Fully Compliant | Production-ready! WCAG 2.2 Level AA certified |
| **70-89%** | Substantially Conformant | Minor issues, most users can access the app |
| **50-69%** | Partially Conformant | Major accessibility gaps, significant work needed |
| **0-49%** | Non-Conformant | Critical failures blocking users with disabilities |

**First-time audit?** Most applications score 30-50% before implementing accessibility features. This is normal!

### Issue Severity Levels

Issues are categorized by impact:

#### CRITICAL (Must Fix)
- **WCAG Level:** A (minimum requirement)
- **Impact:** Users with disabilities cannot use your app at all
- **Examples:**
  - No keyboard alternatives for stylus input
  - No screen reader support
  - Application requires stereoscopic 3D vision (no alternatives)
- **Timeline:** Fix immediately before release

#### HIGH (Should Fix)
- **WCAG Level:** AA (standard requirement)
- **Impact:** Significantly reduced accessibility for some users
- **Examples:**
  - Insufficient color contrast
  - Missing focus indicators
  - No captions for audio
- **Timeline:** Fix in next development sprint

#### MEDIUM (Nice to Have)
- **WCAG Level:** Best practices
- **Impact:** Minor usability issues
- **Examples:**
  - Inconsistent navigation
  - Small touch targets
  - Missing help text
- **Timeline:** Plan for future release

#### LOW (Enhancements)
- **WCAG Level:** AAA or enhancements
- **Impact:** Quality-of-life improvements
- **Examples:**
  - Advanced customization options
  - Additional input methods
  - Enhanced visual feedback
- **Timeline:** Backlog item

### Reading AUDIT-SUMMARY.md

This is your executive summary. Key sections:

**1. Executive Summary**
- Overall compliance score
- WCAG Level A/AA pass/fail status
- Total findings by severity

**2. Critical Findings**
- Specific blocking issues
- User impact (% of users affected)
- Recommended solutions

**3. Estimated Remediation Effort**
- Timeline to compliance (typically 6-13 weeks)
- Phased approach (Critical → High → Medium → Low)

**4. Recommended Next Steps**
- Immediate actions (this week)
- Short-term fixes (weeks 1-6)
- Medium-term polish (weeks 7-13)

### Reading ACCESSIBILITY-RECOMMENDATIONS.md

This is your developer implementation guide. For each issue:

**Problem:** Clear description of the accessibility barrier

**Solution:** Specific code or component to implement

**Files to Copy:** Ready-to-use components from the framework

**Implementation Steps:** Step-by-step integration instructions

**Success Criteria:** How to verify the fix works

### Understanding VPAT (Legal Compliance)

VPAT (Voluntary Product Accessibility Template) is used for:
- Government procurement (Section 508 compliance)
- Educational institution requirements
- Healthcare software certification
- EU accessibility regulations (EN 301 549)

The VPAT report maps every WCAG criterion to your application with:
- **Supports:** Feature is fully accessible
- **Partially Supports:** Feature works but has minor issues
- **Does Not Support:** Feature fails accessibility requirements
- **Not Applicable:** Feature not present in application

---

## Fixing Common Issues

### Issue 1: "No Keyboard Alternatives for Stylus Interactions"

**What it means:** Your app requires the zSpace stylus with no keyboard option.

**Why it matters:** 10-15% of users cannot use a stylus effectively (motor disabilities, tremors, limited dexterity).

**How to fix:**

Copy the framework component:
```bash
# From the framework installation
cp accessibility-standards-unity/implementation/unity/scripts/KeyboardStylusAlternative.cs \
   your-unity-project/Assets/Scripts/Accessibility/
```

Add keyboard mappings to your scripts:
```csharp
// Add this to any script that uses stylus input
void Update() {
    // Original stylus code
    if (stylus.GetButtonDown(0)) {
        SelectObject();
    }

    // ADD THIS: Keyboard alternative
    if (Input.GetKeyDown(KeyCode.Space)) {
        SelectObject();  // Same function!
    }
}
```

**Result:** Users can now use Space key instead of stylus button.

### Issue 2: "No Depth Perception Alternatives"

**What it means:** Your app requires stereoscopic 3D vision to understand spatial relationships.

**Why it matters:** 10-15% of users cannot perceive stereoscopic depth (stereoblindness, monocular vision, eye conditions).

**How to fix:**

Copy the framework component:
```bash
cp accessibility-standards-unity/implementation/unity/scripts/DepthCueManager.cs \
   your-unity-project/Assets/Scripts/Accessibility/
```

Add to your scene:
1. Create empty GameObject: "DepthCueManager"
2. Add `DepthCueManager.cs` component
3. Configure in Inspector:
   - ✓ Enable Size Scaling
   - ✓ Enable Dynamic Shadows
   - ✓ Enable Spatial Audio
   - ✓ Enable Haptic Feedback

**Result:** Users without 3D vision get depth cues from size, shadows, sound, and vibration.

### Issue 3: "No Screen Reader Support"

**What it means:** UI elements don't provide information to screen readers (NVDA, JAWS, Narrator).

**Why it matters:** 2-3% of users rely on screen readers (blind, low vision).

**How to fix:**

Copy the framework component:
```bash
cp accessibility-standards-unity/implementation/unity/scripts/AccessibleStylusButton.cs \
   your-unity-project/Assets/Scripts/Accessibility/
```

Add to all UI buttons:
```csharp
using UnityEngine.Accessibility;

public class MyButton : MonoBehaviour {
    void Start() {
        // Add accessibility information
        var node = GetComponent<AccessibilityNode>();
        node.label = "Start Exploration";  // What screen reader announces
        node.role = AccessibilityRole.Button;  // Type of element
        node.isActive = true;
    }
}
```

Or use the framework component (easier):
1. Add `AccessibleStylusButton.cs` to button GameObject
2. Set "Button Label" in Inspector
3. Done!

**Result:** Screen reader users hear "Start Exploration, Button" when focusing the element.

### Issue 4: "Insufficient Color Contrast"

**What it means:** Text or UI elements don't have enough contrast against background.

**Why it matters:** 8% of men and 0.5% of women have color vision deficiency. Low vision users need high contrast.

**How to fix:**

Check contrast ratios:
- **Normal text (< 24px):** Need 4.5:1 contrast minimum
- **Large text (≥ 24px):** Need 3:1 contrast minimum

**Tools:**
- Online checker: https://webaim.org/resources/contrastchecker/
- Unity Editor tool: `accessibility-standards-unity/implementation/unity/editor/ContrastCheckerZSpace.cs`

**Quick fixes:**
- Dark text on light background (black on white = 21:1 ✓)
- Light text on dark background (white on black = 21:1 ✓)
- Avoid: Gray text on gray background
- Avoid: Low-saturation colors against each other

---

## Troubleshooting

### "Cannot find Unity project" Error

**Symptom:**
```
Error: No Assets/ directory found at path
```

**Cause:** Pointing to wrong directory

**Solution:** Make sure path points to Unity project root containing `Assets/` and `ProjectSettings/`:
```bash
# WRONG (parent directory):
a11y-audit-zspace /Users/Name/UnityProjects

# CORRECT (project root):
a11y-audit-zspace /Users/Name/UnityProjects/MyZSpaceApp
```

### "command not found: a11y-audit-zspace" Error

**Symptom:** After `npm install -g`, command not recognized

**Cause:** npm global bin directory not in PATH

**Solution 1:** Restart your terminal/command prompt

**Solution 2:** Find npm global directory:
```bash
npm config get prefix
```

Add that directory's `bin/` subfolder to your PATH.

**Solution 3:** Use local installation instead:
```bash
git clone https://github.com/jdonnelly-zspace/accessibility-standards-unity.git
cd accessibility-standards-unity
npm install
node bin/audit.js /path/to/project
```

### Compliance Score Seems Too Low

**Symptom:** Score is 30% but you think your app is accessible

**Cause:** Framework components not detected, or components implemented differently than expected

**Solution:**

Run audit in verbose mode to see detection details:
```bash
a11y-audit-zspace /path/to/project --verbose
```

Check that component names match exactly:
- ✓ `KeyboardStylusAlternative.cs` (correct)
- ✗ `KeyboardAlternative.cs` (won't be detected)
- ✓ `DepthCueManager.cs` (correct)
- ✗ `DepthManager.cs` (won't be detected)

Components must be in `Assets/Scripts/` or subdirectories.

### Need to Customize Reports

**Symptom:** Want to add company branding or change report format

**Solution:** Templates are located in:
```
accessibility-standards-unity/templates/audit/
├── README.template.md
├── AUDIT-SUMMARY.template.md
├── VPAT.template.md
└── ACCESSIBILITY-RECOMMENDATIONS.template.md
```

Edit these files before running audits. See `docs/AUDITING-GUIDE.md` for template customization instructions.

---

## Getting Help

### Documentation

- **This guide** - Partner onboarding
- **AUDITING-GUIDE.md** - Detailed usage instructions
- **CLAUDE-PROMPTS.md** - Using with Claude Code AI assistant
- **ZSPACE-ACCESSIBILITY-CHECKLIST.md** - Complete WCAG checklist

### External Resources

**Standards:**
- WCAG 2.2 Quick Reference: https://www.w3.org/WAI/WCAG22/quickref/
- W3C XAUR: https://www.w3.org/TR/xaur/
- Section 508: https://www.section508.gov/

**Tools:**
- NVDA Screen Reader (free): https://www.nvaccess.org/
- Color Contrast Checker: https://webaim.org/resources/contrastchecker/
- zSpace Developer Portal: https://developer.zspace.com/

### Support

**GitHub Issues:**
https://github.com/jdonnelly-zspace/accessibility-standards-unity/issues

When reporting issues, please include:
1. Your operating system and Node.js version
2. Complete error message
3. Path to Unity project (if not sensitive)
4. Output from running with `--verbose` flag

**Community:**
- Check existing issues for solutions
- Search closed issues for past fixes
- Tag issues with `question`, `bug`, or `enhancement`

---

## Next Steps

Now that you've run your first audit:

1. **✓ Read AUDIT-SUMMARY.md** - Understand your compliance status
2. **✓ Review ACCESSIBILITY-RECOMMENDATIONS.md** - See specific fixes
3. **✓ Copy framework components** - Don't rebuild from scratch
4. **✓ Fix critical issues first** - Start with Level A violations
5. **✓ Test manually** - Verify fixes work for users
6. **✓ Re-audit** - Measure progress and track improvements
7. **✓ Share VPAT with stakeholders** - Demonstrate compliance

### Recommended Timeline

**Week 1-2: Assessment**
- Run audit
- Share results with team
- Prioritize findings
- Plan implementation sprints

**Week 3-8: Critical Fixes (Level A)**
- Implement keyboard alternatives
- Add screen reader support
- Create depth perception alternatives
- Target: 60-70% compliance

**Week 9-13: High Priority (Level AA)**
- Fix color contrast
- Add focus indicators
- Implement captions/transcripts
- Target: 90-100% compliance

**Ongoing: Maintain Compliance**
- Audit before each release
- Test with users with disabilities
- Update as standards evolve

---

## Frequently Asked Questions

### Do I need Unity Editor installed?

**No.** The audit tool analyzes C# scripts and Unity project files directly. Unity Editor is not required.

### Will this work with Unity versions < 2020?

**Partially.** The audit works with any Unity version, but some accessibility APIs (like `UnityEngine.Accessibility`) were added in Unity 2020.1+. Older projects will receive more critical findings.

### Can I audit exported builds instead of source?

**No.** The tool needs access to C# scripts and Unity scene files. Built executables have been compiled and cannot be analyzed this way.

### Is this free?

**Yes.** This framework is open source (MIT License). Use it for any project, commercial or non-commercial.

### Does this guarantee legal compliance?

**No automated tool can guarantee compliance.** This tool provides 80-90% accuracy for automated detection. You must also:
- Manually test with keyboard, screen reader, and 2D mode
- Ideally test with users with disabilities
- Review generated VPAT with legal/compliance team

### How often should I run audits?

**Recommended:**
- During development: Weekly
- Before releases: Always
- After major features: Immediately
- Quarterly: Full compliance review

### Can I integrate this with CI/CD?

**Yes!** See `docs/AUDITING-GUIDE.md` section "Best Practices" for GitHub Actions example. The tool outputs JSON for automated parsing.

### What if my project isn't a zSpace app?

This framework is **optimized for zSpace** (stereoscopic 3D desktop platform) but works for any Unity application. You'll get:
- ✓ Full WCAG 2.2 Level AA analysis
- ✓ General Unity accessibility checks
- ✗ zSpace-specific checks won't apply (depth perception, stylus, etc.)

---

**Welcome to accessible zSpace development!** We're excited to help you make your applications usable by everyone.

**Document Version:** 1.0
**Last Updated:** 2025-10-20
**Framework Version:** 2.2.0
**Questions?** https://github.com/jdonnelly-zspace/accessibility-standards-unity/issues
