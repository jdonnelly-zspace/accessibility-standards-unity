# W3C XR Accessibility User Requirements (XAUR) - Unity zSpace Implementation Guide

**Based on:** [W3C XR Accessibility User Requirements](https://www.w3.org/TR/xaur/)
**Last Updated:** October 2025
**Target:** Unity 2021.3 LTS or newer + zSpace Unity SDK
**Platform:** zSpace (stereoscopic 3D display + tracked glasses + stylus)

---

## Overview

This document provides Unity zSpace-specific implementation guidance for the W3C XR Accessibility User Requirements (XAUR) adapted for stereoscopic 3D desktop environments. While XAUR typically covers VR/AR headsets, this guide adapts the principles for zSpace's unique platform: a stereoscopic 3D display with tracked glasses and stylus input.

**Key Principle:** zSpace applications must be operable by users regardless of their physical, cognitive, or sensory abilities.

**zSpace-Specific Considerations:**
- Desktop-based (not headset) - reduces motion sickness concerns
- Stylus input (3 buttons + haptics) - requires keyboard/mouse alternatives
- Stereoscopic 3D - requires depth perception alternatives
- Seated experience - different ergonomics than VR
- Screen visible to others - enables collaborative accessibility testing

---

## Table of Contents

1. [Immersive Semantics and Customization](#1-immersive-semantics-and-customization)
2. [Motion-Agnostic Interactions](#2-motion-agnostic-interactions)
3. [Immersive Personalization](#3-immersive-personalization)
4. [Interaction and Target Customization](#4-interaction-and-target-customization)
5. [Voice Commands](#5-voice-commands)
6. [Color and Contrast Customization](#6-color-and-contrast-customization)
7. [Magnification Support](#7-magnification-support)
8. [Critical Messaging and Alerts](#8-critical-messaging-and-alerts)
9. [Gestural Interfaces](#9-gestural-interfaces)
10. [Text Transformation and Captions](#10-text-transformation-and-captions)

---

## 1. Immersive Semantics and Customization

### Requirement
Navigation must feature intuitive affordances with accurate object/location identification. Controls require alternative mapping, repositioning, resizing, and sensitivity adjustment. Important contextual objects must be identifiable through suitable sensory modes.

### Unity zSpace Implementation

**zSpace Context:** Objects in stereoscopic 3D space need clear identification via stylus hover, keyboard focus, and screen reader announcement.

#### 1.1 Object Identification and Semantics

```csharp
using UnityEngine;
using UnityEngine.Accessibility;
using zSpace.Core;

public class AccessibleZSpaceObject : MonoBehaviour
{
    [SerializeField] private string objectLabel = "Interactive Object";
    [SerializeField] private string objectDescription = "This object can be selected with stylus or keyboard";
    [SerializeField] private AccessibilityRole role = AccessibilityRole.Button;

    private ZCore zCore;
    private bool isHovered = false;

    private void Start()
    {
        zCore = FindObjectOfType<ZCore>();

        // Set up accessibility hierarchy for desktop screen readers
        var node = gameObject.AddComponent<AccessibilityNode>();
        node.label = objectLabel;
        node.value = objectDescription;
        node.role = role;
        node.isAccessibilityElement = true;
    }

    // Called when stylus hovers over object
    public void OnStylusHover()
    {
        if (!isHovered)
        {
            isHovered = true;
            OnAccessibilityFocus();
        }
    }

    // Called when keyboard focuses object
    public void OnKeyboardFocus()
    {
        OnAccessibilityFocus();
    }

    // Provide audio description when focused (stylus or keyboard)
    private void OnAccessibilityFocus()
    {
        // Announce to screen reader (Windows Narrator, NVDA, JAWS)
        AnnounceToScreenReader(objectDescription);

        // Play spatial audio in 3D space
        SpatialAudioManager.Instance.PlayDescription(objectDescription, transform.position);

        // Provide haptic feedback via stylus
        ProvideStylusHaptic();
    }

    private void AnnounceToScreenReader(string message)
    {
        #if UNITY_STANDALONE_WIN
        // Use Windows accessibility API
        WindowsAccessibility.Announce(message);
        #else
        Debug.Log($"Screen Reader: {message}");
        #endif
    }

    private void ProvideStylusHaptic()
    {
        if (zCore != null && zCore.IsStylusInView())
        {
            // Provide haptic feedback pattern for accessibility
            zCore.VibrateStylus(0.3f, 100); // 30% intensity, 100ms
        }
    }
}
```

#### 1.2 Control Remapping (zSpace Stylus + Keyboard/Mouse)

```csharp
using UnityEngine;
using UnityEngine.InputSystem;
using zSpace.Core;

public class ZSpaceRemappableControls : MonoBehaviour
{
    [SerializeField] private InputActionAsset inputActions;

    // zSpace-specific: Map stylus buttons to keyboard keys
    [SerializeField] private KeyCode stylusButton0Alternative = KeyCode.Space;
    [SerializeField] private KeyCode stylusButton1Alternative = KeyCode.Return;
    [SerializeField] private KeyCode stylusButton2Alternative = KeyCode.E;

    private ZCore zCore;

    private void Start()
    {
        zCore = FindObjectOfType<ZCore>();
        LoadSavedRemappings();
    }

    // Allow users to remap stylus buttons to keyboard keys
    public void RemapStylusButton(int buttonIndex, KeyCode newKey)
    {
        switch (buttonIndex)
        {
            case 0:
                stylusButton0Alternative = newKey;
                break;
            case 1:
                stylusButton1Alternative = newKey;
                break;
            case 2:
                stylusButton2Alternative = newKey;
                break;
        }

        SaveRemapping($"StylusButton{buttonIndex}", newKey);
    }

    // Check if stylus button OR keyboard alternative is pressed
    public bool IsStylusButton0Pressed()
    {
        bool stylusPressed = zCore != null && zCore.GetButtonDown(0);
        bool keyPressed = Input.GetKeyDown(stylusButton0Alternative);
        return stylusPressed || keyPressed;
    }

    private void SaveRemapping(string actionName, KeyCode newKey)
    {
        string key = $"Remap_{actionName}";
        PlayerPrefs.SetInt(key, (int)newKey);
        PlayerPrefs.Save();
    }

    private void LoadSavedRemappings()
    {
        if (PlayerPrefs.HasKey("Remap_StylusButton0"))
        {
            stylusButton0Alternative = (KeyCode)PlayerPrefs.GetInt("Remap_StylusButton0");
        }
        // Load other button mappings...
    }
}
```

#### 1.3 Object Filtering and Querying

```csharp
using UnityEngine;
using System.Collections.Generic;

public class ObjectFilter : MonoBehaviour
{
    [SerializeField] private bool showInteractiveOnly = false;
    [SerializeField] private bool showImportantOnly = false;

    public List<AccessibleObject> GetFilteredObjects()
    {
        var allObjects = FindObjectsOfType<AccessibleObject>();
        var filtered = new List<AccessibleObject>();

        foreach (var obj in allObjects)
        {
            if (showInteractiveOnly && !obj.IsInteractive) continue;
            if (showImportantOnly && !obj.IsImportant) continue;

            filtered.Add(obj);
        }

        return filtered;
    }

    // Sort by distance for gaze/voice targeting
    public List<AccessibleObject> GetObjectsSortedByDistance(Vector3 origin)
    {
        var objects = GetFilteredObjects();
        objects.Sort((a, b) =>
            Vector3.Distance(origin, a.transform.position)
            .CompareTo(Vector3.Distance(origin, b.transform.position))
        );
        return objects;
    }
}
```

**Testing Checklist:**
- [ ] All interactive objects have accessible labels
- [ ] Controls can be remapped via settings menu
- [ ] Object filtering reduces visual clutter
- [ ] Screen reader announces object labels when focused

---

## 2. Motion-Agnostic Interactions

### Requirement
Actions must be performable without specific bodily movements. All UI areas must be accessible via the same input method. Multiple simultaneous input methods should be supported.

### Unity zSpace Implementation

**zSpace Context:** Users must be able to complete all tasks using stylus, keyboard, mouse, or voice. No fine motor control should be required (stylus precision alternatives needed).

#### 2.1 Motion-Free Alternatives (zSpace Stylus + Keyboard/Mouse)

```csharp
using UnityEngine;
using zSpace.Core;

public class ZSpaceMotionAlternativeController : MonoBehaviour
{
    [SerializeField] private bool allowKeyboardAlternatives = true;
    [SerializeField] private VoiceCommandManager voiceCommands;

    private ZCore zCore;
    private GameObject selectedObject;

    private void Start()
    {
        zCore = FindObjectOfType<ZCore>();
    }

    // Example: Object selection without requiring precise stylus pointing
    public void SelectObject(GameObject target)
    {
        // Method 1: Stylus pointing (requires motor control)
        if (IsStylusPointingAt(target))
        {
            PerformStylusSelection(target);
        }
        // Method 2: Keyboard selection (no motor control required)
        else if (allowKeyboardAlternatives && Input.GetKeyDown(KeyCode.Space))
        {
            PerformKeyboardSelection(target);
        }
        // Method 3: Voice command (no motor control required)
        else if (voiceCommands != null && voiceCommands.IsVoiceCommandActive("select"))
        {
            PerformVoiceSelection(target);
        }
    }

    private bool IsStylusPointingAt(GameObject target)
    {
        if (zCore == null) return false;

        // Raycast from stylus position
        Vector3 stylusPos = zCore.GetStylusPosition();
        Vector3 stylusDir = zCore.GetStylusDirection();

        Ray ray = new Ray(stylusPos, stylusDir);
        RaycastHit hit;

        if (Physics.Raycast(ray, out hit, 10f))
        {
            return hit.collider.gameObject == target;
        }

        return false;
    }

    private void PerformStylusSelection(GameObject target)
    {
        selectedObject = target;
        target.GetComponent<Renderer>().material.color = Color.yellow;

        // Provide haptic feedback
        if (zCore != null)
        {
            zCore.VibrateStylus(0.5f, 150);
        }
    }

    private void PerformKeyboardSelection(GameObject target)
    {
        // Keyboard-based selection: Tab to cycle, Space to select
        selectedObject = target;
        target.GetComponent<Renderer>().material.color = Color.yellow;

        // Provide audio feedback (no haptic available for keyboard)
        AudioSource.PlayClipAtPoint(selectionSound, Camera.main.transform.position);

        // Announce to screen reader
        AnnounceToScreenReader($"Selected {target.name}");
    }

    private void PerformVoiceSelection(GameObject target)
    {
        selectedObject = target;
        target.GetComponent<Renderer>().material.color = Color.yellow;

        // Voice confirmation
        TextToSpeech.Speak($"Selected {target.name}");
    }
}
```

#### 2.2 Unified Input System

```csharp
using UnityEngine;
using UnityEngine.InputSystem;

public class UnifiedInputManager : MonoBehaviour
{
    public enum InputMode { Controller, Gaze, Voice, Keyboard, SingleButton }

    [SerializeField] private InputMode currentMode = InputMode.Controller;

    // All inputs route through this unified system
    public void PerformPrimaryAction()
    {
        switch (currentMode)
        {
            case InputMode.Controller:
                HandleControllerAction();
                break;
            case InputMode.Gaze:
                HandleGazeAction();
                break;
            case InputMode.Voice:
                HandleVoiceAction();
                break;
            case InputMode.Keyboard:
                HandleKeyboardAction();
                break;
            case InputMode.SingleButton:
                HandleSingleButtonAction();
                break;
        }
    }

    private void HandleGazeAction()
    {
        // Raycast from camera/gaze point
        Ray gazeRay = new Ray(Camera.main.transform.position, Camera.main.transform.forward);
        if (Physics.Raycast(gazeRay, out RaycastHit hit, 10f))
        {
            var interactable = hit.collider.GetComponent<IInteractable>();
            interactable?.Interact();
        }
    }
}
```

#### 2.3 Locomotion Without Motion

```csharp
using UnityEngine;
using UnityEngine.XR.Interaction.Toolkit;

public class AccessibleLocomotion : MonoBehaviour
{
    public enum LocomotionMode
    {
        Teleport,           // Point and click to move
        NodeBased,          // Move between predefined points
        AutoPilot,          // Automatic movement with waypoints
        GazeTeleport        // Look and dwell to teleport
    }

    [SerializeField] private LocomotionMode mode = LocomotionMode.Teleport;
    [SerializeField] private float gazeDwellTime = 2f;

    public void MoveTo(Vector3 destination)
    {
        switch (mode)
        {
            case LocomotionMode.Teleport:
                TeleportPlayer(destination);
                break;
            case LocomotionMode.NodeBased:
                MoveToNearestNode(destination);
                break;
            case LocomotionMode.AutoPilot:
                StartAutoPilot(destination);
                break;
            case LocomotionMode.GazeTeleport:
                StartGazeTeleport(destination);
                break;
        }
    }

    private void TeleportPlayer(Vector3 destination)
    {
        transform.position = destination;
        // Add vignette/fade for comfort
        ComfortSettingsManager.Instance.ApplyTeleportVignette();
    }
}
```

**zSpace Testing Checklist:**
- [ ] All stylus interactions have keyboard/mouse alternatives
- [ ] Keyboard-only input can complete all core tasks (Tab, Space, Enter, Arrows)
- [ ] Mouse-only input can complete all core tasks
- [ ] Voice-only input can complete all core tasks
- [ ] No actions require precise stylus positioning (enlargedhit targets or keyboard alternatives)
- [ ] Desktop screen readers (NVDA, Narrator, JAWS) can navigate all UI

---

## 3. Immersive Personalization

### Requirement
Symbol sets should overlay objects to convey affordances per user preference. Non-critical environmental content (animations, audio) should be muteable.

### Unity Implementation

#### 3.1 Symbol Overlay System

```csharp
using UnityEngine;
using TMPro;

public class SymbolOverlayManager : MonoBehaviour
{
    [SerializeField] private GameObject symbolPrefab;
    [SerializeField] private bool showSymbols = false;

    private Dictionary<GameObject, GameObject> symbolOverlays = new Dictionary<GameObject, GameObject>();

    public void SetSymbolPreference(SymbolSet symbolSet)
    {
        PlayerPrefs.SetInt("SymbolSet", (int)symbolSet);
        RefreshSymbols();
    }

    public void AddSymbolToObject(GameObject obj, string symbolType)
    {
        if (!showSymbols) return;

        var overlay = Instantiate(symbolPrefab, obj.transform);
        overlay.transform.localPosition = Vector3.up * 0.5f; // Above object

        var textMesh = overlay.GetComponentInChildren<TextMeshPro>();
        textMesh.text = GetSymbolForType(symbolType);

        symbolOverlays[obj] = overlay;
    }

    private string GetSymbolForType(string type)
    {
        // Return appropriate symbol based on user preference
        return type switch
        {
            "grab" => "✋",
            "button" => "▶",
            "door" => "🚪",
            "important" => "⚠️",
            _ => "?"
        };
    }
}
```

#### 3.2 Environmental Content Control

```csharp
using UnityEngine;

public class EnvironmentalContentManager : MonoBehaviour
{
    [SerializeField] private bool muteBackgroundAudio = false;
    [SerializeField] private bool reduceAnimations = false;
    [SerializeField] private bool hideDecorative = false;

    private void ApplySettings()
    {
        // Mute non-essential audio
        if (muteBackgroundAudio)
        {
            var ambientSources = GameObject.FindGameObjectsWithTag("AmbientAudio");
            foreach (var source in ambientSources)
            {
                source.GetComponent<AudioSource>().mute = true;
            }
        }

        // Reduce or disable decorative animations
        if (reduceAnimations)
        {
            var animators = FindObjectsOfType<Animator>();
            foreach (var animator in animators)
            {
                if (animator.CompareTag("Decorative"))
                {
                    animator.speed = 0.1f; // Slow down significantly
                }
            }
        }

        // Hide purely decorative objects
        if (hideDecorative)
        {
            var decorative = GameObject.FindGameObjectsWithTag("Decorative");
            foreach (var obj in decorative)
            {
                obj.SetActive(false);
            }
        }
    }
}
```

**Testing Checklist:**
- [ ] Symbol overlays can be enabled/disabled
- [ ] Background audio can be muted independently
- [ ] Decorative animations can be reduced/disabled
- [ ] Settings persist between sessions

---

## 4. Interaction and Target Customization

### Requirement
Fine motor control must not be required for activation. Hit targets need adequate sizing and spacing. Multiple simultaneous gestures should not be mandatory. Sequential button pressing (sticky keys) should be supported.

### Unity Implementation

#### 4.1 Hit Target Sizing

```csharp
using UnityEngine;

[RequireComponent(typeof(BoxCollider))]
public class AccessibleButton : MonoBehaviour
{
    // Minimum target size: 44px visual angle (≈ 1.5-2cm at arm's length in VR)
    private const float MIN_TARGET_SIZE = 0.02f; // 2cm minimum

    [SerializeField] private float targetSize = 0.03f; // 3cm default
    [SerializeField] private bool autoAdjustCollider = true;

    private void OnValidate()
    {
        if (targetSize < MIN_TARGET_SIZE)
        {
            Debug.LogWarning($"Target size {targetSize}m is below minimum {MIN_TARGET_SIZE}m");
            targetSize = MIN_TARGET_SIZE;
        }

        if (autoAdjustCollider)
        {
            AdjustCollider();
        }
    }

    private void AdjustCollider()
    {
        var collider = GetComponent<BoxCollider>();
        collider.size = new Vector3(targetSize, targetSize, targetSize);
    }

    // Enlarge hit area without changing visual size
    public void EnlargeHitArea(float multiplier = 1.5f)
    {
        var collider = GetComponent<BoxCollider>();
        collider.size = collider.size * multiplier;
    }
}
```

#### 4.2 Dwell-Based Activation (No Fine Motor Control Required)

```csharp
using UnityEngine;
using UnityEngine.Events;

public class DwellActivator : MonoBehaviour
{
    [SerializeField] private float dwellTime = 1.5f;
    [SerializeField] private UnityEvent onActivate;
    [SerializeField] private GameObject dwellProgressUI;

    private float currentDwellTime = 0f;
    private bool isDwelling = false;

    public void StartDwell()
    {
        isDwelling = true;
        currentDwellTime = 0f;
        dwellProgressUI.SetActive(true);
    }

    public void StopDwell()
    {
        isDwelling = false;
        currentDwellTime = 0f;
        dwellProgressUI.SetActive(false);
    }

    private void Update()
    {
        if (isDwelling)
        {
            currentDwellTime += Time.deltaTime;
            UpdateProgressUI(currentDwellTime / dwellTime);

            if (currentDwellTime >= dwellTime)
            {
                onActivate?.Invoke();
                StopDwell();
            }
        }
    }

    private void UpdateProgressUI(float progress)
    {
        // Update radial progress indicator
        var fillImage = dwellProgressUI.GetComponent<UnityEngine.UI.Image>();
        if (fillImage != null)
        {
            fillImage.fillAmount = progress;
        }
    }
}
```

#### 4.3 Sticky Keys/Sequential Input

```csharp
using UnityEngine;
using UnityEngine.InputSystem;

public class StickyKeysManager : MonoBehaviour
{
    [SerializeField] private bool stickyKeysEnabled = false;
    [SerializeField] private float resetTime = 3f;

    private HashSet<Key> stickyKeys = new HashSet<Key>();
    private Dictionary<Key, float> keyTimers = new Dictionary<Key, float>();

    public void ToggleStickyKey(Key key)
    {
        if (!stickyKeysEnabled) return;

        if (stickyKeys.Contains(key))
        {
            stickyKeys.Remove(key);
        }
        else
        {
            stickyKeys.Add(key);
            keyTimers[key] = resetTime;
        }
    }

    public bool IsKeyStickyPressed(Key key)
    {
        return stickyKeys.Contains(key);
    }

    private void Update()
    {
        if (!stickyKeysEnabled) return;

        // Auto-release sticky keys after timeout
        var keysToRemove = new List<Key>();
        foreach (var kvp in keyTimers)
        {
            keyTimers[kvp.Key] -= Time.deltaTime;
            if (keyTimers[kvp.Key] <= 0)
            {
                keysToRemove.Add(kvp.Key);
            }
        }

        foreach (var key in keysToRemove)
        {
            stickyKeys.Remove(key);
            keyTimers.Remove(key);
        }
    }
}
```

**Testing Checklist:**
- [ ] All interactive targets are ≥ 2cm (44px visual angle)
- [ ] Targets can be activated by dwelling (no button press required)
- [ ] No multi-button combinations are required
- [ ] Sticky keys allow sequential input instead of simultaneous
- [ ] Hit areas are adequately spaced (no accidental activation)

---

## 5. Voice Commands

### Requirement
Navigation and interaction must be controllable via voice activation. Native screen readers or voice assistants preferred over external paired devices.

### Unity Implementation

#### 5.1 Voice Command System

```csharp
using UnityEngine;
using UnityEngine.Windows.Speech;
using System.Linq;

public class VoiceCommandManager : MonoBehaviour
{
    private KeywordRecognizer keywordRecognizer;
    private Dictionary<string, System.Action> commands = new Dictionary<string, System.Action>();

    [SerializeField] private bool voiceEnabled = true;
    [SerializeField] private AudioClip confirmationSound;

    private void Start()
    {
        InitializeCommands();
        SetupRecognizer();
    }

    private void InitializeCommands()
    {
        // Navigation commands
        commands.Add("go forward", () => Move(Vector3.forward));
        commands.Add("go back", () => Move(Vector3.back));
        commands.Add("turn left", () => Rotate(-45f));
        commands.Add("turn right", () => Rotate(45f));

        // Interaction commands
        commands.Add("select", () => SelectFocusedObject());
        commands.Add("grab", () => GrabFocusedObject());
        commands.Add("open menu", () => OpenMenu());
        commands.Add("close menu", () => CloseMenu());

        // System commands
        commands.Add("help", () => ShowHelp());
        commands.Add("repeat", () => RepeatLastInstruction());
    }

    private void SetupRecognizer()
    {
        if (!voiceEnabled) return;

        keywordRecognizer = new KeywordRecognizer(commands.Keys.ToArray());
        keywordRecognizer.OnPhraseRecognized += OnPhraseRecognized;
        keywordRecognizer.Start();
    }

    private void OnPhraseRecognized(PhraseRecognizedEventArgs args)
    {
        if (commands.ContainsKey(args.text))
        {
            commands[args.text].Invoke();
            PlayConfirmation();
            SpeakFeedback($"Executing {args.text}");
        }
    }

    private void SpeakFeedback(string message)
    {
        // Use Unity's TextToSpeech or platform-specific TTS
        #if UNITY_ANDROID
        AndroidTextToSpeech.Speak(message);
        #elif UNITY_IOS
        iOSTextToSpeech.Speak(message);
        #else
        Debug.Log($"TTS: {message}");
        #endif
    }
}
```

#### 5.2 Voice Navigation

```csharp
using UnityEngine;

public class VoiceNavigationManager : MonoBehaviour
{
    [SerializeField] private float moveSpeed = 2f;
    [SerializeField] private Transform playerTransform;

    public void Move(Vector3 direction)
    {
        Vector3 worldDirection = playerTransform.TransformDirection(direction);
        playerTransform.position += worldDirection * moveSpeed * Time.deltaTime;
    }

    public void Rotate(float angle)
    {
        playerTransform.Rotate(0, angle, 0);
    }

    public void TeleportToNamed(string locationName)
    {
        var waypoint = GameObject.Find(locationName);
        if (waypoint != null)
        {
            playerTransform.position = waypoint.transform.position;
            SpeakFeedback($"Teleported to {locationName}");
        }
        else
        {
            SpeakFeedback($"Location {locationName} not found");
        }
    }
}
```

**Testing Checklist:**
- [ ] All core interactions have voice command alternatives
- [ ] Voice commands work in noisy environments
- [ ] Confirmation feedback provided for each command
- [ ] Help command lists all available voice commands
- [ ] Voice commands work without internet (offline recognition)

---

## 6. Color and Contrast Customization

### Requirement
High-contrast environment skins should accommodate color blindness and luminosity needs.

### Unity Implementation

#### 6.1 Contrast and Color Mode Manager

```csharp
using UnityEngine;
using UnityEngine.Rendering;
using UnityEngine.Rendering.Universal;

public class ContrastManager : MonoBehaviour
{
    public enum ColorBlindMode { None, Protanopia, Deuteranopia, Tritanopia }

    [SerializeField] private Volume postProcessVolume;
    [SerializeField] private ColorBlindMode colorBlindMode = ColorBlindMode.None;
    [SerializeField] private bool highContrast = false;

    private ColorAdjustments colorAdjustments;

    public void SetHighContrast(bool enabled)
    {
        highContrast = enabled;
        ApplyContrastSettings();
    }

    public void SetColorBlindMode(ColorBlindMode mode)
    {
        colorBlindMode = mode;
        ApplyColorBlindFilter();
    }

    private void ApplyContrastSettings()
    {
        if (postProcessVolume.profile.TryGet(out colorAdjustments))
        {
            colorAdjustments.contrast.value = highContrast ? 50f : 0f;
        }
    }

    private void ApplyColorBlindFilter()
    {
        // Apply color blind filter shader
        switch (colorBlindMode)
        {
            case ColorBlindMode.Protanopia:
                ApplyShaderFilter("ColorBlind/Protanopia");
                break;
            case ColorBlindMode.Deuteranopia:
                ApplyShaderFilter("ColorBlind/Deuteranopia");
                break;
            case ColorBlindMode.Tritanopia:
                ApplyShaderFilter("ColorBlind/Tritanopia");
                break;
            default:
                RemoveShaderFilter();
                break;
        }
    }
}
```

#### 6.2 UI Contrast Validation

```csharp
using UnityEngine;
using TMPro;

public class UIContrastValidator : MonoBehaviour
{
    private const float MIN_CONTRAST_RATIO = 4.5f; // WCAG Level AA

    public bool ValidateTextContrast(Color textColor, Color backgroundColor)
    {
        float contrastRatio = CalculateContrastRatio(textColor, backgroundColor);

        if (contrastRatio < MIN_CONTRAST_RATIO)
        {
            Debug.LogWarning($"Contrast ratio {contrastRatio:F2}:1 is below minimum {MIN_CONTRAST_RATIO}:1");
            return false;
        }

        return true;
    }

    private float CalculateContrastRatio(Color c1, Color c2)
    {
        float l1 = CalculateRelativeLuminance(c1);
        float l2 = CalculateRelativeLuminance(c2);

        float lighter = Mathf.Max(l1, l2);
        float darker = Mathf.Min(l1, l2);

        return (lighter + 0.05f) / (darker + 0.05f);
    }

    private float CalculateRelativeLuminance(Color color)
    {
        float r = color.r <= 0.03928f ? color.r / 12.92f : Mathf.Pow((color.r + 0.055f) / 1.055f, 2.4f);
        float g = color.g <= 0.03928f ? color.g / 12.92f : Mathf.Pow((color.g + 0.055f) / 1.055f, 2.4f);
        float b = color.b <= 0.03928f ? color.b / 12.92f : Mathf.Pow((color.b + 0.055f) / 1.055f, 2.4f);

        return 0.2126f * r + 0.7152f * g + 0.0722f * b;
    }
}
```

**Testing Checklist:**
- [ ] UI text contrast ≥ 4.5:1 in all lighting conditions
- [ ] High contrast mode available
- [ ] Color blind modes simulate Protanopia, Deuteranopia, Tritanopia
- [ ] Important information not conveyed by color alone

---

## 7. Magnification Support

### Requirement
Users must check view context and reset focus as needed. Interface elements should enlarge and reflow appropriately in menus.

### Unity Implementation

#### 7.1 UI Magnification

```csharp
using UnityEngine;
using UnityEngine.UI;

public class UIMagnifier : MonoBehaviour
{
    [SerializeField] [Range(1f, 3f)] private float magnification = 1f;
    [SerializeField] private Canvas uiCanvas;

    public void SetMagnification(float scale)
    {
        magnification = Mathf.Clamp(scale, 1f, 3f);
        ApplyMagnification();
    }

    private void ApplyMagnification()
    {
        uiCanvas.scaleFactor = magnification;
        ReflowContent();
    }

    private void ReflowContent()
    {
        // Reflow content to prevent overflow
        var layoutGroups = uiCanvas.GetComponentsInChildren<LayoutGroup>();
        foreach (var layout in layoutGroups)
        {
            LayoutRebuilder.ForceRebuildLayoutImmediate(layout.GetComponent<RectTransform>());
        }
    }
}
```

#### 7.2 World Space Magnification

```csharp
using UnityEngine;

public class WorldMagnifier : MonoBehaviour
{
    [SerializeField] private Camera magnifierCamera;
    [SerializeField] private RenderTexture magnifierRenderTexture;
    [SerializeField] private float magnificationFactor = 2f;

    public void EnableMagnifier(bool enabled)
    {
        magnifierCamera.enabled = enabled;
    }

    public void SetMagnificationFactor(float factor)
    {
        magnificationFactor = Mathf.Clamp(factor, 1f, 5f);
        magnifierCamera.fieldOfView = Camera.main.fieldOfView / magnificationFactor;
    }
}
```

**Testing Checklist:**
- [ ] UI can be magnified up to 200%
- [ ] Magnified UI reflows without horizontal scrolling
- [ ] World space magnifier available for viewing distant objects
- [ ] Magnification settings persist

---

## 8. Critical Messaging and Alerts

### Requirement
Alerts require priority roles flagged to assistive technology without focus movement.

### Unity Implementation

#### 8.1 Accessible Alert System

```csharp
using UnityEngine;
using UnityEngine.Accessibility;
using TMPro;

public class AccessibleAlertManager : MonoBehaviour
{
    public enum AlertPriority { Low, Medium, High, Critical }

    [SerializeField] private GameObject alertPrefab;
    [SerializeField] private Transform alertContainer;

    public void ShowAlert(string message, AlertPriority priority)
    {
        var alert = Instantiate(alertPrefab, alertContainer);
        var textMesh = alert.GetComponentInChildren<TextMeshProUGUI>();
        textMesh.text = message;

        // Set accessibility properties
        var node = alert.AddComponent<AccessibilityNode>();
        node.label = message;
        node.role = AccessibilityRole.Alert;
        node.isAccessibilityElement = true;

        // Announce to screen reader WITHOUT moving focus
        AnnounceToScreenReader(message, priority);

        // Visual/audio feedback based on priority
        ApplyPriorityFeedback(alert, priority);
    }

    private void AnnounceToScreenReader(string message, AlertPriority priority)
    {
        #if UNITY_ANDROID
        AndroidAccessibility.Announce(message, priority == AlertPriority.Critical);
        #elif UNITY_IOS
        iOSAccessibility.PostNotification(UIAccessibilityNotification.Announcement, message);
        #else
        Debug.Log($"[Alert {priority}]: {message}");
        #endif
    }

    private void ApplyPriorityFeedback(GameObject alert, AlertPriority priority)
    {
        switch (priority)
        {
            case AlertPriority.Critical:
                // Red background, loud sound, haptic
                alert.GetComponent<Image>().color = Color.red;
                PlayAlertSound(AlertSoundType.Critical);
                TriggerHapticFeedback(HapticIntensity.Strong);
                break;
            case AlertPriority.High:
                alert.GetComponent<Image>().color = new Color(1f, 0.5f, 0f);
                PlayAlertSound(AlertSoundType.Warning);
                break;
            case AlertPriority.Medium:
                alert.GetComponent<Image>().color = Color.yellow;
                PlayAlertSound(AlertSoundType.Info);
                break;
            case AlertPriority.Low:
                alert.GetComponent<Image>().color = Color.white;
                break;
        }
    }
}
```

**Testing Checklist:**
- [ ] Alerts announced to screen reader without focus change
- [ ] Critical alerts have distinct visual/audio/haptic feedback
- [ ] Alerts remain visible until dismissed
- [ ] Alert priority correctly conveyed to assistive technology

---

## 9. Gestural Interfaces

### Requirement
Touch accessibility gestures (swipes, flicks, multi-finger taps) must be supported. Virtual menu systems need self-voicing with item descriptions on focus. Gesture remapping should allow custom macro associations.

### Unity Implementation

#### 9.1 Accessible Gesture System

```csharp
using UnityEngine;
using UnityEngine.InputSystem;
using UnityEngine.InputSystem.EnhancedTouch;

public class AccessibleGestureManager : MonoBehaviour
{
    [SerializeField] private bool requireGestures = true;
    [SerializeField] private float gestureTimeout = 0.5f;

    private void Start()
    {
        EnhancedTouchSupport.Enable();
    }

    // Provide button alternative to gestures
    public void SwipeLeftAlternative()
    {
        if (!requireGestures)
        {
            ExecuteSwipeLeft();
        }
    }

    public void SwipeRightAlternative()
    {
        if (!requireGestures)
        {
            ExecuteSwipeRight();
        }
    }

    // Traditional gesture detection
    private void Update()
    {
        if (requireGestures)
        {
            DetectGestures();
        }
    }

    private void DetectGestures()
    {
        if (Touch.activeTouches.Count > 0)
        {
            var touch = Touch.activeTouches[0];

            if (touch.phase == UnityEngine.InputSystem.TouchPhase.Ended)
            {
                Vector2 delta = touch.delta;

                if (Mathf.Abs(delta.x) > Mathf.Abs(delta.y))
                {
                    if (delta.x > 0)
                        ExecuteSwipeRight();
                    else
                        ExecuteSwipeLeft();
                }
            }
        }
    }
}
```

#### 9.2 Self-Voicing Menu System

```csharp
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.EventSystems;
using TMPro;

public class SelfVoicingMenu : MonoBehaviour
{
    [SerializeField] private Button[] menuButtons;
    private int currentIndex = 0;

    private void Start()
    {
        // Add hover listeners to all buttons
        foreach (var button in menuButtons)
        {
            var trigger = button.gameObject.AddComponent<EventTrigger>();

            var entry = new EventTrigger.Entry();
            entry.eventID = EventTriggerType.PointerEnter;
            entry.callback.AddListener((data) => OnButtonFocus(button));
            trigger.triggers.Add(entry);
        }

        // Initial focus
        if (menuButtons.Length > 0)
        {
            FocusButton(0);
        }
    }

    private void OnButtonFocus(Button button)
    {
        string buttonText = button.GetComponentInChildren<TextMeshProUGUI>().text;
        string description = button.GetComponent<AccessibleButton>().objectDescription;

        // Self-voice: speak button text and description
        SpeakFeedback($"{buttonText}. {description}");
    }

    public void NavigateMenu(int direction)
    {
        currentIndex = Mathf.Clamp(currentIndex + direction, 0, menuButtons.Length - 1);
        FocusButton(currentIndex);
    }

    private void FocusButton(int index)
    {
        menuButtons[index].Select();
        OnButtonFocus(menuButtons[index]);
    }
}
```

**Testing Checklist:**
- [ ] All gestures have button/voice alternatives
- [ ] Menu items self-voice on focus
- [ ] No multi-finger gestures required
- [ ] Gesture remapping available in settings

---

## 10. Text Transformation and Captions

### Requirement
Text descriptions should be presentable via pre-recorded signing avatars. Signing videos should be 1/3rd minimum of the original stream's signing size.

### Unity Implementation

#### 10.1 Subtitle/Caption System

```csharp
using UnityEngine;
using TMPro;

public class SubtitleSystem : MonoBehaviour
{
    [SerializeField] private TextMeshProUGUI subtitleText;
    [SerializeField] private RectTransform subtitlePanel;
    [SerializeField] private bool subtitlesEnabled = true;
    [SerializeField] [Range(0.5f, 2f)] private float textSize = 1f;

    private Queue<SubtitleEntry> subtitleQueue = new Queue<SubtitleEntry>();

    [System.Serializable]
    public struct SubtitleEntry
    {
        public string text;
        public float duration;
        public string speaker;
    }

    public void ShowSubtitle(string text, float duration, string speaker = "")
    {
        if (!subtitlesEnabled) return;

        var entry = new SubtitleEntry
        {
            text = text,
            duration = duration,
            speaker = speaker
        };

        subtitleQueue.Enqueue(entry);

        if (subtitleQueue.Count == 1)
        {
            DisplayNextSubtitle();
        }
    }

    private void DisplayNextSubtitle()
    {
        if (subtitleQueue.Count == 0)
        {
            subtitlePanel.gameObject.SetActive(false);
            return;
        }

        var entry = subtitleQueue.Peek();

        string displayText = string.IsNullOrEmpty(entry.speaker)
            ? entry.text
            : $"[{entry.speaker}]: {entry.text}";

        subtitleText.text = displayText;
        subtitleText.fontSize = 24 * textSize;
        subtitlePanel.gameObject.SetActive(true);

        Invoke(nameof(OnSubtitleComplete), entry.duration);
    }

    private void OnSubtitleComplete()
    {
        subtitleQueue.Dequeue();
        DisplayNextSubtitle();
    }

    public void SetSubtitleSize(float size)
    {
        textSize = Mathf.Clamp(size, 0.5f, 2f);
        PlayerPrefs.SetFloat("SubtitleSize", textSize);
    }
}
```

#### 10.2 Sign Language Avatar (Placeholder)

```csharp
using UnityEngine;
using UnityEngine.Video;

public class SignLanguageAvatarManager : MonoBehaviour
{
    [SerializeField] private VideoPlayer videoPlayer;
    [SerializeField] private RectTransform avatarContainer;
    [SerializeField] private bool signLanguageEnabled = false;

    public void PlaySignLanguageVideo(string videoPath)
    {
        if (!signLanguageEnabled) return;

        videoPlayer.url = videoPath;
        videoPlayer.Play();

        // Ensure size is at least 1/3 of screen
        float minSize = Screen.height / 3f;
        avatarContainer.sizeDelta = new Vector2(minSize, minSize);
    }

    public void SetSignLanguagePosition(SignLanguagePosition position)
    {
        switch (position)
        {
            case SignLanguagePosition.BottomRight:
                avatarContainer.anchorMin = new Vector2(1, 0);
                avatarContainer.anchorMax = new Vector2(1, 0);
                avatarContainer.pivot = new Vector2(1, 0);
                break;
            case SignLanguagePosition.BottomLeft:
                avatarContainer.anchorMin = new Vector2(0, 0);
                avatarContainer.anchorMax = new Vector2(0, 0);
                avatarContainer.pivot = new Vector2(0, 0);
                break;
        }
    }
}

public enum SignLanguagePosition { BottomRight, BottomLeft, TopRight, TopLeft }
```

**Testing Checklist:**
- [ ] Subtitles/captions available for all audio
- [ ] Subtitle size adjustable
- [ ] Speaker identification in subtitles
- [ ] Sign language videos ≥ 1/3 screen size
- [ ] Sign language video position customizable

---

## Summary: W3C XAUR Compliance Checklist (zSpace-Adapted)

### Core Requirements for zSpace Applications

- [ ] **Semantics & Customization**
  - [ ] All 3D objects have accessible labels for desktop screen readers
  - [ ] Stylus buttons remappable to keyboard keys
  - [ ] Object filtering available to reduce visual complexity

- [ ] **Motion-Agnostic (zSpace-Specific)**
  - [ ] Keyboard-only input supported (Tab, Space, Enter, Arrows)
  - [ ] Mouse-only input supported
  - [ ] Voice-only input supported
  - [ ] All stylus interactions have keyboard/mouse alternatives
  - [ ] No precise stylus positioning required (enlarged hit targets or alternatives)

- [ ] **Personalization**
  - [ ] Symbol overlays available for 3D objects
  - [ ] Background audio muteable independently
  - [ ] Decorative content hideable

- [ ] **Target Customization (Desktop Standards)**
  - [ ] Hit targets ≥ 24x24px (desktop standard, not VR)
  - [ ] Dwell activation available for stylus/mouse
  - [ ] Sticky keys supported for keyboard users

- [ ] **Voice Commands**
  - [ ] Core tasks voice-controllable
  - [ ] Windows voice recognition integrated
  - [ ] Voice feedback provided (TTS)

- [ ] **Color & Contrast (Desktop Display)**
  - [ ] High contrast mode available
  - [ ] Color blind modes (Protanopia, Deuteranopia, Tritanopia)
  - [ ] UI contrast ≥ 4.5:1 on zSpace display

- [ ] **Magnification**
  - [ ] UI magnification up to 200%
  - [ ] 3D content magnification available
  - [ ] Content reflows without horizontal scrolling

- [ ] **Alerts (Desktop Screen Reader Compatible)**
  - [ ] Critical alerts announced to Windows Narrator/NVDA/JAWS
  - [ ] No focus movement on alert
  - [ ] Multi-modal feedback (audio, visual, haptic via stylus)

- [ ] **Depth Perception Alternatives**
  - [ ] Application functions without stereoscopic 3D enabled
  - [ ] Depth cues provided (size, shadows, audio, haptics)
  - [ ] 2D UI overlays for critical information

- [ ] **Text & Captions**
  - [ ] Subtitles for all spatial audio
  - [ ] Adjustable subtitle size
  - [ ] Speaker identification in 3D space

---

## Additional Resources

- **W3C XAUR:** https://www.w3.org/TR/xaur/
- **W3C WCAG 2.2:** https://www.w3.org/WAI/WCAG22/quickref/
- **zSpace Developer Portal:** https://developer.zspace.com/
- **Unity Accessibility:** https://docs.unity3d.com/Manual/com.unity.modules.accessibility.html
- **Desktop Accessibility:** https://webaim.org/articles/nvda/

---

**Document Version:** 2.0 (zSpace-adapted)
**Last Updated:** October 2025
**Platform:** zSpace (stereoscopic 3D desktop)
**Maintainer:** accessibility-standards-unity project
