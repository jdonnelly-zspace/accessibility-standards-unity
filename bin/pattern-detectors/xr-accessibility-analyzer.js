/**
 * XR Accessibility Pattern Analyzer
 *
 * Detects XR-specific accessibility patterns and issues in Unity projects.
 * Analyzes hand tracking, stylus input, gaze input, voice commands, spatial audio,
 * depth cues, and alternative interaction methods for VR/AR/MR applications.
 *
 * Special focus on zSpace stylus accessibility for stereoscopic desktop displays.
 *
 * @module xr-accessibility-analyzer
 */

import fs from 'fs';
import path from 'path';

// ============================================================================
// XR ACCESSIBILITY PATTERNS
// ============================================================================

const XR_PATTERNS = {
  // zSpace SDK patterns
  zspace: {
    patterns: [
      /using\s+zSpace\.Core/g,
      /ZPointer/g,
      /ZView/g,
      /ZStereoRig/g,
      /ZCore/g,
      /stylus/gi,
      /zSpace\.Input/g
    ],
    confidence: 1.0,
    description: 'zSpace SDK usage',
    category: 'stylus'
  },

  // Unity XR Interaction Toolkit
  xrInteractionToolkit: {
    patterns: [
      /using\s+UnityEngine\.XR\.Interaction\.Toolkit/g,
      /XRController/g,
      /XRRayInteractor/g,
      /XRGrabInteractable/g,
      /XRBaseInteractor/g,
      /ActionBasedController/g
    ],
    confidence: 0.95,
    description: 'XR Interaction Toolkit',
    category: 'hand-tracking'
  },

  // Oculus/Meta Quest SDK
  oculus: {
    patterns: [
      /using\s+Oculus/g,
      /OVR/g,
      /OculusHand/g,
      /OVRHand/g,
      /OVRGrabber/g,
      /OVRInput/g
    ],
    confidence: 0.95,
    description: 'Oculus/Meta SDK',
    category: 'hand-tracking'
  },

  // Microsoft Mixed Reality Toolkit (MRTK)
  mrtk: {
    patterns: [
      /using\s+Microsoft\.MixedReality\.Toolkit/g,
      /MRTK/g,
      /IMixedRealityPointer/g,
      /MixedRealityInputAction/g,
      /HandJointKind/g
    ],
    confidence: 0.95,
    description: 'Microsoft Mixed Reality Toolkit',
    category: 'hand-tracking'
  },

  // Gaze input patterns
  gazeInput: {
    patterns: [
      /\bgaze\b.*\binput\b/gi,
      /\bgaze\b.*\bselect/gi,
      /\bgaze\b.*\bray/gi,
      /GazePointer/g,
      /EyeTrack/g,
      /DwellTime/g,
      /\bdwell\b.*\bselect/gi
    ],
    confidence: 0.85,
    description: 'Gaze-based input',
    category: 'gaze'
  },

  // Voice command patterns
  voiceCommands: {
    patterns: [
      /\bvoice\b.*\bcommand/gi,
      /speech.*recognition/gi,
      /KeywordRecognizer/g,
      /DictationRecognizer/g,
      /VoiceCommand/g,
      /using\s+UnityEngine\.Windows\.Speech/g
    ],
    confidence: 0.9,
    description: 'Voice command support',
    category: 'voice'
  },

  // Spatial audio patterns
  spatialAudio: {
    patterns: [
      /AudioSource.*spatialBlend/g,
      /spatial.*audio/gi,
      /3D.*audio/gi,
      /AudioMixer/g,
      /reverb.*zone/gi,
      /AudioListener/g
    ],
    confidence: 0.7,
    description: 'Spatial audio implementation',
    category: 'audio'
  },

  // Depth cue patterns (for stereoblind users)
  depthCues: {
    patterns: [
      /DepthCue/g,
      /depth.*indicator/gi,
      /distance.*marker/gi,
      /outline.*shader/gi,
      /size.*scaling/gi,
      /parallax/gi
    ],
    confidence: 0.6,
    description: 'Depth cue implementation',
    category: 'depth'
  },

  // Alternative input patterns
  alternativeInput: {
    patterns: [
      /gamepad/gi,
      /controller/gi,
      /Input\.GetJoystickNames/g,
      /XInput/g,
      /switch.*input.*mode/gi
    ],
    confidence: 0.5,
    description: 'Alternative input methods',
    category: 'alternative'
  }
};

