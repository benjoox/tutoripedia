import React, { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { TutorialCard, TutorialCardGrid } from '@/components/tutorial/TutorialCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  IconSearch, 
  IconFilter, 
  IconSortAscending, 
  IconSortDescending,
  IconX,
  IconBook,
  IconStar,
  IconClock
} from '@tabler/icons-react'
import { getAllTutorials, searchTutorials, getTutorialsByDifficulty } from '@/tutorials'
import { cn } from '@/lib/utils'

/**
 * HomePage Component
 * 
 * Displays a responsive grid of tutorial cards with search and filtering functionality.
 * Includes smooth entrance animations and comprehensive tutorial discovery features.
 */
function HomePage() {
  const navigate = useNavigate()
  
  // State for search and filtering
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [selectedTopic, setSelectedTopic] = useState('all')
  const [sortBy, setSortBy] = useState('title')
  const [sortOrder, setSortOrder] = useState('asc')
  const [isLoading, setIsLoading] = useState(false)

  // Get all tutorials from registry
  const allTutorials = useMemo(() => {
    try {
      return getAllTutorials({
        sortBy,
        sortOrder
      })
    } catch (error) {
      console.error('Error loading tutorials:', error)
      return []
    }
  }, [sortBy, sortOrder])

  // Get unique topics and difficulties for filters
  const { availableTopics, availableDifficulties } = useMemo(() => {
    const topics = new Set()
    const difficulties = new Set()
    
    allTutorials.forEach(tutorial => {
      if (tutorial.topics) {
        tutorial.topics.forEach(topic => topics.add(topic))
      }
      if (tutorial.difficulty) {
        difficulties.add(tutorial.difficulty)
      }
    })
    
    return {
      availableTopics: Array.from(topics).sort(),
      availableDifficulties: Array.from(difficulties).sort()
    }
  }, [allTutorials])

  // Filter and search tutorials
  const filteredTutorials = useMemo(() => {
    let tutorials = allTutorials

    // Apply search filter
    if (searchQuery.trim()) {
      tutorials = searchTutorials(searchQuery.trim())
    }

    // Apply difficulty filter
    if (selectedDifficulty !== 'all') {
      tutorials = tutorials.filter(tutorial => tutorial.difficulty === selectedDifficulty)
    }

    // Apply topic filter
    if (selectedTopic !== 'all') {
      tutorials = tutorials.filter(tutorial => 
        tutorial.topics && tutorial.topics.includes(selectedTopic)
      )
    }

    return tutorials
  }, [allTutorials, searchQuery, selectedDifficulty, selectedTopic])

  // Handle tutorial card click
  const handleTutorialClick = useCallback((tutorial) => {
    if (tutorial && tutorial.id) {
      navigate(`/tutorial/${tutorial.id}`)
    }
  }, [navigate])

  // Handle search input change
  const handleSearchChange = useCallback((event) => {
    setSearchQuery(event.target.value)
  }, [])

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchQuery('')
    setSelectedDifficulty('all')
    setSelectedTopic('all')
    setSortBy('title')
    setSortOrder('asc')
  }, [])

  // Toggle sort order
  const toggleSortOrder = useCallback(() => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
  }, [])

  // Check if any filters are active
  const hasActiveFilters = searchQuery.trim() || selectedDifficulty !== 'all' || selectedTopic !== 'all'

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary/5 to-background border-b">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              Interactive Learning Tutorials
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
              Explore complex financial concepts through interactive visualizations and hands-on learning experiences.
              Master quantitative finance with step-by-step guided tutorials.
            </p>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-400">
              <div className="flex items-center gap-2">
                <IconBook className="w-4 h-4" />
                <span>{allTutorials.length} Tutorial{allTutorials.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-2">
                <IconStar className="w-4 h-4" />
                <span>{availableDifficulties.length} Difficulty Level{availableDifficulties.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-2">
                <IconClock className="w-4 h-4" />
                <span>Self-Paced Learning</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-card rounded-lg border p-6 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-600">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search tutorials by title, description, or topics..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setSearchQuery('')}
                >
                  <IconX className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              {/* Difficulty Filter */}
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {availableDifficulties.map(difficulty => (
                    <SelectItem key={difficulty} value={difficulty}>
                      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Topic Filter */}
              <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Topic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Topics</SelectItem>
                  {availableTopics.map(topic => (
                    <SelectItem key={topic} value={topic}>
                      {topic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort Options */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="difficulty">Difficulty</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={toggleSortOrder}
                className="px-3"
                aria-label={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
              >
                {sortOrder === 'asc' ? (
                  <IconSortAscending className="w-4 h-4" />
                ) : (
                  <IconSortDescending className="w-4 h-4" />
                )}
              </Button>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="px-3"
                >
                  <IconX className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {searchQuery && (
                <Badge variant="secondary" className="text-xs">
                  Search: "{searchQuery}"
                </Badge>
              )}
              {selectedDifficulty !== 'all' && (
                <Badge variant="secondary" className="text-xs">
                  Difficulty: {selectedDifficulty}
                </Badge>
              )}
              {selectedTopic !== 'all' && (
                <Badge variant="secondary" className="text-xs">
                  Topic: {selectedTopic}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-muted-foreground">
            {filteredTutorials.length === allTutorials.length ? (
              `Showing all ${allTutorials.length} tutorial${allTutorials.length !== 1 ? 's' : ''}`
            ) : (
              `Showing ${filteredTutorials.length} of ${allTutorials.length} tutorial${allTutorials.length !== 1 ? 's' : ''}`
            )}
          </div>
        </div>

        {/* Tutorial Grid */}
        {filteredTutorials.length > 0 ? (
          <TutorialCardGrid 
            className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-800"
            columns="auto"
            gap="default"
          >
            {filteredTutorials.map((tutorial, index) => (
              <div
                key={tutorial.id}
                className="animate-in fade-in slide-in-from-bottom-4 duration-700"
                style={{ animationDelay: `${800 + index * 100}ms` }}
              >
                <TutorialCard
                  tutorial={tutorial}
                  onClick={handleTutorialClick}
                  loading={isLoading}
                  maxTopics={3}
                />
              </div>
            ))}
          </TutorialCardGrid>
        ) : (
          /* Empty State */
          <div className="text-center py-16 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-800">
            <div className="max-w-md mx-auto">
              <IconSearch className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No tutorials found
              </h3>
              <p className="text-muted-foreground mb-6">
                {hasActiveFilters 
                  ? "Try adjusting your search criteria or clearing the filters."
                  : "No tutorials are currently available."
                }
              </p>
              {hasActiveFilters && (
                <Button onClick={clearFilters} variant="outline">
                  Clear all filters
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage