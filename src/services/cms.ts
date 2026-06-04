/**
 * cms.ts — Unified data layer
 *
 * Content (projects, scoops, testimonials, logos, global nav/settings) → Sanity
 * Page styling (colors, intro text, hero images) → Supabase settings table
 *
 * All functions are wrapped in React cache() for request-level deduplication.
 */

import { cache } from 'react'
import { supabase } from '@/lib/supabase'
import {
  fetchSanityProjects,
  fetchSanityTestimonials,
  fetchSanityLogos,
  fetchSanityScoops,
  fetchSanityGlobalSettings,
} from '@/sanity/lib/queries'
import type {
  GlobalData,
  HomePageBundle,
  HomePageSettings,
  WorkPageBundle,
  WorkPageSettings,
  AboutPageBundle,
  AboutPageSettings,
  ContactPageBundle,
  ContactPageSettings,
  ScoopsPageBundle,
  ScoopsPageSettings,
  NavItem,
  Project,
  Testimonial,
  Logo,
  ScoopItem,
} from '@/types/cms'

// ── Supabase setting reader ───────────────────────────────────

async function fetchSetting(key: string): Promise<Record<string, unknown> | null> {
  const { data } = await supabase
    .from('ruff_settings')
    .select('value')
    .eq('key', key)
    .single()
  return (data?.value as Record<string, unknown>) ?? null
}

function resolve<T>(result: PromiseSettledResult<T | null>, fallback: T): T {
  if (result.status === 'fulfilled' && result.value !== null && result.value !== undefined) {
    return result.value
  }
  return fallback
}

// ── Defaults ──────────────────────────────────────────────────

const GLOBAL_DEFAULTS: GlobalData = {
  site: { name: 'The Ruff Agency', description: 'Animation studio in London.' },
  social: { instagram: '#', linkedin: '#', tiktok: '#', youtube: '#' },
  footer: {
    new_business_email: 'business@theruff.agency',
    general_email: 'hello@theruff.agency',
    copyright_year: new Date().getFullYear(),
  },
  navigation: [
    { label: 'Work',    href: '/work',    overlay_bg_color: '#e92038', text_hover_color: '#feb3d2' },
    { label: 'About',   href: '/about',   overlay_bg_color: '#2dc05e', text_hover_color: '#c9faa8' },
    { label: 'Scoop',   href: '/scoops',  overlay_bg_color: '#7c65fe', text_hover_color: '#fffde0' },
    { label: 'Contact', href: '/contact', overlay_bg_color: '#fd7b33', text_hover_color: '#fffde0' },
  ],
}

export const HOME_DEFAULTS: HomePageSettings = {
  accent_fg: '254 179 210',
  accent_bg: '99 77 255',
  footer_bg: 'rgb(213,193,255)',
  hero_image_url: '/images/hero.jpg',
  intro_heading: 'Creative Rebellion',
  intro_subheading: 'in every pixel',
  intro_body: "We're The Ruff Agency, an animation and design studio based in London, UK. With a love for character, distilled design and pixel-perfect motion, we create expressive work for brands and agencies of all sizes.",
  cta_text: 'Find out more about us',
  cta_href: '/about',
  marquee_bg_color: '213 243 255',
}

const WORK_DEFAULTS: WorkPageSettings = {
  accent_fg: '233 32 56',
  accent_bg: '233 32 56',
  footer_bg: 'rgb(255,220,225)',
  intro_heading: 'Our Work',
  intro_body: "Character-led animation and design for the world's most ambitious brands.",
}

