"""
Quick Win 8: Color Blindness Simulator

Simulates different types of color blindness to test visual accessibility.
Generates simulated images for 8 common types of color vision deficiency.

WCAG Requirements:
- 1.4.1 Use of Color (Level A) - Color is not used as the only visual means
  of conveying information, indicating an action, prompting a response, or
  distinguishing a visual element.

Color Vision Deficiency Types:
- Protanopia (Red-blind) - ~1% of males
- Deuteranopia (Green-blind) - ~1% of males
- Tritanopia (Blue-blind) - ~0.001% of population
- Protanomaly (Red-weak) - ~1% of males
- Deuteranomaly (Green-weak) - ~5% of males
- Tritanomaly (Blue-weak) - ~0.01% of population
- Achromatopsia (Total color blindness) - ~0.003% of population
- Achromatomaly (Blue cone monochromacy) - ~0.001% of population

Usage:
    python colorblind_simulator.py <screenshot_dir> [output_dir]
    python colorblind_simulator.py --screenshot <image_path> [output_dir]
"""

import os
import sys
import json
import numpy as np
from datetime import datetime
from pathlib import Path

try:
    from PIL import Image
    PIL_AVAILABLE = True
except ImportError:
    print("[ERROR] PIL required. Install with: pip install Pillow")
    PIL_AVAILABLE = False
    sys.exit(1)

try:
    import cv2
    OPENCV_AVAILABLE = True
except ImportError:
    print("[WARNING] OpenCV not available. Some features will be limited.")
    OPENCV_AVAILABLE = False


