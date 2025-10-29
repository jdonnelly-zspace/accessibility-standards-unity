# Video Demo Guide - accessibility-standards-unity v3.1.0

This guide helps you create demonstration videos showcasing the accessibility-standards-unity framework's capabilities.

---

## Demo Types

### 1. Quick Demo (5-7 minutes)
**Audience:** Stakeholders, executives, potential users
**Focus:** Overview and key features

### 2. Technical Demo (15-20 minutes)
**Audience:** Developers, QA engineers
**Focus:** Deep dive into auditing, code generation, CI/CD

### 3. Unity Editor Demo (10-15 minutes)
**Audience:** Unity developers
**Focus:** Editor integration, quick fixes, scene overlays

---

## Equipment Setup

### Minimum Requirements

- **Screen Recording Software:**
  - Windows: OBS Studio (free), Camtasia
  - macOS: QuickTime, ScreenFlow, Camtasia
  - Linux: OBS Studio, SimpleScreenRecorder

- **Microphone:** Built-in or USB microphone (clear audio essential)

- **Resolution:** 1920x1080 (1080p) minimum, 2560x1440 (1440p) recommended

- **Frame Rate:** 30 FPS minimum, 60 FPS for smooth Unity scenes

### Recommended Setup

- **Dual monitors:** One for recording, one for notes/reference
- **External microphone:** Blue Yeti, Audio-Technica ATR2100, or similar
- **Video editor:** DaVinci Resolve (free), Adobe Premiere Pro, Final Cut Pro
- **Script/teleprompter:** For consistent messaging

---

## Pre-Recording Checklist

### Environment Setup

- [ ] Close unnecessary applications (email, Slack, etc.)
- [ ] Disable notifications (Windows: Focus Assist, macOS: Do Not Disturb)
- [ ] Clear desktop clutter
- [ ] Set clean browser bookmarks bar
- [ ] Prepare sample Unity project (career-explorer recommended)
- [ ] Test microphone levels
- [ ] Test screen recording software
- [ ] Prepare terminal with increased font size (14-16pt for visibility)

### Sample Project Preparation

- [ ] Clone career-explorer or sample zSpace project
- [ ] Ensure project compiles without errors
- [ ] Clear previous audit outputs (delete `AccessibilityAudit/` directory)
- [ ] Prepare "before" state (project with accessibility issues)
- [ ] Prepare "after" state (project after fixes applied)

### Framework Setup

- [ ] Install accessibility-standards-unity framework
- [ ] Run `npm install` and verify dependencies
- [ ] Test basic audit command
- [ ] Prepare Unity Editor with framework tools (for Unity Editor demo)

---

## Quick Demo Script (5-7 minutes)

### Section 1: Introduction (30 seconds)

**Script:**
> "Hi, I'm [Name] and today I'll show you accessibility-standards-unity, a comprehensive framework for building accessible Unity applications that comply with WCAG 2.2 and W3C XR Accessibility standards."

**Visual:**
- Show README.md with badges and description
- Briefly scroll through repository structure

### Section 2: The Problem (45 seconds)

**Script:**
> "Accessibility compliance is challenging - WCAG 2.2 has 50 success criteria, testing is manual and time-consuming, and generating compliance documentation takes weeks. Most Unity projects fail basic accessibility requirements."

**Visual:**
- Show WCAG 2.2 quick reference (many criteria)
- Show typical non-accessible Unity project

### Section 3: Running an Audit (2 minutes)

**Script:**
> "Let's audit a Unity project. I'll run the accessibility auditor on this Unity application..."

**Commands:**
```bash
# Navigate to project
cd /path/to/unity-project

# Run audit
node ../accessibility-standards-unity/bin/audit.js . --verbose
```

**Visual:**
- Show command execution with real-time output
- Highlight key findings as they appear:
  - Compliance score: 47%
  - Critical issues: 3
  - High priority issues: 1
  - Total issues: 15

**Script (during execution):**
> "The auditor automatically scans all Unity scenes, analyzes C# scripts, detects accessibility patterns, and identifies WCAG violations. This takes less than 1 second for most projects."

### Section 4: Generated Reports (2 minutes)

**Script:**
> "The audit generates five professional reports..."

