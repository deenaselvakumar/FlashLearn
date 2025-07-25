"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"

interface TopicData {
  topic: string
  score: number
  color: string
  sessions: number
  lastStudied: string
}

interface SpiderChartProps {
  data: TopicData[]
  showPercentages?: boolean
}

export function SpiderChart({ data, showPercentages = false }: SpiderChartProps) {
  const [showScores, setShowScores] = useState(showPercentages)
  const size = 300
  const center = size / 2
  const radius = 100
  const angleStep = (2 * Math.PI) / data.length

  // Calculate points for the spider web
  const webLevels = [20, 40, 60, 80, 100]
  const dataPoints = data.map((item, index) => {
    const angle = index * angleStep - Math.PI / 2
    const value = (item.score / 100) * radius
    const x = center + Math.cos(angle) * value
    const y = center + Math.sin(angle) * value
    return { x, y, angle, value: item.score, topic: item.topic, color: item.color }
  })

  const pathData = dataPoints.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ") + " Z"

  const getScoreColor = (score: number) => {
    if (score >= 80) return "#22c55e" // Green
    if (score >= 60) return "#eab308" // Yellow
    return "#ef4444" // Red
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Strong"
    if (score >= 60) return "Moderate"
    return "Needs Work"
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Knowledge Spider Map</CardTitle>
            <CardDescription>Visual representation of your expertise across topics</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowScores(!showScores)}>
            {showScores ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
            {showScores ? "Hide" : "Show"} Scores
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row items-center gap-6">
          {/* Spider Chart */}
          <div className="flex-shrink-0">
            <svg width={size} height={size} className="overflow-visible">
              {/* Background web */}
              {webLevels.map((level) => (
                <polygon
                  key={level}
                  points={data
                    .map((_, index) => {
                      const angle = index * angleStep - Math.PI / 2
                      const r = (level / 100) * radius
                      const x = center + Math.cos(angle) * r
                      const y = center + Math.sin(angle) * r
                      return `${x},${y}`
                    })
                    .join(" ")}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-muted-foreground/20"
                />
              ))}

              {/* Web lines */}
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
              <path d={pathData} fill="rgba(242, 90, 29, 0.2)" stroke="#f25a1d" strokeWidth="2" />

              {/* Data points */}
              {dataPoints.map((point, index) => (
                <g key={index}>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="6"
                    fill={getScoreColor(point.value)}
                    stroke="white"
                    strokeWidth="2"
                    className="cursor-pointer hover:r-8 transition-all"
                  />
                  {showScores && (
                    <text
                      x={point.x}
                      y={point.y - 15}
                      textAnchor="middle"
                      className="text-xs font-medium fill-current"
                      style={{ fill: getScoreColor(point.value) }}
                    >
                      {point.value}%
                    </text>
                  )}
                </g>
              ))}

              {/* Topic labels */}
              {data.map((item, index) => {
                const angle = index * angleStep - Math.PI / 2
                const labelRadius = radius + 30
                const x = center + Math.cos(angle) * labelRadius
                const y = center + Math.sin(angle) * labelRadius
                return (
                  <text
                    key={index}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-sm font-medium fill-current"
                  >
                    {item.topic}
                  </text>
                )
              })}
            </svg>
          </div>

          {/* Legend */}
          <div className="space-y-4 flex-1">
            <h3 className="font-semibold">Topic Performance</h3>
            <div className="space-y-3">
              {data.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getScoreColor(item.score) }} />
                    <div>
                      <div className="font-medium">{item.topic}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.sessions} sessions • Last: {item.lastStudied}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold" style={{ color: getScoreColor(item.score) }}>
                      {item.score}%
                    </div>
                    <Badge
                      variant={item.score >= 80 ? "default" : item.score >= 60 ? "secondary" : "destructive"}
                      className="text-xs"
                    >
                      {getScoreLabel(item.score)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
