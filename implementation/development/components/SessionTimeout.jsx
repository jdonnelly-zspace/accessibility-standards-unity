import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Session Timeout Component
 *
 * Demonstrates WCAG 2.2 Success Criterion:
 * - 2.2.6 Timeouts (Level AAA)
 *
 * Provides visible information about session timeout duration and warns users
 * before their session expires, preventing data loss.
 *
 * Features:
 * - Displays session timeout duration
 * - Countdown timer showing time remaining
 * - Warning modal when timeout is approaching
 * - Options to extend session or save work
 * - Screen reader announcements via aria-live
 * - Keyboard accessible
 *
 * @param {number} timeoutMinutes - Session timeout duration in minutes (default: 30)
 * @param {number} warningMinutes - When to show warning before timeout (default: 5)
 * @param {function} onExtendSession - Callback when user extends session
 * @param {function} onSaveWork - Callback when user saves work
 * @param {function} onTimeout - Callback when session expires
 * @param {boolean} showPermanentInfo - Show persistent timeout info (default: true)
 *
 * @example
 * <SessionTimeout
 *   timeoutMinutes={30}
 *   warningMinutes={5}
 *   onExtendSession={() => console.log('Session extended')}
 *   onSaveWork={() => console.log('Work saved')}
 *   onTimeout={() => console.log('Session expired')}
 * />
 */

