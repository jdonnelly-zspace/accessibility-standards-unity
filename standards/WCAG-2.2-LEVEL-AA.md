# WCAG 2.2 Level AA Compliance Checklist

**Target:** WCAG 2.2 Level AA (includes all Level A criteria)
**Last Updated:** October 2025
**Based on:** W3C Web Content Accessibility Guidelines 2.2

---

## Overview

Level AA is the **recommended minimum standard** for web accessibility. It satisfies:
- ✅ US Section 508 requirements
- ✅ EU EN 301 549 requirements
- ✅ ADA Title III (web accessibility)
- ✅ Most international accessibility laws

---

## Implementation Checklist

Use this checklist to verify compliance. Each criterion includes:
- **Success Criterion** number and name
- **Level** (A or AA)
- **What it means** in plain language
- **How to test** it
- **Common issues** to avoid

---

## Principle 1: Perceivable

### 1.1 Text Alternatives

#### ✅ 1.1.1 Non-text Content (Level A)

**Requirement:** All images, icons, and non-text content must have text alternatives.

**Implementation:**
```html
<!-- Images -->
<img src="photo.jpg" alt="Team celebrating product launch" />

<!-- Decorative images -->
<img src="decoration.svg" alt="" />

<!-- Icon buttons -->
<button aria-label="Close menu">
  <i class="fa fa-times"></i>
</button>
```

**Testing:**
- [ ] All `<img>` tags have `alt` attributes
- [ ] Decorative images use empty alt (`alt=""`)
- [ ] Icon-only buttons have `aria-label`
- [ ] FontAwesome icons are properly labeled

**Tools:**
- axe DevTools
- WAVE browser extension
- ESLint `jsx-a11y/alt-text` rule

---

### 1.3 Adaptable

#### ✅ 1.3.1 Info and Relationships (Level A)

**Requirement:** Structure and relationships must be programmatically determined.

**Implementation:**
```html
<!-- Use semantic HTML -->
<header>
  <nav aria-label="Main navigation">...</nav>
</header>
<main id="main-content">
  <article>
    <h1>Page Title</h1>
    <h2>Section Title</h2>
    <h3>Subsection</h3>
  </article>
</main>
<footer>...</footer>
```

**Testing:**
- [ ] Proper heading hierarchy (H1 → H2 → H3)
- [ ] Only one H1 per page
- [ ] Semantic HTML elements (`<header>`, `<nav>`, `<main>`, `<footer>`)
- [ ] Form labels associated with inputs
- [ ] Tables use `<th>` for headers

**Tools:**
- Browser DevTools (inspect semantic structure)
- HeadingsMap browser extension
- axe DevTools

---

#### ✅ 1.3.2 Meaningful Sequence (Level A)

**Requirement:** Content order must be meaningful when presented sequentially.

**Implementation:**
- Use logical source order in HTML
- Tab order matches visual order
- CSS doesn't create confusing visual order

**Testing:**
- [ ] Tab through page - order makes sense
- [ ] Turn off CSS - content still makes sense
- [ ] Screen reader announces content in logical order

**Tools:**
- Keyboard navigation (Tab key)
- Screen reader testing

---

#### ✅ 1.3.3 Sensory Characteristics (Level A)

**Requirement:** Instructions don't rely solely on sensory characteristics like shape, size, visual location, orientation, or sound.

**Implementation:**
```jsx
// Bad: Shape/location only
<p>Click the round button on the right to continue</p>

// Good: Descriptive text
<p>Click the "Continue" button to proceed to checkout</p>

// Bad: Color only
<p>Required fields are shown in red</p>

// Good: Multiple indicators
<p>Required fields are marked with an asterisk (*) and the label "Required"</p>

// Bad: Sound only
<p>You'll hear a beep when the upload completes</p>

// Good: Multiple indicators
<p>You'll hear a beep and see a "Complete" message when the upload finishes</p>
```

**Testing:**
- [ ] Instructions don't reference only shape ("round button", "square icon")
- [ ] Instructions don't reference only location ("button on right", "top menu")
- [ ] Instructions don't reference only size ("large button", "small text")
- [ ] Instructions don't rely only on color ("red button", "green checkmark")
- [ ] Audio cues have visual equivalents
- [ ] Visual cues don't rely only on color

**Common Issues:**
- "Click the round button" (no accessible name given)
- "Fill in the fields marked in red" (color-only indication)
- "The menu is on the left side" (position-only)
- "You'll hear a sound when done" (audio-only feedback)

---

#### ✅ 1.3.4 Orientation (Level AA) ⭐

**Requirement:** Content does not restrict its view and operation to a single display orientation (portrait or landscape), unless a specific orientation is essential.

**Why This Matters:**
Users with devices mounted to wheelchairs or desks cannot easily rotate their screens. Some users need landscape for text magnification, others prefer portrait.

**Implementation:**
```css
/* Bad: Force landscape orientation */
@media screen and (orientation: portrait) {
  body::before {
    content: "Please rotate your device to landscape mode";
    /* Forces user to rotate - FAILS */
  }
  main {
    display: none; /* Hides content in portrait - FAILS */
  }
}

/* Good: Support both orientations */
@media screen and (orientation: portrait) {
  .container {
    flex-direction: column; /* Adapt layout */
  }
}

@media screen and (orientation: landscape) {
  .container {
    flex-direction: row; /* Adapt layout */
  }
}

/* Good: Responsive design that works in any orientation */
.content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

/* Essential exception: Piano app, level game */
.piano-app {
  /* Landscape may be essential for piano keyboard layout */
}
```

**React Implementation:**
```jsx
// Bad: Blocking content based on orientation
function App() {
  const [isLandscape, setIsLandscape] = useState(
    window.innerWidth > window.innerHeight
  );

  if (!isLandscape) {
    return (
      <div className="rotate-message">
        <p>Please rotate your device to landscape mode</p>
      </div>
    );
  }

  return <MainContent />;
}

// Good: Adapt layout to orientation
function App() {
  const [orientation, setOrientation] = useState(
    window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
  );

  useEffect(() => {
    const handleResize = () => {
      setOrientation(
        window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
      );
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`app app-${orientation}`}>
      <MainContent />
    </div>
  );
}
```

**Testing:**
- [ ] Test site in portrait mode (phone vertical)
- [ ] Test site in landscape mode (phone horizontal)
- [ ] All functionality available in both orientations
- [ ] No messages forcing orientation change
- [ ] Content reflows appropriately
- [ ] Forms work in both orientations
- [ ] Navigation accessible in both modes

**Exceptions:**
- Bank check deposits (specific angle required)
- Piano/musical instrument apps (layout essential)
- Projector slides or presentations
- Virtual reality applications
- Games where orientation is part of gameplay

**Common Violations:**
- Video players forcing landscape
- Forms requiring landscape "for better experience"
- Dashboard apps blocking portrait view
- "Rotate your device" overlays

**Tools:**
- Test on mobile device (rotate physically)
- Chrome DevTools device emulation (toggle orientation)
- Responsive design mode in browsers

---

#### ✅ 1.3.5 Identify Input Purpose (Level AA) ⭐

**Requirement:** The purpose of input fields collecting user information can be programmatically determined when the field collects common user data (name, email, address, phone, etc.).

**Why This Matters:**
Browsers and assistive technologies can auto-fill forms, reducing errors and cognitive load. Users with motor or cognitive disabilities especially benefit.

**Implementation:**
```html
<!-- Good: Autocomplete attributes for common fields -->
<form>
  <!-- Personal Information -->
  <label for="name">Full Name</label>
  <input
    id="name"
    name="name"
    type="text"
    autocomplete="name"
  />

  <label for="email">Email</label>
  <input
    id="email"
    name="email"
    type="email"
    autocomplete="email"
  />

  <label for="tel">Phone</label>
  <input
    id="tel"
    name="tel"
    type="tel"
    autocomplete="tel"
  />

  <label for="bday">Birthday</label>
  <input
    id="bday"
    name="bday"
    type="date"
    autocomplete="bday"
  />

  <!-- Address Fields -->
  <label for="street">Street Address</label>
  <input
    id="street"
    name="street"
    autocomplete="street-address"
  />

  <label for="city">City</label>
  <input
    id="city"
    name="city"
    autocomplete="address-level2"
  />

  <label for="state">State</label>
  <input
    id="state"
    name="state"
    autocomplete="address-level1"
  />

  <label for="zip">ZIP Code</label>
  <input
    id="zip"
    name="zip"
    autocomplete="postal-code"
  />

  <label for="country">Country</label>
  <input
    id="country"
    name="country"
    autocomplete="country-name"
  />

  <!-- Payment Information -->
  <label for="cc-name">Cardholder Name</label>
  <input
    id="cc-name"
    name="cc-name"
    autocomplete="cc-name"
  />

  <label for="cc-number">Card Number</label>
  <input
    id="cc-number"
    name="cc-number"
    autocomplete="cc-number"
  />

  <label for="cc-exp">Expiration (MM/YY)</label>
  <input
    id="cc-exp"
    name="cc-exp"
    autocomplete="cc-exp"
  />

  <label for="cc-csc">Security Code</label>
  <input
    id="cc-csc"
    name="cc-csc"
    autocomplete="cc-csc"
  />
</form>
```

