import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/prisma'
import { budgetSchema } from '@/schemas'
import { authOptions } from '@/lib/auth/auth-options'

const BAD_REQUEST = { status: 400 as const }
type SessionWithUser = { user?: { id?: string } }

async function resolveUserId(request: NextRequest) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = (await getServerSession(authOptions as any)) as SessionWithUser | null
  const queryUserId = request.nextUrl.searchParams.get('userId')
  const sessionUserId = session?.user && 'id' in session.user ? (session.user.id as string | undefined) : undefined
  return sessionUserId ?? queryUserId
}

export async function GET(request: NextRequest) {
  const userId = await resolveUserId(request)

  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, BAD_REQUEST)
  }

  try {
    const budgets = await prisma.budget.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(budgets)
  } catch (error) {
    console.error('Failed to fetch budgets', error)
    return NextResponse.json({ error: 'Failed to fetch budgets' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await resolveUserId(request)
    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, BAD_REQUEST)
    }

    const raw = await request.json()
    const parsed = budgetSchema.parse({
      ...raw,
      userId,
      amount: Number(raw.amount),
      startDate: raw.startDate ? new Date(raw.startDate) : new Date(),
    })

    const created = await prisma.budget.create({
      data: {
        ...parsed,
        amount: new Prisma.Decimal(parsed.amount),
        startDate: parsed.startDate,
      },
    })

    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    console.error('Failed to create budget', error)
    return NextResponse.json({ error: 'Failed to create budget' }, BAD_REQUEST)
  }
}
