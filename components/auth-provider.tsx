"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  username: string
  email: string
  avatar?: string
  stats: {
    totalSessions: number
    averageAccuracy: number
    studyStreak: number
    totalCards: number
    weakTopics: string[]
  }
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  register: (username: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user database
const mockUsers: Record<string, { password: string; user: User }> = {
  alex_johnson: {
    password: "password123",
    user: {
      id: "user_1",
      username: "alex_johnson",
      email: "alex@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      stats: {
        totalSessions: 45,
        averageAccuracy: 78,
        studyStreak: 7,
        totalCards: 450,
        weakTopics: ["Calculus", "Physics"],
      },
    },
  },
  sarah_chen: {
    password: "password123",
    user: {
      id: "user_2",
      username: "sarah_chen",
      email: "sarah@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      stats: {
        totalSessions: 32,
        averageAccuracy: 85,
        studyStreak: 12,
        totalCards: 320,
        weakTopics: ["Chemistry", "Biology"],
      },
    },
  },
  mike_davis: {
    password: "password123",
    user: {
      id: "user_3",
      username: "mike_davis",
      email: "mike@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      stats: {
        totalSessions: 58,
        averageAccuracy: 72,
        studyStreak: 5,
        totalCards: 580,
        weakTopics: ["Mathematics", "Statistics"],
      },
    },
  },
  emma_wilson: {
    password: "password123",
    user: {
      id: "user_4",
      username: "emma_wilson",
      email: "emma@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      stats: {
        totalSessions: 28,
        averageAccuracy: 91,
        studyStreak: 8,
        totalCards: 280,
        weakTopics: ["History", "Literature"],
      },
    },
  },
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("flashcard_user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Error parsing stored user:", error)
        localStorage.removeItem("flashcard_user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const userRecord = mockUsers[username]
    if (userRecord && userRecord.password === password) {
      setUser(userRecord.user)
      localStorage.setItem("flashcard_user", JSON.stringify(userRecord.user))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if username already exists
    if (mockUsers[username]) {
      setIsLoading(false)
      return false
    }

    // Create new user
    const newUser: User = {
      id: `user_${Date.now()}`,
      username,
      email,
      avatar: "/placeholder.svg?height=40&width=40",
      stats: {
        totalSessions: 0,
        averageAccuracy: 0,
        studyStreak: 0,
        totalCards: 0,
        weakTopics: [],
      },
    }

    mockUsers[username] = {
      password,
      user: newUser,
    }

    setUser(newUser)
    localStorage.setItem("flashcard_user", JSON.stringify(newUser))
    setIsLoading(false)
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("flashcard_user")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
