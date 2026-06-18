'use client'

import { useState, useEffect, useRef } from 'react'
import { FileText, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import resumeApi from '@/services/api/resume.api'
import type { PastAnalysis } from '@/types/analysis'
import ResumeAnalysisCard from './ResumeAnalysisCard'

export default function PastAnalysisList() {
    const [data,        setData]        = useState<PastAnalysis[]>([])
    const [page,        setPage]        = useState(1)
    const [totalPages,  setTotalPages]  = useState(1)
    const [loading,     setLoading]     = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [error,       setError]       = useState<string | null>(null)
    const [deletingId,  setDeletingId]  = useState<string | null>(null)
    const sentinelRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const isFirst = page === 1
        if (isFirst) setLoading(true)
        else setLoadingMore(true)

        resumeApi.getPastAnalyses(page, 10)
            .then(res => {
                setData(prev => isFirst ? res.data : [...prev, ...res.data])
                setTotalPages(res.pagination.totalPages)
            })
            .catch(() => setError('Failed to load past analyses. Please try again.'))
            .finally(() => { setLoading(false); setLoadingMore(false) })
    }, [page])

    useEffect(() => {
        const el = sentinelRef.current
        if (!el) return
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && page < totalPages && !loadingMore) {
                    setPage(p => p + 1)
                }
            },
            { threshold: 0.1 }
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [page, totalPages, loadingMore])

    const handleDelete = async (id: string) => {
        setDeletingId(id)
        try {
            await resumeApi.deleteResume(id)
            setData(prev => prev.filter(a => a._id !== id))
            toast.success('Analysis deleted')
        } catch {
            toast.error('Failed to delete. Please try again.')
        } finally {
            setDeletingId(null)
        }
    }

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-text-muted">Loading your analyses...</p>
        </div>
    )

    if (error) return (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-error/20 bg-error/5 gap-3">
            <p className="text-sm text-error">{error}</p>
        </div>
    )

    if (data.length === 0) return (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-border gap-3 text-text-muted">
            <FileText className="w-8 h-8" />
            <p className="text-sm">No analyses yet. Upload your resume to get started.</p>
        </div>
    )

    return (
        <div className="flex flex-col gap-3">
            {data.map((analysis, i) => (
                <ResumeAnalysisCard
                    key={analysis._id}
                    analysis={analysis}
                    index={i}
                    onDelete={handleDelete}
                    deleting={deletingId === analysis._id}
                />
            ))}

            {page < totalPages && <div ref={sentinelRef} />}

            {loadingMore && (
                <div className="flex justify-center py-4">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                </div>
            )}

            {!loadingMore && page >= totalPages && (
                <p className="text-center text-xs text-text-muted py-4">All analyses loaded</p>
            )}
        </div>
    )
}
