// API Route - Forecast
import { NextRequest, NextResponse } from 'next/server'
import { forecastMovingAverage } from '@/lib/forecast/moving-average'
import { forecastWeightedAverage } from '@/lib/forecast/weighted-average'
import { getCurrentUser } from '@/lib/auth/get-current-user'

export async function GET(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const method = searchParams.get('method') || 'simple'

  try {
    const forecast = method === 'weighted'
      ? await forecastWeightedAverage(user.id, 30, 30)
      : await forecastMovingAverage(user.id, 30, 30)

    return NextResponse.json(forecast)
  } catch (err) {
    console.error('Failed to generate forecast', err)
    return NextResponse.json({ error: 'Failed to generate forecast' }, { status: 500 })
  }
}
