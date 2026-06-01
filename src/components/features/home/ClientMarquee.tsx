import type { Logo } from '@/types/cms'

interface ClientMarqueeProps {
  logos: Logo[]
  bgColor?: string
}

/**
 * Infinitely scrolling client logo strip.
 * Two copies of the logo set run side by side for a seamless loop.
 *
 * Uses plain <img> (not next/image) — SVGs are already vectors and don't
 * benefit from Next.js optimisation. next/image constrains SVGs to their
 * reported width×height (all these are 200×200), collapsing them into
 * tiny squares. Plain <img> with h-* w-auto honours the SVG's real proportions.
 */
export function ClientMarquee({ logos, bgColor = '213 243 255' }: ClientMarqueeProps) {
  const LogoStrip = ({ prefix }: { prefix: string }) => (
    <div className="flex items-center gap-x-8 lg:gap-x-14 px-4 lg:px-6 flex-shrink-0">
      {logos.map((logo, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={`${prefix}-${logo.id ?? i}`}
          src={logo.image_url ?? logo.url ?? ''}
          alt={logo.title}
          className="h-10 lg:h-16 xl:h-20 w-auto object-contain flex-shrink-0"
          loading="lazy"
          decoding="async"
        />
      ))}
    </div>
  )

  return (
    <div
      className="relative overflow-x-hidden"
      style={{
        ['--color-accent-bg' as string]: bgColor,
        ['--color-accent-fg' as string]: 'var(--color-brand-black)',
        ['--color-base-bg' as string]: bgColor,
      }}
    >
      <div className="bg-accent-bg text-brand-black py-6 lg:py-8">
        <div
          className="relative w-full overflow-hidden group"
          /* Hardware-accelerate the scroll container */
          style={{ transform: 'translateZ(0)', WebkitTransform: 'translateZ(0)' }}
        >
          <div className="flex flex-nowrap animate-marquee">
            <LogoStrip prefix="a" />
            <LogoStrip prefix="b" />
          </div>
        </div>
      </div>
    </div>
  )
}
