/**
 * ConsistentHelp.jsx
 *
 * Demonstrates WCAG 2.2 Success Criterion 3.2.6: Consistent Help - Level A
 *
 * Key Features:
 * - Help mechanisms appear in the same relative order across all pages
 * - Multiple help options (live chat, phone, FAQ, contact form)
 * - Consistent positioning (floating widget, footer, or header)
 * - Keyboard accessible
 * - Screen reader friendly with proper ARIA labels
 *
 * Usage:
 * - Place <ConsistentHelpWidget /> in your layout component
 * - Ensure it appears in the same position on every page
 * - Maintain the same order of help options across the site
 */

import React, { useState, useEffect, useRef } from 'react';

export default function ConsistentHelpWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const widgetRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (widgetRef.current && !widgetRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const helpOptions = [
    {
      id: 'live-chat',
      icon: '💬',
      title: 'Live Chat',
      description: 'Chat with our support team',
      action: () => {
        alert('Opening live chat...');
        // In real app: open chat widget
      },
    },
    {
      id: 'phone',
      icon: '📞',
      title: 'Call Us',
      description: '1-800-555-0100',
      action: null,
      href: 'tel:1-800-555-0100',
    },
    {
      id: 'faq',
      icon: '❓',
      title: 'FAQs',
      description: 'Find answers to common questions',
      action: null,
      href: '/faq',
    },
    {
      id: 'contact',
      icon: '✉️',
      title: 'Contact Form',
      description: 'Send us a message',
      action: null,
      href: '/contact',
    },
  ];

  return (
    <>
      {/* Floating Help Button - Always in same position */}
      <div ref={widgetRef} style={styles.container}>
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Get help - Open help menu"
            aria-expanded={isOpen}
            style={styles.helpButton}
          >
            <span style={styles.helpIcon}>?</span>
            <span style={styles.helpButtonText}>Help</span>
          </button>
        ) : (
          <div
            role="dialog"
            aria-label="Help options"
            style={styles.helpMenu}
          >
            <div style={styles.helpMenuHeader}>
              <h2 style={styles.helpMenuTitle}>How can we help?</h2>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close help menu"
                style={styles.closeButton}
              >
                ×
              </button>
            </div>

            {/* Help Options - ALWAYS IN THE SAME ORDER */}
            <nav aria-label="Help options">
              <ul style={styles.helpList}>
                {helpOptions.map((option) => (
                  <li key={option.id} style={styles.helpListItem}>
                    {option.href ? (
                      <a
                        href={option.href}
                        style={styles.helpOption}
                        onClick={() => setIsOpen(false)}
                      >
                        <span style={styles.helpOptionIcon}>{option.icon}</span>
                        <div style={styles.helpOptionContent}>
                          <strong style={styles.helpOptionTitle}>{option.title}</strong>
                          <span style={styles.helpOptionDescription}>
                            {option.description}
                          </span>
                        </div>
                      </a>
                    ) : (
                      <button
                        onClick={() => {
                          option.action();
                          setIsOpen(false);
                        }}
                        style={styles.helpOption}
                      >
                        <span style={styles.helpOptionIcon}>{option.icon}</span>
                        <div style={styles.helpOptionContent}>
                          <strong style={styles.helpOptionTitle}>{option.title}</strong>
                          <span style={styles.helpOptionDescription}>
                            {option.description}
                          </span>
                        </div>
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            <div style={styles.helpMenuFooter}>
              <p style={styles.footerText}>
                Available Monday-Friday, 9AM-5PM EST
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/**
 * ConsistentHelpFooter
 *
 * Alternative implementation: Help in footer
 * Ensures same relative order across all pages
 */
export function ConsistentHelpFooter() {
  return (
    <footer style={styles.footer}>
      <div style={styles.footerContent}>
        <h2 style={styles.footerHeading}>Need Help?</h2>
        <p style={styles.footerSubheading}>
          We're here to assist you with any questions or concerns.
        </p>

        {/* Help mechanisms in consistent order */}
        <nav aria-label="Help and support">
          <ul style={styles.footerHelpList}>
            <li style={styles.footerHelpItem}>
              <button
                onClick={() => alert('Opening live chat...')}
                style={styles.footerHelpLink}
              >
                💬 Live Chat
              </button>
            </li>
            <li style={styles.footerHelpItem}>
              <a href="tel:1-800-555-0100" style={styles.footerHelpLink}>
                📞 Call: 1-800-555-0100
              </a>
            </li>
            <li style={styles.footerHelpItem}>
              <a href="/faq" style={styles.footerHelpLink}>
                ❓ FAQs
              </a>
            </li>
            <li style={styles.footerHelpItem}>
              <a href="/contact" style={styles.footerHelpLink}>
                ✉️ Contact Form
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}

/**
 * ConsistentHelpHeader
 *
 * Alternative implementation: Help in navigation header
 * Ensures same position across all pages
 */
export function ConsistentHelpHeader() {
  const [helpMenuOpen, setHelpMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setHelpMenuOpen(false);
      }
    };

    if (helpMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [helpMenuOpen]);

  return (
    <header style={styles.header}>
      <nav style={styles.headerNav}>
        <a href="/" style={styles.headerLogo}>MyApp</a>

        <ul style={styles.headerMenu}>
          <li style={styles.headerMenuItem}>
            <a href="/products" style={styles.headerLink}>Products</a>
          </li>
          <li style={styles.headerMenuItem}>
            <a href="/about" style={styles.headerLink}>About</a>
          </li>
          {/* Help always last in navigation - consistent position */}
          <li style={styles.headerMenuItem} ref={menuRef}>
            <button
              onClick={() => setHelpMenuOpen(!helpMenuOpen)}
              aria-expanded={helpMenuOpen}
              aria-haspopup="true"
              style={styles.headerLink}
            >
              Help
            </button>

            {helpMenuOpen && (
              <ul
                role="menu"
                style={styles.headerDropdown}
              >
                <li role="none">
                  <button
                    role="menuitem"
                    onClick={() => {
                      alert('Opening live chat...');
                      setHelpMenuOpen(false);
                    }}
                    style={styles.dropdownItem}
                  >
                    💬 Live Chat
                  </button>
                </li>
                <li role="none">
                  <a
                    role="menuitem"
                    href="tel:1-800-555-0100"
                    style={styles.dropdownItem}
                  >
                    📞 Call: 1-800-555-0100
                  </a>
                </li>
                <li role="none">
                  <a
                    role="menuitem"
                    href="/faq"
                    style={styles.dropdownItem}
                  >
                    ❓ FAQs
                  </a>
                </li>
                <li role="none">
                  <a
                    role="menuitem"
                    href="/contact"
                    style={styles.dropdownItem}
                  >
                    ✉️ Contact Form
                  </a>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}

// Styles
const styles = {
  // Floating Widget Styles
  container: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 1000,
  },
  helpButton: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  helpIcon: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  helpButtonText: {
    fontSize: '0.7rem',
    marginTop: '2px',
  },
  helpMenu: {
    width: '320px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
    overflow: 'hidden',
  },
  helpMenuHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 1.25rem',
    backgroundColor: '#6366f1',
    color: 'white',
  },
  helpMenuTitle: {
    margin: 0,
    fontSize: '1.125rem',
    fontWeight: '600',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '1.75rem',
    cursor: 'pointer',
    padding: '0',
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  helpListItem: {
    borderBottom: '1px solid #e5e7eb',
  },
  helpOption: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: '1rem 1.25rem',
    textDecoration: 'none',
    color: '#1a1a1a',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    textAlign: 'left',
  },
  helpOptionIcon: {
    fontSize: '1.75rem',
    marginRight: '1rem',
  },
  helpOptionContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  helpOptionTitle: {
    fontSize: '1rem',
    marginBottom: '0.25rem',
  },
  helpOptionDescription: {
    fontSize: '0.875rem',
    color: '#666',
  },
  helpMenuFooter: {
    padding: '0.75rem 1.25rem',
    backgroundColor: '#f9fafb',
    borderTop: '1px solid #e5e7eb',
  },
  footerText: {
    margin: 0,
    fontSize: '0.75rem',
    color: '#666',
    textAlign: 'center',
  },

  // Footer Styles
  footer: {
    backgroundColor: '#1a1a1a',
    color: 'white',
    padding: '3rem 2rem',
    marginTop: '4rem',
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  footerHeading: {
    fontSize: '1.5rem',
    marginBottom: '0.5rem',
  },
  footerSubheading: {
    marginBottom: '1.5rem',
    color: '#d1d5db',
  },
  footerHelpList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1.5rem',
  },
  footerHelpItem: {
    margin: 0,
  },
  footerHelpLink: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '1rem',
    padding: '0.5rem 0',
    display: 'inline-block',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
  },

  // Header Styles
  header: {
    backgroundColor: 'white',
    borderBottom: '1px solid #e5e7eb',
    padding: '1rem 2rem',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  headerNav: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLogo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#6366f1',
    textDecoration: 'none',
  },
  headerMenu: {
    listStyle: 'none',
    display: 'flex',
    gap: '2rem',
    margin: 0,
    padding: 0,
  },
  headerMenuItem: {
    position: 'relative',
  },
  headerLink: {
    color: '#1a1a1a',
    textDecoration: 'none',
    fontSize: '1rem',
    padding: '0.5rem 0',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  headerDropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: '0.5rem',
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    listStyle: 'none',
    padding: '0.5rem 0',
    margin: 0,
    minWidth: '200px',
  },
  dropdownItem: {
    display: 'block',
    width: '100%',
    padding: '0.75rem 1rem',
    color: '#1a1a1a',
    textDecoration: 'none',
    backgroundColor: 'transparent',
    border: 'none',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '0.95rem',
  },
};
