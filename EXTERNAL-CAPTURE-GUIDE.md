# External Capture Guide - Accessibility Auditing Without Unity Editor

**Audience:** Product Managers, Accessibility Teams, QA Engineers, Non-Developers
**Version:** 3.4.0-phase4
**Last Updated:** October 2025

---

## Overview

This guide shows you how to run accessibility audits on **pre-built Unity applications** without needing Unity Editor or modifying source code. Perfect for product managers and accessibility teams who need to audit applications but don't have development tools installed.

### What You'll Learn

- ✅ How to audit a built Unity application (.exe file)
- ✅ How the external capture workflow works
- ✅ Step-by-step setup instructions
- ✅ How to run your first audit
- ✅ How to interpret results
- ✅ Troubleshooting common issues

### What You Need

**Required:**
1. ✅ **Node.js 18+** - JavaScript runtime (free)
2. ✅ **Unity Project Source Code** - Read-only access (no modifications needed)
3. ✅ **Built Application** - The .exe file of your Unity app
4. ✅ **Accessibility Framework** - This repository

**Optional:**
5. ⭐ **zSpace Hardware** - If auditing a zSpace application

**NOT Required:**
- ❌ Unity Editor installation
- ❌ Unity license
- ❌ Source code modification
- ❌ Application rebuild
- ❌ Development experience

---

## How External Capture Works

### The Traditional Way (Unity Batch Mode)
```
Unity Project → Unity Editor → Batch Mode → Screenshots → Analysis
```
**Problems:**
- Requires Unity Editor installation
- Requires Unity license
- Requires matching Unity version
- Requires project setup
- Can take 5-15 minutes

### The New Way (External Capture v3.4.0)
```
Unity Project Source → Parse Navigation → Launch .exe → Navigate Scenes → Screenshots → Analysis
```
**Benefits:**
- ✅ No Unity Editor required
- ✅ Works with pre-built apps
- ✅ No source code modification
- ✅ Faster execution (3-8 minutes)
- ✅ Easier for non-developers

### Technical Overview

**Phase 1: Parse Navigation Structure**
- Reads Unity project files (read-only)
- Extracts scene names and navigation buttons
- Builds a navigation map (JSON)

**Phase 2: Launch Application**
- Starts your .exe application
- Detects the application window
- Waits for initialization

**Phase 3: Automated Navigation**
- Uses navigation map to find buttons
- Simulates clicks to navigate between scenes
- Captures screenshots of each scene
- Saves with metadata

**Phase 4: Visual Analysis**
- Analyzes screenshots for contrast issues
- Generates color-blind simulations
- Checks WCAG compliance
- Creates accessibility reports

---

## Quick Start (5 Steps)

### Step 1: Install Node.js

**Windows:**
1. Visit https://nodejs.org/
2. Download "LTS" version (recommended for most users)
3. Run installer (accept all defaults)
4. Verify installation:
   ```bash
   node --version
   # Should show: v18.x.x or higher
   ```

**Already have Node.js?** Verify version is 18+:
```bash
node --version
```

### Step 2: Install Accessibility Framework

**Option A: Clone from GitHub (Recommended)**
```bash
# Open Command Prompt or PowerShell
cd C:\Users\YourName\Documents
git clone https://github.com/jdonnelly-zspace/accessibility-standards-unity.git
cd accessibility-standards-unity
npm install
```

**Option B: Download ZIP**
1. Visit https://github.com/jdonnelly-zspace/accessibility-standards-unity
2. Click "Code" → "Download ZIP"
3. Extract to `C:\Users\YourName\Documents\accessibility-standards-unity`
4. Open Command Prompt in that folder
5. Run `npm install`

**Verify Installation:**
```bash
node bin/audit.js --version
# Should show: 3.4.0-phase4 or higher
```

### Step 3: Locate Your Files

You need two paths:

**1. Unity Project Source (Read-Only)**
```
Example: C:\Users\Jill\Documents\GitHub\apps.career-explorer
```
This is the folder containing:
- `Assets/` folder
- `ProjectSettings/` folder
- `.unity` project file

**2. Built Application (.exe)**
```
Example: C:\Program Files\zSpace\Career Explorer\zSpaceCareerExplorer.exe
```
This is the compiled application (usually in `Program Files` or a `Builds` folder).

### Step 4: Run First Audit (Basic)

**Basic audit (source code analysis only):**
```bash
cd C:\Users\YourName\Documents\accessibility-standards-unity

node bin/audit.js "C:\Path\To\YourUnityProject"
```

**Output:**
- `YourUnityProject/AccessibilityAudit/` folder created
- 5 reports generated (README, VPAT, Summary, Recommendations)
- Compliance score calculated

**Execution time:** < 10 seconds

### Step 5: Run Full Audit (With External Capture)

