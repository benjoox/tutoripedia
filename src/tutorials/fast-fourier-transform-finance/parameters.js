export const fftFinanceParameters = [
  {
    key: 'period1',
    label: 'Short-Term Cycle Period',
    description: 'Period of the primary short-term market cycle (in trading days)',
    type: 'slider',
    min: 5,
    max: 60,
    step: 1,
    defaultValue: 20,
    format: (value) => `${value} days`,
    category: 'Market Cycles',
    tooltip: 'Represents short-term trading patterns like weekly or monthly cycles',
    validation: {
      required: true,
      min: 5,
      max: 60,
      message: 'Short-term cycle must be between 5 and 60 days'
    },
    impact: 'high',
    relatedConcepts: ['Market Cycles', 'Technical Analysis', 'Trading Patterns']
  },
  {
    key: 'period2',
    label: 'Long-Term Cycle Period',
    description: 'Period of the secondary long-term market cycle (in trading days)',
    type: 'slider',
    min: 30,
    max: 120,
    step: 5,
    defaultValue: 50,
    format: (value) => `${value} days`,
    category: 'Market Cycles',
    tooltip: 'Represents longer-term patterns like quarterly earnings cycles',
    validation: {
      required: true,
      min: 30,
      max: 120,
      message: 'Long-term cycle must be between 30 and 120 days'
    },
    impact: 'high',
    relatedConcepts: ['Business Cycles', 'Earnings Cycles', 'Economic Trends']
  },
  {
    key: 'amplitude1',
    label: 'Short-Term Cycle Strength',
    description: 'Amplitude/strength of the short-term market cycle',
    type: 'slider',
    min: 0.1,
    max: 2.0,
    step: 0.1,
    defaultValue: 1.0,
    format: (value) => `${value.toFixed(1)}x`,
    category: 'Market Cycles',
    tooltip: 'Higher values create stronger short-term price swings',
    validation: {
      required: true,
      min: 0.1,
      max: 2.0,
      message: 'Amplitude must be between 0.1 and 2.0'
    },
    impact: 'medium',
    relatedConcepts: ['Volatility', 'Price Movement', 'Market Dynamics']
  },
  {
    key: 'amplitude2',
    label: 'Long-Term Cycle Strength',
    description: 'Amplitude/strength of the long-term market cycle',
    type: 'slider',
    min: 0.1,
    max: 2.0,
    step: 0.1,
    defaultValue: 0.8,
    format: (value) => `${value.toFixed(1)}x`,
    category: 'Market Cycles',
    tooltip: 'Higher values create stronger long-term trends',
    validation: {
      required: true,
      min: 0.1,
      max: 2.0,
      message: 'Amplitude must be between 0.1 and 2.0'
    },
    impact: 'medium',
    relatedConcepts: ['Trend Strength', 'Market Momentum', 'Cyclical Patterns']
  },
  {
    key: 'noiseLevel',
    label: 'Market Noise Level',
    description: 'Amount of random noise in the market data',
    type: 'slider',
    min: 0.0,
    max: 1.0,
    step: 0.05,
    defaultValue: 0.3,
    format: (value) => `${(value * 100).toFixed(0)}%`,
    category: 'Market Conditions',
    tooltip: 'Simulates random market events and unpredictable price movements',
    validation: {
      required: true,
      min: 0.0,
      max: 1.0,
      message: 'Noise level must be between 0% and 100%'
    },
    impact: 'medium',
    relatedConcepts: ['Market Efficiency', 'Random Walk', 'Signal vs Noise']
  },
  {
    key: 'dataPoints',
    label: 'Data History Length',
    description: 'Number of trading days in the analysis window',
    type: 'slider',
    min: 100,
    max: 500,
    step: 25,
    defaultValue: 200,
    format: (value) => `${value} days`,
    category: 'Analysis Parameters',
    tooltip: 'More data points provide better frequency resolution but require more computation',
    validation: {
      required: true,
      min: 100,
      max: 500,
      message: 'Data points must be between 100 and 500'
    },
    impact: 'low',
    relatedConcepts: ['Sample Size', 'Statistical Significance', 'Data Quality']
  },
  {
    key: 'trendStrength',
    label: 'Overall Trend Strength',
    description: 'Strength of the underlying market trend',
    type: 'slider',
    min: -0.05,
    max: 0.05,
    step: 0.005,
    defaultValue: 0.02,
    format: (value) => `${(value * 100).toFixed(1)}%/day`,
    category: 'Market Conditions',
    tooltip: 'Positive values create upward trends, negative values create downward trends',
    validation: {
      required: true,
      min: -0.05,
      max: 0.05,
      message: 'Trend strength must be between -5% and 5% per day'
    },
    impact: 'medium',
    relatedConcepts: ['Market Trends', 'Bull/Bear Markets', 'Long-term Growth']
  }
]

export const parameterCategories = [
  {
    id: 'market-cycles',
    name: 'Market Cycles',
    description: 'Configure the underlying cyclical patterns in market data',
    icon: 'trending-up',
    parameters: ['period1', 'period2', 'amplitude1', 'amplitude2']
  },
  {
    id: 'market-conditions',
    name: 'Market Conditions',
    description: 'Adjust market noise and trend characteristics',
    icon: 'activity',
    parameters: ['noiseLevel', 'trendStrength']
  },
  {
    id: 'analysis-parameters',
    name: 'Analysis Parameters',
    description: 'Control the scope and resolution of the FFT analysis',
    icon: 'settings',
    parameters: ['dataPoints']
  }
]

// Add validation and utility functions
export const validateParameters = (parameters) => {
  const errors = []
  const warnings = []
  
  // Check if short-term period is less than long-term period
  if (parameters.period1 >= parameters.period2) {
    warnings.push('Short-term cycle period should typically be less than long-term cycle period')
  }
  
  // Check if data points provide sufficient resolution
  if (parameters.dataPoints < parameters.period2 * 2) {
    warnings.push('Consider increasing data points for better frequency resolution of long-term cycles')
  }
  
  // Check for extreme noise levels
  if (parameters.noiseLevel > 0.7) {
    warnings.push('High noise levels may obscure cyclical patterns in the FFT analysis')
  }
  
  return { 
    isValid: errors.length === 0, 
    errors, 
    warnings 
  }
}

export const getDefaultParameters = () => {
  const defaults = {}
  fftFinanceParameters.forEach(param => {
    defaults[param.key] = param.defaultValue
  })
  return defaults
}