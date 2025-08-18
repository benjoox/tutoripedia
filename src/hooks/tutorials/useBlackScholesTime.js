import { useState, useMemo, useCallback } from 'react'

/**
 * Custom hook for Black-Scholes time-to-maturity calculations
 * Provides memoized calculations and chart data generation
 */
export const useBlackScholesTime = (initialParams = {}) => {
  const [parameters, setParameters] = useState({
    timeToMaturity: 90, // days
    stockPrice: 100,
    strikePrice: 100,
    riskFreeRate: 0.05,
    volatility: 0.2,
    ...initialParams
  })

  // Convert days to years for calculations
  const timeInYears = useMemo(() => parameters.timeToMaturity / 365, [parameters.timeToMaturity])

  // Mathematical utility functions
  const calculateDiscountFactor = useCallback((r, T) => {
    return Math.exp(-r * T)
  }, [])

  const calculateCallOptionPrice = useCallback((S0, K, r, sigma, T) => {
    if (T <= 0) return Math.max(S0 - K, 0) // Intrinsic value at expiration
    
    // Black-Scholes formula for call option
    const d1 = (Math.log(S0 / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T))
    const d2 = d1 - sigma * Math.sqrt(T)
    
    // Normal CDF approximation using error function
    const normalCDF = (x) => {
      return 0.5 * (1 + erf(x / Math.sqrt(2)))
    }
    
    const erf = (x) => {
      // Abramowitz and Stegun approximation
      const a1 =  0.254829592
      const a2 = -0.284496736
      const a3 =  1.421413741
      const a4 = -1.453152027
      const a5 =  1.061405429
      const p  =  0.3275911
      
      const sign = x >= 0 ? 1 : -1
      x = Math.abs(x)
      
      const t = 1.0 / (1.0 + p * x)
      const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)
      
      return sign * y
    }
    
    const callPrice = S0 * normalCDF(d1) - K * Math.exp(-r * T) * normalCDF(d2)
    return Math.max(callPrice, 0)
  }, [])

  const calculateStockPricePDF = useCallback((S0, r, sigma, T) => {
    const points = []
    const numPoints = 200
    const minW = -4
    const maxW = 4
    const step = (maxW - minW) / numPoints
    
    for (let i = 0; i <= numPoints; i++) {
      const w = minW + i * step
      const ST = S0 * Math.exp((r - 0.5 * sigma * sigma) * T + sigma * w)
      const density = (1 / Math.sqrt(2 * Math.PI * T)) * Math.exp(-(w * w) / (2 * T))
      points.push({
        w: w,
        ST: ST,
        density: density,
        normalizedDensity: density * 100 // Scale for better visualization
      })
    }
    return points
  }, [])

  // Memoized calculations for performance
  const calculations = useMemo(() => {
    const discountFactor = calculateDiscountFactor(parameters.riskFreeRate, timeInYears)
    const optionPrice = calculateCallOptionPrice(
      parameters.stockPrice,
      parameters.strikePrice,
      parameters.riskFreeRate,
      parameters.volatility,
      timeInYears
    )
    const intrinsicValue = Math.max(parameters.stockPrice - parameters.strikePrice, 0)
    const timeValue = optionPrice - intrinsicValue

    return {
      discountFactor,
      optionPrice,
      intrinsicValue,
      timeValue,
      timeInYears
    }
  }, [parameters, timeInYears, calculateDiscountFactor, calculateCallOptionPrice])

  // Chart data generation functions
  const chartData = useMemo(() => {
    // Discount factor data over time
    const discountFactorData = []
    for (let days = 1; days <= 730; days += 5) { // Up to 2 years in days
      const t = days / 365
      discountFactorData.push({
        days: days,
        time: t,
        discountFactor: calculateDiscountFactor(parameters.riskFreeRate, t)
      })
    }

    // Option price data over time
    const optionPriceData = []
    for (let days = 1; days <= 730; days += 5) { // Up to 2 years in days
      const t = days / 365
      optionPriceData.push({
        days: days,
        time: t,
        optionPrice: calculateCallOptionPrice(
          parameters.stockPrice,
          parameters.strikePrice,
          parameters.riskFreeRate,
          parameters.volatility,
          t
        )
      })
    }

    // Option price vs volatility data
    const volatilityPriceData = []
    for (let vol = 0.05; vol <= 0.8; vol += 0.01) {
      volatilityPriceData.push({
        volatility: vol * 100, // Convert to percentage for display
        optionPrice: calculateCallOptionPrice(
          parameters.stockPrice,
          parameters.strikePrice,
          parameters.riskFreeRate,
          vol,
          timeInYears
        )
      })
    }

    // Stock price probability distribution
    const stockPricePDF = calculateStockPricePDF(
      parameters.stockPrice,
      parameters.riskFreeRate,
      parameters.volatility,
      timeInYears
    )

    return {
      discountFactorData,
      optionPriceData,
      volatilityPriceData,
      stockPricePDF
    }
  }, [parameters, timeInYears, calculateDiscountFactor, calculateCallOptionPrice, calculateStockPricePDF])

  // Parameter update function with immediate recalculation
  const updateParameter = useCallback((key, value) => {
    setParameters(prev => ({ ...prev, [key]: value }))
  }, [])

  // Batch parameter updates
  const updateParameters = useCallback((updates) => {
    setParameters(prev => ({ ...prev, ...updates }))
  }, [])

  // Reset to default parameters
  const resetParameters = useCallback(() => {
    setParameters({
      timeToMaturity: 90,
      stockPrice: 100,
      strikePrice: 100,
      riskFreeRate: 0.05,
      volatility: 0.2
    })
  }, [])

  return {
    parameters,
    calculations,
    chartData,
    updateParameter,
    updateParameters,
    resetParameters
  }
}