// XR accessibility requirements
const XR_REQUIREMENTS = {
  handTracking: {
    requiresAlternative: ['keyboard', 'gamepad', 'voice'],
    wcagCriteria: ['2.1.1'],
    description: 'Hand tracking requires keyboard or controller alternative'
  },
  stylusInput: {
    requiresAlternative: ['keyboard', 'mouse', 'gamepad'],
    wcagCriteria: ['2.1.1'],
    description: 'Stylus input requires keyboard or mouse alternative'
  },
  gazeInput: {
    requiresAlternative: ['keyboard', 'gamepad'],
    wcagCriteria: ['2.1.1', '2.5.1'],
    description: 'Gaze input requires alternative for those unable to use eye tracking'
  },
  spatialAudio: {
    requiresAlternative: ['captions', 'visualIndicators'],
    wcagCriteria: ['1.2.1', '1.2.2'],
    description: 'Spatial audio requires visual alternatives for deaf/hard-of-hearing users'
  },
  depthBased: {
    requiresAlternative: ['colorCues', 'sizeCues', 'labelCues'],
    wcagCriteria: ['1.4.1'],
    description: 'Depth-based information requires alternatives for stereoblind users'
  }
};

// ============================================================================
// XR ACCESSIBILITY ANALYZER CLASS
// ============================================================================

export class XRAccessibilityAnalyzer {
  constructor(scripts) {
    this.scripts = scripts;
    this.findings = [];
    this.statistics = {
      xrUsed: false,
      xrSdks: [],
      inputMethods: [],
      alternativeInputsAvailable: [],
      missingAlternatives: [],
      spatialAudioUsed: false,
      depthCuesFound: false,
      voiceCommandsAvailable: false,
      gazeInputUsed: false,
      confidenceScore: 0
    };
  }

  /**
   * Main analysis entry point
   */
  analyze() {
    console.log('🥽 Analyzing XR accessibility patterns...');

    // Detect XR SDK usage
    this.detectXRPatterns();

    // Analyze input methods and alternatives
    this.analyzeInputMethods();

    // Check for accessibility alternatives
    this.checkAccessibilityAlternatives();

    // Calculate confidence score
    this.calculateConfidenceScore();

    // Generate findings
    this.generateFindings();

    console.log(`   XR patterns: ${this.statistics.xrUsed ? '✅' : '❌'}`);
    if (this.statistics.xrUsed) {
      console.log(`   SDKs detected: ${this.statistics.xrSdks.join(', ')}`);
      console.log(`   Input methods: ${this.statistics.inputMethods.join(', ')}`);
      console.log(`   Confidence: ${(this.statistics.confidenceScore * 100).toFixed(1)}%`);
    }

    return {
      statistics: this.statistics,
      findings: this.findings
    };
  }

  /**
   * Detect XR patterns in scripts
   */
  detectXRPatterns() {
    const detections = {
      sdks: new Set(),
      inputMethods: new Set(),
      features: new Set()
    };

    this.scripts.forEach(script => {
      for (const [patternName, config] of Object.entries(XR_PATTERNS)) {
        const matches = this.findPatternMatches(script, config.patterns);

        if (matches.length > 0) {
          detections.features.add(patternName);

          // Categorize by SDK or input method
          if (['zspace', 'xrInteractionToolkit', 'oculus', 'mrtk'].includes(patternName)) {
            detections.sdks.add(config.description);
          }

          if (config.category) {
            detections.inputMethods.add(config.category);
          }

          // Update specific statistics
          if (patternName === 'spatialAudio') {
            this.statistics.spatialAudioUsed = true;
          } else if (patternName === 'depthCues') {
            this.statistics.depthCuesFound = true;
          } else if (patternName === 'voiceCommands') {
            this.statistics.voiceCommandsAvailable = true;
          } else if (patternName === 'gazeInput') {
            this.statistics.gazeInputUsed = true;
          }
        }
      }
    });

    this.statistics.xrUsed = detections.sdks.size > 0 || detections.inputMethods.size > 0;
    this.statistics.xrSdks = Array.from(detections.sdks);
    this.statistics.inputMethods = Array.from(detections.inputMethods);
    this.xrDetections = detections;
  }

