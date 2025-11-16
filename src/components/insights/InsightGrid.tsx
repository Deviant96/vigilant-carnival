import { InsightCard } from './InsightCard'

interface InsightGridProps {
  insights: { title: string; body: string; tone?: 'positive' | 'warning' | 'neutral' }[]
}

export function InsightGrid({ insights }: InsightGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {insights.map(insight => (
        <InsightCard key={insight.title} {...insight} />
      ))}
      {insights.length === 0 && <p className="text-sm text-slate-500">No insights generated for this range.</p>}
    </div>
  )
}
