# QA Workflow - zSpace Accessibility Testing

This guide shows QA engineers how to test zSpace Unity applications for accessibility compliance using automated Unity tests, manual hardware testing, and desktop screen reader testing.

**Target Platform:** zSpace (stereoscopic 3D desktop + stylus + tracked glasses)
**Testing Environment:** Unity Editor + zSpace hardware + Windows desktop

---

## Quick Reference

**Test Coverage Required:**
1. ✅ Unity Test Framework tests (automated)
2. ✅ Keyboard-only testing (no stylus)
3. ✅ Desktop screen reader testing (NVDA, Narrator, JAWS)
4. ✅ Depth perception alternatives testing (glasses off)
5. ✅ zSpace hardware testing (stylus + keyboard dual input)

**Target Scores:**
- Unity Test Framework: **All tests pass**
- Manual keyboard checklist: **100% pass**
- Desktop screen reader: **100% pass**
- Depth alternatives: **Works without 3D glasses**

---

## Unity Accessibility Module Testing (Unity 2023.2+)

**For Unity 2023.2 or newer projects using Unity Accessibility Module:**

This section covers testing procedures specific to Unity's official Accessibility APIs. If your project uses Unity 2021.3 or 2022.3, skip to "Testing Workflow" section below.

### Unity Accessibility Hierarchy Viewer Testing

**Purpose:** Validate AccessibilityNode structure in Unity Editor before building for screen readers.

**How to Access:**
```
Window → Accessibility → Hierarchy
```

**When to Use:**
- During development - validate nodes before building
- After adding new UI elements
- When debugging screen reader issues
- Before QA submission

#### Hierarchy Viewer Test Checklist

**Basic Validation:**
- [ ] Hierarchy viewer opens without errors
- [ ] All interactive UI elements appear in hierarchy
- [ ] All 3D interactive objects appear in hierarchy
- [ ] Node count matches expected interactive elements

**Node Properties Validation:**

For each AccessibilityNode in the hierarchy:

- [ ] **Label** - Not empty, describes element clearly
  - Good: "Start Simulation Button"
  - Bad: "Button", "GameObject", ""
- [ ] **Role** - Appropriate semantic role set
  - Buttons → `AccessibilityRole.Button`
  - Toggles → `AccessibilityRole.Checkbox`
  - Headings → `AccessibilityRole.Header`
  - Static text → `AccessibilityRole.StaticText`
  - Links → `AccessibilityRole.Link`
- [ ] **Hint** - Provides additional context if needed
  - Example: "Starts the physics simulation"
- [ ] **State** - Correct current state
  - Focused elements → `AccessibilityState.Focused`
  - Selected toggles → `AccessibilityState.Selected`
  - Disabled elements → `AccessibilityState.Disabled`

**Test Procedure:**

```
Test: Validate AccessibilityNode Configuration
1. Window → Accessibility → Hierarchy
2. Play the scene
3. Navigate to first interactive element (Tab or click)
4. In Hierarchy Viewer, find corresponding node
5. Verify:
   ✅ Label is descriptive (not empty)
   ✅ Role matches element type (Button, Checkbox, etc.)
   ✅ Hint provides context (if needed)
   ✅ State reflects current state (Focused, Selected, etc.)
6. Repeat for all interactive elements

Pass Criteria:
✅ All interactive elements registered in hierarchy
✅ All labels descriptive and unique
✅ All roles semantically correct
✅ States update dynamically during interaction
```

**Common Issues Found in Hierarchy Viewer:**

```
Issue: Node missing from hierarchy
Cause: AccessibilityManager.RegisterNode() not called
Fix: Add registration in Start() or OnEnable()

Issue: Empty label
Cause: RegisterNode() called with label = ""
Fix: Provide descriptive label string

Issue: Generic label ("Button", "Object")
Cause: Using GameObject.name instead of descriptive label
Fix: Use user-facing text (e.g., "Start Simulation" not "StartButton")

Issue: State not updating
Cause: UpdateNodeState() not called on state change
Fix: Call UpdateNodeState() in event handlers
```

**Screenshot Example:**

The Hierarchy Viewer should show:
```
AccessibilityHierarchy (Active)
├─ Start Simulation Button (Button, Focused)
├─ Settings Menu (Button, None)
├─ Show Grid Toggle (Checkbox, Selected)
├─ Volume Slider (Slider, None)
└─ Instructions (Header, None)
```

### Unity Accessibility Module Screen Reader Testing

**CRITICAL:** Unity Accessibility Module screen reader support requires **built .exe applications**. Screen readers do NOT work in Unity Editor Play Mode.

#### Build and Test Workflow

**Step 1: Build Unity Application**

