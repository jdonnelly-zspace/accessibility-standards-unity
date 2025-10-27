using UnityEngine;
using UnityEditor;
using System.IO;

namespace AccessibilityStandardsUnity.Editor
{
    /// <summary>
    /// Editor preferences and settings for the accessibility audit system
    /// </summary>
    public class AccessibilityEditorSettings : ScriptableObject
    {
        private const string SETTINGS_PATH = "ProjectSettings/AccessibilityEditorSettings.asset";
        private const string PREFS_PREFIX = "AccessibilityStandards_";

        // Audit Settings
        public bool autoRunOnBuild = false;
        public bool failBuildOnCritical = false;
        public bool trackCompliance = true;
        public bool verboseLogging = false;

        // Display Settings
        public bool showSceneGizmos = true;
        public bool showInspectorWarnings = true;
        public bool showSceneOverlay = true;
        public bool showCriticalOnly = false;

        // Framework Settings
        public string frameworkPath = "";
        public string nodePath = "node";

        // Notification Settings
        public bool showNotifications = true;
        public bool notifyOnNewFindings = true;
        public bool notifyOnRegression = true;

        private static AccessibilityEditorSettings instance;

        public static AccessibilityEditorSettings GetOrCreateSettings()
        {
            if (instance != null)
                return instance;

            // Try to load from project settings
            if (File.Exists(SETTINGS_PATH))
            {
                string json = File.ReadAllText(SETTINGS_PATH);
                instance = ScriptableObject.CreateInstance<AccessibilityEditorSettings>();
                JsonUtility.FromJsonOverwrite(json, instance);
                return instance;
            }

            // Create new settings
            instance = ScriptableObject.CreateInstance<AccessibilityEditorSettings>();
            instance.LoadFromEditorPrefs();
            return instance;
        }

        public void SaveSettings()
        {
            // Save to project settings
            string directory = Path.GetDirectoryName(SETTINGS_PATH);
            if (!Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }

            string json = JsonUtility.ToJson(this, true);
            File.WriteAllText(SETTINGS_PATH, json);

            // Also save to EditorPrefs for backwards compatibility
            SaveToEditorPrefs();
        }

        private void LoadFromEditorPrefs()
        {
            autoRunOnBuild = EditorPrefs.GetBool(PREFS_PREFIX + "AutoRunOnBuild", false);
            failBuildOnCritical = EditorPrefs.GetBool(PREFS_PREFIX + "FailBuildOnCritical", false);
            trackCompliance = EditorPrefs.GetBool(PREFS_PREFIX + "TrackCompliance", true);
            verboseLogging = EditorPrefs.GetBool(PREFS_PREFIX + "VerboseLogging", false);
            showSceneGizmos = EditorPrefs.GetBool(PREFS_PREFIX + "ShowSceneGizmos", true);
            showInspectorWarnings = EditorPrefs.GetBool(PREFS_PREFIX + "ShowInspectorWarnings", true);
            showSceneOverlay = EditorPrefs.GetBool(PREFS_PREFIX + "ShowSceneOverlay", true);
            showCriticalOnly = EditorPrefs.GetBool(PREFS_PREFIX + "ShowCriticalOnly", false);
            frameworkPath = EditorPrefs.GetString(PREFS_PREFIX + "FrameworkPath", "");
            nodePath = EditorPrefs.GetString(PREFS_PREFIX + "NodePath", "node");
            showNotifications = EditorPrefs.GetBool(PREFS_PREFIX + "ShowNotifications", true);
            notifyOnNewFindings = EditorPrefs.GetBool(PREFS_PREFIX + "NotifyOnNewFindings", true);
            notifyOnRegression = EditorPrefs.GetBool(PREFS_PREFIX + "NotifyOnRegression", true);
        }

