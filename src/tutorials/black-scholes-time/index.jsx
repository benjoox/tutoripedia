import { IconClock } from '@tabler/icons-react'
import { useBlackScholesTime } from '../../hooks/tutorials/useBlackScholesTime'
import { blackScholesTimeParameters } from './parameters'
import { blackScholesTimePhases } from './phases'

/**
 * Black-Scholes Time to Maturity Tutorial Definition
 * 
 * This tutorial explores how time to maturity affects option pricing
 * in the Black-Scholes model, covering risk-neutral pricing, stock price
 * evolution, mathematical integration, and volatility impacts.
 */
export const blackScholesTimeTutorial = {
  // Basic metadata
  id: 'black-scholes-time',
  title: 'Black-Scholes: Understanding Time to Maturity (T)',
  shortTitle: 'Time to Maturity',
  description: 'Explore how time affects option pricing in the Black-Scholes model through interactive visualizations and mathematical explanations.',
  
  // Visual and categorization
  icon: <IconClock className="w-6 h-6" />,
  difficulty: 'intermediate',
  duration: '30-45 minutes',
  estimatedTime: 35, // minutes
  
  // Topic classification
  topics: ['Options', 'Black-Scholes', 'Time Value', 'Risk-Neutral Pricing'],
  categories: ['derivatives', 'mathematical-finance', 'option-pricing'],
  tags: ['black-scholes', 'time-decay', 'option-pricing', 'risk-neutral', 'volatility'],
  
  // Prerequisites and learning objectives
  prerequisites: [
    'Basic understanding of options (calls and puts)',
    'Familiarity with probability and statistics',
    'Basic calculus knowledge (derivatives and integrals)',
    'Understanding of present value and discounting'
  ],
  
  learningObjectives: [
    'Understand the role of time in option pricing',
    'Learn about risk-neutral pricing framework',
    'Explore stock price evolution under geometric Brownian motion',
    'Understand the mathematical foundation of Black-Scholes formula',
    'Analyze the impact of volatility on option values',
    'Interpret option pricing charts and distributions'
  ],
  
  // Tutorial components
  hook: useBlackScholesTime,
  parameters: blackScholesTimeParameters,
  phases: blackScholesTimePhases,
  
  // Default parameter values
  defaultParameters: {
    timeToMaturity: 90,
    stockPrice: 100,
    strikePrice: 100,
    volatility: 0.2,
    riskFreeRate: 0.05
  },
  
  // Tutorial configuration
  config: {
    showParameterCategories: true,
    enableParameterReset: true,
    showCalculationDetails: true,
    enableChartInteraction: true,
    responsiveCharts: true,
    showProgressIndicator: true,
    enablePhaseNavigation: true,
    autoSaveProgress: false // Since this is educational, not persistent
  },
  
  // Accessibility and internationalization
  accessibility: {
    keyboardNavigation: true,
    screenReaderSupport: true,
    highContrastMode: true,
    reducedMotion: true
  },
  
  // Performance settings
  performance: {
    lazyLoadPhases: false, // Load all phases for smooth navigation
    memoizeCalculations: true,
    debounceParameterUpdates: 100, // milliseconds
    chartUpdateThrottle: 50 // milliseconds
  },
  
  // Educational metadata
  educational: {
    level: 'undergraduate', // undergraduate, graduate, professional
    field: 'quantitative-finance',
    concepts: [
      'risk-neutral-pricing',
      'geometric-brownian-motion',
      'option-time-value',
      'volatility-impact',
      'mathematical-integration'
    ],
    skills: [
      'option-valuation',
      'parameter-sensitivity-analysis',
      'financial-modeling',
      'mathematical-interpretation'
    ]
  },
  
  // Version and maintenance
  version: '1.0.0',
  lastUpdated: new Date().toISOString(),
  author: 'Interactive Learning Tutorials',
  
  // Tutorial flow configuration
  flow: {
    allowSkipPhases: true,
    requirePhaseCompletion: false,
    showPhaseProgress: true,
    enableBookmarks: false,
    showEstimatedTime: true
  },
  
  // Help and support
  help: {
    showTooltips: true,
    showParameterDescriptions: true,
    showFormulaExplanations: true,
    contactSupport: false // No support system implemented yet
  },
  
  // Analytics and tracking (for future implementation)
  analytics: {
    trackParameterChanges: false,
    trackPhaseCompletion: false,
    trackTimeSpent: false,
    trackUserInteractions: false
  }
}

