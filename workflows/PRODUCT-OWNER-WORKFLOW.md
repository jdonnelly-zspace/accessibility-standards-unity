# Product Owner Workflow - Accessibility Planning

This guide shows Product Owners how to ensure accessibility is built into the product from planning through acceptance.

---

## Why Accessibility Matters to POs

**Business Impact:**
- **Market Access:** 15% of global population has disabilities (~1.3 billion people)
- **Legal Risk:** Accessibility lawsuits increasing (US ADA Title III, EU Accessibility Act)
- **SEO Benefits:** Accessible sites rank better in search
- **Better UX:** Accessibility improvements help all users
- **Brand Reputation:** Demonstrates commitment to inclusion

**Cost of Waiting:**
- Fixing later costs **10-100x** more than building accessible from start
- Retrofitting requires redesign + re-development + re-testing
- May delay releases while addressing compliance issues

---

## Product Lifecycle Integration

### Phase 1: Feature Planning

#### Add Accessibility to Acceptance Criteria

**Standard Acceptance Criteria Template:**
```
User Story: As a [user], I want to [action], so that [benefit]

Acceptance Criteria:
- [ ] [Functional requirement 1]
- [ ] [Functional requirement 2]
- [ ] **Accessibility:**
  - [ ] All interactive elements keyboard accessible
  - [ ] Color contrast meets WCAG AA (4.5:1 minimum)
  - [ ] Screen reader compatible
  - [ ] Lighthouse accessibility score ≥ 95
  - [ ] Zero axe DevTools violations
```

**Example User Story:**
```
User Story: As a user, I want to search for blog posts, so that I can find relevant content quickly.

Acceptance Criteria:
- [ ] Search button visible in navbar
- [ ] Modal opens with search input
- [ ] Real-time filtering as user types
- [ ] Results display post title, excerpt, category
- [ ] **Accessibility:**
  - [ ] Search button keyboard accessible (Tab + Enter)
  - [ ] Modal opens/closes with keyboard (Enter/Escape)
  - [ ] Focus trapped within modal when open
  - [ ] Search input has proper label (aria-label or visible label)
  - [ ] Results announced to screen readers
  - [ ] Modal has role="dialog" and aria-modal="true"
  - [ ] Lighthouse accessibility score ≥ 95
```

---

#### Accessibility Requirements Checklist

**For Every Feature:**
- [ ] Keyboard navigation defined
- [ ] Color contrast requirements specified (4.5:1 minimum)
- [ ] Screen reader behavior described
- [ ] Focus management plan (for modals/dynamic content)
- [ ] Error handling accessibility (form validation, error messages)

**For Complex Features:**
- [ ] ARIA patterns identified (from W3C APG)
- [ ] Keyboard shortcuts defined (if applicable)
- [ ] Animation/motion preferences considered
- [ ] Multi-language support planned (if applicable)

---

### Phase 2: Design Review

#### Designer Handoff Checklist

**Before Development Starts:**
- [ ] Designs include keyboard interaction specs
- [ ] Designs annotated with ARIA requirements
- [ ] Color contrast verified (use WebAIM Contrast Checker)
- [ ] Focus states designed for all interactive elements
- [ ] Error states designed (form validation, loading, etc.)
- [ ] Mobile/responsive behavior defined

**Questions to Ask Designer:**
- How do keyboard users navigate this feature?
- What happens when a user presses Tab/Enter/Escape?
- What ARIA labels are needed for icon-only buttons?
- Do all text colors meet 4.5:1 contrast ratio?
- Are focus indicators clearly visible?

**Reference:** `/workflows/DESIGNER-WORKFLOW.md`

---

### Phase 3: Development Sprint

#### Definition of Done (DoD)

**Standard DoD Must Include:**
```
Definition of Done:
- [ ] Code complete and peer reviewed
- [ ] Unit tests pass
- [ ] **ESLint accessibility checks pass (0 warnings)**
- [ ] **Playwright accessibility tests pass**
- [ ] **Manual keyboard testing complete**
- [ ] **Lighthouse score ≥ 95**
- [ ] Documentation updated
- [ ] QA approved
```

---

#### Sprint Planning Estimates

**Accessibility adds ~10-15% time:**
- Include ESLint setup time (first sprint only)
- Include automated test writing
- Include manual testing time

