# Manual Review Automation Plan
## Reducing Manual VPAT Reviews from 69 Items to Near-Zero

**Framework Version:** 3.3.0-phase2 ✅ **UPDATED**
**Current Manual Reviews:** 69 instances across 42 unique WCAG criteria
**Target:** Automate 38 of 42 items (90% automation)
**Created:** 2025-10-27
**Last Updated:** 2025-10-27
**Project:** accessibility-standards-unity

---

## 🎯 Current Status (2025-10-27)

**✅ Phase 1 Complete:** 1 visual analysis tool implemented and integrated
**✅ Phase 2 Complete:** 6 semantic analysis tools implemented and integrated
**📊 Progress:** 7 of 42 criteria automated (17%)
**🔄 Next:** Phase 3 implementation (18 medium-priority items)

---

## Executive Summary

Currently, the accessibility-standards-unity framework marks **69 instances** across **42 unique WCAG criteria** as "Manual review required" in VPAT reports. This document outlines a systematic plan to automate the majority of these reviews through advanced pattern detection, computer vision, and runtime analysis.

**UPDATE:** Phases 1 and 2 are now complete and integrated into the main audit tool!

### Automation Breakdown

| Tier | Automation Level | Items | Strategy | Target Release | **Status** |
|------|-----------------|-------|----------|---------------|------------|
| **🟢 High (Phase 1)** | 80-100% | 6 items | Visual analysis | v3.2.0 | ✅ **1/6 DONE** |
| **🟢 High (Phase 2)** | 80-100% | 6 items | Semantic analysis | v3.3.0 | ✅ **6/6 DONE** |
| **🟡 Medium** | 40-80% | 18 items | Partial automation | v3.4.0 | 🔜 **NEXT** |
| **🟠 Low** | 10-40% | 8 items | Detection only | v3.5.0 | ⏳ Pending |
| **🔴 Very Low** | < 10% | 4 items | ❌ Skip (remain manual) | N/A | ⏳ Pending |

**Total Automatable:** 38 of 42 items (90%)
**Currently Automated:** 7 of 42 items (17%) ← **NEW**

---

## 🟢 High Automation Tier - Phase 1 (6 Items)

**Target:** v3.2.0 - "Visual Analysis Enhancement"
**Estimated Effort:** 3-4 weeks
**Automation Level:** 80-100%
**Status:** ✅ PARTIALLY COMPLETE (1 of 6 tools implemented - see docs/PHASE-1-STATUS.md)
**Integration:** ✅ INTEGRATED into main audit tool (v3.3.0-phase2)

### Item 1: [1.4.3] Contrast (Minimum) - Level AA ⭐ PRIORITY

**WCAG Requirement:**
- Normal text: ≥4.5:1 contrast ratio
- Large text (18pt+ or 14pt+ bold): ≥3.0:1
- UI components: ≥3.0:1

**Current Status:** Manual review required

**Automation Strategy:**

```javascript
// NEW: bin/analyze-text-contrast.js
import Tesseract from 'tesseract.js';
import sharp from 'sharp';
import { calculateContrastRatio } from './utils/wcag-calculations.js';

export async function analyzeTextContrast(screenshotPath) {
  const findings = [];

  // Step 1: OCR to detect text
  const { data: { words } } = await Tesseract.recognize(screenshotPath, 'eng');

  // Step 2: Load image for color analysis
  const image = await sharp(screenshotPath).raw().toBuffer({ resolveWithObject: true });
  const { data, info } = image;

  for (const word of words) {
    const bbox = word.bbox;

    // Step 3: Extract foreground (text) color
    const fgColor = extractTextColor(data, info, bbox);

    // Step 4: Extract background color (sample around text)
    const bgColor = extractBackgroundColor(data, info, bbox);

    // Step 5: Calculate contrast ratio
    const ratio = calculateContrastRatio(fgColor, bgColor);

    // Step 6: Determine text size (small vs large)
    const fontSize = estimateFontSize(bbox, info);
    const threshold = fontSize >= 18 ? 3.0 : 4.5;

    if (ratio < threshold) {
      findings.push({
        wcagCriterion: '1.4.3',
        severity: ratio < 3.0 ? 'critical' : 'high',
        text: word.text,
        foreground: rgbToHex(fgColor),
        background: rgbToHex(bgColor),
        ratio: ratio.toFixed(2),
        required: threshold,
        location: {
          x: bbox.x0,
          y: bbox.y0,
          width: bbox.x1 - bbox.x0,
          height: bbox.y1 - bbox.y0
        },
        recommendation: `Increase contrast to ${threshold}:1 minimum`
      });
    }
  }

  return findings;
}

// Helper: Extract text color by sampling text pixels
function extractTextColor(imageData, info, bbox) {
  const samples = [];
  const { width, channels } = info;

  // Sample center pixels of text bounding box
  const centerX = Math.floor((bbox.x0 + bbox.x1) / 2);
  const centerY = Math.floor((bbox.y0 + bbox.y1) / 2);

  for (let dy = -2; dy <= 2; dy++) {
    for (let dx = -2; dx <= 2; dx++) {
      const x = centerX + dx;
      const y = centerY + dy;
      const idx = (y * width + x) * channels;

      samples.push({
        r: imageData[idx],
        g: imageData[idx + 1],
        b: imageData[idx + 2]
      });
    }
  }

  // Return most common color (text is usually uniform)
  return getMostCommonColor(samples);
}

// Helper: Extract background color
function extractBackgroundColor(imageData, info, bbox) {
  const samples = [];
  const { width, channels } = info;

  // Sample pixels around text (just outside bbox)
  const padding = 5;

  // Top edge
  for (let x = bbox.x0 - padding; x <= bbox.x1 + padding; x++) {
    const y = bbox.y0 - padding;
    const idx = (y * width + x) * channels;
    samples.push({
      r: imageData[idx],
      g: imageData[idx + 1],
      b: imageData[idx + 2]
    });
  }

  // Similar for bottom, left, right edges...

  return getAverageColor(samples);
}
```

**Integration Point:** Update `bin/analyze-visual-accessibility.js`

