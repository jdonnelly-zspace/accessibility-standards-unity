# Automation Expansion Proposal
## Reducing Manual Testing Effort by 50%

**Date:** October 22, 2025
**Current Manual Effort:** ~80% of accessibility testing
**Target Manual Effort:** ~30% of accessibility testing
**Reduction Goal:** 50% decrease

---

## Current State Analysis

### What We Have Automated (Quick Wins 1-4)

| Quick Win | Coverage | Effort Saved |
|-----------|----------|--------------|
| QW1: App Launch & Monitoring | Application stability, performance | 10% |
| QW2: Log Analysis | Error detection, scene tracking | 15% |
| QW3: Input Automation | UI interaction simulation | 5% |
| QW4: Keyboard Navigation | Basic keyboard testing | 10% |
| **Total Current Automation** | | **40%** |

### What's Still Manual (60% Effort)

| Test Area | Manual Effort | WCAG Criteria | Automation Potential |
|-----------|---------------|---------------|---------------------|
| **Color Contrast** | 15% | 1.4.3, 1.4.11 | HIGH (90% automatable) |
| **Screen Reader Testing** | 12% | 4.1.2 | MEDIUM (60% automatable) |
| **Focus Indicators** | 8% | 2.4.7 | HIGH (80% automatable) |
| **Text Size/Readability** | 6% | 1.4.4 | HIGH (85% automatable) |
| **Alternative Text** | 5% | 1.1.1 | MEDIUM (50% automatable) |
| **Motion/Flashing** | 4% | 2.3.1 | HIGH (90% automatable) |
| **Form Accessibility** | 5% | 3.3.1, 3.3.2 | MEDIUM (60% automatable) |
| **Semantic Structure** | 5% | 1.3.1 | MEDIUM (70% automatable) |

**Total Manual Effort:** 60%
**Automatable:** ~45% (75% of manual work)
**Target Automation:** 30% reduction → **Total 70% automated**

---

## Proposed New Quick Wins (QW6-QW11)

### Quick Win 6: Automated Color Contrast Analyzer ⭐ HIGH IMPACT

**Effort Saved:** 15% (eliminates most manual contrast testing)
**Implementation Complexity:** Medium
**WCAG Coverage:** 1.4.3 (Level AA), 1.4.11 (Level AA)

#### What It Does

1. Takes screenshots of all application screens
2. Extracts UI elements using computer vision
3. Detects foreground/background color pairs
4. Calculates contrast ratios for all text
5. Identifies UI components and their contrast
6. Generates WCAG 2.1 compliance report

#### Technical Approach

```python
# Pseudocode for Quick Win 6
import cv2
import numpy as np
from PIL import Image
from colorthief import ColorThief

class ColorContrastAnalyzer:
    def __init__(self, screenshot_dir):
        self.screenshots = []
        self.contrast_results = []

    def analyze_screenshot(self, image_path):
        """Analyze single screenshot for contrast issues"""
        img = Image.open(image_path)

        # 1. Detect text regions using OCR
        text_regions = self.detect_text_regions(img)

        # 2. For each text region, extract colors
        for region in text_regions:
            fg_color = self.get_text_color(img, region)
            bg_color = self.get_background_color(img, region)

            # 3. Calculate contrast ratio
            ratio = self.calculate_contrast_ratio(fg_color, bg_color)

            # 4. Check WCAG compliance
            text_size = self.estimate_text_size(region)
            is_large_text = text_size >= 18 or (text_size >= 14 and self.is_bold(region))

            min_ratio = 3.0 if is_large_text else 4.5
            passes = ratio >= min_ratio

            self.contrast_results.append({
                'region': region,
                'fg_color': fg_color,
                'bg_color': bg_color,
                'ratio': ratio,
                'required': min_ratio,
                'passes': passes,
                'wcag_criterion': '1.4.3'
            })

    def calculate_contrast_ratio(self, color1, color2):
        """Calculate WCAG contrast ratio"""
        l1 = self.relative_luminance(color1)
        l2 = self.relative_luminance(color2)

        lighter = max(l1, l2)
        darker = min(l1, l2)

        return (lighter + 0.05) / (darker + 0.05)

    def relative_luminance(self, rgb):
        """Calculate relative luminance per WCAG formula"""
        r, g, b = [x / 255.0 for x in rgb]

        # Linearize RGB
        r = r / 12.92 if r <= 0.03928 else ((r + 0.055) / 1.055) ** 2.4
        g = g / 12.92 if g <= 0.03928 else ((g + 0.055) / 1.055) ** 2.4
        b = b / 12.92 if b <= 0.03928 else ((b + 0.055) / 1.055) ** 2.4

        return 0.2126 * r + 0.7152 * g + 0.0722 * b
```

