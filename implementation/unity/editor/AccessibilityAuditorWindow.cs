using UnityEngine;
using UnityEditor;
using System;
using System.IO;
using System.Diagnostics;
using System.Collections.Generic;
using System.Linq;

namespace AccessibilityStandardsUnity.Editor
{
    /// <summary>
    /// Custom Editor window for running accessibility audits and viewing results
    /// Integrates with the Node.js-based audit system
    /// </summary>
    public class AccessibilityAuditorWindow : EditorWindow
    {
        // UI State
        private Vector2 scrollPosition;
        private AccessibilityAuditReport currentReport;
        private string auditReportPath;
        private bool isAuditRunning = false;
        private string auditStatus = "";
        private int selectedTab = 0;
        private string[] tabNames = { "Overview", "Findings", "Statistics", "Recommendations" };

        // Filters
        private bool showCritical = true;
        private bool showHigh = true;
        private bool showMedium = true;
        private bool showLow = true;
        private string searchFilter = "";
        private string categoryFilter = "All";

        // Foldouts
        private Dictionary<string, bool> findingFoldouts = new Dictionary<string, bool>();

        // Styles
        private GUIStyle headerStyle;
        private GUIStyle subHeaderStyle;
        private GUIStyle findingBoxStyle;
        private bool stylesInitialized = false;

        [MenuItem("Window/Accessibility/Auditor")]
        public static void ShowWindow()
        {
            AccessibilityAuditorWindow window = GetWindow<AccessibilityAuditorWindow>("Accessibility Auditor");
            window.minSize = new Vector2(600, 400);
            window.Show();
        }

        private void OnEnable()
        {
            // Try to load existing audit report
            string projectPath = Directory.GetParent(Application.dataPath).FullName;
            auditReportPath = Path.Combine(projectPath, "AccessibilityAudit", "accessibility-analysis.json");

            if (File.Exists(auditReportPath))
            {
                LoadAuditReport();
            }
        }

        private void InitializeStyles()
        {
            if (stylesInitialized) return;

            headerStyle = new GUIStyle(EditorStyles.boldLabel)
            {
                fontSize = 16,
                margin = new RectOffset(0, 0, 10, 10)
            };

            subHeaderStyle = new GUIStyle(EditorStyles.boldLabel)
            {
                fontSize = 13
            };

            findingBoxStyle = new GUIStyle(GUI.skin.box)
            {
                padding = new RectOffset(10, 10, 10, 10),
                margin = new RectOffset(0, 0, 5, 5)
            };

            stylesInitialized = true;
        }

        private void OnGUI()
        {
            InitializeStyles();

            scrollPosition = EditorGUILayout.BeginScrollView(scrollPosition);

            // Header
            GUILayout.Label("🔍 Accessibility Auditor", headerStyle);
            EditorGUILayout.Space(10);

            // Audit Controls
            DrawAuditControls();
            EditorGUILayout.Space(10);

            // Report Display
            if (currentReport != null)
            {
                DrawReportTabs();
            }
            else if (!string.IsNullOrEmpty(auditStatus))
            {
                EditorGUILayout.HelpBox(auditStatus, MessageType.Info);
            }
            else
            {
                EditorGUILayout.HelpBox("No audit report available. Run an audit to generate one.", MessageType.Info);
            }

            EditorGUILayout.EndScrollView();
        }

