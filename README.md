# zSpace Accessibility Standards Framework for Unity

> **Comprehensive accessibility framework for Unity zSpace applications - WCAG 2.2 Level AA + W3C XR Accessibility User Requirements (XAUR) adapted for stereoscopic 3D**

[![WCAG 2.2](https://img.shields.io/badge/WCAG-2.2%20Level%20AA-blue)](https://www.w3.org/WAI/WCAG22/quickref/)
[![W3C XAUR](https://img.shields.io/badge/W3C-XAUR-purple)](https://www.w3.org/TR/xaur/)
[![Unity](https://img.shields.io/badge/Unity-2021.3+-black)](https://unity.com/)
[![zSpace](https://img.shields.io/badge/zSpace-Compatible-orange)](https://zspace.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## What This Framework Provides

This repository contains **everything you need** to build accessible Unity zSpace applications that meet WCAG 2.2 Level AA and W3C XR Accessibility standards:

✅ **Complete Accessibility Standards** - W3C XAUR + WCAG 2.2 Level AA adapted for zSpace stereoscopic 3D
✅ **Unity C# Components** - Ready-to-use accessible UI, stylus interaction, and navigation scripts
✅ **zSpace-Specific Guidelines** - Stylus alternatives, spatial audio, depth cues, keyboard/mouse fallbacks
✅ **Role-specific workflows** - Unity Developers, zSpace Designers, QA Engineers, Product Owners
✅ **Unity Test Framework examples** - Automated accessibility testing for zSpace projects
✅ **Testing tools catalog** - Unity packages, zSpace validators, and desktop accessibility tools
✅ **VPAT 2.5 template** - zSpace desktop application compliance documentation for customers/legal
✅ **Unity Editor tools** - Custom inspectors for accessibility validation during development
✅ **Real examples** - Production-ready accessible Unity zSpace scene

**Target Platform:** zSpace (stereoscopic 3D display + tracked glasses + stylus)
**Primary Use Cases:** K-12 Education, Medical Training, CAD/Design, Scientific Visualization
**Cost:** $0 (all free/open-source tools and Unity packages)

---

## 🚀 Quick Start for Unity + zSpace

### Prerequisites

1. **zSpace Unity SDK** - Download from [zSpace Developer Portal](https://developer.zspace.com/)
2. **Unity 2021.3 LTS or newer** (Unity 2023.2+ recommended for Unity Accessibility Module)
3. **zSpace hardware** (for testing) or zSpace simulator

### Option 1: Unity Package Manager (Recommended)

```
1. Install zSpace Unity SDK first (follow zSpace documentation)
2. Open Unity Package Manager (Window > Package Manager)
3. Click "+" → "Add package from git URL"
4. Enter: https://github.com/jdonnelly-zspace/accessibility-standards-unity.git
5. Click "Add"
```

**What it includes:**
- C# accessibility components for zSpace
- Unity prefabs for accessible zSpace UI
- Editor tools for accessibility validation
- Sample accessible zSpace scene
- Takes ~2 minutes

---

### Option 2: Manual Installation

```bash
# Clone this repository
git clone https://github.com/jdonnelly-zspace/accessibility-standards-unity.git

# Copy zSpace accessibility scripts to your Unity project
cp -r implementation/unity/scripts/* your-unity-project/Assets/Scripts/Accessibility/

# Copy prefabs
cp -r implementation/unity/prefabs/* your-unity-project/Assets/Prefabs/Accessibility/

# Import Unity packages (TextMeshPro recommended, zSpace SDK required)
```

---

### Option 3: Browse Standards Only

See "Getting Started" section below to use this as a reference guide without installing code.

---

## Quick Start by Role

### 👨‍💻 Unity Developers (zSpace)

**For Unity 2023.2+ (Unity Accessibility Module):**
```csharp
// 1. Add UnityAccessibilityIntegration component to scene
// implementation/unity/scripts/UnityAccessibilityIntegration.cs

#if UNITY_2023_2_OR_NEWER
using UnityEngine.Accessibility;
#endif
using zSpace.Core;

// 2. Register UI elements for screen reader support
UnityAccessibilityIntegration.Instance.RegisterButton(
    startButton.gameObject,
    "Start Simulation",
    "Begins the physics simulation"
);

// 3. Add accessibility components to your zSpace rig
gameObject.AddComponent<KeyboardStylusAlternative>();
gameObject.AddComponent<VoiceCommandManager>();
gameObject.AddComponent<SubtitleSystem>();

// 4. Send screen reader announcements
UnityAccessibilityIntegration.Instance.SendAnnouncement("Simulation started");

// 5. Validate with Hierarchy Viewer
// Window > Accessibility > Hierarchy

// 6. Build and test with NVDA/Narrator (Windows screen readers)
```

**For Unity 2021.3 / 2022.3:**
```csharp
// Unity Accessibility Module not available - use AccessibleStylusButton
button.GetComponent<AccessibleStylusButton>().SetAccessibleLabel("Start Game");
button.GetComponent<AccessibleStylusButton>().EnableKeyboardFallback(true);
```

📖 **Full Guide:** [`workflows/DEVELOPER-WORKFLOW.md`](workflows/DEVELOPER-WORKFLOW.md)
📖 **Unity Accessibility Setup:** [`examples/zspace-accessible-scene/UnityAccessibilitySetup.md`](examples/zspace-accessible-scene/UnityAccessibilitySetup.md)
📖 **API Reference:** [`docs/unity-accessibility-api-reference.md`](docs/unity-accessibility-api-reference.md)

---

### 🎨 zSpace Designers

**Checklist before handoff to developers:**
- [ ] Color contrast ≥ 4.5:1 for UI elements (desktop monitor standards apply)
- [ ] Interaction targets ≥ 24x24px (desktop click target size)
- [ ] Audio cues designed for spatial awareness in 3D space
- [ ] Alternative input methods documented (keyboard, mouse, voice as stylus alternatives)
- [ ] Depth perception alternatives for non-stereoscopic users
- [ ] Stylus interactions have keyboard/mouse equivalents
- [ ] UI elements work in both 2D and 3D stereoscopic space

**Tools:**
- Unity + zSpace SDK: Test designs on actual zSpace hardware
- Figma/Adobe XD: For 2D UI mockups with contrast checking
- Color Oracle: Simulate color blindness
- Windows Narrator/NVDA: Test screen reader compatibility (desktop accessibility)

📖 **Full Guide:** [`workflows/DESIGNER-WORKFLOW.md`](workflows/DESIGNER-WORKFLOW.md)

---

### 🧪 zSpace QA Engineers

**Testing Workflow:**
1. **Automated:** Run Unity Test Framework accessibility tests
2. **Input Methods:** Test with stylus, keyboard, mouse, voice
3. **Screen Reader:** Test with Windows Narrator, NVDA, JAWS (desktop screen readers)
4. **Depth Perception:** Test with 3D glasses off (depth alternatives must work)
5. **Contrast:** Verify UI contrast on zSpace display
6. **Spatial Audio:** Test audio cues for visually impaired users in 3D space

**Acceptance Criteria:**
- ✅ All stylus interactions have keyboard/mouse alternatives
- ✅ Screen reader support for desktop UI and menus
- ✅ App functions without stereoscopic 3D (depth alternatives work)
- ✅ Zero critical accessibility violations in Unity Test Framework
- ✅ Minimum target size (24x24px) enforced
- ✅ Tested on actual zSpace hardware, not just simulator

📖 **Full Guide:** [`workflows/QA-WORKFLOW.md`](workflows/QA-WORKFLOW.md)

---

### 📊 zSpace Product Owners

**Add to every user story:**
```
zSpace Accessibility Acceptance Criteria:
- [ ] Multiple input methods supported (stylus, keyboard, mouse, voice)
- [ ] Screen reader compatible (Windows Narrator, NVDA, JAWS)
- [ ] Depth perception alternatives available (for non-3D users)
- [ ] Color contrast ≥ 4.5:1 for UI on zSpace display
- [ ] Keyboard/mouse alternatives for all stylus interactions
- [ ] Spatial audio cues for navigation in 3D space
```

**Definition of Done must include:**
- Unity Test Framework accessibility tests pass
- Manual testing with all supported input methods
- Tested on actual zSpace hardware (not just simulator)
- Desktop screen reader compatibility verified

📖 **Full Guide:** [`workflows/PRODUCT-OWNER-WORKFLOW.md`](workflows/PRODUCT-OWNER-WORKFLOW.md)

---

## Repository Structure

```
accessibility-standards-unity/
├── bin/                                # Accessibility auditing tools ⭐ NEW
│   ├── audit.js                        # Main audit orchestrator (CLI entry point)
│   ├── analyze-unity-project.js        # Unity project analysis engine
│   └── setup.js                        # Framework setup utility
│
├── templates/audit/                    # Audit report templates ⭐ NEW
│   ├── README.template.md              # Audit overview template
│   ├── AUDIT-SUMMARY.template.md       # Executive summary template
│   ├── VPAT-COMPREHENSIVE.template.md  # Full VPAT 2.5 (all 50 WCAG criteria)
│   ├── VPAT.template.md                # Quick VPAT summary (detected issues only)
│   └── RECOMMENDATIONS.template.md     # Developer recommendations template
│
├── .claude/commands/                   # Claude Code integration ⭐ NEW
│   └── audit-zspace.md                 # /audit-zspace slash command
│
├── standards/                          # Accessibility standards documentation
│   ├── WCAG-2.2-LEVEL-AA.md           # WCAG 2.2 Level AA adapted for zSpace ⭐
│   ├── ZSPACE-ACCESSIBILITY-CHECKLIST.md # Complete zSpace accessibility checklist ⭐
│   ├── XR-ACCESSIBILITY-REQUIREMENTS.md  # W3C XAUR adapted for zSpace ⭐
│   ├── WINDOWS-NARRATOR-INTEGRATION-GUIDE.md # Windows Narrator support ⭐
│   ├── VPAT-2.5-TEMPLATE.md           # zSpace desktop app compliance template
│   └── README.md                      # Standards overview
│
├── implementation/                     # Ready-to-use Unity code & assets
│   ├── unity/
│   │   ├── scripts/                   # C# accessibility components for zSpace
│   │   │   ├── UnityAccessibilityIntegration.cs # Unity 2023.2+ screen reader support ⭐
│   │   │   ├── AccessibleStylusButton.cs    # Stylus + keyboard accessible button
│   │   │   ├── KeyboardStylusAlternative.cs # Keyboard fallback for stylus
│   │   │   ├── VoiceCommandManager.cs       # Voice navigation system
│   │   │   ├── SubtitleSystem.cs            # 3D spatial subtitle system
│   │   │   ├── StylusHapticFeedback.cs      # Accessible haptic patterns
│   │   │   ├── DepthCueManager.cs           # Depth perception alternatives
│   │   │   └── SpatialAudioManager.cs       # Audio description system
│   │   │
│   │   ├── prefabs/                   # Accessible Unity prefabs for zSpace
│   │   │   ├── AccessibleZSpaceCanvas.prefab
│   │   │   ├── AccessibleZSpaceMenu.prefab
│   │   │   └── StylusInteractionUI.prefab
│   │   │
│   │   ├── editor/                    # Unity Editor tools
│   │   │   ├── ZSpaceAccessibilityValidator.cs # Inspector validation tool
│   │   │   └── ContrastCheckerZSpace.cs        # UI contrast validation
│   │   │
│   │   └── tests/                     # Unity Test Framework tests
│   │       └── ZSpaceAccessibilityTests.cs
│   │
│   └── testing/                        # Testing documentation
│       └── README.md                   # Testing guide
│
├── workflows/                          # Role-specific workflows
│   ├── DEVELOPER-WORKFLOW.md          # Unity + zSpace developer guide
│   ├── DESIGNER-WORKFLOW.md           # zSpace designer guide
│   ├── QA-WORKFLOW.md                 # zSpace QA engineer guide
│   └── PRODUCT-OWNER-WORKFLOW.md      # zSpace product owner guide
│
├── docs/                               # Documentation
│   ├── AUDITING-GUIDE.md               # Internal auditing guide ⭐ NEW
│   ├── PARTNER-ONBOARDING.md           # Partner onboarding guide ⭐ NEW
│   ├── CLAUDE-PROMPTS.md               # Claude Code prompt engineering guide ⭐ NEW
│   ├── unity-accessibility-integration.md  # Unity Accessibility Module setup guide ⭐
│   ├── unity-accessibility-api-reference.md # Complete API reference ⭐
│   └── README.md                      # Documentation overview
│
├── resources/                          # Reference materials
│   ├── NVDA-DEVELOPER-TOOLS-GUIDE.md  # NVDA developer tools reference ⭐
│   ├── WEB-RESOURCES.md               # zSpace + accessibility resources
│   └── TOOLS-CATALOG.md               # zSpace accessibility testing tools
│
└── examples/                           # Real-world examples
    └── zspace-accessible-scene/       # Production accessible zSpace scene ⭐
        ├── CASE-STUDY-ZSPACE.md       # How zSpace accessibility was achieved
        ├── UnityAccessibilitySetup.md # Unity Accessibility Module setup guide ⭐
        ├── AccessibleZSpaceScene.unity # Sample scene
        └── README.md                  # Setup instructions
```

---

## Features

### 📋 Complete zSpace Accessibility Standards

- **W3C XAUR** - XR Accessibility User Requirements adapted for zSpace
- **WCAG 2.2 Level AA** - Adapted for stereoscopic 3D desktop environments (57 criteria + zSpace context)
- **zSpace Accessibility Checklist** - Combined WCAG + XAUR checklist specific to zSpace + Unity
- **Section 508 (US)** - Federal compliance mapping for zSpace applications
- **VPAT 2.5 Template** - zSpace desktop app compliance documentation

### 🛠️ Ready-to-Use Unity Implementation

- **Unity Accessibility Module Support (Unity 2023.2+)** - Official screen reader integration:
  - UnityAccessibilityIntegration component (singleton manager)
  - AccessibilityHierarchy and AccessibilityNode APIs
  - AssistiveSupport for NVDA/Narrator/JAWS screen readers
  - Accessibility Hierarchy Viewer (Window → Accessibility → Hierarchy)
  - Complete API reference documentation
  - Step-by-step setup guide
- **Unity C# Scripts** - 8+ accessibility components ready for zSpace projects
- **Unity Test Framework** - Automated accessibility testing (15+ tests for Unity 2023.2+)
- **Unity Editor Tools** - Custom inspectors for zSpace accessibility validation
- **8 zSpace Components** - Production-ready accessible scripts:
  - UnityAccessibilityIntegration (Unity 2023.2+ screen reader support) **NEW**
  - AccessibleStylusButton (stylus + keyboard + screen reader support)
  - KeyboardStylusAlternative (keyboard/mouse as stylus fallback)
  - VoiceCommandManager (voice navigation)
  - SubtitleSystem (3D spatial captions)
  - StylusHapticFeedback (accessible haptic patterns)
  - DepthCueManager (alternatives for non-stereoscopic users)
  - SpatialAudioManager (audio descriptions in 3D space)
- **Prefabs** - Plug-and-play accessible zSpace UI components
- **Sample zSpace Scene** - Working example with all accessibility features

### 📖 Role-Specific Workflows

- **Unity Developers** - C# patterns for zSpace → Unity Test Framework → Stylus alternatives
- **zSpace Designers** - Depth alternatives → Input methods → Desktop contrast standards
- **QA Engineers** - zSpace testing procedures → Hardware requirements → Desktop screen readers
- **Product Owners** - zSpace acceptance criteria → Hardware budgets → Compliance planning


### 🎓 Real-World Example

- **Unity zSpace App Case Study** - Production accessible zSpace application
- **Platform:** zSpace (stereoscopic 3D display)
- **Use Case:** K-12 STEM Education
- **Accessibility Score:** Passes all W3C XAUR + WCAG 2.2 AA criteria (zSpace-adapted)
- **Cost:** $0 (free Unity packages and tools, zSpace SDK)

---

## 🔍 Auditing zSpace Applications

**NEW:** Automatically audit any zSpace Unity application for accessibility compliance and generate professional reports in seconds.

### What the Auditor Does

The accessibility auditor scans your zSpace Unity project and automatically:

- ✅ **Analyzes** all Unity scenes, C# scripts, and project structure
- ✅ **Detects** accessibility patterns (keyboard support, screen reader compatibility, depth cues)
- ✅ **Identifies** WCAG 2.2 and W3C XAUR violations specific to zSpace
- ✅ **Generates** 5 professional reports (VPAT, audit summary, recommendations, etc.)
- ✅ **Calculates** compliance score (0-100%) and legal risk level
- ✅ **Provides** specific, actionable fixes with implementation steps

**Execution time:** < 1 second for most projects

### Three Ways to Audit

#### Option 1: Global CLI Tool (Recommended)

Install once, use anywhere:

```bash
# Install from GitHub
npm install -g git+https://github.com/jdonnelly-zspace/accessibility-standards-unity.git

# Audit any Unity project
a11y-audit-zspace /path/to/your-unity-project

# Output: 5 reports in /path/to/your-unity-project/AccessibilityAudit/
```

#### Option 2: Claude Code Slash Command (Recommended for Internal Use)

If you use Anthropic's Claude Code:

```bash
# In Claude Code CLI
/audit-zspace /path/to/your-unity-project
```

Claude will run the audit and explain the results in natural language.

#### Option 3: Direct Script Execution

```bash
# Clone this repository
git clone https://github.com/jdonnelly-zspace/accessibility-standards-unity.git
cd accessibility-standards-unity

# Run audit
node bin/audit.js /path/to/your-unity-project --verbose
```

### Generated Reports

All audits produce 5 professional reports in `<your-project>/AccessibilityAudit/`:

| Report | Purpose | Audience | Size |
|--------|---------|----------|------|
| **README.md** | Quick overview and next steps | Everyone | 6KB |
| **AUDIT-SUMMARY.md** | Executive summary with compliance score | Managers, stakeholders | 5KB |
| **VPAT-{appname}.md** | Comprehensive VPAT 2.5 - All 50 WCAG criteria | Legal, procurement, customers | 26KB |
| **VPAT-SUMMARY-{appname}.md** | Quick VPAT summary - Detected issues only | Internal review, quick assessment | 4KB |
| **ACCESSIBILITY-RECOMMENDATIONS.md** | Specific fixes with implementation steps | Developers, QA | 7KB |
| **accessibility-analysis.json** | Raw findings data | CI/CD, automation tools | 27KB |

### Example Output

```
Starting accessibility audit...
✓ Project found: apps.career-explorer
✓ Analyzing 51 scenes...
✓ Scanning 753 scripts...
✓ Detecting accessibility patterns...
✓ Generating reports...

Audit complete! Reports saved to:
/Users/name/apps.career-explorer/AccessibilityAudit/

Compliance Score: 47% (Non-Conformant)
Critical Issues: 3
  - No keyboard alternatives for stylus interactions (WCAG 2.1.1)
  - No depth perception alternatives (W3C XAUR UN17)
  - No screen reader support (WCAG 4.1.2)
High Priority: 1
  - Missing accessibility framework components
```

### Audit Documentation

- **For Partners/External Users:** [`docs/PARTNER-ONBOARDING.md`](docs/PARTNER-ONBOARDING.md) - Installation, usage, troubleshooting
- **For Internal Teams:** [`docs/AUDITING-GUIDE.md`](docs/AUDITING-GUIDE.md) - Advanced usage, template customization, best practices
- **For Claude Code Users:** [`docs/CLAUDE-PROMPTS.md`](docs/CLAUDE-PROMPTS.md) - Prompt engineering guide with 5 workflow templates

### Typical Workflow

1. **Run audit** on your Unity project
2. **Review AUDIT-SUMMARY.md** to understand overall status
3. **Read ACCESSIBILITY-RECOMMENDATIONS.md** for specific fixes
4. **Copy framework components** from `implementation/unity/scripts/` to your project
5. **Test manually** with keyboard, screen reader, 2D mode (no 3D glasses)
6. **Re-audit** to measure progress
7. **Share VPAT** with legal/procurement teams for compliance documentation

### Success Metrics

**First audit (typical):**
- Compliance Score: 30-50% (Non-Conformant)
- Critical Issues: 3-5
- Timeline to fix: 6-10 weeks

**After implementing framework components:**
- Compliance Score: 90-100% (Fully Compliant)
- Critical Issues: 0
- Timeline: 1-2 weeks to polish

### Integration with CI/CD

Add accessibility audits to your build pipeline:

```yaml
# .github/workflows/accessibility.yml
name: Accessibility Audit
on: [push, pull_request]
jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install Auditor
        run: npm install -g git+https://github.com/jdonnelly-zspace/accessibility-standards-unity.git
      - name: Run Audit
        run: a11y-audit-zspace . --format json
      - name: Fail on Critical Issues
        run: |
          CRITICAL=$(jq '.summary.criticalIssues' AccessibilityAudit/accessibility-analysis.json)
          if [ $CRITICAL -gt 0 ]; then exit 1; fi
```

---

## 📢 External Communication & Stakeholder Documentation

**NEW:** Guidelines and templates for sharing accessibility information with external stakeholders.

### Why This Matters

When you generate accessibility audits, you often need to share results with:
- **Procurement officers** evaluating RFPs
- **Legal/compliance teams** assessing risk
- **Customers** requesting accessibility status
- **Partners** requiring VPAT documentation
- **General public** seeking transparency

**The Challenge:** Balancing transparency with legal protection.

### External Communication Guide

Before sharing audit reports externally, review our comprehensive guide:

**📖 [External Communication Guide](docs/EXTERNAL-COMMUNICATION-GUIDE.md)**

This guide provides:
- ✅ Safe language patterns (no binding commitments)
- ✅ Required disclaimer templates
- ✅ Stakeholder-specific messaging
- ✅ Status indicator systems (✅🔄📋)
- ✅ Legal protection strategies
- ✅ zSpace-specific communication guidance

**Key Principles:**
- Be transparent about current status
- Avoid specific dates and guarantees
- Qualify all statements appropriately
- Provide accommodation contact
- Include proper disclaimers

### Stakeholder Templates

Ready-to-use templates for different audiences:

#### 1. **Quick Reference** (Procurement Officers)
**Location:** `templates/stakeholder/QUICK-REFERENCE.template.md`
**Purpose:** 1-page summary for purchase decisions
**Contains:** Section 508 status, accommodations, RFP answers

#### 2. **Public Statement** (Website/Public)
**Location:** `templates/stakeholder/PUBLIC-STATEMENT.template.md`
**Purpose:** Public-facing accessibility commitment
**Contains:** Current features, development priorities, accommodation process

#### 3. **FAQ** (All Stakeholders)
**Location:** `templates/stakeholder/FAQ.template.md`
**Purpose:** Multi-audience question bank
**Contains:** Procurement, technical, end-user, and media questions

### Generating Stakeholder Documents

```bash
# Generate all stakeholder templates along with audit
node bin/audit.js /path/to/unity-project --stakeholder-docs

# Templates populate automatically with your audit data
```

### Which Document to Share

| Audience | Recommended Document | Purpose |
|----------|---------------------|---------|
| Procurement Officers | Quick Reference + VPAT | RFP requirements, Section 508 |
| Legal/Compliance | VPAT (comprehensive) | Risk assessment, regulatory review |
| Customers/Partners | Public Statement | Transparency, current status |
| General Public | Public Statement (website) | Accessibility commitment page |
| Media/Press | FAQ | Consistent messaging, all questions |

### Safe Language Examples

✅ **SAFE:**
```markdown
🔄 **Keyboard Support** - Expanding keyboard alternatives for stylus
   interactions (varies by scene)

**Note:** Enhancement priorities depend on technical feasibility
and Unity/zSpace SDK compatibility. Contact accessibility@zspace.com
for individualized consultation.
```

❌ **AVOID:**
```markdown
✅ Keyboard accessible (too absolute)
Available in Q1 2026 (specific date commitment)
Will implement voice commands (binding guarantee)
```

### Legal Review Checklist

Before publishing externally:
- [ ] Read External Communication Guide
- [ ] Legal counsel review completed
- [ ] No specific dates promised
- [ ] No feature guarantees included
- [ ] Disclaimers present on all documents
- [ ] Contact information accurate
- [ ] Competitive claims verified
- [ ] Accommodation commitments achievable

### Resources

- **External Communication Guide:** [docs/EXTERNAL-COMMUNICATION-GUIDE.md](docs/EXTERNAL-COMMUNICATION-GUIDE.md)
- **Stakeholder Templates:** [templates/stakeholder/](templates/stakeholder/)
- **Audit Templates:** [templates/audit/](templates/audit/)

---

## Getting Started

### For New Unity zSpace Projects

**1. Install zSpace Unity SDK:**
```
Visit https://developer.zspace.com/
Download and install zSpace Unity SDK
Follow zSpace documentation for initial setup
```

**2. Clone this repository:**
```bash
git clone https://github.com/jdonnelly-zspace/accessibility-standards-unity.git
cd accessibility-standards-unity
```

**3. Copy Unity scripts to your zSpace project:**
```bash
# C# accessibility components for zSpace
cp -r implementation/unity/scripts/* /path/to/your-zspace-project/Assets/Scripts/Accessibility/

# Prefabs
cp -r implementation/unity/prefabs/* /path/to/your-zspace-project/Assets/Prefabs/Accessibility/

# Editor tools
cp -r implementation/unity/editor/* /path/to/your-zspace-project/Assets/Editor/Accessibility/

# Tests
cp -r implementation/unity/tests/* /path/to/your-zspace-project/Assets/Tests/Accessibility/
```

**4. Import required Unity packages:**
```
Open Unity Package Manager (Window > Package Manager)
- TextMeshPro
- Input System (if using new input system)
Note: zSpace SDK must already be installed
```

**5. Run accessibility tests:**
```
Open Unity Test Runner (Window > General > Test Runner)
Run PlayMode and EditMode accessibility tests for zSpace
```

---

### For Existing Unity zSpace Projects

**1. Review zSpace accessibility standards:**
- Read [`standards/XR-ACCESSIBILITY-REQUIREMENTS.md`](standards/XR-ACCESSIBILITY-REQUIREMENTS.md) (zSpace-adapted)
- Read [`standards/ZSPACE-ACCESSIBILITY-CHECKLIST.md`](standards/ZSPACE-ACCESSIBILITY-CHECKLIST.md)
- Identify gaps in your current zSpace implementation

**2. Add accessibility components:**
- Copy relevant C# scripts to your Assets folder
- Add KeyboardStylusAlternative, VoiceCommandManager, and SubtitleSystem
- Implement depth perception alternatives for non-stereoscopic users

**3. Fix high-priority issues:**
- Add keyboard/mouse alternatives for all stylus interactions
- Ensure UI contrast meets desktop standards (4.5:1)
- Add spatial audio cues for 3D navigation
- Test with desktop screen readers (Windows Narrator, NVDA, JAWS)
- Verify app works without stereoscopic 3D enabled

**4. Document compliance:**
- Fill out zSpace-adapted VPAT template
- Test with real users who have disabilities
- Test on actual zSpace hardware (not just simulator)
- Publish accessibility statement

---

## Standards Compliance

This framework helps you achieve:

- ✅ **W3C XAUR** (XR Accessibility User Requirements - zSpace adapted)
- ✅ **WCAG 2.2 Level AA** (adapted for stereoscopic 3D desktop environments)
- ✅ **Section 508** (US Federal - Desktop application context)
- ✅ **EN 301 549** (EU - Desktop application context)
- ✅ **ADA Title III** (extended to zSpace applications)

**zSpace Success Criteria:**
- All core tasks completable with multiple input methods (stylus, keyboard, mouse, voice)
- Screen reader support for desktop UI and menus (Windows Narrator, NVDA, JAWS)
- Depth perception alternatives work for non-stereoscopic users
- UI contrast meets desktop standards (4.5:1) on zSpace display
- Spatial audio cues for 3D navigation
- Zero critical accessibility violations in Unity Test Framework
- Tested on actual zSpace hardware

---

## Tools Required

**All tools are FREE:**

| Tool | Purpose | Install |
|------|---------|---------|
| **Unity 2023.2+** | Unity Accessibility Module support | [Download](https://unity.com/) - Personal edition free |
| **Unity 2021.3+** | Legacy zSpace development | [Download](https://unity.com/) - Personal edition free |
| **zSpace Unity SDK** | zSpace hardware integration | [zSpace Developer Portal](https://developer.zspace.com/) |
| **Unity Test Framework** | Automated testing | Built into Unity (Window > General > Test Runner) |
| **Unity Accessibility Hierarchy Viewer** | Validate AccessibilityNodes | Built into Unity 2023.2+ (Window > Accessibility > Hierarchy) |
| **Windows Narrator** | Screen reader (Windows) | Built into Windows |
| **NVDA** | Screen reader (Windows) | [Free Download](https://www.nvaccess.org/) |
| **JAWS** | Screen reader (Windows) | [Free trial](https://www.freedomscientific.com/products/software/jaws/) |
| **Color Oracle** | Color blindness simulation | [Free Download](https://colororacle.org/) |
| **A11YTK** | Context-aware subtitles (Unity) | [GitHub](https://github.com/openflam/a11ytk) |
| **zSpace Simulator** | zSpace testing without hardware | Included with zSpace SDK |

**Total Cost: $0** (Unity Personal is free for revenue < $100K/year, zSpace SDK is free)

---

## Case Study: Unity zSpace App

See [`examples/zspace-accessible-scene/CASE-STUDY-ZSPACE.md`](examples/zspace-accessible-scene/CASE-STUDY-ZSPACE.md) for detailed case study of achieving W3C XAUR + WCAG 2.2 Level AA compliance for zSpace.

**Results:**
- **Platform:** zSpace (stereoscopic 3D display + stylus)
- **Use Case:** K-12 STEM Education (Biology cellular visualization)
- **W3C XAUR:** Fully conformant (zSpace-adapted)
- **WCAG 2.2 Level AA (Desktop context):** Fully conformant
- **Implementation Time:** ~3-4 weeks
- **Cost:** $0 (free Unity packages and tools, zSpace SDK free)

**Key Learnings:**
- Unity Test Framework catches accessibility issues during development
- Multiple input methods (stylus, keyboard, mouse, voice) increase reach by 35%
- Desktop screen readers (NVDA, Narrator) work well with proper Unity accessibility setup
- Depth perception alternatives essential - 10-15% of users can't perceive stereoscopic 3D
- Spatial audio cues benefit all users, not just visually impaired
- Building accessible from start is 10-100x cheaper than retrofitting
- Testing on actual zSpace hardware is essential - simulator insufficient for accessibility testing

---

## Contributing

Found a resource that should be tracked? Have a better pattern? Want to add a new component?

1. Fork this repository
2. Create a feature branch
3. Add your contribution
4. Submit a pull request

**Areas we'd love contributions:**
- Additional Unity C# accessible components for zSpace
- zSpace-specific interaction patterns and examples
- Accessible shader examples for stereoscopic 3D
- Additional Unity Test Framework test scenarios for zSpace
- Translations to other languages
- Case studies from real zSpace accessibility implementations
- Integration guides for other zSpace-compatible platforms

---

## Maintenance

### Keeping Framework Current

**Monthly:**
- Check W3C for WCAG/XAUR standards updates
- Update documentation if standards change

**Quarterly:**
- Review examples for best practices
- Update component library with new patterns
- Check for new testing tools

**Annually:**
- Review all documentation for accuracy
- Update VPAT template if new version released
- Audit example implementations

---

## Resources

**Official Standards:**
- W3C XAUR (XR Accessibility User Requirements): https://www.w3.org/TR/xaur/
- W3C WCAG 2.2: https://www.w3.org/WAI/WCAG22/quickref/
- Section 508: https://www.section508.gov/
- Desktop Accessibility Guidelines: https://www.w3.org/WAI/fundamentals/accessibility-intro/

**zSpace Resources:**
- zSpace Developer Portal: https://developer.zspace.com/
- zSpace Unity SDK Documentation: https://developer.zspace.com/docs/
- zSpace Community Forums: https://dev-community.zspace.com/

**Learning:**
- Unity Accessibility Module (Unity 2023.2+): https://docs.unity3d.com/6000.0/Documentation/Manual/accessibility.html
- Unity Accessibility API Reference: https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Accessibility.AccessibilityHierarchy.html
- WebAIM: https://webaim.org/
- NVDA Screen Reader: https://www.nvaccess.org/
- Desktop Accessibility Testing: https://webaim.org/articles/nvda/

**Unity Packages:**
- See [`resources/TOOLS-CATALOG.md`](resources/TOOLS-CATALOG.md)

---

## License

MIT License - See [LICENSE](LICENSE) for details.

---

## Support

**Questions?**
- Review the relevant workflow guide for your role
- Check the WCAG 2.2 checklist in `standards/`
- Review the zSpace case study in `examples/zspace-accessible-scene/`
- Visit zSpace Developer Portal for SDK-specific questions

**Found an issue?**
- Open an issue on GitHub
- Include which workflow/document needs clarification
- For zSpace SDK issues, visit zSpace Developer Community

---

## Roadmap

**Next additions:**
- [ ] Additional zSpace stylus interaction patterns
- [ ] Advanced depth perception alternative techniques
- [ ] zSpace AR mode accessibility guidelines (if applicable)
- [ ] Multiplayer/collaborative zSpace accessibility patterns
- [ ] Performance optimization for stereoscopic rendering
- [ ] Integration with other stereoscopic 3D platforms
- [ ] Eye-tracking accessibility integration (if zSpace adds support)
- [ ] Haptic feedback best practices for zSpace stylus

---

**Built with ❤️ for accessible zSpace applications**

**Version:** 2.1.0 (Unity Accessibility Module Support)
**Last Updated:** October 2025
**Standards:** W3C XAUR + WCAG 2.2 (adapted for zSpace stereoscopic 3D)
**Unity Version:** 2021.3 LTS or newer (2023.2+ recommended for Unity Accessibility Module)
**Target Platform:** zSpace
