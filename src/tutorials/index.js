/**
 * Tutorial Registry System
 * 
 * Manages registration, loading, and validation of tutorials.
 * Provides a centralized system for tutorial discovery and access.
 */

import { blackScholesTimeTutorial, validateTutorial } from './black-scholes-time/index.jsx'
import { kellyCriterionTutorial } from './kelly-criterion/index.jsx'

// Internal tutorial storage
const tutorials = new Map()
const tutorialMetadata = new Map()

/**
 * Tutorial validation errors
 */
export class TutorialValidationError extends Error {
  constructor(tutorialId, errors) {
    super(`Tutorial validation failed for '${tutorialId}': ${errors.join(', ')}`)
    this.name = 'TutorialValidationError'
    this.tutorialId = tutorialId
    this.errors = errors
  }
}

/**
 * Tutorial not found error
 */
export class TutorialNotFoundError extends Error {
  constructor(tutorialId) {
    super(`Tutorial not found: '${tutorialId}'`)
    this.name = 'TutorialNotFoundError'
    this.tutorialId = tutorialId
  }
}

/**
 * Register a tutorial in the system
 * @param {Object} tutorial - Tutorial definition object
 * @param {Object} options - Registration options
 * @returns {boolean} - Success status
 */
export const registerTutorial = (tutorial, options = {}) => {
  const { validate = true, overwrite = false } = options
  
  try {
    // Check if tutorial already exists
    if (tutorials.has(tutorial.id) && !overwrite) {
      console.warn(`Tutorial '${tutorial.id}' already registered. Use overwrite: true to replace.`)
      return false
    }
    
    // Validate tutorial if requested
    if (validate) {
      const validation = validateTutorial(tutorial)
      if (!validation.isValid) {
        throw new TutorialValidationError(tutorial.id, validation.errors)
      }
      
      // Log warnings if any
      if (validation.warnings.length > 0) {
        console.warn(`Tutorial '${tutorial.id}' validation warnings:`, validation.warnings)
      }
    }
    
    // Register tutorial
    tutorials.set(tutorial.id, tutorial)
    
    // Store metadata for quick access
    tutorialMetadata.set(tutorial.id, {
      id: tutorial.id,
      title: tutorial.title,
      shortTitle: tutorial.shortTitle,
      description: tutorial.description,
      difficulty: tutorial.difficulty,
      duration: tutorial.duration,
      estimatedTime: tutorial.estimatedTime,
      topics: tutorial.topics || [],
      categories: tutorial.categories || [],
      tags: tutorial.tags || [],
      phaseCount: tutorial.phases?.length || 0,
      parameterCount: tutorial.parameters?.length || 0,
      lastUpdated: tutorial.lastUpdated,
      version: tutorial.version
    })
    
    console.log(`Tutorial '${tutorial.id}' registered successfully`)
    return true
    
  } catch (error) {
    console.error(`Failed to register tutorial '${tutorial.id}':`, error)
    throw error
  }
}

/**
 * Get a tutorial by ID
 * @param {string} id - Tutorial ID
 * @param {Object} options - Retrieval options
 * @returns {Object|null} - Tutorial object or null if not found
 */
export const getTutorial = (id, options = {}) => {
  const { throwOnNotFound = false } = options
  
  if (!id || typeof id !== 'string') {
    if (throwOnNotFound) {
      throw new Error('Invalid tutorial ID provided')
    }
    return null
  }
  
  const tutorial = tutorials.get(id)
  
  if (!tutorial && throwOnNotFound) {
    throw new TutorialNotFoundError(id)
  }
  
  return tutorial || null
}

/**
 * Get all registered tutorials
 * @param {Object} options - Filtering options
 * @returns {Array} - Array of tutorial objects
 */
export const getAllTutorials = (options = {}) => {
  const { 
    sortBy = 'title',
    sortOrder = 'asc',
    filterBy = {},
    includeMetadata = false 
  } = options
  
  let tutorialList = Array.from(tutorials.values())
  
  // Apply filters
  if (Object.keys(filterBy).length > 0) {
    tutorialList = tutorialList.filter(tutorial => {
      return Object.entries(filterBy).every(([key, value]) => {
        if (Array.isArray(tutorial[key])) {
          return Array.isArray(value) 
            ? value.some(v => tutorial[key].includes(v))
            : tutorial[key].includes(value)
        }
        return tutorial[key] === value
      })
    })
  }
  
  // Sort tutorials
  tutorialList.sort((a, b) => {
    let aValue = a[sortBy]
    let bValue = b[sortBy]
    
    // Handle special sorting cases
    if (sortBy === 'difficulty') {
      const difficultyOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 }
      aValue = difficultyOrder[aValue] || 0
      bValue = difficultyOrder[bValue] || 0
    }
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }
    
    if (sortOrder === 'desc') {
      return bValue > aValue ? 1 : bValue < aValue ? -1 : 0
    }
    return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
  })
  
  return includeMetadata 
    ? tutorialList.map(tutorial => ({
        ...tutorial,
        metadata: tutorialMetadata.get(tutorial.id)
      }))
    : tutorialList
}

/**
 * Get tutorial metadata only (lightweight)
 * @param {string} id - Tutorial ID (optional, returns all if not provided)
 * @returns {Object|Array} - Tutorial metadata
 */
export const getTutorialMetadata = (id = null) => {
  if (id) {
    return tutorialMetadata.get(id) || null
  }
  return Array.from(tutorialMetadata.values())
}

