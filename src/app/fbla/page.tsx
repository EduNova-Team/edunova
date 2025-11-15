"use client"
import { SiteHeader } from "@/components/site-header"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Play, FileText } from "lucide-react"
import Link from "next/link"

const quizCategories = [
  {
    id: "accounting",
    title: "Accounting I",
    icon: "📊",
    description: "Fundamental accounting principles, financial statements, and basic bookkeeping concepts",
    questions: 250,
    color: "bg-primary hover:bg-primary/90",
  },
  {
    id: "personal-finance",
    title: "Personal Finance",
    icon: "💰",
    description: "Personal budgeting, investing, insurance, and financial planning concepts",
    questions: 248,
    color: "bg-secondary hover:bg-secondary/90",
  },
  {
    id: "business-management",
    title: "Business Management",
    icon: "📈",
    description: "Management principles, leadership, organizational behavior, and strategic planning",
    questions: 250,
    color: "bg-cyan-500 hover:bg-cyan-600",
  },
  {
    id: "advertising",
    title: "Advertising",
    icon: "📢",
    description: "Marketing mix, consumer behavior, market research, and promotional strategies",
    questions: 250,
    color: "bg-pink-500 hover:bg-pink-600",
  },
  {
    id: "marketing",
    title: "Marketing",
    icon: "📱",
    description: "Introductory marketing concepts, functions, research, distribution, e-commerce, and ethics",
    questions: 125,
    color: "bg-yellow-500 hover:bg-yellow-600",
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity",
    icon: "🔒",
    description: "Network security, data protection, cyber threats, and security best practices",
    questions: 249,
    color: "bg-purple-500 hover:bg-purple-600",
  },
  {
    id: "securities",
    title: "Securities & Investments",
    icon: "💹",
    description: "Competencies in securities, investments, regulation, and financial markets",
    questions: 250,
    color: "bg-green-500 hover:bg-green-600",
  },
  {
    id: "intro-it",
    title: "Introduction to IT",
    icon: "💻",
    description:
      "Introductory competencies in information technology: hardware, software, networking, security, and more",
    questions: 250,
    color: "bg-orange-500 hover:bg-orange-600",
  },
  {
    id: "financial-math",
    title: "Financial Math",
    icon: "🧮",
    description:
      "Calculations in the business world: consumer credit, payroll, taxes, investments, insurance, and more",
    questions: 200,
    color: "bg-teal-500 hover:bg-teal-600",
  },
]

export default function FBLAPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <div className="container py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Practice Quizzes</h1>
          <p className="text-muted-foreground text-lg">Questions Are Based on Updated 2025 Guidelines!</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {quizCategories.map((category) => (
            <Link key={category.id} href={`/fbla/${category.id}`}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/50 cursor-pointer group">
                <CardContent className="pt-6 pb-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-4xl">{category.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {category.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{category.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      {category.questions} Questions
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Customizable
                    </div>
                  </div>

                  <button
                    className={`w-full py-2.5 rounded-lg text-white font-medium transition-all flex items-center justify-center gap-2 ${category.color}`}
                  >
                    <Play className="w-4 h-4" />
                    Play
                  </button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
