'use client'

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface MonthBurnBarProps {
  spent: number
  projected: number
  budget?: number
}

export function MonthBurnBar({ spent, projected, budget = projected * 1.1 }: MonthBurnBarProps) {
  const data = [
    { name: 'Spent', value: Number(spent.toFixed(2)), fill: '#0ea5e9' },
    { name: 'Projected', value: Number(projected.toFixed(2)), fill: '#6366f1' },
    { name: 'Budget', value: Number(budget.toFixed(2)), fill: '#f97316' },
  ]

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">Month-to-date burn</p>
          <p className="text-3xl font-semibold">{spent.toFixed(2)}</p>
        </div>
        <span className="text-xs text-slate-500">Projection vs. budget</span>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: 0, right: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip cursor={{ fill: 'transparent' }} />
            <Bar dataKey="value" radius={12} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
