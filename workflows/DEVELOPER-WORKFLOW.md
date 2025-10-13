# Developer Workflow - Accessibility Implementation

This guide shows developers how to integrate accessibility into their daily workflow using tools and patterns from this framework.

---

## Quick Start (5 Minutes)

### 1. Install Tools
```bash
# ESLint accessibility plugin
npm install --save-dev eslint eslint-plugin-jsx-a11y @eslint/js globals

# Testing tools
npm install --save-dev @playwright/test @axe-core/playwright
```

### 2. Copy Configuration
```bash
# From accessibility-standards repository
cp implementation/development/eslint-a11y-config.js ./eslint.config.js
cp implementation/testing/playwright-setup/playwright.config.js ./
cp implementation/testing/playwright-setup/accessibility.spec.js ./tests/e2e/
```

### 3. Copy Components
```bash
# Reusable accessible components demonstrating WCAG 2.2 compliance
cp implementation/development/components/Tooltip.jsx ./src/components/
cp implementation/development/components/AccessibleAuthForm.jsx ./src/components/
cp implementation/development/components/ConsistentHelp.jsx ./src/components/
cp implementation/development/components/DraggableList.jsx ./src/components/
```

### 4. Run Linter & Validators
```bash
npm run lint
# Fix auto-fixable issues
npm run lint -- --fix

# W3C validation (HTML, CSS, Links)
npm run validate:html ./dist/index.html
npm run validate:css ./dist/styles.css
npm run check:links https://your-site.com
```

---

## Development Lifecycle Integration

### Phase 1: Before Coding

**Review Requirements**
- [ ] Check if design includes accessibility annotations
- [ ] Identify interactive elements that need keyboard support
- [ ] Note any custom components that need ARIA
- [ ] Review WCAG 2.2 new criteria (focus visibility, target size, dragging alternatives)
- [ ] Check if forms need autocomplete attributes (SC 3.3.7)
- [ ] Verify authentication doesn't require cognitive tests (SC 3.3.8)

**Set Up Linting**
- [ ] Install ESLint with jsx-a11y plugin
- [ ] Configure VS Code to show lint errors inline
- [ ] Enable auto-fix on save (optional)

**VS Code Settings:**
```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ]
}
```

---

### Phase 2: During Development

#### Use Semantic HTML First

**✅ Good:**
```jsx
<button onClick={handleClick}>Submit</button>
<a href="/page">Go to page</a>
<nav aria-label="Main navigation">...</nav>
<main id="main-content">...</main>
```

**❌ Bad:**
```jsx
<div onClick={handleClick}>Submit</div>  {/* Not keyboard accessible */}
<div>Go to page</div>  {/* Not recognized as link */}
<div className="nav">...</div>  {/* No semantic meaning */}
```

#### Add ARIA Only When Necessary

```jsx
// Icon-only button (needs aria-label)
<button aria-label="Close menu">
  <XIcon />
</button>

// Expandable section
<button
  aria-expanded={isOpen}
  aria-controls="menu-panel"
  onClick={toggleMenu}
>
  Menu
</button>

// Blog card with context
<a
  href={`/blog/${slug}`}
  aria-label={`Read article: ${title}. ${excerpt}`}
>
  <img src={image} alt="" />
  <h3>{title}</h3>
</a>
```

#### Follow Keyboard Patterns

```jsx
function Modal({ isOpen, onClose, children }) {
  // ESC key closes modal (WCAG 2.1.2)
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div role="dialog" aria-modal="true">
      {children}
    </div>
  );
}
```

#### Run ESLint Continuously

```bash
# Watch mode - shows errors as you code
npm run lint -- --watch

# Fix auto-fixable issues
npm run lint -- --fix
```

**Common ESLint jsx-a11y Warnings:**
| Rule | Issue | Fix |
|------|-------|-----|
| `alt-text` | Missing alt on `<img>` | Add `alt="description"` or `alt=""` for decorative |
| `aria-props` | Invalid ARIA attribute | Use valid ARIA attributes (aria-label, aria-expanded, etc.) |
| `click-events-have-key-events` | onClick without keyboard handler | Add onKeyDown handler or use `<button>` |
| `label-has-associated-control` | Form label not associated | Add matching `htmlFor`/`id` pair |

---

### Phase 3: Manual Testing

#### Keyboard Testing (Daily)

**Test Every Interactive Element:**
```
1. Tab       → Move to next element
2. Shift+Tab → Move to previous element
3. Enter     → Activate button/link
4. Space     → Activate button, toggle checkbox
5. Escape    → Close modal/dropdown
6. Arrows    → Navigate menu/list (if applicable)
```

