'use client'

import { AnimatedHeading } from '@/components/features/shared/AnimatedHeading'
import { AnimatedLink } from '@/components/features/shared/AnimatedLink'
import type { HomePageSettings } from '@/types/cms'

interface IntroSectionProps {
  page: HomePageSettings
}

/**
 * Intro text below the hero — animated heading, body copy, CTA link.
 */
export function IntroSection({ page }: IntroSectionProps) {
  return (
    <div className="relative bg-base-bg text-accent-fg z-20 pt-16 lg:pt-28 pb-12 lg:pb-20">
      <div className="page-container page-intro text-center">
        <h2 className="text-[2.6rem] lg:text-[8rem] xl:text-[9rem] font-bold leading-[.93] tracking-tighter text-accent-fg !~mb-2/8">
          <AnimatedHeading
            word={page.intro_heading}
            subheading={page.intro_subheading}
          />
        </h2>

        <p className="!text-base lg:!text-xl max-w-2xl mx-auto !leading-relaxed text-base-fg/80">
          {page.intro_body}
        </p>

        <div className="inline-block mt-6">
          <AnimatedLink
            href={page.cta_href}
            text={page.cta_text}
            className="text-lg lg:~text-xl/2xl leading-tight font-bold border-b-2 lg:border-b-4 border-accent-fg text-accent-fg no-underline"
          />
        </div>
      </div>
    </div>
  )
}
