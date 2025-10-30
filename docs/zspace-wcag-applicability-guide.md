# zSpace WCAG Applicability Guide

**Version:** 1.0
**Date:** October 29, 2025
**Audience:** Developers, QA Engineers, Accessibility Auditors

---

## Overview

This guide explains which WCAG 2.2 criteria apply to zSpace Unity applications and which do not, based on the fundamental differences between web content and native desktop stereoscopic 3D applications.

**Key Principle:** WCAG was primarily designed for web content. Many criteria assume HTML/CSS architecture, web browsers, and mobile devices. zSpace applications are **native desktop applications** built with Unity that run on **fixed proprietary hardware** with **stereoscopic 3D displays**.

---

## Platform Architecture: Why Some Criteria Don't Apply

### zSpace Technology Overview

```
Application Type:    Native Desktop (not web)
Engine:             Unity (not HTML/CSS/DOM)
Hardware:           zSpace AIO Pro/Inspire (proprietary)
Display:            Stereoscopic 3D with head-tracking (fixed orientation)
OS:                 Windows 10/11
Input:              Stylus, Mouse, Keyboard
Deployment:         Standalone .exe (not browser-based)
```

### Key Architectural Differences

| WCAG Assumes | zSpace Reality |
|--------------|----------------|
| HTML markup with DOM | Unity component-based C# scripts |
| CSS styling | Unity materials, shaders, canvas scaling |
| Web browser rendering | DirectX/OpenGL game engine rendering |
| Responsive viewports | Fixed-resolution full-screen application |
| Mobile device rotation | Fixed landscape hardware orientation |
| Assistive tech parses HTML | Unity Accessibility Framework/API |

---

## Criteria Categories

### ❌ Not Applicable (Skip Entirely)

These criteria fundamentally don't apply to Unity applications:

#### 4.1.1 Parsing (Level A)
**Why:** Unity doesn't use HTML/XML markup. No DOM to parse.
**Instead:** Use WCAG 4.1.2 (Name, Role, Value) via Unity Accessibility Framework.

**Example:**
```csharp
// ❌ No HTML to validate
<button id="duplicate-id">Click</button> <!-- Not applicable -->

// ✅ Unity approach
GetComponent<Button>().onClick.AddListener(HandleClick);
accessibilityLabel = "Rotate Object Button";
```

#### 1.3.5 Identify Input Purpose (Level AA)
**Why:** Designed for autocomplete on personal data forms (name, email, credit card).
**Applies if:** Your app has user registration, profiles, or payment forms.
**Typical zSpace apps:** Educational content with no personal data collection = Not Applicable.

---

### ⚠️ Limited Applicability (Different Implementation)

These criteria apply, but not in the web-centric way WCAG describes:

#### 1.4.12 Text Spacing (Level AA)
**Why Limited:** WCAG specifies CSS properties (`line-height`, `letter-spacing`) that don't exist in Unity.

**Unity Equivalent Implementation:**
```csharp
// WCAG requirement: line-height: 1.5
// Unity equivalent:
textComponent.lineSpacing = 1.5f;

// WCAG requirement: letter-spacing: 0.12em
// Unity equivalent:
textComponent.characterSpacing = 12f; // Approximately 0.12 × font size

// WCAG requirement: word-spacing: 0.16em
// Unity equivalent:
textComponent.wordSpacing = 16f;
```

**Compliance Approach:**
1. Provide user settings to adjust text spacing
2. Test that text doesn't clip or overlap when spacing increases
3. Use TextMesh Pro's spacing parameters

#### 1.4.10 Reflow (Level AA)
**Why Limited:** Designed for responsive web layouts at 320px or 256px viewports.

**Unity Context:**
- zSpace displays are fixed resolution (1920×1080 typical)
- Applications run full-screen, not in resizable windows
- Users don't zoom the entire interface like web browsers
- 3D spatial environments inherently require 2D layout

**Compliance Approach:**
- Implement scalable UI elements (Canvas scaling)
- Support adjustable text sizes
- Test on different zSpace models (AIO Pro vs. Inspire)
- Exception applies: 3D spatial content requires specific layout

---

### 🔄 Context-Dependent (May or May Not Apply)

Whether these apply depends on your specific application:

#### 1.2.1 Audio-only and Video-only (Level A)
**Not Applicable if:** No standalone audio/video content
**Applies if:** Tutorial videos, audio narrations, pre-recorded demonstrations