#### Output Example

```json
{
  "timestamp": "2025-10-22T20:30:00",
  "screenshots_analyzed": 15,
  "total_text_regions": 247,
  "contrast_issues": [
    {
      "screenshot": "main_menu.png",
      "region": {"x": 120, "y": 340, "w": 200, "h": 40},
      "text": "Start Game",
      "fg_color": "#666666",
      "bg_color": "#CCCCCC",
      "ratio": 3.8,
      "required": 4.5,
      "passes": false,
      "wcag_criterion": "1.4.3",
      "severity": "HIGH"
    }
  ],
  "summary": {
    "total_checks": 247,
    "passed": 201,
    "failed": 46,
    "pass_rate": 81.4,
    "wcag_compliant": false
  }
}
```

#### Info Needed

- [ ] Do you want to test specific scenes, or should it auto-navigate through all screens?
- [ ] Should it detect UI element types (button, text, icon) or just analyze all visible text?
- [ ] Do you want integration with Unity UI system for precise element detection?
- [ ] Acceptable false positive rate? (Computer vision isn't 100% accurate)

---

### Quick Win 7: Focus Indicator Detector ⭐ HIGH IMPACT

**Effort Saved:** 8% (automates focus visibility testing)
**Implementation Complexity:** Medium
**WCAG Coverage:** 2.4.7 (Level AA)

#### What It Does

1. Extends Quick Win 4 (keyboard navigation)
2. Takes screenshots before/after Tab press
3. Uses computer vision to detect visual changes
4. Measures focus indicator properties:
   - Visibility (is there a change?)
   - Contrast ratio (minimum 3:1)
   - Size/thickness (minimum 2px)
   - Color/style consistency
5. Generates focus indicator compliance report

#### Technical Approach

```python
class FocusIndicatorDetector:
    def test_focus_visibility(self):
        """Test focus indicators by comparing screenshots"""
        results = []

        # Take initial screenshot
        screenshot_before = self.capture_screenshot()

        # Press Tab
        pyautogui.press('tab')
        time.sleep(0.5)

        # Take after screenshot
        screenshot_after = self.capture_screenshot()

        # Compare images to detect differences
        diff = self.compare_images(screenshot_before, screenshot_after)

        # Analyze difference region
        if diff.has_changes:
            focus_region = diff.changed_region

            # Measure focus indicator properties
            indicator_color = self.extract_indicator_color(screenshot_after, focus_region)
            background_color = self.extract_surrounding_color(screenshot_after, focus_region)

            contrast = self.calculate_contrast_ratio(indicator_color, background_color)
            thickness = self.measure_border_thickness(diff.diff_image, focus_region)

            results.append({
                'has_focus_indicator': True,
                'contrast_ratio': contrast,
                'passes_contrast': contrast >= 3.0,
                'thickness_px': thickness,
                'passes_thickness': thickness >= 2,
                'wcag_compliant': contrast >= 3.0 and thickness >= 2
            })
        else:
            results.append({
                'has_focus_indicator': False,
                'wcag_compliant': False,
                'issue': 'No visible focus indicator detected'
            })

        return results
```

#### Info Needed

- [ ] Are focus indicators consistent across the app, or do different screens use different styles?
- [ ] Do you use Unity's built-in navigation system or custom focus management?
- [ ] Acceptable detection tolerance? (Some focus indicators are subtle)

---

### Quick Win 8: OCR-Based Text Size & Readability Analyzer

**Effort Saved:** 6% (automates text sizing checks)
**Implementation Complexity:** Medium
**WCAG Coverage:** 1.4.4 (Level AA), 1.4.12 (Level AA)

#### What It Does

1. Extracts all text from screenshots using Tesseract OCR
2. Estimates font sizes (in points/pixels)
3. Checks text spacing (line height, letter spacing)
4. Validates text is resizable (tests at 200% zoom if possible)
5. Calculates readability scores (Flesch-Kincaid)
6. Generates text accessibility report

#### Technical Approach

```python
import pytesseract
from PIL import Image

class TextAccessibilityAnalyzer:
    def analyze_text(self, image_path):
        """Analyze text size and readability"""
        img = Image.open(image_path)

        # Extract text with bounding boxes
        data = pytesseract.image_to_data(img, output_type=pytesseract.Output.DICT)

        results = []
        for i in range(len(data['text'])):
            if data['text'][i].strip():
                # Estimate font size from bounding box height
                height = data['height'][i]
                estimated_font_size = self.height_to_font_size(height)

                # Check if text is readable
                min_size = 12  # Minimum recommended

                results.append({
                    'text': data['text'][i],
                    'font_size_px': estimated_font_size,
                    'meets_minimum': estimated_font_size >= min_size,
                    'location': {
                        'x': data['left'][i],
                        'y': data['top'][i],
                        'w': data['width'][i],
                        'h': data['height'][i]
                    }
                })

        return results
```

#### Info Needed

- [ ] Do you have ability to programmatically change text size in the app?
- [ ] Are there specific text size requirements beyond WCAG minimums?
- [ ] Should it check specific content types (body text vs headings vs labels)?

---

### Quick Win 9: Automated Screen Reader Property Validator ⭐ MEDIUM-HIGH IMPACT

**Effort Saved:** 7% (automates accessible name/role/value checking)
**Implementation Complexity:** High
**WCAG Coverage:** 4.1.2 (Level A), 1.3.1 (Level A)

#### What It Does

1. Uses Windows UI Automation API to inspect application
2. Extracts accessible properties for all UI elements:
   - Name (accessible label)
   - Role (button, text, image, etc.)
   - Value (current state)
   - Description
3. Validates completeness (no missing names)
4. Tests with actual screen reader (NVDA CLI)
5. Generates screen reader compatibility report

#### Technical Approach

```python
import comtypes.client
from comtypes.gen.UIAutomationClient import *

class ScreenReaderValidator:
    def __init__(self):
        self.uia = comtypes.client.CreateObject(
            '{ff48dba4-60ef-4201-aa87-54103eef594e}',
            interface=IUIAutomation
        )

    def inspect_application(self, process_id):
        """Inspect all UI elements in application"""
        # Get root element for process
        condition = self.uia.CreatePropertyCondition(
            UIA_ProcessIdPropertyId, process_id
        )
        root = self.uia.GetRootElement().FindFirst(
            TreeScope_Children, condition
        )

        # Walk UI tree and collect elements
        elements = self.walk_tree(root)

        # Validate each element
        results = []
        for element in elements:
            validation = self.validate_element(element)
            results.append(validation)

        return results

    def validate_element(self, element):
        """Validate accessible properties"""
        try:
            name = element.CurrentName
            control_type = element.CurrentControlType
            help_text = element.CurrentHelpText

            # Check for issues
            issues = []

            if not name or name.strip() == '':
                issues.append('Missing accessible name')

            if control_type in [UIA_ButtonControlTypeId, UIA_LinkControlTypeId]:
                if not name:
                    issues.append('Interactive element missing label')

            return {
                'element_type': self.control_type_to_string(control_type),
                'name': name,
                'help_text': help_text,
                'issues': issues,
                'wcag_compliant': len(issues) == 0
            }
        except:
            return {
                'error': 'Could not inspect element',
                'wcag_compliant': False
            }
```

#### Info Needed

- [ ] Does Career Explorer expose UI Automation properties? (Unity apps sometimes don't)
- [ ] Would you be willing to add Unity Accessibility Plugin for better automation support?
- [ ] Do you want actual NVDA testing (requires NVDA installed) or just property validation?
- [ ] Is there a WebGL build we could test with axe-core instead?

---

### Quick Win 10: Motion & Flash Detection

**Effort Saved:** 4% (automates motion/flash testing)
**Implementation Complexity:** Medium
**WCAG Coverage:** 2.3.1 (Level A), 2.2.2 (Level A)

#### What It Does

1. Records video of application (30-60 seconds)
2. Analyzes frame-by-frame for:
   - Flashing content (>3 flashes per second)
   - Auto-playing animations
   - Moving content
   - Parallax effects
3. Measures flash frequency and area
4. Generates motion accessibility report

#### Technical Approach

```python
import cv2
import numpy as np

class MotionFlashDetector:
    def analyze_video(self, video_path):
        """Detect flashing and motion"""
        cap = cv2.VideoCapture(video_path)
        fps = cap.get(cv2.CAP_PROP_FPS)

        frames = []
        flashes = []

        # Read all frames
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            frames.append(frame)

        # Analyze frame differences
        for i in range(1, len(frames)):
            diff = cv2.absdiff(frames[i-1], frames[i])

            # Detect significant brightness changes (potential flash)
            gray_diff = cv2.cvtColor(diff, cv2.COLOR_BGR2GRAY)
            mean_change = np.mean(gray_diff)

            if mean_change > threshold:
                flashes.append({
                    'frame': i,
                    'time': i / fps,
                    'intensity': mean_change
                })

        # Count flashes per second
        flash_rate = self.calculate_flash_rate(flashes, fps)

        return {
            'total_flashes': len(flashes),
            'max_flash_rate': flash_rate,
            'wcag_compliant': flash_rate <= 3,
            'wcag_criterion': '2.3.1'
        }
```

#### Info Needed

- [ ] Should it record automatically during Quick Win 1 app monitoring?
- [ ] How long should it record? (longer = more coverage but slower)
- [ ] Are there specific scenes with known animations we should focus on?

---

### Quick Win 11: Form & Input Accessibility Validator

**Effort Saved:** 5% (automates form testing)
**Implementation Complexity:** Medium
**WCAG Coverage:** 3.3.1 (Level A), 3.3.2 (Level A), 1.3.5 (Level AA)

#### What It Does

1. Detects form fields in screenshots
2. Validates labels are present and associated
3. Tests error message visibility
4. Checks input validation accessibility
5. Validates autocomplete attributes (if applicable)
6. Generates form accessibility report

#### Technical Approach

```python
class FormAccessibilityValidator:
    def detect_forms(self, screenshot):
        """Detect form elements using computer vision"""
        # Use template matching to find common form controls
        text_boxes = self.find_text_boxes(screenshot)
        checkboxes = self.find_checkboxes(screenshot)
        buttons = self.find_buttons(screenshot)

        # For each input, look for nearby label
        results = []
        for text_box in text_boxes:
            label = self.find_nearby_label(screenshot, text_box)

            results.append({
                'input_type': 'text',
                'location': text_box,
                'has_label': label is not None,
                'label_text': label.text if label else None,
                'wcag_compliant': label is not None
            })

        return results

    def test_error_messages(self):
        """Test error message visibility"""
        # Submit invalid input
        pyautogui.click(text_field_x, text_field_y)
        pyautogui.typewrite('invalid')
        pyautogui.press('enter')

        time.sleep(1)

        # Capture screenshot
        screenshot_after = self.capture_screenshot()

        # Look for red text or error indicators
        errors_detected = self.detect_error_messages(screenshot_after)

        return {
            'has_error_messages': len(errors_detected) > 0,
            'error_messages': errors_detected,
            'wcag_compliant': len(errors_detected) > 0
        }
```

#### Info Needed

- [ ] Does Career Explorer have forms/input fields?
- [ ] If so, where are they located (settings, dialogs)?
- [ ] Can you provide coordinates or UI paths for form elements?

---

## Implementation Roadmap

### Phase 1: High-Impact Quick Wins (Weeks 1-3)

**Priority:** QW6 (Color Contrast) + QW7 (Focus Indicators)
**Effort:** 2-3 weeks
**Manual Effort Reduction:** 23%

#### Week 1: QW6 - Color Contrast Analyzer
- [ ] Implement screenshot capture
- [ ] Add OCR text detection (pytesseract)
- [ ] Implement contrast ratio calculation
- [ ] Test on Career Explorer
- [ ] Generate initial report

#### Week 2: QW7 - Focus Indicator Detector
- [ ] Extend QW4 with screenshot comparison
- [ ] Implement image diff detection (OpenCV)
- [ ] Add contrast/thickness measurements
- [ ] Test on Career Explorer
- [ ] Generate initial report

#### Week 3: Integration & Testing
- [ ] Integrate QW6 + QW7 into run_quick_wins.py
- [ ] Add to audit.js integration
- [ ] Create documentation
- [ ] User acceptance testing

### Phase 2: Medium-Impact Quick Wins (Weeks 4-6)

**Priority:** QW9 (Screen Reader) + QW8 (Text Size)
**Effort:** 2-3 weeks
**Manual Effort Reduction:** 13%

#### Week 4: QW9 - Screen Reader Validator
- [ ] Implement UI Automation inspection
- [ ] OR: Implement Unity Accessibility Plugin integration
- [ ] Test accessible name/role/value extraction
- [ ] Generate initial report

#### Week 5: QW8 - Text Size Analyzer
- [ ] Enhance OCR extraction
- [ ] Implement font size estimation
- [ ] Add readability scoring
- [ ] Test on Career Explorer

#### Week 6: Integration & Testing
- [ ] Integrate into suite
- [ ] Documentation
- [ ] UAT

### Phase 3: Specialized Quick Wins (Weeks 7-8)

**Priority:** QW10 (Motion) + QW11 (Forms)
**Effort:** 1-2 weeks
**Manual Effort Reduction:** 9%

#### Week 7: QW10 + QW11
- [ ] Implement motion/flash detection
- [ ] Implement form validation
- [ ] Test and integrate

#### Week 8: Final Integration
- [ ] Complete documentation
- [ ] Performance optimization
- [ ] Release v2.0

---

## Expected Results

### Manual Effort Reduction

| Phase | Quick Wins | Manual Effort Reduction | Cumulative |
|-------|-----------|------------------------|------------|
| Current | QW1-4 | 40% | 40% |
| Phase 1 | QW6-7 | 23% | 63% |
| Phase 2 | QW8-9 | 13% | 76% |
| Phase 3 | QW10-11 | 9% | 85% |

**Target: 50% reduction → Achieved in Phase 1-2 (76% total automation)**

### Test Coverage Improvement

| WCAG Criterion | Current | After QW6-11 | Improvement |
|----------------|---------|--------------|-------------|
| 1.4.3 Contrast | 0% | 90% | +90% |
| 2.4.7 Focus Visible | 10% | 90% | +80% |
| 1.4.4 Resize Text | 0% | 85% | +85% |
| 4.1.2 Name/Role/Value | 0% | 70% | +70% |
| 2.3.1 Three Flashes | 0% | 90% | +90% |
| 3.3.1-2 Forms | 0% | 60% | +60% |

---

## Technical Requirements

### Additional Python Dependencies

```txt
# Add to requirements.txt

# QW6: Color Contrast
pytesseract>=0.3.10
opencv-python>=4.8.0
colorthief>=0.2.1
Pillow>=10.0.0

# QW7: Focus Detection
opencv-python>=4.8.0
scikit-image>=0.21.0

# QW8: Text Analysis
pytesseract>=0.3.10
textstat>=0.7.3

# QW9: Screen Reader (Windows)
comtypes>=1.2.0
pywinauto>=0.6.8

# QW10: Motion Detection
opencv-python>=4.8.0
numpy>=1.24.0

# QW11: Form Detection
opencv-python>=4.8.0
```

### System Requirements

**For QW6-8 (Computer Vision):**
- Tesseract OCR installed (https://github.com/tesseract-ocr/tesseract)
- 8GB+ RAM recommended
- GPU acceleration optional (faster processing)

**For QW9 (Screen Reader):**
- Windows OS (for UI Automation API)
- OR: Unity Accessibility Plugin integrated
- NVDA installed (optional, for actual screen reader testing)

**For QW10 (Video Analysis):**
- FFmpeg installed
- Screen recording capability
- Sufficient disk space (video files ~100MB/min)

---

## Cost Estimate

### Development Effort

| Phase | Developer Weeks | Cost @ $100/hr |
|-------|----------------|----------------|
| Phase 1 (QW6-7) | 3 weeks | $12,000 |
| Phase 2 (QW8-9) | 3 weeks | $12,000 |
| Phase 3 (QW10-11) | 2 weeks | $8,000 |
| Testing & Integration | 1 week | $4,000 |
| **Total** | **9 weeks** | **$36,000** |

### Tools & Licensing

| Tool | Cost | Notes |
|------|------|-------|
| Tesseract OCR | Free | Open source |
| OpenCV | Free | Open source |
| NVDA | Free | Open source |
| Unity Accessibility Plugin | Free | Open source |
| Video processing tools | Free | FFmpeg |
| **Total** | **$0** | All open source! |

### ROI Analysis

**Investment:** $36,000 (development)
**Manual Testing Time Saved:** 45% reduction
**Annual Manual Testing Cost:** ~$50,000 (estimated)
**Annual Savings:** $22,500/year
**ROI:** 62% first year, 100%+ ongoing

---

## Questions for You

To proceed with implementation, I need the following information:

### High Priority (for QW6-7)

1. **Screenshot Navigation**
   - [ ] Can I automate scene navigation, or should you provide scene coordinates?
   - [ ] How many unique screens should be tested? (5, 10, 20+?)
   - [ ] Are there menus/screens that require specific input to access?

2. **Unity Integration**
   - [ ] Do you have access to Unity source code for instrumentation?
   - [ ] Would you consider adding Unity Accessibility Plugin?
   - [ ] Can you export WebGL builds for web-based testing?

3. **Focus Indicators**
   - [ ] Does Career Explorer use Unity UI or custom UI system?
   - [ ] Are focus indicators implemented currently?
   - [ ] Can you provide example of expected focus indicator?

### Medium Priority (for QW8-9)

4. **Text Sizing**
   - [ ] Can text size be changed programmatically in Career Explorer?
   - [ ] Are there user-facing text size controls?
   - [ ] What's the minimum acceptable font size?

5. **Screen Reader**
   - [ ] Does Career Explorer expose UI Automation properties?
   - [ ] Is NVDA acceptable, or do you need JAWS support?
   - [ ] Can you install Unity Accessibility Plugin?

### Low Priority (for QW10-11)

6. **Motion & Forms**
   - [ ] Are there known animations/motion in Career Explorer?
   - [ ] Does Career Explorer have input forms?
   - [ ] If forms exist, where are they located?

7. **Performance**
   - [ ] How fast should automation run? (seconds vs minutes per test)
   - [ ] Can tests run overnight/in CI, or need real-time results?
   - [ ] Is GPU available for computer vision acceleration?

---

## Recommended Approach

### Option A: Maximum Impact (Recommended)

**Implement:** QW6 (Color Contrast) + QW7 (Focus Indicators)
**Timeline:** 3 weeks
**Cost:** $12,000
**Manual Reduction:** 23% → **Total 63% automated**
**ROI:** Highest - addresses most time-consuming manual tests

### Option B: Full Suite

**Implement:** All QW6-11
**Timeline:** 9 weeks
**Cost:** $36,000
**Manual Reduction:** 45% → **Total 85% automated**
**ROI:** Best long-term value

### Option C: Phased Rollout

**Phase 1:** QW6-7 (3 weeks, $12,000)
**Evaluate, then:**
**Phase 2:** QW8-9 (3 weeks, $12,000)
**Evaluate, then:**
**Phase 3:** QW10-11 (2 weeks, $8,000)

**Total:** 8-12 weeks depending on evaluation periods

---

## Next Steps

1. **Review this proposal** and determine which Quick Wins are highest priority
2. **Answer the questions** in the "Questions for You" section
3. **Choose approach** (Option A, B, or C)
4. **Provide test environment** access/info
5. **Start Phase 1** implementation (QW6-7)

---

## Conclusion

By implementing Quick Wins 6-11, we can reduce manual testing effort from **60% to 15%**, achieving your goal of **50% reduction** (and exceeding it by 45%).

**Key Benefits:**
- ✓ 85% total automation coverage
- ✓ Faster testing cycles
- ✓ More consistent results
- ✓ Lower long-term testing costs
- ✓ Better WCAG compliance tracking
- ✓ All open-source tools (no licensing costs)

**Recommended Start:** Phase 1 (QW6-7) for maximum immediate impact.

---

**Document Version:** 1.0
**Date:** October 22, 2025
**Contact:** For questions or to proceed with implementation
