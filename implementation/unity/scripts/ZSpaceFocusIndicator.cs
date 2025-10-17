using UnityEngine;

/// <summary>
/// Focus indicator for 3D objects in zSpace stereoscopic environment.
///
/// WCAG 2.4.7 (Level AA): Focus Visible
/// Requirement: Focus indicator must have 3:1 contrast ratio with background
///
/// For zSpace: Focus must be visible in stereoscopic 3D space, not just on 2D screen.
/// </summary>
public class ZSpaceFocusIndicator : MonoBehaviour
{
    [Header("Focus Indicator Type")]
    [Tooltip("Type of focus indicator to use")]
    [SerializeField] private FocusType focusType = FocusType.EmissiveGlow;

    [Header("Emissive Glow Settings")]
    [Tooltip("Focus glow color (recommended: blue or yellow for high contrast)")]
    [SerializeField] private Color focusColor = new Color(0.25f, 0.59f, 0.95f); // Blue

    [Tooltip("Glow intensity (HDR intensity, 2.0 = bright)")]
    [SerializeField] private float glowIntensity = 2.0f;

    [Tooltip("Enable pulsing animation")]
    [SerializeField] private bool enablePulse = true;

    [Tooltip("Pulse speed (cycles per second)")]
    [SerializeField] private float pulseSpeed = 1.0f;

    [Header("Outline Settings")]
    [Tooltip("Outline width (world units)")]
    [SerializeField] private float outlineWidth = 0.05f;

    [Tooltip("Outline color")]
    [SerializeField] private Color outlineColor = Color.yellow;

    [Header("Scale Settings")]
    [Tooltip("Scale multiplier when focused")]
    [SerializeField] private float focusScaleMultiplier = 1.1f;

    [Tooltip("Scale animation duration (seconds)")]
    [SerializeField] private float scaleAnimationDuration = 0.2f;

    // Internal state
    private Renderer objectRenderer;
    private Material originalMaterial;
    private Material focusMaterial;
    private Vector3 originalScale;
    private bool isFocused = false;
    private float pulseTime = 0f;

    public enum FocusType
    {
        EmissiveGlow,
        Outline,
        Scale,
        All
    }

    void Start()
    {
        // Get renderer
        objectRenderer = GetComponent<Renderer>();
        if (objectRenderer == null)
        {
            Debug.LogError($"[{name}] No Renderer component found! ZSpaceFocusIndicator requires a Renderer.");
            enabled = false;
            return;
        }

        // Store original material and scale
        originalMaterial = objectRenderer.material;
        originalScale = transform.localScale;

        // Create focus material (if using emissive glow)
        if (focusType == FocusType.EmissiveGlow || focusType == FocusType.All)
        {
            CreateFocusMaterial();
        }

        // Start unfocused
        SetFocused(false);
    }

    void Update()
    {
        // Update pulse animation if focused
        if (isFocused && enablePulse && (focusType == FocusType.EmissiveGlow || focusType == FocusType.All))
        {
            UpdatePulseAnimation();
        }
    }

    private void CreateFocusMaterial()
    {
        // Create a copy of the original material
        focusMaterial = new Material(originalMaterial);

        // Enable emission keyword
        focusMaterial.EnableKeyword("_EMISSION");

        // Set emission color (HDR)
        Color emissionColor = focusColor * glowIntensity;
        focusMaterial.SetColor("_EmissionColor", emissionColor);

        // Ensure the material uses Standard shader or similar with emission support
        if (!focusMaterial.HasProperty("_EmissionColor"))
        {
            Debug.LogWarning($"[{name}] Material does not support emission. Use Standard shader or similar.");
        }
    }

    private void UpdatePulseAnimation()
    {
        pulseTime += Time.deltaTime * pulseSpeed;
        float pulse = (Mathf.Sin(pulseTime * Mathf.PI * 2f) + 1f) * 0.5f; // 0-1 range

        // Vary glow intensity
        float currentIntensity = Mathf.Lerp(glowIntensity * 0.5f, glowIntensity, pulse);
        Color emissionColor = focusColor * currentIntensity;

        if (focusMaterial != null && focusMaterial.HasProperty("_EmissionColor"))
        {
            focusMaterial.SetColor("_EmissionColor", emissionColor);
        }
    }

