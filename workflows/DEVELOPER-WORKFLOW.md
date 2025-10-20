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

## Unity Accessibility Module Setup (Unity 2023.2+)

**Unity's official Accessibility Module provides native screen reader support**

### Check Unity Version

```csharp
// Determine which accessibility features are available
#if UNITY_2023_2_OR_NEWER
    // Full Unity Accessibility Module available
    using UnityEngine.Accessibility;
#elif UNITY_6000_0_OR_NEWER
    // Enhanced features: VisionUtility, AccessibilitySettings
    using UnityEngine.Accessibility;
#else
    // Unity 2021.3 / 2022.3: No Accessibility Module
    // Use custom screen reader integration
#endif
```

**Recommendation:** Use Unity 2023.2+ (preferably Unity 6.0+) for full accessibility support.

---

### Step 1: Add UnityAccessibilityIntegration Component

**Create Accessibility Manager in Scene:**

1. Create empty GameObject: `GameObject > Create Empty`
2. Rename to "AccessibilityManager"
3. Add Component > Scripts > `UnityAccessibilityIntegration`
4. In Inspector:
   - ✅ Enable Accessibility
   - ✅ Auto Initialize
   - ✅ Debug Mode (for development)

```csharp
// UnityAccessibilityIntegration is already created in:
// implementation/unity/scripts/UnityAccessibilityIntegration.cs
// Just add it to a GameObject in your scene
```

---

### Step 2: Register AccessibilityNodes for UI Elements

**Make Buttons Accessible:**

```csharp
using UnityEngine;
using UnityEngine.UI;
#if UNITY_2023_2_OR_NEWER
using UnityEngine.Accessibility;
#endif

public class AccessibleZSpaceButton : MonoBehaviour
{
    [Header("Button Settings")]
    public string buttonLabel = "Button";
    public string buttonHint = "Activates button action";

    private Button button;

#if UNITY_2023_2_OR_NEWER
    void Start()
    {
        button = GetComponent<Button>();

        // Register with Unity Accessibility Module
        var manager = UnityAccessibilityIntegration.Instance;
        if (manager != null)
        {
            manager.RegisterButton(gameObject, buttonLabel, buttonHint);
        }

        // Add button click listener
        button.onClick.AddListener(OnButtonPressed);
    }

    void OnButtonPressed()
    {
        // Button action...

        // Announce to screen reader
        var manager = UnityAccessibilityIntegration.Instance;
        if (manager != null)
        {
            manager.SendAnnouncement($"{buttonLabel} activated");
        }
    }
#endif
}
```

---

### Step 3: Use Accessibility Hierarchy Viewer

**Debug Your Accessibility Tree:**

1. Open Unity Editor
2. `Window > Accessibility > Accessibility Hierarchy Viewer`
3. Enter Play Mode
4. The Hierarchy Viewer shows all AccessibilityNodes in real-time

**What to Check:**
- ✅ All interactive elements appear in tree
- ✅ Labels are descriptive ("Start Game" not "Button_01")
- ✅ Roles are correct (Button, Link, Checkbox, etc.)
- ✅ Focus order matches visual/spatial order

---

### Step 4: Test with Screen Readers

**Build and Test (Screen readers only work with .exe builds):**

```bash
# 1. Build your application
File > Build Settings > Build

# 2. Enable Windows Narrator
Win + Ctrl + Enter

# 3. Launch your .exe
# Tab through UI - Narrator announces each element

# 4. Test with NVDA (recommended)
# Download: https://www.nvaccess.org/
# Install and launch NVDA
# Run your .exe and test navigation
```

---

### Unity Accessibility Code Patterns

#### Pattern 1: AccessibilityHierarchy Setup

```csharp
using UnityEngine;
#if UNITY_2023_2_OR_NEWER
using UnityEngine.Accessibility;
#endif

public class MyAccessibilityManager : MonoBehaviour
{
#if UNITY_2023_2_OR_NEWER
    private AccessibilityHierarchy m_Hierarchy;

    void Awake()
    {
        // Create and activate hierarchy
        m_Hierarchy = new AccessibilityHierarchy();
        AssistiveSupport.activeHierarchy = m_Hierarchy;

        // Listen for screen reader status changes
        AssistiveSupport.screenReaderStatusChanged += OnScreenReaderStatusChanged;

        Debug.Log($"Accessibility initialized. Screen reader active: {AssistiveSupport.isScreenReaderEnabled}");
    }

    void OnScreenReaderStatusChanged(bool enabled)
    {
        Debug.Log($"Screen reader {(enabled ? "enabled" : "disabled")}");
    }

    void OnDestroy()
    {
        AssistiveSupport.screenReaderStatusChanged -= OnScreenReaderStatusChanged;
    }
#endif
}
```

---

#### Pattern 2: Create AccessibilityNode

