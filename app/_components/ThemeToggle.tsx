'use client'
import { useEffect, useState } from 'react'

const THEMES = ['legacy', 'theme-dark-electric', 'theme-blue-coral'] as const
type Theme = typeof THEMES[number]

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('legacy')

  useEffect(() => {
    const t = (typeof window !== 'undefined' && (localStorage.getItem('theme') as Theme)) || 'legacy'
    setTheme(t)
  }, [])

  const apply = (t: Theme) => {
    if (typeof document === 'undefined') return
    const b = document.body
    THEMES.forEach(x => b.classList.remove(x))
    b.classList.add(t)
    localStorage.setItem('theme', t)
    setTheme(t)
  }

  const Btn = ({ id, label }: { id: Theme; label: string }) => (
    <button
      onClick={() => apply(id)}
      className={
        'px-3 py-1.5 rounded-full text-xs font-semibold transition ' +
        (theme === id ? 'btn-cta' : 'pill-outline theme-muted hover:theme-brand')
      }
      style={{ marginRight: 8 }}
    >
      {label}
    </button>
  )

  return (
    <div className="flex items-center gap-2">
      <Btn id="legacy" label="LEGACY" />
      <Btn id="theme-dark-electric" label="DARK+BLUE" />
      <Btn id="theme-blue-coral" label="BLUE+CORAL" />
    </div>
  )
}