    /// <summary>
    /// Set whether this object is currently focused.
    /// Call this from keyboard navigation system or input manager.
    /// </summary>
    public void SetFocused(bool focused)
    {
        if (isFocused == focused) return; // No change

        isFocused = focused;

        if (focused)
        {
            ShowFocus();
        }
        else
        {
            HideFocus();
        }
    }

    private void ShowFocus()
    {
        // Apply focus indicator based on type
        switch (focusType)
        {
            case FocusType.EmissiveGlow:
                ApplyEmissiveGlow();
                break;

            case FocusType.Outline:
                ApplyOutline();
                break;

            case FocusType.Scale:
                ApplyScale(focusScaleMultiplier);
                break;

            case FocusType.All:
                ApplyEmissiveGlow();
                ApplyOutline();
                ApplyScale(focusScaleMultiplier);
                break;
        }

        pulseTime = 0f; // Reset pulse animation
    }

    private void HideFocus()
    {
        // Remove focus indicator
        switch (focusType)
        {
            case FocusType.EmissiveGlow:
                RemoveEmissiveGlow();
                break;

            case FocusType.Outline:
                RemoveOutline();
                break;

            case FocusType.Scale:
                ApplyScale(1.0f);
                break;

            case FocusType.All:
                RemoveEmissiveGlow();
                RemoveOutline();
                ApplyScale(1.0f);
                break;
        }
    }

    private void ApplyEmissiveGlow()
    {
        if (objectRenderer != null && focusMaterial != null)
        {
            objectRenderer.material = focusMaterial;
        }
    }

    private void RemoveEmissiveGlow()
    {
        if (objectRenderer != null && originalMaterial != null)
        {
            objectRenderer.material = originalMaterial;
        }
    }

    private void ApplyOutline()
    {
        // Note: Outline requires a custom outline shader or post-processing
        // This is a simplified placeholder - implement with your preferred outline solution
        Debug.Log($"[{name}] Outline effect requires custom shader (not implemented in base class)");
    }

    private void RemoveOutline()
    {
        // Remove outline effect
    }

    private void ApplyScale(float scaleMultiplier)
    {
        // Smooth scale animation
        StopAllCoroutines();
        StartCoroutine(AnimateScale(scaleMultiplier));
    }

    private System.Collections.IEnumerator AnimateScale(float targetMultiplier)
    {
        Vector3 startScale = transform.localScale;
        Vector3 targetScale = originalScale * targetMultiplier;
        float elapsed = 0f;

        while (elapsed < scaleAnimationDuration)
        {
            elapsed += Time.deltaTime;
            float t = elapsed / scaleAnimationDuration;
            transform.localScale = Vector3.Lerp(startScale, targetScale, t);
            yield return null;
        }

        transform.localScale = targetScale;
    }

    /// <summary>
    /// Check if this object is currently focused.
    /// </summary>
    public bool IsFocused()
    {
        return isFocused;
    }

    /// <summary>
    /// Set focus color (useful for indicating different states).
    /// </summary>
    public void SetFocusColor(Color color)
    {
        focusColor = color;
        if (isFocused && focusMaterial != null)
        {
            CreateFocusMaterial();
            ApplyEmissiveGlow();
        }
    }

    void OnDestroy()
    {
        // Clean up created materials
        if (focusMaterial != null)
        {
            Destroy(focusMaterial);
        }
    }

    #if UNITY_EDITOR
    [ContextMenu("Test: Show Focus")]
    private void TestShowFocus()
    {
        SetFocused(true);
    }

    [ContextMenu("Test: Hide Focus")]
    private void TestHideFocus()
    {
        SetFocused(false);
    }

    private void OnValidate()
    {
        // Clamp values
        glowIntensity = Mathf.Max(0f, glowIntensity);
        outlineWidth = Mathf.Max(0.01f, outlineWidth);
        focusScaleMultiplier = Mathf.Max(1.0f, focusScaleMultiplier);
        pulseSpeed = Mathf.Max(0.1f, pulseSpeed);
    }
    #endif
}
