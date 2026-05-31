import { BrainCircuit } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface py-4 px-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
            <BrainCircuit className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold text-text-primary">
            PrepWise <span className="text-primary">AI</span>
          </span>
        </div>
        <p className="text-xs text-text-muted">© 2025 PrepWise AI. All rights reserved.</p>
        <div className="flex gap-5 text-xs text-text-muted">
          <a href="#" className="hover:text-text-secondary transition-colors">Privacy</a>
          <a href="#" className="hover:text-text-secondary transition-colors">Terms</a>
          <a href="#" className="hover:text-text-secondary transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  )
}
