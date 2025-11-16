export interface MiniGame {
  id: string
  name: string
  description: string
  image: string
  url: string
  icon?: string
  players?: number
  avgTime?: string
}

export const miniGames: MiniGame[] = [
  {
    id: "marketing-quick-race",
    name: "Marketing Quick Race",
    description:
      "Race against an AI opponent in this fast-paced marketing quiz! Choose your difficulty level, answer questions quickly, and use strategic power-ups to win. Perfect for DECA competition preparation with adaptive difficulty and comprehensive post-game analysis.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Marketing-race.png-iQ1jCLbSeKh9GkJ4EwOoOcWgWFNPDu.webp",
    url: "https://cewrcehhzcduggkd.vercel.app/",
    icon: "🏁",
  },
]


