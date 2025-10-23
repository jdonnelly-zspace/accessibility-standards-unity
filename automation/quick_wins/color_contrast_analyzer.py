"""
Quick Win 6: Automated Color Contrast Analyzer

Analyzes screenshots to detect color contrast issues per WCAG 2.1 Level AA.
Tests both text contrast (1.4.3) and UI component contrast (1.4.11).

WCAG Requirements:
- Normal text: 4.5:1 minimum
- Large text (18pt+ or 14pt+ bold): 3:1 minimum
- UI components and graphics: 3:1 minimum

Usage:
    python color_contrast_analyzer.py <screenshot_dir> [output_path]
    python color_contrast_analyzer.py --screenshot <single_screenshot> [output_path]
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
    print("[WARNING] OpenCV not available. Limited functionality.")
    OPENCV_AVAILABLE = False

try:
    import pytesseract
    TESSERACT_AVAILABLE = True
except ImportError:
    print("[WARNING] pytesseract not available. Text detection will be limited.")
    TESSERACT_AVAILABLE = False

try:
    from colorthief import ColorThief
    COLORTHIEF_AVAILABLE = True
except ImportError:
    print("[WARNING] colorthief not available. Color extraction will use basic sampling.")
    COLORTHIEF_AVAILABLE = False


class ColorContrastAnalyzer:
    """Analyzes screenshots for WCAG color contrast compliance"""

    def __init__(self, screenshot_dir=None):
        self.screenshot_dir = screenshot_dir
        self.screenshots = []
        self.contrast_results = []
        self.text_regions = []
        self.ui_components = []

        if screenshot_dir and os.path.exists(screenshot_dir):
            self.load_screenshots(screenshot_dir)

    def load_screenshots(self, directory):
        """Load all image files from directory"""
        print(f"Loading screenshots from: {directory}")

        valid_extensions = ('.png', '.jpg', '.jpeg', '.bmp')
        for file in os.listdir(directory):
            if file.lower().endswith(valid_extensions):
                full_path = os.path.join(directory, file)
                self.screenshots.append(full_path)

        print(f"[OK] Loaded {len(self.screenshots)} screenshots")

    def analyze_screenshot(self, image_path):
        """Analyze single screenshot for contrast issues"""
        print(f"\nAnalyzing: {os.path.basename(image_path)}")

        if not os.path.exists(image_path):
            print(f"[ERROR] File not found: {image_path}")
            return None

        try:
            img = Image.open(image_path)
            result = {
                'screenshot': os.path.basename(image_path),
                'path': image_path,
                'timestamp': datetime.now().isoformat(),
                'issues': [],
                'passed': [],
                'summary': {}
            }

            # Method 1: Detect text regions using OCR (if available)
            text_regions = []
            if TESSERACT_AVAILABLE:
                text_regions = self.detect_text_regions_ocr(img)
                result['text_regions_found'] = len(text_regions)

                for region in text_regions:
                    contrast_check = self.check_text_contrast(img, region)
                    if contrast_check:
                        if contrast_check['passes']:
                            result['passed'].append(contrast_check)
                        else:
                            result['issues'].append(contrast_check)

            # Method 2: Sample dominant colors (fallback or additional check)
            # Use this if Tesseract not available OR if no text regions found
            if not TESSERACT_AVAILABLE or len(text_regions) == 0:
                if not TESSERACT_AVAILABLE:
                    print("  [INFO] Using color sampling method (Tesseract not available)")
                else:
                    print("  [INFO] Using color sampling method (no text detected)")

                color_pairs = self.sample_color_pairs(img)
                for pair in color_pairs:
                    contrast_check = self.check_color_pair_contrast(pair)
                    if contrast_check:
                        if contrast_check['passes']:
                            result['passed'].append(contrast_check)
                        else:
                            result['issues'].append(contrast_check)

            # Calculate summary
            total_checks = len(result['issues']) + len(result['passed'])
            result['summary'] = {
                'total_checks': total_checks,
                'passed': len(result['passed']),
                'failed': len(result['issues']),
                'pass_rate': (len(result['passed']) / total_checks * 100) if total_checks > 0 else 0,
                'wcag_compliant': len(result['issues']) == 0
            }

            print(f"  Total checks: {total_checks}")
            print(f"  Passed: {result['summary']['passed']}")
            print(f"  Failed: {result['summary']['failed']}")
            print(f"  Pass rate: {result['summary']['pass_rate']:.1f}%")

            self.contrast_results.append(result)
            return result

        except Exception as e:
            print(f"[ERROR] Failed to analyze {image_path}: {e}")
            return None

    def detect_text_regions_ocr(self, img):
        """Detect text regions using Tesseract OCR"""
        if not TESSERACT_AVAILABLE:
            return []

        try:
            # Get text bounding boxes from Tesseract
            data = pytesseract.image_to_data(img, output_type=pytesseract.Output.DICT)

            regions = []
            for i in range(len(data['text'])):
                text = data['text'][i].strip()
                if text and data['conf'][i] > 30:  # Confidence threshold
                    regions.append({
                        'text': text,
                        'x': data['left'][i],
                        'y': data['top'][i],
                        'w': data['width'][i],
                        'h': data['height'][i],
                        'conf': data['conf'][i]
                    })

            return regions

        except Exception as e:
            print(f"  [WARNING] OCR failed: {e}")
            return []

    def sample_color_pairs(self, img, num_samples=10):
        """Sample color pairs from image for contrast analysis"""
        width, height = img.size
        np_img = np.array(img)

        pairs = []

        # Sample from different regions of the image
        for i in range(num_samples):
            # Random sampling
            x = np.random.randint(width * 0.1, width * 0.9)
            y = np.random.randint(height * 0.1, height * 0.9)

            # Get foreground color (center pixel)
            fg_color = self.get_pixel_color(np_img, x, y)

            # Get background color (surrounding area average)
            bg_color = self.get_surrounding_color(np_img, x, y, radius=10)

            if fg_color and bg_color:
                pairs.append({
                    'fg_color': fg_color,
                    'bg_color': bg_color,
                    'location': {'x': int(x), 'y': int(y)},
                    'sample_type': 'random'
                })

        return pairs

    def get_pixel_color(self, img_array, x, y):
        """Get RGB color at pixel location"""
        try:
            if len(img_array.shape) == 3:  # Color image
                return tuple(img_array[int(y), int(x), :3].tolist())
            else:  # Grayscale
                val = img_array[int(y), int(x)]
                return (val, val, val)
        except:
            return None

    def get_surrounding_color(self, img_array, x, y, radius=10):
        """Get average color of surrounding area"""
        try:
            y1 = max(0, int(y - radius))
            y2 = min(img_array.shape[0], int(y + radius))
            x1 = max(0, int(x - radius))
            x2 = min(img_array.shape[1], int(x + radius))

            region = img_array[y1:y2, x1:x2]

            if len(region.shape) == 3:
                avg_color = np.mean(region, axis=(0, 1))
                return tuple(avg_color[:3].astype(int).tolist())
            else:
                avg_val = int(np.mean(region))
                return (avg_val, avg_val, avg_val)
        except:
            return None

    def check_text_contrast(self, img, region):
        """Check contrast for a detected text region"""
        try:
            np_img = np.array(img)

            # Get text color (sample from region)
            cx = region['x'] + region['w'] // 2
            cy = region['y'] + region['h'] // 2
            fg_color = self.get_pixel_color(np_img, cx, cy)

            # Get background color (surrounding area)
            bg_color = self.get_surrounding_color(np_img, cx, cy, radius=region['h'] // 2 + 5)

            if not fg_color or not bg_color:
                return None

            # Calculate contrast ratio
            ratio = self.calculate_contrast_ratio(fg_color, bg_color)

            # Estimate if large text (based on height)
            estimated_font_size = self.estimate_font_size(region['h'])
            is_large_text = estimated_font_size >= 18 or estimated_font_size >= 14  # Assume bold for now

            required_ratio = 3.0 if is_large_text else 4.5
            passes = ratio >= required_ratio

            return {
                'type': 'text',
                'text': region.get('text', ''),
                'location': {'x': region['x'], 'y': region['y'], 'w': region['w'], 'h': region['h']},
                'fg_color': self.rgb_to_hex(fg_color),
                'bg_color': self.rgb_to_hex(bg_color),
                'ratio': round(ratio, 2),
                'required': required_ratio,
                'passes': passes,
                'estimated_font_size': estimated_font_size,
                'is_large_text': is_large_text,
                'wcag_criterion': '1.4.3',
                'severity': 'HIGH' if not passes else 'PASS'
            }

        except Exception as e:
            print(f"  [WARNING] Failed to check text contrast: {e}")
            return None

    def check_color_pair_contrast(self, pair):
        """Check contrast for a color pair"""
        try:
            fg_color = pair['fg_color']
            bg_color = pair['bg_color']

            # Calculate contrast ratio
            ratio = self.calculate_contrast_ratio(fg_color, bg_color)

            # For UI components, use 3:1 minimum
            required_ratio = 3.0
            passes = ratio >= required_ratio

            return {
                'type': 'color_sample',
                'location': pair.get('location', {}),
                'fg_color': self.rgb_to_hex(fg_color),
                'bg_color': self.rgb_to_hex(bg_color),
                'ratio': round(ratio, 2),
                'required': required_ratio,
                'passes': passes,
                'wcag_criterion': '1.4.11',
                'severity': 'MEDIUM' if not passes else 'PASS'
            }

        except Exception as e:
            print(f"  [WARNING] Failed to check color pair: {e}")
            return None

    def calculate_contrast_ratio(self, color1, color2):
        """Calculate WCAG contrast ratio between two RGB colors"""
        l1 = self.relative_luminance(color1)
        l2 = self.relative_luminance(color2)

        lighter = max(l1, l2)
        darker = min(l1, l2)

        ratio = (lighter + 0.05) / (darker + 0.05)
        return ratio

    def relative_luminance(self, rgb):
        """Calculate relative luminance per WCAG formula"""
        # Normalize RGB values
        r, g, b = [x / 255.0 for x in rgb[:3]]

        # Linearize RGB values
        r = r / 12.92 if r <= 0.03928 else ((r + 0.055) / 1.055) ** 2.4
        g = g / 12.92 if g <= 0.03928 else ((g + 0.055) / 1.055) ** 2.4
        b = b / 12.92 if b <= 0.03928 else ((b + 0.055) / 1.055) ** 2.4

        # Calculate luminance
        luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
        return luminance

    def estimate_font_size(self, height_px):
        """Estimate font size in points from pixel height"""
        # Rough estimation: 1pt ≈ 1.33px
        # height_px is the bounding box height
        estimated_pt = height_px * 0.75
        return estimated_pt

    def rgb_to_hex(self, rgb):
        """Convert RGB tuple to hex color string"""
        return '#{:02x}{:02x}{:02x}'.format(int(rgb[0]), int(rgb[1]), int(rgb[2]))

    def analyze_all_screenshots(self):
        """Analyze all loaded screenshots"""
        print(f"\n{'='*70}")
        print("QUICK WIN 6: Automated Color Contrast Analyzer")
        print(f"{'='*70}")

        if not self.screenshots:
            print("[ERROR] No screenshots to analyze")
            return False

        print(f"Analyzing {len(self.screenshots)} screenshots...\n")

        for screenshot in self.screenshots:
            self.analyze_screenshot(screenshot)

        return True

    def get_summary(self):
        """Get overall summary of all analyses"""
        if not self.contrast_results:
            return {
                'screenshots_analyzed': 0,
                'total_checks': 0,
                'total_passed': 0,
                'total_failed': 0,
                'overall_pass_rate': 0,
                'wcag_compliant': False
            }

        total_checks = sum(r['summary']['total_checks'] for r in self.contrast_results)
        total_passed = sum(r['summary']['passed'] for r in self.contrast_results)
        total_failed = sum(r['summary']['failed'] for r in self.contrast_results)

        return {
            'screenshots_analyzed': len(self.contrast_results),
            'total_checks': total_checks,
            'total_passed': total_passed,
            'total_failed': total_failed,
            'overall_pass_rate': (total_passed / total_checks * 100) if total_checks > 0 else 0,
            'wcag_compliant': total_failed == 0
        }

    def save_report(self, output_path):
        """Save analysis report to JSON file"""
        report = {
            'timestamp': datetime.now().isoformat(),
            'wcag_criteria': ['1.4.3 Contrast (Minimum)', '1.4.11 Non-text Contrast'],
            'summary': self.get_summary(),
            'results': self.contrast_results,
            'configuration': {
                'tesseract_available': TESSERACT_AVAILABLE,
                'opencv_available': OPENCV_AVAILABLE,
                'colorthief_available': COLORTHIEF_AVAILABLE
            }
        }

        # Ensure output directory exists
        output_dir = os.path.dirname(output_path)
        if output_dir:
            os.makedirs(output_dir, exist_ok=True)

        with open(output_path, 'w') as f:
            json.dump(report, f, indent=2)

        print(f"\n[OK] Color contrast report saved: {output_path}")

    def print_summary(self):
        """Print summary to console"""
        summary = self.get_summary()

        print(f"\n{'='*70}")
        print("COLOR CONTRAST ANALYSIS SUMMARY")
        print(f"{'='*70}\n")

        print(f"Screenshots Analyzed: {summary['screenshots_analyzed']}")
        print(f"Total Checks: {summary['total_checks']}")
        print(f"Passed: {summary['total_passed']}")
        print(f"Failed: {summary['total_failed']}")
        print(f"Pass Rate: {summary['overall_pass_rate']:.1f}%")
        print(f"WCAG Compliant: {'Yes' if summary['wcag_compliant'] else 'No'}")
        print(f"{'='*70}\n")


def capture_screenshot(window_title=None):
    """Capture screenshot of entire screen or specific window"""
    try:
        import pyautogui
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"screenshot_{timestamp}.png"

        screenshot = pyautogui.screenshot()
        screenshot.save(filename)

        print(f"[OK] Screenshot captured: {filename}")
        return filename

    except Exception as e:
        print(f"[ERROR] Failed to capture screenshot: {e}")
        return None


def main():
    """Main entry point"""
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python color_contrast_analyzer.py <screenshot_dir> [output_path]")
        print("  python color_contrast_analyzer.py --screenshot <image_path> [output_path]")
        print("  python color_contrast_analyzer.py --capture [output_path]")
        sys.exit(1)

    # Parse arguments
    if sys.argv[1] == '--screenshot':
        if len(sys.argv) < 3:
            print("[ERROR] Please provide screenshot path")
            sys.exit(1)

        screenshot_path = sys.argv[2]
        output_path = sys.argv[3] if len(sys.argv) > 3 else None

        # Analyze single screenshot
        analyzer = ColorContrastAnalyzer()
        analyzer.screenshots = [screenshot_path]
        analyzer.analyze_all_screenshots()

    elif sys.argv[1] == '--capture':
        # Capture screenshot first
        screenshot_path = capture_screenshot()
        if not screenshot_path:
            sys.exit(1)

        output_path = sys.argv[2] if len(sys.argv) > 2 else None

        # Analyze captured screenshot
        analyzer = ColorContrastAnalyzer()
        analyzer.screenshots = [screenshot_path]
        analyzer.analyze_all_screenshots()

    else:
        # Analyze directory of screenshots
        screenshot_dir = sys.argv[1]
        output_path = sys.argv[2] if len(sys.argv) > 2 else None

        analyzer = ColorContrastAnalyzer(screenshot_dir)
        analyzer.analyze_all_screenshots()

    # Set default output path
    if not output_path:
        script_dir = os.path.dirname(os.path.abspath(__file__))
        output_path = os.path.join(script_dir, '..', 'reports', 'output', 'qw6_color_contrast.json')
        output_path = os.path.abspath(output_path)

    # Save report
    analyzer.save_report(output_path)
    analyzer.print_summary()

    # Exit with appropriate code
    summary = analyzer.get_summary()
    sys.exit(0 if summary['wcag_compliant'] else 1)


if __name__ == '__main__':
    main()
