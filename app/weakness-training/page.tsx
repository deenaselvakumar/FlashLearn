"use client"

import { AppLayout } from "@/components/app-layout"
import { WeaknessTrainer } from "@/components/weakness-trainer"

// Mock user weaknesses based on learning history
const mockUserWeaknesses = [
  {
    topic: "Physics",
    subtopic: "Newton's Second Law",
    currentScore: 35,
    targetScore: 80,
    sessionsStudied: 3,
    lastStudied: "2024-01-21",
    difficulty: "High" as const,
    improvementPotential: 45,
    weaknessType: "conceptual" as const,
    relatedTopics: ["Force", "Mass", "Acceleration", "Newton's First Law"],
  },
  {
    topic: "Calculus",
    subtopic: "Chain Rule",
    currentScore: 42,
    targetScore: 75,
    sessionsStudied: 2,
    lastStudied: "2024-01-20",
    difficulty: "High" as const,
    improvementPotential: 33,
    weaknessType: "application" as const,
    relatedTopics: ["Derivatives", "Composite Functions", "Power Rule"],
  },
  {
    topic: "Chemistry",
    subtopic: "Ionic Bonding",
    currentScore: 58,
    targetScore: 85,
    sessionsStudied: 4,
    lastStudied: "2024-01-19",
    difficulty: "Medium" as const,
    improvementPotential: 27,
    weaknessType: "memory" as const,
    relatedTopics: ["Electrons", "Covalent Bonding", "Atomic Structure"],
  },
  {
    topic: "Statistics",
    subtopic: "Standard Deviation",
    currentScore: 48,
    targetScore: 70,
    sessionsStudied: 2,
    lastStudied: "2024-01-18",
    difficulty: "Medium" as const,
    improvementPotential: 22,
    weaknessType: "conceptual" as const,
    relatedTopics: ["Mean", "Variance", "Normal Distribution"],
  },
  {
    topic: "Biology",
    subtopic: "Cellular Respiration",
    currentScore: 62,
    targetScore: 80,
    sessionsStudied: 3,
    lastStudied: "2024-01-17",
    difficulty: "Low" as const,
    improvementPotential: 18,
    weaknessType: "application" as const,
    relatedTopics: ["Photosynthesis", "ATP", "Mitochondria"],
  },
]

export default function WeaknessTrainingPage() {
  const handleStartTraining = (topic: string) => {
    console.log(`Starting training for: ${topic}`)
  }

  return (
    <AppLayout>
      <WeaknessTrainer userWeaknesses={mockUserWeaknesses} onStartTraining={handleStartTraining} />
    </AppLayout>
  )
}