**Visual:**
- Open `AccessibilityAudit/` directory
- Briefly show each report:
  1. **AUDIT-SUMMARY.md** - "Executive summary with compliance score"
  2. **VPAT-COMPREHENSIVE.md** - "Complete VPAT 2.5 with all 50 WCAG criteria"
  3. **ACCESSIBILITY-RECOMMENDATIONS.md** - "Specific fixes with code examples"
  4. **accessibility-analysis.json** - "Raw data for CI/CD integration"

**Script:**
> "The VPAT report is ready to share with legal teams and customers. The recommendations provide specific fixes our developers can implement immediately."

### Section 5: Key Features (1.5 minutes)

**Script:**
> "Version 3.1.0 adds powerful automation capabilities..."

**Visual:**
- Show feature list from README:
  - ✅ Automated screenshot capture
  - ✅ Visual contrast analysis
  - ✅ Color-blind testing (8 types)
  - ✅ Compliance tracking over time
  - ✅ Unity Editor integration
  - ✅ Automated code generation
  - ✅ CI/CD workflows (GitHub Actions, GitLab, Jenkins, Azure)

**Script:**
> "The framework captures screenshots of all Unity scenes, analyzes visual accessibility including contrast and color-blindness, tracks compliance over time, and even generates code fixes automatically."

### Section 6: Closing (30 seconds)

**Script:**
> "accessibility-standards-unity transforms accessibility from a months-long manual process into an automated workflow. It's free, open-source, and ready to integrate into your Unity pipeline today. Check out the GitHub repository for more information. Thanks for watching!"

**Visual:**
- Show GitHub repository URL
- Show version badge (v3.1.0)
- Show MIT license badge

---

## Technical Demo Script (15-20 minutes)

### Section 1: Introduction & Setup (2 minutes)

**Script:**
> "Welcome to a technical deep dive into accessibility-standards-unity version 3.1.0. I'll demonstrate the full audit workflow, code generation, and CI/CD integration."

**Visual:**
- Show repository structure
- Highlight key directories:
  - `bin/` - CLI tools
  - `templates/` - Report templates
  - `implementation/unity/` - Unity components
  - `.github/workflows/` - CI/CD workflows

### Section 2: Basic Audit (3 minutes)

**Commands:**
```bash
# Clone sample project
git clone https://github.com/example/unity-project.git
cd unity-project

# Run basic audit
node ../accessibility-standards-unity/bin/audit.js . --verbose
```

**Visual:**
- Show audit execution
- Open generated reports
- Explain compliance score calculation
- Review specific findings with file:line references

### Section 3: Screenshot Capture & Visual Analysis (4 minutes)

**Commands:**
```bash
# Run audit with screenshot capture
node ../accessibility-standards-unity/bin/audit.js . \
  --capture-screenshots \
  --analyze-visual \
  --verbose
```

**Visual:**
- Show Unity batch mode execution
- Display captured screenshots in `AccessibilityAudit/screenshots/`
- Show contrast analysis heatmaps
- Demonstrate color-blind simulations (8 types)
- Review contrast report with passing/failing components

**Script:**
> "The framework uses Unity's batch mode to capture screenshots of every scene automatically. It then analyzes contrast ratios using WCAG standards and simulates 8 types of color blindness to detect information loss."

### Section 4: Code Generation (4 minutes)

**Commands:**
```bash
# Generate automated fixes
node ../accessibility-standards-unity/bin/audit.js . --generate-fixes
```

**Visual:**
- Open `AccessibilityAudit/generated-fixes/` directory
- Show generated C# files:
  - `KeyboardNavigationManager.cs`
  - `FocusIndicator.cs`
  - `AccessibleButton.cs`
- Open `GENERATED-FIXES.md` report
- Highlight specific code examples and installation instructions

**Script:**
> "Based on the audit findings, the framework generates production-ready C# code to fix detected issues. Each file includes implementation instructions and testing procedures."

### Section 5: Compliance Tracking (3 minutes)

**Commands:**
```bash
# Create baseline
node ../accessibility-standards-unity/bin/audit.js . --baseline

# Make code changes (simulate fix)
# ...

# Run audit with regression check
node ../accessibility-standards-unity/bin/audit.js . \
  --track-compliance \
  --fail-on-regression
```

**Visual:**
- Show `compliance-history/baseline.json`
- Make a code change that introduces an issue
- Run audit again - show failure with exit code 1
- Display diff report showing new issue

**Script:**
> "Compliance tracking maintains a baseline and detects regressions automatically. In CI/CD, this fails the build if new critical issues are introduced, preventing accessibility degradation."

### Section 6: PDF & CSV Exports (2 minutes)

