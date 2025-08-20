import { IconTrendingUp } from '@tabler/icons-react'
import { useHurstExponent } from '../../hooks/tutorials/useHurstExponent'
import { hurstExponentParameters } from './parameters'
import { 
  IntroductionPhase, 
  HurstDefinitionPhase, 
  StrategyPhase, 
  RiskManagementPhase 
} from './phases'

export const hurstExponentTutorial = {
  // Basic metadata
  id: 'hurst-exponent',
  title: 'The Hurst Exponent: Measuring Market Memory',
  shortTitle: 'Hurst Exponent',
  description: 'Learn how the Hurst Exponent quantifies time series memory and persistence, and how to apply it in trading strategies and risk management.',
  
  // Visual and categorization
  icon: <IconTrendingUp className="w-6 h-6" />,
  difficulty: 'intermediate',
  duration: '25-35 minutes',
  estimatedTime: 30,
  
  // Topic classification
  topics: ['Time Series Analysis', 'Market Microstructure', 'Risk Management'],
  categories: ['quantitative-analysis', 'risk-management'],
  tags: ['hurst-exponent', 'time-series', 'market-memory', 'persistence', 'mean-reversion', 'trending'],
  
  // Prerequisites and learning objectives
  prerequisites: [
    'Basic understanding of time series data',
    'Familiarity with financial markets',
    'Knowledge of random walks and market efficiency'
  ],
  
  learningObjectives: [
    'Understand what the Hurst Exponent measures and its three regimes',
    'Learn to interpret H values for different market behaviors',
    'Apply Hurst analysis to strategy selection',
    'Understand implications for risk management and tail risk'
  ],
  
  // Tutorial components
  hook: useHurstExponent,
  parameters: hurstExponentParameters,
  phases: [
    {
      id: 'introduction',
      title: 'Understanding Time Series Behavior',
      description: 'Explore the three fundamental behaviors of financial time series: random walks, trends, and mean reversion',
      content: IntroductionPhase,
      estimatedTime: 8,
      concepts: ['Random Walk', 'Mean Reversion', 'Trending Behavior', 'Market Efficiency']
    },
    {
      id: 'hurst-definition',
      title: 'Defining the Hurst Exponent',
      description: 'Learn how the Hurst Exponent quantifies time series memory and see it in action',
      content: HurstDefinitionPhase,
      estimatedTime: 10,
      concepts: ['Hurst Exponent', 'Long-term Memory', 'Persistence', 'Anti-persistence']
    },
    {
      id: 'strategy',
      title: 'Application in Financial Strategy',
      description: 'Discover how to match trading strategies to market behavior using the Hurst Exponent',
      content: StrategyPhase,
      estimatedTime: 8,
      concepts: ['Strategy Selection', 'Momentum Trading', 'Pairs Trading', 'Market Timing']
    },
    {
      id: 'risk-management',
      title: 'Hurst Exponent in Risk Management',
      description: 'Understand how the Hurst Exponent affects risk profiles and tail risk assessment',
      content: RiskManagementPhase,
      estimatedTime: 9,
      concepts: ['Tail Risk', 'Fat Tails', 'Risk Modeling', 'Black Swan Events']
    }
  ],
  
  // Default parameter values
  defaultParameters: {
    H: 0.5,
    seriesLength: 252,
    volatility: 0.2,
    seed: 42
  },
  
  // Configuration
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
  
  // Accessibility features
  accessibility: {
    keyboardNavigation: true,
    screenReaderSupport: true,
    highContrastMode: true,
    focusManagement: true,
    ariaLabels: {
      parameterControls: 'Tutorial parameter controls',
      chartArea: 'Interactive charts showing Hurst Exponent behavior',
      phaseNavigation: 'Tutorial phase navigation',
      progressIndicator: 'Tutorial progress indicator'
    }
  },
  
  // Performance optimizations
  performance: {
    lazyLoadPhases: true,
    memoizeCalculations: true,
    debounceParameterUpdates: 300,
    virtualizeCharts: false,
    preloadNextPhase: true
  },
  
  // Educational metadata
  educational: {
    bloomsTaxonomy: ['Understanding', 'Applying', 'Analyzing'],
    learningStyle: ['Visual', 'Kinesthetic', 'Analytical'],
    assessmentType: 'Interactive Exploration',
    cognitiveLoad: 'Medium',
    scaffolding: {
      conceptualSupport: true,
      proceduralSupport: true,
      strategicSupport: true
    }
  },
  
  // Technical metadata
  version: '1.0.0',
  lastUpdated: new Date().toISOString(),
  author: 'Interactive Learning Tutorials',
  
  // Related tutorials and resources
  relatedTutorials: [
    'kelly-criterion',
    'black-scholes-time',
    'expected-shortfall'
  ],
  
  // External resources
  resources: [
    {
      type: 'paper',
      title: 'Long-term memory in stock market prices',
      author: 'Lo, A.W.',
      url: 'https://example.com/lo-hurst-paper',
      description: 'Seminal paper on Hurst Exponent applications in finance'
    },
    {
      type: 'book',
      title: 'Fractals and Scaling in Finance',
      author: 'Mandelbrot, B.B.',
      description: 'Comprehensive treatment of fractal geometry in financial markets'
    }
  ],
  
  // Keywords for search
  keywords: [
    'hurst exponent',
    'time series analysis',
    'market memory',
    'persistence',
    'mean reversion',
    'trending markets',
    'fractional brownian motion',
    'long-term memory',
    'market efficiency',
    'risk management'
  ]
}

export default hurstExponentTutorial