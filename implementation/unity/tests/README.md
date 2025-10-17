# Unity Test Framework Tests - Accessibility

**Directory:** `implementation/unity/tests/`
**Platform:** Unity Test Framework (PlayMode)

---

## Contents

This directory contains Unity Test Framework tests for validating zSpace accessibility compliance.

### Test Files to be Created (Task 3.2-3.3)

- `ZSpaceAccessibilityTests.cs` - Main PlayMode accessibility test suite
- `InputAlternativesTests.cs` - Keyboard alternative validation
- `DepthPerceptionTests.cs` - Depth cue validation (CRITICAL)
- `TargetSizeTests.cs` - Target size validation (≥ 24x24px)
- `ScreenReaderTests.cs` - Screen reader integration tests

---

## Running Tests

```
Unity Editor:
1. Window → General → Test Runner
2. Select "PlayMode" tab
3. Click "Run All"
4. Verify all tests pass
```

### Test Coverage

Tests validate:
- ✅ All stylus interactions have keyboard alternatives
- ✅ All interactive elements ≥ 24x24 pixels
- ✅ Application runs without stereoscopic 3D (glasses off)
- ✅ Depth cues present (size, shadow, audio, haptic)
- ✅ AccessibilityManager nodes registered for screen readers
- ✅ Focus indicators visible in 3D space

---

**Status:** Tests to be created in Phase 3, Tasks 3.2-3.3
