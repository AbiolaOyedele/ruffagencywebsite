import { cache } from 'react'
import { supabase } from '@/lib/supabase'
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
  intro_body:
    "We're The Ruff Agency, an animation and design studio based in London, UK. With a love for character, distilled design and pixel-perfect motion, we create expressive work for brands and agencies of all sizes.",
  cta_text: 'Find out more about us',
  cta_href: '/about',
  marquee_bg_color: '213 243 255',
}

export const PROJECT_DEFAULTS: Project[] = [
  {
    id: 'lego',
    slug: 'lego-build-day',
    title: 'LEGO Build Day',
    client: 'LEGO',
    description: 'A social campaign to get people building together',
    bg_color: '#ffcd00',
    image_url: '/images/projects/lego-build-day/Lego.png',
    href: '/work/lego-build-day',
    categories: ['featured', 'ads'],
    is_featured: true,
    sort_order: 0,
  },
  {
    id: 'apple',
    slug: 'apple-seollal',
    title: 'Apple Seollal',
    client: 'Apple',
    description: 'Dancing into the Korean New Year!',
    bg_color: '#c9faa8',
    image_url: '/images/projects/apple-seollal/Apple.png',
    href: '/work/apple-seollal',
    categories: ['featured', 'ads'],
    is_featured: false,
    sort_order: 1,
  },
  {
    id: 'dropbox',
    slug: 'dropbox-presents',
    title: 'Dropbox Presents',
    client: 'Dropbox',
    description: 'Capturing the creative process for Hollywood',
    bg_color: '#feb3d2',
    image_url: '/images/projects/dropbox-presents/Dropbox-Presents.png',
    href: '/work/dropbox-presents',
    categories: ['ads'],
    is_featured: false,
    sort_order: 2,
  },
  {
    id: 'youtube',
    slug: 'youtube-shopping',
    title: 'YouTube Shopping',
    client: 'YouTube',
    description: 'An illustration system to liven up in-app shopping',
    bg_color: '#d5f3ff',
    image_url: '/images/projects/youtube-shopping/Youtube.png',
    href: '/work/youtube-shopping',
    categories: ['design'],
    is_featured: false,
    sort_order: 3,
  },
]

export const TESTIMONIAL_DEFAULTS: Testimonial[] = [
  {
    id: '1',
    quote:
      '<p>In-house creative departments are looking for studios that possess a unicorn combination of technical expertise, creative stamina, and collaborative spirit. The Ruff Agency embodies these qualities in spades.</p>',
    credit: '<p>Jonathan Lee, Meta</p>',
  },
  {
    id: '2',
    quote:
      '<p>The Ruff Agency are animation wizards, super professional, and can even make Zoom chats a pleasure. After our first commission was complete, we immediately booked in two more.</p>',
    credit: '<p>Procreate</p>',
  },
  {
    id: '3',
    quote:
      '<p>Their team brought an incredible level of creativity and organization to every step of the process, making collaboration seamless and inspiring.</p>',
    credit: '<p>Kim Nguyen, YouTube</p>',
  },
  {
    id: '4',
    quote:
      '<p>Not only is their work super creative and the team super organised, they are a lovely bunch of people who made every interaction delightful!</p>',
    credit: '<p>Charlotte Riley, CYLNDR</p>',
  },
  {
    id: '5',
    quote:
      '<p>Professional &amp; brilliantly creative, they were true problem solvers. Briefing was seamless, their approach clearly communicated.</p>',
    credit: '<p>Raluca Anastasiu, adam&amp;eveDDB</p>',
  },
]

