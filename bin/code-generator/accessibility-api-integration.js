#!/usr/bin/env node

/**
 * ============================================================================
 * UNITY ACCESSIBILITY API INTEGRATION GENERATOR
 * ============================================================================
 *
 * Generates C# code for Unity Accessibility API (2023.2+).
 * Creates AccessibilityNode configurations for UI elements and screen reader support.
 *
 * USAGE:
 *   node accessibility-api-integration.js <unity-project-path> [options]
 *
 * OPTIONS:
 *   --output <path>       Output directory (default: generated-fixes/accessibility-api/)
 *   --scenes <scene>      Generate for specific scenes (comma-separated)
 *   --min-version <ver>   Minimum Unity version (default: auto-detect)
 *
 * GENERATES:
 *   - AccessibleButton.cs
 *   - AccessibleToggle.cs
 *   - AccessibleSlider.cs
 *   - ScreenReaderAnnouncer.cs
 *   - [Scene]_AccessibilitySetup.cs (per scene)
 *   - ACCESSIBILITY-API-INSTRUCTIONS.md
 *
 * REQUIREMENTS:
 *   - Unity 2023.2 or higher
 *   - Unity Accessibility package
 *
 * ============================================================================
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  templatePath: path.join(__dirname, '..', '..', 'templates', 'code', 'AccessibilityTemplates.cs'),
  defaultOutput: 'AccessibilityAudit/generated-fixes/accessibility-api',
  minUnityVersion: '2023.2'
};

// ============================================================================
// MAIN FUNCTION
// ============================================================================

async function main() {
  const args = parseArgs();

  if (!args.projectPath) {
    console.error('Error: Unity project path required');
    printUsage();
    process.exit(1);
  }

  console.log('♿ Unity Accessibility API Integration Generator\n');
  console.log(`Project: ${args.projectPath}`);
  console.log(`Output: ${args.output}\n`);

  // Step 1: Analyze project
  console.log('Step 1: Analyzing Unity project...');
  const analysis = await analyzeProject(args.projectPath);
  console.log(`  ✓ Unity version: ${analysis.unityVersion}`);
  console.log(`  ✓ Accessibility API available: ${analysis.hasAccessibilityAPI ? 'Yes' : 'No'}`);
  console.log(`  ✓ Scenes found: ${analysis.scenes.length}\n`);

  // Check version compatibility
  if (!analysis.hasAccessibilityAPI) {
    console.warn('⚠️  WARNING: Unity 2023.2+ required for Accessibility API');
    console.warn(`   Current version: ${analysis.unityVersion}`);
    console.warn(`   Code will be generated with compatibility checks.\n`);
  }

  // Step 2: Generate accessible components
  console.log('Step 2: Generating accessible UI components...');
  await generateAccessibleButton(args.output, analysis);
  console.log('  ✓ AccessibleButton.cs created');

  await generateAccessibleToggle(args.output, analysis);
  console.log('  ✓ AccessibleToggle.cs created');

  await generateAccessibleSlider(args.output, analysis);
  console.log('  ✓ AccessibleSlider.cs created');

  await generateScreenReaderAnnouncer(args.output, analysis);
  console.log('  ✓ ScreenReaderAnnouncer.cs created\n');

  // Step 3: Generate scene setup scripts
  console.log('Step 3: Generating scene accessibility setup...');
  const scenesToGenerate = args.scenes || analysis.scenes;
  for (const scene of scenesToGenerate) {
    await generateSceneAccessibilitySetup(args.output, scene, analysis);
    console.log(`  ✓ ${scene}_AccessibilitySetup.cs created`);
  }
  console.log();

  // Step 4: Generate instructions
  console.log('Step 4: Generating setup instructions...');
  await generateInstructions(args.output, analysis, scenesToGenerate);
  console.log('  ✓ ACCESSIBILITY-API-INSTRUCTIONS.md created\n');

  console.log('✅ Accessibility API integration complete!\n');
  console.log(`Generated files in: ${args.output}`);
  console.log('\nNext steps:');
  console.log('1. Ensure Unity 2023.2+ is installed');
  console.log('2. Copy generated .cs files to your Unity project Assets/ folder');
  console.log('3. Follow instructions in ACCESSIBILITY-API-INSTRUCTIONS.md');
  console.log('4. Test with screen reader (NVDA, JAWS, or VoiceOver)');
}

// ============================================================================
// PROJECT ANALYSIS
// ============================================================================

async function analyzeProject(projectPath) {
  const analysis = {
    unityVersion: 'unknown',
    hasAccessibilityAPI: false,
    scenes: [],
    existingNamespaces: [],
    uiElements: {
      buttons: 0,
      toggles: 0,
      sliders: 0,
      other: 0
    }
  };

  // Detect Unity version
  const projectVersionPath = path.join(projectPath, 'ProjectSettings', 'ProjectVersion.txt');
  if (fs.existsSync(projectVersionPath)) {
    const versionContent = fs.readFileSync(projectVersionPath, 'utf-8');
    const versionMatch = versionContent.match(/m_EditorVersion: ([\d.]+)/);
    if (versionMatch) {
      analysis.unityVersion = versionMatch[1];
      analysis.hasAccessibilityAPI = compareVersions(analysis.unityVersion, CONFIG.minUnityVersion) >= 0;
    }
  }

  // Find scenes
  const assetsPath = path.join(projectPath, 'Assets');
  if (fs.existsSync(assetsPath)) {
    analysis.scenes = findSceneFiles(assetsPath).map(scenePath => {
      return path.basename(scenePath, '.unity');
    });

    // Analyze existing scripts
    const scriptFiles = findScriptFiles(assetsPath);

    for (const file of scriptFiles) {
      const content = fs.readFileSync(file, 'utf-8');

      // Detect namespaces
      const namespaceMatch = content.match(/namespace\s+([\w.]+)/);
      if (namespaceMatch && !analysis.existingNamespaces.includes(namespaceMatch[1])) {
        analysis.existingNamespaces.push(namespaceMatch[1]);
      }

      // Count UI element types (rough estimate)
      analysis.uiElements.buttons += (content.match(/Button/g) || []).length;
      analysis.uiElements.toggles += (content.match(/Toggle/g) || []).length;
      analysis.uiElements.sliders += (content.match(/Slider/g) || []).length;
    }
  }

  return analysis;
}

function compareVersions(v1, v2) {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const num1 = parts1[i] || 0;
    const num2 = parts2[i] || 0;

    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
  }

  return 0;
}

function findScriptFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;

  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory() && item !== 'Library' && item !== 'Temp') {
      findScriptFiles(fullPath, files);
    } else if (stat.isFile() && item.endsWith('.cs')) {
      files.push(fullPath);
    }
  }

  return files;
}

function findSceneFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;

  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory() && item !== 'Library' && item !== 'Temp') {
      findSceneFiles(fullPath, files);
    } else if (stat.isFile() && item.endsWith('.unity')) {
      files.push(fullPath);
    }
  }

  return files;
}

// ============================================================================
// CODE GENERATION
// ============================================================================

async function generateAccessibleButton(outputPath, analysis) {
  const templateContent = fs.readFileSync(CONFIG.templatePath, 'utf-8');

  const classMatch = templateContent.match(
    /\/\/ ={70,}\s*\/\/ ACCESSIBLE BUTTON[\s\S]*?public class AccessibleButton[\s\S]*?(?=\/\/ ={70,})/
  );

  if (!classMatch) {
    throw new Error('Could not find AccessibleButton template');
  }

  let code = classMatch[0];

  if (analysis.existingNamespaces.length > 0) {
    code = wrapInNamespace(code, analysis.existingNamespaces[0]);
  }

  const outputFile = path.join(outputPath, 'AccessibleButton.cs');
  fs.mkdirSync(outputPath, { recursive: true });
  fs.writeFileSync(outputFile, code);
}

async function generateAccessibleToggle(outputPath, analysis) {
  const templateContent = fs.readFileSync(CONFIG.templatePath, 'utf-8');

  const classMatch = templateContent.match(
    /\/\/ ={70,}\s*\/\/ ACCESSIBLE TOGGLE[\s\S]*?public class AccessibleToggle[\s\S]*?(?=\/\/ ={70,})/
  );

  if (!classMatch) {
    throw new Error('Could not find AccessibleToggle template');
  }

  let code = classMatch[0];

  if (analysis.existingNamespaces.length > 0) {
    code = wrapInNamespace(code, analysis.existingNamespaces[0]);
  }

  const outputFile = path.join(outputPath, 'AccessibleToggle.cs');
  fs.writeFileSync(outputFile, code);
}

async function generateAccessibleSlider(outputPath, analysis) {
  const templateContent = fs.readFileSync(CONFIG.templatePath, 'utf-8');

  const classMatch = templateContent.match(
    /\/\/ ={70,}\s*\/\/ ACCESSIBLE SLIDER[\s\S]*?public class AccessibleSlider[\s\S]*?(?=\/\/ ={70,})/
  );

  if (!classMatch) {
    throw new Error('Could not find AccessibleSlider template');
  }

  let code = classMatch[0];

  if (analysis.existingNamespaces.length > 0) {
    code = wrapInNamespace(code, analysis.existingNamespaces[0]);
  }

  const outputFile = path.join(outputPath, 'AccessibleSlider.cs');
  fs.writeFileSync(outputFile, code);
}

async function generateScreenReaderAnnouncer(outputPath, analysis) {
  const templateContent = fs.readFileSync(CONFIG.templatePath, 'utf-8');

  const classMatch = templateContent.match(
    /\/\/ ={70,}\s*\/\/ SCREEN READER ANNOUNCER[\s\S]*?public class ScreenReaderAnnouncer[\s\S]*?(?=\/\/ ={70,})/
  );

  if (!classMatch) {
    throw new Error('Could not find ScreenReaderAnnouncer template');
  }

  let code = classMatch[0];

  if (analysis.existingNamespaces.length > 0) {
    code = wrapInNamespace(code, analysis.existingNamespaces[0]);
  }

  const outputFile = path.join(outputPath, 'ScreenReaderAnnouncer.cs');
  fs.writeFileSync(outputFile, code);
}

async function generateSceneAccessibilitySetup(outputPath, sceneName, analysis) {
  const className = `${sanitizeIdentifier(sceneName)}_AccessibilitySetup`;

  const code = `using UnityEngine;
using UnityEngine.UI;
using System.Collections.Generic;

#if UNITY_2023_2_OR_NEWER
using UnityEngine.Accessibility;
#endif

${analysis.existingNamespaces.length > 0 ? `namespace ${analysis.existingNamespaces[0]}\n{` : ''}
/// <summary>
/// Accessibility setup for ${sceneName} scene.
/// Automatically configures screen reader support for UI elements.
/// Requires Unity 2023.2+ with Accessibility API.
/// </summary>
[AddComponentMenu("Accessibility/${sceneName}/Accessibility Setup")]
public class ${className} : MonoBehaviour
{
    [Header("Scene Configuration")]
    [Tooltip("Automatically set up all UI elements in scene")]
    public bool autoSetupUI = true;

    [Tooltip("Canvas containing UI elements")]
    public Canvas targetCanvas;

    [Header("Screen Reader Settings")]
    [Tooltip("Enable screen reader announcements")]
    public bool enableAnnouncements = true;

    [Tooltip("Announce scene name when loaded")]
    public bool announceSceneLoad = true;

    [Tooltip("Custom scene announcement text")]
    public string sceneAnnouncement = "${sceneName} scene loaded";

    private List<GameObject> configuredElements = new List<GameObject>();

    void Start()
    {
        SetupAccessibility();
    }

    private void SetupAccessibility()
    {
#if UNITY_2023_2_OR_NEWER
        Debug.Log($"[${className}] Setting up accessibility for ${sceneName}...");

        // Find canvas
        if (targetCanvas == null)
        {
            targetCanvas = FindObjectOfType<Canvas>();
        }

        if (targetCanvas == null)
        {
            Debug.LogWarning($"[${className}] No canvas found");
            return;
        }

        // Setup UI elements
        if (autoSetupUI)
        {
            SetupButtons();
            SetupToggles();
            SetupSliders();
            SetupTextElements();
        }

        // Announce scene load
        if (announceSceneLoad && enableAnnouncements)
        {
            ScreenReaderAnnouncer.AnnouncePolite(sceneAnnouncement);
        }

        Debug.Log($"[${className}] Configured {configuredElements.Count} UI elements");
#else
        Debug.LogWarning($"[${className}] Unity 2023.2+ required for Accessibility API");
#endif
    }

    private void SetupButtons()
    {
        Button[] buttons = targetCanvas.GetComponentsInChildren<Button>();

        foreach (Button button in buttons)
        {
            if (button.GetComponent<AccessibleButton>() == null)
            {
                // Add AccessibleButton component
                AccessibleButton accessibleButton = button.gameObject.AddComponent<AccessibleButton>();

                // Auto-detect label from text component
                Text buttonText = button.GetComponentInChildren<Text>();
                if (buttonText != null && !string.IsNullOrEmpty(buttonText.text))
                {
                    accessibleButton.accessibleLabel = buttonText.text;
                }

                configuredElements.Add(button.gameObject);
            }
        }

        Debug.Log($"[${className}] Configured {buttons.Length} buttons");
    }

    private void SetupToggles()
    {
        Toggle[] toggles = targetCanvas.GetComponentsInChildren<Toggle>();

        foreach (Toggle toggle in toggles)
        {
            if (toggle.GetComponent<AccessibleToggle>() == null)
            {
                AccessibleToggle accessibleToggle = toggle.gameObject.AddComponent<AccessibleToggle>();

                // Auto-detect label
                Text toggleText = toggle.GetComponentInChildren<Text>();
                if (toggleText != null && !string.IsNullOrEmpty(toggleText.text))
                {
                    accessibleToggle.accessibleLabel = toggleText.text;
                }

                configuredElements.Add(toggle.gameObject);
            }
        }

        Debug.Log($"[${className}] Configured {toggles.Length} toggles");
    }

    private void SetupSliders()
    {
        Slider[] sliders = targetCanvas.GetComponentsInChildren<Slider>();

        foreach (Slider slider in sliders)
        {
            if (slider.GetComponent<AccessibleSlider>() == null)
            {
                AccessibleSlider accessibleSlider = slider.gameObject.AddComponent<AccessibleSlider>();

                // Try to find label from parent or nearby text
                Text sliderLabel = slider.GetComponentInChildren<Text>();
                if (sliderLabel != null && !string.IsNullOrEmpty(sliderLabel.text))
                {
                    accessibleSlider.accessibleLabel = sliderLabel.text;
                }
                else
                {
                    accessibleSlider.accessibleLabel = $"{slider.gameObject.name} slider";
                }

                configuredElements.Add(slider.gameObject);
            }
        }

        Debug.Log($"[${className}] Configured {sliders.Length} sliders");
    }

    private void SetupTextElements()
    {
        // Setup important text elements for screen reader
        Text[] textElements = targetCanvas.GetComponentsInChildren<Text>();

        foreach (Text text in textElements)
        {
            // Skip if already part of a button/toggle/slider
            if (text.GetComponentInParent<Button>() != null ||
                text.GetComponentInParent<Toggle>() != null ||
                text.GetComponentInParent<Slider>() != null)
            {
                continue;
            }

#if UNITY_2023_2_OR_NEWER
            // Add accessibility node for standalone text
            if (text.gameObject.GetComponent<AccessibilityNode>() == null &&
                !string.IsNullOrEmpty(text.text))
            {
                AccessibilityNode node = text.gameObject.AddComponent<AccessibilityNode>();
                node.label = text.text;
                node.role = AccessibilityRole.StaticText;

                configuredElements.Add(text.gameObject);
            }
#endif
        }
    }

    // Public API for runtime updates
    public void AnnounceMessage(string message, bool assertive = false)
    {
        if (!enableAnnouncements) return;

        if (assertive)
        {
            ScreenReaderAnnouncer.AnnounceAssertive(message);
        }
        else
        {
            ScreenReaderAnnouncer.AnnouncePolite(message);
        }
    }

    public void UpdateElementLabel(GameObject element, string newLabel)
    {
#if UNITY_2023_2_OR_NEWER
        AccessibilityNode node = element.GetComponent<AccessibilityNode>();
        if (node != null)
        {
            node.label = newLabel;
        }
#endif
    }
}
${analysis.existingNamespaces.length > 0 ? '}' : ''}
`;

  const outputFile = path.join(outputPath, `${className}.cs`);
  fs.writeFileSync(outputFile, code);
}

async function generateInstructions(outputPath, analysis, scenes) {
  const instructions = `# Unity Accessibility API Integration Instructions

## System Requirements

- **Unity Version**: 2023.2 or higher (Detected: ${analysis.unityVersion})
- **Accessibility API Status**: ${analysis.hasAccessibilityAPI ? '✓ Available' : '✗ Not Available (upgrade required)'}
- **Platform Support**: Windows, macOS, iOS (screen reader support varies by platform)

${!analysis.hasAccessibilityAPI ? `
## ⚠️ IMPORTANT: Unity Version Upgrade Required

Your project is using Unity ${analysis.unityVersion}, but the Accessibility API requires Unity 2023.2+.

To upgrade:
1. Backup your project
2. Download Unity 2023.2 or later from Unity Hub
3. Open project in new Unity version
4. Resolve any API compatibility issues
5. Return to this guide

The generated code includes compatibility checks and will work once upgraded.

---
` : ''}

## Generated Files

This folder contains Unity Accessibility API integration code:

- **AccessibleButton.cs** - Button with screen reader support
- **AccessibleToggle.cs** - Toggle with screen reader support
- **AccessibleSlider.cs** - Slider with keyboard and screen reader support
- **ScreenReaderAnnouncer.cs** - Dynamic announcement system
${scenes.map(s => `- **${sanitizeIdentifier(s)}_AccessibilitySetup.cs** - Auto-setup for ${s} scene`).join('\n')}

## Installation Steps

### 1. Install Unity Accessibility Package

${analysis.hasAccessibilityAPI ? `
Unity 2023.2+ includes the Accessibility API by default. No package installation needed.
` : `
After upgrading to Unity 2023.2+:
1. Open **Window > Package Manager**
2. Search for "Accessibility"
3. Install if not already present
`}

### 2. Copy Files to Unity Project

Copy all generated *.cs files to your Unity project:

\`\`\`bash
# Recommended location
cp *.cs /path/to/unity/project/Assets/Scripts/Accessibility/
\`\`\`

### 3. Set Up Scene Accessibility

For each scene with UI:

#### ${scenes[0] || 'YourScene'}

1. Open the scene in Unity Editor
2. Create an empty GameObject named "AccessibilityManager"
3. Add the **${sanitizeIdentifier(scenes[0] || 'YourScene')}_AccessibilitySetup** component
4. In the Inspector:
   - **Auto Setup UI**: Check to automatically configure all UI elements
   - **Target Canvas**: Assign your main Canvas (or leave empty for auto-detect)
   - **Enable Announcements**: Check to enable screen reader announcements
   - **Announce Scene Load**: Check to announce scene name when loaded
   - **Scene Announcement**: Customize the announcement text

5. Press **Play** - UI elements will be automatically configured

### 4. Replace Standard Components (Recommended)

For better accessibility, replace standard UI components with accessible versions:

#### Replace Button:

**Before:**
\`\`\`csharp
public Button myButton;
\`\`\`

**After:**
\`\`\`csharp
public Button myButton; // Keep the Button component

void Start() {
    // Add accessible layer
    myButton.gameObject.AddComponent<AccessibleButton>();
}
\`\`\`

Or add **AccessibleButton** component in Inspector alongside existing Button.

#### Replace Toggle:

Add **AccessibleToggle** component to Toggle GameObjects.

#### Replace Slider:

Add **AccessibleSlider** component to Slider GameObjects.

### 5. Add Screen Reader Announcements

For dynamic content updates:

\`\`\`csharp
using UnityEngine;

public class GameManager : MonoBehaviour
{
    void OnScoreChanged(int newScore)
    {
        // Polite announcement (waits for silence)
        ScreenReaderAnnouncer.AnnouncePolite($"Score: {newScore}");
    }

    void OnGameOver()
    {
        // Assertive announcement (interrupts)
        ScreenReaderAnnouncer.AnnounceAssertive("Game Over!");
    }
}
\`\`\`

## Screen Reader Configuration

### Accessible Properties:

All accessible components support these properties:

\`\`\`csharp
public class AccessibleButton : MonoBehaviour
{
    public string accessibleLabel = "";        // Label read by screen reader
    public string accessibleDescription = "";  // Extended description
    public bool announceOnPress = true;        // Announce when activated
    public string pressedAnnouncement = "";    // Custom press message
}
\`\`\`

### Setting Labels:

**Option 1: Inspector** (Editor Time)
1. Select UI element
2. Find AccessibleButton component
3. Set "Accessible Label" field

**Option 2: Code** (Runtime)
\`\`\`csharp
AccessibleButton btn = GetComponent<AccessibleButton>();
btn.SetAccessibleLabel("Start Game");
btn.SetAccessibleDescription("Begins a new game session");
\`\`\`

## Testing with Screen Readers

### Windows (NVDA - Free)

1. Download NVDA: https://www.nvaccess.org/download/
2. Install and launch NVDA
3. Run your Unity game (Build, not Editor)
4. Use keyboard to navigate UI
5. NVDA will read labels and announcements

**NVDA Commands:**
- Navigate: Tab / Shift+Tab
- Activate: Enter / Space
- Stop speech: Ctrl

### Windows (JAWS - Commercial)

1. Launch JAWS
2. Run Unity game
3. Navigate with keyboard
4. JAWS will announce UI elements

### macOS (VoiceOver - Built-in)

1. Enable VoiceOver: Cmd+F5
2. Run Unity game
3. Navigate: Ctrl+Option+Arrow Keys
4. Activate: Ctrl+Option+Space

**Note**: Unity builds may have limited VoiceOver support on macOS.

### iOS (VoiceOver)

For mobile builds:
1. Enable VoiceOver in iOS Settings
2. Build and deploy to device
3. Test with VoiceOver gestures

## WCAG Compliance

This implementation addresses:

- **4.1.2 Name, Role, Value (Level A)**:
  - All UI elements have accessible names (labels)
  - Roles correctly identified (button, toggle, slider)
  - State changes communicated (checked/unchecked, value changes)

- **4.1.3 Status Messages (Level AA)**:
  - Dynamic content announced via ScreenReaderAnnouncer
  - Appropriate urgency levels (polite vs assertive)
  - Live region announcements

### Required Information:

| Element | Name | Role | Value/State |
|---------|------|------|-------------|
| Button | ✓ Via accessibleLabel | ✓ Auto | N/A |
| Toggle | ✓ Via accessibleLabel | ✓ Auto | ✓ checked/unchecked |
| Slider | ✓ Via accessibleLabel | ✓ Auto | ✓ current value |

## Advanced Usage

### Custom Accessibility Nodes:

For non-standard UI:

\`\`\`csharp
#if UNITY_2023_2_OR_NEWER
using UnityEngine.Accessibility;

public class CustomControl : MonoBehaviour
{
    void Start()
    {
        AccessibilityNode node = gameObject.AddComponent<AccessibilityNode>();
        node.label = "Custom Control Name";
        node.role = AccessibilityRole.Button; // or Toggle, Slider, etc.
        node.description = "What this control does";
        node.isActive = true;
    }

    void UpdateValue(int newValue)
    {
        GetComponent<AccessibilityNode>().value = newValue.ToString();
    }
}
#endif
\`\`\`

### Dynamic Label Updates:

\`\`\`csharp
public class DynamicButton : MonoBehaviour
{
    private AccessibleButton accessibleButton;

    void Start()
    {
        accessibleButton = GetComponent<AccessibleButton>();
    }

    void UpdateButtonText(string newText)
    {
        // Update visual text
        GetComponentInChildren<Text>().text = newText;

        // Update screen reader label
        accessibleButton.SetAccessibleLabel(newText);
    }
}
\`\`\`

### Context-Aware Announcements:

\`\`\`csharp
public class InventoryManager : MonoBehaviour
{
    void AddItem(string itemName)
    {
        // Add to inventory...

        // Announce to screen reader
        ScreenReaderAnnouncer.AnnouncePolite($"Added {itemName} to inventory");
    }

    void OnInventoryFull()
    {
        // Use assertive for important warnings
        ScreenReaderAnnouncer.AnnounceAssertive("Inventory full! Cannot add more items.");
    }
}
\`\`\`

## Testing Checklist

### Screen Reader Testing:

- [ ] All buttons announced with correct labels
- [ ] Button activation announced
- [ ] Toggles announce state (on/off, checked/unchecked)
- [ ] Toggle state changes announced
- [ ] Sliders announce current value
- [ ] Slider value changes announced as dragged
- [ ] Scene load announced
- [ ] Dynamic content changes announced
- [ ] Announcements have appropriate timing (not too frequent)

### Accessibility Node Verification:

- [ ] All interactive elements have AccessibilityNode
- [ ] Labels are descriptive and concise
- [ ] Roles match element type
- [ ] States update correctly (toggle checked, slider value)
- [ ] Disabled elements marked as inactive

### Cross-Platform Testing:

- [ ] Windows (NVDA)
- [ ] Windows (JAWS)
- [ ] macOS (VoiceOver) - if applicable
- [ ] iOS (VoiceOver) - if mobile build

## Troubleshooting

### Screen reader not detecting UI:

- Verify Unity 2023.2+ is installed
- Check Accessibility API package is present
- Ensure AccessibilityNode components are attached
- Build project (Editor may have limited SR support)
- Test in standalone build, not Editor

### Labels not being read:

- Check accessibleLabel is set (not empty)
- Verify AccessibilityNode.label property
- Confirm element is active and interactable
- Check screen reader is running and configured

### Announcements not heard:

- Verify ScreenReaderAnnouncer GameObject exists
- Check announcements are enabled
- Try assertive mode for testing
- Ensure screen reader volume is up

### Performance issues:

- Avoid frequent announcements (< 1 per second)
- Use polite mode for non-critical messages
- Batch announcements when possible
- Consider debouncing slider value announcements

## Platform Limitations

### Unity Editor:
- Limited screen reader support in Editor
- Always test in builds

### Windows:
- ✓ Full NVDA support
- ✓ Full JAWS support
- Best platform for testing

### macOS:
- ⚠️ Limited VoiceOver support
- Unity accessibility API support varies
- Test on actual device

### Mobile (iOS):
- ✓ VoiceOver support in builds
- Requires device testing
- Gesture-based navigation

### Mobile (Android):
- ⚠️ TalkBack support varies
- Check Unity documentation for current status

## Best Practices

### Label Guidelines:

1. **Be Concise**: "Start Game" not "Click this button to start a new game"
2. **Be Descriptive**: "Close" not "X"
3. **Include Context**: "Delete Item: Sword" not "Delete"
4. **Avoid Redundancy**: "Settings" not "Settings Button" (role is implied)

### Announcement Guidelines:

1. **Use Polite by Default**: Don't interrupt unless critical
2. **Be Brief**: "Score: 100" not "Your current score is now 100 points"
3. **Avoid Spam**: Debounce frequent updates (like slider dragging)
4. **Provide Context**: "Level Complete! Score: 500" not just "Complete"

### Testing Guidelines:

1. **Test Early**: Don't wait until the end
2. **Real Devices**: Editor testing is insufficient
3. **Real Users**: Get feedback from screen reader users
4. **Document**: Keep track of what's accessible

## Integration with Other Features

Works seamlessly with:

- **Keyboard Navigation** (from keyboard-scaffolding.js)
- **Focus Management** (from focus-management.js)
- **Focus Indicator** (provides visual feedback)

All three systems complement each other:
1. Keyboard navigates focus
2. Focus indicator shows current focus
3. Screen reader announces current element

## Next Steps

1. **Test thoroughly** with multiple screen readers
2. **Get user feedback** from people with visual impairments
3. **Document patterns** for your team
4. **Train developers** on accessible UI design
5. **Monitor compliance** with automated audits

## Support

For issues or questions:
- Unity Accessibility API docs: https://docs.unity3d.com/Manual/accessibility.html
- NVDA documentation: https://www.nvaccess.org/
- WCAG 4.1.2 guidelines: https://www.w3.org/WAI/WCAG22/Understanding/name-role-value
- WCAG 4.1.3 guidelines: https://www.w3.org/WAI/WCAG22/Understanding/status-messages

---

**Generated**: ${new Date().toISOString()}
**Unity Version**: ${analysis.unityVersion}
**Accessibility API**: ${analysis.hasAccessibilityAPI ? 'Available' : 'Upgrade Required'}
**UI Elements Detected**: ${analysis.uiElements.buttons} buttons, ${analysis.uiElements.toggles} toggles, ${analysis.uiElements.sliders} sliders
`;

  const outputFile = path.join(outputPath, 'ACCESSIBILITY-API-INSTRUCTIONS.md');
  fs.writeFileSync(outputFile, instructions);
}

// ============================================================================
// UTILITIES
// ============================================================================

function wrapInNamespace(code, namespace) {
  const usingStatements = [];
  const codeWithoutUsings = code.replace(/^using\s+[\w.]+;\s*$/gm, (match) => {
    usingStatements.push(match.trim());
    return '';
  });

  return `${usingStatements.join('\n')}

namespace ${namespace}
{
${codeWithoutUsings}
}
`;
}

function sanitizeIdentifier(name) {
  return name
    .replace(/[^a-zA-Z0-9_]/g, '_')
    .replace(/^[0-9]/, '_$&');
}

// ============================================================================
// ARGUMENT PARSING
// ============================================================================

function parseArgs() {
  const args = {
    projectPath: null,
    output: null,
    scenes: null,
    minVersion: CONFIG.minUnityVersion
  };

  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];

    if (arg === '--output' && i + 1 < process.argv.length) {
      args.output = process.argv[++i];
    } else if (arg === '--scenes' && i + 1 < process.argv.length) {
      args.scenes = process.argv[++i].split(',');
    } else if (arg === '--min-version' && i + 1 < process.argv.length) {
      args.minVersion = process.argv[++i];
    } else if (arg === '--help' || arg === '-h') {
      printUsage();
      process.exit(0);
    } else if (!arg.startsWith('--')) {
      args.projectPath = arg;
    }
  }

  if (!args.output && args.projectPath) {
    args.output = path.join(args.projectPath, CONFIG.defaultOutput);
  }

  return args;
}

function printUsage() {
  console.log(`
Usage: node accessibility-api-integration.js <unity-project-path> [options]

Generates Unity Accessibility API integration code for screen reader support.

Requirements:
  - Unity 2023.2 or higher
  - Unity Accessibility package (included in 2023.2+)

Options:
  --output <path>              Output directory for generated code
                               (default: <project>/AccessibilityAudit/generated-fixes/accessibility-api/)

  --scenes <scene1,scene2>     Generate setup for specific scenes
                               (default: all detected scenes)

  --min-version <version>      Minimum Unity version (default: 2023.2)

  --help, -h                   Show this help message

Examples:
  # Generate for all scenes
  node accessibility-api-integration.js /path/to/unity/project

  # Generate for specific scenes
  node accessibility-api-integration.js /path/to/unity/project --scenes MainMenu,Settings

  # Custom output directory
  node accessibility-api-integration.js /path/to/unity/project --output ./custom

Output:
  - AccessibleButton.cs
  - AccessibleToggle.cs
  - AccessibleSlider.cs
  - ScreenReaderAnnouncer.cs
  - [Scene]_AccessibilitySetup.cs (per scene)
  - ACCESSIBILITY-API-INSTRUCTIONS.md

WCAG Criteria Addressed:
  - 4.1.2 Name, Role, Value (Level A)
  - 4.1.3 Status Messages (Level AA)

Platform Support:
  - Windows (NVDA, JAWS)
  - macOS (VoiceOver - limited)
  - iOS (VoiceOver)
`);
}

// ============================================================================
// RUN
// ============================================================================

main().catch(error => {
  console.error('Error:', error.message);
  process.exit(1);
});