**Example Estimates:**
| Task | Without A11y | With A11y | Notes |
|------|--------------|-----------|-------|
| Simple Button | 1 point | 1 point | Semantic HTML, no extra work |
| Modal Dialog | 3 points | 4 points | +1 for focus management, ESC key |
| Custom Dropdown | 5 points | 6 points | +1 for keyboard nav, ARIA |
| Form with Validation | 5 points | 6 points | +1 for error announcements |

---

### Phase 4: QA & Acceptance

#### Acceptance Testing Checklist

**Before Accepting a Story:**
- [ ] Review Lighthouse report - score ≥ 95
- [ ] Review axe DevTools - 0 violations
- [ ] Keyboard test personally (Tab through feature)
- [ ] Check QA test report (manual + automated)
- [ ] Verify all acceptance criteria met

**How to Do Quick Keyboard Test:**
```
1. Navigate to feature
2. Press Tab repeatedly
3. Verify:
   ✓ All buttons/links reachable
   ✓ Focus indicator clearly visible
   ✓ Can activate with Enter/Space
   ✓ Can close modals with Escape
4. If any issue: Send back to development
```

**Reference:** `/workflows/QA-WORKFLOW.md`

---

### Phase 5: Release

#### Pre-Release Accessibility Audit

**Complete Accessibility Checklist:**
- [ ] All features tested with keyboard
- [ ] All pages scanned with Lighthouse (≥ 95)
- [ ] All pages scanned with axe DevTools (0 violations)
- [ ] Screen reader testing complete (VoiceOver/NVDA)
- [ ] Color contrast verified on all pages
- [ ] Zoom testing (200%) complete
- [ ] Mobile testing (320px width) complete
- [ ] Cross-browser testing complete

**Compliance Documentation:**
- [ ] VPAT 2.5 report complete (use `/standards/VPAT-2.5-TEMPLATE.md`)
- [ ] Accessibility statement published on site
- [ ] Test reports archived

---

## Feature-Specific Guidelines

### Modals & Dialogs

**Requirements:**
- [ ] Opens with Enter key on trigger button
- [ ] Closes with Escape key
- [ ] Focus moves to modal on open
- [ ] Tab key stays within modal (focus trap)
- [ ] Focus returns to trigger on close
- [ ] Has `role="dialog"` and `aria-modal="true"`

**Example Story:**
```
As a user, I want to view my profile in a modal, so I can quickly edit my details without leaving the page.

Accessibility Criteria:
- [ ] "Edit Profile" button keyboard accessible
- [ ] Modal opens with Enter key
- [ ] Modal closes with Escape key
- [ ] Focus trapped within modal
- [ ] Modal title announced by screen reader
- [ ] Focus returns to "Edit Profile" button on close
```

---

### Forms

**Requirements:**
- [ ] All inputs have labels (visible or aria-label)
- [ ] Required fields marked with visual indicator + `aria-required="true"`
- [ ] Error messages associated with fields (`aria-describedby`)
- [ ] Error messages announced by screen readers
- [ ] Submit button keyboard accessible

**Example Story:**
```
As a user, I want to contact support via a form, so I can get help with my issue.

Accessibility Criteria:
- [ ] All fields have visible labels
- [ ] Required fields marked with asterisk
- [ ] Error messages appear below each field
- [ ] Errors announced by screen reader
- [ ] Form submits with Enter key
- [ ] Success message announced by screen reader
```

---

### Data Tables

**Requirements:**
- [ ] Use semantic `<table>` element
- [ ] Column headers use `<th>` with `scope="col"`
- [ ] Row headers use `<th>` with `scope="row"`
- [ ] Complex tables have `<caption>` describing purpose

---

### Carousels/Sliders

**Requirements:**
- [ ] Keyboard navigation (Arrow keys or Next/Prev buttons)
- [ ] Auto-play can be paused
- [ ] Current slide announced to screen readers
- [ ] Respects `prefers-reduced-motion` (no auto-play if set)

---

## Metrics & Reporting

### Track These Accessibility Metrics

**Development:**
- ESLint accessibility violations per sprint (target: 0)
- Playwright test failures related to accessibility (target: 0)
- Lighthouse score trend (target: consistently ≥ 95)