        private void SaveToEditorPrefs()
        {
            EditorPrefs.SetBool(PREFS_PREFIX + "AutoRunOnBuild", autoRunOnBuild);
            EditorPrefs.SetBool(PREFS_PREFIX + "FailBuildOnCritical", failBuildOnCritical);
            EditorPrefs.SetBool(PREFS_PREFIX + "TrackCompliance", trackCompliance);
            EditorPrefs.SetBool(PREFS_PREFIX + "VerboseLogging", verboseLogging);
            EditorPrefs.SetBool(PREFS_PREFIX + "ShowSceneGizmos", showSceneGizmos);
            EditorPrefs.SetBool(PREFS_PREFIX + "ShowInspectorWarnings", showInspectorWarnings);
            EditorPrefs.SetBool(PREFS_PREFIX + "ShowSceneOverlay", showSceneOverlay);
            EditorPrefs.SetBool(PREFS_PREFIX + "ShowCriticalOnly", showCriticalOnly);
            EditorPrefs.SetString(PREFS_PREFIX + "FrameworkPath", frameworkPath);
            EditorPrefs.SetString(PREFS_PREFIX + "NodePath", nodePath);
            EditorPrefs.SetBool(PREFS_PREFIX + "ShowNotifications", showNotifications);
            EditorPrefs.SetBool(PREFS_PREFIX + "NotifyOnNewFindings", notifyOnNewFindings);
            EditorPrefs.SetBool(PREFS_PREFIX + "NotifyOnRegression", notifyOnRegression);
        }
    }

    /// <summary>
    /// Settings provider for Unity's Project Settings window
    /// </summary>
    public class AccessibilitySettingsProvider : SettingsProvider
    {
        private AccessibilityEditorSettings settings;
        private SerializedObject serializedSettings;

        public AccessibilitySettingsProvider(string path, SettingsScope scope = SettingsScope.Project)
            : base(path, scope)
        {
        }

        public override void OnActivate(string searchContext, UnityEngine.UIElements.VisualElement rootElement)
        {
            settings = AccessibilityEditorSettings.GetOrCreateSettings();
            serializedSettings = new SerializedObject(settings);
        }

