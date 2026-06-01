'use client'

import { useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import PageHeader from '@/components/admin/features/PageHeader'
import SaveBar from '@/components/admin/features/SaveBar'
import PageColorsSection from '@/components/admin/features/PageColorsSection'
import Card, { CardHeader, CardTitle, CardDescription } from '@/components/admin/ui/Card'
import Input from '@/components/admin/ui/Input'
import Textarea from '@/components/admin/ui/Textarea'
import { getSetting, upsertSetting } from '@/repositories/settings.repository'
import type { WorkPageSettings, PageColors } from '@/types/admin-cms.types'

const defaults: WorkPageSettings = {
  accent_fg: '233 32 56',
  accent_bg: '233 32 56',
  footer_bg: 'rgb(255,220,225)',
  intro_heading: 'Our Work',
  intro_body: "Character-led animation and design for the world's most ambitious brands.",
  burger_color: '',
}

export default function WorkPageEditor() {
  const [settings, setSettings] = useState<WorkPageSettings>(defaults)
  const [original, setOriginal] = useState<WorkPageSettings | null>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const data = await getSetting('page.work')
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
      await upsertSetting('page.work', settings)
      setOriginal(settings)
      toast.success('Work page settings saved.')
    } catch {
      toast.error('Failed to save settings.')
    } finally {
      setSaving(false)
    }
  }, [settings])

  function update<K extends keyof WorkPageSettings>(key: K, value: WorkPageSettings[K]) {
    setSettings((s) => ({ ...s, [key]: value }))
  }

  function updateColor<K extends keyof PageColors>(key: K, value: PageColors[K]) {
    setSettings((s) => ({ ...s, [key]: value }))
  }

  if (loading) {
    return (
      <>
        <PageHeader title="Work Page" />
        <div className="flex items-center justify-center p-20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#e5e7eb] border-t-[#1e1e23]" />
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader
        title="Work Page"
        description="Page intro text and accent colors. Manage projects separately under Projects."
      />

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

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Page Intro</CardTitle>
              <CardDescription>The heading and body copy at the top of the Work page.</CardDescription>
            </div>
          </CardHeader>
          <div className="grid gap-4">
            <Input
              label="Heading"
              value={settings.intro_heading}
              onChange={(e) => update('intro_heading', e.target.value)}
            />
            <Textarea
              label="Body copy"
              value={settings.intro_body}
              onChange={(e) => update('intro_body', e.target.value)}
              rows={3}
            />
          </div>
        </Card>
      </div>

      <SaveBar isDirty={isDirty} saving={saving} onSave={() => void handleSave()} onReset={() => original && setSettings(original)} />
    </>
  )
}
