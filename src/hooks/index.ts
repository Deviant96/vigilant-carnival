// Custom hooks
'use client'

import { useQuery } from '@tanstack/react-query'

export function useTransactions(userId: string) {
  return useQuery({
    queryKey: ['transactions', userId],
    queryFn: async () => {
      const res = await fetch(`/api/transactions?userId=${userId}`)
      if (!res.ok) throw new Error('Failed to fetch transactions')
      return res.json()
    },
  })
}

export function useAnalytics(userId: string, year: number, month: number) {
  return useQuery({
    queryKey: ['analytics', userId, year, month],
    queryFn: async () => {
      const res = await fetch(`/api/analytics?userId=${userId}&year=${year}&month=${month}`)
      if (!res.ok) throw new Error('Failed to fetch analytics')
      return res.json()
    },
  })
}

export function useForecast(userId: string, method: string = 'simple') {
  return useQuery({
    queryKey: ['forecast', userId, method],
    queryFn: async () => {
      const res = await fetch(`/api/forecast?userId=${userId}&method=${method}`)
      if (!res.ok) throw new Error('Failed to fetch forecast')
      return res.json()
    },
  })
}

export function useInsights(userId: string) {
  return useQuery({
    queryKey: ['insights', userId],
    queryFn: async () => {
      const res = await fetch(`/api/insights?userId=${userId}`)
      if (!res.ok) throw new Error('Failed to fetch insights')
      return res.json()
    },
  })
}
