/**
 * Keyboard Accessibility Pattern Analyzer
 *
 * Advanced C# pattern detection for keyboard input support in Unity projects.
 * Detects Input API usage, InputSystem patterns, EventSystem configuration,
 * and provides confidence-scored findings with file:line references.
 *
 * @module keyboard-analyzer
 */

import fs from 'fs';
import path from 'path';

// ============================================================================
// PATTERN DEFINITIONS
// ============================================================================

const KEYBOARD_PATTERNS = {
  // Legacy Unity Input class patterns
  legacyInput: {
    patterns: [
      /Input\.GetKey\s*\(/g,
      /Input\.GetKeyDown\s*\(/g,
      /Input\.GetKeyUp\s*\(/g,
      /KeyCode\./g,
      /Input\.GetAxis\s*\(\s*["']Horizontal["']\s*\)/g,
      /Input\.GetAxis\s*\(\s*["']Vertical["']\s*\)/g,
      /Input\.GetButton\s*\(/g,
      /Input\.GetButtonDown\s*\(/g,
      /Input\.GetButtonUp\s*\(/g
    ],
    confidence: 0.8, // High confidence for explicit keyboard input
    description: 'Legacy Unity Input API keyboard support'
  },

  // New Unity Input System patterns
  inputSystem: {
    patterns: [
      /using\s+UnityEngine\.InputSystem/g,
      /InputAction/g,
      /PlayerInput/g,
      /InputActionAsset/g,
      /InputActionMap/g,
      /Keyboard\.current/g,
      /actions\s*\[\s*["'][^"']+["']\s*\]/g, // actions["Move"]
      /\.ReadValue\s*</g,
      /\.triggered/g,
      /\.performed/g,
      /\.canceled/g
    ],
    confidence: 0.9, // Very high confidence for new Input System
    description: 'Unity Input System keyboard support'
  },

  // EventSystem keyboard navigation
  eventSystem: {
    patterns: [
      /using\s+UnityEngine\.EventSystems/g,
      /EventSystem\.current/g,
      /SetSelectedGameObject\s*\(/g,
      /BaseInputModule/g,
      /StandaloneInputModule/g,
      /ExecuteEvents/g,
      /IPointerEnterHandler/g,
      /IPointerExitHandler/g,
      /IPointerClickHandler/g,
      /ISelectHandler/g,
      /IDeselectHandler/g,
      /ISubmitHandler/g,
      /ICancelHandler/g,
      /IMoveHandler/g
    ],
    confidence: 0.7, // Medium-high confidence (EventSystem can be mouse-only)
    description: 'EventSystem keyboard navigation support'
  },

  // Focus management patterns
  focusManagement: {
    patterns: [
      /\bfocus\b.*\bmanage/gi,
      /\btab\s+order\b/gi,
      /\bfocusable\b/gi,
      /Selectable/g,
      /Navigation\./g,
      /\.Select\s*\(\s*\)/g,
      /FindSelectableOn(Left|Right|Up|Down)/g,
      /firstSelectedGameObject/g
    ],
    confidence: 0.6, // Medium confidence (could be mouse-focused)
    description: 'Focus management implementation'
  },

  // Tab/arrow key navigation implementation
  navigationKeys: {
    patterns: [
      /KeyCode\.Tab/g,
      /KeyCode\.(Left|Right|Up|Down)Arrow/g,
      /KeyCode\.Return/g,
      /KeyCode\.Escape/g,
      /Input\.GetKeyDown\s*\(\s*KeyCode\.Tab/g,
      /\bTab\b.*\bnav/gi,
      /arrow.*key.*nav/gi
    ],
    confidence: 0.9, // Very high confidence for explicit nav keys
    description: 'Tab/arrow key navigation implementation'
  }
};

// Negative patterns (reduce confidence if found)
const NEGATIVE_PATTERNS = {
  stylusOnly: {
    patterns: [
      /stylus.*only/gi,
      /ZPointer.*required/gi,
      /pointer.*required/gi,
      /\/\/.*keyboard.*not.*supported/gi,
      /\/\/.*no.*keyboard/gi
    ],
    confidencePenalty: 0.3,
    description: 'Stylus-only or pointer-required comments'
  },

  noKeyboardFallback: {
    patterns: [
      /Touch\..*&&\s*!.*Input\.GetKey/g, // Touch without keyboard fallback
      /Mouse\..*&&\s*!.*Input\.GetKey/g   // Mouse without keyboard fallback
    ],
    confidencePenalty: 0.2,
    description: 'Pointer input without keyboard fallback'
  }
};

// ============================================================================
// KEYBOARD ANALYZER CLASS
// ============================================================================

export class KeyboardAnalyzer {
  constructor(scripts) {
    this.scripts = scripts; // Array of {name, path, fullPath, content, lines}
    this.findings = [];
    this.statistics = {
      keyboardSupportFound: false,
      inputSystemUsed: null, // 'legacy', 'new', 'both', or null
      eventSystemConfigured: false,
      focusManagementFound: false,
      navigationKeysImplemented: false,
      scriptsWithKeyboardSupport: [],
      scriptsWithoutKeyboardSupport: [],
      confidenceScore: 0 // Overall confidence (0-1)
    };
  }

  /**
   * Main analysis entry point
   */
  analyze() {
    console.log('⌨️  Analyzing keyboard accessibility patterns...');

    // Detect all keyboard patterns
    this.detectKeyboardPatterns();

    // Analyze input system usage
    this.analyzeInputSystemUsage();

    // Detect stylus-only patterns
    this.detectStylusOnlyPatterns();

    // Calculate overall confidence
    this.calculateConfidenceScore();

    // Generate findings
    this.generateFindings();

    console.log(`   Confidence: ${(this.statistics.confidenceScore * 100).toFixed(1)}%`);
    console.log(`   Keyboard support: ${this.statistics.keyboardSupportFound ? '✅' : '❌'}`);

    return {
      statistics: this.statistics,
      findings: this.findings
    };
  }

  /**
   * Detect keyboard patterns in scripts
   */
  detectKeyboardPatterns() {
    const detections = [];

    this.scripts.forEach(script => {
      const scriptDetections = {
        script: script,
        patterns: {},
        totalConfidence: 0,
        lineReferences: []
      };

      // Check each pattern category
      for (const [category, config] of Object.entries(KEYBOARD_PATTERNS)) {
        const matches = this.findPatternMatches(script, config.patterns);

        if (matches.length > 0) {
          scriptDetections.patterns[category] = {
            matches: matches.length,
            confidence: config.confidence,
            description: config.description,
            lineNumbers: matches.map(m => m.lineNumber)
          };

          scriptDetections.totalConfidence += config.confidence;
        }
      }

      // Check negative patterns (reduce confidence)
      for (const [category, config] of Object.entries(NEGATIVE_PATTERNS)) {
        const matches = this.findPatternMatches(script, config.patterns);

        if (matches.length > 0) {
          scriptDetections.patterns[`negative_${category}`] = {
            matches: matches.length,
            confidencePenalty: config.confidencePenalty,
            description: config.description,
            lineNumbers: matches.map(m => m.lineNumber)
          };

          scriptDetections.totalConfidence -= config.confidencePenalty;
        }
      }

      // Normalize confidence (0-1 range)
      scriptDetections.totalConfidence = Math.max(0, Math.min(1, scriptDetections.totalConfidence));

      if (scriptDetections.totalConfidence > 0) {
        detections.push(scriptDetections);
      }
    });

    this.keyboardDetections = detections;

    // Update statistics
    this.statistics.scriptsWithKeyboardSupport = detections
      .filter(d => d.totalConfidence >= 0.5)
      .map(d => ({
        name: d.script.name,
        path: d.script.path,
        confidence: d.totalConfidence,
        patterns: Object.keys(d.patterns).filter(k => !k.startsWith('negative_'))
      }));

    this.statistics.keyboardSupportFound = this.statistics.scriptsWithKeyboardSupport.length > 0;
  }

  /**
   * Find pattern matches in script with line numbers
   */
  findPatternMatches(script, patterns) {
    const matches = [];
    const lines = script.content.split('\n');

    patterns.forEach(pattern => {
      lines.forEach((line, index) => {
        const lineMatches = line.match(pattern);
        if (lineMatches) {
          matches.push({
            lineNumber: index + 1,
            lineContent: line.trim(),
            pattern: pattern.source || pattern,
            matchCount: lineMatches.length
          });
        }
      });
    });

    return matches;
  }

  /**
   * Analyze which input system is used
   */
  analyzeInputSystemUsage() {
    let legacyCount = 0;
    let newSystemCount = 0;

    this.keyboardDetections.forEach(detection => {
      if (detection.patterns.legacyInput) legacyCount++;
      if (detection.patterns.inputSystem) newSystemCount++;
      if (detection.patterns.eventSystem) {
        this.statistics.eventSystemConfigured = true;
      }
      if (detection.patterns.focusManagement) {
        this.statistics.focusManagementFound = true;
      }
      if (detection.patterns.navigationKeys) {
        this.statistics.navigationKeysImplemented = true;
      }
    });

    if (legacyCount > 0 && newSystemCount > 0) {
      this.statistics.inputSystemUsed = 'both';
    } else if (newSystemCount > 0) {
      this.statistics.inputSystemUsed = 'new';
    } else if (legacyCount > 0) {
      this.statistics.inputSystemUsed = 'legacy';
    } else {
      this.statistics.inputSystemUsed = null;
    }
  }

  /**
   * Detect scripts that are stylus/pointer-only
   */
  detectStylusOnlyPatterns() {
    const stylusOnlyScripts = [];

    this.scripts.forEach(script => {
      const hasStylusInput = /stylus|ZPointer|zSpace\.Core/i.test(script.content);
      const hasMouseInput = /Input\.mouse|GetMouseButton|OnMouseDown/i.test(script.content);
      const hasTouchInput = /Touch\.|TouchPhase|Input\.touchCount/i.test(script.content);

      const hasKeyboardInput = this.statistics.scriptsWithKeyboardSupport.some(
        s => s.name === script.name
      );

      if ((hasStylusInput || hasMouseInput || hasTouchInput) && !hasKeyboardInput) {
        stylusOnlyScripts.push({
          name: script.name,
          path: script.path,
          inputType: hasStylusInput ? 'stylus' : (hasMouseInput ? 'mouse' : 'touch')
        });
      }
    });

    this.statistics.scriptsWithoutKeyboardSupport = stylusOnlyScripts;
  }

  /**
   * Calculate overall confidence score
   */
  calculateConfidenceScore() {
    if (this.keyboardDetections.length === 0) {
      this.statistics.confidenceScore = 0;
      return;
    }

    // Average confidence across all detections
    const avgConfidence = this.keyboardDetections.reduce(
      (sum, d) => sum + d.totalConfidence, 0
    ) / this.keyboardDetections.length;

    // Boost confidence if multiple systems are used correctly
    let boost = 0;
    if (this.statistics.eventSystemConfigured) boost += 0.1;
    if (this.statistics.focusManagementFound) boost += 0.1;
    if (this.statistics.navigationKeysImplemented) boost += 0.1;

    // Penalty if many scripts lack keyboard support
    const totalScripts = this.scripts.length;
    const keyboardScripts = this.statistics.scriptsWithKeyboardSupport.length;
    const coverage = totalScripts > 0 ? keyboardScripts / totalScripts : 0;

    // Combine factors
    this.statistics.confidenceScore = Math.min(1, avgConfidence + boost * coverage);
  }

  /**
   * Generate findings for audit report
   */
  generateFindings() {
    // Finding: Keyboard support status
    if (!this.statistics.keyboardSupportFound) {
      this.findings.push({
        id: 'KBD-001',
        severity: 'critical',
        title: 'No Keyboard Input Patterns Detected',
        description: 'No keyboard input handling code patterns were detected in the codebase. Users who cannot use pointing devices will be unable to access functionality.',
        wcagCriteria: ['2.1.1', '2.1.2'],
        confidence: 0.95,
        recommendation: 'Implement keyboard alternatives for all pointer-based interactions using Unity Input API or Input System.',
        affectedScripts: []
      });
    } else if (this.statistics.scriptsWithoutKeyboardSupport.length > 0) {
      this.findings.push({
        id: 'KBD-002',
        severity: 'high',
        title: 'Pointer-Only Scripts Without Keyboard Alternatives',
        description: `${this.statistics.scriptsWithoutKeyboardSupport.length} scripts use pointer/stylus input without keyboard alternatives. This prevents keyboard-only users from accessing functionality.`,
        wcagCriteria: ['2.1.1'],
        confidence: 0.85,
        recommendation: 'Add keyboard input handling to all interactive scripts.',
        affectedScripts: this.statistics.scriptsWithoutKeyboardSupport.map(s => ({
          path: s.path,
          inputType: s.inputType
        }))
      });
    }

    // Finding: Input system usage
    if (this.statistics.inputSystemUsed === 'both') {
      this.findings.push({
        id: 'KBD-003',
        severity: 'low',
        title: 'Mixed Input System Usage',
        description: 'Project uses both legacy Input class and new Input System. Consider standardizing on one system for consistency.',
        wcagCriteria: [],
        confidence: 1.0,
        recommendation: 'Migrate all input handling to the new Unity Input System for better maintainability.',
        affectedScripts: []
      });
    }

    // Finding: Focus management
    if (this.statistics.eventSystemConfigured && !this.statistics.focusManagementFound) {
      this.findings.push({
        id: 'KBD-004',
        severity: 'medium',
        title: 'EventSystem Present But Limited Focus Management',
        description: 'EventSystem is configured but explicit focus management code is limited. Tab navigation may not work as expected.',
        wcagCriteria: ['2.4.3', '2.4.7'],
        confidence: 0.7,
        recommendation: 'Implement explicit focus management with Navigation component configuration and SetSelectedGameObject calls.',
        affectedScripts: []
      });
    }

    // Finding: Navigation keys
    if (this.statistics.keyboardSupportFound && !this.statistics.navigationKeysImplemented) {
      this.findings.push({
        id: 'KBD-005',
        severity: 'medium',
        title: 'Keyboard Input Present But No Navigation Keys Detected',
        description: 'Keyboard input code exists but Tab/Arrow key navigation patterns not found. Users may not be able to navigate the UI with keyboard.',
        wcagCriteria: ['2.4.3'],
        confidence: 0.6,
        recommendation: 'Implement Tab and Arrow key navigation for UI elements using EventSystem or custom input handling.',
        affectedScripts: []
      });
    }
  }
}

export default KeyboardAnalyzer;
