# npm Publishing Guide

This document provides instructions for publishing the `accessibility-standards-unity` package to npm (or an internal npm registry).

---

## Prerequisites

### 1. npm Account
- **Public npm:** Create account at https://www.npmjs.com/signup
- **Internal registry:** Get credentials from your organization

### 2. npm Authentication
```bash
# For public npm
npm login

# For internal registry (example)
npm login --registry=https://your-internal-registry.com/
```

### 3. Verify Package Configuration
Ensure `package.json` is properly configured:
- ✅ `name`: `accessibility-standards-unity`
- ✅ `version`: Follows semantic versioning (current: `3.0.0`)
- ✅ `description`: Clear and concise
- ✅ `keywords`: Relevant search terms
- ✅ `repository`: GitHub URL
- ✅ `license`: MIT
- ✅ `files`: Whitelist of files to include in package
- ✅ `bin`: CLI commands properly configured

---

## Pre-Publishing Checklist

Before publishing, verify:

### 1. Version Number
```bash
# Check current version
cat package.json | grep version

# Bump version if needed (choose one)
npm version patch  # 3.0.0 -> 3.0.1 (bug fixes)
npm version minor  # 3.0.0 -> 3.1.0 (new features)
npm version major  # 3.0.0 -> 4.0.0 (breaking changes)
```

### 2. Files Included in Package
```bash
# Create tarball to inspect contents
npm pack

# List files that will be published
tar -tzf accessibility-standards-unity-*.tgz

# Expected files:
# - bin/ (audit scripts)
# - templates/ (audit report templates)
# - standards/ (WCAG, XAUR documentation)
# - implementation/ (Unity scripts, prefabs, tests)
# - workflows/ (role-specific guides)
# - docs/ (auditing guides, API docs)
# - resources/ (NVDA guide, tools catalog)
# - README.md, LICENSE, CHANGELOG.md, package.json
```

### 3. Test Installation Locally
```bash
# Install from tarball globally
npm install -g ./accessibility-standards-unity-3.0.0.tgz

# Verify CLI command works
a11y-audit-zspace --help

# Test on a Unity project
a11y-audit-zspace /path/to/test-unity-project

# Uninstall after testing
npm uninstall -g accessibility-standards-unity
```

### 4. Update CHANGELOG.md
Document all changes in `CHANGELOG.md`:
```markdown
## [3.0.0] - 2025-10-20

### Added
- Automated accessibility auditing system
- Claude Code slash command (/audit-zspace)
- Standalone CLI tool (a11y-audit-zspace)
- Partner onboarding documentation
- Audit workflow examples

### Changed
- Version bump from 2.2.0 to 3.0.0
- Enhanced package.json with "files" whitelist
```

### 5. Commit All Changes
```bash
# Stage changes
git add package.json CHANGELOG.md .npmignore PUBLISHING.md

# Commit
git commit -m "chore: prepare v3.0.0 for npm publishing"

# Push to GitHub
git push origin main
```

---

## Publishing Steps

### Option 1: Publish to Public npm (Recommended for Open Source)

```bash
# 1. Ensure you're logged in
npm whoami

# 2. Dry run to preview what will be published
npm publish --dry-run

# 3. Publish to npm
npm publish

# 4. Verify publication
npm view accessibility-standards-unity

# 5. Test installation
npm install -g accessibility-standards-unity
a11y-audit-zspace --version
```

**Result:** Package available at https://www.npmjs.com/package/accessibility-standards-unity

### Option 2: Publish to Internal npm Registry

```bash
# 1. Configure registry
npm config set registry https://your-internal-registry.com/

# 2. Login
npm login --registry=https://your-internal-registry.com/

# 3. Publish
npm publish --registry=https://your-internal-registry.com/

# 4. Reset to public npm (optional)
npm config set registry https://registry.npmjs.org/
```

### Option 3: Private Distribution (GitHub Only)

If you don't want to publish to npm, partners can install directly from GitHub:

```bash
# Partners install via:
npm install -g git+https://github.com/jdonnelly-zspace/accessibility-standards-unity.git

# Or use tarball distribution:
# 1. Create tarball
npm pack

# 2. Share accessibility-standards-unity-3.0.0.tgz via email/Slack/drive
# 3. Partners install via:
npm install -g /path/to/accessibility-standards-unity-3.0.0.tgz
```

---

## Post-Publishing Tasks

### 1. Create Git Tag
```bash
# Tag release
git tag v3.0.0

# Push tag to GitHub
git push origin v3.0.0
```

### 2. Create GitHub Release
Visit: https://github.com/jdonnelly-zspace/accessibility-standards-unity/releases/new

