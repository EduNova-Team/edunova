"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Sparkles, CheckCircle2, XCircle, Clock, Loader2 } from 'lucide-react'
import Link from "next/link"
import { useParams, useSearchParams } from 'next/navigation'

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty?: string
  topicTags?: string[]
}

export default function QuizPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const eventId = params.eventId as string
  const eventName = eventId.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())

  const numQuestions = searchParams.get("questions") || "10"
  const timeLimit = searchParams.get("time") || "15"
  const mode = searchParams.get("mode") || "practice"
  const isTestMode = mode === "test"

  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([])
  const [showExplanation, setShowExplanation] = useState(false)
  const [showAIExplanation, setShowAIExplanation] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [reviewMode, setReviewMode] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(Number.parseInt(timeLimit) * 60)

  // Fetch questions from API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true)
        const limit = parseInt(numQuestions, 10) || 10
        const response = await fetch(`/api/questions?eventId=${eventId}&limit=${limit}&publishedOnly=true`)
        const data = await response.json()

        if (data.questions && data.questions.length > 0) {
          // Shuffle questions for variety
          const shuffled = [...data.questions].sort(() => Math.random() - 0.5)
          const selected = shuffled.slice(0, limit)
          setQuestions(selected)
          setUserAnswers(new Array(selected.length).fill(null))
        } else {
          // No questions available
          setQuestions([])
        }
      } catch (error) {
        console.error('Error fetching questions:', error)
        setQuestions([])
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [eventId, numQuestions])

  const question = questions[currentQuestion]

  useEffect(() => {
    if (!isTestMode || reviewMode || quizCompleted) return
    
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleFinishTest()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isTestMode, reviewMode, quizCompleted])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerSelect = (index: number) => {
    if (isTestMode && !reviewMode) {
      // Test mode: just store the answer
      const newAnswers = [...userAnswers]
      newAnswers[currentQuestion] = index
      setUserAnswers(newAnswers)
      setSelectedAnswer(index)
    } else {
      // Practice mode: show immediate feedback
      setSelectedAnswer(index)
      setIsCorrect(index === question.correctAnswer)
      setShowExplanation(true)
    }
  }

  const handleNextInTest = () => {
    if (currentQuestion >= questions.length - 1) {
      handleFinishTest()
      return
    }
    const nextQuestion = currentQuestion + 1
    setCurrentQuestion(nextQuestion)
    setSelectedAnswer(userAnswers[nextQuestion])
  }

  const handlePreviousInTest = () => {
    if (currentQuestion > 0) {
      const prevQuestion = currentQuestion - 1
      setCurrentQuestion(prevQuestion)
      setSelectedAnswer(userAnswers[prevQuestion])
    }
  }

  const handleFinishTest = () => {
    if (questions.length === 0) return
    setReviewMode(true)
    setCurrentQuestion(0)
    setSelectedAnswer(userAnswers[0])
    setIsCorrect(userAnswers[0] === questions[0].correctAnswer)
    setShowExplanation(true)
  }

  const handleNext = () => {
    if (currentQuestion >= questions.length - 1) {
      setQuizCompleted(true)
      return
    }
    setCurrentQuestion((prev) => prev + 1)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setShowAIExplanation(false)
    setIsCorrect(null)
  }

  const handleNextInReview = () => {
    if (currentQuestion >= questions.length - 1) {
      setQuizCompleted(true)
      return
    }
    const nextQuestion = currentQuestion + 1
    setCurrentQuestion(nextQuestion)
    setSelectedAnswer(userAnswers[nextQuestion])
    setIsCorrect(userAnswers[nextQuestion] === questions[nextQuestion].correctAnswer)
    setShowAIExplanation(false)
  }

  const handlePreviousInReview = () => {
    if (currentQuestion > 0) {
      const prevQuestion = currentQuestion - 1
      setCurrentQuestion(prevQuestion)
      setSelectedAnswer(userAnswers[prevQuestion])
      setIsCorrect(userAnswers[prevQuestion] === questions[prevQuestion].correctAnswer)
      setShowAIExplanation(false)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
      setShowAIExplanation(false)
      setIsCorrect(null)
    }
  }

  const calculateScore = () => {
    let correct = 0
    userAnswers.forEach((answer, index) => {
      if (answer === questions[index]?.correctAnswer) {
        correct++
      }
    })
    return { correct, total: questions.length, percentage: (correct / questions.length) * 100 }
  }

  if (quizCompleted) {
    const score = isTestMode ? calculateScore() : null
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="border-b border-border bg-card">
          <div className="container py-4">
            <Link
              href={`/event/${eventId}`}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Event
            </Link>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <Card className="p-8 text-center max-w-md">
            <div className="mb-6">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Quiz Completed!</h2>
              <p className="text-muted-foreground mb-4">Great job completing {eventName}!</p>
              {score && (
                <div className="text-center p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-3xl font-bold text-primary mb-1">{score.percentage.toFixed(0)}%</p>
                  <p className="text-sm text-muted-foreground">
                    {score.correct} out of {score.total} correct
                  </p>
                </div>
              )}
            </div>
            <div className="space-y-3">
              <Button className="w-full bg-primary hover:bg-primary/90" asChild>
                <Link href={`/event/${eventId}`}>Take Another Quiz</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/">Back to Dashboard</Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading questions...</p>
          </div>
        </Card>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <XCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Questions Available</h2>
          <p className="text-muted-foreground mb-4">
            There are no published questions for this event yet. Please check back later.
          </p>
          <Button variant="outline" asChild>
            <Link href={`/event/${eventId}`}>Back to Event</Link>
          </Button>
        </Card>
      </div>
    )
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8">
          <p className="text-muted-foreground">Loading question...</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Link
              href={`/event/${eventId}`}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Exit Quiz
            </Link>
            <div className="flex items-center gap-4">
              {isTestMode && !reviewMode && (
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Clock className="w-4 h-4" />
                  <span className={timeRemaining < 60 ? "text-red-500" : ""}>
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="border-b border-border">
        <div className="container py-4 flex justify-center">
          <div className="w-full max-w-3xl">
            <Progress value={((currentQuestion + 1) / questions.length) * 100} className="h-2" />
          </div>
        </div>
      </div>

      {/* Quiz Content */}
      <div className="flex-1 flex items-center justify-center py-12">
        <div className="container max-w-3xl mx-auto px-4">
          <Card className="p-8 mx-auto">
            {reviewMode && (
              <div className="mb-4 p-3 rounded-lg bg-primary/10 border border-primary/20 text-center">
                <p className="text-sm font-medium">Review Mode - See answers and explanations</p>
              </div>
            )}
            
            <h2 className="text-xl font-semibold mb-6 text-center">{question.question}</h2>

            <div className="space-y-3">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === index
                const isCorrect = index === question.correctAnswer
                const showFeedback = reviewMode || showExplanation
                
                let buttonClasses = "w-full justify-start text-left h-auto py-4 px-6 transition-all "
                
                if (isSelected) {
                  if (showFeedback) {
                    buttonClasses += isCorrect
                      ? "!border-green-500 !bg-green-500/20 hover:!bg-green-500/30"
                      : "!border-red-500 !bg-red-500/20 hover:!bg-red-500/30"
                  } else {
                    // Selected but not in review - show blue
                    buttonClasses += "!border-blue-500 !bg-blue-500/20 hover:!bg-blue-500/30 !text-foreground"
                  }
                } else {
                  // Not selected - normal hover state
                  buttonClasses += "hover:!border-blue-500/50 hover:!bg-blue-500/10"
                  if (showFeedback && isCorrect) {
                    buttonClasses += " !border-green-500 !bg-green-500/20"
                  }
                }
                
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className={buttonClasses}
                    onClick={() => !reviewMode && !showExplanation && handleAnswerSelect(index)}
                    disabled={reviewMode || showExplanation}
                  >
                    <span className="flex-1">{option}</span>
                    {showFeedback && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    )}
                    {isSelected && showFeedback && !isCorrect && (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </Button>
                )
              })}
            </div>

            {(reviewMode || showExplanation) && (
              <div className="mt-8 space-y-4">
                <div
                  className={`p-4 rounded-lg ${
                    selectedAnswer === question.correctAnswer
                      ? "bg-green-500/10 border border-green-500/20"
                      : "bg-red-500/10 border border-red-500/20"
                  }`}
                >
                  <p className="font-semibold mb-2">
                    {selectedAnswer === question.correctAnswer ? "Correct!" : "Incorrect"}
                  </p>
                  <p className="text-sm text-muted-foreground">{question.explanation}</p>
                </div>

                {/* AI Explanation Button */}
                {!showAIExplanation ? (
                  <Button
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary/10 bg-transparent"
                    onClick={() => setShowAIExplanation(true)}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Get AI Explanation
                  </Button>
                ) : (
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex items-start gap-2 mb-2">
                      <Sparkles className="w-5 h-5 text-primary mt-0.5" />
                      <h3 className="font-semibold">AI Tutor Explanation</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Let me break this down for you! A balance sheet is like a financial selfie of your business. On one
                      side, you have what you own (assets like cash, equipment). On the other side, you have what you owe
                      (liabilities like loans) plus owner's equity. They always balance out: Assets = Liabilities +
                      Equity.
                      <br />
                      <br />
                      <strong>Example:</strong> Your lemonade stand has $100 cash and a $50 cooler (assets = $150). You
                      borrowed $30 from your friend (liability) and put in $120 of your own money (equity). See how $150 =
                      $30 + $120? That's a balance sheet!
                    </p>
                  </div>
                )}

                {reviewMode && (
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={handlePreviousInReview}
                      disabled={currentQuestion === 0}
                    >
                      Previous
                    </Button>
                    <Button className="flex-1 bg-primary hover:bg-primary/90" onClick={handleNextInReview}>
                      {currentQuestion < questions.length - 1 ? "Next Question" : "View Final Score"}
                    </Button>
                  </div>
                )}

                {!reviewMode && !isTestMode && (
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={handlePrevious}
                      disabled={currentQuestion === 0}
                    >
                      Previous
                    </Button>
                    <Button className="flex-1 bg-primary hover:bg-primary/90" onClick={handleNext}>
                      {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Quiz"}
                    </Button>
                  </div>
                )}
              </div>
            )}

            {isTestMode && !reviewMode && (
              <div className="mt-8 flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handlePreviousInTest}
                  disabled={currentQuestion === 0}
                >
                  Previous
                </Button>
                {currentQuestion < questions.length - 1 ? (
                  <Button className="flex-1 bg-primary hover:bg-primary/90" onClick={handleNextInTest}>
                    Next
                  </Button>
                ) : (
                  <Button className="flex-1 bg-orange-500 hover:bg-orange-600" onClick={handleFinishTest}>
                    Finish Test
                  </Button>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
