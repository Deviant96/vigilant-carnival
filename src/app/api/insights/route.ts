// API Route - Insights
import { NextRequest, NextResponse } from 'next/server'
import { generateInsights } from '@/lib/insights/generator'
import { getCurrentUser } from '@/lib/auth/get-current-user'

export async function GET(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const insights = await generateInsights(user.id)
    return NextResponse.json({ insights })
  } catch (err) {
    console.error('Failed to generate insights', err)
    return NextResponse.json({ error: 'Failed to generate insights' }, { status: 500 })
  }
}
