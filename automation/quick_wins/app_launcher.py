"""
Quick Win 1: Application Launch & Monitoring Script
Launches Unity executable, monitors process health, and captures diagnostics.
"""

import subprocess
import psutil
import time
import json
import os
from datetime import datetime
from pathlib import Path


class AppLauncher:
    """Launches and monitors Unity zSpace applications."""

    def __init__(self, exe_path, timeout=60):
        """
        Initialize the app launcher.

        Args:
            exe_path: Path to the Unity executable
            timeout: Maximum time to wait for app to start (seconds)
        """
        self.exe_path = exe_path
        self.timeout = timeout
        self.process = None
        self.start_time = None
        self.metrics = {
            'launch_time': None,
            'peak_memory_mb': 0,
            'avg_cpu_percent': 0,
            'crash_detected': False,
            'errors': []
        }

    def launch(self):
        """Launch the Unity application."""
        print(f"Launching: {self.exe_path}")

        if not os.path.exists(self.exe_path):
            error = f"Executable not found: {self.exe_path}"
            print(f"ERROR: {error}")
            self.metrics['errors'].append(error)
            return False

        try:
            self.start_time = time.time()
            self.process = subprocess.Popen([self.exe_path])

            # Wait for process to start
            time.sleep(2)

            if self.process.poll() is not None:
                error = f"Process exited immediately with code {self.process.returncode}"
                print(f"ERROR: {error}")
                self.metrics['errors'].append(error)
                self.metrics['crash_detected'] = True
                return False

            self.metrics['launch_time'] = time.time() - self.start_time
            print(f"[OK] Application launched (PID: {self.process.pid})")
            print(f"  Launch time: {self.metrics['launch_time']:.2f}s")
            return True

        except Exception as e:
            error = f"Failed to launch application: {str(e)}"
            print(f"ERROR: {error}")
            self.metrics['errors'].append(error)
            return False

    def monitor(self, duration=30, interval=1):
        """
        Monitor the running application.

        Args:
            duration: How long to monitor (seconds)
            interval: Sampling interval (seconds)
        """
        if not self.process:
            print("ERROR: No process to monitor")
            return

        print(f"\nMonitoring application for {duration} seconds...")

        try:
            proc = psutil.Process(self.process.pid)
            cpu_samples = []

            for i in range(int(duration / interval)):
                # Check if process is still running
                if self.process.poll() is not None:
                    print(f"[ERROR] Process terminated unexpectedly (exit code: {self.process.returncode})")
                    self.metrics['crash_detected'] = True
                    break

                # Collect metrics
                try:
                    cpu_percent = proc.cpu_percent(interval=interval)
                    memory_info = proc.memory_info()
                    memory_mb = memory_info.rss / (1024 * 1024)

                    cpu_samples.append(cpu_percent)
                    self.metrics['peak_memory_mb'] = max(self.metrics['peak_memory_mb'], memory_mb)

                    if (i + 1) % 10 == 0:
                        print(f"  [{i+1}s] CPU: {cpu_percent:.1f}% | Memory: {memory_mb:.1f} MB")

                except psutil.NoSuchProcess:
                    print("[ERROR] Process no longer exists")
                    self.metrics['crash_detected'] = True
                    break

            if cpu_samples:
                self.metrics['avg_cpu_percent'] = sum(cpu_samples) / len(cpu_samples)

            print(f"\nMonitoring Summary:")
            print(f"  Peak Memory: {self.metrics['peak_memory_mb']:.1f} MB")
            print(f"  Avg CPU: {self.metrics['avg_cpu_percent']:.1f}%")
            print(f"  Crashed: {self.metrics['crash_detected']}")

        except Exception as e:
            error = f"Monitoring error: {str(e)}"
            print(f"ERROR: {error}")
            self.metrics['errors'].append(error)

    def terminate(self):
        """Gracefully terminate the application."""
        if self.process and self.process.poll() is None:
            print("\nTerminating application...")
            try:
                proc = psutil.Process(self.process.pid)
                proc.terminate()
                proc.wait(timeout=10)
                print("[OK] Application terminated gracefully")
            except psutil.TimeoutExpired:
                print("[WARNING] Timeout - forcing kill")
                proc.kill()
            except Exception as e:
                print(f"ERROR during termination: {e}")

    def get_metrics(self):
        """Return collected metrics."""
        return self.metrics

    def save_report(self, output_path):
        """Save monitoring report to JSON."""
        report = {
            'timestamp': datetime.now().isoformat(),
            'executable': self.exe_path,
            'metrics': self.metrics
        }

        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        with open(output_path, 'w') as f:
            json.dump(report, f, indent=2)

        print(f"\n[OK] Report saved: {output_path}")


def main():
    """Main entry point for standalone execution."""
    import sys

    if len(sys.argv) < 2:
        print("Usage: python app_launcher.py <path_to_exe> [monitor_duration]")
        print("Example: python app_launcher.py 'C:\\Program Files\\zSpace\\Career Explorer\\zSpaceCareerExplorer.exe' 30")
        sys.exit(1)

    exe_path = sys.argv[1]
    monitor_duration = int(sys.argv[2]) if len(sys.argv) > 2 else 30

    launcher = AppLauncher(exe_path)

    if launcher.launch():
        launcher.monitor(duration=monitor_duration)
        launcher.terminate()

    # Save report
    output_path = os.path.join(os.path.dirname(__file__), '..', 'reports', 'output', 'app_launch_report.json')
    launcher.save_report(output_path)

    # Return exit code based on success
    sys.exit(0 if not launcher.metrics['crash_detected'] and not launcher.metrics['errors'] else 1)


if __name__ == '__main__':
    main()
