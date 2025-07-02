"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, MessageSquare, TrendingUp, Heart, Target, AlertCircle } from "lucide-react"
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
        return "bg-green-100 text-green-800 border-green-200"
      case "negative":
        return "bg-red-100 text-red-800 border-red-200"
      case "neutral":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case "positive":
        return <TrendingUp className="h-4 w-4" />
      case "negative":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <div className="flex items-center justify-center space-x-2">
            <MessageSquare className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Customer Review Analyzer</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Analyze customer reviews to understand sentiment, emotions, and key insights using AI-powered analysis
          </p>
        </div>

        {/* Input Section */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              <span>Enter Customer Review</span>
            </CardTitle>
            <CardDescription>Paste the customer review you want to analyze for sentiment and insights</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste your customer review here..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="min-h-[120px] resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={analyzeReview}
              disabled={loading || !review.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Review...
                </>
              ) : (
                <>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Analyze Review
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        {analysis && (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Sentiment Card */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {getSentimentIcon(analysis.sentiment)}
                  <span>Sentiment Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge
                  variant="outline"
                  className={`text-sm font-medium px-3 py-1 ${getSentimentColor(analysis.sentiment)}`}
                >
                  {analysis.sentiment}
                </Badge>
              </CardContent>
            </Card>

            {/* Emotions Card */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-pink-600" />
                  <span>Detected Emotions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysis.emotions.map((emotion, index) => (
                    <Badge key={index} variant="secondary" className="bg-pink-100 text-pink-800 border-pink-200">
                      {emotion}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Main Issue Card */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  <span>Main Issue</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{analysis.mainIssue}</p>
              </CardContent>
            </Card>

            {/* Customer Wants Card */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-green-600" />
                  <span>Customer Expectations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{analysis.customerWants}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-sm text-gray-500">Powered by AI • Built with Next.js and OpenAI</p>
        </div>
      </div>
    </div>
  )
}
