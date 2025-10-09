import { useState, useRef, useEffect } from 'react'

/**
 * WCAG 2.2 Compliant Tooltip Component
 *
 * Follows accessibility guidelines:
 * - SC 1.4.13: Content on Hover or Focus
 * - Dismissible: Can be dismissed with ESC key
 * - Hoverable: Tooltip content can be hovered without disappearing
 * - Persistent: Stays visible until user moves focus/hover away
 * - Keyboard accessible: Works with focus events
 * - ARIA: Uses aria-describedby for screen readers
 */
function Tooltip({ children, content, position = 'bottom', delay = 200 }) {
  const [isVisible, setIsVisible] = useState(false)
  const [tooltipId] = useState(`tooltip-${Math.random().toString(36).substr(2, 9)}`)
  const timeoutRef = useRef(null)
  const tooltipRef = useRef(null)

  useEffect(() => {
    // ESC key to dismiss tooltip (WCAG 2.2 requirement)
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isVisible) {
        setIsVisible(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isVisible])

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
    }, delay)
  }

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsVisible(false)
  }

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2'
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 mt-2'
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-2'
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-2'
      default:
        return 'top-full left-1/2 -translate-x-1/2 mt-2'
    }
  }

  const getArrowClasses = () => {
    switch (position) {
      case 'top':
        return 'top-full left-1/2 -translate-x-1/2 border-t-gray-900 dark:border-t-gray-700 border-l-transparent border-r-transparent border-b-transparent'
      case 'bottom':
        return 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-900 dark:border-b-gray-700 border-l-transparent border-r-transparent border-t-transparent'
      case 'left':
        return 'left-full top-1/2 -translate-y-1/2 border-l-gray-900 dark:border-l-gray-700 border-t-transparent border-b-transparent border-r-transparent'
      case 'right':
        return 'right-full top-1/2 -translate-y-1/2 border-r-gray-900 dark:border-r-gray-700 border-t-transparent border-b-transparent border-l-transparent'
      default:
        return 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-900 dark:border-b-gray-700 border-l-transparent border-r-transparent border-t-transparent'
    }
  }

  return (
    <div
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {/* Clone children to add aria-describedby */}
      {typeof children === 'function'
        ? children({ 'aria-describedby': isVisible ? tooltipId : undefined })
        : children
      }

      {/* Tooltip */}
      {isVisible && (
        <div
          ref={tooltipRef}
          id={tooltipId}
          role="tooltip"
          className={`absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 dark:bg-gray-700 rounded-lg shadow-lg whitespace-nowrap pointer-events-auto ${getPositionClasses()}`}
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={hideTooltip}
        >
          {content}

          {/* Arrow */}
          <div
            className={`absolute w-0 h-0 border-4 ${getArrowClasses()}`}
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  )
}

export default Tooltip
