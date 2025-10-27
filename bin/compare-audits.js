/**
 * Audit Comparison Tool
 *
 * Compares two accessibility audit reports and generates diff reports showing:
 * - New issues introduced
 * - Resolved issues
 * - Changed compliance scores
 * - WCAG criteria status changes
 *
 * @module compare-audits
 */

import fs from 'fs';
import path from 'path';

// ============================================================================
// AUDIT COMPARER CLASS
// ============================================================================

export class AuditComparer {
  constructor(audit1Path, audit2Path) {
    this.audit1 = this.loadAudit(audit1Path);
    this.audit2 = this.loadAudit(audit2Path);
    this.audit1Path = audit1Path;
    this.audit2Path = audit2Path;
  }

  /**
   * Load audit report from file or snapshot
   */
  loadAudit(auditPath) {
    if (!fs.existsSync(auditPath)) {
      throw new Error(`Audit file not found: ${auditPath}`);
    }

    const data = JSON.parse(fs.readFileSync(auditPath, 'utf-8'));

    // If it's a snapshot, it has the simplified structure
    // If it's a full audit report, extract what we need
    if (data.findings && typeof data.findings.critical === 'number') {
      // It's a snapshot - load the full audit data if available
      return data;
    }

    // It's a full audit report - extract summary data
    return {
      timestamp: data.metadata?.scannedDate || new Date().toISOString(),
      projectName: data.metadata?.projectName || 'Unknown',
      complianceScore: data.complianceEstimate?.score || 0,
      complianceLevel: data.complianceEstimate?.level || 'Unknown',
      wcagLevelA: data.complianceEstimate?.wcagLevelA || false,
      wcagLevelAA: data.complianceEstimate?.wcagLevelAA || false,
      summary: data.summary || {},
      findings: {
        critical: data.findings?.critical?.length || 0,
        high: data.findings?.high?.length || 0,
        medium: data.findings?.medium?.length || 0,
        low: data.findings?.low?.length || 0,
        total: data.summary?.totalFindings || 0
      },
      findingIds: this.extractFindingIds(data),
      fullReport: data // Keep full report for detailed comparison
    };
  }

  /**
   * Extract finding IDs from audit report
   */
  extractFindingIds(auditData) {
    const ids = {
      critical: [],
      high: [],
      medium: [],
      low: []
    };

    if (auditData.findingIds) {
      // Already extracted
      return auditData.findingIds;
    }

    if (auditData.findings) {
      ['critical', 'high', 'medium', 'low'].forEach(severity => {
        if (Array.isArray(auditData.findings[severity])) {
          ids[severity] = auditData.findings[severity].map(f => f.id);
        }
      });
    }

    return ids;
  }

  /**
   * Compare two audits and generate diff
   */
  compare() {
    console.log('\n🔍 Comparing Audits:');
    console.log(`   Audit 1: ${this.audit1.timestamp || path.basename(this.audit1Path)}`);
    console.log(`   Audit 2: ${this.audit2.timestamp || path.basename(this.audit2Path)}`);

    const diff = {
      audit1: {
        timestamp: this.audit1.timestamp,
        complianceScore: this.audit1.complianceScore,
        findings: this.audit1.findings
      },
      audit2: {
        timestamp: this.audit2.timestamp,
        complianceScore: this.audit2.complianceScore,
        findings: this.audit2.findings
      },
      changes: {
        complianceScoreDelta: this.audit2.complianceScore - this.audit1.complianceScore,
        totalFindingsDelta: this.audit2.findings.total - this.audit1.findings.total,
        criticalDelta: this.audit2.findings.critical - this.audit1.findings.critical,
        highDelta: this.audit2.findings.high - this.audit1.findings.high,
        mediumDelta: this.audit2.findings.medium - this.audit1.findings.medium,
        lowDelta: this.audit2.findings.low - this.audit1.findings.low,
        wcagLevelAChanged: this.audit1.wcagLevelA !== this.audit2.wcagLevelA,
        wcagLevelAAChanged: this.audit1.wcagLevelAA !== this.audit2.wcagLevelAA
      },
      newIssues: this.findNewIssues(),
      resolvedIssues: this.findResolvedIssues(),
      unchangedIssues: this.findUnchangedIssues()
    };

    // Determine overall status
    diff.status = this.determineStatus(diff);

    return diff;
  }

