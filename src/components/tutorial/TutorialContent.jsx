/**
 * TutorialContent Component
 * 
 * Renders phase content dynamically with real-time updates from tutorial hooks.
 * Provides error boundaries and responsive layout for tutorial content area.
 */

import React, { Suspense, useMemo, useCallback } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Alert, AlertDescription } from '../ui/alert'
import { Skeleton } from '../ui/skeleton'
import { Button } from '../ui/button'
import { IconRefresh, IconAlertTriangle } from '@tabler/icons-react'

/**
 * Error fallback component for content rendering errors
 */
const ContentErrorFallback = ({ error, resetErrorBoundary, phase }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <IconAlertTriangle className="w-12 h-12 text-destructive mb-4" />
      <h3 className="text-lg font-semibold mb-2">Content Loading Error</h3>
      <p className="text-muted-foreground mb-4 max-w-md">
        There was an error loading the content for "{phase?.title || 'this phase'}". 
        This might be due to a temporary issue or missing content.
      </p>
      <Alert className="mb-4 max-w-md">
        <IconAlertTriangle className="h-4 w-4" />
        <AlertDescription className="text-sm">
          {error?.message || 'Unknown error occurred'}
        </AlertDescription>
      </Alert>
      <Button onClick={resetErrorBoundary} variant="outline" className="gap-2">
        <IconRefresh className="w-4 h-4" />
        Try Again
      </Button>
    </div>
  )
}

/**
 * Loading skeleton for content
 */
const ContentSkeleton = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-3">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-32 w-full" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  )
}

/**
 * Content wrapper with responsive layout
 */
const ContentWrapper = ({ children, className = '' }) => {
  return (
    <div className={`
      flex-1 overflow-y-auto
      bg-background
      transition-all duration-200 ease-in-out
      ${className}
    `}>
      <div className="
        max-w-none
        mx-auto
        p-4 sm:p-6 lg:p-8
        min-h-full
      ">
        {children}
      </div>
    </div>
  )
}

/**
 * Main TutorialContent component
 */
export const TutorialContent = ({
  phase,
  tutorial,
  tutorialHookResult,
  className = '',
  onError = null,
  enableErrorBoundary = true,
  showLoadingState = true,
  contentProps = {}
}) => {
  // Memoize the content component to prevent unnecessary re-renders
  const ContentComponent = useMemo(() => {
    if (!phase?.content) {
      return null
    }
    
    // Handle both function components and class components
    if (typeof phase.content === 'function') {
      return phase.content
    }
    
    // Handle component objects
    if (phase.content.$$typeof || phase.content.type) {
      return () => phase.content
    }
    
    return null
  }, [phase?.content])

  // Error handler for error boundary
  const handleError = useCallback((error, errorInfo) => {
    console.error('TutorialContent Error:', error, errorInfo)
    
    // Call custom error handler if provided
    if (onError) {
      onError(error, errorInfo, phase)
    }
  }, [onError, phase])

  // Reset error boundary when phase changes
  const errorBoundaryKey = useMemo(() => {
    return `${tutorial?.id || 'unknown'}-${phase?.id || 'unknown'}`
  }, [tutorial?.id, phase?.id])

  // Validate required props
  if (!phase) {
    return (
      <ContentWrapper className={className}>
        <Alert>
          <IconAlertTriangle className="h-4 w-4" />
          <AlertDescription>
            No phase content available. Please select a valid phase.
          </AlertDescription>
        </Alert>
      </ContentWrapper>
    )
  }

  if (!ContentComponent) {
    return (
      <ContentWrapper className={className}>
        <Alert>
          <IconAlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Phase "{phase.title}" does not have valid content defined.
          </AlertDescription>
        </Alert>
      </ContentWrapper>
    )
  }

  // Prepare props for the content component
  const contentComponentProps = {
    // Tutorial hook results for real-time data
    ...tutorialHookResult,
    
    // Phase information
    phase,
    tutorial,
    
    // Additional props
    ...contentProps
  }

  // Content renderer
  const renderContent = () => {
    return (
      <Suspense fallback={showLoadingState ? <ContentSkeleton /> : null}>
        <ContentComponent {...contentComponentProps} />
      </Suspense>
    )
  }

  // Render with or without error boundary
  if (enableErrorBoundary) {
    return (
      <ContentWrapper className={className}>
        <ErrorBoundary
          key={errorBoundaryKey}
          FallbackComponent={(props) => (
            <ContentErrorFallback {...props} phase={phase} />
          )}
          onError={handleError}
          onReset={() => {
            // Optional: Reset tutorial state or reload content
            console.log('Error boundary reset for phase:', phase.id)
          }}
        >
          {renderContent()}
        </ErrorBoundary>
      </ContentWrapper>
    )
  }

  return (
    <ContentWrapper className={className}>
      {renderContent()}
    </ContentWrapper>
  )
}

