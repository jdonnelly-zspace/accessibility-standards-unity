# Unity Accessibility Testing Automation

**Human-like automated testing for Unity zSpace applications**

This directory contains the Quick Wins automation framework - a collection of Python scripts that perform automated accessibility testing on Unity applications, including executable testing, log analysis, and keyboard navigation validation.

## Table of Contents

- [Quick Start](#quick-start)
- [Installation](#installation)
- [Quick Wins Overview](#quick-wins-overview)
- [Usage](#usage)
- [Practical Examples](#practical-examples)
- [Integration with Audit](#integration-with-audit)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

### Install Dependencies

```bash
# Navigate to automation directory
cd accessibility-standards-unity/automation

# Install Python dependencies
pip install -r requirements.txt
```

### Run Log Analysis (Non-Interactive)

```bash
# Analyze Unity Player.log
python quick_wins/log_analyzer.py "C:\Users\YourName\AppData\LocalLow\Company\AppName\Player.log"

# Or auto-detect log file
python quick_wins/log_analyzer.py --find "App Name"
```

### Run Full Automation Suite

```bash
# Create config file first
python run_quick_wins.py --create-sample ./config/my_app_config.json

# Edit the config file with your app details, then:
python run_quick_wins.py ./config/my_app_config.json
```

### Run with Audit (Integrated)

```bash
# Run audit with automation (log analysis only)
node ../bin/audit.js /path/to/unity-project --run-automation

# Full automation with executable testing
node ../bin/audit.js /path/to/unity-project --run-automation \
  --exe-path "C:/Program Files/MyApp/app.exe" \
  --interactive
```

---

## Installation

### Prerequisites

- **Python 3.8+** - [Download](https://www.python.org/downloads/)
- **Node.js 14+** - [Download](https://nodejs.org/) (for audit integration)
- **Unity application** - Either executable or project source

### Install Python Dependencies

```bash
cd accessibility-standards-unity/automation
pip install -r requirements.txt
```

### Verify Installation

```bash
# Check Python version
python --version

# Check dependencies
python -c "import pyautogui, psutil, PIL; print('All dependencies installed!')"
```

---

## Quick Wins Overview

### Quick Win 1: Application Launch & Monitoring

**Purpose:** Launch Unity executable, monitor process health, capture diagnostics

**What it does:**
- Launches the Unity application
- Monitors CPU and memory usage
- Detects crashes
- Generates performance report

**Standalone usage:**
```bash
python quick_wins/app_launcher.py "C:/Program Files/MyApp/app.exe" 30
# Launches app and monitors for 30 seconds
```

**Requirements:** Executable path

**Output:** `reports/output/qw1_app_launch.json`

---

### Quick Win 2: Log File Scene Analyzer

**Purpose:** Parse Unity Player.log to extract scene transitions, errors, performance

**What it does:**
- Extracts all scene loading events
- Maps scene transitions (level0 → level1 → level2)
- Identifies errors, warnings, exceptions
- Analyzes scene flow patterns

**Standalone usage:**
```bash
# With specific log path
python quick_wins/log_analyzer.py "C:/Users/Jill/AppData/LocalLow/Company/App/Player.log"

# Auto-detect log
python quick_wins/log_analyzer.py --find "Career Explorer"
```

**Requirements:** Player.log file (auto-detected if possible)

**Output:** `reports/output/qw2_log_analysis.json`

**Example Output:**
```
Scene Transition Map:
  level0 (Main Menu) → level1 (Career 1) [2.3s]
  level1 (Career 1) → level2 (Career 2) [1.8s]
  ...

Errors Found: 3
  - NullReferenceException at level5
  - Missing texture warning at level8
```

---

### Quick Win 3: Basic Input Automation

**Purpose:** Automate mouse clicks and keyboard inputs using configuration files

**What it does:**
- Simulates human-like mouse movements and clicks
- Types text and presses keys
- Takes screenshots at each step
- Executes pre-defined test scenarios

**Standalone usage:**
```bash
# Create sample config
python quick_wins/input_automation.py --create-sample automation_config.json

# Edit config, then run
python quick_wins/input_automation.py automation_config.json ./screenshots
```

**Requirements:**
- Executable (must be launched separately or by Quick Win 1)
- pyautogui library
- Configuration file with click coordinates

**Output:** `reports/output/qw3_input_automation.json` + screenshots

**Safety:** Move mouse to top-left corner to abort!

---

### Quick Win 4: Keyboard Navigation Test

**Purpose:** Test keyboard-only navigation for WCAG 2.1.1 compliance

**What it does:**
- Tests Tab key navigation
- Tests Enter/Space key activation
- Tests Arrow key navigation
- Tests Shift+Tab reverse navigation
- Tests Escape key
- Generates accessibility compliance report

**Standalone usage:**
```bash
python quick_wins/keyboard_navigation_test.py ./screenshots/keyboard_nav
```

**Requirements:**
- Executable must be running and in focus
- pyautogui library

**Output:** `reports/output/qw4_keyboard_navigation.json`

**WCAG Criteria Tested:**
- 2.1.1 Keyboard (Level A)
- 2.4.7 Focus Visible (Level AA)

**Safety:** Move mouse to top-left corner to abort!

---

### Quick Win 5: Accessibility Audit Integration

**Purpose:** Integrated with main audit workflow (bin/audit.js)

**What it does:**
- Runs Quick Wins 1-4 as part of main audit
- Combines all results into comprehensive report
- Generates VPAT and recommendations

**Usage:** See [Integration with Audit](#integration-with-audit)

---

## Usage

### Option 1: Run Individual Quick Wins

Each Quick Win can be run standalone for testing specific aspects:

```bash
# Quick Win 1: Launch and monitor
python quick_wins/app_launcher.py "C:/Program Files/MyApp/app.exe" 30

# Quick Win 2: Analyze logs
python quick_wins/log_analyzer.py --find "MyApp"

# Quick Win 3: Input automation
python quick_wins/input_automation.py automation_config.json

# Quick Win 4: Keyboard navigation
python quick_wins/keyboard_navigation_test.py
```

### Option 2: Run All Quick Wins Together

Use the coordinator script to run multiple Quick Wins in sequence:

```bash
# Create configuration file
python run_quick_wins.py --create-sample config/career_explorer.json

# Edit config with your app details:
# - exe_path
# - log_path
# - automation_config (optional)
# - quick_wins_to_run

# Run all configured Quick Wins
python run_quick_wins.py config/career_explorer.json

# Run specific Quick Wins only
python run_quick_wins.py config/career_explorer.json --quick-wins "1,2"

# Pass exe/log paths via command line
python run_quick_wins.py config/career_explorer.json --exe "C:/Program Files/MyApp/app.exe"
```

### Option 3: Integrated with Audit (Recommended)

The Quick Wins are integrated into the main accessibility audit:

```bash
# Basic audit (static analysis only, no automation)
node ../bin/audit.js /path/to/unity-project

# Audit with automation (non-interactive tests only)
node ../bin/audit.js /path/to/unity-project --run-automation

# Full audit with executable testing
node ../bin/audit.js /path/to/unity-project --run-automation \
  --exe-path "C:/Program Files/MyApp/app.exe" \
  --log-path "C:/Users/Name/AppData/LocalLow/Company/App/Player.log"

# With interactive tests (keyboard navigation, input automation)
node ../bin/audit.js /path/to/unity-project --run-automation \
  --exe-path "C:/Program Files/MyApp/app.exe" \
  --interactive

# Select specific Quick Wins
node ../bin/audit.js /path/to/unity-project --run-automation \
  --quick-wins "1,2,4"
```

---

## Practical Examples

### Example 1: Daily Health Check (Quick Win 2)

```bash
# Check Career Explorer logs for issues
python quick_wins/log_analyzer.py --find "Career Explorer"
```

**Use Case:** Quick morning check before development

### Example 2: Weekly Regression Test

```bash
# Run log analysis + app monitoring
python run_quick_wins.py config/career_explorer.json --quick-wins "1,2"
```

**Use Case:** Automated weekly testing

### Example 3: Accessibility Compliance Check

```bash
# Test keyboard navigation (WCAG 2.1.1)
# Note: App must be running and in focus
python quick_wins/keyboard_navigation_test.py ./screenshots/career_explorer
```

**Use Case:** Pre-release accessibility validation

### Example 4: Custom Automation Scenario

```bash
# Create custom input automation config
python quick_wins/input_automation.py --create-sample my_scenario.json

# Edit my_scenario.json with your test steps

# Run automation
python quick_wins/input_automation.py my_scenario.json ./screenshots
```

**Use Case:** Automated UI testing for specific workflows

### Example 5: Multi-App Testing

```bash
# Test multiple apps in sequence
for app in career_explorer math_adventure science_lab; do
    echo "Testing $app..."
    python run_quick_wins.py "config/${app}.json" --quick-wins "2"
done
```

**Use Case:** Testing entire app portfolio

### Example 6: CI/CD Integration

```bash
# In your build pipeline
python run_quick_wins.py config/myapp.json --quick-wins "1,2"

# Check exit code
if [ $? -ne 0 ]; then
    echo "Tests failed!"
    exit 1
fi
```

**Use Case:** Automated testing in CI/CD

**For more examples, see [EXAMPLES.md](EXAMPLES.md)**

---

## Integration with Audit

Quick Wins are automatically executed when running the accessibility audit with `--run-automation` flag.

### Default Behavior (Non-Interactive)

By default, only non-interactive Quick Wins run:
- **Quick Win 1:** Application Launch & Monitoring (if `--exe-path` provided)
- **Quick Win 2:** Log File Scene Analyzer (auto-detected or `--log-path`)

```bash
node ../bin/audit.js /path/to/unity-project --run-automation
```

### Interactive Mode

Enable interactive tests with `--interactive` flag:
- **Quick Win 3:** Basic Input Automation (requires config)
- **Quick Win 4:** Keyboard Navigation Test

```bash
node ../bin/audit.js /path/to/unity-project --run-automation \
  --exe-path "C:/Program Files/MyApp/app.exe" \
  --interactive
```

### Results Integration

Automation results are automatically integrated into audit reports:
- Combined report: `AccessibilityAudit/quick_wins_combined_report.json`
- Individual reports: `AccessibilityAudit/qw1_*.json`, `qw2_*.json`, etc.
- Screenshots: `AccessibilityAudit/screenshots/`

---

## Configuration

### Application Configuration (JSON)

Example configuration file for `run_quick_wins.py`:

```json
{
  "app_name": "Career Explorer",
  "exe_path": "C:/Program Files/zSpace/Career Explorer/zSpaceCareerExplorer.exe",
  "log_path": "C:/Users/Jill/AppData/LocalLow/zSpace/Career Explorer/Player.log",
  "project_path": "C:/UnityProjects/CareerExplorer",
  "output_dir": "./automation/reports/output",
  "monitor_duration": 30,
  "automation_config": null,
  "skip_interactive": false,
  "quick_wins_to_run": [1, 2, 3, 4, 5]
}
```

**Fields:**
- `app_name` - Application name (for reporting)
- `exe_path` - Path to Unity executable (for Quick Wins 1, 3, 4)
- `log_path` - Path to Player.log (for Quick Win 2, optional - auto-detected)
- `project_path` - Unity project path (for audit integration)
- `output_dir` - Where to save reports
- `monitor_duration` - How long to monitor app in Quick Win 1 (seconds)
- `automation_config` - Path to input automation config (for Quick Win 3)
- `skip_interactive` - Skip interactive tests (Quick Wins 3 & 4)
- `quick_wins_to_run` - Which Quick Wins to execute (1-5)

### Input Automation Configuration

For Quick Win 3, create an automation scenario config:

```json
{
  "app": {
    "name": "Career Explorer",
    "description": "Basic navigation automation"
  },
  "scenarios": [
    {
      "name": "Basic Navigation Test",
      "steps": [
        { "action": "wait", "seconds": 5 },
        { "action": "screenshot", "name": "initial_screen" },
        { "action": "click", "x": 960, "y": 540 },
        { "action": "press", "key": "tab", "presses": 3 },
        { "action": "press", "key": "enter" }
      ]
    }
  ]
}
```

Generate sample:
```bash
python quick_wins/input_automation.py --create-sample automation_config.json
```

---

## Troubleshooting

### Python Not Found

```
Error: Python not found
```

**Solution:** Install Python 3.8+ and add to PATH
- Download: https://www.python.org/downloads/
- During installation, check "Add Python to PATH"

### Dependencies Missing

```
ModuleNotFoundError: No module named 'pyautogui'
```

**Solution:** Install dependencies
```bash
pip install -r automation/requirements.txt
```

### Executable Not Found

```
ERROR: Executable not found: C:/Program Files/...
```

**Solution:** Verify executable path is correct
- Check path has no typos
- Use forward slashes (/) or escaped backslashes (\\)
- Enclose in quotes if path has spaces

### PyAutoGUI Safety Abort

```
pyautogui.FailSafeException: PyAutoGUI fail-safe triggered
```

**Solution:** This is intentional!
- Moving mouse to top-left corner aborts automation
- This prevents runaway automation
- To disable: NOT RECOMMENDED (for safety)

### Log File Not Found

```
ERROR: Log file not found
```

**Solution:**
- Use `--find "App Name"` to auto-detect
- Check AppData/LocalLow folder: `C:/Users/YourName/AppData/LocalLow/CompanyName/AppName/Player.log`
- Run the Unity app first to generate log

### Interactive Tests Not Running

If Quick Wins 3 & 4 are skipped:

**Solution:**
- Add `--interactive` flag to audit command
- Or set `"skip_interactive": false` in config
- Ensure `--exe-path` is provided

### Python Script Exits with Code 1

```
ERROR: Python script exited with code 1
```

**Solution:**
- Run with `--verbose` to see Python output
- Check Python script logs for specific error
- Verify all dependencies installed

### Permissions Error

```
PermissionError: [Errno 13] Permission denied
```

**Solution:**
- Run command prompt as Administrator
- Check executable is not already running
- Verify write permissions to output directory

---

## Output Files

All automation results are saved to the output directory:

```
automation/reports/output/
├── qw1_app_launch.json              # App launch & monitoring results
├── qw2_log_analysis.json            # Log file analysis
├── qw3_input_automation.json        # Input automation results
├── qw4_keyboard_navigation.json     # Keyboard navigation test
├── quick_wins_combined_report.json  # Combined report from all Quick Wins
├── quick_wins_config.json           # Generated config (when run from audit)
└── screenshots/                     # Screenshots from automation
    ├── automation/                  # Quick Win 3 screenshots
    └── keyboard_nav/                # Quick Win 4 screenshots
```

When integrated with audit, files are saved to:
```
<unity-project>/AccessibilityAudit/
├── README.md
├── AUDIT-SUMMARY.md
├── VPAT-<name>.md
├── ACCESSIBILITY-RECOMMENDATIONS.md
├── accessibility-analysis.json      # Static analysis results
├── quick_wins_combined_report.json  # Automation results
└── qw*.json                         # Individual Quick Win reports
```

---

## Next Steps

1. **Install dependencies:** `pip install -r requirements.txt`
2. **Test log analysis:** `python quick_wins/log_analyzer.py --find "YourApp"`
3. **Create config:** `python run_quick_wins.py --create-sample config/my_app.json`
4. **Edit config** with your app details
5. **Run automation:** `python run_quick_wins.py config/my_app.json`
6. **Integrate with audit:** `node ../bin/audit.js /path/to/project --run-automation`

## See Also

### Documentation
- **[EXAMPLES.md](EXAMPLES.md)** - 15+ practical examples including CI/CD integration
- **[Phase 2 Strategy](../phase2_unity.txt)** - Complete automation strategy (3 options)
- **[Implementation Summary](../QUICK_WINS_IMPLEMENTATION.md)** - What was built & how to use
- **[Session Report](../SESSION_REPORT.md)** - Comprehensive implementation report
- **[Main Framework README](../README.md)** - Accessibility standards framework overview

### Quick Start Guides
- **Daily Testing:** [Example 1](#example-1-daily-health-check-quick-win-2) in Practical Examples
- **Weekly Testing:** [Example 2](#example-2-weekly-regression-test) in Practical Examples
- **Accessibility Testing:** [Example 3](#example-3-accessibility-compliance-check) in Practical Examples
- **CI/CD Integration:** See [EXAMPLES.md](EXAMPLES.md#cicd-integration-examples)

### Advanced Topics
- **Multi-App Testing:** [EXAMPLES.md#example-9](EXAMPLES.md#example-9-multi-app-testing)
- **Baseline Testing:** [EXAMPLES.md#example-11](EXAMPLES.md#example-11-regression-testing-with-baselines)
- **Remote Testing:** [EXAMPLES.md#example-14](EXAMPLES.md#example-14-testing-on-remote-machine)
- **Custom Scenarios:** [EXAMPLES.md#example-5](EXAMPLES.md#example-5-educational-unity-app-testing)

### Reference
- [Accessibility Standards](../standards/)
- [Unity Implementation](../implementation/)
- [Workflow Guides](../workflows/)
- [Tools Catalog](../resources/TOOLS-CATALOG.md)

---

**Built for accessible Unity applications** | [Report Issues](https://github.com/jdonnelly-zspace/accessibility-standards-unity/issues)
