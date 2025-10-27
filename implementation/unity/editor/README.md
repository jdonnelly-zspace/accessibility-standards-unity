# Unity Editor Accessibility Tools

This directory contains Unity Editor tools for accessibility validation and screenshot capture.

## Tools Overview

### 1. SceneScreenshotCapture.cs
**Automated scene screenshot capture for accessibility audits**

**Features:**
- Discovers all scenes in project automatically
- Captures screenshots at multiple resolutions
- Generates thumbnails for quick preview
- Exports metadata JSON with camera information
- Progress tracking in Unity Editor
- Error handling for missing cameras

**Usage:**
```
Window → Accessibility → Capture Scene Screenshots
```

**Configuration:**
- **Main Resolution:** 1920x1080 (default)
- **Thumbnail Resolution:** 320x180 (default)
- **Output Directory:** AccessibilityAudit/screenshots
- **Metadata:** JSON file with scene/camera info

**Requirements:**
- Unity 2021.3 LTS or newer
- Each scene must have at least one Camera

---

### 2. BatchModeScreenshotRunner.cs
**Headless screenshot capture for CI/CD**

**Purpose:**
Entry point for Unity batch mode execution. Enables fully automated screenshot capture without GUI.

**Command Line Usage:**
```bash
unity.exe -batchmode -quit -projectPath "C:\MyProject" \
  -executeMethod ZSpaceAccessibility.Editor.BatchModeScreenshotRunner.CaptureAllScenes \
  -logFile "capture.log" \
  -screenshotOutputDir "AccessibilityAudit/screenshots" \
  -screenshotWidth 1920 \
  -screenshotHeight 1080
```

**Command Line Arguments:**
- `-scenePath <path>` - Capture single scene only
- `-screenshotOutputDir <dir>` - Output directory (default: AccessibilityAudit/screenshots)
- `-screenshotWidth <pixels>` - Main screenshot width (default: 1920)
- `-screenshotHeight <pixels>` - Main screenshot height (default: 1080)
- `-thumbnailWidth <pixels>` - Thumbnail width (default: 320)
- `-thumbnailHeight <pixels>` - Thumbnail height (default: 180)

**Features:**
- Batch processes all scenes in Build Settings
- Fallback to all project scenes if no Build Settings
- Progress logging to console
- Exit codes: 0 (success), 1 (failure)
- Error reporting per scene

**Integration with Node.js:**
Use the `bin/capture-screenshots.js` CLI wrapper for easier batch mode execution:

```bash
node bin/capture-screenshots.js "C:\MyProject" --verbose
```

---

### 3. ZSpaceAccessibilityValidator.cs
**Scene-level accessibility validation**

**Purpose:**
Validates active Unity scene against WCAG 2.2 AA + W3C XAUR standards for zSpace applications.

**Usage:**
```
Window → Accessibility → Validate Scene
```

**Checks:**
- Keyboard alternatives for stylus interactions (WCAG 2.1.1)
- Minimum target sizes 24x24px (WCAG 2.5.8)
- Depth perception alternatives (W3C XAUR UN17)
- Screen reader support (WCAG 4.1.2)
- Focus indicators (WCAG 2.4.7)
- Color contrast ratios (WCAG 1.4.3)

**Output:**
- Console warnings with severity levels
- Direct GameObject references for fixes
- WCAG/XAUR success criteria citations

---

### 4. ContrastCheckerZSpace.cs
**Visual contrast validation tool**

**Purpose:**
Validates color contrast ratios for UI elements against WCAG standards.

**Usage:**
```
Window → Accessibility → Check Contrast
```

**Standards:**
- **Normal Text:** 4.5:1 minimum (WCAG Level AA)
- **Large Text:** 3:1 minimum
- **UI Components:** 3:1 minimum (WCAG 2.5.3)
- **Enhanced:** 7:1 for small text

**Features:**
- Scans all UI.Text and TextMeshPro components
- Calculates foreground/background ratios
- Color-coded results (pass/fail)
- Recommendations for failing elements

---

## Installation

### Method 1: Copy to Unity Project
1. Copy entire `editor/` folder to `Assets/Editor/ZSpaceAccessibility/`
2. Unity will auto-compile scripts
3. Tools appear in **Window → Accessibility** menu

