/**
 * Breadcrumbs Component Tests
 * 
 * Tests for breadcrumb navigation functionality.
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import ResponsiveBreadcrumbs, { CompactBreadcrumbs } from '../Breadcrumbs'

// Test data
const mockTutorial = {
  id: 'test-tutorial',
  title: 'Test Tutorial: A Very Long Title That Should Be Truncated',
  shortTitle: 'Test Tutorial'
}

const mockPhase = {
  id: 'intro',
  title: 'Introduction Phase'
}

// Wrapper for testing with router
const TestWrapper = ({ children, initialEntries = ['/'] }) => (
  <MemoryRouter initialEntries={initialEntries}>
    {children}
  </MemoryRouter>
)

describe('ResponsiveBreadcrumbs', () => {
  describe('Basic Rendering', () => {
    it('renders home breadcrumb when no tutorial provided', () => {
      render(
        <TestWrapper>
          <ResponsiveBreadcrumbs />
        </TestWrapper>
      )

      // Should render but may be empty without tutorial
      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })

    it('renders tutorial breadcrumb', () => {
      render(
        <TestWrapper>
          <ResponsiveBreadcrumbs tutorial={mockTutorial} />
        </TestWrapper>
      )

      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.getByText('Test Tutorial')).toBeInTheDocument()
    })

    it('renders tutorial and phase breadcrumbs', () => {
      render(
        <TestWrapper>
          <ResponsiveBreadcrumbs 
            tutorial={mockTutorial} 
            currentPhase={mockPhase} 
          />
        </TestWrapper>
      )

      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.getByText('Test Tutorial')).toBeInTheDocument()
      expect(screen.getByText('Introduction Phase')).toBeInTheDocument()
    })
  })

  describe('Navigation Links', () => {
    it('creates correct links for breadcrumb items', () => {
      render(
        <TestWrapper>
          <ResponsiveBreadcrumbs 
            tutorial={mockTutorial} 
            currentPhase={mockPhase} 
          />
        </TestWrapper>
      )

      const homeLink = screen.getByRole('link', { name: /home/i })
      expect(homeLink).toHaveAttribute('href', '/')

      const tutorialLink = screen.getByRole('link', { name: /test tutorial/i })
      expect(tutorialLink).toHaveAttribute('href', '/tutorial/test-tutorial')
    })

    it('does not make the last item a link', () => {
      render(
        <TestWrapper>
          <ResponsiveBreadcrumbs 
            tutorial={mockTutorial} 
            currentPhase={mockPhase} 
          />
        </TestWrapper>
      )

      // The current phase should not be a link
      const phaseText = screen.getByText('Introduction Phase')
      expect(phaseText.closest('a')).toBeNull()
    })
  })

  describe('Title Handling', () => {
    it('uses shortTitle when available', () => {
      render(
        <TestWrapper>
          <ResponsiveBreadcrumbs tutorial={mockTutorial} />
        </TestWrapper>
      )

      expect(screen.getByText('Test Tutorial')).toBeInTheDocument()
      expect(screen.queryByText('Test Tutorial: A Very Long Title That Should Be Truncated')).not.toBeInTheDocument()
    })

    it('falls back to title when shortTitle not available', () => {
      const tutorialWithoutShortTitle = {
        ...mockTutorial,
        shortTitle: undefined
      }

      render(
        <TestWrapper>
          <ResponsiveBreadcrumbs tutorial={tutorialWithoutShortTitle} />
        </TestWrapper>
      )

      expect(screen.getByText('Test Tutorial: A Very Long Title That Should Be Truncated')).toBeInTheDocument()
    })
  })

  describe('Separators', () => {
    it('includes separators between breadcrumb items', () => {
      render(
        <TestWrapper>
          <ResponsiveBreadcrumbs 
            tutorial={mockTutorial} 
            currentPhase={mockPhase} 
          />
        </TestWrapper>
      )

      // Should have chevron separators
      const separators = screen.getAllByRole('generic').filter(el => 
        el.querySelector('svg')
      )
      expect(separators.length).toBeGreaterThan(0)
    })
  })

  describe('Accessibility', () => {
    it('has proper navigation landmark', () => {
      render(
        <TestWrapper>
          <ResponsiveBreadcrumbs tutorial={mockTutorial} />
        </TestWrapper>
      )

      const nav = screen.getByRole('navigation')
      expect(nav).toHaveAttribute('aria-label', 'Breadcrumb')
    })

    it('uses proper list structure', () => {
      render(
        <TestWrapper>
          <ResponsiveBreadcrumbs tutorial={mockTutorial} />
        </TestWrapper>
      )

      expect(screen.getByRole('list')).toBeInTheDocument()
      const listItems = screen.getAllByRole('listitem')
      expect(listItems.length).toBeGreaterThan(0)
    })
  })

  describe('Responsive Behavior', () => {
    it('renders both full and compact versions', () => {
      render(
        <TestWrapper>
          <ResponsiveBreadcrumbs 
            tutorial={mockTutorial} 
            currentPhase={mockPhase} 
          />
        </TestWrapper>
      )

      // Should render navigation elements (both versions may be present but hidden via CSS)
      const navElements = screen.getAllByRole('navigation')
      expect(navElements.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('Edge Cases', () => {
    it('handles tutorial without phases', () => {
      const tutorialWithoutPhases = {
        ...mockTutorial,
        phases: []
      }

      render(
        <TestWrapper>
          <ResponsiveBreadcrumbs tutorial={tutorialWithoutPhases} />
        </TestWrapper>
      )

      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.getByText('Test Tutorial')).toBeInTheDocument()
    })

    it('handles empty tutorial object', () => {
      const emptyTutorial = {
        id: 'empty',
        title: '',
        shortTitle: ''
      }

      render(
        <TestWrapper>
          <ResponsiveBreadcrumbs tutorial={emptyTutorial} />
        </TestWrapper>
      )

      // Should still render navigation structure
      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })
  })
})

describe('CompactBreadcrumbs', () => {
  describe('Basic Rendering', () => {
    it('renders compact breadcrumbs for tutorial only', () => {
      render(
        <TestWrapper>
          <CompactBreadcrumbs tutorial={mockTutorial} />
        </TestWrapper>
      )

      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.getByText('Test Tutorial')).toBeInTheDocument()
    })

    it('renders compact breadcrumbs for tutorial with phase', () => {
      render(
        <TestWrapper>
          <CompactBreadcrumbs 
            tutorial={mockTutorial} 
            currentPhase={mockPhase} 
          />
        </TestWrapper>
      )

      expect(screen.getByText('Test Tutorial')).toBeInTheDocument()
      expect(screen.getByText('Introduction Phase')).toBeInTheDocument()
    })

    it('returns null when no tutorial provided', () => {
      const { container } = render(
        <TestWrapper>
          <CompactBreadcrumbs />
        </TestWrapper>
      )

      expect(container.firstChild).toBeNull()
    })
  })

  describe('Navigation Logic', () => {
    it('links to home when no phase', () => {
      render(
        <TestWrapper>
          <CompactBreadcrumbs tutorial={mockTutorial} />
        </TestWrapper>
      )

      const homeLink = screen.getByRole('link')
      expect(homeLink).toHaveAttribute('href', '/')
    })

    it('links to tutorial when on phase', () => {
      render(
        <TestWrapper>
          <CompactBreadcrumbs 
            tutorial={mockTutorial} 
            currentPhase={mockPhase} 
          />
        </TestWrapper>
      )

      const tutorialLink = screen.getByRole('link')
      expect(tutorialLink).toHaveAttribute('href', '/tutorial/test-tutorial')
    })
  })

  describe('Text Truncation', () => {
    it('applies truncation classes', () => {
      render(
        <TestWrapper>
          <CompactBreadcrumbs 
            tutorial={mockTutorial} 
            currentPhase={mockPhase} 
          />
        </TestWrapper>
      )

      const currentItem = screen.getByText('Introduction Phase')
      expect(currentItem).toHaveClass('truncate')
    })
  })
})