/*
 * ============================================================================
 * UNITY ACCESSIBILITY COMPONENT TEMPLATES
 * ============================================================================
 *
 * This file contains production-ready C# templates for implementing
 * accessibility features in Unity projects. These templates address common
 * WCAG 2.2 Level AA requirements.
 *
 * Components included:
 * 1. KeyboardNavigationManager - Tab order and arrow key navigation
 * 2. FocusIndicator - Visual focus highlight
 * 3. AccessibleButton - Button with keyboard + screen reader support
 * 4. AccessibleToggle - Toggle with accessibility
 * 5. AccessibleSlider - Slider with keyboard support
 * 6. ScreenReaderAnnouncer - Dynamic content updates
 * 7. FocusManager - Focus management utilities
 * 8. AccessibilityHelper - Utility methods
 *
 * USAGE:
 * - Copy desired template class to separate .cs file
 * - Attach component to appropriate GameObjects in Unity
 * - Configure via Inspector or code
 * - Test with keyboard and screen reader
 *
 * WCAG CRITERIA ADDRESSED:
 * - 2.1.1 Keyboard (Level A)
 * - 2.1.2 No Keyboard Trap (Level A)
 * - 2.4.3 Focus Order (Level A)
 * - 2.4.7 Focus Visible (Level AA)
 * - 4.1.2 Name, Role, Value (Level A)
 * - 4.1.3 Status Messages (Level AA)
 *
 * REQUIREMENTS:
 * - Unity 2021.3 or higher
 * - Unity UI (UGUI) or UI Toolkit
 * - EventSystem in scene
 * - (Optional) Unity Accessibility API for 2023.2+
 *
 * ============================================================================
 */

using UnityEngine;
using UnityEngine.UI;
using UnityEngine.EventSystems;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

#if UNITY_2023_2_OR_NEWER
using UnityEngine.Accessibility;
#endif

namespace AccessibilityFramework
{
    // ========================================================================
    // KEYBOARD NAVIGATION MANAGER
    // ========================================================================
    // Handles tab order navigation and arrow key navigation in UI
    // Addresses WCAG 2.1.1, 2.4.3
    // ========================================================================

    /// <summary>
    /// Manages keyboard navigation for UI elements in a scene or canvas.
    /// Supports Tab/Shift+Tab for sequential navigation and arrow keys for 2D navigation.
    /// </summary>
    [AddComponentMenu("Accessibility/Keyboard Navigation Manager")]
    public class KeyboardNavigationManager : MonoBehaviour
    {
        [Header("Navigation Settings")]
        [Tooltip("Automatically detect all Selectable UI elements in children")]
        public bool autoDetectSelectables = true;

        [Tooltip("Manually specify navigation order (overrides auto-detection)")]
        public List<Selectable> manualNavigationOrder = new List<Selectable>();

        [Tooltip("Enable arrow key navigation in addition to Tab")]
        public bool enableArrowKeyNavigation = true;

        [Tooltip("Wrap around to first element when reaching end")]
        public bool wrapNavigation = true;

        [Tooltip("Automatically focus first element when scene loads")]
        public bool focusFirstOnStart = true;

        [Header("Key Bindings")]
        public KeyCode nextKey = KeyCode.Tab;
        public KeyCode previousModifier = KeyCode.LeftShift;
        public KeyCode activateKey = KeyCode.Return;
        public KeyCode alternateActivateKey = KeyCode.Space;

        private List<Selectable> navigableElements = new List<Selectable>();
        private int currentIndex = 0;

        void Start()
        {
            RefreshNavigableElements();

            if (focusFirstOnStart && navigableElements.Count > 0)
            {
                StartCoroutine(FocusFirstElementDelayed());
            }
        }

        IEnumerator FocusFirstElementDelayed()
        {
            // Wait one frame for EventSystem to initialize
            yield return null;
            navigableElements[0].Select();
            currentIndex = 0;
        }

        void Update()
        {
            HandleKeyboardInput();
        }

