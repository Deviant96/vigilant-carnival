# Spending Tracker — Quick Start Guide

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and update:
- `DATABASE_URL` with your PostgreSQL connection string
- `NEXTAUTH_SECRET` with a secure random string
- `NEXTAUTH_URL` with your app URL

3. Initialize Prisma:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

4. Run development server:
```bash
npm run dev
```

Visit http://localhost:3000

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── transactions/  # Capture layer endpoints
│   │   ├── analytics/     # Analyze layer endpoints
│   │   ├── forecast/      # Forecast endpoints
│   │   └── insights/      # Advise layer endpoints
│   ├── dashboard/         # Dashboard pages (to be created)
│   ├── transactions/      # Transaction pages (to be created)
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── TransactionList.tsx
│   └── DashboardStats.tsx
├── lib/                   # Business logic
│   ├── capture/          # Capture Agent
│   │   ├── transaction-service.ts
│   │   ├── auto-category.ts
│   │   ├── csv-import.ts
│   │   └── csv-export.ts
│   ├── analyze/          # Analyze Agent
│   │   ├── aggregations.ts
│   │   ├── burn-rate.ts
│   │   ├── anomalies.ts
│   │   └── patterns.ts
│   ├── forecast/         # Forecast engine
│   │   ├── moving-average.ts
│   │   └── weighted-average.ts
│   ├── insights/         # Advise Agent
│   │   ├── generator.ts
│   │   └── text-templates.ts
│   ├── prisma.ts         # Prisma client
│   └── utils.ts          # Utilities
├── schemas/              # Zod validation schemas
│   └── index.ts
└── hooks/                # React Query hooks
    └── index.ts
```

## Architecture

The app follows a three-layer agent model:

1. **Capture Agent** — Input handling, auto-categorization, CSV import/export
2. **Analyze Agent** — Metrics, anomalies, patterns, forecasting
3. **Advise Agent** — Insights, warnings, recommendations

See AGENTS.md for detailed architecture documentation.

## Available Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm start` — Start production server
- `npm run lint` — Run ESLint
- `npx prisma studio` — Open Prisma Studio (database GUI)
- `npx prisma migrate dev` — Create and apply migrations

## Next Steps

1. Create user authentication (NextAuth setup)
2. Build dashboard UI pages
3. Implement transaction management UI
4. Add budget tracking features
5. Create visualization components (Recharts)
6. Set up nightly insight snapshots (cron job)
7. Add recurring expense automation

## Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript, TailwindCSS
- **Backend:** Next.js Route Handlers, Prisma ORM
- **Database:** PostgreSQL
- **Charts:** Recharts
- **State:** React Query, Zustand
- **Utils:** PapaParse, Day.js, Zod
