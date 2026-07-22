'use client'

import { useState } from 'react'
import { useCamera } from '@/hooks/useCamera'
import { InterviewHeader } from './InterviewHeader'
import { CameraPanel } from './CameraPanel'
import { PreInterviewReady } from './PreInterviewReady'

type InterviewPhase = 'pre' | 'initiating' | 'active' | 'ended'

interface InterviewRoomProps {
  resumeId: string
}

export function InterviewRoom({ resumeId }: InterviewRoomProps) {
  const { videoRef, cameraState, retryCamera } = useCamera()
  const [phase, setPhase] = useState<InterviewPhase>('pre')

  const handleBegin = async () => {
    setPhase('initiating')
    // TODO: POST /interview/start → open WebSocket
    setPhase('active')
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <InterviewHeader />

      <div className="flex flex-1 overflow-hidden">
        <CameraPanel
          videoRef={videoRef}
          cameraState={cameraState}
          onRetry={retryCamera}
        />

        {/* Right panel */}
        <div className="flex-1 flex flex-col bg-background overflow-hidden">
          {(phase === 'pre' || phase === 'initiating') && (
            <PreInterviewReady
              onBegin={handleBegin}
              isBeginning={phase === 'initiating'}
              cameraState={cameraState}
            />
          )}

          {phase === 'active' && (
            // TODO: Active chat UI — coming in next phase
            <div className="flex-1 flex items-center justify-center text-text-muted text-sm">
              Interview started — chat UI coming soon
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
