'use client'

import { RefObject } from 'react'
import { Camera, VideoOff } from 'lucide-react'
import type { CameraState } from '@/hooks/useCamera'

interface CameraPanelProps {
  videoRef:    RefObject<HTMLVideoElement | null>
  cameraState: CameraState
  onRetry:     () => void
}

export function CameraPanel({ videoRef, cameraState, onRetry }: CameraPanelProps) {
  const isActive = cameraState === 'active'

  return (
    <div className="w-72 shrink-0 flex flex-col gap-0 border-r border-border bg-surface">
      {/* Camera card */}
      <div className="flex-1 flex flex-col p-3 gap-2">
        <div className="relative flex-1 rounded-xl overflow-hidden bg-surface-raised">

          {/* LIVE badge — only when streaming */}
          {isActive && (
            <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/60 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse" />
              <span className="text-[10px] font-bold text-white tracking-widest">LIVE</span>
            </div>
          )}

          {/* Video element — always mounted so ref is ready */}
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className={`absolute inset-0 w-full h-full object-cover [transform:scaleX(-1)] ${isActive ? 'opacity-100' : 'opacity-0'}`}
          />

          {/* Placeholder overlay when no stream */}
          {!isActive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              {cameraState === 'denied' ? (
                <>
                  <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center">
                    <VideoOff className="w-5 h-5 text-error" />
                  </div>
                  <p className="text-xs text-text-muted text-center px-4 leading-relaxed">
                    Camera access was denied
                  </p>
                  <button
                    onClick={onRetry}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Allow Camera
                  </button>
                </>
              ) : cameraState === 'requesting' ? (
                <>
                  <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center border border-border">
                    <Camera className="w-5 h-5 text-text-muted animate-pulse" />
                  </div>
                  <p className="text-xs text-text-muted">Starting camera…</p>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center border border-border">
                    <Camera className="w-5 h-5 text-text-muted" />
                  </div>
                  <p className="text-xs text-text-muted">Your Camera</p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Label */}
        <p className="text-xs text-text-muted text-center pb-1">Your Camera</p>
      </div>
    </div>
  )
}
