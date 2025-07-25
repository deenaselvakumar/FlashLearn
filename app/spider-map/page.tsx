"use client"

import { AppLayout } from "@/components/app-layout"
import { SpiderChart } from "@/components/spider-chart"

const mockTopicData = [
  { topic: "Calculus", score: 85, color: "#22c55e", sessions: 8, lastStudied: "Jan 20" },
  { topic: "Physics", score: 45, color: "#ef4444", sessions: 5, lastStudied: "Jan 18" },
  { topic: "Chemistry", score: 92, color: "#22c55e", sessions: 12, lastStudied: "Jan 19" },
  { topic: "Biology", score: 78, color: "#eab308", sessions: 6, lastStudied: "Jan 17" },
  { topic: "Statistics", score: 38, color: "#ef4444", sessions: 3, lastStudied: "Jan 16" },
]

export default function SpiderMapPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Knowledge Map</h1>
          <p className="text-muted-foreground">Visualize your learning progress across different topics</p>
        </div>
        <SpiderChart data={mockTopicData} showPercentages />
      </div>
    </AppLayout>
  )
}
