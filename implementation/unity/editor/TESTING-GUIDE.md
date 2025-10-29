# Unity Editor Integration Testing Guide

This guide explains how to test the Phase 3.3 Unity Editor integration features.

## Prerequisites

1. **Unity Editor** (2021.3 LTS or newer, 2023.2+ for AccessibilityNode support)
2. **Node.js** installed and in PATH
3. **accessibility-standards-unity** framework installed
4. A Unity project to test with

## Installation

### Option 1: Copy Scripts to Unity Project

1. Copy all `.cs` files from `implementation/unity/editor/` to your Unity project:
   ```
   YourProject/Assets/Editor/AccessibilityStandards/
   ```

2. Unity will automatically compile the scripts

3. Verify installation by checking for:
   ```
   Window → Accessibility → Auditor
   ```

### Option 2: Symbolic Link (Development)

For easier development iteration:

```bash
# Windows (PowerShell as Administrator)
cd "C:\YourUnityProject\Assets\Editor"
New-Item -ItemType SymbolicLink -Name "AccessibilityStandards" -Target "C:\Path\To\accessibility-standards-unity\implementation\unity\editor"

# macOS/Linux
cd /Path/To/YourUnityProject/Assets/Editor
ln -s /Path/To/accessibility-standards-unity/implementation/unity/editor AccessibilityStandards
```

## Testing Checklist

### ✅ Phase 1: Basic Installation

1. Open Unity project
2. Verify scripts compile without errors (check Console)
3. Verify menu items appear:
   - `Window → Accessibility → Auditor`
   - `Window → Accessibility → Settings`
   - `Window → Accessibility → Toggle Scene Gizmos`
   - `Window → Accessibility → Open Audit Reports Folder`
   - `Window → Accessibility → Documentation`

### ✅ Phase 2: Configure Settings

1. Open `Edit → Project Settings → Accessibility Standards`
2. Click "Auto-Detect Framework" button
   - Should detect framework path
   - If not, manually browse to framework directory
3. Verify Node.js path (default: `node`)
4. Enable "Track Compliance History"
5. Click "Save Settings"

### ✅ Phase 3: Run First Audit

1. Open `Window → Accessibility → Auditor`
2. Click "🚀 Run Audit" button
3. Wait for audit to complete (check Console for progress)
4. Verify audit report generated:
   - `YourProject/AccessibilityAudit/accessibility-analysis.json`
   - `YourProject/AccessibilityAudit/AUDIT-SUMMARY.md`

**Expected Result:**
- Status message shows "✅ Audit completed successfully!"
- Overview tab displays compliance score
- Findings tab lists accessibility issues

### ✅ Phase 4: Test Auditor Window

**Overview Tab:**
1. Verify compliance score displays (0-100%)
2. Check WCAG Level A/AA status shows ✅ or ❌
3. Verify findings summary shows counts (Critical, High, Medium, Low)

**Findings Tab:**
1. Test priority filters (Critical, High, Medium, Low toggles)
2. Try search box with keyword (e.g., "keyboard")
3. Expand a finding (click arrow)
   - Verify description shows
   - Verify recommendation shows
   - Verify WCAG criteria shows
4. Click affected file link
   - Should open file in default script editor

**Statistics Tab:**
1. Verify keyboard support statistics display
2. Check UI Toolkit statistics (if project uses UI Toolkit)
3. Check XR statistics (if project has XR SDK)

**Recommendations Tab:**
1. Verify critical issues warning shows (if applicable)
2. Check keyboard/screen reader recommendations
3. Test resource links (WCAG Guidelines, Component Recommendations)

**Controls:**
1. Test "🔄 Refresh" button - reloads report
2. Test "📂 Open Report Folder" - opens AccessibilityAudit folder
3. Test "📊 Run with Compliance Tracking" - creates baseline

### ✅ Phase 5: Test Scene View Overlay

1. Ensure Scene view is visible
2. Look for "Accessibility Issues" overlay panel
   - Should appear automatically after audit
3. Test overlay controls:
   - Click "Refresh" to reload
   - Toggle "Show" checkbox
   - Toggle priority filters (Critical, High, etc.)
4. Verify findings list shows issues
5. Click a finding in the list
   - Should display details dialog

