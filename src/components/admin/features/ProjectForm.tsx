'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Card, { CardHeader, CardTitle } from '@/components/admin/ui/Card'
import Input from '@/components/admin/ui/Input'
import Textarea from '@/components/admin/ui/Textarea'
import Button from '@/components/admin/ui/Button'
import Toggle from '@/components/admin/ui/Toggle'
import ImageUpload from '@/components/admin/ui/ImageUpload'
import BlockBuilder from '@/components/admin/features/blocks/BlockBuilder'
import { upsertProjectAction } from '@/app/admin/actions'
import type { Project } from '@/types/admin-cms.types'
import type { AdminBlock } from '@/components/admin/features/blocks/types'

const CATEGORIES = [
  { value: 'featured', label: 'Featured' },
  { value: 'ads',      label: 'Ads & Explainers' },
  { value: 'design',   label: 'Design' },
  { value: 'brand',    label: 'Brand Systems' },
  { value: 'mascots',  label: 'Mascots' },
  { value: '3d',       label: '3D' },
  { value: 'studio',   label: 'Studio' },
]

type ProjectFormData = Omit<Project, 'id' | 'created_at' | 'updated_at'>

interface ProjectFormProps {
  initial?: Project
}

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function buildInitialForm(initial?: Project): ProjectFormData {
  return {
    slug:        initial?.slug        ?? '',
    title:       initial?.title       ?? '',
    client:      initial?.client      ?? '',
    description: initial?.description ?? '',
    bg_color:    initial?.bg_color    ?? '#ffffff',
    image_url:   initial?.image_url   ?? '',
    href:        initial?.href        ?? '',
    categories:  initial?.categories  ?? [],
    is_featured: initial?.is_featured ?? false,
    sort_order:  initial?.sort_order  ?? 0,
    published:   initial?.published   ?? true,
  }
}

