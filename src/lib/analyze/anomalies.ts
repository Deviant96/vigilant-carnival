// Analyze Layer - Anomaly Detection
// Detect unusual spending spikes

import { prisma } from '@/lib/prisma'
import dayjs from 'dayjs'

export async function detectAnomalies(userId: string, threshold: number = 2) {
  const startDate = dayjs().subtract(90, 'day').toDate()
  
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: { gte: startDate },
    },
    orderBy: { date: 'asc' },
  })

  if (transactions.length === 0) return []

  const amounts = transactions.map(t => Number(t.amount))
  const mean = amounts.reduce((sum, a) => sum + a, 0) / amounts.length
  const variance = amounts.reduce((sum, a) => sum + Math.pow(a - mean, 2), 0) / amounts.length
  const stdDev = Math.sqrt(variance)

  const anomalies = transactions.filter(t => {
    const zScore = (Number(t.amount) - mean) / stdDev
    return Math.abs(zScore) > threshold
  })

  return anomalies
}
