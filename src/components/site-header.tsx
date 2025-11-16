"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  // Keep header navigation minimal: Home only
  const nav = [{ href: "/", label: "Home" }]
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0D1224]/80 backdrop-blur supports-[backdrop-filter]:bg-[#0D1224]/70">
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr]">
          <Link href="/" className="flex items-center gap-3 shrink-0">
          <div className="relative h-8 w-8">
            <Image src="/logo.png" alt="EduNova Games Logo" fill className="object-contain" priority />
          </div>
          <span className="text-xl font-bold font-mono">
            <span className="text-white">Edu</span>
            <span className="text-muted-foreground">Nova</span>
            <span className="text-white ml-1">Games</span>
          </span>
          </Link>

          <nav className="hidden md:flex items-center justify-center gap-8 font-mono text-[0.95rem]">
            {nav.map(({ href, label }) => {
              const active = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  data-active={active}
                  className="group relative px-1 py-1 text-foreground/80 hover:text-foreground transition-colors rounded-md hover:bg-white/5"
                >
                  {label}
                  <span className="pointer-events-none absolute -bottom-1.5 left-2 h-0.5 w-0 opacity-0 transition-[width,opacity] duration-300 group-hover:w-7 group-hover:opacity-100 data-[active=true]:w-10 data-[active=true]:opacity-100 bg-gradient-to-r from-[#6EA0FF] to-[#27E0FF] rounded-full" />
                  <span className="pointer-events-none absolute -bottom-2 left-2 h-1.5 w-0 opacity-0 blur-md transition-[width,opacity] duration-300 group-hover:w-10 group-hover:opacity-40 data-[active=true]:w-12 data-[active=true]:opacity-40 bg-gradient-to-r from-[#6EA0FF] to-[#27E0FF] rounded-full" />
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center justify-end gap-4 shrink-0">
            <div className="hidden md:flex items-center gap-4">
              <Button variant="ghost" size="sm">Sign In</Button>
              <Button size="sm" className="rounded-full bg-gradient-to-r from-[#6EA0FF] to-[#27E0FF] text-black hover:from-[#6EA0FF]/90 hover:to-[#27E0FF]/90">
                Get Started
              </Button>
            </div>
            <button
              onClick={() => setIsMobileOpen((v) => !v)}
              className="md:hidden flex flex-col justify-center items-center w-7 h-7 space-y-1.5"
              aria-label="Toggle navigation"
            >
              <span className={`block h-0.5 w-6 bg-white transition-transform ${isMobileOpen ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`block h-0.5 w-6 bg-white transition-opacity ${isMobileOpen ? "opacity-0" : "opacity-100"}`} />
              <span className={`block h-0.5 w-6 bg-white transition-transform ${isMobileOpen ? "-translate-y-2 -rotate-45" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {isMobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0D1224]/95 backdrop-blur">
          <nav className="container py-4 space-y-2">
            {nav.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsMobileOpen(false)}
                className="block px-2 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-md transition-colors"
              >
                {label}
              </Link>
            ))}
            <div className="pt-3 flex items-center gap-3">
              <Button variant="outline" className="flex-1 border-white/20 hover:bg-white/5 text-white/90">Sign In</Button>
              <Button className="flex-1 bg-gradient-to-r from-[#6EA0FF] to-[#27E0FF] text-black hover:opacity-90">
                Get Started
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
