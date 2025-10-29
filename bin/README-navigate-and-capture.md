# Navigation Automation - Career Explorer

**Part of Phase 3: Navigation Automation**

Automatically navigates through all scenes in Career Explorer and captures screenshots for accessibility auditing.

## Overview

The `navigate-and-capture.js` script combines:
- **Phase 1** navigation map parsing (navigation graph)
- **Phase 2** external application controller (screenshot capture, mouse clicks, OCR)
- **Phase 3** BFS pathfinding and automated navigation

## Features

✅ **Automatic Scene Detection**
- Uses OCR (Tesseract.js) to identify current scene
- Matches scene names from navigation map
- Handles scene name variations and patterns

✅ **Intelligent Navigation**
- BFS traversal to visit all reachable scenes
- Predefined click regions for Career Explorer UI
- Retry logic for failed navigation attempts (3 retries by default)

✅ **Screenshot Capture**
- Captures screenshot of each visited scene
- Organizes screenshots in output directory
- Includes metadata for each capture

✅ **Robust Error Handling**
- Gracefully handles navigation failures
- Attempts to return to hub (LocationSelect) from dead ends
- Logs all navigation attempts and failures

✅ **Comprehensive Reporting**
- Generates navigation-report.json with:
  - Summary statistics (completion rate, scenes visited, etc.)
  - List of all visited scenes
  - Screenshot metadata
  - Failed navigation attempts
  - Full navigation log

## Usage

### Basic Usage

```bash
cd C:\Users\Jill\OneDrive\Documents\GitHub\accessibility-standards-unity

node bin/navigate-and-capture.js \
  --navigation-map "C:\Users\Jill\OneDrive\Documents\GitHub\apps.career-explorer\AccessibilityAudit\navigation-map.json" \
  --application "C:\Program Files\zSpace\Career Explorer\zSpaceCareerExplorer.exe"
```

### With Custom Output Directory

```bash
node bin/navigate-and-capture.js \
  --navigation-map "C:\Users\Jill\OneDrive\Documents\GitHub\apps.career-explorer\AccessibilityAudit\navigation-map.json" \
  --application "C:\Program Files\zSpace\Career Explorer\zSpaceCareerExplorer.exe" \
  --output-dir "C:\Users\Jill\OneDrive\Documents\GitHub\apps.career-explorer\AccessibilityAudit\screenshots" \
  --verbose
```

### Command Line Options

| Option | Required | Description |
|--------|----------|-------------|
| `--navigation-map <path>` | Yes | Path to navigation-map.json from Phase 1 |
| `--application <path>` | Yes | Full path to Career Explorer .exe |
| `--output-dir <path>` | No | Output directory for screenshots (default: same dir as navigation map) |
| `--verbose` | No | Enable detailed logging |
| `--help` | No | Show help message |

## How It Works

### 1. Load Navigation Map
```javascript
await loadNavigationMap(mapPath)
// Loads navigation-map.json
// Builds navigation graph (adjacency list)
```

### 2. Launch Application
```javascript
await controller.launchApplication(exePath)
// Launches Career Explorer
// Waits for window detection (max 30 seconds)
```

### 3. Initialize OCR
```javascript
await initializeOCR()
// Initializes Tesseract.js worker
// Used for scene detection throughout navigation
```

### 4. Detect Starting Scene
```javascript
const startScene = await detectCurrentScene()
// Captures screenshot
// Runs OCR to extract text
// Matches text against known scene names
```

### 5. BFS Traversal
```javascript
await traverseAllScenes(startScene)
// Uses BFS to visit all reachable scenes
// For each scene:
//   - Detect current scene
//   - Capture screenshot
//   - Get navigation buttons from map
//   - Click to navigate to unvisited neighbors
//   - Handle dead ends (return to hub)
```

### 6. Generate Report
```javascript
await generateReport()
// Creates navigation-report.json
// Includes summary, screenshots, failures, logs
```

## Navigation Strategy

### Hub-and-Spoke Pattern

Career Explorer uses a hub-and-spoke navigation model:

```
InitialLoading → LocationSelect (Hub)
                      ↓
        ┌─────────────┼─────────────┐
        ↓             ↓             ↓
  HealthcareCenter  Hotel   InnovationHub
        ↓             ↓             ↓
   SustainableFarm   VehicleServiceCenter
```

### Click Regions

Since navigation buttons don't have position data in the navigation map, the script uses predefined click regions (percentage-based):

```javascript
clickRegions = {
  center: { x: 0.5, y: 0.5 },           // Center of window
  bottomCenter: { x: 0.5, y: 0.8 },     // Bottom center (common for "continue")
  backButton: { x: 0.1, y: 0.9 },       // Bottom left (common for "back")
  locationButtons: [                     // Multiple positions for location selection
    { x: 0.3, y: 0.5, label: 'left' },
    { x: 0.5, y: 0.5, label: 'center' },
    { x: 0.7, y: 0.5, label: 'right' },
    { x: 0.3, y: 0.7, label: 'bottom-left' },
    { x: 0.7, y: 0.7, label: 'bottom-right' }
  ]
}
```

### Scene Detection

OCR-based scene detection matches text patterns:

```javascript
// Direct name match
/LocationSelect/i

// Spaced name match (e.g., "Location Select")
/Location\s*Select/i

// Special patterns
/loading/i → "InitialLoading"
/career.*explorer/i → "LocationSelect"
```

### Retry Logic

Each navigation attempt includes retry logic:

