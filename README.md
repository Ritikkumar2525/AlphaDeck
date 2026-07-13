# AlphaDeck - AI Investment Research Agent

## Overview - What it does
AlphaDeck is an Institutional-Grade AI Investment Research Assistant. It combines the expertise of a Wall Street Equity Research Analyst, CFA, and Financial Risk Analyst to provide comprehensive, evidence-based investment analysis. Given a stock ticker (e.g., AAPL, SBIN), it aggregates real-time market data, technical indicators, financial statements, and news from multiple financial APIs, and leverages Large Language Models (LLMs) to synthesize a structured investment decision (INVEST, HOLD, or PASS) along with detailed reasoning, price targets, and risk assessments.

## How to run it - Setup and run steps

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn
- API Keys for AI and Market Data Providers

### Installation
1. Clone the repository and navigate to the project folder:
   ```bash
   git clone <repository-url>
   cd AlphaDeck
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables by creating a `.env.local` file in the root directory:
   ```env
   # AI Providers (Fallback Cascade)
   GOOGLE_API_KEY=your_gemini_api_key
   OPENAI_API_KEY=your_openai_api_key
   OPENROUTER_API_KEY=your_openrouter_api_key
   GROQ_API_KEY=your_groq_api_key

   # Market Data Providers
   FINNHUB_API_KEY=your_finnhub_key
   TWELVEDATA_API_KEY=your_twelvedata_key
   POLYGON_API_KEY=your_polygon_key
   TIINGO_API_KEY=your_tiingo_key
   ```

### Running Locally
To start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. Enter a valid stock ticker in the search bar to generate a report.

## How it works - Approach and Architecture

### Architecture
AlphaDeck is built on a modern Next.js 14 stack utilizing the App Router, React Server Components, and Tailwind CSS for the frontend interface. The backend API route (`/api/analyze`) orchestrates a complex data retrieval and AI generation pipeline:

1. **Input Sanitization & Caching:** The incoming ticker symbol is validated and checked against an in-memory cache (NodeCache) to return instant results for previously generated reports, saving API limits and time.
2. **Data Aggregation Cascade:** A highly resilient `marketProvider.js` module attempts to fetch financial data using a fallback cascade mechanism. It prioritizes free/unlimited APIs like `yahoo-finance2` and falls back to Finnhub, TwelveData, Polygon, and Tiingo to prevent failures due to rate limits or missing data.
3. **AI Generation Pipeline:** The aggregated market data is structured into a pruned JSON payload and sent to `agent.js`. This module uses LangChain to interface with an LLM. It also features a robust fallback mechanism, attempting generation via Google Gemini, OpenAI, OpenRouter, and Groq (using `llama-3.1-8b-instant` for ultra-fast generation within Vercel's strict serverless timeout limits).
4. **Structured Output Validation:** The AI response is enforced as a strict JSON structure and parsed robustly before being returned to the client.

## Key decisions & trade-offs

- **Strict Vercel Timeout Constraints:** Vercel's Hobby plan imposes a hard 10-second timeout on serverless functions. To overcome this, the AI context size was aggressively pruned (reducing historical data and news limits) and the fallback model was downgraded from a 70B parameter model to an 8B parameter model (`llama-3.1-8b-instant`). **Trade-off:** We sacrificed some depth in historical analysis to guarantee the application responds within the 10-second limit and prevents `504 Gateway Timeout` errors.
- **Provider Redundancy over Monolithic API:** Instead of relying entirely on a single paid API (like Bloomberg or strict OpenAI), AlphaDeck implements a multi-provider fallback cascade for both data and AI. **Trade-off:** This dramatically increases system resilience and allows the app to function entirely on free tiers, but adds complexity to the backend data normalization.
- **Client-Side vs Server-Side Data Fetching:** All data aggregation and AI generation happen securely on the server (`/api/analyze`). **Trade-off:** This hides sensitive API keys from the client and allows for centralized caching, though it forces the user to wait for the entire process to complete before seeing results.

## Example runs

**Ticker: SBIN.NS (State Bank of India)**
- **Decision:** HOLD (Confidence: 75%)
- **Strengths:** Strong market capitalization, positive trailing returns, robust banking infrastructure.
- **Risks:** High sensitivity to interest rate changes, moderate short-term price volatility.
- **Output:** The LLM successfully ingested the Yahoo Finance data cascade and delivered a detailed breakdown of the bull and bear case.

**Ticker: AAPL (Apple Inc.)**
- **Decision:** INVEST (Confidence: 85%)
- **Strengths:** Massive free cash flow, dominant market share, aggressive stock buybacks.
- **Risks:** Slowing iPhone growth in emerging markets, antitrust regulatory pressures.
- **Output:** The AI accurately assessed Apple's massive gross margins and provided a 12-18 month price target, parsing the complex options chain and news sentiment into a cohesive summary.

## What you would improve with more time
1. **Streaming Responses:** Implement Server-Sent Events (SSE) or React Server Actions with `AI SDK` to stream the LLM response to the frontend in real-time, greatly improving perceived performance and bypassing the 10-second Vercel timeout organically.
2. **Interactive Charting:** Integrate advanced TradingView or Recharts components for the historical data array to allow users to visually inspect technical indicators.
3. **Database Persistence:** Replace the temporary NodeCache with a persistent database like PostgreSQL (Vercel Postgres) or Redis to store historical AI reports, user accounts, and watchlist portfolios.
4. **Agentic Workflows:** Give the AI actual tool-calling capabilities (e.g., executing a web search if the API returns missing news, or querying a SEC Edgar API for deeper 10-K analysis).

## Bonus: LLM Chat Transcript
As part of the assignment requirements, the full LLM chat session transcript/log that was used to build this project is included in the `LLM_Chat_Transcript` directory. It showcases the thought process, debugging steps (such as overcoming the Vercel 504 timeouts and implementing the fallback cascade), and architectural decisions made collaboratively during development.
