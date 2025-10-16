# Developer Workflow - zSpace Accessibility Implementation

This guide shows Unity developers how to integrate accessibility into their daily workflow for zSpace applications using WCAG 2.2 Level AA and W3C XAUR standards.

**Target Platform:** zSpace (stereoscopic 3D desktop + stylus + tracked glasses)
**Unity Version:** 2021.3 LTS or newer
**Language:** C#

---

## Quick Start (10 Minutes)

### 1. Install zSpace Unity SDK

```bash
# Download from zSpace Developer Portal
# https://developer.zspace.com/

# Import into Unity project:
# 1. Download zSpace Unity SDK .unitypackage
# 2. Unity → Assets → Import Package → Custom Package
# 3. Select all files → Import
```

### 2. Install Unity Accessibility Module

```
Unity Editor:
1. Window → Package Manager
2. Click "+" → Add package by name
3. Enter: com.unity.modules.accessibility
4. Click "Add"
```

### 3. Install Recommended Unity Packages

```
Package Manager (Window → Package Manager):
- TextMeshPro (for accessible text rendering)
- Input System (keyboard/stylus input alternatives)
- Unity Test Framework (for accessibility testing)
```

### 4. Copy zSpace Accessibility Scripts (When Available - Phase 3)

```bash
# From accessibility-standards-unity repository
# Future Phase 3 implementation:
cp implementation/unity/scripts/* ./Assets/Scripts/Accessibility/
cp implementation/unity/prefabs/* ./Assets/Prefabs/Accessibility/
cp implementation/unity/editor/* ./Assets/Editor/Accessibility/
cp implementation/unity/tests/* ./Assets/Tests/Accessibility/
```

### 5. Verify zSpace SDK Setup

```csharp
// Create test script: Assets/Scripts/ZSpaceTest.cs
using UnityEngine;
using zSpace.Core;

public class ZSpaceTest : MonoBehaviour
{
    private ZCore zCore;

    void Start()
    {
        zCore = FindObjectOfType<ZCore>();
        if (zCore != null)
        {
            Debug.Log("✓ zSpace SDK initialized successfully");
        }
        else
        {
            Debug.LogError("✗ zSpace SDK not found - check installation");
        }
    }
}
```

---

## Development Lifecycle Integration

### Phase 1: Before Coding

