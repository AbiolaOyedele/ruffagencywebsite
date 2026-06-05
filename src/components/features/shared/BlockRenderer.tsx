'use client'

import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import type { ContentBlock, PortableTextBlock, SanityImageRef } from '@/sanity/lib/queries'

interface BlockRendererProps {
  blocks: ContentBlock[]
}

// ── Portable Text component overrides ────────────────────────

const ptComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="~text-base/xl leading-relaxed text-base-fg/80">{children}</p>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="~text-2xl/4xl font-semibold tracking-tight text-base-fg leading-tight">{children}</h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="~text-xl/3xl font-semibold tracking-tight text-base-fg leading-tight">{children}</h3>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="border-l-4 border-accent-fg pl-6 italic text-base-fg/70 ~text-lg/2xl">{children}</blockquote>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => <strong className="font-semibold text-base-fg">{children}</strong>,
    em: ({ children }: { children?: React.ReactNode }) => <em className="italic">{children}</em>,
    link: ({ value, children }: { value?: { href?: string }; children?: React.ReactNode }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline decoration-2 underline-offset-4 hover:text-accent-fg transition-colors"
      >
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="list-disc list-inside space-y-2 ~text-base/xl text-base-fg/80">{children}</ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol className="list-decimal list-inside space-y-2 ~text-base/xl text-base-fg/80">{children}</ol>
    ),
  },
}

// ── Image resolver ────────────────────────────────────────────

function resolveBlockImage(imageUrl?: string, image?: SanityImageRef): string {
  if (imageUrl) return imageUrl
  if (!image?.asset?._ref) return ''
  const [, id, dims, ext] = image.asset._ref.split('-')
  return `https://cdn.sanity.io/images/b5qnbouz/production/${id}-${dims}.${ext}`
}

// ── Individual block renderers ────────────────────────────────

function TextBlock({ content, html }: { content?: PortableTextBlock[]; html?: string }) {
  return (
    <div className="page-container lg:px-page">
      <div className="max-w-3xl space-y-6 rte-rendered">
        {/* Admin-built content uses HTML; Sanity content uses Portable Text */}
        {html
          ? <div dangerouslySetInnerHTML={{ __html: html }} className="prose-ruff" />
          : content && (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            <PortableText value={content as any} components={ptComponents} />
          )
        }
      </div>
    </div>
  )
}

function ImageBlock({
  image, imageUrl, caption, size,
}: {
  image?: SanityImageRef
  imageUrl?: string
  caption?: string
  size?: 'contained' | 'full-width'
}) {
  const src = resolveBlockImage(imageUrl, image)
  if (!src) return null

  return (
    <div className={size === 'full-width' ? 'w-full' : 'page-container lg:px-page'}>
      <figure>
        <div className="relative w-full aspect-video overflow-hidden ~rounded-[.625rem]/[1.25rem]">
          <Image src={src} alt={caption ?? ''} fill className="object-cover" sizes="(max-width: 1280px) 100vw, 80vw" />
        </div>
        {caption && (
          <figcaption className="mt-3 text-sm text-base-fg/50 text-center">{caption}</figcaption>
        )}
      </figure>
    </div>
  )
}

function ImageTextBlock({
  image, imageUrl, html, text, layout,
}: {
  image?: SanityImageRef
  imageUrl?: string
  html?: string
  text?: PortableTextBlock[]
  layout?: 'image-left' | 'image-right'
}) {
  const src = resolveBlockImage(imageUrl, image)
  const imageFirst = layout !== 'image-right'

  return (
    <div className="page-container lg:px-page">
      <div className={`grid md:grid-cols-2 gap-gutter items-center ${imageFirst ? '' : 'md:[&>*:first-child]:order-2'}`}>
        {src && (
          <div className="relative aspect-square overflow-hidden ~rounded-[.625rem]/[1.25rem]">
            <Image src={src} alt="" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
          </div>
        )}
        {(html ?? text) && (
          <div className="space-y-6">
            {html
              ? <div dangerouslySetInnerHTML={{ __html: html }} className="prose-ruff" />
              : text && (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                <PortableText value={text as any} components={ptComponents} />
              )
            }
          </div>
        )}
      </div>
    </div>
  )
}

