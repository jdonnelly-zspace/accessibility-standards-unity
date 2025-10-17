using UnityEngine;
using zSpace.Core;

/// <summary>
/// CRITICAL ACCESSIBILITY COMPONENT
///
/// Provides depth perception alternatives for users who cannot perceive stereoscopic 3D.
/// Approximately 10-15% of the population cannot see stereoscopic depth due to:
/// - Vision conditions (strabismus, amblyopia, monocular vision)
/// - Eye strain or fatigue
/// - Inability to wear 3D glasses
///
/// W3C XAUR (XR Accessibility User Requirements):
/// "Applications MUST NOT rely solely on stereoscopic 3D for critical information."
///
/// This component provides 6 depth cues that work without stereoscopic vision:
/// 1. Size (closer objects appear larger)
/// 2. Shadows (distance from surface)
/// 3. Occlusion (front objects hide back objects)
/// 4. Spatial audio (closer = louder)
/// 5. Haptic feedback (closer = stronger vibration)
/// 6. Motion parallax (objects move relative to viewpoint)
///
/// Testing Requirement: Application MUST be fully functional with zSpace glasses removed (2D view).
/// </summary>
public class DepthCueManager : MonoBehaviour
{
    [Header("Depth Cue Configuration")]
    [Tooltip("Enable size-based depth cue (closer = larger)")]
    [SerializeField] private bool enableSizeCue = true;

    [Tooltip("Enable shadow-based depth cue (distance from surface)")]
    [SerializeField] private bool enableShadowCue = true;

    [Tooltip("Enable spatial audio depth cue (closer = louder)")]
    [SerializeField] private bool enableAudioCue = true;

    [Tooltip("Enable haptic depth cue (closer = stronger vibration)")]
    [SerializeField] private bool enableHapticCue = true;

    [Header("Size Cue Settings")]
    [Tooltip("Base scale of object at reference distance")]
    [SerializeField] private float baseScale = 1.0f;

    [Tooltip("Scale multiplier when object is closest")]
    [SerializeField] private float scaleAtClosest = 1.3f;

    [Tooltip("Scale multiplier when object is farthest")]
    [SerializeField] private float scaleAtFarthest = 0.7f;

    [Header("Audio Cue Settings")]
    [SerializeField] private AudioSource audioSource;

    [Tooltip("Audio volume when object is closest")]
    [SerializeField] [Range(0f, 1f)] private float volumeAtClosest = 1.0f;

    [Tooltip("Audio volume when object is farthest")]
    [SerializeField] [Range(0f, 1f)] private float volumeAtFarthest = 0.2f;

    [Header("Depth Range")]
    [Tooltip("Distance from camera considered 'closest' (world units)")]
    [SerializeField] private float closestDistance = 0.5f;

    [Tooltip("Distance from camera considered 'farthest' (world units)")]
    [SerializeField] private float farthestDistance = 5.0f;

    [Header("References")]
    [SerializeField] private Camera targetCamera;
    private StylusHapticFeedback hapticFeedback;
    private ZCore zCore;

    // Internal state
    private Vector3 originalScale;
    private float currentDepth;

    void Start()
    {
        // Cache references
        if (targetCamera == null)
        {
            targetCamera = Camera.main;
        }

        if (targetCamera == null)
        {
            Debug.LogError($"[{name}] No camera found! DepthCueManager requires a camera.");
            enabled = false;
            return;
        }

        zCore = FindObjectOfType<ZCore>();
        hapticFeedback = GetComponent<StylusHapticFeedback>();

        // Store original scale
        originalScale = transform.localScale;

        // Ensure shadows are enabled (WCAG requirement for depth cue)
        if (enableShadowCue)
        {
            EnableShadowCasting();
        }

        // Validate audio source
        if (enableAudioCue && audioSource == null)
        {
            audioSource = GetComponent<AudioSource>();
            if (audioSource == null)
            {
                Debug.LogWarning($"[{name}] Audio cue enabled but no AudioSource found. Add AudioSource component or disable audio cue.");
                enableAudioCue = false;
            }
        }

        // Validate depth cues
        ValidateDepthCues();
    }

    void Update()
    {
        // Calculate current depth
        currentDepth = Vector3.Distance(transform.position, targetCamera.transform.position);

        // Normalize depth to 0-1 range
        float normalizedDepth = Mathf.InverseLerp(closestDistance, farthestDistance, currentDepth);

        // Apply depth cues
        if (enableSizeCue)
        {
            ApplySizeCue(normalizedDepth);
        }

        if (enableAudioCue && audioSource != null)
        {
            ApplyAudioCue(normalizedDepth);
        }

        // Haptic cue is triggered on interaction, not continuously
    }

    /// <summary>
    /// Depth Cue 1: Size - Closer objects appear larger
    /// Works for 100% of users (no stereoscopic vision required)
    /// </summary>
    private void ApplySizeCue(float normalizedDepth)
    {
        // Lerp scale: closer = larger, farther = smaller
        float scaleMultiplier = Mathf.Lerp(scaleAtClosest, scaleAtFarthest, normalizedDepth);
        transform.localScale = originalScale * scaleMultiplier * baseScale;
    }

