# Accessibility Resources (zSpace Unity + Web Standards)

This document contains authoritative resources for accessibility standards updates.

**Target Platform:** zSpace (stereoscopic 3D desktop + Unity)
**Standards:** WCAG 2.2 Level AA + W3C XAUR (adapted for zSpace)

---

## zSpace-Specific Resources

### zSpace Developer Portal ⭐ PRIMARY RESOURCE
**URL:** https://developer.zspace.com/
**Check Frequency:** Monthly
**What to Monitor:**
- Unity SDK updates
- New API documentation
- Hardware compatibility updates
- Best practices for zSpace development
- Accessibility guidelines (if published)

**Key Pages:**
- Unity SDK documentation
- API reference
- Sample applications
- Hardware specifications

---

### Unity Accessibility Documentation
**URL:** https://docs.unity3d.com/Manual/accessibility.html
**Check Frequency:** Quarterly
**What to Monitor:**
- New accessibility features in Unity
- Updates to UI accessibility
- Screen reader integration improvements
- New accessibility APIs

---

### Unity Test Framework Documentation
**URL:** https://docs.unity3d.com/Packages/com.unity.test-framework@latest
**Check Frequency:** Quarterly
**What to Monitor:**
- New testing APIs
- PlayMode testing updates
- Integration with CI/CD platforms

---

### Microsoft Accessibility (Windows/NVDA)
**URL:** https://www.microsoft.com/en-us/accessibility
**Check Frequency:** Quarterly
**What to Monitor:**
- Windows Narrator updates
- UI Automation API changes
- Accessibility features in Windows
- Screen reader compatibility updates

**Key Pages:**
- https://support.microsoft.com/en-us/windows/complete-guide-to-narrator-e4397a0d-ef4f-b386-d8ae-c172f109bdb1
- https://docs.microsoft.com/en-us/windows/win32/winauto/uiauto-uiautomationoverview

---

### NVDA Screen Reader
**URL:** https://www.nvaccess.org/
**Check Frequency:** Monthly
**What to Monitor:**
- New NVDA releases
- API updates
- Unity application compatibility
- Speech synthesis improvements

**GitHub:** https://github.com/nvaccess/nvda

---

## W3C Official Resources (Still Applicable to zSpace)

### WCAG 2.2 Quick Reference ⭐ PRIMARY RESOURCE
**URL:** https://www.w3.org/WAI/WCAG22/quickref/
**Scrape Frequency:** Monthly
**What to Monitor:**
- New success criteria
- Updated techniques
- Understanding documents
- Changes to conformance requirements

**Scraping Strategy:**
- Check for version updates in page title
- Monitor success criteria count (currently 86 criteria)
- Compare checksum of criteria list

---

### WCAG 2.2 Specification ⭐ PRIMARY RESOURCE
**URL:** https://www.w3.org/TR/WCAG22/
**Scrape Frequency:** Monthly
**What to Monitor:**
- Official W3C Recommendation updates
- Errata and corrections
- Complete success criteria list (all 86 criteria)
- Conformance requirements
- New techniques and understanding documents

**Scraping Strategy:**
- Monitor page checksum for changes
- Track version and publication date
- Compare against local documentation

---

### W3C Developer Tools Page ⭐ NEW
**URL:** https://www.w3.org/developers/tools/
**Scrape Frequency:** Quarterly
**What to Monitor:**
- New validator tools
- Updates to existing tools (HTML, CSS, Link Checker, i18n)
- New testing utilities
- Tool deprecations or changes

