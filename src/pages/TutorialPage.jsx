import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'
import PhaseNavigation from '@/components/layout/PhaseNavigation'
import Footer from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { IconMenu2, IconAlertCircle, IconHome } from '@tabler/icons-react'
import { getTutorial } from '@/tutorials'
import { cn } from '@/lib/utils'

/**
 * Loading skeleton for tutorial page
 */
function TutorialPageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header skeleton */}
      <div className="h-20 bg-card border-b border-border/50">
        <div className="container mx-auto px-4 h-full flex items-center">
          <Skeleton className="h-10 w-10 mr-3" />
          <div className="flex-1">
            <Skeleton className="h-6 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </div>

      {/* Phase navigation skeleton */}
      <div className="h-16 bg-background border-b border-border/50">
        <div className="container mx-auto px-4 h-full flex items-center gap-2">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-9 w-24" />
          ))}
        </div>
      </div>

      {/* Content skeleton */}
      <div className="flex">
        {/* Sidebar skeleton */}
        <div className="hidden lg:block w-80 border-r border-border/50 p-6">
          <Skeleton className="h-6 w-32 mb-6" />
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Main content skeleton */}
        <div className="flex-1 p-8">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-8" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  )
}

/**
 * Error display component
 */
function TutorialError({ error, onRetry, onGoHome }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-8">
        <IconAlertCircle className="w-16 h-16 mx-auto text-destructive mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Tutorial Not Found
        </h1>
        <p className="text-muted-foreground mb-6">
          {error.message || 'The requested tutorial could not be loaded.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <Button onClick={onRetry} variant="outline">
              Try Again
            </Button>
          )}
          <Button onClick={onGoHome}>
            <IconHome className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}

/**
 * Main TutorialPage component
 */