**React Implementation:**
```jsx
// Good: Profile form with autocomplete
function ProfileForm() {
  return (
    <form>
      <div>
        <label htmlFor="given-name">First Name</label>
        <input
          id="given-name"
          name="given-name"
          type="text"
          autoComplete="given-name"
        />
      </div>

      <div>
        <label htmlFor="family-name">Last Name</label>
        <input
          id="family-name"
          name="family-name"
          type="text"
          autoComplete="family-name"
        />
      </div>

      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
        />
      </div>

      <div>
        <label htmlFor="organization">Company</label>
        <input
          id="organization"
          name="organization"
          type="text"
          autoComplete="organization"
        />
      </div>

      <div>
        <label htmlFor="work-email">Work Email</label>
        <input
          id="work-email"
          name="work-email"
          type="email"
          autoComplete="email"
        />
      </div>

      <div>
        <label htmlFor="work-tel">Work Phone</label>
        <input
          id="work-tel"
          name="work-tel"
          type="tel"
          autoComplete="tel"
        />
      </div>
    </form>
  );
}

// Shipping address form
function ShippingForm() {
  return (
    <form>
      <fieldset>
        <legend>Shipping Address</legend>

        <input
          type="text"
          autoComplete="shipping name"
          placeholder="Full Name"
        />
        <input
          type="text"
          autoComplete="shipping street-address"
          placeholder="Street Address"
        />
        <input
          type="text"
          autoComplete="shipping address-level2"
          placeholder="City"
        />
        <input
          type="text"
          autoComplete="shipping address-level1"
          placeholder="State"
        />
        <input
          type="text"
          autoComplete="shipping postal-code"
          placeholder="ZIP"
        />
        <input
          type="text"
          autoComplete="shipping country-name"
          placeholder="Country"
        />
      </fieldset>

      <fieldset>
        <legend>Billing Address</legend>

        <input
          type="text"
          autoComplete="billing name"
          placeholder="Full Name"
        />
        <input
          type="text"
          autoComplete="billing street-address"
          placeholder="Street Address"
        />
        {/* ... more billing fields ... */}
      </fieldset>
    </form>
  );
}
```

**Common Autocomplete Values:**
- `name` - Full name
- `given-name` - First name
- `family-name` - Last name
- `email` - Email address
- `username` - Username
- `new-password` - New password (signup)
- `current-password` - Current password (login)
- `one-time-code` - One-time password/code
- `organization` - Company/organization
- `street-address` - Street address (multiline)
- `address-line1`, `address-line2` - Address lines
- `address-level1` - State/province
- `address-level2` - City
- `postal-code` - ZIP/postal code
- `country-name` - Country name
- `tel` - Phone number
- `bday` - Birthday
- `cc-name` - Credit card name
- `cc-number` - Credit card number
- `cc-exp` - Expiration date
- `cc-csc` - Security code

**Prefixes:**
- `shipping` - Shipping address fields
- `billing` - Billing address fields
- `work` - Work-related contact
- `home` - Home-related contact

**Testing:**
- [ ] All personal info fields have autocomplete attribute
- [ ] Address fields use appropriate autocomplete values
- [ ] Payment fields use cc-* autocomplete values
- [ ] Browser can auto-fill forms
- [ ] Password managers can detect fields
- [ ] Test with browser autofill enabled

**Tools:**
- Browser autofill testing (fill forms once, check auto-populate)
- axe DevTools (checks for autocomplete attributes)
- Manual inspection of form HTML

---

### 1.4 Distinguishable

#### ✅ 1.4.1 Use of Color (Level A)

**Requirement:** Color is not the only visual means of conveying information.

**Implementation:**
```html
<!-- Bad: Color only -->
<span style="color: red;">Error</span>

<!-- Good: Icon + color + text -->
<span class="error">
  <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
  Error: Email is required
</span>

<!-- Good: Underlined links -->
<a href="..." class="underline">Link text</a>
```

**Testing:**
- [ ] Links are underlined or have distinct styling beyond color
- [ ] Error messages use icons/text, not just red color
- [ ] Required fields indicated with asterisk, not just color
- [ ] Charts/graphs use patterns or labels, not just colors

---

#### ✅ 1.4.3 Contrast (Minimum) - Level AA ⭐

**Requirement:** Text must have a contrast ratio of at least:
- **4.5:1** for normal text (< 18pt or < 14pt bold)
- **3.1** for large text (≥ 18pt or ≥ 14pt bold)
- **3:1** for UI components and graphical objects

**Implementation:**
```css
/* Good examples */
.high-contrast-text {
  color: #1a1a1a; /* Very dark gray */
  background-color: #ffffff; /* White */
  /* Ratio: 16.32:1 ✅ */
}

.primary-text {
  color: #6366f1; /* Indigo-500 */
  background-color: #1a1a1a; /* Very dark */
  /* Ratio: 5.95:1 ✅ */
}
```

**Testing:**
- [ ] Use WebAIM Contrast Checker
- [ ] Test all text colors against backgrounds
- [ ] Test button/border colors (3:1 minimum)
- [ ] Run axe DevTools color contrast audit

**Tools:**
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- Chrome DevTools (inspect contrast ratio)
- axe DevTools

**My Web App Results:**
- Navbar buttons: 16.32:1 ✅
- Indigo text: 5.95:1 ✅
- Secondary text: 6.99:1 ✅
- Purple borders: 4.13:1 ✅

---

#### ✅ 1.4.4 Resize Text (Level AA) ⭐

**Requirement:** Text can be resized up to 200% without loss of content or functionality.

**Implementation:**
```css
/* Use relative units */
.text {
  font-size: 1rem; /* Good: relative */
  line-height: 1.5; /* Good: unitless */
}

/* Avoid absolute units */
.bad-text {
  font-size: 12px; /* Bad: doesn't scale well */
}
```

**Testing:**
- [ ] Zoom browser to 200%
- [ ] No horizontal scrolling
- [ ] All text is readable
- [ ] No overlapping content

**Tools:**
- Browser zoom (Cmd/Ctrl + "+")

---

#### ✅ 1.4.10 Reflow (Level AA) ⭐

**Requirement:** Content reflows to single column at 320px width without scrolling.

**Implementation:**
```css
/* Responsive design */
@media (max-width: 640px) {
  .grid {
    display: block; /* Stack vertically */
  }
}
```

**Testing:**
- [ ] Resize browser to 320px wide
- [ ] No horizontal scrolling
- [ ] Content adapts to narrow viewport

**Tools:**
- Browser DevTools (responsive mode)

---

#### ✅ 1.4.11 Non-text Contrast (Level AA) ⭐

**Requirement:** UI components and graphical objects have 3:1 contrast ratio.

**Implementation:**
```css
/* Button borders, focus indicators, icons */
.button {
  border: 2px solid #6366f1; /* 3:1+ against background */
}

.focus-visible {
  outline: 2px solid #6366f1; /* 3:1+ against background */
}
```

**Testing:**
- [ ] Focus indicators visible with 3:1 contrast
- [ ] Form input borders meet 3:1
- [ ] Icons/graphics meet 3:1

**Tools:**
- WebAIM Contrast Checker
- axe DevTools

---

#### ✅ 1.4.12 Text Spacing (Level AA) ⭐

**Requirement:** No loss of content or functionality when users adjust text spacing to:
- Line height (line spacing) to at least 1.5x the font size
- Paragraph spacing to at least 2x the font size
- Letter spacing (tracking) to at least 0.12x the font size
- Word spacing to at least 0.16x the font size

**Why This Matters:**
Users with dyslexia, low vision, or cognitive disabilities often need increased text spacing for readability. Content must accommodate these adjustments without breaking layout.

**Implementation:**
```css
/* Good: Flexible layout that handles text spacing */
.content {
  max-width: 800px;
  /* Don't use fixed heights */
  min-height: auto; /* Allow content to expand */
}

.card {
  padding: 1.5rem;
  /* Avoid pixel-perfect layouts */
  overflow: visible; /* Don't hide overflow text */
}

.text {
  /* Already using relative spacing */
  line-height: 1.5; /* Default good spacing */
  margin-bottom: 1em; /* Relative spacing */
}

/* Bad: Fixed heights that break with increased spacing */
.bad-card {
  height: 200px; /* Fixed - text will overflow */
  overflow: hidden; /* Hides overflowing text */
}

.bad-text {
  line-height: 1.2; /* Too tight */
  margin-bottom: 10px; /* Fixed pixel spacing */
}

/* Support user text spacing preferences */
@media (prefers-contrast: more) {
  /* User may also need more spacing with high contrast */
  p {
    line-height: 1.6;
    letter-spacing: 0.05em;
  }
}
```

