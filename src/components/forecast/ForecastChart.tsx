'use client'

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface ForecastSeries {
  method: string
  points: { date: string; value: number }[]
}

interface ForecastChartProps {
  historical: { date: string; amount: number }[]
  projections: ForecastSeries[]
}

export function ForecastChart({ historical, projections }: ForecastChartProps) {
  const mergedData = mergeSeries(historical, projections)

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="mb-4">
        <p className="text-xs uppercase tracking-wide text-slate-500">Analyze</p>
        <h2 className="text-lg font-semibold">Forecast horizon</h2>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mergedData} margin={{ left: 0, right: 0, top: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" hide interval={Math.max(1, Math.floor(mergedData.length / 6))} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#0ea5e9"
              strokeWidth={2}
              dot={false}
              name="Actual"
            />
            {projections.map(series => (
              <Line
                key={series.method}
                type="monotone"
                dataKey={series.method}
                stroke={series.method === 'weighted' ? '#f97316' : '#6366f1'}
                strokeDasharray={series.method === 'weighted' ? '4 3' : undefined}
                dot={false}
                name={`${series.method} forecast`}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function mergeSeries(
  historical: { date: string; amount: number }[],
  projections: ForecastSeries[]
) {
  const map = new Map<string, { date: string; actual?: number } & Record<string, number | undefined>>()
  historical.forEach(point => {
    map.set(point.date, { date: point.date, actual: Number(point.amount.toFixed(2)) })
  })
  projections.forEach(series => {
    series.points.forEach(point => {
      if (!map.has(point.date)) {
        map.set(point.date, { date: point.date })
      }
      const entry = map.get(point.date)!
      entry[series.method] = Number(point.value.toFixed(2))
    })
  })
  return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date))
}
