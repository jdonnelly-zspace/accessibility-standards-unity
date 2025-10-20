# Accessibility Audit Quick Reference Card

**Print this page and keep it handy during your accessibility implementation!**

---

## 🚀 Quick Start

```bash
# Install auditor
npm install -g accessibility-standards-unity

# Run audit
cd /path/to/your-unity-project
a11y-audit-zspace .

# Review results
open AccessibilityAudit/AUDIT-SUMMARY.md
```

---

## 📋 Implementation Checklist

### Week 1: Assessment
- [ ] Run initial audit
- [ ] Review AUDIT-SUMMARY.md with team
- [ ] Read ACCESSIBILITY-RECOMMENDATIONS.md
- [ ] Plan 8-week implementation timeline
- [ ] Get stakeholder buy-in

### Week 2-3: Critical Fixes (WCAG Level A)
- [ ] Copy framework components to project
- [ ] Add keyboard alternatives for all stylus interactions
- [ ] Implement depth perception cues (DepthCueManager)
- [ ] Add screen reader support (AccessibleStylusButton)
- [ ] Fix color contrast issues (4.5:1 minimum)
- [ ] Re-audit (target: 60-70% compliance)

### Week 4-6: High Priority (WCAG Level AA)
- [ ] Add focus indicators (ZSpaceFocusIndicator)
- [ ] Implement captions for audio (SubtitleSystem)
- [ ] Add voice commands (VoiceCommandManager)
- [ ] Test with real accessibility tools (NVDA, keyboard-only)
- [ ] Re-audit (target: 85-90% compliance)

### Week 7-8: Polish & Testing
- [ ] Manual keyboard-only testing
- [ ] Manual screen reader testing (NVDA)
- [ ] Manual 2D mode testing (no 3D glasses)
- [ ] User testing with people with disabilities
- [ ] Final audit (target: 95%+ compliance)
- [ ] Generate and share VPAT with legal/compliance

---

## 🛠️ Framework Components to Copy

```bash
# From accessibility-standards-unity repository:
cp -r implementation/unity/scripts/* YourProject/Assets/Scripts/Accessibility/
cp -r implementation/unity/editor/* YourProject/Assets/Editor/Accessibility/
cp -r implementation/unity/tests/* YourProject/Assets/Tests/Accessibility/
```

**Essential Components:**
- `KeyboardStylusAlternative.cs` - Keyboard fallback for stylus
- `DepthCueManager.cs` - Depth perception alternatives
- `AccessibleStylusButton.cs` - Screen reader support for buttons
- `ZSpaceFocusIndicator.cs` - Visible focus indicators
- `SubtitleSystem.cs` - Captions for audio
- `VoiceCommandManager.cs` - Voice navigation
- `SpatialAudioManager.cs` - 3D audio cues

---

## 🎯 Critical Issues (Fix First!)

### 1. Keyboard Alternatives
**Problem:** Stylus-only interactions
**Fix:** Add keyboard mappings
```csharp
// Add to Update() in stylus scripts:
if (Input.GetKeyDown(KeyCode.Space)) {
    SelectObject();  // Same function as stylus button
}
```

### 2. Depth Perception
**Problem:** Requires 3D vision
**Fix:** Add DepthCueManager component to scene
- Enable size scaling (objects closer = larger)
- Enable dynamic shadows
- Enable spatial audio
- Enable haptic feedback

### 3. Screen Reader
**Problem:** UI buttons not announced
**Fix:** Add accessibility labels
```csharp
#if UNITY_2023_2_OR_NEWER
var node = GetComponent<AccessibilityNode>();
node.label = "Start Exploration";
node.role = AccessibilityRole.Button;
#endif
```

### 4. Color Contrast
**Problem:** Text hard to read (< 4.5:1 ratio)
**Fix:** Use ContrastCheckerZSpace.cs tool
- Dark text on light background = 12.6:1 ✓
- Light text on dark background = 21:1 ✓
- Minimum acceptable: 4.5:1

---

## 🧪 Testing Procedures

### Keyboard-Only Test (30 min)
1. Disconnect mouse and stylus
2. Tab through all menus
3. Complete entire app workflow with keyboard
4. Verify all features accessible

