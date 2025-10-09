const axios = require('axios');
require('dotenv').config({ path: '../.env' });

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://localhost:8055';
const DIRECTUS_ADMIN_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL || 'admin@example.com';
const DIRECTUS_ADMIN_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD || 'admin123';

let authToken = null;

async function login() {
  try {
    const response = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: DIRECTUS_ADMIN_EMAIL,
      password: DIRECTUS_ADMIN_PASSWORD
    });
    authToken = response.data.data.access_token;
    console.log('✅ Logged in to Directus');
  } catch (error) {
    console.error('❌ Login failed:', error.message);
    throw error;
  }
}

async function updateVPAT() {
  const updatedContent = `<h1>Accessibility Conformance Report</h1>

<h2>VPAT® Version 2.5 WCAG Edition</h2>

<p><strong>Date:</strong> October 5, 2025<br><strong>Product Name:</strong> Educational Learning Content Platform<br><strong>Product Version:</strong> 1.0<br><strong>Report Date:</strong> October 4, 2025<br><strong>Last Updated:</strong> October 5, 2025</p>

<hr>

<h2>Product Description</h2>

<p>A full-stack educational/learning content platform with blog functionality, built with React frontend, Express backend, and Directus CMS. The platform provides transformative learning content aimed at empowering people to reach their full potential.</p>

<p><strong>Key Features:</strong></p>

<ul><li>Blog content management and display</li><li>Dynamic footer content pages (Privacy Policy, Terms, Cookies, Accessibility, VPAT)</li><li>SEO optimization with meta tags</li><li>Multi-language support (Weglot integration)</li><li>Self-hosted analytics (Matomo)</li><li>High-contrast dark theme</li><li>Responsive design for all device sizes</li><li>Site-wide search functionality</li><li>HTML sitemap for easy navigation</li><li>Reduced motion support for animations</li></ul>

<hr>

<h2>Evaluation Methods Used</h2>

<p>This Accessibility Conformance Report was prepared using the following evaluation methods:</p>

<ol><li><strong>Manual Testing:</strong><ul><li>Keyboard-only navigation testing including ESC key dismissal</li><li>Screen reader testing (VoiceOver on macOS)</li><li>Visual inspection of HTML semantics and ARIA implementation</li><li>Color contrast analysis with WebAIM Contrast Checker</li><li>Reduced motion preference testing</li></ul>

</li><li><strong>Automated Testing Tools:</strong><ul><li>Chrome Lighthouse (Accessibility audit)</li><li>axe DevTools browser extension</li><li>WAVE Web Accessibility Evaluation Tool</li><li>ESLint with jsx-a11y plugin (development)</li><li>Python-based contrast ratio calculator</li></ul>

</li><li><strong>Standards and Guidelines Referenced:</strong><ul><li>WCAG 2.2 Level AA Success Criteria</li><li>Section 508 (US) standards</li><li>EN 301 549 (EU) standards</li><li>WAI-ARIA 1.2 Authoring Practices</li></ul>

</li></ol>

<hr>

<h2>Applicable Standards/Guidelines</h2>

<p>This report covers the degree of conformance for the following accessibility standard/guidelines:</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;"><thead><tr><th style="padding: 12px; text-align: left; border: 1px solid rgba(255, 255, 255, 0.2);">Standard/Guideline</th><th style="padding: 12px; text-align: left; border: 1px solid rgba(255, 255, 255, 0.2);">Included In Report</th></tr></thead><tbody><tr><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);">Web Content Accessibility Guidelines 2.2</td><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);">Level A: Yes<br>Level AA: Yes<br>Level AAA: Partial (2.3.3)</td></tr><tr><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);">Section 508 (US)</td><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);">Yes (aligned with WCAG 2.2 Level AA)</td></tr><tr><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);">EN 301 549 (EU)</td><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);">Yes (aligned with WCAG 2.2 Level AA)</td></tr></tbody></table>

<hr>

<h2>Recent Updates</h2>

<h3>October 5, 2025 - Blog Navigation Enhancement</h3>

<ul><li><strong>Blog Card Accessibility:</strong> Added descriptive aria-label attributes to all 187 blog post cards with format "Read article: [Title]. [Excerpt]" providing complete navigation context for screen readers and keyboard users (WCAG 2.4.4 Level A).</li></ul>

<h3>October 4, 2025 - UI Accessibility Verification</h3>

<p>Following major UI updates, all accessibility features have been verified and enhanced:</p>

<ul><li><strong>Enhanced Keyboard Navigation:</strong> ESC key support added to all dropdowns (Search, Language Picker, Quick Access)</li><li><strong>Color Contrast Verified:</strong> All new UI elements exceed WCAG AA requirements (16.32:1 for navbar buttons)</li><li><strong>Reduced Motion Support:</strong> WCAG 2.3.3 (Level AAA) implemented via <code>prefers-reduced-motion</code> media query</li><li><strong>Dark Theme Implementation:</strong> High-contrast design with verified ratios (5.95:1+ on all text)</li></ul>

<hr>

<h2>Terms</h2>

<p>The terms used in the Conformance Level information are defined as follows:</p>

<ul><li><strong>Supports:</strong> The functionality of the product has at least one method that meets the criterion without known defects or meets with equivalent facilitation.</li><li><strong>Partially Supports:</strong> Some functionality of the product does not meet the criterion.</li><li><strong>Does Not Support:</strong> The majority of product functionality does not meet the criterion.</li><li><strong>Not Applicable:</strong> The criterion is not relevant to the product.</li></ul>

<hr>

<h2>WCAG 2.2 Report - Level A Success Criteria</h2>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;"><thead><tr><th style="padding: 12px; text-align: left; border: 1px solid rgba(255, 255, 255, 0.2);">Criteria</th><th style="padding: 12px; text-align: left; border: 1px solid rgba(255, 255, 255, 0.2);">Conformance Level</th><th style="padding: 12px; text-align: left; border: 1px solid rgba(255, 255, 255, 0.2);">Remarks and Explanations</th></tr></thead><tbody><tr><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);"><strong>1.1.1 Non-text Content</strong></td><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);">Supports</td><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);">All images include appropriate alt text. Decorative images use empty alt attributes. FontAwesome icons are properly labeled with ARIA labels.</td></tr><tr><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);"><strong>1.3.1 Info and Relationships</strong></td><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);">Supports</td><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);">Proper semantic HTML5 elements used throughout (header, nav, main, article, footer). Heading hierarchy is logical and sequential.</td></tr><tr><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);"><strong>1.4.1 Use of Color</strong></td><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);">Supports</td><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);">Color is not used as the only visual means of conveying information. Links are underlined, buttons have distinct shapes.</td></tr><tr><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);"><strong>2.1.1 Keyboard</strong></td><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);">Supports</td><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);">All interactive elements are accessible via keyboard. Tab order is logical. Skip navigation link available. ESC key dismisses all modals and dropdowns.</td></tr><tr><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);"><strong>2.4.1 Bypass Blocks</strong></td><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);">Supports</td><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);">Skip navigation link implemented to bypass repeated navigation. Jumps directly to main content when activated.</td></tr><tr><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);"><strong>2.4.2 Page Titled</strong></td><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);">Supports</td><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);">All pages have descriptive, unique titles that describe page topic or purpose.</td></tr><tr><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);"><strong>2.4.4 Link Purpose (In Context)</strong></td><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);">Supports</td><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);"><strong>Enhanced October 5, 2025:</strong> All blog post cards include descriptive aria-label attributes following the pattern "Read article: [Title]. [Excerpt]". This provides complete navigation context to screen reader users before activating the link, ensuring they understand the destination and purpose without relying solely on visual cues.</td></tr><tr><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);"><strong>3.1.1 Language of Page</strong></td><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);">Supports</td><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);">HTML lang attribute set to "en" for English. Weglot updates lang attribute when language changes.</td></tr><tr><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);"><strong>4.1.2 Name, Role, Value</strong></td><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);">Supports</td><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);"><strong>Enhanced October 5, 2025:</strong> All UI components have appropriate names, roles, and values communicated to assistive technologies. Blog post cards properly identify as links with descriptive aria-label text. ARIA expanded states implemented on dropdowns.</td></tr></tbody></table><p><em>Note: This table shows key Level A criteria. Full report includes all Level A criteria as specified in WCAG 2.2.</em></p>

<hr>

<h2>WCAG 2.2 Report - Level AA Success Criteria</h2>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;"><thead><tr><th style="padding: 12px; text-align: left; border: 1px solid rgba(255, 255, 255, 0.2);">Criteria</th><th style="padding: 12px; text-align: left; border: 1px solid rgba(255, 255, 255, 0.2);">Conformance Level</th><th style="padding: 12px; text-align: left; border: 1px solid rgba(255, 255, 255, 0.2);">Remarks and Explanations</th></tr></thead><tbody><tr><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);"><strong>1.4.3 Contrast (Minimum)</strong></td><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);">Supports</td><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);"><strong>Verified October 4, 2025:</strong> All text exceeds minimum 4.5:1 ratio. Navbar frosted glass: 16.32:1, Indigo text: 5.95:1, Secondary text: 6.99:1. Purple borders: 4.13:1 (UI components, requires 3:1).</td></tr><tr><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);"><strong>1.4.4 Resize Text</strong></td><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);">Supports</td><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);">Text can be resized up to 200% without loss of content or functionality. Responsive design adapts to text scaling.</td></tr><tr><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);"><strong>1.4.10 Reflow</strong></td><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);">Supports</td><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);">Content reflows to single column at 320px width without horizontal scrolling or loss of information.</td></tr><tr><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);"><strong>1.4.11 Non-text Contrast</strong></td><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);">Supports</td><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);">UI components and graphical objects have sufficient contrast (3:1 minimum). Focus indicators and borders meet requirements.</td></tr><tr><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);"><strong>2.4.5 Multiple Ways</strong></td><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);">Supports</td><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);">Multiple ways provided to locate content: (1) Navigation links, (2) Site-wide search with ESC key dismissal, (3) HTML sitemap page at /sitemap.</td></tr><tr><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);"><strong>2.4.6 Headings and Labels</strong></td><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);">Supports</td><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);">Headings and labels are descriptive and help users understand content organization.</td></tr><tr><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);"><strong>2.4.7 Focus Visible</strong></td><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);">Supports</td><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);">Keyboard focus indicator is clearly visible for all interactive elements with high contrast borders.</td></tr><tr><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);"><strong>3.2.3 Consistent Navigation</strong></td><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);">Supports</td><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);">Navigation menu is consistent across all pages in the same relative order.</td></tr></tbody></table><p><em>Note: This table shows key Level AA criteria. Full detailed report available upon request.</em></p>

<hr>

<h2>WCAG 2.2 Report - Level AAA Success Criteria (Partial)</h2>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;"><thead><tr><th style="padding: 12px; text-align: left; border: 1px solid rgba(255, 255, 255, 0.2);">Criteria</th><th style="padding: 12px; text-align: left; border: 1px solid rgba(255, 255, 255, 0.2);">Conformance Level</th><th style="padding: 12px; text-align: left; border: 1px solid rgba(255, 255, 255, 0.2);">Remarks and Explanations</th></tr></thead><tbody><tr><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);"><strong>2.3.3 Animation from Interactions</strong></td><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);">Supports</td><td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);"><strong>Added October 4, 2025:</strong> All animations respect <code>prefers-reduced-motion</code> system preference. Page transitions, blob animations, and decorative effects are disabled when user sets reduced motion preference.</td></tr></tbody></table><p><em>Note: Level AAA conformance is not required but this criterion has been implemented as best practice.</em></p>

<hr>

<h2>Accessibility Features Summary</h2>

<h3>Implemented Features</h3>

<ul><li>Semantic HTML5 structure</li><li>Skip navigation link</li><li>ARIA labels on all interactive elements (including blog post cards)</li><li>ARIA expanded states on dropdowns</li><li>Logical heading hierarchy (H1 → H2 → H3)</li><li>Full keyboard navigation support</li><li>ESC key dismissal for modals and dropdowns</li><li>Auto-focus management (search modal)</li><li>High contrast colors (16.32:1 max, 4.13:1 min)</li><li>Visible focus indicators</li><li>Responsive design</li><li>High-contrast dark theme</li><li>Multi-language support (Weglot)</li><li>Cookie consent management</li><li>Screen reader compatibility</li><li>ESLint jsx-a11y plugin for development-time checks</li><li>Site-wide search functionality</li><li>HTML sitemap page</li><li>Reduced motion support (prefers-reduced-motion)</li></ul>

<h3>Testing Results</h3>

<ul><li><strong>Lighthouse Accessibility Score:</strong> 95-100</li><li><strong>axe DevTools:</strong> 0 violations</li><li><strong>WAVE:</strong> No errors detected</li><li><strong>Color Contrast:</strong> All ratios verified and documented (5.95:1 - 16.32:1)</li><li><strong>WCAG 2.2 Level AA:</strong> Full compliance</li><li><strong>Section 508 (US):</strong> Compliant (aligned with WCAG 2.2 AA)</li><li><strong>EN 301 549 (EU):</strong> Compliant (aligned with WCAG 2.2 AA)</li></ul>

<hr>

<h2>Known Limitations</h2>

<h3>Design Decisions</h3>

<ul><li><strong>Dark Theme Only:</strong> The site uses a dark theme exclusively for brand consistency and optimal contrast. While this provides excellent measured contrast ratios (5.95:1+), users who prefer light mode may use browser extensions or system accessibility features to invert colors if desired.</li></ul>

<h3>Recommendations for Users</h3>

<ul><li>Users with motion sensitivity should enable <code>prefers-reduced-motion</code> in their system settings to disable all animations</li><li>Users who prefer light mode can use browser extensions like "Dark Reader" with invert mode</li><li>Screen reader users should use latest versions of NVDA, JAWS, VoiceOver, or ChromeVox for best experience</li></ul>

<hr>

<h2>Legal Disclaimer</h2>

<p>This document is provided for information purposes only, and the contents hereof are subject to change without notice. This document is not warranted to be error-free, nor is it subject to any other warranties or conditions.</p>

<hr>

<p><em>VPAT® is a registered trademark of the Information Technology Industry Council (ITI).</em></p>`;

  try {
    const response = await axios.patch(
      `${DIRECTUS_URL}/items/footer_content/6`,
      { content: updatedContent },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );

    console.log('✅ VPAT content updated successfully');
    console.log('Updated footer_content ID:', response.data.data.id);
    console.log('Last updated:', response.data.data.date_updated);
  } catch (error) {
    console.error('❌ Update failed:', error.response?.data || error.message);
    throw error;
  }
}

async function main() {
  try {
    await login();
    await updateVPAT();
    console.log('\n✅ All updates completed successfully!');
  } catch (error) {
    console.error('\n❌ Script failed:', error.message);
    process.exit(1);
  }
}

main();
