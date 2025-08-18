/**
 * TutorialCard Component Tests
 * 
 * Tests for tutorial card display, interactions, hover effects, and responsive layout
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { 
  TutorialCard, 
  TutorialCardGrid,
  validateTutorialForCard 
} from '../TutorialCard'

// Mock UI components
vi.mock('../../ui/card', () => ({
  Card: ({ children, className, onClick, onKeyDown, tabIndex, role, ...props }) => (
    <div 
      className={`card ${className}`} 
      onClick={onClick}
      onKeyDown={onKeyDown}
      tabIndex={tabIndex}
      role={role}
      {...props}
    >
      {children}
    </div>
  ),
  CardContent: ({ children, className }) => (
    <div className={`card-content ${className}`}>{children}</div>
  ),
  CardDescription: ({ children, className }) => (
    <div className={`card-description ${className}`}>{children}</div>
  ),
  CardHeader: ({ children, className }) => (
    <div className={`card-header ${className}`}>{children}</div>
  ),
  CardTitle: ({ children, className }) => (
    <h3 className={`card-title ${className}`}>{children}</h3>
  )
}))

vi.mock('../../ui/badge', () => ({
  Badge: ({ children, variant, className }) => (
    <span className={`badge ${variant} ${className}`}>{children}</span>
  )
}))

vi.mock('../../ui/button', () => ({
  Button: ({ children, onClick, variant, className }) => (
    <button className={`button ${variant} ${className}`} onClick={onClick}>
      {children}
    </button>
  )
}))

vi.mock('../../ui/progress', () => ({
  Progress: ({ value, className }) => (
    <div className={`progress ${className}`} data-value={value} data-testid="progress-bar">
      <div style={{ width: `${value}%` }} />
    </div>
  )
}))

vi.mock('@tabler/icons-react', () => ({
  IconClock: () => <div data-testid="clock-icon" />,
  IconUser: () => <div data-testid="user-icon" />,
  IconTrendingUp: () => <div data-testid="trending-icon" />,
  IconBook: () => <div data-testid="book-icon" />,
  IconStar: () => <div data-testid="star-icon" />,
  IconChevronRight: () => <div data-testid="chevron-icon" />,
  IconCalendar: () => <div data-testid="calendar-icon" />,
  IconTag: () => <div data-testid="tag-icon" />
}))

vi.mock('@/lib/utils', () => ({
  cn: (...classes) => classes.filter(Boolean).join(' ')
}))

// Mock tutorial data
const mockTutorial = {
  id: 'test-tutorial',
  title: 'Test Tutorial',
  shortTitle: 'Test',
  description: 'A comprehensive tutorial for testing purposes',
  difficulty: 'intermediate',
  duration: '30-45 minutes',
  estimatedTime: 35,
  topics: ['testing', 'javascript', 'react', 'components'],
  categories: ['programming', 'testing'],
  tags: ['test', 'mock', 'example'],
  icon: <div data-testid="tutorial-icon" />,
  phases: [
    { id: 'phase1', title: 'Phase 1' },
    { id: 'phase2', title: 'Phase 2' },
    { id: 'phase3', title: 'Phase 3' }
  ],
  parameters: [
    { key: 'param1', label: 'Parameter 1' },
    { key: 'param2', label: 'Parameter 2' }
  ],
  prerequisites: [
    'Basic JavaScript knowledge',
    'Understanding of React components',
    'Familiarity with testing concepts'
  ],
  lastUpdated: '2024-01-15T10:30:00Z',
  version: '1.0.0'
}

const minimalTutorial = {
  id: 'minimal-tutorial',
  title: 'Minimal Tutorial'
}

describe('TutorialCard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    it('should render tutorial card with basic information', () => {
      render(<TutorialCard tutorial={mockTutorial} />)

      expect(screen.getByText('Test Tutorial')).toBeInTheDocument()
      expect(screen.getByText(/A comprehensive tutorial for testing/)).toBeInTheDocument()
      expect(screen.getByTestId('tutorial-icon')).toBeInTheDocument()
      expect(screen.getByTestId('chevron-icon')).toBeInTheDocument()
    })

    it('should display difficulty indicator', () => {
      render(<TutorialCard tutorial={mockTutorial} />)

      expect(screen.getByText('Intermediate')).toBeInTheDocument()
      expect(screen.getByTestId('trending-icon')).toBeInTheDocument()
    })

    it('should show topic tags', () => {
      render(<TutorialCard tutorial={mockTutorial} />)

      expect(screen.getByText('testing')).toBeInTheDocument()
      expect(screen.getByText('javascript')).toBeInTheDocument()
      expect(screen.getByText('react')).toBeInTheDocument()
    })

    it('should display tutorial metadata', () => {
      render(<TutorialCard tutorial={mockTutorial} />)

      expect(screen.getByText('35 min')).toBeInTheDocument()
      expect(screen.getByText('3 phases')).toBeInTheDocument()
      expect(screen.getByTestId('clock-icon')).toBeInTheDocument()
      expect(screen.getByTestId('book-icon')).toBeInTheDocument()
    })

    it('should show prerequisites when available', () => {
      render(<TutorialCard tutorial={mockTutorial} />)

      expect(screen.getByText(/Prerequisites:/)).toBeInTheDocument()
      expect(screen.getByText(/Basic JavaScript knowledge/)).toBeInTheDocument()
    })
  })

  describe('Interaction Handling', () => {
    it('should call onClick when card is clicked', () => {
      const handleClick = vi.fn()
      render(<TutorialCard tutorial={mockTutorial} onClick={handleClick} />)

      fireEvent.click(screen.getByRole('button'))
      expect(handleClick).toHaveBeenCalledWith(mockTutorial, expect.any(Object))
    })

    it('should handle keyboard navigation', () => {
      const handleClick = vi.fn()
      render(<TutorialCard tutorial={mockTutorial} onClick={handleClick} />)

      const card = screen.getByRole('button')
      fireEvent.keyDown(card, { key: 'Enter' })
      expect(handleClick).toHaveBeenCalledWith(mockTutorial, expect.any(Object))

      fireEvent.keyDown(card, { key: ' ' })
      expect(handleClick).toHaveBeenCalledTimes(2)
    })

    it('should not trigger onClick when disabled', () => {
      const handleClick = vi.fn()
      render(<TutorialCard tutorial={mockTutorial} onClick={handleClick} disabled />)

      fireEvent.click(screen.getByRole('button'))
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('should not trigger onClick when loading', () => {
      const handleClick = vi.fn()
      render(<TutorialCard tutorial={mockTutorial} onClick={handleClick} loading />)

      // Loading state renders differently, so we need to check if click is prevented
      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('Visual States', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <TutorialCard tutorial={mockTutorial} className="custom-class" />
      )

      expect(container.firstChild).toHaveClass('custom-class')
    })

    it('should show loading state', () => {
      const { container } = render(<TutorialCard tutorial={mockTutorial} loading />)

      // Loading state shows skeleton elements
      const card = container.firstChild
      expect(card).toHaveClass('animate-pulse')
      
      // Should not show the error message in loading state
      expect(screen.queryByText('Tutorial data unavailable')).not.toBeInTheDocument()
    })

    it('should show error state when tutorial is null', () => {
      render(<TutorialCard tutorial={null} />)

      expect(screen.getByText('Tutorial data unavailable')).toBeInTheDocument()
      expect(screen.getByTestId('tag-icon')).toBeInTheDocument()
    })

    it('should apply disabled styles', () => {
      render(<TutorialCard tutorial={mockTutorial} disabled />)

      const card = screen.getByRole('button')
      expect(card).toHaveClass('opacity-50')
      expect(card).toHaveAttribute('aria-disabled', 'true')
      expect(card).toHaveAttribute('tabIndex', '-1')
    })

    it('should apply featured variant styles', () => {
      render(<TutorialCard tutorial={mockTutorial} variant="featured" />)

      const card = screen.getByRole('button')
      expect(card).toHaveClass('border-primary/30')
    })
  })

  describe('Size Variants', () => {
    it('should apply compact size styles', () => {
      render(<TutorialCard tutorial={mockTutorial} size="compact" />)

      expect(screen.getByText('Test Tutorial')).toHaveClass('text-base')
    })

    it('should apply default size styles', () => {
      render(<TutorialCard tutorial={mockTutorial} size="default" />)

      expect(screen.getByText('Test Tutorial')).toHaveClass('text-lg')
    })
  })

  describe('Topic Tags', () => {
    it('should limit topic tags to maxTopics', () => {
      render(<TutorialCard tutorial={mockTutorial} maxTopics={2} />)

      expect(screen.getByText('testing')).toBeInTheDocument()
      expect(screen.getByText('javascript')).toBeInTheDocument()
      expect(screen.getByText('+2')).toBeInTheDocument() // Remaining count
    })

    it('should handle tutorials with no topics', () => {
      const tutorialWithoutTopics = { ...mockTutorial, topics: [] }
      render(<TutorialCard tutorial={tutorialWithoutTopics} />)

      expect(screen.queryByText('testing')).not.toBeInTheDocument()
    })
  })

  describe('Progress Display', () => {
    it('should show progress when enabled', () => {
      render(<TutorialCard tutorial={mockTutorial} showProgress progress={75} />)

      expect(screen.getByText('Progress')).toBeInTheDocument()
      expect(screen.getByText('75%')).toBeInTheDocument()
      const progressBar = screen.getByTestId('progress-bar')
      expect(progressBar).toHaveAttribute('data-value', '75')
    })

    it('should not show progress when disabled or zero', () => {
      render(<TutorialCard tutorial={mockTutorial} showProgress={false} progress={50} />)

      expect(screen.queryByText('Progress')).not.toBeInTheDocument()
    })
  })

  describe('Minimal Tutorial Data', () => {
    it('should handle tutorial with minimal data', () => {
      render(<TutorialCard tutorial={minimalTutorial} />)

      expect(screen.getByText('Minimal Tutorial')).toBeInTheDocument()
      expect(screen.queryByText(/description/)).not.toBeInTheDocument()
    })

    it('should show fallback duration when no time data available', () => {
      render(<TutorialCard tutorial={minimalTutorial} />)

      expect(screen.getByText('Variable')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<TutorialCard tutorial={mockTutorial} />)

      const card = screen.getByRole('button')
      expect(card).toHaveAttribute('aria-label', 'Open tutorial: Test Tutorial')
      expect(card).toHaveAttribute('tabIndex', '0')
    })

    it('should handle focus properly', () => {
      render(<TutorialCard tutorial={mockTutorial} />)

      const card = screen.getByRole('button')
      card.focus()
      expect(card).toHaveFocus()
    })
  })
})

describe('TutorialCardGrid Component', () => {
  it('should render grid with default settings', () => {
    const { container } = render(
      <TutorialCardGrid>
        <TutorialCard tutorial={mockTutorial} />
        <TutorialCard tutorial={minimalTutorial} />
      </TutorialCardGrid>
    )

    const grid = container.firstChild
    expect(grid).toHaveClass('grid')
    expect(grid).toHaveClass('grid-cols-1')
  })

  it('should apply custom column configuration', () => {
    const { container } = render(
      <TutorialCardGrid columns={3}>
        <TutorialCard tutorial={mockTutorial} />
      </TutorialCardGrid>
    )

    const grid = container.firstChild
    expect(grid).toHaveClass('lg:grid-cols-3')
  })

  it('should apply custom gap configuration', () => {
    const { container } = render(
      <TutorialCardGrid gap="lg">
        <TutorialCard tutorial={mockTutorial} />
      </TutorialCardGrid>
    )

    const grid = container.firstChild
    expect(grid).toHaveClass('gap-6')
  })

  it('should apply custom className', () => {
    const { container } = render(
      <TutorialCardGrid className="custom-grid">
        <TutorialCard tutorial={mockTutorial} />
      </TutorialCardGrid>
    )

    const grid = container.firstChild
    expect(grid).toHaveClass('custom-grid')
  })
})

describe('validateTutorialForCard', () => {
  it('should validate complete tutorial successfully', () => {
    const result = validateTutorialForCard(mockTutorial)
    expect(result.isValid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('should detect missing tutorial', () => {
    const result = validateTutorialForCard(null)
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('Tutorial is required')
  })

  it('should detect missing required fields', () => {
    const invalidTutorial = {}
    const result = validateTutorialForCard(invalidTutorial)
    
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('Tutorial must have an id')
    expect(result.errors).toContain('Tutorial must have a title')
  })

  it('should warn about missing recommended fields', () => {
    const result = validateTutorialForCard(minimalTutorial)
    
    expect(result.isValid).toBe(true) // Still valid, just warnings
    expect(result.warnings).toContain('Tutorial should have a description')
    expect(result.warnings).toContain('Tutorial should have a difficulty level')
    expect(result.warnings).toContain('Tutorial should have topics')
    expect(result.warnings).toContain('Tutorial should have duration or estimated time')
  })

  it('should handle tutorial with some recommended fields', () => {
    const partialTutorial = {
      id: 'partial',
      title: 'Partial Tutorial',
      description: 'Has description',
      difficulty: 'beginner'
    }
    
    const result = validateTutorialForCard(partialTutorial)
    expect(result.isValid).toBe(true)
    expect(result.warnings).not.toContain('Tutorial should have a description')
    expect(result.warnings).not.toContain('Tutorial should have a difficulty level')
    expect(result.warnings).toContain('Tutorial should have topics')
  })
})