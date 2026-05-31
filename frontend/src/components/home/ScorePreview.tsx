const scores = [
  { label: 'ATS Compatibility',      score: 68, color: 'score-mid' },
  { label: 'Work Experience',         score: 70, color: 'score-mid' },
  { label: 'Skills Section',          score: 82, color: 'score-high' },
  { label: 'Projects',                score: 80, color: 'score-high' },
  { label: 'Education',               score: 85, color: 'score-high' },
  { label: 'Impact & Quantification', score: 45, color: 'score-low' },
]

const colorMap: Record<string, string> = {
  'score-high': 'var(--color-score-high)',
  'score-mid':  'var(--color-score-mid)',
  'score-low':  'var(--color-score-low)',
}

export default function ScorePreview() {
  return (
    <section id="demo" className="py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {scores.map(({ label, score, color }) => (
            <div
              key={label}
              className="p-5 rounded-2xl border border-border bg-surface hover:bg-surface-raised transition-all"
            >
              <p className="text-sm text-text-secondary mb-3">{label}</p>
              <div className="flex items-end gap-1 mb-3">
                <span className="text-3xl font-bold" style={{ color: colorMap[color] }}>
                  {score}
                </span>
                <span className="text-text-muted text-sm mb-1">/100</span>
              </div>
              <div className="h-1.5 rounded-full bg-border overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${score}%`, background: colorMap[color] }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
