/**
 * Playwright Configuration for Accessibility Testing
 *
 * This configuration is optimized for accessibility testing with:
 * - axe-core integration
 * - Multiple browsers (Chromium, Firefox, WebKit)
 * - Accessibility-focused settings
 *
 * Usage:
 * 1. npm install --save-dev @playwright/test @axe-core/playwright
 * 2. Update baseURL to match your application
 * 3. Run: npx playwright test
 *
 * Based on: My Web App project
 */

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Directory containing test files
  testDir: './tests/e2e',

  // Maximum time one test can run
  timeout: 30 * 1000,

  // Test configuration
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // Reporter to use
  reporter: [
    ['html'],
    ['list']
  ],

  // Shared settings for all tests
  use: {
    // Base URL for your application
    baseURL: 'http://localhost:5173',

    // Collect trace when retrying the failed test
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Emulate viewport
    viewport: { width: 1280, height: 720 },

    // Accessibility-specific settings
    // Slower actions for better accessibility testing
    actionTimeout: 10000,
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Enable accessibility features in Chrome
        launchOptions: {
          args: ['--force-prefers-reduced-motion']
        }
      },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // Mobile viewports for responsive accessibility testing
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },

    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // Run your local dev server before starting tests
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
