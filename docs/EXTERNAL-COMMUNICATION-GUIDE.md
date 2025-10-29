# External Communication Guide for Accessibility Documentation

> **Purpose**: Guide for communicating zSpace accessibility status to external stakeholders while balancing transparency with legal protection.
> **Audience**: Development teams, product managers, legal counsel, marketing teams
> **Version**: 1.0 (October 2025)

---

## Executive Summary

When sharing accessibility documentation about zSpace Unity applications, follow these principles:

✅ **Be transparent** about current status and development direction
✅ **Avoid binding commitments** to specific features or dates
✅ **Qualify all statements** with appropriate context and disclaimers
✅ **Position proactively** as an accessibility leader through transparency
✅ **Protect flexibility** while demonstrating good faith effort

---

## Core Philosophy: The Balance

### Transparency Without Liability

**DO:**
- Share what you're working on without promising when it will be done
- Document current capabilities accurately
- Indicate development direction without binding commitments
- Demonstrate good faith effort while protecting flexibility

**DON'T:**
- Promise specific dates ("Available in Q1 2026")
- Guarantee specific features ("Will implement...")
- Make absolute claims ("100% compliant")
- Overstate current capabilities

---

## Safe Language Patterns for zSpace

### ✅ SAFE: Current Status

**Good Examples:**
```markdown
**Available Now:**
- Keyboard alternatives for stylus interactions in Scene Manipulation module
- Adjustable text contrast in UI components (version 2.1.0+)
- Spatial audio cues for 3D navigation

**Important Note:** Availability may vary by Unity version, scene
complexity, and zSpace SDK version. Contact accessibility@[company].com
for specific configuration guidance.
```

**Why it works:** Specific but qualified, includes version context, provides contact for questions

### ✅ SAFE: Development Direction

**Good Examples:**
```markdown
**Under Development:**
- Expanding screen reader compatibility for Unity 2023.2+ projects
- Enhancing depth perception alternatives for non-stereoscopic users
- Working toward comprehensive WCAG 2.2 Level AA conformance

**Note:** Enhancement priorities and timelines are subject to change
based on technical feasibility, resource availability, and user feedback.
```

**Why it works:** Shows direction without dates, includes standard disclaimer, uses "working toward" not "will achieve"

### ✅ SAFE: Commitment Language

**Good Examples:**
```markdown
- "We are working to expand keyboard support"
- "Our goal is to achieve WCAG 2.2 Level AA conformance"
- "Screen reader compatibility is a development priority"
- "Exploring options for voice command integration"
- "Evaluating feasibility of haptic feedback enhancements"
```

**Why it works:** Directional, not definitive; shows effort without guarantees

---

## ❌ UNSAFE Language Patterns

### Avoid: Specific Dates

❌ **BAD:**
- "Available in Q1 2026"
- "Compliance achieved by June 2026"
- "48-hour response guarantee"

✅ **INSTEAD USE:**
- "Near-term priority"
- "Actively working toward conformance"
- "Prompt response to accommodation requests"

### Avoid: Definitive Commitments

❌ **BAD:**
- "Will implement voice commands"
- "Guaranteed to work with all screen readers"
- "All zSpace applications will be accessible"
- "100% WCAG 2.2 compliant"

✅ **INSTEAD USE:**
- "Voice commands under development"
- "Expanding screen reader compatibility"
- "Working toward accessibility across zSpace applications"
- "Pursuing WCAG 2.2 Level AA conformance"

### Avoid: Unqualified Feature Claims

❌ **BAD:**
- "✅ Keyboard accessible"
- "✅ Screen reader compatible"
- "✅ WCAG 2.2 Level AA compliant"

✅ **INSTEAD USE:**
- "🔄 Expanding keyboard support (available in select scenes)"
- "🔄 Enhancing screen reader compatibility (Unity 2023.2+)"
- "Working toward WCAG 2.2 Level AA conformance (detailed VPAT available)"

---

## Status Indicator System

Use consistent icons throughout all zSpace accessibility documentation:

| Icon | Meaning | Use When | Example |
|------|---------|----------|---------|
| ✅ | Available Now | Feature exists in current release | ✅ Keyboard navigation (Unity 2023.2+, varies by scene) |
| 🔄 | Under Development | Actively being worked on | 🔄 Screen reader integration for spatial UI |
| 📋 | Planned | On roadmap but not started | 📋 Voice command system for zSpace |
| ⚠️ | Partial Support | Works in some contexts, not others | ⚠️ Depth cues (available in specific modules) |

**CRITICAL:** Always qualify ✅ statements with context like "varies by module," "Unity version X+," or "in select features"

---

## Standard Disclaimer (Required)

**Place at the end of EVERY external accessibility document:**

