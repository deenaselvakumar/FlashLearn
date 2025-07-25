"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth-provider"
import { Sword, Clock, Flame, CheckCircle, XCircle } from "lucide-react"

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  difficulty: "easy" | "medium" | "hard"
  topic: string
}

interface BattleState {
  phase: "countdown" | "battle" | "results"
  currentQuestion: number
  timeLeft: number
  playerScore: number
  opponentScore: number
  playerStreak: number
  opponentStreak: number
  playerAnswers: (number | null)[]
  opponentAnswers: (number | null)[]
}

const mockQuestions: Question[] = [
  {
    id: "q1",
    question: "What is the derivative of x²?",
    options: ["2x", "x²", "2", "x"],
    correctAnswer: 0,
    difficulty: "easy",
    topic: "Calculus",
  },
  {
    id: "q2",
    question: "Which element has the chemical symbol 'Au'?",
    options: ["Silver", "Gold", "Aluminum", "Argon"],
    correctAnswer: 1,
    difficulty: "medium",
    topic: "Chemistry",
  },
  {
    id: "q3",
    question: "What is the time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    correctAnswer: 1,
    difficulty: "hard",
    topic: "Computer Science",
  },
  {
    id: "q4",
    question: "Who wrote 'Romeo and Juliet'?",
    options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
    correctAnswer: 1,
    difficulty: "easy",
    topic: "Literature",
  },
  {
    id: "q5",
    question: "What is the capital of Australia?",
    options: ["Sydney", "Melbourne", "Canberra", "Perth"],
    correctAnswer: 2,
    difficulty: "medium",
    topic: "Geography",
  },
]

interface BattleArenaProps {
  opponent: string
  onBattleEnd: (result: "win" | "lose" | "tie", stats: any) => void
}

