// API Route - Analytics
import { NextRequest, NextResponse } from 'next/server'
import { getMonthlyTotals, getCategoryBreakdown } from '@/lib/analyze/aggregations'
import { calculateBurnRate } from '@/lib/analyze/burn-rate'
import { getCurrentUser } from '@/lib/auth/get-current-user'

export async function GET(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()))
  const month = parseInt(searchParams.get('month') || String(new Date().getMonth() + 1))

  try {
    const [monthlyTotals, categoryBreakdown, burnRate] = await Promise.all([
      getMonthlyTotals(user.id, year, month),
      getCategoryBreakdown(user.id, year, month),
      calculateBurnRate(user.id, 30),
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
