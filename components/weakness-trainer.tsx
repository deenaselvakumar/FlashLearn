"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Target,
  Brain,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Zap,
  BookOpen,
  Clock,
  ArrowRight,
  RefreshCw,
} from "lucide-react"

interface WeakTopic {
  topic: string
  subtopic: string
  currentScore: number
  targetScore: number
  sessionsStudied: number
  lastStudied: string
  difficulty: "High" | "Medium" | "Low"
  improvementPotential: number
  weaknessType: "conceptual" | "application" | "memory"
  relatedTopics: string[]
}

interface TrainingFlashcard {
  id: string
  question: string
  answer: string
  explanation: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  concept: string
  trainingType: "foundation" | "practice" | "mastery"
  hints: string[]
  commonMistakes: string[]
  relatedConcepts: string[]
  examples: string[]
}

interface WeaknessTrainerProps {
  userWeaknesses: WeakTopic[]
  onStartTraining: (topic: string) => void
}

export function WeaknessTrainer({ userWeaknesses, onStartTraining }: WeaknessTrainerProps) {
  const [selectedWeakness, setSelectedWeakness] = useState<WeakTopic | null>(null)
  const [trainingFlashcards, setTrainingFlashcards] = useState<TrainingFlashcard[]>([])
  const [isGeneratingCards, setIsGeneratingCards] = useState(false)
  const [trainingProgress, setTrainingProgress] = useState<Record<string, number>>({})

  const generateTrainingFlashcards = (weakness: WeakTopic): TrainingFlashcard[] => {
    const cards: TrainingFlashcard[] = []

    // Generate foundation cards for conceptual understanding
    if (weakness.weaknessType === "conceptual" || weakness.currentScore < 40) {
      cards.push(...generateFoundationCards(weakness))
    }

    // Generate practice cards for application
    if (weakness.weaknessType === "application" || weakness.currentScore < 60) {
      cards.push(...generatePracticeCards(weakness))
    }

    // Generate mastery cards for advanced understanding
    if (weakness.currentScore >= 40) {
      cards.push(...generateMasteryCards(weakness))
    }

    return cards
  }

  const generateFoundationCards = (weakness: WeakTopic): TrainingFlashcard[] => {
    const foundationCards: TrainingFlashcard[] = []

    if (weakness.topic === "Physics" && weakness.subtopic === "Newton's Second Law") {
      foundationCards.push(
        {
          id: `foundation-${weakness.subtopic}-1`,
          question: "What is the basic formula for Newton's Second Law?",
          answer: "F = ma (Force equals mass times acceleration)",
          explanation:
            "Newton's Second Law states that the force acting on an object is equal to the mass of the object multiplied by its acceleration. This is one of the most fundamental equations in physics, relating force, mass, and acceleration in a direct mathematical relationship.",
          difficulty: "Beginner",
          concept: "Basic Formula",
          trainingType: "foundation",
          hints: [
            "Think about the three key variables: Force, mass, and acceleration",
            "The formula uses the first letter of each word",
            "Force is measured in Newtons (N)",
          ],
          commonMistakes: [
            "Confusing F = ma with F = mv (momentum)",
            "Forgetting that acceleration includes direction",
            "Not considering all forces acting on the object",
          ],
          relatedConcepts: ["Force", "Mass", "Acceleration", "Newton's First Law"],
          examples: [
            "A 2kg ball accelerating at 5 m/s² requires 10N of force",
            "Pushing a heavy box requires more force than a light box for the same acceleration",
          ],
        },
        {
          id: `foundation-${weakness.subtopic}-2`,
          question: "What does 'acceleration' mean in Newton's Second Law?",
          answer: "Acceleration is the rate of change of velocity, measured in m/s²",
          explanation:
            "Acceleration is not just speeding up - it's any change in velocity, including slowing down or changing direction. It's measured in meters per second squared (m/s²) because it represents how much the velocity changes each second.",
          difficulty: "Beginner",
          concept: "Acceleration Definition",
          trainingType: "foundation",
          hints: [
            "Acceleration can be positive (speeding up) or negative (slowing down)",
            "Changing direction is also acceleration, even at constant speed",
            "Units are m/s² - velocity change per second",
          ],
          commonMistakes: [
            "Thinking acceleration only means speeding up",
            "Confusing acceleration with velocity",
            "Forgetting that acceleration is a vector (has direction)",
          ],
          relatedConcepts: ["Velocity", "Speed", "Direction", "Vector"],
          examples: [
            "A car going around a curve at constant speed is accelerating",
            "Dropping a ball - it accelerates at 9.8 m/s² downward",
          ],
        },
      )
    } else if (weakness.topic === "Calculus" && weakness.subtopic === "Chain Rule") {
      foundationCards.push({
        id: `foundation-${weakness.subtopic}-1`,
        question: "What is the Chain Rule used for in calculus?",
        answer: "The Chain Rule is used to find the derivative of composite functions",
        explanation:
          "When you have a function inside another function (like f(g(x))), you can't just take the derivative normally. The Chain Rule tells us how to 'chain' together the derivatives of the outer and inner functions to get the correct result.",
        difficulty: "Beginner",
        concept: "Chain Rule Purpose",
        trainingType: "foundation",
        hints: [
          "Think 'function inside a function'",
          "You need to consider both the outer and inner function",
          "It's like peeling an onion - work from outside to inside",
        ],
        commonMistakes: [
          "Forgetting to multiply by the derivative of the inner function",
          "Applying the power rule directly to composite functions",
          "Not identifying which function is 'inside' which",
        ],
        relatedConcepts: ["Composite Functions", "Derivatives", "Function Composition"],
        examples: ["d/dx[sin(x²)] requires the chain rule", "d/dx[(3x+1)⁵] is a chain rule problem"],
      })
    }

    return foundationCards
  }

  const generatePracticeCards = (weakness: WeakTopic): TrainingFlashcard[] => {
    const practiceCards: TrainingFlashcard[] = []

    if (weakness.topic === "Physics" && weakness.subtopic === "Newton's Second Law") {
      practiceCards.push(
        {
          id: `practice-${weakness.subtopic}-1`,
          question: "A 5kg object accelerates at 3 m/s². What is the net force acting on it?",
          answer: "15 N",
          explanation:
            "Using F = ma: F = 5 kg × 3 m/s² = 15 N. The net force is 15 Newtons in the direction of acceleration. Remember that this is the NET force - if there are multiple forces, this is their combined effect.",
          difficulty: "Intermediate",
          concept: "Force Calculation",
          trainingType: "practice",
          hints: [
            "Use the formula F = ma",
            "Multiply mass (5 kg) by acceleration (3 m/s²)",
            "The answer will be in Newtons (N)",
          ],
          commonMistakes: [
            "Adding instead of multiplying",
            "Forgetting the units (Newtons)",
            "Not considering that this is NET force",
          ],
          relatedConcepts: ["Net Force", "Mass", "Acceleration"],
          examples: [
            "If the same object had 2 m/s² acceleration, force would be 10 N",
            "A 10 kg object with the same force would accelerate at 1.5 m/s²",
          ],
        },
        {
          id: `practice-${weakness.subtopic}-2`,
          question: "If a 20 N force acts on a 4 kg object, what is its acceleration?",
          answer: "5 m/s²",
          explanation:
            "Rearranging F = ma to solve for acceleration: a = F/m = 20 N ÷ 4 kg = 5 m/s². The object will accelerate at 5 meters per second squared in the direction of the applied force.",
          difficulty: "Intermediate",
          concept: "Acceleration Calculation",
          trainingType: "practice",
          hints: ["Rearrange F = ma to get a = F/m", "Divide force (20 N) by mass (4 kg)", "Units will be m/s²"],
          commonMistakes: [
            "Multiplying instead of dividing",
            "Using the wrong formula arrangement",
            "Mixing up which variable you're solving for",
          ],
          relatedConcepts: ["Force", "Mass", "Acceleration"],
          examples: [
            "Doubling the force would double the acceleration",
            "Doubling the mass would halve the acceleration",
          ],
        },
      )
    } else if (weakness.topic === "Calculus" && weakness.subtopic === "Chain Rule") {
      practiceCards.push({
        id: `practice-${weakness.subtopic}-1`,
        question: "Find the derivative of f(x) = (3x + 1)⁴ using the Chain Rule",
        answer: "f'(x) = 4(3x + 1)³ × 3 = 12(3x + 1)³",
        explanation:
          "Using the Chain Rule: d/dx[f(g(x))] = f'(g(x)) × g'(x). Here, the outer function is u⁴ and inner function is (3x + 1). The derivative of u⁴ is 4u³, and the derivative of (3x + 1) is 3. So we get 4(3x + 1)³ × 3 = 12(3x + 1)³.",
        difficulty: "Intermediate",
        concept: "Chain Rule Application",
        trainingType: "practice",
        hints: [
          "Identify outer function: u⁴ where u = 3x + 1",
          "Derivative of outer: 4u³",
          "Derivative of inner: 3",
          "Multiply them together",
        ],
        commonMistakes: [
          "Forgetting to multiply by the derivative of the inner function",
          "Taking derivative of (3x + 1)⁴ as just 4(3x + 1)³",
          "Not identifying the inner and outer functions correctly",
        ],
        relatedConcepts: ["Power Rule", "Composite Functions", "Derivatives"],
        examples: ["d/dx[(2x - 5)³] = 3(2x - 5)² × 2 = 6(2x - 5)²", "d/dx[sin(x²)] = cos(x²) × 2x"],
      })
    }

    return practiceCards
  }

  const generateMasteryCards = (weakness: WeakTopic): TrainingFlashcard[] => {
    const masteryCards: TrainingFlashcard[] = []

    if (weakness.topic === "Physics" && weakness.subtopic === "Newton's Second Law") {
      masteryCards.push({
        id: `mastery-${weakness.subtopic}-1`,
        question:
          "A 2kg block on a frictionless surface has forces of 10N right and 4N left applied. What is the block's acceleration?",
        answer: "3 m/s² to the right",
        explanation:
          "First find the net force: 10N right - 4N left = 6N right. Then apply F = ma: a = F/m = 6N ÷ 2kg = 3 m/s² to the right. This problem requires understanding that multiple forces combine to create a net force, and the acceleration is in the direction of the net force.",
        difficulty: "Advanced",
        concept: "Net Force Analysis",
        trainingType: "mastery",
        hints: [
          "Calculate the net force first (consider directions)",
          "Net force = 10N - 4N = 6N to the right",
          "Then use a = F/m with the net force",
        ],
        commonMistakes: [
          "Using individual forces instead of net force",
          "Ignoring the direction of forces",
          "Adding forces instead of considering their directions",
        ],
        relatedConcepts: ["Net Force", "Vector Addition", "Force Diagrams"],
        examples: [
          "If friction was present, it would oppose motion",
          "On an incline, you'd need to consider components of weight",
        ],
      })
    }

    return masteryCards
  }

  const handleStartTraining = async (weakness: WeakTopic) => {
    setSelectedWeakness(weakness)
    setIsGeneratingCards(true)

    // Simulate generating personalized training cards
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const cards = generateTrainingFlashcards(weakness)
    setTrainingFlashcards(cards)
    setIsGeneratingCards(false)
  }

  const getWeaknessColor = (score: number) => {
    if (score < 40) return "text-red-600"
    if (score < 60) return "text-orange-600"
    return "text-yellow-600"
  }

  const getWeaknessBadge = (score: number) => {
    if (score < 40) return "destructive"
    if (score < 60) return "secondary"
    return "outline"
  }

  const getPriorityIcon = (difficulty: string) => {
    switch (difficulty) {
      case "High":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "Medium":
        return <Target className="h-4 w-4 text-orange-600" />
      case "Low":
        return <CheckCircle className="h-4 w-4 text-yellow-600" />
      default:
        return <Brain className="h-4 w-4" />
    }
  }

  if (selectedWeakness && !isGeneratingCards && trainingFlashcards.length > 0) {
    return (
      <WeaknessTrainingSession
        weakness={selectedWeakness}
        flashcards={trainingFlashcards}
        onComplete={() => {
          setSelectedWeakness(null)
          setTrainingFlashcards([])
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-orange-600" />
            Weakness Training Center
          </CardTitle>
          <CardDescription>Targeted practice to strengthen your weak areas and boost your confidence</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Brain className="h-4 w-4" />
            <AlertDescription>
              Our AI has identified areas where you can improve. Each training session includes progressive difficulty
              levels with detailed explanations to help you master these concepts.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {isGeneratingCards && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="animate-spin mx-auto">
                <RefreshCw className="h-8 w-8 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold">Generating Personalized Training Cards</h3>
                <p className="text-sm text-muted-foreground">
                  Creating targeted exercises for {selectedWeakness?.subtopic}...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weakness Analysis */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {userWeaknesses.map((weakness, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getPriorityIcon(weakness.difficulty)}
                  <Badge variant={getWeaknessBadge(weakness.currentScore)}>{weakness.difficulty} Priority</Badge>
                </div>
                <div className={`text-2xl font-bold ${getWeaknessColor(weakness.currentScore)}`}>
                  {weakness.currentScore}%
                </div>
              </div>
              <CardTitle className="text-lg">{weakness.subtopic}</CardTitle>
              <CardDescription>{weakness.topic}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress to Target */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress to Target</span>
                  <span>{weakness.targetScore}% goal</span>
                </div>
                <Progress value={(weakness.currentScore / weakness.targetScore) * 100} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  {weakness.targetScore - weakness.currentScore}% improvement needed
                </div>
              </div>

              {/* Weakness Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Sessions studied:</span>
                  <span className="font-medium">{weakness.sessionsStudied}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last studied:</span>
                  <span className="font-medium">{weakness.lastStudied}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Weakness type:</span>
                  <Badge variant="outline" className="text-xs">
                    {weakness.weaknessType}
                  </Badge>
                </div>
              </div>

              {/* Improvement Potential */}
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg dark:bg-green-950 dark:border-green-800">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">
                    High Improvement Potential
                  </span>
                </div>
                <div className="text-xs text-green-700 dark:text-green-300">
                  Expected improvement: +{weakness.improvementPotential}% with focused practice
                </div>
              </div>

              {/* Related Topics */}
              {weakness.relatedTopics.length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-2">Related Topics:</div>
                  <div className="flex flex-wrap gap-1">
                    {weakness.relatedTopics.map((topic) => (
                      <Badge key={topic} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <Button
                onClick={() => handleStartTraining(weakness)}
                className="w-full bg-orange-600 hover:bg-orange-700"
                disabled={isGeneratingCards}
              >
                <Zap className="mr-2 h-4 w-4" />
                Start Targeted Training
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Training Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Training Recommendations
          </CardTitle>
          <CardDescription>Personalized study plan based on your weaknesses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userWeaknesses.slice(0, 3).map((weakness, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="font-medium">
                    {index + 1}. Focus on {weakness.subtopic}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {weakness.weaknessType === "conceptual" && "Build foundational understanding"}
                    {weakness.weaknessType === "application" && "Practice problem-solving skills"}
                    {weakness.weaknessType === "memory" && "Reinforce key facts and formulas"}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    Estimated time: {Math.ceil((weakness.targetScore - weakness.currentScore) / 10) * 15} minutes
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleStartTraining(weakness)}>
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Start
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface WeaknessTrainingSessionProps {
  weakness: WeakTopic
  flashcards: TrainingFlashcard[]
  onComplete: () => void
}

function WeaknessTrainingSession({ weakness, flashcards, onComplete }: WeaknessTrainingSessionProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [sessionResults, setSessionResults] = useState<Array<{ cardId: string; correct: boolean; hintsUsed: number }>>(
    [],
  )
  const [hintsUsed, setHintsUsed] = useState(0)
  const [showHints, setShowHints] = useState(false)

  const currentCard = flashcards[currentCardIndex]
  const progress = ((currentCardIndex + 1) / flashcards.length) * 100

  const handleResponse = (correct: boolean) => {
    setSessionResults((prev) => [
      ...prev,
      {
        cardId: currentCard.id,
        correct,
        hintsUsed,
      },
    ])

    if (!correct) {
      setShowExplanation(true)
      return
    }

    // Move to next card or complete session
    setTimeout(
      () => {
        if (currentCardIndex < flashcards.length - 1) {
          setCurrentCardIndex(currentCardIndex + 1)
          setShowAnswer(false)
          setShowExplanation(false)
          setShowHints(false)
          setHintsUsed(0)
        } else {
          // Session complete
          onComplete()
        }
      },
      correct ? 500 : 2000,
    )
  }

  const showHint = () => {
    setShowHints(true)
    setHintsUsed(hintsUsed + 1)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Training Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-orange-600" />
                Targeted Training: {weakness.subtopic}
              </CardTitle>
              <CardDescription>Strengthening your {weakness.weaknessType} understanding</CardDescription>
            </div>
            <Button variant="outline" onClick={onComplete}>
              Exit Training
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Training Progress</span>
            <span className="text-sm text-muted-foreground">
              {currentCardIndex + 1} of {flashcards.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Training Card */}
      <Card className="min-h-[600px]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{currentCard.concept}</Badge>
              <Badge
                variant={
                  currentCard.difficulty === "Beginner"
                    ? "default"
                    : currentCard.difficulty === "Intermediate"
                      ? "secondary"
                      : "destructive"
                }
              >
                {currentCard.difficulty}
              </Badge>
              <Badge variant="outline">{currentCard.trainingType}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Question */}
          <div className="text-center space-y-6">
            <div className="text-lg font-medium text-muted-foreground">{showAnswer ? "Answer" : "Question"}</div>
            <div className="text-xl font-semibold min-h-[150px] flex items-center justify-center p-8 bg-muted/30 rounded-lg border-2 border-dashed">
              {showAnswer ? currentCard.answer : currentCard.question}
            </div>
          </div>

          {/* Hints Section */}
          {!showAnswer && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Need help?</span>
                <Button variant="outline" size="sm" onClick={showHint} disabled={showHints}>
                  <Brain className="mr-2 h-4 w-4" />
                  {showHints ? "Hints Shown" : "Show Hints"}
                </Button>
              </div>

              {showHints && (
                <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      {currentCard.hints.map((hint, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <span className="text-blue-600 font-bold">💡</span>
                          <span className="text-sm">{hint}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Detailed Explanation (shown after wrong answer) */}
          {showExplanation && (
            <Card className="bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Brain className="h-5 w-5 text-orange-600" />
                  Detailed Explanation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm leading-relaxed">{currentCard.explanation}</div>

                {/* Examples */}
                {currentCard.examples.length > 0 && (
                  <div>
                    <div className="font-medium text-sm mb-2">Examples:</div>
                    <ul className="text-sm space-y-1">
                      {currentCard.examples.map((example, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-600">✓</span>
                          <span>{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Common Mistakes */}
                {currentCard.commonMistakes.length > 0 && (
                  <div>
                    <div className="font-medium text-sm mb-2">Common Mistakes to Avoid:</div>
                    <ul className="text-sm space-y-1">
                      {currentCard.commonMistakes.map((mistake, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-red-500">⚠️</span>
                          <span>{mistake}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Related Concepts */}
                {currentCard.relatedConcepts.length > 0 && (
                  <div>
                    <div className="font-medium text-sm mb-2">Related Concepts:</div>
                    <div className="flex flex-wrap gap-2">
                      {currentCard.relatedConcepts.map((concept) => (
                        <Badge key={concept} variant="outline" className="text-xs">
                          {concept}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center">
            {!showAnswer ? (
              <Button onClick={() => setShowAnswer(true)} size="lg" className="bg-orange-600 hover:bg-orange-700">
                <BookOpen className="mr-2 h-4 w-4" />
                Show Answer
              </Button>
            ) : (
              <div className="flex gap-3 w-full max-w-md">
                <Button variant="destructive" onClick={() => handleResponse(false)} className="flex-1">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Still Confused
                </Button>
                <Button onClick={() => handleResponse(true)} className="flex-1 bg-green-600 hover:bg-green-700">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Got It!
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Session Progress */}
      {sessionResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Training Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-green-600">
                  {sessionResults.filter((r) => r.correct).length}
                </div>
                <div className="text-sm text-muted-foreground">Mastered</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-orange-600">
                  {sessionResults.filter((r) => !r.correct).length}
                </div>
                <div className="text-sm text-muted-foreground">Need Review</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-blue-600">
                  {sessionResults.reduce((sum, r) => sum + r.hintsUsed, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Hints Used</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