```
1. File → Build Settings
2. Platform: Windows
3. Architecture: x86_64
4. Click "Build"
5. Save to: Builds/AccessibilityTest.exe
```

**Step 2: Launch Screen Reader**

**Option A: NVDA (Recommended)**
```
1. Download from https://www.nvaccess.org/
2. Install NVDA
3. Launch: Ctrl + Alt + N
4. Verify: NVDA voice announces "NVDA started"
```

**Option B: Windows Narrator (Built-in)**
```
1. Press: Win + Ctrl + Enter
2. Verify: Narrator voice announces "Narrator on"
```

**Step 3: Test Built Application**

```
Test: Unity Accessibility Module Screen Reader Integration
1. Launch NVDA or Narrator
2. Run built .exe (NOT Unity Editor)
3. Press Tab to navigate UI
4. Verify: Screen reader announces each element

Expected Announcements:
• "Start Simulation, button"
• "Settings Menu, button"
• "Show Grid, checkbox, checked"
• "Volume Slider, slider, 50 percent"

Code Requirements:
✓ UnityAccessibilityIntegration component in scene
✓ AssistiveSupport.activeHierarchy set
✓ All UI elements registered via RegisterNode()
✓ AccessibilityRole set correctly
```

**Automated Test Cases:**

```
Test: AccessibilityNode Registration
1. Launch built application with NVDA running
2. Tab to "Start Button"
3. Verify NVDA announces: "Start Simulation, button"
4. Press Enter to activate
5. Verify NVDA announces: "Simulation started" (via SendAnnouncement)

Pass Criteria:
✅ Button label announced correctly
✅ Button role announced ("button")
✅ Activation triggers announcement
✅ No lag in screen reader response

Fail Indicators:
❌ Screen reader silent on Tab
❌ Only announces "button" without label
❌ Announces GameObject name instead of label
❌ No announcement on activation
```

```
Test: Checkbox State Announcements
1. Tab to "Show Grid" toggle
2. Verify NVDA announces: "Show Grid, checkbox, checked"
3. Press Space to toggle
4. Verify NVDA announces: "Show Grid, unchecked"
5. Press Space again
6. Verify NVDA announces: "Show Grid, checked"

Pass Criteria:
✅ Checkbox role announced
✅ State announced ("checked" / "unchecked")
✅ State updates announced on change
✅ Uses AccessibilityState.Selected correctly

Code Pattern:
// Initial registration
var node = accessibilityManager.RegisterToggle(gameObject, "Show Grid", isChecked);

// On toggle change
accessibilityManager.UpdateToggleState(gameObject, newCheckedState);
```

```
Test: SendAnnouncement() for Actions
1. With NVDA running, click "Start Simulation" button
2. Verify NVDA announces: "Simulation started"
3. Click "Stop" button
4. Verify NVDA announces: "Simulation stopped"

Pass Criteria:
✅ Custom announcements triggered by actions
✅ Announcements clear and descriptive
✅ No excessive announcements (spam)

Code Pattern:
public void OnStartSimulation()
{
    StartSimulation();
    UnityAccessibilityIntegration.Instance.SendAnnouncement("Simulation started");
}
```

**Unity Accessibility Module Debug Checklist:**

If screen reader is silent:
- [ ] Check: Application is BUILT .exe (not Editor Play Mode)
- [ ] Check: Screen reader is running BEFORE launching app
- [ ] Check: `UnityAccessibilityIntegration` component in scene
- [ ] Check: `AssistiveSupport.activeHierarchy` is set
- [ ] Check: Debug mode enabled to see console logs
- [ ] Check: `AssistiveSupport.isScreenReaderEnabled` returns true
- [ ] Verify: Nodes registered via `RegisterNode()` or helper methods
- [ ] Verify: Unity version is 2023.2 or newer

**Unity Console Debug Output (when debugMode = true):**
```
[UnityAccessibilityIntegration] Accessibility hierarchy initialized. Screen reader active: True
[UnityAccessibilityIntegration] Registered node: 'Start Simulation' (Button) for GameObject 'StartButton'
[UnityAccessibilityIntegration] Registered node: 'Show Grid' (Checkbox) for GameObject 'GridToggle'
[UnityAccessibilityIntegration] Updated state for 'GridToggle': Selected
[UnityAccessibilityIntegration] Announcement sent: "Simulation started"
```

### Unity Accessibility Module Automated Testing

**Add to Unity Test Framework tests:**

