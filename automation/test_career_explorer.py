"""
Test Career Explorer with Quick Wins 6 and 7

This script:
1. Launches Career Explorer
2. Captures screenshots at intervals
3. Runs QW6 color contrast analysis
4. Prompts for QW7 focus indicator testing
"""

import os
import sys
import time
import subprocess

# Add quick_wins to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'quick_wins'))

import pyautogui
from color_contrast_analyzer import ColorContrastAnalyzer
from focus_indicator_detector import FocusIndicatorDetector

# Configuration
EXE_PATH = "C:/Program Files/zSpace/Career Explorer/zSpaceCareerExplorer.exe"
SCREENSHOTS_DIR = "./screenshots/career_explorer_test"
OUTPUT_DIR = "./reports/output"

def launch_career_explorer():
    """Launch Career Explorer"""
    print("\n" + "="*70)
    print("LAUNCHING CAREER EXPLORER")
    print("="*70)

    if not os.path.exists(EXE_PATH):
        print(f"[ERROR] Career Explorer not found at: {EXE_PATH}")
        return None

    try:
        print(f"Launching: {EXE_PATH}")
        process = subprocess.Popen([EXE_PATH])
        print(f"[OK] Launched (PID: {process.pid})")
        print("Waiting for application to load...")
        time.sleep(5)  # Give it time to load

        return process
    except Exception as e:
        print(f"[ERROR] Failed to launch: {e}")
        return None

def capture_screenshots(count=5, interval=3):
    """Capture screenshots at intervals"""
    print("\n" + "="*70)
    print("CAPTURING SCREENSHOTS")
    print("="*70)
    print(f"Will capture {count} screenshots, {interval}s apart")
    print("Make sure Career Explorer window is visible!\n")

    os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

    screenshots = []
    for i in range(count):
        filename = f"career_explorer_{i+1:02d}.png"
        filepath = os.path.join(SCREENSHOTS_DIR, filename)

        print(f"[{i+1}/{count}] Capturing screenshot...")
        screenshot = pyautogui.screenshot()
        screenshot.save(filepath)
        screenshots.append(filepath)
        print(f"  Saved: {filename}")

        if i < count - 1:
            time.sleep(interval)

    print(f"\n[OK] Captured {len(screenshots)} screenshots")
    return screenshots

def run_qw6_analysis():
    """Run QW6 color contrast analysis"""
    print("\n" + "="*70)
    print("QUICK WIN 6: COLOR CONTRAST ANALYSIS")
    print("="*70)

    analyzer = ColorContrastAnalyzer(SCREENSHOTS_DIR)

    if not analyzer.screenshots:
        print("[ERROR] No screenshots found to analyze")
        return None

    print(f"Analyzing {len(analyzer.screenshots)} screenshots...\n")
    analyzer.analyze_all_screenshots()

    # Save report
    report_path = os.path.join(OUTPUT_DIR, 'career_explorer_qw6_contrast.json')
    analyzer.save_report(report_path)
    analyzer.print_summary()

    return analyzer.get_summary()

def run_qw7_focus_test():
    """Run QW7 focus indicator test (interactive)"""
    print("\n" + "="*70)
    print("QUICK WIN 7: FOCUS INDICATOR TEST")
    print("="*70)

    print("\nIMPORTANT INSTRUCTIONS:")
    print("1. Make sure Career Explorer is running and visible")
    print("2. Click on the Career Explorer window to give it focus")
    print("3. Position the window so UI elements are clearly visible")
    print("4. The test will press Tab 10 times to test focus indicators")
    print("5. Move mouse to top-left corner to abort at any time")
    print("\nREADY TO START?")
    print("Press Enter to begin QW7 testing, or Ctrl+C to skip...")

    try:
        input()
    except KeyboardInterrupt:
        print("\n[WARNING] QW7 test skipped")
        return None

    print("\nStarting in 3 seconds...")
    print("CLICK ON CAREER EXPLORER WINDOW NOW!")
    time.sleep(3)

    # Run test
    screenshots_dir = os.path.join(SCREENSHOTS_DIR, 'focus_indicators')
    detector = FocusIndicatorDetector(screenshots_dir)

    try:
        detector.test_focus_visibility(element_count=10, delay=0.5)

        # Save report
        report_path = os.path.join(OUTPUT_DIR, 'career_explorer_qw7_focus.json')
        detector.save_report(report_path)
        detector.print_summary()

        return detector.get_summary()

    except Exception as e:
        print(f"\n[ERROR] QW7 test failed: {e}")
        return None

def main():
    """Main test sequence"""
    print("\n" + "="*70)
    print("CAREER EXPLORER ACCESSIBILITY TEST")
    print("Quick Wins 6 & 7 Validation")
    print("="*70)

    # Launch Career Explorer
    process = launch_career_explorer()
    if not process:
        print("\n[ERROR] Could not launch Career Explorer")
        return 1

    try:
        # Capture screenshots
        screenshots = capture_screenshots(count=5, interval=2)

        # Run QW6 analysis
        qw6_summary = run_qw6_analysis()

        # Ask about QW7
        print("\n" + "="*70)
        print("QW6 COMPLETE - Ready for QW7")
        print("="*70)

        # Run QW7 (interactive)
        qw7_summary = run_qw7_focus_test()

        # Print final summary
        print("\n" + "="*70)
        print("TEST COMPLETE")
        print("="*70)

        if qw6_summary:
            print(f"\nQW6 Results:")
            print(f"  Screenshots analyzed: {qw6_summary['screenshots_analyzed']}")
            print(f"  Total checks: {qw6_summary['total_checks']}")
            print(f"  Pass rate: {qw6_summary['overall_pass_rate']:.1f}%")
            print(f"  WCAG compliant: {'Yes' if qw6_summary['wcag_compliant'] else 'No'}")

        if qw7_summary:
            print(f"\nQW7 Results:")
            print(f"  Elements tested: {qw7_summary['elements_tested']}")
            print(f"  With indicators: {qw7_summary['with_indicators']}")
            print(f"  Compliance rate: {qw7_summary['compliance_rate']:.1f}%")
            print(f"  WCAG compliant: {'Yes' if qw7_summary['wcag_compliant'] else 'No'}")

        print("\nReports saved to:")
        print(f"  {os.path.abspath(OUTPUT_DIR)}")
        print("\nScreenshots saved to:")
        print(f"  {os.path.abspath(SCREENSHOTS_DIR)}")

        return 0

    finally:
        # Clean up - terminate Career Explorer
        print("\n" + "="*70)
        print("Terminating Career Explorer...")
        try:
            process.terminate()
            process.wait(timeout=5)
            print("[OK] Career Explorer terminated")
        except:
            print("[WARNING] Could not terminate Career Explorer gracefully")
        print("="*70)

if __name__ == '__main__':
    sys.exit(main())
