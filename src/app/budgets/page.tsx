import dayjs from 'dayjs'
import { prisma } from '@/lib/prisma'
import { getCategoryBreakdown, getMonthlyTotals } from '@/lib/analyze/aggregations'
import { BudgetList } from '@/components/budgets/BudgetList'
import { BudgetForm } from '@/components/budgets/BudgetForm'

const DEMO_USER_ID = process.env.DEMO_USER_ID ?? 'demo-user'

export default async function BudgetsPage() {
  const now = dayjs()
  const [budgetsRaw, breakdown, monthlyTotals] = await Promise.all([
    prisma.budget.findMany({
      where: { userId: DEMO_USER_ID, isActive: true },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    }),
    getCategoryBreakdown(DEMO_USER_ID, now.year(), now.month() + 1),
    getMonthlyTotals(DEMO_USER_ID, now.year(), now.month() + 1),
  ])

  const budgets = budgetsRaw.map(budget => ({
    id: budget.id,
    name: budget.name,
    period: budget.period,
    amount: Number(budget.amount),
    spent: budget.category?.name
      ? breakdown[budget.category.name] ?? 0
      : monthlyTotals.total,
    categoryName: budget.category?.name,
  }))

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">Advise</p>
        <h1 className="text-3xl font-semibold">Budgets & Goals</h1>
        <p className="text-sm text-slate-500">User-defined budgets with dynamic adjustments and overshoot probability.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <BudgetList budgets={budgets} />
        <BudgetForm />
      </div>
    </section>
  )
}
