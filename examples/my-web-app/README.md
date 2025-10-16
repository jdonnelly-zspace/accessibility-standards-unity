# Web App Accessibility Example (Reference Only)

**Status:** Reference Material (NOT zSpace/Unity)
**Purpose:** Demonstrates web accessibility patterns for team learning
**Platform:** Web (React, JSX, Playwright)

---

## ⚠️ Important Notice

This directory contains a **web application accessibility example** and is **NOT** directly applicable to zSpace Unity development.

**This repository has been adapted for zSpace (stereoscopic 3D desktop platform).** The main framework now focuses on Unity C# + zSpace SDK, not web development.

---

## Why This Example Is Still Here

This web app example is **kept as reference material** for the following reasons:

1. **Team Learning:** Demonstrates accessibility principles that apply across platforms
2. **WCAG 2.2 Patterns:** Shows implementation of WCAG 2.2 Level AA criteria
3. **Testing Patterns:** Playwright + axe-core testing approach can inspire Unity Test Framework tests
4. **Documentation Reference:** Case study shows how to document accessibility implementations

---

## What's in This Directory

```
examples/my-web-app/
├── README.md                ← This file (explains context)
├── ACCESSIBILITY.md         ← Web accessibility implementation (React/web-specific)
├── CASE-STUDY.md            ← Web app case study (React/Playwright)
├── BlogPost.jsx             ← React component (web-specific)
├── accessibility.spec.js    ← Playwright E2E tests (web-specific)
└── eslint.config.js         ← ESLint config (web-specific)
```

---

## Technology Stack (Web, NOT Unity)

**Frontend:**
- React (JavaScript)
- JSX
- CSS

**Testing:**
- Playwright (E2E testing)
- axe-core (automated accessibility testing)
- ESLint + jsx-a11y (linting)

**Standards:**
- WCAG 2.2 Level AA (web context)
- Section 508
- EN 301 549

---

## How This Relates to zSpace

While this example is **web-based**, some principles translate to zSpace Unity development:

### Transferable Concepts ✅

1. **WCAG 2.2 Success Criteria:**
   - SC 2.4.11: Focus Not Obscured → Same requirement in Unity 3D UI
   - SC 2.5.8: Target Size (24x24px) → Desktop standard, also applies to zSpace
   - SC 3.3.7: Redundant Entry → Form patterns can inspire Unity UI
   - SC 3.3.8: Accessible Authentication → Login patterns transferable

2. **Testing Philosophy:**
   - Automated + Manual testing approach
   - Keyboard-only testing
   - Screen reader testing
   - Color contrast verification

3. **Documentation Approach:**
   - Case study format
   - Implementation guide
   - Test coverage documentation

### Non-Transferable (Web-Specific) ❌

1. **Technology:**
   - React, JSX, HTML, CSS → Unity uses C#, UGUI, TextMeshPro
   - Playwright → Unity uses Unity Test Framework
   - ESLint → Unity uses C# linting

2. **Platform:**
   - Web browser → Unity desktop application
   - Mobile touch → zSpace stylus + keyboard
   - 2D web layout → 3D stereoscopic zSpace

3. **Screen Readers:**
   - Web: TalkBack, VoiceOver (mobile)
   - zSpace: NVDA, Narrator, JAWS (Windows desktop)

---

## For zSpace Unity Development, See:

Instead of referencing this web example, use the **zSpace-specific** resources:

### Workflows
- `/workflows/DEVELOPER-WORKFLOW.md` - Unity C# + zSpace SDK patterns
- `/workflows/DESIGNER-WORKFLOW.md` - Unity 3D UI design for zSpace
- `/workflows/QA-WORKFLOW.md` - Unity Test Framework testing

### Standards
- `/standards/ZSPACE-ACCESSIBILITY-CHECKLIST.md` - Complete zSpace checklist
- `/standards/XR-ACCESSIBILITY-REQUIREMENTS.md` - zSpace-adapted requirements
- `/standards/WCAG-2.2-LEVEL-AA.md` - WCAG 2.2 (general, platform-agnostic)

### Implementation (Future - Phase 3)
- `/implementation/unity/scripts/` - Unity C# accessibility components
- `/implementation/unity/prefabs/` - Accessible Unity prefabs
- `/implementation/unity/tests/` - Unity Test Framework tests

---

## Learning Value

If you're new to accessibility, this web example can help you understand:

1. **How WCAG 2.2 criteria work in practice** (web context)
2. **How to write automated accessibility tests** (concept transferable to Unity)
3. **How to document accessibility implementations** (case study format)
4. **How to structure an accessibility testing approach** (automated + manual)

**But remember:** The code here is React/JSX (web). For zSpace Unity, you'll write C# code using zSpace SDK.

---

## Decision Log

**Date:** October 16, 2025
**Phase 2, Task 2.5:** Clean up examples/my-web-app/

**Decision:** **Keep as reference material**

**Rationale:**
1. Demonstrates accessibility principles that transcend platforms
2. Shows how to document accessibility work (case study format)
3. Useful for team members learning accessibility concepts
4. Not zSpace-specific, but not harmful to keep
5. Clearly marked as "Reference Only" to avoid confusion

**Alternative Considered:** Delete web examples
**Rejected Because:** Valuable reference material for team learning, low cost to maintain

---

## Want to Contribute?

**For Web Accessibility Examples:**
- This is a reference example and not actively maintained for zSpace project
- Contributions to web patterns welcome but not priority

**For zSpace Unity Development:**
- See `/CONTRIBUTING.md`
- Focus on Unity C# components in `/implementation/unity/`
- Add Unity Test Framework tests
- Document zSpace-specific patterns

---

**Repository Focus:** zSpace (Unity 3D + stereoscopic desktop)
**This Example:** Web (React + browser)
**Status:** Reference Material Only
**Last Updated:** October 2025
