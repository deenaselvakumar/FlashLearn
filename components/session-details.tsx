"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Calendar,
  Clock,
  Target,
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"

interface StudySession {
  id: string
  date: string
  fileName: string
  topic: string
  duration: number
  cardsStudied: number
  correctAnswers: number
  incorrectAnswers: number
  reviewAnswers: number
  accuracy: number
  averageTimePerCard: number
  topicsStudied: string[]
  weakAreas: string[]
  strongAreas: string[]
  improvementAreas: {
    topic: string
    previousScore: number
    currentScore: number
    trend: "up" | "down" | "stable"
  }[]
}

interface SessionDetailsProps {
  session: StudySession
  onBack: () => void
}

export function SessionDetails({ session, onBack }: SessionDetailsProps) {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to History
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Session Details</h1>
          <p className="text-muted-foreground">{formatDate(session.date)}</p>
        </div>
      </div>

      {/* Session Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            {session.fileName}
          </CardTitle>
          <CardDescription>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {session.date}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatDuration(session.duration)}
              </div>
              <Badge variant="secondary">{session.topic}</Badge>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold">{session.cardsStudied}</div>
              <div className="text-sm text-muted-foreground">Cards Studied</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg dark:bg-green-950">
              <div className="text-2xl font-bold text-green-600">{session.correctAnswers}</div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg dark:bg-red-950">
              <div className="text-2xl font-bold text-red-600">{session.incorrectAnswers}</div>
              <div className="text-sm text-muted-foreground">Incorrect</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg dark:bg-yellow-950">
              <div className="text-2xl font-bold text-yellow-600">{session.reviewAnswers}</div>
              <div className="text-sm text-muted-foreground">Review</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall Accuracy</span>
                <span className="text-2xl font-bold">{session.accuracy}%</span>
              </div>
              <Progress value={session.accuracy} className="h-3" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 border rounded-lg">
                <div className="text-lg font-semibold">{session.averageTimePerCard}s</div>
                <div className="text-xs text-muted-foreground">Avg Time/Card</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="text-lg font-semibold">
                  {Math.round((session.correctAnswers / session.cardsStudied) * 100)}%
                </div>
                <div className="text-xs text-muted-foreground">Success Rate</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Performance Rating</div>
              <Badge
                variant={session.accuracy >= 80 ? "default" : session.accuracy >= 60 ? "secondary" : "destructive"}
                className="text-sm"
              >
                {session.accuracy >= 80 ? "Excellent" : session.accuracy >= 60 ? "Good" : "Needs Improvement"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Topics Studied */}
        <Card>
          <CardHeader>
            <CardTitle>Topics Covered</CardTitle>
            <CardDescription>Areas studied in this session</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium mb-2">Subjects</div>
              <div className="flex flex-wrap gap-2">
                {session.topicsStudied.map((topic) => (
                  <Badge key={topic} variant="outline">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Strong Areas
              </div>
              <div className="space-y-1">
                {session.strongAreas.map((area) => (
                  <div
                    key={area}
                    className="text-sm p-2 bg-green-50 border border-green-200 rounded dark:bg-green-950 dark:border-green-800"
                  >
                    {area}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                Areas for Improvement
              </div>
              <div className="space-y-1">
                {session.weakAreas.map((area) => (
                  <div
                    key={area}
                    className="text-sm p-2 bg-red-50 border border-red-200 rounded dark:bg-red-950 dark:border-red-800"
                  >
                    {area}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Improvement Tracking */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Progress Comparison</CardTitle>
            <CardDescription>How your performance changed compared to previous sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {session.improvementAreas.map((improvement) => (
                <div key={improvement.topic} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        improvement.trend === "up"
                          ? "bg-green-100 dark:bg-green-900"
                          : improvement.trend === "down"
                            ? "bg-red-100 dark:bg-red-900"
                            : "bg-gray-100 dark:bg-gray-900"
                      }`}
                    >
                      {improvement.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : improvement.trend === "down" ? (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      ) : (
                        <Target className="h-4 w-4 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{improvement.topic}</div>
                      <div className="text-sm text-muted-foreground">
                        {improvement.previousScore}% → {improvement.currentScore}%
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`font-semibold ${
                        improvement.trend === "up"
                          ? "text-green-600"
                          : improvement.trend === "down"
                            ? "text-red-600"
                            : "text-gray-600"
                      }`}
                    >
                      {improvement.trend === "up" ? "+" : improvement.trend === "down" ? "" : ""}
                      {improvement.currentScore - improvement.previousScore}%
                    </div>
                    <Badge
                      variant={
                        improvement.trend === "up"
                          ? "default"
                          : improvement.trend === "down"
                            ? "destructive"
                            : "secondary"
                      }
                      className="text-xs"
                    >
                      {improvement.trend === "up" ? "Improved" : improvement.trend === "down" ? "Declined" : "Stable"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 justify-center">
            <Button className="bg-orange-600 hover:bg-orange-700">Study These Topics Again</Button>
            <Button variant="outline">Review Weak Areas</Button>
            <Button variant="outline">Export Session Data</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
