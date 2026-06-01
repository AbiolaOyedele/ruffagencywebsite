'use client'

import { useRef, useState, useEffect, useCallback } from 'react'

interface LetterConfig {
  delay: number
  duration: number
}

interface AnimatedHeadingProps {
  /** The animated word (rendered letter-by-letter with drop-in) */
  word: string
  /** Static subheading shown below the animated word */
  subheading?: string
  className?: string
}

/**
 * Letter drop-in animation triggered by IntersectionObserver.
 * Each letter is clickable to trigger a jump.
 * Exact port of the Alpine animatedHeading() component.
 */
export function AnimatedHeading({ word, subheading, className }: AnimatedHeadingProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visibleCount, setVisibleCount] = useState(0)
  const [jumpingLetters, setJumpingLetters] = useState<Set<number>>(new Set())
  const triggeredRef = useRef(false)

  // Generate random animation configs once per word
  const configRef = useRef<LetterConfig[]>(
    Array.from(word).map(() => ({
      delay:    20 + Math.random() * 40,
      duration: 0.4 + Math.random() * 0.1,
    })),
  )

  const animateLetters = useCallback(() => {
    let accumulated = 0
    Array.from(word).forEach((_, i) => {
      accumulated += i === 0 ? 0 : configRef.current[i].delay
      const delay = accumulated
      setTimeout(() => setVisibleCount((v) => v + 1), delay)
    })
  }, [word])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggeredRef.current) {
          triggeredRef.current = true
          animateLetters()
        }
      },
      { threshold: 0.5 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [animateLetters])

  function handleLetterClick(index: number, e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (index >= visibleCount) return

    setJumpingLetters((prev) => new Set(prev).add(index))
    setTimeout(() => {
      setJumpingLetters((prev) => {
        const next = new Set(prev)
        next.delete(index)
        return next
      })
    }, 200)
  }

  return (
    <div ref={containerRef} className={`text-mask-container${className ? ` ${className}` : ''}`}>
      {Array.from(word).map((letter, i) => (
        <span
          key={i}
          className={[
            'inline-block letter-clickable',
            i >= visibleCount ? 'opacity-0' : '',
            jumpingLetters.has(i) ? 'animate-jump' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          style={
            i < visibleCount
              ? {
                  animation: `block-fall ${configRef.current[i].duration}s cubic-bezier(0.55,0.06,0.68,0.19) forwards`,
                }
              : { animation: 'none' }
          }
          onClick={(e) => handleLetterClick(i, e)}
          onTouchEnd={(e) => handleLetterClick(i, e)}
        >
          {letter}
        </span>
      ))}
      {subheading && (
        <>
          <br />
          <span>{subheading}</span>
          <br />
        </>
      )}
    </div>
  )
}
