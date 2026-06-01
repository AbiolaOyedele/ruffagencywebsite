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
import { getSetting } from '@/repositories/settings.repository'
import { saveSettingAction } from '@/app/admin/actions'
import type { HomePageSettings, PageColors } from '@/types/admin-cms.types'

const defaults: HomePageSettings = {
  accent_fg: '254 179 210',
  accent_bg: '99 77 255',
  footer_bg: 'rgb(213,193,255)',
  hero_image_url: '/images/hero.jpg',
  intro_heading: 'Personality',
  intro_subheading: 'in every pixel',
  intro_body:
    "We're The Ruff Agency, an animation and design studio based in London, UK. With a love for character, distilled design and pixel-perfect motion, we create expressive work for brands and agencies of all sizes.",
  cta_text: 'Find out more about us',
  cta_href: '/about.html',
  marquee_bg_color: '213 243 255',
  burger_color: '',
}

export default function HomePageEditor() {
  const [settings, setSettings] = useState<HomePageSettings>(defaults)
  const [original, setOriginal] = useState<HomePageSettings | null>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const data = await getSetting('page.home')
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
      await saveSettingAction('page.home', settings)
      setOriginal(settings)
      toast.success('Home page settings saved.')
    } catch {
      toast.error('Failed to save settings.')
    } finally {
      setSaving(false)
    }
  }, [settings])

  function update<K extends keyof HomePageSettings>(key: K, value: HomePageSettings[K]) {
    setSettings((s) => ({ ...s, [key]: value }))
  }

  function updateColor<K extends keyof PageColors>(key: K, value: PageColors[K]) {
    setSettings((s) => ({ ...s, [key]: value }))
  }

  if (loading) {
    return (
      <>
        <PageHeader title="Home Page" />
        <div className="flex items-center justify-center p-20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#e5e7eb] border-t-[#1e1e23]" />
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader
        title="Home Page"
        description="Hero image, intro text, colors and accent settings for the home page."
      />

      <div className="p-8 pb-32 space-y-6">
        {/* Colors */}
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
          <CardHeader>
            <div>
              <CardTitle>Hero Image</CardTitle>
              <CardDescription>The full-screen background image on the home page.</CardDescription>
            </div>
          </CardHeader>
          <ImageUpload
            label="Hero image"
            value={settings.hero_image_url}
            onChange={(v) => update('hero_image_url', v)}
            hint="Recommended: 2560×1440px or larger. JPG or WebP."
          />
        </Card>

        {/* Intro */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Intro Section</CardTitle>
              <CardDescription>The animated heading and body copy below the hero.</CardDescription>
            </div>
          </CardHeader>
          <div className="grid gap-4">
            <Input
              label='Animated heading word (the word that animates in letter-by-letter)'
              value={settings.intro_heading}
              onChange={(e) => update('intro_heading', e.target.value)}
              hint='e.g. "Personality" — this word gets the letter animation.'
            />
            <Input
              label="Heading rest (shown as second line)"
              value={settings.intro_subheading}
              onChange={(e) => update('intro_subheading', e.target.value)}
              hint='e.g. "in every pixel"'
            />
            <Textarea
              label="Body copy"
              value={settings.intro_body}
              onChange={(e) => update('intro_body', e.target.value)}
              rows={4}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label='"Find out more" link text'
                value={settings.cta_text}
                onChange={(e) => update('cta_text', e.target.value)}
              />
              <Input
                label='"Find out more" link href'
                value={settings.cta_href}
                onChange={(e) => update('cta_href', e.target.value)}
              />
            </div>
          </div>
        </Card>

        {/* Marquee */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Client Logos Marquee</CardTitle>
              <CardDescription>Background color for the client logos strip. Edit the logos themselves under Client Logos.</CardDescription>
            </div>
          </CardHeader>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#374151]">
              Marquee background color
            </label>
            <p className="text-xs text-[#6b7280]">
              Stored as space-separated RGB. Current: <code className="font-mono">{settings.marquee_bg_color}</code>
            </p>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={'#' + settings.marquee_bg_color.trim().split(' ').map((x) => parseInt(x).toString(16).padStart(2, '0')).join('')}
                onChange={(e) => {
                  const hex = e.target.value
                  const r = parseInt(hex.slice(1, 3), 16)
                  const g = parseInt(hex.slice(3, 5), 16)
                  const b = parseInt(hex.slice(5, 7), 16)
                  update('marquee_bg_color', `${r} ${g} ${b}`)
                }}
                className="h-9 w-9 cursor-pointer rounded-lg border border-[#d1d5db] p-0.5"
              />
              <input
                type="text"
                value={settings.marquee_bg_color}
                onChange={(e) => update('marquee_bg_color', e.target.value)}
                placeholder="213 243 255"
                className="flex-1 rounded-lg border border-[#d1d5db] px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#1e1e23]"
              />
            </div>
          </div>
        </Card>
      </div>

      <SaveBar isDirty={isDirty} saving={saving} onSave={() => void handleSave()} onReset={() => original && setSettings(original)} />
    </>
  )
}
