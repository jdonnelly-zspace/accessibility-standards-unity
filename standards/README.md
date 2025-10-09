# Accessibility Standards

This directory contains comprehensive documentation of accessibility standards and compliance requirements.

## Contents

- **WCAG-2.2-LEVEL-A.md** - Web Content Accessibility Guidelines 2.2 Level A requirements
- **WCAG-2.2-LEVEL-AA.md** - WCAG 2.2 Level AA requirements (recommended minimum)
- **SECTION-508-US.md** - U.S. Federal Section 508 compliance mapping
- **EN-301-549-EU.md** - European Union accessibility standard mapping
- **VPAT-2.5-TEMPLATE.md** - Voluntary Product Accessibility Template for documenting compliance

## Quick Reference

### Compliance Targets

**Recommended Minimum:** WCAG 2.2 Level AA

This meets:
- ✅ US Federal Section 508 requirements
- ✅ EU EN 301 549 requirements
- ✅ Most international accessibility laws
- ✅ Industry best practices

### Priority Levels

- **Level A:** Minimum accessibility (must have)
- **Level AA:** Recommended accessibility (should have)
- **Level AAA:** Enhanced accessibility (nice to have)

## How to Use

1. **Start with WCAG-2.2-LEVEL-AA.md** - This is your primary checklist
2. **Use VPAT-2.5-TEMPLATE.md** - To document your compliance
3. **Reference regional standards** - Section 508 (US) or EN 301 549 (EU) as needed

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

Standards are reviewed and updated as W3C releases new versions. The web scraper in `/scrapers/` monitors for updates monthly.

Last reviewed: October 2025
Current version: WCAG 2.2 (October 2023)
