'use client'

import { useQuery } from '@tanstack/react-query'

export interface CategoryOption {
  id: string
  name: string
  color?: string | null
}

export function useCategories(userId?: string) {
  return useQuery({
    queryKey: ['categories', userId],
    enabled: Boolean(userId),
    queryFn: async (): Promise<CategoryOption[]> => {
      if (!userId) return []
      const res = await fetch(`/api/categories?userId=${userId}`)
      if (!res.ok) throw new Error('Failed to fetch categories')
      return res.json()
    },
  })
}
