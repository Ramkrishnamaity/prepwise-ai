'use client'

import { Provider } from 'react-redux'
import { store } from '@/store'
import { ThemeProvider } from '@/components/ui/ThemeProvider'
import AuthInitializer from '@/components/AuthInitializer'

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <ThemeProvider>
                <AuthInitializer />
                {children}
            </ThemeProvider>
        </Provider>
    )
}
