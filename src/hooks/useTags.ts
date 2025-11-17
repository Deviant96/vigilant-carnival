'use client'

import { useQuery } from '@tanstack/react-query'

export function useTags(userId?: string) {
  return useQuery({
    queryKey: ['tags', userId],
    enabled: Boolean(userId),
    queryFn: async (): Promise<string[]> => {
      if (!userId) return []
      const res = await fetch(`/api/tags?userId=${userId}`)
      if (!res.ok) throw new Error('Failed to fetch tags')
      return res.json()
    },
  })
}
