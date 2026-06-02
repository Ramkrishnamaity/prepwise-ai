'use client'

import { useCallback, useRef, useState } from 'react'
import { Upload, FileText, X, AlertCircle } from 'lucide-react'
import { PDFPreview } from './PDFPreview'

interface ResumeUploaderProps {
  file: File | null
  previewUrl: string | null
  onFileSelect: (file: File) => void
  onFileRemove: () => void
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function ResumeUploader({ file, previewUrl, onFileSelect, onFileRemove }: ResumeUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = useCallback((f: File) => {
    setError(null)
    if (f.type !== 'application/pdf') {
      setError('Only PDF files are supported.')
      return
    }
    onFileSelect(f)
  }, [onFileSelect])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }, [handleFile])

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(true)
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) handleFile(f)
    e.target.value = ''
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Upload zone (shown when no file) */}
      {!file ? (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={() => setDragging(false)}
          className={`
            flex flex-col items-center justify-center gap-4 p-10 rounded-2xl border-2 border-dashed cursor-pointer transition-all
            ${dragging
              ? 'border-primary bg-surface-raised'
              : 'border-border-strong hover:border-primary hover:bg-surface-raised'
            }
          `}
        >
          <div className="w-14 h-14 rounded-2xl bg-surface-raised flex items-center justify-center">
            <Upload className="w-7 h-7 text-primary" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-text-primary">Drop your resume here</p>
            <p className="text-sm text-text-muted mt-1">or click to browse · PDF only</p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={onInputChange}
          />
        </div>
      ) : (
        /* File info bar */
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-surface">
          <FileText className="w-5 h-5 text-primary flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">{file.name}</p>
            <p className="text-xs text-text-muted">{formatFileSize(file.size)}</p>
          </div>
          <button
            onClick={onFileRemove}
            className="p-1.5 rounded-lg hover:bg-surface-raised text-text-muted hover:text-text-primary transition-colors"
            aria-label="Remove file"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-error/10 border border-error/20 text-error text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* PDF preview */}
      {previewUrl && <PDFPreview url={previewUrl} />}
    </div>
  )
}
