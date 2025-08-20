import { IconTrendingUp } from '@tabler/icons-react'
import { useVWAP } from '../../hooks/tutorials/useVWAP'
import { vwapParameters } from './parameters'
import { 
  VWAPIntroductionPhase,
  VWAPCalculationPhase,
  VWAPStrategyPhase,
  VWAPRiskManagementPhase
} from './phases'

/**
 * VWAP (Volume-Weighted Average Price) Tutorial Definition
 * 
 * This tutorial explores the Volume-Weighted Average Price indicator,
 * covering its calculation, trading applications, and limitations through
 * interactive visualizations and real market scenarios.
 */
export const vwapTutorial = {
  // Basic metadata
  id: 'vwap',
  title: 'Volume-Weighted Average Price (VWAP)',
  shortTitle: 'VWAP',
  description: 'Learn how volume-weighted pricing works in financial markets through interactive charts and real-world trading scenarios.',
  
  // Visual and categorization
  icon: <IconTrendingUp className="w-6 h-6" />,
  difficulty: 'intermediate',
  duration: '25-35 minutes',
  estimatedTime: 30, // minutes
  
  // Topic classification
  topics: ['Trading', 'Technical Analysis', 'Volume Analysis', 'Market Microstructure'],
  categories: ['technical-analysis', 'trading-strategies', 'market-data'],
  tags: ['vwap', 'volume-weighted', 'trading-benchmark', 'intraday-analysis', 'market-microstructure'],
  
  // Prerequisites and learning objectives
  prerequisites: [
    'Basic understanding of stock prices and trading volume',
    'Familiarity with simple moving averages',
    'Understanding of intraday trading concepts',
    'Basic knowledge of market participants (institutional vs retail)'
  ],
  
  learningObjectives: [
    'Understand the concept and calculation of VWAP',
    'Learn how VWAP differs from simple moving averages',
    'Explore institutional and retail trading applications of VWAP',
    'Analyze VWAP behavior in different market conditions',
    'Understand the limitations and proper context for VWAP usage',
    'Interpret volume-price relationships in intraday trading'
  ],
  
  // Tutorial components
  hook: useVWAP,
  parameters: vwapParameters,
  phases: [
    {
      id: 'introduction',
      title: 'What is VWAP?',
      description: 'Introduction to Volume-Weighted Average Price and comparison with simple averages',
      content: VWAPIntroductionPhase,
      estimatedTime: 8, // minutes
      objectives: [
        'Understand the concept of volume weighting',
        'Compare VWAP with simple moving averages',
        'Visualize intraday price and volume relationships'
      ]
    },
    {
      id: 'calculation',
      title: 'The VWAP Calculation',
      description: 'Step-by-step breakdown of how VWAP is calculated',
      content: VWAPCalculationPhase,
      estimatedTime: 7, // minutes
      objectives: [
        'Learn the VWAP formula and its components',
        'Follow step-by-step calculation examples',
        'Understand cumulative nature of VWAP'
      ]
    },
    {
      id: 'strategy',
      title: 'Trading Strategies with VWAP',
      description: 'How institutional and retail traders use VWAP in practice',
      content: VWAPStrategyPhase,
      estimatedTime: 10, // minutes
      objectives: [
        'Explore institutional VWAP benchmarking',
        'Learn retail trading applications',
        'Understand trend confirmation and mean reversion strategies'
      ]
    },
    {
      id: 'risk-management',
      title: 'Limitations and Advanced Concepts',
      description: 'Understanding when VWAP works well and when it doesn\'t',
      content: VWAPRiskManagementPhase,
      estimatedTime: 10, // minutes
      objectives: [
        'Recognize VWAP limitations and caveats',
        'Compare performance in trending vs choppy markets',
        'Learn about VWAP bands and advanced applications'
      ]
    }
  ],
  
  // Default parameter values
  defaultParameters: {
    stockPrice: 100,
    volumeMultiplier: 1.0,
    marketVolatility: 0.2,
    timeIntervals: 50,
    marketCondition: 'trending',
    volumePattern: 'u-shaped'
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
    autoSaveProgress: false // Educational content, no persistence needed
  },
  
  // Accessibility and internationalization
  accessibility: {
    keyboardNavigation: true,
    screenReaderSupport: true,
    highContrastMode: true,
    reducedMotion: true,
    alternativeText: {
      charts: 'Interactive charts showing VWAP calculations and market scenarios',
      formulas: 'Mathematical formulas for VWAP calculation',
      tables: 'Step-by-step calculation tables with price and volume data'
    }
  },
  
  // Performance settings
  performance: {
    lazyLoadPhases: false, // Load all phases for smooth navigation
    memoizeCalculations: true,
    debounceParameterUpdates: 100, // milliseconds
    chartUpdateThrottle: 50, // milliseconds
    maxDataPoints: 200, // Limit chart data for performance
    enableVirtualization: false // Not needed for this tutorial size
  },
  
  // Educational metadata
  educational: {
    level: 'intermediate', // beginner, intermediate, advanced
    field: 'trading-and-markets',
    concepts: [
      'volume-weighted-pricing',
      'intraday-analysis',
      'market-microstructure',
      'trading-benchmarks',
      'institutional-trading'
    ],
    skills: [
      'technical-analysis',
      'volume-analysis',
      'trading-strategy-evaluation',
      'market-condition-assessment',
      'risk-management'
    ],
    realWorldApplications: [
      'Institutional trade execution benchmarking',
      'Retail intraday trading strategies',
      'Market maker fair value assessment',
      'Algorithmic trading signal generation'
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
    showEstimatedTime: true,
    allowParameterPersistence: false
  },
  
  // Help and support
  help: {
    showTooltips: true,
    showParameterDescriptions: true,
    showFormulaExplanations: true,
    showGlossary: true,
    glossaryTerms: [
      {
        term: 'VWAP',
        definition: 'Volume-Weighted Average Price - a trading benchmark that gives average price weighted by volume'
      },
      {
        term: 'Typical Price',
        definition: 'Average of high, low, and close prices for a given period: (H + L + C) / 3'
      },
      {
        term: 'Market Microstructure',
        definition: 'The study of how orders are processed and how prices are formed in financial markets'
      },
      {
        term: 'Institutional Trading',
        definition: 'Trading by large organizations like mutual funds, pension funds, and investment banks'
      }
    ],
    contactSupport: false // No support system implemented yet
  },
  
  // Analytics and tracking (for future implementation)
  analytics: {
    trackParameterChanges: false,
    trackPhaseCompletion: false,
    trackTimeSpent: false,
    trackUserInteractions: false,
    trackChartInteractions: false
  },
  
  // Market data and scenarios
  scenarios: {
    trending: {
      name: 'Trending Market',
      description: 'Consistent directional price movement with volume confirmation',
      parameters: {
        marketCondition: 'trending',
        marketVolatility: 0.15,
        volumePattern: 'u-shaped'
      }
    },
    choppy: {
      name: 'Choppy Market',
      description: 'Frequent price reversals with inconsistent volume patterns',
      parameters: {
        marketCondition: 'choppy',
        marketVolatility: 0.35,
        volumePattern: 'random'
      }
    },
    highVolume: {
      name: 'High Volume Day',
      description: 'Above-average trading activity throughout the session',
      parameters: {
        volumeMultiplier: 2.5,
        volumePattern: 'spike'
      }
    }
  },
  
  // References and further reading
  references: [
    {
      title: 'Market Microstructure Theory',
      author: 'Maureen O\'Hara',
      type: 'book',
      description: 'Comprehensive coverage of how markets work at the microstructure level'
    },
    {
      title: 'Algorithmic Trading and DMA',
      author: 'Barry Johnson',
      type: 'book',
      description: 'Practical guide to algorithmic trading including VWAP strategies'
    },
    {
      title: 'VWAP Best Practices',
      source: 'CFA Institute',
      type: 'article',
      description: 'Professional guidelines for using VWAP in institutional trading'
    }
  ]
}

/**
 * Tutorial validation function
 * Ensures the tutorial definition is complete and valid
 */
export const validateTutorial = (tutorial = vwapTutorial) => {
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
  
  // Phase time validation
  if (tutorial.phases && tutorial.estimatedTime) {
    const totalPhaseTime = tutorial.phases.reduce((sum, phase) => sum + (phase.estimatedTime || 0), 0)
    if (Math.abs(totalPhaseTime - tutorial.estimatedTime) > 5) {
      warnings.push(`Phase times (${totalPhaseTime}min) don't match tutorial estimated time (${tutorial.estimatedTime}min)`)
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
export const getTutorialMetadata = (tutorial = vwapTutorial) => {
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
  const params = { ...vwapTutorial.defaultParameters, ...customParams }
  return {
    ...vwapTutorial,
    initialParameters: params
  }
}

/**
 * Get tutorial phase by ID
 */
export const getTutorialPhase = (phaseId, tutorial = vwapTutorial) => {
  return tutorial.phases?.find(phase => phase.id === phaseId)
}

/**
 * Get tutorial parameter by key
 */
export const getTutorialParameter = (paramKey, tutorial = vwapTutorial) => {
  return tutorial.parameters?.find(param => param.key === paramKey)
}

/**
 * Get tutorial scenario by name
 */
export const getTutorialScenario = (scenarioName, tutorial = vwapTutorial) => {
  return tutorial.scenarios?.[scenarioName]
}

/**
 * Apply scenario parameters to tutorial
 */
export const applyScenario = (scenarioName, tutorial = vwapTutorial) => {
  const scenario = getTutorialScenario(scenarioName, tutorial)
  if (!scenario) return tutorial.defaultParameters
  
  return {
    ...tutorial.defaultParameters,
    ...scenario.parameters
  }
}

/**
 * Export default tutorial
 */
export default vwapTutorial