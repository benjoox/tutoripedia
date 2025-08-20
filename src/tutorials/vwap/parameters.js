/**
 * Parameter definitions for VWAP (Volume-Weighted Average Price) tutorial
 * Includes formatters, descriptions, validation rules, and UI configuration
 */

export const vwapParameters = [
  {
    key: 'stockPrice',
    label: 'Base Stock Price',
    type: 'slider',
    min: 50,
    max: 200,
    step: 1,
    unit: '$',
    defaultValue: 100,
    formatter: (value) => `$${value.toFixed(2)}`,
    description: 'Starting price for the stock simulation. This serves as the baseline around which intraday prices will fluctuate.',
    validation: {
      required: true,
      min: 50,
      max: 200,
      type: 'number'
    },
    category: 'market',
    importance: 'high',
    tooltip: 'The base price level for the stock. Intraday prices will vary around this value based on volatility settings.'
  },
  {
    key: 'volumeMultiplier',
    label: 'Volume Multiplier',
    type: 'slider',
    min: 0.5,
    max: 3.0,
    step: 0.1,
    unit: 'x',
    defaultValue: 1.0,
    formatter: (value) => `${value.toFixed(1)}x`,
    description: 'Multiplier for trading volume levels. Higher values simulate more active trading periods.',
    validation: {
      required: true,
      min: 0.5,
      max: 3.0,
      type: 'number'
    },
    category: 'volume',
    importance: 'high',
    tooltip: 'Controls the overall volume levels. Higher multipliers create more active trading scenarios with larger volume bars.'
  },
  {
    key: 'marketVolatility',
    label: 'Market Volatility',
    type: 'slider',
    min: 0.1,
    max: 0.5,
    step: 0.01,
    unit: '%',
    defaultValue: 0.2,
    formatter: (value) => `${(value * 100).toFixed(1)}%`,
    description: 'Controls the randomness and magnitude of price movements throughout the trading day.',
    validation: {
      required: true,
      min: 0.1,
      max: 0.5,
      type: 'number'
    },
    category: 'market',
    importance: 'high',
    tooltip: 'Higher volatility creates more dramatic price swings, affecting how much VWAP differs from simple averages.'
  },
  {
    key: 'timeIntervals',
    label: 'Time Intervals',
    type: 'slider',
    min: 20,
    max: 100,
    step: 5,
    unit: 'periods',
    defaultValue: 50,
    formatter: (value) => `${value} periods`,
    description: 'Number of intraday time periods for the simulation. More intervals provide finer granularity.',
    validation: {
      required: true,
      min: 20,
      max: 100,
      type: 'number'
    },
    category: 'calculation',
    importance: 'medium',
    tooltip: 'More time intervals create smoother charts and more detailed VWAP calculations, but may slow performance.'
  },
  {
    key: 'marketCondition',
    label: 'Market Condition',
    type: 'select',
    options: [
      { value: 'trending', label: 'Trending Market' },
      { value: 'choppy', label: 'Choppy Market' },
      { value: 'mixed', label: 'Mixed Conditions' }
    ],
    defaultValue: 'trending',
    formatter: (value) => {
      const option = vwapParameters.find(p => p.key === 'marketCondition')?.options?.find(o => o.value === value);
      return option ? option.label : value;
    },
    description: 'Market behavior pattern that affects how prices move relative to volume throughout the day.',
    validation: {
      required: true,
      type: 'string',
      enum: ['trending', 'choppy', 'mixed']
    },
    category: 'scenario',
    importance: 'high',
    tooltip: 'Trending markets show consistent directional movement, while choppy markets have frequent reversals and noise.'
  },
  {
    key: 'volumePattern',
    label: 'Volume Pattern',
    type: 'select',
    options: [
      { value: 'u-shaped', label: 'U-Shaped (High at Open/Close)' },
      { value: 'declining', label: 'Declining Throughout Day' },
      { value: 'random', label: 'Random Distribution' },
      { value: 'spike', label: 'Mid-Day Volume Spike' }
    ],
    defaultValue: 'u-shaped',
    formatter: (value) => {
      const option = vwapParameters.find(p => p.key === 'volumePattern')?.options?.find(o => o.value === value);
      return option ? option.label : value;
    },
    description: 'Intraday volume distribution pattern. U-shaped is most common in real markets.',
    validation: {
      required: true,
      type: 'string',
      enum: ['u-shaped', 'declining', 'random', 'spike']
    },
    category: 'volume',
    importance: 'medium',
    tooltip: 'Real markets typically show U-shaped volume (high at open/close, lower midday). Other patterns help illustrate different scenarios.'
  }
];

/**
 * Parameter validation functions
 */
