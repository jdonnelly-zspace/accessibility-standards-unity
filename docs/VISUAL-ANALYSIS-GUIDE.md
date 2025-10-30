# Visual Accessibility Analysis Guide

## Overview

The accessibility-standards-unity framework now includes comprehensive visual analysis capabilities to automatically test WCAG color contrast requirements and simulate color vision deficiencies.

## Features

### 1. **Color Contrast Analysis** (WCAG 1.4.3, 1.4.11)
- Automated contrast ratio calculation for text and UI components
- WCAG 2.2 Level AA compliance testing
  - Normal text: ≥4.5:1 contrast ratio
  - Large text (18pt+ or 14pt+ bold): ≥3.0:1 contrast ratio
  - UI components: ≥3.0:1 contrast ratio
- OCR-based text detection (using Tesseract)
- JSON report generation with detailed findings

### 2. **Color Blindness Simulation** (WCAG 1.4.1)
- Simulates 8 types of color vision deficiency (CVD):
  - **Protanopia** (Red-blind) - 1% of males
  - **Deuteranopia** (Green-blind) - 1% of males
  - **Tritanopia** (Blue-blind) - 0.001% of population
  - **Protanomaly** (Red-weak) - 1% of males
  - **Deuteranomaly** (Green-weak) - 5% of males (most common)
  - **Tritanomaly** (Blue-weak) - 0.01% of population
  - **Achromatopsia** (Total color blindness) - 0.003%
  - **Achromatomaly** (Blue cone monochromacy) - 0.001%
- Generates simulated images for each CVD type
- Similarity analysis to detect color-dependent information
- Automated accessibility report

## Installation

### Prerequisites

The visual analysis feature requires Python and additional dependencies:

```bash
# Install Python dependencies
pip install Pillow numpy opencv-python pytesseract pyautogui
```

**Note:** For OCR functionality, you also need to install Tesseract OCR:
- **Windows:** Download from https://github.com/UB-Mannheim/tesseract/wiki
- **macOS:** `brew install tesseract`
- **Linux:** `sudo apt-get install tesseract-ocr`

## Usage

### Method 1: Automatic Analysis (Recommended)

Run the audit with the `--capture-screenshots` flag:

```bash
node bin/audit.js /path/to/unity-project --capture-screenshots
```

This will:
1. Look for screenshots in `AccessibilityAudit/screenshots/`
2. If found, run contrast analysis and color-blind simulation
3. Generate visual analysis reports
4. Integrate results into the VPAT report

### Method 2: Manual Screenshot Capture

If screenshots don't exist, you'll need to capture them manually:

1. **Capture screenshots** of your Unity application
   - Capture key UI states, menus, and interactive elements
   - Include examples of text, buttons, and UI components
   - Save as PNG, JPG, or BMP files

2. **Place screenshots** in the output directory:
   ```
   /path/to/unity-project/AccessibilityAudit/screenshots/
   ```

3. **Run the audit** with visual analysis:
   ```bash
   node bin/audit.js /path/to/unity-project --capture-screenshots
   ```

### Method 3: Standalone Python Scripts

You can also run the Python scripts independently:

#### Color Contrast Analyzer

```bash
# Analyze a directory of screenshots
python automation/quick_wins/color_contrast_analyzer.py /path/to/screenshots

# Analyze a single screenshot
python automation/quick_wins/color_contrast_analyzer.py --screenshot /path/to/image.png

# Capture and analyze current screen
python automation/quick_wins/color_contrast_analyzer.py --capture
```

#### Color Blindness Simulator

```bash
# Simulate CVD for a directory of screenshots
python automation/quick_wins/colorblind_simulator.py /path/to/screenshots

# Simulate CVD for a single screenshot
python automation/quick_wins/colorblind_simulator.py --screenshot /path/to/image.png

# Custom output directory
python automation/quick_wins/colorblind_simulator.py /path/to/screenshots /custom/output/dir
```

## Output