**Commands:**
```bash
# Export to PDF and CSV
node ../accessibility-standards-unity/bin/audit.js . \
  --export-pdf \
  --export-csv
```

**Visual:**
- Show generated PDF in `AccessibilityAudit/exports/VPAT-Report.pdf`
- Show CSV export in `AccessibilityAudit/exports/findings-export.csv`
- Import CSV into Excel/Google Sheets
- Demonstrate filtering and sorting

### Section 7: CI/CD Integration (3 minutes)

**Visual:**
- Open `.github/workflows/accessibility-audit.yml`
- Walk through workflow sections:
  - Setup (Node.js, Unity)
  - Audit execution
  - Artifact uploads
  - PR comments
  - Failure conditions

**Script:**
> "The framework includes pre-configured GitHub Actions workflows. When you create a pull request, the workflow runs automatically, captures screenshots, analyzes the project, and posts compliance results as a PR comment. If critical issues are found, the build fails."

**Demo:**
- Show GitHub Actions tab with recent workflow runs
- Open a PR with audit comment showing compliance score
- Highlight artifact downloads (reports, screenshots)

### Section 8: Closing & Resources (1 minute)

**Script:**
> "accessibility-standards-unity v3.1.0 provides everything you need: automated audits, visual analysis, code generation, and complete CI/CD integration. Visit the GitHub repository for documentation, examples, and support. Thanks for watching!"

**Visual:**
- Show key resources:
  - GitHub: https://github.com/jdonnelly-zspace/accessibility-standards-unity
  - Docs: `/docs` directory
  - CI/CD Guide: `docs/CI-CD-INTEGRATION.md`

---

## Unity Editor Demo Script (10-15 minutes)

### Section 1: Introduction (1 minute)

**Script:**
> "This demo showcases the Unity Editor integration in accessibility-standards-unity v3.1.0. I'll show the custom Accessibility Auditor window, scene view overlays, inspector extensions, and quick-fix tools."

### Section 2: Installing Framework in Unity (2 minutes)

**Visual:**
- Open Unity project
- Show Unity Package Manager
- Add package from git URL:
  ```
  https://github.com/jdonnelly-zspace/accessibility-standards-unity.git
  ```
- Wait for import to complete

**Script:**
> "Installation is simple - add the framework via Unity Package Manager using the Git URL. This imports all C# components, editor tools, and prefabs."

### Section 3: Accessibility Auditor Window (3 minutes)

**Visual:**
- Open Window → Accessibility → Auditor
- Show Auditor window sections:
  - Project overview
  - Quick actions
  - Recent audits
  - Settings

**Demo:**
- Click "Run Audit" button
- Show live progress bar
- View results in window
- Click on finding to navigate to GameObject in scene

**Script:**
> "The Accessibility Auditor window provides one-click auditing from within Unity. Results are displayed immediately, and you can click findings to jump directly to the affected GameObjects."

### Section 4: Scene View Overlays (3 minutes)

**Visual:**
- Enable scene view overlay (toggle button)
- Show visual indicators:
  - Red outline around GameObject with critical issue
  - Yellow outline around GameObject with warning
  - Green checkmark on compliant GameObject

**Demo:**
- Hover over red outlined object → show tooltip with issue details
- Click object → Inspector shows details
- Toggle overlay off/on

**Script:**
> "Scene view overlays provide real-time visual feedback. Red outlines indicate critical issues like missing keyboard support, yellow shows warnings like low contrast, and green confirms compliant elements."

### Section 5: Inspector Extensions (3 minutes)

**Visual:**
- Select Button GameObject
- Show Inspector with accessibility warning:
  - "Missing accessible label"
  - "Fix" button

**Demo:**
- Click "Fix" button
- AccessibilityNode component added automatically
- Warning disappears
- Test Undo (Ctrl+Z) - component removed
- Redo (Ctrl+Y) - component restored

**Script:**
> "Inspector extensions provide contextual warnings and one-click fixes. The framework validates Button, InputField, Image, and Canvas components, and adds missing accessibility components automatically with full Undo support."

### Section 6: Quick Fixes & Menu Items (2 minutes)

**Visual:**
- Right-click GameObject
- Show context menu: GameObject → Accessibility submenu
- Options:
  - Add Accessibility Node
  - Validate Scene
  - Fix Common Issues

**Demo:**
- Select "Fix Common Issues"
- Multiple GameObjects fixed simultaneously
- Show before/after in Hierarchy

