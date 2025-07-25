"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "./auth-provider"
import { Sword, Shield, Clock, Trophy, Target, FlameIcon as Fire, CheckCircle, XCircle } from "lucide-react"

interface BattleQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  topic: string
  difficulty: "Easy" | "Medium" | "Hard"
  timeLimit: number // seconds
}

interface BattlePlayer {
  id: string
  username: string
  avatar: string
  score: number
  streak: number
  answeredQuestions: number
  accuracy: number
}

interface BattleArenaProps {
  opponent: BattlePlayer
  questions: BattleQuestion[]
  onBattleEnd: (result: "win" | "lose" | "draw", finalScore: number) => void
}

const mockQuestions: BattleQuestion[] = [
  {
    id: "q1",
    question: "What is the derivative of x²?",
    options: ["2x", "x²", "2", "x"],
    correctAnswer: 0,
    topic: "Calculus",
    difficulty: "Easy",
    timeLimit: 15,
  },
  {
    id: "q2",
    question: "What is Newton's Second Law?",
    options: ["F = ma", "E = mc²", "F = mg", "a = v/t"],
    correctAnswer: 0,
    topic: "Physics",
    difficulty: "Medium",
    timeLimit: 20,
  },
  {
    id: "q3",
    question: "What is the chemical formula for water?",
    options: ["H₂O", "CO₂", "NaCl", "CH₄"],
    correctAnswer: 0,
    topic: "Chemistry",
    difficulty: "Easy",
    timeLimit: 10,
  },
  {
    id: "q4",
    question: "What is the integral of 2x?",
    options: ["x²", "x² + C", "2", "2x + C"],
    correctAnswer: 1,
    topic: "Calculus",
    difficulty: "Medium",
    timeLimit: 25,
  },
  {
    id: "q5",
    question: "What is the speed of light?",
    options: ["3×10⁸ m/s", "3×10⁶ m/s", "3×10¹⁰ m/s", "3×10⁴ m/s"],
    correctAnswer: 0,
    topic: "Physics",
    difficulty: "Hard",
    timeLimit: 30,
  },
]

