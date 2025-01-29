
'use client'

import { useRef, useEffect, Suspense } from 'react'
import { ProfileForm } from "../components/signup"
export default function ProfilePage() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75 // Slow down the video slightly for a smoother background effect
    }
  }, [])

  return (
    <Suspense>
    <div className="relative w-screen h-screen flex justify-center  overflow-hidden bg-black text-white">
      <video
        ref={videoRef}
        src="/video.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="relative z-20 bg-black bg-opacity-70 p-8 rounded-lg max-w-2xl">
        <ProfileForm />
      </div>
    </div>
    </Suspense>
  )
}

