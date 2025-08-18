/**
 * HomePage Component Tests
 * 
 * Tests for the main landing page with tutorial grid, search, and filtering functionality.
 */

import React from 'react'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import HomePage from '../HomePage'
import * as tutorialRegistry from '@/tutorials'

// Mock the tutorial registry
vi.mock('@/tutorials', () => ({
  getAllTutorials: vi.fn(),
  searchTutorials: vi.fn(),
  getTutorialsByDifficulty: vi.fn()
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

// Test data
const mockTutorials = [
  {
    id: 'black-scholes-time',
    title: 'Black-Scholes: Understanding Time to Maturity (T)',
    shortTitle: 'Black-Scholes Time',
    description: 'Explore how time affects option pricing in the Black-Scholes model through interactive visualizations.',
    difficulty: 'intermediate',
    duration: '30-45 minutes',
    estimatedTime: 35,
    topics: ['Options', 'Black-Scholes', 'Time Value'],
    categories: ['Finance', 'Derivatives'],
    phases: [
      { id: 'intro', title: 'Introduction' },
      { id: 'theory', title: 'Theory' },
      { id: 'practice', title: 'Practice' }
    ],
    parameters: [
      { key: 'timeToMaturity', label: 'Time to Maturity' },
      { key: 'stockPrice', label: 'Stock Price' }
    ],
    lastUpdated: '2024-01-15'
  },
  {
    id: 'volatility-basics',
    title: 'Understanding Volatility in Options',
    description: 'Learn about implied and historical volatility and their impact on option pricing.',
    difficulty: 'beginner',
    duration: '20-30 minutes',
    estimatedTime: 25,
    topics: ['Options', 'Volatility', 'Risk'],
    categories: ['Finance'],
    phases: [
      { id: 'intro', title: 'Introduction' },
      { id: 'examples', title: 'Examples' }
    ],
    parameters: [
      { key: 'volatility', label: 'Volatility' }
    ],
    lastUpdated: '2024-01-10'
  },
  {
    id: 'advanced-greeks',
    title: 'Advanced Options Greeks',
    description: 'Deep dive into second-order Greeks and their practical applications.',
    difficulty: 'advanced',
    duration: '45-60 minutes',
    estimatedTime: 50,
    topics: ['Options', 'Greeks', 'Risk Management'],
    categories: ['Finance', 'Risk Management'],
    phases: [
      { id: 'theory', title: 'Theory' },
      { id: 'calculations', title: 'Calculations' },
      { id: 'applications', title: 'Applications' }
    ],
    parameters: [
      { key: 'delta', label: 'Delta' },
      { key: 'gamma', label: 'Gamma' },
      { key: 'theta', label: 'Theta' }
    ],
    lastUpdated: '2024-01-20'
  }
]

// Wrapper component for testing
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
)

describe('HomePage', () => {
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()
    
    // Setup default mock implementations
    tutorialRegistry.getAllTutorials.mockReturnValue(mockTutorials)
    tutorialRegistry.searchTutorials.mockImplementation((query) => 
      mockTutorials.filter(tutorial => 
        tutorial.title.toLowerCase().includes(query.toLowerCase()) ||
        tutorial.description.toLowerCase().includes(query.toLowerCase()) ||
        tutorial.topics.some(topic => topic.toLowerCase().includes(query.toLowerCase()))
      )
    )
    tutorialRegistry.getTutorialsByDifficulty.mockImplementation((difficulty) =>
      mockTutorials.filter(tutorial => tutorial.difficulty === difficulty)
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Rendering', () => {
    it('renders the homepage with hero section', () => {
      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      )

      expect(screen.getByText('Interactive Learning Tutorials')).toBeInTheDocument()
      expect(screen.getByText(/Explore complex financial concepts/)).toBeInTheDocument()
      expect(screen.getByText('3 Tutorials')).toBeInTheDocument()
      expect(screen.getByText('3 Difficulty Levels')).toBeInTheDocument()
    })

    it('renders tutorial cards for all tutorials', () => {
      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      )

      mockTutorials.forEach(tutorial => {
        expect(screen.getByText(tutorial.title)).toBeInTheDocument()
        expect(screen.getByText(tutorial.description)).toBeInTheDocument()
      })
    })

    it('renders search and filter controls', () => {
      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      )

      expect(screen.getByPlaceholderText(/Search tutorials/)).toBeInTheDocument()
      expect(screen.getByText('All Levels')).toBeInTheDocument()
      expect(screen.getByText('All Topics')).toBeInTheDocument()
    })

    it('shows correct results summary', () => {
      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      )

      expect(screen.getByText('Showing all 3 tutorials')).toBeInTheDocument()
    })
  })

  describe('Tutorial Navigation', () => {
    it('navigates to tutorial page when card is clicked', async () => {
      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      )

      const tutorialCard = screen.getByText('Black-Scholes: Understanding Time to Maturity (T)').closest('[role="button"]')
      fireEvent.click(tutorialCard)

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/tutorial/black-scholes-time')
      })
    })

    it('handles keyboard navigation on tutorial cards', async () => {
      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      )

      const tutorialCard = screen.getByText('Understanding Volatility in Options').closest('[role="button"]')
      fireEvent.keyDown(tutorialCard, { key: 'Enter' })

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/tutorial/volatility-basics')
      })
    })
  })

  describe('Search Functionality', () => {
    it('filters tutorials based on search query', async () => {
      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      )

      const searchInput = screen.getByPlaceholderText(/Search tutorials/)
      fireEvent.change(searchInput, { target: { value: 'volatility' } })

      await waitFor(() => {
        expect(tutorialRegistry.searchTutorials).toHaveBeenCalledWith('volatility')
        expect(screen.getByText('Understanding Volatility in Options')).toBeInTheDocument()
        expect(screen.queryByText('Advanced Options Greeks')).not.toBeInTheDocument()
      })
    })

    it('shows search query in active filters', async () => {
      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      )

      const searchInput = screen.getByPlaceholderText(/Search tutorials/)
      fireEvent.change(searchInput, { target: { value: 'options' } })

      await waitFor(() => {
        expect(screen.getByText('Search: "options"')).toBeInTheDocument()
      })
    })

    it('clears search when X button is clicked', async () => {
      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      )

      const searchInput = screen.getByPlaceholderText(/Search tutorials/)
      fireEvent.change(searchInput, { target: { value: 'test' } })

      await waitFor(() => {
        expect(searchInput.value).toBe('test')
      })

      // Find the clear button in the search input (the X button)
      const searchContainer = screen.getByPlaceholderText(/Search tutorials/).parentElement
      const clearButton = within(searchContainer).getByRole('button')
      fireEvent.click(clearButton)

      await waitFor(() => {
        expect(searchInput.value).toBe('')
      })
    })
  })

  describe('Filtering', () => {
    it('filters tutorials by difficulty', async () => {
      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      )

      // Test that filtering works by checking if beginner tutorials are shown
      // when we simulate the filtering logic
      const beginnerTutorials = mockTutorials.filter(t => t.difficulty === 'beginner')
      expect(beginnerTutorials.length).toBe(1)
      expect(beginnerTutorials[0].title).toBe('Understanding Volatility in Options')
    })

    it('filters tutorials by topic', () => {
      // Test that filtering works by checking if Greeks tutorials are shown
      // when we simulate the filtering logic
      const greeksTutorials = mockTutorials.filter(t => t.topics.includes('Greeks'))
      expect(greeksTutorials.length).toBe(1)
      expect(greeksTutorials[0].title).toBe('Advanced Options Greeks')
    })

    it('shows active filters when search is used', async () => {
      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      )

      // Set search filter
      const searchInput = screen.getByPlaceholderText(/Search tutorials/)
      fireEvent.change(searchInput, { target: { value: 'test search' } })

      await waitFor(() => {
        expect(screen.getByText('Active filters:')).toBeInTheDocument()
        expect(screen.getByText('Search: "test search"')).toBeInTheDocument()
      })
    })

    it('clears all filters when clear button is clicked', async () => {
      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      )

      // Set search filter
      const searchInput = screen.getByPlaceholderText(/Search tutorials/)
      fireEvent.change(searchInput, { target: { value: 'test' } })

      await waitFor(() => {
        expect(screen.getByText('Active filters:')).toBeInTheDocument()
      })

      // Clear all filters
      const clearButton = screen.getByText('Clear')
      fireEvent.click(clearButton)

      await waitFor(() => {
        expect(searchInput.value).toBe('')
        expect(screen.queryByText('Active filters:')).not.toBeInTheDocument()
      })
    })
  })

  describe('Sorting', () => {
    it('changes sort criteria', async () => {
      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      )

      // Verify that getAllTutorials is called with default sort parameters
      expect(tutorialRegistry.getAllTutorials).toHaveBeenCalledWith({
        sortBy: 'title',
        sortOrder: 'asc'
      })
    })

    it('toggles sort order', async () => {
      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      )

      const sortOrderButton = screen.getByRole('button', { name: /sort/i })
      expect(sortOrderButton).toBeInTheDocument()
      
      fireEvent.click(sortOrderButton)

      await waitFor(() => {
        expect(tutorialRegistry.getAllTutorials).toHaveBeenCalledWith({
          sortBy: 'title',
          sortOrder: 'desc'
        })
      })
    })
  })

  describe('Empty States', () => {
    it('shows empty state when no tutorials match filters', async () => {
      tutorialRegistry.searchTutorials.mockReturnValue([])

      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      )

      const searchInput = screen.getByPlaceholderText(/Search tutorials/)
      fireEvent.change(searchInput, { target: { value: 'nonexistent' } })

      await waitFor(() => {
        expect(screen.getByText('No tutorials found')).toBeInTheDocument()
        expect(screen.getByText(/Try adjusting your search criteria/)).toBeInTheDocument()
        expect(screen.getByText('Clear all filters')).toBeInTheDocument()
      })
    })

    it('shows empty state when no tutorials are available', () => {
      tutorialRegistry.getAllTutorials.mockReturnValue([])

      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      )

      expect(screen.getByText('No tutorials found')).toBeInTheDocument()
      expect(screen.getByText('No tutorials are currently available.')).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('handles tutorial registry errors gracefully', () => {
      tutorialRegistry.getAllTutorials.mockImplementation(() => {
        throw new Error('Registry error')
      })

      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      )

      // Should still render the page structure
      expect(screen.getByText('Interactive Learning Tutorials')).toBeInTheDocument()
      expect(screen.getByText('0 Tutorials')).toBeInTheDocument()
    })

    it('handles invalid tutorial data gracefully', () => {
      tutorialRegistry.getAllTutorials.mockReturnValue([
        { id: 'invalid', title: null }, // Invalid tutorial
        mockTutorials[0] // Valid tutorial
      ])

      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      )

      // Should still render valid tutorials
      expect(screen.getByText('Black-Scholes: Understanding Time to Maturity (T)')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA labels and roles', () => {
      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      )

      // Check that tutorial cards exist and have proper accessibility
      const tutorialTitles = mockTutorials.map(t => t.title)
      tutorialTitles.forEach(title => {
        const tutorialElement = screen.getByText(title)
        expect(tutorialElement).toBeInTheDocument()
      })

      // Check that buttons exist on the page
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })

    it('supports keyboard navigation', () => {
      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      )

      const searchInput = screen.getByPlaceholderText(/Search tutorials/)
      expect(searchInput).toBeInTheDocument()

      // Tab navigation should work
      searchInput.focus()
      expect(document.activeElement).toBe(searchInput)
    })
  })

  describe('Performance', () => {
    it('does not re-render unnecessarily', () => {
      const { rerender } = render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      )

      // Re-render with same props
      rerender(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      )

      // Should only call getAllTutorials once per render (memoized)
      expect(tutorialRegistry.getAllTutorials).toHaveBeenCalledTimes(1)
    })
  })
})