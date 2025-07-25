"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Play, Clock, Target, CheckCircle, XCircle, BarChart3, Calendar, Trophy } from "lucide-react"
import { AppLayout } from "@/components/app-layout"

const assessments = [
  {
    id: 1,
    title: "Calculus Fundamentals",
    description: "Test your understanding of basic calculus concepts",
    questions: 20,
    duration: "30 min",
    difficulty: "Medium",
    topics: ["Derivatives", "Integrals", "Limits"],
    lastScore: 85,
    attempts: 3,
    status: "completed",
  },
  {
    id: 2,
    title: "Physics Mechanics",
    description: "Assessment covering Newton's laws and motion",
    questions: 15,
    duration: "25 min",
    difficulty: "Hard",
    topics: ["Forces", "Motion", "Energy"],
    lastScore: null,
    attempts: 0,
    status: "available",
  },
  {
    id: 3,
    title: "Chemistry Basics",
    description: "Fundamental chemistry concepts and formulas",
    questions: 25,
    duration: "40 min",
    difficulty: "Easy",
    topics: ["Atomic Structure", "Bonding", "Reactions"],
    lastScore: 92,
    attempts: 2,
    status: "completed",
  },
  {
    id: 4,
    title: "Statistics & Probability",
    description: "Test your statistical analysis skills",
    questions: 18,
    duration: "35 min",
    difficulty: "Medium",
    topics: ["Distributions", "Hypothesis Testing", "Regression"],
    lastScore: null,
    attempts: 0,
    status: "locked",
  },
]

const recentResults = [
  {
    assessment: "Calculus Fundamentals",
    score: 85,
    date: "2024-01-20",
    time: "28 min",
    correct: 17,
    total: 20,
  },
  {
    assessment: "Chemistry Basics",
    score: 92,
    date: "2024-01-18",
    time: "35 min",
    correct: 23,
    total: 25,
  },
  {
    assessment: "Biology Concepts",
    score: 78,
    date: "2024-01-15",
    time: "42 min",
    correct: 14,
    total: 18,
  },
]

export default function AssessmentsPage() {
  const [selectedAssessment, setSelectedAssessment] = useState<number | null>(null)

  const startAssessment = (id: number) => {
    // In a real app, this would navigate to the assessment
    console.log(`Starting assessment ${id}`)
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assessments</h1>
          <p className="text-muted-foreground">Test your knowledge and identify areas for improvement</p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Assessments completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <Target className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">84%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+3%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Time</CardTitle>
              <Clock className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8.5h</div>
              <p className="text-xs text-muted-foreground">Total assessment time</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Available Assessments */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold">Available Assessments</h2>

            {assessments.map((assessment) => (
              <Card
                key={assessment.id}
                className={`transition-all ${selectedAssessment === assessment.id ? "ring-2 ring-primary" : ""}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{assessment.title}</CardTitle>
                      <CardDescription>{assessment.description}</CardDescription>
                    </div>
                    <Badge
                      variant={
                        assessment.status === "completed"
                          ? "default"
                          : assessment.status === "available"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {assessment.status === "completed"
                        ? "Completed"
                        : assessment.status === "available"
                          ? "Available"
                          : "Locked"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      {assessment.questions} questions
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {assessment.duration}
                    </div>
                    <Badge variant="outline" size="sm">
                      {assessment.difficulty}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Topics covered:</div>
                    <div className="flex flex-wrap gap-1">
                      {assessment.topics.map((topic) => (
                        <Badge key={topic} variant="secondary" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {assessment.lastScore && (
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="text-sm">
                        <div className="font-medium">Last Score: {assessment.lastScore}%</div>
                        <div className="text-muted-foreground">
                          {assessment.attempts} attempt{assessment.attempts !== 1 ? "s" : ""}
                        </div>
                      </div>
                      <div className="text-right">
                        <Progress value={assessment.lastScore} className="w-20 h-2" />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      onClick={() => startAssessment(assessment.id)}
                      disabled={assessment.status === "locked"}
                      className="flex-1"
                    >
                      <Play className="mr-2 h-4 w-4" />
                      {assessment.status === "completed" ? "Retake" : "Start"} Assessment
                    </Button>
                    {assessment.lastScore && (
                      <Button variant="outline">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        View Results
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Results */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Recent Results</h2>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Performance Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentResults.map((result, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-sm">{result.assessment}</div>
                      <Badge
                        variant={result.score >= 80 ? "default" : result.score >= 60 ? "secondary" : "destructive"}
                      >
                        {result.score}%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {result.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {result.time}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span>
                        {result.correct}/{result.total} correct
                      </span>
                      <div className="flex items-center gap-1">
                        {result.score >= 80 ? (
                          <CheckCircle className="h-3 w-3 text-green-600" />
                        ) : (
                          <XCircle className="h-3 w-3 text-red-600" />
                        )}
                      </div>
                    </div>
                    <Progress value={result.score} className="h-1" />
                    {index < recentResults.length - 1 && <div className="border-b" />}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-950 dark:border-blue-800">
                  <div className="font-medium text-sm">Focus on Physics</div>
                  <div className="text-xs text-muted-foreground">
                    Your mechanics score suggests reviewing force concepts
                  </div>
                </div>
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg dark:bg-green-950 dark:border-green-800">
                  <div className="font-medium text-sm">Great Chemistry Progress!</div>
                  <div className="text-xs text-muted-foreground">You're ready for advanced chemistry topics</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
