#!/usr/bin/env node

/**
 * Navigation Automation for Career Explorer
 *
 * Automatically navigates through all scenes and captures screenshots:
 * - Loads navigation map from Phase 1
 * - Uses external controller from Phase 2
 * - Implements BFS/DFS pathfinding
 * - Handles navigation failures gracefully
 * - Generates comprehensive navigation report
 *
 * Part of Phase 3: Navigation Automation
 * See: plan_1028.txt (lines 1069-1120)
 */

import { ExternalAppController } from './external-app-controller.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import Tesseract from 'tesseract.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Navigation and Capture Automation
 */
class NavigationAutomation {
  constructor(options = {}) {
    this.controller = new ExternalAppController({
      verbose: options.verbose || false,
      windowTitle: options.windowTitle || 'Career Explorer'
    });

    this.navigationMap = null;
    this.outputDir = options.outputDir || 'AccessibilityAudit/screenshots';
    this.verbose = options.verbose || false;
    this.maxRetries = options.maxRetries || 3;
    this.sceneWaitTime = options.sceneWaitTime || 3000; // Wait 3s after navigation
    this.tesseractWorker = null;

    // Track visited scenes and navigation attempts
    this.visitedScenes = new Set();
    this.screenshots = [];
    this.navigationLog = [];
    this.failedNavigations = [];

    // Navigation graph (adjacency list)
    this.navigationGraph = {};

    // Predefined click regions for Career Explorer
    // These are percentage-based positions relative to window size
    this.clickRegions = {
      center: { x: 0.5, y: 0.5 },
      bottomCenter: { x: 0.5, y: 0.8 },
      backButton: { x: 0.1, y: 0.9 }, // Typical back button location
      locationButtons: [
        { x: 0.3, y: 0.5, label: 'left' },
        { x: 0.5, y: 0.5, label: 'center' },
        { x: 0.7, y: 0.5, label: 'right' },
        { x: 0.3, y: 0.7, label: 'bottom-left' },
        { x: 0.7, y: 0.7, label: 'bottom-right' }
      ]
    };
  }

