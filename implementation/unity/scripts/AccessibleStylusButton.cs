using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Accessibility;
using zSpace.Core;

/// <summary>
/// Accessible button for zSpace that supports stylus, keyboard, and mouse input.
/// Implements WCAG 2.2 Level AA compliance for zSpace desktop platform.
///
/// Standards:
/// - WCAG 2.1.1 Keyboard (Level A): All stylus functionality available via keyboard
/// - WCAG 2.4.7 Focus Visible (Level AA): Focus indicator in 3D space
/// - WCAG 2.5.8 Target Size (Level AA): Minimum 24x24 pixels (desktop standard)
/// - WCAG 4.1.2 Name, Role, Value (Level A): Screen reader support
/// </summary>
public class AccessibleStylusButton : MonoBehaviour
{
    [Header("Button Configuration")]
    [SerializeField] private Button button;
    [SerializeField] private string accessibleLabel = "Button";
    [Tooltip("Keyboard key that activates this button (alternative to stylus)")]
    [SerializeField] private KeyCode keyboardAlternative = KeyCode.Space;

    [Header("zSpace Integration")]
    [Tooltip("Which stylus button activates this UI button (0, 1, or 2)")]
    [SerializeField] private int stylusButtonIndex = 0;
    [SerializeField] private bool enableHapticFeedback = true;
    [SerializeField] [Range(0f, 1f)] private float hapticIntensity = 0.3f;
    [SerializeField] private int hapticDurationMs = 100;

    [Header("Focus Indicators")]
    [SerializeField] private bool showFocusIndicator = true;
    [SerializeField] private Color focusColor = new Color(0.25f, 0.59f, 0.95f); // Blue
    [SerializeField] private float focusGlowIntensity = 1.5f;

    // Internal state
    private ZCore zCore;
    private Image buttonImage;
    private Color originalColor;
    private bool isHovered = false;
    private bool isFocused = false;

    void Start()
    {
        // Find zSpace SDK core component
        zCore = FindObjectOfType<ZCore>();
        if (zCore == null)
        {
            Debug.LogWarning($"[{name}] zSpace ZCore not found. Stylus input will not work. Keyboard alternative still available.");
        }

        // Get button component
        if (button == null)
        {
            button = GetComponent<Button>();
        }

        if (button == null)
        {
            Debug.LogError($"[{name}] No Button component found! AccessibleStylusButton requires a Unity UI Button.");
            return;
        }

        // Setup button click handler
        button.onClick.AddListener(OnButtonClick);

        // Get Image component for visual feedback
        buttonImage = GetComponent<Image>();
        if (buttonImage != null)
        {
            originalColor = buttonImage.color;
        }

        // Register with Windows screen readers (NVDA, Narrator, JAWS)
        RegisterWithScreenReader();

        // Validate target size (WCAG 2.5.8 - minimum 24x24 pixels)
        ValidateTargetSize();
    }

    void Update()
    {
        // Keyboard alternative (WCAG 2.1.1 - Keyboard accessibility)
        if (Input.GetKeyDown(keyboardAlternative) && isFocused)
        {
            button.onClick.Invoke();
        }

        // Stylus button input (if zSpace SDK available)
        if (zCore != null && isHovered)
        {
            if (zCore.GetButtonDown(stylusButtonIndex))
            {
                button.onClick.Invoke();
            }
        }

        // Update focus indicator
        if (showFocusIndicator)
        {
            UpdateFocusIndicator();
        }
    }

    private void OnButtonClick()
    {
        Debug.Log($"[{name}] Button activated: {accessibleLabel}");

        // Provide haptic feedback (if stylus is active)
        if (enableHapticFeedback && zCore != null && zCore.IsStylusInView())
        {
            zCore.VibrateStylus(hapticIntensity, hapticDurationMs);
        }

        // Announce to screen reader
        AnnounceToScreenReader($"{accessibleLabel} activated");
    }

    private void UpdateFocusIndicator()
    {
        if (buttonImage == null) return;

        // Show focus indicator when keyboard-focused
        if (isFocused)
        {
            buttonImage.color = Color.Lerp(originalColor, focusColor, 0.3f);
        }
        else if (!isHovered)
        {
            buttonImage.color = originalColor;
        }
    }

    private void RegisterWithScreenReader()
    {
        #if UNITY_STANDALONE_WIN
        // Register with Windows UI Automation for screen readers
        // Requires Unity 2021.3+ and com.unity.modules.accessibility
        try
        {
            AccessibilityManager.RegisterNode(gameObject, accessibleLabel, "button");
            Debug.Log($"[{name}] Registered with screen reader: '{accessibleLabel}'");
        }
        catch (System.Exception e)
        {
            Debug.LogWarning($"[{name}] Could not register with screen reader: {e.Message}");
            Debug.LogWarning("Ensure Unity Accessibility module is installed: com.unity.modules.accessibility");
        }
        #endif
    }

    private void AnnounceToScreenReader(string message)
    {
        #if UNITY_STANDALONE_WIN
        try
        {
            AccessibilityManager.Announce(message);
        }
        catch (System.Exception e)
        {
            Debug.LogWarning($"[{name}] Could not announce to screen reader: {e.Message}");
        }
        #endif
    }

    private void ValidateTargetSize()
    {
        // WCAG 2.5.8: Target Size (Minimum) - Level AA
        // Interactive elements must be at least 24x24 CSS pixels
        // zSpace uses desktop standard (24px), NOT VR standard (44px)

        RectTransform rect = GetComponent<RectTransform>();
        if (rect == null) return;

        const float minSize = 24f;
        float width = rect.rect.width;
        float height = rect.rect.height;

        if (width < minSize || height < minSize)
        {
            Debug.LogWarning(
                $"[{name}] Target size too small! " +
                $"Current: {width:F1}x{height:F1}px, " +
                $"Minimum: {minSize}x{minSize}px (WCAG 2.5.8). " +
                $"Resize in RectTransform to meet accessibility standards."
            );
        }
        else
        {
            Debug.Log($"[{name}] Target size OK: {width:F1}x{height:F1}px (>= {minSize}px)");
        }
    }

    // Called by Unity's EventSystem when pointer enters button area
    public void OnPointerEnter()
    {
        isHovered = true;
    }

    // Called by Unity's EventSystem when pointer exits button area
    public void OnPointerExit()
    {
        isHovered = false;
    }

    // Called by keyboard navigation system when button receives focus
    public void OnSelect()
    {
        isFocused = true;
        AnnounceToScreenReader($"{accessibleLabel}, button");
    }

    // Called by keyboard navigation system when button loses focus
    public void OnDeselect()
    {
        isFocused = false;
    }

    #if UNITY_EDITOR
    private void OnValidate()
    {
        // Editor-time validation
        if (button == null)
        {
            button = GetComponent<Button>();
        }

        // Validate stylus button index
        if (stylusButtonIndex < 0 || stylusButtonIndex > 2)
        {
            Debug.LogWarning($"[{name}] Invalid stylus button index: {stylusButtonIndex}. zSpace stylus has buttons 0, 1, 2.");
            stylusButtonIndex = Mathf.Clamp(stylusButtonIndex, 0, 2);
        }
    }
    #endif
}