function TutorialPage() {
  const { tutorialId, phaseId } = useParams()
  const navigate = useNavigate()
  
  // State management
  const [tutorial, setTutorial] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0)
  const [parameterValues, setParameterValues] = useState({})
  const [calculations, setCalculations] = useState({})
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Load tutorial data
  useEffect(() => {
    const loadTutorial = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Get tutorial from registry
        const tutorialData = getTutorial(tutorialId, { throwOnNotFound: true })
        
        if (!tutorialData) {
          throw new Error(`Tutorial "${tutorialId}" not found`)
        }
        
        setTutorial(tutorialData)
        
        // Initialize parameter values with defaults
        const initialValues = {}
        if (tutorialData.parameters) {
          tutorialData.parameters.forEach(param => {
            initialValues[param.key] = param.defaultValue || param.min || 0
          })
        }
        setParameterValues(initialValues)
        
        // Set initial phase
        if (phaseId && tutorialData.phases) {
          const phaseIndex = tutorialData.phases.findIndex(phase => phase.id === phaseId)
          if (phaseIndex !== -1) {
            setCurrentPhaseIndex(phaseIndex)
          }
        }
        
      } catch (err) {
        console.error('Error loading tutorial:', err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    if (tutorialId) {
      loadTutorial()
    }
  }, [tutorialId, phaseId])

  // Update URL when phase changes
  useEffect(() => {
    if (tutorial && tutorial.phases && tutorial.phases[currentPhaseIndex]) {
      const newPhaseId = tutorial.phases[currentPhaseIndex].id
      const newPath = `/tutorial/${tutorialId}/${newPhaseId}`
      
      // Only update if the URL is different
      if (window.location.pathname !== newPath) {
        navigate(newPath, { replace: true })
      }
    }
  }, [tutorial, currentPhaseIndex, tutorialId, navigate])

  // Calculate derived values when parameters change
  useEffect(() => {
    if (tutorial && tutorial.calculations && parameterValues) {
      try {
        // Run tutorial calculations with current parameter values
        const results = tutorial.calculations(parameterValues)
        setCalculations(results || {})
      } catch (err) {
        console.error('Error calculating values:', err)
        setCalculations({})
      }
    }
  }, [tutorial, parameterValues])

  // Memoized values
  const currentPhase = useMemo(() => {
    return tutorial?.phases?.[currentPhaseIndex] || null
  }, [tutorial, currentPhaseIndex])

  const headerTitle = useMemo(() => {
    return tutorial?.shortTitle || tutorial?.title || 'Tutorial'
  }, [tutorial])

  const headerSubtitle = useMemo(() => {
    if (currentPhase) {
      return `Phase ${currentPhaseIndex + 1}: ${currentPhase.title}`
    }
    return tutorial?.description || ''
  }, [tutorial, currentPhase, currentPhaseIndex])

  // Event handlers
  const handleBackToHome = useCallback(() => {
    navigate('/')
  }, [navigate])

  const handlePhaseChange = useCallback((newPhaseIndex) => {
    if (tutorial?.phases?.[newPhaseIndex]) {
      setCurrentPhaseIndex(newPhaseIndex)
    }
  }, [tutorial])

  const handleParameterChange = useCallback((key, value) => {
    setParameterValues(prev => ({
      ...prev,
      [key]: value
    }))
  }, [])

  const handleSidebarToggle = useCallback(() => {
    setSidebarOpen(prev => !prev)
  }, [])

  const handleSidebarClose = useCallback(() => {
    setSidebarOpen(false)
  }, [])

  const handleRetry = useCallback(() => {
    setError(null)
    setLoading(true)
    // Trigger re-load by updating a dependency
    window.location.reload()
  }, [])

  // Loading state
  if (loading) {
    return <TutorialPageSkeleton />
  }

  // Error state
  if (error) {
    return (
      <TutorialError
        error={error}
        onRetry={handleRetry}
        onGoHome={handleBackToHome}
      />
    )
  }

  // No tutorial found
  if (!tutorial) {
    return (
      <TutorialError
        error={{ message: 'Tutorial data is not available' }}
        onGoHome={handleBackToHome}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header
        title={headerTitle}
        subtitle={headerSubtitle}
        onBackClick={handleBackToHome}
      />

      {/* Phase Navigation */}
      {tutorial.phases && tutorial.phases.length > 1 && (
        <PhaseNavigation
          phases={tutorial.phases}
          currentPhase={currentPhaseIndex}
          onPhaseChange={handlePhaseChange}
          isSticky={true}
        />
      )}

      {/* Main Content Layout */}
      <div className="flex min-h-0">
        {/* Sidebar */}
        {tutorial.parameters && tutorial.parameters.length > 0 && (
          <Sidebar
            parameters={tutorial.parameters}
            values={parameterValues}
            onChange={handleParameterChange}
            calculations={calculations}
            isOpen={sidebarOpen}
            onClose={handleSidebarClose}
          />
        )}

        {/* Main Content Area */}
        <main className={cn(
          "flex-1 min-h-0",
          // Add left margin for sidebar on desktop when sidebar exists
          tutorial.parameters?.length > 0 && "lg:ml-80"
        )}>
          {/* Mobile sidebar toggle */}
          {tutorial.parameters && tutorial.parameters.length > 0 && (
            <div className="lg:hidden p-4 border-b border-border/50">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSidebarToggle}
                className="flex items-center gap-2"
              >
                <IconMenu2 className="w-4 h-4" />
                Parameters
              </Button>
            </div>
          )}

          {/* Phase Content */}
          <div className="p-6 lg:p-8">
            {currentPhase ? (
              <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-foreground mb-4">
                    {currentPhase.title}
                  </h1>
                  {currentPhase.description && (
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {currentPhase.description}
                    </p>
                  )}
                </div>

                {/* Phase Component */}
                {currentPhase.component ? (
                  <currentPhase.component
                    parameters={parameterValues}
                    calculations={calculations}
                    onParameterChange={handleParameterChange}
                  />
                ) : (
                  <Alert>
                    <IconAlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      This phase is under development. The interactive content will be available soon.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ) : (
              <div className="max-w-4xl mx-auto text-center py-16">
                <h1 className="text-3xl font-bold text-foreground mb-4">
                  {tutorial.title}
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                  {tutorial.description}
                </p>
                <Alert>
                  <IconAlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No phases are available for this tutorial yet.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Footer */}
      {tutorial.phases && tutorial.phases.length > 1 && (
        <Footer
          phases={tutorial.phases}
          currentPhase={currentPhaseIndex}
          onPhaseChange={handlePhaseChange}
          showProgress={true}
        />
      )}
    </div>
  )
}

export default TutorialPage