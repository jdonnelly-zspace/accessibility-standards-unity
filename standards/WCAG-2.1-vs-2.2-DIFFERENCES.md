# WCAG 2.1 vs 2.2 Differences

**Last Updated**: October 2025
**Status**: Official Recommendation (W3C)

## Overview

This document highlights the **differences only** between WCAG 2.1 and WCAG 2.2. All 50 success criteria from WCAG 2.0 and the 17 additional success criteria from WCAG 2.1 remain unchanged in WCAG 2.2.

**Key Changes Summary:**
- **9 new success criteria** added in WCAG 2.2
- **1 success criterion removed** (4.1.1 Parsing - obsolete)
- **Total success criteria in WCAG 2.2**: 86 (compared to 78 in WCAG 2.1)

---

## New Success Criteria in WCAG 2.2

### Level A (2 new criteria)

#### 3.2.6 Consistent Help (Level A)
**Added in:** WCAG 2.2
**Guideline:** 3.2 Predictable

**Requirement:**
If a web page contains help mechanisms (such as contact details, human contact mechanisms, self-help options, or automated contact mechanisms), and those mechanisms are repeated on multiple web pages within a set of web pages, they must occur in the same relative order to other page content, unless a change is initiated by the user.

**Purpose:**
- Enables people with cognitive disabilities to find help more easily
- Reduces cognitive load by maintaining consistent help location
- Benefits users who rely on familiar navigation patterns

**Impact on zSpace Unity Applications:**
If your zSpace application includes help menus, contact options, or support mechanisms across multiple scenes or UI screens, ensure they appear in consistent locations.

**Testing:**
- Verify help mechanisms appear in the same relative order across all scenes
- Check that help options maintain consistent positioning in the UI hierarchy

---

#### 3.3.7 Redundant Entry (Level A)
**Added in:** WCAG 2.2
**Guideline:** 3.3 Input Assistance

**Requirement:**
Information previously entered by or provided to the user that is required to be entered again in the same process is either:
- Auto-populated, or
- Available for the user to select

**Exceptions:**
- Re-entering the information is essential (e.g., password confirmation)
- The information is required to ensure the security of the content
- Previously entered information is no longer valid

**Purpose:**
- Reduces cognitive burden on users with memory impairments
- Minimizes physical effort for users with motor disabilities
- Improves efficiency for all users

**Impact on zSpace Unity Applications:**
When creating multi-step workflows or forms in VR/AR:
- Auto-populate previously entered calibration settings
- Remember user preferences across sessions
- Provide selection from previously entered values (e.g., patient names, project titles)

**Testing:**
- Test multi-step processes for auto-population
- Verify previously entered data is available for re-selection
- Confirm exceptions are properly justified (security, essential re-entry)

---

### Level AA (4 new criteria)

#### 2.4.11 Focus Not Obscured (Minimum) (Level AA)
**Added in:** WCAG 2.2
**Guideline:** 2.4 Navigable

**Requirement:**
When a user interface component receives keyboard focus, the component is not entirely hidden due to author-created content.

**Purpose:**
- Ensures keyboard users can see which element has focus
- Prevents sticky headers, footers, or popups from completely obscuring focused elements
- Critical for keyboard-only navigation

**Impact on zSpace Unity Applications:**
In Unity VR/AR interfaces:
- Ensure focused UI elements are not completely hidden by persistent UI panels
- Verify 3D spatial UI doesn't obscure focused interactive elements
- Check that tooltips, notifications, or overlays don't completely hide focused items

**Testing:**
- Navigate through all interactive elements using keyboard/gamepad
- Verify focused elements are at least partially visible
- Test with screen reader focus mode in Unity Accessibility Module

**Unity Implementation:**
```csharp
// Ensure focused elements remain visible
void OnElementFocused(GameObject focusedElement)
{
    // Check if element is obscured by other UI
    if (IsObscuredByUI(focusedElement))
    {
        // Temporarily hide/reposition obscuring UI
        TemporarilyAdjustOverlappingUI(focusedElement);
    }
}
```

---

#### 2.4.12 Focus Not Obscured (Enhanced) (Level AAA)
**Added in:** WCAG 2.2
**Guideline:** 2.4 Navigable

**Requirement:**
When a user interface component receives keyboard focus, no part of the component is hidden by author-created content.

**Purpose:**
- Enhanced version of 2.4.11 requiring complete visibility
- Provides optimal keyboard navigation experience
- Eliminates any partial obscuring of focused elements

**Difference from 2.4.11:**
- **2.4.11 (AA)**: At least partially visible (minimum)
- **2.4.12 (AAA)**: Completely visible (enhanced)

**Impact on zSpace Unity Applications:**
For AAA compliance, ensure 100% of the focused element and its focus indicator are visible.

---

