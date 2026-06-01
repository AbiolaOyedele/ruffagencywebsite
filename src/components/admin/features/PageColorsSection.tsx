'use client'

import ColorPicker from '@/components/admin/ui/ColorPicker'
import Card, { CardHeader, CardTitle, CardDescription } from '@/components/admin/ui/Card'
import type { PageColors } from '@/types/admin-cms.types'

interface PageColorsSectionProps {
  values: PageColors
  onChange: <K extends keyof PageColors>(key: K, value: PageColors[K]) => void
}

export default function PageColorsSection({ values, onChange }: PageColorsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Page Colors</CardTitle>
          <CardDescription>Accent colors used for headings, buttons and links on this page.</CardDescription>
        </div>
      </CardHeader>
      <div className="grid gap-6 sm:grid-cols-2">
        <ColorPicker
          label="Accent foreground (text & borders)"
          value={values.accent_fg}
          onChange={(v) => onChange('accent_fg', v)}
          hint="Used for headings, buttons, and active elements. Stored as space-separated RGB."
          rgbMode
        />
        <ColorPicker
          label="Accent background (fills)"
          value={values.accent_bg}
          onChange={(v) => onChange('accent_bg', v)}
          hint="Used for button hover fills and selection backgrounds. Stored as space-separated RGB."
          rgbMode
        />
        <ColorPicker
          label="Footer background"
          value={values.footer_bg.replace('rgb(', '').replace(')', '').replace(/,/g, ' ')}
          onChange={(v) => {
            // Convert "r g b" → "rgb(r,g,b)"
            const parts = v.split(' ')
            if (parts.length === 3) {
              onChange('footer_bg', `rgb(${parts.join(',')})`)
            } else {
              onChange('footer_bg', v)
            }
          }}
          hint='Stored as "rgb(r,g,b)". Used for the footer section background.'
          rgbMode
        />
      </div>

      {/* Live preview */}
      <div className="mt-6 rounded-lg overflow-hidden border border-[#e5e7eb]">
        <div
          className="px-4 py-3 text-sm font-semibold"
          style={{
            backgroundColor: `rgb(${values.accent_fg})`,
            color: 'white',
          }}
        >
          Accent foreground preview
        </div>
        <div
          className="px-4 py-3 text-sm font-semibold text-white"
          style={{
            backgroundColor: `rgb(${values.accent_bg})`,
          }}
        >
          Accent background preview
        </div>
        <div
          className="px-4 py-3 text-sm font-semibold text-[#1e1e23]"
          style={{ backgroundColor: values.footer_bg }}
        >
          Footer background preview
        </div>
      </div>
    </Card>
  )
}
