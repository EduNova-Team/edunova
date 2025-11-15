"use client"

import { useState } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, HelpCircle, ChevronRight, Clock, Lightbulb } from "lucide-react"
import Link from "next/link"

// Sample questions - in production this would come from a database
const sampleQuestions = [
  {
    id: 1,
    question: "What is the accounting equation?",
    options: [
      "Assets = Liabilities + Owner's Equity",
      "Revenue = Expenses + Net Income",
      "Assets = Liabilities - Owner's Equity",
      "Debits = Credits",
    ],
    correctAnswer: 0,
    explanation:
      "The fundamental accounting equation is Assets = Liabilities + Owner's Equity. This equation must always balance and forms the basis of double-entry bookkeeping. For example, if a company has $100,000 in assets, $30,000 in liabilities, then the owner's equity must be $70,000.",
  },
  {
    id: 2,
    question: "Which of the following is NOT one of the four Ps of marketing?",
    options: ["Product", "Price", "Promotion", "Profit"],
    correctAnswer: 3,
    explanation:
      "The four Ps of marketing are Product, Price, Place, and Promotion. Profit is the result of effective marketing but is not part of the marketing mix. For example, Apple's marketing mix includes the Product (iPhone), Price ($999), Place (Apple stores, online), and Promotion (advertising campaigns).",
  },
  {
    id: 3,
    question: "What is the primary purpose of a balance sheet?",
    options: [
      "To show revenue and expenses over a period",
      "To show assets, liabilities, and equity at a specific point in time",
      "To track cash inflows and outflows",
      "To calculate net income",
    ],
    correctAnswer: 1,
    explanation:
      "A balance sheet provides a snapshot of a company's financial position at a specific point in time, showing what it owns (assets), what it owes (liabilities), and the owner's investment (equity). For example, a balance sheet dated December 31, 2024 shows the company's financial position on that exact date.",
  },
]

export default function QuizPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()

  const category = params.category as string
  const numQuestions = Number.parseInt(searchParams.get("questions") || "10")
  const timeLimit = Number.parseInt(searchParams.get("time") || "15")

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [showAIExplanation, setShowAIExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(timeLimit * 60)

  const currentQ = sampleQuestions[currentQuestion % sampleQuestions.length]
  const progress = ((currentQuestion + 1) / numQuestions) * 100

  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer === null) {
      setSelectedAnswer(index)
      setShowExplanation(true)
      if (index === currentQ.correctAnswer) {
        setScore(score + 1)
      }
      setAnsweredQuestions(answeredQuestions + 1)
    }
  }

  const handleNext = () => {
    if (currentQuestion + 1 < numQuestions) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
      setShowAIExplanation(false)
    } else {
      router.push(`/fbla/${category}/results?score=${score}&total=${numQuestions}`)
    }
  }

  const handleAIExplanation = async () => {
    setShowAIExplanation(!showAIExplanation)
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href={`/fbla/${category}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Exit Quiz
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, "0")}
            </Badge>
            <Badge variant="outline">
              Question {currentQuestion + 1} of {numQuestions}
            </Badge>
          </div>
        </div>

        {/* Progress Bar */}
        <Progress value={progress} className="mb-8" />

        {/* Question Card */}
        <Card className="max-w-3xl mx-auto bg-card border-border">
          <CardContent className="pt-8 pb-8">
            <div className="mb-8">
              <div className="flex items-start gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-medium leading-relaxed">{currentQ.question}</h2>
              </div>

              {/* Answer Options */}
              <div className="space-y-3">
                {currentQ.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={selectedAnswer !== null}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedAnswer === null
                        ? "border-border hover:border-primary cursor-pointer"
                        : selectedAnswer === index
                          ? index === currentQ.correctAnswer
                            ? "border-green-500 bg-green-500/10"
                            : "border-red-500 bg-red-500/10"
                          : index === currentQ.correctAnswer
                            ? "border-green-500 bg-green-500/10"
                            : "border-border opacity-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                          selectedAnswer === null
                            ? "border-border"
                            : selectedAnswer === index
                              ? index === currentQ.correctAnswer
                                ? "border-green-500 bg-green-500 text-white"
                                : "border-red-500 bg-red-500 text-white"
                              : index === currentQ.correctAnswer
                                ? "border-green-500 bg-green-500 text-white"
                                : "border-border"
                        }`}
                      >
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span>{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Explanation Section */}
            {showExplanation && (
              <div className="mt-6 space-y-4">
                <div className="p-4 rounded-lg bg-muted border border-border">
                  <div className="flex items-start gap-2 mb-2">
                    <Lightbulb className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-2">Explanation</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{currentQ.explanation}</p>
                    </div>
                  </div>
                </div>

                {/* AI Explanation Button */}
                <Button
                  onClick={handleAIExplanation}
                  variant="outline"
                  className="w-full border-primary/50 hover:bg-primary/10 bg-transparent"
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  {showAIExplanation ? "Hide" : "Get"} AI Explanation
                </Button>

                {/* AI Explanation */}
                {showAIExplanation && (
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <span className="text-xs text-primary-foreground font-bold">AI</span>
                      </div>
                      <div className="text-sm leading-relaxed">
                        <p className="mb-2">Let me break this down in a simpler way:</p>
                        <p className="mb-2">{currentQ.explanation}</p>
                        <p className="text-muted-foreground italic">
                          Think of it like a seesaw - everything must balance! Just like how your personal budget needs
                          income to equal your expenses and savings.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Next Button */}
                <Button onClick={handleNext} className="w-full bg-primary hover:bg-primary/90" size="lg">
                  {currentQuestion + 1 < numQuestions ? (
                    <>
                      Next Question
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </>
                  ) : (
                    "See Results"
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Score Display */}
        <div className="max-w-3xl mx-auto mt-6 text-center">
          <p className="text-muted-foreground">
            Current Score: <span className="font-bold text-primary">{score}</span> / {answeredQuestions}
          </p>
        </div>
      </div>
    </div>
  )
}
