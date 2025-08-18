import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import useScrollHeader from '../useScrollHeader'

describe('useScrollHeader', () => {
  let scrollEventListeners = []
  
  beforeEach(() => {
    // Reset window.scrollY
    window.scrollY = 0
    
    // Mock addEventListener and removeEventListener
    scrollEventListeners = []
    vi.spyOn(window, 'addEventListener').mockImplementation((event, handler, options) => {
      if (event === 'scroll') {
        scrollEventListeners.push({ handler, options })
      }
    })
    
    vi.spyOn(window, 'removeEventListener').mockImplementation((event, handler) => {
      if (event === 'scroll') {
        scrollEventListeners = scrollEventListeners.filter(listener => listener.handler !== handler)
      }
    })
    
    // Mock requestAnimationFrame
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      setTimeout(cb, 0)
      return 1
    })
  })
  
  afterEach(() => {
    vi.restoreAllMocks()
    scrollEventListeners = []
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useScrollHeader())
    
    expect(result.current.isCollapsed).toBe(false)
    expect(result.current.isSticky).toBe(false)
    expect(result.current.scrollDirection).toBe('up')
    expect(result.current.scrollY).toBe(0)
  })

  it('should add scroll event listener on mount', () => {
    renderHook(() => useScrollHeader())
    
    expect(window.addEventListener).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function),
      { passive: true }
    )
    expect(scrollEventListeners).toHaveLength(1)
  })

  it('should remove scroll event listener on unmount', () => {
    const { unmount } = renderHook(() => useScrollHeader())
    
    unmount()
    
    expect(window.removeEventListener).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function)
    )
  })

  it('should become sticky when scrolled past threshold', async () => {
    const { result } = renderHook(() => useScrollHeader({ threshold: 100 }))
    
    // Simulate scroll past threshold
    act(() => {
      window.scrollY = 150
      scrollEventListeners[0].handler()
    })
    
    // Wait for debounced update
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 20))
    })
    
    expect(result.current.isSticky).toBe(true)
  })

  it('should collapse header when scrolling down past collapse distance', async () => {
    const { result } = renderHook(() => useScrollHeader({ collapseDistance: 50 }))
    
    // Simulate scrolling down past collapse distance
    act(() => {
      window.scrollY = 100
      scrollEventListeners[0].handler()
    })
    
    // Wait for debounced update
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 20))
    })
    
    expect(result.current.isCollapsed).toBe(true)
    expect(result.current.scrollDirection).toBe('down')
  })

  it('should expand header when scrolling up', async () => {
    const { result } = renderHook(() => useScrollHeader({ collapseDistance: 50 }))
    
    // First scroll down to collapse
    act(() => {
      window.scrollY = 100
      scrollEventListeners[0].handler()
    })
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 20))
    })
    
    expect(result.current.isCollapsed).toBe(true)
    
    // Then scroll up to expand
    act(() => {
      window.scrollY = 50
      scrollEventListeners[0].handler()
    })
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 20))
    })
    
    expect(result.current.isCollapsed).toBe(false)
    expect(result.current.scrollDirection).toBe('up')
  })

  it('should handle custom options correctly', () => {
    const customOptions = {
      threshold: 200,
      debounceMs: 50,
      collapseDistance: 100
    }
    
    const { result } = renderHook(() => useScrollHeader(customOptions))
    
    expect(result.current.isCollapsed).toBe(false)
    expect(result.current.isSticky).toBe(false)
  })

  it('should reset scroll state when resetScrollState is called', async () => {
    const { result } = renderHook(() => useScrollHeader())
    
    // First set some scroll state
    act(() => {
      window.scrollY = 200
      scrollEventListeners[0].handler()
    })
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 20))
    })
    
    expect(result.current.isSticky).toBe(true)
    expect(result.current.isCollapsed).toBe(true)
    
    // Reset the state
    act(() => {
      result.current.resetScrollState()
    })
    
    expect(result.current.isCollapsed).toBe(false)
    expect(result.current.isSticky).toBe(false)
    expect(result.current.scrollDirection).toBe('up')
  })

  it('should debounce scroll events', async () => {
    const { result } = renderHook(() => useScrollHeader({ debounceMs: 50 }))
    
    // Trigger multiple scroll events quickly
    act(() => {
      window.scrollY = 50
      scrollEventListeners[0].handler()
      window.scrollY = 100
      scrollEventListeners[0].handler()
      window.scrollY = 150
      scrollEventListeners[0].handler()
    })
    
    // Should not update immediately due to debouncing
    expect(result.current.isSticky).toBe(false)
    
    // Wait for debounced update
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 60))
    })
    
    expect(result.current.isSticky).toBe(true)
  })

  it('should handle scroll direction changes correctly', async () => {
    const { result } = renderHook(() => useScrollHeader())
    
    // Scroll down
    act(() => {
      window.scrollY = 100
      scrollEventListeners[0].handler()
    })
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 20))
    })
    
    expect(result.current.scrollDirection).toBe('down')
    
    // Scroll up
    act(() => {
      window.scrollY = 50
      scrollEventListeners[0].handler()
    })
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 20))
    })
    
    expect(result.current.scrollDirection).toBe('up')
  })

  it('should clean up timeout on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')
    const { unmount } = renderHook(() => useScrollHeader())
    
    // Trigger a scroll event to create a timeout
    act(() => {
      scrollEventListeners[0].handler()
    })
    
    unmount()
    
    expect(clearTimeoutSpy).toHaveBeenCalled()
  })
})