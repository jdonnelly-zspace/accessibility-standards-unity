# Accessible zSpace Scene Example

This example demonstrates a fully accessible zSpace Unity scene following WCAG 2.2 Level AA + W3C XAUR standards.

---

## Overview

**Scene Name:** `AccessibleZSpaceScene.unity`
**Platform:** zSpace + Unity 2021.3+
**Standards:** WCAG 2.2 Level AA + W3C XAUR

This scene showcases:
- ✅ Stylus + keyboard + mouse input alternatives
- ✅ Depth perception alternatives (size, shadow, audio, haptic)
- ✅ Screen reader support (NVDA, Narrator, JAWS)
- ✅ WCAG 2.2 compliant target sizes (≥24x24px)
- ✅ Color contrast ratios (4.5:1 for text, 3:1 for UI)
- ✅ Focus indicators in 3D space
- ✅ Accessible 3D spatial menu

---

## Setup Instructions

### 1. Prerequisites

- Unity 2021.3 LTS or newer
- zSpace Unity SDK (download from https://developer.zspace.com/)
- zSpace hardware (or run without hardware for keyboard/mouse testing)

### 2. Installation

1. **Import zSpace Unity SDK:**
   ```
   Assets → Import Package → Custom Package
   Select: zSpace_Unity_SDK.unitypackage
   Click: Import
   ```

2. **Import Accessibility Scripts:**
   - Copy all files from `implementation/unity/scripts/` to your project
   - Copy all files from `implementation/unity/editor/` to your project

3. **Open Scene:**
   ```
   File → Open Scene
   Navigate to: examples/zspace-accessible-scene/AccessibleZSpaceScene.unity
   ```

### 3. Scene Setup

The scene includes the following components:

#### Canvas (Screen Space Overlay)
- **AccessibleZSpaceCanvas.prefab**
- Scale Mode: Scale with Screen Size
- Reference Resolution: 1920x1080

#### Accessible UI Elements
- **MainMenu** - 3D spatial menu with keyboard navigation
- **AccessibleButton1** - Button with stylus + keyboard + mouse input
- **AccessibleButton2** - Button with screen reader label
- **AccessibleButton3** - Button with focus indicator

#### Accessibility Managers
- **KeyboardStylusAlternative** - Maps keyboard keys to stylus buttons
- **DepthCueManager** - Provides 6 depth perception alternatives
- **SpatialAudioManager** - Desktop speaker spatial audio
- **ZSpaceFocusIndicator** - 3D focus indicators

#### zSpace Core (if SDK installed)
- **ZSCore** - zSpace tracking and rendering
- **ZSLeftCamera** - Left eye camera
- **ZSRightCamera** - Right eye camera
- **ZSStylus** - Stylus tracking

---

## Testing the Scene

### 1. Accessibility Validation

Before running:
```
Window → Accessibility → Validate Scene
Click: Run Validation
Verify: Zero critical issues
```

### 2. Keyboard-Only Testing

**Disconnect stylus and test with keyboard only:**

- `Tab` / `Shift+Tab` - Navigate UI elements
- `Enter` / `Space` - Activate buttons
- `Arrow Keys` - Navigate 3D menu
- `Escape` - Close menu/dialog
- `1-9` - Keyboard shortcuts (mapped to stylus buttons)

**Expected:** All functionality accessible via keyboard.

### 3. Screen Reader Testing

**Launch NVDA:**
```
1. Download NVDA from https://www.nvaccess.org/
2. Install and launch NVDA
3. Run Unity scene
4. Navigate with Tab key
5. NVDA should announce button labels and states
```

**Expected:** All UI elements announced correctly.

### 4. Depth Perception Testing (CRITICAL)

**Test without tracked glasses:**

1. Run scene without zSpace glasses (or disable ZSCore)
2. Verify depth cues are present:
   - ✅ Size scaling (nearer objects larger)
   - ✅ Shadows (cast on ground plane)
   - ✅ Audio distance (volume/reverb based on depth)
   - ✅ Haptic feedback (vibration intensity by depth)
   - ✅ Motion parallax (objects move at different speeds)
   - ✅ Occlusion (objects hide behind others)

**Expected:** Application fully usable without stereoscopic 3D.

### 5. Contrast Ratio Testing

```
Window → Accessibility → Contrast Checker
Click: Check All Text Elements in Scene
Verify: All text passes WCAG AA (4.5:1 minimum)
```

### 6. Target Size Testing

All interactive elements should be ≥24x24 pixels (validated by ZSpaceAccessibilityValidator).

---

## Scene Architecture

### Hierarchy

```
AccessibleZSpaceScene
├── Canvas (AccessibleZSpaceCanvas)
│   ├── MainMenu (AccessibleZSpaceMenu)
│   │   ├── MenuItem1 (AccessibleStylusButton)
│   │   ├── MenuItem2 (AccessibleStylusButton)
│   │   └── MenuItem3 (AccessibleStylusButton)
│   └── UI
│       ├── AccessibleButton1 (AccessibleStylusButton)
│       ├── AccessibleButton2 (AccessibleStylusButton)
│       └── AccessibleButton3 (AccessibleStylusButton)
├── Managers
│   ├── KeyboardStylusAlternative
│   ├── DepthCueManager
│   ├── SpatialAudioManager
│   └── SubtitleSystem
├── 3D Objects
│   ├── Cube (with DepthCueManager, ZSpaceFocusIndicator)
│   ├── Sphere (with DepthCueManager, ZSpaceFocusIndicator)
│   └── Cylinder (with DepthCueManager, ZSpaceFocusIndicator)
└── ZSpace (if SDK installed)
    ├── ZSCore
    ├── ZSLeftCamera
    ├── ZSRightCamera
    └── ZSStylus
```

---

## Code Examples

### Accessible Button with Keyboard Alternative

```csharp
// Add to any UI Button GameObject
var button = gameObject.AddComponent<AccessibleStylusButton>();
button.buttonLabel = "Start Simulation"; // For screen readers
button.keyboardKey = KeyCode.Return;     // Enter key activates
button.hapticFeedback = hapticManager;   // Optional haptic
button.focusIndicator = focusIndicator;  // Focus indicator
```

### Depth Perception Alternatives

```csharp
// Add to any 3D object that needs depth cues
var depthCue = gameObject.AddComponent<DepthCueManager>();
depthCue.useSizeScaling = true;    // Scale by distance
depthCue.useShadows = true;        // Cast dynamic shadow
depthCue.useAudioDistance = true;  // Audio volume by distance
depthCue.useHapticDepth = true;    // Haptic intensity by depth
depthCue.useMotionParallax = true; // Parallax effect
depthCue.useOcclusion = true;      // Proper rendering order
```

### Keyboard Navigation for 3D Menu

```csharp
// Add to spatial menu GameObject
var menu = gameObject.AddComponent<AccessibleZSpaceMenu>();
menu.navigateUpKey = KeyCode.UpArrow;
menu.navigateDownKey = KeyCode.DownArrow;
menu.selectKey = KeyCode.Return;
menu.cancelKey = KeyCode.Escape;
menu.hapticFeedback = hapticManager;
```

---

## Accessibility Checklist

Before deploying your zSpace application, verify:

- [ ] All stylus interactions have keyboard alternatives
- [ ] All interactive elements ≥24x24 pixels
- [ ] All text has ≥4.5:1 contrast ratio (4.5:1 normal, 3:1 large)
- [ ] All UI elements have screen reader labels
- [ ] Focus indicators visible in 3D space
- [ ] Application fully functional without stereoscopic 3D (glasses off)
- [ ] Depth perception alternatives present (size, shadow, audio, haptic)
- [ ] Keyboard navigation tested (disconnect stylus)
- [ ] Screen reader tested (NVDA or Narrator)
- [ ] ZSpace Accessibility Validator shows zero critical issues

---

## Troubleshooting

### "ZSCore not found" error
**Solution:** Install zSpace Unity SDK from https://developer.zspace.com/

### Keyboard input not working
**Solution:** Ensure KeyboardStylusAlternative component is in scene

### Screen reader not announcing buttons
**Solution:** Verify buttonLabel is set on AccessibleStylusButton components

### No depth cues visible
**Solution:** Check DepthCueManager is attached and enabled on 3D objects

### Unity Test Framework tests failing
**Solution:**
1. Window → General → Test Runner
2. Select PlayMode tab
3. Review failing test details
4. Fix validation issues
5. Re-run tests

---

## Learn More

- **Full Documentation:** See `standards/ZSPACE-ACCESSIBILITY-CHECKLIST.md`
- **WCAG 2.2 Guidelines:** https://www.w3.org/WAI/WCAG22/quickref/
- **W3C XAUR:** `standards/XR-ACCESSIBILITY-REQUIREMENTS.md`
- **zSpace Developer Portal:** https://developer.zspace.com/
- **CASE STUDY:** See `CASE-STUDY-ZSPACE.md` in this directory

---

**Last Updated:** October 16, 2025
**Framework Version:** 2.0.0 (zSpace)
**Unity Version:** 2021.3 LTS+
