"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  RotateCcw,
  Check,
  X,
  Eye,
  Volume2,
  ArrowLeft,
  ArrowRight,
  Home,
  Brain,
  Target,
  Lightbulb,
  BookOpen,
} from "lucide-react"

interface EnhancedFlashcard {
  id: string
  question: string
  answer: string
  explanation: string
  topic: string
  difficulty: "Easy" | "Medium" | "Hard"
  slideSource: number
  type: "definition" | "concept" | "application"
  hints: string[]
  relatedConcepts: string[]
  commonMistakes: string[]
}

interface EnhancedFlashcardStudyProps {
  flashcards: EnhancedFlashcard[]
  onExit: () => void
}

interface StudySession {
  cardId: string
  response: "correct" | "incorrect" | "review"
  timeSpent: number
  attempts: number
  hintsUsed: number
  explanationViewed: boolean
}

export function EnhancedFlashcardStudy({ flashcards, onExit }: EnhancedFlashcardStudyProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [studySession, setStudySession] = useState<StudySession[]>([])
  const [startTime, setStartTime] = useState<number>(Date.now())
  const [sessionStartTime] = useState<number>(Date.now())
  const [isComplete, setIsComplete] = useState(false)
  const [hintsUsed, setHintsUsed] = useState(0)

  const currentCard = flashcards[currentIndex]
  const progress = ((currentIndex + 1) / flashcards.length) * 100

  useEffect(() => {
    setStartTime(Date.now())
    setShowAnswer(false)
    setShowExplanation(false)
    setShowHints(false)
    setHintsUsed(0)
  }, [currentIndex])

  const handleResponse = (response: "correct" | "incorrect" | "review") => {
    const timeSpent = Date.now() - startTime
    const existingSession = studySession.find((s) => s.cardId === currentCard.id)

    if (existingSession) {
      setStudySession((prev) =>
        prev.map((s) =>
          s.cardId === currentCard.id
            ? {
                ...s,
                response,
                timeSpent: s.timeSpent + timeSpent,
                attempts: s.attempts + 1,
                hintsUsed: Math.max(s.hintsUsed, hintsUsed),
                explanationViewed: s.explanationViewed || showExplanation,
              }
            : s,
        ),
      )
    } else {
      setStudySession((prev) => [
        ...prev,
        {
          cardId: currentCard.id,
          response,
          timeSpent,
          attempts: 1,
          hintsUsed,
          explanationViewed: showExplanation,
        },
      ])
    }

    // Show explanation for incorrect answers
    if (response === "incorrect" && !showExplanation) {
      setShowExplanation(true)
      return
    }

    // Auto-advance after a short delay
    setTimeout(
      () => {
        if (currentIndex < flashcards.length - 1) {
          setCurrentIndex(currentIndex + 1)
        } else {
          setIsComplete(true)
        }
      },
      response === "incorrect" ? 2000 : 500,
    )
  }

  const nextCard = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      speechSynthesis.speak(utterance)
    }
  }

  const showHint = () => {
    setShowHints(true)
    setHintsUsed(hintsUsed + 1)
  }

  const getSessionStats = () => {
    const correct = studySession.filter((s) => s.response === "correct").length
    const incorrect = studySession.filter((s) => s.response === "incorrect").length
    const review = studySession.filter((s) => s.response === "review").length
    const totalTime = Math.floor((Date.now() - sessionStartTime) / 1000)
    const accuracy = studySession.length > 0 ? Math.round((correct / studySession.length) * 100) : 0
    const totalHints = studySession.reduce((sum, s) => sum + s.hintsUsed, 0)
    const explanationsViewed = studySession.filter((s) => s.explanationViewed).length

    return { correct, incorrect, review, totalTime, accuracy, totalHints, explanationsViewed }
  }

  if (isComplete) {
    const stats = getSessionStats()

    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            Study Session Complete!
          </CardTitle>
          <CardDescription>Comprehensive performance analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg dark:bg-green-950">
              <div className="text-2xl font-bold text-green-600">{stats.correct}</div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg dark:bg-red-950">
              <div className="text-2xl font-bold text-red-600">{stats.incorrect}</div>
              <div className="text-sm text-muted-foreground">Incorrect</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg dark:bg-blue-950">
              <div className="text-2xl font-bold text-blue-600">{stats.totalHints}</div>
              <div className="text-sm text-muted-foreground">Hints Used</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg dark:bg-purple-950">
              <div className="text-2xl font-bold text-purple-600">{stats.explanationsViewed}</div>
              <div className="text-sm text-muted-foreground">Explanations</div>
            </div>
          </div>

          {/* Learning Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Learning Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.incorrect > 0 && (
                <Alert>
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    You got {stats.incorrect} questions wrong. Review the explanations provided to strengthen your
                    understanding.
                  </AlertDescription>
                </Alert>
              )}

              {stats.totalHints > 5 && (
                <Alert>
                  <BookOpen className="h-4 w-4" />
                  <AlertDescription>
                    You used {stats.totalHints} hints. Consider reviewing the fundamental concepts before your next
                    session.
                  </AlertDescription>
                </Alert>
              )}

              {stats.accuracy >= 90 && (
                <Alert className="border-green-200 bg-green-50 dark:bg-green-950">
                  <Target className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    Excellent performance! You're mastering this material. Consider moving to more advanced topics.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button onClick={onExit} variant="outline" className="flex-1 bg-transparent">
              <Home className="mr-2 h-4 w-4" />
              Back to Editor
            </Button>
            <Button
              onClick={() => {
                setCurrentIndex(0)
                setShowAnswer(false)
                setShowExplanation(false)
                setStudySession([])
                setIsComplete(false)
              }}
              className="flex-1 bg-orange-600 hover:bg-orange-700"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Study Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Enhanced Study Mode</h1>
          <p className="text-muted-foreground">Interactive learning with hints and explanations</p>
        </div>
        <Button onClick={onExit} variant="outline">
          <Home className="mr-2 h-4 w-4" />
          Exit Study Mode
        </Button>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">
              {currentIndex + 1} of {flashcards.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Enhanced Flashcard */}
      <Card className="min-h-[600px]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline">Slide {currentCard.slideSource}</Badge>
              <Badge variant="secondary">{currentCard.topic}</Badge>
              <Badge
                variant={
                  currentCard.difficulty === "Easy"
                    ? "default"
                    : currentCard.difficulty === "Medium"
                      ? "secondary"
                      : "destructive"
                }
              >
                {currentCard.difficulty}
              </Badge>
              <Badge variant="outline">{currentCard.type}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => speakText(showAnswer ? currentCard.answer : currentCard.question)}
              >
                <Volume2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
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
                  <Lightbulb className="mr-2 h-4 w-4" />
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

          {/* Explanation Section (shown after wrong answer) */}
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

                {currentCard.commonMistakes.length > 0 && (
                  <div>
                    <div className="font-medium text-sm mb-2">Common Mistakes:</div>
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
                <Eye className="mr-2 h-4 w-4" />
                Show Answer
              </Button>
            ) : (
              <div className="flex gap-3 w-full max-w-md">
                <Button variant="destructive" onClick={() => handleResponse("incorrect")} className="flex-1">
                  <X className="mr-2 h-4 w-4" />
                  Incorrect
                </Button>
                <Button variant="outline" onClick={() => handleResponse("review")} className="flex-1">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Review
                </Button>
                <Button onClick={() => handleResponse("correct")} className="flex-1 bg-green-600 hover:bg-green-700">
                  <Check className="mr-2 h-4 w-4" />
                  Correct
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={prevCard} disabled={currentIndex === 0}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button variant="outline" onClick={nextCard} disabled={currentIndex === flashcards.length - 1}>
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Enhanced Session Stats */}
      {studySession.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Current Session Analytics</CardTitle>
            <CardDescription>Real-time performance tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-green-600">
                  {studySession.filter((s) => s.response === "correct").length}
                </div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-red-600">
                  {studySession.filter((s) => s.response === "incorrect").length}
                </div>
                <div className="text-sm text-muted-foreground">Incorrect</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-blue-600">
                  {studySession.reduce((sum, s) => sum + s.hintsUsed, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Hints Used</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round((Date.now() - sessionStartTime) / 1000 / studySession.length) || 0}s
                </div>
                <div className="text-sm text-muted-foreground">Avg Time</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
