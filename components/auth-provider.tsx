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
  }
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  register: (username: string, email: string, password: string) => Promise<boolean>
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
        totalSessions: 25,
        averageAccuracy: 78,
        studyStreak: 7,
        totalCards: 450,
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
        totalSessions: 18,
        averageAccuracy: 85,
        studyStreak: 12,
        totalCards: 320,
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
        totalSessions: 32,
        averageAccuracy: 72,
        studyStreak: 5,
        totalCards: 580,
      },
    },
  },
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const userData = mockUsers[username]
    if (userData && userData.password === password) {
      setUser(userData.user)
      localStorage.setItem("currentUser", JSON.stringify(userData.user))
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

    if (mockUsers[username]) {
      setIsLoading(false)
      return false // Username already exists
    }

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
      },
    }

    mockUsers[username] = { password, user: newUser }
    setUser(newUser)
    localStorage.setItem("currentUser", JSON.stringify(newUser))
    setIsLoading(false)
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("currentUser")
  }

  return <AuthContext.Provider value={{ user, login, logout, register, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
