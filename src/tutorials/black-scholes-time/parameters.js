/**
 * Parameter definitions for Black-Scholes Time to Maturity tutorial
 * Includes formatters, descriptions, validation rules, and UI configuration
 */

export const blackScholesTimeParameters = [
  {
    key: 'timeToMaturity',
    label: 'Time to Maturity',
    type: 'slider',
    min: 1,
    max: 730, // 2 years in days
    step: 1,
    unit: 'days',
    defaultValue: 90,
    formatter: (value) => `${value} days (${(value/30).toFixed(1)} months)`,
    description: 'Time remaining until option expires. Affects both discounting and uncertainty of final stock price.',
    validation: {
      required: true,
      min: 1,
      max: 730,
      type: 'number'
    },
    category: 'time',
    importance: 'high',
    tooltip: 'Longer time to maturity increases option value due to higher uncertainty, but also increases discounting effect.'
  },
  {
    key: 'stockPrice',
    label: 'Current Stock Price (S₀)',
    type: 'slider',
    min: 50,
    max: 200,
    step: 1,
    unit: '$',
    defaultValue: 100,
    formatter: (value) => `$${value}`,
    description: 'Current price of the underlying asset. Higher stock prices generally increase call option values.',
    validation: {
      required: true,
      min: 50,
      max: 200,
      type: 'number'
    },
    category: 'market',
    importance: 'high',
    tooltip: 'The current market price of the underlying stock. Call options become more valuable as stock price increases.'
  },
  {
    key: 'strikePrice',
    label: 'Strike Price (K)',
    type: 'slider',
    min: 50,
    max: 200,
    step: 1,
    unit: '$',
    defaultValue: 100,
    formatter: (value) => `$${value}`,
    description: 'Price at which the option can be exercised. Lower strike prices increase call option values.',
    validation: {
      required: true,
      min: 50,
      max: 200,
      type: 'number'
    },
    category: 'contract',
    importance: 'high',
    tooltip: 'The predetermined price at which you can buy the stock if you exercise the call option.'
  },
  {
    key: 'volatility',
    label: 'Volatility (σ)',
    type: 'slider',
    min: 0.05,
    max: 0.8,
    step: 0.01,
    unit: '%',
    defaultValue: 0.2,
    formatter: (value) => `${(value * 100).toFixed(1)}%`,
    description: 'Measure of stock price uncertainty. Higher volatility increases option values due to greater potential for favorable outcomes.',
    validation: {
      required: true,
      min: 0.05,
      max: 0.8,
      type: 'number'
    },
    category: 'risk',
    importance: 'high',
    tooltip: 'Annual volatility of the underlying stock. Higher volatility increases option value due to asymmetric payoff structure.'
  },
  {
    key: 'riskFreeRate',
    label: 'Risk-free Rate (r)',
    type: 'slider',
    min: 0.001,
    max: 0.15,
    step: 0.001,
    unit: '%',
    defaultValue: 0.05,
    formatter: (value) => `${(value * 100).toFixed(1)}%`,
    description: 'Theoretical rate of return with zero risk. Used for discounting future cash flows to present value.',
    validation: {
      required: true,
      min: 0.001,
      max: 0.15,
      type: 'number'
    },
    category: 'market',
    importance: 'medium',
    tooltip: 'The risk-free interest rate, typically based on government bond yields. Used for discounting future payoffs.'
  }
]

/**
 * Parameter validation functions
 */
export const validateParameter = (key, value, parameters = blackScholesTimeParameters) => {
  const param = parameters.find(p => p.key === key)
  if (!param) {
    return { isValid: false, error: `Unknown parameter: ${key}` }
  }

  const { validation } = param
  
  // Check if required
  if (validation.required && (value === null || value === undefined || value === '')) {
    return { isValid: false, error: `${param.label} is required` }
  }

  // Check type
  if (validation.type === 'number' && typeof value !== 'number') {
    const numValue = parseFloat(value)
    if (isNaN(numValue)) {
      return { isValid: false, error: `${param.label} must be a number` }
    }
    value = numValue
  }

  // Check range
  if (typeof value === 'number') {
    if (validation.min !== undefined && value < validation.min) {
      return { isValid: false, error: `${param.label} must be at least ${validation.min}` }
    }
    if (validation.max !== undefined && value > validation.max) {
      return { isValid: false, error: `${param.label} must be at most ${validation.max}` }
    }
  }

  return { isValid: true, value }
}

/**
 * Validate all parameters at once
 */
export const validateAllParameters = (parameterValues, parameters = blackScholesTimeParameters) => {
  const errors = {}
  const validatedValues = {}
  let isValid = true

  parameters.forEach(param => {
    const value = parameterValues[param.key]
    const validation = validateParameter(param.key, value, parameters)
    
    if (!validation.isValid) {
      errors[param.key] = validation.error
      isValid = false
    } else {
      validatedValues[param.key] = validation.value !== undefined ? validation.value : value
    }
  })

  return { isValid, errors, validatedValues }
}

/**
 * Get default parameter values
 */
export const getDefaultParameters = (parameters = blackScholesTimeParameters) => {
  const defaults = {}
  parameters.forEach(param => {
    defaults[param.key] = param.defaultValue
  })
  return defaults
}

/**
 * Get parameter by key
 */
export const getParameter = (key, parameters = blackScholesTimeParameters) => {
  return parameters.find(p => p.key === key)
}

/**
 * Get parameters by category
 */
export const getParametersByCategory = (category, parameters = blackScholesTimeParameters) => {
  return parameters.filter(p => p.category === category)
}

/**
 * Get parameters by importance level
 */
export const getParametersByImportance = (importance, parameters = blackScholesTimeParameters) => {
  return parameters.filter(p => p.importance === importance)
}

/**
 * Format parameter value for display
 */
export const formatParameterValue = (key, value, parameters = blackScholesTimeParameters) => {
  const param = getParameter(key, parameters)
  if (!param || !param.formatter) {
    return value?.toString() || ''
  }
  return param.formatter(value)
}

/**
 * Get parameter categories with their parameters
 */
export const getParameterCategories = (parameters = blackScholesTimeParameters) => {
  const categories = {}
  parameters.forEach(param => {
    if (!categories[param.category]) {
      categories[param.category] = []
    }
    categories[param.category].push(param)
  })
  return categories
}

/**
 * Parameter metadata for UI rendering
 */
export const parameterMetadata = {
  categories: {
    time: {
      label: 'Time Parameters',
      description: 'Parameters related to time and expiration',
      icon: 'clock',
      order: 1
    },
    market: {
      label: 'Market Parameters',
      description: 'Current market conditions and rates',
      icon: 'trending-up',
      order: 2
    },
    contract: {
      label: 'Contract Terms',
      description: 'Option contract specifications',
      icon: 'file-text',
      order: 3
    },
    risk: {
      label: 'Risk Parameters',
      description: 'Volatility and uncertainty measures',
      icon: 'activity',
      order: 4
    }
  },
  importance: {
    high: {
      label: 'High Impact',
      description: 'Parameters with significant effect on option pricing',
      color: 'destructive'
    },
    medium: {
      label: 'Medium Impact',
      description: 'Parameters with moderate effect on option pricing',
      color: 'warning'
    },
    low: {
      label: 'Low Impact',
      description: 'Parameters with minimal effect on option pricing',
      color: 'muted'
    }
  }
}