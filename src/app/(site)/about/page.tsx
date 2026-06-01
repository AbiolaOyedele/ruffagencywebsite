import type { Metadata } from 'next'
import Image from 'next/image'
import { fetchAboutPageData, fetchGlobalData } from '@/services/cms'
import { WaveDivider } from '@/components/ui/WaveDivider'
import { Footer } from '@/components/ui/Footer'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'About',
  description: 'The Ruff Agency is an animation and design studio based in London with a love for character, distilled design and pixel-perfect motion.',
}

export default async function AboutPage() {
  const [data, global] = await Promise.all([fetchAboutPageData(), fetchGlobalData()])
  const p = data.page

  const cssVars = `
    :root {
      --color-accent-fg: ${p.accent_fg ?? '45 192 84'};
      --color-accent-bg: ${p.accent_bg ?? '45 192 84'};
      --color-footer-bg: ${p.footer_bg ?? 'rgb(201,250,168)'};
    }
  `.trim()

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssVars }} />

      <h1 className="sr-only">About</h1>

      <div className="grid min-h-screen grid-rows-[1fr_auto] items-start">
        <div className="grid">

          {/* ── Hero ── */}
          <div className="relative grid overflow-hidden">
            <div className="fixed inset-0 z-0 overflow-hidden">
              <Image
                src={p.hero_image_url}
                alt="The Ruff Agency studio"
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
            </div>
            {/* Spacer that sets the hero height to match the image aspect ratio */}
            <div
              className="relative z-10"
              style={{ paddingBottom: 'min(calc(100vw * 753 / 1970), 100dvh)' }}
            />
            {/* Curves wave bottom */}
            <div className="absolute bottom-0 z-20 w-full">
              <WaveDivider fillClass="fill-base-bg" variant="curves" />
            </div>
          </div>

          {/* ── Spacer + Intro ── */}
          <div className="relative bg-base-bg z-20 ~pt-20/28" />
          <div className="relative bg-base-bg text-accent-fg z-20 ~pb-12/20">
            <div className="page-container page-intro text-center">
              <h2>{p.intro_heading}</h2>
              <p className="large">{p.intro_body}</p>
            </div>
          </div>

          <div className="grid gap-y-blocks relative bg-base-bg z-20">

            {/* ── Studio — text left, image right ── */}
            <div className="relative">
              <div className="page-container text-accent-fg">
                <div className="grid sm:grid-cols-12 gap-gutter items-center">
                  <div className="sm:col-span-10 sm:col-start-2 md:row-start-1 md:col-span-6 md:col-start-1 grid gap-y-text lg:px-page rte-block">
                    <p className="pill">{p.studio_pill}</p>
                    <p>{p.studio_text_1}</p>
                  </div>
                  <div className="sm:col-span-10 sm:col-start-2 md:row-start-1 md:col-span-6 md:col-start-7">
                    <Image
                      src={p.studio_image_1_url}
                      alt="Studio team member"
                      width={960}
                      height={960}
                      className="w-full ~rounded-[.625rem]/[1.25rem]"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Studio — image left, text right ── */}
            <div className="relative md:-mt-blocks-2x">
              <div className="pt-blocks pb-blocks-2x">
                <div className="page-container text-accent-fg">
                  <div className="grid sm:grid-cols-12 gap-gutter items-center">
                    <div className="sm:col-span-10 sm:col-start-2 md:row-start-1 md:col-span-6 md:col-start-7 grid gap-y-text lg:px-page rte-block">
                      <p>{p.studio_text_2}</p>
                    </div>
                    <div className="sm:col-span-10 sm:col-start-2 md:row-start-1 md:col-span-6 md:col-start-1">
                      <Image
                        src={p.studio_image_2_url}
                        alt="Studio team member"
                        width={960}
                        height={960}
                        className="w-full ~rounded-[.625rem]/[1.25rem]"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Capabilities heading (mint) ── */}
            <div
              className="relative -mt-blocks"
              style={{ ['--color-accent-bg' as string]: '201 250 168', ['--color-accent-fg' as string]: '45 192 84' }}
            >
              <div className="absolute top-0 -translate-y-full w-screen z-20">
                <WaveDivider fillClass="fill-base-bg" variant="zigzag" />
              </div>
              <div className="bg-accent-bg text-brand-black pt-blocks">
                <div className="page-container text-accent-fg">
                  <div className="grid sm:grid-cols-12 gap-x-gutter lg:px-page">
                    <div className="sm:col-span-10 sm:col-start-2 md:col-span-12 md:col-start-auto">
                      <h2 className="heading2">Capabilities</h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Capabilities list ── */}
            <div
              className="relative -mt-blocks"
              style={{ ['--color-accent-bg' as string]: '201 250 168', ['--color-accent-fg' as string]: '45 192 84' }}
            >
              <div className="bg-accent-bg text-brand-black pt-blocks pb-blocks">
                <div className="page-container text-accent-fg">
                  <div className="grid sm:grid-cols-12 gap-x-gutter gap-y-block lg:px-page">
                    <div className="sm:col-span-10 sm:col-start-2 md:col-span-6 md:col-start-auto">
                      <div className="grid gap-y-text rte-block max-w-prose">
                        {(p.capabilities_col1 ?? []).map((item) => (
                          <p key={item}>{item}</p>
                        ))}
                      </div>
                    </div>
                    <div className="sm:col-span-10 sm:col-start-2 md:col-span-6 md:col-start-auto">
                      <div className="grid gap-y-text rte-block max-w-prose">
                        {(p.capabilities_col2 ?? []).map((item) => (
                          <p key={item}>{item}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Team images ── */}
            <div
              className="relative -mt-blocks"
              style={{ ['--color-accent-bg' as string]: '201 250 168', ['--color-accent-fg' as string]: '45 192 84' }}
            >
              <div className="bg-accent-bg text-brand-black pb-blocks">
                <div className="page-container text-accent-fg">
                  <div className="grid gap-gutter lg:grid-cols-2">
                    <Image
                      src={p.team_image_1_url}
                      alt="Team member"
                      width={1024}
                      height={757}
                      className="w-full ~rounded-[.625rem]/[1.25rem]"
                      loading="lazy"
                    />
                    <Image
                      src={p.team_image_2_url}
                      alt="Team member"
                      width={1024}
                      height={761}
                      className="w-full ~rounded-[.625rem]/[1.25rem]"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── About text columns ── */}
            <div className="relative">
              <div className="page-container text-accent-fg">
                <div className="grid sm:grid-cols-12 gap-x-gutter gap-y-block lg:px-page">
                  <div className="sm:col-span-10 sm:col-start-2 md:col-span-6 md:col-start-auto">
                    <div className="grid gap-y-text rte-block max-w-prose">
                      <p>{p.about_text_1}</p>
                    </div>
                  </div>
                  <div className="sm:col-span-10 sm:col-start-2 md:col-span-6 md:col-start-auto">
                    <div className="grid gap-y-text rte-block max-w-prose">
                      <p>{p.about_text_2}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Full-width image ── */}
            <div className="relative">
              <div className="page-container text-accent-fg">
                <Image
                  src={p.full_width_image_url}
                  alt="The Ruff Agency team"
                  width={1920}
                  height={1158}
                  className="w-full ~rounded-[.625rem]/[1.25rem]"
                  loading="lazy"
                />
              </div>
            </div>

          </div>
        </div>

        <Footer global={global} />
      </div>
    </>
  )
}
