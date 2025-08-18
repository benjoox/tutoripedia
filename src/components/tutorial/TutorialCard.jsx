/**
 * TutorialCard Component
 * 
 * Displays tutorial metadata in a card format for the homepage.
 * Includes hover effects, difficulty indicators, topic tags, and click handling.
 */

import React, { useMemo, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Progress } from '../ui/progress'
import { 
  IconClock, 
  IconUser, 
  IconTrendingUp, 
  IconBook, 
  IconStar,
  IconChevronRight,
  IconCalendar,
  IconTag
} from '@tabler/icons-react'
import { cn } from '@/lib/utils'

/**
 * Difficulty level configuration
 */
const DIFFICULTY_CONFIG = {
  beginner: {
    label: 'Beginner',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: IconUser,
    description: 'Perfect for getting started'
  },
  intermediate: {
    label: 'Intermediate',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: IconTrendingUp,
    description: 'Some experience recommended'
  },
  advanced: {
    label: 'Advanced',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: IconStar,
    description: 'For experienced learners'
  }
}

/**
 * Difficulty indicator component
 */
const DifficultyIndicator = ({ difficulty, showLabel = true, size = 'sm' }) => {
  const config = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.beginner
  const Icon = config.icon

  return (
    <div className={cn(
      'flex items-center gap-1.5',
      size === 'sm' ? 'text-xs' : 'text-sm'
    )}>
      <Icon className={cn(
        size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'
      )} />
      {showLabel && (
        <Badge 
          variant="outline" 
          className={cn(
            'text-xs font-medium',
            config.color
          )}
        >
          {config.label}
        </Badge>
      )}
    </div>
  )
}

/**
 * Topic tags component
 */
const TopicTags = ({ topics = [], maxTags = 3, className = '' }) => {
  const displayTags = topics.slice(0, maxTags)
  const remainingCount = Math.max(0, topics.length - maxTags)

  if (topics.length === 0) {
    return null
  }

  return (
    <div className={cn('flex flex-wrap gap-1', className)}>
      {displayTags.map((topic, index) => (
        <Badge 
          key={index} 
          variant="secondary" 
          className="text-xs px-2 py-0.5"
        >
          {topic}
        </Badge>
      ))}
      {remainingCount > 0 && (
        <Badge 
          variant="outline" 
          className="text-xs px-2 py-0.5 text-muted-foreground"
        >
          +{remainingCount}
        </Badge>
      )}
    </div>
  )
}

/**
 * Tutorial metadata display
 */
const TutorialMetadata = ({ tutorial, className = '' }) => {
  const estimatedTime = useMemo(() => {
    if (tutorial.estimatedTime) {
      return `${tutorial.estimatedTime} min`
    }
    if (tutorial.duration) {
      return tutorial.duration
    }
    return 'Variable'
  }, [tutorial.estimatedTime, tutorial.duration])

  const phaseCount = tutorial.phaseCount || tutorial.phases?.length || 0
  const parameterCount = tutorial.parameterCount || tutorial.parameters?.length || 0

  return (
    <div className={cn('flex items-center gap-4 text-xs text-muted-foreground', className)}>
      <div className="flex items-center gap-1">
        <IconClock className="w-3 h-3" />
        <span>{estimatedTime}</span>
      </div>
      
      {phaseCount > 0 && (
        <div className="flex items-center gap-1">
          <IconBook className="w-3 h-3" />
          <span>{phaseCount} phases</span>
        </div>
      )}
      
      {tutorial.lastUpdated && (
        <div className="flex items-center gap-1">
          <IconCalendar className="w-3 h-3" />
          <span>Updated {new Date(tutorial.lastUpdated).toLocaleDateString()}</span>
        </div>
      )}
    </div>
  )
}

/**
 * Progress indicator (for future use with user progress tracking)
 */
const ProgressIndicator = ({ progress = 0, className = '' }) => {
  if (progress <= 0) {
    return null
  }

  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Progress</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-1.5" />
    </div>
  )
}

/**
 * Main TutorialCard component
 */
