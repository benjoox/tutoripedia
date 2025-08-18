import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Footer from '../Footer';

const mockPhases = [
  { id: 'intro', title: 'Introduction' },
  { id: 'theory', title: 'Theory and Concepts' },
  { id: 'practice', title: 'Practical Application' },
  { id: 'conclusion', title: 'Conclusion' }
];

describe('Footer Component', () => {
  it('renders with phases', () => {
    const mockOnPhaseChange = vi.fn();
    render(
      <Footer 
        phases={mockPhases}
        currentPhase={1}
        onPhaseChange={mockOnPhaseChange}
      />
    );
    
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText('Phase 2 of 4')).toBeInTheDocument();
  });

  it('renders nothing when no phases provided', () => {
    const mockOnPhaseChange = vi.fn();
    const { container } = render(
      <Footer 
        phases={[]}
        currentPhase={0}
        onPhaseChange={mockOnPhaseChange}
      />
    );
    
    expect(container.firstChild).toBeNull();
  });

  it('disables previous button on first phase', () => {
    const mockOnPhaseChange = vi.fn();
    render(
      <Footer 
        phases={mockPhases}
        currentPhase={0}
        onPhaseChange={mockOnPhaseChange}
      />
    );
    
    const previousButtons = screen.getAllByText('Previous');
    previousButtons.forEach(button => {
      expect(button.closest('button')).toBeDisabled();
    });
  });

  it('disables next button on last phase', () => {
    const mockOnPhaseChange = vi.fn();
    render(
      <Footer 
        phases={mockPhases}
        currentPhase={3}
        onPhaseChange={mockOnPhaseChange}
      />
    );
    
    const nextButtons = screen.getAllByText('Next');
    nextButtons.forEach(button => {
      expect(button.closest('button')).toBeDisabled();
    });
  });

  it('shows correct progress indicator', () => {
    const mockOnPhaseChange = vi.fn();
    render(
      <Footer 
        phases={mockPhases}
        currentPhase={2}
        onPhaseChange={mockOnPhaseChange}
      />
    );
    
    expect(screen.getByText('Phase 3 of 4')).toBeInTheDocument();
  });

  it('calls onPhaseChange when previous button is clicked', () => {
    const mockOnPhaseChange = vi.fn();
    render(
      <Footer 
        phases={mockPhases}
        currentPhase={2}
        onPhaseChange={mockOnPhaseChange}
      />
    );
    
    const previousButton = screen.getAllByText('Previous')[0].closest('button');
    fireEvent.click(previousButton);
    
    expect(mockOnPhaseChange).toHaveBeenCalledWith(1);
  });

  it('calls onPhaseChange when next button is clicked', () => {
    const mockOnPhaseChange = vi.fn();
    render(
      <Footer 
        phases={mockPhases}
        currentPhase={1}
        onPhaseChange={mockOnPhaseChange}
      />
    );
    
    const nextButton = screen.getAllByText('Next')[0].closest('button');
    fireEvent.click(nextButton);
    
    expect(mockOnPhaseChange).toHaveBeenCalledWith(2);
  });

  it('calls custom onPrevious callback when provided', () => {
    const mockOnPhaseChange = vi.fn();
    const mockOnPrevious = vi.fn();
    render(
      <Footer 
        phases={mockPhases}
        currentPhase={2}
        onPhaseChange={mockOnPhaseChange}
        onPrevious={mockOnPrevious}
      />
    );
    
    const previousButton = screen.getAllByText('Previous')[0].closest('button');
    fireEvent.click(previousButton);
    
    expect(mockOnPrevious).toHaveBeenCalledTimes(1);
    expect(mockOnPhaseChange).not.toHaveBeenCalled();
  });

  it('calls custom onNext callback when provided', () => {
    const mockOnPhaseChange = vi.fn();
    const mockOnNext = vi.fn();
    render(
      <Footer 
        phases={mockPhases}
        currentPhase={1}
        onPhaseChange={mockOnPhaseChange}
        onNext={mockOnNext}
      />
    );
    
    const nextButton = screen.getAllByText('Next')[0].closest('button');
    fireEvent.click(nextButton);
    
    expect(mockOnNext).toHaveBeenCalledTimes(1);
    expect(mockOnPhaseChange).not.toHaveBeenCalled();
  });

  it('displays phase titles in navigation buttons', () => {
    const mockOnPhaseChange = vi.fn();
    render(
      <Footer 
        phases={mockPhases}
        currentPhase={1}
        onPhaseChange={mockOnPhaseChange}
      />
    );
    
    expect(screen.getByText('Introduction')).toBeInTheDocument();
    expect(screen.getByText('Practical Application')).toBeInTheDocument();
  });

  it('hides progress indicator when showProgress is false', () => {
    const mockOnPhaseChange = vi.fn();
    render(
      <Footer 
        phases={mockPhases}
        currentPhase={1}
        onPhaseChange={mockOnPhaseChange}
        showProgress={false}
      />
    );
    
    expect(screen.queryByText('Phase 2 of 4')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const mockOnPhaseChange = vi.fn();
    const { container } = render(
      <Footer 
        phases={mockPhases}
        currentPhase={1}
        onPhaseChange={mockOnPhaseChange}
        className="custom-class"
      />
    );
    
    const footer = container.querySelector('footer');
    expect(footer).toHaveClass('custom-class');
  });

  it('shows correct progress bar width', () => {
    const mockOnPhaseChange = vi.fn();
    const { container } = render(
      <Footer 
        phases={mockPhases}
        currentPhase={1}
        onPhaseChange={mockOnPhaseChange}
      />
    );
    
    const progressBar = container.querySelector('.bg-primary');
    expect(progressBar).toHaveStyle('width: 50%');
  });
});