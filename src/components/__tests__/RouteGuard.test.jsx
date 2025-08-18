/**
 * RouteGuard Component Tests
 * 
 * Tests for route validation and navigation guards.
 */

import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import RouteGuard from '../RouteGuard'
import * as tutorialRegistry from '@/tutorials'

// Mock the tutorial registry
vi.mock('@/tutorials', () => ({
  getTutorial: vi.fn(),
  hasTutorial: vi.fn()
}))

// Mock react-router-dom navigation
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

// Test tutorial data
const mockTutorial = {
  id: 'test-tutorial',
  title: 'Test Tutorial',
  phases: [
    { id: 'intro', title: 'Introduction' },
    { id: 'theory', title: 'Theory' },
    { id: 'practice', title: 'Practice' }
  ]
}

// Test component to wrap RouteGuard
const TestComponent = () => <div data-testid="protected-content">Protected Content</div>

// Wrapper for testing with router
const TestWrapper = ({ children, initialEntries = ['/'] }) => (
  <MemoryRouter initialEntries={initialEntries}>
    {children}
  </MemoryRouter>
)

describe('RouteGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Default successful mocks
    tutorialRegistry.hasTutorial.mockReturnValue(true)
    tutorialRegistry.getTutorial.mockReturnValue(mockTutorial)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Valid Routes', () => {
    it('allows access to valid tutorial route', async () => {
      render(
        <TestWrapper initialEntries={['/tutorial/test-tutorial']}>
          <RouteGuard>
            <TestComponent />
          </RouteGuard>
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('protected-content')).toBeInTheDocument()
      })

      expect(tutorialRegistry.hasTutorial).toHaveBeenCalledWith('test-tutorial')
      expect(tutorialRegistry.getTutorial).toHaveBeenCalledWith('test-tutorial')
    })

    it('allows access to valid tutorial phase route', async () => {
      render(
        <TestWrapper initialEntries={['/tutorial/test-tutorial/intro']}>
          <RouteGuard>
            <TestComponent />
          </RouteGuard>
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('protected-content')).toBeInTheDocument()
      })

      expect(tutorialRegistry.hasTutorial).toHaveBeenCalledWith('test-tutorial')
      expect(tutorialRegistry.getTutorial).toHaveBeenCalledWith('test-tutorial')
    })
  })

  describe('Invalid Routes', () => {
    it('blocks access when tutorial does not exist', async () => {
      tutorialRegistry.hasTutorial.mockReturnValue(false)

      render(
        <TestWrapper initialEntries={['/tutorial/nonexistent']}>
          <RouteGuard>
            <TestComponent />
          </RouteGuard>
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Tutorial Not Found')).toBeInTheDocument()
        expect(screen.getByText(/The tutorial "nonexistent" does not exist/)).toBeInTheDocument()
      })

      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    })

    it('blocks access when tutorial data is invalid', async () => {
      tutorialRegistry.hasTutorial.mockReturnValue(true)
      tutorialRegistry.getTutorial.mockReturnValue(null)

      render(
        <TestWrapper initialEntries={['/tutorial/invalid-tutorial']}>
          <RouteGuard>
            <TestComponent />
          </RouteGuard>
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Invalid Tutorial')).toBeInTheDocument()
        expect(screen.getByText(/The tutorial "invalid-tutorial" is not properly configured/)).toBeInTheDocument()
      })

      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    })

    it('blocks access when phase does not exist', async () => {
      render(
        <TestWrapper initialEntries={['/tutorial/test-tutorial/nonexistent-phase']}>
          <RouteGuard>
            <TestComponent />
          </RouteGuard>
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Phase Not Found')).toBeInTheDocument()
        expect(screen.getByText(/The phase "nonexistent-phase" does not exist/)).toBeInTheDocument()
      })

      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    })

    it('blocks access when tutorial has no phases but phase is requested', async () => {
      const tutorialWithoutPhases = {
        ...mockTutorial,
        phases: []
      }
      tutorialRegistry.getTutorial.mockReturnValue(tutorialWithoutPhases)

      render(
        <TestWrapper initialEntries={['/tutorial/test-tutorial/intro']}>
          <RouteGuard>
            <TestComponent />
          </RouteGuard>
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Phase Not Found')).toBeInTheDocument()
      })

      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    })
  })

  describe('Loading State', () => {
    it('shows loading state during validation', () => {
      render(
        <TestWrapper initialEntries={['/tutorial/test-tutorial']}>
          <RouteGuard>
            <TestComponent />
          </RouteGuard>
        </TestWrapper>
      )

      // Should show loading initially
      expect(screen.getByRole('generic')).toBeInTheDocument() // Skeleton elements
    })
  })

  describe('Error Handling', () => {
    it('handles validation errors gracefully', async () => {
      tutorialRegistry.getTutorial.mockImplementation(() => {
        throw new Error('Registry error')
      })

      render(
        <TestWrapper initialEntries={['/tutorial/test-tutorial']}>
          <RouteGuard>
            <TestComponent />
          </RouteGuard>
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Invalid Tutorial')).toBeInTheDocument()
      })

      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    })
  })

  describe('Navigation Actions', () => {
    it('provides home navigation button', async () => {
      tutorialRegistry.hasTutorial.mockReturnValue(false)

      render(
        <TestWrapper initialEntries={['/tutorial/nonexistent']}>
          <RouteGuard>
            <TestComponent />
          </RouteGuard>
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Home')).toBeInTheDocument()
      })

      const homeButton = screen.getByText('Home')
      expect(homeButton).toBeInTheDocument()
    })

    it('provides go back navigation for phase routes', async () => {
      render(
        <TestWrapper initialEntries={['/tutorial/test-tutorial/nonexistent-phase']}>
          <RouteGuard>
            <TestComponent />
          </RouteGuard>
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Go Back')).toBeInTheDocument()
      })

      const backButton = screen.getByText('Go Back')
      expect(backButton).toBeInTheDocument()
    })
  })

  describe('Route Validation Logic', () => {
    it('validates tutorial ID parameter', async () => {
      render(
        <TestWrapper initialEntries={['/tutorial/']}>
          <RouteGuard>
            <TestComponent />
          </RouteGuard>
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Tutorial Not Found')).toBeInTheDocument()
      })
    })

    it('validates phase ID against tutorial phases', async () => {
      const tutorialWithPhases = {
        ...mockTutorial,
        phases: [
          { id: 'phase1', title: 'Phase 1' },
          { id: 'phase2', title: 'Phase 2' }
        ]
      }
      tutorialRegistry.getTutorial.mockReturnValue(tutorialWithPhases)

      render(
        <TestWrapper initialEntries={['/tutorial/test-tutorial/phase1']}>
          <RouteGuard>
            <TestComponent />
          </RouteGuard>
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('protected-content')).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    it('has proper heading structure in error states', async () => {
      tutorialRegistry.hasTutorial.mockReturnValue(false)

      render(
        <TestWrapper initialEntries={['/tutorial/nonexistent']}>
          <RouteGuard>
            <TestComponent />
          </RouteGuard>
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
      })
    })

    it('has proper button labels', async () => {
      tutorialRegistry.hasTutorial.mockReturnValue(false)

      render(
        <TestWrapper initialEntries={['/tutorial/nonexistent']}>
          <RouteGuard>
            <TestComponent />
          </RouteGuard>
        </TestWrapper>
      )

      await waitFor(() => {
        const homeButton = screen.getByRole('button', { name: /home/i })
        expect(homeButton).toBeInTheDocument()
      })
    })
  })
})