/**
 * Get all tutorial IDs
 * @returns {Array} - Array of tutorial IDs
 */
export const getTutorialIds = () => {
  return Array.from(tutorials.keys())
}

/**
 * Check if a tutorial exists
 * @param {string} id - Tutorial ID
 * @returns {boolean} - Existence status
 */
export const hasTutorial = (id) => {
  return tutorials.has(id)
}

/**
 * Unregister a tutorial
 * @param {string} id - Tutorial ID
 * @returns {boolean} - Success status
 */
export const unregisterTutorial = (id) => {
  const existed = tutorials.has(id)
  tutorials.delete(id)
  tutorialMetadata.delete(id)
  
  if (existed) {
    console.log(`Tutorial '${id}' unregistered`)
  }
  
  return existed
}

/**
 * Get tutorials by category
 * @param {string} category - Category name
 * @returns {Array} - Array of tutorials in the category
 */
export const getTutorialsByCategory = (category) => {
  return getAllTutorials({
    filterBy: { categories: category }
  })
}

/**
 * Get tutorials by difficulty
 * @param {string} difficulty - Difficulty level
 * @returns {Array} - Array of tutorials with the specified difficulty
 */
export const getTutorialsByDifficulty = (difficulty) => {
  return getAllTutorials({
    filterBy: { difficulty }
  })
}

/**
 * Get tutorials by topic
 * @param {string} topic - Topic name
 * @returns {Array} - Array of tutorials covering the topic
 */
export const getTutorialsByTopic = (topic) => {
  return getAllTutorials({
    filterBy: { topics: topic }
  })
}

/**
 * Search tutorials by text
 * @param {string} query - Search query
 * @param {Array} fields - Fields to search in
 * @returns {Array} - Array of matching tutorials
 */
export const searchTutorials = (query, fields = ['title', 'description', 'topics', 'tags']) => {
  if (!query || typeof query !== 'string') {
    return []
  }
  
  const searchTerm = query.toLowerCase()
  
  return getAllTutorials().filter(tutorial => {
    return fields.some(field => {
      const value = tutorial[field]
      if (Array.isArray(value)) {
        return value.some(item => 
          item.toLowerCase().includes(searchTerm)
        )
      }
      if (typeof value === 'string') {
        return value.toLowerCase().includes(searchTerm)
      }
      return false
    })
  })
}

/**
 * Validate all registered tutorials
 * @returns {Object} - Validation results
 */
export const validateAllTutorials = () => {
  const results = {
    valid: [],
    invalid: [],
    warnings: []
  }
  
  tutorials.forEach((tutorial, id) => {
    try {
      const validation = validateTutorial(tutorial)
      if (validation.isValid) {
        results.valid.push(id)
        if (validation.warnings.length > 0) {
          results.warnings.push({
            id,
            warnings: validation.warnings
          })
        }
      } else {
        results.invalid.push({
          id,
          errors: validation.errors
        })
      }
    } catch (error) {
      results.invalid.push({
        id,
        errors: [error.message]
      })
    }
  })
  
  return results
}

/**
 * Get registry statistics
 * @returns {Object} - Registry statistics
 */
export const getRegistryStats = () => {
  const allTutorials = getAllTutorials()
  
  const stats = {
    totalTutorials: allTutorials.length,
    byDifficulty: {},
    byCategory: {},
    totalPhases: 0,
    totalParameters: 0,
    averagePhases: 0,
    averageParameters: 0
  }
  
  allTutorials.forEach(tutorial => {
    // Count by difficulty
    const difficulty = tutorial.difficulty || 'unknown'
    stats.byDifficulty[difficulty] = (stats.byDifficulty[difficulty] || 0) + 1
    
    // Count by categories
    if (tutorial.categories) {
      tutorial.categories.forEach(category => {
        stats.byCategory[category] = (stats.byCategory[category] || 0) + 1
      })
    }
    
    // Count phases and parameters
    stats.totalPhases += tutorial.phases?.length || 0
    stats.totalParameters += tutorial.parameters?.length || 0
  })
  
  // Calculate averages
  if (stats.totalTutorials > 0) {
    stats.averagePhases = Math.round(stats.totalPhases / stats.totalTutorials * 10) / 10
    stats.averageParameters = Math.round(stats.totalParameters / stats.totalTutorials * 10) / 10
  }
  
  return stats
}

/**
 * Initialize the tutorial registry with default tutorials
 */
export const initializeRegistry = () => {
  try {
    // Register the Black-Scholes tutorial
    registerTutorial(blackScholesTimeTutorial)
    
    // Register the Kelly Criterion tutorial
    registerTutorial(kellyCriterionTutorial)
    
    console.log('Tutorial registry initialized successfully')
    console.log('Registry stats:', getRegistryStats())
    
    return true
  } catch (error) {
    console.error('Failed to initialize tutorial registry:', error)
    return false
  }
}

// Initialize registry on module load
initializeRegistry()

// Export the main registry interface
export default {
  // Core functions
  registerTutorial,
  getTutorial,
  getAllTutorials,
  getTutorialMetadata,
  getTutorialIds,
  hasTutorial,
  unregisterTutorial,
  
  // Query functions
  getTutorialsByCategory,
  getTutorialsByDifficulty,
  getTutorialsByTopic,
  searchTutorials,
  
  // Utility functions
  validateAllTutorials,
  getRegistryStats,
  initializeRegistry,
  
  // Error classes
  TutorialValidationError,
  TutorialNotFoundError
}