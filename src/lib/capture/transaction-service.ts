// Capture Layer - Transaction Service
// Handles creating, updating, and managing transactions

import { prisma } from '@/lib/prisma'
import type { Transaction, Prisma } from '@prisma/client'

export async function createTransaction(data: Prisma.TransactionCreateInput): Promise<Transaction> {
  return await prisma.transaction.create({
    data,
  })
}

export async function updateTransaction(
  id: string,
  data: Prisma.TransactionUpdateInput
): Promise<Transaction> {
  return await prisma.transaction.update({
    where: { id },
    data,
  })
}

export async function deleteTransaction(id: string): Promise<Transaction> {
  return await prisma.transaction.delete({
    where: { id },
  })
}

export async function getTransactions(userId: string, filters?: {
  startDate?: Date
  endDate?: Date
  categoryId?: string
}) {
  return await prisma.transaction.findMany({
    where: {
      userId,
      ...(filters?.startDate && { date: { gte: filters.startDate } }),
      ...(filters?.endDate && { date: { lte: filters.endDate } }),
      ...(filters?.categoryId && { categoryId: filters.categoryId }),
    },
    include: {
      category: true,
    },
    orderBy: {
      date: 'desc',
    },
  })
}