```javascript
// bin/analyze-visual-accessibility.js - UPDATE
import { analyzeTextContrast } from './analyze-text-contrast.js';

export async function analyzeVisualAccessibility(screenshotDir, outputDir) {
  const findings = {
    contrast: [],
    colorBlind: [],
    targetSize: []
  };

  const screenshots = await fs.readdir(screenshotDir);

  for (const screenshot of screenshots) {
    const path = join(screenshotDir, screenshot);

    // NEW: Text contrast analysis
    const textContrast = await analyzeTextContrast(path);
    findings.contrast.push(...textContrast);

    // Existing: Color-blind simulation
    const colorBlindResults = await generateColorBlindSimulations(path);
    findings.colorBlind.push(colorBlindResults);
  }

  return findings;
}
```

**VPAT Update:** Change from "Manual review required" to automated status

```markdown
| **[1.4.3 Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum) (Level AA)** | ✅ Supports / ⚠️ Partially Supports | Automated visual analysis detected X text elements with insufficient contrast. See detailed findings in visual-analysis/contrast-report.json |
```

**Dependencies:**
- `tesseract.js` (OCR) - Already in package.json? NO → Add
- `sharp` (image processing) - ✅ Already installed
- Unity screenshot capture - ✅ Already implemented

**Estimated Effort:** 1 week
**Automation Level:** 90%

---

### Item 2: [1.4.11] Non-text Contrast - Level AA

**WCAG Requirement:**
- UI components: ≥3.0:1 contrast against adjacent colors
- Graphical objects: ≥3.0:1 contrast

**Current Status:** Manual review required

**Automation Strategy:**

```javascript
// NEW: bin/analyze-ui-contrast.js
export async function analyzeUIContrast(screenshotPath, sceneData) {
  const findings = [];

  // Step 1: Detect UI component edges
  const edges = await detectEdges(screenshotPath);

  // Step 2: Identify interactive UI components
  const components = await identifyUIComponents(edges, sceneData);

  for (const component of components) {
    // Step 3: Get component's dominant color
    const componentColor = await getComponentColor(screenshotPath, component.bounds);

    // Step 4: Get adjacent/background color
    const adjacentColor = await getAdjacentColor(screenshotPath, component.bounds);

    // Step 5: Calculate contrast
    const ratio = calculateContrastRatio(componentColor, adjacentColor);

    if (ratio < 3.0) {
      findings.push({
        wcagCriterion: '1.4.11',
        severity: 'high',
        component: component.name || component.type,
        componentColor: rgbToHex(componentColor),
        adjacentColor: rgbToHex(adjacentColor),
        ratio: ratio.toFixed(2),
        required: 3.0,
        location: component.bounds,
        recommendation: 'Increase contrast to 3.0:1 minimum'
      });
    }
  }

  return findings;
}

// Helper: Detect edges using Canny algorithm
async function detectEdges(imagePath) {
  // Use sharp + edge detection
  const image = await sharp(imagePath)
    .greyscale()
    .convolve({
      width: 3,
      height: 3,
      kernel: [-1, -1, -1, -1, 8, -1, -1, -1, -1] // Laplacian edge detection
    })
    .toBuffer();

  return image;
}

// Helper: Identify UI components from Unity scene data
async function identifyUIComponents(edges, sceneData) {
  const components = [];

  // Parse Unity scene for Canvas > UI elements
  const uiElements = parseUnityUI(sceneData);

  for (const element of uiElements) {
    if (element.type === 'Button' || element.type === 'Toggle' || element.type === 'Slider') {
      components.push({
        name: element.name,
        type: element.type,
        bounds: convertUnityRectToPixels(element.rectTransform, sceneData.canvas)
      });
    }
  }

  return components;
}
```

**Dependencies:**
- Edge detection algorithm
- Unity scene file parser (YAML)

**Estimated Effort:** 1 week
**Automation Level:** 85%

---

### Item 3: [1.4.1] Use of Color - Level A

**WCAG Requirement:**
- Color not the only visual means of conveying information

**Current Status:** Manual review required

**Automation Strategy:**

```javascript
// NEW: bin/detect-color-only-info.js
export async function detectColorOnlyInformation(screenshotPath) {
  const findings = [];

  // Step 1: Generate color-blind simulations (already implemented!)
  const simulations = await generateColorBlindSimulations(screenshotPath);

  // Step 2: Detect interactive elements in original
  const originalElements = await detectInteractiveElements(screenshotPath);

  // Step 3: Compare against each CVD type
  for (const cvdType of ['protanopia', 'deuteranopia', 'tritanopia']) {
    const cvdElements = await detectInteractiveElements(simulations[cvdType]);

    // Step 4: Semantic comparison - can we still distinguish elements?
    const analysis = compareElementDistinguishability(originalElements, cvdElements);

    if (analysis.lostElements.length > 0) {
      findings.push({
        wcagCriterion: '1.4.1',
        severity: 'high',
        cvdType: cvdType,
        affectedPopulation: getCVDPopulation(cvdType),
        issue: 'Information conveyed by color only',
        lostElements: analysis.lostElements,
        recommendation: 'Add non-color visual cues (icons, patterns, text labels)'
      });
    }
  }

  return findings;
}

// Helper: Compare element distinguishability
function compareElementDistinguishability(original, cvd) {
  const lostElements = [];

  // Build color histogram for each element
  for (let i = 0; i < original.length; i++) {
    const origColor = original[i].dominantColor;
    const cvdColor = cvd[i].dominantColor;

    // Check if element becomes indistinguishable from neighbors
    for (let j = 0; j < original.length; j++) {
      if (i === j) continue;

      const origDistance = colorDistance(original[i].dominantColor, original[j].dominantColor);
      const cvdDistance = colorDistance(cvd[i].dominantColor, cvd[j].dominantColor);

      // If elements were distinguishable but now aren't...
      if (origDistance > 50 && cvdDistance < 20) {
        lostElements.push({
          element1: original[i].name,
          element2: original[j].name,
          reason: 'Elements become indistinguishable in ' + cvdType
        });
      }
    }
  }

  return { lostElements };
}
```

**Dependencies:**
- Color-blind simulation - ✅ Already implemented
- Interactive element detection

**Estimated Effort:** 3-4 days
**Automation Level:** 80%

---

### Item 4: [2.5.8] Target Size (Minimum) - Level AA