### Screen Reader Test (30 min)
1. Download NVDA (free from nvaccess.org)
2. Launch NVDA before starting app
3. Tab through interface
4. Verify all buttons/elements announced
5. Check error messages are readable

### 2D Mode Test (30 min)
1. Remove 3D glasses (use 2D mode)
2. Complete app tasks without stereoscopic vision
3. Verify depth cues work (size, shadows, audio)
4. Check all spatial relationships understandable

---

## 📊 Compliance Score Guide

| Score | Status | Meaning |
|-------|--------|---------|
| **90-100%** | Fully Compliant | Production-ready, ship it! |
| **70-89%** | Substantially Conformant | Minor fixes needed |
| **50-69%** | Partially Conformant | Major work needed |
| **0-49%** | Non-Conformant | Critical failures |

---

## 🎯 Success Criteria

### WCAG Level A (Minimum - Must Have)
- [ ] Keyboard alternatives for all stylus interactions
- [ ] Screen reader support for all UI
- [ ] Color contrast ≥ 4.5:1 for all text
- [ ] No content relies solely on stereoscopic 3D

### WCAG Level AA (Standard - Should Have)
- [ ] Visible focus indicators on all interactive elements
- [ ] Captions for all audio content
- [ ] Multiple input methods (stylus, keyboard, voice)
- [ ] Error messages are accessible

### W3C XAUR (zSpace-Specific)
- [ ] Depth perception alternatives (size, shadows, audio)
- [ ] Works in 2D mode (no 3D glasses)
- [ ] Stylus has keyboard/mouse fallbacks
- [ ] Spatial audio for navigation cues

---

## ⚡ Common Commands

```bash
# Run audit
a11y-audit-zspace /path/to/project

# Run audit with verbose output
a11y-audit-zspace /path/to/project --verbose

# Custom output directory
a11y-audit-zspace /path/to/project --output-dir /custom/path

# Show help
a11y-audit-zspace --help

# Re-audit after fixes
cd /path/to/project
a11y-audit-zspace .
```

---

## 📞 Getting Help

**Documentation:**
- Partner onboarding: `docs/PARTNER-ONBOARDING.md`
- Detailed guide: `docs/AUDITING-GUIDE.md`
- Claude prompts: `docs/CLAUDE-PROMPTS.md`

**Example Workflow:**
- This directory: `examples/audit-workflow/README.md`
- Initial audit: `examples/audit-workflow/sample-audit-initial/`
- Final audit: `examples/audit-workflow/sample-audit-final/`

**External Resources:**
- WCAG 2.2: https://www.w3.org/WAI/WCAG22/quickref/
- W3C XAUR: https://www.w3.org/TR/xaur/
- NVDA screen reader: https://www.nvaccess.org/
- GitHub issues: https://github.com/jdonnelly-zspace/accessibility-standards-unity/issues

---

## 💡 Pro Tips

1. **Start early** - Accessibility is 10-100x cheaper when built from the start
2. **Copy framework components** - Don't rebuild, reuse tested code
3. **Test manually** - Automated tools are 80-90% accurate, not 100%
4. **Test on real hardware** - zSpace simulator insufficient for accessibility
5. **Incremental progress** - Fix critical issues first, then high priority
6. **Re-audit often** - Catch regressions early (before each release)
7. **Document everything** - Future developers will thank you

---

## ⏱️ Time Estimates

| Task | Time |
|------|------|
| Initial audit + review | 1-2 hours |
| Copy framework components | 5 minutes |
| Add keyboard alternatives | 30 min per script |
| Add depth cues | 1 hour per scene |
| Add screen reader labels | 15 min per button |
| Fix color contrast | 2-4 hours |
| Manual testing | 2-3 hours |
| **Total (typical app)** | **40-60 hours** |

---

## 🎉 Success Metrics

**Before Implementation:**
- Compliance: 30-50%
- Critical issues: 3-5
- Users excluded: 20-30%
- Legal risk: HIGH

**After Implementation:**
- Compliance: 90-100%
- Critical issues: 0
- Users excluded: < 5%
- Legal risk: LOW

**ROI: 500-1000%** (expanded market + reduced legal risk)

---

**Keep this card handy throughout your 8-week accessibility journey!**

**Framework Version:** 2.2.0
**Last Updated:** 2025-10-20
