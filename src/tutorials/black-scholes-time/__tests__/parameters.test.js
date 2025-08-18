import { describe, it, expect } from 'vitest'
import {
  blackScholesTimeParameters,
  validateParameter,
  validateAllParameters,
  getDefaultParameters,
  getParameter,
  getParametersByCategory,
  getParametersByImportance,
  formatParameterValue,
  getParameterCategories,
  parameterMetadata
} from '../parameters'

describe('Black-Scholes Time Parameters', () => {
  describe('Parameter Definitions', () => {
    it('should have all required parameters', () => {
      const expectedKeys = ['timeToMaturity', 'stockPrice', 'strikePrice', 'volatility', 'riskFreeRate']
      const actualKeys = blackScholesTimeParameters.map(p => p.key)
      
      expectedKeys.forEach(key => {
        expect(actualKeys).toContain(key)
      })
    })

    it('should have valid parameter structure', () => {
      blackScholesTimeParameters.forEach(param => {
        expect(param).toHaveProperty('key')
        expect(param).toHaveProperty('label')
        expect(param).toHaveProperty('type')
        expect(param).toHaveProperty('min')
        expect(param).toHaveProperty('max')
        expect(param).toHaveProperty('step')
        expect(param).toHaveProperty('unit')
        expect(param).toHaveProperty('defaultValue')
        expect(param).toHaveProperty('formatter')
        expect(param).toHaveProperty('description')
        expect(param).toHaveProperty('validation')
        expect(param).toHaveProperty('category')
        expect(param).toHaveProperty('importance')
        expect(param).toHaveProperty('tooltip')
        
        // Validate types
        expect(typeof param.key).toBe('string')
        expect(typeof param.label).toBe('string')
        expect(typeof param.type).toBe('string')
        expect(typeof param.min).toBe('number')
        expect(typeof param.max).toBe('number')
        expect(typeof param.step).toBe('number')
        expect(typeof param.unit).toBe('string')
        expect(typeof param.defaultValue).toBe('number')
        expect(typeof param.formatter).toBe('function')
        expect(typeof param.description).toBe('string')
        expect(typeof param.validation).toBe('object')
        expect(typeof param.category).toBe('string')
        expect(typeof param.importance).toBe('string')
        expect(typeof param.tooltip).toBe('string')
      })
    })

    it('should have valid default values within ranges', () => {
      blackScholesTimeParameters.forEach(param => {
        expect(param.defaultValue).toBeGreaterThanOrEqual(param.min)
        expect(param.defaultValue).toBeLessThanOrEqual(param.max)
      })
    })

    it('should have valid step sizes', () => {
      blackScholesTimeParameters.forEach(param => {
        expect(param.step).toBeGreaterThan(0)
        expect(param.step).toBeLessThanOrEqual(param.max - param.min)
      })
    })
  })

  describe('Parameter Validation', () => {
    it('should validate valid parameters', () => {
      const result = validateParameter('timeToMaturity', 90)
      expect(result.isValid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should reject invalid parameter keys', () => {
      const result = validateParameter('invalidKey', 100)
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('Unknown parameter')
    })

    it('should validate required parameters', () => {
      const result = validateParameter('timeToMaturity', null)
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('required')
    })

    it('should validate number types', () => {
      const result = validateParameter('timeToMaturity', 'not a number')
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('must be a number')
    })

    it('should convert string numbers', () => {
      const result = validateParameter('timeToMaturity', '90')
      expect(result.isValid).toBe(true)
      expect(result.value).toBe(90)
    })

    it('should validate minimum values', () => {
      const result = validateParameter('timeToMaturity', 0)
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('at least')
    })

    it('should validate maximum values', () => {
      const result = validateParameter('timeToMaturity', 1000)
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('at most')
    })

    it('should validate all parameters at once', () => {
      const validParams = {
        timeToMaturity: 90,
        stockPrice: 100,
        strikePrice: 100,
        volatility: 0.2,
        riskFreeRate: 0.05
      }
      
      const result = validateAllParameters(validParams)
      expect(result.isValid).toBe(true)
      expect(Object.keys(result.errors)).toHaveLength(0)
      expect(result.validatedValues).toEqual(validParams)
    })

    it('should return errors for invalid parameters', () => {
      const invalidParams = {
        timeToMaturity: -1,
        stockPrice: 'invalid',
        strikePrice: 1000,
        volatility: 0.2,
        riskFreeRate: 0.05
      }
      
      const result = validateAllParameters(invalidParams)
      expect(result.isValid).toBe(false)
      expect(result.errors.timeToMaturity).toBeDefined()
      expect(result.errors.stockPrice).toBeDefined()
      expect(result.errors.strikePrice).toBeDefined()
    })
  })

  describe('Parameter Utilities', () => {
    it('should get default parameters', () => {
      const defaults = getDefaultParameters()
      expect(defaults).toEqual({
        timeToMaturity: 90,
        stockPrice: 100,
        strikePrice: 100,
        volatility: 0.2,
        riskFreeRate: 0.05
      })
    })

    it('should get parameter by key', () => {
      const param = getParameter('timeToMaturity')
      expect(param).toBeDefined()
      expect(param.key).toBe('timeToMaturity')
      expect(param.label).toBe('Time to Maturity')
    })

    it('should return undefined for invalid key', () => {
      const param = getParameter('invalidKey')
      expect(param).toBeUndefined()
    })

    it('should get parameters by category', () => {
      const timeParams = getParametersByCategory('time')
      expect(timeParams).toHaveLength(1)
      expect(timeParams[0].key).toBe('timeToMaturity')
      
      const marketParams = getParametersByCategory('market')
      expect(marketParams).toHaveLength(2)
      expect(marketParams.map(p => p.key)).toContain('stockPrice')
      expect(marketParams.map(p => p.key)).toContain('riskFreeRate')
    })

    it('should get parameters by importance', () => {
      const highImportance = getParametersByImportance('high')
      expect(highImportance.length).toBeGreaterThan(0)
      
      const mediumImportance = getParametersByImportance('medium')
      expect(mediumImportance.length).toBeGreaterThan(0)
    })

    it('should format parameter values', () => {
      expect(formatParameterValue('timeToMaturity', 90)).toBe('90 days (3.0 months)')
      expect(formatParameterValue('stockPrice', 100)).toBe('$100')
      expect(formatParameterValue('volatility', 0.2)).toBe('20.0%')
      expect(formatParameterValue('riskFreeRate', 0.05)).toBe('5.0%')
    })

    it('should handle invalid keys in formatting', () => {
      expect(formatParameterValue('invalidKey', 100)).toBe('100')
    })

    it('should get parameter categories', () => {
      const categories = getParameterCategories()
      expect(categories).toHaveProperty('time')
      expect(categories).toHaveProperty('market')
      expect(categories).toHaveProperty('contract')
      expect(categories).toHaveProperty('risk')
      
      expect(categories.time).toHaveLength(1)
      expect(categories.market).toHaveLength(2)
      expect(categories.contract).toHaveLength(1)
      expect(categories.risk).toHaveLength(1)
    })
  })

  describe('Parameter Metadata', () => {
    it('should have category metadata', () => {
      expect(parameterMetadata.categories).toBeDefined()
      expect(parameterMetadata.categories.time).toBeDefined()
      expect(parameterMetadata.categories.market).toBeDefined()
      expect(parameterMetadata.categories.contract).toBeDefined()
      expect(parameterMetadata.categories.risk).toBeDefined()
      
      Object.values(parameterMetadata.categories).forEach(category => {
        expect(category).toHaveProperty('label')
        expect(category).toHaveProperty('description')
        expect(category).toHaveProperty('icon')
        expect(category).toHaveProperty('order')
      })
    })

    it('should have importance metadata', () => {
      expect(parameterMetadata.importance).toBeDefined()
      expect(parameterMetadata.importance.high).toBeDefined()
      expect(parameterMetadata.importance.medium).toBeDefined()
      expect(parameterMetadata.importance.low).toBeDefined()
      
      Object.values(parameterMetadata.importance).forEach(importance => {
        expect(importance).toHaveProperty('label')
        expect(importance).toHaveProperty('description')
        expect(importance).toHaveProperty('color')
      })
    })
  })

  describe('Formatter Functions', () => {
    it('should format time to maturity correctly', () => {
      const timeParam = getParameter('timeToMaturity')
      expect(timeParam.formatter(30)).toBe('30 days (1.0 months)')
      expect(timeParam.formatter(90)).toBe('90 days (3.0 months)')
      expect(timeParam.formatter(365)).toBe('365 days (12.2 months)')
    })

    it('should format prices correctly', () => {
      const stockParam = getParameter('stockPrice')
      const strikeParam = getParameter('strikePrice')
      
      expect(stockParam.formatter(100)).toBe('$100')
      expect(stockParam.formatter(150.5)).toBe('$150.5')
      expect(strikeParam.formatter(100)).toBe('$100')
    })

    it('should format percentages correctly', () => {
      const volParam = getParameter('volatility')
      const rateParam = getParameter('riskFreeRate')
      
      expect(volParam.formatter(0.2)).toBe('20.0%')
      expect(volParam.formatter(0.25)).toBe('25.0%')
      expect(rateParam.formatter(0.05)).toBe('5.0%')
      expect(rateParam.formatter(0.035)).toBe('3.5%')
    })
  })

  describe('Parameter Relationships', () => {
    it('should have logical parameter ranges', () => {
      const stockParam = getParameter('stockPrice')
      const strikeParam = getParameter('strikePrice')
      
      // Stock and strike should have same range for comparison
      expect(stockParam.min).toBe(strikeParam.min)
      expect(stockParam.max).toBe(strikeParam.max)
    })

    it('should have reasonable default values', () => {
      const defaults = getDefaultParameters()
      
      // At-the-money option by default
      expect(defaults.stockPrice).toBe(defaults.strikePrice)
      
      // Reasonable time to maturity (3 months)
      expect(defaults.timeToMaturity).toBe(90)
      
      // Typical volatility (20%)
      expect(defaults.volatility).toBe(0.2)
      
      // Reasonable risk-free rate (5%)
      expect(defaults.riskFreeRate).toBe(0.05)
    })
  })
})