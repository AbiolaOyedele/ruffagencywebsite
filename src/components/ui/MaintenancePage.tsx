'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'

const HEADING = "Yeah, we're\nmaking it\neven better"
const EASE = 'cubic-bezier(0.19, 1, 0.22, 1)'

/**
 * Full-page maintenance / under construction screen.
 * Shown when maintenance_mode is enabled in the CMS global.site settings.
 * Uses GSAP for the letter-stagger reveal and illustration slide-in.
 */
export function MaintenancePage() {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const subRef     = useRef<HTMLParagraphElement>(null)
  const imgRef     = useRef<HTMLDivElement>(null)
  const labelRef   = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced) {
      gsap.set([headingRef.current, subRef.current, imgRef.current, labelRef.current], {
        opacity: 1, yPercent: 0, x: 0, clipPath: 'none',
      })
      return
    }

    // Label fade
    gsap.fromTo(labelRef.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.6, ease: EASE, delay: 0.1 }
    )

    // Heading — letter by letter reveal
    const letters = headingRef.current?.querySelectorAll<HTMLSpanElement>('.letter')
    if (letters?.length) {
      gsap.fromTo(letters,
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, stagger: 0.035, duration: 1.1, ease: EASE, delay: 0.2 }
      )
    }

    // Subheading wipe-in
    gsap.fromTo(subRef.current,
      { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
      { clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: 1.1, ease: EASE, delay: 2.0 }
    )

    // Illustration slide in from right
    gsap.fromTo(imgRef.current,
      { x: 100, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.4, ease: EASE, delay: 0.3 }
    )
  }, [])

  const lines = HEADING.split('\n')

  return (
    <main className="min-h-screen bg-white text-[#e92038] flex items-center px-6 md:px-16 lg:px-24 overflow-hidden">
      <div className="w-full max-w-[1400px] mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-0 py-24 md:py-0">

        {/* Left — copy */}
        <div className="flex-1 flex flex-col justify-center">

          <span
            ref={labelRef}
            className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-[#e92038]/60 mb-8"
            style={{ opacity: 0 }}
          >
            — Under Construction
          </span>

          <h1
            ref={headingRef}
            className="leading-[0.92] tracking-tighter mb-8 text-[#e92038]"
            style={{
              fontFamily: '"TiltWarp", sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(2.5rem, 7vw, 6rem)',
            }}
          >
            {lines.map((line, li) => (
              <div
                key={li}
                className="overflow-hidden pt-[0.2em] -mt-[0.2em] pb-[0.15em] -mb-[0.15em]"
              >
                {line.split('').map((char, i) => (
                  <span
                    key={i}
                    className={`letter inline-block${char === ' ' ? ' w-[0.28em]' : ''}`}
                    style={{ opacity: 0 }}
                  >
                    {char === ' ' ? ' ' : char}
                  </span>
                ))}
              </div>
            ))}
          </h1>

          <p
            ref={subRef}
            className="text-[#e92038]/70 text-lg md:text-xl leading-relaxed max-w-sm"
            style={{ fontFamily: '"Grandstander", sans-serif', opacity: 0 }}
          >
            Check back soon — it&apos;ll be worth it.
          </p>
        </div>

        {/* Right — illustration */}
        <div className="flex-1 flex items-center justify-center md:justify-end overflow-hidden">
          <div
            ref={imgRef}
            className="w-full md:w-[110%]"
            style={{ opacity: 0 }}
          >
            <Image
              src="/reading.svg"
              alt="Character illustration"
              width={600}
              height={600}
              className="w-full h-auto"
              style={{ filter: 'brightness(0)' }}
              priority
            />
          </div>
        </div>

      </div>
    </main>
  )
}
