/**
 * Language Validator
 * Validates accessibility documentation for legally safe language patterns
 * Detects unsafe patterns like specific dates, definitive commitments, and unqualified claims
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class LanguageValidator {
  constructor(configPath = null) {
    this.config = this.loadConfig(configPath);
    this.warnings = [];
    this.errors = [];
    this.info = [];
  }

  /**
   * Load language framework configuration
   */
  loadConfig(configPath) {
    const defaultConfigPath = path.join(__dirname, '../../config/language-framework.json');
    const targetPath = configPath || defaultConfigPath;

    try {
      if (fs.existsSync(targetPath)) {
        return JSON.parse(fs.readFileSync(targetPath, 'utf8'));
      }
    } catch (error) {
      console.warn(`⚠️  Could not load language framework config: ${error.message}`);
    }

    return null;
  }

  /**
   * Validate a document or text string
   * @param {string} text - Text to validate
   * @param {string} documentName - Name of document for reporting
   * @returns {object} Validation results
   */
  validate(text, documentName = 'Document') {
    if (!this.config) {
      return {
        success: false,
        message: 'Language framework configuration not loaded',
        warnings: [],
        errors: [],
        info: []
      };
    }

    // Reset for new validation
    this.warnings = [];
    this.errors = [];
    this.info = [];

    // Run validation checks
    this.checkUnsafePatterns(text, documentName);
    this.checkQualifiers(text, documentName);
    this.checkStatusIndicators(text, documentName);

    const hasErrors = this.errors.length > 0;
    const hasWarnings = this.warnings.length > 0;

    return {
      success: !hasErrors,
      documentName,
      warnings: this.warnings,
      errors: this.errors,
      info: this.info,
      summary: {
        errors: this.errors.length,
        warnings: this.warnings.length,
        info: this.info.length
      }
    };
  }

  /**
   * Check for unsafe language patterns (dates, commitments, etc.)
   */
  checkUnsafePatterns(text, documentName) {
    if (!this.config.validationRules || !this.config.validationRules.detectUnsafePatterns) {
      return;
    }

    const patterns = this.config.validationRules.detectUnsafePatterns;

    patterns.forEach((pattern, index) => {
      const regex = new RegExp(pattern, 'gi');
      let match;

      while ((match = regex.exec(text)) !== null) {
        const context = this.getContext(text, match.index, 100);
        const lineNumber = this.getLineNumber(text, match.index);

        // Determine the type of unsafe pattern
        let patternType = 'Unsafe pattern';
        let severity = 'warning';
        let suggestion = '';

        if (pattern.includes('20\\d{2}') || pattern.includes('Q[1-4]')) {
          patternType = 'Specific date/timeline detected';
          severity = 'error';
          suggestion = 'Use "Near-term priority", "Upcoming release", or "Actively working toward" instead of specific dates';
        } else if (pattern.includes('guarantee')) {
          patternType = 'Guarantee statement detected';
          severity = 'error';
          suggestion = 'Remove guarantee language. Use "working toward" or "aim to" instead';
        } else if (pattern.includes('will\\s+implement') || pattern.includes('100%\\s+compliant')) {
          patternType = 'Definitive commitment detected';
          severity = 'error';
          suggestion = 'Use "Under development", "Working toward", or "Pursuing conformance" instead';
        } else if (pattern.includes('all\\s+users\\s+will\\s+be\\s+able')) {
          patternType = 'Absolute claim detected';
          severity = 'error';
          suggestion = 'Qualify with "working to enable" or "expanding support for"';
        }

        const issue = {
          type: patternType,
          severity,
          pattern: match[0],
          location: `Line ${lineNumber}`,
          context,
          suggestion
        };

        if (severity === 'error') {
          this.errors.push(issue);
        } else {
          this.warnings.push(issue);
        }
      }
    });
  }

  /**
   * Check that claims have appropriate qualifiers
   */
  checkQualifiers(text, documentName) {
    if (!this.config.validationRules || !this.config.validationRules.requireQualifiers) {
      return;
    }

    const qualifierTerms = this.config.validationRules.requireQualifiers;
    const qualifyingPhrases = [
      'varies by',
      'depends on',
      'may vary',
      'subject to change',
      'under development',
      'in progress',
      'working toward',
      'planned',
      'exploring',
      'evaluating',
      'some contexts',
      'partial support'
    ];

    qualifierTerms.forEach(term => {
      // Look for unqualified claims
      const termRegex = new RegExp(`\\b${term}\\b`, 'gi');
      let match;

      while ((match = termRegex.exec(text)) !== null) {
        const context = this.getContext(text, match.index, 150);
        const lineNumber = this.getLineNumber(text, match.index);

        // Check if there's a qualifier nearby (within 150 characters)
        const hasQualifier = qualifyingPhrases.some(phrase =>
          context.toLowerCase().includes(phrase.toLowerCase())
        );

        if (!hasQualifier) {
          this.warnings.push({
            type: 'Unqualified claim',
            severity: 'warning',
            pattern: match[0],
            location: `Line ${lineNumber}`,
            context,
            suggestion: `Consider adding a qualifier like "varies by module", "under development", or "working toward" near "${match[0]}"`
          });
        }
      }
    });
  }

  /**
   * Check for proper use of status indicators
   */
  checkStatusIndicators(text, documentName) {
    const indicators = ['✅', '🔄', '📋', '⚠️', '❌'];

    indicators.forEach(indicator => {
      const regex = new RegExp(`\\${indicator}[^\\n]{0,200}`, 'g');
      let match;

      while ((match = regex.exec(text)) !== null) {
        const context = match[0];
        const lineNumber = this.getLineNumber(text, match.index);

        // Check if ✅ (Available Now) has appropriate qualifiers
        if (indicator === '✅') {
          const hasQualifier = /varies|depends|may|partial|some|limited|select/i.test(context);

          if (!hasQualifier && !/not applicable|not required|^✅\s*\*\*/i.test(context)) {
            this.info.push({
              type: 'Status indicator usage',
              severity: 'info',
              pattern: indicator,
              location: `Line ${lineNumber}`,
              context: context.substring(0, 100),
              suggestion: 'Consider adding context like "varies by module" or "partial support" when using ✅'
            });
          }
        }
      }
    });
  }

  /**
   * Validate multiple documents at once
   * @param {object} documents - Object with documentName: text pairs
   * @returns {object} Combined validation results
   */
  validateMultiple(documents) {
    const results = {};
    const allWarnings = [];
    const allErrors = [];
    const allInfo = [];

    Object.keys(documents).forEach(docName => {
      const result = this.validate(documents[docName], docName);
      results[docName] = result;
      allWarnings.push(...result.warnings.map(w => ({ ...w, document: docName })));
      allErrors.push(...result.errors.map(e => ({ ...e, document: docName })));
      allInfo.push(...result.info.map(i => ({ ...i, document: docName })));
    });

    return {
      documents: results,
      combined: {
        warnings: allWarnings,
        errors: allErrors,
        info: allInfo,
        summary: {
          totalErrors: allErrors.length,
          totalWarnings: allWarnings.length,
          totalInfo: allInfo.length,
          documentsValidated: Object.keys(documents).length
        }
      }
    };
  }

  /**
   * Generate a formatted validation report
   * @param {object} validationResults - Results from validate() or validateMultiple()
   * @returns {string} Formatted report
   */
  generateReport(validationResults) {
    let report = [];

    report.push('╔═══════════════════════════════════════════════════════════╗');
    report.push('║  Language Validation Report                              ║');
    report.push('╚═══════════════════════════════════════════════════════════╝');
    report.push('');

    // Handle both single and multiple document results
    const isCombined = validationResults.combined !== undefined;
    const summary = isCombined ? validationResults.combined.summary : validationResults.summary;
    const errors = isCombined ? validationResults.combined.errors : validationResults.errors;
    const warnings = isCombined ? validationResults.combined.warnings : validationResults.warnings;
    const info = isCombined ? validationResults.combined.info : validationResults.info;

    // Summary
    report.push('## Summary');
    report.push('');
    if (isCombined) {
      report.push(`📄 Documents Validated: ${summary.documentsValidated}`);
    }
    report.push(`🔴 Errors:   ${summary.errors || summary.totalErrors || 0}`);
    report.push(`🟡 Warnings: ${summary.warnings || summary.totalWarnings || 0}`);
    report.push(`ℹ️  Info:     ${summary.info || summary.totalInfo || 0}`);
    report.push('');

    // Overall status
    const totalErrors = summary.errors || summary.totalErrors || 0;
    const totalWarnings = summary.warnings || summary.totalWarnings || 0;

    if (totalErrors === 0 && totalWarnings === 0) {
      report.push('✅ **PASS** - No language issues detected');
    } else if (totalErrors > 0) {
      report.push('❌ **FAIL** - Critical language issues found that require legal review');
    } else {
      report.push('⚠️  **CAUTION** - Minor language issues found for review');
    }
    report.push('');
    report.push('---');
    report.push('');

    // Errors
    if (errors && errors.length > 0) {
      report.push('## 🔴 Errors (Require Legal Review)');
      report.push('');
      errors.forEach((error, index) => {
        report.push(`### Error ${index + 1}: ${error.type}`);
        if (error.document) {
          report.push(`**Document:** ${error.document}`);
        }
        report.push(`**Location:** ${error.location}`);
        report.push(`**Pattern Found:** "${error.pattern}"`);
        report.push(`**Context:** ...${error.context}...`);
        report.push(`**Suggestion:** ${error.suggestion}`);
        report.push('');
      });
      report.push('---');
      report.push('');
    }

    // Warnings
    if (warnings && warnings.length > 0) {
      report.push('## 🟡 Warnings (Recommended Changes)');
      report.push('');
      warnings.forEach((warning, index) => {
        report.push(`### Warning ${index + 1}: ${warning.type}`);
        if (warning.document) {
          report.push(`**Document:** ${warning.document}`);
        }
        report.push(`**Location:** ${warning.location}`);
        report.push(`**Pattern Found:** "${warning.pattern}"`);
        report.push(`**Context:** ...${warning.context}...`);
        report.push(`**Suggestion:** ${warning.suggestion}`);
        report.push('');
      });
      report.push('---');
      report.push('');
    }

    // Info
    if (info && info.length > 0 && info.length <= 10) { // Only show first 10 info items
      report.push('## ℹ️  Informational Notes');
      report.push('');
      info.slice(0, 10).forEach((item, index) => {
        report.push(`${index + 1}. **${item.type}** (${item.location}): ${item.suggestion}`);
      });
      if (info.length > 10) {
        report.push(`... and ${info.length - 10} more`);
      }
      report.push('');
    }

    report.push('---');
    report.push('');
    report.push('**Validation Framework:** language-framework.json');
    report.push('**Generated:** ' + new Date().toISOString().split('T')[0]);

    return report.join('\n');
  }

  /**
   * Get context around a match
   */
  getContext(text, index, length = 100) {
    const start = Math.max(0, index - length / 2);
    const end = Math.min(text.length, index + length / 2);
    let context = text.substring(start, end);

    // Clean up
    context = context.replace(/\s+/g, ' ').trim();

    return context;
  }

  /**
   * Get line number for a character index
   */
  getLineNumber(text, index) {
    return text.substring(0, index).split('\n').length;
  }
}

// Export
export default LanguageValidator;

// CLI usage
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  const validator = new LanguageValidator();

  if (process.argv.length < 3) {
    console.log('Usage: node language-validator.js <file-path>');
    console.log('Example: node language-validator.js path/to/document.md');
    process.exit(1);
  }

  const filePath = process.argv[2];

  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found: ${filePath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath);
  const result = validator.validate(content, fileName);
  const report = validator.generateReport(result);

  console.log(report);

  // Exit with error code if validation failed
  process.exit(result.success ? 0 : 1);
}
