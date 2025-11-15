# Spending Tracker System — Agents Overview

This app follows a three-layer “agent” model:

1. Capture  
2. Analyze  
3. Advise

Each layer owns a specific part of the logic and keeps the system clean, predictable, and extendable.

---

## 1. Capture Agent
The Capture Agent handles everything related to input. Its job is to turn raw user activity into structured data that the rest of the system can work with.

### Responsibilities
- Creating and updating transactions
- Auto-categorizing based on rules
- Handling recurring expenses and generating monthly instances
- CSV import (PapaParse on client → normalize → server insert)
- CSV export (server-generated)
- Normalizing inconsistent input (dates, currency formatting, tags)
- Mapping “dirty” descriptions to known categories

### Inputs
- User-entered transactions
- Recurring expense definitions
- Auto-category rules
- CSV uploads

### Outputs
- Clean, validated Transaction entities
- Categorized records ready for analysis

### Key Files
- lib/capture/transaction-service.ts
- lib/capture/auto-category.ts
- lib/capture/csv-import.ts
- lib/capture/csv-export.ts
- app/api/transactions/*
- app/api/recurring/*

---

## 2. Analyze Agent
The Analyze Agent pulls from the database and generates insight-ready numbers.  
It does NOT generate advice—that’s the Advise layer.

### Responsibilities
- Monthly totals and category breakdowns
- Daily burn rate calculations
- Detecting anomalies and unusual spikes
- Detecting patterns: weekend surges, payday spikes, category bursts
- Forecasting:
  - V1: simple moving averages
  - V2: weighted averages
  - V3: trend + seasonality model

### Inputs
- Raw transactions (cleaned by Capture Agent)
- Categories
- Budgets
- Recurring expense data

### Outputs
- Time-series data
- Aggregated metrics
- Flags (anomaly, spike, pattern)
- Forecast curves

### Key Files
- lib/analyze/aggregations.ts
- lib/analyze/burn-rate.ts
- lib/analyze/anomalies.ts
- lib/analyze/patterns.ts
- lib/forecast/*
- app/api/analytics/*
- app/api/forecast/*

---

## 3. Advise Agent
This layer turns analysis data into insights, warnings, suggestions, and forecasts.

### Responsibilities
- Budget warnings
- “At your current pace…” predictions
- Category performance summaries
- Savings opportunities
- Trend explanations
- Nightly insight snapshots

### Inputs
- Analyze Agent results
- Budgets
- Goals
- User patterns

### Outputs
- Textual insights
- Advice objects
- Snapshot objects stored in DB

### Key Files
- lib/insights/generator.ts
- lib/insights/text-templates.ts
- app/api/insights/route.ts
- lib/cron/nightly-insights.ts

---

## How the Agents Work Together

User → Capture → Analyze → Advise → UI

Example: User adds a Starbucks transaction  
Capture normalizes and categorizes, Analyze updates metrics, Advise produces meaningful summaries.

---

## Design Principles
- Each agent has a single responsibility
- Data flows forward only
- Extendable for future ML modules
