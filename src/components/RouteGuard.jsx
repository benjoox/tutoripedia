/**
 * RouteGuard Component
 * 
 * Provides navigation guards for tutorial routes, validating tutorial and phase IDs
 * before allowing access to the route.
 */

import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getTutorial, hasTutorial } from '@/tutorials'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { IconAlertCircle, IconHome, IconArrowLeft } from '@tabler/icons-react'

/**
 * Loading component for route validation
 */
function RouteValidationLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <Skeleton className="h-8 w-48 mx-auto" />
        <Skeleton className="h-4 w-64 mx-auto" />
        <div className="flex justify-center space-x-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </div>
  )
}

/**
 * Invalid route component
 */
function InvalidRoute({ type, tutorialId, phaseId, onGoHome, onGoBack }) {
  const getErrorMessage = () => {
    switch (type) {
      case 'tutorial-not-found':
        return {
          title: 'Tutorial Not Found',
          message: `The tutorial "${tutorialId}" does not exist or is not available.`
        }
      case 'phase-not-found':
        return {
          title: 'Phase Not Found',
          message: `The phase "${phaseId}" does not exist in tutorial "${tutorialId}".`
        }
      case 'tutorial-invalid':
        return {
          title: 'Invalid Tutorial',
          message: `The tutorial "${tutorialId}" is not properly configured.`
        }
      default:
        return {
          title: 'Route Not Found',
          message: 'The requested page could not be found.'
        }
    }
  }

  const { title, message } = getErrorMessage()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md mx-auto text-center">
        <IconAlertCircle className="w-16 h-16 mx-auto text-destructive mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {title}
        </h1>
        <p className="text-muted-foreground mb-6">
          {message}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onGoBack && (
            <Button onClick={onGoBack} variant="outline" className="flex items-center gap-2">
              <IconArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
          )}
          <Button onClick={onGoHome} className="flex items-center gap-2">
            <IconHome className="w-4 h-4" />
            Home
          </Button>
        </div>

        {type === 'tutorial-not-found' && (
          <Alert className="mt-6">
            <IconAlertCircle className="h-4 w-4" />
            <AlertDescription>
              You can browse all available tutorials from the home page.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}

/**
 * RouteGuard component
 */
function RouteGuard({ children }) {
  const { tutorialId, phaseId } = useParams()
  const navigate = useNavigate()
  const [validationState, setValidationState] = useState('loading')
  const [errorType, setErrorType] = useState(null)

  useEffect(() => {
    const validateRoute = async () => {
      try {
        setValidationState('loading')
        setErrorType(null)

        // Validate tutorial ID
        if (!tutorialId) {
          setErrorType('tutorial-not-found')
          setValidationState('invalid')
          return
        }

        // Check if tutorial exists
        if (!hasTutorial(tutorialId)) {
          setErrorType('tutorial-not-found')
          setValidationState('invalid')
          return
        }

        // Get tutorial data for phase validation
        const tutorial = getTutorial(tutorialId)
        if (!tutorial) {
          setErrorType('tutorial-invalid')
          setValidationState('invalid')
          return
        }

        // Validate phase ID if provided
        if (phaseId) {
          if (!tutorial.phases || tutorial.phases.length === 0) {
            setErrorType('phase-not-found')
            setValidationState('invalid')
            return
          }

          const phaseExists = tutorial.phases.some(phase => phase.id === phaseId)
          if (!phaseExists) {
            setErrorType('phase-not-found')
            setValidationState('invalid')
            return
          }
        }

        // All validations passed
        setValidationState('valid')

      } catch (error) {
        console.error('Route validation error:', error)
        setErrorType('tutorial-invalid')
        setValidationState('invalid')
      }
    }

    validateRoute()
  }, [tutorialId, phaseId])

  const handleGoHome = () => {
    navigate('/')
  }

  const handleGoBack = () => {
    if (phaseId) {
      // If we're on a phase route, go back to tutorial overview
      navigate(`/tutorial/${tutorialId}`)
    } else {
      // Otherwise go to home
      navigate('/')
    }
  }

  // Show loading state
  if (validationState === 'loading') {
    return <RouteValidationLoading />
  }

  // Show error state
  if (validationState === 'invalid') {
    return (
      <InvalidRoute
        type={errorType}
        tutorialId={tutorialId}
        phaseId={phaseId}
        onGoHome={handleGoHome}
        onGoBack={handleGoBack}
      />
    )
  }

  // Route is valid, render children
  return children
}

export default RouteGuard