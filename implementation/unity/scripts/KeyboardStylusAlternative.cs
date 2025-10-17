using UnityEngine;
using zSpace.Core;

/// <summary>
/// Maps zSpace stylus buttons to keyboard keys for accessibility.
/// CRITICAL for WCAG 2.1.1 Keyboard (Level A) compliance.
///
/// All stylus functionality must be available via keyboard for users who:
/// - Cannot use the stylus due to motor disabilities
/// - Prefer keyboard navigation
/// - Are testing the application without zSpace hardware
///
/// Default Mapping:
/// - Stylus Button 0 → Spacebar (primary action)
/// - Stylus Button 1 → E key (secondary action)
/// - Stylus Button 2 → R key (tertiary action)
/// - Stylus pointing → Mouse cursor (raycast alternative)
/// </summary>
public class KeyboardStylusAlternative : MonoBehaviour
{
    [Header("Keyboard Mapping")]
    [Tooltip("Keyboard key for Stylus Button 0 (primary action)")]
    [SerializeField] private KeyCode primaryKey = KeyCode.Space;

    [Tooltip("Keyboard key for Stylus Button 1 (secondary action)")]
    [SerializeField] private KeyCode secondaryKey = KeyCode.E;

    [Tooltip("Keyboard key for Stylus Button 2 (tertiary action)")]
    [SerializeField] private KeyCode tertiaryKey = KeyCode.R;

    [Header("Mouse Alternative")]
    [Tooltip("Allow mouse clicks as alternative to stylus Button 0")]
    [SerializeField] private bool enableMouseAlternative = true;

    [Header("Debugging")]
    [SerializeField] private bool logInputEvents = false;

    // Internal state
    private ZCore zCore;

    // Public properties to check button states (accessible by other scripts)
    public bool IsPrimaryButtonDown => GetPrimaryButtonDown();
    public bool IsSecondaryButtonDown => GetSecondaryButtonDown();
    public bool IsTertiaryButtonDown => GetTertiaryButtonDown();

    public bool IsPrimaryButton => GetPrimaryButton();
    public bool IsSecondaryButton => GetSecondaryButton();
    public bool IsTertiaryButton => GetTertiaryButton();

    public bool IsPrimaryButtonUp => GetPrimaryButtonUp();
    public bool IsSecondaryButtonUp => GetSecondaryButtonUp();
    public bool IsTertiaryButtonUp => GetTertiaryButtonUp();

    void Start()
    {
        // Find zSpace SDK core component (optional - falls back to keyboard/mouse)
        zCore = FindObjectOfType<ZCore>();

        if (zCore == null)
        {
            Debug.LogWarning(
                $"[{name}] zSpace ZCore not found. Stylus input unavailable. " +
                $"Keyboard alternatives will work: {primaryKey} (Button 0), {secondaryKey} (Button 1), {tertiaryKey} (Button 2)"
            );
        }
        else
        {
            Debug.Log(
                $"[{name}] Keyboard alternatives enabled: " +
                $"{primaryKey} = Stylus Button 0, " +
                $"{secondaryKey} = Stylus Button 1, " +
                $"{tertiaryKey} = Stylus Button 2"
            );
        }
    }

    // GetButtonDown: Returns true on the frame the button is pressed
    private bool GetPrimaryButtonDown()
    {
        bool stylusDown = (zCore != null) && zCore.GetButtonDown(0);
        bool keyboardDown = Input.GetKeyDown(primaryKey);
        bool mouseDown = enableMouseAlternative && Input.GetMouseButtonDown(0);

        bool result = stylusDown || keyboardDown || mouseDown;

        if (result && logInputEvents)
        {
            string source = stylusDown ? "Stylus" : (keyboardDown ? "Keyboard" : "Mouse");
            Debug.Log($"[{name}] Primary button DOWN ({source})");
        }

        return result;
    }

    private bool GetSecondaryButtonDown()
    {
        bool stylusDown = (zCore != null) && zCore.GetButtonDown(1);
        bool keyboardDown = Input.GetKeyDown(secondaryKey);

        bool result = stylusDown || keyboardDown;

        if (result && logInputEvents)
        {
            string source = stylusDown ? "Stylus" : "Keyboard";
            Debug.Log($"[{name}] Secondary button DOWN ({source})");
        }

        return result;
    }

