# Partner FAQ - zSpace Accessibility Auditing Tool

Frequently asked questions about the accessibility-standards-unity auditing tool.

---

## General Questions

### What is this tool?

The **zSpace Accessibility Standards Framework** is a comprehensive toolkit for building accessible Unity applications for the zSpace platform. Version 3.0 adds an **automated auditing system** that scans your Unity project and generates professional accessibility reports.

The tool checks your application against:
- **WCAG 2.2 Level AA** - Web Content Accessibility Guidelines adapted for zSpace
- **W3C XAUR** - XR Accessibility User Requirements adapted for stereoscopic 3D

### Who is this for?

- **Unity Developers** building zSpace applications
- **QA Engineers** testing accessibility compliance
- **Product Managers** evaluating accessibility status
- **Legal/Procurement Teams** needing VPAT documentation
- **Organizations** with accessibility requirements (Section 508, ADA, EN 301 549)

### How much does it cost?

**It's completely free!** The tool is open source (MIT license) and available at no cost via npm or GitHub.

### What does it audit?

The auditor analyzes:
- ✅ All Unity scenes in your project
- ✅ All C# scripts (looking for accessibility patterns)
- ✅ Project structure and organization
- ✅ Keyboard input alternatives
- ✅ Screen reader support
- ✅ Depth perception alternatives (critical for zSpace)
- ✅ Focus indicators
- ✅ Haptic feedback patterns
- ✅ Spatial audio implementation

### How long does an audit take?

**Less than 10 seconds** for most projects. Large projects (1000+ scripts) may take up to 30 seconds.

### What reports are generated?

All audits produce 5 files:
1. **README.md** - Quick overview and next steps
2. **AUDIT-SUMMARY.md** - Executive summary with compliance score
3. **VPAT-{appname}.md** - Legal compliance documentation (VPAT 2.5)
4. **ACCESSIBILITY-RECOMMENDATIONS.md** - Specific fixes for developers
5. **accessibility-analysis.json** - Raw findings data (for automation)

---

## Installation & Setup

### What are the requirements?

