'use client'

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { PaymentMethod } from '@prisma/client'

export interface TransactionFilters {
  startDate?: string
  endDate?: string
  categoryId?: string
  paymentMethod?: PaymentMethod
  search?: string
}

interface ApiTransactionSummary {
  description?: string
}

export function useTransactions(userId?: string, filters?: TransactionFilters) {
  const queryString = useMemo(() => {
    const params = new URLSearchParams()
    if (!userId) return params
    params.set('userId', userId)
    if (filters?.startDate) params.set('startDate', filters.startDate)
    if (filters?.endDate) params.set('endDate', filters.endDate)
    if (filters?.categoryId) params.set('categoryId', filters.categoryId)
    return params
  }, [userId, filters?.startDate, filters?.endDate, filters?.categoryId])

  return useQuery({
    queryKey: ['transactions', userId, filters],
    enabled: Boolean(userId),
    queryFn: async () => {
      if (!userId) return []
      const res = await fetch(`/api/transactions?${queryString.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch transactions')
      const data: ApiTransactionSummary[] = await res.json()
      if (filters?.search) {
        const search = filters.search.toLowerCase()
        return data.filter(transaction => transaction.description?.toLowerCase().includes(search))
      }
      return data
    },
  })
}