```csharp
#if UNITY_2023_2_OR_NEWER
using UnityEngine.Accessibility;
#endif

public class AccessibleObject : MonoBehaviour
{
#if UNITY_2023_2_OR_NEWER
    [SerializeField] private string accessibleLabel = "Object";
    [SerializeField] private string accessibleHint = "";

    private AccessibilityNode m_Node;

    void Start()
    {
        CreateAccessibilityNode();
    }

    void CreateAccessibilityNode()
    {
        // Create node
        m_Node = new AccessibilityNode();
        m_Node.label = accessibleLabel;
        m_Node.role = AccessibilityRole.Button; // Or Link, Checkbox, Header, etc.
        m_Node.hint = accessibleHint;
        m_Node.state = AccessibilityState.None;

        // Add to active hierarchy
        var hierarchy = AssistiveSupport.activeHierarchy;
        if (hierarchy != null)
        {
            hierarchy.AddNode(m_Node);
        }
    }

    public void OnObjectFocused()
    {
        // Update state
        if (m_Node != null)
        {
            m_Node.state = AccessibilityState.Focused;
        }

        // Announce to screen reader
        SendAnnouncement($"Focused: {accessibleLabel}");
    }

    public void OnObjectActivated()
    {
        // Object action...

        // Announce action
        SendAnnouncement($"{accessibleLabel} activated");
    }

    void SendAnnouncement(string message)
    {
        var dispatcher = AssistiveSupport.notificationDispatcher;
        if (dispatcher != null)
        {
            dispatcher.SendAnnouncement(message);
        }
    }

    void OnDestroy()
    {
        // Clean up node
        if (m_Node != null && AssistiveSupport.activeHierarchy != null)
        {
            AssistiveSupport.activeHierarchy.RemoveNode(m_Node);
        }
    }
#endif
}
```

---

#### Pattern 3: AccessibilityRole Usage

```csharp
#if UNITY_2023_2_OR_NEWER
// Common roles for zSpace UI elements:

// Buttons
node.role = AccessibilityRole.Button;

// Links/Hyperlinks
node.role = AccessibilityRole.Link;

// Toggles/Checkboxes
node.role = AccessibilityRole.Checkbox;
node.state = isChecked ? AccessibilityState.Selected : AccessibilityState.None;

// Section Headings
node.role = AccessibilityRole.Header;

// Static Text/Labels
node.role = AccessibilityRole.StaticText;

// Images
node.role = AccessibilityRole.Image;
node.hint = "Image description here";

// Radio Buttons
node.role = AccessibilityRole.RadioButton;
node.state = isSelected ? AccessibilityState.Selected : AccessibilityState.None;

// Search Fields
node.role = AccessibilityRole.SearchField;

// Tab Buttons
node.role = AccessibilityRole.TabBar;
#endif
```

---

#### Pattern 4: Update Node State Dynamically

```csharp
#if UNITY_2023_2_OR_NEWER
public class AccessibleToggle : MonoBehaviour
{
    private AccessibilityNode m_Node;
    private bool m_IsToggled = false;

    void Start()
    {
        m_Node = new AccessibilityNode();
        m_Node.label = "Toggle Option";
        m_Node.role = AccessibilityRole.Checkbox;
        m_Node.state = AccessibilityState.None;

        AssistiveSupport.activeHierarchy?.AddNode(m_Node);
    }

    public void Toggle()
    {
        m_IsToggled = !m_IsToggled;

        // Update accessibility state
        if (m_Node != null)
        {
            m_Node.state = m_IsToggled ? AccessibilityState.Selected : AccessibilityState.None;
        }

        // Announce state change
        string stateText = m_IsToggled ? "checked" : "unchecked";
        AssistiveSupport.notificationDispatcher?.SendAnnouncement($"{m_Node.label} {stateText}");
    }

    public void SetDisabled(bool disabled)
    {
        if (m_Node != null)
        {
            m_Node.state = disabled ? AccessibilityState.Disabled : AccessibilityState.None;
        }
    }
}
#endif
```

---

#### Pattern 5: Color-Blind Safe Palettes (Unity 6.0+)

```csharp
#if UNITY_6000_0_OR_NEWER
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Accessibility;

public class ColorBlindSafeUI : MonoBehaviour
{
    [SerializeField] private Image[] uiElements;

    void Start()
    {
        ApplyColorBlindSafePalette();
    }

    void ApplyColorBlindSafePalette()
    {
        if (uiElements == null || uiElements.Length == 0) return;

        // Request palette
        Color[] palette = new Color[uiElements.Length];
        int distinctColors = VisionUtility.GetColorBlindSafePalette(palette);

        // Apply to UI elements
        for (int i = 0; i < Mathf.Min(uiElements.Length, distinctColors); i++)
        {
            if (uiElements[i] != null)
            {
                uiElements[i].color = palette[i];
            }
        }

        Debug.Log($"Applied {distinctColors} color-blind safe colors");
    }
}
#endif
```

---

### Unity Accessibility Testing Checklist

**Before Committing Code:**

- [ ] AccessibilityHierarchy created and set as active
- [ ] All interactive elements have AccessibilityNode
- [ ] All nodes have descriptive labels (not "Button_01")
- [ ] All nodes have appropriate roles (Button, Link, etc.)
- [ ] Tested with Accessibility Hierarchy Viewer in Editor
- [ ] Built .exe and tested with Windows Narrator
- [ ] Tested with NVDA (free screen reader)
- [ ] Unity Test Framework accessibility tests pass

