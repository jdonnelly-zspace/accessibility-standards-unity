# WCAG 2.2 Level AAA - Tier 1 Quick Wins

**Status:** Production Ready
**Implementation Time:** 1-2 weeks
**Effort Level:** LOW to MEDIUM
**Criteria Covered:** 5 Level AAA Success Criteria

---

## Overview

This document covers **5 Level AAA success criteria** that can be implemented quickly (1-2 weeks) with significant impact. These are the "quick wins" that provide immediate accessibility improvements without major architectural changes.

**These criteria enhance your existing Level AA compliance** and represent the most practical subset of Level AAA requirements.

---

## Tier 1 Criteria

### ✅ 2.2.6 Timeouts (Level AAA) 🆕

**Requirement:** Users are warned of the duration of any user inactivity that could cause data loss, unless data is preserved for more than 20 hours of inactivity.

**What it means:**
- Inform users upfront about session timeout duration
- Display timeout information in the UI or help documentation
- Or automatically save/preserve data for 20+ hours

**Why it matters:**
- Users with cognitive disabilities need more time to complete tasks
- Users know when they need to return to complete work
- Reduces anxiety about losing work

**Implementation:**

```jsx
// SessionTimeout.jsx
import { useState, useEffect } from 'react';

/**
 * Component that displays session timeout information to users
 * Satisfies SC 2.2.6: Timeouts (Level AAA)
 */
function SessionTimeout({ timeoutMinutes = 30 }) {
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(timeoutMinutes * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 300) { // 5 minutes
          setShowWarning(true);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="session-timeout">
      {/* Always visible timeout information */}
      <div className="timeout-info" role="status" aria-live="polite">
        <p>
          <strong>Session timeout:</strong> Your session will expire after{' '}
          {timeoutMinutes} minutes of inactivity.
        </p>
      </div>

      {/* Warning when timeout is approaching */}
      {showWarning && (
        <div
          className="timeout-warning"
          role="alert"
          aria-live="assertive"
        >
          <h2>Session Expiring Soon</h2>
          <p>
            Your session will expire in {formatTime(timeRemaining)}.
            Any unsaved changes will be lost.
          </p>
          <button onClick={() => {/* extend session */}}>
            Extend Session
          </button>
          <button onClick={() => {/* save work */}}>
            Save Work
          </button>
        </div>
      )}
    </div>
  );
}

export default SessionTimeout;
```

**Alternative: Documentation Approach**

If your app auto-saves data for 20+ hours, simply document this:

```jsx
// Help documentation or login page
function SessionInfo() {
  return (
    <div className="session-info">
      <h2>Session Information</h2>
      <p>
        Your work is automatically saved and will be preserved for 24 hours
        of inactivity. You can safely close your browser and return later.
      </p>
    </div>
  );
}
```

**CSS:**

```css
/* Session timeout styling */
.timeout-info {
  background-color: #e3f2fd;
  border-left: 4px solid #1976d2;
  padding: 1rem;
  margin: 1rem 0;
}

.timeout-warning {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border: 2px solid #f44336;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10000;
  max-width: 500px;
}

.timeout-warning h2 {
  color: #f44336;
  margin-top: 0;
}

.timeout-warning button {
  margin-right: 1rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
}
```

**Testing:**

```javascript
// Playwright test
test('SC 2.2.6: Timeouts - Session timeout information visible', async ({ page }) => {
  await page.goto('/');

  // Check for timeout information in UI or help section
  const timeoutInfo = await page.locator('[class*="timeout"], [class*="session"]').first();

  if (await timeoutInfo.isVisible()) {
    const text = await timeoutInfo.textContent();
    expect(text).toMatch(/\d+\s*(minute|hour|day)/i);
    console.log('✓ Session timeout duration displayed');
  }

  // Or check help documentation
  await page.goto('/help');
  const helpContent = await page.textContent('body');
  if (helpContent.includes('session') || helpContent.includes('timeout')) {
    console.log('✓ Session timeout documented in help');
  }
});
```

