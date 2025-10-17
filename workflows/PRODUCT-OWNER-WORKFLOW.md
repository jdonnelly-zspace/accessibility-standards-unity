# Product Owner Workflow - Accessibility Planning (zSpace Unity)

This guide shows Product Owners how to ensure accessibility is built into **zSpace Unity applications** from planning through acceptance.

**Target Platform:** zSpace (stereoscopic 3D desktop + Unity)
**Standards:** WCAG 2.2 Level AA + W3C XAUR (adapted for zSpace)

---

## Why Accessibility Matters for zSpace Applications

**Market Impact (zSpace-Specific):**
- **Education Market:** 15% of K-12 students have disabilities - zSpace apps must be inclusive
- **Medical Training:** Healthcare professionals with disabilities need accessible training tools
- **Legal Risk:** Section 508 (government), ADA Title III (private education), WCAG 2.2 compliance
- **User Base:** 10-15% of users **cannot perceive stereoscopic 3D** - depth alternatives are CRITICAL
- **Brand Reputation:** First accessible zSpace platform sets industry standard

**zSpace-Specific Accessibility Challenges:**
- **Stereoscopic 3D Dependency:** 10-15% of users have stereoblindness/amblyopia/strabismus
- **Stylus-Only Interaction:** Users with motor impairments need keyboard alternatives
- **Desktop Screen Readers:** NVDA/Narrator/JAWS integration required for blind users
- **Depth Perception:** Size, shadow, audio, haptic cues needed for non-stereoscopic users

**Business Impact:**
- **Market Access:** 15% of global population has disabilities (~1.3 billion people)
- **Legal Risk:** Accessibility lawsuits increasing (US ADA Title III, EU Accessibility Act, Section 508)
- **Better UX:** Accessibility improvements help all users (keyboard shortcuts benefit everyone)
- **Brand Reputation:** Demonstrates commitment to inclusion

**Cost of Waiting:**
- Fixing later costs **10-100x** more than building accessible from start
- Retrofitting requires redesign + re-development + re-testing
- May delay releases while addressing compliance issues

---

## Product Lifecycle Integration

### Phase 1: Feature Planning

#### Add Accessibility to Acceptance Criteria

**Standard Acceptance Criteria Template (zSpace Unity - WCAG 2.2 + W3C XAUR):**
```
User Story: As a [user], I want to [action], so that [benefit]

Acceptance Criteria:
- [ ] [Functional requirement 1]
- [ ] [Functional requirement 2]
- [ ] **Accessibility (WCAG 2.2 Level AA + W3C XAUR):**
  - [ ] All stylus interactions have keyboard alternatives (WCAG 2.1.1 - Level A)
  - [ ] All interactive elements ≥24x24 pixels (WCAG 2.5.8 - Level AA)
  - [ ] Color contrast ≥4.5:1 for text, 3:1 for UI (WCAG 1.4.3 - Level AA)
  - [ ] Screen reader compatible (NVDA/Narrator) (WCAG 4.1.2 - Level A)
  - [ ] Focus indicators visible in 3D space (WCAG 2.4.7 - Level AA)
  - [ ] **Depth perception alternatives (W3C XAUR - CRITICAL):**
    - [ ] Size scaling (nearer = larger)
    - [ ] Shadows (depth cues)
    - [ ] Audio distance cues
    - [ ] Haptic depth feedback
    - [ ] Motion parallax
    - [ ] Occlusion
  - [ ] Application fully functional without stereoscopic 3D ("glasses off" test)
  - [ ] ZSpace Accessibility Validator: Zero critical issues
  - [ ] Unity Test Framework accessibility tests pass
```

**Example User Story (zSpace):**
```
User Story: As a medical student, I want to rotate a 3D heart model, so that I can study its anatomy from all angles.

Acceptance Criteria:
- [ ] Stylus can rotate heart model in 3D space
- [ ] Rotation is smooth and responsive
- [ ] Model snaps to anatomical views (front, back, left, right)
- [ ] Labels appear when hovering over chambers/vessels
- [ ] **Accessibility:**
  - [ ] Arrow keys rotate model (keyboard alternative to stylus) (WCAG 2.1.1)
  - [ ] Spacebar activates labels (keyboard alternative) (WCAG 2.1.1)
  - [ ] All interactive elements ≥24x24 pixels (WCAG 2.5.8)
  - [ ] Label text has ≥4.5:1 contrast ratio (WCAG 1.4.3)
  - [ ] NVDA announces focused chamber names (WCAG 4.1.2)
  - [ ] Focus indicator (cyan glow) visible on focused chamber (WCAG 2.4.7)
  - [ ] **Depth perception alternatives (W3C XAUR - CRITICAL):**
    - [ ] Size scaling: Chambers closer to camera appear larger
    - [ ] Shadows: Dynamic shadows cast on base plane
    - [ ] Audio: Heartbeat volume varies with distance
    - [ ] Haptic: Stylus vibrates stronger when closer
  - [ ] Application fully usable without tracked glasses ("glasses off" test)
  - [ ] ZSpace Accessibility Validator: 0 critical issues
  - [ ] Unity Test Framework tests pass
```

