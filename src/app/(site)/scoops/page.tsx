import type { Metadata } from 'next'
import { fetchScoopsPageData, fetchGlobalData } from '@/services/cms'
import { ScoopsList } from '@/components/features/scoops/ScoopsList'
import { WaveDivider } from '@/components/ui/WaveDivider'
import { Footer } from '@/components/ui/Footer'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Scoops',
  description: 'Jobs, news and scoops from The Ruff Agency — the character animation studio.',
}

export default async function ScoopsPage() {
  const [data, global] = await Promise.all([fetchScoopsPageData(), fetchGlobalData()])
  const p = data.page

  const cssVars = `
    :root {
      --color-accent-fg: ${p.accent_fg ?? '124 101 254'};
      --color-accent-bg: ${p.accent_bg ?? '124 101 254'};
      --color-footer-bg: ${p.footer_bg ?? 'rgb(220,213,255)'};
    }
  `.trim()

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssVars }} />

      <h1 className="sr-only">Scoops</h1>

      <div className="grid min-h-screen grid-rows-[1fr_auto] items-start">
        <div className="grid">

          {/* Page header */}
          <div className="relative bg-base-bg z-20 pt-40 ~pb-12/20">
            <div className="page-container page-intro text-center">
              <h2 className="text-accent-fg">{p.intro_heading}</h2>
              <p>{p.intro_body}</p>
            </div>
          </div>

          {/* Filter tabs + listing — Client Component */}
          <div className="grid gap-y-blocks relative bg-base-bg z-20 pb-blocks">
            <ScoopsList items={data.scoopsItems} />

            {/* Speculative applications CTA */}
            <div
              className="relative"
              style={{
                ['--color-accent-bg' as string]: '110 63 141',
                ['--color-base-bg' as string]:   '110 63 141',
                ['--color-accent-fg' as string]: '213 193 255',
              }}
            >
              {/* Wave top */}
              <div className="absolute top-0 -translate-y-full w-screen z-20">
                <WaveDivider fillClass="fill-base-bg" variant="zigzag" />
              </div>

              <div className="bg-accent-bg ~py-16/28">
                <div className="page-container">
                  <div className="lg:px-page flex flex-col md:flex-row md:items-center justify-between gap-y-8 ~gap-x-10/20">
                    <h3 className="text-accent-fg ~text-3xl/5xl font-semibold leading-tight tracking-tight text-balance max-w-xl">
                      {p.speculative_heading}
                    </h3>
                    <div className="flex-shrink-0">
                      <a
                        href={`mailto:${p.speculative_email}`}
                        className="inline-flex items-center justify-center ~text-base/xl leading-none cursor-pointer border-2 border-accent-fg text-accent-fg hover:bg-accent-fg hover:text-accent-bg hover:scale-105 ~pt-1/2.5 ~pb-1.5/3.5 ~px-4/6 font-semibold transition rounded-full"
                      >
                        {p.speculative_button_text}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <Footer global={global} />
      </div>
    </>
  )
}
