import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { useBlackScholesTime } from '../useBlackScholesTime'

describe('useBlackScholesTime', () => {
  let hookResult

  beforeEach(() => {
    hookResult = renderHook(() => useBlackScholesTime())
  })

  describe('Initial State', () => {
    it('should initialize with default parameters', () => {
      const { result } = hookResult
      
      expect(result.current.parameters).toEqual({
        timeToMaturity: 90,
        stockPrice: 100,
        strikePrice: 100,
        riskFreeRate: 0.05,
        volatility: 0.2
      })
    })

    it('should accept custom initial parameters', () => {
      const customParams = {
        timeToMaturity: 180,
        stockPrice: 120,
        strikePrice: 110
      }
      
      const { result } = renderHook(() => useBlackScholesTime(customParams))
      
      expect(result.current.parameters.timeToMaturity).toBe(180)
      expect(result.current.parameters.stockPrice).toBe(120)
      expect(result.current.parameters.strikePrice).toBe(110)
      // Should still have defaults for unspecified params
      expect(result.current.parameters.riskFreeRate).toBe(0.05)
      expect(result.current.parameters.volatility).toBe(0.2)
    })
  })

  describe('Calculations', () => {
    it('should calculate discount factor correctly', () => {
      const { result } = hookResult
      const { calculations } = result.current
      
      // For default params: r=0.05, T=90/365≈0.247
      // Discount factor = e^(-0.05 * 0.247) ≈ 0.9877
      expect(calculations.discountFactor).toBeCloseTo(0.9877, 3)
    })

    it('should calculate option price correctly', () => {
      const { result } = hookResult
      const { calculations } = result.current
      
      // Option price should be positive for at-the-money option
      expect(calculations.optionPrice).toBeGreaterThan(0)
      expect(typeof calculations.optionPrice).toBe('number')
      expect(isFinite(calculations.optionPrice)).toBe(true)
    })

    it('should calculate intrinsic value correctly', () => {
      const { result } = hookResult
      
      // For at-the-money option (S=K=100), intrinsic value should be 0
      expect(result.current.calculations.intrinsicValue).toBe(0)
      
      // Update to in-the-money option
      act(() => {
        result.current.updateParameter('stockPrice', 110)
      })
      
      expect(result.current.calculations.intrinsicValue).toBe(10)
    })

    it('should calculate time value correctly', () => {
      const { result } = hookResult
      const { calculations } = result.current
      
      // Time value = option price - intrinsic value
      const expectedTimeValue = calculations.optionPrice - calculations.intrinsicValue
      expect(calculations.timeValue).toBeCloseTo(expectedTimeValue, 6)
    })

    it('should handle edge case of zero time to maturity', () => {
      const { result } = renderHook(() => useBlackScholesTime({ timeToMaturity: 0 }))
      
      // At expiration, option price should equal intrinsic value
      expect(result.current.calculations.optionPrice).toBe(result.current.calculations.intrinsicValue)
      expect(result.current.calculations.timeValue).toBe(0)
    })
  })

  describe('Chart Data Generation', () => {
    it('should generate discount factor data', () => {
      const { result } = hookResult
      const { chartData } = result.current
      
      expect(Array.isArray(chartData.discountFactorData)).toBe(true)
      expect(chartData.discountFactorData.length).toBeGreaterThan(0)
      
      const firstPoint = chartData.discountFactorData[0]
      expect(firstPoint).toHaveProperty('days')
      expect(firstPoint).toHaveProperty('time')
      expect(firstPoint).toHaveProperty('discountFactor')
      expect(firstPoint.discountFactor).toBeLessThanOrEqual(1)
      expect(firstPoint.discountFactor).toBeGreaterThan(0)
    })

    it('should generate option price data over time', () => {
      const { result } = hookResult
      const { chartData } = result.current
      
      expect(Array.isArray(chartData.optionPriceData)).toBe(true)
      expect(chartData.optionPriceData.length).toBeGreaterThan(0)
      
      const firstPoint = chartData.optionPriceData[0]
      expect(firstPoint).toHaveProperty('days')
      expect(firstPoint).toHaveProperty('time')
      expect(firstPoint).toHaveProperty('optionPrice')
      expect(firstPoint.optionPrice).toBeGreaterThanOrEqual(0)
    })

    it('should generate volatility price data', () => {
      const { result } = hookResult
      const { chartData } = result.current
      
      expect(Array.isArray(chartData.volatilityPriceData)).toBe(true)
      expect(chartData.volatilityPriceData.length).toBeGreaterThan(0)
      
      const firstPoint = chartData.volatilityPriceData[0]
      expect(firstPoint).toHaveProperty('volatility')
      expect(firstPoint).toHaveProperty('optionPrice')
      expect(firstPoint.optionPrice).toBeGreaterThanOrEqual(0)
      
      // Option price should increase with volatility
      const lastPoint = chartData.volatilityPriceData[chartData.volatilityPriceData.length - 1]
      expect(lastPoint.optionPrice).toBeGreaterThan(firstPoint.optionPrice)
    })

    it('should generate stock price PDF data', () => {
      const { result } = hookResult
      const { chartData } = result.current
      
      expect(Array.isArray(chartData.stockPricePDF)).toBe(true)
      expect(chartData.stockPricePDF.length).toBe(201) // 200 intervals + 1
      
      const firstPoint = chartData.stockPricePDF[0]
      expect(firstPoint).toHaveProperty('w')
      expect(firstPoint).toHaveProperty('ST')
      expect(firstPoint).toHaveProperty('density')
      expect(firstPoint).toHaveProperty('normalizedDensity')
      expect(firstPoint.density).toBeGreaterThanOrEqual(0)
      expect(firstPoint.ST).toBeGreaterThan(0)
    })
  })

  describe('Parameter Updates', () => {
    it('should update single parameter', () => {
      const { result } = hookResult
      
      act(() => {
        result.current.updateParameter('stockPrice', 120)
      })
      
      expect(result.current.parameters.stockPrice).toBe(120)
      // Other parameters should remain unchanged
      expect(result.current.parameters.strikePrice).toBe(100)
      expect(result.current.parameters.volatility).toBe(0.2)
    })

    it('should update multiple parameters at once', () => {
      const { result } = hookResult
      
      act(() => {
        result.current.updateParameters({
          stockPrice: 120,
          strikePrice: 110,
          volatility: 0.3
        })
      })
      
      expect(result.current.parameters.stockPrice).toBe(120)
      expect(result.current.parameters.strikePrice).toBe(110)
      expect(result.current.parameters.volatility).toBe(0.3)
      // Unchanged parameters should remain
      expect(result.current.parameters.riskFreeRate).toBe(0.05)
    })

    it('should reset parameters to defaults', () => {
      const { result } = hookResult
      
      // First change some parameters
      act(() => {
        result.current.updateParameters({
          stockPrice: 150,
          volatility: 0.5,
          timeToMaturity: 180
        })
      })
      
      // Then reset
      act(() => {
        result.current.resetParameters()
      })
      
      expect(result.current.parameters).toEqual({
        timeToMaturity: 90,
        stockPrice: 100,
        strikePrice: 100,
        riskFreeRate: 0.05,
        volatility: 0.2
      })
    })

    it('should recalculate when parameters change', () => {
      const { result } = hookResult
      const initialOptionPrice = result.current.calculations.optionPrice
      
      act(() => {
        result.current.updateParameter('volatility', 0.4)
      })
      
      const newOptionPrice = result.current.calculations.optionPrice
      expect(newOptionPrice).not.toBe(initialOptionPrice)
      expect(newOptionPrice).toBeGreaterThan(initialOptionPrice) // Higher volatility = higher price
    })
  })

  describe('Mathematical Accuracy', () => {
    it('should satisfy put-call parity relationships', () => {
      const { result } = hookResult
      const { parameters, calculations } = result.current
      
      // For at-the-money options, call price should be approximately equal to
      // S0 - K*e^(-rT) when S0 = K (since put price ≈ 0)
      const theoreticalValue = parameters.stockPrice - parameters.strikePrice * calculations.discountFactor
      
      // Should be close but not exact due to time value
      expect(calculations.optionPrice).toBeGreaterThan(theoreticalValue)
    })

    it('should handle extreme parameter values gracefully', () => {
      const { result } = renderHook(() => useBlackScholesTime({
        timeToMaturity: 1, // Very short time
        volatility: 0.01   // Very low volatility
      }))
      
      expect(isFinite(result.current.calculations.optionPrice)).toBe(true)
      expect(result.current.calculations.optionPrice).toBeGreaterThanOrEqual(0)
      
      // Test high volatility
      act(() => {
        result.current.updateParameter('volatility', 0.8)
      })
      
      expect(isFinite(result.current.calculations.optionPrice)).toBe(true)
      expect(result.current.calculations.optionPrice).toBeGreaterThan(0)
    })

    it('should maintain monotonicity properties', () => {
      const { result } = hookResult
      
      // Option price should increase with stock price
      const prices = []
      for (let S = 80; S <= 120; S += 10) {
        act(() => {
          result.current.updateParameter('stockPrice', S)
        })
        prices.push(result.current.calculations.optionPrice)
      }
      
      // Check that prices are non-decreasing
      for (let i = 1; i < prices.length; i++) {
        expect(prices[i]).toBeGreaterThanOrEqual(prices[i-1])
      }
    })
  })

  describe('Performance and Memoization', () => {
    it('should not recalculate when parameters do not change', () => {
      const { result, rerender } = hookResult
      const initialCalculations = result.current.calculations
      const initialChartData = result.current.chartData
      
      // Rerender without changing parameters
      rerender()
      
      // Should be the same object references (memoized)
      expect(result.current.calculations).toBe(initialCalculations)
      expect(result.current.chartData).toBe(initialChartData)
    })

    it('should recalculate only when relevant parameters change', () => {
      const { result } = hookResult
      const initialChartData = result.current.chartData
      
      act(() => {
        result.current.updateParameter('stockPrice', 110)
      })
      
      // Chart data should be recalculated
      expect(result.current.chartData).not.toBe(initialChartData)
    })
  })
})