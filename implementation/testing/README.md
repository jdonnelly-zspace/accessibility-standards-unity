# Testing Directory

**Platform:** zSpace + Unity (formerly web-based)

---

## Contents

### Unity Test Framework (ACTIVE - zSpace)
**Location:** `../unity/tests/`
**Platform:** Unity PlayMode/EditMode
**Purpose:** Automated accessibility testing for zSpace Unity applications

**Main Test File:**
- `ZSpaceAccessibilityTests.cs` - WCAG 2.2 Level AA + W3C XAUR tests

**How to Run:**
```
Unity Editor:
1. Window → General → Test Runner
2. Select "PlayMode" tab
3. Click "Run All"
4. Verify all tests pass
```

**What It Tests:**
- ✅ Keyboard alternatives for stylus input (WCAG 2.1.1)
- ✅ Target sizes ≥24x24px (WCAG 2.5.8)
- ✅ Depth perception alternatives (W3C XAUR - CRITICAL)
- ✅ Screen reader support (WCAG 4.1.2)
- ✅ Focus indicators in 3D (WCAG 2.4.7)
- ✅ Haptic feedback availability
- ✅ Spatial audio support
- ✅ Menu keyboard navigation

---

### Playwright Web Tests (REFERENCE ONLY - Legacy)
**Location:** `playwright-setup/`
**Platform:** Web browsers (Chrome, Firefox, Edge)
**Status:** ⚠️ **REFERENCE ONLY** - Not applicable to native zSpace Unity apps

**Purpose:**
These Playwright tests are kept as reference material for teams who:
1. Build WebGL zSpace applications
2. Build hybrid web + zSpace experiences
3. Want to learn web accessibility testing patterns

**Files:**
- `playwright.config.js` - Playwright configuration
- `accessibility.spec.js` - Basic accessibility tests
- `accessibility-aaa-tier1.spec.js` - Advanced accessibility tests

**Note:**
For native zSpace Unity applications (the primary focus of this framework), use **Unity Test Framework** instead of Playwright. Playwright is for web applications only.

---

## Migration from Web to Unity Testing

### Before (Web - Playwright)
```javascript
// Playwright test
test('button should be accessible', async ({ page }) => {
  await page.goto('/');
  await injectAxe(page);
  await checkA11y(page);
});
```

### After (Unity - Unity Test Framework)
```csharp
// Unity Test Framework test
[Test]
public void Button_MeetsMinimumTargetSize()
{
    testButton = CreateTestButton("TestButton");
    var rect = testButton.GetComponent<RectTransform>();

    Assert.GreaterOrEqual(rect.rect.width, 24f);
    Assert.GreaterOrEqual(rect.rect.height, 24f);
}
```

---

## When to Use Which Testing Framework

### Use Unity Test Framework When:
- ✅ Building native zSpace Unity applications (primary use case)
- ✅ Testing C# components and scripts
- ✅ Testing 3D interactions, depth cues, stylus input
- ✅ Testing PlayMode or EditMode behavior
- ✅ CI/CD with Unity Cloud Build

### Use Playwright When:
- ⚠️ Building WebGL zSpace applications (rare)
- ⚠️ Testing web-based configuration UIs
- ⚠️ Building hybrid web + zSpace experiences
- ⚠️ CI/CD with traditional web deployment

**For most zSpace projects: Use Unity Test Framework.**

---

## Running Playwright Tests (If Applicable)

**Prerequisites:**
```bash
npm install
npx playwright install
```

**Run Tests:**
```bash
# Run all tests
npm run test:a11y

# Run specific test
npx playwright test accessibility.spec.js

# Run with UI mode
npx playwright test --ui
```

**Note:** These tests are designed for web applications. They will not work with native Unity builds.

---

## Continuous Integration (CI/CD)

### Unity Test Framework (zSpace Apps)
```yaml
# GitHub Actions example
- name: Run Unity Tests
  uses: game-ci/unity-test-runner@v2
  with:
    testMode: PlayMode
    checkName: Accessibility Tests
```

### Playwright (WebGL Apps)
```yaml
# GitHub Actions example
- name: Run Playwright Tests
  run: |
    npm install
    npx playwright install
    npx playwright test
```

---

## Resources

- **Unity Test Framework Docs:** https://docs.unity3d.com/Packages/com.unity.test-framework@latest
- **Playwright Docs:** https://playwright.dev/
- **zSpace Testing Guide:** `../../workflows/QA-WORKFLOW.md`
- **Example Tests:** `../unity/tests/ZSpaceAccessibilityTests.cs`

---

**Last Updated:** October 16, 2025
**Framework Version:** 2.0.0 (zSpace)
**Primary Testing:** Unity Test Framework (PlayMode)
**Legacy Testing:** Playwright (WebGL reference only)
