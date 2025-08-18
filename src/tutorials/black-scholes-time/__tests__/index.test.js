import { describe, it, expect, vi } from 'vitest'
import {
  blackScholesTimeTutorial,
  validateTutorial,
  getTutorialMetadata,
  initializeTutorial,
  getTutorialPhase,
  getTutorialParameter
} from '../index.jsx'
import { useBlackScholesTime } from '../../../hooks/tutorials/useBlackScholesTime'
import { blackScholesTimeParameters } from '../parameters'
import { blackScholesTimePhases } from '../phases'

describe('Black-Scholes Time Tutorial Definition', () => {
  describe('Tutorial Structure', () => {
    it('should have all required fields', () => {
      const requiredFields = [
        'id', 'title', 'description', 'icon', 'difficulty', 'duration',
        'topics', 'hook', 'parameters', 'phases', 'defaultParameters'
      ]
      
      requiredFields.forEach(field => {
        expect(blackScholesTimeTutorial).toHaveProperty(field)
        expect(blackScholesTimeTutorial[field]).toBeDefined()
      })
    })

    it('should have correct basic metadata', () => {
      expect(blackScholesTimeTutorial.id).toBe('black-scholes-time')
      expect(blackScholesTimeTutorial.title).toContain('Black-Scholes')
      expect(blackScholesTimeTutorial.title).toContain('Time to Maturity')
      expect(blackScholesTimeTutorial.difficulty).toBe('intermediate')
      expect(blackScholesTimeTutorial.duration).toMatch(/\d+-\d+ minutes/)
    })

    it('should have valid topics and categories', () => {
      expect(Array.isArray(blackScholesTimeTutorial.topics)).toBe(true)
      expect(blackScholesTimeTutorial.topics.length).toBeGreaterThan(0)
      expect(blackScholesTimeTutorial.topics).toContain('Black-Scholes')
      
      expect(Array.isArray(blackScholesTimeTutorial.categories)).toBe(true)
      expect(blackScholesTimeTutorial.categories).toContain('derivatives')
      
      expect(Array.isArray(blackScholesTimeTutorial.tags)).toBe(true)
      expect(blackScholesTimeTutorial.tags).toContain('black-scholes')
    })

    it('should have educational metadata', () => {
      expect(blackScholesTimeTutorial.prerequisites).toBeDefined()
      expect(Array.isArray(blackScholesTimeTutorial.prerequisites)).toBe(true)
      expect(blackScholesTimeTutorial.prerequisites.length).toBeGreaterThan(0)
      
      expect(blackScholesTimeTutorial.learningObjectives).toBeDefined()
      expect(Array.isArray(blackScholesTimeTutorial.learningObjectives)).toBe(true)
      expect(blackScholesTimeTutorial.learningObjectives.length).toBeGreaterThan(0)
    })
  })

  describe('Tutorial Components Integration', () => {
    it('should reference the correct hook', () => {
      expect(blackScholesTimeTutorial.hook).toBe(useBlackScholesTime)
      expect(typeof blackScholesTimeTutorial.hook).toBe('function')
    })

    it('should reference the correct parameters', () => {
      expect(blackScholesTimeTutorial.parameters).toBe(blackScholesTimeParameters)
      expect(Array.isArray(blackScholesTimeTutorial.parameters)).toBe(true)
      expect(blackScholesTimeTutorial.parameters.length).toBe(5)
    })

    it('should reference the correct phases', () => {
      expect(blackScholesTimeTutorial.phases).toBe(blackScholesTimePhases)
      expect(Array.isArray(blackScholesTimeTutorial.phases)).toBe(true)
      expect(blackScholesTimeTutorial.phases.length).toBe(4)
    })

    it('should have consistent default parameters', () => {
      const defaultParams = blackScholesTimeTutorial.defaultParameters
      const paramKeys = blackScholesTimeTutorial.parameters.map(p => p.key)
      
      Object.keys(defaultParams).forEach(key => {
        expect(paramKeys).toContain(key)
      })
      
      // Check specific default values
      expect(defaultParams.timeToMaturity).toBe(90)
      expect(defaultParams.stockPrice).toBe(100)
      expect(defaultParams.strikePrice).toBe(100)
      expect(defaultParams.volatility).toBe(0.2)
      expect(defaultParams.riskFreeRate).toBe(0.05)
    })
  })

  describe('Configuration Objects', () => {
    it('should have valid config object', () => {
      const config = blackScholesTimeTutorial.config
      expect(typeof config).toBe('object')
      expect(typeof config.showParameterCategories).toBe('boolean')
      expect(typeof config.enableParameterReset).toBe('boolean')
      expect(typeof config.responsiveCharts).toBe('boolean')
    })

    it('should have accessibility configuration', () => {
      const accessibility = blackScholesTimeTutorial.accessibility
      expect(typeof accessibility).toBe('object')
      expect(typeof accessibility.keyboardNavigation).toBe('boolean')
      expect(typeof accessibility.screenReaderSupport).toBe('boolean')
    })

    it('should have performance configuration', () => {
      const performance = blackScholesTimeTutorial.performance
      expect(typeof performance).toBe('object')
      expect(typeof performance.memoizeCalculations).toBe('boolean')
      expect(typeof performance.debounceParameterUpdates).toBe('number')
      expect(performance.debounceParameterUpdates).toBeGreaterThan(0)
    })

    it('should have educational metadata', () => {
      const educational = blackScholesTimeTutorial.educational
      expect(typeof educational).toBe('object')
      expect(educational.level).toBe('undergraduate')
      expect(educational.field).toBe('quantitative-finance')
      expect(Array.isArray(educational.concepts)).toBe(true)
      expect(Array.isArray(educational.skills)).toBe(true)
    })
  })

  describe('Tutorial Validation', () => {
    it('should validate a complete tutorial successfully', () => {
      const result = validateTutorial(blackScholesTimeTutorial)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should detect missing required fields', () => {
      const incompleteTutorial = { id: 'test' }
      const result = validateTutorial(incompleteTutorial)
      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
      expect(result.errors.some(error => error.includes('title'))).toBe(true)
    })

    it('should validate hook is a function', () => {
      const invalidTutorial = { ...blackScholesTimeTutorial, hook: 'not-a-function' }
      const result = validateTutorial(invalidTutorial)
      expect(result.isValid).toBe(false)
      expect(result.errors.some(error => error.includes('hook must be a function'))).toBe(true)
    })

    it('should validate parameters are an array', () => {
      const invalidTutorial = { ...blackScholesTimeTutorial, parameters: 'not-an-array' }
      const result = validateTutorial(invalidTutorial)
      expect(result.isValid).toBe(false)
      expect(result.errors.some(error => error.includes('parameters must be an array'))).toBe(true)
    })

    it('should validate phases are an array', () => {
      const invalidTutorial = { ...blackScholesTimeTutorial, phases: 'not-an-array' }
      const result = validateTutorial(invalidTutorial)
      expect(result.isValid).toBe(false)
      expect(result.errors.some(error => error.includes('phases must be an array'))).toBe(true)
    })

    it('should validate phase structure', () => {
      const invalidPhases = [
        { title: 'Test Phase' }, // missing id and content
        { id: 'test', content: 'not-a-function' } // missing title, invalid content
      ]
      const invalidTutorial = { ...blackScholesTimeTutorial, phases: invalidPhases }
      const result = validateTutorial(invalidTutorial)
      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })

    it('should warn about mismatched default parameters', () => {
      const invalidTutorial = {
        ...blackScholesTimeTutorial,
        defaultParameters: { nonExistentParam: 123 }
      }
      const result = validateTutorial(invalidTutorial)
      expect(result.warnings.length).toBeGreaterThan(0)
      expect(result.warnings.some(warning => warning.includes('nonExistentParam'))).toBe(true)
    })
  })

  describe('Utility Functions', () => {
    it('should extract tutorial metadata correctly', () => {
      const metadata = getTutorialMetadata()
      expect(metadata.id).toBe(blackScholesTimeTutorial.id)
      expect(metadata.title).toBe(blackScholesTimeTutorial.title)
      expect(metadata.phaseCount).toBe(4)
      expect(metadata.parameterCount).toBe(5)
      expect(metadata.topics).toEqual(blackScholesTimeTutorial.topics)
    })

    it('should initialize tutorial with custom parameters', () => {
      const customParams = { stockPrice: 120, volatility: 0.3 }
      const initialized = initializeTutorial(customParams)
      
      expect(initialized.initialParameters.stockPrice).toBe(120)
      expect(initialized.initialParameters.volatility).toBe(0.3)
      expect(initialized.initialParameters.timeToMaturity).toBe(90) // default preserved
    })

    it('should get tutorial phase by ID', () => {
      const phase = getTutorialPhase('introduction')
      expect(phase).toBeDefined()
      expect(phase.id).toBe('introduction')
      expect(phase.title).toContain('Introduction')
      
      const nonExistentPhase = getTutorialPhase('non-existent')
      expect(nonExistentPhase).toBeUndefined()
    })

    it('should get tutorial parameter by key', () => {
      const param = getTutorialParameter('timeToMaturity')
      expect(param).toBeDefined()
      expect(param.key).toBe('timeToMaturity')
      expect(param.label).toContain('Time to Maturity')
      
      const nonExistentParam = getTutorialParameter('non-existent')
      expect(nonExistentParam).toBeUndefined()
    })
  })

  describe('Version and Maintenance', () => {
    it('should have version information', () => {
      expect(blackScholesTimeTutorial.version).toBeDefined()
      expect(typeof blackScholesTimeTutorial.version).toBe('string')
      expect(blackScholesTimeTutorial.version).toMatch(/^\d+\.\d+\.\d+$/)
    })

    it('should have last updated timestamp', () => {
      expect(blackScholesTimeTutorial.lastUpdated).toBeDefined()
      expect(typeof blackScholesTimeTutorial.lastUpdated).toBe('string')
      expect(() => new Date(blackScholesTimeTutorial.lastUpdated)).not.toThrow()
    })

    it('should have author information', () => {
      expect(blackScholesTimeTutorial.author).toBeDefined()
      expect(typeof blackScholesTimeTutorial.author).toBe('string')
    })
  })

  describe('Tutorial Flow Configuration', () => {
    it('should have flow configuration', () => {
      const flow = blackScholesTimeTutorial.flow
      expect(typeof flow).toBe('object')
      expect(typeof flow.allowSkipPhases).toBe('boolean')
      expect(typeof flow.requirePhaseCompletion).toBe('boolean')
      expect(typeof flow.showPhaseProgress).toBe('boolean')
    })

    it('should have help configuration', () => {
      const help = blackScholesTimeTutorial.help
      expect(typeof help).toBe('object')
      expect(typeof help.showTooltips).toBe('boolean')
      expect(typeof help.showParameterDescriptions).toBe('boolean')
    })
  })

  describe('Integration with Components', () => {
    it('should work with the tutorial hook', () => {
      const TutorialHook = blackScholesTimeTutorial.hook
      expect(typeof TutorialHook).toBe('function')
      
      // This would normally be tested in a React environment
      // For now, just ensure it's the correct function
      expect(TutorialHook).toBe(useBlackScholesTime)
    })

    it('should have phases that can be rendered', () => {
      blackScholesTimeTutorial.phases.forEach(phase => {
        expect(phase.content).toBeDefined()
        expect(typeof phase.content).toBe('function')
        expect(phase.id).toBeDefined()
        expect(phase.title).toBeDefined()
      })
    })

    it('should have parameters that can be validated', () => {
      blackScholesTimeTutorial.parameters.forEach(param => {
        expect(param.key).toBeDefined()
        expect(param.label).toBeDefined()
        expect(param.type).toBeDefined()
        expect(param.validation).toBeDefined()
        expect(param.formatter).toBeDefined()
        expect(typeof param.formatter).toBe('function')
      })
    })
  })

  describe('Consistency Checks', () => {
    it('should have consistent phase count', () => {
      const actualPhaseCount = blackScholesTimeTutorial.phases.length
      const metadataPhaseCount = getTutorialMetadata().phaseCount
      expect(actualPhaseCount).toBe(metadataPhaseCount)
    })

    it('should have consistent parameter count', () => {
      const actualParamCount = blackScholesTimeTutorial.parameters.length
      const metadataParamCount = getTutorialMetadata().parameterCount
      expect(actualParamCount).toBe(metadataParamCount)
    })

    it('should have all default parameters defined in parameter list', () => {
      const paramKeys = blackScholesTimeTutorial.parameters.map(p => p.key)
      const defaultParamKeys = Object.keys(blackScholesTimeTutorial.defaultParameters)
      
      defaultParamKeys.forEach(key => {
        expect(paramKeys).toContain(key)
      })
    })

    it('should have unique phase IDs', () => {
      const phaseIds = blackScholesTimeTutorial.phases.map(p => p.id)
      const uniqueIds = [...new Set(phaseIds)]
      expect(phaseIds.length).toBe(uniqueIds.length)
    })

    it('should have unique parameter keys', () => {
      const paramKeys = blackScholesTimeTutorial.parameters.map(p => p.key)
      const uniqueKeys = [...new Set(paramKeys)]
      expect(paramKeys.length).toBe(uniqueKeys.length)
    })
  })
})