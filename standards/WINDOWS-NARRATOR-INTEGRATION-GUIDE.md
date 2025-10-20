# Windows Narrator Integration Guide for zSpace Unity Applications

**Version:** 1.0
**Last Updated:** October 2025
**Platform:** zSpace on Windows 11
**Target Audience:** Unity Developers building zSpace applications

---

## Overview

This guide provides **Windows Narrator-specific** recommendations for zSpace Unity applications running on Windows 11. Windows Narrator is the built-in Windows screen reader that ships with every Windows 11 installation, making it the most accessible screen reader for zSpace users.

**Why This Matters for zSpace:**
- zSpace applications run exclusively on Windows 11 environments
- Narrator is pre-installed on every Windows 11 system (no additional software required)
- Narrator integration ensures zSpace apps are accessible out-of-the-box
- Unity Accessibility Module (Unity 2023.2+) provides native Narrator support via UI Automation framework

---

## Table of Contents

1. [Windows Narrator Overview](#windows-narrator-overview)
2. [Narrator Features Relevant to zSpace Applications](#narrator-features-relevant-to-zspace-applications)
3. [Unity UI Automation Integration](#unity-ui-automation-integration)
4. [Narrator Keyboard Shortcuts for zSpace Testing](#narrator-keyboard-shortcuts-for-zspace-testing)
5. [Narrator Scan Mode for Unity Applications](#narrator-scan-mode-for-unity-applications)
6. [Narrator Speech and Audio Features](#narrator-speech-and-audio-features)
7. [Narrator Touch Gestures (zSpace Touch Displays)](#narrator-touch-gestures-zspace-touch-displays)
8. [Narrator Settings Optimization for zSpace](#narrator-settings-optimization-for-zspace)
9. [Testing Workflow: Narrator + zSpace Applications](#testing-workflow-narrator--zspace-applications)
10. [Common Narrator Issues and Solutions](#common-narrator-issues-and-solutions)
11. [Narrator vs NVDA vs JAWS Comparison](#narrator-vs-nvda-vs-jaws-comparison)
12. [Recommendations for zSpace Project](#recommendations-for-zspace-project)

---

## Windows Narrator Overview

**Windows Narrator** is Microsoft's built-in screen reader for Windows 10 and Windows 11. It enables users with visual impairments to interact with applications using audio feedback and keyboard navigation.

### Key Features (Windows 11)
- **Built-in** - No installation required, available on every Windows 11 PC
- **UI Automation support** - Reads accessible applications via Microsoft UI Automation framework
- **Keyboard navigation** - Navigate UI elements using Narrator key (Caps Lock or Insert) + arrow keys
- **Scan Mode** - Automatic navigation mode for browsing content and interactive elements
- **Speech recap** - Stores last 500 spoken phrases for review (Narrator + Alt + X)
- **AI-powered image descriptions** - Generates image descriptions on Copilot+ PCs (Narrator + Ctrl + D)
- **Customizable verbosity** - Five verbosity levels to control information density
- **Touch support** - Touch gestures for tablet and touchscreen devices

### Activation
- **Keyboard:** `Win + Ctrl + Enter`
- **Settings:** Settings > Accessibility > Narrator > Turn on Narrator

---

## Narrator Features Relevant to zSpace Applications

### 1. Navigation Commands

Narrator provides extensive keyboard navigation that zSpace developers should support:

| Narrator Command | Action | zSpace Relevance |
|-----------------|--------|------------------|
| **Narrator + Arrow Keys** | Navigate elements | Essential for keyboard-only zSpace users |
| **Narrator + Spacebar** | Toggle Scan Mode | Enables automatic navigation through Unity UI |
| **Narrator + G / Shift+G** | Navigate between images/graphics | Critical for 3D object descriptions |
| **Tab / Shift+Tab** | Move between interactive elements | Primary navigation method |
| **Enter / Spacebar** | Activate buttons | Standard interaction for zSpace UI |
| **Narrator + Page Up/Down** | Switch view modes | Navigate between UI sections |

**zSpace Impact:** All zSpace interactive elements (buttons, toggles, 3D objects) must be navigable using these commands.

---

### 2. Scan Mode

**Scan Mode** activates automatically in supported applications (browsers, email) and allows users to navigate using arrow keys with specialized commands.

**Key Scan Mode Commands:**
- **H / Shift+H** - Navigate between headings
- **I / Shift+I** - Navigate between list items
- **L** - Jump to lists
- **N** - Skip link blocks
- **Comma / Period** - Jump to element boundaries
- **Enter** - Activate primary action
- **Shift+Enter** - Activate secondary action

**zSpace Recommendation:**
Ensure Unity applications expose semantic structure (headings, lists, buttons) via Unity Accessibility Module so Narrator's Scan Mode can navigate efficiently.

---

### 3. Speech Recap and Transcription

**Speech Recap** (Windows 11 feature) stores the last 500 phrases spoken by Narrator:

| Command | Function |
|---------|----------|
| **Narrator + Alt + X** | Open speech recap dialog |
| **Narrator + Ctrl + X** | Copy last spoken phrase to clipboard |

**zSpace Use Case:**
- Users can review complex 3D object descriptions after navigation
- Helpful for educational zSpace applications where users need to recall information
- Copy-to-clipboard enables note-taking during zSpace simulations

**Developer Action:**
Test that important announcements (e.g., "Simulation started", "Object selected: Heart model") are captured correctly in speech recap.

---

### 4. Image and Visual Content Descriptions

Narrator generates **AI-powered image descriptions** on Copilot+ PCs using **Narrator + Ctrl + D**:

- Provides contextual details about people, objects, colors, text, and numerical data
- Works with images and visual content that lack alt text
- Requires Copilot+ PC with NPU (Neural Processing Unit)

**zSpace Consideration:**
While zSpace 3D models may not be directly recognized by Narrator's image description AI, ensure all 3D objects have:
- **Accessible labels** via Unity Accessibility Module
- **Text descriptions** for screen reader users
- **Alt text equivalents** for texture/sprite-based UI elements

**Fallback:** Don't rely on AI image descriptions—provide explicit text alternatives for all 3D content.

---

### 5. Verbosity Levels

Narrator offers **five verbosity levels** that control how much information is announced:

| Verbosity Level | Information Provided |
|----------------|---------------------|
| **1 - Text Only** | Only text content, no metadata |
| **2 - Minimal** | Text + control types (Button, Link) |
| **3 - Default** | Text + control types + states |
| **4 - Verbose** | All metadata + hints + context |
| **5 - Extra Verbose** | Maximum detail including technical info |

**zSpace Developer Impact:**
- **Provide clear labels** - Avoid relying on verbose mode for critical info
- **Include hints** - Optional context for screen reader users (AccessibilityNode.hint)
- **Announce states** - Update AccessibilityNode.state when UI changes (Focused, Selected, Disabled)

**Example:**
```csharp
AccessibilityNode node = new AccessibilityNode();
node.label = "Rotate Heart Model"; // Always announced
node.role = AccessibilityRole.Button; // Announced at verbosity ≥2
node.hint = "Rotates the 3D heart 90 degrees clockwise"; // Announced at verbosity ≥4
node.state = AccessibilityState.None; // Announced at verbosity ≥3
```

---

## Unity UI Automation Integration

**Unity Accessibility Module (Unity 2023.2+)** exposes Unity applications to Windows Narrator via **Microsoft UI Automation (UIA)** framework.

### How It Works

1. **Unity Accessibility Module** creates `AccessibilityHierarchy` and `AccessibilityNode` objects
2. Unity exposes these nodes to **Windows UI Automation framework**
3. **Narrator** queries UI Automation for accessible elements
4. Narrator announces labels, roles, states, and hints to users

### UI Automation Provider in Unity

Unity acts as a **UI Automation Provider**:
- Unity applications implement `IAccessibleProvider` interface
- Accessible elements are exposed as UIA Control Patterns (Button, Toggle, Text)
- Narrator queries UIA tree to read element properties

### Required Implementation

To support Narrator in zSpace Unity applications:

```csharp
#if UNITY_2023_2_OR_NEWER
using UnityEngine.Accessibility;

public class NarratorSupport : MonoBehaviour
{
    private AccessibilityHierarchy m_Hierarchy;

    void Awake()
    {
        // Create accessibility hierarchy
        m_Hierarchy = new AccessibilityHierarchy();

        // Set as active hierarchy (exposes to Windows UI Automation)
        AssistiveSupport.activeHierarchy = m_Hierarchy;

        // Listen for Narrator status changes
        AssistiveSupport.screenReaderStatusChanged += OnScreenReaderStatusChanged;
    }

    void OnScreenReaderStatusChanged(bool isActive)
    {
        if (isActive)
        {
            Debug.Log("Narrator (or other screen reader) is active");
            // Optionally adjust UI for screen reader users
        }
    }

    void OnDestroy()
    {
        AssistiveSupport.screenReaderStatusChanged -= OnScreenReaderStatusChanged;
    }
}
#endif
```

**Key Point:** Once `AssistiveSupport.activeHierarchy` is set, Unity automatically exposes registered `AccessibilityNode` objects to Narrator via Windows UI Automation.

---

## Narrator Keyboard Shortcuts for zSpace Testing

### Essential Shortcuts for Developers

| Shortcut | Action | Testing Use |
|----------|--------|-------------|
| **Win + Ctrl + Enter** | Enable/Disable Narrator | Quick toggle during testing |
| **Narrator + 1** | Toggle input learning mode | Learn keyboard shortcuts |
| **Narrator + H** | Read current heading | Verify heading structure |
| **Narrator + R** | Read current row/column (tables) | Test table accessibility |
| **Narrator + F / Shift+F** | Navigate forms | Test form navigation |
| **Narrator + K / Shift+K** | Navigate links | Test button/link navigation |
| **Narrator + D / Shift+D** | Navigate landmarks | Test ARIA landmarks (if applicable) |
| **Narrator + Ctrl + D** | Get image description (Copilot+ PC) | Test AI image descriptions |
| **Narrator + Alt + X** | Open speech recap | Review announced content |
| **Narrator + Ctrl + X** | Copy last phrase to clipboard | Document testing results |

### Narrator Key Configuration

The **Narrator key** can be Caps Lock or Insert:
- Default: **Caps Lock** (standard keyboards)
- Alternative: **Insert** (keyboards without Caps Lock)
- Configure in: Narrator Settings > Choose Narrator key

**zSpace Testing Recommendation:** Use **Caps Lock** as Narrator key to avoid conflicts with zSpace stylus button mappings.

---

## Narrator Scan Mode for Unity Applications

**Scan Mode** is Narrator's automatic navigation mode that activates in supported applications (browsers, emails).

### Does Scan Mode Work with Unity Applications?

**Answer:** Partial support depends on UI Automation implementation.

- **Unity 2023.2+ with Accessibility Module:** Scan Mode **may work** if Unity properly exposes UIA Control Patterns
- **Unity without Accessibility Module:** Scan Mode **will not work** (no UIA integration)
- **Current Status (2025):** Unity's UIA implementation is evolving—test thoroughly with Narrator

### Testing Scan Mode with zSpace Unity Apps

1. Build your Unity application (.exe)
2. Launch Narrator (`Win + Ctrl + Enter`)
3. Open your zSpace application
4. Press `Narrator + Spacebar` to toggle Scan Mode
5. Use arrow keys to navigate through UI elements
6. Press `Enter` to activate buttons

**Expected Behavior:**
- ✅ Scan Mode navigates through registered `AccessibilityNode` objects
- ✅ Headings are navigable with `H / Shift+H`
- ✅ Buttons are navigable with `B / Shift+B`
- ✅ Enter/Spacebar activates interactive elements

**If Scan Mode Doesn't Work:**
- Verify `AssistiveSupport.activeHierarchy` is set
- Ensure all interactive elements have `AccessibilityNode` with correct roles
- Use Tab navigation as fallback (always works)

---

## Narrator Speech and Audio Features

### Speech Customization

Narrator allows users to customize speech output:

| Setting | Options | zSpace Consideration |
|---------|---------|---------------------|
| **Speech Rate** | Slow to Fast | Test at various speeds to ensure announcements are complete |
| **Voice Pitch** | Low to High | No impact on zSpace apps |
| **Volume** | 0% to 100% | Ensure Narrator volume doesn't conflict with zSpace spatial audio |
| **Capital Letter Announcement** | On/Off | Test if code identifiers or acronyms are announced clearly |
| **Punctuation Level** | None, Some, Most, All | Test technical descriptions (e.g., "3D model: Heart_v2.0") |

### Audio Ducking

**Audio Ducking** reduces application audio volume when Narrator speaks:
- **Enabled by default** in Windows 11
- When Narrator speaks, zSpace spatial audio volume lowers temporarily
- Automatically restored after Narrator finishes speaking

**zSpace Developer Action:**
- Test audio ducking behavior with zSpace spatial audio
- Ensure critical audio cues are not missed during Narrator announcements
- Consider providing visual indicators for audio cues (captions, icons)

### Speech Recap for Complex Descriptions

For zSpace applications with complex 3D object descriptions:

**Best Practice:**
```csharp
// When user selects complex 3D model
string description = "Human heart model. Four chambers visible: left atrium, right atrium, left ventricle, right ventricle. Aorta extending from left ventricle. Model includes animation controls.";

AssistiveSupport.notificationDispatcher?.SendAnnouncement(description);
```

**User Benefit:**
- User hears full description once
- Can review later with `Narrator + Alt + X` (speech recap)
- Can copy to clipboard with `Narrator + Ctrl + X`

---

## Narrator Touch Gestures (zSpace Touch Displays)

If zSpace hardware includes touchscreen support, Narrator provides touch gestures:

### Primary Touch Gestures

| Gesture | Action | zSpace Relevance |
|---------|--------|------------------|
| **Single Tap** | Primary action (click) | Activate zSpace UI buttons |
| **Double Tap** | Activate focused element | Alternative to Enter key |
| **Triple Tap** | Secondary action | Context menu or options |
| **Swipe Right/Left** | Navigate elements | Move between zSpace UI components |
| **Swipe Up/Down** | Scroll or change view | Navigate zSpace 3D scene sections |
| **Two-Finger Tap** | Stop Narrator reading | Pause announcements |
| **Four-Finger Single Tap** | Show Narrator commands | Quick help |

**zSpace Consideration:**
- Most zSpace systems use stylus + keyboard/mouse (not touch)
- If zSpace introduces touch displays, ensure Unity UI supports touch + Narrator gestures
- Test touch interactions don't conflict with stylus interactions

---

## Narrator Settings Optimization for zSpace

### Recommended Narrator Settings for zSpace Users

Developers should document these recommended settings in accessibility guides:

#### 1. Verbosity Level
- **Recommended:** Level 3 (Default) or Level 4 (Verbose)
- **Reason:** Provides enough context for 3D spatial UI without overwhelming users

#### 2. Context Awareness
- **Setting:** "Provide additional information about controls when navigating"
- **Recommended:** Enabled
- **Reason:** Helps users understand 3D object states and properties

#### 3. Audio Ducking
- **Setting:** "Lower volume of other apps when Narrator is speaking"
- **Recommended:** Enabled
- **Reason:** Ensures Narrator announcements are audible over zSpace spatial audio

#### 4. Keyboard Layout
- **Narrator Key:** Caps Lock (default)
- **Recommended:** Caps Lock (avoid Insert to prevent conflicts with zSpace shortcuts)

#### 5. Navigation Mode
- **Setting:** "Use Scan Mode for reading text and navigating apps"
- **Recommended:** Enabled
- **Reason:** Faster navigation for keyboard-only users

---

## Testing Workflow: Narrator + zSpace Applications

### Step 1: Enable Narrator
```
1. Press Win + Ctrl + Enter
2. Narrator starts speaking: "Narrator on, Caps Lock is your Narrator key..."
3. Verify audio output is clear
```

### Step 2: Launch zSpace Application
```
1. Open your zSpace Unity .exe application
2. Narrator announces window title
3. Verify application name is announced correctly
```

### Step 3: Navigate UI with Tab Key
```
1. Press Tab to move to next interactive element
2. Narrator announces: "[Element label], [Element type]"
3. Example: "Start Simulation, Button"
4. Verify all buttons/toggles/links are announced
```

### Step 4: Test Scan Mode (if supported)
```
1. Press Narrator + Spacebar to toggle Scan Mode
2. Narrator announces: "Scan Mode on"
3. Use arrow keys to navigate elements
4. Press Enter to activate selected element
5. If Scan Mode doesn't work, use Tab navigation
```

### Step 5: Test Button Activation
```
1. Tab to a button
2. Press Enter or Spacebar
3. Narrator should announce action result (e.g., "Simulation started")
4. Verify AccessibilityNode updates are announced
```

### Step 6: Test Headings and Structure
```
1. Press Narrator + H to navigate headings
2. Verify UI sections have accessible headings
3. Check that headings follow logical hierarchy (H1, H2, H3)
```

### Step 7: Test 3D Object Descriptions
```
1. Tab to 3D interactive objects
2. Narrator announces: "[Object label], [Role]"
3. Example: "Human Heart Model, Button"
4. Verify descriptions are clear and meaningful
```

### Step 8: Test Speech Recap
```
1. After navigating several elements, press Narrator + Alt + X
2. Speech recap dialog opens showing last 500 phrases
3. Verify important announcements are captured
4. Press Narrator + Ctrl + X to copy last phrase
```

### Step 9: Test with Verbosity Levels
```
1. Open Narrator Settings (Narrator + Ctrl + N)
2. Change verbosity level (1-5)
3. Navigate UI again
4. Verify critical info is announced at all levels
```

### Step 10: Disable Narrator
```
1. Press Win + Ctrl + Enter
2. Narrator announces: "Narrator off"
3. Verify application still functions normally
```

---

## Common Narrator Issues and Solutions

### Issue 1: Narrator Not Announcing UI Elements

**Symptoms:**
- Tab key moves focus visually, but Narrator silent
- Elements exist but not announced

**Causes:**
- AccessibilityNode not registered with AccessibilityHierarchy
- Empty labels on AccessibilityNode objects
- AssistiveSupport.activeHierarchy not set

**Solutions:**
```csharp
// Ensure hierarchy is active
AssistiveSupport.activeHierarchy = m_Hierarchy;

// Ensure nodes have non-empty labels
AccessibilityNode node = new AccessibilityNode();
node.label = "Start Game"; // NOT empty string
node.role = AccessibilityRole.Button;

// Add node to hierarchy
m_Hierarchy.AddNode(node);
```

**Testing:** Use Accessibility Hierarchy Viewer (Window > Accessibility > Accessibility Hierarchy Viewer) to verify nodes exist.

---

### Issue 2: Scan Mode Doesn't Work

**Symptoms:**
- Scan Mode toggle has no effect
- Arrow keys don't navigate elements

**Causes:**
- Unity UI Automation integration incomplete
- Unity version < 2023.2 (no Accessibility Module)
- Control Patterns not properly exposed

**Solutions:**
- **Upgrade to Unity 2023.2+** for full UIA support
- **Use Tab navigation as fallback** (always works)
- **Document Scan Mode limitation** in accessibility guide

**Workaround:**
```markdown
## Accessibility Note
Scan Mode may not be supported in this zSpace application.
Use Tab/Shift+Tab to navigate between interactive elements.
```

---

### Issue 3: Narrator Volume Conflicts with zSpace Spatial Audio

**Symptoms:**
- Narrator speech difficult to hear over spatial audio
- Audio ducking not working correctly

**Causes:**
- Audio ducking disabled in Narrator settings
- zSpace spatial audio too loud
- Audio channels conflicting

**Solutions:**
1. **Enable Audio Ducking:**
   - Narrator Settings > Audio > Lower volume of other apps when Narrator is speaking
2. **Reduce zSpace Spatial Audio Volume:**
   ```csharp
   // Lower spatial audio volume when screen reader active
   if (AssistiveSupport.isScreenReaderEnabled)
   {
       AudioListener.volume = 0.5f; // 50% volume
   }
   ```
3. **Provide Volume Controls:**
   - Add in-app volume controls for spatial audio
   - Allow users to balance Narrator and spatial audio

---

### Issue 4: Complex 3D Descriptions Cut Off

**Symptoms:**
- Long descriptions not fully announced
- Narrator stops mid-sentence

**Causes:**
- Announcements too long
- Multiple rapid announcements interrupting each other

**Solutions:**
```csharp
// Break long descriptions into chunks
void AnnounceComplexObject(string fullDescription)
{
    // Option 1: Provide summary first
    string summary = "Human heart model, 4 chambers";
    AssistiveSupport.notificationDispatcher?.SendAnnouncement(summary);

    // Option 2: Store full description in AccessibilityNode.hint
    node.label = "Human Heart Model";
    node.hint = fullDescription; // Announced at higher verbosity
}

// Avoid rapid-fire announcements
IEnumerator AnnounceSequence(string[] messages)
{
    foreach (string message in messages)
    {
        AssistiveSupport.notificationDispatcher?.SendAnnouncement(message);
        yield return new WaitForSeconds(2f); // Delay between announcements
    }
}
```

---

### Issue 5: Keyboard Shortcuts Conflict with Narrator

**Symptoms:**
- zSpace keyboard shortcuts don't work with Narrator enabled
- Narrator intercepts key presses

**Causes:**
- Narrator uses same keyboard shortcuts
- Input learning mode capturing keys

**Solutions:**
1. **Avoid Narrator Key Combinations:**
   - Don't use Caps Lock or Insert in zSpace shortcuts
   - Avoid Narrator + Arrow combinations
2. **Disable Input Learning Mode:**
   - Press `Narrator + 1` to toggle off
3. **Document Keyboard Conflicts:**
   ```markdown
   ## Known Issues
   When Narrator is enabled, the following shortcuts are reserved:
   - Caps Lock + [Any Key] (Narrator commands)
   - Insert + [Any Key] (Narrator commands)

   Alternative: Use Ctrl/Alt/Shift combinations for zSpace shortcuts.
   ```

---

## Narrator vs NVDA vs JAWS Comparison

| Feature | Windows Narrator | NVDA | JAWS |
|---------|-----------------|------|------|
| **Cost** | Free (built-in) | Free (open-source) | $95/year (home), $1,295 (professional) |
| **Installation** | Pre-installed on Windows 11 | Download required | Download + license required |
| **Unity Support** | Via UI Automation (Unity 2023.2+) | Via UI Automation | Via UI Automation |
| **zSpace Availability** | ✅ Every Windows 11 PC | ⚠️ Requires download | ⚠️ Requires purchase |
| **Scan Mode** | ✅ Yes | ✅ Yes (Browse Mode) | ✅ Yes (Virtual Cursor) |
| **Speech Recap** | ✅ Yes (last 500 phrases) | ⚠️ Limited history | ✅ Yes (extensive history) |
| **Verbosity Control** | ✅ 5 levels | ✅ Customizable | ✅ Extensive customization |
| **Touch Gestures** | ✅ Yes | ❌ No | ⚠️ Limited |
| **Image Descriptions** | ✅ AI-powered (Copilot+ PC) | ❌ Manual only | ❌ Manual only |
| **Braille Display** | ✅ Supported | ✅ Supported | ✅ Supported |
| **Developer Debugging** | ⚠️ Basic | ✅ Excellent (Speech Viewer) | ✅ Excellent |

### Recommendation for zSpace Testing

**Primary:** Windows Narrator (free, pre-installed, most accessible)
**Secondary:** NVDA (free, excellent debugging tools)
**Tertiary:** JAWS (commercial, enterprise standard)

**Testing Priority:**
1. Test with **Narrator first** - ensures widest accessibility
2. Test with **NVDA** for verification - catches edge cases
3. Test with **JAWS** if enterprise customers require it

---

## Recommendations for zSpace Project

Based on Windows Narrator's features and zSpace's Windows 11 environment, here are **specific recommendations** to add to the accessibility-standards-unity project:

### 1. Create Windows Narrator Testing Guide

**File:** `workflows/NARRATOR-TESTING-WORKFLOW.md`

**Content:**
- Step-by-step Narrator testing procedures for zSpace apps
- Keyboard shortcut reference for Narrator commands
- Expected vs actual behavior checklist
- Common issues and troubleshooting steps
- Narrator settings optimization for zSpace users

**Rationale:** Currently, the project mentions Narrator but lacks a dedicated testing workflow specific to Narrator's unique features.

---

### 2. Add Narrator-Specific Unity Test Framework Tests

**File:** `implementation/unity/tests/NarratorAccessibilityTests.cs`

**Recommended Tests:**
```csharp
#if UNITY_2023_2_OR_NEWER
[Test]
public void AccessibilityHierarchy_IsExposedToUIAutomation()
{
    // Verify hierarchy is set as active (exposes to Narrator)
    Assert.IsNotNull(AssistiveSupport.activeHierarchy);
}

[Test]
public void AllAccessibilityNodes_HaveNonEmptyLabels()
{
    // Empty labels won't be announced by Narrator
    var nodes = GetAllAccessibilityNodes();
    foreach (var node in nodes)
    {
        Assert.IsFalse(string.IsNullOrEmpty(node.label),
            $"Node {node.id} has empty label");
    }
}

[Test]
public void AllInteractiveElements_HaveCorrectRoles()
{
    // Incorrect roles cause Narrator to announce wrong element types
    var buttons = FindObjectsOfType<Button>();
    foreach (var button in buttons)
    {
        var node = GetAccessibilityNode(button);
        Assert.AreEqual(AccessibilityRole.Button, node.role,
            $"Button {button.name} has incorrect role");
    }
}

[Test]
public void ImportantAnnouncements_AreNotEmpty()
{
    // Test that critical announcements have content
    string announcement = GetSimulationStartAnnouncement();
    Assert.IsFalse(string.IsNullOrEmpty(announcement),
        "Simulation start announcement is empty");
}
#endif
```

**Rationale:** Existing tests focus on general accessibility; these tests specifically validate Narrator integration requirements.

---

### 3. Document Audio Ducking Behavior

**File:** `docs/narrator-audio-ducking-guide.md`

**Content:**
- Explanation of Windows audio ducking
- How it affects zSpace spatial audio
- Code examples for detecting screen reader status and adjusting audio
- User settings recommendations

**Code Example:**
```csharp
public class NarratorAudioManager : MonoBehaviour
{
    [Range(0f, 1f)]
    public float spatialAudioVolumeWhenNarratorActive = 0.5f;

    private float originalVolume;

    void Start()
    {
        originalVolume = AudioListener.volume;
        AssistiveSupport.screenReaderStatusChanged += OnScreenReaderStatusChanged;

        // Check initial state
        if (AssistiveSupport.isScreenReaderEnabled)
        {
            LowerSpatialAudio();
        }
    }

    void OnScreenReaderStatusChanged(bool isActive)
    {
        if (isActive)
        {
            LowerSpatialAudio();
        }
        else
        {
            RestoreSpatialAudio();
        }
    }

    void LowerSpatialAudio()
    {
        AudioListener.volume = spatialAudioVolumeWhenNarratorActive;
        Debug.Log($"Screen reader detected - lowering spatial audio to {spatialAudioVolumeWhenNarratorActive * 100}%");
    }

    void RestoreSpatialAudio()
    {
        AudioListener.volume = originalVolume;
        Debug.Log("Screen reader disabled - restoring spatial audio volume");
    }

    void OnDestroy()
    {
        AssistiveSupport.screenReaderStatusChanged -= OnScreenReaderStatusChanged;
    }
}
```

**Rationale:** Spatial audio is critical for zSpace 3D applications, but audio ducking can cause confusion if not documented.

---

### 4. Create Narrator Settings Optimization Guide for End Users

**File:** `resources/NARRATOR-SETTINGS-GUIDE.md`

**Content:**
- Recommended Narrator settings for zSpace applications
- How to enable/disable Narrator
- Keyboard shortcut reference card (printable)
- Verbosity level recommendations
- Touch gesture guide (if applicable)

**Rationale:** zSpace end users (educators, medical professionals) may not be familiar with Narrator. A user-friendly guide helps them optimize Narrator for zSpace applications.

---

### 5. Add Speech Recap Testing Procedure

**File:** Update `workflows/QA-WORKFLOW.md`

**Add Section:**
```markdown
### Speech Recap Testing (Windows 11 Narrator)

**Purpose:** Verify important announcements are captured in Narrator's speech recap.

**Steps:**
1. Enable Narrator (Win + Ctrl + Enter)
2. Perform 5-10 interactions in zSpace application
3. Press Narrator + Alt + X to open speech recap
4. Verify last 500 spoken phrases include:
   - [ ] Button labels when activated
   - [ ] 3D object descriptions when selected
   - [ ] Simulation state changes ("Simulation started")
   - [ ] Error messages or warnings
5. Press Narrator + Ctrl + X to copy last phrase
6. Paste and verify content is correct

**Pass Criteria:**
- All critical announcements appear in speech recap
- Announcements are in correct chronological order
- Copied phrases match expected text
```

**Rationale:** Speech recap is a powerful Narrator feature that allows users to review complex 3D object descriptions. Testing ensures it works correctly.

---

### 6. Document Scan Mode Limitations

**File:** `standards/NARRATOR-SCAN-MODE-SUPPORT.md`

**Content:**
- Explanation of Narrator Scan Mode
- Current Unity UI Automation support status
- Which Unity versions support Scan Mode
- Fallback navigation methods (Tab key)
- Known limitations and workarounds

**Example Content:**
```markdown
## Scan Mode Support in Unity zSpace Applications

### What is Scan Mode?
Scan Mode is Narrator's automatic navigation mode that allows users to navigate
using arrow keys and specialized commands (H for headings, B for buttons, etc.).

### Unity Support Status (2025)

| Unity Version | Scan Mode Support | Notes |
|---------------|------------------|-------|
| Unity 2021.3 | ❌ Not Supported | No Accessibility Module |
| Unity 2022.3 | ❌ Not Supported | No Accessibility Module |
| Unity 2023.2+ | ⚠️ Partial Support | Depends on UIA Control Pattern implementation |
| Unity 6.0+ | ⚠️ Partial Support | Improved UIA integration, test thoroughly |

### Recommendation for zSpace Applications

**Primary Navigation:** Use Tab/Shift+Tab (always works)
**Scan Mode:** Test with your specific Unity version and document results

### Fallback if Scan Mode Doesn't Work

Ensure all interactive elements are accessible via:
- Tab key navigation
- Narrator + Arrow keys
- Keyboard shortcuts (with Narrator key)
```

**Rationale:** Developers need to know whether Scan Mode works with Unity. Documenting limitations prevents confusion.

---

### 7. Add Narrator Keyboard Shortcut Reference Card

**File:** `resources/NARRATOR-KEYBOARD-SHORTCUTS.md`

**Format:** Printable reference card for developers and testers

**Content:**
- Essential Narrator commands for testing
- Navigation shortcuts
- Speech control shortcuts
- Organized by category (Navigation, Reading, Forms, Testing)

**Example:**
```markdown
# Narrator Keyboard Shortcuts - Quick Reference

## Basic Controls
| Shortcut | Action |
|----------|--------|
| Win + Ctrl + Enter | Enable/Disable Narrator |
| Narrator + Esc | Exit Narrator |
| Narrator + 1 | Toggle input learning mode |

## Navigation
| Shortcut | Action |
|----------|--------|
| Tab / Shift+Tab | Next/Previous element |
| Narrator + Arrow Keys | Navigate by character/word/line |
| Narrator + Spacebar | Toggle Scan Mode |
| Narrator + Page Up/Down | Change navigation mode |

## Element Navigation (Scan Mode)
| Shortcut | Action |
|----------|--------|
| H / Shift+H | Next/Previous heading |
| B / Shift+B | Next/Previous button |
| L / Shift+L | Next/Previous list |
| I / Shift+I | Next/Previous list item |

## Testing Commands
| Shortcut | Action |
|----------|--------|
| Narrator + H | Read current heading level |
| Narrator + R | Read current row/column |
| Narrator + Alt + X | Open speech recap |
| Narrator + Ctrl + X | Copy last phrase to clipboard |
| Narrator + Ctrl + D | Get image description (Copilot+ PC) |

---
*Narrator Key = Caps Lock or Insert*
```

**Rationale:** Quick reference card helps developers and QA testers efficiently test Narrator integration.

---

### 8. Update zSpace Accessibility Checklist with Narrator-Specific Items

**File:** `standards/ZSPACE-ACCESSIBILITY-CHECKLIST.md`

**Add New Section:**
```markdown
## 6.11 Windows Narrator-Specific Compliance (Windows 11)

#### Requirement: Optimize for Windows Narrator built-in screen reader

**Narrator Integration Checklist:**
- [ ] Tested with Windows Narrator enabled (Win + Ctrl + Enter)
- [ ] All interactive elements announced correctly via Tab navigation
- [ ] AccessibilityNode labels are non-empty and descriptive
- [ ] AccessibilityNode roles match element types (Button, Link, Checkbox)
- [ ] Important actions send announcements via AssistiveSupport.notificationDispatcher
- [ ] Speech recap (Narrator + Alt + X) captures critical announcements
- [ ] Audio ducking works correctly with zSpace spatial audio
- [ ] Scan Mode tested (if supported) or fallback documented
- [ ] Keyboard shortcuts don't conflict with Narrator commands
- [ ] Verbosity levels 3-5 provide adequate context for 3D objects
- [ ] Touch gestures tested (if zSpace hardware supports touch)
- [ ] Narrator Settings optimization documented for end users

**Testing Tools:**
- Windows Narrator (built-in: Win + Ctrl + Enter)
- Accessibility Hierarchy Viewer (Unity: Window > Accessibility)
- Unity Test Framework (automated tests)

**Documentation:**
- `workflows/NARRATOR-TESTING-WORKFLOW.md` - Testing procedures
- `resources/NARRATOR-SETTINGS-GUIDE.md` - End-user guide
- `docs/narrator-audio-ducking-guide.md` - Audio integration
```

**Rationale:** Narrator-specific requirements should be part of the main accessibility checklist.

---

### 9. Create Narrator + zSpace Example Scene

**File:** `examples/narrator-zspace-demo/`

**Contents:**
- Unity scene demonstrating Narrator best practices
- Accessible zSpace UI with proper AccessibilityNodes
- Audio ducking example
- Speech recap testing UI
- README with setup instructions

**Example Buttons:**
```csharp
// Button with optimal Narrator support
public class NarratorOptimizedButton : MonoBehaviour
{
    [Header("Narrator Accessibility")]
    public string buttonLabel = "Start Simulation";
    public string buttonHint = "Begins the zSpace physics simulation";

    private AccessibilityNode m_Node;

    void Start()
    {
        // Register with Unity Accessibility
        m_Node = new AccessibilityNode();
        m_Node.label = buttonLabel;
        m_Node.role = AccessibilityRole.Button;
        m_Node.hint = buttonHint;
        m_Node.state = AccessibilityState.None;

        var hierarchy = AssistiveSupport.activeHierarchy;
        if (hierarchy != null)
        {
            hierarchy.AddNode(m_Node);
        }
    }

    public void OnClick()
    {
        // Send announcement to Narrator
        AssistiveSupport.notificationDispatcher?.SendAnnouncement(
            $"{buttonLabel} activated. Simulation starting."
        );

        // Update node state
        m_Node.state = AccessibilityState.Disabled;

        // Start simulation...
    }
}
```

**Rationale:** Practical example scene helps developers understand Narrator integration in context.

---

### 10. Add Narrator Troubleshooting FAQ

**File:** `docs/narrator-troubleshooting-faq.md`

**Content:**
```markdown
# Narrator Troubleshooting FAQ

## Q: Narrator doesn't announce my Unity UI elements. Why?

**A:** Check the following:
1. Is Unity 2023.2+ installed? (Accessibility Module required)
2. Is `AssistiveSupport.activeHierarchy` set in your scene?
3. Do AccessibilityNodes have non-empty labels?
4. Are nodes added to the AccessibilityHierarchy?
5. Did you build the application? (Narrator only works with .exe, not Unity Editor Play Mode)

**Debug Steps:**
- Open Accessibility Hierarchy Viewer (Window > Accessibility)
- Enter Play Mode
- Verify nodes appear in tree
- Check labels and roles

---

## Q: Scan Mode doesn't work in my Unity app. Is this normal?

**A:** Partially. Scan Mode support depends on Unity's UI Automation implementation, which is evolving.

**Workarounds:**
- Use Tab/Shift+Tab navigation (always works)
- Use Narrator + Arrow keys
- Document Scan Mode limitation in accessibility guide

---

## Q: Narrator volume is too low compared to zSpace spatial audio. How do I fix this?

**A:** This is an audio ducking issue.

**Solutions:**
1. Enable audio ducking in Narrator Settings:
   - Settings > Accessibility > Narrator > Audio > Lower volume of other apps
2. Lower zSpace spatial audio programmatically:
   ```csharp
   if (AssistiveSupport.isScreenReaderEnabled)
   {
       AudioListener.volume = 0.5f; // 50% volume
   }
   ```
3. Provide in-app volume controls

---

## Q: Long 3D object descriptions are cut off. How do I fix this?

**A:** Break descriptions into chunks or use AccessibilityNode.hint.

**Solution 1: Summary + Detail**
```csharp
node.label = "Human Heart Model"; // Short summary
node.hint = "Four chambers: left atrium, right atrium, left ventricle, right ventricle. Aorta visible."; // Details
```

**Solution 2: Delayed Announcements**
```csharp
IEnumerator AnnounceSequence()
{
    AssistiveSupport.notificationDispatcher?.SendAnnouncement("Human heart model selected.");
    yield return new WaitForSeconds(2f);
    AssistiveSupport.notificationDispatcher?.SendAnnouncement("Four chambers visible.");
    yield return new WaitForSeconds(2f);
    AssistiveSupport.notificationDispatcher?.SendAnnouncement("Animation controls available.");
}
```

---

## Q: How do I test Narrator if I don't have a screen reader?

**A:** Narrator is built into Windows 11.

**Steps:**
1. Press Win + Ctrl + Enter (Narrator starts)
2. Build your Unity application (.exe)
3. Launch the .exe (not Unity Editor Play Mode)
4. Press Tab to navigate
5. Verify elements are announced

**Alternative:** Use NVDA (free, open-source): https://www.nvaccess.org/
```

**Rationale:** FAQ addresses common developer questions about Narrator integration.

---

## Summary of Recommendations

| # | Recommendation | File Location | Priority |
|---|---------------|---------------|----------|
| 1 | Windows Narrator Testing Guide | `workflows/NARRATOR-TESTING-WORKFLOW.md` | ⭐⭐⭐ High |
| 2 | Narrator-Specific Unity Tests | `implementation/unity/tests/NarratorAccessibilityTests.cs` | ⭐⭐⭐ High |
| 3 | Audio Ducking Documentation | `docs/narrator-audio-ducking-guide.md` | ⭐⭐ Medium |
| 4 | End-User Narrator Settings Guide | `resources/NARRATOR-SETTINGS-GUIDE.md` | ⭐⭐ Medium |
| 5 | Speech Recap Testing Procedure | Update `workflows/QA-WORKFLOW.md` | ⭐⭐ Medium |
| 6 | Scan Mode Limitations | `standards/NARRATOR-SCAN-MODE-SUPPORT.md` | ⭐⭐ Medium |
| 7 | Keyboard Shortcut Reference Card | `resources/NARRATOR-KEYBOARD-SHORTCUTS.md` | ⭐ Low |
| 8 | Update Accessibility Checklist | Update `standards/ZSPACE-ACCESSIBILITY-CHECKLIST.md` | ⭐⭐⭐ High |
| 9 | Narrator Example Scene | `examples/narrator-zspace-demo/` | ⭐ Low |
| 10 | Troubleshooting FAQ | `docs/narrator-troubleshooting-faq.md` | ⭐⭐ Medium |

---

## Implementation Priority

### Phase 1: Critical (Implement First)
1. ✅ Update `ZSPACE-ACCESSIBILITY-CHECKLIST.md` with Narrator-specific items
2. ✅ Create `workflows/NARRATOR-TESTING-WORKFLOW.md`
3. ✅ Add Narrator tests to `NarratorAccessibilityTests.cs`

### Phase 2: High Priority
4. ✅ Document audio ducking behavior
5. ✅ Create end-user Narrator settings guide
6. ✅ Document Scan Mode limitations

### Phase 3: Nice to Have
7. ✅ Create keyboard shortcut reference card
8. ✅ Build Narrator example scene
9. ✅ Write troubleshooting FAQ

---

## Conclusion

Windows Narrator is the **most accessible** screen reader for zSpace applications because:
- ✅ **Pre-installed** on every Windows 11 PC (no downloads required)
- ✅ **Free** (no cost barrier)
- ✅ **Unity-integrated** via Unity Accessibility Module (Unity 2023.2+)
- ✅ **Feature-rich** (speech recap, AI image descriptions, verbosity control)

By optimizing zSpace Unity applications for Windows Narrator, developers ensure **maximum accessibility** for users with visual impairments running zSpace on Windows 11.

---

## References

- **Windows Narrator Complete Guide:** https://support.microsoft.com/en-us/windows/complete-guide-to-narrator-e4397a0d-ef4f-b386-d8ae-c172f109bdb1
- **Unity Accessibility Module:** https://docs.unity3d.com/2023.2/Documentation/Manual/com.unity.modules.accessibility.html
- **Microsoft UI Automation:** https://learn.microsoft.com/en-us/windows/win32/winauto/entry-uiauto-win32
- **Narrator Keyboard Shortcuts:** https://support.microsoft.com/en-us/windows/appendix-b-narrator-keyboard-commands-and-touch-gestures-8bdab3f4-b3e9-4554-7f28-8b15bd37410a

---

**Document Version:** 1.0
**Last Updated:** October 2025
**Author:** accessibility-standards-unity project
**Target Platform:** zSpace on Windows 11
