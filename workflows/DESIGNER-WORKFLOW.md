# Designer Workflow - Accessible Design

This guide shows designers how to create accessible designs that meet WCAG 2.2 Level AA standards.

---

## Quick Reference

**Must-Haves for Every Design:**
1. ✅ Color contrast ≥ 4.5:1 for text
2. ✅ Color contrast ≥ 3:1 for UI components
3. ✅ Visible focus states for all interactive elements
4. ✅ **🆕 WCAG 2.2: Focus not obscured by sticky headers (SC 2.4.11)**
5. ✅ Keyboard interaction patterns specified
6. ✅ ARIA labels documented for icon-only elements
7. ✅ **🆕 WCAG 2.2: Interactive elements ≥ 24x24px minimum (44x44px recommended)**
8. ✅ **🆕 WCAG 2.2: Draggable interfaces have button alternatives**

**Tools:**
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- Figma A11y plugin (free)
- Color blindness simulator
- Chrome DevTools (color picker with contrast)

---

## Design Principles

### Principle 1: Perceivable

**Users must be able to perceive information and UI components.**

#### Color Contrast (WCAG 1.4.3 - Level AA) ⭐

**Requirements:**
- **Normal text:** 4.5:1 minimum
- **Large text (18pt+ or 14pt+ bold):** 3:1 minimum
- **UI components (borders, icons):** 3:1 minimum

**Testing:**
1. Use WebAIM Contrast Checker
2. Enter foreground color (text)
3. Enter background color
4. Verify ratio meets requirements

**Figma Workflow:**
1. Install "Able – Friction-free Accessibility" plugin
2. Select text layer
3. Plugin shows contrast ratio
4. Adjust colors until passing

**Common Mistakes:**
```
❌ Light gray on white: 2.5:1 (fails)
✅ Dark gray (#404040) on white: 10.4:1 (passes)

❌ Purple (#9333EA) on dark background (#1A1A1A): 3.2:1 (fails for text)
✅ Light purple (#A78BFA) on dark: 5.9:1 (passes)

❌ Placeholder text too light: 2.3:1 (fails)
✅ Placeholder text #6B7280: 4.6:1 (passes)
```

**Example Passing Colors (from My Web App):**
- Navbar buttons: #FFFFFF on rgba(17,24,39,0.1) = **16.32:1** ✅
- Indigo-400 text: #6366F1 on #1A1A1A = **5.95:1** ✅
- Secondary text: gray-400 on dark = **6.99:1** ✅

---

#### Use of Color (WCAG 1.4.1 - Level A)

**Requirement:** Don't use color alone to convey information.

**Examples:**

**❌ Bad:**
- Error message in red text only
- Required field marked with red asterisk only (no label "required")
- Chart with color-coded segments (no labels/patterns)

**✅ Good:**
```
Error Messages:
  Icon + Color + Text
  [!] Error: Email is required

Required Fields:
  Asterisk + Label + aria-required
  Email Address *

Charts:
  Colors + Patterns + Labels
  [Blue stripes] Category A: 45%
  [Green dots] Category B: 30%
```

**Links:**
- Must be underlined OR have 3:1 contrast with surrounding text PLUS additional indicator on hover/focus

---

### Principle 2: Operable

**Users must be able to operate UI components with keyboard.**

#### Focus Indicators (WCAG 2.4.7 - Level AA) ⭐

**Requirement:** Visible focus indicator with 3:1 contrast.

**Design Focus States for:**
- Buttons
- Links
- Form inputs
- Custom controls (dropdowns, tabs, accordions)

**Examples:**

**Option 1: Outline**
```
Default state:
  [Button] gray-500 border

Focus state:
  [Button] blue-600 outline, 2-3px thick
  Color contrast: 5:1 (passes)
```

**Option 2: Background Change**
```
Default:
  Button: purple-600 background

Focus:
  Button: purple-500 background + darker border
  Visual difference clearly visible
```

