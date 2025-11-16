"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronDown, ChevronRight, Home, Search, Trophy, Gamepad2, BookOpen, Clock, Users, Sparkles, Menu, X, Upload, Settings, Loader2 } from 'lucide-react'
import Link from "next/link"
import { miniGames } from "@/data/mini-games"

const EVENT_COVER_IMAGE = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/video-marketing-7579808_1920-WDCR18pHxNlpDfNO7UQAZl5xBBCbfv.png"

const decaEvents = [
  "Accounting Applications",
  "Business Finance Series",
  "Business Law & Ethics",
  "Business Management & Administration",
  "Entrepreneurship",
  "Hospitality & Tourism",
  "Human Resources Management",
  "Marketing Management",
  "Principles of Finance",
  "Retail Merchandising",
]

const fblaEvents = [
  "Accounting I",
  "Banking & Financial Systems",
  "Business Communication",
  "Business Law",
  "Business Management",
  "Computer Applications",
  "Cyber Security",
  "Digital Marketing",
  "Economics",
  "Entrepreneurship",
  "Introduction to Business",
  "Marketing",
]

// miniGames now imported from @/data/mini-games

// Color mapping for events (you can customize this)
const getEventColor = (eventName: string, organization: string): string => {
  const colors: Record<string, string> = {
    "Accounting": "bg-blue-500",
    "Marketing": "bg-pink-500",
    "Business Management": "bg-cyan-500",
    "Finance": "bg-green-500",
    "Entrepreneurship": "bg-yellow-500",
    "Hospitality": "bg-blue-500",
    "Advertising": "bg-pink-500",
    "Cybersecurity": "bg-purple-500",
    "Securities": "bg-green-500",
  }
  
  // Try to match by keywords
  for (const [key, color] of Object.entries(colors)) {
    if (eventName.toLowerCase().includes(key.toLowerCase())) {
      return color
    }
  }
  
  // Default colors by organization
  if (organization === "DECA") return "bg-purple-500"
  if (organization === "FBLA") return "bg-blue-500"
  return "bg-gray-500"
}

interface Event {
  id: string
  name: string
  organization: "DECA" | "FBLA" | "Both"
  slug: string
  image_url?: string | null
}

