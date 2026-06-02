'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, Loader2, RotateCcw } from 'lucide-react'
import { ResumeUploader } from '@/components/dashboard/ResumeUploader'
import { PDFPreview } from '@/components/dashboard/PDFPreview'
import { ScorePanel } from '@/components/dashboard/ScorePanel'
import type { ResumeAnalysis } from '@/types/resume'

type Stage = 'upload' | 'analyzing' | 'results'

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

export default function DashboardPage() {
  const [stage, setStage] = useState<Stage>('upload')
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null)

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

  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setFile(null)
    setPreviewUrl(null)
    setAnalysis(null)
    setStage('upload')
  }

  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl) }
  }, [])

  return (
    <div className="min-h-[calc(100vh-4rem)] p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
            <p className="text-sm text-text-secondary mt-1">
              Upload your resume to get your score and start a mock interview.
            </p>
          </div>
          {stage === 'results' && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Upload new
            </button>
          )}
        </div>

        {/* Stage: upload */}
        {stage === 'upload' && (
          <div className="max-w-2xl mx-auto w-full flex flex-col gap-4">
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

        {/* Stage: analyzing */}
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

        {/* Stage: results */}
        {stage === 'results' && analysis && previewUrl && (
          <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-10 gap-8">
            <PDFPreview url={previewUrl} />
            <ScorePanel analysis={analysis} />
          </div>
        )}

      </div>
    </div>
  )
}
