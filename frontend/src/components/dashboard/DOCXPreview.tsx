'use client'

import { useEffect, useRef, useState } from 'react'
import { renderAsync } from 'docx-preview'
import { Loader2 } from 'lucide-react'

interface DOCXPreviewProps {
  file: File
}

export function DOCXPreview({ file }: DOCXPreviewProps) {
  const outerRef   = useRef<HTMLDivElement>(null) // scroll + width source
  const shimRef    = useRef<HTMLDivElement>(null) // height shim for scaled content
  const contentRef = useRef<HTMLDivElement>(null) // gets transform: scale
  const styleRef   = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(false)

  function applyScale() {
    const outer   = outerRef.current
    const shim    = shimRef.current
    const content = contentRef.current
    if (!outer || !shim || !content) return

    const naturalW = content.scrollWidth
    const naturalH = content.scrollHeight
    if (!naturalW || !naturalH) return

    const scale = outer.clientWidth / naturalW
    content.style.transform       = `scale(${scale})`
    content.style.transformOrigin = 'top left'
    shim.style.height             = `${naturalH * scale}px`
  }

  useEffect(() => {
    const content = contentRef.current
    const style   = styleRef.current
    if (!content || !style) return

    setLoading(true)
    setError(false)
    content.innerHTML      = ''
    content.style.transform = ''
    if (shimRef.current) shimRef.current.style.height = ''

    renderAsync(file, content, style, {
      inWrapper:    false,
      ignoreWidth:  false,
      ignoreHeight: false,
      breakPages:   true,
      useBase64URL: true,
    })
      .then(() => {
        requestAnimationFrame(applyScale)
        setLoading(false)
      })
      .catch(() => { setLoading(false); setError(true) })
  }, [file])

  useEffect(() => {
    const outer = outerRef.current
    if (!outer) return
    const ro = new ResizeObserver(applyScale)
    ro.observe(outer)
    return () => ro.disconnect()
  }, [])

  return (
    <div className="rounded-2xl border border-border overflow-hidden">
      <div ref={styleRef} className="hidden" />

      {/* Toolbar */}
      <div className="flex items-center px-4 py-3 bg-surface border-b border-border">
        <span className="text-xs font-medium text-text-secondary">{file.name}</span>
      </div>

      {/* Scroll container — clips natural-width content, scrolls vertically */}
      <div
        ref={outerRef}
        className="relative overflow-y-auto overflow-x-hidden bg-[#e8e8e8]"
        style={{ maxHeight: '68vh' }}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#e8e8e8] z-10">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        )}
        {error && !loading && (
          <p className="text-sm text-text-muted text-center py-10">
            Could not render this document.
          </p>
        )}

        {/* shimRef holds the correct scrollable height after scaling */}
        <div ref={shimRef} className="relative">
          {/* contentRef renders at natural doc width, then scaled down to fit */}
          <div ref={contentRef} className="absolute top-0 left-0" />
        </div>
      </div>
    </div>
  )
}
