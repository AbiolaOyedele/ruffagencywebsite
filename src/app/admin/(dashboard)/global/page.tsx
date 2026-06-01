'use client'

import { useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import PageHeader from '@/components/admin/features/PageHeader'
import SaveBar from '@/components/admin/features/SaveBar'
import Card, { CardHeader, CardTitle, CardDescription } from '@/components/admin/ui/Card'
import Input from '@/components/admin/ui/Input'
import Toggle from '@/components/admin/ui/Toggle'
import { getSetting, upsertSetting } from '@/repositories/settings.repository'
import type {
  SiteSettings,
  SocialLinks,
  FooterSettings,
  NavigationItem,
} from '@/types/admin-cms.types'

const defaultSite: SiteSettings = {
  name: 'The Ruff Agency',
  description: 'The Ruff Agency is an animation studio in London.',
}

const defaultSocial: SocialLinks = {
  instagram: '',
  linkedin: '',
  tiktok: '',
  youtube: '',
}

const defaultFooter: FooterSettings = {
  new_business_email: 'newbusiness@theruff.agency',
  general_email: 'hello@theruff.agency',
  copyright_year: 2026,
}

const defaultNav: NavigationItem[] = [
  { label: 'Work', href: '/work/index.html', overlay_bg_color: '#e92038', text_hover_color: '#feb3d2' },
  { label: 'About', href: '/about.html', overlay_bg_color: '#2dc05e', text_hover_color: '#c9faa8' },
  { label: 'Scoop', href: '/scoops/index.html', overlay_bg_color: '#7c65fe', text_hover_color: '#fffde0' },
  { label: 'Contact', href: '/contact.html', overlay_bg_color: '#fd7b33', text_hover_color: '#fffde0' },
]

export default function GlobalSettingsPage() {
  const [site, setSite] = useState<SiteSettings>(defaultSite)
  const [social, setSocial] = useState<SocialLinks>(defaultSocial)
  const [footer, setFooter] = useState<FooterSettings>(defaultFooter)
  const [nav, setNav] = useState<NavigationItem[]>(defaultNav)

  const [original, setOriginal] = useState<{
    site: SiteSettings
    social: SocialLinks
    footer: FooterSettings
    nav: NavigationItem[]
  } | null>(null)

  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [s, so, f, n] = await Promise.all([
          getSetting('global.site'),
          getSetting('global.social'),
          getSetting('global.footer'),
          getSetting('global.navigation'),
        ])
        const loaded = {
          site: s ?? defaultSite,
          social: so ?? defaultSocial,
          footer: f ?? defaultFooter,
          nav: n ?? defaultNav,
        }
        setSite(loaded.site)
        setSocial(loaded.social)
        setFooter(loaded.footer)
        setNav(loaded.nav)
        setOriginal(loaded)
      } catch {
        toast.error('Failed to load settings.')
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  const isDirty =
    JSON.stringify({ site, social, footer, nav }) !==
    JSON.stringify(original ?? { site: defaultSite, social: defaultSocial, footer: defaultFooter, nav: defaultNav })

  const handleSave = useCallback(async () => {
    setSaving(true)
    try {
      await Promise.all([
        upsertSetting('global.site', site),
        upsertSetting('global.social', social),
        upsertSetting('global.footer', footer),
        upsertSetting('global.navigation', nav),
      ])
      setOriginal({ site, social, footer, nav })
      toast.success('Global settings saved.')
    } catch {
      toast.error('Failed to save settings.')
    } finally {
      setSaving(false)
    }
  }, [site, social, footer, nav])

  const handleReset = useCallback(() => {
    if (original) {
      setSite(original.site)
      setSocial(original.social)
      setFooter(original.footer)
      setNav(original.nav)
    }
  }, [original])

  function updateNav(index: number, field: keyof NavigationItem, value: string) {
    setNav((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    )
  }

  if (loading) {
    return (
      <>
        <PageHeader title="Global Settings" />
        <div className="flex items-center justify-center p-20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#e5e7eb] border-t-[#1e1e23]" />
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader
        title="Global Settings"
        description="Settings that apply across all pages — site info, navigation, social links, and footer."
      />

      <div className="p-8 pb-32 space-y-6">
        {/* Maintenance Mode */}
        <Card className={site.maintenance_mode ? 'border-2 border-orange-400' : ''}>
          <CardHeader>
            <div>
              <CardTitle>🚧 Maintenance Mode</CardTitle>
              <CardDescription>
                When enabled, all visitors see an &ldquo;Under Construction&rdquo; page instead of the site.
                The admin panel is unaffected.
              </CardDescription>
            </div>
          </CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#111827]">
                {site.maintenance_mode ? 'Site is currently offline for visitors' : 'Site is live and visible to everyone'}
              </p>
              <p className="text-xs text-[#6b7280] mt-0.5">
                {site.maintenance_mode ? 'Disable to bring the site back online.' : 'Enable to take the site offline for maintenance.'}
              </p>
            </div>
            <Toggle
              checked={!!site.maintenance_mode}
              onChange={(checked) => setSite((s) => ({ ...s, maintenance_mode: checked }))}
              label=""
            />
          </div>
          {site.maintenance_mode && (
            <div className="mt-4 rounded-lg bg-orange-50 border border-orange-200 px-4 py-3 text-sm text-orange-800">
              ⚠️ Maintenance mode is <strong>ON</strong> — visitors cannot see the website right now.
            </div>
          )}
        </Card>

        {/* Site Info */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Site Information</CardTitle>
              <CardDescription>Basic site name and description.</CardDescription>
            </div>
          </CardHeader>
          <div className="grid gap-4">
            <Input
              label="Site name"
              value={site.name}
              onChange={(e) => setSite((s) => ({ ...s, name: e.target.value }))}
            />
            <Input
              label="Site description"
              value={site.description}
              onChange={(e) => setSite((s) => ({ ...s, description: e.target.value }))}
            />
          </div>
        </Card>

        {/* Navigation */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Navigation Menu</CardTitle>
              <CardDescription>The four menu items and their overlay colors when clicked.</CardDescription>
            </div>
          </CardHeader>
          <div className="space-y-4">
            {nav.map((item, index) => (
              <div key={index} className="rounded-lg border border-[#e5e7eb] p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">
                  Menu item {index + 1}
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    label="Label"
                    value={item.label}
                    onChange={(e) => updateNav(index, 'label', e.target.value)}
                  />
                  <Input
                    label="Link"
                    value={item.href}
                    onChange={(e) => updateNav(index, 'href', e.target.value)}
                  />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[#374151]">Overlay color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={item.overlay_bg_color}
                        onChange={(e) => updateNav(index, 'overlay_bg_color', e.target.value)}
                        className="h-9 w-9 cursor-pointer rounded-lg border border-[#d1d5db] p-0.5"
                      />
                      <input
                        type="text"
                        value={item.overlay_bg_color}
                        onChange={(e) => updateNav(index, 'overlay_bg_color', e.target.value)}
                        className="flex-1 rounded-lg border border-[#d1d5db] px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#1e1e23]"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[#374151]">Hover color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={item.text_hover_color}
                        onChange={(e) => updateNav(index, 'text_hover_color', e.target.value)}
                        className="h-9 w-9 cursor-pointer rounded-lg border border-[#d1d5db] p-0.5"
                      />
                      <input
                        type="text"
                        value={item.text_hover_color}
                        onChange={(e) => updateNav(index, 'text_hover_color', e.target.value)}
                        className="flex-1 rounded-lg border border-[#d1d5db] px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#1e1e23]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Social Links */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Social Links</CardTitle>
              <CardDescription>URLs for the social media links in the footer and contact page.</CardDescription>
            </div>
          </CardHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Instagram"
              type="url"
              placeholder="https://instagram.com/theruffagency"
              value={social.instagram}
              onChange={(e) => setSocial((s) => ({ ...s, instagram: e.target.value }))}
            />
            <Input
              label="LinkedIn"
              type="url"
              placeholder="https://linkedin.com/company/theruffagency"
              value={social.linkedin}
              onChange={(e) => setSocial((s) => ({ ...s, linkedin: e.target.value }))}
            />
            <Input
              label="TikTok"
              type="url"
              placeholder="https://tiktok.com/@theruffagency"
              value={social.tiktok}
              onChange={(e) => setSocial((s) => ({ ...s, tiktok: e.target.value }))}
            />
            <Input
              label="YouTube"
              type="url"
              placeholder="https://youtube.com/@theruffagency"
              value={social.youtube}
              onChange={(e) => setSocial((s) => ({ ...s, youtube: e.target.value }))}
            />
          </div>
        </Card>

        {/* Footer */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Footer</CardTitle>
              <CardDescription>Contact emails and copyright year shown in the footer.</CardDescription>
            </div>
          </CardHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="New business email"
              type="email"
              value={footer.new_business_email}
              onChange={(e) => setFooter((f) => ({ ...f, new_business_email: e.target.value }))}
            />
            <Input
              label="General enquiries email"
              type="email"
              value={footer.general_email}
              onChange={(e) => setFooter((f) => ({ ...f, general_email: e.target.value }))}
            />
            <Input
              label="Copyright year"
              type="number"
              value={footer.copyright_year}
              onChange={(e) => setFooter((f) => ({ ...f, copyright_year: parseInt(e.target.value) || 2026 }))}
            />
          </div>
        </Card>
      </div>

      <SaveBar isDirty={isDirty} saving={saving} onSave={() => void handleSave()} onReset={handleReset} />
    </>
  )
}