  /**
   * Analyze input methods and check for alternatives
   */
  analyzeInputMethods() {
    const primaryInputs = [];
    const alternatives = [];

    // Identify primary input methods
    if (this.statistics.inputMethods.includes('stylus')) {
      primaryInputs.push('stylus');
    }
    if (this.statistics.inputMethods.includes('hand-tracking')) {
      primaryInputs.push('hand-tracking');
    }
    if (this.statistics.inputMethods.includes('gaze')) {
      primaryInputs.push('gaze');
    }

    // Identify alternative input methods
    if (this.statistics.inputMethods.includes('alternative')) {
      alternatives.push('gamepad/controller');
    }
    if (this.statistics.voiceCommandsAvailable) {
      alternatives.push('voice');
    }

    // Check if keyboard support is available (from KeyboardAnalyzer)
    // This will be integrated when the main analyzer runs all detectors
    // For now, we'll just note what we found

    this.primaryInputMethods = primaryInputs;
    this.statistics.alternativeInputsAvailable = alternatives;
  }

  /**
   * Check for required accessibility alternatives
   */
  checkAccessibilityAlternatives() {
    const missing = [];

    // Check hand tracking alternatives
    if (this.statistics.inputMethods.includes('hand-tracking')) {
      const hasAlternative = this.statistics.alternativeInputsAvailable.some(
        alt => ['gamepad/controller', 'voice'].includes(alt)
      );

      if (!hasAlternative) {
        missing.push({
          primary: 'hand-tracking',
          required: XR_REQUIREMENTS.handTracking.requiresAlternative,
          wcag: XR_REQUIREMENTS.handTracking.wcagCriteria
        });
      }
    }

    // Check stylus alternatives
    if (this.statistics.inputMethods.includes('stylus')) {
      const hasAlternative = this.statistics.alternativeInputsAvailable.length > 0;

      if (!hasAlternative) {
        missing.push({
          primary: 'stylus',
          required: XR_REQUIREMENTS.stylusInput.requiresAlternative,
          wcag: XR_REQUIREMENTS.stylusInput.wcagCriteria
        });
      }
    }

    // Check gaze input alternatives
    if (this.statistics.gazeInputUsed) {
      const hasAlternative = this.statistics.alternativeInputsAvailable.some(
        alt => ['gamepad/controller'].includes(alt)
      );

      if (!hasAlternative) {
        missing.push({
          primary: 'gaze',
          required: XR_REQUIREMENTS.gazeInput.requiresAlternative,
          wcag: XR_REQUIREMENTS.gazeInput.wcagCriteria
        });
      }
    }

    // Check spatial audio alternatives
    if (this.statistics.spatialAudioUsed) {
      // Check for caption/subtitle systems
      const hasCaptions = this.scripts.some(script =>
        /caption|subtitle/gi.test(script.content)
      );

      if (!hasCaptions) {
        missing.push({
          primary: 'spatial-audio',
          required: ['captions', 'visual-indicators'],
          wcag: XR_REQUIREMENTS.spatialAudio.wcagCriteria
        });
      }
    }

    // Check depth cue alternatives
    if (this.statistics.xrUsed && !this.statistics.depthCuesFound) {
      // In stereoscopic applications, depth perception is important
      // Stereoblind users need alternative depth cues
      missing.push({
        primary: 'stereoscopic-depth',
        required: ['size-cues', 'outline-shaders', 'distance-labels'],
        wcag: XR_REQUIREMENTS.depthBased.wcagCriteria
      });
    }

    this.statistics.missingAlternatives = missing;
  }

  /**
   * Calculate overall confidence score
   */
  calculateConfidenceScore() {
    if (!this.statistics.xrUsed) {
      this.statistics.confidenceScore = 0;
      return;
    }

    // Base confidence if XR is used
    let confidence = 0.5;

    // Boost for each detected alternative input method
    confidence += this.statistics.alternativeInputsAvailable.length * 0.1;

    // Boost for accessibility features
    if (this.statistics.voiceCommandsAvailable) confidence += 0.1;
    if (this.statistics.depthCuesFound) confidence += 0.1;

    // Penalty for missing alternatives
    confidence -= this.statistics.missingAlternatives.length * 0.15;

    this.statistics.confidenceScore = Math.max(0, Math.min(1, confidence));
  }

  /**
   * Find pattern matches in script
   */
  findPatternMatches(script, patterns) {
    const matches = [];

    patterns.forEach(pattern => {
      const scriptMatches = script.content.match(pattern);
      if (scriptMatches) {
        matches.push(...scriptMatches);
      }
    });

    return matches;
  }

