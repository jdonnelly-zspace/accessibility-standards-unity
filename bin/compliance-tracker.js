/**
 * Compliance Tracker
 *
 * Manages baseline tracking, historical audit snapshots, and compliance trends.
 * Stores audit results in compliance-history/ directory for comparison over time.
 *
 * @module compliance-tracker
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// COMPLIANCE TRACKER CLASS
// ============================================================================

export class ComplianceTracker {
  constructor(projectPath, options = {}) {
    this.projectPath = path.resolve(projectPath);
    this.historyDir = path.join(this.projectPath, 'compliance-history');
    this.baselinePath = path.join(this.historyDir, 'baseline.json');
    this.trendsPath = path.join(this.historyDir, 'trends.json');
    this.options = options;
  }

  /**
   * Initialize compliance history directory
   */
  initialize() {
    if (!fs.existsSync(this.historyDir)) {
      fs.mkdirSync(this.historyDir, { recursive: true });
      console.log(`✅ Created compliance-history/ directory`);
    }

    if (!fs.existsSync(this.trendsPath)) {
      const initialTrends = {
        audits: [],
        metrics: {
          totalAudits: 0,
          firstAudit: null,
          lastAudit: null,
          averageComplianceScore: 0,
          complianceScoreTrend: null, // 'improving', 'declining', 'stable'
          criticalIssuesTrend: null
        }
      };
      fs.writeFileSync(this.trendsPath, JSON.stringify(initialTrends, null, 2));
      console.log(`✅ Created trends.json`);
    }
  }

  /**
   * Create baseline from current audit report
   */
  createBaseline(auditReport) {
    this.initialize();

    const baseline = {
      createdDate: new Date().toISOString(),
      projectName: path.basename(this.projectPath),
      complianceScore: auditReport.complianceEstimate.score,
      complianceLevel: auditReport.complianceEstimate.level,
      wcagLevelA: auditReport.complianceEstimate.wcagLevelA,
      wcagLevelAA: auditReport.complianceEstimate.wcagLevelAA,
      summary: auditReport.summary,
      findings: {
        critical: auditReport.findings.critical.length,
        high: auditReport.findings.high.length,
        medium: auditReport.findings.medium.length,
        low: auditReport.findings.low.length,
        total: auditReport.summary.totalFindings
      },
      findingIds: this.extractFindingIds(auditReport),
      statistics: auditReport.statistics,
      version: auditReport.metadata.version
    };

    fs.writeFileSync(this.baselinePath, JSON.stringify(baseline, null, 2));
    console.log(`\n✅ Baseline created: ${this.baselinePath}`);
    console.log(`   Compliance Score: ${baseline.complianceScore}%`);
    console.log(`   Total Findings: ${baseline.findings.total}`);
    console.log(`   Critical: ${baseline.findings.critical}, High: ${baseline.findings.high}`);

    return baseline;
  }

  /**
   * Save current audit as snapshot
   */
  saveSnapshot(auditReport) {
    this.initialize();

    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const snapshotPath = path.join(this.historyDir, `${timestamp}.json`);

    const snapshot = {
      timestamp: new Date().toISOString(),
      projectName: path.basename(this.projectPath),
      complianceScore: auditReport.complianceEstimate.score,
      complianceLevel: auditReport.complianceEstimate.level,
      wcagLevelA: auditReport.complianceEstimate.wcagLevelA,
      wcagLevelAA: auditReport.complianceEstimate.wcagLevelAA,
      summary: auditReport.summary,
      findings: {
        critical: auditReport.findings.critical.length,
        high: auditReport.findings.high.length,
        medium: auditReport.findings.medium.length,
        low: auditReport.findings.low.length,
        total: auditReport.summary.totalFindings
      },
      findingIds: this.extractFindingIds(auditReport),
      statistics: auditReport.statistics,
      version: auditReport.metadata.version
    };

    fs.writeFileSync(snapshotPath, JSON.stringify(snapshot, null, 2));
    console.log(`\n✅ Snapshot saved: ${path.basename(snapshotPath)}`);

    // Update trends
    this.updateTrends(snapshot);

    return snapshot;
  }

  /**
   * Extract finding IDs from audit report
   */
  extractFindingIds(auditReport) {
    const ids = {
      critical: [],
      high: [],
      medium: [],
      low: []
    };

    ['critical', 'high', 'medium', 'low'].forEach(severity => {
      if (auditReport.findings[severity]) {
        ids[severity] = auditReport.findings[severity].map(f => f.id);
      }
    });

    return ids;
  }

  /**
   * Update trends with new snapshot
   */
  updateTrends(snapshot) {
    let trends = JSON.parse(fs.readFileSync(this.trendsPath, 'utf-8'));

    // Add snapshot summary to audits array
    trends.audits.push({
      timestamp: snapshot.timestamp,
      complianceScore: snapshot.complianceScore,
      complianceLevel: snapshot.complianceLevel,
      totalFindings: snapshot.findings.total,
      criticalIssues: snapshot.findings.critical,
      highIssues: snapshot.findings.high
    });

    // Update metrics
    trends.metrics.totalAudits = trends.audits.length;
    trends.metrics.firstAudit = trends.audits[0].timestamp;
    trends.metrics.lastAudit = snapshot.timestamp;

    // Calculate average compliance score
    const avgScore = trends.audits.reduce((sum, a) => sum + a.complianceScore, 0) / trends.audits.length;
    trends.metrics.averageComplianceScore = Math.round(avgScore * 10) / 10;

    // Determine compliance trend (comparing last 3 audits)
    if (trends.audits.length >= 3) {
      const recent = trends.audits.slice(-3);
      const scores = recent.map(a => a.complianceScore);
      const isImproving = scores[2] > scores[1] && scores[1] > scores[0];
      const isDeclining = scores[2] < scores[1] && scores[1] < scores[0];

      if (isImproving) {
        trends.metrics.complianceScoreTrend = 'improving';
      } else if (isDeclining) {
        trends.metrics.complianceScoreTrend = 'declining';
      } else {
        trends.metrics.complianceScoreTrend = 'stable';
      }

      // Critical issues trend
      const criticalCounts = recent.map(a => a.criticalIssues);
      const criticalImproving = criticalCounts[2] < criticalCounts[1] && criticalCounts[1] < criticalCounts[0];
      const criticalDeclining = criticalCounts[2] > criticalCounts[1] && criticalCounts[1] > criticalCounts[0];

      if (criticalImproving) {
        trends.metrics.criticalIssuesTrend = 'improving';
      } else if (criticalDeclining) {
        trends.metrics.criticalIssuesTrend = 'declining';
      } else {
        trends.metrics.criticalIssuesTrend = 'stable';
      }
    }

    fs.writeFileSync(this.trendsPath, JSON.stringify(trends, null, 2));
  }

  /**
   * Load baseline
   */
  loadBaseline() {
    if (!fs.existsSync(this.baselinePath)) {
      return null;
    }

    return JSON.parse(fs.readFileSync(this.baselinePath, 'utf-8'));
  }

  /**
   * Load latest snapshot
   */
  loadLatestSnapshot() {
    if (!fs.existsSync(this.historyDir)) {
      return null;
    }

    const files = fs.readdirSync(this.historyDir)
      .filter(f => f.match(/^\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}\.json$/))
      .sort()
      .reverse();

    if (files.length === 0) {
      return null;
    }

    const latestPath = path.join(this.historyDir, files[0]);
    return JSON.parse(fs.readFileSync(latestPath, 'utf-8'));
  }

  /**
   * Load all snapshots
   */
  loadAllSnapshots() {
    if (!fs.existsSync(this.historyDir)) {
      return [];
    }

    const files = fs.readdirSync(this.historyDir)
      .filter(f => f.match(/^\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}\.json$/))
      .sort();

    return files.map(file => {
      const filePath = path.join(this.historyDir, file);
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    });
  }

  /**
   * Load trends
   */
  loadTrends() {
    if (!fs.existsSync(this.trendsPath)) {
      return null;
    }

    return JSON.parse(fs.readFileSync(this.trendsPath, 'utf-8'));
  }

  /**
   * Check for regressions against baseline
   */
  checkRegression(currentAudit) {
    const baseline = this.loadBaseline();

    if (!baseline) {
      console.log('⚠️  No baseline found. Create baseline first with --baseline flag.');
      return {
        hasRegression: false,
        reason: 'no-baseline'
      };
    }

    const current = {
      complianceScore: currentAudit.complianceEstimate.score,
      critical: currentAudit.findings.critical.length,
      high: currentAudit.findings.high.length,
      total: currentAudit.summary.totalFindings
    };

    console.log('\n📊 Regression Check vs. Baseline:');
    console.log(`   Baseline: ${baseline.complianceScore}% (${baseline.findings.critical} critical)`);
    console.log(`   Current:  ${current.complianceScore}% (${current.critical} critical)`);

    // Check for regressions
    const regressions = [];

    if (current.complianceScore < baseline.complianceScore) {
      const delta = baseline.complianceScore - current.complianceScore;
      regressions.push(`Compliance score decreased by ${delta}%`);
    }

    if (current.critical > baseline.findings.critical) {
      const delta = current.critical - baseline.findings.critical;
      regressions.push(`${delta} new critical issues`);
    }

    if (current.high > baseline.findings.high) {
      const delta = current.high - baseline.findings.high;
      regressions.push(`${delta} new high-priority issues`);
    }

    // Detect new findings
    const currentIds = this.extractFindingIds(currentAudit);
    const newCriticalIds = currentIds.critical.filter(id => !baseline.findingIds.critical.includes(id));
    const newHighIds = currentIds.high.filter(id => !baseline.findingIds.high.includes(id));

    if (newCriticalIds.length > 0) {
      regressions.push(`New critical findings: ${newCriticalIds.join(', ')}`);
    }

    if (newHighIds.length > 0 && this.options.failOnHighIssues) {
      regressions.push(`New high-priority findings: ${newHighIds.join(', ')}`);
    }

    if (regressions.length > 0) {
      console.log('\n❌ REGRESSION DETECTED:');
      regressions.forEach(r => console.log(`   - ${r}`));
      return {
        hasRegression: true,
        regressions: regressions,
        baseline: baseline,
        current: current
      };
    } else {
      console.log('\n✅ No regressions detected');
      return {
        hasRegression: false,
        baseline: baseline,
        current: current
      };
    }
  }

  /**
   * Get exit code for CI/CD
   */
  getExitCode(regressionCheck) {
    if (!regressionCheck.hasRegression) {
      return 0; // Success
    }

    // Check if regressions include critical issues
    const hasCriticalRegression = regressionCheck.regressions.some(r =>
      r.includes('critical') || r.includes('Compliance score decreased')
    );

    if (hasCriticalRegression) {
      return 1; // Failure (critical regression)
    }

    // High-priority issues only
    return 2; // Warning
  }

  /**
   * Export historical data to CSV
   */
  exportToCSV() {
    const snapshots = this.loadAllSnapshots();

    if (snapshots.length === 0) {
      console.log('⚠️  No snapshots to export');
      return null;
    }

    // CSV header
    let csv = 'Timestamp,Compliance Score,Compliance Level,Total Findings,Critical,High,Medium,Low,WCAG Level A,WCAG Level AA\n';

    // CSV rows
    snapshots.forEach(snapshot => {
      csv += `${snapshot.timestamp},`;
      csv += `${snapshot.complianceScore},`;
      csv += `${snapshot.complianceLevel},`;
      csv += `${snapshot.findings.total},`;
      csv += `${snapshot.findings.critical},`;
      csv += `${snapshot.findings.high},`;
      csv += `${snapshot.findings.medium},`;
      csv += `${snapshot.findings.low},`;
      csv += `${snapshot.wcagLevelA ? 'Pass' : 'Fail'},`;
      csv += `${snapshot.wcagLevelAA ? 'Pass' : 'Fail'}\n`;
    });

    const csvPath = path.join(this.historyDir, 'compliance-history.csv');
    fs.writeFileSync(csvPath, csv);
    console.log(`\n✅ Exported to CSV: ${csvPath}`);

    return csvPath;
  }
}

export default ComplianceTracker;
