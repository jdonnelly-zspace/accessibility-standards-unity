using UnityEngine;
using System.Collections.Generic;

#if UNITY_2023_2_OR_NEWER
using UnityEngine.Accessibility;
#endif

/// <summary>
/// Integrates Unity Accessibility Module with zSpace applications
/// Provides centralized management of AccessibilityHierarchy and AccessibilityNodes
/// Supports Windows desktop screen readers (NVDA, Narrator, JAWS)
/// Requires Unity 2023.2+ for full functionality
///
/// WCAG 2.2 Level AA Compliance:
/// - SC 4.1.2: Name, Role, Value (Level A)
/// - SC 4.1.3: Status Messages (Level AA)
///
/// Usage:
/// 1. Attach this script to a GameObject in your zSpace scene
/// 2. Enable "Enable Accessibility" in Inspector
/// 3. Other scripts can register AccessibilityNodes via RegisterNode()
/// 4. Test with NVDA or Windows Narrator on built application
///
/// Documentation: docs/unity-accessibility-integration.md
/// </summary>
public class UnityAccessibilityIntegration : MonoBehaviour
{
    #region Inspector Fields

    [Header("Accessibility Settings")]
    [Tooltip("Enable Unity Accessibility Module integration. Requires Unity 2023.2+")]
    public bool enableAccessibility = true;

    [Tooltip("Automatically create accessibility hierarchy on Start")]
    public bool autoInitialize = true;

    [Header("Debug Settings")]
    [Tooltip("Log accessibility events to console (useful for debugging)")]
    public bool debugMode = false;

    [Tooltip("Log all screen reader announcements")]
    public bool logAnnouncements = false;

    [Header("Vision Accessibility (Unity 6.0+)")]
    [Tooltip("Automatically apply color-blind safe palette to UI elements")]
    public bool useColorBlindSafePalette = false;

    #endregion

    #region Private Fields

#if UNITY_2023_2_OR_NEWER
    private AccessibilityHierarchy m_Hierarchy;
    private Dictionary<GameObject, AccessibilityNode> m_NodeMap;
    private bool m_IsInitialized = false;
#endif

    #endregion

    #region Unity Lifecycle

    void Awake()
    {
#if UNITY_2023_2_OR_NEWER
        if (enableAccessibility && autoInitialize)
        {
            InitializeAccessibility();
        }
#else
        if (enableAccessibility)
        {
            Debug.LogWarning("[UnityAccessibilityIntegration] Unity Accessibility Module requires Unity 2023.2 or newer. " +
                           "Please upgrade Unity for full accessibility support. " +
                           "Current version does not support AccessibilityHierarchy, AccessibilityNode, or AssistiveSupport APIs.");
        }
#endif
    }

    void OnDestroy()
    {
#if UNITY_2023_2_OR_NEWER
        CleanupAccessibility();
#endif
    }

    #endregion

    #region Public API

    /// <summary>
    /// Initialize the Unity Accessibility Module
    /// Creates AccessibilityHierarchy and sets up event listeners
    /// </summary>
    public void InitializeAccessibility()
    {
#if UNITY_2023_2_OR_NEWER
        if (m_IsInitialized)
        {
            if (debugMode)
            {
                Debug.LogWarning("[UnityAccessibilityIntegration] Already initialized. Skipping.");
            }
            return;
        }

        // Create the accessibility hierarchy
        m_Hierarchy = new AccessibilityHierarchy();
        m_NodeMap = new Dictionary<GameObject, AccessibilityNode>();

        // Set as the active hierarchy for screen readers
        AssistiveSupport.activeHierarchy = m_Hierarchy;

        // Listen for screen reader status changes
        AssistiveSupport.screenReaderStatusChanged += OnScreenReaderStatusChanged;

        m_IsInitialized = true;

        if (debugMode)
        {
            Debug.Log($"[UnityAccessibilityIntegration] Accessibility hierarchy initialized. " +
                     $"Screen reader active: {AssistiveSupport.isScreenReaderEnabled}");
        }
#endif
    }

