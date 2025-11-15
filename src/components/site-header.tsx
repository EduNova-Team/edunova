import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">
              <span className="text-primary">Edu</span>
              <span className="text-secondary">Nova</span>
              <span className="text-muted-foreground ml-1">Games</span>
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            Home
          </Link>
          <Link
            href="/mini-games"
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            Mini-Games
          </Link>
          <Link href="/fbla" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            FBLA
          </Link>
          <Link
            href="/services"
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            Services
          </Link>
          <Link
            href="/research"
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            Research
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm">
            Sign In
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  )
}
