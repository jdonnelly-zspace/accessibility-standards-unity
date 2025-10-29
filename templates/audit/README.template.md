# Accessibility Audit - {{APP_NAME}}

**Audit Date:** {{AUDIT_DATE}}
**Audited By:** accessibility-standards-unity Framework v{{FRAMEWORK_VERSION}}
**Standards:** WCAG 2.2 Level AA + W3C XAUR (XR Accessibility User Requirements - zSpace desktop stereoscopic 3D platform)

---

## 📋 Audit Documents

This directory contains a complete accessibility audit of the **{{APP_NAME}}** zSpace Unity application.

### 1. **AUDIT-SUMMARY.md** - START HERE
**Executive summary for stakeholders, managers, and team leads**

Contains:
- Overall compliance score: **{{COMPLIANCE_SCORE}}% ({{COMPLIANCE_LEVEL}})**
- {{CRITICAL_COUNT}} critical accessibility barriers identified
- WCAG 2.2 compliance status
- Risk assessment and remediation timeline

**Read this first to understand scope and impact.**

---

### 2. **VPAT-{{APP_NAME}}.md**
**Formal legal/compliance documentation (Voluntary Product Accessibility Template 2.5)**

Contains:
- All 50 WCAG 2.2 criteria (30 Level A + 20 Level AA) evaluated
- Conformance levels with detailed evidence
- Professional format suitable for:
  - Legal compliance reviews
  - Procurement processes (government/education contracts)
  - Section 508 audits
  - Customer accessibility statements

**Use this for:** Legal documentation, customer inquiries, procurement requirements

---

### 3. **ACCESSIBILITY-RECOMMENDATIONS.md** - FOR DEVELOPERS
**Implementation guide with prioritized fixes**

Contains:
- **{{TOTAL_FINDINGS}} prioritized recommendations**
- **Code examples** from accessibility-standards-unity framework
- **Step-by-step implementation guides**
- **Testing checklists** with validation steps
- **File locations** to modify

**Use this for:** Development planning, sprint planning, implementation

---

## 🚨 Critical Issues Summary

### Must Fix Immediately