**Scene Gizmos:**
1. Open a scene with interactive GameObjects
2. Press F12 to toggle gizmos
3. Look for colored spheres on GameObjects with issues:
   - 🔴 Red = Critical
   - 🟠 Orange = High
   - 🟡 Yellow = Medium
   - 🟢 Light blue = Low
4. Verify labels show issue count
5. Test toggle menu:
   - `Window → Accessibility → Toggle Scene Gizmos`

### ✅ Phase 6: Test Inspector Extension

1. Select a GameObject with a Button component
2. Scroll to bottom of Inspector
3. Verify "♿ Accessibility" section appears

**For GameObject with Issues:**
- Should show "⚠️ X accessibility issue(s) detected"
- Should display relevant findings
- Finding boxes should be color-coded by priority

**Quick Fixes (Button):**
1. If button has Navigation = None:
   - Click "Enable Navigation" button
   - Verify Navigation changes to Automatic
2. If button has Transition = None:
   - Click "Add Visual Feedback" button
   - Verify Transition changes to Color Tint

**Quick Fixes (General):**
1. Delete EventSystem from scene (if exists)
2. Select any Button
3. Verify "⚠️ No EventSystem found" warning shows
4. Click "Create EventSystem" button
5. Verify EventSystem GameObject created in hierarchy

**Screen Reader Support (Unity 2023.2+):**
1. Select GameObject with Button
2. If no AccessibilityNode exists:
   - Click "Add Accessibility Node" button
   - Verify AccessibilityNode component added
3. If AccessibilityNode has no label:
   - Click "Set Label from Text" button
   - Verify label populated from UI Text

### ✅ Phase 7: Test Settings Panel

1. Open `Edit → Project Settings → Accessibility Standards`

**Test Each Setting:**

**Audit Settings:**
- Toggle "Auto-Run on Build" (on/off)
- Toggle "Fail Build on Critical Issues" (on/off)
- Toggle "Track Compliance History" (on/off)
- Toggle "Verbose Logging" (on/off)

**Display Settings:**
- Toggle "Show Scene Gizmos" (on/off)
  - Verify scene gizmos appear/disappear
- Toggle "Show Inspector Warnings" (on/off)
- Toggle "Show Scene Overlay" (on/off)
- Toggle "Show Critical Only" (on/off)

**Framework Settings:**
- Click "Browse" to select framework path
- Click "Auto-Detect Framework"
  - Verify successful detection message
- Modify Node.js path (test with "node" and full path)

**Notification Settings:**
- Toggle all notification options

**Actions:**
- Click "Save Settings"
  - Verify "Settings Saved" dialog
- Click "Reset to Defaults"
  - Verify confirmation dialog
  - Verify settings reset

**Quick Actions:**
- Click "Open Accessibility Auditor Window"
  - Verify window opens
- Click "Run Audit Now"
  - Verify Auditor window opens
- Click documentation links
  - Verify URLs open in browser

### ✅ Phase 8: Test Compliance Tracking

1. Open Auditor window
2. Click "📊 Run with Compliance Tracking"
3. Wait for completion
4. Verify files created:
   - `YourProject/compliance-history/baseline.json`
   - `YourProject/compliance-history/YYYY-MM-DDTHH-MM-SS.json`
   - `YourProject/compliance-history/trends.json`
5. Make a code change that affects accessibility
6. Run audit again with tracking
7. Verify snapshot saved with new timestamp
8. Check Console for regression warnings (if applicable)

### ✅ Phase 9: Integration Testing

**Test Full Workflow:**
1. Start with clean project (no existing audit)
2. Install Unity Editor scripts
3. Configure settings (auto-detect framework)
4. Run first audit
5. Review findings in Auditor window
6. Open Scene view, verify overlay appears
7. Select GameObject with issues, verify Inspector warnings
8. Apply quick fix (enable navigation on Button)
9. Re-run audit
10. Verify issue resolved or findings count decreased

**Test Error Handling:**
1. Set invalid framework path in settings
2. Try to run audit
   - Verify error message shows
3. Set valid path, retry
4. Delete accessibility-analysis.json
5. Try to open Auditor window
   - Verify "No audit report found" message

## Common Issues

### Scripts don't compile
**Symptoms:** Red errors in Console, menu items don't appear

