'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, Loader2, FileText, ChevronRight, Mic } from 'lucide-react'
import { ResumeUploader } from '@/components/dashboard/ResumeUploader'
import { PDFPreview } from '@/components/dashboard/PDFPreview'
import { ScorePanel } from '@/components/dashboard/ScorePanel'
import type { ResumeAnalysis } from '@/types/resume'

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab   = 'new' | 'history'
type Stage = 'upload' | 'analyzing' | 'results'

interface AnalysisRecord {
  id: string
  filename: string
  ats_score: number
  date: string
  interview: { status: string; score: number } | null
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_ANALYSIS: ResumeAnalysis = {
  ats_score: 72,
  strengths: [
    'Clear section formatting and consistent layout',
    'Strong keyword density for a tech role',
    'Relevant skills are well-listed and easy to scan',
    'Education section is complete with degree and institution',
  ],
  improvements: [
    'Add a professional summary at the top',
    'Quantify achievements with numbers and metrics',
    'Include a LinkedIn or GitHub URL',
    'Use stronger action verbs (e.g. "Built" instead of "Worked on")',
  ],
}

const MOCK_RECORDS: AnalysisRecord[] = [
  { id: '1', filename: 'resume_v2.pdf',    ats_score: 72, date: 'Jun 1, 2026',  interview: { status: 'Completed', score: 78 } },
  { id: '2', filename: 'resume_v1.pdf',    ats_score: 58, date: 'May 28, 2026', interview: null },
  { id: '3', filename: 'resume_draft.pdf', ats_score: 45, date: 'May 20, 2026', interview: { status: 'Completed', score: 60 } },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getScoreColor(score: number): string {
  if (score >= 80) return 'var(--color-score-high)'
  if (score >= 60) return 'var(--color-score-mid)'
  return 'var(--color-score-low)'
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [tab,        setTab]        = useState<Tab>('new')
  const [stage,      setStage]      = useState<Stage>('upload')
  const [file,       setFile]       = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [analysis,   setAnalysis]   = useState<ResumeAnalysis | null>(null)

  const handleFileSelect = (f: File) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setFile(f)
    setPreviewUrl(URL.createObjectURL(f))
  }

  const handleFileRemove = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setFile(null)
    setPreviewUrl(null)
  }

  const handleAnalyze = async () => {
    setStage('analyzing')
    await new Promise(resolve => setTimeout(resolve, 2500))
    setAnalysis(MOCK_ANALYSIS)
    setStage('results')
  }

  const handleTabChange = (t: Tab) => {
    if (t === 'new' && tab !== 'new') {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setFile(null)
      setPreviewUrl(null)
      setAnalysis(null)
      setStage('upload')
    }
    setTab(t)
  }

  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl) }
  }, [])

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Tabs — bordered button style */}
        <div className="flex items-center gap-2 mb-6">
          {(['new', 'history'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => handleTabChange(t)}
              className={`px-5 py-2 rounded-lg text-sm font-medium border transition-all ${
                tab === t
                  ? 'border-primary text-primary bg-primary/10'
                  : 'border-border text-text-muted hover:border-border-strong hover:text-text-primary bg-transparent'
              }`}
            >
              {t === 'new' ? 'New Analysis' : 'Past Analyses'}
            </button>
          ))}
        </div>

        {/* ── Tab: New Analysis ── */}
        {tab === 'new' && (
          <>
            {stage === 'upload' && (
              <div className="w-full flex flex-col gap-4">
                <div className="mb-2">
                  <h2 className="text-base font-semibold text-text-primary">Upload your resume</h2>
                  <p className="text-sm text-text-secondary mt-0.5">
                    Get your ATS score, strengths, and areas to improve — then start a mock interview.
                  </p>
                </div>
                <ResumeUploader
                  file={file}
                  onFileSelect={handleFileSelect}
                  onFileRemove={handleFileRemove}
                />
                {file && (
                  <button
                    onClick={handleAnalyze}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-primary-fg bg-primary hover:bg-primary-hover transition-colors"
                  >
                    Analyze Resume
                    <ArrowRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}

            {stage === 'analyzing' && (
              <div className="flex flex-col items-center justify-center py-36 gap-5">
                <div className="w-20 h-20 rounded-2xl bg-surface flex items-center justify-center border border-border">
                  <Loader2 className="w-9 h-9 text-primary animate-spin" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-text-primary">Analyzing your resume...</p>
                  <p className="text-sm text-text-muted mt-1">This usually takes a few seconds</p>
                </div>
              </div>
            )}

            {stage === 'results' && analysis && previewUrl && (
              <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-10 gap-8">
                <PDFPreview url={previewUrl} />
                <ScorePanel analysis={analysis} />
              </div>
            )}
          </>
        )}

        {/* ── Tab: Past Analyses ── */}
        {tab === 'history' && (
          <div className="flex flex-col gap-3">
            {MOCK_RECORDS.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-border gap-3 text-text-muted">
                <FileText className="w-8 h-8" />
                <p className="text-sm">No analyses yet. Upload your resume to get started.</p>
              </div>
            ) : (
              MOCK_RECORDS.map(record => (
                <div
                  key={record.id}
                  className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-surface hover:bg-surface-raised transition-all group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-surface-raised flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Top row: filename + date */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <p className="text-sm font-medium text-text-primary truncate">{record.filename}</p>
                      <span className="text-xs text-text-muted flex-shrink-0">{record.date}</span>
                    </div>

                    {/* ATS score bar */}
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-semibold flex-shrink-0" style={{ color: getScoreColor(record.ats_score) }}>
                        ATS {record.ats_score}/100
                      </span>
                      <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${record.ats_score}%`, background: getScoreColor(record.ats_score) }}
                        />
                      </div>
                    </div>

                    {/* Interview result */}
                    {record.interview ? (
                      <div className="flex items-center gap-1.5 text-xs text-text-muted">
                        <Mic className="w-3.5 h-3.5 text-score-high" />
                        <span className="text-score-high font-medium">{record.interview.status}</span>
                        <span>· Interview score {record.interview.score}/100</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs text-text-muted">
                        <Mic className="w-3.5 h-3.5" />
                        <span>Interview not started</span>
                      </div>
                    )}
                  </div>

                  <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-primary transition-colors flex-shrink-0" />
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  )
}
