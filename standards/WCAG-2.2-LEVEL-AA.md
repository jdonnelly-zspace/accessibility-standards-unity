# WCAG 2.2 Level AA Compliance Checklist

**Target:** WCAG 2.2 Level AA (includes all Level A criteria)
**Last Updated:** October 2025
**Based on:** W3C Web Content Accessibility Guidelines 2.2

---

## Overview

Level AA is the **recommended minimum standard** for web accessibility. It satisfies:
- ✅ US Section 508 requirements
- ✅ EU EN 301 549 requirements
- ✅ ADA Title III (web accessibility)
- ✅ Most international accessibility laws

---

## Implementation Checklist

Use this checklist to verify compliance. Each criterion includes:
- **Success Criterion** number and name
- **Level** (A or AA)
- **What it means** in plain language
- **How to test** it
- **Common issues** to avoid

---

## Principle 1: Perceivable

### 1.1 Text Alternatives

#### ✅ 1.1.1 Non-text Content (Level A)

**Requirement:** All images, icons, and non-text content must have text alternatives.

**Implementation:**
```html
<!-- Images -->
<img src="photo.jpg" alt="Team celebrating product launch" />

<!-- Decorative images -->
<img src="decoration.svg" alt="" />

<!-- Icon buttons -->
<button aria-label="Close menu">
  <i class="fa fa-times"></i>
</button>
```

**Testing:**
- [ ] All `<img>` tags have `alt` attributes
- [ ] Decorative images use empty alt (`alt=""`)
- [ ] Icon-only buttons have `aria-label`
- [ ] FontAwesome icons are properly labeled

**Tools:**
- axe DevTools
- WAVE browser extension
- ESLint `jsx-a11y/alt-text` rule

---

### 1.3 Adaptable

#### ✅ 1.3.1 Info and Relationships (Level A)

**Requirement:** Structure and relationships must be programmatically determined.

**Implementation:**
```html
<!-- Use semantic HTML -->
<header>
  <nav aria-label="Main navigation">...</nav>
</header>
<main id="main-content">
  <article>
    <h1>Page Title</h1>
    <h2>Section Title</h2>
    <h3>Subsection</h3>
  </article>
</main>
<footer>...</footer>
```

**Testing:**
- [ ] Proper heading hierarchy (H1 → H2 → H3)
- [ ] Only one H1 per page
- [ ] Semantic HTML elements (`<header>`, `<nav>`, `<main>`, `<footer>`)
- [ ] Form labels associated with inputs
- [ ] Tables use `<th>` for headers

**Tools:**
- Browser DevTools (inspect semantic structure)
- HeadingsMap browser extension
- axe DevTools

---

#### ✅ 1.3.2 Meaningful Sequence (Level A)

**Requirement:** Content order must be meaningful when presented sequentially.

**Implementation:**
- Use logical source order in HTML
- Tab order matches visual order
- CSS doesn't create confusing visual order

**Testing:**
- [ ] Tab through page - order makes sense
- [ ] Turn off CSS - content still makes sense
- [ ] Screen reader announces content in logical order

**Tools:**
- Keyboard navigation (Tab key)
- Screen reader testing

---

### 1.4 Distinguishable

#### ✅ 1.4.1 Use of Color (Level A)

**Requirement:** Color is not the only visual means of conveying information.

**Implementation:**
```html
<!-- Bad: Color only -->
<span style="color: red;">Error</span>

<!-- Good: Icon + color + text -->
<span class="error">
  <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
  Error: Email is required
</span>

<!-- Good: Underlined links -->
<a href="..." class="underline">Link text</a>
```

**Testing:**
- [ ] Links are underlined or have distinct styling beyond color
- [ ] Error messages use icons/text, not just red color
- [ ] Required fields indicated with asterisk, not just color
- [ ] Charts/graphs use patterns or labels, not just colors

---

#### ✅ 1.4.3 Contrast (Minimum) - Level AA ⭐

**Requirement:** Text must have a contrast ratio of at least:
- **4.5:1** for normal text (< 18pt or < 14pt bold)
- **3.1** for large text (≥ 18pt or ≥ 14pt bold)
- **3:1** for UI components and graphical objects

**Implementation:**
```css
/* Good examples */
.high-contrast-text {
  color: #1a1a1a; /* Very dark gray */
  background-color: #ffffff; /* White */
  /* Ratio: 16.32:1 ✅ */
}

.primary-text {
  color: #6366f1; /* Indigo-500 */
  background-color: #1a1a1a; /* Very dark */
  /* Ratio: 5.95:1 ✅ */
}
```

