export const fastFourierTransformParameters = [
  {
    key: 'frequency1',
    label: 'First Frequency (Hz)',
    description: 'Frequency of the first sinusoidal component',
    type: 'slider',
    min: 1,
    max: 25,
    step: 0.5,
    defaultValue: 5,
    format: (value) => `${value} Hz`,
    category: 'Signal Components',
    tooltip: 'The frequency of the first sine wave in the signal',
    validation: {
      required: true,
      min: 1,
      max: 25,
      message: 'Frequency must be between 1 and 25 Hz'
    },
    impact: 'high',
    relatedConcepts: ['Frequency Domain', 'Sinusoidal Signals']
  },
  {
    key: 'frequency2',
    label: 'Second Frequency (Hz)',
    description: 'Frequency of the second sinusoidal component',
    type: 'slider',
    min: 1,
    max: 25,
    step: 0.5,
    defaultValue: 15,
    format: (value) => `${value} Hz`,
    category: 'Signal Components',
    tooltip: 'The frequency of the second sine wave in the signal',
    validation: {
      required: true,
      min: 1,
      max: 25,
      message: 'Frequency must be between 1 and 25 Hz'
    },
    impact: 'high',
    relatedConcepts: ['Frequency Domain', 'Signal Composition']
  },
  {
    key: 'amplitude1',
    label: 'First Amplitude',
    description: 'Amplitude of the first sinusoidal component',
    type: 'slider',
    min: 0,
    max: 2,
    step: 0.1,
    defaultValue: 1,
    format: (value) => `${value}`,
    category: 'Signal Components',
    tooltip: 'The amplitude (strength) of the first sine wave',
    validation: {
      required: true,
      min: 0,
      max: 2,
      message: 'Amplitude must be between 0 and 2'
    },
    impact: 'medium',
    relatedConcepts: ['Signal Amplitude', 'Wave Properties']
  },
  {
    key: 'amplitude2',
    label: 'Second Amplitude',
    description: 'Amplitude of the second sinusoidal component',
    type: 'slider',
    min: 0,
    max: 2,
    step: 0.1,
    defaultValue: 0.5,
    format: (value) => `${value}`,
    category: 'Signal Components',
    tooltip: 'The amplitude (strength) of the second sine wave',
    validation: {
      required: true,
      min: 0,
      max: 2,
      message: 'Amplitude must be between 0 and 2'
    },
    impact: 'medium',
    relatedConcepts: ['Signal Amplitude', 'Wave Superposition']
  },
  {
    key: 'phase1',
    label: 'First Phase (radians)',
    description: 'Phase shift of the first sinusoidal component',
    type: 'slider',
    min: 0,
    max: 6.28,
    step: 0.1,
    defaultValue: 0,
    format: (value) => `${value.toFixed(2)} rad`,
    category: 'Signal Components',
    tooltip: 'The phase shift of the first sine wave (0 to 2π radians)',
    validation: {
      required: true,
      min: 0,
      max: 6.28,
      message: 'Phase must be between 0 and 2π radians'
    },
    impact: 'low',
    relatedConcepts: ['Phase Shift', 'Wave Properties']
  },
  {
    key: 'phase2',
    label: 'Second Phase (radians)',
    description: 'Phase shift of the second sinusoidal component',
    type: 'slider',
    min: 0,
    max: 6.28,
    step: 0.1,
    defaultValue: 0,
    format: (value) => `${value.toFixed(2)} rad`,
    category: 'Signal Components',
    tooltip: 'The phase shift of the second sine wave (0 to 2π radians)',
    validation: {
      required: true,
      min: 0,
      max: 6.28,
      message: 'Phase must be between 0 and 2π radians'
    },
    impact: 'low',
    relatedConcepts: ['Phase Shift', 'Signal Analysis']
  },
  {
    key: 'sampleRate',
    label: 'Sample Rate (Hz)',
    description: 'Number of samples per second',
    type: 'slider',
    min: 50,
    max: 200,
    step: 10,
    defaultValue: 100,
    format: (value) => `${value} Hz`,
    category: 'Sampling Parameters',
    tooltip: 'The rate at which the continuous signal is sampled',
    validation: {
      required: true,
      min: 50,
      max: 200,
      message: 'Sample rate must be between 50 and 200 Hz'
    },
    impact: 'high',
    relatedConcepts: ['Sampling Theory', 'Nyquist Theorem']
  },
  {
    key: 'duration',
    label: 'Duration (seconds)',
    description: 'Length of the signal in time',
    type: 'slider',
    min: 1,
    max: 5,
    step: 0.5,
    defaultValue: 2,
    format: (value) => `${value} s`,
    category: 'Sampling Parameters',
    tooltip: 'The total duration of the signal to analyze',
    validation: {
      required: true,
      min: 1,
      max: 5,
      message: 'Duration must be between 1 and 5 seconds'
    },
    impact: 'medium',
    relatedConcepts: ['Signal Length', 'Frequency Resolution']
  },
  {
    key: 'noiseLevel',
    label: 'Noise Level',
    description: 'Amount of random noise added to the signal',
    type: 'slider',
    min: 0,
    max: 0.5,
    step: 0.01,
    defaultValue: 0.1,
    format: (value) => `${(value * 100).toFixed(0)}%`,
    category: 'Signal Processing',
    tooltip: 'Random noise added to simulate real-world signals',
    validation: {
      required: true,
      min: 0,
      max: 0.5,
      message: 'Noise level must be between 0 and 50%'
    },
    impact: 'medium',
    relatedConcepts: ['Signal-to-Noise Ratio', 'Real-world Signals']
  },
  {
    key: 'windowFunction',
    label: 'Window Function',
    description: 'Windowing function applied before FFT',
    type: 'select',
    options: [
      { value: 'none', label: 'None (Rectangular)' },
      { value: 'hanning', label: 'Hanning Window' },
      { value: 'hamming', label: 'Hamming Window' }
    ],
    defaultValue: 'none',
    category: 'Signal Processing',
    tooltip: 'Window function to reduce spectral leakage',
    validation: {
      required: true,
      message: 'Please select a window function'
    },
    impact: 'medium',
    relatedConcepts: ['Windowing', 'Spectral Leakage', 'Signal Processing']
  }
]

