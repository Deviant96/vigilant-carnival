import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth/get-current-user'
import { generateRecurringTransactions } from '@/lib/capture/recurring-service'

export async function POST() {
  const user = await getCurrentUser()
  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const created = await generateRecurringTransactions(user.id)
    return NextResponse.json({ created })
  } catch (error) {
    console.error('Failed to generate recurring transactions', error)
    return NextResponse.json({ error: 'Failed to generate recurring transactions' }, { status: 500 })
  }
}