```csharp
#if UNITY_2023_2_OR_NEWER
using UnityEngine.Accessibility;
using NUnit.Framework;
using UnityEngine;
using UnityEngine.TestTools;
using System.Collections;

public class UnityAccessibilityModuleTests
{
    [UnityTest]
    public IEnumerator AccessibilityIntegration_IsInitialized()
    {
        // Find UnityAccessibilityIntegration in scene
        var integration = Object.FindObjectOfType<UnityAccessibilityIntegration>();
        Assert.IsNotNull(integration, "UnityAccessibilityIntegration component not found in scene");

        yield return null; // Wait one frame for Awake/Start

        Assert.IsTrue(integration.IsInitialized(),
            "Unity Accessibility Module not initialized. Check enableAccessibility and autoInitialize settings.");
    }

    [UnityTest]
    public IEnumerator AccessibilityHierarchy_IsActive()
    {
        var integration = Object.FindObjectOfType<UnityAccessibilityIntegration>();
        yield return null;

        var hierarchy = integration.GetHierarchy();
        Assert.IsNotNull(hierarchy, "AccessibilityHierarchy is null");
        Assert.AreEqual(AssistiveSupport.activeHierarchy, hierarchy,
            "AccessibilityHierarchy not set as active hierarchy for screen readers");
    }

    [UnityTest]
    public IEnumerator AllInteractiveElements_HaveAccessibilityNodes()
    {
        var integration = Object.FindObjectOfType<UnityAccessibilityIntegration>();
        yield return null;

        // Find all interactive elements (buttons, toggles, etc.)
        var buttons = Object.FindObjectsOfType<UnityEngine.UI.Button>();
        var toggles = Object.FindObjectsOfType<UnityEngine.UI.Toggle>();

        int expectedNodes = buttons.Length + toggles.Length;
        int actualNodes = integration.GetNodeCount();

        Assert.GreaterOrEqual(actualNodes, expectedNodes,
            $"Expected at least {expectedNodes} AccessibilityNodes for {buttons.Length} buttons and {toggles.Length} toggles. " +
            $"Found {actualNodes}. Register nodes via RegisterButton() or RegisterToggle().");
    }

    [UnityTest]
    public IEnumerator AccessibilityNodes_HaveDescriptiveLabels()
    {
        var integration = Object.FindObjectOfType<UnityAccessibilityIntegration>();
        yield return null;

        var buttons = Object.FindObjectsOfType<UnityEngine.UI.Button>();
        foreach (var button in buttons)
        {
            var node = integration.GetNode(button.gameObject);
            Assert.IsNotNull(node, $"Button '{button.gameObject.name}' has no AccessibilityNode registered");
            Assert.IsFalse(string.IsNullOrEmpty(node.label),
                $"Button '{button.gameObject.name}' has empty accessibility label. Screen readers will not announce it.");
            Assert.AreNotEqual("Button", node.label,
                $"Button '{button.gameObject.name}' has generic label 'Button'. Use descriptive label instead.");
        }
    }

    [UnityTest]
    public IEnumerator AccessibilityNodes_HaveCorrectRoles()
    {
        var integration = Object.FindObjectOfType<UnityAccessibilityIntegration>();
        yield return null;

        var buttons = Object.FindObjectsOfType<UnityEngine.UI.Button>();
        foreach (var button in buttons)
        {
            var node = integration.GetNode(button.gameObject);
            if (node != null)
            {
                Assert.AreEqual(AccessibilityRole.Button, node.role,
                    $"Button '{button.gameObject.name}' has incorrect role. Expected Button, got {node.role}");
            }
        }

        var toggles = Object.FindObjectsOfType<UnityEngine.UI.Toggle>();
        foreach (var toggle in toggles)
        {
            var node = integration.GetNode(toggle.gameObject);
            if (node != null)
            {
                Assert.AreEqual(AccessibilityRole.Checkbox, node.role,
                    $"Toggle '{toggle.gameObject.name}' has incorrect role. Expected Checkbox, got {node.role}");
            }
        }
    }
}
#endif
```

**Add to Unity Test Runner:**
```
1. Window → General → Test Runner
2. Select "PlayMode" tab
3. Verify new tests appear:
   • AccessibilityIntegration_IsInitialized
   • AccessibilityHierarchy_IsActive
   • AllInteractiveElements_HaveAccessibilityNodes
   • AccessibilityNodes_HaveDescriptiveLabels
   • AccessibilityNodes_HaveCorrectRoles
4. Click "Run All"
5. Verify: All Unity Accessibility tests pass
```

---

## Testing Workflow

### Phase 1: Automated Unity Testing (Every Build)

#### Run Unity Test Framework Tests

**In Unity Editor:**
```
1. Window → General → Test Runner
2. Select "PlayMode" tab
3. Click "Run All"
4. Verify all tests pass
```

**Expected Results:**
- ✅ All accessibility tests pass
- ✅ Stylus + keyboard alternatives verified
- ✅ Depth perception alternatives verified
- ✅ Minimum target sizes verified (24x24px)
- ✅ Screen reader compatibility verified

