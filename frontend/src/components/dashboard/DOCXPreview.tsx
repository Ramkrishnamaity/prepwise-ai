'use client'

import { useEffect, useRef, useState } from 'react'
import { renderAsync } from 'docx-preview'
import { Loader2 } from 'lucide-react'

interface DOCXPreviewProps {
  file: File
}

export function DOCXPreview({ file }: DOCXPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const styleRef     = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(false)

  useEffect(() => {
    if (!containerRef.current || !styleRef.current) return
    setLoading(true)
    setError(false)

    const el = containerRef.current
    el.innerHTML = ''

    renderAsync(file, el, styleRef.current, {
      className: 'docx-preview-root',
      inWrapper: false,
      ignoreWidth: true,
      ignoreHeight: true,
      ignoreFonts: false,
      breakPages: true,
      useBase64URL: true,
    })
      .then(() => setLoading(false))
      .catch(() => { setLoading(false); setError(true) })
  }, [file])

  return (
    <div className="rounded-2xl border border-border overflow-hidden">
      {/* style mount point — invisible, needed by docx-preview */}
      <div ref={styleRef} className="hidden" />

      {/* Toolbar */}
      <div className="flex items-center px-4 py-3 bg-surface border-b border-border">
        <span className="text-xs font-medium text-text-secondary">{file.name}</span>
      </div>

      {/* Viewer — light background so white DOCX pages render naturally */}
      <div className="relative overflow-auto bg-[#e8e8e8] p-4" style={{ maxHeight: '67vh' }}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        )}
        {error && !loading && (
          <p className="text-sm text-text-muted text-center py-10">
            Could not render this document.
          </p>
        )}
        <div
          ref={containerRef}
          className="docx-wrapper"
        />
      </div>
    </div>
  )
}