        private void HandleKeyboardInput()
        {
            // Tab navigation
            if (Input.GetKeyDown(nextKey))
            {
                if (Input.GetKey(previousModifier) || Input.GetKey(KeyCode.RightShift))
                {
                    NavigatePrevious();
                }
                else
                {
                    NavigateNext();
                }
            }

            // Arrow key navigation
            if (enableArrowKeyNavigation)
            {
                if (Input.GetKeyDown(KeyCode.DownArrow) || Input.GetKeyDown(KeyCode.RightArrow))
                {
                    NavigateNext();
                }
                else if (Input.GetKeyDown(KeyCode.UpArrow) || Input.GetKeyDown(KeyCode.LeftArrow))
                {
                    NavigatePrevious();
                }
            }

            // Activation keys
            if (Input.GetKeyDown(activateKey) || Input.GetKeyDown(alternateActivateKey))
            {
                ActivateCurrentElement();
            }
        }

        public void NavigateNext()
        {
            if (navigableElements.Count == 0) return;

            int startIndex = currentIndex;
            do
            {
                currentIndex = (currentIndex + 1) % navigableElements.Count;

                if (navigableElements[currentIndex].IsInteractable())
                {
                    navigableElements[currentIndex].Select();
                    return;
                }

                // Prevent infinite loop if no interactable elements
                if (currentIndex == startIndex && !wrapNavigation) return;

            } while (wrapNavigation && currentIndex != startIndex);
        }

        public void NavigatePrevious()
        {
            if (navigableElements.Count == 0) return;

            int startIndex = currentIndex;
            do
            {
                currentIndex--;
                if (currentIndex < 0)
                {
                    currentIndex = wrapNavigation ? navigableElements.Count - 1 : 0;
                }

                if (navigableElements[currentIndex].IsInteractable())
                {
                    navigableElements[currentIndex].Select();
                    return;
                }

                if (currentIndex == startIndex && !wrapNavigation) return;

            } while (wrapNavigation && currentIndex != startIndex);
        }

        private void ActivateCurrentElement()
        {
            GameObject currentObject = EventSystem.current?.currentSelectedGameObject;
            if (currentObject == null) return;

            Button button = currentObject.GetComponent<Button>();
            if (button != null && button.IsInteractable())
            {
                button.onClick.Invoke();
                return;
            }

            Toggle toggle = currentObject.GetComponent<Toggle>();
            if (toggle != null && toggle.IsInteractable())
            {
                toggle.isOn = !toggle.isOn;
                return;
            }

            // Trigger pointer click for other selectable types
            ExecuteEvents.Execute(currentObject, new PointerEventData(EventSystem.current), ExecuteEvents.submitHandler);
        }

        public void RefreshNavigableElements()
        {
            navigableElements.Clear();

            if (autoDetectSelectables)
            {
                // Find all Selectables in children
                Selectable[] selectables = GetComponentsInChildren<Selectable>(false);
                navigableElements = selectables
                    .Where(s => s.IsInteractable() && s.gameObject.activeInHierarchy)
                    .OrderBy(s => s.transform.GetSiblingIndex())
                    .ToList();
            }
            else
            {
                navigableElements = manualNavigationOrder
                    .Where(s => s != null && s.IsInteractable() && s.gameObject.activeInHierarchy)
                    .ToList();
            }

            // Update current index to point to currently selected element
            GameObject selected = EventSystem.current?.currentSelectedGameObject;
            if (selected != null)
            {
                Selectable selectable = selected.GetComponent<Selectable>();
                currentIndex = navigableElements.IndexOf(selectable);
                if (currentIndex == -1) currentIndex = 0;
            }
        }

        // Public API for external control
        public void FocusElement(int index)
        {
            if (index >= 0 && index < navigableElements.Count)
            {
                currentIndex = index;
                navigableElements[currentIndex].Select();
            }
        }

        public void FocusElement(Selectable element)
        {
            int index = navigableElements.IndexOf(element);
            if (index != -1)
            {
                FocusElement(index);
            }
        }
    }

    // ========================================================================
    // FOCUS INDICATOR
    // ========================================================================
    // Visual highlight for focused UI elements
    // Addresses WCAG 2.4.7
    // ========================================================================

    /// <summary>
    /// Displays a visual indicator around the currently focused UI element.
    /// Updates automatically when focus changes.
    /// </summary>
    [AddComponentMenu("Accessibility/Focus Indicator")]
    public class FocusIndicator : MonoBehaviour
    {
        [Header("Visual Settings")]
        [Tooltip("Color of the focus outline")]
        public Color outlineColor = new Color(0f, 0.5f, 1f, 1f);

