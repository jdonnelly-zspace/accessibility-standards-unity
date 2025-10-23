"""
Quick Win 3: Basic Input Automation Script
Automates mouse clicks and keyboard inputs for Unity applications.
"""

import time
import json
import os
from datetime import datetime
from pathlib import Path

try:
    import pyautogui
    PYAUTOGUI_AVAILABLE = True
except ImportError:
    PYAUTOGUI_AVAILABLE = False
    print("WARNING: pyautogui not installed. Install with: pip install pyautogui")


class InputAutomation:
    """Automates input for Unity applications."""

    def __init__(self, config_path=None):
        """
        Initialize input automation.

        Args:
            config_path: Path to JSON config file with automation steps
        """
        if not PYAUTOGUI_AVAILABLE:
            raise ImportError("pyautogui is required. Install with: pip install pyautogui")

        self.config = None
        self.results = []
        self.screenshots_dir = None

        # Safety settings for pyautogui
        pyautogui.FAILSAFE = True  # Move mouse to corner to abort
        pyautogui.PAUSE = 0.5  # Small pause between actions

        if config_path and os.path.exists(config_path):
            self.load_config(config_path)

    def load_config(self, config_path):
        """Load automation configuration from JSON."""
        with open(config_path, 'r') as f:
            self.config = json.load(f)
        print(f"✓ Loaded configuration: {config_path}")

    def setup_screenshots(self, output_dir):
        """Setup screenshot directory."""
        self.screenshots_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)
        print(f"✓ Screenshots will be saved to: {output_dir}")

    def take_screenshot(self, name):
        """Take a screenshot with given name."""
        if not self.screenshots_dir:
            return None

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{name}_{timestamp}.png"
        filepath = os.path.join(self.screenshots_dir, filename)

        screenshot = pyautogui.screenshot()
        screenshot.save(filepath)
        print(f"  📸 Screenshot: {filename}")
        return filepath

    def wait(self, seconds):
        """Wait for specified seconds."""
        print(f"  ⏳ Waiting {seconds}s...")
        time.sleep(seconds)

    def click(self, x, y, button='left', clicks=1, interval=0.1):
        """
        Click at specified coordinates.

        Args:
            x, y: Screen coordinates
            button: 'left', 'right', or 'middle'
            clicks: Number of clicks
            interval: Interval between clicks
        """
        print(f"  🖱️  Clicking at ({x}, {y}) - {button} button x{clicks}")
        pyautogui.click(x, y, clicks=clicks, interval=interval, button=button)
        self.results.append({
            'action': 'click',
            'x': x,
            'y': y,
            'button': button,
            'clicks': clicks,
            'timestamp': datetime.now().isoformat()
        })

    def move_to(self, x, y, duration=0.5):
        """Move mouse to coordinates with human-like animation."""
        print(f"  🖱️  Moving to ({x}, {y})")
        pyautogui.moveTo(x, y, duration=duration)

    def type_text(self, text, interval=0.05):
        """Type text with optional interval between keystrokes."""
        print(f"  ⌨️  Typing: '{text}'")
        pyautogui.write(text, interval=interval)
        self.results.append({
            'action': 'type',
            'text': text,
            'timestamp': datetime.now().isoformat()
        })

    def press_key(self, key, presses=1, interval=0.1):
        """
        Press a key.

        Args:
            key: Key name (e.g., 'enter', 'tab', 'space', 'up', 'down')
            presses: Number of times to press
            interval: Interval between presses
        """
        print(f"  ⌨️  Pressing '{key}' x{presses}")
        pyautogui.press(key, presses=presses, interval=interval)
        self.results.append({
            'action': 'press',
            'key': key,
            'presses': presses,
            'timestamp': datetime.now().isoformat()
        })

    def hotkey(self, *keys):
        """Press a hotkey combination (e.g., 'ctrl', 'c')."""
        keys_str = '+'.join(keys)
        print(f"  ⌨️  Hotkey: {keys_str}")
        pyautogui.hotkey(*keys)
        self.results.append({
            'action': 'hotkey',
            'keys': keys,
            'timestamp': datetime.now().isoformat()
        })

    def execute_scenario(self, scenario):
        """
        Execute an automation scenario.

        Args:
            scenario: Dict with scenario steps
        """
        scenario_name = scenario.get('name', 'Unnamed Scenario')
        steps = scenario.get('steps', [])

        print(f"\n▶️  Executing Scenario: {scenario_name}")
        print(f"   Steps: {len(steps)}")

        for i, step in enumerate(steps, 1):
            action = step.get('action')
            print(f"\n  Step {i}/{len(steps)}: {action}")

            try:
                if action == 'wait':
                    self.wait(step.get('seconds', 1))

                elif action == 'screenshot':
                    self.take_screenshot(step.get('name', f'step_{i}'))

                elif action == 'click':
                    x = step.get('x')
                    y = step.get('y')
                    if x is None or y is None:
                        print(f"    ⚠️  Missing coordinates, skipping")
                        continue
                    self.click(
                        x, y,
                        button=step.get('button', 'left'),
                        clicks=step.get('clicks', 1)
                    )

                elif action == 'move_to':
                    self.move_to(step.get('x'), step.get('y'), step.get('duration', 0.5))

                elif action == 'type':
                    self.type_text(step.get('text', ''))

                elif action == 'press':
                    self.press_key(
                        step.get('key'),
                        presses=step.get('presses', 1)
                    )

                elif action == 'hotkey':
                    self.hotkey(*step.get('keys', []))

                else:
                    print(f"    ⚠️  Unknown action: {action}")

            except Exception as e:
                print(f"    ❌ Error: {e}")
                self.results.append({
                    'action': action,
                    'error': str(e),
                    'timestamp': datetime.now().isoformat()
                })

        print(f"\n✓ Scenario '{scenario_name}' completed")

    def run_from_config(self):
        """Run automation from loaded configuration."""
        if not self.config:
            print("ERROR: No configuration loaded")
            return False

        scenarios = self.config.get('scenarios', [])
        if not scenarios:
            print("ERROR: No scenarios found in configuration")
            return False

        for scenario in scenarios:
            self.execute_scenario(scenario)

        return True

    def save_results(self, output_path):
        """Save automation results to JSON."""
        report = {
            'timestamp': datetime.now().isoformat(),
            'total_actions': len(self.results),
            'actions': self.results
        }

        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        with open(output_path, 'w') as f:
            json.dump(report, f, indent=2)

        print(f"\n✓ Automation results saved: {output_path}")


