// Forecast Layer - Weighted Moving Average
// V2 forecast implementation with more weight on recent data

import { prisma } from '@/lib/prisma'
import dayjs from 'dayjs'

export async function forecastWeightedAverage(
  userId: string,
  windowDays: number = 30,
  forecastDays: number = 30
) {
  const startDate = dayjs().subtract(windowDays, 'day').toDate()
  
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: { gte: startDate },
    },
    orderBy: { date: 'asc' },
  })

  // Group by day
  const dailyTotals = new Map<string, number>()
  transactions.forEach(t => {
    const day = dayjs(t.date).format('YYYY-MM-DD')
    dailyTotals.set(day, (dailyTotals.get(day) || 0) + Number(t.amount))
  })

  // Calculate weighted average (more recent days have higher weight)
  let weightedSum = 0
  let weightSum = 0
  
  Array.from(dailyTotals.entries()).forEach(([_, amount], index) => {
    const weight = index + 1 // Linear weight increase
    weightedSum += amount * weight
    weightSum += weight
  })

  const weightedAverage = weightSum > 0 ? weightedSum / weightSum : 0

  const forecast = []
  for (let i = 1; i <= forecastDays; i++) {
    forecast.push({
      date: dayjs().add(i, 'day').format('YYYY-MM-DD'),
      predicted: weightedAverage,
    })
  }

  return {
    method: 'weighted_moving_average',
    windowDays,
    weightedAverage,
    forecast,
  }
}
