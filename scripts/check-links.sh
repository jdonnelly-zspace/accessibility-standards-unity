#!/bin/bash

# Link Checker Script using W3C Link Checker API
# Part of accessibility-standards framework
# URL: https://validator.w3.org/checklink
# WCAG: Checks compliance with 2.4.4 Link Purpose (In Context)

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0;33m' # No Color

# Configuration
API_URL="https://validator.w3.org/checklink"
DEPTH=1  # Recursion depth (0 = single page, 1 = one level deep, etc.)
CHECK_ANCHORS="yes"  # Check fragment identifiers (anchors)
SUPPRESS_REDIRECTS="no"  # Show or suppress redirects

# Usage information
usage() {
    echo "Usage: $0 [OPTIONS] <url>"
    echo ""
    echo "Check links for broken URLs using W3C Link Checker"
    echo "Helps ensure WCAG 2.4.4 (Link Purpose) compliance"
    echo ""
    echo "OPTIONS:"
    echo "  -d, --depth NUM        Recursion depth [default: 1]"
    echo "  -a, --no-anchors       Don't check fragment identifiers"
    echo "  -r, --hide-redirects   Suppress redirects in output"
    echo "  -s, --summary-only     Show only summary (broken links)"
    echo "  -h, --help             Show this help message"
    echo ""
    echo "EXAMPLES:"
    echo "  $0 https://example.com                   # Check single page + one level"
    echo "  $0 -d 0 https://example.com              # Check single page only"
    echo "  $0 -d 2 https://example.com              # Check two levels deep"
    echo "  $0 -s https://example.com                # Show only broken links"
    echo ""
    exit 1
}

# Check a single URL
check_url() {
    local url="$1"
    local summary_only="${2:-no}"

    echo -e "${BLUE}========================================"
    echo -e "W3C Link Checker"
    echo -e "========================================${NC}"
    echo -e "URL: $url"
    echo -e "Depth: $DEPTH"
    echo -e "Check anchors: $CHECK_ANCHORS"
    echo ""

    echo -e "${YELLOW}Checking links (this may take a while)...${NC}"
    echo ""

    # Build API request
    local api_request="${API_URL}?uri=${url}&depth=${DEPTH}&hide_type=all&check_anchors=${CHECK_ANCHORS}"

    # Make request
    response=$(curl -s "$api_request")

    # Parse results (simple HTML parsing)
    broken_count=$(echo "$response" | grep -o "broken link" | wc -l || echo "0")
    redirect_count=$(echo "$response" | grep -o "redirect" | wc -l || echo "0")

    if [ "$summary_only" = "yes" ]; then
        # Extract only broken links
        echo "$response" | grep -A 5 "broken link" | grep -oP 'href="\K[^"]+' || true
    else
        # Show formatted results
        echo "$response" | grep -E "(broken link|redirect|404|500|Error)" || echo "No obvious errors found in output"
    fi

    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "SUMMARY"
    echo -e "${BLUE}========================================${NC}"

    if [ "$broken_count" -gt 0 ]; then
        echo -e "${RED}✗ Broken Links Found: $broken_count${NC}"
        echo -e "${RED}FAILED - Fix broken links to comply with WCAG 2.4.4${NC}"
        return 1
    else
        echo -e "${GREEN}✓ No Broken Links Found${NC}"
        echo -e "${GREEN}PASSED${NC}"
        return 0
    fi
}

# Check dependencies
check_dependencies() {
    if ! command -v curl &> /dev/null; then
        echo -e "${RED}Error: curl is required but not installed${NC}"
        exit 1
    fi
}

# Main script
main() {
    check_dependencies

    local summary_only="no"
    local url=""

    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -d|--depth)
                DEPTH="$2"
                shift 2
                ;;
            -a|--no-anchors)
                CHECK_ANCHORS="no"
                shift
                ;;
            -r|--hide-redirects)
                SUPPRESS_REDIRECTS="yes"
                shift
                ;;
            -s|--summary-only)
                summary_only="yes"
                shift
                ;;
            -h|--help)
                usage
                ;;
            *)
                url="$1"
                shift
                ;;
        esac
    done

    # Validate URL provided
    if [ -z "$url" ]; then
        echo -e "${RED}Error: URL is required${NC}"
        usage
    fi

    # Check the URL
    check_url "$url" "$summary_only"
    exit $?
}

main "$@"
