# Claude Code Prompt Engineering Guide
## Accessibility Auditing Workflows

**Document Version:** 1.0
**Date:** 2025-10-20
**For:** accessibility-standards-unity Framework v2.2.0

---

## Overview

This guide provides best practices for using Claude Code to audit zSpace Unity applications for accessibility compliance. It covers the `/audit-zspace` slash command and manual prompting strategies.

---

## Quick Start: Using the `/audit-zspace` Slash Command

### The Easiest Way to Audit

Simply run:
```
/audit-zspace /path/to/unity-project
```

Claude Code will:
1. Run the automated audit script
2. Parse the generated reports
3. Summarize findings with severity levels
4. Guide you through remediation steps

**When to use:** First-time audits, quick compliance checks, stakeholder reports

---

## Manual Prompting: Advanced Workflows

### Workflow 1: Comprehensive Accessibility Audit

**Use Case:** You need a full audit with detailed analysis and recommendations.

**Prompt Template:**
```
I need a comprehensive accessibility audit of my zSpace Unity application.

Project path: [/path/to/unity/project]

Please:
1. Run the accessibility audit using bin/audit.js
2. Analyze all generated reports
3. Summarize critical issues with WCAG criteria
4. Provide prioritized remediation steps
5. Suggest specific framework components to implement

Focus on WCAG 2.2 Level AA compliance and W3C XAUR requirements for stereoscopic 3D.
```

**Expected Outcome:**
- Complete audit execution
- Detailed findings summary
- Implementation roadmap with timeline
- Code examples from framework

---

### Workflow 2: Targeted Issue Investigation

**Use Case:** You want to investigate a specific accessibility concern.

**Prompt Template:**
```
Investigate [specific accessibility issue] in my zSpace Unity application.

Project path: [/path/to/unity/project]
Issue area: [keyboard navigation / depth perception / screen readers / focus indicators]

Please:
1. Run the audit focusing on [issue area]
2. Identify all violations related to [WCAG criterion]
3. Show me affected scripts and scenes
4. Provide code examples to fix the issues
```

**Example:**
```
Investigate keyboard accessibility in my zSpace Unity application.

Project path: /Users/dev/CareerExplorer
Issue area: keyboard navigation

Please:
1. Run the audit focusing on keyboard support
2. Identify all violations related to WCAG 2.1.1 (Keyboard)
3. Show me affected scripts that are stylus-only
4. Provide KeyboardStylusAlternative.cs integration examples
```

**Expected Outcome:**
- Focused analysis on one issue type
- List of affected files with line numbers
- Ready-to-use code snippets
- Testing checklist

---

### Workflow 3: Compliance Report for Stakeholders

**Use Case:** You need a professional report for legal, management, or clients.

**Prompt Template:**
```
Generate an executive accessibility compliance report for my zSpace application.

Project path: [/path/to/unity/project]
Audience: [Legal team / Management / Client]

Please:
1. Run the accessibility audit
2. Create a summary highlighting:
   - Overall compliance score and level
   - WCAG 2.2 Level A/AA status
   - Critical legal risks (Section 508, ADA, EN 301 549)
   - Estimated remediation timeline
   - Business impact (user exclusion percentage)
3. Format for presentation (bullet points, clear sections)

Focus on business impact and legal compliance, not technical details.
```

**Expected Outcome:**
- Executive summary (1-2 pages)
- Compliance scores and legal status
- Risk assessment
- Timeline and budget estimates
- VPAT reference for procurement

---

### Workflow 4: Incremental Improvement Tracking

**Use Case:** You're fixing issues iteratively and want to track progress.

**Prompt Template:**
```
Re-audit my zSpace application and compare to previous results.

Project path: [/path/to/unity/project]
Previous audit: [date or commit hash]

Please:
1. Run a new accessibility audit
2. Compare findings to previous audit
3. Show improvements (issues fixed)
4. Identify remaining violations
5. Calculate compliance score change
6. Suggest next priorities
```

**Expected Outcome:**
- Before/after comparison
- Delta report (fixed issues, new issues, remaining issues)
- Updated compliance score
- Next sprint recommendations

---

### Workflow 5: Framework Component Integration

**Use Case:** You want to implement specific accessibility components.

**Prompt Template:**
```
Help me integrate [component name] from the accessibility-standards-unity framework.

Project: [/path/to/unity/project]
Component: [KeyboardStylusAlternative / DepthCueManager / ZSpaceFocusIndicator / etc.]

Please:
1. Show me the component source code
2. Explain how it works and what it fixes
3. Provide step-by-step integration instructions
4. Give me test cases to validate it works
5. Show before/after WCAG compliance impact
```

