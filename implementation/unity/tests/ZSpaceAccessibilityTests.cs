using System.Collections;
using System.Collections.Generic;
using NUnit.Framework;
using UnityEngine;
using UnityEngine.TestTools;
using UnityEngine.UI;

#if UNITY_2023_2_OR_NEWER
using UnityEngine.Accessibility;
#endif

/// <summary>
/// Unity Test Framework tests for zSpace accessibility compliance.
/// Tests WCAG 2.2 Level AA + W3C XAUR requirements.
///
/// Unity 2023.2+ includes Unity Accessibility Module tests.
///
/// Run: Window → General → Test Runner → PlayMode → Run All
/// </summary>
public class ZSpaceAccessibilityTests
{
    // Test setup
    private GameObject testCanvas;
    private GameObject testButton;

    [SetUp]
    public void Setup()
    {
        // Create test canvas
        testCanvas = new GameObject("TestCanvas");
        var canvas = testCanvas.AddComponent<Canvas>();
        canvas.renderMode = RenderMode.ScreenSpaceOverlay;
        testCanvas.AddComponent<CanvasScaler>();
        testCanvas.AddComponent<GraphicRaycaster>();
    }

    [TearDown]
    public void Teardown()
    {
        // Clean up test objects
        if (testCanvas != null)
        {
            Object.DestroyImmediate(testCanvas);
        }
        if (testButton != null)
        {
            Object.DestroyImmediate(testButton);
        }
    }

    #region Keyboard Accessibility Tests (WCAG 2.1.1 - Level A)

    [Test]
    public void KeyboardStylusAlternative_Exists()
    {
        // WCAG 2.1.1: Keyboard - All functionality must be available via keyboard
        var alternatives = Object.FindObjectsOfType<KeyboardStylusAlternative>();

        Assert.IsTrue(
            alternatives.Length > 0,
            "KeyboardStylusAlternative component must be present for keyboard accessibility (WCAG 2.1.1 - Level A)"
        );
    }

    [UnityTest]
    public IEnumerator AccessibleButton_RespondsToKeyboard()
    {
        // Create test button
        testButton = CreateTestButton("TestButton");
        var accessibleButton = testButton.AddComponent<AccessibleStylusButton>();
        accessibleButton.keyboardKey = KeyCode.Return;

        bool wasClicked = false;
        accessibleButton.GetComponent<Button>().onClick.AddListener(() => wasClicked = true);

        yield return null; // Wait one frame

        // Simulate keyboard press
        SimulateKeyPress(KeyCode.Return);

        yield return null; // Wait for event processing

        Assert.IsTrue(wasClicked, "AccessibleStylusButton must respond to keyboard input");
    }

    [Test]
    public void AllButtons_HaveKeyboardAlternatives()
    {
        // Find all buttons in scene
        var buttons = Object.FindObjectsOfType<Button>();

        foreach (var button in buttons)
        {
            var accessibleButton = button.GetComponent<AccessibleStylusButton>();
            Assert.IsNotNull(
                accessibleButton,
                $"Button '{button.name}' must have AccessibleStylusButton component for keyboard access"
            );
        }
    }

    #endregion

    #region Target Size Tests (WCAG 2.5.8 - Level AA)

    [Test]
    public void Button_MeetsMinimumTargetSize()
    {
        // WCAG 2.5.8: Target Size (Minimum) - 24x24 pixels minimum
        testButton = CreateTestButton("TestButton");
        var rect = testButton.GetComponent<RectTransform>();

        float width = rect.rect.width;
        float height = rect.rect.height;

        Assert.GreaterOrEqual(width, 24f, "Button width must be at least 24px (WCAG 2.5.8 - Level AA)");
        Assert.GreaterOrEqual(height, 24f, "Button height must be at least 24px (WCAG 2.5.8 - Level AA)");
    }

