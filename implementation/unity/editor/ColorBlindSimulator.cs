using UnityEngine;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine.SceneManagement;
using System.Collections.Generic;
using System.IO;

namespace ZSpaceAccessibility.Editor
{
    /// <summary>
    /// Unity Editor tool for color-blind simulation and screenshot capture.
    /// Applies color transformation shaders to simulate 8 types of color vision deficiency.
    ///
    /// Supports:
    /// - Protanopia (red-blind) - ~1% of males
    /// - Deuteranopia (green-blind) - ~1% of males
    /// - Tritanopia (blue-blind) - ~0.001% of population
    /// - Protanomaly (red-weak) - ~1% of males
    /// - Deuteranomaly (green-weak) - ~5% of males (most common)
    /// - Tritanomaly (blue-weak) - ~0.01% of population
    /// - Achromatopsia (total color-blind) - ~0.003% of population
    /// - Normal vision (baseline comparison)
    ///
    /// Usage:
    ///   Menu: Window → Accessibility → Color Blind Simulator
    ///   Code: ColorBlindSimulator.CaptureAllSimulations()
    ///
    /// Part of zSpace Accessibility Standards Unity Framework v3.1.0
    /// </summary>
    public class ColorBlindSimulator : EditorWindow
    {
        // Simulation types
        public enum ColorBlindType
        {
            Normal,
            Protanopia,
            Deuteranopia,
            Tritanopia,
            Protanomaly,
            Deuteranomaly,
            Tritanomaly,
            Achromatopsia
        }

        // UI State
        private string outputDirectory = "AccessibilityAudit/screenshots";
        private Vector2Int resolution = new Vector2Int(1920, 1080);
        private ColorBlindType selectedSimulation = ColorBlindType.Normal;
        private bool captureAllTypes = true;
        private bool generateComparisonHTML = true;
        private Vector2 scrollPosition;

        // Progress tracking
        private bool isCapturing = false;
        private float captureProgress = 0f;
        private string currentStatus = "";

        [MenuItem("Window/Accessibility/Color Blind Simulator")]
        public static void ShowWindow()
        {
            var window = GetWindow<ColorBlindSimulator>("Color Blind Sim");
            window.minSize = new Vector2(450, 600);
            window.Show();
        }

        private void OnGUI()
        {
            scrollPosition = EditorGUILayout.BeginScrollView(scrollPosition);

            GUILayout.Space(10);
            GUILayout.Label("Color Blind Simulation Tool", EditorStyles.boldLabel);
            GUILayout.Label("Simulate and capture screenshots for various types of color vision deficiency", EditorStyles.wordWrappedMiniLabel);
            GUILayout.Space(10);

            // Configuration
            EditorGUILayout.LabelField("Configuration", EditorStyles.boldLabel);
            outputDirectory = EditorGUILayout.TextField("Output Directory", outputDirectory);
            resolution = EditorGUILayout.Vector2IntField("Resolution", resolution);
            GUILayout.Space(5);

            // Simulation type
            EditorGUILayout.LabelField("Simulation Type", EditorStyles.boldLabel);
            captureAllTypes = EditorGUILayout.Toggle("Capture All Types", captureAllTypes);

            if (!captureAllTypes)
            {
                selectedSimulation = (ColorBlindType)EditorGUILayout.EnumPopup("Simulation", selectedSimulation);
            }

            generateComparisonHTML = EditorGUILayout.Toggle("Generate Comparison HTML", generateComparisonHTML);
            GUILayout.Space(10);

            // Information about simulation types
            EditorGUILayout.LabelField("Supported Simulations:", EditorStyles.boldLabel);
            EditorGUILayout.HelpBox(
                "Protanopia: Red-blind (~1% males)\n" +
                "Deuteranopia: Green-blind (~1% males)\n" +
                "Tritanopia: Blue-blind (~0.001%)\n" +
                "Protanomaly: Red-weak (~1% males)\n" +
                "Deuteranomaly: Green-weak (~5% males, most common)\n" +
                "Tritanomaly: Blue-weak (~0.01%)\n" +
                "Achromatopsia: Total color-blind (~0.003%)\n" +
                "Normal: Baseline comparison",
                MessageType.Info
            );

            GUILayout.Space(10);

            // Action buttons
            EditorGUI.BeginDisabledGroup(isCapturing);

            if (GUILayout.Button("Capture Current Scene", GUILayout.Height(40)))
            {
                CaptureCurrentScene();
            }

            if (GUILayout.Button("Capture All Scenes in Project", GUILayout.Height(40)))
            {
                CaptureAllScenes();
            }

            EditorGUI.EndDisabledGroup();

            // Progress bar
            if (isCapturing)
            {
                GUILayout.Space(10);
                EditorGUILayout.LabelField("Progress", EditorStyles.boldLabel);
                EditorGUI.ProgressBar(EditorGUILayout.GetControlRect(), captureProgress, currentStatus);
                GUILayout.Space(5);

                if (GUILayout.Button("Cancel"))
                {
                    isCapturing = false;
                    currentStatus = "Cancelled by user";
                }
            }

            GUILayout.Space(10);
            EditorGUILayout.EndScrollView();
        }

