interface InterviewHeaderProps {
  questionCurrent?: number
  questionTotal?:   number
}

export function InterviewHeader({ questionCurrent, questionTotal }: InterviewHeaderProps) {
  return (
    <div className="flex items-center justify-between px-5 h-12 border-b border-border bg-surface shrink-0">
      <div className="flex items-center gap-2.5">
        <span className="w-2 h-2 rounded-full bg-score-high animate-pulse" />
        <span className="text-sm font-semibold text-text-primary tracking-tight">
          PrepWise AI — Live Interview
        </span>
      </div>

      {questionCurrent != null && questionTotal != null && (
        <span className="text-sm text-text-muted">
          Question {questionCurrent} / {questionTotal}
        </span>
      )}
    </div>
  )
}
