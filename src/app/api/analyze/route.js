import { NextResponse } from "next/server";
import { analyzeCompany } from "@/lib/agent";

export const maxDuration = 60;

export async function POST(request) {
  try {
    const body = await request.json();
    const companyName = body.companyName;

    if (!companyName || typeof companyName !== "string" || companyName.trim().length === 0) {
      return NextResponse.json(
        { error: "Please enter a company name or ticker symbol.", errorCode: "INVALID_INPUT" },
        { status: 400 }
      );
    }

    const analysis = await analyzeCompany(companyName.trim());
    return NextResponse.json(analysis);
    
  } catch (error) {
    // Log the real error server-side for debugging
    console.error("[/api/analyze] Error:", error.message);

    const msg = error.message || String(error);

    // === User-friendly error mapping ===
    // Never expose raw API errors, stack traces, or provider names to the user.

    if (msg.startsWith("INVALID_TICKER")) {
      return NextResponse.json(
        { error: "Could not find a stock matching your query. Please check the company name or ticker symbol.", errorCode: "INVALID_TICKER" },
        { status: 404 }
      );
    }

    if (msg.startsWith("MISSING_API_KEY")) {
      return NextResponse.json(
        { error: "Server configuration error. Please contact the administrator.", errorCode: "CONFIG_ERROR" },
        { status: 500 }
      );
    }

    if (msg.startsWith("AI_PARSE_ERROR")) {
      return NextResponse.json(
        { error: "The AI analysis could not be completed. Please try again.", errorCode: "AI_PARSE_ERROR" },
        { status: 502 }
      );
    }

    if (msg.startsWith("AI_ERROR")) {
      // Check if it's the "all models unavailable" case
      if (msg.includes("unavailable") || msg.includes("All AI models")) {
        return NextResponse.json(
          { error: "AI analysis service is temporarily busy. Please try again in a few minutes.", errorCode: "AI_BUSY" },
          { status: 503 }
        );
      }
      return NextResponse.json(
        { error: "AI analysis encountered an issue. Please try again.", errorCode: "AI_ERROR" },
        { status: 502 }
      );
    }

    if (msg.includes("Unable to retrieve market data")) {
      return NextResponse.json(
        { error: "Unable to retrieve market data at the moment. Please try again later.", errorCode: "ALL_PROVIDERS_FAILED" },
        { status: 503 }
      );
    }

    // Generic fallback — NEVER expose the raw error message
    return NextResponse.json(
      { error: "Something went wrong. Please try again.", errorCode: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
