"use client"

interface StudySession {
  id: string
  date: string
  accuracy: number
  duration: number
  cardsStudied: number
}

interface LearningChartProps {
  sessions: StudySession[]
}

export function LearningChart({ sessions }: LearningChartProps) {
  const sortedSessions = [...sessions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const maxAccuracy = 100
  const maxDuration = Math.max(...sessions.map((s) => s.duration))

  const chartWidth = 600
  const chartHeight = 300
  const padding = 40

  const getX = (index: number) => padding + (index * (chartWidth - 2 * padding)) / (sortedSessions.length - 1)
  const getAccuracyY = (accuracy: number) =>
    chartHeight - padding - (accuracy / maxAccuracy) * (chartHeight - 2 * padding)
  const getDurationY = (duration: number) =>
    chartHeight - padding - (duration / maxDuration) * (chartHeight - 2 * padding)

  const accuracyPath = sortedSessions
    .map((session, index) => `${index === 0 ? "M" : "L"} ${getX(index)} ${getAccuracyY(session.accuracy)}`)
    .join(" ")

  const durationPath = sortedSessions
    .map((session, index) => `${index === 0 ? "M" : "L"} ${getX(index)} ${getDurationY(session.duration)}`)
    .join(" ")

  return (
    <div className="w-full overflow-x-auto">
      <svg width={chartWidth} height={chartHeight} className="w-full h-auto">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((value) => (
          <g key={value}>
            <line
              x1={padding}
              y1={getAccuracyY(value)}
              x2={chartWidth - padding}
              y2={getAccuracyY(value)}
              stroke="currentColor"
              strokeWidth="1"
              className="text-muted-foreground/20"
            />
            <text
              x={padding - 10}
              y={getAccuracyY(value) + 4}
              textAnchor="end"
              className="text-xs fill-muted-foreground"
            >
              {value}%
            </text>
          </g>
        ))}

        {/* Accuracy line */}
        <path d={accuracyPath} fill="none" stroke="#f25a1d" strokeWidth="3" className="drop-shadow-sm" />

        {/* Duration line */}
        <path
          d={durationPath}
          fill="none"
          stroke="#22c55e"
          strokeWidth="2"
          strokeDasharray="5,5"
          className="opacity-70"
        />

        {/* Data points */}
        {sortedSessions.map((session, index) => (
          <g key={session.id}>
            <circle
              cx={getX(index)}
              cy={getAccuracyY(session.accuracy)}
              r="4"
              fill="#f25a1d"
              stroke="white"
              strokeWidth="2"
              className="cursor-pointer hover:r-6 transition-all"
            />
            <text x={getX(index)} y={chartHeight - 10} textAnchor="middle" className="text-xs fill-muted-foreground">
              {new Date(session.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </text>
          </g>
        ))}

        {/* Legend */}
        <g transform={`translate(${chartWidth - 150}, 20)`}>
          <rect
            x="0"
            y="0"
            width="140"
            height="50"
            fill="white"
            stroke="currentColor"
            strokeWidth="1"
            className="text-border"
            rx="4"
          />
          <line x1="10" y1="15" x2="30" y2="15" stroke="#f25a1d" strokeWidth="3" />
          <text x="35" y="19" className="text-xs fill-current">
            Accuracy
          </text>
          <line x1="10" y1="35" x2="30" y2="35" stroke="#22c55e" strokeWidth="2" strokeDasharray="5,5" />
          <text x="35" y="39" className="text-xs fill-current">
            Duration
          </text>
        </g>
      </svg>
    </div>
  )
}
