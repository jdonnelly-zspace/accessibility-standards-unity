#!/usr/bin/env node

/**
 * ============================================================================
 * FOCUS MANAGEMENT CODE GENERATOR
 * ============================================================================
 *
 * Generates C# code for focus management including visual focus indicators
 * and focus traps for modal dialogs.
 *
 * USAGE:
 *   node focus-management.js <unity-project-path> [options]
 *
 * OPTIONS:
 *   --output <path>       Output directory (default: generated-fixes/focus/)
 *   --scenes <scene>      Generate for specific scenes (comma-separated)
 *   --modals              Generate focus trap code for modal dialogs
 *   --indicator-color <color>  Focus indicator color (hex, default: #0080FF)
 *
 * GENERATES:
 *   - FocusIndicator.cs
 *   - FocusManager.cs
 *   - [Scene]_FocusConfig.cs (per scene)
 *   - ModalFocusTrap.cs (if --modals specified)
 *   - FOCUS-SETUP-INSTRUCTIONS.md
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
  defaultOutput: 'AccessibilityAudit/generated-fixes/focus',
  defaultIndicatorColor: '#0080FF'
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

  console.log('👁️  Focus Management Code Generator\n');
  console.log(`Project: ${args.projectPath}`);
  console.log(`Output: ${args.output}\n`);

  // Step 1: Analyze project
  console.log('Step 1: Analyzing Unity project...');
  const analysis = await analyzeProject(args.projectPath);
  console.log(`  ✓ Unity version: ${analysis.unityVersion}`);
  console.log(`  ✓ Scenes found: ${analysis.scenes.length}`);
  console.log(`  ✓ Modals detected: ${analysis.modalDialogs.length}\n`);

  // Step 2: Generate FocusIndicator
  console.log('Step 2: Generating FocusIndicator component...');
  await generateFocusIndicator(args.output, analysis, args.indicatorColor);
  console.log('  ✓ FocusIndicator.cs created\n');

  // Step 3: Generate FocusManager
  console.log('Step 3: Generating FocusManager component...');
  await generateFocusManager(args.output, analysis);
  console.log('  ✓ FocusManager.cs created\n');

  // Step 4: Generate scene configs
  console.log('Step 4: Generating scene configurations...');
  const scenesToGenerate = args.scenes || analysis.scenes;
  for (const scene of scenesToGenerate) {
    await generateSceneFocusConfig(args.output, scene, analysis);
    console.log(`  ✓ ${scene}_FocusConfig.cs created`);
  }
  console.log();

  // Step 5: Generate modal focus trap (if requested or modals detected)
  if (args.modals || analysis.modalDialogs.length > 0) {
    console.log('Step 5: Generating modal focus trap...');
    await generateModalFocusTrap(args.output, analysis);
    console.log('  ✓ ModalFocusTrap.cs created\n');
  }

  // Step 6: Generate instructions
  console.log('Step 6: Generating setup instructions...');
  await generateInstructions(args.output, analysis, scenesToGenerate, args);
  console.log('  ✓ FOCUS-SETUP-INSTRUCTIONS.md created\n');

  console.log('✅ Focus management code generation complete!\n');
  console.log(`Generated files in: ${args.output}`);
  console.log('\nNext steps:');
  console.log('1. Copy generated .cs files to your Unity project Assets/ folder');
  console.log('2. Follow instructions in FOCUS-SETUP-INSTRUCTIONS.md');
  console.log('3. Test focus indicator visibility in Unity Editor');
}

// ============================================================================
// PROJECT ANALYSIS
// ============================================================================

async function analyzeProject(projectPath) {
  const analysis = {
    unityVersion: 'unknown',
    scenes: [],
    modalDialogs: [],
    existingNamespaces: [],
    canvasCount: 0
  };

  // Detect Unity version
  const projectVersionPath = path.join(projectPath, 'ProjectSettings', 'ProjectVersion.txt');
  if (fs.existsSync(projectVersionPath)) {
    const versionContent = fs.readFileSync(projectVersionPath, 'utf-8');
    const versionMatch = versionContent.match(/m_EditorVersion: ([\d.]+)/);
    if (versionMatch) {
      analysis.unityVersion = versionMatch[1];
    }
  }

  // Find scenes
  const assetsPath = path.join(projectPath, 'Assets');
  if (fs.existsSync(assetsPath)) {
    analysis.scenes = findSceneFiles(assetsPath).map(scenePath => {
      return path.basename(scenePath, '.unity');
    });

    // Find existing scripts
    const scriptFiles = findScriptFiles(assetsPath);

    for (const file of scriptFiles) {
      const content = fs.readFileSync(file, 'utf-8');

      // Detect namespaces
      const namespaceMatch = content.match(/namespace\s+([\w.]+)/);
      if (namespaceMatch && !analysis.existingNamespaces.includes(namespaceMatch[1])) {
        analysis.existingNamespaces.push(namespaceMatch[1]);
      }

      // Detect potential modal dialogs
      if (content.includes('Modal') || content.includes('Dialog') || content.includes('Popup')) {
        const className = path.basename(file, '.cs');
        analysis.modalDialogs.push(className);
      }
    }
  }

  return analysis;
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

async function generateFocusIndicator(outputPath, analysis, color) {
  const templateContent = fs.readFileSync(CONFIG.templatePath, 'utf-8');

  // Extract FocusIndicator class
  const classMatch = templateContent.match(
    /\/\/ ={70,}\s*\/\/ FOCUS INDICATOR[\s\S]*?public class FocusIndicator[\s\S]*?(?=\/\/ ={70,})/
  );

  if (!classMatch) {
    throw new Error('Could not find FocusIndicator template');
  }

  let indicatorCode = classMatch[0];

  // Customize indicator color
  if (color !== CONFIG.defaultIndicatorColor) {
    const hexColor = parseHexColor(color);
    indicatorCode = indicatorCode.replace(
      /public Color outlineColor = new Color\([^)]+\);/,
      `public Color outlineColor = new Color(${hexColor.r}f, ${hexColor.g}f, ${hexColor.b}f, ${hexColor.a}f);`
    );
  }

  // Add namespace if needed
  if (analysis.existingNamespaces.length > 0) {
    indicatorCode = wrapInNamespace(indicatorCode, analysis.existingNamespaces[0]);
  }

  const outputFile = path.join(outputPath, 'FocusIndicator.cs');
  fs.mkdirSync(outputPath, { recursive: true });
  fs.writeFileSync(outputFile, indicatorCode);
}

async function generateFocusManager(outputPath, analysis) {
  const templateContent = fs.readFileSync(CONFIG.templatePath, 'utf-8');

  // Extract FocusManager class
  const classMatch = templateContent.match(
    /\/\/ ={70,}\s*\/\/ FOCUS MANAGER[\s\S]*?public class FocusManager[\s\S]*?(?=\/\/ ={70,})/
  );

  if (!classMatch) {
    throw new Error('Could not find FocusManager template');
  }

  let managerCode = classMatch[0];

  // Add namespace if needed
  if (analysis.existingNamespaces.length > 0) {
    managerCode = wrapInNamespace(managerCode, analysis.existingNamespaces[0]);
  }

  const outputFile = path.join(outputPath, 'FocusManager.cs');
  fs.writeFileSync(outputFile, managerCode);
}

async function generateSceneFocusConfig(outputPath, sceneName, analysis) {
  const className = `${sanitizeIdentifier(sceneName)}_FocusConfig`;

  const code = `using UnityEngine;
using UnityEngine.UI;
using UnityEngine.EventSystems;

${analysis.existingNamespaces.length > 0 ? `namespace ${analysis.existingNamespaces[0]}\n{` : ''}
/// <summary>
/// Focus configuration for ${sceneName} scene.
/// Sets up focus indicator and focus management.
/// </summary>
[AddComponentMenu("Accessibility/${sceneName}/Focus Config")]
public class ${className} : MonoBehaviour
{
    [Header("Focus Indicator Settings")]
    [Tooltip("Enable visual focus indicator")]
    public bool enableFocusIndicator = true;

    [Tooltip("Focus indicator outline color")]
    public Color indicatorColor = new Color(0f, 0.5f, 1f, 1f);

    [Tooltip("Outline thickness in pixels")]
    public float indicatorThickness = 3f;

    [Tooltip("Animate the focus indicator")]
    public bool animateIndicator = true;

    [Header("Scene Configuration")]
    [Tooltip("Canvas to attach focus indicator to")]
    public Canvas targetCanvas;

    private FocusIndicator focusIndicator;

    void Start()
    {
        SetupFocusManagement();
    }

    private void SetupFocusManagement()
    {
        // Find canvas
        if (targetCanvas == null)
        {
            targetCanvas = FindObjectOfType<Canvas>();
        }

        if (targetCanvas == null)
        {
            Debug.LogWarning($"[${className}] No canvas found for focus indicator");
            return;
        }

        // Create or find focus indicator
        if (enableFocusIndicator)
        {
            focusIndicator = FindObjectOfType<FocusIndicator>();

            if (focusIndicator == null)
            {
                GameObject indicatorObject = new GameObject("FocusIndicator");
                indicatorObject.transform.SetParent(targetCanvas.transform, false);
                focusIndicator = indicatorObject.AddComponent<FocusIndicator>();
            }

            // Configure indicator
            focusIndicator.outlineColor = indicatorColor;
            focusIndicator.outlineThickness = indicatorThickness;
            focusIndicator.animate = animateIndicator;
        }
    }

    // Public API for runtime configuration
    public void SetIndicatorColor(Color color)
    {
        indicatorColor = color;
        if (focusIndicator != null)
        {
            focusIndicator.SetOutlineColor(color);
        }
    }

    public void SetIndicatorThickness(float thickness)
    {
        indicatorThickness = thickness;
        if (focusIndicator != null)
        {
            focusIndicator.SetThickness(thickness);
        }
    }

    public void EnableIndicator()
    {
        enableFocusIndicator = true;
        if (focusIndicator != null)
        {
            focusIndicator.gameObject.SetActive(true);
        }
    }

    public void DisableIndicator()
    {
        enableFocusIndicator = false;
        if (focusIndicator != null)
        {
            focusIndicator.gameObject.SetActive(false);
        }
    }
}
${analysis.existingNamespaces.length > 0 ? '}' : ''}
`;

  const outputFile = path.join(outputPath, `${className}.cs`);
  fs.writeFileSync(outputFile, code);
}

async function generateModalFocusTrap(outputPath, analysis) {
  const className = 'ModalFocusTrap';

  const code = `using UnityEngine;
using UnityEngine.UI;
using UnityEngine.EventSystems;
using System.Collections;

${analysis.existingNamespaces.length > 0 ? `namespace ${analysis.existingNamespaces[0]}\n{` : ''}
/// <summary>
/// Focus trap for modal dialogs.
/// Prevents keyboard navigation from leaving the modal.
/// Addresses WCAG 2.1.2 (No Keyboard Trap) by providing ESC key to exit.
/// </summary>
[AddComponentMenu("Accessibility/Modal Focus Trap")]
public class ${className} : MonoBehaviour
{
    [Header("Modal Configuration")]
    [Tooltip("First UI element to focus when modal opens")]
    public Selectable firstFocusElement;

    [Tooltip("Last UI element in modal (for cycling)")]
    public Selectable lastFocusElement;

    [Tooltip("Allow ESC key to close modal")]
    public bool allowEscapeKey = true;

    [Tooltip("Key to close modal")]
    public KeyCode closeKey = KeyCode.Escape;

    [Header("Focus Restoration")]
    [Tooltip("Restore focus to previous element when modal closes")]
    public bool restoreFocus = true;

    private GameObject lastFocusedBeforeModal;
    private FocusManager focusManager;
    private bool trapActive = false;

    void OnEnable()
    {
        StartCoroutine(ActivateTrapDelayed());
    }

    void OnDisable()
    {
        DeactivateTrap();
    }

    void Update()
    {
        // Allow ESC to close modal
        if (trapActive && allowEscapeKey && Input.GetKeyDown(closeKey))
        {
            CloseModal();
        }
    }

    private IEnumerator ActivateTrapDelayed()
    {
        // Wait one frame for UI to initialize
        yield return null;

        // Store current focus
        lastFocusedBeforeModal = EventSystem.current?.currentSelectedGameObject;

        // Get or create FocusManager
        focusManager = GetComponent<FocusManager>();
        if (focusManager == null)
        {
            focusManager = gameObject.AddComponent<FocusManager>();
        }

        // Configure focus manager
        focusManager.enableFocusTrap = true;
        focusManager.autoFocusFirst = true;
        focusManager.restoreFocusOnExit = false; // We'll handle this ourselves

        focusManager.ActivateFocusTrap();
        trapActive = true;

        // Focus first element
        if (firstFocusElement != null)
        {
            firstFocusElement.Select();
        }
    }

    private void DeactivateTrap()
    {
        if (!trapActive) return;

        trapActive = false;

        if (focusManager != null)
        {
            focusManager.DeactivateFocusTrap();
        }

        // Restore focus
        if (restoreFocus && lastFocusedBeforeModal != null)
        {
            Selectable selectable = lastFocusedBeforeModal.GetComponent<Selectable>();
            if (selectable != null && selectable.IsInteractable())
            {
                selectable.Select();
            }
        }
    }

    public void CloseModal()
    {
        // Disable the modal GameObject
        // Application code should handle actual modal closing logic
        gameObject.SetActive(false);
    }

    // Public API
    public void SetFirstFocus(Selectable element)
    {
        firstFocusElement = element;
        if (trapActive && element != null)
        {
            element.Select();
        }
    }
}
${analysis.existingNamespaces.length > 0 ? '}' : ''}
`;

  const outputFile = path.join(outputPath, `${className}.cs`);
  fs.writeFileSync(outputFile, code);
}

async function generateInstructions(outputPath, analysis, scenes, args) {
  const instructions = `# Focus Management Setup Instructions

## Generated Files

This folder contains focus management components for your Unity project:

- **FocusIndicator.cs** - Visual focus highlight component
- **FocusManager.cs** - Focus management and focus trap utilities
${scenes.map(s => `- **${sanitizeIdentifier(s)}_FocusConfig.cs** - Focus config for ${s} scene`).join('\n')}
${args.modals || analysis.modalDialogs.length > 0 ? '- **ModalFocusTrap.cs** - Focus trap for modal dialogs' : ''}

## Installation Steps

### 1. Copy Files to Unity Project

Copy all generated *.cs files to your Unity project:

\`\`\`bash
# Recommended location
cp *.cs /path/to/unity/project/Assets/Scripts/Accessibility/
\`\`\`

### 2. Set Up Focus Indicator

The focus indicator provides visual feedback for keyboard navigation.

#### For Each Scene:

1. Open the scene in Unity Editor
2. Select your main **Canvas** GameObject
3. Add the **${sanitizeIdentifier(scenes[0] || 'YourScene')}_FocusConfig** component
4. In the Inspector:
   - **Enable Focus Indicator**: Check to enable
   - **Indicator Color**: Choose a color that contrasts with your UI (default: blue)
   - **Indicator Thickness**: Adjust outline thickness (recommended: 3-5 pixels)
   - **Animate Indicator**: Check for pulsing animation
   - **Target Canvas**: Assign your Canvas (or leave empty for auto-detect)

### 3. Test Focus Indicator

1. Press **Play** in Unity Editor
2. Press **Tab** to navigate UI elements
3. Verify that:
   - A colored outline appears around the focused element
   - The outline moves as you navigate
   - The outline is clearly visible against all backgrounds
   - The outline animation is smooth (if enabled)

### 4. Customize Focus Indicator Appearance

Edit the focus indicator color to meet your design requirements:

\`\`\`csharp
// In your scene config or at runtime
focusConfig.SetIndicatorColor(new Color(1f, 0.5f, 0f)); // Orange
focusConfig.SetIndicatorThickness(5f); // Thicker outline
\`\`\`

**WCAG Requirement**: The focus indicator must have a contrast ratio of at least 3:1 against adjacent colors.

### 5. Set Up Modal Focus Traps (If Applicable)

${args.modals || analysis.modalDialogs.length > 0 ? `
**Detected Modal Dialogs**: ${analysis.modalDialogs.join(', ') || 'None'}

For each modal dialog panel:

1. Select the modal panel GameObject in Unity
2. Add the **ModalFocusTrap** component
3. Configure in Inspector:
   - **First Focus Element**: Assign the first focusable element (e.g., title or first button)
   - **Last Focus Element**: Assign the last focusable element
   - **Allow Escape Key**: Check to enable ESC key to close
   - **Close Key**: Keyboard key to close modal (default: Escape)
   - **Restore Focus**: Check to restore focus when modal closes

#### Example Modal Structure:

\`\`\`
ModalPanel (with ModalFocusTrap)
├── Title (Text)
├── Message (Text)
├── ConfirmButton (First Focus Element)
└── CancelButton (Last Focus Element)
\`\`\`

#### Testing Modal Focus Trap:

1. Open the modal
2. Verify focus moves to first element automatically
3. Press Tab repeatedly - focus should cycle within modal
4. Press ESC - modal should close and focus should restore
5. Verify focus cannot escape the modal (except via ESC)
` : `
**No modal dialogs detected**. If your project has modals:

1. Add **ModalFocusTrap** component to modal panel GameObjects
2. Configure first and last focus elements
3. Enable ESC key to close modal
4. Test that focus stays within modal when active
`}

## WCAG Compliance

This implementation addresses:

- **2.4.7 Focus Visible (Level AA)**: Visual indicator for keyboard focus
  - Minimum contrast ratio: 3:1 against adjacent colors
  - Clear visual differentiation from unfocused state
  - Visible for all focusable elements

- **2.1.2 No Keyboard Trap (Level A)**: Focus traps with escape mechanism
  - ESC key always available to exit focus traps
  - Focus restoration after modal closes
  - Clear indication of how to exit

### Contrast Requirements

The focus indicator must meet these requirements:

| Background   | Indicator Color | Contrast Ratio | Status |
|--------------|-----------------|----------------|--------|
| Dark (#000)  | Blue (#0080FF)  | ~5.5:1         | ✓ Pass |
| Light (#FFF) | Blue (#0080FF)  | ~3.1:1         | ✓ Pass |
| Dark (#000)  | Yellow (#FFFF00)| ~19.5:1        | ✓ Pass |

**Current Indicator Color**: ${args.indicatorColor || CONFIG.defaultIndicatorColor}

Use this tool to check contrast: https://webaim.org/resources/contrastchecker/

### Recommended Colors by Theme:

**Light Theme UI:**
- Dark Blue: #0033CC (high contrast)
- Dark Orange: #CC6600
- Dark Purple: #6600CC

**Dark Theme UI:**
- Bright Cyan: #00FFFF
- Bright Yellow: #FFFF00
- Bright Magenta: #FF00FF

## Testing Checklist

### Focus Indicator:

- [ ] Indicator appears when navigating with keyboard
- [ ] Indicator moves to correct element on focus change
- [ ] Indicator is visible on all UI elements
- [ ] Indicator has sufficient contrast (minimum 3:1)
- [ ] Indicator size is appropriate (not too small/large)
- [ ] Indicator animation is smooth (if enabled)
- [ ] Indicator doesn't obstruct UI content

### Focus Management:

- [ ] Focus follows logical tab order
- [ ] Focus wraps to first element at end (or stops)
- [ ] Focus skips disabled elements
- [ ] Focus starts at appropriate element on scene load

### Modal Focus Traps:

${args.modals || analysis.modalDialogs.length > 0 ? `
- [ ] Focus moves to modal when it opens
- [ ] Tab key cycles within modal only
- [ ] ESC key closes modal
- [ ] Focus returns to previous element after modal closes
- [ ] Cannot tab out of modal accidentally
- [ ] Screen reader announces modal opening
` : '- [ ] N/A - No modals in project'}

## Customization Examples

### Change Indicator Color at Runtime:

\`\`\`csharp
public class ThemeManager : MonoBehaviour
{
    private ${sanitizeIdentifier(scenes[0] || 'YourScene')}_FocusConfig focusConfig;

    void Start()
    {
        focusConfig = FindObjectOfType<${sanitizeIdentifier(scenes[0] || 'YourScene')}_FocusConfig>();
    }

    public void ApplyDarkTheme()
    {
        focusConfig.SetIndicatorColor(new Color(0f, 1f, 1f)); // Cyan for dark theme
    }

    public void ApplyLightTheme()
    {
        focusConfig.SetIndicatorColor(new Color(0f, 0.2f, 0.8f)); // Dark blue for light theme
    }
}
\`\`\`

### Dynamic Modal Focus Trap:

\`\`\`csharp
public class DialogManager : MonoBehaviour
{
    public void ShowConfirmDialog(string message)
    {
        GameObject dialog = Instantiate(dialogPrefab);

        // Add focus trap
        ModalFocusTrap trap = dialog.AddComponent<ModalFocusTrap>();
        trap.firstFocusElement = dialog.GetComponent<Button>(); // Confirm button
        trap.allowEscapeKey = true;
        trap.restoreFocus = true;

        dialog.SetActive(true);
    }
}
\`\`\`

### Custom Focus Indicator Style:

Modify FocusIndicator.cs to use custom graphics:

\`\`\`csharp
// Instead of Outline component, use a custom sprite
private void CreateCustomIndicator()
{
    indicatorImage.sprite = customFocusSprite;
    indicatorImage.type = Image.Type.Sliced;
    indicatorImage.color = outlineColor;
}
\`\`\`

## Troubleshooting

### Focus indicator not visible:

- Check indicator color contrasts with background
- Verify FocusIndicator component is active
- Ensure Canvas is assigned
- Check sorting order (should be high value)
- Verify outline thickness is sufficient

### Focus indicator appears in wrong position:

- Ensure target element has RectTransform
- Check Canvas render mode (Screen Space - Overlay works best)
- Verify no conflicting layout components

### Modal focus trap not working:

- Ensure EventSystem exists in scene
- Verify FocusManager component is attached
- Check that modal panel is active
- Confirm first/last focus elements are assigned
- Test that ESC key handler is active

### Performance issues with indicator:

- Disable animation if not needed
- Reduce outline thickness
- Use simpler indicator graphics
- Cache RectTransform references

## Integration with Keyboard Navigation

Focus management works seamlessly with keyboard navigation:

1. **KeyboardNavigationManager** handles focus movement
2. **FocusIndicator** shows current focus visually
3. **FocusManager** prevents focus from escaping containers
4. **ModalFocusTrap** manages focus in dialogs

Make sure to install keyboard navigation first:
\`\`\`bash
node bin/code-generator/keyboard-scaffolding.js <project-path>
\`\`\`

## Next Steps

After focus management is working:

1. **Add screen reader support** - Use \`bin/code-generator/accessibility-api-integration.js\`
2. **Test with real users** - Verify indicator is helpful and not distracting
3. **Customize appearance** - Match your game's visual style
4. **Document patterns** - Create internal guidelines for focus management

## Support

For issues or questions:
- See templates/code/AccessibilityTemplates.cs for component source
- Check Unity EventSystem documentation
- Review WCAG 2.4.7 guidelines for focus indicators

---

**Generated**: ${new Date().toISOString()}
**Unity Version**: ${analysis.unityVersion}
**Indicator Color**: ${args.indicatorColor || CONFIG.defaultIndicatorColor}
`;

  const outputFile = path.join(outputPath, 'FOCUS-SETUP-INSTRUCTIONS.md');
  fs.writeFileSync(outputFile, instructions);
}

// ============================================================================
// UTILITIES
// ============================================================================

function parseHexColor(hex) {
  // Remove # if present
  hex = hex.replace('#', '');

  // Parse hex values
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  const a = hex.length === 8 ? parseInt(hex.substring(6, 8), 16) / 255 : 1;

  return { r, g, b, a };
}

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
    modals: false,
    indicatorColor: CONFIG.defaultIndicatorColor
  };

  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];

    if (arg === '--output' && i + 1 < process.argv.length) {
      args.output = process.argv[++i];
    } else if (arg === '--scenes' && i + 1 < process.argv.length) {
      args.scenes = process.argv[++i].split(',');
    } else if (arg === '--modals') {
      args.modals = true;
    } else if (arg === '--indicator-color' && i + 1 < process.argv.length) {
      args.indicatorColor = process.argv[++i];
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
Usage: node focus-management.js <unity-project-path> [options]

Generates focus management code for Unity projects.

Options:
  --output <path>              Output directory for generated code
                               (default: <project>/AccessibilityAudit/generated-fixes/focus/)

  --scenes <scene1,scene2>     Generate config for specific scenes
                               (default: all detected scenes)

  --modals                     Generate focus trap code for modal dialogs

  --indicator-color <color>    Focus indicator color in hex format
                               (default: #0080FF)

  --help, -h                   Show this help message

Examples:
  # Generate focus management for all scenes
  node focus-management.js /path/to/unity/project

  # Generate with custom indicator color
  node focus-management.js /path/to/unity/project --indicator-color #FF6600

  # Generate with modal support
  node focus-management.js /path/to/unity/project --modals

  # Generate for specific scenes with custom output
  node focus-management.js /path/to/unity/project --scenes MainMenu,Settings --output ./custom

Output:
  - FocusIndicator.cs
  - FocusManager.cs
  - [Scene]_FocusConfig.cs (per scene)
  - ModalFocusTrap.cs (if --modals specified)
  - FOCUS-SETUP-INSTRUCTIONS.md

WCAG Criteria Addressed:
  - 2.4.7 Focus Visible (Level AA)
  - 2.1.2 No Keyboard Trap (Level A)
`);
}

// ============================================================================
// RUN
// ============================================================================

main().catch(error => {
  console.error('Error:', error.message);
  process.exit(1);
});
