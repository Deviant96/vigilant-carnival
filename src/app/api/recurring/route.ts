import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth/get-current-user'
import { prisma } from '@/lib/prisma'
import { recurringExpenseSchema } from '@/schemas'
import { createRecurringExpense } from '@/lib/capture/recurring-service'

export async function GET() {
  const user = await getCurrentUser()
  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const recurring = await prisma.recurringExpense.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(recurring)
  } catch (error) {
    console.error('Failed to fetch recurring expenses', error)
    return NextResponse.json({ error: 'Failed to fetch recurring expenses' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const raw = await request.json()
    const parsed = recurringExpenseSchema.parse({
      ...raw,
      userId: user.id,
      amount: Number(raw.amount),
      startDate: raw.startDate ? new Date(raw.startDate) : new Date(),
      endDate: raw.endDate ? new Date(raw.endDate) : undefined,
    })

    const created = await createRecurringExpense(parsed)
    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    console.error('Failed to create recurring expense', error)
    return NextResponse.json({ error: 'Failed to create recurring expense' }, { status: 400 })
  }
}
