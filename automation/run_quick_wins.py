#!/usr/bin/env python3
"""
Main Automation Coordinator
Runs all Quick Wins (1-5) for comprehensive Unity accessibility testing.
"""

import sys
import os
import json
import argparse
from datetime import datetime
from pathlib import Path

# Add quick_wins directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'quick_wins'))

try:
    from app_launcher import AppLauncher
    from log_analyzer import LogAnalyzer, find_unity_log
    from input_automation import InputAutomation, create_sample_config
    from keyboard_navigation_test import KeyboardNavigationTest
    from color_contrast_analyzer import ColorContrastAnalyzer
    from focus_indicator_detector import FocusIndicatorDetector
except ImportError as e:
    print(f"ERROR: Failed to import Quick Win modules: {e}")
    print("Make sure all Quick Win scripts are in the quick_wins directory")
    sys.exit(1)


class QuickWinsCoordinator:
    """Coordinates execution of all Quick Win tests."""

    def __init__(self, config):
        """
        Initialize coordinator.

        Args:
            config: Configuration dict with app details
        """
        self.config = config
        self.results = {
            'timestamp': datetime.now().isoformat(),
            'app_name': config.get('app_name'),
            'exe_path': config.get('exe_path'),
            'quick_wins': {}
        }
        self.output_dir = config.get('output_dir', './automation/reports/output')
        os.makedirs(self.output_dir, exist_ok=True)

    def run_quick_win_1(self):
        """Quick Win 1: Application Launch & Monitoring."""
        print("\n" + "="*70)
        print("QUICK WIN 1: Application Launch & Monitoring")
        print("="*70)

        exe_path = self.config.get('exe_path')
        if not exe_path:
            print("[WARNING] No executable path provided, skipping Quick Win 1")
            return None

        launcher = AppLauncher(exe_path)

        if launcher.launch():
            monitor_duration = self.config.get('monitor_duration', 30)
            launcher.monitor(duration=monitor_duration)
            launcher.terminate()

        metrics = launcher.get_metrics()
        self.results['quick_wins']['qw1_app_launch'] = metrics

        # Save individual report
        report_path = os.path.join(self.output_dir, 'qw1_app_launch.json')
        launcher.save_report(report_path)

        return metrics

    def run_quick_win_2(self):
        """Quick Win 2: Log File Scene Analyzer."""
        print("\n" + "="*70)
        print("QUICK WIN 2: Log File Scene Analyzer")
        print("="*70)

        log_path = self.config.get('log_path')

        # Try to find log if not provided
        if not log_path:
            app_name = self.config.get('app_name')
            log_path = find_unity_log(app_name)
            if log_path:
                print(f"[OK] Auto-detected log: {log_path}")
            else:
                print("[WARNING] No Unity log found, skipping Quick Win 2")
                return None

        analyzer = LogAnalyzer(log_path)

        if analyzer.parse():
            analyzer.print_summary()

        summary = analyzer.get_summary()
        self.results['quick_wins']['qw2_log_analysis'] = summary

        # Save individual report
        report_path = os.path.join(self.output_dir, 'qw2_log_analysis.json')
        analyzer.save_report(report_path)

        return summary

    def run_quick_win_3(self):
        """Quick Win 3: Basic Input Automation."""
        print("\n" + "="*70)
        print("QUICK WIN 3: Basic Input Automation")
        print("="*70)

        automation_config = self.config.get('automation_config')

        if not automation_config:
            # Create sample config if none provided
            config_path = os.path.join(self.output_dir, 'sample_automation_config.json')
            print(f"[WARNING] No automation config provided")
            print(f"   Creating sample config: {config_path}")
            create_sample_config(config_path)
            print("   Edit this config and re-run to execute automation tests")
            return None

        try:
            automation = InputAutomation(automation_config)
            screenshots_dir = os.path.join(self.output_dir, 'screenshots', 'automation')
            automation.setup_screenshots(screenshots_dir)

            print("\n[WARNING] This will control your mouse and keyboard!")
            print("[WARNING] Move mouse to top-left corner to abort")
            print("Starting in 5 seconds...")
            import time
            time.sleep(5)

            automation.run_from_config()

            # Save results
            report_path = os.path.join(self.output_dir, 'qw3_input_automation.json')
            automation.save_results(report_path)

            self.results['quick_wins']['qw3_input_automation'] = {
                'total_actions': len(automation.results),
                'status': 'completed'
            }

        except Exception as e:
            print(f"ERROR in Quick Win 3: {e}")
            self.results['quick_wins']['qw3_input_automation'] = {
                'status': 'error',
                'error': str(e)
            }

        return self.results['quick_wins']['qw3_input_automation']

    def run_quick_win_4(self):
        """Quick Win 4: Keyboard Navigation Test."""
        print("\n" + "="*70)
        print("QUICK WIN 4: Keyboard Navigation Accessibility Test")
        print("="*70)

        if self.config.get('skip_interactive', False):
            print("[WARNING] Interactive mode disabled, skipping Quick Win 4")
            return None

        try:
            tester = KeyboardNavigationTest()
            screenshots_dir = os.path.join(self.output_dir, 'screenshots', 'keyboard_nav')
            tester.setup_screenshots(screenshots_dir)

            tester.run_full_test_suite()

            # Save report
            report_path = os.path.join(self.output_dir, 'qw4_keyboard_navigation.json')
            tester.save_report(report_path)

            accessibility_report = tester.get_accessibility_report()
            self.results['quick_wins']['qw4_keyboard_navigation'] = accessibility_report

        except Exception as e:
            print(f"ERROR in Quick Win 4: {e}")
            self.results['quick_wins']['qw4_keyboard_navigation'] = {
                'status': 'error',
                'error': str(e)
            }

        return self.results['quick_wins']['qw4_keyboard_navigation']

    def run_quick_win_5(self):
        """
        Quick Win 5: Automated Accessibility Audit Integration.
        (This is handled by bin/audit.js - we just note it here)
        """
        print("\n" + "="*70)
        print("QUICK WIN 5: Automated Accessibility Audit")
        print("="*70)
        print("[INFO] Quick Win 5 is the main accessibility audit (bin/audit.js)")
        print("   The audit has been integrated to run Quick Wins 1-4 automatically")
        print("   You can also run it separately with:")
        print(f"     node bin/audit.js {self.config.get('project_path', '<unity-project>')}")

        self.results['quick_wins']['qw5_accessibility_audit'] = {
            'status': 'integrated',
            'note': 'Run bin/audit.js for full accessibility audit'
        }

    def run_quick_win_6(self):
        """Quick Win 6: Automated Color Contrast Analyzer."""
        print("\n" + "="*70)
        print("QUICK WIN 6: Automated Color Contrast Analyzer")
        print("="*70)

        try:
            # Get screenshots directory
            screenshots_dir = self.config.get('screenshots_dir')

            if not screenshots_dir:
                # Default to screenshots from QW1 or QW4
                screenshots_dir = os.path.join(self.output_dir, 'screenshots')

            # Create analyzer
            analyzer = ColorContrastAnalyzer(screenshots_dir)

            # If no screenshots exist, capture one from desktop
            if not analyzer.screenshots:
                print("[INFO] No screenshots found, capturing desktop screenshot...")
                import pyautogui
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                screenshot_path = os.path.join(screenshots_dir, f"desktop_{timestamp}.png")
                os.makedirs(screenshots_dir, exist_ok=True)
                screenshot = pyautogui.screenshot()
                screenshot.save(screenshot_path)
                analyzer.screenshots = [screenshot_path]

            # Analyze all screenshots
            analyzer.analyze_all_screenshots()

            # Save report
            report_path = os.path.join(self.output_dir, 'qw6_color_contrast.json')
            analyzer.save_report(report_path)

            # Get summary
            summary = analyzer.get_summary()
            self.results['quick_wins']['qw6_color_contrast'] = summary

        except Exception as e:
            print(f"ERROR in Quick Win 6: {e}")
            self.results['quick_wins']['qw6_color_contrast'] = {
                'status': 'error',
                'error': str(e)
            }

        return self.results['quick_wins'].get('qw6_color_contrast')

    def run_quick_win_7(self):
        """Quick Win 7: Focus Indicator Detector."""
        print("\n" + "="*70)
        print("QUICK WIN 7: Focus Indicator Detector")
        print("="*70)

        if self.config.get('skip_interactive', False):
            print("[WARNING] Interactive mode disabled, skipping Quick Win 7")
            return None

        try:
            # Create detector
            screenshots_dir = os.path.join(self.output_dir, 'screenshots', 'focus_indicators')
            detector = FocusIndicatorDetector(screenshots_dir)

            # Get element count from config
            element_count = self.config.get('focus_test_elements', 10)

            print("\nIMPORTANT:")
            print("1. Make sure your application is running and in focus")
            print("2. Position your window so interactive elements are visible")
            print("3. Move mouse to top-left corner to abort")
            print(f"\nWill test {element_count} elements with Tab navigation")
            print("Press Enter to start, or Ctrl+C to skip...")

            try:
                input()
            except KeyboardInterrupt:
                print("\n[WARNING] Quick Win 7 skipped by user")
                return None

            # Run test
            detector.test_focus_visibility(element_count=element_count)

            # Save report
            report_path = os.path.join(self.output_dir, 'qw7_focus_indicators.json')
            detector.save_report(report_path)

            # Get summary
            summary = detector.get_summary()
            self.results['quick_wins']['qw7_focus_indicators'] = summary

        except Exception as e:
            print(f"ERROR in Quick Win 7: {e}")
            self.results['quick_wins']['qw7_focus_indicators'] = {
                'status': 'error',
                'error': str(e)
            }

        return self.results['quick_wins'].get('qw7_focus_indicators')

    def run_all(self, quick_wins_to_run=None):
        """
        Run all Quick Wins.

        Args:
            quick_wins_to_run: List of Quick Win numbers to run (1-7), or None for all
        """
        if quick_wins_to_run is None:
            quick_wins_to_run = [1, 2, 6, 7]  # Default: non-interactive + Phase 1

        print("\n" + "="*70)
        print("RUNNING QUICK WINS AUTOMATION SUITE")
        print("="*70)
        print(f"Quick Wins to run: {quick_wins_to_run}")
        print(f"Output directory: {self.output_dir}")

        # Run selected Quick Wins
        if 1 in quick_wins_to_run:
            self.run_quick_win_1()

        if 2 in quick_wins_to_run:
            self.run_quick_win_2()

        if 3 in quick_wins_to_run:
            self.run_quick_win_3()

        if 4 in quick_wins_to_run:
            self.run_quick_win_4()

        if 5 in quick_wins_to_run:
            self.run_quick_win_5()

        if 6 in quick_wins_to_run:
            self.run_quick_win_6()

        if 7 in quick_wins_to_run:
            self.run_quick_win_7()

        # Save combined results
        self.save_combined_report()
        self.print_summary()

    def save_combined_report(self):
        """Save combined results from all Quick Wins."""
        output_path = os.path.join(self.output_dir, 'quick_wins_combined_report.json')

        with open(output_path, 'w') as f:
            json.dump(self.results, f, indent=2)

        print(f"\n[OK] Combined report saved: {output_path}")

    def print_summary(self):
        """Print summary of all Quick Wins."""
        print("\n" + "="*70)
        print("QUICK WINS SUMMARY")
        print("="*70)

        print(f"\nApplication: {self.results['app_name']}")
        print(f"Timestamp: {self.results['timestamp']}")
        print(f"\nResults:")

        for qw_name, qw_result in self.results['quick_wins'].items():
            if qw_result:
                status = qw_result.get('status', 'completed')
                print(f"  [OK] {qw_name}: {status}")
            else:
                print(f"  [ - ] {qw_name}: skipped")

        print("\n" + "="*70)