**Testing:**
- [ ] Use WebAIM Contrast Checker
- [ ] Test all text colors against backgrounds
- [ ] Test button/border colors (3:1 minimum)
- [ ] Run axe DevTools color contrast audit

**Tools:**
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- Chrome DevTools (inspect contrast ratio)
- axe DevTools

**My Web App Results:**
- Navbar buttons: 16.32:1 ✅
- Indigo text: 5.95:1 ✅
- Secondary text: 6.99:1 ✅
- Purple borders: 4.13:1 ✅

---

#### ✅ 1.4.4 Resize Text (Level AA) ⭐

**Requirement:** Text can be resized up to 200% without loss of content or functionality.

**Implementation:**
```css
/* Use relative units */
.text {
  font-size: 1rem; /* Good: relative */
  line-height: 1.5; /* Good: unitless */
}

/* Avoid absolute units */
.bad-text {
  font-size: 12px; /* Bad: doesn't scale well */
}
```

**Testing:**
- [ ] Zoom browser to 200%
- [ ] No horizontal scrolling
- [ ] All text is readable
- [ ] No overlapping content

**Tools:**
- Browser zoom (Cmd/Ctrl + "+")

---

#### ✅ 1.4.10 Reflow (Level AA) ⭐

**Requirement:** Content reflows to single column at 320px width without scrolling.

**Implementation:**
```css
/* Responsive design */
@media (max-width: 640px) {
  .grid {
    display: block; /* Stack vertically */
  }
}
```

**Testing:**
- [ ] Resize browser to 320px wide
- [ ] No horizontal scrolling
- [ ] Content adapts to narrow viewport

**Tools:**
- Browser DevTools (responsive mode)

---

#### ✅ 1.4.11 Non-text Contrast (Level AA) ⭐

**Requirement:** UI components and graphical objects have 3:1 contrast ratio.

**Implementation:**
```css
/* Button borders, focus indicators, icons */
.button {
  border: 2px solid #6366f1; /* 3:1+ against background */
}

.focus-visible {
  outline: 2px solid #6366f1; /* 3:1+ against background */
}
```

**Testing:**
- [ ] Focus indicators visible with 3:1 contrast
- [ ] Form input borders meet 3:1
- [ ] Icons/graphics meet 3:1

**Tools:**
- WebAIM Contrast Checker
- axe DevTools

---

## Principle 2: Operable

### 2.1 Keyboard Accessible

#### ✅ 2.1.1 Keyboard (Level A)

**Requirement:** All functionality is available via keyboard.

**Implementation:**
```jsx
// All interactive elements must be keyboard accessible
<button onClick={handleClick}>Click me</button> // ✅ Good
<div onClick={handleClick}>Click me</div> // ❌ Bad - not keyboard accessible

// Custom components need keyboard handlers
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  Custom Button
</div>
```

**Testing:**
- [ ] Tab through all interactive elements
- [ ] All buttons/links reachable
- [ ] Enter/Space activates buttons
- [ ] Escape closes modals/dropdowns
- [ ] Arrow keys navigate menus/lists

**Tools:**
- Keyboard only (disconnect mouse!)
- Browser tab navigation

---

#### ✅ 2.1.2 No Keyboard Trap (Level A)

**Requirement:** Users can navigate away from any component using only keyboard.

**Implementation:**
```jsx
// Modal with keyboard trap prevention
function Modal({ onClose }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return <div role="dialog">...</div>;
}
```

**Testing:**
- [ ] Can exit all modals/dialogs with Escape
- [ ] Can tab out of all components
- [ ] No infinite tab loops

---

### 2.3 Seizures and Physical Reactions

#### ✅ 2.3.3 Animation from Interactions (Level AAA - Bonus)

**Requirement:** Motion animation can be disabled except when essential.

**Implementation:**
```css
/* Respect user's motion preferences */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Testing:**
- [ ] Enable "Reduce motion" in system settings
- [ ] Verify animations are disabled

**Tools:**
- macOS: System Preferences → Accessibility → Display → Reduce Motion
- Windows: Settings → Ease of Access → Display → Show animations

---

### 2.4 Navigable

#### ✅ 2.4.1 Bypass Blocks (Level A)

**Requirement:** Skip navigation mechanism to bypass repeated content.

**Implementation:**
```jsx
// Skip link (first focusable element)
<a href="#main-content" className="skip-link">
  Skip to main content