        /// <summary>
        /// Capture color-blind simulations for the current scene
        /// </summary>
        private void CaptureCurrentScene()
        {
            Scene scene = SceneManager.GetActiveScene();
            if (!scene.IsValid() || string.IsNullOrEmpty(scene.path))
            {
                EditorUtility.DisplayDialog("Error", "No valid scene is currently loaded.", "OK");
                return;
            }

            isCapturing = true;
            captureProgress = 0f;
            currentStatus = $"Capturing {scene.name}...";

            try
            {
                CaptureSceneSimulations(scene);
                currentStatus = "Capture complete!";
                EditorUtility.DisplayDialog("Success", $"Captured color-blind simulations for {scene.name}", "OK");
            }
            catch (System.Exception ex)
            {
                currentStatus = "Error: " + ex.Message;
                EditorUtility.DisplayDialog("Error", $"Failed to capture simulations:\n{ex.Message}", "OK");
            }
            finally
            {
                isCapturing = false;
            }
        }

        /// <summary>
        /// Capture color-blind simulations for all scenes in the project
        /// </summary>
        private void CaptureAllScenes()
        {
            List<string> scenePaths = GetAllScenePaths();

            if (scenePaths.Count == 0)
            {
                EditorUtility.DisplayDialog("Error", "No scenes found in project", "OK");
                return;
            }

            bool proceed = EditorUtility.DisplayDialog(
                "Capture All Scenes",
                $"This will capture color-blind simulations for {scenePaths.Count} scene(s).\n\nThis may take several minutes.",
                "Proceed",
                "Cancel"
            );

            if (!proceed) return;

            isCapturing = true;
            string originalScene = SceneManager.GetActiveScene().path;

            try
            {
                for (int i = 0; i < scenePaths.Count; i++)
                {
                    string scenePath = scenePaths[i];
                    captureProgress = (float)i / scenePaths.Count;
                    currentStatus = $"Processing scene {i + 1}/{scenePaths.Count}...";

                    Scene scene = EditorSceneManager.OpenScene(scenePath, OpenSceneMode.Single);
                    CaptureSceneSimulations(scene);
                }

                // Restore original scene
                if (!string.IsNullOrEmpty(originalScene))
                {
                    EditorSceneManager.OpenScene(originalScene, OpenSceneMode.Single);
                }

                captureProgress = 1f;
                currentStatus = "All scenes captured!";
                EditorUtility.DisplayDialog("Success", $"Captured color-blind simulations for {scenePaths.Count} scene(s)", "OK");
            }
            catch (System.Exception ex)
            {
                currentStatus = "Error: " + ex.Message;
                EditorUtility.DisplayDialog("Error", $"Failed during capture:\n{ex.Message}", "OK");
            }
            finally
            {
                isCapturing = false;
            }
        }

        /// <summary>
        /// Capture all simulation types for a given scene
        /// </summary>
        private void CaptureSceneSimulations(Scene scene)
        {
            Camera camera = Camera.main;
            if (camera == null)
            {
                camera = FindObjectOfType<Camera>();
            }

            if (camera == null)
            {
                Debug.LogError($"[ColorBlindSimulator] No camera found in scene: {scene.name}");
                return;
            }

            // Create output directory
            string sceneName = scene.name;
            string sceneDir = Path.Combine(outputDirectory, sceneName, "colorblind");
            Directory.CreateDirectory(sceneDir);

            // Capture simulations
            ColorBlindType[] types = captureAllTypes
                ? (ColorBlindType[])System.Enum.GetValues(typeof(ColorBlindType))
                : new ColorBlindType[] { selectedSimulation };

            foreach (ColorBlindType type in types)
            {
                CaptureWithSimulation(camera, sceneName, sceneDir, type);
            }

            // Generate comparison HTML
            if (generateComparisonHTML)
            {
                GenerateComparisonHTML(sceneName, sceneDir, types);
            }

            Debug.Log($"[ColorBlindSimulator] Captured {types.Length} simulation(s) for {sceneName}");
        }

