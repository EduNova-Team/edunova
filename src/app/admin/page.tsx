"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Upload, Loader2, CheckCircle2, XCircle, FileText, Sparkles } from "lucide-react"
import Link from "next/link"

interface Event {
  id: string
  name: string
  organization: "DECA" | "FBLA" | "Both"
  slug: string
}

interface UploadedFile {
  file: File
  id: string
  name: string
  size: number
}

export default function AdminDashboard() {
  const [organization, setOrganization] = useState<"DECA" | "FBLA" | "All">("All")
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEvent, setSelectedEvent] = useState<string>("")
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [questionCount, setQuestionCount] = useState<string>("10")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationStatus, setGenerationStatus] = useState<{
    status: "idle" | "processing" | "completed" | "error"
    message: string
  }>({ status: "idle", message: "" })

  // Fetch events based on organization
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          `/api/events?organization=${organization}`
        )
        const data = await response.json()
        if (data.events) {
          setEvents(data.events)
          // Reset selected event when organization changes
          setSelectedEvent("")
        }
      } catch (error) {
        console.error("Error fetching events:", error)
      }
    }

    fetchEvents()
  }, [organization])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newFiles: UploadedFile[] = files.map((file) => ({
      file,
      id: Math.random().toString(36).substring(7),
      name: file.name,
      size: file.size,
    }))
    setUploadedFiles((prev) => [...prev, ...newFiles])
  }

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  const handleGenerate = async () => {
    if (!selectedEvent || uploadedFiles.length === 0) {
      setGenerationStatus({
        status: "error",
        message: "Please select an event and upload at least one PDF",
      })
      return
    }

    const count = parseInt(questionCount)
    if (isNaN(count) || count < 1 || count > 100) {
      setGenerationStatus({
        status: "error",
        message: "Question count must be between 1 and 100",
      })
      return
    }

    setIsGenerating(true)
    setGenerationStatus({ status: "processing", message: "Uploading PDFs..." })

    try {
      const knowledgeBaseIds: string[] = []

      // Step 1: Upload all PDFs and extract text
      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i]
        setGenerationStatus({
          status: "processing",
          message: `Uploading and processing PDF ${i + 1} of ${uploadedFiles.length}...`,
        })

        const formData = new FormData()
        formData.append("file", file.file)
        formData.append("eventId", selectedEvent)

        const uploadResponse = await fetch("/api/upload-pdf", {
          method: "POST",
          body: formData,
        })

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json()
          throw new Error(errorData.error || "Failed to upload PDF")
        }

        const uploadData = await uploadResponse.json()
        if (uploadData.knowledgeBase?.id) {
          knowledgeBaseIds.push(uploadData.knowledgeBase.id)
        }
      }

      if (knowledgeBaseIds.length === 0) {
        throw new Error("No PDFs were successfully processed")
      }

      // Step 2: Create generation job
      setGenerationStatus({
        status: "processing",
        message: `Creating generation job for ${count} questions...`,
      })

      const generateResponse = await fetch("/api/generate-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: selectedEvent,
          knowledgeBaseIds,
          questionCount: count,
        }),
      })

      if (!generateResponse.ok) {
        const errorData = await generateResponse.json()
        throw new Error(errorData.error || "Failed to create generation job")
      }

      const generateData = await generateResponse.json()

      setGenerationStatus({
        status: "completed",
        message: `Successfully uploaded ${uploadedFiles.length} PDF(s) and created generation job! ${generateData.message || "Questions will be generated in Phase 4."}`,
      })

      // Reset form after successful generation
      setTimeout(() => {
        setUploadedFiles([])
        setQuestionCount("10")
        setGenerationStatus({ status: "idle", message: "" })
      }, 5000)
    } catch (error) {
      console.error("Error generating questions:", error)
      setGenerationStatus({
        status: "error",
        message: error instanceof Error ? error.message : "Failed to process PDFs. Please try again.",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const filteredEvents = events.filter((event) => {
    if (organization === "All") return true
    if (organization === "DECA") {
      return event.organization === "DECA" || event.organization === "Both"
    }
    if (organization === "FBLA") {
      return event.organization === "FBLA" || event.organization === "Both"
    }
    return event.organization === organization
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Generate questions for DECA and FBLA events
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Question Generator</CardTitle>
            <CardDescription>
              Select an event, upload PDF knowledge base, and generate questions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Organization Selection */}
            <div className="space-y-2">
              <Label htmlFor="organization">Organization</Label>
              <Select
                value={organization}
                onValueChange={(value) =>
                  setOrganization(value as "DECA" | "FBLA" | "All")
                }
              >
                <SelectTrigger id="organization" className="w-full">
                  <SelectValue placeholder="Select organization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Organizations</SelectItem>
                  <SelectItem value="DECA">DECA</SelectItem>
                  <SelectItem value="FBLA">FBLA</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Step 2: Event Selection */}
            <div className="space-y-2">
              <Label htmlFor="event">Event</Label>
              <Select
                value={selectedEvent}
                onValueChange={setSelectedEvent}
                disabled={!organization || organization === "All"}
              >
                <SelectTrigger id="event" className="w-full">
                  <SelectValue placeholder="Select an event" />
                </SelectTrigger>
                <SelectContent>
                  {filteredEvents.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {organization === "All" && (
                <p className="text-xs text-muted-foreground">
                  Please select a specific organization first
                </p>
              )}
            </div>

            {/* Step 3: PDF Upload */}
            <div className="space-y-2">
              <Label>Knowledge Base PDFs</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <Upload className="w-12 h-12 text-muted-foreground" />
                  <div className="text-center">
                    <Label
                      htmlFor="pdf-upload"
                      className="cursor-pointer text-primary hover:underline"
                    >
                      Click to upload PDFs
                    </Label>
                    <Input
                      id="pdf-upload"
                      type="file"
                      accept=".pdf"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Upload past practice tests as knowledge base
                    </p>
                  </div>
                </div>
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-2 mt-4">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 bg-card border border-border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Step 4: Question Count */}
            <div className="space-y-2">
              <Label htmlFor="question-count">Number of Questions</Label>
              <Input
                id="question-count"
                type="number"
                min="1"
                max="100"
                value={questionCount}
                onChange={(e) => setQuestionCount(e.target.value)}
                placeholder="Enter number of questions (max 100)"
              />
              <p className="text-xs text-muted-foreground">
                Maximum 100 questions per generation
              </p>
            </div>

            {/* Generate Button */}
            <Button
              className="w-full"
              size="lg"
              onClick={handleGenerate}
              disabled={
                !selectedEvent ||
                uploadedFiles.length === 0 ||
                isGenerating ||
                parseInt(questionCount) < 1 ||
                parseInt(questionCount) > 100
              }
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Questions
                </>
              )}
            </Button>

            {/* Status Message */}
            {generationStatus.status !== "idle" && (
              <div
                className={`p-4 rounded-lg border ${
                  generationStatus.status === "completed"
                    ? "bg-green-500/10 border-green-500/20"
                    : generationStatus.status === "error"
                    ? "bg-red-500/10 border-red-500/20"
                    : "bg-blue-500/10 border-blue-500/20"
                }`}
              >
                <div className="flex items-center gap-2">
                  {generationStatus.status === "completed" ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : generationStatus.status === "error" ? (
                    <XCircle className="w-5 h-5 text-red-500" />
                  ) : (
                    <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                  )}
                  <p
                    className={`text-sm ${
                      generationStatus.status === "completed"
                        ? "text-green-500"
                        : generationStatus.status === "error"
                        ? "text-red-500"
                        : "text-blue-500"
                    }`}
                  >
                    {generationStatus.message}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