/**
 * Tutorial validation function
 * Ensures the tutorial definition is complete and valid
 */
export const validateTutorial = (tutorial = blackScholesTimeTutorial) => {
  const errors = []
  const warnings = []
  
  // Required fields validation
  const requiredFields = ['id', 'title', 'description', 'hook', 'parameters', 'phases']
  requiredFields.forEach(field => {
    if (!tutorial[field]) {
      errors.push(`Missing required field: ${field}`)
    }
  })
  
  // Hook validation
  if (tutorial.hook && typeof tutorial.hook !== 'function') {
    errors.push('Tutorial hook must be a function')
  }
  
  // Parameters validation
  if (tutorial.parameters && !Array.isArray(tutorial.parameters)) {
    errors.push('Tutorial parameters must be an array')
  }
  
  // Phases validation
  if (tutorial.phases && !Array.isArray(tutorial.phases)) {
    errors.push('Tutorial phases must be an array')
  } else if (tutorial.phases && tutorial.phases.length === 0) {
    warnings.push('Tutorial has no phases defined')
  }
  
  // Phase structure validation
  if (tutorial.phases && Array.isArray(tutorial.phases)) {
    tutorial.phases.forEach((phase, index) => {
      if (!phase.id) {
        errors.push(`Phase ${index} missing required id`)
      }
      if (!phase.title) {
        errors.push(`Phase ${index} missing required title`)
      }
      if (!phase.content || typeof phase.content !== 'function') {
        errors.push(`Phase ${index} missing or invalid content component`)
      }
    })
  }
  
  // Default parameters validation
  if (tutorial.defaultParameters && tutorial.parameters && Array.isArray(tutorial.parameters)) {
    const paramKeys = tutorial.parameters.map(p => p.key)
    Object.keys(tutorial.defaultParameters).forEach(key => {
      if (!paramKeys.includes(key)) {
        warnings.push(`Default parameter '${key}' not found in parameter definitions`)
      }
    })
  }
  
  // Duration validation
  if (tutorial.duration && tutorial.estimatedTime) {
    const durationMatch = tutorial.duration.match(/(\d+)-?(\d+)?/)
    if (durationMatch) {
      const minTime = parseInt(durationMatch[1])
      const maxTime = durationMatch[2] ? parseInt(durationMatch[2]) : minTime
      if (tutorial.estimatedTime < minTime || tutorial.estimatedTime > maxTime) {
        warnings.push('Estimated time does not match duration range')
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Get tutorial metadata for display purposes
 */
export const getTutorialMetadata = (tutorial = blackScholesTimeTutorial) => {
  return {
    id: tutorial.id,
    title: tutorial.title,
    shortTitle: tutorial.shortTitle,
    description: tutorial.description,
    icon: tutorial.icon,
    difficulty: tutorial.difficulty,
    duration: tutorial.duration,
    estimatedTime: tutorial.estimatedTime,
    topics: tutorial.topics,
    categories: tutorial.categories,
    tags: tutorial.tags,
    prerequisites: tutorial.prerequisites,
    learningObjectives: tutorial.learningObjectives,
    phaseCount: tutorial.phases?.length || 0,
    parameterCount: tutorial.parameters?.length || 0
  }
}

/**
 * Initialize tutorial with custom parameters
 */
export const initializeTutorial = (customParams = {}) => {
  const params = { ...blackScholesTimeTutorial.defaultParameters, ...customParams }
  return {
    ...blackScholesTimeTutorial,
    initialParameters: params
  }
}

/**
 * Get tutorial phase by ID
 */
export const getTutorialPhase = (phaseId, tutorial = blackScholesTimeTutorial) => {
  return tutorial.phases?.find(phase => phase.id === phaseId)
}

/**
 * Get tutorial parameter by key
 */
export const getTutorialParameter = (paramKey, tutorial = blackScholesTimeTutorial) => {
  return tutorial.parameters?.find(param => param.key === paramKey)
}

/**
 * Export default tutorial
 */
export default blackScholesTimeTutorial