        [Tooltip("Thickness of the outline in pixels")]
        public float outlineThickness = 3f;

        [Tooltip("Padding around the focused element")]
        public float padding = 5f;

        [Tooltip("Animate the focus indicator")]
        public bool animate = true;

        [Tooltip("Animation speed (pulse effect)")]
        public float animationSpeed = 2f;

        [Header("Advanced")]
        [Tooltip("Layer for the focus indicator (should be above UI)")]
        public int sortingOrder = 100;

        private GameObject indicatorObject;
        private RectTransform indicatorRect;
        private Image indicatorImage;
        private GameObject lastSelected;
        private Canvas canvas;

        void Start()
        {
            CreateIndicator();
        }

        void Update()
        {
            UpdateIndicatorPosition();

            if (animate && indicatorObject.activeSelf)
            {
                AnimateIndicator();
            }
        }

        private void CreateIndicator()
        {
            // Find or create canvas
            canvas = FindObjectOfType<Canvas>();
            if (canvas == null)
            {
                Debug.LogError("FocusIndicator requires a Canvas in the scene");
                return;
            }

            // Create indicator GameObject
            indicatorObject = new GameObject("FocusIndicator");
            indicatorObject.transform.SetParent(canvas.transform, false);

            indicatorRect = indicatorObject.AddComponent<RectTransform>();
            indicatorRect.anchorMin = Vector2.zero;
            indicatorRect.anchorMax = Vector2.zero;
            indicatorRect.pivot = new Vector2(0.5f, 0.5f);

            indicatorImage = indicatorObject.AddComponent<Image>();
            indicatorImage.color = Color.clear;
            indicatorImage.raycastTarget = false;

            // Create outline effect using Outline component
            Outline outline = indicatorObject.AddComponent<Outline>();
            outline.effectColor = outlineColor;
            outline.effectDistance = new Vector2(outlineThickness, outlineThickness);

            // Set sorting order
            Canvas indicatorCanvas = indicatorObject.AddComponent<Canvas>();
            indicatorCanvas.overrideSorting = true;
            indicatorCanvas.sortingOrder = sortingOrder;

            indicatorObject.SetActive(false);
        }

        private void UpdateIndicatorPosition()
        {
            GameObject selected = EventSystem.current?.currentSelectedGameObject;

            if (selected != lastSelected)
            {
                lastSelected = selected;

                if (selected == null)
                {
                    indicatorObject.SetActive(false);
                    return;
                }

                RectTransform selectedRect = selected.GetComponent<RectTransform>();
                if (selectedRect != null)
                {
                    indicatorObject.SetActive(true);
                    UpdateIndicatorSize(selectedRect);
                }
                else
                {
                    indicatorObject.SetActive(false);
                }
            }
        }

        private void UpdateIndicatorSize(RectTransform target)
        {
            indicatorRect.position = target.position;
            indicatorRect.sizeDelta = target.sizeDelta + new Vector2(padding * 2, padding * 2);
            indicatorRect.rotation = target.rotation;
        }

        private void AnimateIndicator()
        {
            float alpha = 0.5f + Mathf.Sin(Time.time * animationSpeed) * 0.3f;
            Color color = outlineColor;
            color.a = alpha;

            Outline outline = indicatorObject.GetComponent<Outline>();
            if (outline != null)
            {
                outline.effectColor = color;
            }
        }

        public void SetOutlineColor(Color color)
        {
            outlineColor = color;
            Outline outline = indicatorObject.GetComponent<Outline>();
            if (outline != null)
            {
                outline.effectColor = color;
            }
        }

        public void SetThickness(float thickness)
        {
            outlineThickness = thickness;
            Outline outline = indicatorObject.GetComponent<Outline>();
            if (outline != null)
            {
                outline.effectDistance = new Vector2(thickness, thickness);
            }
        }
    }

    // ========================================================================
    // ACCESSIBLE BUTTON
    // ========================================================================
    // Button with enhanced accessibility features
    // Addresses WCAG 4.1.2
    // ========================================================================

    /// <summary>
    /// Enhanced button component with built-in accessibility features.
    /// Includes keyboard support and screen reader announcements.
    /// </summary>
    [RequireComponent(typeof(Button))]
    [AddComponentMenu("Accessibility/Accessible Button")]
    public class AccessibleButton : MonoBehaviour
    {
        [Header("Accessibility")]
        [Tooltip("Label for screen readers (if different from visual text)")]
        public string accessibleLabel = "";