**Testing Steps:**

```bash
# 1. Editor Testing
Unity Editor > Window > Accessibility > Accessibility Hierarchy Viewer
Enter Play Mode
Verify all interactive elements appear in tree

# 2. Build Testing
File > Build Settings > Build
Enable Windows Narrator (Win + Ctrl + Enter)
Launch .exe
Tab through UI - verify announcements

# 3. NVDA Testing (Recommended)
Download NVDA: https://www.nvaccess.org/
Install and launch NVDA
Run .exe
Tab through UI with NVDA active
Verify labels, roles, and states announced correctly
```

---

### Integration with Existing zSpace Components

**Enhance AccessibleStylusButton with Unity Accessibility:**

```csharp
using UnityEngine;
using zSpace.Core;
#if UNITY_2023_2_OR_NEWER
using UnityEngine.Accessibility;
#endif

public class EnhancedAccessibleStylusButton : MonoBehaviour
{
    [Header("Accessibility")]
    public string buttonLabel = "Button";
    public string buttonHint = "Activates button action";

    private ZCore zCore;
#if UNITY_2023_2_OR_NEWER
    private AccessibilityNode m_Node;
#endif

    void Start()
    {
        zCore = FindObjectOfType<ZCore>();

#if UNITY_2023_2_OR_NEWER
        // Create AccessibilityNode
        var manager = UnityAccessibilityIntegration.Instance;
        if (manager != null)
        {
            m_Node = manager.RegisterButton(gameObject, buttonLabel, buttonHint);
        }
#endif
    }

    void Update()
    {
        // Keyboard alternative to stylus
        if (Input.GetKeyDown(KeyCode.Space))
        {
            OnButtonPressed();
        }

        // Stylus input
        if (zCore != null && zCore.GetButtonDown(0))
        {
            OnButtonPressed();
        }
    }

    void OnButtonPressed()
    {
        // Button action...

        // Haptic feedback
        if (zCore != null && zCore.IsStylusInView())
        {
            zCore.VibrateStylus(0.3f, 100);
        }

#if UNITY_2023_2_OR_NEWER
        // Screen reader announcement
        var manager = UnityAccessibilityIntegration.Instance;
        if (manager != null)
        {
            manager.SendAnnouncement($"{buttonLabel} activated");
        }
#endif
    }

    public void SetFocused(bool focused)
    {
#if UNITY_2023_2_OR_NEWER
        // Update accessibility state
        if (m_Node != null)
        {
            m_Node.state = focused ? AccessibilityState.Focused : AccessibilityState.None;
        }
#endif
    }

#if UNITY_2023_2_OR_NEWER
    void OnDestroy()
    {
        // Unregister node
        var manager = UnityAccessibilityIntegration.Instance;
        if (manager != null)
        {
            manager.UnregisterNode(gameObject);
        }
    }
#endif
}
```

---

### Common Unity Accessibility Issues

**Issue 1: Hierarchy Viewer is Empty**
- **Problem:** No nodes appear in Accessibility Hierarchy Viewer
- **Solution:** Ensure `AssistiveSupport.activeHierarchy = m_Hierarchy` is called before nodes are added
- **Solution:** Verify you're in Play Mode (viewer only works during Play)

**Issue 2: Screen Reader Not Announcing**
- **Problem:** Narrator/NVDA doesn't announce UI elements
- **Solution:** Test with **built .exe**, not Unity Editor Play Mode
- **Solution:** Verify AccessibilityNodes are added to hierarchy
- **Solution:** Check that labels are non-empty strings

**Issue 3: Empty or Generic Labels**
- **Problem:** Nodes have labels like "Button_01" or ""
- **Solution:** Set descriptive labels: `node.label = "Start Game";`
- **Solution:** Use meaningful names that describe the element's purpose

**Issue 4: Wrong Roles**
- **Problem:** Button announced as "StaticText"
- **Solution:** Set correct AccessibilityRole: `node.role = AccessibilityRole.Button;`

---

### Unity Accessibility Resources

**Official Documentation:**
- Unity 2023.2 Accessibility: https://docs.unity3d.com/2023.2/Documentation/Manual/com.unity.modules.accessibility.html
- Unity 6.0 Accessibility: https://docs.unity3d.com/6000.0/Documentation/Manual/accessibility.html
- AccessibilityNode API: https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Accessibility.AccessibilityNode.html
- AssistiveSupport API: https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Accessibility.AssistiveSupport.html
- VisionUtility API (Unity 6.0+): https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Accessibility.VisionUtility.GetColorBlindSafePalette.html

**Framework Documentation:**
- Unity Accessibility Integration Guide: `docs/unity-accessibility-integration.md`
- Unity Accessibility API Reference: `docs/unity-accessibility-api-reference.md`
- zSpace Accessibility Checklist (Section 6): `standards/ZSPACE-ACCESSIBILITY-CHECKLIST.md`

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
