# Accessibility Standards Framework

> **Comprehensive WCAG 2.2 Level AA compliance framework for developers, designers, QA, and product owners**

[![WCAG 2.2](https://img.shields.io/badge/WCAG-2.2%20Level%20AA-blue)](https://www.w3.org/WAI/WCAG22/quickref/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## What This Framework Provides

This repository contains **everything you need** to build accessible web applications that meet WCAG 2.2 Level AA standards (plus optional Level AAA enhancements):

✅ **Complete WCAG 2.2 Level AA documentation** - All 9 new WCAG 2.2 criteria + Level A and AA requirements (57 criteria)
✅ **Level AAA Tier 1 Quick Wins** - 5 additional Level AAA criteria that can be implemented in 1-2 weeks
✅ **Ready-to-use code** - ESLint configs, Playwright tests, React components, W3C validators
✅ **6 Production components** - Accessible components demonstrating WCAG compliance
✅ **Role-specific workflows** - Developers, Designers, QA Engineers, Product Owners
✅ **Testing tools catalog** - Free tools for automated and manual testing
✅ **VPAT 2.5 template** - Document compliance for customers/legal
✅ **Web scraper** - Monitor WCAG/ARIA standards for updates
✅ **Real examples** - Based on production WCAG 2.2 AA compliant app

**Cost:** $0 (all free/open-source tools)

---

## 🚀 Quick Install (One Command)

### Option 1: Interactive Setup (Recommended)

```bash
cd your-project
npx github:jdonnelly-zspace/accessibility-standards
```

**What it does:**
- Prompts you to choose what to install
- Copies ESLint config, Playwright tests, and/or components
- Installs npm dependencies automatically
- Updates package.json with scripts
- Takes ~2 minutes

---

### Option 2: Bash Script (No Node.js needed)

```bash
# Full installation (ESLint + Tests + Components)
curl -fsSL https://raw.githubusercontent.com/jdonnelly-zspace/accessibility-standards/main/scripts/install.sh | bash

# Or install specific parts:
curl -fsSL https://raw.githubusercontent.com/jdonnelly-zspace/accessibility-standards/main/scripts/install.sh | bash -s -- --eslint --tests

# Options: --eslint, --tests, --components, --all
```

---

### Option 3: Manual (Full Control)

See "Getting Started" section below for manual installation steps.

---

## Quick Start by Role

### 👨‍💻 Developers

```bash
# 1. Install tools
npm install --save-dev eslint eslint-plugin-jsx-a11y @playwright/test @axe-core/playwright

# 2. Copy configs from this repo
cp implementation/development/eslint-a11y-config.js ./eslint.config.js
cp implementation/testing/playwright-setup/* ./tests/e2e/

# 3. Copy reusable WCAG 2.2 Level AA + AAA compliant components
cp implementation/development/components/*.jsx ./src/components/

# 4. Run linter
npm run lint

# 5. Run tests
npx playwright test
```

📖 **Full Guide:** [`workflows/DEVELOPER-WORKFLOW.md`](workflows/DEVELOPER-WORKFLOW.md)

---

### 🎨 Designers

**Checklist before handoff:**
- [ ] Color contrast ≥ 4.5:1 (use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/))
- [ ] Focus states designed for all interactive elements
- [ ] Keyboard interactions documented
- [ ] ARIA labels annotated (icon-only buttons)
- [ ] Touch targets ≥ 44x44px (mobile)

**Tools:**
- Figma: Install "Able – Friction-free Accessibility" plugin
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/

📖 **Full Guide:** [`workflows/DESIGNER-WORKFLOW.md`](workflows/DESIGNER-WORKFLOW.md)

---

### 🧪 QA Engineers

**Testing Workflow:**
1. **Automated:** Run Playwright + axe-core tests
2. **Keyboard:** Tab through all features
3. **Screen Reader:** Test with VoiceOver (Mac) or NVDA (Windows)
4. **Contrast:** Verify with WebAIM tool
5. **Lighthouse:** Chrome DevTools audit (target: 95+ score)

**Acceptance Criteria:**
- ✅ Lighthouse accessibility score ≥ 95
- ✅ axe DevTools: 0 violations
- ✅ Manual keyboard test passes
- ✅ Screen reader announces all content

📖 **Full Guide:** [`workflows/QA-WORKFLOW.md`](workflows/QA-WORKFLOW.md)

---

### 📊 Product Owners

**Add to every user story:**
```
Accessibility Acceptance Criteria:
- [ ] Keyboard accessible (all actions via keyboard)
- [ ] Screen reader compatible
- [ ] Color contrast ≥ 4.5:1
- [ ] Lighthouse score ≥ 95
- [ ] Zero axe DevTools violations
```

**Definition of Done must include:**
- ESLint accessibility checks pass
- Playwright accessibility tests pass
- Manual keyboard testing complete

📖 **Full Guide:** [`workflows/PRODUCT-OWNER-WORKFLOW.md`](workflows/PRODUCT-OWNER-WORKFLOW.md)

---

## Repository Structure

```
accessibility-standards/
├── standards/                          # WCAG 2.2 compliance documentation
│   ├── WCAG-2.2-LEVEL-AA.md           # Complete Level AA checklist ⭐
│   ├── VPAT-2.5-TEMPLATE.md           # Compliance report template
│   └── README.md                      # Standards overview
│
├── implementation/                     # Ready-to-use code & configs
│   ├── development/
│   │   ├── eslint-a11y-config.js      # ESLint config template
│   │   ├── components/
│   │   │   ├── Tooltip.jsx            # WCAG 2.2 compliant tooltip
│   │   │   ├── AccessibleAuthForm.jsx # SC 3.3.8: Accessible Authentication (AA)
│   │   │   ├── ConsistentHelp.jsx     # SC 3.2.6: Consistent Help (A)
│   │   │   ├── DraggableList.jsx      # SC 2.5.7: Dragging Movements (AA)
│   │   │   ├── SessionTimeout.jsx     # SC 2.2.6: Timeouts (AAA) ⭐
│   │   │   └── AbbreviationGlossary.jsx # SC 3.1.4: Abbreviations (AAA) ⭐
│   │   └── package-dependencies.json  # Required npm packages
│   │
│   ├── testing/
│   │   └── playwright-setup/
│   │       ├── playwright.config.js   # Playwright config
│   │       └── accessibility.spec.js  # Test template
│   │
│   ├── design/                         # (Coming soon)
│   └── content/
│       └── cms-scripts/                # Directus CMS update scripts
│
├── workflows/                          # Role-specific workflows
│   ├── DEVELOPER-WORKFLOW.md          # Developer guide
│   ├── DESIGNER-WORKFLOW.md           # Designer guide
│   ├── QA-WORKFLOW.md                 # QA engineer guide
│   └── PRODUCT-OWNER-WORKFLOW.md      # Product owner guide
│
├── resources/                          # Reference materials
│   ├── WEB-RESOURCES.md               # URLs to monitor for updates
│   └── TOOLS-CATALOG.md               # Free & paid testing tools
│
├── scrapers/                           # Web scraping utilities
│   ├── update-standards.js            # Monitors WCAG/ARIA updates
│   └── CHANGELOG-STANDARDS.md         # Detected changes log
│
└── examples/                           # Real-world examples
    └── my-web-app/                    # Production WCAG 2.2 AA app
        ├── CASE-STUDY.md              # How compliance was achieved
        ├── eslint.config.js           # Working config
        └── accessibility.spec.js      # Working tests
```

---

## Features

### 📋 Complete Standards Documentation

- **WCAG 2.2 Level AA** - Complete checklist with code examples (57 criteria)
- **WCAG 2.2 Level AAA Tier 1** - 5 quick-win AAA criteria (1-2 weeks implementation)
- **Section 508 (US)** - Federal compliance mapping
- **EN 301 549 (EU)** - European accessibility standard
- **VPAT 2.5 Template** - Document compliance for customers

### 🛠️ Ready-to-Use Implementation

- **ESLint Configuration** - Catch 80% of issues during development
- **Playwright + axe-core Tests** - Automated accessibility testing for AA and AAA Tier 1
- **6 Reusable Components** - WCAG 2.2 Level AA + AAA React components:
  - Tooltip (hover/focus content)
  - AccessibleAuthForm (password managers, magic links)
  - ConsistentHelp (help widgets)
  - DraggableList (drag & drop with keyboard alternatives)
  - SessionTimeout (Level AAA - timeout warnings) ⭐
  - AbbreviationGlossary (Level AAA - searchable glossary) ⭐
- **W3C Validation Scripts** - HTML, CSS, and link validation with W3C tools
- **CMS Scripts** - Auto-update accessibility documentation (Directus)

### 📖 Role-Specific Workflows

- **Developers** - ESLint setup → Component patterns → Automated tests
- **Designers** - Contrast checking → Focus states → ARIA annotations
- **QA Engineers** - Testing procedures → Tools guide → Bug templates
- **Product Owners** - Acceptance criteria → DoD → Budget planning

### 🔍 Standards Monitoring

- **Web Scraper** - Monitors WCAG, ARIA, WebAIM for updates
- **Change Detection** - Alerts when standards are updated
- **Automated** - Runs monthly via GitHub Actions (optional)

### 🎓 Real-World Example

- **My Web App Case Study** - Production app achieving WCAG 2.2 AA
- **Lighthouse Score:** 95-100
- **axe Violations:** 0
- **Cost:** $0 (free tools only)

---

## Getting Started

### For New Projects

**1. Clone this repository:**
```bash
git clone https://github.com/jdonnelly-zspace/accessibility-standards.git
cd accessibility-standards
```

**2. Copy templates to your project:**
```bash
# ESLint config
cp implementation/development/eslint-a11y-config.js /path/to/your-project/eslint.config.js

# Playwright tests
cp -r implementation/testing/playwright-setup/* /path/to/your-project/tests/

# Components
cp implementation/development/components/* /path/to/your-project/src/components/
```

**3. Install dependencies in your project:**
```bash
cd /path/to/your-project
npm install --save-dev eslint eslint-plugin-jsx-a11y @playwright/test @axe-core/playwright
```

**4. Run tools:**
```bash
# Lint your code
npm run lint

# Run accessibility tests
npx playwright test
```

---

### For Existing Projects

**1. Review standards:**
- Read [`standards/WCAG-2.2-LEVEL-AA.md`](standards/WCAG-2.2-LEVEL-AA.md)
- Identify gaps in your current implementation

**2. Add automated checks:**
- Install ESLint with jsx-a11y plugin
- Add Playwright + axe-core tests
- Run Lighthouse audits

**3. Fix issues:**
- Use workflows as guides for your role
- Prioritize high-impact issues (keyboard, contrast, labels)
- Test with real assistive technologies

**4. Document compliance:**
- Fill out VPAT template
- Publish accessibility statement

---

## Standards Compliance

This framework helps you achieve:

- ✅ **WCAG 2.2 Level AA** (recommended minimum)
- ✅ **Section 508** (US Federal)
- ✅ **EN 301 549** (EU)
- ✅ **ADA Title III** (web accessibility)

**Success Criteria:**
- Lighthouse accessibility score ≥ 95
- Zero axe DevTools violations
- 100% keyboard navigable
- Screen reader compatible
- Color contrast ≥ 4.5:1 (text)

---

## Level AAA - Tier 1 Quick Wins (Optional)

Beyond Level AA compliance, this framework includes **5 Level AAA success criteria** that can be implemented in just **1-2 weeks**. These are optional enhancements that provide additional accessibility benefits:

### ⚡ The 5 Quick Wins

1. **SC 2.2.6: Timeouts** - Display session timeout duration to prevent data loss
2. **SC 2.3.2: Three Flashes** - No animations flash more than 3 times per second
3. **SC 2.4.10: Section Headings** - Organize content with descriptive headings
4. **SC 3.1.4: Abbreviations** - Provide expanded forms for abbreviations
5. **SC 3.2.5: Change on Request** - User controls all navigation (no auto-redirects)

### 📦 What's Included

- **Complete documentation:** [`standards/WCAG-2.2-LEVEL-AAA-TIER1.md`](standards/WCAG-2.2-LEVEL-AAA-TIER1.md)
- **2 React components:** SessionTimeout, AbbreviationGlossary
- **Automated tests:** Playwright test suite for all 5 criteria
- **Implementation guide:** Step-by-step instructions with code examples
- **Timeline:** 1-2 weeks for full implementation

### 🎯 Should You Implement Level AAA Tier 1?

**YES, if:**
- You want to go beyond the standard Level AA compliance
- You have 1-2 weeks available for accessibility improvements
- Your users benefit from extra clarity (timeouts, abbreviations, structured content)
- You're a government, healthcare, or education site

**MAYBE NOT, if:**
- Level AA already meets your legal/business requirements
- You're under tight deadlines
- Resources are limited (Level AA is the priority)

**Note:** Level AA is the internationally recognized standard. These Level AAA enhancements are optional but highly recommended for improved user experience.

---

## Tools Required

**All tools are FREE:**

| Tool | Purpose | Install |
|------|---------|---------|
| **ESLint** | Catch issues while coding | `npm install --save-dev eslint eslint-plugin-jsx-a11y` |
| **Playwright + axe-core** | Automated testing | `npm install --save-dev @playwright/test @axe-core/playwright` |
| **Lighthouse** | Audit & scoring | Built into Chrome DevTools (F12) |
| **axe DevTools** | Browser scanning | [Chrome Web Store](https://chrome.google.com/webstore/detail/axe-devtools/lhdoppojpmngadmnindnejefpokejbdd) |
| **WAVE** | Visual feedback | [WAVE Extension](https://wave.webaim.org/extension/) |
| **VoiceOver** | Screen reader (Mac) | Built into macOS (Cmd+F5) |
| **NVDA** | Screen reader (Windows) | [Free Download](https://www.nvaccess.org/) |
| **WebAIM Contrast Checker** | Color contrast | [Online Tool](https://webaim.org/resources/contrastchecker/) |

**Total Cost: $0**

---

## Case Study: My Web App

See [`examples/my-web-app/CASE-STUDY.md`](examples/my-web-app/CASE-STUDY.md) for detailed case study of achieving WCAG 2.2 Level AA compliance.

**Results:**
- **Lighthouse:** 95-100 accessibility score
- **axe DevTools:** 0 violations
- **WCAG 2.2 Level AA:** Fully conformant
- **Implementation Time:** ~2 weeks
- **Cost:** $0 (all free tools)

**Key Learnings:**
- ESLint catches 80% of issues during development
- Automated testing (Playwright + axe) provides fast feedback
- Manual keyboard + screen reader testing is essential
- Building accessible from start is 10-100x cheaper than retrofitting

---

## Contributing

Found a resource that should be tracked? Have a better pattern? Want to add a new component?

1. Fork this repository
2. Create a feature branch
3. Add your contribution
4. Submit a pull request

**Areas we'd love contributions:**
- Additional accessible component patterns
- Design system integration guides
- More CMS platform scripts (WordPress, Contentful, etc.)
- Additional testing scenarios
- Translations to other languages

---

## Maintenance

### Monitoring Standards Updates

**Automated (Recommended):**
```bash
# Install dependencies
npm install

# Run scraper manually
npm run scrape:update
```

**GitHub Actions (Optional):**
Set up automated monthly checks:
```yaml
# .github/workflows/scrape-standards.yml
name: Check Standards Updates
on:
  schedule:
    - cron: '0 0 1 * *'  # Monthly on 1st
jobs:
  scrape:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run scrape:update
```

### Keeping Framework Current

**Monthly:**
- Run web scraper to check for standards updates
- Review changelog for detected changes
- Update documentation if WCAG/ARIA changes

**Quarterly:**
- Review examples for best practices
- Update component library with new patterns
- Check for new testing tools

**Annually:**
- Review all documentation for accuracy
- Update VPAT template if new version released
- Audit example implementations

---

## Resources

**Official Standards:**
- W3C WCAG 2.2: https://www.w3.org/WAI/WCAG22/quickref/
- ARIA APG: https://www.w3.org/WAI/ARIA/apg/
- Section 508: https://www.section508.gov/

**Learning:**
- WebAIM: https://webaim.org/
- MDN Accessibility: https://developer.mozilla.org/en-US/docs/Web/Accessibility
- A11y Project: https://www.a11yproject.com/

**Tools:**
- See [`resources/TOOLS-CATALOG.md`](resources/TOOLS-CATALOG.md)

---

## License

MIT License - See [LICENSE](LICENSE) for details.

---

## Support

**Questions?**
- Review the relevant workflow guide for your role
- Check the WCAG 2.2 checklist in `standards/`
- Review the real-world example in `examples/my-web-app/`

**Found an issue?**
- Open an issue on GitHub
- Include which workflow/document needs clarification

---

## Roadmap

**Next additions:**
- [ ] Vue.js component library
- [ ] Angular accessibility patterns
- [ ] WordPress plugin integration
- [ ] Automated PDF accessibility guide
- [ ] Mobile app (React Native) patterns
- [ ] Video/media accessibility guide

---

**Built with ❤️ for accessible web**

**Version:** 1.0.0
**Last Updated:** October 2025
**WCAG Version:** 2.2 (October 2023)
