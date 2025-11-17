// Zod schemas for validation
import { z } from 'zod'

export const transactionSchema = z.object({
  userId: z.string(),
  categoryId: z.string().optional(),
  amount: z.number().positive(),
  currency: z.string().default('IDR'),
  description: z.string().optional(),
  tags: z.array(z.string()).default([]),
  date: z.date(),
  paymentMethod: z.enum([
    'CASH',
    'DEBIT_CARD',
    'CREDIT_CARD',
    'E_WALLET',
    'BANK_TRANSFER',
    'AUTO_DEBIT',
    'OTHER',
  ]),
  isRecurring: z.boolean().default(false),
  recurringId: z.string().optional(),
})

export const categorySchema = z.object({
  userId: z.string(),
  name: z.string().min(1),
  slug: z.string().min(1),
  color: z.string().optional(),
  icon: z.string().optional(),
  isFixed: z.boolean().default(false),
})

export const budgetSchema = z.object({
  userId: z.string(),
  categoryId: z.string().optional(),
  name: z.string().min(1),
  period: z.enum(['MONTHLY', 'WEEKLY', 'YEARLY']),
  amount: z.number().positive(),
  currency: z.string().default('IDR'),
  startDate: z.date(),
  isActive: z.boolean().default(true),
})

export const recurringExpenseSchema = z.object({
  userId: z.string(),
  categoryId: z.string().optional(),
  amount: z.number().positive(),
  currency: z.string().default('IDR'),
  description: z.string().optional(),
  tags: z.array(z.string()).default([]),
  paymentMethod: z.enum([
    'CASH',
    'DEBIT_CARD',
    'CREDIT_CARD',
    'E_WALLET',
    'BANK_TRANSFER',
    'AUTO_DEBIT',
    'OTHER',
  ]),
  startDate: z.date(),
  interval: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']),
  intervalEvery: z.number().int().min(1).default(1),
  endType: z.enum(['NEVER', 'BY_DATE', 'BY_COUNT']).default('NEVER'),
  endDate: z.date().optional(),
  remainingCount: z.number().int().optional(),
})

export type TransactionInput = z.infer<typeof transactionSchema>
export type CategoryInput = z.infer<typeof categorySchema>
export type BudgetInput = z.infer<typeof budgetSchema>
export type RecurringExpenseInput = z.infer<typeof recurringExpenseSchema>