**Testing with Bookmarklet:**
```javascript
// Text Spacing Bookmarklet - test your site
// Applies the required spacing adjustments
javascript:(function(){
  const style = document.createElement('style');
  style.textContent = `
    * {
      line-height: 1.5 !important;
      letter-spacing: 0.12em !important;
      word-spacing: 0.16em !important;
    }
    p {
      margin-bottom: 2em !important;
    }
  `;
  document.head.appendChild(style);
})();
```

**React Implementation:**
```jsx
// Good: Flexible components
const Card = styled.div`
  padding: 1.5rem;
  /* No fixed height */
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;

  /* Text can expand naturally */
  h2 {
    line-height: 1.4;
    margin-bottom: 0.5em; /* Relative to font size */
  }

  p {
    line-height: 1.6;
    margin-bottom: 1em;
  }
`;

// Bad: Fixed dimensions
const BadCard = styled.div`
  height: 300px; /* Fixed height */
  overflow: hidden; /* Clips content */
  padding: 20px;

  p {
    line-height: 20px; /* Fixed line height */
    margin-bottom: 10px; /* Fixed margin */
  }
`;

// Good: Respect user's text spacing
function Article({ content }) {
  return (
    <article style={{
      lineHeight: '1.6',
      maxWidth: '65ch', // Flexible based on character width
    }}>
      {content}
    </article>
  );
}
```

**Common Layout Issues:**
```css
/* Problems that break with text spacing */

/* 1. Fixed heights */
.button {
  height: 40px; /* Can't accommodate taller text */
  /* Fix: Use padding instead */
  padding: 0.5rem 1rem;
}

/* 2. Overflow hidden */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  /* May hide content when spacing increased */
}

/* 3. Absolute positioning based on text height */
.tooltip {
  position: absolute;
  top: 25px; /* Assumes specific text height */
  /* Fix: Use relative positioning or auto-calculate */
}

/* 4. Fixed line-height values */
.heading {
  line-height: 24px; /* Fixed - bad */
  /* Fix: Use unitless or relative */
  line-height: 1.2; /* Good */
}
```

**Testing:**
- [ ] Use text spacing bookmarklet or browser extension
- [ ] Increase line height to 1.5x
- [ ] Increase paragraph spacing to 2x
- [ ] Increase letter spacing to 0.12x
- [ ] Increase word spacing to 0.16x
- [ ] Verify no content is cut off
- [ ] Verify no overlapping text
- [ ] Verify all functionality still works
- [ ] Test interactive elements (buttons, links, forms)
- [ ] Check navigation doesn't break
- [ ] Ensure modal/popup content fits

**Common Violations:**
- Fixed height containers causing text overflow
- Hidden overflow clipping expanded text
- Buttons with fixed heights cutting off text
- Navigation items overlapping
- Tooltips positioned incorrectly
- Forms with fixed-height inputs cutting text

**Tools:**
- Text Spacing Bookmarklet: https://www.html5accessibility.com/tests/tsbookmarklet.html
- Browser extensions for text spacing
- Chrome DevTools (edit styles to test)
- Manual CSS injection

**Exceptions:**
- Captions in videos (essential presentation)
- Images of text (discouraged but exempt if essential)
- Text in images for logos

---

#### ✅ 1.4.13 Content on Hover or Focus (Level AA) ⭐

**Requirement:** When additional content appears on hover or focus (tooltips, dropdowns, etc.), it must be:
1. **Dismissible:** User can dismiss without moving pointer/focus (typically ESC key)
2. **Hoverable:** If triggered by pointer hover, pointer can move over the new content without it disappearing
3. **Persistent:** Content remains visible until user dismisses it, or it's no longer relevant

**Why This Matters:**
Users with low vision who magnify screens need time to read hover content. Users with motor impairments may accidentally trigger hovers and need to dismiss them.

**Implementation:**
```jsx
// Good: Accessible tooltip
function Tooltip({ children, content }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const tooltipRef = useRef(null);

  useEffect(() => {
    // Dismissible: ESC key closes tooltip
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isVisible) {
        setIsVisible(false);
        setIsDismissed(true);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isVisible]);

  const show = () => {
    if (!isDismissed) {
      setIsVisible(true);
    }
  };

  const hide = () => {
    setIsVisible(false);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <span
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        tabIndex={0}
        aria-describedby={isVisible ? 'tooltip' : undefined}
      >
        {children}
      </span>

      {isVisible && (
        <div
          id="tooltip"
          ref={tooltipRef}
          role="tooltip"
          // Hoverable: Mouse can move over tooltip content
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={hide}
          style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#1a1a1a',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.25rem',
            marginTop: '0.5rem',
            zIndex: 1000,
            whiteSpace: 'nowrap',
            // Persistent: Stays visible until dismissed
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
}

// Usage
<Tooltip content="This is helpful information">
  <button>Hover for info</button>
</Tooltip>

// Good: Accessible dropdown
function Dropdown({ label, items }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Dismissible: ESC key
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    // Persistent: Click outside closes
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {label}
      </button>

      {isOpen && (
        <ul
          role="menu"
          // Hoverable: Can move mouse over menu items
          onMouseLeave={() => {
            // Optional: Keep open when hovering menu
          }}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            background: 'white',
            border: '1px solid #ccc',
            listStyle: 'none',
            padding: '0.5rem 0',
            margin: 0,
            zIndex: 1000,
          }}
        >
          {items.map((item, index) => (
            <li key={index} role="menuitem">
              <button
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.5rem 1rem',
                  border: 'none',
                  background: 'none',
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Good: Hover-triggered submenu
function NavigationMenu() {
  const [activeMenu, setActiveMenu] = useState(null);
  const timeoutRef = useRef(null);

  const showSubmenu = (menuId) => {
    // Clear any pending hide
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveMenu(menuId);
  };

  const hideSubmenu = () => {
    // Persistent: Small delay before hiding
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 300);
  };

  const keepSubmenu = () => {
    // Hoverable: Cancel hide when hovering submenu
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  return (
    <nav>
      <ul>
        <li
          onMouseEnter={() => showSubmenu('products')}
          onMouseLeave={hideSubmenu}
        >
          <a href="/products">Products</a>

          {activeMenu === 'products' && (
            <ul
              onMouseEnter={keepSubmenu}
              onMouseLeave={hideSubmenu}
              style={{
                position: 'absolute',
                background: 'white',
                border: '1px solid #ccc',
              }}
            >
              <li><a href="/products/item1">Item 1</a></li>
              <li><a href="/products/item2">Item 2</a></li>
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
}

// Bad: Tooltip that fails requirements
function BadTooltip({ children, content }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <span
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </span>

      {isVisible && (
        <div
          style={{
            position: 'absolute',
            background: 'black',
            color: 'white',
            padding: '0.5rem',
            // Problems:
            // ❌ Not dismissible with ESC
            // ❌ Can't hover over tooltip (disappears on mouse leave)
            // ❌ Disappears immediately (not persistent)
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
}
```

**CSS-Only Pattern (With Limitations):**
```css
/* CSS-only tooltip - partially accessible */
.tooltip-container {
  position: relative;
  display: inline-block;
}

.tooltip-container:hover .tooltip-content,
.tooltip-container:focus-within .tooltip-content {
  display: block;
}

.tooltip-content {
  display: none;
  position: absolute;
  background: #1a1a1a;
  color: white;
  padding: 0.5rem;
  border-radius: 0.25rem;
  z-index: 1000;

  /* Hoverable: Leave small gap or use pointer-events */
  pointer-events: auto; /* Can hover over tooltip */
}

/* Note: CSS-only can't be dismissed with ESC key */
/* JavaScript is needed for full compliance */
```

**Testing:**
- [ ] **Dismissible:** Press ESC to close tooltips/popups
- [ ] **Dismissible:** Doesn't require moving mouse/focus away
- [ ] **Hoverable:** Move mouse from trigger to new content
- [ ] **Hoverable:** Content stays visible while hovering it
- [ ] **Persistent:** Content doesn't disappear unexpectedly
- [ ] **Persistent:** Remains until ESC, click outside, or focus moves
- [ ] Test with screen magnification
- [ ] Test with slow/imprecise mouse movement

**Common Violations:**
- Tooltips that disappear when trying to hover them
- Submenus that close too quickly
- Hover content with no ESC dismissal
- Tooltips that vanish on tiny mouse movement
- Content that appears/disappears too rapidly

**Exceptions:**
- Browser-controlled tooltips (title attribute)
- Error messages controlled by user agent
- Content not triggered by hover/focus (e.g., timed notifications)

**Tools:**
- Manual keyboard testing (ESC key)
- Mouse movement testing
- Screen magnifier testing (ZoomText, built-in magnifier)
- Test with tremor/motor impairment simulation

---

## Principle 2: Operable

### 2.1 Keyboard Accessible