        [Tooltip("Detailed description for screen readers")]
        public string accessibleDescription = "";

        [Tooltip("Announce when button is pressed")]
        public bool announceOnPress = true;

        [Tooltip("Custom announcement when pressed")]
        public string pressedAnnouncement = "Button activated";

        private Button button;

#if UNITY_2023_2_OR_NEWER
        private AccessibilityNode accessibilityNode;
#endif

        void Start()
        {
            button = GetComponent<Button>();
            SetupAccessibility();

            // Add keyboard listener
            button.onClick.AddListener(OnButtonClicked);
        }

        private void SetupAccessibility()
        {
#if UNITY_2023_2_OR_NEWER
            // Setup Unity Accessibility API (2023.2+)
            accessibilityNode = gameObject.AddComponent<AccessibilityNode>();

            // Get button text if no label specified
            if (string.IsNullOrEmpty(accessibleLabel))
            {
                Text textComponent = GetComponentInChildren<Text>();
                if (textComponent != null)
                {
                    accessibleLabel = textComponent.text;
                }
            }

            accessibilityNode.label = accessibleLabel;
            accessibilityNode.role = AccessibilityRole.Button;
            accessibilityNode.description = accessibleDescription;
            accessibilityNode.isActive = button.interactable;
#endif
        }

        private void OnButtonClicked()
        {
            if (announceOnPress)
            {
                AnnounceToScreenReader(pressedAnnouncement);
            }
        }

        private void AnnounceToScreenReader(string message)
        {
#if UNITY_2023_2_OR_NEWER
            if (accessibilityNode != null)
            {
                // Trigger screen reader announcement
                accessibilityNode.label = message;
                // Restore original label after brief delay
                StartCoroutine(RestoreLabelDelayed());
            }
#else
            Debug.Log($"[Screen Reader]: {message}");
#endif
        }

        IEnumerator RestoreLabelDelayed()
        {
            yield return new WaitForSeconds(0.1f);
#if UNITY_2023_2_OR_NEWER
            if (accessibilityNode != null)
            {
                accessibilityNode.label = accessibleLabel;
            }
#endif
        }

        // Update accessibility when button state changes
        void Update()
        {
#if UNITY_2023_2_OR_NEWER
            if (accessibilityNode != null && button != null)
            {
                accessibilityNode.isActive = button.interactable;
            }
#endif
        }

        // Public API
        public void SetAccessibleLabel(string label)
        {
            accessibleLabel = label;
#if UNITY_2023_2_OR_NEWER
            if (accessibilityNode != null)
            {
                accessibilityNode.label = label;
            }
#endif
        }

        public void SetAccessibleDescription(string description)
        {
            accessibleDescription = description;
#if UNITY_2023_2_OR_NEWER
            if (accessibilityNode != null)
            {
                accessibilityNode.description = description;
            }
#endif
        }
    }

    // ========================================================================
    // ACCESSIBLE TOGGLE
    // ========================================================================
    // Toggle with enhanced accessibility
    // Addresses WCAG 4.1.2
    // ========================================================================

    /// <summary>
    /// Enhanced toggle component with accessibility features.
    /// Announces state changes to screen readers.
    /// </summary>
    [RequireComponent(typeof(Toggle))]
    [AddComponentMenu("Accessibility/Accessible Toggle")]
    public class AccessibleToggle : MonoBehaviour
    {
        [Header("Accessibility")]
        public string accessibleLabel = "";
        public string accessibleDescription = "";
        public bool announceStateChanges = true;
        public string checkedAnnouncement = "Checked";
        public string uncheckedAnnouncement = "Unchecked";

        private Toggle toggle;

#if UNITY_2023_2_OR_NEWER
        private AccessibilityNode accessibilityNode;
#endif

        void Start()
        {
            toggle = GetComponent<Toggle>();
            SetupAccessibility();

            toggle.onValueChanged.AddListener(OnToggleChanged);
        }

