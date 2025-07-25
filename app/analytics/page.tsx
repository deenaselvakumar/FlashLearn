"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Target, Clock, Brain, BookOpen } from "lucide-react"
import { AppLayout } from "@/components/app-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MasteryTracker } from "@/components/mastery-tracker"
import { AdaptiveDifficulty } from "@/components/adaptive-difficulty"

// Mock data for analytics
const topicPerformance = [
  { topic: "Calculus", mastery: 85, trend: "up", sessions: 12, timeSpent: "4.2h" },
  { topic: "Physics", mastery: 45, trend: "down", sessions: 8, timeSpent: "2.8h" },
  { topic: "Chemistry", mastery: 72, trend: "up", sessions: 15, timeSpent: "5.1h" },
  { topic: "Biology", mastery: 91, trend: "up", sessions: 20, timeSpent: "6.7h" },
  { topic: "Statistics", mastery: 38, trend: "down", sessions: 5, timeSpent: "1.9h" },
]

const weeklyProgress = [
  { day: "Mon", studied: 45, accuracy: 78 },
  { day: "Tue", studied: 32, accuracy: 82 },
  { day: "Wed", studied: 58, accuracy: 75 },
  { day: "Thu", studied: 41, accuracy: 88 },
  { day: "Fri", studied: 67, accuracy: 91 },
  { day: "Sat", studied: 23, accuracy: 85 },
  { day: "Sun", studied: 39, accuracy: 79 },
]

const knowledgeGaps = [
  { topic: "Derivatives", subtopic: "Chain Rule", difficulty: "High", cards: 8 },
  { topic: "Physics", subtopic: "Electromagnetic Induction", difficulty: "Medium", cards: 12 },
  { topic: "Statistics", subtopic: "Hypothesis Testing", difficulty: "High", cards: 15 },
  { topic: "Chemistry", subtopic: "Organic Reactions", difficulty: "Medium", cards: 6 },
]

const mockMasteryData = [
  {
    topic: "Mathematics",
    subtopic: "Calculus Derivatives",
    currentLevel: "Advanced" as const,
    progress: 75,
    nextMilestone: "Expert Level",
    timeToMastery: "2 weeks",
    strengthAreas: ["Basic Derivatives", "Power Rule", "Product Rule"],
    improvementAreas: ["Chain Rule", "Implicit Differentiation"],
    masteryScore: 85,
    consistency: 88,
  },
  {
    topic: "Physics",
    subtopic: "Newton's Laws",
    currentLevel: "Intermediate" as const,
    progress: 45,
    nextMilestone: "Advanced Level",
    timeToMastery: "3 weeks",
    strengthAreas: ["First Law", "Basic Applications"],
    improvementAreas: ["Second Law Calculations", "Complex Systems"],
    masteryScore: 58,
    consistency: 65,
  },
  {
    topic: "Chemistry",
    subtopic: "Chemical Bonding",
    currentLevel: "Expert" as const,
    progress: 95,
    nextMilestone: "Mastery Complete",
    timeToMastery: "Achieved",
    strengthAreas: ["Ionic Bonds", "Covalent Bonds", "Molecular Geometry"],
    improvementAreas: ["Advanced Hybridization"],
    masteryScore: 92,
    consistency: 94,
  },
]

const mockUserPerformance = {
  topic: "Current Session",
  recentAccuracy: 75,
  streak: 4,
  averageTime: 85,
  confidenceLevel: 78,
}