#### ✅ 2.1.1 Keyboard (Level A)

**Requirement:** All functionality is available via keyboard.

**Implementation:**
```jsx
// All interactive elements must be keyboard accessible
<button onClick={handleClick}>Click me</button> // ✅ Good
<div onClick={handleClick}>Click me</div> // ❌ Bad - not keyboard accessible

// Custom components need keyboard handlers
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  Custom Button
</div>
```

**Testing:**
- [ ] Tab through all interactive elements
- [ ] All buttons/links reachable
- [ ] Enter/Space activates buttons
- [ ] Escape closes modals/dropdowns
- [ ] Arrow keys navigate menus/lists

**Tools:**
- Keyboard only (disconnect mouse!)
- Browser tab navigation

---

#### ✅ 2.1.2 No Keyboard Trap (Level A)

**Requirement:** Users can navigate away from any component using only keyboard.

**Implementation:**
```jsx
// Modal with keyboard trap prevention
function Modal({ onClose }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return <div role="dialog">...</div>;
}
```

**Testing:**
- [ ] Can exit all modals/dialogs with Escape
- [ ] Can tab out of all components
- [ ] No infinite tab loops

---

#### ✅ 2.1.4 Character Key Shortcuts (Level A) 🆕 WCAG 2.2

**Requirement:** If a keyboard shortcut uses only printable character keys (letters, numbers, punctuation, symbols), then at least one of the following is true:
- Can be turned off
- Can be remapped to include non-printable keys (Ctrl, Alt, etc.)
- Is only active when component has focus

**Why This Matters:**
Single-key shortcuts can be accidentally triggered by speech recognition users or cause conflicts with assistive technology.

**Implementation:**
```jsx
// Bad: Single-key shortcuts active globally
document.addEventListener('keydown', (e) => {
  if (e.key === 's') {
    save(); // Problem: 's' triggered while typing
  }
});

// Good: Require modifier key
document.addEventListener('keydown', (e) => {
  if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    save(); // Ctrl+S or Cmd+S
  }
});

// Good: Only active when component focused
function Editor() {
  const editorRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 's' && e.ctrlKey) {
      e.preventDefault();
      save();
    }
  };

  return (
    <div
      ref={editorRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      Editor content
    </div>
  );
}

// Good: Allow users to disable shortcuts
function Settings() {
  const [shortcutsEnabled, setShortcutsEnabled] = useState(true);

  return (
    <label>
      <input
        type="checkbox"
        checked={shortcutsEnabled}
        onChange={(e) => setShortcutsEnabled(e.target.checked)}
      />
      Enable keyboard shortcuts
    </label>
  );
}
```

**Testing:**
- [ ] All single-character shortcuts require Ctrl/Alt/Cmd modifier
- [ ] OR single-character shortcuts can be turned off in settings
- [ ] OR single-character shortcuts only work when specific component has focus
- [ ] Test with speech recognition (Dragon NaturallySpeaking, Voice Control)
- [ ] No conflicts with screen reader shortcuts

**Common Issues:**
- Search activated with '/' key while typing in forms
- Delete triggered with 'D' key during text entry
- Single-letter navigation (like Gmail) interfering with text input

**Tools:**
- Manual keyboard testing
- Speech recognition software testing

---

### 2.2 Enough Time

#### ✅ 2.2.1 Timing Adjustable (Level A)

**Requirement:** For each time limit set by content, users can turn off, adjust, or extend the time limit before time expires.

**Exceptions:** Real-time events (auctions, real-time games), essential time limits (20+ hour limits), or time limits longer than 20 hours.

**Implementation:**
```jsx
// Session timeout with extension option
function SessionTimeout() {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 60 && !showWarning) {
          setShowWarning(true); // Show warning at 1 minute
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showWarning]);

  const extendSession = () => {
    setTimeLeft(600); // Extend by 10 more minutes
    setShowWarning(false);
  };

  if (!showWarning) return null;

  return (
    <div role="alert" aria-live="assertive">
      <p>Your session will expire in {timeLeft} seconds.</p>
      <button onClick={extendSession}>
        Extend Session
      </button>
    </div>
  );
}

// Alternative: Allow users to disable timeout
function Settings() {
  const [timeoutEnabled, setTimeoutEnabled] = useState(false);

  return (
    <label>
      <input
        type="checkbox"
        checked={timeoutEnabled}
        onChange={(e) => setTimeoutEnabled(e.target.checked)}
      />
      Enable automatic logout (for security)
    </label>
  );
}
```

**Testing:**
- [ ] Users warned at least 20 seconds before timeout
- [ ] Users can extend timeout at least 10 times
- [ ] OR timeout can be disabled in settings
- [ ] Timeout warning is accessible (screen reader announces)

---

#### ✅ 2.2.2 Pause, Stop, Hide (Level A)

**Requirement:** For moving, blinking, scrolling, or auto-updating content:
- **Moving/blinking/scrolling:** Can be paused, stopped, or hidden if it starts automatically, lasts >5 seconds, and is presented in parallel with other content
- **Auto-updating:** Can be paused, stopped, hidden, or controlled

**Implementation:**
```jsx
// Auto-playing carousel with pause
function Carousel({ slides }) {
  const [isPaused, setIsPaused] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div aria-live="polite" aria-atomic="true">
        {slides[currentSlide]}
      </div>
      <button
        onClick={() => setIsPaused(!isPaused)}
        aria-label={isPaused ? 'Play carousel' : 'Pause carousel'}
      >
        {isPaused ? '▶' : '⏸'}
      </button>
      <div role="group" aria-label="Slide navigation">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentSlide ? 'true' : 'false'}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

// Live updates with pause
function LiveFeed({ updates }) {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div>
      <button onClick={() => setIsPaused(!isPaused)}>
        {isPaused ? 'Resume Updates' : 'Pause Updates'}
      </button>
      <div aria-live={isPaused ? 'off' : 'polite'}>
        {updates.map((update) => (
          <div key={update.id}>{update.content}</div>
        ))}
      </div>
    </div>
  );
}
```

**Testing:**
- [ ] All auto-playing content can be paused
- [ ] Pause control is keyboard accessible
- [ ] Content pauses on hover/focus
- [ ] Pausing doesn't hide other content

---

### 2.3 Seizures and Physical Reactions

#### ✅ 2.3.3 Animation from Interactions (Level AAA - Bonus)

**Requirement:** Motion animation can be disabled except when essential.

**Implementation:**
```css
/* Respect user's motion preferences */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Testing:**
- [ ] Enable "Reduce motion" in system settings
- [ ] Verify animations are disabled

**Tools:**
- macOS: System Preferences → Accessibility → Display → Reduce Motion
- Windows: Settings → Ease of Access → Display → Show animations

---

### 2.4 Navigable

#### ✅ 2.4.1 Bypass Blocks (Level A)

**Requirement:** Skip navigation mechanism to bypass repeated content.

**Implementation:**
```jsx
// Skip link (first focusable element)
<a href="#main-content" className="skip-link">
  Skip to main content
</a>

// Target for skip link
<main id="main-content">
  {/* Page content */}
</main>
```

```css
/* Show skip link only on focus */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #6366f1;
  color: white;
  padding: 8px;
  text-decoration: none;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

**Testing:**
- [ ] Press Tab on page load
- [ ] Skip link appears
- [ ] Clicking skip link jumps to main content

---

#### ✅ 2.4.2 Page Titled (Level A)

**Requirement:** Web pages have descriptive titles.

**Implementation:**
```jsx
// Using React Helmet
import { Helmet } from 'react-helmet-async';

function BlogPost({ post }) {
  return (
    <>
      <Helmet>
        <title>{post.title} | My Web App</title>
      </Helmet>
      {/* ... */}
    </>
  );
}
```

**Testing:**
- [ ] Every page has unique `<title>` tag
- [ ] Titles describe page content
- [ ] Titles follow pattern: "Page Name | Site Name"

---

#### ✅ 2.4.3 Focus Order (Level A)

**Requirement:** Focus order is logical and meaningful.

