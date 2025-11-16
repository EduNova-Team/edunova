"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { miniGames } from "@/data/mini-games"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Trophy, Clock, Zap } from "lucide-react"
import GameViewer from "@/components/GameViewer"

export default function MiniGamePage() {
  const params = useParams()
  const id = params?.id as string
  const game = miniGames.find((g) => g.id === id)

  if (!game) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold mb-2">Mini-game not found</h1>
          <p className="text-muted-foreground mb-4">Please go back and select another game.</p>
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div />
        </div>
      </header>

      {/* Banner */}
      <div className="relative w-full h-56 overflow-hidden border-b border-border bg-card">
        <img
          src={game.image}
          alt={game.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <h1 className="text-3xl font-bold text-white drop-shadow">{game.name}</h1>
          <p className="text-sm text-white/80 max-w-3xl mt-1">
            {game.description}
          </p>
        </div>
      </div>
      

      {/* Embedded game + info (reusable viewer) */}
      <div className="flex-1">
        <div className="container py-6">
          <GameViewer
            gameUrl={game.url}
            title={game.name}
            description={game.description}
            features={[
              { icon: Trophy, title: "Multiple Difficulty Levels", description: "Choose MCEC (Easy), State (Medium), or International (Hard)." },
              { icon: Clock, title: "Competitive Racing", description: "Race an AI with adaptive difficulty and real‑time tracking." },
              { icon: Zap, title: "Strategic Power‑ups", description: "Use Time Freeze, Double Score, and Skip Question to win." },
            ]}
            gameDetails={{
              questionPools: "100+ Marketing Questions",
              modes: ["10 Questions", "25 Questions", "50 Questions"],
              features: ["Real‑time Competition", "Power‑up System", "Answer Explanations", "Progress Tracking", "Post‑game Analysis", "Performance Stats"],
            }}
          />
        </div>
      </div>
    </div>
  )
}

