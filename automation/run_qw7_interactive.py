"""
Interactive QW7 Focus Indicator Test for Career Explorer

This script provides step-by-step guidance for testing focus indicators.
"""

import os
import sys
import time

# Add quick_wins to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'quick_wins'))

from focus_indicator_detector import FocusIndicatorDetector

def main():
    print("\n" + "="*70)
    print("QUICK WIN 7: FOCUS INDICATOR INTERACTIVE TEST")
    print("Career Explorer - WCAG 2.4.7 Validation")
    print("="*70)

    print("\nCHECKLIST - Please complete these steps:")
    print("  1. [ ] Career Explorer is running")
    print("  2. [ ] Career Explorer window is visible on screen")
    print("  3. [ ] Career Explorer window is NOT minimized")
    print("  4. [ ] You can see UI elements (buttons, menus, etc.)")

    print("\nIMPORTANT INSTRUCTIONS:")
    print("  * The test will press Tab 10 times automatically")
    print("  * Before/after screenshots will be captured")
    print("  * Focus indicators will be detected via image comparison")
    print("  * Move mouse to TOP-LEFT CORNER to abort!")

    print("\nTEST CONFIGURATION:")
    print("  * Elements to test: 10")
    print("  * Delay between Tab presses: 0.5 seconds")
    print("  * Screenshot directory: ./screenshots/career_explorer_focus")
    print("  * Report output: ./reports/output/career_explorer_qw7_focus.json")

    print("\n" + "="*70)
    input("Press Enter when Career Explorer is ready and you've READ the instructions above...")
    print("="*70)

    print("\nStarting in 5 seconds...")
    print("   >> CLICK ON CAREER EXPLORER WINDOW NOW!")
    print("   (This ensures it has focus for Tab navigation)")

    for i in range(5, 0, -1):
        print(f"   {i}...")
        time.sleep(1)

    print("\nStarting QW7 Focus Indicator Test...")
    print("="*70 + "\n")

    # Create detector
    screenshots_dir = './screenshots/career_explorer_focus'
    detector = FocusIndicatorDetector(screenshots_dir)

    try:
        # Run test
        detector.test_focus_visibility(element_count=10, delay=0.5)

        # Save report
        report_path = './reports/output/career_explorer_qw7_focus.json'
        detector.save_report(report_path)

        # Print summary
        detector.print_summary()

        # Get summary
        summary = detector.get_summary()

        print("\n" + "="*70)
        print("[OK] TEST COMPLETE!")
        print("="*70)

        print(f"\nRESULTS:")
        print(f"  Elements Tested: {summary['elements_tested']}")
        print(f"  With Focus Indicators: {summary['with_indicators']}")
        print(f"  Without Focus Indicators: {summary['without_indicators']}")
        print(f"  Compliance Rate: {summary['compliance_rate']:.1f}%")
        print(f"  WCAG 2.4.7 Compliant: {'YES' if summary['wcag_compliant'] else 'NO'}")

        print(f"\nOUTPUT FILES:")
        print(f"  Report: {os.path.abspath(report_path)}")
        print(f"  Screenshots: {os.path.abspath(screenshots_dir)}")

        print("\nTIP: Check the screenshots to visually verify focus indicators")
        print("="*70 + "\n")

        # Return appropriate exit code
        sys.exit(0 if summary['wcag_compliant'] else 1)

    except KeyboardInterrupt:
        print("\n\n[WARNING] Test aborted by user (Ctrl+C or mouse in corner)")
        print("="*70)
        sys.exit(2)

    except Exception as e:
        print(f"\n\n[ERROR] {e}")
        print("="*70)
        import traceback
        traceback.print_exc()
        sys.exit(3)

if __name__ == '__main__':
    main()