### Directory Structure

After running visual analysis, your output directory will contain:

```
AccessibilityAudit/
├── screenshots/                          # Original screenshots
│   ├── menu_main.png
│   ├── gameplay_01.png
│   └── settings_screen.png
├── colorblind_simulations/               # CVD simulated images
│   ├── menu_main_protanopia.png
│   ├── menu_main_deuteranopia.png
│   ├── menu_main_tritanopia.png
│   ├── gameplay_01_protanopia.png
│   └── ...
├── contrast_analysis_results.json        # Contrast test results
├── visual_analysis_results.json          # Combined visual analysis
├── VPAT-<appname>.md                     # Updated VPAT report
└── README.md                              # Audit overview
```

### Contrast Analysis Report

The `contrast_analysis_results.json` contains:

```json
{
  "timestamp": "2025-10-29T...",
  "wcag_criteria": ["1.4.3 Contrast (Minimum)", "1.4.11 Non-text Contrast"],
  "summary": {
    "screenshots_analyzed": 3,
    "total_checks": 45,
    "total_passed": 38,
    "total_failed": 7,
    "overall_pass_rate": 84.4,
    "wcag_compliant": false
  },
  "results": [
    {
      "screenshot": "menu_main.png",
      "issues": [
        {
          "type": "text",
          "text": "Start Game",
          "fg_color": "#808080",
          "bg_color": "#ffffff",
          "ratio": 3.95,
          "required": 4.5,
          "passes": false,
          "wcag_criterion": "1.4.3",
          "severity": "HIGH"
        }
      ]
    }
  ]
}
```

### Color-Blind Simulation Report

The color-blind simulation report includes:

```json
{
  "timestamp": "2025-10-29T...",
  "wcag_criterion": "1.4.1 Use of Color (Level A)",
  "summary": {
    "screenshots_processed": 3,
    "total_simulations": 24,
    "cvd_types_tested": ["protanopia", "deuteranopia", ...],
    "output_directory": "/path/to/colorblind_simulations"
  },
  "analysis": [
    {
      "original_image": "menu_main.png",
      "cvd_comparisons": [
        {
          "cvd_type": "protanopia",
          "cvd_name": "Protanopia (Red-blind)",
          "similarity_score": 0.72,
          "information_preserved": false,
          "potential_issues": true
        }
      ]
    }
  ]
}
```

## VPAT Integration

The VPAT report will be automatically updated with visual analysis results:

### Evaluation Methods Section
```markdown
### Visual Accessibility Analysis

- ✅ Visual analysis performed
- ✅ WCAG contrast ratio testing (3 screenshots)
- ✅ Color-blind simulation (8 CVD types)
- ✅ Automated visual accessibility report generated
```

### Visual Accessibility Results Section
```markdown
### Visual Accessibility Results

**Visual Analysis Status:** ✅ Performed

**Screenshots Analyzed:** 3

**Contrast Analysis:**
- Total checks: 45
- Passed: 38 (84.4%)
- Failed: 7
- WCAG Compliant: No ❌

**Color-Blind Simulations:**
- Simulations generated: 24
- CVD types tested: Protanopia, Deuteranopia, Tritanopia, ...
- Output directory: `colorblind_simulations/`

**Recommendations:**
- ⚠️ 7 contrast issues found - review `contrast_analysis_results.json`
- Review color-blind simulations to ensure information is not color-only
- View simulated images in `AccessibilityAudit/colorblind_simulations/`
```

## Interpreting Results

### Contrast Issues

When contrast issues are found:

1. **Review the JSON report** to identify specific UI elements with low contrast
2. **Check the screenshot** at the reported coordinates
3. **Increase contrast** by:
   - Darkening text or brightening background (or vice versa)
   - Using WCAG-compliant color combinations
   - Adding borders or shadows for additional visual separation

### Color-Blind Simulations

To review color-blind simulations:

1. **Open the simulated images** in `colorblind_simulations/`
2. **Compare with originals** - look for:
   - Loss of critical information
   - Indistinguishable UI elements
   - Color-coded states that become ambiguous
3. **Add redundant cues** if needed:
   - Shapes (✓ ✗ ⚠)
   - Icons
   - Text labels
   - Patterns or textures
   - Position/size differences

### WCAG Success Criteria

| Criterion | Requirement | Visual Analysis Tests |
|-----------|-------------|----------------------|
| **1.4.1 Use of Color (A)** | Color not sole means of conveying info | Color-blind simulation |
| **1.4.3 Contrast Minimum (AA)** | Text ≥4.5:1, Large text ≥3:1 | Contrast analyzer |
| **1.4.11 Non-text Contrast (AA)** | UI components ≥3:1 | Contrast analyzer |

## Troubleshooting

### "No screenshots found"

**Solution:** Manually capture screenshots and place them in `AccessibilityAudit/screenshots/` directory, then re-run with `--capture-screenshots`.

### "Visual analysis scripts not found"

**Solution:** Ensure you have the complete accessibility-standards-unity package installed. The scripts should be in `automation/quick_wins/`.

### "Python not found" or "Module not found"

**Solution:**
1. Install Python 3.7+ from https://www.python.org/
2. Install required packages: `pip install Pillow numpy opencv-python pytesseract pyautogui`
3. For OCR, install Tesseract OCR

### "Tesseract not available" warning

**Solution:** This is optional. The contrast analyzer will still work using color sampling method. To enable OCR-based text detection:
- Install Tesseract OCR (see Installation section)
- Ensure tesseract is in your system PATH

### Low similarity scores in color-blind analysis

This is expected! A low similarity score (< 0.7) indicates that the image looks significantly different under that type of color blindness. Review those simulations to ensure critical information isn't lost.

## Best Practices

### Screenshot Capture

1. **Capture key states:**
   - Main menu
   - Gameplay/interaction screens
   - Settings and configuration panels
   - Error messages and dialogs
   - All UI element states (hover, active, disabled)

2. **High quality:**
   - Use PNG format for best quality
   - Capture at native resolution
   - Avoid compression artifacts

3. **Representative samples:**
   - Include examples of all text sizes
   - Show all color-coded UI elements
   - Capture both light and dark UI themes (if applicable)

### Addressing Issues

1. **Prioritize high-severity issues** (contrast ratio < 3:1)
2. **Test fixes** by capturing new screenshots and re-running analysis
3. **Document decisions** if certain elements cannot meet requirements
4. **Consider user preferences** for high contrast modes

## Advanced Usage

### Integration with CI/CD

You can automate visual analysis in your build pipeline:

```bash
# In your CI/CD script
npm install -g accessibility-standards-unity
pip install Pillow numpy opencv-python

# Run audit with visual analysis
a11y-audit-zspace /path/to/project --capture-screenshots --output-dir ./audit-results
```

### Custom Python Integration

You can import and use the Python modules in your own scripts:

```python
from color_contrast_analyzer import ColorContrastAnalyzer
from colorblind_simulator import ColorBlindSimulator

# Contrast analysis
analyzer = ColorContrastAnalyzer('./screenshots')
analyzer.analyze_all_screenshots()
analyzer.save_report('./results/contrast.json')

# Color-blind simulation
simulator = ColorBlindSimulator('./screenshots', './simulations')
simulator.process_all_screenshots()
simulator.save_report('./results/colorblind.json')
```

## Related Documentation

- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [Understanding Color Contrast](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [Understanding Use of Color](https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html)
- [Color Blind Accessibility](https://www.w3.org/WAI/perspective-videos/colors/)

## Support

For issues or questions:
- GitHub Issues: https://github.com/jdonnelly-zspace/accessibility-standards-unity/issues
- Framework Documentation: https://github.com/jdonnelly-zspace/accessibility-standards-unity

---

**Last Updated:** 2025-10-29
**Framework Version:** 3.3.0+
