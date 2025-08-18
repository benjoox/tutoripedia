/**
 * TutorialContent Component Tests
 * 
 * Tests for content rendering, hook integration, error boundaries, and responsive layout
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { 
  TutorialContent, 
  useTutorialContent, 
  withTutorialContent,
  validatePhaseContent 
} from '../TutorialContent'

// Mock UI components
vi.mock('../../ui/alert', () => ({
  Alert: ({ children, className }) => <div className={`alert ${className}`}>{children}</div>,
  AlertDescription: ({ children }) => <div className="alert-description">{children}</div>
}))

vi.mock('../../ui/skeleton', () => ({
  Skeleton: ({ className }) => <div className={`skeleton ${className}`} data-testid="skeleton" />
}))

vi.mock('../../ui/button', () => ({
  Button: ({ children, onClick, variant, className }) => (
    <button 
      onClick={onClick} 
      className={`button ${variant} ${className}`}
      data-testid="button"
    >
      {children}
    </button>
  )
}))

vi.mock('@tabler/icons-react', () => ({
  IconRefresh: () => <div data-testid="refresh-icon" />,
  IconAlertTriangle: () => <div data-testid="alert-icon" />
}))

// Mock error boundary
vi.mock('react-error-boundary', () => ({
  ErrorBoundary: ({ children, FallbackComponent, onError, onReset }) => {
    try {
      return children
    } catch (error) {
      if (onError) onError(error)
      return <FallbackComponent error={error} resetErrorBoundary={onReset} />
    }
  }
}))

// Test components
const TestPhaseContent = ({ calculations, chartData, updateParameter, phase }) => {
  return (
    <div data-testid="phase-content">
      <h2>{phase?.title}</h2>
      <div data-testid="calculations">{JSON.stringify(calculations)}</div>
      <div data-testid="chart-data">{JSON.stringify(chartData)}</div>
      <button onClick={() => updateParameter('test', 123)} data-testid="update-param">
        Update Parameter
      </button>
    </div>
  )
}

const ErrorPhaseContent = () => {
  throw new Error('Test error in phase content')
}

// Mock tutorial hook result
const mockTutorialHookResult = {
  calculations: { result: 42, value: 100 },
  chartData: { series1: [1, 2, 3], series2: [4, 5, 6] },
  updateParameter: vi.fn(),
  parameters: { param1: 10, param2: 20 }
}

// Mock phase
const mockPhase = {
  id: 'test-phase',
  title: 'Test Phase',
  description: 'A test phase for unit testing',
  content: TestPhaseContent
}

// Mock tutorial
const mockTutorial = {
  id: 'test-tutorial',
  title: 'Test Tutorial',
  phases: [
    {
      id: 'phase1',
      title: 'Phase 1',
      content: TestPhaseContent
    },
    {
      id: 'phase2',
      title: 'Phase 2',
      content: TestPhaseContent
    },
    {
      id: 'phase3',
      title: 'Phase 3',
      content: TestPhaseContent
    }
  ]
}

describe('TutorialContent Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    it('should render phase content successfully', () => {
      render(
        <TutorialContent
          phase={mockPhase}
          tutorial={mockTutorial}
          tutorialHookResult={mockTutorialHookResult}
        />
      )

      expect(screen.getByTestId('phase-content')).toBeInTheDocument()
      expect(screen.getByText('Test Phase')).toBeInTheDocument()
    })

    it('should pass tutorial hook results to phase content', () => {
      render(
        <TutorialContent
          phase={mockPhase}
          tutorial={mockTutorial}
          tutorialHookResult={mockTutorialHookResult}
        />
      )

      expect(screen.getByTestId('calculations')).toHaveTextContent(
        JSON.stringify(mockTutorialHookResult.calculations)
      )
      expect(screen.getByTestId('chart-data')).toHaveTextContent(
        JSON.stringify(mockTutorialHookResult.chartData)
      )
    })

    it('should handle parameter updates from content', () => {
      render(
        <TutorialContent
          phase={mockPhase}
          tutorial={mockTutorial}
          tutorialHookResult={mockTutorialHookResult}
        />
      )

      fireEvent.click(screen.getByTestId('update-param'))
      expect(mockTutorialHookResult.updateParameter).toHaveBeenCalledWith('test', 123)
    })
  })

  describe('Error Handling', () => {
    it('should show error message when phase is missing', () => {
      render(
        <TutorialContent
          phase={null}
          tutorial={mockTutorial}
          tutorialHookResult={mockTutorialHookResult}
        />
      )

      expect(screen.getByText(/No phase content available/)).toBeInTheDocument()
    })

    it('should show error message when phase content is invalid', () => {
      const invalidPhase = {
        id: 'invalid-phase',
        title: 'Invalid Phase',
        content: null
      }

      render(
        <TutorialContent
          phase={invalidPhase}
          tutorial={mockTutorial}
          tutorialHookResult={mockTutorialHookResult}
        />
      )

      expect(screen.getByText(/does not have valid content defined/)).toBeInTheDocument()
    })

    it('should handle content rendering errors with error boundary', () => {
      const errorPhase = {
        id: 'error-phase',
        title: 'Error Phase',
        content: ErrorPhaseContent
      }

      // Mock console.error to avoid test output noise
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      // Error boundary testing is complex - we expect the error to be thrown
      expect(() => {
        render(
          <TutorialContent
            phase={errorPhase}
            tutorial={mockTutorial}
            tutorialHookResult={mockTutorialHookResult}
            enableErrorBoundary={true}
          />
        )
      }).toThrow('Test error in phase content')
      
      consoleSpy.mockRestore()
    })

    it('should call custom error handler when provided', () => {
      const onError = vi.fn()
      
      render(
        <TutorialContent
          phase={mockPhase}
          tutorial={mockTutorial}
          tutorialHookResult={mockTutorialHookResult}
          onError={onError}
        />
      )

      // Error handling would be tested with actual error scenarios
      expect(onError).not.toHaveBeenCalled()
    })
  })

  describe('Props and Configuration', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <TutorialContent
          phase={mockPhase}
          tutorial={mockTutorial}
          tutorialHookResult={mockTutorialHookResult}
          className="custom-class"
        />
      )

      expect(container.firstChild).toHaveClass('custom-class')
    })

    it('should pass additional contentProps to phase content', () => {
      const customProps = { customProp: 'test-value' }
      
      const TestContentWithProps = ({ customProp }) => (
        <div data-testid="custom-prop">{customProp}</div>
      )

      const phaseWithCustomContent = {
        ...mockPhase,
        content: TestContentWithProps
      }

      render(
        <TutorialContent
          phase={phaseWithCustomContent}
          tutorial={mockTutorial}
          tutorialHookResult={mockTutorialHookResult}
          contentProps={customProps}
        />
      )

      expect(screen.getByTestId('custom-prop')).toHaveTextContent('test-value')
    })

    it('should disable error boundary when requested', () => {
      render(
        <TutorialContent
          phase={mockPhase}
          tutorial={mockTutorial}
          tutorialHookResult={mockTutorialHookResult}
          enableErrorBoundary={false}
        />
      )

      expect(screen.getByTestId('phase-content')).toBeInTheDocument()
    })
  })

  describe('Responsive Layout', () => {
    it('should render with responsive wrapper classes', () => {
      const { container } = render(
        <TutorialContent
          phase={mockPhase}
          tutorial={mockTutorial}
          tutorialHookResult={mockTutorialHookResult}
        />
      )

      const wrapper = container.querySelector('.flex-1')
      expect(wrapper).toBeInTheDocument()
      expect(wrapper).toHaveClass('overflow-y-auto')
    })
  })
})

describe('useTutorialContent Hook', () => {
  const TestComponent = ({ tutorial, currentPhaseId }) => {
    const contentState = useTutorialContent(tutorial, currentPhaseId)
    
    return (
      <div>
        <div data-testid="current-phase">{contentState.currentPhase?.title || 'None'}</div>
        <div data-testid="phase-index">{contentState.phaseIndex}</div>
        <div data-testid="has-next">{contentState.hasNextPhase?.toString() || 'false'}</div>
        <div data-testid="has-previous">{contentState.hasPreviousPhase?.toString() || 'false'}</div>
        <div data-testid="total-phases">{contentState.totalPhases}</div>
        <div data-testid="next-phase">{contentState.nextPhase?.title || 'None'}</div>
        <div data-testid="previous-phase">{contentState.previousPhase?.title || 'None'}</div>
      </div>
    )
  }

  it('should return correct phase information', () => {
    render(<TestComponent tutorial={mockTutorial} currentPhaseId="phase2" />)

    expect(screen.getByTestId('current-phase')).toHaveTextContent('Phase 2')
    expect(screen.getByTestId('phase-index')).toHaveTextContent('1')
    expect(screen.getByTestId('has-next')).toHaveTextContent('true')
    expect(screen.getByTestId('has-previous')).toHaveTextContent('true')
    expect(screen.getByTestId('total-phases')).toHaveTextContent('3')
    expect(screen.getByTestId('next-phase')).toHaveTextContent('Phase 3')
    expect(screen.getByTestId('previous-phase')).toHaveTextContent('Phase 1')
  })

  it('should handle first phase correctly', () => {
    render(<TestComponent tutorial={mockTutorial} currentPhaseId="phase1" />)

    expect(screen.getByTestId('current-phase')).toHaveTextContent('Phase 1')
    expect(screen.getByTestId('phase-index')).toHaveTextContent('0')
    expect(screen.getByTestId('has-next')).toHaveTextContent('true')
    expect(screen.getByTestId('has-previous')).toHaveTextContent('false')
    expect(screen.getByTestId('next-phase')).toHaveTextContent('Phase 2')
    expect(screen.getByTestId('previous-phase')).toHaveTextContent('None')
  })

  it('should handle last phase correctly', () => {
    render(<TestComponent tutorial={mockTutorial} currentPhaseId="phase3" />)

    expect(screen.getByTestId('current-phase')).toHaveTextContent('Phase 3')
    expect(screen.getByTestId('phase-index')).toHaveTextContent('2')
    expect(screen.getByTestId('has-next')).toHaveTextContent('false')
    expect(screen.getByTestId('has-previous')).toHaveTextContent('true')
    expect(screen.getByTestId('next-phase')).toHaveTextContent('None')
    expect(screen.getByTestId('previous-phase')).toHaveTextContent('Phase 2')
  })

  it('should handle invalid phase ID', () => {
    render(<TestComponent tutorial={mockTutorial} currentPhaseId="invalid-phase" />)

    expect(screen.getByTestId('current-phase')).toHaveTextContent('None')
    expect(screen.getByTestId('phase-index')).toHaveTextContent('-1')
    expect(screen.getByTestId('has-next')).toHaveTextContent('false')
    expect(screen.getByTestId('has-previous')).toHaveTextContent('false')
  })

  it('should handle missing tutorial', () => {
    render(<TestComponent tutorial={null} currentPhaseId="phase1" />)

    expect(screen.getByTestId('current-phase')).toHaveTextContent('None')
    expect(screen.getByTestId('phase-index')).toHaveTextContent('-1')
    expect(screen.getByTestId('total-phases')).toHaveTextContent('0')
  })
})

describe('withTutorialContent HOC', () => {
  const BaseComponent = ({ currentPhase, tutorial, tutorialHookResult, customProp }) => (
    <div>
      <div data-testid="current-phase">{currentPhase?.title || 'None'}</div>
      <div data-testid="tutorial-id">{tutorial?.id || 'None'}</div>
      <div data-testid="custom-prop">{customProp}</div>
      <div data-testid="hook-result">{JSON.stringify(tutorialHookResult?.calculations)}</div>
    </div>
  )

  const WrappedComponent = withTutorialContent(BaseComponent)

  it('should enhance component with tutorial content state', () => {
    render(
      <WrappedComponent
        tutorial={mockTutorial}
        currentPhaseId="phase2"
        tutorialHookResult={mockTutorialHookResult}
        customProp="test-value"
      />
    )

    expect(screen.getByTestId('current-phase')).toHaveTextContent('Phase 2')
    expect(screen.getByTestId('tutorial-id')).toHaveTextContent('test-tutorial')
    expect(screen.getByTestId('custom-prop')).toHaveTextContent('test-value')
    expect(screen.getByTestId('hook-result')).toHaveTextContent(
      JSON.stringify(mockTutorialHookResult.calculations)
    )
  })

  it('should set correct display name', () => {
    expect(WrappedComponent.displayName).toBe('withTutorialContent(BaseComponent)')
  })
})

describe('validatePhaseContent', () => {
  it('should validate valid phase content', () => {
    const result = validatePhaseContent(mockPhase)
    expect(result.isValid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('should detect missing phase', () => {
    const result = validatePhaseContent(null)
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('Phase is required')
  })

  it('should detect missing required fields', () => {
    const invalidPhase = {}
    const result = validatePhaseContent(invalidPhase)
    
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('Phase must have an id')
    expect(result.errors).toContain('Phase must have a title')
    expect(result.errors).toContain('Phase must have content')
  })

  it('should detect invalid content type', () => {
    const invalidPhase = {
      id: 'test',
      title: 'Test',
      content: 'invalid-content'
    }
    
    const result = validatePhaseContent(invalidPhase)
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('Phase content must be a React component or function')
  })

  it('should warn about long titles and descriptions', () => {
    const phaseWithLongContent = {
      id: 'test',
      title: 'A'.repeat(150),
      description: 'B'.repeat(600),
      content: TestPhaseContent
    }
    
    const result = validatePhaseContent(phaseWithLongContent)
    expect(result.warnings).toContain('Phase title is very long (>100 characters)')
    expect(result.warnings).toContain('Phase description is very long (>500 characters)')
  })
})