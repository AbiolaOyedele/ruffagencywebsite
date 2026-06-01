'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import lottie, { type AnimationItem } from 'lottie-web'
import { replaceColor } from 'lottie-colorify'
import { useMenu } from '@/lib/menu-context'
import type { NavItem } from '@/types/cms'

// eslint-disable-next-line @typescript-eslint/no-require-imports
const scrollPromptAnimation = require('@/lib/animations/ScrollPrompt.json') as { op?: number }

interface MenuOverlayProps {
  items: NavItem[]
}

/**
 * Full-screen navigation overlay.
 * Exact port of the Alpine menuOverlay() component.
 */
export function MenuOverlay({ items }: MenuOverlayProps) {
  const { isMenuOpen, closeMenu } = useMenu()
  const pathname = usePathname()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const lottieRefs = useRef<(HTMLElement | null)[]>([])
  const lottieInstances = useRef<(AnimationItem | null)[]>([])
  const initialised = useRef(false)

  const activeIndex = items.findIndex(
    (item) => pathname === item.href || pathname.startsWith(item.href + '/'),
  )

  const displayItem =
    hoveredIndex !== null
      ? items[hoveredIndex]
      : activeIndex >= 0
        ? items[activeIndex]
        : items[0]

  // Close menu on navigation
  useEffect(() => {
    closeMenu()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // Initialise Lottie arrows when overlay first opens
  useEffect(() => {
    if (!isMenuOpen || initialised.current) return
    initialised.current = true

    items.forEach((item, i) => {
      const el = lottieRefs.current[i]
      if (!el) return
      lottieInstances.current[i] = lottie.loadAnimation({
        container: el,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        animationData: replaceColor(
          '#ffffff',
          item.text_hover_color,
          scrollPromptAnimation,
        ) as object,
        initialSegment: [28, scrollPromptAnimation.op ?? 120],
      })

      // Auto-play the active item
      const isActive = hoveredIndex === i || (hoveredIndex === null && activeIndex === i)
      if (isActive) lottieInstances.current[i]?.goToAndPlay(28, true)
    })

    return () => {
      lottieInstances.current.forEach((inst) => inst?.destroy())
      lottieInstances.current = []
      initialised.current = false
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMenuOpen])

  // Play animation on hover
  useEffect(() => {
    if (hoveredIndex !== null) {
      lottieInstances.current[hoveredIndex]?.goToAndPlay(28, true)
    }
  }, [hoveredIndex])

  const shouldShowArrow = (index: number) =>
    hoveredIndex === index || (hoveredIndex === null && activeIndex === index)

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      className="fixed inset-0 z-40 flex items-center justify-center p-4 transition-opacity duration-300"
      style={{
        backgroundColor: displayItem?.overlay_bg_color ?? '#1e1e23',
        opacity: isMenuOpen ? 1 : 0,
        pointerEvents: isMenuOpen ? 'auto' : 'none',
      }}
    >
      <div className="flex justify-center w-80">
        <div className="w-full">
          {items.map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="flex items-center justify-center md:justify-start w-full h-[2rem] md:h-[4.3rem] text-center md:text-left mt-4 md:mt-1 bg-transparent text-white no-underline"
              style={
                {
                  '--hover-color': item.text_hover_color,
                } as React.CSSProperties
              }
            >
              {/* Animated Lottie arrow */}
              <div
                className="hidden md:flex justify-center items-center flex-shrink-0 h-[4.3rem] overflow-hidden transition-all duration-200 ease-[cubic-bezier(0.25,0.46,0.45,1.2)]"
                style={{ width: shouldShowArrow(index) ? 'clamp(2rem, 8vw, 4.3rem)' : '0' }}
              >
                <figure
                  ref={(el) => { lottieRefs.current[index] = el }}
                  className="lottie-arrow w-full h-full -rotate-90"
                  aria-hidden="true"
                  style={{ display: shouldShowArrow(index) ? 'block' : 'none' }}
                />
              </div>

              {/* Label */}
              <div
                className="flex items-center justify-center md:justify-start text-5xl md:text-[4rem] font-semibold tracking-[-0.03em] h-[2rem] md:h-[4.3rem] transition duration-200 ease-out hover:text-[var(--hover-color)]"
              >
                {item.label}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
