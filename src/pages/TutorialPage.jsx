import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { IconArrowLeft } from '@tabler/icons-react'

function TutorialPage() {
  const { tutorialId, phaseId } = useParams()
  const navigate = useNavigate()

  const handleBackToHome = () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Temporary header */}
      <div className="bg-card shadow-sm border-b border-border p-4">
        <div className="container mx-auto flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleBackToHome}
            className="flex items-center gap-2"
          >
            <IconArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
          <h1 className="text-xl font-semibold">
            Tutorial: {tutorialId}
            {phaseId && ` - Phase: ${phaseId}`}
          </h1>
        </div>
      </div>

      {/* Temporary content */}
      <div className="container mx-auto p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Tutorial Page</h2>
          <p className="text-muted-foreground mb-4">
            This is a placeholder for the tutorial content. The actual tutorial components will be implemented in subsequent tasks.
          </p>
          <div className="bg-muted p-4 rounded-lg">
            <p><strong>Tutorial ID:</strong> {tutorialId}</p>
            {phaseId && <p><strong>Phase ID:</strong> {phaseId}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TutorialPage