"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Play, BookOpen } from "lucide-react"
import Link from "next/link"

const categoryData: Record<string, { title: string; maxQuestions: number }> = {
  accounting: { title: "Accounting I", maxQuestions: 250 },
  "personal-finance": { title: "Personal Finance", maxQuestions: 248 },
  "business-management": { title: "Business Management", maxQuestions: 250 },
  advertising: { title: "Advertising", maxQuestions: 250 },
  marketing: { title: "Marketing", maxQuestions: 125 },
  cybersecurity: { title: "Cybersecurity", maxQuestions: 249 },
  securities: { title: "Securities & Investments", maxQuestions: 250 },
  "intro-it": { title: "Introduction to IT", maxQuestions: 250 },
  "financial-math": { title: "Financial Math", maxQuestions: 200 },
}

export default function TestConfigPage() {
  const params = useParams()
  const router = useRouter()
  const category = params.category as string
  const categoryInfo = categoryData[category] || { title: "Quiz", maxQuestions: 100 }

  const [numQuestions, setNumQuestions] = useState("10")
  const [timeLimit, setTimeLimit] = useState("15")
  const [difficulty, setDifficulty] = useState("any")

  const handleGenerateTest = () => {
    router.push(`/fbla/${category}/quiz?questions=${numQuestions}&time=${timeLimit}&difficulty=${difficulty}`)
  }

  const handleUnlimitedPractice = () => {
    router.push(`/fbla/${category}/practice`)
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <div className="container py-12">
        <Link href="/fbla">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Quiz Selection
          </Button>
        </Link>

        <Card className="max-w-2xl mx-auto bg-card border-border">
          <CardContent className="pt-8 pb-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Test Configuration</h1>
              <p className="text-muted-foreground">{categoryInfo.title}</p>
            </div>

            <div className="space-y-6">
              {/* Number of Questions */}
              <div className="space-y-2">
                <Label htmlFor="questions" className="text-sm font-medium">
                  Number of Questions
                </Label>
                <Input
                  id="questions"
                  type="number"
                  min="1"
                  max={categoryInfo.maxQuestions}
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(e.target.value)}
                  className="bg-background border-border"
                />
                <p className="text-xs text-muted-foreground">Available: {categoryInfo.maxQuestions} questions</p>
              </div>

              {/* Time Limit */}
              <div className="space-y-2">
                <Label htmlFor="time" className="text-sm font-medium">
                  Time Limit (minutes)
                </Label>
                <Input
                  id="time"
                  type="number"
                  min="1"
                  max="180"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(e.target.value)}
                  className="bg-background border-border"
                />
              </div>

              {/* Difficulty */}
              <div className="space-y-2">
                <Label htmlFor="difficulty" className="text-sm font-medium">
                  Difficulty
                </Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <Button
                  onClick={handleGenerateTest}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-6"
                  size="lg"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Generate Test
                </Button>

                <Button
                  onClick={handleUnlimitedPractice}
                  variant="outline"
                  className="w-full border-border hover:bg-muted py-6 bg-transparent"
                  size="lg"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Unlimited Practice
                </Button>

                <Link href="/fbla">
                  <Button variant="outline" className="w-full border-border hover:bg-muted bg-transparent">
                    Back to Quiz Selection
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Attempts */}
        <Card className="max-w-2xl mx-auto mt-6 bg-card border-border">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center gap-2 text-yellow-500">
              <div className="w-6 h-6 rounded-full border-2 border-yellow-500 flex items-center justify-center">
                <span className="text-xs">!</span>
              </div>
              <h2 className="text-lg font-semibold">Recent Attempts</h2>
            </div>
            <p className="text-muted-foreground text-sm mt-2">Your recent quiz attempts will appear here</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