```markdown
---

## Important Disclaimer

**Accuracy and Currency:** Information in this document reflects
zSpace accessibility status and plans as of [Publication Date].
Accessibility features, enhancement priorities, timelines, and
capabilities are subject to change without notice.

**No Guarantees:** Descriptions of planned enhancements, features
under development, or future capabilities should not be interpreted
as commitments or guarantees. Actual implementation and timing may
vary based on technical feasibility, Unity/zSpace SDK compatibility,
and resource allocation.

**Individual Needs:** Accommodation feasibility depends on specific
user requirements, Unity version, zSpace SDK version, scene complexity,
and current technical capabilities. We recommend contacting
[accessibility contact] for individualized consultation regarding
specific accommodation requests.

**Third-Party Dependencies:** Some accessibility features depend on
Unity Engine, zSpace SDK, and desktop operating system capabilities.
Compatibility may vary based on platform versions.

**Legal Interpretation:** This document is provided for informational
purposes and should not be construed as legal advice or legal
compliance certification. Organizations should consult with their
own legal counsel regarding accessibility obligations.

**Contact:** For questions about information in this document:
[accessibility email]

**Last Updated:** [Date]
**Next Planned Update:** [General timeframe - e.g., "Quarterly" or
"As significant changes occur"]

---
```

---

## Document Types & Audiences

### 1. VPAT (Comprehensive)
- **Audience:** Legal teams, procurement officers, compliance reviewers
- **Tone:** Formal, detailed, technical
- **Key sections:** Executive Summary, Risk Assessment, all 50 WCAG criteria
- **Disclaimers:** ALL standard disclaimers required

### 2. Accessibility Quick Reference (1-page)
- **Audience:** Busy executives, purchasing agents, decision-makers
- **Tone:** Professional, concise, reassuring
- **Key sections:** Can we purchase? Does it meet Section 508? What accommodations?
- **Disclaimers:** Condensed version at bottom

### 3. Public Accessibility Statement (Web page)
- **Audience:** General public, disability advocates, researchers, educators
- **Tone:** Transparent, accessible, welcoming
- **Key sections:** Current features, development priorities, contact info
- **Disclaimers:** Standard disclaimer, prominently placed

### 4. Implementation Guide
- **Audience:** Teachers, administrators, end-users
- **Tone:** Helpful, practical, honest about limitations
- **Key sections:** Setup scenarios, troubleshooting, when to contact support
- **Disclaimers:** Feature availability may vary

---

## zSpace-Specific Considerations

### Technical Complexity Requires Extra Qualifiers

zSpace accessibility involves multiple dependencies:
- Unity Engine version (2021.3 vs 2023.2+ differences)
- zSpace SDK version
- Desktop OS (Windows screen reader compatibility)
- Scene design (developer implementation choices)
- Hardware setup (3D glasses, stylus, display)

**Therefore, ALWAYS include qualifiers:**
- "Varies by Unity version"
- "Depends on scene implementation"
- "Requires Unity 2023.2+ for screen reader support"
- "Contact us for configuration-specific guidance"

### Unique Accessibility Challenges

When discussing zSpace-specific features, be honest about complexity:

✅ **Good:**
```markdown
**Depth Perception Alternatives:**
Stereoscopic 3D is core to zSpace, but not all users can perceive
depth. We provide alternative depth cues including:
- 🔄 Spatial audio positioning (under enhancement)
- ✅ Visual depth indicators (available, varies by scene)
- 📋 Haptic feedback via stylus (planned)

These alternatives allow users to interact with 3D content without
relying on stereoscopic vision. Effectiveness varies by application
design and user needs.
```

❌ **Bad:**
```markdown
✅ Works without 3D glasses
✅ Full depth perception alternatives
```

### Desktop Accessibility Context

Remember: zSpace runs on Windows desktops, not mobile/VR:

✅ **Good:**
```markdown
**Screen Reader Support:**
zSpace applications run on Windows desktops and can integrate with
desktop screen readers (NVDA, Narrator, JAWS). Unity 2023.2+ provides
the Accessibility Module for screen reader integration. Implementation
depends on developer usage of accessibility APIs.
```

❌ **Bad:**
```markdown
✅ Screen reader compatible (implying it works universally)
```

---

## Competitive Positioning for zSpace

### Transparency as a Differentiator

Most zSpace application developers don't publish accessibility documentation. Position proactively:

✅ **Safe competitive language:**
```markdown
**Industry Leadership:**
This accessibility framework provides comprehensive documentation that
exceeds typical zSpace application accessibility transparency. Most
zSpace applications do not publish VPATs or accessibility documentation.

We believe transparency benefits the disability community, educators,
and procurement teams evaluating accessibility requirements.
```

### Questions to Ask Other Vendors

Provide these questions for procurement teams evaluating competing zSpace applications:

```markdown
## Questions for zSpace Application Vendors

When evaluating accessibility of zSpace applications, ask vendors:

1. "Can you provide a current VPAT for your zSpace application?"
2. "How does your application work for users who cannot perceive stereoscopic 3D?"
3. "What keyboard alternatives exist for stylus interactions?"
4. "Does your application support Windows screen readers (NVDA, Narrator, JAWS)?"
5. "Have you tested with Unity 2023.2+ Accessibility Module?"
6. "What is your accommodation process for users with disabilities?"
7. "Do you provide documentation for accessible scene design?"

**Note:** Many zSpace application vendors have not conducted accessibility
evaluation or published documentation.
```

---

## Review Checklist Before Publishing

Before releasing ANY external accessibility documentation:

