import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth/auth-options'
import { budgetSchema } from '@/schemas'

const NOT_FOUND = { status: 404 as const }
const BAD_REQUEST = { status: 400 as const }
type SessionWithUser = { user?: { id?: string } }

async function ensureOwner(userId: string, budgetId: string) {
  const budget = await prisma.budget.findUnique({ where: { id: budgetId } })
  if (!budget || budget.userId !== userId) return null
  return budget
}

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = (await getServerSession(authOptions as any)) as SessionWithUser | null
  const userId = session?.user?.id

  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, BAD_REQUEST)
  }

  const budget = await ensureOwner(userId, params.id)
  if (!budget) {
    return NextResponse.json({ error: 'Budget not found' }, NOT_FOUND)
  }

  return NextResponse.json(budget)
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = (await getServerSession(authOptions as any)) as SessionWithUser | null
    const userId = session?.user?.id
    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, BAD_REQUEST)
    }

    const existing = await ensureOwner(userId, params.id)
    if (!existing) {
      return NextResponse.json({ error: 'Budget not found' }, NOT_FOUND)
    }

    const raw = await request.json()
    const parsed = budgetSchema
      .partial()
      .parse({
        ...raw,
        amount: raw.amount ? Number(raw.amount) : undefined,
        startDate: raw.startDate ? new Date(raw.startDate) : undefined,
      })

    const updated = await prisma.budget.update({
      where: { id: params.id },
      data: {
        ...parsed,
        amount: parsed.amount !== undefined ? new Prisma.Decimal(parsed.amount) : undefined,
        startDate: parsed.startDate,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Failed to update budget', error)
    return NextResponse.json({ error: 'Failed to update budget' }, BAD_REQUEST)
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = (await getServerSession(authOptions as any)) as SessionWithUser | null
    const userId = session?.user?.id
    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, BAD_REQUEST)
    }

    const existing = await ensureOwner(userId, params.id)
    if (!existing) {
      return NextResponse.json({ error: 'Budget not found' }, NOT_FOUND)
    }

    await prisma.budget.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Failed to delete budget', error)
    return NextResponse.json({ error: 'Failed to delete budget' }, BAD_REQUEST)
  }
}