const ABOUT_DEFAULTS: AboutPageSettings = {
  accent_fg: '45 192 84',
  accent_bg: '45 192 84',
  footer_bg: 'rgb(201,250,168)',
  hero_image_url: 'https://animade-website.s3-eu-west-2.amazonaws.com/pages/about/_1920xAUTO_crop_center-center_none/aboutHeader.png',
  intro_heading: 'Making the world more characterful',
  intro_body: 'We believe in the power of character. Our designs and animations are packed with personality and thoughtful moments that leave a lasting impression.',
  studio_pill: 'The studio',
  studio_text_1: "The Ruff Agency is an animation and design studio based in London with a love for character, distilled design and pixel-perfect motion, creating expressive work for brands and agencies of all sizes.\n\nWe've been helping our partners solve creative challenges since our doors opened in 2010.",
  studio_text_2: "We help brands stand out from the sea of same, add warmth to digital experiences and tell stories that genuinely connect with audiences.\n\nOur work packs personality in every pixel, with thoughtful moments that leave a lasting impression.",
  studio_image_1_url: 'https://animade-website.s3-eu-west-2.amazonaws.com/pages/about/_1920xAUTO_crop_center-center_none/Jen-sq-crop.jpg',
  studio_image_2_url: 'https://animade-website.s3-eu-west-2.amazonaws.com/pages/about/_1920xAUTO_crop_center-center_none/Ed-sq-crop.jpg',
  capabilities_col1: ['Design + illustration', 'Concepting + development', '2D animation', '3D animation / CGI', 'Hand drawn animation', 'Interactive + AR + games'],
  capabilities_col2: ['Storyboarding + animatics', 'Branding + design systems', 'Motion guidelines', 'Sound design + music + VO', 'Script writing support', 'Creative workshops + talks'],
  team_image_1_url: 'https://animade-website.s3-eu-west-2.amazonaws.com/pages/about/_1024xAUTO_crop_center-center_none/Gizmo-rec-crop.jpg',
  team_image_2_url: 'https://animade-website.s3-eu-west-2.amazonaws.com/pages/about/_1024xAUTO_crop_center-center_none/Jim-rec-crop.png',
  full_width_image_url: 'https://animade-website.s3-eu-west-2.amazonaws.com/pages/about/_1920xAUTO_crop_center-center_none/ffb8ed06184f904c8d6d5fa442e24b811162fcfa.jpg',
  about_text_1: "Whether it's 2D or 3D, our tight knit team of directors, illustrators, designers, animators and producers bring this attention to detail to every single project.",
  about_text_2: "Over the years, we've had the joy of helping brands find their voice by creating brand illustration and motion systems, bringing mascots to life, explaining complex concepts through motion and building playful, immersive worlds for animated mini-series and sticker packs.",
}

const CONTACT_DEFAULTS: ContactPageSettings = {
  accent_fg: '253 123 51',
  accent_bg: '253 123 51',
  footer_bg: 'rgb(255,220,200)',
  intro_heading: 'Say hello',
  intro_body: "We'd love to hear from you. Whether you have a project in mind, want to join the team, or just want to chat — drop us a line.",
  new_business_heading: "Got a project? Let's talk.",
  new_business_description: "From full campaigns to one-off animations, we work with brands of all sizes. Tell us what you're making.",
  new_business_email: 'business@theruff.agency',
  jobs_heading: 'Want to work with us?',
  jobs_description: "We're always on the lookout for talented animators, designers and producers. Browse our current openings on the Scoops page.",
  jobs_link: '/scoops',
  general_heading: 'All other enquiries',
  general_description: "Press, partnerships, general questions — we're friendly, we promise.",
  general_email: 'hello@theruff.agency',
  studio_address: 'The Ruff Agency\nLondon, UK',
}

const SCOOPS_PAGE_DEFAULTS: ScoopsPageSettings = {
  accent_fg: '124 101 254',
  accent_bg: '124 101 254',
  footer_bg: 'rgb(220,213,255)',
  intro_heading: 'Scoops',
  intro_body: 'News, jobs and opportunities from inside The Ruff Agency.',
  speculative_heading: "Don't see the right role? Send us a speculative application.",
  speculative_button_text: 'Get in touch',
  speculative_email: 'hello@theruff.agency',
}

// ── Public API ────────────────────────────────────────────────

/**
 * Global data — nav, footer, social, maintenance mode.
 * Reads from Sanity siteSettings first, falls back to Supabase + defaults.
 */
