# Installation Guide - Unity zSpace Accessibility Framework v3.1.0

This guide shows how to install the zSpace Accessibility Standards Framework into your Unity projects and set up the CLI auditing tools.

**Prerequisites:**
- Unity 2021.3 LTS or newer (2023.2+ recommended for Unity Accessibility Module)
- zSpace Unity SDK (download from https://developer.zspace.com/)
- zSpace hardware (for testing) or zSpace simulator
- **Node.js 18 LTS or newer** (for CLI auditing tools)

---

## Installation Options

### Option A: CLI Tools Only (Auditing & Analysis)
**Best for:** Auditing existing Unity projects, CI/CD integration, automated testing

### Option B: Unity Framework Only (Components & Prefabs)
**Best for:** Building accessible Unity applications from scratch

### Option C: Full Installation (CLI Tools + Unity Framework)
**Best for:** Complete accessibility development and auditing workflow

---

## Option A: CLI Tools Installation (v3.1.0)

The CLI tools provide automated auditing, screenshot capture, visual analysis, compliance tracking, and CI/CD integration.

### Prerequisites

- **Node.js 18 LTS or newer** - [Download](https://nodejs.org/)
- **npm** (included with Node.js)
- **Git** (for cloning repository)

### Step 1: Install CLI Tools Globally (Recommended)

```bash
# Install from GitHub
npm install -g git+https://github.com/jdonnelly-zspace/accessibility-standards-unity.git

# Verify installation
a11y-audit-zspace --version
# Output: 3.1.0

# Run audit on any Unity project
a11y-audit-zspace /path/to/unity-project
```

**What this includes:**
- ✅ Automated accessibility auditing
- ✅ Screenshot capture (requires Unity batch mode)
- ✅ Visual contrast analysis
- ✅ Color-blind simulation (8 types)
- ✅ Compliance tracking over time
- ✅ PDF/CSV exports
- ✅ JIRA/GitHub issue generation
- ✅ Automated code generation
- ✅ CI/CD integration support

**Time:** ~2-3 minutes (depends on npm speed)

### Step 2: Install CLI Tools Locally (Alternative)

```bash
# Clone repository
git clone https://github.com/jdonnelly-zspace/accessibility-standards-unity.git
cd accessibility-standards-unity

# Install Node.js dependencies
npm install

# Verify dependencies installed
npm list --depth=0

# Run audit from local installation
node bin/audit.js /path/to/unity-project
```

**Time:** ~5 minutes

### Step 3: Install Additional Dependencies (Optional)

For full v3.1.0 features, ensure all dependencies are installed:

```bash
# Check for missing dependencies
npm ci

# Verify sharp (image processing)
node -e "console.log(require('sharp').versions)"

# Verify puppeteer (PDF generation)
node -e "console.log(require('puppeteer').version)"
```

**Dependencies installed:**
- `sharp@^0.33.0` - Image processing for screenshot analysis
- `color-contrast-checker@^2.1.0` - WCAG contrast calculations
- `puppeteer@^23.0.0` - PDF report generation
- `marked@^15.0.0` - Markdown to HTML conversion
- `csv-writer@^1.6.0` - CSV export functionality
- `@octokit/rest@^21.0.0` - GitHub API integration

### Step 4: Configure Unity for Screenshot Capture (Optional)

For screenshot capture and visual analysis, Unity batch mode is required:

```bash
# Windows
set UNITY_EXECUTABLE=C:\Program Files\Unity\Hub\Editor\2022.3.10f1\Editor\Unity.exe

# macOS
export UNITY_EXECUTABLE=/Applications/Unity/Hub/Editor/2022.3.10f1/Unity.app/Contents/MacOS/Unity

# Linux
export UNITY_EXECUTABLE=/opt/Unity/Editor/Unity

# Verify Unity path
echo $UNITY_EXECUTABLE  # macOS/Linux
echo %UNITY_EXECUTABLE%  # Windows
```

### Step 5: Test Installation

```bash
# Test basic audit (no screenshots)
node bin/audit.js /path/to/unity-project --verbose

# Test full audit with all v3.1.0 features
node bin/audit.js /path/to/unity-project \
  --full \
  --capture-screenshots \
  --analyze-visual \
  --generate-fixes \
  --export-pdf \
  --export-csv \
  --verbose

# Check output directory
ls AccessibilityAudit/
# Should contain: AUDIT-SUMMARY.md, VPAT-COMPREHENSIVE.md, screenshots/, etc.
```

**Expected output:**
```
✓ Project found: your-unity-project
✓ Analyzing 15 scenes...
✓ Scanning 127 scripts...
✓ Capturing screenshots... (2-5 minutes)
✓ Analyzing visual accessibility...
✓ Generating code fixes...
✓ Generating reports...

Audit complete! Reports saved to:
/path/to/unity-project/AccessibilityAudit/

Compliance Score: 47% (Non-Conformant)
Critical Issues: 3
High Priority: 5
```

---

## Option B: Quick Install Methods for Unity

### Method 1: Unity Package Manager (Recommended) ⭐

**Best for:** Quick setup with automatic updates

**Prerequisites:** zSpace Unity SDK must be installed first

```
1. Open Unity Package Manager (Window > Package Manager)
2. Click "+" → "Add package from git URL"
3. Enter: https://github.com/jdonnelly-zspace/accessibility-standards-unity.git
4. Click "Add"
```

**What it includes:**
- C# accessibility components for zSpace
- Unity prefabs for accessible UI
- Editor tools for accessibility validation
- Sample accessible zSpace scene
- Unity Test Framework tests

**Time:** ~2 minutes

---

### Method 2: Manual Installation (Full Control)

**Best for:** Existing Unity projects, custom setup

#### Step 1: Install zSpace Unity SDK

```
1. Visit https://developer.zspace.com/
2. Download zSpace Unity SDK
3. Import SDK into your Unity project
4. Follow zSpace documentation for initial setup
5. Verify zSpace SDK working (test scene compiles)
```

#### Step 2: Clone Accessibility Framework

```bash
git clone https://github.com/jdonnelly-zspace/accessibility-standards-unity.git
cd accessibility-standards-unity
```

#### Step 3: Copy Files to Unity Project

```bash
# Copy C# accessibility scripts
cp -r implementation/unity/scripts/* /path/to/your-unity-project/Assets/Scripts/Accessibility/

# Copy prefabs
cp -r implementation/unity/prefabs/* /path/to/your-unity-project/Assets/Prefabs/Accessibility/

# Copy editor tools
cp -r implementation/unity/editor/* /path/to/your-unity-project/Assets/Editor/Accessibility/

# Copy Unity Test Framework tests
cp -r implementation/unity/tests/* /path/to/your-unity-project/Assets/Tests/Accessibility/
```

#### Step 4: Import Required Unity Packages

```
Open Unity Package Manager (Window > Package Manager)
- TextMeshPro (for accessible text)
- Input System (if using new input system - recommended)
```

**Time:** ~5-10 minutes

---

### Method 3: Reference Only (No Code Installation)

**Best for:** Consultingstandards, learning, team training

```bash
# Clone repo to reference location
git clone https://github.com/jdonnelly-zspace/accessibility-standards-unity.git
cd accessibility-standards-unity

# Browse standards documentation
open standards/ZSPACE-ACCESSIBILITY-CHECKLIST.md
open standards/XR-ACCESSIBILITY-REQUIREMENTS.md
open standards/WCAG-2.2-LEVEL-AA.md

# Browse workflows
open workflows/DEVELOPER-WORKFLOW.md
open workflows/DESIGNER-WORKFLOW.md
open workflows/QA-WORKFLOW.md
open workflows/PRODUCT-OWNER-WORKFLOW.md
```

Use this repository as a reference guide without installing any code into your project.

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

### Verify Unity Installation

Check that files were imported:

1. **In Unity Project window:**
   - `Assets/Scripts/Accessibility/` - C# accessibility components
   - `Assets/Prefabs/Accessibility/` - Accessible UI prefabs
   - `Assets/Editor/Accessibility/` - Editor validation tools
   - `Assets/Tests/Accessibility/` - Unity Test Framework tests

2. **Verify zSpace SDK Integration:**
   ```
   - Check for zSpace namespace in scripts (using zSpace.Core;)
   - Verify ZCore component available
   - Test stylus tracking in Play mode
   ```

---

### Next Steps

1. **Run Unity Test Framework:**
   ```
   Window > General > Test Runner
   Select "PlayMode" tab
   Run All Tests
   ```
   Verify all accessibility tests pass.

2. **Test with Desktop Screen Readers:**
   - **Windows Narrator:** Win + Ctrl + Enter
   - **NVDA:** Download from https://www.nvaccess.org/
   - Tab through UI and verify announcements

3. **Test Keyboard Accessibility:**
   - Disconnect zSpace stylus
   - Complete all application tasks using keyboard only (Tab, Space, Enter, Arrows, ESC)
   - Verify focus indicators visible

4. **Test Depth Perception Alternatives:**
   - Remove zSpace glasses
   - View application in 2D mode
   - Verify all tasks completable without stereoscopic 3D

5. **Review Workflows:**
   - Unity Developers: [`workflows/DEVELOPER-WORKFLOW.md`](workflows/DEVELOPER-WORKFLOW.md)
   - zSpace Designers: [`workflows/DESIGNER-WORKFLOW.md`](workflows/DESIGNER-WORKFLOW.md)
   - QA Engineers: [`workflows/QA-WORKFLOW.md`](workflows/QA-WORKFLOW.md)
   - Product Owners: [`workflows/PRODUCT-OWNER-WORKFLOW.md`](workflows/PRODUCT-OWNER-WORKFLOW.md)

6. **Review Standards:**
   - zSpace Accessibility Checklist: [`standards/ZSPACE-ACCESSIBILITY-CHECKLIST.md`](standards/ZSPACE-ACCESSIBILITY-CHECKLIST.md)
   - WCAG 2.2 Level AA: [`standards/WCAG-2.2-LEVEL-AA.md`](standards/WCAG-2.2-LEVEL-AA.md)
   - W3C XAUR (zSpace-adapted): [`standards/XR-ACCESSIBILITY-REQUIREMENTS.md`](standards/XR-ACCESSIBILITY-REQUIREMENTS.md)

---

## Unity Project-Specific Setup

### New Unity zSpace Project

```
1. Create new Unity project (Unity 2021.3 LTS or newer)
2. Install zSpace Unity SDK
3. Add accessibility framework via Unity Package Manager
4. Import sample scene from examples/zspace-accessible-scene/
5. Test on zSpace hardware
```

### Existing Unity Project (Adding zSpace)

```
1. Back up existing project
2. Install zSpace Unity SDK (may require Unity version update)
3. Manually copy accessibility scripts to Assets/
4. Update existing scripts to use keyboard alternatives
5. Add AccessibilityNode components to interactive objects
6. Test keyboard-only navigation
```

### Unity 3D → zSpace Migration

If migrating from traditional Unity 3D game to zSpace:

```
1. Review input system (replace mouse/controller with stylus + keyboard)
2. Add depth perception alternatives (audio, haptics, size cues)
3. Update UI to work on zSpace display
4. Add screen reader support (Windows Narrator, NVDA)
5. Test without stereoscopic 3D enabled
```

---

## Troubleshooting

### "The type or namespace name 'zSpace' could not be found"

**Solution:** Install zSpace Unity SDK first:
1. Download from https://developer.zspace.com/
2. Import .unitypackage into project
3. Verify SDK installed: Look for zSpace namespace in Project window

### "AccessibilityNode not found"

**Solution:** Unity Accessibility module may not be enabled:
1. Go to Edit > Project Settings > Player
2. Under "Other Settings", ensure "Active Input Handling" is set
3. Restart Unity Editor

### Scripts show compilation errors

**Solution:** Check Unity version:
```
- Required: Unity 2021.3 LTS or newer
- Recommended: Unity 2022.3 LTS
- zSpace SDK must match Unity version
```

### Unity Test Framework tests fail

**Solution:**
1. Verify zSpace SDK installed and working
2. Check Test Runner is in PlayMode (not EditMode)
3. Verify ZCore component present in scene
4. Some tests require zSpace hardware connected

### Focus indicators not visible in zSpace

**Solution:**
1. Check Post-Processing stack settings
2. Verify Outline/Glow shaders imported
3. Test focus visibility against different backgrounds
4. Adjust focus indicator contrast in settings

### Screen reader not announcing Unity UI

**Solution:**
1. Verify Windows Narrator enabled (Win + Ctrl + Enter)
2. Check AccessibilityNode components added to UI elements
3. Ensure Unity Accessibility APIs exposed to Windows
4. Test with NVDA as alternative screen reader

---

## Uninstalling

### Remove from Unity Project

```
1. In Unity Project window, delete:
   - Assets/Scripts/Accessibility/
   - Assets/Prefabs/Accessibility/
   - Assets/Editor/Accessibility/
   - Assets/Tests/Accessibility/

2. Remove package (if installed via Package Manager):
   - Open Unity Package Manager
   - Find "zSpace Accessibility Standards"
   - Click "Remove"

3. Clean up:
   - Remove any AccessibilityNode components from GameObjects
   - Remove "using UnityEngine.Accessibility" from scripts
   - Delete any accessibility-related prefab instances
```

**Note:** This does NOT uninstall zSpace Unity SDK (uninstall separately if needed).

---

## Updating

### Update Framework

**Via Package Manager:**
```
1. Unity Package Manager → Find "zSpace Accessibility Standards"
2. Click "Update" button (if available)
3. Or remove and re-add package to get latest version
```

**Manual Update:**
```bash
# Pull latest changes
cd accessibility-standards-unity
git pull origin main

# Re-copy files to Unity project
cp -r implementation/unity/scripts/* /path/to/your-unity-project/Assets/Scripts/Accessibility/
```

### Check for Standards Updates

```bash
# In accessibility-standards-unity repo
npm install
npm run scrape:update

# Check changelog
cat scrapers/CHANGELOG-STANDARDS.md
```

**What gets updated:**
- WCAG 2.2 changes
- W3C XAUR updates
- zSpace SDK compatibility updates
- New accessibility components

---

## zSpace Hardware Requirements

**Minimum:**
- zSpace system (any model with Unity SDK support)
- Windows 10/11 (64-bit)
- Unity 2021.3 LTS or newer

**Recommended:**
- zSpace 300 or newer
- Windows 11 (64-bit)
- Unity 2022.3 LTS
- 16GB RAM
- Dedicated GPU

**For Accessibility Testing:**
- Desktop screen reader (NVDA free, JAWS commercial)
- Standard keyboard and mouse
- Access to zSpace simulator (for testing without hardware)

---

## Support

**Issues?**
- GitHub Issues: https://github.com/jdonnelly-zspace/accessibility-standards-unity/issues
- zSpace SDK Issues: https://dev-community.zspace.com/
- Review workflows for your role in `workflows/`
- Check zSpace checklist in `standards/ZSPACE-ACCESSIBILITY-CHECKLIST.md`

**Resources:**
- zSpace Developer Portal: https://developer.zspace.com/
- Unity Accessibility: https://docs.unity3d.com/Manual/com.unity.modules.accessibility.html
- NVDA Screen Reader: https://www.nvaccess.org/

---

---

## Option C: Full Installation (CLI Tools + Unity Framework)

For the complete accessibility development and auditing workflow:

### Step 1: Install CLI Tools

Follow **Option A** steps above to install Node.js dependencies and CLI tools.

### Step 2: Install Unity Framework

Follow **Option B Method 1** or **Method 2** above to install Unity components.

### Step 3: Verify Complete Installation

```bash
# Test CLI tools
node bin/audit.js /path/to/unity-project --verbose

# In Unity Editor:
# 1. Window → Accessibility → Auditor (verify custom window opens)
# 2. Window → General → Test Runner (verify accessibility tests present)
# 3. GameObject → Accessibility menu (verify menu items present)
```

**Time:** ~10-15 minutes total

---

## CI/CD Integration

For automated accessibility testing in CI/CD pipelines, see:
- **GitHub Actions:** `.github/workflows/accessibility-audit.yml`
- **Complete Guide:** `docs/CI-CD-INTEGRATION.md`

Supports: GitHub Actions, GitLab CI, Jenkins, Azure DevOps

---

## Troubleshooting v3.1.0

### Node.js/npm Issues

**"npm command not found"**
- Install Node.js 18 LTS from https://nodejs.org/
- Restart terminal after installation

**"sharp install failed"**
```bash
# Rebuild native modules
npm rebuild sharp

# Or use prebuilt binaries
npm install --platform=win32 --arch=x64 sharp
```

**"puppeteer download failed"**
```bash
# Skip Chromium download (use system Chrome)
PUPPETEER_SKIP_DOWNLOAD=1 npm install

# Or set custom executable
export PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
```

### Unity Batch Mode Issues

**"Unity.exe not found"**
- Set UNITY_EXECUTABLE environment variable
- Verify Unity installed at expected path

**"Screenshot capture times out"**
- Increase timeout in `bin/capture-screenshots.js`
- Check Unity project compiles without errors
- Verify Unity license activated

### Visual Analysis Issues

**"Contrast analysis returns no results"**
- Ensure screenshots captured successfully
- Check `AccessibilityAudit/screenshots/` directory
- Verify sharp library installed correctly

**"Color-blind simulations missing"**
- Check Unity shader compilation
- Verify `ColorBlindSimulation.shader` imported
- Review Unity console for shader errors

---

**Document Version:** 3.1.0 (Automation & CI/CD Complete)
**Last Updated:** October 27, 2025
**Platform:** zSpace + Unity 2021.3+
**New in v3.1.0:** CLI tools, screenshot capture, visual analysis, compliance tracking, Unity Editor integration, code generation, CI/CD workflows
