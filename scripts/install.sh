#!/bin/bash

###################################################################################
# Accessibility Standards Installation Script
###################################################################################
#
# Quick installation of accessibility configs and tools into any project
#
# Usage:
#   # Full installation (interactive)
#   curl -fsSL https://raw.githubusercontent.com/jdonnelly-zspace/accessibility-standards/main/scripts/install.sh | bash
#
#   # Or with options:
#   curl -fsSL https://raw.githubusercontent.com/jdonnelly-zspace/accessibility-standards/main/scripts/install.sh | bash -s -- --eslint --tests --components
#
# Options:
#   --eslint         Install ESLint accessibility config
#   --tests          Install Playwright + axe-core tests
#   --components     Install reusable accessible components
#   --all            Install everything (default if no options)
#   --project-path   Target project path (default: current directory)
#   --help           Show this help message
#
###################################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
INSTALL_ESLINT=false
INSTALL_TESTS=false
INSTALL_COMPONENTS=false
INSTALL_ALL=false
PROJECT_PATH="."
REPO_URL="https://github.com/jdonnelly-zspace/accessibility-standards"
TEMP_DIR="/tmp/a11y-standards-$$"

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --eslint)
      INSTALL_ESLINT=true
      shift
      ;;
    --tests)
      INSTALL_TESTS=true
      shift
      ;;
    --components)
      INSTALL_COMPONENTS=true
      shift
      ;;
    --all)
      INSTALL_ALL=true
      shift
      ;;
    --project-path)
      PROJECT_PATH="$2"
      shift 2
      ;;
    --help)
      grep "^#" "$0" | grep -v "#!/bin/bash" | sed 's/^# //'
      exit 0
      ;;
    *)
      echo -e "${RED}Unknown option: $1${NC}"
      exit 1
      ;;
  esac
done

# If no specific options, install all
if [ "$INSTALL_ESLINT" = false ] && [ "$INSTALL_TESTS" = false ] && [ "$INSTALL_COMPONENTS" = false ]; then
  INSTALL_ALL=true
fi

if [ "$INSTALL_ALL" = true ]; then
  INSTALL_ESLINT=true
  INSTALL_TESTS=true
  INSTALL_COMPONENTS=true
fi

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Accessibility Standards Installation                     ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Verify target directory
if [ ! -d "$PROJECT_PATH" ]; then
  echo -e "${RED}✗ Project path does not exist: $PROJECT_PATH${NC}"
  exit 1
fi

cd "$PROJECT_PATH"
echo -e "${GREEN}✓ Target project: $(pwd)${NC}"
echo ""

# Clone repository to temp directory
echo -e "${YELLOW}→ Downloading accessibility standards...${NC}"
git clone --quiet --depth 1 "$REPO_URL" "$TEMP_DIR" 2>/dev/null
echo -e "${GREEN}✓ Downloaded${NC}"
echo ""

# Install ESLint config
if [ "$INSTALL_ESLINT" = true ]; then
  echo -e "${YELLOW}→ Installing ESLint accessibility config...${NC}"

  cp "$TEMP_DIR/implementation/development/eslint-a11y-config.js" "./eslint.config.js"
  echo -e "${GREEN}  ✓ Copied eslint.config.js${NC}"

  # Check if package.json exists
  if [ -f "package.json" ]; then
    echo -e "${YELLOW}  → Installing ESLint dependencies...${NC}"
    npm install --save-dev eslint eslint-plugin-jsx-a11y @eslint/js globals 2>/dev/null || {
      echo -e "${YELLOW}  ⚠ Could not auto-install. Run manually:${NC}"
      echo -e "${YELLOW}    npm install --save-dev eslint eslint-plugin-jsx-a11y @eslint/js globals${NC}"
    }

    # Add lint script if not present
    if ! grep -q '"lint"' package.json; then
      echo -e "${YELLOW}  → Adding lint script to package.json...${NC}"
      # Using Node to safely modify package.json
      node -e "const pkg=require('./package.json');pkg.scripts=pkg.scripts||{};pkg.scripts.lint='eslint .';require('fs').writeFileSync('package.json',JSON.stringify(pkg,null,2));" 2>/dev/null || {
        echo -e "${YELLOW}  ⚠ Could not auto-add lint script. Add manually to package.json:${NC}"
        echo -e "${YELLOW}    \"lint\": \"eslint .\"${NC}"
      }
    fi
  else
    echo -e "${YELLOW}  ⚠ No package.json found. Install dependencies manually:${NC}"
    echo -e "${YELLOW}    npm install --save-dev eslint eslint-plugin-jsx-a11y @eslint/js globals${NC}"
  fi

  echo -e "${GREEN}✓ ESLint installed${NC}"
  echo ""
