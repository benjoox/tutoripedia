import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Header from '../Header';

describe('Header Component', () => {
  it('renders with title', () => {
    render(<Header title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders with title and subtitle', () => {
    render(<Header title="Test Title" subtitle="Test Subtitle" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
  });

  it('applies collapsed styles when isCollapsed is true', () => {
    const { container } = render(
      <Header title="Test Title" subtitle="Test Subtitle" isCollapsed={true} />
    );
    const header = container.querySelector('header');
    expect(header).toHaveClass('h-14');
  });

  it('applies expanded styles when isCollapsed is false', () => {
    const { container } = render(
      <Header title="Test Title" subtitle="Test Subtitle" isCollapsed={false} />
    );
    const header = container.querySelector('header');
    expect(header).toHaveClass('h-20');
  });

  it('hides subtitle when collapsed', () => {
    render(
      <Header title="Test Title" subtitle="Test Subtitle" isCollapsed={true} />
    );
    const subtitle = screen.getByText('Test Subtitle');
    expect(subtitle).toHaveClass('opacity-0');
  });

  it('shows subtitle when expanded', () => {
    render(
      <Header title="Test Title" subtitle="Test Subtitle" isCollapsed={false} />
    );
    const subtitle = screen.getByText('Test Subtitle');
    expect(subtitle).toHaveClass('opacity-100');
  });

  it('renders back button when onBackClick is provided', () => {
    const mockOnBackClick = vi.fn();
    render(<Header title="Test Title" onBackClick={mockOnBackClick} />);
    const backButton = screen.getByLabelText('Go back');
    expect(backButton).toBeInTheDocument();
  });

  it('does not render back button when onBackClick is not provided', () => {
    render(<Header title="Test Title" />);
    const backButton = screen.queryByLabelText('Go back');
    expect(backButton).not.toBeInTheDocument();
  });

  it('calls onBackClick when back button is clicked', () => {
    const mockOnBackClick = vi.fn();
    render(<Header title="Test Title" onBackClick={mockOnBackClick} />);
    const backButton = screen.getByLabelText('Go back');
    fireEvent.click(backButton);
    expect(mockOnBackClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    const { container } = render(
      <Header title="Test Title" className="custom-class" />
    );
    const header = container.querySelector('header');
    expect(header).toHaveClass('custom-class');
  });
});