**Full audit with screenshots and visual analysis:**
```bash
node bin/audit.js "C:\Path\To\YourUnityProject" \
  --capture-screenshots \
  --application "C:\Path\To\YourApp.exe" \
  --analyze-visual \
  --verbose
```

**Output:**
- All reports from basic audit
- `screenshots/` folder with scene captures
- Color-blind simulation images
- Contrast analysis heatmaps
- Visual accessibility findings

**Execution time:** 5-12 minutes

---

## Real Example: Career Explorer

### Setup
```bash
# Framework location
cd C:\Users\Jill\Documents\GitHub\accessibility-standards-unity

# Project paths
Unity Project: C:\Users\Jill\Documents\GitHub\apps.career-explorer
Application:   C:\Program Files\zSpace\Career Explorer\zSpaceCareerExplorer.exe
```

### Command
```bash
node bin/audit.js "C:\Users\Jill\Documents\GitHub\apps.career-explorer" \
  --capture-screenshots \
  --application "C:\Program Files\zSpace\Career Explorer\zSpaceCareerExplorer.exe" \
  --analyze-visual \
  --track-compliance \
  --verbose
```

### What Happens
1. **Navigation map parsed** (10 seconds)
   - Finds 13 scenes in project
   - Identifies 9 navigation buttons
   - Builds scene transition graph

2. **Application launched** (5 seconds)
   - Career Explorer starts
   - Window detected: "Career Explorer"
   - Waits for initialization

3. **Scenes navigated** (2-5 minutes)
   - Clicks through navigation menus
   - Visits each scene
   - Captures screenshots
   - Saves metadata

4. **Visual analysis** (1-2 minutes)
   - Checks contrast ratios
   - Generates color-blind simulations
   - Creates heatmaps

5. **Reports generated** (5 seconds)
   - VPAT compliance report
   - Executive summary
   - Recommendations for developers
   - CSV for tracking
   - JSON for automation

### Results
```
Output Directory: C:\Users\Jill\Documents\GitHub\apps.career-explorer\AccessibilityAudit\

Reports:
- README.md                               (Quick overview)
- AUDIT-SUMMARY.md                        (Executive summary)
- VPAT-apps.career-explorer.md            (Full compliance report)
- VPAT-SUMMARY-apps.career-explorer.md    (Quick VPAT)
- ACCESSIBILITY-RECOMMENDATIONS.md        (Developer fixes)
- accessibility-analysis.json             (Raw data)

Screenshots:
- screenshots/InitialLoading.png
- screenshots/LocationSelect.png
- screenshots/HealthcareCenter.png
- ... (one per scene)
- screenshots/navigation-report.json      (Navigation metadata)

Compliance Score: 47% (Non-Conformant)
Critical Issues: 3
High Priority: 2
Total Issues: 58
```

---

## Understanding the Results

### Report Types

**1. README.md** (Start Here)
- Quick overview of audit results
- Compliance score and summary
- Links to other reports
- Next steps

**2. AUDIT-SUMMARY.md** (For Management)
- Executive summary
- Compliance score explanation
- Risk assessment
- Resource estimates
- Business impact

**3. VPAT-apps.career-explorer.md** (For Legal/Procurement)
- Comprehensive VPAT 2.5 report
- All 50 WCAG 2.2 criteria
- Section 508 compliance
- Legal documentation
- Customer-facing report

**4. ACCESSIBILITY-RECOMMENDATIONS.md** (For Developers)
- Specific code fixes
- Implementation steps
- Priority order
- Testing procedures
- Code examples

**5. accessibility-analysis.json** (For Automation)
- Raw findings data
- Machine-readable format
- CI/CD integration
- Tracking systems

### Compliance Scores

| Score | Status | Risk Level | Typical Issues |
|-------|--------|------------|----------------|
| **90-100%** | Fully Compliant | Low | Minor polish needed |
| **70-89%** | Mostly Conformant | Medium | Some accessibility gaps |
| **40-69%** | Partially Conformant | High | Major accessibility work needed |
| **0-39%** | Non-Conformant | Critical | Significant accessibility issues |

### Issue Severity

**Critical (Must Fix Before Release)**
- No keyboard alternatives for primary interactions
- No screen reader support
- Content inaccessible to assistive technologies
- WCAG Level A violations

**High Priority (Fix Soon)**
- Missing accessibility labels
- Poor contrast (< 4.5:1)
- No focus indicators
- WCAG Level AA violations

**Medium Priority (Fix Eventually)**
- Inconsistent navigation
- Missing scene titles
- Suboptimal interaction patterns

**Low Priority (Nice to Have)**
- Missing tooltips
- Enhancement opportunities
- Best practice recommendations

---

## Advanced Usage

### Generate Navigation Map Only

