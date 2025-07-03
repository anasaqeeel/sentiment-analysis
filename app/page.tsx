"use client"

import { useState } from "react"

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review }),
      })

      if (!response.ok) throw new Error("Failed to analyze review")

      const result = await response.json()
      setAnalysis(result)
    } catch (err) {
      setError("Failed to analyze review. Please try again.")
      console.error("Analysis error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Test if Tailwind is working */}
        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-white p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-2xl">
            <span className="text-3xl">🧠</span>
          </div>

          <h1 className="text-6xl font-bold text-white mb-6">AI Review Analyzer</h1>

          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Transform customer feedback into actionable insights with cutting-edge AI technology
          </p>

          <div className="flex justify-center gap-8 text-white/80">
            <div className="flex items-center gap-2">
              <span>⚡</span>
              <span>Lightning Fast</span>
            </div>
            <div className="flex items-center gap-2">
              <span>⭐</span>
              <span>AI Powered</span>
            </div>
            <div className="flex items-center gap-2">
              <span>❤️</span>
              <span>Emotion Detection</span>
            </div>
          </div>
        </div>

        {/* Input Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-3">
              <div className="bg-purple-600 p-2 rounded-lg">
                <span className="text-white text-xl">💬</span>
              </div>
              Enter Customer Review
            </h2>
            <p className="text-gray-600">Paste any customer review below and get instant AI-powered insights</p>
          </div>

          <div className="space-y-6">
            <div className="relative">
              <textarea
                placeholder="Example: The product arrived late and the packaging was damaged. I expected better quality for the price I paid..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="w-full min-h-[140px] p-4 text-base border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 rounded-xl resize-none transition-all duration-300"
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white px-2 py-1 rounded-md shadow-sm">
                {review.length} characters
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-700">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <button
              onClick={analyzeReview}
              disabled={loading || !review.trim()}
              className="w-full h-14 text-base font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="animate-spin">⏳</span>
                  Analyzing with AI...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-3">
                  <span>✨</span>
                  Analyze Review with AI
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        {analysis && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Analysis Results</h2>
              <p className="text-lg text-white/80">Here's what our AI discovered</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Sentiment */}
              <div className="bg-white rounded-2xl shadow-2xl p-6 hover:shadow-3xl hover:scale-105 transition-all duration-500">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold flex items-center gap-3">
                    <div className="bg-green-500 p-2 rounded-lg">
                      <span className="text-white">📈</span>
                    </div>
                    Sentiment Analysis
                  </h3>
                  <p className="text-gray-600">Overall emotional tone</p>
                </div>
                <div className="bg-green-500 text-white px-4 py-2 rounded-lg inline-block font-semibold">
                  {analysis.sentiment}
                </div>
              </div>

              {/* Emotions */}
              <div className="bg-white rounded-2xl shadow-2xl p-6 hover:shadow-3xl hover:scale-105 transition-all duration-500">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold flex items-center gap-3">
                    <div className="bg-pink-500 p-2 rounded-lg">
                      <span className="text-white">❤️</span>
                    </div>
                    Detected Emotions
                  </h3>
                  <p className="text-gray-600">Key emotions expressed</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {analysis.emotions.map((emotion, index) => (
                    <span key={index} className="bg-pink-100 text-pink-800 border border-pink-200 px-3 py-1 rounded-lg">
                      {emotion}
                    </span>
                  ))}
                </div>
              </div>

              {/* Main Issue */}
              <div className="bg-white rounded-2xl shadow-2xl p-6 hover:shadow-3xl hover:scale-105 transition-all duration-500">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold flex items-center gap-3">
                    <div className="bg-orange-500 p-2 rounded-lg">
                      <span className="text-white">⚠️</span>
                    </div>
                    Main Issue
                  </h3>
                  <p className="text-gray-600">Core problem identified</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                  <p className="text-gray-700">{analysis.mainIssue}</p>
                </div>
              </div>

              {/* Customer Wants */}
              <div className="bg-white rounded-2xl shadow-2xl p-6 hover:shadow-3xl hover:scale-105 transition-all duration-500">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold flex items-center gap-3">
                    <div className="bg-green-500 p-2 rounded-lg">
                      <span className="text-white">🎯</span>
                    </div>
                    Customer Expectations
                  </h3>
                  <p className="text-gray-600">What the customer wants</p>
                </div>
                <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                  <p className="text-gray-700">{analysis.customerWants}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-16 py-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span>✨</span>
            <span className="text-lg font-semibold text-white">Powered by Advanced AI Technology</span>
          </div>
          <p className="text-sm text-white/70 max-w-2xl mx-auto">
            Built with Next.js 15, OpenAI GPT-4, and modern web technologies
          </p>
        </div>
      </div>
    </div>
  )
}
