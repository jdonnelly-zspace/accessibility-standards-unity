# NVDA Developer Tools Guide for zSpace Unity Applications

**Version:** 1.0
**Last Updated:** October 2025
**Target Audience:** Unity Developers and QA Engineers testing zSpace applications
**NVDA Version:** 2025.3+

---

## Overview

This guide covers **NVDA-specific developer tools** that provide superior debugging capabilities compared to Windows Narrator. While Narrator is pre-installed on Windows 11, **NVDA offers essential developer tools** that make accessibility testing more efficient and effective for zSpace Unity applications.

**Why NVDA for Development:**
- **Speech Viewer** - See exactly what NVDA announces in real-time
- **Log Viewer** - Diagnose UI Automation integration issues
- **Python Console** - Runtime testing and debugging
- **Object Navigation** - Explore UI hierarchy independently of focus
- **Free and open-source** - No cost, widely used by screen reader users

---

## Table of Contents

1. [Installing NVDA for Development](#installing-nvda-for-development)
2. [Speech Viewer - Visual Speech Output](#speech-viewer---visual-speech-output)
3. [Log Viewer - Diagnostic Tool](#log-viewer---diagnostic-tool)
4. [Python Console - Runtime Testing](#python-console---runtime-testing)
5. [Object Navigation System](#object-navigation-system)
6. [Browse Mode vs Focus Mode](#browse-mode-vs-focus-mode)
7. [Speech Modes for Testing](#speech-modes-for-testing)
8. [NVDA vs Narrator: Developer Comparison](#nvda-vs-narrator-developer-comparison)
9. [NVDA Testing Workflow for zSpace](#nvda-testing-workflow-for-zspace)
10. [Common NVDA Issues with Unity Applications](#common-nvda-issues-with-unity-applications)
11. [Recommendations for zSpace Project](#recommendations-for-zspace-project)

---

## Installing NVDA for Development

### Download and Installation

1. **Download NVDA:** https://www.nvaccess.org/download/
   - Version: 2025.3 or newer
   - Free, open-source
   - No registration required

2. **Install NVDA:**
   - Run installer `.exe`
   - Choose "Install NVDA on this computer"
   - Recommended: Install as portable version for testing

3. **Configure for Development:**
   - Launch NVDA (Ctrl + Alt + N)
   - NVDA menu (NVDA + N) → Tools → Speech Viewer (enable)
   - NVDA menu → Tools → Log Viewer (open when needed)

### Portable vs Installed Version

| Version | Use Case | Recommendation |
|---------|----------|----------------|
| **Installed** | Primary screen reader for accessibility testing | Recommended for dedicated QA machines |
| **Portable** | Testing without system changes | Recommended for developer machines |

**For zSpace Development:** Use portable version on developer machines, installed version on dedicated QA machines.

---

## Speech Viewer - Visual Speech Output

### What is Speech Viewer?

**Speech Viewer** displays in real-time exactly what NVDA is announcing, shown as text in a window.

### Key Benefits for Developers

1. **Silent Testing** - Test without audio in noisy environments
2. **Documentation** - Copy/paste speech output for bug reports
3. **Verification** - Confirm exact announcements without relying on audio
4. **Collaboration** - Share speech output screenshots with team
5. **Non-disruptive** - Test without disturbing others

### Activation

**Keyboard:** `NVDA + N → Tools → Speech Viewer`

**Shortcut:** Can assign custom keyboard shortcut in NVDA preferences

### Using Speech Viewer with zSpace Applications

**Step 1: Enable Speech Viewer**
```
1. Launch NVDA (Ctrl + Alt + N)
2. Press NVDA + N (opens NVDA menu)
3. Navigate to Tools → Speech Viewer
4. Speech Viewer window opens
```

**Step 2: Launch zSpace Application**
```
1. Build your zSpace Unity application (.exe)
2. Launch the .exe
3. Speech Viewer displays all NVDA announcements
```

**Step 3: Navigate and Verify**
```
1. Press Tab to navigate interactive elements
2. Watch Speech Viewer window for announcements
3. Example output: "Start Simulation Button"
4. Verify labels match expected values
```

### Example Speech Viewer Output

```
Start Simulation Button
Rotate Heart Model Button
Human Heart Model, Four chambers visible
Simulation started
Heart model rotated 90 degrees clockwise
```

### Best Practices

- **Keep Speech Viewer visible** during testing sessions
- **Take screenshots** of unexpected output for bug reports
- **Copy/paste** speech output into test reports
- **Compare** expected vs actual announcements

**Example Test Report:**
```markdown
## Test: Heart Model Selection
**Expected:** "Human Heart Model Button"
**Actual (Speech Viewer):** "Button_27"
**Status:** FAIL - Missing accessible label
```

---

## Log Viewer - Diagnostic Tool

### What is Log Viewer?

**Log Viewer** displays NVDA's internal operations, including interactions with applications via UI Automation, errors, and warnings.

### Key Benefits for Developers

1. **UI Automation Debugging** - See Unity's UI Automation interactions
2. **Error Detection** - Identify accessibility integration errors
3. **Warning Messages** - Catch potential issues before they become problems
4. **Performance Analysis** - Identify slow accessibility queries
5. **Stack Traces** - Detailed error information for debugging

### Activation

**Keyboard:** `NVDA + N → Tools → Log Viewer`

**Log Levels:**
- **Debug** - Detailed technical information
- **Info** - General operational messages
- **Warning** - Potential issues
- **Error** - Critical failures

**Recommended for Development:** Set log level to **Debug** for comprehensive information.

### Using Log Viewer with zSpace Applications

**Step 1: Configure Logging**
```
1. Launch NVDA
2. NVDA + N → Preferences → Settings → General
3. Set "Logging level" to "Debug"
4. Save and restart NVDA
```

**Step 2: Open Log Viewer**
```
1. NVDA + N → Tools → Log Viewer
2. Log Viewer window opens
3. Keep open during testing
```

**Step 3: Launch zSpace Application and Monitor**
```
1. Launch your zSpace Unity .exe
2. Log Viewer shows UI Automation interactions
3. Navigate through application
4. Watch for errors or warnings
```

### Example Log Viewer Output

```
INFO - NVDA 2025.3 started
DEBUG - UI Automation: Found element "zSpace Simulation"
DEBUG - Element name: "Start Simulation"
DEBUG - Element role: Button
DEBUG - Element state: Focusable, Enabled
WARNING - Element has empty automation ID
ERROR - UI Automation: Failed to get element pattern
```

### Common Log Messages and Meanings

| Log Message | Meaning | Action |
|-------------|---------|--------|
| `Element has empty automation ID` | AccessibilityNode missing unique ID | Add unique IDs to nodes |
| `Failed to get element pattern` | UI Automation Control Pattern issue | Verify AccessibilityNode roles |
| `Element not found in accessibility tree` | Node not registered with hierarchy | Check `AssistiveSupport.activeHierarchy` |
| `Name property is null or empty` | AccessibilityNode.label is empty | Add descriptive labels |

### Best Practices

- **Monitor Log Viewer during development** - Catch issues early
- **Save logs for bug reports** - File → Save As
- **Search logs for ERROR or WARNING** - Quickly identify problems
- **Compare logs across NVDA and Narrator** - Identify platform-specific issues

---

## Python Console - Runtime Testing

### What is Python Console?

**Python Console** provides interactive Python environment within NVDA, allowing runtime queries of accessibility properties and UI Automation tree.

### Key Benefits for Developers

1. **Live Testing** - Query accessibility properties without rebuilding
2. **API Exploration** - Explore NVDA's accessibility APIs
3. **Automation** - Script repetitive testing tasks
4. **Debugging** - Inspect application state in real-time

### Activation

**Keyboard:** `NVDA + Ctrl + Z` (opens Python Console)

**Note:** Python Console is for advanced users. Most developers will use Speech Viewer and Log Viewer.

### Example Use Cases

**Query Current Object:**
```python
import api
obj = api.getFocusObject()
print(f"Name: {obj.name}")
print(f"Role: {obj.role}")
print(f"States: {obj.states}")
```

**Explore UI Hierarchy:**
```python
import api
nav = api.getFocusObject()
parent = nav.parent
print(f"Parent: {parent.name}")
firstChild = nav.firstChild
print(f"First Child: {firstChild.name}")
```

**Recommendation:** Python Console is optional for most zSpace testing. Use Speech Viewer and Log Viewer for 95% of debugging needs.

---

## Object Navigation System

### What is Object Navigation?

**Object Navigation** allows exploring the UI hierarchy independently of keyboard focus, using NVDA + Numpad keys.

### Why This Matters for zSpace

Unity applications have complex UI hierarchies. Object Navigation helps developers:
- Understand how NVDA traverses Unity UI
- Verify all interactive elements are in accessibility tree
- Explore 3D object hierarchies
- Debug missing or misplaced AccessibilityNodes

### Object Navigation Commands

| Command | Action |
|---------|--------|
| **NVDA + Numpad 8** | Report current object |
| **NVDA + Numpad 5** | Review current object properties |
| **NVDA + Numpad 4** | Move to previous object |
| **NVDA + Numpad 6** | Move to next object |
| **NVDA + Numpad 2** | Move to first child object |
| **NVDA + Numpad 8 (double-tap)** | Move to parent object |

### Using Object Navigation with zSpace

**Scenario:** Verify all buttons are in accessibility tree

**Steps:**
```
1. Launch zSpace application with NVDA active
2. Press NVDA + Numpad 5 (report current object)
3. NVDA announces: "Start Simulation Button"
4. Press NVDA + Numpad 6 (move to next object)
5. NVDA announces: "Rotate Model Button"
6. Continue through all objects
7. Verify all interactive elements are announced
```

**Benefits:**
- Navigate without Tab key (useful if Tab order is broken)
- Explore hierarchical UI structure
- Find objects not reachable via keyboard
- Verify AccessibilityNode parent-child relationships

### Object Navigation vs Tab Navigation

| Method | Use Case |
|--------|----------|
| **Tab Navigation** | Standard keyboard navigation for end users |
| **Object Navigation** | Developer tool for exploring UI hierarchy |

**Best Practice:** Test with both methods to ensure:
- Tab navigation works (user experience)
- Object navigation works (complete accessibility tree)

---

## Browse Mode vs Focus Mode

### What are Browse Mode and Focus Mode?

NVDA has two navigation modes that automatically switch based on context:

**Browse Mode:**
- Used for reading content and navigating documents/web pages
- Single-letter commands (H for headings, K for links, B for buttons)
- Arrow keys navigate by line/character
- Automatic mode in web browsers and documents

**Focus Mode:**
- Used for interactive form fields and controls
- Standard keyboard input
- Keys passed directly to application
- Automatic mode in text inputs, dropdowns, etc.

**Toggle:** `NVDA + Space` (manual switch between modes)

### Does Browse Mode Work with Unity Applications?

**Answer:** Partial support, depending on Unity's UI Automation implementation.

| Unity Version | Browse Mode Support |
|---------------|---------------------|
| Unity 2021.3 / 2022.3 | ❌ No (no Accessibility Module) |
| Unity 2023.2+ | ⚠️ Partial (depends on UIA Control Patterns) |
| Unity 6.0+ | ⚠️ Partial (improved UIA, test thoroughly) |

### Testing Browse Mode with zSpace Applications

**Step 1: Build and Launch**
```
1. Build zSpace Unity application
2. Launch NVDA
3. Open zSpace .exe application
```

**Step 2: Test Browse Mode**
```
1. Press NVDA + Space (toggle Browse Mode)
2. NVDA announces: "Browse Mode" or "Focus Mode"
3. In Browse Mode, try single-letter commands:
   - H / Shift+H (headings)
   - B / Shift+B (buttons)
   - K / Shift+K (links)
```

**Expected Behavior:**
- ✅ If Browse Mode works: Single-letter navigation finds elements
- ❌ If not: Use Tab navigation instead

**Fallback:** Always ensure **Tab navigation works** as primary navigation method.

---

## Speech Modes for Testing

### Four Speech Modes

NVDA offers more speech control than Narrator:

| Mode | Behavior | Use Case |
|------|----------|----------|
| **Talk** (default) | All speech active | Normal operation |
| **On-demand** | Only speaks when commanded | Shared environments, reduces noise |
| **Off** | Silent, no speech | Silent testing, braille-only |
| **Beeps** | Audio feedback without speech | Quick status checks |

### Toggle Speech Modes

**Keyboard:** `NVDA + S` (cycles through modes)

### Testing zSpace Applications in On-Demand Mode

**Why Test On-Demand Mode?**
- Some users prefer minimal speech
- Critical announcements must still be announced
- Visual feedback (captions, icons) becomes essential

**Steps:**
```
1. Launch NVDA with zSpace application
2. Press NVDA + S until "On-demand" mode active
3. Navigate with Tab key (no automatic announcements)
4. Press NVDA + Tab (manually request current element)
5. Verify element is announced
```

**Pass Criteria:**
- All interactive elements can be announced on-demand
- Critical state changes have visual indicators (not just audio)
- Application remains usable without automatic speech

---

## NVDA vs Narrator: Developer Comparison

| Feature | NVDA | Windows Narrator | Winner |
|---------|------|-----------------|--------|
| **Installation** | Download required | Pre-installed | Narrator (convenience) |
| **Cost** | Free (open-source) | Free (built-in) | Tie |
| **Speech Viewer** | ✅ Yes (excellent) | ❌ No | NVDA |
| **Log Viewer** | ✅ Yes (detailed) | ❌ No | NVDA |
| **Python Console** | ✅ Yes | ❌ No | NVDA |
| **Object Navigation** | ✅ Yes (Numpad commands) | ⚠️ Limited | NVDA |
| **Browse Mode** | ✅ Yes (single-letter nav) | ✅ Yes (Scan Mode) | Tie |
| **Speech Modes** | ✅ 4 modes (Talk, On-demand, Off, Beeps) | ⚠️ Limited | NVDA |
| **Accessibility APIs** | ✅ Multiple (UIA, MSAA, IA2, JAB) | ⚠️ UIA only | NVDA |
| **Braille Support** | ✅ Extensive (LibLouis) | ✅ Supported | Tie |
| **Add-on System** | ✅ Yes (extensible) | ❌ No | NVDA |
| **User Base** | ⚠️ Requires download | ✅ Every Windows 11 PC | Narrator (reach) |

### Recommendation for zSpace Development

**For Development and QA:**
1. **Primary:** NVDA (superior debugging tools)
2. **Secondary:** Windows Narrator (verify compatibility)
3. **Tertiary:** JAWS (if enterprise customers require it)

**For End Users:**
1. **Primary:** Windows Narrator (pre-installed, accessible)
2. **Alternative:** NVDA (free download, power users)

**Testing Strategy:**
- **Develop with NVDA** (Speech Viewer, Log Viewer)
- **Verify with Narrator** (ensure compatibility)
- **Document support for both**

---

## NVDA Testing Workflow for zSpace

### Complete Testing Procedure

**Phase 1: Initial Setup**
```
1. Install NVDA 2025.3+ (portable version recommended)
2. Configure logging: NVDA + N → Preferences → General → Logging level: Debug
3. Enable Speech Viewer: NVDA + N → Tools → Speech Viewer
4. Open Log Viewer: NVDA + N → Tools → Log Viewer
5. Build your zSpace Unity application (.exe)
```

**Phase 2: Basic Navigation Testing**
```
1. Launch NVDA (Ctrl + Alt + N)
2. Launch zSpace .exe application
3. Press Tab to navigate interactive elements
4. Verify in Speech Viewer:
   - [ ] All buttons announced with labels
   - [ ] All toggles announced with state (checked/unchecked)
   - [ ] All 3D objects announced with descriptions
   - [ ] No generic labels ("Button_01", "GameObject")
```

**Phase 3: Object Navigation Testing**
```
1. Press NVDA + Numpad 5 (report current object)
2. Press NVDA + Numpad 6 repeatedly (navigate through all objects)
3. Verify all interactive elements are in accessibility tree
4. Check for missing elements (not announced via Object Navigation)
```

**Phase 4: Browse Mode Testing (if supported)**
```
1. Press NVDA + Space (toggle Browse Mode)
2. Try single-letter navigation:
   - H / Shift+H (headings)
   - B / Shift+B (buttons)
   - K / Shift+K (links)
3. If Browse Mode doesn't work, document as limitation
4. Verify Tab navigation works as fallback
```

**Phase 5: Speech Modes Testing**
```
1. Press NVDA + S (cycle to "On-demand" mode)
2. Navigate with Tab (no automatic announcements)
3. Press NVDA + Tab (request current element)
4. Verify critical elements can be announced on-demand
5. Check visual feedback for state changes
```

**Phase 6: Log Review**
```
1. Review Log Viewer for:
   - [ ] Errors (UI Automation failures)
   - [ ] Warnings (empty automation IDs, missing properties)
   - [ ] Performance issues (slow queries)
2. Save log: File → Save As → zspace_nvda_test_log.txt
3. Attach log to bug reports if issues found
```

**Phase 7: Documentation**
```
1. Screenshot Speech Viewer output for test report
2. Copy/paste unexpected announcements
3. Save Log Viewer for issue tracking
4. Compare NVDA results with Narrator results
5. Document any differences or issues
```

---

## Common NVDA Issues with Unity Applications

### Issue 1: Speech Viewer Shows Empty Announcements

**Symptoms:**
- Speech Viewer displays empty lines when tabbing through UI
- Elements exist but have no labels

**Causes:**
- AccessibilityNode.label is empty string
- Node not registered with AccessibilityHierarchy

**Solutions:**
```csharp
// Ensure non-empty labels
AccessibilityNode node = new AccessibilityNode();
node.label = "Start Simulation"; // NOT ""
node.role = AccessibilityRole.Button;

// Ensure node is added to hierarchy
AssistiveSupport.activeHierarchy?.AddNode(node);
```

**Verification:** Use Unity Accessibility Hierarchy Viewer (Window > Accessibility)

---

### Issue 2: Log Viewer Shows "Element has empty automation ID"

**Symptoms:**
- Warning in Log Viewer: "Element has empty automation ID"

**Causes:**
- AccessibilityNode missing unique identifier
- Unity UI Automation requires unique IDs for elements

**Solutions:**
```csharp
AccessibilityNode node = new AccessibilityNode();
node.id = new AccessibilityNodeId(Guid.NewGuid().ToString()); // Unique ID
node.label = "Start Simulation";
node.role = AccessibilityRole.Button;
```

**Best Practice:** Use GameObject instance ID or unique name for AccessibilityNode IDs

---

### Issue 3: Browse Mode Doesn't Work in Unity Application

**Symptoms:**
- Single-letter commands (H, B, K) don't navigate elements
- Browse Mode toggle has no effect

**Causes:**
- Unity UI Automation implementation incomplete
- Control Patterns not properly exposed
- Unity version < 2023.2 (no Accessibility Module)

**Solutions:**
- **Upgrade to Unity 2023.2+** for improved UIA support
- **Use Tab navigation as fallback** (always works)
- **Document Browse Mode limitation** in accessibility guide

**Workaround for Users:**
```markdown
## Known Limitation
Browse Mode single-letter navigation may not work in this application.
Use Tab/Shift+Tab to navigate between interactive elements.
```

---

### Issue 4: Object Navigation Can't Find Elements

**Symptoms:**
- NVDA + Numpad 6 (next object) skips over interactive elements
- Some UI components not in accessibility tree

**Causes:**
- AccessibilityNodes not added to hierarchy
- Parent-child relationships incorrect
- AssistiveSupport.activeHierarchy not set

**Solutions:**
```csharp
// Ensure hierarchy is active
if (AssistiveSupport.activeHierarchy == null)
{
    var hierarchy = new AccessibilityHierarchy();
    AssistiveSupport.activeHierarchy = hierarchy;
}

// Add all nodes to hierarchy
foreach (var button in FindObjectsOfType<AccessibleButton>())
{
    var node = button.GetAccessibilityNode();
    AssistiveSupport.activeHierarchy.AddNode(node);
}
```

---

### Issue 5: Log Viewer Shows "Failed to get element pattern"

**Symptoms:**
- Error in Log Viewer: "UI Automation: Failed to get element pattern"
- Element announced but interactions fail

**Causes:**
- AccessibilityNode.role doesn't match element type
- UI Automation Control Pattern not supported

**Solutions:**
```csharp
// Ensure correct roles for element types
Button button = GetComponent<Button>();
node.role = AccessibilityRole.Button; // NOT StaticText or Link

Toggle toggle = GetComponent<Toggle>();
node.role = AccessibilityRole.Checkbox; // For toggles/checkboxes
```

**Verification:** Check Log Viewer after fix - error should disappear

---

## Recommendations for zSpace Project

Based on NVDA's superior developer tools, here are specific recommendations:

### 1. Add NVDA Developer Tools Workflow

**File:** `workflows/NVDA-TESTING-WORKFLOW.md`

**Content:**
- Step-by-step NVDA testing procedure
- Speech Viewer usage guide
- Log Viewer interpretation guide
- Object Navigation testing steps
- Browse Mode vs Focus Mode testing

**Priority:** ⭐⭐⭐ High

---

### 2. Update QA Workflow with NVDA Tools

**File:** Update `workflows/QA-WORKFLOW.md`

**Add Section:**
```markdown
## NVDA Speech Viewer Testing

**Purpose:** Visually verify screen reader announcements

**Steps:**
1. Launch NVDA with Speech Viewer (NVDA + N → Tools → Speech Viewer)
2. Navigate through zSpace application with Tab key
3. Compare Speech Viewer output with expected announcements
4. Screenshot any unexpected output for bug reports
5. Document in test report:
   - Expected: "Start Simulation Button"
   - Actual (Speech Viewer): "Button_01"
   - Status: FAIL

## NVDA Log Viewer Testing

**Purpose:** Identify UI Automation integration issues

**Steps:**
1. Configure NVDA logging to Debug level
2. Open Log Viewer (NVDA + N → Tools → Log Viewer)
3. Launch zSpace application
4. Navigate through all interactive elements
5. Review log for:
   - [ ] Errors (UI Automation failures)
   - [ ] Warnings (empty automation IDs, missing properties)
6. Save log for bug reports if issues found
```

**Priority:** ⭐⭐⭐ High

---

### 3. Create NVDA vs Narrator Comparison Document

**File:** `standards/NVDA-VS-NARRATOR-COMPARISON.md`

**Content:**
- Feature comparison table
- When to use NVDA vs Narrator
- Testing strategy recommendations
- Tool selection guide for developers vs end users

**Priority:** ⭐⭐ Medium

---

### 4. Add NVDA Object Navigation Testing Guide

**File:** `resources/NVDA-OBJECT-NAVIGATION-GUIDE.md`

**Content:**
- Object Navigation command reference
- How to explore Unity UI hierarchies
- Troubleshooting missing elements
- Parent-child relationship verification

**Priority:** ⭐⭐ Medium

---

### 5. Document Browse Mode Limitations for Unity

**File:** Update `standards/NARRATOR-SCAN-MODE-SUPPORT.md`

**Add NVDA Section:**
```markdown
## NVDA Browse Mode Support in Unity Applications

### Browse Mode vs Scan Mode

| Feature | NVDA Browse Mode | Narrator Scan Mode |
|---------|-----------------|-------------------|
| Single-letter navigation | ✅ Yes | ✅ Yes |
| Unity 2023.2+ support | ⚠️ Partial | ⚠️ Partial |
| Fallback navigation | Tab key | Tab key |

### Testing Browse Mode in zSpace Applications

1. Press NVDA + Space (toggle Browse Mode)
2. Try single-letter commands (H, B, K)
3. If Browse Mode doesn't work:
   - Document as known limitation
   - Use Tab navigation as fallback
   - Ensure Tab order is logical

### Recommendation

**Primary Navigation:** Tab/Shift+Tab (always works)
**Browse Mode:** Test and document results (may not work in Unity)
```

**Priority:** ⭐⭐ Medium

---

### 6. Add NVDA Speech Modes Testing

**File:** Update `workflows/QA-WORKFLOW.md`

**Add Section:**
```markdown
## NVDA Speech Modes Testing

**Purpose:** Verify zSpace application works in all NVDA speech modes

**Steps:**
1. Launch NVDA with zSpace application
2. Test in "Talk" mode (default):
   - [ ] All elements announced automatically
3. Press NVDA + S to switch to "On-demand" mode:
   - [ ] Press NVDA + Tab to request current element
   - [ ] Verify element is announced
   - [ ] Check visual feedback for state changes
4. Press NVDA + S to switch to "Beeps" mode:
   - [ ] Navigation beeps confirm focus changes
   - [ ] Visual feedback indicates current element

**Pass Criteria:**
- Application usable in all speech modes
- Visual indicators complement audio feedback
- On-demand announcements work for critical elements
```

**Priority:** ⭐ Low (nice to have)

---

### 7. Create NVDA Add-on Feasibility Study

**File:** `docs/nvda-addon-feasibility-study.md`

**Content:**
- Research NVDA add-on development for zSpace
- Potential enhancements (zSpace-specific commands, 3D object descriptions)
- Development effort estimate
- Community benefit analysis

**Priority:** ⭐ Low (future consideration)

---

## Summary

**Key NVDA Features to Add to Project:**

| Feature | Benefit | Priority | File Location |
|---------|---------|----------|---------------|
| Speech Viewer Testing | Visual speech verification | ⭐⭐⭐ High | `workflows/NVDA-TESTING-WORKFLOW.md` |
| Log Viewer Debugging | UI Automation issue diagnosis | ⭐⭐⭐ High | Update `workflows/QA-WORKFLOW.md` |
| Object Navigation Testing | UI hierarchy verification | ⭐⭐ Medium | `resources/NVDA-OBJECT-NAVIGATION-GUIDE.md` |
| Browse Mode Testing | Single-letter navigation testing | ⭐⭐ Medium | Update `standards/NARRATOR-SCAN-MODE-SUPPORT.md` |
| Speech Modes Testing | Multi-mode compatibility | ⭐ Low | Update `workflows/QA-WORKFLOW.md` |
| NVDA vs Narrator Comparison | Tool selection guide | ⭐⭐ Medium | `standards/NVDA-VS-NARRATOR-COMPARISON.md` |

---

## Conclusion

**NVDA provides superior developer tools compared to Windows Narrator:**

✅ **Speech Viewer** - Visual verification of announcements
✅ **Log Viewer** - Detailed UI Automation diagnostics
✅ **Python Console** - Runtime testing and debugging
✅ **Object Navigation** - UI hierarchy exploration
✅ **Multi-standard support** - UIA, MSAA, IA2, JAB

**Recommendation for zSpace Development:**
- **Develop and debug with NVDA** (superior tools)
- **Verify with Narrator** (ensure compatibility)
- **Document support for both** (maximize accessibility)

---

## References

- **NVDA Download:** https://www.nvaccess.org/download/
- **NVDA User Guide:** https://download.nvaccess.org/releases/2025.3/documentation/userGuide.html
- **NVDA Developer Guide:** https://www.nvaccess.org/files/nvda/documentation/developerGuide.html
- **Unity Accessibility Module:** https://docs.unity3d.com/2023.2/Documentation/Manual/com.unity.modules.accessibility.html

---

**Document Version:** 1.0
**Last Updated:** October 2025
**Author:** accessibility-standards-unity project
**NVDA Version:** 2025.3+
