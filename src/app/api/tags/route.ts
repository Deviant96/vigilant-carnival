import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth/get-current-user'

export async function GET(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = request.nextUrl.searchParams.get('userId') ?? user.id

  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      select: { tags: true },
    })

    const tagSet = new Set<string>()
    transactions.forEach(tran => tran.tags.forEach(tag => tagSet.add(tag)))

    return NextResponse.json(Array.from(tagSet).sort())
  } catch (error) {
    console.error('Failed to fetch tags', error)
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 })
  }
}