export const TutorialCard = ({
  tutorial,
  onClick,
  className = '',
  showProgress = false,
  progress = 0,
  maxTopics = 3,
  variant = 'default',
  size = 'default',
  disabled = false,
  loading = false
}) => {
  // Handle click events
  const handleClick = useCallback((event) => {
    if (disabled || loading) {
      event.preventDefault()
      return
    }
    
    if (onClick) {
      onClick(tutorial, event)
    }
  }, [tutorial, onClick, disabled, loading])

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleClick(event)
    }
  }, [handleClick])

  // Memoize card content to prevent unnecessary re-renders
  const cardContent = useMemo(() => {
    if (!tutorial) {
      return null
    }

    return (
      <>
        <CardHeader className={cn(
          'pb-3',
          size === 'compact' && 'pb-2'
        )}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                {tutorial.icon && (
                  <div className="flex-shrink-0 text-primary">
                    {tutorial.icon}
                  </div>
                )}
                <DifficultyIndicator 
                  difficulty={tutorial.difficulty} 
                  size={size === 'compact' ? 'sm' : 'default'}
                />
              </div>
              
              <CardTitle className={cn(
                'line-clamp-2',
                size === 'compact' ? 'text-base' : 'text-lg'
              )}>
                {tutorial.title}
              </CardTitle>
              
              {tutorial.shortTitle && tutorial.shortTitle !== tutorial.title && (
                <p className="text-sm text-muted-foreground mt-1">
                  {tutorial.shortTitle}
                </p>
              )}
            </div>
            
            <IconChevronRight className={cn(
              'flex-shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1',
              size === 'compact' ? 'w-4 h-4' : 'w-5 h-5'
            )} />
          </div>
          
          {tutorial.description && (
            <CardDescription className={cn(
              'line-clamp-3',
              size === 'compact' && 'line-clamp-2 text-sm'
            )}>
              {tutorial.description}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className={cn(
          'pt-0 space-y-3',
          size === 'compact' && 'space-y-2'
        )}>
          <TopicTags 
            topics={tutorial.topics} 
            maxTags={maxTopics}
          />
          
          <TutorialMetadata tutorial={tutorial} />
          
          {showProgress && progress > 0 && (
            <ProgressIndicator progress={progress} />
          )}
          
          {tutorial.prerequisites && tutorial.prerequisites.length > 0 && (
            <div className="text-xs text-muted-foreground">
              <span className="font-medium">Prerequisites:</span>
              <span className="ml-1">
                {tutorial.prerequisites.slice(0, 2).join(', ')}
                {tutorial.prerequisites.length > 2 && '...'}
              </span>
            </div>
          )}
        </CardContent>
      </>
    )
  }, [tutorial, size, maxTopics, showProgress, progress])

  // Loading state
  if (loading) {
    return (
      <Card className={cn(
        'group cursor-pointer transition-all duration-200',
        'hover:shadow-md hover:scale-[1.02]',
        'animate-pulse',
        className
      )}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-6 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </div>
            <div className="w-5 h-5 bg-muted rounded"></div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <div className="flex gap-2">
            <div className="h-5 bg-muted rounded w-16"></div>
            <div className="h-5 bg-muted rounded w-20"></div>
          </div>
          <div className="h-4 bg-muted rounded w-2/3"></div>
        </CardContent>
      </Card>
    )
  }

  // Error state
  if (!tutorial) {
    return (
      <Card className={cn(
        'border-destructive/20 bg-destructive/5',
        className
      )}>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center text-muted-foreground">
            <IconTag className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Tutorial data unavailable</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card 
      className={cn(
        'group cursor-pointer transition-all duration-200',
        'hover:shadow-md hover:scale-[1.02] hover:border-primary/20',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        disabled && 'opacity-50 cursor-not-allowed hover:shadow-none hover:scale-100',
        variant === 'featured' && 'border-primary/30 bg-primary/5',
        className
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={disabled ? -1 : 0}
      role="button"
      aria-label={`Open tutorial: ${tutorial.title}`}
      aria-disabled={disabled}
    >
      {cardContent}
    </Card>
  )
}

/**
 * TutorialCard grid container
 */
export const TutorialCardGrid = ({ 
  children, 
  className = '',
  columns = 'auto',
  gap = 'default'
}) => {
  const gridClasses = useMemo(() => {
    const baseClasses = 'grid w-full'
    
    const columnClasses = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
      auto: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
    }
    
    const gapClasses = {
      sm: 'gap-3',
      default: 'gap-4',
      lg: 'gap-6'
    }
    
    return cn(
      baseClasses,
      columnClasses[columns] || columnClasses.auto,
      gapClasses[gap] || gapClasses.default
    )
  }, [columns, gap])

  return (
    <div className={cn(gridClasses, className)}>
      {children}
    </div>
  )
}

/**
 * Utility function to validate tutorial data for card display
 */
export const validateTutorialForCard = (tutorial) => {
  const errors = []
  const warnings = []

  if (!tutorial) {
    errors.push('Tutorial is required')
    return { isValid: false, errors, warnings }
  }

  // Required fields
  if (!tutorial.id) {
    errors.push('Tutorial must have an id')
  }

  if (!tutorial.title) {
    errors.push('Tutorial must have a title')
  }

  // Recommended fields
  if (!tutorial.description) {
    warnings.push('Tutorial should have a description')
  }

  if (!tutorial.difficulty) {
    warnings.push('Tutorial should have a difficulty level')
  }

  if (!tutorial.topics || tutorial.topics.length === 0) {
    warnings.push('Tutorial should have topics')
  }

  if (!tutorial.duration && !tutorial.estimatedTime) {
    warnings.push('Tutorial should have duration or estimated time')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Default export
 */
export default TutorialCard