// API Route - Transactions (list + create)
import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { getTransactions, createTransaction } from '@/lib/capture/transaction-service'
import { autoCategorizeTran } from '@/lib/capture/auto-category'
import { transactionSchema } from '@/schemas'
import { getCurrentUser } from '@/lib/auth/get-current-user'

export async function GET(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')
  const categoryId = searchParams.get('categoryId')

  try {
    const transactions = await getTransactions(user.id, {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      categoryId: categoryId ?? undefined,
    })
    return NextResponse.json(transactions)
  } catch (err) {
    console.error('Failed to fetch transactions', err)
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await request.json()
    const parsed = transactionSchema.parse({
      ...payload,
      userId: user.id,
      amount: Number(payload.amount),
      date: payload.date ? new Date(payload.date) : new Date(),
      tags: Array.isArray(payload.tags)
        ? payload.tags
        : typeof payload.tags === 'string'
          ? payload.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
          : [],
    })

    const resolvedCategoryId =
      parsed.categoryId ||
      (await autoCategorizeTran(user.id, parsed.description || '', parsed.tags, parsed.paymentMethod)) ||
      undefined

    const transaction = await createTransaction({
      ...parsed,
      categoryId: resolvedCategoryId,
      amount: new Prisma.Decimal(parsed.amount),
      date: parsed.date,
      tags: parsed.tags,
    })

    return NextResponse.json(transaction, { status: 201 })
  } catch (err) {
    console.error('Failed to create transaction', err)
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 400 })
  }
}
