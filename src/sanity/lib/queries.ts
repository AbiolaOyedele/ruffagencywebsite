import { sanityClient } from './client'
import { cache } from 'react'
import type {
  Project, Testimonial, Logo, ScoopItem, GlobalData,
} from '@/types/cms'

// ── Helpers ───────────────────────────────────────────────────

/** Resolve Sanity image asset ref to a CDN URL */
function assetUrl(asset?: { _ref?: string } | null): string {
  if (!asset?._ref) return ''
  // ref format: image-{id}-{w}x{h}-{ext}
  const [, id, dims, ext] = asset._ref.split('-')
  return `https://cdn.sanity.io/images/b5qnbouz/production/${id}-${dims}.${ext}`
}

/** Pick imageUrl (string) first, then Sanity asset, then empty string */
function resolveImage(imageUrl?: string, asset?: { _ref?: string } | null): string {
  if (imageUrl) return imageUrl
  return assetUrl(asset)
}

// ── GROQ queries ──────────────────────────────────────────────

const PROJECTS_QUERY = `
  *[_type == "project" && published == true] | order(sortOrder asc) {
    _id,
    title,
    client,
    "slug": slug.current,
    description,
    "bg_color": bgColor,
    imageUrl,
    "cardImageAsset": cardImage.asset,
    categories,
    "is_featured": isFeatured,
    "sort_order": sortOrder,
    content
  }
`

const PROJECT_BY_SLUG_QUERY = `
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    client,
    "slug": slug.current,
    description,
    "bg_color": bgColor,
    imageUrl,
    "cardImageAsset": cardImage.asset,
    categories,
    "is_featured": isFeatured,
    "sort_order": sortOrder,
    published,
    content
  }
`

const TESTIMONIALS_QUERY = `
  *[_type == "testimonial" && published == true] | order(sortOrder asc) {
    "_id": _id,
    quote,
    credit,
    "sort_order": sortOrder
  }
`

const LOGOS_QUERY = `
  *[_type == "clientLogo" && published == true] | order(sortOrder asc) {
    "_id": _id,
    title,
    logoUrl,
    "logoAsset": logo.asset,
    "sort_order": sortOrder
  }
`

const SCOOPS_QUERY = `
  *[_type == "scoop" && published == true] | order(sortOrder asc) {
    "_id": _id,
    title,
    type,
    category,
    description,
    href,
    "slug": slug.current,
    "sort_order": sortOrder,
    content
  }
`

const SITE_SETTINGS_QUERY = `
  *[_type == "siteSettings"][0] {
    siteName,
    siteDescription,
    maintenanceMode,
    navigation,
    social,
    footer
  }
`

const SCOOP_BY_SLUG_QUERY = `
  *[_type == "scoop" && slug.current == $slug][0] {
    "_id": _id,
    title,
    type,
    category,
    description,
    href,
    "slug": slug.current,
    "sort_order": sortOrder,
    published,
    content
  }
`

// ── Cached fetchers ───────────────────────────────────────────

export const fetchSanityProjects = cache(async (): Promise<Project[]> => {
  const raw = await sanityClient.fetch<RawProject[]>(PROJECTS_QUERY)
  return (raw ?? []).map(p => ({
    id: p._id,
    slug: p.slug ?? '',
    title: p.title ?? '',
    client: p.client ?? '',
    description: p.description ?? '',
    bg_color: p.bg_color ?? '#ffffff',
    image_url: resolveImage(p.imageUrl, p.cardImageAsset),
    href: `/work/${p.slug}`,
    categories: p.categories ?? [],
    is_featured: p.is_featured ?? false,
    sort_order: p.sort_order ?? 0,
    content: p.content,
  }))
})

export const fetchSanityProjectBySlug = cache(async (slug: string): Promise<ProjectDetail | null> => {
  const raw = await sanityClient.fetch<RawProject | null>(PROJECT_BY_SLUG_QUERY, { slug })
  if (!raw) return null
  return {
    id: raw._id,
    slug: raw.slug ?? '',
    title: raw.title ?? '',
    client: raw.client ?? '',
    description: raw.description ?? '',
    bg_color: raw.bg_color ?? '#ffffff',
    image_url: resolveImage(raw.imageUrl, raw.cardImageAsset),
    href: `/work/${raw.slug}`,
    categories: raw.categories ?? [],
    is_featured: raw.is_featured ?? false,
    sort_order: raw.sort_order ?? 0,
    content: raw.content ?? [],
  }
})

export const fetchSanityTestimonials = cache(async (): Promise<Testimonial[]> => {
  const raw = await sanityClient.fetch<Array<{ _id: string; quote: string; credit: string; sort_order: number }>>(TESTIMONIALS_QUERY)
  return (raw ?? []).map(t => ({
    id: t._id,
    quote: t.quote ?? '',
    credit: t.credit ?? '',
    sort_order: t.sort_order ?? 0,
  }))
})

