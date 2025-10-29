#!/usr/bin/env node

/**
 * External Application Controller for Career Explorer
 *
 * Controls Unity zSpace applications via external automation:
 * - Launch application (.exe)
 * - Capture screenshots
 * - Simulate mouse clicks
 * - Detect current scene via OCR
 *
 * Part of Phase 2: External Application Controller
 * See: plan_1028.txt (lines 1037-1067)
 */

import { spawn, exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import activeWin from 'active-win';
import Tesseract from 'tesseract.js';

const execAsync = promisify(exec);

/**
 * External Application Controller
 * Manages launching and controlling Unity zSpace applications
 */
export class ExternalAppController {
  constructor(options = {}) {
    this.appProcess = null;
    this.appPath = null;
    this.windowTitle = options.windowTitle || 'Career Explorer';
    this.windowHandle = null;
    this.tesseractWorker = null;
    this.verbose = options.verbose || false;
  }

  /**
   * Log message if verbose mode is enabled
   */
  log(message) {
    if (this.verbose) {
      console.log(`[ExternalAppController] ${message}`);
    }
  }

  /**
   * Launch the application
   * @param {string} exePath - Full path to the .exe file
   * @returns {Promise<boolean>} - True if launched successfully
   */
  async launchApplication(exePath) {
    try {
      this.log(`Launching application: ${exePath}`);

      // Verify the .exe exists
      try {
        await fs.access(exePath);
      } catch (error) {
        throw new Error(`Application not found: ${exePath}`);
      }

      this.appPath = exePath;

      // Launch the application using spawn
      this.appProcess = spawn(exePath, [], {
        detached: true,
        stdio: 'ignore'
      });

      // Don't wait for the process to exit
      this.appProcess.unref();

      this.log(`Application launched with PID: ${this.appProcess.pid}`);

      // Wait for the window to appear (max 30 seconds)
      const maxWaitTime = 30000; // 30 seconds
      const checkInterval = 1000; // 1 second
      let elapsed = 0;

      while (elapsed < maxWaitTime) {
        await this.sleep(checkInterval);
        elapsed += checkInterval;

        const windowInfo = await this.detectWindow();
        if (windowInfo) {
          this.windowHandle = windowInfo;
          this.log(`Window detected: ${windowInfo.title} (Owner: ${windowInfo.owner.name})`);
          return true;
        }

        this.log(`Waiting for window... (${elapsed / 1000}s)`);
      }

      throw new Error('Application window not detected within timeout period');
    } catch (error) {
      throw new Error(`Failed to launch application: ${error.message}`);
    }
  }

  /**
   * Detect the application window
   * @returns {Promise<object|null>} - Window information or null if not found
   */
  async detectWindow() {
    try {
      const window = await activeWin();

      if (window && window.title.includes(this.windowTitle)) {
        return window;
      }

      return null;
    } catch (error) {
      this.log(`Error detecting window: ${error.message}`);
      return null;
    }
  }

  /**
   * Capture screenshot of the application window
   * @param {string} outputPath - Path to save the screenshot
   * @param {object} options - Screenshot options
   * @returns {Promise<string>} - Path to the saved screenshot
   */
  async captureWindow(outputPath, options = {}) {
    try {
      this.log(`Capturing screenshot to: ${outputPath}`);

      // Ensure the output directory exists
      const outputDir = path.dirname(outputPath);
      await fs.mkdir(outputDir, { recursive: true });

      // Convert path to Windows format for PowerShell
      const winPath = outputPath.replace(/\//g, '\\');

      // Create PowerShell script
      const psScript = `Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# Get screen bounds
$bounds = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds

# Create bitmap
$bitmap = New-Object System.Drawing.Bitmap $bounds.Width, $bounds.Height

# Create graphics object
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)

# Capture screen
$graphics.CopyFromScreen($bounds.Location, [System.Drawing.Point]::Empty, $bounds.Size)

# Save to file
$bitmap.Save("${winPath}", [System.Drawing.Imaging.ImageFormat]::Png)

# Cleanup
$graphics.Dispose()
$bitmap.Dispose()
`;

      // Save script to temporary file
      const tempDir = path.join(process.cwd(), 'temp');
      await fs.mkdir(tempDir, { recursive: true });
      const scriptPath = path.join(tempDir, `screenshot-${Date.now()}.ps1`);
      await fs.writeFile(scriptPath, psScript);

      // Execute PowerShell script from file
      await execAsync(`powershell -ExecutionPolicy Bypass -File "${scriptPath}"`);

      // Clean up script file
      await fs.unlink(scriptPath);

      // Wait a moment to ensure file is fully written
      await this.sleep(500);

      // Verify file was created
      await fs.access(outputPath);

      this.log(`Screenshot saved: ${outputPath}`);
      return outputPath;
    } catch (error) {
      throw new Error(`Failed to capture screenshot: ${error.message}`);
    }
  }

  /**
   * Click at specific coordinates
   * Uses PowerShell for Windows mouse automation
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {string} button - Mouse button ('left', 'right', 'middle')
   * @returns {Promise<void>}
   */
  async clickAt(x, y, button = 'left') {
    try {
      this.log(`Clicking at (${x}, ${y}) with ${button} button`);

      // PowerShell script to simulate mouse click
      const psScript = `
        Add-Type -AssemblyName System.Windows.Forms
        Add-Type -AssemblyName System.Drawing

        # Move mouse to position
        [System.Windows.Forms.Cursor]::Position = New-Object System.Drawing.Point(${x}, ${y})
        Start-Sleep -Milliseconds 100

        # Simulate mouse down and up
        $signature = @'
        [DllImport("user32.dll", CharSet = CharSet.Auto, CallingConvention = CallingConvention.StdCall)]
        public static extern void mouse_event(long dwFlags, long dx, long dy, long cButtons, long dwExtraInfo);
'@

        $SendMouseClick = Add-Type -memberDefinition $signature -name "Win32MouseEventNew" -namespace Win32Functions -passThru

        # Mouse button flags
        $MOUSEEVENTF_LEFTDOWN = 0x00000002
        $MOUSEEVENTF_LEFTUP = 0x00000004
        $MOUSEEVENTF_RIGHTDOWN = 0x00000008
        $MOUSEEVENTF_RIGHTUP = 0x00000010
        $MOUSEEVENTF_MIDDLEDOWN = 0x00000020
        $MOUSEEVENTF_MIDDLEUP = 0x00000040

        ${button === 'left' ? `
        $SendMouseClick::mouse_event($MOUSEEVENTF_LEFTDOWN, 0, 0, 0, 0)
        Start-Sleep -Milliseconds 50
        $SendMouseClick::mouse_event($MOUSEEVENTF_LEFTUP, 0, 0, 0, 0)
        ` : button === 'right' ? `
        $SendMouseClick::mouse_event($MOUSEEVENTF_RIGHTDOWN, 0, 0, 0, 0)
        Start-Sleep -Milliseconds 50
        $SendMouseClick::mouse_event($MOUSEEVENTF_RIGHTUP, 0, 0, 0, 0)
        ` : `
        $SendMouseClick::mouse_event($MOUSEEVENTF_MIDDLEDOWN, 0, 0, 0, 0)
        Start-Sleep -Milliseconds 50
        $SendMouseClick::mouse_event($MOUSEEVENTF_MIDDLEUP, 0, 0, 0, 0)
        `}
      `;

      // Execute PowerShell script
      await execAsync(`powershell -Command "${psScript.replace(/"/g, '\\"')}"`);

      this.log(`Click executed successfully`);
    } catch (error) {
      throw new Error(`Failed to click at (${x}, ${y}): ${error.message}`);
    }
  }

  /**
   * Detect current scene using OCR
   * @param {string} screenshotPath - Optional path to screenshot (will capture if not provided)
   * @returns {Promise<object>} - Detected scene information
   */
  async detectScene(screenshotPath = null) {
    try {
      this.log('Detecting scene via OCR...');

      // Capture screenshot if not provided
      let imagePath = screenshotPath;
      if (!imagePath) {
        const tempDir = path.join(process.cwd(), 'temp');
        await fs.mkdir(tempDir, { recursive: true });
        imagePath = path.join(tempDir, `scene-detect-${Date.now()}.png`);
        await this.captureWindow(imagePath);
      }

      // Initialize Tesseract worker if needed
      if (!this.tesseractWorker) {
        this.log('Initializing Tesseract OCR...');
        this.tesseractWorker = await Tesseract.createWorker('eng');
      }

      // Perform OCR
      this.log('Running OCR on screenshot...');
      const { data } = await this.tesseractWorker.recognize(imagePath);

      // Extract text
      const text = data.text;
      this.log(`OCR detected text: ${text.substring(0, 100)}...`);

      // Parse scene name from OCR text
      // Look for common scene patterns in Career Explorer
      const scenePatterns = [
        /LocationSelect/i,
        /TaskSelect/i,
        /Task\s*(\d+)/i,
        /Career\s*Explorer/i,
        /Loading/i,
        /InitialLoading/i
      ];

      let detectedScene = 'Unknown';
      let confidence = 0;

      for (const pattern of scenePatterns) {
        const match = text.match(pattern);
        if (match) {
          detectedScene = match[0];
          confidence = data.confidence;
          break;
        }
      }

      const result = {
        scene: detectedScene,
        confidence: confidence,
        rawText: text,
        timestamp: new Date().toISOString()
      };

      this.log(`Scene detected: ${detectedScene} (confidence: ${confidence}%)`);
      return result;
    } catch (error) {
      throw new Error(`Failed to detect scene: ${error.message}`);
    }
  }

  /**
   * Get the application window bounds
   * @returns {Promise<object>} - Window bounds {x, y, width, height}
   */
  async getWindowBounds() {
    try {
      const windowInfo = await this.detectWindow();
      if (!windowInfo) {
        throw new Error('Application window not found');
      }

      return windowInfo.bounds;
    } catch (error) {
      throw new Error(`Failed to get window bounds: ${error.message}`);
    }
  }

  /**
   * Focus the application window
   * @returns {Promise<void>}
   */
  async focusWindow() {
    try {
      this.log('Focusing application window...');

      const psScript = `
        Add-Type -AssemblyName System.Windows.Forms
        $wshell = New-Object -ComObject wscript.shell
        $wshell.AppActivate("${this.windowTitle}")
      `;

      await execAsync(`powershell -Command "${psScript.replace(/"/g, '\\"')}"`);

      this.log('Window focused');
    } catch (error) {
      throw new Error(`Failed to focus window: ${error.message}`);
    }
  }

  /**
   * Close the application
   * @returns {Promise<void>}
   */
  async closeApplication() {
    try {
      this.log('Closing application...');

      if (this.appProcess && !this.appProcess.killed) {
        this.appProcess.kill();
      }

      // Also try to close via window title
      const psScript = `
        $process = Get-Process | Where-Object {$_.MainWindowTitle -like "*${this.windowTitle}*"}
        if ($process) {
          $process | Stop-Process -Force
        }
      `;

      await execAsync(`powershell -Command "${psScript.replace(/"/g, '\\"')}"`);

      // Cleanup Tesseract worker
      if (this.tesseractWorker) {
        await this.tesseractWorker.terminate();
        this.tesseractWorker = null;
      }

      this.log('Application closed');
    } catch (error) {
      this.log(`Error closing application: ${error.message}`);
    }
  }

  /**
   * Sleep for specified milliseconds
   * @param {number} ms - Milliseconds to sleep
   * @returns {Promise<void>}
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Check if application is running
   * @returns {Promise<boolean>}
   */
  async isRunning() {
    const windowInfo = await this.detectWindow();
    return windowInfo !== null;
  }
}

// CLI interface
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  const controller = new ExternalAppController({ verbose: true });

  // Example usage
  console.log('External Application Controller - Career Explorer');
  console.log('='.repeat(50));

  const exePath = 'C:\\Program Files\\zSpace\\Career Explorer\\zSpaceCareerExplorer.exe';

  try {
    console.log('\n1. Launching application...');
    await controller.launchApplication(exePath);

    console.log('\n2. Waiting 5 seconds for app to fully load...');
    await controller.sleep(5000);

    console.log('\n3. Capturing screenshot...');
    const screenshotPath = path.join(process.cwd(), 'test-screenshot.png');
    await controller.captureWindow(screenshotPath);

    console.log('\n4. Detecting scene...');
    const scene = await controller.detectScene(screenshotPath);
    console.log('Scene:', scene);

    console.log('\n5. Getting window bounds...');
    const bounds = await controller.getWindowBounds();
    console.log('Bounds:', bounds);

    console.log('\n6. Testing click at center of window...');
    const centerX = bounds.x + Math.floor(bounds.width / 2);
    const centerY = bounds.y + Math.floor(bounds.height / 2);
    await controller.clickAt(centerX, centerY);

    console.log('\nTest completed successfully!');
    console.log('\nPress Ctrl+C to close the application and exit...');

    // Keep the script running
    process.on('SIGINT', async () => {
      console.log('\n\nClosing application...');
      await controller.closeApplication();
      process.exit(0);
    });

  } catch (error) {
    console.error('Error:', error.message);
    await controller.closeApplication();
    process.exit(1);
  }
}

export default ExternalAppController;
