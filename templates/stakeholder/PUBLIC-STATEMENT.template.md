# {{APP_NAME}} Accessibility Commitment

## Making zSpace Accessible for All Users

**Last Updated:** {{AUDIT_DATE}}

---

### Our Vision

{{APP_NAME}} is committed to accessibility and serving diverse users. We believe that interactive 3D learning experiences on the zSpace platform should be available to everyone, including users with disabilities.

---

### Current Accessibility Features

[Organize by status - be honest but positive]

**Available Now:**

{{#if KEYBOARD_SUPPORT_FOUND}}✅ **Keyboard Navigation** - Keyboard alternatives for stylus interactions (varies by scene){{/if}}
{{#if SCREEN_READER_SUPPORT_FOUND}}✅ **Screen Reader Support** - Windows desktop screen reader compatibility (NVDA, Narrator){{/if}}
{{#if FOCUS_INDICATORS_FOUND}}✅ **Visual Focus Indicators** - Clear focus indication for keyboard users{{/if}}
{{#if CONTRAST_COMPLIANT}}✅ **High Contrast UI** - WCAG 2.2 compliant color contrast{{/if}}
{{#if DEPTH_CUES_FOUND}}✅ **Depth Alternatives** - Multiple depth cues for users who cannot perceive stereoscopic 3D{{/if}}
✅ **Accommodation Support** - Individual evaluation available: accessibility@zspace.com

**Under Active Development:**

{{#if KEYBOARD_SUPPORT_FOUND}}{{/if}}{{#if KEYBOARD_SUPPORT_FOUND}}{{/if}}🔄 **Keyboard Alternatives** - Expanding keyboard support for all stylus interactions
{{#if SCREEN_READER_SUPPORT_FOUND}}{{/if}}{{#if SCREEN_READER_SUPPORT_FOUND}}{{/if}}🔄 **Screen Reader Integration** - Unity 2023.2+ Accessibility API implementation
{{#if FOCUS_INDICATORS_FOUND}}{{/if}}{{#if FOCUS_INDICATORS_FOUND}}{{/if}}🔄 **Focus Indicators** - Visual feedback for keyboard navigation
{{#if DEPTH_CUES_FOUND}}{{/if}}{{#if DEPTH_CUES_FOUND}}{{/if}}🔄 **Stereoscopic Alternatives** - Multiple depth perception cues (size, shadow, audio)

**Planned Enhancements:**

📋 **Voice Commands** - Exploring voice navigation as stylus alternative
📋 **Enhanced Contrast** - Additional UI customization options
📋 **Spatial Audio** - Audio descriptions for 3D navigation
📋 **User Testing** - Validation with diverse user groups

**Status Indicators:**
- ✅ Available in current release
- 🔄 Under active development
- 📋 Planned enhancement

---

### Ongoing Enhancement Priorities

We continuously evaluate and prioritize accessibility improvements:

- **Input Alternatives** - Expanding keyboard, mouse, and voice alternatives to stylus
- **Screen Reader Support** - Enhancing Windows desktop screen reader compatibility
- **Depth Perception** - Multiple cues for users who cannot perceive stereoscopic 3D
- **Contrast & Visual Design** - Ensuring clarity on zSpace displays
- **User Testing** - Validation with users who have disabilities
- **Framework Development** - Contributing to open-source zSpace accessibility tools

**Roadmap Note:** Enhancement priorities and timelines are subject to change based on technical feasibility, Unity/zSpace SDK compatibility, user feedback, and resource availability.

---

### Documentation for Procurement

We provide comprehensive accessibility documentation for evaluation:

- **📄 VPAT 2.5** - Voluntary Product Accessibility Template
- **📄 Section 508 Conformance** - Federal accessibility standards evaluation
- **📄 WCAG 2.2 Assessment** - Web Content Accessibility Guidelines evaluation
- **📄 W3C XAUR Review** - XR Accessibility User Requirements for zSpace

**Request Documentation:** accessibility@zspace.com

---

### Need an Accommodation?

**For Users:** If you need an accessibility accommodation to use {{APP_NAME}}, we're here to help.

**Contact:** accessibility@zspace.com

**Support Approach:** We evaluate accommodation requests individually and work to identify feasible solutions within current technical capabilities and platform constraints.

---

### Accessibility Feedback

We welcome feedback from the disability community, users, and accessibility advocates.

**Report an Issue:** accessibility@zspace.com
**Suggest an Enhancement:** accessibility@zspace.com

Your feedback helps us prioritize enhancement efforts.

---

### Platform-Specific Considerations

**zSpace Desktop Stereoscopic 3D:**

{{APP_NAME}} runs on the zSpace platform, which has unique accessibility considerations:

**What is zSpace?**
- Desktop stereoscopic 3D display (24" screen)
- Tracked glasses (3D viewing)
- Stylus input (3D interaction)
- Windows 10/11 desktop operating system
- Seated, desk-based experience

**Accessibility Implications:**
- **Stereoscopic Depth:** 10-15% of users cannot perceive 3D depth (stereoblindness, monocular vision) - we provide alternative depth cues
- **Stylus Input:** Not all users can use stylus - we provide keyboard/mouse alternatives
- **Desktop Screen Readers:** Windows desktop screen readers (NVDA, Narrator, JAWS) can integrate with proper Unity implementation
- **Visual Contrast:** Testing on actual zSpace hardware recommended for accurate validation

---

### Industry Leadership

**Open-Source Accessibility Framework:**

{{APP_NAME}} is developed using the accessibility-standards-unity framework, an open-source toolkit for zSpace accessibility:

- **Framework:** https://github.com/jdonnelly-zspace/accessibility-standards-unity
- **Purpose:** Advance accessibility across the zSpace application ecosystem
- **License:** MIT (free and open)
- **Includes:** Unity C# components, testing tools, documentation, VPAT templates

We believe transparency and open collaboration advance accessibility for all zSpace users.

---

### Standards Compliance

{{APP_NAME}} is working toward conformance with:

- ✅ **W3C XAUR** (XR Accessibility User Requirements - zSpace adapted)
- 🔄 **WCAG 2.2 Level AA** (Web Content Accessibility Guidelines for desktop)
- ✅ **Section 508** (US Federal - Desktop application context)
- ✅ **EN 301 549** (EU - Desktop application context)

**Current Compliance Score:** {{COMPLIANCE_SCORE}}% (as of {{AUDIT_DATE}})

---

### Questions?

- **For Procurement:** [sales contact or email]
- **For Technical Support:** [support email]
- **For Accessibility:** accessibility@zspace.com

---

## Important Disclaimer

**Accuracy and Currency:** Information on this page reflects {{APP_NAME}}'s accessibility status and plans as of {{AUDIT_DATE}}. Accessibility features, enhancement priorities, timelines, and capabilities are subject to change without notice.

**No Guarantees:** Descriptions of planned enhancements, features under development, or future capabilities should not be interpreted as commitments or guarantees. Actual implementation and timing may vary based on technical feasibility, Unity/zSpace SDK compatibility, resource allocation, and business priorities.

**Individual Needs:** Accommodation feasibility depends on specific user requirements, Unity version, zSpace SDK version, scene complexity, hardware configuration, and current technical capabilities. We recommend contacting accessibility@zspace.com for individualized consultation regarding specific accommodation requests.

**Third-Party Dependencies:** zSpace accessibility features depend on Unity Engine, zSpace SDK, Windows OS, and desktop assistive technology capabilities. Compatibility may vary based on platform versions.

**Legal Interpretation:** This document is provided for informational purposes and should not be construed as legal advice or legal compliance certification. Organizations should consult with their own legal counsel regarding accessibility obligations.

**Contact:** For questions about information on this page: accessibility@zspace.com

**Last Updated:** {{AUDIT_DATE}}
**Next Planned Update:** As significant changes occur or upon major version releases

---

*Information subject to change*
