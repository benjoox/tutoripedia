import { IconChartLine } from '@tabler/icons-react'
import { useFFTFinance } from '../../hooks/tutorials/useFFTFinance'
import { fftFinanceParameters } from './parameters'
import { 
  IntroductionPhase, 
  FFTCyclesPhase, 
  StrategyPhase, 
  RiskManagementPhase 
} from './phases'

export const fftFinanceTutorial = {
  // Basic metadata
  id: 'fft-finance',
  title: 'Fast Fourier Transform in Finance',
  shortTitle: 'FFT Finance',
  description: 'Learn how to use FFT to identify market cycles and develop trading strategies based on frequency domain analysis of financial time series.',
  
  // Visual and categorization
  icon: <IconChartLine className="w-6 h-6" />,
  difficulty: 'advanced',
  duration: '30-40 minutes',
  estimatedTime: 35,
  
  // Topic classification
  topics: ['Signal Processing', 'Market Analysis', 'Quantitative Finance', 'Frequency Domain'],
  categories: ['advanced-analytics', 'trading-strategies', 'mathematical-finance'],
  tags: ['fft', 'fourier-transform', 'market-cycles', 'frequency-analysis', 'signal-processing', 'trading'],
  
  // Prerequisites and learning objectives
  prerequisites: [
    'Basic understanding of financial markets and price charts',
    'Familiarity with mathematical concepts like sine waves and frequencies',
    'Knowledge of trading strategies and market cycles',
    'Understanding of statistical analysis and data interpretation'
  ],
  
  learningObjectives: [
    'Understand how financial time series can be decomposed into frequency components',
    'Learn to identify dominant market cycles using FFT analysis',
    'Develop strategies based on cyclical patterns in market data',
    'Recognize the limitations and risks of frequency-based trading approaches',
    'Apply FFT concepts to real-world financial analysis and risk management'
  ],
  
  // Tutorial components
  hook: useFFTFinance,
  parameters: fftFinanceParameters,
  phases: [
    {
      id: 'introduction',
      title: 'Financial Data as a Signal',
      description: 'Understanding how market data can be viewed as signals with underlying cyclical components',
      content: IntroductionPhase,
      estimatedTime: 8,
      concepts: ['Time Domain vs Frequency Domain', 'Market Cycles', 'Signal Decomposition']
    },
    {
      id: 'fft-cycles',
      title: 'Uncovering Market Cycles',
      description: 'Using FFT to transform price data and identify dominant cyclical patterns',
      content: FFTCyclesPhase,
      estimatedTime: 10,
      concepts: ['Fast Fourier Transform', 'Frequency Spectrum', 'Cycle Identification']
    },
    {
      id: 'strategy',
      title: 'Financial Strategy & Use Cases',
      description: 'Developing trading strategies based on identified market cycles',
      content: StrategyPhase,
      estimatedTime: 9,
      concepts: ['Mean Reversion', 'Trend Following', 'Cycle-Based Trading']
    },
    {
      id: 'risk-management',
      title: 'Implications & Risk Management',
      description: 'Understanding limitations and implementing proper risk controls',
      content: RiskManagementPhase,
      estimatedTime: 8,
      concepts: ['Market Non-Stationarity', 'Overfitting Risk', 'Validation Methods']
    }
  ],
  
  // Default parameter values
  defaultParameters: {
    period1: 20,
    period2: 50,
    amplitude1: 1.0,
    amplitude2: 0.8,
    noiseLevel: 0.3,
    dataPoints: 200,
    trendStrength: 0.02
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
    autoSaveProgress: false,
    allowParameterExport: true,
    showValidationWarnings: true
  },
  
  // Accessibility features
  accessibility: {
    keyboardNavigation: true,
    screenReaderSupport: true,
    highContrastMode: true,
    focusManagement: true,
    alternativeText: {
      charts: 'Interactive charts showing FFT analysis of financial data',
      controls: 'Parameter controls for adjusting market cycle characteristics'
    }
  },
  
  // Performance optimization
  performance: {
    lazyLoadCharts: true,
    debounceParameterUpdates: true,
    memoizeCalculations: true,
    virtualizeDataSets: false,
    optimizeRedraws: true
  },
  
  // Educational features
  educational: {
    showFormulas: true,
    includeReferences: true,
    providePracticalExamples: true,
    enableComparisons: true,
    showCalculationSteps: false,
    includeRealWorldContext: true
  },
  
  // References and further reading
  references: [
    {
      title: 'Digital Signal Processing in Finance',
      author: 'Various',
      type: 'academic',
      url: '#',
      description: 'Academic papers on applying DSP techniques to financial analysis'
    },
    {
      title: 'Quantitative Trading Strategies',
      author: 'Industry Research',
      type: 'industry',
      url: '#',
      description: 'Industry research on cycle-based trading approaches'
    },
    {
      title: 'Market Microstructure and Frequency Analysis',
      author: 'Financial Engineering',
      type: 'technical',
      url: '#',
      description: 'Technical analysis of high-frequency market data patterns'
    }
  ],
  
  // Practical applications
  applications: [
    {
      title: 'Algorithmic Trading',
      description: 'Using FFT to identify optimal entry/exit points based on cyclical patterns',
      difficulty: 'advanced',
      timeToImplement: '2-4 weeks'
    },
    {
      title: 'Risk Management',
      description: 'Decomposing portfolio volatility into frequency components for better risk assessment',
      difficulty: 'intermediate',
      timeToImplement: '1-2 weeks'
    },
    {
      title: 'Market Regime Detection',
      description: 'Identifying changes in market behavior through frequency domain analysis',
      difficulty: 'advanced',
      timeToImplement: '3-6 weeks'
    }
  ],
  
  // Version and metadata
  version: '1.0.0',
  lastUpdated: new Date().toISOString(),
  author: 'Interactive Learning Tutorials',
  reviewedBy: 'Quantitative Finance Team',
  
  // Tutorial-specific metadata
  mathComplexity: 'high',
  codingRequired: false,
  industryRelevance: ['hedge-funds', 'prop-trading', 'risk-management', 'quantitative-research'],
  regulatoryConsiderations: [
    'Market manipulation regulations when implementing cycle-based strategies',
    'Risk disclosure requirements for algorithmic trading systems',
    'Model validation requirements for systematic trading approaches'
  ]
}

export default fftFinanceTutorial