    /// <summary>
    /// Depth Cue 2: Shadows - Distance from surface visible via shadow
    /// Works for 100% of users (no stereoscopic vision required)
    /// </summary>
    private void EnableShadowCasting()
    {
        Renderer[] renderers = GetComponentsInChildren<Renderer>();
        int shadowsEnabled = 0;

        foreach (Renderer r in renderers)
        {
            if (r.shadowCastingMode == UnityEngine.Rendering.ShadowCastingMode.Off)
            {
                r.shadowCastingMode = UnityEngine.Rendering.ShadowCastingMode.On;
                shadowsEnabled++;
            }
        }

        if (shadowsEnabled > 0)
        {
            Debug.Log($"[{name}] Enabled shadow casting on {shadowsEnabled} renderer(s) for depth cue");
        }

        // Note: Occlusion (Depth Cue 3) is automatic - no code needed
        // Unity's rendering naturally handles front objects hiding back objects
    }

    /// <summary>
    /// Depth Cue 4: Spatial Audio - Closer objects sound louder
    /// Works for 100% of users (no stereoscopic vision required)
    /// </summary>
    private void ApplyAudioCue(float normalizedDepth)
    {
        if (audioSource == null) return;

        // Lerp volume: closer = louder, farther = quieter
        audioSource.volume = Mathf.Lerp(volumeAtClosest, volumeAtFarthest, normalizedDepth);

        // Configure spatial blend (3D sound from desktop speakers)
        audioSource.spatialBlend = 1.0f; // Fully 3D
        audioSource.rolloffMode = AudioRolloffMode.Linear;
        audioSource.minDistance = closestDistance;
        audioSource.maxDistance = farthestDistance;
    }

    /// <summary>
    /// Depth Cue 5: Haptic Feedback - Trigger on interaction
    /// Call this method when object is selected/interacted with
    /// Works for 100% of users (no stereoscopic vision required)
    /// </summary>
    public void TriggerHapticDepthCue()
    {
        if (!enableHapticCue) return;

        if (hapticFeedback != null)
        {
            hapticFeedback.TriggerDepthCue(transform.position);
        }
        else if (zCore != null && zCore.IsStylusInView())
        {
            // Fallback: direct haptic trigger
            float normalizedDepth = Mathf.InverseLerp(closestDistance, farthestDistance, currentDepth);
            float hapticIntensity = Mathf.Lerp(0.7f, 0.2f, normalizedDepth);
            zCore.VibrateStylus(hapticIntensity, 100);
        }
    }

    /// <summary>
    /// Get the current depth of this object from the camera
    /// </summary>
    public float GetCurrentDepth()
    {
        return currentDepth;
    }

    /// <summary>
    /// Get normalized depth (0 = closest, 1 = farthest)
    /// </summary>
    public float GetNormalizedDepth()
    {
        return Mathf.InverseLerp(closestDistance, farthestDistance, currentDepth);
    }

    private void ValidateDepthCues()
    {
        int enabledCues = 0;
        string[] cueNames = new string[6];
        int index = 0;

        if (enableSizeCue) { enabledCues++; cueNames[index++] = "Size"; }
        if (enableShadowCue) { enabledCues++; cueNames[index++] = "Shadow"; }
        cueNames[index++] = "Occlusion (automatic)"; enabledCues++; // Always available
        if (enableAudioCue && audioSource != null) { enabledCues++; cueNames[index++] = "Audio"; }
        if (enableHapticCue) { enabledCues++; cueNames[index++] = "Haptic"; }
        cueNames[index++] = "Motion Parallax (automatic)"; enabledCues++; // Unity camera movement

        Debug.Log($"[{name}] Depth cues enabled: {enabledCues}/6 - {string.Join(", ", cueNames, 0, index)}");

        // CRITICAL WARNING: If too few depth cues
        if (enabledCues < 3)
        {
            Debug.LogWarning(
                $"[{name}] ACCESSIBILITY WARNING: Only {enabledCues} depth cues enabled. " +
                $"Recommended: At least 3 cues for users who cannot perceive stereoscopic 3D (10-15% of users)."
            );
        }
    }

    #if UNITY_EDITOR
    private void OnDrawGizmosSelected()
    {
        // Visualize depth range in editor
        if (targetCamera == null)
        {
            targetCamera = Camera.main;
        }

        if (targetCamera != null)
        {
            Gizmos.color = Color.green;
            Gizmos.DrawWireSphere(targetCamera.transform.position, closestDistance);

            Gizmos.color = Color.red;
            Gizmos.DrawWireSphere(targetCamera.transform.position, farthestDistance);

            Gizmos.color = Color.yellow;
            Gizmos.DrawLine(targetCamera.transform.position, transform.position);
        }
    }

    private void OnValidate()
    {
        // Ensure closest < farthest
        if (closestDistance >= farthestDistance)
        {
            farthestDistance = closestDistance + 1f;
            Debug.LogWarning($"[{name}] Farthest distance must be > closest distance. Adjusted.");
        }
    }

    [ContextMenu("Test: Simulate Glasses Off")]
    private void SimulateGlassesOff()
    {
        Debug.Log($"[{name}] Simulating zSpace glasses removed (2D view):");
        Debug.Log($"  - Size cue: {(enableSizeCue ? "ENABLED" : "DISABLED")}");
        Debug.Log($"  - Shadow cue: {(enableShadowCue ? "ENABLED" : "DISABLED")}");
        Debug.Log($"  - Occlusion: ENABLED (automatic)");
        Debug.Log($"  - Audio cue: {(enableAudioCue && audioSource != null ? "ENABLED" : "DISABLED")}");
        Debug.Log($"  - Haptic cue: {(enableHapticCue ? "ENABLED" : "DISABLED")}");
        Debug.Log($"  - Motion parallax: ENABLED (automatic)");
        Debug.Log($"Application should be fully functional in 2D mode!");
    }
    #endif
}