  /**
   * Find new issues in audit2 that weren't in audit1
   */
  findNewIssues() {
    const newIssues = {
      critical: [],
      high: [],
      medium: [],
      low: [],
      total: 0
    };

    ['critical', 'high', 'medium', 'low'].forEach(severity => {
      const audit1Ids = this.audit1.findingIds[severity] || [];
      const audit2Ids = this.audit2.findingIds[severity] || [];

      const newIds = audit2Ids.filter(id => !audit1Ids.includes(id));
      newIssues[severity] = newIds;
      newIssues.total += newIds.length;

      // Try to get full finding details if available
      if (this.audit2.fullReport?.findings?.[severity]) {
        newIssues[`${severity}Details`] = this.audit2.fullReport.findings[severity]
          .filter(f => newIds.includes(f.id));
      }
    });

    return newIssues;
  }

  /**
   * Find resolved issues (in audit1 but not in audit2)
   */
  findResolvedIssues() {
    const resolvedIssues = {
      critical: [],
      high: [],
      medium: [],
      low: [],
      total: 0
    };

    ['critical', 'high', 'medium', 'low'].forEach(severity => {
      const audit1Ids = this.audit1.findingIds[severity] || [];
      const audit2Ids = this.audit2.findingIds[severity] || [];

      const resolvedIds = audit1Ids.filter(id => !audit2Ids.includes(id));
      resolvedIssues[severity] = resolvedIds;
      resolvedIssues.total += resolvedIds.length;

      // Try to get full finding details if available
      if (this.audit1.fullReport?.findings?.[severity]) {
        resolvedIssues[`${severity}Details`] = this.audit1.fullReport.findings[severity]
          .filter(f => resolvedIds.includes(f.id));
      }
    });

    return resolvedIssues;
  }

  /**
   * Find unchanged issues (present in both audits)
   */
  findUnchangedIssues() {
    const unchangedIssues = {
      critical: [],
      high: [],
      medium: [],
      low: [],
      total: 0
    };

    ['critical', 'high', 'medium', 'low'].forEach(severity => {
      const audit1Ids = this.audit1.findingIds[severity] || [];
      const audit2Ids = this.audit2.findingIds[severity] || [];

      const unchangedIds = audit1Ids.filter(id => audit2Ids.includes(id));
      unchangedIssues[severity] = unchangedIds;
      unchangedIssues.total += unchangedIds.length;
    });

    return unchangedIssues;
  }

  /**
   * Determine overall status (improved, declined, unchanged)
   */
  determineStatus(diff) {
    const scoreDelta = diff.changes.complianceScoreDelta;
    const criticalDelta = diff.changes.criticalDelta;
    const highDelta = diff.changes.highDelta;

    // Check for improvements
    const scoreImproved = scoreDelta > 0;
    const criticalReduced = criticalDelta < 0;
    const highReduced = highDelta < 0;

    // Check for declines
    const scoreDeclined = scoreDelta < 0;
    const criticalIncreased = criticalDelta > 0;
    const highIncreased = highDelta > 0;

    if ((scoreImproved || criticalReduced || highReduced) && !criticalIncreased && !highIncreased) {
      return 'improved';
    } else if ((scoreDeclined || criticalIncreased || highIncreased) && !criticalReduced && !highReduced) {
      return 'declined';
    } else if (scoreDelta === 0 && criticalDelta === 0 && highDelta === 0) {
      return 'unchanged';
    } else {
      return 'mixed';
    }
  }

