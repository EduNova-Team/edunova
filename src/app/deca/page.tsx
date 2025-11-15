import { SiteHeader } from "@/components/site-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, DollarSign, Users, Briefcase, Target, BookOpen } from "lucide-react"

export default function DECAPage() {
  const decaCategories = [
    {
      title: "Business Management & Administration",
      icon: Briefcase,
      color: "from-purple-500 to-purple-600",
      tests: 8,
    },
    {
      title: "Marketing",
      icon: TrendingUp,
      color: "from-blue-500 to-cyan-500",
      tests: 12,
    },
    {
      title: "Finance",
      icon: DollarSign,
      color: "from-yellow-500 to-orange-500",
      tests: 10,
    },
    {
      title: "Hospitality & Tourism",
      icon: Users,
      color: "from-pink-500 to-rose-500",
      tests: 6,
    },
  ]

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">DECA Practice Tests</h1>
            <p className="text-lg text-muted-foreground">
              Prepare for your DECA competition with targeted practice tests
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {decaCategories.map((category, i) => (
              <Card
                key={i}
                className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50"
              >
                <div className={`h-2 bg-gradient-to-r ${category.color}`} />
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${category.color} mb-4`}>
                      <category.icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="secondary">{category.tests} Tests</Badge>
                  </div>
                  <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                    {category.title}
                  </CardTitle>
                  <CardDescription>Practice with real DECA-style questions</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground">
                    <Target className="w-4 h-4 mr-2" />
                    Start Practice
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Study Resources */}
          <Card className="mt-8 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Study Resources
              </CardTitle>
              <CardDescription>Additional materials to help you succeed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                📚 DECA Exam Guides
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                📊 Performance Indicators
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                🎯 Sample Roleplay Scenarios
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                💡 Test-Taking Strategies
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
