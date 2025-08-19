import { useState, useMemo, useCallback } from 'react'

/**
 * Kelly Criterion Tutorial Hook
 * 
 * Manages state and calculations for the Kelly Criterion tutorial,
 * providing interactive parameter controls and real-time calculations.
 */
export const useKellyCriterion = () => {
  // Tutorial parameters state
  const [parameters, setParameters] = useState({
    probabilityOfWinning: 0.6,
    winLossRatio: 2.0,
    initialBankroll: 1000,
    numberOfBets: 100
  })

  // Derived calculations
  const calculations = useMemo(() => {
    const { probabilityOfWinning, winLossRatio } = parameters
    const probabilityOfLosing = 1 - probabilityOfWinning
    
    // Kelly Criterion formula: f* = p - q/b
    // where p = probability of winning, q = probability of losing, b = win/loss ratio
    const kellyPercentage = Math.max(0, probabilityOfWinning - (probabilityOfLosing / winLossRatio))
    
    // Expected value of the bet
    const expectedValue = (probabilityOfWinning * winLossRatio) - probabilityOfLosing
    
    // Growth rate calculation (logarithmic utility)
    const growthRate = probabilityOfWinning * Math.log(1 + kellyPercentage * winLossRatio) + 
                      probabilityOfLosing * Math.log(1 - kellyPercentage)
    
    return {
      kellyPercentage: kellyPercentage * 100, // Convert to percentage
      expectedValue,
      growthRate,
      probabilityOfLosing
    }
  }, [parameters])

  // Chart data generation
  const chartData = useMemo(() => {
    const { probabilityOfWinning, winLossRatio, initialBankroll, numberOfBets } = parameters
    const { kellyPercentage } = calculations
    
    // Growth Rate vs Bet Size chart data
    const growthRateVsBetSize = []
    for (let betSize = 0; betSize <= 50; betSize += 1) {
      const f = betSize / 100 // Convert percentage to fraction
      const growthRate = probabilityOfWinning * Math.log(1 + f * winLossRatio) + 
                        (1 - probabilityOfWinning) * Math.log(Math.max(0.001, 1 - f))
      
      growthRateVsBetSize.push({
        betSize,
        growthRate: isFinite(growthRate) ? growthRate : -10
      })
    }

    // Bankroll Growth Simulation
    const bankrollGrowth = []
    let kellyBankroll = initialBankroll
    let halfKellyBankroll = initialBankroll
    let overBetBankroll = initialBankroll
    
    const kellyFraction = kellyPercentage / 100
    const halfKellyFraction = kellyFraction / 2
    const overBetFraction = Math.min(kellyFraction * 1.5, 0.5) // Cap at 50%
    
    bankrollGrowth.push({
      betNumber: 0,
      kelly: kellyBankroll,
      halfKelly: halfKellyBankroll,
      overBet: overBetBankroll
    })

    for (let bet = 1; bet <= numberOfBets; bet++) {
      // Simulate random outcomes
      const outcome = Math.random() < probabilityOfWinning
      
      if (outcome) {
        // Win
        kellyBankroll += kellyBankroll * kellyFraction * winLossRatio
        halfKellyBankroll += halfKellyBankroll * halfKellyFraction * winLossRatio
        overBetBankroll += overBetBankroll * overBetFraction * winLossRatio
      } else {
        // Loss
        kellyBankroll -= kellyBankroll * kellyFraction
        halfKellyBankroll -= halfKellyBankroll * halfKellyFraction
        overBetBankroll -= overBetBankroll * overBetFraction
      }
      
      // Prevent negative bankrolls
      kellyBankroll = Math.max(0, kellyBankroll)
      halfKellyBankroll = Math.max(0, halfKellyBankroll)
      overBetBankroll = Math.max(0, overBetBankroll)
      
      bankrollGrowth.push({
        betNumber: bet,
        kelly: Math.round(kellyBankroll),
        halfKelly: Math.round(halfKellyBankroll),
        overBet: Math.round(overBetBankroll)
      })
    }

    // Fractional Kelly Analysis
    const fractionalKelly = []
    const fractions = [0.25, 0.5, 0.75, 1.0]
    
    fractions.forEach(fraction => {
      const f = kellyFraction * fraction
      const growthRate = probabilityOfWinning * Math.log(1 + f * winLossRatio) + 
                        (1 - probabilityOfWinning) * Math.log(Math.max(0.001, 1 - f))
      
      // Simplified volatility calculation (standard deviation approximation)
      const variance = probabilityOfWinning * Math.pow(f * winLossRatio, 2) + 
                      (1 - probabilityOfWinning) * Math.pow(-f, 2) - 
                      Math.pow(probabilityOfWinning * f * winLossRatio - (1 - probabilityOfWinning) * f, 2)
      const volatility = Math.sqrt(Math.max(0, variance))
      
      fractionalKelly.push({
        fraction: `${fraction * 100}%`,
        growthRate: isFinite(growthRate) ? growthRate : 0,
        volatility: isFinite(volatility) ? volatility : 0
      })
    })

    return {
      growthRateVsBetSize,
      bankrollGrowth,
      fractionalKelly
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
      probabilityOfWinning: 0.6,
      winLossRatio: 2.0,
      initialBankroll: 1000,
      numberOfBets: 100
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
    isValid: calculations.kellyPercentage >= 0 && calculations.kellyPercentage <= 100
  }
}

export default useKellyCriterion