  /**
   * Generate summary report
   */
  generateSummary(diff) {
    console.log('\n📊 Comparison Summary:');
    console.log(`   Status: ${this.formatStatus(diff.status)}`);
    console.log(`\n   Compliance Score: ${this.audit1.complianceScore}% → ${this.audit2.complianceScore}% (${this.formatDelta(diff.changes.complianceScoreDelta)}%)`);
    console.log(`   Total Findings: ${this.audit1.findings.total} → ${this.audit2.findings.total} (${this.formatDelta(diff.changes.totalFindingsDelta)})`);
    console.log(`\n   Critical Issues: ${this.audit1.findings.critical} → ${this.audit2.findings.critical} (${this.formatDelta(diff.changes.criticalDelta)})`);
    console.log(`   High Priority: ${this.audit1.findings.high} → ${this.audit2.findings.high} (${this.formatDelta(diff.changes.highDelta)})`);
    console.log(`   Medium Priority: ${this.audit1.findings.medium} → ${this.audit2.findings.medium} (${this.formatDelta(diff.changes.mediumDelta)})`);
    console.log(`   Low Priority: ${this.audit1.findings.low} → ${this.audit2.findings.low} (${this.formatDelta(diff.changes.lowDelta)})`);

    if (diff.newIssues.total > 0) {
      console.log(`\n   🆕 New Issues: ${diff.newIssues.total}`);
      if (diff.newIssues.critical.length > 0) {
        console.log(`      - Critical: ${diff.newIssues.critical.join(', ')}`);
      }
      if (diff.newIssues.high.length > 0) {
        console.log(`      - High: ${diff.newIssues.high.join(', ')}`);
      }
    }

    if (diff.resolvedIssues.total > 0) {
      console.log(`\n   ✅ Resolved Issues: ${diff.resolvedIssues.total}`);
      if (diff.resolvedIssues.critical.length > 0) {
        console.log(`      - Critical: ${diff.resolvedIssues.critical.join(', ')}`);
      }
      if (diff.resolvedIssues.high.length > 0) {
        console.log(`      - High: ${diff.resolvedIssues.high.join(', ')}`);
      }
    }

    if (diff.changes.wcagLevelAChanged) {
      console.log(`\n   WCAG Level A: ${this.audit1.wcagLevelA ? 'Pass' : 'Fail'} → ${this.audit2.wcagLevelA ? 'Pass' : 'Fail'}`);
    }

    if (diff.changes.wcagLevelAAChanged) {
      console.log(`   WCAG Level AA: ${this.audit1.wcagLevelAA ? 'Pass' : 'Fail'} → ${this.audit2.wcagLevelAA ? 'Pass' : 'Fail'}`);
    }

    return diff;
  }

  /**
   * Format status for display
   */
  formatStatus(status) {
    const statusMap = {
      improved: '✅ Improved',
      declined: '❌ Declined',
      unchanged: '➖ Unchanged',
      mixed: '⚠️  Mixed'
    };
    return statusMap[status] || status;
  }

  /**
   * Format delta for display
   */
  formatDelta(delta) {
    if (delta === 0) return '±0';
    if (delta > 0) return `+${delta}`;
    return `${delta}`;
  }

  /**
   * Save diff report to file
   */
  saveDiffReport(diff, outputPath) {
    fs.writeFileSync(outputPath, JSON.stringify(diff, null, 2));
    console.log(`\n✅ Diff report saved: ${outputPath}`);
    return outputPath;
  }
}

// ============================================================================
// CLI INTERFACE
// ============================================================================

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log(`
Usage:
  node compare-audits.js <audit1> <audit2> [options]

Arguments:
  <audit1>    Path to first audit report (older)
  <audit2>    Path to second audit report (newer)

Options:
  --output <path>    Output path for diff report JSON

Examples:
  # Compare two snapshots
  node compare-audits.js compliance-history/2025-10-26T10-00-00.json compliance-history/2025-10-27T10-00-00.json

  # Compare against baseline
  node compare-audits.js compliance-history/baseline.json AccessibilityAudit/accessibility-analysis.json
    `);
    process.exit(0);
  }

  const audit1Path = args[0];
  const audit2Path = args[1];
  const outputIndex = args.indexOf('--output');
  const outputPath = outputIndex >= 0 && args[outputIndex + 1]
    ? args[outputIndex + 1]
    : null;

  try {
    const comparer = new AuditComparer(audit1Path, audit2Path);
    const diff = comparer.compare();
    comparer.generateSummary(diff);

    if (outputPath) {
      comparer.saveDiffReport(diff, outputPath);
    }

    // Exit with status code based on result
    if (diff.status === 'declined') {
      console.log('\n⚠️  Accessibility declined - exiting with code 1');
      process.exit(1);
    } else {
      process.exit(0);
    }

  } catch (error) {
    console.error('❌ Comparison failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);

if (process.argv[1] === __filename) {
  main();
}

export { AuditComparer };
export default AuditComparer;
