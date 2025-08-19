# Adding a New Tutorial - Step-by-Step Guide

This guide walks you through adding a new tutorial to the Interactive Learning Tutorials application.

## Prerequisites

- You have a `phases.jsx` file with your tutorial phases defined
- Basic understanding of React hooks and components
- Familiarity with the tutorial structure

## Step-by-Step Instructions

### Step 1: Create the Tutorial Hook

Create a new hook file in `src/hooks/tutorials/` that manages the tutorial's state and calculations.

**File:** `src/hooks/tutorials/use[TutorialName].js`

```javascript
import { useState, useMemo, useCallback } from 'react'

export const use[TutorialName] = () => {
  // 1. Define parameter state
  const [parameters, setParameters] = useState({
    // Add your default parameter values here
    parameter1: defaultValue1,
    parameter2: defaultValue2,
    // ... more parameters
  })

  // 2. Create derived calculations
  const calculations = useMemo(() => {
    // Add your calculations based on parameters
    const calculatedValue1 = // ... calculation logic
    const calculatedValue2 = // ... calculation logic
    
    return {
      calculatedValue1,
      calculatedValue2,
      // ... more calculated values
    }
  }, [parameters])

  // 3. Generate chart data
  const chartData = useMemo(() => {
    // Create data for your charts
    const chartData1 = []
    const chartData2 = []
    // ... populate chart data arrays
    
    return {
      chartData1,
      chartData2,
      // ... more chart datasets
    }
  }, [parameters, calculations])

  // 4. Parameter update functions
  const updateParameter = useCallback((key, value) => {
    setParameters(prev => ({
      ...prev,
      [key]: value
    }))
  }, [])

  const resetParameters = useCallback(() => {
    setParameters({
      // Reset to default values
    })
  }, [])

  // 5. Return hook interface
  return {
    parameters: {
      ...parameters,
      ...calculations
    },
    chartData,
    updateParameter,
    resetParameters,
    calculations,
    isValid: true // Add validation logic if needed
  }
}
```

### Step 2: Create the Parameters Definition

Create a parameters file that defines the interactive controls for your tutorial.

**File:** `src/tutorials/[tutorial-name]/parameters.js`

```javascript
export const [tutorialName]Parameters = [
  {
    key: 'parameter1',
    label: 'Parameter 1 Label',
    description: 'Description of what this parameter does',
    type: 'slider', // or 'input', 'select'
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 50,
    format: (value) => `${value}%`, // How to display the value
    category: 'Basic Parameters',
    tooltip: 'Additional help text',
    validation: {
      required: true,
      min: 0,
      max: 100,
      message: 'Parameter must be between 0 and 100'
    },
    impact: 'high', // 'low', 'medium', 'high'
    relatedConcepts: ['Concept 1', 'Concept 2']
  },
  // ... more parameters
]

export const parameterCategories = [
  {
    id: 'basic',
    name: 'Basic Parameters',
    description: 'Core inputs for the tutorial',
    icon: 'calculator',
    parameters: ['parameter1', 'parameter2']
  }
]

// Add validation and utility functions
export const validateParameters = (parameters) => {
  // Add validation logic
  return { isValid: true, errors: [], warnings: [] }
}

export const getDefaultParameters = () => {
  const defaults = {}
  [tutorialName]Parameters.forEach(param => {
    defaults[param.key] = param.defaultValue
  })
  return defaults
}
```

### Step 3: Fix the Phases File

Update your existing `phases.jsx` file to fix imports and structure:

```javascript
// At the top of the file, consolidate imports
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine 
} from 'recharts'
import { IconInfoCircle } from '@tabler/icons-react'

// Remove duplicate imports and unused icons
// Make sure each phase is properly exported
export const Phase1Name = ({ tutorialHook }) => {
  const { parameters, chartData } = tutorialHook()
  // ... phase content
}

export const Phase2Name = ({ tutorialHook }) => {
  // ... phase content
}

// ... more phases
```

### Step 4: Create the Main Tutorial Definition

Create the main tutorial file that ties everything together.

**File:** `src/tutorials/[tutorial-name]/index.jsx`

