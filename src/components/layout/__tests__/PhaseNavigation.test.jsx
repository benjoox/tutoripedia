import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PhaseNavigation from '../PhaseNavigation';

const mockPhases = [
  {
    id: 'intro',
    title: 'Introduction',
    shortTitle: 'Intro',
    icon: <span>📖</span>
  },
  {
    id: 'theory',
    title: 'Theory and Concepts',
    shortTitle: 'Theory',
    icon: <span>🧮</span>
  },
  {
    id: 'practice',
    title: 'Practical Application',
    shortTitle: 'Practice',
    icon: <span>⚡</span>
  },
  {
    id: 'conclusion',
    title: 'Conclusion',
    shortTitle: 'End',
    icon: <span>🎯</span>
  }
];

describe('PhaseNavigation Component', () => {
  it('renders with phases', () => {
    const mockOnPhaseChange = vi.fn();
    render(
      <PhaseNavigation 
        phases={mockPhases}
        currentPhase={0}
        onPhaseChange={mockOnPhaseChange}
      />
    );
    
    expect(screen.getByText('Introduction')).toBeInTheDocument();
    expect(screen.getByText('Theory and Concepts')).toBeInTheDocument();
    expect(screen.getByText('Practical Application')).toBeInTheDocument();
    expect(screen.getByText('Conclusion')).toBeInTheDocument();
  });

  it('renders nothing when no phases provided', () => {
    const mockOnPhaseChange = vi.fn();
    const { container } = render(
      <PhaseNavigation 
        phases={[]}
        currentPhase={0}
        onPhaseChange={mockOnPhaseChange}
      />
    );
    
    expect(container.firstChild).toBeNull();
  });

  it('highlights active phase', () => {
    const mockOnPhaseChange = vi.fn();
    render(
      <PhaseNavigation 
        phases={mockPhases}
        currentPhase={1}
        onPhaseChange={mockOnPhaseChange}
      />
    );
    
    // The active button should have different styling
    const buttons = screen.getAllByRole('button');
    const activeButton = buttons.find(button => 
      button.textContent.includes('Theory and Concepts')
    );
    
    expect(activeButton).toBeInTheDocument();
  });

  it('calls onPhaseChange when phase button is clicked', () => {
    const mockOnPhaseChange = vi.fn();
    render(
      <PhaseNavigation 
        phases={mockPhases}
        currentPhase={0}
        onPhaseChange={mockOnPhaseChange}
      />
    );
    
    const theoryButton = screen.getByText('Theory and Concepts');
    fireEvent.click(theoryButton);
    
    expect(mockOnPhaseChange).toHaveBeenCalledWith(1);
  });

  it('applies sticky styles when isSticky is true', () => {
    const mockOnPhaseChange = vi.fn();
    const { container } = render(
      <PhaseNavigation 
        phases={mockPhases}
        currentPhase={0}
        onPhaseChange={mockOnPhaseChange}
        isSticky={true}
      />
    );
    
    const nav = container.querySelector('nav');
    expect(nav).toHaveClass('sticky');
    expect(nav).toHaveClass('top-0');
  });

  it('does not apply sticky styles when isSticky is false', () => {
    const mockOnPhaseChange = vi.fn();
    const { container } = render(
      <PhaseNavigation 
        phases={mockPhases}
        currentPhase={0}
        onPhaseChange={mockOnPhaseChange}
        isSticky={false}
      />
    );
    
    const nav = container.querySelector('nav');
    expect(nav).not.toHaveClass('sticky');
  });

  it('renders phase icons', () => {
    const mockOnPhaseChange = vi.fn();
    render(
      <PhaseNavigation 
        phases={mockPhases}
        currentPhase={0}
        onPhaseChange={mockOnPhaseChange}
      />
    );
    
    expect(screen.getAllByText('📖')).toHaveLength(2); // Mobile and desktop
    expect(screen.getAllByText('🧮')).toHaveLength(2);
    expect(screen.getAllByText('⚡')).toHaveLength(2);
    expect(screen.getAllByText('🎯')).toHaveLength(2);
  });

  it('applies custom className', () => {
    const mockOnPhaseChange = vi.fn();
    const { container } = render(
      <PhaseNavigation 
        phases={mockPhases}
        currentPhase={0}
        onPhaseChange={mockOnPhaseChange}
        className="custom-class"
      />
    );
    
    const nav = container.querySelector('nav');
    expect(nav).toHaveClass('custom-class');
  });

  it('handles phases without icons', () => {
    const phasesWithoutIcons = [
      { id: 'phase1', title: 'Phase 1' },
      { id: 'phase2', title: 'Phase 2' }
    ];
    
    const mockOnPhaseChange = vi.fn();
    render(
      <PhaseNavigation 
        phases={phasesWithoutIcons}
        currentPhase={0}
        onPhaseChange={mockOnPhaseChange}
      />
    );
    
    expect(screen.getAllByText('Phase 1')).toHaveLength(2); // Mobile and desktop
    expect(screen.getAllByText('Phase 2')).toHaveLength(2);
  });

  it('shows phase indicators on mobile', () => {
    const mockOnPhaseChange = vi.fn();
    
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });
    
    const { container } = render(
      <PhaseNavigation 
        phases={mockPhases}
        currentPhase={1}
        onPhaseChange={mockOnPhaseChange}
      />
    );
    
    // Should show phase indicators (dots) - one active indicator has different classes
    const indicators = container.querySelectorAll('.h-1.rounded-full');
    expect(indicators).toHaveLength(mockPhases.length);
  });

  it('shows navigation hints on mobile when many phases', () => {
    const manyPhases = [
      ...mockPhases,
      { id: 'extra1', title: 'Extra Phase 1', shortTitle: 'Extra1' },
      { id: 'extra2', title: 'Extra Phase 2', shortTitle: 'Extra2' }
    ];
    
    const mockOnPhaseChange = vi.fn();
    
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });
    
    render(
      <PhaseNavigation 
        phases={manyPhases}
        currentPhase={0}
        onPhaseChange={mockOnPhaseChange}
      />
    );
    
    expect(screen.getByText('Swipe or scroll to navigate phases')).toBeInTheDocument();
  });

  it('uses short titles on mobile', () => {
    const mockOnPhaseChange = vi.fn();
    
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });
    
    render(
      <PhaseNavigation 
        phases={mockPhases}
        currentPhase={0}
        onPhaseChange={mockOnPhaseChange}
      />
    );
    
    // Should show short titles on mobile
    expect(screen.getByText('Intro')).toBeInTheDocument();
    expect(screen.getByText('Theory')).toBeInTheDocument();
    expect(screen.getByText('Practice')).toBeInTheDocument();
    expect(screen.getByText('End')).toBeInTheDocument();
  });

  it('handles touch events for swipe gestures', () => {
    const mockOnPhaseChange = vi.fn();
    
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });
    
    const { container } = render(
      <PhaseNavigation 
        phases={mockPhases}
        currentPhase={1}
        onPhaseChange={mockOnPhaseChange}
      />
    );
    
    const scrollContainer = container.querySelector('.overflow-x-auto');
    
    // Simulate swipe left (next phase)
    fireEvent.touchStart(scrollContainer, {
      targetTouches: [{ clientX: 200 }]
    });
    fireEvent.touchMove(scrollContainer, {
      targetTouches: [{ clientX: 100 }]
    });
    fireEvent.touchEnd(scrollContainer);
    
    expect(mockOnPhaseChange).toHaveBeenCalledWith(2);
  });

  it('handles swipe right for previous phase', () => {
    const mockOnPhaseChange = vi.fn();
    
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });
    
    const { container } = render(
      <PhaseNavigation 
        phases={mockPhases}
        currentPhase={2}
        onPhaseChange={mockOnPhaseChange}
      />
    );
    
    const scrollContainer = container.querySelector('.overflow-x-auto');
    
    // Simulate swipe right (previous phase)
    fireEvent.touchStart(scrollContainer, {
      targetTouches: [{ clientX: 100 }]
    });
    fireEvent.touchMove(scrollContainer, {
      targetTouches: [{ clientX: 200 }]
    });
    fireEvent.touchEnd(scrollContainer);
    
    expect(mockOnPhaseChange).toHaveBeenCalledWith(1);
  });

  it('does not swipe beyond first phase', () => {
    const mockOnPhaseChange = vi.fn();
    
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });
    
    const { container } = render(
      <PhaseNavigation 
        phases={mockPhases}
        currentPhase={0}
        onPhaseChange={mockOnPhaseChange}
      />
    );
    
    const scrollContainer = container.querySelector('.overflow-x-auto');
    
    // Simulate swipe right at first phase
    fireEvent.touchStart(scrollContainer, {
      targetTouches: [{ clientX: 100 }]
    });
    fireEvent.touchMove(scrollContainer, {
      targetTouches: [{ clientX: 200 }]
    });
    fireEvent.touchEnd(scrollContainer);
    
    expect(mockOnPhaseChange).not.toHaveBeenCalled();
  });

  it('does not swipe beyond last phase', () => {
    const mockOnPhaseChange = vi.fn();
    
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });
    
    const { container } = render(
      <PhaseNavigation 
        phases={mockPhases}
        currentPhase={mockPhases.length - 1}
        onPhaseChange={mockOnPhaseChange}
      />
    );
    
    const scrollContainer = container.querySelector('.overflow-x-auto');
    
    // Simulate swipe left at last phase
    fireEvent.touchStart(scrollContainer, {
      targetTouches: [{ clientX: 200 }]
    });
    fireEvent.touchMove(scrollContainer, {
      targetTouches: [{ clientX: 100 }]
    });
    fireEvent.touchEnd(scrollContainer);
    
    expect(mockOnPhaseChange).not.toHaveBeenCalled();
  });
});