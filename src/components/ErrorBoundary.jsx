/**
 * ErrorBoundary Component
 * 
 * Catches JavaScript errors anywhere in the child component tree and displays
 * a fallback UI instead of crashing the entire application.
 */

import React from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { IconAlertTriangle, IconRefresh, IconHome } from '@tabler/icons-react'

/**
 * Error display component
 */
function ErrorFallback({ error, resetError, resetErrorBoundary }) {
  const isDevelopment = process.env.NODE_ENV === 'development'

  const handleGoHome = () => {
    window.location.href = '/'
  }

  const handleReload = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <IconAlertTriangle className="w-16 h-16 mx-auto text-destructive mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Something went wrong
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            We're sorry, but something unexpected happened. Please try refreshing the page or go back to the home page.
          </p>
        </div>

        {/* Error details in development */}
        {isDevelopment && error && (
          <Alert className="mb-6 text-left">
            <IconAlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <details className="mt-2">
                <summary className="cursor-pointer font-medium mb-2">
                  Error Details (Development Only)
                </summary>
                <div className="bg-muted p-3 rounded text-sm font-mono overflow-auto">
                  <div className="mb-2">
                    <strong>Message:</strong> {error.message}
                  </div>
                  {error.stack && (
                    <div>
                      <strong>Stack:</strong>
                      <pre className="whitespace-pre-wrap mt-1 text-xs">
                        {error.stack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            </AlertDescription>
          </Alert>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={resetErrorBoundary || handleReload} className="flex items-center gap-2">
            <IconRefresh className="w-4 h-4" />
            Try Again
          </Button>
          <Button onClick={handleGoHome} variant="outline" className="flex items-center gap-2">
            <IconHome className="w-4 h-4" />
            Go Home
          </Button>
        </div>

        {/* Additional help */}
        <div className="mt-8 text-sm text-muted-foreground">
          <p>
            If this problem persists, please try clearing your browser cache or contact support.
          </p>
        </div>
      </div>
    </div>
  )
}

/**
 * Error Boundary Class Component
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true,
      error 
    }
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo
    })

    // You can also log the error to an error reporting service here
    // logErrorToService(error, errorInfo)
  }

  resetErrorBoundary = () => {
    this.setState({ 
      hasError: false, 
      error: null,
      errorInfo: null 
    })
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          resetErrorBoundary={this.resetErrorBoundary}
        />
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary