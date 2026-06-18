'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'
import { ResumeUploader } from '@/components/dashboard/ResumeUploader'
import { ResumePreview } from '@/components/dashboard/ResumePreview'
import { ScorePanel } from '@/components/dashboard/ScorePanel'
import PastAnalysisList from '@/components/dashboard/PastAnalysisList'
import type { ResumeAnalysis } from '@/types/resume'
import resumeApi from '@/services/api/resume.api'

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab   = 'new' | 'history'
type Stage = 'upload' | 'analyzing' | 'results'

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [tab,        setTab]        = useState<Tab>('new')
  const [stage,      setStage]      = useState<Stage>('upload')
  const [file,       setFile]       = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [analysis,      setAnalysis]      = useState<ResumeAnalysis | null>(null)
  const [analysisError, setAnalysisError] = useState<string | null>(null)

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
    if (!file) return
    setStage('analyzing')
    setAnalysisError(null)
    try {
      const result = await resumeApi.uploadResume(file)
      if (!result.valid) {
        setAnalysisError('No resume content detected. This PDF appears to be blank or does not contain valid resume content. Please upload a different file.')
      } else {
        setAnalysis(result)
      }
    } catch (err: unknown) {
      const message = (err as any)?.data?.error
      setAnalysisError(message || 'Failed to analyze resume. Please try again.')
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
    }
    setTab(t)
  }

  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl) }
  }, [])

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Tabs */}
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
        {tab === 'history' && <PastAnalysisList />}

      </div>
    </div>
  )
}
