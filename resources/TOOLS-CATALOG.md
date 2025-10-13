# Accessibility Testing Tools Catalog

Comprehensive catalog of free and paid accessibility testing tools.

---

## Browser Extensions (Free)

### axe DevTools
**Platform:** Chrome, Firefox, Edge
**Cost:** Free (Pro version available)
**URL:** https://www.deque.com/axe/devtools/
**Best For:** Automated accessibility testing during development

**Features:**
- Automated scans for WCAG violations
- Intelligent Guided Tests for complex patterns
- Highlights affected elements
- Provides remediation guidance
- Export reports

**How to Use:**
1. Install extension
2. Open browser DevTools (F12)
3. Click "axe DevTools" tab
4. Click "Scan ALL of my page"
5. Review violations and best practices

---

### WAVE (Web Accessibility Evaluation Tool)
**Platform:** Chrome, Firefox, Edge
**Cost:** Free (API available)
**URL:** https://wave.webaim.org/extension/
**Best For:** Visual representation of accessibility issues

**Features:**
- Visual feedback directly on page
- Icon overlay showing errors/alerts
- Color contrast analysis
- Structural analysis
- ARIA verification

**How to Use:**
1. Install extension
2. Navigate to page
3. Click WAVE icon in toolbar
4. Review issues highlighted on page

---

### Accessibility Insights
**Platform:** Chrome, Edge
**Cost:** Free
**URL:** https://accessibilityinsights.io/
**Best For:** Guided assessments and automated checks

**Features:**
- FastPass (automated checks)
- Assessment (guided manual testing)
- Ad-hoc tools (color picker, heading structure)
- Tab stops visualization

---

### Lighthouse
**Platform:** Built into Chrome DevTools
**Cost:** Free
**URL:** https://developer.chrome.com/docs/lighthouse/
**Best For:** Overall performance and accessibility scoring

**Features:**
- Accessibility score (0-100)
- Performance, SEO, best practices scores
- Automated audit reports
- Improvement suggestions

**How to Use:**
1. Open Chrome DevTools (F12)
2. Go to "Lighthouse" tab
3. Select "Accessibility" category
4. Click "Analyze page load"
5. Review report and suggestions

---

## Automated Testing Libraries

### @axe-core/playwright
**Platform:** Node.js, Playwright
**Cost:** Free (open source)
**URL:** https://github.com/dequelabs/axe-core-npm
**Best For:** CI/CD integration, automated E2E testing

**Installation:**
```bash
npm install --save-dev @axe-core/playwright @playwright/test
```

**Example:**
```javascript
import { test } from '@playwright/test';
import { injectAxe, checkA11y } from '@axe-core/playwright';

test('homepage should be accessible', async ({ page }) => {
  await page.goto('/');
  await injectAxe(page);
  await checkA11y(page);
});
```

---

### @axe-core/react
**Platform:** React
**Cost:** Free (open source)
**URL:** https://github.com/dequelabs/axe-core-npm
**Best For:** Real-time accessibility checks during React development

**Installation:**
```bash
npm install --save-dev @axe-core/react
```

---

### jest-axe
**Platform:** Jest, React Testing Library
**Cost:** Free (open source)
**URL:** https://github.com/nickcolley/jest-axe
**Best For:** Unit/component testing in Jest

---

### eslint-plugin-jsx-a11y
**Platform:** ESLint, React
**Cost:** Free (open source)
**URL:** https://github.com/jsx-eslint/eslint-plugin-jsx-a11y
**Best For:** Linting JSX for accessibility issues during development

**Installation:**
```bash
npm install --save-dev eslint-plugin-jsx-a11y
```

---

## Screen Readers

### Free Screen Readers

#### NVDA (NonVisual Desktop Access)
**Platform:** Windows
**Cost:** Free (open source)
**URL:** https://www.nvaccess.org/
**Best For:** Windows screen reader testing