**Manual Testing:**
- [ ] Timeout duration is displayed in UI or help documentation
- [ ] Users see warning before timeout (recommended)
- [ ] OR data auto-saves for 20+ hours

**Common Implementation:**
- Display timeout in footer: "Session expires after 30 minutes of inactivity"
- Add to help/FAQ: "Your session will timeout after X minutes"
- Show countdown when 5 minutes remain
- Or implement auto-save with 20+ hour retention

---

### ✅ 2.3.2 Three Flashes (Level AAA) 🆕

**Requirement:** Web pages do not contain anything that flashes more than three times in any one second period.

**What it means:**
- Absolute limit: **3 flashes per second** (no exceptions)
- Stricter than Level A (2.3.1) which allows flashes below certain thresholds
- Prevents seizures in photosensitive users

**Why it matters:**
- Protects users with photosensitive epilepsy
- Level A allows some flashing; Level AAA removes all exceptions
- Even small flashing elements can trigger seizures

**Implementation:**

```css
/* Safe animation alternatives - NO flashing */

/* ✓ GOOD: Fade animation (no flash) */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fade-in {
  animation: fadeIn 0.5s ease-in;
}

/* ✓ GOOD: Slide animation */
@keyframes slideIn {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

.slide-in {
  animation: slideIn 0.3s ease-out;
}

/* ✓ GOOD: Gentle pulse (slow, not flashing) */
@keyframes gentlePulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.pulse {
  animation: gentlePulse 2s ease-in-out infinite;
  /* 2 second cycle = 0.5 flashes per second ✓ */
}

/* ✗ BAD: Rapid flashing (more than 3 per second) */
@keyframes rapidFlash {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.flash-bad {
  animation: rapidFlash 0.3s ease-in-out infinite;
  /* 0.3s cycle = 3.33 flashes per second ✗ */
}

/* ✓ GOOD: Same effect, slowed down */
.flash-good {
  animation: rapidFlash 0.4s ease-in-out infinite;
  /* 0.4s cycle = 2.5 flashes per second ✓ */
}
```

**JavaScript Guidelines:**

```javascript
// ✓ GOOD: Notification with single flash
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification fade-in';
  notification.textContent = message;
  document.body.appendChild(notification);

  // Fade in once, no flashing
  setTimeout(() => notification.remove(), 3000);
}

// ✗ BAD: Rapid alert flashing
function dangerousAlert() {
  const alert = document.createElement('div');
  alert.className = 'alert';

  // Flashes 5 times per second ✗
  setInterval(() => {
    alert.style.backgroundColor =
      alert.style.backgroundColor === 'red' ? 'white' : 'red';
  }, 100);
}

// ✓ GOOD: Static alert with gentle animation
function safeAlert() {
  const alert = document.createElement('div');
  alert.className = 'alert';
  alert.style.backgroundColor = 'red';

  // Single fade-in, no flashing
  alert.style.animation = 'fadeIn 0.3s ease-in';
}
```

**Video Content:**

```jsx
function VideoWithWarning({ src, hasFlashes }) {
  return (
    <div>
      {hasFlashes && (
        <div className="flash-warning" role="alert">
          <strong>Warning:</strong> This video contains flashing lights
          that may trigger seizures in people with photosensitive epilepsy.
          Viewer discretion is advised.
        </div>
      )}

      <video controls src={src}>
        <track kind="captions" src="captions.vtt" />
      </video>
    </div>
  );
}
```

**Testing:**

```javascript
// Playwright test
test('SC 2.3.2: Three Flashes - No rapid flashing animations', async ({ page }) => {
  await page.goto('/');

  // Check CSS animations
  const animations = await page.evaluate(() => {
    const elements = document.querySelectorAll('*');
    const flashingElements = [];

    elements.forEach(el => {
      const computed = window.getComputedStyle(el);
      const animationName = computed.animationName;
      const animationDuration = computed.animationDuration;

      if (animationName !== 'none' && animationDuration !== '0s') {
        const duration = parseFloat(animationDuration);
        const flashesPerSecond = 1 / duration;

        if (flashesPerSecond > 3) {
          flashingElements.push({
            tag: el.tagName,
            class: el.className,
            animation: animationName,
            flashesPerSecond: flashesPerSecond.toFixed(2)
          });
        }
      }
    });

    return flashingElements;
  });

  expect(animations.length).toBe(0);
  console.log('✓ No animations flash more than 3 times per second');
});
```