---

#### Accessibility Requirements Checklist (WCAG 2.2)

**For Every Feature:**
- [ ] Keyboard navigation defined
- [ ] Color contrast requirements specified (4.5:1 minimum)
- [ ] Screen reader behavior described
- [ ] Focus management plan (for modals/dynamic content)
- [ ] Error handling accessibility (form validation, error messages)
- [ ] **🆕 WCAG 2.2: Target size ≥ 24x24px for interactive elements**
- [ ] **🆕 WCAG 2.2: Focus visibility with sticky headers considered**

**For Complex Features:**
- [ ] ARIA patterns identified (from W3C APG)
- [ ] Keyboard shortcuts defined (if applicable)
- [ ] Animation/motion preferences considered
- [ ] Multi-language support planned (if applicable)
- [ ] **🆕 WCAG 2.2: Drag-and-drop alternatives designed (SC 2.5.7)**
- [ ] **🆕 WCAG 2.2: Form autocomplete strategy (SC 3.3.7)**
- [ ] **🆕 WCAG 2.2: Authentication without cognitive tests (SC 3.3.8)**

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

**Standard DoD Must Include (WCAG 2.2):**
```
Definition of Done:
- [ ] Code complete and peer reviewed
- [ ] Unit tests pass
- [ ] **ESLint accessibility checks pass (0 warnings)**
- [ ] **Playwright accessibility tests pass (including 5 WCAG 2.2 tests)**
- [ ] **Manual keyboard testing complete**
- [ ] **Lighthouse score ≥ 95**
- [ ] **W3C HTML validation passes**
- [ ] **W3C CSS validation passes** (optional but recommended)
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
- [ ] **🆕 WCAG 2.2: Autocomplete attributes on common fields (SC 3.3.7)**
- [ ] **🆕 WCAG 2.2: Submit button ≥ 24x24px (SC 2.5.8)**

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
- [ ] 🆕 Email field has autocomplete="email" (SC 3.3.7)
- [ ] 🆕 Submit button is 44x44px (exceeds 24px minimum - SC 2.5.8)
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

## Budget & Resources (zSpace Unity)

### Hardware Requirements

**Required:**
- zSpace hardware ($3,000-$7,000 per unit) - Already owned by most zSpace projects
- Windows PC with zSpace support
- Unity 2021.3+ LTS (Free - Personal license)

**Optional:**
- Additional zSpace units for multi-user testing
- Desktop speakers (for spatial audio testing)

### Time Allocation

**Per Sprint:**
- Developer accessibility implementation: ~15% of dev time (first sprint), ~10% ongoing
- QA accessibility testing: ~15% of QA time
- Unity Test Framework setup: 2-4 hours (one-time)
- Depth perception testing: ~1 hour per feature ("glasses off" test)

**Per Release:**
- Final accessibility audit: 6-10 hours
  - ZSpace Accessibility Validator: 1 hour
  - Unity Test Framework: 1 hour
  - Manual keyboard testing: 2 hours
  - NVDA screen reader testing: 2-3 hours
  - Depth perception testing (glasses off): 2 hours
  - Contrast checking: 1 hour
- VPAT report update: 2-4 hours

### Training & Tools

**One-Time Costs:**
- Accessibility training for team: $0-500/person (many free resources)
- Tools: $0 (all free/open-source tools)
- NVDA screen reader: $0 (free, open source)
- zSpace Unity SDK: $0 (free with zSpace hardware)

**Recommended Training (zSpace-Specific):**
- Developers: WCAG 2.2 + W3C XAUR + Unity + zSpace SDK (6 hours)
- Designers: Depth perception alternatives + keyboard patterns + contrast (4 hours)
- QA: Unity Test Framework + NVDA + zSpace hardware testing (5 hours)
- POs: This workflow + acceptance criteria + zSpace accessibility challenges (2 hours)

---

## WCAG 2.2 Specific Feature Requirements

### Authentication Features

**New Requirements (SC 3.3.8):**
```
User Story: As a user, I want to sign in to my account