  /**
   * Log message if verbose mode is enabled
   */
  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message
    };

    this.navigationLog.push(logEntry);

    if (this.verbose) {
      const prefix = level === 'error' ? '❌' : level === 'success' ? '✅' : 'ℹ️';
      console.log(`${prefix} [NavigationAutomation] ${message}`);
    }
  }

  /**
   * Load navigation map from JSON file
   */
  async loadNavigationMap(mapPath) {
    try {
      this.log(`Loading navigation map: ${mapPath}`);
      const content = await fs.readFile(mapPath, 'utf-8');
      this.navigationMap = JSON.parse(content);

      this.log(`Navigation map loaded: ${this.navigationMap.statistics.totalScenes} scenes, ${this.navigationMap.statistics.totalNavigationButtons} navigation buttons`);

      // Build navigation graph
      this.buildNavigationGraph();

      return this.navigationMap;
    } catch (error) {
      throw new Error(`Failed to load navigation map: ${error.message}`);
    }
  }

  /**
   * Build navigation graph (adjacency list) from navigation map
   */
  buildNavigationGraph() {
    this.log('Building navigation graph...');

    for (const [sceneName, sceneData] of Object.entries(this.navigationMap.scenes)) {
      this.navigationGraph[sceneName] = [];

      for (const button of sceneData.navigationButtons) {
        if (button.allowNavigation) {
          this.navigationGraph[sceneName].push({
            targetScene: button.targetScene,
            source: button.source,
            prefabPath: button.prefabPath
          });
        }
      }
    }

    this.log(`Navigation graph built with ${Object.keys(this.navigationGraph).length} nodes`);
  }

  /**
   * Initialize Tesseract OCR worker
   */
  async initializeOCR() {
    if (!this.tesseractWorker) {
      this.log('Initializing Tesseract OCR...');
      this.tesseractWorker = await Tesseract.createWorker('eng');
    }
  }

  /**
   * Detect current scene using OCR
   */
  async detectCurrentScene(screenshotPath = null) {
    try {
      await this.initializeOCR();

      // Focus Career Explorer window before capturing
      await this.controller.focusWindow();
      await this.controller.sleep(1000); // Wait for window to come to foreground

      // Capture screenshot if not provided
      let imagePath = screenshotPath;
      if (!imagePath) {
        const tempDir = path.join(process.cwd(), 'temp');
        await fs.mkdir(tempDir, { recursive: true });
        imagePath = path.join(tempDir, `scene-detect-${Date.now()}.png`);
        await this.controller.captureWindow(imagePath);
      }

      // Perform OCR
      this.log('Running OCR to detect current scene...');
      const { data } = await this.tesseractWorker.recognize(imagePath);
      const text = data.text;

      // Try to match scene names from the navigation map
      const sceneNames = Object.keys(this.navigationMap.scenes);
      let bestMatch = null;
      let highestScore = 0;

      for (const sceneName of sceneNames) {
        // Create pattern variations for matching
        const patterns = [
          new RegExp(sceneName, 'i'),
          new RegExp(sceneName.replace(/([A-Z])/g, ' $1').trim(), 'i'), // Add spaces before capitals
          new RegExp(sceneName.toLowerCase(), 'i')
        ];

        for (const pattern of patterns) {
          if (pattern.test(text)) {
            const score = sceneName.length / text.length; // Simple scoring
            if (score > highestScore) {
              highestScore = score;
              bestMatch = sceneName;
            }
          }
        }
      }

      // Special patterns for common scenes
      if (!bestMatch) {
        if (/loading/i.test(text) || /initial/i.test(text)) {
          bestMatch = 'InitialLoading';
        } else if (/location.*select/i.test(text) || /select.*location/i.test(text)) {
          bestMatch = 'LocationSelect';
        } else if (/career.*explorer/i.test(text)) {
          bestMatch = 'LocationSelect'; // Likely at main menu
        }
      }

      const result = {
        scene: bestMatch || 'Unknown',
        confidence: data.confidence,
        rawText: text,
        timestamp: new Date().toISOString()
      };

      this.log(`Scene detected: ${result.scene} (confidence: ${result.confidence.toFixed(1)}%)`);
      return result;
    } catch (error) {
      this.log(`Error detecting scene: ${error.message}`, 'error');
      return { scene: 'Unknown', confidence: 0, rawText: '', timestamp: new Date().toISOString() };
    }
  }

  /**
   * Capture screenshot of current scene
   */
  async captureScene(sceneName, suffix = '') {
    try {
      await fs.mkdir(this.outputDir, { recursive: true });

      const filename = suffix ? `${sceneName}_${suffix}.png` : `${sceneName}.png`;
      const outputPath = path.join(this.outputDir, filename);

      this.log(`Capturing screenshot: ${filename}`);

      // Focus window before capturing
      await this.controller.focusWindow();
      await this.controller.sleep(1000); // Wait for window to come to foreground

      await this.controller.captureWindow(outputPath);

      const screenshot = {
        scene: sceneName,
        filename,
        path: outputPath,
        timestamp: new Date().toISOString()
      };

      this.screenshots.push(screenshot);
      return screenshot;
    } catch (error) {
      this.log(`Failed to capture screenshot for ${sceneName}: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Click at specific position (percentage-based coordinates)
   */
  async clickAtRegion(region) {
    try {
      const bounds = await this.controller.getWindowBounds();
      const x = bounds.x + Math.floor(bounds.width * region.x);
      const y = bounds.y + Math.floor(bounds.height * region.y);

      this.log(`Clicking at region (${region.x * 100}%, ${region.y * 100}%) -> (${x}, ${y})`);

      await this.controller.focusWindow();
      await this.controller.sleep(500);
      await this.controller.clickAt(x, y);

      return true;
    } catch (error) {
      this.log(`Failed to click at region: ${error.message}`, 'error');
      return false;
    }
  }

  /**
   * Navigate to target scene from current scene
   */
  async navigateToScene(targetScene, retryCount = 0) {
    try {
      this.log(`Attempting to navigate to: ${targetScene} (attempt ${retryCount + 1}/${this.maxRetries})`);

      // Get navigation options from current scene
      const currentSceneDetection = await this.detectCurrentScene();
      const currentScene = currentSceneDetection.scene;

      if (currentScene === 'Unknown') {
        throw new Error('Cannot determine current scene');
      }

      if (currentScene === targetScene) {
        this.log(`Already at target scene: ${targetScene}`, 'success');
        return true;
      }

      const navigationOptions = this.navigationGraph[currentScene] || [];
      const targetOption = navigationOptions.find(opt => opt.targetScene === targetScene);

      if (!targetOption) {
        throw new Error(`No navigation path from ${currentScene} to ${targetScene}`);
      }

      // Try clicking at various regions to find the navigation button
      // For LocationSelect scene, try multiple button positions
      if (currentScene === 'LocationSelect') {
        for (const region of this.clickRegions.locationButtons) {
          await this.clickAtRegion(region);
          await this.controller.sleep(this.sceneWaitTime);

          const newScene = await this.detectCurrentScene();
          if (newScene.scene === targetScene) {
            this.log(`Successfully navigated to ${targetScene} via ${region.label}`, 'success');
            return true;
          }
        }
      } else {
        // For other scenes, try center and bottom center
        await this.clickAtRegion(this.clickRegions.center);
        await this.controller.sleep(this.sceneWaitTime);

        let newScene = await this.detectCurrentScene();
        if (newScene.scene === targetScene) {
          this.log(`Successfully navigated to ${targetScene}`, 'success');
          return true;
        }

        // Try bottom center if center didn't work
        await this.clickAtRegion(this.clickRegions.bottomCenter);
        await this.controller.sleep(this.sceneWaitTime);

        newScene = await this.detectCurrentScene();
        if (newScene.scene === targetScene) {
          this.log(`Successfully navigated to ${targetScene}`, 'success');
          return true;
        }
      }

      // Navigation failed
      if (retryCount < this.maxRetries - 1) {
        this.log(`Navigation failed, retrying... (${retryCount + 1}/${this.maxRetries})`, 'error');
        return await this.navigateToScene(targetScene, retryCount + 1);
      } else {
        throw new Error(`Failed to navigate to ${targetScene} after ${this.maxRetries} attempts`);
      }
    } catch (error) {
      this.failedNavigations.push({
        targetScene,
        error: error.message,
        timestamp: new Date().toISOString()
      });

      this.log(`Navigation to ${targetScene} failed: ${error.message}`, 'error');
      return false;
    }
  }

  /**
   * Navigate back to a known scene (e.g., LocationSelect hub)
   */
  async navigateToHub() {
    try {
      this.log('Navigating back to LocationSelect hub...');

      // Try clicking back button region
      await this.clickAtRegion(this.clickRegions.backButton);
      await this.controller.sleep(this.sceneWaitTime);

      const currentScene = await this.detectCurrentScene();
      if (currentScene.scene === 'LocationSelect') {
        this.log('Successfully returned to LocationSelect hub', 'success');
        return true;
      }

      return false;
    } catch (error) {
      this.log(`Failed to navigate to hub: ${error.message}`, 'error');
      return false;
    }
  }

  /**
   * Perform BFS traversal to visit all reachable scenes
   */
  async traverseAllScenes(startScene = 'InitialLoading') {
    try {
      this.log('Starting BFS traversal of all scenes...');

      const queue = [{ scene: startScene, path: [startScene] }];
      const visited = new Set();

      while (queue.length > 0) {
        const { scene, path } = queue.shift();

        if (visited.has(scene)) {
          continue;
        }

        this.log(`Visiting scene: ${scene} (path: ${path.join(' -> ')})`);
        visited.add(scene);
        this.visitedScenes.add(scene);

        // Capture screenshot of current scene
        try {
          await this.captureScene(scene);
        } catch (error) {
          this.log(`Failed to capture ${scene}: ${error.message}`, 'error');
        }

        // Get neighboring scenes
        const neighbors = this.navigationGraph[scene] || [];

        if (neighbors.length === 0) {
          this.log(`${scene} has no navigation buttons (dead end)`);
          // Navigate back to hub if possible
          await this.navigateToHub();
          continue;
        }

        // Add unvisited neighbors to queue
        for (const neighbor of neighbors) {
          const targetScene = neighbor.targetScene;

          if (!visited.has(targetScene)) {
            // Attempt to navigate to neighbor
            const success = await this.navigateToScene(targetScene);

            if (success) {
              queue.push({
                scene: targetScene,
                path: [...path, targetScene]
              });
            }
          }
        }
      }

      this.log(`BFS traversal completed. Visited ${visited.size} scenes.`, 'success');
      return Array.from(visited);
    } catch (error) {
      this.log(`Error during traversal: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Generate navigation report
   */
  async generateReport() {
    try {
      const reportPath = path.join(this.outputDir, 'navigation-report.json');

      const report = {
        summary: {
          totalScenes: this.navigationMap.statistics.totalScenes,
          visitedScenes: this.visitedScenes.size,
          screenshotsCaptured: this.screenshots.length,
          failedNavigations: this.failedNavigations.length,
          completionRate: `${((this.visitedScenes.size / this.navigationMap.statistics.totalScenes) * 100).toFixed(1)}%`
        },
        visitedScenes: Array.from(this.visitedScenes),
        screenshots: this.screenshots,
        failedNavigations: this.failedNavigations,
        navigationLog: this.navigationLog,
        timestamp: new Date().toISOString()
      };

      await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
      this.log(`Navigation report saved: ${reportPath}`, 'success');

      return report;
    } catch (error) {
      this.log(`Failed to generate report: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Run the full navigation automation
   */
  async run(applicationPath, navigationMapPath) {
    try {
      console.log('╔═══════════════════════════════════════════════════════════╗');
      console.log('║   Navigation Automation - Career Explorer                ║');
      console.log('╚═══════════════════════════════════════════════════════════╝');
      console.log();

      // Load navigation map
      await this.loadNavigationMap(navigationMapPath);

      // Launch application
      console.log('📱 Launching Career Explorer...');
      await this.controller.launchApplication(applicationPath);

      // Wait for initial loading
      console.log('⏳ Waiting for application to initialize...');
      await this.controller.sleep(5000);

      // Initialize OCR
      await this.initializeOCR();

      // Detect starting scene
      const startScene = await this.detectCurrentScene();
      console.log(`📍 Starting scene: ${startScene.scene}`);
      console.log();

      // Traverse all scenes
      console.log('🗺️  Starting navigation traversal...');
      console.log();
      const visitedScenes = await this.traverseAllScenes(startScene.scene);

      // Generate report
      console.log();
      console.log('📊 Generating navigation report...');
      const report = await this.generateReport();

      // Print summary
      console.log();
      console.log('╔═══════════════════════════════════════════════════════════╗');
      console.log('║   Navigation Complete                                     ║');
      console.log('╚═══════════════════════════════════════════════════════════╝');
      console.log();
      console.log(`✅ Visited scenes: ${report.summary.visitedScenes} / ${report.summary.totalScenes}`);
      console.log(`📸 Screenshots captured: ${report.summary.screenshotsCaptured}`);
      console.log(`❌ Failed navigations: ${report.summary.failedNavigations}`);
      console.log(`📈 Completion rate: ${report.summary.completionRate}`);
      console.log();
      console.log(`📁 Output directory: ${this.outputDir}`);
      console.log(`📄 Report: ${path.join(this.outputDir, 'navigation-report.json')}`);
      console.log();

      return report;
    } catch (error) {
      console.error('❌ Error during navigation automation:', error.message);
      throw error;
    } finally {
      // Cleanup
      if (this.tesseractWorker) {
        await this.tesseractWorker.terminate();
      }

      // Ask user if they want to close the application
      console.log('Press Ctrl+C to close the application and exit...');
    }
  }
}

// CLI interface
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  const args = process.argv.slice(2);

  // Parse arguments
  const options = {
    navigationMap: null,
    application: null,
    outputDir: null,
    verbose: false
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--navigation-map':
        options.navigationMap = args[++i];
        break;
      case '--application':
        options.application = args[++i];
        break;
      case '--output-dir':
        options.outputDir = args[++i];
        break;
      case '--verbose':
        options.verbose = true;
        break;
      case '--help':
        console.log(`
Navigation Automation for Career Explorer

Usage:
  node bin/navigate-and-capture.js [options]

Options:
  --navigation-map <path>   Path to navigation-map.json (required)
  --application <path>      Path to .exe file (required)
  --output-dir <path>       Output directory for screenshots (default: AccessibilityAudit/screenshots)
  --verbose                 Enable verbose logging
  --help                    Show this help message

Example:
  node bin/navigate-and-capture.js \\
    --navigation-map "apps.career-explorer/AccessibilityAudit/navigation-map.json" \\
    --application "C:\\Program Files\\zSpace\\Career Explorer\\zSpaceCareerExplorer.exe" \\
    --output-dir "apps.career-explorer/AccessibilityAudit/screenshots" \\
    --verbose
        `);
        process.exit(0);
    }
  }

  // Validate required arguments
  if (!options.navigationMap) {
    console.error('❌ Error: --navigation-map is required');
    console.error('Run with --help for usage information');
    process.exit(1);
  }

  if (!options.application) {
    console.error('❌ Error: --application is required');
    console.error('Run with --help for usage information');
    process.exit(1);
  }

  // Set default output directory
  if (!options.outputDir) {
    const mapDir = path.dirname(options.navigationMap);
    options.outputDir = path.join(mapDir, 'screenshots');
  }

  // Convert relative paths to absolute
  if (!path.isAbsolute(options.navigationMap)) {
    options.navigationMap = path.resolve(process.cwd(), options.navigationMap);
  }

  if (!path.isAbsolute(options.outputDir)) {
    options.outputDir = path.resolve(process.cwd(), options.outputDir);
  }

  // Run navigation automation
  const automation = new NavigationAutomation({
    outputDir: options.outputDir,
    verbose: options.verbose
  });

  try {
    await automation.run(options.application, options.navigationMap);

    // Keep the script running until user closes
    process.on('SIGINT', async () => {
      console.log('\n\n🔒 Closing application...');
      await automation.controller.closeApplication();
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    await automation.controller.closeApplication();
    process.exit(1);
  }
}

export { NavigationAutomation };
export default NavigationAutomation;
