# Stakeholder Communication Templates

This directory contains templates for communicating accessibility information to external stakeholders.

## Purpose

These templates help you create stakeholder-specific accessibility documentation that:
- ✅ Uses safe language patterns (no binding commitments)
- ✅ Includes appropriate disclaimers
- ✅ Addresses audience-specific concerns
- ✅ Protects legal flexibility
- ✅ Demonstrates transparency and good faith

## Templates

### 1. QUICK-REFERENCE.template.md
**Purpose:** 1-page summary for procurement decisions
**Audience:** Procurement officers, purchasing agents, decision-makers
**Use When:** RFP responses, vendor evaluations, purchase decisions

**Contains:**
- Can we purchase for users with disabilities?
- Section 508 compliance status
- Available accommodations
- Comparison to competitors
- Full disclaimer

### 2. PUBLIC-STATEMENT.template.md
**Purpose:** Public-facing accessibility commitment
**Audience:** General public, disability advocates, educators, researchers
**Use When:** Website content, public transparency, community relations

**Contains:**
- Current accessibility features (with status indicators)
- Development priorities
- Documentation availability
- Accommodation process
- Platform-specific considerations
- Open-source framework information

### 3. FAQ.template.md
**Purpose:** Multi-audience question bank
**Audience:** All stakeholders with common questions
**Use When:** Support documentation, RFP responses, customer inquiries

**Contains:**
- Procurement questions (Section 508, ADA, purchasing)
- End-user questions (specific disabilities, accommodations)
- Parent/advocate questions (testing, compliance)
- Developer questions (technical implementation)
- Media questions (industry positioning)

## How to Use These Templates

### Step 1: Generate from Audit

These templates are automatically populated when you run the audit tool:

```bash
# Generate all stakeholder templates
node bin/audit.js /path/to/unity-project --stakeholder-docs

# Or generate specific template
node bin/audit.js /path/to/unity-project --quick-reference-only
```

### Step 2: Review Before Publishing

**CRITICAL:** Review the [External Communication Guide](../../docs/EXTERNAL-COMMUNICATION-GUIDE.md) before sharing ANY of these documents externally.

**Review Checklist:**
- [ ] Read External Communication Guide
- [ ] Legal review completed
- [ ] No specific dates promised
- [ ] No feature guarantees
- [ ] Disclaimers present
- [ ] Contact information accurate
- [ ] Version numbers correct
- [ ] Status indicators accurate

### Step 3: Customize for Your Context

Replace placeholders:
- `{{APP_NAME}}` → Your application name
- `accessibility@zspace.com` → Your accessibility contact email
- `[sales contact]` → Your sales/procurement contact
- `[support email]` → Your support contact

Add context-specific information:
- Your company name and branding
- Specific accessibility features unique to your app
- Your accommodation process details
- Legal counsel contact (if appropriate)

### Step 4: Get Legal Approval

**Before publishing externally:**
1. Send to legal counsel for review
2. Confirm all language is appropriately qualified
3. Verify competitive claims are sourced
4. Ensure accommodation commitments are achievable
5. Get written approval

### Step 5: Publish and Maintain

**Publishing:**
- Website: Use PUBLIC-STATEMENT.template.md
- RFP Responses: Use QUICK-REFERENCE.template.md + VPAT
- Support Docs: Use FAQ.template.md

**Maintenance:**
- Update after major releases
- Re-audit and regenerate quarterly
- Track which version customers have received
- Archive previous versions internally

## Template Variable Reference

All templates use Handlebars-style variables that are automatically populated:

### Basic Information
- `{{APP_NAME}}` - Application name
- `{{AUDIT_DATE}}` - Date of accessibility audit
- `{{FRAMEWORK_VERSION}}` - Version of framework used
- `{{TOTAL_SCRIPTS}}` - Number of C# scripts analyzed
- `{{TOTAL_SCENES}}` - Number of Unity scenes analyzed

### Compliance Metrics
- `{{COMPLIANCE_SCORE}}` - Overall compliance percentage (0-100)
- `{{COMPLIANCE_LEVEL}}` - Text label (Fully Compliant, Substantial, etc.)
- `{{CRITICAL_COUNT}}` - Number of critical issues
- `{{HIGH_COUNT}}` - Number of high priority issues
- `{{WCAG_LEVEL_A_STATUS}}` - WCAG Level A status
- `{{WCAG_LEVEL_AA_STATUS}}` - WCAG Level AA status

### Detected Features (boolean flags)
- `{{KEYBOARD_SUPPORT_FOUND}}` - Keyboard input patterns detected
- `{{SCREEN_READER_SUPPORT_FOUND}}` - Screen reader patterns detected
- `{{FOCUS_INDICATORS_FOUND}}` - Focus indicator patterns detected
- `{{DEPTH_CUES_FOUND}}` - Depth alternative patterns detected

