'use client'

import { useMemo, useState } from 'react'

interface TagInputProps {
  value: string[]
  onChange: (next: string[]) => void
  suggestions?: string[]
  placeholder?: string
}

export function TagInput({ value, onChange, suggestions = [], placeholder }: TagInputProps) {
  const [draft, setDraft] = useState('')

  const filteredSuggestions = useMemo(() => {
    const trimmed = draft.trim()
    if (!trimmed) return []
    return suggestions
      .filter(option => option.toLowerCase().includes(trimmed.toLowerCase()))
      .filter(option => !value.includes(option))
  }, [draft, suggestions, value])

  const addTag = (tag: string) => {
    const normalized = tag.trim()
    if (!normalized || value.includes(normalized)) return
    onChange([...value, normalized])
    setDraft('')
  }

  const removeTag = (tag: string) => {
    onChange(value.filter(item => item !== tag))
  }

  return (
    <div className="rounded-lg border px-3 py-2">
      <div className="flex flex-wrap gap-2">
        {value.map(tag => (
          <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs font-medium">
            {tag}
            <button type="button" className="text-slate-500" onClick={() => removeTag(tag)}>
              ×
            </button>
          </span>
        ))}
        <input
          className="flex-1 min-w-[120px] border-none bg-transparent text-sm outline-none"
          value={draft}
          onChange={event => setDraft(event.target.value)}
          onKeyDown={event => {
            if (event.key === 'Enter') {
              event.preventDefault()
              addTag(draft)
            }
          }}
          placeholder={placeholder}
        />
      </div>
      {filteredSuggestions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {filteredSuggestions.map(option => (
            <button
              key={option}
              type="button"
              onMouseDown={event => {
                event.preventDefault()
                addTag(option)
              }}
              className="rounded-full border border-slate-200 px-2 py-1 text-xs text-slate-600"
            >
              + {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
