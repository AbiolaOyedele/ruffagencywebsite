'use client'

import { useEffect, type ReactNode } from 'react'
import Lenis from 'lenis'

interface LenisProviderProps {
  children: ReactNode
}

/**
 * Wraps the application in Lenis smooth scroll.
 * Must be a Client Component since it touches the DOM.
 */
export function LenisProvider({ children }: LenisProviderProps) {
  useEffect(() => {
    const lenis = new Lenis()

    let rafId: number

    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }

    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