**Implementation:**
- Use natural DOM order (don't manipulate with `tabindex` unless necessary)
- Avoid positive `tabindex` values

**Testing:**
- [ ] Tab through page in visual order
- [ ] Focus doesn't jump unexpectedly

---

#### ✅ 2.4.4 Link Purpose (In Context) (Level A)

**Requirement:** Purpose of each link can be determined from link text or context.

**Implementation:**
```jsx
// Bad: Generic link text
<a href="/post">Read more</a>

// Good: Descriptive link text
<a href="/post">Read article: Getting Started with React</a>

// Good: aria-label for context
<a href="/post" aria-label="Read article: Getting Started with React. Learn the basics of React components and hooks.">
  <img src="thumbnail.jpg" alt="" />
  <h3>Getting Started with React</h3>
</a>
```

**Testing:**
- [ ] No "click here" or "read more" without context
- [ ] Links describe their destination
- [ ] Icon links have aria-label

---

#### ✅ 2.4.5 Multiple Ways (Level AA) ⭐

**Requirement:** More than one way to locate pages within a set.

**Implementation:**
- Navigation menu
- Search functionality
- Sitemap page
- Breadcrumbs

**Testing:**
- [ ] Site has navigation menu
- [ ] Site has search
- [ ] Site has sitemap (/sitemap or /sitemap.html)

---

#### ✅ 2.4.6 Headings and Labels (Level AA) ⭐

**Requirement:** Headings and labels describe topic or purpose.

**Implementation:**
```html
<h1>Blog Posts</h1>
<h2>Latest Articles</h2>
<h3>Getting Started with React</h3>

<label for="email">Email Address</label>
<input type="email" id="email" />
```

**Testing:**
- [ ] Headings are descriptive
- [ ] Form labels are clear

---

#### ✅ 2.4.7 Focus Visible (Level AA) ⭐

**Requirement:** Keyboard focus indicator is visible.

**Implementation:**
```css
/* Default browser focus */
button:focus-visible {
  outline: 2px solid #6366f1;
  outline-offset: 2px;
}

/* Custom focus indicator */
.link:focus-visible {
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.5);
}
```

**Testing:**
- [ ] Tab through page
- [ ] Focus indicator clearly visible on all elements
- [ ] Contrast ratio meets 3:1 minimum

**Tools:**
- Keyboard navigation

---

#### ✅ 2.4.11 Focus Not Obscured (Minimum) (Level AA) 🆕 WCAG 2.2

**Requirement:** When a component receives keyboard focus, it is not entirely hidden by author-created content (like sticky headers, cookie banners, chat widgets).

**Why This Matters:**
Users relying on keyboard navigation need to see what element has focus. Fixed-position UI elements can completely cover focused elements, making navigation impossible.

**Implementation:**
```jsx
// Ensure focused elements scroll into view and aren't obscured
function scrollToFocused(element) {
  const headerHeight = document.querySelector('header').offsetHeight;
  const elementTop = element.getBoundingClientRect().top;
  const offsetPosition = elementTop + window.pageYOffset - headerHeight - 20;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
}

// Automatically manage scroll position for focus
useEffect(() => {
  const handleFocus = (e) => {
    // Check if element is partially obscured by fixed elements
    const rect = e.target.getBoundingClientRect();
    const header = document.querySelector('[data-sticky-header]');

    if (header) {
      const headerRect = header.getBoundingClientRect();
      // If focus is behind header, scroll it into view
      if (rect.top < headerRect.bottom) {
        scrollToFocused(e.target);
      }
    }
  };

  document.addEventListener('focus', handleFocus, true);
  return () => document.removeEventListener('focus', handleFocus, true);
}, []);

// Ensure modals don't obscure focus
function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Focus first focusable element in modal
      const firstFocusable = modalRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();
    }
  }, [isOpen]);

  return isOpen ? (
    <div ref={modalRef} role="dialog" aria-modal="true">
      {children}
      <button onClick={onClose}>Close</button>
    </div>
  ) : null;
}

// Ensure sticky headers don't cover focus
const StickyHeader = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  /* Add enough padding to page content below */
  & + main {
    scroll-padding-top: ${props => props.height + 20}px;
  }
`;
```

**CSS Solution:**
```css
/* Ensure scroll targets account for fixed headers */
html {
  scroll-padding-top: 80px; /* Height of sticky header + buffer */
}

/* Ensure focused elements aren't completely hidden */
*:focus-visible {
  scroll-margin-top: 100px; /* Sticky header height + buffer */
}

/* Sticky elements should not obscure content */
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 100;
}

/* Main content should have padding for sticky elements */
main {
  padding-top: 80px; /* Match sticky header height */
}
```

**Testing:**
- [ ] Tab through entire page
- [ ] Verify focused element is at least partially visible
- [ ] Test with sticky headers, footers, sidebars
- [ ] Test with modals, toasts, chat widgets
- [ ] Test on mobile with bottom navigation
- [ ] Focused element not entirely covered by any fixed UI

**Common Issues:**
- Cookie banners covering focused elements
- Sticky headers obscuring top-focused items
- Chat widgets covering form inputs
- Bottom tab bars (mobile) covering focused buttons

**Tools:**
- Manual keyboard testing
- Browser DevTools (inspect focus ring position)

---

### 2.5 Input Modalities

#### ✅ 2.5.7 Dragging Movements (Level AA) 🆕 WCAG 2.2

**Requirement:** All functionality that uses dragging can also be achieved by a single pointer (click/tap) without dragging, unless dragging is essential.

**Why This Matters:**
Many users cannot perform precise dragging movements due to motor disabilities, tremors, or using alternative input devices.

**Implementation:**
```jsx
// Bad: Drag-only interface
function BadSortable({ items }) {
  return (
    <div>
      {items.map(item => (
        <div draggable key={item.id}>
          {item.name}
        </div>
      ))}
    </div>
  );
}

