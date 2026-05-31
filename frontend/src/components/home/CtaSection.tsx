import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function CtaSection() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <div
          className="relative rounded-3xl border border-border p-12 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 8%, var(--color-surface)), var(--color-surface))' }}
        >
          {/* Glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 blur-3xl opacity-20 rounded-full"
            style={{ background: 'var(--color-primary)' }}
          />

          <h2 className="relative text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            Ready to ace your next interview?
          </h2>
          <p className="relative text-text-secondary mb-8 max-w-md mx-auto">
            Join thousands of candidates who used PrepWise AI to walk into interviews
            fully prepared and confident.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-fg font-medium transition-all"
            style={{ boxShadow: '0 0 32px color-mix(in srgb, var(--color-primary) 40%, transparent)' }}
          >
            Start Free — Upload Your Resume
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="mt-4 text-xs text-text-muted">No credit card required</p>
        </div>
      </div>
    </section>
  )
}
