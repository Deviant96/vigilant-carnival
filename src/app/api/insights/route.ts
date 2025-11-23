// API Route - Insights
import { NextRequest, NextResponse } from 'next/server'
import { generateInsights } from '@/lib/insights/generator'
import { getCurrentUser } from '@/lib/auth/get-current-user'

export async function GET(request: NextRequest) {
  const mode = request.nextUrl.searchParams.get('mode') || 'basic'
  if (!['basic', 'llm'].includes(mode)) {
    return NextResponse.json({ error: 'Invalid mode parameter' }, { status: 400 })
  }

  const user = await getCurrentUser()
  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { insights, structuredInsights, llmAdvice } = await generateInsights(user.id, {
      includeLLM: mode === 'llm',
    })
    return NextResponse.json({ insights, structuredInsights, llmAdvice, mode })
  } catch (err) {
    console.error('Failed to generate insights', err)
    return NextResponse.json({ error: 'Failed to generate insights' }, { status: 500 })
  }
}
