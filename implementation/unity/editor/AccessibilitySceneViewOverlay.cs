using UnityEngine;
using UnityEditor;
using UnityEditor.Overlays;
using System.IO;
using System.Collections.Generic;
using System.Linq;

namespace AccessibilityStandardsUnity.Editor
{
    /// <summary>
    /// Scene View overlay that displays accessibility issues visually in the scene
    /// Shows icons and labels for GameObjects with accessibility concerns
    /// </summary>
    [Overlay(typeof(SceneView), "Accessibility Issues")]
    public class AccessibilitySceneViewOverlay : Overlay, ITransientOverlay
    {
        private AccessibilityAuditReport currentReport;
        private bool showOverlay = true;
        private bool showCritical = true;
        private bool showHigh = true;
        private bool showMedium = false;
        private bool showLow = false;
        private Vector2 scrollPosition;

        public bool visible => showOverlay;

        public override void OnCreated()
        {
            LoadAuditReport();
        }

        public override VisualElement CreatePanelContent()
        {
            VisualElement root = new VisualElement();
            root.style.width = 300;
            root.style.backgroundColor = new StyleColor(new Color(0.2f, 0.2f, 0.2f, 0.9f));
            root.style.paddingBottom = 5;
            root.style.paddingTop = 5;
            root.style.paddingLeft = 5;
            root.style.paddingRight = 5;

            // For simplicity, we'll use IMGUI inside the VisualElement
            IMGUIContainer imguiContainer = new IMGUIContainer(DrawOverlayGUI);
            root.Add(imguiContainer);

            return root;
        }

        private void DrawOverlayGUI()
        {
            EditorGUILayout.BeginVertical();

            GUILayout.Label("🔍 Accessibility Issues", EditorStyles.boldLabel);

            EditorGUILayout.BeginHorizontal();
            if (GUILayout.Button("Refresh", GUILayout.Width(70)))
            {
                LoadAuditReport();
            }

            showOverlay = GUILayout.Toggle(showOverlay, "Show", GUILayout.Width(60));
            EditorGUILayout.EndHorizontal();

            if (currentReport == null)
            {
                EditorGUILayout.HelpBox("No audit report found.", MessageType.Info);
                EditorGUILayout.EndVertical();
                return;
            }

            EditorGUILayout.Space(5);

            // Priority filters
            GUILayout.Label("Priorities:", EditorStyles.miniLabel);
            EditorGUILayout.BeginHorizontal();
            showCritical = GUILayout.Toggle(showCritical, "Critical", GUILayout.Width(70));
            showHigh = GUILayout.Toggle(showHigh, "High", GUILayout.Width(60));
            EditorGUILayout.EndHorizontal();
            EditorGUILayout.BeginHorizontal();
            showMedium = GUILayout.Toggle(showMedium, "Medium", GUILayout.Width(70));
            showLow = GUILayout.Toggle(showLow, "Low", GUILayout.Width(60));
            EditorGUILayout.EndHorizontal();

            EditorGUILayout.Space(5);

            // Summary
            if (currentReport.summary != null)
            {
                EditorGUILayout.LabelField("Compliance", $"{currentReport.complianceEstimate?.score ?? 0}%", EditorStyles.miniLabel);

                int visibleIssues = 0;
                if (showCritical) visibleIssues += currentReport.summary.criticalIssues;
                if (showHigh) visibleIssues += currentReport.summary.highPriorityIssues;
                if (showMedium) visibleIssues += currentReport.summary.mediumPriorityIssues;
                if (showLow) visibleIssues += currentReport.summary.lowPriorityIssues;

                EditorGUILayout.LabelField("Showing", $"{visibleIssues} issues", EditorStyles.miniLabel);
            }

            EditorGUILayout.Space(5);

            // Findings list (compact)
            List<Finding> visibleFindings = GetVisibleFindings();
            if (visibleFindings.Count > 0)
            {
                scrollPosition = EditorGUILayout.BeginScrollView(scrollPosition, GUILayout.MaxHeight(200));

                foreach (Finding finding in visibleFindings.Take(10))
                {
                    Color color = AuditDataParser.GetFindingColor(finding.priority);
                    Color prevColor = GUI.backgroundColor;
                    GUI.backgroundColor = color;

                    if (GUILayout.Button($"{GetPriorityIcon(finding.priority)} {finding.title}", EditorStyles.miniButton))
                    {
                        ShowFindingDetails(finding);
                    }

                    GUI.backgroundColor = prevColor;
                }

                if (visibleFindings.Count > 10)
                {
                    EditorGUILayout.LabelField($"... and {visibleFindings.Count - 10} more", EditorStyles.miniLabel);
                }

                EditorGUILayout.EndScrollView();
            }

            EditorGUILayout.EndVertical();
        }

        private List<Finding> GetVisibleFindings()
        {
            List<Finding> visible = new List<Finding>();

            if (currentReport?.findings == null) return visible;

            if (showCritical && currentReport.findings.critical != null)
                visible.AddRange(currentReport.findings.critical);
            if (showHigh && currentReport.findings.high != null)
                visible.AddRange(currentReport.findings.high);
            if (showMedium && currentReport.findings.medium != null)
                visible.AddRange(currentReport.findings.medium);
            if (showLow && currentReport.findings.low != null)
                visible.AddRange(currentReport.findings.low);

            return visible;
        }

        private string GetPriorityIcon(string priority)
        {
            switch (priority?.ToLower())
            {
                case "critical": return "🔴";
                case "high": return "🟠";
                case "medium": return "🟡";
                case "low": return "🟢";
                default: return "⚪";
            }
        }