function SessionTimeout({
  timeoutMinutes = 30,
  warningMinutes = 5,
  onExtendSession = null,
  onSaveWork = null,
  onTimeout = null,
  showPermanentInfo = true,
}) {
  const [timeRemaining, setTimeRemaining] = useState(timeoutMinutes * 60);
  const [showWarning, setShowWarning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const warningThreshold = warningMinutes * 60;
  const timerRef = useRef(null);

  // Format time as MM:SS
  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Handle session extension
  const handleExtendSession = useCallback(() => {
    setTimeRemaining(timeoutMinutes * 60);
    setShowWarning(false);
    if (onExtendSession) {
      onExtendSession();
    }
  }, [timeoutMinutes, onExtendSession]);

  // Handle save work
  const handleSaveWork = useCallback(() => {
    setShowWarning(false);
    if (onSaveWork) {
      onSaveWork();
    }
  }, [onSaveWork]);

  // Handle timeout
  const handleTimeout = useCallback(() => {
    if (onTimeout) {
      onTimeout();
    }
  }, [onTimeout]);

  // Reset timer on user activity
  const resetTimer = useCallback(() => {
    if (!isPaused && !showWarning) {
      setTimeRemaining(timeoutMinutes * 60);
    }
  }, [isPaused, showWarning, timeoutMinutes]);

  // Countdown timer
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1;

        // Show warning when threshold reached
        if (newTime === warningThreshold && !showWarning) {
          setShowWarning(true);
        }

        // Handle timeout
        if (newTime <= 0) {
          clearInterval(timerRef.current);
          handleTimeout();
          return 0;
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isPaused, showWarning, warningThreshold, handleTimeout]);

  // Listen for user activity to reset timer
  useEffect(() => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];

    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [resetTimer]);

  // Close warning modal with ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showWarning) {
        handleExtendSession();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showWarning, handleExtendSession]);

  return (
    <>
      {/* Permanent session info (always visible) */}
      {showPermanentInfo && (
        <div className="session-timeout-info" role="status" aria-live="polite">
          <span className="timeout-icon" aria-hidden="true">⏱️</span>
          <span className="timeout-text">
            Session expires after <strong>{timeoutMinutes} minutes</strong> of inactivity
          </span>
        </div>
      )}

      {/* Warning modal (shown when timeout approaching) */}
      {showWarning && (
        <>
          {/* Modal backdrop */}
          <div
            className="timeout-backdrop"
            onClick={handleExtendSession}
            aria-hidden="true"
          />

          {/* Warning modal */}
          <div
            className="timeout-warning"
            role="alertdialog"
            aria-labelledby="timeout-title"
            aria-describedby="timeout-description"
            aria-live="assertive"
            aria-modal="true"
          >
            <div className="timeout-header">
              <h2 id="timeout-title" className="timeout-title">
                ⚠️ Session Expiring Soon
              </h2>
              <button
                type="button"
                className="timeout-close"
                onClick={handleExtendSession}
                aria-label="Close and extend session"
              >
                ✕
              </button>
            </div>

            <div className="timeout-body">
              <p id="timeout-description" className="timeout-message">
                Your session will expire in{' '}
                <strong className="timeout-countdown">
                  {formatTime(timeRemaining)}
                </strong>
                .
              </p>
              <p className="timeout-warning-text">
                Any unsaved changes will be lost. Please save your work or extend your session.
              </p>

              {/* Countdown progress bar */}
              <div
                className="timeout-progress"
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax={warningThreshold}
                aria-valuenow={timeRemaining}
                aria-label={`Time remaining: ${formatTime(timeRemaining)}`}
              >
                <div
                  className="timeout-progress-bar"
                  style={{
                    width: `${(timeRemaining / warningThreshold) * 100}%`
                  }}
                />
              </div>
            </div>

            <div className="timeout-actions">
              <button
                type="button"
                className="timeout-button timeout-button-primary"
                onClick={handleExtendSession}
                autoFocus
              >
                Extend Session
              </button>
              {onSaveWork && (
                <button
                  type="button"
                  className="timeout-button timeout-button-secondary"
                  onClick={handleSaveWork}
                >
                  Save Work
                </button>
              )}
            </div>

            <p className="timeout-hint">
              Press <kbd>ESC</kbd> to extend session
            </p>
          </div>
        </>
      )}

      <style jsx>{`
        /* Permanent session info */
        .session-timeout-info {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background-color: #e3f2fd;
          border-left: 4px solid #1976d2;
          border-radius: 4px;
          font-size: 0.9rem;
          color: #555;
        }

        .timeout-icon {
          font-size: 1.2rem;
        }

        .timeout-text strong {
          color: #1976d2;
        }

        /* Modal backdrop */
        .timeout-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 9998;
          animation: fadeIn 0.2s ease-out;
        }

        /* Warning modal */
        .timeout-warning {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: #fff;
          border: 3px solid #f44336;
          border-radius: 8px;
          padding: 0;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
          z-index: 9999;
          max-width: 500px;
          width: 90%;
          animation: slideIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translate(-50%, -45%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }

        /* Modal header */
        .timeout-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem;
          background-color: #ffebee;
          border-bottom: 2px solid #f44336;
          border-radius: 5px 5px 0 0;
        }

        .timeout-title {
          margin: 0;
          font-size: 1.5rem;
          color: #c62828;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .timeout-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0.25rem;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          color: #c62828;
        }

        .timeout-close:hover {
          background-color: rgba(198, 40, 40, 0.1);
        }

        .timeout-close:focus {
          outline: 2px solid #c62828;
          outline-offset: 2px;
        }

        /* Modal body */
        .timeout-body {
          padding: 1.5rem;
        }

        .timeout-message {
          margin: 0 0 1rem 0;
          font-size: 1.1rem;
          color: #333;
        }

        .timeout-countdown {
          color: #c62828;
          font-size: 1.3rem;
          font-family: 'Courier New', monospace;
        }

        .timeout-warning-text {
          margin: 0 0 1.5rem 0;
          color: #555;
        }

        /* Progress bar */
        .timeout-progress {
          width: 100%;
          height: 8px;
          background-color: #eee;
          border-radius: 4px;
          overflow: hidden;
          margin-top: 1rem;
        }

        .timeout-progress-bar {
          height: 100%;
          background-color: #f44336;
          transition: width 1s linear;
        }

        /* Modal actions */
        .timeout-actions {
          display: flex;
          gap: 1rem;
          padding: 1.5rem;
          border-top: 1px solid #eee;
        }

        .timeout-button {
          flex: 1;
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          font-weight: 600;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .timeout-button-primary {
          background-color: #1976d2;
          color: white;
        }

        .timeout-button-primary:hover {
          background-color: #1565c0;
        }

        .timeout-button-primary:focus {
          outline: 3px solid #1976d2;
          outline-offset: 2px;
        }

        .timeout-button-secondary {
          background-color: #f5f5f5;
          color: #333;
          border: 2px solid #ddd;
        }

        .timeout-button-secondary:hover {
          background-color: #e0e0e0;
        }

        .timeout-button-secondary:focus {
          outline: 3px solid #666;
          outline-offset: 2px;
        }

        /* Hint */
        .timeout-hint {
          margin: 0;
          padding: 0 1.5rem 1rem 1.5rem;
          font-size: 0.85rem;
          color: #777;
          text-align: center;
        }

        .timeout-hint kbd {
          padding: 0.15rem 0.4rem;
          background-color: #f5f5f5;
          border: 1px solid #ccc;
          border-radius: 3px;
          font-family: 'Courier New', monospace;
          font-size: 0.9em;
        }

        /* Responsive */
        @media (max-width: 500px) {
          .timeout-warning {
            width: 95%;
            max-width: none;
          }

          .timeout-header {
            padding: 1rem;
          }

          .timeout-title {
            font-size: 1.25rem;
          }

          .timeout-body {
            padding: 1rem;
          }

          .timeout-actions {
            flex-direction: column;
            padding: 1rem;
          }

          .timeout-button {
            width: 100%;
          }
        }

        /* Accessibility: Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .timeout-backdrop,
          .timeout-warning {
            animation: none;
          }

          .timeout-progress-bar {
            transition: none;
          }
        }
      `}</style>
    </>
  );
}

export default SessionTimeout;
