'use client'

import { useEffect, type ReactNode } from 'react'
import Lenis from 'lenis'

interface LenisProviderProps {
  children: ReactNode
}

/**
 * Wraps the public site in Lenis smooth scroll.
 * Only rendered inside (site)/layout.tsx — admin routes never load this.
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
