#!/usr/bin/env node

/**
 * ============================================================================
 * KEYBOARD NAVIGATION SCAFFOLDING GENERATOR
 * ============================================================================
 *
 * Generates C# code for keyboard input handling in Unity projects.
 * Analyzes the project to detect input system and generates appropriate code.
 *
 * USAGE:
 *   node keyboard-scaffolding.js <unity-project-path> [options]
 *
 * OPTIONS:
 *   --output <path>       Output directory (default: generated-fixes/keyboard/)
 *   --input-system <type> Force input system: legacy, new, both
 *   --scenes <scene>      Generate for specific scenes (comma-separated)
 *   --all-scenes          Generate for all scenes
 *
 * GENERATES:
 *   - KeyboardNavigationManager.cs
 *   - [Scene]_KeyboardConfig.cs (per scene)
 *   - KEYBOARD-SETUP-INSTRUCTIONS.md
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
  defaultOutput: 'AccessibilityAudit/generated-fixes/keyboard',
  supportedInputSystems: ['legacy', 'new', 'both']
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

  console.log('🎹 Keyboard Navigation Scaffolding Generator\n');
  console.log(`Project: ${args.projectPath}`);
  console.log(`Output: ${args.output}\n`);

  // Step 1: Analyze project
  console.log('Step 1: Analyzing Unity project...');
  const analysis = await analyzeProject(args.projectPath);
  console.log(`  ✓ Input system: ${analysis.inputSystem}`);
  console.log(`  ✓ UI framework: ${analysis.uiFramework}`);
  console.log(`  ✓ Unity version: ${analysis.unityVersion}`);
  console.log(`  ✓ Scenes found: ${analysis.scenes.length}\n`);

  // Step 2: Generate base navigation manager
  console.log('Step 2: Generating KeyboardNavigationManager...');
  await generateNavigationManager(args.output, analysis);
  console.log('  ✓ KeyboardNavigationManager.cs created\n');

  // Step 3: Generate scene-specific configs
  console.log('Step 3: Generating scene configurations...');
  const scenesToGenerate = args.scenes || analysis.scenes;
  for (const scene of scenesToGenerate) {
    await generateSceneConfig(args.output, scene, analysis);
    console.log(`  ✓ ${scene}_KeyboardConfig.cs created`);
  }
  console.log();

  // Step 4: Generate instructions
  console.log('Step 4: Generating setup instructions...');
  await generateInstructions(args.output, analysis, scenesToGenerate);
  console.log('  ✓ KEYBOARD-SETUP-INSTRUCTIONS.md created\n');

  console.log('✅ Keyboard scaffolding generation complete!\n');
  console.log(`Generated files in: ${args.output}`);
  console.log('\nNext steps:');
  console.log('1. Copy generated .cs files to your Unity project Assets/ folder');
  console.log('2. Follow instructions in KEYBOARD-SETUP-INSTRUCTIONS.md');
  console.log('3. Test keyboard navigation in Unity Editor');
}

// ============================================================================
// PROJECT ANALYSIS
// ============================================================================

async function analyzeProject(projectPath) {
  const analysis = {
    inputSystem: 'unknown',
    uiFramework: 'unknown',
    unityVersion: 'unknown',
    scenes: [],
    hasEventSystem: false,
    existingNamespaces: []
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

  // Detect input system
  const inputManagerPath = path.join(projectPath, 'ProjectSettings', 'InputManager.asset');
  const packagesPath = path.join(projectPath, 'Packages', 'manifest.json');

  if (fs.existsSync(packagesPath)) {
    const manifestContent = fs.readFileSync(packagesPath, 'utf-8');
    if (manifestContent.includes('com.unity.inputsystem')) {
      analysis.inputSystem = 'new';
    }
  }

  if (fs.existsSync(inputManagerPath)) {
    if (analysis.inputSystem === 'new') {
      analysis.inputSystem = 'both';
    } else {
      analysis.inputSystem = 'legacy';
    }
  }

  // Detect UI framework
  const assetsPath = path.join(projectPath, 'Assets');
  if (fs.existsSync(assetsPath)) {
    const scriptFiles = findScriptFiles(assetsPath);

    let hasUGUI = false;
    let hasUIToolkit = false;

    for (const file of scriptFiles) {
      const content = fs.readFileSync(file, 'utf-8');

      if (content.includes('UnityEngine.UI')) hasUGUI = true;
      if (content.includes('UnityEngine.UIElements')) hasUIToolkit = true;

      // Detect namespaces
      const namespaceMatch = content.match(/namespace\s+([\w.]+)/);
      if (namespaceMatch && !analysis.existingNamespaces.includes(namespaceMatch[1])) {
        analysis.existingNamespaces.push(namespaceMatch[1]);
      }

      // Check for EventSystem
      if (content.includes('EventSystem')) {
        analysis.hasEventSystem = true;
      }
    }

    if (hasUGUI && hasUIToolkit) {
      analysis.uiFramework = 'both';
    } else if (hasUIToolkit) {
      analysis.uiFramework = 'ui-toolkit';
    } else if (hasUGUI) {
      analysis.uiFramework = 'ugui';
    }
  }

  // Find scenes
  const scenesPath = path.join(projectPath, 'Assets');
  analysis.scenes = findSceneFiles(scenesPath).map(scenePath => {
    return path.basename(scenePath, '.unity');
  });

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

async function generateNavigationManager(outputPath, analysis) {
  // Read template
  const templateContent = fs.readFileSync(CONFIG.templatePath, 'utf-8');

  // Extract KeyboardNavigationManager class
  const classMatch = templateContent.match(
    /\/\/ ={70,}\s*\/\/ KEYBOARD NAVIGATION MANAGER[\s\S]*?public class KeyboardNavigationManager[\s\S]*?(?=\/\/ ={70,})/
  );

  if (!classMatch) {
    throw new Error('Could not find KeyboardNavigationManager template');
  }

  let managerCode = classMatch[0];

  // Customize based on input system
  if (analysis.inputSystem === 'new') {
    managerCode = adaptForNewInputSystem(managerCode);
  }

  // Add namespace if project uses them
  if (analysis.existingNamespaces.length > 0) {
    const namespace = analysis.existingNamespaces[0];
    managerCode = wrapInNamespace(managerCode, namespace);
  }

  // Write file
  const outputFile = path.join(outputPath, 'KeyboardNavigationManager.cs');
  fs.mkdirSync(outputPath, { recursive: true });
  fs.writeFileSync(outputFile, managerCode);
}

async function generateSceneConfig(outputPath, sceneName, analysis) {
  const className = `${sanitizeIdentifier(sceneName)}_KeyboardConfig`;

  const code = `using UnityEngine;
using UnityEngine.UI;
using UnityEngine.EventSystems;
using System.Collections.Generic;

${analysis.existingNamespaces.length > 0 ? `namespace ${analysis.existingNamespaces[0]}\n{` : ''}
/// <summary>
/// Keyboard navigation configuration for ${sceneName} scene.
/// Automatically sets up keyboard navigation when scene loads.
/// </summary>
[AddComponentMenu("Accessibility/${sceneName}/Keyboard Config")]
public class ${className} : MonoBehaviour
{
    [Header("Scene Configuration")]
    [Tooltip("Canvas containing UI elements to navigate")]
    public Canvas targetCanvas;

    [Tooltip("Auto-detect canvas if not specified")]
    public bool autoDetectCanvas = true;

    [Header("Navigation Settings")]
    [Tooltip("First element to focus when scene loads")]
    public Selectable initialFocusElement;

    [Tooltip("Enable arrow key navigation")]
    public bool enableArrowKeys = true;

    private KeyboardNavigationManager navigationManager;

    void Start()
    {
        SetupKeyboardNavigation();
    }

    private void SetupKeyboardNavigation()
    {
        // Find or create navigation manager
        navigationManager = FindObjectOfType<KeyboardNavigationManager>();

        if (navigationManager == null)
        {
            GameObject managerObject = new GameObject("KeyboardNavigationManager");
            navigationManager = managerObject.AddComponent<KeyboardNavigationManager>();
        }

        // Find canvas
        if (targetCanvas == null && autoDetectCanvas)
        {
            targetCanvas = FindObjectOfType<Canvas>();
        }

        if (targetCanvas == null)
        {
            Debug.LogError($"[${className}] No canvas found for keyboard navigation");
            return;
        }

        // Configure navigation manager
        ConfigureNavigation();

        // Focus initial element
        if (initialFocusElement != null)
        {
            initialFocusElement.Select();
        }
        else
        {
            FocusFirstElement();
        }
    }

    private void ConfigureNavigation()
    {
        navigationManager.autoDetectSelectables = true;
        navigationManager.enableArrowKeyNavigation = enableArrowKeys;
        navigationManager.wrapNavigation = true;
        navigationManager.focusFirstOnStart = true;

        navigationManager.RefreshNavigableElements();
    }

    private void FocusFirstElement()
    {
        Selectable[] selectables = targetCanvas.GetComponentsInChildren<Selectable>();
        foreach (Selectable s in selectables)
        {
            if (s.IsInteractable() && s.gameObject.activeInHierarchy)
            {
                s.Select();
                break;
            }
        }
    }

    // Public API for scene-specific customization
    public void RefreshNavigation()
    {
        if (navigationManager != null)
        {
            navigationManager.RefreshNavigableElements();
        }
    }

    public void FocusElement(Selectable element)
    {
        if (element != null && element.IsInteractable())
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

async function generateInstructions(outputPath, analysis, scenes) {
  const instructions = `# Keyboard Navigation Setup Instructions

## Generated Files

This folder contains keyboard navigation scaffolding for your Unity project:

- **KeyboardNavigationManager.cs** - Core navigation system
${scenes.map(s => `- **${sanitizeIdentifier(s)}_KeyboardConfig.cs** - Configuration for ${s} scene`).join('\n')}

## Installation Steps

### 1. Copy Files to Unity Project

Copy all generated *.cs files to your Unity project:

\`\`\`bash
# Recommended location
cp *.cs /path/to/unity/project/Assets/Scripts/Accessibility/
\`\`\`

### 2. Ensure EventSystem Exists

${analysis.hasEventSystem ? '✓ Your project already has an EventSystem' : '⚠️ You need to add an EventSystem to your scenes'}

${analysis.hasEventSystem ? '' : `To add EventSystem:
1. In Unity, select **GameObject > UI > Event System**
2. This creates a GameObject with EventSystem component
3. Required for UI input handling`}

### 3. Set Up Scene Configuration

For each scene with UI:

#### ${scenes[0] || 'YourScene'}

1. Open the scene in Unity Editor
2. Create an empty GameObject named "AccessibilityManager"
3. Add the **${sanitizeIdentifier(scenes[0] || 'YourScene')}_KeyboardConfig** component
4. In the Inspector:
   - **Target Canvas**: Assign your main Canvas (or leave empty for auto-detect)
   - **Initial Focus Element**: Assign the first UI element to focus (optional)
   - **Enable Arrow Keys**: Check to enable arrow key navigation

### 4. Add Focus Indicator (Recommended)

For visual feedback on focused elements:

1. In Unity, select your Canvas
2. Add Component > **Focus Indicator** (from AccessibilityTemplates.cs)
3. Customize outline color and thickness

To add FocusIndicator.cs:
- Extract the FocusIndicator class from \`templates/code/AccessibilityTemplates.cs\`
- Save as separate file in Assets/Scripts/Accessibility/
- Add to Canvas GameObject

### 5. Configure Keyboard Controls

Default key bindings:
- **Tab**: Navigate to next element
- **Shift+Tab**: Navigate to previous element
${analysis.inputSystem !== 'new' ? '- **Arrow Keys**: Navigate (if enabled)' : ''}
- **Enter/Space**: Activate focused element

To customize, edit KeyboardNavigationManager.cs:
\`\`\`csharp
public KeyCode nextKey = KeyCode.Tab;
public KeyCode previousModifier = KeyCode.LeftShift;
public KeyCode activateKey = KeyCode.Return;
\`\`\`

## Input System Configuration

**Detected Input System**: ${analysis.inputSystem}

${analysis.inputSystem === 'legacy' ? `
### Legacy Input System

Your project uses the legacy Input Manager. The generated code uses:
- \`Input.GetKeyDown()\`
- \`Input.GetKey()\`

No additional configuration needed.
` : ''}

${analysis.inputSystem === 'new' ? `
### New Input System

Your project uses the new Input System package. Consider:

1. **Option A: Keep Legacy Input** (Recommended for quick setup)
   - In Unity, go to **Edit > Project Settings > Player**
   - Set **Active Input Handling** to "Both"
   - Generated code will work without modification

2. **Option B: Convert to Input Actions**
   - Create an Input Action Asset
   - Define actions: Navigate, Submit, Cancel
   - Modify KeyboardNavigationManager.cs to use Input Actions
   - See Unity Input System documentation

\`\`\`csharp
// Example Input Actions setup
using UnityEngine.InputSystem;

void Update()
{
    if (navigateAction.triggered)
    {
        Vector2 direction = navigateAction.ReadValue<Vector2>();
        if (direction.y > 0) NavigatePrevious();
        if (direction.y < 0) NavigateNext();
    }
}
\`\`\`
` : ''}

${analysis.inputSystem === 'both' ? `
### Both Input Systems Detected

Your project has both input systems installed. The generated code uses legacy Input for compatibility.

To use New Input System:
- Follow "Option B" above to convert to Input Actions
- Or continue with legacy Input methods
` : ''}

## Testing

### 1. Test in Unity Editor

1. Press **Play**
2. Press **Tab** - Should navigate between UI elements
3. Press **Enter/Space** - Should activate buttons
4. Verify focus indicator appears (if added)

### 2. Keyboard Navigation Checklist

- [ ] Tab key navigates forward through all interactive elements
- [ ] Shift+Tab navigates backward
- [ ] Arrow keys navigate (if enabled)
- [ ] Enter/Space activates buttons
- [ ] Navigation wraps to first element at end
- [ ] Disabled elements are skipped
- [ ] Focus indicator is visible
- [ ] No keyboard traps (user can always navigate away)

### 3. Common Issues

**Tab key doesn't work:**
- Ensure EventSystem exists in scene
- Check that UI elements are Interactable
- Verify KeyboardNavigationManager is active

**Focus not visible:**
- Add FocusIndicator component to Canvas
- Check outline color contrasts with background
- Verify outline thickness is visible

**Wrong navigation order:**
- Set \`manualNavigationOrder\` in KeyboardNavigationManager
- Or adjust UI hierarchy order (sibling index)

## Customization

### Scene-Specific Navigation Order

Edit ${sanitizeIdentifier(scenes[0] || 'YourScene')}_KeyboardConfig.cs:

\`\`\`csharp
private void ConfigureNavigation()
{
    // Manual order
    navigationManager.autoDetectSelectables = false;
    navigationManager.manualNavigationOrder = new List<Selectable>
    {
        mainMenuButton,
        settingsButton,
        quitButton
    };
}
\`\`\`

### Custom Key Bindings

Edit KeyboardNavigationManager.cs:

\`\`\`csharp
[Header("Key Bindings")]
public KeyCode nextKey = KeyCode.D;  // Use D instead of Tab
public KeyCode previousKey = KeyCode.A;  // Use A for previous
\`\`\`

## WCAG Compliance

This implementation addresses:

- **2.1.1 Keyboard (Level A)**: All functionality available via keyboard
- **2.1.2 No Keyboard Trap (Level A)**: User can navigate away from all elements
- **2.4.3 Focus Order (Level A)**: Logical navigation sequence
- **2.4.7 Focus Visible (Level AA)**: Visual focus indicator

## Next Steps

After keyboard navigation is working:

1. **Add screen reader support** - Use \`bin/code-generator/accessibility-api-integration.js\`
2. **Generate focus management** - Use \`bin/code-generator/focus-management.js\`
3. **Test with real users** - Verify navigation is logical and efficient

## Support

For issues or questions:
- See templates/code/AccessibilityTemplates.cs for full component source
- Refer to Unity EventSystem documentation
- Check accessibility-standards-unity documentation

---

**Generated**: ${new Date().toISOString()}
**Unity Version**: ${analysis.unityVersion}
**Input System**: ${analysis.inputSystem}
**UI Framework**: ${analysis.uiFramework}
`;

  const outputFile = path.join(outputPath, 'KEYBOARD-SETUP-INSTRUCTIONS.md');
  fs.writeFileSync(outputFile, instructions);
}

// ============================================================================
// CODE TRANSFORMATION UTILITIES
// ============================================================================

function adaptForNewInputSystem(code) {
  // This would add Input System specific code
  // For now, we keep legacy Input for compatibility
  return code;
}

function wrapInNamespace(code, namespace) {
  // Extract using statements
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
  // Convert scene name to valid C# identifier
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
    inputSystem: null,
    scenes: null,
    allScenes: false
  };

  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];

    if (arg === '--output' && i + 1 < process.argv.length) {
      args.output = process.argv[++i];
    } else if (arg === '--input-system' && i + 1 < process.argv.length) {
      args.inputSystem = process.argv[++i];
    } else if (arg === '--scenes' && i + 1 < process.argv.length) {
      args.scenes = process.argv[++i].split(',');
    } else if (arg === '--all-scenes') {
      args.allScenes = true;
    } else if (arg === '--help' || arg === '-h') {
      printUsage();
      process.exit(0);
    } else if (!arg.startsWith('--')) {
      args.projectPath = arg;
    }
  }

  // Set defaults
  if (!args.output && args.projectPath) {
    args.output = path.join(args.projectPath, CONFIG.defaultOutput);
  }

  return args;
}

function printUsage() {
  console.log(`
Usage: node keyboard-scaffolding.js <unity-project-path> [options]

Generates keyboard navigation scaffolding code for Unity projects.

Options:
  --output <path>           Output directory for generated code
                            (default: <project>/AccessibilityAudit/generated-fixes/keyboard/)

  --input-system <type>     Force input system type: legacy, new, both
                            (default: auto-detect)

  --scenes <scene1,scene2>  Generate config for specific scenes
                            (default: all detected scenes)

  --all-scenes              Generate config for all scenes

  --help, -h                Show this help message

Examples:
  # Generate for all scenes
  node keyboard-scaffolding.js /path/to/unity/project

  # Generate for specific scenes
  node keyboard-scaffolding.js /path/to/unity/project --scenes MainMenu,GamePlay

  # Custom output directory
  node keyboard-scaffolding.js /path/to/unity/project --output ./custom-output

Output:
  - KeyboardNavigationManager.cs
  - [Scene]_KeyboardConfig.cs (per scene)
  - KEYBOARD-SETUP-INSTRUCTIONS.md

WCAG Criteria Addressed:
  - 2.1.1 Keyboard (Level A)
  - 2.1.2 No Keyboard Trap (Level A)
  - 2.4.3 Focus Order (Level A)
  - 2.4.7 Focus Visible (Level AA)
`);
}

// ============================================================================
// RUN
// ============================================================================

main().catch(error => {
  console.error('Error:', error.message);
  process.exit(1);
});
