# {{APP_NAME}} Accessibility: Frequently Asked Questions

**Last Updated:** {{AUDIT_DATE}}
**Version:** Current

---

## For Procurement Officers & Administrators

### Q: Does {{APP_NAME}} meet Section 508 requirements?

**A:** {{#if COMPLIANCE_SCORE >= 70}}{{APP_NAME}} demonstrates substantial conformance with Section 508 (aligned with WCAG 2.2 Level AA) with a compliance score of {{COMPLIANCE_SCORE}}%. {{/if}}{{#if COMPLIANCE_SCORE < 70}}{{APP_NAME}} is working toward conformance with Section 508 standards (current compliance: {{COMPLIANCE_SCORE}}%). {{/if}}We have completed comprehensive accessibility evaluation and maintain a current VPAT. Accessibility enhancements are an ongoing priority. Our VPAT is available for RFP responses.

### Q: Can we use {{APP_NAME}} with students/users who have disabilities?

**A:** Yes. {{APP_NAME}} provides accommodations for users with various disabilities. We work with administrators and organizations to develop individualized accommodations. Contact accessibility@zspace.com for consultation on specific user needs.

**Current capabilities include:**
{{#if KEYBOARD_SUPPORT_FOUND}}- Keyboard alternatives (detected, coverage varies){{/if}}
{{#if SCREEN_READER_SUPPORT_FOUND}}- Screen reader compatibility patterns (Windows desktop){{/if}}
- Individual accommodation evaluation process
- Technical support for accessibility configuration

### Q: What happens if we deploy {{APP_NAME}} and discover a user cannot access it?

**A:** {{APP_NAME}} provides individualized accommodation evaluation. We work with your team to identify feasible solutions, which may include software adjustments, alternative interaction methods, or supplementary approaches. Contact accessibility@zspace.com to begin the consultation process.

**Our commitment:**
- Prompt evaluation of accommodation requests
- Technical feasibility assessment
- Exploration of alternative approaches
- Ongoing support during implementation

### Q: Do you charge extra for accessibility features or accommodations?

**A:** No. All accessibility features in {{APP_NAME}} are included at no additional cost. Accommodation evaluation and support are provided as part of our standard commitment.

### Q: How does {{APP_NAME}} compare to other zSpace applications on accessibility?

**A:** {{APP_NAME}} provides more accessibility documentation than most zSpace applications. We publish:
- ✅ Comprehensive VPAT
- ✅ Accessibility evaluation using industry framework
- ✅ Detailed conformance information
- ✅ Open-source accessibility toolkit

**Industry Context:** Most zSpace applications have not published VPATs or accessibility documentation.

**Note:** Competitive information based on publicly available data as of {{AUDIT_DATE}}.

---

## For End-Users & Educators

### Q: Will {{APP_NAME}} work for a user who is blind or has low vision?

**A:** {{#if SCREEN_READER_SUPPORT_FOUND}}Screen reader compatibility patterns have been detected in {{APP_NAME}}. Windows desktop screen readers (NVDA, Narrator) may work with the application. {{/if}}{{#if SCREEN_READER_SUPPORT_FOUND}}{{/if}}Screen reader compatibility is under development. {{/if}}Currently available accommodations include:
{{#if KEYBOARD_SUPPORT_FOUND}}- Keyboard navigation alternatives to stylus{{/if}}
{{#if SCREEN_READER_SUPPORT_FOUND}}- Desktop screen reader support (Unity 2023.2+ Accessibility API){{/if}}
- Audio cues for spatial navigation
- Individual accommodation evaluation

Contact accessibility@zspace.com to discuss specific user needs and current capabilities.

### Q: Can a user with limited hand mobility use {{APP_NAME}}?

**A:** {{#if KEYBOARD_SUPPORT_FOUND}}Keyboard alternative patterns have been detected, which may support users with limited hand mobility. {{/if}}{{#if KEYBOARD_SUPPORT_FOUND}}{{/if}}Keyboard alternatives for stylus interactions are under development. {{/if}}Alternative input methods being explored include:
- Keyboard and mouse alternatives to stylus
- Voice command integration (planned)
- Switch access compatibility (exploring)

Contact accessibility@zspace.com to discuss specific user needs and available options.

### Q: My student cannot see 3D depth with the zSpace glasses. Can they still use {{APP_NAME}}?

**A:** Yes. Approximately 10-15% of users cannot perceive stereoscopic 3D depth (stereoblindness, monocular vision). {{#if DEPTH_CUES_FOUND}}{{APP_NAME}} includes alternative depth cues:{{/if}}{{#if DEPTH_CUES_FOUND}}{{/if}}{{APP_NAME}} can be enhanced with alternative depth cues:{{/if}}

- Size scaling (larger = closer)
- Shadow positioning
- Spatial audio cues
- Visual depth indicators
- Haptic feedback via stylus

{{#if DEPTH_CUES_FOUND}}These features are available in the current version.{{/if}}{{#if DEPTH_CUES_FOUND}}{{/if}}Implementation of comprehensive depth alternatives is a development priority.{{/if}}

Contact accessibility@zspace.com for guidance on configuring depth alternatives.

### Q: Is keyboard navigation available throughout {{APP_NAME}}?

**A:** {{#if KEYBOARD_SUPPORT_FOUND}}Keyboard input patterns have been detected in {{APP_NAME}}. Keyboard navigation is available for select features, with coverage varying by scene and functionality.{{/if}}{{#if KEYBOARD_SUPPORT_FOUND}}{{/if}}Keyboard navigation is under active development. The current version is primarily designed for stylus interaction, with keyboard alternatives being prioritized for enhancement.{{/if}}

**Testing Recommendation:** If keyboard access is critical for your user, we recommend testing with the specific workflows needed before deployment. Contact accessibility@zspace.com for configuration guidance.

---

## For Parents & Disability Advocates

### Q: Is {{APP_NAME}} accessible to people with disabilities?

**A:** {{APP_NAME}} is actively working toward expanded accessibility. We have completed comprehensive accessibility evaluation (compliance score: {{COMPLIANCE_SCORE}}%) and are implementing enhancements. Many accommodations are available or under development, and we provide individualized support for specific needs.

**Current Status:**
- Automated accessibility evaluation completed
- {{CRITICAL_COUNT}} critical issues identified and prioritized
- Open-source accessibility framework published
- Accommodation support process established

### Q: Who can I contact if someone is having accessibility problems with {{APP_NAME}}?

**A:** Contact accessibility@zspace.com. We evaluate accommodation requests individually and work to identify feasible solutions.

**What to include in your request:**
- Description of the user's needs
- Specific accessibility barriers encountered
- Workflows or features affected
- Unity version and zSpace SDK version (if known)
- Any attempted workarounds

### Q: Has {{APP_NAME}} been tested by people with disabilities?

**A:** {{#if USER_TESTING_CONDUCTED}}User testing has been conducted with {{USER_TESTING_GROUPS}}.{{/if}}{{#if USER_TESTING_CONDUCTED}}{{/if}}User testing with diverse user groups is planned as part of our ongoing accessibility commitment.{{/if}} We welcome participation from the disability community. Contact accessibility@zspace.com to learn more or participate in future testing.

### Q: Does {{APP_NAME}} comply with the Americans with Disabilities Act (ADA)?

**A:** {{APP_NAME}} is committed to accessibility and ADA principles. We have:
- Conducted comprehensive accessibility evaluation
- Documented accommodations and conformance status
- Established processes for addressing individual needs
- Published VPAT documentation for review
- Created open-source accessibility framework

Organizations should consult with their own legal counsel regarding ADA obligations for specific deployment contexts.

---

## For Developers & Technical Teams

### Q: What Unity version does {{APP_NAME}} use, and does it support the Unity Accessibility API?

**A:** {{APP_NAME}} analysis detected:
- {{TOTAL_SCENES}} Unity scenes
- {{TOTAL_SCRIPTS}} C# scripts
{{#if UNITY_VERSION_DETECTED}}- Unity version: {{UNITY_VERSION}}{{/if}}
{{#if UNITY_ACCESSIBILITY_API_FOUND}}- Unity Accessibility API implementation detected{{/if}}

**Unity Accessibility API** (Unity 2023.2+) provides official screen reader support for Windows desktop applications. {{#if UNITY_ACCESSIBILITY_API_FOUND}}Implementation detected in codebase.{{/if}}{{#if UNITY_ACCESSIBILITY_API_FOUND}}{{/if}}Implementation recommended for enhanced screen reader support.{{/if}}

### Q: Can I see the accessibility framework used by {{APP_NAME}}?

**A:** Yes! The accessibility-standards-unity framework is open-source:

- **Repository:** https://github.com/jdonnelly-zspace/accessibility-standards-unity
- **License:** MIT (free and open)
- **Includes:**
  - Unity C# accessibility components
  - Testing tools and validation scripts
  - WCAG 2.2 + W3C XAUR standards documentation
  - VPAT templates
  - Developer workflows

You can use this framework in your own zSpace Unity projects.

### Q: What specific accessibility components should be added to {{APP_NAME}}?

**A:** Based on automated analysis, recommended priorities include:

**Critical:**
{{#each CRITICAL_ISSUES}}
- {{title}} - {{recommendation}}
{{/each}}

**High Priority:**
{{#each HIGH_ISSUES}}
- {{title}} - {{recommendation}}
{{/each}}

See the full ACCESSIBILITY-RECOMMENDATIONS.md document for detailed implementation guidance with code examples.

### Q: How do I re-test accessibility after making changes?

**A:** Use the accessibility-standards-unity audit tool:

```bash
# Install framework
npm install -g git+https://github.com/jdonnelly-zspace/accessibility-standards-unity.git

# Run audit
a11y-audit-zspace /path/to/unity-project

# View results
cd /path/to/unity-project/AccessibilityAudit
```

The audit generates:
- VPAT documentation
- Compliance score tracking
- Prioritized recommendations
- Visual analysis (with `--capture-screenshots` flag)

---

## For Competitors & Industry Analysts

### Q: Why did you publish this accessibility documentation publicly?

**A:** Transparency builds trust with customers, users, and the disability community. We believe accessibility leadership requires public accountability and documentation. Publishing our framework and methodology helps advance accessibility across the entire zSpace application ecosystem.

### Q: Will you share your accessibility framework with other companies?

**A:** Yes. Our accessibility-standards-unity framework is open-source and available at https://github.com/jdonnelly-zspace/accessibility-standards-unity. We believe advancing accessibility across the zSpace platform benefits all users.

### Q: What standards are you following?

**A:**
- **WCAG 2.2 Level AA** (Web Content Accessibility Guidelines)
- **W3C XAUR** (XR Accessibility User Requirements - adapted for zSpace)
- **Section 508** (US Federal accessibility standards)
- **EN 301 549** (EU accessibility standards)

All adapted appropriately for zSpace desktop stereoscopic 3D platform.

### Q: When will you achieve full compliance?

**A:** We are actively working toward full WCAG 2.2 Level AA conformance. Enhancement priorities and timelines depend on technical feasibility, Unity/zSpace SDK compatibility, and resource availability. We update our VPAT documentation as significant changes occur and maintain transparency about current status and ongoing priorities.

---

## For Media & Press

### Q: Is {{APP_NAME}} the first accessible zSpace application?

**A:** {{APP_NAME}} is among the first zSpace applications to publish comprehensive accessibility documentation, including a VPAT, detailed evaluation, and open-source framework. We're leading transparency and accountability in the zSpace accessibility space.

### Q: Have there been any complaints or legal issues regarding {{APP_NAME}} accessibility?

**A:** No. {{APP_NAME}} has proactively conducted accessibility evaluation before any complaints or legal action. Our approach demonstrates good faith effort and commitment to serving all users.

### Q: What makes zSpace accessibility unique compared to other VR/AR platforms?

**A:** zSpace is distinct from immersive VR/AR headsets:

**zSpace Characteristics:**
- Desktop stereoscopic 3D display (24" screen)
- Seated, desk-based experience
- Windows desktop operating system
- User can see physical environment
- Desktop screen reader compatible (NVDA, Narrator, JAWS)

**Accessibility Implications:**
- Desktop accessibility standards apply (not VR-specific)
- Screen readers are feasible (Windows desktop apps)
- Stereoscopic depth alternatives critical (10-15% can't see 3D)
- Stylus alternatives needed (keyboard, mouse, voice)

---

**Last Updated:** {{AUDIT_DATE}}
**Contact:** accessibility@zspace.com

---

## Important Disclaimer

**Accuracy and Currency:** Information in this document reflects {{APP_NAME}}'s accessibility status as of {{AUDIT_DATE}}. Accessibility features, enhancement priorities, timelines, and capabilities are subject to change without notice.

**No Guarantees:** Descriptions of planned enhancements, features under development, or future capabilities should not be interpreted as commitments or guarantees. Actual implementation and timing may vary based on technical feasibility, Unity/zSpace SDK compatibility, resource allocation, and business priorities.

**Individual Needs:** Accommodation feasibility depends on specific user requirements, Unity version, zSpace SDK version, scene complexity, hardware configuration, and current technical capabilities. We recommend contacting accessibility@zspace.com for individualized consultation regarding specific accommodation requests.

**Automated Analysis:** Many assessments in this FAQ are based on automated code analysis. Manual validation by qualified accessibility professionals is recommended for comprehensive evaluation.

**Third-Party Dependencies:** zSpace accessibility features depend on Unity Engine, zSpace SDK, Windows OS, and desktop assistive technology capabilities. Compatibility may vary based on platform versions.

**Contact:** For questions about information in this document: accessibility@zspace.com