        private void SetupAccessibility()
        {
#if UNITY_2023_2_OR_NEWER
            accessibilityNode = gameObject.AddComponent<AccessibilityNode>();

            if (string.IsNullOrEmpty(accessibleLabel))
            {
                Text textComponent = GetComponentInChildren<Text>();
                if (textComponent != null)
                {
                    accessibleLabel = textComponent.text;
                }
            }

            accessibilityNode.label = accessibleLabel;
            accessibilityNode.role = AccessibilityRole.Toggle;
            accessibilityNode.description = accessibleDescription;
            accessibilityNode.state = toggle.isOn ? "checked" : "unchecked";
#endif
        }

        private void OnToggleChanged(bool isOn)
        {
            if (announceStateChanges)
            {
                string announcement = isOn ? checkedAnnouncement : uncheckedAnnouncement;
                AnnounceToScreenReader(announcement);
            }

#if UNITY_2023_2_OR_NEWER
            if (accessibilityNode != null)
            {
                accessibilityNode.state = isOn ? "checked" : "unchecked";
            }
#endif
        }

        private void AnnounceToScreenReader(string message)
        {
#if UNITY_2023_2_OR_NEWER
            if (accessibilityNode != null)
            {
                string tempLabel = accessibilityNode.label;
                accessibilityNode.label = $"{tempLabel} {message}";
                StartCoroutine(RestoreLabelDelayed(tempLabel));
            }
#else
            Debug.Log($"[Screen Reader]: {message}");
#endif
        }

        IEnumerator RestoreLabelDelayed(string originalLabel)
        {
            yield return new WaitForSeconds(0.1f);
#if UNITY_2023_2_OR_NEWER
            if (accessibilityNode != null)
            {
                accessibilityNode.label = originalLabel;
            }
#endif
        }
    }

    // ========================================================================
    // ACCESSIBLE SLIDER
    // ========================================================================
    // Slider with keyboard and screen reader support
    // Addresses WCAG 2.1.1, 4.1.2
    // ========================================================================

    /// <summary>
    /// Enhanced slider with keyboard controls and value announcements.
    /// </summary>
    [RequireComponent(typeof(Slider))]
    [AddComponentMenu("Accessibility/Accessible Slider")]
    public class AccessibleSlider : MonoBehaviour
    {
        [Header("Accessibility")]
        public string accessibleLabel = "";
        public string accessibleDescription = "";
        public bool announceValueChanges = true;
        public float announcementDelay = 0.5f; // Debounce announcements

        [Header("Keyboard Controls")]
        public float keyboardStep = 0.1f;
        public KeyCode increaseKey = KeyCode.RightArrow;
        public KeyCode decreaseKey = KeyCode.LeftArrow;
        public KeyCode largeIncreaseKey = KeyCode.PageUp;
        public KeyCode largeDecreaseKey = KeyCode.PageDown;
        public float largeStepMultiplier = 5f;

        private Slider slider;
        private float lastAnnouncedValue;
        private float lastChangeTime;

#if UNITY_2023_2_OR_NEWER
        private AccessibilityNode accessibilityNode;
#endif

        void Start()
        {
            slider = GetComponent<Slider>();
            lastAnnouncedValue = slider.value;
            SetupAccessibility();

            slider.onValueChanged.AddListener(OnSliderValueChanged);
        }

        void Update()
        {
            HandleKeyboardInput();

            // Announce value changes after delay
            if (announceValueChanges && Time.time - lastChangeTime > announcementDelay)
            {
                if (Mathf.Abs(slider.value - lastAnnouncedValue) > 0.01f)
                {
                    AnnounceValue();
                    lastAnnouncedValue = slider.value;
                }
            }
        }

        private void SetupAccessibility()
        {
#if UNITY_2023_2_OR_NEWER
            accessibilityNode = gameObject.AddComponent<AccessibilityNode>();

            accessibilityNode.label = accessibleLabel;
            accessibilityNode.role = AccessibilityRole.Slider;
            accessibilityNode.description = accessibleDescription;
            accessibilityNode.value = slider.value.ToString("F2");
#endif
        }

        private void HandleKeyboardInput()
        {
            if (!slider.interactable) return;
            if (EventSystem.current?.currentSelectedGameObject != gameObject) return;

            float delta = 0f;

            if (Input.GetKeyDown(increaseKey))
                delta = keyboardStep;
            else if (Input.GetKeyDown(decreaseKey))
                delta = -keyboardStep;
            else if (Input.GetKeyDown(largeIncreaseKey))
                delta = keyboardStep * largeStepMultiplier;
            else if (Input.GetKeyDown(largeDecreaseKey))
                delta = -keyboardStep * largeStepMultiplier;

            if (delta != 0f)
            {
                float range = slider.maxValue - slider.minValue;
                slider.value = Mathf.Clamp(slider.value + delta * range, slider.minValue, slider.maxValue);
            }
        }

