import dayjs from 'dayjs'
import { generateInsights } from '@/lib/insights/generator'
import { detectWeekendPattern } from '@/lib/analyze/patterns'
import { detectAnomalies } from '@/lib/analyze/anomalies'
import { getCategoryBreakdown } from '@/lib/analyze/aggregations'
import { InsightGrid } from '@/components/insights/InsightGrid'

const DEMO_USER_ID = process.env.DEMO_USER_ID ?? 'demo-user'

type InsightCard = { title: string; body: string; tone?: 'positive' | 'warning' | 'neutral' }

export default async function InsightsPage() {
  const now = dayjs()
  const [insights, weekendPattern, anomalies, breakdown] = await Promise.all([
    generateInsights(DEMO_USER_ID),
    detectWeekendPattern(DEMO_USER_ID),
    detectAnomalies(DEMO_USER_ID),
    getCategoryBreakdown(DEMO_USER_ID, now.year(), now.month() + 1),
  ])

  const cards: InsightCard[] = insights.map(text => ({
    title: deriveTitle(text),
    body: text,
    tone: text.toLowerCase().includes('warning') ? 'warning' : 'neutral',
  }))

  if (weekendPattern.hasWeekendSurge) {
    cards.push({
      title: 'Weekend surge detected',
      body: `Weekend average ${weekendPattern.weekendAverage.toFixed(2)} vs weekday ${weekendPattern.weekdayAverage.toFixed(2)}. Consider smoothing expenses.`,
      tone: 'warning' as const,
    })
  }

  if (anomalies.length > 0) {
    cards.push({
      title: 'Anomalies detected',
      body: `${anomalies.length} large transactions stood out in the last 90 days. Review and mark expected ones to improve forecasting.`,
      tone: 'warning' as const,
    })
  }

  const categoryComparisons = Object.entries(breakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([category, value]) => ({ title: `${category}`, body: `${value.toFixed(2)} spent this month`, tone: 'neutral' as const }))

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">Advise</p>
        <h1 className="text-3xl font-semibold">Insights</h1>
        <p className="text-sm text-slate-500">Auto-generated advice, pattern detection, and category comparisons.</p>
      </div>
      <InsightGrid insights={cards} />
      <div>
        <h2 className="text-lg font-semibold">Category spotlight</h2>
        <p className="text-sm text-slate-500">Top categories vs. average.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {categoryComparisons.map(item => (
            <div key={item.title} className="rounded-2xl border bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-slate-500">{item.title}</p>
              <p className="text-2xl font-semibold">{item.body}</p>
            </div>
          ))}
          {categoryComparisons.length === 0 && <p className="text-sm text-slate-500">No category data for this month.</p>}
        </div>
      </div>
    </section>
  )
}

function deriveTitle(text: string) {
  if (text.toLowerCase().includes('pace')) return 'Pace alert'
  if (text.toLowerCase().includes('category')) return 'Category focus'
  return 'Insight'
}
