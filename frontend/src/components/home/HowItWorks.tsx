import { Upload, ScanText, MessageSquare, Trophy } from 'lucide-react'

const steps = [
  {
    icon: Upload,
    step: '01',
    title: 'Upload Your Resume',
    description: 'Drop in your PDF or DOCX. Takes 5 seconds.',
  },
  {
    icon: ScanText,
    step: '02',
    title: 'AI Reads & Scores It',
    description: 'We parse, chunk, and embed your resume. You get a full score breakdown instantly.',
  },
  {
    icon: MessageSquare,
    step: '03',
    title: 'Start Your Interview',
    description: 'The AI asks you questions based on your actual experience. Answer by voice.',
  },
  {
    icon: Trophy,
    step: '04',
    title: 'Get Detailed Feedback',
    description: 'Review your answers, scores, and areas to improve. Repeat until you\'re ready.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4 bg-surface">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">How It Works</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">
            From resume to interview in minutes
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map(({ icon: Icon, step, title, description }, index) => (
            <div key={step} className="relative flex flex-col">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-5 left-[calc(50%+20px)] right-[-calc(50%-20px)] h-px bg-border z-0" />
              )}

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs font-mono text-text-muted">{step}</span>
                </div>
                <h3 className="font-semibold text-text-primary mb-2">{title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