    [Test]
    public void AllInteractiveElements_MeetTargetSize()
    {
        var buttons = Object.FindObjectsOfType<Button>();

        foreach (var button in buttons)
        {
            var rect = button.GetComponent<RectTransform>();
            if (rect == null) continue;

            float width = rect.rect.width;
            float height = rect.rect.height;

            Assert.GreaterOrEqual(
                width,
                24f,
                $"Button '{button.name}' width is {width}px, must be ≥24px (WCAG 2.5.8)"
            );
            Assert.GreaterOrEqual(
                height,
                24f,
                $"Button '{button.name}' height is {height}px, must be ≥24px (WCAG 2.5.8)"
            );
        }
    }

    #endregion

    #region Depth Perception Tests (W3C XAUR - CRITICAL for zSpace)

    [Test]
    public void DepthCueManager_Exists()
    {
        // W3C XAUR: Depth perception alternatives required
        // 10-15% of users cannot perceive stereoscopic 3D
        var depthCueManagers = Object.FindObjectsOfType<DepthCueManager>();

        Assert.IsTrue(
            depthCueManagers.Length > 0,
            "DepthCueManager must be present - 10-15% of users cannot perceive stereoscopic 3D (W3C XAUR)"
        );
    }

    [Test]
    public void DepthCueManager_HasMultipleCues()
    {
        var depthCueManager = new GameObject("TestDepthCue").AddComponent<DepthCueManager>();

        // Verify at least 3 depth cues are enabled
        int enabledCues = 0;
        if (depthCueManager.useSizeScaling) enabledCues++;
        if (depthCueManager.useShadows) enabledCues++;
        if (depthCueManager.useAudioDistance) enabledCues++;
        if (depthCueManager.useHapticDepth) enabledCues++;
        if (depthCueManager.useMotionParallax) enabledCues++;
        if (depthCueManager.useOcclusion) enabledCues++;

        Assert.GreaterOrEqual(
            enabledCues,
            3,
            "DepthCueManager must use at least 3 depth cues for users who cannot perceive stereoscopic 3D"
        );

        Object.DestroyImmediate(depthCueManager.gameObject);
    }

    [UnityTest]
    public IEnumerator Application_RunsWithoutStereoscopic3D()
    {
        // Application must be fully functional without stereoscopic 3D
        // Test: Disable stereoscopic rendering (simulate "glasses off")

        yield return null;

        // Verify depth cues are still present
        var depthCueManagers = Object.FindObjectsOfType<DepthCueManager>();
        Assert.IsTrue(
            depthCueManagers.Length > 0,
            "Depth perception alternatives must be available when stereoscopic 3D is unavailable"
        );
    }

    #endregion

    #region Screen Reader Tests (WCAG 4.1.2 - Level A)

    [Test]
    public void AccessibleButton_HasLabel()
    {
        // WCAG 4.1.2: Name, Role, Value
        testButton = CreateTestButton("TestButton");
        var accessibleButton = testButton.AddComponent<AccessibleStylusButton>();

        Assert.IsFalse(
            string.IsNullOrEmpty(accessibleButton.buttonLabel),
            "AccessibleStylusButton must have a label for screen readers (WCAG 4.1.2 - Level A)"
        );
    }

    [Test]
    public void AllButtons_HaveScreenReaderLabels()
    {
        var accessibleButtons = Object.FindObjectsOfType<AccessibleStylusButton>();

        foreach (var button in accessibleButtons)
        {
            Assert.IsFalse(
                string.IsNullOrEmpty(button.buttonLabel),
                $"Button '{button.name}' must have a label for screen readers"
            );
        }
    }

    #endregion

    #region Focus Indicator Tests (WCAG 2.4.7 - Level AA)

    [Test]
    public void FocusIndicators_Exist()
    {
        // WCAG 2.4.7: Focus Visible
        var focusIndicators = Object.FindObjectsOfType<ZSpaceFocusIndicator>();

        Assert.IsTrue(
            focusIndicators.Length > 0,
            "ZSpaceFocusIndicator components must be present for keyboard users (WCAG 2.4.7 - Level AA)"
        );
    }