#### 2.4.13 Focus Appearance (Level AAA)
**Added in:** WCAG 2.2
**Guideline:** 2.4 Navigable

**Requirement:**
When the keyboard focus indicator is visible, an area of the focus indicator meets all of the following:
- **Minimum size**: At least 2 CSS pixels thick (or equivalent in Unity screen space)
- **Contrast**: At least 3:1 contrast ratio between focused and unfocused states
- **Contrast against background**: Focus indicator has 3:1 contrast with adjacent colors

**Purpose:**
- Makes focus indicators visible to people with low vision
- Ensures focus indicator is distinguishable from background
- Provides consistent visual feedback for keyboard navigation

**Impact on zSpace Unity Applications:**
Design focus indicators in Unity that meet size and contrast requirements:
- Use thick outlines (≥2 pixels)
- Ensure 3:1 contrast ratio against both focused/unfocused states and background
- Test with color contrast analyzers

**Unity Implementation:**
```csharp
// Configure accessible focus indicators
public class AccessibleFocusIndicator : MonoBehaviour
{
    [Header("WCAG 2.2 Focus Appearance Settings")]
    [Range(2f, 10f)]
    public float outlineThickness = 3f; // Minimum 2 pixels for AAA

    public Color focusColor = new Color(0.2f, 0.6f, 1.0f); // High contrast blue
    public Color unfocusColor = Color.white;

    // Ensure 3:1 contrast ratio
    void OnValidate()
    {
        float contrastRatio = CalculateContrastRatio(focusColor, unfocusColor);
        if (contrastRatio < 3.0f)
        {
            Debug.LogWarning($"Focus indicator contrast ratio {contrastRatio:F2}:1 is below WCAG 2.2 requirement of 3:1");
        }
    }
}
```

---

#### 2.5.7 Dragging Movements (Level AA)
**Added in:** WCAG 2.2
**Guideline:** 2.5 Input Modalities

**Requirement:**
All functionality that uses a dragging movement for operation can be achieved by a single pointer without dragging, unless dragging is essential or the functionality is determined by the user agent and not modified by the author.

**Purpose:**
- Accommodates users unable to perform drag operations (motor disabilities, tremors)
- Provides alternative input methods for dragging functionality
- Supports users with limited fine motor control

**Impact on zSpace Unity Applications:**
Critical for zSpace stylus interactions:
- Provide alternatives to drag-based 3D object manipulation
- Offer click-to-select + click-to-place alternatives
- Support keyboard/gamepad alternatives to dragging

**Examples:**
| Dragging Function | Single-Pointer Alternative |
|-------------------|---------------------------|
| Drag slider | Click on slider track to jump to value |
| Drag object to new position | Click object, then click destination |
| Drag to rotate 3D model | Click rotation buttons or use arrow keys |
| Drag to resize | Click size preset buttons |

**Unity Implementation:**
```csharp
// Provide non-dragging alternative for 3D object placement
public class AccessibleObjectPlacement : MonoBehaviour
{
    private GameObject selectedObject;

    // Alternative to drag-and-drop: click to select, click to place
    void Update()
    {
        if (Input.GetMouseButtonDown(0))
        {
            if (selectedObject == null)
            {
                // First click: select object
                selectedObject = GetClickedObject();
                HighlightSelectedObject(selectedObject);
            }
            else
            {
                // Second click: place object at target location
                Vector3 targetPosition = GetClickedPosition();
                selectedObject.transform.position = targetPosition;
                selectedObject = null;
            }
        }
    }
}
```

**Testing:**
- Verify all drag operations have single-click alternatives
- Test with mouse-only (no dragging allowed)
- Test with keyboard/gamepad inputs

---

#### 2.5.8 Target Size (Minimum) (Level AA)
**Added in:** WCAG 2.2
**Guideline:** 2.5 Input Modalities

**Requirement:**
The size of the target for pointer inputs is at least 24 by 24 CSS pixels, except when:
- **Spacing**: The target is smaller than 24x24 pixels but has sufficient spacing (24 pixels to center of next target)
- **Equivalent**: A different control with the same function is available on the same page that meets the 24x24 requirement
- **Inline**: The target is in a sentence or block of text
- **User Agent Control**: The size is determined by the user agent and not modified by the author
- **Essential**: A particular presentation is essential to the information being conveyed

**Purpose:**
- Helps users with motor impairments click/tap accurately
- Reduces errors from missed clicks
- Improves usability for all users, especially on touchscreens

**Comparison with WCAG 2.1:**
WCAG 2.1 had **2.5.5 Target Size (Enhanced) (AAA)** requiring 44x44 pixels. WCAG 2.2 adds the more lenient **2.5.8 Target Size (Minimum) (AA)** at 24x24 pixels.

