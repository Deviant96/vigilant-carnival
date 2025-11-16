interface TodayCardProps {
  todaySpend: number
  typicalAverage: number
}

export function TodayCard({ todaySpend, typicalAverage }: TodayCardProps) {
  const delta = typicalAverage === 0 ? 0 : ((todaySpend - typicalAverage) / typicalAverage) * 100
  const isPositive = delta <= 0

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">Today&apos;s Spend</p>
      <p className="mt-2 text-4xl font-semibold">{todaySpend.toFixed(2)}</p>
      <p className="mt-3 text-sm text-slate-500">Typical average: {typicalAverage.toFixed(2)}</p>
      <p
        className={`mt-1 text-sm font-medium ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}
      >
        {isPositive ? '▼' : '▲'} {Math.abs(delta).toFixed(1)}% vs. your rolling average
      </p>
    </div>
  )
}
