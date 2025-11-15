// Analyze Layer - Pattern Recognition
// Detect spending patterns (weekend surges, payday spikes, etc.)

import { prisma } from '@/lib/prisma'
import dayjs from 'dayjs'

export async function detectWeekendPattern(userId: string) {
  const startDate = dayjs().subtract(60, 'day').toDate()
  
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: { gte: startDate },
    },
  })

  const weekendTotal = transactions
    .filter(t => {
      const day = dayjs(t.date).day()
      return day === 0 || day === 6 // Sunday or Saturday
    })
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const weekdayTotal = transactions
    .filter(t => {
      const day = dayjs(t.date).day()
      return day > 0 && day < 6
    })
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const weekendCount = transactions.filter(t => {
    const day = dayjs(t.date).day()
    return day === 0 || day === 6
  }).length

  const weekdayCount = transactions.filter(t => {
    const day = dayjs(t.date).day()
    return day > 0 && day < 6
  }).length

  return {
    weekendAverage: weekendCount > 0 ? weekendTotal / weekendCount : 0,
    weekdayAverage: weekdayCount > 0 ? weekdayTotal / weekdayCount : 0,
    hasWeekendSurge: weekendCount > 0 && weekendTotal / weekendCount > weekdayTotal / weekdayCount * 1.5,
  }
}
