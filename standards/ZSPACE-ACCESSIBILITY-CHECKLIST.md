# zSpace Accessibility Checklist

**Complete WCAG 2.2 Level AA + W3C XAUR Checklist for Unity zSpace Applications**

**Version:** 2.0
**Last Updated:** October 2025
**Platform:** zSpace (stereoscopic 3D display + tracked glasses + stylus)
**Standards:** WCAG 2.2 Level AA + W3C XAUR (adapted for zSpace desktop environment)

---

## How to Use This Checklist

This checklist combines:
- **WCAG 2.2 Level AA** (57 success criteria) adapted for zSpace desktop applications
- **W3C XAUR** (XR Accessibility User Requirements) adapted for stereoscopic 3D
- **zSpace-Specific Requirements** for stylus, keyboard, and depth perception

**Status Markers:**
- ✅ **Pass** - Requirement met
- ❌ **Fail** - Requirement not met
- ⚠️ **Partial** - Partially met, needs improvement
- N/A **Not Applicable** - Doesn't apply to this zSpace application

---

## Table of Contents

1. [Perceivable](#1-perceivable)
   - 1.1 Text Alternatives
   - 1.2 Time-Based Media
   - 1.3 Adaptable
   - 1.4 Distinguishable
2. [Operable](#2-operable)
   - 2.1 Keyboard Accessible
   - 2.2 Enough Time
   - 2.3 Seizures and Physical Reactions
   - 2.4 Navigable
   - 2.5 Input Modalities
3. [Understandable](#3-understandable)
   - 3.1 Readable
   - 3.2 Predictable
   - 3.3 Input Assistance
4. [Robust](#4-robust)
   - 4.1 Compatible
5. [zSpace-Specific Requirements](#5-zspace-specific-requirements)
   - 5.1 Stylus Alternatives
   - 5.2 Depth Perception
   - 5.3 Stereoscopic 3D
   - 5.4 Desktop Integration
6. [Unity Accessibility Module Integration (Unity 2023.2+)](#6-unity-accessibility-module-integration-unity-20232)
   - 6.1 Accessibility Hierarchy
   - 6.2 AccessibilityNode Requirements
   - 6.3 Screen Reader Support
   - 6.4 Accessibility Hierarchy Viewer Testing
   - 6.5 Vision Accessibility (Unity 6.0+ Only)
   - 6.6 Unity Accessibility Module Version Support
   - 6.7 Integration with Existing zSpace Components
   - 6.8 Unity Accessibility Testing Workflow
   - 6.9 Common Unity Accessibility Issues
   - 6.10 Unity Accessibility Resources

---

## 1. Perceivable

Information and user interface components must be presentable to users in ways they can perceive.

### 1.1 Text Alternatives

#### SC 1.1.1: Non-text Content (Level A)
**Requirement:** All 3D objects and UI elements have text alternatives for screen readers.

**zSpace Context:**
- [ ] All interactive 3D objects have accessible labels (Windows Narrator, NVDA, JAWS compatible)
- [ ] Images and icons have alt text or ARIA labels
- [ ] Decorative objects marked as `aria-hidden="true"` or accessibility role "decorative"
- [ ] Spatial audio cues have text descriptions
- [ ] Haptic feedback patterns have text alternatives

**Testing:**
- Open Windows Narrator (Win + Ctrl + Enter)
- Tab through all interactive elements
- Verify each element is announced with meaningful description

---

### 1.2 Time-Based Media

#### SC 1.2.1: Audio-only and Video-only (Prerecorded) (Level A)
**zSpace Context:**
- [ ] Audio-only content has text transcript
- [ ] Video-only content has text description or audio description

#### SC 1.2.2: Captions (Prerecorded) (Level A)
**zSpace Context:**
- [ ] All spatial audio has synchronized captions
- [ ] Captions display in 3D space or 2D overlay
- [ ] Speaker identification included in captions
- [ ] Sound effects described in captions (e.g., "[door opens]", "[alert beep]")

#### SC 1.2.3: Audio Description or Media Alternative (Prerecorded) (Level A)
**zSpace Context:**
- [ ] Video content has audio description OR full text alternative
- [ ] 3D animations have audio descriptions

#### SC 1.2.4: Captions (Live) (Level AA)
**zSpace Context:**
- [ ] Live audio (if applicable) has real-time captions
- [ ] Live captions display in readable format on zSpace display

#### SC 1.2.5: Audio Description (Prerecorded) (Level AA)
**zSpace Context:**
- [ ] All prerecorded video has audio description
- [ ] 3D spatial demonstrations have audio narration

---

### 1.3 Adaptable

#### SC 1.3.1: Info and Relationships (Level A)
**zSpace Context:**
- [ ] Information structure conveyed programmatically (headings, lists, labels)
- [ ] UI hierarchy accessible to screen readers
- [ ] 3D spatial relationships described in text
- [ ] Form labels associated with inputs (`<label>` or `aria-labelledby`)

#### SC 1.3.2: Meaningful Sequence (Level A)
**zSpace Context:**
- [ ] Reading order matches visual order in 2D UI
- [ ] Keyboard tab order logical
- [ ] 3D object focus order predictable (left-to-right, top-to-bottom, or spatial proximity)

#### SC 1.3.3: Sensory Characteristics (Level A)
**zSpace Context:**
- [ ] Instructions don't rely solely on shape ("click the round button")
- [ ] Instructions don't rely solely on size ("select the large object")
- [ ] Instructions don't rely solely on location ("object on the right")
- [ ] Instructions don't rely solely on depth perception ("the object floating forward")
- [ ] Use multiple cues: "Select the large red cube (labeled 'Target A') on the right"

#### SC 1.3.4: Orientation (Level AA)
**zSpace Context:**
- [ ] Content functions in portrait and landscape (if applicable)
- [ ] zSpace applications typically landscape-only (may mark N/A)

#### SC 1.3.5: Identify Input Purpose (Level AA)
**zSpace Context:**
- [ ] Input fields have `autocomplete` attributes (email, name, address)
- [ ] Form inputs clearly labeled with purpose

---

### 1.4 Distinguishable

#### SC 1.4.1: Use of Color (Level A)
**zSpace Context:**
- [ ] Color not sole means of conveying information
- [ ] Error states use icon + color + text (not just red color)
- [ ] Interactive objects identified by more than color (outlines, labels, icons)
- [ ] Depth in stereoscopic 3D supplemented with size/shadow/audio cues

#### SC 1.4.2: Audio Control (Level A)
**zSpace Context:**
- [ ] Auto-playing spatial audio can be paused/stopped
- [ ] Audio controls accessible via keyboard
- [ ] Background audio volume adjustable independently

#### SC 1.4.3: Contrast (Minimum) (Level AA)
**zSpace Context:**
- [ ] Text contrast ≥ 4.5:1 (normal text) on zSpace display
- [ ] Text contrast ≥ 3:1 (large text ≥18pt or bold ≥14pt)
- [ ] UI component contrast ≥ 3:1 (buttons, form inputs, focus indicators)
- [ ] Test contrast in multiple virtual lighting conditions (if applicable)
- [ ] Use desktop contrast checker tool (e.g., WebAIM Contrast Checker)

**Testing Tool:** https://webaim.org/resources/contrastchecker/

#### SC 1.4.4: Resize Text (Level AA)
**zSpace Context:**
- [ ] Text can be resized up to 200% without loss of functionality
- [ ] UI reflows without horizontal scrolling at 200% zoom
- [ ] Use Unity's Text Mesh Pro with scalable text

#### SC 1.4.5: Images of Text (Level AA)
**zSpace Context:**
- [ ] Use actual text instead of images of text (except logos)
- [ ] Text overlays on 3D objects use Text Mesh Pro (not texture baked)

#### SC 1.4.10: Reflow (Level AA)
**zSpace Context:**
- [ ] 2D UI content reflows to fit display width
- [ ] No horizontal scrolling required at 320px width (responsive)
- [ ] zSpace display typically fixed size (may adapt requirements)

#### SC 1.4.11: Non-text Contrast (Level AA)
**zSpace Context:**
- [ ] UI components contrast ≥ 3:1 against background
- [ ] Focus indicators contrast ≥ 3:1
- [ ] Interactive 3D objects distinguishable from background (outline, glow, shadow)

#### SC 1.4.12: Text Spacing (Level AA)
**zSpace Context:**
- [ ] Content still readable with increased spacing:
  - Line height ≥ 1.5x font size
  - Paragraph spacing ≥ 2x font size
  - Letter spacing ≥ 0.12x font size
  - Word spacing ≥ 0.16x font size

#### SC 1.4.13: Content on Hover or Focus (Level AA)
**zSpace Context:**
- [ ] Hover/focus content (tooltips, popups) dismissible (ESC key)
- [ ] Hover/focus content hoverable (user can move pointer over it)
- [ ] Hover/focus content persistent (doesn't disappear on brief pointer move)
- [ ] Stylus hover tooltips meet these requirements

---

## 2. Operable

User interface components and navigation must be operable.

### 2.1 Keyboard Accessible

#### SC 2.1.1: Keyboard (Level A)
**zSpace Context:**
- [ ] ALL stylus interactions have keyboard alternatives
- [ ] Tab key moves focus through interactive elements
- [ ] Space/Enter activates buttons
- [ ] Arrow keys navigate menus/lists
- [ ] ESC closes modals/menus
- [ ] No keyboard traps (can always Tab away)

**Critical for zSpace:** Every stylus interaction must work with keyboard.

**Testing:**
- Unplug zSpace stylus
- Complete all application tasks using keyboard only

#### SC 2.1.2: No Keyboard Trap (Level A)
**zSpace Context:**
- [ ] User can navigate away from any UI component using keyboard
- [ ] Modal dialogs closeable with ESC key
- [ ] No infinite loops in tab order

#### SC 2.1.4: Character Key Shortcuts (Level A)
**zSpace Context:**
- [ ] Single-key shortcuts (not using Ctrl/Alt/Shift) can be:
  - Turned off, OR
  - Remapped, OR
  - Only active when component has focus

---

### 2.2 Enough Time

#### SC 2.2.1: Timing Adjustable (Level A)
**zSpace Context:**
- [ ] User can turn off, adjust, or extend time limits
- [ ] Before timeout, warn user and allow 20 seconds to extend
- [ ] Session timeout warnings accessible to screen readers

#### SC 2.2.2: Pause, Stop, Hide (Level A)
**zSpace Context:**
- [ ] Auto-updating content (animations, data) can be paused
- [ ] Scrolling/blinking text can be stopped
- [ ] Auto-playing 3D animations have pause control

---

### 2.3 Seizures and Physical Reactions

#### SC 2.3.1: Three Flashes or Below Threshold (Level A)
**zSpace Context:**
- [ ] No content flashes more than 3 times per second
- [ ] Strobing effects disabled or under threshold
- [ ] Particle effects don't flash rapidly

**Testing:** Use PEAT tool (Photosensitive Epilepsy Analysis Tool)

---

### 2.4 Navigable

#### SC 2.4.1: Bypass Blocks (Level A)
**zSpace Context:**
- [ ] "Skip to main content" link present (first focusable element)
- [ ] Heading structure allows skipping sections
- [ ] Keyboard shortcuts to jump to sections

#### SC 2.4.2: Page Titled (Level A)
**zSpace Context:**
- [ ] Application window has descriptive title
- [ ] Scene changes have unique titles for screen readers

#### SC 2.4.3: Focus Order (Level A)
**zSpace Context:**
- [ ] Tab order matches visual order
- [ ] Focus moves logically through 3D scene objects
- [ ] Depth-based focus order predictable (near-to-far or left-to-right)

#### SC 2.4.4: Link Purpose (In Context) (Level A)
**zSpace Context:**
- [ ] Link/button text describes destination/action
- [ ] Avoid generic "Click here" or "Learn more"
- [ ] Example: "View cellular structure" instead of "Click here"

#### SC 2.4.5: Multiple Ways (Level AA)
**zSpace Context:**
- [ ] Multiple ways to navigate (menu, search, keyboard shortcuts, voice)
- [ ] zSpace applications offer stylus + keyboard + voice navigation

#### SC 2.4.6: Headings and Labels (Level AA)
**zSpace Context:**
- [ ] UI sections have descriptive headings
- [ ] Form labels clearly describe purpose
- [ ] 3D scene sections labeled for screen reader users

#### SC 2.4.7: Focus Visible (Level AA)
**zSpace Context:**
- [ ] Keyboard focus always visible (outline, glow, highlight)
- [ ] Focus indicator contrast ≥ 3:1
- [ ] 3D objects show clear focus state (outline shader, glow effect)
- [ ] Focus indicator not obscured by overlays

#### SC 2.4.11: Focus Not Obscured (Minimum) (Level AA) - NEW in WCAG 2.2
**zSpace Context:**
- [ ] Focused element not completely hidden by fixed UI (header, footer)
- [ ] At least part of focused element visible
- [ ] Use `scroll-padding-top` CSS or Unity UI adjustments

---

### 2.5 Input Modalities

#### SC 2.5.1: Pointer Gestures (Level A)
**zSpace Context:**
- [ ] All multi-point gestures (two-finger pinch) have single-point alternatives
- [ ] Path-based gestures have simple alternatives
- [ ] zSpace: All stylus gestures have keyboard/mouse alternatives

#### SC 2.5.2: Pointer Cancellation (Level A)
**zSpace Context:**
- [ ] Function executes on "up" event (button release), not "down"
- [ ] User can abort by moving pointer away before releasing
- [ ] Applies to stylus button clicks

#### SC 2.5.3: Label in Name (Level A)
**zSpace Context:**
- [ ] Visible button text matches accessible name
- [ ] Example: Button shows "Start" → accessible name includes "Start"

#### SC 2.5.4: Motion Actuation (Level A)
**zSpace Context:**
- [ ] Functions triggered by device motion (shaking) have UI alternative
- [ ] Motion triggers can be disabled
- [ ] zSpace: Head tracking movements not required (desktop-based)

#### SC 2.5.7: Dragging Movements (Level AA) - NEW in WCAG 2.2
**zSpace Context:**
- [ ] All drag-and-drop actions have single-pointer alternative (buttons)
- [ ] Example: Dragging object with stylus → Arrow keys or "Move" button alternative
- [ ] Sortable lists have up/down arrow buttons

#### SC 2.5.8: Target Size (Minimum) (Level AA) - NEW in WCAG 2.2
**zSpace Context:**
- [ ] Interactive elements ≥ 24x24 CSS pixels (desktop standard)
- [ ] Exceptions: inline links, essential sizing, user agent control
- [ ] 3D objects: Colliders ≥ 24px visual angle or enlarged hit areas

**Note:** zSpace uses desktop standards (24x24px), NOT VR standards (44px visual angle)

---

## 3. Understandable

Information and the operation of user interface must be understandable.

### 3.1 Readable

#### SC 3.1.1: Language of Page (Level A)
**zSpace Context:**
- [ ] Primary language declared (e.g., `<html lang="en">`)
- [ ] Unity UI language settings exposed to screen readers

#### SC 3.1.2: Language of Parts (Level AA)
**zSpace Context:**
- [ ] Text in different languages marked up (e.g., `<span lang="es">`)
- [ ] Multilingual content tagged appropriately

---

### 3.2 Predictable

#### SC 3.2.1: On Focus (Level A)
**zSpace Context:**
- [ ] Focusing an element doesn't trigger unexpected context change
- [ ] No auto-submit forms on focus
- [ ] No auto-popups on focus

#### SC 3.2.2: On Input (Level A)
**zSpace Context:**
- [ ] Changing input value doesn't auto-submit form
- [ ] Dropdown changes don't trigger navigation without warning
- [ ] User explicitly clicks "Submit" button

#### SC 3.2.3: Consistent Navigation (Level AA)
**zSpace Context:**
- [ ] Navigation menu in same location across scenes
- [ ] Menu items in consistent order
- [ ] Keyboard shortcuts consistent throughout app

#### SC 3.2.4: Consistent Identification (Level AA)
**zSpace Context:**
- [ ] Same functionality has same label/icon across app
- [ ] Example: "Help" button always uses same icon and text

#### SC 3.2.6: Consistent Help (Level A) - NEW in WCAG 2.2
**zSpace Context:**
- [ ] Help mechanism in same location across scenes
- [ ] Help icon/link consistent placement

---

### 3.3 Input Assistance

#### SC 3.3.1: Error Identification (Level A)
**zSpace Context:**
- [ ] Input errors identified in text
- [ ] Error messages describe problem clearly
- [ ] Errors announced to screen readers

#### SC 3.3.2: Labels or Instructions (Level A)
**zSpace Context:**
- [ ] Form inputs have clear labels
- [ ] Required fields marked (asterisk + "required" text)
- [ ] Input format specified (e.g., "Date format: MM/DD/YYYY")

#### SC 3.3.3: Error Suggestion (Level AA)
**zSpace Context:**
- [ ] Error messages suggest correction
- [ ] Example: "Email invalid" → "Email must include @"

#### SC 3.3.4: Error Prevention (Legal, Financial, Data) (Level AA)
**zSpace Context:**
- [ ] Submissions reversible, OR
- [ ] Data checked for errors, OR
- [ ] Confirmation page before final submit

#### SC 3.3.7: Redundant Entry (Level A) - NEW in WCAG 2.2
**zSpace Context:**
- [ ] Don't ask users to re-enter previously entered information
- [ ] Auto-fill from previous entries
- [ ] Use browser autocomplete attributes

#### SC 3.3.8: Accessible Authentication (Minimum) (Level AA) - NEW in WCAG 2.2
**zSpace Context:**
- [ ] Login doesn't require cognitive function test (CAPTCHA, memory puzzles) OR alternative provided
- [ ] Password managers allowed (no paste blocking)
- [ ] Biometric authentication allowed
- [ ] Alternative authentication methods (email magic link, SSO)

---

## 4. Robust

Content must be robust enough to be interpreted by assistive technologies.

### 4.1 Compatible

#### SC 4.1.2: Name, Role, Value (Level A)
**zSpace Context:**
- [ ] All UI components have accessible name
- [ ] Role conveyed programmatically (button, link, checkbox)
- [ ] State/value conveyed (checked, selected, expanded)
- [ ] Unity UI components expose accessibility properties to Windows accessibility APIs

#### SC 4.1.3: Status Messages (Level AA)
**zSpace Context:**
- [ ] Status messages announced to screen readers without focus change
- [ ] Use ARIA live regions or Windows accessibility notifications
- [ ] Example: "File saved successfully" announced automatically

---

## 5. zSpace-Specific Requirements

These requirements are specific to zSpace stereoscopic 3D desktop platform.

### 5.1 Stylus Alternatives

#### Requirement: All stylus interactions have alternatives

**zSpace Critical Checklist:**
- [ ] **Stylus Button 0** has keyboard alternative (default: Space)
- [ ] **Stylus Button 1** has keyboard alternative (default: Enter)
- [ ] **Stylus Button 2** has keyboard alternative (default: E)
- [ ] **Stylus pointing/raycasting** has keyboard alternative (Tab + Space)
- [ ] **Stylus hover** has keyboard focus alternative (Tab key)
- [ ] **Stylus drag** has keyboard alternative (Arrow keys or buttons)
- [ ] Mouse can be used as alternative to stylus
- [ ] Voice commands can replace stylus interactions
- [ ] Stylus button remapping available in settings

**Testing:**
1. Disconnect zSpace stylus
2. Complete all application tasks using keyboard only
3. Complete all application tasks using mouse only
4. Verify all stylus haptic feedback has audio/visual alternatives

---

### 5.2 Depth Perception

#### Requirement: Applications function without stereoscopic 3D

**Depth Perception Checklist:**
- [ ] Application tested with stereoscopic 3D disabled
- [ ] Depth cues provided beyond stereoscopy:
  - [ ] Size (closer objects larger)
  - [ ] Shadows (object position on floor)
  - [ ] Occlusion (closer objects overlap distant ones)
  - [ ] Spatial audio (audio panning indicates direction)
  - [ ] Haptic feedback (stylus vibration indicates proximity)
- [ ] Critical information shown in 2D UI overlay (not depth-dependent)
- [ ] 10-15% of users can't perceive stereoscopic 3D - app must work for them

**Testing:**
1. Remove zSpace tracked glasses
2. View zSpace display without 3D effect (2D mode)
3. Verify all tasks can be completed
4. Check that no critical info relies solely on depth

---

### 5.3 Stereoscopic 3D Comfort

#### Requirement: Reduce eye strain and discomfort

**Stereoscopic Comfort Checklist:**
- [ ] Text readable in stereoscopic 3D (no excessive depth)
- [ ] UI elements at comfortable depth (not too far forward/back)
- [ ] No rapid depth changes (smooth transitions)
- [ ] Convergence-accommodation conflict minimized
- [ ] Comfortable viewing distance maintained (typical zSpace distance)
- [ ] Break reminders for extended use (20-20-20 rule: every 20 min, look 20 ft away, for 20 sec)

---

### 5.4 Desktop Integration

#### Requirement: Integrate with Windows desktop accessibility

**Desktop Accessibility Checklist:**
- [ ] **Windows Narrator** compatible (Win + Ctrl + Enter to test)
- [ ] **NVDA** compatible (free screen reader: https://www.nvaccess.org/)
- [ ] **JAWS** compatible (commercial screen reader)
- [ ] Windows High Contrast Mode supported
- [ ] Windows Magnifier works with zSpace app (Win + Plus)
- [ ] Windows Speech Recognition supported
- [ ] Standard Windows keyboard shortcuts work (Alt+F4, Alt+Tab, etc.)
- [ ] Unity accessibility APIs exposed to Windows

**Testing:**
1. Enable Windows Narrator
2. Tab through UI - verify all elements announced
3. Enable Windows High Contrast Mode (Alt + Left Shift + Print Screen)
4. Verify UI still readable
5. Use Windows Magnifier (Win + Plus) to zoom in

---

## 6. Unity Accessibility Module Integration (Unity 2023.2+)

**Unity's official Accessibility Module provides native screen reader support and accessibility APIs**

### 6.1 Accessibility Hierarchy

#### Requirement: Create and manage AccessibilityHierarchy for screen readers

**AccessibilityHierarchy Checklist:**
- [ ] `UnityAccessibilityIntegration` component added to scene
- [ ] AccessibilityHierarchy created and set as active (`AssistiveSupport.activeHierarchy`)
- [ ] All interactive UI elements registered with AccessibilityHierarchy
- [ ] Hierarchy created in Awake() or Start() before scene loads
- [ ] Hierarchy cleaned up properly in OnDestroy()

**Code Example:**
```csharp
// In your manager script
AccessibilityHierarchy m_Hierarchy = new AccessibilityHierarchy();
AssistiveSupport.activeHierarchy = m_Hierarchy;
```

**Testing:**
- Open Accessibility Hierarchy Viewer (Window > Accessibility > Accessibility Hierarchy Viewer)
- Enter Play Mode
- Verify hierarchy is visible in viewer
- Check that all interactive elements appear in tree

**Documentation:** `docs/unity-accessibility-integration.md`

---

### 6.2 AccessibilityNode Requirements

#### Requirement: All interactive elements have AccessibilityNodes

**AccessibilityNode Checklist:**
- [ ] All buttons have AccessibilityNode with label and role
- [ ] All toggles/checkboxes have AccessibilityNode with state
- [ ] All links have AccessibilityNode with appropriate role
- [ ] All headings have AccessibilityNode with Header role
- [ ] All 3D interactive objects have AccessibilityNode
- [ ] No AccessibilityNodes have empty labels
- [ ] Labels are descriptive ("Start Game" not "Button_01")
- [ ] Roles match element types (Button, Link, Checkbox, etc.)

**Required Properties for Each Node:**
- `label` - Text announced by screen reader (required)
- `role` - Semantic role from AccessibilityRole enum (required)
- `state` - Current state (Focused, Selected, Disabled, None)
- `hint` - Optional additional context for screen reader users

**Example:**
```csharp
AccessibilityNode node = new AccessibilityNode();
node.label = "Start Game";
node.role = AccessibilityRole.Button;
node.hint = "Begins the zSpace simulation";
node.state = AccessibilityState.None;
```

**Testing:**
- Use Accessibility Hierarchy Viewer to inspect all nodes
- Verify each node has non-empty label
- Verify roles are correct (not all "Button" or "StaticText")
- Build application and test with NVDA/Narrator

---

### 6.3 Screen Reader Support

#### Requirement: Desktop screen reader compatibility (NVDA, Narrator, JAWS)

**Screen Reader Integration Checklist:**
- [ ] `AssistiveSupport.activeHierarchy` set to your hierarchy
- [ ] Screen reader status change listener registered
- [ ] All interactive elements accessible via Tab key
- [ ] Elements announced correctly by screen reader
- [ ] Announcements sent for important actions (button presses, state changes)
- [ ] Tested with Windows Narrator (built-in)
- [ ] Tested with NVDA (free screen reader)
- [ ] Works in built application (not just Unity Editor)

**AssistiveSupport APIs:**
```csharp
// Check if screen reader is active
bool isActive = AssistiveSupport.isScreenReaderEnabled;

// Listen for screen reader status changes
AssistiveSupport.screenReaderStatusChanged += OnScreenReaderChanged;

// Send announcement to screen reader
AssistiveSupport.notificationDispatcher?.SendAnnouncement("Game started");
```

**Testing Workflow:**
1. Build your zSpace application (File > Build Settings > Build)
2. Enable Windows Narrator (Win + Ctrl + Enter)
3. Launch your .exe application
4. Press Tab to navigate through UI
5. Verify each element is announced with correct label and role
6. Test with NVDA for comparison: https://www.nvaccess.org/

**Important:** Screen readers work with **built applications**, not Unity Editor Play Mode.

---

### 6.4 Accessibility Hierarchy Viewer Testing

#### Requirement: Use Accessibility Hierarchy Viewer for debugging

**Hierarchy Viewer Checklist:**
- [ ] Hierarchy Viewer opened (Window > Accessibility > Accessibility Hierarchy Viewer)
- [ ] Viewer shows all interactive elements when in Play Mode
- [ ] Node labels are descriptive and meaningful
- [ ] Node roles are correct (Button, Link, Checkbox, etc.)
- [ ] Focus order in viewer matches visual/spatial order
- [ ] No duplicate or missing nodes
- [ ] All nodes have required properties (label, role)

**How to Use Hierarchy Viewer:**
1. Open Unity Editor
2. Window > Accessibility > Accessibility Hierarchy Viewer
3. Enter Play Mode
4. Viewer shows real-time accessibility tree
5. Click nodes to inspect properties (label, role, state, hint)
6. Tab through UI and watch focus in viewer

**What to Look For:**
- ❌ Empty labels → Won't be announced by screen readers
- ❌ Generic labels ("Button_01") → Not descriptive
- ❌ Wrong roles (Link marked as Button) → Screen reader announces incorrectly
- ❌ Missing nodes → Interactive element not accessible
- ✅ Descriptive labels ("Start Game", "Rotate Heart Model")
- ✅ Correct roles (Button, Link, Checkbox, Header, etc.)
- ✅ All interactive elements present in tree

---

### 6.5 Vision Accessibility (Unity 6.0+ Only)

#### Requirement: Use color-blind safe palettes

**VisionUtility Checklist (Unity 6.0+):**
- [ ] UI colors generated using `VisionUtility.GetColorBlindSafePalette()`
- [ ] Palette safe for deuteranopia (red-green color blindness)
- [ ] Palette safe for protanopia (red-green color blindness)
- [ ] Palette safe for tritanopia (blue-yellow color blindness)
- [ ] Color palette tested with Color Oracle or similar tool
- [ ] UI distinguishable without relying solely on color

**Code Example:**
```csharp
#if UNITY_6000_0_OR_NEWER
// Generate 8 color-blind safe colors
Color[] palette = new Color[8];
int distinctColors = VisionUtility.GetColorBlindSafePalette(palette);

// Apply to UI elements
for (int i = 0; i < distinctColors; i++)
{
    uiElements[i].color = palette[i];
}
#endif
```

**Testing:**
- Download Color Oracle: https://colororacle.org/
- Enable different color blindness simulations
- Verify UI elements are still distinguishable
- Check that critical information doesn't rely solely on color

**Documentation:** https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Accessibility.VisionUtility.GetColorBlindSafePalette.html

---

### 6.6 Unity Accessibility Module Version Support

**Unity Version Requirements:**

| Unity Version | Accessibility Module | Features Available |
|---------------|---------------------|-------------------|
| **2021.3 LTS** | ❌ Not Available | No Accessibility Module - use custom implementations |
| **2022.3 LTS** | ❌ Not Available | No Accessibility Module - use custom implementations |
| **2023.2** | ✅ Introduced | AccessibilityHierarchy, AccessibilityNode, AssistiveSupport, Hierarchy Viewer |
| **Unity 6.0+** | ✅ Enhanced | All 2023.2 features + VisionUtility, AccessibilitySettings, enabled by default |

**Recommendation:** Use Unity 2023.2+ (preferably Unity 6.0+) for full accessibility support.

**Fallback for Unity 2021.3/2022.3:**
```csharp
#if UNITY_2023_2_OR_NEWER
    // Use Unity Accessibility Module
    AccessibilityHierarchy m_Hierarchy = new AccessibilityHierarchy();
#else
    // Custom implementation or warning
    Debug.LogWarning("Upgrade to Unity 2023.2+ for Unity Accessibility Module support");
#endif
```

---

### 6.7 Integration with Existing zSpace Components

**Component Integration Checklist:**
- [ ] `AccessibleStylusButton.cs` enhanced with AccessibilityNode
- [ ] `KeyboardStylusAlternative.cs` updates focus state in AccessibilityNode
- [ ] `SubtitleSystem.cs` sends announcements via AssistiveSupport
- [ ] `ZSpaceFocusIndicator.cs` updates AccessibilityNode state on focus change
- [ ] `VoiceCommandManager.cs` uses AssistiveSupport for feedback
- [ ] All zSpace UI components registered with UnityAccessibilityIntegration

**Integration Example:**
```csharp
// In AccessibleStylusButton.cs
void Start()
{
    // Register with Unity Accessibility
    var manager = UnityAccessibilityIntegration.Instance;
    if (manager != null)
    {
        manager.RegisterButton(gameObject, buttonLabel, "Activates button action");
    }
}

void OnButtonPressed()
{
    // Send announcement to screen reader
    UnityAccessibilityIntegration.Instance?.SendAnnouncement($"{buttonLabel} activated");
}
```

---

### 6.8 Unity Accessibility Testing Workflow

**Complete Testing Procedure:**

**Step 1: Editor Testing (Development)**
- [ ] Open Accessibility Hierarchy Viewer (Window > Accessibility)
- [ ] Enter Play Mode
- [ ] Verify all interactive elements appear in tree
- [ ] Inspect node properties (label, role, state)
- [ ] Check for empty labels or missing nodes

**Step 2: Build Testing (Screen Readers)**
- [ ] Build zSpace application (File > Build Settings > Build)
- [ ] Enable Windows Narrator (Win + Ctrl + Enter)
- [ ] Launch .exe application
- [ ] Tab through all UI elements
- [ ] Verify each element announced correctly
- [ ] Test button activation with Enter/Space
- [ ] Verify announcements for important actions

**Step 3: NVDA Testing (Recommended)**
- [ ] Download NVDA: https://www.nvaccess.org/
- [ ] Install and launch NVDA
- [ ] Run your zSpace .exe application
- [ ] Tab through UI with NVDA active
- [ ] Compare NVDA announcements with Narrator
- [ ] Verify labels, roles, and states announced correctly

**Step 4: Unity Test Framework (Automated)**
- [ ] Run Unity Test Framework tests
- [ ] Verify AccessibilityHierarchy creation tests pass
- [ ] Verify AccessibilityNode registration tests pass
- [ ] Check for null nodes or empty labels in tests

---

### 6.9 Common Unity Accessibility Issues

**Issue 1: Hierarchy Viewer is Empty**
- ❌ Problem: No nodes appear in Accessibility Hierarchy Viewer
- ✅ Solution: Ensure `AssistiveSupport.activeHierarchy = m_Hierarchy` is called
- ✅ Solution: Check that you're in Play Mode (viewer only works during Play)

**Issue 2: Screen Reader Not Announcing Elements**
- ❌ Problem: Narrator/NVDA doesn't announce UI elements
- ✅ Solution: Test with built .exe, not Unity Editor Play Mode
- ✅ Solution: Verify AccessibilityNodes added to hierarchy
- ✅ Solution: Check labels are non-empty

**Issue 3: Empty or Generic Labels**
- ❌ Problem: Nodes have labels like "Button_01" or ""
- ✅ Solution: Set descriptive labels ("Start Game", "Rotate Model")
- ✅ Solution: Use Inspector to verify labels before building

**Issue 4: Wrong Roles Announced**
- ❌ Problem: Button announced as "StaticText" or "Link"
- ✅ Solution: Set correct AccessibilityRole enum value
- ✅ Solution: Button → AccessibilityRole.Button
- ✅ Solution: Link → AccessibilityRole.Link
- ✅ Solution: Toggle → AccessibilityRole.Checkbox

---

### 6.10 Unity Accessibility Resources

**Official Unity Documentation:**
- Unity 2023.2 Accessibility Module: https://docs.unity3d.com/2023.2/Documentation/Manual/com.unity.modules.accessibility.html
- Unity 6.0 Accessibility: https://docs.unity3d.com/6000.0/Documentation/Manual/accessibility.html
- AccessibilityHierarchy API: https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Accessibility.AccessibilityHierarchy.html
- AccessibilityNode API: https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Accessibility.AccessibilityNode.html
- AssistiveSupport API: https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Accessibility.AssistiveSupport.html
- VisionUtility API (Unity 6.0+): https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Accessibility.VisionUtility.GetColorBlindSafePalette.html

**Framework Documentation:**
- Unity Accessibility Integration Guide: `docs/unity-accessibility-integration.md`
- Unity Accessibility API Reference: `docs/unity-accessibility-api-reference.md`
- Unity Accessibility Setup: `examples/zspace-accessible-scene/UnityAccessibilitySetup.md`

**Screen Readers:**
- NVDA (Free, Windows): https://www.nvaccess.org/
- Windows Narrator: Built into Windows 10/11 (Win + Ctrl + Enter)
- JAWS (Commercial): https://www.freedomscientific.com/products/software/jaws/

---

## Implementation Priority

### Phase 1: Critical (Must Have)
1. ✅ Keyboard alternatives for all stylus interactions (SC 2.1.1)
2. ✅ Desktop screen reader compatibility (SC 4.1.2)
3. ✅ Text alternatives for 3D objects (SC 1.1.1)
4. ✅ Contrast requirements (SC 1.4.3, 1.4.11)
5. ✅ Focus visibility (SC 2.4.7)
6. ✅ Depth perception alternatives (zSpace-specific)

### Phase 2: High Priority (Should Have)
1. Voice command alternatives (SC 2.5.1)
2. Target size compliance (SC 2.5.8: 24x24px)
3. Captions for spatial audio (SC 1.2.2)
4. Error identification and prevention (SC 3.3.1, 3.3.3)
5. Dragging alternatives (SC 2.5.7)

### Phase 3: Medium Priority (Nice to Have)
1. Audio descriptions (SC 1.2.5)
2. Magnification support (SC 1.4.4)
3. Multiple navigation methods (SC 2.4.5)
4. Consistent help (SC 3.2.6)

### Phase 4: Polish (Enhancement)
1. Reduced motion support
2. Customizable text spacing (SC 1.4.12)
3. Advanced voice commands
4. Stylus button remapping

---

## Testing Workflow

### 1. Automated Testing (Unity Test Framework)
```csharp
// tests/ZSpaceAccessibilityTests.cs
[Test]
public void AllInteractiveObjects_HaveAccessibleLabels()
{
    var objects = FindObjectsOfType<AccessibleZSpaceObject>();
    foreach (var obj in objects)
    {
        Assert.IsNotEmpty(obj.objectLabel, $"{obj.name} missing accessible label");
    }
}

[Test]
public void AllButtons_MeetMinimumTargetSize()
{
    var buttons = FindObjectsOfType<AccessibleButton>();
    foreach (var button in buttons)
    {
        Assert.GreaterOrEqual(button.targetSize, 0.024f, $"{button.name} below 24px minimum");
    }
}
```

### 2. Manual Testing Checklist

**Keyboard Testing:**
- [ ] Unplug zSpace stylus
- [ ] Tab through all UI elements
- [ ] Space/Enter activates buttons
- [ ] Arrow keys navigate menus
- [ ] ESC closes modals
- [ ] Complete all application tasks

**Screen Reader Testing:**
- [ ] Enable Windows Narrator (Win + Ctrl + Enter)
- [ ] Navigate with Tab key
- [ ] Verify all elements announced
- [ ] Test with NVDA (free download)
- [ ] Verify ARIA labels working

**Contrast Testing:**
- [ ] Use WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- [ ] Verify text contrast ≥ 4.5:1
- [ ] Verify UI component contrast ≥ 3:1

**Depth Perception Testing:**
- [ ] Remove zSpace glasses
- [ ] View display in 2D mode
- [ ] Complete all tasks without stereoscopic depth
- [ ] Verify depth cues present (size, shadow, audio)

**Target Size Testing:**
- [ ] Measure interactive elements (≥ 24x24px)
- [ ] Use browser DevTools or ruler tool
- [ ] Test with imprecise stylus control

---

## Compliance Report Template

```markdown
# zSpace Accessibility Compliance Report

**Application:** [Name]
**Version:** [Version]
**Date:** [Date]
**Tested By:** [Name]

## Summary
- WCAG 2.2 Level AA: [Pass/Fail] ([X]/57 criteria passed)
- W3C XAUR (zSpace-adapted): [Pass/Fail]
- zSpace-Specific Requirements: [Pass/Fail] ([X]/20 requirements passed)

## Critical Issues
1. [Issue description]
2. [Issue description]

## Recommendations
1. [Recommendation]
2. [Recommendation]

## Detailed Results
[Link to detailed test results]
```

---

## Resources

**Standards:**
- WCAG 2.2: https://www.w3.org/WAI/WCAG22/quickref/
- W3C XAUR: https://www.w3.org/TR/xaur/
- Section 508: https://www.section508.gov/

**zSpace:**
- zSpace Developer Portal: https://developer.zspace.com/
- zSpace Unity SDK Documentation: https://developer.zspace.com/docs/

**Testing Tools:**
- NVDA Screen Reader: https://www.nvaccess.org/
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- WAVE Browser Extension: https://wave.webaim.org/extension/
- PEAT (Photosensitive Epilepsy): https://trace.umd.edu/peat/

**Learning:**
- WebAIM: https://webaim.org/
- Unity Accessibility: https://docs.unity3d.com/Manual/com.unity.modules.accessibility.html

---

**Document Version:** 2.0 (zSpace-adapted)
**Last Updated:** October 2025
**Maintainer:** accessibility-standards-unity project

**Note:** This checklist is a living document. As WCAG and zSpace technology evolve, this checklist will be updated accordingly.
