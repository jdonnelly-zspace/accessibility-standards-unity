using UnityEngine;
using UnityEngine.UI;
using UnityEditor;
using System.Collections.Generic;

/// <summary>
/// Unity Editor tool to validate zSpace accessibility compliance.
/// Checks scene for common accessibility issues before build.
///
/// Menu: Window → Accessibility → Validate Scene
/// </summary>
public class ZSpaceAccessibilityValidator : EditorWindow
{
    private Vector2 scrollPosition;
    private List<ValidationIssue> issues = new List<ValidationIssue>();
    private int criticalCount = 0;
    private int warningCount = 0;
    private int passCount = 0;

    private struct ValidationIssue
    {
        public string category;
        public string message;
        public GameObject gameObject;
        public ValidationLevel level;
    }

    private enum ValidationLevel
    {
        Pass,
        Warning,
        Critical
    }

    [MenuItem("Window/Accessibility/Validate Scene")]
    public static void ShowWindow()
    {
        var window = GetWindow<ZSpaceAccessibilityValidator>("zSpace Accessibility");
        window.minSize = new Vector2(500, 400);
        window.Show();
    }

    void OnGUI()
    {
        EditorGUILayout.LabelField("zSpace Accessibility Validator", EditorStyles.boldLabel);
        EditorGUILayout.LabelField("WCAG 2.2 Level AA + W3C XAUR Compliance Check");

        EditorGUILayout.Space();

        if (GUILayout.Button("Run Validation", GUILayout.Height(30)))
        {
            RunValidation();
        }

        EditorGUILayout.Space();

        // Display summary
        if (issues.Count > 0)
        {
            EditorGUILayout.BeginHorizontal();
            GUI.color = Color.red;
            EditorGUILayout.LabelField($"Critical: {criticalCount}", GUILayout.Width(100));
            GUI.color = new Color(1f, 0.6f, 0f); // Orange
            EditorGUILayout.LabelField($"Warnings: {warningCount}", GUILayout.Width(100));
            GUI.color = Color.green;
            EditorGUILayout.LabelField($"Passed: {passCount}", GUILayout.Width(100));
            GUI.color = Color.white;
            EditorGUILayout.EndHorizontal();

            EditorGUILayout.Space();

            // Display issues
            scrollPosition = EditorGUILayout.BeginScrollView(scrollPosition);

            foreach (var issue in issues)
            {
                DisplayIssue(issue);
            }

            EditorGUILayout.EndScrollView();
        }
        else
        {
            EditorGUILayout.HelpBox("Click 'Run Validation' to check scene for accessibility issues.", MessageType.Info);
        }
    }

    private void DisplayIssue(ValidationIssue issue)
    {
        EditorGUILayout.BeginVertical(EditorStyles.helpBox);

        // Color-code by severity
        switch (issue.level)
        {
            case ValidationLevel.Critical:
                GUI.color = new Color(1f, 0.5f, 0.5f);
                EditorGUILayout.LabelField($"❌ CRITICAL: {issue.category}", EditorStyles.boldLabel);
                break;
            case ValidationLevel.Warning:
                GUI.color = new Color(1f, 0.8f, 0.4f);
                EditorGUILayout.LabelField($"⚠️ WARNING: {issue.category}", EditorStyles.boldLabel);
                break;
            case ValidationLevel.Pass:
                GUI.color = new Color(0.5f, 1f, 0.5f);
                EditorGUILayout.LabelField($"✓ PASS: {issue.category}", EditorStyles.boldLabel);
                break;
        }
        GUI.color = Color.white;

        EditorGUILayout.LabelField(issue.message, EditorStyles.wordWrappedLabel);

        if (issue.gameObject != null)
        {
            if (GUILayout.Button($"Select: {issue.gameObject.name}", GUILayout.Width(200)))
            {
                Selection.activeGameObject = issue.gameObject;
                EditorGUIUtility.PingObject(issue.gameObject);
            }
        }

        EditorGUILayout.EndVertical();
        EditorGUILayout.Space();
    }

    private void RunValidation()
    {
        issues.Clear();
        criticalCount = 0;
        warningCount = 0;
        passCount = 0;

        Debug.Log("[Accessibility Validator] Running validation...");

        // Run all validation checks
        ValidateTargetSizes();
        ValidateDepthCues();
        ValidateKeyboardAlternatives();
        ValidateScreenReaderSupport();
        ValidateFocusIndicators();
        ValidateContrastRatios();

        // Summary
        Debug.Log($"[Accessibility Validator] Complete: {criticalCount} critical, {warningCount} warnings, {passCount} passed");

        Repaint();
    }

