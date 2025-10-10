# Installation Guide

This guide shows all the ways to install the Accessibility Standards Framework into your projects.

---

## Quick Install Methods

### Method 1: Interactive CLI (Recommended) ⭐

**Best for:** Interactive setup with choices

```bash
cd your-project
npx github:jdonnelly-zspace/accessibility-standards
```

**What happens:**
1. Prompts you to choose what to install:
   - ESLint accessibility config? (Y/n)
   - Playwright + axe-core tests? (Y/n)
   - Reusable components? (Y/n)
   - Install dependencies automatically? (Y/n)

2. Copies files to your project
3. Installs npm dependencies
4. Updates package.json with scripts

**Time:** ~2 minutes

---

### Method 2: Bash Script (No Node.js)

**Best for:** CI/CD pipelines, quick setup

```bash
# Full installation
curl -fsSL https://raw.githubusercontent.com/jdonnelly-zspace/accessibility-standards/main/scripts/install.sh | bash

# ESLint only
curl -fsSL https://raw.githubusercontent.com/jdonnelly-zspace/accessibility-standards/main/scripts/install.sh | bash -s -- --eslint

# Tests only
curl -fsSL https://raw.githubusercontent.com/jdonnelly-zspace/accessibility-standards/main/scripts/install.sh | bash -s -- --tests

# Components only
curl -fsSL https://raw.githubusercontent.com/jdonnelly-zspace/accessibility-standards/main/scripts/install.sh | bash -s -- --components

# Everything
curl -fsSL https://raw.githubusercontent.com/jdonnelly-zspace/accessibility-standards/main/scripts/install.sh | bash -s -- --all
```

**Script options:**
- `--eslint` - Install ESLint accessibility config
- `--tests` - Install Playwright + axe-core tests
- `--components` - Install reusable accessible components
- `--all` - Install everything (default)
- `--project-path <path>` - Target project (default: current directory)
- `--help` - Show help

---

### Method 3: Manual Installation

**Best for:** Full control, learning

#### Step 1: Install ESLint Config

```bash
# Copy config
curl -fsSL https://raw.githubusercontent.com/jdonnelly-zspace/accessibility-standards/main/implementation/development/eslint-a11y-config.js -o eslint.config.js

# Install dependencies
npm install --save-dev eslint eslint-plugin-jsx-a11y @eslint/js globals

# Add script to package.json
npm pkg set scripts.lint="eslint ."

# Run
npm run lint
```

#### Step 2: Install Playwright Tests

```bash
# Create test directory
mkdir -p tests/e2e

# Copy config
curl -fsSL https://raw.githubusercontent.com/jdonnelly-zspace/accessibility-standards/main/implementation/testing/playwright-setup/playwright.config.js -o playwright.config.js

# Copy test
curl -fsSL https://raw.githubusercontent.com/jdonnelly-zspace/accessibility-standards/main/implementation/testing/playwright-setup/accessibility.spec.js -o tests/e2e/accessibility.spec.js

# Install dependencies
npm install --save-dev @playwright/test @axe-core/playwright
npx playwright install

# Add script
npm pkg set scripts.test:a11y="playwright test"

# Run
npm run test:a11y
```

#### Step 3: Install Components

```bash
# Create components directory (adjust path for your project)
mkdir -p src/components

# Copy Tooltip
curl -fsSL https://raw.githubusercontent.com/jdonnelly-zspace/accessibility-standards/main/implementation/development/components/Tooltip.jsx -o src/components/Tooltip.jsx
```

---

### Method 4: Clone Repository

**Best for:** Contributing, customizing, reference

```bash
# Clone repo
git clone https://github.com/jdonnelly-zspace/accessibility-standards.git

# Optional: Use as git submodule
cd your-project
git submodule add https://github.com/jdonnelly-zspace/accessibility-standards.git docs/a11y

# Reference documentation
ls docs/a11y/standards/
ls docs/a11y/workflows/
```

---

## After Installation

### Verify Installation

Check that files were created:

```bash
# ESLint
ls eslint.config.js
npm run lint

# Playwright
ls playwright.config.js tests/e2e/accessibility.spec.js
npx playwright install
npm run test:a11y

# Components
ls src/components/Tooltip.jsx
```

---

### Next Steps

1. **Run ESLint:**
   ```bash
   npm run lint
   ```
   Fix any accessibility issues reported.

2. **Run Playwright Tests:**
   ```bash
   npm run test:a11y
   ```
   Ensure all tests pass.

3. **Run Lighthouse Audit:**
   - Open page in Chrome
   - DevTools (F12) → Lighthouse tab
   - Run accessibility audit
   - Target score: **95+**

4. **Review Workflows:**
   - Developers: [`workflows/DEVELOPER-WORKFLOW.md`](workflows/DEVELOPER-WORKFLOW.md)
   - Designers: [`workflows/DESIGNER-WORKFLOW.md`](workflows/DESIGNER-WORKFLOW.md)
   - QA: [`workflows/QA-WORKFLOW.md`](workflows/QA-WORKFLOW.md)
   - Product Owners: [`workflows/PRODUCT-OWNER-WORKFLOW.md`](workflows/PRODUCT-OWNER-WORKFLOW.md)

5. **Review Standards:**
   - WCAG 2.2 Checklist: [`standards/WCAG-2.2-LEVEL-AA.md`](standards/WCAG-2.2-LEVEL-AA.md)

---

## Project-Specific Setup

### React (Create React App or Vite)

```bash
cd my-react-app
npx github:jdonnelly-zspace/accessibility-standards

# Component directory will be detected as src/components/
```

### Next.js

```bash
cd my-nextjs-app
npx github:jdonnelly-zspace/accessibility-standards

# Adjust Playwright config if using custom ports
```

### Vue.js

```bash
cd my-vue-app
npx github:jdonnelly-zspace/accessibility-standards

# ESLint config works with Vue
# Playwright tests work out of the box
```

---

## Troubleshooting

### "command not found: npx"

Install Node.js 14+ from https://nodejs.org/

### "Cannot find module"

Run after installation:
```bash
npm install
npx playwright install
```

### "EACCES: permission denied"

Don't use sudo. Fix npm permissions:
```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

### Scripts don't run in existing project

Check `package.json` scripts section was updated:
```json
{
  "scripts": {
    "lint": "eslint .",
    "test:a11y": "playwright test"
  }
}
```

---

## Uninstalling

Remove files:
```bash
rm eslint.config.js
rm playwright.config.js
rm -rf tests/e2e/accessibility.spec.js
rm src/components/Tooltip.jsx
```

Remove dependencies:
```bash
npm uninstall eslint eslint-plugin-jsx-a11y @eslint/js globals
npm uninstall @playwright/test @axe-core/playwright
```

Remove scripts from `package.json`:
- Remove `"lint"` script
- Remove `"test:a11y"` script

---

## Updating

### Update Framework

```bash
# Re-run installer (overwrites files)
cd your-project
npx github:jdonnelly-zspace/accessibility-standards
```

### Check for Standards Updates

```bash
# In accessibility-standards repo
npm run scrape:update

# Check changelog
cat scrapers/CHANGELOG-STANDARDS.md
```

---

## Support

**Issues?**
- GitHub Issues: https://github.com/jdonnelly-zspace/accessibility-standards/issues
- Review workflows for your role
- Check WCAG checklist in `standards/`

---

**Last Updated:** October 2025