        private void ShowFindingDetails(Finding finding)
        {
            string message = $"{finding.title}\n\n{finding.description}\n\nRecommendation:\n{finding.recommendation}";
            if (finding.wcagCriteria != null)
            {
                message += $"\n\nWCAG: {finding.wcagCriteria}";
            }
            EditorUtility.DisplayDialog($"{finding.priority} Priority Issue", message, "OK");
        }

        private void LoadAuditReport()
        {
            string projectPath = Directory.GetParent(Application.dataPath).FullName;
            string reportPath = Path.Combine(projectPath, "AccessibilityAudit", "accessibility-analysis.json");

            if (!File.Exists(reportPath))
            {
                currentReport = null;
                return;
            }

            try
            {
                string jsonText = File.ReadAllText(reportPath);
                currentReport = JsonUtility.FromJson<AccessibilityAuditReport>(jsonText);
            }
            catch (System.Exception ex)
            {
                Debug.LogError($"Failed to load audit report: {ex.Message}");
                currentReport = null;
            }
        }
    }

    /// <summary>
    /// Custom SceneView GUI for drawing accessibility indicators on GameObjects
    /// </summary>
    [InitializeOnLoad]
    public static class AccessibilitySceneViewGizmos
    {
        private static AccessibilityAuditReport currentReport;
        private static bool showGizmos = true;
        private static double lastLoadTime = 0;

        static AccessibilitySceneViewGizmos()
        {
            SceneView.duringSceneGui += OnSceneGUI;
            LoadAuditReport();
        }

        private static void OnSceneGUI(SceneView sceneView)
        {
            if (!showGizmos || currentReport == null)
                return;

            // Reload report periodically
            if (EditorApplication.timeSinceStartup - lastLoadTime > 10.0)
            {
                LoadAuditReport();
            }

            // Draw accessibility indicators for relevant GameObjects
            DrawAccessibilityIndicators();
        }

        private static void DrawAccessibilityIndicators()
        {
            if (currentReport?.findings == null)
                return;

            // Get all findings
            List<Finding> allFindings = AuditDataParser.GetAllFindings(currentReport.findings);

            // Group findings by affected scripts/components
            Dictionary<string, List<Finding>> scriptFindings = new Dictionary<string, List<Finding>>();
            foreach (Finding finding in allFindings)
            {
                if (finding.affectedFiles != null)
                {
                    foreach (string file in finding.affectedFiles)
                    {
                        string scriptName = Path.GetFileNameWithoutExtension(file);
                        if (!scriptFindings.ContainsKey(scriptName))
                        {
                            scriptFindings[scriptName] = new List<Finding>();
                        }
                        scriptFindings[scriptName].Add(finding);
                    }
                }
            }

            // Find GameObjects with affected scripts
            GameObject[] allObjects = Object.FindObjectsOfType<GameObject>();
            foreach (GameObject obj in allObjects)
            {
                MonoBehaviour[] components = obj.GetComponents<MonoBehaviour>();
                List<Finding> objectFindings = new List<Finding>();

                foreach (MonoBehaviour component in components)
                {
                    if (component == null) continue;
                    string componentType = component.GetType().Name;

                    if (scriptFindings.ContainsKey(componentType))
                    {
                        objectFindings.AddRange(scriptFindings[componentType]);
                    }
                }

                if (objectFindings.Count > 0)
                {
                    DrawObjectIndicator(obj, objectFindings);
                }
            }
        }

        private static void DrawObjectIndicator(GameObject obj, List<Finding> findings)
        {
            // Get highest priority finding
            Finding highestPriority = findings.OrderBy(f => GetPriorityValue(f.priority)).First();

            Vector3 position = obj.transform.position;
            Color color = AuditDataParser.GetFindingColor(highestPriority.priority);

            // Draw a colored sphere at the object's position
            Handles.color = color;
            float size = HandleUtility.GetHandleSize(position) * 0.1f;
            Handles.SphereHandleCap(0, position, Quaternion.identity, size, EventType.Repaint);

            // Draw label
            GUIStyle style = new GUIStyle();
            style.normal.textColor = color;
            style.fontSize = 10;
            style.fontStyle = FontStyle.Bold;

            string label = $"{GetPriorityIcon(highestPriority.priority)} {findings.Count}";
            Handles.Label(position + Vector3.up * size * 2, label, style);
        }

        private static int GetPriorityValue(string priority)
        {
            switch (priority?.ToLower())
            {
                case "critical": return 0;
                case "high": return 1;
                case "medium": return 2;
                case "low": return 3;
                default: return 999;
            }
        }

        private static string GetPriorityIcon(string priority)
        {
            switch (priority?.ToLower())
            {
                case "critical": return "🔴";
                case "high": return "🟠";
                case "medium": return "🟡";
                case "low": return "🟢";
                default: return "⚪";
            }
        }

        private static void LoadAuditReport()
        {
            lastLoadTime = EditorApplication.timeSinceStartup;

            string projectPath = Directory.GetParent(Application.dataPath).FullName;
            string reportPath = Path.Combine(projectPath, "AccessibilityAudit", "accessibility-analysis.json");

            if (!File.Exists(reportPath))
            {
                currentReport = null;
                return;
            }

            try
            {
                string jsonText = File.ReadAllText(reportPath);
                currentReport = JsonUtility.FromJson<AccessibilityAuditReport>(jsonText);
            }
            catch (System.Exception ex)
            {
                Debug.LogError($"Failed to load audit report: {ex.Message}");
                currentReport = null;
            }
        }

        [MenuItem("Window/Accessibility/Toggle Scene Gizmos")]
        private static void ToggleGizmos()
        {
            showGizmos = !showGizmos;
            SceneView.RepaintAll();
            Debug.Log($"Accessibility scene gizmos: {(showGizmos ? "enabled" : "disabled")}");
        }
    }
}
