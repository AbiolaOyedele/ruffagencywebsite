import type { Metadata, Viewport } from 'next'

// Re-fetch global data (nav, maintenance mode) on every request.
// Without this the layout may be statically cached at build time and never
// reflect admin changes such as toggling maintenance mode.
export const dynamic = 'force-dynamic'

import { MenuProvider } from '@/lib/menu-context'
import { LenisProvider } from '@/components/features/shared/LenisProvider'
import { PageLoader } from '@/components/features/shared/PageLoader'
import { Nav } from '@/components/ui/Nav'
import { MenuOverlay } from '@/components/features/shared/MenuOverlay'
import { MaintenancePage } from '@/components/ui/MaintenancePage'
import { fetchGlobalData } from '@/services/cms'

export const metadata: Metadata = {
  title: {
    template: '%s | The Ruff Agency',
    default: 'The Ruff Agency — Animation Studio in London',
  },
  description:
    'The Ruff Agency is an animation studio in London. We love creating characterful things for brands with big ideas, finding the personality in every project.',
  keywords: ['animation', 'illustration', 'animation studio', 'london', 'character creation', 'branding'],
  openGraph: {
    siteName: 'The Ruff Agency',
    locale: 'en_GB',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#1e1e23',
}

/**
 * Public site layout — wraps every public page with nav, menu overlay,
 * smooth scroll (Lenis), and the page loader.
 *
 * Lives in the (site) route group so admin routes inherit ONLY the
 * minimal root layout (html/body shell) and get clean native scroll.
 */
export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const global = await fetchGlobalData()

  // ── Maintenance mode ──────────────────────────────────────
  // Toggled via the admin panel → Global Settings → Maintenance Mode.
  // When on, every public route shows the maintenance page.
  if (global.site.maintenance_mode) {
    return <MaintenancePage />
  }

  return (
    <MenuProvider>
      {/* Page loader — shows eye-roll animation on every route change */}
      <PageLoader />

      <LenisProvider>
        {/* Fixed navigation */}
        <Nav />

        {/* Full-screen menu overlay */}
        <MenuOverlay items={global.navigation} />

        {children}
      </LenisProvider>
    </MenuProvider>
  )
}
