# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.2.0] - 2025-10-19

### 🧹 Repository Cleanup & Simplification

**Purpose:** Streamline the framework by removing obsolete planning files, web-focused content, and redundant documentation to focus exclusively on zSpace Unity development.

### Removed

#### Obsolete Planning Files
- **PLAN.txt** - VR → zSpace migration plan (archived in git history)
- **updateplan.txt** - Unity Accessibility Module integration plan (all tasks were NOT STARTED)
- **VR-COMPONENTS-AUDIT.md** - Migration artifact no longer needed
- **unitydocs_accessibilitylinks.txt** - Links now integrated into docs
- **docs/archive/** - Obsolete implementation progress files

#### Web-Only Content
- **examples/my-web-app/** - React/web example not relevant to zSpace Unity
- **implementation/development/** - Web components (React, not Unity)
- **implementation/content/** - CMS scripts not relevant to Unity
- **implementation/testing/playwright-setup/** - Web testing only
- **scripts/check-links.sh**, **scripts/validate-css.sh**, **scripts/validate-html.sh** - Web-focused validation scripts

#### Redundant Standards Documentation
- **WCAG-2.1-vs-2.2-DIFFERENCES.md** - Key points now in WCAG-2.2-LEVEL-AA.md
- **WCAG-2.2-MIGRATION-GUIDE.md** - Merged into main WCAG documentation
- **WCAG-2.2-LEVEL-AAA-TIER1.md** - Level AAA content consolidated
- **WCAG-2.2-LEVEL-AAA-ROADMAP.md** - Level AAA content consolidated

#### Development Tools
- **scrapers/** - WCAG auto-update scraper system (manual updates acceptable)

### Changed

#### Documentation Updates
- **standards/README.md** - Updated to reflect consolidated structure focused on zSpace
- **README.md** - Removed references to deleted files and web-focused content
  - Removed Level AAA "Tier 1 Quick Wins" section
  - Removed scraper monitoring section
  - Cleaned up repository structure diagram
  - Removed references to deleted Unity packages documentation

### Impact

- **Repository size reduced by ~450KB** (30% smaller)
- **~30 fewer files** (from 223 to ~193 files)
- **Standards documentation reduced from 14,325 lines to ~8,000 lines**
- **Clearer focus** on zSpace Unity development (no web/VR legacy content)

### What Remains

Core zSpace Unity framework:
- ✅ All 13 Unity C# accessibility scripts
- ✅ All Unity prefabs, editor tools, and tests
- ✅ All 4 role-specific workflows
- ✅ Core standards (WCAG 2.2 AA, zSpace checklist, XR requirements, VPAT template)
- ✅ NVDA Developer Tools Guide, Windows Narrator Integration Guide
- ✅ zSpace example scene and case study
- ✅ Unity Accessibility Module documentation

### Notes

All removed content remains accessible in git history if needed for reference.

---

## [2.0.0] - 2025-10-16

### 🚀 Major Platform Migration: VR Headsets → zSpace

**BREAKING CHANGES:** This release represents a complete platform migration from VR/AR headsets (Meta Quest, Vive, PSVR) to the **zSpace stereoscopic 3D desktop platform**. All VR-specific components have been replaced with zSpace Unity implementations.

### Added

#### Unity Components (NEW)
- **AccessibleStylusButton.cs** - UI button with stylus + keyboard + mouse input alternatives (WCAG 2.1.1)
- **KeyboardStylusAlternative.cs** - Keyboard → stylus button mapping manager (CRITICAL for accessibility)
- **StylusHapticFeedback.cs** - Haptic feedback patterns + depth cues
- **DepthCueManager.cs** - 6 depth perception alternatives (CRITICAL - 10-15% of users need this)
  - Size scaling, shadows, audio distance, haptic depth, motion parallax, occlusion
- **AccessibleZSpaceMenu.cs** - Keyboard-navigable 3D spatial menu
- **SpatialAudioManager.cs** - Desktop speaker spatial audio + depth cues
- **SubtitleSystem.cs** - 3D spatial subtitles + 2D overlay (WCAG 1.2.2)
- **VoiceCommandManager.cs** - Windows speech recognition alternative input
- **ZSpaceFocusIndicator.cs** - 3D focus indicators (emissive glow, outline, scale)

#### Unity Editor Tools (NEW)
- **ZSpaceAccessibilityValidator.cs** - Scene validation for WCAG 2.2 Level AA + W3C XAUR
  - Target size validation (≥24x24px)
  - Depth cue verification (CRITICAL)
  - Keyboard alternative detection
  - Screen reader support checks
  - Focus indicator validation
- **ContrastCheckerZSpace.cs** - WCAG 2.2 color contrast validation
  - Manual color picker
  - Scene-wide text validation
  - AA/AAA compliance indicators

#### Unity Prefabs (NEW)
- **AccessibleZSpaceCanvas.prefab** - Screen Space Canvas with accessibility features
- **AccessibleZSpaceMenu.prefab** - 3D spatial menu with keyboard navigation
- **StylusInteractionUI.prefab** - Stylus + keyboard dual input UI

#### Unity Tests (NEW)
- **ZSpaceAccessibilityTests.cs** - Comprehensive Unity Test Framework suite
  - 15+ tests covering WCAG 2.2 Level AA + W3C XAUR
  - Keyboard accessibility tests
  - Target size tests
  - Depth perception tests (CRITICAL)
  - Screen reader tests
  - Focus indicator tests
  - Haptic feedback tests
  - Spatial audio tests

#### Documentation (NEW)
- **examples/zspace-accessible-scene/** - Complete example scene with setup instructions
  - **README.md** - Comprehensive setup, testing, and usage guide
  - **CASE-STUDY-ZSPACE.md** - Real-world medical anatomy training app case study
  - **AccessibleZSpaceScene.unity** - Example Unity scene structure
- **VR-COMPONENTS-AUDIT.md** - Complete audit of VR → zSpace migration
- **implementation/testing/README.md** - Unity Test Framework vs Playwright guidance

### Changed

#### Platform Focus
- **Target Platform:** VR/AR headsets → **zSpace (stereoscopic 3D desktop + Unity)**
- **Standards:** WCAG 2.2 Level AA + **W3C XAUR** (adapted for zSpace)
- **Primary Input:** VR controllers → **Stylus + Keyboard + Mouse**
- **Critical Requirement:** Added depth perception alternatives for 10-15% of users who cannot perceive stereoscopic 3D

#### Workflows Updated
- **DEVELOPER-WORKFLOW.md** - Replaced web/React with Unity C# + zSpace SDK patterns
- **DESIGNER-WORKFLOW.md** - Replaced web/Figma with Unity 3D design for zSpace
- **QA-WORKFLOW.md** - Replaced browser testing with Unity Test Framework + NVDA
- **PRODUCT-OWNER-WORKFLOW.md** - Added zSpace user stories, hardware requirements, budget

#### Tools & Resources
- **TOOLS-CATALOG.md** - Replaced web tools with Unity/zSpace tools
  - Added: ZSpace Unity SDK, Unity Test Framework, NVDA (primary), Windows Narrator
  - Marked web tools as "Reference Only" for WebGL apps
- **WEB-RESOURCES.md** - Renamed to acknowledge zSpace focus, added zSpace Developer Portal
  - Added: Unity Accessibility docs, Microsoft/NVDA resources
  - Kept W3C WCAG 2.2 (still applicable)

#### Target Sizes
- **WCAG 2.5.8:** Updated from 44px (VR touch targets) → **24px minimum** (desktop/stylus)
- Recommended: 36-40px for better usability

#### Screen Readers
- **Primary:** NVDA (free, Windows, zSpace platform)
- **Secondary:** Windows Narrator (built-in)
- **Professional:** JAWS (if budget allows)
- **Removed:** VoiceOver (macOS - zSpace is Windows-only)

### Removed

#### VR-Specific Content
- VR headset documentation (Meta Quest, Vive, PSVR)
- Motion sickness guidelines (not applicable to seated desktop)
- Hand tracking components
- VR locomotion patterns (teleport, smooth movement)
- Immersion-specific guidelines

**Note:** Web-based examples (`examples/my-web-app/`) kept as reference material for WebGL development.

### Deprecated

#### Web Testing (Marked as Reference Only)
- Playwright tests now marked "Reference Only" for WebGL apps
- ESLint accessibility rules (web-specific)
- Primary testing: **Unity Test Framework** for native zSpace apps

---

## Migration Guide

### For Teams Migrating from VR to zSpace

**Key Differences:**
1. **Depth Perception:** 10-15% of users CANNOT see stereoscopic 3D
   - **Action:** Implement `DepthCueManager` on all 3D objects (size, shadow, audio, haptic)
   - **Test:** Remove tracked glasses ("glasses off" test) - app must remain fully functional

2. **Input Methods:** Stylus vs VR controllers
   - **Action:** Add `KeyboardStylusAlternative` component for keyboard mappings
   - **Action:** All buttons need `AccessibleStylusButton` (stylus + keyboard + mouse)
   - **Test:** Disconnect stylus, use keyboard only - all features must work

3. **Screen Readers:** Desktop (NVDA) vs Mobile (VoiceOver/TalkBack)
   - **Action:** Test with NVDA on Windows (free download)
   - **Action:** Use `AccessibleStylusButton.buttonLabel` for announcements

4. **Testing Framework:** Unity Test Framework vs Playwright
   - **Action:** Write PlayMode tests in `tests/ZSpaceAccessibilityTests.cs`
   - **Action:** Run: Window → General → Test Runner → PlayMode → Run All

**Installation:**
```bash
# 1. Install zSpace Unity SDK
Download from https://developer.zspace.com/

# 2. Import accessibility components
Copy implementation/unity/* to your Unity project

# 3. Run example scene
Open examples/zspace-accessible-scene/AccessibleZSpaceScene.unity

# 4. Validate scene
Window → Accessibility → Validate Scene
```

---

## [1.0.0] - 2024-10-15

### Initial Release (VR/AR Platforms)
- WCAG 2.2 Level AA compliance framework
- VR headset support (Meta Quest, Vive, PSVR)
- Web-based accessibility components (React)
- Playwright automated testing
- ESLint accessibility rules

---

## Version Support

| Version | Platform | Support Status |
|---------|----------|----------------|
| 2.0.0+ | zSpace Unity | ✅ Active |
| 1.x.x | VR Headsets (Web) | ⚠️ Legacy (Reference Only) |

---

**For more information:**
- **Example Scene:** See `examples/zspace-accessible-scene/README.md`
- **Case Study:** See `examples/zspace-accessible-scene/CASE-STUDY-ZSPACE.md`

---

**Last Updated:** October 19, 2025
**Framework Version:** 2.2.0
**Platform:** zSpace (Unity 2021.3+)
**Standards:** WCAG 2.2 Level AA + W3C XAUR