**Manual Testing:**
- [ ] Review all animations for flashing
- [ ] Calculate flashes per second: 1 / animation-duration
- [ ] Ensure all animations < 3 flashes per second
- [ ] Check videos for flashing content
- [ ] Add warnings to videos with flashing

**Tool:** PEAT (Photosensitive Epilepsy Analysis Tool)
- Download: https://trace.umd.edu/peat/
- Analyzes video content for flashing
- Free tool from University of Maryland

---

### ✅ 2.4.10 Section Headings (Level AAA) 🆕

**Requirement:** Section headings are used to organize the content.

**What it means:**
- Break up long content with descriptive headings
- Logical heading hierarchy (h1 → h2 → h3)
- Headings describe the content that follows
- No long walls of text without structure

**Why it matters:**
- Helps all users scan and navigate content
- Screen reader users jump between headings
- Users with cognitive disabilities process content better
- Improves SEO and readability

**Implementation:**

```jsx
// ✗ BAD: No headings - wall of text
function BadArticle() {
  return (
    <article>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
      <p>Sed do eiusmod tempor incididunt ut labore et dolore magna...</p>
      <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco...</p>
      <p>Duis aute irure dolor in reprehenderit in voluptate velit...</p>
      <p>Excepteur sint occaecat cupidatat non proident, sunt in...</p>
    </article>
  );
}

// ✓ GOOD: Well-structured with headings
function GoodArticle() {
  return (
    <article>
      <h1>Accessibility Best Practices for Web Developers</h1>

      <section>
        <h2>Why Accessibility Matters</h2>
        <p>
          Web accessibility ensures that people with disabilities can
          perceive, understand, navigate, and interact with websites...
        </p>
      </section>

      <section>
        <h2>Getting Started</h2>

        <h3>Install Required Tools</h3>
        <p>Begin by installing ESLint and the jsx-a11y plugin...</p>

        <h3>Configure Your Project</h3>
        <p>Add the following configuration to your eslint.config.js...</p>
      </section>

      <section>
        <h2>Testing Your Application</h2>

        <h3>Automated Testing</h3>
        <p>Run automated tests with Playwright and axe-core...</p>

        <h3>Manual Testing</h3>
        <p>Use a screen reader to verify your application...</p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>Avoid these common accessibility mistakes...</p>
      </section>
    </article>
  );
}
```

**Dashboard Example:**

```jsx
function Dashboard() {
  return (
    <div className="dashboard">
      <h1>User Dashboard</h1>

      <section className="overview">
        <h2>Account Overview</h2>
        <p>Welcome back! Here's your account summary...</p>
      </section>

      <section className="statistics">
        <h2>Usage Statistics</h2>

        <div className="stat-group">
          <h3>This Month</h3>
          <ul>
            <li>Projects: 12</li>
            <li>Tasks: 45</li>
          </ul>
        </div>

        <div className="stat-group">
          <h3>All Time</h3>
          <ul>
            <li>Projects: 156</li>
            <li>Tasks: 2,340</li>
          </ul>
        </div>
      </section>

      <section className="recent-activity">
        <h2>Recent Activity</h2>
        <ul>
          <li>Completed "Update documentation" - 2 hours ago</li>
          <li>Created new project "Marketing Site" - 5 hours ago</li>
        </ul>
      </section>

      <section className="quick-actions">
        <h2>Quick Actions</h2>
        <button>Create New Project</button>
        <button>View All Tasks</button>
      </section>
    </div>
  );
}
```

**Documentation Page Structure:**