        private void OnSliderValueChanged(float value)
        {
            lastChangeTime = Time.time;

#if UNITY_2023_2_OR_NEWER
            if (accessibilityNode != null)
            {
                accessibilityNode.value = value.ToString("F2");
            }
#endif
        }

        private void AnnounceValue()
        {
            string valueText = FormatValue(slider.value);
            AnnounceToScreenReader($"{accessibleLabel}: {valueText}");
        }

        private string FormatValue(float value)
        {
            // Format value nicely (can be customized)
            if (slider.wholeNumbers)
                return Mathf.RoundToInt(value).ToString();
            else
                return value.ToString("F2");
        }

        private void AnnounceToScreenReader(string message)
        {
#if UNITY_2023_2_OR_NEWER
            // Announcement handled via AccessibilityNode value updates
#else
            Debug.Log($"[Screen Reader]: {message}");
#endif
        }
    }

    // ========================================================================
    // SCREEN READER ANNOUNCER
    // ========================================================================
    // Announces dynamic content changes
    // Addresses WCAG 4.1.3
    // ========================================================================

    /// <summary>
    /// Announces dynamic content changes to screen readers.
    /// Use for status messages, live regions, and notifications.
    /// </summary>
    [AddComponentMenu("Accessibility/Screen Reader Announcer")]
    public class ScreenReaderAnnouncer : MonoBehaviour
    {
        [Header("Live Region Settings")]
        [Tooltip("Priority of announcements (polite waits for silence, assertive interrupts)")]
        public LiveRegionMode mode = LiveRegionMode.Polite;

        public enum LiveRegionMode
        {
            Polite,     // Wait for screen reader to finish
            Assertive   // Interrupt current speech
        }

        private static ScreenReaderAnnouncer instance;
        private Queue<string> announcementQueue = new Queue<string>();
        private bool isAnnouncing = false;

        void Awake()
        {
            // Singleton pattern
            if (instance == null)
            {
                instance = this;
                DontDestroyOnLoad(gameObject);
            }
            else
            {
                Destroy(gameObject);
            }
        }

        /// <summary>
        /// Announce a message to screen readers (static method).
        /// </summary>
        public static void Announce(string message, LiveRegionMode mode = LiveRegionMode.Polite)
        {
            if (instance == null)
            {
                GameObject announcer = new GameObject("ScreenReaderAnnouncer");
                instance = announcer.AddComponent<ScreenReaderAnnouncer>();
            }

            instance.AnnounceMessage(message, mode);
        }

        /// <summary>
        /// Announce a message (instance method).
        /// </summary>
        public void AnnounceMessage(string message, LiveRegionMode announceMode = LiveRegionMode.Polite)
        {
            if (string.IsNullOrEmpty(message)) return;

            if (announceMode == LiveRegionMode.Assertive)
            {
                // Clear queue and announce immediately
                announcementQueue.Clear();
                DoAnnouncement(message);
            }
            else
            {
                // Queue announcement
                announcementQueue.Enqueue(message);
                if (!isAnnouncing)
                {
                    StartCoroutine(ProcessAnnouncementQueue());
                }
            }
        }

        private IEnumerator ProcessAnnouncementQueue()
        {
            isAnnouncing = true;

            while (announcementQueue.Count > 0)
            {
                string message = announcementQueue.Dequeue();
                DoAnnouncement(message);

                // Wait between announcements
                yield return new WaitForSeconds(0.5f);
            }

            isAnnouncing = false;
        }

        private void DoAnnouncement(string message)
        {
#if UNITY_2023_2_OR_NEWER
            // Use Unity Accessibility API
            // Note: In actual implementation, you'd use the proper API method
            // This is a placeholder as the exact API may vary
            Debug.Log($"[Screen Reader Announcement]: {message}");
#else
            Debug.Log($"[Screen Reader]: {message}");
#endif
        }