{{#each CRITICAL_ISSUES}}
{{@index}}. **❌ {{title}}** ({{id}})
   - **Impact:** {{impact}}
   - **Fix:** {{recommendation}}

{{/each}}

---

## 📊 Current Compliance Status

| Standard | Status |
|----------|--------|
| **WCAG 2.2 Level A** | {{#if WCAG_LEVEL_A_PASS}}✅ Pass{{/if}}{{#if WCAG_LEVEL_A_PASS}}{{/if}}❌ Fail |
| **WCAG 2.2 Level AA** | {{#if WCAG_LEVEL_AA_PASS}}✅ Pass{{/if}}{{#if WCAG_LEVEL_AA_PASS}}{{/if}}❌ Fail |
| **Overall Compliance** | **{{COMPLIANCE_SCORE}}% ({{COMPLIANCE_LEVEL}})** |

**Findings:**
- 🔴 Critical Issues: {{CRITICAL_COUNT}}
- 🟠 High Priority: {{HIGH_COUNT}}
- 🟡 Medium Priority: {{MEDIUM_COUNT}}
- 🟢 Low Priority: {{LOW_COUNT}}

---

## 🚀 Quick Start for Developers

### Step 1: Copy Accessibility Framework Components
```bash
# From accessibility-standards-unity repo
cp -r /path/to/accessibility-standards-unity/implementation/unity/scripts/* \
      {{PROJECT_PATH}}/Assets/Scripts/Accessibility/

cp -r /path/to/accessibility-standards-unity/implementation/unity/editor/* \
      {{PROJECT_PATH}}/Assets/Editor/Accessibility/
```

### Step 2: Review Critical Issues
Open **ACCESSIBILITY-RECOMMENDATIONS.md** and start with Critical Priority items.

### Step 3: Run Validation
```bash
# Re-audit after fixes
node /path/to/accessibility-standards-unity/bin/audit.js {{PROJECT_PATH}}
```

---

## 📚 Additional Resources

### From accessibility-standards-unity Framework
- **Complete Checklist:** `/accessibility-standards-unity/standards/ZSPACE-ACCESSIBILITY-CHECKLIST.md`
- **Developer Workflow:** `/accessibility-standards-unity/workflows/DEVELOPER-WORKFLOW.md`
- **Ready-to-Use Components:** `/accessibility-standards-unity/implementation/unity/scripts/`

### External Resources
- **WCAG 2.2 Quick Reference:** https://www.w3.org/WAI/WCAG22/quickref/
- **W3C XAUR (XR Accessibility User Requirements):** https://www.w3.org/TR/xaur/
- **NVDA Screen Reader (Free):** https://www.nvaccess.org/
- **zSpace Developer Portal:** https://developer.zspace.com/

---

## 💡 Why This Matters

### Legal Compliance
- **Section 508 (US Federal):** Required for government/education software
- **ADA Title III (US):** Public accommodations (K-12 schools)
- **EN 301 549 (EU):** European accessibility standard

### Business Impact
- **Current:** Excludes {{STYLUS_ONLY_SCRIPTS_COUNT}}+ interaction points without alternatives
- **After fixes:** Reaches 100% of user base
- **ROI:** Increased market reach, reduced legal risk

---

## 📢 Sharing This Documentation

### For External Stakeholders (Procurement, Legal, Customers)

**⚠️ IMPORTANT:** Before sharing these documents externally, review the [External Communication Guide](https://github.com/jdonnelly-zspace/accessibility-standards-unity/docs/EXTERNAL-COMMUNICATION-GUIDE.md) for safe language patterns and legal considerations.

**Key Principles:**
- ✅ Be transparent about current status (share the audit results honestly)
- ✅ Show commitment to accessibility (framework usage demonstrates good faith)
- ⚠️ Qualify all statements (mention automated analysis limitations)
- ⚠️ Avoid specific dates (use "working toward" not "will achieve by")
- ✅ Provide accommodation contact (accessibility@zspace.com)

**Which Document to Share:**

| Audience | Recommended Document | Purpose |
|----------|---------------------|---------|
| Procurement Officers | VPAT-{{APP_NAME}}.md | RFP requirements, Section 508 compliance |
| Legal/Compliance Team | VPAT-{{APP_NAME}}.md | Risk assessment, regulatory review |
| Customers/Partners | AUDIT-SUMMARY.md | Transparency, current status |
| Internal Development | ACCESSIBILITY-RECOMMENDATIONS.md | Implementation guidance |
| Executives/Decision Makers | AUDIT-SUMMARY.md | Quick overview, business impact |

**Standard Disclaimer (Always Include When Sharing):**

```markdown
This accessibility audit was generated using automated code analysis. Results
reflect current status as of {{AUDIT_DATE}} and are subject to change.
Enhancement priorities and timelines depend on technical feasibility and
resource availability. For specific accommodation needs, contact
accessibility@zspace.com for individualized consultation.
```

---

## 🎯 Next Steps

### For Internal Teams

1. **Review AUDIT-SUMMARY.md** - Understand scope (15 minutes)
2. **Share VPAT report** - With legal/compliance team if needed (review communication guide first)
3. **Sprint Planning** - Use ACCESSIBILITY-RECOMMENDATIONS.md
4. **Install Framework** - Copy components to project
5. **Start Fixes** - Begin with critical issues
6. **Re-audit** - Track progress with periodic audits

### For External Communication

1. **Read External Communication Guide** - Understand safe language patterns
2. **Legal Review** - Get approval before sharing externally
3. **Customize Messaging** - Adapt to your specific context
4. **Provide Contact** - Include accommodation support email
5. **Update Regularly** - Keep documentation current

---

**Audit Generated By:** accessibility-standards-unity Framework v{{FRAMEWORK_VERSION}}
**Report Date:** {{AUDIT_DATE}}
**Project:** {{PROJECT_PATH}}
**Communication Guide:** [External Communication Best Practices](https://github.com/jdonnelly-zspace/accessibility-standards-unity/docs/EXTERNAL-COMMUNICATION-GUIDE.md)
