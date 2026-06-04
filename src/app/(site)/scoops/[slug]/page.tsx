import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { fetchSanityScoopBySlug } from '@/sanity/lib/queries'
import { fetchGlobalData } from '@/services/cms'
import { BlockRenderer } from '@/components/features/shared/BlockRenderer'
import { Footer } from '@/components/ui/Footer'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const scoop = await fetchSanityScoopBySlug(slug)
  if (!scoop) return { title: 'Not Found' }
  return {
    title: scoop.title,
    description: scoop.description ?? undefined,
  }
}

export default async function ScoopDetailPage({ params }: Props) {
  const { slug } = await params
  const [scoop, global] = await Promise.all([
    fetchSanityScoopBySlug(slug),
    fetchGlobalData(),
  ])

  if (!scoop) notFound()

  const cssVars = `
    :root {
      --color-accent-fg: 124 101 254;
      --color-accent-bg: 124 101 254;
      --color-footer-bg: rgb(220,213,255);
    }
  `.trim()

  const typeLabel = scoop.type === 'job' ? 'Job' : 'News'

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssVars }} />

      <div className="grid min-h-screen grid-rows-[1fr_auto] items-start">
        <div className="grid">

          {/* ── Header ───────────────────────────────────────── */}
          <div className="relative bg-base-bg z-20 pt-36 ~pb-12/20">
            <div className="page-container lg:px-page">
              <Link
                href="/scoops"
                className="inline-flex items-center gap-2 text-sm font-medium text-base-fg/50 hover:text-base-fg transition-colors mb-8 group"
              >
                <span className="group-hover:-translate-x-1 transition-transform">←</span>
                Back to scoops
              </Link>

              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-accent-fg/10 text-accent-fg">
                  {typeLabel}
                </span>
                {scoop.category && (
                  <span className="text-sm text-base-fg/50">{scoop.category}</span>
                )}
              </div>

              <h1 className="~text-3xl/6xl font-semibold tracking-tight leading-tight text-base-fg max-w-3xl">
                {scoop.title}
              </h1>

              {scoop.description && (
                <p className="mt-6 ~text-lg/2xl text-base-fg/70 max-w-2xl">
                  {scoop.description}
                </p>
              )}

              {scoop.href && (
                <a
                  href={scoop.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-8 font-semibold text-accent-fg hover:underline decoration-2 underline-offset-4"
                >
                  {scoop.type === 'job' ? 'Apply now' : 'Read more'} →
                </a>
              )}
            </div>
          </div>

          {/* ── Content blocks ───────────────────────────────── */}
          {scoop.content?.length > 0 && (
            <div className="bg-base-bg ~py-8/16 border-t border-base-fg/10">
              <BlockRenderer blocks={scoop.content} />
            </div>
          )}

        </div>

        <Footer global={global} />
      </div>
    </>
  )
}
