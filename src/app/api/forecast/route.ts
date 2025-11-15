// API Route - Forecast
import { NextRequest, NextResponse } from 'next/server'
import { forecastMovingAverage } from '@/lib/forecast/moving-average'
import { forecastWeightedAverage } from '@/lib/forecast/weighted-average'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get('userId')
  const method = searchParams.get('method') || 'simple'

  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 })
  }

  try {
    const forecast = method === 'weighted'
      ? await forecastWeightedAverage(userId, 30, 30)
      : await forecastMovingAverage(userId, 30, 30)

    return NextResponse.json(forecast)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate forecast' }, { status: 500 })
  }
}
