/**
 * ESLint Accessibility Configuration Template
 *
 * This configuration includes comprehensive accessibility (a11y) linting rules
 * based on the eslint-plugin-jsx-a11y plugin.
 *
 * WCAG 2.2 Level AA Coverage:
 * - Semantic HTML elements
 * - ARIA attribute validation
 * - Keyboard accessibility
 * - Color contrast (via manual testing)
 * - Alt text for images
 * - Form label associations
 *
 * Usage:
 * 1. Install dependencies: npm install --save-dev eslint eslint-plugin-jsx-a11y
 * 2. Copy this file to your project root as `eslint.config.js`
 * 3. Run: npx eslint . (or npm run lint if configured in package.json)
 *
 * Based on: My Web App project (WCAG 2.2 Level AA compliant)
 */

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'build', 'node_modules']),
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    plugins: {
      'jsx-a11y': jsxA11y,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],

      // ========================================
      // WCAG 2.2 Level AA Accessibility Rules
      // ========================================

      // 1.1.1 Non-text Content (Level A)
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/img-redundant-alt': 'warn',

      // 1.3.1 Info and Relationships (Level A)
      'jsx-a11y/heading-has-content': 'error',

      // 2.1.1 Keyboard (Level A)
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/interactive-supports-focus': 'warn',
      'jsx-a11y/no-noninteractive-element-interactions': 'warn',

      // 2.4.2 Page Titled (Level A)
      'jsx-a11y/html-has-lang': 'error',

      // 2.4.4 Link Purpose (In Context) (Level A)
      'jsx-a11y/anchor-has-content': 'error',
      'jsx-a11y/anchor-is-valid': 'warn',

      // 3.3.2 Labels or Instructions (Level A)
      'jsx-a11y/label-has-associated-control': 'warn',

      // 4.1.2 Name, Role, Value (Level A)
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-proptypes': 'error',
      'jsx-a11y/aria-unsupported-elements': 'error',
      'jsx-a11y/role-has-required-aria-props': 'error',
    },
  },
])
