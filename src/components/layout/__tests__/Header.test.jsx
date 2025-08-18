import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Header, { BaseHeader } from '../Header';

describe('BaseHeader Component', () => {
  it('renders with title', () => {
    render(<BaseHeader title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders with title and subtitle', () => {
    render(<BaseHeader title="Test Title" subtitle="Test Subtitle" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
  });

  it('applies collapsed styles when isCollapsed is true', () => {
    const { container } = render(
      <BaseHeader title="Test Title" subtitle="Test Subtitle" isCollapsed={true} />
    );
    const header = container.querySelector('header');
    expect(header).toHaveClass('h-14');
  });

  it('applies expanded styles when isCollapsed is false', () => {
    const { container } = render(
      <BaseHeader title="Test Title" subtitle="Test Subtitle" isCollapsed={false} />
    );
    const header = container.querySelector('header');
    expect(header).toHaveClass('h-20');
  });

  it('applies sticky styles when isSticky is true', () => {
    const { container } = render(
      <BaseHeader title="Test Title" isSticky={true} />
    );
    const header = container.querySelector('header');
    expect(header).toHaveClass('sticky', 'top-0', 'z-50');
  });

  it('hides subtitle when collapsed', () => {
    render(
      <BaseHeader title="Test Title" subtitle="Test Subtitle" isCollapsed={true} />
    );
    const subtitle = screen.getByText('Test Subtitle');
    expect(subtitle).toHaveClass('opacity-0');
  });

  it('shows subtitle when expanded', () => {
    render(
      <BaseHeader title="Test Title" subtitle="Test Subtitle" isCollapsed={false} />
    );
    const subtitle = screen.getByText('Test Subtitle');
    expect(subtitle).toHaveClass('opacity-100');
  });

  it('renders back button when onBackClick is provided', () => {
    const mockOnBackClick = vi.fn();
    render(<BaseHeader title="Test Title" onBackClick={mockOnBackClick} />);
    const backButton = screen.getByLabelText('Go back');
    expect(backButton).toBeInTheDocument();
  });

  it('does not render back button when onBackClick is not provided', () => {
    render(<BaseHeader title="Test Title" />);
    const backButton = screen.queryByLabelText('Go back');
    expect(backButton).not.toBeInTheDocument();
  });

  it('calls onBackClick when back button is clicked', () => {
    const mockOnBackClick = vi.fn();
    render(<BaseHeader title="Test Title" onBackClick={mockOnBackClick} />);
    const backButton = screen.getByLabelText('Go back');
    fireEvent.click(backButton);
    expect(mockOnBackClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    const { container } = render(
      <BaseHeader title="Test Title" className="custom-class" />
    );
    const header = container.querySelector('header');
    expect(header).toHaveClass('custom-class');
  });
});

describe('Header Component with Scroll Integration', () => {
  let scrollEventListeners = [];
  
  beforeEach(() => {
    // Reset window.scrollY
    window.scrollY = 0;
    
    // Mock addEventListener and removeEventListener
    scrollEventListeners = [];
    vi.spyOn(window, 'addEventListener').mockImplementation((event, handler, options) => {
      if (event === 'scroll') {
        scrollEventListeners.push({ handler, options });
      }
    });
    
    vi.spyOn(window, 'removeEventListener').mockImplementation((event, handler) => {
      if (event === 'scroll') {
        scrollEventListeners = scrollEventListeners.filter(listener => listener.handler !== handler);
      }
    });
    
    // Mock requestAnimationFrame
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      setTimeout(cb, 0);
      return 1;
    });
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
    scrollEventListeners = [];
  });

  it('renders with scroll-aware behavior', () => {
    render(<Header title="Test Title" subtitle="Test Subtitle" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
  });

  it('adds scroll event listener on mount', () => {
    render(<Header title="Test Title" />);
    
    expect(window.addEventListener).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function),
      { passive: true }
    );
    expect(scrollEventListeners).toHaveLength(1);
  });

  it('becomes sticky and collapsed when scrolled', async () => {
    const { container } = render(<Header title="Test Title" subtitle="Test Subtitle" />);
    
    // Simulate scroll down
    act(() => {
      window.scrollY = 200;
      scrollEventListeners[0].handler();
    });
    
    // Wait for debounced update
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 20));
    });
    
    const header = container.querySelector('header');
    expect(header).toHaveClass('sticky', 'top-0', 'z-50', 'h-14');
  });

  it('passes custom scroll options to useScrollHeader hook', () => {
    const scrollOptions = {
      threshold: 200,
      collapseDistance: 100,
      debounceMs: 50
    };
    
    render(<Header title="Test Title" scrollOptions={scrollOptions} />);
    
    // The hook should be called with these options
    expect(window.addEventListener).toHaveBeenCalled();
  });

  it('removes scroll event listener on unmount', () => {
    const { unmount } = render(<Header title="Test Title" />);
    
    unmount();
    
    expect(window.removeEventListener).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function)
    );
  });
});