**Checklist:**
- [ ] All buttons/links reachable via Tab
- [ ] Focus indicator clearly visible (SC 2.4.11 - not obscured by sticky headers)
- [ ] Tab order matches visual order
- [ ] No keyboard traps (can always Tab away)
- [ ] Modals close with Escape
- [ ] Interactive elements at least 24x24px (SC 2.5.8)
- [ ] Draggable interfaces have keyboard alternatives (SC 2.5.7)

#### Use Browser DevTools

**Chrome Lighthouse (Quick Check):**
1. Open DevTools (F12)
2. Lighthouse tab
3. Select "Accessibility" only
4. Run audit
5. Target score: **95+**

**Chrome Accessibility Tree:**
1. DevTools → Elements tab
2. Click "Accessibility" sub-tab
3. Verify elements have proper roles/names

---

### Phase 4: Automated Testing

#### Write Accessibility Tests

**Example Test (Playwright + axe-core):**
```javascript
// tests/e2e/accessibility.spec.js
import { test } from '@playwright/test';
import { injectAxe, checkA11y } from '@axe-core/playwright';

test('homepage is accessible', async ({ page }) => {
  await page.goto('/');
  await injectAxe(page);
  await checkA11y(page, null, {
    detailedReport: true
  });
});

test('modal is keyboard accessible', async ({ page }) => {
  await page.goto('/');

  // Open modal
  await page.click('[aria-haspopup="dialog"]');
  const modal = page.locator('[role="dialog"]');
  await expect(modal).toBeVisible();

  // Close with ESC
  await page.keyboard.press('Escape');
  await expect(modal).not.toBeVisible();
});
```

**Run Tests:**
```bash
# Run all tests
npx playwright test

# Run accessibility tests only
npx playwright test accessibility

# Interactive mode
npx playwright test --ui
```

---

### Phase 5: Pre-Commit

**Automated Checks:**
```bash
# Run all accessibility checks before committing
npm run lint
npm run test:a11y

# W3C validation (HTML, CSS, Links)
npm run validate:all
```

**Husky Pre-Commit Hook (Optional):**
```bash
# Install husky
npm install --save-dev husky
npx husky init

# .husky/pre-commit
#!/usr/bin/env sh
npm run lint
npm run test:a11y
```

---

## Code Patterns Library

### Skip Navigation

```jsx
// App.jsx or Layout.jsx
function Layout({ children }) {
  return (
    <>
      {/* Skip link - first focusable element */}
      <a
        href="#main-content"
        className="skip-link"
      >
        Skip to main content
      </a>

      <Header />

      <main id="main-content">
        {children}
      </main>

      <Footer />
    </>
  );
}
```

```css
/* Show skip link only on focus */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #6366f1;
  color: white;
  padding: 8px 16px;
  text-decoration: none;
  z-index: 1000;
}

.skip-link:focus {
  top: 0;
}
```

---

### Focus Management (Modals)

```jsx
function Modal({ isOpen, onClose, title, children }) {
  const modalRef = useRef(null);
  const previousFocus = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Save currently focused element
      previousFocus.current = document.activeElement;

      // Focus modal
      modalRef.current?.focus();

      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Restore focus
      previousFocus.current?.focus();

      // Restore body scroll
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  // ESC key handler
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      ref={modalRef}
      tabIndex={-1}
    >
      <h2 id="modal-title">{title}</h2>
      {children}
      <button onClick={onClose}>Close</button>
    </div>
  );
}
```

---

### Form Accessibility

```jsx
function ContactForm() {
  const [errors, setErrors] = useState({});

  return (
    <form onSubmit={handleSubmit}>
      {/* Email field with label, required indicator, error */}
      <div>
        <label htmlFor="email">
          Email Address <span className="required" aria-label="required">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <span id="email-error" role="alert" className="error">
            {errors.email}
          </span>
        )}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}
```

---

### Reduced Motion Support

```jsx
// Respect user's motion preferences
function AnimatedComponent() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className={prefersReducedMotion ? 'no-animation' : 'with-animation'}
    >
      Content
    </div>
  );
}

// Hook
function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}
```

```css
/* Disable animations for users who prefer reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

---

## WCAG 2.2 Specific Requirements

### New in WCAG 2.2 - Developer Checklist

#### SC 2.4.11: Focus Not Obscured (Level AA)
**Requirement:** Focused elements must not be completely hidden by sticky/fixed content.

**Implementation:**
```css
/* Add scroll padding to account for fixed headers */
html {
  scroll-padding-top: 80px; /* Height of fixed header */
}

/* Fixed header should not obscure focus */
.fixed-header {
  position: fixed;
  top: 0;
  z-index: 100;
}
```

#### SC 2.5.7: Dragging Movements (Level AA)
**Requirement:** All dragging functionality must have a single-pointer alternative.

**Implementation:**
```jsx
// Use the DraggableList component from components/
import DraggableList from './components/DraggableList';

