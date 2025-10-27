using UnityEngine;
using UnityEditor;
using UnityEngine.UI;
using UnityEngine.EventSystems;
using System.IO;
using System.Collections.Generic;
using System.Linq;

#if UNITY_2023_2_OR_NEWER
using UnityEngine.Accessibility;
#endif

namespace AccessibilityStandardsUnity.Editor
{
    /// <summary>
    /// Inspector extension that shows accessibility recommendations and quick-fix buttons
    /// </summary>
    [InitializeOnLoad]
    public static class AccessibilityInspectorExtension
    {
        private static AccessibilityAuditReport currentReport;

        static AccessibilityInspectorExtension()
        {
            UnityEditor.Editor.finishedDefaultHeaderGUI += OnPostHeaderGUI;
            LoadAuditReport();
        }

        private static void OnPostHeaderGUI(UnityEditor.Editor editor)
        {
            if (editor.target == null || editor.targets.Length > 1)
                return;

            GameObject gameObject = null;

            // Check if it's a GameObject or Component
            if (editor.target is GameObject)
            {
                gameObject = editor.target as GameObject;
            }
            else if (editor.target is Component)
            {
                gameObject = (editor.target as Component).gameObject;
            }

            if (gameObject == null)
                return;

            DrawAccessibilitySection(gameObject, editor);
        }

        private static void DrawAccessibilitySection(GameObject gameObject, UnityEditor.Editor editor)
        {
            // Check if object has any accessibility-relevant components
            bool hasButton = gameObject.GetComponent<Button>() != null;
            bool hasSelectable = gameObject.GetComponent<Selectable>() != null;
            bool hasEventTrigger = gameObject.GetComponent<EventTrigger>() != null;
            bool hasCustomInteractable = HasCustomInteractableScript(gameObject);

            if (!hasButton && !hasSelectable && !hasEventTrigger && !hasCustomInteractable)
                return;

            EditorGUILayout.Space(5);
            EditorGUILayout.LabelField("", GUI.skin.horizontalSlider);

            GUILayout.BeginVertical(EditorStyles.helpBox);
            EditorGUILayout.LabelField("♿ Accessibility", EditorStyles.boldLabel);

            // Show relevant findings from audit report
            if (currentReport != null)
            {
                ShowRelevantFindings(gameObject);
            }

            EditorGUILayout.Space(5);

            // Quick fix buttons
            DrawQuickFixes(gameObject);

            GUILayout.EndVertical();
        }

        private static void ShowRelevantFindings(GameObject gameObject)
        {
            if (currentReport?.findings == null)
                return;

            // Get component types on this GameObject
            MonoBehaviour[] components = gameObject.GetComponents<MonoBehaviour>();
            List<string> componentNames = components
                .Where(c => c != null)
                .Select(c => c.GetType().Name)
                .ToList();

            // Find findings that reference these components
            List<Finding> relevantFindings = new List<Finding>();
            List<Finding> allFindings = AuditDataParser.GetAllFindings(currentReport.findings);

            foreach (Finding finding in allFindings)
            {
                if (finding.affectedFiles != null)
                {
                    foreach (string file in finding.affectedFiles)
                    {
                        string scriptName = Path.GetFileNameWithoutExtension(file);
                        if (componentNames.Contains(scriptName))
                        {
                            relevantFindings.Add(finding);
                            break;
                        }
                    }
                }
            }

            if (relevantFindings.Count > 0)
            {
                EditorGUILayout.HelpBox(
                    $"⚠️ {relevantFindings.Count} accessibility issue(s) detected in components on this GameObject.",
                    MessageType.Warning
                );

                foreach (Finding finding in relevantFindings.Take(3))
                {
                    Color color = AuditDataParser.GetFindingColor(finding.priority);
                    Color prevColor = GUI.backgroundColor;
                    GUI.backgroundColor = color * 0.5f;

                    GUILayout.BeginVertical(EditorStyles.helpBox);
                    EditorGUILayout.LabelField($"[{finding.priority?.ToUpper()}] {finding.title}", EditorStyles.wordWrappedLabel);
                    if (!string.IsNullOrEmpty(finding.recommendation))
                    {
                        EditorGUILayout.LabelField(finding.recommendation, EditorStyles.wordWrappedMiniLabel);
                    }
                    GUILayout.EndVertical();

                    GUI.backgroundColor = prevColor;
                }

                if (relevantFindings.Count > 3)
                {
                    EditorGUILayout.LabelField($"... and {relevantFindings.Count - 3} more issues", EditorStyles.miniLabel);
                }
            }
            else
            {
                EditorGUILayout.LabelField("✅ No issues detected", EditorStyles.miniLabel);
            }
        }

