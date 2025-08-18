import '@testing-library/jest-dom'

// Mock window.scrollY and window.addEventListener for tests
Object.defineProperty(window, 'scrollY', {
  writable: true,
  value: 0,
})

// Mock requestAnimationFrame
global.requestAnimationFrame = (cb) => setTimeout(cb, 0)
global.cancelAnimationFrame = (id) => clearTimeout(id)