If you just want to see your app's navigation structure:

```bash
node bin/parse-navigation-map.js "C:\Path\To\YourUnityProject"
```

**Output:**
```
YourUnityProject/AccessibilityAudit/navigation-map.json
```

**Contents:**
```json
{
  "projectPath": "C:/Path/To/Project",
  "generatedAt": "2025-10-29T12:00:00.000Z",
  "statistics": {
    "totalScenes": 13,
    "scenesWithNavigation": 5,
    "totalNavigationButtons": 9
  },
  "scenes": {
    "LocationSelect": {
      "scenePath": "Assets/Scenes/LocationSelect.unity",
      "enabled": true,
      "navigationButtons": [
        {
          "targetScene": "HealthcareCenter",
          "allowNavigation": true
        }
      ]
    }
  }
}
```

### Navigate and Capture Only

If you already have a navigation map and just want screenshots:

```bash
node bin/navigate-and-capture.js \
  --navigation-map "YourProject/AccessibilityAudit/navigation-map.json" \
  --application "C:\Path\To\YourApp.exe" \
  --output-dir "YourProject/AccessibilityAudit/screenshots"
```

### Full Audit with All Features

```bash
node bin/audit.js "C:\Path\To\Project" \
  --full \
  --capture-screenshots \
  --application "C:\Path\To\App.exe" \
  --analyze-visual \
  --generate-fixes \
  --export-pdf \
  --export-csv \
  --track-compliance \
  --create-issues \
  --verbose
```

**What this does:**
- ✅ Source code analysis
- ✅ External screenshot capture
- ✅ Visual accessibility analysis
- ✅ Automated code fix generation
- ✅ PDF report export
- ✅ CSV export for tracking
- ✅ Historical compliance tracking
- ✅ JIRA/GitHub issue creation
- ✅ Detailed logging

---

## Troubleshooting

### "Node is not recognized"

**Problem:** Node.js not installed or not in PATH

**Solution:**
1. Install Node.js from https://nodejs.org/
2. Restart Command Prompt/PowerShell
3. Verify: `node --version`

### "Cannot find module"

**Problem:** Dependencies not installed

**Solution:**
```bash
cd C:\Path\To\accessibility-standards-unity
npm install
```

### "Navigation map not found"

**Problem:** Navigation map not generated yet

**Solution:**
```bash
# Generate navigation map first
node bin/parse-navigation-map.js "C:\Path\To\YourProject"

# Then run audit
node bin/audit.js "C:\Path\To\YourProject" --capture-screenshots --application "..."
```

### "Application did not start"

**Problem:** Application path incorrect or app won't launch

**Solution:**
1. Verify .exe path is correct (use quotes if path has spaces)
2. Try launching .exe manually first
3. Check if app requires special launch arguments
4. Verify app doesn't require elevated permissions

Example with spaces:
```bash
--application "C:\Program Files\My App\MyApp.exe"
```

### "Low scene coverage (< 50%)"

**Problem:** OCR-based scene detection not working well

**Known Issue:** Phase 3 OCR limitation (see PHASE3-COMPLETE.md)

**Workarounds:**
1. **Use Unity Batch Mode instead** (requires Unity Editor):
   ```bash
   node bin/audit.js "C:\Path\To\Project" \
     --capture-screenshots \
     --unity-path "C:\Path\To\Unity.exe"
   ```

2. **Manual screenshots** (capture scenes manually, place in `screenshots/` folder)

3. **Wait for Phase 5 improvements** (better scene detection coming)

### "Window not detected"

**Problem:** Application window name doesn't match expected

**Solution:**
1. Check window title in Task Manager
2. Modify external-app-controller.js line 156 to match your window title
3. Or wait for configurable window title option

### "Permission denied"

**Problem:** Application installed in protected folder

**Solution:**
1. Run Command Prompt as Administrator, OR
2. Install app to non-protected location, OR
3. Grant permissions to application folder

---

## FAQ

### Do I need Unity Editor?

**No!** External capture works without Unity Editor. You only need:
- Unity project source code (read-only)
- Built .exe application
- Node.js

### Do I need to modify the source code?

**No!** External capture is read-only. It parses project files but never modifies them.

### Do I need to rebuild the application?

**No!** External capture works with existing .exe files. No rebuild required.

### Can I audit applications I didn't build?

**Yes!** As long as you have:
- Read access to Unity project source
- The .exe application
You can audit it.

### Does this work with zSpace applications?

**Yes!** External capture was designed specifically for zSpace applications like Career Explorer.

### Does this work on Mac/Linux?

**Currently Windows only.** External capture uses Windows-specific APIs for window control and screenshot capture. Mac/Linux support planned for future releases.

### How long does an audit take?

