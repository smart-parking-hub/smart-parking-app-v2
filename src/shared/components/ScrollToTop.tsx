import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export interface ScrollToTopOptions {
  /**
   * Optional custom container selector to scroll (e.g. '#main-content', '.overflow-y-auto').
   */
  containerSelector?: string
  /**
   * Scroll behavior. Defaults to 'instant' to immediately jump to the top on page transition.
   */
  behavior?: ScrollBehavior
  /**
   * Whether to scroll to top when query params change (default: false, only on pathname change).
   */
  scrollOnSearchChange?: boolean
}

/**
 * Custom hook that automatically resets scroll position to the top
 * whenever the user transitions between routes.
 */
export function useScrollToTop({
  containerSelector,
  behavior = 'instant',
  scrollOnSearchChange = false,
}: ScrollToTopOptions = {}) {
  const { pathname, search, hash } = useLocation()

  useEffect(() => {
    // 1. If an anchor hash exists (e.g. #faq, #pricing), attempt to scroll to that element
    if (hash) {
      const targetId = hash.replace(/^#/, '')
      const targetElement = document.getElementById(targetId)
      if (targetElement) {
        if (typeof targetElement.scrollIntoView === 'function') {
          targetElement.scrollIntoView({ behavior: 'smooth' })
        }
        return
      }
    }

    // 2. Reset window scroll position
    if (typeof window !== 'undefined') {
      try {
        if (typeof window.scrollTo === 'function') {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior,
          })
        }
      } catch {
        // Fallback for jsdom or older browsers
        window.scrollTo(0, 0)
      }
    }

    // 3. Reset document root and body scroll
    if (typeof document !== 'undefined') {
      if (document.documentElement) {
        document.documentElement.scrollTop = 0
        document.documentElement.scrollLeft = 0
      }
      if (document.body) {
        document.body.scrollTop = 0
        document.body.scrollLeft = 0
      }

      // 4. Reset layout main container if present
      const container = containerSelector
        ? document.querySelector<HTMLElement>(containerSelector)
        : document.getElementById('main-content') || document.querySelector<HTMLElement>('main')

      if (container) {
        if (typeof container.scrollTo === 'function') {
          try {
            container.scrollTo({ top: 0, left: 0, behavior })
          } catch {
            container.scrollTop = 0
            container.scrollLeft = 0
          }
        } else {
          container.scrollTop = 0
          container.scrollLeft = 0
        }
      }
    }
  }, [pathname, scrollOnSearchChange ? search : null, hash, containerSelector, behavior])
}

export interface ScrollToTopProps extends ScrollToTopOptions {
  children?: React.ReactNode
}

/**
 * ScrollToTop component: mount this inside any router context or layout
 * to ensure users are automatically scrolled to the top on every page navigation.
 */
export function ScrollToTop({
  containerSelector,
  behavior = 'instant',
  scrollOnSearchChange = false,
  children = null,
}: ScrollToTopProps = {}) {
  useScrollToTop({ containerSelector, behavior, scrollOnSearchChange })
  return children ? <>{children}</> : null
}

export default ScrollToTop
