"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Target, TrendingUp, TrendingDown, Brain, BookOpen, Eye, Filter, Download } from "lucide-react"
import { AppLayout } from "@/components/app-layout"
import { LearningChart } from "@/components/learning-chart"
import { SessionDetails } from "@/components/session-details"
import Link from "next/link"

interface StudySession {
  id: string
  date: string
  fileName: string
  topic: string
  duration: number // in seconds
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

const mockSessions: StudySession[] = [
  {
    id: "session-1",
    date: "2024-01-22",
    fileName: "Calculus Fundamentals.pptx",
    topic: "Mathematics",
    duration: 1245, // 20m 45s
    cardsStudied: 15,
    correctAnswers: 12,
    incorrectAnswers: 2,
    reviewAnswers: 1,
    accuracy: 80,
    averageTimePerCard: 83,
    topicsStudied: ["Derivatives", "Limits", "Applications"],
    weakAreas: ["Chain Rule", "Related Rates"],
    strongAreas: ["Basic Derivatives", "Power Rule"],
    improvementAreas: [
      { topic: "Derivatives", previousScore: 75, currentScore: 85, trend: "up" },
      { topic: "Limits", previousScore: 90, currentScore: 88, trend: "down" },
    ],
  },
  {
    id: "session-2",
    date: "2024-01-21",
    fileName: "Physics Mechanics.pptx",
    topic: "Physics",
    duration: 892, // 14m 52s
    cardsStudied: 12,
    correctAnswers: 7,
    incorrectAnswers: 4,
    reviewAnswers: 1,
    accuracy: 58,
    averageTimePerCard: 74,
    topicsStudied: ["Forces", "Motion", "Energy"],
    weakAreas: ["Newton's Second Law", "Force Calculations"],
    strongAreas: ["Basic Motion", "Velocity"],
    improvementAreas: [
      { topic: "Forces", previousScore: 45, currentScore: 58, trend: "up" },
      { topic: "Motion", previousScore: 70, currentScore: 65, trend: "down" },
    ],
  },
  {
    id: "session-3",
    date: "2024-01-20",
    fileName: "Chemistry Basics.pptx",
    topic: "Chemistry",
    duration: 1567, // 26m 7s
    cardsStudied: 20,
    correctAnswers: 18,
    incorrectAnswers: 1,
    reviewAnswers: 1,
    accuracy: 90,
    averageTimePerCard: 78,
    topicsStudied: ["Atomic Structure", "Bonding", "Reactions"],
    weakAreas: ["Ionic Bonding"],
    strongAreas: ["Atomic Structure", "Covalent Bonding", "Basic Reactions"],
    improvementAreas: [
      { topic: "Bonding", previousScore: 85, currentScore: 92, trend: "up" },
      { topic: "Reactions", previousScore: 88, currentScore: 90, trend: "up" },
    ],
  },
  {
    id: "session-4",
    date: "2024-01-19",
    fileName: "Biology Concepts.pptx",
    topic: "Biology",
    duration: 1023, // 17m 3s
    cardsStudied: 14,
    correctAnswers: 11,
    incorrectAnswers: 2,
    reviewAnswers: 1,
    accuracy: 79,
    averageTimePerCard: 73,
    topicsStudied: ["Cell Structure", "Photosynthesis", "Respiration"],
    weakAreas: ["Cellular Respiration"],
    strongAreas: ["Cell Structure", "Photosynthesis"],
    improvementAreas: [
      { topic: "Cell Structure", previousScore: 80, currentScore: 85, trend: "up" },
      { topic: "Photosynthesis", previousScore: 75, currentScore: 82, trend: "up" },
    ],
  },
  {
    id: "session-5",
    date: "2024-01-18",
    fileName: "Statistics Intro.pptx",
    topic: "Mathematics",
    duration: 756, // 12m 36s
    cardsStudied: 10,
    correctAnswers: 6,
    incorrectAnswers: 3,
    reviewAnswers: 1,
    accuracy: 60,
    averageTimePerCard: 76,
    topicsStudied: ["Distributions", "Mean", "Standard Deviation"],
    weakAreas: ["Standard Deviation", "Normal Distribution"],
    strongAreas: ["Mean", "Median"],
    improvementAreas: [{ topic: "Distributions", previousScore: 55, currentScore: 60, trend: "up" }],
  },
]

export default function HistoryPage() {
  const [selectedSession, setSelectedSession] = useState<StudySession | null>(null)
  const [timeFilter, setTimeFilter] = useState<"week" | "month" | "all">("month")

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const getOverallStats = () => {
    const totalSessions = mockSessions.length
    const totalCards = mockSessions.reduce((sum, session) => sum + session.cardsStudied, 0)
    const totalCorrect = mockSessions.reduce((sum, session) => sum + session.correctAnswers, 0)
    const totalTime = mockSessions.reduce((sum, session) => sum + session.duration, 0)
    const averageAccuracy = Math.round(mockSessions.reduce((sum, session) => sum + session.accuracy, 0) / totalSessions)

    return {
      totalSessions,
      totalCards,
      totalCorrect,
      totalTime,
      averageAccuracy,
    }
  }

  const getTopicPerformance = () => {
    const topicStats: Record<string, { sessions: number; accuracy: number; totalCards: number }> = {}

    mockSessions.forEach((session) => {
      if (!topicStats[session.topic]) {
        topicStats[session.topic] = { sessions: 0, accuracy: 0, totalCards: 0 }
      }
      topicStats[session.topic].sessions++
      topicStats[session.topic].accuracy += session.accuracy
      topicStats[session.topic].totalCards += session.cardsStudied
    })

    return Object.entries(topicStats).map(([topic, stats]) => ({
      topic,
      sessions: stats.sessions,
      averageAccuracy: Math.round(stats.accuracy / stats.sessions),
      totalCards: stats.totalCards,
    }))
  }

  const getWeakAreas = () => {
    const weakAreas: Record<string, number> = {}
    mockSessions.forEach((session) => {
      session.weakAreas.forEach((area) => {
        weakAreas[area] = (weakAreas[area] || 0) + 1
      })
    })

    return Object.entries(weakAreas)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([area, count]) => ({ area, count }))
  }

