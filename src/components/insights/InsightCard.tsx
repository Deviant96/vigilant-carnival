interface InsightCardProps {
  title: string
  body: string
  tone?: 'positive' | 'warning' | 'neutral'
}

export function InsightCard({ title, body, tone = 'neutral' }: InsightCardProps) {
  const toneStyles: Record<typeof tone, string> = {
    positive: 'border-emerald-200 bg-emerald-50/70 text-emerald-900',
    warning: 'border-amber-200 bg-amber-50/80 text-amber-900',
    neutral: 'border-slate-200 bg-white text-slate-900',
  }

  return (
    <div className={`rounded-2xl border p-4 shadow-sm ${toneStyles[tone]}`}>
      <p className="text-xs uppercase tracking-wide text-slate-500">Advise</p>
      <h3 className="mt-1 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{body}</p>
    </div>
  )
}
