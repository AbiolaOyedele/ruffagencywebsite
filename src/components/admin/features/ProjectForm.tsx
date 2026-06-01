'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Card, { CardHeader, CardTitle } from '@/components/admin/ui/Card'
import Input from '@/components/admin/ui/Input'
import Textarea from '@/components/admin/ui/Textarea'
import Button from '@/components/admin/ui/Button'
import Toggle from '@/components/admin/ui/Toggle'
import ImageUpload from '@/components/admin/ui/ImageUpload'
import { upsertProjectAction } from '@/app/admin/actions'
import type { Project } from '@/types/admin-cms.types'

const CATEGORIES = [
  { value: 'featured', label: 'Featured' },
  { value: 'ads', label: 'Ads & Explainers' },
  { value: 'design', label: 'Design' },
  { value: 'brand', label: 'Brand Systems' },
  { value: 'mascots', label: 'Mascots' },
  { value: '3d', label: '3D' },
  { value: 'studio', label: 'Studio' },
]

type ProjectFormData = Omit<Project, 'id' | 'created_at' | 'updated_at'>

interface ProjectFormProps {
  initial?: Project
}

export default function ProjectForm({ initial }: ProjectFormProps) {
  const router = useRouter()
  const isEditing = !!initial

  const [form, setForm] = useState<ProjectFormData>({
    slug: initial?.slug ?? '',
    title: initial?.title ?? '',
    client: initial?.client ?? '',
    description: initial?.description ?? '',
    bg_color: initial?.bg_color ?? '#ffffff',
    image_url: initial?.image_url ?? '',
    href: initial?.href ?? '',
    categories: initial?.categories ?? [],
    is_featured: initial?.is_featured ?? false,
    sort_order: initial?.sort_order ?? 0,
    published: initial?.published ?? true,
  })

  const [saving, setSaving] = useState(false)

  function update<K extends keyof ProjectFormData>(key: K, value: ProjectFormData[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function toggleCategory(cat: string) {
    setForm((f) => ({
      ...f,
      categories: f.categories.includes(cat)
        ? f.categories.filter((c) => c !== cat)
        : [...f.categories, cat],
    }))
  }

  function slugify(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      if (!form.title.trim()) {
        toast.error('Title is required.')
        return
      }
      if (!form.client.trim()) {
        toast.error('Client is required.')
        return
      }

      const slug = form.slug.trim() || slugify(form.title)
      setSaving(true)

      try {
        if (isEditing && initial) {
          await upsertProjectAction({ id: initial.id, ...form, slug })
          toast.success('Project updated.')
        } else {
          await upsertProjectAction({ ...form, slug })
          toast.success('Project created.')
        }
        router.push('/admin/projects')
        router.refresh()
      } catch {
        toast.error('Failed to save project.')
      } finally {
        setSaving(false)
      }
    },
    [form, isEditing, initial, router]
  )

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="p-8 pb-20 space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader><div><CardTitle>Project Details</CardTitle></div></CardHeader>
        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Title"
              value={form.title}
              onChange={(e) => {
                update('title', e.target.value)
                if (!form.slug || form.slug === slugify(form.title)) {
                  update('slug', slugify(e.target.value))
                }
              }}
              required
            />
            <Input
              label="Client name"
              value={form.client}
              onChange={(e) => update('client', e.target.value)}
              required
            />
          </div>
          <Input
            label="Slug (URL identifier)"
            value={form.slug}
            onChange={(e) => update('slug', e.target.value)}
            hint='Auto-generated from title. Used for filtering. e.g. "lego-build-day"'
          />
          <Textarea
            label="Card description"
            value={form.description ?? ''}
            onChange={(e) => update('description', e.target.value)}
            rows={2}
            hint="Shown on hover on project cards."
          />
          <Input
            label="Link (href)"
            value={form.href ?? ''}
            onChange={(e) => update('href', e.target.value)}
            hint='e.g. "/work/lego-build-day.html"'
          />
        </div>
      </Card>

      {/* Image & Color */}
      <Card>
        <CardHeader><div><CardTitle>Image &amp; Color</CardTitle></div></CardHeader>
        <div className="grid gap-6">
          <ImageUpload
            label="Project image"
            value={form.image_url ?? ''}
            onChange={(v) => update('image_url', v)}
            hint="Shown as the card background/fill. 3:2 crop recommended."
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#374151]">Card background color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={form.bg_color}
                onChange={(e) => update('bg_color', e.target.value)}
                className="h-9 w-9 cursor-pointer rounded-lg border border-[#d1d5db] p-0.5"
              />
              <input
                type="text"
                value={form.bg_color}
                onChange={(e) => update('bg_color', e.target.value)}
                className="flex-1 rounded-lg border border-[#d1d5db] px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#1e1e23]"
              />
              <div
                className="h-9 w-9 rounded-lg border border-[#d1d5db]"
                style={{ backgroundColor: form.bg_color }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Categories */}
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

      {/* Settings */}
      <Card>
        <CardHeader><div><CardTitle>Display Settings</CardTitle></div></CardHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Sort order"
            type="number"
            value={form.sort_order}
            onChange={(e) => update('sort_order', parseInt(e.target.value) || 0)}
            hint="Lower numbers appear first."
          />
          <div className="flex flex-col gap-4 pt-6">
            <Toggle
              checked={form.is_featured}
              onChange={(v) => update('is_featured', v)}
              label="Featured (shown first on home page)"
            />
            <Toggle
              checked={form.published}
              onChange={(v) => update('published', v)}
              label="Published (visible on website)"
            />
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button type="submit" variant="primary" size="lg" loading={saving}>
          {isEditing ? 'Save changes' : 'Create project'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="lg"
          onClick={() => router.push('/projects')}
          disabled={saving}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
