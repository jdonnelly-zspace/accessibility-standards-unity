#!/bin/bash

# CSS Validation Script using W3C CSS Validator
# Part of accessibility-standards framework
# URL: https://jigsaw.w3.org/css-validator/

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0;' # No Color

# Configuration
API_URL="https://jigsaw.w3.org/css-validator/validator"
PROFILE="css3svg"  # css1, css2, css21, css3, css3svg, svg, svgbasic, svgtiny
OUTPUT_FORMAT="json"

# Usage information
usage() {
    echo "Usage: $0 [OPTIONS] <file-or-url>"
    echo ""
    echo "Validate CSS files using W3C CSS Validator"
    echo ""
    echo "OPTIONS:"
    echo "  -d, --directory DIR    Validate all CSS files in directory"
    echo "  -u, --url URL          Validate URL"
    echo "  -p, --profile PROFILE  CSS profile (css3, css3svg, css21) [default: css3svg]"
    echo "  -h, --help             Show this help message"
    echo ""
    echo "EXAMPLES:"
    echo "  $0 style.css                     # Validate single file"
    echo "  $0 -d src/styles/                # Validate all CSS in directory"
    echo "  $0 -u https://example.com        # Validate live URL"
    echo "  $0 -p css3 main.css              # Use CSS3 profile"
    echo ""
    exit 1
}

# Validate single file
validate_file() {
    local file="$1"

    if [ ! -f "$file" ]; then
        echo -e "${RED}Error: File not found: $file${NC}"
        return 1
    fi

    echo -e "${YELLOW}Validating: $file${NC}"

    # Send file to validator
    response=$(curl -s -F "file=@${file};type=text/css" \
        -F "output=${OUTPUT_FORMAT}" \
        -F "profile=${PROFILE}" \
        "${API_URL}")

    # Check for errors
    if echo "$response" | jq -e '.cssvalidation.errors | length > 0' > /dev/null 2>&1; then
        error_count=$(echo "$response" | jq '.cssvalidation.errors | length')
        warning_count=$(echo "$response" | jq '.cssvalidation.warnings | length')

        echo -e "${RED}✗ FAILED: $file${NC}"
        echo -e "  Errors: $error_count"
        echo -e "  Warnings: $warning_count"
        echo ""
        echo "$response" | jq -r '.cssvalidation.errors[] | "  Line \(.line): \(.message)"'
        return 1
    else
        warning_count=$(echo "$response" | jq '.cssvalidation.warnings | length' 2>/dev/null || echo "0")
        echo -e "${GREEN}✓ PASSED: $file${NC}"
        if [ "$warning_count" -gt 0 ]; then
            echo -e "  ${YELLOW}Warnings: $warning_count${NC}"
        fi
        return 0
    fi
}

# Validate URL
validate_url() {
    local url="$1"

    echo -e "${YELLOW}Validating URL: $url${NC}"

    response=$(curl -s "${API_URL}?uri=${url}&profile=${PROFILE}&output=${OUTPUT_FORMAT}")

    if echo "$response" | jq -e '.cssvalidation.errors | length > 0' > /dev/null 2>&1; then
        error_count=$(echo "$response" | jq '.cssvalidation.errors | length')
        echo -e "${RED}✗ FAILED: $url${NC}"
        echo -e "  Errors: $error_count"
        echo ""
        echo "$response" | jq -r '.cssvalidation.errors[] | "  \(.message)"'
        return 1
    else
        echo -e "${GREEN}✓ PASSED: $url${NC}"
        return 0
    fi
}

# Validate directory
validate_directory() {
    local dir="$1"
    local failed=0
    local passed=0

    if [ ! -d "$dir" ]; then
        echo -e "${RED}Error: Directory not found: $dir${NC}"
        exit 1
    fi

    echo -e "${YELLOW}Validating all CSS files in: $dir${NC}"
    echo ""

    # Find all CSS files
    while IFS= read -r -d '' file; do
        if validate_file "$file"; then
            ((passed++))
        else
            ((failed++))
        fi
        echo ""
    done < <(find "$dir" -name "*.css" -print0)

    # Summary
    echo "========================================"
    echo -e "Total files validated: $((passed + failed))"
    echo -e "${GREEN}Passed: $passed${NC}"
    echo -e "${RED}Failed: $failed${NC}"
    echo "========================================"

    if [ $failed -gt 0 ]; then
        return 1
    fi
    return 0
}

# Check dependencies
check_dependencies() {
    if ! command -v curl &> /dev/null; then
        echo -e "${RED}Error: curl is required but not installed${NC}"
        exit 1
    fi

    if ! command -v jq &> /dev/null; then
        echo -e "${YELLOW}Warning: jq is not installed. Output will be raw JSON.${NC}"
        echo -e "${YELLOW}Install with: brew install jq (macOS) or apt-get install jq (Linux)${NC}"
        echo ""
    fi
}

# Main script
main() {
    check_dependencies

    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -d|--directory)
                validate_directory "$2"
                exit $?
                ;;
            -u|--url)
                validate_url "$2"
                exit $?
                ;;
            -p|--profile)
                PROFILE="$2"
                shift 2
                ;;
            -h|--help)
                usage
                ;;
            *)
                # Single file validation
                validate_file "$1"
                exit $?
                ;;
        esac
    done

    # No arguments provided
    usage
}

main "$@"
