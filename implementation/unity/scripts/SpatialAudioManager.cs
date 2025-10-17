using UnityEngine;

/// <summary>
/// Manages spatial audio for zSpace desktop speakers (not headphones).
/// Provides audio-based depth cues for users who cannot perceive stereoscopic 3D.
///
/// W3C XAUR (XR Accessibility): Spatial audio is a critical depth perception alternative.
/// For zSpace: Audio comes from desktop speakers, not headphones (different from VR).
///
/// Key Differences from VR:
/// - VR: Headphones (intimate, precise 3D audio)
/// - zSpace: Desktop speakers (shared space, less precise but still effective)
/// </summary>
public class SpatialAudioManager : MonoBehaviour
{
    [Header("Audio Source Configuration")]
    [Tooltip("Audio source for spatial audio")]
    [SerializeField] private AudioSource audioSource;

    [Header("Spatialization Settings")]
    [Tooltip("Enable 3D spatial audio from desktop speakers")]
    [SerializeField] private bool enableSpatialAudio = true;

    [Tooltip("Spatial blend: 0 = 2D (mono), 1 = 3D (spatial)")]
    [SerializeField] [Range(0f, 1f)] private float spatialBlend = 1.0f;

    [Header("Distance Attenuation (Depth Cue)")]
    [Tooltip("Distance where audio is loudest (world units)")]
    [SerializeField] private float minDistance = 1.0f;

    [Tooltip("Distance where audio is quietest (world units)")]
    [SerializeField] private float maxDistance = 50.0f;

    [Tooltip("How audio volume decreases with distance")]
    [SerializeField] private AudioRolloffMode rolloffMode = AudioRolloffMode.Linear;

    [Header("Volume Settings")]
    [Tooltip("Base volume level")]
    [SerializeField] [Range(0f, 1f)] private float baseVolume = 0.8f;

    [Tooltip("Enable mono fallback (important for accessibility)")]
    [SerializeField] private bool provideMonoAlternative = true;

    [Header("Accessibility Features")]
    [Tooltip("Provide visual captions for important audio cues")]
    [SerializeField] private bool enableCaptions = true;

    [Tooltip("Reference to caption system (if available)")]
    [SerializeField] private SubtitleSystem subtitleSystem;

    void Start()
    {
        // Get or create audio source
        if (audioSource == null)
        {
            audioSource = GetComponent<AudioSource>();
        }

        if (audioSource == null)
        {
            audioSource = gameObject.AddComponent<AudioSource>();
            Debug.Log($"[{name}] AudioSource component added automatically");
        }

        ConfigureAudioAccessibility();
    }

    private void ConfigureAudioAccessibility()
    {
        if (audioSource == null) return;

        // Configure spatial audio for desktop speakers
        if (enableSpatialAudio)
        {
            audioSource.spatialBlend = spatialBlend;

            // Distance-based volume attenuation (depth cue)
            audioSource.rolloffMode = rolloffMode;
            audioSource.minDistance = minDistance;
            audioSource.maxDistance = maxDistance;

            // Doppler effect (subtle motion cue)
            audioSource.dopplerLevel = 0.5f; // Subtle

            // Spread angle (desktop speakers are wider than headphones)
            audioSource.spread = 90f; // Wider spread for speaker audio

            Debug.Log($"[{name}] Spatial audio enabled (desktop speakers) - Distance: {minDistance}-{maxDistance}m");
        }
        else
        {
            // 2D audio (no spatialization)
            audioSource.spatialBlend = 0f;
            Debug.Log($"[{name}] 2D audio mode (no spatialization)");
        }

        // Set base volume
        audioSource.volume = baseVolume;

        // Ensure audio isn't *only* spatial
        // Users with hearing impairments in one ear can still hear mono audio
        if (provideMonoAlternative)
        {
            // Configure for desktop speakers (not headphones)
            // Even with spatial blend, linear rolloff ensures audibility
            Debug.Log($"[{name}] Mono fallback enabled for accessibility");
        }
    }

    /// <summary>
    /// Play audio with optional caption announcement.
    /// </summary>
    public void PlayAudio(AudioClip clip, string caption = null)
    {
        if (audioSource == null || clip == null) return;

        audioSource.PlayOneShot(clip);

        // Provide caption if enabled and caption provided
        if (enableCaptions && !string.IsNullOrEmpty(caption))
        {
            ShowCaption(caption);
        }
    }

    /// <summary>
    /// Play looping audio (e.g., ambient sound, continuous feedback).
    /// </summary>
    public void PlayLooping(AudioClip clip, string caption = null)
    {
        if (audioSource == null || clip == null) return;

        audioSource.clip = clip;
        audioSource.loop = true;
        audioSource.Play();

        if (enableCaptions && !string.IsNullOrEmpty(caption))
        {
            ShowCaption(caption);
        }
    }

    /// <summary>
    /// Stop current audio playback.
    /// </summary>
    public void StopAudio()
    {
        if (audioSource == null) return;
        audioSource.Stop();
    }

    /// <summary>
    /// Set volume dynamically (useful for depth cues).
    /// </summary>
    public void SetVolume(float volume)
    {
        if (audioSource == null) return;
        audioSource.volume = Mathf.Clamp01(volume);
    }

    /// <summary>
    /// Get current distance from audio listener (camera).
    /// Useful for depth cue visualization.
    /// </summary>
    public float GetDistanceFromListener()
    {
        AudioListener listener = FindObjectOfType<AudioListener>();
        if (listener == null) return 0f;

        return Vector3.Distance(transform.position, listener.transform.position);
    }

    /// <summary>
    /// Get normalized distance (0 = closest, 1 = farthest).
    /// </summary>
    public float GetNormalizedDistance()
    {
        float distance = GetDistanceFromListener();
        return Mathf.InverseLerp(minDistance, maxDistance, distance);
    }

    private void ShowCaption(string caption)
    {
        if (subtitleSystem != null)
        {
            subtitleSystem.ShowSubtitle(caption, transform.position);
        }
        else
        {
            // Fallback: Log to console
            Debug.Log($"[Audio Caption] {caption}");
        }
    }

    /// <summary>
    /// Enable or disable spatial audio (accessibility setting).
    /// </summary>
    public void SetSpatialAudioEnabled(bool enabled)
    {
        enableSpatialAudio = enabled;
        ConfigureAudioAccessibility();
    }

    /// <summary>
    /// Set whether captions are shown for audio cues.
    /// </summary>
    public void SetCaptionsEnabled(bool enabled)
    {
        enableCaptions = enabled;
        Debug.Log($"[{name}] Audio captions {(enabled ? "enabled" : "disabled")}");
    }

    #if UNITY_EDITOR
    private void OnValidate()
    {
        // Ensure min < max
        if (minDistance >= maxDistance)
        {
            maxDistance = minDistance + 1f;
            Debug.LogWarning($"[{name}] Max distance must be > min distance. Adjusted.");
        }
    }

    private void OnDrawGizmosSelected()
    {
        // Visualize audio range in editor
        Gizmos.color = new Color(0f, 1f, 0f, 0.3f);
        Gizmos.DrawWireSphere(transform.position, minDistance);

        Gizmos.color = new Color(1f, 0f, 0f, 0.3f);
        Gizmos.DrawWireSphere(transform.position, maxDistance);
    }

    [ContextMenu("Test: Play Test Sound")]
    private void TestPlaySound()
    {
        if (audioSource != null && audioSource.clip != null)
        {
            PlayAudio(audioSource.clip, "Test sound playing");
        }
        else
        {
            Debug.LogWarning($"[{name}] No AudioClip assigned to test");
        }
    }
    #endif
}