```javascript
maxRetries = 3
sceneWaitTime = 3000ms (3 seconds)

For each navigation:
  1. Click at predefined region
  2. Wait 3 seconds for scene transition
  3. Detect new scene via OCR
  4. If target not reached, retry with different click region
  5. If all retries fail, log as failed navigation
```

## Output

### Directory Structure

```
AccessibilityAudit/
└── screenshots/
    ├── InitialLoading.png
    ├── LocationSelect.png
    ├── HealthcareCenter.png
    ├── Hotel.png
    ├── InnovationHub.png
    ├── SustainableFarm.png
    ├── VehicleServiceCenter.png
    ├── WallFrameInstallation.png
    ├── WeldingRepair.png
    ├── AirFilter.png
    ├── RefrigeratorRepair.png
    ├── RoboticArm.png
    ├── Appendectomy.png
    └── navigation-report.json
```

### navigation-report.json

```json
{
  "summary": {
    "totalScenes": 13,
    "visitedScenes": 13,
    "screenshotsCaptured": 13,
    "failedNavigations": 0,
    "completionRate": "100.0%"
  },
  "visitedScenes": [
    "InitialLoading",
    "LocationSelect",
    "HealthcareCenter",
    ...
  ],
  "screenshots": [
    {
      "scene": "InitialLoading",
      "filename": "InitialLoading.png",
      "path": "AccessibilityAudit/screenshots/InitialLoading.png",
      "timestamp": "2025-10-29T12:00:00.000Z"
    },
    ...
  ],
  "failedNavigations": [],
  "navigationLog": [
    {
      "timestamp": "2025-10-29T12:00:00.000Z",
      "level": "info",
      "message": "Loading navigation map..."
    },
    ...
  ],
  "timestamp": "2025-10-29T12:05:00.000Z"
}
```

## Troubleshooting

### Issue: Scene detection fails (detects "Unknown")

**Solution:**
- Increase `sceneWaitTime` to allow more time for scene transitions
- Check OCR quality by examining temp screenshots
- Verify scene names in navigation map match on-screen text

### Issue: Navigation gets stuck at a scene

**Solution:**
- Check that click regions are appropriate for Career Explorer UI
- Try adjusting click region percentages
- Enable `--verbose` to see detailed navigation logs

### Issue: Screenshots are blank or corrupted

**Solution:**
- Ensure Career Explorer window is focused and not minimized
- Check that PowerShell execution policy allows scripts
- Verify write permissions to output directory

### Issue: Application doesn't launch

**Solution:**
- Verify .exe path is correct
- Check that zSpace Career Explorer is installed
- Ensure no other instances are running

## Dependencies

Required npm packages:
- `tesseract.js` - OCR for scene detection
- `active-win` - Window detection
- Built-in Node.js modules: `fs/promises`, `path`, `child_process`

## Performance

Expected completion time:
- **13 scenes** × **3 seconds per transition** = ~40-60 seconds
- Plus OCR processing time: ~2 seconds per scene
- Total: **~2-3 minutes** for full traversal

## Limitations

1. **No Position Data**: Navigation buttons don't have position info in map, so we use predefined click regions
2. **OCR Accuracy**: Scene detection depends on OCR quality and on-screen text visibility
3. **Timing Sensitive**: Scene transitions require fixed wait times (may need adjustment)
4. **Hub-Dependent**: Assumes LocationSelect is accessible hub for all locations

## Future Enhancements

Potential improvements:
- [ ] Image-based navigation button detection (computer vision)
- [ ] Adaptive wait times based on scene complexity
- [ ] Support for keyboard navigation shortcuts
- [ ] Parallel navigation for independent scene branches
- [ ] Visual diffing to detect scene changes
- [ ] Integration with Phase 4 audit pipeline

## Related Files

- **Phase 1**: `bin/parse-navigation-map.js` - Navigation map generation
- **Phase 2**: `bin/external-app-controller.js` - External app control
- **Phase 3**: `bin/navigate-and-capture.js` - This script
- **Navigation Map**: `apps.career-explorer/AccessibilityAudit/navigation-map.json`
- **Full Plan**: `plan_1028.txt` (lines 1069-1120)

## Example Output

```
╔═══════════════════════════════════════════════════════════╗
║   Navigation Automation - Career Explorer                ║
╚═══════════════════════════════════════════════════════════╝

📱 Launching Career Explorer...
⏳ Waiting for application to initialize...
📍 Starting scene: InitialLoading

🗺️  Starting navigation traversal...

ℹ️ Visiting scene: InitialLoading (path: InitialLoading)
📸 Capturing screenshot: InitialLoading.png
ℹ️ InitialLoading has no navigation buttons (dead end)

ℹ️ Visiting scene: LocationSelect (path: LocationSelect)
📸 Capturing screenshot: LocationSelect.png
ℹ️ Attempting to navigate to: HealthcareCenter (attempt 1/3)
✅ Successfully navigated to HealthcareCenter via left

...

╔═══════════════════════════════════════════════════════════╗
║   Navigation Complete                                     ║
╚═══════════════════════════════════════════════════════════╝

✅ Visited scenes: 13 / 13
📸 Screenshots captured: 13
❌ Failed navigations: 0
📈 Completion rate: 100.0%

📁 Output directory: AccessibilityAudit/screenshots
📄 Report: AccessibilityAudit/screenshots/navigation-report.json

Press Ctrl+C to close the application and exit...
```

## Success Criteria

✅ Load and parse navigation-map.json
✅ Detect current scene automatically
✅ Navigate through all reachable scenes
✅ Capture screenshot of each scene
✅ Handle navigation failures gracefully
✅ Generate navigation report

All Phase 3 success criteria met!
