"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RotateCcw, Check, X, Eye, Volume2, BookmarkPlus, ArrowLeft, ArrowRight, Shuffle } from "lucide-react"
import { AppLayout } from "@/components/app-layout"

const flashcards = [
  {
    id: 1,
    question: "What is the derivative of x²?",
    answer: "2x",
    topic: "Calculus",
    difficulty: "Easy",
    tags: ["derivatives", "polynomials"],
  },
  {
    id: 2,
    question: "What is Newton's Second Law of Motion?",
    answer: "F = ma (Force equals mass times acceleration)",
    topic: "Physics",
    difficulty: "Medium",
    tags: ["mechanics", "laws"],
  },
  {
    id: 3,
    question: "What is the chemical formula for water?",
    answer: "H₂O",
    topic: "Chemistry",
    difficulty: "Easy",
    tags: ["formulas", "compounds"],
  },
]

export default function StudyPage() {
  const [currentCard, setCurrentCard] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [userResponses, setUserResponses] = useState<Record<number, "known" | "unknown" | "review">>({})

  const card = flashcards[currentCard]
  const progress = ((currentCard + 1) / flashcards.length) * 100

  const handleResponse = (response: "known" | "unknown" | "review") => {
    setUserResponses((prev) => ({ ...prev, [card.id]: response }))

    // Auto-advance to next card after a short delay
    setTimeout(() => {
      if (currentCard < flashcards.length - 1) {
        setCurrentCard(currentCard + 1)
        setShowAnswer(false)
      }
    }, 500)
  }

  const nextCard = () => {
    if (currentCard < flashcards.length - 1) {
      setCurrentCard(currentCard + 1)
      setShowAnswer(false)
    }
  }

  const prevCard = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1)
      setShowAnswer(false)
    }
  }

  const resetSession = () => {
    setCurrentCard(0)
    setShowAnswer(false)
    setUserResponses({})
  }

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      speechSynthesis.speak(utterance)
    }
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Study Session</h1>
            <p className="text-muted-foreground">Review your flashcards and track your progress</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={resetSession}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button variant="outline">
              <Shuffle className="mr-2 h-4 w-4" />
              Shuffle
            </Button>
          </div>
        </div>

        {/* Progress */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">
                {currentCard + 1} of {flashcards.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        {/* Flashcard */}
        <Card className="min-h-[400px]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{card.topic}</Badge>
                <Badge
                  variant={
                    card.difficulty === "Easy" ? "default" : card.difficulty === "Medium" ? "secondary" : "destructive"
                  }
                >
                  {card.difficulty}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => speakText(showAnswer ? card.answer : card.question)}>
                  <Volume2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <BookmarkPlus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="text-lg font-medium text-muted-foreground">{showAnswer ? "Answer" : "Question"}</div>
              <div className="text-2xl font-semibold min-h-[100px] flex items-center justify-center p-6 bg-muted/50 rounded-lg">
                {showAnswer ? card.answer : card.question}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 justify-center">
              {card.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center">
              {!showAnswer ? (
                <Button onClick={() => setShowAnswer(true)} size="lg">
                  <Eye className="mr-2 h-4 w-4" />
                  Show Answer
                </Button>
              ) : (
                <div className="flex gap-3">
                  <Button variant="destructive" onClick={() => handleResponse("unknown")} className="flex-1">
                    <X className="mr-2 h-4 w-4" />
                    Don't Know
                  </Button>
                  <Button variant="outline" onClick={() => handleResponse("review")} className="flex-1">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Review Later
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => handleResponse("known")}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <Check className="mr-2 h-4 w-4" />I Know This
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={prevCard} disabled={currentCard === 0}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button variant="outline" onClick={nextCard} disabled={currentCard === flashcards.length - 1}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Session Summary */}
        {Object.keys(userResponses).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Session Summary</CardTitle>
              <CardDescription>Your responses so far</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-green-600">
                    {Object.values(userResponses).filter((r) => r === "known").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Known</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-yellow-600">
                    {Object.values(userResponses).filter((r) => r === "review").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Review</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-red-600">
                    {Object.values(userResponses).filter((r) => r === "unknown").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Unknown</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  )
}