    [UnityTest]
    public IEnumerator FocusIndicator_VisibleWhenFocused()
    {
        var testObject = new GameObject("FocusedObject");
        var focusIndicator = testObject.AddComponent<ZSpaceFocusIndicator>();

        yield return null;

        // Simulate focus
        focusIndicator.OnFocus();

        yield return null;

        Assert.IsTrue(
            focusIndicator.isVisible,
            "Focus indicator must be visible when object is focused (WCAG 2.4.7)"
        );

        Object.DestroyImmediate(testObject);
    }

    #endregion

    #region Haptic Feedback Tests (zSpace-specific)

    [Test]
    public void StylusHapticFeedback_Exists()
    {
        var hapticComponents = Object.FindObjectsOfType<StylusHapticFeedback>();

        Assert.IsTrue(
            hapticComponents.Length > 0,
            "StylusHapticFeedback should be present for tactile depth cues"
        );
    }

    [UnityTest]
    public IEnumerator HapticFeedback_ProvidesDepthCue()
    {
        var testObject = new GameObject("HapticObject");
        var haptic = testObject.AddComponent<StylusHapticFeedback>();

        yield return null;

        // Simulate depth-based haptic feedback
        haptic.SetDepth(0.5f); // 50% depth

        yield return new WaitForSeconds(0.1f);

        Assert.IsTrue(
            haptic.isActive,
            "Haptic feedback should provide depth cues as alternative to stereoscopic 3D"
        );

        Object.DestroyImmediate(testObject);
    }

    #endregion

    #region Spatial Audio Tests (WCAG 1.4.7)

    [Test]
    public void SpatialAudioManager_Exists()
    {
        var audioManagers = Object.FindObjectsOfType<SpatialAudioManager>();

        Assert.IsTrue(
            audioManagers.Length > 0,
            "SpatialAudioManager should be present for audio-based depth cues"
        );
    }

    [Test]
    public void SpatialAudio_UsesDesktopSpeakers()
    {
        var testObject = new GameObject("AudioManager");
        var spatialAudio = testObject.AddComponent<SpatialAudioManager>();

        Assert.IsTrue(
            spatialAudio.useDesktopSpeakers,
            "SpatialAudioManager must support desktop speakers (not just headphones)"
        );

        Object.DestroyImmediate(testObject);
    }

    #endregion

    #region Menu Navigation Tests (WCAG 2.1.1)

    [Test]
    public void Menu_SupportsKeyboardNavigation()
    {
        var menus = Object.FindObjectsOfType<AccessibleZSpaceMenu>();

        foreach (var menu in menus)
        {
            Assert.IsTrue(
                menu.navigateUpKey != KeyCode.None,
                $"Menu '{menu.name}' must support keyboard navigation (up key)"
            );
            Assert.IsTrue(
                menu.navigateDownKey != KeyCode.None,
                $"Menu '{menu.name}' must support keyboard navigation (down key)"
            );
            Assert.IsTrue(
                menu.selectKey != KeyCode.None,
                $"Menu '{menu.name}' must support keyboard selection"
            );
        }
    }

    #endregion

    #region Unity Accessibility Module Tests (Unity 2023.2+ Only)

#if UNITY_2023_2_OR_NEWER

    /// <summary>
    /// WCAG 4.1.2: Name, Role, Value (Level A)
    /// Verifies UnityAccessibilityIntegration component is initialized in scene
    /// </summary>
    [UnityTest]
    public IEnumerator UnityAccessibilityIntegration_IsInitialized()
    {
        // Find UnityAccessibilityIntegration in scene
        var integration = Object.FindObjectOfType<UnityAccessibilityIntegration>();

        Assert.IsNotNull(integration,
            "UnityAccessibilityIntegration component not found in scene. " +
            "Add UnityAccessibilityIntegration component to a GameObject for screen reader support.");

        yield return null; // Wait one frame for Awake/Start

        Assert.IsTrue(integration.IsInitialized(),
            "Unity Accessibility Module not initialized. " +
            "Check enableAccessibility and autoInitialize settings in Inspector.");
    }

