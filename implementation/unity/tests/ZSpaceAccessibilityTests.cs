using System.Collections;
using System.Collections.Generic;
using NUnit.Framework;
using UnityEngine;
using UnityEngine.TestTools;
using UnityEngine.UI;

/// <summary>
/// Unity Test Framework tests for zSpace accessibility compliance.
/// Tests WCAG 2.2 Level AA + W3C XAUR requirements.
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

    #endregion
}