**Release Notes Template:**
```markdown
# v3.0.0 - Automated Accessibility Auditing System

## 🚀 What's New

This major release transforms the accessibility-standards-unity framework into a complete **turnkey auditing platform** for zSpace Unity applications.

### Key Features

✅ **Automated Auditing System**
- Scan any zSpace Unity project for WCAG 2.2 + W3C XAUR compliance
- Generate 5 professional reports in seconds
- Detect accessibility patterns, violations, and missing components

✅ **Three Usage Methods**
1. **Claude Code:** `/audit-zspace /path/to/project`
2. **Standalone CLI:** `a11y-audit-zspace /path/to/project`
3. **Manual:** Scripts in `bin/` directory

✅ **Comprehensive Documentation**
- Partner onboarding guide
- Internal auditing guide
- Prompt engineering guide for Claude Code
- Example workflow with case study

### Installation

```bash
# Install globally
npm install -g accessibility-standards-unity

# Run audit
a11y-audit-zspace /path/to/your-unity-project
```

### Generated Reports

All audits produce 5 reports:
1. **README.md** - Quick overview
2. **AUDIT-SUMMARY.md** - Executive summary
3. **VPAT-{appname}.md** - Legal compliance documentation
4. **ACCESSIBILITY-RECOMMENDATIONS.md** - Developer fixes
5. **accessibility-analysis.json** - Raw findings data

### Breaking Changes

- Version bumped from 2.2.0 to 3.0.0
- New dependencies: `axios`, `cheerio`, `node-html-markdown`
- Requires Node.js 14.0.0+

### Documentation

- [Partner Onboarding Guide](docs/PARTNER-ONBOARDING.md)
- [Auditing Guide](docs/AUDITING-GUIDE.md)
- [Claude Prompts Guide](docs/CLAUDE-PROMPTS.md)
- [Example Workflow](examples/audit-workflow/)

### Contributors

@jPdonnelly

### Full Changelog

See [CHANGELOG.md](CHANGELOG.md) for complete details.
```

### 3. Announce to Partners
- Send announcement email (see `templates/partner-outreach/announcement-email.md`)
- Update internal wiki/documentation
- Post in relevant Slack channels

### 4. Update Package Badge (Optional)
Add to README.md:
```markdown
[![npm version](https://img.shields.io/npm/v/accessibility-standards-unity.svg)](https://www.npmjs.com/package/accessibility-standards-unity)
[![npm downloads](https://img.shields.io/npm/dt/accessibility-standards-unity.svg)](https://www.npmjs.com/package/accessibility-standards-unity)
```

---

## Updating the Package

When releasing new versions:

```bash
# 1. Make changes
# 2. Update CHANGELOG.md
# 3. Bump version
npm version patch  # or minor/major

# 4. Commit
git add .
git commit -m "chore: bump version to X.X.X"
git push

# 5. Publish
npm publish

# 6. Tag and push
git push --tags
```

---

## Troubleshooting

### "You do not have permission to publish"
```bash
# Check npm user
npm whoami

# Ensure you're logged in
npm login

# Verify package name is available
npm view accessibility-standards-unity
```

### "Package name already exists"
If the package name is taken on npm, either:
1. Request access from current owner
2. Use scoped package: `@your-org/accessibility-standards-unity`
3. Choose different name

### "Invalid package.json"
```bash
# Validate package.json
npm install -g jsonlint
jsonlint package.json

# Or use online validator
# https://jsonlint.com/
```

### "Missing files in published package"
```bash
# Check .npmignore (should NOT exclude needed files)
cat .npmignore

# Check "files" whitelist in package.json
cat package.json | grep -A 20 '"files"'

# Inspect tarball contents
npm pack
tar -tzf accessibility-standards-unity-*.tgz
```

---

## Security

### Before Publishing
- ✅ Review all files for secrets (API keys, credentials)
- ✅ Check `.npmignore` excludes sensitive files
- ✅ Verify LICENSE is included
- ✅ Ensure dependencies are up to date

### After Publishing
If you accidentally publish secrets:
```bash
# 1. Unpublish immediately
npm unpublish accessibility-standards-unity@3.0.0

# 2. Rotate compromised credentials
# 3. Fix issue
# 4. Republish with bumped version
```

---

## Support

**Questions?**
- Review the [Partner Onboarding Guide](docs/PARTNER-ONBOARDING.md)
- Check the [Auditing Guide](docs/AUDITING-GUIDE.md)
- Open an issue on GitHub

**Found a bug?**
- Open an issue: https://github.com/jdonnelly-zspace/accessibility-standards-unity/issues
- Include npm version, Node.js version, and error message

---

## Quick Reference

```bash
# Pre-publishing
npm pack                           # Create tarball
npm install -g ./package.tgz       # Test locally
npm publish --dry-run              # Preview publish

# Publishing
npm login                          # Authenticate
npm publish                        # Publish to npm
git tag v3.0.0 && git push --tags  # Tag release

# Post-publishing
npm view accessibility-standards-unity           # Verify publication
npm install -g accessibility-standards-unity     # Test installation
a11y-audit-zspace --version                      # Verify CLI works
```

---

**Last Updated:** 2025-10-20
**Current Version:** 3.0.0
**Next Version:** TBD