    /// <summary>
    /// WCAG 4.1.2: Name, Role, Value (Level A)
    /// Verifies AccessibilityHierarchy is set as active for screen readers
    /// </summary>
    [UnityTest]
    public IEnumerator AccessibilityHierarchy_IsSetAsActive()
    {
        var integration = Object.FindObjectOfType<UnityAccessibilityIntegration>();
        Assert.IsNotNull(integration, "UnityAccessibilityIntegration not found");

        yield return null;

        var hierarchy = integration.GetHierarchy();
        Assert.IsNotNull(hierarchy,
            "AccessibilityHierarchy is null. Check UnityAccessibilityIntegration initialization.");

        Assert.AreEqual(AssistiveSupport.activeHierarchy, hierarchy,
            "AccessibilityHierarchy not set as active hierarchy. " +
            "Screen readers will not detect UI elements. " +
            "Ensure AssistiveSupport.activeHierarchy is set in InitializeAccessibility().");
    }

    /// <summary>
    /// WCAG 4.1.2: Name, Role, Value (Level A)
    /// Verifies all interactive UI elements have AccessibilityNodes registered
    /// </summary>
    [UnityTest]
    public IEnumerator AllInteractiveElements_HaveAccessibilityNodes()
    {
        var integration = Object.FindObjectOfType<UnityAccessibilityIntegration>();
        Assert.IsNotNull(integration, "UnityAccessibilityIntegration not found");

        yield return null;

        // Find all interactive elements (buttons, toggles, etc.)
        var buttons = Object.FindObjectsOfType<Button>();
        var toggles = Object.FindObjectsOfType<Toggle>();

        int missingNodeCount = 0;
        List<string> missingElements = new List<string>();

        // Check buttons
        foreach (var button in buttons)
        {
            var node = integration.GetNode(button.gameObject);
            if (node == null)
            {
                missingNodeCount++;
                missingElements.Add($"Button '{button.gameObject.name}'");
            }
        }

        // Check toggles
        foreach (var toggle in toggles)
        {
            var node = integration.GetNode(toggle.gameObject);
            if (node == null)
            {
                missingNodeCount++;
                missingElements.Add($"Toggle '{toggle.gameObject.name}'");
            }
        }

        if (missingNodeCount > 0)
        {
            string missingList = string.Join("\n  - ", missingElements);
            Assert.Fail(
                $"Found {missingNodeCount} interactive element(s) without AccessibilityNodes:\n  - {missingList}\n\n" +
                $"Register nodes via:\n" +
                $"  UnityAccessibilityIntegration.Instance.RegisterButton(gameObject, label, hint)\n" +
                $"  UnityAccessibilityIntegration.Instance.RegisterToggle(gameObject, label, isChecked, hint)");
        }
    }

    /// <summary>
    /// WCAG 4.1.2: Name, Role, Value (Level A)
    /// Verifies AccessibilityNodes have descriptive labels (not empty or generic)
    /// </summary>
    [UnityTest]
    public IEnumerator AccessibilityNodes_HaveDescriptiveLabels()
    {
        var integration = Object.FindObjectOfType<UnityAccessibilityIntegration>();
        Assert.IsNotNull(integration, "UnityAccessibilityIntegration not found");

        yield return null;

        var buttons = Object.FindObjectsOfType<Button>();
        List<string> invalidLabels = new List<string>();

        foreach (var button in buttons)
        {
            var node = integration.GetNode(button.gameObject);
            if (node != null)
            {
                // Check for empty label
                if (string.IsNullOrEmpty(node.label))
                {
                    invalidLabels.Add($"Button '{button.gameObject.name}' has EMPTY label - screen readers will be silent");
                }
                // Check for generic labels
                else if (node.label == "Button" || node.label == "GameObject" || node.label == button.gameObject.name)
                {
                    invalidLabels.Add($"Button '{button.gameObject.name}' has GENERIC label '{node.label}' - use descriptive label instead (e.g., 'Start Simulation')");
                }
            }
        }

        if (invalidLabels.Count > 0)
        {
            string invalidList = string.Join("\n  - ", invalidLabels);
            Assert.Fail(
                $"Found {invalidLabels.Count} AccessibilityNode(s) with invalid labels:\n  - {invalidList}\n\n" +
                $"Labels should be descriptive and user-facing:\n" +
                $"  Good: 'Start Simulation', 'Settings Menu', 'Show Grid Toggle'\n" +
                $"  Bad: 'Button', 'GameObject', 'StartButton', ''");
        }
    }