        public override void OnGUI(string searchContext)
        {
            EditorGUILayout.Space(10);
            EditorGUILayout.LabelField("Accessibility Standards Unity", EditorStyles.largeLabel);
            EditorGUILayout.LabelField("Configure audit behavior and display preferences", EditorStyles.miniLabel);
            EditorGUILayout.Space(10);

            // Audit Settings
            EditorGUILayout.LabelField("Audit Settings", EditorStyles.boldLabel);
            settings.autoRunOnBuild = EditorGUILayout.Toggle(
                new GUIContent("Auto-Run on Build", "Automatically run accessibility audit when building the project"),
                settings.autoRunOnBuild
            );

            settings.failBuildOnCritical = EditorGUILayout.Toggle(
                new GUIContent("Fail Build on Critical Issues", "Prevent build if critical accessibility issues are found"),
                settings.failBuildOnCritical
            );

            settings.trackCompliance = EditorGUILayout.Toggle(
                new GUIContent("Track Compliance History", "Save audit results to compliance-history/ for trend tracking"),
                settings.trackCompliance
            );

            settings.verboseLogging = EditorGUILayout.Toggle(
                new GUIContent("Verbose Logging", "Enable detailed console logging during audits"),
                settings.verboseLogging
            );

            EditorGUILayout.Space(10);

            // Display Settings
            EditorGUILayout.LabelField("Display Settings", EditorStyles.boldLabel);
            settings.showSceneGizmos = EditorGUILayout.Toggle(
                new GUIContent("Show Scene Gizmos", "Display accessibility issue indicators in Scene view"),
                settings.showSceneGizmos
            );

            settings.showInspectorWarnings = EditorGUILayout.Toggle(
                new GUIContent("Show Inspector Warnings", "Display accessibility warnings in the Inspector"),
                settings.showInspectorWarnings
            );

            settings.showSceneOverlay = EditorGUILayout.Toggle(
                new GUIContent("Show Scene Overlay", "Display accessibility overlay panel in Scene view"),
                settings.showSceneOverlay
            );

            settings.showCriticalOnly = EditorGUILayout.Toggle(
                new GUIContent("Show Critical Only", "Only display critical issues in Scene view"),
                settings.showCriticalOnly
            );

            EditorGUILayout.Space(10);

            // Framework Settings
            EditorGUILayout.LabelField("Framework Settings", EditorStyles.boldLabel);

            EditorGUILayout.BeginHorizontal();
            settings.frameworkPath = EditorGUILayout.TextField(
                new GUIContent("Framework Path", "Path to accessibility-standards-unity (leave empty for auto-detect)"),
                settings.frameworkPath
            );
            if (GUILayout.Button("Browse", GUILayout.Width(80)))
            {
                string path = EditorUtility.OpenFolderPanel("Select Framework Directory", "", "");
                if (!string.IsNullOrEmpty(path))
                {
                    settings.frameworkPath = path;
                }
            }
            EditorGUILayout.EndHorizontal();

            settings.nodePath = EditorGUILayout.TextField(
                new GUIContent("Node.js Path", "Path to Node.js executable (default: 'node' in PATH)"),
                settings.nodePath
            );

            if (GUILayout.Button("Auto-Detect Framework", GUILayout.Width(150)))
            {
                string detected = DetectFrameworkPath();
                if (!string.IsNullOrEmpty(detected))
                {
                    settings.frameworkPath = detected;
                    EditorUtility.DisplayDialog("Success", $"Framework detected at:\n{detected}", "OK");
                }
                else
                {
                    EditorUtility.DisplayDialog("Not Found", "Could not auto-detect framework path. Please set it manually.", "OK");
                }
            }

            EditorGUILayout.Space(10);

            // Notification Settings
            EditorGUILayout.LabelField("Notification Settings", EditorStyles.boldLabel);
            settings.showNotifications = EditorGUILayout.Toggle(
                new GUIContent("Show Notifications", "Display editor notifications for audit events"),
                settings.showNotifications
            );

            if (settings.showNotifications)
            {
                EditorGUI.indentLevel++;
                settings.notifyOnNewFindings = EditorGUILayout.Toggle(
                    new GUIContent("Notify on New Findings", "Show notification when new accessibility issues are detected"),
                    settings.notifyOnNewFindings
                );

                settings.notifyOnRegression = EditorGUILayout.Toggle(
                    new GUIContent("Notify on Regression", "Show notification when accessibility score decreases"),
                    settings.notifyOnRegression
                );
                EditorGUI.indentLevel--;
            }

            EditorGUILayout.Space(10);

            // Actions
            EditorGUILayout.BeginHorizontal();

            if (GUILayout.Button("Save Settings"))
            {
                settings.SaveSettings();
                EditorUtility.DisplayDialog("Settings Saved", "Accessibility settings have been saved.", "OK");
            }

            if (GUILayout.Button("Reset to Defaults"))
            {
                if (EditorUtility.DisplayDialog("Reset Settings", "Are you sure you want to reset all accessibility settings to default values?", "Yes", "Cancel"))
                {
                    settings = ScriptableObject.CreateInstance<AccessibilityEditorSettings>();
                    settings.SaveSettings();
                }
            }

            EditorGUILayout.EndHorizontal();

            EditorGUILayout.Space(20);

            // Quick Actions
            EditorGUILayout.LabelField("Quick Actions", EditorStyles.boldLabel);

            if (GUILayout.Button("Open Accessibility Auditor Window"))
            {
                AccessibilityAuditorWindow.ShowWindow();
            }

            if (GUILayout.Button("Run Audit Now"))
            {
                AccessibilityAuditorWindow window = EditorWindow.GetWindow<AccessibilityAuditorWindow>("Accessibility Auditor");
                window.Show();
                // Note: Actual audit run would be triggered through the window's RunAudit method
            }

            EditorGUILayout.Space(10);

            // Documentation Links
            EditorGUILayout.LabelField("Resources", EditorStyles.boldLabel);

            if (GUILayout.Button("View Documentation", EditorStyles.linkLabel))
            {
                Application.OpenURL("https://github.com/zSpace-Research/accessibility-standards-unity");
            }

            if (GUILayout.Button("WCAG 2.2 Guidelines", EditorStyles.linkLabel))
            {
                Application.OpenURL("https://www.w3.org/WAI/WCAG22/quickref/");
            }

            if (GUILayout.Button("Unity Accessibility API", EditorStyles.linkLabel))
            {
                Application.OpenURL("https://docs.unity3d.com/Manual/UIE-accessibility.html");
            }
        }