**WCAG Requirement:**
- Interactive targets ≥24x24 CSS pixels (or exceptions apply)

**Current Status:** Manual review required

**Automation Strategy:**

```javascript
// NEW: bin/analyze-target-sizes.js
export async function analyzeTargetSizes(projectPath, sceneData) {
  const findings = [];

  // Step 1: Parse Unity UI elements from scene files
  const scenes = await findSceneFiles(projectPath);

  for (const scene of scenes) {
    const sceneYaml = await parseUnityScene(scene);
    const canvas = sceneYaml.Canvas;

    // Step 2: Find all interactive UI elements
    const interactiveElements = findInteractiveElements(sceneYaml);

    for (const element of interactiveElements) {
      // Step 3: Convert Unity RectTransform to pixel size
      const pixelSize = convertUnityRectToPixels(element.RectTransform, canvas);

      // Step 4: Check minimum size
      if (pixelSize.width < 24 || pixelSize.height < 24) {
        findings.push({
          wcagCriterion: '2.5.8',
          severity: 'medium',
          scene: scene.name,
          element: element.name,
          type: element.type,
          size: `${pixelSize.width}x${pixelSize.height}px`,
          required: '24x24px',
          recommendation: `Increase ${element.name} to at least 24x24px`
        });
      }
    }
  }

  // Step 5: Analyze 3D interactive objects (from screenshots)
  // This is harder - requires depth analysis

  return findings;
}

// Helper: Convert Unity units to screen pixels
function convertUnityRectToPixels(rectTransform, canvas) {
  const canvasScaler = canvas.CanvasScaler;
  const referenceResolution = canvasScaler.referenceResolution; // e.g., 1920x1080

  // Unity RectTransform uses anchors and sizeDelta
  const width = rectTransform.sizeDelta.x * (canvasScaler.scaleFactor || 1);
  const height = rectTransform.sizeDelta.y * (canvasScaler.scaleFactor || 1);

  return { width, height };
}

// Helper: Find interactive elements
function findInteractiveElements(sceneYaml) {
  const interactive = [];

  // Find GameObjects with Button, Toggle, Slider, etc.
  for (const gameObject of sceneYaml.GameObjects) {
    const hasButton = gameObject.components.find(c => c.type === 'Button');
    const hasToggle = gameObject.components.find(c => c.type === 'Toggle');
    const hasSlider = gameObject.components.find(c => c.type === 'Slider');

    if (hasButton || hasToggle || hasSlider) {
      interactive.push({
        name: gameObject.name,
        type: hasButton ? 'Button' : hasToggle ? 'Toggle' : 'Slider',
        RectTransform: gameObject.RectTransform
      });
    }
  }

  return interactive;
}
```

**Dependencies:**
- Unity scene YAML parser
- Understanding of Unity Canvas scaling

**Estimated Effort:** 4-5 days
**Automation Level:** 85% (UI), 60% (3D objects)

---

### Item 5: [2.3.1] Three Flashes or Below Threshold - Level A

**WCAG Requirement:**
- No content flashes more than 3 times per second
- Or flashing is below general flash and red flash thresholds

**Current Status:** Manual review required

**Automation Strategy:**

```javascript
// NEW: bin/detect-flashing-content.js
export async function detectFlashingContent(videoPath) {
  const findings = [];

  // Step 1: Extract frames at 60fps
  const frames = await extractVideoFrames(videoPath, { fps: 60 });

  // Step 2: Analyze luminance changes frame-by-frame
  for (let i = 0; i < frames.length - 60; i++) {
    const window = frames.slice(i, i + 60); // 1-second window

    // Step 3: Detect rapid luminance changes
    const flashes = detectLuminanceChanges(window);

    // Step 4: Check flash rate
    if (flashes.count > 3) {
      findings.push({
        wcagCriterion: '2.3.1',
        severity: 'critical',
        timestamp: i / 60,
        duration: 1.0,
        flashRate: flashes.count,
        area: flashes.area,
        recommendation: 'Reduce flash rate to ≤3 flashes per second'
      });
    }
  }

  return findings;
}

// Helper: Detect luminance changes
function detectLuminanceChanges(frames) {
  const changes = [];

  for (let i = 1; i < frames.length; i++) {
    const prev = frames[i - 1];
    const curr = frames[i];

    // Calculate relative luminance for each frame
    const prevLuminance = calculateRelativeLuminance(prev);
    const currLuminance = calculateRelativeLuminance(curr);

    // WCAG defines flash as > 10% relative luminance change
    const change = Math.abs(currLuminance - prevLuminance);

    if (change > 0.1) {
      changes.push({
        frame: i,
        change: change
      });
    }
  }

  // Count distinct flashes (debounce consecutive changes)
  const flashes = debounceFlashes(changes);

  return {
    count: flashes.length,
    area: calculateFlashArea(flashes)
  };
}
```

**Implementation Requirements:**
- Video capture of Unity application running
- Frame extraction tool (ffmpeg)

**NEW Binary:** `bin/capture-video.js`

```javascript
// Capture Unity application video for flash analysis
export async function captureUnityVideo(projectPath, duration = 60) {
  // Launch Unity in play mode
  // Record screen for specified duration
  // Save as video file for analysis
}
```

**Estimated Effort:** 1 week
**Automation Level:** 75% (requires runtime video capture)

---

### Item 6: [1.4.5] Images of Text - Level AA

**WCAG Requirement:**
- Text not presented as images (unless customizable or essential)

**Current Status:** Manual review required

**Automation Strategy:**

