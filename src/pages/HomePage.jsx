import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { IconClock, IconTrendingUp } from '@tabler/icons-react'

function HomePage() {
  const navigate = useNavigate()

  // Placeholder tutorial data - will be replaced with tutorial registry
  const tutorials = [
    {
      id: 'black-scholes-time',
      title: 'Black-Scholes: Understanding Time to Maturity (T)',
      description: 'Explore how time affects option pricing in the Black-Scholes model through interactive visualizations.',
      icon: <IconClock className="w-8 h-8" />,
      difficulty: 'intermediate',
      duration: '30-45 minutes',
      topics: ['Options', 'Black-Scholes', 'Time Value']
    }
  ]

  const handleTutorialClick = (tutorialId) => {
    navigate(`/tutorial/${tutorialId}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Interactive Learning Tutorials
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore complex financial concepts through interactive visualizations and hands-on learning experiences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutorials.map((tutorial) => (
          <Card 
            key={tutorial.id} 
            className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
            onClick={() => handleTutorialClick(tutorial.id)}
          >
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                {tutorial.icon}
                <div className="flex-1">
                  <CardTitle className="text-lg">{tutorial.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {tutorial.difficulty}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {tutorial.duration}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                {tutorial.description}
              </CardDescription>
              <div className="flex flex-wrap gap-1 mb-4">
                {tutorial.topics.map((topic) => (
                  <span 
                    key={topic}
                    className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded"
                  >
                    {topic}
                  </span>
                ))}
              </div>
              <Button className="w-full">
                Start Tutorial
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default HomePage