**Script:**
> "Quick fix tools batch-process accessibility improvements. 'Fix Common Issues' adds AccessibilityNodes, configures EventSystem keyboard navigation, and fixes tab order across the entire scene."

### Section 7: Testing Fixes (2 minutes)

**Visual:**
- Enter Play mode
- Test keyboard navigation (Tab key)
- Show focus indicators moving between UI elements
- Test with screen reader (NVDA)

**Script:**
> "Let's verify our fixes work. In Play mode, Tab key navigates between UI elements with visible focus indicators. The Unity Accessibility Module exposes elements to screen readers like NVDA."

### Section 8: Closing (1 minute)

**Script:**
> "Unity Editor integration streamlines accessibility development with real-time feedback, visual overlays, and one-click fixes. These tools are included in v3.1.0 and work with Unity 2021.3+. Check the GitHub repository for documentation and examples. Thanks!"

---

## Recording Best Practices

### Audio

- **Script your narration** - Write and rehearse key talking points
- **Use a pop filter** - Reduces plosive sounds (p, b, t)
- **Record in a quiet room** - Minimize background noise
- **Speak clearly and slowly** - Enunciate, pause between sections
- **Leave pauses** - Easy to edit out silence, hard to add it back

### Visual

- **Increase font sizes**:
  - Terminal: 14-16pt
  - Code editor: 16-18pt
  - Unity: Use zoom (Unity Editor → Preferences → UI Scaling)
- **Use high contrast themes** - Easier to see on compressed video
- **Highlight important areas**:
  - Mouse pointer highlighting (OBS Studio plugin)
  - Arrow annotations (video editor)
  - Zoom in on small text
- **Smooth mouse movements** - Slow, deliberate cursor motion
- **Pause on key visuals** - Hold for 2-3 seconds to let viewers read

### Editing

- **Cut mistakes** - Don't include stumbles or errors
- **Add captions** - Essential for accessibility (use auto-captions + manual review)
- **Add chapter markers** - YouTube timestamps for easy navigation
- **Add intro/outro**:
  - Intro: Framework name, version, your name (5-10 seconds)
  - Outro: GitHub URL, documentation link, call-to-action (5-10 seconds)
- **Background music** (optional):
  - Use royalty-free music (YouTube Audio Library, Epidemic Sound)
  - Keep volume low (-20dB to -30dB) so it doesn't compete with voice
  - Only use in intro/outro, not during narration

### Export Settings

- **Resolution:** 1920x1080 (1080p) or 2560x1440 (1440p)
- **Frame rate:** 30 FPS or 60 FPS
- **Bitrate:** 8-15 Mbps (1080p), 16-25 Mbps (1440p)
- **Format:** MP4 (H.264 video, AAC audio)
- **File size target:** < 2 GB for uploads (YouTube, Vimeo)

---

## Publishing Checklist

### Video Metadata

- [ ] **Title:** "accessibility-standards-unity v3.1.0 Demo - [Quick/Technical/Unity Editor]"
- [ ] **Description:**
  ```
  Demo of accessibility-standards-unity v3.1.0, a comprehensive framework
  for building accessible Unity applications (WCAG 2.2 + W3C XAUR).

  Features shown:
  - Automated accessibility auditing
  - Screenshot capture and visual analysis
  - Compliance tracking and regression detection
  - Unity Editor integration
  - Automated code generation
  - CI/CD workflows (GitHub Actions, GitLab, Jenkins, Azure)

  GitHub: https://github.com/jdonnelly-zspace/accessibility-standards-unity
  Docs: https://github.com/jdonnelly-zspace/accessibility-standards-unity/tree/main/docs
  License: MIT

  Timestamps:
  0:00 - Introduction
  0:30 - Running an audit
  2:30 - Generated reports
  4:00 - Visual analysis
  7:00 - Code generation
  10:00 - CI/CD integration
  ```

- [ ] **Tags:** accessibility, unity, unity3d, wcag, a11y, zspace, game-development, unit y-editor, ci-cd, automation

- [ ] **Thumbnail:** High-contrast image with:
  - Framework name and version (v3.1.0)
  - Key visual (audit output, Unity Editor, or compliance score)
  - Clear text (18-24pt bold font)

### Accessibility

- [ ] Add closed captions (CC)
  - Use auto-captions as starting point
  - Manually review and correct errors
  - Add sound descriptions: [keyboard typing], [notification sound]
