"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, MessageSquare, TrendingUp, Heart, Target, AlertCircle, Sparkles, BarChart3 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AnalysisResult {
  sentiment: string
  emotions: string[]
  mainIssue: string
  customerWants: string
}

export default function CustomerReviewAnalyzer() {
  const [review, setReview] = useState("")
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const analyzeReview = async () => {
    if (!review.trim()) {
      setError("Please enter a customer review to analyze")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ review }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze review")
      }

      const result = await response.json()
      setAnalysis(result)
    } catch (err) {
      setError("Failed to analyze review. Please try again.")
      console.error("Analysis error:", err)
    } finally {
      setLoading(false)
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case "positive":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "negative":
        return "bg-red-50 text-red-700 border-red-200"
      case "neutral":
        return "bg-slate-50 text-slate-700 border-slate-200"
      default:
        return "bg-blue-50 text-blue-700 border-blue-200"
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case "positive":
        return <TrendingUp className="h-5 w-5 text-emerald-600" />
      case "negative":
        return <AlertCircle className="h-5 w-5 text-red-600" />
      default:
        return <BarChart3 className="h-5 w-5 text-slate-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="relative max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full blur opacity-30"></div>
              <div className="relative bg-white p-3 rounded-full shadow-lg">
                <MessageSquare className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            AI Review Analyzer
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Transform customer feedback into actionable insights with advanced AI-powered sentiment analysis
          </p>
        </div>

        <Card className="mb-8 shadow-xl border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Sparkles className="h-6 w-6 text-indigo-600" />
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Enter Customer Review
              </span>
            </CardTitle>
            <CardDescription className="text-base text-slate-600">
              Paste any customer review below and get instant AI-powered insights about sentiment, emotions, and key
              concerns
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative">
              <Textarea
                placeholder="Example: The product arrived late and the packaging was damaged. I expected better quality for the price I paid..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="min-h-[140px] text-base border-slate-200 focus:border-indigo-400 focus:ring-indigo-400 bg-white/80 backdrop-blur-sm resize-none"
              />
              <div className="absolute bottom-3 right-3 text-xs text-slate-400">{review.length} characters</div>
            </div>

            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={analyzeReview}
              disabled={loading || !review.trim()}
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                  Analyzing Review...
                </>
              ) : (
                <>
                  <Sparkles className="mr-3 h-5 w-5" />
                  Analyze Review with AI
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {analysis && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Analysis Results</h2>
              <p className="text-slate-600">Here's what our AI discovered about this review</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    {getSentimentIcon(analysis.sentiment)}
                    <span>Sentiment Analysis</span>
                  </CardTitle>
                  <CardDescription>Overall emotional tone of the review</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge
                    variant="outline"
                    className={`text-lg font-semibold px-4 py-2 shadow-sm ${getSentimentColor(analysis.sentiment)}`}
                  >
                    {analysis.sentiment}
                  </Badge>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Heart className="h-5 w-5 text-pink-600" />
                    <span>Detected Emotions</span>
                  </CardTitle>
                  <CardDescription>Key emotions expressed in the review</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {analysis.emotions.map((emotion, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-pink-50 text-pink-700 border-pink-200 px-3 py-1 text-sm font-medium shadow-sm"
                      >
                        {emotion}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    <span>Main Issue</span>
                  </CardTitle>
                  <CardDescription>Core problem identified in the review</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 leading-relaxed text-base bg-orange-50 p-4 rounded-lg border border-orange-100">
                    {analysis.mainIssue}
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Target className="h-5 w-5 text-green-600" />
                    <span>Customer Expectations</span>
                  </CardTitle>
                  <CardDescription>What the customer wants or expects</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 leading-relaxed text-base bg-green-50 p-4 rounded-lg border border-green-100">
                    {analysis.customerWants}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        <div className="text-center mt-16 py-8">
          <div className="flex items-center justify-center gap-2 text-slate-500 mb-2">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Powered by Advanced AI Technology</span>
          </div>
          <p className="text-xs text-slate-400">Built with Next.js, OpenAI GPT-4, and modern web technologies</p>
        </div>
      </div>
    </div>
  )
}
