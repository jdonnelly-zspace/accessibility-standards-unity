# WCAG 2.2 Migration Guide

**From WCAG 2.1 to WCAG 2.2: A Practical Implementation Guide**

This guide helps teams migrate from WCAG 2.1 to WCAG 2.2, focusing on the 9 new success criteria and practical implementation steps.

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [What's New in WCAG 2.2](#whats-new-in-wcag-22)
3. [Quick Wins (Easy Implementations)](#quick-wins-easy-implementations)
4. [Medium Complexity Changes](#medium-complexity-changes)
5. [Complex/Long-term Changes](#complexlong-term-changes)
6. [Migration Checklist](#migration-checklist)
7. [Timeline Recommendations](#timeline-recommendations)
8. [Testing Strategy](#testing-strategy)
9. [Common Pitfalls](#common-pitfalls)

---

## Executive Summary

**Good News:** WCAG 2.2 has **no breaking changes**. All WCAG 2.1 conformance is still valid.

**What Changed:**
- **9 new success criteria added** (all Level A or AA)
- **0 criteria removed**
- **0 criteria modified**
- Focus: Mobile accessibility, cognitive disabilities, low vision users

**Timeline:** Most teams can achieve WCAG 2.2 compliance in **2-4 weeks** of focused work.

**Compliance Date:** WCAG 2.2 became a W3C Recommendation on **October 5, 2023**. Many regulations now reference WCAG 2.2.

---

## What's New in WCAG 2.2

### New Success Criteria Overview

| Criterion | Level | Difficulty | Impact |
|-----------|-------|------------|--------|
| 2.4.11 Focus Not Obscured (Minimum) | AA | Easy | Medium |
| 2.4.12 Focus Not Obscured (Enhanced) | AAA | Easy | Low |
| 2.4.13 Focus Appearance | AAA | Medium | Low |
| 2.5.7 Dragging Movements | AA | Medium | High |
| 2.5.8 Target Size (Minimum) | AA | Easy | High |
| 3.2.6 Consistent Help | A | Easy | Medium |
| 3.3.7 Redundant Entry | A | Easy | High |
| 3.3.8 Accessible Authentication (Minimum) | AA | Medium | High |
| 3.3.9 Accessible Authentication (Enhanced) | AAA | Hard | Low |

**For Level AA compliance, you need to implement 6 of these criteria** (excluding AAA).

### The 9 New Criteria Explained

#### 1. 2.4.11 Focus Not Obscured (Minimum) - Level AA ⭐

**What:** Focused elements must not be completely hidden by sticky headers, footers, or other content.

**Impact:** Medium - affects sites with fixed/sticky UI elements

**Why it matters:** Users navigating by keyboard couldn't see what they focused on when sticky headers covered it.

**Quick fix:**
```css
/* Add scroll padding to account for sticky header */
html {
  scroll-padding-top: 80px; /* Height of your sticky header */
}
```

---

#### 2. 2.5.7 Dragging Movements - Level AA ⭐

**What:** All drag-and-drop functionality must have a single-pointer alternative (no dragging required).

**Impact:** High - affects drag-and-drop lists, file uploads, sliders, maps

**Why it matters:** Users with motor impairments can't perform precise dragging motions.

**Quick fix:**
```jsx
// Add buttons alongside drag handles
<button onClick={moveUp}>↑ Move Up</button>
<button onClick={moveDown}>↓ Move Down</button>
```

**Affects:**
- Sortable lists
- File upload drag zones
- Range sliders
- Rearrangeable dashboards

---

#### 3. 2.5.8 Target Size (Minimum) - Level AA ⭐

**What:** Interactive elements must be at least **24x24 CSS pixels** (reduced from 44x44 in WCAG 2.1 Level AAA).

**Impact:** High - affects all buttons, links, form controls

**Why it matters:** Small touch targets are difficult for users with motor impairments or on mobile devices.

**Quick fix:**
```css
/* Ensure minimum touch target size */
button, a, input, select {
  min-height: 24px;
  min-width: 24px;
}

/* Or add padding */
.icon-button {
  padding: 8px; /* Icon + padding = 24px total */
}
```

**Note:** 24x24 is now the minimum, but 44x44 is still recommended for better usability.

---

#### 4. 3.2.6 Consistent Help - Level A ⭐

**What:** If help mechanisms (chat, phone, email, etc.) appear on multiple pages, they must be in the same relative order.

**Impact:** Medium - affects sites with help widgets/links

**Why it matters:** Users with cognitive disabilities rely on consistent placement to find help.

**Quick fix:**
```jsx
// Put help in the same place on every page (header, footer, or floating widget)
<Footer>
  <a href="/help">Help</a>
  <a href="/contact">Contact</a>
  <a href="tel:1-800-555-0100">Call Us</a>
</Footer>
```

**Passes:** Help in footer on all pages, same order
**Fails:** Help in header on some pages, footer on others

---

#### 5. 3.3.7 Redundant Entry - Level A ⭐

**What:** Don't make users re-enter information they already provided in the same session.

**Impact:** High - affects multi-step forms, checkout flows

**Why it matters:** Re-entering data is frustrating and error-prone, especially for users with cognitive or motor impairments.

**Quick fix:**
```jsx
// Auto-populate from previous step
<label>
  <input type="checkbox" onChange={(e) => {
    if (e.target.checked) {
      setShippingAddress(billingAddress);
    }
  }} />
  Shipping address same as billing
</label>

// OR: Use autocomplete attributes
<input
  type="email"
  name="email"
  autocomplete="email"
/>
```

**Passes:** "Same as billing" checkbox, autocomplete attributes
**Fails:** Making users type same address twice

---

#### 6. 3.3.8 Accessible Authentication (Minimum) - Level AA ⭐

**What:** Authentication must not rely on cognitive function tests (memorizing passwords, solving puzzles). Must support password managers, paste, or alternatives.

**Impact:** High - affects login pages, authentication flows

**Why it matters:** Memorizing complex passwords is difficult for users with cognitive disabilities.

**Quick fix:**
```html
<!-- Enable password managers and paste -->
<input
  type="password"
  autocomplete="current-password"
  /* DO NOT add: oncopy="return false" */
  /* DO NOT add: onpaste="return false" */
/>

<!-- Provide alternative authentication -->
<button type="button" onclick="sendMagicLink()">
  Email me a login link
</button>
```

**Passes:** Password manager support, paste enabled, magic link option
**Fails:** Disabling paste, CAPTCHAs requiring cognitive tests, "type your password" from memory

---

#### 7. 2.4.12 Focus Not Obscured (Enhanced) - Level AAA

**What:** Focused elements must not be partially obscured at all (more strict than 2.4.11).

**Impact:** Low (AAA only)

**Note:** Most teams target Level AA, so this is optional.

---

#### 8. 2.4.13 Focus Appearance - Level AAA

**What:** Focus indicators must meet specific size and contrast requirements.

**Impact:** Low (AAA only)

**Note:** Optional for Level AA compliance.

---

#### 9. 3.3.9 Accessible Authentication (Enhanced) - Level AAA

**What:** Authentication must not require any cognitive function tests, even with alternatives.

**Impact:** Low (AAA only)

**Note:** Optional for Level AA compliance.

---

## Quick Wins (Easy Implementations)

These can be done in **1-2 days**:

### 1. Enable Paste in Password Fields
```html
<!-- Remove any paste prevention -->
<input type="password" autocomplete="current-password" />
<!-- DO NOT: onpaste="return false" -->
```

### 2. Add Autocomplete Attributes
```html
<input type="email" name="email" autocomplete="email" />
<input type="tel" name="phone" autocomplete="tel" />
<input type="text" name="address" autocomplete="street-address" />
```

### 3. Fix Small Touch Targets
```css
button, a, input[type="checkbox"], input[type="radio"] {
  min-height: 24px;
  min-width: 24px;
}
```

### 4. Add scroll-padding for Sticky Headers
```css
html {
  scroll-padding-top: 80px;
}
```

### 5. Consistent Help Placement
- Put help links in same place (footer/header) on all pages
- Use same order: Help, Contact, Phone

**Estimated Time:** 1-2 days
**Impact:** Addresses 4 of 6 Level AA criteria partially

---

## Medium Complexity Changes

These require **1-2 weeks**:

### 1. Drag-and-Drop Alternatives (SC 2.5.7)

**Current:** Sortable list with drag handles only
```jsx
<div draggable="true">Item 1</div>
```

**Fix:** Add button alternatives
```jsx
<div>
  Item 1
  <button onClick={moveUp}>↑</button>
  <button onClick={moveDown}>↓</button>
</div>
```

**Affected Components:**
- Sortable lists
- Dashboard widgets
- File upload zones (add click-to-upload button)
- Range sliders (add number input alternative)

---

### 2. Authentication Alternatives (SC 3.3.8)

**Current:** Password-only login
```jsx
<form>
  <input type="password" />
  <button>Login</button>
</form>
```

**Fix:** Add magic link or OAuth
```jsx
<form>
  <input type="password" autocomplete="current-password" />
  <button>Login</button>
</form>

<!-- Alternative authentication -->
<button onClick={sendMagicLink}>
  Email me a login link
</button>

<!-- OR OAuth -->
<button onClick={googleSignIn}>
  Sign in with Google
</button>
```

---

### 3. Redundant Entry Prevention (SC 3.3.7)

**Current:** Multi-step form repeats address entry
```jsx
// Step 1: Billing address
// Step 2: User types shipping address again
```

**Fix:** Auto-populate or offer checkbox
```jsx
<label>
  <input type="checkbox" onChange={copyBillingToShipping} />
  Shipping address same as billing
</label>
```

**Estimated Time:** 1-2 weeks
**Impact:** Completes 3 critical Level AA criteria

---

## Complex/Long-term Changes

These may require **2-4 weeks**:

### 1. Comprehensive Drag-and-Drop Redesign

If your app heavily relies on drag-and-drop:
- Kanban boards
- Page builders
- Complex sortable interfaces

**Solution:**
- Click-to-select, click-to-place pattern
- Keyboard shortcuts (Ctrl+Arrow to move)
- Context menu with "Move to..." options

---

### 2. Authentication System Overhaul

If you have complex authentication:
- Custom CAPTCHA systems
- Memory-based security questions
- Complex password requirements

**Solution:**
- Implement WebAuthn/Passkeys
- Add magic link authentication
- Replace cognitive CAPTCHAs with invisible reCAPTCHA

---

### 3. Form Flow Optimization

For complex multi-step processes:
- Checkout flows
- Application wizards
- Account setup

**Solution:**
- Implement session storage
- Add autocomplete to all fields
- Save progress automatically
- Pre-populate from previous steps

**Estimated Time:** 2-4 weeks
**Impact:** Full WCAG 2.2 Level AA compliance

---

## Migration Checklist

Use this checklist to track your WCAG 2.2 migration:

### Phase 1: Quick Wins (Week 1)
- [ ] Remove `onpaste="return false"` from password fields
- [ ] Add `autocomplete` attributes to all form fields
- [ ] Audit interactive elements, ensure 24x24px minimum size
- [ ] Add `scroll-padding-top` for sticky headers
- [ ] Ensure help links in consistent location/order across pages
- [ ] Enable password manager support (`autocomplete="current-password"`)

### Phase 2: Medium Changes (Week 2-3)
- [ ] Add button alternatives to all drag-and-drop components
- [ ] Add "Same as billing" checkbox to multi-step forms
- [ ] Implement magic link or OAuth alternative authentication
- [ ] Add click-to-upload button to file drop zones
- [ ] Add number input alternative to range sliders
- [ ] Test all forms with autocomplete enabled

### Phase 3: Testing & Validation (Week 3-4)
- [ ] Test keyboard navigation with sticky headers (focus visible?)
- [ ] Test all drag-drop alternatives work without dragging
- [ ] Measure all interactive elements (24x24px minimum?)
- [ ] Verify help mechanisms in same order on all pages
- [ ] Test forms don't require redundant entry
- [ ] Test authentication with password manager
- [ ] Test authentication alternatives (magic link, OAuth)

### Phase 4: Documentation & Training
- [ ] Update design system with 24x24px minimum target size
- [ ] Document drag-drop alternative patterns
- [ ] Update authentication documentation
- [ ] Train team on new WCAG 2.2 requirements
- [ ] Update accessibility checklist for new features

---

## Timeline Recommendations

### Small Site/App (< 50 pages)
- **Week 1:** Quick wins (paste, autocomplete, touch targets)
- **Week 2:** Medium changes (drag-drop, auth alternatives)
- **Week 3:** Testing and fixes
- **Week 4:** Documentation and team training

**Total: 4 weeks**

### Medium Site/App (50-500 pages)
- **Week 1-2:** Audit and quick wins across all pages
- **Week 3-4:** Medium changes (drag-drop, auth)
- **Week 5-6:** Testing, fixes, edge cases
- **Week 7-8:** Documentation, training, compliance verification

**Total: 8 weeks**

### Large Site/App (> 500 pages)
- **Month 1:** Audit, planning, quick wins
- **Month 2:** Medium changes, component library updates
- **Month 3:** Testing, fixes, page-by-page verification
- **Month 4:** Documentation, training, compliance certification

**Total: 4 months**

---

## Testing Strategy

### Automated Testing

**Add to your test suite:**

```javascript
// Playwright test examples

// SC 2.5.8: Target Size
test('interactive elements meet 24x24 minimum', async ({ page }) => {
  const buttons = await page.locator('button, a, input, select').all();
  for (const button of buttons) {
    const box = await button.boundingBox();
    expect(box.width).toBeGreaterThanOrEqual(24);
    expect(box.height).toBeGreaterThanOrEqual(24);
  }
});

// SC 3.3.7: Redundant Entry (autocomplete)
test('form fields have autocomplete', async ({ page }) => {
  const emailInputs = await page.locator('input[type="email"]').all();
  for (const input of emailInputs) {
    const autocomplete = await input.getAttribute('autocomplete');
    expect(autocomplete).toBe('email');
  }
});

// SC 3.3.8: Accessible Authentication (paste enabled)
test('password fields allow paste', async ({ page }) => {
  const passwordInput = page.locator('input[type="password"]');

  // Should NOT have onpaste="return false"
  const onpaste = await passwordInput.getAttribute('onpaste');
  expect(onpaste).toBeNull();
});
```

### Manual Testing Checklist

**SC 2.4.11 Focus Not Obscured:**
- [ ] Tab through page with sticky header
- [ ] Verify focused element is visible (not hidden by header)

**SC 2.5.7 Dragging Movements:**
- [ ] Try to complete all drag-drop tasks without dragging
- [ ] Verify button/keyboard alternatives work

**SC 2.5.8 Target Size:**
- [ ] Use browser DevTools to measure interactive elements
- [ ] All elements at least 24x24 CSS pixels

**SC 3.2.6 Consistent Help:**
- [ ] Visit multiple pages
- [ ] Verify help links in same relative order

**SC 3.3.7 Redundant Entry:**
- [ ] Complete multi-step forms
- [ ] Verify no information re-entered

**SC 3.3.8 Accessible Authentication:**
- [ ] Test with password manager (1Password, LastPass)
- [ ] Verify paste works in password field
- [ ] Check alternative auth methods available

### Browser DevTools Scripts

**Measure all touch targets:**
```javascript
// Run in browser console
document.querySelectorAll('button, a, input, select').forEach(el => {
  const rect = el.getBoundingClientRect();
  if (rect.width < 24 || rect.height < 24) {
    console.log('Too small:', el, `${rect.width}x${rect.height}px`);
  }
});
```

**Check autocomplete:**
```javascript
document.querySelectorAll('input').forEach(input => {
  if (!input.getAttribute('autocomplete')) {
    console.log('Missing autocomplete:', input, input.type);
  }
});
```

---

## Common Pitfalls

### ❌ Pitfall 1: Confusing 24x24 CSS pixels with device pixels
**Wrong:** Setting actual SVG icon to 24x24
**Right:** Ensuring total clickable area (icon + padding) = 24x24 CSS pixels

```css
/* Wrong */
.icon-button svg {
  width: 24px;
  height: 24px;
}

/* Right */
.icon-button {
  padding: 8px; /* 16px icon + 16px padding = 24px total */
}
```

---

### ❌ Pitfall 2: Only adding drag-drop alternative on some instances
**Wrong:** Main sortable list has buttons, but settings page doesn't
**Right:** All drag-drop functionality has alternatives everywhere

---

### ❌ Pitfall 3: Disabling paste for "security"
**Wrong:** `onpaste="return false"` on password field
**Right:** Enable paste, rely on strong password requirements instead

---

### ❌ Pitfall 4: Inconsistent help across sections
**Wrong:**
- Marketing pages: Help in header
- App dashboard: Help in footer
- Settings: No help link

**Right:** Same placement and order everywhere

---

### ❌ Pitfall 5: "Same as above" checkbox that doesn't work properly
**Wrong:** Checkbox copies address but doesn't update when original changes
**Right:** Live binding or copy on checkbox change

---

### ❌ Pitfall 6: Only testing on desktop
**Wrong:** Drag-drop works on desktop with mouse
**Right:** Test on mobile, with keyboard, with assistive tech

---

## Resources

### Official Documentation
- [WCAG 2.2 Specification](https://www.w3.org/TR/WCAG22/)
- [What's New in WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)
- [Understanding WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/)

### Testing Tools
- [axe DevTools](https://www.deque.com/axe/devtools/) - Browser extension
- [WAVE](https://wave.webaim.org/) - Web accessibility evaluation
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Built into Chrome
- [Pa11y](https://pa11y.org/) - Automated testing CLI

### This Repository
- [WCAG-2.2-LEVEL-AA.md](./WCAG-2.2-LEVEL-AA.md) - Complete criteria documentation
- [Component Examples](../implementation/development/components/) - React implementation examples
- [Playwright Tests](../implementation/testing/playwright-setup/) - Automated test examples
- [Workflows](../workflows/) - Team process documentation

---

## Quick Reference Card

Print this out and keep it handy:

```
╔════════════════════════════════════════════════════════════╗
║           WCAG 2.2 LEVEL AA - NEW CRITERIA                 ║
╠════════════════════════════════════════════════════════════╣
║ 2.4.11 Focus Not Obscured (Minimum)                       ║
║   → Sticky headers can't hide focused elements             ║
║   → Fix: scroll-padding-top                                ║
║                                                            ║
║ 2.5.7 Dragging Movements                                  ║
║   → All drag-drop needs non-drag alternative               ║
║   → Fix: Add up/down buttons                               ║
║                                                            ║
║ 2.5.8 Target Size (Minimum)                               ║
║   → All interactive elements ≥ 24x24 CSS pixels            ║
║   → Fix: min-width: 24px; min-height: 24px;               ║
║                                                            ║
║ 3.2.6 Consistent Help                                     ║
║   → Help links in same order on all pages                  ║
║   → Fix: Consistent footer/header                          ║
║                                                            ║
║ 3.3.7 Redundant Entry                                     ║
║   → Don't make users re-enter information                  ║
║   → Fix: "Same as billing" checkbox, autocomplete          ║
║                                                            ║
║ 3.3.8 Accessible Authentication (Minimum)                 ║
║   → Support password managers, paste, alternatives         ║
║   → Fix: autocomplete="current-password", magic link       ║
╚════════════════════════════════════════════════════════════╝
```

---

## Summary

**WCAG 2.2 is achievable!** Most of the new criteria are straightforward:

✅ **Easy wins:** Enable paste, add autocomplete, fix touch targets (1-2 days)
✅ **Medium effort:** Add drag-drop alternatives, "same as" checkboxes (1-2 weeks)
✅ **Larger effort:** Authentication alternatives (2-4 weeks)

**Start with quick wins, then tackle medium complexity changes. Most teams achieve full compliance in 2-8 weeks.**

**Need help?** Reference the [complete WCAG 2.2 documentation](./WCAG-2.2-LEVEL-AA.md) with React code examples for every criterion.

---

**Document Version:** 1.0
**Last Updated:** 2025-10-13
**Next Review:** When WCAG 2.3 is released
