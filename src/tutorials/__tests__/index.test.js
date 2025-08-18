/**
 * Tutorial Registry System Tests
 * 
 * Tests for tutorial registration, loading, validation, and error handling
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  registerTutorial,
  getTutorial,
  getAllTutorials,
  getTutorialMetadata,
  getTutorialIds,
  hasTutorial,
  unregisterTutorial,
  getTutorialsByCategory,
  getTutorialsByDifficulty,
  getTutorialsByTopic,
  searchTutorials,
  validateAllTutorials,
  getRegistryStats,
  initializeRegistry,
  TutorialValidationError,
  TutorialNotFoundError
} from '../index.js'

// Mock tutorial for testing
const mockTutorial = {
  id: 'test-tutorial',
  title: 'Test Tutorial',
  shortTitle: 'Test',
  description: 'A tutorial for testing purposes',
  difficulty: 'beginner',
  duration: '10-15 minutes',
  estimatedTime: 12,
  topics: ['testing', 'javascript'],
  categories: ['programming', 'testing'],
  tags: ['test', 'mock', 'example'],
  hook: () => ({ calculations: {}, chartData: {}, updateParameter: () => {} }),
  parameters: [
    {
      key: 'testParam',
      label: 'Test Parameter',
      type: 'slider',
      min: 0,
      max: 100,
      step: 1
    }
  ],
  phases: [
    {
      id: 'intro',
      title: 'Introduction',
      content: () => 'Test content'
    },
    {
      id: 'advanced',
      title: 'Advanced Topics',
      content: () => 'Advanced test content'
    }
  ],
  defaultParameters: {
    testParam: 50
  },
  version: '1.0.0',
  lastUpdated: new Date().toISOString()
}

const invalidTutorial = {
  id: 'invalid-tutorial',
  // Missing required fields
}

describe('Tutorial Registry System', () => {
  beforeEach(() => {
    // Clear any existing tutorials except the default ones
    const existingIds = getTutorialIds()
    existingIds.forEach(id => {
      if (id !== 'black-scholes-time') {
        unregisterTutorial(id)
      }
    })
  })

  describe('registerTutorial', () => {
    it('should register a valid tutorial successfully', () => {
      const result = registerTutorial(mockTutorial)
      expect(result).toBe(true)
      expect(hasTutorial('test-tutorial')).toBe(true)
    })

    it('should throw validation error for invalid tutorial', () => {
      expect(() => {
        registerTutorial(invalidTutorial)
      }).toThrow(TutorialValidationError)
    })

    it('should not overwrite existing tutorial without overwrite flag', () => {
      registerTutorial(mockTutorial)
      const result = registerTutorial(mockTutorial)
      expect(result).toBe(false)
    })

    it('should overwrite existing tutorial with overwrite flag', () => {
      registerTutorial(mockTutorial)
      const updatedTutorial = { ...mockTutorial, title: 'Updated Test Tutorial' }
      const result = registerTutorial(updatedTutorial, { overwrite: true })
      expect(result).toBe(true)
      expect(getTutorial('test-tutorial').title).toBe('Updated Test Tutorial')
    })

    it('should skip validation when validate option is false', () => {
      const result = registerTutorial(invalidTutorial, { validate: false })
      expect(result).toBe(true)
      expect(hasTutorial('invalid-tutorial')).toBe(true)
    })
  })

  describe('getTutorial', () => {
    beforeEach(() => {
      registerTutorial(mockTutorial)
    })

    it('should return tutorial by ID', () => {
      const tutorial = getTutorial('test-tutorial')
      expect(tutorial).toBeDefined()
      expect(tutorial.id).toBe('test-tutorial')
      expect(tutorial.title).toBe('Test Tutorial')
    })

    it('should return null for non-existent tutorial', () => {
      const tutorial = getTutorial('non-existent')
      expect(tutorial).toBeNull()
    })

    it('should throw error when throwOnNotFound is true', () => {
      expect(() => {
        getTutorial('non-existent', { throwOnNotFound: true })
      }).toThrow(TutorialNotFoundError)
    })

    it('should handle invalid ID gracefully', () => {
      expect(getTutorial(null)).toBeNull()
      expect(getTutorial('')).toBeNull()
      expect(getTutorial(123)).toBeNull()
    })
  })

  describe('getAllTutorials', () => {
    beforeEach(() => {
      registerTutorial(mockTutorial)
      registerTutorial({
        ...mockTutorial,
        id: 'advanced-tutorial',
        title: 'Advanced Tutorial',
        difficulty: 'advanced',
        topics: ['advanced', 'complex']
      })
    })

    it('should return all tutorials', () => {
      const tutorials = getAllTutorials()
      expect(tutorials.length).toBeGreaterThanOrEqual(2)
      expect(tutorials.some(t => t.id === 'test-tutorial')).toBe(true)
    })

    it('should sort tutorials by title ascending by default', () => {
      const tutorials = getAllTutorials()
      const titles = tutorials.map(t => t.title)
      const sortedTitles = [...titles].sort()
      expect(titles).toEqual(sortedTitles)
    })

    it('should sort tutorials by difficulty', () => {
      const tutorials = getAllTutorials({ sortBy: 'difficulty' })
      const difficulties = tutorials.map(t => t.difficulty)
      expect(difficulties.indexOf('beginner')).toBeLessThan(difficulties.indexOf('advanced'))
    })

    it('should filter tutorials by difficulty', () => {
      const beginnerTutorials = getAllTutorials({ filterBy: { difficulty: 'beginner' } })
      expect(beginnerTutorials.every(t => t.difficulty === 'beginner')).toBe(true)
    })

    it('should filter tutorials by topics', () => {
      const testingTutorials = getAllTutorials({ filterBy: { topics: 'testing' } })
      expect(testingTutorials.every(t => t.topics.includes('testing'))).toBe(true)
    })
  })

  describe('getTutorialMetadata', () => {
    beforeEach(() => {
      registerTutorial(mockTutorial)
    })

    it('should return metadata for specific tutorial', () => {
      const metadata = getTutorialMetadata('test-tutorial')
      expect(metadata).toBeDefined()
      expect(metadata.id).toBe('test-tutorial')
      expect(metadata.title).toBe('Test Tutorial')
      expect(metadata.phaseCount).toBe(2)
      expect(metadata.parameterCount).toBe(1)
    })

    it('should return all metadata when no ID provided', () => {
      const allMetadata = getTutorialMetadata()
      expect(Array.isArray(allMetadata)).toBe(true)
      expect(allMetadata.some(m => m.id === 'test-tutorial')).toBe(true)
    })

    it('should return null for non-existent tutorial', () => {
      const metadata = getTutorialMetadata('non-existent')
      expect(metadata).toBeNull()
    })
  })

  describe('hasTutorial', () => {
    beforeEach(() => {
      registerTutorial(mockTutorial)
    })

    it('should return true for existing tutorial', () => {
      expect(hasTutorial('test-tutorial')).toBe(true)
    })

    it('should return false for non-existent tutorial', () => {
      expect(hasTutorial('non-existent')).toBe(false)
    })
  })

  describe('unregisterTutorial', () => {
    beforeEach(() => {
      registerTutorial(mockTutorial)
    })

    it('should unregister existing tutorial', () => {
      expect(hasTutorial('test-tutorial')).toBe(true)
      const result = unregisterTutorial('test-tutorial')
      expect(result).toBe(true)
      expect(hasTutorial('test-tutorial')).toBe(false)
    })

    it('should return false for non-existent tutorial', () => {
      const result = unregisterTutorial('non-existent')
      expect(result).toBe(false)
    })
  })

  describe('Query Functions', () => {
    beforeEach(() => {
      registerTutorial(mockTutorial)
      registerTutorial({
        ...mockTutorial,
        id: 'math-tutorial',
        title: 'Math Tutorial',
        difficulty: 'intermediate',
        topics: ['mathematics', 'calculus'],
        categories: ['mathematics', 'education']
      })
    })

    describe('getTutorialsByCategory', () => {
      it('should return tutorials in specified category', () => {
        const programmingTutorials = getTutorialsByCategory('programming')
        expect(programmingTutorials.every(t => t.categories.includes('programming'))).toBe(true)
      })
    })

    describe('getTutorialsByDifficulty', () => {
      it('should return tutorials with specified difficulty', () => {
        const beginnerTutorials = getTutorialsByDifficulty('beginner')
        expect(beginnerTutorials.every(t => t.difficulty === 'beginner')).toBe(true)
      })
    })

    describe('getTutorialsByTopic', () => {
      it('should return tutorials covering specified topic', () => {
        const testingTutorials = getTutorialsByTopic('testing')
        expect(testingTutorials.every(t => t.topics.includes('testing'))).toBe(true)
      })
    })

    describe('searchTutorials', () => {
      it('should find tutorials by title', () => {
        const results = searchTutorials('test')
        expect(results.some(t => t.title.toLowerCase().includes('test'))).toBe(true)
      })

      it('should find tutorials by description', () => {
        const results = searchTutorials('testing purposes')
        expect(results.some(t => t.description.includes('testing purposes'))).toBe(true)
      })

      it('should find tutorials by topics', () => {
        const results = searchTutorials('javascript')
        expect(results.some(t => t.topics.includes('javascript'))).toBe(true)
      })

      it('should return empty array for invalid query', () => {
        expect(searchTutorials('')).toEqual([])
        expect(searchTutorials(null)).toEqual([])
      })
    })
  })

  describe('validateAllTutorials', () => {
    beforeEach(() => {
      registerTutorial(mockTutorial)
      registerTutorial(invalidTutorial, { validate: false })
    })

    it('should validate all registered tutorials', () => {
      const results = validateAllTutorials()
      expect(results.valid).toContain('test-tutorial')
      expect(results.invalid.some(item => item.id === 'invalid-tutorial')).toBe(true)
    })
  })

  describe('getRegistryStats', () => {
    beforeEach(() => {
      registerTutorial(mockTutorial)
      registerTutorial({
        ...mockTutorial,
        id: 'advanced-tutorial',
        difficulty: 'advanced',
        phases: [{ id: 'phase1', title: 'Phase 1', content: () => {} }],
        parameters: [
          { key: 'param1', label: 'Param 1' },
          { key: 'param2', label: 'Param 2' }
        ]
      })
    })

    it('should return comprehensive registry statistics', () => {
      const stats = getRegistryStats()
      expect(stats.totalTutorials).toBeGreaterThanOrEqual(2)
      expect(stats.byDifficulty.beginner).toBeGreaterThanOrEqual(1)
      expect(stats.byDifficulty.advanced).toBeGreaterThanOrEqual(1)
      expect(stats.totalPhases).toBeGreaterThan(0)
      expect(stats.totalParameters).toBeGreaterThan(0)
      expect(stats.averagePhases).toBeGreaterThan(0)
      expect(stats.averageParameters).toBeGreaterThan(0)
    })
  })

  describe('Error Handling', () => {
    it('should handle tutorial registration errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      expect(() => {
        registerTutorial(invalidTutorial)
      }).toThrow(TutorialValidationError)
      
      consoleSpy.mockRestore()
    })

    it('should handle missing tutorial gracefully', () => {
      expect(() => {
        getTutorial('non-existent', { throwOnNotFound: true })
      }).toThrow(TutorialNotFoundError)
    })
  })

  describe('Integration with Black-Scholes Tutorial', () => {
    it('should have Black-Scholes tutorial registered by default', () => {
      expect(hasTutorial('black-scholes-time')).toBe(true)
      const tutorial = getTutorial('black-scholes-time')
      expect(tutorial).toBeDefined()
      expect(tutorial.title).toContain('Black-Scholes')
    })

    it('should validate Black-Scholes tutorial successfully', () => {
      const results = validateAllTutorials()
      expect(results.valid).toContain('black-scholes-time')
    })
  })
})