'use client'

import { Mic, Brain, Clock, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react'
import type { CameraState } from '@/hooks/useCamera'

interface PreInterviewReadyProps {
  onBegin:     () => void
  isBeginning: boolean
  cameraState: CameraState
}

interface ReadyCheckItemProps {
  label:   string
  checked: boolean
}

function ReadyCheckItem({ label, checked }: ReadyCheckItemProps) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
        checked ? 'bg-score-high/15' : 'bg-surface-raised'
      }`}>
        <CheckCircle2 className={`w-3.5 h-3.5 ${checked ? 'text-score-high' : 'text-text-muted'}`} />
      </div>
      <span className={`text-sm ${checked ? 'text-text-secondary' : 'text-text-muted'}`}>
        {label}
      </span>
    </div>
  )
}

export function PreInterviewReady({ onBegin, isBeginning, cameraState }: PreInterviewReadyProps) {
  const cameraReady = cameraState === 'active'

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-8 px-10">

      {/* AI avatar */}
      <div className="relative">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Brain className="w-10 h-10 text-primary" />
        </div>
        <span className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-score-high flex items-center justify-center">
          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
        </span>
      </div>

      {/* Heading */}
      <div className="text-center max-w-xs">
        <h2 className="text-xl font-bold text-text-primary tracking-tight">
          Your interviewer is ready
        </h2>
        <p className="text-sm text-text-secondary mt-2 leading-relaxed">
          AI has reviewed your resume and prepared personalized questions. Take a breath — you've got this.
        </p>
      </div>

      {/* Info pills */}
      <div className="flex items-center gap-3 flex-wrap justify-center">
        <InfoPill icon={<Brain className="w-3.5 h-3.5" />} label="AI-personalized" />
        <InfoPill icon={<Mic className="w-3.5 h-3.5" />} label="Voice-based" />
        <InfoPill icon={<Clock className="w-3.5 h-3.5" />} label="~15 minutes" />
      </div>

      {/* Readiness checklist */}
      <div className="w-full max-w-xs flex flex-col gap-3 p-4 rounded-xl border border-border bg-surface">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
          Pre-interview checklist
        </p>
        <ReadyCheckItem label="Camera connected" checked={cameraReady} />
        <ReadyCheckItem label="Microphone ready"  checked={true} />
        <ReadyCheckItem label="Resume analyzed"   checked={true} />
      </div>

      {/* Begin button */}
      <button
        onClick={onBegin}
        disabled={isBeginning}
        className="flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-semibold text-primary-fg bg-primary hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-primary/20"
      >
        {isBeginning ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Initializing interview…
          </>
        ) : (
          <>
            Begin Interview
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </div>
  )
}

interface InfoPillProps {
  icon:  React.ReactNode
  label: string
}

function InfoPill({ icon, label }: InfoPillProps) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-border text-xs text-text-secondary">
      <span className="text-text-muted">{icon}</span>
      {label}
    </div>
  )
}
