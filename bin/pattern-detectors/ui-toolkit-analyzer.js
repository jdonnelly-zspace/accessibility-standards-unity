/**
 * UI Toolkit (UIElements) Accessibility Analyzer
 *
 * Analyzes Unity UI Toolkit (UIElements) usage for accessibility compliance.
 * Parses .uxml files for UI structure, .uss files for styling, and C# scripts
 * for UIElements manipulation. Validates focusability, tab order, labels, and
 * ARIA-like role semantics.
 *
 * @module ui-toolkit-analyzer
 */

import fs from 'fs';
import path from 'path';

// ============================================================================
// UI TOOLKIT PATTERNS
// ============================================================================

const UITOOLKIT_PATTERNS = {
  // UIElements usage in C# scripts
  codeUsage: {
    patterns: [
      /using\s+UnityEngine\.UIElements/g,
      /VisualElement/g,
      /Button\s*\(/g,
      /TextField\s*\(/g,
      /Label\s*\(/g,
      /Toggle\s*\(/g,
      /Slider\s*\(/g,
      /\.focusable\s*=/g,
      /\.tabIndex\s*=/g,
      /\.RegisterCallback</g,
      /\.Q<[^>]+>/g, // Query selectors
      /\.Query<[^>]+>/g
    ],
    confidence: 0.9,
    description: 'UI Toolkit code usage'
  },

  // Focusability patterns
  focusability: {
    patterns: [
      /\.focusable\s*=\s*true/g,
      /focusable="true"/g,
      /focusable\s*:\s*true/g,
      /SetFocusable\s*\(\s*true\s*\)/g,
      /Focus\s*\(\s*\)/g,
      /Blur\s*\(\s*\)/g
    ],
    confidence: 0.8,
    description: 'Focusability configuration'
  },

  // Tab order configuration
  tabOrder: {
    patterns: [
      /tabIndex\s*=/g,
      /tab-index\s*:/g,
      /tabindex=/g,
      /SetTabIndex/g
    ],
    confidence: 0.7,
    description: 'Tab order configuration'
  },

  // Label associations
  labels: {
    patterns: [
      /<Label[^>]*>/g,
      /new\s+Label\s*\(/g,
      /\.label\s*=/g,
      /label\s*:\s*["'][^"']+["']/g,
      /\btext\s*=\s*["'][^"']+["']/g
    ],
    confidence: 0.6,
    description: 'Label elements and properties'
  },

  // Accessibility-specific APIs
  accessibilityApis: {
    patterns: [
      /RegisterCallback.*FocusInEvent/g,
      /RegisterCallback.*FocusOutEvent/g,
      /RegisterCallback.*NavigationEvent/g,
      /SetEnabled\s*\(/g,
      /pickingMode\s*=/g
    ],
    confidence: 0.8,
    description: 'UI Toolkit accessibility APIs'
  }
};

// Common UI Toolkit accessibility issues
const ACCESSIBILITY_ISSUES = {
  genericLabels: ['Button', 'Label', 'Text', 'Element', 'Container', 'Panel'],
  emptyLabels: ['', ' ', '  '],
  nonFocusableInteractive: ['Button', 'TextField', 'Toggle', 'Slider', 'DropdownField']
};

// ============================================================================
// UI TOOLKIT ANALYZER CLASS
// ============================================================================

export class UIToolkitAnalyzer {
  constructor(projectPath, scripts) {
    this.projectPath = projectPath;
    this.scripts = scripts;
    this.findings = [];
    this.statistics = {
      uiToolkitUsed: false,
      uxmlFilesFound: 0,
      ussFilesFound: 0,
      focusableElementsFound: false,
      tabOrderConfigured: false,
      labelsFound: false,
      accessibilityApisUsed: false,
      uxmlFiles: [],
      ussFiles: [],
      confidenceScore: 0
    };
  }

  /**
   * Main analysis entry point
   */
  analyze() {
    console.log('🎨 Analyzing UI Toolkit accessibility patterns...');

    // Detect UI Toolkit usage in scripts
    this.detectUIToolkitUsage();

    // Find and parse .uxml files
    this.analyzeUXMLFiles();

    // Find and parse .uss files
    this.analyzeUSSFiles();

    // Generate findings
    this.generateFindings();

    console.log(`   UI Toolkit used: ${this.statistics.uiToolkitUsed ? '✅' : '❌'}`);
    if (this.statistics.uiToolkitUsed) {
      console.log(`   UXML files: ${this.statistics.uxmlFilesFound}`);
      console.log(`   USS files: ${this.statistics.ussFilesFound}`);
      console.log(`   Confidence: ${(this.statistics.confidenceScore * 100).toFixed(1)}%`);
    }

    return {
      statistics: this.statistics,
      findings: this.findings
    };
  }

  /**
   * Detect UI Toolkit usage in C# scripts
   */
  detectUIToolkitUsage() {
    const detections = [];

    this.scripts.forEach(script => {
      let hasUIToolkit = false;
      const patterns = {};

      for (const [category, config] of Object.entries(UITOOLKIT_PATTERNS)) {
        const matches = this.findPatternMatches(script, config.patterns);

        if (matches.length > 0) {
          hasUIToolkit = true;
          patterns[category] = {
            matches: matches.length,
            confidence: config.confidence,
            description: config.description
          };

          // Update statistics
          if (category === 'focusability') {
            this.statistics.focusableElementsFound = true;
          } else if (category === 'tabOrder') {
            this.statistics.tabOrderConfigured = true;
          } else if (category === 'labels') {
            this.statistics.labelsFound = true;
          } else if (category === 'accessibilityApis') {
            this.statistics.accessibilityApisUsed = true;
          }
        }
      }

      if (hasUIToolkit) {
        detections.push({
          script: script,
          patterns: patterns
        });
      }
    });

    this.statistics.uiToolkitUsed = detections.length > 0;
    this.uiToolkitDetections = detections;
  }

  /**
   * Find and analyze .uxml files
   */
  analyzeUXMLFiles() {
    const assetsPath = path.join(this.projectPath, 'Assets');

    if (!fs.existsSync(assetsPath)) {
      return;
    }

    const uxmlFiles = this.findFilesRecursive(assetsPath, '.uxml');
    this.statistics.uxmlFilesFound = uxmlFiles.length;

    uxmlFiles.forEach(filePath => {
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const relativePath = path.relative(this.projectPath, filePath);

        const analysis = this.analyzeUXMLContent(content, relativePath);
        this.statistics.uxmlFiles.push(analysis);

      } catch (error) {
        console.warn(`   ⚠️  Failed to parse ${filePath}: ${error.message}`);
      }
    });
  }

  /**
   * Analyze UXML file content for accessibility issues
   */
  analyzeUXMLContent(content, filePath) {
    const issues = [];

    // Check for elements without focusable attribute
    const interactiveElements = this.extractInteractiveElements(content);
    interactiveElements.forEach(element => {
      if (!element.attributes.focusable && ACCESSIBILITY_ISSUES.nonFocusableInteractive.includes(element.type)) {
        issues.push({
          type: 'missing-focusable',
          severity: 'medium',
          element: element.type,
          line: element.line,
          message: `Interactive element <${element.type}> may need focusable="true" attribute`
        });
      }
    });

    // Check for elements without tab-index
    const focusableCount = interactiveElements.filter(e => e.attributes.focusable).length;
    const tabIndexCount = interactiveElements.filter(e => e.attributes['tab-index']).length;

    if (focusableCount > 1 && tabIndexCount === 0) {
      issues.push({
        type: 'missing-tab-order',
        severity: 'medium',
        message: `${focusableCount} focusable elements found but no tab-index defined`,
        line: null
      });
    }

    // Check for labels
    const labels = this.extractLabels(content);
    labels.forEach(label => {
      if (ACCESSIBILITY_ISSUES.genericLabels.includes(label.text)) {
        issues.push({
          type: 'generic-label',
          severity: 'low',
          text: label.text,
          line: label.line,
          message: `Generic label text: "${label.text}". Use descriptive labels.`
        });
      }

      if (ACCESSIBILITY_ISSUES.emptyLabels.includes(label.text)) {
        issues.push({
          type: 'empty-label',
          severity: 'high',
          line: label.line,
          message: 'Empty label text. Labels should describe their associated controls.'
        });
      }
    });

    return {
      path: filePath,
      elementCount: interactiveElements.length,
      focusableElements: focusableCount,
      tabIndexDefined: tabIndexCount > 0,
      labelCount: labels.length,
      issues: issues
    };
  }

  /**
   * Extract interactive elements from UXML
   */
  extractInteractiveElements(content) {
    const elements = [];
    const lines = content.split('\n');

    const interactiveTypes = ['Button', 'TextField', 'Toggle', 'Slider', 'DropdownField', 'RadioButton'];
    const elementRegex = /<(ui:)?([A-Z][a-zA-Z]+)([^>]*)>/g;

    lines.forEach((line, index) => {
      let match;
      while ((match = elementRegex.exec(line)) !== null) {
        const elementType = match[2];
        const attributes = match[3];

        if (interactiveTypes.includes(elementType)) {
          elements.push({
            type: elementType,
            line: index + 1,
            attributes: {
              focusable: /focusable\s*=\s*["']true["']/i.test(attributes),
              'tab-index': /tab-index\s*=\s*["']\d+["']/i.test(attributes)
            }
          });
        }
      }
    });

    return elements;
  }

  /**
   * Extract labels from UXML
   */
  extractLabels(content) {
    const labels = [];
    const lines = content.split('\n');

    const labelRegex = /<(ui:)?Label[^>]*text\s*=\s*["']([^"']*)["']/gi;
    const labelRegex2 = /<(ui:)?Label[^>]*>([^<]+)<\/(ui:)?Label>/gi;

    lines.forEach((line, index) => {
      let match;

      // Match: <Label text="something" />
      while ((match = labelRegex.exec(line)) !== null) {
        labels.push({
          text: match[2],
          line: index + 1
        });
      }

      // Reset regex
      labelRegex.lastIndex = 0;

      // Match: <Label>something</Label>
      while ((match = labelRegex2.exec(line)) !== null) {
        labels.push({
          text: match[2].trim(),
          line: index + 1
        });
      }

      // Reset regex
      labelRegex2.lastIndex = 0;
    });

    return labels;
  }

  /**
   * Find and analyze .uss files
   */
  analyzeUSSFiles() {
    const assetsPath = path.join(this.projectPath, 'Assets');

    if (!fs.existsSync(assetsPath)) {
      return;
    }

    const ussFiles = this.findFilesRecursive(assetsPath, '.uss');
    this.statistics.ussFilesFound = ussFiles.length;

    ussFiles.forEach(filePath => {
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const relativePath = path.relative(this.projectPath, filePath);

        const analysis = this.analyzeUSSContent(content, relativePath);
        this.statistics.ussFiles.push(analysis);

      } catch (error) {
        console.warn(`   ⚠️  Failed to parse ${filePath}: ${error.message}`);
      }
    });
  }

  /**
   * Analyze USS file content for accessibility issues
   */
  analyzeUSSContent(content, filePath) {
    const issues = [];

    // Check for focus-visible styling
    const hasFocusVisibleStyles = /:focus/.test(content) || /:hover/.test(content);

    if (!hasFocusVisibleStyles) {
      issues.push({
        type: 'no-focus-styles',
        severity: 'medium',
        message: 'No :focus pseudo-class styles found. Focus indicators may not be visible.'
      });
    }

    // Check for color-based information only (no text alternatives)
    // This is a simplistic check - could be improved
    const colorOnlyWarnings = [];
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      if (/background-color\s*:/.test(line) && !/border|outline/.test(line)) {
        // Relying only on color without border/outline could be an issue
        colorOnlyWarnings.push(index + 1);
      }
    });

    if (colorOnlyWarnings.length > 5) {
      issues.push({
        type: 'color-only-information',
        severity: 'low',
        message: `${colorOnlyWarnings.length} styles use background-color without border/outline. Ensure information isn't conveyed by color alone.`,
        lines: colorOnlyWarnings.slice(0, 5) // Report first 5
      });
    }

    return {
      path: filePath,
      hasFocusStyles: hasFocusVisibleStyles,
      issues: issues
    };
  }

  /**
   * Find files recursively
   */
  findFilesRecursive(dir, extension) {
    const files = [];

    const walk = (currentPath) => {
      if (!fs.existsSync(currentPath)) return;

      const entries = fs.readdirSync(currentPath);

      entries.forEach(entry => {
        const fullPath = path.join(currentPath, entry);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          walk(fullPath);
        } else if (path.extname(entry) === extension) {
          files.push(fullPath);
        }
      });
    };

    walk(dir);
    return files;
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
    if (!this.statistics.uiToolkitUsed) {
      // No findings if UI Toolkit isn't used
      return;
    }

    // Calculate confidence score
    let confidence = 0.5; // Base score if UI Toolkit is used
    if (this.statistics.focusableElementsFound) confidence += 0.15;
    if (this.statistics.tabOrderConfigured) confidence += 0.15;
    if (this.statistics.labelsFound) confidence += 0.1;
    if (this.statistics.accessibilityApisUsed) confidence += 0.1;

    this.statistics.confidenceScore = Math.min(1, confidence);

    // Finding: Focusability
    if (!this.statistics.focusableElementsFound) {
      this.findings.push({
        id: 'UIT-001',
        severity: 'high',
        title: 'UI Toolkit Elements May Not Be Focusable',
        description: 'Interactive UI Toolkit elements detected but no explicit focusable configuration found. Elements may not be keyboard accessible.',
        wcagCriteria: ['2.1.1', '2.4.3'],
        confidence: 0.7,
        recommendation: 'Set focusable="true" on interactive elements (Button, TextField, Toggle, etc.) in UXML or via C# code.',
        affectedFiles: this.statistics.uxmlFiles.map(f => f.path)
      });
    }

    // Finding: Tab order
    if (this.statistics.focusableElementsFound && !this.statistics.tabOrderConfigured) {
      this.findings.push({
        id: 'UIT-002',
        severity: 'medium',
        title: 'UI Toolkit Tab Order Not Configured',
        description: 'Focusable elements found but tab-index not configured. Tab navigation order may not match visual layout.',
        wcagCriteria: ['2.4.3'],
        confidence: 0.8,
        recommendation: 'Define tab-index attribute on focusable elements to control keyboard navigation order.',
        affectedFiles: this.statistics.uxmlFiles.filter(f => !f.tabIndexDefined).map(f => f.path)
      });
    }

    // Finding: Labels
    if (!this.statistics.labelsFound) {
      this.findings.push({
        id: 'UIT-003',
        severity: 'medium',
        title: 'Limited Label Usage in UI Toolkit',
        description: 'Limited or no Label elements found. Interactive controls may not have accessible names.',
        wcagCriteria: ['1.3.1', '4.1.2'],
        confidence: 0.6,
        recommendation: 'Associate Label elements with interactive controls to provide accessible names.',
        affectedFiles: []
      });
    }

    // Finding: Collect specific UXML issues
    const uxmlIssues = this.statistics.uxmlFiles.flatMap(f => f.issues);
    if (uxmlIssues.length > 0) {
      const criticalIssues = uxmlIssues.filter(i => i.severity === 'high');
      const mediumIssues = uxmlIssues.filter(i => i.severity === 'medium');

      if (criticalIssues.length > 0) {
        this.findings.push({
          id: 'UIT-004',
          severity: 'high',
          title: 'Critical UI Toolkit Accessibility Issues in UXML',
          description: `${criticalIssues.length} critical accessibility issues found in UXML files (empty labels, missing required attributes).`,
          wcagCriteria: ['1.3.1', '4.1.2'],
          confidence: 0.9,
          recommendation: 'Review and fix UXML accessibility issues. See component recommendations for details.',
          affectedFiles: [...new Set(criticalIssues.map(i => this.statistics.uxmlFiles.find(f => f.issues.includes(i))?.path))]
        });
      }

      if (mediumIssues.length > 5) {
        this.findings.push({
          id: 'UIT-005',
          severity: 'medium',
          title: 'Multiple UI Toolkit Accessibility Warnings',
          description: `${mediumIssues.length} accessibility warnings found in UXML files (missing focusable, tab order issues).`,
          wcagCriteria: ['2.1.1', '2.4.3'],
          confidence: 0.75,
          recommendation: 'Review UXML files for accessibility best practices. See component recommendations for details.',
          affectedFiles: [...new Set(mediumIssues.map(i => this.statistics.uxmlFiles.find(f => f.issues.includes(i))?.path))]
        });
      }
    }

    // Finding: USS focus styles
    const ussMissingFocus = this.statistics.ussFiles.filter(f => !f.hasFocusStyles);
    if (ussMissingFocus.length > 0) {
      this.findings.push({
        id: 'UIT-006',
        severity: 'medium',
        title: 'USS Stylesheets Missing Focus Indicators',
        description: `${ussMissingFocus.length} USS files do not define :focus pseudo-class styles. Focus indicators may not be visible.`,
        wcagCriteria: ['2.4.7'],
        confidence: 0.65,
        recommendation: 'Add :focus styles to USS files to ensure keyboard focus is visually indicated.',
        affectedFiles: ussMissingFocus.map(f => f.path)
      });
    }
  }
}

export default UIToolkitAnalyzer;