export const parameterCategories = [
  {
    id: 'signal-components',
    name: 'Signal Components',
    description: 'Properties of the individual sine waves',
    icon: 'wave',
    parameters: ['frequency1', 'frequency2', 'amplitude1', 'amplitude2', 'phase1', 'phase2']
  },
  {
    id: 'sampling-parameters',
    name: 'Sampling Parameters',
    description: 'How the signal is digitized',
    icon: 'clock',
    parameters: ['sampleRate', 'duration']
  },
  {
    id: 'signal-processing',
    name: 'Signal Processing',
    description: 'Processing applied to the signal',
    icon: 'filter',
    parameters: ['noiseLevel', 'windowFunction']
  }
]

// Add validation and utility functions
export const validateParameters = (parameters) => {
  const errors = []
  const warnings = []
  
  // Check Nyquist criterion
  const maxFreq = Math.max(parameters.frequency1, parameters.frequency2)
  if (maxFreq >= parameters.sampleRate / 2) {
    errors.push('Signal frequencies must be less than half the sample rate (Nyquist criterion)')
  }
  
  // Check for frequency separation
  if (Math.abs(parameters.frequency1 - parameters.frequency2) < 2) {
    warnings.push('Frequencies are very close - they may be difficult to distinguish in the spectrum')
  }
  
  // Check signal duration for frequency resolution
  const freqResolution = 1 / parameters.duration
  if (freqResolution > 1) {
    warnings.push('Short duration may result in poor frequency resolution')
  }
  
  return { 
    isValid: errors.length === 0, 
    errors, 
    warnings 
  }
}

export const getDefaultParameters = () => {
  const defaults = {}
  fastFourierTransformParameters.forEach(param => {
    defaults[param.key] = param.defaultValue
  })
  return defaults
}