**Keyboard Shortcuts:**
- NVDA + Down Arrow: Read next line
- NVDA + Up Arrow: Read previous line
- Insert: NVDA modifier key
- NVDA + T: Read page title

---

#### VoiceOver
**Platform:** macOS, iOS (built-in)
**Cost:** Free (included with OS)
**Best For:** Mac/iOS screen reader testing

**Keyboard Shortcuts:**
- Cmd + F5: Toggle VoiceOver
- VO + A: Read entire page
- VO + Right Arrow: Next item
- VO = Ctrl + Option

---

#### ChromeVox
**Platform:** ChromeOS, Chrome browser
**Cost:** Free
**URL:** Chrome Web Store
**Best For:** Chrome-based screen reader testing

---

### Paid Screen Readers

#### JAWS (Job Access With Speech)
**Platform:** Windows
**Cost:** ~$1,000+ (most popular commercial screen reader)
**URL:** https://www.freedomscientific.com/products/software/jaws/
**Best For:** Professional screen reader testing (industry standard)

---

## Color Contrast Tools

### WebAIM Contrast Checker
**Platform:** Web-based
**Cost:** Free
**URL:** https://webaim.org/resources/contrastchecker/
**Best For:** Quick contrast ratio checks

**Features:**
- Foreground/background color comparison
- WCAG pass/fail indicators
- Lightness adjustments
- Link contrast checking

---

### Colour Contrast Analyser (CCA)
**Platform:** Windows, macOS
**Cost:** Free
**URL:** https://www.tpgi.com/color-contrast-checker/
**Best For:** Desktop color picking and analysis

**Features:**
- Eyedropper tool
- Real-time WCAG pass/fail
- Color blindness simulation
- Standalone application

---

### Chrome DevTools Color Picker
**Platform:** Chrome DevTools (built-in)
**Cost:** Free
**Best For:** In-browser contrast checking

**How to Use:**
1. Inspect element (F12)
2. Click color swatch in CSS
3. View contrast ratio in color picker
4. See WCAG AA/AAA indicators

---

## Keyboard Testing Tools

### Tab Stops Visualization
**Platform:** Accessibility Insights extension
**Cost:** Free
**Best For:** Visualizing tab order

---

### Keyboard Navigation Tester
**Platform:** Manual testing
**Cost:** Free
**Best For:** Verifying keyboard accessibility

**Checklist:**
- [ ] Tab: Navigate forward
- [ ] Shift + Tab: Navigate backward
- [ ] Enter: Activate buttons/links
- [ ] Space: Toggle checkboxes, activate buttons
- [ ] Escape: Close modals/dropdowns
- [ ] Arrow keys: Navigate lists/menus

---

## Vision Simulators

### NoCoffee Vision Simulator
**Platform:** Chrome, Firefox
**Cost:** Free
**URL:** https://accessgarage.wordpress.com/
**Best For:** Simulating various vision impairments

**Features:**
- Color blindness simulation
- Low vision simulation
- Cataracts, glaucoma simulation
- Field loss simulation

---

### Chrome DevTools Vision Deficiencies
**Platform:** Chrome DevTools (built-in)
**Cost:** Free
**Best For:** Quick color blindness testing

**How to Use:**
1. Open DevTools (F12)
2. Cmd/Ctrl + Shift + P
3. Type "Render"
4. Select "Emulate vision deficiencies"

---

## Automated Testing Platforms

### Pa11y
**Platform:** Node.js CLI
**Cost:** Free (open source)
**URL:** https://pa11y.org/
**Best For:** Command-line accessibility testing

---

### Playwright (with axe)
**Platform:** Node.js
**Cost:** Free (open source)
**URL:** https://playwright.dev/
**Best For:** Cross-browser E2E accessibility testing

---

## Site Scanners

### WAVE API
**Platform:** API
**Cost:** Paid
**URL:** https://wave.webaim.org/api/
**Best For:** Automated site-wide scanning

---

