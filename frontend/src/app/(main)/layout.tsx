'use client'

import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const { isLoggedIn, authInitialized } = useSelector((state: RootState) => state.user)

    useEffect(() => {
        if (!authInitialized) return
        if (!isLoggedIn) {
            window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`
        }
    }, [authInitialized, isLoggedIn])

    if (!authInitialized || !isLoggedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div
                    className="w-6 h-6 rounded-full border-2 animate-spin"
                    style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }}
                />
            </div>
        )
    }

    return <>{children}</>
}