```javascript
// NEW: bin/detect-images-of-text.js
export async function detectImagesOfText(projectPath) {
  const findings = [];

  // Step 1: Find all texture assets
  const textures = await findFiles(projectPath, 'Assets/**/*.{png,jpg,jpeg,tga,psd}');

  for (const texturePath of textures) {
    // Step 2: Run OCR on texture
    const { data } = await Tesseract.recognize(texturePath, 'eng');

    // Step 3: If significant text detected...
    if (data.confidence > 60 && data.words.length > 2) {
      // Step 4: Determine texture usage (UI vs. scene content)
      const usage = await analyzeTextureUsage(texturePath, projectPath);

      // Images of text are bad for UI, acceptable for signs/posters in 3D scenes
      if (usage.type === 'UI' || usage.type === 'button') {
        findings.push({
          wcagCriterion: '1.4.5',
          severity: 'medium',
          file: texturePath,
          detectedText: data.text,
          confidence: data.confidence,
          usage: usage.type,
          recommendation: 'Replace with TextMeshPro or Unity UI Text component'
        });
      }
    }
  }

  return findings;
}

// Helper: Analyze how texture is used
async function analyzeTextureUsage(texturePath, projectPath) {
  // Search all scenes and prefabs for references to this texture
  const references = await findTextureReferences(texturePath, projectPath);

  for (const ref of references) {
    // Check if used in UI (Canvas > Image component)
    if (ref.componentType === 'Image' && ref.hasCanvasParent) {
      return { type: 'UI', file: ref.file };
    }

    // Check if used as button texture
    if (ref.componentType === 'Button') {
      return { type: 'button', file: ref.file };
    }
  }

  // Likely used for 3D scene content (acceptable)
  return { type: 'scene', file: references[0]?.file };
}
```

**Dependencies:**
- `tesseract.js` (OCR)
- Unity asset reference finder

**Estimated Effort:** 4-5 days
**Automation Level:** 80%

---

## 🟢 High Automation Tier - Phase 2 (6 Items)

**Target:** v3.3.0 - "Semantic Analysis"
**Estimated Effort:** 3-4 weeks
**Automation Level:** 80-100%
**Status:** ✅ COMPLETE (6 of 6 tools implemented - see docs/PHASE-2-STATUS.md)
**Integration:** ✅ INTEGRATED into main audit tool (v3.3.0-phase2)

### Item 7: [2.4.2] Page Titled - Level A

**WCAG Requirement:**
- Each scene/view has descriptive title
- Title describes topic or purpose
- Title programmatically determined for assistive tech

**Current Status:** Manual review required

**Automation Strategy:**

```javascript
// NEW: bin/analyze-scene-titles.js
export async function analyzeSceneTitles(projectPath) {
  const findings = [];

  // Step 1: Parse all Unity scenes
  const scenes = await findSceneFiles(projectPath);

  for (const scene of scenes) {
    const sceneYaml = await parseUnityScene(scene);

    // Step 2: Check for title/heading GameObject
    const titleFound = findSceneTitle(sceneYaml);

    if (!titleFound) {
      findings.push({
        wcagCriterion: '2.4.2',
        severity: 'medium',
        scene: scene.name,
        issue: 'No scene title or heading detected',
        recommendation: 'Add descriptive title/heading that announces scene purpose'
      });
    } else if (!titleFound.accessible) {
      findings.push({
        wcagCriterion: '2.4.2',
        severity: 'medium',
        scene: scene.name,
        title: titleFound.text,
        issue: 'Title not accessible to assistive technologies',
        recommendation: 'Add AccessibilityNode with role="heading" to title element'
      });
    }
  }

  return findings;
}

// Helper: Find scene title
function findSceneTitle(sceneYaml) {
  // Look for TextMeshPro or UI Text with "title", "heading", "header" in name
  for (const gameObject of sceneYaml.GameObjects) {
    const name = gameObject.name.toLowerCase();

    if (name.includes('title') || name.includes('heading') || name.includes('header')) {
      const textComponent = gameObject.components.find(c =>
        c.type === 'TextMeshProUGUI' || c.type === 'Text'
      );

      const accessibilityNode = gameObject.components.find(c =>
        c.type === 'AccessibilityNode'
      );

      if (textComponent) {
        return {
          text: textComponent.text,
          accessible: accessibilityNode && accessibilityNode.role === 'heading'
        };
      }
    }
  }

  return null;
}
```

**Estimated Effort:** 2-3 days
**Automation Level:** 85%

---

### Item 8: [2.4.6] Headings and Labels - Level AA

**WCAG Requirement:**
- Headings and labels describe topic or purpose
- Programmatically determined

**Current Status:** Manual review required

**Automation Strategy:**

```javascript
// NEW: bin/analyze-headings-labels.js
export async function analyzeHeadingsAndLabels(projectPath) {
  const findings = [];

  const scenes = await findSceneFiles(projectPath);

  for (const scene of scenes) {
    const sceneYaml = await parseUnityScene(scene);

    // Check all UI labels
    const labels = findAllLabels(sceneYaml);

    for (const label of labels) {
      // Check if label is descriptive
      if (isVagueLabel(label.text)) {
        findings.push({
          wcagCriterion: '2.4.6',
          severity: 'medium',
          scene: scene.name,
          element: label.name,
          text: label.text,
          issue: 'Label text is not descriptive',
          recommendation: `Make label more descriptive. Current: "${label.text}"`
        });
      }

      // Check if programmatically associated with input
      if (label.forInput && !label.programmaticallyLinked) {
        findings.push({
          wcagCriterion: '2.4.6',
          severity: 'high',
          scene: scene.name,
          element: label.name,
          issue: 'Label not programmatically associated with input field',
          recommendation: 'Use AccessibilityNode to link label with input'
        });
      }
    }
  }

  return findings;
}

// Helper: Detect vague labels
function isVagueLabel(text) {
  const vagueTerms = [
    'click here', 'here', 'submit', 'ok', 'button',
    'field', 'input', 'select', 'choose', 'enter'
  ];

  const lowerText = text.toLowerCase().trim();

  // Check if label is just a vague term
  return vagueTerms.includes(lowerText) || lowerText.length < 3;
}
```

**Estimated Effort:** 3-4 days
**Automation Level:** 75%

---

### Item 9: [3.2.3] Consistent Navigation - Level AA

**WCAG Requirement:**
- Navigation mechanisms repeated across scenes occur in same relative order

**Current Status:** Manual review required

**Automation Strategy:**