**Impact on zSpace Unity Applications:**
All interactive UI elements (buttons, toggles, sliders) should be at least 24x24 pixels:
- Unity UI buttons: Set RectTransform to minimum 24x24
- 3D spatial UI: Ensure colliders are large enough for accurate pointing with zSpace stylus
- Touch targets on VR panels: Minimum 24x24 pixels

**Unity Implementation:**
```csharp
// Validate target sizes meet WCAG 2.2 requirements
[ExecuteInEditMode]
public class AccessibleTargetSize : MonoBehaviour
{
    public const float MINIMUM_SIZE_AA = 24f; // WCAG 2.2 Level AA
    public const float MINIMUM_SIZE_AAA = 44f; // WCAG 2.1 Level AAA

    void OnValidate()
    {
        RectTransform rectTransform = GetComponent<RectTransform>();
        if (rectTransform != null)
        {
            float width = rectTransform.rect.width;
            float height = rectTransform.rect.height;

            if (width < MINIMUM_SIZE_AA || height < MINIMUM_SIZE_AA)
            {
                Debug.LogWarning($"{gameObject.name}: Target size {width}x{height} is below WCAG 2.2 AA minimum (24x24 pixels)");
            }
        }
    }
}
```

**Testing:**
- Measure all interactive elements in Unity UI
- Verify 24x24 minimum or sufficient spacing (24px between centers)
- Test with accessibility audit tools

---

#### 3.2.6 Consistent Help (Level A)
*Covered above in Level A section*

---

#### 3.3.8 Accessible Authentication (Minimum) (Level AA)
**Added in:** WCAG 2.2
**Guideline:** 3.3 Input Assistance

**Requirement:**
A cognitive function test (such as remembering a password or solving a puzzle) is not required for any step in an authentication process unless that step provides at least one of the following:

1. **Alternative**: Another authentication method that does not rely on a cognitive function test
2. **Mechanism**: A mechanism is available to assist the user in completing the cognitive function test
3. **Object Recognition**: The cognitive function test is to recognize objects
4. **Personal Content**: The cognitive function test is to identify non-text content the user provided to the website

**Purpose:**
- Supports users with cognitive disabilities who struggle with passwords
- Enables use of password managers, biometrics, or email/SMS authentication
- Reduces authentication barriers for people with memory impairments

**Impact on zSpace Unity Applications:**
If your zSpace application requires user authentication:
- Support password managers (allow paste into password fields)
- Provide biometric authentication options (fingerprint, facial recognition)
- Offer email/SMS-based authentication as alternative to passwords
- Do NOT use CAPTCHA unless it's object recognition or user-provided content

**Examples of Compliant Authentication:**
- Password field that allows paste (supports password managers) ✓
- Biometric login (fingerprint/face scan) ✓
- Email magic link (click link to authenticate) ✓
- SMS one-time password ✓
- OAuth/SSO (sign in with Google/Microsoft) ✓

**Examples of Non-Compliant Authentication:**
- Password field that blocks paste ✗
- CAPTCHA requiring text transcription ✗
- Security questions requiring memory recall ✗
- Math problems or puzzles ✗

**Unity Implementation:**
```csharp
// Support accessible authentication methods
public class AccessibleAuthentication : MonoBehaviour
{
    // Allow paste in password fields (support password managers)
    public TMP_InputField passwordField;

    void Start()
    {
        // Ensure paste is NOT disabled
        passwordField.readOnly = false;
        passwordField.onValidateInput = null; // Don't block special characters
    }

    // Provide alternative authentication methods
    public void OnBiometricAuthClick()
    {
        // Trigger biometric authentication (platform-specific)
        StartBiometricAuth();
    }

    public void OnEmailAuthClick()
    {
        // Send magic link via email
        SendEmailAuthenticationLink(userEmail);
    }
}
```

**Testing:**
- Verify password fields allow paste
- Test biometric authentication flows
- Confirm alternative methods are available (email/SMS/OAuth)
- Ensure no cognitive tests (puzzles, memory questions) are required

---

### Level AAA (3 new criteria)

#### 2.4.12 Focus Not Obscured (Enhanced) (Level AAA)
*Covered above in Level AA section*

---

#### 2.4.13 Focus Appearance (Level AAA)
*Covered above in Level AA section*

---

#### 3.3.9 Accessible Authentication (Enhanced) (Level AAA)
**Added in:** WCAG 2.2
**Guideline:** 3.3 Input Assistance

**Requirement:**
A cognitive function test (such as remembering a password or solving a puzzle) is not required for any step in an authentication process unless that step provides at least one of the following:

1. **Alternative**: Another authentication method that does not rely on a cognitive function test
2. **Mechanism**: A mechanism is available to assist the user in completing the cognitive function test

**Difference from 3.3.8 (AA):**
3.3.8 (AA) allows **four exceptions** (alternative, mechanism, object recognition, personal content).
3.3.9 (AAA) allows only **two exceptions** (alternative, mechanism).