**Unity Test Categories:**
```
✓ Input Alternatives
  - Stylus Button 0 has keyboard alternative
  - Stylus Button 1 has keyboard alternative
  - Stylus Button 2 has keyboard alternative
  - Mouse can replace stylus pointing

✓ Depth Perception
  - Application runs without stereoscopic 3D
  - Depth cues provided (size, shadow, audio, haptic)
  - All objects have shadows enabled

✓ Target Sizes
  - All UI buttons ≥ 24x24 pixels
  - All 3D object colliders appropriately sized

✓ Screen Reader
  - All UI elements have accessible labels
  - AccessibilityManager nodes registered
```

**If Tests Fail:**
1. Review test failure details in Unity console
2. Identify which component failed
3. Check Unity scene for missing accessibility components
4. Create bug with Unity Editor screenshot
5. Link to WCAG criterion violated

---

### Phase 2: Keyboard-Only Testing (Every Feature)

**CRITICAL:** All stylus interactions must have keyboard alternatives.

#### Keyboard Testing Checklist

**Setup:**
1. **Disconnect zSpace stylus** (or set aside)
2. Launch Unity application (Play mode or build)
3. Use keyboard and mouse only
4. **Do NOT use stylus at all during this test**

**Navigation:**
- [ ] Press Tab - focus moves to first interactive element
- [ ] Continue Tab - focus cycles through all UI elements in logical order
- [ ] Press Shift+Tab - focus moves backward
- [ ] Focus indicator clearly visible in 3D space (emissive glow, outline)
- [ ] No keyboard traps (can always Tab away)

**zSpace Input Alternatives:**
- [ ] **Spacebar** activates primary action (Stylus Button 0 alternative)
- [ ] **E key** activates secondary action (Stylus Button 1 alternative)
- [ ] **R key** activates tertiary action (Stylus Button 2 alternative)
- [ ] **Mouse** can replace stylus pointing (raycast/selection)
- [ ] **Arrow keys** can navigate menus/lists
- [ ] **Escape key** closes all menus/modals

**Interactive Elements:**
- [ ] Enter key activates buttons
- [ ] Space bar activates buttons
- [ ] All 3D objects selectable via Tab + Spacebar
- [ ] All UI buttons ≥ 24x24 pixels (desktop standard)
- [ ] Focus indicators visible in stereoscopic 3D view

**Test Cases:**

```
Test: 3D Object Selection (Keyboard Only)
1. Launch application
2. Disconnect stylus
3. Press Tab → Focus moves to first 3D object (blue glow appears)
4. Press Tab repeatedly → Focus cycles through all interactive objects
5. Press Spacebar on focused object → Object selected (green highlight)
6. Verify: Can complete all tasks without stylus

Pass Criteria:
✅ All 3D objects reachable via Tab
✅ Spacebar selects/activates objects
✅ Focus indicator visible (emissive glow)
✅ No stylus required
```

```
Test: Menu Navigation (Keyboard Only)
1. Press M key → Menu opens
2. Press Arrow keys → Navigate menu items
3. Press Enter → Activate menu item
4. Press Escape → Menu closes
5. Verify: All menu functions accessible via keyboard

Pass Criteria:
✅ Menu opens with M key (or mapped key)
✅ Arrow keys navigate all items
✅ Enter activates selections
✅ Escape closes menu
```

```
Test: 3D Object Manipulation (Keyboard Only)
1. Tab to 3D object
2. Press Spacebar → Select object
3. Press Q/E keys → Rotate object left/right
4. Press +/- keys → Scale object
5. Press Arrow keys → Move object
6. Press R key → Reset object
7. Verify: All manipulation via keyboard

Pass Criteria:
✅ Q/E rotates object
✅ +/- scales object
✅ Arrows move object
✅ R resets to default
```

**Bug Report Template:**
```
Title: [Action] not accessible via keyboard
Description: Stylus interaction has no keyboard alternative
Steps to Reproduce:
1. Disconnect zSpace stylus
2. Navigate to [object/UI element]
3. Attempt to [action] using keyboard
Expected: [Action] completes via Spacebar/E/R key
Actual: No keyboard alternative exists
WCAG Criterion: 2.1.1 Keyboard (Level A)
Platform: zSpace (Unity)
Severity: Critical (P0)
Screenshots: [Unity Editor + Game view]
```

---

### Phase 3: Desktop Screen Reader Testing (Major Features)

**CRITICAL:** Test with Windows desktop screen readers (NOT mobile screen readers).

#### NVDA (Free, Recommended for QA)

**Download:** https://www.nvaccess.org/