export function BattleArena({ opponent, onBattleEnd }: BattleArenaProps) {
  const { user } = useAuth()
  const [battleState, setBattleState] = useState<BattleState>({
    phase: "countdown",
    currentQuestion: 0,
    timeLeft: 3,
    playerScore: 0,
    opponentScore: 0,
    playerStreak: 0,
    opponentStreak: 0,
    playerAnswers: [],
    opponentAnswers: [],
  })

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [questionStartTime, setQuestionStartTime] = useState<number>(0)

  // Countdown timer
  useEffect(() => {
    if (battleState.phase === "countdown" && battleState.timeLeft > 0) {
      const timer = setTimeout(() => {
        setBattleState((prev) => ({ ...prev, timeLeft: prev.timeLeft - 1 }))
      }, 1000)
      return () => clearTimeout(timer)
    } else if (battleState.phase === "countdown" && battleState.timeLeft === 0) {
      setBattleState((prev) => ({
        ...prev,
        phase: "battle",
        timeLeft: 15,
        playerAnswers: new Array(mockQuestions.length).fill(null),
        opponentAnswers: new Array(mockQuestions.length).fill(null),
      }))
      setQuestionStartTime(Date.now())
    }
  }, [battleState.phase, battleState.timeLeft])

  // Battle timer
  useEffect(() => {
    if (battleState.phase === "battle" && battleState.timeLeft > 0) {
      const timer = setTimeout(() => {
        setBattleState((prev) => ({ ...prev, timeLeft: prev.timeLeft - 1 }))
      }, 1000)
      return () => clearTimeout(timer)
    } else if (battleState.phase === "battle" && battleState.timeLeft === 0) {
      handleTimeUp()
    }
  }, [battleState.phase, battleState.timeLeft])

  // Simulate opponent answers
  useEffect(() => {
    if (battleState.phase === "battle") {
      const timer = setTimeout(
        () => {
          simulateOpponentAnswer()
        },
        Math.random() * 8000 + 2000,
      ) // Random delay between 2-10 seconds
      return () => clearTimeout(timer)
    }
  }, [battleState.currentQuestion, battleState.phase])

  const simulateOpponentAnswer = () => {
    const currentQ = mockQuestions[battleState.currentQuestion]
    const isCorrect = Math.random() > 0.3 // 70% chance of correct answer
    const answerIndex = isCorrect ? currentQ.correctAnswer : Math.floor(Math.random() * currentQ.options.length)

    setBattleState((prev) => {
      const newOpponentAnswers = [...prev.opponentAnswers]
      newOpponentAnswers[prev.currentQuestion] = answerIndex

      const points = isCorrect ? getPoints(currentQ.difficulty, 10) : 0
      const newStreak = isCorrect ? prev.opponentStreak + 1 : 0

      return {
        ...prev,
        opponentAnswers: newOpponentAnswers,
        opponentScore: prev.opponentScore + points,
        opponentStreak: newStreak,
      }
    })
  }

  const getPoints = (difficulty: string, timeBonus = 0) => {
    const basePoints = {
      easy: 10,
      medium: 20,
      hard: 30,
    }
    return basePoints[difficulty as keyof typeof basePoints] + Math.floor(timeBonus / 2)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return

    setSelectedAnswer(answerIndex)
    const responseTime = Date.now() - questionStartTime
    const timeBonus = Math.max(0, 15 - Math.floor(responseTime / 1000))

    const currentQ = mockQuestions[battleState.currentQuestion]
    const isCorrect = answerIndex === currentQ.correctAnswer
    const points = isCorrect ? getPoints(currentQ.difficulty, timeBonus) : 0

    setBattleState((prev) => {
      const newPlayerAnswers = [...prev.playerAnswers]
      newPlayerAnswers[prev.currentQuestion] = answerIndex

      const newStreak = isCorrect ? prev.playerStreak + 1 : 0

      return {
        ...prev,
        playerAnswers: newPlayerAnswers,
        playerScore: prev.playerScore + points,
        playerStreak: newStreak,
      }
    })

    // Move to next question after 2 seconds
    setTimeout(() => {
      if (battleState.currentQuestion < mockQuestions.length - 1) {
        setBattleState((prev) => ({
          ...prev,
          currentQuestion: prev.currentQuestion + 1,
          timeLeft: 15,
        }))
        setSelectedAnswer(null)
        setQuestionStartTime(Date.now())
      } else {
        endBattle()
      }
    }, 2000)
  }

  const handleTimeUp = () => {
    if (battleState.currentQuestion < mockQuestions.length - 1) {
      setBattleState((prev) => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
        timeLeft: 15,
        playerStreak: 0,
      }))
      setSelectedAnswer(null)
      setQuestionStartTime(Date.now())
    } else {
      endBattle()
    }
  }

  const endBattle = () => {
    setBattleState((prev) => ({ ...prev, phase: "results" }))

    const result =
      battleState.playerScore > battleState.opponentScore
        ? "win"
        : battleState.playerScore < battleState.opponentScore
          ? "lose"
          : "tie"

    const stats = {
      playerScore: battleState.playerScore,
      opponentScore: battleState.opponentScore,
      accuracy:
        (battleState.playerAnswers.filter((answer, index) => answer === mockQuestions[index]?.correctAnswer).length /
          mockQuestions.length) *
        100,
      questionsAnswered: battleState.playerAnswers.filter((answer) => answer !== null).length,
    }

    setTimeout(() => {
      onBattleEnd(result, stats)
    }, 5000)
  }

  const currentQuestion = mockQuestions[battleState.currentQuestion]

  if (battleState.phase === "countdown") {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-8xl font-bold text-orange-600 mb-4">{battleState.timeLeft || "GO!"}</div>
          <h2 className="text-2xl font-bold mb-2">Battle Starting!</h2>
          <p className="text-muted-foreground text-center">Get ready to face {opponent} in an epic flashcard battle!</p>
          <div className="flex items-center gap-8 mt-8">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                <AvatarFallback>{user?.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="font-medium">{user?.username}</span>
            </div>
            <Sword className="h-8 w-8 text-orange-600" />
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback>{opponent[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="font-medium">{opponent}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (battleState.phase === "results") {
    const result =
      battleState.playerScore > battleState.opponentScore
        ? "win"
        : battleState.playerScore < battleState.opponentScore
          ? "lose"
          : "tie"

    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div
            className={`text-6xl mb-4 ${
              result === "win" ? "text-green-600" : result === "lose" ? "text-red-600" : "text-yellow-600"
            }`}
          >
            {result === "win" ? "🏆" : result === "lose" ? "😔" : "🤝"}
          </div>
          <CardTitle className="text-3xl">
            {result === "win" ? "Victory!" : result === "lose" ? "Defeat!" : "Tie Game!"}
          </CardTitle>
          <CardDescription>
            {result === "win"
              ? "Congratulations! You won the battle!"
              : result === "lose"
                ? "Better luck next time!"
                : "Great battle! It's a tie!"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{battleState.playerScore}</div>
              <div className="text-sm text-muted-foreground">{user?.username}</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{battleState.opponentScore}</div>
              <div className="text-sm text-muted-foreground">{opponent}</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Questions Answered:</span>
              <span>
                {battleState.playerAnswers.filter((a) => a !== null).length}/{mockQuestions.length}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Accuracy:</span>
              <span>
                {Math.round(
                  (battleState.playerAnswers.filter((answer, index) => answer === mockQuestions[index]?.correctAnswer)
                    .length /
                    mockQuestions.length) *
                    100,
                )}
                %
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Best Streak:</span>
              <span>{Math.max(...[battleState.playerStreak, 0])}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Battle Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                <AvatarFallback>{user?.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{user?.username}</div>
                <div className="text-2xl font-bold text-blue-600">{battleState.playerScore}</div>
              </div>
              {battleState.playerStreak > 0 && (
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  <Flame className="h-3 w-3 mr-1" />
                  {battleState.playerStreak} streak
                </Badge>
              )}
            </div>

            <div className="text-center">
              <div className="text-sm text-muted-foreground">
                Question {battleState.currentQuestion + 1}/{mockQuestions.length}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="h-4 w-4" />
                <span className="font-mono text-lg">{battleState.timeLeft}s</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {battleState.opponentStreak > 0 && (
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  <Flame className="h-3 w-3 mr-1" />
                  {battleState.opponentStreak} streak
                </Badge>
              )}
              <div className="text-right">
                <div className="font-medium">{opponent}</div>
                <div className="text-2xl font-bold text-red-600">{battleState.opponentScore}</div>
              </div>
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback>{opponent[0].toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
          </div>

          <Progress value={(battleState.timeLeft / 15) * 100} className="h-2" />
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge
              variant={
                currentQuestion.difficulty === "easy"
                  ? "secondary"
                  : currentQuestion.difficulty === "medium"
                    ? "default"
                    : "destructive"
              }
            >
              {currentQuestion.difficulty.toUpperCase()}
            </Badge>
            <Badge variant="outline">{currentQuestion.topic}</Badge>
          </div>
          <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index
              const isCorrect = index === currentQuestion.correctAnswer
              const showResult = selectedAnswer !== null

              return (
                <Button
                  key={index}
                  variant={showResult ? (isCorrect ? "default" : isSelected ? "destructive" : "outline") : "outline"}
                  className={`justify-start h-auto p-4 text-left ${
                    showResult && isCorrect ? "bg-green-600 hover:bg-green-700" : ""
                  }`}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={selectedAnswer !== null}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="flex-1">{option}</span>
                    {showResult && isCorrect && <CheckCircle className="h-5 w-5" />}
                    {showResult && isSelected && !isCorrect && <XCircle className="h-5 w-5" />}
                  </div>
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Progress Indicator */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Battle Progress</span>
            <span className="text-sm text-muted-foreground">
              {battleState.currentQuestion + 1} of {mockQuestions.length}
            </span>
          </div>
          <Progress value={((battleState.currentQuestion + 1) / mockQuestions.length) * 100} />
        </CardContent>
      </Card>
    </div>
  )
}
