'use client'

import { useQuery } from '@tanstack/react-query'

export function useInsights(userId?: string) {
  return useQuery({
    queryKey: ['insights', userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      if (!userId) return { insights: [] }
      const res = await fetch(`/api/insights?userId=${userId}`)
      if (!res.ok) throw new Error('Failed to fetch insights')
      return res.json()
    },
  })
}