class ColorBlindSimulator:
    """Simulates color blindness for accessibility testing"""

    # Color blindness transformation matrices (LMS color space)
    # Based on Brettel, Viénot and Mollon JPEG algorithm
    # Source: http://www.inf.ufrgs.br/~oliveira/pubs_files/CVD_Simulation/CVD_Simulation.html

    TRANSFORMATIONS = {
        'protanopia': {  # Red-blind
            'name': 'Protanopia (Red-blind)',
            'severity': 'complete',
            'matrix': np.array([
                [0.567, 0.433, 0.0],
                [0.558, 0.442, 0.0],
                [0.0, 0.242, 0.758]
            ])
        },
        'deuteranopia': {  # Green-blind
            'name': 'Deuteranopia (Green-blind)',
            'severity': 'complete',
            'matrix': np.array([
                [0.625, 0.375, 0.0],
                [0.7, 0.3, 0.0],
                [0.0, 0.3, 0.7]
            ])
        },
        'tritanopia': {  # Blue-blind
            'name': 'Tritanopia (Blue-blind)',
            'severity': 'complete',
            'matrix': np.array([
                [0.95, 0.05, 0.0],
                [0.0, 0.433, 0.567],
                [0.0, 0.475, 0.525]
            ])
        },
        'protanomaly': {  # Red-weak
            'name': 'Protanomaly (Red-weak)',
            'severity': 'partial',
            'matrix': np.array([
                [0.817, 0.183, 0.0],
                [0.333, 0.667, 0.0],
                [0.0, 0.125, 0.875]
            ])
        },
        'deuteranomaly': {  # Green-weak (most common)
            'name': 'Deuteranomaly (Green-weak)',
            'severity': 'partial',
            'matrix': np.array([
                [0.8, 0.2, 0.0],
                [0.258, 0.742, 0.0],
                [0.0, 0.142, 0.858]
            ])
        },
        'tritanomaly': {  # Blue-weak
            'name': 'Tritanomaly (Blue-weak)',
            'severity': 'partial',
            'matrix': np.array([
                [0.967, 0.033, 0.0],
                [0.0, 0.733, 0.267],
                [0.0, 0.183, 0.817]
            ])
        },
        'achromatopsia': {  # Total color blindness (grayscale)
            'name': 'Achromatopsia (Total color blindness)',
            'severity': 'complete',
            'matrix': np.array([
                [0.299, 0.587, 0.114],
                [0.299, 0.587, 0.114],
                [0.299, 0.587, 0.114]
            ])
        },
        'achromatomaly': {  # Blue cone monochromacy
            'name': 'Achromatomaly (Blue cone monochromacy)',
            'severity': 'complete',
            'matrix': np.array([
                [0.618, 0.320, 0.062],
                [0.163, 0.775, 0.062],
                [0.163, 0.320, 0.516]
            ])
        }
    }

    def __init__(self, screenshot_dir=None, output_dir=None):
        self.screenshot_dir = screenshot_dir
        self.output_dir = output_dir or './screenshots/colorblind_simulations'
        self.screenshots = []
        self.simulations = []

        # Create output directory
        os.makedirs(self.output_dir, exist_ok=True)

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

    def simulate_colorblindness(self, image_path, cvd_type):
        """
        Simulate color blindness for a given image

        Args:
            image_path: Path to input image
            cvd_type: Type of color vision deficiency (key from TRANSFORMATIONS)

        Returns:
            Simulated PIL Image
        """
        if cvd_type not in self.TRANSFORMATIONS:
            raise ValueError(f"Unknown CVD type: {cvd_type}")

        try:
            # Load image
            img = Image.open(image_path)
            img_array = np.array(img).astype(float) / 255.0

            # Handle grayscale images
            if len(img_array.shape) == 2:
                img_array = np.stack([img_array] * 3, axis=-1)

            # Get transformation matrix
            matrix = self.TRANSFORMATIONS[cvd_type]['matrix']

            # Apply transformation
            # Reshape to (N, 3) for matrix multiplication
            original_shape = img_array.shape
            pixels = img_array.reshape(-1, 3)

            # Apply color blindness simulation
            simulated_pixels = np.dot(pixels, matrix.T)

            # Clip values to [0, 1]
            simulated_pixels = np.clip(simulated_pixels, 0, 1)

            # Reshape back to original shape
            simulated_array = simulated_pixels.reshape(original_shape)

            # Convert back to uint8
            simulated_array = (simulated_array * 255).astype(np.uint8)

            # Convert to PIL Image
            simulated_img = Image.fromarray(simulated_array)

            return simulated_img

        except Exception as e:
            print(f"[ERROR] Failed to simulate {cvd_type} for {image_path}: {e}")
            return None

    def process_screenshot(self, image_path):
        """Process single screenshot with all CVD simulations"""
        print(f"\nProcessing: {os.path.basename(image_path)}")

        base_name = os.path.splitext(os.path.basename(image_path))[0]
        simulations_for_image = {
            'original_image': os.path.basename(image_path),
            'original_path': image_path,
            'timestamp': datetime.now().isoformat(),
            'simulations': []
        }

        for cvd_type, info in self.TRANSFORMATIONS.items():
            try:
                # Generate simulation
                simulated_img = self.simulate_colorblindness(image_path, cvd_type)

                if simulated_img:
                    # Save simulated image
                    output_filename = f"{base_name}_{cvd_type}.png"
                    output_path = os.path.join(self.output_dir, output_filename)
                    simulated_img.save(output_path)

                    simulations_for_image['simulations'].append({
                        'cvd_type': cvd_type,
                        'cvd_name': info['name'],
                        'severity': info['severity'],
                        'output_file': output_filename,
                        'output_path': output_path
                    })

                    print(f"  [OK] Generated {info['name']}")

            except Exception as e:
                print(f"  [ERROR] Failed to generate {cvd_type}: {e}")

        self.simulations.append(simulations_for_image)
        return simulations_for_image

    def process_all_screenshots(self):
        """Process all loaded screenshots"""
        print(f"\n{'='*70}")
        print("QUICK WIN 8: Color Blindness Simulator")
        print(f"{'='*70}")

        if not self.screenshots:
            print("[ERROR] No screenshots to process")
            return False

        print(f"Processing {len(self.screenshots)} screenshots...")
        print(f"Output directory: {os.path.abspath(self.output_dir)}\n")

        for screenshot in self.screenshots:
            self.process_screenshot(screenshot)

        print(f"\n[OK] Generated {len(self.simulations) * len(self.TRANSFORMATIONS)} simulated images")

        return True

    def analyze_accessibility(self):
        """
        Analyze simulations to identify potential accessibility issues

        This compares original with simulations to detect areas where
        information might be lost due to color blindness
        """
        if not OPENCV_AVAILABLE:
            print("\n[WARNING] OpenCV not available. Skipping similarity analysis.")
            return None

        print(f"\n{'='*70}")
        print("ANALYZING COLOR-DEPENDENT INFORMATION")
        print(f"{'='*70}\n")

        analysis_results = []

        for sim_data in self.simulations:
            original_path = sim_data['original_path']
            original_img = cv2.imread(original_path)

            if original_img is None:
                continue

            print(f"Analyzing: {os.path.basename(original_path)}")

            sim_analysis = {
                'original_image': os.path.basename(original_path),
                'cvd_comparisons': []
            }

            for sim in sim_data['simulations']:
                simulated_path = sim['output_path']
                simulated_img = cv2.imread(simulated_path)

                if simulated_img is None:
                    continue

                # Calculate similarity
                similarity = self.calculate_similarity(original_img, simulated_img)

                # Identify regions with significant differences
                diff_regions = self.find_difference_regions(original_img, simulated_img)

                cvd_result = {
                    'cvd_type': sim['cvd_type'],
                    'cvd_name': sim['cvd_name'],
                    'similarity_score': float(similarity),
                    'information_preserved': bool(similarity >= 0.9),
                    'difference_regions': int(len(diff_regions)),
                    'potential_issues': bool(similarity < 0.7)
                }

                sim_analysis['cvd_comparisons'].append(cvd_result)

                status = "[PASS]" if cvd_result['information_preserved'] else "[WARNING]"
                print(f"  {status} {sim['cvd_name']}: {similarity:.2%} similarity")

            analysis_results.append(sim_analysis)

        return analysis_results

    def calculate_similarity(self, img1, img2):
        """Calculate structural similarity between two images"""
        try:
            # Convert to grayscale
            gray1 = cv2.cvtColor(img1, cv2.COLOR_BGR2GRAY)
            gray2 = cv2.cvtColor(img2, cv2.COLOR_BGR2GRAY)

            # Calculate SSIM (Structural Similarity Index)
            # Simple implementation using MSE
            mse = np.mean((gray1.astype(float) - gray2.astype(float)) ** 2)

            if mse == 0:
                return 1.0

            # Convert MSE to similarity score (0-1)
            max_pixel = 255.0
            similarity = 1.0 - (mse / (max_pixel ** 2))

            return max(0.0, min(1.0, similarity))

        except Exception as e:
            print(f"[WARNING] Similarity calculation failed: {e}")
            return 0.0

    def find_difference_regions(self, img1, img2, threshold=30):
        """Find regions where images differ significantly"""
        try:
            # Convert to grayscale
            gray1 = cv2.cvtColor(img1, cv2.COLOR_BGR2GRAY)
            gray2 = cv2.cvtColor(img2, cv2.COLOR_BGR2GRAY)

            # Compute absolute difference
            diff = cv2.absdiff(gray1, gray2)

            # Threshold
            _, thresh = cv2.threshold(diff, threshold, 255, cv2.THRESH_BINARY)

            # Find contours
            contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

            # Filter small regions
            min_area = 100
            significant_regions = [c for c in contours if cv2.contourArea(c) > min_area]

            return significant_regions

        except Exception as e:
            return []

    def get_summary(self):
        """Get simulation summary"""
        total_simulations = len(self.simulations) * len(self.TRANSFORMATIONS)

        return {
            'screenshots_processed': len(self.simulations),
            'total_simulations': total_simulations,
            'cvd_types_tested': list(self.TRANSFORMATIONS.keys()),
            'output_directory': os.path.abspath(self.output_dir),
            'wcag_criterion': '1.4.1 Use of Color (Level A)'
        }

    def save_report(self, output_path, analysis_results=None):
        """Save simulation report to JSON"""
        report = {
            'timestamp': datetime.now().isoformat(),
            'wcag_criterion': '1.4.1 Use of Color (Level A)',
            'summary': self.get_summary(),
            'simulations': self.simulations,
            'analysis': analysis_results if analysis_results else None
        }

        # Ensure output directory exists
        output_dir = os.path.dirname(output_path)
        if output_dir:
            os.makedirs(output_dir, exist_ok=True)

        with open(output_path, 'w') as f:
            json.dump(report, f, indent=2)

        print(f"\n[OK] Color blindness simulation report saved: {output_path}")

    def print_summary(self):
        """Print summary to console"""
        summary = self.get_summary()

        print(f"\n{'='*70}")
        print("COLOR BLINDNESS SIMULATION SUMMARY")
        print(f"{'='*70}\n")

        print(f"WCAG Criterion: {summary['wcag_criterion']}")
        print(f"Screenshots Processed: {summary['screenshots_processed']}")
        print(f"Total Simulations: {summary['total_simulations']}")
        print(f"CVD Types: {', '.join(summary['cvd_types_tested'])}")
        print(f"Output Directory: {summary['output_directory']}")
        print(f"{'='*70}\n")


