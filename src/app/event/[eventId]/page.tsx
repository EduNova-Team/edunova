"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Play, Clock, BookOpen } from 'lucide-react'
import Link from "next/link"
import { useParams } from 'next/navigation'

export default function EventConfigPage() {
  const params = useParams()
  const eventId = params.eventId as string
  const eventName = eventId.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())

  const [numQuestions, setNumQuestions] = useState("10")
  const [timeLimit, setTimeLimit] = useState("15")

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-2xl px-4">
          <div className="rounded-lg border border-border bg-card p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Test Configuration</h1>
              <p className="text-muted-foreground">{eventName}</p>
            </div>

            <div className="space-y-6">
              {/* Number of Questions */}
              <div>
                <Label htmlFor="questions" className="text-base">
                  Number of Questions
                </Label>
                <Input
                  id="questions"
                  type="number"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(e.target.value)}
                  className="mt-2"
                />
                <p className="text-sm text-muted-foreground mt-2">Available: 250 questions</p>
              </div>

              {/* Time Limit */}
              <div>
                <Label htmlFor="time" className="text-base">
                  Time Limit (minutes)
                </Label>
                <Input
                  id="time"
                  type="number"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(e.target.value)}
                  className="mt-2"
                />
              </div>

              {/* Buttons */}
              <div className="space-y-3 pt-4">
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white" size="lg" asChild>
                  <Link
                    href={`/event/${eventId}/quiz?questions=${numQuestions}&time=${timeLimit}&mode=test`}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Generate Test
                  </Link>
                </Button>

                <Button variant="outline" className="w-full bg-transparent" size="lg" asChild>
                  <Link href={`/event/${eventId}/quiz?mode=practice`}>
                    <BookOpen className="w-4 h-4 mr-2" />
                    Unlimited Practice
                  </Link>
                </Button>

                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/">Back to Quiz Selection</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Recent Attempts */}
          <div className="mt-8 rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-orange-500" />
              <h2 className="text-xl font-semibold">Recent Attempts</h2>
            </div>
            <p className="text-sm text-muted-foreground">No recent attempts yet. Start your first quiz above!</p>
          </div>
        </div>
      </div>
    </div>
  )
}