export const fetchSanityLogos = cache(async (): Promise<Logo[]> => {
  const raw = await sanityClient.fetch<Array<{ _id: string; title: string; logoUrl?: string; logoAsset?: { _ref?: string }; sort_order: number }>>(LOGOS_QUERY)
  return (raw ?? []).map(l => ({
    id: l._id,
    title: l.title ?? '',
    image_url: resolveImage(l.logoUrl, l.logoAsset),
  }))
})

export const fetchSanityScoops = cache(async (): Promise<ScoopItem[]> => {
  const raw = await sanityClient.fetch<Array<RawScoop>>(SCOOPS_QUERY)
  return (raw ?? []).map(s => ({
    id: s._id,
    title: s.title ?? '',
    type: (s.type as 'job' | 'news') ?? 'news',
    category: s.category ?? '',
    description: s.description ?? '',
    href: s.href ?? '',
    slug: s.slug ?? '',
    content: s.content,
  }))
})

export const fetchSanityScoopBySlug = cache(async (slug: string): Promise<ScoopDetail | null> => {
  const raw = await sanityClient.fetch<RawScoop | null>(SCOOP_BY_SLUG_QUERY, { slug })
  if (!raw) return null
  return {
    id: raw._id,
    title: raw.title ?? '',
    type: (raw.type as 'job' | 'news') ?? 'news',
    category: raw.category ?? '',
    description: raw.description ?? '',
    href: raw.href ?? '',
    slug: raw.slug ?? '',
    content: raw.content ?? [],
  }
})

export const fetchSanityGlobalSettings = cache(async (): Promise<Partial<GlobalData> | null> => {
  const raw = await sanityClient.fetch<RawSiteSettings | null>(SITE_SETTINGS_QUERY)
  if (!raw) return null
  return {
    site: {
      name: raw.siteName ?? 'The Ruff Agency',
      description: raw.siteDescription ?? '',
      maintenance_mode: raw.maintenanceMode ?? false,
    },
    navigation: (raw.navigation ?? []).map(n => ({
      label: n.label ?? '',
      href: n.href ?? '/',
      overlay_bg_color: n.overlayBgColor ?? '#000000',
      text_hover_color: n.textHoverColor ?? '#ffffff',
    })),
    social: {
      instagram: raw.social?.instagram ?? '#',
      linkedin: raw.social?.linkedin ?? '#',
      tiktok: raw.social?.tiktok ?? '#',
      youtube: raw.social?.youtube ?? '#',
    },
    footer: {
      new_business_email: raw.footer?.newBusinessEmail ?? 'hello@theruff.agency',
      general_email: raw.footer?.generalEmail ?? 'hello@theruff.agency',
      copyright_year: raw.footer?.copyrightYear ?? new Date().getFullYear(),
    },
  }
})

// ── Raw Sanity types (internal) ───────────────────────────────

interface RawProject {
  _id: string
  title?: string
  client?: string
  slug?: string
  description?: string
  bg_color?: string
  imageUrl?: string
  cardImageAsset?: { _ref?: string }
  categories?: string[]
  is_featured?: boolean
  sort_order?: number
  content?: ContentBlock[]
}

interface RawScoop {
  _id: string
  title?: string
  type?: string
  category?: string
  description?: string
  href?: string
  slug?: string
  sort_order?: number
  content?: ContentBlock[]
}

interface RawSiteSettings {
  siteName?: string
  siteDescription?: string
  maintenanceMode?: boolean
  navigation?: Array<{ label?: string; href?: string; overlayBgColor?: string; textHoverColor?: string }>
  social?: { instagram?: string; linkedin?: string; tiktok?: string; youtube?: string }
  footer?: { newBusinessEmail?: string; generalEmail?: string; copyrightYear?: number }
}

// ── Extended types with content blocks ───────────────────────

export type ContentBlock =
  | { _key: string; _type: 'textBlock'; content: PortableTextBlock[] }
  | { _key: string; _type: 'imageBlock'; image?: SanityImageRef; imageUrl?: string; caption?: string; size?: 'contained' | 'full-width' }
  | { _key: string; _type: 'imageTextBlock'; image?: SanityImageRef; imageUrl?: string; text?: PortableTextBlock[]; layout?: 'image-left' | 'image-right' }
  | { _key: string; _type: 'twoColumnText'; leftColumn?: PortableTextBlock[]; rightColumn?: PortableTextBlock[] }
  | { _key: string; _type: 'videoBlock'; url?: string; caption?: string }
  | { _key: string; _type: 'imageGallery'; images?: SanityImageRef[]; columns?: 2 | 3 | 4 }

export interface SanityImageRef {
  asset?: { _ref?: string }
  hotspot?: { x: number; y: number }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PortableTextBlock = Record<string, any>

export interface ProjectDetail extends Project {
  content: ContentBlock[]
}

export interface ScoopDetail extends ScoopItem {
  content: ContentBlock[]
}

export { assetUrl, resolveImage }
