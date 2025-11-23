// Insights Layer - Generator
// Generates textual insights and advice

import { calculateBurnRate } from '@/lib/analyze/burn-rate'
import { getCategoryBreakdown } from '@/lib/analyze/aggregations'
import { detectAnomalies } from '@/lib/analyze/anomalies'
import {
  AdvicePromptContext,
  buildAdvicePrompt,
  generateAdvice as requestLLMAdvice,
} from '@/lib/insights/llm-client'
import dayjs from 'dayjs'

export interface InsightGenerationOptions {
  includeLLM?: boolean
}

export interface InsightGenerationResult {
  insights: string[]
  structuredInsights: string[]
  llmAdvice?: string
}

export async function generateInsights(userId: string, options: InsightGenerationOptions = {}): Promise<InsightGenerationResult> {
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

  // Anomaly insight
  const anomalies = await detectAnomalies(userId, 2.5)
  if (anomalies.length > 0) {
    const latest = anomalies[anomalies.length - 1]
    insights.push(
      `Unusual spend detected: ${latest.description || 'An expense'} of ${Number(latest.amount).toFixed(2)} on ${dayjs(latest.date).format('YYYY-MM-DD')}. Review and confirm if expected.`
    )
  }

  const structuredInsights = [...insights]
  let llmAdvice: string | undefined

  if (options.includeLLM) {
    const promptContext: AdvicePromptContext = {
      burnRate: {
        dailyRate: burnRate.dailyRate,
        projectedMonthly: burnRate.projectedMonthly,
        totalSpent: burnRate.totalSpent,
        days: burnRate.days,
      },
      categoryBreakdown: breakdown,
      anomalies: anomalies.map(anomaly => ({
        amount: Number(anomaly.amount),
        date: anomaly.date,
        description: anomaly.description,
        categoryName: anomaly.category?.name || null,
      })),
    }

    try {
      const prompt = buildAdvicePrompt(promptContext)
      llmAdvice = await requestLLMAdvice(prompt)
      insights.push(llmAdvice)
    } catch (err) {
      console.error('LLM advice generation failed', err)
    }
  }

  return { insights, structuredInsights, llmAdvice }
}