**Check your project:**
```bash
# Search for audio/video files
find Assets -name "*.mp3" -o -name "*.wav" -o -name "*.mp4"
```

#### 3.1.2 Language of Parts (Level AA)
**Not Applicable if:** English-only content
**Applies if:** Mixed-language content, quotes in foreign languages, bilingual UI

#### 2.4.5 Multiple Ways (Level AA)
**Not Applicable if:** Linear tutorial/lesson path (educational sequence)
**Applies if:** Free-form navigation, multiple paths to content, search functionality

**Example - Not Applicable:**
```
Lesson 1 → Lesson 2 → Lesson 3 → Quiz
(Prescribed educational sequence = "step in a process" exception)
```

**Example - Applies:**
```
Main Menu:
├── Browse by Category
├── Alphabetical List
└── Search Function
(Multiple ways to access content = criterion applies)
```

---

### ✅ Supports (Special Case)

#### 1.3.4 Orientation (Level AA)
**Status:** Automatically Supports with Essential Exception

**Why Special:**
- zSpace displays are **physically** landscape-oriented and cannot rotate
- Not a software restriction (user can't physically rotate the monitor)
- Stereoscopic 3D **requires** specific orientation for head-tracking
- WCAG allows orientation restrictions when "essential" - stereoscopic 3D qualifies

**Conformance:** Content is not programmatically restricted; hardware orientation is an inherent device characteristic.

---

### 📝 Context-Specific (Applies Differently)

#### 3.2.3 Consistent Navigation (Level AA)
**Web terminology:** "Navigational mechanisms repeated on multiple **Web pages**"
**Unity terminology:** "Navigational mechanisms repeated across multiple **scenes/states**"

**Implementation:**
```csharp
// ✅ Consistent across scenes
public class SceneNavigation : MonoBehaviour
{
    // Always in top-right corner
    void CreateBackButton() {
        Vector3 position = new Vector3(Screen.width - 100, Screen.height - 50, 0);
        // Same position, same function across all scenes
    }
}
```

#### 3.2.4 Consistent Identification (Level AA)
**Web context:** Same button labels/icons across pages
**Unity context:** Same prefabs/components with consistent accessible names

**Implementation:**
```csharp
// ✅ Consistent across scenes
// "Rotate Object" always uses the same icon and accessible name
public class RotateButton : MonoBehaviour
{
    void Start() {
        accessibilityLabel = "Rotate Object";
        icon = Resources.Load<Sprite>("Icons/rotate_icon");
    }
}
```

---

## VPAT Documentation Guidelines

When creating a VPAT for zSpace applications:

### 1. Include Platform Constraints Section

```markdown
## Platform Constraints

**Application Type:** Native desktop application (not web content)
**Engine:** Unity (component-based C# architecture)
**Hardware:** zSpace AIO Pro/Inspire proprietary displays
**Display:** Fixed stereoscopic 3D with head-tracking
**Deployment:** Standalone Windows executable

Due to these architectural differences, several WCAG criteria designed
specifically for web content do not apply to this application.
```

### 2. Mark Non-Applicable Criteria Clearly

```markdown
### 4.1.1 Parsing (Level A)

**Result:** Not Applicable

**Justification:** This criterion applies to markup languages (HTML/XML).
Unity applications use C# component-based architecture and do not have
HTML elements or a DOM that can be parsed by assistive technologies.

**Applicable Alternative:** The application implements WCAG 4.1.2
(Name, Role, Value) through the Unity Accessibility Framework.
```

### 3. Explain Equivalent Compliance

```markdown
### 1.4.12 Text Spacing (Level AA)

**Result:** Supports (Unity Equivalent)

**Explanation:** While CSS properties referenced in this criterion do not
exist in Unity, the application achieves equivalent accessibility through
TextMesh Pro parameters:
- Line spacing configurable to 1.5× font size
- Character spacing adjustable to 0.12× font size
- Text remains readable without clipping when spacing increases

**Testing:** Verified with TextMesh Pro spacing parameters at recommended levels.
```

### 4. Address Educational Context

```markdown
### 2.4.5 Multiple Ways (Level AA)

**Result:** Not Applicable

**Justification:** This application follows a guided educational sequence
where students progress through lessons in a prescribed order as part of
the curriculum. This qualifies as a "step in a process" per WCAG's
exception criteria. Teachers control the learning path to ensure proper
concept progression.
```

---

## Developer Quick Reference

### Before You Start Coding

**Ask these questions:**

1. **Does my app collect personal data?**
   → If NO: 1.3.5 doesn't apply
   → If YES: Implement input purpose identification

2. **Does my app have audio/video content?**
   → If NO: 1.2.1, 1.2.3 don't apply
   → If YES: Add captions, transcripts, audio descriptions

3. **Is my app English-only?**
   → If YES: 3.1.2 doesn't apply
   → If NO: Implement language markup for mixed content

4. **Does my app have free-form navigation?**
   → If NO (linear tutorial): 2.4.5 doesn't apply
   → If YES: Provide multiple ways to access content

### Use the Configuration File

The framework includes `config/zspace-non-applicable-criteria.json` with all this information encoded for automated auditing.

```javascript
// The audit tool automatically reads this config
const config = require('./config/zspace-non-applicable-criteria.json');

// Non-applicable criteria are marked in reports
if (config.nonApplicableCriteria['4.1.1'].status === 'not-applicable') {
  report.addExemption('4.1.1', config.nonApplicableCriteria['4.1.1'].justification);
}
```

---

## Essential Requirements (Still Must Do!)

Even though some criteria don't apply, you **must** achieve equivalent accessibility:

### ✅ Required for All zSpace Apps

1. **Unity Accessibility Framework**
   - Expose UI elements to assistive technologies
   - Implement Name, Role, Value (4.1.2)

2. **Keyboard Alternatives**
   - Every stylus interaction must have keyboard equivalent
   - Users who can't use stylus can still access features

3. **Multiple Sensory Cues**
   - Don't rely on 3D depth alone
   - Provide visual, audio, and haptic feedback

4. **Configurable Settings**
   - Adjustable text sizes
   - Configurable text spacing (Unity equivalents)
   - Color customization

5. **Consistent Patterns**
   - Same interactions work the same way across scenes
   - Predictable navigation flow

### The Goal

> Ensure all students can access educational content regardless of abilities,
> using methods appropriate to the zSpace platform and Unity technology.

---

## Legal and Compliance Notes

### Section 508 and EN 301 549

These standards reference WCAG 2.1 Level AA. The same non-applicability justifications apply:

- **Procurement officers understand:** Native apps differ from web content
- **Key principle:** Equivalent functionality, not literal criterion compliance
- **Risk mitigation:** Document your analysis and platform-specific approach

### Educational Institution Requirements

K-12 schools and universities should understand:

- **Controlled environment:** Classroom use with teacher supervision
- **Fixed hardware:** Purpose-built educational devices
- **Teacher mediation:** Instructors provide accommodations
- **Complementary materials:** Lesson plans and worksheets should be accessible

---

## Resources

### Framework Files

- **Configuration:** `/config/zspace-non-applicable-criteria.json`
- **Unity Components:** `/implementation/unity/scripts/`
- **VPAT Templates:** `/templates/audit/VPAT*.template.md`

### External References

- [WCAG 2.2](https://www.w3.org/WAI/WCAG22/)
- [Unity Accessibility](https://docs.unity3d.com/Manual/accessibility.html)
- [zSpace Developer Portal](https://developer.zspace.com/)
- [Section 508 Standards](https://www.section508.gov/)

---

## Summary Decision Tree

```
Is this a web-specific criterion (HTML/CSS/markup)?
├─ YES → Likely not applicable, check config file
└─ NO → Continue...

Does it reference personal data collection?
├─ YES → Does your app collect personal data?
│  ├─ YES → Criterion applies
│  └─ NO → Not applicable
└─ NO → Continue...

Does it reference audio/video content?
├─ YES → Does your app have audio/video?
│  ├─ YES → Criterion applies
│  └─ NO → Not applicable
└─ NO → Continue...

Is it about navigation/structure?
├─ YES → Translate from "web pages" to "Unity scenes"
│        Criterion applies with Unity-specific interpretation
└─ NO → Criterion likely applies normally
```

---

## Questions?

For zSpace-specific accessibility questions:
- Email: accessibility@zspace.com
- Developer Portal: https://developer.zspace.com/

For framework issues:
- GitHub: https://github.com/jdonnelly-zspace/accessibility-standards-unity

---

**Document Version:** 1.0
**Last Updated:** October 29, 2025
**Maintained By:** zSpace Accessibility Team
