import { useState, useMemo, useCallback } from 'react'

export const useFastFourierTransform = () => {
  // 1. Define parameter state
  const [parameters, setParameters] = useState({
    frequency1: 5,
    frequency2: 15,
    amplitude1: 1,
    amplitude2: 0.5,
    phase1: 0,
    phase2: 0,
    sampleRate: 100,
    duration: 2,
    noiseLevel: 0.1,
    windowFunction: 'none'
  })

  // 2. Create derived calculations
  const calculations = useMemo(() => {
    const { sampleRate, duration } = parameters
    const numSamples = Math.floor(sampleRate * duration)
    const timeStep = 1 / sampleRate
    const frequencyResolution = sampleRate / numSamples
    const nyquistFrequency = sampleRate / 2
    
    return {
      numSamples,
      timeStep,
      frequencyResolution,
      nyquistFrequency,
      maxFrequency: Math.min(50, nyquistFrequency)
    }
  }, [parameters])

  // 3. Generate chart data
  const chartData = useMemo(() => {
    const { 
      frequency1, frequency2, amplitude1, amplitude2, 
      phase1, phase2, sampleRate, duration, noiseLevel, windowFunction 
    } = parameters
    const { numSamples, timeStep } = calculations
    
    // Generate time domain signal
    const timeData = []
    const signal = []
    
    for (let i = 0; i < numSamples; i++) {
      const t = i * timeStep
      const noise = noiseLevel * (Math.random() - 0.5) * 2
      const value = 
        amplitude1 * Math.sin(2 * Math.PI * frequency1 * t + phase1) +
        amplitude2 * Math.sin(2 * Math.PI * frequency2 * t + phase2) +
        noise
      
      timeData.push({
        time: t,
        amplitude: value,
        signal1: amplitude1 * Math.sin(2 * Math.PI * frequency1 * t + phase1),
        signal2: amplitude2 * Math.sin(2 * Math.PI * frequency2 * t + phase2),
        noise: noise
      })
      signal.push(value)
    }
    
    // Apply window function
    const windowedSignal = signal.map((value, i) => {
      let window = 1
      if (windowFunction === 'hanning') {
        window = 0.5 * (1 - Math.cos(2 * Math.PI * i / (numSamples - 1)))
      } else if (windowFunction === 'hamming') {
        window = 0.54 - 0.46 * Math.cos(2 * Math.PI * i / (numSamples - 1))
      }
      return value * window
    })
    
    // Simple DFT for demonstration (not optimized FFT)
    const frequencyData = []
    const maxFreq = calculations.maxFrequency
    const freqStep = maxFreq / 100
    
    for (let f = 0; f <= maxFreq; f += freqStep) {
      let real = 0
      let imag = 0
      
      for (let n = 0; n < Math.min(numSamples, 200); n++) { // Limit for performance
        const angle = -2 * Math.PI * f * n / sampleRate
        real += windowedSignal[n] * Math.cos(angle)
        imag += windowedSignal[n] * Math.sin(angle)
      }
      
      const magnitude = Math.sqrt(real * real + imag * imag) / numSamples
      const phase = Math.atan2(imag, real)
      
      frequencyData.push({
        frequency: f,
        magnitude: magnitude,
        phase: phase,
        real: real / numSamples,
        imaginary: imag / numSamples
      })
    }
    
    return {
      timeData,
      frequencyData,
      windowedSignal: windowedSignal.map((value, i) => ({
        time: i * timeStep,
        amplitude: value,
        window: windowFunction === 'none' ? 1 : 
                windowFunction === 'hanning' ? 
                  0.5 * (1 - Math.cos(2 * Math.PI * i / (numSamples - 1))) :
                  0.54 - 0.46 * Math.cos(2 * Math.PI * i / (numSamples - 1))
      }))
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
      frequency1: 5,
      frequency2: 15,
      amplitude1: 1,
      amplitude2: 0.5,
      phase1: 0,
      phase2: 0,
      sampleRate: 100,
      duration: 2,
      noiseLevel: 0.1,
      windowFunction: 'none'
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