        private void DrawAuditControls()
        {
            EditorGUILayout.BeginVertical(EditorStyles.helpBox);
            GUILayout.Label("Audit Controls", EditorStyles.boldLabel);

            EditorGUILayout.BeginHorizontal();

            GUI.enabled = !isAuditRunning;
            if (GUILayout.Button("🚀 Run Audit", GUILayout.Height(30), GUILayout.Width(150)))
            {
                RunAudit();
            }

            if (GUILayout.Button("📊 Run with Compliance Tracking", GUILayout.Height(30), GUILayout.Width(200)))
            {
                RunAudit("--track-compliance");
            }

            GUI.enabled = true;

            if (currentReport != null)
            {
                if (GUILayout.Button("🔄 Refresh", GUILayout.Height(30), GUILayout.Width(100)))
                {
                    LoadAuditReport();
                }

                if (GUILayout.Button("📂 Open Report Folder", GUILayout.Height(30)))
                {
                    string reportDir = Path.GetDirectoryName(auditReportPath);
                    if (Directory.Exists(reportDir))
                    {
                        EditorUtility.RevealInFinder(reportDir);
                    }
                }
            }

            EditorGUILayout.EndHorizontal();

            if (isAuditRunning)
            {
                EditorGUILayout.HelpBox("Audit in progress... This may take a minute.", MessageType.Info);
                EditorGUI.ProgressBar(EditorGUILayout.GetControlRect(), 0.5f, "Running audit...");
            }
            else if (!string.IsNullOrEmpty(auditStatus))
            {
                EditorGUILayout.HelpBox(auditStatus, MessageType.Info);
            }

            EditorGUILayout.EndVertical();
        }

        private void DrawReportTabs()
        {
            selectedTab = GUILayout.Toolbar(selectedTab, tabNames);
            EditorGUILayout.Space(10);

            switch (selectedTab)
            {
                case 0:
                    DrawOverviewTab();
                    break;
                case 1:
                    DrawFindingsTab();
                    break;
                case 2:
                    DrawStatisticsTab();
                    break;
                case 3:
                    DrawRecommendationsTab();
                    break;
            }
        }

        private void DrawOverviewTab()
        {
            EditorGUILayout.BeginVertical(EditorStyles.helpBox);
            GUILayout.Label("📋 Audit Overview", subHeaderStyle);

            // Metadata
            if (currentReport.metadata != null)
            {
                EditorGUILayout.LabelField("Project", currentReport.metadata.appName);
                EditorGUILayout.LabelField("Scanned", currentReport.metadata.scannedDate);
                EditorGUILayout.LabelField("Framework Version", currentReport.metadata.version);
            }

            EditorGUILayout.Space(10);

            // Compliance Score
            if (currentReport.complianceEstimate != null)
            {
                GUILayout.Label("Compliance Score", EditorStyles.boldLabel);

                Color scoreColor = AuditDataParser.GetComplianceColor(currentReport.complianceEstimate.score);
                Color previousColor = GUI.backgroundColor;
                GUI.backgroundColor = scoreColor;

                EditorGUILayout.BeginVertical(EditorStyles.helpBox);
                GUILayout.Label($"{currentReport.complianceEstimate.score}%", new GUIStyle(EditorStyles.boldLabel) { fontSize = 24 });
                GUILayout.Label(currentReport.complianceEstimate.level);
                EditorGUILayout.EndVertical();

                GUI.backgroundColor = previousColor;

                EditorGUILayout.Space(5);
                EditorGUILayout.LabelField("WCAG Level A", currentReport.complianceEstimate.wcagLevelA ? "✅ Passed" : "❌ Not Met");
                EditorGUILayout.LabelField("WCAG Level AA", currentReport.complianceEstimate.wcagLevelAA ? "✅ Passed" : "❌ Not Met");
            }

            EditorGUILayout.Space(10);

            // Summary
            if (currentReport.summary != null)
            {
                GUILayout.Label("Summary", EditorStyles.boldLabel);
                EditorGUILayout.LabelField("Scenes Analyzed", currentReport.summary.totalScenes.ToString());
                EditorGUILayout.LabelField("Scripts Analyzed", currentReport.summary.totalScripts.ToString());
                EditorGUILayout.LabelField("Total Findings", currentReport.summary.totalFindings.ToString());

                EditorGUILayout.Space(5);

                DrawFindingsSummary();
            }

            EditorGUILayout.EndVertical();
        }

        private void DrawFindingsSummary()
        {
            if (currentReport.summary == null) return;

            EditorGUILayout.BeginVertical(EditorStyles.helpBox);
            GUILayout.Label("Findings by Priority", EditorStyles.boldLabel);

            DrawFindingRow("🔴 Critical", currentReport.summary.criticalIssues, new Color(0.8f, 0.1f, 0.1f));
            DrawFindingRow("🟠 High", currentReport.summary.highPriorityIssues, new Color(0.9f, 0.5f, 0.1f));
            DrawFindingRow("🟡 Medium", currentReport.summary.mediumPriorityIssues, new Color(0.9f, 0.8f, 0.1f));
            DrawFindingRow("🟢 Low", currentReport.summary.lowPriorityIssues, new Color(0.5f, 0.7f, 1.0f));

            EditorGUILayout.EndVertical();
        }

