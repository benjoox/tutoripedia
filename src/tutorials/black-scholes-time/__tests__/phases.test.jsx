import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import {
  IntroductionPhase,
  StockPriceEvolutionPhase,
  LebesgueIntegralPhase,
  VolatilityImpactPhase,
  blackScholesTimePhases
} from '../phases'

// Mock the chart components to avoid rendering issues in tests
vi.mock('recharts', () => ({
  LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
  AreaChart: ({ children }) => <div data-testid="area-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  Area: () => <div data-testid="area" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>
}))

// Mock tutorial hook data
const mockTutorialHook = () => ({
  parameters: {
    timeToMaturity: 90,
    stockPrice: 100,
    strikePrice: 100,
    volatility: 0.2,
    riskFreeRate: 0.05
  },
  calculations: {
    discountFactor: 0.9877,
    optionPrice: 8.45,
    intrinsicValue: 0,
    timeValue: 8.45,
    timeInYears: 0.247
  },
  chartData: {
    discountFactorData: [
      { days: 1, time: 0.003, discountFactor: 0.9999 },
      { days: 90, time: 0.247, discountFactor: 0.9877 }
    ],
    optionPriceData: [
      { days: 1, time: 0.003, optionPrice: 0.5 },
      { days: 90, time: 0.247, optionPrice: 8.45 }
    ],
    volatilityPriceData: [
      { volatility: 5, optionPrice: 2.1 },
      { volatility: 20, optionPrice: 8.45 }
    ],
    stockPricePDF: [
      { w: -2, ST: 80, density: 0.1, normalizedDensity: 10 },
      { w: 0, ST: 100, density: 0.2, normalizedDensity: 20 },
      { w: 2, ST: 120, density: 0.1, normalizedDensity: 10 }
    ]
  }
})