// Good: Dragging + alternative keyboard/button controls
function AccessibleSortable({ items, onReorder }) {
  const [selectedItem, setSelectedItem] = useState(null);

  // Alternative: Click to select, then click destination
  const handleItemClick = (item, index) => {
    if (!selectedItem) {
      setSelectedItem({ item, index });
    } else {
      // Move selected item to clicked position
      onReorder(selectedItem.index, index);
      setSelectedItem(null);
    }
  };

  // Alternative: Up/down buttons
  const moveUp = (index) => {
    if (index > 0) {
      onReorder(index, index - 1);
    }
  };

  const moveDown = (index) => {
    if (index < items.length - 1) {
      onReorder(index, index + 1);
    }
  };

  return (
    <ul>
      {items.map((item, index) => (
        <li
          key={item.id}
          className={selectedItem?.index === index ? 'selected' : ''}
          onClick={() => handleItemClick(item, index)}
        >
          <span>{item.name}</span>
          {/* Alternative controls */}
          <div>
            <button
              onClick={(e) => { e.stopPropagation(); moveUp(index); }}
              disabled={index === 0}
              aria-label={`Move ${item.name} up`}
            >
              ↑
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); moveDown(index); }}
              disabled={index === items.length - 1}
              aria-label={`Move ${item.name} down`}
            >
              ↓
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

// Good: Slider with alternative input
function AccessibleSlider({ value, onChange, min = 0, max = 100 }) {
  return (
    <div>
      {/* Native range input provides keyboard alternative to dragging */}
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        aria-label="Adjust value"
      />
      {/* Alternative: Direct number input */}
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        aria-label="Enter exact value"
      />
    </div>
  );
}

// Good: Drag-and-drop file upload with click alternative
function FileUpload({ onFilesSelected }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  return (
    <div>
      {/* Drag-and-drop area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          onFilesSelected(Array.from(e.dataTransfer.files));
        }}
        className={isDragging ? 'dragging' : ''}
      >
        <p>Drag files here</p>
      </div>

      {/* Alternative: Click to browse */}
      <button onClick={() => fileInputRef.current.click()}>
        Or click to browse files
      </button>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => onFilesSelected(Array.from(e.target.files))}
      />
    </div>
  );
}
```

**Testing:**
- [ ] All drag-and-drop interactions have click/tap alternatives
- [ ] Sliders can be adjusted with keyboard arrow keys
- [ ] Sortable lists have up/down buttons or keyboard shortcuts
- [ ] File uploads work without dragging
- [ ] Map panning has keyboard/button alternatives
- [ ] Drawing tools have non-drag alternatives (or are marked as essential)

**Exceptions:**
- Drawing/painting applications (dragging is essential)
- Handwriting recognition (dragging is essential)
- Games where dragging is core mechanic

**Tools:**
- Manual testing without mouse/trackpad
- Touch screen testing with single taps only
- Keyboard navigation testing

---

#### ✅ 2.5.8 Target Size (Minimum) (Level AA) 🆕 WCAG 2.2

**Requirement:** Touch/click targets are at least 24x24 CSS pixels, with exceptions:
- **Spacing:** Target is smaller but has enough spacing so the 24x24 target area doesn't overlap another target
- **Inline:** Target is in a sentence or text block
- **User agent control:** Size is determined by browser (like native form controls)
- **Essential:** Particular presentation is essential

**Why This Matters:**
Small touch targets are difficult for users with motor impairments, tremors, or large fingers to activate accurately.

**Implementation:**
```css
/* Minimum target sizes */
button, a, input[type="checkbox"], input[type="radio"] {
  min-width: 24px;
  min-height: 24px;
  /* Or use padding to achieve 24x24 hit area */
}

/* Icon-only buttons */
.icon-button {
  width: 44px; /* Exceeds minimum, better UX */
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Small visual element with larger hit area */
.close-button {
  position: relative;
  width: 16px; /* Visual size */
  height: 16px;
  padding: 12px; /* Creates 40x40 hit area */
}

/* Ensure spacing between small targets */
.tag {
  display: inline-block;
  padding: 4px 8px;
  margin: 4px; /* Spacing ensures 24x24 non-overlapping areas */
  min-height: 24px;
}

/* Checkbox/radio with larger hit area */
input[type="checkbox"], input[type="radio"] {
  width: 24px;
  height: 24px;
}

label {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  cursor: pointer;
  /* Entire label is clickable */
}

/* Mobile navigation targets */
.mobile-nav-item {
  min-height: 48px; /* Larger for mobile */
  display: flex;
  align-items: center;
  padding: 12px 16px;
}

/* Pagination links */
.pagination button {
  min-width: 44px;
  min-height: 44px;
  margin: 0 4px;
}
```

**React Implementation:**
```jsx
// Ensure proper target sizing
const IconButton = styled.button`
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;

  svg {
    width: 20px; /* Icon smaller than button */
    height: 20px;
  }
`;

// Checkbox with adequate target size
function Checkbox({ label, ...props }) {
  return (
    <label style={{
      display: 'flex',
      alignItems: 'center',
      padding: '8px',
      cursor: 'pointer',
      minHeight: '44px'
    }}>
      <input
        type="checkbox"
        style={{ width: '24px', height: '24px' }}
        {...props}
      />
      <span style={{ marginLeft: '8px' }}>{label}</span>
    </label>
  );
}

// Tags with adequate spacing
function TagList({ tags, onRemove }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {tags.map(tag => (
        <div key={tag} style={{
          display: 'flex',
          alignItems: 'center',
          padding: '4px 12px',
          minHeight: '32px',
          background: '#e5e7eb',
          borderRadius: '16px'
        }}>
          <span>{tag}</span>
          <button
            onClick={() => onRemove(tag)}
            style={{
              width: '24px',
              height: '24px',
              marginLeft: '8px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer'
            }}
            aria-label={`Remove ${tag}`}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
```

**Testing:**
- [ ] Measure all interactive elements (DevTools)
- [ ] All standalone targets are ≥ 24x24 CSS pixels
- [ ] OR targets have spacing so 24x24 areas don't overlap
- [ ] Test on touch devices
- [ ] Test with large finger/stylus simulation

**Common Violations:**
- Close buttons (×) too small (common: 16x16)
- Icon-only buttons without padding
- Checkbox/radio inputs without adequate size
- Pagination numbers too small
- Social media icons clustered together

**Tools:**
- Browser DevTools (inspect element dimensions)
- Accessibility Insights for Web
- Touch/pointer simulation

---

## Principle 3: Understandable

### 3.1 Readable

#### ✅ 3.1.1 Language of Page (Level A)

**Requirement:** Default human language of page is programmatically determined.

**Implementation:**
```html
<!DOCTYPE html>
<html lang="en">
  <head>...</head>
  <body>...</body>
</html>
```

**Testing:**
- [ ] `<html>` tag has `lang` attribute
- [ ] Language code is valid (en, es, fr, etc.)

---

### 3.2 Predictable

#### ✅ 3.2.1 On Focus (Level A)

**Requirement:** Focusing on a component doesn't cause unexpected context change.

**Implementation:**
- Don't auto-submit forms on focus
- Don't auto-navigate on focus
- Don't open modals automatically

**Testing:**
- [ ] Tabbing through page doesn't trigger navigation
- [ ] Focus doesn't open modals automatically

---

#### ✅ 3.2.2 On Input (Level A)

**Requirement:** Changing input doesn't cause unexpected context change.

**Implementation:**
- Require user action (button click) to submit
- Don't auto-navigate on select change

**Testing:**
- [ ] Selecting dropdown doesn't auto-navigate
- [ ] Typing doesn't auto-submit forms

---

#### ✅ 3.2.3 Consistent Navigation (Level AA) ⭐

**Requirement:** Navigation mechanisms appear in same order on multiple pages.

**Implementation:**
- Navigation menu stays in same position
- Same order of nav items across all pages

**Testing:**
- [ ] Navigation consistent across all pages
- [ ] Same relative order maintained

---

#### ✅ 3.2.6 Consistent Help (Level A) 🆕 WCAG 2.2

**Requirement:** If a help mechanism (live chat, phone number, email, self-help, contact form) is provided on multiple pages, it appears in the same relative order on each page.

**Why This Matters:**
Users with cognitive disabilities benefit from predictable location of help mechanisms. Finding help shouldn't require re-learning its location on every page.

**Implementation:**
```jsx
// Good: Consistent help placement across all pages
function PageLayout({ children }) {
  return (
    <div>
      <header>
        <nav>
          {/* Main navigation */}
        </nav>
      </header>

      <main>{children}</main>

      <footer>
        {/* Help mechanisms in consistent order */}
        <div className="help-section">
          <h2>Need Help?</h2>
          <ul>
            <li><a href="/contact">Contact Form</a></li>
            <li><a href="tel:1-800-555-0100">Call: 1-800-555-0100</a></li>
            <li><a href="/faq">FAQs</a></li>
            <li>
              <button onClick={() => openLiveChat()}>
                Live Chat
              </button>
            </li>
          </ul>
        </div>
        {/* ... other footer content ... */}
      </footer>
    </div>
  );
}

// Or: Floating help button in consistent location
function FloatingHelp() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',  // Always in same position
      zIndex: 1000
    }}>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Get help"
          style={{ width: '60px', height: '60px' }}
        >
          ?
        </button>
      ) : (
        <div className="help-menu">
          <button onClick={() => setIsOpen(false)}>Close</button>
          {/* Help options in consistent order */}
          <a href="/contact">Contact Us</a>
          <a href="tel:1-800-555-0100">Call Support</a>
          <a href="/faq">View FAQs</a>
          <button onClick={openLiveChat}>Start Live Chat</button>
        </div>
      )}
    </div>
  );
}

// Good: Help links in consistent header position
function Header() {
  return (
    <header>
      <nav>
        <a href="/">Home</a>
        <a href="/products">Products</a>
        <a href="/about">About</a>
        {/* Help always last in navigation */}
        <a href="/help">Help</a>
      </nav>
    </header>
  );
}
```

**Testing:**
- [ ] Identify all help mechanisms (chat, phone, email, FAQ, contact form)
- [ ] Verify help mechanisms appear in same relative order on all pages
- [ ] Check across different page types (home, product, checkout, account)
- [ ] If help mechanism is in header, it's always in same position
- [ ] If help mechanism is in footer, items appear in same order

**What Counts as Help Mechanism:**
- ✅ Live chat widget
- ✅ Phone numbers for human contact
- ✅ Email addresses for human contact
- ✅ Contact forms reaching humans
- ✅ Self-help options (FAQ, Help Center)
- ❌ Social media links (not direct help)
- ❌ Search (not specifically for help)

**Common Violations:**
- Help link moves from header to footer on different pages
- Phone number appears before live chat on one page, after on another
- FAQ link present on some pages but missing on others (breaking consistency)

**Tools:**
- Manual visual inspection across multiple pages
- Test with users with cognitive disabilities

---

### 3.3 Input Assistance

#### ✅ 3.3.2 Labels or Instructions (Level A)

**Requirement:** Labels or instructions provided when content requires user input.

**Implementation:**
```jsx
<label htmlFor="email">
  Email Address <span className="required">*</span>
</label>
<input
  type="email"
  id="email"
  required
  aria-required="true"
  aria-describedby="email-help"
/>
<span id="email-help">We'll never share your email.</span>
```

**Testing:**
- [ ] All form fields have labels
- [ ] Required fields clearly marked
- [ ] Instructions provided for complex inputs

---

#### ✅ 3.3.7 Redundant Entry (Level A) 🆕 WCAG 2.2

**Requirement:** Information previously entered by the user is either:
- Auto-populated
- Available for the user to select
- UNLESS re-entering is essential, required for security, or previous information is no longer valid

**Why This Matters:**
Users with cognitive disabilities or motor impairments benefit from not having to re-enter the same information multiple times. Reduces errors and cognitive load.

**Implementation:**
```jsx
// Good: Auto-populate from previous step
function CheckoutShipping({ billingAddress }) {
  const [shippingAddress, setShippingAddress] = useState(billingAddress);
  const [sameAsBilling, setSameAsBilling] = useState(true);

  return (
    <form>
      <label>
        <input
          type="checkbox"
          checked={sameAsBilling}
          onChange={(e) => {
            setSameAsBilling(e.target.checked);
            if (e.target.checked) {
              setShippingAddress(billingAddress);
            }
          }}
        />
        Shipping address same as billing
      </label>

      {!sameAsBilling && (
        <div>
          <input
            value={shippingAddress.street}
            onChange={(e) =>
              setShippingAddress({ ...shippingAddress, street: e.target.value })
            }
            placeholder="Street"
          />
          {/* Other address fields */}
        </div>
      )}
    </form>
  );
}