        private static void DrawQuickFixes(GameObject gameObject)
        {
            GUILayout.Label("Quick Fixes", EditorStyles.boldLabel);

            // Button-specific fixes
            Button button = gameObject.GetComponent<Button>();
            if (button != null)
            {
                DrawButtonQuickFixes(button);
            }

            // Selectable-specific fixes
            Selectable selectable = gameObject.GetComponent<Selectable>();
            if (selectable != null)
            {
                DrawSelectableQuickFixes(selectable);
            }

            // Screen reader support (Unity 2023.2+)
#if UNITY_2023_2_OR_NEWER
            DrawScreenReaderQuickFixes(gameObject);
#else
            EditorGUILayout.HelpBox(
                "Screen reader support requires Unity 2023.2 or newer.",
                MessageType.Info
            );
#endif

            // EventSystem check
            DrawEventSystemCheck();
        }

        private static void DrawButtonQuickFixes(Button button)
        {
            EditorGUILayout.LabelField("Button Accessibility", EditorStyles.miniLabel);

            EditorGUILayout.BeginHorizontal();

            // Navigation mode
            if (button.navigation.mode == Navigation.Mode.None)
            {
                if (GUILayout.Button("Enable Navigation", EditorStyles.miniButton))
                {
                    Undo.RecordObject(button, "Enable Button Navigation");
                    Navigation nav = button.navigation;
                    nav.mode = Navigation.Mode.Automatic;
                    button.navigation = nav;
                    EditorUtility.SetDirty(button);
                }
            }
            else
            {
                EditorGUILayout.LabelField($"Navigation: {button.navigation.mode}", EditorStyles.miniLabel);
            }

            // Transition
            if (button.transition == Selectable.Transition.None)
            {
                if (GUILayout.Button("Add Visual Feedback", EditorStyles.miniButton))
                {
                    Undo.RecordObject(button, "Set Button Transition");
                    button.transition = Selectable.Transition.ColorTint;
                    EditorUtility.SetDirty(button);
                }
            }

            EditorGUILayout.EndHorizontal();
        }

        private static void DrawSelectableQuickFixes(Selectable selectable)
        {
            // Only show if not already shown for Button
            if (selectable is Button) return;

            EditorGUILayout.LabelField("Selectable Accessibility", EditorStyles.miniLabel);

            if (selectable.navigation.mode == Navigation.Mode.None)
            {
                if (GUILayout.Button("Enable Keyboard Navigation", EditorStyles.miniButton))
                {
                    Undo.RecordObject(selectable, "Enable Navigation");
                    Navigation nav = selectable.navigation;
                    nav.mode = Navigation.Mode.Automatic;
                    selectable.navigation = nav;
                    EditorUtility.SetDirty(selectable);
                }
            }
        }

#if UNITY_2023_2_OR_NEWER
        private static void DrawScreenReaderQuickFixes(GameObject gameObject)
        {
            EditorGUILayout.LabelField("Screen Reader Support", EditorStyles.miniLabel);

            AccessibilityNode accessibilityNode = gameObject.GetComponent<AccessibilityNode>();

            if (accessibilityNode == null)
            {
                if (GUILayout.Button("Add Accessibility Node", EditorStyles.miniButton))
                {
                    Undo.AddComponent<AccessibilityNode>(gameObject);
                    EditorUtility.SetDirty(gameObject);
                }
            }
            else
            {
                // Show quick config options
                EditorGUILayout.BeginHorizontal();

                if (string.IsNullOrEmpty(accessibilityNode.label))
                {
                    if (GUILayout.Button("Set Label from Text", EditorStyles.miniButton))
                    {
                        SetAccessibilityLabelFromText(accessibilityNode);
                    }
                }

                if (GUILayout.Button("Configure Node", EditorStyles.miniButton))
                {
                    Selection.activeObject = accessibilityNode;
                }

                EditorGUILayout.EndHorizontal();
            }
        }

        private static void SetAccessibilityLabelFromText(AccessibilityNode node)
        {
            // Try to find text in children
            UnityEngine.UI.Text uiText = node.GetComponentInChildren<UnityEngine.UI.Text>();
            if (uiText != null && !string.IsNullOrEmpty(uiText.text))
            {
                Undo.RecordObject(node, "Set Accessibility Label");
                node.label = uiText.text;
                EditorUtility.SetDirty(node);
                return;
            }

            TMPro.TextMeshProUGUI tmpText = node.GetComponentInChildren<TMPro.TextMeshProUGUI>();
            if (tmpText != null && !string.IsNullOrEmpty(tmpText.text))
            {
                Undo.RecordObject(node, "Set Accessibility Label");
                node.label = tmpText.text;
                EditorUtility.SetDirty(node);
                return;
            }

            // Fallback to GameObject name
            Undo.RecordObject(node, "Set Accessibility Label");
            node.label = node.gameObject.name;
            EditorUtility.SetDirty(node);
        }
#endif