### Siteimprove
**Platform:** SaaS
**Cost:** Paid
**URL:** https://siteimprove.com/
**Best For:** Enterprise accessibility monitoring

---

## Documentation Generators

### accessibilityjs
**Platform:** JavaScript
**Cost:** Free (open source)
**URL:** https://github.com/github/accessibilityjs
**Best For:** Detecting common accessibility errors

---

## Recommended Tool Stack

### Development Setup
1. **Linter:** eslint-plugin-jsx-a11y
2. **Browser Extension:** axe DevTools
3. **Component Testing:** @axe-core/react or jest-axe
4. **E2E Testing:** @axe-core/playwright
5. **CI/CD:** Playwright with axe-core
6. **Contrast:** WebAIM Contrast Checker
7. **Screen Reader:** VoiceOver (Mac) or NVDA (Windows)

### Total Cost: $0

---

## Testing Workflow

1. **Development:**
   - ESLint catches issues as you code
   - axe DevTools for manual spot checks

2. **Component Testing:**
   - jest-axe in unit tests
   - @axe-core/react in development mode

3. **E2E Testing:**
   - Playwright + axe-core in CI/CD
   - Runs on every pull request

4. **Manual Testing:**
   - Keyboard navigation
   - Screen reader testing (VoiceOver/NVDA)
   - Color contrast verification
   - Browser zoom testing

5. **Pre-Release:**
   - Full Lighthouse audit
   - WAVE scan
   - Accessibility Insights guided assessment

---

---

## W3C Validators (Official)

### Nu HTML Checker (HTML Validator)
**Platform:** Web-based, CLI, API
**Cost:** Free (open source)
**URL:** https://validator.w3.org/nu/
**GitHub:** https://github.com/validator/validator
**Best For:** Validating HTML5 markup for accessibility and standards compliance

**Features:**
- Validates HTML5 documents
- Catches invalid markup that can break assistive technologies
- Identifies accessibility-related HTML errors
- Supports file upload, URL checking, or direct input
- API available for automated testing

**Why It Matters for Accessibility:**
Invalid HTML can cause screen readers and other assistive technologies to fail or produce unexpected results. Proper HTML structure is foundational to WCAG compliance (Success Criterion 4.1.1 Parsing - though obsolete in WCAG 2.2, valid HTML is still essential).

**How to Use:**

**Web Interface:**
1. Visit https://validator.w3.org/nu/
2. Enter URL, upload file, or paste HTML
3. Click "Check"
4. Review errors and warnings

**Command Line (with vnu.jar):**
```bash
# Install via npm
npm install -g vnu-jar

# Validate a file
vnu mypage.html

# Validate a directory
vnu --skip-non-html src/

# Validate with specific checks
vnu --also-check-css --also-check-svg index.html
```

**API Usage:**
```bash
# Validate URL via API
curl -H "Content-Type: text/html; charset=utf-8" \
  --data-binary @index.html \
  https://validator.w3.org/nu/?out=json
```

**Integration with CI/CD:**
See `scripts/validate-html.sh` for automated validation script.

---

### W3C CSS Validator
**Platform:** Web-based, CLI (via API)
**Cost:** Free
**URL:** https://jigsaw.w3.org/css-validator/
**Best For:** Validating CSS for proper syntax and compatibility

**Features:**
- Validates CSS 1, 2, 2.1, and 3
- Identifies syntax errors
- Checks for browser compatibility issues
- Validates CSS embedded in HTML
- API available for automation

**Why It Matters for Accessibility:**
Invalid CSS can cause layout problems, hidden content, or broken responsive design, all of which can impact accessibility. Proper CSS ensures consistent rendering across browsers and assistive technologies.

**How to Use:**

**Web Interface:**
1. Visit https://jigsaw.w3.org/css-validator/
2. Enter URL, upload file, or paste CSS
3. Select CSS profile (usually CSS level 3)
4. Click "Check"

