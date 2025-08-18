import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import TutorialPage from './pages/TutorialPage'
import NotFoundPage from './pages/NotFoundPage'
import ErrorBoundary from './components/ErrorBoundary'
import RouteGuard from './components/RouteGuard'
import './App.css'

/**
 * Main App component with routing configuration
 */
function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-background wabi-sabi-surface">
          <Routes>
            {/* Home route */}
            <Route path="/" element={<HomePage />} />
            
            {/* Tutorial routes with guards */}
            <Route 
              path="/tutorial/:tutorialId" 
              element={
                <RouteGuard>
                  <TutorialPage />
                </RouteGuard>
              } 
            />
            <Route 
              path="/tutorial/:tutorialId/:phaseId" 
              element={
                <RouteGuard>
                  <TutorialPage />
                </RouteGuard>
              } 
            />
            
            {/* Redirect legacy routes */}
            <Route path="/tutorials" element={<Navigate to="/" replace />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            
            {/* 404 catch-all */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  )
}

export default App