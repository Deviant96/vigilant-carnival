import type { PaymentMethod } from '@prisma/client'

export interface TransactionRow {
  id: string
  amount: number
  date: string
  description: string
  // category identifier to support editing
  categoryId?: string
  categoryName?: string
  paymentMethod: PaymentMethod
  tags: string[]
  isAnomaly?: boolean
}

export interface TransactionFilterState {
  search: string
  category: string
  paymentMethod: 'ALL' | PaymentMethod
  startDate?: string
  endDate?: string
  onlyAnomalies: boolean
}