        private void DrawFindingRow(string label, int count, Color color)
        {
            EditorGUILayout.BeginHorizontal();
            GUILayout.Label(label, GUILayout.Width(100));

            Color previousColor = GUI.backgroundColor;
            GUI.backgroundColor = color;
            GUILayout.Box(count.ToString(), GUILayout.Width(50));
            GUI.backgroundColor = previousColor;

            EditorGUILayout.EndHorizontal();
        }

        private void DrawFindingsTab()
        {
            if (currentReport.findings == null) return;

            // Filters
            EditorGUILayout.BeginVertical(EditorStyles.helpBox);
            GUILayout.Label("🔎 Filters", EditorStyles.boldLabel);

            EditorGUILayout.BeginHorizontal();
            GUILayout.Label("Priority:", GUILayout.Width(60));
            showCritical = GUILayout.Toggle(showCritical, "Critical", GUILayout.Width(70));
            showHigh = GUILayout.Toggle(showHigh, "High", GUILayout.Width(60));
            showMedium = GUILayout.Toggle(showMedium, "Medium", GUILayout.Width(70));
            showLow = GUILayout.Toggle(showLow, "Low", GUILayout.Width(60));
            EditorGUILayout.EndHorizontal();

            searchFilter = EditorGUILayout.TextField("Search", searchFilter);

            EditorGUILayout.EndVertical();
            EditorGUILayout.Space(10);

            // Findings list
            List<Finding> allFindings = GetFilteredFindings();

            if (allFindings.Count == 0)
            {
                EditorGUILayout.HelpBox("No findings match the current filters.", MessageType.Info);
                return;
            }

            GUILayout.Label($"Showing {allFindings.Count} findings", EditorStyles.miniLabel);

            foreach (Finding finding in allFindings)
            {
                DrawFinding(finding);
            }
        }

        private void DrawFinding(Finding finding)
        {
            string foldoutKey = finding.id ?? finding.title;
            if (!findingFoldouts.ContainsKey(foldoutKey))
            {
                findingFoldouts[foldoutKey] = false;
            }

            Color previousColor = GUI.backgroundColor;
            GUI.backgroundColor = AuditDataParser.GetFindingColor(finding.priority);

            EditorGUILayout.BeginVertical(findingBoxStyle);

            // Header with foldout
            EditorGUILayout.BeginHorizontal();
            findingFoldouts[foldoutKey] = EditorGUILayout.Foldout(findingFoldouts[foldoutKey], "", true);
            GUILayout.Label($"[{finding.priority?.ToUpper() ?? "UNKNOWN"}] {finding.title}", EditorStyles.boldLabel);
            EditorGUILayout.EndHorizontal();

            // Expanded details
            if (findingFoldouts[foldoutKey])
            {
                GUI.backgroundColor = previousColor;

                EditorGUILayout.BeginVertical(EditorStyles.helpBox);

                if (!string.IsNullOrEmpty(finding.wcagCriteria))
                {
                    EditorGUILayout.LabelField("WCAG Criteria", AuditDataParser.FormatWCAGCriteria(finding.wcagCriteria));
                }

                if (!string.IsNullOrEmpty(finding.description))
                {
                    EditorGUILayout.Space(5);
                    EditorGUILayout.LabelField("Description", EditorStyles.wordWrappedLabel);
                    EditorGUILayout.LabelField(finding.description, EditorStyles.wordWrappedMiniLabel);
                }

                if (!string.IsNullOrEmpty(finding.recommendation))
                {
                    EditorGUILayout.Space(5);
                    EditorGUILayout.LabelField("Recommendation", EditorStyles.wordWrappedLabel);
                    EditorGUILayout.LabelField(finding.recommendation, EditorStyles.wordWrappedMiniLabel);
                }

                if (finding.affectedFiles != null && finding.affectedFiles.Count > 0)
                {
                    EditorGUILayout.Space(5);
                    EditorGUILayout.LabelField("Affected Files", EditorStyles.boldLabel);
                    foreach (string file in finding.affectedFiles.Take(5))
                    {
                        if (GUILayout.Button(file, EditorStyles.linkLabel))
                        {
                            OpenScriptAtFile(file);
                        }
                    }
                    if (finding.affectedFiles.Count > 5)
                    {
                        EditorGUILayout.LabelField($"... and {finding.affectedFiles.Count - 5} more");
                    }
                }

                EditorGUILayout.EndVertical();
            }
            else
            {
                GUI.backgroundColor = previousColor;
            }

            EditorGUILayout.EndVertical();
            EditorGUILayout.Space(5);
        }

