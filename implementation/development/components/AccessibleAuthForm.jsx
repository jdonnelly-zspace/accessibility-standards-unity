/**
 * AccessibleAuthForm.jsx
 *
 * Demonstrates WCAG 2.2 Success Criterion 3.3.8: Accessible Authentication (Minimum) - Level AA
 *
 * Key Features:
 * - Password manager support with autocomplete attributes
 * - Paste enabled (no onPaste prevention)
 * - Multiple authentication methods (password, magic link, biometric)
 * - No cognitive function tests without alternatives
 * - Proper form labeling and error handling
 *
 * Related Success Criteria:
 * - 3.3.2 Labels or Instructions (Level A)
 * - 3.3.7 Redundant Entry (Level A)
 * - 4.1.3 Status Messages (Level AA)
 */

import React, { useState, useEffect } from 'react';

export default function AccessibleAuthForm() {
  const [authMethod, setAuthMethod] = useState('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState(''); // 'success', 'error', or ''
  const [isLoading, setIsLoading] = useState(false);

  // Clear status message after 5 seconds
  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => {
        setStatusMessage('');
        setStatusType('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setStatusMessage('Successfully logged in');
      setStatusType('success');
      // In real app: redirect to dashboard
    } catch (error) {
      setStatusMessage('Login failed. Please check your credentials.');
      setStatusType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLinkRequest = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate sending magic link
      await new Promise(resolve => setTimeout(resolve, 1000));

      setStatusMessage(`Magic link sent to ${email}. Check your inbox.`);
      setStatusType('success');
    } catch (error) {
      setStatusMessage('Failed to send magic link. Please try again.');
      setStatusType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricAuth = async () => {
    setIsLoading(true);

    try {
      // Check if WebAuthn is available
      if (!window.PublicKeyCredential) {
        throw new Error('Biometric authentication not supported');
      }

      // Simulate biometric authentication
      await new Promise(resolve => setTimeout(resolve, 1000));

      setStatusMessage('Successfully authenticated with biometrics');
      setStatusType('success');
    } catch (error) {
      setStatusMessage('Biometric authentication failed or not available.');
      setStatusType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Sign In</h1>

      <p style={styles.description}>
        Choose your preferred authentication method. All methods are equally secure.
      </p>

      {/* Authentication Method Selector */}
      <div role="tablist" aria-label="Authentication methods" style={styles.tabList}>
        <button
          role="tab"
          aria-selected={authMethod === 'password'}
          aria-controls="password-panel"
          onClick={() => setAuthMethod('password')}
          style={{
            ...styles.tab,
            ...(authMethod === 'password' ? styles.activeTab : {})
          }}
        >
          Password
        </button>
        <button
          role="tab"
          aria-selected={authMethod === 'magicLink'}
          aria-controls="magiclink-panel"
          onClick={() => setAuthMethod('magicLink')}
          style={{
            ...styles.tab,
            ...(authMethod === 'magicLink' ? styles.activeTab : {})
          }}
        >
          Email Magic Link
        </button>
        <button
          role="tab"
          aria-selected={authMethod === 'biometric'}
          aria-controls="biometric-panel"
          onClick={() => setAuthMethod('biometric')}
          style={{
            ...styles.tab,
            ...(authMethod === 'biometric' ? styles.activeTab : {})
          }}
        >
          Biometric
        </button>
      </div>

      {/* Password Authentication Panel */}
      {authMethod === 'password' && (
        <div
          role="tabpanel"
          id="password-panel"
          aria-labelledby="password-tab"
          style={styles.panel}
        >
          <form onSubmit={handlePasswordLogin}>
            <div style={styles.formGroup}>
              <label htmlFor="email-password" style={styles.label}>
                Email Address
              </label>
              <input
                id="email-password"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                aria-describedby="email-help"
              />
              <span id="email-help" style={styles.helpText}>
                We'll never share your email with anyone else.
              </span>
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="password" style={styles.label}>
                Password
              </label>
              <div style={styles.passwordWrapper}>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                  // IMPORTANT: Paste is enabled (no onPaste handler blocking it)
                  // This allows password managers to work properly
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={styles.showPasswordButton}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              <span style={styles.helpText}>
                Use your password manager or paste your password
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                ...styles.button,
                ...(isLoading ? styles.buttonDisabled : {})
              }}
            >
              {isLoading ? 'Signing in...' : 'Sign In with Password'}
            </button>
          </form>
        </div>
      )}

      {/* Magic Link Authentication Panel */}
      {authMethod === 'magicLink' && (
        <div
          role="tabpanel"
          id="magiclink-panel"
          aria-labelledby="magiclink-tab"
          style={styles.panel}
        >
          <form onSubmit={handleMagicLinkRequest}>
            <p style={styles.panelDescription}>
              We'll send you an email with a secure sign-in link. No password needed!
            </p>

            <div style={styles.formGroup}>
              <label htmlFor="email-magic" style={styles.label}>
                Email Address
              </label>
              <input
                id="email-magic"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                ...styles.button,
                ...(isLoading ? styles.buttonDisabled : {})
              }}
            >
              {isLoading ? 'Sending...' : 'Send Magic Link'}
            </button>
          </form>
        </div>
      )}

      {/* Biometric Authentication Panel */}
      {authMethod === 'biometric' && (
        <div
          role="tabpanel"
          id="biometric-panel"
          aria-labelledby="biometric-tab"
          style={styles.panel}
        >
          <p style={styles.panelDescription}>
            Use Face ID, Touch ID, Windows Hello, or your device's biometric authentication.
          </p>

          <button
            type="button"
            onClick={handleBiometricAuth}
            disabled={isLoading}
            style={{
              ...styles.button,
              ...(isLoading ? styles.buttonDisabled : {})
            }}
          >
            {isLoading ? 'Authenticating...' : 'Authenticate with Biometrics'}
          </button>

          <p style={styles.helpText}>
            Note: Biometric authentication requires a supported device and browser.
          </p>
        </div>
      )}

      {/* Status Message - WCAG 2.2 SC 4.1.3: Status Messages */}
      {statusMessage && (
        <div
          role={statusType === 'error' ? 'alert' : 'status'}
          aria-live={statusType === 'error' ? 'assertive' : 'polite'}
          aria-atomic="true"
          style={{
            ...styles.statusMessage,
            ...(statusType === 'success' ? styles.successMessage : {}),
            ...(statusType === 'error' ? styles.errorMessage : {})
          }}
        >
          {statusMessage}
        </div>
      )}

      {/* Accessibility Notes */}
      <details style={styles.details}>
        <summary style={styles.summary}>Accessibility Features</summary>
        <ul style={styles.featureList}>
          <li>✅ Multiple authentication methods (no single cognitive test required)</li>
          <li>✅ Password manager support via <code>autocomplete</code> attributes</li>
          <li>✅ Paste enabled (no cognitive memory test without assistance)</li>
          <li>✅ Magic link option (no password memorization required)</li>
          <li>✅ Biometric option (no cognitive function test)</li>
          <li>✅ Proper form labels and instructions</li>
          <li>✅ Status messages announced to screen readers</li>
          <li>✅ Keyboard accessible (all interactions via keyboard)</li>
          <li>✅ Show/hide password toggle for easier verification</li>
        </ul>
      </details>
    </div>
  );
}

