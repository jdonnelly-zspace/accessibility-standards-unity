using UnityEngine;
using UnityEngine.UI;
using UnityEditor;
using System.Collections.Generic;

/// <summary>
/// Unity Editor tool to check color contrast ratios for WCAG 2.2 compliance.
/// Validates text and UI component contrast ratios in zSpace scenes.
///
/// Menu: Window → Accessibility → Contrast Checker
///
/// WCAG 2.2 Requirements:
/// - Text (18pt+): 3:1 contrast ratio (Level AA)
/// - Text (<18pt): 4.5:1 contrast ratio (Level AA)
/// - UI Components: 3:1 contrast ratio (Level AA)
/// - Enhanced (Level AAA): 7:1 for text, 4.5:1 for large text
/// </summary>
public class ContrastCheckerZSpace : EditorWindow
{
    private Vector2 scrollPosition;
    private List<ContrastResult> results = new List<ContrastResult>();

    // Color pickers
    private Color foregroundColor = Color.black;
    private Color backgroundColor = Color.white;

    // Contrast ratio result
    private float contrastRatio = 0f;

    private struct ContrastResult
    {
        public string objectName;
        public Color foreground;
        public Color background;
        public float ratio;
        public bool passesAA;
        public bool passesAAA;
        public string elementType;
        public GameObject gameObject;
    }

    [MenuItem("Window/Accessibility/Contrast Checker")]
    public static void ShowWindow()
    {
        var window = GetWindow<ContrastCheckerZSpace>("Contrast Checker");
        window.minSize = new Vector2(450, 500);
        window.Show();
    }

    void OnGUI()
    {
        EditorGUILayout.LabelField("WCAG 2.2 Contrast Checker", EditorStyles.boldLabel);
        EditorGUILayout.LabelField("Check color contrast ratios for accessibility compliance");

        EditorGUILayout.Space();

        // Manual color picker section
        DrawManualChecker();

        EditorGUILayout.Space();
        EditorGUILayout.LabelField("", GUI.skin.horizontalSlider);
        EditorGUILayout.Space();

        // Scene validation section
        DrawSceneValidator();
    }

    private void DrawManualChecker()
    {
        EditorGUILayout.LabelField("Manual Color Check", EditorStyles.boldLabel);

        EditorGUILayout.BeginVertical(EditorStyles.helpBox);

        // Color pickers
        foregroundColor = EditorGUILayout.ColorField("Foreground (Text)", foregroundColor);
        backgroundColor = EditorGUILayout.ColorField("Background", backgroundColor);

        EditorGUILayout.Space();

        if (GUILayout.Button("Calculate Contrast Ratio", GUILayout.Height(30)))
        {
            contrastRatio = CalculateContrastRatio(foregroundColor, backgroundColor);
        }

        if (contrastRatio > 0)
        {
            EditorGUILayout.Space();
            EditorGUILayout.LabelField($"Contrast Ratio: {contrastRatio:F2}:1", EditorStyles.boldLabel);

            // WCAG compliance indicators
            DrawComplianceStatus("Normal Text (AA - 4.5:1)", contrastRatio >= 4.5f);
            DrawComplianceStatus("Large Text (AA - 3:1)", contrastRatio >= 3.0f);
            DrawComplianceStatus("UI Components (AA - 3:1)", contrastRatio >= 3.0f);
            DrawComplianceStatus("Normal Text (AAA - 7:1)", contrastRatio >= 7.0f);
            DrawComplianceStatus("Large Text (AAA - 4.5:1)", contrastRatio >= 4.5f);

            EditorGUILayout.Space();

            // Visual preview
            EditorGUILayout.LabelField("Preview:");
            Rect previewRect = GUILayoutUtility.GetRect(200, 60);
            EditorGUI.DrawRect(previewRect, backgroundColor);

            GUIStyle labelStyle = new GUIStyle(EditorStyles.boldLabel);
            labelStyle.normal.textColor = foregroundColor;
            labelStyle.fontSize = 16;
            labelStyle.alignment = TextAnchor.MiddleCenter;

            GUI.Label(previewRect, "Sample Text", labelStyle);
        }

        EditorGUILayout.EndVertical();
    }

    private void DrawSceneValidator()
    {
        EditorGUILayout.LabelField("Scene Validation", EditorStyles.boldLabel);

        if (GUILayout.Button("Check All Text Elements in Scene", GUILayout.Height(30)))
        {
            ValidateSceneContrast();
        }

        EditorGUILayout.Space();

        if (results.Count > 0)
        {
            EditorGUILayout.LabelField($"Found {results.Count} text elements", EditorStyles.boldLabel);

            scrollPosition = EditorGUILayout.BeginScrollView(scrollPosition);

            foreach (var result in results)
            {
                DrawContrastResult(result);
            }

            EditorGUILayout.EndScrollView();
        }
    }

    private void DrawComplianceStatus(string label, bool passes)
    {
        EditorGUILayout.BeginHorizontal();

        if (passes)
        {
            GUI.color = Color.green;
            EditorGUILayout.LabelField("✓", GUILayout.Width(20));
        }
        else
        {
            GUI.color = Color.red;
            EditorGUILayout.LabelField("✗", GUILayout.Width(20));
        }

        GUI.color = Color.white;
        EditorGUILayout.LabelField(label);

        EditorGUILayout.EndHorizontal();
    }

