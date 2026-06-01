import type { Metadata } from 'next'
import { fetchHomePageData, fetchGlobalData } from '@/services/cms'
import { HeroSection } from '@/components/features/home/HeroSection'
import { IntroSection } from '@/components/features/home/IntroSection'
import { ProjectsGrid } from '@/components/features/home/ProjectsGrid'
import { Testimonials } from '@/components/features/home/Testimonials'
import { Footer } from '@/components/ui/Footer'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'The Ruff Agency — Animation Studio in London',
  description:
    'The Ruff Agency is an animation studio in London. We love creating characterful things for brands with big ideas, finding the personality in every project.',
  openGraph: {
    title: 'The Ruff Agency — Animation Studio in London',
    description:
      "Character-led animation and design for the world's most ambitious brands.",
  },
}

/**
 * Homepage — Server Component.
 * All data is fetched at request time; nothing loads on the client.
 */
export default async function HomePage() {
  const [data, global] = await Promise.all([fetchHomePageData(), fetchGlobalData()])

  // Build the per-page CSS vars string — rendered SSR so there is zero colour flash
  const cssVars = `
    :root {
      --color-accent-fg: ${data.page.accent_fg ?? '254 179 210'};
      --color-accent-bg: ${data.page.accent_bg ?? '99 77 255'};
      --color-footer-bg: ${data.page.footer_bg ?? 'rgb(213,193,255)'};
      ${data.page.base_bg ? `--color-base-bg: ${data.page.base_bg};` : ''}
      ${data.page.base_fg ? `--color-base-fg: ${data.page.base_fg};` : ''}
      ${data.page.burger_color ? `--color-burger: ${data.page.burger_color};` : ''}
    }
  `.trim()

  return (
    <>
      {/* Per-page colour tokens — server-rendered, no flash */}
      <style dangerouslySetInnerHTML={{ __html: cssVars }} />

      <h1 className="sr-only">The Ruff Agency — Animation Studio</h1>

      <div className="grid min-h-screen grid-rows-[1fr_auto] items-start">
        <div className="grid">
          <HeroSection imageUrl={data.page.hero_image_url} />
          <IntroSection page={data.page} />
          <ProjectsGrid projects={data.projects} />
          <Testimonials testimonials={data.testimonials} />
        </div>

        <Footer global={global} />
      </div>
    </>
  )
}
