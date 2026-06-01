'use client'

import { useState, useEffect } from 'react'
import type { Testimonial } from '@/types/cms'

interface TestimonialsProps {
  testimonials: Testimonial[]
}

/**
 * Auto-rotating testimonial carousel with blob SVG background.
 * Exact port of the Alpine testimonials component.
 */
export function Testimonials({ testimonials }: TestimonialsProps) {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || testimonials.length === 0) return
    const interval = setInterval(() => {
      setCurrent((v) => (v + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [paused, testimonials.length])

  if (testimonials.length === 0) return null

  return (
    <div
      className="relative -mt-blocks"
      style={{
        ['--color-accent-bg' as string]: '213 193 255',
        ['--color-accent-fg' as string]: 'var(--color-brand-black)',
        ['--color-base-bg' as string]: '213 193 255',
      }}
    >
      <div className="bg-accent-bg text-brand-black">
        <div
          className="bg-accent-fg md:bg-transparent md:text-accent-fg py-16 md:py-0 relative overflow-hidden"
          style={{
            ['--color-accent-fg' as string]: '110 63 141',
            ['--color-accent-bg' as string]: '213 193 255',
          }}
        >
          <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className="page-container-lg min-h-[70dvw] sm:min-h-[30dvw] md:min-h-0 relative"
          >
            {/* Blob SVG background — desktop only */}
            <svg
              className="hidden md:block w-full h-auto z-0"
              width="1920"
              height="891"
              viewBox="0 0 1920 891"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M1773.38 351.767C1860.84 387.654 1917.81 446.47 1918.09 521.477C1918.41 611.885 1836.3 690.866 1717.51 733.922C1825.7 760.915 1894.69 814.346 1918.09 891H0C31.4859 817.721 85.4898 763.158 176.442 733.763C71.2904 693.413 3.95821 621.989 3.95821 541.293C3.95821 467.356 60.4945 404.651 150.912 363.663C12.751 247.97 0 0 0 0H1918.09C1918.09 0 1947.76 230.506 1773.38 351.767Z"
                fill="currentColor"
              />
            </svg>

            {/* Quotes */}
            {testimonials.map((quote, index) => (
              <div
                key={quote.id}
                className="md:left-1/2 md:-translate-x-1/2 absolute top-1/2 left-4 max-w-[calc(100%_-_2rem)] md:max-w-none -translate-y-1/2 transition-opacity duration-300"
                style={{ opacity: current === index ? 1 : 0, pointerEvents: current === index ? 'auto' : 'none' }}
                aria-hidden={current !== index}
              >
                <blockquote className="grid gap-x-gutter gap-y-text text-accent-bg relative md:w-[66dvw] max-w-screen-xl mx-auto">
                  <div
                    className="grid gap-y-text [&>p]:text-2xl lg:[&>p]:text-4xl xl:[&>p]:text-5xl [&>p]:leading-normal font-light"
                    dangerouslySetInnerHTML={{ __html: quote.quote }}
                  />
                  <div
                    className="text-right grid gap-y-text [&>p]:text-xl lg:[&>p]:text-2xl [&>p]:leading-normal font-medium"
                    dangerouslySetInnerHTML={{ __html: quote.credit }}
                  />
                </blockquote>
              </div>
            ))}

            {/* Dot indicators */}
            <div className="absolute bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 flex justify-center gap-x-3 lg:gap-x-4">
              {testimonials.map((_, index) => (
                <button
                  key={`dot-${index}`}
                  type="button"
                  aria-label={`Go to testimonial ${index + 1}`}
                  onClick={() => { setCurrent(index); setPaused(false) }}
                  className="w-3 h-3 lg:w-4 lg:h-4 rounded-full bg-accent-bg hover:opacity-80 focus:outline-none transition-opacity duration-200"
                  style={{ opacity: current === index ? 1 : 0.5 }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
