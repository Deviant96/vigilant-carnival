import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { transactionSchema } from '@/schemas'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth/get-current-user'

async function ensureOwner(userId: string, transactionId: string) {
  const existing = await prisma.transaction.findUnique({ where: { id: transactionId } })
  if (!existing || existing.userId !== userId) return null
  return existing
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser()
  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const existing = await ensureOwner(user.id, params.id)
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  try {
    const payload = await request.json()
    const parsed = transactionSchema.partial().parse({
      ...payload,
      amount: payload.amount !== undefined ? Number(payload.amount) : undefined,
    })

    const updated = await prisma.transaction.update({
      where: { id: params.id },
      data: {
        description: parsed.description,
        amount: parsed.amount !== undefined ? new Prisma.Decimal(parsed.amount) : undefined,
        categoryId: parsed.categoryId ?? null,
        tags: parsed.tags,
      },
      include: { category: true },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Failed to update transaction', error)
    return NextResponse.json({ error: 'Failed to update transaction' }, { status: 400 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser()
  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const existing = await ensureOwner(user.id, params.id)
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  try {
    await prisma.transaction.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete transaction', error)
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 400 })
  }
}
