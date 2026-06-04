import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { fetchSanityProjectBySlug } from '@/sanity/lib/queries'
import { fetchGlobalData } from '@/services/cms'
import { BlockRenderer } from '@/components/features/shared/BlockRenderer'
import { Footer } from '@/components/ui/Footer'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = await fetchSanityProjectBySlug(slug)
  if (!project) return { title: 'Project Not Found' }
  return {
    title: `${project.title} — ${project.client}`,
    description: project.description ?? undefined,
  }
}

export default async function WorkDetailPage({ params }: Props) {
  const { slug } = await params
  const [project, global] = await Promise.all([
    fetchSanityProjectBySlug(slug),
    fetchGlobalData(),
  ])

  if (!project) notFound()

  const cssVars = `
    :root {
      --color-accent-fg: 233 32 56;
      --color-accent-bg: 233 32 56;
      --color-footer-bg: rgb(255,220,225);
    }
  `.trim()

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssVars }} />

      <div className="grid min-h-screen grid-rows-[1fr_auto] items-start">
        <div className="grid">

          {/* ── Hero ─────────────────────────────────────────── */}
          <div
            className="relative pt-36 ~pb-16/24 overflow-hidden"
            style={{ backgroundColor: project.bg_color }}
          >
            <div className="page-container lg:px-page">
              <Link
                href="/work"
                className="inline-flex items-center gap-2 text-sm font-medium text-brand-black/60 hover:text-brand-black transition-colors mb-8 group"
              >
                <span className="group-hover:-translate-x-1 transition-transform">←</span>
                Back to work
              </Link>
              <div className="grid md:grid-cols-2 gap-gutter items-end">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-brand-black/50 mb-3">
                    {project.client}
                  </p>
                  <h1 className="~text-4xl/7xl font-semibold tracking-tight leading-none text-brand-black">
                    {project.title}
                  </h1>
                  {project.description && (
                    <p className="mt-6 ~text-lg/2xl text-brand-black/70 max-w-md">
                      {project.description}
                    </p>
                  )}
                  {project.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-8">
                      {project.categories.map(cat => (
                        <span
                          key={cat}
                          className="px-3 py-1 rounded-full text-sm font-medium bg-brand-black/10 text-brand-black"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {project.image_url && (
                  <div className="relative aspect-[4/3] overflow-hidden ~rounded-[.625rem]/[1.25rem] mt-8 md:mt-0">
                    <Image
                      src={project.image_url}
                      alt={project.title}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Content blocks ───────────────────────────────── */}
          {project.content?.length > 0 && (
            <div className="bg-base-bg ~py-16/28">
              <BlockRenderer blocks={project.content} />
            </div>
          )}

          {/* ── Empty state ──────────────────────────────────── */}
          {(!project.content || project.content.length === 0) && (
            <div className="bg-base-bg py-24 text-center">
              <p className="text-base-fg/40 ~text-base/lg">
                Project details coming soon.
              </p>
              <Link
                href="/work"
                className="inline-flex items-center gap-2 mt-6 font-semibold text-accent-fg hover:underline"
              >
                ← See all work
              </Link>
            </div>
          )}

        </div>

        <Footer global={global} />
      </div>
    </>
  )
}
