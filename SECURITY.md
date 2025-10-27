# Security Policy

## Supported Versions

We actively maintain and provide security updates for the following versions:

| Version | Supported          | Status |
| ------- | ------------------ | ------ |
| 3.1.x   | :white_check_mark: | Current release - full support |
| 3.0.x   | :warning:          | Security fixes only until 2026-01-31 |
| 2.x.x   | :x:                | No longer supported |
| 1.x.x   | :x:                | No longer supported |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue in the accessibility-standards-unity framework, please report it responsibly.

### How to Report

**DO NOT** open a public GitHub issue for security vulnerabilities.

Instead, please report security issues through one of these methods:

1. **GitHub Security Advisories (Preferred)**
   - Navigate to the [Security tab](https://github.com/jdonnelly-zspace/accessibility-standards-unity/security/advisories)
   - Click "Report a vulnerability"
   - Provide detailed information about the vulnerability

2. **Email**
   - Send details to: security@[repository-owner-domain]
   - Include "SECURITY" in the subject line
   - Encrypt sensitive information using our PGP key if possible

### What to Include

When reporting a vulnerability, please include:

- **Description**: Clear description of the vulnerability
- **Impact**: Potential security impact and affected versions
- **Reproduction**: Step-by-step instructions to reproduce the issue
- **Proof of Concept**: Code or commands demonstrating the vulnerability (if applicable)
- **Suggested Fix**: Any ideas for fixing the issue (optional)
- **Your Contact**: How we can reach you for follow-up questions

### What to Expect

| Timeline | Action |
|----------|--------|
| **Within 48 hours** | Initial acknowledgment of your report |
| **Within 7 days** | Preliminary assessment and severity classification |
| **Within 30 days** | Fix developed and tested (for critical vulnerabilities) |
| **Within 60 days** | Fix developed and tested (for non-critical vulnerabilities) |

We will keep you informed throughout the process and credit you in the security advisory (unless you prefer to remain anonymous).

## Security Considerations

### For Framework Users

This framework performs static analysis and code generation for Unity accessibility compliance. Key security considerations:

1. **Code Generation**: Generated C# code should be reviewed before integration
2. **Screenshot Capture**: Unity batch mode execution requires appropriate permissions
3. **Dependencies**: Regularly update Node.js dependencies to address known vulnerabilities
4. **CI/CD Integration**: Secure your Unity license and GitHub tokens in CI/CD workflows

### Known Security Limitations

- **Static Analysis Only**: This framework does not execute Unity application code
- **Screenshot Capture**: Unity batch mode requires access to Unity Editor executable
- **PDF Generation**: Uses Puppeteer/Chromium for PDF export (sandboxed)
- **External Dependencies**: Relies on third-party npm packages (see package.json)

## Security Best Practices

### When Using the CLI Tools

```bash
# Always verify the integrity of installed packages
npm audit

# Update dependencies regularly
npm update

# Use specific versions in production
npm ci  # instead of npm install
```

### When Integrating with CI/CD

1. **Secure Secrets**
   - Never commit Unity licenses or API tokens to version control
   - Use GitHub Secrets or equivalent secret management
   - Rotate tokens regularly

2. **Limit Permissions**
   - Grant minimal required permissions to CI/CD workflows
   - Use read-only tokens where possible
   - Review workflow permissions regularly

3. **Validate Inputs**
   - Sanitize user inputs when generating reports
   - Validate file paths to prevent directory traversal
   - Review generated code before committing

### Dependency Security

We monitor dependencies for known vulnerabilities:

- **Automated scanning**: Dependabot alerts enabled
- **Regular updates**: Dependencies updated quarterly
- **Audit trail**: All updates documented in CHANGELOG.md

## Vulnerability Disclosure Policy

### Public Disclosure Timeline

1. **Immediate**: Critical vulnerabilities patched within 30 days
2. **T + 90 days**: Public disclosure after fix is released (or sooner if already public)
3. **Coordinated**: We work with security researchers to coordinate disclosure

### Security Advisories

Published security advisories include:

- **CVE ID**: If assigned
- **Severity**: Using CVSS 3.1 scoring
- **Affected Versions**: Specific version ranges
- **Fixed Versions**: Versions containing the fix
- **Workarounds**: Temporary mitigations (if available)
- **Credits**: Recognition for reporters (with permission)

## Security Updates

Security updates are released as:

- **Patch releases** (e.g., 3.1.1 → 3.1.2) for current major version
- **Backports** to previous major version (if still supported)
- **Security advisories** published in GitHub Security tab

## Contact

For security-related questions or concerns:

- **GitHub Security**: https://github.com/jdonnelly-zspace/accessibility-standards-unity/security
- **General Issues**: https://github.com/jdonnelly-zspace/accessibility-standards-unity/issues
- **Documentation**: See `docs/` directory for framework documentation

---

**Last Updated**: October 27, 2025
**Policy Version**: 1.0
**Framework Version**: 3.1.0