    private void ValidateTargetSizes()
    {
        // WCAG 2.5.8: Target Size (Minimum) - Level AA
        // Interactive elements must be at least 24x24 pixels

        var buttons = FindObjectsOfType<Button>();

        foreach (var button in buttons)
        {
            RectTransform rect = button.GetComponent<RectTransform>();
            if (rect == null) continue;

            float width = rect.rect.width;
            float height = rect.rect.height;

            if (width < 24f || height < 24f)
            {
                AddIssue(
                    "Target Size",
                    $"Button '{button.name}' is too small: {width:F1}x{height:F1}px. Minimum: 24x24px (WCAG 2.5.8)",
                    button.gameObject,
                    ValidationLevel.Critical
                );
            }
            else if (width < 36f || height < 36f)
            {
                AddIssue(
                    "Target Size",
                    $"Button '{button.name}' is {width:F1}x{height:F1}px. Meets minimum (24px) but recommended: 36-40px for better usability.",
                    button.gameObject,
                    ValidationLevel.Warning
                );
            }
            else
            {
                AddIssue(
                    "Target Size",
                    $"Button '{button.name}' size OK: {width:F1}x{height:F1}px",
                    button.gameObject,
                    ValidationLevel.Pass
                );
            }
        }
    }

    private void ValidateDepthCues()
    {
        // W3C XAUR: Depth perception alternatives
        // Critical for 10-15% who can't perceive stereoscopic 3D

        var depthCueManagers = FindObjectsOfType<DepthCueManager>();

        if (depthCueManagers.Length == 0)
        {
            AddIssue(
                "Depth Perception",
                "No DepthCueManager components found. 10-15% of users cannot perceive stereoscopic 3D and need depth alternatives (size, shadow, audio, haptic).",
                null,
                ValidationLevel.Critical
            );
        }
        else
        {
            AddIssue(
                "Depth Perception",
                $"Found {depthCueManagers.Length} DepthCueManager(s). Depth alternatives provided.",
                null,
                ValidationLevel.Pass
            );
        }
    }

    private void ValidateKeyboardAlternatives()
    {
        // WCAG 2.1.1: Keyboard - Level A
        // All stylus functionality must have keyboard alternatives

        var keyboardAlternatives = FindObjectsOfType<KeyboardStylusAlternative>();

        if (keyboardAlternatives.Length == 0)
        {
            AddIssue(
                "Keyboard Accessibility",
                "No KeyboardStylusAlternative found. All stylus interactions MUST have keyboard alternatives (WCAG 2.1.1 - Level A).",
                null,
                ValidationLevel.Critical
            );
        }
        else
        {
            AddIssue(
                "Keyboard Accessibility",
                $"Found {keyboardAlternatives.Length} KeyboardStylusAlternative component(s). Keyboard alternatives available.",
                null,
                ValidationLevel.Pass
            );
        }
    }

    private void ValidateScreenReaderSupport()
    {
        // WCAG 4.1.2: Name, Role, Value - Level A
        // UI elements must be accessible to screen readers

        var accessibleButtons = FindObjectsOfType<AccessibleStylusButton>();

        if (accessibleButtons.Length > 0)
        {
            AddIssue(
                "Screen Reader Support",
                $"Found {accessibleButtons.Length} AccessibleStylusButton(s) with screen reader support (Windows NVDA/Narrator/JAWS).",
                null,
                ValidationLevel.Pass
            );
        }
        else
        {
            AddIssue(
                "Screen Reader Support",
                "No AccessibleStylusButton components found. Consider adding screen reader support for desktop assistive technologies.",
                null,
                ValidationLevel.Warning
            );
        }
    }

    private void ValidateFocusIndicators()
    {
        // WCAG 2.4.7: Focus Visible - Level AA
        // Focus indicators must be visible in 3D space

        var focusIndicators = FindObjectsOfType<ZSpaceFocusIndicator>();

        if (focusIndicators.Length > 0)
        {
            AddIssue(
                "Focus Indicators",
                $"Found {focusIndicators.Length} ZSpaceFocusIndicator(s). Focus visible in 3D space (WCAG 2.4.7).",
                null,
                ValidationLevel.Pass
            );
        }
        else
        {
            AddIssue(
                "Focus Indicators",
                "No ZSpaceFocusIndicator components found. Keyboard users need visible focus indicators in 3D space (WCAG 2.4.7).",
                null,
                ValidationLevel.Warning
            );
        }
    }

    private void ValidateContrastRatios()
    {
        // WCAG 1.4.3: Contrast (Minimum) - Level AA
        // Text must have 4.5:1 contrast, UI components 3:1

        var texts = FindObjectsOfType<Text>();
        var tmpTexts = FindObjectsOfType<TMPro.TextMeshProUGUI>();

        int textCount = texts.Length + tmpTexts.Length;

        if (textCount > 0)
        {
            AddIssue(
                "Color Contrast",
                $"Found {textCount} text element(s). Use WebAIM Contrast Checker to verify 4.5:1 contrast ratio (WCAG 1.4.3).",
                null,
                ValidationLevel.Warning
            );
        }
    }

    private void AddIssue(string category, string message, GameObject gameObject, ValidationLevel level)
    {
        issues.Add(new ValidationIssue
        {
            category = category,
            message = message,
            gameObject = gameObject,
            level = level
        });

        switch (level)
        {
            case ValidationLevel.Critical:
                criticalCount++;
                break;
            case ValidationLevel.Warning:
                warningCount++;
                break;
            case ValidationLevel.Pass:
                passCount++;
                break;
        }
    }
}