```jsx
function DocumentationPage() {
  return (
    <main>
      <h1>API Documentation</h1>

      {/* Table of contents generated from headings */}
      <nav aria-label="Table of contents">
        <h2>Contents</h2>
        <ul>
          <li><a href="#authentication">Authentication</a></li>
          <li><a href="#endpoints">API Endpoints</a></li>
          <li><a href="#errors">Error Handling</a></li>
        </ul>
      </nav>

      <section id="authentication">
        <h2>Authentication</h2>

        <h3>API Keys</h3>
        <p>Generate an API key from your dashboard...</p>

        <h3>OAuth 2.0</h3>
        <p>For user-specific access, use OAuth 2.0...</p>
      </section>

      <section id="endpoints">
        <h2>API Endpoints</h2>

        <h3>Users</h3>
        <h4>GET /users</h4>
        <p>Retrieve a list of users...</p>

        <h4>POST /users</h4>
        <p>Create a new user...</p>
      </section>

      <section id="errors">
        <h2>Error Handling</h2>
        <p>All errors return a consistent format...</p>
      </section>
    </main>
  );
}
```

**Testing:**

```javascript
// Playwright test
test('SC 2.4.10: Section Headings - Content organized with headings', async ({ page }) => {
  await page.goto('/');

  // Get all headings
  const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
  const headingCount = headings.length;

  expect(headingCount).toBeGreaterThan(0);
  console.log(`✓ Found ${headingCount} headings on page`);

  // Check heading hierarchy
  const headingLevels = await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    return headings.map(h => ({
      level: parseInt(h.tagName.substring(1)),
      text: h.textContent.trim()
    }));
  });

  // Verify logical hierarchy (no skipping levels)
  for (let i = 1; i < headingLevels.length; i++) {
    const diff = headingLevels[i].level - headingLevels[i - 1].level;
    if (diff > 1) {
      console.warn(`⚠ Heading level skipped: ${headingLevels[i - 1].text} (h${headingLevels[i - 1].level}) → ${headingLevels[i].text} (h${headingLevels[i].level})`);
    }
  }
});
```

**Manual Testing:**
- [ ] Long content (>3 paragraphs) has headings
- [ ] Headings are descriptive
- [ ] Heading hierarchy is logical (h1 → h2 → h3, no skipping)
- [ ] Screen reader can navigate by headings
- [ ] Headings aren't used just for styling

**Tools:**
- HeadingsMap browser extension
- WAVE (shows heading structure)
- Screen reader (jump between headings)

---

### ✅ 3.1.4 Abbreviations (Level AAA) 🆕

**Requirement:** A mechanism for identifying the expanded form or meaning of abbreviations is available.

**What it means:**
- First use of abbreviation includes full form
- Or provide a glossary of abbreviations
- Or use `<abbr>` tag with title attribute
- Helps non-native speakers and users with cognitive disabilities

**Why it matters:**
- Not everyone knows common abbreviations (API, FAQ, etc.)
- Context clarifies meaning
- Benefits non-native speakers, new users, cognitive disabilities

**Implementation:**

**Pattern 1: `<abbr>` Tag**

```jsx
function DocumentationWithAbbreviations() {
  return (
    <article>
      <h1>Getting Started with Our API</h1>

      <p>
        The{' '}
        <abbr title="Application Programming Interface">API</abbr>{' '}
        allows you to integrate our service with your application.
      </p>

      <p>
        All{' '}
        <abbr title="HyperText Transfer Protocol Secure">HTTPS</abbr>{' '}
        requests require authentication via{' '}
        <abbr title="JavaScript Object Notation">JSON</abbr>{' '}
        Web Tokens.
      </p>

      <h2>
        <abbr title="Frequently Asked Questions">FAQ</abbr>
      </h2>
    </article>
  );
}
```

**Pattern 2: First Use Expansion**

```jsx
function ContentWithExpansion() {
  return (
    <article>
      <p>
        The Web Content Accessibility Guidelines (WCAG) 2.2 specification
        provides comprehensive standards for web accessibility. WCAG includes
        three levels of conformance: A, AA, and AAA.
      </p>

      <p>
        {/* Subsequent uses can be abbreviated */}
        To achieve WCAG Level AA compliance, follow these guidelines...
      </p>
    </article>
  );
}
```