```javascript
// NEW: bin/analyze-consistent-navigation.js
export async function analyzeConsistentNavigation(projectPath) {
  const findings = [];

  // Step 1: Analyze all scenes
  const scenes = await findSceneFiles(projectPath);
  const navigationPatterns = [];

  for (const scene of scenes) {
    const sceneYaml = await parseUnityScene(scene);

    // Step 2: Extract navigation elements
    const navElements = findNavigationElements(sceneYaml);

    navigationPatterns.push({
      scene: scene.name,
      navigation: navElements
    });
  }

  // Step 3: Compare navigation across scenes
  const baseNav = navigationPatterns[0];

  for (let i = 1; i < navigationPatterns.length; i++) {
    const currentNav = navigationPatterns[i];

    // Step 4: Check if navigation order is consistent
    const inconsistencies = compareNavigationOrder(baseNav.navigation, currentNav.navigation);

    if (inconsistencies.length > 0) {
      findings.push({
        wcagCriterion: '3.2.3',
        severity: 'medium',
        baseScene: baseNav.scene,
        currentScene: currentNav.scene,
        inconsistencies: inconsistencies,
        recommendation: 'Maintain same navigation order across all scenes'
      });
    }
  }

  return findings;
}

// Helper: Find navigation elements (buttons, menu items)
function findNavigationElements(sceneYaml) {
  const navElements = [];

  // Look for GameObjects with "nav", "menu", "button" in name
  for (const gameObject of sceneYaml.GameObjects) {
    const name = gameObject.name.toLowerCase();

    if (name.includes('nav') || name.includes('menu') || name.includes('header')) {
      // Find all buttons within this navigation container
      const buttons = findChildButtons(gameObject, sceneYaml);

      navElements.push({
        container: gameObject.name,
        buttons: buttons.map(b => b.name)
      });
    }
  }

  return navElements;
}

// Helper: Compare navigation order
function compareNavigationOrder(baseNav, currentNav) {
  const inconsistencies = [];

  // Check if same navigation containers exist
  for (const baseContainer of baseNav) {
    const matchingContainer = currentNav.find(c => c.container === baseContainer.container);

    if (!matchingContainer) {
      inconsistencies.push({
        issue: 'Navigation container missing',
        container: baseContainer.container
      });
      continue;
    }

    // Check if button order is the same
    for (let i = 0; i < baseContainer.buttons.length; i++) {
      if (baseContainer.buttons[i] !== matchingContainer.buttons[i]) {
        inconsistencies.push({
          issue: 'Navigation order differs',
          container: baseContainer.container,
          expected: baseContainer.buttons[i],
          actual: matchingContainer.buttons[i]
        });
      }
    }
  }

  return inconsistencies;
}
```

**Estimated Effort:** 4-5 days
**Automation Level:** 80%

---

### Item 10: [3.2.4] Consistent Identification - Level AA

**WCAG Requirement:**
- Components with same functionality identified consistently across scenes

**Current Status:** Manual review required

**Automation Strategy:**

```javascript
// NEW: bin/analyze-consistent-identification.js
export async function analyzeConsistentIdentification(projectPath) {
  const findings = [];

  // Step 1: Build database of UI components across all scenes
  const scenes = await findSceneFiles(projectPath);
  const componentDatabase = {};

  for (const scene of scenes) {
    const sceneYaml = await parseUnityScene(scene);
    const components = extractAllComponents(sceneYaml);

    for (const component of components) {
      // Group by function (detected from name/type)
      const functionType = determineFunctionType(component);

      if (!componentDatabase[functionType]) {
        componentDatabase[functionType] = [];
      }

      componentDatabase[functionType].push({
        scene: scene.name,
        name: component.name,
        label: component.label,
        icon: component.icon
      });
    }
  }

  // Step 2: Check for inconsistent identification
  for (const [functionType, instances] of Object.entries(componentDatabase)) {
    if (instances.length < 2) continue; // Need at least 2 to compare

    // Step 3: Check if all instances use same label/icon
    const baseInstance = instances[0];

    for (let i = 1; i < instances.length; i++) {
      const current = instances[i];

      if (baseInstance.label !== current.label) {
        findings.push({
          wcagCriterion: '3.2.4',
          severity: 'medium',
          functionType: functionType,
          baseScene: baseInstance.scene,
          baseLabel: baseInstance.label,
          currentScene: current.scene,
          currentLabel: current.label,
          recommendation: `Use consistent label "${baseInstance.label}" for ${functionType} across all scenes`
        });
      }

      if (baseInstance.icon !== current.icon) {
        findings.push({
          wcagCriterion: '3.2.4',
          severity: 'low',
          functionType: functionType,
          issue: 'Inconsistent icon usage',
          recommendation: 'Use same icon for same functionality'
        });
      }
    }
  }

  return findings;
}

// Helper: Determine function type from component
function determineFunctionType(component) {
  const name = component.name.toLowerCase();

  // Common patterns
  if (name.includes('back') || name.includes('return')) return 'BackButton';
  if (name.includes('next') || name.includes('continue')) return 'NextButton';
  if (name.includes('save')) return 'SaveButton';
  if (name.includes('cancel')) return 'CancelButton';
  if (name.includes('help')) return 'HelpButton';
  if (name.includes('settings')) return 'SettingsButton';

  return component.type;
}
```

**Estimated Effort:** 3-4 days
**Automation Level:** 75%

---

### Item 11: [2.4.3] Focus Order - Level A

**WCAG Requirement:**
- Keyboard focus order preserves meaning and operability

**Current Status:** Manual review required

**Automation Strategy:**

```javascript
// NEW: bin/analyze-focus-order.js
export async function analyzeFocusOrder(projectPath) {
  const findings = [];

  const scenes = await findSceneFiles(projectPath);

  for (const scene of scenes) {
    const sceneYaml = await parseUnityScene(scene);

    // Step 1: Extract all focusable elements
    const focusableElements = findFocusableElements(sceneYaml);

    // Step 2: Determine expected focus order (visual/spatial order)
    const visualOrder = sortByVisualOrder(focusableElements);

    // Step 3: Determine actual focus order (hierarchy or explicit)
    const actualOrder = determineFocusOrder(focusableElements, sceneYaml);

    // Step 4: Compare orders
    const mismatches = compareFocusOrders(visualOrder, actualOrder);

    if (mismatches.length > 0) {
      findings.push({
        wcagCriterion: '2.4.3',
        severity: 'high',
        scene: scene.name,
        issue: 'Focus order does not match visual/logical order',
        mismatches: mismatches,
        recommendation: 'Reorder UI elements in hierarchy or use explicit navigation'
      });
    }
  }

  return findings;
}

// Helper: Sort by visual order (top-to-bottom, left-to-right)
function sortByVisualOrder(elements) {
  return elements.sort((a, b) => {
    // Sort by Y position (top to bottom)
    if (Math.abs(a.position.y - b.position.y) > 50) {
      return b.position.y - a.position.y; // Unity Y is inverted
    }

    // If same row, sort by X position (left to right)
    return a.position.x - b.position.x;
  });
}

// Helper: Determine actual focus order
function determineFocusOrder(elements, sceneYaml) {
  // Check if Unity's Selectable navigation is explicitly set
  for (const element of elements) {
    const selectable = element.components.find(c => c.type === 'Selectable');

    if (selectable && selectable.navigation.mode === 'Explicit') {
      // Use explicit navigation
      element.focusOrder = selectable.navigation;
    } else {
      // Use hierarchy order
      element.focusOrder = getHierarchyIndex(element, sceneYaml);
    }
  }

  return elements.sort((a, b) => a.focusOrder - b.focusOrder);
}
```

