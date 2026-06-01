import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  robots: { index: true, follow: true },
}

/**
 * Minimal root layout — provides the HTML/body shell only.
 *
 * Public pages live under (site)/layout.tsx which adds Nav, Lenis, etc.
 * Admin pages live under admin/layout.tsx which adds the admin chrome.
 * Neither bleeds into the other.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-GB" className="overscroll-none">
      <body className="relative bg-base-bg text-base-fg antialiased overflow-x-hidden selection:bg-accent-bg selection:text-accent-fg">
        {children}
      </body>
    </html>
  )
}
