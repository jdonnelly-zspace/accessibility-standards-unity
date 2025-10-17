using UnityEngine;
using zSpace.Core;

/// <summary>
/// Provides haptic feedback patterns for zSpace stylus to enhance accessibility.
///
/// Haptic feedback serves multiple accessibility purposes:
/// 1. Confirms interactions for users with visual impairments
/// 2. Provides depth cues for users who cannot perceive stereoscopic 3D (10-15%)
/// 3. Enhances usability for all users through tactile confirmation
///
/// W3C XAUR (XR Accessibility): Haptic feedback is a critical depth perception alternative.
/// </summary>
public class StylusHapticFeedback : MonoBehaviour
{
    [Header("Haptic Patterns")]
    [Tooltip("Haptic feedback on button press/click")]
    [SerializeField] private HapticPattern clickPattern = new HapticPattern(0.3f, 100);

    [Tooltip("Haptic feedback when hovering over interactive object")]
    [SerializeField] private HapticPattern hoverPattern = new HapticPattern(0.15f, 30);

    [Tooltip("Haptic feedback for successful action/confirmation")]
    [SerializeField] private HapticPattern successPattern = new HapticPattern(0.5f, 150);

    [Tooltip("Haptic feedback for error/invalid action")]
    [SerializeField] private HapticPattern errorPattern = new HapticPattern(0.7f, 200);

    [Header("Depth Cues (CRITICAL)")]
    [Tooltip("Enable haptic intensity variation based on object depth")]
    [SerializeField] private bool enableDepthCues = true;

    [Tooltip("Distance from camera where haptic is strongest (world units)")]
    [SerializeField] private float closestDistance = 0.5f;

    [Tooltip("Distance from camera where haptic is weakest (world units)")]
    [SerializeField] private float farthestDistance = 5.0f;

    [Header("Settings")]
    [Tooltip("Global haptic intensity multiplier (0 = off, 1 = full)")]
    [SerializeField] [Range(0f, 1f)] private float globalIntensity = 1.0f;

    [SerializeField] private bool logHapticEvents = false;

    // Internal state
    private ZCore zCore;
    private Camera mainCamera;

    [System.Serializable]
    public struct HapticPattern
    {
        [Range(0f, 1f)] public float intensity;
        public int durationMs;

        public HapticPattern(float intensity, int durationMs)
        {
            this.intensity = Mathf.Clamp01(intensity);
            this.durationMs = Mathf.Max(10, durationMs);
        }
    }

    void Start()
    {
        // Find zSpace SDK core component
        zCore = FindObjectOfType<ZCore>();
        if (zCore == null)
        {
            Debug.LogWarning($"[{name}] zSpace ZCore not found. Haptic feedback unavailable.");
        }

        mainCamera = Camera.main;
        if (mainCamera == null)
        {
            Debug.LogWarning($"[{name}] Main camera not found. Depth-based haptics unavailable.");
        }
    }

    /// <summary>
    /// Trigger a click/tap haptic pattern.
    /// Use for button presses, selections, and discrete interactions.
    /// </summary>
    public void TriggerClick()
    {
        TriggerHaptic(clickPattern, "Click");
    }

    /// <summary>
    /// Trigger a hover haptic pattern.
    /// Use when stylus enters an interactive object's trigger zone.
    /// </summary>
    public void TriggerHover()
    {
        TriggerHaptic(hoverPattern, "Hover");
    }

    /// <summary>
    /// Trigger a success/confirmation haptic pattern.
    /// Use for successful actions, completions, or positive feedback.
    /// </summary>
    public void TriggerSuccess()
    {
        TriggerHaptic(successPattern, "Success");
    }

    /// <summary>
    /// Trigger an error/warning haptic pattern.
    /// Use for invalid actions, errors, or warnings.
    /// </summary>
    public void TriggerError()
    {
        TriggerHaptic(errorPattern, "Error");
    }

    /// <summary>
    /// Trigger a custom haptic pattern.
    /// </summary>
    public void TriggerCustom(float intensity, int durationMs, string description = "Custom")
    {
        TriggerHaptic(new HapticPattern(intensity, durationMs), description);
    }

