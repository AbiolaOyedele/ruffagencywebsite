'use client'

import { useEffect, useRef, useState } from 'react'
import lottie, { type AnimationItem } from 'lottie-web'
import { replaceColor } from 'lottie-colorify'
import { useMenu } from '@/lib/menu-context'

// eslint-disable-next-line @typescript-eslint/no-require-imports
const burgerAnimation = require('@/lib/animations/BurgerAnimation.json') as object
// eslint-disable-next-line @typescript-eslint/no-require-imports
const closeAnimation = require('@/lib/animations/CloseAnimation.json') as object

/**
 * Reads --color-burger (hex) first, falls back to --color-accent-fg (r g b).
 */
function getAccentHex(): string {
  const styles = getComputedStyle(document.documentElement)
  const burger = styles.getPropertyValue('--color-burger').trim()
  if (burger && /^#[0-9a-fA-F]{6}$/.test(burger)) return burger
  const rgb = styles.getPropertyValue('--color-accent-fg').trim()
  if (!rgb) return '#ffffff'
  const parts = rgb.split(' ').map(Number)
  if (parts.length !== 3 || parts.some(isNaN)) return '#ffffff'
  return '#' + parts.map((x) => x.toString(16).padStart(2, '0')).join('')
}

/**
 * Animated burger / close button that controls the menu overlay.
 * Exact port of the Alpine lottieBurgerMenu() component.
 */
export function LottieBurger() {
  const { isMenuOpen, toggleMenu } = useMenu()
  const burgerRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLDivElement>(null)
  const burgerAnimRef = useRef<AnimationItem | null>(null)
  const closeAnimRef = useRef<AnimationItem | null>(null)
  const [showBurger, setShowBurger] = useState(true)
  const [showClose, setShowClose] = useState(false)

  useEffect(() => {
    if (!burgerRef.current || !closeRef.current) return

    const accentHex = getAccentHex()

    burgerAnimRef.current = lottie.loadAnimation({
      container: burgerRef.current,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData: replaceColor('#1e1e23', accentHex, burgerAnimation) as object,
    })

    closeAnimRef.current = lottie.loadAnimation({
      container: closeRef.current,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData: replaceColor('#1e1e23', '#ffffff', closeAnimation) as object,
    })

    return () => {
      burgerAnimRef.current?.destroy()
      closeAnimRef.current?.destroy()
    }
  }, [])

  function handleToggle() {
    if (isMenuOpen) {
      closeAnimRef.current?.playSegments([60, 68], true)
      setTimeout(() => {
        setShowClose(false)
        setShowBurger(true)
        burgerAnimRef.current?.playSegments([180, 220], true)
      }, 230)
    } else {
      setShowBurger(false)
      setShowClose(true)
      closeAnimRef.current?.playSegments([1, 30], true)
    }
    toggleMenu()
  }

  function handleMouseEnter() {
    if (!isMenuOpen) burgerAnimRef.current?.playSegments([60, 80], true)
  }

  function handleMouseLeave() {
    if (!isMenuOpen) burgerAnimRef.current?.playSegments([120, 150], true)
  }

  return (
    <button
      type="button"
      aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
      className="absolute ~right-0/[5.625rem] ~top-4/[2.125rem] cursor-pointer pointer-events-auto"
      onClick={handleToggle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative ~w-16/24 ~h-16/24">
        <div
          ref={burgerRef}
          className="lottie-burger absolute top-0 w-full h-full"
          style={{
            opacity: showBurger ? 1 : 0,
            pointerEvents: showBurger ? 'auto' : 'none',
          }}
        />
        <div
          ref={closeRef}
          className="lottie-burger absolute top-0 w-full h-full"
          style={{
            opacity: showClose ? 1 : 0,
            pointerEvents: showClose ? 'auto' : 'none',
          }}
        />
      </div>
    </button>
  )
}
