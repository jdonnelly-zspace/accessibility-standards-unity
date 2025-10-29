# Component-Level Accessibility Recommendations
## {{APP_NAME}}

**Generated:** {{AUDIT_DATE}}
**Framework:** accessibility-standards-unity {{FRAMEWORK_VERSION}}

---

## Overview

This report provides component-level accessibility recommendations organized by script path, issue severity, and specific code patterns detected. Use this guide to address accessibility issues at the code level.

**Total Findings:** {{TOTAL_FINDINGS}}
- Critical Issues: {{CRITICAL_COUNT}}
- High Priority Issues: {{HIGH_COUNT}}
- Medium Priority Issues: {{MEDIUM_COUNT}}
- Low Priority Issues: {{LOW_COUNT}}

---

## Table of Contents

1. [Keyboard Accessibility](#keyboard-accessibility)
2. [XR Input Alternatives](#xr-input-alternatives)
3. [UI Toolkit Accessibility](#ui-toolkit-accessibility)
4. [Screen Reader Support](#screen-reader-support)
5. [Focus Management](#focus-management)

---

## Keyboard Accessibility

### Detection Summary

{{#if KEYBOARD_SUPPORT_FOUND}}
✅ **Keyboard input patterns detected**

- **Input System:** {{KEYBOARD_INPUT_SYSTEM}}
- **EventSystem Configured:** {{#if KEYBOARD_EVENTSYSTEM}}Yes{{else}}No{{/if}}
- **Focus Management Found:** {{#if KEYBOARD_FOCUS_MGMT}}Yes{{else}}No{{/if}}
- **Confidence Score:** {{KEYBOARD_CONFIDENCE}}%

**Scripts with Keyboard Support ({{KEYBOARD_SUPPORT_SCRIPTS_COUNT}}):**
{{#each KEYBOARD_SUPPORT_SCRIPTS}}
- `{{path}}` (Confidence: {{confidence}}%)
  - Patterns: {{patterns}}
{{/each}}

{{else}}
❌ **No keyboard input patterns detected**

**Critical Issue:** Application appears to rely entirely on pointer/stylus input without keyboard alternatives.

**Impact:** Users who cannot use pointing devices (motor disabilities, limited dexterity, keyboard-only users) will be unable to access functionality.

**WCAG Violations:**
- 2.1.1 Keyboard (Level A)
- 2.1.2 No Keyboard Trap (Level A)
{{/if}}

### Recommendations

{{#if KEYBOARD_SUPPORT_FOUND}}
#### ✅ Positive Findings

Your application includes keyboard input handling. Continue to ensure all interactive elements are keyboard accessible.

{{#if KEYBOARD_EVENTSYSTEM}}
- EventSystem is configured, which enables UI keyboard navigation
{{/if}}

{{#if KEYBOARD_FOCUS_MGMT}}
- Focus management code detected, which helps with keyboard navigation flow
{{/if}}

#### ⚠️  Areas for Improvement

{{#if STYLUS_ONLY_SCRIPTS_COUNT}}
**{{STYLUS_ONLY_SCRIPTS_COUNT}} scripts use pointer/stylus input without keyboard alternatives:**

{{#each STYLUS_ONLY_SCRIPTS}}
- `{{path}}`
  - **Input Type:** {{inputType}}
  - **Recommendation:** Add keyboard event handlers alongside {{inputType}} input
  - **Example Fix:**
    ```csharp
    // Add keyboard alternative
    if (Input.GetKeyDown(KeyCode.Space) || stylusButton.pressed) {
        // Perform action
    }
    ```
{{/each}}
{{/if}}

{{else}}
#### 🚨 Critical: Implement Keyboard Support

**Step 1:** Choose an input system
- **Option A:** Legacy Input class (simpler, works with all Unity versions)
- **Option B:** New Input System (more flexible, Unity 2019.1+)

**Step 2:** Add keyboard input handling to interactive scripts

**Example using Legacy Input:**
```csharp
using UnityEngine;

public class MyInteractiveObject : MonoBehaviour
{
    void Update()
    {
        // Existing stylus/mouse input
        if (Input.GetMouseButtonDown(0))
        {
            OnInteract();
        }

        // ADD THIS: Keyboard alternative
        if (Input.GetKeyDown(KeyCode.Space) || Input.GetKeyDown(KeyCode.Return))
        {
            OnInteract();
        }
    }

    void OnInteract()
    {
        // Your interaction logic here
    }
}
```

**Example using New Input System:**
```csharp
using UnityEngine;
using UnityEngine.InputSystem;

public class MyInteractiveObject : MonoBehaviour
{
    public InputAction interactAction;

    void OnEnable()
    {
        interactAction.Enable();
        interactAction.performed += OnInteract;
    }

    void OnDisable()
    {
        interactAction.performed -= OnInteract;
        interactAction.Disable();
    }

    void OnInteract(InputAction.CallbackContext context)
    {
        // Your interaction logic here
    }
}
```

**Step 3:** Configure EventSystem for UI keyboard navigation
```csharp
// Attach to a UI Canvas or Manager object
using UnityEngine;
using UnityEngine.EventSystems;

public class KeyboardNavigationSetup : MonoBehaviour
{
    public GameObject firstSelected;

    void Start()
    {
        if (EventSystem.current != null && firstSelected != null)
        {
            EventSystem.current.SetSelectedGameObject(firstSelected);
        }
    }
}
```
{{/if}}

---

## XR Input Alternatives

### Detection Summary

{{#if XR_USED}}
✅ **XR patterns detected**

- **XR SDKs:** {{XR_SDKS}}
- **Input Methods:** {{XR_INPUT_METHODS}}
- **Alternative Inputs:** {{XR_ALTERNATIVE_INPUTS}}
- **Confidence Score:** {{XR_CONFIDENCE}}%

{{#if XR_MISSING_ALTERNATIVES_COUNT}}
⚠️  **{{XR_MISSING_ALTERNATIVES_COUNT}} input methods lack alternatives**

{{#each XR_MISSING_ALTERNATIVES}}
- **Primary Input:** {{primary}}
- **Required Alternatives:** {{required}}
- **WCAG Criteria:** {{wcag}}
{{/each}}
{{/if}}

{{else}}
ℹ️  **No XR-specific patterns detected**

This application does not appear to use VR/AR/MR SDKs.
{{/if}}

### Recommendations

{{#if XR_USED}}

{{#each XR_RECOMMENDATIONS}}
#### {{title}}

**Severity:** {{severity}}
**WCAG:** {{wcagCriteria}}

{{description}}

**Recommendation:**
{{recommendation}}

**Example Implementation:**
```csharp
{{codeExample}}
```
{{/each}}

{{else}}
No XR-specific recommendations needed for this project.
{{/if}}

---

## UI Toolkit Accessibility

### Detection Summary

{{#if UITOOLKIT_USED}}
✅ **UI Toolkit (UIElements) usage detected**

- **UXML Files:** {{UXML_FILES_COUNT}}
- **USS Files:** {{USS_FILES_COUNT}}
- **Focusable Elements Configured:** {{#if UITOOLKIT_FOCUSABLE}}Yes{{else}}No{{/if}}
- **Tab Order Configured:** {{#if UITOOLKIT_TABORDER}}Yes{{else}}No{{/if}}
- **Confidence Score:** {{UITOOLKIT_CONFIDENCE}}%

{{else}}
ℹ️  **UI Toolkit not detected**

This application appears to use UGUI (Unity UI) rather than UI Toolkit.
{{/if}}

### Recommendations

{{#if UITOOLKIT_USED}}

{{#if UITOOLKIT_FOCUSABLE}}
#### ✅ Focusable Elements Configured

Good! Interactive elements are configured as focusable.
{{else}}
#### ⚠️  Configure Focusable Elements

Interactive UI Toolkit elements need `focusable="true"` attribute.

**UXML Example:**
```xml
<ui:Button text="Click Me" focusable="true" />
<ui:TextField label="Name" focusable="true" />
<ui:Toggle label="Enable" focusable="true" />
```

**C# Example:**
```csharp
using UnityEngine.UIElements;

public class UISetup : MonoBehaviour
{
    void Start()
    {
        var root = GetComponent<UIDocument>().rootVisualElement;

        var button = root.Q<Button>("myButton");
        button.focusable = true;

        var textField = root.Q<TextField>("myTextField");
        textField.focusable = true;
    }
}
```
{{/if}}

{{#if UITOOLKIT_TABORDER}}
#### ✅ Tab Order Configured

Good! Tab navigation order is defined.
{{else}}
#### ⚠️  Define Tab Order

Set `tabIndex` to control keyboard navigation order.

**UXML Example:**
```xml
<ui:Button text="First" focusable="true" tab-index="0" />
<ui:Button text="Second" focusable="true" tab-index="1" />
<ui:Button text="Third" focusable="true" tab-index="2" />
```

**C# Example:**
```csharp
button1.tabIndex = 0;
button2.tabIndex = 1;
button3.tabIndex = 2;
```
{{/if}}

#### USS Focus Styles

Ensure focus indicators are visible by styling `:focus` pseudo-class:

**USS Example:**
```css
Button:focus {
    border-color: #4A90E2;
    border-width: 2px;
    background-color: rgba(74, 144, 226, 0.1);
}

TextField:focus {
    border-color: #4A90E2;
    border-width: 2px;
}

Toggle:focus Label {
    color: #4A90E2;
}
```

{{else}}
No UI Toolkit recommendations needed for this project.
{{/if}}

---

## Screen Reader Support

### Detection Summary

{{#if SCREEN_READER_SUPPORT_FOUND}}
✅ **Screen reader support patterns detected**

Scripts with potential assistive technology API usage: {{SCREEN_READER_SUPPORT_SCRIPTS_COUNT}}

{{else}}
❌ **No screen reader support patterns detected**

**Impact:** Users who rely on assistive technologies (screen readers, voice control) will be unable to access UI element names, roles, and states.

**WCAG Violations:**
- 4.1.2 Name, Role, Value (Level A)
{{/if}}

### Recommendations

{{#if SCREEN_READER_SUPPORT_FOUND}}
Continue to ensure UI elements expose accessible names and roles to assistive technologies.

**Manual Testing Required:**
- Test with NVDA (Windows)
- Test with Narrator (Windows)
- Verify all interactive elements are announced correctly
- Verify dynamic content updates are announced

{{else}}
#### 🚨 Implement Assistive Technology API

Unity 2023.2+ includes Accessibility API for screen reader support.

**Check Unity Version:**
```csharp
// In Unity 2023.2+, add UnityEngine.Accessibility namespace
#if UNITY_2023_2_OR_NEWER
using UnityEngine.Accessibility;
#endif
```

**Example: Accessible Button**
```csharp
using UnityEngine;
#if UNITY_2023_2_OR_NEWER
using UnityEngine.Accessibility;
#endif
using UnityEngine.UI;

public class AccessibleButton : MonoBehaviour
{
    public Button button;
    public string accessibleLabel = "Submit Button";
    public string accessibleHint = "Submits the form";

    void Start()
    {
#if UNITY_2023_2_OR_NEWER
        var node = gameObject.AddComponent<AccessibilityNode>();
        node.label = accessibleLabel;
        node.hint = accessibleHint;
        node.role = AccessibilityRole.Button;
        node.isActive = true;

        button.onClick.AddListener(() => {
            // Announce action to screen reader
            AccessibilityManager.Announce("Form submitted");
        });
#endif
    }
}
```

**For Unity versions < 2023.2:**
Consider using third-party accessibility plugins or implementing custom solutions.
{{/if}}

---

## Focus Management

### Detection Summary

{{#if FOCUS_INDICATORS_FOUND}}
✅ **Focus indicator patterns detected**

Your application includes focus management code.

{{else}}
❌ **No focus indicator patterns detected**

**Impact:** Keyboard users won't know which element currently has focus.

**WCAG Violations:**
- 2.4.7 Focus Visible (Level AA)
{{/if}}

### Recommendations

{{#if FOCUS_INDICATORS_FOUND}}
Ensure focus indicators are:
- **Visible:** High contrast (3:1 minimum)
- **Consistent:** Same style across all elements
- **Clear:** Obvious boundary or highlight

**Manual Testing Required:**
- Tab through all interactive elements
- Verify focus indicator is visible at each step
- Test with high contrast mode

{{else}}
#### 🚨 Implement Focus Indicators

**Option 1: Visual Focus Indicator Component**

```csharp
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.EventSystems;

[RequireComponent(typeof(Selectable))]
public class FocusIndicator : MonoBehaviour, ISelectHandler, IDeselectHandler
{
    public GameObject focusOutline;
    public Color focusColor = new Color(0.29f, 0.56f, 0.89f, 1f); // #4A90E2

    void Start()
    {
        if (focusOutline == null)
        {
            // Create focus outline if not assigned
            focusOutline = new GameObject("FocusOutline");
            var outline = focusOutline.AddComponent<Outline>();
            outline.effectColor = focusColor;
            outline.effectDistance = new Vector2(2, 2);
            focusOutline.transform.SetParent(transform);
            focusOutline.SetActive(false);
        }
    }

    public void OnSelect(BaseEventData eventData)
    {
        if (focusOutline != null)
            focusOutline.SetActive(true);
    }

    public void OnDeselect(BaseEventData eventData)
    {
        if (focusOutline != null)
            focusOutline.SetActive(false);
    }
}
```

**Option 2: EventSystem-Based Focus Manager**

```csharp
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;

public class FocusManager : MonoBehaviour
{
    private GameObject lastSelected;
    public Color focusColor = new Color(0.29f, 0.56f, 0.89f, 1f);

    void Update()
    {
        var currentSelected = EventSystem.current?.currentSelectedGameObject;

        if (currentSelected != lastSelected)
        {
            // Remove highlight from last selected
            if (lastSelected != null)
            {
                RemoveHighlight(lastSelected);
            }

            // Add highlight to current selected
            if (currentSelected != null)
            {
                AddHighlight(currentSelected);
            }

            lastSelected = currentSelected;
        }
    }

    void AddHighlight(GameObject obj)
    {
        var outline = obj.GetComponent<Outline>();
        if (outline == null)
        {
            outline = obj.AddComponent<Outline>();
        }
        outline.effectColor = focusColor;
        outline.effectDistance = new Vector2(2, 2);
        outline.enabled = true;
    }

    void RemoveHighlight(GameObject obj)
    {
        var outline = obj.GetComponent<Outline>();
        if (outline != null)
        {
            outline.enabled = false;
        }
    }
}
```

**Testing:**
1. Add FocusIndicator component to all Buttons, Toggles, InputFields
2. Or add FocusManager component to a manager GameObject
3. Press Tab key to navigate
4. Verify focus outline appears around selected element
{{/if}}

---

## Summary

**Total Recommendations:** {{TOTAL_FINDINGS}}

### Critical Priority (Fix Immediately)
{{#each CRITICAL_ISSUES}}
- {{title}} (`{{id}}`)
{{/each}}

### High Priority (Fix Soon)
{{#each HIGH_ISSUES}}
- {{title}} (`{{id}}`)
{{/each}}

### Medium Priority (Address in Sprint)
{{#each MEDIUM_ISSUES}}
- {{title}} (`{{id}}`)
{{/each}}

### Low Priority (Future Enhancement)
{{#each LOW_ISSUES}}
- {{title}} (`{{id}}`)
{{/each}}

---

## Testing Checklist

After implementing recommendations:

### Keyboard Testing
- [ ] Tab through all interactive elements
- [ ] Verify focus indicator is visible
- [ ] Press Enter/Space on focused elements to activate
- [ ] Test arrow key navigation (if applicable)
- [ ] Verify no keyboard traps exist

### Screen Reader Testing (Unity 2023.2+)
- [ ] Launch NVDA or Narrator
- [ ] Verify UI element names are announced
- [ ] Verify interactive element roles are announced ("button", "text field", etc.)
- [ ] Verify state changes are announced (checked/unchecked, expanded/collapsed)
- [ ] Test dynamic content updates

### XR Input Testing
- [ ] Test with primary input method (stylus, hand tracking, gaze)
- [ ] Test with alternative input method (keyboard, gamepad, voice)
- [ ] Verify all interactions work with both methods
- [ ] Test spatial audio alternatives (captions, visual indicators)
- [ ] Test depth perception alternatives (if stereoscopic)

### Focus Management Testing
- [ ] Verify focus starts on a logical element
- [ ] Verify focus order follows visual layout
- [ ] Verify focus restoration after modal dialogs
- [ ] Verify focus doesn't get lost
- [ ] Test with keyboard only (no mouse)

---

## Resources

- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [Unity Accessibility API Documentation](https://docs.unity3d.com/2023.2/Documentation/ScriptReference/Accessibility.html)
- [Unity Input System Documentation](https://docs.unity3d.com/Packages/com.unity.inputsystem@latest)
- [Manual Review Guide](../docs/MANUAL-REVIEW-GUIDE.md)

---

**Generated by:** accessibility-standards-unity v{{FRAMEWORK_VERSION}}
**For support:** https://github.com/zSpace/accessibility-standards-unity/issues
