# Unity Accessibility Module Setup - zSpace Example Scene

Step-by-step guide to set up Unity Accessibility Module in a zSpace scene with complete screen reader support.

**Unity Version:** 2023.2+ (Accessibility Module required)

**Platform:** zSpace + Windows desktop screen readers (NVDA, Narrator, JAWS)

**WCAG 2.2 Level AA Compliance:**
- SC 4.1.2: Name, Role, Value (Level A)
- SC 4.1.3: Status Messages (Level AA)

**Time to Complete:** 20-30 minutes

---

## Prerequisites

- Unity 2023.2 or newer installed
- zSpace Unity SDK imported
- Basic zSpace scene with UI elements (buttons, toggles, etc.)
- Windows machine for screen reader testing

---

## Table of Contents

1. [Step 1: Add UnityAccessibilityIntegration Component](#step-1-add-unityaccessibilityintegration-component)
2. [Step 2: Register UI Buttons](#step-2-register-ui-buttons)
3. [Step 3: Register Toggles/Checkboxes](#step-3-register-togglescheckboxes)
4. [Step 4: Register Headings and Static Text](#step-4-register-headings-and-static-text)
5. [Step 5: Add Dynamic State Updates](#step-5-add-dynamic-state-updates)
6. [Step 6: Add Screen Reader Announcements](#step-6-add-screen-reader-announcements)
7. [Step 7: Validate with Hierarchy Viewer](#step-7-validate-with-hierarchy-viewer)
8. [Step 8: Build and Test with NVDA](#step-8-build-and-test-with-nvda)
9. [Step 9: Run Automated Tests](#step-9-run-automated-tests)
10. [Troubleshooting](#troubleshooting)
11. [Complete Example Scene](#complete-example-scene)

---

## Step 1: Add UnityAccessibilityIntegration Component

### 1.1 Create Accessibility Manager GameObject

1. In Unity Hierarchy, right-click → Create Empty
2. Rename to "AccessibilityManager"
3. In Inspector, click "Add Component"
4. Search for "UnityAccessibilityIntegration"
5. Click to add component

**File Location:** `implementation/unity/scripts/UnityAccessibilityIntegration.cs`

### 1.2 Configure Settings

In Inspector, configure UnityAccessibilityIntegration:

```
✅ Enable Accessibility (checked)
✅ Auto Initialize (checked)
✅ Debug Mode (checked) - Enable during development
✅ Log Announcements (checked) - Enable during development
☐ Use Color Blind Safe Palette - Unity 6.0+ only
```

**Inspector Screenshot:**
```
UnityAccessibilityIntegration
  [x] Enable Accessibility
  [x] Auto Initialize
  [x] Debug Mode
  [x] Log Announcements
  [ ] Use Color Blind Safe Palette
```

### 1.3 Verify Initialization

1. Enter Play Mode
2. Check Unity Console for:
   ```
   [UnityAccessibilityIntegration] Accessibility hierarchy initialized. Screen reader active: False
   ```
3. Note: `Screen reader active: False` is expected in Unity Editor (screen readers only work in built .exe)

---

## Step 2: Register UI Buttons

### 2.1 Create Accessible Button Script

**File:** `Assets/Scripts/AccessibleUIButton.cs`

```csharp
using UnityEngine;
using UnityEngine.UI;

#if UNITY_2023_2_OR_NEWER
using UnityEngine.Accessibility;
#endif

/// <summary>
/// Makes a Unity UI Button accessible to screen readers
/// </summary>
[RequireComponent(typeof(Button))]
public class AccessibleUIButton : MonoBehaviour
{
#if UNITY_2023_2_OR_NEWER
    [Header("Accessibility Settings")]
    [Tooltip("Label announced by screen readers (e.g., 'Start Simulation')")]
    [SerializeField] private string accessibleLabel = "Button";

    [Tooltip("Optional hint providing additional context")]
    [SerializeField] private string accessibleHint = "";

    [Tooltip("Announce button press to screen reader")]
    [SerializeField] private bool announceOnClick = true;

    [Tooltip("Custom announcement when clicked (if empty, uses '{label} activated')")]
    [SerializeField] private string clickAnnouncement = "";

    private AccessibilityNode node;
    private Button button;

    void Start()
    {
        button = GetComponent<Button>();
        RegisterAccessibilityNode();

        // Subscribe to button click
        if (announceOnClick)
        {
            button.onClick.AddListener(OnButtonClicked);
        }
    }

    void RegisterAccessibilityNode()
    {
        // Register button with UnityAccessibilityIntegration
        node = UnityAccessibilityIntegration.Instance.RegisterButton(
            gameObject,
            accessibleLabel,
            accessibleHint
        );

        Debug.Log($"[Accessibility] Registered button: '{accessibleLabel}'");
    }

    void OnButtonClicked()
    {
        // Announce button press to screen reader
        string announcement = string.IsNullOrEmpty(clickAnnouncement)
            ? $"{accessibleLabel} activated"
            : clickAnnouncement;

        UnityAccessibilityIntegration.Instance.SendAnnouncement(announcement);
    }

    void OnDestroy()
    {
        // Clean up accessibility node
        if (node != null)
        {
            UnityAccessibilityIntegration.Instance.UnregisterNode(gameObject);
        }

        if (button != null && announceOnClick)
        {
            button.onClick.RemoveListener(OnButtonClicked);
        }
    }
#endif
}
```

### 2.2 Add to Button GameObjects

For each button in your scene:

1. Select button GameObject in Hierarchy
2. In Inspector, click "Add Component"
3. Search for "AccessibleUIButton"
4. Click to add component
5. Configure:
   - **Accessible Label:** Descriptive label (e.g., "Start Simulation", "Settings Menu")
   - **Accessible Hint:** Optional context (e.g., "Begins the physics simulation")
   - **Announce On Click:** ✅ (checked)

**Example Configuration:**

```
GameObject: StartButton
  Button (Script)
  AccessibleUIButton (Script)
    Accessible Label: "Start Simulation"
    Accessible Hint: "Begins the physics simulation"
    Announce On Click: ✅
    Click Announcement: "Simulation started"
```

### 2.3 Test in Play Mode

1. Enter Play Mode
2. Check Console for:
   ```
   [Accessibility] Registered button: 'Start Simulation'
   [Accessibility] Registered button: 'Settings Menu'
   ```

---

## Step 3: Register Toggles/Checkboxes

### 3.1 Create Accessible Toggle Script

**File:** `Assets/Scripts/AccessibleUIToggle.cs`

```csharp
using UnityEngine;
using UnityEngine.UI;

#if UNITY_2023_2_OR_NEWER
using UnityEngine.Accessibility;
#endif

/// <summary>
/// Makes a Unity UI Toggle accessible to screen readers
/// </summary>
[RequireComponent(typeof(Toggle))]
public class AccessibleUIToggle : MonoBehaviour
{
#if UNITY_2023_2_OR_NEWER
    [Header("Accessibility Settings")]
    [Tooltip("Label announced by screen readers (e.g., 'Show Grid')")]
    [SerializeField] private string accessibleLabel = "Toggle";

    [Tooltip("Optional hint providing additional context")]
    [SerializeField] private string accessibleHint = "";

    private AccessibilityNode node;
    private Toggle toggle;

    void Start()
    {
        toggle = GetComponent<Toggle>();
        RegisterAccessibilityNode();

        // Subscribe to toggle value changes
        toggle.onValueChanged.AddListener(OnToggleChanged);
    }

    void RegisterAccessibilityNode()
    {
        // Register toggle with initial state
        node = UnityAccessibilityIntegration.Instance.RegisterToggle(
            gameObject,
            accessibleLabel,
            toggle.isOn,
            accessibleHint
        );

        Debug.Log($"[Accessibility] Registered toggle: '{accessibleLabel}' (checked: {toggle.isOn})");
    }

    void OnToggleChanged(bool isChecked)
    {
        // Update toggle state (automatically announces "checked"/"unchecked")
        UnityAccessibilityIntegration.Instance.UpdateToggleState(
            gameObject,
            isChecked
        );

        Debug.Log($"[Accessibility] Toggle '{accessibleLabel}' changed to: {(isChecked ? "checked" : "unchecked")}");
    }

    void OnDestroy()
    {
        // Clean up
        if (node != null)
        {
            UnityAccessibilityIntegration.Instance.UnregisterNode(gameObject);
        }

        if (toggle != null)
        {
            toggle.onValueChanged.RemoveListener(OnToggleChanged);
        }
    }
#endif
}
```

### 3.2 Add to Toggle GameObjects

For each toggle in your scene:

1. Select toggle GameObject in Hierarchy
2. In Inspector, click "Add Component"
3. Search for "AccessibleUIToggle"
4. Click to add component
5. Configure:
   - **Accessible Label:** Descriptive label (e.g., "Show Grid", "Enable Audio")
   - **Accessible Hint:** Optional context (e.g., "Toggles grid visibility")

**Example Configuration:**

```
GameObject: GridToggle
  Toggle (Script)
  AccessibleUIToggle (Script)
    Accessible Label: "Show Grid"
    Accessible Hint: "Toggles grid visibility in the scene"
```

---

## Step 4: Register Headings and Static Text

### 4.1 Create Accessible Text Script

**File:** `Assets/Scripts/AccessibleUIText.cs`

```csharp
using UnityEngine;
using UnityEngine.UI;
using TMPro;

#if UNITY_2023_2_OR_NEWER
using UnityEngine.Accessibility;
#endif

/// <summary>
/// Makes static text accessible to screen readers
/// </summary>
public class AccessibleUIText : MonoBehaviour
{
#if UNITY_2023_2_OR_NEWER
    [Header("Accessibility Settings")]
    [Tooltip("Accessible label (leave empty to use text content)")]
    [SerializeField] private string accessibleLabel = "";

    [Tooltip("Is this a heading? (Screen readers announce as 'heading')")]
    [SerializeField] private bool isHeading = false;

    private AccessibilityNode node;

    void Start()
    {
        RegisterAccessibilityNode();
    }

    void RegisterAccessibilityNode()
    {
        // Get label from Text or TextMeshPro component if not specified
        string label = accessibleLabel;
        if (string.IsNullOrEmpty(label))
        {
            var text = GetComponent<Text>();
            var tmpText = GetComponent<TextMeshProUGUI>();

            if (text != null)
                label = text.text;
            else if (tmpText != null)
                label = tmpText.text;
        }

        // Register as heading or static text
        if (isHeading)
        {
            node = UnityAccessibilityIntegration.Instance.RegisterHeading(
                gameObject,
                label
            );
            Debug.Log($"[Accessibility] Registered heading: '{label}'");
        }
        else
        {
            node = UnityAccessibilityIntegration.Instance.RegisterStaticText(
                gameObject,
                label
            );
            Debug.Log($"[Accessibility] Registered static text: '{label}'");
        }
    }

    void OnDestroy()
    {
        if (node != null)
        {
            UnityAccessibilityIntegration.Instance.UnregisterNode(gameObject);
        }
    }
#endif
}
```

### 4.2 Add to Text GameObjects

**For Headings (titles, section headers):**

1. Select text GameObject (e.g., "Settings Menu Title")
2. Add Component → "AccessibleUIText"
3. Configure:
   - **Accessible Label:** (leave empty to use text content)
   - **Is Heading:** ✅ (checked)

**For Static Text (labels, descriptions):**

1. Select text GameObject
2. Add Component → "AccessibleUIText"
3. Configure:
   - **Accessible Label:** (leave empty to use text content)
   - **Is Heading:** ☐ (unchecked)

---

## Step 5: Add Dynamic State Updates

### 5.1 Focus State Updates

Modify `AccessibleUIButton.cs` to track focus:

```csharp
using UnityEngine.EventSystems;

public class AccessibleUIButton : MonoBehaviour, IPointerEnterHandler, IPointerExitHandler
{
    public void OnPointerEnter(PointerEventData eventData)
    {
        // Set focus state when mouse hovers
        UnityAccessibilityIntegration.Instance.SetFocused(gameObject, true);
    }

    public void OnPointerExit(PointerEventData eventData)
    {
        // Clear focus state when mouse exits
        UnityAccessibilityIntegration.Instance.SetFocused(gameObject, false);
    }
}
```

### 5.2 Disabled State Updates

Add method to enable/disable buttons:

```csharp
public class AccessibleUIButton : MonoBehaviour
{
    public void SetButtonEnabled(bool enabled)
    {
        button.interactable = enabled;

        // Update accessibility state
        UnityAccessibilityIntegration.Instance.SetDisabled(gameObject, !enabled);
    }
}
```

---

## Step 6: Add Screen Reader Announcements

### 6.1 Game State Announcements

Add announcements for important events:

```csharp
using UnityEngine;

public class SimulationController : MonoBehaviour
{
    public void StartSimulation()
    {
        // Start simulation logic...

#if UNITY_2023_2_OR_NEWER
        // Announce to screen reader
        UnityAccessibilityIntegration.Instance.SendAnnouncement(
            "Simulation started"
        );
#endif
    }

    public void StopSimulation()
    {
        // Stop simulation logic...

#if UNITY_2023_2_OR_NEWER
        UnityAccessibilityIntegration.Instance.SendAnnouncement(
            "Simulation stopped"
        );
#endif
    }

    public void OnSimulationError(string errorMessage)
    {
#if UNITY_2023_2_OR_NEWER
        // Use isPolite=false to interrupt and announce error immediately
        UnityAccessibilityIntegration.Instance.SendAnnouncement(
            $"Error: {errorMessage}",
            isPolite: false
        );
#endif
    }
}
```

### 6.2 Progress Announcements

```csharp
public class ProgressTracker : MonoBehaviour
{
    public void OnProgressChanged(int percentage)
    {
#if UNITY_2023_2_OR_NEWER
        // Announce progress milestones
        if (percentage % 25 == 0)
        {
            UnityAccessibilityIntegration.Instance.SendAnnouncement(
                $"Progress: {percentage} percent complete"
            );
        }
#endif
    }
}
```

---

## Step 7: Validate with Hierarchy Viewer

### 7.1 Open Hierarchy Viewer

1. In Unity Editor, go to: **Window → Accessibility → Hierarchy**
2. Enter Play Mode
3. The Hierarchy Viewer window should populate with your AccessibilityNodes

### 7.2 Validate Node Properties

Expected hierarchy:
```
AccessibilityHierarchy (Active)
├─ Start Simulation (Button, None)
├─ Settings Menu (Button, None)
├─ Show Grid (Checkbox, Selected)
├─ Enable Audio (Checkbox, None)
├─ Settings Menu (Header, None)
└─ Instructions (StaticText, None)
```

### 7.3 Check for Issues

**Common Issues:**

❌ **Missing nodes** - Element not registered
- Fix: Add `AccessibleUIButton`, `AccessibleUIToggle`, or `AccessibleUIText` component

❌ **Empty labels** - Screen readers will be silent
- Fix: Set `accessibleLabel` in Inspector

❌ **Generic labels** ("Button", "Toggle")
- Fix: Use descriptive labels ("Start Simulation", "Show Grid")

❌ **Incorrect roles** - Button labeled as Checkbox
- Fix: Use correct script (AccessibleUIButton for buttons, AccessibleUIToggle for toggles)

❌ **States not updating** - Toggle checked but state shows None
- Fix: Ensure `toggle.onValueChanged.AddListener(OnToggleChanged)` is called

---

## Step 8: Build and Test with NVDA

### 8.1 Install NVDA

1. Download NVDA: https://www.nvaccess.org/
2. Install on Windows machine
3. Launch: **Ctrl + Alt + N**
4. Verify: NVDA voice announces "NVDA started"

### 8.2 Build Unity Application

1. In Unity: **File → Build Settings**
2. Platform: **Windows**
3. Architecture: **x86_64**
4. Click **Build**
5. Save to: `Builds/AccessibilityTest.exe`

**CRITICAL:** Screen readers ONLY work with built .exe applications. They do NOT work in Unity Editor Play Mode.

### 8.3 Test with NVDA

1. Launch NVDA (Ctrl + Alt + N)
2. Run built .exe application
3. Press **Tab** to navigate UI elements
4. Verify NVDA announces:
   - Element labels ("Start Simulation")
   - Element roles ("button", "checkbox")
   - Element states ("checked", "unchecked", "focused")

**Expected Announcements:**

| Action | NVDA Announces |
|--------|----------------|
| Tab to Start button | "Start Simulation, button" |
| Press Enter on button | "Simulation started" |
| Tab to Grid toggle | "Show Grid, checkbox, checked" |
| Press Space on toggle | "Show Grid, unchecked" |
| Tab to heading | "Settings Menu, heading" |

### 8.4 Test Checklist

- [ ] Tab navigates through all interactive elements
- [ ] NVDA announces button labels
- [ ] NVDA announces "button" role
- [ ] Pressing Enter activates buttons
- [ ] Button activation triggers announcements
- [ ] NVDA announces toggle labels
- [ ] NVDA announces "checkbox" role
- [ ] NVDA announces toggle state (checked/unchecked)
- [ ] Pressing Space toggles checkboxes
- [ ] Toggle state change triggers announcement
- [ ] Headings announced with "heading" role
- [ ] No silent elements (all have labels)

---

## Step 9: Run Automated Tests

### 9.1 Open Test Runner

1. In Unity Editor: **Window → General → Test Runner**
2. Select **PlayMode** tab

### 9.2 Run Unity Accessibility Tests

Expected tests (Unity 2023.2+):
```
Unity Accessibility Module Tests
  ✓ UnityAccessibilityIntegration_IsInitialized
  ✓ AccessibilityHierarchy_IsSetAsActive
  ✓ AllInteractiveElements_HaveAccessibilityNodes
  ✓ AccessibilityNodes_HaveDescriptiveLabels
  ✓ AccessibilityNodes_HaveCorrectRoles
  ✓ SendAnnouncement_FunctionExists
  ✓ ToggleStates_UpdateCorrectly
```

### 9.3 Fix Failing Tests

**If test fails:**

1. Read test failure message (provides fix instructions)
2. Identify missing/incorrect accessibility nodes
3. Add missing components or fix labels/roles
4. Re-run tests until all pass

**Example failure:**
```
AllInteractiveElements_HaveAccessibilityNodes (Failed)
Found 2 interactive element(s) without AccessibilityNodes:
  - Button 'SettingsButton'
  - Toggle 'AudioToggle'

Register nodes via:
  UnityAccessibilityIntegration.Instance.RegisterButton(gameObject, label, hint)
  UnityAccessibilityIntegration.Instance.RegisterToggle(gameObject, label, isChecked, hint)
```

**Fix:** Add `AccessibleUIButton` to SettingsButton, add `AccessibleUIToggle` to AudioToggle.

---

## Troubleshooting

### Screen Reader is Silent

**Problem:** NVDA/Narrator doesn't announce anything when pressing Tab

**Checklist:**
- [ ] Application is BUILT .exe (not Unity Editor Play Mode)
- [ ] NVDA/Narrator launched BEFORE running application
- [ ] UnityAccessibilityIntegration component in scene
- [ ] `enableAccessibility = true` in Inspector
- [ ] Unity version is 2023.2 or newer
- [ ] Accessibility nodes registered in Start()
- [ ] Console shows: `[UnityAccessibilityIntegration] Accessibility hierarchy initialized`

### Elements Not Appearing in Hierarchy Viewer

**Problem:** Hierarchy Viewer is empty or missing elements

**Checklist:**
- [ ] In Play Mode (Hierarchy Viewer only works in Play Mode)
- [ ] UnityAccessibilityIntegration.Instance.IsInitialized() returns true
- [ ] AccessibleUI* components added to GameObjects
- [ ] Start() methods called (check console logs)

### Generic Labels ("Button", "Toggle")

**Problem:** Screen reader announces "Button, button" instead of "Start Simulation, button"

**Fix:** Set descriptive `accessibleLabel` in Inspector:
- Good: "Start Simulation", "Settings Menu", "Show Grid"
- Bad: "Button", "Toggle", "GameObject", "btn_start"

### Toggle States Not Updating

**Problem:** Toggle state always shows "None" instead of "Selected"

**Fix:** Ensure `toggle.onValueChanged.AddListener(OnToggleChanged)` is called in Start()

### Build Errors (Unity 2021.3 / 2022.3)

**Problem:** Compilation errors about AccessibilityHierarchy not found

**Fix:** Unity Accessibility Module requires Unity 2023.2+. Upgrade Unity or use conditional compilation:

```csharp
#if UNITY_2023_2_OR_NEWER
using UnityEngine.Accessibility;
#endif
```

---

## Complete Example Scene

### Scene Hierarchy

```
Hierarchy
├─ AccessibilityManager (UnityAccessibilityIntegration)
├─ Canvas
│   ├─ MenuTitle (Text)
│   │   └─ AccessibleUIText (Is Heading: ✅)
│   ├─ StartButton (Button)
│   │   └─ AccessibleUIButton ("Start Simulation")
│   ├─ SettingsButton (Button)
│   │   └─ AccessibleUIButton ("Settings Menu")
│   ├─ GridToggle (Toggle)
│   │   └─ AccessibleUIToggle ("Show Grid")
│   ├─ AudioToggle (Toggle)
│   │   └─ AccessibleUIToggle ("Enable Audio")
│   └─ InstructionsText (Text)
│       └─ AccessibleUIText (Is Heading: ☐)
└─ ZSpace Core (zSpace SDK prefab)
```

### Expected Console Output (Play Mode)

```
[UnityAccessibilityIntegration] Accessibility hierarchy initialized. Screen reader active: False
[Accessibility] Registered heading: 'Settings Menu'
[Accessibility] Registered button: 'Start Simulation'
[Accessibility] Registered button: 'Settings Menu'
[Accessibility] Registered toggle: 'Show Grid' (checked: true)
[Accessibility] Registered toggle: 'Enable Audio' (checked: false)
[Accessibility] Registered static text: 'Use Tab to navigate UI elements'
```

### Expected NVDA Output (Built .exe)

```
User presses Tab:
  "Settings Menu, heading"

User presses Tab:
  "Start Simulation, button"

User presses Enter:
  "Simulation started"

User presses Tab:
  "Settings Menu, button"

User presses Tab:
  "Show Grid, checkbox, checked"

User presses Space:
  "Show Grid, unchecked"

User presses Tab:
  "Enable Audio, checkbox, unchecked"
```

---

## Next Steps

1. **Add keyboard navigation** - See `/implementation/unity/scripts/KeyboardStylusAlternative.cs`
2. **Add focus indicators** - See `/implementation/unity/scripts/ZSpaceFocusIndicator.cs`
3. **Add depth cues** - See `/implementation/unity/scripts/DepthCueManager.cs`
4. **Test with JAWS/Narrator** - Verify compatibility with other screen readers
5. **Run full accessibility audit** - Use `/standards/ZSPACE-ACCESSIBILITY-CHECKLIST.md`

---

## Related Documentation

- **API Reference:** `/docs/unity-accessibility-api-reference.md`
- **Setup Guide:** `/docs/unity-accessibility-integration.md`
- **Developer Workflow:** `/workflows/DEVELOPER-WORKFLOW.md`
- **QA Testing:** `/workflows/QA-WORKFLOW.md`
- **Checklist:** `/standards/ZSPACE-ACCESSIBILITY-CHECKLIST.md`

---

## Unity Documentation Links

- Accessibility Module: https://docs.unity3d.com/6000.0/Documentation/Manual/com.unity.modules.accessibility.html
- Hierarchy Viewer: https://docs.unity3d.com/6000.0/Documentation/Manual/accessibility.html
- Script Reference: https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Accessibility.AccessibilityHierarchy.html

---

**Last Updated:** October 2025
**Unity Version:** 2023.2+
**Platform:** zSpace + Windows
**Standards:** WCAG 2.2 Level AA