    private bool GetTertiaryButtonDown()
    {
        bool stylusDown = (zCore != null) && zCore.GetButtonDown(2);
        bool keyboardDown = Input.GetKeyDown(tertiaryKey);

        bool result = stylusDown || keyboardDown;

        if (result && logInputEvents)
        {
            string source = stylusDown ? "Stylus" : "Keyboard";
            Debug.Log($"[{name}] Tertiary button DOWN ({source})");
        }

        return result;
    }

    // GetButton: Returns true while the button is held down
    private bool GetPrimaryButton()
    {
        bool stylusHeld = (zCore != null) && zCore.GetButton(0);
        bool keyboardHeld = Input.GetKey(primaryKey);
        bool mouseHeld = enableMouseAlternative && Input.GetMouseButton(0);

        return stylusHeld || keyboardHeld || mouseHeld;
    }

    private bool GetSecondaryButton()
    {
        bool stylusHeld = (zCore != null) && zCore.GetButton(1);
        bool keyboardHeld = Input.GetKey(secondaryKey);

        return stylusHeld || keyboardHeld;
    }

    private bool GetTertiaryButton()
    {
        bool stylusHeld = (zCore != null) && zCore.GetButton(2);
        bool keyboardHeld = Input.GetKey(tertiaryKey);

        return stylusHeld || keyboardHeld;
    }

    // GetButtonUp: Returns true on the frame the button is released
    private bool GetPrimaryButtonUp()
    {
        bool stylusUp = (zCore != null) && zCore.GetButtonUp(0);
        bool keyboardUp = Input.GetKeyUp(primaryKey);
        bool mouseUp = enableMouseAlternative && Input.GetMouseButtonUp(0);

        bool result = stylusUp || keyboardUp || mouseUp;

        if (result && logInputEvents)
        {
            string source = stylusUp ? "Stylus" : (keyboardUp ? "Keyboard" : "Mouse");
            Debug.Log($"[{name}] Primary button UP ({source})");
        }

        return result;
    }

    private bool GetSecondaryButtonUp()
    {
        bool stylusUp = (zCore != null) && zCore.GetButtonUp(1);
        bool keyboardUp = Input.GetKeyUp(secondaryKey);

        bool result = stylusUp || keyboardUp;

        if (result && logInputEvents)
        {
            string source = stylusUp ? "Stylus" : "Keyboard";
            Debug.Log($"[{name}] Secondary button UP ({source})");
        }

        return result;
    }

    private bool GetTertiaryButtonUp()
    {
        bool stylusUp = (zCore != null) && zCore.GetButtonUp(2);
        bool keyboardUp = Input.GetKeyUp(tertiaryKey);

        bool result = stylusUp || keyboardUp;

        if (result && logInputEvents)
        {
            string source = stylusUp ? "Stylus" : "Keyboard";
            Debug.Log($"[{name}] Tertiary button UP ({source})");
        }

        return result;
    }

    /// <summary>
    /// Get the current stylus position in world space, or mouse raycast position as fallback.
    /// Provides pointing alternative for users who cannot use stylus.
    /// </summary>
    public Vector3 GetPointerWorldPosition()
    {
        // Try stylus first
        if (zCore != null && zCore.IsStylusInView())
        {
            return zCore.GetStylusPosition();
        }

        // Fallback to mouse raycast
        Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
        if (Physics.Raycast(ray, out RaycastHit hit))
        {
            return hit.point;
        }

        // No hit - return far position along ray
        return ray.GetPoint(10f);
    }

    /// <summary>
    /// Check if stylus is currently in view, or always return true if using keyboard/mouse.
    /// </summary>
    public bool IsPointerActive()
    {
        // If stylus is active, return its status
        if (zCore != null)
        {
            return zCore.IsStylusInView();
        }

        // If no stylus, assume mouse/keyboard is always available
        return true;
    }

    #if UNITY_EDITOR
    private void OnValidate()
    {
        // Warn about key conflicts
        if (primaryKey == secondaryKey || primaryKey == tertiaryKey || secondaryKey == tertiaryKey)
        {
            Debug.LogWarning($"[{name}] Key conflict detected! Each button should have a unique key mapping.");
        }
    }
    #endif
}
