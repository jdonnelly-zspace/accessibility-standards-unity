# Voluntary Product Accessibility Template (VPAT) 2.5

## WCAG Edition

**Company Name:** [Your Company Name]
**Product Name:** [Your Product Name]
**Product Version:** [Version Number]
**Report Date:** [Month DD, YYYY]
**Last Updated:** [Month DD, YYYY]
**Contact:** [Contact Information]

---

## Product Description

[Describe your product in 2-3 paragraphs. Include:]
- What the product does
- Key features
- Target users
- Technology stack (React, Vue, etc.)
- Deployment model (SaaS, on-premise, etc.)

**Example:**
> A full-stack educational/learning content platform with blog functionality, built with React frontend, Express backend, and Directus CMS. The platform provides transformative learning content aimed at empowering people to reach their full potential.

---

## Evaluation Methods Used

[Describe how you tested for accessibility:]

### Automated Testing
- [ ] Chrome Lighthouse accessibility audit
- [ ] axe DevTools browser extension
- [ ] WAVE Web Accessibility Evaluation Tool
- [ ] ESLint with jsx-a11y plugin (development)
- [ ] Playwright with axe-core (CI/CD)

### Manual Testing
- [ ] Keyboard-only navigation testing
- [ ] Screen reader testing (specify which: VoiceOver, NVDA, JAWS)
- [ ] Visual inspection of HTML semantics
- [ ] Color contrast analysis with WebAIM Contrast Checker
- [ ] Zoom/resize testing (200% zoom, 320px width)
- [ ] Reduced motion preference testing

### Standards Referenced
- [ ] WCAG 2.2 Level AA Success Criteria
- [ ] Section 508 (US) standards
- [ ] EN 301 549 (EU) standards
- [ ] WAI-ARIA 1.2 Authoring Practices

---

## Applicable Standards/Guidelines

This report covers the degree of conformance for the following accessibility standard/guidelines:

| Standard/Guideline | Included In Report |
|--------------------|-------------------|
| **Web Content Accessibility Guidelines 2.2** | Level A: ✅ Yes<br>Level AA: ✅ Yes<br>Level AAA: ⬜ No (or specify partial) |
| **Section 508 (US)** | ✅ Yes (aligned with WCAG 2.2 Level AA) |
| **EN 301 549 (EU)** | ✅ Yes (aligned with WCAG 2.2 Level AA) |

---

## Terms

The terms used in the Conformance Level information are defined as follows:

| Term | Definition |
|------|------------|
| **Supports** | The functionality of the product has at least one method that meets the criterion without known defects or meets with equivalent facilitation. |
| **Partially Supports** | Some functionality of the product does not meet the criterion. |
| **Does Not Support** | The majority of product functionality does not meet the criterion. |
| **Not Applicable** | The criterion is not relevant to the product. |

---

## WCAG 2.2 Report - Level A Success Criteria

| Criteria | Conformance Level | Remarks and Explanations |
|----------|------------------|--------------------------|
| **1.1.1 Non-text Content** | ✅ Supports / ⚠️ Partially Supports / ❌ Does Not Support / N/A | [Describe your implementation. Example: All images include appropriate alt text. Decorative images use empty alt attributes. FontAwesome icons are properly labeled with ARIA labels.] |
| **1.3.1 Info and Relationships** | ✅ / ⚠️ / ❌ / N/A | [Example: Proper semantic HTML5 elements used throughout (header, nav, main, article, footer). Heading hierarchy is logical and sequential.] |
| **1.4.1 Use of Color** | ✅ / ⚠️ / ❌ / N/A | [Example: Color is not used as the only visual means of conveying information. Links are underlined, buttons have distinct shapes.] |
| **2.1.1 Keyboard** | ✅ / ⚠️ / ❌ / N/A | [Example: All interactive elements are accessible via keyboard. Tab order is logical. Skip navigation link available. ESC key dismisses all modals and dropdowns.] |
| **2.1.2 No Keyboard Trap** | ✅ / ⚠️ / ❌ / N/A | [Example: Users can navigate away from all components using keyboard. ESC key closes all modals and dropdowns.] |
| **2.4.1 Bypass Blocks** | ✅ / ⚠️ / ❌ / N/A | [Example: Skip navigation link implemented to bypass repeated navigation. Jumps directly to main content when activated.] |
| **2.4.2 Page Titled** | ✅ / ⚠️ / ❌ / N/A | [Example: All pages have descriptive, unique titles that describe page topic or purpose.] |
| **2.4.3 Focus Order** | ✅ / ⚠️ / ❌ / N/A | [Example: Focus order follows logical and meaningful sequence. Tab navigation matches visual layout.] |
| **2.4.4 Link Purpose (In Context)** | ✅ / ⚠️ / ❌ / N/A | [Example: All links have descriptive text or aria-labels. Blog post cards include full context: "Read article: [Title]. [Excerpt]".] |
| **3.1.1 Language of Page** | ✅ / ⚠️ / ❌ / N/A | [Example: HTML lang attribute set to appropriate language code (e.g., "en" for English).] |
| **3.2.1 On Focus** | ✅ / ⚠️ / ❌ / N/A | [Example: No automatic context changes when components receive focus.] |
| **3.2.2 On Input** | ✅ / ⚠️ / ❌ / N/A | [Example: No unexpected context changes when user input is provided.] |
| **3.3.2 Labels or Instructions** | ✅ / ⚠️ / ❌ / N/A | [Example: All form fields have associated labels. Required fields clearly marked. Instructions provided for complex inputs.] |
| **4.1.1 Parsing** | ✅ / ⚠️ / ❌ / N/A | [Example: Valid HTML5 structure. No duplicate IDs. All elements properly closed.] |
| **4.1.2 Name, Role, Value** | ✅ / ⚠️ / ❌ / N/A | [Example: All UI components have appropriate names, roles, and values. ARIA attributes properly used.] |

