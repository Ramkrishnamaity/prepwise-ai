import { FileText, BrainCircuit, Mic, BarChart3 } from 'lucide-react'

const features = [
  {
    icon: FileText,
    title: 'Resume Intelligence',
    description:
      'Upload your resume and get scored on ATS compatibility, Skills, Work Experience, Projects, Education, and Impact. Then jump straight into a personalized interview based on your results.',
  },
  {
    icon: BrainCircuit,
    title: 'Personalized Questions',
    description:
      'No generic questions. Every question is generated from your actual resume using RAG — the AI knows exactly what to ask you.',
  },
  {
    icon: Mic,
    title: 'Real Voice Interview',
    description:
      'Talk to the AI like a real interviewer. It listens, transcribes, and asks intelligent follow-up questions based on your answers.',
  },
  {
    icon: BarChart3,
    title: 'Instant Score Report',
    description:
      'Get a detailed score breakdown — ATS, Skills, Projects, Impact — so you know exactly where to improve before the real interview.',
  },
]

export default function Features() {
  return (
    <section id="features" className="py-24 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">Features</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">
            Everything you need to prepare smarter
          </h2>
          <p className="mt-4 text-text-secondary max-w-xl mx-auto">
            PrepWise AI combines resume parsing, RAG retrieval, and live voice interviews
            into one seamless preparation experience.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group p-6 rounded-2xl border border-border bg-surface hover:bg-surface-raised transition-all duration-200 hover:border-border-strong"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-text-primary mb-2">{title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
