import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google"
import "./globals.css"
import { SiteHeader } from "@/components/site-header"

const fontSans = Inter({ subsets: ["latin"], variable: "--font-sans" })
const fontMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" })
const fontSpace = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" })

export const metadata: Metadata = {
  title: "EduNova Games - DECA & FBLA Study Platform",
  description: "Master DECA and FBLA through interactive quizzes, mini-games, and AI-powered explanations",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${fontMono.variable} ${fontSpace.variable} dark`}>
      <body className={`font-sans antialiased ${fontSans.variable} bg-[#0A0A16] text-white min-h-screen flex flex-col`}>
        <SiteHeader />
        {children}
      </body>
    </html>
  )
}
