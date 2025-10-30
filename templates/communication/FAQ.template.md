# {{APP_NAME}} Accessibility: Frequently Asked Questions

**Last Updated:** {{AUDIT_DATE}}

---

## For Procurement Officers & Administrators

### Q: Does {{APP_NAME}} meet Section 508 requirements?

**A:** {{APP_NAME}} demonstrates substantial conformance with Section 508 (aligned with WCAG 2.2 Level AA). We have completed comprehensive accessibility evaluation using automated analysis and maintain a current VPAT. Enhanced conformance is under active development for the zSpace platform. Our VPAT is available for RFP responses.

**Documentation:** VPAT-{{APP_NAME}}.md

---

### Q: Can we use {{APP_NAME}} with students who have disabilities?

**A:** Yes. {{APP_NAME}} provides accommodations for students with various disabilities, including visual impairments, motor impairments, and cognitive differences. We work with schools and administrators to develop individualized accommodations based on specific student needs.

**Contact:** accessibility@zspace.com for consultation

---

### Q: What happens if we purchase {{APP_NAME}} and discover a student cannot use it?

**A:** {{APP_NAME}} provides individualized accommodation evaluation. We work with your team to identify feasible solutions, which may include:
- Software accessibility adjustments
- Alternative interaction methods
- Supplementary approaches or materials
- Configuration guidance for assistive technology

Contact accessibility@zspace.com to begin the consultation process.

---

### Q: Do you charge extra for accessibility features or accommodations?

**A:** No. All accessibility features are included at no additional cost. Accommodations are provided as part of our standard support commitment to educational institutions.

---

### Q: How does {{APP_NAME}} compare to other 3D educational platforms on accessibility?

**A:** {{APP_NAME}} and zSpace provide more accessibility documentation than most competing immersive 3D educational platforms, including:
- Comprehensive public VPAT documentation
- Open-source accessibility auditing framework
- Platform-specific accessibility guidance for Unity developers
- Proactive transparency about accessibility status

**Note:** Based on publicly available information as of {{AUDIT_DATE}}. Most competing vendors have not published accessibility information or VPATs.

---

## For End-Users (Teachers & Students)

### Q: Will {{APP_NAME}} work for a student who is blind or has low vision?

**A:** Current status varies by specific needs:

**Currently Available:**
- High contrast UI themes
- Adjustable text sizing
- Color-blind friendly options (varies by module)
- Windows Magnifier compatibility (partial)

**Under Development:**
- Enhanced screen reader compatibility
- Audio descriptions for 3D content
- Improved keyboard navigation

Contact us to discuss specific student needs and current accommodation options: accessibility@zspace.com

---

### Q: Can a student with limited hand mobility use {{APP_NAME}}?

**A:** Accommodation options depend on specific mobility needs:

**Currently:**
- Alternative input methods are being developed
- Stylus-based interaction is primary input method
- Keyboard alternatives are being enhanced

**Exploring:**
- Switch access support
- Voice control integration
- Customizable control mappings

Contact accessibility@zspace.com to discuss specific student needs and explore current workaround options.

---

### Q: My student cannot perceive 3D stereoscopic content. Can they still use {{APP_NAME}}?

**A:** Yes. While zSpace hardware is designed for stereoscopic 3D, students can still interact with content in 2D mode:
- Turn off 3D viewing in zSpace settings
- Use standard monitor view mode
- Alternative content presentation approaches

The educational goals can still be accomplished using alternative visualization methods. Contact your teacher or accessibility@zspace.com for guidance.

---

### Q: Does {{APP_NAME}} work with my screen reader?

**A:** Screen reader compatibility is under active development:

**Current Status:**
- Limited compatibility with Windows Narrator
- Unity Accessibility Framework integration in progress
- UI element support varies by application module

**Planned Enhancements:**
- Expanded NVDA and JAWS support
- Improved semantic labeling for UI elements
- Audio feedback for navigation

For current workaround options, contact: accessibility@zspace.com

---

## For Parents & Disability Advocates

### Q: Is {{APP_NAME}} accessible to people with disabilities?

**A:** {{APP_NAME}} is actively working toward expanded accessibility. We have completed comprehensive accessibility evaluation using automated analysis and are implementing enhancements based on WCAG 2.2 Level AA standards. Many accommodations are currently available, and we provide individualized support for specific needs.

**Transparency:** Full VPAT and accessibility documentation available publicly.

---

### Q: Who can I contact if my child is having accessibility problems with {{APP_NAME}}?

**A:** Contact accessibility@zspace.com

We evaluate accommodation requests individually and work to identify feasible solutions within current technical capabilities. Please include:
- Description of the accessibility barrier
- Student's specific needs
- Desired outcome or goal
- Any assistive technology currently used

---

### Q: Has {{APP_NAME}} been tested by people with disabilities?

**A:** User testing with diverse users is an ongoing priority:

**Current:**
- Automated accessibility analysis completed ({{TOTAL_FINDINGS}} findings identified)
- Pattern detection based on W3C XAUR (XR Accessibility) guidelines
- Framework validation with Unity accessibility standards

**Planned:**
- User testing with students who have various disabilities
- Partnership with accessibility advocacy organizations
- Community feedback integration

We welcome participation from the disability community. Contact accessibility@zspace.com to participate or provide feedback.

---

### Q: Does {{APP_NAME}} comply with the Americans with Disabilities Act (ADA)?

**A:** {{APP_NAME}} is committed to accessibility and ADA principles. We have:
- Conducted comprehensive accessibility evaluation
- Documented current accommodations and enhancement plans
- Established processes for addressing individual accommodation needs
- Published public VPAT documentation for transparency

