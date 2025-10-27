using UnityEngine;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine.SceneManagement;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace ZSpaceAccessibility.Editor
{
    /// <summary>
    /// Batch mode entry point for automated screenshot capture.
    /// Designed to be called from Unity batch mode (-batchmode -quit -executeMethod).
    ///
    /// Usage:
    ///   unity.exe -batchmode -quit -projectPath "C:\MyProject"
    ///   -executeMethod ZSpaceAccessibility.Editor.BatchModeScreenshotRunner.CaptureAllScenes
    ///   -logFile "capture.log"
    ///   -screenshotOutputDir "AccessibilityAudit/screenshots"
    ///   -screenshotWidth 1920
    ///   -screenshotHeight 1080
    /// </summary>
    public static class BatchModeScreenshotRunner
    {
        private static string outputDirectory = "AccessibilityAudit/screenshots";
        private static int mainWidth = 1920;
        private static int mainHeight = 1080;
        private static int thumbnailWidth = 320;
        private static int thumbnailHeight = 180;

        /// <summary>
        /// Main entry point for batch mode screenshot capture.
        /// Captures all scenes in build settings or all scenes in project.
        /// </summary>
        public static void CaptureAllScenes()
        {
            Debug.Log("=== Batch Mode Screenshot Capture Started ===");

            // Parse command line arguments
            ParseCommandLineArguments();

            Debug.Log($"Output Directory: {outputDirectory}");
            Debug.Log($"Main Resolution: {mainWidth}x{mainHeight}");
            Debug.Log($"Thumbnail Resolution: {thumbnailWidth}x{thumbnailHeight}");

            try
            {
                // Get all scene paths
                List<string> scenePaths = GetAllScenePaths();
                Debug.Log($"Found {scenePaths.Count} scene(s) to capture");

                if (scenePaths.Count == 0)
                {
                    Debug.LogWarning("No scenes found to capture!");
                    EditorApplication.Exit(1);
                    return;
                }

                // Capture each scene
                int successCount = 0;
                int failureCount = 0;

                foreach (string scenePath in scenePaths)
                {
                    try
                    {
                        CaptureScene(scenePath);
                        successCount++;
                    }
                    catch (System.Exception ex)
                    {
                        Debug.LogError($"Failed to capture scene {scenePath}: {ex.Message}");
                        failureCount++;
                    }
                }

                // Report results
                Debug.Log("=== Capture Summary ===");
                Debug.Log($"Total Scenes: {scenePaths.Count}");
                Debug.Log($"Successful: {successCount}");
                Debug.Log($"Failed: {failureCount}");
                Debug.Log($"Output: {Path.GetFullPath(outputDirectory)}");
                Debug.Log("=== Batch Mode Screenshot Capture Completed ===");

                // Exit with appropriate code
                EditorApplication.Exit(failureCount > 0 ? 1 : 0);
            }
            catch (System.Exception ex)
            {
                Debug.LogError($"Fatal error during screenshot capture: {ex}");
                EditorApplication.Exit(1);
            }
        }

        /// <summary>
        /// Captures a single scene specified by path.
        /// </summary>
        public static void CaptureSingleScene()
        {
            Debug.Log("=== Batch Mode Single Scene Capture Started ===");

            // Parse command line arguments
            ParseCommandLineArguments();

            string scenePath = GetCommandLineArgument("-scenePath");
            if (string.IsNullOrEmpty(scenePath))
            {
                Debug.LogError("No scene path specified! Use -scenePath argument.");
                EditorApplication.Exit(1);
                return;
            }

            try
            {
                CaptureScene(scenePath);
                Debug.Log($"Successfully captured scene: {scenePath}");
                EditorApplication.Exit(0);
            }
            catch (System.Exception ex)
            {
                Debug.LogError($"Failed to capture scene: {ex}");
                EditorApplication.Exit(1);
            }
        }

        private static void ParseCommandLineArguments()
        {
            string[] args = System.Environment.GetCommandLineArgs();

            // Parse output directory
            string outputArg = GetCommandLineArgument("-screenshotOutputDir");
            if (!string.IsNullOrEmpty(outputArg))
            {
                outputDirectory = outputArg;
            }

            // Parse main resolution
            string widthArg = GetCommandLineArgument("-screenshotWidth");
            if (!string.IsNullOrEmpty(widthArg) && int.TryParse(widthArg, out int width))
            {
                mainWidth = width;
            }

            string heightArg = GetCommandLineArgument("-screenshotHeight");
            if (!string.IsNullOrEmpty(heightArg) && int.TryParse(heightArg, out int height))
            {
                mainHeight = height;
            }

            // Parse thumbnail resolution
            string thumbWidthArg = GetCommandLineArgument("-thumbnailWidth");
            if (!string.IsNullOrEmpty(thumbWidthArg) && int.TryParse(thumbWidthArg, out int thumbWidth))
            {
                thumbnailWidth = thumbWidth;
            }

            string thumbHeightArg = GetCommandLineArgument("-thumbnailHeight");
            if (!string.IsNullOrEmpty(thumbHeightArg) && int.TryParse(thumbHeightArg, out int thumbHeight))
            {
                thumbnailHeight = thumbHeight;
            }
        }

        private static string GetCommandLineArgument(string name)
        {
            string[] args = System.Environment.GetCommandLineArgs();
            for (int i = 0; i < args.Length; i++)
            {
                if (args[i] == name && i + 1 < args.Length)
                {
                    return args[i + 1];
                }
            }
            return null;
        }

        private static List<string> GetAllScenePaths()
        {
            List<string> scenePaths = new List<string>();

            // First, try to get scenes from Build Settings
            EditorBuildSettingsScene[] buildScenes = EditorBuildSettings.scenes;
            if (buildScenes != null && buildScenes.Length > 0)
            {
                foreach (var buildScene in buildScenes)
                {
                    if (buildScene.enabled)
                    {
                        scenePaths.Add(buildScene.path);
                    }
                }
                Debug.Log($"Using {scenePaths.Count} scene(s) from Build Settings");
            }

            // If no build settings scenes, find all scenes in project
            if (scenePaths.Count == 0)
            {
                string[] guids = AssetDatabase.FindAssets("t:Scene");
                foreach (string guid in guids)
                {
                    string path = AssetDatabase.GUIDToAssetPath(guid);
                    scenePaths.Add(path);
                }
                Debug.Log($"Using {scenePaths.Count} scene(s) from project (no Build Settings)");
            }

            return scenePaths;
        }

        private static void CaptureScene(string scenePath)
        {
            Debug.Log($"[Capture] Loading scene: {scenePath}");

            // Load scene
            Scene scene = EditorSceneManager.OpenScene(scenePath, OpenSceneMode.Single);
            string sceneName = scene.name;

            // Find camera
            Camera mainCamera = Camera.main;
            if (mainCamera == null)
            {
                mainCamera = Object.FindObjectOfType<Camera>();
            }

            if (mainCamera == null)
            {
                throw new System.Exception($"No camera found in scene: {sceneName}");
            }

            Debug.Log($"[Capture] Using camera: {mainCamera.name} at position {mainCamera.transform.position}");

            // Create output directory
            string sceneOutputDir = Path.Combine(outputDirectory, sceneName);
            Directory.CreateDirectory(sceneOutputDir);
            Debug.Log($"[Capture] Output directory: {Path.GetFullPath(sceneOutputDir)}");

            // Capture main resolution
            string mainPath = Path.Combine(sceneOutputDir, $"{sceneName}_main.png");
            CaptureScreenshotAtResolution(mainCamera, mainPath, mainWidth, mainHeight);
            Debug.Log($"[Capture] ✓ Main screenshot: {mainPath}");

            // Capture thumbnail
            string thumbPath = Path.Combine(sceneOutputDir, $"{sceneName}_thumbnail.png");
            CaptureScreenshotAtResolution(mainCamera, thumbPath, thumbnailWidth, thumbnailHeight);
            Debug.Log($"[Capture] ✓ Thumbnail: {thumbPath}");

            // Generate metadata
            GenerateMetadata(scene, mainCamera, sceneOutputDir);
            Debug.Log($"[Capture] ✓ Metadata generated");

            Debug.Log($"[Capture] Scene '{sceneName}' captured successfully");
        }

        private static void CaptureScreenshotAtResolution(Camera camera, string outputPath, int width, int height)
        {
            // Create RenderTexture
            RenderTexture rt = new RenderTexture(width, height, 24);
            RenderTexture previousRT = camera.targetTexture;
            camera.targetTexture = rt;

            // Render
            camera.Render();

            // Read pixels
            RenderTexture.active = rt;
            Texture2D screenshot = new Texture2D(width, height, TextureFormat.RGB24, false);
            screenshot.ReadPixels(new Rect(0, 0, width, height), 0, 0);
            screenshot.Apply();

            // Reset
            camera.targetTexture = previousRT;
            RenderTexture.active = null;
            Object.DestroyImmediate(rt);

            // Save
            byte[] bytes = screenshot.EncodeToPNG();
            File.WriteAllBytes(outputPath, bytes);
            Object.DestroyImmediate(screenshot);
        }

        private static void GenerateMetadata(Scene scene, Camera camera, string outputDir)
        {
            var metadata = new SceneMetadata
            {
                sceneName = scene.name,
                scenePath = scene.path,
                captureTimestamp = System.DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"),
                cameraName = camera.name,
                cameraPosition = camera.transform.position,
                cameraRotation = camera.transform.eulerAngles,
                cameraFieldOfView = camera.fieldOfView,
                rootObjectCount = scene.rootCount,
                mainResolution = $"{mainWidth}x{mainHeight}",
                thumbnailResolution = $"{thumbnailWidth}x{thumbnailHeight}",
                unityVersion = Application.unityVersion,
                platform = Application.platform.ToString()
            };

            string json = JsonUtility.ToJson(metadata, true);
            string metadataPath = Path.Combine(outputDir, "metadata.json");
            File.WriteAllText(metadataPath, json);
        }

        [System.Serializable]
        private class SceneMetadata
        {
            public string sceneName;
            public string scenePath;
            public string captureTimestamp;
            public string cameraName;
            public Vector3 cameraPosition;
            public Vector3 cameraRotation;
            public float cameraFieldOfView;
            public int rootObjectCount;
            public string mainResolution;
            public string thumbnailResolution;
            public string unityVersion;
            public string platform;
        }
    }
}
