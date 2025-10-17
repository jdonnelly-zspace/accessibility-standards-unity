using UnityEngine;
using UnityEngine.Windows.Speech; // Unity's built-in speech recognition (Windows)
using System.Collections.Generic;
using System.Linq;

/// <summary>
/// Voice command system for zSpace - provides voice input as an alternative to stylus.
///
/// WCAG 2.1.1 (Level A): Keyboard - Voice is an acceptable alternative input method
/// W3C XAUR: Multiple input modalities for accessibility
///
/// Use cases:
/// - Users with limited motor control who cannot use stylus precisely
/// - Hands-free operation
/// - Alternative to keyboard for users with typing difficulties
///
/// Platform: Windows only (Unity's KeywordRecognizer uses Windows Speech Recognition)
/// Note: Requires microphone permission and Windows Speech Recognition enabled
/// </summary>
public class VoiceCommandManager : MonoBehaviour
{
    [Header("Voice Commands")]
    [Tooltip("List of voice commands to recognize")]
    [SerializeField] private string[] voiceCommands = new string[]
    {
        "select",
        "activate",
        "open menu",
        "close menu",
        "next",
        "previous",
        "confirm",
        "cancel",
        "help"
    };

    [Header("Settings")]
    [Tooltip("Confidence threshold (0-1). Higher = more accurate but less responsive")]
    [SerializeField] [Range(0f, 1f)] private float confidenceThreshold = 0.5f;

    [Tooltip("Enable voice command logging")]
    [SerializeField] private bool logVoiceCommands = true;

    [Header("Accessibility")]
    [Tooltip("Provide visual feedback for recognized commands")]
    [SerializeField] private bool showVisualFeedback = true;

    [Tooltip("Provide audio confirmation for recognized commands")]
    [SerializeField] private bool playAudioConfirmation = true;

    [SerializeField] private AudioClip commandRecognizedSound;

    // Events for voice commands
    public delegate void VoiceCommandRecognized(string command);
    public event VoiceCommandRecognized OnVoiceCommandRecognized;

    // Internal state
    #if UNITY_STANDALONE_WIN
    private KeywordRecognizer keywordRecognizer;
    private Dictionary<string, System.Action> commandActions;
    #endif
    private bool isListening = false;
    private AudioSource audioSource;

    void Start()
    {
        #if UNITY_STANDALONE_WIN
        InitializeVoiceRecognition();
        #else
        Debug.LogWarning($"[{name}] Voice commands only supported on Windows. Platform: {Application.platform}");
        enabled = false;
        #endif

        // Get audio source for confirmation sounds
        audioSource = GetComponent<AudioSource>();
        if (audioSource == null && playAudioConfirmation)
        {
            audioSource = gameObject.AddComponent<AudioSource>();
        }
    }

    #if UNITY_STANDALONE_WIN
    private void InitializeVoiceRecognition()
    {
        if (voiceCommands == null || voiceCommands.Length == 0)
        {
            Debug.LogError($"[{name}] No voice commands configured!");
            enabled = false;
            return;
        }

        try
        {
            // Create keyword recognizer
            keywordRecognizer = new KeywordRecognizer(voiceCommands);

            // Add recognition handler
            keywordRecognizer.OnPhraseRecognized += OnPhraseRecognized;

            // Initialize command actions dictionary
            commandActions = new Dictionary<string, System.Action>();

            Debug.Log($"[{name}] Voice recognition initialized with {voiceCommands.Length} commands");
            Debug.Log($"[{name}] Commands: {string.Join(", ", voiceCommands)}");
        }
        catch (System.Exception e)
        {
            Debug.LogError($"[{name}] Failed to initialize voice recognition: {e.Message}");
            Debug.LogError("Ensure Windows Speech Recognition is enabled in Windows Settings");
            enabled = false;
        }
    }

