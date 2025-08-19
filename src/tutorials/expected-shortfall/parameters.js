/**
 * Expected Shortfall Tutorial Parameters
 * 
 * Defines the interactive parameters for the Expected Shortfall tutorial,
 * including validation, formatting, and UI configuration.
 */

export const expectedShortfallParameters = [
  {
    key: 'confidenceLevel',
    label: 'Confidence Level',
    description: 'The confidence level for VaR and ES calculations (e.g., 95% means we look at the worst 5% of outcomes)',
    type: 'slider',
    min: 0.90,
    max: 0.99,
    step: 0.01,
    defaultValue: 0.95,
    format: (value) => `${(value * 100).toFixed(0)}%`,
    category: 'Risk Parameters',
    tooltip: 'Higher confidence levels focus on more extreme tail events',
    validation: {
      required: true,
      min: 0.90,
      max: 0.99,
      message: 'Confidence level must be between 90% and 99%'
    },
    impact: 'high',
    relatedConcepts: ['Value at Risk', 'Tail Risk', 'Confidence Intervals']
  },
  
  {
    key: 'portfolioVolatility',
    label: 'Portfolio Volatility',
    description: 'The annualized volatility (standard deviation) of portfolio returns',
    type: 'slider',
    min: 0.05,
    max: 0.50,
    step: 0.01,
    defaultValue: 0.15,
    format: (value) => `${(value * 100).toFixed(1)}%`,
    category: 'Risk Parameters',
    tooltip: 'Higher volatility increases both VaR and Expected Shortfall',
    validation: {
      required: true,
      min: 0.05,
      max: 0.50,
      message: 'Portfolio volatility must be between 5% and 50%'
    },
    impact: 'high',
    relatedConcepts: ['Volatility', 'Standard Deviation', 'Risk']
  },
  
  {
    key: 'expectedReturn',
    label: 'Expected Return',
    description: 'The annualized expected return of the portfolio',
    type: 'slider',
    min: -0.10,
    max: 0.20,
    step: 0.01,
    defaultValue: 0.08,
    format: (value) => `${(value * 100).toFixed(1)}%`,
    category: 'Portfolio Parameters',
    tooltip: 'Expected return affects the center of the return distribution',
    validation: {
      required: true,
      min: -0.10,
      max: 0.20,
      message: 'Expected return must be between -10% and 20%'
    },
    impact: 'medium',
    relatedConcepts: ['Expected Return', 'Risk-Return Trade-off']
  },
  
  {
    key: 'timeHorizon',
    label: 'Time Horizon',
    description: 'The time period for the risk measurement (in days)',
    type: 'slider',
    min: 1,
    max: 30,
    step: 1,
    defaultValue: 1,
    format: (value) => `${value} day${value !== 1 ? 's' : ''}`,
    category: 'Portfolio Parameters',
    tooltip: 'Longer time horizons generally increase risk measures',
    validation: {
      required: true,
      min: 1,
      max: 30,
      message: 'Time horizon must be between 1 and 30 days'
    },
    impact: 'medium',
    relatedConcepts: ['Time Horizon', 'Risk Scaling']
  }
]

/**
 * Parameter categories for organized display
 */
export const parameterCategories = [
  {
    id: 'risk',
    name: 'Risk Parameters',
    description: 'Core parameters that define the risk characteristics',
    icon: 'alert-triangle',
    parameters: ['confidenceLevel', 'portfolioVolatility']
  },
  {
    id: 'portfolio',
    name: 'Portfolio Parameters',
    description: 'Parameters that define the portfolio characteristics',
    icon: 'briefcase',
    parameters: ['expectedReturn', 'timeHorizon']
  }
]

/**
 * Parameter validation function
 */
export const validateParameters = (parameters) => {
  const errors = []
  const warnings = []
  
  expectedShortfallParameters.forEach(param => {
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
  
  // Expected Shortfall specific validations
  const { portfolioVolatility, expectedReturn, confidenceLevel } = parameters
  
  if (portfolioVolatility && expectedReturn) {
    const sharpeRatio = expectedReturn / portfolioVolatility
    
    if (sharpeRatio < 0) {
      warnings.push('Negative Sharpe ratio - portfolio has negative risk-adjusted returns')
    }
    
    if (portfolioVolatility > 0.3) {
      warnings.push('Very high volatility - consider if this is realistic for your portfolio')
    }
  }
  
  if (confidenceLevel && confidenceLevel > 0.99) {
    warnings.push('Extremely high confidence level - results may be less reliable')
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
  return expectedShortfallParameters.find(param => param.key === key)
}

/**
 * Get parameters by category
 */
export const getParametersByCategory = (categoryId) => {
  const category = parameterCategories.find(cat => cat.id === categoryId)
  if (!category) return []
  
  return category.parameters.map(paramKey => 
    expectedShortfallParameters.find(param => param.key === paramKey)
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
  expectedShortfallParameters.forEach(param => {
    defaults[param.key] = param.defaultValue
  })
  return defaults
}

export default expectedShortfallParameters