// Styles
const styles = {
  container: {
    maxWidth: '500px',
    margin: '2rem auto',
    padding: '2rem',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    fontSize: '2rem',
    marginBottom: '0.5rem',
    color: '#1a1a1a',
  },
  description: {
    marginBottom: '1.5rem',
    color: '#666',
    lineHeight: '1.6',
  },
  tabList: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1.5rem',
    borderBottom: '2px solid #e5e7eb',
  },
  tab: {
    flex: 1,
    padding: '0.75rem 1rem',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#666',
    cursor: 'pointer',
    fontSize: '1rem',
    borderBottom: '3px solid transparent',
    transition: 'all 0.2s',
  },
  activeTab: {
    color: '#6366f1',
    borderBottomColor: '#6366f1',
    fontWeight: '600',
  },
  panel: {
    marginTop: '1.5rem',
  },
  panelDescription: {
    marginBottom: '1.5rem',
    color: '#666',
    lineHeight: '1.6',
  },
  formGroup: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '600',
    color: '#1a1a1a',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    border: '2px solid #d1d5db',
    borderRadius: '4px',
    boxSizing: 'border-box',
  },
  passwordWrapper: {
    position: 'relative',
  },
  showPasswordButton: {
    position: 'absolute',
    right: '0.5rem',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.25rem',
    padding: '0.5rem',
  },
  helpText: {
    display: 'block',
    marginTop: '0.25rem',
    fontSize: '0.875rem',
    color: '#666',
  },
  button: {
    width: '100%',
    padding: '0.875rem 1.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#6366f1',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
    cursor: 'not-allowed',
  },
  statusMessage: {
    marginTop: '1.5rem',
    padding: '1rem',
    borderRadius: '4px',
    fontSize: '0.95rem',
  },
  successMessage: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
    border: '1px solid #10b981',
  },
  errorMessage: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    border: '1px solid #ef4444',
  },
  details: {
    marginTop: '2rem',
    padding: '1rem',
    backgroundColor: '#f9fafb',
    borderRadius: '4px',
  },
  summary: {
    cursor: 'pointer',
    fontWeight: '600',
    color: '#6366f1',
  },
  featureList: {
    marginTop: '1rem',
    paddingLeft: '1.5rem',
    lineHeight: '1.8',
    color: '#374151',
  },
};
