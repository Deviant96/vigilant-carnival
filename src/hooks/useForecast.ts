'use client'

import { useQuery } from '@tanstack/react-query'

export function useForecast(userId?: string, method: 'simple' | 'weighted' = 'simple') {
  return useQuery({
    queryKey: ['forecast', userId, method],
    enabled: Boolean(userId),
    queryFn: async () => {
      if (!userId) return null
      const params = new URLSearchParams({ userId, method })
      const res = await fetch(`/api/forecast?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch forecast')
      return res.json()
    },
  })
}