    /// <summary>
    /// Register an AccessibilityNode with the hierarchy
    /// </summary>
    /// <param name="gameObject">GameObject associated with this node</param>
    /// <param name="label">Accessible label (announced by screen readers)</param>
    /// <param name="role">Semantic role (Button, Link, Heading, etc.)</param>
    /// <param name="hint">Optional hint for additional context</param>
    /// <returns>The created AccessibilityNode, or null if failed</returns>
    public AccessibilityNode RegisterNode(GameObject gameObject, string label, AccessibilityRole role, string hint = "")
    {
#if UNITY_2023_2_OR_NEWER
        if (!m_IsInitialized)
        {
            Debug.LogError("[UnityAccessibilityIntegration] Not initialized. Call InitializeAccessibility() first.");
            return null;
        }

        if (gameObject == null)
        {
            Debug.LogError("[UnityAccessibilityIntegration] Cannot register null GameObject.");
            return null;
        }

        if (string.IsNullOrEmpty(label))
        {
            Debug.LogWarning($"[UnityAccessibilityIntegration] Registering node for '{gameObject.name}' with empty label. " +
                           "Screen readers will not announce this element properly.");
        }

        // Check if already registered
        if (m_NodeMap.ContainsKey(gameObject))
        {
            if (debugMode)
            {
                Debug.LogWarning($"[UnityAccessibilityIntegration] GameObject '{gameObject.name}' already has an AccessibilityNode. " +
                               "Updating existing node.");
            }

            // Update existing node
            var existingNode = m_NodeMap[gameObject];
            existingNode.label = label;
            existingNode.role = role;
            existingNode.hint = hint;
            return existingNode;
        }

        // Create new node
        AccessibilityNode node = new AccessibilityNode();
        node.label = label;
        node.role = role;
        node.hint = hint;
        node.state = AccessibilityState.None;

        // Add to hierarchy
        m_Hierarchy.AddNode(node);

        // Track in dictionary
        m_NodeMap[gameObject] = node;

        if (debugMode)
        {
            Debug.Log($"[UnityAccessibilityIntegration] Registered node: '{label}' ({role}) for GameObject '{gameObject.name}'");
        }

        return node;
#else
        return null;
#endif
    }

    /// <summary>
    /// Unregister an AccessibilityNode from the hierarchy
    /// </summary>
    /// <param name="gameObject">GameObject to unregister</param>
    public void UnregisterNode(GameObject gameObject)
    {
#if UNITY_2023_2_OR_NEWER
        if (!m_IsInitialized || gameObject == null)
        {
            return;
        }

        if (m_NodeMap.TryGetValue(gameObject, out AccessibilityNode node))
        {
            m_Hierarchy.RemoveNode(node);
            m_NodeMap.Remove(gameObject);

            if (debugMode)
            {
                Debug.Log($"[UnityAccessibilityIntegration] Unregistered node for GameObject '{gameObject.name}'");
            }
        }
#endif
    }

    /// <summary>
    /// Get the AccessibilityNode associated with a GameObject
    /// </summary>
    /// <param name="gameObject">GameObject to look up</param>
    /// <returns>The AccessibilityNode, or null if not found</returns>
    public AccessibilityNode GetNode(GameObject gameObject)
    {
#if UNITY_2023_2_OR_NEWER
        if (gameObject != null && m_NodeMap.TryGetValue(gameObject, out AccessibilityNode node))
        {
            return node;
        }
#endif
        return null;
    }

    /// <summary>
    /// Update the state of an AccessibilityNode
    /// </summary>
    /// <param name="gameObject">GameObject whose node to update</param>
    /// <param name="state">New accessibility state</param>
    public void UpdateNodeState(GameObject gameObject, AccessibilityState state)
    {
#if UNITY_2023_2_OR_NEWER
        AccessibilityNode node = GetNode(gameObject);
        if (node != null)
        {
            node.state = state;

            if (debugMode)
            {
                Debug.Log($"[UnityAccessibilityIntegration] Updated state for '{gameObject.name}': {state}");
            }
        }
#endif
    }

    /// <summary>
    /// Send an announcement to the screen reader
    /// Useful for notifying users of important events or state changes
    /// </summary>
    /// <param name="message">Message to announce</param>
    /// <param name="isPolite">If true, waits for screen reader to finish current announcement. If false, interrupts.</param>
    public void SendAnnouncement(string message, bool isPolite = true)
    {
#if UNITY_2023_2_OR_NEWER
        if (string.IsNullOrEmpty(message))
        {
            Debug.LogWarning("[UnityAccessibilityIntegration] Cannot send empty announcement.");
            return;
        }

        var dispatcher = AssistiveSupport.notificationDispatcher;
        if (dispatcher != null)
        {
            dispatcher.SendAnnouncement(message);

            if (logAnnouncements || debugMode)
            {
                Debug.Log($"[UnityAccessibilityIntegration] Announcement sent: \"{message}\"");
            }
        }
        else if (debugMode)
        {
            Debug.LogWarning("[UnityAccessibilityIntegration] No notification dispatcher available. " +
                           "Screen reader may not be active.");
        }
#endif
    }

