# Manual Review Guide for zSpace Unity Accessibility Audits

**Version:** 3.1.0-phase2.5
**Last Updated:** October 26, 2025

## Overview

While automated code analysis provides a foundation for accessibility auditing, **manual review is essential** for comprehensive WCAG 2.2 Level AA certification. Automated analysis can detect code patterns but cannot verify actual user experience or compliance with many success criteria.

**Key Statistics:**
- Approximately **79% of WCAG 2.2 criteria require manual testing**
- Automated tools detect code patterns, not user experience
- Manual review validates actual functionality, not just code structure

This guide provides step-by-step instructions for conducting thorough manual accessibility reviews of zSpace Unity applications.

---

## Table of Contents

1. [Testing Environment Setup](#1-testing-environment-setup)
2. [Keyboard Accessibility Testing](#2-keyboard-accessibility-testing)
3. [Assistive Technology Testing](#3-assistive-technology-testing)
4. [Visual Accessibility Testing](#4-visual-accessibility-testing)
5. [Audio and Video Accessibility](#5-audio-and-video-accessibility)
6. [3D and Spatial Accessibility](#6-3d-and-spatial-accessibility)
7. [Cognitive and Language Accessibility](#7-cognitive-and-language-accessibility)
8. [Input Methods and Interaction](#8-input-methods-and-interaction)
9. [Documenting Findings](#9-documenting-findings)

---

## 1. Testing Environment Setup

### Required Equipment

- **zSpace Device:** AIO Pro or Inspire with stereoscopic 3D display
- **Input Devices:**
  - zSpace stylus (primary)
  - Standard keyboard
  - Standard mouse
  - (Optional) Alternative input devices for accessibility testing

### Required Software

- **Operating System:** Windows 10/11 with latest updates
- **Assistive Technologies:**
  - NVDA (free screen reader) - https://www.nvaccess.org/
  - Windows Narrator (built-in screen reader)
  - (Optional) JAWS screen reader
- **Testing Tools:**
  - Color Contrast Analyzer - https://www.tpgi.com/color-contrast-checker/
  - Browser developer tools (for reference)
  - Screen recording software for documentation

### Testing Modes

1. **Stereoscopic 3D Enabled** (default zSpace mode)
2. **Stereoscopic 3D Disabled** (for depth perception alternative testing)
3. **High Contrast Mode** (Windows accessibility feature)
4. **Screen Magnification** (Windows Magnifier at 200%)

---

## 2. Keyboard Accessibility Testing

**WCAG Criteria:** 2.1.1, 2.1.2, 2.1.4, 2.4.1, 2.4.3, 2.4.7, 2.4.11

### Test Procedure

#### 2.1 Basic Keyboard Operation

**What to Test:**
- All functionality must be operable via keyboard alone (no mouse/stylus)
- No keyboard traps (can always move focus away)
- Single-character shortcuts can be turned off or remapped

**How to Test:**

1. **Launch the application** without touching the mouse or stylus
2. **Navigate through all menus, buttons, and interactive elements** using only:
   - **Tab** (forward navigation)
   - **Shift+Tab** (backward navigation)
   - **Enter** or **Space** (activate buttons/controls)
   - **Arrow keys** (navigate within menus, lists, sliders)
   - **Esc** (close dialogs, cancel actions)

3. **For each interactive element, verify:**
   - Can you reach it with keyboard?
   - Can you activate it with keyboard?
   - Can you adjust its value/state with keyboard?
   - Can you navigate away from it with keyboard?

4. **Document any element that:**
   - Cannot be reached via keyboard
   - Traps keyboard focus (cannot navigate away)
   - Requires mouse/stylus to operate

**Pass Criteria:**
- ✅ All interactive functionality is keyboard accessible
- ✅ No keyboard traps exist
- ✅ Tab order is logical and preserves meaning

**Common Issues:**
- ❌ Stylus-only interactions (grabbing 3D objects, stylus buttons)
- ❌ Modal dialogs that trap focus
- ❌ Custom controls without keyboard handlers

---

#### 2.2 Focus Visibility

**What to Test:**
- Keyboard focus indicator is clearly visible
- Focus indicator has ≥3:1 contrast ratio against background
- Focus indicator moves with keyboard navigation

**How to Test:**

1. **Navigate through the application using Tab key**
2. **At each focusable element, check:**
   - Is there a visual indicator showing which element has focus?
   - Is the indicator clearly visible (not just a 1px outline)?
   - Does the indicator have sufficient contrast against the background?

3. **Use Color Contrast Analyzer to measure:**
   - Focus indicator color vs. background color
   - Must be ≥3:1 contrast ratio

4. **Take screenshots** of focused elements for documentation

**Pass Criteria:**
- ✅ Focus indicator visible on all focusable elements
- ✅ Focus indicator ≥3:1 contrast ratio
- ✅ Focus indicator clearly distinguishes focused element

**Common Issues:**
- ❌ No visible focus indicator
- ❌ Default Unity UI focus indicator too subtle (thin outline)
- ❌ Focus indicator lost on certain backgrounds

---

#### 2.3 Focus Order

**What to Test:**
- Focus order follows a meaningful sequence
- Focus order preserves the meaning and operability of content

**How to Test:**

1. **Navigate through each scene using Tab key**
2. **Document the focus order:**
   - Does it follow the visual layout (left-to-right, top-to-bottom)?
   - Does it make logical sense for the task flow?
   - Does it ever jump unexpectedly across the screen?

3. **Test task workflows:**
   - Can you complete tasks in a logical order using only Tab and Enter?

**Pass Criteria:**
- ✅ Focus order matches visual layout
- ✅ Focus order supports task completion
- ✅ No confusing focus jumps

**Common Issues:**
- ❌ Focus jumps randomly across UI
- ❌ Related controls not grouped in focus order
- ❌ Dynamic content causes focus loss

---

## 3. Assistive Technology Testing

**WCAG Criteria:** 1.1.1, 1.3.1, 1.3.2, 2.4.2, 2.4.4, 2.4.6, 3.3.2, 4.1.2

### Test Procedure

#### 3.1 Screen Reader Testing (NVDA or Narrator)

**What to Test:**
- All interactive elements have accessible names
- Roles are programmatically determined (button, slider, etc.)
- States and values are announced (checked, selected, value)
- Content structure is conveyed (headings, landmarks, lists)

**How to Test with NVDA:**

1. **Launch NVDA** (Insert+N for NVDA menu)
2. **Enable Speech Viewer** (NVDA menu > Tools > Speech Viewer) to see what's announced
3. **Launch the zSpace application**
4. **Navigate using screen reader commands:**
   - **Tab** - move to next interactive element
   - **Insert+Down Arrow** - read next item
   - **Insert+Up Arrow** - read previous item
   - **NVDA+T** - read window title
   - **H** - navigate by headings
   - **B** - navigate by buttons

5. **For each UI element, verify:**
   - Does NVDA announce the element type (button, slider, checkbox)?
   - Does NVDA announce the element's name/label?
   - Does NVDA announce the element's state (checked, expanded, selected)?
   - Does NVDA announce the element's value (for sliders, progress bars)?

6. **For 3D objects and scene content:**
   - Are 3D objects announced when focused?
   - Do objects have meaningful names (not "GameObject_57")?
   - Is spatial information conveyed non-visually?

**Pass Criteria:**
- ✅ All interactive elements have accessible names
- ✅ Roles and states are programmatically determined
- ✅ NVDA users can navigate and operate all functionality
- ✅ 3D objects have meaningful accessible names

**Common Issues:**
- ❌ Elements announced as "unlabeled" or "button_12"
- ❌ State changes not announced (checkbox checked/unchecked)
- ❌ Unity UI not exposing information to Windows accessibility API
- ❌ 3D objects completely inaccessible to screen readers

---

#### 3.2 Programmatic Relationships

**What to Test:**
- Labels are associated with their controls
- Form instructions are programmatically linked
- Error messages are associated with inputs
- Table headers are associated with data cells

**How to Test:**

1. **Use NVDA in forms mode** (Insert+Space to toggle)
2. **Tab to each input field and verify:**
   - Is the label announced when you focus the field?
   - Are instructions announced?
   - Are required fields indicated?

3. **Trigger validation errors and verify:**
   - Is the error message announced?
   - Is the error associated with the correct field?

4. **For tables (if present):**
   - Navigate with Ctrl+Alt+Arrow keys
   - Verify column headers are announced for each cell

**Pass Criteria:**
- ✅ Labels announced when focusing controls
- ✅ Relationships programmatically determined
- ✅ Error messages associated with inputs

---

## 4. Visual Accessibility Testing

**WCAG Criteria:** 1.4.1, 1.4.3, 1.4.4, 1.4.5, 1.4.10, 1.4.11, 1.4.12, 1.4.13

### Test Procedure

#### 4.1 Color Contrast

**What to Test:**
- Normal text: ≥4.5:1 contrast ratio
- Large text (18pt+ or 14pt+ bold): ≥3.0:1 contrast ratio
- UI components and icons: ≥3.0:1 contrast ratio

**How to Test:**

1. **Automated Analysis:** Review `contrast-analysis.json` output (if Phase 2 ran)
2. **Manual Verification using Color Contrast Analyzer:**
   - Take screenshots of the running application on zSpace display
   - For each text element, measure:
     - Foreground color (text)
     - Background color
   - For UI components (buttons, icons, input borders):
     - Component color
     - Adjacent background color

3. **Test on Actual zSpace Display:**
   - Automated analysis uses screenshots, but zSpace stereoscopic rendering may differ
   - Verify contrast ratios on the actual hardware

**Pass Criteria:**
- ✅ All text meets contrast requirements
- ✅ All UI components meet 3:1 minimum
- ✅ No reliance on color alone to convey information

**Common Issues:**
- ❌ Light gray text on white backgrounds
- ❌ Low contrast button states (hover, disabled)
- ❌ Icons/symbols without sufficient contrast

---

#### 4.2 Use of Color (Color-Blind Testing)

**What to Test:**
- Color is not the only visual means of conveying information
- Color-blind users can distinguish elements
- Interactive states use multiple cues (color + icon/pattern/text)

**How to Test:**

1. **Review Color-Blind Simulations** (if Phase 2 ran):
   - Open comparison HTML files in `screenshots/[SceneName]/colorblind/`
   - Compare original vs. each color vision type:
     - Protanopia (red-blind)
     - Deuteranopia (green-blind)
     - Tritanopia (blue-blind)
     - Protanomaly, Deuteranomaly, Tritanomaly (weak color vision)

2. **For each simulation, verify:**
   - Can you still distinguish different elements?
   - Can you identify interactive states (selected, active, disabled)?
   - Can you understand charts, graphs, or color-coded information?
   - Are there non-color cues (icons, patterns, labels)?

3. **Common scenarios to test:**
   - Form validation (success/error colors)
   - Status indicators (red/yellow/green)
   - Charts and data visualization
   - Selected vs. unselected items
   - Enabled vs. disabled buttons

**Pass Criteria:**
- ✅ No information loss in any color-blind simulation
- ✅ Multiple cues provided (color + icon/text/pattern)
- ✅ Color-blind users can complete all tasks

**Common Issues:**
- ❌ Red/green success/error indicators without icons
- ❌ Color-coded categories without labels
- ❌ Interactive states indicated by color only

---

#### 4.3 Text Resizing

**What to Test:**
- Text can be resized up to 200% without loss of content or functionality
- No horizontal scrolling required at 200% zoom

**How to Test:**

1. **Enable Windows Display Scaling:**
   - Settings > System > Display > Scale = 200%
   - Or use Windows Magnifier (Windows + Plus key)

2. **Test each scene at 200% text size:**
   - Is all text still readable?
   - Is any content cut off or hidden?
   - Do UI elements overlap?
   - Can you still operate all controls?

3. **For Unity applications:**
   - Unity may use fixed UI scaling
   - Test with system-level text size adjustments
   - Verify Canvas Scaler settings respect system scale

**Pass Criteria:**
- ✅ No loss of content at 200% text size
- ✅ No loss of functionality
- ✅ No need for horizontal scrolling

**Common Issues:**
- ❌ Fixed pixel-based UI that doesn't scale
- ❌ Text truncated or cut off at larger sizes
- ❌ Overlapping UI elements

---

#### 4.4 Images of Text

**What to Test:**
- Text is not presented as part of an image (except logos, essential images)
- All text uses actual text rendering (TextMesh Pro, Unity UI Text)

**How to Test:**

1. **Visual inspection** of all text elements
2. **Check for:**
   - Screenshots or images containing text
   - Text embedded in textures
   - Text "burned into" images
   - Text as part of UI sprites

3. **Verify text is selectable** (if applicable for 3D text in Unity)

**Pass Criteria:**
- ✅ All text uses text rendering (not rasterized)
- ✅ Only essential text is in images (logos, brand names)

**Common Issues:**
- ❌ UI buttons using image sprites with text
- ❌ Instructions as static images
- ❌ Text in textures instead of Unity Text components

---

#### 4.5 Content on Hover or Focus

**What to Test:**
- Tooltips and hover content can be dismissed without moving pointer
- Hover content can be hovered over (doesn't disappear)
- Content persists until user dismisses it (or focus/hover removed)

**How to Test:**

1. **Trigger each tooltip/hover content**
2. **Verify:**
   - Can you dismiss it with Escape key?
   - Can you move your mouse over the tooltip without it disappearing?
   - Does it stay visible until you take an action?

**Pass Criteria:**
- ✅ Tooltips are dismissible, hoverable, and persistent

**Common Issues:**
- ❌ Tooltips disappear when you try to read them
- ❌ No way to dismiss tooltip without moving mouse away

---

## 5. Audio and Video Accessibility

**WCAG Criteria:** 1.2.1, 1.2.2, 1.2.3, 1.2.4, 1.2.5, 1.4.2

### Test Procedure

#### 5.1 Captions for Audio

**What to Test:**
- All prerecorded audio has captions
- All live audio has captions (if applicable)
- Captions are synchronized, accurate, and complete

**How to Test:**

1. **Identify all audio content** (narration, dialogue, instructions)
2. **For each audio element:**
   - Are captions provided?
   - Do captions appear synchronized with audio?
   - Do captions include all dialogue and important sound effects?
   - Are captions readable (contrast, size, font)?

3. **Test caption controls:**
   - Can you turn captions on/off?
   - Can you adjust caption appearance?

**Pass Criteria:**
- ✅ All audio content has accurate, synchronized captions
- ✅ Captions include dialogue and relevant sound effects
- ✅ Captions are readable and customizable

**Common Issues:**
- ❌ No captions provided
- ❌ Auto-generated captions with errors
- ❌ Captions missing sound effects
- ❌ Poor caption timing/sync

---

#### 5.2 Audio Control

**What to Test:**
- Auto-playing audio >3 seconds has pause/stop/volume control
- Audio volume can be controlled independently of system volume

**How to Test:**

1. **Launch application and note:**
   - Does audio play automatically?
   - If yes, for how long?

2. **If audio plays >3 seconds automatically:**
   - Is there a pause/stop button?
   - Is there a volume control?
   - Can you mute without muting entire system?

**Pass Criteria:**
- ✅ No auto-playing audio >3 seconds, OR
- ✅ Pause/stop/volume controls provided

**Common Issues:**
- ❌ Background music with no stop button
- ❌ Narration that cannot be paused
- ❌ Volume tied to system volume only

---

## 6. 3D and Spatial Accessibility

**zSpace-Specific Testing (XAUR UN17, W3C XR Accessibility)**

### Test Procedure

#### 6.1 Stereoscopic Depth Alternatives

**What to Test:**
- Users with stereoblindness (10-15% of population) can perceive spatial information
- Multiple depth cues provided: size, shadows, audio, haptic feedback

**How to Test:**

1. **Disable Stereoscopic 3D:**
   - zSpace Settings > Disable 3D (or cover one eye to simulate monocular vision)

2. **Complete all tasks and workflows without stereo 3D:**
   - Can you still determine object depth?
   - Can you still interact with 3D objects?
   - Can you complete all tasks?

3. **Identify depth cues present:**
   - **Relative Size:** Do objects get smaller with distance?
   - **Occlusion:** Do closer objects block farther objects?
   - **Shadows:** Are drop shadows or ground shadows present?
   - **Spatial Audio:** Does audio indicate object location?
   - **Haptic Feedback:** Does stylus vibrate when nearing objects?
   - **Linear Perspective:** Do parallel lines converge with distance?

4. **Test tasks that require depth perception:**
   - Selecting objects at different depths
   - Manipulating objects in 3D space
   - Understanding spatial relationships

**Pass Criteria:**
- ✅ Application is fully functional without stereoscopic 3D
- ✅ Multiple depth cues provided (minimum 3 types)
- ✅ Spatial information conveyed through non-stereoscopic means

**Common Issues:**
- ❌ Reliance on stereoscopic 3D only
- ❌ No shadows or size scaling
- ❌ Stereo-blind users cannot interact with 3D content

---

#### 6.2 3D Object Accessibility

**What to Test:**
- 3D objects have accessible names and descriptions
- Object interactions are announced to assistive technologies
- Spatial information provided non-visually

**How to Test:**

1. **Use NVDA to navigate 3D scene:**
   - Can you discover 3D objects via keyboard/screen reader?
   - Are object names meaningful?
   - Are object states announced?

2. **Test object interactions:**
   - Select, grab, rotate, scale
   - Are actions announced?
   - Can actions be performed via keyboard?

**Pass Criteria:**
- ✅ 3D objects accessible to assistive technologies
- ✅ Meaningful object names (not "GameObject_123")
- ✅ Spatial relationships conveyed non-visually

**Common Issues:**
- ❌ 3D objects completely inaccessible to screen readers
- ❌ No keyboard alternatives for stylus 3D interactions
- ❌ No spatial audio cues

---

## 7. Cognitive and Language Accessibility

**WCAG Criteria:** 2.2.1, 2.2.2, 3.1.1, 3.1.2, 3.2.1, 3.2.2, 3.2.3, 3.2.4, 3.3.1, 3.3.2, 3.3.3, 3.3.4

### Test Procedure

#### 7.1 Time Limits

**What to Test:**
- Time limits can be turned off, adjusted, or extended
- 20-second warning before timeout
- Ability to extend by at least 10x default

**How to Test:**

1. **Identify all timed activities** (quizzes, games, interactions)
2. **For each timeout:**
   - Is there a warning before time expires?
   - Can you extend the time?
   - Can you disable the time limit?

**Pass Criteria:**
- ✅ Time limits are adjustable or can be disabled
- ✅ Warnings provided before timeout

---

#### 7.2 Error Prevention and Recovery

**What to Test:**
- Input errors are automatically detected
- Error messages identify the problem
- Suggestions for correction are provided
- Destructive actions are reversible or require confirmation

**How to Test:**

1. **Trigger validation errors** (invalid inputs, required fields)
2. **Verify:**
   - Is the error clearly identified?
   - Is a correction suggestion provided?
   - Is the error message associated with the input?

3. **Test destructive actions:**
   - Delete, reset, exit without saving
   - Is confirmation required?

**Pass Criteria:**
- ✅ Errors identified and described
- ✅ Correction suggestions provided
- ✅ Destructive actions require confirmation

---

#### 7.3 Consistent Navigation and Identification

**What to Test:**
- Navigation mechanisms appear in same location across scenes
- Components with same functionality have same labels
- Interface is predictable and consistent

**How to Test:**

1. **Document navigation patterns in each scene:**
   - Where is the main menu?
   - Where is the help button?
   - Where are common actions (back, home, settings)?

2. **Verify consistency:**
   - Do repeated elements appear in the same relative order?
   - Do buttons with same function have same labels?

**Pass Criteria:**
- ✅ Navigation is consistent across scenes
- ✅ Same functionality has same labels

---

## 8. Input Methods and Interaction

**WCAG Criteria:** 2.5.1, 2.5.2, 2.5.3, 2.5.4, 2.5.7, 2.5.8

### Test Procedure

#### 8.1 Pointer Gestures

**What to Test:**
- Multi-point or path-based gestures have single-pointer alternatives
- Complex gestures not required (unless essential)

**How to Test:**

1. **Identify all gestures:**
   - Pinch to zoom
   - Two-finger drag
   - Path-based drawing

2. **Verify single-pointer alternatives exist:**
   - Zoom buttons instead of pinch
   - Single-finger drag with modifier key
   - Click-to-place instead of drawing

**Pass Criteria:**
- ✅ All multi-point gestures have single-pointer alternatives

---

#### 8.2 Target Size

**What to Test:**
- Interactive targets are at least 24x24 CSS pixels
- Spacing between targets is sufficient

**How to Test:**

1. **Measure interactive targets** (buttons, 3D objects, controls):
   - Use ruler tool or screenshot measurement
   - Convert to CSS pixels (96 DPI on Windows)

2. **For zSpace stylus targets:**
   - Targets may need to be larger due to stylus precision
   - Recommend 48x48 pixels minimum for 3D targets

**Pass Criteria:**
- ✅ All interactive targets ≥24x24 CSS pixels
- ✅ Sufficient spacing between adjacent targets

---

#### 8.3 Motion Actuation

**What to Test:**
- Functionality does not require device or user motion (unless essential or alternative provided)
- zSpace head-tracking should be for viewport only, not required for functionality

**How to Test:**

1. **Test with head-tracking disabled:**
   - Can you still access all functionality?
   - Is head motion required for any interactions?

2. **Verify motion alternatives:**
   - Keyboard/mouse alternatives for head gestures
   - Settings to disable motion-based features

**Pass Criteria:**
- ✅ No required device/user motion (or alternatives provided)
- ✅ zSpace head-tracking is viewport-only

---

## 9. Documenting Findings

### Finding Template

For each issue discovered:

```markdown
**Criterion:** [WCAG Number and Name]
**Conformance Level:** [Supports / Partially Supports / Does Not Support / Not Applicable]
**Issue:** [Brief description]
**Impact:** [Who is affected and how]
**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]
3. [Expected vs. Actual]

**Evidence:** [Screenshot, video timestamp, or description]
**Recommendation:** [How to fix]
```

### Severity Levels

- **High:** Prevents access for significant user groups
- **Medium:** Difficult but possible workaround exists
- **Low:** Minor inconvenience, does not block access

### Final Report

1. **Compile all findings** from manual testing
2. **Cross-reference with automated VPAT** to fill in conformance levels
3. **Update VPAT conformance levels** based on manual testing results
4. **Prioritize remediation** based on severity and impact
5. **Create accessibility roadmap** for addressing issues

---

## Resources

### Standards and Guidelines

- **WCAG 2.2:** https://www.w3.org/WAI/WCAG22/quickref/
- **Section 508:** https://www.access-board.gov/ict/
- **W3C XAUR:** https://www.w3.org/TR/xaur/
- **Unity Accessibility:** https://docs.unity3d.com/Manual/accessibility.html

### Testing Tools

- **NVDA Screen Reader:** https://www.nvaccess.org/
- **Color Contrast Analyzer:** https://www.tpgi.com/color-contrast-checker/
- **WebAIM Resources:** https://webaim.org/resources/

### zSpace Resources

- **zSpace Developer Portal:** https://developer.zspace.com/
- **Accessibility Standards Unity Framework:** [This repository]

---

**Document Version:** 3.1.0-phase2.5
**Framework:** accessibility-standards-unity
**Contact:** accessibility@zspace.com