**Key Tools to Track:**
- Nu HTML Checker (https://validator.w3.org/nu/)
- CSS Validator (https://jigsaw.w3.org/css-validator/)
- Link Checker (https://validator.w3.org/checklink)
- Internationalization Checker (https://validator.w3.org/i18n-checker/)

**Scraping Strategy:**
- Monitor tools list for additions
- Check individual tool documentation for updates
- Track API changes

---

### W3C WAI (Web Accessibility Initiative)
**URL:** https://www.w3.org/WAI/
**Scrape Frequency:** Monthly
**What to Monitor:**
- WCAG updates and new versions
- ARIA specification changes
- New guidance documents
- Policy changes

**Key Sub-pages:**
- https://www.w3.org/WAI/standards-guidelines/ - Standards overview
- https://www.w3.org/WAI/WCAG22/Understanding/ - Understanding WCAG 2.2
- https://www.w3.org/WAI/WCAG22/Techniques/ - WCAG 2.2 Techniques

---

### ARIA Authoring Practices Guide (APG)
**URL:** https://www.w3.org/WAI/ARIA/apg/
**Scrape Frequency:** Quarterly
**What to Monitor:**
- New design patterns
- Updated example implementations
- Best practice changes for components

**Key Patterns to Monitor:**
- Modal dialogs
- Dropdown menus
- Carousels
- Accordions
- Tabs
- Tooltips

---

## WebAIM Resources

### WebAIM Articles
**URL:** https://webaim.org/articles/
**Scrape Frequency:** Monthly
**What to Monitor:**
- New articles on accessibility topics
- Updates to existing articles
- New techniques and best practices

**Key Articles:**
- https://webaim.org/articles/contrast/ - Contrast and Color
- https://webaim.org/articles/keyboard/ - Keyboard Accessibility
- https://webaim.org/articles/screenreader_testing/ - Screen Reader Testing
- https://webaim.org/articles/aria/ - ARIA and HTML

---

### WebAIM Blog
**URL:** https://webaim.org/blog/
**Scrape Frequency:** Monthly
**What to Monitor:**
- Industry trends
- New accessibility technologies
- Legal developments
- Survey results

---

### WebAIM Resources
**URL:** https://webaim.org/resources/
**Scrape Frequency:** Quarterly
**Tools to Monitor:**
- Contrast Checker updates
- WAVE tool updates
- New checklists

---

## MDN (Mozilla Developer Network)

### MDN Accessibility
**URL:** https://developer.mozilla.org/en-US/docs/Web/Accessibility
**Scrape Frequency:** Quarterly
**What to Monitor:**
- New accessibility guides
- Updated code examples
- Browser compatibility data for ARIA
- Best practices updates

**Key Sub-sections:**
- https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA
- https://developer.mozilla.org/en-US/docs/Web/Accessibility/Keyboard-navigable_JavaScript_widgets
- https://developer.mozilla.org/en-US/docs/Learn/Accessibility

---

## The A11y Project

### A11y Project Resources
**URL:** https://www.a11yproject.com/
**Scrape Frequency:** Monthly
**What to Monitor:**
- New checklist items
- Updated posts
- New resources
- Community patterns

**Key Pages:**
- https://www.a11yproject.com/checklist/ - WCAG checklist
- https://www.a11yproject.com/posts/ - Blog posts
- https://www.a11yproject.com/resources/ - Tools and resources

---

## Deque Resources

### Deque University
**URL:** https://dequeuniversity.com/resources/
**Scrape Frequency:** Quarterly
**What to Monitor:**
- New articles
- Updated guidance
- Code libraries (axe-core updates)

---

### axe-core GitHub Releases
**URL:** https://github.com/dequelabs/axe-core/releases
**Scrape Frequency:** Monthly
**What to Monitor:**
- New rule releases
- Breaking changes
- Deprecated rules
- API changes

---

## Government Resources

### Section 508 (US)
**URL:** https://www.section508.gov/
**Scrape Frequency:** Quarterly
**What to Monitor:**
- Policy updates
- New guidance
- ICT Testing Baseline updates
- Procurement requirements

**Key Pages:**
- https://www.section508.gov/manage/laws-and-policies/ - Legal requirements
- https://www.section508.gov/test/ - Testing guidance

---

### GOV.UK Accessibility
**URL:** https://www.gov.uk/guidance/accessibility-requirements-for-public-sector-websites-and-apps
**Scrape Frequency:** Quarterly
**What to Monitor:**
- UK accessibility regulations updates
- Guidance changes
- Enforcement actions (for precedent)

---

## Testing Tools Documentation

### Playwright Accessibility Testing
**URL:** https://playwright.dev/docs/accessibility-testing
**Scrape Frequency:** Quarterly
**What to Monitor:**
- New testing methods
- axe-core integration updates
- Best practices

---

### axe-core/playwright
**URL:** https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright
**Scrape Frequency:** Monthly
**What to Monitor:**
- Package updates
- New API methods
- Breaking changes

---

## Browser Vendor Resources

### Chrome DevTools
**URL:** https://developer.chrome.com/docs/devtools/accessibility/
**Scrape Frequency:** Quarterly
**What to Monitor:**
- New accessibility features in DevTools
- Lighthouse scoring changes
- Updated audits

---

### Firefox Accessibility Inspector
**URL:** https://firefox-source-docs.mozilla.org/devtools-user/accessibility_inspector/
**Scrape Frequency:** Quarterly
**What to Monitor:**
- New features
- Inspector updates

---

## Standards Bodies

### ETSI (EN 301 549)
**URL:** https://www.etsi.org/deliver/etsi_en/301500_301599/301549/
**Scrape Frequency:** Annually
**What to Monitor:**
- New versions of EN 301 549
- Harmonized European standard updates

---

### ITI (VPAT Templates)
**URL:** https://www.itic.org/policy/accessibility/vpat
**Scrape Frequency:** Annually
**What to Monitor:**
- New VPAT versions
- Template updates
- Guidance changes

---

## RSS Feeds (If Available)

```json
{
  "feeds": [
    {
      "name": "WebAIM Blog",
      "url": "https://webaim.org/blog/feed",
      "check": "weekly"
    },
    {
      "name": "A11y Project",
      "url": "https://www.a11yproject.com/feed.xml",
      "check": "weekly"
    },
    {
      "name": "Deque Blog",
      "url": "https://www.deque.com/blog/feed/",
      "check": "weekly"
    }
  ]
}
```

---

## Scraping Implementation Notes

### Priority Levels

**P0 - Critical (Monthly):**
- W3C WCAG 2.2 Quick Reference
- WebAIM Articles
- axe-core GitHub releases

**P1 - Important (Quarterly):**
- ARIA APG
- MDN Accessibility
- A11y Project
- Section 508
- Browser DevTools docs

**P2 - Informational (Annually):**
- EN 301 549
- VPAT templates

### Scraping Strategy

1. **Version Detection:**
   - Look for version numbers in page titles
   - Monitor `<meta name="revised" content="...">` tags
   - Compare document checksums

2. **Change Detection:**
   - Store hash of main content
   - Alert on hash change
   - Generate diff report

3. **Alert Mechanism:**
   - Email notification for P0 changes
   - Slack/Discord webhook for P1 changes
   - Log P2 changes for quarterly review

4. **Storage:**
   - Store historical versions in `scrapers/history/`
   - Generate changelog in `scrapers/CHANGELOG-STANDARDS.md`

### Scraper Implementation

See `/scrapers/update-standards.js` for implementation.

**Usage:**
```bash
# Manual run
npm run scrape:update

# Scheduled (GitHub Actions - monthly)
# See .github/workflows/scrape-standards.yml
```

---

## Contributing

Found a new resource that should be tracked? Please:
1. Add it to this document
2. Update `scrapers/scraper-config.json`
3. Submit a pull request

---

**Last Updated:** October 16, 2025 (Updated for zSpace Unity platform)
**Next Review:** January 2026
