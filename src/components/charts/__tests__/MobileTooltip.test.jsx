import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import MobileTooltip from '../MobileTooltip';

const mockPayload = [
  {
    color: '#8884d8',
    name: 'Option Price',
    value: 15.25,
    dataKey: 'optionPrice'
  },
  {
    color: '#82ca9d',
    name: 'Time Value',
    value: 5.75,
    dataKey: 'timeValue'
  }
];

describe('MobileTooltip Component', () => {
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

  it('renders nothing when not active', () => {
    const { container } = render(
      <MobileTooltip 
        active={false}
        payload={mockPayload}
        label="Day 30"
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when no payload', () => {
    const { container } = render(
      <MobileTooltip 
        active={true}
        payload={[]}
        label="Day 30"
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders tooltip with label and payload data', () => {
    render(
      <MobileTooltip 
        active={true}
        payload={mockPayload}
        label="Day 30"
      />
    );

    expect(screen.getByText('Day 30')).toBeInTheDocument();
    expect(screen.getByText('Option Price:')).toBeInTheDocument();
    expect(screen.getByText('15.25')).toBeInTheDocument();
    expect(screen.getByText('Time Value:')).toBeInTheDocument();
    expect(screen.getByText('5.75')).toBeInTheDocument();
  });

  it('uses custom formatter when provided', () => {
    const formatter = (value, name) => {
      if (name === 'Option Price') return [`$${value.toFixed(2)}`, 'Price'];
      return [value, name];
    };

    render(
      <MobileTooltip 
        active={true}
        payload={mockPayload}
        label="Day 30"
        formatter={formatter}
      />
    );

    expect(screen.getByText('$15.25')).toBeInTheDocument();
  });

  it('uses custom label formatter when provided', () => {
    const labelFormatter = (label) => `Time: ${label}`;

    render(
      <MobileTooltip 
        active={true}
        payload={mockPayload}
        label="Day 30"
        labelFormatter={labelFormatter}
      />
    );

    expect(screen.getByText('Time: Day 30')).toBeInTheDocument();
  });

  it('applies mobile-specific styles on mobile', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });

    const { container } = render(
      <MobileTooltip 
        active={true}
        payload={mockPayload}
        label="Day 30"
      />
    );

    const tooltip = container.firstChild;
    expect(tooltip).toHaveClass('text-sm');
    expect(tooltip).toHaveClass('max-w-xs');
  });

  it('applies desktop styles on desktop', () => {
    const { container } = render(
      <MobileTooltip 
        active={true}
        payload={mockPayload}
        label="Day 30"
      />
    );

    const tooltip = container.firstChild;
    expect(tooltip).toHaveClass('text-xs');
    expect(tooltip).not.toHaveClass('max-w-xs');
  });

  it('renders color indicators for each payload item', () => {
    const { container } = render(
      <MobileTooltip 
        active={true}
        payload={mockPayload}
        label="Day 30"
      />
    );

    const colorIndicators = container.querySelectorAll('.w-3.h-3.rounded-full');
    expect(colorIndicators).toHaveLength(mockPayload.length);
  });

  it('applies custom className', () => {
    const { container } = render(
      <MobileTooltip 
        active={true}
        payload={mockPayload}
        label="Day 30"
        className="custom-tooltip"
      />
    );

    const tooltip = container.firstChild;
    expect(tooltip).toHaveClass('custom-tooltip');
  });

  it('handles array formatter return values', () => {
    const formatter = (value, name) => [`$${value.toFixed(2)}`, `Formatted ${name}`];

    render(
      <MobileTooltip 
        active={true}
        payload={mockPayload}
        label="Day 30"
        formatter={formatter}
      />
    );

    expect(screen.getByText('$15.25')).toBeInTheDocument();
  });
});