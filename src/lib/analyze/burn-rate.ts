// Analyze Layer - Burn Rate
// Daily spending rate calculations

import { prisma } from '@/lib/prisma'
import dayjs from 'dayjs'

export async function calculateBurnRate(userId: string, days: number = 30) {
  const startDate = dayjs().subtract(days, 'day').startOf('day').toDate()
  const endDate = dayjs().endOf('day').toDate()

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
  const dailyRate = total / days

  return {
    totalSpent: total,
    days,
    dailyRate,
    projectedMonthly: dailyRate * 30,
  }
}
