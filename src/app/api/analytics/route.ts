// API Route - Analytics
import { NextRequest, NextResponse } from 'next/server'
import { getMonthlyTotals, getCategoryBreakdown } from '@/lib/analyze/aggregations'
import { calculateBurnRate } from '@/lib/analyze/burn-rate'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get('userId')
  const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()))
  const month = parseInt(searchParams.get('month') || String(new Date().getMonth() + 1))

  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 })
  }

  try {
    const [monthlyTotals, categoryBreakdown, burnRate] = await Promise.all([
      getMonthlyTotals(userId, year, month),
      getCategoryBreakdown(userId, year, month),
      calculateBurnRate(userId, 30),
    ])

    return NextResponse.json({
      monthlyTotals,
      categoryBreakdown,
      burnRate,
    })
  } catch (err) {
    console.error('Failed to fetch analytics', err)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