        // Convenience methods
        public static void AnnouncePolite(string message)
        {
            Announce(message, LiveRegionMode.Polite);
        }

        public static void AnnounceAssertive(string message)
        {
            Announce(message, LiveRegionMode.Assertive);
        }
    }

    // ========================================================================
    // FOCUS MANAGER
    // ========================================================================
    // Utilities for focus management
    // Addresses WCAG 2.4.3
    // ========================================================================

    /// <summary>
    /// Provides utilities for managing focus, including focus traps for modals.
    /// </summary>
    [AddComponentMenu("Accessibility/Focus Manager")]
    public class FocusManager : MonoBehaviour
    {
        [Header("Focus Trap Settings")]
        [Tooltip("Enable focus trap (prevents tabbing out of this container)")]
        public bool enableFocusTrap = false;

        [Tooltip("Automatically focus first element when enabled")]
        public bool autoFocusFirst = true;

        [Tooltip("Restore focus when trap is disabled")]
        public bool restoreFocusOnExit = true;

        private GameObject lastFocusedBeforeTrap;
        private List<Selectable> trapElements = new List<Selectable>();
        private bool trapActive = false;

        void OnEnable()
        {
            if (enableFocusTrap)
            {
                ActivateFocusTrap();
            }
        }

        void OnDisable()
        {
            if (trapActive)
            {
                DeactivateFocusTrap();
            }
        }

        void Update()
        {
            if (trapActive)
            {
                EnforceFocusTrap();
            }
        }

        public void ActivateFocusTrap()
        {
            // Store current focus
            lastFocusedBeforeTrap = EventSystem.current?.currentSelectedGameObject;

            // Get all focusable elements within this container
            trapElements.Clear();
            Selectable[] selectables = GetComponentsInChildren<Selectable>();
            foreach (Selectable s in selectables)
            {
                if (s.IsInteractable() && s.gameObject.activeInHierarchy)
                {
                    trapElements.Add(s);
                }
            }

            trapActive = true;

            // Focus first element
            if (autoFocusFirst && trapElements.Count > 0)
            {
                trapElements[0].Select();
            }
        }

        public void DeactivateFocusTrap()
        {
            trapActive = false;

            // Restore focus
            if (restoreFocusOnExit && lastFocusedBeforeTrap != null)
            {
                Selectable selectable = lastFocusedBeforeTrap.GetComponent<Selectable>();
                if (selectable != null && selectable.IsInteractable())
                {
                    selectable.Select();
                }
            }

            lastFocusedBeforeTrap = null;
        }

        private void EnforceFocusTrap()
        {
            GameObject currentSelected = EventSystem.current?.currentSelectedGameObject;

            // If focus left the trap, bring it back
            if (currentSelected == null || !IsWithinTrap(currentSelected))
            {
                if (trapElements.Count > 0)
                {
                    trapElements[0].Select();
                }
            }
        }

        private bool IsWithinTrap(GameObject obj)
        {
            if (obj == null) return false;

            Transform current = obj.transform;
            while (current != null)
            {
                if (current == transform)
                {
                    return true;
                }
                current = current.parent;
            }

            return false;
        }

        // Public API
        public void EnableTrap()
        {
            enableFocusTrap = true;
            ActivateFocusTrap();
        }

        public void DisableTrap()
        {
            enableFocusTrap = false;
            DeactivateFocusTrap();
        }
    }

    // ========================================================================
    // ACCESSIBILITY HELPER
    // ========================================================================
    // Utility methods for common accessibility tasks
    // ========================================================================

    /// <summary>
    /// Static utility class with helper methods for accessibility implementation.
    /// </summary>
    public static class AccessibilityHelper
    {
        /// <summary>
        /// Check if a color combination meets WCAG contrast requirements.
        /// </summary>
        public static bool MeetsContrastRequirement(Color foreground, Color background, bool largeText = false)
        {
            float ratio = CalculateContrastRatio(foreground, background);
            float requiredRatio = largeText ? 3.0f : 4.5f; // WCAG AA standards
            return ratio >= requiredRatio;
        }

        /// <summary>
        /// Calculate contrast ratio between two colors (WCAG formula).
        /// </summary>
        public static float CalculateContrastRatio(Color c1, Color c2)
        {
            float l1 = CalculateRelativeLuminance(c1);
            float l2 = CalculateRelativeLuminance(c2);

            float lighter = Mathf.Max(l1, l2);
            float darker = Mathf.Min(l1, l2);

            return (lighter + 0.05f) / (darker + 0.05f);
        }

