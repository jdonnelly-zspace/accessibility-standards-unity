using UnityEngine;
using UnityEngine.UI;
using System.Collections;
using System.Collections.Generic;

/// <summary>
/// Spatial subtitle system for zSpace applications.
/// Provides visual captions for audio cues and spoken dialogue.
///
/// WCAG 1.2.2 (Level A): Captions (Prerecorded)
/// WCAG 1.2.4 (Level AA): Captions (Live)
/// W3C XAUR: Visual alternatives for audio information
///
/// For zSpace: Subtitles appear in 3D space (World Space Canvas) or 2D overlay.
/// </summary>
public class SubtitleSystem : MonoBehaviour
{
    [Header("Subtitle Display")]
    [SerializeField] private Text subtitleText; // Legacy UI.Text
    [SerializeField] private TMPro.TextMeshProUGUI subtitleTextTMP; // TextMeshPro (recommended)

    [Header("Display Settings")]
    [Tooltip("How long subtitles remain visible (seconds)")]
    [SerializeField] private float defaultDisplayDuration = 3.0f;

    [Tooltip("Fade in/out duration (seconds)")]
    [SerializeField] private float fadeDuration = 0.3f;

    [Header("Spatial Subtitles (3D)")]
    [Tooltip("Show subtitles in 3D space near audio source")]
    [SerializeField] private bool useSpatialSubtitles = true;

    [Tooltip("Distance above audio source to show subtitle (world units)")]
    [SerializeField] private float subtitleHeightOffset = 0.5f;

    [Tooltip("Billboard subtitles to always face camera")]
    [SerializeField] private bool billboardToCamera = true;

    [Header("Accessibility")]
    [Tooltip("Minimum font size for readability (WCAG 1.4.4)")]
    [SerializeField] private int minFontSize = 18;

    [Tooltip("Subtitle background for contrast (WCAG 1.4.3)")]
    [SerializeField] private bool useBackground = true;

    [Tooltip("Background color (semi-transparent black recommended)")]
    [SerializeField] private Color backgroundColor = new Color(0f, 0f, 0f, 0.8f);

    // Internal state
    private CanvasGroup canvasGroup;
    private Camera mainCamera;
    private Queue<SubtitleEntry> subtitleQueue = new Queue<SubtitleEntry>();
    private Coroutine displayCoroutine;

    private struct SubtitleEntry
    {
        public string text;
        public float duration;
        public Vector3? worldPosition; // Null for screen-space subtitles
    }

    void Start()
    {
        mainCamera = Camera.main;

        // Get canvas group for fading
        canvasGroup = GetComponent<CanvasGroup>();
        if (canvasGroup == null)
        {
            canvasGroup = gameObject.AddComponent<CanvasGroup>();
        }

        // Validate text component
        if (subtitleTextTMP == null && subtitleText == null)
        {
            Debug.LogError($"[{name}] No Text component assigned! Assign TextMeshProUGUI or UI.Text in Inspector.");
            enabled = false;
            return;
        }

        // Set initial state
        canvasGroup.alpha = 0f;
        SetSubtitleText("");

        // Configure accessibility
        ConfigureAccessibility();
    }

    void Update()
    {
        // Billboard subtitle to face camera (if spatial)
        if (useSpatialSubtitles && billboardToCamera && mainCamera != null)
        {
            transform.LookAt(mainCamera.transform);
            transform.Rotate(0, 180, 0); // Face camera
        }
    }

    private void ConfigureAccessibility()
    {
        // Ensure minimum font size (WCAG 1.4.4 - Resize text)
        if (subtitleTextTMP != null)
        {
            if (subtitleTextTMP.fontSize < minFontSize)
            {
                subtitleTextTMP.fontSize = minFontSize;
                Debug.Log($"[{name}] Font size increased to {minFontSize}pt for accessibility");
            }
        }
        else if (subtitleText != null)
        {
            if (subtitleText.fontSize < minFontSize)
            {
                subtitleText.fontSize = minFontSize;
                Debug.Log($"[{name}] Font size increased to {minFontSize}pt for accessibility");
            }
        }

        // Configure background for contrast (WCAG 1.4.3)
        if (useBackground)
        {
            Image background = GetComponent<Image>();
            if (background == null)
            {
                background = gameObject.AddComponent<Image>();
            }
            background.color = backgroundColor;
        }
    }

    /// <summary>
    /// Show a subtitle at screen position (2D overlay).
    /// </summary>
    public void ShowSubtitle(string text, float duration = -1f)
    {
        if (duration < 0f)
        {
            duration = defaultDisplayDuration;
        }

        SubtitleEntry entry = new SubtitleEntry
        {
            text = text,
            duration = duration,
            worldPosition = null // Screen-space
        };

        subtitleQueue.Enqueue(entry);
        ProcessQueue();
    }

