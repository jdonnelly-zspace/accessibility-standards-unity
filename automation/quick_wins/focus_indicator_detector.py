"""
Quick Win 7: Focus Indicator Detector

Extends keyboard navigation testing to automatically detect and validate focus indicators.
Tests WCAG 2.4.7 Focus Visible (Level AA) by taking before/after screenshots during
Tab navigation and using image comparison to detect visual changes.

WCAG Requirements:
- Focus must be visible
- Focus indicator must have 3:1 contrast minimum
- Focus indicator must be at least 2px thick

Usage:
    python focus_indicator_detector.py [screenshots_dir]
    python focus_indicator_detector.py --interactive

Note: Application must be running and in focus for interactive mode
"""

import os
import sys
import json
import time
from datetime import datetime
from pathlib import Path

try:
    from PIL import Image
    import numpy as np
    import cv2
    OPENCV_AVAILABLE = True
except ImportError:
    print("[ERROR] OpenCV required. Install with: pip install opencv-python")
    OPENCV_AVAILABLE = False
    sys.exit(1)

try:
    import pyautogui
    PYAUTOGUI_AVAILABLE = True
    pyautogui.FAILSAFE = True  # Move mouse to corner to abort
    pyautogui.PAUSE = 0.3
except ImportError:
    print("[ERROR] PyAutoGUI required. Install with: pip install pyautogui")
    PYAUTOGUI_AVAILABLE = False
    sys.exit(1)

# Import color contrast analyzer for reuse
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from color_contrast_analyzer import ColorContrastAnalyzer


