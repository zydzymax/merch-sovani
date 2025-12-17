'use client'

import { useRouter, useSearchParams } from 'next/navigation'

const SORT_OPTIONS = [
  { value: 'chances_desc', label: 'Больше шансов' },
  { value: 'new', label: 'Новинки' },
  { value: 'price_asc', label: 'Цена: по возрастанию' },
  { value: 'price_desc', label: 'Цена: по убыванию' },
]

export function SortDropdown() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSort = searchParams.get('sort') || 'new'

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', value)
    router.push(`?${params.toString()}`)
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <label
        htmlFor="sort"
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: 'var(--text-muted)'
        }}
      >
        Сортировать:
      </label>
      <select
        id="sort"
        value={currentSort}
        onChange={(e) => handleSortChange(e.target.value)}
        style={{
          padding: '10px 16px',
          paddingRight: 36,
          background: 'var(--surface)',
          border: '1px solid var(--ring)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--text)',
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center',
          transition: 'border-color 0.2s ease'
        }}
        onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
        onBlur={(e) => e.currentTarget.style.borderColor = 'var(--ring)'}
      >
        {SORT_OPTIONS.map((option) => (
          <option
            key={option.value}
            value={option.value}
            style={{
              background: 'var(--surface)',
              color: 'var(--text)'
            }}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
