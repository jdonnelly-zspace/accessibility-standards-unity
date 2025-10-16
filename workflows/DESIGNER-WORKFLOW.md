# Designer Workflow - zSpace Accessible Design

This guide shows designers how to create accessible zSpace applications that meet WCAG 2.2 Level AA standards for stereoscopic 3D desktop platforms.

**Target Platform:** zSpace (stereoscopic 3D desktop + stylus + tracked glasses)
**Design Context:** Unity 3D UI + stereoscopic 3D objects

---

## Quick Reference

**Must-Haves for Every zSpace Design:**
1. ✅ Color contrast ≥ 4.5:1 for text (desktop standards)
2. ✅ Color contrast ≥ 3:1 for UI components
3. ✅ Visible focus states for all interactive elements **in 3D space**
4. ✅ Keyboard alternatives to **all stylus interactions**
5. ✅ **Depth perception alternatives** (10-15% can't see stereoscopic 3D)
6. ✅ Interactive elements ≥ 24x24 pixels (desktop standard, NOT 44px VR standard)
7. ✅ Stylus button functions documented with keyboard mappings
8. ✅ Application works without stereoscopic 3D enabled

**Tools:**
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- Unity Editor (for 3D UI design)
- Figma/Adobe XD (for 2D UI mockups that will be implemented in Unity)
- Color blindness simulator
- zSpace hardware for testing

---

## zSpace Platform Fundamentals

### Hardware Understanding

**zSpace System:**
- **Display:** 24" stereoscopic 3D desktop screen (NOT a headset)
- **Glasses:** Lightweight tracked glasses (similar to 3D movie glasses)
- **Stylus:** 3-button stylus with LED, vibration (haptic feedback)
- **Environment:** Seated desktop, keyboard/mouse available

**User Posture:**
- Seated at desk (ergonomic position)
- Eyes ~24-30 inches from screen
- Stylus held like a pen
- Can remove glasses anytime (CRITICAL: app must work without 3D)

---

### Platform Differences from VR Headsets

| Feature | VR Headsets | zSpace |
|---------|-------------|--------|
| **Display** | Head-mounted (HMD) | 24" desktop screen |
| **Input** | Hand controllers | Stylus + keyboard/mouse |
| **Target Size** | 44px (arm's length) | 24px (desktop viewing) |
| **Locomotion** | Teleport, smooth movement | None (seated/fixed view) |
| **Motion Sickness** | High risk | Low risk |
| **Screen Readers** | TalkBack, VoiceOver (mobile) | NVDA, Narrator, JAWS (desktop) |
| **Environment** | Isolated, immersive | Desktop, collaborative |

---

## Design Principles for zSpace

### Principle 1: Perceivable

**Users must perceive UI in stereoscopic 3D AND 2D modes.**

#### Color Contrast (WCAG 1.4.3 - Level AA) ⭐

**Requirements (Desktop Standards):**
- **Normal text:** 4.5:1 minimum
- **Large text (18pt+ or 14pt+ bold):** 3:1 minimum
- **UI components (borders, icons):** 3:1 minimum

**Testing in Unity:**
1. Use WebAIM Contrast Checker for UI colors
2. Test against background colors in Unity scene
3. Verify contrast in **both stereoscopic and 2D modes**
4. Test with glasses off (non-stereoscopic view)

**Example Colors (Desktop):**
```
✅ White text on dark gray (#1F2937): 12.63:1 - Excellent
✅ Blue UI (#3B82F6) on dark: 5.42:1 - Good
✅ Gray UI elements (#6B7280) on dark: 4.54:1 - Passes

❌ Light gray (#CCCCCC) on white: 1.61:1 - Fails
```

**zSpace-Specific Consideration:**
- Colors must work in **both eyes' views** of stereoscopic display
- Test with polarized glasses on AND off
- Avoid relying on stereoscopic depth alone to distinguish UI

---

#### Depth Perception Alternatives (CRITICAL for zSpace)

**Problem:** 10-15% of users cannot perceive stereoscopic 3D.

**Design Requirement:** Every 3D depth cue must have 2D alternatives.

**Depth Cue Strategy:**

**✅ Good - Multiple Cues:**
```
3D Object at Depth:
1. Stereoscopic 3D (primary - only works for 85-90%)
2. Size (closer = larger) ← Works for everyone
3. Shadow (distance from surface) ← Works for everyone
4. Occlusion (objects overlap) ← Works for everyone
5. Spatial audio (closer = louder) ← Works for everyone
6. Haptic feedback (closer = stronger vibration) ← Works for everyone
```

**❌ Bad - Stereoscopic Only:**
```
3D Object Depth:
1. Stereoscopic 3D only
   ❌ Fails for 10-15% of users
   ❌ No alternatives provided
```

**Design Checklist:**
- [ ] All depth information has size cues
- [ ] Objects cast shadows to show distance
- [ ] Spatial audio provides auditory depth cues
- [ ] Haptic feedback varies with depth
- [ ] Application tested with glasses off

**Unity Implementation Notes:**
```
Document for Developers:
• Enable shadow casting for all 3D objects
• Scale objects based on distance (size cue)
• Add AudioSource with distance attenuation
• Provide haptic feedback via stylus vibration
```

---

#### Text Readability in 3D Space

**Requirements:**
- **Minimum font size:** 14pt for body text, 18pt for headings
- **Text distance:** Readable from 24-30 inches (typical viewing distance)
- **Text contrast:** 4.5:1 minimum
- **Text background:** Solid or semi-transparent with sufficient contrast

**Unity UI Canvas Modes:**

**Option 1: Screen Space (2D Overlay)**
```
Best for: Menus, HUD, always-visible UI
Appears: Flat on screen, not in 3D space
Benefits:
  ✅ Always readable
  ✅ Consistent size
  ✅ Screen reader compatible
```

**Option 2: World Space (3D UI)**
```
Best for: 3D labels, tooltips, in-world UI
Appears: In 3D space, can be rotated
Considerations:
  ⚠️ Must be large enough to read at distance
  ⚠️ Provide zoom option
  ⚠️ Ensure text faces user (billboarding)
```

**Design Specifications:**
```
Unity Canvas Settings:
• Screen Space Canvas: Font size 14-18px minimum
• World Space Canvas: Font size 0.1 - 0.2 world units (adjust for distance)
• TextMeshPro preferred (better rendering)
• Font: Sans-serif, medium-bold weight
```

---

### Principle 2: Operable

**Users must operate UI with stylus AND keyboard.**

#### Stylus + Keyboard Input Alternatives (CRITICAL)

**WCAG 2.1.1 Requirement:** All stylus functionality available via keyboard.

**Stylus Button Mapping:**
```
Stylus Button 0 → Spacebar (primary action)
Stylus Button 1 → E key (secondary action)
Stylus Button 2 → R key (tertiary action)
Stylus pointing → Mouse cursor
```

**Design Pattern: Dual Input Support**

**✅ Good Design:**
```
Action: Select 3D Object
• Stylus: Point stylus at object + press Button 0
• Keyboard: Tab to object + press Spacebar
• Mouse: Click object

Action: Rotate Object
• Stylus: Drag with Button 1 held
• Keyboard: Q/E keys to rotate
• Mouse: Click + drag with right button

Action: Open Menu
• Stylus: Press Button 2
• Keyboard: Press M key
• Mouse: Right-click
```

**❌ Bad Design:**
```
Action: Select Object
• Stylus only: Point + Button 0
  ❌ No keyboard alternative
  ❌ Violates WCAG 2.1.1
```

**Annotations for Developers:**
```
Design Spec: Object Selection

Interaction Methods:
1. Stylus: Point + Button 0 → Select
2. Keyboard: Tab → Focus, Spacebar → Select
3. Mouse: Click → Select

Visual Feedback:
• Hover: Yellow outline (pre-selection)
• Focus: Blue glow (keyboard navigation)
• Selected: Green highlight + haptic pulse

Haptic: 30% intensity, 100ms duration
Audio: Selection "click" sound
```

---

#### Focus Indicators in 3D Space (WCAG 2.4.7 - Level AA)

**Requirement:** Visible focus indicator with 3:1 contrast **in stereoscopic 3D**.

**Challenge:** Focus must be visible in 3D space, not just on flat UI.

**Design Solutions:**

**Option 1: Emissive Glow**
```
Default State:
  Material: Standard
  Color: Object base color

Focus State:
  Material: Standard + Emission enabled
  Emission Color: Yellow (#FFEB3B)
  Emission Intensity: 2.0
  Result: Object glows visibly in 3D
```

**Option 2: Outline Shader**
```
Default State:
  Standard material

Focus State:
  Outline shader applied
  Outline Color: Blue (#2196F3)
  Outline Width: 0.05 units
  Result: Blue outline around 3D object
```

**Option 3: Floating Indicator**
```
Focus State:
  Ring or halo floats above object
  Rotates slowly
  Visible from all angles
```

**Design Specification Template:**
```
Component: Interactive 3D Button

Visual States:
• Default: Gray (#9E9E9E)
• Hover (Stylus): Yellow outline (#FFC107)
• Focus (Keyboard): Blue glow (#2196F3), emission 2.0
• Active/Pressed: Scale down 0.9x
• Disabled: Gray (#616161), 50% opacity

Focus Indicator:
  Type: Emissive glow
  Color: #2196F3 (blue)
  Intensity: 2.0
  Contrast vs background: 5.1:1 ✅

Animations:
  Hover: Scale up 1.1x (duration 0.2s)
  Press: Scale down 0.9x (duration 0.1s)
  Focus: Glow pulse (1s cycle)
```

---

#### Target Size for zSpace Desktop

**WCAG 2.5.8 - Target Size (Minimum) - Level AA**

**Requirement:** Interactive elements ≥ 24x24 CSS pixels.

**zSpace Context:** Desktop viewing distance (NOT VR arm's length)

**Target Sizes:**
- **Minimum:** 24x24 pixels (WCAG 2.2 Level AA - desktop)
- **Recommended:** 36x36 pixels (comfortable for stylus)
- **NOT Required:** 44px (that's for VR headsets)

**Unity UI (2D Canvas):**
```
Button Sizes:
  Minimum: 24x24 pixels (RectTransform)
  Recommended: 40x40 pixels
  Ideal: 48x48 pixels (Material Design)

Examples:
  ✅ Close button: 32x32px
  ✅ Menu button: 40x40px
  ✅ Icon button: 36x36px with 4px padding
  ❌ Tiny icon: 16x16px (too small!)
```

**Unity 3D Objects (World Space):**
```
3D Button Collider Sizes:
  Minimum: 0.5 x 0.5 world units (at 1 unit distance)
  Recommended: 0.75 x 0.75 world units

Visual size should be slightly smaller than collider
(provides forgiveness for targeting)
```

**Measurement in Figma/Design:**
```
Mockup annotations:
  [Button] 40x40px @ 96 DPI
  Unity Implementation: 40x40 RectTransform

[3D Button] 0.75 x 0.75 world units
BoxCollider: 0.8 x 0.8 (10% larger for easier targeting)
```

---

### Principle 3: Understandable

**Information and operation must be understandable in 3D context.**

#### Clear Labels and Instructions

**Screen Reader Compatibility (Desktop):**
- NVDA (free, Windows)
- Windows Narrator (built-in)
- JAWS (commercial, industry standard)

**Design Requirement:** All UI elements need accessible names for screen readers.

**Unity UI Annotations:**
```
Button: "Submit Form"
  AccessibleLabel: "Submit Form"
  Role: Button
  Screen Reader: "Submit Form, button"

Icon-Only Button: [X]
  AccessibleLabel: "Close Menu"
  Role: Button
  Screen Reader: "Close Menu, button"

Toggle: [☑] Show Grid
  AccessibleLabel: "Show Grid"
  Role: Toggle
  State: Checked / Unchecked
  Screen Reader: "Show Grid, toggle, checked"
```

**Design Handoff Checklist:**
- [ ] All buttons have descriptive labels
- [ ] Icon-only elements have aria-label specified
- [ ] Toggle states documented
- [ ] Menu structure documented for keyboard navigation

---

#### Consistent Interaction Patterns

**zSpace Standard Patterns:**

**Pattern 1: Object Selection**
```
Standard Across All Objects:
  Stylus: Point + Button 0
  Keyboard: Tab + Spacebar
  Visual: Blue glow on focus
  Audio: Selection click
  Haptic: 30% pulse
```

**Pattern 2: Object Manipulation**
```
Standard Across All Objects:
  Rotate: Stylus drag OR Q/E keys
  Scale: Stylus Button 1 + drag OR +/- keys
  Move: Stylus Button 0 + drag OR Arrow keys
  Reset: Stylus Button 2 OR R key
```

**Pattern 3: Menu Navigation**
```
Standard Menu Behavior:
  Open: M key OR Stylus Button 2
  Navigate: Arrow keys OR Stylus hover
  Select: Enter OR Spacebar OR Stylus Button 0
  Close: Escape OR Stylus Button 2
```

**Design Specification:**
```
Document for team:

"zSpace Interaction Standards"

All interactive objects must support:
1. Stylus pointing + Button 0 (select)
2. Keyboard Tab navigation + Spacebar (select)
3. Mouse click (select)

All menus must support:
1. Arrow key navigation
2. Enter/Spacebar to activate
3. Escape to close
4. Stylus hover + Button 0 click
```

---

### Principle 4: Robust

**Content must work with desktop assistive technologies.**

#### Desktop Screen Reader Support

**Unity Implementation Requirements:**

**Windows UI Automation:**
```
Unity Accessibility API (2021.3+):
• AccessibilityManager.RegisterNode(gameObject, label, role)
• AccessibilityManager.Announce(message)

Design Documentation:
  All UI elements need:
  • Accessible Name (label)
  • Role (button, toggle, slider, etc.)
  • State (if applicable: checked, expanded, selected)
```

**Design Annotations:**
```
Component: Settings Menu

Hierarchy:
  Menu (role: menu)
  ├─ Audio Settings (role: menuitem)
  │  ├─ Volume Slider (role: slider, value: 75%)
  │  └─ Mute Toggle (role: toggle, state: unchecked)
  ├─ Graphics Settings (role: menuitem)
  └─ Accessibility Settings (role: menuitem)

Screen Reader Announcements:
  • On menu open: "Settings menu opened, 3 items"
  • On item focus: "Audio Settings, menu item 1 of 3"
  • On slider change: "Volume 75%"
  • On toggle: "Mute, toggle, unchecked"
```

---

## zSpace-Specific Design Patterns

### Pattern 1: 3D Object with Keyboard Focus

**Visual Design:**
```
State Progression:
┌─────────────┐
│   Default   │  Gray material, no glow
└─────────────┘

┌─────────────┐
│ Stylus Hover│  Yellow outline, scale 1.05x
└─────────────┘

┌─────────────┐
│Keyboard Focus│ Blue emissive glow (2.0 intensity)
└─────────────┘  Pulsing animation (1s cycle)

┌─────────────┐
│  Selected   │  Green highlight, haptic pulse
└─────────────┘  Scale 1.1x, rotation enabled
```

**Unity Material Specifications:**
```
Default Material:
  Shader: Standard
  Color: #9E9E9E (gray)
  Metallic: 0.2
  Smoothness: 0.5

Focus Material:
  Shader: Standard
  Color: #9E9E9E (gray)
  Emission: Enabled
  Emission Color: #2196F3 (blue)
  Emission Intensity: 2.0
  HDR: Enabled

Selected Material:
  Shader: Standard
  Color: #4CAF50 (green)
  Emission: Enabled
  Emission Color: #81C784 (light green)
  Emission Intensity: 1.5
```

---

### Pattern 2: zSpace Menu (3D Spatial Menu)

**Layout:**
```
Menu Panel (World Space Canvas):
┌────────────────────┐
│   Settings Menu    │ ← Title (18pt bold)
├────────────────────┤
│ [🔊] Audio      [▶]│ ← Item 1 (40px height)
│ [🎨] Graphics   [▶]│ ← Item 2 (40px height)
│ [♿] Accessibility[▶]│ ← Item 3 (40px height)
│ [ℹ️] About       [▶]│ ← Item 4 (40px height)
└────────────────────┘

Positioning:
  World Space at 1.0 units from camera
  Always faces camera (billboarding)
  Scale: 0.002 units (readable at distance)
```

**Interaction:**
```
Navigation:
  Stylus: Hover over item + Button 0 click
  Keyboard: Up/Down arrows, Enter to select
  Mouse: Click item

Visual Feedback:
  Current Item:
    Background: Blue (#2196F3, 20% opacity)
    Border: Blue (#2196F3, 2px)

  Hover:
    Background: Gray (#9E9E9E, 10% opacity)

  Active (Click):
    Background: Blue (#2196F3, 40% opacity)
    Scale: 0.95x (press effect)
```

---

### Pattern 3: Depth-Aware Tooltip

**Design Challenge:** Tooltips in 3D space must be readable from all angles.

**Solution: Billboarded Tooltip**
```
Tooltip Design:
┌───────────────────┐
│  Rotate Object    │ ← Text (14pt)
│  Press E or drag  │ ← Subtext (12pt)
└───────────────────┘
      ▼              ← Arrow points to object

Properties:
  Type: World Space Canvas
  Always faces camera (billboarding)
  Floats 0.3 units above object
  Background: Semi-transparent (#000000, 80% opacity)
  Text: White (#FFFFFF)
  Contrast: 15:1 ✅
  Border: 1px white (#FFFFFF)

Behavior:
  Appears: On hover after 0.5s delay
  Dismissible: Press Escape
  Persistent: Stays while hovering
  (WCAG 1.4.13 compliant)
```

---

### Pattern 4: Depth Perception Alternatives Visualization

**Design Documentation:**
```
3D Object: Interactive Molecule Model

Depth Cues Provided:
1. Stereoscopic 3D (primary, 85-90% of users)
   → zSpace glasses enabled

2. Size (works for 100% of users)
   → Atoms closer to camera are 1.2x larger
   → Atoms farther away are 0.8x smaller

3. Shadow (works for 100% of users)
   → All atoms cast shadows on virtual table surface
   → Shadow distance indicates height/depth

4. Occlusion (works for 100% of users)
   → Front atoms partially hide back atoms
   → Layering is visible

5. Spatial Audio (works for 100% of users)
   → Audio cue when atom is selected
   → Volume louder when atom is closer
   → Volume quieter when atom is farther

6. Haptic Feedback (works for 100% of users)
   → Stylus vibration intensity varies with depth
   → Closer atoms = 50% vibration
   → Farther atoms = 20% vibration

Testing Requirement:
  ✅ Application tested with zSpace glasses OFF
  ✅ All depth information still perceivable via cues 2-6
```

---

## Design Handoff Checklist

**Before Handoff to Unity Developers:**

### Visual Design
- [ ] All text colors verified with contrast checker (4.5:1+)
- [ ] UI component colors verified (borders, icons 3:1+)
- [ ] Materials specified for 3D objects (color, emission, metallic)
- [ ] Focus states designed for all interactive objects
- [ ] Focus indicators visible in 3D space (glow, outline, ring)

### Depth Perception
- [ ] **CRITICAL:** Depth alternatives documented for all 3D elements
- [ ] Size cues specified (closer = larger)
- [ ] Shadow casting enabled for all 3D objects
- [ ] Spatial audio cues documented
- [ ] Haptic feedback patterns specified
- [ ] Application tested without stereoscopic 3D

### Input Methods
- [ ] All stylus interactions have keyboard alternatives documented
- [ ] Stylus button mappings specified (Button 0 → Space, etc.)
- [ ] Mouse alternatives provided
- [ ] Tab navigation order specified
- [ ] Keyboard shortcuts documented

### zSpace-Specific
- [ ] Target sizes ≥ 24x24 pixels (desktop, NOT 44px VR)
- [ ] 3D object colliders sized for easy stylus targeting
- [ ] Haptic feedback patterns documented (intensity, duration)
- [ ] World Space UI readable from 24-30 inches
- [ ] Screen Space UI font sizes ≥ 14pt

### Accessibility Documentation
- [ ] All UI elements have accessible labels specified
- [ ] Icon-only buttons have aria-label annotations
- [ ] Screen reader announcements documented
- [ ] Menu structure documented for keyboard navigation
- [ ] Focus management specified (modals, menus)

### Testing Requirements
- [ ] Designed for Windows screen readers (NVDA, Narrator, JAWS)
- [ ] Keyboard-only interaction documented
- [ ] Works without zSpace glasses (2D mode)
- [ ] Works with keyboard only (no stylus)
- [ ] Works with mouse only (no stylus)

---

## Tools & Resources

### Design Tools

**Figma/Adobe XD (for 2D UI Mockups):**
- Design 2D UI elements (buttons, menus, HUD)
- Export to Unity as sprites or reference
- Plugins: Able, Stark (accessibility checking)

**Unity Editor (for 3D Design):**
- Design World Space UI directly in Unity
- Test stereoscopic 3D appearance
- Prototype interactions with zSpace SDK

**Color Contrast Tools:**
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- Colour Contrast Analyser (desktop app)
- Chrome DevTools color picker

### zSpace-Specific Tools

**zSpace Hardware:**
- Test designs on actual zSpace system
- Verify stereoscopic appearance
- Test stylus interaction ergonomics

**zSpace Unity SDK:**
- Developers use for implementation
- Provides stylus input, stereoscopic rendering
- Documentation: https://developer.zspace.com/

---

## Design Annotation Template

**Create specification document for each component:**

```
Component: Interactive 3D Button

Description:
  3D button for starting simulation
  Appears in world space, 1.5 units from user

Visual Specifications:
  Dimensions: 0.5 x 0.3 x 0.1 world units
  Material: Standard shader
  Color: #2196F3 (blue)
  Emission: None (default), #64B5F6 (focus)

Collider:
  BoxCollider: 0.55 x 0.35 x 0.15 (10% larger than visual)
  Purpose: Easier stylus targeting

States:
  Default:
    Color: #2196F3
    Emission: Off
    Scale: 1.0

  Hover (Stylus):
    Color: #2196F3
    Emission: Off
    Scale: 1.05
    Outline: Yellow, 0.02 units

  Focus (Keyboard):
    Color: #2196F3
    Emission: Enabled, #64B5F6, Intensity 2.0
    Scale: 1.0
    Animation: Glow pulse (1s cycle)

  Active (Pressed):
    Color: #1976D2 (darker blue)
    Emission: Off
    Scale: 0.95
    Audio: Click sound
    Haptic: 50% intensity, 100ms

Interactions:
  Stylus:
    • Hover: Show outline
    • Button 0: Activate
    • Haptic: 50% intensity, 100ms

  Keyboard:
    • Tab: Focus (show glow)
    • Spacebar: Activate

  Mouse:
    • Hover: Show outline
    • Click: Activate

Accessibility:
  Accessible Label: "Start Simulation Button"
  Role: Button
  Screen Reader: "Start Simulation, button"

  Depth Cues:
    • Size: Same size as other buttons
    • Shadow: Casts shadow on background plane
    • Audio: Click sound (not spatialized)
    • Haptic: 50% vibration on press

Keyboard Alternative:
  • S key also starts simulation (alternative to stylus/mouse)

Target Size:
  Visual: 0.5 x 0.3 units
  Collider: 0.55 x 0.35 units ✅ (exceeds minimum)
  At 1.5 units distance ≈ 45px visual angle ✅

Contrast:
  Text: White (#FFFFFF) on blue (#2196F3) = 4.68:1 ✅
  Focus glow: #64B5F6 on dark background = 5.2:1 ✅
```

---

## Common Design Mistakes (zSpace)

### Mistake #1: Stereoscopic 3D Only (No Depth Alternatives)

**❌ Bad:**
```
Design: 3D objects at different depths
Depth cue: Stereoscopic 3D only
Problem: 10-15% of users can't perceive depth
Result: WCAG failure
```

**✅ Good:**
```
Design: 3D objects at different depths
Depth cues:
  1. Stereoscopic 3D (primary)
  2. Size (closer = larger)
  3. Shadows (show distance)
  4. Spatial audio (closer = louder)
  5. Haptic (closer = stronger vibration)
Result: WCAG compliant, works for 100% of users
```

---

### Mistake #2: Stylus-Only Interactions

**❌ Bad:**
```
Action: Select molecule atom
Input: Stylus Button 0 only
Problem: No keyboard alternative
Result: WCAG 2.1.1 failure
```

**✅ Good:**
```
Action: Select molecule atom
Inputs:
  • Stylus Button 0
  • Keyboard: Tab + Spacebar
  • Mouse: Click
Result: WCAG compliant
```

---

### Mistake #3: Using VR Target Sizes (44px)

**❌ Wrong:**
```
Platform: zSpace (desktop)
Target size: 44x44 pixels (VR standard)
Problem: Oversized for desktop viewing
Result: Wastes screen space
```

**✅ Correct:**
```
Platform: zSpace (desktop)
Target size: 24-36 pixels (desktop standard)
Reasoning: Desktop viewing distance, not VR arm's length
Result: Appropriate sizing, WCAG compliant
```

---

### Mistake #4: Mobile Screen Readers

**❌ Wrong:**
```
Screen readers: TalkBack, VoiceOver
Problem: zSpace is Windows desktop
Result: Wrong assistive technology
```

**✅ Correct:**
```
Screen readers: NVDA, Windows Narrator, JAWS
Platform: Windows desktop
Result: Appropriate for zSpace platform
```

---

### Mistake #5: No Focus Indicators in 3D

**❌ Bad:**
```
3D Button Focus:
  No visual change
  Keyboard user can't tell what's focused
Result: WCAG 2.4.7 failure
```

**✅ Good:**
```
3D Button Focus:
  Emissive glow (blue, intensity 2.0)
  Pulsing animation
  Visible in stereoscopic 3D
  Contrast: 5:1 ✅
Result: WCAG compliant
```

---

## Resources

- **zSpace Developer Portal:** https://developer.zspace.com/
- **WCAG 2.2 Quick Reference:** https://www.w3.org/WAI/WCAG22/quickref/
- **Unity Accessibility:** https://docs.unity3d.com/Manual/com.unity.modules.accessibility.html
- **WebAIM Contrast Checker:** https://webaim.org/resources/contrastchecker/
- **W3C XAUR (XR Accessibility):** https://www.w3.org/TR/xaur/
- **NVDA Screen Reader:** https://www.nvaccess.org/ (free)

---

## Collaboration

**With Developers:**
- Provide Unity-compatible specifications (materials, world units, collider sizes)
- Document keyboard alternatives for all stylus interactions
- Specify depth perception alternatives
- Provide accessible labels for all UI elements
- Test designs on zSpace hardware together

**With QA:**
- Review accessibility test results (keyboard, screen reader, depth alternatives)
- Test without stereoscopic 3D (glasses off)
- Verify haptic feedback feels appropriate
- Iterate based on user feedback

**With Product:**
- Include zSpace accessibility requirements in acceptance criteria
- Ensure timelines account for accessible design
- Advocate for testing with users who can't perceive stereoscopic 3D
- Budget for zSpace hardware testing

---

**Last Updated:** October 2025
**Platform:** zSpace (stereoscopic 3D desktop)
**Standards:** WCAG 2.2 Level AA + W3C XAUR (zSpace-adapted)
