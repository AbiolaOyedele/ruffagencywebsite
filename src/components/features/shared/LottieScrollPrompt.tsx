'use client'

import { useEffect, useRef } from 'react'
import lottie from 'lottie-web'
// eslint-disable-next-line @typescript-eslint/no-require-imports
const scrollPromptAnimation = require('@/lib/animations/ScrollPrompt.json') as object

/**
 * Looping Lottie scroll-down prompt shown in the hero section.
 */
export function LottieScrollPrompt() {
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: scrollPromptAnimation,
    })

    return () => anim.destroy()
  }, [])

  return <figure ref={containerRef} className="lottie-container w-full h-full" aria-hidden="true" />
}
