// Insights Layer - Generator
// Generates textual insights and advice

import type { Transaction } from '@prisma/client'
import { calculateBurnRate } from '@/lib/analyze/burn-rate'
import { getCategoryBreakdown } from '@/lib/analyze/aggregations'
import dayjs from 'dayjs'

export async function generateInsights(userId: string) {
  const insights: string[] = []

  // Burn rate insight
  const burnRate = await calculateBurnRate(userId, 30)
  if (burnRate.dailyRate > 0) {
    insights.push(
      `At your current pace of ${burnRate.dailyRate.toFixed(2)} per day, you're projected to spend ${burnRate.projectedMonthly.toFixed(2)} this month.`
    )
  }

  // Category breakdown insight
  const year = dayjs().year()
  const month = dayjs().month() + 1
  const breakdown = await getCategoryBreakdown(userId, year, month)
  
  const topCategory = Object.entries(breakdown).sort((a, b) => b[1] - a[1])[0]
  if (topCategory) {
    insights.push(
      `Your highest spending category this month is ${topCategory[0]} at ${topCategory[1].toFixed(2)}.`
    )
  }

  return insights
}
