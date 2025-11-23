# Spending Tracker — Next.js + Prisma + PostgreSQL

A full-featured personal finance tracker built with a clean three-layer architecture:
Capture → Analyze → Advise.

---

# Features

## Capture Layer
- Manual transactions
- Inline editor
- Auto-categorization
- Recurring expenses
- CSV import (PapaParse)
- CSV export

## Analyze Layer
- Monthly totals
- Category breakdowns
- Burn rate calculations
- Anomaly detection
- Pattern recognition
- Forecast engine (MA, WMA, trend)

## Advise Layer
- Budget warnings
- Pace predictions
- Spending summaries
- Savings opportunities
- Trend explanations
- Nightly insight snapshots

---

# Tech Stack

Frontend:
- Next.js App Router
- TypeScript
- TailwindCSS
- Recharts
- React Query / Zustand

Backend:
- PostgreSQL
- Prisma ORM
- Next.js Route Handlers
- NextAuth (or custom email auth)

Utils:
- PapaParse
- Day.js
- Zod

---

# Project Structure

src/  
  app/  
    dashboard/  
    transactions/  
    forecast/  
    insights/  
    budgets/  
    api/...  
  components/  
  lib/capture/  
  lib/analyze/  
  lib/forecast/  
  lib/insights/  
  schemas/  
  hooks/  

---

# Getting Started

Install:
```
npm install
```

Env:
```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
# Optional: LLM insights
OPENAI_API_KEY=your-openai-key
OPENAI_MODEL=gpt-4o-mini
OPENAI_BASE_URL=https://api.openai.com/v1
```

LLM usage:
- The insights API accepts `?mode=llm` to request an additional LLM-generated advice block.
- Response fields: `insights` (combined), `structuredInsights` (rule-based only), `llmAdvice` (string or null), and the `mode` returned for clarity.
- Keep provider rate limits and token costs in mind; cache or debounce client requests as needed.

Prisma:
```
npx prisma migrate dev
```

Run:
```
npm run dev
```

---

# Architecture Summary

Capture → Analyze → Advise  
For an explanation of each layer, see AGENTS.md.

---

# License

MIT
