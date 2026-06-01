'use client'

import { useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import PageHeader from '@/components/admin/features/PageHeader'
import SaveBar from '@/components/admin/features/SaveBar'
import PageColorsSection from '@/components/admin/features/PageColorsSection'
import Card, { CardHeader, CardTitle, CardDescription } from '@/components/admin/ui/Card'
import Input from '@/components/admin/ui/Input'
import Textarea from '@/components/admin/ui/Textarea'
import ImageUpload from '@/components/admin/ui/ImageUpload'
import Button from '@/components/admin/ui/Button'
import { getSetting, upsertSetting } from '@/repositories/settings.repository'
import type { AboutPageSettings, PageColors } from '@/types/admin-cms.types'

const defaults: AboutPageSettings = {
  accent_fg: '45 192 84',
  accent_bg: '45 192 84',
  footer_bg: 'rgb(201,250,168)',
  hero_image_url: 'https://animade-website.s3-eu-west-2.amazonaws.com/pages/about/_1920xAUTO_crop_center-center_none/aboutHeader.png',
  intro_heading: 'Making the world more characterful',
  intro_body: 'We believe in the power of character. Our designs and animations are packed with personality and thoughtful moments that leave a lasting impression.',
  studio_pill: 'The studio',
  studio_text_1: "The Ruff Agency is an animation and design studio based in London with a love for character, distilled design and pixel-perfect motion, creating expressive work for brands and agencies of all sizes.\n\nWe've been helping our partners solve creative challenges since our doors opened in 2010.",
  studio_text_2: 'We help brands stand out from the sea of same, add warmth to digital experiences and tell stories that genuinely connect with audiences.\n\nOur work packs personality in every pixel, with thoughtful moments that leave a lasting impression.',
  studio_image_1_url: 'https://animade-website.s3-eu-west-2.amazonaws.com/pages/about/_1920xAUTO_crop_center-center_none/Jen-sq-crop.jpg',
  studio_image_2_url: 'https://animade-website.s3-eu-west-2.amazonaws.com/pages/about/_1920xAUTO_crop_center-center_none/Ed-sq-crop.jpg',
  capabilities_col1: [
    'Design + illustration',
    'Concepting + development',
    '2D animation',
    '3D animation / CGI',
    'Hand drawn animation',
    'Interactive + AR + games',
  ],
  capabilities_col2: [
    'Storyboarding + animatics',
    'Branding + design systems',
    'Motion guidelines',
    'Sound design + music + VO',
    'Script writing support',
    'Creative workshops + talks',
  ],
  team_image_1_url: 'https://animade-website.s3-eu-west-2.amazonaws.com/pages/about/_1024xAUTO_crop_center-center_none/Gizmo-rec-crop.jpg',
  team_image_2_url: 'https://animade-website.s3-eu-west-2.amazonaws.com/pages/about/_1024xAUTO_crop_center-center_none/Jim-rec-crop.png',
  full_width_image_url: 'https://animade-website.s3-eu-west-2.amazonaws.com/pages/about/_1920xAUTO_crop_center-center_none/ffb8ed06184f904c8d6d5fa442e24b811162fcfa.jpg',
  about_text_1: "Whether it's 2D or 3D, our tight knit team of directors, illustrators, designers, animators and producers bring this attention to detail to every single project.",
  about_text_2: "Over the years, we've had the joy of helping brands find their voice by creating brand illustration and motion systems, bringing mascots to life, explaining complex concepts through motion and building playful, immersive worlds for animated mini-series and sticker packs.",
  burger_color: '',
}

export default function AboutPageEditor() {
  const [settings, setSettings] = useState<AboutPageSettings>(defaults)
  const [original, setOriginal] = useState<AboutPageSettings | null>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const data = await getSetting('page.about')
        const loaded = data ?? defaults
        setSettings(loaded)
        setOriginal(loaded)
      } catch {
        toast.error('Failed to load page settings.')
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  const isDirty = JSON.stringify(settings) !== JSON.stringify(original ?? defaults)

  const handleSave = useCallback(async () => {
    setSaving(true)
    try {
      await upsertSetting('page.about', settings)
      setOriginal(settings)
      toast.success('About page settings saved.')
    } catch {
      toast.error('Failed to save settings.')
    } finally {
      setSaving(false)
    }
  }, [settings])

  function update<K extends keyof AboutPageSettings>(key: K, value: AboutPageSettings[K]) {
    setSettings((s) => ({ ...s, [key]: value }))
  }

  function updateColor<K extends keyof PageColors>(key: K, value: PageColors[K]) {
    setSettings((s) => ({ ...s, [key]: value }))
  }

  function updateCapability(col: 'capabilities_col1' | 'capabilities_col2', index: number, value: string) {
    setSettings((s) => {
      const arr = [...s[col]]
      arr[index] = value
      return { ...s, [col]: arr }
    })
  }

  function addCapability(col: 'capabilities_col1' | 'capabilities_col2') {
    setSettings((s) => ({ ...s, [col]: [...s[col], ''] }))
  }

  function removeCapability(col: 'capabilities_col1' | 'capabilities_col2', index: number) {
    setSettings((s) => ({ ...s, [col]: s[col].filter((_, i) => i !== index) }))
  }

  if (loading) {
    return (
      <>
        <PageHeader title="About Page" />
        <div className="flex items-center justify-center p-20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#e5e7eb] border-t-[#1e1e23]" />
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader title="About Page" description="Hero, intro, studio text, capabilities, team images." />

      <div className="p-8 pb-32 space-y-6">
        <PageColorsSection values={settings} onChange={updateColor} />

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Burger Menu Color</CardTitle>
              <CardDescription>
                The hamburger icon color on this page. Leave blank to use the accent foreground color automatically.
              </CardDescription>
            </div>
          </CardHeader>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={settings.burger_color || '#1e1e23'}
              onChange={(e) => update('burger_color', e.target.value)}
              className="h-9 w-9 cursor-pointer rounded-lg border border-[#d1d5db] p-0.5"
            />
            <input
              type="text"
              value={settings.burger_color}
              onChange={(e) => update('burger_color', e.target.value)}
              placeholder="e.g. #FEB3D2 — leave blank to follow accent color"
              className="flex-1 rounded-lg border border-[#d1d5db] px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#1e1e23]"
            />
            {settings.burger_color && (
              <button
                type="button"
                onClick={() => update('burger_color', '')}
                className="text-xs text-[#9ca3af] hover:text-[#E92038] transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </Card>

        {/* Hero */}
        <Card>
          <CardHeader><div><CardTitle>Hero Image</CardTitle></div></CardHeader>
          <ImageUpload label="Hero image" value={settings.hero_image_url} onChange={(v) => update('hero_image_url', v)} />
        </Card>

        {/* Intro */}
        <Card>
          <CardHeader><div><CardTitle>Intro Section</CardTitle><CardDescription>The large heading and body copy below the hero.</CardDescription></div></CardHeader>
          <div className="grid gap-4">
            <Input label="Heading" value={settings.intro_heading} onChange={(e) => update('intro_heading', e.target.value)} />
            <Textarea label="Body copy" value={settings.intro_body} onChange={(e) => update('intro_body', e.target.value)} rows={3} />
          </div>
        </Card>

        {/* Studio Section */}
        <Card>
          <CardHeader><div><CardTitle>Studio Section</CardTitle><CardDescription>The two-column text + image sections below the intro.</CardDescription></div></CardHeader>
          <div className="grid gap-6">
            <Input label="Pill label" value={settings.studio_pill} onChange={(e) => update('studio_pill', e.target.value)} hint='e.g. "The studio"' />
            <div className="grid gap-4 lg:grid-cols-2">
              <Textarea label="Text column 1 (left panel)" value={settings.studio_text_1} onChange={(e) => update('studio_text_1', e.target.value)} rows={5} hint="Use two newlines for a paragraph break." />
              <Textarea label="Text column 2 (right panel)" value={settings.studio_text_2} onChange={(e) => update('studio_text_2', e.target.value)} rows={5} />
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <ImageUpload label="Team image 1 (portrait, right side)" value={settings.studio_image_1_url} onChange={(v) => update('studio_image_1_url', v)} hint="Square crop recommended." />
              <ImageUpload label="Team image 2 (portrait, left side)" value={settings.studio_image_2_url} onChange={(v) => update('studio_image_2_url', v)} hint="Square crop recommended." />
            </div>
          </div>
        </Card>

        {/* Capabilities */}
        <Card>
          <CardHeader><div><CardTitle>Capabilities</CardTitle><CardDescription>Two-column list of services.</CardDescription></div></CardHeader>
          <div className="grid gap-6 lg:grid-cols-2">
            {(['capabilities_col1', 'capabilities_col2'] as const).map((col, colIdx) => (
              <div key={col}>
                <p className="mb-3 text-sm font-medium text-[#374151]">Column {colIdx + 1}</p>
                <div className="space-y-2">
                  {settings[col].map((item, i) => (
                    <div key={i} className="flex gap-2">
                      <Input
                        value={item}
                        onChange={(e) => updateCapability(col, i, e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCapability(col, i)}
                        className="text-[#E92038] flex-shrink-0"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="secondary" size="sm" onClick={() => addCapability(col)}>
                    + Add item
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Team Images */}
        <Card>
          <CardHeader><div><CardTitle>Team Images</CardTitle><CardDescription>The landscape images in the green section.</CardDescription></div></CardHeader>
          <div className="grid gap-4 lg:grid-cols-2">
            <ImageUpload label="Team image 3 (left)" value={settings.team_image_1_url} onChange={(v) => update('team_image_1_url', v)} />
            <ImageUpload label="Team image 4 (right)" value={settings.team_image_2_url} onChange={(v) => update('team_image_2_url', v)} />
          </div>
        </Card>

        {/* Full width image */}
        <Card>
          <CardHeader><div><CardTitle>Full-Width Image</CardTitle></div></CardHeader>
          <ImageUpload label="Full-width team image" value={settings.full_width_image_url} onChange={(v) => update('full_width_image_url', v)} hint="Wide landscape crop recommended. 1920px minimum width." />
        </Card>

        {/* About text */}
        <Card>
          <CardHeader><div><CardTitle>About Text</CardTitle><CardDescription>Two-column text block after the team images.</CardDescription></div></CardHeader>
          <div className="grid gap-4 lg:grid-cols-2">
            <Textarea label="Paragraph 1" value={settings.about_text_1} onChange={(e) => update('about_text_1', e.target.value)} rows={4} />
            <Textarea label="Paragraph 2" value={settings.about_text_2} onChange={(e) => update('about_text_2', e.target.value)} rows={4} />
          </div>
        </Card>
      </div>

      <SaveBar isDirty={isDirty} saving={saving} onSave={() => void handleSave()} onReset={() => original && setSettings(original)} />
    </>
  )
}
