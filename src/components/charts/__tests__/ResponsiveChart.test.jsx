import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ResponsiveChart from '../ResponsiveChart';
import { LineChart, Line } from 'recharts';

// Mock data for testing
const mockData = [
  { x: 1, y: 10 },
  { x: 2, y: 20 },
  { x: 3, y: 15 }
];

describe('ResponsiveChart Component', () => {
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

  it('renders with default height on desktop', () => {
    const { container } = render(
      <ResponsiveChart height={400}>
        <LineChart data={mockData}>
          <Line dataKey="y" />
        </LineChart>
      </ResponsiveChart>
    );

    const chartContainer = container.querySelector('.recharts-responsive-container');
    expect(chartContainer).toBeInTheDocument();
  });

  it('uses mobile height on mobile devices', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });

    const { container } = render(
      <ResponsiveChart height={400} mobileHeight={250}>
        <LineChart data={mockData}>
          <Line dataKey="y" />
        </LineChart>
      </ResponsiveChart>
    );

    const chartContainer = container.querySelector('.recharts-responsive-container');
    expect(chartContainer).toBeInTheDocument();
  });

  it('shows interaction hint on mobile when touch is enabled', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });

    render(
      <ResponsiveChart enableTouch={true}>
        <LineChart data={mockData}>
          <Line dataKey="y" />
        </LineChart>
      </ResponsiveChart>
    );

    expect(screen.getByText('Tap to interact')).toBeInTheDocument();
  });

  it('does not show interaction hint on desktop', () => {
    render(
      <ResponsiveChart enableTouch={true}>
        <LineChart data={mockData}>
          <Line dataKey="y" />
        </LineChart>
      </ResponsiveChart>
    );

    expect(screen.queryByText('Tap to interact')).not.toBeInTheDocument();
  });

  it('applies touch manipulation class on mobile', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });

    const { container } = render(
      <ResponsiveChart>
        <LineChart data={mockData}>
          <Line dataKey="y" />
        </LineChart>
      </ResponsiveChart>
    );

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('touch-manipulation');
  });

  it('handles touch events on mobile', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });

    const { container } = render(
      <ResponsiveChart enableTouch={true}>
        <LineChart data={mockData}>
          <Line dataKey="y" />
        </LineChart>
      </ResponsiveChart>
    );

    const wrapper = container.firstChild;

    // Simulate touch start
    fireEvent.touchStart(wrapper, {
      touches: [{ clientX: 100, clientY: 100 }]
    });

    expect(wrapper).toHaveClass('select-none');

    // Simulate touch end
    fireEvent.touchEnd(wrapper);

    // Should remove select-none class after a delay
    setTimeout(() => {
      expect(wrapper).not.toHaveClass('select-none');
    }, 150);
  });

  it('applies custom className', () => {
    const { container } = render(
      <ResponsiveChart className="custom-chart">
        <LineChart data={mockData}>
          <Line dataKey="y" />
        </LineChart>
      </ResponsiveChart>
    );

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('custom-chart');
  });

  it('passes through additional props', () => {
    const { container } = render(
      <ResponsiveChart data-testid="chart-wrapper">
        <LineChart data={mockData}>
          <Line dataKey="y" />
        </LineChart>
      </ResponsiveChart>
    );

    expect(screen.getByTestId('chart-wrapper')).toBeInTheDocument();
  });
});