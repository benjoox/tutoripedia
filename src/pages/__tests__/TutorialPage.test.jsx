/**
 * TutorialPage Component Tests
 * 
 * Tests for the main tutorial page with layout components integration,
 * tutorial loading, state management, and error handling.
 */

import React from 'react'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import TutorialPage from '../TutorialPage'
import * as tutorialRegistry from '@/tutorials'

// Mock the tutorial registry
vi.mock('@/tutorials', () => ({
  getTutorial: vi.fn()
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

// Mock layout components to avoid complex rendering
vi.mock('@/components/layout/Header', () => ({
  default: ({ title, subtitle, onBackClick }) => (
    <div data-testid="header">
      <button onClick={onBackClick} data-testid="back-button">Back</button>
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </div>
  )
}))

vi.mock('@/components/layout/Sidebar', () => ({
  default: ({ parameters, values, onChange, calculations, isOpen, onClose }) => (
    <div data-testid="sidebar" data-open={isOpen}>
      <button onClick={onClose} data-testid="sidebar-close">Close</button>
      {parameters.map(param => (
        <div key={param.key} data-testid={`parameter-${param.key}`}>
          <label>{param.label}</label>
          <input
            type="number"
            value={values[param.key] || 0}
            onChange={(e) => onChange(param.key, parseFloat(e.target.value))}
            data-testid={`parameter-input-${param.key}`}
          />
        </div>
      ))}
      <div data-testid="calculations">
        {Object.entries(calculations).map(([key, value]) => (
          <div key={key}>{key}: {value}</div>
        ))}
      </div>
    </div>
  )
}))

vi.mock('@/components/layout/PhaseNavigation', () => ({
  default: ({ phases, currentPhase, onPhaseChange }) => (
    <div data-testid="phase-navigation">
      {phases.map((phase, index) => (
        <button
          key={phase.id}
          onClick={() => onPhaseChange(index)}
          data-testid={`phase-button-${phase.id}`}
          data-active={index === currentPhase}
        >
          {phase.title}
        </button>
      ))}
    </div>
  )
}))

vi.mock('@/components/layout/Footer', () => ({
  default: ({ phases, currentPhase, onPhaseChange }) => (
    <div data-testid="footer">
      <button
        onClick={() => onPhaseChange(currentPhase - 1)}
        disabled={currentPhase === 0}
        data-testid="previous-button"
      >
        Previous
      </button>
      <span data-testid="progress">
        {currentPhase + 1} of {phases.length}
      </span>
      <button
        onClick={() => onPhaseChange(currentPhase + 1)}
        disabled={currentPhase === phases.length - 1}
        data-testid="next-button"
      >
        Next
      </button>
    </div>
  )
}))

// Test data
const mockTutorial = {
  id: 'test-tutorial',
  title: 'Test Tutorial',
  shortTitle: 'Test',
  description: 'A test tutorial for unit testing',
  phases: [
    {
      id: 'intro',
      title: 'Introduction',
      description: 'Introduction phase',
      component: ({ parameters, calculations }) => (
        <div data-testid="phase-content">
          <h2>Introduction Phase</h2>
          <div data-testid="phase-parameters">
            {JSON.stringify(parameters)}
          </div>
          <div data-testid="phase-calculations">
            {JSON.stringify(calculations)}
          </div>
        </div>
      )
    },
    {
      id: 'theory',
      title: 'Theory',
      description: 'Theory phase',
      component: ({ parameters }) => (
        <div data-testid="phase-content">
          <h2>Theory Phase</h2>
          <div data-testid="phase-parameters">
            {JSON.stringify(parameters)}
          </div>
        </div>
      )
    },
    {
      id: 'practice',
      title: 'Practice',
      description: 'Practice phase'
      // No component - should show development message
    }
  ],
  parameters: [
    {
      key: 'stockPrice',
      label: 'Stock Price',
      type: 'slider',
      min: 50,
      max: 150,
      step: 1,
      defaultValue: 100,
      unit: '$'
    },
    {
      key: 'timeToMaturity',
      label: 'Time to Maturity',
      type: 'slider',
      min: 0.1,
      max: 2,
      step: 0.1,
      defaultValue: 1,
      unit: 'years'
    }
  ],
  calculations: (params) => ({
    optionValue: params.stockPrice * params.timeToMaturity,
    delta: params.stockPrice * 0.5,
    gamma: params.timeToMaturity * 0.1
  })
}

// Wrapper component for testing with router
const TestWrapper = ({ children, initialEntries = ['/tutorial/test-tutorial'] }) => (
  <MemoryRouter initialEntries={initialEntries}>
    {children}
  </MemoryRouter>
)

describe('TutorialPage', () => {
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()
    
    // Setup default mock implementation
    tutorialRegistry.getTutorial.mockReturnValue(mockTutorial)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Loading State', () => {
    it('shows loading skeleton initially', () => {
      // Make getTutorial async to test loading state
      tutorialRegistry.getTutorial.mockImplementation(() => {
        return new Promise(resolve => setTimeout(() => resolve(mockTutorial), 100))
      })

      render(
        <TestWrapper>
          <TutorialPage />
        </TestWrapper>
      )

      // Should show loading skeletons
      expect(screen.getByTestId('header')).toBeInTheDocument()
    })
  })

  describe('Tutorial Loading', () => {
    it('loads tutorial data on mount', async () => {
      render(
        <TestWrapper>
          <TutorialPage />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(tutorialRegistry.getTutorial).toHaveBeenCalledWith('test-tutorial', { throwOnNotFound: true })
      })

      expect(screen.getByText('Test')).toBeInTheDocument()
      expect(screen.getByText('Phase 1: Introduction')).toBeInTheDocument()
    })

    it('handles tutorial not found error', async () => {
      tutorialRegistry.getTutorial.mockImplementation(() => {
        throw new Error('Tutorial not found')
      })

      render(
        <TestWrapper>
          <TutorialPage />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Tutorial Not Found')).toBeInTheDocument()
        expect(screen.getByText('Tutorial not found')).toBeInTheDocument()
      })

      expect(screen.getByText('Back to Home')).toBeInTheDocument()
    })

    it('handles null tutorial response', async () => {
      tutorialRegistry.getTutorial.mockReturnValue(null)

      render(
        <TestWrapper>
          <TutorialPage />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Tutorial Not Found')).toBeInTheDocument()
      })
    })
  })

  describe('Phase Management', () => {
    it('displays current phase content', async () => {
      render(
        <TestWrapper>
          <TutorialPage />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Introduction')).toBeInTheDocument()
        expect(screen.getByText('Introduction phase')).toBeInTheDocument()
        expect(screen.getByTestId('phase-content')).toBeInTheDocument()
      })
    })

    it('changes phase when navigation is used', async () => {
      render(
        <TestWrapper>
          <TutorialPage />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('phase-navigation')).toBeInTheDocument()
      })

      // Click on theory phase
      const theoryButton = screen.getByTestId('phase-button-theory')
      fireEvent.click(theoryButton)

      await waitFor(() => {
        expect(screen.getByText('Theory')).toBeInTheDocument()
        expect(screen.getByText('Theory phase')).toBeInTheDocument()
      })

      // Check that URL is updated
      expect(mockNavigate).toHaveBeenCalledWith('/tutorial/test-tutorial/theory', { replace: true })
    })

    it('handles phase without component', async () => {
      render(
        <TestWrapper>
          <TutorialPage />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('phase-navigation')).toBeInTheDocument()
      })

      // Click on practice phase (no component)
      const practiceButton = screen.getByTestId('phase-button-practice')
      fireEvent.click(practiceButton)

      await waitFor(() => {
        expect(screen.getByText('Practice')).toBeInTheDocument()
        expect(screen.getByText('This phase is under development')).toBeInTheDocument()
      })
    })

    it('initializes with correct phase from URL', async () => {
      render(
        <TestWrapper initialEntries={['/tutorial/test-tutorial/theory']}>
          <TutorialPage />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Theory')).toBeInTheDocument()
        expect(screen.getByText('Phase 2: Theory')).toBeInTheDocument()
      })
    })
  })

  describe('Parameter Management', () => {
    it('initializes parameters with default values', async () => {
      render(
        <TestWrapper>
          <TutorialPage />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('sidebar')).toBeInTheDocument()
      })

      const stockPriceInput = screen.getByTestId('parameter-input-stockPrice')
      const timeInput = screen.getByTestId('parameter-input-timeToMaturity')

      expect(stockPriceInput.value).toBe('100')
      expect(timeInput.value).toBe('1')
    })

    it('updates parameter values and recalculates', async () => {
      render(
        <TestWrapper>
          <TutorialPage />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('sidebar')).toBeInTheDocument()
      })

      const stockPriceInput = screen.getByTestId('parameter-input-stockPrice')
      fireEvent.change(stockPriceInput, { target: { value: '120' } })

      await waitFor(() => {
        expect(stockPriceInput.value).toBe('120')
        
        // Check that calculations are updated
        const calculations = screen.getByTestId('calculations')
        expect(calculations).toHaveTextContent('optionValue: 120')
        expect(calculations).toHaveTextContent('delta: 60')
      })
    })

    it('passes parameters to phase components', async () => {
      render(
        <TestWrapper>
          <TutorialPage />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('phase-content')).toBeInTheDocument()
      })

      const phaseParameters = screen.getByTestId('phase-parameters')
      expect(phaseParameters).toHaveTextContent('stockPrice')
      expect(phaseParameters).toHaveTextContent('timeToMaturity')

      const phaseCalculations = screen.getByTestId('phase-calculations')
      expect(phaseCalculations).toHaveTextContent('optionValue')
      expect(phaseCalculations).toHaveTextContent('delta')
    })
  })

  describe('Sidebar Management', () => {
    it('shows sidebar toggle on mobile', async () => {
      render(
        <TestWrapper>
          <TutorialPage />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Parameters')).toBeInTheDocument()
      })
    })

    it('toggles sidebar visibility', async () => {
      render(
        <TestWrapper>
          <TutorialPage />
        </TestWrapper>
      )

      await waitFor(() => {
        const sidebar = screen.getByTestId('sidebar')
        expect(sidebar).toHaveAttribute('data-open', 'false')
      })

      // Open sidebar
      const toggleButton = screen.getByText('Parameters')
      fireEvent.click(toggleButton)

      await waitFor(() => {
        const sidebar = screen.getByTestId('sidebar')
        expect(sidebar).toHaveAttribute('data-open', 'true')
      })

      // Close sidebar
      const closeButton = screen.getByTestId('sidebar-close')
      fireEvent.click(closeButton)

      await waitFor(() => {
        const sidebar = screen.getByTestId('sidebar')
        expect(sidebar).toHaveAttribute('data-open', 'false')
      })
    })
  })

  describe('Navigation', () => {
    it('navigates back to home', async () => {
      render(
        <TestWrapper>
          <TutorialPage />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('back-button')).toBeInTheDocument()
      })

      const backButton = screen.getByTestId('back-button')
      fireEvent.click(backButton)

      expect(mockNavigate).toHaveBeenCalledWith('/')
    })

    it('uses footer navigation', async () => {
      render(
        <TestWrapper>
          <TutorialPage />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('footer')).toBeInTheDocument()
      })

      // Should be on first phase, previous disabled
      const previousButton = screen.getByTestId('previous-button')
      const nextButton = screen.getByTestId('next-button')

      expect(previousButton).toBeDisabled()
      expect(nextButton).not.toBeDisabled()

      // Go to next phase
      fireEvent.click(nextButton)

      await waitFor(() => {
        expect(screen.getByText('Theory')).toBeInTheDocument()
      })
    })
  })

  describe('Error Handling', () => {
    it('shows retry button on error', async () => {
      tutorialRegistry.getTutorial.mockImplementation(() => {
        throw new Error('Network error')
      })

      render(
        <TestWrapper>
          <TutorialPage />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Tutorial Not Found')).toBeInTheDocument()
        expect(screen.getByText('Try Again')).toBeInTheDocument()
      })
    })

    it('handles calculation errors gracefully', async () => {
      const tutorialWithBadCalculations = {
        ...mockTutorial,
        calculations: () => {
          throw new Error('Calculation error')
        }
      }

      tutorialRegistry.getTutorial.mockReturnValue(tutorialWithBadCalculations)

      render(
        <TestWrapper>
          <TutorialPage />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('sidebar')).toBeInTheDocument()
      })

      // Should not crash, calculations should be empty
      const calculations = screen.getByTestId('calculations')
      expect(calculations).toBeEmptyDOMElement()
    })
  })

  describe('Tutorial without phases', () => {
    it('shows tutorial info when no phases available', async () => {
      const tutorialWithoutPhases = {
        ...mockTutorial,
        phases: []
      }

      tutorialRegistry.getTutorial.mockReturnValue(tutorialWithoutPhases)

      render(
        <TestWrapper>
          <TutorialPage />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Test Tutorial')).toBeInTheDocument()
        expect(screen.getByText('No phases are available for this tutorial yet.')).toBeInTheDocument()
      })

      // Should not show phase navigation or footer
      expect(screen.queryByTestId('phase-navigation')).not.toBeInTheDocument()
      expect(screen.queryByTestId('footer')).not.toBeInTheDocument()
    })
  })

  describe('Tutorial without parameters', () => {
    it('does not show sidebar when no parameters', async () => {
      const tutorialWithoutParameters = {
        ...mockTutorial,
        parameters: []
      }

      tutorialRegistry.getTutorial.mockReturnValue(tutorialWithoutParameters)

      render(
        <TestWrapper>
          <TutorialPage />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Test')).toBeInTheDocument()
      })

      // Should not show sidebar or parameters toggle
      expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument()
      expect(screen.queryByText('Parameters')).not.toBeInTheDocument()
    })
  })

  describe('URL Synchronization', () => {
    it('updates URL when phase changes', async () => {
      render(
        <TestWrapper>
          <TutorialPage />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('phase-navigation')).toBeInTheDocument()
      })

      // Change to theory phase
      const theoryButton = screen.getByTestId('phase-button-theory')
      fireEvent.click(theoryButton)

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/tutorial/test-tutorial/theory', { replace: true })
      })
    })

    it('handles invalid phase ID in URL', async () => {
      render(
        <TestWrapper initialEntries={['/tutorial/test-tutorial/invalid-phase']}>
          <TutorialPage />
        </TestWrapper>
      )

      await waitFor(() => {
        // Should default to first phase
        expect(screen.getByText('Introduction')).toBeInTheDocument()
        expect(screen.getByText('Phase 1: Introduction')).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    it('has proper heading structure', async () => {
      render(
        <TestWrapper>
          <TutorialPage />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
      })
    })

    it('has proper button labels', async () => {
      render(
        <TestWrapper>
          <TutorialPage />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('back-button')).toBeInTheDocument()
      })
    })
  })
})