describe('Black-Scholes Time Phases', () => {
  describe('IntroductionPhase', () => {
    it('should render introduction content', () => {
      render(<IntroductionPhase tutorialHook={mockTutorialHook} />)
      
      expect(screen.getByText(/Risk-Neutral Pricing and Why is it Important/)).toBeInTheDocument()
      expect(screen.getByText(/V = e/)).toBeInTheDocument()
      expect(screen.getByText(/V - Option Price/)).toBeInTheDocument()
      expect(screen.getByText(/Discount Factor/)).toBeInTheDocument()
      expect(screen.getByText(/Risk-Neutral Expectation/)).toBeInTheDocument()
    })

    it('should display variable explanations', () => {
      render(<IntroductionPhase tutorialHook={mockTutorialHook} />)
      
      expect(screen.getByText(/V - Option Price/)).toBeInTheDocument()
      expect(screen.getByText(/Discount Factor/)).toBeInTheDocument()
      expect(screen.getByText(/Risk-Neutral Expectation/)).toBeInTheDocument()
      expect(screen.getByText(/Payoff Function/)).toBeInTheDocument()
      expect(screen.getByText(/Risk-Free Rate/)).toBeInTheDocument()
      expect(screen.getByText(/T - Time to Maturity/)).toBeInTheDocument()
    })

    it('should explain the importance of time', () => {
      render(<IntroductionPhase tutorialHook={mockTutorialHook} />)
      
      expect(screen.getByText(/Why T is Important/)).toBeInTheDocument()
      expect(screen.getByText(/Discounting/)).toBeInTheDocument()
      expect(screen.getByText(/Uncertainty/)).toBeInTheDocument()
    })
  })

  describe('StockPriceEvolutionPhase', () => {
    it('should render stock price evolution content', () => {
      render(<StockPriceEvolutionPhase tutorialHook={mockTutorialHook} />)
      
      expect(screen.getByText(/Geometric Brownian Motion/)).toBeInTheDocument()
      expect(screen.getByText(/Distribution of Stock Price at Expiration/)).toBeInTheDocument()
      expect(screen.getByText(/currently 90 days/)).toBeInTheDocument()
    })

    it('should display mathematical formulas', () => {
      render(<StockPriceEvolutionPhase tutorialHook={mockTutorialHook} />)
      
      expect(screen.getByText(/dS/)).toBeInTheDocument()
      expect(screen.getByText(/rS/)).toBeInTheDocument()
      expect(screen.getByText(/σS/)).toBeInTheDocument()
    })

    it('should render chart for stock price distribution', () => {
      render(<StockPriceEvolutionPhase tutorialHook={mockTutorialHook} />)
      
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument()
      expect(screen.getByTestId('area-chart')).toBeInTheDocument()
    })

    it('should display key insights', () => {
      render(<StockPriceEvolutionPhase tutorialHook={mockTutorialHook} />)
      
      expect(screen.getByText(/Key Insight/)).toBeInTheDocument()
      expect(screen.getByText(/distribution becomes wider and flatter/)).toBeInTheDocument()
      expect(screen.getByText(/Current Setting/)).toBeInTheDocument()
    })
  })

  describe('LebesgueIntegralPhase', () => {
    it('should render Lebesgue integral content', () => {
      render(<LebesgueIntegralPhase tutorialHook={mockTutorialHook} />)
      
      expect(screen.getByText(/Lebesgue integral/)).toBeInTheDocument()
      expect(screen.getByText(/Complete Option Price Analysis/)).toBeInTheDocument()
      expect(screen.getByText(/currently 90 days to expiration/)).toBeInTheDocument()
    })

    it('should display integral formula', () => {
      render(<LebesgueIntegralPhase tutorialHook={mockTutorialHook} />)
      
      expect(screen.getAllByText(/𝔼/).length).toBeGreaterThan(0)
      expect(screen.getByText(/∫/)).toBeInTheDocument()
    })

    it('should render option price chart', () => {
      render(<LebesgueIntegralPhase tutorialHook={mockTutorialHook} />)
      
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument()
      expect(screen.getByTestId('line-chart')).toBeInTheDocument()
    })

    it('should display mathematical insights', () => {
      render(<LebesgueIntegralPhase tutorialHook={mockTutorialHook} />)
      
      expect(screen.getByText(/Mathematical Insight/)).toBeInTheDocument()
      expect(screen.getByText(/non-linear in T/)).toBeInTheDocument()
      expect(screen.getByText(/Current Analysis/)).toBeInTheDocument()
      expect(screen.getByText(/worth \$8.45/)).toBeInTheDocument()
    })
  })

  describe('VolatilityImpactPhase', () => {
    it('should render volatility impact content', () => {
      render(<VolatilityImpactPhase tutorialHook={mockTutorialHook} />)
      
      expect(screen.getByText(/What is Volatility and Why is it Important/)).toBeInTheDocument()
      expect(screen.getByText(/Volatility's Role in Stock Price Evolution/)).toBeInTheDocument()
      expect(screen.getByText(/currently 20.0%/)).toBeInTheDocument()
    })

    it('should display volatility explanation', () => {
      render(<VolatilityImpactPhase tutorialHook={mockTutorialHook} />)
      
      expect(screen.getByText(/degree of variation/)).toBeInTheDocument()
      expect(screen.getByText(/standard deviation of logarithmic returns/)).toBeInTheDocument()
      expect(screen.getByText(/key determinant of price/)).toBeInTheDocument()
    })

    it('should render both distribution and price charts', () => {
      render(<VolatilityImpactPhase tutorialHook={mockTutorialHook} />)
      
      const containers = screen.getAllByTestId('responsive-container')
      expect(containers).toHaveLength(2)
      
      expect(screen.getByTestId('area-chart')).toBeInTheDocument()
      expect(screen.getByTestId('line-chart')).toBeInTheDocument()
    })

    it('should display volatility insights', () => {
      render(<VolatilityImpactPhase tutorialHook={mockTutorialHook} />)
      
      expect(screen.getAllByText(/convex/).length).toBeGreaterThan(0)
      expect(screen.getByText(/asymmetry/)).toBeInTheDocument()
      expect(screen.getByText(/At 20.0% volatility/)).toBeInTheDocument()
    })
  })

  describe('Phase Definitions', () => {
    it('should have correct number of phases', () => {
      expect(blackScholesTimePhases).toHaveLength(4)
    })

    it('should have valid phase structure', () => {
      blackScholesTimePhases.forEach(phase => {
        expect(phase).toHaveProperty('id')
        expect(phase).toHaveProperty('title')
        expect(phase).toHaveProperty('icon')
        expect(phase).toHaveProperty('shortTitle')
        expect(phase).toHaveProperty('content')
        
        expect(typeof phase.id).toBe('string')
        expect(typeof phase.title).toBe('string')
        expect(typeof phase.shortTitle).toBe('string')
        expect(typeof phase.content).toBe('function')
      })
    })

    it('should have unique phase IDs', () => {
      const ids = blackScholesTimePhases.map(phase => phase.id)
      const uniqueIds = [...new Set(ids)]
      expect(ids).toHaveLength(uniqueIds.length)
    })

    it('should have expected phase IDs', () => {
      const expectedIds = ['introduction', 'stock-price-evolution', 'lebesgue-integral', 'volatility-impact']
      const actualIds = blackScholesTimePhases.map(phase => phase.id)
      
      expectedIds.forEach(id => {
        expect(actualIds).toContain(id)
      })
    })

    it('should have reasonable short titles', () => {
      blackScholesTimePhases.forEach(phase => {
        expect(phase.shortTitle.length).toBeLessThan(20)
        expect(phase.shortTitle.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Phase Component Integration', () => {
    it('should render all phases without errors', () => {
      blackScholesTimePhases.forEach(phase => {
        const PhaseComponent = phase.content
        expect(() => {
          render(<PhaseComponent tutorialHook={mockTutorialHook} />)
        }).not.toThrow()
      })
    })

    it('should use tutorial hook data in all phases', () => {
      blackScholesTimePhases.forEach(phase => {
        const PhaseComponent = phase.content
        const { container, unmount } = render(<PhaseComponent tutorialHook={mockTutorialHook} />)
        
        // Each phase should render content successfully
        expect(container.firstChild).toBeTruthy()
        expect(container.textContent.length).toBeGreaterThan(0)
        
        unmount() // Clean up between renders
      })
    })
  })

  describe('Responsive Design', () => {
    it('should use responsive containers for charts', () => {
      render(<StockPriceEvolutionPhase tutorialHook={mockTutorialHook} />)
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument()
    })

    it('should use grid layouts for variable explanations', () => {
      render(<IntroductionPhase tutorialHook={mockTutorialHook} />)
      
      // Check for grid classes in the DOM
      const gridElement = screen.getByText(/V - Option Price/).closest('.grid')
      expect(gridElement).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(<IntroductionPhase tutorialHook={mockTutorialHook} />)
      
      const headings = screen.getAllByRole('heading')
      expect(headings.length).toBeGreaterThan(0)
    })

    it('should have descriptive chart titles', () => {
      render(<StockPriceEvolutionPhase tutorialHook={mockTutorialHook} />)
      
      expect(screen.getByText(/Distribution of Stock Price at Expiration/)).toBeInTheDocument()
    })

    it('should have informative card descriptions', () => {
      render(<LebesgueIntegralPhase tutorialHook={mockTutorialHook} />)
      
      expect(screen.getByText(/See how all components come together/)).toBeInTheDocument()
    })
  })
})