export default function ProjectForm({ initial }: ProjectFormProps) {
  const router   = useRouter()
  const isEditing = !!initial

  const [form,    setForm]    = useState<ProjectFormData>(() => buildInitialForm(initial))
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [blocks,  setBlocks]  = useState<AdminBlock[]>(() => (initial as any)?.content ?? [])
  const [saving,  setSaving]  = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  // Track saved so beforeunload doesn't fire after a successful save + redirect
  const justSaved = useRef(false)

  // Warn browser tab close / refresh when dirty
  useEffect(() => {
    function onBeforeUnload(e: BeforeUnloadEvent) {
      if (isDirty && !justSaved.current) e.preventDefault()
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [isDirty])

  // ── helpers ────────────────────────────────────────────────

  function markDirty() { setIsDirty(true) }

  function update<K extends keyof ProjectFormData>(key: K, value: ProjectFormData[K]) {
    setForm(f => ({ ...f, [key]: value }))
    markDirty()
  }

  function toggleCategory(cat: string) {
    setForm(f => ({
      ...f,
      categories: f.categories.includes(cat)
        ? f.categories.filter(c => c !== cat)
        : [...f.categories, cat],
    }))
    markDirty()
  }

  function handleBlocksChange(b: AdminBlock[]) {
    setBlocks(b)
    markDirty()
  }

  function handleDiscard() {
    if (!confirm('Discard all changes?')) return
    setForm(buildInitialForm(initial))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setBlocks((initial as any)?.content ?? [])
    setIsDirty(false)
  }

  function handleCancel() {
    if (isDirty && !confirm('You have unsaved changes. Leave without saving?')) return
    router.push('/admin/projects')
  }

  // ── save ───────────────────────────────────────────────────
  // Plain async function — always reads latest form + blocks, no stale closure risk.

  async function handleSave() {
    if (!form.title.trim())  { toast.error('Title is required.');  return }
    if (!form.client.trim()) { toast.error('Client is required.'); return }

    const slug = form.slug.trim() || slugify(form.title)
    setSaving(true)

    try {
      const payload = {
        ...form,
        slug,
        content: blocks,
        ...(isEditing && initial ? { id: initial.id } : {}),
      }

      await upsertProjectAction(payload)

      toast.success(isEditing ? 'Project updated.' : 'Project created.')
      justSaved.current = true
      setIsDirty(false)
      router.push('/admin/projects')
      router.refresh()
    } catch (err) {
      console.error('[ProjectForm] save error:', err)
      toast.error('Failed to save project. Check the console for details.')
    } finally {
      setSaving(false)
    }
  }

  // Intercept the form submit event (covers keyboard Enter + submit buttons)
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    void handleSave()
  }

  // ── render ─────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit} className="relative">

      {/* ── Sticky unsaved changes bar ──────────────────────── */}
      {isDirty && (
        <div className="sticky top-0 z-40 flex items-center justify-between gap-4 bg-[#1e1e23] text-white px-8 py-3 shadow-lg">
          <p className="text-sm font-medium">Unsaved changes</p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleDiscard}
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              Discard
            </button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              loading={saving}
              onClick={() => void handleSave()}
              className="!bg-white !text-[#1e1e23] hover:!bg-white/90"
            >
              Save changes
            </Button>
          </div>
        </div>
      )}

      <div className="p-8 pb-20 space-y-6">

        {/* ── Project Details ───────────────────────────────── */}
        <Card>
          <CardHeader><div><CardTitle>Project Details</CardTitle></div></CardHeader>
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Title"
                value={form.title}
                onChange={e => {
                  const title   = e.target.value
                  const newSlug = slugify(title)
                  update('title', title)
                  if (!form.slug || form.slug === slugify(form.title)) {
                    update('slug', newSlug)
                    if (!form.href || form.href.startsWith('/work/')) {
                      update('href', `/work/${newSlug}`)
                    }
                  }
                }}
                required
              />
              <Input
                label="Client name"
                value={form.client}
                onChange={e => update('client', e.target.value)}
                required
              />
            </div>

            <Input
              label="Slug (URL identifier)"
              value={form.slug}
              onChange={e => {
                update('slug', e.target.value)
                if (!form.href || form.href.startsWith('/work/')) {
                  update('href', `/work/${e.target.value}`)
                }
              }}
              hint='Auto-generated from title. e.g. "lego-build-day"'
            />

            <Textarea
              label="Card description"
              value={form.description ?? ''}
              onChange={e => update('description', e.target.value)}
              rows={2}
              hint="Shown on hover on project cards."
            />

            <Input
              label="Link (href)"
              value={form.href ?? ''}
              onChange={e => update('href', e.target.value)}
              hint="Auto-generated from slug. Override only if needed."
            />
          </div>
        </Card>

        {/* ── Image & Color ─────────────────────────────────── */}
        <Card>
          <CardHeader><div><CardTitle>Image &amp; Color</CardTitle></div></CardHeader>
          <div className="grid gap-6">
            <ImageUpload
              label="Project image"
              value={form.image_url ?? ''}
              onChange={v => update('image_url', v)}
              hint="Shown as the card thumbnail. 3:2 crop recommended."
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#374151]">Card background color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.bg_color}
                  onChange={e => update('bg_color', e.target.value)}
                  className="h-9 w-9 cursor-pointer rounded-lg border border-[#d1d5db] p-0.5"
                />
                <input
                  type="text"
                  value={form.bg_color}
                  onChange={e => update('bg_color', e.target.value)}
                  className="flex-1 rounded-lg border border-[#d1d5db] px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#1e1e23]"
                />
                <div className="h-9 w-9 rounded-lg border border-[#d1d5db]" style={{ backgroundColor: form.bg_color }} />
              </div>
            </div>
          </div>
        </Card>

        {/* ── Categories ────────────────────────────────────── */}
        <Card>
          <CardHeader><div><CardTitle>Categories</CardTitle></div></CardHeader>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => toggleCategory(value)}
                className={[
                  'rounded-full border px-3 py-1 text-sm font-medium transition-colors',
                  form.categories.includes(value)
                    ? 'border-[#1e1e23] bg-[#1e1e23] text-white'
                    : 'border-[#d1d5db] bg-white text-[#374151] hover:border-[#9ca3af]',
                ].join(' ')}
              >
                {label}
              </button>
            ))}
          </div>
        </Card>

        {/* ── Display Settings ──────────────────────────────── */}
        <Card>
          <CardHeader><div><CardTitle>Display Settings</CardTitle></div></CardHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Sort order"
              type="number"
              value={form.sort_order}
              onChange={e => update('sort_order', parseInt(e.target.value) || 0)}
              hint="Lower numbers appear first."
            />
            <div className="flex flex-col gap-4 pt-6">
              <Toggle
                checked={form.is_featured}
                onChange={v => update('is_featured', v)}
                label="Featured (shown first on home page)"
              />
              <Toggle
                checked={form.published}
                onChange={v => update('published', v)}
                label="Published (visible on website)"
              />
            </div>
          </div>
        </Card>

        {/* ── Page Content Blocks ───────────────────────────── */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Page Content</CardTitle>
              <p className="text-sm text-[#6b7280] mt-1">
                Build the project detail page by stacking blocks. Shown when visitors click into the project.
              </p>
            </div>
          </CardHeader>
          <BlockBuilder blocks={blocks} onChange={handleBlocksChange} />
        </Card>

        {/* ── Actions ───────────────────────────────────────── */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            type="button"
            variant="primary"
            size="lg"
            loading={saving}
            onClick={() => void handleSave()}
          >
            {isEditing ? 'Save changes' : 'Create project'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="lg"
            onClick={handleCancel}
            disabled={saving}
          >
            Cancel
          </Button>
        </div>

      </div>
    </form>
  )
}
