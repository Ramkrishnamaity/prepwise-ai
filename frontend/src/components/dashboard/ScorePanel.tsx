'use client'

import { useState } from 'react'
import { ArrowRight, CheckCircle2, TrendingUp } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import type { ResumeAnalysis } from '@/types/resume'

const MAX_VISIBLE = 3

interface ScorePanelProps {
  analysis:         ResumeAnalysis
  onAnalyzeAnother: () => void
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'var(--color-score-high)'
  if (score >= 60) return 'var(--color-score-mid)'
  return 'var(--color-score-low)'
}

interface ItemListProps {
  items: string[]
  dotColor: string
  onViewAll: () => void
}

function ItemList({ items, dotColor, onViewAll }: ItemListProps) {
  const visible = items.slice(0, MAX_VISIBLE)
  const remaining = items.length - MAX_VISIBLE

  return (
    <>
      <ul className="flex flex-col gap-2">
        {visible.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-text-secondary">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: dotColor }} />
            {item}
          </li>
        ))}
      </ul>
      {remaining > 0 && (
        <button
          onClick={onViewAll}
          className="mt-3 text-xs text-primary hover:underline"
        >
          +{remaining} more
        </button>
      )}
    </>
  )
}


export function ScorePanel({ analysis, onAnalyzeAnother }: ScorePanelProps) {
  const { ats_score, strengths, improvements } = analysis
  const color = getScoreColor(ats_score)
  const [modal, setModal] = useState<'strengths' | 'improvements' | null>(null)

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* ATS Score */}
        <div className="p-4 rounded-2xl border border-border bg-surface">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <p className="text-sm font-medium text-text-secondary">ATS Score</p>
          </div>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-5xl font-bold leading-none" style={{ color }}>
              {ats_score}
            </span>
            <span className="text-text-muted text-base mb-0.5">/100</span>
          </div>
          <div className="h-1.5 rounded-full bg-border overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${ats_score}%`, background: color }}
            />
          </div>
        </div>

        {/* Strengths */}
        <div className="p-4 rounded-2xl border border-border bg-surface">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-score-high" />
            <p className="text-sm font-semibold text-text-primary">Strengths</p>
          </div>
          <ItemList
            items={strengths}
            dotColor="var(--color-score-high)"
            onViewAll={() => setModal('strengths')}
          />
        </div>

        {/* Improvements */}
        <div className="p-4 rounded-2xl border border-border bg-surface">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-score-mid" />
            <p className="text-sm font-semibold text-text-primary">Areas to Improve</p>
          </div>
          <ItemList
            items={improvements}
            dotColor="var(--color-score-mid)"
            onViewAll={() => setModal('improvements')}
          />
        </div>

        {/* CTA */}
        <div className="flex gap-3">
          <button
            onClick={onAnalyzeAnother}
            className="flex-1 py-3 rounded-xl font-semibold text-text-secondary border border-border hover:border-border-strong hover:text-text-primary transition-colors"
          >
            Analyze Another
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-primary-fg bg-primary hover:bg-primary-hover transition-colors">
            Start Interview
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Modals */}
      {modal === 'strengths' && (
        <Modal title="Strengths" onClose={() => setModal(null)}>
          <ul className="flex flex-col gap-3">
            {strengths.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-text-secondary">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-score-high" />
                {item}
              </li>
            ))}
          </ul>
        </Modal>
      )}
      {modal === 'improvements' && (
        <Modal title="Areas to Improve" onClose={() => setModal(null)}>
          <ul className="flex flex-col gap-3">
            {improvements.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-text-secondary">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-score-mid" />
                {item}
              </li>
            ))}
          </ul>
        </Modal>
      )}
    </>
  )
}
