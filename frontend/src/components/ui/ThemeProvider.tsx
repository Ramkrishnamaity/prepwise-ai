'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextValue {
    theme: Theme
    setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue>({
    theme: 'dark',
    setTheme: () => {},
})

function getInitialTheme(): Theme {
    if (typeof window === 'undefined') return 'dark'
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>(getInitialTheme)

    useEffect(() => {
        const root = document.documentElement
        root.classList.toggle('dark', theme === 'dark')
        localStorage.setItem('theme', theme)
    }, [theme])

    return (
        <ThemeContext.Provider value={{ theme, setTheme: setThemeState }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    return useContext(ThemeContext)
}