**API Usage:**
```bash
# Validate CSS file
curl "https://jigsaw.w3.org/css-validator/validator?uri=https://example.com/style.css&output=json"

# Validate with specific profile
curl "https://jigsaw.w3.org/css-validator/validator?uri=https://example.com&profile=css3svg&output=json"
```

**Integration with CI/CD:**
See `scripts/validate-css.sh` for automated validation script.

---

### W3C Link Checker
**Platform:** Web-based, Perl script
**Cost:** Free
**URL:** https://validator.w3.org/checklink
**Best For:** Finding broken links that violate WCAG 2.4.4 (Link Purpose)

**Features:**
- Checks all links on a page
- Identifies broken links (404s, 500s)
- Checks redirects
- Validates anchors
- Recursively checks site (with depth limit)

**Why It Matters for Accessibility:**
Broken links violate WCAG Success Criterion 2.4.4 (Link Purpose in Context) when they promise functionality or content that doesn't exist. They also create poor user experience for all users, particularly those using assistive technologies.

**How to Use:**

**Web Interface:**
1. Visit https://validator.w3.org/checklink
2. Enter URL to check
3. Choose options (depth, check anchors, etc.)
4. Click "Check"
5. Review broken links report

**Command Line:**
```bash
# Install checklink (requires Perl)
# On macOS with Homebrew
brew install perl
cpan install W3C::LinkChecker

# Check a URL
checklink https://example.com

# Check with depth
checklink -r 2 https://example.com

# Check and suppress external links
checklink -r 1 -s https://example.com
```

**Integration with CI/CD:**
See `scripts/check-links.sh` for automated link checking script.

---

### W3C Internationalization Checker
**Platform:** Web-based, API
**Cost:** Free
**URL:** https://validator.w3.org/i18n-checker/
**GitHub:** https://github.com/w3c/i18n-checker
**Best For:** Checking internationalization readiness and character encoding

**Features:**
- Checks character encoding declarations
- Validates lang attributes (WCAG 3.1.1, 3.1.2)
- Checks text direction (dir attribute)
- Identifies markup issues for international content
- Checks HTTP headers for charset

**Why It Matters for Accessibility:**
Proper language declaration (WCAG 3.1.1 Language of Page, 3.1.2 Language of Parts) is critical for screen readers to pronounce content correctly. Character encoding issues can cause garbled text for users worldwide.

**How to Use:**

**Web Interface:**
1. Visit https://validator.w3.org/i18n-checker/
2. Enter URL to check
3. Click "Check"
4. Review language, encoding, and direction issues

**API Usage:**
```bash
# Check internationalization via API
curl "https://validator.w3.org/i18n-checker/check?uri=https://example.com"
```

**Common Issues Detected:**
- Missing or incorrect `lang` attribute on `<html>` tag
- Missing charset declaration in HTTP headers or meta tag
- Inconsistent language declarations
- Missing `dir` attribute for RTL languages

---

## Recommended Validation Workflow

### During Development
1. **HTML Validation** - Run on every page before commit
2. **CSS Validation** - Run on stylesheet changes
3. **ESLint** - Catch React/JSX accessibility issues
4. **axe DevTools** - Manual spot checks in browser

### Pre-Commit / CI Pipeline
1. **HTML Validator** - Automated via `npm run validate:html`
2. **CSS Validator** - Automated via `npm run validate:css`
3. **ESLint** - Automated linting
4. **Playwright + axe-core** - E2E accessibility tests

### Pre-Release
1. **Link Checker** - Full site crawl via `npm run check:links`
2. **Lighthouse** - Full accessibility audit
3. **WAVE** - Visual accessibility check
4. **Manual Testing** - Keyboard, screen reader, zoom

### Total Cost: $0 (All W3C tools are free!)

---

## Resources

- **Tool Comparison:** https://www.w3.org/WAI/ER/tools/
- **Testing Guide:** https://www.w3.org/WAI/test-evaluate/
- **W3C Developer Tools:** https://www.w3.org/developers/tools/

---

**Last Updated:** October 2025
