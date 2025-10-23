"""
Quick Win 2: Log File Scene Analyzer
Parses Unity Player.log to extract scene transitions, errors, and performance metrics.
"""

import re
import json
import os
from datetime import datetime
from pathlib import Path
from collections import defaultdict


class LogAnalyzer:
    """Analyzes Unity Player.log files for scenes, errors, and performance."""

    def __init__(self, log_path):
        """
        Initialize the log analyzer.

        Args:
            log_path: Path to Unity Player.log file
        """
        self.log_path = log_path
        self.scenes = []
        self.errors = []
        self.warnings = []
        self.exceptions = []
        self.scene_transitions = []
        self.load_times = {}
        self.unity_version = None

    def parse(self):
        """Parse the log file and extract all relevant information."""
        print(f"Parsing log file: {self.log_path}")

        if not os.path.exists(self.log_path):
            print(f"ERROR: Log file not found: {self.log_path}")
            return False

        try:
            with open(self.log_path, 'r', encoding='utf-8', errors='ignore') as f:
                lines = f.readlines()

            self._extract_unity_version(lines)
            self._extract_scenes(lines)
            self._extract_errors(lines)
            self._extract_warnings(lines)
            self._extract_exceptions(lines)
            self._analyze_scene_transitions()

            print(f"\n[OK] Log Analysis Complete:")
            print(f"  Unity Version: {self.unity_version}")
            print(f"  Scenes Found: {len(self.scenes)}")
            print(f"  Scene Transitions: {len(self.scene_transitions)}")
            print(f"  Errors: {len(self.errors)}")
            print(f"  Warnings: {len(self.warnings)}")
            print(f"  Exceptions: {len(self.exceptions)}")

            return True

        except Exception as e:
            print(f"ERROR parsing log: {e}")
            return False

    def _extract_unity_version(self, lines):
        """Extract Unity version from log."""
        for line in lines[:50]:  # Check first 50 lines
            match = re.search(r'Initialize engine version: (.+)', line)
            if match:
                self.unity_version = match.group(1).strip()
                break

    def _extract_scenes(self, lines):
        """Extract scene loading events."""
        scene_patterns = [
            r'Loading scene (.+?) in',
            r'Loaded scene (.+)',
            r'Opening scene (.+)',
            r'level(\d+)',  # Pattern for levelN files
        ]

        for i, line in enumerate(lines):
            for pattern in scene_patterns:
                match = re.search(pattern, line, re.IGNORECASE)
                if match:
                    scene_name = match.group(1).strip()
                    self.scenes.append({
                        'name': scene_name,
                        'line': i + 1,
                        'timestamp': self._extract_timestamp(line)
                    })
                    break

    def _extract_errors(self, lines):
        """Extract error messages."""
        for i, line in enumerate(lines):
            if re.search(r'\bError\b|\bERROR\b', line) and not line.strip().startswith('#'):
                self.errors.append({
                    'message': line.strip(),
                    'line': i + 1
                })

    def _extract_warnings(self, lines):
        """Extract warning messages."""
        for i, line in enumerate(lines):
            if re.search(r'\bWarning\b|\bWARNING\b', line) and not line.strip().startswith('#'):
                self.warnings.append({
                    'message': line.strip(),
                    'line': i + 1
                })

    def _extract_exceptions(self, lines):
        """Extract exception messages."""
        for i, line in enumerate(lines):
            if 'Exception' in line or 'exception' in line:
                # Get context (next 3 lines)
                context = ''.join(lines[i:min(i+4, len(lines))])
                self.exceptions.append({
                    'message': line.strip(),
                    'context': context,
                    'line': i + 1
                })

    def _extract_timestamp(self, line):
        """Extract timestamp from log line if present."""
        # Try to match timestamp pattern (adjust based on actual log format)
        match = re.search(r'(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})', line)
        return match.group(1) if match else None

    def _analyze_scene_transitions(self):
        """Analyze scene transition patterns."""
        if len(self.scenes) < 2:
            return

        for i in range(len(self.scenes) - 1):
            from_scene = self.scenes[i]['name']
            to_scene = self.scenes[i + 1]['name']
            self.scene_transitions.append({
                'from': from_scene,
                'to': to_scene,
                'index': i
            })

    def get_scene_flow(self):
        """Return a human-readable scene flow diagram."""
        if not self.scene_transitions:
            return "No scene transitions detected"

        flow = "Scene Flow:\n"
        for i, transition in enumerate(self.scene_transitions):
            flow += f"  {i+1}. {transition['from']} → {transition['to']}\n"
        return flow

    def get_critical_issues(self):
        """Return list of critical issues that need attention."""
        critical = []

        # Critical errors
        for error in self.errors[:10]:  # Top 10 errors
            critical.append({
                'type': 'Error',
                'severity': 'High',
                'message': error['message'][:200],  # Truncate long messages
                'line': error['line']
            })

        # Exceptions are always critical
        for exc in self.exceptions[:5]:  # Top 5 exceptions
            critical.append({
                'type': 'Exception',
                'severity': 'Critical',
                'message': exc['message'][:200],
                'line': exc['line']
            })

        return critical

    def get_summary(self):
        """Return a summary of the analysis."""
        return {
            'unity_version': self.unity_version,
            'total_scenes': len(self.scenes),
            'unique_scenes': len(set(s['name'] for s in self.scenes)),
            'scene_transitions': len(self.scene_transitions),
            'errors': len(self.errors),
            'warnings': len(self.warnings),
            'exceptions': len(self.exceptions),
            'critical_issues': len(self.get_critical_issues())
        }

    def save_report(self, output_path):
        """Save analysis report to JSON."""
        report = {
            'timestamp': datetime.now().isoformat(),
            'log_file': self.log_path,
            'summary': self.get_summary(),
            'scenes': self.scenes,
            'scene_transitions': self.scene_transitions,
            'errors': self.errors,
            'warnings': self.warnings,
            'exceptions': self.exceptions,
            'critical_issues': self.get_critical_issues(),
            'scene_flow': self.get_scene_flow()
        }

        # Ensure output directory exists
        output_dir = os.path.dirname(output_path)
        if output_dir:  # Only create if dirname is not empty
            os.makedirs(output_dir, exist_ok=True)

        with open(output_path, 'w') as f:
            json.dump(report, f, indent=2)

        print(f"\n[OK] Log analysis report saved: {output_path}")

    def print_summary(self):
        """Print a human-readable summary to console."""
        print("\n" + "="*60)
        print("LOG ANALYSIS SUMMARY")
        print("="*60)

        summary = self.get_summary()
        print(f"\nUnity Version: {summary['unity_version']}")
        print(f"Total Scenes: {summary['total_scenes']}")
        print(f"Unique Scenes: {summary['unique_scenes']}")
        print(f"Scene Transitions: {summary['scene_transitions']}")
        print(f"Errors: {summary['errors']}")
        print(f"Warnings: {summary['warnings']}")
        print(f"Exceptions: {summary['exceptions']}")

        if self.scene_transitions:
            print(f"\n{self.get_scene_flow()}")

        critical = self.get_critical_issues()
        if critical:
            print(f"\nCritical Issues ({len(critical)}):")
            for i, issue in enumerate(critical[:5], 1):
                print(f"  {i}. [{issue['severity']}] {issue['type']} (line {issue['line']})")
                print(f"     {issue['message'][:100]}")

        print("="*60)