**Example:**
```
Help me integrate DepthCueManager from the accessibility-standards-unity framework.

Project: /Users/dev/MedicalTraining
Component: DepthCueManager

Please:
1. Show me the DepthCueManager.cs source code
2. Explain how it provides depth cues for users with stereoblindness
3. Provide step-by-step integration instructions
4. Give me test cases (try without 3D glasses)
5. Show before/after WCAG compliance impact (W3C XAUR UN17)
```

**Expected Outcome:**
- Component source code with annotations
- Integration checklist
- Testing procedure
- WCAG criteria satisfied
- Example configurations

---

## Best Practices

### ✅ Do This

1. **Always specify the Unity project path**
   - Absolute paths work best: `/Users/dev/MyProject`
   - Avoid relative paths unless you're in the framework repo

2. **Use the automated audit first**
   - Don't manually analyze code files yourself
   - Trust the detection patterns in the audit script
   - Let Claude run `node bin/audit.js` for accurate results

3. **Reference specific WCAG criteria**
   - Use standard notation: WCAG 2.1.1, WCAG 4.1.2, W3C XAUR UN17
   - This helps Claude provide precise remediation guidance

4. **Ask for code examples from the framework**
   - The framework has 10+ ready-to-use components
   - Request integration examples, not generic solutions

5. **Specify your audience**
   - Technical (developers) vs. non-technical (stakeholders)
   - This affects the detail level and jargon used

6. **Request prioritization**
   - "Critical issues first"
   - "WCAG Level A compliance baseline"
   - "Quick wins vs. long-term improvements"

### ❌ Avoid This

1. **Don't skip the automated audit**
   - ❌ "Manually check if my code is accessible"
   - ✅ "Run bin/audit.js and analyze the results"

2. **Don't ask for custom audit scripts**
   - ❌ "Write a script to check my Unity project"
   - ✅ "Use the existing audit.js script"

3. **Don't request generic accessibility advice**
   - ❌ "Tell me about Unity accessibility best practices"
   - ✅ "What specific WCAG violations does my project have?"

4. **Don't ignore generated reports**
   - The VPAT, AUDIT-SUMMARY, and RECOMMENDATIONS files are production-ready
   - Use them as-is for stakeholders

5. **Don't re-invent framework components**
   - ❌ "Help me write a keyboard alternative system"
   - ✅ "Help me integrate KeyboardStylusAlternative.cs"

---

## Prompt Templates by Role

### For Developers

```
Audit my zSpace Unity app and give me a technical implementation plan.

Project: [path]
Sprint length: [2 weeks / 4 weeks]
Team size: [1-2 devs / 3-5 devs]

I need:
- Audit results with file locations
- Prioritized task list for [sprint length]
- Code examples for top 3 issues
- Testing checklist
- Estimated hours per fix
```

### For QA/Testers

```
Generate accessibility test cases for my zSpace application.

Project: [path]
Testing focus: [keyboard / screen readers / depth perception / all]

I need:
- Test scenarios based on audit findings
- Pass/fail criteria
- Manual testing steps
- Tools needed (NVDA, etc.)
- Expected behavior descriptions
```

### For Managers/PMs

```
Provide a project plan for accessibility remediation.

Project: [path]
Timeline: [weeks available]
Budget: [hours available]

I need:
- Executive summary of current compliance
- Estimated effort (hours) by priority
- Milestone recommendations
- Risk assessment
- ROI/business case
```

### For Legal/Compliance

```
Generate a VPAT 2.5 compliance report for procurement.

Project: [path]
Use case: [Government contract / Education / Corporate sale]

I need:
- Official VPAT document
- WCAG 2.2 Level A/AA conformance levels
- Section 508 compliance status
- Known limitations documented
- Remediation timeline
```

---

## Common Q&A Prompts

### "What accessibility issues does my app have?"

**Full prompt:**
```
Run an accessibility audit on my zSpace Unity project and list all issues by severity.

Project: [path]

Show me:
1. Critical violations (WCAG Level A failures)
2. High priority (WCAG Level AA failures)
3. Medium/low priority enhancements
4. For each issue: title, WCAG criterion, impact, affected files
```

### "How do I fix [specific issue]?"