  const stats = getOverallStats()
  const topicPerformance = getTopicPerformance()
  const weakAreas = getWeakAreas()

  if (selectedSession) {
    return (
      <AppLayout>
        <SessionDetails session={selectedSession} onBack={() => setSelectedSession(null)} />
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Learning History</h1>
            <p className="text-muted-foreground">Track your progress and analyze your learning patterns</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSessions}</div>
              <p className="text-xs text-muted-foreground">Study sessions completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cards Studied</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCards}</div>
              <p className="text-xs text-muted-foreground">{stats.totalCorrect} answered correctly</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatDuration(stats.totalTime)}</div>
              <p className="text-xs text-muted-foreground">Total learning time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Accuracy</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageAccuracy}%</div>
              <p className="text-xs text-muted-foreground">Overall performance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Improvement</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">+12%</div>
              <p className="text-xs text-muted-foreground">From last month</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sessions">Session History</TabsTrigger>
            <TabsTrigger value="topics">Topic Analysis</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Learning Progress Chart */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Learning Progress</CardTitle>
                  <CardDescription>Your accuracy and study time over the past month</CardDescription>
                </CardHeader>
                <CardContent>
                  <LearningChart sessions={mockSessions} />
                </CardContent>
              </Card>

              {/* Topic Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Topic Performance</CardTitle>
                  <CardDescription>Your performance across different subjects</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {topicPerformance.map((topic) => (
                    <div key={topic.topic} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{topic.topic}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{topic.sessions} sessions</span>
                          <Badge
                            variant={
                              topic.averageAccuracy >= 80
                                ? "default"
                                : topic.averageAccuracy >= 60
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {topic.averageAccuracy}%
                          </Badge>
                        </div>
                      </div>
                      <Progress value={topic.averageAccuracy} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Areas Needing Attention */}
              <Card>
                <CardHeader>
                  <CardTitle>Areas Needing Attention</CardTitle>
                  <CardDescription>Topics that appear frequently in your weak areas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {weakAreas.map((area, index) => (
                    <div key={area.area} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 text-xs font-bold flex items-center justify-center dark:bg-red-900">
                          {index + 1}
                        </div>
                        <span className="font-medium">{area.area}</span>
                      </div>
                      <Badge variant="destructive">{area.count} sessions</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Study Sessions</CardTitle>
                <CardDescription>Detailed breakdown of your recent learning activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => setSelectedSession(session)}
                    >
                      <div className="space-y-1">
                        <div className="font-medium">{session.fileName}</div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {session.date}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDuration(session.duration)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Brain className="h-3 w-3" />
                            {session.cardsStudied} cards
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-semibold">{session.accuracy}%</div>
                          <div className="text-sm text-muted-foreground">accuracy</div>
                        </div>
                        <Badge
                          variant={
                            session.accuracy >= 80 ? "default" : session.accuracy >= 60 ? "secondary" : "destructive"
                          }
                        >
                          {session.accuracy >= 80 ? "Excellent" : session.accuracy >= 60 ? "Good" : "Needs Work"}
                        </Badge>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="topics" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              {topicPerformance.map((topic) => (
                <Card key={topic.topic}>
                  <CardHeader>
                    <CardTitle>{topic.topic}</CardTitle>
                    <CardDescription>
                      {topic.sessions} study sessions • {topic.totalCards} cards studied
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold mb-2">{topic.averageAccuracy}%</div>
                      <div className="text-sm text-muted-foreground">Average Accuracy</div>
                      <Progress value={topic.averageAccuracy} className="mt-2 h-2" />
                    </div>

                    {/* Topic-specific insights */}
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Recent Performance</div>
                      {mockSessions
                        .filter((session) => session.topic === topic.topic)
                        .slice(0, 3)
                        .map((session) => (
                          <div key={session.id} className="flex items-center justify-between text-sm">
                            <span>{session.date}</span>
                            <div className="flex items-center gap-2">
                              <span>{session.accuracy}%</span>
                              {session.improvementAreas.length > 0 && (
                                <div className="flex items-center gap-1">
                                  {session.improvementAreas[0].trend === "up" ? (
                                    <TrendingUp className="h-3 w-3 text-green-600" />
                                  ) : session.improvementAreas[0].trend === "down" ? (
                                    <TrendingDown className="h-3 w-3 text-red-600" />
                                  ) : null}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Patterns</CardTitle>
                  <CardDescription>Insights about your study habits</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-950 dark:border-blue-800">
                    <div className="font-medium text-blue-900 dark:text-blue-100">Best Performance Time</div>
                    <div className="text-sm text-blue-700 dark:text-blue-300">
                      You perform 15% better in afternoon sessions (2-4 PM)
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg dark:bg-green-950 dark:border-green-800">
                    <div className="font-medium text-green-900 dark:text-green-100">Optimal Session Length</div>
                    <div className="text-sm text-green-700 dark:text-green-300">
                      Your accuracy is highest in 15-20 minute sessions
                    </div>
                  </div>
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg dark:bg-yellow-950 dark:border-yellow-800">
                    <div className="font-medium text-yellow-900 dark:text-yellow-100">Improvement Trend</div>
                    <div className="text-sm text-yellow-700 dark:text-yellow-300">
                      Your overall accuracy has improved by 12% this month
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                  <CardDescription>Personalized suggestions to improve your learning</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="font-medium">Focus on Physics</div>
                    <div className="text-sm text-muted-foreground">
                      Your Physics accuracy (58%) is below your average. Consider reviewing Newton's Laws.
                    </div>
                    <Button size="sm" className="mt-2 bg-orange-600 hover:bg-orange-700">
                      Study Physics
                    </Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="font-medium">Review Chain Rule</div>
                    <div className="text-sm text-muted-foreground">
                      This topic appears in your weak areas across multiple sessions.
                    </div>
                    <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                      Practice Chain Rule
                    </Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="font-medium">Maintain Chemistry Momentum</div>
                    <div className="text-sm text-muted-foreground">
                      Great work! Your Chemistry performance (90%) is excellent. Keep it up!
                    </div>
                    <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                      Continue Chemistry
                    </Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="font-medium">Start Weakness Training</div>
                    <div className="text-sm text-muted-foreground">
                      Get personalized training sessions for your weakest topics with progressive difficulty.
                    </div>
                    <Link href="/weakness-training">
                      <Button size="sm" className="mt-2 bg-orange-600 hover:bg-orange-700">
                        Start Training
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