**Impact:**
For AAA compliance, object recognition CAPTCHAs and personal content authentication are NOT allowed unless an alternative is provided.

---

## Removed Success Criteria

### 4.1.1 Parsing (Level A) - OBSOLETE in WCAG 2.2
**Removed in:** WCAG 2.2
**Guideline:** 4.1 Compatible

**Original Requirement (WCAG 2.0/2.1):**
In content implemented using markup languages, elements have complete start and end tags, elements are nested according to their specifications, elements do not contain duplicate attributes, and any IDs are unique.

**Reason for Removal:**
HTML parsing requirements are now handled by modern browsers automatically. Invalid HTML is corrected by the browser, making this criterion redundant.

**Impact on zSpace Unity Applications:**
No impact. This criterion was specific to web markup (HTML/XML) and does not apply to Unity applications.

---

## Summary Table: WCAG 2.1 vs 2.2

| Change Type | Count | Details |
|-------------|-------|---------|
| **New Success Criteria (Level A)** | 2 | 3.2.6 Consistent Help, 3.3.7 Redundant Entry |
| **New Success Criteria (Level AA)** | 4 | 2.4.11 Focus Not Obscured (Minimum), 2.5.7 Dragging Movements, 2.5.8 Target Size (Minimum), 3.3.8 Accessible Authentication (Minimum) |
| **New Success Criteria (Level AAA)** | 3 | 2.4.12 Focus Not Obscured (Enhanced), 2.4.13 Focus Appearance, 3.3.9 Accessible Authentication (Enhanced) |
| **Removed Success Criteria** | 1 | 4.1.1 Parsing (obsolete) |
| **Total WCAG 2.1 Success Criteria** | 78 | 50 from 2.0 + 17 from 2.1 + 11 from original 1.0 |
| **Total WCAG 2.2 Success Criteria** | 86 | 78 from 2.1 + 9 new - 1 removed |

---

## Migration Checklist: WCAG 2.1 → 2.2

Use this checklist to ensure your zSpace Unity application meets WCAG 2.2 requirements:

### Level A Additions
- [ ] **3.2.6 Consistent Help**: Help mechanisms appear in same relative order across scenes
- [ ] **3.3.7 Redundant Entry**: Previously entered data is auto-populated or selectable

### Level AA Additions (Critical for compliance)
- [ ] **2.4.11 Focus Not Obscured (Minimum)**: Focused elements are at least partially visible
- [ ] **2.5.7 Dragging Movements**: All drag operations have single-pointer alternatives
- [ ] **2.5.8 Target Size (Minimum)**: Interactive targets are ≥24x24 pixels or have sufficient spacing
- [ ] **3.3.8 Accessible Authentication**: Password managers supported, biometric/email alternatives available

### Level AAA Additions (Optional)
- [ ] **2.4.12 Focus Not Obscured (Enhanced)**: Focused elements are completely visible
- [ ] **2.4.13 Focus Appearance**: Focus indicators are ≥2px thick with 3:1 contrast
- [ ] **3.3.9 Accessible Authentication (Enhanced)**: No object recognition CAPTCHAs

### Removal
- [ ] **4.1.1 Parsing**: No action needed (obsolete, web-only)

---

## Impact on zSpace Unity Applications

### High Priority (Level AA)
1. **Target Size (2.5.8)**: Audit all UI buttons, ensure 24x24 minimum
2. **Dragging Movements (2.5.7)**: Add click-to-select alternatives for zSpace stylus dragging
3. **Focus Not Obscured (2.4.11)**: Test keyboard navigation, ensure focus visibility
4. **Accessible Authentication (3.3.8)**: If using authentication, support password managers

### Medium Priority (Level A)
5. **Redundant Entry (3.3.7)**: Auto-populate forms, remember user preferences
6. **Consistent Help (3.2.6)**: Ensure help menus appear in consistent locations

### Low Priority (Level AAA - optional)
7. **Focus Appearance (2.4.13)**: Design high-contrast focus indicators
8. **Focus Not Obscured Enhanced (2.4.12)**: Ensure 100% focus visibility

---

## References

- **WCAG 2.1 Official Specification**: https://www.w3.org/TR/WCAG21/
- **WCAG 2.2 Official Specification**: https://www.w3.org/TR/WCAG22/
- **What's New in WCAG 2.2**: https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/
- **Understanding WCAG 2.2**: https://www.w3.org/WAI/WCAG22/Understanding/

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | October 2025 | Initial document highlighting WCAG 2.1 vs 2.2 differences |

---

**Note**: This document focuses exclusively on the **differences** between WCAG 2.1 and 2.2. For complete WCAG 2.2 compliance, refer to the full specification at https://www.w3.org/TR/WCAG22/.
