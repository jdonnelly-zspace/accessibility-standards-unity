"""
Auto-run QW7 Focus Indicator Test for Career Explorer
Runs automatically without prompts - make sure Career Explorer is open and focused!
"""

import os
import sys
import time

# Add quick_wins to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'quick_wins'))

from focus_indicator_detector import FocusIndicatorDetector

def main():
    print("\n" + "="*70)
    print("QUICK WIN 7: FOCUS INDICATOR AUTO-RUN TEST")
    print("Career Explorer - WCAG 2.4.7 Validation")
    print("="*70)

    print("\nPRE-FLIGHT CHECKLIST:")
    print("  * Career Explorer is running: ASSUMED")
    print("  * Career Explorer window is visible: ASSUMED")
    print("  * Career Explorer has UI elements visible: ASSUMED")

    print("\nAUTO-RUN CONFIGURATION:")
    print("  * Elements to test: 10")
    print("  * Delay between Tab presses: 0.5 seconds")
    print("  * No interactive prompts - starting automatically!")
    print("  * Move mouse to TOP-LEFT CORNER to abort!")

    print("\n" + "="*70)
    print("Starting in 5 seconds...")
    print(">> MAKE SURE CAREER EXPLORER WINDOW IS VISIBLE AND FOCUSED!")
    print("="*70)

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
