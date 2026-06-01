import type { Metadata } from 'next'
import './admin.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: { template: '%s | Admin — The Ruff Agency', default: 'Admin — The Ruff Agency' },
  robots: { index: false, follow: false },
}

/**
 * Root layout for all /admin/* routes.
 * Uses its own CSS (system fonts, neutral admin palette).
 * No public site nav, loader, or smooth scroll.
 */
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            border: '1px solid #e5e7eb',
            padding: '12px 16px',
            color: '#1e1e23',
            fontSize: '14px',
            borderRadius: '8px',
          },
          success: { iconTheme: { primary: '#2DC05E', secondary: 'white' } },
          error:   { iconTheme: { primary: '#E92038', secondary: 'white' } },
        }}
      />
    </>
  )
}