**Estimated Effort:** 4-5 days
**Automation Level:** 70%

---

### Item 12: [1.4.4] Resize Text - Level AA

**WCAG Requirement:**
- Text can be resized up to 200% without loss of content/functionality

**Current Status:** Manual review required

**Automation Strategy:**

```javascript
// NEW: bin/test-text-resize.js
export async function testTextResize(projectPath) {
  const findings = [];

  // This requires runtime testing
  // Launch Unity with different text scaling settings

  const scenes = await findSceneFiles(projectPath);
  const textScales = [1.0, 1.5, 2.0]; // 100%, 150%, 200%

  for (const scene of scenes) {
    for (const scale of textScales) {
      // Step 1: Launch Unity with text scale
      const screenshot = await captureSceneWithTextScale(projectPath, scene, scale);

      // Step 2: Detect text overflow or clipping
      const overflow = await detectTextOverflow(screenshot, scene);

      if (overflow.length > 0) {
        findings.push({
          wcagCriterion: '1.4.4',
          severity: 'medium',
          scene: scene.name,
          textScale: scale,
          issue: 'Text overflows or is clipped at 200% scale',
          affectedElements: overflow,
          recommendation: 'Use flexible layout (ContentSizeFitter) or scrollable containers'
        });
      }
    }
  }

  return findings;
}

// This would require Unity runtime integration
async function captureSceneWithTextScale(projectPath, scene, scale) {
  // Launch Unity in batch mode
  // Set TextMeshPro global scale or Unity UI scale
  // Capture screenshot
  // Return screenshot path
}
```

**Estimated Effort:** 1 week (requires Unity runtime)
**Automation Level:** 70%

---

## Summary: High Automation Phases

### Phase 1 (v3.2.0) - 6 items
- ✅ [1.4.3] Contrast (Minimum) - 90% automated
- ✅ [1.4.11] Non-text Contrast - 85% automated
- ✅ [1.4.1] Use of Color - 80% automated
- ✅ [2.5.8] Target Size - 85% automated
- ✅ [2.3.1] Three Flashes - 75% automated
- ✅ [1.4.5] Images of Text - 80% automated

**Total Effort:** 3-4 weeks

### Phase 2 (v3.3.0) - 6 items
- ✅ [2.4.2] Page Titled - 85% automated
- ✅ [2.4.6] Headings and Labels - 75% automated
- ✅ [3.2.3] Consistent Navigation - 80% automated
- ✅ [3.2.4] Consistent Identification - 75% automated
- ✅ [2.4.3] Focus Order - 70% automated
- ✅ [1.4.4] Resize Text - 70% automated

**Total Effort:** 3-4 weeks

---

**Next:** Continue to Medium Automation Tier (18 items)?


## 🟡 Medium Automation Tier (18 Items)

**Target:** v3.4.0 - "Partial Automation & Smart Detection"
**Estimated Effort:** 4-6 weeks
**Automation Level:** 40-80%

These items require combination of automated detection + manual verification.

---

### Item 13: [1.1.1] Non-text Content - Level A

**WCAG Requirement:**
- All non-text content has text alternatives

**Automation Strategy:** 60%
- ✅ **Automated:** Detect images/icons without alt text (AccessibilityNode.label)
- ⚠️ **Manual:** Verify alt text quality and relevance

```javascript
export async function analyzeNonTextContent(projectPath) {
  // Detect Image components without AccessibilityNode
  // Flag missing alt text
  // Cannot verify if alt text is meaningful
}
```

---

### Item 14: [1.3.1] Info and Relationships - Level A

**WCAG Requirement:**
- Information structure and relationships programmatically determined

**Automation Strategy:** 65%
- ✅ **Automated:** Detect UI hierarchy, check for AccessibilityNode roles
- ⚠️ **Manual:** Verify semantic correctness

```javascript
export async function analyzeInfoAndRelationships(projectPath) {
  // Check if form labels are linked to inputs
  // Detect heading hierarchy
  // Cannot verify if relationships are semantically correct
}
```

---

### Item 15: [1.3.2] Meaningful Sequence - Level A

**WCAG Requirement:**
- Reading order matches meaningful sequence

**Automation Strategy:** 60%
- ✅ **Automated:** Compare hierarchy order vs. visual order
- ⚠️ **Manual:** Verify sequence makes logical sense

---

### Item 16: [1.3.3] Sensory Characteristics - Level A

**WCAG Requirement:**
- Instructions don't rely solely on sensory characteristics

**Automation Strategy:** 50%
- ✅ **Automated:** NLP analysis of instruction text for sensory-only terms
- ⚠️ **Manual:** Verify instructions are comprehensible

```javascript
export async function analyzeSensoryCharacteristics(projectPath) {
  const sensoryTerms = [
    'click the green button', 'press the round button',
    'select the item on the left', 'tap the circle',
    'listen for the beep'
  ];
  
  // Scan all text for sensory-only instructions
  // Flag potential issues
}
```

---

### Item 17: [1.4.2] Audio Control - Level A

**WCAG Requirement:**
- Audio > 3 seconds has pause/stop/volume control

**Automation Strategy:** 70%
- ✅ **Automated:** Detect AudioSource components, check for control UI
- ⚠️ **Manual:** Test actual audio duration and control functionality