class FocusIndicatorDetector:
    """Detects and validates focus indicators using image comparison"""

    def __init__(self, screenshots_dir=None):
        self.screenshots_dir = screenshots_dir or './screenshots/focus_test'
        self.test_results = []
        self.passed_tests = 0
        self.failed_tests = 0

        # Create screenshots directory
        os.makedirs(self.screenshots_dir, exist_ok=True)

        # Initialize contrast analyzer
        self.contrast_analyzer = ColorContrastAnalyzer()

    def capture_screenshot(self, filename):
        """Capture screenshot and return path"""
        try:
            filepath = os.path.join(self.screenshots_dir, filename)
            screenshot = pyautogui.screenshot()
            screenshot.save(filepath)
            return filepath
        except Exception as e:
            print(f"[ERROR] Failed to capture screenshot: {e}")
            return None

    def compare_images(self, img1_path, img2_path, threshold=30):
        """
        Compare two images and detect differences
        Returns dict with changed regions
        """
        try:
            # Load images
            img1 = cv2.imread(img1_path)
            img2 = cv2.imread(img2_path)

            if img1 is None or img2 is None:
                print(f"[ERROR] Failed to load images for comparison")
                return None

            # Ensure same size
            if img1.shape != img2.shape:
                print(f"[WARNING] Images have different sizes, resizing")
                img2 = cv2.resize(img2, (img1.shape[1], img1.shape[0]))

            # Convert to grayscale
            gray1 = cv2.cvtColor(img1, cv2.COLOR_BGR2GRAY)
            gray2 = cv2.cvtColor(img2, cv2.COLOR_BGR2GRAY)

            # Compute absolute difference
            diff = cv2.absdiff(gray1, gray2)

            # Threshold the difference
            _, thresh = cv2.threshold(diff, threshold, 255, cv2.THRESH_BINARY)

            # Find contours (changed regions)
            contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

            # Filter small contours (noise)
            min_area = 100  # Minimum area for a focus indicator
            significant_contours = [c for c in contours if cv2.contourArea(c) > min_area]

            if len(significant_contours) == 0:
                return {
                    'has_changes': False,
                    'changed_regions': [],
                    'diff_image': thresh
                }

            # Get bounding rectangles for changed regions
            changed_regions = []
            for contour in significant_contours:
                x, y, w, h = cv2.boundingRect(contour)
                changed_regions.append({
                    'x': int(x),
                    'y': int(y),
                    'w': int(w),
                    'h': int(h),
                    'area': int(cv2.contourArea(contour))
                })

            # Sort by area (largest first)
            changed_regions.sort(key=lambda r: r['area'], reverse=True)

            return {
                'has_changes': True,
                'changed_regions': changed_regions,
                'diff_image': thresh,
                'total_changes': len(changed_regions)
            }

        except Exception as e:
            print(f"[ERROR] Image comparison failed: {e}")
            return None

    def measure_indicator_properties(self, img_path, region):
        """
        Measure focus indicator properties:
        - Contrast ratio
        - Border thickness
        - Color
        """
        try:
            img = cv2.imread(img_path)
            if img is None:
                return None

            x, y, w, h = region['x'], region['y'], region['w'], region['h']

            # Extract region of interest (ROI)
            roi = img[y:y+h, x:x+w]

            # Get indicator color (edge pixels)
            edge_pixels = self.extract_edge_pixels(roi)
            if len(edge_pixels) > 0:
                indicator_color = tuple(np.median(edge_pixels, axis=0).astype(int).tolist())
            else:
                # Fallback to average color
                indicator_color = tuple(np.mean(roi, axis=(0, 1)).astype(int).tolist())

            # Get background color (surrounding area)
            bg_color = self.get_surrounding_color(img, x + w//2, y + h//2, radius=max(w, h)//2 + 20)

            # Calculate contrast ratio
            contrast_ratio = self.contrast_analyzer.calculate_contrast_ratio(
                indicator_color[::-1],  # BGR to RGB
                bg_color[::-1] if bg_color else (128, 128, 128)
            )

            # Estimate border thickness
            thickness = self.estimate_border_thickness(roi)

            return {
                'indicator_color': self.bgr_to_hex(indicator_color),
                'background_color': self.bgr_to_hex(bg_color) if bg_color else '#808080',
                'contrast_ratio': round(contrast_ratio, 2),
                'thickness_px': thickness,
                'passes_contrast': contrast_ratio >= 3.0,
                'passes_thickness': thickness >= 2
            }

        except Exception as e:
            print(f"[WARNING] Failed to measure indicator properties: {e}")
            return None

    def extract_edge_pixels(self, img):
        """Extract edge pixels from image (likely border)"""
        try:
            # Convert to grayscale
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

            # Detect edges
            edges = cv2.Canny(gray, 50, 150)

            # Get coordinates of edge pixels
            edge_coords = np.where(edges > 0)

            # Get colors at edge pixels
            edge_pixels = img[edge_coords[0], edge_coords[1]]

            return edge_pixels

        except Exception as e:
            return []

    def get_surrounding_color(self, img, x, y, radius=20):
        """Get average color of surrounding area"""
        try:
            h, w = img.shape[:2]

            y1 = max(0, int(y - radius))
            y2 = min(h, int(y + radius))
            x1 = max(0, int(x - radius))
            x2 = min(w, int(x + radius))

            region = img[y1:y2, x1:x2]
            avg_color = np.mean(region, axis=(0, 1))

            return tuple(avg_color.astype(int).tolist())

        except Exception as e:
            return None

    def estimate_border_thickness(self, img):
        """Estimate border thickness in pixels"""
        try:
            # Convert to grayscale
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

            # Detect edges
            edges = cv2.Canny(gray, 50, 150)

            # Dilate to connect edge pixels
            kernel = np.ones((3, 3), np.uint8)
            dilated = cv2.dilate(edges, kernel, iterations=1)

            # Find contours
            contours, _ = cv2.findContours(dilated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

            if len(contours) == 0:
                return 1  # Default minimum

            # Measure thickness as the minimum distance between contour and center
            # This is a rough approximation
            thickness_samples = []
            for contour in contours:
                x, y, w, h = cv2.boundingRect(contour)
                # Sample thickness at edges
                thickness_samples.append(min(w, h) / 4)  # Rough estimate

            if thickness_samples:
                return int(np.median(thickness_samples))
            else:
                return 2  # Default

        except Exception as e:
            return 2  # Default

    def bgr_to_hex(self, bgr):
        """Convert BGR tuple to hex color string"""
        if bgr is None:
            return '#000000'
        return '#{:02x}{:02x}{:02x}'.format(int(bgr[2]), int(bgr[1]), int(bgr[0]))

    def test_focus_visibility(self, element_count=10, delay=0.5):
        """
        Test focus visibility by pressing Tab and comparing screenshots
        """
        print(f"\n{'='*70}")
        print("QUICK WIN 7: Focus Indicator Detector")
        print(f"{'='*70}\n")

        print(f"Testing focus visibility with {element_count} Tab presses...")
        print("SAFETY: Move mouse to top-left corner to abort!\n")
        time.sleep(2)  # Give user time to focus application

        for i in range(element_count):
            print(f"[{i+1}/{element_count}] Testing element...")

            # Capture before Tab
            before_path = self.capture_screenshot(f'focus_test_{i+1:02d}_before.png')
            if not before_path:
                continue

            # Press Tab
            pyautogui.press('tab')
            time.sleep(delay)

            # Capture after Tab
            after_path = self.capture_screenshot(f'focus_test_{i+1:02d}_after.png')
            if not after_path:
                continue

            # Compare images
            diff_result = self.compare_images(before_path, after_path)

            if not diff_result:
                print(f"  [ERROR] Comparison failed")
                continue

            # Analyze results
            test = {
                'element_index': i + 1,
                'screenshot_before': os.path.basename(before_path),
                'screenshot_after': os.path.basename(after_path),
                'has_focus_indicator': diff_result['has_changes'],
                'wcag_criterion': '2.4.7',
                'timestamp': datetime.now().isoformat()
            }

            if diff_result['has_changes']:
                # Found changes - measure properties
                largest_change = diff_result['changed_regions'][0]

                properties = self.measure_indicator_properties(after_path, largest_change)

                if properties:
                    test.update(properties)
                    test['location'] = largest_change
                    test['wcag_compliant'] = properties['passes_contrast'] and properties['passes_thickness']

                    if test['wcag_compliant']:
                        print(f"  [OK] Focus indicator detected (contrast: {properties['contrast_ratio']}:1, thickness: {properties['thickness_px']}px)")
                        self.passed_tests += 1
                    else:
                        issues = []
                        if not properties['passes_contrast']:
                            issues.append(f"low contrast ({properties['contrast_ratio']}:1 < 3:1)")
                        if not properties['passes_thickness']:
                            issues.append(f"too thin ({properties['thickness_px']}px < 2px)")

                        print(f"  [FAIL] Focus indicator issues: {', '.join(issues)}")
                        test['issues'] = issues
                        self.failed_tests += 1
                else:
                    test['wcag_compliant'] = False
                    test['issue'] = 'Could not measure indicator properties'
                    print(f"  [WARNING] Could not measure focus indicator properties")
                    self.failed_tests += 1

            else:
                # No changes detected
                test['wcag_compliant'] = False
                test['issue'] = 'No visible focus indicator detected'
                print(f"  [FAIL] No visible focus indicator")
                self.failed_tests += 1

            self.test_results.append(test)

        return True

    def get_summary(self):
        """Get test summary"""
        total = len(self.test_results)

        return {
            'timestamp': datetime.now().isoformat(),
            'wcag_criterion': '2.4.7 Focus Visible (Level AA)',
            'elements_tested': total,
            'with_indicators': self.passed_tests,
            'without_indicators': self.failed_tests,
            'compliance_rate': (self.passed_tests / total * 100) if total > 0 else 0,
            'wcag_compliant': self.failed_tests == 0
        }

    def save_report(self, output_path):
        """Save focus indicator report to JSON"""
        report = {
            'timestamp': datetime.now().isoformat(),
            'wcag_criterion': '2.4.7 Focus Visible (Level AA)',
            'summary': self.get_summary(),
            'results': self.test_results,
            'screenshots_dir': os.path.abspath(self.screenshots_dir)
        }

        # Ensure output directory exists
        output_dir = os.path.dirname(output_path)
        if output_dir:
            os.makedirs(output_dir, exist_ok=True)

        with open(output_path, 'w') as f:
            json.dump(report, f, indent=2)

        print(f"\n[OK] Focus indicator report saved: {output_path}")

    def print_summary(self):
        """Print summary to console"""
        summary = self.get_summary()

        print(f"\n{'='*70}")
        print("FOCUS INDICATOR TEST SUMMARY")
        print(f"{'='*70}\n")

        print(f"WCAG Criterion: {summary['wcag_criterion']}")
        print(f"Elements Tested: {summary['elements_tested']}")
        print(f"With Indicators: {summary['with_indicators']}")
        print(f"Without Indicators: {summary['without_indicators']}")
        print(f"Compliance Rate: {summary['compliance_rate']:.1f}%")
        print(f"WCAG Compliant: {'Yes' if summary['wcag_compliant'] else 'No'}")
        print(f"Screenshots: {os.path.abspath(self.screenshots_dir)}")
        print(f"{'='*70}\n")


def main():
    """Main entry point"""
    screenshots_dir = None
    element_count = 10

    if len(sys.argv) > 1:
        if sys.argv[1] == '--interactive':
            screenshots_dir = './screenshots/focus_test'
        else:
            screenshots_dir = sys.argv[1]

    if len(sys.argv) > 2:
        try:
            element_count = int(sys.argv[2])
        except:
            print(f"[WARNING] Invalid element count, using default ({element_count})")

    # Create detector
    detector = FocusIndicatorDetector(screenshots_dir)

    # Run interactive test
    print("Focus Indicator Detector - WCAG 2.4.7 Testing")
    print("=" * 70)
    print("\nIMPORTANT:")
    print("1. Make sure your application is running and in focus")
    print("2. Position your window so interactive elements are visible")
    print("3. Move mouse to top-left corner to abort")
    print("\nPress Enter to start testing...")
    input()

    # Run test
    detector.test_focus_visibility(element_count=element_count)

    # Set default output path
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(script_dir, '..', 'reports', 'output', 'qw7_focus_indicators.json')
    output_path = os.path.abspath(output_path)

    # Save report
    detector.save_report(output_path)
    detector.print_summary()

    # Exit with appropriate code
    summary = detector.get_summary()
    sys.exit(0 if summary['wcag_compliant'] else 1)


if __name__ == '__main__':
    main()
