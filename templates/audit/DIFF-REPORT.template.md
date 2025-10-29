# Accessibility Audit Comparison Report
## {{APP_NAME}}

**Comparison Date:** {{COMPARISON_DATE}}
**Framework:** accessibility-standards-unity {{FRAMEWORK_VERSION}}

---

## Overview

This report compares two accessibility audits to track changes, improvements, and regressions.

**Status:** {{COMPARISON_STATUS}}

---

## Audit Comparison

### Audit 1 (Baseline)
- **Date:** {{AUDIT1_DATE}}
- **Compliance Score:** {{AUDIT1_COMPLIANCE_SCORE}}%
- **Compliance Level:** {{AUDIT1_COMPLIANCE_LEVEL}}
- **Total Findings:** {{AUDIT1_TOTAL_FINDINGS}}
  - Critical: {{AUDIT1_CRITICAL}}
  - High: {{AUDIT1_HIGH}}
  - Medium: {{AUDIT1_MEDIUM}}
  - Low: {{AUDIT1_LOW}}

### Audit 2 (Current)
- **Date:** {{AUDIT2_DATE}}
- **Compliance Score:** {{AUDIT2_COMPLIANCE_SCORE}}%
- **Compliance Level:** {{AUDIT2_COMPLIANCE_LEVEL}}
- **Total Findings:** {{AUDIT2_TOTAL_FINDINGS}}
  - Critical: {{AUDIT2_CRITICAL}}
  - High: {{AUDIT2_HIGH}}
  - Medium: {{AUDIT2_MEDIUM}}
  - Low: {{AUDIT2_LOW}}

---

## Summary of Changes

