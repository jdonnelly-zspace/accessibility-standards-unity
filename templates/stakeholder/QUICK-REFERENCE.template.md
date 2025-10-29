# {{APP_NAME}} Accessibility Quick Reference

## For Procurement Officers and Decision Makers

**Product:** {{APP_NAME}}
**Version:** Current
**Report Date:** {{AUDIT_DATE}}
**Platform:** zSpace (Desktop Stereoscopic 3D)

---

### Can we purchase {{APP_NAME}} for users with disabilities?

{{#if COMPLIANCE_SCORE >= 70}}**✅ YES**. {{APP_NAME}} demonstrates substantial conformance with WCAG 2.2 Level AA standards ({{COMPLIANCE_SCORE}}% compliance). Accommodation support is available for individual needs.{{/if}}{{#if COMPLIANCE_SCORE >= 40 && COMPLIANCE_SCORE < 70}}**🔄 YES, WITH ONGOING ENHANCEMENTS**. {{APP_NAME}} provides accommodations for users with disabilities and is actively working toward expanded accessibility ({{COMPLIANCE_SCORE}}% current compliance). Individual accommodation evaluation is available.{{/if}}{{#if COMPLIANCE_SCORE < 40}}**🔄 ACCESSIBILITY ENHANCEMENTS RECOMMENDED**. {{APP_NAME}} is working toward accessibility compliance ({{COMPLIANCE_SCORE}}% current status). Significant enhancements are planned. Individual accommodation evaluation is available.{{/if}}

---

### Does {{APP_NAME}} meet Section 508 requirements?

{{#if COMPLIANCE_SCORE >= 70}}**SUBSTANTIAL CONFORMANCE**. Full VPAT available documenting current status. Accessibility enhancements are an ongoing priority.{{/if}}{{#if COMPLIANCE_SCORE < 70}}**WORKING TOWARD CONFORMANCE**. Full VPAT available documenting current status and development priorities. Accessibility enhancements are an ongoing priority.{{/if}}

**Documentation Available:**
- ✅ Full VPAT 2.5 (Voluntary Product Accessibility Template)
- ✅ WCAG 2.2 Level AA evaluation
- ✅ W3C XAUR (XR Accessibility) assessment for zSpace
- ✅ Detailed recommendations for enhancement

---

### What accommodations are currently available?

**zSpace Platform Context:** Desktop stereoscopic 3D application (Windows 10/11, zSpace display, tracked glasses, stylus)

**Current Status** (as of {{AUDIT_DATE}}):

{{#if KEYBOARD_SUPPORT_FOUND}}✅ **Keyboard Support** - Keyboard alternatives detected (coverage varies by feature){{/if}}{{#if KEYBOARD_SUPPORT_FOUND}}{{/if}}🔄 **Keyboard Support** - Under development (stylus alternatives recommended)

{{#if SCREEN_READER_SUPPORT_FOUND}}✅ **Screen Reader Compatibility** - Desktop screen reader patterns detected (Windows Narrator/NVDA){{/if}}{{#if SCREEN_READER_SUPPORT_FOUND}}{{/if}}🔄 **Screen Reader Compatibility** - Enhancing (Unity 2023.2+ Accessibility API recommended)

{{#if FOCUS_INDICATORS_FOUND}}✅ **Visual Focus Indicators** - Focus indicator patterns detected{{/if}}{{#if FOCUS_INDICATORS_FOUND}}{{/if}}🔄 **Visual Focus Indicators** - Under development for keyboard navigation

{{#if DEPTH_CUES_FOUND}}✅ **Depth Perception Alternatives** - Alternative depth cues available for stereoblindness{{/if}}{{#if DEPTH_CUES_FOUND}}{{/if}}📋 **Depth Perception Alternatives** - Planned (critical for 10-15% of users who cannot perceive stereoscopic 3D)

✅ **Accommodation Support** - Individual evaluation available: accessibility@zspace.com

**Note:** Feature availability varies by Unity version, zSpace SDK version, and scene implementation. Contact us for configuration-specific guidance.

---

### What if a user needs immediate accommodation?

**Individualized accommodation support available:**

- **Contact:** accessibility@zspace.com
- **Process:** We evaluate requests individually and work to identify feasible solutions within current technical capabilities
- **Response:** Prompt evaluation of accommodation requests

---

### Do you have third-party verification?

{{#if THIRD_PARTY_VERIFIED}}✅ **Third-party audit completed** by {{THIRD_PARTY_AUDITOR}} ({{THIRD_PARTY_AUDIT_DATE}}){{/if}}{{#if THIRD_PARTY_VERIFIED}}{{/if}}**VPAT available** based on comprehensive automated code analysis using accessibility-standards-unity framework v{{FRAMEWORK_VERSION}}

**Evaluation Method:**
- Automated code analysis of {{TOTAL_SCRIPTS}} C# scripts
- {{TOTAL_SCENES}} Unity scenes reviewed
- WCAG 2.2 Level AA criteria assessment
- W3C XAUR (XR Accessibility) evaluation for zSpace platform

**Recommendation:** Manual validation by qualified accessibility professionals recommended for comprehensive certification.

---

### How does {{APP_NAME}} compare to other zSpace applications on accessibility?

{{APP_NAME}} provides comprehensive accessibility documentation including:
- ✅ Public VPAT
- ✅ Accessibility evaluation using industry framework
- ✅ Detailed conformance information
- ✅ Accommodation support process

**Industry Context:** Based on publicly available information, most zSpace applications have not published accessibility documentation or VPATs.

**Last Verified:** {{AUDIT_DATE}}

---

### What are the key accessibility challenges for zSpace?

**zSpace-Specific Considerations:**

1. **Stereoscopic Depth** - 10-15% of users cannot perceive 3D depth (stereoblindness, monocular vision)
   - Requires alternative depth cues (size, shadows, audio, haptics)

2. **Stylus Input** - Primary interaction method may not be accessible to all users
   - Requires keyboard, mouse, or voice alternatives

3. **Desktop Screen Readers** - zSpace runs on Windows desktops
   - Unity 2023.2+ Accessibility API provides screen reader integration
   - Requires developer implementation

4. **Visual Contrast** - zSpace display characteristics
   - Requires testing on actual zSpace hardware for accurate contrast validation

---

### Full Documentation

- **VPAT:** [Full VPAT available in audit package]
- **Audit Summary:** [Executive summary available in audit package]
- **Implementation Recommendations:** [Developer guide available in audit package]
- **Framework:** https://github.com/jdonnelly-zspace/accessibility-standards-unity

---

### Contact

**For specific accommodation questions:** accessibility@zspace.com
**For procurement questions:** [sales contact]

---

## Important Disclaimer

**Accuracy and Currency:** Information in this document reflects {{APP_NAME}}'s accessibility status as of {{AUDIT_DATE}}. Accessibility features, enhancement priorities, timelines, and capabilities are subject to change without notice.

**Automated Analysis:** This assessment is based on automated code analysis. Manual validation by qualified accessibility professionals is recommended for comprehensive evaluation.

**No Guarantees:** Descriptions of detected patterns or development recommendations should not be interpreted as commitments or guarantees. Actual implementation and timing may vary based on technical feasibility, Unity/zSpace SDK compatibility, and resource availability.

**Individual Needs:** Accommodation feasibility depends on specific user requirements, Unity version, zSpace SDK version, scene complexity, and current technical capabilities. For individualized consultation regarding specific accommodation requests, contact accessibility@zspace.com.

**Third-Party Dependencies:** zSpace accessibility features depend on Unity Engine, zSpace SDK, Windows OS, and desktop assistive technology capabilities. Compatibility may vary based on platform versions.

**Contact:** For questions about information in this document: accessibility@zspace.com

**Last Updated:** {{AUDIT_DATE}}

---

**Generated By:** accessibility-standards-unity Framework v{{FRAMEWORK_VERSION}}
**Assessment Date:** {{AUDIT_DATE}}
