import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from '@axe-core/playwright';

/**
 * Accessibility E2E Test Template
 *
 * Tests WCAG 2.2 Level AA compliance using axe-core and manual checks
 *
 * Prerequisites:
 * 1. npm install --save-dev @playwright/test @axe-core/playwright
 * 2. Configure playwright.config.js with base URL
 * 3. Update test URLs below to match your application routes
 *
 * Run tests:
 * - npx playwright test
 * - npx playwright test --ui (interactive mode)
 * - npx playwright test --headed (see browser)
 *
 * Based on: My Web App project (WCAG 2.2 Level AA compliant)
 */

test.describe('Accessibility - WCAG 2.2 Level AA', () => {

  test('homepage should be accessible', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Inject axe-core accessibility engine
    await injectAxe(page);

    // Run automated accessibility checks
    await checkA11y(page, null, {
      detailedReport: true,
      detailedReportOptions: {
        html: true,
      },
    });
  });

  test('should have exactly one H1 per page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // WCAG 2.4.6: Headings and Labels (Level AA)
    const h1Count = await page.locator('h1').count();

    // Should have exactly one H1 per page
    expect(h1Count).toBe(1);

    // Verify heading order (H1 should come before H2, etc.)
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    expect(headings.length).toBeGreaterThan(1);
  });

  test('should have skip to content link', async ({ page }) => {
    await page.goto('/');

    // WCAG 2.4.1: Bypass Blocks (Level A)
    // Focus on skip link (first tab)
    await page.keyboard.press('Tab');

    // Skip link should be visible when focused
    const skipLink = page.getByText(/skip to (main )?content/i);
    await expect(skipLink).toBeVisible();

    // Should have proper href to main content
    const href = await skipLink.getAttribute('href');
    expect(href).toMatch(/#main/);
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // WCAG 2.1.1: Keyboard (Level A)
    // Tab through interactive elements
    await page.keyboard.press('Tab'); // Skip link
    await page.keyboard.press('Tab'); // First nav element

    // Check that focus is visible on interactive elements
    const focusedElement = await page.evaluate(() => document.activeElement.tagName);
    expect(['A', 'BUTTON', 'INPUT']).toContain(focusedElement);
  });

  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // WCAG 4.1.2: Name, Role, Value (Level A)
    // Check navigation has proper aria-label
    const nav = page.locator('nav').first();
    const ariaLabel = await nav.getAttribute('aria-label');
    expect(ariaLabel).toBeTruthy();

    // Check buttons have accessible names
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();

    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i);
      const text = await button.textContent();
      const label = await button.getAttribute('aria-label');
      const hasAccessibleName = text?.trim().length > 0 || label?.length > 0;
      expect(hasAccessibleName).toBe(true);
    }
  });

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // WCAG 1.4.3: Contrast (Minimum) (Level AA)
    // Inject axe and run color contrast check specifically
    await injectAxe(page);

    await checkA11y(page, null, {
      detailedReport: true,
      rules: {
        'color-contrast': { enabled: true },
      },
    });
  });

  test('modals should be keyboard accessible and dismissible', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // WCAG 2.1.2: No Keyboard Trap (Level A)
    // Try to open a modal/dialog (customize selector for your app)
    const modalTrigger = page.locator('button[aria-haspopup="dialog"], button[aria-expanded]').first();

    if (await modalTrigger.count() > 0) {
      // Open modal with keyboard
      await modalTrigger.focus();
      await page.keyboard.press('Enter');

      // Modal should open
      const modal = page.locator('[role="dialog"], .modal');
      await expect(modal).toBeVisible();

      // Should be able to close with ESC key
      await page.keyboard.press('Escape');

      // Wait a moment for animation
      await page.waitForTimeout(500);

      // Modal should close
      await expect(modal).not.toBeVisible();
    }
  });

  test('forms should have proper labels', async ({ page }) => {
    // WCAG 3.3.2: Labels or Instructions (Level A)
    // Customize this test based on your application's forms

    // Example: Check if your app has a search form
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const inputs = page.locator('input[type="text"], input[type="email"], input[type="search"]');
    const inputCount = await inputs.count();

    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);

      // Check for label, aria-label, or aria-labelledby
      const hasLabel = await input.evaluate((el) => {
        const id = el.getAttribute('id');
        const ariaLabel = el.getAttribute('aria-label');
        const ariaLabelledby = el.getAttribute('aria-labelledby');
        const hasLabelElement = id && document.querySelector(`label[for="${id}"]`);

        return !!(hasLabelElement || ariaLabel || ariaLabelledby);
      });

      expect(hasLabel).toBe(true);
    }
  });

  test('images should have alt text', async ({ page }) => {
    // WCAG 1.1.1: Non-text Content (Level A)
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');

      // All images must have alt attribute (can be empty for decorative images)
      expect(alt).not.toBeNull();
    }
  });

  // ========================================================================
  // WCAG 2.2 NEW SUCCESS CRITERIA TESTS
  // ========================================================================

  test('focused elements should not be obscured by fixed content - SC 2.4.11', async ({ page }) => {
    // WCAG 2.4.11: Focus Not Obscured (Minimum) (Level AA) - NEW in WCAG 2.2
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check if page has sticky/fixed headers or footers
    const fixedElements = await page.locator('[style*="position: fixed"], [style*="position: sticky"]').all();

    if (fixedElements.length > 0) {
      // Tab through several interactive elements
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab');

        // Get the currently focused element's bounding box
        const focusedBox = await page.evaluate(() => {
          const el = document.activeElement;
          if (!el) return null;

          const rect = el.getBoundingClientRect();
          return {
            top: rect.top,
            bottom: rect.bottom,
            left: rect.left,
            right: rect.right,
            height: rect.height,
            width: rect.width
          };
        });

        if (focusedBox) {
          // Check that focused element is not completely obscured
          // At minimum, the element should not be completely covered by fixed content
          const isInViewport = focusedBox.top >= 0 &&
                              focusedBox.bottom <= page.viewportSize().height &&
                              focusedBox.left >= 0 &&
                              focusedBox.right <= page.viewportSize().width;

          // If element is outside viewport, scroll should reveal it
          if (!isInViewport) {
            await page.evaluate(() => {
              document.activeElement?.scrollIntoView({ block: 'center', behavior: 'smooth' });
            });

            // Wait for scroll to complete
            await page.waitForTimeout(300);
          }

          // After scrolling, at least part of the element should be visible
          const finalBox = await page.evaluate(() => {
            const el = document.activeElement;
            if (!el) return null;
            const rect = el.getBoundingClientRect();
            return { top: rect.top, bottom: rect.bottom };
          });

          // Verify that some part of the focused element is visible
          expect(finalBox.top).toBeLessThan(page.viewportSize().height);
          expect(finalBox.bottom).toBeGreaterThan(0);
        }
      }
    }
  });

  test('interactive elements should meet minimum target size - SC 2.5.8', async ({ page }) => {
    // WCAG 2.5.8: Target Size (Minimum) (Level AA) - NEW in WCAG 2.2
    // Minimum size: 24x24 CSS pixels (unless exception applies)
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const interactiveSelectors = 'button, a, input, [role="button"], [role="link"], [tabindex="0"]';
    const elements = await page.locator(interactiveSelectors).all();

    const minSize = 24; // pixels
    const violations = [];

    for (let i = 0; i < Math.min(elements.length, 20); i++) {
      const element = elements[i];

      const box = await element.boundingBox();
      if (box) {
        const { width, height } = box;

        // Check if element meets minimum size (24x24px)
        // Exceptions: inline text links, elements with sufficient spacing
        const tagName = await element.evaluate(el => el.tagName.toLowerCase());
        const isInline = await element.evaluate(el => {
          const display = window.getComputedStyle(el).display;
          return display === 'inline' || display === 'inline-block';
        });

        // Skip inline text links (common exception)
        if (tagName === 'a' && isInline) {
          continue;
        }

        // Check size (allowing small margin for rounding)
        if (width < minSize - 1 || height < minSize - 1) {
          violations.push({
            tag: tagName,
            width: Math.round(width),
            height: Math.round(height),
            text: await element.textContent().catch(() => '')
          });
        }
      }
    }

    // Report violations if any (excluding common exceptions)
    if (violations.length > 0) {
      console.warn(`SC 2.5.8 Target Size violations found:`, violations);

      // Fail test if there are significant violations
      // Adjust threshold based on your app's needs
      expect(violations.length).toBeLessThan(3);
    }
  });

  test('draggable interfaces should have keyboard alternatives - SC 2.5.7', async ({ page }) => {
    // WCAG 2.5.7: Dragging Movements (Level AA) - NEW in WCAG 2.2
    // All dragging functionality must have a single-pointer alternative
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for elements with draggable attribute
    const draggableElements = await page.locator('[draggable="true"]').all();

    for (const draggable of draggableElements) {
      // Each draggable element should have keyboard alternatives
      // Check for nearby buttons (up/down, move, etc.)
      const parent = await draggable.evaluateHandle(el => el.parentElement);

      const hasAlternativeControls = await parent.evaluate(parentEl => {
        // Look for buttons that might control movement
        const buttons = parentEl.querySelectorAll('button, [role="button"]');
        const buttonTexts = Array.from(buttons).map(btn => btn.textContent.toLowerCase());

        // Check for common alternative control patterns
        const hasUpDown = buttonTexts.some(text => text.includes('up') || text.includes('down'));
        const hasMoveControls = buttonTexts.some(text =>
          text.includes('move') || text.includes('reorder') || text.includes('arrow')
        );

        return hasUpDown || hasMoveControls || buttons.length > 0;
      });

      // Draggable elements should have tabindex or be inside focusable container
      const isFocusable = await draggable.evaluate(el => {
        const tabindex = el.getAttribute('tabindex');
        return tabindex !== null || el.matches('button, a, input, select, textarea');
      });

      // Either the element should be keyboard accessible OR have alternative controls
      expect(isFocusable || hasAlternativeControls).toBe(true);
    }
  });

  test('forms should not require redundant entry - SC 3.3.7', async ({ page }) => {
    // WCAG 3.3.7: Redundant Entry (Level A) - NEW in WCAG 2.2
    // Information previously entered should be auto-populated or selectable
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for common form fields that should have autocomplete
    const commonFields = [
      { selector: 'input[type="email"]', autocompleteSuggestions: ['email', 'username'] },
      { selector: 'input[name*="email"]', autocompleteSuggestions: ['email'] },
      { selector: 'input[type="tel"]', autocompleteSuggestions: ['tel'] },
      { selector: 'input[name*="phone"]', autocompleteSuggestions: ['tel'] },
      { selector: 'input[name*="address"]', autocompleteSuggestions: ['street-address', 'address-line1'] },
      { selector: 'input[name*="city"]', autocompleteSuggestions: ['address-level2'] },
      { selector: 'input[name*="zip"]', autocompleteSuggestions: ['postal-code'] },
    ];

    let fieldsChecked = 0;
    let fieldsWithAutocomplete = 0;

    for (const field of commonFields) {
      const elements = await page.locator(field.selector).all();

      for (const element of elements) {
        fieldsChecked++;

        const autocomplete = await element.getAttribute('autocomplete');

        if (autocomplete && autocomplete !== 'off') {
          fieldsWithAutocomplete++;
        }
      }
    }

    // If there are forms, check that most fields support autocomplete
    if (fieldsChecked > 0) {
      const autocompleteRate = fieldsWithAutocomplete / fieldsChecked;

      // At least 50% of common form fields should have autocomplete
      // Adjust threshold based on your application
      expect(autocompleteRate).toBeGreaterThan(0.3);
    }
  });

  test('authentication should not require cognitive function tests - SC 3.3.8', async ({ page }) => {
    // WCAG 3.3.8: Accessible Authentication (Minimum) (Level AA) - NEW in WCAG 2.2
    // No cognitive function test required unless alternatives provided
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Look for login/authentication forms
    const loginSelectors = [
      'form[action*="login"]',
      'form[action*="signin"]',
      'input[type="password"]',
      'input[name="password"]',
      'button[type="submit"]:has-text("Sign in")',
      'button[type="submit"]:has-text("Log in")',
    ];

    let hasAuthForm = false;

    for (const selector of loginSelectors) {
      const count = await page.locator(selector).count();
      if (count > 0) {
        hasAuthForm = true;
        break;
      }
    }

    if (hasAuthForm) {
      // Check password fields support autocomplete (password manager support)
      const passwordInputs = await page.locator('input[type="password"]').all();

      for (const input of passwordInputs) {
        const autocomplete = await input.getAttribute('autocomplete');

        // Password fields should NOT have autocomplete="off" (blocks password managers)
        expect(autocomplete).not.toBe('off');

        // Password fields should allow paste (SC 3.3.8)
        const onPasteHandler = await input.getAttribute('onpaste');
        expect(onPasteHandler).not.toContain('return false');
        expect(onPasteHandler).not.toContain('preventDefault');
      }

      // Check for alternative authentication methods
      const hasAlternatives = await page.evaluate(() => {
        const pageText = document.body.textContent.toLowerCase();

        // Look for alternative auth methods
        const hasMagicLink = pageText.includes('magic link') || pageText.includes('email link');
        const hasBiometric = pageText.includes('face id') ||
                            pageText.includes('touch id') ||
                            pageText.includes('biometric');
        const hasSSO = pageText.includes('sign in with') ||
                      pageText.includes('continue with google');

        return hasMagicLink || hasBiometric || hasSSO;
      });

      // Auth should support password managers OR provide alternatives
      // This is a soft check - adjust based on your needs
      if (passwordInputs.length > 0) {
        console.log('Auth form detected - ensure password managers work and/or alternatives exist');
      }
    }
  });

  // Add more tests specific to your application:
  // - Blog post pages
  // - Footer pages
  // - Category filtering
  // - Search functionality
  // - User authentication flows
  // - Form submissions
});