def create_sample_config(output_path):
    """Create a sample automation configuration file."""
    sample_config = {
        "app": {
            "name": "Career Explorer",
            "description": "Basic navigation automation"
        },
        "scenarios": [
            {
                "name": "Basic Navigation Test",
                "description": "Navigate through first few scenes",
                "steps": [
                    {
                        "action": "wait",
                        "seconds": 5,
                        "description": "Wait for app to load"
                    },
                    {
                        "action": "screenshot",
                        "name": "initial_screen"
                    },
                    {
                        "action": "click",
                        "x": 960,
                        "y": 540,
                        "description": "Click center of screen (start button)"
                    },
                    {
                        "action": "wait",
                        "seconds": 2
                    },
                    {
                        "action": "screenshot",
                        "name": "after_click"
                    },
                    {
                        "action": "press",
                        "key": "tab",
                        "presses": 3,
                        "description": "Tab through UI elements"
                    },
                    {
                        "action": "press",
                        "key": "enter"
                    },
                    {
                        "action": "wait",
                        "seconds": 2
                    },
                    {
                        "action": "screenshot",
                        "name": "next_screen"
                    }
                ]
            },
            {
                "name": "Keyboard Navigation Test",
                "description": "Test keyboard-only navigation",
                "steps": [
                    {
                        "action": "press",
                        "key": "tab",
                        "presses": 5
                    },
                    {
                        "action": "press",
                        "key": "enter"
                    },
                    {
                        "action": "wait",
                        "seconds": 1
                    },
                    {
                        "action": "press",
                        "key": "space"
                    }
                ]
            }
        ]
    }

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w') as f:
        json.dump(sample_config, f, indent=2)

    print(f"✓ Sample configuration created: {output_path}")
    return output_path


def main():
    """Main entry point for standalone execution."""
    import sys

    if not PYAUTOGUI_AVAILABLE:
        print("ERROR: pyautogui is required")
        print("Install with: pip install pyautogui")
        sys.exit(1)

    if len(sys.argv) < 2:
        print("Usage: python input_automation.py <config.json> [screenshots_dir]")
        print("   or: python input_automation.py --create-sample <output.json>")
        print("\nExample:")
        print("  python input_automation.py automation_config.json ./screenshots")
        sys.exit(1)

    if sys.argv[1] == '--create-sample':
        output_path = sys.argv[2] if len(sys.argv) > 2 else 'sample_automation_config.json'
        create_sample_config(output_path)
        sys.exit(0)

    config_path = sys.argv[1]
    screenshots_dir = sys.argv[2] if len(sys.argv) > 2 else './screenshots'

    automation = InputAutomation(config_path)
    automation.setup_screenshots(screenshots_dir)

    print("\n" + "="*60)
    print("INPUT AUTOMATION")
    print("="*60)
    print("\n⚠️  SAFETY: Move mouse to top-left corner to abort")
    print("Starting in 3 seconds...")
    time.sleep(3)

    automation.run_from_config()

    results_path = os.path.join(
        os.path.dirname(__file__), '..', 'reports', 'output', 'input_automation_report.json'
    )
    automation.save_results(results_path)


if __name__ == '__main__':
    main()