export const LOGO_DEFAULTS: Logo[] = [
  { id: '1',  title: 'Adam and eve DDB',      image_url: '/images/homepage/Adam-and-eve-DDB-logo.svg' },
  { id: '2',  title: 'Ogilvy',                image_url: '/images/homepage/Ogilvy-logo.svg' },
  { id: '3',  title: 'WeTransfer',            image_url: '/images/homepage/WeTransfer-logo.svg' },
  { id: '4',  title: 'Google',                image_url: '/images/homepage/Google-logo.svg' },
  { id: '5',  title: 'Meta',                  image_url: '/images/homepage/Meta-logo.svg' },
  { id: '6',  title: 'Samsung',               image_url: '/images/homepage/Samsung-logo.svg' },
  { id: '7',  title: 'Airbnb',                image_url: '/images/homepage/Airbnb-logo.svg' },
  { id: '8',  title: 'Figma',                 image_url: '/images/homepage/Figma-logo.svg' },
  { id: '9',  title: 'BBC',                   image_url: '/images/homepage/BBC-logo.svg' },
  { id: '10', title: 'Netflix',               image_url: '/images/homepage/Netflix-logo.svg' },
  { id: '11', title: 'Procreate',             image_url: '/images/homepage/Procreate-logo.svg' },
  { id: '12', title: 'Apple',                 image_url: '/images/homepage/AppleLogo-WebsiteV3.svg' },
  { id: '13', title: 'Dropbox',               image_url: '/images/homepage/Dropbox-logo.svg' },
  { id: '14', title: 'Collins',               image_url: '/images/homepage/Collins-logo.svg' },
  { id: '15', title: 'Mailchimp',             image_url: '/images/homepage/Mailchimp-logo.svg' },
  { id: '16', title: 'Jones Knowles Ritchie', image_url: '/images/homepage/Jones-Knowles-Ritchie-letters-logo.svg' },
  { id: '17', title: 'Net-a-Porter',          image_url: '/images/homepage/Net-a-Porter-logo.svg' },
  { id: '18', title: 'Wolff Olins',           image_url: '/images/homepage/Wolff-Olins-Animade.svg' },
  { id: '19', title: 'Wise',                  image_url: '/images/homepage/Wise-logo.svg' },
  { id: '20', title: 'AKQA',                  image_url: '/images/homepage/AKQA-logo.svg' },
  { id: '21', title: 'IBM',                   image_url: '/images/homepage/IBM-logo.svg' },
  { id: '22', title: 'CoppaFeel',             image_url: '/images/homepage/CoppaFeel-logo.svg' },
  { id: '23', title: 'Klarna',               image_url: '/images/homepage/Klarna-logo.svg' },
  { id: '24', title: 'Duolingo',              image_url: '/images/homepage/Duolingo-logo.svg' },
]

// ── Helpers ───────────────────────────────────────────────────

async function fetchSetting(key: string): Promise<Record<string, unknown> | null> {
  const { data } = await supabase
    .from('ruff_settings')
    .select('value')
    .eq('key', key)
    .single()
  return (data?.value as Record<string, unknown>) ?? null
}

function resolve<T>(
  result: PromiseSettledResult<T | null>,
  fallback: T,
): T {
  if (result.status === 'fulfilled' && result.value !== null && result.value !== undefined) {
    return result.value
  }
  return fallback
}

/**
 * Normalise hrefs from the old Vite/HTML site to Next.js routes.
 * The live Supabase DB still stores paths like /about.html, /work/index.html.
 */
function normaliseHref(href: string): string {
  return href
    .replace(/\/work\/index\.html$/, '/work')
    .replace(/\/scoops\/index\.html$/, '/scoops')
    .replace(/\/about\.html$/, '/about')
    .replace(/\/contact\.html$/, '/contact')
    .replace(/\/index\.html$/, '/')
    .replace(/\.html$/, '')
}

// ── Public API ────────────────────────────────────────────────

/**
 * Fetch global data (nav, footer, social).
 * Wrapped in React cache() so layout + page share one request per render.
 */
export const fetchGlobalData = cache(async (): Promise<GlobalData> => {
  const [navResult, siteResult, socialResult, footerResult] = await Promise.allSettled([
    fetchSetting('global.navigation'),
    fetchSetting('global.site'),
    fetchSetting('global.social'),
    fetchSetting('global.footer'),
  ])

  const navRaw = resolve(navResult, null) as NavItem[] | null

  // Normalise hrefs so old Vite paths (/about.html) become Next.js routes (/about)
  const navigation = navRaw
    ? navRaw.map(item => ({ ...item, href: normaliseHref(item.href) }))
    : GLOBAL_DEFAULTS.navigation

  return {
    site:   { ...GLOBAL_DEFAULTS.site,   ...resolve(siteResult,   {}) },
    social: { ...GLOBAL_DEFAULTS.social, ...resolve(socialResult, {}) },
    footer: { ...GLOBAL_DEFAULTS.footer, ...resolve(footerResult, {}) },
    navigation,
  }
})

/**
 * Fetch all data needed to render the homepage.
 */
export const fetchHomePageData = cache(async (): Promise<HomePageBundle> => {
  const [pageResult, projectsResult, testimonialsResult, logosResult] = await Promise.allSettled([
    fetchSetting('page.home'),
    supabase
      .from('ruff_projects')
      .select('*')
      .eq('published', true)
      .order('sort_order', { ascending: true })
      .then(({ data }) => data ?? []),
    supabase
      .from('ruff_testimonials')
      .select('*')
      .eq('published', true)
      .order('sort_order', { ascending: true })
      .then(({ data }) => data ?? []),
    supabase
      .from('ruff_client_logos')
      .select('*')
      .eq('published', true)
      .order('sort_order', { ascending: true })
      .then(({ data }) => data ?? []),
  ])

  const pageData = {
    ...HOME_DEFAULTS,
    ...resolve(pageResult, {}),
  } as HomePageSettings

  const rawProjects = resolve(projectsResult, null) as Project[] | null
  const testimonials = resolve(testimonialsResult, null) as Testimonial[] | null
  const logos = resolve(logosResult, null) as Logo[] | null

  // Normalise project hrefs (/work/lego-build-day.html → /work/lego-build-day)
  const projects = rawProjects?.map(p => ({ ...p, href: normaliseHref(p.href) })) ?? null

  return {
    page: pageData,
    projects: projects?.length ? projects : PROJECT_DEFAULTS,
    testimonials: testimonials?.length ? testimonials : TESTIMONIAL_DEFAULTS,
    logos: logos?.length ? logos : LOGO_DEFAULTS,
  }
})

