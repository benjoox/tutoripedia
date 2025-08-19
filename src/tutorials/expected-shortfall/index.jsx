import { IconAlertTriangle } from '@tabler/icons-react'
import { useExpectedShortfall } from '../../hooks/tutorials/useExpectedShortfall'
import { expectedShortfallParameters } from './parameters'
import { 
  IntroductionPhase, 
  ExpectedShortfallPhase, 
  ComparisonPhase, 
  CoherencePhase 
} from './phases'

/**
 * Expected Shortfall Tutorial Definition
 * 
 * This tutorial explores Expected Shortfall (Conditional VaR) as a coherent
 * risk measure, comparing it with Value at Risk and demonstrating its
 * superior properties for risk management.
 */
export const expectedShortfallTutorial = {
  // Basic metadata
  id: 'expected-shortfall',
  title: 'Expected Shortfall: Beyond Value at Risk',
  shortTitle: 'Expected Shortfall',
  description: 'Discover Expected Shortfall (ES) as a superior risk measure to VaR, exploring its coherent properties and practical applications in risk management.',
  
  // Visual and categorization
  icon: <IconAlertTriangle className="w-6 h-6" />,
  difficulty: 'intermediate',
  duration: '20-30 minutes',
  estimatedTime: 25, // minutes
  
  // Topic classification
  topics: ['Risk Management', 'Value at Risk', 'Expected Shortfall', 'Coherent Risk Measures'],
  categories: ['risk-management', 'mathematical-finance', 'portfolio-theory'],
  tags: ['expected-shortfall', 'var', 'cvar', 'risk-measures', 'tail-risk', 'coherent-risk'],
  
  // Prerequisites and learning objectives
  prerequisites: [
    'Basic understanding of probability distributions',
    'Familiarity with risk and return concepts',
    'Knowledge of Value at Risk (VaR)',
    'Understanding of portfolio theory basics'
  ],
  
  learningObjectives: [
    'Understand the limitations of Value at Risk (VaR)',
    'Learn the definition and calculation of Expected Shortfall',
    'Compare VaR and ES as risk measures',
    'Understand the concept of coherent risk measures',
    'Learn about subadditivity and its importance',
    'Apply ES concepts to portfolio risk management'
  ],
  
  // Tutorial components
  hook: useExpectedShortfall,
  parameters: expectedShortfallParameters,
  phases: [
    {
      id: 'introduction',
      title: 'Introduction to Value at Risk',
      description: 'Understand VaR and its limitations as a risk measure',
      content: IntroductionPhase,
      estimatedTime: 6,
      concepts: ['Value at Risk', 'Risk Measurement', 'Tail Risk']
    },
    {
      id: 'expected-shortfall',
      title: 'Defining Expected Shortfall',
      description: 'Learn what Expected Shortfall is and how it addresses VaR limitations',
      content: ExpectedShortfallPhase,
      estimatedTime: 6,
      concepts: ['Expected Shortfall', 'Conditional VaR', 'Tail Expectations']
    },
    {
      id: 'comparison',
      title: 'VaR vs. Expected Shortfall',
      description: 'Direct comparison of VaR and ES on the same distribution',
      content: ComparisonPhase,
      estimatedTime: 6,
      concepts: ['Risk Measure Comparison', 'Distribution Analysis']
    },
    {
      id: 'coherence',
      title: 'Coherent Risk Measures',
      description: 'Understand why ES is coherent and VaR is not',
      content: CoherencePhase,
      estimatedTime: 7,
      concepts: ['Coherent Risk Measures', 'Subadditivity', 'Diversification']
    }
  ],
  
  // Default parameter values
  defaultParameters: {
    confidenceLevel: 0.95,
    portfolioVolatility: 0.15,
    expectedReturn: 0.08,
    timeHorizon: 1
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
    autoSaveProgress: false
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
    lazyLoadPhases: false,
    memoizeCalculations: true,
    debounceParameterUpdates: 150,
    chartUpdateThrottle: 100
  },
  
  // Educational metadata
  educational: {
    level: 'undergraduate',
    field: 'quantitative-finance',
    concepts: [
      'expected-shortfall',
      'value-at-risk',
      'coherent-risk-measures',
      'tail-risk',
      'subadditivity'
    ],
    skills: [
      'risk-measurement',
      'risk-assessment',
      'portfolio-analysis',
      'financial-modeling'
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
    contactSupport: false
  },
  
  // Analytics and tracking
  analytics: {
    trackParameterChanges: false,
    trackPhaseCompletion: false,
    trackTimeSpent: false,
    trackUserInteractions: false
  }
}

/**
 * Tutorial validation function
 */
export const validateTutorial = (tutorial = expectedShortfallTutorial) => {
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
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Get tutorial metadata for display purposes
 */
export const getTutorialMetadata = (tutorial = expectedShortfallTutorial) => {
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
  const params = { ...expectedShortfallTutorial.defaultParameters, ...customParams }
  return {
    ...expectedShortfallTutorial,
    initialParameters: params
  }
}

export default expectedShortfallTutorial