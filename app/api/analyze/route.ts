import { type NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

export async function POST(request: NextRequest) {
  try {
    // Explicitly check for API key
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error("OpenAI API key is missing from environment variables");
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 }
      );
    }

    const { review } = await request.json();

    if (!review || typeof review !== "string") {
      return NextResponse.json(
        { error: "Review text is required" },
        { status: 400 }
      );
    }

    const prompt = `You are a sentiment and emotion analyzer AI.

A user has written the following review:

"""${review}"""

Please analyze and respond in this structured format:

Sentiment: [Positive/Negative/Neutral]
Emotions: [list of 1–3 emotions separated by commas]
Main Issue: [What is the core issue/problem mentioned]
Customer Wants: [What is the user expecting or looking for?]

Please be concise and accurate in your analysis.`;

    // Create OpenAI client with explicit API key
    const openai = createOpenAI({
      apiKey: apiKey,
    });

    const { text } = await generateText({
      model: openai("gpt-4"),
      messages: [
        {
          role: "system",
          content:
            "You are an expert at analyzing customer reviews for sentiment, emotions, and key insights. Always respond in the exact format requested.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
    });

    // Parse the response to extract structured data
    const lines = text.split("\n").filter((line) => line.trim());
    const result = {
      sentiment: "",
      emotions: [] as string[],
      mainIssue: "",
      customerWants: "",
    };

    lines.forEach((line) => {
      if (line.startsWith("Sentiment:")) {
        result.sentiment = line.replace("Sentiment:", "").trim();
      } else if (line.startsWith("Emotions:")) {
        const emotionsText = line.replace("Emotions:", "").trim();
        result.emotions = emotionsText
          .split(",")
          .map((e) => e.trim())
          .filter((e) => e);
      } else if (line.startsWith("Main Issue:")) {
        result.mainIssue = line.replace("Main Issue:", "").trim();
      } else if (line.startsWith("Customer Wants:")) {
        result.customerWants = line.replace("Customer Wants:", "").trim();
      }
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze review" },
      { status: 500 }
    );
  }
}