**Option 3: Box Shadow**
```
Focus:
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.5)
  Creates blue glow around element
```

**Figma Annotations:**
Create separate "Focus State" frame or component variant showing:
- Border color
- Background color
- Shadow/glow
- Any size changes

---

#### Keyboard Interaction Patterns

**For Every Interactive Element, Specify:**

**Buttons:**
- Tab: Move focus to button
- Enter or Space: Activate button
- Escape: Close modal (if modal trigger)

**Dropdowns:**
- Tab: Move to dropdown trigger
- Enter or Space: Open dropdown
- Arrow Up/Down: Navigate options
- Escape: Close dropdown
- Tab: Close dropdown and move to next element

**Modals:**
- Enter on trigger: Open modal
- Escape: Close modal
- Tab: Cycle through modal elements (trap focus)

**Annotations in Figma:**
Add text layer near interactive element:
```
Keyboard:
• Tab - Focus button
• Enter - Open modal
• Escape - Close modal
```

---

### Principle 3: Understandable

**Information and operation must be understandable.**

#### Clear Labels (WCAG 3.3.2 - Level A)

**Forms:**
- Every input has visible label
- Required fields marked visually
- Helper text provided when needed

**Figma Example:**
```
[Label] Email Address *
[Input] user@example.com
[Helper] We'll never share your email
```

**Icon-only Buttons:**
- Document accessible name
- Add annotation with aria-label

```
Figma Annotation:
[X icon button]
aria-label: "Close menu"
```

---

#### Consistent Navigation (WCAG 3.2.3 - Level AA)

**Requirement:** Navigation appears in same order on all pages.

**Design:**
- Navigation menu same position/order on all pages
- Footer links same position/order on all pages
- Consistent button placement (e.g., "Back" always on left)

---

### Principle 4: Robust

**Content must work with assistive technologies.**

#### ARIA Annotations

**When to Add ARIA:**
1. Icon-only buttons
2. Decorative vs. meaningful images
3. Custom components (tabs, accordions, carousels)
4. Visually hidden text for screen readers
5. Live regions (success messages, loading states)

**Figma Workflow:**
Create "Accessibility Notes" layer:
```
[Icon Button - Hamburger Menu]
ARIA:
• role="button"
• aria-label="Open navigation menu"
• aria-expanded="false" (closed state)
• aria-expanded="true" (open state)

Keyboard:
• Enter - Toggle menu
• Escape - Close menu
```

---

## Design Handoff Checklist

**Before Handoff to Developers:**

### Visual Design
- [ ] All text colors verified with contrast checker (4.5:1+)
- [ ] UI component colors verified (borders, icons 3:1+)
- [ ] Links distinguishable (underline or high contrast)
- [ ] Error states designed (form validation)
- [ ] Loading states designed
- [ ] Empty states designed

### Focus States
- [ ] Focus indicators designed for all buttons
- [ ] Focus indicators designed for all links
- [ ] Focus indicators designed for all form inputs
- [ ] Focus indicators designed for custom controls
- [ ] Focus contrast verified (3:1+)

### Keyboard Patterns
- [ ] Tab order annotated
- [ ] Keyboard shortcuts documented (if any)
- [ ] Modal behavior specified (open/close with keyboard)
- [ ] Dropdown behavior specified (Arrow keys, Escape)

### ARIA Documentation
- [ ] Icon-only buttons have aria-label annotations
- [ ] Image alt text guidance provided
- [ ] Custom components have ARIA pattern specified
- [ ] Required fields marked (visual + aria-required noted)

### Responsive
- [ ] Mobile designs include touch targets ≥ 44x44px (≥ 24x24px minimum per WCAG 2.2)
- [ ] Content reflows at 320px width
- [ ] Zoom to 200% considered
- [ ] Breakpoints specified

