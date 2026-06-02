'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

function getPageRange(current: number, total: number): number[] {
  const max = 4
  if (total <= max) return Array.from({ length: total }, (_, i) => i + 1)

  let start = Math.max(1, current - Math.floor(max / 2))
  let end = start + max - 1

  if (end > total) {
    end = total
    start = Math.max(1, end - max + 1)
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = getPageRange(currentPage, totalPages)

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-2.5 py-1.5 rounded-lg text-sm border border-border text-text-muted hover:border-border-strong hover:text-text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages.map(p => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
            currentPage === p
              ? 'border-primary text-primary bg-primary/10'
              : 'border-border text-text-muted hover:border-border-strong hover:text-text-primary'
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-2.5 py-1.5 rounded-lg text-sm border border-border text-text-muted hover:border-border-strong hover:text-text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}
