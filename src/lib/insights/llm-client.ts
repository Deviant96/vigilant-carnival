import dayjs from 'dayjs'

export interface AdvicePromptContext {
  burnRate?: {
    dailyRate: number
    projectedMonthly: number
    totalSpent: number
    days: number
  }
  categoryBreakdown?: Record<string, number>
  anomalies?: Array<{
    amount: number
    date: Date
    description?: string | null
    categoryName?: string | null
  }>
}

const DEFAULT_OPENAI_MODEL = 'gpt-4o-mini'
const DEFAULT_OPENAI_BASE_URL = 'https://api.openai.com/v1'

export function buildAdvicePrompt(context: AdvicePromptContext): string {
  const lines: string[] = []
  lines.push(
    'You are a concise personal finance coach. Provide 3 bullet points of advice based on the data below. Each bullet should include a brief justification and a concrete next step.'
  )
  lines.push('Keep the tone encouraging, focused on cash flow discipline, and avoid generic tips.')

  if (context.burnRate) {
    const { dailyRate, projectedMonthly, totalSpent, days } = context.burnRate
    lines.push(
      `Burn rate: $${dailyRate.toFixed(2)} per day over the last ${days} days; projected monthly spend $${projectedMonthly.toFixed(
        2
      )}; total spent $${totalSpent.toFixed(2)}.`
    )
  }

  if (context.categoryBreakdown && Object.keys(context.categoryBreakdown).length > 0) {
    const sorted = Object.entries(context.categoryBreakdown)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
    const formatted = sorted.map(([name, value]) => `${name}: $${value.toFixed(2)}`).join('; ')
    lines.push(`Top spending categories this month: ${formatted}.`)
  }

  if (context.anomalies && context.anomalies.length > 0) {
    const formatted = context.anomalies
      .slice(0, 3)
      .map(anomaly => {
        const date = dayjs(anomaly.date).format('YYYY-MM-DD')
        const description = anomaly.description || 'Uncategorized expense'
        const category = anomaly.categoryName ? ` in ${anomaly.categoryName}` : ''
        return `${date}: $${anomaly.amount.toFixed(2)} for ${description}${category}`
      })
      .join('; ')
    lines.push(`Recent anomalies: ${formatted}. Highlight risk or mitigation actions.`)
  }

  lines.push('Return only the advice bullets (no preamble), optimized for a budgeting app UI.')
  return lines.join('\n')
}

export async function generateAdvice(prompt: string): Promise<string> {
  const { apiKey, model, baseUrl } = {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || DEFAULT_OPENAI_MODEL,
    baseUrl: process.env.OPENAI_BASE_URL || DEFAULT_OPENAI_BASE_URL,
  }

  if (!apiKey) {
    throw new Error('Missing OPENAI_API_KEY for LLM insights')
  }

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content:
            'You are a budgeting coach. Be specific, concise, and action oriented. Reference the provided spending metrics directly.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 300,
    }),
  })

  if (!response.ok) {
    throw new Error(`LLM provider returned status ${response.status}`)
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }

  const message = data.choices?.[0]?.message?.content?.trim()
  if (!message) {
    throw new Error('LLM provider returned an empty response')
  }

  return message
}
