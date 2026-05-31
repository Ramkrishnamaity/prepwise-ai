'use client'

import { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { Mic, ArrowRight, Sparkles, Video } from 'lucide-react'
import Link from 'next/link'

function GoogleIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            <path fill="none" d="M0 0h48v48H0z"/>
        </svg>
    )
}

export default function Hero() {
    const { isLoggedIn, authInitialized } = useSelector((state: RootState) => state.user)
    const [signingIn, setSigningIn] = useState(false)

    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-16 px-4 overflow-hidden">

            {/* Background dot grid */}
            <div
                className="absolute inset-0 pointer-events-none opacity-40"
                style={{
                    backgroundImage: 'radial-gradient(circle, var(--color-border) 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                }}
            />

            {/* Glow blob */}
            <div
                className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none opacity-15"
                style={{ background: 'var(--color-primary)' }}
            />

            {/* Badge */}
            <div className="relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-surface text-xs text-text-muted mb-6">
                <Sparkles className="w-3 h-3 text-primary" />
                AI-Powered · Resume-Based · Real-Time
            </div>

            {/* Headline */}
            <h1 className="relative text-4xl sm:text-5xl lg:text-6xl font-bold text-center max-w-3xl leading-[1.15] tracking-tight">
                AI Interview Prep{' '}
                <span
                    style={{
                        background: 'linear-gradient(135deg, var(--color-primary), #a78bfa)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    Based on Your Resume
                </span>
            </h1>

            {/* Subtext */}
            <p className="relative mt-5 text-base text-text-secondary text-center max-w-xl leading-relaxed">
                Upload your resume, get it scored, and practice with an AI that asks questions
                from your actual experience — not generic ones.
            </p>

            {/* CTA */}
            <div className="relative flex mt-8">
                {!authInitialized ? (
                    <div className="h-11 w-52 rounded-lg bg-surface animate-pulse" />
                ) : isLoggedIn ? (
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-primary-fg text-sm font-medium transition-all shadow-lg"
                        style={{ boxShadow: '0 0 24px color-mix(in srgb, var(--color-primary) 40%, transparent)' }}
                    >
                        Get Started
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                ) : (
                    <a
                        href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
                        onClick={() => setSigningIn(true)}
                        className="inline-flex items-center gap-3 px-5 py-2.5 rounded-lg bg-white hover:bg-gray-50 border border-gray-300 shadow-sm transition-all select-none"
                    >
                        {signingIn ? (
                            <div className="w-[18px] h-[18px] rounded-full border-2 border-gray-300 border-t-blue-500 animate-spin flex-shrink-0" />
                        ) : (
                            <GoogleIcon />
                        )}
                        <span className="text-sm font-medium text-gray-700">
                            {signingIn ? 'Signing in...' : 'Sign in with Google'}
                        </span>
                    </a>
                )}
            </div>

            {/* Interview Mockup Card */}
            <div className="relative mt-16 w-full max-w-4xl">
                <div className="rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden">

                    {/* Card header */}
                    <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-surface-raised">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-score-high animate-pulse" />
                            <span className="text-xs font-medium text-text-secondary">PrepWise AI — Live Interview</span>
                        </div>
                        <span className="text-xs text-text-muted">Question 3 / 8</span>
                    </div>

                    {/* Card body — split layout */}
                    <div className="flex flex-col sm:flex-row">

                        {/* Left: Camera feed */}
                        <div className="w-full sm:w-56 p-4 flex flex-col gap-3">
                            <div className="relative w-full aspect-video rounded-xl bg-surface-raised border border-border overflow-hidden flex items-center justify-center">
                                <div
                                    className="absolute inset-0 opacity-20"
                                    style={{ background: 'radial-gradient(ellipse at center, var(--color-primary), transparent)' }}
                                />
                                <div className="relative flex flex-col items-center gap-2">
                                    <div className="w-10 h-10 rounded-full bg-surface-raised border border-border flex items-center justify-center">
                                        <Video className="w-4 h-4 text-text-muted" />
                                    </div>
                                    <span className="text-xs text-text-muted">Your Camera</span>
                                </div>
                                <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-error animate-pulse" />
                                    <span className="text-white text-[10px] font-medium">LIVE</span>
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="hidden sm:block w-px bg-border" />

                        {/* Right: Q&A panel */}
                        <div className="flex-1 px-6 py-6 flex flex-col justify-between gap-5">
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">
                                    AI
                                </div>
                                <div className="bg-surface-raised rounded-2xl rounded-tl-none px-4 py-3">
                                    <p className="text-sm text-text-primary leading-relaxed">
                                        "You mentioned building a real-time data pipeline at TechCorp.
                                        Walk me through the biggest bottleneck you faced and how you resolved it."
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-surface-raised">
                                <div className="w-8 h-8 rounded-full bg-error/10 flex items-center justify-center flex-shrink-0">
                                    <Mic className="w-4 h-4 text-error" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-text-primary">Recording your answer...</p>
                                    <div className="mt-1.5 flex gap-0.5 items-end h-4">
                                        {[3, 5, 8, 4, 7, 5, 9, 3, 6, 4, 8, 5].map((h, i) => (
                                            <div
                                                key={i}
                                                className="w-1 rounded-full bg-primary opacity-70"
                                                style={{ height: `${h * 2}px` }}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <span className="text-xs text-text-muted font-mono">0:42</span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Glow under card */}
                <div
                    className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 blur-xl opacity-30 rounded-full"
                    style={{ background: 'var(--color-primary)' }}
                />
            </div>
        </section>
    )
}
