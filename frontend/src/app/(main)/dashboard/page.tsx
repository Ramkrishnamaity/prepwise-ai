'use client'

import { useState, useEffect } from 'react'
import { ResumeUploader } from '@/components/dashboard/ResumeUploader'
import { ScorePanel } from '@/components/dashboard/ScorePanel'
import type { ResumeAnalysis } from '@/types/resume'

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
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [analysis] = useState<ResumeAnalysis | null>(MOCK_ANALYSIS)

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

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [])

  return (
    <div className="min-h-[calc(100vh-4rem)] p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-sm text-text-secondary mt-1">
            Upload your resume to get your score and start a mock interview.
          </p>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-10 gap-8">
          <ResumeUploader
            file={file}
            previewUrl={previewUrl}
            onFileSelect={handleFileSelect}
            onFileRemove={handleFileRemove}
          />

          {analysis ? (
            <ScorePanel analysis={analysis} />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 rounded-2xl border-2 border-dashed border-border text-text-muted gap-3">
              <p className="text-sm">Upload your resume to see your analysis</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