### WCAG 2.2 Specific
- [ ] **SC 2.4.11:** Fixed headers don't obscure focused elements
- [ ] **SC 2.5.7:** Draggable elements have button/keyboard alternatives
- [ ] **SC 2.5.8:** All interactive elements ≥ 24x24 CSS pixels
- [ ] **SC 3.3.7:** Forms designed to avoid redundant entry (auto-fill patterns)
- [ ] **SC 3.3.8:** Authentication designed with password manager support

---

## WCAG 2.2 New Requirements for Designers

### SC 2.4.11: Focus Not Obscured (Minimum) - Level AA

**Problem:** Sticky/fixed headers can hide focused elements when users tab through page.

**Design Solution:**

**Option 1: Leave Space for Focus**
```
Design Layout:
┌─────────────────────┐
│ Fixed Header (60px) │
├─────────────────────┤
│                     │ ← Ensure 10-20px buffer
│ [Focused Button]    │ ← Focus ring visible
│                     │
│ Content             │
│                     │
└─────────────────────┘
```

**Option 2: Transparent/Semi-Transparent Header**
```
Fixed Header:
  Background: rgba(255,255,255,0.9)
  Backdrop-filter: blur(10px)

Note: Focused elements partially visible through header
```

**Figma Annotation:**
```
Fixed Header (z-index: 100)
⚠️ Developer Note: Add scroll-padding-top: 80px to prevent focus being hidden
```

---

### SC 2.5.7: Dragging Movements - Level AA

**Requirement:** All drag-and-drop must have non-dragging alternatives.

**Design Patterns:**

**Pattern 1: Sortable List**
```
Item Layout:
┌─────────────────────────┐
│ ⋮⋮ Task Name        [↑] │
│                     [↓] │
└─────────────────────────┘

Annotations:
• Drag handle (⋮⋮) for mouse users
• Up/Down buttons for keyboard/touch users
• Keyboard: Ctrl+Arrow to reorder
```

**Pattern 2: File Upload**
```
❌ Bad:
  "Drag and drop files here"

✅ Good:
  "Drag and drop files here or"
  [Choose Files] button
```

**Pattern 3: Slider**
```
Slider Design:
[──────●──────] 50%
[-]         [+]
[Text Input: 50]

Alternatives provided:
• Drag slider thumb
• Click track to jump
• +/- buttons
• Direct number input
```

---

### SC 2.5.8: Target Size (Minimum) - Level AA

**Requirement:** Interactive elements must be ≥ 24x24 CSS pixels.

**Updated Guidelines:**
- **Minimum:** 24x24px (WCAG 2.2 Level AA)
- **Recommended:** 44x44px (better usability, especially mobile)
- **Ideal:** 48x48px (Material Design guideline)

**Design Examples:**

**Icon Buttons:**
```
❌ Too Small:
  Icon: 16x16px
  Button: 20x20px
  ❌ Fails WCAG 2.2

✅ Minimum:
  Icon: 20x20px
  Button: 24x24px with 2px padding
  ✅ Passes (24x24 total)

✅ Recommended:
  Icon: 24x24px
  Button: 44x44px with 10px padding
  ✅ Excellent usability
```

**Form Controls:**
```
Checkbox:
  Visible box: 18x18px
  Click area: 24x24px (add padding)
  Label: "Remember me" (clicking label also works)

Radio Button:
  Same as checkbox
```

**Spacing Exception:**
```
If elements have ≥ 24px spacing between them,
they can be smaller than 24x24px.

Example: Pagination
[ 1 ] [ 2 ] [ 3 ] [ 4 ]
  ↑     ↑     ↑     ↑
 20px  28px  28px  20px spacing

20x20 buttons OK because spacing > 24px
```

**Figma Measurement:**
```
Layer Annotations:
Button: 44x44px ✅ WCAG 2.2 AA
Icon: 24x24px
Padding: 10px all sides
```

---

### SC 3.3.7: Redundant Entry - Level A

**Requirement:** Don't make users re-enter information.

**Design Patterns:**