    private void DrawContrastResult(ContrastResult result)
    {
        EditorGUILayout.BeginVertical(EditorStyles.helpBox);

        // Color-code by compliance
        if (!result.passesAA)
        {
            GUI.color = new Color(1f, 0.5f, 0.5f);
            EditorGUILayout.LabelField($"❌ FAIL: {result.objectName}", EditorStyles.boldLabel);
        }
        else if (result.passesAAA)
        {
            GUI.color = new Color(0.5f, 1f, 0.5f);
            EditorGUILayout.LabelField($"✓✓ AAA: {result.objectName}", EditorStyles.boldLabel);
        }
        else
        {
            GUI.color = new Color(0.7f, 1f, 0.7f);
            EditorGUILayout.LabelField($"✓ AA: {result.objectName}", EditorStyles.boldLabel);
        }
        GUI.color = Color.white;

        EditorGUILayout.LabelField($"Type: {result.elementType}");
        EditorGUILayout.LabelField($"Contrast: {result.ratio:F2}:1");

        EditorGUILayout.BeginHorizontal();
        EditorGUILayout.ColorField("Foreground", result.foreground, GUILayout.Width(200));
        EditorGUILayout.ColorField("Background", result.background, GUILayout.Width(200));
        EditorGUILayout.EndHorizontal();

        if (result.gameObject != null)
        {
            if (GUILayout.Button($"Select: {result.objectName}", GUILayout.Width(200)))
            {
                Selection.activeGameObject = result.gameObject;
                EditorGUIUtility.PingObject(result.gameObject);
            }
        }

        EditorGUILayout.EndVertical();
        EditorGUILayout.Space();
    }

    private void ValidateSceneContrast()
    {
        results.Clear();

        Debug.Log("[Contrast Checker] Validating scene text elements...");

        // Check Unity UI Text components
        var uiTexts = FindObjectsOfType<Text>();
        foreach (var text in uiTexts)
        {
            CheckTextContrast(text);
        }

        // Check TextMeshPro components
        var tmpTexts = FindObjectsOfType<TMPro.TextMeshProUGUI>();
        foreach (var tmp in tmpTexts)
        {
            CheckTMPContrast(tmp);
        }

        Debug.Log($"[Contrast Checker] Found {results.Count} text elements");

        Repaint();
    }

    private void CheckTextContrast(Text text)
    {
        if (!text.enabled) return;

        Color foreground = text.color;
        Color background = GetBackgroundColor(text.gameObject);

        float ratio = CalculateContrastRatio(foreground, background);

        // Determine text size (18pt = 24px approx)
        bool isLargeText = text.fontSize >= 18;
        float aaThreshold = isLargeText ? 3.0f : 4.5f;
        float aaaThreshold = isLargeText ? 4.5f : 7.0f;

        results.Add(new ContrastResult
        {
            objectName = text.gameObject.name,
            foreground = foreground,
            background = background,
            ratio = ratio,
            passesAA = ratio >= aaThreshold,
            passesAAA = ratio >= aaaThreshold,
            elementType = $"UI Text ({text.fontSize}pt)",
            gameObject = text.gameObject
        });
    }

    private void CheckTMPContrast(TMPro.TextMeshProUGUI tmp)
    {
        if (!tmp.enabled) return;

        Color foreground = tmp.color;
        Color background = GetBackgroundColor(tmp.gameObject);

        float ratio = CalculateContrastRatio(foreground, background);

        // Determine text size
        bool isLargeText = tmp.fontSize >= 18;
        float aaThreshold = isLargeText ? 3.0f : 4.5f;
        float aaaThreshold = isLargeText ? 4.5f : 7.0f;

        results.Add(new ContrastResult
        {
            objectName = tmp.gameObject.name,
            foreground = foreground,
            background = background,
            ratio = ratio,
            passesAA = ratio >= aaThreshold,
            passesAAA = ratio >= aaaThreshold,
            elementType = $"TextMeshPro ({tmp.fontSize}pt)",
            gameObject = tmp.gameObject
        });
    }

    private Color GetBackgroundColor(GameObject textObject)
    {
        // Try to find background Image component in parent
        Transform current = textObject.transform.parent;

        while (current != null)
        {
            var image = current.GetComponent<Image>();
            if (image != null && image.enabled)
            {
                return image.color;
            }
            current = current.parent;
        }

        // Default to white if no background found
        return Color.white;
    }

    /// <summary>
    /// Calculate WCAG contrast ratio between two colors.
    /// Formula: (L1 + 0.05) / (L2 + 0.05)
    /// where L1 is lighter color luminance, L2 is darker color luminance
    /// </summary>
    private float CalculateContrastRatio(Color color1, Color color2)
    {
        float lum1 = GetRelativeLuminance(color1);
        float lum2 = GetRelativeLuminance(color2);

        float lighter = Mathf.Max(lum1, lum2);
        float darker = Mathf.Min(lum1, lum2);

        return (lighter + 0.05f) / (darker + 0.05f);
    }

    /// <summary>
    /// Calculate relative luminance as per WCAG formula.
    /// https://www.w3.org/WAI/GL/wiki/Relative_luminance
    /// </summary>
    private float GetRelativeLuminance(Color color)
    {
        // Convert to linear RGB
        float r = GetLinearRGB(color.r);
        float g = GetLinearRGB(color.g);
        float b = GetLinearRGB(color.b);

        // Calculate luminance
        return 0.2126f * r + 0.7152f * g + 0.0722f * b;
    }

    private float GetLinearRGB(float channel)
    {
        if (channel <= 0.04045f)
        {
            return channel / 12.92f;
        }
        else
        {
            return Mathf.Pow((channel + 0.055f) / 1.055f, 2.4f);
        }
    }
}