        private void DrawStatisticsTab()
        {
            if (currentReport.statistics == null) return;

            EditorGUILayout.BeginVertical(EditorStyles.helpBox);
            GUILayout.Label("📊 Statistics", subHeaderStyle);

            // Keyboard Support
            EditorGUILayout.Space(10);
            GUILayout.Label("⌨️ Keyboard Support", EditorStyles.boldLabel);
            DrawStatistic("Keyboard Support Found", currentReport.statistics.keyboardSupportFound ? "✅ Yes" : "❌ No");
            DrawStatistic("Confidence Score", $"{(currentReport.statistics.keyboardConfidenceScore * 100):F1}%");
            DrawStatistic("Input System Used", currentReport.statistics.inputSystemUsed ? "✅ Yes" : "❌ No");
            DrawStatistic("Event System Configured", currentReport.statistics.eventSystemConfigured ? "✅ Yes" : "❌ No");

            // UI Toolkit
            if (currentReport.statistics.uiToolkitFound)
            {
                EditorGUILayout.Space(10);
                GUILayout.Label("🎨 UI Toolkit", EditorStyles.boldLabel);
                DrawStatistic("UXML Files Analyzed", currentReport.statistics.uxmlFilesAnalyzed.ToString());
                DrawStatistic("USS Files Analyzed", currentReport.statistics.ussFilesAnalyzed.ToString());
                DrawStatistic("Total UI Elements", currentReport.statistics.totalUIElements.ToString());
                DrawStatistic("Focusable Elements", currentReport.statistics.focusableElements.ToString());
                DrawStatistic("Tab Order Defined", currentReport.statistics.tabOrderDefined ? "✅ Yes" : "❌ No");
                DrawStatistic("Confidence Score", $"{(currentReport.statistics.uiToolkitConfidenceScore * 100):F1}%");
            }

            // XR Capabilities
            if (currentReport.statistics.xrCapabilitiesDetected)
            {
                EditorGUILayout.Space(10);
                GUILayout.Label("🥽 XR Capabilities", EditorStyles.boldLabel);
                DrawStatistic("XR SDKs Detected", string.Join(", ", currentReport.statistics.xrSDKsDetected ?? new List<string>()));
                DrawStatistic("Spatial Audio Found", currentReport.statistics.spatialAudioFound ? "✅ Yes" : "❌ No");
                DrawStatistic("Alternative Input Found", currentReport.statistics.alternativeInputFound ? "✅ Yes" : "❌ No");
                DrawStatistic("Depth Cues Found", currentReport.statistics.depthCuesFound ? "✅ Yes" : "❌ No");
                DrawStatistic("Confidence Score", $"{(currentReport.statistics.xrConfidenceScore * 100):F1}%");
            }

            // General
            EditorGUILayout.Space(10);
            GUILayout.Label("🔧 Components", EditorStyles.boldLabel);
            DrawStatistic("Accessibility Components", currentReport.statistics.accessibilityComponentsFound ? "✅ Found" : "❌ Not Found");
            DrawStatistic("Screen Reader Support", currentReport.statistics.screenReaderSupportFound ? "✅ Found" : "❌ Not Found");
            DrawStatistic("Focus Indicators", currentReport.statistics.focusIndicatorsFound ? "✅ Found" : "❌ Not Found");

            EditorGUILayout.EndVertical();
        }