        /// <summary>
        /// Capture screenshot with specific color-blind simulation applied
        /// </summary>
        private void CaptureWithSimulation(Camera camera, string sceneName, string outputDir, ColorBlindType type)
        {
            string filename = $"{sceneName}_{type.ToString().ToLower()}.png";
            string filepath = Path.Combine(outputDir, filename);

            // Apply color transformation
            Matrix4x4 colorMatrix = GetColorTransformMatrix(type);

            // Create render texture
            RenderTexture rt = new RenderTexture(resolution.x, resolution.y, 24);
            RenderTexture currentRT = RenderTexture.active;
            Camera.SetupCurrent(camera);

            camera.targetTexture = rt;
            camera.Render();

            // Apply color transformation
            RenderTexture transformedRT = ApplyColorTransform(rt, colorMatrix);

            // Read pixels
            RenderTexture.active = transformedRT;
            Texture2D screenshot = new Texture2D(resolution.x, resolution.y, TextureFormat.RGB24, false);
            screenshot.ReadPixels(new Rect(0, 0, resolution.x, resolution.y), 0, 0);
            screenshot.Apply();

            // Save to file
            byte[] bytes = screenshot.EncodeToPNG();
            File.WriteAllBytes(filepath, bytes);

            // Cleanup
            camera.targetTexture = null;
            RenderTexture.active = currentRT;
            Object.DestroyImmediate(rt);
            Object.DestroyImmediate(transformedRT);
            Object.DestroyImmediate(screenshot);

            Debug.Log($"[ColorBlindSimulator] Captured {type}: {filepath}");
        }

        /// <summary>
        /// Apply color transformation matrix to render texture
        /// </summary>
        private RenderTexture ApplyColorTransform(RenderTexture source, Matrix4x4 colorMatrix)
        {
            Material mat = new Material(Shader.Find("Hidden/ColorBlindSimulation"));
            mat.SetMatrix("_ColorMatrix", colorMatrix);

            RenderTexture result = RenderTexture.GetTemporary(source.width, source.height, 0);
            Graphics.Blit(source, result, mat);

            Object.DestroyImmediate(mat);
            return result;
        }

        /// <summary>
        /// Get color transformation matrix for simulation type
        /// Based on: https://www.inf.ufrgs.br/~oliveira/pubs_files/CVD_Simulation/CVD_Simulation.html
        /// </summary>
        private Matrix4x4 GetColorTransformMatrix(ColorBlindType type)
        {
            switch (type)
            {
                case ColorBlindType.Protanopia: // Red-blind
                    return new Matrix4x4(
                        new Vector4(0.567f, 0.433f, 0.000f, 0f),
                        new Vector4(0.558f, 0.442f, 0.000f, 0f),
                        new Vector4(0.000f, 0.242f, 0.758f, 0f),
                        new Vector4(0f, 0f, 0f, 1f)
                    );

                case ColorBlindType.Deuteranopia: // Green-blind
                    return new Matrix4x4(
                        new Vector4(0.625f, 0.375f, 0.000f, 0f),
                        new Vector4(0.700f, 0.300f, 0.000f, 0f),
                        new Vector4(0.000f, 0.300f, 0.700f, 0f),
                        new Vector4(0f, 0f, 0f, 1f)
                    );

                case ColorBlindType.Tritanopia: // Blue-blind
                    return new Matrix4x4(
                        new Vector4(0.950f, 0.050f, 0.000f, 0f),
                        new Vector4(0.000f, 0.433f, 0.567f, 0f),
                        new Vector4(0.000f, 0.475f, 0.525f, 0f),
                        new Vector4(0f, 0f, 0f, 1f)
                    );

                case ColorBlindType.Protanomaly: // Red-weak
                    return new Matrix4x4(
                        new Vector4(0.817f, 0.183f, 0.000f, 0f),
                        new Vector4(0.333f, 0.667f, 0.000f, 0f),
                        new Vector4(0.000f, 0.125f, 0.875f, 0f),
                        new Vector4(0f, 0f, 0f, 1f)
                    );

                case ColorBlindType.Deuteranomaly: // Green-weak (most common - 5% of males)
                    return new Matrix4x4(
                        new Vector4(0.800f, 0.200f, 0.000f, 0f),
                        new Vector4(0.258f, 0.742f, 0.000f, 0f),
                        new Vector4(0.000f, 0.142f, 0.858f, 0f),
                        new Vector4(0f, 0f, 0f, 1f)
                    );

                case ColorBlindType.Tritanomaly: // Blue-weak
                    return new Matrix4x4(
                        new Vector4(0.967f, 0.033f, 0.000f, 0f),
                        new Vector4(0.000f, 0.733f, 0.267f, 0f),
                        new Vector4(0.000f, 0.183f, 0.817f, 0f),
                        new Vector4(0f, 0f, 0f, 1f)
                    );

                case ColorBlindType.Achromatopsia: // Total color-blind (grayscale)
                    return new Matrix4x4(
                        new Vector4(0.299f, 0.587f, 0.114f, 0f),
                        new Vector4(0.299f, 0.587f, 0.114f, 0f),
                        new Vector4(0.299f, 0.587f, 0.114f, 0f),
                        new Vector4(0f, 0f, 0f, 1f)
                    );

                case ColorBlindType.Normal:
                default:
                    return Matrix4x4.identity;
            }
        }