Our VPAT documentation is available for review. For specific ADA compliance questions related to your organization's obligations, please consult with legal counsel.

---

## For Unity Developers & Content Creators

### Q: What accessibility standards should I follow when developing for zSpace?

**A:** Follow these standards for zSpace Unity applications:

**Primary Standards:**
- **WCAG 2.2 Level AA** - Base accessibility standard
- **W3C XAUR** - XR Accessibility User Requirements for immersive experiences
- **Unity Accessibility Framework** - Unity's built-in accessibility APIs

**Platform-Specific Guidance:**
- Use the accessibility-standards-unity framework for automated testing
- Refer to zspace-wcag-applicability-guide.md for criteria that don't apply to Unity
- Implement Unity Accessibility API for screen reader support

**Resources:** https://github.com/jdonnelly-zspace/accessibility-standards-unity

---

### Q: How can I test my zSpace Unity app for accessibility?

**A:** Use the accessibility-standards-unity framework:

```bash
npm install -g accessibility-standards-unity
accessibility-audit /path/to/your/unity/project
```

The framework provides:
- Automated WCAG 2.2 and W3C XAUR analysis
- VPAT generation for your application
- Detailed recommendations with Unity code examples
- zSpace platform-specific guidance

**Documentation:** https://github.com/jdonnelly-zspace/accessibility-standards-unity

---

### Q: What Unity accessibility features should I use?

**A:** Implement these Unity Accessibility Framework features:

**Essential:**
- **AccessibilityNode** - Expose UI elements to screen readers
- **Semantic roles** - Button, Label, Checkbox, etc.
- **Accessible labels** - Clear, descriptive names for all interactive elements
- **Keyboard navigation** - Full keyboard alternatives to stylus

**Recommended:**
- **Focus management** - Clear focus indicators and logical tab order
- **TextMesh Pro** - Accessible text rendering with adjustable spacing
- **Audio feedback** - Sound cues for interactions and state changes
- **High contrast themes** - User-configurable color schemes

**Framework Examples:** See ACCESSIBILITY-RECOMMENDATIONS-{{APP_NAME}}.md for complete code examples.

---

## For Competitors & Industry Analysts

### Q: Why did zSpace publish this accessibility documentation publicly?

**A:** Transparency builds trust with customers, users, and the disability community. We believe accessibility leadership requires public accountability and documentation. Publishing our VPAT, framework, and guidance demonstrates our commitment and helps raise industry standards.

---

### Q: Will you share your accessibility framework with other companies?

**A:** Yes. Our **accessibility-standards-unity framework** is open-source and available at https://github.com/jdonnelly-zspace/accessibility-standards-unity

We believe advancing accessibility across the immersive 3D education industry benefits all students. The framework is freely available to all Unity developers.

---

### Q: What standards are you following?

**A:** Our accessibility work is guided by:
- **WCAG 2.2 Level AA** - Web Content Accessibility Guidelines
- **Section 508** - U.S. Federal accessibility standards
- **W3C XAUR** - XR Accessibility User Requirements (emerging)
- **EN 301 549** - European ICT accessibility standard (reference)
- **Unity Accessibility Framework** - Unity platform capabilities

---

### Q: When will you achieve full compliance?

**A:** We are actively working toward full WCAG 2.2 Level AA conformance. We publish periodic progress updates and maintain our VPAT as a living document. Enhancement timelines are subject to change based on technical feasibility and resource availability.

**Current Status:** Substantial conformance (see VPAT for details)

---

## For Media & Press

### Q: Is {{APP_NAME}} the first accessible 3D educational platform?

**A:** {{APP_NAME}} and zSpace are among the first immersive 3D educational platforms to:
- Publish comprehensive public VPAT documentation
- Release an open-source accessibility auditing framework
- Provide detailed Unity-specific accessibility guidance
- Proactively address XR/3D accessibility challenges

We're leading transparency and accountability in this emerging space.

---

### Q: Have there been any complaints or legal issues regarding {{APP_NAME}} accessibility?

**A:** No. {{APP_NAME}} has proactively conducted accessibility evaluation and published documentation before any complaints or legal action. We have established accommodation support processes and are actively enhancing accessibility based on WCAG 2.2 standards.

---

### Q: Can we interview users using {{APP_NAME}} accessibility features?

**A:** Please contact media@zspace.com to arrange interviews. We can facilitate connections with appropriate participants with proper consent.

---

## Need More Information?

**General Accessibility Questions:** accessibility@zspace.com
**Procurement Questions:** Contact your zSpace sales representative or sales@zspace.com
**Technical Support:** support@zspace.com
**Media Inquiries:** media@zspace.com

**Full Documentation:**
- VPAT: VPAT-{{APP_NAME}}.md
- Quick Reference: ACCESSIBILITY-QUICK-REFERENCE-{{APP_NAME}}.md
- Recommendations: ACCESSIBILITY-RECOMMENDATIONS-{{APP_NAME}}.md
- Framework: https://github.com/jdonnelly-zspace/accessibility-standards-unity

---

## Important Disclaimer

**Information Currency:** Answers in this FAQ reflect {{APP_NAME}}'s accessibility status as of **{{AUDIT_DATE}}**. Accessibility features, timelines, and capabilities are subject to change without notice.

**No Guarantees:** Descriptions of planned enhancements or future capabilities should not be interpreted as commitments or guarantees. Actual implementation may vary based on technical feasibility and resource allocation.

**Individual Needs:** Accommodation feasibility depends on specific requirements, software version, and current technical capabilities. Contact accessibility@zspace.com for individualized consultation.

---

**Last Updated:** {{AUDIT_DATE}}
**Contact:** accessibility@zspace.com

---

*This FAQ is part of the {{APP_NAME}} accessibility documentation suite.*