**Review Requirements**
- [ ] Check if design includes accessibility annotations
- [ ] Identify interactive elements that need keyboard alternatives to stylus
- [ ] Note which UI elements need screen reader support (NVDA, Narrator, JAWS)
- [ ] Review depth perception alternatives (10-15% of users can't see stereoscopic 3D)
- [ ] Check that all interactive elements have minimum target size (24x24px for desktop)
- [ ] Verify stylus interactions have keyboard/mouse alternatives
- [ ] Plan haptic feedback for stylus interactions

**zSpace-Specific Checklist:**
- [ ] Are stylus buttons mapped to keyboard keys?
- [ ] Can application run without stereoscopic 3D enabled?
- [ ] Is spatial audio accessible from desktop speakers?
- [ ] Can all tasks be completed with keyboard only?
- [ ] Are focus indicators visible in 3D space?

**Set Up Unity Project Structure**
```
Assets/
├── Scripts/
│   ├── Accessibility/      ← zSpace accessibility components
│   ├── Input/              ← Stylus + keyboard input managers
│   └── UI/                 ← Accessible UI components
├── Prefabs/
│   └── Accessibility/      ← Reusable accessible prefabs
├── Editor/
│   └── Accessibility/      ← Validation tools, inspectors
└── Tests/
    ├── PlayMode/           ← Runtime accessibility tests
    └── EditMode/           ← Editor-time validation
```

---

### Phase 2: During Development

#### Use Unity UI Accessibility APIs

**✅ Good - Accessible Unity UI:**
```csharp
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Accessibility; // Unity's accessibility module
using zSpace.Core;

public class AccessibleButton : MonoBehaviour
{
    [SerializeField] private Button button;
    [SerializeField] private string accessibleLabel = "Submit";
    [SerializeField] private KeyCode keyboardAlternative = KeyCode.Space;

    private ZCore zCore;
    private bool isHovered = false;

    void Start()
    {
        zCore = FindObjectOfType<ZCore>();

        // Configure button for accessibility
        button.onClick.AddListener(OnButtonClick);

        // Add screen reader support (Windows)
        #if UNITY_STANDALONE_WIN
        AccessibilityManager.RegisterNode(gameObject, accessibleLabel, "button");
        #endif
    }

    void Update()
    {
        // Keyboard alternative to stylus click
        if (Input.GetKeyDown(keyboardAlternative))
        {
            button.onClick.Invoke();
        }
    }

    private void OnButtonClick()
    {
        // Provide haptic feedback if stylus is active
        if (zCore != null && zCore.IsStylusInView())
        {
            zCore.VibrateStylus(0.3f, 100); // 30% intensity, 100ms
        }

        // Announce to screen reader
        AnnounceToScreenReader($"{accessibleLabel} activated");
    }

    private void AnnounceToScreenReader(string message)
    {
        #if UNITY_STANDALONE_WIN
        // Use Windows UI Automation (requires Unity 2021.3+)
        AccessibilityManager.Announce(message);
        #endif
    }
}
```

**❌ Bad - Not Accessible:**
```csharp
// NO keyboard alternative
// NO screen reader support
// NO haptic feedback
// NO focus indicators
public class BadButton : MonoBehaviour
{
    void OnMouseDown()
    {
        DoAction(); // Only works with mouse, not keyboard or stylus
    }
}
```

---

#### Implement Stylus + Keyboard Input Alternatives

**Pattern: Dual Input Support (Stylus + Keyboard)**
```csharp
using UnityEngine;
using zSpace.Core;

public class AccessibleInteractable : MonoBehaviour
{
    [Header("Input Alternatives")]
    [SerializeField] private KeyCode primaryKey = KeyCode.Space;      // Stylus Button 0
    [SerializeField] private KeyCode secondaryKey = KeyCode.E;        // Stylus Button 1
    [SerializeField] private KeyCode tertiaryKey = KeyCode.R;         // Stylus Button 2

    [Header("Accessibility")]
    [SerializeField] private string objectName = "Interactive Object";
    [SerializeField] private bool showFocusIndicator = true;
    [SerializeField] private Material focusMaterial;

    private ZCore zCore;
    private ZStylusSelector stylusSelector;
    private Renderer objRenderer;
    private Material originalMaterial;
    private bool isFocused = false;

    void Start()
    {
        zCore = FindObjectOfType<ZCore>();
        stylusSelector = GetComponent<ZStylusSelector>();
        objRenderer = GetComponent<Renderer>();
        originalMaterial = objRenderer.material;
    }

    void Update()
    {
        // Check for keyboard input (alternative to stylus)
        if (Input.GetKeyDown(primaryKey))
        {
            OnPrimaryAction();
        }

        if (Input.GetKeyDown(secondaryKey))
        {
            OnSecondaryAction();
        }

        // Update focus indicator
        if (showFocusIndicator)
        {
            UpdateFocusIndicator();
        }
    }

    private void OnPrimaryAction()
    {
        Debug.Log($"{objectName}: Primary action");
        ProvideFeedback("Primary action");
    }

    private void OnSecondaryAction()
    {
        Debug.Log($"{objectName}: Secondary action");
        ProvideFeedback("Secondary action");
    }

    private void ProvideFeedback(string action)
    {
        // 1. Haptic feedback (if stylus active)
        if (zCore != null && zCore.IsStylusInView())
        {
            zCore.VibrateStylus(0.3f, 100);
        }

        // 2. Audio feedback
        // AudioSource.PlayOneShot(interactionSound);

        // 3. Visual feedback
        // StartCoroutine(FlashFeedback());

        // 4. Screen reader announcement
        #if UNITY_STANDALONE_WIN
        AccessibilityManager.Announce($"{objectName}: {action}");
        #endif
    }

    private void UpdateFocusIndicator()
    {
        // Show focus when object is targeted by stylus or selected via keyboard
        bool shouldShowFocus = IsStylusHovering() || isFocused;

        if (shouldShowFocus && objRenderer.material != focusMaterial)
        {
            objRenderer.material = focusMaterial;
        }
        else if (!shouldShowFocus && objRenderer.material != originalMaterial)
        {
            objRenderer.material = originalMaterial;
        }
    }

    private bool IsStylusHovering()
    {
        return stylusSelector != null && stylusSelector.IsHovered;
    }

    // Called by keyboard navigation system
    public void SetFocus(bool focused)
    {
        isFocused = focused;

        if (focused)
        {
            AnnounceToScreenReader($"Focused: {objectName}");
        }
    }

    private void AnnounceToScreenReader(string message)
    {
        #if UNITY_STANDALONE_WIN
        AccessibilityManager.Announce(message);
        #endif
    }
}
```

---

#### Implement Depth Perception Alternatives

**CRITICAL: 10-15% of users cannot perceive stereoscopic 3D**

```csharp
using UnityEngine;
using zSpace.Core;

public class DepthCueManager : MonoBehaviour
{
    [Header("Depth Alternative Cues")]
    [SerializeField] private bool enableSizeCues = true;
    [SerializeField] private bool enableShadows = true;
    [SerializeField] private bool enableAudioCues = true;
    [SerializeField] private bool enableHapticCues = true;

    [Header("Audio")]
    [SerializeField] private AudioSource audioSource;
    [SerializeField] private float maxVolume = 1.0f;
    [SerializeField] private float minVolume = 0.2f;

    private ZCore zCore;
    private Camera mainCamera;

    void Start()
    {
        zCore = FindObjectOfType<ZCore>();
        mainCamera = Camera.main;
    }

    void Update()
    {
        if (enableAudioCues)
        {
            UpdateAudioDepthCue();
        }
    }

    // Audio volume increases as object gets closer (depth cue)
    private void UpdateAudioDepthCue()
    {
        if (audioSource == null || mainCamera == null) return;

        float distance = Vector3.Distance(transform.position, mainCamera.transform.position);
        float normalizedDistance = Mathf.Clamp01(distance / 10f); // 10 units = max distance

        // Closer = louder
        audioSource.volume = Mathf.Lerp(maxVolume, minVolume, normalizedDistance);
    }

    // Provide haptic intensity based on depth
    public void ProvideHapticDepthCue(float depth)
    {
        if (!enableHapticCues || zCore == null) return;

        // Closer objects = stronger haptic
        float intensity = Mathf.Clamp01(1.0f - depth / 10f);
        zCore.VibrateStylus(intensity, 50);
    }

    // Scale object based on depth (size cue for non-stereoscopic viewers)
    public void ApplySizeDepthCue(float depth)
    {
        if (!enableSizeCues) return;

        float scale = Mathf.Lerp(1.5f, 0.5f, depth / 10f);
        transform.localScale = Vector3.one * scale;
    }

    // Shadows provide depth information
    private void EnableShadowDepthCues()
    {
        if (!enableShadows) return;

        // Ensure all renderers cast shadows
        foreach (Renderer renderer in GetComponentsInChildren<Renderer>())
        {
            renderer.shadowCastingMode = UnityEngine.Rendering.ShadowCastingMode.On;
        }
    }
}
```

---

#### Create Accessible zSpace Menus

```csharp
using UnityEngine;
using UnityEngine.UI;
using zSpace.Core;

public class AccessibleZSpaceMenu : MonoBehaviour
{
    [Header("Menu Items")]
    [SerializeField] private Button[] menuButtons;

    [Header("Navigation")]
    [SerializeField] private KeyCode upKey = KeyCode.UpArrow;
    [SerializeField] private KeyCode downKey = KeyCode.DownArrow;
    [SerializeField] private KeyCode selectKey = KeyCode.Return;
    [SerializeField] private KeyCode cancelKey = KeyCode.Escape;

    private int currentIndex = 0;
    private ZCore zCore;

    void Start()
    {
        zCore = FindObjectOfType<ZCore>();

        if (menuButtons.Length > 0)
        {
            SelectMenuItem(0);
        }
    }

    void Update()
    {
        // Keyboard navigation
        if (Input.GetKeyDown(upKey))
        {
            NavigateMenu(-1);
        }
        else if (Input.GetKeyDown(downKey))
        {
            NavigateMenu(1);
        }
        else if (Input.GetKeyDown(selectKey))
        {
            ActivateCurrentItem();
        }
        else if (Input.GetKeyDown(cancelKey))
        {
            CloseMenu();
        }
    }

    private void NavigateMenu(int direction)
    {
        int newIndex = currentIndex + direction;

        if (newIndex < 0) newIndex = menuButtons.Length - 1;
        if (newIndex >= menuButtons.Length) newIndex = 0;

        SelectMenuItem(newIndex);

        // Haptic feedback for navigation
        if (zCore != null && zCore.IsStylusInView())
        {
            zCore.VibrateStylus(0.2f, 30);
        }
    }

    private void SelectMenuItem(int index)
    {
        // Deselect previous
        if (currentIndex >= 0 && currentIndex < menuButtons.Length)
        {
            menuButtons[currentIndex].GetComponent<Image>().color = Color.white;
        }

        currentIndex = index;

        // Select new
        menuButtons[currentIndex].GetComponent<Image>().color = Color.yellow; // Focus indicator
        menuButtons[currentIndex].Select();

        // Announce to screen reader
        string buttonText = menuButtons[currentIndex].GetComponentInChildren<Text>().text;
        AnnounceToScreenReader($"Menu item {currentIndex + 1} of {menuButtons.Length}: {buttonText}");
    }

    private void ActivateCurrentItem()
    {
        if (currentIndex >= 0 && currentIndex < menuButtons.Length)
        {
            menuButtons[currentIndex].onClick.Invoke();

            // Haptic confirmation
            if (zCore != null && zCore.IsStylusInView())
            {
                zCore.VibrateStylus(0.5f, 100);
            }
        }
    }

    private void CloseMenu()
    {
        gameObject.SetActive(false);
        AnnounceToScreenReader("Menu closed");
    }

    private void AnnounceToScreenReader(string message)
    {
        #if UNITY_STANDALONE_WIN
        AccessibilityManager.Announce(message);
        #endif
    }
}
```

---

### Phase 3: Testing

#### Keyboard Testing (Daily)

**Test Every zSpace Interactive Element:**
```
1. Tab         → Move to next UI element
2. Shift+Tab   → Move to previous UI element
3. Space       → Activate button (Stylus Button 0 alternative)
4. Enter       → Submit form, activate button
5. E           → Secondary action (Stylus Button 1 alternative)
6. R           → Tertiary action (Stylus Button 2 alternative)
7. Escape      → Close menu/modal
8. Arrow keys  → Navigate menus/lists
```

**Checklist:**
- [ ] All stylus interactions have keyboard alternatives
- [ ] Focus indicator clearly visible in 3D space
- [ ] Tab order matches logical interaction order
- [ ] No keyboard traps (can always Tab away)
- [ ] ESC closes all menus/modals
- [ ] Interactive elements at least 24x24 pixels (desktop standard)
- [ ] Application runs without zSpace glasses (stereoscopic 3D disabled)

---

#### Screen Reader Testing (Windows Desktop)

**Test with NVDA (Free):**
```
1. Download NVDA: https://www.nvaccess.org/
2. Install NVDA
3. Run Unity application
4. Launch NVDA (Ctrl + Alt + N)
5. Navigate UI with Tab key
6. Verify NVDA announces:
   - Button names
   - Menu items
   - Focus changes
   - State changes (selected, expanded, etc.)
```

**Test with Windows Narrator (Built-in):**
```
1. Win + Ctrl + Enter → Start Narrator
2. Tab through Unity UI
3. Verify announcements
4. Win + Ctrl + Enter → Stop Narrator
```

---

#### Unity Test Framework Tests

**Create Accessibility Tests:**
```csharp
// Assets/Tests/PlayMode/AccessibilityTests.cs
using NUnit.Framework;
using UnityEngine;
using UnityEngine.TestTools;
using System.Collections;
using zSpace.Core;

public class ZSpaceAccessibilityTests
{
    [UnityTest]
    public IEnumerator StylusHasKeyboardAlternative()
    {
        // Arrange
        var testObject = new GameObject();
        var accessible = testObject.AddComponent<AccessibleInteractable>();
        accessible.primaryKey = KeyCode.Space;

        // Act
        yield return null; // Wait one frame

        // Simulate keyboard press
        // (Unity Input System testing)

        // Assert
        Assert.IsNotNull(accessible);
        // Add specific assertions for keyboard input
    }

    [Test]
    public void AllInteractiveElementsHaveMinimumSize()
    {
        // Find all buttons in scene
        var buttons = Object.FindObjectsOfType<Button>();

        foreach (var button in buttons)
        {
            RectTransform rect = button.GetComponent<RectTransform>();

            // Assert minimum 24x24px (WCAG 2.5.8)
            Assert.GreaterOrEqual(rect.rect.width, 24f, $"Button {button.name} width too small");
            Assert.GreaterOrEqual(rect.rect.height, 24f, $"Button {button.name} height too small");
        }
    }

    [UnityTest]
    public IEnumerator AppRunsWithoutStereoscopic3D()
    {
        // Arrange
        var zCore = Object.FindObjectOfType<ZCore>();

        // Act - Disable stereoscopic mode
        if (zCore != null)
        {
            zCore.EnableStereo = false;
        }

        yield return new WaitForSeconds(2f);

        // Assert - App still functions
        Assert.IsTrue(Application.isPlaying, "App should run without stereoscopic 3D");
    }

    [Test]
    public void DepthCuesProvidedForNonStereoscopicUsers()
    {
        var depthCueManagers = Object.FindObjectsOfType<DepthCueManager>();

        Assert.Greater(depthCueManagers.Length, 0, "No depth cue managers found");

        foreach (var manager in depthCueManagers)
        {
            // Verify at least one depth cue is enabled
            bool hasDepthCue = manager.enableSizeCues ||
                               manager.enableShadows ||
                               manager.enableAudioCues ||
                               manager.enableHapticCues;

            Assert.IsTrue(hasDepthCue, $"{manager.gameObject.name} has no depth cues enabled");
        }
    }
}
```

**Run Tests:**
```
Unity Editor:
1. Window → General → Test Runner
2. Select "PlayMode" tab
3. Click "Run All"
4. Verify all tests pass
```

---

### Phase 4: Pre-Commit Validation

**Manual Checks Before Git Commit:**
```
Accessibility Checklist:
- [ ] All stylus interactions tested with keyboard
- [ ] Tested with Windows Narrator or NVDA
- [ ] Tested without zSpace glasses (depth alternatives work)
- [ ] Focus indicators visible in 3D space
- [ ] Unity Test Framework accessibility tests pass
- [ ] No Unity console errors
- [ ] Minimum target size 24x24px verified
```

**Unity Editor Validation:**
```csharp
// Future: Create Editor validation tool (Phase 3)
// Assets/Editor/Accessibility/AccessibilityValidator.cs
// Validates scene for accessibility issues before build
```

---

## zSpace-Specific Code Patterns

### Pattern 1: Stylus Button Mapping

```csharp
// Map stylus buttons to keyboard keys
public class StylusButtonMapper : MonoBehaviour
{
    private ZCore zCore;

    void Start()
    {
        zCore = FindObjectOfType<ZCore>();
    }

    void Update()
    {
        // Stylus Button 0 OR Spacebar
        if (IsStylusButton0Pressed() || Input.GetKeyDown(KeyCode.Space))
        {
            OnButton0Action();
        }

        // Stylus Button 1 OR E key
        if (IsStylusButton1Pressed() || Input.GetKeyDown(KeyCode.E))
        {
            OnButton1Action();
        }

        // Stylus Button 2 OR R key
        if (IsStylusButton2Pressed() || Input.GetKeyDown(KeyCode.R))
        {
            OnButton2Action();
        }
    }

    private bool IsStylusButton0Pressed()
    {
        return zCore != null && zCore.GetButtonDown(0);
    }

    private bool IsStylusButton1Pressed()
    {
        return zCore != null && zCore.GetButtonDown(1);
    }

    private bool IsStylusButton2Pressed()
    {
        return zCore != null && zCore.GetButtonDown(2);
    }

    private void OnButton0Action() { /* Primary action */ }
    private void OnButton1Action() { /* Secondary action */ }
    private void OnButton2Action() { /* Tertiary action */ }
}
```

---

### Pattern 2: Focus Indicators for 3D Objects

```csharp
public class ZSpaceFocusIndicator : MonoBehaviour
{
    [SerializeField] private Color focusColor = Color.yellow;
    [SerializeField] private float glowIntensity = 2f;

    private Renderer objRenderer;
    private Material originalMaterial;
    private Material focusMaterial;

    void Start()
    {
        objRenderer = GetComponent<Renderer>();
        originalMaterial = objRenderer.material;

        // Create focus material with emissive glow
        focusMaterial = new Material(originalMaterial);
        focusMaterial.EnableKeyword("_EMISSION");
        focusMaterial.SetColor("_EmissionColor", focusColor * glowIntensity);
    }

    public void ShowFocus()
    {
        objRenderer.material = focusMaterial;
    }

    public void HideFocus()
    {
        objRenderer.material = originalMaterial;
    }
}
```

---

### Pattern 3: Spatial Audio Accessibility

```csharp
public class AccessibleSpatialAudio : MonoBehaviour
{
    [SerializeField] private AudioSource audioSource;
    [SerializeField] private bool enableSpatialAudio = true;
    [SerializeField] private bool provideMonoAlternative = true;

    void Start()
    {
        ConfigureAudioAccessibility();
    }

    private void ConfigureAudioAccessibility()
    {
        if (audioSource == null) return;

        // Spatial audio from desktop speakers (not headphones)
        audioSource.spatialBlend = enableSpatialAudio ? 1f : 0f;

        // Ensure audio isn't *only* spatial (mono alternative)
        if (provideMonoAlternative)
        {
            // Users can still hear even if spatial perception is limited
            audioSource.minDistance = 1f;
            audioSource.maxDistance = 50f;
            audioSource.rolloffMode = AudioRolloffMode.Linear;
        }
    }
}
```

---

## WCAG 2.2 zSpace-Specific Implementation

### SC 2.1.1: Keyboard (Level A)
**Requirement:** All stylus functionality available via keyboard.

**zSpace Implementation:**
- Stylus Button 0 → Spacebar
- Stylus Button 1 → E key
- Stylus Button 2 → R key
- Stylus pointing → Mouse cursor
- 3D object selection → Tab + Enter

---

### SC 2.5.8: Target Size (Minimum) (Level AA)
**Requirement:** Interactive elements at least 24x24 CSS pixels.

**zSpace Desktop Implementation:**
```csharp
// Unity UI buttons (Canvas)
public class MinimumTargetSize : MonoBehaviour
{
    void OnValidate()
    {
        RectTransform rect = GetComponent<RectTransform>();

        // Ensure minimum 24x24 pixels
        if (rect.rect.width < 24f)
        {
            Debug.LogWarning($"{gameObject.name}: Width {rect.rect.width}px < 24px minimum");
        }

        if (rect.rect.height < 24f)
        {
            Debug.LogWarning($"{gameObject.name}: Height {rect.rect.height}px < 24px minimum");
        }
    }
}
```

---

### SC 1.4.13: Content on Hover or Focus (Level AA)
**Requirement:** Tooltips dismissible, hoverable, persistent.

```csharp
public class AccessibleTooltip : MonoBehaviour
{
    [SerializeField] private GameObject tooltipPanel;
    [SerializeField] private float showDelay = 0.5f;

    private bool isHovering = false;
    private float hoverTimer = 0f;

    void Update()
    {
        if (isHovering)
        {
            hoverTimer += Time.deltaTime;

            if (hoverTimer >= showDelay && !tooltipPanel.activeSelf)
            {
                tooltipPanel.SetActive(true);
            }
        }

        // ESC key dismisses tooltip (WCAG 1.4.13 - Dismissible)
        if (Input.GetKeyDown(KeyCode.Escape) && tooltipPanel.activeSelf)
        {
            tooltipPanel.SetActive(false);
        }
    }

    public void OnPointerEnter()
    {
        isHovering = true;
        hoverTimer = 0f;
    }

    public void OnPointerExit()
    {
        isHovering = false;
        hoverTimer = 0f;
        tooltipPanel.SetActive(false);
    }
}
```

---

## Common Mistakes & Solutions

### Mistake #1: Stylus-Only Interactions

**❌ Bad:**
```csharp
// Only works with zSpace stylus
if (zCore.GetButtonDown(0))
{
    DoAction();
}
```

**✅ Good:**
```csharp
// Works with stylus OR keyboard
if (zCore.GetButtonDown(0) || Input.GetKeyDown(KeyCode.Space))
{
    DoAction();
}
```

---

### Mistake #2: No Depth Perception Alternatives

**❌ Bad:**
```csharp
// App requires stereoscopic 3D vision
// No alternatives for 10-15% who can't perceive depth
```

**✅ Good:**
```csharp
// Provide multiple depth cues:
// - Size (closer = larger)
// - Shadows
// - Occlusion
// - Spatial audio (closer = louder)
// - Haptic feedback (closer = stronger vibration)
```

---

### Mistake #3: No Screen Reader Support

**❌ Bad:**
```csharp
// Silent UI - screen readers can't announce anything
```

**✅ Good:**
```csharp
#if UNITY_STANDALONE_WIN
AccessibilityManager.RegisterNode(gameObject, "Submit Button", "button");
AccessibilityManager.Announce("Button activated");
#endif
```

---

## Resources

- **zSpace Developer Docs:** https://developer.zspace.com/docs/
- **Unity Accessibility Module:** https://docs.unity3d.com/Manual/com.unity.modules.accessibility.html
- **WCAG 2.2 Checklist:** `/standards/ZSPACE-ACCESSIBILITY-CHECKLIST.md`
- **zSpace Accessibility Requirements:** `/standards/XR-ACCESSIBILITY-REQUIREMENTS.md`
- **NVDA Screen Reader:** https://www.nvaccess.org/ (free)
- **Windows Narrator:** Built into Windows 10/11

---

## Getting Help

**Questions?**
- Review WCAG 2.2 standards in `/standards/`
- Check zSpace code patterns in this workflow
- zSpace Developer Community: https://dev-community.zspace.com/

**Found an Issue?**
- Test with keyboard-only navigation
- Test with Windows Narrator or NVDA
- Run Unity Test Framework accessibility tests
- Test without stereoscopic 3D enabled

---

**Last Updated:** October 2025
**Platform:** zSpace + Unity 2021.3+
**Standards:** WCAG 2.2 Level AA + W3C XAUR (zSpace-adapted)