        private void DrawStatistic(string label, string value)
        {
            EditorGUILayout.BeginHorizontal();
            EditorGUILayout.LabelField(label, GUILayout.Width(200));
            EditorGUILayout.LabelField(value, EditorStyles.boldLabel);
            EditorGUILayout.EndHorizontal();
        }

        private void DrawRecommendationsTab()
        {
            EditorGUILayout.BeginVertical(EditorStyles.helpBox);
            GUILayout.Label("💡 Recommendations", subHeaderStyle);

            EditorGUILayout.HelpBox(
                "Based on the audit results, here are key recommendations for improving accessibility:",
                MessageType.Info
            );

            EditorGUILayout.Space(10);

            // Critical issues first
            if (currentReport.summary != null && currentReport.summary.criticalIssues > 0)
            {
                EditorGUILayout.BeginVertical(EditorStyles.helpBox);
                GUILayout.Label("🚨 Critical Priority", EditorStyles.boldLabel);
                EditorGUILayout.LabelField(
                    $"You have {currentReport.summary.criticalIssues} critical issues that should be addressed immediately. " +
                    "These issues prevent users from accessing core functionality.",
                    EditorStyles.wordWrappedLabel
                );
                EditorGUILayout.EndVertical();
                EditorGUILayout.Space(5);
            }

            // Keyboard support
            if (currentReport.statistics != null && !currentReport.statistics.keyboardSupportFound)
            {
                EditorGUILayout.BeginVertical(EditorStyles.helpBox);
                GUILayout.Label("⌨️ Keyboard Support", EditorStyles.boldLabel);
                EditorGUILayout.LabelField(
                    "Add keyboard alternatives for all stylus/mouse interactions. Consider using Unity's new Input System.",
                    EditorStyles.wordWrappedLabel
                );
                EditorGUILayout.EndVertical();
                EditorGUILayout.Space(5);
            }

            // Screen reader
            if (currentReport.statistics != null && !currentReport.statistics.screenReaderSupportFound)
            {
                EditorGUILayout.BeginVertical(EditorStyles.helpBox);
                GUILayout.Label("🔊 Screen Reader Support", EditorStyles.boldLabel);
                EditorGUILayout.LabelField(
                    "Implement Unity's Accessibility API (2023.2+) to provide text alternatives and semantic information.",
                    EditorStyles.wordWrappedLabel
                );
                EditorGUILayout.EndVertical();
                EditorGUILayout.Space(5);
            }

            // Documentation links
            EditorGUILayout.Space(10);
            GUILayout.Label("📚 Resources", EditorStyles.boldLabel);

            if (GUILayout.Button("Open WCAG 2.2 Guidelines", EditorStyles.linkLabel))
            {
                Application.OpenURL("https://www.w3.org/WAI/WCAG22/quickref/");
            }

            if (GUILayout.Button("Open Component Recommendations Report", EditorStyles.linkLabel))
            {
                string reportPath = Path.Combine(Path.GetDirectoryName(auditReportPath), "COMPONENT-RECOMMENDATIONS.md");
                if (File.Exists(reportPath))
                {
                    Application.OpenURL("file:///" + reportPath);
                }
            }

            if (GUILayout.Button("Open Full Audit Report", EditorStyles.linkLabel))
            {
                string reportPath = Path.Combine(Path.GetDirectoryName(auditReportPath), "AUDIT-SUMMARY.md");
                if (File.Exists(reportPath))
                {
                    Application.OpenURL("file:///" + reportPath);
                }
            }

            EditorGUILayout.EndVertical();
        }

