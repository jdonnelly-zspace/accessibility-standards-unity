# Unity C# Accessibility Scripts

**Directory:** `implementation/unity/scripts/`
**Language:** C#
**Platform:** zSpace + Unity 2021.3+

---

## Contents

This directory contains Unity C# scripts that implement accessibility features for zSpace applications.

### zSpace-Specific Components

**Created in Task 3.2:**
- `AccessibleStylusButton.cs` - Stylus button with keyboard alternatives
- `KeyboardStylusAlternative.cs` - Maps stylus buttons to keyboard keys (Button 0→Space, etc.)
- `StylusHapticFeedback.cs` - Haptic feedback patterns for accessibility
- `DepthCueManager.cs` - Depth perception alternatives (size, shadow, audio, haptic)
- `AccessibleZSpaceMenu.cs` - Keyboard-navigable 3D spatial menu

### Adapted Components

**Created in Task 3.3:**
- `SpatialAudioManager.cs` - Spatial audio for desktop speakers (not headphones)
- `VoiceCommandManager.cs` - Voice input as alternative to stylus
- `AccessibleButton.cs` - UI button with zSpace target sizes (24x24px minimum)
- `ZSpaceFocusIndicator.cs` - Focus indicators for 3D objects (emissive glow, outline)
- `AccessibleTooltip.cs` - WCAG-compliant tooltips in 3D space

### Screen Reader Support
- `WindowsScreenReaderBridge.cs` - Integration with NVDA, Narrator, JAWS

---

## Usage

See parent directory `/implementation/unity/README.md` for installation and usage examples.

---

**Status:** Components to be created in Phase 3, Tasks 3.2 and 3.3
