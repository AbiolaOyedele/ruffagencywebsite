import type { Metadata } from 'next'
import { fetchWorkPageData, fetchGlobalData } from '@/services/cms'
import { WorkGrid } from '@/components/features/work/WorkGrid'
import { Footer } from '@/components/ui/Footer'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Work',
  description: 'Explore our animation and design work for brands including Apple, LEGO, Dropbox, YouTube and more.',
}

export default async function WorkPage() {
  const [data, global] = await Promise.all([fetchWorkPageData(), fetchGlobalData()])

  const cssVars = `
    :root {
      --color-accent-fg: ${data.page.accent_fg ?? '233 32 56'};
      --color-accent-bg: ${data.page.accent_bg ?? '233 32 56'};
      --color-footer-bg: ${data.page.footer_bg ?? 'rgb(255,220,225)'};
    }
  `.trim()

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssVars }} />

      <h1 className="sr-only">Work</h1>

      <div className="grid min-h-screen grid-rows-[1fr_auto] items-start">
        <div className="grid">
          {/* Page header */}
          <div className="relative bg-base-bg z-20 pt-40 ~pb-8/12">
            <div className="page-container page-intro text-center">
              <h2 className="text-accent-fg">{data.page.intro_heading}</h2>
              <p>{data.page.intro_body}</p>
            </div>
          </div>

          {/* Interactive filter + grid — Client Component */}
          <WorkGrid projects={data.projects} />
        </div>

        <Footer global={global} />
      </div>
    </>
  )
}