**Pattern 3: Glossary Component**

```jsx
// AbbreviationGlossary.jsx
import { useState } from 'react';

const GLOSSARY = [
  { abbr: 'API', full: 'Application Programming Interface', definition: 'A set of rules and protocols for building software applications.' },
  { abbr: 'CSS', full: 'Cascading Style Sheets', definition: 'A language for styling HTML documents.' },
  { abbr: 'FAQ', full: 'Frequently Asked Questions', definition: 'A list of common questions and answers.' },
  { abbr: 'HTML', full: 'HyperText Markup Language', definition: 'The standard markup language for web pages.' },
  { abbr: 'HTTP', full: 'HyperText Transfer Protocol', definition: 'Protocol for transmitting web pages.' },
  { abbr: 'HTTPS', full: 'HyperText Transfer Protocol Secure', definition: 'Secure version of HTTP.' },
  { abbr: 'JSON', full: 'JavaScript Object Notation', definition: 'A lightweight data interchange format.' },
  { abbr: 'REST', full: 'Representational State Transfer', definition: 'An architectural style for web services.' },
  { abbr: 'WCAG', full: 'Web Content Accessibility Guidelines', definition: 'International standards for web accessibility.' },
  { abbr: 'XML', full: 'Extensible Markup Language', definition: 'A markup language for storing and transporting data.' },
];

/**
 * Abbreviation glossary component
 * Satisfies SC 3.1.4: Abbreviations (Level AAA)
 */
function AbbreviationGlossary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('all');

  const filteredGlossary = GLOSSARY.filter(item => {
    const matchesSearch =
      item.abbr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.full.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLetter =
      selectedLetter === 'all' ||
      item.abbr[0].toLowerCase() === selectedLetter.toLowerCase();

    return matchesSearch && matchesLetter;
  });

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="glossary">
      <h1>Abbreviations Glossary</h1>

      {/* Search */}
      <div className="glossary-search">
        <label htmlFor="glossary-search">
          Search abbreviations:
        </label>
        <input
          type="text"
          id="glossary-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter abbreviation or full name"
        />
      </div>

      {/* Alphabet filter */}
      <nav className="glossary-alphabet" aria-label="Filter by letter">
        <button
          onClick={() => setSelectedLetter('all')}
          className={selectedLetter === 'all' ? 'active' : ''}
        >
          All
        </button>
        {letters.map(letter => (
          <button
            key={letter}
            onClick={() => setSelectedLetter(letter)}
            className={selectedLetter === letter ? 'active' : ''}
          >
            {letter}
          </button>
        ))}
      </nav>

      {/* Glossary list */}
      <dl className="glossary-list">
        {filteredGlossary.map(item => (
          <div key={item.abbr} className="glossary-item">
            <dt>
              <strong>{item.abbr}</strong>
            </dt>
            <dd>
              <em>{item.full}</em>
              <p>{item.definition}</p>
            </dd>
          </div>
        ))}
      </dl>

      {filteredGlossary.length === 0 && (
        <p className="no-results">
          No abbreviations found matching "{searchTerm}"
        </p>
      )}

      <p className="glossary-footer">
        Found {filteredGlossary.length} abbreviation{filteredGlossary.length !== 1 ? 's' : ''}
      </p>
    </div>
  );
}

export default AbbreviationGlossary;
```

**CSS:**

```css
/* Abbreviation styling */
abbr {
  text-decoration: underline dotted;
  cursor: help;
}

abbr:hover,
abbr:focus {
  background-color: #fffbcc;
  outline: 2px solid #ffd700;
}

/* Glossary styling */
.glossary {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.glossary-search {
  margin-bottom: 2rem;
}

.glossary-search label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.glossary-search input {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.glossary-alphabet {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #ddd;
  padding-bottom: 1rem;
}

.glossary-alphabet button {
  padding: 0.25rem 0.5rem;
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  cursor: pointer;
  font-size: 0.9rem;
}

.glossary-alphabet button.active {
  background-color: #1976d2;
  color: white;
  border-color: #1976d2;
}

.glossary-list {
  margin: 0;
  padding: 0;
}

.glossary-item {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.glossary-item dt {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.glossary-item dd {
  margin-left: 2rem;
}

.glossary-item em {
  display: block;
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 0.5rem;
}

.no-results {
  text-align: center;
  color: #777;
  font-style: italic;
  padding: 2rem;
}
```

