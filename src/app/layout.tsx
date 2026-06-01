import type { Metadata, Viewport } from 'next'
import { MenuProvider } from '@/lib/menu-context'
import { LenisProvider } from '@/components/features/shared/LenisProvider'
import { PageLoader } from '@/components/features/shared/PageLoader'
import { Nav } from '@/components/ui/Nav'
import { MenuOverlay } from '@/components/features/shared/MenuOverlay'
import { MaintenancePage } from '@/components/ui/MaintenancePage'
import { fetchGlobalData } from '@/services/cms'
import './globals.css'

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
 * Root layout — wraps every page with nav, menu overlay, smooth scroll, and page loader.
 * Global CMS data (navigation, footer) is fetched here once per request.
 */
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const global = await fetchGlobalData()

  // ── Maintenance mode ──────────────────────────────────────
  // Toggled via the admin panel → Global Settings → Maintenance Mode.
  // When on, every public route shows the maintenance page.
  if (global.site.maintenance_mode) {
    return (
      <html lang="en-GB" className="overscroll-none">
        <body>
          <MaintenancePage />
        </body>
      </html>
    )
  }

  return (
    <html lang="en-GB" className="overscroll-none">
      <body className="relative bg-base-bg text-base-fg antialiased overflow-x-hidden selection:bg-accent-bg selection:text-accent-fg">
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
      </body>
    </html>
  )
}