        private List<Finding> GetFilteredFindings()
        {
            List<Finding> filtered = new List<Finding>();

            if (currentReport?.findings == null) return filtered;

            if (showCritical && currentReport.findings.critical != null)
                filtered.AddRange(currentReport.findings.critical);
            if (showHigh && currentReport.findings.high != null)
                filtered.AddRange(currentReport.findings.high);
            if (showMedium && currentReport.findings.medium != null)
                filtered.AddRange(currentReport.findings.medium);
            if (showLow && currentReport.findings.low != null)
                filtered.AddRange(currentReport.findings.low);

            if (!string.IsNullOrEmpty(searchFilter))
            {
                string search = searchFilter.ToLower();
                filtered = filtered.Where(f =>
                    (f.title != null && f.title.ToLower().Contains(search)) ||
                    (f.description != null && f.description.ToLower().Contains(search)) ||
                    (f.wcagCriteria != null && f.wcagCriteria.ToLower().Contains(search))
                ).ToList();
            }

            return filtered;
        }

        private void RunAudit(string additionalArgs = "")
        {
            isAuditRunning = true;
            auditStatus = "Starting audit...";

            string projectPath = Directory.GetParent(Application.dataPath).FullName;
            string frameworkPath = FindFrameworkPath();

            if (string.IsNullOrEmpty(frameworkPath))
            {
                auditStatus = "Error: Could not find accessibility-standards-unity framework. Please ensure it's installed.";
                isAuditRunning = false;
                Repaint();
                return;
            }

            string nodePath = "node"; // Assumes node is in PATH
            string auditScript = Path.Combine(frameworkPath, "bin", "audit.js");
            string arguments = $"\"{auditScript}\" \"{projectPath}\" {additionalArgs} --verbose";

            UnityEngine.Debug.Log($"Running audit: {nodePath} {arguments}");

            try
            {
                ProcessStartInfo startInfo = new ProcessStartInfo()
                {
                    FileName = nodePath,
                    Arguments = arguments,
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    CreateNoWindow = true,
                    WorkingDirectory = frameworkPath
                };

                Process process = new Process() { StartInfo = startInfo };

                process.OutputDataReceived += (sender, e) => {
                    if (!string.IsNullOrEmpty(e.Data))
                    {
                        UnityEngine.Debug.Log($"[Audit] {e.Data}");
                    }
                };

                process.ErrorDataReceived += (sender, e) => {
                    if (!string.IsNullOrEmpty(e.Data))
                    {
                        UnityEngine.Debug.LogWarning($"[Audit] {e.Data}");
                    }
                };

                process.Start();
                process.BeginOutputReadLine();
                process.BeginErrorReadLine();
                process.WaitForExit();

                if (process.ExitCode == 0)
                {
                    auditStatus = "✅ Audit completed successfully!";
                    LoadAuditReport();
                }
                else
                {
                    auditStatus = $"⚠️ Audit completed with exit code {process.ExitCode}. Check console for details.";
                }
            }
            catch (Exception ex)
            {
                auditStatus = $"❌ Error running audit: {ex.Message}";
                UnityEngine.Debug.LogError($"Audit error: {ex}");
            }
            finally
            {
                isAuditRunning = false;
                Repaint();
            }
        }

        private void LoadAuditReport()
        {
            if (!File.Exists(auditReportPath))
            {
                currentReport = null;
                auditStatus = "No audit report found. Run an audit to generate one.";
                return;
            }

            try
            {
                string jsonText = File.ReadAllText(auditReportPath);
                currentReport = JsonUtility.FromJson<AccessibilityAuditReport>(jsonText);
                auditStatus = $"Report loaded from {Path.GetFileName(auditReportPath)}";
                Repaint();
            }
            catch (Exception ex)
            {
                currentReport = null;
                auditStatus = $"Error loading report: {ex.Message}";
                UnityEngine.Debug.LogError($"Failed to load audit report: {ex}");
            }
        }

        private string FindFrameworkPath()
        {
            // Try common locations
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

        private void OpenScriptAtFile(string relativePath)
        {
            string projectPath = Directory.GetParent(Application.dataPath).FullName;
            string fullPath = Path.Combine(projectPath, relativePath);

            if (!File.Exists(fullPath))
            {
                UnityEngine.Debug.LogWarning($"File not found: {fullPath}");
                return;
            }

            // Try to open in Unity's script editor
            UnityEditorInternal.InternalEditorUtility.OpenFileAtLineExternal(fullPath, 1);
        }
    }
}
