'use client'

import { useState } from 'react'
import { FileText, ChevronDown, ChevronUp, Mic } from 'lucide-react'
import type { PastAnalysis } from '@/types/analysis'
import InterviewCard from './InterviewCard'

const PREVIEW_COUNT = 3


function getScoreColor(score: number): string {
    if (score >= 80) return 'var(--color-score-high)'
    if (score >= 60) return 'var(--color-score-mid)'
    return 'var(--color-score-low)'
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

interface Props {
    analysis: PastAnalysis
    index:    number
}

export default function ResumeAnalysisCard({ analysis, index }: Props) {
    const [open,       setOpen]       = useState(false)
    const [showAllS,   setShowAllS]   = useState(false)
    const [showAllI,   setShowAllI]   = useState(false)

    const scoreColor = getScoreColor(analysis.ats_score)

    const strengthsVisible    = showAllS ? analysis.strengths    : analysis.strengths.slice(0, PREVIEW_COUNT)
    const improvementsVisible = showAllI ? analysis.improvements : analysis.improvements.slice(0, PREVIEW_COUNT)

    return (
        <div className="rounded-2xl border border-border bg-surface overflow-hidden">

            {/* Header — always visible */}
            <div className="p-4">
                <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-surface-raised flex items-center justify-center shrink-0 mt-0.5">
                        <FileText className="w-4 h-4 text-primary" />
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-text-primary">Resume #{index + 1}</p>
                                <Mic className="w-3 h-3 text-text-muted" />
                                <span className="text-xs text-text-muted">
                                    {analysis.interviews.length} interview{analysis.interviews.length > 1 ? 's' : ''}
                                </span>
                            </div>
                            <span className="text-xs text-text-muted shrink-0">{formatDate(analysis.created_at)}</span>
                        </div>

                        {/* ATS score bar */}
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-semibold shrink-0" style={{ color: scoreColor }}>
                                ATS {analysis.ats_score}/100
                            </span>
                            <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
                                <div
                                    className="h-full rounded-full"
                                    style={{ width: `${analysis.ats_score}%`, background: scoreColor }}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setOpen(p => !p)}
                        className="shrink-0 p-1 rounded-lg hover:bg-surface-raised transition-colors text-text-muted hover:text-text-primary cursor-pointer mt-0.5"
                    >
                        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* Expanded content */}
            {open && (
                <div className="border-t border-border">

                    {/* Strengths & Improvements */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
                        <div>
                            <p className="text-xs font-semibold text-text-primary mb-2">
                                Strengths
                            </p>
                            <ul className="flex flex-col gap-1.5">
                                {strengthsVisible.map((s, i) => (
                                    <li key={i} className="flex items-start gap-1.5 text-xs text-text-secondary">
                                        <span className="w-1.5 h-1.5 rounded-full bg-score-high mt-0.5 shrink-0" />
                                        {s}
                                    </li>
                                ))}
                            </ul>
                            {analysis.strengths.length > PREVIEW_COUNT && (
                                <button
                                    onClick={() => setShowAllS(p => !p)}
                                    className="mt-2 text-xs text-primary hover:underline cursor-pointer"
                                >
                                    {showAllS ? 'Show less' : `+ ${analysis.strengths.length - PREVIEW_COUNT} more`}
                                </button>
                            )}
                        </div>

                        <div>
                            <p className="text-xs font-semibold text-text-primary mb-2">
                                Improvements
                            </p>
                            <ul className="flex flex-col gap-1.5">
                                {improvementsVisible.map((s, i) => (
                                    <li key={i} className="flex items-start gap-1.5 text-xs text-text-secondary">
                                        <span className="w-1.5 h-1.5 rounded-full bg-score-mid mt-0.5 shrink-0" />
                                        {s}
                                    </li>
                                ))}
                            </ul>
                            {analysis.improvements.length > PREVIEW_COUNT && (
                                <button
                                    onClick={() => setShowAllI(p => !p)}
                                    className="mt-2 text-xs text-primary hover:underline cursor-pointer"
                                >
                                    {showAllI ? 'Show less' : `+ ${analysis.improvements.length - PREVIEW_COUNT} more`}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Interviews */}
                    {analysis.interviews.length > 0 && (
                        <div className="px-4 pb-4">
                            <p className="text-xs font-semibold text-text-primary mb-2">
                                Interviews
                            </p>
                            <div className="flex flex-col gap-2">
                                {analysis.interviews.map(iv => (
                                    <InterviewCard key={iv._id} interview={iv} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
