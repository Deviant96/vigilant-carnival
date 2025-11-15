// Forecast Layer - Simple Moving Average
// V1 forecast implementation

import { prisma } from '@/lib/prisma'
import dayjs from 'dayjs'

export async function forecastMovingAverage(
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
  })

  const total = transactions.reduce((sum, t) => sum + Number(t.amount), 0)
  const dailyAverage = total / windowDays

  const forecast = []
  for (let i = 1; i <= forecastDays; i++) {
    forecast.push({
      date: dayjs().add(i, 'day').format('YYYY-MM-DD'),
      predicted: dailyAverage,
    })
  }

  return {
    method: 'simple_moving_average',
    windowDays,
    dailyAverage,
    forecast,
  }
}
