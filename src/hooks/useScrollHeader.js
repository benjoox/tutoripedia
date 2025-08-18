import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Custom hook to track scroll position and direction for header behavior
 * Implements smooth header collapse/expand logic with debouncing
 */
export const useScrollHeader = (options = {}) => {
  const {
    threshold = 100, // Scroll threshold to trigger collapse
    debounceMs = 16, // Debounce delay (roughly 60fps)
    collapseDistance = 50 // Distance scrolled down to collapse header
  } = options

  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isSticky, setIsSticky] = useState(false)
  const [scrollDirection, setScrollDirection] = useState('up')
  
  const lastScrollY = useRef(0)
  const ticking = useRef(false)
  const timeoutRef = useRef(null)

  const updateScrollState = useCallback(() => {
    const scrollY = window.scrollY
    const direction = scrollY > lastScrollY.current ? 'down' : 'up'
    
    // Update scroll direction
    if (direction !== scrollDirection) {
      setScrollDirection(direction)
    }
    
    // Update sticky state based on threshold
    const shouldBeSticky = scrollY > threshold
    if (shouldBeSticky !== isSticky) {
      setIsSticky(shouldBeSticky)
    }
    
    // Update collapsed state based on scroll direction and distance
    const shouldBeCollapsed = direction === 'down' && scrollY > collapseDistance
    if (shouldBeCollapsed !== isCollapsed) {
      setIsCollapsed(shouldBeCollapsed)
    }
    
    lastScrollY.current = scrollY
    ticking.current = false
  }, [threshold, collapseDistance, isSticky, isCollapsed, scrollDirection])

  const debouncedScrollHandler = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    timeoutRef.current = setTimeout(() => {
      if (!ticking.current) {
        requestAnimationFrame(updateScrollState)
        ticking.current = true
      }
    }, debounceMs)
  }, [updateScrollState, debounceMs])

  const handleScroll = useCallback(() => {
    debouncedScrollHandler()
  }, [debouncedScrollHandler])

  useEffect(() => {
    // Set initial scroll position
    lastScrollY.current = window.scrollY
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // Cleanup function
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [handleScroll])

  // Reset states when component unmounts or page changes
  const resetScrollState = useCallback(() => {
    setIsCollapsed(false)
    setIsSticky(false)
    setScrollDirection('up')
    lastScrollY.current = 0
  }, [])

  return {
    isCollapsed,
    isSticky,
    scrollDirection,
    scrollY: lastScrollY.current,
    resetScrollState
  }
}

export default useScrollHeader