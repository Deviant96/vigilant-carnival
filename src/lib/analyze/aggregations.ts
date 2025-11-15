// Analyze Layer - Aggregations
// Monthly totals and category breakdowns

import { prisma } from '@/lib/prisma'
import dayjs from 'dayjs'

export async function getMonthlyTotals(userId: string, year: number, month: number) {
  const startDate = dayjs().year(year).month(month - 1).startOf('month').toDate()
  const endDate = dayjs().year(year).month(month - 1).endOf('month').toDate()

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  })

  const total = transactions.reduce((sum, t) => sum + Number(t.amount), 0)
  return { total, count: transactions.length }
}

export async function getCategoryBreakdown(userId: string, year: number, month: number) {
  const startDate = dayjs().year(year).month(month - 1).startOf('month').toDate()
  const endDate = dayjs().year(year).month(month - 1).endOf('month').toDate()

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      category: true,
    },
  })

  const breakdown = transactions.reduce((acc, t) => {
    const categoryName = t.category?.name || 'Uncategorized'
    if (!acc[categoryName]) {
      acc[categoryName] = 0
    }
    acc[categoryName] += Number(t.amount)
    return acc
  }, {} as Record<string, number>)

  return breakdown
}
