"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, ImageIcon, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { useDropzone } from "react-dropzone"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  status: "uploading" | "processing" | "completed" | "error"
  progress: number
  flashcardCount?: number
  topics?: string[]
}

export function PPTUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      status: "uploading",
      progress: 0,
    }))

    setFiles((prev) => [...prev, ...newFiles])

    // Simulate file upload and processing
    newFiles.forEach((file) => {
      simulateFileProcessing(file.id)
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.ms-powerpoint": [".ppt"],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
  })

  const simulateFileProcessing = async (fileId: string) => {
    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200))
      setFiles((prev) =>
        prev.map((file) =>
          file.id === fileId ? { ...file, progress, status: progress === 100 ? "processing" : "uploading" } : file,
        ),
      )
    }

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simulate completion with mock data
    setFiles((prev) =>
      prev.map((file) =>
        file.id === fileId
          ? {
              ...file,
              status: "completed",
              flashcardCount: Math.floor(Math.random() * 50) + 10,
              topics: ["Introduction", "Key Concepts", "Examples", "Summary"],
            }
          : file,
      ),
    )
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getStatusIcon = (status: UploadedFile["status"]) => {
    switch (status) {
      case "uploading":
      case "processing":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />
    }
  }

  const getStatusText = (status: UploadedFile["status"]) => {
    switch (status) {
      case "uploading":
        return "Uploading..."
      case "processing":
        return "Converting to flashcards..."
      case "completed":
        return "Ready for study"
      case "error":
        return "Processing failed"
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Presentation or Document
          </CardTitle>
          <CardDescription>Upload PPT, PPTX, DOC, or DOCX files to automatically generate flashcards</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
            }`}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-lg font-medium">{isDragActive ? "Drop files here" : "Drag & drop files here"}</p>
                <p className="text-sm text-muted-foreground">or click to browse • PPT, PPTX, DOC, DOCX • Max 50MB</p>
              </div>
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Choose Files
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Processing Files</CardTitle>
            <CardDescription>Track the conversion progress of your uploaded files</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {files.map((file) => (
              <div key={file.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg dark:bg-orange-900">
                      {file.type.includes("presentation") ? (
                        <FileText className="h-4 w-4 text-orange-600" />
                      ) : (
                        <ImageIcon className="h-4 w-4 text-orange-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{file.name}</div>
                      <div className="text-sm text-muted-foreground">{formatFileSize(file.size)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(file.status)}
                    <span className="text-sm">{getStatusText(file.status)}</span>
                  </div>
                </div>

                {(file.status === "uploading" || file.status === "processing") && (
                  <Progress value={file.progress} className="h-2" />
                )}

                {file.status === "completed" && (
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-4">
                      <div className="text-sm">
                        <span className="font-medium">{file.flashcardCount}</span> flashcards created
                      </div>
                      <div className="flex gap-1">
                        {file.topics?.slice(0, 3).map((topic) => (
                          <Badge key={topic} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                        {file.topics && file.topics.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{file.topics.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                      Start Studying
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