---

### Item 18: [2.1.1] Keyboard - Level A (Partial Detection)

**WCAG Requirement:**
- All functionality operable through keyboard

**Automation Strategy:** 75%
- ✅ **Automated:** Detect keyboard input handlers (already implemented)
- ⚠️ **Manual:** Test actual keyboard operability

---

### Item 19: [2.1.2] No Keyboard Trap - Level A

**WCAG Requirement:**
- Keyboard focus can be moved away from all components

**Automation Strategy:** 50%
- ✅ **Automated:** Analyze focus navigation logic
- ⚠️ **Manual:** Runtime testing for keyboard traps

---

### Item 20: [2.1.4] Character Key Shortcuts - Level A

**WCAG Requirement:**
- Single-character shortcuts can be turned off/remapped

**Automation Strategy:** 65%
- ✅ **Automated:** Detect single-key input handlers
- ⚠️ **Manual:** Verify shortcuts can be disabled

---

### Item 21: [2.2.1] Timing Adjustable - Level A

**WCAG Requirement:**
- Time limits can be turned off, adjusted, or extended

**Automation Strategy:** 55%
- ✅ **Automated:** Detect timer/countdown logic in code
- ⚠️ **Manual:** Verify adjustment controls exist

```javascript
export async function analyzeTimingAdjustable(projectPath) {
  // Search for: Time.deltaTime, Invoke(), StartCoroutine() with delays
  // Check if timer UI has controls
}
```

---

### Item 22: [2.2.2] Pause, Stop, Hide - Level A

**WCAG Requirement:**
- Users can pause/stop/hide auto-updating content

**Automation Strategy:** 60%
- ✅ **Automated:** Detect animations, particle systems, auto-scrolling
- ⚠️ **Manual:** Verify pause controls

---

### Item 23: [2.4.1] Bypass Blocks - Level A

**WCAG Requirement:**
- Skip navigation mechanisms available

**Automation Strategy:** 70%
- ✅ **Automated:** Detect repeated navigation UI across scenes
- ⚠️ **Manual:** Verify skip links/shortcuts exist

---

### Item 24: [2.4.4] Link Purpose (In Context) - Level A

**WCAG Requirement:**
- Purpose of links determinable from link text or context

**Automation Strategy:** 50%
- ✅ **Automated:** NLP analysis of button/link text
- ⚠️ **Manual:** Verify link purpose is clear

```javascript
export async function analyzeLinkPurpose(projectPath) {
  const vagueTerms = ['click here', 'read more', 'learn more', 'here', 'link'];
  // Flag buttons/links with vague text
}
```

---

### Item 25: [2.5.1] Pointer Gestures - Level A

**WCAG Requirement:**
- Multipoint/path-based gestures have single-pointer alternative

**Automation Strategy:** 60%
- ✅ **Automated:** Detect multi-touch input code
- ⚠️ **Manual:** Verify single-pointer alternatives

---

### Item 26: [2.5.2] Pointer Cancellation - Level A

**WCAG Requirement:**
- Functionality uses up-event, or can be aborted/undone

**Automation Strategy:** 65%
- ✅ **Automated:** Analyze pointer event handlers (OnPointerDown vs OnPointerUp)
- ⚠️ **Manual:** Test actual behavior

---

### Item 27: [2.5.3] Label in Name - Level A

**WCAG Requirement:**
- Accessible name includes visible text

**Automation Strategy:** 70%
- ✅ **Automated:** Compare AccessibilityNode.label with visible text
- ⚠️ **Manual:** Verify match

```javascript
export async function analyzeLabelInName(projectPath) {
  // For each button/label:
  // - Get visible text (TextMeshPro or UI.Text)
  // - Get AccessibilityNode.label
  // - Check if accessible name contains visible text
}
```

---

### Item 28: [3.1.1] Language of Page - Level A

**WCAG Requirement:**
- Default language programmatically determined

**Automation Strategy:** 40%
- ✅ **Automated:** Check for language metadata in scenes
- ⚠️ **Manual:** Verify language is correctly set

---

### Item 29: [3.2.1] On Focus - Level A

**WCAG Requirement:**
- Receiving focus doesn't initiate change of context

**Automation Strategy:** 55%
- ✅ **Automated:** Detect OnFocus event handlers that change scenes/UI
- ⚠️ **Manual:** Test actual behavior

---

### Item 30: [3.2.2] On Input - Level A

**WCAG Requirement:**
- Changing input doesn't auto-trigger context change

**Automation Strategy:** 60%
- ✅ **Automated:** Detect OnValueChanged handlers on input fields
- ⚠️ **Manual:** Verify no unexpected context changes

---


## 🟠 Low Automation Tier (8 Items)

**Target:** v3.5.0 - "Detection Only"
**Estimated Effort:** 2-3 weeks
**Automation Level:** 10-40%

These items can only be detected, not fully automated. Manual testing still required.

---

### Item 31: [1.2.2] Captions (Prerecorded) - Level A

**WCAG Requirement:**
- Captions provided for prerecorded audio in synchronized media

**Automation Strategy:** 30%
- ✅ **Automated:** Detect video/audio files, check for caption/subtitle files
- ❌ **Cannot Automate:** Caption quality, synchronization, accuracy

```javascript
export async function analyzeCaptions(projectPath) {
  const videos = await findFiles(projectPath, '**/*.{mp4,avi,mov}');

  for (const video of videos) {
    // Check for matching .srt, .vtt files
    const captionFile = findCaptionFile(video);

    if (!captionFile) {
      findings.push({
        wcagCriterion: '1.2.2',
        severity: 'critical',
        file: video,
        issue: 'No caption file found',
        recommendation: 'Add .srt or .vtt caption file'
      });
    }
  }
}
```

---

### Item 32: [1.2.3] Audio Description - Level A

**WCAG Requirement:**
- Audio description or text alternative for video

**Automation Strategy:** 25%
- ✅ **Automated:** Detect video files without audio description track
- ❌ **Cannot Automate:** Audio description quality

---

### Item 33: [1.4.12] Text Spacing - Level AA

**WCAG Requirement:**
- No loss of content when text spacing adjusted

**Automation Strategy:** 40%
- ✅ **Automated:** Test layout with CSS spacing adjustments
- ❌ **Cannot Automate:** Verify no content loss (requires human judgment)