fi

# Install Playwright tests
if [ "$INSTALL_TESTS" = true ]; then
  echo -e "${YELLOW}→ Installing Playwright accessibility tests...${NC}"

  mkdir -p tests/e2e
  cp "$TEMP_DIR/implementation/testing/playwright-setup/playwright.config.js" "./"
  cp "$TEMP_DIR/implementation/testing/playwright-setup/accessibility.spec.js" "./tests/e2e/"
  echo -e "${GREEN}  ✓ Copied test files${NC}"

  if [ -f "package.json" ]; then
    echo -e "${YELLOW}  → Installing Playwright dependencies...${NC}"
    npm install --save-dev @playwright/test @axe-core/playwright 2>/dev/null || {
      echo -e "${YELLOW}  ⚠ Could not auto-install. Run manually:${NC}"
      echo -e "${YELLOW}    npm install --save-dev @playwright/test @axe-core/playwright${NC}"
      echo -e "${YELLOW}    npx playwright install${NC}"
    }

    # Add test script
    if ! grep -q '"test:a11y"' package.json; then
      echo -e "${YELLOW}  → Adding test script to package.json...${NC}"
      node -e "const pkg=require('./package.json');pkg.scripts=pkg.scripts||{};pkg.scripts['test:a11y']='playwright test';require('fs').writeFileSync('package.json',JSON.stringify(pkg,null,2));" 2>/dev/null || {
        echo -e "${YELLOW}  ⚠ Could not auto-add test script. Add manually:${NC}"
        echo -e "${YELLOW}    \"test:a11y\": \"playwright test\"${NC}"
      }
    fi
  fi

  echo -e "${GREEN}✓ Playwright tests installed${NC}"
  echo ""
fi

# Install components
if [ "$INSTALL_COMPONENTS" = true ]; then
  echo -e "${YELLOW}→ Installing reusable accessible components...${NC}"

  # Detect project structure
  if [ -d "src/components" ]; then
    COMPONENTS_DIR="src/components"
  elif [ -d "components" ]; then
    COMPONENTS_DIR="components"
  else
    COMPONENTS_DIR="src/components"
    mkdir -p "$COMPONENTS_DIR"
  fi

  cp "$TEMP_DIR/implementation/development/components/Tooltip.jsx" "$COMPONENTS_DIR/"
  echo -e "${GREEN}  ✓ Copied Tooltip.jsx to $COMPONENTS_DIR/${NC}"

  echo -e "${GREEN}✓ Components installed${NC}"
  echo ""
fi

# Cleanup
rm -rf "$TEMP_DIR"

# Summary
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Installation Complete! 🎉                                ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}Installed:${NC}"
[ "$INSTALL_ESLINT" = true ] && echo -e "  ${GREEN}✓${NC} ESLint accessibility config"
[ "$INSTALL_TESTS" = true ] && echo -e "  ${GREEN}✓${NC} Playwright + axe-core tests"
[ "$INSTALL_COMPONENTS" = true ] && echo -e "  ${GREEN}✓${NC} Accessible components (Tooltip)"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo ""

if [ "$INSTALL_ESLINT" = true ]; then
  echo -e "  1. Run ESLint: ${BLUE}npm run lint${NC}"
fi

if [ "$INSTALL_TESTS" = true ]; then
  echo -e "  2. Run accessibility tests: ${BLUE}npx playwright test${NC}"
  echo -e "     (First time: ${BLUE}npx playwright install${NC})"
fi

echo -e "  3. Review documentation: ${BLUE}https://github.com/jdonnelly-zspace/accessibility-standards${NC}"
echo ""
echo -e "${GREEN}For more information, visit:${NC}"
echo -e "${BLUE}https://github.com/jdonnelly-zspace/accessibility-standards${NC}"
echo ""
