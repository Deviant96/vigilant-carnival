'use client'

import { RadialBar, RadialBarChart, ResponsiveContainer } from 'recharts'

interface ForecastGaugeProps {
  projected: number
  budget: number
}

export function ForecastGauge({ projected, budget }: ForecastGaugeProps) {
  const percentage = budget === 0 ? 0 : Math.min(1.5, projected / budget)
  const status = percentage <= 0.9 ? 'on track' : percentage <= 1 ? 'near limit' : 'over budget'
  const statusColor =
    status === 'on track' ? 'text-emerald-600' : status === 'near limit' ? 'text-amber-500' : 'text-rose-600'

  const chartData = [
    { name: 'progress', value: percentage * 100, fill: status === 'on track' ? '#10b981' : '#f97316' },
  ]

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">Forecast</p>
      <div className="mt-4 flex items-center gap-4">
        <div className="h-36 w-36">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              data={chartData}
              startAngle={225}
              endAngle={-45}
              innerRadius="60%"
              outerRadius="100%"
            >
              <RadialBar cornerRadius={20} dataKey="value" background />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
        <div>
          <p className="text-3xl font-semibold">{projected.toFixed(2)}</p>
          <p className="text-sm text-slate-500">Expected end-of-month balance</p>
          <p className={`mt-2 text-sm font-medium capitalize ${statusColor}`}>Status: {status}</p>
          <p className="text-xs text-slate-500">Budget: {budget.toFixed(2)}</p>
        </div>
      </div>
    </div>
  )
}