export function BattleArena({ opponent, questions = mockQuestions, onBattleEnd }: BattleArenaProps) {
  const { user } = useAuth()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(questions[0]?.timeLimit || 15)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [battlePhase, setBattlePhase] = useState<"countdown" | "battle" | "result">("countdown")
  const [countdown, setCountdown] = useState(3)

  const [playerStats, setPlayerStats] = useState<BattlePlayer>({
    id: user?.id || "",
    username: user?.username || "",
    avatar: user?.avatar || "/placeholder.svg?height=40&width=40",
    score: 0,
    streak: 0,
    answeredQuestions: 0,
    accuracy: 0,
  })

  const [opponentStats, setOpponentStats] = useState<BattlePlayer>({
    ...opponent,
    score: 0,
    streak: 0,
    answeredQuestions: 0,
    accuracy: 0,
  })

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  // Countdown timer
  useEffect(() => {
    if (battlePhase === "countdown" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (battlePhase === "countdown" && countdown === 0) {
      setBattlePhase("battle")
      setTimeLeft(currentQuestion?.timeLimit || 15)
    }
  }, [countdown, battlePhase, currentQuestion])

  // Question timer
  useEffect(() => {
    if (battlePhase === "battle" && timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (battlePhase === "battle" && timeLeft === 0 && !showResult) {
      handleAnswer(null) // Time's up
    }
  }, [timeLeft, battlePhase, showResult])

  // Simulate opponent answers
  useEffect(() => {
    if (battlePhase === "battle" && !showResult) {
      const opponentDelay = Math.random() * (currentQuestion?.timeLimit * 0.8) * 1000
      const timer = setTimeout(() => {
        const isCorrect = Math.random() > 0.3 // 70% chance opponent gets it right
        const opponentAnswer = isCorrect
          ? currentQuestion.correctAnswer
          : Math.floor(Math.random() * currentQuestion.options.length)

        setOpponentStats((prev) => ({
          ...prev,
          answeredQuestions: prev.answeredQuestions + 1,
          score: prev.score + (isCorrect ? getQuestionPoints(currentQuestion.difficulty) : 0),
          streak: isCorrect ? prev.streak + 1 : 0,
          accuracy: Math.round((prev.score / getQuestionPoints("Easy") / (prev.answeredQuestions + 1)) * 100),
        }))
      }, opponentDelay)

      return () => clearTimeout(timer)
    }
  }, [currentQuestionIndex, battlePhase, showResult])

  const getQuestionPoints = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return 10
      case "Medium":
        return 20
      case "Hard":
        return 30
      default:
        return 10
    }
  }

  const handleAnswer = (answerIndex: number | null) => {
    if (showResult) return

    setSelectedAnswer(answerIndex)
    setShowResult(true)

    const isCorrect = answerIndex === currentQuestion.correctAnswer
    const points = isCorrect ? getQuestionPoints(currentQuestion.difficulty) : 0
    const timeBonus = Math.max(0, Math.floor(timeLeft / 2)) // Bonus points for speed

    setPlayerStats((prev) => ({
      ...prev,
      answeredQuestions: prev.answeredQuestions + 1,
      score: prev.score + points + timeBonus,
      streak: isCorrect ? prev.streak + 1 : 0,
      accuracy: Math.round(((prev.score + points) / (getQuestionPoints("Easy") * (prev.answeredQuestions + 1))) * 100),
    }))

    // Move to next question after showing result
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setSelectedAnswer(null)
        setShowResult(false)
        setTimeLeft(questions[currentQuestionIndex + 1]?.timeLimit || 15)
      } else {
        // Battle ended
        setBattlePhase("result")
        const finalResult =
          playerStats.score > opponentStats.score ? "win" : playerStats.score < opponentStats.score ? "lose" : "draw"
        onBattleEnd(finalResult, playerStats.score)
      }
    }, 2000)
  }

  if (battlePhase === "countdown") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="flex justify-center items-center gap-4">
                <div className="text-center">
                  <Avatar className="h-16 w-16 mx-auto mb-2">
                    <AvatarImage src={playerStats.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{playerStats.username[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="font-medium">{playerStats.username}</div>
                </div>
                <Sword className="h-8 w-8 text-orange-600" />
                <div className="text-center">
                  <Avatar className="h-16 w-16 mx-auto mb-2">
                    <AvatarImage src={opponentStats.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{opponentStats.username[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="font-medium">{opponentStats.username}</div>
                </div>
              </div>

              <div className="text-6xl font-bold text-orange-600">{countdown || "GO!"}</div>

              <div className="text-muted-foreground">Battle starting in {countdown} seconds...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (battlePhase === "result") {
    const playerWon = playerStats.score > opponentStats.score
    const isDraw = playerStats.score === opponentStats.score

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              {isDraw ? (
                <>
                  <Shield className="h-6 w-6 text-blue-600" />
                  It's a Draw!
                </>
              ) : playerWon ? (
                <>
                  <Trophy className="h-6 w-6 text-yellow-600" />
                  Victory!
                </>
              ) : (
                <>
                  <Target className="h-6 w-6 text-red-600" />
                  Defeat
                </>
              )}
            </CardTitle>
            <CardDescription>
              {isDraw
                ? "Great battle! You're evenly matched."
                : playerWon
                  ? "Congratulations! You won the battle!"
                  : "Good effort! Better luck next time."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Final Scores */}
            <div className="grid grid-cols-2 gap-6">
              <div
                className={`text-center p-4 rounded-lg ${playerWon ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"} border`}
              >
                <Avatar className="h-16 w-16 mx-auto mb-2">
                  <AvatarImage src={playerStats.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{playerStats.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="font-medium mb-2">{playerStats.username}</div>
                <div className="text-3xl font-bold mb-1">{playerStats.score}</div>
                <div className="text-sm text-muted-foreground">
                  {playerStats.accuracy}% accuracy • {playerStats.streak} streak
                </div>
              </div>

              <div
                className={`text-center p-4 rounded-lg ${!playerWon && !isDraw ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"} border`}
              >
                <Avatar className="h-16 w-16 mx-auto mb-2">
                  <AvatarImage src={opponentStats.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{opponentStats.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="font-medium mb-2">{opponentStats.username}</div>
                <div className="text-3xl font-bold mb-1">{opponentStats.score}</div>
                <div className="text-sm text-muted-foreground">
                  {opponentStats.accuracy}% accuracy • {opponentStats.streak} streak
                </div>
              </div>
            </div>

            {/* Battle Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{questions.length}</div>
                <div className="text-sm text-muted-foreground">Questions</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{playerStats.answeredQuestions}</div>
                <div className="text-sm text-muted-foreground">Answered</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {Math.round((playerStats.score / (questions.length * 30)) * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">Performance</div>
              </div>
            </div>

            <Button
              className="w-full"
              onClick={() => onBattleEnd(playerWon ? "win" : isDraw ? "draw" : "lose", playerStats.score)}
            >
              Return to Groups
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Battle Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={playerStats.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{playerStats.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{playerStats.username}</div>
                  <div className="text-sm text-muted-foreground">Score: {playerStats.score}</div>
                </div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">VS</div>
                <div className="text-sm text-muted-foreground">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="font-medium">{opponentStats.username}</div>
                  <div className="text-sm text-muted-foreground">Score: {opponentStats.score}</div>
                </div>
                <Avatar className="h-12 w-12">
                  <AvatarImage src={opponentStats.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{opponentStats.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
            </div>

            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        {/* Question Card */}
        <Card className="min-h-[400px]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{currentQuestion.topic}</Badge>
                <Badge
                  variant={
                    currentQuestion.difficulty === "Easy"
                      ? "default"
                      : currentQuestion.difficulty === "Medium"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {currentQuestion.difficulty}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className={`font-bold ${timeLeft <= 5 ? "text-red-600" : "text-muted-foreground"}`}>
                  {timeLeft}s
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-xl font-semibold mb-6 p-6 bg-muted/30 rounded-lg border-2 border-dashed">
                {currentQuestion.question}
              </div>
            </div>

            <div className="grid gap-3">
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  variant={
                    showResult
                      ? index === currentQuestion.correctAnswer
                        ? "default"
                        : index === selectedAnswer
                          ? "destructive"
                          : "outline"
                      : selectedAnswer === index
                        ? "default"
                        : "outline"
                  }
                  className={`p-4 h-auto text-left justify-start ${
                    showResult && index === currentQuestion.correctAnswer
                      ? "bg-green-600 hover:bg-green-700"
                      : showResult && index === selectedAnswer && index !== currentQuestion.correctAnswer
                        ? "bg-red-600 hover:bg-red-700"
                        : ""
                  }`}
                  onClick={() => !showResult && handleAnswer(index)}
                  disabled={showResult}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-sm font-bold">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span>{option}</span>
                    {showResult && index === currentQuestion.correctAnswer && (
                      <CheckCircle className="h-4 w-4 ml-auto" />
                    )}
                    {showResult && index === selectedAnswer && index !== currentQuestion.correctAnswer && (
                      <XCircle className="h-4 w-4 ml-auto" />
                    )}
                  </div>
                </Button>
              ))}
            </div>

            {showResult && (
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="font-medium mb-2">
                  {selectedAnswer === currentQuestion.correctAnswer ? (
                    <span className="text-green-600">
                      Correct! +{getQuestionPoints(currentQuestion.difficulty)} points
                    </span>
                  ) : selectedAnswer === null ? (
                    <span className="text-yellow-600">Time's up!</span>
                  ) : (
                    <span className="text-red-600">Incorrect!</span>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {currentQuestionIndex < questions.length - 1 ? "Next question in 2 seconds..." : "Battle complete!"}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Live Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-2">
                <Fire className="h-4 w-4 text-orange-600" />
                <span className="font-medium">Your Stats</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-lg font-bold">{playerStats.streak}</div>
                  <div className="text-xs text-muted-foreground">Streak</div>
                </div>
                <div>
                  <div className="text-lg font-bold">{playerStats.accuracy}%</div>
                  <div className="text-xs text-muted-foreground">Accuracy</div>
                </div>
                <div>
                  <div className="text-lg font-bold">{playerStats.score}</div>
                  <div className="text-xs text-muted-foreground">Score</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Opponent Stats</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-lg font-bold">{opponentStats.streak}</div>
                  <div className="text-xs text-muted-foreground">Streak</div>
                </div>
                <div>
                  <div className="text-lg font-bold">{opponentStats.accuracy}%</div>
                  <div className="text-xs text-muted-foreground">Accuracy</div>
                </div>
                <div>
                  <div className="text-lg font-bold">{opponentStats.score}</div>
                  <div className="text-xs text-muted-foreground">Score</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