---

### Item 34: [1.4.13] Content on Hover or Focus - Level AA

**WCAG Requirement:**
- Hover/focus content is dismissible, hoverable, persistent

**Automation Strategy:** 35%
- ✅ **Automated:** Detect tooltips/popovers, check for dismiss logic
- ❌ **Cannot Automate:** Test actual hover behavior

---

### Item 35: [2.4.5] Multiple Ways - Level AA

**WCAG Requirement:**
- Multiple ways to locate content

**Automation Strategy:** 40%
- ✅ **Automated:** Detect presence of search, menu, shortcuts
- ❌ **Cannot Automate:** Verify all content is findable via multiple paths

---

### Item 36: [2.4.11] Focus Not Obscured (Minimum) - Level AA

**WCAG Requirement:**
- Focused component not entirely hidden by author-created content

**Automation Strategy:** 35%
- ✅ **Automated:** Screenshot analysis of focus states, check for overlapping UI
- ❌ **Cannot Automate:** Test across all focus scenarios

---

### Item 37: [2.5.7] Dragging Movements - Level AA

**WCAG Requirement:**
- Functionality using dragging can be achieved without dragging

**Automation Strategy:** 30%
- ✅ **Automated:** Detect drag handlers, check for alternative input
- ❌ **Cannot Automate:** Test alternative methods work correctly

---

### Item 38: [3.3.1] Error Identification - Level A

**WCAG Requirement:**
- Input errors automatically detected and described

**Automation Strategy:** 35%
- ✅ **Automated:** Detect form validation code
- ❌ **Cannot Automate:** Verify error messages are clear and helpful

---

## 🔴 Very Low Automation - SKIP (4 Items)

**These remain manual-only. Do NOT attempt to automate.**

---

### Item 39: [3.3.2] Labels or Instructions - Level A

**Why Skip:** Requires human judgment on instruction clarity
**Manual Testing:** Required

---

### Item 40: [3.3.3] Error Suggestion - Level AA

**Why Skip:** Requires evaluating suggestion quality and relevance
**Manual Testing:** Required

---

### Item 41: [3.3.4] Error Prevention - Level AA

**Why Skip:** Requires testing confirmation dialogs and reversal mechanisms
**Manual Testing:** Required

---

### Item 42: [302.9] Limited Language, Cognitive, Learning Abilities

**Why Skip:** Requires human usability testing with diverse users
**Manual Testing:** Required with accessibility experts

---

## Implementation Roadmap

### Timeline Overview

| Release | Focus | Items Automated | Cumulative | Effort | Dates |
|---------|-------|----------------|------------|--------|-------|
| **v3.2.0** | Visual Analysis Enhancement | 6 items | 6/42 (14%) | 3-4 weeks | Jan 2026 |
| **v3.3.0** | Semantic Analysis | 6 items | 12/42 (29%) | 3-4 weeks | Feb 2026 |
| **v3.4.0** | Partial Automation | 18 items | 30/42 (71%) | 4-6 weeks | Apr 2026 |
| **v3.5.0** | Detection Only | 8 items | 38/42 (90%) | 2-3 weeks | May 2026 |
| **Final** | Manual Review Reduced | - | **90% automated** | - | - |

**Total Development Time:** 12-17 weeks (~3-4 months)

---

### Updated VPAT Format

After full automation implementation, VPAT reports will show automated analysis results alongside manual verification requirements.

---

### Success Metrics

**Before Automation:**
- Manual review items: 69 instances (42 unique criteria)
- Manual testing time per audit: 8-12 hours
- VPAT accuracy: 60% (many "manual review required" items)

**After Full Implementation (v3.5.0):**
- Automated items: 38 of 42 (90%)
- Manual review items: 4 (very low automation tier only)
- Manual testing time per audit: 1-2 hours
- VPAT accuracy: 95%+ (with automated findings)
- False positive rate: < 10%

**Impact:**
- **85% reduction in manual testing time** (12 hours → 2 hours)
- **90% of WCAG criteria automated**
- **Professional-grade VPATs** ready for procurement/legal use

---

## Appendix: All 42 Items by Automation Tier

### High Automation (12 items)
1. [1.4.3] Contrast (Minimum)
2. [1.4.11] Non-text Contrast
3. [1.4.1] Use of Color
4. [2.5.8] Target Size (Minimum)
5. [2.3.1] Three Flashes
6. [1.4.5] Images of Text
7. [2.4.2] Page Titled
8. [2.4.6] Headings and Labels
9. [3.2.3] Consistent Navigation
10. [3.2.4] Consistent Identification
11. [2.4.3] Focus Order
12. [1.4.4] Resize Text

### Medium Automation (18 items)
13. [1.1.1] Non-text Content
14. [1.3.1] Info and Relationships
15. [1.3.2] Meaningful Sequence
16. [1.3.3] Sensory Characteristics
17. [1.4.2] Audio Control
18. [2.1.1] Keyboard (partial)
19. [2.1.2] No Keyboard Trap
20. [2.1.4] Character Key Shortcuts
21. [2.2.1] Timing Adjustable
22. [2.2.2] Pause, Stop, Hide
23. [2.4.1] Bypass Blocks
24. [2.4.4] Link Purpose
25. [2.5.1] Pointer Gestures
26. [2.5.2] Pointer Cancellation
27. [2.5.3] Label in Name
28. [3.1.1] Language of Page
29. [3.2.1] On Focus
30. [3.2.2] On Input

### Low Automation (8 items)
31. [1.2.2] Captions (Prerecorded)
32. [1.2.3] Audio Description
33. [1.4.12] Text Spacing
34. [1.4.13] Content on Hover/Focus
35. [2.4.5] Multiple Ways
36. [2.4.11] Focus Not Obscured
37. [2.5.7] Dragging Movements
38. [3.3.1] Error Identification

### Very Low Automation - SKIP (4 items)
39. [3.3.2] Labels or Instructions
40. [3.3.3] Error Suggestion
41. [3.3.4] Error Prevention
42. [302.9] Limited Cognitive Abilities

**Total:** 42 items
**Automatable:** 38 items (90%)
**Manual Only:** 4 items (10%)
