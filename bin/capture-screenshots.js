#!/usr/bin/env node

/**
 * Screenshot Capture CLI Wrapper
 *
 * Launches Unity in batch mode to capture screenshots of all scenes in a project.
 * Part of the zSpace Accessibility Standards Unity Framework v3.1.0.
 *
 * Usage:
 *   node capture-screenshots.js <unity-project-path> [options]
 *
 * Options:
 *   --unity-path <path>       Path to Unity executable (auto-detected if not specified)
 *   --output-dir <path>       Output directory for screenshots (default: AccessibilityAudit/screenshots)
 *   --width <number>          Screenshot width in pixels (default: 1920)
 *   --height <number>         Screenshot height in pixels (default: 1080)
 *   --thumb-width <number>    Thumbnail width in pixels (default: 320)
 *   --thumb-height <number>   Thumbnail height in pixels (default: 180)
 *   --log-file <path>         Unity log file path (default: screenshot-capture.log)
 *   --verbose                 Show detailed Unity output
 *
 * Example:
 *   node capture-screenshots.js "C:\MyProject" --verbose
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Parse command line arguments
function parseArgs() {
    const args = process.argv.slice(2);

    const config = {
        projectPath: null,
        unityPath: null,
        outputDir: 'AccessibilityAudit/screenshots',
        width: 1920,
        height: 1080,
        thumbWidth: 320,
        thumbHeight: 180,
        logFile: 'screenshot-capture.log',
        verbose: false
    };

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];

        if (arg === '--unity-path' && i + 1 < args.length) {
            config.unityPath = args[++i];
        } else if (arg === '--output-dir' && i + 1 < args.length) {
            config.outputDir = args[++i];
        } else if (arg === '--width' && i + 1 < args.length) {
            config.width = parseInt(args[++i], 10);
        } else if (arg === '--height' && i + 1 < args.length) {
            config.height = parseInt(args[++i], 10);
        } else if (arg === '--thumb-width' && i + 1 < args.length) {
            config.thumbWidth = parseInt(args[++i], 10);
        } else if (arg === '--thumb-height' && i + 1 < args.length) {
            config.thumbHeight = parseInt(args[++i], 10);
        } else if (arg === '--log-file' && i + 1 < args.length) {
            config.logFile = args[++i];
        } else if (arg === '--verbose') {
            config.verbose = true;
        } else if (!arg.startsWith('--') && !config.projectPath) {
            config.projectPath = arg;
        }
    }

    return config;
}

// Find Unity executable
function findUnityExecutable() {
    const possiblePaths = [
        // Unity Hub default installations (Windows)
        'C:\\Program Files\\Unity\\Hub\\Editor\\2023.2\\Editor\\Unity.exe',
        'C:\\Program Files\\Unity\\Hub\\Editor\\2022.3\\Editor\\Unity.exe',
        'C:\\Program Files\\Unity\\Hub\\Editor\\2021.3\\Editor\\Unity.exe',

        // Standalone installations
        'C:\\Program Files\\Unity\\Editor\\Unity.exe',
        'C:\\Program Files (x86)\\Unity\\Editor\\Unity.exe',

        // macOS
        '/Applications/Unity/Hub/Editor/2023.2/Unity.app/Contents/MacOS/Unity',
        '/Applications/Unity/Hub/Editor/2022.3/Unity.app/Contents/MacOS/Unity',
        '/Applications/Unity/Hub/Editor/2021.3/Unity.app/Contents/MacOS/Unity',
        '/Applications/Unity/Unity.app/Contents/MacOS/Unity',

        // Linux
        '/opt/unity/Editor/Unity',
        '/usr/bin/unity-editor'
    ];

    for (const unityPath of possiblePaths) {
        if (fs.existsSync(unityPath)) {
            return unityPath;
        }
    }

    return null;
}

// Validate Unity project
function validateUnityProject(projectPath) {
    if (!fs.existsSync(projectPath)) {
        console.error(`❌ Error: Project path does not exist: ${projectPath}`);
        return false;
    }

    const assetsPath = path.join(projectPath, 'Assets');
    const projectSettingsPath = path.join(projectPath, 'ProjectSettings');

    if (!fs.existsSync(assetsPath) || !fs.existsSync(projectSettingsPath)) {
        console.error(`❌ Error: Invalid Unity project structure at: ${projectPath}`);
        console.error('   Missing Assets/ or ProjectSettings/ directory');
        return false;
    }

    return true;
}

// Run Unity in batch mode
function captureScreenshots(config) {
    return new Promise((resolve, reject) => {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('  zSpace Accessibility Screenshot Capture');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('');
        console.log(`📁 Project:       ${config.projectPath}`);
        console.log(`🎮 Unity:         ${config.unityPath}`);
        console.log(`📸 Output:        ${config.outputDir}`);
        console.log(`📐 Resolution:    ${config.width}x${config.height}`);
        console.log(`🖼️  Thumbnail:     ${config.thumbWidth}x${config.thumbHeight}`);
        console.log('');
        console.log('Starting Unity in batch mode...');
        console.log('');

        const unityArgs = [
            '-batchmode',
            '-quit',
            '-projectPath', config.projectPath,
            '-executeMethod', 'ZSpaceAccessibility.Editor.BatchModeScreenshotRunner.CaptureAllScenes',
            '-logFile', config.logFile,
            '-screenshotOutputDir', config.outputDir,
            '-screenshotWidth', config.width.toString(),
            '-screenshotHeight', config.height.toString(),
            '-thumbnailWidth', config.thumbWidth.toString(),
            '-thumbnailHeight', config.thumbHeight.toString()
        ];

        const unityProcess = spawn(config.unityPath, unityArgs);

        let outputBuffer = '';

        unityProcess.stdout.on('data', (data) => {
            const output = data.toString();
            outputBuffer += output;
            if (config.verbose) {
                process.stdout.write(output);
            }
        });

        unityProcess.stderr.on('data', (data) => {
            const output = data.toString();
            outputBuffer += output;
            if (config.verbose) {
                process.stderr.write(output);
            }
        });

        unityProcess.on('close', (code) => {
            console.log('');
            console.log('Unity batch mode finished.');
            console.log('');

            // Read and display log file
            if (fs.existsSync(config.logFile)) {
                const logContent = fs.readFileSync(config.logFile, 'utf8');

                // Extract summary information
                const summaryMatch = logContent.match(/=== Capture Summary ===([\s\S]*?)===.*Completed ===/);
                if (summaryMatch) {
                    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                    console.log('  Capture Summary');
                    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                    console.log(summaryMatch[1].trim());
                    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                }

                // Check for errors
                const errorMatches = logContent.match(/\[Error\].*|Error:|Exception:/gi);
                if (errorMatches && errorMatches.length > 0) {
                    console.warn('');
                    console.warn('⚠️  Warning: Errors detected in Unity log:');
                    errorMatches.slice(0, 5).forEach(err => {
                        console.warn(`   ${err}`);
                    });
                    if (errorMatches.length > 5) {
                        console.warn(`   ... and ${errorMatches.length - 5} more errors`);
                    }
                    console.warn(`   See full log: ${config.logFile}`);
                }

                if (!config.verbose) {
                    console.log('');
                    console.log(`📋 Full Unity log: ${config.logFile}`);
                }
            }

            console.log('');

            if (code === 0) {
                console.log('✅ Screenshot capture completed successfully!');
                console.log('');
                resolve();
            } else {
                console.error(`❌ Unity batch mode exited with code ${code}`);
                console.error('');
                reject(new Error(`Unity process failed with exit code ${code}`));
            }
        });

        unityProcess.on('error', (err) => {
            console.error('');
            console.error(`❌ Failed to start Unity: ${err.message}`);
            console.error('');
            reject(err);
        });
    });
}

// Main execution
async function main() {
    const config = parseArgs();

    // Validate arguments
    if (!config.projectPath) {
        console.error('Usage: node capture-screenshots.js <unity-project-path> [options]');
        console.error('');
        console.error('Example:');
        console.error('  node capture-screenshots.js "C:\\MyUnityProject" --verbose');
        console.error('');
        console.error('For more options, run with --help');
        process.exit(1);
    }

    // Resolve absolute path
    config.projectPath = path.resolve(config.projectPath);

    // Validate Unity project
    if (!validateUnityProject(config.projectPath)) {
        process.exit(1);
    }

    // Find Unity executable
    if (!config.unityPath) {
        config.unityPath = findUnityExecutable();
        if (!config.unityPath) {
            console.error('❌ Error: Could not find Unity executable.');
            console.error('');
            console.error('Please specify Unity path manually:');
            console.error('  --unity-path "C:\\Program Files\\Unity\\Hub\\Editor\\2023.2\\Editor\\Unity.exe"');
            console.error('');
            process.exit(1);
        }
    }

    if (!fs.existsSync(config.unityPath)) {
        console.error(`❌ Error: Unity executable not found at: ${config.unityPath}`);
        process.exit(1);
    }

    // Run screenshot capture
    try {
        await captureScreenshots(config);
        process.exit(0);
    } catch (error) {
        console.error(`❌ Screenshot capture failed: ${error.message}`);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { captureScreenshots, findUnityExecutable, validateUnityProject };
