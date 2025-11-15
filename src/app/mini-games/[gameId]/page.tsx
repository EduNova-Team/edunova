"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ChevronDown,
  ChevronRight,
  Home,
  Trophy,
  Gamepad2,
  BookOpen,
  Menu,
  X,
  Upload,
  ArrowLeft,
  Clock,
  Users,
  Star,
} from "lucide-react"
import Link from "next/link"

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

const careerClusters = [
  { name: "Business Management & Administration", color: "bg-yellow-500" },
  { name: "Marketing", color: "bg-pink-500" },
  { name: "Entrepreneurship", color: "bg-gray-500" },
  { name: "Hospitality & Tourism", color: "bg-blue-500" },
  { name: "Finance", color: "bg-green-500" },
]

export default function BuzzwordBlitzGame() {
  const [decaOpen, setDecaOpen] = useState(false)
  const [fblaOpen, setFblaOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

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

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link href="/">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Home className="w-4 h-4" />
              All Events
            </Button>
          </Link>

          <div>
            <Button variant="ghost" className="w-full justify-between" onClick={() => setDecaOpen(!decaOpen)}>
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

          <div>
            <Button variant="ghost" className="w-full justify-between" onClick={() => setFblaOpen(!fblaOpen)}>
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

          <Link href="/mini-games">
            <Button variant="default" className="w-full justify-start gap-2">
              <Gamepad2 className="w-4 h-4" />
              Mini-Games
            </Button>
          </Link>

          <div className="pt-4 border-t border-border mt-4">
            <Link href="/pdf-converter">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-orange-500 hover:text-orange-600 hover:bg-orange-500/10"
              >
                <Upload className="w-4 h-4" />
                PDF to Exam
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground px-2 mt-2">Convert DECA PDFs into digital practice exams</p>
          </div>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 bg-card border-b border-border px-4 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>

            <Link
              href="/mini-games"
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Mini-Games
            </Link>

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

        <div className="p-4 lg:p-8">
          <div className="grid lg:grid-cols-[1fr,300px] gap-6">
            <Card className="bg-white text-black min-h-[600px] flex items-center justify-center">
              <CardContent className="text-center max-w-md mx-auto py-12">
                <h1 className="text-4xl font-bold mb-6">Buzzword Blitz</h1>
                <p className="text-xl mb-8">Select a Career Cluster!</p>

                <div className="space-y-3">
                  {careerClusters.map((cluster, index) => (
                    <button
                      key={index}
                      className={`w-full py-3 px-4 rounded-lg ${cluster.color} hover:opacity-90 text-white font-medium transition-all`}
                    >
                      {cluster.name}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="bg-card border-border">
                <CardContent className="pt-6 pb-6">
                  <h3 className="font-semibold mb-4">Game Stats</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">High Score</div>
                        <div className="font-semibold">2,450 pts</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                        <Users className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Total Players</div>
                        <div className="font-semibold">80</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Avg. Completion</div>
                        <div className="font-semibold">4m 30s</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="pt-6 pb-6">
                  <h3 className="font-semibold mb-4">Player Reviews</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">Tyler B.</span>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Great way to practice marketing concepts! The time pressure makes it exciting.
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">Nathan</span>
                        <div className="flex gap-0.5">
                          {[...Array(4)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Really helpful for competition prep. Would love more questions!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="pt-6 pb-6">
                  <h3 className="font-semibold mb-4">You Might Also Like</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer">
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-2xl">🧩</div>
                      <div>
                        <div className="font-medium text-sm">Puzzle Quest</div>
                        <div className="text-xs text-muted-foreground">62 playing</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer">
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-2xl">⚡</div>
                      <div>
                        <div className="font-medium text-sm">Buzzword Blitz</div>
                        <div className="text-xs text-muted-foreground">54 playing</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