**Installation:**
1. Download NVDA installer
2. Install on Windows test machine
3. Launch NVDA (Ctrl + Alt + N)

**Basic Navigation:**
- **NVDA + Down Arrow:** Read next line
- **NVDA + Up Arrow:** Read previous line
- **Tab:** Move to next interactive element
- **H:** Next heading
- **B:** Next button
- **NVDA + T:** Read window title

*NVDA = Insert or Caps Lock key*

**Test Checklist:**
- [ ] Unity application window title announced
- [ ] Tab through UI - all buttons announced with labels
- [ ] Menu items announced (e.g., "Audio Settings, menu item 1 of 3")
- [ ] Button roles announced (e.g., "Start Simulation, button")
- [ ] Toggle states announced (e.g., "Show Grid, toggle, checked")
- [ ] Focus changes announced
- [ ] Actions announced (e.g., "Button activated")

**Unity Accessibility API Test:**
```
Test: Screen Reader Announces UI Elements
1. Launch NVDA (Ctrl + Alt + N)
2. Launch Unity application
3. Press Tab to navigate UI
4. Verify: NVDA announces each element

Expected Announcements:
• "Start Button, button"
• "Settings Menu, button"
• "Volume Slider, slider, 75%"
• "Mute, toggle, unchecked"

Code Requirements:
✓ AccessibilityManager.RegisterNode(gameObject, label, role)
✓ AccessibilityManager.Announce(message) for actions
```

---

#### Windows Narrator (Built-in, Alternative)

**Enable:**
- **Win + Ctrl + Enter:** Start Narrator

**Basic Navigation:**
- **Tab:** Move to next element
- **Caps Lock + Right Arrow:** Next item
- **Caps Lock + T:** Read window title
- **Caps Lock + Enter:** Activate item

**Same test checklist as NVDA applies**

---

#### JAWS (Commercial, Optional)

**Note:** JAWS is commercial ($1,000+) but industry standard. Test if available.

**Basic Navigation:**
- **Insert + T:** Read window title
- **Tab:** Move to next element
- **Insert + Down Arrow:** Read all

**Same test checklist as NVDA applies**

---

**Example Test Case:**
```
Test: Settings Menu Screen Reader Compatibility
1. Launch NVDA
2. Launch Unity application
3. Press M key → Settings menu opens
4. Verify NVDA announces: "Settings menu opened, 3 items"
5. Press Down Arrow → Navigate menu
6. Verify NVDA announces: "Audio Settings, menu item 1 of 3"
7. Press Down Arrow again
8. Verify NVDA announces: "Graphics Settings, menu item 2 of 3"

Pass Criteria:
✅ Menu open/close announced
✅ Menu items announced with labels
✅ Item position announced ("1 of 3")
✅ Roles announced ("menu item", "button")
```

---

### Phase 4: Depth Perception Alternatives Testing (CRITICAL)

**Problem:** 10-15% of users cannot perceive stereoscopic 3D.

**Test Requirement:** Application must function WITHOUT zSpace glasses.

#### Test Procedure: Glasses Off

**Setup:**
1. Launch Unity application on zSpace hardware
2. **Remove zSpace glasses** (do not wear them)
3. View application in 2D mode (no stereoscopic depth)
4. Complete all application tasks

**Test Checklist:**
- [ ] **Application runs** without zSpace glasses on
- [ ] All 3D objects visible in 2D view
- [ ] Depth information conveyed via **size cues** (closer = larger)
- [ ] Depth information conveyed via **shadows** (distance from surface)
- [ ] Depth information conveyed via **occlusion** (objects overlap correctly)
- [ ] Depth information conveyed via **spatial audio** (closer = louder)
- [ ] Depth information conveyed via **haptic feedback** (closer = stronger vibration)
- [ ] All tasks completable without stereoscopic 3D

**Test Cases:**

```
Test: 3D Object Depth Perception (No Glasses)
1. Remove zSpace glasses
2. View 3D scene in 2D (flat)
3. Identify which objects are closer/farther
4. Verify: Can determine depth via non-stereoscopic cues

Depth Cues to Verify:
✅ Closer objects appear larger
✅ Farther objects appear smaller
✅ Objects cast shadows showing distance
✅ Front objects occlude (hide) back objects
✅ Audio cues indicate distance (louder = closer)
✅ Haptic vibration varies (stronger = closer)

Pass Criteria:
✅ Depth is perceivable without stereoscopic 3D
✅ All 6 depth cues present
✅ Application fully functional in 2D
```

```
Test: Complete Task Without Glasses
1. Remove zSpace glasses
2. Perform primary application task (e.g., molecule assembly)
3. Use keyboard/mouse only (no stylus)
4. Verify: Task completable in 2D mode

Pass Criteria:
✅ Task can be completed without stereoscopic 3D
✅ No critical information lost
✅ Depth alternatives sufficient
```

