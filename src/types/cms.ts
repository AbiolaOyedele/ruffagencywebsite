// ── Primitive records ─────────────────────────────────────────

export interface Project {
  id: string
  slug: string
  title: string
  client: string
  description: string
  bg_color: string
  image_url: string
  href: string
  categories: string[]
  is_featured: boolean
  sort_order: number
}

export interface Testimonial {
  id: string
  quote: string
  credit: string
  sort_order?: number
}

export interface Logo {
  id: string
  title: string
  image_url: string
  /** Legacy field from original site — prefer image_url */
  url?: string
}

export interface ScoopItem {
  id: string
  title: string
  type: 'job' | 'news'
  category: string
  description: string
  href: string
  slug?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content?: any[]
}

// ── Settings ──────────────────────────────────────────────────

export interface PageColors {
  accent_fg?: string
  accent_bg?: string
  footer_bg?: string
  base_bg?: string
  base_fg?: string
  burger_color?: string
}

export interface HomePageSettings extends PageColors {
  hero_image_url: string
  intro_heading: string
  intro_subheading: string
  intro_body: string
  cta_text: string
  cta_href: string
  marquee_bg_color: string
}

export interface WorkPageSettings extends PageColors {
  intro_heading: string
  intro_body: string
}

export interface AboutPageSettings extends PageColors {
  intro_heading: string
  intro_body: string
  hero_image_url: string
  studio_pill: string
  studio_text_1: string
  studio_text_2: string
  studio_image_1_url: string
  studio_image_2_url: string
  capabilities_col1: string[]
  capabilities_col2: string[]
  team_image_1_url: string
  team_image_2_url: string
  full_width_image_url: string
  about_text_1: string
  about_text_2: string
}

export interface ContactPageSettings extends PageColors {
  intro_heading: string
  intro_body: string
  new_business_heading: string
  new_business_description: string
  new_business_email: string
  jobs_heading: string
  jobs_description: string
  jobs_link: string
  general_heading: string
  general_description: string
  general_email: string
  studio_address: string
}

export interface ScoopsPageSettings extends PageColors {
  intro_heading: string
  intro_body: string
  speculative_heading: string
  speculative_button_text: string
  speculative_email: string
}

// ── Navigation ────────────────────────────────────────────────

export interface NavItem {
  label: string
  href: string
  overlay_bg_color: string
  text_hover_color: string
}

// ── Global ────────────────────────────────────────────────────

export interface GlobalData {
  site: { name: string; description: string; maintenance_mode?: boolean }
  social: { instagram: string; linkedin: string; tiktok: string; youtube: string }
  footer: { new_business_email: string; general_email: string; copyright_year: number }
  navigation: NavItem[]
}

// ── Page-level bundles ────────────────────────────────────────

export interface HomePageBundle {
  page: HomePageSettings
  projects: Project[]
  testimonials: Testimonial[]
  logos: Logo[]
}

export interface WorkPageBundle {
  page: WorkPageSettings
  projects: Project[]
}

export interface AboutPageBundle {
  page: AboutPageSettings
}

export interface ContactPageBundle {
  page: ContactPageSettings
}

export interface ScoopsPageBundle {
  page: ScoopsPageSettings
  scoopsItems: ScoopItem[]
}
