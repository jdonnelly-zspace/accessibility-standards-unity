# Partner Announcement Email Template

Use this template to announce the accessibility auditing tool to partners and external developers.

---

**Subject:** 🚀 New: Automated zSpace Accessibility Auditing Tool (v3.0)

---

Hi [Partner Name],

I'm excited to share that we've just released **v3.0 of our zSpace Accessibility Standards Framework** with a powerful new feature: **automated accessibility auditing** for Unity applications.

## What's New?

We've built a turnkey auditing system that can scan ANY zSpace Unity application and generate professional accessibility reports in seconds. This is the same tool we use internally to audit our own applications for WCAG 2.2 Level AA and W3C XR Accessibility compliance.

### Key Features

✅ **Instant Audits** - Scan your entire Unity project in under 10 seconds
✅ **Professional Reports** - Generate 5 comprehensive reports (VPAT, recommendations, summary, etc.)
✅ **Zero Configuration** - Works with any Unity project structure
✅ **Free & Open Source** - MIT license, available on npm and GitHub

### What It Does

The auditor automatically:
- Analyzes all Unity scenes, C# scripts, and project structure
- Detects accessibility patterns (keyboard support, screen reader compatibility, depth cues)
- Identifies WCAG 2.2 and W3C XAUR violations specific to zSpace
- Generates 5 professional reports with actionable fixes
- Calculates compliance score (0-100%) and legal risk level

### Example Output

```
Audit complete! Reports saved to:
/path/to/your-unity-project/AccessibilityAudit/

Compliance Score: 47% (Non-Conformant)
Critical Issues: 3
  - No keyboard alternatives for stylus interactions (WCAG 2.1.1)
  - No depth perception alternatives (W3C XAUR UN17)
  - No screen reader support (WCAG 4.1.2)
High Priority: 1
  - Missing accessibility framework components
```

## How to Get Started

### Option 1: Install Globally (Recommended)

```bash
# Install via npm
npm install -g accessibility-standards-unity

# Run audit on your Unity project
a11y-audit-zspace /path/to/your-unity-project

# View reports in /path/to/your-unity-project/AccessibilityAudit/
```

### Option 2: Clone from GitHub

```bash
git clone https://github.com/jdonnelly-zspace/accessibility-standards-unity.git
cd accessibility-standards-unity
node bin/audit.js /path/to/your-unity-project
```

## Documentation

We've created comprehensive guides to help you get started:

- **[Partner Onboarding Guide](docs/PARTNER-ONBOARDING.md)** - Installation, usage, troubleshooting
- **[Auditing Guide](docs/AUDITING-GUIDE.md)** - Advanced usage, interpreting results
- **[Example Workflow](examples/audit-workflow/)** - 8-week case study with sample reports

## Why This Matters

Accessibility compliance is increasingly important:
- **Legal Requirements** - Section 508, ADA, EN 301 549
- **Expanded Market** - 15% of users have disabilities
- **Better UX** - Accessible design benefits all users
- **Procurement** - Many customers require VPAT documentation

Our tool makes it easy to:
1. **Assess** - Understand your current accessibility status
2. **Fix** - Get specific, actionable recommendations
3. **Document** - Generate VPAT for legal/procurement teams
4. **Monitor** - Track progress over time

## Success Story

We recently audited a partner's medical training app:
- **Initial audit:** 32% compliance score (3 critical issues)
- **After 8 weeks:** 95% compliance score (0 critical issues)
- **Result:** App now meets WCAG 2.2 Level AA and W3C XAUR standards

See the full case study: [examples/audit-workflow/README.md](examples/audit-workflow/README.md)

## What's Included

All audits produce 5 reports:

| Report | Purpose | Audience |
|--------|---------|----------|
| **README.md** | Quick overview and next steps | Everyone |
| **AUDIT-SUMMARY.md** | Executive summary with compliance score | Managers, stakeholders |
| **VPAT-{appname}.md** | Legal compliance documentation (VPAT 2.5) | Legal, procurement, customers |
| **ACCESSIBILITY-RECOMMENDATIONS.md** | Specific fixes with implementation steps | Developers, QA |
| **accessibility-analysis.json** | Raw findings data | CI/CD, automation tools |

## Requirements

- **Node.js:** 14.0.0 or higher
- **Unity Project:** Any version (2021.3 LTS or newer recommended)
- **Platform:** Works on Windows, macOS, Linux

## Pricing

**Free!** This tool is open source (MIT license) and available at no cost.

## Support

If you have questions or run into issues:
- 📖 **Documentation:** [docs/PARTNER-ONBOARDING.md](docs/PARTNER-ONBOARDING.md)
- 🐛 **Report Issues:** https://github.com/jdonnelly-zspace/accessibility-standards-unity/issues
- 💬 **Contact:** [your-email@zspace.com]

## Next Steps

1. **Install the tool** (takes 2 minutes)
2. **Run your first audit** (takes 10 seconds)
3. **Review the recommendations** (prioritize critical issues)
4. **Implement fixes** (copy framework components to your project)
5. **Re-audit** to measure progress

## Additional Resources

Beyond the auditing tool, the framework includes:
- **Unity C# Scripts** - 13 accessible components ready for zSpace
- **Unity Prefabs** - Plug-and-play accessible UI components
- **Unity Test Framework** - Automated accessibility testing
- **Role-Specific Workflows** - For developers, designers, QA, product owners
- **WCAG 2.2 Level AA Checklist** - Adapted for zSpace
- **Windows Narrator Integration Guide** - Screen reader support

All available at: https://github.com/jdonnelly-zspace/accessibility-standards-unity

## We'd Love Your Feedback

This is a new tool, and we're actively improving it. If you:
- Find bugs or issues
- Have suggestions for improvements
- Want additional features
- Need help with implementation

Please open an issue on GitHub or reach out directly.

## Quick Links

- **GitHub Repository:** https://github.com/jdonnelly-zspace/accessibility-standards-unity
- **npm Package:** https://www.npmjs.com/package/accessibility-standards-unity
- **Partner Onboarding:** [docs/PARTNER-ONBOARDING.md](docs/PARTNER-ONBOARDING.md)
- **Example Workflow:** [examples/audit-workflow/README.md](examples/audit-workflow/README.md)

---

Happy auditing!

Best regards,
[Your Name]
[Your Title]
zSpace

---

**P.S.** - If you'd like a walkthrough or have questions about accessibility compliance for zSpace applications, feel free to schedule a call: [calendar-link]

---

## Internal Notes (Remove before sending)

**Customization Checklist:**
- [ ] Replace [Partner Name] with actual partner name
- [ ] Replace [your-email@zspace.com] with your email
- [ ] Replace [Your Name] and [Your Title]
- [ ] Add calendar link if offering calls
- [ ] Update GitHub URLs if using internal repository
- [ ] Adjust npm instructions if using internal registry
- [ ] Add company logo/branding if needed
- [ ] Review and remove this "Internal Notes" section

**Target Audience:**
- External partners building zSpace applications
- Unity developers new to accessibility
- Product managers evaluating accessibility tools
- Legal/procurement teams needing VPAT documentation

**Tone:**
- Professional but friendly
- Focus on benefits and ease of use
- Emphasize time savings and value
- Include clear next steps

**Follow-up Timeline:**
- Send initial email
- Follow up after 1 week if no response
- Offer demo/walkthrough call
- Share success stories and updates

**Metrics to Track:**
- Email open rate
- Tool installation rate
- Support requests
- Partner feedback
- Adoption rate
