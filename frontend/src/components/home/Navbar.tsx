'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BrainCircuit, LogOut } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store'
import { clearUser } from '@/store/slices/userSlice'
import authApi from '@/services/api/auth.api'
import ThemeToggle from '@/components/ui/ThemeToggle'

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const dispatch                = useDispatch()
    const { user, isLoggedIn }    = useSelector((state: RootState) => state.user)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const handleLogout = async () => {
        await authApi.logout()
        dispatch(clearUser())
    }

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrolled ? 'bg-surface/80 backdrop-blur-md border-b border-border shadow-sm' : ''
        }`}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                            <BrainCircuit className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-semibold text-text-primary text-base">
                            PrepWise <span className="text-primary">AI</span>
                        </span>
                    </Link>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <ThemeToggle />

                        {isLoggedIn && user && (
                            <div
                                className="relative"
                                onMouseEnter={() => setMenuOpen(true)}
                                onMouseLeave={() => setMenuOpen(false)}
                            >
                                <button className="flex items-center cursor-pointer focus:outline-none" aria-label="Account menu">
                                    {user.picture ? (
                                        <img
                                            src={user.picture}
                                            alt={user.name}
                                            className="w-8 h-8 rounded-full ring-2 ring-primary"
                                            referrerPolicy="no-referrer"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-primary ring-2 ring-primary flex items-center justify-center text-white text-xs font-semibold">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </button>

                                {menuOpen && (
                                    <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-surface shadow-xl py-1">
                                        <div className="px-4 py-3 border-b border-border">
                                            <p className="text-sm font-medium text-text-primary truncate">{user.name}</p>
                                            <p className="text-xs text-text-muted truncate mt-0.5">{user.email}</p>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-raised transition-colors cursor-pointer"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </nav>
    )
}