  /**
   * Generate findings for audit report
   */
  generateFindings() {
    if (!this.statistics.xrUsed) {
      // No XR-specific findings if XR isn't used
      return;
    }

    // Finding: Missing input alternatives
    this.statistics.missingAlternatives.forEach(missing => {
      let severity, title, description, recommendation;

      switch (missing.primary) {
        case 'stylus':
          severity = 'critical';
          title = 'zSpace Stylus Input Without Keyboard/Mouse Alternative';
          description = 'Application uses zSpace stylus input but no keyboard or mouse alternative was detected. Users unable to use the stylus (limited dexterity, motor disabilities) will be unable to access functionality.';
          recommendation = 'Implement keyboard and/or mouse alternatives for all stylus interactions. Consider KeyboardStylusAlternative component.';
          break;

        case 'hand-tracking':
          severity = 'high';
          title = 'Hand Tracking Without Alternative Input Method';
          description = 'Application uses hand tracking but no alternative input method (gamepad, voice) was detected. Users with limited hand mobility will be unable to interact.';
          recommendation = 'Implement gamepad/controller support or voice commands as alternatives to hand tracking.';
          break;

        case 'gaze':
          severity = 'high';
          title = 'Gaze Input Without Alternative';
          description = 'Application uses gaze-based input but no alternative input method was detected. Users unable to use eye tracking will be excluded.';
          recommendation = 'Provide gamepad/controller alternative for gaze-based interactions. Ensure dwell time is configurable.';
          break;

        case 'spatial-audio':
          severity = 'critical';
          title = 'Spatial Audio Without Captions or Visual Indicators';
          description = 'Application uses spatial audio but no caption or visual indicator system was detected. Deaf and hard-of-hearing users will miss important audio information.';
          recommendation = 'Implement SubtitleSystem or visual indicators for all spatial audio cues. See WCAG 1.2.1, 1.2.2.';
          break;

        case 'stereoscopic-depth':
          severity = 'medium';
          title = 'Stereoscopic Display Without Alternative Depth Cues';
          description = 'XR application detected but no alternative depth cues found. Stereoblind users (4-10% of population) may not perceive depth information correctly.';
          recommendation = 'Implement DepthCueManager with size scaling, outline shaders, or distance labels as depth alternatives.';
          break;

        default:
          severity = 'medium';
          title = `${missing.primary} Input Without Alternatives`;
          description = `Application uses ${missing.primary} input without detected alternatives.`;
          recommendation = `Implement alternative input methods: ${missing.required.join(', ')}.`;
      }

      this.findings.push({
        id: `XR-${this.findings.length + 1}`.padStart(6, '0'),
        severity: severity,
        title: title,
        description: description,
        wcagCriteria: missing.wcag || ['2.1.1'],
        confidence: 0.75,
        recommendation: recommendation,
        affectedInputMethods: [missing.primary]
      });
    });

    // Finding: Good - Alternative inputs detected
    if (this.statistics.alternativeInputsAvailable.length > 0 &&
        this.statistics.missingAlternatives.length === 0) {
      this.findings.push({
        id: 'XR-POSITIVE',
        severity: 'info',
        title: 'Multiple Input Methods Detected',
        description: `Application provides multiple input methods: ${this.statistics.inputMethods.join(', ')}. Alternative inputs available: ${this.statistics.alternativeInputsAvailable.join(', ')}.`,
        wcagCriteria: ['2.1.1'],
        confidence: 0.8,
        recommendation: 'Manual review required to verify all input alternatives are fully functional.',
        affectedInputMethods: []
      });
    }

    // Finding: Voice commands
    if (this.statistics.voiceCommandsAvailable) {
      this.findings.push({
        id: 'XR-VOICE',
        severity: 'info',
        title: 'Voice Commands Detected',
        description: 'Voice command support detected. Ensure voice commands are optional and keyboard alternatives are available for users who cannot use speech input.',
        wcagCriteria: ['2.1.1'],
        confidence: 0.7,
        recommendation: 'Voice commands should supplement, not replace, other input methods. Ensure keyboard alternatives exist.',
        affectedInputMethods: ['voice']
      });
    }

    // Finding: Depth cues
    if (this.statistics.depthCuesFound) {
      this.findings.push({
        id: 'XR-DEPTH',
        severity: 'info',
        title: 'Depth Cue Implementation Detected',
        description: 'Depth cue patterns detected. This is positive for stereoblind user accessibility. Manual review required to verify effectiveness.',
        wcagCriteria: ['1.4.1'],
        confidence: 0.65,
        recommendation: 'Verify depth cues provide sufficient information without relying on stereoscopic vision. Test with one eye closed.',
        affectedInputMethods: []
      });
    }
  }
}

export default XRAccessibilityAnalyzer;
