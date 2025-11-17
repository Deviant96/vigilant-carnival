import dayjs from 'dayjs'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { RecurringExpenseInput } from '@/schemas'

function nextOccurrence(startDate: Date, interval: string, intervalEvery: number, from?: Date) {
  const base = dayjs(from ?? startDate)
  switch (interval) {
    case 'DAILY':
      return base.add(intervalEvery, 'day')
    case 'WEEKLY':
      return base.add(intervalEvery, 'week')
    case 'YEARLY':
      return base.add(intervalEvery, 'year')
    case 'MONTHLY':
    default:
      return base.add(intervalEvery, 'month')
  }
}

export async function createRecurringExpense(data: RecurringExpenseInput) {
  return prisma.recurringExpense.create({
    data: {
      ...data,
      amount: new Prisma.Decimal(data.amount),
    },
  })
}

export async function generateRecurringTransactions(userId: string) {
  const now = dayjs()
  const active = await prisma.recurringExpense.findMany({ where: { userId, isActive: true } })
  const createdIds: string[] = []

  for (const recurring of active) {
    let lastGenerated = recurring.lastGeneratedAt ? dayjs(recurring.lastGeneratedAt) : dayjs(recurring.startDate)

    while (true) {
      const candidate = nextOccurrence(recurring.startDate, recurring.interval, recurring.intervalEvery, lastGenerated)
      if (candidate.isAfter(now, 'day')) break

      if (recurring.endType === 'BY_DATE' && recurring.endDate && candidate.isAfter(dayjs(recurring.endDate), 'day')) {
        break
      }
      if (recurring.endType === 'BY_COUNT' && recurring.remainingCount !== null && recurring.remainingCount !== undefined) {
        if (recurring.remainingCount <= 0) break
        await prisma.recurringExpense.update({
          where: { id: recurring.id },
          data: { remainingCount: recurring.remainingCount - 1 },
        })
      }

      const created = await prisma.transaction.create({
        data: {
          userId,
          recurringId: recurring.id,
          categoryId: recurring.categoryId,
          amount: new Prisma.Decimal(recurring.amount),
          currency: recurring.currency,
          description: recurring.description,
          tags: recurring.tags,
          paymentMethod: recurring.paymentMethod,
          date: candidate.toDate(),
          isRecurring: true,
        },
      })
      createdIds.push(created.id)
      lastGenerated = candidate
      await prisma.recurringExpense.update({
        where: { id: recurring.id },
        data: { lastGeneratedAt: candidate.toDate() },
      })
    }
  }

  return createdIds
}