**Common Violations:**
- Objects have NO size variation (all same size regardless of depth)
- No shadows enabled (cannot see distance from surface)
- No spatial audio (cannot hear depth)
- No haptic depth cues
- Application assumes stereoscopic 3D vision

**Bug Report Template:**
```
Title: No depth perception alternatives for [object/scene]
Description: Application relies solely on stereoscopic 3D for depth
Steps to Reproduce:
1. Remove zSpace glasses
2. View application in 2D (no stereoscopic depth)
3. Attempt to determine object depth/distance
Expected: Depth perceivable via size, shadow, audio, haptic cues
Actual: No non-stereoscopic depth cues provided
WCAG Criterion: W3C XAUR (XR Accessibility) - Depth Alternatives
Platform: zSpace
Severity: Critical (P0) - 10-15% of users affected
Screenshots: [Scene with glasses off]
```

---

### Phase 5: zSpace Hardware Testing (Full Integration)

**Test with actual zSpace hardware:**

#### Stylus + Keyboard Dual Input

**Test Pattern:**
```
For Each Interactive Element:
1. Test with stylus (point + Button 0)
2. Test with keyboard (Tab + Spacebar)
3. Test with mouse (click)
4. Verify: All three methods work identically

Pass Criteria:
✅ Stylus works
✅ Keyboard works
✅ Mouse works
✅ Same result for all three methods
```

**Stylus Button Mapping Test:**
```
Test: Stylus Button Alternatives
1. Point stylus at 3D object
2. Press Stylus Button 0 → Primary action
3. Verify: Same as Spacebar

4. Press Stylus Button 1 → Secondary action
5. Verify: Same as E key

6. Press Stylus Button 2 → Tertiary action
7. Verify: Same as R key

Pass Criteria:
✅ Button 0 = Spacebar
✅ Button 1 = E key
✅ Button 2 = R key
✅ All mappings documented
```

#### Haptic Feedback Testing

**Test:**
- [ ] Stylus vibrates on button press (30-50% intensity, 50-100ms)
- [ ] Haptic intensity varies with 3D object depth (closer = stronger)
- [ ] Haptic feedback enhances accessibility (not distracting)
- [ ] Haptic patterns consistent across similar interactions

**Test Case:**
```
Test: Haptic Depth Cues
1. Select 3D object close to camera
2. Verify: Strong vibration (50% intensity)
3. Select 3D object far from camera
4. Verify: Weak vibration (20% intensity)

Pass Criteria:
✅ Haptic intensity correlates with depth
✅ Provides depth cue for non-stereoscopic users
```

---

### Phase 6: Unity Editor Validation

#### Unity Console Checks

**Before Build:**
- [ ] No accessibility-related errors in Unity console
- [ ] All AccessibilityManager warnings resolved
- [ ] No missing accessibility labels
- [ ] No missing colliders on interactive objects

**Common Warnings:**
```
Warning: GameObject 'Button' has no AccessibilityNode registered
Fix: Add AccessibilityManager.RegisterNode() in Start()

Warning: Interactive object has collider smaller than 24x24 pixels
Fix: Increase BoxCollider size to meet minimum target size

Warning: No keyboard alternative specified for stylus interaction
Fix: Add keyboard input check in Update()
```

---

### Phase 7: Color Contrast Testing (Unity UI)

#### WebAIM Contrast Checker

**URL:** https://webaim.org/resources/contrastchecker/

**Process:**
1. Screenshot Unity UI (Canvas elements)
2. Use color picker to identify text/background colors
3. Enter colors in WebAIM Contrast Checker
4. Verify ratios:
   - **4.5:1** minimum for normal text
   - **3:1** minimum for large text (≥ 18pt)
   - **3:1** minimum for UI components (borders, icons)

**Unity UI Elements to Test:**
- [ ] Button text on button background
- [ ] Menu text on menu background
- [ ] HUD text on HUD background
- [ ] Focus indicators on object backgrounds
- [ ] Error messages on backgrounds
- [ ] Tooltip text on tooltip background

**Example:**
```
Element: Start Button
Text Color: #FFFFFF (white)
Background Color: #2196F3 (blue)
Contrast Ratio: 4.68:1
Result: ✅ Pass (≥ 4.5:1 for normal text)
```

---

## Test Scenarios Library

### Startup & Main Menu
```
✓ Application launches without errors
✓ Main menu accessible via keyboard
✓ Screen reader announces menu options
✓ Focus indicator visible on menu items
✓ All menu buttons ≥ 24x24 pixels
✓ Keyboard navigation (Tab, Enter, Escape)
✓ Works without zSpace glasses
```

