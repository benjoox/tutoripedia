// Tutorial Registry
// This will be populated with actual tutorials in subsequent tasks

const tutorials = new Map()

export const registerTutorial = (tutorial) => {
  tutorials.set(tutorial.id, tutorial)
}

export const getTutorial = (id) => {
  return tutorials.get(id)
}

export const getAllTutorials = () => {
  return Array.from(tutorials.values())
}

export const getTutorialIds = () => {
  return Array.from(tutorials.keys())
}

// Placeholder for future tutorial registrations
// registerTutorial(blackScholesTimeTutorial)

export default {
  registerTutorial,
  getTutorial,
  getAllTutorials,
  getTutorialIds
}