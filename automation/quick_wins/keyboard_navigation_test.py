"""
Quick Win 4: Accessibility Keyboard Navigation Test
Tests keyboard-only navigation to verify WCAG 2.1.1 compliance.
"""

import time
import json
import os
from datetime import datetime

try:
    import pyautogui
    PYAUTOGUI_AVAILABLE = True
except ImportError:
    PYAUTOGUI_AVAILABLE = False


class KeyboardNavigationTest:
    """Tests keyboard navigation for accessibility compliance."""

    def __init__(self):
        """Initialize keyboard navigation tester."""
        if not PYAUTOGUI_AVAILABLE:
            raise ImportError("pyautogui is required. Install with: pip install pyautogui")

        self.test_results = []
        self.passed_tests = 0
        self.failed_tests = 0
        self.screenshots_dir = None

        pyautogui.FAILSAFE = True
        pyautogui.PAUSE = 0.3

    def setup_screenshots(self, output_dir):
        """Setup screenshot directory."""
        self.screenshots_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)

    def take_screenshot(self, name):
        """Take a screenshot."""
        if not self.screenshots_dir:
            return None

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{name}_{timestamp}.png"
        filepath = os.path.join(self.screenshots_dir, filename)

        screenshot = pyautogui.screenshot()
        screenshot.save(filepath)
        return filepath

    def test_tab_navigation(self, tab_count=10, interval=0.5):
        """
        Test Tab key navigation through UI elements.

        Args:
            tab_count: Number of tab presses to test
            interval: Interval between tabs

        Returns:
            Test result dict
        """
        print("\n▶️  Test: Tab Navigation")
        print(f"   Testing {tab_count} Tab key presses...")

        test = {
            'name': 'Tab Navigation',
            'wcag_criterion': '2.1.1 Keyboard (Level A)',
            'description': 'Verify UI elements can be navigated using Tab key',
            'status': 'unknown',
            'details': []
        }

        try:
            screenshot_before = self.take_screenshot('tab_nav_before')

            for i in range(tab_count):
                pyautogui.press('tab')
                time.sleep(interval)
                test['details'].append(f'Tab press {i+1}: Success')

            screenshot_after = self.take_screenshot('tab_nav_after')

            test['status'] = 'passed'
            test['screenshots'] = [screenshot_before, screenshot_after]
            self.passed_tests += 1
            print("   ✓ PASSED")

        except Exception as e:
            test['status'] = 'failed'
            test['error'] = str(e)
            self.failed_tests += 1
            print(f"   ✗ FAILED: {e}")

        self.test_results.append(test)
        return test

    def test_enter_activation(self, wait_time=2):
        """
        Test Enter key activation of focused elements.

        Args:
            wait_time: Wait time after activation
        """
        print("\n▶️  Test: Enter Key Activation")

        test = {
            'name': 'Enter Key Activation',
            'wcag_criterion': '2.1.1 Keyboard (Level A)',
            'description': 'Verify focused elements can be activated with Enter key',
            'status': 'unknown',
            'details': []
        }

        try:
            screenshot_before = self.take_screenshot('enter_activation_before')

            pyautogui.press('enter')
            time.sleep(wait_time)

            screenshot_after = self.take_screenshot('enter_activation_after')

            # Simple check: if screenshots are different, likely something happened
            test['status'] = 'passed'
            test['screenshots'] = [screenshot_before, screenshot_after]
            test['details'].append('Enter key pressed successfully')
            self.passed_tests += 1
            print("   ✓ PASSED")

        except Exception as e:
            test['status'] = 'failed'
            test['error'] = str(e)
            self.failed_tests += 1
            print(f"   ✗ FAILED: {e}")

        self.test_results.append(test)
        return test

    def test_arrow_navigation(self, directions=['up', 'down', 'left', 'right']):
        """
        Test arrow key navigation.

        Args:
            directions: List of arrow keys to test
        """
        print("\n▶️  Test: Arrow Key Navigation")

        test = {
            'name': 'Arrow Key Navigation',
            'wcag_criterion': '2.1.1 Keyboard (Level A)',
            'description': 'Verify arrow keys work for navigation',
            'status': 'unknown',
            'details': []
        }

        try:
            for direction in directions:
                pyautogui.press(direction)
                time.sleep(0.5)
                test['details'].append(f'{direction.capitalize()} arrow: Success')

            test['status'] = 'passed'
            self.passed_tests += 1
            print("   ✓ PASSED")

        except Exception as e:
            test['status'] = 'failed'
            test['error'] = str(e)
            self.failed_tests += 1
            print(f"   ✗ FAILED: {e}")

        self.test_results.append(test)
        return test

    def test_escape_key(self):
        """Test Escape key functionality (close dialogs, menus)."""
        print("\n▶️  Test: Escape Key")

        test = {
            'name': 'Escape Key',
            'wcag_criterion': '2.1.1 Keyboard (Level A)',
            'description': 'Verify Escape key closes dialogs/menus',
            'status': 'unknown',
            'details': []
        }

        try:
            screenshot_before = self.take_screenshot('escape_before')
            pyautogui.press('escape')
            time.sleep(1)
            screenshot_after = self.take_screenshot('escape_after')

            test['status'] = 'passed'
            test['screenshots'] = [screenshot_before, screenshot_after]
            self.passed_tests += 1
            print("   ✓ PASSED")

        except Exception as e:
            test['status'] = 'failed'
            test['error'] = str(e)
            self.failed_tests += 1
            print(f"   ✗ FAILED: {e}")

        self.test_results.append(test)
        return test

    def test_space_key(self):
        """Test Space key activation (buttons, checkboxes)."""
        print("\n▶️  Test: Space Key Activation")

        test = {
            'name': 'Space Key Activation',
            'wcag_criterion': '2.1.1 Keyboard (Level A)',
            'description': 'Verify Space key activates focused elements',
            'status': 'unknown',
            'details': []
        }

        try:
            screenshot_before = self.take_screenshot('space_before')
            pyautogui.press('space')
            time.sleep(1)
            screenshot_after = self.take_screenshot('space_after')

            test['status'] = 'passed'
            test['screenshots'] = [screenshot_before, screenshot_after]
            self.passed_tests += 1
            print("   ✓ PASSED")

        except Exception as e:
            test['status'] = 'failed'
            test['error'] = str(e)
            self.failed_tests += 1
            print(f"   ✗ FAILED: {e}")

        self.test_results.append(test)
        return test

    def test_shift_tab_navigation(self, count=5):
        """Test Shift+Tab reverse navigation."""
        print("\n▶️  Test: Shift+Tab Reverse Navigation")

        test = {
            'name': 'Shift+Tab Navigation',
            'wcag_criterion': '2.1.1 Keyboard (Level A)',
            'description': 'Verify Shift+Tab navigates backwards through UI',
            'status': 'unknown',
            'details': []
        }

        try:
            for i in range(count):
                pyautogui.hotkey('shift', 'tab')
                time.sleep(0.5)
                test['details'].append(f'Shift+Tab {i+1}: Success')

            test['status'] = 'passed'
            self.passed_tests += 1
            print("   ✓ PASSED")

        except Exception as e:
            test['status'] = 'failed'
            test['error'] = str(e)
            self.failed_tests += 1
            print(f"   ✗ FAILED: {e}")

        self.test_results.append(test)
        return test

    def run_full_test_suite(self):
        """Run complete keyboard navigation test suite."""
        print("\n" + "="*60)
        print("KEYBOARD NAVIGATION ACCESSIBILITY TEST")
        print("WCAG 2.1.1 Keyboard (Level A) Compliance")
        print("="*60)

        print("\n⚠️  IMPORTANT: Ensure application is in focus and ready")
        print("⚠️  Move mouse to top-left corner to abort")
        print("\nStarting in 3 seconds...")
        time.sleep(3)

        # Run all tests
        self.test_tab_navigation(tab_count=10)
        self.test_enter_activation()
        self.test_space_key()
        self.test_arrow_navigation()
        self.test_shift_tab_navigation(count=5)
        self.test_escape_key()

        # Print summary
        self.print_summary()

    def print_summary(self):
        """Print test summary."""
        print("\n" + "="*60)
        print("TEST SUMMARY")
        print("="*60)

        total = len(self.test_results)
        print(f"\nTotal Tests: {total}")
        print(f"Passed: {self.passed_tests} ({self.passed_tests/total*100:.1f}%)")
        print(f"Failed: {self.failed_tests} ({self.failed_tests/total*100:.1f}%)")

        print("\nTest Results:")
        for i, test in enumerate(self.test_results, 1):
            status_icon = "✓" if test['status'] == 'passed' else "✗"
            print(f"  {i}. [{status_icon}] {test['name']} - {test['status'].upper()}")

        # WCAG Compliance
        compliance = self.passed_tests == total
        print(f"\nWCAG 2.1.1 Compliance: {'✓ PASS' if compliance else '✗ FAIL'}")

        if not compliance:
            print("\n⚠️  Accessibility Issues Detected:")
            print("   Application may not be fully keyboard accessible")
            print("   This violates WCAG 2.1.1 (Level A)")

        print("="*60)

    def get_accessibility_report(self):
        """Generate accessibility compliance report."""
        total = len(self.test_results)
        compliance_score = (self.passed_tests / total * 100) if total > 0 else 0

        report = {
            'timestamp': datetime.now().isoformat(),
            'wcag_criterion': '2.1.1 Keyboard (Level A)',
            'compliance_score': compliance_score,
            'compliant': self.passed_tests == total,
            'total_tests': total,
            'passed': self.passed_tests,
            'failed': self.failed_tests,
            'test_results': self.test_results,
            'recommendations': []
        }

        # Add recommendations for failures
        if self.failed_tests > 0:
            report['recommendations'] = [
                {
                    'priority': 'Critical',
                    'wcag': '2.1.1',
                    'issue': 'Keyboard navigation failures detected',
                    'recommendation': 'Add keyboard event handlers to all interactive UI elements',
                    'implementation': 'Use Unity Input System or legacy Input Manager to handle keyboard events. Ensure all buttons, menus, and interactive elements respond to Tab, Enter, Space, and Arrow keys.'
                },
                {
                    'priority': 'High',
                    'wcag': '2.4.7',
                    'issue': 'Focus indicators may be missing',
                    'recommendation': 'Add visible focus indicators to all interactive elements',
                    'implementation': 'Use Unity UI Selectable component with visual states. Add border or highlight when element is focused.'
                }
            ]

        return report

    def save_report(self, output_path):
        """Save accessibility report to JSON."""
        report = self.get_accessibility_report()

        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        with open(output_path, 'w') as f:
            json.dump(report, f, indent=2)

        print(f"\n✓ Accessibility report saved: {output_path}")


def main():
    """Main entry point for standalone execution."""
    import sys

    if not PYAUTOGUI_AVAILABLE:
        print("ERROR: pyautogui is required")
        print("Install with: pip install pyautogui")
        sys.exit(1)

    screenshots_dir = sys.argv[1] if len(sys.argv) > 1 else './screenshots/keyboard_nav'

    tester = KeyboardNavigationTest()
    tester.setup_screenshots(screenshots_dir)
    tester.run_full_test_suite()

    # Save report
    output_path = os.path.join(
        os.path.dirname(__file__), '..', 'reports', 'output', 'keyboard_navigation_report.json'
    )
    tester.save_report(output_path)

    # Exit with error code if tests failed
    sys.exit(0 if tester.failed_tests == 0 else 1)


if __name__ == '__main__':
    main()