### 3D Object Interaction
```
✓ Objects selectable via Tab + Spacebar
✓ Objects selectable via stylus Button 0
✓ Objects selectable via mouse click
✓ Focus indicator visible (emissive glow)
✓ Haptic feedback on selection
✓ Screen reader announces object name
✓ Depth perceivable without stereoscopic 3D (size, shadow, audio)
```

### Settings Menu
```
✓ Menu opens via keyboard (M key or mapped key)
✓ Arrow keys navigate menu items
✓ Screen reader announces all options
✓ Toggle states announced (checked/unchecked)
✓ Slider values announced ("Volume 75%")
✓ Changes saved and persist
✓ Escape closes menu
```

### Tutorial/Instructions
```
✓ Text readable from 24-30 inches
✓ Font size ≥ 14pt
✓ Contrast ratio ≥ 4.5:1
✓ Screen reader reads all instructions
✓ Can skip tutorial via Escape key
✓ Instructions reference both stylus AND keyboard
```

---

## WCAG 2.2 Specific Testing (zSpace Context)

### SC 2.1.1: Keyboard (Level A) - CRITICAL

**zSpace Requirement:** All stylus functionality available via keyboard.

**Test:**
1. Disconnect stylus
2. Complete entire application using keyboard only
3. Verify: All features accessible

**Pass Criteria:**
- ✅ Stylus Button 0 → Spacebar
- ✅ Stylus Button 1 → E key
- ✅ Stylus Button 2 → R key
- ✅ Stylus pointing → Mouse/Tab navigation

---

### SC 2.4.7: Focus Visible (Level AA) - CRITICAL in 3D

**zSpace Requirement:** Focus visible in stereoscopic 3D space.

**Test:**
1. Tab through all interactive elements
2. Verify: Focus indicator clearly visible in 3D
3. Check: Focus indicator has 3:1 contrast

**Pass Criteria:**
- ✅ Emissive glow OR outline shader applied
- ✅ Focus color: Blue/Yellow (high contrast)
- ✅ Visible from all viewing angles
- ✅ Contrast ≥ 3:1 vs background

---

### SC 2.5.8: Target Size (Minimum) (Level AA)

**zSpace Requirement:** Desktop standard (24x24px, NOT 44px VR)

**Test:**
1. Measure all UI buttons in Unity Editor
2. Check RectTransform dimensions
3. Verify: width ≥ 24px AND height ≥ 24px

**Unity Measurement:**
```
In Unity Editor:
1. Select UI button
2. Inspector → RectTransform
3. Check Width and Height
4. Verify: Both ≥ 24 pixels

For 3D Objects:
1. Select object
2. Inspector → BoxCollider
3. Check Size dimensions
4. At 1 unit distance: Size ≥ 0.5 x 0.5 units
```

**Pass Criteria:**
- ✅ All UI buttons ≥ 24x24 pixels
- ✅ All 3D object colliders appropriately sized
- ✅ Not using VR 44px standard (oversized for desktop)

---

### W3C XAUR: Depth Perception Alternatives - CRITICAL

