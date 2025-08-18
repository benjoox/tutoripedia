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
    
    expect(screen.getByText('📖')).toBeInTheDocument();
    expect(screen.getByText('🧮')).toBeInTheDocument();
    expect(screen.getByText('⚡')).toBeInTheDocument();
    expect(screen.getByText('🎯')).toBeInTheDocument();
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
    
    expect(screen.getByText('Phase 1')).toBeInTheDocument();
    expect(screen.getByText('Phase 2')).toBeInTheDocument();
  });
});