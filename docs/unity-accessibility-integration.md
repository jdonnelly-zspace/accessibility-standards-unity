# Unity Accessibility Module Integration for zSpace

**Complete guide for integrating Unity's official Accessibility Module with zSpace applications**

**Unity Versions:** 2021.3 LTS, 2022.3 LTS, 2023.2+, Unity 6.0+
**Platform:** zSpace (stereoscopic 3D desktop + stylus)
**Standards:** WCAG 2.2 Level AA + W3C XAUR
**Last Updated:** October 2025

---

## Table of Contents

1. [Introduction](#introduction)
2. [Unity Version Requirements](#unity-version-requirements)
3. [Accessibility Module Overview](#accessibility-module-overview)
4. [Setting Up AccessibilityHierarchy](#setting-up-accessibilityhierarchy)
5. [Creating AccessibilityNodes](#creating-accessibilitynodes)
6. [Desktop Screen Reader Support](#desktop-screen-reader-support)
7. [Using the Accessibility Hierarchy Viewer](#using-the-accessibility-hierarchy-viewer)
8. [Vision Accessibility (Unity 6.0+)](#vision-accessibility-unity-60)
9. [Integration with zSpace Components](#integration-with-zspace-components)
10. [Testing with Windows Screen Readers](#testing-with-windows-screen-readers)
11. [Troubleshooting](#troubleshooting)
12. [API Reference](#api-reference)

---

## Introduction

Unity's **Accessibility Module** (introduced in Unity 2023.2) provides native APIs for creating accessible applications that work with screen readers and assistive technologies. This guide shows how to integrate these APIs with zSpace applications to provide desktop screen reader support, accessible UI hierarchies, and vision accessibility features.

### What Unity Accessibility Module Provides

- **AccessibilityHierarchy** - Tree structure for screen reader navigation
- **AccessibilityNode** - Represents individual UI elements to assistive technologies
- **AssistiveSupport** - Screen reader integration and status monitoring
- **AccessibilityRole** - Semantic roles (Button, Link, Heading, etc.)
- **VisionUtility** - Color-blind safe color palettes (Unity 6.0+)
- **Accessibility Hierarchy Viewer** - Real-time debugging tool (Unity 2023.2+)

### Why Use Unity Accessibility Module with zSpace?

1. **Native Screen Reader Support** - Works with Windows Narrator, NVDA, JAWS
2. **WCAG 2.2 Compliance** - Meets SC 4.1.2 (Name, Role, Value) requirements
3. **Real-time Debugging** - Accessibility Hierarchy Viewer shows accessibility tree
4. **Future-Proof** - Built on Unity's official APIs, maintained by Unity Technologies
5. **Color-Blind Support** - VisionUtility ensures accessible color palettes

---

## Unity Version Requirements

### Unity 2021.3 & 2022.3 LTS

**Status:** ❌ No Accessibility Module
**Recommendation:** Upgrade to Unity 2023.2+ for accessibility support

**Workarounds for Older Versions:**
- Custom screen reader integration using Windows UI Automation
- Manual accessibility tree management
- Third-party accessibility plugins

**Code Pattern for Fallback:**
```csharp
#if UNITY_2023_2_OR_NEWER
    // Use Unity Accessibility Module
    private AccessibilityHierarchy m_Hierarchy;
#else
    // Fallback for Unity 2021.3/2022.3
    Debug.LogWarning("Unity Accessibility Module not available. Upgrade to Unity 2023.2+ for full accessibility support.");
    // Implement custom screen reader integration here
#endif
```

---

### Unity 2023.2

**Status:** ✅ Accessibility Module Introduced

**Features Available:**
- ✅ `AccessibilityHierarchy` - Create accessibility trees
- ✅ `AccessibilityNode` - Define accessible UI elements
- ✅ `AssistiveSupport` - Screen reader integration
- ✅ `AccessibilityRole` - Semantic roles (Button, Link, Heading, etc.)
- ✅ `AccessibilityState` - Element states (selected, disabled, focused)
- ✅ **Accessibility Hierarchy Viewer** - Real-time debugging (Window > Accessibility)
- ✅ Mobile screen reader support (iOS VoiceOver, Android TalkBack)

**Not Available:**
- ❌ `VisionUtility` (added in Unity 6.0)
- ❌ `AccessibilitySettings` (added in Unity 6.0)

**Documentation:**
- Manual: https://docs.unity3d.com/2023.2/Documentation/Manual/com.unity.modules.accessibility.html
- What's New: https://docs.unity3d.com/2023.2/Documentation/Manual/WhatsNew20232.html
- API Reference: https://docs.unity3d.com/2023.2/Documentation/ScriptReference/UnityEngine.AccessibilityModule.html

---

### Unity 6.0+

**Status:** ✅ Full Accessibility Module Support

**All Unity 2023.2 Features PLUS:**
- ✅ `VisionUtility.GetColorBlindSafePalette()` - Generate color-blind safe palettes
- ✅ `AccessibilitySettings` - System accessibility preferences (iOS/Android)
- ✅ **Enabled by default** in new projects (listed in Built-in packages)
- ✅ Enhanced screen reader integration
- ✅ Real-time Accessibility Hierarchy Viewer during Play mode

**Documentation:**
- Manual: https://docs.unity3d.com/6000.0/Documentation/Manual/accessibility.html
- Accessibility Module: https://docs.unity3d.com/6000.0/Documentation/Manual/com.unity.modules.accessibility.html
- API Reference: https://docs.unity3d.com/6000.0/Documentation/ScriptReference/UnityEngine.AccessibilityModule.html

**Recommendation:** ⭐ **Use Unity 6.0+ for best accessibility support**

---

## Accessibility Module Overview

### Core Components

#### 1. AccessibilityHierarchy
The main container for all accessibility nodes. Screen readers navigate this hierarchy.

```csharp
using UnityEngine.Accessibility;

AccessibilityHierarchy m_Hierarchy = new AccessibilityHierarchy();
AssistiveSupport.activeHierarchy = m_Hierarchy; // Make it active for screen readers
```

#### 2. AccessibilityNode
Represents a single UI element (button, label, slider, etc.) in the accessibility tree.

```csharp
AccessibilityNode node = new AccessibilityNode();
node.label = "Start Game";
node.role = AccessibilityRole.Button;
node.state = AccessibilityState.None;
```

#### 3. AssistiveSupport
Manages screen reader integration and provides events for accessibility status changes.

```csharp
// Check if screen reader is active
bool isScreenReaderOn = AssistiveSupport.isScreenReaderEnabled;

// Listen for screen reader status changes
AssistiveSupport.screenReaderStatusChanged += OnScreenReaderChanged;

void OnScreenReaderChanged(bool enabled)
{
    Debug.Log($"Screen reader {(enabled ? "enabled" : "disabled")}");
}
```

#### 4. AccessibilityRole
Semantic roles that tell screen readers what type of element this is.

**Common Roles:**
- `AccessibilityRole.Button` - Clickable button
- `AccessibilityRole.Link` - Hyperlink
- `AccessibilityRole.Header` - Section heading
- `AccessibilityRole.StaticText` - Read-only text
- `AccessibilityRole.Image` - Image with description
- `AccessibilityRole.Checkbox` - Checkbox control
- `AccessibilityRole.RadioButton` - Radio button

**Full API:** https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Accessibility.AccessibilityRole.html

---

## Setting Up AccessibilityHierarchy

### Basic Setup

Create a manager script to initialize the accessibility hierarchy for your zSpace application.

```csharp
using UnityEngine;
using UnityEngine.Accessibility;

/// <summary>
/// Manages Unity Accessibility Module integration for zSpace applications
/// Requires Unity 2023.2 or newer
/// </summary>
public class ZSpaceAccessibilityManager : MonoBehaviour
{
    [Header("Accessibility Settings")]
    [Tooltip("Enable accessibility hierarchy for screen readers")]
    public bool enableAccessibility = true;

    [Tooltip("Log accessibility events to console")]
    public bool debugMode = false;

    private AccessibilityHierarchy m_Hierarchy;

    void Awake()
    {
#if UNITY_2023_2_OR_NEWER
        if (enableAccessibility)
        {
            InitializeAccessibility();
        }
#else
        Debug.LogWarning("Unity Accessibility Module requires Unity 2023.2 or newer. Please upgrade Unity for full accessibility support.");
#endif
    }

#if UNITY_2023_2_OR_NEWER
    void InitializeAccessibility()
    {
        // Create the accessibility hierarchy
        m_Hierarchy = new AccessibilityHierarchy();

        // Set as the active hierarchy for screen readers
        AssistiveSupport.activeHierarchy = m_Hierarchy;

        // Listen for screen reader status changes
        AssistiveSupport.screenReaderStatusChanged += OnScreenReaderStatusChanged;

        if (debugMode)
        {
            Debug.Log($"Accessibility hierarchy initialized. Screen reader active: {AssistiveSupport.isScreenReaderEnabled}");
        }
    }

    void OnScreenReaderStatusChanged(bool isEnabled)
    {
        if (debugMode)
        {
            Debug.Log($"Screen reader status changed: {(isEnabled ? "ENABLED" : "DISABLED")}");
        }

        // You can respond to screen reader state changes here
        // For example, enable/disable certain UI elements or features
    }

    void OnDestroy()
    {
        // Clean up event listeners
        AssistiveSupport.screenReaderStatusChanged -= OnScreenReaderStatusChanged;
    }

    /// <summary>
    /// Get the active accessibility hierarchy
    /// </summary>
    public AccessibilityHierarchy GetHierarchy()
    {
        return m_Hierarchy;
    }

    /// <summary>
    /// Check if accessibility is initialized and screen reader is enabled
    /// </summary>
    public bool IsScreenReaderActive()
    {
        return m_Hierarchy != null && AssistiveSupport.isScreenReaderEnabled;
    }
#endif
}
```

### Usage in Scene

1. Create empty GameObject in your zSpace scene: `GameObject > Create Empty`
2. Rename it to "AccessibilityManager"
3. Add component: `ZSpaceAccessibilityManager`
4. Check "Enable Accessibility" in Inspector
5. Run scene and check Console for initialization log

---

## Creating AccessibilityNodes

### Basic AccessibilityNode

Every interactive UI element should have an AccessibilityNode so screen readers can navigate to it.

```csharp
using UnityEngine;
using UnityEngine.Accessibility;

public class AccessibleButton : MonoBehaviour
{
    [Header("Accessibility")]
    public string accessibleLabel = "Button";
    public string accessibleHint = "Activates the button action";

    private AccessibilityNode m_Node;

#if UNITY_2023_2_OR_NEWER
    void Start()
    {
        CreateAccessibilityNode();
    }

    void CreateAccessibilityNode()
    {
        // Create the node
        m_Node = new AccessibilityNode();
        m_Node.label = accessibleLabel;
        m_Node.role = AccessibilityRole.Button;
        m_Node.state = AccessibilityState.None;

        // Optional: Add a hint for screen reader users
        if (!string.IsNullOrEmpty(accessibleHint))
        {
            m_Node.hint = accessibleHint;
        }

        // Add to the active hierarchy
        var hierarchy = AssistiveSupport.activeHierarchy;
        if (hierarchy != null)
        {
            hierarchy.AddNode(m_Node);
        }
    }

    public void OnButtonPressed()
    {
        // Button action here...

        // Announce to screen reader
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
        // Clean up node when object is destroyed
        if (m_Node != null && AssistiveSupport.activeHierarchy != null)
        {
            AssistiveSupport.activeHierarchy.RemoveNode(m_Node);
        }
    }
#endif
}
```

### AccessibilityNode with State Management

For interactive elements that change state (checkboxes, toggles, selections):

```csharp
public class AccessibleToggle : MonoBehaviour
{
    [Header("Accessibility")]
    public string accessibleLabel = "Toggle";

    private bool m_IsToggled = false;
    private AccessibilityNode m_Node;

#if UNITY_2023_2_OR_NEWER
    void Start()
    {
        CreateAccessibilityNode();
        UpdateNodeState();
    }

    void CreateAccessibilityNode()
    {
        m_Node = new AccessibilityNode();
        m_Node.label = accessibleLabel;
        m_Node.role = AccessibilityRole.Checkbox; // Use Checkbox role for toggles

        AssistiveSupport.activeHierarchy?.AddNode(m_Node);
    }

    void UpdateNodeState()
    {
        if (m_Node != null)
        {
            // Set the state based on toggle value
            m_Node.state = m_IsToggled ? AccessibilityState.Selected : AccessibilityState.None;
        }
    }

    public void ToggleValue()
    {
        m_IsToggled = !m_IsToggled;
        UpdateNodeState();

        // Announce the new state
        string stateText = m_IsToggled ? "checked" : "unchecked";
        SendAnnouncement($"{accessibleLabel} {stateText}");
    }

    void SendAnnouncement(string message)
    {
        AssistiveSupport.notificationDispatcher?.SendAnnouncement(message);
    }
#endif
}
```

### AccessibilityNode for 3D Objects (zSpace)

For 3D objects in zSpace scenes that users interact with via stylus:

```csharp
using UnityEngine;
using UnityEngine.Accessibility;
using zSpace.Core;

public class Accessible3DObject : MonoBehaviour
{
    [Header("Accessibility")]
    public string objectLabel = "3D Object";
    public string objectDescription = "Interactive 3D object";
    public AccessibilityRole objectRole = AccessibilityRole.Button;

    private AccessibilityNode m_Node;
    private bool m_IsFocused = false;

#if UNITY_2023_2_OR_NEWER
    void Start()
    {
        CreateAccessibilityNode();
    }

    void CreateAccessibilityNode()
    {
        m_Node = new AccessibilityNode();
        m_Node.label = objectLabel;
        m_Node.role = objectRole;
        m_Node.hint = objectDescription;
        m_Node.state = AccessibilityState.None;

        AssistiveSupport.activeHierarchy?.AddNode(m_Node);
    }

    public void OnStylusHover()
    {
        if (!m_IsFocused)
        {
            m_IsFocused = true;
            m_Node.state = AccessibilityState.Focused;
            SendAnnouncement($"{objectLabel}. {objectDescription}");
        }
    }

    public void OnStylusExit()
    {
        if (m_IsFocused)
        {
            m_IsFocused = false;
            m_Node.state = AccessibilityState.None;
        }
    }

    public void OnStylusClick()
    {
        SendAnnouncement($"{objectLabel} activated");
    }

    void SendAnnouncement(string message)
    {
        AssistiveSupport.notificationDispatcher?.SendAnnouncement(message);
    }
#endif
}
```

---

## Desktop Screen Reader Support

Unity's Accessibility Module was designed for mobile screen readers (iOS VoiceOver, Android TalkBack), but the APIs work on Windows desktop with proper configuration.

### Windows Screen Readers

**Supported Screen Readers:**
1. **NVDA** (Free, recommended) - https://www.nvaccess.org/
2. **Windows Narrator** (Built into Windows 10/11)
3. **JAWS** (Commercial) - https://www.freedomscientific.com/products/software/jaws/

### How Unity Accessibility Works on Windows

Unity's `AccessibilityHierarchy` exposes UI elements to Windows UI Automation framework, which screen readers use to navigate applications.

**Important Notes:**
- Screen readers work with **built Unity applications**, not in Unity Editor
- Test with actual .exe builds, not Play Mode in Editor
- Ensure Windows UI Automation is enabled (it usually is by default)

### Testing Desktop Screen Reader Integration

#### Step 1: Build Your zSpace Application
```
File > Build Settings
Platform: Windows
Target Platform: Windows
Architecture: x86_64
Build
```

#### Step 2: Enable Windows Narrator
```
Windows + Ctrl + Enter (toggle Narrator on/off)
OR
Settings > Accessibility > Narrator > Turn on Narrator
```

#### Step 3: Test Navigation
1. Launch your built zSpace .exe application
2. Press **Tab** key to navigate between accessible elements
3. Narrator will announce each `AccessibilityNode` label
4. Press **Enter** or **Space** to activate buttons

#### Step 4: Test with NVDA (Recommended)
1. Download NVDA: https://www.nvaccess.org/download/
2. Install and launch NVDA
3. Launch your zSpace application
4. Use **Tab** to navigate
5. NVDA announces AccessibilityNode labels and roles

**NVDA Keyboard Shortcuts:**
- `Tab` - Navigate to next element
- `Shift + Tab` - Navigate to previous element
- `Enter` or `Space` - Activate button/link
- `NVDA + T` - Read window title
- `NVDA + B` - Read bottom line of screen
- `NVDA + Q` - Quit NVDA

---

## Using the Accessibility Hierarchy Viewer

Unity 2023.2+ includes a real-time debugging tool to visualize your accessibility hierarchy.

### Opening the Hierarchy Viewer

**Unity 2023.2+:**
```
Window > Accessibility > Accessibility Hierarchy Viewer
```

### Using the Hierarchy Viewer

1. **Enter Play Mode** in Unity Editor
2. Open Accessibility Hierarchy Viewer (Window > Accessibility)
3. The viewer displays the active `AccessibilityHierarchy` tree
4. Each `AccessibilityNode` appears as a tree node
5. Click a node to see its properties (label, role, state, hint)

### What the Hierarchy Viewer Shows

- **Label** - Text announced by screen readers
- **Role** - Semantic role (Button, Link, Heading, etc.)
- **State** - Current state (Selected, Disabled, Focused, etc.)
- **Hint** - Additional context for screen reader users
- **Hierarchy Structure** - Parent/child relationships

### Debugging with Hierarchy Viewer

**Common Issues to Check:**
- ❌ **Missing nodes** - Interactive elements not appearing in tree
- ❌ **Empty labels** - Nodes with no label text
- ❌ **Wrong roles** - Button marked as StaticText, etc.
- ❌ **Incorrect hierarchy** - Focus order doesn't match visual order

**Example Screenshot Workflow:**
1. Enter Play Mode
2. Open Hierarchy Viewer (Window > Accessibility)
3. Navigate through your zSpace UI with Tab key
4. Verify each element appears in Hierarchy Viewer
5. Check labels are descriptive ("Start Game" not "Button_01")
6. Check roles match element types (Button, Link, Heading)

---

## Vision Accessibility (Unity 6.0+)

Unity 6.0 introduced `VisionUtility` for generating color-blind safe color palettes.

### Using VisionUtility.GetColorBlindSafePalette()

```csharp
#if UNITY_6000_0_OR_NEWER
using UnityEngine;
using UnityEngine.Accessibility;

public class ColorBlindSafePalette : MonoBehaviour
{
    void Start()
    {
        // Request 8 distinct colors
        Color[] palette = new Color[8];

        // Get color-blind safe palette
        int distinctColors = VisionUtility.GetColorBlindSafePalette(palette);

        Debug.Log($"Generated {distinctColors} distinct color-blind safe colors");

        // Use the palette for UI elements
        for (int i = 0; i < distinctColors; i++)
        {
            Debug.Log($"Color {i}: R={palette[i].r}, G={palette[i].g}, B={palette[i].b}");
        }
    }
}
#endif
```

### What VisionUtility Provides

The palette is safe for:
- **Normal vision** - All colors distinguishable
- **Deuteranopia** (red-green color blindness, ~6% of males)
- **Protanopia** (red-green color blindness, ~2% of males)
- **Tritanopia** (blue-yellow color blindness, ~0.01% of population)

### Applying Color-Blind Safe Palettes to zSpace UI

```csharp
#if UNITY_6000_0_OR_NEWER
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Accessibility;

public class ZSpaceColorAccessibility : MonoBehaviour
{
    [Header("UI Elements to Color")]
    public Image[] uiElements;

    void Start()
    {
        ApplyColorBlindSafePalette();
    }

    void ApplyColorBlindSafePalette()
    {
        if (uiElements == null || uiElements.Length == 0) return;

        // Generate palette
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

        Debug.Log($"Applied {distinctColors} color-blind safe colors to UI elements");
    }
}
#endif
```

**Documentation:** https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Accessibility.VisionUtility.GetColorBlindSafePalette.html

---

## Integration with zSpace Components

### Enhancing AccessibleStylusButton with Unity Accessibility

Integrate `AccessibilityNode` with existing zSpace components:

```csharp
using UnityEngine;
#if UNITY_2023_2_OR_NEWER
using UnityEngine.Accessibility;
#endif

public class AccessibleStylusButton : MonoBehaviour
{
    [Header("Button Settings")]
    public string buttonLabel = "Button";

    [Header("Accessibility")]
    public string accessibleLabel = "Button";
    public string accessibleHint = "";

#if UNITY_2023_2_OR_NEWER
    private AccessibilityNode m_Node;
#endif

    void Start()
    {
#if UNITY_2023_2_OR_NEWER
        SetupAccessibilityNode();
#endif
    }

#if UNITY_2023_2_OR_NEWER
    void SetupAccessibilityNode()
    {
        m_Node = new AccessibilityNode();
        m_Node.label = accessibleLabel;
        m_Node.role = AccessibilityRole.Button;
        m_Node.hint = accessibleHint;
        m_Node.state = AccessibilityState.None;

        AssistiveSupport.activeHierarchy?.AddNode(m_Node);
    }

    public void OnButtonPressed()
    {
        // Existing button logic...

        // Announce to screen reader
        AssistiveSupport.notificationDispatcher?.SendAnnouncement($"{accessibleLabel} activated");
    }

    public void SetFocused(bool focused)
    {
        if (m_Node != null)
        {
            m_Node.state = focused ? AccessibilityState.Focused : AccessibilityState.None;
        }
    }

    void OnDestroy()
    {
        if (m_Node != null && AssistiveSupport.activeHierarchy != null)
        {
            AssistiveSupport.activeHierarchy.RemoveNode(m_Node);
        }
    }
#endif
}
```

### Integration with SubtitleSystem

Send subtitle text as screen reader announcements:

```csharp
public class SubtitleSystem : MonoBehaviour
{
    public void DisplaySubtitle(string text)
    {
        // Existing subtitle display logic...

#if UNITY_2023_2_OR_NEWER
        // Also send to screen reader
        AssistiveSupport.notificationDispatcher?.SendAnnouncement(text);
#endif
    }
}
```

---

## Testing with Windows Screen Readers

### Complete Testing Workflow

#### 1. Prepare Your Build
```
File > Build Settings
Build your zSpace application (.exe)
```

#### 2. Test with Windows Narrator
```
1. Press Windows + Ctrl + Enter (enable Narrator)
2. Launch your zSpace .exe
3. Press Tab to navigate through UI
4. Verify each element is announced
5. Check labels are descriptive
6. Press Enter/Space to activate buttons
```

#### 3. Test with NVDA (Recommended)
```
1. Download NVDA: https://www.nvaccess.org/
2. Install and launch NVDA
3. Launch your zSpace application
4. Tab through all interactive elements
5. Verify:
   ✓ All buttons announced
   ✓ Labels are clear and descriptive
   ✓ Roles are correct (Button, Link, etc.)
   ✓ States are announced (checked, selected, etc.)
   ✓ Focus order is logical
```

#### 4. Accessibility Checklist
- [ ] All interactive elements have AccessibilityNode
- [ ] All nodes have descriptive labels (not "Button_01")
- [ ] All nodes have appropriate roles
- [ ] States update correctly (focused, selected, disabled)
- [ ] Tab order matches visual/spatial order
- [ ] Announcements sent for important actions
- [ ] Tested with NVDA or Narrator
- [ ] Accessibility Hierarchy Viewer shows all nodes

---

## Troubleshooting

### Issue: Screen Reader Not Announcing Elements

**Possible Causes:**
1. ❌ AccessibilityHierarchy not set as active
2. ❌ AccessibilityNodes not added to hierarchy
3. ❌ Testing in Unity Editor (build required)
4. ❌ Screen reader not enabled

**Solutions:**
```csharp
// Ensure hierarchy is active
AssistiveSupport.activeHierarchy = m_Hierarchy;

// Check if screen reader is enabled
if (AssistiveSupport.isScreenReaderEnabled)
{
    Debug.Log("Screen reader is active");
}
else
{
    Debug.LogWarning("Screen reader is not active. Enable NVDA or Narrator.");
}

// Verify nodes are added
if (m_Node != null)
{
    AssistiveSupport.activeHierarchy?.AddNode(m_Node);
}
```

### Issue: Accessibility Hierarchy Viewer is Empty

**Possible Causes:**
1. ❌ Not in Play Mode
2. ❌ No AccessibilityHierarchy created
3. ❌ Hierarchy not set as active

**Solutions:**
```csharp
// In your manager script Start() method:
void Start()
{
    m_Hierarchy = new AccessibilityHierarchy();
    AssistiveSupport.activeHierarchy = m_Hierarchy;
    Debug.Log("Accessibility hierarchy created and activated");
}
```

### Issue: Labels Not Descriptive

**Bad Examples:**
- ❌ "Button_01"
- ❌ "GameObject"
- ❌ "UI_Element"

**Good Examples:**
- ✅ "Start Game"
- ✅ "Rotate Heart Model"
- ✅ "Save Project"

**Fix:**
```csharp
// Always use descriptive labels
m_Node.label = "Start Game"; // NOT "Button_01"
m_Node.hint = "Begins the game simulation"; // Add helpful context
```

### Issue: Unity 2021.3/2022.3 Compatibility

**Problem:** Accessibility Module not available in older Unity versions

**Solution:** Conditional compilation
```csharp
#if UNITY_2023_2_OR_NEWER
    // Use Unity Accessibility Module
    private AccessibilityNode m_Node;
#else
    // Fallback for older Unity versions
    Debug.LogWarning("Accessibility Module requires Unity 2023.2+. Consider upgrading.");
#endif
```

---

## API Reference

### Quick Reference Links

**Unity 2023.2 Documentation:**
- Accessibility Module Manual: https://docs.unity3d.com/2023.2/Documentation/Manual/com.unity.modules.accessibility.html
- UnityEngine.AccessibilityModule API: https://docs.unity3d.com/2023.2/Documentation/ScriptReference/UnityEngine.AccessibilityModule.html
- AccessibilityHierarchy: https://docs.unity3d.com/2023.2/Documentation/ScriptReference/Accessibility.AccessibilityHierarchy.html
- AssistiveSupport: https://docs.unity3d.com/2023.2/Documentation/ScriptReference/Accessibility.AssistiveSupport.html

**Unity 6.0+ Documentation:**
- Accessibility for Unity applications: https://docs.unity3d.com/6000.0/Documentation/Manual/accessibility.html
- Mobile accessibility: https://docs.unity3d.com/6000.0/Documentation//Manual/mobile-accessibility.html
- AccessibilityNode: https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Accessibility.AccessibilityNode.html
- VisionUtility: https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Accessibility.VisionUtility.GetColorBlindSafePalette.html
- AccessibilitySettings: https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Accessibility.AccessibilitySettings.html

**Version-Agnostic (Latest):**
- VisionUtility: https://docs.unity3d.com/ScriptReference/Accessibility.VisionUtility.html

### Core Classes Summary

| Class | Purpose | Unity Version |
|-------|---------|---------------|
| `AccessibilityHierarchy` | Container for accessibility tree | 2023.2+ |
| `AccessibilityNode` | Individual UI element | 2023.2+ |
| `AssistiveSupport` | Screen reader integration | 2023.2+ |
| `AccessibilityRole` | Semantic roles (Button, Link, etc.) | 2023.2+ |
| `AccessibilityState` | Element states (Selected, Disabled, etc.) | 2023.2+ |
| `VisionUtility` | Color-blind safe palettes | 6.0+ |
| `AccessibilitySettings` | System accessibility preferences | 6.0+ |

---

## Next Steps

1. **Read the API Reference:** [`docs/unity-accessibility-api-reference.md`](unity-accessibility-api-reference.md)
2. **Follow Setup Guide:** [`examples/zspace-accessible-scene/UnityAccessibilitySetup.md`](../examples/zspace-accessible-scene/UnityAccessibilitySetup.md)
3. **Update Your Code:** Integrate `AccessibilityNode` into existing zSpace components
4. **Test with Screen Readers:** Download NVDA and test your built application
5. **Use Hierarchy Viewer:** Debug accessibility tree in Unity Editor (Window > Accessibility)

---

## Resources

**Unity Documentation:**
- Unity Accessibility Manual: https://docs.unity3d.com/Manual/com.unity.modules.accessibility.html
- What's New in Unity 2023.2: https://docs.unity3d.com/2023.2/Documentation/Manual/WhatsNew20232.html
- What's New in Unity 6.0: https://docs.unity3d.com/6000.0/Documentation/Manual/WhatsNewUnity6.html

**Screen Readers:**
- NVDA (Free, Windows): https://www.nvaccess.org/
- Windows Narrator: Built into Windows 10/11
- JAWS (Commercial): https://www.freedomscientific.com/products/software/jaws/

**zSpace Resources:**
- zSpace Developer Portal: https://developer.zspace.com/
- zSpace Unity SDK: https://developer.zspace.com/docs/

---

**Document Version:** 1.0
**Last Updated:** October 2025
**Maintainer:** accessibility-standards-unity project
**Repository:** https://github.com/jdonnelly-zspace/accessibility-standards-unity
