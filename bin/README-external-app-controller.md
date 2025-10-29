# External Application Controller

Node.js module for external control of Unity zSpace applications without requiring Unity project modifications.

## Installation

Dependencies are already installed in the main project:
```bash
npm install active-win tesseract.js
```

## Quick Start

```javascript
import { ExternalAppController } from './external-app-controller.js';

const controller = new ExternalAppController({
  verbose: true,
  windowTitle: 'Career Explorer'
});

// Launch and control application
await controller.launchApplication('C:\\Program Files\\zSpace\\Career Explorer\\zSpaceCareerExplorer.exe');
await controller.captureWindow('./screenshot.png');
await controller.clickAt(640, 360);
const scene = await controller.detectScene();
await controller.closeApplication();
```

## API Reference

### Constructor

```javascript
new ExternalAppController(options)
```

**Options:**
- `verbose` (boolean) - Enable logging. Default: false
- `windowTitle` (string) - Window title to search for. Default: 'Career Explorer'

### Methods

#### `launchApplication(exePath)`
Launch the Unity application.

**Parameters:**
- `exePath` (string) - Full path to the .exe file

**Returns:** Promise<boolean> - True if launched successfully

**Example:**
```javascript
await controller.launchApplication('C:\\Program Files\\zSpace\\Career Explorer\\zSpaceCareerExplorer.exe');
```

#### `detectWindow()`
Detect the application window.

**Returns:** Promise<object|null> - Window information or null if not found

**Example:**
```javascript
const window = await controller.detectWindow();
// { title: 'Career Explorer', owner: { name: 'zSpace Career Explorer' }, bounds: {...} }
```

#### `captureWindow(outputPath, options)`
Capture screenshot of the entire screen.

**Parameters:**
- `outputPath` (string) - Path to save the screenshot
- `options` (object) - Optional screenshot options

**Returns:** Promise<string> - Path to saved screenshot

**Example:**
```javascript
await controller.captureWindow('./screenshots/scene1.png');
```

#### `clickAt(x, y, button)`
Simulate mouse click at coordinates.

**Parameters:**
- `x` (number) - X coordinate
- `y` (number) - Y coordinate
- `button` (string) - Mouse button: 'left', 'right', or 'middle'. Default: 'left'

**Returns:** Promise<void>

**Example:**
```javascript
await controller.clickAt(640, 360, 'left');
```

#### `detectScene(screenshotPath)`
Detect current scene using OCR.

**Parameters:**
- `screenshotPath` (string) - Optional path to screenshot. If not provided, captures new screenshot.

**Returns:** Promise<object> - Scene detection result

**Result Object:**
```javascript
{
  scene: 'LocationSelect',      // Detected scene name
  confidence: 85.5,              // OCR confidence (0-100)
  rawText: 'Full OCR text...',  // Complete OCR output
  timestamp: '2025-10-29T...'    // ISO timestamp
}
```

**Example:**
```javascript
const result = await controller.detectScene();
console.log(`Current scene: ${result.scene} (${result.confidence}% confidence)`);
```

**Scene Patterns:**
The method matches against these patterns:
- LocationSelect
- TaskSelect
- Task \d+ (e.g., "Task 1", "Task 2")
- Career Explorer
- Loading
- InitialLoading

#### `getWindowBounds()`
Get the application window bounds.

**Returns:** Promise<object> - Window bounds

**Result Object:**
```javascript
{
  x: 0,
  y: 0,
  width: 1536,
  height: 864
}
```

**Example:**
```javascript
const bounds = await controller.getWindowBounds();
const centerX = bounds.x + Math.floor(bounds.width / 2);
const centerY = bounds.y + Math.floor(bounds.height / 2);
```

#### `focusWindow()`
Bring the application window to the foreground.

**Returns:** Promise<void>

**Example:**
```javascript
await controller.focusWindow();
```

#### `closeApplication()`
Close the application gracefully.

**Returns:** Promise<void>

**Example:**
```javascript
await controller.closeApplication();
```

#### `isRunning()`
Check if application is running.

**Returns:** Promise<boolean> - True if application window is detected

**Example:**
```javascript
if (await controller.isRunning()) {
  console.log('Application is running');
}
```

#### `sleep(ms)`
Sleep for specified milliseconds.

**Parameters:**
- `ms` (number) - Milliseconds to sleep

**Returns:** Promise<void>

**Example:**
```javascript
await controller.sleep(2000); // Wait 2 seconds
```

## CLI Usage

Run the controller directly for testing:

```bash
node bin/external-app-controller.js
```

This will:
1. Launch Career Explorer
2. Wait 5 seconds for loading
3. Capture screenshot
4. Detect scene via OCR
5. Get window bounds
6. Test click at window center
7. Wait for Ctrl+C to close

## Technical Details

### PowerShell Integration
The controller uses PowerShell for Windows automation:
- **Screenshot:** System.Windows.Forms + System.Drawing
- **Mouse Control:** user32.dll mouse_event() API
- **Window Management:** wscript.shell

### OCR Implementation
- **Engine:** Tesseract.js v5+
- **Language:** English (pre-loaded)
- **Processing:** Full-screen text extraction
- **Pattern Matching:** Regex-based scene detection

### Window Detection
- **Library:** active-win
- **Method:** Searches for window by title substring
- **Update Rate:** 1 second polling when waiting

## Error Handling

All methods throw errors with descriptive messages:

```javascript
try {
  await controller.launchApplication('invalid.exe');
} catch (error) {
  console.error('Failed to launch:', error.message);
  // Output: Failed to launch application: Application not found: invalid.exe
}
```

## Performance Notes

- **PowerShell Overhead:** ~200-500ms per PowerShell command
- **OCR Processing:** ~2-5 seconds for full-screen text extraction
- **Window Detection:** <100ms when window exists
- **Screenshot Capture:** ~500ms including file write

## Limitations

1. **Full-Screen Capture Only:** Currently captures entire screen, not just application window
2. **Single Window:** Only tracks one application window at a time
3. **Windows Only:** PowerShell integration requires Windows OS
4. **OCR Accuracy:** Depends on UI text clarity and scene patterns

## Future Enhancements

- [ ] Window-specific screenshot capture (not full screen)
- [ ] Multiple window tracking
- [ ] Keyboard input simulation
- [ ] Enhanced scene pattern library
- [ ] Confidence threshold configuration
- [ ] Screenshot caching to avoid redundant captures

## Related Files

- `bin/external-app-controller.js` - Main implementation
- `PHASE2-COMPLETE.md` - Phase 2 completion summary
- `plan_1028.txt` - Full project plan

## Next Phase

This controller will be used in Phase 3 to:
- Navigate through all scenes using the navigation map
- Capture screenshots of each scene systematically
- Build a complete visual audit of the Career Explorer application

---

**Status:** ✅ Complete and tested
**Version:** 1.0.0
**Compatibility:** Windows 10/11, Node.js 14+
