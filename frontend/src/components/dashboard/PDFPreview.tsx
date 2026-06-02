'use client'

import { useState, useRef, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Loader2 } from 'lucide-react'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface PDFPreviewProps {
  url: string
}

export function PDFPreview({ url }: PDFPreviewProps) {
  const [numPages, setNumPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [scale, setScale] = useState(1.0)
  const [loading, setLoading] = useState(true)
  const [containerWidth, setContainerWidth] = useState(600)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setCurrentPage(1)
    setScale(1.0)
    setLoading(true)
  }, [url])

  useEffect(() => {
    if (!containerRef.current) return
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width
      if (width) setContainerWidth(width)
    })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const zoomOut = () => setScale(s => Math.max(0.5, +(s - 0.15).toFixed(2)))
  const zoomIn  = () => setScale(s => Math.min(2.5, +(s + 0.15).toFixed(2)))

  return (
    <div className="rounded-2xl border border-border overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-surface border-b border-border">
        <div className="flex items-center gap-1">
          <button
            onClick={zoomOut}
            className="p-1.5 rounded-lg hover:bg-surface-raised text-text-muted hover:text-text-primary transition-colors"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-medium text-text-secondary w-10 text-center select-none">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={zoomIn}
            className="p-1.5 rounded-lg hover:bg-surface-raised text-text-muted hover:text-text-primary transition-colors"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        {numPages > 0 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg hover:bg-surface-raised text-text-muted hover:text-text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-medium text-text-secondary select-none">
              {currentPage} / {numPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(numPages, p + 1))}
              disabled={currentPage === numPages}
              className="p-1.5 rounded-lg hover:bg-surface-raised text-text-muted hover:text-text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Viewer */}
      <div
        ref={containerRef}
        className="relative overflow-auto flex justify-center p-6 bg-[#111113]"
        style={{ maxHeight: '72vh' }}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        )}
        <Document
          file={url}
          onLoadSuccess={({ numPages: n }) => {
            setNumPages(n)
            setLoading(false)
          }}
          onLoadError={() => setLoading(false)}
          loading={null}
        >
          <Page
            pageNumber={currentPage}
            scale={scale}
            width={containerWidth - 48}
            renderAnnotationLayer
            renderTextLayer
            className="shadow-2xl"
          />
        </Document>
      </div>
    </div>
  )
}