        private string DetectFrameworkPath()
        {
            string projectPath = Directory.GetParent(Application.dataPath).FullName;

            // 1. Check node_modules in project
            string nodeModulesPath = Path.Combine(projectPath, "node_modules", "accessibility-standards-unity");
            if (Directory.Exists(nodeModulesPath))
                return nodeModulesPath;

            // 2. Check parent directory (monorepo structure)
            string parentPath = Directory.GetParent(projectPath)?.FullName;
            if (parentPath != null)
            {
                string parentFramework = Path.Combine(parentPath, "accessibility-standards-unity");
                if (Directory.Exists(parentFramework))
                    return parentFramework;
            }

            // 3. Check for framework in same parent as Unity project
            if (parentPath != null)
            {
                foreach (string dir in Directory.GetDirectories(parentPath))
                {
                    if (Path.GetFileName(dir).Contains("accessibility-standards-unity"))
                        return dir;
                }
            }

            return null;
        }

        [SettingsProvider]
        public static SettingsProvider CreateAccessibilitySettingsProvider()
        {
            var provider = new AccessibilitySettingsProvider("Project/Accessibility Standards", SettingsScope.Project);
            provider.keywords = new[] { "accessibility", "audit", "wcag", "a11y", "compliance" };
            return provider;
        }
    }

    /// <summary>
    /// Menu items for quick access to accessibility tools
    /// </summary>
    public static class AccessibilityMenuItems
    {
        [MenuItem("Window/Accessibility/Auditor")]
        private static void OpenAuditorWindow()
        {
            AccessibilityAuditorWindow.ShowWindow();
        }

        [MenuItem("Window/Accessibility/Settings")]
        private static void OpenSettings()
        {
            SettingsService.OpenProjectSettings("Project/Accessibility Standards");
        }

        [MenuItem("Window/Accessibility/Toggle Scene Gizmos _F12")]
        private static void ToggleSceneGizmos()
        {
            AccessibilityEditorSettings settings = AccessibilityEditorSettings.GetOrCreateSettings();
            settings.showSceneGizmos = !settings.showSceneGizmos;
            settings.SaveSettings();
            SceneView.RepaintAll();
            Debug.Log($"Accessibility scene gizmos: {(settings.showSceneGizmos ? "enabled" : "disabled")}");
        }

        [MenuItem("Window/Accessibility/Open Audit Reports Folder")]
        private static void OpenReportsFolder()
        {
            string projectPath = Directory.GetParent(Application.dataPath).FullName;
            string reportsPath = Path.Combine(projectPath, "AccessibilityAudit");

            if (Directory.Exists(reportsPath))
            {
                EditorUtility.RevealInFinder(reportsPath);
            }
            else
            {
                EditorUtility.DisplayDialog("Not Found", "No audit reports found. Run an audit first.", "OK");
            }
        }

        [MenuItem("Window/Accessibility/Documentation")]
        private static void OpenDocumentation()
        {
            Application.OpenURL("https://github.com/zSpace-Research/accessibility-standards-unity");
        }
    }
}