- **Basic audit (source only):** < 10 seconds
- **With external capture:** 5-12 minutes
- **Full audit (all features):** 10-20 minutes

### Can I run this in CI/CD?

**Yes!** The audit supports CI/CD integration:
```bash
node bin/audit.js "C:\Path\To\Project" \
  --capture-screenshots \
  --application "C:\Path\To\App.exe" \
  --fail-on-regression
```

Exit codes:
- `0` = Success (no critical issues)
- `1` = Failure (critical issues found)
- `2` = Warning (high priority issues)

### Can I customize the reports?

**Yes!** Reports are generated from templates in `templates/audit/`. You can:
1. Copy templates to `templates/audit/custom/`
2. Modify as needed
3. Use `--template-dir custom` option

### Where can I get help?

**Documentation:**
- This guide (EXTERNAL-CAPTURE-GUIDE.md)
- Main README.md
- INSTALLATION.md
- Phase documentation (PHASE1-COMPLETE.md, etc.)
- bin/README-*.md files

**Support:**
- GitHub Issues: https://github.com/jdonnelly-zspace/accessibility-standards-unity/issues
- Framework repository: See docs/ folder

---

## Next Steps

### After Your First Audit

1. **Review README.md** in AccessibilityAudit folder
2. **Read AUDIT-SUMMARY.md** for executive overview
3. **Check ACCESSIBILITY-RECOMMENDATIONS.md** for specific fixes
4. **Share VPAT report** with legal/procurement teams
5. **Track progress** with CSV export

### Improving Compliance

1. **Identify critical issues** from reports
2. **Share recommendations** with development team
3. **Implement fixes** (see ACCESSIBILITY-RECOMMENDATIONS.md)
4. **Re-run audit** to measure progress
5. **Track compliance over time** (--track-compliance)

### Integrating into Workflow

1. **Schedule regular audits** (weekly, bi-weekly, monthly)
2. **Track compliance trends** (--track-compliance)
3. **Set up CI/CD integration** (GitHub Actions, Jenkins)
4. **Create JIRA/GitHub issues** (--create-issues)
5. **Monitor regression** (--fail-on-regression)

---

## Appendix A: Command Reference

### Basic Audit
```bash
node bin/audit.js "C:\Path\To\Project"
```

### Audit with External Capture
```bash
node bin/audit.js "C:\Path\To\Project" \
  --capture-screenshots \
  --application "C:\Path\To\App.exe"
```

### Audit with Visual Analysis
```bash
node bin/audit.js "C:\Path\To\Project" \
  --capture-screenshots \
  --application "C:\Path\To\App.exe" \
  --analyze-visual
```

### Full Audit
```bash
node bin/audit.js "C:\Path\To\Project" \
  --full \
  --application "C:\Path\To\App.exe"
```

### Generate Navigation Map Only
```bash
node bin/parse-navigation-map.js "C:\Path\To\Project"
```

### Navigate and Capture Only
```bash
node bin/navigate-and-capture.js \
  --navigation-map "Project/AccessibilityAudit/navigation-map.json" \
  --application "C:\Path\To\App.exe"
```

---

## Appendix B: Folder Structure

```
YourUnityProject/
├── AccessibilityAudit/              # All audit output
│   ├── README.md                    # Start here
│   ├── AUDIT-SUMMARY.md             # Executive summary
│   ├── VPAT-yourapp.md              # Full VPAT report
│   ├── VPAT-SUMMARY-yourapp.md      # Quick VPAT
│   ├── ACCESSIBILITY-RECOMMENDATIONS.md  # Developer fixes
│   ├── accessibility-analysis.json  # Raw data
│   ├── navigation-map.json          # Navigation structure
│   ├── screenshots/                 # Scene screenshots
│   │   ├── InitialLoading.png
│   │   ├── LocationSelect.png
│   │   ├── ...
│   │   └── navigation-report.json   # Navigation metadata
│   └── visual-analysis/             # Visual accessibility
│       ├── contrast-heatmaps/
│       └── colorblind-simulations/
```

---

## Appendix C: Related Documentation

- **INSTALLATION.md** - Framework installation guide
- **README.md** - Framework overview
- **PHASE1-COMPLETE.md** - Navigation map parsing details
- **PHASE2-COMPLETE.md** - External app control details
- **PHASE3-COMPLETE.md** - Navigation automation details
- **PHASE4-COMPLETE.md** - Integration details
- **bin/README-navigate-and-capture.md** - Navigation script docs
- **bin/README-external-app-controller.md** - Controller API docs
- **plan_1028.txt** - Master implementation plan

---

**Questions or Issues?**

Open an issue on GitHub: https://github.com/jdonnelly-zspace/accessibility-standards-unity/issues

---

**Version:** 3.4.0-phase4
**Last Updated:** October 2025
**Status:** Production Ready ✅
