'use client'

import { useRef, useState } from 'react'

interface CharConfig {
  rotation: number
  height: number
}

interface AnimatedLinkProps {
  text: string
  href: string
  className?: string
}

/**
 * Link where each character wiggles up on hover.
 * Exact port of the Alpine animatedLink() component.
 */
export function AnimatedLink({ text, href, className }: AnimatedLinkProps) {
  const chars = text.split('')
  const [isHovered, setIsHovered] = useState(false)

  // Random config generated once per instance
  const configRef = useRef<CharConfig[]>(
    chars.map(() => ({
      rotation: (Math.random() - 0.5) * 8,
      height:   -(6 + Math.random() * 4),
    })),
  )

  return (
    <a
      href={href}
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {chars.map((char, i) => (
        <span
          key={i}
          className="inline-block"
          style={{
            transform: isHovered
              ? `translateY(${configRef.current[i].height}px) rotate(${configRef.current[i].rotation}deg)`
              : 'translateY(0) rotate(0deg)',
            transitionDelay:          isHovered ? `${i * 20}ms` : '0ms',
            transitionDuration:       '100ms',
            transitionTimingFunction: isHovered
              ? 'cubic-bezier(0.68,-0.55,0.45,1.6)'
              : 'ease-out',
            transitionProperty: 'transform',
          }}
        >
          {/* Non-breaking space preserves word spacing */}
          {char === ' ' ? ' ' : char}
        </span>
      ))}
    </a>
  )
}