**Testing:**

```javascript
// Playwright test
test('SC 3.1.4: Abbreviations - Expanded forms available', async ({ page }) => {
  await page.goto('/');

  // Check for <abbr> tags
  const abbrTags = await page.locator('abbr').all();

  for (const abbr of abbrTags) {
    const title = await abbr.getAttribute('title');
    const text = await abbr.textContent();

    expect(title).toBeTruthy();
    console.log(`✓ Abbreviation "${text}" has expansion: "${title}"`);
  }

  // Check for glossary page
  const glossaryLink = await page.locator('a[href*="glossary"]').first();
  if (await glossaryLink.count() > 0) {
    console.log('✓ Glossary page available');
  }
});
```

**Manual Testing:**
- [ ] Common abbreviations use `<abbr>` tag
- [ ] First use of abbreviations includes full form
- [ ] Glossary page exists (recommended)
- [ ] Technical/industry abbreviations are defined
- [ ] Abbreviations are searchable

**Common abbreviations to mark:**
- Technical: API, CSS, HTML, HTTP, JSON, REST, XML, SQL
- Business: FAQ, ROI, KPI, SaaS, B2B, B2C
- General: etc., e.g., i.e., vs., ASAP

---

### ✅ 3.2.5 Change on Request (Level AAA) 🆕

**Requirement:** Changes of context are initiated only by user request, OR a mechanism is available to turn off such changes.

**What it means:**
- No automatic redirects
- No auto-submission of forms
- No unexpected navigation changes
- No pop-ups that open automatically
- User controls all navigation

**Why it matters:**
- Predictable behavior reduces confusion
- Users with cognitive disabilities need control
- Screen reader users need to understand what's happening
- Mobile users may not see what changed

**Implementation:**

**✗ BAD Examples:**

```jsx
// ✗ BAD: Automatic redirect
function BadRedirect() {
  useEffect(() => {
    // Redirects after 3 seconds without user action
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 3000);
  }, []);

  return <p>Redirecting to dashboard...</p>;
}

// ✗ BAD: Auto-submit on select change
function BadFormAutoSubmit() {
  return (
    <form action="/filter" method="get">
      <label htmlFor="category">Category:</label>
      <select
        id="category"
        name="category"
        onChange={(e) => e.target.form.submit()} // ✗ Auto-submits
      >
        <option>All</option>
        <option>Electronics</option>
        <option>Clothing</option>
      </select>
    </form>
  );
}

// ✗ BAD: New window opens automatically
function BadAutoPopup() {
  useEffect(() => {
    window.open('/popup', '_blank'); // ✗ Opens without user action
  }, []);

  return <div>Welcome!</div>;
}
```

**✓ GOOD Examples:**

