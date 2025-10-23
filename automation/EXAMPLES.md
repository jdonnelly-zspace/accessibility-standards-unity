# Quick Wins Automation - Practical Examples

This document provides real-world examples for using the Quick Wins automation framework with various Unity applications.

## Table of Contents

- [Career Explorer Examples](#career-explorer-examples)
- [Generic Unity App Examples](#generic-unity-app-examples)
- [CI/CD Integration Examples](#cicd-integration-examples)
- [Advanced Scenarios](#advanced-scenarios)
- [Troubleshooting Examples](#troubleshooting-examples)

---

## Career Explorer Examples

### Example 1: Basic Log Analysis

**Scenario:** Quick check of Career Explorer's current state

```bash
cd C:\Users\Jill\accessibility-standards-unity\automation

# Auto-detect and analyze log
python quick_wins/log_analyzer.py --find "Career Explorer"
```

**Output:**
```
Found log: C:\Users\Jill\AppData\LocalLow\zSpace\Career Explorer\Player.log
Parsing log file...

[OK] Log Analysis Complete:
  Unity Version: 2022.3.59f1
  Scenes Found: 0
  Errors: 1
  Warnings: 0
  Exceptions: 30

Critical Issues (6):
  1. [High] Sentry Error
  2. [Critical] NullReferenceException
  ...

[OK] Log analysis report saved: ./reports/output/log_analysis_report.json
```

**Use Case:** Daily health check before starting work

---

### Example 2: Complete Career Explorer Test Suite

**Scenario:** Run all non-interactive tests on Career Explorer

**Step 1: Create configuration**

```bash
cd C:\Users\Jill\accessibility-standards-unity\automation

# Create config if not exists
python run_quick_wins.py --create-sample config/career_explorer.json
```

**Step 2: Edit configuration**

Edit `config/career_explorer.json`:
```json
{
  "app_name": "Career Explorer",
  "exe_path": "C:/Program Files/zSpace/Career Explorer/zSpaceCareerExplorer.exe",
  "log_path": "C:/Users/Jill/AppData/LocalLow/zSpace/Career Explorer/Player.log",
  "output_dir": "./reports/output",
  "monitor_duration": 30,
  "skip_interactive": true,
  "quick_wins_to_run": [1, 2]
}
```

**Step 3: Run tests**

```bash
python run_quick_wins.py config/career_explorer.json
```

**Output:**
```
======================================================================
RUNNING QUICK WINS AUTOMATION SUITE
======================================================================
Quick Wins to run: [1, 2]

======================================================================
QUICK WIN 1: Application Launch & Monitoring
======================================================================
Launching: C:/Program Files/zSpace/Career Explorer/zSpaceCareerExplorer.exe
[OK] Application launched (PID: 12345)
Monitoring for 30 seconds...
  [10s] CPU: 15.2% | Memory: 512.3 MB
  [20s] CPU: 12.8% | Memory: 524.1 MB
  [30s] CPU: 10.5% | Memory: 518.7 MB

Peak Memory: 524.1 MB
Avg CPU: 12.8%

======================================================================
QUICK WIN 2: Log File Scene Analyzer
======================================================================
[OK] Auto-detected log: C:/Users/Jill/AppData/LocalLow/zSpace/Career Explorer/Player.log
Unity Version: 2022.3.59f1
Critical Issues: 6

[OK] Combined report saved: ./reports/output/quick_wins_combined_report.json
```

**Use Case:** Weekly regression testing

---

### Example 3: Career Explorer Keyboard Accessibility Test

**Scenario:** Test if Career Explorer is keyboard accessible (WCAG 2.1.1)

**Prerequisites:**
- Career Explorer must be running and in focus
- Close other applications to avoid interference

```bash
cd C:\Users\Jill\accessibility-standards-unity\automation

# Run keyboard navigation tests
python quick_wins/keyboard_navigation_test.py ./screenshots/career_explorer_kb
```

**Interactive Steps:**
1. Launch Career Explorer manually
2. Wait until fully loaded
3. Run the command above
4. Keep Career Explorer in focus
5. Do NOT touch mouse or keyboard during test

**Output:**
```
======================================================================
KEYBOARD NAVIGATION ACCESSIBILITY TEST
WCAG 2.1.1 Keyboard (Level A) Compliance
======================================================================

[WARNING] Ensure application is in focus and ready
[WARNING] Move mouse to top-left corner to abort

Starting in 3 seconds...

Test: Tab Navigation
  [OK] PASSED

Test: Enter Key Activation
  [OK] PASSED

Test: Space Key Activation
  [OK] PASSED

Test: Arrow Key Navigation
  [OK] PASSED

Test: Shift+Tab Navigation
  [OK] PASSED

Test: Escape Key
  [OK] PASSED

======================================================================
TEST SUMMARY
======================================================================
Total Tests: 6
Passed: 6 (100%)
Failed: 0 (0%)

WCAG 2.1.1 Compliance: [OK] PASS

[OK] Accessibility report saved: ./reports/output/qw4_keyboard_navigation.json
```

**Use Case:** Accessibility compliance validation

---

## Generic Unity App Examples

### Example 4: Testing a New Unity Game

**Scenario:** You have a Unity game "MyGame.exe" and want to test it

**Step 1: Create configuration**

```bash
cd C:\Users\Jill\accessibility-standards-unity\automation

python run_quick_wins.py --create-sample config/mygame.json
```

**Step 2: Edit for your game**

Edit `config/mygame.json`:
```json
{
  "app_name": "MyGame",
  "exe_path": "C:/Games/MyGame/MyGame.exe",
  "log_path": null,
  "output_dir": "./reports/mygame",
  "monitor_duration": 60,
  "skip_interactive": false,
  "quick_wins_to_run": [1, 2, 4]
}
```

**Step 3: Run tests**

```bash
python run_quick_wins.py config/mygame.json
```

**What happens:**
1. Quick Win 1 launches MyGame.exe and monitors for 60 seconds
2. Quick Win 2 auto-detects and analyzes MyGame's log file
3. Quick Win 4 tests keyboard navigation (requires game to be open)

---

### Example 5: Educational Unity App Testing

**Scenario:** Testing "Math Adventure" educational app

**Configuration:** `config/math_adventure.json`
```json
{
  "app_name": "Math Adventure",
  "exe_path": "C:/Program Files/Educational/MathAdventure/MathAdventure.exe",
  "log_path": "C:/Users/Jill/AppData/LocalLow/EduSoft/MathAdventure/Player.log",
  "output_dir": "./reports/math_adventure",
  "monitor_duration": 45,
  "automation_config": "./config/math_adventure_scenarios.json",
  "skip_interactive": false,
  "quick_wins_to_run": [1, 2, 3, 4]
}
```

**Input Automation Config:** `config/math_adventure_scenarios.json`
```json
{
  "app": {
    "name": "Math Adventure",
    "description": "Test main menu and first lesson"
  },
  "scenarios": [
    {
      "name": "Navigate to First Lesson",
      "steps": [
        {
          "action": "wait",
          "seconds": 5,
          "description": "Wait for app to load"
        },
        {
          "action": "screenshot",
          "name": "main_menu"
        },
        {
          "action": "click",
          "x": 960,
          "y": 540,
          "description": "Click Start button (center screen)"
        },
        {
          "action": "wait",
          "seconds": 2
        },
        {
          "action": "screenshot",
          "name": "level_select"
        },
        {
          "action": "click",
          "x": 640,
          "y": 400,
          "description": "Click first lesson"
        },
        {
          "action": "wait",
          "seconds": 3
        },
        {
          "action": "screenshot",
          "name": "lesson_loaded"
        },
        {
          "action": "press",
          "key": "escape",
          "description": "Return to menu"
        }
      ]
    }
  ]
}
```

**Run:**
```bash
python run_quick_wins.py config/math_adventure.json
```

**Use Case:** Automated functional testing + accessibility compliance

---

## CI/CD Integration Examples

### Example 6: GitHub Actions Workflow

**Scenario:** Run Quick Wins on every commit

**File:** `.github/workflows/unity-tests.yml`
```yaml
name: Unity Accessibility Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  accessibility-tests:
    runs-on: windows-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: |
          cd automation
          pip install -r requirements.txt

      - name: Run Log Analysis
        run: |
          cd automation
          python quick_wins/log_analyzer.py --find "MyApp"

      - name: Check for critical issues
        run: |
          cd automation
          python -c "
          import json
          with open('reports/output/qw2_log_analysis.json') as f:
              data = json.load(f)
              critical = data['summary']['critical_issues']
              if critical > 0:
                  print(f'FAIL: {critical} critical issues found')
                  exit(1)
              print('PASS: No critical issues')
          "

      - name: Upload test reports
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: accessibility-reports
          path: automation/reports/output/
```

---

### Example 7: Jenkins Pipeline

**Scenario:** Nightly build with accessibility tests

**File:** `Jenkinsfile`
```groovy
pipeline {
    agent { label 'windows' }

    triggers {
        cron('0 2 * * *') // Run at 2 AM daily
    }

    stages {
        stage('Setup') {
            steps {
                bat '''
                    cd automation
                    pip install -r requirements.txt
                '''
            }
        }

        stage('Build Unity App') {
            steps {
                // Your Unity build steps here
                echo 'Building Unity application...'
            }
        }

        stage('Quick Win 1: Launch Test') {
            steps {
                bat '''
                    cd automation
                    python quick_wins/app_launcher.py "C:/Builds/MyApp/MyApp.exe" 30
                '''
            }
        }

        stage('Quick Win 2: Log Analysis') {
            steps {
                bat '''
                    cd automation
                    python quick_wins/log_analyzer.py --find "MyApp"
                '''
            }
        }

        stage('Generate Report') {
            steps {
                bat '''
                    cd automation
                    python run_quick_wins.py config/myapp.json --quick-wins "1,2"
                '''
            }
        }

        stage('Check Results') {
            steps {
                script {
                    def reportFile = 'automation/reports/output/quick_wins_combined_report.json'
                    def report = readJSON file: reportFile

                    if (report.quick_wins.qw2_log_analysis.critical_issues > 0) {
                        error("Critical accessibility issues found!")
                    }
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'automation/reports/output/**/*.json'
            publishHTML([
                reportDir: 'automation/reports/output',
                reportFiles: '*.json',
                reportName: 'Accessibility Test Reports'
            ])
        }
    }
}
```

---

### Example 8: Azure DevOps Pipeline

**File:** `azure-pipelines.yml`
```yaml
trigger:
  - main

pool:
  vmImage: 'windows-latest'

steps:
- task: UsePythonVersion@0
  inputs:
    versionSpec: '3.11'

- script: |
    cd automation
    pip install -r requirements.txt
  displayName: 'Install Python dependencies'

- script: |
    cd automation
    python quick_wins/log_analyzer.py --find "MyApp"
  displayName: 'Run Log Analysis'

- script: |
    cd automation
    python run_quick_wins.py config/myapp.json --quick-wins "1,2"
  displayName: 'Run Quick Wins Suite'

- task: PublishTestResults@2
  inputs:
    testResultsFormat: 'JUnit'
    testResultsFiles: 'automation/reports/output/**/*.json'
  condition: always()

- task: PublishBuildArtifacts@1
  inputs:
    pathToPublish: 'automation/reports/output'
    artifactName: 'accessibility-reports'
  condition: always()
```

---

## Advanced Scenarios

### Example 9: Multi-App Testing

**Scenario:** Test 5 different Unity apps in sequence

**File:** `test_all_apps.sh` (Git Bash on Windows)
```bash
#!/bin/bash

cd automation

APPS=(
    "career_explorer"
    "math_adventure"
    "science_lab"
    "history_explorer"
    "art_studio"
)

FAILED_APPS=()

echo "Testing ${#APPS[@]} applications..."

for app in "${APPS[@]}"; do
    echo ""
    echo "========================================"
    echo "Testing: $app"
    echo "========================================"

    python run_quick_wins.py "config/${app}.json" --quick-wins "2"

    if [ $? -ne 0 ]; then
        FAILED_APPS+=("$app")
    fi
done

echo ""
echo "========================================"
echo "SUMMARY"
echo "========================================"
echo "Total apps: ${#APPS[@]}"
echo "Passed: $((${#APPS[@]} - ${#FAILED_APPS[@]}))"
echo "Failed: ${#FAILED_APPS[@]}"

if [ ${#FAILED_APPS[@]} -gt 0 ]; then
    echo ""
    echo "Failed apps:"
    for app in "${FAILED_APPS[@]}"; do
        echo "  - $app"
    done
    exit 1
fi

echo ""
echo "All apps passed!"
exit 0
```

**Run:**
```bash
bash test_all_apps.sh
```

---

### Example 10: Scheduled Testing with Task Scheduler

**Scenario:** Run tests every night at 2 AM on Windows

**Step 1: Create batch file** `run_nightly_tests.bat`
```batch
@echo off
cd C:\Users\Jill\accessibility-standards-unity\automation

echo Starting nightly accessibility tests...
echo %date% %time% > reports/last_run.txt

python run_quick_wins.py config/career_explorer.json --quick-wins "1,2" >> reports/last_run.txt 2>&1

if %ERRORLEVEL% NEQ 0 (
    echo FAILED >> reports/last_run.txt
    exit /b 1
)

echo SUCCESS >> reports/last_run.txt
exit /b 0
```

**Step 2: Create Task Scheduler task**
```powershell
# Run as Administrator
$action = New-ScheduledTaskAction -Execute "C:\Users\Jill\accessibility-standards-unity\automation\run_nightly_tests.bat"
$trigger = New-ScheduledTaskTrigger -Daily -At 2am
$principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest

Register-ScheduledTask -TaskName "Unity Accessibility Tests" `
    -Action $action `
    -Trigger $trigger `
    -Principal $principal `
    -Description "Nightly Unity accessibility testing"
```

---

### Example 11: Regression Testing with Baselines

**Scenario:** Compare current test results against baseline

**Step 1: Create baseline**
```bash
cd automation

# Run tests and save as baseline
python run_quick_wins.py config/career_explorer.json --quick-wins "2"

# Copy results to baseline
cp reports/output/qw2_log_analysis.json baseline/career_explorer_baseline.json
```

**Step 2: Create comparison script** `compare_results.py`
```python
import json
import sys

def compare_results(baseline_path, current_path):
    with open(baseline_path) as f:
        baseline = json.load(f)

    with open(current_path) as f:
        current = json.load(f)

    # Compare key metrics
    baseline_critical = baseline['summary']['critical_issues']
    current_critical = current['summary']['critical_issues']

    baseline_errors = baseline['summary']['errors']
    current_errors = current['summary']['errors']

    print("Regression Test Results:")
    print(f"Baseline critical issues: {baseline_critical}")
    print(f"Current critical issues: {current_critical}")
    print(f"Baseline errors: {baseline_errors}")
    print(f"Current errors: {current_errors}")

    if current_critical > baseline_critical:
        print(f"\nREGRESSION: Critical issues increased by {current_critical - baseline_critical}")
        return False

    if current_errors > baseline_errors:
        print(f"\nREGRESSION: Errors increased by {current_errors - baseline_errors}")
        return False

    print("\nPASS: No regression detected")
    return True

if __name__ == '__main__':
    baseline = sys.argv[1]
    current = sys.argv[2]

    passed = compare_results(baseline, current)
    sys.exit(0 if passed else 1)
```

**Step 3: Run regression test**
```bash
# Run new tests
python run_quick_wins.py config/career_explorer.json --quick-wins "2"

# Compare against baseline
python compare_results.py \
    baseline/career_explorer_baseline.json \
    reports/output/qw2_log_analysis.json
```

---

## Troubleshooting Examples

### Example 12: Debug Mode

**Scenario:** Tests are failing, need detailed output

```bash
# Enable Python verbose mode
python -v quick_wins/log_analyzer.py --find "Career Explorer"

# Or add debugging to your script
PYTHONVERBOSE=1 python run_quick_wins.py config/career_explorer.json
```

---

### Example 13: Handling App That Won't Launch

**Scenario:** App requires specific arguments or environment

**Solution: Modify launcher** `custom_launcher.py`
```python
import subprocess
import os

# Set environment variables
env = os.environ.copy()
env['UNITY_FORCE_HEADLESS'] = '0'
env['MY_CUSTOM_VAR'] = 'value'

# Launch with arguments
process = subprocess.Popen([
    'C:/Path/To/App.exe',
    '--fullscreen',
    '--quality', 'high',
    '--log-file', 'C:/Logs/app.log'
], env=env)

print(f"Launched with PID: {process.pid}")
```

---

### Example 14: Testing on Remote Machine

**Scenario:** Run tests on a remote Windows machine

**Step 1: On remote machine**, install framework:
```powershell
# Clone repo
git clone https://github.com/your-org/accessibility-standards-unity.git
cd accessibility-standards-unity/automation

# Install dependencies
pip install -r requirements.txt
```

**Step 2: From local machine**, trigger via PowerShell Remoting:
```powershell
$session = New-PSSession -ComputerName "remote-machine"

Invoke-Command -Session $session -ScriptBlock {
    cd C:\accessibility-standards-unity\automation
    python run_quick_wins.py config/career_explorer.json --quick-wins "1,2"
}

# Copy results back
Copy-Item -FromSession $session `
    -Path "C:\accessibility-standards-unity\automation\reports\output\*" `
    -Destination ".\remote_reports\" `
    -Recurse

Remove-PSSession $session
```

---

### Example 15: Handling Apps with Splash Screens

**Scenario:** App has 10-second splash screen before interactive

**Solution: Adjust wait times** in config:
```json
{
  "scenarios": [
    {
      "name": "Handle Splash Screen",
      "steps": [
        {
          "action": "wait",
          "seconds": 12,
          "description": "Wait for splash screen (10s) + buffer (2s)"
        },
        {
          "action": "screenshot",
          "name": "after_splash"
        },
        {
          "action": "click",
          "x": 960,
          "y": 540,
          "description": "Click Continue button"
        }
      ]
    }
  ]
}
```

---

## Quick Reference

### Common Commands

```bash
# Log analysis (auto-detect)
python quick_wins/log_analyzer.py --find "App Name"

# Log analysis (specific path)
python quick_wins/log_analyzer.py "C:/Path/To/Player.log"

# Launch and monitor
python quick_wins/app_launcher.py "C:/Path/To/App.exe" 30

# Create config
python run_quick_wins.py --create-sample config/myapp.json

# Run specific Quick Wins
python run_quick_wins.py config/myapp.json --quick-wins "1,2"

# Run all Quick Wins
python run_quick_wins.py config/myapp.json

# Keyboard navigation test
python quick_wins/keyboard_navigation_test.py ./screenshots
```

### Config Templates

**Minimal:**
```json
{
  "app_name": "MyApp",
  "exe_path": "C:/Path/To/App.exe",
  "quick_wins_to_run": [2]
}
```

**Full:**
```json
{
  "app_name": "MyApp",
  "exe_path": "C:/Path/To/App.exe",
  "log_path": "C:/Path/To/Player.log",
  "project_path": "C:/UnityProjects/MyApp",
  "output_dir": "./reports/myapp",
  "monitor_duration": 30,
  "automation_config": "./config/myapp_automation.json",
  "skip_interactive": false,
  "quick_wins_to_run": [1, 2, 3, 4, 5]
}
```

---

## Best Practices

1. **Start Simple**
   - Begin with Quick Win 2 (log analysis)
   - Add other Quick Wins as needed

2. **Create Baselines**
   - Save first run as baseline
   - Compare future runs against baseline

3. **Use Version Control**
   - Keep configs in git
   - Track changes to test scenarios

4. **Automate Gradually**
   - Start with manual tests
   - Automate most common scenarios
   - Expand over time

5. **Document App-Specific Quirks**
   - Note any special requirements
   - Document workarounds
   - Share with team

---

**For more information, see:**
- [Main README](README.md)
- [Implementation Summary](../QUICK_WINS_IMPLEMENTATION.md)
- [Session Report](../SESSION_REPORT.md)
- [Phase 2 Strategy](../phase2_unity.txt)
