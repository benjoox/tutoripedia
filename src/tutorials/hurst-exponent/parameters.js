export const hurstExponentParameters = [
  {
    key: 'H',
    label: 'Hurst Exponent (H)',
    description: 'Controls the memory and persistence of the time series',
    type: 'slider',
    min: 0.1,
    max: 0.9,
    step: 0.05,
    defaultValue: 0.5,
    format: (value) => value.toFixed(2),
    category: 'Core Parameters',
    tooltip: 'H < 0.5: Mean-reverting, H = 0.5: Random walk, H > 0.5: Trending',
    validation: {
      required: true,
      min: 0.1,
      max: 0.9,
      message: 'Hurst Exponent must be between 0.1 and 0.9'
    },
    impact: 'high',
    relatedConcepts: ['Time Series Memory', 'Market Efficiency', 'Persistence']
  },
  {
    key: 'seriesLength',
    label: 'Series Length',
    description: 'Number of time periods to simulate',
    type: 'slider',
    min: 50,
    max: 500,
    step: 10,
    defaultValue: 252,
    format: (value) => `${value} periods`,
    category: 'Simulation Parameters',
    tooltip: 'Longer series show clearer patterns but take more time to generate',
    validation: {
      required: true,
      min: 50,
      max: 500,
      message: 'Series length must be between 50 and 500 periods'
    },
    impact: 'medium',
    relatedConcepts: ['Sample Size', 'Statistical Significance']
  },
  {
    key: 'volatility',
    label: 'Volatility',
    description: 'Annual volatility of the time series',
    type: 'slider',
    min: 0.05,
    max: 0.5,
    step: 0.05,
    defaultValue: 0.2,
    format: (value) => `${(value * 100).toFixed(0)}%`,
    category: 'Simulation Parameters',
    tooltip: 'Higher volatility creates more dramatic price movements',
    validation: {
      required: true,
      min: 0.05,
      max: 0.5,
      message: 'Volatility must be between 5% and 50%'
    },
    impact: 'medium',
    relatedConcepts: ['Risk', 'Price Variability']
  },
  {
    key: 'seed',
    label: 'Random Seed',
    description: 'Seed for reproducible random number generation',
    type: 'input',
    defaultValue: 42,
    format: (value) => value.toString(),
    category: 'Simulation Parameters',
    tooltip: 'Same seed produces identical results for comparison',
    validation: {
      required: true,
      min: 1,
      max: 9999,
      message: 'Seed must be between 1 and 9999'
    },
    impact: 'low',
    relatedConcepts: ['Reproducibility', 'Monte Carlo Simulation']
  }
]

export const parameterCategories = [
  {
    id: 'core',
    name: 'Core Parameters',
    description: 'Primary inputs that define the Hurst Exponent behavior',
    icon: 'calculator',
    parameters: ['H']
  },
  {
    id: 'simulation',
    name: 'Simulation Parameters',
    description: 'Control the simulation characteristics and reproducibility',
    icon: 'settings',
    parameters: ['seriesLength', 'volatility', 'seed']
  }
]

// Add validation and utility functions
export const validateParameters = (parameters) => {
  const errors = []
  const warnings = []
  
  if (parameters.H < 0.1 || parameters.H > 0.9) {
    errors.push('Hurst Exponent must be between 0.1 and 0.9')
  }
  
  if (parameters.seriesLength < 50) {
    warnings.push('Short series may not clearly show Hurst behavior')
  }
  
  if (parameters.volatility > 0.4) {
    warnings.push('Very high volatility may obscure underlying patterns')
  }
  
  return { 
    isValid: errors.length === 0, 
    errors, 
    warnings 
  }
}

export const getDefaultParameters = () => {
  const defaults = {}
  hurstExponentParameters.forEach(param => {
    defaults[param.key] = param.defaultValue
  })
  return defaults
}