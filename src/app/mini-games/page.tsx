"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ChevronDown,
  ChevronRight,
  Home,
  Search,
  Trophy,
  Gamepad2,
  BookOpen,
  Menu,
  X,
  Upload,
  Play,
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

const miniGames = [
  {
    id: "buzzword-blitz",
    title: "Buzzword Blitz",
    description: "Match business terms to their categories as fast as you can!",
    icon: "⚡",
    players: 54,
    avgTime: "4m 30s",
    highScore: 2450,
    difficulty: "Easy",
  },
  {
    id: "balance-beam",
    title: "Balance Beam",
    description: "Balance the accounting equation in this fast-paced puzzle game",
    icon: "⚖️",
    players: 32,
    avgTime: "6m 15s",
    highScore: 3200,
    difficulty: "Medium",
  },
  {
    id: "market-match",
    title: "Market Match",
    description: "Match products with their ideal target markets",
    icon: "🎯",
    players: 48,
    avgTime: "5m 00s",
    highScore: 2890,
    difficulty: "Easy",
  },
  {
    id: "finance-flow",
    title: "Finance Flow",
    description: "Navigate financial decisions to grow your business",
    icon: "💰",
    players: 67,
    avgTime: "8m 20s",
    highScore: 4100,
    difficulty: "Hard",
  },
]

export default function MiniGamesPage() {
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

          <Button variant="default" className="w-full justify-start gap-2">
            <Gamepad2 className="w-4 h-4" />
            Mini-Games
          </Button>

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

            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search mini-games..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
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

        <div className="p-4 lg:p-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Mini-Games</h1>
            <p className="text-muted-foreground text-lg">Quick, fun games to sharpen your business skills</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {miniGames.map((game) => (
              <Card
                key={game.id}
                className="hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/50 group"
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-5xl">{game.icon}</div>
                    <Badge
                      variant={
                        game.difficulty === "Easy"
                          ? "secondary"
                          : game.difficulty === "Medium"
                            ? "default"
                            : "destructive"
                      }
                    >
                      {game.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl group-hover:text-primary transition-colors">{game.title}</CardTitle>
                  <CardDescription className="text-base">{game.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                    <div>
                      <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                        <Users className="w-4 h-4" />
                      </div>
                      <div className="text-sm font-medium">{game.players}</div>
                      <div className="text-xs text-muted-foreground">Playing</div>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                        <Trophy className="w-4 h-4" />
                      </div>
                      <div className="text-sm font-medium">{game.highScore}</div>
                      <div className="text-xs text-muted-foreground">High Score</div>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                        <Star className="w-4 h-4" />
                      </div>
                      <div className="text-sm font-medium">{game.avgTime}</div>
                      <div className="text-xs text-muted-foreground">Avg. Time</div>
                    </div>
                  </div>
                  <Link href={`/mini-games/${game.id}`}>
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      <Play className="w-4 h-4 mr-2" />
                      Play Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
