"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileText, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function PDFConverterPage() {
  const [file, setFile] = useState<File | null>(null)
  const [converting, setConverting] = useState(false)
  const [converted, setConverted] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setConverted(false)
    }
  }

  const handleConvert = () => {
    if (!file) return
    setConverting(true)
    // Simulate conversion
    setTimeout(() => {
      setConverting(false)
      setConverted(true)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            Back to Platform
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="container max-w-2xl py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-500/10 mb-4">
            <Upload className="w-8 h-8 text-orange-500" />
          </div>
          <h1 className="text-3xl font-bold mb-2">DECA PDF to Digital Exam</h1>
          <p className="text-muted-foreground">
            Convert your DECA PDF study materials into interactive digital practice exams
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-8">
          <div className="space-y-6">
            {/* File Upload */}
            <div>
              <Label htmlFor="pdf-upload" className="text-base mb-2 block">
                Upload DECA PDF
              </Label>
              <div className="relative">
                <Input
                  id="pdf-upload"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                {file && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <FileText className="w-4 h-4" />
                    {file.name}
                  </div>
                )}
              </div>
            </div>

            {/* Status */}
            {converting && (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
                <div>
                  <p className="font-medium text-orange-500">Converting PDF...</p>
                  <p className="text-sm text-muted-foreground">Processing questions and answers</p>
                </div>
              </div>
            )}

            {converted && (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium text-green-500">Conversion Complete!</p>
                  <p className="text-sm text-muted-foreground">Found 45 questions ready to practice</p>
                </div>
              </div>
            )}

            {/* Convert Button */}
            <Button
              onClick={handleConvert}
              disabled={!file || converting || converted}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              size="lg"
            >
              {converting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Converting...
                </>
              ) : converted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Converted!
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Convert to Digital Exam
                </>
              )}
            </Button>

            {converted && (
              <Button variant="outline" className="w-full bg-transparent" size="lg" asChild>
                <Link href="/">View in Quiz Library</Link>
              </Button>
            )}
          </div>

          {/* Info */}
          <div className="mt-8 pt-6 border-t border-border">
            <h3 className="font-semibold mb-2">How it works:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-orange-500">1.</span>
                Upload any DECA PDF study guide or practice test
              </li>
              <li className="flex gap-2">
                <span className="text-orange-500">2.</span>
                Our AI extracts questions and creates a digital exam
              </li>
              <li className="flex gap-2">
                <span className="text-orange-500">3.</span>
                Practice with instant feedback and AI explanations
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