WCAG 2.2 Accessibility Criteria:
- [ ] Password field supports password managers (autocomplete="current-password")
- [ ] Password field allows paste functionality (not blocked)
- [ ] Alternative authentication methods available:
  - [ ] Magic link via email, OR
  - [ ] Biometric authentication, OR
  - [ ] SSO (Sign in with Google/Microsoft), OR
  - [ ] Another non-cognitive-test method
- [ ] No text-based CAPTCHAs without alternatives
- [ ] "Show password" toggle available
```

---

### Drag-and-Drop Features

**New Requirements (SC 2.5.7):**
```
User Story: As a user, I want to reorder my task list

WCAG 2.2 Accessibility Criteria:
- [ ] Drag-and-drop works with mouse
- [ ] Alternative: Up/Down buttons for each item
- [ ] Alternative: Keyboard shortcuts (Ctrl+Arrow keys)
- [ ] Screen reader announces position changes
- [ ] Touch users can use button controls
```

---

### Forms with Multiple Steps

**New Requirements (SC 3.3.7):**
```
User Story: As a user, I want to complete checkout

WCAG 2.2 Accessibility Criteria:
- [ ] Email entered once, auto-filled in subsequent steps
- [ ] "Same as billing address" option for shipping
- [ ] Autocomplete attributes on all common fields:
  - [ ] email, name, tel, address fields
  - [ ] payment card fields (cc-name, cc-number, etc.)
- [ ] Form progress saved if user leaves and returns
- [ ] Previously selected options available in dropdowns
```

---

### Pages with Sticky Headers/Footers

**New Requirements (SC 2.4.11):**
```
User Story: As a user, I want to navigate the site with keyboard

WCAG 2.2 Accessibility Criteria:
- [ ] Focused elements not completely hidden by sticky header
- [ ] Developer implements scroll-padding-top CSS
- [ ] Manual keyboard testing verifies all focus visible
- [ ] Works across all breakpoints (mobile, tablet, desktop)
```

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

### Accessibility (WCAG 2.2 Level AA)
- [ ] Keyboard accessible (all actions available via keyboard)
- [ ] Screen reader compatible (proper labels and announcements)
- [ ] Color contrast ≥ 4.5:1 (all text)
- [ ] Focus indicators visible
- [ ] 🆕 Focus not obscured by fixed content (SC 2.4.11)
- [ ] 🆕 Interactive elements ≥ 24x24px (SC 2.5.8)
- [ ] 🆕 Draggable features have alternatives (SC 2.5.7, if applicable)
- [ ] 🆕 Forms use autocomplete (SC 3.3.7, if applicable)
- [ ] ESLint accessibility checks pass
- [ ] Playwright accessibility tests pass (including WCAG 2.2 tests)
- [ ] Lighthouse score ≥ 95
- [ ] W3C HTML validation passes

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
A: Lighthouse ≥ 95, axe 0 violations, QA manual testing passed, WCAG 2.2 specific tests passed, VPAT completed.

**Q: What's new in WCAG 2.2?**
A: 9 new success criteria, including focus visibility (SC 2.4.11), target size 24x24px (SC 2.5.8), dragging alternatives (SC 2.5.7), form autocomplete (SC 3.3.7), and accessible authentication (SC 3.3.8). All covered in this framework.

**Q: Do we need to update existing features for WCAG 2.2?**
A: Yes, eventually. Prioritize high-traffic features and authentication flows. Most new features will be compliant if built using this framework.

---

---

## zSpace-Specific Resources

- **Example Scene:** `examples/zspace-accessible-scene/README.md`
- **Case Study:** `examples/zspace-accessible-scene/CASE-STUDY-ZSPACE.md`
- **zSpace Checklist:** `standards/ZSPACE-ACCESSIBILITY-CHECKLIST.md`
- **Unity Components:** `implementation/unity/scripts/`
- **Unity Tests:** `implementation/unity/tests/ZSpaceAccessibilityTests.cs`
- **zSpace Developer Portal:** https://developer.zspace.com/

---

**Last Updated:** October 16, 2025 (Updated for zSpace Unity platform)
