import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, TrendingUp, DollarSign, Users, Briefcase, Zap, Trophy, Clock, BarChart3 } from "lucide-react"

export default function GamesPage() {
  const allGames = [
    {
      title: "Marketing Mix Master",
      description: "Match products with the perfect marketing strategy using the 4 Ps",
      category: "Marketing",
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600",
      difficulty: "Medium",
      time: "5 min",
      xp: 250,
      players: "2.3K",
    },
    {
      title: "Budget Balancer",
      description: "Manage company finances and keep the budget in check",
      category: "Finance",
      icon: DollarSign,
      color: "from-yellow-500 to-orange-500",
      difficulty: "Hard",
      time: "10 min",
      xp: 500,
      players: "1.8K",
    },
    {
      title: "HR Hero",
      description: "Hire, train, and manage the perfect team",
      category: "Management",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      difficulty: "Medium",
      time: "7 min",
      xp: 300,
      players: "1.5K",
    },
    {
      title: "Startup Sprint",
      description: "Launch and grow a startup from idea to IPO",
      category: "Entrepreneurship",
      icon: Briefcase,
      color: "from-pink-500 to-rose-500",
      difficulty: "Hard",
      time: "15 min",
      xp: 750,
      players: "3.1K",
    },
    {
      title: "Price Point Pro",
      description: "Set the perfect price to maximize profit",
      category: "Finance",
      icon: DollarSign,
      color: "from-yellow-500 to-orange-500",
      difficulty: "Easy",
      time: "3 min",
      xp: 150,
      players: "4.2K",
    },
    {
      title: "Brand Builder",
      description: "Create a memorable brand identity",
      category: "Marketing",
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600",
      difficulty: "Medium",
      time: "8 min",
      xp: 350,
      players: "2.7K",
    },
  ]

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">All Games</h1>
          <p className="text-lg text-muted-foreground mb-6">Choose from 45+ games to master business concepts</p>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input placeholder="Search games..." className="pl-10 h-12" />
          </div>
        </div>

        {/* Filter Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
            All Games
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
            Marketing
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
            Finance
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
            Management
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
            Entrepreneurship
          </Badge>
        </div>

        {/* Games Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allGames.map((game, i) => (
            <Card
              key={i}
              className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50"
            >
              <CardHeader>
                <div
                  className={`w-full h-40 bg-gradient-to-br ${game.color} rounded-lg mb-4 flex items-center justify-center`}
                >
                  <game.icon className="w-16 h-16 text-white" />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">{game.category}</Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="w-3 h-3" />
                    {game.players}
                  </div>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">{game.title}</CardTitle>
                <CardDescription>{game.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <BarChart3 className="w-4 h-4" />
                    {game.difficulty}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {game.time}
                  </div>
                  <div className="flex items-center gap-1 text-accent font-medium">
                    <Trophy className="w-4 h-4" />
                    {game.xp} XP
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground">
                  <Zap className="w-4 h-4 mr-2" />
                  Play Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
