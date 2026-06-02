'use client'

import { ArrowRight, CheckCircle2, TrendingUp } from 'lucide-react'
import type { ResumeAnalysis } from '@/types/resume'

interface ScorePanelProps {
  analysis: ResumeAnalysis
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'var(--color-score-high)'
  if (score >= 60) return 'var(--color-score-mid)'
  return 'var(--color-score-low)'
}

export function ScorePanel({ analysis }: ScorePanelProps) {
  const { ats_score, strengths, improvements } = analysis
  const color = getScoreColor(ats_score)

  return (
    <div className="flex flex-col gap-4">
      {/* ATS Score */}
      <div className="p-6 rounded-2xl border border-border bg-surface">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="w-4 h-4 text-primary" />
          <p className="text-sm font-medium text-text-secondary">ATS Score</p>
        </div>
        <div className="flex items-end gap-2 mb-4">
          <span className="text-7xl font-bold leading-none" style={{ color }}>
            {ats_score}
          </span>
          <span className="text-text-muted text-xl mb-1">/100</span>
        </div>
        <div className="h-2 rounded-full bg-border overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${ats_score}%`, background: color }}
          />
        </div>
      </div>

      {/* Strengths */}
      <div className="p-5 rounded-2xl border border-border bg-surface">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-4 h-4 text-score-high" />
          <p className="text-sm font-semibold text-text-primary">Strengths</p>
        </div>
        <ul className="flex flex-col gap-2.5">
          {strengths.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-text-secondary">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-score-high flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Improvements */}
      <div className="p-5 rounded-2xl border border-border bg-surface">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-score-mid" />
          <p className="text-sm font-semibold text-text-primary">Areas to Improve</p>
        </div>
        <ul className="flex flex-col gap-2.5">
          {improvements.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-text-secondary">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-score-mid flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <button className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-primary-fg bg-primary hover:bg-primary-hover transition-colors">
        Start Interview
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  )
}