def main():
    """Main entry point"""
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python colorblind_simulator.py <screenshot_dir> [output_dir]")
        print("  python colorblind_simulator.py --screenshot <image_path> [output_dir]")
        sys.exit(1)

    # Parse arguments
    output_dir = None

    if sys.argv[1] == '--screenshot':
        if len(sys.argv) < 3:
            print("[ERROR] Please provide screenshot path")
            sys.exit(1)

        screenshot_path = sys.argv[2]
        output_dir = sys.argv[3] if len(sys.argv) > 3 else './screenshots/colorblind_simulations'

        # Process single screenshot
        simulator = ColorBlindSimulator(output_dir=output_dir)
        simulator.screenshots = [screenshot_path]
        simulator.process_all_screenshots()

    else:
        # Process directory of screenshots
        screenshot_dir = sys.argv[1]
        output_dir = sys.argv[2] if len(sys.argv) > 2 else './screenshots/colorblind_simulations'

        simulator = ColorBlindSimulator(screenshot_dir, output_dir)
        simulator.process_all_screenshots()

    # Run accessibility analysis
    analysis_results = simulator.analyze_accessibility()

    # Set default report path
    script_dir = os.path.dirname(os.path.abspath(__file__))
    report_path = os.path.join(script_dir, '..', 'reports', 'output', 'qw8_colorblind_simulation.json')
    report_path = os.path.abspath(report_path)

    # Save report
    simulator.save_report(report_path, analysis_results)
    simulator.print_summary()

    print(f"\nView simulated images in: {os.path.abspath(output_dir)}")


if __name__ == '__main__':
    main()