def find_unity_log(app_name=None):
    """
    Find Unity Player.log for an application.

    Args:
        app_name: Name of the Unity application (optional)

    Returns:
        Path to log file or None
    """
    # Common Unity log locations on Windows
    appdata_low = os.path.join(os.environ.get('USERPROFILE', ''), 'AppData', 'LocalLow')

    if app_name:
        # Try to find log for specific app
        for root, dirs, files in os.walk(appdata_low):
            if app_name.lower() in root.lower() and 'Player.log' in files:
                return os.path.join(root, 'Player.log')

    # Try to find any Player.log
    for root, dirs, files in os.walk(appdata_low):
        if 'Player.log' in files:
            return os.path.join(root, 'Player.log')

    return None


def main():
    """Main entry point for standalone execution."""
    import sys

    if len(sys.argv) < 2:
        print("Usage: python log_analyzer.py <path_to_log> [output_path]")
        print("   or: python log_analyzer.py --find <app_name>")
        print("\nExample:")
        print("  python log_analyzer.py 'C:\\Users\\Jill\\AppData\\LocalLow\\zSpace\\Career Explorer\\Player.log'")
        print("  python log_analyzer.py --find 'Career Explorer'")
        sys.exit(1)

    if sys.argv[1] == '--find':
        app_name = sys.argv[2] if len(sys.argv) > 2 else None
        log_path = find_unity_log(app_name)
        if log_path:
            print(f"Found log: {log_path}")
        else:
            print("No Unity log found")
            sys.exit(1)
        # For --find mode, output path is 3rd arg (if provided)
        output_path = sys.argv[3] if len(sys.argv) > 3 else None
    else:
        log_path = sys.argv[1]
        # For normal mode, output path is 2nd arg (if provided)
        output_path = sys.argv[2] if len(sys.argv) > 2 else None

    # Set default output path if not provided
    if not output_path:
        script_dir = os.path.dirname(os.path.abspath(__file__))
        output_path = os.path.join(script_dir, '..', 'reports', 'output', 'log_analysis_report.json')
        output_path = os.path.abspath(output_path)  # Normalize path

    analyzer = LogAnalyzer(log_path)
    if analyzer.parse():
        analyzer.print_summary()
        analyzer.save_report(output_path)
        sys.exit(0)
    else:
        sys.exit(1)


if __name__ == '__main__':
    main()
