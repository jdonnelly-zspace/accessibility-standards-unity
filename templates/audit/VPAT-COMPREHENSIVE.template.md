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
{{#if PHASE1_TEXT_CONTRAST}}- ✨ **Phase 1:** OCR-based text contrast analysis (WCAG 1.4.3){{/if}}
{{#if PHASE2_SCENE_TITLES}}- ✨ **Phase 2:** Semantic scene structure analysis (7 WCAG criteria){{/if}}

### Automated Code Analysis
- ✅ Input system architecture review (stylus, mouse, keyboard detection)
- ✅ UI component accessibility review
- ✅ Scene structure analysis ({{TOTAL_SCENES}} Unity scenes)
{{#if KEYBOARD_SUPPORT_FOUND}}- ✅ Keyboard support patterns detected in codebase{{/if}}
{{#if SCREEN_READER_SUPPORT_FOUND}}- ✅ Screen reader compatibility patterns detected{{/if}}

{{#if PHASE2_SCENE_TITLES}}
### Advanced Automated Analysis (Phase 1 & 2)
{{#if PHASE1_TEXT_CONTRAST}}- ✅ **1.4.3 Contrast (Minimum):** OCR-based text extraction and WCAG contrast validation{{/if}}
{{#if PHASE2_SCENE_TITLES}}- ✅ **2.4.2 Page Titled:** Scene title detection and accessibility markup verification{{/if}}
{{#if PHASE2_FOCUS_ORDER}}- ✅ **2.4.3 Focus Order:** Keyboard focus order vs visual order comparison{{/if}}
{{#if PHASE2_HEADINGS_LABELS}}- ✅ **2.4.6 Headings and Labels:** Label quality and programmatic association analysis{{/if}}
{{#if PHASE2_TEXT_RESIZE}}- ✅ **1.4.4 Resize Text:** Layout flexibility and text scaling compatibility analysis{{/if}}
{{#if PHASE2_CONSISTENT_NAV}}- ✅ **3.2.3 Consistent Navigation:** Cross-scene navigation consistency analysis{{/if}}
{{#if PHASE2_CONSISTENT_ID}}- ✅ **3.2.4 Consistent Identification:** Component identification consistency analysis{{/if}}
{{/if}}

### Visual Accessibility Analysis
{{#if VISUAL_ANALYSIS_PERFORMED}}
- ✅ Screenshot capture completed ({{SCREENSHOTS_COUNT}} scenes)
- ✅ Color contrast analysis (WCAG 2.1 standards)
- ✅ Color-blind simulation (8 vision types)
- ✅ Visual heatmap generation
- ✅ Dominant color extraction
{{/if}}
{{#if VISUAL_ANALYSIS_NOT_PERFORMED}}
- ⬜ Visual analysis not performed
- ℹ️ Run with `--capture-screenshots` flag to enable visual analysis
{{/if}}

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
| **[1.1.1 Non-text Content](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content) (Level A)** | {{#if SCREEN_READER_SUPPORT_FOUND}}Partially Supports{{/if}} | {{#if SCREEN_READER_SUPPORT_FOUND}}Screen reader API patterns detected in codebase.<br><br>**Manual review required** to verify all interactive elements (3D objects, UI controls, images) have appropriate text alternatives programmatically determined for assistive technologies.{{else}}**Manual review required** to verify all non-text content has text alternatives programmatically determined for assistive technologies.<br><br>Interactive elements may not be accessible without Unity Accessibility API implementation.{{/if}} |
| **[1.2.1 Audio-only and Video-only (Prerecorded)](https://www.w3.org/WAI/WCAG22/Understanding/audio-only-and-video-only-prerecorded) (Level A)** | Not Applicable | Unity application - no audio-only or video-only content detected in codebase analysis. If such content exists, **manual review required** to verify text alternatives are provided. |
| **[1.2.2 Captions (Prerecorded)](https://www.w3.org/WAI/WCAG22/Understanding/captions-prerecorded) (Level A)** | {{#if CAPTIONS_DETECTED}}Supports{{/if}} | {{#if CAPTIONS_DETECTED}}Caption system detected in codebase.<br><br>**Manual review required** to verify captions are synchronized, accurate, and include all dialogue and sound effects.{{else}}**Manual review required** to determine if audio content exists and requires captions. If audio narration is present, captions must be provided for all prerecorded audio in synchronized media.{{/if}} |
| **[1.2.3 Audio Description or Media Alternative (Prerecorded)](https://www.w3.org/WAI/WCAG22/Understanding/audio-description-or-media-alternative-prerecorded) (Level A)** | Not Applicable | Unity application - no video content detected in codebase analysis. If video content exists, **manual review required** to verify audio description or text alternative is provided. |
| **[1.3.1 Info and Relationships](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships) (Level A)** | {{#if SCREEN_READER_SUPPORT_FOUND}}Partially Supports{{/if}} | {{#if SCREEN_READER_SUPPORT_FOUND}}Unity Accessibility API patterns detected.<br><br>**Manual review required** to verify UI structure, headings, labels, and relationships are programmatically determined for assistive technologies.{{else}}**Manual review required** to verify information structure and relationships are programmatically determined.<br><br>UI hierarchy should be accessible via Unity Accessibility API or equivalent assistive technology integration.{{/if}} |
| **[1.3.2 Meaningful Sequence](https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence) (Level A)** |  | {{#if KEYBOARD_SUPPORT_FOUND}}**Manual review required** to verify reading and navigation order matches the meaningful sequence of content.{{else}}**Manual review required** to verify content presentation sequence affects meaning and is programmatically determined.<br><br>Keyboard navigation implementation needed to validate tab order.{{/if}} |
| **[1.3.3 Sensory Characteristics](https://www.w3.org/WAI/WCAG22/Understanding/sensory-characteristics) (Level A)** |  | **Manual review required** to verify instructions do not rely solely on sensory characteristics (shape, size, visual location, orientation, or sound).<br><br>All instructions should use multiple cues to identify elements. |
| **[1.3.4 Orientation](https://www.w3.org/WAI/WCAG22/Understanding/orientation) (Level AA)** | Supports | Desktop application with fixed landscape orientation on zSpace display. Content does not restrict viewing to a single orientation. |
| **[1.3.5 Identify Input Purpose](https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose) (Level AA)** | Not Applicable | No personal data input fields detected in codebase analysis. If data collection exists, **manual review required** to verify input purpose is programmatically determined. |
| **[1.4.1 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color) (Level A)** | {{#if COLOR_BLIND_ANALYSIS_PERFORMED}}{{#if COLOR_BLIND_ISSUES_FOUND}}Partially Supports{{/if}}{{/if}} | {{#if COLOR_BLIND_ANALYSIS_PERFORMED}}Color-blind simulation performed on {{SCREENSHOTS_COUNT}} scenes with 8 vision types.<br><br>{{#if COLOR_BLIND_ISSUES_FOUND}}Information loss detected in color-blind simulations: {{COLOR_BLIND_AFFECTED_TYPES}}.<br><br>**Manual review required** to verify non-color cues (icons, patterns, text labels, shapes) are provided to distinguish elements. Review comparison HTML reports in screenshots/[SceneName]/colorblind/ directories.{{else}}No significant information loss detected in color-blind simulations.<br><br>**Manual review required** to verify color is not the only visual means of conveying information, indicating an action, prompting a response, or distinguishing elements.{{/if}}{{else}}**Manual review required** to verify color is not the only visual means of conveying information.<br><br>All interactive states should use multiple visual cues (color + shape/icon/text/pattern).{{/if}} |
| **[1.4.2 Audio Control](https://www.w3.org/WAI/WCAG22/Understanding/audio-control) (Level A)** |  | **Manual review required** to verify audio control mechanisms.<br><br>If audio plays automatically for more than 3 seconds, a mechanism must be available to pause, stop, or control volume independently of system volume. |
| **[2.1.1 Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard) (Level A)** | {{#if KEYBOARD_SUPPORT_FOUND}}Partially Supports{{else}}Does Not Support{{/if}} | {{#if KEYBOARD_SUPPORT_FOUND}}Keyboard input code patterns detected in codebase.<br><br>**Manual review required** to verify all functionality is operable through keyboard interface without requiring specific timings for individual keystrokes (except where the underlying function requires input that depends on the path of the user's movement, such as stylus interaction in 3D space).{{else}}No keyboard input patterns detected in codebase analysis. Application appears to rely solely on stylus and mouse input.<br><br>Users unable to use pointing devices will be unable to access functionality. Keyboard alternatives required for all interactive elements.{{/if}} |
| **[2.1.2 No Keyboard Trap](https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap) (Level A)** | {{#if KEYBOARD_SUPPORT_FOUND}}{{else}}Not Applicable{{/if}} | {{#if KEYBOARD_SUPPORT_FOUND}}**Manual review required** to verify keyboard focus can be moved away from all components using standard navigation (Tab, Shift+Tab, arrow keys) or documented exit methods.{{else}}Keyboard navigation not implemented. Criterion not applicable until keyboard support is added.{{/if}} |
| **[2.1.4 Character Key Shortcuts](https://www.w3.org/WAI/WCAG22/Understanding/character-key-shortcuts) (Level A)** |  | **Manual review required** to verify single-character keyboard shortcuts can be turned off, remapped, or are only active when the relevant component has focus. |
| **[2.2.1 Timing Adjustable](https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable) (Level A)** |  | **Manual review required** to verify any time limits can be turned off, adjusted, or extended before time expires (minimum 10x the default, or 20-second warning with extend option). |
| **[2.2.2 Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide) (Level A)** |  | **Manual review required** to verify users can pause, stop, or hide any moving, blinking, scrolling, or auto-updating content that lasts more than 5 seconds. |
| **[2.3.1 Three Flashes or Below Threshold](https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold) (Level A)** |  | **Manual review required** to verify no content flashes more than 3 times per second, or flashing is below general flash and red flash thresholds. |
| **[2.4.1 Bypass Blocks](https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks) (Level A)** | {{#if KEYBOARD_SUPPORT_FOUND}}{{else}}Not Applicable{{/if}} | {{#if KEYBOARD_SUPPORT_FOUND}}**Manual review required** to verify skip navigation mechanisms exist for keyboard users to bypass repeated blocks of content.{{else}}Desktop application without web-style repeated navigation blocks. Criterion may not apply to application structure. **Manual review required** if application has repeated navigation elements across scenes.{{/if}} |
| **[2.4.2 Page Titled](https://www.w3.org/WAI/WCAG22/Understanding/page-titled) (Level A)** | {{#if PHASE2_SCENE_TITLES}}{{#if PHASE2_SCENE_TITLES_ISSUES}}Partially Supports{{else}}Supports{{/if}}{{/if}} | {{#if PHASE2_SCENE_TITLES}}**✨ Automated analysis performed** on {{TOTAL_SCENES}} scenes.<br><br>{{#if PHASE2_SCENE_TITLES_ISSUES}}{{PHASE2_SCENE_TITLES_MISSING}} scenes missing titles, {{PHASE2_SCENE_TITLES_INACCESSIBLE}} titles not accessible to assistive technologies.<br><br>Issues detected:<br>{{PHASE2_SCENE_TITLES_SUMMARY}}<br><br>**Manual verification recommended** to ensure titles are descriptive and properly announced.{{else}}All scenes have descriptive titles with proper accessibility markup.<br><br>**Manual verification recommended** to confirm title quality.{{/if}}{{else}}**Manual review required** to verify each scene/view has a descriptive title or heading programmatically determined for assistive technologies.<br><br>Unity scene names ({{TOTAL_SCENES}} scenes detected) may not be exposed to assistive technologies unless explicitly announced. Title should describe the topic or purpose of the current view.{{/if}} |
| **[2.4.3 Focus Order](https://www.w3.org/WAI/WCAG22/Understanding/focus-order) (Level A)** | {{#if PHASE2_FOCUS_ORDER}}{{#if PHASE2_FOCUS_ORDER_ISSUES}}Partially Supports{{else}}Supports{{/if}}{{else}}{{#if KEYBOARD_SUPPORT_FOUND}}{{else}}Not Applicable{{/if}}{{/if}} | {{#if PHASE2_FOCUS_ORDER}}**✨ Automated analysis performed** on focusable elements across {{TOTAL_SCENES}} scenes.<br><br>{{#if PHASE2_FOCUS_ORDER_ISSUES}}{{PHASE2_FOCUS_ORDER_MISMATCHES}} focus order mismatches detected between visual order and actual tab order.<br><br>Issues detected:<br>{{PHASE2_FOCUS_ORDER_SUMMARY}}<br><br>**Manual verification recommended** to test keyboard navigation flow.{{else}}Focus order matches visual/logical order for all analyzed scenes.<br><br>**Manual verification recommended** to confirm keyboard navigation usability.{{/if}}{{else}}{{#if KEYBOARD_SUPPORT_FOUND}}**Manual review required** to verify keyboard focus order preserves meaning and operability.{{else}}Keyboard navigation not implemented. Criterion not applicable until keyboard support is added.{{/if}}{{/if}} |
| **[2.4.4 Link Purpose (In Context)](https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-in-context) (Level A)** |  | **Manual review required** to verify purpose of each link (or interactive element) can be determined from link text alone or from link text together with its programmatically determined context. |
| **[2.5.1 Pointer Gestures](https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures) (Level A)** |  | **Manual review required** to verify all functionality that uses multipoint or path-based gestures can be operated with a single pointer without path-based gestures (unless multipoint or path is essential). |
| **[2.5.2 Pointer Cancellation](https://www.w3.org/WAI/WCAG22/Understanding/pointer-cancellation) (Level A)** |  | **Manual review required** to verify for functionality operated using single pointer: completion occurs on up-event, down-event can be aborted or undone, and up-event reverses down-event (or essential exception applies). |
| **[2.5.3 Label in Name](https://www.w3.org/WAI/WCAG22/Understanding/label-in-name) (Level A)** |  | **Manual review required** to verify user interface components with visible text labels have accessible names that include the visible text. |
| **[2.5.4 Motion Actuation](https://www.w3.org/WAI/WCAG22/Understanding/motion-actuation) (Level A)** | Supports | zSpace head-tracking used for viewport orientation only, not for triggering functionality. **Manual review required** to confirm no device or user motion is required to operate functions. |
| **[3.1.1 Language of Page](https://www.w3.org/WAI/WCAG22/Understanding/language-of-page) (Level A)** |  | **Manual review required** to verify default human language of content is programmatically determined. |
| **[3.2.1 On Focus](https://www.w3.org/WAI/WCAG22/Understanding/on-focus) (Level A)** |  | **Manual review required** to verify receiving focus does not initiate a change of context (opening new windows, changing focus, navigating to different content). |
| **[3.2.2 On Input](https://www.w3.org/WAI/WCAG22/Understanding/on-input) (Level A)** |  | **Manual review required** to verify changing the setting of user interface components does not automatically cause a change of context unless user has been advised beforehand. |
| **[3.2.6 Consistent Help](https://www.w3.org/WAI/WCAG22/Understanding/consistent-help) (Level A)** |  | **Manual review required** to verify help mechanisms appear in the same relative order across {{TOTAL_SCENES}} scenes when repeated. |
| **[3.3.1 Error Identification](https://www.w3.org/WAI/WCAG22/Understanding/error-identification) (Level A)** |  | **Manual review required** to verify input errors are automatically detected, and the item in error is identified and described to the user in text. |
| **[3.3.2 Labels or Instructions](https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions) (Level A)** |  | **Manual review required** to verify labels or instructions are provided when content requires user input. |
| **[3.3.7 Redundant Entry](https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry) (Level A)** |  | **Manual review required** to verify information previously entered or provided is auto-populated or available for selection (unless re-entering is essential, for security, or previous information is no longer valid). |
| **[4.1.1 Parsing](https://www.w3.org/WAI/WCAG22/Understanding/parsing) (Level A)** | Supports | Unity engine manages content structure. {{TOTAL_SCENES}} scenes analyzed - no structural parsing issues detected. |
| **[4.1.2 Name, Role, Value](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value) (Level A)** | {{#if SCREEN_READER_SUPPORT_FOUND}}Partially Supports{{/if}}{{#if SCREEN_READER_SUPPORT_FOUND}}{{/if}}Does Not Support | {{#if SCREEN_READER_SUPPORT_FOUND}}Unity Accessibility API patterns detected in codebase.<br><br>**Manual review required** to verify all user interface components have names and roles programmatically determined, states and properties can be set programmatically, and notification of changes is available to assistive technologies.{{/if}}{{#if SCREEN_READER_SUPPORT_FOUND}}{{/if}}No Unity Accessibility API implementation detected in codebase.<br><br>Assistive technologies may be unable to identify interactive elements, read labels, or announce state changes. Implementation of accessibility API required for assistive technology compatibility. |

---

## WCAG 2.2 Report - Level AA Success Criteria

### Table 2: Success Criteria, Level AA

**Overall Level AA Status:** {{WCAG_LEVEL_AA_STATUS}}

| Criteria | Conformance Level | Remarks and Explanations |
|----------|------------------|--------------------------|
| **[1.2.4 Captions (Live)](https://www.w3.org/WAI/WCAG22/Understanding/captions-live) (Level AA)** | Not Applicable | No live audio content detected in codebase analysis. If live audio exists, **manual review required** to verify captions are provided. |
| **[1.2.5 Audio Description (Prerecorded)](https://www.w3.org/WAI/WCAG22/Understanding/audio-description-prerecorded) (Level AA)** | Not Applicable | No prerecorded video content detected in codebase analysis. If video exists, **manual review required** to verify audio description is provided. |
| **[1.3.4 Orientation](https://www.w3.org/WAI/WCAG22/Understanding/orientation) (Level AA)** | Supports | Desktop application with fixed landscape orientation on zSpace display. Content does not restrict viewing to a single orientation. |
| **[1.3.5 Identify Input Purpose](https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose) (Level AA)** | Not Applicable | No personal data input fields detected in codebase analysis. If data collection exists, **manual review required** to verify input purpose is programmatically determined. |
| **[1.4.3 Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum) (Level AA)** | {{#if PHASE1_TEXT_CONTRAST}}{{#if PHASE1_TEXT_CONTRAST_ISSUES}}Partially Supports{{else}}Supports{{/if}}{{else}}{{#if VISUAL_ANALYSIS_PERFORMED}}{{#if CONTRAST_ISSUES_FOUND}}Partially Supports{{else}}Supports{{/if}}{{/if}}{{/if}} | {{#if PHASE1_TEXT_CONTRAST}}**✨ Automated OCR-based contrast analysis performed** on {{SCREENSHOTS_COUNT}} scene screenshots.<br><br>{{#if PHASE1_TEXT_CONTRAST_ISSUES}}{{PHASE1_TEXT_CONTRAST_FAILING}} text elements fail contrast requirements:<br>- Critical (< 3.0:1): {{PHASE1_TEXT_CONTRAST_CRITICAL}}<br>- High (< 4.5:1): {{PHASE1_TEXT_CONTRAST_HIGH}}<br><br>Issues detected:<br>{{PHASE1_TEXT_CONTRAST_SUMMARY}}<br><br>**Manual verification recommended** to validate fixes on actual zSpace display.{{else}}All analyzed text elements meet WCAG AA contrast requirements.<br><br>**Manual verification recommended** to confirm visual quality on actual zSpace display.{{/if}}{{else}}{{#if VISUAL_ANALYSIS_PERFORMED}}Automated contrast analysis performed on {{CONTRAST_ANALYSIS_COMPONENTS}} UI components.<br><br>{{#if CONTRAST_ISSUES_FOUND}}{{CONTRAST_FAILING_COMPONENTS}} components do not meet minimum contrast requirements:<br>- Critical (< 3.0:1): {{CONTRAST_CRITICAL_COUNT}}<br>- Warnings (< 4.5:1): {{CONTRAST_WARNING_COUNT}}<br><br>Compliance Rate: {{CONTRAST_COMPLIANCE_RATE}}<br><br>**Manual review required** to verify fixes and validate on actual zSpace display. Review contrast-analysis.json for specific components.{{else}}All {{CONTRAST_ANALYSIS_COMPONENTS}} analyzed components meet WCAG AA contrast requirements (Compliance Rate: {{CONTRAST_COMPLIANCE_RATE}}).<br><br>**Manual review required** to verify analysis accuracy and validate on actual zSpace display.{{/if}}{{else}}**Manual review required** to verify text and UI components meet minimum contrast requirements:<br>- Normal text: ≥4.5:1<br>- Large text (18pt+ or 14pt+ bold): ≥3.0:1<br>- UI components and graphics: ≥3.0:1{{/if}}{{/if}} |
| **[1.4.4 Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text) (Level AA)** | {{#if PHASE2_TEXT_RESIZE}}{{#if PHASE2_TEXT_RESIZE_ISSUES}}Partially Supports{{else}}Supports{{/if}}{{/if}} | {{#if PHASE2_TEXT_RESIZE}}**✨ Automated layout analysis performed** on text components across {{TOTAL_SCENES}} scenes.<br><br>{{#if PHASE2_TEXT_RESIZE_ISSUES}}{{PHASE2_TEXT_RESIZE_OVERFLOW}} text elements likely to overflow at 200% scale, {{PHASE2_TEXT_RESIZE_FIXED}} elements have fixed-size containers.<br><br>Issues detected:<br>{{PHASE2_TEXT_RESIZE_SUMMARY}}<br><br>**Manual runtime testing required** at 150% and 200% scale to verify layout behavior.{{else}}All analyzed text components use flexible layouts that support scaling.<br><br>**Manual runtime testing recommended** at 150% and 200% scale to confirm no content loss.{{/if}}{{else}}**Manual review required** to verify text can be resized up to 200% without assistive technology and without loss of content or functionality.<br><br>Unity applications typically use fixed UI scaling. Test all {{TOTAL_SCENES}} scenes with system-level text size adjustments.{{/if}} |
| **[1.4.5 Images of Text](https://www.w3.org/WAI/WCAG22/Understanding/images-of-text) (Level AA)** |  | **Manual review required** to verify text is not presented as part of an image unless customizable or essential.<br><br>Verify all text uses text rendering (TextMesh Pro or Unity UI Text) rather than rasterized images. |
| **[1.4.10 Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow) (Level AA)** | Not Applicable | Desktop application with fixed resolution on zSpace display (1920x1080). Content reflow not applicable to fixed-resolution desktop applications. |
| **[1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast) (Level AA)** |  | {{#if VISUAL_ANALYSIS_PERFORMED}}**Manual review required** to verify UI components and graphical objects meet ≥3.0:1 contrast ratio against adjacent colors. Automated contrast analysis focused on text; UI component boundaries require visual inspection.{{else}}**Manual review required** to verify user interface components and graphical objects required for understanding content have ≥3.0:1 contrast ratio against adjacent colors.{{/if}} |
| **[1.4.12 Text Spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing) (Level AA)** |  | **Manual review required** to verify no loss of content or functionality occurs when text spacing is adjusted to: line height 1.5x font size, paragraph spacing 2x font size, letter spacing 0.12x font size, word spacing 0.16x font size. |
| **[1.4.13 Content on Hover or Focus](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus) (Level AA)** |  | **Manual review required** to verify additional content triggered by hover or focus is dismissible, hoverable, and persistent until user action. |
| **[2.4.5 Multiple Ways](https://www.w3.org/WAI/WCAG22/Understanding/multiple-ways) (Level AA)** |  | **Manual review required** to verify multiple ways are available to locate content within the application (e.g., menu + search, menu + table of contents, menu + shortcuts). |
| **[2.4.6 Headings and Labels](https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels) (Level AA)** | {{#if PHASE2_HEADINGS_LABELS}}{{#if PHASE2_HEADINGS_LABELS_ISSUES}}Partially Supports{{else}}Supports{{/if}}{{/if}} | {{#if PHASE2_HEADINGS_LABELS}}**✨ Automated semantic analysis performed** on UI labels and headings across {{TOTAL_SCENES}} scenes.<br><br>{{#if PHASE2_HEADINGS_LABELS_ISSUES}}{{PHASE2_HEADINGS_LABELS_VAGUE}} vague labels detected, {{PHASE2_HEADINGS_LABELS_MISSING}} missing label associations, {{PHASE2_HEADINGS_LABELS_HEADING_ISSUES}} heading role issues.<br><br>Issues detected:<br>{{PHASE2_HEADINGS_LABELS_SUMMARY}}<br><br>**Manual verification recommended** to ensure all labels are descriptive and programmatically associated.{{else}}All analyzed labels and headings are descriptive and properly marked.<br><br>**Manual verification recommended** to confirm label clarity.{{/if}}{{else}}**Manual review required** to verify headings and labels describe topic or purpose and are programmatically determined.{{/if}} |
| **[2.4.7 Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible) (Level AA)** | {{#if FOCUS_INDICATORS_FOUND}}Partially Supports{{else}}Does Not Support{{/if}} | {{#if FOCUS_INDICATORS_FOUND}}Focus indicator code patterns detected in codebase.<br><br>**Manual review required** to verify keyboard focus indicator is visible with minimum 3:1 contrast ratio against adjacent colors for all focusable components.{{else}}No keyboard focus indicator implementation detected in codebase.<br><br>Keyboard users (if keyboard support is added) will be unable to determine which element has focus. Visual focus indicator required with ≥3:1 contrast ratio.{{/if}} |
| **[2.4.11 Focus Not Obscured (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum) (Level AA)** | {{#if KEYBOARD_SUPPORT_FOUND}}{{else}}Not Applicable{{/if}} | {{#if KEYBOARD_SUPPORT_FOUND}}**Manual review required** to verify focused component is not entirely hidden by author-created content.{{else}}Keyboard focus not implemented. Criterion not applicable until keyboard support and focus indicators are added.{{/if}} |
| **[2.5.7 Dragging Movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements) (Level AA)** |  | **Manual review required** to verify all functionality using dragging movements can be achieved with a single pointer without dragging (unless dragging is essential). |
| **[2.5.8 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum) (Level AA)** |  | **Manual review required** to verify interactive targets are at least 24x24 CSS pixels (or applicable exceptions apply: spacing, inline, user agent control, essential). |
| **[3.1.2 Language of Parts](https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts) (Level AA)** |  | **Manual review required** to verify human language of each passage or phrase is programmatically determined (except proper names, technical terms, words of indeterminate language, or words/phrases that have become part of the vernacular). |
| **[3.2.3 Consistent Navigation](https://www.w3.org/WAI/WCAG22/Understanding/consistent-navigation) (Level AA)** | {{#if PHASE2_CONSISTENT_NAV}}{{#if PHASE2_CONSISTENT_NAV_ISSUES}}Partially Supports{{else}}Supports{{/if}}{{/if}} | {{#if PHASE2_CONSISTENT_NAV}}**✨ Automated cross-scene navigation analysis performed** across {{TOTAL_SCENES}} scenes.<br><br>{{#if PHASE2_CONSISTENT_NAV_ISSUES}}{{PHASE2_CONSISTENT_NAV_INCONSISTENCIES}} navigation inconsistencies detected between scenes.<br><br>Issues detected:<br>{{PHASE2_CONSISTENT_NAV_SUMMARY}}<br><br>**Manual verification recommended** to ensure navigation order is intentionally consistent.{{else}}Navigation elements appear in consistent order across all analyzed scenes.<br><br>**Manual verification recommended** to confirm consistency is maintained.{{/if}}{{else}}**Manual review required** to verify navigation mechanisms repeated across {{TOTAL_SCENES}} scenes occur in the same relative order unless user initiates change.{{/if}} |
| **[3.2.4 Consistent Identification](https://www.w3.org/WAI/WCAG22/Understanding/consistent-identification) (Level AA)** | {{#if PHASE2_CONSISTENT_ID}}{{#if PHASE2_CONSISTENT_ID_ISSUES}}Partially Supports{{else}}Supports{{/if}}{{/if}} | {{#if PHASE2_CONSISTENT_ID}}**✨ Automated component identification analysis performed** across {{TOTAL_SCENES}} scenes.<br><br>{{#if PHASE2_CONSISTENT_ID_ISSUES}}{{PHASE2_CONSISTENT_ID_FUNCTION_TYPES}} component types have inconsistent labels/identification across scenes.<br><br>Issues detected:<br>{{PHASE2_CONSISTENT_ID_SUMMARY}}<br><br>**Manual verification recommended** to ensure consistent labeling for same-function components.{{else}}Components with same functionality are identified consistently across scenes.<br><br>**Manual verification recommended** to confirm identification clarity.{{/if}}{{else}}**Manual review required** to verify components with same functionality are identified consistently across all scenes.{{/if}} |
| **[3.2.6 Consistent Help](https://www.w3.org/WAI/WCAG22/Understanding/consistent-help) (Level AA)** |  | **Manual review required** to verify help mechanisms (if present) appear in same relative order across scenes when repeated. |
| **[3.3.3 Error Suggestion](https://www.w3.org/WAI/WCAG22/Understanding/error-suggestion) (Level AA)** |  | **Manual review required** to verify input errors are automatically detected and suggestions for correction are provided (unless it would jeopardize security or purpose of content). |
| **[3.3.4 Error Prevention (Legal, Financial, Data)](https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-legal-financial-data) (Level AA)** |  | **Manual review required** to verify submissions causing legal commitments, financial transactions, or data modification are reversible, checked for errors, or confirmed before finalization. |
| **[3.3.8 Accessible Authentication (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum) (Level AA)** | Not Applicable | No authentication system detected in codebase analysis. If authentication exists, **manual review required** to verify cognitive function test is not required (unless alternative provided or test recognizes objects/content provided by user). |

---

## Revised Section 508 Report

### Chapter 3: Functional Performance Criteria (FPC)

**Table 3: Functional Performance Criteria**

| Criteria | Conformance Level | Remarks and Explanations |
|----------|------------------|--------------------------|
| **[302.1 Without Vision](https://www.access-board.gov/ict/#302.1)** | {{#if SCREEN_READER_SUPPORT_FOUND}}Partially Supports{{else}}Does Not Support{{/if}} | {{#if SCREEN_READER_SUPPORT_FOUND}}Assistive technology API patterns detected. **Manual review required** to verify functionality is operable without vision using assistive technologies (screen readers, refreshable braille displays).{{else}}**Manual review required** to verify all functionality is operable without vision. Assistive technology integration required for non-visual access.{{/if}} |
| **[302.2 With Limited Vision](https://www.access-board.gov/ict/#302.2)** |  | {{#if VISUAL_ANALYSIS_PERFORMED}}**Manual review required** to verify functionality is operable with limited vision through magnification, contrast adjustment, and other visual accommodations. Contrast analysis performed - review results in 1.4.3 criterion.{{else}}**Manual review required** to verify functionality is operable with limited vision including color perception deficiencies and contrast sensitivity limitations.{{/if}} |
| **[302.3 Without Perception of Color](https://www.access-board.gov/ict/#302.3)** | {{#if COLOR_BLIND_ANALYSIS_PERFORMED}}{{#if COLOR_BLIND_ISSUES_FOUND}}Partially Supports{{/if}}{{/if}} | {{#if COLOR_BLIND_ANALYSIS_PERFORMED}}Color-blind simulation performed. {{#if COLOR_BLIND_ISSUES_FOUND}}Issues detected - **manual review required** to verify non-color cues provided.{{else}}**Manual review required** to verify color is not sole means of conveying information.{{/if}}{{else}}**Manual review required** to verify functionality is operable without perception of color.{{/if}} |
| **[302.4 Without Hearing](https://www.access-board.gov/ict/#302.4)** | {{#if CAPTIONS_DETECTED}}Supports{{/if}} | {{#if CAPTIONS_DETECTED}}Caption system detected. **Manual review required** to verify all audio content has visual alternatives (captions, transcripts).{{else}}**Manual review required** to verify functionality is operable without hearing. Visual alternatives required for all audio content.{{/if}} |
| **[302.5 With Limited Hearing](https://www.access-board.gov/ict/#302.5)** | {{#if CAPTIONS_DETECTED}}Supports{{/if}} | {{#if CAPTIONS_DETECTED}}Caption system detected. **Manual review required** to verify audio can be enhanced (volume control, tone control, reduced background noise).{{else}}**Manual review required** to verify functionality is operable with limited hearing including audio enhancement capabilities.{{/if}} |
| **[302.6 Without Speech](https://www.access-board.gov/ict/#302.6)** | Supports | Desktop application does not require speech input. {{#if VOICE_COMMANDS_DETECTED}}Voice command system detected - **manual review required** to verify alternatives are provided.{{/if}} |
| **[302.7 With Limited Manipulation](https://www.access-board.gov/ict/#302.7)** | {{#if KEYBOARD_SUPPORT_FOUND}}Partially Supports{{else}}Does Not Support{{/if}} | {{#if KEYBOARD_SUPPORT_FOUND}}Keyboard input patterns detected. **Manual review required** to verify functionality is operable with limited manipulation (keyboard only, no fine motor control required).{{else}}No keyboard alternatives detected. Users with limited manipulation ability (unable to use stylus/mouse) cannot access functionality. Keyboard access required.{{/if}} |
| **[302.8 With Limited Reach and Strength](https://www.access-board.gov/ict/#302.8)** | Supports | Desktop application at fixed viewing distance on zSpace display. Does not require extensive reach or strength. |
| **[302.9 With Limited Language, Cognitive, and Learning Abilities](https://www.access-board.gov/ict/#302.9)** |  | **Manual review required** to verify functionality accommodates limited language, cognitive, and learning abilities (simple language, clear instructions, consistent interface, error prevention). |

---

### Chapter 5: Software

**Table 5: Section 508 Software Requirements**

| Criteria | Conformance Level | Remarks and Explanations |
|----------|------------------|--------------------------|
| **[502.2.1 User Control of Accessibility Features](https://www.access-board.gov/ict/#502.2.1)** | Supports | Desktop application running on Windows. Platform accessibility features remain available to users. |
| **[502.2.2 No Disruption of Accessibility Features](https://www.access-board.gov/ict/#502.2.2)** | Supports | Application does not disrupt platform accessibility features. |
| **[502.3 Accessibility Services](https://www.access-board.gov/ict/#502.3)** | {{#if SCREEN_READER_SUPPORT_FOUND}}Partially Supports{{else}}Does Not Support{{/if}} | {{#if SCREEN_READER_SUPPORT_FOUND}}Unity Accessibility API patterns detected. **Manual review required** to verify platform accessibility services are supported for assistive technology interoperability.{{else}}No platform accessibility services implementation detected. See WCAG 4.1.2 (Name, Role, Value) for details.{{/if}} |
| **[502.3.1 Object Information](https://www.access-board.gov/ict/#502.3.1)** | {{#if SCREEN_READER_SUPPORT_FOUND}}Partially Supports{{else}}Does Not Support{{/if}} | See WCAG 4.1.2 - Name, Role, Value for detailed analysis. {{#if SCREEN_READER_SUPPORT_FOUND}}**Manual review required** to verify programmatic access to object information.{{/if}} |
| **[502.3.2 Modification of Object Information](https://www.access-board.gov/ict/#502.3.2)** | {{#if SCREEN_READER_SUPPORT_FOUND}}Partially Supports{{else}}Does Not Support{{/if}} | See WCAG 4.1.2 - Name, Role, Value for detailed analysis. {{#if SCREEN_READER_SUPPORT_FOUND}}**Manual review required** to verify assistive technologies can modify focus, selection, and other states.{{/if}} |
| **[502.3.3 Row, Column, and Headers](https://www.access-board.gov/ict/#502.3.3)** |  | **Manual review required** to verify table data cells are programmatically associated with headers if tables are present. |
| **[502.3.4 Values](https://www.access-board.gov/ict/#502.3.4)** | {{#if SCREEN_READER_SUPPORT_FOUND}}Partially Supports{{/if}} | See WCAG 4.1.2 - Name, Role, Value for detailed analysis. **Manual review required** to verify current value and range are programmatically available. |
| **[502.3.5 Modification of Values](https://www.access-board.gov/ict/#502.3.5)** | {{#if SCREEN_READER_SUPPORT_FOUND}}Partially Supports{{/if}} | See WCAG 4.1.2 - Name, Role, Value for detailed analysis. **Manual review required** to verify assistive technologies can modify values within allowed ranges. |
| **[502.3.6 Label Relationships](https://www.access-board.gov/ict/#502.3.6)** | {{#if SCREEN_READER_SUPPORT_FOUND}}Partially Supports{{/if}} | See WCAG 1.3.1 - Info and Relationships for detailed analysis. **Manual review required** to verify relationships are programmatically exposed. |
| **[502.3.7 Hierarchical Relationships](https://www.access-board.gov/ict/#502.3.7)** | {{#if SCREEN_READER_SUPPORT_FOUND}}Partially Supports{{/if}} | See WCAG 1.3.1 - Info and Relationships for detailed analysis. **Manual review required** to verify hierarchical relationships are programmatically exposed. |
| **[502.3.8 Text](https://www.access-board.gov/ict/#502.3.8)** | {{#if SCREEN_READER_SUPPORT_FOUND}}Partially Supports{{/if}} | **Manual review required** to verify text content, attributes, and boundaries are programmatically available to assistive technologies. |
| **[502.3.9 Modification of Text](https://www.access-board.gov/ict/#502.3.9)** | {{#if SCREEN_READER_SUPPORT_FOUND}}Partially Supports{{/if}} | **Manual review required** to verify assistive technologies can modify editable text without loss of content, structural information, or attributes. |
| **[502.3.10 List of Actions](https://www.access-board.gov/ict/#502.3.10)** | {{#if SCREEN_READER_SUPPORT_FOUND}}Partially Supports{{/if}} | See WCAG 4.1.2 - Name, Role, Value for detailed analysis. **Manual review required** to verify available actions are programmatically exposed. |
| **[502.3.11 Actions on Objects](https://www.access-board.gov/ict/#502.3.11)** | {{#if SCREEN_READER_SUPPORT_FOUND}}Partially Supports{{/if}} | See WCAG 4.1.2 - Name, Role, Value for detailed analysis. **Manual review required** to verify assistive technologies can execute available actions. |
| **[502.3.12 Focus Cursor](https://www.access-board.gov/ict/#502.3.12)** | {{#if FOCUS_INDICATORS_FOUND}}Partially Supports{{else}}Does Not Support{{/if}} | See WCAG 2.4.7 - Focus Visible for detailed analysis. **Manual review required** to verify focus cursor is programmatically exposed. |
| **[502.3.13 Modification of Focus Cursor](https://www.access-board.gov/ict/#502.3.13)** | {{#if FOCUS_INDICATORS_FOUND}}Partially Supports{{else}}Does Not Support{{/if}} | See WCAG 2.4.7 - Focus Visible for detailed analysis. **Manual review required** to verify assistive technologies can track and modify focus cursor. |
| **[502.3.14 Event Notification](https://www.access-board.gov/ict/#502.3.14)** | {{#if SCREEN_READER_SUPPORT_FOUND}}Partially Supports{{/if}} | See WCAG 4.1.2 - Name, Role, Value for detailed analysis. **Manual review required** to verify assistive technologies receive notification of relevant events. |
| **[502.4 Platform Accessibility Features](https://www.access-board.gov/ict/#502.4)** | Supports | Application runs on Windows and does not disrupt platform accessibility features (high contrast, magnification, screen readers). |

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
| **UN 1: Assistive Technology Integration** | {{#if SCREEN_READER_SUPPORT_FOUND}}Partially Supports{{/if}}{{#if SCREEN_READER_SUPPORT_FOUND}}{{/if}}Does Not Support | {{#if SCREEN_READER_SUPPORT_FOUND}}Unity Accessibility API patterns detected in codebase. **Manual review required** to validate integration with Windows Narrator, NVDA, and other assistive technologies.{{/if}}{{#if SCREEN_READER_SUPPORT_FOUND}}{{/if}}No Unity Accessibility API implementation detected. Integration with Windows assistive technologies required for accessibility. |
| **UN 2: Multiple Input Methods** | {{#if KEYBOARD_SUPPORT_FOUND}}Partially Supports{{/if}}{{#if KEYBOARD_SUPPORT_FOUND}}{{/if}}Does Not Support | {{#if KEYBOARD_SUPPORT_FOUND}}Keyboard input patterns detected in codebase. **Manual review required** to verify all functionality is accessible via keyboard and alternative input methods.{{/if}}{{#if KEYBOARD_SUPPORT_FOUND}}{{/if}}Application appears to support stylus and mouse only. Keyboard alternatives required for users unable to use pointing devices. |
| **UN 5: Clear Focus Indicators** | {{#if FOCUS_INDICATORS_FOUND}}Partially Supports{{/if}}{{#if FOCUS_INDICATORS_FOUND}}{{/if}}Does Not Support | {{#if FOCUS_INDICATORS_FOUND}}Focus indicator patterns detected in codebase. **Manual review required** to verify visibility (≥3:1 contrast ratio) and multi-modal feedback (visual, audio, haptic).{{/if}}{{#if FOCUS_INDICATORS_FOUND}}{{/if}}No focus indicator implementation detected. Visual, audio, and haptic feedback required for focused elements. |
| **UN 10: Environment Descriptions** | {{#if SCREEN_READER_SUPPORT_FOUND}}Partially Supports{{/if}}{{#if SCREEN_READER_SUPPORT_FOUND}}{{/if}}Does Not Support | {{#if SCREEN_READER_SUPPORT_FOUND}}**Manual review required** to verify 3D objects and environments have accessible names and descriptions programmatically determined for assistive technologies.{{/if}}{{#if SCREEN_READER_SUPPORT_FOUND}}{{/if}}3D objects and spatial environments require accessible names and descriptions for assistive technology users. |
| **UN 11: Non-Visual Information** |  | **Manual review required** to verify audio and haptic alternatives are provided for visual information. |
| **UN 12: Captions for Audio** | {{#if CAPTIONS_DETECTED}}Supports{{/if}}{{#if CAPTIONS_DETECTED}}{{/if}} | {{#if CAPTIONS_DETECTED}}Caption system detected. **Manual review required** to verify synchronization and accuracy.{{/if}}{{#if CAPTIONS_DETECTED}}{{/if}}**Manual review required** to verify captions are provided for all audio content. |
| **UN 17: Stereoscopic Depth Alternatives** | {{#if DEPTH_CUES_FOUND}}Supports{{/if}}{{#if DEPTH_CUES_FOUND}}{{/if}}Does Not Support | {{#if DEPTH_CUES_FOUND}}Depth cue system detected. **Manual review required** to verify multiple depth cues (size, shadow, audio, haptic) are effective for stereoblind users.{{/if}}{{#if DEPTH_CUES_FOUND}}{{/if}}No depth cue system detected. Users with stereoblindness or monocular vision (10-15% of population) cannot perceive stereoscopic 3D. Multiple depth cues required: relative size scaling, shadows, spatial audio, haptic feedback. |

---

## Automated Findings Summary

### Detected Accessibility Patterns

**✅ Positive Indicators:**
{{#if KEYBOARD_SUPPORT_FOUND}}- Keyboard input patterns found in codebase{{/if}}
{{#if SCREEN_READER_SUPPORT_FOUND}}- Screen reader compatibility patterns detected{{/if}}
{{#if FOCUS_INDICATORS_FOUND}}- Focus indicator patterns found{{/if}}
{{#if ACCESSIBILITY_COMPONENTS_FOUND}}- Accessibility framework components detected{{/if}}
{{#if VISUAL_ANALYSIS_PERFORMED}}- Visual accessibility analysis completed ({{SCREENSHOTS_COUNT}} scenes){{/if}}
{{#if CONTRAST_ANALYSIS_PERFORMED}}- Contrast analysis: {{CONTRAST_COMPLIANCE_RATE}} compliance rate{{/if}}
{{#if COLOR_BLIND_ANALYSIS_PERFORMED}}- Color-blind simulation: 8 vision types tested{{/if}}

**❌ Critical Gaps:**
{{#if KEYBOARD_SUPPORT_FOUND}}{{else}}- No keyboard input patterns detected ({{STYLUS_ONLY_SCRIPTS_COUNT}} stylus-only scripts){{/if}}
{{#if SCREEN_READER_SUPPORT_FOUND}}{{else}}- No screen reader support patterns found{{/if}}
{{#if FOCUS_INDICATORS_FOUND}}{{else}}- No focus indicator patterns detected{{/if}}
{{#if ACCESSIBILITY_COMPONENTS_FOUND}}{{else}}- No accessibility framework components found{{/if}}
{{#if CONTRAST_ISSUES_FOUND}}- Contrast issues: {{CONTRAST_CRITICAL_COUNT}} critical, {{CONTRAST_WARNING_COUNT}} warnings{{/if}}
{{#if COLOR_BLIND_ISSUES_FOUND}}- Color-blind accessibility issues detected{{/if}}

### Visual Accessibility Results

{{#if VISUAL_ANALYSIS_PERFORMED}}
**Screenshot Capture:**
- **Scenes Captured:** {{SCREENSHOTS_COUNT}}
- **Resolutions:** 1920x1080 (main), 320x180 (thumbnails)
- **Location:** `AccessibilityAudit/screenshots/`

**Contrast Analysis:**
{{#if CONTRAST_ANALYSIS_PERFORMED}}
- **Components Analyzed:** {{CONTRAST_ANALYSIS_COMPONENTS}}
- **Passing:** {{CONTRAST_PASSING_COMPONENTS}} ({{CONTRAST_COMPLIANCE_RATE}})
- **Failing:** {{CONTRAST_FAILING_COMPONENTS}}
  - Critical (< 3.0:1): {{CONTRAST_CRITICAL_COUNT}}
  - Warnings (< 4.5:1): {{CONTRAST_WARNING_COUNT}}
- **Report:** `AccessibilityAudit/contrast-analysis.json`
{{else}}
- **Status:** Not performed - UI data extraction required
- **Action:** Run AccessibilityContentExtractor.cs to enable contrast analysis
{{/if}}

**Color-Blind Simulation:**
{{#if COLOR_BLIND_ANALYSIS_PERFORMED}}
- **Vision Types Tested:** 8 (Protanopia, Deuteranopia, Tritanopia, Protanomaly, Deuteranomaly, Tritanomaly, Achromatopsia, Normal)
- **Scenes Simulated:** {{SCREENSHOTS_COUNT}}
- **Comparison Pages:** `screenshots/[SceneName]/colorblind/comparison.html`
{{#if COLOR_BLIND_ISSUES_FOUND}}
- **Issues Found:** Information loss detected in: {{COLOR_BLIND_AFFECTED_TYPES}}
- **Recommendation:** Review comparison pages and add non-color distinguishing features
{{else}}
- **Result:** No significant information loss detected
{{/if}}
{{else}}
- **Status:** Not performed
- **Action:** Run ColorBlindSimulator.cs to generate simulations
{{/if}}

**Visual Analysis Heatmaps:**
{{#if HEATMAPS_GENERATED}}
- **Heatmaps Created:** {{HEATMAPS_COUNT}}
- **Location:** `AccessibilityAudit/visual-analysis/heatmaps/`
- **Purpose:** Visual overlay showing low-contrast regions
{{else}}
- **Status:** Not generated
- **Action:** Run analyze-visual-accessibility.js with --heatmap flag
{{/if}}
{{else}}
**Visual Analysis Status:** Not performed

To enable comprehensive visual analysis, run:
```bash
node bin/audit.js <project-path> --capture-screenshots
```

This will provide:
- Automated screenshot capture (all scenes)
- WCAG contrast ratio analysis
- Color-blind simulation (8 types)
- Visual heatmap generation
{{/if}}

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

### Manual Review Required

The following areas require manual testing that automated analysis cannot perform:

1. **Color Contrast:** {{#if VISUAL_ANALYSIS_PERFORMED}}{{#if CONTRAST_ISSUES_FOUND}}Verify fixes for components identified in contrast analysis{{/if}}{{#if CONTRAST_ISSUES_FOUND}}{{/if}}Validate automated analysis results on actual zSpace display{{/if}}{{#if VISUAL_ANALYSIS_PERFORMED}}{{/if}}Measure all text and UI component contrast ratios on actual zSpace display
2. **Target Sizes:** Measure all interactive elements (UI controls and 3D objects) meet 24x24 CSS pixels minimum
3. **Audio and Video:** Verify captions and audio descriptions are provided if multimedia content exists
4. **Depth Perception:** Test application functionality with stereoscopic 3D disabled to verify depth cues are sufficient
5. **Keyboard Navigation:** Test all workflows using keyboard only (if keyboard support is implemented)
6. **Assistive Technology:** Test with Windows Narrator, NVDA, or other assistive technologies (if accessibility API is implemented)
7. **Sensory Characteristics:** Verify instructions do not rely solely on shape, size, visual location, orientation, or sound
8. **Color Use:** Verify color is not the only visual means of conveying information

---

## Known Limitations of Automated Analysis

This VPAT was generated using automated code analysis. The following limitations apply:

**❌ Automated Analysis Cannot Detect:**
- Visual contrast ratios (Phase 2 adds partial automation via screenshot analysis)
- Interactive element sizes (requires manual measurement)
- Audio/video content and caption quality
- Tooltip and modal dialog behavior
- Timeout and session management
- Actual keyboard navigation usability
- Assistive technology announcement quality and compatibility
- Visual design patterns (color-only indicators, sensory characteristics)
- Content language and mixed-language text
- Error message clarity and suggestions
- 3D object and environment accessibility

**✅ Automated Analysis Can Detect:**
- Code patterns for keyboard input handlers
- Assistive technology API implementation
- Focus indicator code patterns
- Accessibility component usage
- Input method dependencies
- Basic scene and script structure
- {{#if VISUAL_ANALYSIS_PERFORMED}}Visual contrast ratios (via screenshot analysis){{/if}}
- {{#if COLOR_BLIND_ANALYSIS_PERFORMED}}Color vision deficiency simulation{{/if}}

**Important:** This automated VPAT provides a foundation for accessibility assessment. Manual validation by accessibility experts is required for procurement use, legal compliance documentation, and comprehensive WCAG 2.2 Level AA certification.

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
