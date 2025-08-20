import { useState, useMemo, useCallback } from 'react'

export const useHurstExponent = () => {
  // 1. Define parameter state
  const [parameters, setParameters] = useState({
    H: 0.5,
    seriesLength: 252,
    volatility: 0.2,
    seed: 42
  })

  // 2. Create derived calculations
  const calculations = useMemo(() => {
    const classification = parameters.H < 0.5 
      ? 'Mean-Reverting' 
      : parameters.H > 0.5 
        ? 'Trending' 
        : 'Random Walk'
    
    const memoryStrength = Math.abs(parameters.H - 0.5) * 2
    const predictability = parameters.H === 0.5 ? 'None' : 
      parameters.H < 0.5 ? 'Reverting' : 'Persistent'
    
    return {
      classification,
      memoryStrength,
      predictability,
      riskProfile: parameters.H > 0.5 ? 'Higher tail risk' : 
        parameters.H < 0.5 ? 'Lower tail risk' : 'Normal risk'
    }
  }, [parameters])

  // 3. Generate chart data
  const chartData = useMemo(() => {
    const generateFractionalBrownianMotion = (H, length, vol, seed) => {
      // Simple approximation of fractional Brownian motion
      const data = []
      let price = 100
      
      // Use seed for reproducible results
      let random = seed
      const nextRandom = () => {
        random = (random * 9301 + 49297) % 233280
        return random / 233280
      }
      
      for (let i = 0; i < length; i++) {
        const gaussianRandom = Math.sqrt(-2 * Math.log(nextRandom())) * 
          Math.cos(2 * Math.PI * nextRandom())
        
        // Adjust the increment based on H
        const increment = vol * gaussianRandom * Math.pow(i + 1, H - 0.5) / 10
        price += increment
        
        data.push({
          time: i,
          price: price,
          return: i > 0 ? (price - data[i-1].price) / data[i-1].price : 0
        })
      }
      return data
    }

    // Generate different series for comparison
    const meanRevertingSeries = generateFractionalBrownianMotion(0.3, 100, 0.15, 123)
    const randomWalkSeries = generateFractionalBrownianMotion(0.5, 100, 0.15, 456)
    const trendingSeries = generateFractionalBrownianMotion(0.7, 100, 0.15, 789)
    
    // Interactive series based on current H parameter
    const interactiveSeries = generateFractionalBrownianMotion(
      parameters.H, 
      parameters.seriesLength, 
      parameters.volatility, 
      parameters.seed
    )

    // Distribution comparison data
    const distributionComparison = []
    for (let i = -4; i <= 4; i += 0.1) {
      const x = i
      const randomWalkProb = Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI)
      const trendingProb = Math.exp(-0.3 * x * x) / Math.sqrt(2 * Math.PI / 0.3)
      
      distributionComparison.push({
        return: x.toFixed(1),
        randomWalk: randomWalkProb,
        trending: trendingProb
      })
    }
    
    return {
      meanRevertingSeries,
      randomWalkSeries,
      trendingSeries,
      interactiveSeries,
      distributionComparison
    }
  }, [parameters])

  // 4. Parameter update functions
  const updateParameter = useCallback((key, value) => {
    setParameters(prev => ({
      ...prev,
      [key]: value
    }))
  }, [])

  const resetParameters = useCallback(() => {
    setParameters({
      H: 0.5,
      seriesLength: 252,
      volatility: 0.2,
      seed: 42
    })
  }, [])

  // 5. Return hook interface
  return {
    parameters: {
      ...parameters,
      ...calculations
    },
    chartData,
    updateParameter,
    resetParameters,
    calculations,
    isValid: true
  }
}