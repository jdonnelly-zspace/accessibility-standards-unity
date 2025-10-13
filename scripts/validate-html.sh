#!/bin/bash

# HTML Validation Script using W3C Nu HTML Checker
# Part of accessibility-standards framework
# URL: https://validator.w3.org/nu/

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
API_URL="https://validator.w3.org/nu/"
OUTPUT_FORMAT="json" # json, gnu, xml, text

# Usage information
usage() {
    echo "Usage: $0 [OPTIONS] <file-or-url>"
    echo ""
    echo "Validate HTML files using W3C Nu HTML Checker"
    echo ""
    echo "OPTIONS:"
    echo "  -d, --directory DIR    Validate all HTML files in directory"
    echo "  -u, --url URL          Validate URL"
    echo "  -f, --format FORMAT    Output format (json, gnu, xml, text) [default: json]"
    echo "  -h, --help             Show this help message"
    echo ""
    echo "EXAMPLES:"
    echo "  $0 index.html                    # Validate single file"
    echo "  $0 -d dist/                      # Validate all HTML in directory"
    echo "  $0 -u https://example.com        # Validate live URL"
    echo "  $0 -f gnu index.html             # Use GNU format output"
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
    response=$(curl -s -H "Content-Type: text/html; charset=utf-8" \
        --data-binary @"$file" \
        "${API_URL}?out=${OUTPUT_FORMAT}")

    # Check for errors
    if echo "$response" | grep -q '"type":"error"'; then
        echo -e "${RED}✗ FAILED: $file${NC}"
        echo "$response" | jq '.messages[] | select(.type=="error") | "  Line \(.lastLine): \(.message)"' -r
        return 1
    else
        echo -e "${GREEN}✓ PASSED: $file${NC}"
        return 0
    fi
}

# Validate URL
validate_url() {
    local url="$1"

    echo -e "${YELLOW}Validating URL: $url${NC}"

    response=$(curl -s "${API_URL}?doc=${url}&out=${OUTPUT_FORMAT}")

    if echo "$response" | grep -q '"type":"error"'; then
        echo -e "${RED}✗ FAILED: $url${NC}"
        echo "$response" | jq '.messages[] | select(.type=="error") | "  \(.message)"' -r
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

    echo -e "${YELLOW}Validating all HTML files in: $dir${NC}"
    echo ""

    # Find all HTML files
    while IFS= read -r -d '' file; do
        if validate_file "$file"; then
            ((passed++))
        else
            ((failed++))
        fi
        echo ""
    done < <(find "$dir" -name "*.html" -print0)

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
            -f|--format)
                OUTPUT_FORMAT="$2"
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