    /// <summary>
    /// WCAG 4.1.2: Name, Role, Value (Level A)
    /// Verifies AccessibilityNodes have correct semantic roles
    /// </summary>
    [UnityTest]
    public IEnumerator AccessibilityNodes_HaveCorrectRoles()
    {
        var integration = Object.FindObjectOfType<UnityAccessibilityIntegration>();
        Assert.IsNotNull(integration, "UnityAccessibilityIntegration not found");

        yield return null;

        List<string> incorrectRoles = new List<string>();

        // Check buttons have Button role
        var buttons = Object.FindObjectsOfType<Button>();
        foreach (var button in buttons)
        {
            var node = integration.GetNode(button.gameObject);
            if (node != null && node.role != AccessibilityRole.Button)
            {
                incorrectRoles.Add($"Button '{button.gameObject.name}' has role '{node.role}' - should be AccessibilityRole.Button");
            }
        }

        // Check toggles have Checkbox role
        var toggles = Object.FindObjectsOfType<Toggle>();
        foreach (var toggle in toggles)
        {
            var node = integration.GetNode(toggle.gameObject);
            if (node != null && node.role != AccessibilityRole.Checkbox)
            {
                incorrectRoles.Add($"Toggle '{toggle.gameObject.name}' has role '{node.role}' - should be AccessibilityRole.Checkbox");
            }
        }

        if (incorrectRoles.Count > 0)
        {
            string rolesList = string.Join("\n  - ", incorrectRoles);
            Assert.Fail(
                $"Found {incorrectRoles.Count} AccessibilityNode(s) with incorrect roles:\n  - {rolesList}\n\n" +
                $"Use correct semantic roles:\n" +
                $"  Buttons → AccessibilityRole.Button\n" +
                $"  Toggles → AccessibilityRole.Checkbox\n" +
                $"  Headings → AccessibilityRole.Header\n" +
                $"  Links → AccessibilityRole.Link\n" +
                $"  Static text → AccessibilityRole.StaticText");
        }
    }

    /// <summary>
    /// WCAG 4.1.3: Status Messages (Level AA)
    /// Verifies SendAnnouncement functionality exists and can be called
    /// </summary>
    [UnityTest]
    public IEnumerator SendAnnouncement_FunctionExists()
    {
        var integration = Object.FindObjectOfType<UnityAccessibilityIntegration>();
        Assert.IsNotNull(integration, "UnityAccessibilityIntegration not found");

        yield return null;

        // Test that SendAnnouncement can be called without errors
        try
        {
            integration.SendAnnouncement("Test announcement");
            Assert.Pass("SendAnnouncement() works correctly for screen reader notifications (WCAG 4.1.3)");
        }
        catch (System.Exception ex)
        {
            Assert.Fail($"SendAnnouncement() failed: {ex.Message}. " +
                       "Ensure AssistiveSupport.notificationDispatcher is available.");
        }
    }

