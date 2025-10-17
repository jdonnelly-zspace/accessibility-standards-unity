# Unity zSpace Accessibility Components

**Platform:** zSpace (stereoscopic 3D desktop + stylus + tracked glasses)
**Unity Version:** 2021.3 LTS or newer
**Language:** C#
**SDK Required:** zSpace Unity SDK (https://developer.zspace.com/)

---

## Directory Structure

```
implementation/unity/
├── README.md           ← This file
├── scripts/            ← C# accessibility components
├── prefabs/            ← Reusable Unity prefabs
├── editor/             ← Editor validation tools
└── tests/              ← Unity Test Framework tests
```

---

## Installation

### Prerequisites

1. **Unity 2021.3 LTS or newer**
2. **zSpace Unity SDK** - Download from https://developer.zspace.com/
3. **Unity Packages:**
   - TextMeshPro (for accessible text)
   - Input System (recommended)
   - Unity Test Framework (for tests)

### Quick Install

**Method 1: Copy to Unity Project**
```bash
# Copy all Unity accessibility components to your project
cp -r implementation/unity/scripts/* YourUnityProject/Assets/Scripts/Accessibility/
cp -r implementation/unity/prefabs/* YourUnityProject/Assets/Prefabs/Accessibility/
cp -r implementation/unity/editor/* YourUnityProject/Assets/Editor/Accessibility/
cp -r implementation/unity/tests/* YourUnityProject/Assets/Tests/Accessibility/
```

**Method 2: Unity Package Manager** (Future)
```
1. Unity → Window → Package Manager
2. Click "+" → Add package from git URL
3. Enter: https://github.com/jdonnelly-zspace/accessibility-standards-unity.git
```

---

## What's Included

### `/scripts/` - C# Accessibility Components

**zSpace-Specific Components:**
- `AccessibleStylusButton.cs` - Stylus button with keyboard alternatives
- `KeyboardStylusAlternative.cs` - Maps stylus buttons to keyboard keys
- `StylusHapticFeedback.cs` - Haptic feedback patterns for accessibility
- `DepthCueManager.cs` - Depth perception alternatives (CRITICAL)
- `AccessibleZSpaceMenu.cs` - Keyboard-navigable 3D menu

**Adapted Components:**
- `SpatialAudioManager.cs` - Spatial audio with desktop speakers
- `VoiceCommandManager.cs` - Voice input as stylus alternative
- `AccessibleButton.cs` - UI button with zSpace target sizes (24x24px)
- `ZSpaceFocusIndicator.cs` - Focus indicators for 3D objects
- `AccessibleTooltip.cs` - WCAG-compliant tooltips in 3D space

**Screen Reader Support:**
- `WindowsScreenReaderBridge.cs` - NVDA, Narrator, JAWS integration

### `/prefabs/` - Reusable Unity Prefabs

- `AccessibleZSpaceCanvas.prefab` - Screen Space UI canvas with accessibility
- `AccessibleZSpaceMenu.prefab` - 3D spatial menu with keyboard navigation
- `StylusInteractionUI.prefab` - Stylus + keyboard input UI
- `AccessibleButton3D.prefab` - 3D button with focus indicators
- `DepthCueObject.prefab` - 3D object with all depth cues enabled

### `/editor/` - Unity Editor Tools

- `ZSpaceAccessibilityValidator.cs` - Scene validation for accessibility
- `ContrastCheckerZSpace.cs` - Color contrast validation in Editor
- `TargetSizeValidator.cs` - Validates 24x24px minimum sizes
- `AccessibilityReportGenerator.cs` - Generates compliance reports

### `/tests/` - Unity Test Framework Tests

- `ZSpaceAccessibilityTests.cs` - PlayMode accessibility tests
- `InputAlternativesTests.cs` - Keyboard alternative tests
- `DepthPerceptionTests.cs` - Depth cue tests (CRITICAL)
- `TargetSizeTests.cs` - Target size validation tests

---

## Quick Start Example

### 1. Create Accessible 3D Button

```csharp
using UnityEngine;
using UnityEngine.Accessibility;
using zSpace.Core;

public class MyAccessibleButton : MonoBehaviour
{
    private ZCore zCore;

    void Start()
    {
        zCore = FindObjectOfType<ZCore>();

        // Register with screen reader
        #if UNITY_STANDALONE_WIN
        AccessibilityManager.RegisterNode(gameObject, "Start Simulation", "button");
        #endif
    }

    void Update()
    {
        // Stylus Button 0 OR Spacebar
        if (IsStylusButton0() || Input.GetKeyDown(KeyCode.Space))
        {
            OnButtonClick();
        }
    }

    private bool IsStylusButton0()
    {
        return zCore != null && zCore.GetButtonDown(0);
    }

    private void OnButtonClick()
    {
        // Haptic feedback
        if (zCore != null && zCore.IsStylusInView())
        {
            zCore.VibrateStylus(0.3f, 100); // 30%, 100ms
        }

        // Screen reader announcement
        #if UNITY_STANDALONE_WIN
        AccessibilityManager.Announce("Button activated");
        #endif

        // Your button action here
        Debug.Log("Button clicked!");
    }
}
```

### 2. Add Depth Perception Alternatives

```csharp
using UnityEngine;
using zSpace.Core;

public class MyDepthCueObject : MonoBehaviour
{
    private AudioSource audioSource;
    private ZCore zCore;

    void Start()
    {
        zCore = FindObjectOfType<ZCore>();
        audioSource = GetComponent<AudioSource>();

        // Enable shadow casting (depth cue)
        foreach (Renderer r in GetComponentsInChildren<Renderer>())
        {
            r.shadowCastingMode = UnityEngine.Rendering.ShadowCastingMode.On;
        }
    }

    void Update()
    {
        UpdateDepthCues();
    }

    private void UpdateDepthCues()
    {
        float depth = Vector3.Distance(transform.position, Camera.main.transform.position);

        // 1. Size cue (closer = larger)
        float scale = Mathf.Lerp(1.2f, 0.8f, depth / 10f);
        transform.localScale = Vector3.one * scale;

        // 2. Audio cue (closer = louder)
        if (audioSource != null)
        {
            audioSource.volume = Mathf.Lerp(1.0f, 0.2f, depth / 10f);
        }

        // 3. Haptic cue (on selection)
        // Implemented in selection handler
    }
}
```

### 3. Run Accessibility Tests

```
Unity Editor:
1. Window → General → Test Runner
2. Select "PlayMode" tab
3. Click "Run All"
4. Verify all tests pass
```

---

## Standards Compliance

These components implement:

- **WCAG 2.2 Level AA** (desktop standards)
  - SC 2.1.1: Keyboard (all stylus → keyboard alternatives)
  - SC 2.4.7: Focus Visible (3D focus indicators)
  - SC 2.5.8: Target Size (24x24px desktop minimum)
  - SC 4.1.2: Name, Role, Value (screen reader support)

- **W3C XAUR** (XR Accessibility, zSpace-adapted)
  - Depth perception alternatives (10-15% can't see stereoscopic 3D)
  - Input alternatives (stylus → keyboard/mouse)
  - Motion sickness mitigation (low risk for zSpace)

---

## Key zSpace Accessibility Requirements

### 1. Keyboard Alternatives (CRITICAL)
All stylus interactions MUST have keyboard alternatives:
- Stylus Button 0 → **Spacebar**
- Stylus Button 1 → **E key**
- Stylus Button 2 → **R key**
- Stylus pointing → **Mouse** or **Tab navigation**

### 2. Depth Perception Alternatives (CRITICAL)
10-15% of users cannot perceive stereoscopic 3D. Provide:
- **Size cues** (closer = larger)
- **Shadows** (distance from surface)
- **Occlusion** (layering)
- **Spatial audio** (closer = louder)
- **Haptic feedback** (closer = stronger vibration)
- **Motion parallax** (objects move relative to viewpoint)

### 3. Desktop Screen Readers
Support Windows desktop screen readers:
- **NVDA** (free) - Primary testing
- **Windows Narrator** (built-in)
- **JAWS** (commercial, optional)

**NOT:** Mobile screen readers (TalkBack, VoiceOver)

### 4. Target Sizes
Desktop standard (NOT VR standard):
- **Minimum:** 24x24 pixels
- **Recommended:** 36-40 pixels
- **NOT:** 44px (that's for VR headsets)

### 5. Focus Indicators in 3D
Focus must be visible in stereoscopic 3D:
- **Emissive glow** (emission intensity 2.0)
- **Outline shader** (0.05 units)
- **Floating indicator** (ring/halo)
- **Contrast:** ≥ 3:1 vs background

---

## Testing Checklist

Before shipping your zSpace application:

### Automated Testing
- [ ] All Unity Test Framework tests pass
- [ ] No accessibility warnings in Unity Console
- [ ] All UI elements ≥ 24x24 pixels
- [ ] All AccessibilityManager nodes registered

### Keyboard Testing
- [ ] **Disconnect zSpace stylus**
- [ ] Complete all tasks using keyboard only
- [ ] Tab through all UI elements
- [ ] Spacebar activates all primary actions
- [ ] E/R keys activate secondary/tertiary actions

### Screen Reader Testing
- [ ] Launch NVDA (free download)
- [ ] Tab through UI
- [ ] Verify all elements announced with labels
- [ ] Verify button roles announced
- [ ] Verify menu structure announced

### Depth Perception Testing
- [ ] **Remove zSpace glasses**
- [ ] View application in 2D (no stereoscopic depth)
- [ ] Verify depth perceivable via size, shadow, audio
- [ ] Complete all tasks without stereoscopic 3D

### zSpace Hardware Testing
- [ ] Stylus Button 0 works (AND Spacebar works)
- [ ] Stylus Button 1 works (AND E key works)
- [ ] Stylus Button 2 works (AND R key works)
- [ ] Haptic feedback provides depth cues
- [ ] Focus indicators visible in 3D

---

## Common Issues & Solutions

### Issue: "AccessibilityManager not found"
**Solution:** Install Unity Accessibility module:
```
Unity → Window → Package Manager → "+" → Add package by name
Enter: com.unity.modules.accessibility
```

### Issue: "zSpace namespace not found"
**Solution:** Install zSpace Unity SDK first:
1. Download from https://developer.zspace.com/
2. Import .unitypackage into Unity project
3. Verify ZCore component available

### Issue: Scripts compile but no haptic feedback
**Solution:** Check zSpace hardware connection:
```csharp
if (zCore != null && zCore.IsStylusInView())
{
    Debug.Log("zSpace stylus detected");
}
else
{
    Debug.LogWarning("zSpace stylus not detected - check hardware");
}
```

### Issue: Screen reader not announcing UI
**Solution:** Verify Windows accessibility enabled:
1. Ensure Unity Accessibility module installed
2. Check AccessibilityManager.RegisterNode() called in Start()
3. Test with NVDA (Win+Ctrl+N to launch)
4. Verify Windows 10/11 64-bit

---

## Resources

- **zSpace Developer Portal:** https://developer.zspace.com/
- **Unity Accessibility Module:** https://docs.unity3d.com/Manual/com.unity.modules.accessibility.html
- **WCAG 2.2 Standards:** `/standards/WCAG-2.2-LEVEL-AA.md`
- **zSpace Checklist:** `/standards/ZSPACE-ACCESSIBILITY-CHECKLIST.md`
- **Developer Workflow:** `/workflows/DEVELOPER-WORKFLOW.md`
- **NVDA Screen Reader:** https://www.nvaccess.org/ (free)

---

## Contributing

See `/CONTRIBUTING.md` for contribution guidelines.

**Priorities:**
1. Unity C# components for zSpace SDK
2. Unity Test Framework tests
3. Editor validation tools
4. Documentation improvements

---

## License

See repository root LICENSE file.

---

**Last Updated:** October 2025
**Platform:** zSpace + Unity 2021.3+
**Standards:** WCAG 2.2 Level AA + W3C XAUR (zSpace-adapted)
