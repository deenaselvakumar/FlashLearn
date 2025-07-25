"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, Brain, Users, BarChart3, Zap, BookOpen, Target } from "lucide-react"
import { PPTUpload } from "@/components/ppt-upload"
import { useAuth } from "@/components/auth-provider"
import { LoginForm } from "@/components/login-form"

export default function HomePage() {
  const [showUpload, setShowUpload] = useState(false)
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <LoginForm />
  }

  if (showUpload) {
    return <PPTUpload onBack={() => setShowUpload(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Brain className="h-8 w-8 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              FlashLearn
            </h1>
          </div>
          <p className="text-xl text-muted-foreground mb-2">Transform your presentations into interactive flashcards</p>
          <p className="text-muted-foreground">
            Welcome back, <span className="font-semibold text-purple-600">{user?.name}</span>!
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer border-purple-200 dark:border-purple-800"
            onClick={() => setShowUpload(true)}
          >
            <CardContent className="p-6 text-center">
              <Upload className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Upload PPT</h3>
              <p className="text-sm text-muted-foreground">Convert presentations to flashcards</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-blue-200 dark:border-blue-800">
            <CardContent className="p-6 text-center">
              <FileText className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">My Files</h3>
              <p className="text-sm text-muted-foreground">Manage your flashcard sets</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-green-200 dark:border-green-800">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Study Groups</h3>
              <p className="text-sm text-muted-foreground">Join collaborative learning</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-indigo-200 dark:border-indigo-800">
            <CardContent className="p-6 text-center">
              <BarChart3 className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Analytics</h3>
              <p className="text-sm text-muted-foreground">Track your progress</p>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card className="border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-600" />
                AI-Powered Learning
              </CardTitle>
              <CardDescription>
                Advanced algorithms analyze your performance and adapt to your learning style
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                  >
                    Smart Difficulty
                  </Badge>
                  <span className="text-sm">Adaptive question difficulty</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    Weakness Detection
                  </Badge>
                  <span className="text-sm">Identify knowledge gaps</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  >
                    Personalized Path
                  </Badge>
                  <span className="text-sm">Custom learning journey</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                Interactive Study Modes
              </CardTitle>
              <CardDescription>Multiple ways to engage with your content for maximum retention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                  >
                    Flip Cards
                  </Badge>
                  <span className="text-sm">Classic flashcard experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    Battle Mode
                  </Badge>
                  <span className="text-sm">Competitive learning</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  >
                    Spaced Repetition
                  </Badge>
                  <span className="text-sm">Optimized review timing</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="border-indigo-200 dark:border-indigo-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-indigo-600" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your latest learning sessions and achievements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span className="font-medium">Biology Chapter 5</span>
                  <Badge variant="outline">92% accuracy</Badge>
                </div>
                <span className="text-sm text-muted-foreground">2 hours ago</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="font-medium">Math Study Group Battle</span>
                  <Badge variant="outline">Victory!</Badge>
                </div>
                <span className="text-sm text-muted-foreground">1 day ago</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="font-medium">History Presentation</span>
                  <Badge variant="outline">Uploaded</Badge>
                </div>
                <span className="text-sm text-muted-foreground">3 days ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <Button
            size="lg"
            onClick={() => setShowUpload(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3"
          >
            <Upload className="mr-2 h-5 w-5" />
            Start Learning Now
          </Button>
        </div>
      </div>
    </div>
  )
}