/**
 * Hook for managing tutorial content state
 */
export const useTutorialContent = (tutorial, currentPhaseId) => {
  const currentPhase = useMemo(() => {
    if (!tutorial?.phases || !currentPhaseId) {
      return null
    }
    
    return tutorial.phases.find(phase => phase.id === currentPhaseId) || null
  }, [tutorial?.phases, currentPhaseId])

  const phaseIndex = useMemo(() => {
    if (!tutorial?.phases || !currentPhaseId) {
      return -1
    }
    
    return tutorial.phases.findIndex(phase => phase.id === currentPhaseId)
  }, [tutorial?.phases, currentPhaseId])

  const hasNextPhase = useMemo(() => {
    return tutorial?.phases && phaseIndex >= 0 && phaseIndex < tutorial.phases.length - 1
  }, [tutorial?.phases, phaseIndex])

  const hasPreviousPhase = useMemo(() => {
    return phaseIndex > 0
  }, [phaseIndex])

  const nextPhase = useMemo(() => {
    if (!hasNextPhase || !tutorial?.phases) {
      return null
    }
    
    return tutorial.phases[phaseIndex + 1]
  }, [hasNextPhase, tutorial?.phases, phaseIndex])

  const previousPhase = useMemo(() => {
    if (!hasPreviousPhase || !tutorial?.phases) {
      return null
    }
    
    return tutorial.phases[phaseIndex - 1]
  }, [hasPreviousPhase, tutorial?.phases, phaseIndex])

  return {
    currentPhase,
    phaseIndex,
    hasNextPhase,
    hasPreviousPhase,
    nextPhase,
    previousPhase,
    totalPhases: tutorial?.phases?.length || 0
  }
}

/**
 * Higher-order component for tutorial content with automatic hook integration
 */
export const withTutorialContent = (WrappedComponent) => {
  const WithTutorialContentComponent = (props) => {
    const {
      tutorial,
      currentPhaseId,
      tutorialHookResult,
      ...otherProps
    } = props

    const contentState = useTutorialContent(tutorial, currentPhaseId)

    return (
      <WrappedComponent
        {...otherProps}
        {...contentState}
        tutorial={tutorial}
        tutorialHookResult={tutorialHookResult}
      />
    )
  }

  WithTutorialContentComponent.displayName = `withTutorialContent(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`

  return WithTutorialContentComponent
}

/**
 * Utility function to validate phase content
 */
export const validatePhaseContent = (phase) => {
  const errors = []
  const warnings = []

  if (!phase) {
    errors.push('Phase is required')
    return { isValid: false, errors, warnings }
  }

  if (!phase.id) {
    errors.push('Phase must have an id')
  }

  if (!phase.title) {
    errors.push('Phase must have a title')
  }

  if (!phase.content) {
    errors.push('Phase must have content')
  } else if (typeof phase.content !== 'function' && !phase.content.$$typeof && !phase.content.type) {
    errors.push('Phase content must be a React component or function')
  }

  // Check for common issues
  if (phase.title && phase.title.length > 100) {
    warnings.push('Phase title is very long (>100 characters)')
  }

  if (phase.description && phase.description.length > 500) {
    warnings.push('Phase description is very long (>500 characters)')
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
export default TutorialContent