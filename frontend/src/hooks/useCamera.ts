'use client'

import { useEffect, useRef, useState } from 'react'

export type CameraState = 'idle' | 'requesting' | 'active' | 'denied' | 'error'

export function useCamera() {
  const videoRef   = useRef<HTMLVideoElement | null>(null)
  const streamRef  = useRef<MediaStream | null>(null)
  const [cameraState, setCameraState] = useState<CameraState>('idle')

  const startCamera = async () => {
    if (streamRef.current) return
    setCameraState('requesting')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      streamRef.current = stream
      setCameraState('active')
    } catch (err) {
      if (err instanceof DOMException && err.name === 'NotAllowedError') {
        setCameraState('denied')
      } else {
        setCameraState('error')
      }
    }
  }

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
  }

  // Attach stream to video element once both are available
  useEffect(() => {
    if (cameraState === 'active' && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current
    }
  }, [cameraState])

  useEffect(() => {
    startCamera()
    return () => stopCamera()
  }, [])

  return { videoRef, cameraState, retryCamera: startCamera }
}