export const validateParameter = (key, value, parameters = vwapParameters) => {
  const param = parameters.find(p => p.key === key);
  if (!param) {
    return { isValid: false, error: `Unknown parameter: ${key}` };
  }

  const { validation } = param;
  
  // Check if required
  if (validation.required && (value === null || value === undefined || value === '')) {
    return { isValid: false, error: `${param.label} is required` };
  }

  // Check type
  if (validation.type === 'number' && typeof value !== 'number') {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      return { isValid: false, error: `${param.label} must be a number` };
    }
    value = numValue;
  }

  // Check range for numbers
  if (typeof value === 'number') {
    if (validation.min !== undefined && value < validation.min) {
      return { isValid: false, error: `${param.label} must be at least ${validation.min}` };
    }
    if (validation.max !== undefined && value > validation.max) {
      return { isValid: false, error: `${param.label} must be at most ${validation.max}` };
    }
  }

  // Check enum values for strings
  if (validation.type === 'string' && validation.enum) {
    if (!validation.enum.includes(value)) {
      return { isValid: false, error: `${param.label} must be one of: ${validation.enum.join(', ')}` };
    }
  }

  return { isValid: true, value };
};

/**
 * Validate all parameters at once
 */
export const validateAllParameters = (parameterValues, parameters = vwapParameters) => {
  const errors = {};
  const validatedValues = {};
  let isValid = true;

  parameters.forEach(param => {
    const value = parameterValues[param.key];
    const validation = validateParameter(param.key, value, parameters);
    
    if (!validation.isValid) {
      errors[param.key] = validation.error;
      isValid = false;
    } else {
      validatedValues[param.key] = validation.value !== undefined ? validation.value : value;
    }
  });

  return { isValid, errors, validatedValues };
};

/**
 * Get default parameter values
 */
export const getDefaultParameters = (parameters = vwapParameters) => {
  const defaults = {};
  parameters.forEach(param => {
    defaults[param.key] = param.defaultValue;
  });
  return defaults;
};

/**
 * Get parameter by key
 */
export const getParameter = (key, parameters = vwapParameters) => {
  return parameters.find(p => p.key === key);
};

/**
 * Get parameters by category
 */
export const getParametersByCategory = (category, parameters = vwapParameters) => {
  return parameters.filter(p => p.category === category);
};

/**
 * Get parameters by importance level
 */
export const getParametersByImportance = (importance, parameters = vwapParameters) => {
  return parameters.filter(p => p.importance === importance);
};

/**
 * Format parameter value for display
 */
export const formatParameterValue = (key, value, parameters = vwapParameters) => {
  const param = getParameter(key, parameters);
  if (!param || !param.formatter) {
    return value?.toString() || '';
  }
  return param.formatter(value);
};

/**
 * Get parameter categories with their parameters
 */
export const getParameterCategories = (parameters = vwapParameters) => {
  const categories = {};
  parameters.forEach(param => {
    if (!categories[param.category]) {
      categories[param.category] = [];
    }
    categories[param.category].push(param);
  });
  return categories;
};

/**
 * Validate parameter combinations for logical consistency
 */
export const validateParameterCombinations = (parameterValues) => {
  const warnings = [];
  
  // Check if high volatility with trending market might be contradictory
  if (parameterValues.marketVolatility > 0.35 && parameterValues.marketCondition === 'trending') {
    warnings.push('High volatility with trending market may create conflicting price patterns');
  }
  
  // Check if very low volume multiplier with spike pattern makes sense
  if (parameterValues.volumeMultiplier < 0.7 && parameterValues.volumePattern === 'spike') {
    warnings.push('Low volume multiplier may make volume spikes less visible');
  }
  
  // Check if too many time intervals might impact performance
  if (parameterValues.timeIntervals > 80) {
    warnings.push('High number of time intervals may impact chart performance');
  }
  
  return warnings;
};

/**
 * Get realistic parameter ranges based on market conditions
 */
export const getRealisticRanges = (marketCondition) => {
  const ranges = {
    trending: {
      marketVolatility: { min: 0.1, max: 0.25, recommended: 0.15 },
      volumeMultiplier: { min: 0.8, max: 2.0, recommended: 1.2 }
    },
    choppy: {
      marketVolatility: { min: 0.2, max: 0.5, recommended: 0.35 },
      volumeMultiplier: { min: 0.5, max: 1.5, recommended: 0.8 }
    },
    mixed: {
      marketVolatility: { min: 0.15, max: 0.35, recommended: 0.25 },
      volumeMultiplier: { min: 0.7, max: 2.5, recommended: 1.0 }
    }
  };
  
  return ranges[marketCondition] || ranges.mixed;
};

/**
 * Parameter metadata for UI rendering
 */
export const parameterMetadata = {
  categories: {
    market: {
      label: 'Market Parameters',
      description: 'Basic market conditions and price levels',
      icon: 'trending-up',
      order: 1
    },
    volume: {
      label: 'Volume Settings',
      description: 'Trading volume levels and patterns',
      icon: 'bar-chart-3',
      order: 2
    },
    calculation: {
      label: 'Calculation Settings',
      description: 'Parameters affecting VWAP calculation granularity',
      icon: 'calculator',
      order: 3
    },
    scenario: {
      label: 'Market Scenarios',
      description: 'Different market behavior patterns to explore',
      icon: 'shuffle',
      order: 4
    }
  },
  importance: {
    high: {
      label: 'High Impact',
      description: 'Parameters with significant effect on VWAP behavior',
      color: 'destructive'
    },
    medium: {
      label: 'Medium Impact',
      description: 'Parameters with moderate effect on VWAP calculations',
      color: 'warning'
    },
    low: {
      label: 'Low Impact',
      description: 'Parameters with minimal effect on VWAP results',
      color: 'muted'
    }
  }
};