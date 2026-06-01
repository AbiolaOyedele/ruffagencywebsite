import type { Metadata } from 'next'
import { fetchContactPageData, fetchGlobalData } from '@/services/cms'
import { Footer } from '@/components/ui/Footer'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with The Ruff Agency for new business, collaborations, jobs and general enquiries.',
}

export default async function ContactPage() {
  const [data, global] = await Promise.all([fetchContactPageData(), fetchGlobalData()])
  const p = data.page

  const cssVars = `
    :root {
      --color-accent-fg: ${p.accent_fg ?? '253 123 51'};
      --color-accent-bg: ${p.accent_bg ?? '253 123 51'};
      --color-footer-bg: ${p.footer_bg ?? 'rgb(255,220,200)'};
    }
  `.trim()

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssVars }} />

      <h1 className="sr-only">Contact</h1>

      <div className="grid min-h-screen grid-rows-[1fr_auto] items-start">
        <div className="grid">

          {/* Page header */}
          <div className="relative bg-base-bg z-20 pt-40 ~pb-12/20">
            <div className="page-container page-intro text-center">
              <h2 className="text-accent-fg">{p.intro_heading}</h2>
              <p>{p.intro_body}</p>
            </div>
          </div>

          {/* Contact grid */}
          <div className="grid gap-y-blocks relative bg-base-bg z-20 pb-blocks">
            <div className="relative">
              <div className="page-container text-accent-fg">
                <div className="lg:px-page grid md:grid-cols-3 gap-y-16 gap-x-gutter">

                  {/* New Business */}
                  <div className="flex flex-col gap-y-6">
                    <div>
                      <p className="text-base-fg/50 ~text-sm/base uppercase tracking-widest font-semibold mb-3">
                        New Business
                      </p>
                      <h3 className="~text-2xl/4xl font-semibold leading-tight tracking-tight text-balance">
                        {p.new_business_heading}
                      </h3>
                    </div>
                    <p className="~text-base/lg text-base-fg/80 max-w-xs">{p.new_business_description}</p>
                    <a
                      href={`mailto:${p.new_business_email}`}
                      className="text-link font-bold ~text-base/lg"
                    >
                      {p.new_business_email}
                    </a>
                  </div>

                  {/* Jobs */}
                  <div className="flex flex-col gap-y-6">
                    <div>
                      <p className="text-base-fg/50 ~text-sm/base uppercase tracking-widest font-semibold mb-3">
                        Jobs &amp; Opportunities
                      </p>
                      <h3 className="~text-2xl/4xl font-semibold leading-tight tracking-tight text-balance">
                        {p.jobs_heading}
                      </h3>
                    </div>
                    <p className="~text-base/lg text-base-fg/80 max-w-xs">{p.jobs_description}</p>
                    <a href={p.jobs_link} className="text-link font-bold ~text-base/lg">
                      Browse openings →
                    </a>
                  </div>

                  {/* General */}
                  <div className="flex flex-col gap-y-6">
                    <div>
                      <p className="text-base-fg/50 ~text-sm/base uppercase tracking-widest font-semibold mb-3">
                        Everything Else
                      </p>
                      <h3 className="~text-2xl/4xl font-semibold leading-tight tracking-tight text-balance">
                        {p.general_heading}
                      </h3>
                    </div>
                    <p className="~text-base/lg text-base-fg/80 max-w-xs">{p.general_description}</p>
                    <a
                      href={`mailto:${p.general_email}`}
                      className="text-link font-bold ~text-base/lg"
                    >
                      {p.general_email}
                    </a>
                  </div>

                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="page-container">
                <div className="lg:px-page border-t border-base-fg/10" />
              </div>
            </div>

            {/* Studio + social */}
            <div className="relative pb-blocks">
              <div className="page-container text-accent-fg">
                <div className="lg:px-page grid md:grid-cols-2 gap-y-12 gap-x-gutter">
                  <div className="flex flex-col gap-y-4">
                    <p className="text-base-fg/50 ~text-sm/base uppercase tracking-widest font-semibold">
                      Studio
                    </p>
                    <address
                      className="not-italic ~text-lg/2xl text-base-fg leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: (p.studio_address ?? '').replace(/\n/g, '<br>'),
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-y-4">
                    <p className="text-base-fg/50 ~text-sm/base uppercase tracking-widest font-semibold">
                      Follow us
                    </p>
                    <div className="flex flex-wrap ~gap-x-6/10 ~gap-y-3/4 ~text-lg/2xl">
                      {[
                        { label: 'Instagram', href: global.social.instagram },
                        { label: 'LinkedIn',  href: global.social.linkedin  },
                        { label: 'TikTok',    href: global.social.tiktok    },
                        { label: 'YouTube',   href: global.social.youtube   },
                      ].map(({ label, href }) => (
                        <a
                          key={label}
                          href={href || '#'}
                          className="font-bold hover:underline decoration-[3px] underline-offset-4 transition text-base-fg"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {label}
                        </a>
                      ))}
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