    /// <summary>
    /// Check if the accessibility system is initialized
    /// </summary>
    public bool IsInitialized()
    {
#if UNITY_2023_2_OR_NEWER
        return m_IsInitialized;
#else
        return false;
#endif
    }

    /// <summary>
    /// Check if a screen reader is currently active
    /// </summary>
    public bool IsScreenReaderActive()
    {
#if UNITY_2023_2_OR_NEWER
        return AssistiveSupport.isScreenReaderEnabled;
#else
        return false;
#endif
    }

    /// <summary>
    /// Get the active accessibility hierarchy
    /// </summary>
    public AccessibilityHierarchy GetHierarchy()
    {
#if UNITY_2023_2_OR_NEWER
        return m_Hierarchy;
#else
        return null;
#endif
    }

    /// <summary>
    /// Get the total number of registered nodes
    /// </summary>
    public int GetNodeCount()
    {
#if UNITY_2023_2_OR_NEWER
        return m_NodeMap != null ? m_NodeMap.Count : 0;
#else
        return 0;
#endif
    }

    #endregion

    #region Unity 6.0+ Vision Accessibility

#if UNITY_6000_0_OR_NEWER
    /// <summary>
    /// Generate a color-blind safe color palette
    /// Safe for deuteranopia, protanopia, and tritanopia
    /// Unity 6.0+ only
    /// </summary>
    /// <param name="paletteSize">Number of colors to generate</param>
    /// <returns>Array of color-blind safe colors</returns>
    public Color[] GetColorBlindSafePalette(int paletteSize = 8)
    {
        if (paletteSize <= 0)
        {
            Debug.LogWarning("[UnityAccessibilityIntegration] Palette size must be greater than 0.");
            return new Color[0];
        }

        Color[] palette = new Color[paletteSize];
        int distinctColors = VisionUtility.GetColorBlindSafePalette(palette);

        if (debugMode)
        {
            Debug.Log($"[UnityAccessibilityIntegration] Generated {distinctColors} distinct color-blind safe colors " +
                     $"(requested {paletteSize})");
        }

        return palette;
    }
#endif

    #endregion

    #region Private Methods

#if UNITY_2023_2_OR_NEWER
    private void OnScreenReaderStatusChanged(bool isEnabled)
    {
        if (debugMode)
        {
            Debug.Log($"[UnityAccessibilityIntegration] Screen reader status changed: {(isEnabled ? "ENABLED" : "DISABLED")}");
        }

        // Notify all registered components about screen reader state change
        // You can add custom logic here to enable/disable certain features based on screen reader state
    }

    private void CleanupAccessibility()
    {
        if (!m_IsInitialized)
        {
            return;
        }

        // Unregister event listeners
        AssistiveSupport.screenReaderStatusChanged -= OnScreenReaderStatusChanged;

        // Clear all nodes
        if (m_Hierarchy != null && m_NodeMap != null)
        {
            foreach (var kvp in m_NodeMap)
            {
                m_Hierarchy.RemoveNode(kvp.Value);
            }
            m_NodeMap.Clear();
        }

        // Clear active hierarchy
        if (AssistiveSupport.activeHierarchy == m_Hierarchy)
        {
            AssistiveSupport.activeHierarchy = null;
        }

        m_IsInitialized = false;

        if (debugMode)
        {
            Debug.Log("[UnityAccessibilityIntegration] Accessibility cleanup complete.");
        }
    }
#endif

    #endregion

    #region Helper Methods

    /// <summary>
    /// Helper method to register a button with standard accessibility settings
    /// </summary>
    public AccessibilityNode RegisterButton(GameObject gameObject, string label, string hint = "")
    {
#if UNITY_2023_2_OR_NEWER
        return RegisterNode(gameObject, label, AccessibilityRole.Button, hint);
#else
        return null;
#endif
    }