**Full prompt:**
```
How do I fix [issue name] in my zSpace Unity application?

Issue: [e.g., "No Keyboard Alternatives for Stylus Interactions"]
WCAG Criterion: [e.g., WCAG 2.1.1]

Please:
1. Explain the violation
2. Show me which framework component solves it
3. Provide integration code
4. Give me a test case
```

### "Is my app legally compliant?"

**Full prompt:**
```
Evaluate legal compliance status for my zSpace application.

Project: [path]
Jurisdiction: [US Section 508 / ADA / EU EN 301 549]

I need:
1. Current WCAG 2.2 compliance level
2. Legal risks and violations
3. VPAT report for procurement
4. Remediation requirements for compliance
```

### "What should I fix first?"

**Full prompt:**
```
Prioritize accessibility fixes for my zSpace application.

Project: [path]
Available time: [2 weeks / 1 month / 1 quarter]
Resources: [1 developer / small team / large team]

Recommend:
1. Quick wins (high impact, low effort)
2. Critical blockers (WCAG Level A)
3. Long-term improvements (WCAG Level AA)
4. Estimated effort for each
```

---

## Advanced Techniques

### Multi-Project Comparison

```
Compare accessibility compliance across multiple zSpace applications.

Projects:
- App A: [path]
- App B: [path]
- App C: [path]

Show me:
1. Compliance scores for each
2. Common violations across all apps
3. Best practices found in any app
4. Unified remediation strategy
```

### Automated CI/CD Integration

```
Help me set up automated accessibility auditing in our CI/CD pipeline.

Project: [path]
CI tool: [GitHub Actions / GitLab CI / Jenkins]

I need:
1. Example workflow file
2. Audit script integration
3. Pass/fail thresholds
4. Report artifact generation
5. Slack/email notifications
```

### Custom Checklist Generation

```
Create a custom accessibility checklist for our team based on this project.

Project: [path]
Team level: [Beginner / Intermediate / Advanced]

Generate:
1. Project-specific checklist (based on audit)
2. General zSpace accessibility checklist
3. Code review checklist
4. QA testing checklist
5. All in markdown format for our wiki
```

---

## Troubleshooting Prompts

### Audit Script Errors

```
The accessibility audit is failing with an error.

Project: [path]
Error message: [paste error]

Please:
1. Diagnose the issue
2. Check Unity project structure
3. Verify Node.js setup
4. Provide fix steps
```

### Understanding Confusing Results

```
I don't understand why the audit flagged [specific finding].

Finding: [paste finding text]
WCAG criterion: [X.X.X]

Please explain:
1. What this violation means in plain English
2. Why it's a problem for users
3. How to fix it
4. How to test the fix
```

### Framework Component Issues

```
I integrated [component name] but it's not working.

Component: [name]
Issue: [describe what's not working]
Unity version: [version]

Please help:
1. Verify integration steps
2. Check for common mistakes
3. Debug the issue
4. Provide corrected implementation
```

---

## Token Optimization Tips

### Efficient Prompts
- ✅ "Audit /path/to/project" (concise)
- ❌ "I would like you to please run an accessibility audit on my Unity project located at /path/to/project" (verbose)

### Reuse Context
- Reference previous audit results: "Based on the previous audit from [date]..."
- Don't re-run audits unnecessarily

### Request Summaries
- "Summarize findings in 5 bullet points"
- "Top 3 issues only"
- "Executive summary, skip technical details"

---

## Success Metrics

After using these prompts, you should have:

✅ **Clear understanding** of accessibility status
✅ **Actionable task list** with priorities
✅ **Code examples** ready to implement
✅ **Professional reports** for stakeholders
✅ **Testing procedures** to validate fixes
✅ **Compliance documentation** (VPAT) for legal/procurement

---

## Next Steps

1. **Try the `/audit-zspace` slash command** first
2. **Read the generated reports** (AUDIT-SUMMARY.md is the best starting point)
3. **Use workflow templates** from this guide for specific needs
4. **Iterate:** Audit → Fix → Re-audit → Validate

---

## Additional Resources

- **Framework Documentation:** `/accessibility-standards-unity/README.md`
- **WCAG 2.2 Quick Reference:** https://www.w3.org/WAI/WCAG22/quickref/
- **W3C XAUR:** https://www.w3.org/TR/xaur/
- **Checklist:** `/standards/ZSPACE-ACCESSIBILITY-CHECKLIST.md`

---

**Document Version:** 1.0
**Last Updated:** 2025-10-20
**Maintainer:** accessibility-standards-unity Framework Team