**Solutions:**
- Check Unity version (minimum 2021.3 LTS)
- Verify all 5 `.cs` files copied correctly
- Check for missing dependencies (UnityEngine.UI, UnityEditor)
- Try `Assets → Reimport All`

### "Framework not found" error
**Symptoms:** Audit fails with "Could not find accessibility-standards-unity framework"

**Solutions:**
- Open `Edit → Project Settings → Accessibility Standards`
- Click "Auto-Detect Framework"
- Or manually browse to framework directory
- Verify Node.js is installed: `node --version` in terminal
- Ensure framework bin/audit.js exists

### Audit runs but no report generated
**Symptoms:** Audit completes but Auditor window shows "No report"

**Solutions:**
- Check Console for errors
- Verify write permissions for project directory
- Look for `AccessibilityAudit/accessibility-analysis.json`
- Try running audit from command line:
  ```bash
  node path/to/bin/audit.js "YourProject" --verbose
  ```

### Scene gizmos don't appear
**Symptoms:** No colored spheres in Scene view

**Solutions:**
- Verify audit has been run (report exists)
- Press F12 to toggle gizmos
- Check `Edit → Project Settings → Accessibility Standards → Show Scene Gizmos`
- Ensure GameObjects have scripts with accessibility issues
- Verify gizmo drawing is enabled in Scene view (top-right icon)

### Inspector extension doesn't show
**Symptoms:** No accessibility section in Inspector

**Solutions:**
- Select GameObject with interactive component (Button, Selectable, etc.)
- Ensure `Show Inspector Warnings` enabled in settings
- Verify audit report exists
- Check Console for errors in AccessibilityInspectorExtension.cs

### Quick fix buttons don't work
**Symptoms:** Buttons do nothing or component doesn't change

**Solutions:**
- Ensure component is not part of prefab (override required)
- Check for script compilation errors
- Try entering/exiting Play mode
- Verify Undo/Redo system is working (Ctrl+Z)

## Performance Notes

- **Audit Execution:** 10-60 seconds depending on project size
- **Report Loading:** < 1 second
- **Scene Gizmos:** Minimal performance impact (reloads every 10 seconds)
- **Inspector Extension:** Minimal performance impact (checks on selection change)
- **Large Projects:** 1000+ scripts may take 2-3 minutes for audit

## Testing Results Template

```markdown
## Phase 3.3 Testing Results

**Project:** [Project Name]
**Unity Version:** [Version]
**Test Date:** [Date]
**Tester:** [Name]

### Installation
- [ ] Scripts compiled without errors
- [ ] Menu items appeared
- [ ] Settings panel accessible

### Auditor Window
- [ ] Audit ran successfully
- [ ] Overview tab displays correctly
- [ ] Findings tab functional (filters, search, expand)
- [ ] Statistics tab shows data
- [ ] Recommendations tab accessible
- [ ] File links open correctly

### Scene View Overlay
- [ ] Overlay appears after audit
- [ ] Priority filters work
- [ ] Refresh button works
- [ ] Findings clickable with details

### Scene Gizmos
- [ ] Gizmos appear on GameObjects
- [ ] Color coding correct
- [ ] Labels show issue count
- [ ] F12 toggle works

### Inspector Extension
- [ ] Accessibility section appears
- [ ] Warnings display for affected GameObjects
- [ ] Quick fixes work (Enable Navigation)
- [ ] Quick fixes work (Add Visual Feedback)
- [ ] EventSystem creation works
- [ ] AccessibilityNode creation works (2023.2+)

### Settings Panel
- [ ] All settings save correctly
- [ ] Auto-detect framework works
- [ ] Reset to defaults works
- [ ] Quick action buttons work

### Compliance Tracking
- [ ] Baseline creation works
- [ ] Snapshots saved with timestamps
- [ ] Trends.json generated

### Issues Found
[List any bugs or unexpected behavior]

### Notes
[Additional observations]
```

## Next Steps

After successful testing:

1. **Report Issues:** Create GitHub issues for any bugs found
2. **Provide Feedback:** Suggest improvements or missing features
3. **Document Findings:** Share testing results with team
4. **Train Team:** Show other developers how to use the tools
5. **Integrate into Workflow:** Add to development process

---

**Framework Version:** 3.1.0-phase3.3
**Last Updated:** October 27, 2025
**Testing Duration:** ~30-45 minutes for complete checklist