**Pattern 1: Multi-Step Forms**
```
Step 1: Contact Info
  Email: _____________
  Phone: _____________

Step 2: Shipping Address
  Email: user@example.com (pre-filled from Step 1)

Note to Developer:
  • Auto-populate email from Step 1
  • Use autocomplete="email"
```

**Pattern 2: Billing = Shipping**
```
Billing Address:
  Street: _____________
  City: _____________
  ...

Shipping Address:
  ☐ Same as billing address

  [If checked, fields auto-fill]
```

**Pattern 3: Form Draft Saving**
```
Long Form Design:
  "Your progress is automatically saved"

  If user leaves and returns:
  • Form data restored
  • User can continue where they left off
```

**Annotations:**
```
Form Fields:
• Email: autocomplete="email"
• Phone: autocomplete="tel"
• Address: autocomplete="street-address"
• City: autocomplete="address-level2"
• ZIP: autocomplete="postal-code"
```

---

### SC 3.3.8: Accessible Authentication (Minimum) - Level AA

**Requirement:** No cognitive function tests without alternatives.

**Design Patterns:**

**Pattern 1: Password Field with Manager Support**
```
Login Form:
  Email: _____________
         autocomplete="email"

  Password: ●●●●●●●● [👁️]
            autocomplete="current-password"
            [Paste is allowed]

  [Sign In]

Annotations:
⚠️ Developer: DO NOT block paste on password field
⚠️ Developer: DO NOT use autocomplete="off"
```

**Pattern 2: Alternative Authentication**
```
Sign In Options:

  Tab 1: Password
    [Email and Password fields]

  Tab 2: Magic Link
    [Email only - sends login link]

  Tab 3: Social Login
    [Continue with Google]
    [Continue with Microsoft]
```

**Pattern 3: Password Reset**
```
❌ Bad CAPTCHA:
  "Type the text you see: gR8k2p"
  (Requires transcription = cognitive test)

✅ Good Alternative:
  "Check your email for reset link"
  (No cognitive test required)
```

**Pattern 4: Show/Hide Password**
```
Password Field:
  [●●●●●●●●●] [👁️ Show]

When clicked:
  [mypassword] [👁️‍🗨️ Hide]

Purpose:
  • Helps users verify password
  • Reduces cognitive load (remembering)
  • Supports accessibility
```

---

## Tools & Plugins

### Figma Plugins (Free)

#### 1. Able – Friction-free Accessibility
**Features:**
- Real-time contrast checking
- Color blindness simulation
- Focus order visualization
- Touch target size checking

**Usage:**
1. Install from Figma Community
2. Select text layer
3. Plugin shows pass/fail for contrast

---

#### 2. A11y - Color Contrast Checker
**Features:**
- Bulk contrast checking
- Generates report of issues
- Suggests compliant alternatives

---

#### 3. Stark
**Features:**
- Contrast checker
- Color blindness simulator
- Generate accessible color palettes
- (Free tier available, Pro features paid)

---

### Color Tools

#### WebAIM Contrast Checker (Web)
**URL:** https://webaim.org/resources/contrastchecker/
**Best for:** Quick one-off checks

#### Colour Contrast Analyser (Desktop App)
**URL:** https://www.tpgi.com/color-contrast-checker/
**Best for:** Eyedropper tool to sample colors from designs

---

## Design Patterns Library

### Button States

```
Default State:
  Background: purple-600
  Text: white
  Border: none

Hover State:
  Background: purple-500 (lighter)
  Text: white
  Border: none
  Cursor: pointer

Focus State:
  Background: purple-600
  Text: white
  Border: 2px solid purple-300
  Outline: 2px solid purple-400, offset 2px

Active/Pressed State:
  Background: purple-700 (darker)
  Text: white
  Border: none

Disabled State:
  Background: gray-300
  Text: gray-500
  Cursor: not-allowed
  Note: Contrast doesn't matter for disabled (WCAG exception)
```

---

### Form Fields

