import { IconCalculator } from '@tabler/icons-react'
import { useKellyCriterion } from '../../hooks/tutorials/useKellyCriterion'
import { kellyCriterionParameters } from './parameters'
import { 
  IntroductionPhase, 
  KellyBetSizePhase, 
  BankrollGrowthPhase, 
  FractionalKellyPhase 
} from './phases'

/**
 * Kelly Criterion Tutorial Definition
 * 
 * This tutorial explores the Kelly Criterion for optimal bet sizing,
 * covering the mathematical foundation, practical applications,
 * and risk management considerations.
 */
export const kellyCriterionTutorial = {
  // Basic metadata
  id: 'kelly-criterion',
  title: 'Kelly Criterion: Optimal Bet Sizing Strategy',
  shortTitle: 'Kelly Criterion',
  description: 'Learn how to determine the optimal size for bets and investments using the Kelly Criterion formula through interactive visualizations and practical examples.',
  
  // Visual and categorization
  icon: <IconCalculator className="w-6 h-6" />,
  difficulty: 'intermediate',
  duration: '25-35 minutes',
  estimatedTime: 30, // minutes
  
  // Topic classification
  topics: ['Betting Strategy', 'Risk Management', 'Portfolio Theory', 'Mathematical Finance'],
  categories: ['risk-management', 'mathematical-finance', 'betting-strategy'],
  tags: ['kelly-criterion', 'bet-sizing', 'risk-management', 'expected-value', 'bankroll-management'],
  
  // Prerequisites and learning objectives
  prerequisites: [
    'Basic understanding of probability',
    'Familiarity with expected value concepts',
    'Basic knowledge of risk and reward',
    'Understanding of percentages and ratios'
  ],
  
  learningObjectives: [
    'Understand the Kelly Criterion formula and its components',
    'Learn how to calculate optimal bet sizes',
    'Explore the relationship between probability, payoffs, and bet sizing',
    'Understand the risks of over-betting and under-betting',
    'Learn about fractional Kelly strategies for risk management',
    'Apply Kelly Criterion concepts to real-world scenarios'
  ],
  
  // Tutorial components
  hook: useKellyCriterion,
  parameters: kellyCriterionParameters,
  phases: [
    {
      id: 'introduction',
      title: 'Introduction to Kelly Criterion',
      description: 'Learn the fundamentals of the Kelly Criterion and why it matters for optimal betting',
      content: IntroductionPhase,
      estimatedTime: 8,
      concepts: ['Kelly Formula', 'Expected Value', 'Optimal Betting']
    },
    {
      id: 'bet-sizing',
      title: 'Visualizing Optimal Bet Size',
      description: 'Explore how bet size affects long-term growth rate',
      content: KellyBetSizePhase,
      estimatedTime: 7,
      concepts: ['Growth Rate', 'Bet Size Optimization', 'Risk-Reward Balance']
    },
    {
      id: 'bankroll-growth',
      title: 'Bankroll Growth Simulation',
      description: 'Compare different betting strategies through simulation',
      content: BankrollGrowthPhase,
      estimatedTime: 8,
      concepts: ['Simulation', 'Strategy Comparison', 'Long-term Performance']
    },
    {
      id: 'fractional-kelly',
      title: 'Fractional Kelly and Risk Management',
      description: 'Learn about practical modifications to reduce risk',
      content: FractionalKellyPhase,
      estimatedTime: 7,
      concepts: ['Fractional Kelly', 'Risk Management', 'Volatility Control']
    }
  ],
  
  // Default parameter values
  defaultParameters: {
    probabilityOfWinning: 0.6,
    winLossRatio: 2.0,
    initialBankroll: 1000,
    numberOfBets: 100
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
      'kelly-criterion',
      'optimal-betting',
      'risk-management',
      'expected-value',
      'bankroll-management'
    ],
    skills: [
      'bet-sizing',
      'risk-assessment',
      'probability-analysis',
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
export const validateTutorial = (tutorial = kellyCriterionTutorial) => {
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
export const getTutorialMetadata = (tutorial = kellyCriterionTutorial) => {
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
  const params = { ...kellyCriterionTutorial.defaultParameters, ...customParams }
  return {
    ...kellyCriterionTutorial,
    initialParameters: params
  }
}

export default kellyCriterionTutorial