// Good: Remember user's selections with localStorage
function ContactForm() {
  const [formData, setFormData] = useState(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('contactFormDraft');
    return saved ? JSON.parse(saved) : { name: '', email: '', phone: '' };
  });

  useEffect(() => {
    // Save draft as user types
    localStorage.setItem('contactFormDraft', JSON.stringify(formData));
  }, [formData]);

  return (
    <form>
      <label>
        Name:
        <input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </label>
      {/* ... */}
    </form>
  );
}

// Good: Use browser autocomplete
function PaymentForm() {
  return (
    <form>
      <label htmlFor="cc-name">Cardholder Name</label>
      <input
        id="cc-name"
        name="cc-name"
        type="text"
        autocomplete="cc-name"
      />

      <label htmlFor="cc-number">Card Number</label>
      <input
        id="cc-number"
        name="cc-number"
        type="text"
        autocomplete="cc-number"
      />

      <label htmlFor="cc-exp">Expiration Date</label>
      <input
        id="cc-exp"
        name="cc-exp"
        type="text"
        autocomplete="cc-exp"
      />
    </form>
  );
}

// Good: Provide selection from previous entries
function RecipientForm({ previousRecipients }) {
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [manualEntry, setManualEntry] = useState(false);

  return (
    <div>
      {!manualEntry && previousRecipients.length > 0 && (
        <div>
          <label htmlFor="select-recipient">
            Select from previous recipients:
          </label>
          <select
            id="select-recipient"
            onChange={(e) => {
              const recipient = previousRecipients.find(
                (r) => r.id === e.target.value
              );
              setSelectedRecipient(recipient);
            }}
          >
            <option value="">-- Select --</option>
            {previousRecipients.map((recipient) => (
              <option key={recipient.id} value={recipient.id}>
                {recipient.name} ({recipient.email})
              </option>
            ))}
          </select>
          <button type="button" onClick={() => setManualEntry(true)}>
            Or enter new recipient
          </button>
        </div>
      )}

      {(manualEntry || previousRecipients.length === 0) && (
        <div>
          <input placeholder="Name" />
          <input placeholder="Email" type="email" />
        </div>
      )}
    </div>
  );
}
```

**Testing:**
- [ ] Multi-step forms don't require re-entering same information
- [ ] Billing/shipping address offers "same as" option
- [ ] Forms use appropriate autocomplete attributes
- [ ] User can select from previously entered values
- [ ] Session data persists across pages (where appropriate)

**Exceptions:**
- **Essential:** Re-entering password to confirm
- **Security:** Re-entering credentials for sensitive actions
- **Invalid:** Previous data is no longer valid (e.g., expired)

**Common Violations:**
- Multi-step forms requiring same address on each step
- Profile update forms not pre-populating current values
- Search forms not remembering recent searches
- Not offering "same as billing" option for shipping

**Tools:**
- Manual testing through multi-step processes
- Test with saved browser autocomplete data

---

#### ✅ 3.3.8 Accessible Authentication (Minimum) (Level AA) 🆕 WCAG 2.2

**Requirement:** Authentication does not rely on a cognitive function test (like remembering a password or solving a puzzle) UNLESS:
- An alternative method is provided that doesn't require a cognitive test
- A mechanism is available to assist (password manager, copy-paste)
- The cognitive test is recognizing objects
- The cognitive test is identifying non-text content provided by the user

**Why This Matters:**
Traditional password entry and CAPTCHAs create barriers for users with cognitive disabilities, memory impairments, or language barriers.

**Implementation:**
```jsx
// Good: Password with paste enabled + password manager support
function LoginForm() {
  return (
    <form>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
      />

      <label htmlFor="password">Password</label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"  // Enables password managers
        // DO NOT disable paste!
      />

      <button type="submit">Sign In</button>

      {/* Alternative: Email magic link */}
      <button
        type="button"
        onClick={sendMagicLink}
      >
        Or email me a sign-in link
      </button>
    </form>
  );
}

// Good: Biometric authentication alternative
function SecureLogin() {
  const [method, setMethod] = useState('password');

  return (
    <div>
      <div>
        <button onClick={() => setMethod('password')}>
          Password
        </button>
        <button onClick={() => setMethod('biometric')}>
          Face ID / Touch ID
        </button>
        <button onClick={() => setMethod('sms')}>
          SMS Code
        </button>
      </div>

      {method === 'password' && (
        <input
          type="password"
          autoComplete="current-password"
        />
      )}

      {method === 'biometric' && (
        <button onClick={authenticateWithBiometric}>
          Use Face ID / Touch ID
        </button>
      )}

      {method === 'sms' && (
        <div>
          <p>We'll text a code to your phone: ***-***-1234</p>
          <input
            type="text"
            placeholder="Enter code"
            autoComplete="one-time-code"
          />
        </div>
      )}
    </div>
  );
}

// Good: Object recognition CAPTCHA (acceptable)
function ObjectCaptcha() {
  return (
    <div>
      <p>Select all images containing a traffic light:</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {images.map((image) => (
          <button
            key={image.id}
            onClick={() => toggleSelection(image.id)}
          >
            <img src={image.src} alt="" role="presentation" />
          </button>
        ))}
      </div>
    </div>
  );
}

// Bad: Text-based CAPTCHA without alternative
function BadCaptcha() {
  return (
    <div>
      <img src="/captcha/distorted-text.png" alt="CAPTCHA" />
      <input placeholder="Enter the text above" />
      {/* No alternative provided - FAILS */}
    </div>
  );
}

// Good: CAPTCHA with alternative
function AccessibleCaptcha() {
  const [method, setMethod] = useState('visual');

  return (
    <div>
      {method === 'visual' && (
        <>
          <img src="/captcha/objects.png" alt="Select all traffic lights" />
          <div>{/* Object selection interface */}</div>
        </>
      )}

      {method === 'audio' && (
        <>
          <audio controls src="/captcha/audio-challenge.mp3" />
          <input placeholder="Enter what you heard" />
        </>
      )}

      <button onClick={() => setMethod(method === 'visual' ? 'audio' : 'visual')}>
        Switch to {method === 'visual' ? 'audio' : 'visual'} challenge
      </button>
    </div>
  );
}

// Good: WebAuthn / Passkeys (no cognitive test)
async function registerPasskey() {
  try {
    const credential = await navigator.credentials.create({
      publicKey: {
        challenge: new Uint8Array(/* ... */),
        rp: { name: "Your App" },
        user: {
          id: new Uint8Array(/* ... */),
          name: "user@example.com",
          displayName: "User Name"
        },
        pubKeyCredParams: [{ alg: -7, type: "public-key" }]
      }
    });
    // Store credential
  } catch (err) {
    console.error('Passkey registration failed', err);
  }
}
```

**Acceptable Authentication Methods:**
✅ Biometric (Face ID, Touch ID, fingerprint)
✅ Hardware tokens (YubiKey)
✅ SMS/email one-time codes (with copy-paste)
✅ OAuth/SSO (Sign in with Google, etc.)
✅ Magic links (email sign-in links)
✅ Password managers (with autocomplete enabled)
✅ WebAuthn / Passkeys
✅ Object recognition (select all traffic lights)
✅ Personal content recognition (your uploaded photo)

❌ Text-based CAPTCHA only
❌ Math problems
❌ Memory tests (without password manager support)
❌ Password without paste enabled
❌ Complex password rules preventing password managers

**Testing:**
- [ ] Password fields allow paste
- [ ] Password fields use `autoComplete="current-password"`
- [ ] Alternative auth method available (biometric, magic link, SMS)
- [ ] OR password manager can save/fill credentials
- [ ] CAPTCHA uses object recognition or has alternatives
- [ ] No text transcription required without alternative

**Tools:**
- Test with password manager (1Password, LastPass, built-in)
- Test paste functionality
- Try authentication without typing

---

## Principle 4: Robust

### 4.1 Compatible

#### ✅ 4.1.1 Parsing (Level A)

**Requirement:** HTML is well-formed (proper opening/closing tags, unique IDs, etc.)

**Implementation:**
- Use valid HTML5
- Validate with W3C validator

**Testing:**
- [ ] Run HTML validator
- [ ] No duplicate IDs
- [ ] All tags properly closed

**Tools:**
- W3C HTML Validator: https://validator.w3.org/

---

#### ✅ 4.1.2 Name, Role, Value (Level A)

**Requirement:** All UI components have accessible name and role.

**Implementation:**
```jsx
// Built-in HTML elements (role is implicit)
<button>Click me</button> {/* role="button" implicit */}
<a href="...">Link</a> {/* role="link" implicit */}

// Custom components need explicit ARIA
<div
  role="button"
  aria-label="Close menu"
  aria-pressed="false"
  tabIndex={0}
>
  ×