        private static void DrawEventSystemCheck()
        {
            EventSystem eventSystem = Object.FindObjectOfType<EventSystem>();

            if (eventSystem == null)
            {
                EditorGUILayout.HelpBox(
                    "⚠️ No EventSystem found in scene. Required for keyboard/controller navigation.",
                    MessageType.Warning
                );

                if (GUILayout.Button("Create EventSystem", EditorStyles.miniButton))
                {
                    GameObject eventSystemObj = new GameObject("EventSystem");
                    Undo.RegisterCreatedObjectUndo(eventSystemObj, "Create EventSystem");
                    eventSystemObj.AddComponent<EventSystem>();
                    eventSystemObj.AddComponent<StandaloneInputModule>();
                    Selection.activeGameObject = eventSystemObj;
                }
            }
        }

        private static bool HasCustomInteractableScript(GameObject gameObject)
        {
            // Check for common interaction patterns
            MonoBehaviour[] scripts = gameObject.GetComponents<MonoBehaviour>();

            foreach (MonoBehaviour script in scripts)
            {
                if (script == null) continue;

                System.Type type = script.GetType();
                string typeName = type.Name.ToLower();

                // Common interaction patterns
                if (typeName.Contains("interact") ||
                    typeName.Contains("clickable") ||
                    typeName.Contains("button") ||
                    typeName.Contains("press") ||
                    typeName.Contains("touch"))
                {
                    return true;
                }

                // Check for OnMouseDown, OnPointerClick, etc.
                if (type.GetMethod("OnMouseDown") != null ||
                    type.GetMethod("OnMouseUp") != null ||
                    type.GetMethod("OnPointerClick") != null)
                {
                    return true;
                }
            }

            return false;
        }

        private static void LoadAuditReport()
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
    /// Custom property drawer for components to show accessibility warnings
    /// </summary>
    [CustomEditor(typeof(MonoBehaviour), true)]
    [CanEditMultipleObjects]
    public class AccessibilityMonoBehaviourEditor : UnityEditor.Editor
    {
        private static AccessibilityAuditReport report;
        private static double lastLoadTime = 0;

        public override void OnInspectorGUI()
        {
            DrawDefaultInspector();

            // Reload report periodically
            if (EditorApplication.timeSinceStartup - lastLoadTime > 10.0)
            {
                LoadReportIfNeeded();
            }

            if (report == null) return;

            MonoBehaviour script = target as MonoBehaviour;
            if (script == null) return;

            // Check if this script has accessibility findings
            List<Finding> scriptFindings = GetFindingsForScript(script.GetType().Name);

            if (scriptFindings.Count > 0)
            {
                EditorGUILayout.Space(10);
                EditorGUILayout.HelpBox(
                    $"⚠️ This component has {scriptFindings.Count} accessibility issue(s). Check the Accessibility Auditor window for details.",
                    MessageType.Warning
                );

                if (GUILayout.Button("Open Accessibility Auditor"))
                {
                    AccessibilityAuditorWindow.ShowWindow();
                }
            }
        }

        private static void LoadReportIfNeeded()
        {
            lastLoadTime = EditorApplication.timeSinceStartup;

            string projectPath = Directory.GetParent(Application.dataPath).FullName;
            string reportPath = Path.Combine(projectPath, "AccessibilityAudit", "accessibility-analysis.json");

            if (!File.Exists(reportPath))
            {
                report = null;
                return;
            }

            try
            {
                string jsonText = File.ReadAllText(reportPath);
                report = JsonUtility.FromJson<AccessibilityAuditReport>(jsonText);
            }
            catch
            {
                report = null;
            }
        }

        private static List<Finding> GetFindingsForScript(string scriptName)
        {
            List<Finding> findings = new List<Finding>();

            if (report?.findings == null) return findings;

            List<Finding> allFindings = AuditDataParser.GetAllFindings(report.findings);

            foreach (Finding finding in allFindings)
            {
                if (finding.affectedFiles != null)
                {
                    foreach (string file in finding.affectedFiles)
                    {
                        if (Path.GetFileNameWithoutExtension(file) == scriptName)
                        {
                            findings.Add(finding);
                            break;
                        }
                    }
                }
            }

            return findings;
        }
    }
}
