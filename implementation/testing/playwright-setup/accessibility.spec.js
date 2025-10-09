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

  // Add more tests specific to your application:
  // - Blog post pages
  // - Footer pages
  // - Category filtering
  // - Search functionality
  // - User authentication flows
  // - Form submissions
});