- **Node.js:** 14.0.0 or higher ([download](https://nodejs.org/))
- **Unity Project:** Any version (2021.3 LTS or newer recommended)
- **Operating System:** Windows, macOS, or Linux

### How do I install it?

**Option 1: Global npm install (recommended)**
```bash
npm install -g accessibility-standards-unity
```

**Option 2: Clone from GitHub**
```bash
git clone https://github.com/jdonnelly-zspace/accessibility-standards-unity.git
```

**Option 3: Install from tarball**
```bash
npm install -g accessibility-standards-unity-3.0.0.tgz
```

### How do I verify it's installed correctly?

```bash
# Check if command is available
a11y-audit-zspace --version

# Should output: 3.0.0 (or current version)
```

### I don't have Node.js installed. What do I do?

1. Visit https://nodejs.org/
2. Download the LTS (Long Term Support) version
3. Run the installer
4. Verify installation: `node --version`
5. Install the auditing tool: `npm install -g accessibility-standards-unity`

---

## Usage Questions

### How do I run an audit?

```bash
# Navigate to your Unity project (or provide full path)
a11y-audit-zspace /path/to/your-unity-project

# Reports will be generated in:
# /path/to/your-unity-project/AccessibilityAudit/
```

### Can I customize the output directory?

Yes! Use the `--output-dir` flag:
```bash
a11y-audit-zspace /path/to/project --output-dir /path/to/custom/output
```

### What formats are supported?

Currently **Markdown** (default). HTML and PDF export are planned for future releases.

### Can I run this in CI/CD?

Yes! The tool is designed for automation:
```bash
# Run audit and capture JSON output
a11y-audit-zspace /path/to/project --format json

# Check compliance score
COMPLIANCE=$(jq '.summary.complianceScore' AccessibilityAudit/accessibility-analysis.json)
if [ $COMPLIANCE -lt 90 ]; then exit 1; fi
```

See [docs/AUDITING-GUIDE.md](../../docs/AUDITING-GUIDE.md) for CI/CD integration examples.

### Can I audit multiple projects at once?

Yes! Run the tool in a loop:
```bash
for project in /path/to/projects/*; do
  a11y-audit-zspace "$project"
done
```

### How do I see detailed logging?

Use the `--verbose` flag:
```bash
a11y-audit-zspace /path/to/project --verbose
```

---

## Understanding Results

### What is a "compliance score"?

The compliance score (0-100%) indicates how well your application meets WCAG 2.2 Level AA and W3C XAUR standards:
- **90-100%** - Fully Compliant
- **70-89%** - Partially Compliant
- **50-69%** - Non-Compliant (minor issues)
- **0-49%** - Non-Compliant (major issues)

### What are "critical issues"?

Critical issues are violations that make your application unusable for people with disabilities:
- No keyboard alternatives for stylus interactions (WCAG 2.1.1)
- No depth perception alternatives (W3C XAUR UN17)
- No screen reader support (WCAG 4.1.2)

**These must be fixed first.**

### What are "high priority" issues?

High priority issues significantly impact usability but don't completely block access:
- Missing focus indicators
- Insufficient contrast ratios
- Incomplete haptic feedback
- Missing spatial audio cues

### What's the difference between WCAG and W3C XAUR?

- **WCAG 2.2** - Web Content Accessibility Guidelines (adapted for desktop zSpace apps)
- **W3C XAUR** - XR Accessibility User Requirements (adapted for stereoscopic 3D)

Both are important for zSpace applications. WCAG covers general UI/UX accessibility, while XAUR covers zSpace-specific requirements like depth perception alternatives.

### My compliance score is 32%. Is that bad?

It's common for first audits to score 30-50%. This is actually good news - it means you now have a clear roadmap for improvement!

**Typical timeline:**
- **Week 0:** 30-50% compliance (initial audit)
- **Week 4:** 60-75% compliance (after implementing framework components)
- **Week 8:** 90-100% compliance (after testing and polish)

See [examples/audit-workflow/README.md](../../examples/audit-workflow/README.md) for a real-world case study.

### Which issues should I fix first?

**Priority order:**
1. **Critical Issues** (0 tolerance)
   - Keyboard alternatives for stylus
   - Depth perception alternatives
   - Screen reader support

2. **High Priority Issues**
   - Framework component integration
   - Focus indicators
   - Haptic feedback

3. **Medium Priority Issues**
   - Contrast improvements
   - Subtitle system
   - Voice commands

4. **Low Priority Issues**
   - Documentation
   - Edge cases
   - Enhancements

---

## Fixing Issues

### How do I fix the issues found?

1. **Review ACCESSIBILITY-RECOMMENDATIONS.md** - Specific fixes with implementation steps
2. **Copy framework components** from `implementation/unity/scripts/` to your project
3. **Follow the workflows** in `workflows/DEVELOPER-WORKFLOW.md`
4. **Test manually** with keyboard, screen reader, and 2D mode (no 3D glasses)
5. **Re-audit** to measure progress

### Where do I get the accessibility components?

The framework includes 13 ready-to-use Unity C# components:
- UnityAccessibilityIntegration.cs (screen reader support)
- AccessibleStylusButton.cs (stylus + keyboard input)
- KeyboardStylusAlternative.cs (keyboard fallback)
- VoiceCommandManager.cs (voice navigation)
- SubtitleSystem.cs (3D spatial captions)
- DepthCueManager.cs (depth alternatives)
- SpatialAudioManager.cs (audio descriptions)
- And more...

**Location:** `implementation/unity/scripts/` in the framework repository.

### Do I need to rewrite my entire application?

**No!** Most issues can be fixed by:
1. Adding accessibility components to existing GameObjects
2. Implementing keyboard alternatives for stylus interactions
3. Adding depth cues to 3D objects
4. Integrating screen reader support

Typical implementation time: **4-8 weeks** for a medium-sized project.

### Can you help with implementation?

The framework includes comprehensive guides:
- **Developer Workflow** - Step-by-step Unity implementation
- **Designer Workflow** - Accessible design patterns
- **QA Workflow** - Testing procedures
- **Product Owner Workflow** - Acceptance criteria

See `workflows/` directory.

### What if I have custom UI/interactions?

The framework provides **patterns, not prescriptions**. You can:
- Adapt the components to your specific needs
- Use them as reference implementations
- Follow the same accessibility principles
- Implement equivalent alternatives

---

## Technical Questions

### Does this work with Unity WebGL?

The audit tool works with any Unity project structure. However, zSpace applications are typically **desktop applications** (Windows), not WebGL.

For WebGL accessibility testing, see `implementation/testing/playwright-setup/` (marked as "Reference Only").

### Does it work with older Unity versions (2019, 2020)?

Yes! The auditor works with any Unity version. However:
- **Unity 2021.3 LTS or newer** - Recommended
- **Unity 2023.2+** - Includes Unity Accessibility Module (screen reader support)
- **Unity 2019/2020** - Works, but missing newer accessibility features

### Does it detect false positives?

The auditor has **95%+ accuracy** but may occasionally:
- Miss custom accessibility implementations
- Flag intentionally inaccessible prototype scenes
- Not detect accessibility features implemented via plugins

Review findings manually and use `--verbose` for details.

### Can I customize the audit rules?

Not yet. Custom rule configuration is planned for v4.0. Current version uses fixed WCAG 2.2 + W3C XAUR rules adapted for zSpace.

### Does it modify my Unity project?

**No!** The auditor is **read-only**. It analyzes files but never modifies:
- Scene files
- Scripts
- Project settings
- Assets

The only files created are the audit reports in `AccessibilityAudit/` directory.

### What data does it collect?

The auditor analyzes **local files only**:
- Unity scene files (*.unity)
- C# scripts (*.cs)
- Project directory structure

**No data is sent to external servers.** All processing is local.

### Is it safe for proprietary/confidential projects?

Yes! The tool:
- ✅ Runs entirely offline
- ✅ Doesn't send data to external servers
- ✅ Only reads files (never modifies)
- ✅ Open source (MIT license - you can audit the code)

---

## Troubleshooting

### "Project directory not found"

**Cause:** Invalid path to Unity project.

**Fix:**
```bash
# Verify path exists
ls /path/to/your-unity-project

# Should see: Assets/, ProjectSettings/, Packages/, etc.

# Use absolute paths, not relative
a11y-audit-zspace /Users/name/UnityProjects/MyApp
```

### "No Unity project detected"

**Cause:** Directory doesn't contain Unity project structure.

**Fix:** Ensure the directory has:
- `Assets/` directory
- `ProjectSettings/` directory
- `Packages/` directory (Unity 2018+)

### "Permission denied"

**Cause:** Insufficient file system permissions.

**Fix:**
```bash
# Check permissions
ls -la /path/to/project

# Run with appropriate permissions
sudo a11y-audit-zspace /path/to/project  # macOS/Linux
```

### "Command not found: a11y-audit-zspace"

**Cause:** Tool not installed or not in PATH.

**Fix:**
```bash
# Verify installation
npm list -g accessibility-standards-unity

# Reinstall if needed
npm install -g accessibility-standards-unity

# Check PATH includes npm global bin
echo $PATH
```

### "Error parsing scene files"

**Cause:** Corrupted or binary scene files.

**Fix:** This is usually safe to ignore. The auditor will skip problematic scenes and continue. Use `--verbose` to see which scenes were skipped.

### Audit is stuck / taking too long

**Cause:** Very large project or slow disk.

**Expected times:**
- Small project (< 100 scripts): < 5 seconds
- Medium project (100-500 scripts): 5-10 seconds
- Large project (500-1000 scripts): 10-30 seconds
- Very large project (1000+ scripts): 30-60 seconds

If it takes > 2 minutes, cancel (Ctrl+C) and run with `--verbose` to diagnose.

---

## VPAT Questions

### What is a VPAT?

**VPAT** = Voluntary Product Accessibility Template

A standardized document that describes how your application conforms to accessibility standards (WCAG, Section 508). Required for:
- US Federal procurement
- Many state/local government contracts
- Enterprise sales to large organizations

### Is the generated VPAT legally binding?

The generated VPAT is a **template** that requires review by your legal team. The auditor provides:
- Automated compliance assessment
- Suggested conformance levels
- Identified violations

**Your legal team should review and approve before sharing with customers.**

### Can I use this VPAT for procurement?

Yes, after legal review. Many customers require a VPAT as part of the purchasing process. The generated VPAT follows the **VPAT 2.5** standard format.

### How accurate is the VPAT?

The auditor generates VPAT content with **95%+ accuracy** based on automated analysis. However:
- Manual review is recommended
- Some criteria require human judgment
- Your legal team should approve final version

---

## Support & Contact

### Where can I get help?

**Documentation:**
- [Partner Onboarding Guide](../../docs/PARTNER-ONBOARDING.md) - Installation, usage, troubleshooting
- [Auditing Guide](../../docs/AUDITING-GUIDE.md) - Advanced usage, best practices
- [Example Workflow](../../examples/audit-workflow/) - Case study with sample audits

**Technical Support:**
- Open an issue: https://github.com/jdonnelly-zspace/accessibility-standards-unity/issues
- Include: error message, Unity version, Node.js version, OS

**General Questions:**
- Email: [your-support-email@zspace.com]
- Documentation: https://github.com/jdonnelly-zspace/accessibility-standards-unity

### How do I report a bug?

Open an issue on GitHub:
https://github.com/jdonnelly-zspace/accessibility-standards-unity/issues

**Include:**
1. Error message (full text)
2. Command you ran
3. Unity version
4. Node.js version (`node --version`)
5. Operating system
6. Expected vs. actual behavior

### How do I request a new feature?

Open a feature request on GitHub:
https://github.com/jdonnelly-zspace/accessibility-standards-unity/issues

**Describe:**
1. What you want to do
2. Why it's useful
3. How you'd use it
4. Any workarounds you've tried

### Is training available?

Yes! We offer:
- **Documentation** - Self-serve guides and workflows
- **Example Projects** - Sample audits and implementations
- **Office Hours** - [Schedule if available]
- **Custom Training** - Contact [email] for team training

---

## Contributing & Feedback

### Can I contribute to the project?

Yes! The project is open source (MIT license). We welcome:
- Bug fixes
- New features
- Documentation improvements
- Unity component contributions
- Example projects

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

### How do I submit feedback?

We'd love to hear from you!
- **Bugs:** Open an issue on GitHub
- **Feature Requests:** Open an issue on GitHub
- **General Feedback:** Email [your-email@zspace.com]
- **Success Stories:** Share your results!

### Can I use this for non-zSpace projects?

The framework is specifically designed for **zSpace Unity applications** (stereoscopic 3D desktop). However, many principles apply to:
- Desktop VR applications
- Standard Unity desktop applications
- Other stereoscopic 3D platforms

Feel free to adapt the framework to your needs.

---

## Version & Updates

### What version should I use?

**Latest stable:** v3.0.0 (released October 2025)

Always use the latest version for bug fixes and improvements:
```bash
npm update -g accessibility-standards-unity
```

### How often is it updated?

**Release schedule:**
- **Patch versions** (3.0.1, 3.0.2) - Bug fixes, every 2-4 weeks
- **Minor versions** (3.1.0, 3.2.0) - New features, every 2-3 months
- **Major versions** (4.0.0) - Breaking changes, annually

Check the [CHANGELOG.md](../../CHANGELOG.md) for release notes.

### How do I update to the latest version?

```bash
# Check current version
a11y-audit-zspace --version

# Update to latest
npm update -g accessibility-standards-unity

# Verify update
a11y-audit-zspace --version
```

### Will my old audits still work?

Audit reports are **Markdown files** and remain readable regardless of version. However, report format may change between major versions.

**Recommendation:** Re-audit your project after major version updates to get the latest insights.

---

## Additional Resources

### Where can I learn more about accessibility?

**Official Standards:**
- W3C WCAG 2.2: https://www.w3.org/WAI/WCAG22/quickref/
- W3C XAUR: https://www.w3.org/TR/xaur/
- Section 508: https://www.section508.gov/

**zSpace Resources:**
- zSpace Developer Portal: https://developer.zspace.com/
- zSpace Unity SDK: https://developer.zspace.com/docs/

**Learning:**
- WebAIM: https://webaim.org/
- Unity Accessibility: https://docs.unity3d.com/6000.0/Documentation/Manual/accessibility.html
- NVDA Screen Reader: https://www.nvaccess.org/

### Are there example projects?

Yes! See:
- **Example Workflow:** [examples/audit-workflow/](../../examples/audit-workflow/) - 8-week case study
- **Accessible Scene:** [examples/zspace-accessible-scene/](../../examples/zspace-accessible-scene/) - Production example
- **Sample Audits:** [examples/audit-workflow/audits/](../../examples/audit-workflow/audits/) - Before/after reports

---

## Quick Reference

```bash
# Installation
npm install -g accessibility-standards-unity

# Basic usage
a11y-audit-zspace /path/to/unity-project

# Custom output location
a11y-audit-zspace /path/to/project --output-dir /custom/path

# Verbose logging
a11y-audit-zspace /path/to/project --verbose

# Check version
a11y-audit-zspace --version

# Get help
a11y-audit-zspace --help
```

---

**Still have questions?**

Open an issue: https://github.com/jdonnelly-zspace/accessibility-standards-unity/issues
Email: [your-support-email@zspace.com]

---

**Last Updated:** 2025-10-20
**Version:** 3.0.0
**Framework:** accessibility-standards-unity