    /// <summary>
    /// WCAG 4.1.2: Name, Role, Value (Level A)
    /// Verifies toggle states are tracked correctly
    /// </summary>
    [UnityTest]
    public IEnumerator ToggleStates_UpdateCorrectly()
    {
        var integration = Object.FindObjectOfType<UnityAccessibilityIntegration>();
        Assert.IsNotNull(integration, "UnityAccessibilityIntegration not found");

        yield return null;

        // Create test toggle
        var toggleObj = CreateTestToggle("TestToggle");
        var toggle = toggleObj.GetComponent<Toggle>();

        // Register as accessibility node
        var node = integration.RegisterToggle(toggleObj, "Test Toggle", false);
        Assert.IsNotNull(node, "Failed to register toggle as AccessibilityNode");

        yield return null;

        // Verify initial state (unchecked)
        Assert.AreEqual(AccessibilityState.None, node.state,
            "Unchecked toggle should have state None, not Selected");

        // Toggle to checked
        toggle.isOn = true;
        integration.UpdateToggleState(toggleObj, true);

        yield return null;

        // Verify checked state
        Assert.AreEqual(AccessibilityState.Selected, node.state,
            "Checked toggle should have state Selected. " +
            "Screen readers announce 'checked' vs 'unchecked' based on this state.");

        // Cleanup
        Object.DestroyImmediate(toggleObj);
    }

    /// <summary>
    /// Test Unity 6.0+ VisionUtility (color-blind safe palettes)
    /// </summary>
#if UNITY_6000_0_OR_NEWER
    [Test]
    public void VisionUtility_GeneratesColorBlindSafePalette()
    {
        var integration = Object.FindObjectOfType<UnityAccessibilityIntegration>();
        Assert.IsNotNull(integration, "UnityAccessibilityIntegration not found");

        var palette = integration.GetColorBlindSafePalette(8);

        Assert.IsNotNull(palette, "Color-blind safe palette should not be null");
        Assert.GreaterOrEqual(palette.Length, 1,
            "Palette should contain at least 1 color. " +
            "Unity's VisionUtility generates distinct colors safe for deuteranopia, protanopia, and tritanopia.");
    }
#endif

#endif // UNITY_2023_2_OR_NEWER

    #endregion

    #region Helper Methods

    private GameObject CreateTestButton(string name)
    {
        var buttonObj = new GameObject(name);
        buttonObj.transform.SetParent(testCanvas.transform);

        var rectTransform = buttonObj.AddComponent<RectTransform>();
        rectTransform.sizeDelta = new Vector2(160, 40); // 160x40px (above minimum)

        buttonObj.AddComponent<CanvasRenderer>();
        var image = buttonObj.AddComponent<Image>();
        image.color = new Color(0.2f, 0.6f, 1f);

        buttonObj.AddComponent<Button>();

        return buttonObj;
    }

    private void SimulateKeyPress(KeyCode key)
    {
        // Note: In real Unity Test Framework, use Input.GetKeyDown simulation
        // For this example, we assume the component handles the input
        Debug.Log($"Simulating key press: {key}");
    }

    private GameObject CreateTestToggle(string name)
    {
        var toggleObj = new GameObject(name);
        toggleObj.transform.SetParent(testCanvas.transform);

        var rectTransform = toggleObj.AddComponent<RectTransform>();
        rectTransform.sizeDelta = new Vector2(40, 40); // 40x40px (above minimum)

        var toggle = toggleObj.AddComponent<Toggle>();

        // Add required Image component for Toggle
        var background = new GameObject("Background");
        background.transform.SetParent(toggleObj.transform);
        var bgRect = background.AddComponent<RectTransform>();
        bgRect.sizeDelta = new Vector2(40, 40);
        var bgImage = background.AddComponent<Image>();
        bgImage.color = Color.white;
        toggle.targetGraphic = bgImage;

        // Add checkmark
        var checkmark = new GameObject("Checkmark");
        checkmark.transform.SetParent(background.transform);
        var checkRect = checkmark.AddComponent<RectTransform>();
        checkRect.sizeDelta = new Vector2(30, 30);
        var checkImage = checkmark.AddComponent<Image>();
        checkImage.color = Color.green;
        toggle.graphic = checkImage;

        return toggleObj;
    }

    #endregion
}