```
Default State:
  Border: gray-300, 1px
  Background: white
  Label: gray-700, 14px
  Placeholder: gray-400 (contrast 4.6:1)

Focus State:
  Border: blue-500, 2px
  Background: white
  Box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1)

Error State:
  Border: red-500, 2px
  Background: red-50
  Icon: [!] Error icon (not color only!)
  Message: "Email is required" below input
  aria-invalid="true"
  aria-describedby="email-error"

Success State:
  Border: green-500, 1px
  Icon: [✓] Success icon
  Message: "Looks good!" below input
```

---

### Modal Dialog

```
Overlay:
  Background: rgba(0,0,0,0.7)
  Covers entire viewport

Modal Container:
  Background: white
  Border-radius: 8px
  Box-shadow: large
  Max-width: 600px
  Padding: 24px

Close Button:
  Position: top-right
  aria-label: "Close dialog"
  Keyboard: Escape key closes modal
  Icon: X (with accessible label)

Annotations:
  • Focus trapped within modal
  • Escape closes modal
  • Focus returns to trigger on close
  • role="dialog"
  • aria-modal="true"
```

---

### Cards (Blog Posts, Products)

```
Card Structure:
  [Image]
  [Title - H3]
  [Excerpt text]
  [Category tag]

Link Wrapper:
  aria-label: "Read article: {title}. {excerpt}"
  Note: Provides full context for screen readers

Hover State:
  Border changes color
  Slight scale transform
  Cursor: pointer

Focus State:
  Border: blue-600, 2px
  Box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2)

Keyboard:
  • Tab - Focus card
  • Enter - Navigate to article
```

---

## Annotations Template

**Create annotation layer in Figma:**

```
[Component Name]

Visual:
• Text color: {hex} on {hex} = {ratio}:1 ✅ WCAG AA
• Border: {hex} on {hex} = {ratio}:1 ✅ UI Component
• Touch target: 48x48px ✅

Keyboard:
• Tab - Focus element
• Enter - Activate
• Escape - Close (if applicable)

ARIA:
• role="{role}"
• aria-label="{label}" (if icon-only)
• aria-expanded="{state}" (if expandable)

Notes:
• {Any special considerations}
```

---

## Common Design Mistakes

### Mistake #1: Low Contrast Placeholder Text
**❌ Problem:** `color: #CCCCCC` on white = 1.6:1
**✅ Solution:** `color: #6B7280` on white = 4.6:1

---

### Mistake #2: Color-Only Error States
**❌ Problem:** Red border only indicates error
**✅ Solution:** Red border + Error icon + Error text

---

### Mistake #3: No Focus Indicators
**❌ Problem:** Default browser focus removed with `outline: none`
**✅ Solution:** Custom focus state with 2-3px visible border/outline

---

### Mistake #4: Small Touch Targets
**❌ Problem:** 20x20px button
**✅ Solution:** 24x24px minimum (WCAG 2.2), 44x44px recommended

---

### Mistake #5: Icon Buttons Without Labels
**❌ Problem:** [X] button with no label
**✅ Solution:** Annotate with `aria-label="Close menu"`

---

## Resources

- **WCAG Quick Reference:** https://www.w3.org/WAI/WCAG22/quickref/
- **WebAIM Contrast Checker:** https://webaim.org/resources/contrastchecker/
- **ARIA Patterns:** https://www.w3.org/WAI/ARIA/apg/patterns/
- **Material Design Accessibility:** https://m3.material.io/foundations/accessible-design
- **Apple Human Interface Guidelines - Accessibility:** https://developer.apple.com/design/human-interface-guidelines/accessibility

---

## Collaboration

**With Developers:**
- Provide design files with accessibility annotations
- Specify keyboard interactions
- Document ARIA requirements
- Be available for questions during implementation

**With QA:**
- Review accessibility test results
- Adjust designs if contrast/usability issues found
- Iterate based on screen reader testing feedback

**With Product:**
- Include accessibility requirements in acceptance criteria
- Ensure timelines account for accessible design
- Advocate for accessibility in feature prioritization

---

**Last Updated:** October 2025