```jsx
// ✓ GOOD: User-initiated redirect with clear button
function GoodRedirect() {
  const navigate = useNavigate();

  return (
    <div>
      <p>Setup complete! You can now access your dashboard.</p>
      <button onClick={() => navigate('/dashboard')}>
        Go to Dashboard
      </button>
      <button onClick={() => navigate('/')}>
        Stay on Home Page
      </button>
    </div>
  );
}

// ✓ GOOD: Form with explicit submit button
function GoodFormSubmit() {
  const [category, setCategory] = useState('all');

  return (
    <form action="/filter" method="get">
      <label htmlFor="category">Category:</label>
      <select
        id="category"
        name="category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="all">All</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
      </select>

      {/* Explicit submit button - user controls submission */}
      <button type="submit">Apply Filter</button>
    </form>
  );
}

// ✓ GOOD: User chooses to open new window
function GoodOptionalPopup() {
  return (
    <div>
      <p>View our product catalog:</p>
      <button onClick={() => window.open('/catalog', '_blank')}>
        Open Catalog in New Window
      </button>
      <a href="/catalog">View Catalog on This Page</a>
    </div>
  );
}

// ✓ GOOD: Timed redirect with user control
function GoodTimedRedirect() {
  const [countdown, setCountdown] = useState(10);
  const [cancelled, setCancelled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (cancelled) return;

    if (countdown === 0) {
      navigate('/dashboard');
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, cancelled, navigate]);

  if (cancelled) {
    return <p>Redirect cancelled. <a href="/">Stay on home page</a></p>;
  }

  return (
    <div role="status" aria-live="polite">
      <p>
        Setup complete! Redirecting to dashboard in {countdown} seconds...
      </p>
      <button onClick={() => setCancelled(true)}>
        Cancel Redirect
      </button>
      <button onClick={() => navigate('/dashboard')}>
        Go Now
      </button>
    </div>
  );
}
```

**Search Results with Live Region (No Page Reload):**

