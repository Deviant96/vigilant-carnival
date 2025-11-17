import dayjs from 'dayjs'
import { Budget, BudgetPeriod, Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

function periodRange(period: BudgetPeriod, startDate: Date) {
  const start = dayjs(startDate)
  switch (period) {
    case 'WEEKLY':
      return { start: start.startOf('week').toDate(), end: start.endOf('week').toDate() }
    case 'YEARLY':
      return { start: start.startOf('year').toDate(), end: start.endOf('year').toDate() }
    case 'MONTHLY':
    default:
      return { start: start.startOf('month').toDate(), end: start.endOf('month').toDate() }
  }
}

export async function calculateBudgetSpend(budget: Budget & { categoryId?: string | null }) {
  const range = periodRange(budget.period, budget.startDate)

  const where: Prisma.TransactionWhereInput = {
    userId: budget.userId,
    date: { gte: range.start, lte: range.end },
  }

  if (budget.categoryId) {
    where.categoryId = budget.categoryId
  }

  const aggregate = await prisma.transaction.aggregate({
    _sum: { amount: true },
    where,
  })

  return Number(aggregate._sum.amount ?? 0)
}