        /// <summary>
        /// Generate HTML comparison page for all simulation types
        /// </summary>
        private void GenerateComparisonHTML(string sceneName, string outputDir, ColorBlindType[] types)
        {
            string htmlPath = Path.Combine(outputDir, "comparison.html");

            string html = $@"<!DOCTYPE html>
<html lang=""en"">
<head>
    <meta charset=""UTF-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>Color Blind Simulation - {sceneName}</title>
    <style>
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }}
        h1 {{
            text-align: center;
            color: #333;
        }}
        .grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }}
        .card {{
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            overflow: hidden;
        }}
        .card img {{
            width: 100%;
            display: block;
        }}
        .card-title {{
            padding: 15px;
            font-weight: bold;
            font-size: 18px;
        }}
        .card-description {{
            padding: 0 15px 15px;
            color: #666;
            font-size: 14px;
        }}
        .normal {{ border-top: 4px solid #28a745; }}
        .protanopia {{ border-top: 4px solid #dc3545; }}
        .deuteranopia {{ border-top: 4px solid #28a745; }}
        .tritanopia {{ border-top: 4px solid #007bff; }}
        .protanomaly {{ border-top: 4px solid #ffc107; }}
        .deuteranomaly {{ border-top: 4px solid #17a2b8; }}
        .tritanomaly {{ border-top: 4px solid #6f42c1; }}
        .achromatopsia {{ border-top: 4px solid #6c757d; }}
    </style>
</head>
<body>
    <h1>Color Blind Simulation Comparison</h1>
    <h2 style=""text-align: center; color: #666;"">Scene: {sceneName}</h2>
    <div class=""grid"">
";

            Dictionary<ColorBlindType, string> descriptions = new Dictionary<ColorBlindType, string>
            {
                { ColorBlindType.Normal, "Normal vision - baseline for comparison" },
                { ColorBlindType.Protanopia, "Protanopia: Red-blind (~1% of males)" },
                { ColorBlindType.Deuteranopia, "Deuteranopia: Green-blind (~1% of males)" },
                { ColorBlindType.Tritanopia, "Tritanopia: Blue-blind (~0.001% of population)" },
                { ColorBlindType.Protanomaly, "Protanomaly: Red-weak (~1% of males)" },
                { ColorBlindType.Deuteranomaly, "Deuteranomaly: Green-weak (~5% of males, most common)" },
                { ColorBlindType.Tritanomaly, "Tritanomaly: Blue-weak (~0.01% of population)" },
                { ColorBlindType.Achromatopsia, "Achromatopsia: Total color-blind (~0.003% of population)" }
            };

            foreach (ColorBlindType type in types)
            {
                string filename = $"{sceneName}_{type.ToString().ToLower()}.png";
                string cssClass = type.ToString().ToLower();
                string description = descriptions.ContainsKey(type) ? descriptions[type] : "";

                html += $@"
        <div class=""card {cssClass}"">
            <img src=""{filename}"" alt=""{type}"">
            <div class=""card-title"">{type}</div>
            <div class=""card-description"">{description}</div>
        </div>
";
            }

            html += @"
    </div>
</body>
</html>";

            File.WriteAllText(htmlPath, html);
            Debug.Log($"[ColorBlindSimulator] Generated comparison HTML: {htmlPath}");
        }

        /// <summary>
        /// Get all scene paths in the project
        /// </summary>
        private List<string> GetAllScenePaths()
        {
            List<string> scenePaths = new List<string>();

            // First check Build Settings
            foreach (EditorBuildSettingsScene scene in EditorBuildSettings.scenes)
            {
                if (scene.enabled && !string.IsNullOrEmpty(scene.path))
                {
                    scenePaths.Add(scene.path);
                }
            }

            // If no scenes in Build Settings, find all .unity files
            if (scenePaths.Count == 0)
            {
                string[] guids = AssetDatabase.FindAssets("t:Scene");
                foreach (string guid in guids)
                {
                    string scenePath = AssetDatabase.GUIDToAssetPath(guid);
                    scenePaths.Add(scenePath);
                }
            }

            return scenePaths;
        }

        /// <summary>
        /// Public static method for batch mode execution
        /// </summary>
        public static void CaptureAllSimulations()
        {
            var window = CreateInstance<ColorBlindSimulator>();
            window.CaptureAllScenes();
        }
    }
}