// ── Work ──────────────────────────────────────────────────────

const WORK_DEFAULTS: WorkPageSettings = {
  accent_fg: '233 32 56',
  accent_bg: '233 32 56',
  footer_bg: 'rgb(255,220,225)',
  intro_heading: 'Our Work',
  intro_body: "Character-led animation and design for the world's most ambitious brands.",
}

export const fetchWorkPageData = cache(async (): Promise<WorkPageBundle> => {
  const [pageResult, projectsResult] = await Promise.allSettled([
    fetchSetting('page.work'),
    supabase
      .from('ruff_projects')
      .select('*')
      .eq('published', true)
      .order('sort_order', { ascending: true })
      .then(({ data }) => data ?? []),
  ])

  const pageData = { ...WORK_DEFAULTS, ...resolve(pageResult, {}) } as WorkPageSettings
  const rawProjects = resolve(projectsResult, null) as Project[] | null
  const projects = rawProjects?.map(p => ({ ...p, href: normaliseHref(p.href) })) ?? null

  return {
    page: pageData,
    projects: projects?.length ? projects : PROJECT_DEFAULTS,
  }
})

// ── About ─────────────────────────────────────────────────────

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

export const fetchAboutPageData = cache(async (): Promise<AboutPageBundle> => {
  const [pageResult] = await Promise.allSettled([fetchSetting('page.about')])
  const pageData = { ...ABOUT_DEFAULTS, ...resolve(pageResult, {}) } as AboutPageSettings
  return { page: pageData }
})

// ── Contact ───────────────────────────────────────────────────

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

export const fetchContactPageData = cache(async (): Promise<ContactPageBundle> => {
  const [pageResult] = await Promise.allSettled([fetchSetting('page.contact')])
  const pageData = { ...CONTACT_DEFAULTS, ...resolve(pageResult, {}) } as ContactPageSettings
  return { page: pageData }
})

// ── Scoops ────────────────────────────────────────────────────

const SCOOPS_DEFAULTS_PAGE: ScoopsPageSettings = {
  accent_fg: '124 101 254',
  accent_bg: '124 101 254',
  footer_bg: 'rgb(220,213,255)',
  intro_heading: 'Scoops',
  intro_body: 'News, jobs and opportunities from inside The Ruff Agency.',
  speculative_heading: "Don't see the right role? Send us a speculative application.",
  speculative_button_text: 'Get in touch',
  speculative_email: 'hello@theruff.agency',
}

export const SCOOPS_ITEM_DEFAULTS: ScoopItem[] = [
  { id: '1', title: 'Senior Character Animator', type: 'job',  category: 'Animation',    description: "We're looking for a senior animator to join our London studio.", href: '#' },
  { id: '2', title: 'Motion Designer',           type: 'job',  category: 'Design',       description: 'Join our design team to craft beautiful, character-driven motion.', href: '#' },
  { id: '3', title: 'Producer',                  type: 'job',  category: 'Production',   description: 'An experienced producer to keep our projects running smoothly.', href: '#' },
  { id: '4', title: 'We won a Vega Award for our LEGO Build Day campaign', type: 'news', category: 'April 2026', description: 'Our LEGO Build Day social campaign has been recognised at the Vega Digital Awards.', href: '#' },
  { id: '5', title: "The Ruff Agency is featured in It's Nice That", type: 'news', category: 'March 2026', description: "It's Nice That spotlight our work with Apple for Seollal.", href: '#' },
]

export const fetchScoopsPageData = cache(async (): Promise<ScoopsPageBundle> => {
  const [pageResult, scoopsResult] = await Promise.allSettled([
    fetchSetting('page.scoops'),
    supabase
      .from('ruff_scoops')
      .select('*')
      .eq('published', true)
      .order('sort_order', { ascending: true })
      .then(({ data }) => data ?? []),
  ])

  const pageData = { ...SCOOPS_DEFAULTS_PAGE, ...resolve(pageResult, {}) } as ScoopsPageSettings
  const scoopsItems = resolve(scoopsResult, null) as ScoopItem[] | null

  return {
    page: pageData,
    scoopsItems: scoopsItems?.length ? scoopsItems : SCOOPS_ITEM_DEFAULTS,
  }
})
