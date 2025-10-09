# QA Workflow - Accessibility Testing

This guide shows QA engineers how to test for accessibility compliance using automated and manual testing methods.

---

## Quick Reference

**Test Coverage Required:**
1. ✅ Automated tests (Playwright + axe-core)
2. ✅ Manual keyboard testing
3. ✅ Manual screen reader testing
4. ✅ Color contrast verification
5. ✅ Browser/device testing

**Target Scores:**
- Lighthouse Accessibility: **95+**
- axe DevTools: **0 violations**
- Manual checklist: **100% pass**

---

## Testing Workflow

### Phase 1: Automated Testing (Every Build)

#### Run Playwright Accessibility Tests

```bash
# Run all accessibility tests
npx playwright test accessibility

# Run specific test
npx playwright test accessibility.spec.js

# Interactive mode
npx playwright test --ui

# See report
npx playwright show-report
```

**Expected Results:**
- ✅ All tests pass
- ✅ 0 axe-core violations
- ✅ No console errors

**If Tests Fail:**
1. Review violation details in report
2. Screenshot shows affected element
3. Link to WCAG criterion
4. Create bug with details + screenshot

---

#### Run Lighthouse Audit

**Steps:**
1. Open page in Chrome
2. Open DevTools (F12)
3. Go to Lighthouse tab
4. Check only "Accessibility"
5. Click "Analyze page load"

**Acceptance Criteria:**
- Score: **95+**
- No errors in "Accessibility" section
- All best practices met

**Common Issues:**
| Issue | WCAG | Fix |
|-------|------|-----|
| Image missing alt text | 1.1.1 | Add alt attribute |
| Low contrast text | 1.4.3 | Increase contrast to 4.5:1+ |
| Missing form labels | 3.3.2 | Add label with htmlFor |
| Heading order skip | 1.3.1 | Fix H1 → H2 → H3 order |

---

### Phase 2: Manual Keyboard Testing (Every Feature)

#### Keyboard Testing Checklist

**Navigation:**
- [ ] Press Tab - focus moves to first interactive element (skip link)
- [ ] Continue Tab - focus moves through all elements in logical order
- [ ] Press Shift+Tab - focus moves backward
- [ ] Focus indicator clearly visible on all elements
- [ ] No keyboard traps (can Tab away from everything)

**Interactive Elements:**
- [ ] Enter key activates buttons and links
- [ ] Space bar activates buttons and toggles checkboxes
- [ ] Arrow keys navigate within menus/dropdowns (if applicable)
- [ ] Escape key closes modals and dropdowns

**Test Cases:**
```
Test: Homepage Navigation
1. Load homepage
2. Press Tab → Skip link appears
3. Press Tab repeatedly → Navigate through navbar, hero, blog cards, footer
4. Verify: Focus order matches visual order
5. Verify: All elements have visible focus indicator

Test: Modal Dialog
1. Open modal via keyboard (Tab to button, press Enter)
2. Verify: Modal opens and receives focus
3. Press Tab → Focus stays within modal
4. Press Escape → Modal closes
5. Verify: Focus returns to trigger button

Test: Dropdown Menu
1. Tab to dropdown button
2. Press Enter → Dropdown opens
3. Press Arrow keys → Navigate options
4. Press Escape → Dropdown closes
5. Press Tab → Move to next element
```

**Bug Report Template:**
```
Title: [Element] not keyboard accessible
Description: [Describe what doesn't work]
Steps to Reproduce:
1. Navigate to [page]
2. Press Tab to [element]
3. Press [key]
Expected: [What should happen]
Actual: [What actually happens]
WCAG Criterion: 2.1.1 Keyboard (Level A)
Severity: High
Screenshots: [Attach]
```

---

### Phase 3: Screen Reader Testing (Major Features)

#### VoiceOver (Mac) Testing

**Enable VoiceOver:**
- Cmd + F5

**Basic Navigation:**
- VO + A: Read entire page
- VO + Right Arrow: Next item
- VO + Left Arrow: Previous item
- VO + Cmd + H: Next heading
- VO + U: Rotor menu (headings, links, landmarks)

*VO = Ctrl + Option*

**Test Checklist:**
- [ ] Page title announced on load
- [ ] All landmarks identified (nav, main, footer)
- [ ] Heading hierarchy makes sense (H1 → H2 → H3)
- [ ] All images have alt text (or aria-label)
- [ ] Links describe their destination
- [ ] Buttons describe their action
- [ ] Form fields have labels
- [ ] Error messages announced

**Example Test:**
```
Test: Blog Post Card
1. Navigate to blog card
2. Listen to announcement
3. Verify: Includes title, excerpt, category
4. Expected: "Read article: [Title]. [Excerpt]. Categories: [Tags]"
```

---

#### NVDA (Windows) Testing

**Download:** https://www.nvaccess.org/ (Free)

**Basic Navigation:**
- NVDA + Down Arrow: Next line
- NVDA + Up Arrow: Previous line
- H: Next heading
- K: Next link
- B: Next button
- F: Next form field

*NVDA = Insert or Caps Lock*

**Same checklist as VoiceOver applies**

---

### Phase 4: Color Contrast Testing

#### WebAIM Contrast Checker

**URL:** https://webaim.org/resources/contrastchecker/

**Process:**
1. Identify text color (use browser DevTools color picker)
2. Identify background color
3. Enter both in WebAIM Contrast Checker
4. Verify ratio meets requirements:
   - **4.5:1** minimum for normal text (< 18pt)
   - **3:1** minimum for large text (≥ 18pt or ≥ 14pt bold)
   - **3:1** minimum for UI components (borders, icons)