function TwoColumnText({
  leftColumn, rightColumn, leftHtml, rightHtml,
}: {
  leftColumn?: PortableTextBlock[]
  rightColumn?: PortableTextBlock[]
  leftHtml?: string
  rightHtml?: string
}) {
  return (
    <div className="page-container lg:px-page">
      <div className="grid md:grid-cols-2 gap-gutter">
        <div className="space-y-6">
          {leftHtml
            ? <div dangerouslySetInnerHTML={{ __html: leftHtml }} className="prose-ruff" />
            : leftColumn && (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              <PortableText value={leftColumn as any} components={ptComponents} />
            )
          }
        </div>
        <div className="space-y-6">
          {rightHtml
            ? <div dangerouslySetInnerHTML={{ __html: rightHtml }} className="prose-ruff" />
            : rightColumn && (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              <PortableText value={rightColumn as any} components={ptComponents} />
            )
          }
        </div>
      </div>
    </div>
  )
}

function VideoBlock({ url, caption }: { url?: string; caption?: string }) {
  if (!url) return null

  // Convert YouTube/Vimeo watch URLs to embed URLs
  const embedUrl = url
    .replace('youtube.com/watch?v=', 'youtube.com/embed/')
    .replace('youtu.be/', 'youtube.com/embed/')
    .replace('vimeo.com/', 'player.vimeo.com/video/')

  return (
    <div className="page-container lg:px-page">
      <figure>
        <div className="relative w-full aspect-video overflow-hidden ~rounded-[.625rem]/[1.25rem] bg-black">
          <iframe
            src={embedUrl}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
        {caption && (
          <figcaption className="mt-3 text-sm text-base-fg/50 text-center">{caption}</figcaption>
        )}
      </figure>
    </div>
  )
}

function ImageGallery({
  images, columns = 2,
}: {
  images?: SanityImageRef[]
  columns?: 2 | 3 | 4
}) {
  if (!images?.length) return null

  const colClass = { 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-2 sm:grid-cols-4' }[columns]

  return (
    <div className="page-container lg:px-page">
      <div className={`grid ${colClass} gap-gutter`}>
        {images.map((img, i) => {
          // img can be a string URL (admin) or a SanityImageRef object
          const src = typeof img === 'string' ? img : resolveBlockImage(undefined, img as SanityImageRef)
          if (!src) return null
          return (
            <div key={i} className="relative aspect-square overflow-hidden ~rounded-[.625rem]/[1.25rem]">
              <Image src={src} alt="" fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Main renderer ─────────────────────────────────────────────

export function BlockRenderer({ blocks }: BlockRendererProps) {
  if (!blocks?.length) return null

  return (
    <div className="grid gap-y-blocks">
      {blocks.map((block) => {
        switch (block._type) {
          case 'textBlock':
            return (
              <TextBlock
                key={block._key}
                content={block.content}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                html={(block as any).html}
              />
            )

          case 'imageBlock':
            return (
              <ImageBlock
                key={block._key}
                image={block.image}
                imageUrl={block.imageUrl}
                caption={block.caption}
                size={block.size}
              />
            )

          case 'imageTextBlock':
            return (
              <ImageTextBlock
                key={block._key}
                image={block.image}
                imageUrl={block.imageUrl}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                html={(block as any).html}
                text={block.text}
                layout={block.layout}
              />
            )

          case 'twoColumnText':
            return (
              <TwoColumnText
                key={block._key}
                leftColumn={block.leftColumn}
                rightColumn={block.rightColumn}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                leftHtml={(block as any).leftHtml}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                rightHtml={(block as any).rightHtml}
              />
            )

          case 'videoBlock':
            return <VideoBlock key={block._key} url={block.url} caption={block.caption} />

          case 'imageGallery':
            return (
              <ImageGallery
                key={block._key}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                images={block.images as any}
                columns={block.columns}
              />
            )

          default:
            return null
        }
      })}
    </div>
  )
}
