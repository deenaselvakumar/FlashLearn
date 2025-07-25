"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Brain, Zap } from "lucide-react"

interface AdaptiveDifficultyProps {
  userPerformance: {
    topic: string
    recentAccuracy: number
    streak: number
    averageTime: number
    confidenceLevel: number
  }
  onDifficultyAdjust: (newDifficulty: string) => void
}

export function AdaptiveDifficulty({ userPerformance, onDifficultyAdjust }: AdaptiveDifficultyProps) {
  const [recommendedDifficulty, setRecommendedDifficulty] = useState<string>("Medium")
  const [adaptationReason, setAdaptationReason] = useState<string>("")

  useEffect(() => {
    // AI-driven difficulty adaptation logic
    const { recentAccuracy, streak, averageTime, confidenceLevel } = userPerformance

    let newDifficulty = "Medium"
    let reason = ""

    if (recentAccuracy >= 85 && streak >= 5 && confidenceLevel >= 80) {
      newDifficulty = "Hard"
      reason = "Excellent performance! Ready for advanced challenges."
    } else if (recentAccuracy >= 70 && streak >= 3) {
      newDifficulty = "Medium-Hard"
      reason = "Good progress! Gradually increasing difficulty."
    } else if (recentAccuracy < 50 || streak < 2) {
      newDifficulty = "Easy"
      reason = "Building foundation with easier questions."
    } else if (averageTime > 120) {
      // More than 2 minutes per question
      newDifficulty = "Easy-Medium"
      reason = "Taking time to think - let's reinforce concepts."
    }

    setRecommendedDifficulty(newDifficulty)
    setAdaptationReason(reason)
  }, [userPerformance])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-600"
      case "Easy-Medium":
        return "text-blue-600"
      case "Medium":
        return "text-yellow-600"
      case "Medium-Hard":
        return "text-orange-600"
      case "Hard":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "default"
      case "Easy-Medium":
        return "secondary"
      case "Medium":
        return "outline"
      case "Medium-Hard":
        return "secondary"
      case "Hard":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-orange-600" />
          Adaptive Difficulty Recommendation
        </CardTitle>
        <CardDescription>AI-powered difficulty adjustment based on your performance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Performance Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-white rounded-lg dark:bg-gray-800">
            <div className="text-lg font-bold">{userPerformance.recentAccuracy}%</div>
            <div className="text-xs text-muted-foreground">Accuracy</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg dark:bg-gray-800">
            <div className="text-lg font-bold">{userPerformance.streak}</div>
            <div className="text-xs text-muted-foreground">Streak</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg dark:bg-gray-800">
            <div className="text-lg font-bold">{userPerformance.averageTime}s</div>
            <div className="text-xs text-muted-foreground">Avg Time</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg dark:bg-gray-800">
            <div className="text-lg font-bold">{userPerformance.confidenceLevel}%</div>
            <div className="text-xs text-muted-foreground">Confidence</div>
          </div>
        </div>

        {/* Difficulty Recommendation */}
        <div className="flex items-center justify-between p-4 bg-white rounded-lg dark:bg-gray-800">
          <div className="space-y-1">
            <div className="font-medium">Recommended Difficulty</div>
            <div className="text-sm text-muted-foreground">{adaptationReason}</div>
          </div>
          <div className="text-right">
            <Badge
              variant={getDifficultyBadge(recommendedDifficulty)}
              className={`text-lg px-3 py-1 ${getDifficultyColor(recommendedDifficulty)}`}
            >
              {recommendedDifficulty}
            </Badge>
          </div>
        </div>

        {/* Confidence Level */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Confidence Level</span>
            <span>{userPerformance.confidenceLevel}%</span>
          </div>
          <Progress value={userPerformance.confidenceLevel} className="h-2" />
        </div>

        {/* Action Button */}
        <Button
          onClick={() => onDifficultyAdjust(recommendedDifficulty)}
          className="w-full bg-orange-600 hover:bg-orange-700"
        >
          <Zap className="mr-2 h-4 w-4" />
          Apply Recommended Difficulty
        </Button>
      </CardContent>
    </Card>
  )
}