*Note: Table shows key Level A criteria. Add all 30 Level A criteria for complete report.*

---

## WCAG 2.2 Report - Level AA Success Criteria

| Criteria | Conformance Level | Remarks and Explanations |
|----------|------------------|--------------------------|
| **1.4.3 Contrast (Minimum)** | ✅ / ⚠️ / ❌ / N/A | [Example: All text exceeds minimum 4.5:1 ratio. Verified ratios: Navbar frosted glass: 16.32:1, Indigo text: 5.95:1, Secondary text: 6.99:1. Purple borders: 4.13:1 (UI components require 3:1).] |
| **1.4.4 Resize Text** | ✅ / ⚠️ / ❌ / N/A | [Example: Text can be resized up to 200% without loss of content or functionality. Responsive design adapts to text scaling.] |
| **1.4.5 Images of Text** | ✅ / ⚠️ / ❌ / N/A | [Example: No images of text used except for logos. All text is actual text, not images.] |
| **1.4.10 Reflow** | ✅ / ⚠️ / ❌ / N/A | [Example: Content reflows to single column at 320px width without horizontal scrolling or loss of information.] |
| **1.4.11 Non-text Contrast** | ✅ / ⚠️ / ❌ / N/A | [Example: UI components and graphical objects have sufficient contrast (3:1 minimum). Focus indicators and borders meet requirements.] |
| **2.4.5 Multiple Ways** | ✅ / ⚠️ / ❌ / N/A | [Example: Multiple ways provided to locate content: (1) Navigation links, (2) Site-wide search, (3) HTML sitemap page.] |
| **2.4.6 Headings and Labels** | ✅ / ⚠️ / ❌ / N/A | [Example: Headings and labels are descriptive and help users understand content organization.] |
| **2.4.7 Focus Visible** | ✅ / ⚠️ / ❌ / N/A | [Example: Keyboard focus indicator is clearly visible for all interactive elements with high contrast borders.] |
| **3.2.3 Consistent Navigation** | ✅ / ⚠️ / ❌ / N/A | [Example: Navigation menu is consistent across all pages in the same relative order.] |
| **3.2.4 Consistent Identification** | ✅ / ⚠️ / ❌ / N/A | [Example: Components with same functionality are identified consistently throughout the site.] |
| **3.3.3 Error Suggestion** | ✅ / ⚠️ / ❌ / N/A | [Example: If input error is detected, suggestions for correction are provided.] |
| **3.3.4 Error Prevention (Legal, Financial, Data)** | ✅ / ⚠️ / ❌ / N/A or N/A | [Example: Confirmation step provided before final submission of important data.] |

*Note: Table shows key Level AA criteria. Add all 20 Level AA criteria for complete report.*

---

## Accessibility Features Summary

### Implemented Features
[List all accessibility features in your product:]

- ✅ Semantic HTML5 structure (header, nav, main, footer)
- ✅ Skip navigation link
- ✅ ARIA labels on all interactive elements
- ✅ Logical heading hierarchy (H1 → H2 → H3)
- ✅ Full keyboard navigation support
- ✅ ESC key dismissal for modals and dropdowns
- ✅ High contrast colors (specify ratios)
- ✅ Visible focus indicators
- ✅ Responsive design
- ✅ Multi-language support (if applicable)
- ✅ Screen reader compatibility
- ✅ ESLint jsx-a11y plugin for development-time checks
- ✅ Automated accessibility testing (Playwright + axe-core)
- ✅ Reduced motion support (`prefers-reduced-motion`)
- ✅ [Add your specific features]

### Testing Results
[Include your test results:]

- **Lighthouse Accessibility Score:** [Score out of 100]
- **axe DevTools:** [Number] violations
- **WAVE:** [Number] errors
- **Color Contrast:** All ratios verified and documented
- **WCAG 2.2 Level AA:** [Fully Conformant / Partially Conformant]
- **Section 508 (US):** [Conformant / Partially Conformant]
- **EN 301 549 (EU):** [Conformant / Partially Conformant]

---

## Known Limitations

### Current Limitations
[Be transparent about any known accessibility issues:]

**Example:**
> Dark Theme Only: The site uses a dark theme exclusively for brand consistency. While this provides excellent measured contrast ratios (5.95:1+), users who prefer light mode may use browser extensions or system accessibility features to invert colors if desired.

### Recommendations for Users
[Provide guidance to users:]

- Users with motion sensitivity should enable `prefers-reduced-motion` in their system settings
- Users who prefer light mode can use browser extensions like "Dark Reader"
- Screen reader users should use latest versions of NVDA, JAWS, VoiceOver, or ChromeVox
- [Add your specific recommendations]

---

## Contact Information

For questions or to report accessibility issues:

**Email:** [accessibility@yourcompany.com]
**Phone:** [Phone Number]
**Web:** [Accessibility feedback form URL]
**Expected Response Time:** [e.g., Within 5 business days]

---

## Revision History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | YYYY-MM-DD | Initial VPAT report |
| 1.1 | YYYY-MM-DD | Updated after [specific changes] |

---

## Legal Disclaimer

This document is provided for information purposes only, and the contents hereof are subject to change without notice. This document is not warranted to be error-free, nor is it subject to any other warranties or conditions.

---

*VPAT® is a registered trademark of the Information Technology Industry Council (ITI).*

**Template based on:** VPAT 2.5 WCAG Edition
**Prepared by:** [Your Name/Team]
**Date:** [Month DD, YYYY]