### Legal Review
- [ ] All documents reviewed by legal counsel
- [ ] Disclaimer language approved
- [ ] No binding commitments to specific dates
- [ ] No guarantees of specific features
- [ ] Competitive comparisons verified and sourced
- [ ] Accommodation language realistic (not promising more than deliverable)

### Accuracy Review
- [ ] Current feature status accurate (tested in latest release)
- [ ] Unity version numbers correct
- [ ] zSpace SDK version numbers correct
- [ ] Contact information up to date
- [ ] Links functional
- [ ] Status indicators match reality (✅🔄📋⚠️)

### Consistency Review
- [ ] Language consistent across all documents
- [ ] No contradictions between VPAT and other docs
- [ ] Status indicators mean the same thing everywhere
- [ ] Disclaimers present on all documents
- [ ] Unity/zSpace version qualifiers included

### Stakeholder Review
- [ ] Technical team confirms current capabilities
- [ ] Product team confirms development priorities
- [ ] Support team confirms accommodation processes
- [ ] Marketing approves public-facing language
- [ ] Sales team provided with talking points

---

## Document Maintenance

### Update Frequency

| Document Type | Update Frequency | Trigger Events |
|---------------|------------------|----------------|
| VPAT | Annually or upon major release | Unity version upgrade, major feature changes |
| Quick Reference | Semi-annually | Major status changes, new accommodations |
| Public Statement | Quarterly | Feature releases, priority shifts |
| Implementation Guide | As needed | Unity version changes, SDK updates |

### Version Control
- Date all documents clearly with "Last Updated: [Date]"
- Maintain "Next Planned Update: [Timeframe]"
- Archive previous versions internally
- Track what changed in each update

---

## Crisis Communication

### If Accessibility Issue Goes Public

**Prepared Response Template:**

```markdown
[Company] is aware of [issue description] and takes accessibility
seriously.

**Current Status:**
- We are investigating [issue]
- [If applicable: Workaround available: [description]]
- Timeline for resolution: [As soon as feasible / Under evaluation]

**Our Commitment:**
[Company] is committed to accessibility and serving all users. We:
- Conduct regular accessibility evaluations
- Maintain public VPAT documentation
- Provide accommodation support for individual needs
- Publish open-source accessibility framework for Unity/zSpace

**Contact:**
Users experiencing this issue can contact [accessibility email] for
individualized accommodation support.

**Updates:**
We will provide updates [on our accessibility page / via normal
communication channels].
```

**Key Principles in Crisis:**
- ✅ Don't over-promise fixes
- ✅ Don't blame users or diminish concerns
- ✅ Do offer workarounds if available
- ✅ Do show you take it seriously
- ✅ Do provide contact for help NOW
- ✅ Do indicate general direction without specific dates

---

## Contact Routing

Establish clear routing for different inquiry types:

1. **Accommodation requests** → Support team / accessibility specialist
2. **Procurement questions** → Sales team (with VPAT available)
3. **Legal/compliance questions** → Legal team
4. **Media inquiries** → PR/Communications team
5. **Technical questions** → Support/Engineering team
6. **Framework/open-source questions** → Development team / GitHub

---

## Success Metrics (Internal Tracking)

Track these metrics to measure communication effectiveness:

**Documentation Metrics:**
- Number of accessibility documents published
- Download count for VPAT/guides
- Website traffic to accessibility pages
- Time between updates

**Accommodation Metrics:**
- Number of accommodation requests received
- Average response time
- Resolution rate
- Common accommodation types

**Sales Impact:**
- RFPs won/lost citing accessibility
- Procurement questions received
- Competitive displacement due to accessibility
- Customer testimonials related to accessibility

**Development Progress:**
- Features shipped vs. documented as "under development"
- WCAG conformance percentage over time
- Accessibility bugs fixed per release

---

## Resources

### Internal Resources
- [VPAT Templates](../templates/audit/)
- [Stakeholder Templates](../templates/stakeholder/)
- [Auditing Guide](./AUDITING-GUIDE.md)
- [Partner Onboarding](./PARTNER-ONBOARDING.md)

### External Standards
- [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/)
- [VPAT 2.5 Template](https://www.itic.org/policy/accessibility/vpat)
- [Section 508](https://www.section508.gov/)
- [W3C XAUR](https://www.w3.org/TR/xaur/)

### Legal Guidance
- Consult with your organization's legal counsel before publishing
- Review all competitive claims with legal team
- Ensure accommodation commitments are achievable

---

## Summary: Golden Rules

1. **Always qualify** ✅ statements with context
2. **Never promise** specific dates or guaranteed features
3. **Use disclaimers** on every external document
4. **Be honest** about current status and limitations
5. **Show direction** without binding commitments
6. **Provide contact** for individualized support
7. **Position proactively** through transparency
8. **Protect flexibility** while demonstrating good faith
9. **Get legal review** before publishing anything
10. **Update regularly** to maintain accuracy and trust

---

**Document Version:** 1.0
**Last Updated:** October 2025
**Maintained By:** Accessibility Standards Framework Team
**License:** MIT (part of accessibility-standards-unity framework)
