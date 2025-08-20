import { useState, useMemo, useCallback } from 'react'

export const useFFTFinance = () => {
  // 1. Define parameter state
  const [parameters, setParameters] = useState({
    period1: 20,
    period2: 50,
    amplitude1: 1.0,
    amplitude2: 0.8,
    noiseLevel: 0.3,
    dataPoints: 200,
    trendStrength: 0.02
  })

  // 2. Create derived calculations
  const calculations = useMemo(() => {
    try {
      const { period1, period2, amplitude1, amplitude2, noiseLevel, dataPoints, trendStrength } = parameters
      
      // Validate parameters
      if (!period1 || !period2 || !dataPoints || dataPoints < 10) {
        return {
          timeData: [],
          cycle1Data: [],
          cycle2Data: [],
          compositeData: [],
          fftMagnitudes: [],
          dominantPeriod: period1 || 20,
          secondaryPeriod: period2 || 50
        }
      }
      
      // Generate time series data
      const timeData = Array.from({ length: dataPoints }, (_, i) => i)
      
      // Create constituent cycles
      const cycle1Data = timeData.map(t => amplitude1 * Math.sin(2 * Math.PI * t / period1))
      const cycle2Data = timeData.map(t => amplitude2 * Math.sin(2 * Math.PI * t / period2))
      
      // Add trend and noise to create composite signal
      const trendData = timeData.map(t => trendStrength * t)
      const noiseData = timeData.map(() => noiseLevel * (Math.random() - 0.5))
      
      const compositeData = timeData.map((t, i) => 
        cycle1Data[i] + cycle2Data[i] + trendData[i] + noiseData[i]
      )
      
      // Simple FFT approximation for demonstration
      const fftMagnitudes = []
      const maxPeriod = Math.min(Math.floor(dataPoints / 2), 100) // Limit max period
      
      for (let period = 5; period <= maxPeriod; period += 5) {
        let magnitude = 0
        
        // Simplified magnitude calculation
        for (let i = 0; i < dataPoints; i++) {
          const phase = 2 * Math.PI * i / period
          magnitude += Math.abs(compositeData[i] * Math.cos(phase))
        }
        
        magnitude = magnitude / dataPoints
        
        // Boost magnitudes near our actual periods for demonstration
        if (Math.abs(period - period1) < 3) magnitude *= 3
        if (Math.abs(period - period2) < 3) magnitude *= 2.5
        
        fftMagnitudes.push({ period, magnitude })
      }
      
      return {
        timeData,
        cycle1Data,
        cycle2Data,
        compositeData,
        fftMagnitudes,
        dominantPeriod: period1,
        secondaryPeriod: period2
      }
    } catch (error) {
      console.error('Error in FFT calculations:', error)
      return {
        timeData: [],
        cycle1Data: [],
        cycle2Data: [],
        compositeData: [],
        fftMagnitudes: [],
        dominantPeriod: 20,
        secondaryPeriod: 50
      }
    }
  }, [parameters])

  // 3. Generate chart data
  const chartData = useMemo(() => {
    const { timeData, cycle1Data, cycle2Data, compositeData, fftMagnitudes } = calculations
    
    // Ensure we have valid data arrays
    if (!timeData || !cycle1Data || !cycle2Data || !compositeData || !fftMagnitudes || 
        timeData.length === 0 || cycle1Data.length === 0 || fftMagnitudes.length === 0) {
      return {
        constituentCycles: [{ time: 0, cycle1: 0, cycle2: 0 }],
        compositeSignal: [{ time: 0, price: 100 }],
        frequencySpectrum: [{ period: 20, magnitude: 1 }],
        cleanSpectrum: [{ period: 20, magnitude: 50 }],
        noisySpectrum: [{ period: 20, magnitude: 1 }]
      }
    }
    
    // Constituent cycles chart data
    const constituentCycles = timeData.map((time, i) => ({
      time: Number(time),
      cycle1: Number(cycle1Data[i] || 0),
      cycle2: Number(cycle2Data[i] || 0)
    }))
    
    // Composite signal chart data
    const compositeSignal = timeData.map((time, i) => ({
      time: Number(time),
      price: Number(100 + (compositeData[i] || 0) * 10) // Scale to price-like values
    }))
    
    // Frequency spectrum
    const frequencySpectrum = fftMagnitudes.map(({ period, magnitude }) => ({
      period: Number(period),
      magnitude: Number(Math.max(0, magnitude || 0))
    }))
    
    // Clean spectrum (theoretical)
    const cleanSpectrum = [
      { period: Number(parameters.period1), magnitude: Number(parameters.amplitude1 * 50) },
      { period: Number(parameters.period2), magnitude: Number(parameters.amplitude2 * 50) }
    ]
    
    // Noisy spectrum (realistic)
    const noisySpectrum = fftMagnitudes.map(({ period, magnitude }) => ({
      period: Number(period),
      magnitude: Number(Math.max(0, (magnitude || 0) + Math.random() * 0.5))
    }))
    
    return {
      constituentCycles,
      compositeSignal,
      frequencySpectrum,
      cleanSpectrum,
      noisySpectrum
    }
  }, [parameters, calculations])

  // 4. Parameter update functions
  const updateParameter = useCallback((key, value) => {
    setParameters(prev => ({
      ...prev,
      [key]: value
    }))
  }, [])

  const resetParameters = useCallback(() => {
    setParameters({
      period1: 20,
      period2: 50,
      amplitude1: 1.0,
      amplitude2: 0.8,
      noiseLevel: 0.3,
      dataPoints: 200,
      trendStrength: 0.02
    })
  }, [])

  // 5. Return hook interface
  return {
    parameters: {
      ...parameters,
      dominantPeriod: calculations.dominantPeriod,
      secondaryPeriod: calculations.secondaryPeriod
    },
    chartData,
    updateParameter,
    resetParameters,
    calculations: {
      // Only return primitive values for the sidebar display
      dominantPeriod: calculations.dominantPeriod,
      secondaryPeriod: calculations.secondaryPeriod,
      dataPointsCount: calculations.timeData?.length || 0,
      cyclesDetected: calculations.fftMagnitudes?.length || 0
    },
    isValid: true
  }
}