**Elements to Test:**
- [ ] All body text
- [ ] Headings
- [ ] Link text
- [ ] Button text
- [ ] Form labels
- [ ] Error messages
- [ ] Placeholder text
- [ ] Focus indicators
- [ ] Border colors

**Chrome DevTools Shortcut:**
1. Inspect element
2. Click color swatch in Styles panel
3. See contrast ratio with AA/AAA indicators

---

### Phase 5: Responsive Testing

#### Zoom Testing (WCAG 1.4.4)

**Test:**
1. Zoom browser to 200% (Cmd/Ctrl + "+")
2. Verify:
   - [ ] All text is readable
   - [ ] No content is cut off
   - [ ] No horizontal scrolling
   - [ ] Layouts adapt appropriately

**Common Issues:**
- Text overlaps
- Fixed widths cause horizontal scroll
- Content hidden/truncated

---

#### Mobile Viewport Testing (WCAG 1.4.10)

**Test:**
1. Resize browser to 320px wide (iPhone SE size)
2. Verify:
   - [ ] Content reflows to single column
   - [ ] No horizontal scrolling
   - [ ] All functionality available
   - [ ] Touch targets ≥ 44x44 pixels

**DevTools:**
1. F12 → Toggle device toolbar
2. Select "Responsive"
3. Set width to 320px

---

### Phase 6: Cross-Browser Testing

**Required Browsers:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

**Focus Areas:**
- Keyboard navigation works in all browsers
- Focus indicators visible in all browsers
- ARIA attributes supported
- No browser-specific bugs

---

## Test Scenarios Library

### Homepage
```
✓ Page title is descriptive
✓ Skip navigation link present
✓ All images have alt text
✓ Heading hierarchy (one H1, logical H2/H3)
✓ Keyboard navigation complete
✓ Color contrast passes
✓ Zoom to 200% - no issues
✓ Screen reader announces all content
```

### Blog Post Page
```
✓ Breadcrumb navigation accessible
✓ Article has proper semantic structure
✓ Read time / metadata accessible
✓ Category tags keyboard navigable
✓ Social share buttons have labels
✓ "Back to Home" button keyboard accessible
```

### Forms
```
✓ All inputs have labels
✓ Required fields marked (visual + aria-required)
✓ Error messages associated (aria-describedby)
✓ Error messages announced by screen reader
✓ Submit button keyboard accessible
✓ Focus visible on all form fields
```

### Modals
```
✓ Modal opens with keyboard (Enter on trigger)
✓ Focus moves to modal on open
✓ Tab trapped within modal
✓ Escape key closes modal
✓ Focus returns to trigger on close
✓ Modal has role="dialog" and aria-modal="true"
```

---

## Bug Severity Guidelines

**Critical (P0) - Blocks users:**
- Keyboard trap (cannot escape element)
- Required functionality unavailable via keyboard
- Screen reader cannot access main content
- Contrast ratio < 3:1 on primary text

**High (P1) - Significant barrier:**
- Missing alt text on important images
- Form without labels
- Heading hierarchy broken
- No skip navigation
- Contrast ratio 3:1 - 4.5:1

**Medium (P2) - Usability issue:**
- Generic link text ("click here")
- Missing ARIA labels on icon buttons
- Focus indicator not visible enough
- Inconsistent navigation

**Low (P3) - Enhancement:**
- Decorative image has descriptive alt (should be empty)
- Minor contrast issues on non-essential text
- Redundant ARIA

---

## Tools Reference

**Automated:**
- Lighthouse (Chrome DevTools)
- axe DevTools (browser extension)
- WAVE (browser extension)
- Playwright + axe-core (CI/CD)

**Manual:**
- WebAIM Contrast Checker
- VoiceOver (macOS)
- NVDA (Windows)
- Keyboard only

**Documentation:**
- `/standards/WCAG-2.2-LEVEL-AA.md` - Complete checklist
- `/resources/TOOLS-CATALOG.md` - All testing tools

---

## Reporting

### Test Report Template

```markdown
# Accessibility Test Report

**Date:** YYYY-MM-DD
**Tester:** [Name]
**Build:** [Version/Commit]
**Pages Tested:** [List]

## Automated Testing

| Tool | Score/Result |
|------|--------------|
| Lighthouse | 98/100 ✅ |
| axe DevTools | 0 violations ✅ |
| Playwright | All tests passed ✅ |

## Manual Testing

| Test | Result | Issues |
|------|--------|--------|
| Keyboard Navigation | ✅ Pass | - |
| Screen Reader (VoiceOver) | ✅ Pass | - |
| Color Contrast | ✅ Pass | - |
| Zoom (200%) | ✅ Pass | - |
| Mobile (320px) | ⚠️ Partial | Issue #123 |

## Issues Found

### Issue #123: Dropdown not keyboard accessible
- **Severity:** P1 (High)
- **WCAG:** 2.1.1 Keyboard (Level A)
- **Page:** /products
- **Description:** Dropdown menu requires mouse click, cannot open with keyboard
- **Steps to Reproduce:** ...
- **Expected:** Press Enter to open dropdown
- **Actual:** Nothing happens

## Compliance Status

WCAG 2.2 Level AA: **Conformant** (pending Issue #123)
```

---

**Last Updated:** October 2025