### Conditional Blocks
```handlebars
{{#if KEYBOARD_SUPPORT_FOUND}}
  Show this content if keyboard support detected
{{/if}}

{{#if KEYBOARD_SUPPORT_FOUND}}{{/if}}
  Show this content if keyboard support NOT detected
{{/if}}
```

## Safe Language Patterns

### Status Indicators

Use consistent icons:
- ✅ **Available Now** - Feature exists in current release
- 🔄 **Under Development** - Actively being worked on
- 📋 **Planned** - On roadmap but not started

**Always qualify ✅ statements:**
- "Keyboard navigation available (varies by scene)"
- "Partial screen reader support (under enhancement)"
- "Available in Unity 2023.2+ implementations"

### Commitment Language

✅ **SAFE:**
- "We are working to..."
- "Our goal is to..."
- "Development priority"
- "Under active development"
- "Exploring options for..."

❌ **AVOID:**
- "Will implement by..."
- "Guaranteed to..."
- "100% compliant"
- "Available in Q1 2026"

### Qualifier Phrases

Always include context:
- "Varies by Unity version"
- "Depends on scene implementation"
- "Contact us for configuration guidance"
- "Subject to technical feasibility"
- "Based on automated analysis"

## Document-Specific Guidelines

### QUICK-REFERENCE.template.md

**Purpose:** Fast procurement decision
**Length:** 1-2 pages maximum
**Tone:** Professional, concise, reassuring

**Key Sections:**
1. Yes/No answer to "Can we purchase?"
2. Section 508 compliance status
3. Available accommodations
4. Accommodation process
5. Comparison context
6. Full disclaimer

**DO:**
- Be direct and honest about current status
- Provide clear next steps (contact info)
- Use comparison carefully (competitors may not have published)
- Include zSpace-specific context

**DON'T:**
- Promise specific features or dates
- Overstate current capabilities
- Disparage competitors
- Guarantee outcomes

### PUBLIC-STATEMENT.template.md

**Purpose:** Public transparency and trust
**Length:** 2-3 pages
**Tone:** Welcoming, accessible, honest

**Key Sections:**
1. Vision statement
2. Current features (with status indicators)
3. Development priorities
4. Accommodation process
5. Platform considerations
6. Open-source leadership
7. Standards compliance
8. Full disclaimer

**DO:**
- Use status indicators consistently (✅🔄📋)
- Be honest about limitations
- Emphasize ongoing commitment
- Provide multiple contact options
- Explain zSpace platform context

**DON'T:**
- Use "fully accessible" without qualification
- Promise completion dates
- Claim 100% compliance prematurely
- Hide current gaps

### FAQ.template.md

**Purpose:** Answer common questions from all audiences
**Length:** 3-5 pages
**Tone:** Helpful, informative, qualified

**Key Sections:**
1. Procurement questions
2. End-user questions
3. Parent/advocate questions
4. Developer questions
5. Competitor/analyst questions
6. Media questions
7. Full disclaimer

**DO:**
- Organize by audience type
- Provide specific, actionable answers
- Use consistent status indicators
- Link to technical resources
- Address platform-specific challenges

**DON'T:**
- Give different answers to same question for different audiences
- Promise features without qualifiers
- Provide medical/diagnostic advice
- Guarantee accommodation outcomes

## Legal Considerations

### Required Disclaimers

**All templates include:**
- Accuracy and currency disclaimer
- No guarantees clause
- Individual needs qualification
- Third-party dependencies notice
- Legal interpretation warning

### Competitive Claims

When comparing to other zSpace applications:
- ✅ "Most zSpace applications have not published VPATs" (verifiable)
- ✅ "Based on publicly available information as of [date]"
- ❌ "Our app is more accessible than [competitor]" (subjective, risky)
- ❌ "[Competitor] fails to meet standards" (disparaging)

### Accommodation Commitments

✅ **SAFE:**
- "We evaluate requests individually"
- "We work to identify feasible solutions"
- "Accommodation options vary based on technical capabilities"

❌ **RISKY:**
- "We guarantee all users can access the application"
- "48-hour response time"
- "All accommodations will be provided"

## Contact Information

**Accessibility Questions:** accessibility@zspace.com
**Framework Questions:** https://github.com/jdonnelly-zspace/accessibility-standards-unity
**External Communication Guide:** [../../docs/EXTERNAL-COMMUNICATION-GUIDE.md](../../docs/EXTERNAL-COMMUNICATION-GUIDE.md)

## Version Control

- **Version:** 1.0
- **Last Updated:** October 2025
- **Maintained By:** Accessibility Standards Framework Team
- **License:** MIT (part of accessibility-standards-unity framework)
