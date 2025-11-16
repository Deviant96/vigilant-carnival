import dayjs from 'dayjs'
import { forecastMovingAverage } from '@/lib/forecast/moving-average'
import { forecastWeightedAverage } from '@/lib/forecast/weighted-average'
import { getTransactions } from '@/lib/capture/transaction-service'
import { getMonthlyTotals } from '@/lib/analyze/aggregations'
import { prisma } from '@/lib/prisma'
import { ForecastChart } from '@/components/forecast/ForecastChart'
import { RecurringList } from '@/components/forecast/RecurringList'
import type { RecurringExpense } from '@prisma/client'
import { getCurrentUser } from '@/lib/auth/get-current-user'
import { redirect } from 'next/navigation'

export default async function ForecastPage() {
  const user = await getCurrentUser()
  if (!user?.id) {
    redirect('/auth/login')
  }

  const now = dayjs()
  const [simpleForecast, weightedForecast, transactions, monthlyTotals, recurringExpenses] = await Promise.all([
    forecastMovingAverage(user.id, 45, 30),
    forecastWeightedAverage(user.id, 45, 30),
    getTransactions(user.id, { startDate: now.subtract(45, 'day').toDate() }),
    getMonthlyTotals(user.id, now.year(), now.month() + 1),
    prisma.recurringExpense.findMany({
      where: { userId: user.id, isActive: true },
      include: { category: true },
    }),
  ])

  const historical = aggregateHistorical(transactions)
  const projections = [
    { method: 'simple', points: simpleForecast.forecast.map(point => ({ date: point.date, value: point.predicted })) },
    { method: 'weighted', points: weightedForecast.forecast.map(point => ({ date: point.date, value: point.predicted })) },
  ]

  const recurring = recurringExpenses.slice(0, 6).map(expense => ({
    id: expense.id,
    description: expense.description ?? 'Recurring expense',
    amount: Number(expense.amount),
    nextCharge: computeNextCharge(expense).format('MMM D'),
    categoryName: expense.category?.name,
  }))

  const projectedTotal = weightedForecast.forecast.reduce((sum, point) => sum + point.predicted, monthlyTotals.total)
  const warningMessage = projectedTotal > monthlyTotals.total * 1.1
    ? 'At current pace you will exceed your monthly target. Consider tightening discretionary categories.'
    : 'Forecast within range — keep monitoring for large spikes.'

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">Analyze · Advise</p>
        <h1 className="text-3xl font-semibold">Forecast</h1>
        <p className="text-sm text-slate-500">Moving averages, weighted projections, and upcoming recurring payments.</p>
      </div>
      <ForecastChart historical={historical} projections={projections} />
      <div className="rounded-2xl border bg-amber-50 p-4 text-sm text-amber-900">{warningMessage}</div>
      <RecurringList items={recurring} />
    </section>
  )
}

function aggregateHistorical(transactions: Awaited<ReturnType<typeof getTransactions>>) {
  const map = new Map<string, number>()
  transactions.forEach(transaction => {
    const dayKey = dayjs(transaction.date).format('YYYY-MM-DD')
    map.set(dayKey, (map.get(dayKey) ?? 0) + Number(transaction.amount))
  })
  return Array.from(map.entries())
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

function computeNextCharge(recurring: RecurringExpense) {
  let nextDate = dayjs(recurring.startDate)
  const intervalUnitMap: Record<RecurringExpense['interval'], dayjs.ManipulateType> = {
    DAILY: 'day',
    WEEKLY: 'week',
    MONTHLY: 'month',
    YEARLY: 'year',
  }
  const unit = intervalUnitMap[recurring.interval] ?? 'month'
  while (nextDate.isBefore(dayjs(), 'day')) {
    nextDate = nextDate.add(recurring.intervalEvery, unit)
  }
  return nextDate
}