**zSpace Requirement:** Works without stereoscopic 3D (10-15% can't perceive it)

**Test:**
1. Remove zSpace glasses
2. View application in 2D
3. Verify: Depth still perceivable

**Depth Cues Required:**
- ✅ Size (closer = larger)
- ✅ Shadow (distance from surface)
- ✅ Occlusion (layering)
- ✅ Spatial audio (louder = closer)
- ✅ Haptic feedback (stronger = closer)
- ✅ Motion parallax (objects move relative to viewpoint)

---

## Bug Severity Guidelines (zSpace)

**Critical (P0) - Blocks 10-15% of users:**
- No keyboard alternative to stylus interaction (WCAG 2.1.1)
- No depth perception alternatives (W3C XAUR)
- Application requires stereoscopic 3D vision
- Screen reader cannot access critical UI
- Keyboard trap (cannot escape)

**High (P1) - Significant barrier:**
- Missing accessible labels on UI elements
- Focus indicators not visible in 3D space
- Target sizes < 24x24 pixels
- Contrast ratio < 4.5:1 on text
- Haptic feedback missing

**Medium (P2) - Usability issue:**
- Inconsistent keyboard mappings
- Focus indicator low contrast (but still visible)
- Missing depth cues (but some present)
- Generic accessible labels

**Low (P3) - Enhancement:**
- Haptic feedback could be stronger
- Additional keyboard shortcuts desired
- Minor contrast issues on non-essential text

---

## Tools Reference

**Unity Testing:**
- Unity Test Framework (Window → General → Test Runner)
- Unity Console (errors, warnings)
- Unity Profiler (performance testing)
- **Unity Accessibility Hierarchy Viewer (Unity 2023.2+):** Window → Accessibility → Hierarchy
  - Validates AccessibilityNode structure in Editor
  - Shows labels, roles, states, hints for all registered nodes
  - Use BEFORE building to verify screen reader compatibility
- **Unity Accessibility Module (Unity 2023.2+):** com.unity.modules.accessibility
  - AccessibilityHierarchy, AccessibilityNode, AssistiveSupport APIs
  - Screen reader integration for Windows (NVDA, Narrator, JAWS)
  - Requires built .exe applications (does NOT work in Editor Play Mode)

**Desktop Screen Readers:**
- NVDA (free): https://www.nvaccess.org/
- Windows Narrator (built-in): Win + Ctrl + Enter
- JAWS (commercial): https://www.freedomscientific.com/

**Manual Testing:**
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- Keyboard only (disconnect stylus)
- zSpace hardware (stylus, glasses)
- Color blindness simulator

**Documentation:**
- `/standards/ZSPACE-ACCESSIBILITY-CHECKLIST.md` - Complete checklist
- `/standards/XR-ACCESSIBILITY-REQUIREMENTS.md` - zSpace requirements
- `/standards/WCAG-2.2-LEVEL-AA.md` - WCAG 2.2 standards

---

## Reporting

### Test Report Template

```markdown
# zSpace Accessibility Test Report

**Date:** YYYY-MM-DD
**Tester:** [Name]
**Build:** [Unity version / Build number]
**Platform:** zSpace + Unity [version]
**Scenes Tested:** [List]

## Automated Testing (Unity Test Framework)

| Test Category | Result |
|---------------|--------|
| Input Alternatives | ✅ All pass (5/5) |
| Depth Perception | ✅ All pass (3/3) |
| Target Sizes | ✅ All pass (2/2) |
| Screen Reader | ✅ All pass (4/4) |

## Manual Testing

| Test | Result | Issues |
|------|--------|--------|
| Keyboard-Only (No Stylus) | ✅ Pass | - |
| Desktop Screen Reader (NVDA) | ✅ Pass | - |
| Depth Alternatives (No Glasses) | ✅ Pass | - |
| zSpace Hardware (Stylus + Keyboard) | ✅ Pass | - |
| Color Contrast | ✅ Pass | - |
| Haptic Feedback | ⚠️ Partial | Issue #45 |

## zSpace-Specific Tests

| Test | Result |
|------|--------|
| Works without stereoscopic 3D | ✅ Pass |
| Stylus Button 0 = Spacebar | ✅ Pass |
| Stylus Button 1 = E key | ✅ Pass |
| Stylus Button 2 = R key | ✅ Pass |
| Focus visible in 3D space | ✅ Pass |
| Depth cues (size, shadow, audio, haptic) | ⚠️ 5/6 (Issue #46) |

## Issues Found

### Issue #45: Haptic feedback too weak on menu selection
- **Severity:** P2 (Medium)
- **WCAG:** N/A (usability)
- **Scene:** MainMenu
- **Description:** Stylus vibration barely noticeable when selecting menu items
- **Steps to Reproduce:**
  1. Point stylus at menu button
  2. Press Button 0
  3. Vibration barely felt
- **Expected:** 30-50% vibration intensity, 100ms
- **Actual:** ~10% intensity, 50ms
- **Fix:** Increase ZCore.VibrateStylus() intensity parameter

### Issue #46: Spatial audio depth cue missing
- **Severity:** P1 (High) - 10-15% of users affected
- **WCAG:** W3C XAUR - Depth Alternatives
- **Scene:** Simulation
- **Description:** 3D objects have no spatial audio to indicate depth
- **Steps to Reproduce:**
  1. Remove zSpace glasses (2D view)
  2. Select 3D objects at varying depths
  3. No audio volume change based on distance
- **Expected:** AudioSource volume varies with depth (louder = closer)
- **Actual:** All objects same volume
- **Fix:** Add AudioSource with distance attenuation to all interactive objects

## Compliance Status

**WCAG 2.2 Level AA:** Partial Conformance (pending Issues #45, #46)
**W3C XAUR (zSpace-adapted):** Partial Conformance (pending Issue #46)

**Next Steps:**
1. Fix Issue #46 (High priority - depth alternatives)
2. Fix Issue #45 (Medium priority - haptic)
3. Re-test affected scenes
4. Full compliance expected after fixes
```

---

**Last Updated:** October 2025
**Platform:** zSpace + Unity 2021.3+
**Standards:** WCAG 2.2 Level AA + W3C XAUR (zSpace-adapted)