export default function PlatformPage() {
  const [decaOpen, setDecaOpen] = useState(false)
  const [fblaOpen, setFblaOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<"All" | "DECA" | "FBLA" | "Both" | "Mini-Games">("All")
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch events from Supabase
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        // Add timestamp to bust cache
        const timestamp = new Date().getTime()
        const response = await fetch(`/api/events?organization=All&_t=${timestamp}`, {
          cache: 'no-store',
        })
        const data = await response.json()
        if (data.events) {
          setEvents(data.events)
        }
      } catch (error) {
        console.error('Error fetching events:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()

    // Refetch when page becomes visible (useful after updating images in admin)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchEvents()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  // Transform events to quiz format
  const allQuizzes = events.map((event) => ({
    id: event.id,
    name: event.name,
    type: event.organization,
    color: getEventColor(event.name, event.organization),
    image: event.image_url || EVENT_COVER_IMAGE, // Use event's custom image or fallback to default
    slug: event.slug,
  }))

  const filteredQuizzes = allQuizzes.filter((quiz) => {
    const matchesSearch = quiz.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter =
      filterType === "All" ||
      quiz.type === filterType ||
      (filterType === "DECA" && (quiz.type === "DECA" || quiz.type === "Both")) ||
      (filterType === "FBLA" && (quiz.type === "FBLA" || quiz.type === "Both"))
    return matchesSearch && matchesFilter
  })

  const decaQuizzes = filteredQuizzes.filter((quiz) => quiz.type === "DECA" || quiz.type === "Both")
  const fblaQuizzes = filteredQuizzes.filter((quiz) => quiz.type === "FBLA" || quiz.type === "Both")

  const showMiniGames = filterType === "All" || filterType === "Mini-Games"

  return (
    <div className="flex h-screen bg-background">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 border-r border-border bg-card flex flex-col
        transform transition-transform lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl">🎓</div>
            <span className="text-xl font-bold">
              <span className="text-primary">Edu</span>
              <span className="text-secondary">Nova</span>
            </span>
          </Link>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => setFilterType("All")}>
            <Home className="w-4 h-4" />
            All Events
          </Button>

          {/* DECA Section */}
          <div>
            <Button
              variant="ghost"
              className="w-full justify-between"
              onClick={() => {
                setDecaOpen(!decaOpen)
                setFilterType("DECA")
              }}
            >
              <span className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                DECA
              </span>
              {decaOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
            {decaOpen && (
              <div className="ml-6 mt-1 space-y-1">
                {decaEvents.map((event) => (
                  <Link key={event} href={`/event/${event.toLowerCase().replace(/\s+/g, "-")}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-xs text-muted-foreground hover:text-foreground"
                    >
                      {event}
                    </Button>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* FBLA Section */}
          <div>
            <Button
              variant="ghost"
              className="w-full justify-between"
              onClick={() => {
                setFblaOpen(!fblaOpen)
                setFilterType("FBLA")
              }}
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                FBLA
              </span>
              {fblaOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
            {fblaOpen && (
              <div className="ml-6 mt-1 space-y-1">
                {fblaEvents.map((event) => (
                  <Link key={event} href={`/event/${event.toLowerCase().replace(/\s+/g, "-")}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-xs text-muted-foreground hover:text-foreground"
                    >
                      {event}
                    </Button>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Mini-Games */}
          <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => setFilterType("Mini-Games")}>
            <Gamepad2 className="w-4 h-4" />
            Mini-Games
          </Button>

          <div className="pt-4 border-t border-border mt-4 space-y-2">
            <Link href="/pdf-converter">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-orange-500 hover:text-orange-600 hover:bg-orange-500/10"
              >
                <Upload className="w-4 h-4" />
                PDF to Exam
              </Button>
            </Link>
            <Link href="/admin">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-purple-500 hover:text-purple-600 hover:bg-purple-500/10"
              >
                <Settings className="w-4 h-4" />
                Admin Dashboard
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground px-2 mt-2">Convert DECA PDFs into digital practice exams</p>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 bg-card border-b border-border px-4 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>

            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search events or games..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter buttons - hidden on mobile */}
            <div className="hidden md:flex gap-2">
              <Button
                variant={filterType === "All" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("All")}
              >
                All
              </Button>
              <Button
                variant={filterType === "DECA" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("DECA")}
              >
                DECA
              </Button>
              <Button
                variant={filterType === "FBLA" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("FBLA")}
              >
                FBLA
              </Button>
              <Button
                variant={filterType === "Mini-Games" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("Mini-Games")}
              >
                Mini-Games
              </Button>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button size="sm" className="bg-primary hover:bg-primary/90" asChild>
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 lg:p-8">
          {/* Mini-Games Section */}
          {showMiniGames && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Mini-Games</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {miniGames.map((game) => (
                  <Link key={game.id} href={`/mini-games/${game.id}`}>
                    <div className="group rounded-lg bg-card border border-border hover:border-primary transition-all cursor-pointer overflow-hidden">
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={game.image || "/placeholder.svg"}
                          alt={game.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute top-2 left-2 text-3xl">{game.icon}</div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                          {game.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">{game.description}</p>
                        {(game.players || game.avgTime) && (
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            {typeof game.players === "number" && (
                              <div className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {game.players}
                              </div>
                            )}
                            {game.avgTime && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {game.avgTime}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {!loading && filterType !== "Mini-Games" && (
            <>
              {/* DECA Practice Quizzes */}
              {(filterType === "All" || filterType === "DECA") && decaQuizzes.length > 0 && (
                <section className="mb-12">
                  <h2 className="text-2xl font-bold mb-2">DECA Practice Quizzes</h2>
                  <p className="text-muted-foreground mb-6">Questions are based on updated 2025 guidelines!</p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {decaQuizzes.map((quiz) => (
                      <Link key={quiz.id || quiz.name} href={`/event/${quiz.slug || quiz.name.toLowerCase().replace(/\s+/g, "-")}`}>
                        <div className="group rounded-lg bg-card border border-border hover:border-primary transition-all cursor-pointer overflow-hidden">
                          {/* Quiz Image */}
                          <div className="relative h-40 overflow-hidden">
                            <img
                              src={quiz.image || "/placeholder.svg"}
                              alt={quiz.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <span className="absolute top-2 right-2 text-xs px-2 py-1 rounded bg-black/50 backdrop-blur-sm text-white">
                              {quiz.type}
                            </span>
                          </div>

                          {/* Quiz Info */}
                          <div className="p-4">
                            <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                              {quiz.name}
                            </h3>
                            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                              <span className="flex items-center gap-1">
                                <BookOpen className="w-3 h-3" />
                                1000 Questions
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Customizable
                              </span>
                            </div>
                            <Button className={`w-full ${quiz.color} hover:opacity-90 text-white`}>
                              <Sparkles className="w-4 h-4 mr-2" />
                              Start
                            </Button>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* FBLA Practice Quizzes */}
              {(filterType === "All" || filterType === "FBLA") && fblaQuizzes.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold mb-2">FBLA Practice Quizzes</h2>
                  <p className="text-muted-foreground mb-6">Questions are based on updated 2025 guidelines!</p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {fblaQuizzes.map((quiz) => (
                      <Link key={quiz.id || quiz.name} href={`/event/${quiz.slug || quiz.name.toLowerCase().replace(/\s+/g, "-")}`}>
                        <div className="group rounded-lg bg-card border border-border hover:border-primary transition-all cursor-pointer overflow-hidden">
                          {/* Quiz Image */}
                          <div className="relative h-40 overflow-hidden">
                            <img
                              src={quiz.image || "/placeholder.svg"}
                              alt={quiz.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <span className="absolute top-2 right-2 text-xs px-2 py-1 rounded bg-black/50 backdrop-blur-sm text-white">
                              {quiz.type}
                            </span>
                          </div>

                          {/* Quiz Info */}
                          <div className="p-4">
                            <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                              {quiz.name}
                            </h3>
                            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                              <span className="flex items-center gap-1">
                                <BookOpen className="w-3 h-3" />
                                1000 Questions
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Customizable
                              </span>
                            </div>
                            <Button className={`w-full ${quiz.color} hover:opacity-90 text-white`}>
                              <Sparkles className="w-4 h-4 mr-2" />
                              Start
                            </Button>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
