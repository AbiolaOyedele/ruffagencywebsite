// ── Global Settings ──────────────────────────────────────────

export interface SocialLinks {
  instagram: string
  linkedin: string
  tiktok: string
  youtube: string
}

export interface FooterSettings {
  new_business_email: string
  general_email: string
  copyright_year: number
}

export interface NavigationItem {
  label: string
  href: string
  overlay_bg_color: string
  text_hover_color: string
}

export interface SiteSettings {
  name: string
  description: string
  maintenance_mode?: boolean
}

// ── Page Colors ──────────────────────────────────────────────

export interface PageColors {
  /** Space-separated RGB, e.g. "233 32 56" */
  accent_fg: string
  /** Space-separated RGB, e.g. "233 32 56" */
  accent_bg: string
  /** Full CSS value, e.g. "rgb(255,220,225)" */
  footer_bg: string
}

// ── Page Settings ─────────────────────────────────────────────

export interface HomePageSettings extends PageColors {
  burger_color: string
  hero_image_url: string
  intro_heading: string
  intro_subheading: string
  intro_body: string
  cta_text: string
  cta_href: string
  marquee_bg_color: string
}

export interface WorkPageSettings extends PageColors {
  burger_color: string
  intro_heading: string
  intro_body: string
}

export interface AboutPageSettings extends PageColors {
  burger_color: string
  hero_image_url: string
  intro_heading: string
  intro_body: string
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
  burger_color: string
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
  burger_color: string
  intro_heading: string
  intro_body: string
  speculative_heading: string
  speculative_button_text: string
  speculative_email: string
}

// ── Entity Types ──────────────────────────────────────────────

export interface Project {
  id: string
  slug: string
  title: string
  client: string
  description: string | null
  bg_color: string
  image_url: string | null
  href: string | null
  categories: string[]
  is_featured: boolean
  sort_order: number
  published: boolean
  created_at: string
  updated_at: string
}

export interface Testimonial {
  id: string
  quote: string
  credit: string
  sort_order: number
  published: boolean
  created_at: string
  updated_at: string
}

export interface ClientLogo {
  id: string
  title: string
  image_url: string
  sort_order: number
  published: boolean
  created_at: string
  updated_at: string
}

export interface Scoop {
  id: string
  title: string
  type: 'job' | 'news'
  category: string | null
  description: string | null
  href: string | null
  sort_order: number
  published: boolean
  created_at: string
  updated_at: string
}

// ── Settings Key Map ──────────────────────────────────────────

export type SettingsKey =
  | 'global.site'
  | 'global.social'
  | 'global.footer'
  | 'global.navigation'
  | 'page.home'
  | 'page.work'
  | 'page.about'
  | 'page.contact'
  | 'page.scoops'

export type SettingsValue<K extends SettingsKey> =
  K extends 'global.site' ? SiteSettings :
  K extends 'global.social' ? SocialLinks :
  K extends 'global.footer' ? FooterSettings :
  K extends 'global.navigation' ? NavigationItem[] :
  K extends 'page.home' ? HomePageSettings :
  K extends 'page.work' ? WorkPageSettings :
  K extends 'page.about' ? AboutPageSettings :
  K extends 'page.contact' ? ContactPageSettings :
  K extends 'page.scoops' ? ScoopsPageSettings :
  never
