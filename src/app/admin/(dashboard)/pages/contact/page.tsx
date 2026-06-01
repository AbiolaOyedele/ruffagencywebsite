'use client'

import { useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import PageHeader from '@/components/admin/features/PageHeader'
import SaveBar from '@/components/admin/features/SaveBar'
import PageColorsSection from '@/components/admin/features/PageColorsSection'
import Card, { CardHeader, CardTitle, CardDescription } from '@/components/admin/ui/Card'
import Input from '@/components/admin/ui/Input'
import Textarea from '@/components/admin/ui/Textarea'
import { getSetting } from '@/repositories/settings.repository'
import { saveSettingAction } from '@/app/admin/actions'
import type { ContactPageSettings, PageColors } from '@/types/admin-cms.types'

const defaults: ContactPageSettings = {
  accent_fg: '253 123 51',
  accent_bg: '253 123 51',
  footer_bg: 'rgb(255,220,200)',
  intro_heading: 'Say hello',
  intro_body: "We'd love to hear from you. Whether you have a project in mind, want to join the team, or just want to chat — drop us a line.",
  new_business_heading: 'Got a project? Let\'s talk.',
  new_business_description: 'From full campaigns to one-off animations, we work with brands of all sizes. Tell us what you\'re making.',
  new_business_email: 'newbusiness@theruff.agency',
  jobs_heading: 'Want to work with us?',
  jobs_description: "We're always on the lookout for talented animators, designers and producers. Browse our current openings on the Scoops page.",
  jobs_link: '/scoops/index.html',
  general_heading: 'All other enquiries',
  general_description: "Press, partnerships, general questions — we're friendly, we promise.",
  general_email: 'hello@theruff.agency',
  studio_address: 'The Ruff Agency\nLondon, UK',
  burger_color: '',
}

export default function ContactPageEditor() {
  const [settings, setSettings] = useState<ContactPageSettings>(defaults)
  const [original, setOriginal] = useState<ContactPageSettings | null>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const data = await getSetting('page.contact')
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
      await saveSettingAction('page.contact', settings)
      setOriginal(settings)
      toast.success('Contact page settings saved.')
    } catch {
      toast.error('Failed to save settings.')
    } finally {
      setSaving(false)
    }
  }, [settings])

  function update<K extends keyof ContactPageSettings>(key: K, value: ContactPageSettings[K]) {
    setSettings((s) => ({ ...s, [key]: value }))
  }

  function updateColor<K extends keyof PageColors>(key: K, value: PageColors[K]) {
    setSettings((s) => ({ ...s, [key]: value }))
  }

  if (loading) {
    return (
      <>
        <PageHeader title="Contact Page" />
        <div className="flex items-center justify-center p-20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#e5e7eb] border-t-[#1e1e23]" />
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader title="Contact Page" description="Contact details, section headings, and page colors." />

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
          <CardHeader><div><CardTitle>Page Intro</CardTitle></div></CardHeader>
          <div className="grid gap-4">
            <Input label="Heading" value={settings.intro_heading} onChange={(e) => update('intro_heading', e.target.value)} />
            <Textarea label="Body copy" value={settings.intro_body} onChange={(e) => update('intro_body', e.target.value)} rows={3} />
          </div>
        </Card>

        <Card>
          <CardHeader><div><CardTitle>New Business</CardTitle></div></CardHeader>
          <div className="grid gap-4">
            <Input label="Heading" value={settings.new_business_heading} onChange={(e) => update('new_business_heading', e.target.value)} />
            <Textarea label="Description" value={settings.new_business_description} onChange={(e) => update('new_business_description', e.target.value)} rows={3} />
            <Input label="Email" type="email" value={settings.new_business_email} onChange={(e) => update('new_business_email', e.target.value)} />
          </div>
        </Card>

        <Card>
          <CardHeader><div><CardTitle>Jobs &amp; Opportunities</CardTitle></div></CardHeader>
          <div className="grid gap-4">
            <Input label="Heading" value={settings.jobs_heading} onChange={(e) => update('jobs_heading', e.target.value)} />
            <Textarea label="Description" value={settings.jobs_description} onChange={(e) => update('jobs_description', e.target.value)} rows={3} />
            <Input label="Link (href)" value={settings.jobs_link} onChange={(e) => update('jobs_link', e.target.value)} />
          </div>
        </Card>

        <Card>
          <CardHeader><div><CardTitle>General Enquiries</CardTitle></div></CardHeader>
          <div className="grid gap-4">
            <Input label="Heading" value={settings.general_heading} onChange={(e) => update('general_heading', e.target.value)} />
            <Textarea label="Description" value={settings.general_description} onChange={(e) => update('general_description', e.target.value)} rows={3} />
            <Input label="Email" type="email" value={settings.general_email} onChange={(e) => update('general_email', e.target.value)} />
          </div>
        </Card>

        <Card>
          <CardHeader><div><CardTitle>Studio Details</CardTitle></div></CardHeader>
          <Textarea label="Studio address" value={settings.studio_address} onChange={(e) => update('studio_address', e.target.value)} rows={3} hint="One line per line of address." />
        </Card>
      </div>

      <SaveBar isDirty={isDirty} saving={saving} onSave={() => void handleSave()} onReset={() => original && setSettings(original)} />
    </>
  )
}
