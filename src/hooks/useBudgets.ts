'use client'

import { useQuery } from '@tanstack/react-query'

export function useBudgets(userId?: string) {
  return useQuery({
    queryKey: ['budgets', userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      if (!userId) return []
      const res = await fetch(`/api/budgets?userId=${userId}`)
      if (!res.ok) throw new Error('Failed to fetch budgets')
      return res.json()
    },
  })
}
