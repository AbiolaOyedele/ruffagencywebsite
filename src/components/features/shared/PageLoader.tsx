'use client'

import { useEffect, useRef, useState } from 'react'
import lottie, { type AnimationItem } from 'lottie-web'

// Loader animations loaded via URL from /public — keeps them out of the JS bundle
const LOOP_ANIM_URL = '/animations/Loader_Eyeroll_MainLoop.json'
const EXIT_ANIM_URL = '/animations/loader_EyeRoll_Exit.json'

const EXIT_ANIM_DURATION = 1800 // ms — 60 frames @ 30fps + buffer
const MIN_SHOW_DURATION  = 2500 // ms — minimum time loader is visible
const MAX_SHOW_DURATION  = 4500 // ms — hard cap

type Phase = 'loop' | 'exit' | 'done'

/**
 * Full-page loader with Lottie eye-roll animation.
 * Shows on mount, loops until MIN_SHOW_DURATION then plays exit sequence.
 */
export function PageLoader() {
  const animRef = useRef<HTMLDivElement>(null)
  const lottieRef = useRef<AnimationItem | null>(null)
  const [visible, setVisible] = useState(true)
  const [phase, setPhase] = useState<Phase>('loop')
  const phaseRef = useRef<Phase>('loop')
  const minReached = useRef(false)
  const dismissed = useRef(false)

  function dismiss() {
    if (dismissed.current) return
    dismissed.current = true
    setVisible(false)
  }

  function loadAnim(url: string, loop: boolean, onComplete?: () => void) {
    if (!animRef.current) return
    lottieRef.current?.destroy()
    lottieRef.current = null
    animRef.current.innerHTML = ''

    const inst = lottie.loadAnimation({
      container: animRef.current,
      renderer: 'svg',
      loop,
      autoplay: true,
      path: url,
    })

    if (onComplete) {
      inst.addEventListener('complete', onComplete)
    }

    lottieRef.current = inst
  }

  function playExit() {
    if (phaseRef.current !== 'loop') return
    phaseRef.current = 'exit'
    setPhase('exit')
    loadAnim(EXIT_ANIM_URL, false, dismiss)
    // Fallback: if animation complete event never fires, dismiss anyway
    setTimeout(dismiss, EXIT_ANIM_DURATION)
  }

  useEffect(() => {
    // Lock scroll while loader is visible
    const savedScrollY = window.scrollY
    document.body.style.position = 'fixed'
    document.body.style.top = `-${savedScrollY}px`
    document.body.style.width = '100%'

    // Start loop animation
    loadAnim(LOOP_ANIM_URL, true)

    // Minimum display time
    const minTimer = setTimeout(() => {
      minReached.current = true
      playExit()
    }, MIN_SHOW_DURATION)

    // Hard-cap — always dismiss even if something hangs
    const maxTimer = setTimeout(dismiss, MAX_SHOW_DURATION)

    return () => {
      clearTimeout(minTimer)
      clearTimeout(maxTimer)
      lottieRef.current?.destroy()
      // Restore scroll
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      window.scrollTo(0, savedScrollY)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Restore scroll position when loader hides
  useEffect(() => {
    if (!visible) {
      const top = Math.abs(parseInt(document.body.style.top || '0', 10))
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      window.scrollTo(0, top)
    }
  }, [visible])

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-white"
      style={{ transition: phase === 'exit' ? 'opacity 0.3s ease' : undefined }}
      aria-hidden="true"
    >
      <div ref={animRef} className="w-48 h-48" />
    </div>
  )
}