export const fetchGlobalData = cache(async (): Promise<GlobalData> => {
  const [sanityResult, supabaseNavResult, supabaseSiteResult, supabaseSocialResult, supabaseFooterResult] =
    await Promise.allSettled([
      fetchSanityGlobalSettings(),
      fetchSetting('global.navigation'),
      fetchSetting('global.site'),
      fetchSetting('global.social'),
      fetchSetting('global.footer'),
    ])

  // Sanity takes priority
  const sanity = sanityResult.status === 'fulfilled' ? sanityResult.value : null
  if (sanity) {
    return {
      site:       { ...GLOBAL_DEFAULTS.site,   ...sanity.site },
      social:     { ...GLOBAL_DEFAULTS.social, ...sanity.social },
      footer:     { ...GLOBAL_DEFAULTS.footer, ...sanity.footer },
      navigation: sanity.navigation?.length ? sanity.navigation as NavItem[] : GLOBAL_DEFAULTS.navigation,
    }
  }

  // Fall back to Supabase
  const navRaw = resolve(supabaseNavResult, null) as NavItem[] | null
  return {
    site:       { ...GLOBAL_DEFAULTS.site,   ...resolve(supabaseSiteResult,   {}) },
    social:     { ...GLOBAL_DEFAULTS.social, ...resolve(supabaseSocialResult, {}) },
    footer:     { ...GLOBAL_DEFAULTS.footer, ...resolve(supabaseFooterResult, {}) },
    navigation: navRaw ?? GLOBAL_DEFAULTS.navigation,
  }
})

/** Homepage — projects, testimonials, logos from Sanity; page settings from Supabase */
export const fetchHomePageData = cache(async (): Promise<HomePageBundle> => {
  const [pageResult, projects, testimonials, logos] = await Promise.allSettled([
    fetchSetting('page.home'),
    fetchSanityProjects(),
    fetchSanityTestimonials(),
    fetchSanityLogos(),
  ])

  return {
    page: { ...HOME_DEFAULTS, ...resolve(pageResult, {}) } as HomePageSettings,
    projects: resolve(projects, []) as Project[],
    testimonials: resolve(testimonials, []) as Testimonial[],
    logos: resolve(logos, []) as Logo[],
  }
})

/** Work page — projects from Sanity; page settings from Supabase */
export const fetchWorkPageData = cache(async (): Promise<WorkPageBundle> => {
  const [pageResult, projects] = await Promise.allSettled([
    fetchSetting('page.work'),
    fetchSanityProjects(),
  ])

  return {
    page: { ...WORK_DEFAULTS, ...resolve(pageResult, {}) } as WorkPageSettings,
    projects: resolve(projects, []) as Project[],
  }
})

/** About page — page settings from Supabase */
export const fetchAboutPageData = cache(async (): Promise<AboutPageBundle> => {
  const [pageResult] = await Promise.allSettled([fetchSetting('page.about')])
  return { page: { ...ABOUT_DEFAULTS, ...resolve(pageResult, {}) } as AboutPageSettings }
})

/** Contact page — page settings from Supabase */
export const fetchContactPageData = cache(async (): Promise<ContactPageBundle> => {
  const [pageResult] = await Promise.allSettled([fetchSetting('page.contact')])
  return { page: { ...CONTACT_DEFAULTS, ...resolve(pageResult, {}) } as ContactPageSettings }
})

/** Scoops page — items from Sanity; page settings from Supabase */
export const fetchScoopsPageData = cache(async (): Promise<ScoopsPageBundle> => {
  const [pageResult, scoops] = await Promise.allSettled([
    fetchSetting('page.scoops'),
    fetchSanityScoops(),
  ])

  return {
    page: { ...SCOOPS_PAGE_DEFAULTS, ...resolve(pageResult, {}) } as ScoopsPageSettings,
    scoopsItems: resolve(scoops, []) as ScoopItem[],
  }
})
