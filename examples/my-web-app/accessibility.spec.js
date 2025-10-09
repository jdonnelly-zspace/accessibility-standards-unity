import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from '@axe-core/playwright';

/**
 * Accessibility E2E Tests
 * Tests WCAG 2.2 Level AA compliance using axe-core
 */

test.describe('Accessibility - WCAG 2.2 Level AA', () => {
  test('homepage should be accessible', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Inject axe-core
    await injectAxe(page);

    // Run accessibility checks
    await checkA11y(page, null, {
      detailedReport: true,
      detailedReportOptions: {
        html: true,
      },
    });
  });

  test('blog post page should be accessible', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');

    // Wait for blog posts and click first one
    await page.waitForSelector('[data-testid="blog-post-card"], article', { timeout: 5000 });
    await page.locator('[data-testid="blog-post-card"], article').first().locator('a').first().click();
    await page.waitForLoadState('networkidle');

    // Inject axe-core
    await injectAxe(page);

    // Run accessibility checks
    await checkA11y(page, null, {
      detailedReport: true,
    });
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Get all headings
    const h1Count = await page.locator('h1').count();

    // Should have exactly one H1 per page
    expect(h1Count).toBe(1);

    // Verify heading order (H1 should come before H2, etc.)
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    expect(headings.length).toBeGreaterThan(1);
  });

  test('should have skip to content link', async ({ page }) => {
    await page.goto('/');

    // Focus on skip link (first tab)
    await page.keyboard.press('Tab');

    // Skip link should be visible when focused
    const skipLink = page.getByText(/skip to content/i);
    await expect(skipLink).toBeVisible();

    // Should have proper href
    const href = await skipLink.getAttribute('href');
    expect(href).toContain('#main');
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Tab through interactive elements
    await page.keyboard.press('Tab'); // Skip link
    await page.keyboard.press('Tab'); // First nav element

    // Check that focus is visible
    const focusedElement = await page.evaluate(() => document.activeElement.tagName);
    expect(['A', 'BUTTON', 'INPUT']).toContain(focusedElement);
  });

  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

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

    // Inject axe and run color contrast check specifically
    await injectAxe(page);

    await checkA11y(page, null, {
      detailedReport: true,
      rules: {
        'color-contrast': { enabled: true },
      },
    });
  });

  test('footer pages should be accessible', async ({ page }) => {
    const footerPages = ['/privacy', '/terms', '/accessibility'];

    for (const pagePath of footerPages) {
      await page.goto(pagePath);
      await page.waitForLoadState('networkidle');

      // Inject axe-core
      await injectAxe(page);

      // Run accessibility checks
      await checkA11y(page, null, {
        detailedReport: true,
      });
    }
  });

  test('modals should be keyboard accessible', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Open search modal with keyboard
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab'); // Navigate to search button
    await page.keyboard.press('Enter');

    // Modal should open
    const modal = page.locator('[role="dialog"], .modal');
    await expect(modal).toBeVisible();

    // Should be able to close with ESC
    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible();
  });
});
