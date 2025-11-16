"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Maximize2 } from "lucide-react"

interface GameFeature {
  icon?: React.ComponentType<{ className?: string }>
  title: string
  description: string
}

interface GameDetails {
  questionPools?: string
  modes?: string[]
  features?: string[]
}

interface GameViewerProps {
  gameUrl: string
  title: string
  description: string
  features?: GameFeature[]
  gameDetails?: GameDetails
}

export default function GameViewer({
  gameUrl,
  title,
  description,
  features,
  gameDetails,
}: GameViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const toggleFullscreen = async () => {
    try {
      const el = document.getElementById("embedded-game")
      if (!el) return
      if (!document.fullscreenElement) {
        await el.requestFullscreen()
        setIsFullscreen(true)
      } else {
        await document.exitFullscreen()
        setIsFullscreen(false)
      }
    } catch (err) {
      console.error("Fullscreen toggle failed:", err)
    }
  }

  return (
    <div className="space-y-8">
      {/* Game viewport */}
      <div
        id="embedded-game"
        className="relative mx-auto w-full max-w-6xl rounded-xl overflow-hidden border border-border bg-black"
        style={{ aspectRatio: "16 / 9" }}
      >
        <iframe
          src={gameUrl}
          title={title}
          className="absolute inset-0 w-full h-full"
          loading="eager"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        />
        <Button
          onClick={toggleFullscreen}
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white"
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Text content */}
      <div className="container px-0 max-w-6xl mx-auto space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">{title}</h2>
          <p className="text-muted-foreground max-w-4xl">{description}</p>
        </div>

        {features && features.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <div key={i} className="rounded-lg border border-border bg-card p-5">
                  {Icon ? (
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-xl mb-3">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-xl mb-3">•</div>
                  )}
                  <h3 className="font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.description}</p>
                </div>
              )
            })}
          </div>
        )}

        {gameDetails && (
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-lg font-semibold mb-6">Game Details</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                {gameDetails.questionPools && (
                  <>
                    <p className="text-sm text-muted-foreground mb-1">Question Pool</p>
                    <p className="font-semibold mb-6">{gameDetails.questionPools}</p>
                  </>
                )}
                {gameDetails.features && gameDetails.features.length > 0 && (
                  <>
                    <h4 className="font-semibold mb-3">Features</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {gameDetails.features.map((feat, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="text-primary">•</span> {feat}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
              <div>
                {gameDetails.modes && gameDetails.modes.length > 0 && (
                  <>
                    <p className="text-sm text-muted-foreground mb-1">Game Modes</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {gameDetails.modes.map((m, i) => (
                        <span key={i} className="px-3 py-1 rounded-full border border-border text-xs">
                          {m}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


