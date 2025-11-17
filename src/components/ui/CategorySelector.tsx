'use client'

import { useEffect, useMemo, useState } from 'react'
import { useToast } from './ToastProvider'
import type { CategoryOption } from '@/hooks/useCategories'

interface CategorySelectorProps {
  categories?: CategoryOption[]
  value?: string
  onChange: (categoryId?: string, categoryName?: string) => void
  placeholder?: string
}

const normalize = (value: string) => value.trim().toLowerCase()

const slugify = (value: string) => normalize(value).replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

export function CategorySelector({ categories = [], value, onChange, placeholder }: CategorySelectorProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [localCategories, setLocalCategories] = useState<CategoryOption[]>(categories)
  const [isCreating, setIsCreating] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    setLocalCategories(categories)
  }, [categories])

  useEffect(() => {
    if (!value) {
      setQuery('')
      return
    }
    const match = localCategories.find(category => category.id === value)
    if (match) {
      setQuery(match.name)
    }
  }, [localCategories, value])

  const filtered = useMemo(() => {
    if (!query) return localCategories
    return localCategories.filter(category => normalize(category.name).includes(normalize(query)))
  }, [localCategories, query])

  const exactMatch = useMemo(
    () => localCategories.some(category => normalize(category.name) === normalize(query)),
    [localCategories, query]
  )

  const createCategory = async () => {
    const name = query.trim()
    if (!name) return
    setIsCreating(true)
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug: slugify(name) }),
      })

      if (!response.ok) {
        throw new Error('Failed to create category')
      }

      const created: CategoryOption = await response.json()
      setLocalCategories(prev => [...prev, created])
      onChange(created.id, created.name)
      setQuery(created.name)
      showToast('Category created')
      setOpen(false)
    } catch (error) {
      console.error(error)
      showToast('Unable to create category', 'error')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2 rounded-lg border px-3 py-2">
        <input
          value={query}
          onChange={event => {
            setQuery(event.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          placeholder={placeholder ?? 'Select or type a category'}
          className="w-full border-none bg-transparent text-sm outline-none"
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange(undefined, undefined)
              setQuery('')
            }}
            className="text-xs font-semibold text-slate-500"
          >
            Clear
          </button>
        )}
      </div>
      {open && (filtered.length > 0 || query) && (
        <div className="absolute z-10 mt-1 w-full rounded-lg border bg-white shadow-lg">
          {filtered.map(option => (
            <button
              key={option.id}
              type="button"
              className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-slate-50"
              onMouseDown={event => {
                event.preventDefault()
                onChange(option.id, option.name)
                setQuery(option.name)
                setOpen(false)
              }}
            >
              <span>{option.name}</span>
              {option.color && <span className="h-3 w-3 rounded-full" style={{ backgroundColor: option.color }} />}
            </button>
          ))}

          {query && !exactMatch && (
            <button
              type="button"
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
              onMouseDown={event => {
                event.preventDefault()
                createCategory()
              }}
              disabled={isCreating}
            >
              {isCreating ? 'Creating...' : `Create "${query}"`}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
