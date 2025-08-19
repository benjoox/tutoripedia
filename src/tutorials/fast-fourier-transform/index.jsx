import { IconWaveSquare } from '@tabler/icons-react'
import { useFastFourierTransform } from '../../hooks/tutorials/useFastFourierTransform'
import { fastFourierTransformParameters } from './parameters'
import { 
  IntroductionPhase, 
  FrequencyDomainPhase, 
  WindowingPhase, 
  SamplingPhase 
} from './phases'

/**
 * Fast Fourier Transform Tutorial Definition
 * 
 * This tutorial explores the Fast Fourier Transform (FFT) algorithm and its applications
 * in signal processing, demonstrating how signals can be analyzed in both time and frequency domains.
 */
export const fastFourierTransformTutorial = {
  // Basic metadata
  id: 'fast-fourier-transform',
  title: 'Fast Fourier Transform: From Time to Frequency',
  shortTitle: 'Fast Fourier Transform',
  description: 'Explore the FFT algorithm and learn how to analyze signals in both time and frequency domains, understanding sampling, windowing, and spectral analysis.',
  
  // Visual and categorization
  icon: <IconWaveSquare className="w-6 h-6" />,
  difficulty: 'intermediate',
  duration: '25-35 minutes',
  estimatedTime: 30, // minutes
  
  // Topic classification
  topics: ['Signal Processing', 'Fourier Transform', 'Frequency Analysis', 'Digital Signal Processing'],
  categories: ['signal-processing', 'mathematics', 'engineering'],
  tags: ['fft', 'fourier-transform', 'frequency-domain', 'time-domain', 'sampling', 'windowing', 'spectral-analysis'],
  
  // Prerequisites and learning objectives
  prerequisites: [
    'Basic understanding of sine waves and trigonometry',
    'Familiarity with the concept of frequency',
    'Basic knowledge of sampling and digital signals',
    'Understanding of mathematical functions'
  ],
  
  learningObjectives: [
    'Understand the relationship between time and frequency domains',
    'Learn how the Fast Fourier Transform works conceptually',
    'Explore the effects of sampling rate on signal analysis',
    'Understand windowing and its role in reducing spectral leakage',
    'Learn about the Nyquist theorem and aliasing',
    'Apply FFT concepts to analyze composite signals'
  ],
  
  // Tutorial components
  hook: useFastFourierTransform,
  parameters: fastFourierTransformParameters,
  phases: [
    {
      id: 'introduction',
      title: 'Time Domain Signals',
      description: 'Understand how signals appear in the time domain and what information they contain',
      content: IntroductionPhase,
      estimatedTime: 8,
      concepts: ['Time Domain', 'Signal Composition', 'Sinusoidal Signals']
    },
    {
      id: 'frequency-domain',
      title: 'Frequency Domain Analysis',
      description: 'Learn how the FFT reveals the frequency content of signals',
      content: FrequencyDomainPhase,
      estimatedTime: 8,
      concepts: ['Frequency Domain', 'FFT', 'Spectral Analysis']
    },
    {
      id: 'windowing',
      title: 'Windowing Functions',
      description: 'Explore how windowing reduces spectral leakage and improves analysis',
      content: WindowingPhase,
      estimatedTime: 7,
      concepts: ['Windowing', 'Spectral Leakage', 'Signal Processing']
    },
    {
      id: 'sampling',
      title: 'Sampling and Nyquist Theorem',
      description: 'Understand sampling requirements and the Nyquist criterion',
      content: SamplingPhase,
      estimatedTime: 7,
      concepts: ['Sampling Theory', 'Nyquist Theorem', 'Aliasing']
    }
  ],
  
  // Default parameter values
  defaultParameters: {
    frequency1: 5,
    frequency2: 15,
    amplitude1: 1,
    amplitude2: 0.5,
    phase1: 0,
    phase2: 0,
    sampleRate: 100,
    duration: 2,
    noiseLevel: 0.1,
    windowFunction: 'none'
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
    field: 'signal-processing',
    concepts: [
      'fast-fourier-transform',
      'frequency-domain-analysis',
      'time-domain-analysis',
      'sampling-theory',
      'windowing-functions',
      'spectral-analysis'
    ],
    skills: [
      'signal-analysis',
      'frequency-analysis',
      'digital-signal-processing',
      'spectral-interpretation'
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
export const validateTutorial = (tutorial = fastFourierTransformTutorial) => {
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
export const getTutorialMetadata = (tutorial = fastFourierTransformTutorial) => {
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
  const params = { ...fastFourierTransformTutorial.defaultParameters, ...customParams }
  return {
    ...fastFourierTransformTutorial,
    initialParameters: params
  }
}

export default fastFourierTransformTutorial