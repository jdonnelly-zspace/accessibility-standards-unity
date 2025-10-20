# Accessibility Standards

This directory contains comprehensive documentation of accessibility standards and compliance requirements for zSpace Unity applications.

## Contents

### Core Standards
- **WCAG-2.2-LEVEL-AA.md** - WCAG 2.2 Level AA requirements (recommended minimum, 57 criteria adapted for zSpace)
- **ZSPACE-ACCESSIBILITY-CHECKLIST.md** - Combined WCAG + XAUR checklist specifically for zSpace platform
- **XR-ACCESSIBILITY-REQUIREMENTS.md** - W3C XR Accessibility User Requirements adapted for zSpace
- **VPAT-2.5-TEMPLATE.md** - Voluntary Product Accessibility Template for documenting compliance

### Platform Integration
- **WINDOWS-NARRATOR-INTEGRATION-GUIDE.md** - Windows Narrator support for zSpace applications (Unity 2023.2+)

## Quick Reference

### Compliance Targets

**Recommended Minimum:** WCAG 2.2 Level AA + W3C XAUR

This meets:
- ✅ US Federal Section 508 requirements
- ✅ EU EN 301 549 requirements
- ✅ Most international accessibility laws
- ✅ Industry best practices for XR/stereoscopic platforms

### Priority Levels

- **Level A:** Minimum accessibility (must have)
- **Level AA:** Recommended accessibility (should have) - **Target for zSpace**
- **Level AAA:** Enhanced accessibility (nice to have)

## How to Use for zSpace Unity Development

1. **Start with ZSPACE-ACCESSIBILITY-CHECKLIST.md** - Your primary zSpace-specific checklist
2. **Reference WCAG-2.2-LEVEL-AA.md** - Detailed success criteria with Unity code examples
3. **Check XR-ACCESSIBILITY-REQUIREMENTS.md** - 3D/stereoscopic-specific requirements
4. **Review WINDOWS-NARRATOR-INTEGRATION-GUIDE.md** - Screen reader implementation
5. **Use VPAT-2.5-TEMPLATE.md** - To document your compliance for clients/stakeholders

## Standards Overview

### WCAG 2.2 Structure

WCAG is organized into **4 principles**, **13 guidelines**, and **86 success criteria**:

**1. Perceivable** - Information must be presentable to users in ways they can perceive
- Text Alternatives (1.1)
- Time-based Media (1.2)
- Adaptable (1.3)
- Distinguishable (1.4)

**2. Operable** - User interface components must be operable
- Keyboard Accessible (2.1)
- Enough Time (2.2)
- Seizures and Physical Reactions (2.3)
- Navigable (2.4)
- Input Modalities (2.5)

**3. Understandable** - Information and operation must be understandable
- Readable (3.1)
- Predictable (3.2)
- Input Assistance (3.3)

**4. Robust** - Content must be robust enough for assistive technologies
- Compatible (4.1)

## Related Resources

- W3C WCAG 2.2 Official: https://www.w3.org/WAI/WCAG22/quickref/
- Section 508: https://www.section508.gov/
- EN 301 549: https://www.etsi.org/deliver/etsi_en/301500_301599/301549/
- VPAT Templates: https://www.itic.org/policy/accessibility/vpat

## Updates

Standards are reviewed and updated as W3C releases new versions.

Last reviewed: October 2025
Current version: WCAG 2.2 (October 2023)

## zSpace-Specific Adaptations

All WCAG 2.2 criteria have been adapted for:
- **Stereoscopic 3D display** - Depth perception alternatives (10-15% of users)
- **Stylus input** - Keyboard/mouse alternatives required
- **Desktop platform** - Windows screen reader support (NVDA, Narrator, JAWS)
- **Unity 2023.2+** - Accessibility Module integration
- **Seated experience** - Desktop-appropriate target sizes (24px minimum vs 44px for VR)
