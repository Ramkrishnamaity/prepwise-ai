'use client'

import { useTheme } from '@/components/ui/ThemeProvider'
import { Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return <div className="w-9 h-9" />

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="w-9 h-9 flex items-center justify-center rounded-lg border border-border hover:bg-surface-raised transition-colors cursor-pointer"
      aria-label="Toggle theme"
    >
      {theme === 'dark'
        ? <Sun className="w-4 h-4 text-text-secondary" />
        : <Moon className="w-4 h-4 text-text-secondary" />
      }
    </button>
  )
}
