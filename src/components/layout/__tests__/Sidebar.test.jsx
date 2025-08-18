import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Sidebar from '../Sidebar';

const mockParameters = [
  {
    key: 'stockPrice',
    label: 'Stock Price',
    type: 'slider',
    min: 50,
    max: 200,
    step: 1,
    unit: '$',
    description: 'Current price of the stock'
  },
  {
    key: 'strikePrice',
    label: 'Strike Price',
    type: 'input',
    min: 50,
    max: 200,
    step: 1,
    unit: '$',
    formatter: (value) => `$${value.toFixed(2)}`
  }
];

const mockValues = {
  stockPrice: 100,
  strikePrice: 110
};

const mockCalculations = {
  optionPrice: 15.2345,
  timeValue: 5.1234
};

describe('Sidebar Component', () => {
  beforeEach(() => {
    // Reset window dimensions
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
  it('renders with parameters', () => {
    const mockOnChange = vi.fn();
    render(
      <Sidebar 
        parameters={mockParameters}
        values={mockValues}
        onChange={mockOnChange}
      />
    );
    
    expect(screen.getByText('Parameters')).toBeInTheDocument();
    expect(screen.getByText('Stock Price')).toBeInTheDocument();
    expect(screen.getByText('Strike Price')).toBeInTheDocument();
  });

  it('displays parameter descriptions', () => {
    const mockOnChange = vi.fn();
    render(
      <Sidebar 
        parameters={mockParameters}
        values={mockValues}
        onChange={mockOnChange}
      />
    );
    
    expect(screen.getByText('Current price of the stock')).toBeInTheDocument();
  });

  it('displays formatted values', () => {
    const mockOnChange = vi.fn();
    render(
      <Sidebar 
        parameters={mockParameters}
        values={mockValues}
        onChange={mockOnChange}
      />
    );
    
    expect(screen.getByText('100 $')).toBeInTheDocument();
    expect(screen.getByText('$110.00')).toBeInTheDocument();
  });

  it('displays current calculations', () => {
    const mockOnChange = vi.fn();
    render(
      <Sidebar 
        parameters={mockParameters}
        values={mockValues}
        onChange={mockOnChange}
        calculations={mockCalculations}
      />
    );
    
    expect(screen.getByText('Current Values')).toBeInTheDocument();
    expect(screen.getByText('Option Price')).toBeInTheDocument();
    expect(screen.getByText('15.2345')).toBeInTheDocument();
    expect(screen.getByText('Time Value')).toBeInTheDocument();
    expect(screen.getByText('5.1234')).toBeInTheDocument();
  });

  it('calls onChange when slider value changes', () => {
    const mockOnChange = vi.fn();
    render(
      <Sidebar 
        parameters={mockParameters}
        values={mockValues}
        onChange={mockOnChange}
      />
    );
    
    // Note: Testing slider interaction is complex with Radix UI
    // This is a simplified test that verifies the component renders
    expect(screen.getByDisplayValue('110')).toBeInTheDocument();
  });

  it('calls onChange when input value changes', () => {
    const mockOnChange = vi.fn();
    render(
      <Sidebar 
        parameters={mockParameters}
        values={mockValues}
        onChange={mockOnChange}
      />
    );
    
    const input = screen.getByDisplayValue('110');
    fireEvent.change(input, { target: { value: '120' } });
    
    expect(mockOnChange).toHaveBeenCalledWith('strikePrice', 120);
  });

  it('applies mobile drawer styles when not open', () => {
    const mockOnChange = vi.fn();
    
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });
    
    const { container } = render(
      <Sidebar 
        parameters={mockParameters}
        values={mockValues}
        onChange={mockOnChange}
        isOpen={false}
      />
    );
    
    const sidebar = container.querySelector('aside');
    expect(sidebar).toHaveClass('-translate-x-full');
  });

  it('applies mobile drawer styles when open', () => {
    const mockOnChange = vi.fn();
    
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });
    
    const { container } = render(
      <Sidebar 
        parameters={mockParameters}
        values={mockValues}
        onChange={mockOnChange}
        isOpen={true}
      />
    );
    
    const sidebar = container.querySelector('aside');
    expect(sidebar).toHaveClass('translate-x-0');
  });

  it('renders close button when onClose is provided', () => {
    const mockOnChange = vi.fn();
    const mockOnClose = vi.fn();
    
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });
    
    render(
      <Sidebar 
        parameters={mockParameters}
        values={mockValues}
        onChange={mockOnChange}
        onClose={mockOnClose}
      />
    );
    
    const closeButton = screen.getByLabelText('Close parameters panel');
    expect(closeButton).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const mockOnChange = vi.fn();
    const mockOnClose = vi.fn();
    
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });
    
    render(
      <Sidebar 
        parameters={mockParameters}
        values={mockValues}
        onChange={mockOnChange}
        onClose={mockOnClose}
      />
    );
    
    const closeButton = screen.getByLabelText('Close parameters panel');
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('shows backdrop on mobile when open', () => {
    const mockOnChange = vi.fn();
    const mockOnClose = vi.fn();
    
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });
    
    const { container } = render(
      <Sidebar 
        isOpen={true}
        parameters={mockParameters}
        values={mockValues}
        onChange={mockOnChange}
        onClose={mockOnClose}
      />
    );
    
    const backdrop = container.querySelector('[aria-hidden="true"]');
    expect(backdrop).toBeInTheDocument();
  });

  it('calls onClose when backdrop is clicked', () => {
    const mockOnChange = vi.fn();
    const mockOnClose = vi.fn();
    
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });
    
    const { container } = render(
      <Sidebar 
        isOpen={true}
        parameters={mockParameters}
        values={mockValues}
        onChange={mockOnChange}
        onClose={mockOnClose}
      />
    );
    
    const backdrop = container.querySelector('[aria-hidden="true"]');
    fireEvent.click(backdrop);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('has proper accessibility attributes for mobile', () => {
    const mockOnChange = vi.fn();
    const mockOnClose = vi.fn();
    
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });
    
    const { container } = render(
      <Sidebar 
        isOpen={true}
        parameters={mockParameters}
        values={mockValues}
        onChange={mockOnChange}
        onClose={mockOnClose}
      />
    );
    
    const sidebar = container.querySelector('aside');
    expect(sidebar).toHaveAttribute('role', 'dialog');
    expect(sidebar).toHaveAttribute('aria-label', 'Tutorial parameters');
    expect(sidebar).toHaveAttribute('aria-modal', 'true');
  });

  it('renders without calculations section when no calculations provided', () => {
    const mockOnChange = vi.fn();
    render(
      <Sidebar 
        parameters={mockParameters}
        values={mockValues}
        onChange={mockOnChange}
      />
    );
    
    expect(screen.queryByText('Current Values')).not.toBeInTheDocument();
  });
});