    /// <summary>
    /// Show a subtitle in 3D space near audio source (spatial subtitle).
    /// </summary>
    public void ShowSubtitle(string text, Vector3 worldPosition, float duration = -1f)
    {
        if (duration < 0f)
        {
            duration = defaultDisplayDuration;
        }

        SubtitleEntry entry = new SubtitleEntry
        {
            text = text,
            duration = duration,
            worldPosition = useSpatialSubtitles ? worldPosition : (Vector3?)null
        };

        subtitleQueue.Enqueue(entry);
        ProcessQueue();
    }

    /// <summary>
    /// Hide current subtitle immediately.
    /// </summary>
    public void HideSubtitle()
    {
        if (displayCoroutine != null)
        {
            StopCoroutine(displayCoroutine);
        }

        subtitleQueue.Clear();
        StartCoroutine(FadeOut());
    }

    private void ProcessQueue()
    {
        // Don't start new subtitle if one is already displaying
        if (displayCoroutine != null) return;

        if (subtitleQueue.Count > 0)
        {
            SubtitleEntry entry = subtitleQueue.Dequeue();
            displayCoroutine = StartCoroutine(DisplaySubtitle(entry));
        }
    }

    private IEnumerator DisplaySubtitle(SubtitleEntry entry)
    {
        // Position subtitle (spatial or screen-space)
        if (entry.worldPosition.HasValue)
        {
            // Spatial subtitle (3D world space)
            Vector3 position = entry.worldPosition.Value + Vector3.up * subtitleHeightOffset;
            transform.position = position;
        }

        // Set text
        SetSubtitleText(entry.text);

        // Fade in
        yield return StartCoroutine(FadeIn());

        // Hold
        yield return new WaitForSeconds(entry.duration);

        // Fade out
        yield return StartCoroutine(FadeOut());

        // Clear text
        SetSubtitleText("");

        displayCoroutine = null;

        // Process next in queue
        if (subtitleQueue.Count > 0)
        {
            ProcessQueue();
        }
    }

    private IEnumerator FadeIn()
    {
        float elapsed = 0f;
        while (elapsed < fadeDuration)
        {
            elapsed += Time.deltaTime;
            canvasGroup.alpha = Mathf.Lerp(0f, 1f, elapsed / fadeDuration);
            yield return null;
        }
        canvasGroup.alpha = 1f;
    }

    private IEnumerator FadeOut()
    {
        float elapsed = 0f;
        while (elapsed < fadeDuration)
        {
            elapsed += Time.deltaTime;
            canvasGroup.alpha = Mathf.Lerp(1f, 0f, elapsed / fadeDuration);
            yield return null;
        }
        canvasGroup.alpha = 0f;
    }

    private void SetSubtitleText(string text)
    {
        if (subtitleTextTMP != null)
        {
            subtitleTextTMP.text = text;
        }
        else if (subtitleText != null)
        {
            subtitleText.text = text;
        }
    }

    /// <summary>
    /// Enable or disable spatial subtitles (accessibility setting).
    /// </summary>
    public void SetSpatialSubtitlesEnabled(bool enabled)
    {
        useSpatialSubtitles = enabled;
        Debug.Log($"[{name}] Spatial subtitles {(enabled ? "enabled" : "disabled")}");
    }

    /// <summary>
    /// Set subtitle font size (accessibility setting).
    /// </summary>
    public void SetFontSize(int size)
    {
        minFontSize = Mathf.Max(14, size); // WCAG minimum

        if (subtitleTextTMP != null)
        {
            subtitleTextTMP.fontSize = minFontSize;
        }
        else if (subtitleText != null)
        {
            subtitleText.fontSize = minFontSize;
        }

        Debug.Log($"[{name}] Font size set to {minFontSize}pt");
    }

    #if UNITY_EDITOR
    [ContextMenu("Test: Show Test Subtitle (2D)")]
    private void TestSubtitle2D()
    {
        ShowSubtitle("This is a test subtitle in 2D overlay mode", 3f);
    }

    [ContextMenu("Test: Show Test Subtitle (3D)")]
    private void TestSubtitle3D()
    {
        if (mainCamera != null)
        {
            Vector3 position = mainCamera.transform.position + mainCamera.transform.forward * 2f;
            ShowSubtitle("This is a test subtitle in 3D spatial mode", position, 3f);
        }
    }

    [ContextMenu("Test: Hide Subtitle")]
    private void TestHideSubtitle()
    {
        HideSubtitle();
    }
    #endif
}
