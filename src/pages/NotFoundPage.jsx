/**
 * NotFoundPage Component
 * 
 * 404 page displayed when users navigate to non-existent routes.
 */

import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { IconHome, IconArrowLeft, IconSearch, IconBook } from '@tabler/icons-react'

/**
 * NotFoundPage component
 */
function NotFoundPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleGoHome = () => {
    navigate('/')
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  const getSuggestions = () => {
    const path = location.pathname.toLowerCase()
    
    if (path.includes('tutorial')) {
      return {
        title: 'Looking for a tutorial?',
        description: 'Browse all available tutorials from our home page.',
        action: 'Browse Tutorials',
        icon: IconBook
      }
    }
    
    return {
      title: 'Need help finding something?',
      description: 'You can search for tutorials or browse our collection from the home page.',
      action: 'Go to Home',
      icon: IconSearch
    }
  }

  const suggestion = getSuggestions()
  const SuggestionIcon = suggestion.icon

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Visual */}
        <div className="mb-8">
          <div className="text-8xl font-bold text-primary/20 mb-4">
            404
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Page Not Found
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Current path info */}
        <Alert className="mb-6">
          <IconSearch className="h-4 w-4" />
          <AlertDescription>
            <div className="text-left">
              <strong>Requested URL:</strong>
              <code className="ml-2 bg-muted px-2 py-1 rounded text-sm">
                {location.pathname}
              </code>
            </div>
          </AlertDescription>
        </Alert>

        {/* Suggestion based on path */}
        <div className="bg-card border rounded-lg p-6 mb-8">
          <SuggestionIcon className="w-12 h-12 mx-auto text-primary mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            {suggestion.title}
          </h2>
          <p className="text-muted-foreground mb-4">
            {suggestion.description}
          </p>
          <Button onClick={handleGoHome} className="flex items-center gap-2 mx-auto">
            <SuggestionIcon className="w-4 h-4" />
            {suggestion.action}
          </Button>
        </div>

        {/* Navigation options */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Button onClick={handleGoBack} variant="outline" className="flex items-center gap-2">
            <IconArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
          <Button onClick={handleGoHome} className="flex items-center gap-2">
            <IconHome className="w-4 h-4" />
            Home Page
          </Button>
        </div>

        {/* Additional help */}
        <div className="text-sm text-muted-foreground">
          <p className="mb-2">
            If you believe this is an error, please check the URL for typos or contact support.
          </p>
          <p>
            You can also try refreshing the page or clearing your browser cache.
          </p>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage