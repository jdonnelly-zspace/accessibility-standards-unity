# Unity Accessibility Module API Reference

Complete API reference for Unity's Accessibility Module, integrated with the zSpace accessibility framework.

**Unity Version Requirements:**
- Unity 2023.2+ for AccessibilityHierarchy, AccessibilityNode, AssistiveSupport
- Unity 6.0+ for VisionUtility

**Platform Support:**
- Windows desktop screen readers (NVDA, Windows Narrator, JAWS)
- Requires built .exe application (does NOT work in Unity Editor Play Mode)

**WCAG Compliance:**
- SC 4.1.2: Name, Role, Value (Level A)
- SC 4.1.3: Status Messages (Level AA)

---

## Table of Contents

1. [UnityAccessibilityIntegration (Framework Script)](#unityaccessibilityintegration-framework-script)
2. [AccessibilityHierarchy (Unity API)](#accessibilityhierarchy-unity-api)
3. [AccessibilityNode (Unity API)](#accessibilitynode-unity-api)
4. [AssistiveSupport (Unity API)](#assistivesupport-unity-api)
5. [AccessibilityRole (Unity Enum)](#accessibilityrole-unity-enum)
6. [AccessibilityState (Unity Enum)](#accessibilitystate-unity-enum)
7. [VisionUtility (Unity 6.0+ API)](#visionutility-unity-60-api)
8. [Code Examples](#code-examples)
9. [Testing APIs](#testing-apis)

---

## UnityAccessibilityIntegration (Framework Script)

**Location:** `implementation/unity/scripts/UnityAccessibilityIntegration.cs`

**Purpose:** Singleton manager that integrates Unity Accessibility Module with zSpace applications.

### Public Properties

#### `enableAccessibility`
```csharp
public bool enableAccessibility = true;
```
- **Type:** bool
- **Default:** true
- **Description:** Enable Unity Accessibility Module integration. Requires Unity 2023.2+
- **Inspector:** Visible in Unity Inspector

#### `autoInitialize`
```csharp
public bool autoInitialize = true;
```
- **Type:** bool
- **Default:** true
- **Description:** Automatically create accessibility hierarchy on Start
- **Inspector:** Visible in Unity Inspector

#### `debugMode`
```csharp
public bool debugMode = false;
```
- **Type:** bool
- **Default:** false
- **Description:** Log accessibility events to console (useful for debugging)
- **Inspector:** Visible in Unity Inspector

#### `logAnnouncements`
```csharp
public bool logAnnouncements = false;
```
- **Type:** bool
- **Default:** false
- **Description:** Log all screen reader announcements to console
- **Inspector:** Visible in Unity Inspector

#### `useColorBlindSafePalette`
```csharp
public bool useColorBlindSafePalette = false;
```
- **Type:** bool
- **Default:** false
- **Description:** Automatically apply color-blind safe palette to UI elements (Unity 6.0+ only)
- **Inspector:** Visible in Unity Inspector

#### `Instance`
```csharp
public static UnityAccessibilityIntegration Instance { get; }
```
- **Type:** UnityAccessibilityIntegration (static singleton)
- **Description:** Global singleton instance for easy access
- **Usage:** `UnityAccessibilityIntegration.Instance.RegisterButton(...)`

---

### Public Methods

#### `InitializeAccessibility()`
```csharp
public void InitializeAccessibility()
```
- **Description:** Initialize the Unity Accessibility Module. Creates AccessibilityHierarchy and sets up event listeners.
- **WCAG:** SC 4.1.2 (Name, Role, Value - Level A)
- **Called:** Automatically on Awake if `autoInitialize = true`
- **Returns:** void
- **Side Effects:**
  - Creates new `AccessibilityHierarchy`
  - Sets `AssistiveSupport.activeHierarchy`
  - Registers `AssistiveSupport.screenReaderStatusChanged` event

**Example:**
```csharp
void Start()
{
    UnityAccessibilityIntegration.Instance.InitializeAccessibility();
}
```

---

#### `RegisterNode()`
```csharp
public AccessibilityNode RegisterNode(
    GameObject gameObject,
    string label,
    AccessibilityRole role,
    string hint = ""
)
```
- **Description:** Register an AccessibilityNode with the hierarchy
- **WCAG:** SC 4.1.2 (Name, Role, Value - Level A)
- **Parameters:**
  - `gameObject` - GameObject associated with this node
  - `label` - Accessible label (announced by screen readers). **Must not be empty.**
  - `role` - Semantic role (Button, Link, Heading, etc.)
  - `hint` - Optional hint for additional context (default: "")
- **Returns:** `AccessibilityNode` - The created node, or null if failed
- **Validation:**
  - Returns null if not initialized
  - Returns null if gameObject is null
  - Warns if label is empty
  - Updates existing node if gameObject already registered

**Example:**
```csharp
var node = UnityAccessibilityIntegration.Instance.RegisterNode(
    gameObject: myButton.gameObject,
    label: "Start Simulation",
    role: AccessibilityRole.Button,
    hint: "Begins the physics simulation"
);
```

---

#### `UnregisterNode()`
```csharp
public void UnregisterNode(GameObject gameObject)
```
- **Description:** Unregister an AccessibilityNode from the hierarchy
- **Parameters:**
  - `gameObject` - GameObject to unregister
- **Returns:** void
- **When to Use:** OnDestroy, when removing UI elements dynamically

**Example:**
```csharp
void OnDestroy()
{
    UnityAccessibilityIntegration.Instance.UnregisterNode(gameObject);
}
```

---

#### `GetNode()`
```csharp
public AccessibilityNode GetNode(GameObject gameObject)
```
- **Description:** Get the AccessibilityNode associated with a GameObject
- **Parameters:**
  - `gameObject` - GameObject to look up
- **Returns:** `AccessibilityNode` - The node, or null if not found

**Example:**
```csharp
var node = UnityAccessibilityIntegration.Instance.GetNode(myButton.gameObject);
if (node != null)
{
    Debug.Log($"Node label: {node.label}");
}
```

---

#### `UpdateNodeState()`
```csharp
public void UpdateNodeState(GameObject gameObject, AccessibilityState state)
```
- **Description:** Update the state of an AccessibilityNode
- **WCAG:** SC 4.1.2 (Name, Role, Value - Level A)
- **Parameters:**
  - `gameObject` - GameObject whose node to update
  - `state` - New accessibility state (Focused, Selected, Disabled, None)
- **Returns:** void
- **When to Use:** When element state changes (focused, selected, disabled)

**Example:**
```csharp
// On focus
UnityAccessibilityIntegration.Instance.UpdateNodeState(
    gameObject,
    AccessibilityState.Focused
);

// On blur
UnityAccessibilityIntegration.Instance.UpdateNodeState(
    gameObject,
    AccessibilityState.None
);
```

---

#### `SendAnnouncement()`
```csharp
public void SendAnnouncement(string message, bool isPolite = true)
```
- **Description:** Send an announcement to the screen reader
- **WCAG:** SC 4.1.3 (Status Messages - Level AA)
- **Parameters:**
  - `message` - Message to announce. **Must not be empty.**
  - `isPolite` - If true, waits for screen reader to finish current announcement. If false, interrupts. (default: true)
- **Returns:** void
- **When to Use:** Important events, state changes, confirmations, errors

**Example:**
```csharp
public void OnStartSimulation()
{
    StartSimulation();
    UnityAccessibilityIntegration.Instance.SendAnnouncement("Simulation started");
}

public void OnError(string error)
{
    UnityAccessibilityIntegration.Instance.SendAnnouncement(
        message: $"Error: {error}",
        isPolite: false  // Interrupt to announce error immediately
    );
}
```

---

#### `IsInitialized()`
```csharp
public bool IsInitialized()
```
- **Description:** Check if the accessibility system is initialized
- **Returns:** bool - true if initialized, false otherwise

**Example:**
```csharp
if (UnityAccessibilityIntegration.Instance.IsInitialized())
{
    RegisterAccessibilityNodes();
}
```

---

#### `IsScreenReaderActive()`
```csharp
public bool IsScreenReaderActive()
```
- **Description:** Check if a screen reader is currently active
- **Returns:** bool - true if screen reader is active, false otherwise
- **Note:** Only accurate in built .exe applications

**Example:**
```csharp
if (UnityAccessibilityIntegration.Instance.IsScreenReaderActive())
{
    // Provide additional screen reader hints
    EnableDetailedAnnouncements();
}
```

---

#### `GetHierarchy()`
```csharp
public AccessibilityHierarchy GetHierarchy()
```
- **Description:** Get the active accessibility hierarchy
- **Returns:** `AccessibilityHierarchy` - The hierarchy, or null if not initialized

---

#### `GetNodeCount()`
```csharp
public int GetNodeCount()
```
- **Description:** Get the total number of registered nodes
- **Returns:** int - Number of nodes, or 0 if not initialized

**Example:**
```csharp
int nodeCount = UnityAccessibilityIntegration.Instance.GetNodeCount();
Debug.Log($"Total accessibility nodes: {nodeCount}");
```

---

### Helper Methods (Convenience)

#### `RegisterButton()`
```csharp
public AccessibilityNode RegisterButton(
    GameObject gameObject,
    string label,
    string hint = ""
)
```
- **Description:** Helper method to register a button with standard accessibility settings
- **WCAG:** SC 4.1.2 (Name, Role, Value - Level A)
- **Returns:** `AccessibilityNode`

**Example:**
```csharp
var node = UnityAccessibilityIntegration.Instance.RegisterButton(
    startButton.gameObject,
    "Start Simulation",
    "Begins the physics simulation"
);
```

---

#### `RegisterToggle()`
```csharp
public AccessibilityNode RegisterToggle(
    GameObject gameObject,
    string label,
    bool isChecked,
    string hint = ""
)
```
- **Description:** Helper method to register a toggle/checkbox with standard accessibility settings
- **WCAG:** SC 4.1.2 (Name, Role, Value - Level A)
- **Parameters:**
  - `gameObject` - Toggle GameObject
  - `label` - Accessible label
  - `isChecked` - Initial checked state
  - `hint` - Optional hint
- **Returns:** `AccessibilityNode`
- **Sets:** `node.state = isChecked ? Selected : None`

**Example:**
```csharp
var node = UnityAccessibilityIntegration.Instance.RegisterToggle(
    gridToggle.gameObject,
    "Show Grid",
    isChecked: true,
    hint: "Toggles grid visibility"
);
```

---

#### `RegisterLink()`
```csharp
public AccessibilityNode RegisterLink(
    GameObject gameObject,
    string label,
    string hint = ""
)
```
- **Description:** Helper method to register a link with standard accessibility settings
- **Returns:** `AccessibilityNode`

---

#### `RegisterHeading()`
```csharp
public AccessibilityNode RegisterHeading(
    GameObject gameObject,
    string label
)
```
- **Description:** Helper method to register a heading with standard accessibility settings
- **Returns:** `AccessibilityNode`

**Example:**
```csharp
UnityAccessibilityIntegration.Instance.RegisterHeading(
    titleText.gameObject,
    "Settings Menu"
);
```

---

#### `RegisterStaticText()`
```csharp
public AccessibilityNode RegisterStaticText(
    GameObject gameObject,
    string label
)
```
- **Description:** Helper method to register static text with standard accessibility settings
- **Returns:** `AccessibilityNode`

---

#### `UpdateToggleState()`
```csharp
public void UpdateToggleState(GameObject gameObject, bool isChecked)
```
- **Description:** Update toggle state (convenience method)
- **WCAG:** SC 4.1.2 (Name, Role, Value - Level A)
- **Parameters:**
  - `gameObject` - Toggle GameObject
  - `isChecked` - New checked state
- **Side Effects:**
  - Updates node state (Selected or None)
  - Sends announcement: "{label} checked/unchecked"

**Example:**
```csharp
public void OnToggleChanged(bool isChecked)
{
    UnityAccessibilityIntegration.Instance.UpdateToggleState(
        gridToggle.gameObject,
        isChecked
    );
}
```

---

#### `SetFocused()`
```csharp
public void SetFocused(GameObject gameObject, bool isFocused)
```
- **Description:** Set focus state (convenience method)
- **Parameters:**
  - `gameObject` - GameObject to update
  - `isFocused` - true = Focused state, false = None state

---

#### `SetDisabled()`
```csharp
public void SetDisabled(GameObject gameObject, bool isDisabled)
```
- **Description:** Set disabled state (convenience method)
- **Parameters:**
  - `gameObject` - GameObject to update
  - `isDisabled` - true = Disabled state, false = None state

---

#### `GetColorBlindSafePalette()` (Unity 6.0+ Only)
```csharp
public Color[] GetColorBlindSafePalette(int paletteSize = 8)
```
- **Description:** Generate a color-blind safe color palette (Unity 6.0+ only)
- **Parameters:**
  - `paletteSize` - Number of colors to generate (default: 8)
- **Returns:** `Color[]` - Array of color-blind safe colors
- **Safe For:** Deuteranopia, protanopia, and tritanopia
- **Unity Version:** Requires Unity 6.0+

**Example:**
```csharp
#if UNITY_6000_0_OR_NEWER
Color[] palette = UnityAccessibilityIntegration.Instance.GetColorBlindSafePalette(8);
for (int i = 0; i < palette.Length; i++)
{
    categoryColors[i] = palette[i];
}
#endif
```

---

## AccessibilityHierarchy (Unity API)

**Namespace:** `UnityEngine.Accessibility`

**Unity Version:** 2023.2+

**Description:** Tree structure representing the accessibility hierarchy for screen reader navigation.

### Methods

#### `AddNode()`
```csharp
public void AddNode(AccessibilityNode node)
```
- **Description:** Add an AccessibilityNode to the hierarchy
- **Parameters:**
  - `node` - The node to add

---

#### `RemoveNode()`
```csharp
public void RemoveNode(AccessibilityNode node)
```
- **Description:** Remove an AccessibilityNode from the hierarchy
- **Parameters:**
  - `node` - The node to remove

---

**Unity Documentation:** https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Accessibility.AccessibilityHierarchy.html

---

## AccessibilityNode (Unity API)

**Namespace:** `UnityEngine.Accessibility`

**Unity Version:** 2023.2+

**Description:** Individual UI element representation for screen readers and assistive technologies.

### Properties

#### `label`
```csharp
public string label { get; set; }
```
- **Type:** string
- **Description:** Accessible label announced by screen readers
- **WCAG:** SC 4.1.2 (Name, Role, Value - Level A)
- **Requirements:**
  - Must not be empty
  - Must be descriptive (not generic like "Button")
  - Should be user-facing text

**Good Labels:**
- "Start Simulation"
- "Settings Menu"
- "Show Grid Toggle"

**Bad Labels:**
- "" (empty)
- "Button"
- "GameObject"
- "btn_start" (internal name)

---

#### `role`
```csharp
public AccessibilityRole role { get; set; }
```
- **Type:** `AccessibilityRole` (enum)
- **Description:** Semantic role of the element
- **WCAG:** SC 4.1.2 (Name, Role, Value - Level A)
- **Values:** See [AccessibilityRole](#accessibilityrole-unity-enum)

---

#### `state`
```csharp
public AccessibilityState state { get; set; }
```
- **Type:** `AccessibilityState` (enum)
- **Description:** Current state of the element
- **WCAG:** SC 4.1.2 (Name, Role, Value - Level A)
- **Values:** See [AccessibilityState](#accessibilitystate-unity-enum)

---

#### `hint`
```csharp
public string hint { get; set; }
```
- **Type:** string
- **Description:** Optional hint providing additional context
- **Example:** "Begins the physics simulation"

---

**Unity Documentation:** https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Accessibility.AccessibilityNode.html

---

## AssistiveSupport (Unity API)

**Namespace:** `UnityEngine.Accessibility`

**Unity Version:** 2023.2+

**Description:** Screen reader integration and status monitoring.

### Static Properties

#### `activeHierarchy`
```csharp
public static AccessibilityHierarchy activeHierarchy { get; set; }
```
- **Type:** `AccessibilityHierarchy`
- **Description:** The active accessibility hierarchy for screen readers
- **CRITICAL:** Must be set for screen readers to detect UI elements

**Example:**
```csharp
AccessibilityHierarchy hierarchy = new AccessibilityHierarchy();
AssistiveSupport.activeHierarchy = hierarchy;
```

---

#### `isScreenReaderEnabled`
```csharp
public static bool isScreenReaderEnabled { get; }
```
- **Type:** bool (read-only)
- **Description:** Check if a screen reader is currently active
- **Note:** Only accurate in built .exe applications (not Unity Editor)

**Example:**
```csharp
if (AssistiveSupport.isScreenReaderEnabled)
{
    Debug.Log("Screen reader is active");
}
```

---

#### `notificationDispatcher`
```csharp
public static AccessibilityNotificationDispatcher notificationDispatcher { get; }
```
- **Type:** `AccessibilityNotificationDispatcher` (read-only)
- **Description:** Dispatcher for sending announcements to screen readers
- **WCAG:** SC 4.1.3 (Status Messages - Level AA)

**Example:**
```csharp
var dispatcher = AssistiveSupport.notificationDispatcher;
if (dispatcher != null)
{
    dispatcher.SendAnnouncement("Simulation started");
}
```

---

### Static Events

#### `screenReaderStatusChanged`
```csharp
public static event Action<bool> screenReaderStatusChanged;
```
- **Type:** `Action<bool>`
- **Description:** Event fired when screen reader status changes
- **Parameter:** bool isEnabled - true if screen reader started, false if stopped

**Example:**
```csharp
void Awake()
{
    AssistiveSupport.screenReaderStatusChanged += OnScreenReaderStatusChanged;
}

void OnScreenReaderStatusChanged(bool isEnabled)
{
    Debug.Log($"Screen reader {(isEnabled ? "started" : "stopped")}");
}

void OnDestroy()
{
    AssistiveSupport.screenReaderStatusChanged -= OnScreenReaderStatusChanged;
}
```

---

**Unity Documentation:** https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Accessibility.AssistiveSupport.html

---

## AccessibilityRole (Unity Enum)

**Namespace:** `UnityEngine.Accessibility`

**Unity Version:** 2023.2+

**Description:** Semantic roles for UI elements.

### Values

| Role | Description | Use For | Screen Reader Announces |
|------|-------------|---------|------------------------|
| `Button` | Clickable button | Buttons, clickable icons | "button" |
| `Checkbox` | Toggle/checkbox | Toggles, checkboxes | "checkbox, checked/unchecked" |
| `Header` | Heading text | Section titles, headings | "heading" |
| `Link` | Hyperlink | Links, navigation items | "link" |
| `StaticText` | Non-interactive text | Labels, descriptions | (text only) |
| `Image` | Image element | Images, icons | "image" |
| `SearchField` | Search input | Search boxes | "search field" |
| `None` | No specific role | Generic containers | (no role announced) |

### Usage

```csharp
// Button
node.role = AccessibilityRole.Button;

// Toggle/Checkbox
node.role = AccessibilityRole.Checkbox;

// Heading
node.role = AccessibilityRole.Header;

// Static text
node.role = AccessibilityRole.StaticText;
```

---

## AccessibilityState (Unity Enum)

**Namespace:** `UnityEngine.Accessibility`

**Unity Version:** 2023.2+

**Description:** States for UI elements.

### Values

| State | Description | Use For | Screen Reader Announces |
|-------|-------------|---------|------------------------|
| `None` | Default state | Normal elements, unchecked toggles | (no state) |
| `Focused` | Element has focus | Currently focused element | "focused" |
| `Selected` | Element is selected | Checked toggles, selected items | "selected" or "checked" |
| `Disabled` | Element is disabled | Disabled buttons/inputs | "disabled" |

### Usage

```csharp
// Normal state
node.state = AccessibilityState.None;

// Focused
node.state = AccessibilityState.Focused;

// Selected/Checked
node.state = AccessibilityState.Selected;

// Disabled
node.state = AccessibilityState.Disabled;
```

### Toggle State Pattern

```csharp
// Unchecked toggle
node.role = AccessibilityRole.Checkbox;
node.state = AccessibilityState.None;
// Announces: "Show Grid, checkbox, unchecked"

// Checked toggle
node.role = AccessibilityRole.Checkbox;
node.state = AccessibilityState.Selected;
// Announces: "Show Grid, checkbox, checked"
```

---

## VisionUtility (Unity 6.0+ API)

**Namespace:** `UnityEngine.Accessibility`

**Unity Version:** 6.0+

**Description:** Vision accessibility utilities for color-blind safe palettes.

### Static Methods

#### `GetColorBlindSafePalette()`
```csharp
public static int GetColorBlindSafePalette(Color[] palette)
```
- **Description:** Generate color-blind safe color palette
- **Parameters:**
  - `palette` - Array to fill with colors (size determines number of colors)
- **Returns:** int - Number of distinct colors generated
- **Safe For:** Deuteranopia, protanopia, and tritanopia

**Example:**
```csharp
#if UNITY_6000_0_OR_NEWER
Color[] palette = new Color[8];
int distinctColors = VisionUtility.GetColorBlindSafePalette(palette);
Debug.Log($"Generated {distinctColors} distinct color-blind safe colors");
#endif
```

---

**Unity Documentation:** https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Accessibility.VisionUtility.GetColorBlindSafePalette.html

---

## Code Examples

### Complete Setup Example

```csharp
using UnityEngine;
#if UNITY_2023_2_OR_NEWER
using UnityEngine.Accessibility;
#endif

public class AccessibleMenu : MonoBehaviour
{
#if UNITY_2023_2_OR_NEWER
    [SerializeField] private GameObject startButton;
    [SerializeField] private GameObject gridToggle;
    [SerializeField] private GameObject titleText;

    void Start()
    {
        RegisterAccessibilityNodes();
    }

    void RegisterAccessibilityNodes()
    {
        var integration = UnityAccessibilityIntegration.Instance;

        // Register button
        integration.RegisterButton(
            startButton,
            "Start Simulation",
            "Begins the physics simulation"
        );

        // Register toggle
        var toggle = gridToggle.GetComponent<UnityEngine.UI.Toggle>();
        integration.RegisterToggle(
            gridToggle,
            "Show Grid",
            toggle.isOn,
            "Toggles grid visibility"
        );

        // Register heading
        integration.RegisterHeading(
            titleText,
            "Settings Menu"
        );
    }

    public void OnStartButtonPressed()
    {
        StartSimulation();

        // Announce action to screen reader
        UnityAccessibilityIntegration.Instance.SendAnnouncement(
            "Simulation started"
        );
    }

    public void OnGridToggleChanged(bool isChecked)
    {
        // Update toggle state (automatically announces "checked"/"unchecked")
        UnityAccessibilityIntegration.Instance.UpdateToggleState(
            gridToggle,
            isChecked
        );

        // Apply toggle
        SetGridVisible(isChecked);
    }

    void OnDestroy()
    {
        // Clean up nodes
        var integration = UnityAccessibilityIntegration.Instance;
        integration.UnregisterNode(startButton);
        integration.UnregisterNode(gridToggle);
        integration.UnregisterNode(titleText);
    }
#endif
}
```

---

### Dynamic Node Updates

```csharp
using UnityEngine;
#if UNITY_2023_2_OR_NEWER
using UnityEngine.Accessibility;
#endif

public class AccessibleButton : MonoBehaviour
{
#if UNITY_2023_2_OR_NEWER
    private AccessibilityNode node;

    void Start()
    {
        node = UnityAccessibilityIntegration.Instance.RegisterButton(
            gameObject,
            "Dynamic Button",
            "This button changes state"
        );
    }

    public void OnPointerEnter()
    {
        // Update state to Focused
        UnityAccessibilityIntegration.Instance.UpdateNodeState(
            gameObject,
            AccessibilityState.Focused
        );
    }

    public void OnPointerExit()
    {
        // Update state to None
        UnityAccessibilityIntegration.Instance.UpdateNodeState(
            gameObject,
            AccessibilityState.None
        );
    }

    public void SetEnabled(bool enabled)
    {
        // Update state to Disabled/None
        UnityAccessibilityIntegration.Instance.SetDisabled(
            gameObject,
            !enabled
        );
    }

    void OnDestroy()
    {
        UnityAccessibilityIntegration.Instance.UnregisterNode(gameObject);
    }
#endif
}
```

---

### Screen Reader Status Monitoring

```csharp
using UnityEngine;
#if UNITY_2023_2_OR_NEWER
using UnityEngine.Accessibility;
#endif

public class ScreenReaderMonitor : MonoBehaviour
{
#if UNITY_2023_2_OR_NEWER
    void Awake()
    {
        AssistiveSupport.screenReaderStatusChanged += OnScreenReaderStatusChanged;
    }

    void Start()
    {
        if (AssistiveSupport.isScreenReaderEnabled)
        {
            Debug.Log("Screen reader is active");
            EnableDetailedAnnouncements();
        }
    }

    void OnScreenReaderStatusChanged(bool isEnabled)
    {
        if (isEnabled)
        {
            Debug.Log("Screen reader started");
            EnableDetailedAnnouncements();

            UnityAccessibilityIntegration.Instance.SendAnnouncement(
                "Accessibility mode enabled"
            );
        }
        else
        {
            Debug.Log("Screen reader stopped");
            DisableDetailedAnnouncements();
        }
    }

    void EnableDetailedAnnouncements()
    {
        // Provide more detailed announcements when screen reader is active
    }

    void DisableDetailedAnnouncements()
    {
        // Reduce verbosity when screen reader is not active
    }

    void OnDestroy()
    {
        AssistiveSupport.screenReaderStatusChanged -= OnScreenReaderStatusChanged;
    }
#endif
}
```

---

## Testing APIs

See `implementation/unity/tests/ZSpaceAccessibilityTests.cs` for complete test examples.

### Test Example: Verify Node Registration

```csharp
#if UNITY_2023_2_OR_NEWER
using UnityEngine.Accessibility;
using NUnit.Framework;
using UnityEngine.TestTools;

[UnityTest]
public IEnumerator AllButtons_HaveAccessibilityNodes()
{
    var integration = UnityAccessibilityIntegration.Instance;
    yield return null;

    var buttons = Object.FindObjectsOfType<UnityEngine.UI.Button>();
    foreach (var button in buttons)
    {
        var node = integration.GetNode(button.gameObject);
        Assert.IsNotNull(node,
            $"Button '{button.gameObject.name}' missing AccessibilityNode");
    }
}
#endif
```

---

## Platform Notes

### Windows Desktop Screen Readers

**Supported:**
- NVDA (free, recommended)
- Windows Narrator (built-in)
- JAWS (commercial)

**Requirements:**
- Built .exe application (screen readers do NOT work in Unity Editor)
- Unity 2023.2 or newer
- Windows 10 or newer

**Testing Workflow:**
1. Build .exe application (File → Build Settings → Build)
2. Launch NVDA or Narrator BEFORE launching app
3. Run built .exe
4. Tab through UI - screen reader announces elements

---

## Version Support Matrix

| Unity Version | AccessibilityHierarchy | AccessibilityNode | AssistiveSupport | VisionUtility |
|---------------|------------------------|-------------------|------------------|---------------|
| 2021.3 LTS | ❌ | ❌ | ❌ | ❌ |
| 2022.3 LTS | ❌ | ❌ | ❌ | ❌ |
| 2023.2+ | ✅ | ✅ | ✅ | ❌ |
| Unity 6.0+ | ✅ | ✅ | ✅ | ✅ |

**Note:** Unity 2021.3 and 2022.3 do NOT have Unity Accessibility Module. Upgrade to Unity 2023.2+ for screen reader support.

---

## Related Documentation

- `/docs/unity-accessibility-integration.md` - Complete setup guide
- `/workflows/DEVELOPER-WORKFLOW.md` - Developer workflow integration
- `/workflows/QA-WORKFLOW.md` - Testing procedures
- `/standards/ZSPACE-ACCESSIBILITY-CHECKLIST.md` - Compliance checklist
- `/implementation/unity/scripts/UnityAccessibilityIntegration.cs` - Source code

---

**Unity Official Documentation:**
- Accessibility Module: https://docs.unity3d.com/6000.0/Documentation/Manual/com.unity.modules.accessibility.html
- AccessibilityHierarchy: https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Accessibility.AccessibilityHierarchy.html
- AccessibilityNode: https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Accessibility.AccessibilityNode.html
- AssistiveSupport: https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Accessibility.AssistiveSupport.html

---

**Last Updated:** October 2025
**Unity Versions:** 2023.2, Unity 6.0+
**Platform:** Windows desktop (zSpace)
**Standards:** WCAG 2.2 Level AA
