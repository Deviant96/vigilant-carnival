// API Route - Insights
import { NextRequest, NextResponse } from 'next/server'
import { generateInsights } from '@/lib/insights/generator'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 })
  }

  try {
    const insights = await generateInsights(userId)
    return NextResponse.json({ insights })
  } catch (err) {
    console.error('Failed to generate insights', err)
    return NextResponse.json({ error: 'Failed to generate insights' }, { status: 500 })
  }
}