**Release:**
- WCAG 2.2 Level AA conformance status (target: Fully Conformant)
- Number of accessibility bugs found in QA (target: trending down)
- Number of accessibility bugs found post-release (target: 0)

**Business:**
- Accessibility-related user complaints (target: 0)
- Legal/compliance issues (target: 0)
- User base growth from accessibility improvements (measure if possible)

---

### Quarterly Accessibility Review

**Every Quarter:**
- [ ] Review accessibility metrics
- [ ] Audit sample of pages with Lighthouse
- [ ] Review any user feedback related to accessibility
- [ ] Update VPAT report if changes made
- [ ] Update accessibility statement

---

## Budget & Resources

### Time Allocation

**Per Sprint:**
- Developer accessibility testing: ~5% of dev time
- QA accessibility testing: ~10% of QA time
- Initial ESLint setup: 1-2 hours (one-time)
- Initial Playwright setup: 2-4 hours (one-time)

**Per Release:**
- Final accessibility audit: 4-8 hours
- VPAT report update: 2-4 hours

### Training & Tools

**One-Time Costs:**
- Accessibility training for team: $0-500/person (many free resources)
- Tools: $0 (all free/open-source tools available)

**Recommended Training:**
- Developers: WCAG 2.2 overview + ESLint + testing (4 hours)
- Designers: Color contrast + keyboard patterns + ARIA (3 hours)
- QA: Manual testing + screen readers + tools (4 hours)
- POs: This workflow + acceptance criteria (1 hour)

---

## Templates

### Epic Template with Accessibility

```
Epic: [Epic Name]

Goal: [Business goal]

User Impact: [Who benefits and how]

Features:
1. [Feature 1]
2. [Feature 2]

Accessibility Requirements:
- All features must meet WCAG 2.2 Level AA
- Lighthouse score ≥ 95 on all pages
- Zero axe DevTools violations
- Keyboard navigation complete
- Screen reader compatible

Acceptance Criteria:
- [ ] All features complete
- [ ] All user stories accepted
- [ ] Accessibility audit complete (Lighthouse ≥ 95)
- [ ] QA sign-off
- [ ] VPAT updated (if customer-facing)

Resources:
- Design Files: [Link]
- WCAG Checklist: /standards/WCAG-2.2-LEVEL-AA.md
- Testing Guide: /workflows/QA-WORKFLOW.md
```

---

### User Story Template

```markdown
## User Story
As a [user type], I want to [action], so that [benefit].

## Acceptance Criteria

### Functional
- [ ] [Requirement 1]
- [ ] [Requirement 2]

### Accessibility
- [ ] Keyboard accessible (all actions available via keyboard)
- [ ] Screen reader compatible (proper labels and announcements)
- [ ] Color contrast ≥ 4.5:1 (all text)
- [ ] Focus indicators visible
- [ ] ESLint accessibility checks pass
- [ ] Playwright accessibility tests pass
- [ ] Lighthouse score ≥ 95

## Test Scenarios
1. [Scenario 1]
2. [Scenario 2]

## Notes
- [Any special considerations]
```

---

## Resources

- **WCAG Checklist:** `/standards/WCAG-2.2-LEVEL-AA.md`
- **VPAT Template:** `/standards/VPAT-2.5-TEMPLATE.md`
- **QA Workflow:** `/workflows/QA-WORKFLOW.md`
- **Developer Workflow:** `/workflows/DEVELOPER-WORKFLOW.md`
- **Tools Catalog:** `/resources/TOOLS-CATALOG.md`

---

## FAQs

**Q: How much does accessibility slow down development?**
A: ~10-15% initially, decreasing to ~5% once team is trained. Building accessible from start is actually faster than retrofitting.

**Q: Can we do accessibility in a later phase?**
A: Not recommended. Retrofitting costs 10-100x more and risks legal issues.

**Q: Do we need to hire accessibility experts?**
A: No. Free tools (ESLint, Lighthouse, axe) + this framework are sufficient for WCAG Level AA compliance.

**Q: What if we find an accessibility issue after release?**
A: Prioritize as P0/P1 bug, fix in next sprint, update VPAT if applicable.

**Q: How do I know if we're compliant?**
A: Lighthouse ≥ 95, axe 0 violations, QA manual testing passed, VPAT completed.

---

**Last Updated:** October 2025
