# Voluntary Product Accessibility Template (VPAT) 2.5

## WCAG Edition

**Company Name:** zSpace, Inc.
**Product Name:** {{APP_NAME}}
**Product Version:** Current
**Report Date:** {{AUDIT_DATE}}
**Last Updated:** {{AUDIT_DATE}}
**Contact:** accessibility@zspace.com

---

## Product Description

**{{APP_NAME}}** is a zSpace Unity application designed for interactive 3D experiences. The application leverages zSpace's stereoscopic 3D display and stylus-based interface.

**Technology Stack:**
- Unity Engine (detected {{TOTAL_SCENES}} scenes, {{TOTAL_SCRIPTS}} scripts)
- zSpace Unity SDK (stereoscopic 3D rendering, stylus input, head-tracking)
- Custom input handlers and UI components

**Deployment Model:** Desktop application for Windows 10/11 running on zSpace AIO Pro or Inspire devices.

---

## Evaluation Methods Used

### Automated Testing
- ✅ Unity codebase analysis using accessibility-standards-unity framework v{{FRAMEWORK_VERSION}}
- ✅ Static code analysis for accessibility patterns ({{TOTAL_SCRIPTS}} C# scripts)
- ✅ Pattern detection for WCAG 2.2 and W3C XAUR violations

### Automated Code Analysis
- ✅ Input system architecture review (stylus, mouse, keyboard detection)
- ✅ UI component accessibility review
- ✅ Scene structure analysis ({{TOTAL_SCENES}} Unity scenes)
{{#if KEYBOARD_SUPPORT_FOUND}}- ✅ Keyboard support patterns detected in codebase{{/if}}
{{#if SCREEN_READER_SUPPORT_FOUND}}- ✅ Screen reader compatibility patterns detected{{/if}}

### Standards Referenced
- ✅ WCAG 2.2 Level A and AA Success Criteria
- ✅ W3C XR Accessibility User Requirements (XAUR) - adapted for zSpace
- ✅ Section 508 (US) standards (aligned with WCAG 2.2 Level AA)
- ✅ EN 301 549 (EU) standards (aligned with WCAG 2.2 Level AA)

**Evaluation Date:** {{AUDIT_DATE}}
**Evaluator:** accessibility-standards-unity Framework v{{FRAMEWORK_VERSION}}

---

## Applicable Standards/Guidelines

This report covers the degree of conformance for the following accessibility standard/guidelines:

| Standard/Guideline | Included In Report |
|--------------------|-------------------|
| **Web Content Accessibility Guidelines 2.2** | Level A: ✅ Yes (30 criteria)<br>Level AA: ✅ Yes (20 criteria)<br>Level AAA: ⬜ No |
| **Section 508 (US)** | ✅ Yes (aligned with WCAG 2.2 Level AA) |
| **EN 301 549 (EU)** | ✅ Yes (aligned with WCAG 2.2 Level AA) |
| **W3C XAUR (XR Accessibility)** | ✅ Yes (zSpace-specific adaptations noted) |

---

## Terms

The terms used in the Conformance Level information are defined as follows:

| Term | Definition |
|------|------------|
| **✅ Supports** | The functionality of the product has at least one method that meets the criterion without known defects or meets with equivalent facilitation. |
| **⚠️ Partially Supports** | Some functionality of the product does not meet the criterion. |
| **❌ Does Not Support** | The majority of product functionality does not meet the criterion. |
| **N/A Not Applicable** | The criterion is not relevant to the product. |

---

## WCAG 2.2 Report - Level A Success Criteria

### Table 1: Success Criteria, Level A

**Overall Level A Status:** {{WCAG_LEVEL_A_STATUS}}

| Criteria | Conformance Level | Remarks and Explanations |
|----------|------------------|--------------------------|
| **1.1.1 Non-text Content (Level A)** | ⚠️ Automated Analysis | {{#if SCREEN_READER_SUPPORT_FOUND}}**Partial Support Detected:** Screen reader patterns found in codebase, but comprehensive validation requires manual testing.<br><br>**Recommendation:** Verify all interactive elements have accessible names and text alternatives.{{/if}}{{#if SCREEN_READER_SUPPORT_FOUND}}{{/if}}**No Screen Reader Support Detected:** Interactive elements may lack text alternatives for screen readers.<br><br>**Recommendation:** Add accessible labels to all interactive 3D objects and UI elements. Implement Unity Accessibility API or AccessibleStylusButton.cs component. |
| **1.2.1 Audio-only and Video-only (Prerecorded) (Level A)** | N/A Not Applicable | Unity application - automated analysis cannot determine if audio-only or video-only content exists. Manual review recommended. |
| **1.2.2 Captions (Prerecorded) (Level A)** | ⚠️ Automated Analysis | **No Caption System Detected:** Search for caption/subtitle patterns returned no results.<br><br>**Recommendation:** If application contains audio narration, implement SubtitleSystem.cs from accessibility-standards-unity framework. |
| **1.2.3 Audio Description or Media Alternative (Prerecorded) (Level A)** | N/A Not Applicable | Unity application - automated analysis cannot determine if video content requires audio description. Manual review recommended. |
| **1.3.1 Info and Relationships (Level A)** | ⚠️ Automated Analysis | **Partial Support Expected:** Unity Canvas hierarchy detected, but programmatic relationships not verified.<br><br>**Recommendation:** Ensure UI relationships are exposed to screen readers via Unity Accessibility API. |
| **1.3.2 Meaningful Sequence (Level A)** | ⚠️ Automated Analysis | {{#if KEYBOARD_SUPPORT_FOUND}}**Keyboard Support Detected:** Tab order should be validated manually.{{/if}}{{#if KEYBOARD_SUPPORT_FOUND}}{{/if}}**No Keyboard Navigation Detected:** Programmatic sequence cannot be validated without keyboard support.<br><br>**Recommendation:** Implement keyboard navigation and validate tab order. |
| **1.3.3 Sensory Characteristics (Level A)** | ⚠️ Automated Analysis | **Manual Validation Required:** Automated analysis cannot determine if instructions rely solely on sensory characteristics (shape, color, location).<br><br>**Recommendation:** Review all instructions to ensure they don't rely exclusively on visual or spatial cues. |
| **1.3.4 Orientation (Level AA - included for reference)** | ✅ Likely Supports | Desktop application with fixed orientation on zSpace display. Manual confirmation recommended. |
| **1.3.5 Identify Input Purpose (Level AA - included for reference)** | N/A Not Applicable | Unity application - automated analysis cannot determine if personal data fields exist. |
| **1.4.1 Use of Color (Level A)** | ⚠️ Automated Analysis | **Manual Validation Required:** Automated analysis cannot determine if color is the only visual means of conveying information.<br><br>**Recommendation:** Ensure interactive states use multiple visual cues (color + shape/icon/text). |
| **1.4.2 Audio Control (Level A)** | ⚠️ Automated Analysis | **Manual Validation Required:** Automated analysis cannot verify audio control mechanisms.<br><br>**Recommendation:** Ensure users can pause/stop/control volume of any audio >3 seconds. |
| **2.1.1 Keyboard (Level A)** | {{#if KEYBOARD_SUPPORT_FOUND}}⚠️ Partially Supports{{/if}}{{#if KEYBOARD_SUPPORT_FOUND}}{{/if}}❌ Does Not Support | {{#if KEYBOARD_SUPPORT_FOUND}}**Partial Support Detected:** Keyboard input patterns found in {{KEYBOARD_SUPPORT_FOUND}} scripts, but comprehensive coverage not verified.<br><br>**Recommendation:** Validate all interactive functionality is keyboard accessible.{{/if}}{{#if KEYBOARD_SUPPORT_FOUND}}{{/if}}**Critical Issue:** No keyboard input patterns detected in codebase ({{STYLUS_ONLY_SCRIPTS_COUNT}} stylus-only scripts found).<br><br>**Impact:** Users who cannot use stylus/mouse are excluded (10-15% of users).<br><br>**Recommendation:** IMMEDIATE implementation of KeyboardStylusAlternative.cs component. |
| **2.1.2 No Keyboard Trap (Level A)** | {{#if KEYBOARD_SUPPORT_FOUND}}⚠️ Requires Validation{{/if}}{{#if KEYBOARD_SUPPORT_FOUND}}{{/if}}N/A Not Applicable | {{#if KEYBOARD_SUPPORT_FOUND}}Keyboard support detected - manual testing required to verify no keyboard traps exist.{{/if}}{{#if KEYBOARD_SUPPORT_FOUND}}{{/if}}No keyboard navigation detected - criterion not applicable until keyboard support is implemented. |
| **2.1.4 Character Key Shortcuts (Level A)** | ⚠️ Automated Analysis | **Manual Validation Required:** Automated analysis cannot detect single-character shortcuts.<br><br>**Recommendation:** If shortcuts exist, ensure they can be remapped or disabled. |
| **2.2.1 Timing Adjustable (Level A)** | ⚠️ Automated Analysis | **Manual Validation Required:** Automated analysis cannot detect timeout behavior.<br><br>**Recommendation:** If timeouts exist, provide 20-second warning and ability to extend. |
| **2.2.2 Pause, Stop, Hide (Level A)** | ⚠️ Automated Analysis | **Manual Validation Required:** Automated analysis cannot detect auto-updating content.<br><br>**Recommendation:** Ensure users can pause/stop/hide any moving, blinking, or auto-updating content >5 seconds. |
| **2.3.1 Three Flashes or Below Threshold (Level A)** | ⚠️ Automated Analysis | **Manual Validation Required:** Automated analysis cannot detect flashing content.<br><br>**Recommendation:** Ensure no content flashes more than 3 times per second. |
| **2.4.1 Bypass Blocks (Level A)** | {{#if KEYBOARD_SUPPORT_FOUND}}⚠️ Requires Validation{{/if}}{{#if KEYBOARD_SUPPORT_FOUND}}{{/if}}❌ Does Not Support | {{#if KEYBOARD_SUPPORT_FOUND}}Keyboard support detected - verify skip navigation mechanism exists.{{/if}}{{#if KEYBOARD_SUPPORT_FOUND}}{{/if}}**No Skip Navigation Detected:** Without keyboard support, this criterion cannot be validated.<br><br>**Recommendation:** Add keyboard shortcuts to skip to main content areas. |
| **2.4.2 Page Titled (Level A)** | ⚠️ Automated Analysis | **Partial Support Expected:** {{TOTAL_SCENES}} Unity scenes have names, but runtime title announcements not verified.<br><br>**Recommendation:** Announce scene name when loading to screen readers or via audio cue. |
| **2.4.3 Focus Order (Level A)** | {{#if KEYBOARD_SUPPORT_FOUND}}⚠️ Requires Validation{{/if}}{{#if KEYBOARD_SUPPORT_FOUND}}{{/if}}❌ Does Not Support | {{#if KEYBOARD_SUPPORT_FOUND}}Keyboard support detected - manual testing required to validate logical focus order.{{/if}}{{#if KEYBOARD_SUPPORT_FOUND}}{{/if}}**No Keyboard Focus Detected:** Focus order cannot be validated without keyboard navigation.<br><br>**Recommendation:** Implement keyboard navigation with logical tab order. |
| **2.4.4 Link Purpose (In Context) (Level A)** | ⚠️ Automated Analysis | **Manual Validation Required:** Automated analysis cannot verify link text clarity.<br><br>**Recommendation:** Ensure all clickable elements have descriptive accessible names. |
| **2.5.1 Pointer Gestures (Level A)** | ⚠️ Automated Analysis | **Manual Validation Required:** Automated analysis cannot detect multi-point gestures.<br><br>**Recommendation:** Ensure all functionality uses simple pointer actions (no pinch, multi-finger swipe). |
| **2.5.2 Pointer Cancellation (Level A)** | ⚠️ Automated Analysis | **Manual Validation Required:** Automated analysis cannot verify pointer cancellation behavior.<br><br>**Recommendation:** Ensure actions complete on up-event, not down-event (allows cancellation). |
| **2.5.3 Label in Name (Level A)** | ⚠️ Automated Analysis | **Manual Validation Required:** Automated analysis cannot verify accessible names match visible labels.<br><br>**Recommendation:** Ensure accessible name includes visible label text for all controls. |
| **2.5.4 Motion Actuation (Level A)** | ✅ Likely Supports | zSpace head-tracking used for view, not input. Manual confirmation recommended to ensure no motion-based gestures required. |
| **3.1.1 Language of Page (Level A)** | ⚠️ Automated Analysis | **Manual Validation Required:** Automated analysis cannot determine content language.<br><br>**Recommendation:** Declare content language via accessibility API or audio announcement. |
| **3.2.1 On Focus (Level A)** | ⚠️ Automated Analysis | **Manual Validation Required:** Automated analysis cannot detect context changes on focus.<br><br>**Recommendation:** Ensure focus alone doesn't trigger navigation or form submission. |
| **3.2.2 On Input (Level A)** | ⚠️ Automated Analysis | **Manual Validation Required:** Automated analysis cannot detect context changes on input.<br><br>**Recommendation:** Ensure input changes require explicit user action (button click) before context changes. |
| **3.2.6 Consistent Help (Level A - WCAG 2.2 NEW)** | ⚠️ Automated Analysis | **Manual Validation Required:** Automated analysis cannot verify help consistency across scenes.<br><br>**Recommendation:** If help mechanism exists, ensure it appears in same location across all {{TOTAL_SCENES}} scenes. |
| **3.3.1 Error Identification (Level A)** | ⚠️ Automated Analysis | **Manual Validation Required:** Automated analysis cannot validate error identification.<br><br>**Recommendation:** Ensure errors are identified in text and suggested corrections provided. |
| **3.3.2 Labels or Instructions (Level A)** | ⚠️ Automated Analysis | **Manual Validation Required:** Automated analysis cannot verify instruction clarity.<br><br>**Recommendation:** Ensure all inputs have clear labels or instructions. |
| **3.3.7 Redundant Entry (Level A - WCAG 2.2 NEW)** | ⚠️ Automated Analysis | **Manual Validation Required:** Automated analysis cannot detect redundant data entry.<br><br>**Recommendation:** Avoid requiring users to re-enter previously provided information. |
| **4.1.1 Parsing (Level A)** | ✅ Likely Supports | Unity engine handles scene structure. {{TOTAL_SCENES}} scenes analyzed, no parsing issues detected. |
| **4.1.2 Name, Role, Value (Level A)** | {{#if SCREEN_READER_SUPPORT_FOUND}}⚠️ Partially Supports{{/if}}{{#if SCREEN_READER_SUPPORT_FOUND}}{{/if}}❌ Does Not Support | {{#if SCREEN_READER_SUPPORT_FOUND}}**Partial Support Detected:** Screen reader patterns found, but comprehensive validation required.<br><br>**Recommendation:** Verify all UI elements expose name, role, and value to assistive technologies.{{/if}}{{#if SCREEN_READER_SUPPORT_FOUND}}{{/if}}**Critical Issue:** No Unity Accessibility API implementation detected.<br><br>**Impact:** Screen readers cannot identify buttons, read labels, or announce state changes. Application unusable for blind users.<br><br>**Recommendation:** IMMEDIATE implementation of AccessibleStylusButton.cs and Unity Accessibility API. |

---

## WCAG 2.2 Report - Level AA Success Criteria

### Table 2: Success Criteria, Level AA

**Overall Level AA Status:** {{WCAG_LEVEL_AA_STATUS}}

| Criteria | Conformance Level | Remarks and Explanations |
|----------|------------------|--------------------------|
| **1.2.4 Captions (Live) (Level AA)** | N/A Not Applicable | Unity application - automated analysis cannot determine if live audio exists. |
| **1.2.5 Audio Description (Prerecorded) (Level AA)** | N/A Not Applicable | Unity application - automated analysis cannot determine if prerecorded video exists. |
| **1.3.4 Orientation (Level AA)** | ✅ Likely Supports | Desktop application with fixed landscape orientation on zSpace display. |
| **1.3.5 Identify Input Purpose (Level AA)** | N/A Not Applicable | Unity application - automated analysis cannot determine if personal data collection exists. |
| **1.4.3 Contrast (Minimum) (Level AA)** | ⚠️ Automated Analysis | **UNVALIDATED - Manual Testing Required:** Color contrast ratios not verified by automated analysis.<br><br>**Requirements:**<br>- Normal text: ≥4.5:1 contrast ratio<br>- Large text: ≥3.0:1 contrast ratio<br>- UI components: ≥3.0:1 contrast ratio<br><br>**Recommendation:** Use ContrastCheckerZSpace.cs tool to validate all text and UI elements on actual zSpace display. |
| **1.4.4 Resize Text (Level AA)** | ⚠️ Automated Analysis | **Manual Validation Required:** Text scaling to 200% not tested.<br><br>**Recommendation:** Test all {{TOTAL_SCENES}} scenes with text size increased to 200%, ensure no loss of content or functionality. |
| **1.4.5 Images of Text (Level AA)** | ⚠️ Automated Analysis | **Manual Validation Required:** Automated analysis cannot detect images of text.<br><br>**Recommendation:** Verify all text uses actual text rendering (TextMesh Pro), not images. |
| **1.4.10 Reflow (Level AA)** | N/A Not Applicable | Desktop application with fixed resolution on zSpace display - reflow not applicable. |
| **1.4.11 Non-text Contrast (Level AA)** | ⚠️ Automated Analysis | **UNVALIDATED - Manual Testing Required:** UI component contrast ratios not verified.<br><br>**Requirement:** UI components must have ≥3.0:1 contrast ratio against adjacent colors.<br><br>**Recommendation:** Validate all interactive elements meet 3:1 minimum contrast. |
| **1.4.12 Text Spacing (Level AA)** | ⚠️ Automated Analysis | **Manual Validation Required:** Text spacing adjustments not tested.<br><br>**Recommendation:** Test with increased line height, paragraph spacing, letter spacing, and word spacing. |
| **1.4.13 Content on Hover or Focus (Level AA)** | ⚠️ Automated Analysis | **Manual Validation Required:** Tooltip dismissibility, hoverability, and persistence not verified.<br><br>**Recommendation:** If tooltips exist, ensure they can be dismissed, hovered over, and remain visible until user action. |
| **2.4.5 Multiple Ways (Level AA)** | ⚠️ Automated Analysis | **Manual Validation Required:** Automated analysis cannot detect multiple navigation methods.<br><br>**Recommendation:** Provide at least 2 ways to locate content (menu + search, menu + shortcuts, etc.). |
| **2.4.6 Headings and Labels (Level AA)** | ⚠️ Automated Analysis | **Manual Validation Required:** Semantic heading structure not verified.<br><br>**Recommendation:** Mark heading hierarchy using Unity Accessibility API or semantic metadata. |
| **2.4.7 Focus Visible (Level AA)** | {{#if FOCUS_INDICATORS_FOUND}}⚠️ Partially Supports{{/if}}{{#if FOCUS_INDICATORS_FOUND}}{{/if}}❌ Does Not Support | {{#if FOCUS_INDICATORS_FOUND}}**Partial Support Detected:** Focus indicator patterns found in codebase, but comprehensive validation required.<br><br>**Recommendation:** Verify focus indicators are clearly visible with ≥3:1 contrast ratio.{{/if}}{{#if FOCUS_INDICATORS_FOUND}}{{/if}}**Critical Issue:** No keyboard focus indicators detected.<br><br>**Requirements:**<br>- Focus indicator must be clearly visible<br>- Minimum 3:1 contrast ratio against adjacent colors<br>- Must move with keyboard navigation<br><br>**Recommendation:** IMMEDIATE implementation of ZSpaceFocusIndicator.cs component. |
| **2.4.11 Focus Not Obscured (Minimum) (Level AA - WCAG 2.2 NEW)** | ⚠️ Automated Analysis | {{#if KEYBOARD_SUPPORT_FOUND}}Keyboard support detected - manual testing required to ensure focused elements not obscured.{{/if}}{{#if KEYBOARD_SUPPORT_FOUND}}{{/if}}Cannot evaluate without keyboard focus implementation. |
| **2.5.7 Dragging Movements (Level AA - WCAG 2.2 NEW)** | ⚠️ Automated Analysis | **Manual Validation Required:** Automated analysis cannot detect drag-and-drop without alternatives.<br><br>**Recommendation:** Ensure all drag-and-drop has single-pointer alternative (click-to-select, arrow keys to move). |
| **2.5.8 Target Size (Minimum) (Level AA - WCAG 2.2 NEW)** | ⚠️ Automated Analysis | **UNVALIDATED - Manual Testing Required:** Interactive target sizes not measured.<br><br>**Requirement:** Minimum 24x24 CSS pixels for all interactive targets.<br><br>**Recommendation:** Use ZSpaceAccessibilityValidator.cs tool to measure all buttons, controls, and interactive 3D objects. |
| **3.1.2 Language of Parts (Level AA)** | ⚠️ Automated Analysis | **Manual Validation Required:** Mixed-language content detection not possible via automated analysis.<br><br>**Recommendation:** If mixed-language content exists, mark language changes programmatically. |
| **3.2.3 Consistent Navigation (Level AA)** | ⚠️ Automated Analysis | **Manual Validation Required:** Navigation consistency across {{TOTAL_SCENES}} scenes not verified.<br><br>**Recommendation:** Audit all scenes, ensure navigation elements appear in same relative location. |
| **3.2.4 Consistent Identification (Level AA)** | ⚠️ Automated Analysis | **Manual Validation Required:** Component identification consistency not verified.<br><br>**Recommendation:** Ensure same functionality has same accessible name throughout application. |
| **3.2.6 Consistent Help (Level AA - WCAG 2.2 NEW)** | ⚠️ Automated Analysis | **Manual Validation Required:** Help mechanism consistency not verified.<br><br>**Recommendation:** If help exists, ensure it appears in same location across all scenes. |
| **3.3.3 Error Suggestion (Level AA)** | ⚠️ Automated Analysis | **Manual Validation Required:** Error suggestion quality not verified.<br><br>**Recommendation:** Ensure all error messages provide specific correction suggestions. |
| **3.3.4 Error Prevention (Legal, Financial, Data) (Level AA)** | ⚠️ Automated Analysis | **Manual Validation Required:** Confirmation dialogs for critical actions not verified.<br><br>**Recommendation:** Add confirmation before destructive actions (delete, reset, exit without saving). |
| **3.3.8 Accessible Authentication (Minimum) (Level AA - WCAG 2.2 NEW)** | N/A Not Applicable | Unity application - automated analysis suggests no authentication system detected. |

---

## W3C XR Accessibility User Requirements (XAUR) - zSpace Adaptations

### Overview

The W3C XR Accessibility User Requirements (XAUR) specification provides guidance for making Extended Reality (XR) experiences accessible. While primarily focused on immersive VR/AR headsets, many principles apply to zSpace's desktop stereoscopic 3D platform.

**Platform Context:**
- **zSpace Desktop Stereoscopic 3D:** 24" display, tracked glasses (3DOF), stylus input, seated desktop experience
- **Key Difference from VR/AR:** User can see physical environment, fixed viewing distance, no room-scale locomotion

### Critical XAUR Requirements for zSpace

| XAUR User Need | Status | Remarks |
|----------------|--------|---------|
| **UN 1: Assistive Technology Integration** | {{#if SCREEN_READER_SUPPORT_FOUND}}⚠️ Partial{{/if}}{{#if SCREEN_READER_SUPPORT_FOUND}}{{/if}}❌ Not Detected | {{#if SCREEN_READER_SUPPORT_FOUND}}Screen reader patterns detected - validate Windows Narrator/NVDA compatibility.{{/if}}{{#if SCREEN_READER_SUPPORT_FOUND}}{{/if}}No Unity Accessibility API implementation detected. Integrate with Windows screen readers. |
| **UN 2: Multiple Input Methods** | {{#if KEYBOARD_SUPPORT_FOUND}}⚠️ Partial{{/if}}{{#if KEYBOARD_SUPPORT_FOUND}}{{/if}}❌ Limited | {{#if KEYBOARD_SUPPORT_FOUND}}Keyboard patterns detected - validate full keyboard accessibility across all features.{{/if}}{{#if KEYBOARD_SUPPORT_FOUND}}{{/if}}Stylus/mouse only detected. Add keyboard, voice command alternatives. |
| **UN 5: Clear Focus Indicators** | {{#if FOCUS_INDICATORS_FOUND}}⚠️ Partial{{/if}}{{#if FOCUS_INDICATORS_FOUND}}{{/if}}❌ Not Detected | {{#if FOCUS_INDICATORS_FOUND}}Focus patterns detected - validate visibility and contrast ratios.{{/if}}{{#if FOCUS_INDICATORS_FOUND}}{{/if}}No focus indicators detected. Implement visual/audio/haptic feedback for focused elements. |
| **UN 10: Environment Descriptions** | {{#if SCREEN_READER_SUPPORT_FOUND}}⚠️ Partial{{/if}}{{#if SCREEN_READER_SUPPORT_FOUND}}{{/if}}❌ Not Detected | 3D objects and environments need accessible names and descriptions for screen readers. |
| **UN 11: Non-Visual Information** | ⚠️ Requires Validation | Audio/haptic alternatives to visual information not verified by automated analysis. |
| **UN 12: Captions for Audio** | ⚠️ Not Detected | No caption/subtitle system detected. Implement if audio narration exists. |
| **UN 17: Stereoscopic Depth Alternatives** | ❌ CRITICAL for zSpace | **CRITICAL:** No depth cue system detected.<br><br>**Impact:** 10-15% of users cannot perceive stereoscopic depth (stereoblindness, monocular vision).<br><br>**Recommendation:** IMMEDIATE implementation of DepthCueManager.cs with multiple depth cues (size scaling, shadows, spatial audio, haptic feedback). |

---

## Automated Findings Summary

### Detected Accessibility Patterns

**✅ Positive Indicators:**
{{#if KEYBOARD_SUPPORT_FOUND}}- Keyboard input patterns found in codebase{{/if}}
{{#if SCREEN_READER_SUPPORT_FOUND}}- Screen reader compatibility patterns detected{{/if}}
{{#if FOCUS_INDICATORS_FOUND}}- Focus indicator patterns found{{/if}}
{{#if ACCESSIBILITY_COMPONENTS_FOUND}}- Accessibility framework components detected{{/if}}

**❌ Critical Gaps:**
{{#if KEYBOARD_SUPPORT_FOUND}}{{/if}}{{#if KEYBOARD_SUPPORT_FOUND}}{{/if}}- No keyboard input patterns detected ({{STYLUS_ONLY_SCRIPTS_COUNT}} stylus-only scripts)
{{#if SCREEN_READER_SUPPORT_FOUND}}{{/if}}{{#if SCREEN_READER_SUPPORT_FOUND}}{{/if}}- No screen reader support patterns found
{{#if FOCUS_INDICATORS_FOUND}}{{/if}}{{#if FOCUS_INDICATORS_FOUND}}{{/if}}- No focus indicator patterns detected
{{#if ACCESSIBILITY_COMPONENTS_FOUND}}{{/if}}{{#if ACCESSIBILITY_COMPONENTS_FOUND}}{{/if}}- No accessibility framework components found

### Compliance Estimate

**Overall Compliance Score:** {{COMPLIANCE_SCORE}}% ({{COMPLIANCE_LEVEL}})

**WCAG 2.2 Conformance:**
- Level A: {{WCAG_LEVEL_A_STATUS}}
- Level AA: {{WCAG_LEVEL_AA_STATUS}}

**Legal Risk Level:** {{LEGAL_RISK_LEVEL}}

**Critical Issues Found:** {{CRITICAL_COUNT}}
**High Priority Issues:** {{HIGH_COUNT}}
**Medium Priority Issues:** {{MEDIUM_COUNT}}
**Low Priority Issues:** {{LOW_COUNT}}

---

## Recommendations

### Immediate Actions (Critical)

{{#each CRITICAL_ISSUES}}
**{{@index}}. {{title}} ({{id}})**
- **Impact:** {{impact}}
- **Recommendation:** {{recommendation}}

{{/each}}

### High Priority Actions

{{#each HIGH_ISSUES}}
**{{@index}}. {{title}}**
- **Impact:** {{impact}}
- **Recommendation:** {{recommendation}}

{{/each}}

### Validation Required

The following areas require manual validation that automated analysis cannot perform:

1. **Color Contrast:** Validate all text and UI components meet WCAG contrast requirements using ContrastCheckerZSpace.cs tool
2. **Target Sizes:** Measure all interactive elements meet 24x24px minimum using ZSpaceAccessibilityValidator.cs tool
3. **Audio Captions:** If audio narration exists, implement synchronized captions
4. **Depth Alternatives:** Test application with stereoscopic 3D disabled, ensure depth cues provide sufficient spatial information
5. **Keyboard Testing:** If keyboard support exists, test complete workflows using keyboard only
6. **Screen Reader Testing:** If screen reader support exists, test with Windows Narrator/NVDA
7. **Sensory Characteristics:** Review all instructions to ensure they don't rely solely on visual/spatial cues

---

## Known Limitations of Automated Analysis

This VPAT was generated using automated code analysis. The following limitations apply:

**❌ Cannot Detect:**
- Color contrast ratios (requires visual analysis on actual display)
- Interactive element sizes (requires Unity Editor measurement tools)
- Audio/video content and caption quality
- Tooltip and modal dialog behavior
- Timeout and session management
- Actual keyboard navigation usability
- Screen reader announcement quality
- Visual design patterns (color-only indicators, etc.)
- Content language and mixed-language text
- Error message clarity and suggestions

**✅ Can Detect:**
- Code patterns for keyboard input handlers
- Screen reader API implementation
- Focus indicator code patterns
- Accessibility component usage
- Input method dependencies (stylus-only scripts)
- Basic scene and script structure

**Recommendation:** This automated VPAT provides a foundation. Manual validation by accessibility experts is strongly recommended for procurement use, legal compliance documentation, and comprehensive WCAG 2.2 certification.

---

## Legal Disclaimer

This VPAT was generated automatically using the accessibility-standards-unity framework v{{FRAMEWORK_VERSION}}.

**Important:** This is an **automated analysis** that detects code patterns and potential accessibility issues. It does NOT replace manual accessibility testing or certification by qualified accessibility professionals.

**For Procurement Use:** Manual validation and expert review strongly recommended.

**For Legal Compliance:** Conduct comprehensive accessibility audit with manual testing.

**Contact:** See framework documentation at https://github.com/jdonnelly-zspace/accessibility-standards-unity

---

**Report Date:** {{AUDIT_DATE}}
**Generated By:** accessibility-standards-unity v{{FRAMEWORK_VERSION}}
**VPAT Version:** 2.5 Rev (Comprehensive - Automated Analysis)

---

*VPAT® is a registered trademark of the Information Technology Industry Council (ITI).*

**Template Based On:** VPAT 2.5 WCAG Edition
**Framework:** https://github.com/jdonnelly-zspace/accessibility-standards-unity