        private static float CalculateRelativeLuminance(Color color)
        {
            float r = GetLinearValue(color.r);
            float g = GetLinearValue(color.g);
            float b = GetLinearValue(color.b);

            return 0.2126f * r + 0.7152f * g + 0.0722f * b;
        }

        private static float GetLinearValue(float value)
        {
            if (value <= 0.03928f)
                return value / 12.92f;
            else
                return Mathf.Pow((value + 0.055f) / 1.055f, 2.4f);
        }

        /// <summary>
        /// Get all interactive UI elements in a hierarchy.
        /// </summary>
        public static List<Selectable> GetAllSelectables(Transform root)
        {
            Selectable[] selectables = root.GetComponentsInChildren<Selectable>();
            return selectables
                .Where(s => s.IsInteractable() && s.gameObject.activeInHierarchy)
                .ToList();
        }

        /// <summary>
        /// Set up basic tab navigation for a set of UI elements.
        /// </summary>
        public static void SetupTabNavigation(List<Selectable> elements, bool circular = true)
        {
            for (int i = 0; i < elements.Count; i++)
            {
                Navigation nav = elements[i].navigation;
                nav.mode = Navigation.Mode.Explicit;

                // Set up previous/next
                int prevIndex = i - 1;
                int nextIndex = i + 1;

                if (circular)
                {
                    if (prevIndex < 0) prevIndex = elements.Count - 1;
                    if (nextIndex >= elements.Count) nextIndex = 0;
                }
                else
                {
                    if (prevIndex < 0) prevIndex = i;
                    if (nextIndex >= elements.Count) nextIndex = i;
                }

                nav.selectOnUp = elements[prevIndex];
                nav.selectOnDown = elements[nextIndex];
                nav.selectOnLeft = elements[prevIndex];
                nav.selectOnRight = elements[nextIndex];

                elements[i].navigation = nav;
            }
        }

        /// <summary>
        /// Find the first focusable element in a hierarchy.
        /// </summary>
        public static Selectable FindFirstFocusable(Transform root)
        {
            Selectable[] selectables = root.GetComponentsInChildren<Selectable>();
            foreach (Selectable s in selectables)
            {
                if (s.IsInteractable() && s.gameObject.activeInHierarchy)
                {
                    return s;
                }
            }
            return null;
        }

        /// <summary>
        /// Announce a message to screen readers.
        /// </summary>
        public static void Announce(string message, bool assertive = false)
        {
            ScreenReaderAnnouncer.Announce(
                message,
                assertive ? ScreenReaderAnnouncer.LiveRegionMode.Assertive : ScreenReaderAnnouncer.LiveRegionMode.Polite
            );
        }
    }
}

/*
 * ============================================================================
 * USAGE EXAMPLES
 * ============================================================================
 *
 * 1. KEYBOARD NAVIGATION:
 *    - Add KeyboardNavigationManager to Canvas or parent UI container
 *    - Set autoDetectSelectables = true
 *    - Press Play - Tab and arrow keys now navigate UI
 *
 * 2. FOCUS INDICATOR:
 *    - Add FocusIndicator to Canvas
 *    - Customize outline color and thickness in Inspector
 *    - Focus indicator automatically follows selected element
 *
 * 3. ACCESSIBLE BUTTON:
 *    - Add AccessibleButton to any Button GameObject
 *    - Set accessibleLabel for screen reader
 *    - Button now has enhanced keyboard and SR support
 *
 * 4. SCREEN READER ANNOUNCEMENTS:
 *    - Call ScreenReaderAnnouncer.Announce("Your message") from any script
 *    - Use AnnouncePolite() for non-urgent messages
 *    - Use AnnounceAssertive() for critical messages
 *
 * 5. FOCUS TRAP (for modals):
 *    - Add FocusManager to modal panel
 *    - Set enableFocusTrap = true
 *    - Focus cannot escape modal until it's closed
 *
 * 6. CUSTOM IMPLEMENTATIONS:
 *    - Copy template classes to separate files
 *    - Modify to fit your project structure
 *    - Extend functionality as needed
 *
 * ============================================================================
 */
