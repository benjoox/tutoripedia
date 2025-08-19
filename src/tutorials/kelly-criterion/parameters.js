/**
 * Kelly Criterion Tutorial Parameters
 * 
 * Defines the interactive parameters for the Kelly Criterion tutorial,
 * including validation, formatting, and UI configuration.
 */

export const kellyCriterionParameters = [
  {
    key: 'probabilityOfWinning',
    label: 'Probability of Winning',
    description: 'The likelihood that your bet or investment will be successful',
    type: 'slider',
    min: 0.01,
    max: 0.99,
    step: 0.01,
    defaultValue: 0.6,
    format: (value) => `${(value * 100).toFixed(1)}%`,
    category: 'Basic Parameters',
    tooltip: 'Higher probability of winning generally allows for larger bet sizes according to Kelly',
    validation: {
      required: true,
      min: 0.01,
      max: 0.99,
      message: 'Probability must be between 1% and 99%'
    },
    impact: 'high',
    relatedConcepts: ['Expected Value', 'Risk Assessment']
  },
  
  {
    key: 'winLossRatio',
    label: 'Win/Loss Ratio',
    description: 'The ratio of how much you win versus how much you lose on each bet',
    type: 'slider',
    min: 0.1,
    max: 10.0,
    step: 0.1,
    defaultValue: 2.0,
    format: (value) => `${value.toFixed(1)}:1`,
    category: 'Basic Parameters',
    tooltip: 'A ratio of 2:1 means you win $2 for every $1 you risk',
    validation: {
      required: true,
      min: 0.1,
      max: 10.0,
      message: 'Win/Loss ratio must be between 0.1 and 10.0'
    },
    impact: 'high',
    relatedConcepts: ['Risk-Reward Ratio', 'Expected Value']
  },
  
  {
    key: 'initialBankroll',
    label: 'Initial Bankroll',
    description: 'The starting amount of capital available for betting',
    type: 'slider',
    min: 100,
    max: 10000,
    step: 100,
    defaultValue: 1000,
    format: (value) => `$${value.toLocaleString()}`,
    category: 'Simulation Parameters',
    tooltip: 'This affects the simulation visualization but not the Kelly percentage calculation',
    validation: {
      required: true,
      min: 100,
      max: 10000,
      message: 'Initial bankroll must be between $100 and $10,000'
    },
    impact: 'low',
    relatedConcepts: ['Capital Management', 'Position Sizing']
  },
  
  {
    key: 'numberOfBets',
    label: 'Number of Bets',
    description: 'The number of bets to simulate in the growth analysis',
    type: 'slider',
    min: 10,
    max: 500,
    step: 10,
    defaultValue: 100,
    format: (value) => `${value} bets`,
    category: 'Simulation Parameters',
    tooltip: 'More bets show longer-term trends but may take longer to calculate',
    validation: {
      required: true,
      min: 10,
      max: 500,
      message: 'Number of bets must be between 10 and 500'
    },
    impact: 'medium',
    relatedConcepts: ['Long-term Growth', 'Statistical Convergence']
  }
]

/**
 * Parameter categories for organized display
 */
export const parameterCategories = [
  {
    id: 'basic',
    name: 'Basic Parameters',
    description: 'Core inputs that determine the Kelly percentage',
    icon: 'calculator',
    parameters: ['probabilityOfWinning', 'winLossRatio']
  },
  {
    id: 'simulation',
    name: 'Simulation Parameters',
    description: 'Settings that affect the visualization and simulation',
    icon: 'chart',
    parameters: ['initialBankroll', 'numberOfBets']
  }
]

/**
 * Parameter validation function
 */
export const validateParameters = (parameters) => {
  const errors = []
  const warnings = []
  
  kellyCriterionParameters.forEach(param => {
    const value = parameters[param.key]
    
    if (param.validation.required && (value === undefined || value === null)) {
      errors.push(`${param.label} is required`)
      return
    }
    
    if (value !== undefined && value !== null) {
      if (param.validation.min !== undefined && value < param.validation.min) {
        errors.push(`${param.label} must be at least ${param.validation.min}`)
      }
      
      if (param.validation.max !== undefined && value > param.validation.max) {
        errors.push(`${param.label} must be at most ${param.validation.max}`)
      }
    }
  })
  
  // Kelly-specific validations
  const { probabilityOfWinning, winLossRatio } = parameters
  
  if (probabilityOfWinning && winLossRatio) {
    const expectedValue = (probabilityOfWinning * winLossRatio) - (1 - probabilityOfWinning)
    
    if (expectedValue <= 0) {
      warnings.push('Negative expected value - Kelly Criterion suggests not betting')
    }
    
    const kellyPercentage = probabilityOfWinning - ((1 - probabilityOfWinning) / winLossRatio)
    
    if (kellyPercentage <= 0) {
      warnings.push('Kelly percentage is zero or negative - no betting recommended')
    }
    
    if (kellyPercentage > 0.5) {
      warnings.push('Kelly percentage exceeds 50% - consider fractional Kelly for reduced risk')
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Get parameter by key
 */
export const getParameter = (key) => {
  return kellyCriterionParameters.find(param => param.key === key)
}

/**
 * Get parameters by category
 */
export const getParametersByCategory = (categoryId) => {
  const category = parameterCategories.find(cat => cat.id === categoryId)
  if (!category) return []
  
  return category.parameters.map(paramKey => 
    kellyCriterionParameters.find(param => param.key === paramKey)
  ).filter(Boolean)
}

/**
 * Format parameter value for display
 */
export const formatParameterValue = (key, value) => {
  const parameter = getParameter(key)
  if (!parameter || !parameter.format) return value
  
  return parameter.format(value)
}

/**
 * Get default parameter values
 */
export const getDefaultParameters = () => {
  const defaults = {}
  kellyCriterionParameters.forEach(param => {
    defaults[param.key] = param.defaultValue
  })
  return defaults
}

export default kellyCriterionParameters