- [ ] Add transcript in video description or linked document
- [ ] Ensure audio description available (for visually impaired viewers)

### Promotion

- [ ] Share on Twitter/X with hashtags: #accessibility #unity #wcag #a11y
- [ ] Share on LinkedIn (professional audience)
- [ ] Post in Unity forums
- [ ] Post in zSpace developer community
- [ ] Add to GitHub repository README (video embed or link)
- [ ] Add to documentation (docs/VIDEO-DEMOS.md)

---

## Talking Points Reference

### Key Messages

1. **Comprehensive:** "Covers WCAG 2.2 (50 criteria) + W3C XAUR + Section 508"
2. **Automated:** "Reduces manual review from 79% to ~20% of criteria"
3. **Fast:** "Basic audit < 1 second, full audit 5-15 minutes"
4. **Actionable:** "Generates specific code fixes with implementation instructions"
5. **CI/CD Ready:** "Pre-configured workflows for GitHub, GitLab, Jenkins, Azure"
6. **Free & Open Source:** "MIT License, no cost, community-driven"
7. **Production-Ready:** "Used for real Unity projects, tested on 50+ scenes"

### Common Questions

**Q: Does it work with Unity 2021/2022/2023?**
A: Yes, supports Unity 2021.3 LTS and newer. Unity 2023.2+ recommended for Accessibility Module support.

**Q: How long does an audit take?**
A: Basic audit: < 1 second. With screenshots: 2-10 minutes (depends on scene count).

**Q: Does it require zSpace hardware?**
A: No, the framework works with any Unity project. zSpace-specific features are optional.

**Q: Can it integrate with our CI/CD pipeline?**
A: Yes, includes workflows for GitHub Actions, GitLab CI, Jenkins, and Azure DevOps.

**Q: Does it generate code automatically?**
A: Yes, v3.1.0 includes automated code generation for keyboard navigation, focus management, and Unity Accessibility API integration.

**Q: Is it free?**
A: Yes, MIT License. All tools and dependencies are free.

---

## Example Video Titles

### Quick Demos
- "accessibility-standards-unity v3.1.0 - 5 Minute Demo"
- "Automate Unity Accessibility Compliance in 5 Minutes"
- "WCAG 2.2 Compliance for Unity - Quick Demo"

### Technical Demos
- "accessibility-standards-unity v3.1.0 - Full Technical Demo"
- "Unity Accessibility Automation - Deep Dive"
- "From Audit to Code Generation - Complete Walkthrough"

### Unity Editor Demos
- "Unity Editor Accessibility Tools - v3.1.0 Demo"
- "Real-Time Accessibility Validation in Unity"
- "One-Click Accessibility Fixes in Unity Editor"

### CI/CD Demos
- "GitHub Actions for Unity Accessibility Testing"
- "Automated Accessibility Compliance in CI/CD"
- "Unity + GitHub Actions - Accessibility Regression Testing"

---

## Resources

### Screen Recording Software

- **OBS Studio** (Free, Windows/macOS/Linux): https://obsproject.com/
- **Camtasia** (Paid, Windows/macOS): https://www.techsmith.com/video-editor.html
- **ScreenFlow** (Paid, macOS): https://www.telestream.net/screenflow/
- **QuickTime Player** (Free, macOS built-in): Record screen only
- **SimpleScreenRecorder** (Free, Linux): https://www.maartenbaert.be/simplescreenrecorder/

### Video Editing

- **DaVinci Resolve** (Free): https://www.blackmagicdesign.com/products/davinciresolve
- **Adobe Premiere Pro** (Paid): https://www.adobe.com/products/premiere.html
- **Final Cut Pro** (Paid, macOS): https://www.apple.com/final-cut-pro/
- **Kdenlive** (Free, Linux): https://kdenlive.org/

### Royalty-Free Music

- **YouTube Audio Library** (Free): https://www.youtube.com/audiolibrary
- **Epidemic Sound** (Paid): https://www.epidemicsound.com/
- **Incompetech** (Free, CC BY): https://incompetech.com/music/

### Thumbnail Creation

- **Canva** (Free/Paid): https://www.canva.com/
- **Adobe Photoshop** (Paid): https://www.adobe.com/products/photoshop.html
- **GIMP** (Free): https://www.gimp.org/

---

**Last Updated:** October 2025
**Framework Version:** 3.1.0
**Estimated Recording Time:** Quick (1 hour), Technical (2-3 hours), Unity Editor (1.5-2 hours)