    private void OnPhraseRecognized(PhraseRecognizedEventArgs args)
    {
        // Check confidence threshold
        if (args.confidence < (ConfidenceLevel)Mathf.RoundToInt(confidenceThreshold * 2))
        {
            if (logVoiceCommands)
            {
                Debug.Log($"[{name}] Voice command rejected (low confidence): '{args.text}' ({args.confidence})");
            }
            return;
        }

        string command = args.text.ToLower();

        if (logVoiceCommands)
        {
            Debug.Log($"[{name}] Voice command recognized: '{command}' (confidence: {args.confidence})");
        }

        // Provide feedback
        if (showVisualFeedback)
        {
            ShowVisualFeedback(command);
        }

        if (playAudioConfirmation && commandRecognizedSound != null && audioSource != null)
        {
            audioSource.PlayOneShot(commandRecognizedSound);
        }

        // Execute registered action if exists
        if (commandActions.ContainsKey(command))
        {
            commandActions[command]?.Invoke();
        }

        // Fire event
        OnVoiceCommandRecognized?.Invoke(command);
    }
    #endif

    /// <summary>
    /// Start listening for voice commands.
    /// </summary>
    public void StartListening()
    {
        #if UNITY_STANDALONE_WIN
        if (keywordRecognizer != null && !isListening)
        {
            keywordRecognizer.Start();
            isListening = true;
            Debug.Log($"[{name}] Voice recognition started");
        }
        #endif
    }

    /// <summary>
    /// Stop listening for voice commands.
    /// </summary>
    public void StopListening()
    {
        #if UNITY_STANDALONE_WIN
        if (keywordRecognizer != null && isListening)
        {
            keywordRecognizer.Stop();
            isListening = false;
            Debug.Log($"[{name}] Voice recognition stopped");
        }
        #endif
    }

    /// <summary>
    /// Register an action to execute when a specific voice command is recognized.
    /// </summary>
    public void RegisterCommand(string command, System.Action action)
    {
        #if UNITY_STANDALONE_WIN
        command = command.ToLower();

        if (!voiceCommands.Contains(command))
        {
            Debug.LogWarning($"[{name}] Command '{command}' not in recognized commands list. Add it to voiceCommands array.");
            return;
        }

        if (commandActions == null)
        {
            commandActions = new Dictionary<string, System.Action>();
        }

        commandActions[command] = action;
        Debug.Log($"[{name}] Registered action for command: '{command}'");
        #endif
    }

    /// <summary>
    /// Unregister a voice command action.
    /// </summary>
    public void UnregisterCommand(string command)
    {
        #if UNITY_STANDALONE_WIN
        command = command.ToLower();

        if (commandActions != null && commandActions.ContainsKey(command))
        {
            commandActions.Remove(command);
            Debug.Log($"[{name}] Unregistered action for command: '{command}'");
        }
        #endif
    }

    /// <summary>
    /// Check if voice recognition is currently listening.
    /// </summary>
    public bool IsListening()
    {
        return isListening;
    }

    /// <summary>
    /// Get list of available voice commands.
    /// </summary>
    public string[] GetAvailableCommands()
    {
        return voiceCommands;
    }

    private void ShowVisualFeedback(string command)
    {
        // Visual feedback - could be expanded with UI elements
        // For now, just log to screen (could integrate with subtitle system)
        Debug.Log($"[Voice] {command}");
    }

    void OnDestroy()
    {
        #if UNITY_STANDALONE_WIN
        if (keywordRecognizer != null && isListening)
        {
            keywordRecognizer.Stop();
            keywordRecognizer.Dispose();
        }
        #endif
    }

    #if UNITY_EDITOR
    [ContextMenu("Start Voice Recognition")]
    private void TestStartListening()
    {
        StartListening();
        Debug.Log("Say one of these commands: " + string.Join(", ", voiceCommands));
    }

    [ContextMenu("Stop Voice Recognition")]
    private void TestStopListening()
    {
        StopListening();
    }

    [ContextMenu("List Available Commands")]
    private void TestListCommands()
    {
        Debug.Log($"Available voice commands ({voiceCommands.Length}):");
        for (int i = 0; i < voiceCommands.Length; i++)
        {
            Debug.Log($"  {i + 1}. {voiceCommands[i]}");
        }
    }
    #endif
}
