"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileText, Sparkles, Brain, Edit, Save, Trash2, Plus, Eye, CheckCircle } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { EnhancedFlashcardStudy } from "@/components/enhanced-flashcard-study"

interface SlideContent {
  slideNumber: number
  title: string
  content: string
  bulletPoints: string[]
  images?: string[]
}

interface EnhancedFlashcard {
  id: string
  question: string
  answer: string
  explanation: string
  topic: string
  difficulty: "Easy" | "Medium" | "Hard"
  slideSource: number
  type: "definition" | "concept" | "application"
  hints: string[]
  relatedConcepts: string[]
  commonMistakes: string[]
  isEditing?: boolean
}

interface PPTProcessorProps {
  currentStep: "upload" | "processing" | "flashcards"
  onFileUpload: (file: File) => void
  onContentExtracted: (content: any) => void
  uploadedFile: File | null
  extractedContent: any
}

export function PPTProcessor({
  currentStep,
  onFileUpload,
  onContentExtracted,
  uploadedFile,
  extractedContent,
}: PPTProcessorProps) {
  const [processingProgress, setProcessingProgress] = useState(0)
  const [extractedSlides, setExtractedSlides] = useState<SlideContent[]>([])
  const [generatedFlashcards, setGeneratedFlashcards] = useState<EnhancedFlashcard[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [showStudyMode, setShowStudyMode] = useState(false)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (file) {
        onFileUpload(file)
        simulateFileProcessing(file)
      }
    },
    [onFileUpload],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.ms-powerpoint": [".ppt"],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // 50MB
  })

  const simulateFileProcessing = async (file: File) => {
    setIsProcessing(true)

    // Simulate processing steps
    const steps = [
      { progress: 20, message: "Reading PPT file..." },
      { progress: 40, message: "Extracting slide content..." },
      { progress: 60, message: "Analyzing text and images..." },
      { progress: 80, message: "Generating flashcards with explanations..." },
      { progress: 100, message: "Processing complete!" },
    ]

    for (const step of steps) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setProcessingProgress(step.progress)
    }

    // Simulate extracted content based on file name
    const mockSlides = generateMockSlides(file.name)
    setExtractedSlides(mockSlides)

    // Generate enhanced flashcards from slides
    const flashcards = generateEnhancedFlashcardsFromSlides(mockSlides)
    setGeneratedFlashcards(flashcards)

    setIsProcessing(false)
    onContentExtracted({ slides: mockSlides, flashcards })
  }

  const generateMockSlides = (filename: string): SlideContent[] => {
    // Generate realistic content based on filename
    if (filename.toLowerCase().includes("calculus") || filename.toLowerCase().includes("math")) {
      return [
        {
          slideNumber: 1,
          title: "Introduction to Derivatives",
          content: "A derivative represents the rate of change of a function with respect to its variable.",
          bulletPoints: [
            "Derivatives measure instantaneous rate of change",
            "Notation: f'(x) or df/dx",
            "Geometric interpretation: slope of tangent line",
          ],
        },
        {
          slideNumber: 2,
          title: "Basic Derivative Rules",
          content: "Power Rule: d/dx[x^n] = nx^(n-1)",
          bulletPoints: [
            "Power Rule for polynomials",
            "Product Rule: (uv)' = u'v + uv'",
            "Chain Rule: (f(g(x)))' = f'(g(x)) × g'(x)",
          ],
        },
        {
          slideNumber: 3,
          title: "Applications of Derivatives",
          content: "Derivatives are used to find maximum and minimum values of functions.",
          bulletPoints: ["Finding critical points", "Optimization problems", "Related rates", "Curve sketching"],
        },
      ]
    } else if (filename.toLowerCase().includes("physics")) {
      return [
        {
          slideNumber: 1,
          title: "Newton's Laws of Motion",
          content: "Three fundamental laws that describe the relationship between forces and motion.",
          bulletPoints: [
            "First Law: Object at rest stays at rest",
            "Second Law: F = ma",
            "Third Law: Action-reaction pairs",
          ],
        },
        {
          slideNumber: 2,
          title: "Force and Acceleration",
          content: "Force is directly proportional to acceleration: F = ma",
          bulletPoints: ["Force measured in Newtons (N)", "Acceleration in m/s²", "Mass affects acceleration"],
        },
      ]
    } else {
      return [
        {
          slideNumber: 1,
          title: "Key Concepts",
          content: "This presentation covers fundamental concepts in the subject matter.",
          bulletPoints: ["Introduction to main topics", "Core principles and theories", "Practical applications"],
        },
        {
          slideNumber: 2,
          title: "Important Definitions",
          content: "Understanding key terminology is essential for mastery.",
          bulletPoints: ["Technical vocabulary", "Conceptual frameworks", "Real-world examples"],
        },
      ]
    }
  }

  const generateEnhancedFlashcardsFromSlides = (slides: SlideContent[]): EnhancedFlashcard[] => {
    const flashcards: EnhancedFlashcard[] = []

    slides.forEach((slide, index) => {
      // Generate definition flashcard from title
      flashcards.push({
        id: `fc-${index}-1`,
        question: `What is ${slide.title}?`,
        answer: slide.content,
        explanation: `${slide.title} is a fundamental concept that ${slide.content.toLowerCase()} This concept is essential for understanding the broader topic and forms the foundation for more advanced applications.`,
        topic: slide.title,
        difficulty: "Medium",
        slideSource: slide.slideNumber,
        type: "definition",
        hints: [
          `Think about the main purpose of ${slide.title}`,
          "Consider how this concept relates to the overall subject",
          "Remember the key characteristics mentioned in the slide",
        ],
        relatedConcepts: slide.bulletPoints.slice(0, 2),
        commonMistakes: [
          `Confusing ${slide.title} with similar concepts`,
          "Not understanding the practical applications",
          "Memorizing without understanding the underlying principles",
        ],
      })

      // Generate flashcards from bullet points
      slide.bulletPoints.forEach((point, pointIndex) => {
        if (point.includes(":")) {
          const [question, answer] = point.split(":")
          flashcards.push({
            id: `fc-${index}-${pointIndex + 2}`,
            question: `Explain: ${question.trim()}`,
            answer: answer.trim(),
            explanation: `${question.trim()} refers to ${answer.trim()}. This is an important aspect of ${slide.title} because it helps us understand how the concept works in practice. Understanding this relationship is crucial for applying the concept correctly.`,
            topic: slide.title,
            difficulty: "Easy",
            slideSource: slide.slideNumber,
            type: "concept",
            hints: [
              `Focus on the relationship described in "${question.trim()}"`,
              "Think about why this relationship is important",
              "Consider practical examples where this applies",
            ],
            relatedConcepts: [slide.title, ...slide.bulletPoints.filter((p) => p !== point).slice(0, 2)],
            commonMistakes: [
              "Mixing up the cause and effect relationship",
              "Not seeing the connection to the main concept",
              "Applying the rule incorrectly in different contexts",
            ],
          })
        } else {
          flashcards.push({
            id: `fc-${index}-${pointIndex + 2}`,
            question: `What does "${point}" refer to in the context of ${slide.title}?`,
            answer: `This refers to ${point.toLowerCase()} as discussed in ${slide.title}.`,
            explanation: `"${point}" is a key component of ${slide.title}. It represents an important aspect that students need to understand to fully grasp the concept. This element works together with other components to form a complete understanding of the topic.`,
            topic: slide.title,
            difficulty: "Medium",
            slideSource: slide.slideNumber,
            type: "application",
            hints: [
              `Think about how "${point}" fits into the bigger picture`,
              "Consider the role this plays in the overall concept",
              "Remember the context provided in the slide",
            ],
            relatedConcepts: [slide.title, ...slide.bulletPoints.filter((p) => p !== point).slice(0, 2)],
            commonMistakes: [
              "Taking the statement out of context",
              "Not connecting it to the main concept",
              "Oversimplifying the relationship",
            ],
          })
        }
      })
    })

    return flashcards
  }

  const updateFlashcard = (id: string, updates: Partial<EnhancedFlashcard>) => {
    setGeneratedFlashcards((prev) => prev.map((card) => (card.id === id ? { ...card, ...updates } : card)))
  }

  const deleteFlashcard = (id: string) => {
    setGeneratedFlashcards((prev) => prev.filter((card) => card.id !== id))
  }

  const addNewFlashcard = () => {
    const newCard: EnhancedFlashcard = {
      id: `fc-new-${Date.now()}`,
      question: "",
      answer: "",
      explanation: "",
      topic: "Custom",
      difficulty: "Medium",
      slideSource: 0,
      type: "concept",
      hints: [""],
      relatedConcepts: [],
      commonMistakes: [""],
      isEditing: true,
    }
    setGeneratedFlashcards((prev) => [...prev, newCard])
  }

  if (currentStep === "upload") {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Your Presentation
          </CardTitle>
          <CardDescription>
            Upload a PowerPoint file (.ppt or .pptx) to automatically generate flashcards with detailed explanations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
              isDragActive
                ? "border-orange-500 bg-orange-50 dark:bg-orange-950"
                : "border-muted-foreground/25 hover:border-orange-500/50"
            }`}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center dark:bg-orange-900">
                <FileText className="h-8 w-8 text-orange-600" />
              </div>
              <div>
                <p className="text-xl font-medium">
                  {isDragActive ? "Drop your PPT file here" : "Drag & drop your PPT file here"}
                </p>
                <p className="text-muted-foreground">or click to browse • PPT, PPTX • Max 50MB</p>
              </div>
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                <Upload className="mr-2 h-4 w-4" />
                Choose File
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (currentStep === "processing") {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 animate-pulse text-orange-600" />
            Processing Your Presentation
          </CardTitle>
          <CardDescription>
            AI is analyzing your slides and generating enhanced flashcards with explanations...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-6xl font-bold text-orange-600 mb-2">{processingProgress}%</div>
            <Progress value={processingProgress} className="h-3" />
          </div>

          {uploadedFile && (
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
              <FileText className="h-8 w-8 text-orange-600" />
              <div>
                <div className="font-medium">{uploadedFile.name}</div>
                <div className="text-sm text-muted-foreground">{(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB</div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-orange-600" />
              <span className="text-sm">Extracting content from slides...</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-orange-600" />
              <span className="text-sm">Generating intelligent questions with explanations...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (showStudyMode) {
    return <EnhancedFlashcardStudy flashcards={generatedFlashcards} onExit={() => setShowStudyMode(false)} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Enhanced Flashcards Generated Successfully!
              </CardTitle>
              <CardDescription>
                {generatedFlashcards.length} flashcards created with detailed explanations from {extractedSlides.length}{" "}
                slides
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={addNewFlashcard} variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Card
              </Button>
              <Button onClick={() => setShowStudyMode(true)} className="bg-orange-600 hover:bg-orange-700">
                <Eye className="mr-2 h-4 w-4" />
                Start Enhanced Study
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Generated Flashcards with Enhanced Features */}
      <Card>
        <CardHeader>
          <CardTitle>Enhanced Flashcards with Explanations</CardTitle>
          <CardDescription>
            Review and edit your automatically generated flashcards with detailed explanations and hints
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {generatedFlashcards.map((card) => (
              <div key={card.id} className="border rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Slide {card.slideSource}</Badge>
                    <Badge variant="secondary">{card.topic}</Badge>
                    <Badge
                      variant={
                        card.difficulty === "Easy"
                          ? "default"
                          : card.difficulty === "Medium"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {card.difficulty}
                    </Badge>
                    <Badge variant="outline">{card.type}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => updateFlashcard(card.id, { isEditing: !card.isEditing })}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteFlashcard(card.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {card.isEditing ? (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`question-${card.id}`}>Question</Label>
                        <Textarea
                          id={`question-${card.id}`}
                          value={card.question}
                          onChange={(e) => updateFlashcard(card.id, { question: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`answer-${card.id}`}>Answer</Label>
                        <Textarea
                          id={`answer-${card.id}`}
                          value={card.answer}
                          onChange={(e) => updateFlashcard(card.id, { answer: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor={`explanation-${card.id}`}>Detailed Explanation</Label>
                      <Textarea
                        id={`explanation-${card.id}`}
                        value={card.explanation}
                        onChange={(e) => updateFlashcard(card.id, { explanation: e.target.value })}
                        className="mt-1"
                        rows={3}
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor={`topic-${card.id}`}>Topic</Label>
                        <Input
                          id={`topic-${card.id}`}
                          value={card.topic}
                          onChange={(e) => updateFlashcard(card.id, { topic: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`difficulty-${card.id}`}>Difficulty</Label>
                        <select
                          id={`difficulty-${card.id}`}
                          value={card.difficulty}
                          onChange={(e) => updateFlashcard(card.id, { difficulty: e.target.value as any })}
                          className="mt-1 w-full px-3 py-2 border border-input bg-background rounded-md"
                        >
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Hard">Hard</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor={`type-${card.id}`}>Type</Label>
                        <select
                          id={`type-${card.id}`}
                          value={card.type}
                          onChange={(e) => updateFlashcard(card.id, { type: e.target.value as any })}
                          className="mt-1 w-full px-3 py-2 border border-input bg-background rounded-md"
                        >
                          <option value="definition">Definition</option>
                          <option value="concept">Concept</option>
                          <option value="application">Application</option>
                        </select>
                      </div>
                    </div>

                    <Button
                      onClick={() => updateFlashcard(card.id, { isEditing: false })}
                      size="sm"
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">Question</div>
                        <div className="p-3 bg-muted/50 rounded-lg">{card.question}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">Answer</div>
                        <div className="p-3 bg-muted/50 rounded-lg">{card.answer}</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">Explanation</div>
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-950 dark:border-blue-800">
                        {card.explanation}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-2">Hints</div>
                        <div className="space-y-1">
                          {card.hints.map((hint, index) => (
                            <div
                              key={index}
                              className="text-sm p-2 bg-yellow-50 border border-yellow-200 rounded dark:bg-yellow-950 dark:border-yellow-800"
                            >
                              💡 {hint}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-2">Common Mistakes</div>
                        <div className="space-y-1">
                          {card.commonMistakes.map((mistake, index) => (
                            <div
                              key={index}
                              className="text-sm p-2 bg-red-50 border border-red-200 rounded dark:bg-red-950 dark:border-red-800"
                            >
                              ⚠️ {mistake}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {card.relatedConcepts.length > 0 && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-2">Related Concepts</div>
                        <div className="flex flex-wrap gap-2">
                          {card.relatedConcepts.map((concept) => (
                            <Badge key={concept} variant="outline" className="text-xs">
                              {concept}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
