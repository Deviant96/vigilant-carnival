import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth/get-current-user'
import { getTransactions } from '@/lib/capture/transaction-service'
import { generateCSV } from '@/lib/capture/csv-export'

export async function GET(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')

  try {
    // Get transactions with category info for better CSV export
    const transactions = await getTransactions(user.id, {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    })

    const csv = generateCSV(transactions)
    
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="transactions-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (err) {
    console.error('Failed to export transactions', err)
    return NextResponse.json({ error: 'Failed to export transactions' }, { status: 500 })
  }
}
