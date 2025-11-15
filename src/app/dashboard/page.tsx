import dayjs from 'dayjs'
import { calculateBurnRate } from '@/lib/analyze/burn-rate'
import { getMonthlyTotals, getCategoryBreakdown } from '@/lib/analyze/aggregations'
import { forecastMovingAverage } from '@/lib/forecast/moving-average'
import { getTransactions } from '@/lib/capture/transaction-service'
import { TodayCard } from '@/components/dashboard/TodayCard'
import { MonthBurnBar } from '@/components/dashboard/MonthBurnBar'
import { ForecastGauge } from '@/components/dashboard/ForecastGauge'
import { QuickAddTransactionModal } from '@/components/dashboard/QuickAddTransactionModal'
import TransactionList from '@/components/TransactionList'

const DEMO_USER_ID = process.env.DEMO_USER_ID ?? 'demo-user'

export default async function DashboardPage() {
  const now = dayjs()
  const [burnMetrics, monthlyTotals, categoryBreakdown, forecast, transactions] = await Promise.all([
    calculateBurnRate(DEMO_USER_ID, 30),
    getMonthlyTotals(DEMO_USER_ID, now.year(), now.month() + 1),
    getCategoryBreakdown(DEMO_USER_ID, now.year(), now.month() + 1),
    forecastMovingAverage(DEMO_USER_ID, 30, 30),
    getTransactions(DEMO_USER_ID, {
      startDate: now.subtract(45, 'day').toDate(),
    }),
  ])

  const todaySpend = transactions
    .filter(transaction => dayjs(transaction.date).isSame(now, 'day'))
    .reduce((sum, transaction) => sum + Number(transaction.amount), 0)
  const plannedBudget = monthlyTotals.total > 0 ? monthlyTotals.total * 1.1 : 5000000
  const sortedBreakdown = Object.entries(categoryBreakdown).sort((a, b) => b[1] - a[1]).slice(0, 5)
  const recentTransactions = transactions.slice(0, 5).map(transaction => ({
    id: transaction.id,
    amount: Number(transaction.amount),
    description: transaction.description ?? 'Untitled',
    date: transaction.date,
    category: transaction.category ? { name: transaction.category.name } : undefined,
  }))

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Capture · Analyze · Advise</p>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="text-sm text-slate-500">
            Today&apos;s spend vs. typical day, burn rate, and forecasted month end.
          </p>
        </div>
        <QuickAddTransactionModal userId={DEMO_USER_ID} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <TodayCard todaySpend={todaySpend} typicalAverage={burnMetrics.dailyRate} />
        <MonthBurnBar spent={burnMetrics.totalSpent} projected={burnMetrics.projectedMonthly} budget={plannedBudget} />
        <ForecastGauge projected={forecast.dailyAverage * 30} budget={plannedBudget} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Analyze</p>
              <h2 className="text-lg font-semibold">Top categories</h2>
            </div>
            <span className="text-xs text-slate-500">Current month</span>
          </div>
          <ul className="mt-4 space-y-3">
            {sortedBreakdown.map(([category, value]) => (
              <li key={category} className="flex items-center justify-between text-sm">
                <span>{category}</span>
                <span className="font-semibold">{value.toFixed(2)}</span>
              </li>
            ))}
            {sortedBreakdown.length === 0 && (
              <li className="text-sm text-slate-500">No categorized spend for this month yet.</li>
            )}
          </ul>
        </div>
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-500">Capture</p>
          <TransactionList transactions={recentTransactions} />
        </div>
      </div>
    </section>
  )
}
