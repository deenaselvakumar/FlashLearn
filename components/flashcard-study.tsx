"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RotateCcw, Check, X, Eye, Volume2, ArrowLeft, ArrowRight, Home, Brain, Target, Clock } from "lucide-react"

interface GeneratedFlashcard {
  id: string
  question: string
  answer: string
  topic: string
  difficulty: "Easy" | "Medium" | "Hard"
  slideSource: number
  type: "definition" | "concept" | "application"
}

interface FlashcardStudyProps {
  flashcards: GeneratedFlashcard[]
  onExit: () => void
}

interface StudySession {
  cardId: string
  response: "correct" | "incorrect" | "review"
  timeSpent: number
  attempts: number
}

export function FlashcardStudy({ flashcards, onExit }: FlashcardStudyProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [studySession, setStudySession] = useState<StudySession[]>([])
  const [startTime, setStartTime] = useState<number>(Date.now())
  const [sessionStartTime] = useState<number>(Date.now())
  const [isComplete, setIsComplete] = useState(false)

  const currentCard = flashcards[currentIndex]
  const progress = ((currentIndex + 1) / flashcards.length) * 100

  useEffect(() => {
    setStartTime(Date.now())
  }, [currentIndex])

  const handleResponse = (response: "correct" | "incorrect" | "review") => {
    const timeSpent = Date.now() - startTime
    const existingSession = studySession.find((s) => s.cardId === currentCard.id)

    if (existingSession) {
      setStudySession((prev) =>
        prev.map((s) =>
          s.cardId === currentCard.id
            ? { ...s, response, timeSpent: s.timeSpent + timeSpent, attempts: s.attempts + 1 }
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
        },
      ])
    }

    // Auto-advance after a short delay
    setTimeout(() => {
      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex(currentIndex + 1)
        setShowAnswer(false)
      } else {
        setIsComplete(true)
      }
    }, 500)
  }

  const nextCard = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setShowAnswer(false)
    }
  }

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setShowAnswer(false)
    }
  }

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      speechSynthesis.speak(utterance)
    }
  }

  const getSessionStats = () => {
    const correct = studySession.filter((s) => s.response === "correct").length
    const incorrect = studySession.filter((s) => s.response === "incorrect").length
    const review = studySession.filter((s) => s.response === "review").length
    const totalTime = Math.floor((Date.now() - sessionStartTime) / 1000)
    const accuracy = studySession.length > 0 ? Math.round((correct / studySession.length) * 100) : 0

    return { correct, incorrect, review, totalTime, accuracy }
  }

  if (isComplete) {
    const stats = getSessionStats()

    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            Study Session Complete!
          </CardTitle>
          <CardDescription>Great job! Here's how you performed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overall Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg dark:bg-green-950">
              <div className="text-2xl font-bold text-green-600">{stats.correct}</div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg dark:bg-red-950">
              <div className="text-2xl font-bold text-red-600">{stats.incorrect}</div>
              <div className="text-sm text-muted-foreground">Incorrect</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg dark:bg-yellow-950">
              <div className="text-2xl font-bold text-yellow-600">{stats.review}</div>
              <div className="text-sm text-muted-foreground">Review</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg dark:bg-blue-950">
              <div className="text-2xl font-bold text-blue-600">{stats.accuracy}%</div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </div>
          </div>

          {/* Time Stats */}
          <div className="flex items-center justify-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>
                Total time: {Math.floor(stats.totalTime / 60)}m {stats.totalTime % 60}s
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Brain className="h-4 w-4" />
              <span>Avg per card: {Math.round(stats.totalTime / flashcards.length)}s</span>
            </div>
          </div>

          {/* Performance by Topic */}
          <div className="space-y-3">
            <h3 className="font-semibold">Performance by Topic</h3>
            {Object.entries(
              studySession.reduce(
                (acc, session) => {
                  const card = flashcards.find((c) => c.id === session.cardId)
                  if (card) {
                    if (!acc[card.topic]) {
                      acc[card.topic] = { correct: 0, total: 0 }
                    }
                    acc[card.topic].total++
                    if (session.response === "correct") {
                      acc[card.topic].correct++
                    }
                  }
                  return acc
                },
                {} as Record<string, { correct: number; total: number }>,
              ),
            ).map(([topic, stats]) => (
              <div key={topic} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="font-medium">{topic}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {stats.correct}/{stats.total}
                  </span>
                  <Badge
                    variant={
                      stats.correct / stats.total >= 0.8
                        ? "default"
                        : stats.correct / stats.total >= 0.6
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {Math.round((stats.correct / stats.total) * 100)}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button onClick={onExit} variant="outline" className="flex-1 bg-transparent">
              <Home className="mr-2 h-4 w-4" />
              Back to Editor
            </Button>
            <Button
              onClick={() => {
                setCurrentIndex(0)
                setShowAnswer(false)
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
          <h1 className="text-2xl font-bold">Study Mode</h1>
          <p className="text-muted-foreground">Review your flashcards and track your progress</p>
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

      {/* Flashcard */}
      <Card className="min-h-[500px]">
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

      {/* Current Session Stats */}
      {studySession.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Current Session</CardTitle>
            <CardDescription>Your progress so far</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-green-600">
                  {studySession.filter((s) => s.response === "correct").length}
                </div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-yellow-600">
                  {studySession.filter((s) => s.response === "review").length}
                </div>
                <div className="text-sm text-muted-foreground">Review</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-red-600">
                  {studySession.filter((s) => s.response === "incorrect").length}
                </div>
                <div className="text-sm text-muted-foreground">Incorrect</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