// Or provide alternative controls
function SortableItem({ item, onMoveUp, onMoveDown }) {
  return (
    <div draggable onDragStart={...}>
      {item.name}
      {/* Alternative: buttons for keyboard/touch users */}
      <button onClick={onMoveUp} aria-label="Move up">↑</button>
      <button onClick={onMoveDown} aria-label="Move down">↓</button>
    </div>
  );
}
```

#### SC 2.5.8: Target Size (Minimum) (Level AA)
**Requirement:** Interactive elements must be at least 24x24 CSS pixels.

**Implementation:**
```css
/* Ensure minimum touch target size */
button,
a,
input[type="checkbox"],
input[type="radio"] {
  min-width: 24px;
  min-height: 24px;
  padding: 12px; /* Or use padding to reach 24x24 */
}

/* Icon buttons */
.icon-button {
  width: 44px;  /* 44x44 is better for mobile */
  height: 44px;
  padding: 10px;
}
```

#### SC 3.3.7: Redundant Entry (Level A)
**Requirement:** Don't make users re-enter information already provided.

**Implementation:**
```jsx
function CheckoutForm() {
  const [sameAsBilling, setSameAsBilling] = useState(false);

  return (
    <form>
      {/* Billing address */}
      <AddressFields name="billing" />

      {/* Shipping address with auto-fill option */}
      <label>
        <input
          type="checkbox"
          checked={sameAsBilling}
          onChange={(e) => setSameAsBilling(e.target.checked)}
        />
        Shipping address same as billing
      </label>

      {!sameAsBilling && <AddressFields name="shipping" />}

      {/* Autocomplete for common fields */}
      <input
        type="email"
        name="email"
        autoComplete="email"
        required
      />
      <input
        type="tel"
        name="phone"
        autoComplete="tel"
        required
      />
    </form>
  );
}
```

#### SC 3.3.8: Accessible Authentication (Level AA)
**Requirement:** Authentication must not require cognitive function tests (memory, puzzles) without alternatives.

**Implementation:**
```jsx
// Use the AccessibleAuthForm component from components/
import AccessibleAuthForm from './components/AccessibleAuthForm';

// Or ensure your login form:
// 1. Supports password managers (autocomplete attribute)
// 2. Allows paste (don't block onPaste)
// 3. Provides alternatives (magic link, SSO, biometric)
function LoginForm() {
  return (
    <form>
      <input
        type="email"
        autoComplete="email"  // ✅ Password manager support
        required
      />
      <input
        type="password"
        autoComplete="current-password"  // ✅ Password manager support
        // ❌ NO: onPaste={(e) => e.preventDefault()}
        required
      />
      <button type="submit">Sign In</button>

      {/* Alternative authentication methods */}
      <button type="button" onClick={sendMagicLink}>
        Email me a sign-in link
      </button>
    </form>
  );
}
```

---

## Common Mistakes & Solutions

### Mistake #1: Using `<div>` as Button

**❌ Bad:**
```jsx
<div onClick={handleClick}>Click me</div>
```

**✅ Good:**
```jsx
<button onClick={handleClick}>Click me</button>
```

---

### Mistake #2: Missing Alt Text

**❌ Bad:**
```jsx
<img src="photo.jpg" />
```

**✅ Good:**
```jsx
<img src="photo.jpg" alt="Team celebrating product launch" />
```

---

### Mistake #3: Icon-Only Buttons Without Labels

**❌ Bad:**
```jsx
<button>
  <XIcon />
</button>
```

**✅ Good:**
```jsx
<button aria-label="Close menu">
  <XIcon />
</button>
```

---

### Mistake #4: Generic Link Text

**❌ Bad:**
```jsx
<a href="/article">Read more</a>
```

**✅ Good:**
```jsx
<a href="/article" aria-label="Read article: Getting Started with React">
  Read more
</a>
```

---

## Resources

- **Component Library:** `/implementation/development/components/`
- **ESLint Config:** `/implementation/development/eslint-a11y-config.js`
- **Test Templates:** `/implementation/testing/playwright-setup/`
- **WCAG Checklist:** `/standards/WCAG-2.2-LEVEL-AA.md`

---

## Getting Help

**Questions?**
- Review WCAG 2.2 standards in `/standards/`
- Check code patterns in this workflow
- Search ARIA APG: https://www.w3.org/WAI/ARIA/apg/

**Found an Issue?**
- Run ESLint to catch common problems
- Test with keyboard navigation
- Run Playwright accessibility tests

---

**Last Updated:** October 2025