// Simple radar chart component
function RadarChart({ data }: { data: Array<{ topic: string; mastery: number }> }) {
  const size = 200
  const center = size / 2
  const radius = 70
  const angleStep = (2 * Math.PI) / data.length

  const points = data.map((item, index) => {
    const angle = index * angleStep - Math.PI / 2
    const value = (item.mastery / 100) * radius
    const x = center + Math.cos(angle) * value
    const y = center + Math.sin(angle) * value
    return { x, y, angle, value: item.mastery, topic: item.topic }
  })

  const pathData = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ") + " Z"

  return (
    <div className="flex items-center justify-center">
      <svg width={size} height={size} className="overflow-visible">
        {/* Grid circles */}
        {[20, 40, 60, 80, 100].map((percent) => (
          <circle
            key={percent}
            cx={center}
            cy={center}
            r={(percent / 100) * radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-muted-foreground/20"
          />
        ))}

        {/* Grid lines */}
        {data.map((_, index) => {
          const angle = index * angleStep - Math.PI / 2
          const x2 = center + Math.cos(angle) * radius
          const y2 = center + Math.sin(angle) * radius
          return (
            <line
              key={index}
              x1={center}
              y1={center}
              x2={x2}
              y2={y2}
              stroke="currentColor"
              strokeWidth="1"
              className="text-muted-foreground/20"
            />
          )
        })}

        {/* Data area */}
        <path d={pathData} fill="hsl(var(--primary))" fillOpacity="0.2" stroke="hsl(var(--primary))" strokeWidth="2" />

        {/* Data points */}
        {points.map((point, index) => (
          <circle key={index} cx={point.x} cy={point.y} r="4" fill="hsl(var(--primary))" />
        ))}

        {/* Labels */}
        {data.map((item, index) => {
          const angle = index * angleStep - Math.PI / 2
          const labelRadius = radius + 20
          const x = center + Math.cos(angle) * labelRadius
          const y = center + Math.sin(angle) * labelRadius
          return (
            <text
              key={index}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs font-medium fill-current"
            >
              {item.topic}
            </text>
          )
        })}
      </svg>
    </div>
  )
}

export default function AnalyticsPage() {
  const overallAccuracy = 82
  const totalStudyTime = "21.7h"
  const cardsStudied = 342
  const currentStreak = 12

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Learning Analytics</h1>
          <p className="text-muted-foreground">Detailed insights into your learning progress and performance</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sessions">Session History</TabsTrigger>
            <TabsTrigger value="topics">Topic Analysis</TabsTrigger>
            <TabsTrigger value="mastery">Mastery Tracker</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            {/* Overview Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Overall Accuracy</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{overallAccuracy}%</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="inline h-3 w-3 mr-1" />
                    +5% from last week
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Study Time</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalStudyTime}</div>
                  <p className="text-xs text-muted-foreground">This week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cards Studied</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{cardsStudied}</div>
                  <p className="text-xs text-muted-foreground">Total this month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{currentStreak} days</div>
                  <p className="text-xs text-muted-foreground">Personal best!</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Knowledge Map */}
              <Card>
                <CardHeader>
                  <CardTitle>Knowledge Map</CardTitle>
                  <CardDescription>Visual representation of your topic mastery</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadarChart data={topicPerformance} />
                </CardContent>
              </Card>

              {/* Weekly Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Progress</CardTitle>
                  <CardDescription>Cards studied and accuracy over the past week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {weeklyProgress.map((day) => (
                      <div key={day.day} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-8 text-sm font-medium">{day.day}</span>
                          <div className="flex-1 space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{day.studied} cards</span>
                              <span>{day.accuracy}% accuracy</span>
                            </div>
                            <Progress value={day.accuracy} className="h-2" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sessions">
            <div>Session History</div>
          </TabsContent>

          <TabsContent value="topics" className="space-y-4">
            {/* Topic Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Topic Performance</CardTitle>
                <CardDescription>Detailed breakdown of your performance by subject</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topicPerformance.map((topic) => (
                    <div key={topic.topic} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="space-y-1">
                          <div className="font-medium">{topic.topic}</div>
                          <div className="text-sm text-muted-foreground">
                            {topic.sessions} sessions • {topic.timeSpent}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-medium">{topic.mastery}%</div>
                          <div className="text-sm text-muted-foreground">mastery</div>
                        </div>
                        <div className="flex items-center gap-2">
                          {topic.trend === "up" ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                          <Badge variant={topic.mastery >= 70 ? "default" : "destructive"}>
                            {topic.mastery >= 70 ? "Strong" : "Needs Work"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mastery" className="space-y-4">
            <MasteryTracker masteryData={mockMasteryData} />
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <AdaptiveDifficulty
              userPerformance={mockUserPerformance}
              onDifficultyAdjust={(difficulty) => console.log("Adjusting difficulty to:", difficulty)}
            />
            <div className="grid gap-6 md:grid-cols-2">
              {/* Knowledge Gaps */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Knowledge Gaps
                  </CardTitle>
                  <CardDescription>Areas that need more attention based on your performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {knowledgeGaps.map((gap, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
                      >
                        <div className="space-y-1">
                          <div className="font-medium">
                            {gap.topic}: {gap.subtopic}
                          </div>
                          <div className="text-sm text-muted-foreground">{gap.cards} cards need review</div>
                        </div>
                        <Badge variant={gap.difficulty === "High" ? "destructive" : "secondary"}>
                          {gap.difficulty} Priority
                        </Badge>
                      </div>
                    ))}
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