    /// <summary>
    /// Trigger haptic feedback with intensity based on object depth.
    /// CRITICAL for users who cannot perceive stereoscopic 3D (10-15%).
    /// Closer objects = stronger vibration, farther objects = weaker vibration.
    /// </summary>
    public void TriggerDepthCue(Vector3 objectPosition, int baseDurationMs = 100)
    {
        if (!enableDepthCues || mainCamera == null)
        {
            // Fallback to standard click if depth cues disabled
            TriggerClick();
            return;
        }

        // Calculate distance from camera
        float distance = Vector3.Distance(objectPosition, mainCamera.transform.position);

        // Map distance to intensity (closer = stronger)
        float normalizedDistance = Mathf.InverseLerp(closestDistance, farthestDistance, distance);
        float depthIntensity = Mathf.Lerp(0.7f, 0.2f, normalizedDistance);

        // Trigger haptic with depth-modulated intensity
        TriggerCustom(depthIntensity, baseDurationMs, $"Depth ({distance:F2}m)");
    }

    /// <summary>
    /// Trigger continuous haptic feedback based on distance (for dragging, moving objects).
    /// Intensity varies with depth to provide real-time depth cues.
    /// </summary>
    public void TriggerContinuousDepthCue(Vector3 objectPosition)
    {
        if (!enableDepthCues || mainCamera == null) return;

        float distance = Vector3.Distance(objectPosition, mainCamera.transform.position);
        float normalizedDistance = Mathf.InverseLerp(closestDistance, farthestDistance, distance);
        float depthIntensity = Mathf.Lerp(0.5f, 0.1f, normalizedDistance);

        // Short pulse for continuous feedback
        TriggerCustom(depthIntensity, 30, "Continuous Depth");
    }

    private void TriggerHaptic(HapticPattern pattern, string description)
    {
        if (zCore == null)
        {
            if (logHapticEvents)
            {
                Debug.LogWarning($"[{name}] Cannot trigger haptic '{description}': zSpace SDK not available");
            }
            return;
        }

        if (!zCore.IsStylusInView())
        {
            if (logHapticEvents)
            {
                Debug.Log($"[{name}] Haptic '{description}' skipped: Stylus not in view");
            }
            return;
        }

        // Apply global intensity multiplier
        float finalIntensity = pattern.intensity * globalIntensity;

        if (finalIntensity <= 0f)
        {
            return; // Haptics disabled
        }

        // Trigger vibration via zSpace SDK
        zCore.VibrateStylus(finalIntensity, pattern.durationMs);

        if (logHapticEvents)
        {
            Debug.Log($"[{name}] Haptic triggered: {description} (intensity: {finalIntensity:F2}, duration: {pattern.durationMs}ms)");
        }
    }

    /// <summary>
    /// Set global haptic intensity (useful for user accessibility settings).
    /// </summary>
    public void SetGlobalIntensity(float intensity)
    {
        globalIntensity = Mathf.Clamp01(intensity);
        Debug.Log($"[{name}] Global haptic intensity set to {globalIntensity:F2}");
    }

    /// <summary>
    /// Check if haptic feedback is currently available.
    /// </summary>
    public bool IsHapticAvailable()
    {
        return zCore != null && zCore.IsStylusInView() && globalIntensity > 0f;
    }

    #if UNITY_EDITOR
    // Editor-only testing methods
    [ContextMenu("Test Click Haptic")]
    private void TestClick()
    {
        TriggerClick();
    }

    [ContextMenu("Test Hover Haptic")]
    private void TestHover()
    {
        TriggerHover();
    }

    [ContextMenu("Test Success Haptic")]
    private void TestSuccess()
    {
        TriggerSuccess();
    }

    [ContextMenu("Test Error Haptic")]
    private void TestError()
    {
        TriggerError();
    }

    [ContextMenu("Test Depth Cue (Near)")]
    private void TestDepthNear()
    {
        if (mainCamera != null)
        {
            Vector3 nearPosition = mainCamera.transform.position + mainCamera.transform.forward * closestDistance;
            TriggerDepthCue(nearPosition);
        }
    }

    [ContextMenu("Test Depth Cue (Far)")]
    private void TestDepthFar()
    {
        if (mainCamera != null)
        {
            Vector3 farPosition = mainCamera.transform.position + mainCamera.transform.forward * farthestDistance;
            TriggerDepthCue(farPosition);
        }
    }
    #endif
}