</div>
```

**Testing:**
- [ ] All buttons have accessible names
- [ ] All links have text or aria-label
- [ ] Custom components have proper ARIA roles
- [ ] State changes communicated (aria-expanded, aria-pressed)

**Tools:**
- axe DevTools
- Screen reader testing

---

#### ✅ 4.1.3 Status Messages (Level AA) ⭐

**Requirement:** Status messages can be programmatically determined through role or properties so they can be presented to the user by assistive technologies without receiving focus.

**Why This Matters:**
Screen reader users need to know when important status changes occur (form submission success, errors, loading states, search results) without interrupting their current task or having to hunt for the message.

**Implementation:**
```jsx
// Good: Success message with aria-live
function FormSuccessMessage({ message }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      style={{
        padding: '1rem',
        background: '#d1fae5',
        border: '1px solid #10b981',
        borderRadius: '0.5rem',
      }}
    >
      {message}
    </div>
  );
}

// Good: Error message with alert role
function ErrorAlert({ message }) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      style={{
        padding: '1rem',
        background: '#fee2e2',
        border: '1px solid #ef4444',
        borderRadius: '0.5rem',
      }}
    >
      <strong>Error:</strong> {message}
    </div>
  );
}

// Good: Loading state
function LoadingStatus({ isLoading }) {
  return isLoading ? (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading content"
    >
      <span aria-hidden="true">Loading...</span>
    </div>
  ) : null;
}

// Good: Search results status
function SearchResults({ query, resultCount, isLoading }) {
  return (
    <div>
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {isLoading ? (
          `Searching for "${query}"...`
        ) : (
          `Found ${resultCount} result${resultCount !== 1 ? 's' : ''} for "${query}"`
        )}
      </div>
      {/* Results list */}
    </div>
  );
}

// Good: Form validation status
function FormField({ label, value, onChange, error }) {
  const [touched, setTouched] = useState(false);
  const inputId = useId();
  const errorId = `${inputId}-error`;

  return (
    <div>
      <label htmlFor={inputId}>{label}</label>
      <input
        id={inputId}
        value={value}
        onChange={onChange}
        onBlur={() => setTouched(true)}
        aria-invalid={touched && error ? 'true' : 'false'}
        aria-describedby={touched && error ? errorId : undefined}
      />
      {touched && error && (
        <div
          id={errorId}
          role="alert"
          aria-live="assertive"
          style={{ color: '#ef4444', marginTop: '0.25rem' }}
        >
          {error}
        </div>
      )}
    </div>
  );
}

// Good: Cart update notification
function AddToCartButton({ product, onAdd }) {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAdd = () => {
    onAdd(product);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <>
      <button onClick={handleAdd}>Add to Cart</button>
      {showSuccess && (
        <div
          role="status"
          aria-live="polite"
          style={{
            marginTop: '0.5rem',
            color: '#10b981',
          }}
        >
          ✓ {product.name} added to cart
        </div>
      )}
    </>
  );
}

// Good: Progress indicator
function UploadProgress({ progress }) {
  return (
    <div>
      <div
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Upload progress"
        style={{
          width: '100%',
          height: '20px',
          background: '#e5e7eb',
          borderRadius: '10px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            background: '#6366f1',
            transition: 'width 0.3s',
          }}
        />
      </div>
      <div role="status" aria-live="polite" aria-atomic="true">
        Upload {progress}% complete
      </div>
    </div>
  );
}

// Good: Live region for dynamic content
function LiveFeed() {
  const [messages, setMessages] = useState([]);

  return (
    <div>
      <h2>Live Updates</h2>
      <div
        role="log"
        aria-live="polite"
        aria-atomic="false"
        style={{
          maxHeight: '400px',
          overflow: 'auto',
        }}
      >
        {messages.map((msg) => (
          <div key={msg.id}>{msg.text}</div>
        ))}
      </div>
    </div>
  );
}

// Bad: Status message without ARIA
function BadStatusMessage({ message }) {
  return (
    <div className="success-message">
      {/* No role or aria-live - screen readers won't announce */}
      {message}
    </div>
  );
}

// Bad: Moving focus to status message
function BadErrorHandling({ error }) {
  const errorRef = useRef(null);

  useEffect(() => {
    if (error && errorRef.current) {
      // Don't do this! Interrupts user's current task
      errorRef.current.focus();
    }
  }, [error]);

  return (
    <div ref={errorRef} tabIndex={-1}>
      {error}
    </div>
  );
}
```

**ARIA Live Regions:**
```html
<!-- role="status" - for non-critical info -->
<div role="status" aria-live="polite">
  Your changes have been saved.
</div>

<!-- role="alert" - for important/urgent messages -->
<div role="alert" aria-live="assertive">
  Error: Unable to save your changes.
</div>

<!-- role="log" - for sequential updates -->
<div role="log" aria-live="polite" aria-atomic="false">
  New message received...
</div>

<!-- role="progressbar" - for progress indicators -->
<div
  role="progressbar"
  aria-valuenow="45"
  aria-valuemin="0"
  aria-valuemax="100"
  aria-label="Download progress"
>
  45% complete
</div>
```

**aria-live Values:**
- `off` - Updates not announced (default)
- `polite` - Announced when user is idle (most common)
- `assertive` - Announced immediately (use sparingly, for errors/alerts)

**aria-atomic Values:**
- `true` - Entire region announced (for complete status messages)
- `false` - Only changed content announced (for logs, feeds)

**Common Status Messages:**
1. **Form submission results**
   - "Form submitted successfully"
   - "Error: Please fix the highlighted fields"

2. **Search/filter results**
   - "Showing 24 results for 'laptop'"
   - "No results found"

3. **Loading states**
   - "Loading content..."
   - "Saving changes..."

4. **Item updates**
   - "Item added to cart"
   - "Bookmark saved"

5. **Progress indicators**
   - "Upload 45% complete"
   - "Step 2 of 5"

**Testing:**
- [ ] All status messages have role="status", role="alert", or aria-live
- [ ] Screen reader announces status changes without moving focus
- [ ] Success messages use role="status" or aria-live="polite"
- [ ] Errors use role="alert" or aria-live="assertive"
- [ ] Test with VoiceOver (macOS), NVDA (Windows), or JAWS
- [ ] Verify messages are announced at appropriate time
- [ ] Verify focus remains in current location
- [ ] Test loading states are announced
- [ ] Test form validation messages are announced

**Common Violations:**
- Status messages without role or aria-live
- Moving focus to status messages (interrupts user)
- Using aria-live="assertive" for non-urgent messages
- Announcements too frequent (overwhelming)
- Status messages that appear/disappear too quickly
- Missing aria-atomic when entire message should be announced

**Exceptions:**
- Changes that require user action (should move focus)
- Page titles (announced automatically)
- Dialog/modal openings (should move focus)

**Tools:**
- Screen reader testing (VoiceOver, NVDA, JAWS)
- Browser DevTools (inspect ARIA attributes)
- axe DevTools (checks for appropriate roles)

**Best Practices:**
- Use `role="status"` for non-critical updates (saves, confirmations)
- Use `role="alert"` for errors and urgent messages
- Use `aria-atomic="true"` for complete status messages
- Keep messages concise and clear
- Don't overuse aria-live (too many announcements are overwhelming)
- Test the timing - messages shouldn't appear/disappear too quickly
- Ensure visual and programmatic status match

---

## Testing Checklist

### Automated Testing (Run on every build)

- [ ] **ESLint** with jsx-a11y plugin
- [ ] **Playwright** with axe-core
- [ ] **Lighthouse** accessibility audit (95+ score)

### Manual Testing (Before release)

- [ ] **Keyboard navigation** - Tab through all pages
- [ ] **Screen reader** - Test with VoiceOver/NVDA/JAWS
- [ ] **Color contrast** - Verify all ratios
- [ ] **Zoom to 200%** - Verify no content loss
- [ ] **Resize to 320px** - Verify no horizontal scroll
- [ ] **Reduced motion** - Test with OS setting enabled

### Browser Testing

- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers

---

## Tools & Resources

### Free Testing Tools

1. **Chrome DevTools Lighthouse** - Built-in accessibility audit
2. **axe DevTools Extension** - Automated testing
3. **WAVE Extension** - Visual accessibility evaluation
4. **WebAIM Contrast Checker** - Color contrast testing
5. **Screen Readers:**
   - macOS: VoiceOver (Cmd+F5)
   - Windows: NVDA (free download)
   - Linux: Orca

### Reference Documentation

- W3C WCAG 2.2: https://www.w3.org/WAI/WCAG22/quickref/
- MDN Accessibility: https://developer.mozilla.org/en-US/docs/Web/Accessibility
- WebAIM Articles: https://webaim.org/articles/
- ARIA Authoring Practices: https://www.w3.org/WAI/ARIA/apg/

---

## Compliance Statement Template

```
This website is committed to ensuring digital accessibility for people with disabilities.
We are continually improving the user experience for everyone and applying the relevant
accessibility standards.

Conformance Status: Fully Conformant
Standards: WCAG 2.2 Level AA

Date: [Month Year]
Last Reviewed: [Month Year]
```

---

**Last Updated:** October 2025
**Version:** WCAG 2.2 (October 2023)