def load_config_file(config_path):
    """Load configuration from JSON file."""
    with open(config_path, 'r') as f:
        return json.load(f)


def create_sample_config_file(output_path):
    """Create a sample configuration file."""
    sample = {
        "app_name": "Career Explorer",
        "exe_path": "C:/Program Files/zSpace/Career Explorer/zSpaceCareerExplorer.exe",
        "log_path": "C:/Users/Jill/AppData/LocalLow/zSpace/Career Explorer/Player.log",
        "project_path": "C:/UnityProjects/CareerExplorer",
        "output_dir": "./automation/reports/output",
        "monitor_duration": 30,
        "automation_config": None,
        "skip_interactive": False,
        "quick_wins_to_run": [1, 2, 3, 4, 5]
    }

    output_dir = os.path.dirname(output_path)
    if output_dir:
        os.makedirs(output_dir, exist_ok=True)

    with open(output_path, 'w') as f:
        json.dump(sample, f, indent=2)

    print(f"[OK] Sample configuration created: {output_path}")
    return output_path


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description='Run Quick Wins automation suite for Unity accessibility testing'
    )
    parser.add_argument(
        'config',
        nargs='?',
        help='Path to JSON configuration file'
    )
    parser.add_argument(
        '--create-sample',
        action='store_true',
        help='Create a sample configuration file'
    )
    parser.add_argument(
        '--quick-wins',
        type=str,
        help='Comma-separated list of Quick Wins to run (e.g., "1,2,5")'
    )
    parser.add_argument(
        '--exe',
        type=str,
        help='Path to Unity executable (overrides config)'
    )
    parser.add_argument(
        '--log',
        type=str,
        help='Path to Unity Player.log (overrides config)'
    )

    args = parser.parse_args()

    # Create sample config
    if args.create_sample:
        output_path = args.config if args.config else './automation/config/sample_config.json'
        create_sample_config_file(output_path)
        return 0

    # Load or create config
    if args.config and os.path.exists(args.config):
        config = load_config_file(args.config)
    else:
        # Minimal config
        config = {
            'app_name': 'Unity Application',
            'exe_path': args.exe,
            'log_path': args.log,
            'output_dir': './automation/reports/output',
            'monitor_duration': 30,
            'skip_interactive': False
        }

    # Override with command line args
    if args.exe:
        config['exe_path'] = args.exe
    if args.log:
        config['log_path'] = args.log

    # Parse Quick Wins to run
    quick_wins_to_run = None
    if args.quick_wins:
        try:
            quick_wins_to_run = [int(x.strip()) for x in args.quick_wins.split(',')]
        except ValueError:
            print("ERROR: --quick-wins must be comma-separated integers (e.g., '1,2,5')")
            return 1

    # Run coordinator
    coordinator = QuickWinsCoordinator(config)
    coordinator.run_all(quick_wins_to_run)

    return 0


if __name__ == '__main__':
    sys.exit(main())