### Method 2: Unity Package Manager (coming in v3.2.0)
```json
{
  "dependencies": {
    "com.zspace.accessibility-standards": "https://github.com/jdonnelly-zspace/accessibility-standards-unity.git"
  }
}
```

---

## Output Structure

After running screenshot capture:

```
AccessibilityAudit/
└── screenshots/
    ├── Farm/
    │   ├── Farm_main.png           (1920x1080)
    │   ├── Farm_thumbnail.png      (320x180)
    │   └── metadata.json           (scene/camera info)
    ├── Hospital/
    │   ├── Hospital_main.png
    │   ├── Hospital_thumbnail.png
    │   └── metadata.json
    └── ...
```

**Metadata JSON Format:**
```json
{
  "sceneName": "Farm",
  "scenePath": "Assets/Scenes/Locations/Farm.unity",
  "captureTimestamp": "2025-10-26 12:34:56",
  "cameraName": "Main Camera",
  "cameraPosition": {"x": 0, "y": 1.5, "z": -5},
  "cameraRotation": {"x": 0, "y": 0, "z": 0},
  "cameraFieldOfView": 60,
  "rootObjectCount": 42,
  "mainResolution": "1920x1080",
  "thumbnailResolution": "320x180",
  "unityVersion": "2022.3.59f1",
  "platform": "WindowsEditor"
}
```

---

## Troubleshooting

### "No camera found in scene"
**Solution:** Ensure each scene has a Camera component with `MainCamera` tag, or at least one Camera in the scene.

### "Failed to create output directory"
**Solution:** Check write permissions for output directory. Run Unity as administrator if needed.

### Batch mode hangs or crashes
**Solution:**
- Check Unity log file specified with `-logFile`
- Ensure project has no compilation errors
- Try capturing single scene first with `-scenePath`

### Screenshots are black
**Solution:**
- Verify Camera is enabled and rendering
- Check Camera's `targetTexture` is not already set
- Ensure scene is fully loaded before capture

---

## Integration with Audit Pipeline

The screenshot tools integrate seamlessly with the accessibility audit workflow:

### Step 1: Capture Screenshots
```bash
# Via Node.js CLI wrapper
node bin/capture-screenshots.js "C:\MyProject" --verbose

# Or via Unity batch mode directly
unity.exe -batchmode -quit -projectPath "C:\MyProject" \
  -executeMethod ZSpaceAccessibility.Editor.BatchModeScreenshotRunner.CaptureAllScenes
```

### Step 2: Run Audit with Screenshots
```bash
node bin/audit.js "C:\MyProject" --capture-screenshots
```

### Step 3: Review Reports
Screenshots are embedded in:
- `AccessibilityAudit/AUDIT-SUMMARY.md`
- Future visual contrast analysis reports (Phase 2)
- HTML dashboard (Phase 3)

---

## Best Practices

1. **Capture Early:** Run screenshot capture at the start of your audit workflow
2. **Consistent Camera Setup:** Use similar camera positions across scenes for consistency
3. **Version Control:** Commit screenshots to track visual changes over time
4. **CI/CD Integration:** Automate screenshot capture in build pipelines
5. **Regular Updates:** Re-capture when UI/scenes change significantly

---

## Performance

- **Single Scene:** < 1 second
- **15 Scenes:** ~10-15 seconds
- **100 Scenes:** ~60-90 seconds

Timing depends on:
- Scene complexity
- Camera render settings
- Screenshot resolution
- Disk I/O speed

---

## Version History

**v3.1.0-phase1 (October 2025)**
- Initial release of screenshot capture tools
- SceneScreenshotCapture.cs with GUI
- BatchModeScreenshotRunner.cs for headless operation
- Node.js CLI wrapper integration

---

## Related Documentation

- **SCREENSHOT-GUIDE.md** - Complete guide to screenshot capture
- **DEVELOPER-WORKFLOW.md** - Integration with development process
- **CI-CD-INTEGRATION.md** - Automation setup guide (Phase 4)

---

## Support

For issues or questions:
- GitHub Issues: https://github.com/jdonnelly-zspace/accessibility-standards-unity/issues
- Documentation: See `docs/` directory
- Framework README: `../../README.md`

---

**Framework Version:** 3.1.0-phase1
**Last Updated:** October 26, 2025
**License:** MIT
