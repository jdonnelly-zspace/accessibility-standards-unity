#!/usr/bin/env node

/**
 * Accessibility Standards Setup CLI
 *
 * Interactive Node.js tool to install accessibility configs into projects
 *
 * Usage:
 *   npx github:jdonnelly-zspace/accessibility-standards init
 *   npm link && a11y-setup init
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple prompts without external dependencies
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(`${colors.cyan}${prompt}${colors.reset} `, resolve);
  });
}

async function detectProjectType() {
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

    if (deps.next) return 'next';
    if (deps.nuxt) return 'nuxt';
    if (deps.react) return 'react';
    if (deps.vue) return 'vue';
    return 'unknown';
  } catch (error) {
    return 'unknown';
  }
}

function fileExists(filepath) {
  try {
    return fs.existsSync(filepath);
  } catch (error) {
    return false;
  }
}

function copyFile(source, dest, options = {}) {
  const sourcePath = path.join(__dirname, '..', source);

  if (!fs.existsSync(sourcePath)) {
    log(`  ⚠ Source file not found: ${source}`, colors.yellow);
    return false;
  }

  // Create destination directory if needed
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  // Check if file exists
  if (fs.existsSync(dest) && !options.overwrite) {
    log(`  ⚠ File exists (skipping): ${dest}`, colors.yellow);
    return false;
  }

  try {
    fs.copyFileSync(sourcePath, dest);
    log(`  ✓ Copied: ${dest}`, colors.green);
    return true;
  } catch (error) {
    log(`  ✗ Failed to copy: ${dest} - ${error.message}`, colors.red);
    return false;
  }
}

function installDependencies(packages, dev = true) {
  try {
    const devFlag = dev ? '--save-dev' : '--save';
    log(`  → Installing: ${packages.join(', ')}`, colors.yellow);
    execSync(`npm install ${devFlag} ${packages.join(' ')}`, { stdio: 'inherit' });
    log(`  ✓ Installed`, colors.green);
    return true;
  } catch (error) {
    log(`  ⚠ Could not install automatically`, colors.yellow);
    log(`    Run manually: npm install ${dev ? '--save-dev' : ''} ${packages.join(' ')}`, colors.yellow);
    return false;
  }
}

function addScriptToPackageJson(scriptName, command) {
  try {
    const packageJsonPath = 'package.json';
    if (!fs.existsSync(packageJsonPath)) {
      log(`  ⚠ No package.json found`, colors.yellow);
      return false;
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    packageJson.scripts = packageJson.scripts || {};

    if (packageJson.scripts[scriptName]) {
      log(`  ℹ Script "${scriptName}" already exists`, colors.blue);
      return false;
    }

    packageJson.scripts[scriptName] = command;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
    log(`  ✓ Added "${scriptName}" script to package.json`, colors.green);
    return true;
  } catch (error) {
    log(`  ⚠ Could not modify package.json: ${error.message}`, colors.yellow);
    return false;
  }
}

async function installESLint() {
  log('\n📋 Installing ESLint Accessibility Config...', colors.bright);

  // Copy config
  copyFile('implementation/development/eslint-a11y-config.js', 'eslint.config.js');

  // Install dependencies
  if (fileExists('package.json')) {
    const packages = ['eslint', 'eslint-plugin-jsx-a11y', '@eslint/js', 'globals'];
    installDependencies(packages, true);
    addScriptToPackageJson('lint', 'eslint .');
  }

  log('✓ ESLint config installed', colors.green);
}

async function installTests() {
  log('\n🧪 Installing Playwright + axe-core Tests...', colors.bright);

  // Create test directory
  if (!fs.existsSync('tests/e2e')) {
    fs.mkdirSync('tests/e2e', { recursive: true });
  }

  // Copy test files
  copyFile('implementation/testing/playwright-setup/playwright.config.js', 'playwright.config.js');
  copyFile('implementation/testing/playwright-setup/accessibility.spec.js', 'tests/e2e/accessibility.spec.js');

  // Install dependencies
  if (fileExists('package.json')) {
    const packages = ['@playwright/test', '@axe-core/playwright'];
    installDependencies(packages, true);
    addScriptToPackageJson('test:a11y', 'playwright test');

    log('\n  ℹ️  Run after installation: npx playwright install', colors.blue);
  }

  log('✓ Playwright tests installed', colors.green);
}

async function installComponents() {
  log('\n🧩 Installing Accessible Components...', colors.bright);

  // Detect component directory
  let componentsDir = 'src/components';
  if (fs.existsSync('components')) {
    componentsDir = 'components';
  } else if (!fs.existsSync('src/components')) {
    fs.mkdirSync('src/components', { recursive: true });
  }

  // Copy components
  copyFile('implementation/development/components/Tooltip.jsx', path.join(componentsDir, 'Tooltip.jsx'));

  log(`✓ Components installed in ${componentsDir}/`, colors.green);
}

async function main() {
  console.clear();

  log('╔════════════════════════════════════════════════════════════╗', colors.blue);
  log('║   Accessibility Standards Setup                            ║', colors.blue);
  log('╚════════════════════════════════════════════════════════════╝', colors.blue);
  log('');

  // Check if in a valid project
  if (!fileExists('package.json')) {
    log('⚠️  No package.json found in current directory', colors.yellow);
    const answer = await question('Continue anyway? (y/N): ');
    if (answer.toLowerCase() !== 'y') {
      log('\nExiting...', colors.yellow);
      rl.close();
      process.exit(0);
    }
  }

  // Detect project type
  const projectType = await detectProjectType();
  if (projectType !== 'unknown') {
    log(`✓ Detected project type: ${projectType}`, colors.green);
  }
  log('');

  // Interactive prompts
  log('What would you like to install?', colors.bright);
  log('');

  const installESLintAnswer = await question('  Install ESLint accessibility config? (Y/n): ');
  const shouldInstallESLint = installESLintAnswer.toLowerCase() !== 'n';

  const installTestsAnswer = await question('  Install Playwright + axe-core tests? (Y/n): ');
  const shouldInstallTests = installTestsAnswer.toLowerCase() !== 'n';

  const installComponentsAnswer = await question('  Install reusable accessible components? (Y/n): ');
  const shouldInstallComponents = installComponentsAnswer.toLowerCase() !== 'n';

  log('');

  const installDepsAnswer = await question('  Install npm dependencies automatically? (Y/n): ');
  const shouldInstallDeps = installDepsAnswer.toLowerCase() !== 'n';

  log('');
  log('─'.repeat(60), colors.blue);
  log('Starting installation...', colors.bright);
  log('─'.repeat(60), colors.blue);

  // Install selected components
  if (shouldInstallESLint) {
    await installESLint();
  }

  if (shouldInstallTests) {
    await installTests();
  }

  if (shouldInstallComponents) {
    await installComponents();
  }

  // Summary
  log('');
  log('╔════════════════════════════════════════════════════════════╗', colors.blue);
  log('║   Installation Complete! 🎉                                ║', colors.blue);
  log('╚════════════════════════════════════════════════════════════╝', colors.blue);
  log('');

  log('Installed:', colors.bright);
  if (shouldInstallESLint) log('  ✓ ESLint accessibility config', colors.green);
  if (shouldInstallTests) log('  ✓ Playwright + axe-core tests', colors.green);
  if (shouldInstallComponents) log('  ✓ Accessible components', colors.green);
  log('');

  log('Next steps:', colors.yellow);
  log('');
  if (shouldInstallESLint) {
    log('  1. Run ESLint: npm run lint', colors.cyan);
  }
  if (shouldInstallTests) {
    log('  2. Install browsers: npx playwright install', colors.cyan);
    log('  3. Run tests: npm run test:a11y', colors.cyan);
  }
  log('  4. Review docs: https://github.com/jdonnelly-zspace/accessibility-standards', colors.cyan);
  log('');

  log('For more information:', colors.bright);
  log('https://github.com/jdonnelly-zspace/accessibility-standards', colors.blue);
  log('');

  rl.close();
}

// Handle errors
process.on('uncaughtException', (error) => {
  log(`\n✗ Error: ${error.message}`, colors.red);
  rl.close();
  process.exit(1);
});

process.on('SIGINT', () => {
  log('\n\nInstallation cancelled.', colors.yellow);
  rl.close();
  process.exit(0);
});

// Run
main().catch((error) => {
  log(`\n✗ Fatal error: ${error.message}`, colors.red);
  rl.close();
  process.exit(1);
});
