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
    /// Unity Editor tool for automated scene screenshot capture.
    /// Discovers all scenes in the project, loads them sequentially, and captures screenshots
    /// at multiple resolutions for use in accessibility audit reports.
    ///
    /// Usage:
    ///   Menu: Window → Accessibility → Capture Scene Screenshots
    ///   Code: SceneScreenshotCapture.CaptureAllScenes()
    /// </summary>
    public class SceneScreenshotCapture : EditorWindow
    {
        private string outputDirectory = "AccessibilityAudit/screenshots";
        private Vector2Int mainResolution = new Vector2Int(1920, 1080);
        private Vector2Int thumbnailResolution = new Vector2Int(320, 180);
        private bool captureMainResolution = true;
        private bool captureThumbnails = true;
        private bool generateMetadata = true;
        private bool includeInactiveScenes = false;
        private List<string> scenePaths = new List<string>();
        private Vector2 scrollPosition;
        private bool isCapturing = false;
        private float captureProgress = 0f;
        private string currentSceneName = "";

        [MenuItem("Window/Accessibility/Capture Scene Screenshots")]
        public static void ShowWindow()
        {
            var window = GetWindow<SceneScreenshotCapture>("Scene Screenshots");
            window.minSize = new Vector2(400, 500);
            window.Show();
        }

        private void OnEnable()
        {
            RefreshSceneList();
        }

        private void OnGUI()
        {
            EditorGUILayout.LabelField("Automated Scene Screenshot Capture", EditorStyles.boldLabel);
            EditorGUILayout.Space();

            // Output directory
            EditorGUILayout.LabelField("Output Settings", EditorStyles.boldLabel);
            EditorGUILayout.BeginHorizontal();
            outputDirectory = EditorGUILayout.TextField("Output Directory", outputDirectory);
            if (GUILayout.Button("Browse", GUILayout.Width(60)))
            {
                string selected = EditorUtility.OpenFolderPanel("Select Output Directory", outputDirectory, "");
                if (!string.IsNullOrEmpty(selected))
                {
                    outputDirectory = selected;
                }
            }
            EditorGUILayout.EndHorizontal();

            EditorGUILayout.Space();

            // Resolution settings
            EditorGUILayout.LabelField("Resolution Settings", EditorStyles.boldLabel);
            captureMainResolution = EditorGUILayout.Toggle("Capture Main Resolution", captureMainResolution);
            if (captureMainResolution)
            {
                EditorGUI.indentLevel++;
                mainResolution = EditorGUILayout.Vector2IntField("Main Resolution", mainResolution);
                EditorGUI.indentLevel--;
            }

            captureThumbnails = EditorGUILayout.Toggle("Capture Thumbnails", captureThumbnails);
            if (captureThumbnails)
            {
                EditorGUI.indentLevel++;
                thumbnailResolution = EditorGUILayout.Vector2IntField("Thumbnail Resolution", thumbnailResolution);
                EditorGUI.indentLevel--;
            }

            EditorGUILayout.Space();

            // Options
            EditorGUILayout.LabelField("Options", EditorStyles.boldLabel);
            generateMetadata = EditorGUILayout.Toggle("Generate Metadata JSON", generateMetadata);
            includeInactiveScenes = EditorGUILayout.Toggle("Include Disabled Scenes", includeInactiveScenes);

            EditorGUILayout.Space();

            // Scene list
            EditorGUILayout.BeginHorizontal();
            EditorGUILayout.LabelField($"Scenes to Capture ({scenePaths.Count})", EditorStyles.boldLabel);
            if (GUILayout.Button("Refresh", GUILayout.Width(80)))
            {
                RefreshSceneList();
            }
            EditorGUILayout.EndHorizontal();

            scrollPosition = EditorGUILayout.BeginScrollView(scrollPosition, GUILayout.Height(200));
            foreach (var scenePath in scenePaths)
            {
                EditorGUILayout.LabelField($"  • {Path.GetFileNameWithoutExtension(scenePath)}", EditorStyles.miniLabel);
            }
            EditorGUILayout.EndScrollView();

            EditorGUILayout.Space();

            // Progress
            if (isCapturing)
            {
                EditorGUI.ProgressBar(
                    EditorGUILayout.GetControlRect(GUILayout.Height(20)),
                    captureProgress,
                    $"Capturing: {currentSceneName} ({(int)(captureProgress * 100)}%)"
                );
            }

            EditorGUILayout.Space();

            // Capture button
            GUI.enabled = !isCapturing && scenePaths.Count > 0;
            if (GUILayout.Button("Capture All Scenes", GUILayout.Height(40)))
            {
                CaptureAllScenes();
            }
            GUI.enabled = true;

            if (GUILayout.Button("Capture Current Scene Only", GUILayout.Height(30)))
            {
                CaptureCurrentScene();
            }

            // Info
            EditorGUILayout.Space();
            EditorGUILayout.HelpBox(
                "This tool will:\n" +
                "1. Load each scene sequentially\n" +
                "2. Capture screenshots at specified resolutions\n" +
                "3. Generate metadata JSON files\n" +
                "4. Save to AccessibilityAudit/screenshots/\n\n" +
                "Note: Requires a Camera in each scene (Camera.main)",
                MessageType.Info
            );
        }

        private void RefreshSceneList()
        {
            scenePaths.Clear();

            // Find all .unity files in Assets folder
            string[] guids = AssetDatabase.FindAssets("t:Scene");
            foreach (string guid in guids)
            {
                string path = AssetDatabase.GUIDToAssetPath(guid);

                // Skip scenes in Build Settings if not included and includeInactiveScenes is false
                if (!includeInactiveScenes)
                {
                    var buildScenes = EditorBuildSettings.scenes;
                    bool isInBuildSettings = buildScenes.Any(s => s.path == path && s.enabled);
                    if (buildScenes.Length > 0 && !isInBuildSettings)
                    {
                        continue;
                    }
                }

                scenePaths.Add(path);
            }

            scenePaths.Sort();
        }

        /// <summary>
        /// Captures screenshots of all discovered scenes.
        /// Can be called from code for batch processing.
        /// </summary>
        public static void CaptureAllScenes()
        {
            var window = GetWindow<SceneScreenshotCapture>();
            window.StartCaptureProcess();
        }

        /// <summary>
        /// Captures screenshots of the currently active scene.
        /// </summary>
        public static void CaptureCurrentScene()
        {
            var window = GetWindow<SceneScreenshotCapture>();
            string scenePath = SceneManager.GetActiveScene().path;

            if (string.IsNullOrEmpty(scenePath))
            {
                EditorUtility.DisplayDialog(
                    "Error",
                    "Current scene has not been saved. Please save the scene first.",
                    "OK"
                );
                return;
            }

            window.CaptureScene(scenePath);
            EditorUtility.DisplayDialog(
                "Success",
                $"Screenshot captured for scene: {Path.GetFileNameWithoutExtension(scenePath)}",
                "OK"
            );
        }

        private void StartCaptureProcess()
        {
            if (scenePaths.Count == 0)
            {
                EditorUtility.DisplayDialog("No Scenes", "No scenes found to capture.", "OK");
                return;
            }

            // Save current scene
            if (EditorSceneManager.GetActiveScene().isDirty)
            {
                if (!EditorUtility.DisplayDialog(
                    "Unsaved Changes",
                    "Current scene has unsaved changes. Save before continuing?",
                    "Save and Continue",
                    "Cancel"))
                {
                    return;
                }
                EditorSceneManager.SaveScene(SceneManager.GetActiveScene());
            }

            string currentScenePath = SceneManager.GetActiveScene().path;

            isCapturing = true;
            captureProgress = 0f;

            try
            {
                for (int i = 0; i < scenePaths.Count; i++)
                {
                    currentSceneName = Path.GetFileNameWithoutExtension(scenePaths[i]);
                    captureProgress = (float)i / scenePaths.Count;
                    Repaint();

                    CaptureScene(scenePaths[i]);
                }

                // Restore original scene
                if (!string.IsNullOrEmpty(currentScenePath))
                {
                    EditorSceneManager.OpenScene(currentScenePath);
                }

                EditorUtility.DisplayDialog(
                    "Success",
                    $"Captured screenshots for {scenePaths.Count} scene(s).\n\nOutput: {outputDirectory}",
                    "OK"
                );
            }
            catch (System.Exception ex)
            {
                EditorUtility.DisplayDialog(
                    "Error",
                    $"Failed to capture screenshots:\n{ex.Message}",
                    "OK"
                );
                Debug.LogError($"Screenshot capture failed: {ex}");
            }
            finally
            {
                isCapturing = false;
                captureProgress = 1f;
                Repaint();
            }
        }

        private void CaptureScene(string scenePath)
        {
            // Load scene
            Scene scene = EditorSceneManager.OpenScene(scenePath, OpenSceneMode.Single);
            string sceneName = scene.name;

            Debug.Log($"Capturing scene: {sceneName}");

            // Wait for scene to fully load
            EditorApplication.delayCall += () =>
            {
                // Find main camera
                Camera mainCamera = Camera.main;
                if (mainCamera == null)
                {
                    // Try to find any camera
                    mainCamera = FindObjectOfType<Camera>();
                }

                if (mainCamera == null)
                {
                    Debug.LogWarning($"No camera found in scene: {sceneName}. Skipping screenshot.");
                    return;
                }

                // Create output directory
                string sceneOutputDir = Path.Combine(outputDirectory, sceneName);
                Directory.CreateDirectory(sceneOutputDir);

                // Capture main resolution
                if (captureMainResolution)
                {
                    string mainPath = Path.Combine(sceneOutputDir, $"{sceneName}_main.png");
                    CaptureScreenshotAtResolution(mainCamera, mainPath, mainResolution.x, mainResolution.y);
                    Debug.Log($"Captured main screenshot: {mainPath}");
                }

                // Capture thumbnail
                if (captureThumbnails)
                {
                    string thumbPath = Path.Combine(sceneOutputDir, $"{sceneName}_thumbnail.png");
                    CaptureScreenshotAtResolution(mainCamera, thumbPath, thumbnailResolution.x, thumbnailResolution.y);
                    Debug.Log($"Captured thumbnail: {thumbPath}");
                }

                // Generate metadata
                if (generateMetadata)
                {
                    GenerateMetadata(scene, mainCamera, sceneOutputDir);
                }
            };
        }

        private void CaptureScreenshotAtResolution(Camera camera, string outputPath, int width, int height)
        {
            // Create RenderTexture
            RenderTexture rt = new RenderTexture(width, height, 24);
            camera.targetTexture = rt;

            // Render
            camera.Render();

            // Read pixels
            RenderTexture.active = rt;
            Texture2D screenshot = new Texture2D(width, height, TextureFormat.RGB24, false);
            screenshot.ReadPixels(new Rect(0, 0, width, height), 0, 0);
            screenshot.Apply();

            // Reset
            camera.targetTexture = null;
            RenderTexture.active = null;
            DestroyImmediate(rt);

            // Save
            byte[] bytes = screenshot.EncodeToPNG();
            File.WriteAllBytes(outputPath, bytes);
            DestroyImmediate(screenshot);
        }

        private void GenerateMetadata(Scene scene, Camera camera, string outputDir)
        {
            var metadata = new SceneMetadata
            {
                sceneName = scene.name,
                scenePath = scene.path,
                captureTimestamp = System.DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"),
                cameraPosition = camera.transform.position,
                cameraRotation = camera.transform.eulerAngles,
                cameraFieldOfView = camera.fieldOfView,
                rootObjectCount = scene.rootCount,
                mainResolution = captureMainResolution ? $"{mainResolution.x}x{mainResolution.y}" : "N/A",
                thumbnailResolution = captureThumbnails ? $"{thumbnailResolution.x}x{thumbnailResolution.y}" : "N/A"
            };

            string json = JsonUtility.ToJson(metadata, true);
            string metadataPath = Path.Combine(outputDir, "metadata.json");
            File.WriteAllText(metadataPath, json);
            Debug.Log($"Generated metadata: {metadataPath}");
        }

        [System.Serializable]
        private class SceneMetadata
        {
            public string sceneName;
            public string scenePath;
            public string captureTimestamp;
            public Vector3 cameraPosition;
            public Vector3 cameraRotation;
            public float cameraFieldOfView;
            public int rootObjectCount;
            public string mainResolution;
            public string thumbnailResolution;
        }
    }
}
