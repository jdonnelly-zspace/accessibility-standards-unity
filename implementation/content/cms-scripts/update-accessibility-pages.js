const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://localhost:8055';
const DIRECTUS_ADMIN_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL;
const DIRECTUS_ADMIN_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD;

let accessToken = null;

async function login() {
  try {
    const response = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: DIRECTUS_ADMIN_EMAIL,
      password: DIRECTUS_ADMIN_PASSWORD
    });
    accessToken = response.data.data.access_token;
    console.log('✓ Logged in to Directus\n');
  } catch (error) {
    console.error('Failed to login:', error.message);
    throw error;
  }
}

function getAPI() {
  return axios.create({
    baseURL: DIRECTUS_URL,
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
}

async function updateAccessibilityPages() {
  try {
    await login();
    const api = getAPI();

    // Fetch both pages
    const response = await api.get('/items/footer_content', {
      params: {
        filter: {
          slug: {
            _in: ['accessibility', 'vpat']
          }
        },
        fields: 'id,title,slug,content'
      }
    });

    const pages = response.data.data;

    console.log(`Found ${pages.length} pages to update\n`);

    for (const page of pages) {
      console.log(`Processing: ${page.title} (${page.slug})`);

      let updatedContent = page.content || '';

      if (page.slug === 'accessibility') {
        // Check if Blog Card Navigation section already exists
        const blogCardSectionExists = updatedContent.includes('Blog Card Navigation') ||
                                      updatedContent.includes('Read article: [Post Title]');

        if (blogCardSectionExists) {
          console.log('  → Blog Card Navigation section already exists, updating in place...');

          // Find and replace the existing section
          const sectionRegex = /<h3>Blog Card Navigation<\/h3>[\s\S]*?(?=<h[23]|$)/;
          const newSection = `<h3>Blog Card Navigation</h3>
<p><strong>Status:</strong> ✅ WCAG 2.4.4 Compliant (Link Purpose - In Context)</p>

<p>All blog post cards on the homepage and archive pages include descriptive <code>aria-label</code> attributes that provide full context to screen reader users:</p>

<ul>
  <li><strong>Format:</strong> "Read article: [Post Title]. [Post Excerpt]"</li>
  <li><strong>Benefit:</strong> Screen reader users hear the complete article title and summary before navigating</li>
  <li><strong>Visual Users:</strong> Continue to see the same clean card design with image, title, excerpt, and category tags</li>
  <li><strong>Keyboard Users:</strong> Receive full context when tabbing through blog cards</li>
</ul>

<p><strong>Implementation Details:</strong></p>
<ul>
  <li>Implemented: October 2025</li>
  <li>Scope: All blog posts across homepage and archive pages</li>
  <li>Visual impact: No changes - maintains clean design</li>
  <li>Standards: Meets WCAG 2.4.4 (Link Purpose - In Context) Level A requirement</li>
</ul>

`;

          if (sectionRegex.test(updatedContent)) {
            updatedContent = updatedContent.replace(sectionRegex, newSection);
          } else {
            // If section marker exists but regex doesn't match, append before closing tags
            if (updatedContent.includes('</body>')) {
              updatedContent = updatedContent.replace('</body>', '\n' + newSection + '</body>');
            } else {
              updatedContent += '\n' + newSection;
            }
          }
        } else {
          console.log('  → Adding new Blog Card Navigation section...');

          const newSection = `

<h3>Blog Card Navigation</h3>
<p><strong>Status:</strong> ✅ WCAG 2.4.4 Compliant (Link Purpose - In Context)</p>

<p>All blog post cards on the homepage and archive pages include descriptive <code>aria-label</code> attributes that provide full context to screen reader users:</p>

<ul>
  <li><strong>Format:</strong> "Read article: [Post Title]. [Post Excerpt]"</li>
  <li><strong>Benefit:</strong> Screen reader users hear the complete article title and summary before navigating</li>
  <li><strong>Visual Users:</strong> Continue to see the same clean card design with image, title, excerpt, and category tags</li>
  <li><strong>Keyboard Users:</strong> Receive full context when tabbing through blog cards</li>
</ul>

<p><strong>Implementation Details:</strong></p>
<ul>
  <li>Implemented: October 2025</li>
  <li>Scope: All blog posts across homepage and archive pages</li>
  <li>Visual impact: No changes - maintains clean design</li>
  <li>Standards: Meets WCAG 2.4.4 (Link Purpose - In Context) Level A requirement</li>
</ul>
`;

          // Insert before the closing tags
          if (updatedContent.includes('</body>')) {
            updatedContent = updatedContent.replace('</body>', newSection + '\n</body>');
          } else {
            updatedContent += newSection;
          }
        }

        // Check if Breadcrumb Navigation section exists
        const breadcrumbSectionExists = updatedContent.includes('Breadcrumb Navigation') ||
                                        updatedContent.includes('aria-label="Breadcrumb"');

        if (breadcrumbSectionExists) {
          console.log('  → Breadcrumb Navigation section already exists, updating in place...');

          const breadcrumbRegex = /<h3>Breadcrumb Navigation<\/h3>[\s\S]*?(?=<h[23]|$)/;
          const breadcrumbSection = `<h3>Breadcrumb Navigation</h3>
<p><strong>Status:</strong> ✅ WCAG 2.4.8 Compliant (Location - AAA)</p>

<p>All pages include WCAG-compliant breadcrumb navigation that helps users understand their location within the site hierarchy:</p>

<ul>
  <li><strong>Semantic Structure:</strong> Uses <code>&lt;nav aria-label="Breadcrumb"&gt;</code> with ordered list (<code>&lt;ol&gt;</code>)</li>
  <li><strong>Current Page Indicator:</strong> Uses <code>aria-current="page"</code> on current location</li>
  <li><strong>Screen Reader Friendly:</strong> Visual separators hidden with <code>aria-hidden="true"</code></li>
  <li><strong>Keyboard Accessible:</strong> All links fully navigable via keyboard</li>
</ul>

<p><strong>Implementation Details:</strong></p>
<ul>
  <li>Implemented: October 2025</li>
  <li>Scope: Blog posts, archive page, and all footer content pages</li>
  <li>Pattern: Home → [Category] → Current Page</li>
  <li>Standards: Meets WCAG 2.4.8 (Location) Level AAA and 2.4.5 (Multiple Ways) Level AA</li>
</ul>

`;

          if (breadcrumbRegex.test(updatedContent)) {
            updatedContent = updatedContent.replace(breadcrumbRegex, breadcrumbSection);
          } else {
            if (updatedContent.includes('</body>')) {
              updatedContent = updatedContent.replace('</body>', '\n' + breadcrumbSection + '</body>');
            } else {
              updatedContent += '\n' + breadcrumbSection;
            }
          }
        } else {
          console.log('  → Adding new Breadcrumb Navigation section...');

          const breadcrumbSection = `

<h3>Breadcrumb Navigation</h3>
<p><strong>Status:</strong> ✅ WCAG 2.4.8 Compliant (Location - AAA)</p>

<p>All pages include WCAG-compliant breadcrumb navigation that helps users understand their location within the site hierarchy:</p>

<ul>
  <li><strong>Semantic Structure:</strong> Uses <code>&lt;nav aria-label="Breadcrumb"&gt;</code> with ordered list (<code>&lt;ol&gt;</code>)</li>
  <li><strong>Current Page Indicator:</strong> Uses <code>aria-current="page"</code> on current location</li>
  <li><strong>Screen Reader Friendly:</strong> Visual separators hidden with <code>aria-hidden="true"</code></li>
  <li><strong>Keyboard Accessible:</strong> All links fully navigable via keyboard</li>
</ul>

<p><strong>Implementation Details:</strong></p>
<ul>
  <li>Implemented: October 2025</li>
  <li>Scope: Blog posts, archive page, and all footer content pages</li>
  <li>Pattern: Home → [Category] → Current Page</li>
  <li>Standards: Meets WCAG 2.4.8 (Location) Level AAA and 2.4.5 (Multiple Ways) Level AA</li>
</ul>
`;

          if (updatedContent.includes('</body>')) {
            updatedContent = updatedContent.replace('</body>', breadcrumbSection + '\n</body>');
          } else {
            updatedContent += breadcrumbSection;
          }
        }

      } else if (page.slug === 'vpat') {
        // Check if VPAT section already exists
        const vpatSectionExists = updatedContent.includes('Blog Card Navigation') ||
                                 updatedContent.includes('2.4.4 Link Purpose');

        if (vpatSectionExists) {
          console.log('  → VPAT section already exists, updating in place...');

          // Find and replace the existing VPAT section
          const sectionRegex = /<h[34]>(?:Recent Accessibility Improvements|Accessibility Conformance|Blog Card Navigation[\s\S]*?)<\/h[34]>[\s\S]*?(?=<h[23]|$)/;
          const newSection = `<h3>Accessibility Conformance - Interactive Elements</h3>

<h4>Blog Card Navigation</h4>
<table>
  <thead>
    <tr>
      <th>Criteria</th>
      <th>Conformance Level</th>
      <th>Remarks and Explanations</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>2.4.4 Link Purpose (In Context)</strong></td>
      <td>✅ Supports</td>
      <td>All blog post cards include descriptive aria-label attributes: "Read article: [Title]. [Excerpt]". Provides full context to screen reader and keyboard users before navigation.</td>
    </tr>
    <tr>
      <td><strong>4.1.2 Name, Role, Value</strong></td>
      <td>✅ Supports</td>
      <td>All blog cards properly identify as links with descriptive labels. Navigation purpose is clear to assistive technologies.</td>
    </tr>
  </tbody>
</table>

<p><strong>Implementation Summary:</strong> Blog cards across homepage and archive pages provide comprehensive navigation context through aria-label attributes, meeting WCAG 2.4.4 Level A requirements. Updated October 2025.</p>

`;

          if (sectionRegex.test(updatedContent)) {
            updatedContent = updatedContent.replace(sectionRegex, newSection);
          } else {
            // If section marker exists but regex doesn't match, append before closing tags
            if (updatedContent.includes('</body>')) {
              updatedContent = updatedContent.replace('</body>', '\n' + newSection + '</body>');
            } else {
              updatedContent += '\n' + newSection;
            }
          }
        } else {
          console.log('  → Adding new VPAT section...');

          const newSection = `

<h3>Accessibility Conformance - Interactive Elements</h3>

<h4>Blog Card Navigation</h4>
<table>
  <thead>
    <tr>
      <th>Criteria</th>
      <th>Conformance Level</th>
      <th>Remarks and Explanations</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>2.4.4 Link Purpose (In Context)</strong></td>
      <td>✅ Supports</td>
      <td>All blog post cards include descriptive aria-label attributes: "Read article: [Title]. [Excerpt]". Provides full context to screen reader and keyboard users before navigation.</td>
    </tr>
    <tr>
      <td><strong>4.1.2 Name, Role, Value</strong></td>
      <td>✅ Supports</td>
      <td>All blog cards properly identify as links with descriptive labels. Navigation purpose is clear to assistive technologies.</td>
    </tr>
  </tbody>
</table>

<p><strong>Implementation Summary:</strong> Blog cards across homepage and archive pages provide comprehensive navigation context through aria-label attributes, meeting WCAG 2.4.4 Level A requirements. Updated October 2025.</p>
`;

          // Insert before closing tags
          if (updatedContent.includes('</body>')) {
            updatedContent = updatedContent.replace('</body>', newSection + '\n</body>');
          } else {
            updatedContent += newSection;
          }
        }

        // Check if Breadcrumb Navigation VPAT section exists
        const breadcrumbVpatExists = updatedContent.includes('Breadcrumb Navigation') ||
                                     updatedContent.includes('2.4.8 Location');

        if (breadcrumbVpatExists) {
          console.log('  → Breadcrumb Navigation VPAT section already exists, updating in place...');

          const breadcrumbRegex = /<h4>Breadcrumb Navigation<\/h4>[\s\S]*?(?=<h[23]|<h4|$)/;
          const breadcrumbSection = `<h4>Breadcrumb Navigation</h4>
<table>
  <thead>
    <tr>
      <th>Criteria</th>
      <th>Conformance Level</th>
      <th>Remarks and Explanations</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>2.4.8 Location</strong></td>
      <td>✅ Supports (AAA)</td>
      <td>Breadcrumb navigation implemented on all pages using semantic HTML (<code>&lt;nav aria-label="Breadcrumb"&gt;</code> with <code>&lt;ol&gt;</code>). Current page marked with <code>aria-current="page"</code>.</td>
    </tr>
    <tr>
      <td><strong>2.4.5 Multiple Ways</strong></td>
      <td>✅ Supports (AA)</td>
      <td>Breadcrumbs provide an alternative navigation method to find pages. Users can navigate back through hierarchy at any level.</td>
    </tr>
    <tr>
      <td><strong>4.1.2 Name, Role, Value</strong></td>
      <td>✅ Supports</td>
      <td>Breadcrumb landmarks properly identified. Visual separators hidden from screen readers using <code>aria-hidden="true"</code>. All navigation links keyboard accessible.</td>
    </tr>
  </tbody>
</table>

<p><strong>Implementation Summary:</strong> Breadcrumb navigation follows W3C ARIA Authoring Practices Guide. Implemented across blog posts, archive, and footer pages. Updated October 2025.</p>

`;

          if (breadcrumbRegex.test(updatedContent)) {
            updatedContent = updatedContent.replace(breadcrumbRegex, breadcrumbSection);
          } else {
            if (updatedContent.includes('</body>')) {
              updatedContent = updatedContent.replace('</body>', '\n' + breadcrumbSection + '</body>');
            } else {
              updatedContent += '\n' + breadcrumbSection;
            }
          }
        } else {
          console.log('  → Adding new Breadcrumb Navigation VPAT section...');

          const breadcrumbSection = `

<h4>Breadcrumb Navigation</h4>
<table>
  <thead>
    <tr>
      <th>Criteria</th>
      <th>Conformance Level</th>
      <th>Remarks and Explanations</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>2.4.8 Location</strong></td>
      <td>✅ Supports (AAA)</td>
      <td>Breadcrumb navigation implemented on all pages using semantic HTML (<code>&lt;nav aria-label="Breadcrumb"&gt;</code> with <code>&lt;ol&gt;</code>). Current page marked with <code>aria-current="page"</code>.</td>
    </tr>
    <tr>
      <td><strong>2.4.5 Multiple Ways</strong></td>
      <td>✅ Supports (AA)</td>
      <td>Breadcrumbs provide an alternative navigation method to find pages. Users can navigate back through hierarchy at any level.</td>
    </tr>
    <tr>
      <td><strong>4.1.2 Name, Role, Value</strong></td>
      <td>✅ Supports</td>
      <td>Breadcrumb landmarks properly identified. Visual separators hidden from screen readers using <code>aria-hidden="true"</code>. All navigation links keyboard accessible.</td>
    </tr>
  </tbody>
</table>

<p><strong>Implementation Summary:</strong> Breadcrumb navigation follows W3C ARIA Authoring Practices Guide. Implemented across blog posts, archive, and footer pages. Updated October 2025.</p>
`;

          if (updatedContent.includes('</body>')) {
            updatedContent = updatedContent.replace('</body>', breadcrumbSection + '\n</body>');
          } else {
            updatedContent += breadcrumbSection;
          }
        }
      }

      // Update the page
      await api.patch(`/items/footer_content/${page.id}`, {
        content: updatedContent
      });

      console.log(`✓ Updated ${page.title}\n`);
    }

    console.log('='.repeat(80));
    console.log('✅ COMPLETE!');
    console.log('='.repeat(80));
    console.log(`Updated ${pages.length} pages with integrated accessibility improvements`);
    console.log('- /accessibility: Blog Card Navigation + Breadcrumb Navigation sections');
    console.log('- /vpat: Blog Card Navigation + Breadcrumb Navigation VPAT tables');
    console.log('='.repeat(80));

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

updateAccessibilityPages();