</a>

// Target for skip link
<main id="main-content">
  {/* Page content */}
</main>
```

```css
/* Show skip link only on focus */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #6366f1;
  color: white;
  padding: 8px;
  text-decoration: none;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

**Testing:**
- [ ] Press Tab on page load
- [ ] Skip link appears
- [ ] Clicking skip link jumps to main content

---

#### ✅ 2.4.2 Page Titled (Level A)

**Requirement:** Web pages have descriptive titles.

**Implementation:**
```jsx
// Using React Helmet
import { Helmet } from 'react-helmet-async';

function BlogPost({ post }) {
  return (
    <>
      <Helmet>
        <title>{post.title} | My Web App</title>
      </Helmet>
      {/* ... */}
    </>
  );
}
```

**Testing:**
- [ ] Every page has unique `<title>` tag
- [ ] Titles describe page content
- [ ] Titles follow pattern: "Page Name | Site Name"

---

#### ✅ 2.4.3 Focus Order (Level A)

**Requirement:** Focus order is logical and meaningful.

**Implementation:**
- Use natural DOM order (don't manipulate with `tabindex` unless necessary)
- Avoid positive `tabindex` values

**Testing:**
- [ ] Tab through page in visual order
- [ ] Focus doesn't jump unexpectedly

---

#### ✅ 2.4.4 Link Purpose (In Context) (Level A)

**Requirement:** Purpose of each link can be determined from link text or context.

**Implementation:**
```jsx
// Bad: Generic link text
<a href="/post">Read more</a>

// Good: Descriptive link text
<a href="/post">Read article: Getting Started with React</a>

// Good: aria-label for context
<a href="/post" aria-label="Read article: Getting Started with React. Learn the basics of React components and hooks.">
  <img src="thumbnail.jpg" alt="" />
  <h3>Getting Started with React</h3>
</a>
```

**Testing:**
- [ ] No "click here" or "read more" without context
- [ ] Links describe their destination
- [ ] Icon links have aria-label

---

#### ✅ 2.4.5 Multiple Ways (Level AA) ⭐

**Requirement:** More than one way to locate pages within a set.

**Implementation:**
- Navigation menu
- Search functionality
- Sitemap page
- Breadcrumbs

**Testing:**
- [ ] Site has navigation menu
- [ ] Site has search
- [ ] Site has sitemap (/sitemap or /sitemap.html)

---

#### ✅ 2.4.6 Headings and Labels (Level AA) ⭐

**Requirement:** Headings and labels describe topic or purpose.

**Implementation:**
```html
<h1>Blog Posts</h1>
<h2>Latest Articles</h2>
<h3>Getting Started with React</h3>

<label for="email">Email Address</label>
<input type="email" id="email" />
```

**Testing:**
- [ ] Headings are descriptive
- [ ] Form labels are clear

---

#### ✅ 2.4.7 Focus Visible (Level AA) ⭐

**Requirement:** Keyboard focus indicator is visible.

**Implementation:**
```css
/* Default browser focus */
button:focus-visible {
  outline: 2px solid #6366f1;
  outline-offset: 2px;
}

/* Custom focus indicator */
.link:focus-visible {
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.5);
}
```

**Testing:**
- [ ] Tab through page
- [ ] Focus indicator clearly visible on all elements
- [ ] Contrast ratio meets 3:1 minimum

**Tools:**
- Keyboard navigation

---

## Principle 3: Understandable

### 3.1 Readable

#### ✅ 3.1.1 Language of Page (Level A)

**Requirement:** Default human language of page is programmatically determined.

**Implementation:**
```html
<!DOCTYPE html>
<html lang="en">
  <head>...</head>
  <body>...</body>
</html>
```

**Testing:**
- [ ] `<html>` tag has `lang` attribute
- [ ] Language code is valid (en, es, fr, etc.)

---

### 3.2 Predictable

#### ✅ 3.2.1 On Focus (Level A)

**Requirement:** Focusing on a component doesn't cause unexpected context change.

**Implementation:**
- Don't auto-submit forms on focus
- Don't auto-navigate on focus
- Don't open modals automatically

**Testing:**
- [ ] Tabbing through page doesn't trigger navigation
- [ ] Focus doesn't open modals automatically

---

#### ✅ 3.2.2 On Input (Level A)

**Requirement:** Changing input doesn't cause unexpected context change.

**Implementation:**
- Require user action (button click) to submit
- Don't auto-navigate on select change

**Testing:**
- [ ] Selecting dropdown doesn't auto-navigate
- [ ] Typing doesn't auto-submit forms

---

#### ✅ 3.2.3 Consistent Navigation (Level AA) ⭐

**Requirement:** Navigation mechanisms appear in same order on multiple pages.

**Implementation:**
- Navigation menu stays in same position
- Same order of nav items across all pages

**Testing:**
- [ ] Navigation consistent across all pages
- [ ] Same relative order maintained

---

### 3.3 Input Assistance

#### ✅ 3.3.2 Labels or Instructions (Level A)

**Requirement:** Labels or instructions provided when content requires user input.

**Implementation:**
```jsx
<label htmlFor="email">
  Email Address <span className="required">*</span>
</label>
<input
  type="email"
  id="email"
  required
  aria-required="true"
  aria-describedby="email-help"
/>
<span id="email-help">We'll never share your email.</span>
```

**Testing:**
- [ ] All form fields have labels
- [ ] Required fields clearly marked
- [ ] Instructions provided for complex inputs

---

## Principle 4: Robust

### 4.1 Compatible

#### ✅ 4.1.1 Parsing (Level A)

**Requirement:** HTML is well-formed (proper opening/closing tags, unique IDs, etc.)

**Implementation:**
- Use valid HTML5
- Validate with W3C validator

**Testing:**
- [ ] Run HTML validator
- [ ] No duplicate IDs
- [ ] All tags properly closed

**Tools:**
- W3C HTML Validator: https://validator.w3.org/

---

#### ✅ 4.1.2 Name, Role, Value (Level A)

**Requirement:** All UI components have accessible name and role.

**Implementation:**
```jsx
// Built-in HTML elements (role is implicit)
<button>Click me</button> {/* role="button" implicit */}
<a href="...">Link</a> {/* role="link" implicit */}

// Custom components need explicit ARIA
<div
  role="button"
  aria-label="Close menu"
  aria-pressed="false"
  tabIndex={0}
>
  ×
</div>
```

**Testing:**
- [ ] All buttons have accessible names
- [ ] All links have text or aria-label
- [ ] Custom components have proper ARIA roles
- [ ] State changes communicated (aria-expanded, aria-pressed)

**Tools:**
- axe DevTools
- Screen reader testing

---

## Testing Checklist

### Automated Testing (Run on every build)

- [ ] **ESLint** with jsx-a11y plugin
- [ ] **Playwright** with axe-core
- [ ] **Lighthouse** accessibility audit (95+ score)

### Manual Testing (Before release)

- [ ] **Keyboard navigation** - Tab through all pages
- [ ] **Screen reader** - Test with VoiceOver/NVDA/JAWS
- [ ] **Color contrast** - Verify all ratios
- [ ] **Zoom to 200%** - Verify no content loss
- [ ] **Resize to 320px** - Verify no horizontal scroll
- [ ] **Reduced motion** - Test with OS setting enabled

### Browser Testing

- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers

---

## Tools & Resources

### Free Testing Tools

1. **Chrome DevTools Lighthouse** - Built-in accessibility audit
2. **axe DevTools Extension** - Automated testing
3. **WAVE Extension** - Visual accessibility evaluation
4. **WebAIM Contrast Checker** - Color contrast testing
5. **Screen Readers:**
   - macOS: VoiceOver (Cmd+F5)
   - Windows: NVDA (free download)
   - Linux: Orca

### Reference Documentation

- W3C WCAG 2.2: https://www.w3.org/WAI/WCAG22/quickref/
- MDN Accessibility: https://developer.mozilla.org/en-US/docs/Web/Accessibility
- WebAIM Articles: https://webaim.org/articles/
- ARIA Authoring Practices: https://www.w3.org/WAI/ARIA/apg/

---

## Compliance Statement Template

```
This website is committed to ensuring digital accessibility for people with disabilities.
We are continually improving the user experience for everyone and applying the relevant
accessibility standards.

Conformance Status: Fully Conformant
Standards: WCAG 2.2 Level AA

Date: [Month Year]
Last Reviewed: [Month Year]
```

---

**Last Updated:** October 2025
**Version:** WCAG 2.2 (October 2023)
