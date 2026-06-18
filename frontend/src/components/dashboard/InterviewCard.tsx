'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { InterviewRecord } from '@/types/analysis'

const STATUS_CONFIG = {
    0: { label: 'Pending',     dot: 'bg-text-muted',  badge: 'bg-border text-text-muted' },
    1: { label: 'In Progress', dot: 'bg-primary',     badge: 'bg-primary/10 text-primary' },
    2: { label: 'Completed',   dot: 'bg-score-high',  badge: 'bg-score-high/10 text-score-high' },
    3: { label: 'Absconded',   dot: 'bg-warning',     badge: 'bg-warning/10 text-warning' },
} as const

function getScoreColor(score: number): string {
    if (score >= 80) return 'var(--color-score-high)'
    if (score >= 60) return 'var(--color-score-mid)'
    return 'var(--color-score-low)'
}

function ScoreBar({ label, value }: { label: string; value: number }) {
    return (
        <div className="flex items-center gap-3">
            <span className="text-xs text-text-muted w-28 shrink-0">{label}</span>
            <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
                <div
                    className="h-full rounded-full"
                    style={{ width: `${value}%`, background: getScoreColor(value) }}
                />
            </div>
            <span className="text-xs font-semibold w-6 text-right shrink-0" style={{ color: getScoreColor(value) }}>
                {value}
            </span>
        </div>
    )
}

interface Props {
    interview: InterviewRecord
}

export default function InterviewCard({ interview }: Props) {
    const [expanded, setExpanded] = useState(false)
    const config     = STATUS_CONFIG[interview.status]
    const isCompleted = interview.status === 2
    const hasDetails  = isCompleted && (interview.strengths.length > 0 || interview.improvements.length > 0)

    return (
        <div className="rounded-xl border border-border bg-surface-raised overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-2.5 p-3">
                <span className={`w-2 h-2 rounded-full shrink-0 ${config.dot}`} />
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.badge}`}>
                    {config.label}
                </span>

                <div className="flex items-center gap-2 ml-auto">
                    {isCompleted && (
                        <span className="text-xs font-semibold" style={{ color: getScoreColor(interview.scores.overAll) }}>
                            Overall {interview.scores.overAll}/100
                        </span>
                    )}
                    {hasDetails && (
                        <button
                            onClick={() => setExpanded(p => !p)}
                            className="p-0.5 rounded text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                        >
                            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                    )}
                </div>
            </div>

            {/* Score bars + feedback — completed only */}
            {isCompleted && (
                <div className="px-3 pb-3 flex flex-col gap-2">
                    <ScoreBar label="Communication" value={interview.scores.communication} />
                    <ScoreBar label="Technical"     value={interview.scores.technical} />
                </div>
            )}

            {/* Expanded: strengths/improvements */}
            {expanded && hasDetails && (
                <div className="border-t border-border px-3 py-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {interview.strengths.length > 0 && (
                            <div>
                                <p className="text-xs font-semibold text-text-primary mb-1.5">Strengths</p>
                                <ul className="flex flex-col gap-1">
                                    {interview.strengths.map((s, i) => (
                                        <li key={i} className="flex items-start gap-1.5 text-xs text-text-secondary">
                                            <span className="w-1.5 h-1.5 rounded-full bg-score-high mt-0.5 shrink-0" />
                                            {s}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {interview.improvements.length > 0 && (
                            <div>
                                <p className="text-xs font-semibold text-text-primary mb-1.5">Improvements</p>
                                <ul className="flex flex-col gap-1">
                                    {interview.improvements.map((s, i) => (
                                        <li key={i} className="flex items-start gap-1.5 text-xs text-text-secondary">
                                            <span className="w-1.5 h-1.5 rounded-full bg-score-mid mt-0.5 shrink-0" />
                                            {s}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