### Compliance Score
{{#if COMPLIANCE_SCORE_IMPROVED}}
✅ **Improved** by {{COMPLIANCE_SCORE_DELTA}}%

The compliance score increased from {{AUDIT1_COMPLIANCE_SCORE}}% to {{AUDIT2_COMPLIANCE_SCORE}}%, indicating overall accessibility improvements.
{{else}}{{#if COMPLIANCE_SCORE_DECLINED}}
❌ **Declined** by {{COMPLIANCE_SCORE_DELTA}}%

The compliance score decreased from {{AUDIT1_COMPLIANCE_SCORE}}% to {{AUDIT2_COMPLIANCE_SCORE}}%, indicating accessibility regressions.
{{else}}
➖ **Unchanged** at {{AUDIT2_COMPLIANCE_SCORE}}%

The compliance score remained the same between audits.
{{/if}}{{/if}}

### Total Findings
{{#if TOTAL_FINDINGS_REDUCED}}
✅ **Reduced** by {{TOTAL_FINDINGS_DELTA}} findings

Total findings decreased from {{AUDIT1_TOTAL_FINDINGS}} to {{AUDIT2_TOTAL_FINDINGS}}.
{{else}}{{#if TOTAL_FINDINGS_INCREASED}}
❌ **Increased** by {{TOTAL_FINDINGS_DELTA}} findings

Total findings increased from {{AUDIT1_TOTAL_FINDINGS}} to {{AUDIT2_TOTAL_FINDINGS}}.
{{else}}
➖ **Unchanged** at {{AUDIT2_TOTAL_FINDINGS}} findings
{{/if}}{{/if}}

### Critical Issues
{{#if CRITICAL_REDUCED}}
✅ **Reduced** from {{AUDIT1_CRITICAL}} to {{AUDIT2_CRITICAL}} ({{CRITICAL_DELTA}})

Excellent progress! Critical accessibility issues have been resolved.
{{else}}{{#if CRITICAL_INCREASED}}
❌ **Increased** from {{AUDIT1_CRITICAL}} to {{AUDIT2_CRITICAL}} (+{{CRITICAL_DELTA}})

**⚠️  WARNING:** New critical accessibility issues have been introduced.
{{else}}
➖ **Unchanged** at {{AUDIT2_CRITICAL}} critical issues
{{/if}}{{/if}}

### High-Priority Issues
{{#if HIGH_REDUCED}}
✅ **Reduced** from {{AUDIT1_HIGH}} to {{AUDIT2_HIGH}} ({{HIGH_DELTA}})
{{else}}{{#if HIGH_INCREASED}}
❌ **Increased** from {{AUDIT1_HIGH}} to {{AUDIT2_HIGH}} (+{{HIGH_DELTA}})
{{else}}
➖ **Unchanged** at {{AUDIT2_HIGH}} high-priority issues
{{/if}}{{/if}}

### WCAG Compliance
{{#if WCAG_A_CHANGED}}
- **WCAG Level A:** {{AUDIT1_WCAG_A}} → {{AUDIT2_WCAG_A}}
{{else}}
- **WCAG Level A:** {{AUDIT2_WCAG_A}}
{{/if}}

{{#if WCAG_AA_CHANGED}}
- **WCAG Level AA:** {{AUDIT1_WCAG_AA}} → {{AUDIT2_WCAG_AA}}
{{else}}
- **WCAG Level AA:** {{AUDIT2_WCAG_AA}}
{{/if}}

---

## Detailed Changes

### 🆕 New Issues ({{NEW_ISSUES_TOTAL}})

{{#if NEW_ISSUES_TOTAL}}
The following accessibility issues were introduced since the baseline audit:

{{#if NEW_CRITICAL_COUNT}}
#### Critical Issues ({{NEW_CRITICAL_COUNT}})
{{#each NEW_CRITICAL_ISSUES}}
- **{{id}}**: {{title}}
  - **Description:** {{description}}
  - **WCAG:** {{wcagCriteria}}
  - **Recommendation:** {{recommendation}}
{{/each}}
{{/if}}

{{#if NEW_HIGH_COUNT}}
#### High-Priority Issues ({{NEW_HIGH_COUNT}})
{{#each NEW_HIGH_ISSUES}}
- **{{id}}**: {{title}}
  - **Description:** {{description}}
  - **WCAG:** {{wcagCriteria}}
{{/each}}
{{/if}}

{{#if NEW_MEDIUM_COUNT}}
#### Medium-Priority Issues ({{NEW_MEDIUM_COUNT}})
{{#each NEW_MEDIUM_ISSUES}}
- **{{id}}**: {{title}}
{{/each}}
{{/if}}

{{#if NEW_LOW_COUNT}}
#### Low-Priority Issues ({{NEW_LOW_COUNT}})
{{#each NEW_LOW_ISSUES}}
- **{{id}}**: {{title}}
{{/each}}
{{/if}}

{{else}}
✅ **No new issues introduced**

Excellent! No new accessibility issues were introduced since the baseline.
{{/if}}

---

### ✅ Resolved Issues ({{RESOLVED_ISSUES_TOTAL}})

{{#if RESOLVED_ISSUES_TOTAL}}
The following accessibility issues were resolved since the baseline audit:

{{#if RESOLVED_CRITICAL_COUNT}}
#### Critical Issues ({{RESOLVED_CRITICAL_COUNT}})
{{#each RESOLVED_CRITICAL_ISSUES}}
- **{{id}}**: {{title}}
{{/each}}
{{/if}}

{{#if RESOLVED_HIGH_COUNT}}
#### High-Priority Issues ({{RESOLVED_HIGH_COUNT}})
{{#each RESOLVED_HIGH_ISSUES}}
- **{{id}}**: {{title}}
{{/each}}
{{/if}}

{{#if RESOLVED_MEDIUM_COUNT}}
#### Medium-Priority Issues ({{RESOLVED_MEDIUM_COUNT}})
{{#each RESOLVED_MEDIUM_ISSUES}}
- **{{id}}**: {{title}}
{{/each}}
{{/if}}

{{#if RESOLVED_LOW_COUNT}}
#### Low-Priority Issues ({{RESOLVED_LOW_COUNT}})
{{#each RESOLVED_LOW_ISSUES}}
- **{{id}}**: {{title}}
{{/each}}
{{/if}}

{{else}}
ℹ️  **No issues resolved**

No accessibility issues from the baseline were resolved in this audit.
{{/if}}

---

### 🔄 Unchanged Issues ({{UNCHANGED_ISSUES_TOTAL}})

{{#if UNCHANGED_ISSUES_TOTAL}}
The following issues remain from the baseline audit:

- Critical: {{UNCHANGED_CRITICAL_COUNT}}
- High: {{UNCHANGED_HIGH_COUNT}}
- Medium: {{UNCHANGED_MEDIUM_COUNT}}
- Low: {{UNCHANGED_LOW_COUNT}}

{{#if UNCHANGED_CRITICAL_COUNT}}
**Persistent Critical Issues:**
{{#each UNCHANGED_CRITICAL_IDS}}
- {{this}}
{{/each}}
{{/if}}

{{else}}
✅ **All baseline issues addressed**

Either new issues replaced old ones, or all issues were resolved.
{{/if}}

---

## Recommendations

{{#if COMPLIANCE_SCORE_IMPROVED}}
### ✅ Continue Current Approach

Your accessibility compliance is improving. Continue with:
- Regular accessibility audits
- Code reviews for accessibility
- Manual testing with assistive technologies
- Developer training on accessibility best practices

{{else}}{{#if COMPLIANCE_SCORE_DECLINED}}
### ⚠️  Address Regressions Immediately

**Action Items:**
1. Review all new critical issues and prioritize fixes
2. Identify what changed between audits that caused regressions
3. Update development process to prevent future regressions
4. Consider adding pre-commit accessibility checks
5. Schedule accessibility review before merging changes

{{else}}
### 🔄 Maintain Current Standards

Your compliance score is stable. To improve:
1. Focus on resolving {{UNCHANGED_CRITICAL_COUNT}} persistent critical issues
2. Review and fix {{UNCHANGED_HIGH_COUNT}} high-priority issues
3. Implement automated accessibility checks in CI/CD
4. Schedule regular manual testing sessions

{{/if}}{{/if}}

### Priority Actions

{{#if NEW_CRITICAL_COUNT}}
1. **🚨 URGENT:** Fix {{NEW_CRITICAL_COUNT}} new critical issues
{{/if}}

{{#if CRITICAL_INCREASED}}
2. **🚨 URGENT:** Investigate what caused {{CRITICAL_DELTA}} new critical issues
{{/if}}

{{#if UNCHANGED_CRITICAL_COUNT}}
3. **HIGH PRIORITY:** Address {{UNCHANGED_CRITICAL_COUNT}} persistent critical issues
{{/if}}

{{#if NEW_HIGH_COUNT}}
4. **HIGH PRIORITY:** Review {{NEW_HIGH_COUNT}} new high-priority issues
{{/if}}

{{#if UNCHANGED_HIGH_COUNT}}
5. **MEDIUM PRIORITY:** Work through {{UNCHANGED_HIGH_COUNT}} persistent high-priority issues
{{/if}}

---

## CI/CD Integration

### Recommended Exit Codes

Based on this comparison:

{{#if CRITICAL_INCREASED}}
- **Exit Code:** `1` (FAILURE)
- **Reason:** New critical issues introduced
- **Action:** Block deployment until fixed
{{else}}{{#if HIGH_INCREASED}}
- **Exit Code:** `2` (WARNING)
- **Reason:** New high-priority issues introduced
- **Action:** Allow deployment with warning, schedule fixes
{{else}}
- **Exit Code:** `0` (SUCCESS)
- **Reason:** No regressions detected
- **Action:** Proceed with deployment
{{/if}}{{/if}}

### GitHub Actions Configuration

```yaml
- name: Run Accessibility Audit
  run: node bin/audit.js . --baseline --fail-on-regression

- name: Compare with Baseline
  if: always()
  run: |
    node bin/compare-audits.js \\
      compliance-history/baseline.json \\
      AccessibilityAudit/accessibility-analysis.json \\
      --output diff-report.json
```

---

## Next Steps

1. **Review this comparison report** with your team
2. **Address new critical issues** ({{NEW_CRITICAL_COUNT}}) immediately
3. **Update baseline** if improvements are permanent:
   ```bash
   node bin/audit.js . --baseline
   ```
4. **Schedule next audit** for {{NEXT_AUDIT_DATE}}
5. **Update compliance-history/** with this audit snapshot

---

## Resources

- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [Component Recommendations](./COMPONENT-RECOMMENDATIONS.md)
- [Manual Review Guide](../docs/MANUAL-REVIEW-GUIDE.md)
- [Compliance History](../compliance-history/)

---

**Generated by:** accessibility-standards-unity v{{FRAMEWORK_VERSION}}
**Comparison Tool:** compare-audits.js
**Report Date:** {{COMPARISON_DATE}}