```javascript
import { Icon[TutorialIcon] } from '@tabler/icons-react'
import { use[TutorialName] } from '../../hooks/tutorials/use[TutorialName]'
import { [tutorialName]Parameters } from './parameters'
import { 
  Phase1Name, 
  Phase2Name, 
  Phase3Name, 
  Phase4Name 
} from './phases'

export const [tutorialName]Tutorial = {
  // Basic metadata
  id: 'tutorial-id',
  title: 'Tutorial Title',
  shortTitle: 'Short Title',
  description: 'Tutorial description for the home page',
  
  // Visual and categorization
  icon: <Icon[TutorialIcon] className="w-6 h-6" />,
  difficulty: 'intermediate', // 'beginner', 'intermediate', 'advanced'
  duration: '25-35 minutes',
  estimatedTime: 30,
  
  // Topic classification
  topics: ['Topic 1', 'Topic 2', 'Topic 3'],
  categories: ['category-1', 'category-2'],
  tags: ['tag1', 'tag2', 'tag3'],
  
  // Prerequisites and learning objectives
  prerequisites: [
    'Prerequisite 1',
    'Prerequisite 2'
  ],
  
  learningObjectives: [
    'Learning objective 1',
    'Learning objective 2'
  ],
  
  // Tutorial components
  hook: use[TutorialName],
  parameters: [tutorialName]Parameters,
  phases: [
    {
      id: 'phase1-id',
      title: 'Phase 1 Title',
      description: 'Phase 1 description',
      content: Phase1Name,
      estimatedTime: 8,
      concepts: ['Concept 1', 'Concept 2']
    },
    {
      id: 'phase2-id',
      title: 'Phase 2 Title',
      description: 'Phase 2 description',
      content: Phase2Name,
      estimatedTime: 7,
      concepts: ['Concept 3', 'Concept 4']
    }
    // ... more phases
  ],
  
  // Default parameter values
  defaultParameters: {
    parameter1: defaultValue1,
    parameter2: defaultValue2
  },
  
  // Configuration (copy from existing tutorial)
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
  
  // Copy other sections from existing tutorial...
  accessibility: { /* ... */ },
  performance: { /* ... */ },
  educational: { /* ... */ },
  version: '1.0.0',
  lastUpdated: new Date().toISOString(),
  author: 'Interactive Learning Tutorials'
}

export default [tutorialName]Tutorial
```

### Step 5: Register the Tutorial

Update `src/tutorials/index.js` to include your new tutorial:

```javascript
// Add import at the top
import { [tutorialName]Tutorial } from './[tutorial-name]/index.jsx'

// Add registration in initializeRegistry function
export const initializeRegistry = () => {
  try {
    // Existing tutorials...
    registerTutorial(blackScholesTimeTutorial)
    registerTutorial(kellyCriterionTutorial)
    
    // Add your new tutorial
    registerTutorial([tutorialName]Tutorial)
    
    console.log('Tutorial registry initialized successfully')
    console.log('Registry stats:', getRegistryStats())
    
    return true
  } catch (error) {
    console.error('Failed to initialize tutorial registry:', error)
    return false
  }
}
```

## Example: Expected Shortfall Tutorial

For the Expected Shortfall tutorial specifically, you would:

1. **Hook file:** `src/hooks/tutorials/useExpectedShortfall.js`
2. **Parameters file:** `src/tutorials/expected-shortfall/parameters.js`
3. **Main tutorial file:** `src/tutorials/expected-shortfall/index.jsx`
4. **Fix phases file:** Update `src/tutorials/expected-shortfall/phases.jsx`
5. **Register:** Add to `src/tutorials/index.js`

## Common Issues and Solutions

### Import Errors
- Consolidate all chart imports at the top of phases.jsx
- Remove unused icon imports
- Make sure all components are properly exported

### Hook Errors
- Ensure all calculations are wrapped in useMemo
- Make sure parameter updates use useCallback
- Validate that chartData structure matches what phases expect

### Registration Errors
- Check that the tutorial ID is unique
- Ensure all required fields are present
- Verify that phases array matches the actual phase exports

## Testing Your Tutorial

1. Start the development server
2. Navigate to the home page - your tutorial should appear
3. Click on your tutorial card to open it
4. Test all phases and parameter interactions
5. Check browser console for any errors

## Next Steps

After adding your tutorial:
- Test all functionality thoroughly
- Consider adding unit tests for complex calculations
- Update documentation if needed
- Consider adding more interactive features or visualizations