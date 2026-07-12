# InvestIQ — AI Investment Research Terminal

> An AI-powered investment research agent that takes a company name, conducts comprehensive research, and delivers an **INVEST** or **PASS** decision with detailed reasoning.

Built for the **InsideIIM × Altuni AI Labs** AI Product Development Engineer (Intern) take-home assignment.

---

## Overview

InvestIQ is a full-stack AI research terminal that automates the investment research process. Enter any company name (e.g., "NVIDIA", "Apple", "Tesla") and the AI agent will:

1. **Resolve** the company to its stock ticker
2. **Fetch** real-time stock price data
3. **Analyze** financial statements (revenue, net income, EPS, P/E ratio, margins)
4. **Gather** recent news and sentiment
5. **Synthesize** all data into a structured **INVEST / PASS** decision with confidence score and reasoning

The frontend renders a premium dark-theme investment dashboard — designed in Google Stitch and implemented pixel-perfectly.

---

## How to Run It

### Prerequisites

- **Node.js** 18+ and **npm**
- **Google Gemini API Key** (free): Get one at [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey)
- *(Optional)* **Financial Modeling Prep API Key** (free tier): [https://financialmodelingprep.com/developer](https://financialmodelingprep.com/developer)

### Setup & Run

```bash
# 1. Clone the repo and navigate to the project
cd investiq

# 2. Install dependencies
npm install

# 3. Create .env.local file with your API keys
cp .env.example .env.local
# Edit .env.local and add your keys:
#   GOOGLE_API_KEY=your_gemini_api_key_here
#   FMP_API_KEY=your_fmp_api_key_here (optional)

# 4. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start analyzing companies!

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GOOGLE_API_KEY` | Yes | Google Gemini API key for AI reasoning |
| `FMP_API_KEY` | No | Financial Modeling Prep API key for real financial data |

> **Note**: The app includes comprehensive mock data for major companies (NVDA, AAPL, TSLA, MSFT, GOOGL, AMZN, META), so it works even without API keys for demo purposes.

---

## How It Works

### Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                │
│  ┌──────────┐  ┌──────────────────────────────────┐ │
│  │ Sidebar   │  │ Dashboard                        │ │
│  │           │  │  ┌─────────────────────────────┐ │ │
│  │ • New     │  │  │ Search Bar                  │ │ │
│  │ • History │  │  │ "Enter company name..."     │ │ │
│  │ • Watch   │  │  ├─────────────────────────────┤ │ │
│  │           │  │  │ Company Header + INVEST/PASS│ │ │
│  │           │  │  ├──────────┬──────────────────┤ │ │
│  │           │  │  │ Stock    │ Financial Metrics │ │ │
│  │           │  │  │ Overview │                  │ │ │
│  │           │  │  ├──────────┴──────────────────┤ │ │
│  │           │  │  │ Revenue Chart (Recharts)    │ │ │
│  │           │  │  ├─────────────────────────────┤ │ │
│  │           │  │  │ AI Analysis + Decision Card │ │ │
│  │           │  │  ├─────────────────────────────┤ │ │
│  │           │  │  │ News Panel                  │ │ │
│  └──────────┘  │  └─────────────────────────────┘ │ │
│                └──────────────────────────────────┘ │
└──────────────────────┬──────────────────────────────┘
                       │ POST /api/analyze
                       ▼
┌─────────────────────────────────────────────────────┐
│              Backend (Next.js API Routes)            │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │           LangChain.js ReAct Agent            │  │
│  │                                               │  │
│  │  ┌─────────────┐  ┌────────────────────────┐  │  │
│  │  │ Gemini 2.0   │  │ Tools:                │  │  │
│  │  │ Flash LLM    │──│ • fetchStockPrice     │  │  │
│  │  │              │  │ • fetchFinancials      │  │  │
│  │  │ System prompt│  │ • fetchCompanyProfile  │  │  │
│  │  │ = Sr. Analyst│  │ • fetchNews           │  │  │
│  │  └─────────────┘  └────────────────────────┘  │  │
│  │                                               │  │
│  │  Output: Structured AnalysisResult JSON       │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### Agent Flow

1. **User Input** → Company name (e.g., "NVIDIA")
2. **LangChain ReAct Agent** orchestrates the research:
   - Calls `fetchCompanyProfile` to get company info and ticker
   - Calls `fetchStockPrice` for current market data
   - Calls `fetchFinancials` for financial statements
   - Calls `fetchNews` for recent news and sentiment
3. **AI Reasoning** → Gemini 2.0 Flash analyzes all gathered data
4. **Decision** → Structured INVEST/PASS with confidence, reasoning, strengths, risks
5. **Frontend** → Renders the beautiful dashboard with all data

### Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | Next.js 15 (App Router) | Modern React framework with SSR |
| **Styling** | Vanilla CSS (dark theme) | Maximum control, no bloat |
| **Charts** | Recharts | Lightweight, React-native charting |
| **Icons** | Lucide React | Clean, consistent icon set |
| **AI Agent** | LangChain.js | Agent orchestration with tool-calling |
| **LLM** | Google Gemini 2.0 Flash | Fast, capable, free tier available |
| **Data** | Financial Modeling Prep API | Free financial data API |
| **Language** | TypeScript | Type safety across the stack |

---

## Key Decisions & Trade-offs

### 1. LangChain.js ReAct Agent vs. Simple Chain
**Decision**: Used ReAct (Reasoning + Acting) agent pattern.
**Why**: The agent can dynamically decide which tools to call and in what order, making it more flexible than a fixed chain. It can handle edge cases (e.g., unknown company names) by reasoning about the situation.

### 2. Google Gemini vs. OpenAI
**Decision**: Google Gemini 2.0 Flash as the default LLM.
**Why**: Free tier available (essential for a take-home assignment), fast response times, strong reasoning capabilities. The architecture is provider-agnostic via LangChain — switching to GPT-4 requires only changing the model import.

### 3. Mock Data Fallback
**Decision**: Comprehensive mock data for 7 major companies built in.
**Why**: Financial APIs have rate limits and require registration. Mock data ensures the app always works for demo purposes while still supporting real API calls when keys are provided.

### 4. Vanilla CSS vs. Tailwind/CSS-in-JS
**Decision**: Vanilla CSS with CSS custom properties.
**Why**: Maximum control over the dark theme design system, no build-time dependencies, and the design was complex enough to warrant custom styles. CSS custom properties provide theming flexibility.

### 5. Server-side API Route
**Decision**: All API calls happen server-side via `/api/analyze`.
**Why**: API keys stay secure on the server. The LLM call and financial data fetching happen server-side, with only the final result sent to the client.

### What I Left Out
- **Real-time WebSocket updates** — Would add live price tracking but increases complexity
- **User authentication** — Not required for the assignment scope
- **Database/persistence** — Analysis history could be stored but wasn't required
- **Multiple LLM comparison** — Could compare Gemini vs GPT-4 analysis but adds latency

---

## Example Runs

### NVIDIA (NVDA) — INVEST Decision
```
Company: NVIDIA Corp. (NVDA)
Decision: INVEST (87% confidence)
Summary: NVIDIA dominates the AI accelerator market with exceptional revenue growth,
         strong margins, and unmatched competitive position in GPU computing.

Strengths:
✅ Revenue growth of 125%+ YoY driven by AI demand
✅ Dominant market position in AI/ML training hardware
✅ Gross margins above 70%
✅ Strong free cash flow generation

Risks:
⚠️ High valuation (P/E > 60x)
⚠️ Customer concentration risk
⚠️ Potential competition from custom AI chips (Google TPU, Amazon Trainium)
```

### Tesla (TSLA) — Analysis Example
```
Company: Tesla, Inc. (TSLA)
Decision: PASS (42% confidence)
Summary: While Tesla leads in EV innovation, margin compression and
         increasing competition present near-term headwinds.

Strengths:
✅ Brand recognition and market leadership in EVs
✅ Vertically integrated manufacturing
✅ Energy storage business growth

Risks:
⚠️ Declining automotive margins
⚠️ Intense competition from legacy automakers and Chinese EVs
⚠️ CEO distraction risk
```

---

## Project Structure

```
investiq/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── analyze/
│   │   │       └── route.ts        # AI analysis API endpoint
│   │   ├── globals.css             # Dark theme design system
│   │   ├── layout.tsx              # Root layout with fonts
│   │   └── page.tsx                # Main dashboard page
│   ├── components/
│   │   ├── AIAnalysis.tsx          # AI reasoning panel
│   │   ├── CompanyHeader.tsx       # Company name + decision badge
│   │   ├── DecisionCard.tsx        # INVEST/PASS card
│   │   ├── FinancialMetrics.tsx    # Key financial metrics grid
│   │   ├── LoadingState.tsx        # Terminal-style loading
│   │   ├── NewsPanel.tsx           # Recent news with sentiment
│   │   ├── RevenueChart.tsx        # Revenue bar chart
│   │   ├── SearchBar.tsx           # Company search input
│   │   ├── Sidebar.tsx             # Navigation sidebar
│   │   └── StockOverview.tsx       # Stock price overview
│   └── lib/
│       ├── agent.ts                # LangChain.js ReAct agent
│       ├── tools.ts                # Agent tools (data fetching)
│       └── types.ts                # TypeScript interfaces
├── .env.example                    # Environment variables template
├── package.json
├── tsconfig.json
└── README.md
```

---

## Deploying to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables on Vercel dashboard:
# GOOGLE_API_KEY=your_key
# FMP_API_KEY=your_key (optional)
```

Or connect your GitHub repo to Vercel for automatic deployments.

---

## License

Built for the InsideIIM × Altuni AI Labs internship assignment.
