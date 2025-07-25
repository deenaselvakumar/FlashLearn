"use client"

import { useAuth } from "@/components/auth-provider"
import { LoginForm } from "@/components/login-form"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, CheckCircle } from "lucide-react"
import { AppLayout } from "@/components/app-layout"
import { PPTProcessor } from "@/components/ppt-processor"

export default function HomePage() {
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState<"upload" | "processing" | "flashcards">("upload")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [extractedContent, setExtractedContent] = useState<any>(null)

  const handleFileUpload = (file: File) => {
    setUploadedFile(file)
    setCurrentStep("processing")
  }

  const handleContentExtracted = (content: any) => {
    setExtractedContent(content)
    setCurrentStep("flashcards")
  }

  const steps = [
    { id: "upload", title: "Upload PPT", description: "Upload your presentation file" },
    { id: "processing", title: "Extract Content", description: "AI processes your slides" },
    { id: "flashcards", title: "Study Cards", description: "Review generated flashcards" },
  ]

  if (!user) {
    return <LoginForm />
  }

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Transform Your <span className="text-orange-600">Presentations</span> into Flashcards
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload your PPT files and let AI automatically generate interactive flashcards to help you study more
            effectively
          </p>
        </div>

        {/* Progress Steps */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                        currentStep === step.id
                          ? "bg-orange-600 text-white"
                          : steps.findIndex((s) => s.id === currentStep) > index
                            ? "bg-green-600 text-white"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {steps.findIndex((s) => s.id === currentStep) > index ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{step.title}</div>
                      <div className="text-sm text-muted-foreground">{step.description}</div>
                    </div>
                  </div>
                  {index < steps.length - 1 && <ArrowRight className="mx-8 h-5 w-5 text-muted-foreground" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <PPTProcessor
          currentStep={currentStep}
          onFileUpload={handleFileUpload}
          onContentExtracted={handleContentExtracted}
          uploadedFile={uploadedFile}
          extractedContent={extractedContent}
        />
      </div>
    </AppLayout>
  )
}
