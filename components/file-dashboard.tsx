"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  FileText,
  MoreHorizontal,
  Search,
  Filter,
  Calendar,
  BarChart3,
  Play,
  Edit,
  Trash2,
  Download,
  FolderOpen,
} from "lucide-react"

interface FileData {
  id: string
  name: string
  type: "ppt" | "doc"
  uploadDate: string
  flashcardCount: number
  studySessions: number
  averageScore: number
  topics: Array<{
    name: string
    score: number
    status: "strong" | "moderate" | "weak"
  }>
  lastStudied?: string
  folder?: string
}

const mockFiles: FileData[] = [
  {
    id: "1",
    name: "Introduction to Calculus",
    type: "ppt",
    uploadDate: "2024-01-15",
    flashcardCount: 45,
    studySessions: 8,
    averageScore: 85,
    topics: [
      { name: "Limits", score: 90, status: "strong" },
      { name: "Derivatives", score: 82, status: "strong" },
      { name: "Applications", score: 78, status: "moderate" },
    ],
    lastStudied: "2024-01-20",
    folder: "Mathematics",
  },
  {
    id: "2",
    name: "Physics Mechanics",
    type: "ppt",
    uploadDate: "2024-01-12",
    flashcardCount: 32,
    studySessions: 5,
    averageScore: 67,
    topics: [
      { name: "Forces", score: 45, status: "weak" },
      { name: "Motion", score: 72, status: "moderate" },
      { name: "Energy", score: 84, status: "strong" },
    ],
    lastStudied: "2024-01-18",
    folder: "Physics",
  },
  {
    id: "3",
    name: "Organic Chemistry Basics",
    type: "doc",
    uploadDate: "2024-01-10",
    flashcardCount: 28,
    studySessions: 12,
    averageScore: 92,
    topics: [
      { name: "Structures", score: 95, status: "strong" },
      { name: "Reactions", score: 88, status: "strong" },
      { name: "Mechanisms", score: 93, status: "strong" },
    ],
    lastStudied: "2024-01-19",
    folder: "Chemistry",
  },
]

export function FileDashboard() {
  const [files, setFiles] = useState<FileData[]>(mockFiles)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)

  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFolder = !selectedFolder || file.folder === selectedFolder
    return matchesSearch && matchesFolder
  })

  const folders = Array.from(new Set(files.map((file) => file.folder).filter(Boolean)))

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getStatusBadge = (status: "strong" | "moderate" | "weak") => {
    const variants = {
      strong: "default" as const,
      moderate: "secondary" as const,
      weak: "destructive" as const,
    }
    return variants[status]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Files</h1>
          <p className="text-muted-foreground">Manage your uploaded presentations and documents</p>
        </div>
        <Button className="bg-orange-600 hover:bg-orange-700">
          <FileText className="mr-2 h-4 w-4" />
          Upload New File
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  {selectedFolder || "All Folders"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedFolder(null)}>All Folders</DropdownMenuItem>
                {folders.map((folder) => (
                  <DropdownMenuItem key={folder} onClick={() => setSelectedFolder(folder)}>
                    <FolderOpen className="mr-2 h-4 w-4" />
                    {folder}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* File Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredFiles.map((file) => (
          <Card key={file.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg dark:bg-orange-900">
                    <FileText className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{file.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Calendar className="h-3 w-3" />
                      {file.uploadDate}
                      {file.folder && (
                        <>
                          • <FolderOpen className="h-3 w-3" />
                          {file.folder}
                        </>
                      )}
                    </CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* File Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{file.flashcardCount}</div>
                  <div className="text-xs text-muted-foreground">Cards</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{file.studySessions}</div>
                  <div className="text-xs text-muted-foreground">Sessions</div>
                </div>
                <div>
                  <div className={`text-2xl font-bold ${getScoreColor(file.averageScore)}`}>{file.averageScore}%</div>
                  <div className="text-xs text-muted-foreground">Avg Score</div>
                </div>
              </div>

              {/* Topic Performance */}
              <div className="space-y-2">
                <div className="text-sm font-medium">Topic Performance</div>
                {file.topics.map((topic) => (
                  <div key={topic.name} className="flex items-center justify-between">
                    <span className="text-sm">{topic.name}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${getScoreColor(topic.score)}`}>{topic.score}%</span>
                      <Badge variant={getStatusBadge(topic.status)} className="text-xs">
                        {topic.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              {/* Last Studied */}
              {file.lastStudied && (
                <div className="text-sm text-muted-foreground">Last studied: {file.lastStudied}</div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button size="sm" className="flex-1 bg-orange-600 hover:bg-orange-700">
                  <Play className="mr-2 h-4 w-4" />
                  Study
                </Button>
                <Button variant="outline" size="sm">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFiles.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">No files found</h3>
            <p className="text-muted-foreground">
              {searchTerm || selectedFolder
                ? "Try adjusting your search or filter criteria"
                : "Upload your first presentation or document to get started"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
