import { useState, useMemo, useCallback } from 'react'

/**
 * Expected Shortfall Tutorial Hook
 * 
 * Manages state and calculations for the Expected Shortfall tutorial,
 * providing interactive parameter controls and real-time VaR/ES calculations.
 */
export const useExpectedShortfall = () => {
  // Tutorial parameters state
  const [parameters, setParameters] = useState({
    confidenceLevel: 0.95,
    portfolioVolatility: 0.15,
    expectedReturn: 0.08,
    timeHorizon: 1 // days
  })

  // Derived calculations
  const calculations = useMemo(() => {
    const { confidenceLevel, portfolioVolatility, expectedReturn, timeHorizon } = parameters
    
    // Assuming normal distribution for simplicity
    // In practice, you might use historical simulation or Monte Carlo
    const dailyVolatility = portfolioVolatility / Math.sqrt(252) // Annualized to daily
    const dailyReturn = expectedReturn / 252 // Annualized to daily
    
    // Z-score for the confidence level
    const zScore = getZScore(confidenceLevel)
    
    // VaR calculation (negative because it represents a loss)
    const varValue = -(dailyReturn - zScore * dailyVolatility) * 100 // Convert to percentage
    
    // Expected Shortfall calculation
    // ES = μ - σ * φ(Φ^(-1)(α)) / (1-α)
    // Where φ is PDF and Φ is CDF of standard normal
    const alpha = 1 - confidenceLevel
    const phi = normalPDF(zScore) // PDF at z-score
    const esValue = -(dailyReturn - (dailyVolatility * phi / alpha)) * 100 // Convert to percentage
    
    return {
      varValue,
      esValue,
      dailyVolatility: dailyVolatility * 100,
      dailyReturn: dailyReturn * 100,
      zScore,
      alpha
    }
  }, [parameters])

  // Chart data generation
  const chartData = useMemo(() => {
    const { confidenceLevel, portfolioVolatility } = parameters
    const { varValue, esValue } = calculations
    
    // Generate normal distribution data
    const returnsDistribution = []
    const returnsDistributionWithTail = []
    const mean = 0 // Centered at 0 for simplicity
    const std = portfolioVolatility / Math.sqrt(252) * 100 // Daily volatility as percentage
    
    for (let x = -10; x <= 10; x += 0.1) {
      const density = normalPDF((x - mean) / std) / std
      const isTail = x <= varValue
      
      returnsDistribution.push({
        return: x,
        density,
        varLine: x === Math.round(varValue * 10) / 10 ? density : null
      })
      
      returnsDistributionWithTail.push({
        return: x,
        density,
        tailDensity: isTail ? density : 0
      })
    }

    // Subadditivity demonstration data
    const subadditivityData = [
      {
        name: 'Asset A',
        VaR: 2.5,
        ES: 3.2
      },
      {
        name: 'Asset B', 
        VaR: 3.1,
        ES: 4.0
      },
      {
        name: 'A + B (Sum)',
        VaR: 5.6, // Sum of individual VaRs
        ES: 7.2  // Sum of individual ESs
      },
      {
        name: 'Portfolio A+B',
        VaR: 4.2, // Actual portfolio VaR (could be higher due to correlation)
        ES: 5.8  // Actual portfolio ES (should be lower due to diversification)
      }
    ]

    return {
      returnsDistribution,
      returnsDistributionWithTail,
      subadditivityData
    }
  }, [parameters, calculations])

  // Parameter update function
  const updateParameter = useCallback((key, value) => {
    setParameters(prev => ({
      ...prev,
      [key]: value
    }))
  }, [])

  // Reset parameters to defaults
  const resetParameters = useCallback(() => {
    setParameters({
      confidenceLevel: 0.95,
      portfolioVolatility: 0.15,
      expectedReturn: 0.08,
      timeHorizon: 1
    })
  }, [])

  // Batch parameter update
  const updateParameters = useCallback((newParams) => {
    setParameters(prev => ({
      ...prev,
      ...newParams
    }))
  }, [])

  return {
    // State
    parameters: {
      ...parameters,
      ...calculations
    },
    
    // Chart data
    chartData,
    
    // Actions
    updateParameter,
    updateParameters,
    resetParameters,
    
    // Computed values
    calculations,
    
    // Validation
    isValid: calculations.varValue > 0 && calculations.esValue > calculations.varValue
  }
}

// Helper functions
function getZScore(confidenceLevel) {
  // Approximate inverse normal CDF for common confidence levels
  const zScores = {
    0.90: 1.282,
    0.95: 1.645,
    0.99: 2.326
  }
  
  return zScores[confidenceLevel] || 1.645 // Default to 95%
}

function normalPDF(x) {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI)
}

export default useExpectedShortfall