    /// <summary>
    /// Helper method to register a link with standard accessibility settings
    /// </summary>
    public AccessibilityNode RegisterLink(GameObject gameObject, string label, string hint = "")
    {
#if UNITY_2023_2_OR_NEWER
        return RegisterNode(gameObject, label, AccessibilityRole.Link, hint);
#else
        return null;
#endif
    }

    /// <summary>
    /// Helper method to register a toggle/checkbox with standard accessibility settings
    /// </summary>
    public AccessibilityNode RegisterToggle(GameObject gameObject, string label, bool isChecked, string hint = "")
    {
#if UNITY_2023_2_OR_NEWER
        var node = RegisterNode(gameObject, label, AccessibilityRole.Checkbox, hint);
        if (node != null)
        {
            node.state = isChecked ? AccessibilityState.Selected : AccessibilityState.None;
        }
        return node;
#else
        return null;
#endif
    }

    /// <summary>
    /// Helper method to register a heading with standard accessibility settings
    /// </summary>
    public AccessibilityNode RegisterHeading(GameObject gameObject, string label)
    {
#if UNITY_2023_2_OR_NEWER
        return RegisterNode(gameObject, label, AccessibilityRole.Header, "");
#else
        return null;
#endif
    }

    /// <summary>
    /// Helper method to register static text with standard accessibility settings
    /// </summary>
    public AccessibilityNode RegisterStaticText(GameObject gameObject, string label)
    {
#if UNITY_2023_2_OR_NEWER
        return RegisterNode(gameObject, label, AccessibilityRole.StaticText, "");
#else
        return null;
#endif
    }

    /// <summary>
    /// Update toggle state (convenience method)
    /// </summary>
    public void UpdateToggleState(GameObject gameObject, bool isChecked)
    {
#if UNITY_2023_2_OR_NEWER
        var state = isChecked ? AccessibilityState.Selected : AccessibilityState.None;
        UpdateNodeState(gameObject, state);

        // Announce state change
        var node = GetNode(gameObject);
        if (node != null)
        {
            string stateText = isChecked ? "checked" : "unchecked";
            SendAnnouncement($"{node.label} {stateText}");
        }
#endif
    }

    /// <summary>
    /// Set focus state (convenience method)
    /// </summary>
    public void SetFocused(GameObject gameObject, bool isFocused)
    {
#if UNITY_2023_2_OR_NEWER
        var state = isFocused ? AccessibilityState.Focused : AccessibilityState.None;
        UpdateNodeState(gameObject, state);
#endif
    }

    /// <summary>
    /// Set disabled state (convenience method)
    /// </summary>
    public void SetDisabled(GameObject gameObject, bool isDisabled)
    {
#if UNITY_2023_2_OR_NEWER
        var state = isDisabled ? AccessibilityState.Disabled : AccessibilityState.None;
        UpdateNodeState(gameObject, state);
#endif
    }

    #endregion

    #region Singleton Pattern (Optional)

    private static UnityAccessibilityIntegration s_Instance;

    /// <summary>
    /// Singleton instance (optional, for easy access from other scripts)
    /// </summary>
    public static UnityAccessibilityIntegration Instance
    {
        get
        {
            if (s_Instance == null)
            {
                s_Instance = FindObjectOfType<UnityAccessibilityIntegration>();

                if (s_Instance == null)
                {
                    Debug.LogWarning("[UnityAccessibilityIntegration] No instance found in scene. " +
                                   "Add UnityAccessibilityIntegration component to a GameObject.");
                }
            }
            return s_Instance;
        }
    }

    void Awake()
    {
        // Singleton setup
        if (s_Instance != null && s_Instance != this)
        {
            Debug.LogWarning("[UnityAccessibilityIntegration] Multiple instances detected. Destroying duplicate.");
            Destroy(gameObject);
            return;
        }
        s_Instance = this;

        // Initialize accessibility
#if UNITY_2023_2_OR_NEWER
        if (enableAccessibility && autoInitialize)
        {
            InitializeAccessibility();
        }
#else
        if (enableAccessibility)
        {
            Debug.LogWarning("[UnityAccessibilityIntegration] Unity Accessibility Module requires Unity 2023.2 or newer. " +
                           "Please upgrade Unity for full accessibility support.");
        }
#endif
    }

    #endregion
}
