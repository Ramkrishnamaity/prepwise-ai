'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, Loader2, FileText, ChevronRight, Mic } from 'lucide-react'
import { Pagination } from '@/components/ui/Pagination'
import { ResumeUploader } from '@/components/dashboard/ResumeUploader'
import { ResumePreview } from '@/components/dashboard/ResumePreview'
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
// Switch ACTIVE_MOCK to test different UI states:
//   MOCK_VALID          → full data (score + strengths + improvements)
//   MOCK_NO_IMPROVEMENTS → score + strengths only
//   MOCK_NO_STRENGTHS    → score + improvements only
//   MOCK_NO_FEEDBACK     → score only, both lists empty
//   null                 → invalid / unreadable resume

const MOCK_VALID: ResumeAnalysis = {
  valid: true,
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

const MOCK_NO_IMPROVEMENTS: ResumeAnalysis = {
  valid: true,
  ats_score: 85,
  strengths: [
    'Excellent formatting and ATS-friendly structure',
    'Strong quantified achievements throughout',
    'Relevant keywords well distributed',
  ],
  improvements: [],
}

const MOCK_NO_STRENGTHS: ResumeAnalysis = {
  valid: true,
  ats_score: 38,
  strengths: [],
  improvements: [
    'Add a professional summary at the top',
    'Include contact information (email, phone, LinkedIn)',
    'Add measurable achievements instead of vague descriptions',
    'Use standard section headings for ATS compatibility',
  ],
}

const MOCK_NO_FEEDBACK: ResumeAnalysis = {
  valid: true,
  ats_score: 61,
  strengths: [],
  improvements: [],
}

const MOCK_INVALID: ResumeAnalysis = {
  valid: false,
  ats_score: 0,
  strengths: [],
  improvements: [],
}

// ← change this to test different states
// MOCK_VALID | MOCK_NO_IMPROVEMENTS | MOCK_NO_STRENGTHS | MOCK_NO_FEEDBACK | MOCK_INVALID
const ACTIVE_MOCK: ResumeAnalysis = MOCK_VALID

const ITEMS_PER_PAGE = 5

const MOCK_RECORDS: AnalysisRecord[] = [
  { id: '1',  filename: 'resume_v2.pdf',        ats_score: 72, date: 'Jun 1, 2026',  interview: { status: 'Completed', score: 78 } },
  { id: '2',  filename: 'resume_v1.pdf',         ats_score: 58, date: 'May 28, 2026', interview: null },
  { id: '3',  filename: 'resume_draft.pdf',      ats_score: 45, date: 'May 20, 2026', interview: { status: 'Completed', score: 60 } },
  { id: '4',  filename: 'resume_final.pdf',      ats_score: 83, date: 'May 15, 2026', interview: { status: 'Completed', score: 85 } },
  { id: '5',  filename: 'resume_updated.pdf',    ats_score: 67, date: 'May 10, 2026', interview: null },
  { id: '6',  filename: 'resume_2025.pdf',       ats_score: 55, date: 'May 5, 2026',  interview: { status: 'Completed', score: 50 } },
  { id: '7',  filename: 'resume_intern.pdf',     ats_score: 40, date: 'Apr 28, 2026', interview: null },
  { id: '8',  filename: 'resume_senior.pdf',     ats_score: 91, date: 'Apr 20, 2026', interview: { status: 'Completed', score: 90 } },
  { id: '9',  filename: 'resume_lead.pdf',       ats_score: 76, date: 'Apr 12, 2026', interview: null },
  { id: '10', filename: 'resume_original.pdf',   ats_score: 62, date: 'Apr 5, 2026',  interview: { status: 'Completed', score: 68 } },
  { id: '11', filename: 'resume_fresher.pdf',    ats_score: 35, date: 'Mar 30, 2026', interview: null },
  { id: '12', filename: 'resume_mba.pdf',        ats_score: 79, date: 'Mar 22, 2026', interview: { status: 'Completed', score: 74 } },
  { id: '13', filename: 'resume_frontend.pdf',   ats_score: 88, date: 'Mar 15, 2026', interview: { status: 'Completed', score: 92 } },
  { id: '14', filename: 'resume_backend.pdf',    ats_score: 64, date: 'Mar 8, 2026',  interview: null },
  { id: '15', filename: 'resume_fullstack.pdf',  ats_score: 71, date: 'Mar 1, 2026',  interview: { status: 'Completed', score: 69 } },
  { id: '16', filename: 'resume_devops.pdf',     ats_score: 53, date: 'Feb 22, 2026', interview: null },
  { id: '17', filename: 'resume_design.pdf',     ats_score: 47, date: 'Feb 15, 2026', interview: { status: 'Completed', score: 55 } },
  { id: '18', filename: 'resume_data.pdf',       ats_score: 82, date: 'Feb 8, 2026',  interview: { status: 'Completed', score: 88 } },
  { id: '19', filename: 'resume_manager.pdf',    ats_score: 69, date: 'Feb 1, 2026',  interview: null },
  { id: '20', filename: 'resume_consultant.pdf', ats_score: 95, date: 'Jan 25, 2026', interview: { status: 'Completed', score: 93 } },
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
  const [analysis,      setAnalysis]      = useState<ResumeAnalysis | null>(null)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [currentPage,   setCurrentPage]   = useState(1)

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
    setAnalysisError(null)
    await new Promise(resolve => setTimeout(resolve, 2500))
    if (!ACTIVE_MOCK.valid) {
      setAnalysisError('No resume content detected. This PDF appears to be blank or does not contain valid resume content. Please upload a different file.')
    } else {
      setAnalysis(ACTIVE_MOCK)
    }
    setStage('results')
  }

  const handleTabChange = (t: Tab) => {
    if (t === 'new' && tab !== 'new') {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setFile(null)
      setPreviewUrl(null)
      setAnalysis(null)
      setAnalysisError(null)
      setStage('upload')
      setCurrentPage(1)
    }
    setTab(t)
  }

  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl) }
  }, [])

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Tabs row — tabs left, pagination right (history only) */}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex items-center gap-2">
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

          {/* Pagination — only visible on history tab */}
          {tab === 'history' && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(MOCK_RECORDS.length / ITEMS_PER_PAGE)}
              onPageChange={setCurrentPage}
            />
          )}
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

            {stage === 'results' && analysisError && previewUrl && file && (
              <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-10 gap-8">
                <ResumePreview file={file} url={previewUrl} />
                <div className="flex flex-col items-center justify-center gap-4 text-center p-6 rounded-2xl border border-error/20 bg-error/5">
                  <div className="w-14 h-14 rounded-2xl bg-error/10 flex items-center justify-center text-2xl">⚠️</div>
                  <p className="font-semibold text-text-primary">Couldn't Analyze Resume</p>
                  <p className="text-sm text-text-secondary">{analysisError}</p>
                </div>
              </div>
            )}
            {stage === 'results' && analysis && previewUrl && file && (
              <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-10 gap-8">
                <ResumePreview file={file} url={previewUrl} />
                <ScorePanel
                  analysis={analysis}
                  onAnalyzeAnother={() => {
                    if (previewUrl) URL.revokeObjectURL(previewUrl)
                    setFile(null)
                    setPreviewUrl(null)
                    setAnalysis(null)
                    setAnalysisError(null)
                    setStage('upload')
                  }}
                />
              </div>
            )}
          </>
        )}

        {/* ── Tab: Past Analyses ── */}
        {tab === 'history' && (() => {
          const totalPages = Math.ceil(MOCK_RECORDS.length / ITEMS_PER_PAGE)
          const paginated  = MOCK_RECORDS.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

          return (
          <div className="flex flex-col gap-3">
            {MOCK_RECORDS.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-border gap-3 text-text-muted">
                <FileText className="w-8 h-8" />
                <p className="text-sm">No analyses yet. Upload your resume to get started.</p>
              </div>
            ) : (
              <>
                {paginated.map(record => (
                <div
                  key={record.id}
                  className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-surface hover:bg-surface-raised transition-all group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-surface-raised flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Top row: filename + date */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <p className="text-sm font-medium text-text-primary truncate">{record.filename}</p>
                      <span className="text-xs text-text-muted shrink-0">{record.date}</span>
                    </div>

                    {/* ATS score bar */}
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-semibold shrink-0" style={{ color: getScoreColor(record.ats_score) }}>
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

                  <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-primary transition-colors shrink-0" />
                </div>
              ))}
              </>
            )}
          </div>
          )
        })()}

      </div>
    </div>
  )
}