```jsx
function SearchWithLiveRegion() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const data = await fetch(`/api/search?q=${query}`);
    const json = await data.json();
    setResults(json.results);
  };

  return (
    <div>
      <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
        <label htmlFor="search">Search:</label>
        <input
          type="text"
          id="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {/* Results update in place, no navigation change */}
      <div role="region" aria-live="polite" aria-atomic="true">
        {results.length > 0 && (
          <p>{results.length} results found</p>
        )}
        <ul>
          {results.map(result => (
            <li key={result.id}>{result.title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

**Testing:**

```javascript
// Playwright test
test('SC 3.2.5: Change on Request - No automatic context changes', async ({ page }) => {
  await page.goto('/');

  // Check for automatic redirects (meta refresh)
  const metaRefresh = await page.locator('meta[http-equiv="refresh"]').count();
  expect(metaRefresh).toBe(0);
  console.log('✓ No meta refresh redirects');

  // Check for auto-submitting forms
  await page.goto('/search');

  const selects = await page.locator('select').all();
  for (const select of selects) {
    const onChange = await select.getAttribute('onchange');
    if (onChange && onChange.includes('submit()')) {
      throw new Error('Form auto-submits on select change');
    }
  }
  console.log('✓ No auto-submitting forms');

  // Check for automatic popups
  page.on('popup', () => {
    throw new Error('Automatic popup detected');
  });

  await page.waitForTimeout(2000);
  console.log('✓ No automatic popups');
});
```

**Manual Testing:**
- [ ] No automatic redirects (check `<meta http-equiv="refresh">`)
- [ ] Forms don't auto-submit on input change
- [ ] No pop-ups open without user action
- [ ] Select dropdowns require explicit "Apply" or "Submit"
- [ ] Navigation is predictable and controlled by user

**What counts as "change of context":**
- Opening new window/tab
- Moving focus to different component
- Navigating to new page
- Significantly rearranging page content

**Exceptions:**
- User clicks a link/button (user-initiated)
- Form submission after clicking "Submit" (expected)
- Auto-save that doesn't change visible content (OK)

---

## Summary Checklist

### Quick Implementation Checklist

**2.2.6 Timeouts:**
- [ ] Display session timeout duration in UI or help docs
- [ ] OR implement auto-save with 20+ hour retention
- [ ] Add warning before session expires (recommended)

**2.3.2 Three Flashes:**
- [ ] Review all animations - ensure < 3 flashes per second
- [ ] Calculate: flashes per second = 1 / animation-duration
- [ ] Add warnings to videos with flashing content
- [ ] Use PEAT tool to analyze video content

**2.4.10 Section Headings:**
- [ ] Add headings to all long content (>3 paragraphs)
- [ ] Ensure logical hierarchy (h1 → h2 → h3)
- [ ] Headings are descriptive
- [ ] Test with HeadingsMap extension

**3.1.4 Abbreviations:**
- [ ] Use `<abbr>` tag for common abbreviations
- [ ] First use includes full form
- [ ] Create abbreviation glossary page
- [ ] Link to glossary from footer/help

**3.2.5 Change on Request:**
- [ ] Remove auto-redirects (no `<meta refresh>`)
- [ ] Add explicit "Submit" buttons to forms
- [ ] No auto-submit on select/dropdown change
- [ ] User controls all navigation

---

## Testing Summary

### Automated Tests

Add to your `accessibility.spec.js`:

```javascript
// Run all Tier 1 Level AAA tests
test.describe('WCAG 2.2 Level AAA - Tier 1', () => {
  test('SC 2.2.6: Timeouts', async ({ page }) => { /* ... */ });
  test('SC 2.3.2: Three Flashes', async ({ page }) => { /* ... */ });
  test('SC 2.4.10: Section Headings', async ({ page }) => { /* ... */ });
  test('SC 3.1.4: Abbreviations', async ({ page }) => { /* ... */ });
  test('SC 3.2.5: Change on Request', async ({ page }) => { /* ... */ });
});
```

### Manual Testing

**Time required:** 2-3 hours
**Tester role:** QA Engineer or Developer

1. **Timeouts** (15 min)
   - Check for timeout documentation
   - Test session expiration warning

2. **Three Flashes** (30 min)
   - Review all animations
   - Calculate animation speeds
   - Check videos for flashing

3. **Section Headings** (30 min)
   - Review content structure
   - Test with HeadingsMap
   - Navigate with screen reader

4. **Abbreviations** (45 min)
   - List all abbreviations used
   - Verify expansions available
   - Test glossary functionality

5. **Change on Request** (30 min)
   - Test all forms
   - Check for auto-redirects
   - Test select dropdowns

---

## Implementation Timeline

### Week 1: Development
- **Days 1-2:** Implement SessionTimeout component, update documentation
- **Day 3:** Review and fix animations, add flash warnings
- **Day 4:** Add section headings to content, improve structure
- **Day 5:** Create AbbreviationGlossary component, mark abbreviations

### Week 2: Testing & Refinement
- **Days 1-2:** Remove auto-redirects, add explicit submit buttons
- **Day 3:** Automated testing with Playwright
- **Day 4:** Manual testing (QA)
- **Day 5:** Fix issues, final review, documentation

**Total time:** 10 business days (1-2 weeks)

---

## Next Steps

1. **Install components:**
   ```bash
   cp implementation/development/components/SessionTimeout.jsx your-app/src/components/
   cp implementation/development/components/AbbreviationGlossary.jsx your-app/src/components/
   ```

2. **Update tests:**
   ```bash
   cp implementation/testing/playwright-setup/accessibility-aaa-tier1.spec.js your-app/tests/
   ```

3. **Run tests:**
   ```bash
   npx playwright test accessibility-aaa-tier1.spec.js
   ```

4. **Update documentation:**
   - Add timeout information to help docs
   - Create glossary page
   - Review content for headings

5. **Deploy and monitor:**
   - Test in production
   - Gather user feedback
   - Monitor for regressions

---

## Resources

**Official Standards:**
- W3C WCAG 2.2: https://www.w3.org/WAI/WCAG22/quickref/?levels=aaa
- Understanding WCAG 2.2: https://www.w3.org/WAI/WCAG22/Understanding/

**Tools:**
- PEAT (Photosensitive Epilepsy Analysis Tool): https://trace.umd.edu/peat/
- HeadingsMap Extension: https://chromewebstore.google.com/
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/

**Further Reading:**
- See `standards/WCAG-2.2-LEVEL-AAA-ROADMAP.md` for full Level AAA requirements
- See `standards/WCAG-2.2-LEVEL-AA.md` for your current Level AA compliance

---

**Congratulations!** By implementing these 5 Tier 1 criteria, you're adding valuable Level AAA enhancements to your accessibility framework. These improvements benefit all users and demonstrate your commitment to the highest accessibility standards.
