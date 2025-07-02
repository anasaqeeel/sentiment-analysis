"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, MessageSquare, TrendingUp, Heart, Target, AlertCircle, Sparkles } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AnalysisResult {
  sentiment: string;
  emotions: string[];
  mainIssue: string;
  customerWants: string;
}

export default function CustomerReviewAnalyzer() {
  const [review, setReview] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeReview = async () => {
    if (!review.trim()) {
      setError("Please enter a customer review to analyze");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review }),
      });

      if (!response.ok) throw new Error("Failed to analyze review");
      const result = await response.json();
      setAnalysis(result);
    } catch (err) {
      setError("Failed to analyze review. Please try again.");
      console.error("Analysis error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case "positive": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "negative": return "bg-red-50 text-red-700 border-red-200";
      case "neutral": return "bg-slate-50 text-slate-700 border-slate-200";
      default: return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case "positive": return <TrendingUp className="h-5 w-5 text-emerald-600" />;
      case "negative": return <AlertCircle className="h-5 w-5 text-red-600" />;
      default: return <Sparkles className="h-5 w-5 text-slate-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="relative max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full blur opacity-30"></div>
              <div className="relative bg-white p-3 rounded-full shadow-lg">
                <MessageSquare className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            AI Review Analyzer
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Transform customer feedback into actionable insights with advanced AI-powered sentiment analysis
          </p>
        </div>

        <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl font-semibold text-indigo-600">
              <Sparkles className="h-5 w-5" />
              Enter Customer Review
            </CardTitle>
            <CardDescription className="text-sm text-slate-500">
              Paste any customer review below and get instant AI-powered insights
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Example: The product arrived late and the packaging was damaged. I expected better quality for the price I paid..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="min-h-[120px] text-sm border-slate-200 focus:border-indigo-400 focus:ring-indigo-400 bg-white/90 backdrop-blur-sm resize-none"
            />
            <div className="text-right text-xs text-slate-400">{review.length} characters</div>

            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50 text-sm">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={analyzeReview}
              disabled={loading || !review.trim()}
              className="w-full h-10 text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Analyze Review with AI
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {analysis && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-slate-800">Analysis Results</h2>
              <p className="text-sm text-slate-500">Here's what our AI discovered</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {getSentimentIcon(analysis.sentiment)}
                    Sentiment Analysis
                  </CardTitle>
                  <CardDescription>Overall emotional tone</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge
                    variant="outline"
                    className={`text-md px-3 py-1 ${getSentimentColor(analysis.sentiment)}`}
                  >
                    {analysis.sentiment}
                  </Badge>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Heart className="h-5 w-5 text-pink-600" />
                    Detected Emotions
                  </CardTitle>
                  <CardDescription>Key emotions expressed</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {analysis.emotions.map((emotion, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-pink-50 text-pink-700 border-pink-200 text-xs px-2 py-1"
                      >
                        {emotion}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    Main Issue
                  </CardTitle>
                  <CardDescription>Core problem identified</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-700 bg-orange-50 p-3 rounded-md border border-orange-100">
                    {analysis.mainIssue}
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Target className="h-5 w-5 text-green-600" />
                    Customer Expectations
                  </CardTitle>
                  <CardDescription>What the customer wants</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-700 bg-green-50 p-3 rounded-md border border-green-100">
                    {analysis.customerWants}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        <div className="text-center mt-10 py-4 text-sm text-slate-500">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Sparkles className="h-4 w-4" />
            Powered by Advanced AI Technology
          </div>
          <p className="text-xs text-slate-400">Built with Next.js, OpenAI GPT-4, and modern web technologies</p>
        </div>
      </div>
    </div>
  );
}