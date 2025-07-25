"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Trophy, Star, Target, CheckCircle, Clock, Brain, TrendingUp } from "lucide-react"

interface MasteryLevel {
  topic: string
  subtopic: string
  currentLevel: "Beginner" | "Intermediate" | "Advanced" | "Expert"
  progress: number
  nextMilestone: string
  timeToMastery: string
  strengthAreas: string[]
  improvementAreas: string[]
  masteryScore: number
  consistency: number
}

interface MasteryTrackerProps {
  masteryData: MasteryLevel[]
}

export function MasteryTracker({ masteryData }: MasteryTrackerProps) {
  const [selectedTopic, setSelectedTopic] = useState<MasteryLevel | null>(null)

  const getMasteryColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "text-red-600"
      case "Intermediate":
        return "text-yellow-600"
      case "Advanced":
        return "text-blue-600"
      case "Expert":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  const getMasteryBadge = (level: string) => {
    switch (level) {
      case "Beginner":
        return "destructive"
      case "Intermediate":
        return "secondary"
      case "Advanced":
        return "default"
      case "Expert":
        return "default"
      default:
        return "outline"
    }
  }

  const getMasteryIcon = (level: string) => {
    switch (level) {
      case "Beginner":
        return <Target className="h-4 w-4" />
      case "Intermediate":
        return <Brain className="h-4 w-4" />
      case "Advanced":
        return <Star className="h-4 w-4" />
      case "Expert":
        return <Trophy className="h-4 w-4" />
      default:
        return <CheckCircle className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Mastery Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            Mastery Tracker
          </CardTitle>
          <CardDescription>Track your journey from beginner to expert in each topic</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {["Beginner", "Intermediate", "Advanced", "Expert"].map((level) => {
              const count = masteryData.filter((m) => m.currentLevel === level).length
              return (
                <div key={level} className="text-center p-4 border rounded-lg">
                  <div className={`text-2xl font-bold ${getMasteryColor(level)}`}>{count}</div>
                  <div className="text-sm text-muted-foreground">{level} Topics</div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Mastery Progress Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {masteryData.map((mastery, index) => (
          <Card
            key={index}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedTopic(mastery)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getMasteryIcon(mastery.currentLevel)}
                  <Badge variant={getMasteryBadge(mastery.currentLevel)}>{mastery.currentLevel}</Badge>
                </div>
                <div className={`text-2xl font-bold ${getMasteryColor(mastery.currentLevel)}`}>
                  {mastery.masteryScore}%
                </div>
              </div>
              <CardTitle className="text-lg">{mastery.subtopic}</CardTitle>
              <CardDescription>{mastery.topic}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress to Next Level */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress to Next Level</span>
                  <span>{mastery.progress}%</span>
                </div>
                <Progress value={mastery.progress} className="h-2" />
                <div className="text-xs text-muted-foreground">Next: {mastery.nextMilestone}</div>
              </div>

              {/* Time to Mastery */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>Time to mastery:</span>
                </div>
                <span className="font-medium">{mastery.timeToMastery}</span>
              </div>

              {/* Consistency Score */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Consistency</span>
                  <span>{mastery.consistency}%</span>
                </div>
                <Progress value={mastery.consistency} className="h-1" />
              </div>

              {/* Strength Areas */}
              {mastery.strengthAreas.length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-1 text-green-600">Strengths:</div>
                  <div className="flex flex-wrap gap-1">
                    {mastery.strengthAreas.slice(0, 2).map((area) => (
                      <Badge key={area} variant="outline" className="text-xs text-green-600">
                        ✓ {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Improvement Areas */}
              {mastery.improvementAreas.length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-1 text-orange-600">Focus on:</div>
                  <div className="flex flex-wrap gap-1">
                    {mastery.improvementAreas.slice(0, 2).map((area) => (
                      <Badge key={area} variant="outline" className="text-xs text-orange-600">
                        → {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed View Modal */}
      {selectedTopic && (
        <Card className="fixed inset-4 z-50 overflow-auto bg-background border shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {getMasteryIcon(selectedTopic.currentLevel)}
                  {selectedTopic.subtopic} - {selectedTopic.currentLevel}
                </CardTitle>
                <CardDescription>{selectedTopic.topic}</CardDescription>
              </div>
              <Button variant="outline" onClick={() => setSelectedTopic(null)}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Detailed Progress */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{selectedTopic.masteryScore}%</div>
                <div className="text-sm text-muted-foreground">Mastery Score</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">{selectedTopic.consistency}%</div>
                <div className="text-sm text-muted-foreground">Consistency</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{selectedTopic.progress}%</div>
                <div className="text-sm text-muted-foreground">Next Level Progress</div>
              </div>
            </div>

            {/* Strength and Improvement Areas */}
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-semibold text-green-600 mb-3">Strength Areas</h3>
                <div className="space-y-2">
                  {selectedTopic.strengthAreas.map((area, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded dark:bg-green-950">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{area}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-orange-600 mb-3">Areas for Improvement</h3>
                <div className="space-y-2">
                  {selectedTopic.improvementAreas.map((area, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-orange-50 rounded dark:bg-orange-950">
                      <TrendingUp className="h-4 w-4 text-orange-600" />
                      <span className="text-sm">{area}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button className="flex-1 bg-orange-600 hover:bg-orange-700">
                <Target className="mr-2 h-4 w-4" />
                Focus Training
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent">
                <Brain className="mr-2 h-4 w-4" />
                Practice Problems
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
