import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { categorySchema } from '@/schemas'
import { getCurrentUser } from '@/lib/auth/get-current-user'

export async function GET(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = request.nextUrl.searchParams.get('userId') ?? user.id

  try {
    const categories = await prisma.category.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
      select: { id: true, name: true, color: true },
    })
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Failed to fetch categories', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await request.json()
    const parsed = categorySchema.parse({ ...payload, userId: user.id })

    const created = await prisma.category.create({ data: parsed })
    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    console.error('Failed to create category', error)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 400 })
  }
}
