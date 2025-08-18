import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import TutorialPage from './pages/TutorialPage'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background wabi-sabi-surface">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tutorial/:tutorialId" element={<TutorialPage />} />
          <Route path="/tutorial/:tutorialId/:phaseId" element={<TutorialPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App